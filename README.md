# Tool Chấm Bài Tiếng Anh Tự Động

## Quick Start - Deploy lên Vercel

### Bước 1: Clone repo (hoặc tạo GitHub repo mới)

```bash
# Nếu chưa có GitHub repo:
git init
git add .
git commit -m "Initial commit"
```

Rồi push lên GitHub repo của anh.

### Bước 2: Tạo Vercel Project

1. Vào https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Chọn GitHub repo (repo của anh)
4. Vercel sẽ scan và tự nhận ra là project Next.js/Node

### Bước 3: Set Environment Variables

Trong Vercel dashboard → Project Settings → Environment Variables

Thêm 4 biến:

```
GEMINI_API_KEY = [Anh sẽ thêm ở Vercel settings]
ANTHROPIC_API_KEY = [Anh sẽ thêm ở Vercel settings]
GOOGLE_SHEET_ID = 11vr7poWqtUldOT8_6HL7vkWnjnhIDwiVWHDCkZJJq7o
GOOGLE_SERVICE_ACCOUNT_KEY = {JSON stringify của file credentials}
```

### Bước 4: Deploy

Vercel tự deploy khi anh push lên GitHub.

Sau khi xong, Vercel sẽ cấp cho anh URL kiểu: `https://cham-bai.vercel.app`

## API Endpoints

### POST /api/gemini

Upload ảnh phiếu trả lời → Gemini đọc → trả JSON

**Request:**
```json
{
  "imageBase64": "base64 data của ảnh",
  "testId": "test_123456"
}
```

**Response:**
```json
{
  "multipleChoice": {"Q1": "A", "Q2": "B"},
  "fillIn": {"Q11": "answer", "Q12": "phrase"}
}
```

## Cấu trúc Project

```
cham-bai-project/
├── api/
│   └── gemini.js          # Serverless function
├── public/                # Static files (sau này)
├── package.json
├── vercel.json            # Config Vercel
├── .gitignore
└── README.md
```

## Local Development

```bash
npm install
npx vercel dev
```

Server sẽ chạy ở http://localhost:3000
