/* 共用：圖片槽、Before/After、複製 */
window.LAB = (function () {
  // 圖片清單：檔名固定，教師只要把檔案放進 images/ 即可替換
  const IMAGES = {
    "original":        { file: "original.jpg",        label: "原圖" },
    "color-warm-low":  { file: "color-warm-low.jpg",  label: "暖色・低彩度" },
    "color-warm-high": { file: "color-warm-high.jpg", label: "暖色・高彩度" },
    "color-cool-low":  { file: "color-cool-low.jpg",  label: "冷色・低彩度" },
    "color-cool-high": { file: "color-cool-high.jpg", label: "冷色・高彩度" },
    "hair-short":      { file: "hair-short.jpg",      label: "短髮" },
    "hair-curly":      { file: "hair-curly.jpg",      label: "捲髮" },
    "hair-bangs":      { file: "hair-bangs.jpg",      label: "瀏海" },
    "style-natural":   { file: "style-natural.jpg",   label: "自然風格" },
    "beautified":      { file: "beautified.jpg",      label: "被 AI 偷偷美化" },
    "beautified-light":{ file: "beautified-light.jpg",label: "輕度美顏" },
    "beautified-heavy":{ file: "beautified-heavy.jpg",label: "重度美顏" }
  };

  // 排序活動：固定打亂順序（A/B/C），依點擊順序給 1、2、3；揭曉時對照正確答案
  // items: [{key, rank, reveal}]，rank 1 = 改最少（原圖）
  function sorter(el, items, opts) {
    opts = opts || {};
    let order = [];
    el.classList.add("sorter");
    el.innerHTML = `<div class="sorter-grid">${items.map((it, i) => `
        <button type="button" class="sort-card" data-i="${i}" aria-label="選項 ${"ABC"[i]}">
          ${fig(it.key, { caption: false, alt: "排序選項 " + "ABC"[i] })}
          <span class="sort-letter">${"ABC"[i]}</span><span class="sort-n" aria-live="polite"></span>
          <span class="sort-reveal" hidden></span>
        </button>`).join("")}</div>
      <p class="sort-hint">${opts.hint || "依「被改的程度」由少到多，依序點三張。"}</p>
      <div class="row sort-actions"><button type="button" class="btn ghost" data-reset>重來</button>
      <button type="button" class="btn" data-check disabled>揭曉答案</button></div>
      <p class="sort-result" aria-live="polite"></p>`;
    const cards = [...el.querySelectorAll(".sort-card")];
    const checkBtn = el.querySelector("[data-check]");
    const render = () => {
      cards.forEach((c, i) => {
        const k = order.indexOf(i);
        c.querySelector(".sort-n").textContent = k < 0 ? "" : k + 1;
        c.classList.toggle("picked", k >= 0);
      });
      checkBtn.disabled = order.length < items.length;
    };
    cards.forEach((c, i) => c.addEventListener("click", () => {
      if (el.classList.contains("revealed")) return;
      const k = order.indexOf(i);
      if (k >= 0) order.splice(k, 1); else if (order.length < items.length) order.push(i);
      render();
    }));
    el.querySelector("[data-reset]").addEventListener("click", () => {
      order = []; el.classList.remove("revealed");
      cards.forEach(c => { c.classList.remove("ok", "ng"); c.querySelector(".sort-reveal").hidden = true; });
      el.querySelector(".sort-result").textContent = ""; render();
    });
    checkBtn.addEventListener("click", () => {
      el.classList.add("revealed");
      let right = 0;
      cards.forEach((c, i) => {
        const ok = order.indexOf(i) + 1 === items[i].rank;
        if (ok) right++;
        c.classList.add(ok ? "ok" : "ng");
        const r = c.querySelector(".sort-reveal"); r.hidden = false;
        r.textContent = `${items[i].rank}｜${items[i].reveal || IMAGES[items[i].key].label}`;
      });
      const origIdx = items.findIndex(it => it.rank === 1);
      const guessedOrig = order[0];
      el.querySelector(".sort-result").textContent =
        `排對 ${right} / ${items.length} 張。` +
        (guessedOrig === origIdx ? "你找到了原圖。" : `你以為 ${"ABC"[guessedOrig]} 是原圖——其實它也被改過。`);
      if (opts.onReveal) opts.onReveal({ order, right });
    });
    wireImages(el);
  }


  function fig(key, opts = {}) {
    const m = IMAGES[key];
    const cap = opts.caption === false ? "" : `<figcaption>${opts.caption || m.label}</figcaption>`;
    return `<figure class="ph ${opts.cls || ""}" data-file="${m.file}">
      <img src="images/${m.file}" alt="${opts.alt || "示範人物：" + m.label}" loading="lazy">${cap}</figure>`;
  }

  function ba(beforeKey, afterKey, opts = {}) {
    const b = IMAGES[beforeKey], a = IMAGES[afterKey];
    return `<div class="ba ${opts.cls || ""}" style="--pos:50%">
      ${fig(beforeKey, { caption: false })}
      ${fig(afterKey, { caption: false, cls: "after" })}
      <div class="handle" aria-hidden="true"></div>
      <span class="lab l">BEFORE｜${b.label}</span><span class="lab r">AFTER｜${a.label}</span>
      <input type="range" min="0" max="100" value="50" aria-label="拖曳比較 ${b.label} 與 ${a.label}">
    </div>`;
  }

  // 缺檔 → 顯示預留檔名，教師一眼知道少哪張
  function wireImages(root = document) {
    root.querySelectorAll(".ph img").forEach(img => {
      const mark = () => img.closest(".ph").classList.add("missing");
      if (img.complete && img.naturalWidth === 0) mark();
      img.addEventListener("error", mark, { once: true });
    });
    root.querySelectorAll(".ba input[type=range]").forEach(r => {
      r.addEventListener("input", () => r.parentElement.style.setProperty("--pos", r.value + "%"));
    });
  }

  async function copy(text, btn) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t);
      t.select(); document.execCommand("copy"); t.remove();
    }
    if (btn) { const o = btn.textContent; btn.textContent = "已複製 ✓"; setTimeout(() => (btn.textContent = o), 1400); }
  }

  function studentURL(hash = "") {
    const u = new URL("student.html", location.href); u.hash = hash; return u.href;
  }

  function qr(el, url, size = 180) {
    if (window.QRCode) { el.innerHTML = ""; new QRCode(el, { text: url, width: size, height: size, colorDark: "#30343A", colorLight: "#ffffff" }); }
    else el.textContent = url;
  }

  return { IMAGES, fig, ba, wireImages, copy, studentURL, qr, sorter };
})();
