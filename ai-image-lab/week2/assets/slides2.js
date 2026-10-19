/* 第二堂（10/20）投影｜AI 說的，是真的嗎？——從好奇到查證
   講少、做多：每段講述 ≤ 1 分鐘；STEP 頁與學生手機上的步驟一一對應。 */
(function () {
  var L = window.LAB, D = window.W2, fig = L.fig;
  var ST = window.W2STEPS.STEPS, N = ST.length - 1;
  var SEGS = {
    open: { name: "開場＋準備", from: 0, to: 8 },
    s1: { name: "STEP 1｜好奇", from: 8, to: 13 },
    s2: { name: "STEP 2｜問", from: 13, to: 25 },
    s3: { name: "STEP 3｜查", from: 25, to: 38 },
    s4: { name: "STEP 4｜想", from: 38, to: 44 },
    s5: { name: "STEP 5｜態度", from: 44, to: 56 },
    s6: { name: "收尾", from: 56, to: 60 }
  };

  function stepSlide(i, extra) {
    var s = ST[i];
    return '<div class="step-slide cols wide-left"><div>' +
      '<div class="kicker">STEP ' + i + " / " + N + "｜現在做</div>" +
      '<h2 style="font-size:clamp(2rem,4.6vw,3.8rem)">' + s.title + "</h2>" +
      (s.q ? '<p class="step-q" style="font-size:clamp(1.1rem,2vw,1.6rem)">' + s.q + "</p>" : "") +
      '<ol class="todo">' + s.todo.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ol>" +
      (s.fast ? '<p class="fast-line"><b>⚡ 做完的人：</b>' + s.fast + "</p>" : "") + (extra || "") +
      "</div><div>" +
      '<div class="countdown timer" data-countdown="' + s.min * 60 + '">' + String(s.min).padStart(2, "0") + ":00</div>" +
      '<p><button class="btn" data-cd-toggle>開始 ' + s.min + ' 分鐘</button> <button class="btn ghost" data-cd-reset>重設</button></p>' +
      '<div class="qr-box"><div class="qr" data-qr="#step-' + i + '"></div><p>還沒跟上？<br>掃碼直接到 STEP ' + i + "</p></div>" +
      "</div></div>";
  }
  var LOOP = '<div class="loop loop5"><div>好奇<small>我想知道什麼？為什麼？</small></div><div>猜<small>先有自己的想法</small></div><div>問<small>把需求說清楚</small></div><div>查<small>找第二個來源</small></div><div>想<small>學到什麼？下一個好奇？</small></div></div>';

  var S = [
    { seg: "open", html:
      '<div class="cols wide-left"><div>' +
        '<div class="kicker">AI INFO LAB ／ 高中微課程 第二堂</div>' +
        "<h2>AI 說的，<br><em>是真的嗎</em>？</h2>" +
        '<p class="lead soft">從好奇到查證：帶著一個你真的想知道的問題，問 AI、查證它、再想一想。</p>' +
      '</div><div class="grid2x2">' + fig("snow-taipei", { caption: false }) + fig("shiba-chef", { caption: false }) + fig("typhoon-wave", { caption: false }) + fig("students-field", { caption: false }) + "</div></div>",
      notes: "一句話開場：上週看 AI 怎麼改「我們的樣子」，今天看 AI 說的「話」可不可信。右邊四張圖先不解釋，STEP 5 會用到。" },

    { seg: "open", html:
      '<div class="cols"><div>' +
        '<div class="kicker">HOW TODAY WORKS</div><h2>今天怎麼玩</h2>' +
        '<ol class="todo" style="max-width:640px">' +
          "<li><b>兩人一組</b>，每人用自己的手機</li>" +
          "<li>掃右邊 QR code，<b>照手機上的 STEP 一步一步做</b></li>" +
          "<li>每步做完勾「完成了嗎？」，再打開 <b>💡</b> 看這一步的重點</li>" +
          "<li>先做完做 <b>⚡ 快手任務</b>；卡住先看「卡住了？」</li>" +
        "</ol>" +
        '<p class="lead soft">AI 工具不限：ChatGPT、Gemini、Copilot 都可以。</p>' +
      '</div><div><div class="qr-box"><div class="qr" data-qr="#step-0"></div><p class="lead">掃這裡開始<br><span class="mono soft" data-url="#step-0"></span></p></div>' +
      '<div class="box note" style="margin-top:12px"><b>三個規則</b><br>1　截圖只給搭檔看，不轉傳、不上傳<br>2　不把自己或別人的個資貼給 AI<br>3　卡住就舉手</div></div></div>',
      notes: "掃碼、找搭檔。接著直接進 STEP 0。" },

    { seg: "open", html: stepSlide(0), notes: "5 分鐘：找搭檔＋暖身猜首頁。提醒：不想給人看首頁的，改口頭說。" },

    { seg: "open", html:
      '<div class="kicker">1 MINUTE｜今天的主線</div>' +
      '<h2>AI 很懂你，<br>但它說的<em>都是真的</em>嗎？</h2>' + LOOP +
      '<p class="lead">今天走完這一圈：帶著好奇問 AI，再自己查證。</p>',
      notes: "問：「搭檔 3 個全中的舉手？」然後說：AI 比搭檔更懂你喜歡什麼；但懂你，不代表它說的都對。今天練的是這五步。" },

    { seg: "s1", html: stepSlide(1), notes: "5 分鐘。強調「先不要問 AI，自己先猜」。巡堂看到太大的問題（例如『宇宙怎麼來』）可以建議縮小。" },

    { seg: "s2", html: stepSlide(2), notes: "10 分鐘。老師同時在投影上示範陷阱題，給沒有 AI 可用的同學看。" },
    { seg: "s2", html:
      '<div class="kicker">1 MINUTE｜AI 幻覺</div><h2>AI 不是在「查」，<br>是在「接」</h2>' +
      '<p class="big" style="font-size:clamp(1.4rem,3vw,2.4rem)">它接出<span style="color:var(--terra)">最像答案的句子</span>，<br>不知道的時候也常常照接。</p>' +
      '<p class="lead">語氣越有自信，越要查。問得好能減少它亂編，但<b>不能保證它不編</b>。</p>',
      notes: "問全班：陷阱題「整套編得很完整」的舉手？「老實說查不到」的舉手？兩種都有最好：同一題，不同 AI、不同時候答案不一樣，所以要查。" },

    { seg: "s3", html: stepSlide(3), notes: "12 分鐘。最常見的錯：再問一次 AI 當作查證。提醒「查＝找不是 AI 的來源」。" },
    { seg: "s3", html:
      '<div class="kicker">1 MINUTE｜什麼叫「查到了」</div><h2>好的來源，<br>要過三關</h2>' +
      '<div class="steps4" style="grid-template-columns:repeat(3,1fr)"><div><b>說得出是誰</b>政府、學校、研究單位、媒體，有作者有單位</div><div><b>點得開</b>連結真的存在，不是 AI 編的網址</div><div><b>對得上</b>內容真的寫了 AI 說的那句話</div></div>' +
      '<p class="lead" style="margin-top:1em">三關都過，才算「查到一樣」。查不到的，不要寫進報告。</p>',
      notes: "請一組分享：有沒有遇到 AI 給的連結點不開，或點開內容對不上的？" },

    { seg: "s4", html: stepSlide(4), notes: "6 分鐘。搭檔互評「一個讚＋一個建議」寫在對方手機上。" },

    { seg: "s5", html:
      '<div class="kicker">1 MINUTE｜AI 也會編照片和聲音</div>' +
      '<h2 style="font-size:clamp(2rem,4.6vw,3.6rem)">這四張，<em>哪些是真的</em>？</h2><div data-roa></div>',
      notes: "快速舉手投票，按「揭曉」：四張全部是 AI。接著說：會編文字、編照片，也能模仿聲音——這就是下一步情境卡的第一張。" },
    { seg: "s5", html: stepSlide(5), notes: "10 分鐘。兩人一起做 4 張情境卡。巡堂聽他們討論「最可能發生在自己身上的是哪一張」。AI 情人那張可能有人尷尬，不用點名。" },
    { seg: "s5", html:
      '<div class="kicker">1 MINUTE｜HARNESS</div><h2>你，就是 AI 的<em>韁繩</em></h2>' +
      '<div class="steps4"><div><b>方向</b>我決定要問什麼、為什麼問</div><div><b>規則</b>我不給個資、不拿別人的臉</div><div><b>檢查</b>它說的，我查證</div><div><b>責任</b>交出去的東西，我負責</div></div>' +
      '<p class="lead" style="margin-top:1em">AI 是很會跑的馬。<b>韁繩在你手上</b>，不是在它手上。</p>',
      notes: "Harness 在 AI 領域指包在模型外面、引導和限制它的那一圈。對學生來說，就是自己握住方向。" },

    { seg: "s6", html: stepSlide(6,
      '<div class="map" data-map style="margin-top:12px">' +
        [["好奇、猜", "研究問題與假設"], ["把需求說清楚", "提示設計（prompt）"], ["查證來源", "資訊素養"], ["AI 幻覺、詐騙", "人機信任與 AI 倫理"]].map(function (x) { return '<button type="button">' + x[0] + '<span class="to">' + x[1] + "</span></button>"; }).join("") +
      "</div>"),
      notes: "學生寫守則、截圖時，老師逐張點開：這些都是資訊傳播在做的事。" },

    { seg: "s6", html:
      '<div class="kicker">TAKE AWAY</div><h2>兩堂課，一句話</h2>' +
      '<p class="big">AI 會改變我們看到的<span style="color:var(--terra)">自己</span>，<br>也會一本正經地告訴我們<span style="color:var(--cobalt)">世界</span>。</p>' +
      '<div class="three" style="margin-top:1em"><p>好奇是起點：先想清楚我為什麼想知道。</p><p>AI 會一本正經地編：它說的，我要查。</p><p>方向盤在我手上：我決定、我查證、我負責。</p></div>',
      notes: "停久一點讓學生拍照。" }
  ];

  window.DECK(SEGS, S, function () {
    document.querySelectorAll("[data-roa]").forEach(function (el) { L.w2.realOrAI(el, "teacher"); });
  });
})();
