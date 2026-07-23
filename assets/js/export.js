/*
 * AICL 匯出與 Prompt 組合邏輯
 * 純前端字串組合，不上傳任何資料到伺服器。
 */
(function (global) {
  "use strict";

  var AICL = global.AICL || {};

  function val(v, fallback) {
    var s = (v || "").toString().trim();
    return s || (fallback || "（尚未填寫）");
  }

  /* ---------------- CREATE Prompt 組合 ---------------- */

  function createPromptShort(f) {
    return [
      val(f.context, "情境未填"),
      "，",
      val(f.role, "角色未填"),
      "，具備",
      val(f.elements, "元素未填"),
      "，正在",
      val(f.action, "動作未填"),
      "，呈現",
      val(f.tone, "風格未填"),
      "的感覺。"
    ].join("");
  }

  function createPromptAdvanced(f) {
    var lines = [];
    lines.push("【情境 Context】" + val(f.context));
    lines.push("【角色 Role】" + val(f.role));
    lines.push("【元素 Elements】" + val(f.elements));
    lines.push("【動作 Action】" + val(f.action));
    lines.push("【風格與情緒 Tone】" + val(f.tone));
    lines.push("【輸出與限制 Expectation】" + val(f.expectation));
    lines.push("");
    lines.push(
      "請保留角色可辨識特徵與固定服裝道具主色，指定畫風與構圖比例，不生成文字與 Logo。"
    );
    return lines.join("\n");
  }

  function createPrompt(f, mode) {
    return mode === "advanced" ? createPromptAdvanced(f) : createPromptShort(f);
  }

  /* ---------------- 一句話故事 ---------------- */

  function storySentence(f) {
    return (
      "一位" + val(f.protagonist, "主角") + "，想要" + val(f.goal, "目標") +
      "，但是" + val(f.obstacle, "阻礙") + "，最後他" + val(f.change, "改變") + "。"
    );
  }

  /* ---------------- 三幕劇摘要 ---------------- */

  function threeActSummary(f) {
    return [
      "第一幕：" + val(f.act1_life, "他過著平凡的生活") + "，他想得到" + val(f.act1_want, "某個渴望"),
      "第二幕：" + val(f.act2_problem, "問題發生了") + "，" + val(f.act2_escalate, "阻礙逐漸加劇"),
      "第三幕：他選擇" + val(f.act3_choice, "做出行動") + "，最後" + val(f.act3_change, "產生改變")
    ];
  }

  /* ---------------- 分鏡 Prompt ---------------- */

  var SHOT_LABEL = {
    "全景": "wide shot / establishing shot",
    "中景": "medium shot",
    "近景": "close-up",
    "特寫": "extreme close-up"
  };

  function characterPromptLabel(character) {
    if (typeof character === "string") return val(character, "角色");
    character = character || {};
    return [
      character.name ? "角色名稱：" + character.name : "",
      character.identity ? "身分：" + character.identity : "",
      character.appearance ? "外觀：" + character.appearance : "",
      character.ability ? "特殊能力：" + character.ability : "",
      character.weakness ? "個性弱點：" + character.weakness : ""
    ].filter(function (part) { return part; }).join("；") || "角色";
  }

  function storyboardPrompt(shot, character) {
    var shotLabel = SHOT_LABEL[shot.shot] || shot.shot || "中景";
    return [
      "使用同一角色參考圖，維持角色一致性，不重新設計角色。",
      "角色設定：" + characterPromptLabel(character),
      "事件：" + val(shot.event),
      "動作：" + val(shot.action),
      "表情：" + val(shot.expression),
      "鏡位：" + val(shot.shot) + "（" + shotLabel + "）",
      "場景與光線：" + val(shot.scene)
    ].join("\n");
  }

  /* ---------------- 動畫 Prompt ---------------- */

  function animationPrompt(f) {
    return [
      "【動畫 Prompt（僅套用於高潮格）】",
      "起始動作：" + val(f.startAction),
      "後續動作：" + val(f.followAction),
      "表情變化：" + val(f.expressionChange),
      "環境動態：" + val(f.envMotion),
      "鏡頭運動：" + val(f.cameraMotion),
      "禁止變形條件：" + val(f.noDeform, "禁止臉部、服裝、道具變形")
    ].join("\n");
  }

  /* ---------------- 匯出彙整 ---------------- */

  function characterText(state) {
    var c = state.character || {};
    return [
      "===== 角色設定 =====",
      "角色名稱：" + val(c.name),
      "角色身分：" + val(c.identity),
      "外觀錨點：" + val(c.appearance),
      "特殊能力：" + val(c.ability),
      "個性弱點：" + val(c.weakness)
    ].join("\n");
  }

  function fullPromptText(state) {
    var out = [];
    out.push("===== 角色 Prompt（CREATE，" + (state.create && state.create.mode === "advanced" ? "進階版" : "簡短版") + "）=====");
    out.push(createPrompt(state.create || {}, state.create && state.create.mode));
    out.push("");
    out.push("===== 分鏡 Prompt =====");
    (state.storyboard || []).forEach(function (shot, i) {
      out.push("--- 第 " + (i + 1) + " 格 ---");
      out.push(storyboardPrompt(shot, state.character));
      out.push("");
    });
    out.push("===== 動畫 Prompt =====");
    out.push(animationPrompt(state.animation || {}));
    return out.join("\n");
  }

  function storySummaryText(state) {
    var out = [];
    out.push("===== 一句話故事 =====");
    out.push(storySentence(state.story || {}));
    out.push("");
    out.push("===== 三幕劇摘要 =====");
    threeActSummary(state.threeAct || {}).forEach(function (line) {
      out.push(line);
    });
    return out.join("\n");
  }

  function printableHTML(state) {
    var meta = state.meta || {};
    var esc = function (s) {
      var div = document.createElement("div");
      div.textContent = (s || "").toString();
      return div.innerHTML;
    };
    return (
      "<!doctype html><html lang=\"zh-Hant\"><head><meta charset=\"utf-8\">" +
      "<title>" + esc(meta.title || "作品摘要") + "</title>" +
      "<style>body{font-family:'Noto Sans TC',sans-serif;max-width:720px;margin:2rem auto;" +
      "line-height:1.7;color:#1c2130} h1{font-size:1.6rem} h2{font-size:1.2rem;margin-top:1.6rem;" +
      "border-bottom:2px solid #1c2541;padding-bottom:.3rem} pre{white-space:pre-wrap;" +
      "background:#f2f0ea;padding:1rem;border-radius:8px}</style></head><body>" +
      "<h1>" + esc(meta.title || "作品摘要") + "</h1>" +
      "<p>組別：" + esc(meta.group) + "　座號/代號：" + esc(meta.seat) + "</p>" +
      "<h2>角色設定</h2><pre>" + esc(characterText(state)) + "</pre>" +
      "<h2>Prompt</h2><pre>" + esc(fullPromptText(state)) + "</pre>" +
      "<h2>故事與分鏡</h2><pre>" + esc(storySummaryText(state)) + "</pre>" +
      "</body></html>"
    );
  }

  function fileBaseName(state) {
    var m = state.meta || {};
    return (
      AICL.sanitizeFileName(m.group || "組別") +
      "_" +
      AICL.sanitizeFileName(m.seat || "代號") +
      "_" +
      AICL.sanitizeFileName(m.title || "作品")
    );
  }

  function downloadAll(state) {
    var base = fileBaseName(state);
    AICL.downloadTextFile(base + "_角色設定.txt", characterText(state));
    AICL.downloadTextFile(base + "_Prompt.txt", fullPromptText(state));
    AICL.downloadTextFile(base + "_故事與分鏡.txt", storySummaryText(state));
    AICL.downloadJSON(base + "_備份.json", state);
    AICL.downloadHTML(base + "_可列印.html", printableHTML(state));
  }

  AICL.compose = {
    createPrompt: createPrompt,
    storySentence: storySentence,
    threeActSummary: threeActSummary,
    storyboardPrompt: storyboardPrompt,
    animationPrompt: animationPrompt
  };

  AICL.exportBundle = {
    characterText: characterText,
    fullPromptText: fullPromptText,
    storySummaryText: storySummaryText,
    printableHTML: printableHTML,
    fileBaseName: fileBaseName,
    downloadAll: downloadAll
  };

  global.AICL = AICL;
})(window);
