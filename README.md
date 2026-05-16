# MyLibrary — 節錄重點搜尋

從 Notion 閱讀紀錄資料庫讀取所有節錄重點，提供關鍵字搜尋。

## 部署步驟

### 1. 上傳到 GitHub
1. 到 [github.com](https://github.com) → New repository
2. 名稱：`mylibrary`，Visibility：**Private**
3. 建立後，按照頁面上的指示把這個資料夾上傳上去：
   ```bash
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/你的帳號/mylibrary.git
   git push -u origin main
   ```

### 2. 部署到 Vercel
1. 到 [vercel.com](https://vercel.com) → Import Project → 選 GitHub → 選 `mylibrary`
2. Framework Preset 選 **Next.js**
3. 展開 **Environment Variables**，加入：
   - `NOTION_TOKEN` = `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`
   - `NOTION_DB_ID` = `3d19e1b0dca04f7e9cdf62846b729013`
4. 按 Deploy

完成後會得到一個 `https://mylibrary-xxx.vercel.app` 網址。

### 3. 加到手機主畫面
**iOS**：Safari 開啟網址 → 分享 → 加入主畫面  
**Android**：Chrome 開啟網址 → 選單 → 加到主畫面

## 更新資料
Notion 更新後，資料會在 **10 分鐘內**自動同步（Next.js cache revalidation）。  
想要立即更新：Vercel 後台 → Deployments → Redeploy。
