/* 第二堂（10/20）投影：AI 資訊實驗室——你看到的世界，是誰選的？ */
(function () {
  const L = window.LAB, D = window.W2, fig = L.fig;
  const SEGS = {
    open:   { name: "回顧＋開場", from: 0, to: 5 },
    bubble: { name: "第一關｜推薦泡泡", from: 5, to: 17 },
    photo:  { name: "第二關｜真的還是 AI", from: 17, to: 29 },
    news:   { name: "第三關｜假新聞偵探", from: 29, to: 41 },
    lie:    { name: "AI 會說謊嗎？", from: 41, to: 48 },
    mine:   { name: "轉傳前三秒", from: 48, to: 55 },
    reveal: { name: "最後揭曉", from: 55, to: 60 }
  };

  const S = [
    { seg: "open", html: `
      <div class="cols wide-left">
        <div>
          <div class="kicker">AI INFO LAB ／ 高中微課程 第二堂</div>
          <h2>AI 資訊<br>實驗室</h2>
          <p class="big">你看到的世界，<em style="color:var(--terra);font-style:normal">是誰選的</em>？</p>
          <p class="lead soft">用推薦、照片與新聞，看看 AI 怎麼改變我們看到的世界</p>
        </div>
        <div class="grid2x2">${fig("snow-taipei", { caption: false })}${fig("shiba-chef", { caption: false })}${fig("typhoon-wave", { caption: false })}${fig("students-field", { caption: false })}</div>
      </div>`,
      notes: "開場不解釋這四張圖，第二關才會用到。直接進回顧。" },

    { seg: "open", html: `
      <div class="cols">
        ${L.ba("recap-original", "recap-heavy", { cls: "fit" })}
        <div>
          <div class="kicker">LAST WEEK</div>
          <h2>上週我們發現……</h2>
          <p class="big">AI 可能偷偷改變<br>我們看到的<span style="color:var(--terra)">自己</span>。</p>
          <p class="lead" style="margin-top:.8em">今天來看看，它會不會也偷偷改變<br>我們看到的<b style="color:var(--cobalt)">世界</b>。</p>
        </div>
      </div>`,
      notes: "用上週的重度美顏圖喚起記憶，問：「還記得 AI 改了哪幾個地方嗎？」1 分鐘內收。然後唸橋接句。" },

    { seg: "open", html: `
      <div class="kicker">QUESTION</div>
      <h2>你今天滑手機，<br>看到的第一則是什麼？</h2>
      <p class="lead">那一則，是你自己找的，還是<em style="color:var(--terra);font-style:normal">有人幫你選的</em>？</p>
      <div class="vote" data-vote>
        ${["A 朋友的動態", "B 推薦的短影音", "C 新聞", "D 廣告"].map(t => `<button type="button"><span>${t}</span><span class="n">0</span><span class="bar" style="width:0"></span></button>`).join("")}
      </div>`,
      notes: "舉手計票（Shift＋點擊減一）。通常 B 最多——順勢說：今天第一關就來玩「推薦」。" },

    { seg: "bubble", html: `
      <div class="cols">
        <div>
          <div class="kicker">STAGE 01</div>
          <h2>第一關<br>推薦泡泡</h2>
          <p class="lead">手機上有一個迷你動態牆。<br>想看的就按 ♥，玩 6 輪。</p>
          <p class="big" style="font-size:clamp(1.3rem,2.8vw,2.2rem)">玩完之後，跟旁邊的人比：<br><span style="color:var(--cobalt)">你們的動態牆一樣嗎？</span></p>
        </div>
        <div>
          <div class="qr-box"><div class="qr" data-qr="#bubble"></div><p>掃碼開始<br><span class="mono soft" data-url="#bubble"></span></p></div>
          <p><span class="countdown timer" data-countdown="420" style="font-size:3rem">07:00</span> <button class="btn" data-cd-toggle>開始 7 分鐘</button></p>
        </div>
      </div>`,
      notes: "規則故意簡單：按讚的主題 ×1.8、沒按的 ×0.85。學生可以點「偷看系統的權重」。巡堂時找出「多樣性」最高和最低的兩位，請他們分享。" },

    { seg: "bubble", html: `
      <div class="kicker">HOW IT WORKS</div>
      <h2>推薦，是一個<em>會轉的圈</em></h2>
      <div class="loop">
        <div>你按讚<small>或多看兩秒</small></div>
        <div>系統記下來<small>這類你喜歡</small></div>
        <div>推更多同類<small>其他的變少</small></div>
        <div>你更常按讚<small>圈越轉越小</small></div>
      </div>
      <p class="lead">轉久了，就變成一個<b style="color:var(--cobalt)">泡泡</b>：不是外面沒有別的，是你<b>看不到</b>。</p>`,
      notes: "強調「看不到」不等於「不存在」。真實的平台用的訊號更多（停留秒數、分享、跟誰互動），但核心就是這個迴圈。不用講「同溫層」術語也可以，學生說出來再補。" },

    { seg: "photo", html: `
      <div class="kicker">STAGE 02</div>
      <h2 style="font-size:clamp(2rem,4.6vw,3.6rem)">第二關｜這四張，<em>哪些是真的</em>？</h2>
      <div data-roa></div>`,
      notes: "每張舉手：真的／AI，老師點按鈕計票（Shift 減一）。四張都投完再按「揭曉」。<b>答案：四張全部是 AI。</b>注意學生對「颱風巨浪」和「操場合照」的判斷——最像真的，往往最危險。" },

    { seg: "photo", html: `
      <div class="kicker">AN IMPORTANT FINDING</div>
      <h2>眼睛，<br>已經不夠用了。</h2>
      <p class="lead">以前教「看手指、看招牌字、看光影」——這些破綻越來越少。</p>
      <p class="big">比起「看出來」，<br>更可靠的是<span style="color:var(--terra)">「查出來」</span>：</p>
      <p class="lead">這張圖<b>從哪裡來</b>？<b>誰</b>先發的？<b>別人</b>有沒有拍到一樣的？</p>`,
      notes: "把重點從「肉眼辨識」轉到「來源查證」。不要讓學生帶走「我看得出來」的過度自信。" },

    { seg: "news", html: `
      <div class="kicker">STAGE 03</div>
      <h2>第三關｜假新聞偵探</h2>
      <div class="steps4">${D.checklist.map(([k, v]) => `<div><b>${k}</b>${v}</div>`).join("")}</div>
      <div class="cols" style="margin-top:1.2em">
        <p class="lead">手機上有 <b>3 則新聞</b>，兩人一組：<br>找警訊 → 下判斷 → 再看解答。</p>
        <div class="qr-box"><div class="qr" data-qr="#news"></div><p><span class="countdown timer" data-countdown="540" style="font-size:2.4rem">09:00</span><br><button class="btn" data-cd-toggle>開始 9 分鐘</button></p></div>
      </div>`,
      notes: "第 3 則是陷阱：文字來自官方、可信，但配圖是 AI 生成的。讓學生發現「新聞可以是真的，照片卻是假的」。" },

    { seg: "news", html: `
      <div class="kicker">TOOLS</div>
      <h2>查不出來？<br>交給<em>查核專家</em></h2>
      <div class="map">${D.factcheck.map(([n, u]) => `<a class="btn ghost" style="justify-content:space-between;font-size:1.2rem" href="${u}" target="_blank" rel="noopener">${n}<span aria-hidden="true">↗</span></a>`).join("")}</div>
      <p class="lead" style="margin-top:1em">在 LINE 收到可疑訊息，<b>先丟給 Cofacts 機器人</b>再決定要不要轉。</p>`,
      notes: "示範一次 Cofacts 查詢（若網路允許）。提醒查核網站也只是「其中一個來源」，不是最終裁判。" },

    { seg: "lie", html: `
      <div class="cols">
        <div>
          <div class="kicker">LIVE DEMO</div>
          <h2>AI 會說謊嗎？</h2>
          <p class="lead">老師現場問 AI 一個問題：</p>
          <div class="prompt-card"><span class="tag">PROMPT</span><p>${D.hallucinationPrompt}</p></div>
          <p class="lead soft">（偷偷告訴你：這部電影根本不存在。）</p>
        </div>
        <div>
          <p class="big" style="font-size:clamp(1.4rem,3vw,2.4rem)">如果 AI 很認真地回答了導演、劇情、得獎評語……</p>
          <p class="lead reveal-target" data-reveal hidden><b style="color:var(--cobalt)">這叫「AI 幻覺」。</b><br>AI 是在「接出最像答案的句子」，不是在「查資料」。語氣越有自信，越要查。</p>
          <button class="btn ghost" data-reveal-btn>揭曉</button>
        </div>
      </div>`,
      notes: "現場用任一聊天 AI 貼上提示。<b>兩種結果都能教：</b>①AI 編了一整套 → 指出語氣多有自信。②AI 說查無此片 → 稱讚它，並問「如果它沒說呢？你怎麼知道？」。結果每次不同，課前先試一次。" },

    { seg: "mine", html: `
      <div class="kicker">3 SECONDS</div>
      <h2>轉傳之前，<em>停三秒</em></h2>
      <p class="big" style="font-size:clamp(1.3rem,3.2vw,2.6rem)">「轉傳之前，我會先<span class="fill">　　　　</span>。」</p>
      <div style="font-size:clamp(1.1rem,2.2vw,1.7rem)" data-chips>
        ${["看是誰說的", "找別家有沒有報", "以圖搜圖", "丟給 Cofacts", "問 AI 但再查一次", "其他＿＿"].map(t => `<button type="button" class="chip" aria-pressed="false">${t}</button>`).join("")}
      </div>
      <p class="lead soft" style="margin-top:1em">寫在手機任務頁最後一格，兩人互看。</p>`,
      notes: "鼓勵寫具體動作，不寫「小心」這種抽象詞。" },

    { seg: "reveal", html: `
      <div class="kicker">REVEAL</div>
      <h2>你今天其實玩了……</h2>
      <div class="map" data-map>
        ${[["按讚、看動態牆", "推薦演算法／個人化"], ["比誰的泡泡大", "同溫層與演算法偏誤"], ["猜真假照片", "生成式 AI 影像"], ["假新聞偵探", "資訊查證與媒體素養"], ["AI 一本正經亂講", "AI 幻覺與人機信任"], ["轉傳前停三秒", "傳播責任與數位公民"]].map(([a, b]) => `<button type="button">${a}<span class="to">${b}</span></button>`).join("")}
      </div>
      <p class="big" style="margin-top:.6em;font-size:clamp(1.3rem,3vw,2.4rem)">這些也都是<span style="color:var(--terra)">資訊傳播</span>。</p>`,
      notes: "逐張點開。收三句：<b>① 我看到的世界，是被挑選過的。② 眼見不一定為憑，先查來源。③ 轉傳之前，停三秒。</b>" },

    { seg: "reveal", html: `
      <div class="kicker">TAKE AWAY</div>
      <h2>兩堂課，一句話</h2>
      <p class="big">AI 會改變我們看到的<span style="color:var(--terra)">自己</span>，<br>也會改變我們看到的<span style="color:var(--cobalt)">世界</span>。</p>
      <p class="lead">所以，最後要不要相信、要怎麼呈現自己——<b>由你決定</b>。</p>
      <div class="three" style="margin-top:1em"><p>我看到的世界，是被挑選過的。</p><p>眼見不一定為憑，先查來源。</p><p>轉傳之前，停三秒。</p></div>
      <div class="qr-box" style="margin-top:1em"><div class="qr" data-qr="#feedback"></div><p class="lead" style="margin:0"><b style="color:var(--cobalt)">掃碼填 1 分鐘回饋 →</b><br><a class="btn ghost" href="../stats.html?s=2" target="_blank" style="margin-top:.4em">看全班結果</a></p></div>`,
      notes: "把兩堂課收在同一句話。學生掃碼填回饋後，按「看全班結果」投影即時統計（先按「從現在開始算」只看這一班）。" }
  ];

  window.DECK(SEGS, S, () => {
    document.querySelectorAll("[data-roa]").forEach(el => L.w2.realOrAI(el, "teacher"));
    // 第一堂引擎的投票、標籤、揭曉、倒數已由 deck.js 處理
  });
})();
