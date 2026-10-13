/* 第二堂互動元件：推薦泡泡模擬、真的還 AI、假新聞偵探 */
(function () {
  const L = window.LAB, D = window.W2;
  Object.assign(L.IMAGES, {
    "snow-taipei": { file: "snow-taipei.jpg", label: "台北騎樓下大雪" },
    "typhoon-wave": { file: "typhoon-wave.jpg", label: "颱風天巨浪" },
    "shiba-chef": { file: "shiba-chef.jpg", label: "夜市柴犬烤香腸" },
    "students-field": { file: "students-field.jpg", label: "高中生操場合照" },
    "recap-heavy": { file: "../../images/beautified-heavy.jpg", label: "上週：重度美顏" },
    "recap-original": { file: "../../images/original.jpg", label: "上週：原圖" }
  });
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  /* ---------- 1. 推薦泡泡 ----------
     規則（刻意簡化、公開給學生看）：按讚的主題權重 ×1.8；看到沒按的 ×0.85；
     每輪依權重抽 6 則。6 輪後看「你的動態牆」剩下什麼。 */
  function bubble(el, opts) {
    opts = opts || {};
    const ROUNDS = opts.rounds || 6, PER = 6;
    const T = D.topics;
    let w, seen, round, liked, history;
    function reset() {
      w = Object.fromEntries(T.map(t => [t, 1]));
      seen = new Set(); round = 0; liked = 0;
      history = [shares()];
      draw();
    }
    function shares() {
      const s = T.reduce((a, t) => a + w[t], 0);
      return Object.fromEntries(T.map(t => [t, w[t] / s]));
    }
    function diversity(sh) {   // 正規化熵：100 = 八個主題平均；0 = 只剩一個主題
      let h = 0; T.forEach(t => { if (sh[t] > 0) h -= sh[t] * Math.log(sh[t]); });
      return Math.round(h / Math.log(T.length) * 100);
    }
    function pickFeed() {
      const pool = D.posts.filter(p => !seen.has(p.id));
      const src = pool.length >= PER ? pool : D.posts.slice();
      const out = [];
      while (out.length < PER && src.length) {
        const tot = src.reduce((a, p) => a + w[p.t], 0);
        let r = Math.random() * tot, i = 0;
        for (; i < src.length; i++) { r -= w[src[i].t]; if (r <= 0) break; }
        const p = src.splice(Math.min(i, src.length - 1), 1)[0];
        out.push(p); seen.add(p.id);
      }
      return out;
    }
    function bars(sh) {
      return `<div class="bub-bars">${T.map(t => `<div class="bub-bar"><span>${t}</span><i style="width:${Math.max(1, sh[t] * 100).toFixed(1)}%"></i><b>${Math.round(sh[t] * 100)}%</b></div>`).join("")}</div>`;
    }
    function draw() {
      const sh = shares();
      if (round >= ROUNDS) {
        const hidden = T.filter(t => sh[t] < 0.03);
        const top = T.slice().sort((a, b) => sh[b] - sh[a]).slice(0, 2);
        el.innerHTML = `<div class="bub-end">
          <p class="bub-k">你的動態牆，6 輪之後</p>
          ${bars(sh)}
          <div class="bub-stats">
            <div><b>${diversity(sh)}</b><span>多樣性（滿分 100）</span></div>
            <div><b>${top.join("・")}</b><span>你的泡泡</span></div>
          </div>
          <p>${hidden.length ? `<b>幾乎看不到的主題：</b>${hidden.join("、")}。不是它們不存在，是系統覺得你不會想看。` : "你的動態牆還算多元——你按讚的範圍很廣。"}</p>
          <p class="soft">跟旁邊同學比一比：你們的「泡泡」一樣嗎？</p>
          <button type="button" class="btn ghost" data-again>重新玩一次</button></div>`;
        el.querySelector("[data-again]").onclick = reset;
        if (opts.onEnd) opts.onEnd({ shares: sh, diversity: diversity(sh) });
        return;
      }
      const feed = pickFeed();
      el.innerHTML = `<div class="bub-head"><span class="tag">第 ${round + 1} / ${ROUNDS} 輪</span>
          <span class="soft">對想看的貼文按 ♥，按完「下一輪」</span></div>
        <div class="bub-feed">${feed.map(p => `
          <article class="bub-post" data-id="${p.id}">
            <span class="bub-t">${p.t}</span><p>${esc(p.text)}</p>
            <button type="button" class="bub-like" aria-pressed="false" aria-label="喜歡：${esc(p.text)}">♥</button>
          </article>`).join("")}</div>
        <div class="row" style="justify-content:space-between">
          <span class="soft">目前多樣性：<b>${diversity(sh)}</b> / 100</span>
          <button type="button" class="btn" data-next>下一輪 →</button></div>
        <details class="bub-peek"><summary>偷看系統的「權重」</summary>${bars(sh)}</details>`;
      el.querySelectorAll(".bub-like").forEach(b => b.onclick = () => b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true"));
      el.querySelector("[data-next]").onclick = () => {
        el.querySelectorAll(".bub-post").forEach(a => {
          const p = D.posts[+a.dataset.id];
          const on = a.querySelector(".bub-like").getAttribute("aria-pressed") === "true";
          w[p.t] *= on ? 1.8 : 0.85;
          if (on) liked++;
        });
        round++; history.push(shares()); draw();
      };
    }
    reset();
  }

  /* ---------- 2. 真的還是 AI ---------- */
  function realOrAI(el, mode) {
    const teacher = mode === "teacher";
    el.innerHTML = `<div class="roa-grid">${D.photos.map((p, i) => `
      <div class="roa" data-i="${i}">
        ${L.fig(p.key, { caption: false, alt: "照片 " + (i + 1) })}
        <span class="roa-n">${i + 1}</span>
        <div class="roa-btns">
          <button type="button" data-v="real">真的 <b>${teacher ? 0 : ""}</b></button>
          <button type="button" data-v="ai">AI <b>${teacher ? 0 : ""}</b></button>
        </div>
        <p class="roa-reveal" hidden><b>AI 生成</b>｜${esc(p.clue)}</p>
      </div>`).join("")}</div>
      <div class="row"><button type="button" class="btn warm" data-reveal>揭曉</button>
      <span class="roa-sum" aria-live="polite"></span></div>`;
    L.wireImages(el);
    el.querySelectorAll(".roa").forEach(card => {
      const btns = card.querySelectorAll("[data-v]");
      btns.forEach(b => b.onclick = e => {
        if (teacher) { const n = b.querySelector("b"); n.textContent = Math.max(0, +n.textContent + (e.shiftKey ? -1 : 1)); }
        else btns.forEach(x => x.setAttribute("aria-pressed", x === b));
      });
    });
    el.querySelector("[data-reveal]").onclick = () => {
      el.classList.add("revealed");
      el.querySelectorAll(".roa-reveal").forEach(p => (p.hidden = false));
      let msg = "四張全部都是 AI 生成的。";
      if (!teacher) {
        const realGuess = [...el.querySelectorAll('[data-v=real][aria-pressed=true]')].length;
        msg += realGuess ? `你把其中 ${realGuess} 張當成真的。` : "你全部抓到了——但下一次呢？";
      }
      el.querySelector(".roa-sum").textContent = msg;
    };
  }

  /* ---------- 3. 假新聞偵探 ---------- */
  function detective(el) {
    el.innerHTML = D.news.map(n => `
      <article class="det box" data-id="${n.id}">
        <p class="det-meta mono">${esc(n.meta)}</p>
        <h3>${esc(n.title)}</h3>
        ${n.img ? `<div class="det-img">${L.fig(n.img, { caption: false, alt: "新聞配圖" })}</div>` : ""}
        <p>${esc(n.body)}</p>
        <p class="det-q"><b>你發現哪些警訊？</b></p>
        <div class="check" data-flags>${n.flags.map(f => `<button type="button" aria-pressed="false">${esc(f)}</button>`).join("")}</div>
        <p class="det-q"><b>你的判斷：</b></p>
        <div class="det-verdict">${["可信", "不可信", "需要再查"].map(v => `<button type="button" class="chip" aria-pressed="false">${v}</button>`).join("")}</div>
        <button type="button" class="btn ghost" data-open style="margin-top:10px">看解答</button>
        <div class="det-ans" hidden><p><b>解答：${esc(n.verdict)}</b></p><p>${esc(n.explain)}</p></div>
      </article>`).join("");
    L.wireImages(el);
    el.querySelectorAll("[data-flags] button").forEach(b => b.onclick = () => b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true"));
    el.querySelectorAll(".det-verdict").forEach(g => g.querySelectorAll("button").forEach(b => b.onclick = () =>
      g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b))));
    el.querySelectorAll(".det").forEach(card => {
      const n = D.news.find(x => x.id === card.dataset.id);
      card.querySelector("[data-open]").onclick = e => {
        card.querySelector(".det-ans").hidden = false; e.target.remove();
        card.querySelectorAll("[data-flags] button").forEach(b => b.classList.add(n.truth.includes(b.textContent) ? "is-flag" : "not-flag"));
      };
    });
  }

  L.w2 = { bubble, realOrAI, detective };
})();
