# AI 生圖提示詞（選用）

Claude Code 沒有內建生圖。使用者想要寫實照片風格的版本時，產出提示詞讓他們貼到 Adobe Firefly、ChatGPT 或其他生圖工具。

## 注意事項（交付時一併告知使用者）

- 生圖模型常會**捏造內部結構**（多出螺絲、電路板、不存在的零件），也常把中文寫錯。建議：生圖只產「部件懸浮照片」，**文字與標籤一律回到 HTML 版加上**。
- 生圖結果不能當成產品真實結構的證據。

## 提示詞模板（只生圖、不含文字）

```text
Photoreal studio product photograph of a [product, materials, colors], shown as a clean vertical exploded view along a single central axis on a plain warm off-white background (#FAFAF7). Separate only the externally visible parts that a user can see or touch: [part 1], [part 2], [part 3], [part 4]. Keep each part's real shape, color and surface finish from the reference photo. Even gaps between parts, consistent front view, one soft light from the upper left, soft contact shadows. Leave wide empty margins on the left and right for labels to be added later.
Do not add any text, numbers, arrows, logos, watermarks, screws, circuit boards or internal mechanisms that are not visible in the reference.
```

## 使用流程

1. 填好方括號，部件名稱與 HTML 版的部件順序一致。
2. 有產品照片時一併上傳，並說明「this photo is the identity reference」。
3. 生成後，把圖去背存成 PNG，放進 HTML 版同一資料夾，在 `DATA.parts[].image` 填相對路徑。
4. 檢查：部件數是否正確、有沒有多出零件、形狀顏色是否與實物一致。不一致就只修那一項重生。
