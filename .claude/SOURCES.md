# 已安裝 skills／agents 來源紀錄

以「固定版本複製」方式安裝（不自動更新）。更新時請重新比對來源 repo，並更新下表的 commit。

安裝日期：2026-10-27

| 項目 | 安裝位置 | 來源 | Commit | 授權 |
|---|---|---|---|---|
| diagram-design | `.claude/skills/diagram-design/` | https://github.com/cathrynlavery/diagram-design （`skills/diagram-design/`） | `97d795138448f6a739a0cebc3d9beb37a42077f1` | MIT；內含圖示另見 `THIRD_PARTY_LICENSES.md` |
| taste-skill | `.claude/skills/taste-skill/` | https://github.com/Leonxlnx/taste-skill （`skills/taste-skill/`） | `12af471f627f866411b4bd785b19646d3672784c` | MIT |
| inclusive-visuals-specialist | `.claude/agents/` | https://github.com/msitarzewski/agency-agents （`design/design-inclusive-visuals-specialist.md`） | `b37b5bb33b78f2c1d6567d98e25ca818e3259219` | MIT |
| persona-walkthrough | `.claude/agents/` | 同上（`design/design-persona-walkthrough.md`） | 同上 | MIT |
| ux-researcher | `.claude/agents/` | 同上（`design/design-ux-researcher.md`） | 同上 | MIT |
| visual-storyteller | `.claude/agents/` | 同上（`design/design-visual-storyteller.md`） | 同上 | MIT |

## 本專案原創

| 項目 | 安裝位置 | 說明 | 授權 |
|---|---|---|---|
| product-image-teardown | `.claude/skills/product-image-teardown/` | 2026-10-28 撰寫。方法上參考了 yvonnechen202608-byte/picture-design 中兩個 skill 的「視覺語法參數化、單變數修正、驗收清單」思路，但文字、版面、證據分級與程式皆為重新撰寫，未複製其內容（該 repo 未附授權） | 待作者決定 |

## 本專案對原檔的修改

- `diagram-design/references/style-guide.md`：`Font source: web` 改為 `system`，產出的圖不再載入 Google Fonts（離線、不追蹤）。
- agency-agents 四個檔案：檔名去掉 `design-` 前綴；`name` 欄位改為小寫連字號（Claude Code 的 agent 命名格式）。
- `persona-walkthrough.md`、`ux-researcher.md`：開頭加入「模擬結果僅為待驗證假設」的本專案附註。

## 評估後暫不安裝

- heygen-com/hyperframes（Apache-2.0）：HTML 轉 MP4，依賴重、部分功能綁定 HeyGen 付費點數。等有影片製作需求再裝 `hyperframes`、`hyperframes-cli`。
- lemomo-ai/lemo-opuscar（MIT）：skill 只是啟動腳本，執行時才下載約 188MB 資料與 Python 套件，且作者表示風格為單一模型調校。作為意象設計教材參考即可。

## 更新方式

```bash
git clone --depth 1 https://github.com/cathrynlavery/diagram-design /tmp/dd
rsync -a --delete /tmp/dd/skills/diagram-design/ .claude/skills/diagram-design/
cp /tmp/dd/LICENSE /tmp/dd/THIRD_PARTY_LICENSES.md .claude/skills/diagram-design/
# 之後重新套用上方「本專案對原檔的修改」，並更新本表 commit
```
