# AI 形象實驗室：試試不同版本的自己

高中生微課程（60 分鐘）互動教學網站｜中國文化大學資訊傳播學系

- `index.html` 課程介紹
- `slides.html` 投影上課（18 頁）
- `student.html` 學生手機任務頁（Prompt 產生器、一鍵複製）

## 投影操作
| 鍵 | 功能 |
|---|---|
| ← → ／ 空白鍵 | 翻頁（手機可左右滑） |
| N | 教師講稿 |
| T | 全場計時（超過該段建議時間會變色） |
| O | 總覽跳頁 |
| F | 全螢幕 |

網址加 `#12` 可直接跳到第 12 頁。

## 圖片
見 `images/README.md`。

## 視覺
mono-color CIS：Neutral White 紙底＋Cobalt（冷）／Terracotta（暖）雙墨；思源黑體。文字對比皆符合 WCAG 2.1 AA。

## 第二堂（10/20）：AI 資訊實驗室
`week2/`：介紹頁、13 頁投影、學生任務頁（推薦泡泡模擬、真的還是 AI、假新聞偵探、AI 幻覺示範）。共用 `assets/style.css`、`assets/common.js`、`assets/deck.js`（投影引擎）。

## 兩段式美顏刺激物
`tools/beautify.py`：對同一張原圖產生輕度、重度兩級美顏（磨皮、提亮、放大眼睛、瘦臉），只控制強度一個變因。第一堂第 16 頁與學生頁「排排看」使用。

## 課後回饋問卷
`feedback/`：三題（辨識／歸因／自主）、計分方式與盲點說明；`create-form.gs` 一鍵建立 Google 表單，設定貼到 `assets/feedback-config.js` 即開始收集。
