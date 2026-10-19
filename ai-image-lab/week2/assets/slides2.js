/* 第二堂（10/20）投影：講少、做多
   原則：每段講述 ≤ 1 分鐘；STEP 頁與學生手機上的步驟一一對應，計時器跟著走。 */
(function () {
  var L = window.LAB, D = window.W2, fig = L.fig;
  var ST = window.W2STEPS.STEPS;
  var SEGS = {
    open: { name: "開場", from: 0, to: 8 },
    s1: { name: "STEP 1｜推薦泡泡", from: 8, to: 18 },
    s2: { name: "STEP 2｜考考 AI", from: 18, to: 30 },
    s3: { name: "STEP 3｜做假新聞", from: 30, to: 42 },
    s4: { name: "STEP 4｜互當偵探", from: 42, to: 54 },
    s5: { name: "STEP 5｜收尾", from: 54, to: 60 }
  };

  function stepSlide(i, extra) {
    var s = ST[i];
    return '<div class="step-slide cols wide-left"><div>' +
      '<div class="kicker">STEP ' + i + ' / 5｜現在做</div>' +
      '<h2 style="font-size:clamp(2.2rem,5vw,4.2rem)">' + s.title + "</h2>" +
      '<p class="lead"><b>目標：</b>' + s.goal + "</p>" +
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
        "<h2>AI 懂不懂？<br>假新聞<em>怎麼來</em>？</h2>" +
        '<p class="lead soft">今天少聽多做：你會親手考 AI、親手做一則假新聞，再跟搭檔互當偵探。</p>' +
      '</div><div class="grid2x2">' + fig("snow-taipei", { caption: false }) + fig("shiba-chef", { caption: false }) + fig("typhoon-wave", { caption: false }) + fig("students-field", { caption: false }) + "</div></div>",
      notes: "不解釋這四張圖，下一頁直接玩。" },

    { seg: "open", html:
      '<div class="kicker">WARM UP｜3 分鐘</div>' +
      '<h2 style="font-size:clamp(2rem,4.6vw,3.6rem)">先猜：這四張，<em>哪些是真的</em>？</h2><div data-roa></div>',
      notes: "每張舉手投「真的／AI」，老師點按鈕計票（Shift 減一），四張投完按「揭曉」：<b>四張全部是 AI。</b>只說一句：「眼睛已經不夠用了，今天我們練『查』。」然後直接進下一頁。" },

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
      '<div class="box note" style="margin-top:12px"><b>三個規則</b><br>1　假新聞只在教室用，不轉傳、不上傳<br>2　不放真人、同學的臉，不做災難、政治、嚇人的內容<br>3　卡住就舉手</div></div></div>',
      notes: "這頁給 2 分鐘：掃碼、找搭檔、完成 STEP 0。巡一圈確認大家都打開了任務頁和 AI 工具。" },

    { seg: "s1", html: stepSlide(1), notes: "8 分鐘。巡堂找「多樣性」最高和最低的兩位，等一下請他們講一句。" },
    { seg: "s1", html:
      '<div class="kicker">1 MINUTE</div><h2>推薦，是一個<em>會轉的圈</em></h2>' +
      '<div class="loop"><div>你按讚<small>或多看兩秒</small></div><div>系統記下來<small>這類你喜歡</small></div><div>推更多同類<small>其他的變少</small></div><div>你更常按讚<small>圈越轉越小</small></div></div>' +
      '<p class="lead">不是外面沒有別的，是你<b style="color:var(--cobalt)">看不到</b>。</p>',
      notes: "請多樣性最高、最低的兩位各說一句，然後講這頁，1 分鐘內結束。" },

    { seg: "s2", html: stepSlide(2), notes: "10 分鐘。提醒問題 B 要問「自己很熟、網路上不有名」的東西，AI 最容易在這裡編。老師同時在投影上示範問題 A，給沒有 AI 可用的同學看。" },
    { seg: "s2", html:
      '<div class="kicker">1 MINUTE</div><h2>AI 不是在「查」，<br>是在「接」</h2>' +
      '<p class="big" style="font-size:clamp(1.4rem,3vw,2.4rem)">它接出<span style="color:var(--terra)">最像答案的句子</span>，<br>不知道的時候也常常照接。</p>' +
      '<p class="lead">語氣越有自信，越要查。這叫 <b style="color:var(--cobalt)">AI 幻覺</b>。</p>',
      notes: "問全班：誰的 AI 整個在編？誰的說它不知道？舉手數一下就好。" },

    { seg: "s3", html: stepSlide(3), notes: "12 分鐘。再講一次規則 2。看到太像真的、會嚇到人的標題，請學生換一個。沒辦法生圖的用備援圖。" },

    { seg: "s4", html: stepSlide(4), notes: "10 分鐘。強調偵探卡是寫在「自己的手機」，寫完按「給搭檔看」。沒有搭檔的人用練習卡。" },
    { seg: "s4", html:
      '<div class="kicker">1 MINUTE</div><h2>眼睛不夠用，<br>就用<em>查證四步</em></h2>' +
      '<div class="steps4">' + D.checklist.map(function (c) { return "<div><b>" + c[0] + "</b>" + c[1] + "</div>"; }).join("") + "</div>" +
      '<p class="lead" style="margin-top:1em">查不出來？交給 <b>台灣事實查核中心、Cofacts、MyGoPen</b>。</p>',
      notes: "請 1–2 組分享：搭檔用哪一步抓到你的破綻？" },

    { seg: "s5", html: stepSlide(5,
      '<div class="map" data-map style="margin-top:12px">' +
        [["按讚、養動態牆", "推薦演算法"], ["考 AI", "AI 幻覺與人機信任"], ["做假新聞", "生成式 AI 影像"], ["互當偵探", "資訊查證與媒體素養"]].map(function (x) { return '<button type="button">' + x[0] + '<span class="to">' + x[1] + "</span></button>"; }).join("") +
      "</div>"),
      notes: "學生寫規則、截圖紀錄時，老師逐張點開揭曉：這些都是資訊傳播在做的事。" },

    { seg: "s5", html:
      '<div class="kicker">TAKE AWAY</div><h2>兩堂課，一句話</h2>' +
      '<p class="big">AI 會改變我們看到的<span style="color:var(--terra)">自己</span>，<br>也會改變我們看到的<span style="color:var(--cobalt)">世界</span>。</p>' +
      '<div class="three" style="margin-top:1em"><p>我看到的世界，是被挑選過的。</p><p>眼見不一定為憑，先查來源。</p><p>轉傳之前，停三秒。</p></div>',
      notes: "停久一點讓學生拍照。" }
  ];

  window.DECK(SEGS, S, function () {
    document.querySelectorAll("[data-roa]").forEach(function (el) { L.w2.realOrAI(el, "teacher"); });
  });
})();
