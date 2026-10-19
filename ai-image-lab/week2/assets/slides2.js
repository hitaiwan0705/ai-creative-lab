/* 第二堂（10/20）投影：講少、做多
   原則：每段講述 ≤ 1 分鐘；STEP 頁與學生手機上的步驟一一對應，計時器跟著走。 */
(function () {
  var L = window.LAB, D = window.W2, fig = L.fig;
  var ST = window.W2STEPS.STEPS;
  var SEGS = {
    open: { name: "開場", from: 0, to: 8 },
    s1: { name: "STEP 1｜AI 眼中的你", from: 8, to: 18 },
    s2: { name: "STEP 2｜考考 AI", from: 18, to: 30 },
    s3: { name: "STEP 3｜量身假新聞", from: 30, to: 42 },
    s4: { name: "STEP 4｜互當偵探", from: 42, to: 54 },
    s5: { name: "STEP 5｜收尾", from: 54, to: 60 }
  };

  function stepSlide(i, extra) {
    var s = ST[i];
    return '<div class="step-slide cols wide-left"><div>' +
      '<div class="kicker">STEP ' + i + ' / 5｜現在做</div>' +
      '<h2 style="font-size:clamp(2.2rem,5vw,4.2rem)">' + s.title + "</h2>" +
      (s.q ? '<p class="step-q" style="font-size:clamp(1.1rem,2vw,1.6rem)">' + s.q + "</p>" : "") +
      '<p class="lead"><b>這一步要做：</b>' + s.goal + "</p>" +
      '<ol class="todo">' + s.todo.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ol>" +
      (s.fast ? '<p class="fast-line"><b>⚡ 做完的人：</b>' + s.fast + "</p>" : "") + (extra || "") +
      "</div><div>" +
      '<div class="countdown timer" data-countdown="' + s.min * 60 + '">' + String(s.min).padStart(2, "0") + ":00</div>" +
      '<p><button class="btn" data-cd-toggle>開始 ' + s.min + ' 分鐘</button> <button class="btn ghost" data-cd-reset>重設</button></p>' +
      '<div class="qr-box"><div class="qr" data-qr="#step-' + i + '"></div><p>還沒跟上？<br>掃碼直接到 STEP ' + i + "</p></div>" +
      "</div></div>";
  }

  var S = [
    { seg: "open", html:
      '<div class="cols wide-left"><div>' +
        '<div class="kicker">AI INFO LAB ／ 高中微課程 第二堂</div>' +
        "<h2>AI 很懂你，<br>但它<em>懂真相</em>嗎？</h2>" +
        '<p class="lead soft">今天少聽多做：讓搭檔從你的首頁猜你、親手考 AI、幫搭檔量身做一則假新聞，再互當偵探。</p>' +
      '</div><div class="grid2x2">' + fig("snow-taipei", { caption: false }) + fig("shiba-chef", { caption: false }) + fig("typhoon-wave", { caption: false }) + fig("students-field", { caption: false }) + "</div></div>",
      notes: "上週我們看 AI 怎麼改「自己」；今天只問一個問題：AI 很懂你，但它懂真相嗎？唸完直接進下一頁，不展開。" },

    { seg: "open", html:
      '<div class="cols"><div>' +
        '<div class="kicker">HOW TODAY WORKS</div>' +
        "<h2>今天怎麼玩</h2>" +
        '<ol class="todo" style="max-width:640px">' +
          "<li><b>兩人一組</b>，每人用自己的手機</li>" +
          "<li>掃右邊 QR code，<b>照手機上的 STEP 一步一步做</b></li>" +
          "<li>每步做完，在手機上勾「完成了嗎？」</li>" +
          "<li>先做完的，做 <b>⚡ 快手任務</b>；卡住先看「卡住了？」</li>" +
        "</ol>" +
        '<p class="lead soft">AI 工具不限：ChatGPT、Gemini、Copilot 都可以。</p>' +
      '</div><div><div class="qr-box"><div class="qr" data-qr="#step-0"></div><p class="lead">掃這裡開始<br><span class="mono soft" data-url="#step-0"></span></p></div>' +
      '<div class="box note" style="margin-top:12px"><b>三個規則</b><br>1　截圖、假新聞只在教室給搭檔看，不轉傳、不上傳<br>2　不放真人、同學的臉，不做災難、政治、嚇人的內容<br>3　卡住就舉手</div></div></div>',
      notes: "這頁給 2 分鐘：掃碼、找搭檔、完成 STEP 0。巡一圈確認大家都打開了任務頁和 AI 工具。" },

    { seg: "s1", html: stepSlide(1), notes: "8 分鐘。先講一次隱私：只截推薦頁，遮帳號名稱、私訊、朋友的臉；不想給人看的改口頭描述。巡堂找「3 個全中」和「完全沒猜中」各一組，等一下請他們講一句。" },
    { seg: "s1", html:
      '<div class="kicker">1 MINUTE</div><h2>你的首頁，是 AI<br>替你畫的<em>像</em></h2>' +
      '<p class="lead">搭檔看 30 秒就猜得出你；AI 看過你上千次的停留、按讚、滑過。</p>' +
      '<div class="loop"><div>你按讚<small>或多看兩秒</small></div><div>系統記下來<small>這類你喜歡</small></div><div>推更多同類<small>其他的變少</small></div><div>你更常按讚<small>圈越轉越小</small></div></div>' +
      '<p class="lead">那個「沒搜過卻一直出現」的東西，就是它在推你往某個方向。外面的世界沒有變小，是你<b style="color:var(--cobalt)">看到的</b>變小了。</p>',
      notes: "請全中、沒猜中的兩組各說一句；再問：誰有「沒搜過卻一直出現」的？舉一個例子就好。1 分鐘內結束。" },

    { seg: "s2", html: stepSlide(2), notes: "10 分鐘。提醒問題 B 要問「自己很熟、網路上不有名」的東西，AI 最容易在這裡編。老師同時在投影上示範問題 A，給沒有 AI 可用的同學看。" },
    { seg: "s2", html:
      '<div class="kicker">1 MINUTE</div><h2>AI 不是在「查」，<br>是在「接」</h2>' +
      '<p class="big" style="font-size:clamp(1.4rem,3vw,2.4rem)">它接出<span style="color:var(--terra)">最像答案的句子</span>，<br>不知道的時候也常常照接。</p>' +
      '<p class="lead">語氣越有自信，越要查。這叫 <b style="color:var(--cobalt)">AI 幻覺</b>。</p>' +
      '<p class="big" style="font-size:clamp(1.3rem,2.8vw,2.2rem);margin-top:.6em">它很懂你喜歡什麼，<br>卻不一定懂<span style="color:var(--terra)">什麼是真的</span>。</p>',
      notes: "問全班：誰的 AI 整個在編？誰的說它不知道？舉手數一下就好。" },

    { seg: "s3", html:
      '<div class="kicker">AI 也會編圖片｜2 分鐘</div>' +
      '<h2 style="font-size:clamp(2rem,4.6vw,3.6rem)">它會編文字，也會編照片：<em>哪些是真的</em>？</h2><div data-roa></div>',
      notes: "每張舉手投「真的／AI」，老師點按鈕計票（Shift 減一），四張投完按「揭曉」：<b>四張全部是 AI。</b>只說一句：「眼睛已經不夠用了，今天我們練『查』。」接著說：「等一下換你用 AI 做一張，而且是專門做給你搭檔看的。」" },

    { seg: "s3", html: stepSlide(3), notes: "12 分鐘。關鍵是「針對搭檔的喜好」：用 STEP 1 猜到的主題做一則無害、好笑的假新聞。再講一次規則 2；太像真的、會嚇到人的標題請學生換一個。沒辦法生圖的用備援圖。" },

    { seg: "s4", html: stepSlide(4), notes: "10 分鐘。強調偵探卡是寫在「自己的手機」，寫完按「給搭檔看」。沒有搭檔的人用練習卡。" },
    { seg: "s4", html:
      '<div class="kicker">1 MINUTE</div><h2>眼睛不夠用，<br>就用<em>查證四步</em></h2>' +
      '<div class="steps4">' + D.checklist.map(function (c) { return "<div><b>" + c[0] + "</b>" + c[1] + "</div>"; }).join("") + "</div>" +
      '<p class="lead" style="margin-top:1em">打中你喜好的消息最容易讓人放下戒心。<br>查不出來？交給 <b>台灣事實查核中心、Cofacts、MyGoPen</b>。</p>',
      notes: "問全班：「差點就信了」打 4、5 分的舉手。請一組說：他用你的哪個喜好騙到你？然後講這頁。" },

    { seg: "s5", html: stepSlide(5,
      '<div class="map" data-map style="margin-top:12px">' +
        [["從首頁猜你", "推薦演算法與個人化"], ["考 AI", "AI 幻覺與人機信任"], ["量身做假新聞", "生成式 AI 與精準投放"], ["互當偵探", "資訊查證與媒體素養"]].map(function (x) { return '<button type="button">' + x[0] + '<span class="to">' + x[1] + "</span></button>"; }).join("") +
      "</div>"),
      notes: "學生寫規則、截圖紀錄時，老師逐張點開揭曉：這些都是資訊傳播在做的事。" },

    { seg: "s5", html:
      '<div class="kicker">TAKE AWAY</div><h2>兩堂課，一句話</h2>' +
      '<p class="big">AI 會改變我們看到的<span style="color:var(--terra)">自己</span>，<br>也會改變我們看到的<span style="color:var(--cobalt)">世界</span>。</p>' +
      '<div class="three" style="margin-top:1em"><p>我的首頁，是 AI 依照我挑過的世界。</p><p>AI 很懂我，卻不一定懂真相。</p><p>越打中我喜好的消息，越要停三秒再轉。</p></div>',
      notes: "停久一點讓學生拍照。" }
  ];

  window.DECK(SEGS, S, function () {
    document.querySelectorAll("[data-roa]").forEach(function (el) { L.w2.realOrAI(el, "teacher"); });
  });
})();
