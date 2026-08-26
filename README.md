# 📋 面試追蹤系統

一個幫助你記錄、追蹤和分析面試進度的網站。支持搜尋、篩選、下載備份，並與 Google Sheet 完全同步。

## ✨ 功能

- 📝 新增/編輯/刪除面試記錄
- 🔍 搜尋和篩選功能
- 📊 統計分析（成功率、總投遞數等）
- 📥 下載為 CSV 格式
- 🔄 與 Google Sheet 實時同步
- 📱 響應式設計，支持手機和桌面

## 📋 必要準備

在部署前，請完成以下 Google 端的設置：

### 1️⃣ 建立 Google Apps Script（用於寫入數據）

1. 打開你的 Google Sheet
2. 選單 **「擴充功能」→「Apps Script」**
3. 清空所有代碼，複製貼上以下代碼：

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.company_name,
      data.job_title,
      data.address,
      data.source,
      data.work_time,
      data.holiday,
      data.salary,
      data.job_description,
      data.interview_date,
      data.interview_round,
      data.interview_type,
      data.interview_review,
      data.interview_result,
      data.status,
      data.reply_date,
      data.notes
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: e.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. 按 **「部署」→「新部署」**
5. 選擇類型：**「Web 應用」**
6. 執行身份：選擇「你的 Google 帳號」
7. 存取權限：選擇「任何人」
8. 按 **「部署」**
9. ⭐ **複製部署後的 URL** 格式如：`https://script.google.com/macros/s/[ID]/dev`

### 2️⃣ 取得 Google Sheets API Key

1. 進入 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案（名稱隨意）
3. 搜尋並啟用 **「Google Sheets API」**
4. 左側選 **「認證」→「建立認證」→「API Key」**
5. ⭐ **複製你的 API Key**（格式如：`AIza...`）

### 3️⃣ 確認你的 Google Sheet ID

從 URL 複製 Sheet ID：
```
https://docs.google.com/spreadsheets/d/[這是 Sheet ID]/edit
```

⭐ **複製 Sheet ID**

### 4️⃣ 分享你的 Google Sheet

1. 點右上角 **「分享」**
2. 改為 **「任何有連結的人」都可以「檢視」**

## 🚀 本地部署（開發）

### 步驟 1：複製配置檔案

```bash
cp config.example.js config.js
```

### 步驟 2：編輯 config.js

用編輯器打開 `config.js`，填入你的信息：

```javascript
const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/dev',
    SHEETS_API_KEY: 'YOUR_API_KEY',
    SHEET_ID: 'YOUR_SHEET_ID'
};
```

### 步驟 3：本地測試

直接用瀏覽器打開 `index.html` 檔案，或用簡單的 HTTP 伺服器：

```bash
# 使用 Python（已內置）
python3 -m http.server 8000
# 然後訪問 http://localhost:8000
```

## 📦 部署到 Vercel

### 步驟 1：推送到 GitHub

```bash
# 初始化 Git 倉庫（如果還沒有）
git init
git add .
git commit -m "初始化面試追蹤系統"

# 添加遠端倉庫（替換為你的倉庫 URL）
git remote add origin https://github.com/YOUR_USERNAME/interview-tracking.git
git branch -M main
git push -u origin main
```

### 步驟 2：在 Vercel 中部署

1. 進入 [Vercel 官網](https://vercel.com)
2. 登入 GitHub 帳號
3. 點 **「New Project」→「Import Git Repository」**
4. 選擇你的 `interview-tracking` 倉庫
5. 按 **「Import」**

### 步驟 3：設置環境變數（Vercel 儀表板）

1. 進入你的 Vercel 專案設定
2. 找到 **「Environment Variables」**
3. 添加以下變數：

| Key | Value |
|-----|-------|
| `SHEETS_API_KEY` | 你的 API Key |
| `SHEET_ID` | 你的 Sheet ID |

### 步驟 4：部署時注入配置

由於 Vercel 環境變數對靜態 HTML 不可見，有兩種方案：

**方案 A：本地配置（推薦）**
- 在本地編輯 `config.js`
- 將 `config.js` 提交到 Git（移除 `.gitignore` 中的 `config.js` 行）
- 推送後 Vercel 自動部署

**方案 B：使用 Vercel Serverless Functions**
- 創建 `api/config.js` 檔案
- 讓前端通過 API 端點讀取配置

我們使用方案 A（更簡單）。

### 步驟 5：完成

Vercel 會自動部署，你會得到一個 URL：
```
https://your-project.vercel.app
```

## 🔒 安全提示

⚠️ **不要**在 GitHub 上提交包含真實 API Key 和 Sheet ID 的 `config.js`

確保 `.gitignore` 包含 `config.js`。如果需要在 Vercel 上部署，有兩個選項：

1. **方案 A**：在 Vercel 部署前，在本地機器上編輯 `config.js`
2. **方案 B**：使用 Vercel CLI 在部署時設置環境變數

## 🆘 故障排除

### 問題：無法連接 Google Sheet

檢查：
- [ ] Google Sheet 已分享為「任何有連結的人可查看」
- [ ] Sheets API Key 正確
- [ ] Sheet ID 正確
- [ ] 檢查瀏覽器控制台錯誤（F12）

### 問題：新增記錄失敗

檢查：
- [ ] Apps Script 部署 URL 正確
- [ ] Apps Script 中的 `doPost` 函數已定義
- [ ] 確認 Google Sheet 的第一個 Sheet 名稱為「面試追蹤」

### 問題：本地無法看到表格

- 確保 `config.js` 中的信息正確填寫
- 檢查瀏覽器控制台是否有錯誤

## 📝 Column 字段說明

你的 Google Sheet 應該有以下列（按順序）：

1. 公司名稱
2. 職位名稱
3. 地址
4. 招聘來源
5. 上班時間
6. 休假制度
7. 薪水
8. 工作內容
9. 面試日期
10. 面試輪數
11. 面試類型
12. 面試評價
13. 面試結果
14. 目前狀態
15. 回覆日期
16. 備註

Sheet 名稱必須是 **「面試追蹤」**

## 📞 支持

有問題？檢查：
1. 瀏覽器控制台錯誤（F12 → Console）
2. Vercel 部署日誌
3. Google Cloud 配額使用情況

## 📄 授權

MIT License
