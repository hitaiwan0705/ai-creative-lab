(function () {
  "use strict";
  var AICL = window.AICL;
  var $ = AICL.$;
  var $all = AICL.$all;
  var DATA = AICL.DATA;
  var compose = AICL.compose;

  var exported = false;

  /* ---------------- STEP 1：規則同意閘門 ---------------- */

  var agree1 = $("#agree-1");
  var agree2 = $("#agree-2");
  var startBtn = $("#btn-start");
  var gateHint = $("#gate-hint");
  var workspace = $("#workspace");

  function updateGate() {
    startBtn.disabled = !(agree1.checked && agree2.checked);
  }
  agree1.addEventListener("change", updateGate);
  agree2.addEventListener("change", updateGate);
  updateGate();

  startBtn.addEventListener("click", function () {
    if (startBtn.disabled) return;
    workspace.hidden = false;
    gateHint.textContent = "已確認規則，祝你創作愉快！";
    workspace.scrollIntoView({ behavior: AICL.prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    updateStepProgress();
  });

  /* ---------------- 進度列（依可視 step 更新） ---------------- */

  var steps = $all("[data-step]");
  var progressFill = $("#student-progress-fill");
  var progressLabel = $("#progress-label");
  var STEP_NAMES = [
    "基本資料", "角色五格卡", "CREATE Prompt", "隨機輪盤", "一句話故事",
    "三幕劇", "三格分鏡", "動畫 Prompt", "匯出作品"
  ];

  function updateStepProgress() {
    if (workspace.hidden) {
      progressFill.style.width = "5%";
      progressLabel.textContent = "目前進度：閱讀規則";
      return;
    }
    var scrollPos = window.scrollY + 160;
    var idx = 0;
    steps.forEach(function (sec, i) {
      if (sec.offsetTop <= scrollPos) idx = i;
    });
    var pct = Math.round(((idx + 1) / steps.length) * 100);
    progressFill.style.width = pct + "%";
    progressLabel.textContent = "目前進度：STEP " + (idx + 2) + "　" + STEP_NAMES[idx];
  }
  window.addEventListener("scroll", updateStepProgress, { passive: true });
  window.addEventListener("resize", updateStepProgress);

  /* ---------------- 必填欄位驗證 ---------------- */

  function validateRequired(inputEl, message) {
    var field = inputEl.closest(".field");
    if (!field) return true;
    if (!inputEl.value.trim()) {
      AICL.setFieldError(field, message);
      return false;
    }
    AICL.setFieldError(field, "");
    return true;
  }

  [
    [$("#meta-group"), "請填寫組別"],
    [$("#meta-seat"), "請填寫座號或代號"],
    [$("#meta-title"), "請填寫作品名稱"],
    [$("#char-name"), "請填寫角色名稱"]
  ].forEach(function (pair) {
    pair[0].addEventListener("blur", function () {
      validateRequired(pair[0], pair[1]);
    });
  });

  /* ---------------- STEP 3：角色五格卡字數提醒 ---------------- */

  ["char-identity", "char-appearance", "char-ability", "char-weakness"].forEach(function (id) {
    var input = document.getElementById(id);
    var counter = document.querySelector('[data-count-for="' + id + '"]');
    if (input && counter) {
      AICL.bindCharCount(input, counter, input.maxLength);
    }
  });

  function getCharacterState() {
    return {
      name: $("#char-name").value,
      identity: $("#char-identity").value,
      appearance: $("#char-appearance").value,
      ability: $("#char-ability").value,
      weakness: $("#char-weakness").value
    };
  }

  function cleanJoin(parts, separator) {
    return parts.filter(function (part) {
      return part && part.toString().trim();
    }).join(separator || "，");
  }

  function setFieldValue(id, value) {
    var el = document.getElementById(id);
    if (!el) return;
    el.value = value || "";
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function characterLabel() {
    var c = getCharacterState();
    return cleanJoin([
      c.identity,
      c.name ? "名叫「" + c.name + "」" : "",
      c.appearance
    ]);
  }

  function characterConstraint() {
    var c = getCharacterState();
    return cleanJoin([
      c.name ? "角色名稱：" + c.name : "",
      c.identity ? "身分：" + c.identity : "",
      c.appearance ? "外觀：" + c.appearance : "",
      c.ability ? "特殊能力：" + c.ability : "",
      c.weakness ? "弱點：" + c.weakness : ""
    ]);
  }

  /* ---------------- STEP 4：CREATE Prompt 組合器 ---------------- */

  var createIds = ["create-context", "create-role", "create-elements", "create-action", "create-tone", "create-expectation"];
  var createResultEl = $("#create-result");

  var CREATE_EXAMPLE = {
    context: "近未來的港口城市，傍晚下著細雨",
    role: "17 歲街頭攝影師，短髮、深藍色防水外套",
    elements: "一台復古底片相機、被雨水打濕的招牌燈光",
    action: "舉起相機，準備拍下街角一閃而過的畫面",
    tone: "懷舊、寧靜中帶點孤獨感",
    expectation: "直式構圖、電影感畫面、不要出現任何文字或 Logo"
  };

  function getCreateMode() {
    return document.querySelector('input[name="create-mode"]:checked').value;
  }

  function getCreateFields() {
    return {
      context: $("#create-context").value,
      role: $("#create-role").value,
      elements: $("#create-elements").value,
      action: $("#create-action").value,
      tone: $("#create-tone").value,
      expectation: $("#create-expectation").value
    };
  }

  function updateCreateResult() {
    createResultEl.textContent = compose.createPrompt(getCreateFields(), getCreateMode());
  }

  createIds.forEach(function (id) {
    document.getElementById(id).addEventListener("input", updateCreateResult);
  });
  $all('input[name="create-mode"]').forEach(function (radio) {
    radio.addEventListener("change", updateCreateResult);
  });

  $("#create-copy").addEventListener("click", function () {
    AICL.copyToClipboard(createResultEl.textContent, $("#create-copy-feedback"));
  });
  $("#create-clear").addEventListener("click", function () {
    createIds.forEach(function (id) { document.getElementById(id).value = ""; });
    updateCreateResult();
  });
  $("#create-restore").addEventListener("click", function () {
    createIds.forEach(function (id) {
      var key = id.replace("create-", "");
      document.getElementById(id).value = CREATE_EXAMPLE[key];
    });
    updateCreateResult();
  });
  $("#create-apply-character").addEventListener("click", function () {
    var c = getCharacterState();
    setFieldValue("create-role", characterLabel());
    setFieldValue("create-elements", cleanJoin([
      c.ability ? "特殊能力：" + c.ability : "",
      c.weakness ? "個性弱點：" + c.weakness : ""
    ]));
    setFieldValue(
      "create-expectation",
      cleanJoin([
        "保持角色特徵一致",
        c.appearance ? "固定外觀：" + c.appearance : "",
        "不要出現文字或 Logo"
      ])
    );
    updateCreateResult();
    AICL.announce("已沿用角色五格到 CREATE Prompt");
  });
  updateCreateResult();

  /* ---------------- STEP 5：輪盤 ---------------- */

  var studentWheelSelect = $("#student-wheel-select");
  var placeholderOpt = document.createElement("option");
  placeholderOpt.value = "";
  placeholderOpt.textContent = "請選擇輪盤";
  studentWheelSelect.appendChild(placeholderOpt);
  DATA.wheels.forEach(function (w) {
    var opt = document.createElement("option");
    opt.value = w.id;
    opt.textContent = w.label;
    studentWheelSelect.appendChild(opt);
  });

  var wheelMount = $("#student-wheel-mount");
  var applyRow = $("#wheel-apply-row");

  var WHEEL_TARGET_MAP = {
    identity: { label: "角色身分", set: function (v) { $("#char-identity").value = v; $("#char-identity").dispatchEvent(new Event("input")); } },
    ability: { label: "特殊能力", set: function (v) { $("#char-ability").value = v; $("#char-ability").dispatchEvent(new Event("input")); } },
    goal: { label: "故事目標", set: function (v) { $("#story-goal").value = v; updateStoryResult(); } },
    obstacle: { label: "故事阻礙", set: function (v) { $("#story-obstacle").value = v; updateStoryResult(); } },
    worldview: { label: "CREATE 情境", set: function (v) { $("#create-context").value = v; updateCreateResult(); } },
    tone: { label: "CREATE 風格與情緒", set: function (v) { $("#create-tone").value = v; updateCreateResult(); } }
  };

  function mountStudentWheel(id) {
    applyRow.hidden = true;
    applyRow.innerHTML = "";
    if (!id) {
      wheelMount.innerHTML = "";
      return;
    }
    var wheelData = DATA.wheels.filter(function (w) { return w.id === id; })[0];
    AICL.createWheel({
      mount: wheelMount,
      label: wheelData.label,
      items: wheelData.items,
      maxSpins: 1,
      allowEdit: false,
      onAccept: function (result) {
        var target = WHEEL_TARGET_MAP[id];
        if (!target) return;
        applyRow.hidden = false;
        applyRow.innerHTML = "";
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-accent btn-sm";
        btn.textContent = "帶入「" + target.label + "」欄位";
        btn.addEventListener("click", function () {
          target.set(result);
          AICL.announce("已將「" + result + "」帶入" + target.label + "欄位");
        });
        applyRow.appendChild(btn);
      }
    });
  }

  studentWheelSelect.addEventListener("change", function () {
    mountStudentWheel(studentWheelSelect.value);
  });

  /* ---------------- STEP 6：一句話故事 ---------------- */

  var storyIds = ["story-protagonist", "story-goal", "story-obstacle", "story-change"];
  var storyResultEl = $("#story-result");

  function getStoryFields() {
    return {
      protagonist: $("#story-protagonist").value,
      goal: $("#story-goal").value,
      obstacle: $("#story-obstacle").value,
      change: $("#story-change").value
    };
  }
  function updateStoryResult() {
    storyResultEl.textContent = compose.storySentence(getStoryFields());
  }
  storyIds.forEach(function (id) {
    document.getElementById(id).addEventListener("input", updateStoryResult);
  });
  $("#story-copy").addEventListener("click", function () {
    AICL.copyToClipboard(storyResultEl.textContent, $("#story-copy-feedback"));
  });
  $("#story-apply-character").addEventListener("click", function () {
    var c = getCharacterState();
    setFieldValue("story-protagonist", characterLabel());
    setFieldValue("story-goal", c.ability ? "運用「" + c.ability + "」完成重要任務" : "");
    setFieldValue("story-obstacle", c.weakness ? "因為「" + c.weakness + "」而遇到阻礙" : "");
    setFieldValue("story-change", cleanJoin([
      c.weakness ? "學會面對「" + c.weakness + "」" : "",
      c.ability ? "善用「" + c.ability + "」" : ""
    ], "，並"));
    updateStoryResult();
    AICL.announce("已沿用角色五格到一句話故事");
  });
  updateStoryResult();

  /* ---------------- STEP 7：三幕劇 ---------------- */

  var threeActIds = ["act1-life", "act1-want", "act2-problem", "act2-escalate", "act3-choice", "act3-change"];
  var threeActResultEl = $("#threeact-result");

  function getThreeActFields() {
    return {
      act1_life: $("#act1-life").value,
      act1_want: $("#act1-want").value,
      act2_problem: $("#act2-problem").value,
      act2_escalate: $("#act2-escalate").value,
      act3_choice: $("#act3-choice").value,
      act3_change: $("#act3-change").value
    };
  }
  function updateThreeActResult() {
    threeActResultEl.innerHTML = "";
    compose.threeActSummary(getThreeActFields()).forEach(function (line) {
      var li = document.createElement("li");
      li.textContent = line;
      threeActResultEl.appendChild(li);
    });
  }
  threeActIds.forEach(function (id) {
    document.getElementById(id).addEventListener("input", updateThreeActResult);
  });
  $("#threeact-copy").addEventListener("click", function () {
    var text = compose.threeActSummary(getThreeActFields()).join("\n");
    AICL.copyToClipboard(text, $("#threeact-copy-feedback"));
  });
  $("#threeact-apply-story").addEventListener("click", function () {
    var c = getCharacterState();
    var s = getStoryFields();
    setFieldValue("act1-life", s.protagonist || c.identity || characterLabel());
    setFieldValue("act1-want", s.goal);
    setFieldValue("act2-problem", s.obstacle);
    setFieldValue("act2-escalate", c.weakness ? "弱點「" + c.weakness + "」讓問題變得更嚴重" : s.obstacle);
    setFieldValue("act3-choice", s.change);
    setFieldValue("act3-change", s.change);
    updateThreeActResult();
    AICL.announce("已沿用一句話故事到三幕劇");
  });
  updateThreeActResult();

  /* ---------------- STEP 8：三格分鏡 ---------------- */

  var SHOT_OPTIONS = ["全景", "中景", "近景", "特寫"];
  var SHOT_DEFAULT_INDEX = [0, 2, 1];
  var storyboardMount = $("#storyboard-shots");

  function buildShotBlock(index) {
    var n = index + 1;
    var wrap = document.createElement("div");
    wrap.className = "storyboard-cell";
    wrap.style.marginBottom = "1.2rem";

    var h3 = document.createElement("h3");
    h3.textContent = "第 " + n + " 格";
    wrap.appendChild(h3);

    var fields = [
      ["event", "事件", "textarea"],
      ["action", "動作", "textarea"],
      ["expression", "表情", "textarea"],
      ["scene", "場景／光線", "textarea"]
    ];

    fields.forEach(function (f) {
      var id = "shot" + n + "-" + f[0];
      var fieldDiv = document.createElement("div");
      fieldDiv.className = "field";
      var label = document.createElement("label");
      label.setAttribute("for", id);
      label.textContent = f[1];
      var input = document.createElement("textarea");
      input.id = id;
      input.maxLength = 60;
      fieldDiv.appendChild(label);
      fieldDiv.appendChild(input);
      wrap.appendChild(fieldDiv);
    });

    var shotFieldDiv = document.createElement("div");
    shotFieldDiv.className = "field";
    var shotLabel = document.createElement("label");
    shotLabel.setAttribute("for", "shot" + n + "-shot");
    shotLabel.textContent = "鏡位";
    var select = document.createElement("select");
    select.id = "shot" + n + "-shot";
    SHOT_OPTIONS.forEach(function (opt) {
      var o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      select.appendChild(o);
    });
    select.selectedIndex = SHOT_DEFAULT_INDEX[index] || 0;
    shotFieldDiv.appendChild(shotLabel);
    shotFieldDiv.appendChild(select);
    wrap.appendChild(shotFieldDiv);

    var resultLabel = document.createElement("h4");
    resultLabel.textContent = "這一格的生圖 Prompt";
    wrap.appendChild(resultLabel);
    var resultEl = document.createElement("p");
    resultEl.className = "prompt-box";
    resultEl.setAttribute("aria-live", "polite");
    wrap.appendChild(resultEl);

    var btnRow = document.createElement("div");
    btnRow.className = "btn-row";
    var copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "btn btn-outline btn-sm";
    copyBtn.textContent = "複製第 " + n + " 格 Prompt";
    var feedback = document.createElement("span");
    feedback.className = "copy-feedback";
    btnRow.appendChild(copyBtn);
    btnRow.appendChild(feedback);
    wrap.appendChild(btnRow);

    function getShotState() {
      return {
        event: wrap.querySelector("#shot" + n + "-event").value,
        action: wrap.querySelector("#shot" + n + "-action").value,
        expression: wrap.querySelector("#shot" + n + "-expression").value,
        shot: select.value,
        scene: wrap.querySelector("#shot" + n + "-scene").value
      };
    }
    function updateResult() {
      resultEl.textContent = compose.storyboardPrompt(getShotState(), getCharacterState());
    }
    function setShotState(next) {
      ["event", "action", "expression", "scene"].forEach(function (key) {
        var input = wrap.querySelector("#shot" + n + "-" + key);
        input.value = next[key] || "";
      });
      if (next.shot) select.value = next.shot;
      updateResult();
    }
    wrap.querySelectorAll("textarea, select").forEach(function (el) {
      el.addEventListener("input", updateResult);
      el.addEventListener("change", updateResult);
    });
    copyBtn.addEventListener("click", function () {
      AICL.copyToClipboard(resultEl.textContent, feedback);
    });

    updateResult();
    storyboardMount.appendChild(wrap);
    return { getShotState: getShotState, setShotState: setShotState, updateResult: updateResult };
  }

  var shotBlocks = [buildShotBlock(0), buildShotBlock(1), buildShotBlock(2)];

  function getStoryboardState() {
    return shotBlocks.map(function (b) { return b.getShotState(); });
  }

  function updateAllStoryboardPrompts() {
    shotBlocks.forEach(function (b) { b.updateResult(); });
  }

  ["char-name", "char-identity", "char-appearance", "char-ability", "char-weakness"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", updateAllStoryboardPrompts);
  });

  $("#storyboard-apply-threeact").addEventListener("click", function () {
    var a = getThreeActFields();
    shotBlocks[0].setShotState({
      event: a.act1_life,
      action: a.act1_want ? "想要" + a.act1_want : "",
      expression: "期待、專注",
      shot: "全景",
      scene: $("#create-context").value || "故事開始的主要場景"
    });
    shotBlocks[1].setShotState({
      event: a.act2_problem,
      action: a.act2_escalate,
      expression: "緊張、猶豫",
      shot: "近景",
      scene: $("#create-tone").value || "衝突升高的場景與光線"
    });
    shotBlocks[2].setShotState({
      event: a.act3_change,
      action: a.act3_choice,
      expression: "下定決心、產生改變",
      shot: "中景",
      scene: "故事結尾的場景，光線比前面更明亮"
    });
    AICL.announce("已沿用三幕劇到三格分鏡");
  });

  /* ---------------- STEP 9：動畫 Prompt ---------------- */

  var animIds = ["anim-start", "anim-follow", "anim-expression", "anim-env", "anim-camera", "anim-nodeform"];
  var animationResultEl = $("#animation-result");

  function getAnimationFields() {
    return {
      startAction: $("#anim-start").value,
      followAction: $("#anim-follow").value,
      expressionChange: $("#anim-expression").value,
      envMotion: $("#anim-env").value,
      cameraMotion: $("#anim-camera").value,
      noDeform: $("#anim-nodeform").value
    };
  }
  function updateAnimationResult() {
    animationResultEl.textContent = compose.animationPrompt(getAnimationFields());
  }
  animIds.forEach(function (id) {
    document.getElementById(id).addEventListener("input", updateAnimationResult);
  });
  $("#animation-copy").addEventListener("click", function () {
    AICL.copyToClipboard(animationResultEl.textContent, $("#animation-copy-feedback"));
  });
  $("#animation-apply-shot").addEventListener("click", function () {
    var shot = getStoryboardState()[1] || {};
    setFieldValue("anim-start", shot.action);
    setFieldValue("anim-follow", shot.event);
    setFieldValue("anim-expression", shot.expression);
    setFieldValue("anim-env", shot.scene);
    setFieldValue("anim-camera", shot.shot === "近景" || shot.shot === "特寫" ? "鏡頭緩慢推近角色表情" : "鏡頭保持穩定並跟隨角色動作");
    setFieldValue("anim-nodeform", "禁止臉部、服裝、道具變形，保持角色一致性：" + characterConstraint());
    updateAnimationResult();
    AICL.announce("已沿用第二格分鏡到動畫 Prompt");
  });
  updateAnimationResult();

  /* ---------------- STEP 10：匯出 ---------------- */

  function getFullState() {
    return {
      meta: {
        group: $("#meta-group").value,
        seat: $("#meta-seat").value,
        title: $("#meta-title").value,
        name: $("#meta-name").value
      },
      character: getCharacterState(),
      create: (function () {
        var f = getCreateFields();
        f.mode = getCreateMode();
        return f;
      })(),
      story: getStoryFields(),
      threeAct: getThreeActFields(),
      storyboard: getStoryboardState(),
      animation: getAnimationFields()
    };
  }

  $("#export-all").addEventListener("click", function () {
    var requiredOk = true;
    [
      [$("#meta-group"), "請填寫組別"],
      [$("#meta-seat"), "請填寫座號或代號"],
      [$("#meta-title"), "請填寫作品名稱"],
      [$("#char-name"), "請填寫角色名稱"]
    ].forEach(function (pair) {
      if (!validateRequired(pair[0], pair[1])) {
        requiredOk = false;
      }
    });
    if (!requiredOk) {
      $("#export-status").textContent = "請先完成必填欄位（組別／座號／作品名稱／角色名稱）再匯出。";
      $("#meta-group").focus();
      return;
    }
    AICL.exportBundle.downloadAll(getFullState());
    exported = true;
    $("#export-status").textContent = "已下載完整匯出檔案，請確認資料夾中已出現對應檔案。";
    AICL.announce("已匯出作品內容");
  });

  /* ---------------- 離開頁面前提醒 ---------------- */

  AICL.warnBeforeUnload(function () {
    if (exported) return false;
    var state = getFullState();
    var flat = JSON.stringify(state.meta) + JSON.stringify(state.character) + JSON.stringify(state.story);
    return /[一-鿿A-Za-z0-9]/.test(flat);
  });

  updateStepProgress();
})();
