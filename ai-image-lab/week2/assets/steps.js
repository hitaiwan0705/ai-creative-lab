/* 第二堂「帶著走」任務模式｜AI 說的，是真的嗎？——從好奇到查證
   探索五步：好奇 → 猜 → 問 → 查 → 想；最後談使用 AI 的態度（詐騙、AI 情人、駕馭、倫理）。
   每步：引導問題 → 這一步要做 → 編號做法 → 作答 → 完成了嗎？ → 💡 想讓你發現 → 快手任務 → 卡住了？
   作答只存在這支手機（localStorage），不會上傳。 */
(function () {
  var L = window.LAB, D = window.W2;
  var KEY = "ailab-w2-v2";
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { state = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var CURIOUS = [
    "為什麼貓會發出呼嚕聲？",
    "珍珠奶茶是誰發明的？",
    "為什麼天空是藍的，夕陽卻是紅的？",
    "台北 101 為什麼不怕颱風和地震？",
    "為什麼聽到喜歡的歌會起雞皮疙瘩？"
  ];

  function goodPrompt() {
    var q = state.q || "＿＿＿＿", why = state.why || "＿＿＿＿", fmt = state.fmt || "3 個重點、每點兩三句";
    return "我是高中生，我想知道：" + q + "\n我想知道的原因是：" + why + "\n請用「" + fmt + "」回答。\n每個重點請附上我可以自己查證的來源（網站名稱或書名）。\n不確定的地方請直接說「不確定」，不要猜。";
  }

  /* ---------- 步驟定義 ---------- */
  var STEPS = [
    {
      id: "s0", min: 5, title: "準備：AI 有多懂你？", q: "AI 這麼懂你，那它說的話，你都信嗎？",
      goal: "找好搭檔、打開 AI；先用 3 分鐘看看 AI 有多懂你。",
      todo: [
        "兩人一組，寫下搭檔的名字。手機打開一個 AI 聊天工具（ChatGPT、Gemini、Copilot 都可以）。",
        "暖身：打開你最常滑的 App 推薦頁（YouTube 首頁、IG 探索、TikTok），給搭檔看 30 秒。<b>不要給他看帳號名稱、私訊、朋友的臉。</b>",
        "搭檔在<b>你的手機</b>寫下他猜你愛看的 3 個關鍵字；你揭曉猜中幾個。"
      ],
      body: function () {
        return field("partner", "我的搭檔", "例：小安") +
          peer("p0", "搭檔填：我猜你愛看……", [["k", "3 個關鍵字", "例：籃球、貓、韓團"]]) +
          pick("hit", "搭檔猜中幾個？", ["0 個", "1 個", "2 個", "3 個全中"]) +
          '<details class="box"><summary><b>不想給別人看自己的首頁？</b></summary><p>完全沒關係。改成口頭說「我首頁最近最常出現的是……」就好。</p></details>' +
          '<div class="box note"><b>今天的路線：探索五步</b><br>好奇 → 猜 → 問 → 查 → 想　＋　用 AI 的態度</div>' +
          '<div class="box"><b>三個規則</b><br>1　截圖只給搭檔看，不轉傳、不上傳。<br>2　不把自己或別人的個資（全名、學號、地址、照片）貼給 AI。<br>3　看不懂步驟就舉手，或先看「卡住了？」。</div>';
      },
      done: ["有搭檔、AI 打開了", "暖身猜完了"],
      point: "搭檔 30 秒就猜得出你愛看什麼，推薦系統比他更懂你。<br>但「很懂你喜歡什麼」和「說的都是真的」是兩回事。今天就來練：<b>AI 說的，怎麼知道是不是真的？</b>",
      help: "沒有常用的 App？用 YouTube 首頁就好；或直接跳過暖身，從第 1 步開始。"
    },
    {
      id: "s1", min: 5, title: "好奇：我真的想知道什麼？", q: "最近有沒有一件事，讓你想問「為什麼」？",
      goal: "寫下一個你真的好奇的問題、為什麼想知道，再先猜一個答案。",
      todo: [
        "寫下一個你<b>真的好奇</b>的問題（想不到就點下面的範例）。",
        "寫下「我為什麼想知道」——這是你的<b>初衷</b>。",
        "先不要問 AI！自己<b>猜</b>一個答案，猜錯沒關係。"
      ],
      body: function () {
        return '<div class="box"><b>想不到？點一個範例</b><div style="margin-top:6px" data-ex>' +
          CURIOUS.map(function (c) { return '<button type="button" class="chip" data-v="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") + "</div></div>" +
          field("q", "① 我好奇的問題", "例：為什麼貓會發出呼嚕聲？") +
          field("why", "② 我為什麼想知道（初衷）", "例：我家貓每天晚上都在我旁邊呼嚕，想知道牠是不是很開心") +
          field("guess", "③ 我先猜的答案", "例：因為牠很放鬆、很開心");
      },
      mount: function (el) {
        var q = el.querySelector('[data-k="q"]');
        el.querySelectorAll("[data-ex] button").forEach(function (b) {
          b.onclick = function () { q.value = b.dataset.v; state.q = b.dataset.v; save(); refreshPrompt(); };
        });
      },
      done: ["寫下好奇的問題", "寫下初衷", "自己先猜了答案"],
      point: "探索從<b>好奇</b>開始，而「為什麼想知道」決定你要的是什麼樣的答案：想安心、想做報告、還是想跟朋友聊？<br>先自己猜一次，等一下才有「對照組」——你會知道 AI 說的跟你想的差在哪。",
      fast: "再想一個「問了 AI 可能會答錯」的問題：跟你的學校、社區、家人有關，網路上不太有名的。",
      help: "想不到問題？從「最近讓你覺得奇怪的一件事」開始，或直接點一個範例。"
    },
    {
      id: "s2", min: 10, title: "問：把需求說清楚", q: "同一個問題，換個問法，AI 的答案會差多少？",
      goal: "用兩種問法問 AI，比較哪一種答案比較好用。",
      todo: [
        "<b>第一次</b>：只把你的問題原句丟給 AI。",
        "<b>第二次</b>：複製下面幫你組好的「好問法」，開一個新對話再問一次。",
        "比較兩個答案，寫下差別；最後試一題<b>陷阱題</b>。"
      ],
      body: function () {
        return pick("fmt", "我想要的回答格式", ["3 個重點、每點兩三句", "用國中生也懂的話講", "先講結論再講原因", "做成比較表"]) +
          '<div class="box"><span class="tag">好問法（自動幫你組好）</span><pre id="gp" class="prompt-pre">' + esc(goodPrompt()) + '</pre>' +
          '<div class="row"><button type="button" class="btn" data-copy="gp">複製好問法</button></div>' +
          '<p class="soft" style="color:var(--ink-soft);margin:.6em 0 0;font-size:.92rem">好問法有五個零件：<b>我是誰</b>、<b>我想知道什麼</b>、<b>為什麼想知道</b>、<b>想要的格式</b>、<b>要附來源、不確定就說</b>。</p></div>' +
          pick("better", "哪一次的答案比較好用？", ["第一次", "第二次", "差不多"]) +
          field("diff", "第二次多了什麼／少了什麼？", "例：第二次有附來源，也說了哪裡不確定") +
          '<div class="box"><span class="tag warm">陷阱題</span><p id="pa">' + esc(D.hallucinationPrompt) + '</p><div class="row"><button type="button" class="btn ghost" data-copy="pa">複製陷阱題</button></div>' +
          '<p class="soft" style="color:var(--ink-soft);margin:.6em 0 0">偷偷告訴你：這部電影不存在。</p></div>' +
          pick("trap", "AI 怎麼回答陷阱題？", ["老實說查不到／不存在", "部分在編", "整套編得很完整"]);
      },
      mount: function () { refreshPrompt(); },
      done: ["問了第一次（原句）", "用好問法問了第二次", "試了陷阱題"],
      point: "問法會改變答案的品質：說清楚<b>你是誰、為什麼想知道、要什麼格式</b>，AI 才知道怎麼幫你。<br>但陷阱題告訴我們：就算問得很好，AI 還是可能<b>一本正經地編</b>。它是在「接出最像答案的句子」，不是在「查資料」——這叫 <b>AI 幻覺</b>。所以下一步要「查」。",
      fast: "追問 AI：「你剛剛說的第 2 點，確定嗎？請給我可以點開的網址。」它會改口嗎？",
      help: "AI 回很長看不完？在好問法最後加一句「150 字以內」。"
    },
    {
      id: "s3", min: 12, title: "查：AI 說的，是真的嗎？", q: "AI 給你的答案裡，哪幾句是真的？你怎麼確定？",
      goal: "從 AI 的答案挑 3 句話，各找一個「不是 AI」的來源核實。",
      todo: [
        "從第二次的答案，抄下 3 句「聽起來很確定」的話。",
        "每一句，用<b>另一個來源</b>查：搜尋引擎、官方網站、百科、課本或問老師。<b>AI 給的連結也要點開看。</b>",
        "標記結果：✓ 查到一樣、✗ 查到不一樣、？查不到。請搭檔幫你獨立查其中一句。"
      ],
      body: function () {
        return [1, 2, 3].map(function (n) {
          return '<div class="box vrow"><span class="tag">第 ' + n + " 句</span>" +
            field("c" + n, "AI 說：", "抄下一句 AI 的話") +
            field("s" + n, "我用來查的來源", "例：國家地理網站、維基百科、課本 p.32") +
            pick("r" + n, "", ["✓ 查到一樣", "✗ 查到不一樣", "？ 查不到"]) + "</div>";
        }).join("") +
          pick("link", "AI 給的來源連結，點得開嗎？", ["都點得開、內容也對", "點得開但內容對不上", "點不開／是假的", "它沒給來源"]) +
          peer("p3", "搭檔填：我幫你獨立查一句", [
            ["which", "我查的是第幾句", "例：第 2 句"],
            ["res", "我查到的結果與來源", "例：查不到，只有 AI 這樣說"]
          ]);
      },
      done: ["抄下 3 句", "每句都查過、標好結果", "搭檔幫我獨立查了一句"],
      point: "「查」不是再問一次 AI，而是找<b>第二個獨立的來源</b>：說得出是誰寫的、點得開、內容對得上。<br>如果 AI 給的連結點不開或內容對不上，那很可能就是幻覺。查不到的那一句，不要當成事實寫進報告。",
      fast: "把「✗ 查到不一樣」的那句貼回給 AI：「我查到的是＿＿，你怎麼說？」看看它會怎麼回應。",
      help: "不知道去哪查？先用搜尋引擎找「官方網站、新聞媒體、學校或研究單位」的頁面；論壇和影片留言比較不可靠。"
    },
    {
      id: "s4", min: 6, title: "想：我學到什麼？還想知道什麼？", q: "你的猜測、AI 的答案、查到的事實，誰最接近？",
      goal: "把三個版本放在一起比，寫下新的發現和下一個好奇。",
      todo: [
        "看看下面的對照表：你的猜測、AI 說的、你查到的。",
        "寫下這次真正學到的一件事，和<b>下一個想問的問題</b>。",
        "請搭檔讀完，給你「一個讚＋一個建議」。"
      ],
      body: function () {
        return '<div class="box" id="cmp"></div>' +
          pick("closest", "誰最接近查到的事實？", ["我的猜測", "AI 的答案", "都差不多", "都不太對"]) +
          field("learn", "這次我真正學到的一件事", "例：貓呼嚕不一定是開心，生病時也可能呼嚕") +
          field("next", "我的下一個好奇", "例：那貓為什麼生病也會呼嚕？") +
          peer("p4", "搭檔填：一個讚＋一個建議", [
            ["like", "👍 你做得好的地方", "例：你有去官方網站查，很可靠"],
            ["tip", "💬 一個建議", "例：第 3 句可以再找一個來源"]
          ]);
      },
      mount: function (el) {
        function cmp() {
          var r = [1, 2, 3].map(function (n) { return state["r" + n] ? "第 " + n + " 句：" + state["r" + n] : ""; }).filter(Boolean).join("　");
          el.querySelector("#cmp").innerHTML =
            '<p class="lbl">我的問題</p><p><b>' + esc(state.q || "（第 1 步還沒寫）") + "</b></p>" +
            '<p class="lbl">我先猜的</p><p>' + esc(state.guess || "—") + "</p>" +
            '<p class="lbl">查證結果</p><p>' + esc(r || "（第 3 步還沒標記）") + "</p>";
        }
        cmp();
        window.addEventListener("hashchange", cmp);
      },
      done: ["比對了三個版本", "寫下學到的和下一個好奇", "搭檔給了一個讚＋一個建議"],
      point: "AI 是探索的<b>助手</b>，不是終點。好奇 → 猜 → 問 → 查 → 想，走完一圈，最好的收穫常常不是答案，而是<b>下一個更好的問題</b>。",
      fast: "用好問法把「下一個好奇」也問一次，再挑一句查證。",
      help: "搭檔不知道怎麼給建議？請他從「來源可不可靠」或「有沒有查到第二個來源」來說。"
    },
    {
      id: "s5", min: 10, title: "用 AI 的態度：方向盤在你手上", q: "AI 會編、也很懂你。那什麼時候要特別小心？",
      goal: "和搭檔一起做 4 張情境卡，每張選一個你會怎麼做。",
      todo: [
        "兩人一起讀情境，各自選答案，再看說明。",
        "選錯沒關係，重點是說得出「為什麼」。",
        "最後兩人討論：哪一張最可能發生在你身上？"
      ],
      body: function () {
        return D.scenarios.map(function (sc, i) {
          return '<div class="box scen" data-sc="' + i + '"><span class="tag warm">' + esc(sc.tag) + "</span>" +
            '<p class="scen-q">' + sc.q + "</p>" +
            '<div class="opts">' + sc.options.map(function (o, k) { return '<button type="button" class="scen-o" data-k="' + k + '"' + (state["sc" + i] === k ? ' aria-pressed="true"' : "") + ">" + "ABC"[k] + ". " + esc(o) + "</button>"; }).join("") + "</div>" +
            '<div class="scen-a"' + (state["sc" + i] == null ? " hidden" : "") + "><p><b>" + sc.answer + "</b></p><p>" + sc.explain + "</p></div></div>";
        }).join("") +
          '<div class="box note harness"><b>Harness（韁繩）是什麼？</b><br>在 AI 領域，harness 指的是包在 AI 外面、引導和限制它的那一圈：給方向、定規則、做檢查。<br>對你來說，<b>你就是那條韁繩</b>：你決定要問什麼（方向）、不給什麼資料（規則）、查證它說的（檢查）、最後交出去的東西由你負責（責任）。</div>' +
          field("mostlikely", "我們覺得最可能發生的是哪一張？為什麼？", "例：AI 情人，因為身邊有人每天跟 AI 聊天");
      },
      mount: function (el) {
        el.querySelectorAll(".scen").forEach(function (box) {
          var i = +box.dataset.sc, sc = D.scenarios[i];
          box.querySelectorAll(".scen-o").forEach(function (b) {
            b.onclick = function () {
              var k = +b.dataset.k; state["sc" + i] = k; save();
              box.querySelectorAll(".scen-o").forEach(function (x) { x.setAttribute("aria-pressed", x === b); x.classList.toggle("is-right", +x.dataset.k === sc.right); });
              box.querySelector(".scen-a").hidden = false;
            };
            if (state["sc" + i] != null) b.classList.toggle("is-right", +b.dataset.k === sc.right);
          });
        });
      },
      done: ["4 張情境卡都選了", "跟搭檔討論了最可能發生的一張"],
      point: "AI 很懂你、又會一本正經地編，所以最容易被拿來<b>騙你、黏住你、或讓你偷懶</b>。<br>正確的態度不是「不要用」，而是<b>方向盤在你手上</b>：你決定問什麼、不給什麼、查證什麼、為結果負責。",
      help: "看不懂 harness？想成騎馬：AI 是很會跑的馬，你手上的韁繩決定牠往哪裡跑。"
    },
    {
      id: "s6", min: 3, title: "我的 AI 使用守則", q: "下次用 AI 之前，你會先提醒自己什麼？",
      goal: "寫下一條你真的做得到的守則，帶走今天的紀錄。",
      todo: [
        "寫下：「用 AI 的時候，我會＿＿」。要寫動作，不要只寫「小心」。",
        "按「我的探索紀錄」，截圖留念。"
      ],
      body: function () {
        return field("rule", "用 AI 的時候，我會……", "例：用好問法問、每次至少查一個來源再相信") +
          '<div class="box note"><b>今天帶走三句話</b><br>① 好奇是起點：先想清楚我為什麼想知道。<br>② AI 會一本正經地編：它說的，我要查。<br>③ 方向盤在我手上：我決定、我查證、我負責。</div>' +
          '<div class="row"><button type="button" class="btn" data-summary>我的探索紀錄 ⤢</button></div>' +
          '<div class="box"><b>遇到可疑訊息、可疑來電？</b><ul style="margin:.4em 0 0;padding-left:1.2em">' +
          D.factcheck.map(function (c) { return '<li><a href="' + c[1] + '" target="_blank" rel="noopener">' + c[0] + "</a></li>"; }).join("") +
          "<li>反詐騙諮詢專線：<b>165</b></li></ul></div>";
      },
      done: ["寫下我的守則", "截圖了探索紀錄"]
    }
  ];

  /* ---------- 小元件 ---------- */
  function field(k, label, ph) {
    return (label ? '<label class="f" for="f-' + k + '">' + label + "</label>" : "") + '<input id="f-' + k + '" type="text" data-k="' + k + '" placeholder="' + esc(ph) + '" value="' + esc(state[k] || "") + '">';
  }
  function pick(k, q, opts) {
    return '<div class="box pickbox">' + (q ? "<b>" + q + "</b>" : "") + '<div class="check" data-pick="' + k + '" style="margin-top:6px">' +
      opts.map(function (o) { return '<button type="button" data-v="' + esc(o) + '" aria-pressed="' + (state[k] === o) + '">' + esc(o) + "</button>"; }).join("") + "</div></div>";
  }
  function peer(k, title, fields) {
    return '<div class="box peer"><span class="tag warm">搭檔填</span><h3 style="margin:.4em 0">' + title + "</h3>" +
      fields.map(function (f) { return field(k + "_" + f[0], f[1], f[2]); }).join("") + "</div>";
  }
  function refreshPrompt() { var p = document.getElementById("gp"); if (p) p.textContent = goodPrompt(); }

  /* ---------- 全螢幕：我的探索紀錄 ---------- */
  function overlay(html) {
    var o = document.createElement("div");
    o.className = "show-ov"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true");
    o.innerHTML = '<div class="show-in">' + html + '<button type="button" class="btn ghost" data-close style="margin-top:16px">關閉</button></div>';
    document.body.appendChild(o);
    o.querySelector("[data-close]").onclick = function () { o.remove(); };
    o.querySelector("[data-close]").focus();
  }
  function showSummary() {
    function row(l, v) { return '<p class="lbl">' + l + '</p><p class="big2">' + esc(v || "—") + "</p>"; }
    var res = [1, 2, 3].map(function (n) { return state["r" + n] ? state["r" + n].slice(0, 1) : ""; }).filter(Boolean).join(" ");
    overlay('<p class="kick">AI 資訊實驗室｜我的探索紀錄</p>' +
      row("我好奇的問題", state.q) +
      row("我先猜的", state.guess) +
      row("AI 說的，我查證的結果", res ? res + "（✓ 對／✗ 不一樣／？ 查不到）" : "") +
      row("陷阱題，AI 的反應", state.trap) +
      row("我學到的", state.learn) +
      row("我的下一個好奇", state.next) +
      row("用 AI 的時候，我會", state.rule) +
      '<p class="soft" style="margin-top:12px">① 好奇是起點 ② AI 說的，我要查 ③ 方向盤在我手上</p>');
  }

  /* ---------- 任務引擎 ---------- */
  function build(root) {
    var nav = document.getElementById("stepNav");
    nav.innerHTML = STEPS.map(function (s, i) { return '<a href="#step-' + i + '" data-i="' + i + '">' + (i === 0 ? "準備" : i) + "</a>"; }).join("");
    root.innerHTML = STEPS.map(function (s, i) {
      var got = state["done_" + s.id] || [];
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
          (i < STEPS.length - 1 ? '<a class="btn" href="#step-' + (i + 1) + '">下一步 →</a>' : "") + "</div>" +
        "</section>";
    }).join("");

    STEPS.forEach(function (s, i) { if (s.mount) s.mount(document.getElementById("step-" + i)); });

    root.querySelectorAll("input[data-k]").forEach(function (inp) {
      inp.addEventListener("input", function () { state[inp.dataset.k] = inp.value; save(); if (/^(q|why)$/.test(inp.dataset.k)) refreshPrompt(); });
    });
    root.querySelectorAll("[data-pick]").forEach(function (g) {
      g.querySelectorAll("button").forEach(function (b) {
        b.onclick = function () {
          state[g.dataset.pick] = b.dataset.v; save();
          g.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
          if (g.dataset.pick === "fmt") refreshPrompt();
        };
      });
    });
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
    root.querySelectorAll("[data-summary]").forEach(function (b) { b.onclick = showSummary; });

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
