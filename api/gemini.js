import axios from 'axios';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, testId } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Call Gemini Vision API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are an English test answer sheet reader. Extract all answers from this answer sheet image and return ONLY valid JSON (no markdown, no explanations, no extra text).

Return this exact JSON structure:
{
  "multipleChoice": {"Q1": "A", "Q2": "B", ...},
  "fillIn": {"Q11": "word", "Q12": "phrase", ...},
  "raw": "raw extracted text from image"
}

Rules:
- For multiple choice: extract letter (A/B/C/D)
- For fill-in: extract the written word/phrase exactly as written
- Use Q1, Q2, etc for question numbers
- If you can't read something, skip it or mark as "unclear"`
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          topK: 10,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      }
    );

    const textContent = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) {
      return res.status(500).json({ error: 'No response from Gemini' });
    }

    // Parse JSON from response
    let jsonResult;
    try {
      // Clean response - remove markdown code blocks if present
      const cleaned = textContent.replace(/```json\n?|\n?```/g, '').trim();
      jsonResult = JSON.parse(cleaned);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse Gemini response', raw: textContent });
    }

    return res.status(200).json(jsonResult);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: error.response?.data || null
    });
  }
}
