/* 第二堂「帶著走」任務模式：一次只看一步，每步都有
   目標 → 做法 → 完成條件 → 卡住了？ → 快手任務 → 搭檔互評
   作答只存在這支手機（localStorage），不會上傳。 */
(function () {
  var L = window.LAB, D = window.W2;
  var KEY = "ailab-w2-v1";
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { state = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var HEADLINES = [
    "台北 101 一夜之間變成粉紅色",
    "淡水河邊出現一群企鵝",
    "學校操場長出一朵比人還高的香菇",
    "捷運車廂裡有一隻柴犬當站長",
    "夜市出現會自己翻雞排的機器人"
  ];
  var PROMPT_FAKE_MOVIE = D.hallucinationPrompt;

  function imgPrompt() {
    var h = state.headline || "＿＿＿＿";
    return "請生成一張看起來像路人用手機隨手拍的新聞照片：" + h + "。真實光線、旁邊有路人、畫面有一點雜訊和晃動，不要有文字浮水印。";
  }

  /* ---------- 步驟定義 ---------- */
  var STEPS = [
    {
      id: "s0", min: 2, title: "準備", q: "今天只問一件事：AI 很懂你，但它懂真相嗎？",
      goal: "找好搭檔、打開 AI，知道今天的規則。",
      todo: [
        "兩人一組，在下面寫搭檔的名字（綽號也可以）。",
        "手機開一個 AI 聊天工具：ChatGPT、Gemini、Copilot 都可以。",
        "確認它能不能生圖（多數可以）。不能也沒關係，STEP 3 有備援圖。"
      ],
      body: function () {
        return field("partner", "我的搭檔", "例：小安") +
          '<div class="box note"><b>今天的路線</b><br>STEP 1　AI 有多懂你？（看你的首頁）<br>STEP 2　AI 懂不懂事實？（考考 AI）<br>STEP 3　如果用 AI 來騙一個很懂的人？（做假新聞）<br>STEP 4　抓得出來嗎？（互當偵探）<br>STEP 5　我的轉傳規則</div>' +
          '<div class="box"><b>三個規則</b><br>1　截圖、假新聞都只在教室給搭檔看，不轉傳、不上傳。<br>2　不放真人、同學的臉，不做災難、政治、會讓人害怕的內容。<br>3　看不懂步驟就舉手，或先看「卡住了？」。</div>';
      },
      done: ["有搭檔了", "AI 工具打開了"]
    },
    {
      id: "s1", min: 8, title: "AI 眼中的你", q: "只看你的首頁，別人猜得出你是誰嗎？",
      goal: "用你自己的推薦首頁，讓搭檔反過來猜你平常愛看什麼。",
      todo: [
        "打開你<b>最常滑</b>的 App 推薦頁（YouTube 首頁、IG 探索、TikTok「為你推薦」、Shorts 都可以），截一張圖。<b>不要截到帳號名稱、私訊、朋友的臉。</b>",
        "把截圖給搭檔看 30 秒。搭檔在<b>你的手機</b>寫下：他猜你愛看的 3 個關鍵字、猜你是怎樣的人。",
        "你揭曉：猜中幾個？再寫下一個「我從沒搜尋過，卻一直出現」的東西。"
      ],
      body: function () {
        return peer("p1", "搭檔填：我猜你……", [
            ["k", "你平常愛看的 3 個關鍵字", "例：籃球、貓、韓團"],
            ["who", "我猜你是一個……的人", "例：放學會去打球、很愛動物"]
          ]) +
          field("me", "我自己覺得我愛看的", "例：籃球、貓、滷味") +
          '<div class="box"><b>搭檔猜中幾個？</b><div class="check" data-pick="hit" style="margin-top:6px">' +
          ["0 個", "1 個", "2 個", "3 個全中"].map(function (o) { return '<button type="button" data-v="' + o + '" aria-pressed="' + (state.hit === o) + '">' + o + "</button>"; }).join("") + "</div></div>" +
          field("never", "我從沒搜尋過，卻一直出現的", "例：一直推露營影片，可是我從沒搜過") +
          '<details class="box"><summary><b>不想給別人看自己的首頁？</b></summary><p>完全沒關係。改成口頭描述：「我首頁最近最常出現的 5 則是……」，讓搭檔照樣猜。</p></details>';
      },
      done: ["搭檔猜完了", "我揭曉並記下猜中幾個", "寫下「沒搜過卻一直出現」的東西"],
      point: "搭檔只看<b>一張圖、30 秒</b>就能猜出你。推薦系統看過你上千次的停留、按讚、滑過，它猜得更準——你的首頁，就是 AI 替你畫的像，也是它替你挑過的世界。<br>那個「沒搜過卻一直出現」的東西，就是 AI 在推你往某個方向。",
      fast: "打開第二個 App 截圖：兩個 App 眼中的你一樣嗎？哪一個比較「懂」你？",
      help: "沒有常用的 App？用 YouTube 首頁就好，不用登入也會有推薦。"
    },
    {
      id: "s2", min: 10, title: "考考 AI：它懂不懂事實？", q: "AI 這麼懂你，那它懂不懂「什麼是真的」？",
      goal: "問 AI 兩個問題，抓出它什麼時候在「編」。",
      todo: [
        "複製「問題 A」，貼給你的 AI。<b>這部電影其實不存在。</b>",
        "自己出「問題 B」：問一個<b>你很熟、但網路上不太有名</b>的東西。",
        "記下 AI 的表現，再跟搭檔交換手機，幫對方圈出一句「你覺得是編的」。"
      ],
      body: function () {
        return '<div class="box"><span class="tag">問題 A</span><p id="pa">' + esc(PROMPT_FAKE_MOVIE) + '</p><div class="row"><button type="button" class="btn" data-copy="pa">複製問題 A</button></div></div>' +
          judge("a", "AI 怎麼回答問題 A？") +
          '<div class="box"><span class="tag">問題 B</span>' +
          '<p class="soft" style="color:var(--ink-soft);margin:.4em 0">例：「請介紹我們學校的熱音社」「請介紹我家巷口的○○麵店」「我們學校的校慶是哪一天？」</p>' +
          field("qb", "我的問題 B", "請介紹＿＿＿＿") + "</div>" +
          judge("b", "AI 怎麼回答問題 B？") +
          peer("p2", "搭檔填：我幫你圈一句", [
            ["sus", "我覺得「這句是編的」（抄下那一句）", "例：「導演王大明以這部片拿下……」"],
            ["why", "為什麼覺得是編的？", "例：太剛好、查不到、名字很奇怪"]
          ]);
      },
      done: ["問了問題 A", "問了自己的問題 B", "搭檔幫我圈了一句"],
      point: "AI 不是在「查資料」，而是在「接出最像答案的句子」。不知道的時候，它常常照樣接，而且語氣很有自信——這叫 <b>AI 幻覺</b>。<br>它很懂你喜歡什麼，卻不一定懂什麼是真的。",
      fast: "追問 AI：「你確定嗎？請給我資料來源。」它會改口嗎？給的連結點得開嗎？",
      help: "沒有 AI 可以用？跟搭檔共用一支手機，或看老師投影的示範結果來記錄。"
    },
    {
      id: "s3", min: 12, title: "幫搭檔量身做一則假新聞", q: "如果有人知道你愛看什麼，再用 AI 做一則假新聞給你，你會信嗎？",
      goal: "用 STEP 1 知道的搭檔喜好，做一則「他最可能差點相信」的練習用假新聞。",
      todo: [
        "看 STEP 1：搭檔愛看什麼？從那個主題想一個<b>無害、好笑</b>的假標題（或用下面的範例）。",
        "複製生圖指令貼給 AI，生一張「看起來像真的」新聞照。",
        "幫它寫一個「來源」（例如某粉專、某群組），做成下面的新聞卡。"
      ],
      body: function () {
        var opts = HEADLINES.map(function (h) {
          return '<button type="button" class="chip" data-hl="' + esc(h) + '" aria-pressed="' + (state.headline === h) + '">' + esc(h) + "</button>";
        }).join("");
        return '<div class="box note" id="partnerLikes"></div>' +
          field("headline", "我的假標題（針對搭檔的喜好）", "例：（愛貓）台北捷運開放貓咪站長上班") +
          '<details class="box"><summary><b>想不到？用範例標題</b></summary><div style="margin-top:6px" data-hls>' + opts + "</div></details>" +
          '<div class="box"><span class="tag">生圖指令</span><p id="ip">' + esc(imgPrompt()) + '</p><div class="row"><button type="button" class="btn" data-copy="ip">複製生圖指令</button></div></div>' +
          field("source", "這則「新聞」的來源", "例：某粉絲專頁｜分享 3.2 萬次") +
          '<details class="box"><summary><b>沒辦法生圖？用老師的備援圖</b></summary><p>選一張當作新聞照（四張都是 AI 生成的）。</p><div class="roa-grid" data-backup></div></details>' +
          '<div class="news-card" id="newsCard"></div>';
      },
      mount: function (el) {
        var likes = el.querySelector("#partnerLikes");
        likes.innerHTML = field("myGuess", "搭檔愛看什麼？（你在 STEP 1 幫他猜、寫在他手機上的，抄過來）", "例：籃球、貓、韓團");
        var grid = el.querySelector("[data-backup]");
        grid.innerHTML = D.photos.map(function (p) {
          return '<button type="button" class="sort-card' + (state.backup === p.key ? " picked" : "") + '" data-bk="' + p.key + '">' + L.fig(p.key, { caption: false, alt: p.label }) + "</button>";
        }).join("");
        L.wireImages(grid);
        grid.querySelectorAll("[data-bk]").forEach(function (b) {
          b.onclick = function () {
            state.backup = state.backup === b.dataset.bk ? "" : b.dataset.bk; save();
            grid.querySelectorAll("[data-bk]").forEach(function (x) { x.classList.toggle("picked", x.dataset.bk === state.backup); });
            renderCard(el);
          };
        });
        var own = el.querySelector('[data-k="headline"]');
        el.querySelectorAll("[data-hl]").forEach(function (b) {
          b.onclick = function () {
            state.headline = b.dataset.hl; own.value = b.dataset.hl; save();
            el.querySelectorAll("[data-hl]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
            el.querySelector("#ip").textContent = imgPrompt(); renderCard(el);
          };
        });
        own.addEventListener("input", function () {
          state.headline = own.value.trim(); save();
          el.querySelector("#ip").textContent = imgPrompt(); renderCard(el);
        });
        el.querySelector('[data-k="source"]').addEventListener("input", function () { renderCard(el); });
        renderCard(el);
      },
      done: ["想好針對搭檔的標題", "生出一張圖（或選了備援圖）", "寫好來源"],
      point: "你只花 10 分鐘、只知道搭檔 3 個喜好，就做得出一則「剛好打中他」的假新聞。<br>把 STEP 1 和 STEP 3 放在一起看：<b>懂你的推薦系統＋會造假的生成 AI</b>，就能把假消息送到最可能相信的人面前。",
      fast: "再生一張「更像真的」版本：加上「傍晚、逆光、手有點抖」。哪一版更難被識破？",
      help: "AI 說不能生圖？換一個工具，或用備援圖。標題太像真的、會嚇到人的，請換一個好笑的。"
    },
    {
      id: "s4", min: 10, title: "互當偵探", q: "如果它剛好是你愛看的東西，你還抓得出破綻嗎？",
      goal: "交換作品，用「查證四步」找出對方假新聞的破綻。",
      todo: [
        "把你的手機（圖＋新聞卡）給搭檔看 1 分鐘。",
        "用<b>你自己的手機</b>，幫搭檔的作品填下面的偵探卡。",
        "按「給搭檔看」，把偵探卡秀給他；再把搭檔給你的建議抄下來。"
      ],
      body: function () {
        return '<div class="box"><b>查證四步</b><ol style="margin:.4em 0 0;padding-left:1.4em">' +
          D.checklist.map(function (c) { return "<li><b>" + c[0] + "</b>：" + c[1] + "</li>"; }).join("") + "</ol></div>" +
          peer("p4", "偵探卡：我看搭檔的假新聞", [
            ["bait", "他用我的哪個喜好來騙我？", "例：用貓，我差點就信了"],
            ["flaw", "露出破綻的地方", "例：貓的腳怪怪的、招牌字是亂碼"],
            ["check", "如果要查證，我會先……", "例：看捷運公司官網／別家新聞有沒有報"]
          ], true) +
          '<div class="box"><b>差點相信的程度</b><div class="check" data-pick="score" style="margin-top:6px">' +
          ["1 一眼假", "2", "3", "4", "5 差點就信了"].map(function (o) { return '<button type="button" data-v="' + o + '" aria-pressed="' + (state.score === o) + '">' + o + "</button>"; }).join("") + "</div></div>" +
          '<div class="row"><button type="button" class="btn warm" data-show="p4">給搭檔看 ⤢</button></div>' +
          field("got", "搭檔給我的建議（抄下來）", "例：招牌字露餡了") +
          '<details class="box"><summary><b>沒有搭檔？用練習卡</b></summary><div data-det></div></details>';
      },
      mount: function (el) { L.w2.detective(el.querySelector("[data-det]")); },
      done: ["看過搭檔的作品", "填好偵探卡並給他看", "抄下搭檔給我的建議"],
      point: "打中自己喜好的消息，最容易讓人放下戒心。光靠眼睛找破綻越來越難——更可靠的是<b>查來源</b>：誰說的？別家有沒有報？原圖從哪來？",
      fast: "交換第二輪：找另一組，看看「不是針對你做的」假新聞，是不是比較好抓？",
      help: "不知道怎麼寫？先寫「我第一眼覺得哪裡怪」，一句就好。"
    },
    {
      id: "s5", min: 4, title: "我的轉傳規則", q: "下次在群組看到「剛好是你愛看的」驚人消息，你會怎麼做？",
      goal: "寫下一條你真的做得到的規則，帶走今天的紀錄。",
      todo: [
        "寫下：「轉傳之前，我會先＿＿」。要寫動作，不要只寫「小心」。",
        "按「我的實驗紀錄」，截圖留念。"
      ],
      body: function () {
        return field("rule", "轉傳之前，我會先……", "例：看是誰說的、去 Cofacts 查一下") +
          '<div class="box note"><b>今天帶走三句話</b><br>① 我的首頁，是 AI 依照我挑過的世界。<br>② AI 很懂我，卻不一定懂真相——語氣越有自信，越要查。<br>③ 越打中我喜好的消息，越要停三秒再轉。</div>' +
          '<div class="row"><button type="button" class="btn" data-summary>我的實驗紀錄 ⤢</button></div>' +
          '<div class="box"><b>查不出來？交給查核專家：</b><ul style="margin:.4em 0 0;padding-left:1.2em">' +
          D.factcheck.map(function (c) { return '<li><a href="' + c[1] + '" target="_blank" rel="noopener">' + c[0] + "</a></li>"; }).join("") + "</ul></div>";
      },
      done: ["寫下我的轉傳規則", "截圖了我的實驗紀錄"]
    }
  ];

  /* ---------- 小元件 ---------- */
  function field(k, label, ph) {
    return (label ? '<label class="f" for="f-' + k + '">' + label + '</label>' : "") + '<input id="f-' + k + '" type="text" data-k="' + k + '" placeholder="' + esc(ph) + '" value="' + esc(state[k] || "") + '">';
  }
  function judge(k, q) {
    var opts = ["答對了", "部分在編", "整個在編", "說它不知道／查不到"];
    return '<div class="box"><b>' + q + '</b><div class="check" data-pick="j' + k + '" style="margin-top:6px">' +
      opts.map(function (o) { return '<button type="button" data-v="' + o + '" aria-pressed="' + (state["j" + k] === o) + '">' + o + "</button>"; }).join("") + "</div></div>";
  }
  function peer(k, title, fields, mine) {
    return '<div class="box peer" id="' + k + '"><span class="tag warm">' + (mine ? "我寫給搭檔" : "搭檔填") + '</span><h3 style="margin:.4em 0">' + title + "</h3>" +
      fields.map(function (f) { return field(k + "_" + f[0], f[1], f[2]); }).join("") + "</div>";
  }
  function renderCard(el) {
    var c = el.querySelector("#newsCard"); if (!c) return;
    var h = state.headline || "（還沒選標題）", src = state.source || "某粉絲專頁";
    c.innerHTML = '<div class="det box"><span class="tag warm">練習用・AI 生成・請勿轉傳</span>' +
      '<p class="det-meta mono" style="margin-top:6px">來源：' + esc(src) + '</p><h3>' + esc(h) + "</h3>" +
      (state.backup ? '<div class="det-img">' + L.fig(state.backup, { caption: false, alt: "新聞配圖（AI 生成）" }) + "</div>" : '<p class="soft" style="color:var(--ink-soft)">（配圖：你用 AI 生成的那張，在 AI 的畫面裡）</p>') + "</div>";
    L.wireImages(c);
  }

  /* ---------- 全螢幕展示（給搭檔看／實驗紀錄） ---------- */
  function overlay(html) {
    var o = document.createElement("div");
    o.className = "show-ov"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true");
    o.innerHTML = '<div class="show-in">' + html + '<button type="button" class="btn ghost" data-close style="margin-top:16px">關閉</button></div>';
    document.body.appendChild(o);
    o.querySelector("[data-close]").onclick = function () { o.remove(); };
    o.querySelector("[data-close]").focus();
  }
  function showPeer() {
    var me = state.partner ? "給 " + esc(state.partner) : "給我的搭檔";
    overlay('<p class="kick">' + me + '｜偵探卡</p>' +
      '<p class="lbl">你用我的哪個喜好騙我</p><p class="big2">' + esc(state.p4_bait || "—") + "</p>" +
      '<p class="lbl">露出破綻的地方</p><p class="big2">' + esc(state.p4_flaw || "—") + "</p>" +
      '<p class="lbl">如果要查證，我會先</p><p class="big2">' + esc(state.p4_check || "—") + "</p>" +
      '<p class="lbl">差點相信的程度</p><p class="big2">' + esc(state.score || "—") + "</p>");
  }
  function showSummary() {
    function row(l, v) { return '<p class="lbl">' + l + '</p><p class="big2">' + esc(v || "—") + "</p>"; }
    overlay('<p class="kick">AI 資訊實驗室｜我的實驗紀錄</p>' +
      row("搭檔猜我愛看", (state.p1_k || "") + (state.hit ? "（猜中 " + state.hit + "）" : "")) +
      row("沒搜過卻一直出現的", state.never) +
      row("AI 回答「不存在的電影」", state.ja) +
      row("AI 回答我的問題", (state.qb ? "「" + state.qb + "」→ " : "") + (state.jb || "")) +
      row("我做的假新聞", state.headline) +
      row("搭檔給我的建議", state.got) +
      row("轉傳之前，我會先", state.rule) +
      '<p class="soft" style="margin-top:12px">① 我的首頁，是 AI 依照我挑過的世界。② AI 很懂我，卻不一定懂真相。③ 越打中我喜好的消息，越要停三秒再轉。</p>');
  }

  /* ---------- 任務引擎 ---------- */
  function build(root) {
    var nav = document.getElementById("stepNav");
    nav.innerHTML = STEPS.map(function (s, i) { return '<a href="#step-' + i + '" data-i="' + i + '">' + (i === 0 ? "準備" : i) + "</a>"; }).join("");
    root.innerHTML = STEPS.map(function (s, i) {
      var doneKey = "done_" + s.id, got = state[doneKey] || [];
      return '<section class="step" id="step-' + i + '" hidden>' +
        '<p class="step-k">' + (i === 0 ? "STEP 0" : "STEP " + i + " / " + (STEPS.length - 1)) + "｜約 " + s.min + " 分鐘</p>" +
        "<h2>" + s.title + "</h2>" +
        (s.q ? '<p class="step-q">' + s.q + "</p>" : "") +
        '<p class="step-goal"><b>這一步要做：</b>' + s.goal + "</p>" +
        '<ol class="todo">' + s.todo.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ol>" +
        '<div class="step-body">' + s.body() + "</div>" +
        '<div class="box done-box"><b>完成了嗎？</b><div class="check" data-done="' + s.id + '" style="margin-top:6px">' +
          s.done.map(function (d) { return '<button type="button" data-v="' + esc(d) + '" aria-pressed="' + (got.indexOf(d) >= 0) + '">' + esc(d) + "</button>"; }).join("") + "</div>" +
          '<p class="done-msg" aria-live="polite"></p></div>' +
        (s.point ? '<details class="box point"' + (got.length === s.done.length ? " open" : "") + '><summary><b>💡 這一步想讓你發現什麼？</b>（做完再打開）</summary><p>' + s.point + "</p></details>" : "") +
        (s.fast ? '<details class="box fast"><summary><b>⚡ 快手任務</b>（做完還有時間再做）</summary><p>' + s.fast + "</p></details>" : "") +
        (s.help ? '<details class="box"><summary><b>卡住了？</b></summary><p>' + s.help + "</p></details>" : "") +
        '<div class="step-nav">' + (i > 0 ? '<a class="btn ghost" href="#step-' + (i - 1) + '">← 上一步</a>' : "<span></span>") +
          (i < STEPS.length - 1 ? '<a class="btn" href="#step-' + (i + 1) + '">下一步：' + STEPS[i + 1].title + " →</a>" : "") + "</div>" +
        "</section>";
    }).join("");

    STEPS.forEach(function (s, i) { if (s.mount) s.mount(document.getElementById("step-" + i)); });

    // 文字欄位：自動儲存
    root.querySelectorAll("[data-k]").forEach(function (inp) {
      inp.addEventListener("input", function () { state[inp.dataset.k] = inp.value; save(); });
    });
    // 單選判斷
    root.querySelectorAll("[data-pick]").forEach(function (g) {
      g.querySelectorAll("button").forEach(function (b) {
        b.onclick = function () { state[g.dataset.pick] = b.dataset.v; save(); g.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); };
      });
    });
    // 完成條件
    root.querySelectorAll("[data-done]").forEach(function (g) {
      var key = "done_" + g.dataset.done, msg = g.parentNode.querySelector(".done-msg");
      function upd() {
        var on = [].slice.call(g.querySelectorAll('[aria-pressed="true"]')).map(function (x) { return x.dataset.v; });
        state[key] = on; save();
        var all = on.length === g.querySelectorAll("button").length;
        msg.textContent = all ? "全部完成！打開下面的 💡 看看這一步想讓你發現什麼。" : "";
        var pt = g.closest(".step").querySelector(".point"); if (all && pt) pt.open = true;
        markNav();
      }
      g.querySelectorAll("button").forEach(function (b) { b.onclick = function () { b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true"); upd(); }; });
    });
    root.querySelectorAll("[data-copy]").forEach(function (b) {
      b.onclick = function () { L.copy(document.getElementById(b.dataset.copy).textContent, b); };
    });
    root.querySelectorAll("[data-show]").forEach(function (b) { b.onclick = showPeer; });
    root.querySelectorAll("[data-summary]").forEach(function (b) { b.onclick = showSummary; });
    L.wireImages(root);

    function markNav() {
      nav.querySelectorAll("a").forEach(function (a) {
        var s = STEPS[+a.dataset.i], got = state["done_" + s.id] || [];
        a.classList.toggle("ok", got.length === s.done.length);
      });
    }
    function show() {
      var m = /step-(\d+)/.exec(location.hash), i = m ? Math.min(+m[1], STEPS.length - 1) : (state.last || 0);
      root.querySelectorAll(".step").forEach(function (sec, k) { sec.hidden = k !== i; });
      nav.querySelectorAll("a").forEach(function (a) { a.classList.toggle("on", +a.dataset.i === i); a.setAttribute("aria-current", +a.dataset.i === i ? "step" : "false"); });
      document.getElementById("progBar").style.width = (i / (STEPS.length - 1) * 100) + "%";
      state.last = i; save();
      window.scrollTo(0, 0);
    }
    window.addEventListener("hashchange", show);
    markNav(); show();
  }

  window.W2STEPS = { STEPS: STEPS, build: build };
})();
