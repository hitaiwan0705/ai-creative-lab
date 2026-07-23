(function () {
  "use strict";
  var AICL = window.AICL;
  var $ = AICL.$;
  var $all = AICL.$all;
  var DATA = AICL.DATA;

  /* ---------------- 導覽／捲動／鍵盤 ---------------- */

  var sections = $all("[data-section]");
  var navLinks = $all("#nav-links a");

  function scrollToSection(el) {
    el.scrollIntoView({ behavior: AICL.prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.getElementById(link.getAttribute("data-nav"));
      if (target) scrollToSection(target);
    });
  });

  function currentIndex() {
    var scrollPos = window.scrollY + 140;
    var idx = 0;
    sections.forEach(function (sec, i) {
      if (sec.offsetTop <= scrollPos) idx = i;
    });
    return idx;
  }

  $("#btn-prev").addEventListener("click", function () {
    var idx = Math.max(0, currentIndex() - 1);
    scrollToSection(sections[idx]);
  });
  $("#btn-next").addEventListener("click", function () {
    var idx = Math.min(sections.length - 1, currentIndex() + 1);
    scrollToSection(sections[idx]);
  });

  document.addEventListener("keydown", function (e) {
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    if (["INPUT", "TEXTAREA", "SELECT"].indexOf(tag) !== -1) return;

    if (e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault();
      $("#btn-next").click();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      $("#btn-prev").click();
    } else if (e.key === "Home") {
      e.preventDefault();
      scrollToSection(sections[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      scrollToSection(sections[sections.length - 1]);
    }
  });

  var progressBar = $("#progress-bar");
  var progressTrack = $("#progress-track");

  function updateProgressAndNav() {
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - doc.clientHeight;
    var pct = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0;
    progressBar.style.width = pct + "%";
    progressTrack.setAttribute("aria-valuenow", String(pct));

    var idx = currentIndex();
    var activeId = sections[idx] ? sections[idx].id : null;
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("data-nav") === activeId;
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  window.addEventListener("scroll", updateProgressAndNav, { passive: true });
  window.addEventListener("resize", updateProgressAndNav);
  updateProgressAndNav();

  /* ---------------- 動畫開關（投影延遲備援） ---------------- */

  var motionBtn = $("#toggle-motion");
  motionBtn.addEventListener("click", function () {
    var pressed = motionBtn.getAttribute("aria-pressed") === "true";
    var next = !pressed;
    motionBtn.setAttribute("aria-pressed", String(next));
    motionBtn.textContent = next ? "開啟動畫效果" : "關閉動畫效果";
    document.documentElement.classList.toggle("force-reduced-motion", next);
    document.documentElement.style.scrollBehavior = next ? "auto" : "smooth";
  });

  /* ---------------- 備援模式（綠／黃／紅燈） ---------------- */

  var modeButtons = $all(".mode-switch button");
  var modeBannerText = $("#mode-banner-text");
  var MODE_TEXT = {
    green: "綠燈模式：每人生成角色、每組生成三格圖、教師示範動畫",
    yellow: "黃燈模式：每人只生成一張角色、每組只生成高潮畫面",
    red: "紅燈模式：不使用即時 AI，改用預先準備的角色／背景圖與預先生成動畫"
  };

  function setMode(mode) {
    document.body.setAttribute("data-current-mode", mode);
    modeButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-mode") === mode));
    });
    modeBannerText.textContent = MODE_TEXT[mode];
    AICL.announce("已切換為" + (mode === "green" ? "綠燈" : mode === "yellow" ? "黃燈" : "紅燈") + "模式");
  }

  modeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setMode(btn.getAttribute("data-mode"));
    });
  });
  setMode("green");

  /* ---------------- 01 肖像權判斷題 ---------------- */

  var quizList = $("#quiz-list");
  DATA.rightsQuiz.forEach(function (q, qi) {
    var item = document.createElement("div");
    item.className = "quiz-item card";

    var question = document.createElement("p");
    question.className = "quiz-question";
    question.textContent = (qi + 1) + ". " + q.question;
    item.appendChild(question);

    var optionsWrap = document.createElement("div");
    optionsWrap.className = "quiz-options";
    optionsWrap.setAttribute("role", "group");
    optionsWrap.setAttribute("aria-label", q.question);

    var explain = document.createElement("div");
    explain.className = "quiz-explain";
    explain.setAttribute("role", "status");
    explain.textContent = q.explain;

    q.options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = opt.label;
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", function () {
        optionsWrap.querySelectorAll("button").forEach(function (b) {
          b.setAttribute("aria-pressed", "false");
        });
        btn.setAttribute("aria-pressed", "true");
        explain.classList.add("show");
        AICL.announce(opt.correct ? "答對了。" + q.explain : "再想想。" + q.explain);
      });
      optionsWrap.appendChild(btn);
    });

    item.appendChild(optionsWrap);
    item.appendChild(explain);
    quizList.appendChild(item);
  });

  /* ---------------- 02 範例角色卡 ---------------- */

  (function renderExampleCharacter() {
    var c = DATA.exampleCharacter;
    var mount = $("#example-character");
    [
      ["角色名稱", c.name],
      ["角色身分", c.identity],
      ["外觀錨點", c.appearance],
      ["特殊能力", c.ability],
      ["個性弱點", c.weakness]
    ].forEach(function (pair) {
      var p = document.createElement("p");
      p.className = "mb-0";
      var strong = document.createElement("strong");
      strong.textContent = pair[0] + "：";
      p.appendChild(strong);
      p.appendChild(document.createTextNode(pair[1]));
      mount.appendChild(p);
    });
  })();

  /* ---------------- 03 CREATE 框架 ---------------- */

  $("#create-mnemonic").textContent = DATA.createMnemonic;

  var createGrid = $("#create-grid");
  DATA.createLetters.forEach(function (item) {
    var cell = document.createElement("div");
    cell.className = "create-cell";
    var letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = item.letter;
    cell.appendChild(letter);
    var h4 = document.createElement("h4");
    h4.style.margin = "0 0 .3rem";
    h4.textContent = item.en + "　" + item.zh;
    cell.appendChild(h4);
    var p = document.createElement("p");
    p.className = "mb-0 small text-muted";
    p.textContent = item.desc;
    cell.appendChild(p);
    createGrid.appendChild(cell);
  });

  $("#create-incomplete").textContent = DATA.createExample.incomplete;
  $("#create-complete").textContent = DATA.createExample.complete;
  $("#copy-create-complete").addEventListener("click", function () {
    AICL.copyToClipboard(DATA.createExample.complete, $("#copy-create-feedback"));
  });

  /* ---------------- 04 輪盤 ---------------- */

  var wheelSelect = $("#wheel-select");
  DATA.wheels.forEach(function (w) {
    var opt = document.createElement("option");
    opt.value = w.id;
    opt.textContent = w.label;
    wheelSelect.appendChild(opt);
  });
  wheelSelect.value = "ability";

  var wheelMount = $("#wheel-mount");
  function mountWheel(id) {
    var wheelData = DATA.wheels.filter(function (w) { return w.id === id; })[0];
    AICL.createWheel({
      mount: wheelMount,
      label: wheelData.label,
      items: wheelData.items,
      maxSpins: Infinity,
      allowEdit: true
    });
  }
  wheelSelect.addEventListener("change", function () {
    mountWheel(wheelSelect.value);
  });
  mountWheel("ability");

  /* ---------------- 05 劇情設計範例 ---------------- */

  $("#example-one-line-story").textContent = AICL.compose.storySentence(DATA.exampleOneLineStory);

  var actList = $("#example-three-act");
  [DATA.exampleThreeAct.act1, DATA.exampleThreeAct.act2, DATA.exampleThreeAct.act3].forEach(function (line, i) {
    var li = document.createElement("li");
    li.textContent = line;
    actList.appendChild(li);
  });

  /* ---------------- 06 分鏡：構圖示意 SVG ---------------- */

  var SHOT_VIEWBOXES = [
    { name: "全景", vb: "0 0 200 220", note: "顯示完整人物與環境，交代場景與位置" },
    { name: "中景", vb: "0 25 200 140", note: "頭部到腰部，強調動作與姿態" },
    { name: "近景", vb: "20 8 160 95", note: "頭部到肩膀，強調表情與情緒" },
    { name: "特寫", vb: "45 3 110 65", note: "臉部細節，強調情緒張力" }
  ];

  function buildSilhouetteSVG(viewBox) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.setAttribute("class", "shot-diagram");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.innerHTML =
      '<rect x="0" y="0" width="200" height="220" fill="#ececE6"></rect>' +
      '<line x1="0" y1="190" x2="200" y2="190" stroke="#d8d4cb" stroke-width="2"></line>' +
      '<circle cx="100" cy="45" r="26" fill="#1c2541"></circle>' +
      '<path d="M70 95 Q100 80 130 95 L138 190 Q100 205 62 190 Z" fill="#1c2541"></path>' +
      '<path d="M70 100 L45 150" stroke="#1c2541" stroke-width="12" stroke-linecap="round"></path>' +
      '<path d="M130 100 L155 150" stroke="#1c2541" stroke-width="12" stroke-linecap="round"></path>';
    return svg;
  }

  var shotDiagrams = $("#shot-diagrams");
  SHOT_VIEWBOXES.forEach(function (shot) {
    var figure = document.createElement("figure");
    figure.className = "card";
    figure.style.margin = "0";
    figure.appendChild(buildSilhouetteSVG(shot.vb));
    var caption = document.createElement("figcaption");
    caption.style.marginTop = "0.6rem";
    var strong = document.createElement("strong");
    strong.textContent = shot.name + "　";
    caption.appendChild(strong);
    caption.appendChild(document.createTextNode(shot.note));
    figure.appendChild(caption);
    shotDiagrams.appendChild(figure);
  });

  /* ---------------- 06 範例分鏡 ---------------- */

  var exampleStoryboardMount = $("#example-storyboard");
  DATA.exampleStoryboard.forEach(function (shot, i) {
    var cell = document.createElement("div");
    cell.className = "storyboard-cell";
    var h4 = document.createElement("h4");
    h4.textContent = "第 " + (i + 1) + " 格（" + shot.shot + "）";
    cell.appendChild(h4);
    [
      ["事件", shot.event],
      ["動作", shot.action],
      ["表情", shot.expression],
      ["場景／光線", shot.scene]
    ].forEach(function (pair) {
      var p = document.createElement("p");
      p.className = "mb-0 small";
      var strong = document.createElement("strong");
      strong.textContent = pair[0] + "：";
      p.appendChild(strong);
      p.appendChild(document.createTextNode(pair[1]));
      cell.appendChild(p);
    });
    exampleStoryboardMount.appendChild(cell);
  });

  /* ---------------- 07 繪本 v.s. 動畫 Prompt ---------------- */

  $("#static-prompt-example").textContent = DATA.staticVsAnimationCompare.staticPrompt;
  $("#animation-prompt-example").textContent = DATA.staticVsAnimationCompare.animationPrompt;
})();
