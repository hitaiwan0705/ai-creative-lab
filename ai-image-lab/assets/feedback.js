/* 課後回饋問卷（3 題）— 量測學生對「AI 審美偏誤」的理解
   構念對應課堂三句話：
   Q1 辨識 Recognition  ：看得出 AI 改了什麼（表現題，計分 = 命中 − 誤報，0–4）
   Q2 歸因 Attribution  ：知道為什麼會這樣改（概念題，單選，迷思選項各代表一種誤解）
   Q3 自主 Agency       ：不把 AI 版本當成「更好的我」（態度題，5 點量表，反向計分）
   資料收集：assets/feedback-config.js 填入 Google 表單設定後，送出即寫入表單；未設定時只在本機顯示回饋。
*/
window.FEEDBACK = (function () {
  const Q = {
    q1: {
      title: "1. 右邊這張和左邊相比，被改了哪些地方？（可複選）",
      type: "checkbox",
      options: ["眼睛變大", "臉變小、下巴變尖", "皮膚變光滑", "膚色變白、變亮", "髮型改變", "衣服改變", "背景改變"],
      correct: ["眼睛變大", "臉變小、下巴變尖", "皮膚變光滑", "膚色變白、變亮"],
      explain: "改了四處：眼睛、臉型、皮膚質感、膚色。髮型、衣服、背景都沒動——美顏通常只動「臉」。"
    },
    q2: {
      title: "2. AI 修圖時常把臉變小、眼睛變大、皮膚變白。最主要的原因是？",
      type: "radio",
      options: [
        "因為這樣就是美的標準答案，AI 只是照著做",
        "AI 從大量人類照片和修圖習慣中，學到某一種常見的審美，就往那個方向修",
        "這是電腦程式的隨機錯誤",
        "因為每個使用者都主動要求這樣修"
      ],
      correct: ["AI 從大量人類照片和修圖習慣中，學到某一種常見的審美，就往那個方向修"],
      explain: "AI 的「審美」是從資料學來的。資料裡哪種臉比較多、比較常被修成什麼樣，AI 就會往那裡靠——所以它不是中立的鏡子。"
    },
    q3: {
      title: "3. 朋友說：「AI 修過的那張，才是比較好的我。」你同意嗎？",
      type: "likert",
      options: ["1 非常不同意", "2 不同意", "3 普通", "4 同意", "5 非常同意"],
      reason: "可以多說一句為什麼（選填）",
      explain: "沒有標準答案，但記得：AI 給的是一種可能，不是「更正確的你」。最後怎麼呈現自己，由你決定。"
    }
  };

  function scoreQ1(sel, QQ) {
    const Q = QQ || window.FEEDBACK.Q;
    const hit = sel.filter(s => Q.q1.correct.includes(s)).length;
    const fa = sel.filter(s => !Q.q1.correct.includes(s)).length;
    return Math.max(0, hit - fa);
  }

  // opts: { Q, cfg, media }，未給則用第一堂的題目、設定與比較圖
  function render(el, opts) {
    opts = opts || {};
    const L = window.LAB;
    const Q = opts.Q || window.FEEDBACK.Q;
    const cfg = opts.cfg !== undefined ? opts.cfg : (window.FEEDBACK_FORM || null);
    const media = opts.media || (() => `<div class="grid2" style="margin:8px 0">${L.fig("original", { caption: "左" })}${L.fig("beautified-heavy", { caption: "右" })}</div>`);
    el.innerHTML = `
      <form class="fb" novalidate>
        <fieldset class="box">
          <legend><b>${Q.q1.title}</b></legend>
          ${media()}
          <div class="opts">${Q.q1.options.map((o, i) => `<label class="opt"><input type="checkbox" name="q1" value="${o}"> ${o}</label>`).join("")}</div>
          <p class="fb-explain" hidden>${Q.q1.explain}</p>
        </fieldset>
        <fieldset class="box">
          <legend><b>${Q.q2.title}</b></legend>
          <div class="opts">${Q.q2.options.map((o, i) => `<label class="opt"><input type="radio" name="q2" value="${o}"> ${"ABCD"[i]}. ${o}</label>`).join("")}</div>
          <p class="fb-explain" hidden>${Q.q2.explain}</p>
        </fieldset>
        <fieldset class="box">
          <legend><b>${Q.q3.title}</b></legend>
          <div class="likert">${Q.q3.options.map(o => `<label class="opt"><input type="radio" name="q3" value="${o}"> ${o}</label>`).join("")}</div>
          <label class="f" for="q3r">${Q.q3.reason}</label>
          <input id="q3r" type="text" name="q3r" maxlength="120">
          <p class="fb-explain" hidden>${Q.q3.explain}</p>
        </fieldset>
        <p class="fb-msg" aria-live="polite"></p>
        <button class="btn" type="submit">送出</button>
        ${cfg ? "" : `<p class="soft" style="color:var(--ink-soft);font-size:.9rem">（本機練習模式：答案不會被收集）</p>`}
      </form>`;
    L.wireImages(el);
    const form = el.querySelector("form"), msg = el.querySelector(".fb-msg");
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const q1 = [...form.querySelectorAll("[name=q1]:checked")].map(i => i.value);
      const q2 = (form.querySelector("[name=q2]:checked") || {}).value;
      const q3 = (form.querySelector("[name=q3]:checked") || {}).value;
      if (!q1.length || !q2 || !q3) { msg.textContent = "三題都要作答喔（第 3 題的理由可以不寫）。"; return; }
      const btn = form.querySelector("[type=submit]"); btn.disabled = true;
      let sent = false;
      if (cfg && cfg.action) {
        const body = new URLSearchParams();
        q1.forEach(v => body.append(cfg.entries.q1, v));
        body.append(cfg.entries.q2, q2);
        body.append(cfg.entries.q3, q3);
        if (cfg.entries.q3r) body.append(cfg.entries.q3r, form.q3r.value.trim());
        try { await fetch(cfg.action, { method: "POST", mode: "no-cors", body }); sent = true; } catch (err) { sent = false; }
      }
      form.querySelectorAll("input").forEach(i => (i.disabled = true));
      form.querySelectorAll(".fb-explain").forEach(p => (p.hidden = false));
      const s1 = scoreQ1(q1, Q), ok2 = Q.q2.correct.includes(q2);
      msg.innerHTML = (sent ? "已送出，謝謝！" : cfg ? "送出失敗，請截圖給老師。" : "完成！") +
        `<br>第 1 題得分 ${s1} / 4（勾錯的會扣分）；第 2 題${ok2 ? "答對" : "再想想：看下面的說明"}。`;
      btn.hidden = true;
    });
  }
  return { Q, render, scoreQ1 };
})();
