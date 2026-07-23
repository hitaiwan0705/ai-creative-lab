# 部署說明：GitHub Pages

本專案為純靜態網站，無建置流程，可直接部署到 GitHub Pages。

## 步驟

1. 將 `ai-creative-lab/` 目錄的內容推送到一個 GitHub Repository（可為新建的 repo，
   或現有 repo 的子目錄）。

   ```bash
   cd ai-creative-lab
   git init
   git add .
   git commit -m "AI 文創實驗室：初版網站"
   git branch -M main
   git remote add origin https://github.com/<your-account>/<your-repo>.git
   git push -u origin main
   ```

2. 到 GitHub Repository 頁面 → **Settings → Pages**。

3. 在 **Build and deployment** 設定：
   - Source：`Deploy from a branch`
   - Branch：`main`／`(root)`（若網站檔案放在 repo 根目錄）

4. 儲存後等待約 1–2 分鐘，GitHub 會提供網址，格式通常為：

   ```
   https://<your-account>.github.io/<your-repo>/
   ```

5. 確認可正常開啟 `index.html`、`teacher.html`、`student.html`、`print.html`，
   且所有連結、圖示與樣式皆正常載入（本專案皆使用相對路徑，部署到子路徑也不會壞掉）。

## 注意事項

- 本站不需要任何環境變數或 API Key，`Settings → Pages` 之外不需要額外設定。
- 若學校網路會封鎖 GitHub Pages，仍可退回「本機開啟 `index.html`」或「本機簡易伺服器」
  兩種離線／半離線方式（見 [README.md](README.md)）。
- 若之後要更新內容（例如修改輪盤資料、文案），直接修改對應檔案後 `git push`，
  GitHub Pages 會自動重新部署，不需其他建置指令。
- 若要部署到自訂網域，可在 repo 新增 `CNAME` 檔案並依 GitHub 官方文件設定 DNS，
  本專案程式碼不需為此另外調整。
