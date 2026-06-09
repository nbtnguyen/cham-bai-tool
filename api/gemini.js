import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // images: array of base64 strings. mode: 'answerkey' | 'grading'
    const { images, mode } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

    let instruction;
    if (mode === 'answerkey') {
      instruction = `These images show an ANSWER KEY table for a multiple-choice English test (format like "1.D 2.B 3.A ..." in a grid).
Extract every answer. Return ONLY valid JSON, no markdown, no extra text:
{"answers": {"1": "A", "2": "B", "3": "C", ...}}
Use the question number as the key and the letter (A/B/C/D) as the value. Include all questions you can see across all images.`;
    } else {
      instruction = `These images are pages of an English multiple-choice exam where a STUDENT has CIRCLED their chosen answer directly on the exam paper.
For each question, identify which option (A/B/C/D) the student circled.
IMPORTANT RULES:
- Only count the option that is clearly CIRCLED as the student's answer.
- IGNORE any X marks, cross-outs, or scribbles - those are NOT answers, they are the student crossing things out.
- If a student crossed out one circle and circled another, take the final circled one.
- If you genuinely cannot tell, use "?" for that question.
Return ONLY valid JSON, no markdown, no extra text:
{"answers": {"1": "A", "2": "B", ...}}
Include all question numbers you can find across all the images.`;
    }

    const parts = [{ text: instruction }];
    for (const img of images) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: img } });
    }

    const models = ['gemini-2.5-flash', 'gemini-2.0-flash'];
    let response;
    let lastError;
    for (const model of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              contents: [{ parts }],
              generationConfig: { temperature: 0.1, topK: 10, topP: 0.95, maxOutputTokens: 2048, thinkingConfig: { thinkingBudget: 0 } }
            },
            { timeout: 50000 }
          );
          break;
        } catch (err) {
          lastError = err;
          const status = err.response?.data?.error?.code;
          if (status === 503 || status === 429) {
            if (attempt === 0) await new Promise(r => setTimeout(r, 2000));
            continue;
          }
          throw err;
        }
      }
      if (response) break;
    }
    if (!response) throw lastError;

    const textContent = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) return res.status(500).json({ error: 'No response from Gemini' });

    let jsonResult;
    try {
      const cleaned = textContent.replace(/```json\n?|\n?```/g, '').trim();
      jsonResult = JSON.parse(cleaned);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse Gemini response', raw: textContent });
    }

    return res.status(200).json(jsonResult);
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Internal server error',
      details: error.response?.data || null
    });
  }
}
