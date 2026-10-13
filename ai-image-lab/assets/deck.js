/* 通用投影引擎：window.DECK(SEGS, S, onReady)
   S = [{seg, html, notes}]；← → 翻頁｜N 講稿｜T 計時｜O 總覽｜F 全螢幕 */
window.DECK = function (SEGS, S, onReady) {
  const { wireImages, studentURL, qr } = window.LAB;
  // ---------- 建構 ----------
  const stage = document.querySelector(".stage");
  const ov = document.querySelector(".overview");
  stage.innerHTML = S.map((s, i) => `<section class="slide" role="group" aria-roledescription="slide" aria-label="第 ${i+1} 頁">${s.html}</section>`).join("");
  ov.innerHTML = S.map((s, i) => {
    const t = (s.html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [,""])[1].replace(/<[^>]+>/g, " ");
    return `<button type="button" data-go="${i}"><span class="n">${String(i+1).padStart(2,"0")}｜${SEGS[s.seg].name}</span><br><b>${t}</b></button>`;
  }).join("");
  wireImages(stage);

  const slides = [...stage.children];
  const notesEl = document.querySelector(".notes");
  const secEl = document.querySelector(".sec"), segEl = document.querySelector(".seg"), cntEl = document.querySelector(".cnt");
  const prog = document.querySelector(".progress");
  let cur = 0;

  function go(i) {
    cur = Math.max(0, Math.min(S.length - 1, i));
    slides.forEach((el, k) => el.classList.toggle("on", k === cur));
    const sg = SEGS[S[cur].seg];
    secEl.textContent = sg.name;
    segEl.textContent = `建議 ${sg.from}–${sg.to} 分`;
    cntEl.textContent = `${cur + 1} / ${S.length}`;
    prog.style.width = ((cur + 1) / S.length * 100) + "%";
    notesEl.innerHTML = `<b>講稿｜第 ${cur+1} 頁</b>　${S[cur].notes}`;
    [...ov.children].forEach((b, k) => b.classList.toggle("cur", k === cur));
    history.replaceState(null, "", "#" + (cur + 1));
  }

  // 鍵盤／點擊／滑動
  document.addEventListener("keydown", e => {
    if (e.target.matches("input,textarea")) return;
    const k = e.key.toLowerCase();
    if ((e.key === " " || k === "enter") && e.target.matches("button,a")) return;
    if (["ArrowRight","PageDown"," ","Enter"].includes(e.key)) { e.preventDefault(); go(cur + 1); }
    else if (["ArrowLeft","PageUp"].includes(e.key)) { e.preventDefault(); go(cur - 1); }
    else if (k === "n") notesEl.classList.toggle("on");
    else if (k === "o") ov.classList.toggle("on");
    else if (k === "t") toggleClock();
    else if (k === "f") fullscreen();
    else if (k === "escape") ov.classList.remove("on");
    else if (e.key === "Home") go(0); else if (e.key === "End") go(S.length - 1);
  });
  document.querySelector(".navbtn.next").onclick = () => go(cur + 1);
  document.querySelector(".navbtn.prev").onclick = () => go(cur - 1);
  document.querySelector("[data-act=notes]").onclick = () => notesEl.classList.toggle("on");
  document.querySelector("[data-act=ov]").onclick = () => ov.classList.toggle("on");
  document.querySelector("[data-act=fs]").onclick = fullscreen;
  ov.addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) { go(+b.dataset.go); ov.classList.remove("on"); } });
  let sx = null;
  stage.addEventListener("touchstart", e => { if (!e.target.closest(".ba,input")) sx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) go(cur + (dx < 0 ? 1 : -1)); sx = null; });

  function fullscreen() { document.fullscreenElement ? document.exitFullscreen() : (document.documentElement.requestFullscreen && document.documentElement.requestFullscreen()); }

  // 全場計時（對照 60 分鐘段落）
  const clockEl = document.querySelector(".deck-top .timer");
  let t0 = null, acc = 0, tick = null;
  function render() {
    const s = Math.floor((acc + (t0 ? Date.now() - t0 : 0)) / 1000);
    clockEl.textContent = `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
    clockEl.classList.toggle("over", s / 60 > SEGS[S[cur].seg].to);
  }
  function toggleClock() {
    if (t0) { acc += Date.now() - t0; t0 = null; clearInterval(tick); }
    else { t0 = Date.now(); tick = setInterval(render, 500); }
    document.querySelector("[data-act=clock]").textContent = t0 ? "暫停" : "計時";
    render();
  }
  document.querySelector("[data-act=clock]").onclick = toggleClock;

  // 投票
  document.querySelectorAll("[data-vote]").forEach(box => {
    const btns = [...box.children], cnt = btns.map(() => 0);
    btns.forEach((b, i) => b.onclick = e => {
      cnt[i] = Math.max(0, cnt[i] + (e.shiftKey ? -1 : 1));
      const max = Math.max(1, ...cnt);
      btns.forEach((x, k) => { x.querySelector(".n").textContent = cnt[k]; x.querySelector(".bar").style.width = (cnt[k] / max * 100) + "%"; });
    });
  });
  // 標籤切換
  document.querySelectorAll("[data-chips] button").forEach(b => b.onclick = () => b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true"));
  // 揭曉
  document.querySelectorAll("[data-reveal-btn]").forEach(b => b.onclick = () => { b.previousElementSibling.hidden = false; b.remove(); });
  document.querySelectorAll("[data-map] button").forEach(b => b.onclick = () => b.classList.add("shown"));

  // 倒數
  document.querySelectorAll("[data-countdown]").forEach(el => {
    const total = +el.dataset.countdown; let left = total, h = null;
    const scope = el.closest(".slide");
    const fmt = () => { el.textContent = `${String(Math.floor(left/60)).padStart(2,"0")}:${String(left%60).padStart(2,"0")}`; el.classList.toggle("done", left === 0); };
    const tg = scope.querySelector("[data-cd-toggle]"), rs = scope.querySelector("[data-cd-reset]");
    const label = tg.textContent;
    tg.onclick = () => {
      if (h) { clearInterval(h); h = null; tg.textContent = "繼續"; return; }
      h = setInterval(() => { left = Math.max(0, left - 1); fmt(); if (!left) { clearInterval(h); h = null; tg.textContent = "時間到"; } }, 1000);
      tg.textContent = "暫停";
    };
    if (rs) rs.onclick = () => { clearInterval(h); h = null; left = total; fmt(); tg.textContent = label; };
  });

  // QR
  document.querySelectorAll("[data-qr]").forEach(el => qr(el, studentURL(el.dataset.qr), 170));
  document.querySelectorAll("[data-url]").forEach(el => el.textContent = studentURL(el.dataset.url).replace(/^https?:\/\//, ""));

  if (onReady) onReady({ go: go });

  const fromHash = () => go(Math.max(0, (parseInt(location.hash.slice(1)) || 1) - 1));
  window.addEventListener("hashchange", fromHash);
  fromHash();
};
