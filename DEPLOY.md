# Deploy Vercel - Hướng Dẫn Chi Tiết

## 📋 Điều kiện:
- Anh đã cài Node.js ✅
- Anh có tài khoản GitHub ✅
- Anh có tài khoản Vercel (sign up bằng GitHub) ✅

---

## 🔧 Bước 1: Chuẩn bị Code Trên Máy

### 1a. Copy các files từ outputs vào folder project
```bash
# Trên máy local của anh, tạo folder project:
mkdir ~/cham-bai-project
cd ~/cham-bai-project

# Copy các files em tạo vào:
# - package.json
# - vercel.json  
# - .gitignore
# - README.md
# - api/gemini.js
```

### 1b. Cài dependencies
```bash
npm install
```

---

## 🌐 Bước 2: Upload lên GitHub

### 2a. Tạo GitHub Repository
1. Vào https://github.com/new
2. Tên repo: `cham-bai-tool` (hoặc tên gì anh thích)
3. Description: "Tool chấm bài tiếng Anh tự động"
4. Public hoặc Private tùy ý
5. Click "Create repository"

### 2b. Push code lên GitHub
```bash
cd ~/cham-bai-project

# Khởi tạo git
git init
git add .
git commit -m "Initial commit - Phase 2 API"

# Link với GitHub repo (thay USERNAME và REPO_NAME)
git remote add origin https://github.com/USERNAME/cham-bai-tool.git
git branch -M main
git push -u origin main
```

---

## ⚡ Bước 3: Deploy trên Vercel

### 3a. Tạo Vercel Project
1. Vào https://vercel.com/dashboard
2. Click **"Add New..." → "Project"**
3. Chọn **"Import Git Repository"**
4. Tìm repo `cham-bai-tool` → click **"Import"**
5. Vercel sẽ hiển thị cấu hình project → click **"Deploy"**
   - (Có thể bỏ qua bước Build Settings - Vercel tự nhận)

### 3b. Chờ deploy xong
- Vercel sẽ show log deploy
- Khi xong, sẽ hiện "✓ Deployment successful"
- Vercel cấp URL kiểu: `https://cham-bai-tool.vercel.app`

### 3c. Set Environment Variables
1. Vào Vercel Dashboard → Project `cham-bai-tool`
2. Tab **"Settings"** → **"Environment Variables"**
3. Thêm 4 biến (COPY ĐÚNG VALUE):

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | [Anh sẽ thêm ở đây] |
| `ANTHROPIC_API_KEY` | [Anh sẽ thêm ở đây] |
| `GOOGLE_SHEET_ID` | [Anh sẽ thêm ở đây] |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | [Anh sẽ thêm ở đây] |

**Cách stringify GOOGLE_SERVICE_ACCOUNT_KEY:**
- Mở file credentials JSON
- Copy toàn bộ content
- Dán vào công cụ stringify JSON (https://jsoncrack.com/editor hoặc https://beautifier.io)
- Copy chuỗi đã stringify

4. Click **"Save"** → Vercel tự redeploy

---

## ✅ Bước 4: Test API

Mở browser → truy cập:
```
https://cham-bai-tool.vercel.app/api/gemini
```

Nếu hiển thị `{"error":"..."}` là API hoạt động ✅

---

## 📱 Bước 5: Update Artifact Phase 2

Sau khi deploy xong, em sẽ update artifact Phase 1 để:
- Thêm tab "Upload phiếu"
- Gọi endpoint `/api/gemini` của anh
- Hiển thị kết quả

URL Vercel của anh: `https://cham-bai-tool.vercel.app`

---

## 🚨 Troubleshoot

**Lỗi 401/403 khi gọi API?**
- Kiểm tra lại Environment Variables có đúng không
- Thử xóa variable → thêm lại

**Lỗi 500 từ Gemini?**
- Check GEMINI_API_KEY có hợp lệ không
- Log deploy: Vercel Dashboard → Deployments → click vào deploy → xem "Function Logs"

**Lỗi "Cannot find module"?**
- Chạy `npm install` lại
- Commit + push lên GitHub
- Vercel sẽ redeploy tự động

---

## 🎉 Xong!

Sau khi deploy thành công, báo em URL Vercel:
```
https://cham-bai-tool.vercel.app
```

Em sẽ update artifact Phase 2 để thêm tab "Upload phiếu" + test thử.
