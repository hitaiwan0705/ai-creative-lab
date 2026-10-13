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
    "beautified":      { file: "beautified.jpg",      label: "被 AI 偷偷美化" }
  };

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

  return { IMAGES, fig, ba, wireImages, copy, studentURL, qr };
})();
