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
      id: "s0", min: 2, title: "準備", goal: "找好搭檔、打開 AI，知道今天的規則。",
      todo: [
        "兩人一組，在下面寫搭檔的名字（綽號也可以）。",
        "手機開一個 AI 聊天工具：ChatGPT、Gemini、Copilot 都可以。",
        "確認它能不能生圖（多數可以）。不能也沒關係，第 3 步有備援圖。"
      ],
      body: function () {
        return field("partner", "我的搭檔", "例：小安") +
          '<div class="box note"><b>三個規則</b><br>1　做出來的「假新聞」只在教室裡用，不轉傳、不上傳社群。<br>2　不放真人、同學的臉，不做災難、政治、會讓人害怕的內容。<br>3　看不懂步驟就舉手，或先看「卡住了？」。</div>';
      },
      done: ["有搭檔了", "AI 工具打開了"]
    },
    {
      id: "s1", min: 8, title: "推薦泡泡", goal: "親手養出自己的動態牆，看看它最後只剩下什麼。",
      todo: [
        "下面是一個迷你動態牆。想看的貼文按 ♥，按完「下一輪」，一共 6 輪。",
        "看完結果，把「你的泡泡」寫下來。",
        "跟搭檔比：你們的動態牆一樣嗎？"
      ],
      body: function () {
        return '<div class="box note"><b>規則公開：</b>你按讚的主題，下一輪出現機率 ×1.8；看到沒按的 ×0.85。</div>' +
          '<div id="bub" class="box"></div>' +
          field("bubble", "我的泡泡是", "例：遊戲・動物（多樣性 44）") +
          field("bubbleDiff", "我跟搭檔最大的不同", "例：他的牆幾乎都是運動，我完全沒看到");
      },
      mount: function (el) {
        L.w2.bubble(el.querySelector("#bub"), {
          onEnd: function (r) {
            var top = D.topics.slice().sort(function (a, b) { return r.shares[b] - r.shares[a]; }).slice(0, 2);
            var inp = el.querySelector('[data-k="bubble"]');
            if (inp && !inp.value) { inp.value = top.join("・") + "（多樣性 " + r.diversity + "）"; state.bubble = inp.value; save(); }
          }
        });
      },
      done: ["玩完 6 輪", "寫下我的泡泡", "跟搭檔比過了"],
      fast: "再玩一次，這次「每一則都按讚」。多樣性有什麼不一樣？",
      help: "按鈕沒反應？重新整理頁面就好，寫過的字不會不見。"
    },
    {
      id: "s2", min: 10, title: "考考 AI：它懂不懂？", goal: "問 AI 兩個問題，抓出它什麼時候在「編」。",
      todo: [
        "複製「問題 A」，貼給你的 AI。這部電影其實不存在。",
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
          field("conf", "AI 講得有多有自信？（1–5）", "例：5，好像它親眼看過") +
          peer("p2", "搭檔互評：幫我圈一句", [
            ["sus", "搭檔覺得「這句是編的」（抄下那一句）", "例：「導演王大明以這部片拿下……」"],
            ["why", "為什麼覺得是編的？", "例：太剛好、查不到、名字很奇怪"]
          ]);
      },
      done: ["問了問題 A", "問了自己的問題 B", "搭檔幫我圈了一句"],
      fast: "追問 AI：「你確定嗎？請給我資料來源。」它會改口嗎？給的連結點得開嗎？",
      help: "沒有 AI 可以用？跟搭檔共用一支手機，或看老師投影的示範結果來記錄。"
    },
    {
      id: "s3", min: 12, title: "做一則「練習用假新聞」", goal: "自己用 AI 做一張「看起來很真」的新聞照，等一下給搭檔當偵探。",
      todo: [
        "選一個標題（也可以自己想，但要無害、好笑、不嚇人）。",
        "複製下面的生圖指令，貼給 AI。不滿意可以再改一次。",
        "幫你的假新聞寫一個「來源」，例如某粉專、某群組。"
      ],
      body: function () {
        var opts = HEADLINES.map(function (h) {
          return '<button type="button" class="chip" data-hl="' + esc(h) + '" aria-pressed="' + (state.headline === h) + '">' + esc(h) + "</button>";
        }).join("");
        return '<div class="box"><b>選一個標題</b><div style="margin-top:6px" data-hls>' + opts + "</div>" +
          field("headline", "或自己寫（無害版）", "例：學校福利社開始賣恐龍蛋") + "</div>" +
          '<div class="box"><span class="tag">生圖指令</span><p id="ip">' + esc(imgPrompt()) + '</p><div class="row"><button type="button" class="btn" data-copy="ip">複製生圖指令</button></div></div>' +
          field("source", "這則「新聞」的來源", "例：某粉絲專頁｜分享 3.2 萬次") +
          '<details class="box"><summary><b>沒辦法生圖？用老師的備援圖</b></summary><p>選一張，當作你的新聞照（四張都是 AI 生成的）。</p><div class="roa-grid" data-backup></div></details>' +
          '<div class="news-card" id="newsCard"></div>';
      },
      mount: function (el) {
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
        el.querySelectorAll("[data-hl]").forEach(function (b) {
          b.onclick = function () {
            state.headline = b.dataset.hl; save();
            el.querySelector('[data-k="headline"]').value = "";
            el.querySelectorAll("[data-hl]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
            el.querySelector("#ip").textContent = imgPrompt(); renderCard(el);
          };
        });
        var own = el.querySelector('[data-k="headline"]');
        own.addEventListener("input", function () {
          if (own.value.trim()) { state.headline = own.value.trim(); el.querySelectorAll("[data-hl]").forEach(function (x) { x.setAttribute("aria-pressed", "false"); }); }
          save(); el.querySelector("#ip").textContent = imgPrompt(); renderCard(el);
        });
        el.querySelector('[data-k="source"]').addEventListener("input", function () { renderCard(el); });
        renderCard(el);
      },
      done: ["選好標題", "生出一張圖（或選了備援圖）", "寫好來源"],
      fast: "再生一張「更像真的」版本：加上「傍晚、逆光、手有點抖」。哪一版更難被識破？",
      help: "AI 說不能生圖？換一個工具試試，或直接用備援圖。標題太像真的會嚇到人的，請換一個。"
    },
    {
      id: "s4", min: 10, title: "互當偵探", goal: "交換作品，用「查證四步」找出對方假新聞的破綻。",
      todo: [
        "把你的手機（圖＋新聞卡）給搭檔看 1 分鐘。",
        "用<b>你自己的手機</b>，幫搭檔的作品填下面的偵探卡。",
        "按「給搭檔看」，把偵探卡秀給他；再把搭檔給你的建議抄下來。"
      ],
      body: function () {
        return '<div class="box"><b>查證四步</b><ol style="margin:.4em 0 0;padding-left:1.4em">' +
          D.checklist.map(function (c) { return "<li><b>" + c[0] + "</b>：" + c[1] + "</li>"; }).join("") + "</ol></div>" +
          peer("p4", "偵探卡：我看搭檔的假新聞", [
            ["real", "最像真的地方", "例：光線、路人、招牌都很自然"],
            ["flaw", "露出破綻的地方", "例：企鵝的腳怪怪的、招牌字是亂碼"],
            ["check", "如果要查證，我會先……", "例：去看氣象署／別家新聞有沒有報"]
          ], true) +
          '<div class="box"><b>四步裡，哪一步最能抓到它？</b><div class="check" data-multi="steps4" style="margin-top:6px">' +
          D.checklist.map(function (c) { return '<button type="button" aria-pressed="false" data-v="' + c[0] + '">' + c[0] + "</button>"; }).join("") + "</div></div>" +
          field("score", "像真度（1–5）", "例：4") +
          '<div class="row"><button type="button" class="btn warm" data-show="p4">給搭檔看 ⤢</button></div>' +
          field("got", "搭檔給我的建議（抄下來）", "例：招牌字露餡了，下次要讓字模糊一點") +
          '<details class="box"><summary><b>沒有搭檔？用練習卡</b></summary><div data-det></div></details>';
      },
      mount: function (el) {
        var box = el.querySelector('[data-multi="steps4"]'), cur = state.steps4 || [];
        box.querySelectorAll("button").forEach(function (b) {
          b.setAttribute("aria-pressed", cur.indexOf(b.dataset.v) >= 0);
          b.onclick = function () {
            var on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on);
            state.steps4 = [].slice.call(box.querySelectorAll('[aria-pressed="true"]')).map(function (x) { return x.dataset.v; }); save();
          };
        });
        L.w2.detective(el.querySelector("[data-det]"));
      },
      done: ["看過搭檔的作品", "填好偵探卡並給他看", "抄下搭檔給我的建議"],
      fast: "交換第二輪：找另一組，看看別人的假新聞比較容易還是比較難抓。",
      help: "不知道怎麼寫？先寫「我第一眼覺得哪裡怪」，一句就好。"
    },
    {
      id: "s5", min: 4, title: "我的轉傳規則", goal: "寫下一條你真的做得到的規則，帶走今天的紀錄。",
      todo: [
        "寫下：「轉傳之前，我會先＿＿」。要寫動作，不要只寫「小心」。",
        "按「我的實驗紀錄」，截圖留念。"
      ],
      body: function () {
        return field("rule", "轉傳之前，我會先……", "例：看是誰說的、去 Cofacts 查一下") +
          '<div class="box note"><b>今天帶走三句話</b><br>① 我看到的世界，是被挑選過的。<br>② 眼見不一定為憑，先查來源。<br>③ 轉傳之前，停三秒。</div>' +
          '<div class="row"><button type="button" class="btn" data-summary>我的實驗紀錄 ⤢</button></div>' +
          '<div class="box"><b>查不出來？交給查核專家：</b><ul style="margin:.4em 0 0;padding-left:1.2em">' +
          D.factcheck.map(function (c) { return '<li><a href="' + c[1] + '" target="_blank" rel="noopener">' + c[0] + "</a></li>"; }).join("") + "</ul></div>";
      },
      done: ["寫下我的轉傳規則", "截圖了我的實驗紀錄"]
    }
  ];

  /* ---------- 小元件 ---------- */
  function field(k, label, ph) {
    return '<label class="f" for="f-' + k + '">' + label + '</label><input id="f-' + k + '" type="text" data-k="' + k + '" placeholder="' + esc(ph) + '" value="' + esc(state[k] || "") + '">';
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
      '<p class="lbl">最像真的地方</p><p class="big2">' + esc(state.p4_real || "—") + "</p>" +
      '<p class="lbl">露出破綻的地方</p><p class="big2">' + esc(state.p4_flaw || "—") + "</p>" +
      '<p class="lbl">如果要查證，我會先</p><p class="big2">' + esc(state.p4_check || "—") + "</p>" +
      '<p class="lbl">像真度</p><p class="big2">' + esc(state.score || "—") + " / 5</p>");
  }
  function showSummary() {
    function row(l, v) { return '<p class="lbl">' + l + '</p><p class="big2">' + esc(v || "—") + "</p>"; }
    overlay('<p class="kick">AI 資訊實驗室｜我的實驗紀錄</p>' +
      row("我的泡泡", state.bubble) +
      row("AI 回答「不存在的電影」", state.ja) +
      row("AI 回答我的問題", (state.qb ? "「" + state.qb + "」→ " : "") + (state.jb || "")) +
      row("我做的假新聞", state.headline) +
      row("搭檔給我的建議", state.got) +
      row("轉傳之前，我會先", state.rule) +
      '<p class="soft" style="margin-top:12px">① 我看到的世界，是被挑選過的。② 眼見不一定為憑，先查來源。③ 轉傳之前，停三秒。</p>');
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
        '<p class="step-goal"><b>目標：</b>' + s.goal + "</p>" +
        '<ol class="todo">' + s.todo.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ol>" +
        '<div class="step-body">' + s.body() + "</div>" +
        '<div class="box done-box"><b>完成了嗎？</b><div class="check" data-done="' + s.id + '" style="margin-top:6px">' +
          s.done.map(function (d) { return '<button type="button" data-v="' + esc(d) + '" aria-pressed="' + (got.indexOf(d) >= 0) + '">' + esc(d) + "</button>"; }).join("") + "</div>" +
          '<p class="done-msg" aria-live="polite"></p></div>' +
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
        msg.textContent = all ? "全部完成！可以往下一步了。" : "";
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
