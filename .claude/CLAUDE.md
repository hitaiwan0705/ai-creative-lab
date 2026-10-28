# ai-creative-lab 專案規則

高中生體驗營／微課程的互動教學網站：純靜態、可離線、不用 CDN、不追蹤、不存個資（見 `docs/README.md`）。所有回覆與產出以繁體中文為主。

## 已安裝的 skills 與 agents

來源、授權與版本見 `.claude/SOURCES.md`。

| 名稱 | 類型 | 用在 |
|---|---|---|
| `diagram-design` | skill | 流程圖、旅程地圖、服務藍圖、四象限、魚骨圖等教學圖表 |
| `taste-skill` | skill | 新的課程介紹頁、任務頁的美術方向與自我檢查 |
| `product-image-teardown` | skill（原創） | 產品意象拆解圖：部件 → 設計元素 → 意象，標註觀察／推論／數據與通用設計原則 |
| `inclusive-visuals-specialist` | agent | AI 生圖 prompt 的偏見與刻板印象檢查（ai-image-lab） |
| `persona-walkthrough` | agent | 以指定人物視角走查頁面（輸出僅為假設） |
| `ux-researcher` | agent | 研究規劃、可用性測試設計 |
| `visual-storyteller` | agent | 視覺敘事、分鏡 |

## 使用這些工具時必守的規則

1. **不連外部資源**：產出的頁面與圖表不得引用 Google Fonts、CDN 或外部圖片網址。
   - `diagram-design` 已設為 `Font source: system`；中文字串用 `'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif` 字體堆疊。完成後執行 `python3 .claude/skills/diagram-design/scripts/self_check.py --offline <檔案>`。
   - `taste-skill` 找到的圖片要下載進該課程的 `images/` 資料夾，並把作者、授權、出處寫進同資料夾的 `sources.txt`。
2. **沿用既有 CIS，不要另訂美術方向**：
   - `ai-image-lab/`：紙底 `#FAFAF7`、Cobalt `#2148B8`、Terracotta `#C65F38`（文字用 `#A84A28`）、墨色 `#30343A`；思源黑體。
   - 根目錄體驗營頁面：深藍墨 `#1c2541`、暖橘 `#e07a3f`、米白 `#f7f5f1`。
   - `taste-skill` 一律加 `--keep palette,type`；`diagram-design` 首次詢問品牌時，用上面對應的色票。
3. **無障礙**：文字對比符合 WCAG 2.1 AA；圖表不可只靠顏色區分資訊；SVG 要有 `<title>`／`aria-label`。
4. **模擬使用者不等於真實使用者**：`persona-walkthrough`、`ux-researcher` 的模擬結果一律標示為「待驗證假設」，並列出需要找哪些真實使用者驗證。
5. **不處理學生肖像**：任何 skill 都不得上傳、生成或保存真實學生的照片。
