/* 投影簡報：18 頁，← → 翻頁｜N 講稿｜T 計時｜O 總覽｜F 全螢幕 */
(function () {
  const { fig, ba, wireImages, studentURL, qr } = window.LAB;

  // 60 分鐘段落（分鐘）
  const SEGS = {
    open:   { name: "開場",       from: 0,  to: 5 },
    intro:  { name: "資傳是什麼", from: 5,  to: 8 },
    color:  { name: "第一關｜我的顏色", from: 8, to: 20 },
    hair:   { name: "第二關｜剪之前先試", from: 20, to: 34 },
    style:  { name: "第三關｜另一個版本的我", from: 34, to: 44 },
    trap:   { name: "AI 審美陷阱", from: 44, to: 49 },
    mine:   { name: "我的版本＋平台挑戰", from: 49, to: 55 },
    reveal: { name: "最後揭曉", from: 55, to: 60 }
  };

  const S = [
    { seg: "open", html: `
      <div class="cols wide-left">
        <div>
          <div class="kicker">AI IMAGE LAB ／ 高中微課程</div>
          <h2>AI 形象<br>實驗室</h2>
          <p class="big">試試<em style="color:var(--terra);font-style:normal">不同版本</em>的自己</p>
          <p class="lead soft">用 AI 玩配色、髮型與風格，看看 AI 到底懂不懂你</p>
        </div>
        <div class="grid2x2">${fig("color-warm-high",{caption:false})}${fig("hair-short",{caption:false})}${fig("hair-curly",{caption:false})}${fig("style-natural",{caption:false})}</div>
      </div>`,
      notes: "大圖即可，不放課綱、不先自我介紹太久。直接進下一頁問問題。" },

    { seg: "open", html: `
      <div class="kicker">QUESTION</div>
      <h2>如果今天<em>全部免費</em>……</h2>
      <p class="lead">不用花錢、不用真的剪頭髮，你最想先試什麼？</p>
      <div class="vote" data-vote>
        ${["A 換髮色","B 換髮型","C 換穿搭／配色","D 換成完全不同風格"].map(t=>`<button type="button"><span>${t}</span><span class="n">0</span><span class="bar" style="width:0"></span></button>`).join("")}
      </div>
      <p class="soft" style="margin-top:1em">舉手時，老師點選項加票（Shift＋點擊＝減一）</p>`,
      notes: "讓學生舉手，教師點按鈕計票。接著說：<b>今天我們不是真的要決定「你適合什麼」，而是做一個實驗：AI 可以幫我們試到什麼程度？</b>" },

    { seg: "open", html: `
      <div class="cols">
        <div>
          <div class="kicker">EXPERIMENT</div>
          <h2>AI 可以先幫我們<em>「試」</em>嗎？</h2>
          <p class="lead">拖曳中間的把手，看看前後差多少。</p>
        </div>
        ${ba("original","hair-short",{cls:"fit"})}
      </div>`,
      notes: "請一位學生上台拖曳。先不評論 AI 改了什麼，只讓大家覺得「好像很好玩」。" },

    { seg: "open", html: `
      <div class="kicker">TODAY'S MISSION</div>
      <h2>今天只有一個任務</h2>
      <p class="big">看看<span style="color:var(--cobalt)">不同版本</span>的自己。</p>
      <p class="big" style="color:var(--terra-text)">不是比誰漂亮。</p>
      <div class="rules">
        <div><b>RULE 01</b>只上傳你有權使用的照片。</div>
        <div><b>RULE 02</b>不要拿同學照片惡搞。</div>
        <div><b>RULE 03</b>不想用自己的臉完全沒關係，可以用老師提供的素材。</div>
      </div>`,
      notes: "三條規則唸過即可，不要變成法規課。強調第 3 條，讓不想露臉的學生安心。" },

    { seg: "intro", html: `
      <div class="kicker">資訊傳播在做什麼？</div>
      <div class="equation"><span>科技</span><span class="x">×</span><span>設計</span><span class="x">×</span><span>人</span></div>
      <p class="lead" style="margin-top:1em">今天會碰到：AI・色彩・影像・社群媒體・人的感覺</p>
      <p class="soft">這就是今天會碰到的「資訊傳播」。</p>`,
      notes: "只講一個概念，3 分鐘內結束。<b>先不要介紹課程地圖、師資或未來出路。</b>" },

    { seg: "color", html: `
      <div class="cols wide-left">
        <div>
          <div class="kicker">STAGE 01</div>
          <h2>第一關<br>我的顏色</h2>
          <p class="lead">換一個顏色，人真的會看起來不一樣嗎？</p>
          <p class="big" style="font-size:clamp(1.2rem,2.6vw,2rem)">哪一個看起來比較<span style="color:var(--terra-text)">有精神</span>？<br>哪一個比較<span style="color:var(--cobalt)">酷</span>？<br>哪一個比較<span style="color:var(--terra-text)">溫柔</span>？</p>
        </div>
        <div class="grid2x2">${fig("color-warm-low")}${fig("color-warm-high")}${fig("color-cool-low")}${fig("color-cool-high")}</div>
      </div>`,
      notes: "同一人物四種配色。<b>不要立刻教春夏秋冬</b>，先讓學生憑感覺選，舉手即可。手機自拍光線不穩，不做「四季型診斷」，只做色彩探索。" },

    { seg: "color", html: `
      <div class="cols">
        <div>
          <div class="kicker">ONE CONCEPT</div>
          <h2>顏色不只有<br>「紅黃藍」</h2>
          <div class="axes">
            <label><span>冷</span><input type="range" min="0" max="100" value="30" data-ax="temp" aria-label="冷暖"><span>暖</span></label>
            <label><span>淡</span><input type="range" min="0" max="100" value="50" data-ax="sat" aria-label="彩度"><span>鮮</span></label>
            <label><span>暗</span><input type="range" min="0" max="100" value="55" data-ax="light" aria-label="明暗"><span>亮</span></label>
          </div>
          <p class="soft" style="margin-top:1em">冷暖 × 明暗 × 彩度＝同一件衣服的三種調整方向</p>
        </div>
        <div class="swatch-stage" data-swatch>
          <div class="bg"></div>
          <svg viewBox="0 0 200 240" aria-hidden="true">
            <circle cx="100" cy="62" r="34" fill="#E3C3A8"/>
            <path d="M28 240 C28 160 60 118 100 118 C140 118 172 160 172 240 Z" class="shirt"/>
          </svg>
          <span class="read"></span>
        </div>
      </div>`,
      notes: "請學生上台拖拉三條軸，讓全班說出「感覺」怎麼變。人物膚色固定，只改衣服與背景——呼應任務規則「不要改人，只換顏色」。" },

    { seg: "color", html: `
      <div class="cols">
        <div>
          <div class="kicker">TASK 01</div>
          <h2>不要改人，<br><em>只換顏色。</em></h2>
          <p class="big">哪個版本比較<span style="color:var(--cobalt)">像你</span>？</p>
          <p class="soft">冷色低彩度・冷色高彩度・暖色低彩度・暖色高彩度</p>
          <div class="qr-box"><div class="qr" data-qr="#task1"></div><p>掃碼拿 Prompt<br><span class="mono soft" data-url="#task1"></span></p></div>
        </div>
        <div><div class="countdown timer" data-countdown="480">08:00</div><p><button class="btn" data-cd-toggle>開始 8 分鐘</button> <button class="btn ghost" data-cd-reset>重設</button></p></div>
      </div>`,
      notes: "學生可用自己照片或老師提供的人物（學生頁可下載）。<b>問「哪一個比較像你」，不問「哪一個最漂亮」。</b>登入失敗 → 改教師示範＋小組討論。" },

    { seg: "hair", html: `
      <div class="kicker">STAGE 02</div>
      <h2>第二關<br>剪之前，<em>先試一下？</em></h2>
      <p class="lead">有人剪完頭髮後悔過嗎？</p>
      <div class="grid4" style="max-width:900px">${fig("original")}${fig("hair-short")}${fig("hair-curly")}${fig("hair-bangs")}</div>`,
      notes: "這段是整堂最有趣的部分，先讓學生分享後悔的剪髮經驗，氣氛熱起來再操作。" },

    { seg: "hair", html: `
      <div class="kicker">PICK TWO</div>
      <h2>挑兩個你<br><em>不敢真的剪</em>的</h2>
      <div style="font-size:clamp(1.2rem,2.6vw,2rem)" data-chips>
        ${["短髮","長髮","有瀏海","無瀏海","捲髮","特殊髮色","平頭","公主切"].map(t=>`<button type="button" class="chip" aria-pressed="false">${t}</button>`).join("")}
      </div>`,
      notes: "可點選 chip 標記全班最多人選的。男生可引導到平頭、染髮；不要只出現女性髮型。" },

    { seg: "hair", html: `
      <div class="kicker">THE ONLY RULE</div>
      <h2 style="font-size:clamp(3rem,10vw,8rem)">只准改頭髮。</h2>
      <p class="big" style="color:var(--terra);font-size:clamp(2.2rem,7vw,5.5rem)">不准偷偷整形。</p>`,
      notes: "停頓、讓大家笑。接著讓學生先用最短的 Prompt：「幫我換成短髮。」" },

    { seg: "hair", html: `
      <div class="cols">
        ${ba("original","beautified",{cls:"fit"})}
        <div>
          <div class="kicker">SPOT THE CHEAT</div>
          <h2>AI 有作弊嗎？</h2>
          <div class="check" data-chips>
            ${["眼睛","鼻子","下巴","臉型","膚色","年齡","五官比例"].map(t=>`<button type="button" aria-pressed="false">${t}</button>`).join("")}
          </div>
          <div class="prompt-card bad"><span class="tag warm">PROMPT 01</span><p>幫我換成短髮。</p></div>
          <div class="prompt-card"><span class="tag">PROMPT 02</span><p>只改變髮型，保留原始人物的五官、臉型、膚色、年齡、表情及身份特徵，不進行美顏或臉部修飾。</p></div>
        </div>
      </div>`,
      notes: "全班一起找，找到就點亮選項。再用 Prompt 02 重做比較。<b>這裡不需要講 diffusion。</b>沒人登入成功時，這頁的示範圖就是備援教材。" },

    { seg: "hair", html: `
      <div class="kicker">AN IMPORTANT FINDING</div>
      <h2>AI 不是幫你<br>「戴假髮」。</h2>
      <p class="big">它是在重新生成：<br><span style="color:var(--terra)">「一個很像你的人」</span>。</p>
      <p class="lead" style="margin-top:.6em"><b class="mono" style="color:var(--cobalt)">AI 模擬 ≠ 真實預測</b></p>`,
      notes: "只講到這裡。學生之後真的去剪，結果可能跟 AI 圖不一樣——因為 AI 畫的是「很像你的人」。" },

    { seg: "style", html: `
      <div class="cols wide-left">
        <div>
          <div class="kicker">STAGE 03</div>
          <h2>第三關<br>另一個版本的我</h2>
          <div style="font-size:clamp(1.1rem,2.2vw,1.7rem)" data-chips>
            ${["A 清爽自然","B 潮流個性","C 正式成熟","D 可愛／幻想","E 自訂＿＿"].map(t=>`<button type="button" class="chip" aria-pressed="false">${t}</button>`).join("")}
          </div>
          <p class="soft" style="margin-top:1em">可以動：髮型・服裝・配色・配件・眼鏡・背景・（妝容自由選）</p>
          <p><span class="countdown timer" data-countdown="600" style="font-size:2.6rem">10:00</span> <button class="btn" data-cd-toggle>開始 10 分鐘</button></p>
        </div>
        ${fig("style-natural")}
      </div>`,
      notes: "<b>若「妝容」讓一部分學生退出，立刻改口為「形象風格」</b>，讓學生自由選服裝、眼鏡、背景或角色設定。活動核心是 identity exploration，不是美容課。" },

    { seg: "style", html: `
      <div class="kicker">THE TURN</div>
      <p class="big soft"><s>哪個比較漂亮？</s></p>
      <h2>你想讓別人感覺<br>你是<em>怎樣的人</em>？</h2>
      <div style="font-size:clamp(1.1rem,2.2vw,1.7rem)" data-chips>
        ${["有精神","有個性","親切","專業","可愛","神秘","酷","有創意"].map(t=>`<button type="button" class="chip" aria-pressed="false">${t}</button>`).join("")}
      </div>`,
      notes: "整堂的價值轉折。<b>不要說「變漂亮」</b>，改問「你希望給別人什麼感覺？」——這其實已經在教意象（Kansei）與自我呈現，但不寫術語。" },

    { seg: "trap", html: `
      <div class="cols">
        <div>
          <div class="kicker">THE BEAUTY TRAP</div>
          <h2>AI 為什麼老是<br>偷偷……</h2>
          <p class="big" style="font-size:clamp(1.3rem,3vw,2.4rem)">臉變小？眼睛變大？<br>皮膚變平？五官變立體？</p>
          <p class="lead reveal-target" data-reveal hidden><b style="color:var(--cobalt)">AI 也有學來的「審美習慣」。</b><br>它從大量人類產生的影像中學習——所以不是完全中立的鏡子。</p>
          <button class="btn ghost" data-reveal-btn>揭曉</button>
        </div>
        ${ba("original","beautified",{cls:"fit"})}
      </div>`,
      notes: "先問「為什麼？」<b>不要急著給標準答案</b>，讓學生猜 1–2 分鐘再按「揭曉」。" },

    { seg: "mine", html: `
      <div class="kicker">MY VERSION, MY CALL</div>
      <h2>我的版本，<em>我決定</em></h2>
      <p class="big" style="font-size:clamp(1.3rem,3.2vw,2.6rem)">「我選這張，因為我希望讓別人感覺我<span class="fill">　　　　</span>。」</p>
      <p class="lead soft">兩人一組互相看。選的不是最漂亮，是你最喜歡呈現自己的版本。</p>
      <hr style="border:0;border-top:1.5px solid var(--ink-text);margin:1.2em 0">
      <p class="lead"><b>平台小挑戰：</b>剛才那一張，五個地方都適合嗎？</p>
      <div class="platforms"><span>LINE</span><span>Instagram</span><span>遊戲帳號</span><span>學校帳號</span><span>未來履歷</span></div>
      <p class="lead" style="margin-top:.8em;color:var(--cobalt)"><b>同一個人，在不同地方，可以選擇不同的呈現方式。</b></p>`,
      notes: "49–53 分寫句子＋互看；53–55 分平台挑戰，只講最後那一句。" },

    { seg: "reveal", html: `
      <div class="kicker">REVEAL</div>
      <h2>你剛才其實玩了……</h2>
      <div class="map" data-map>
        ${[["換顏色","色彩與視覺感知"],["換髮型","AI 影像生成"],["要求 AI 不要亂改","Prompt／需求定義"],["比較版本","設計與使用者判斷"],["發現 AI 偷偷美顏","AI Bias／媒體素養"],["不同平台不同形象","數位媒體與傳播"]].map(([a,b])=>`<button type="button">${a}<span class="to">${b}</span></button>`).join("")}
      </div>
      <p class="big" style="margin-top:.8em;font-size:clamp(1.3rem,3vw,2.4rem)">原來這些都是<span style="color:var(--terra)">資訊傳播</span>。</p>
      <p class="lead soft">科技怎麼影響人的感覺、選擇與溝通？</p>`,
      notes: "逐張點開，每點一張唸一次。最後收三句：<b>① AI 可以幫我快速試很多可能 ② AI 生成的版本不等於真實的我 ③ 最後選哪一個，應該由我決定。</b><br>10/20 接續句：「上週我們發現 AI 可能偷偷改變我們看到的自己；今天來看看，它會不會也偷偷改變我們看到的世界。」" }
  ];

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

  function fullscreen() { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); }

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

  // 色彩三軸
  const sw = document.querySelector("[data-swatch]");
  if (sw) {
    const ax = {}; document.querySelectorAll("[data-ax]").forEach(r => ax[r.dataset.ax] = r);
    const upd = () => {
      const t = +ax.temp.value / 100, s = +ax.sat.value, l = +ax.light.value;
      const hue = Math.round(215 + t * 165) % 360;        // 215 冷藍 → 紫 → 紅 → 20 暖橘（不經過綠）
      const sat = Math.round(8 + s * 0.82), lig = Math.round(22 + l * 0.56);
      sw.querySelector(".shirt").setAttribute("fill", `hsl(${hue} ${sat}% ${lig}%)`);
      sw.querySelector(".bg").style.background = `hsl(${hue} ${Math.round(sat*0.35)}% ${Math.min(94, lig + 30)}%)`;
      sw.querySelector(".read").textContent = `H${hue}° S${sat}% L${lig}%`;
    };
    Object.values(ax).forEach(r => r.addEventListener("input", upd)); upd();
  }

  const fromHash = () => go(Math.max(0, (parseInt(location.hash.slice(1)) || 1) - 1));
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
