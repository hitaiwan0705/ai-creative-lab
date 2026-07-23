/*
 * AICL 隨機輪盤元件
 * 純前端實作，不呼叫任何外部輪盤網站或 API。
 * 視覺轉盤為裝飾用途（固定六色扇形），實際抽選結果以文字＋aria-live播報為準，
 * 不因項目數量而重新繪製扇形，教學情境下不影響公平性（結果仍為均勻亂數）。
 */
(function (global) {
  "use strict";

  var AICL = global.AICL || {};

  /**
   * 建立一個輪盤元件
   * @param {Object} opts
   * @param {HTMLElement} opts.mount 掛載容器
   * @param {string} opts.label 輪盤名稱（例如「能力輪盤」）
   * @param {string[]} opts.items 選項陣列
   * @param {number} [opts.maxSpins=Infinity] 最多可重抽次數（不含第一次抽選）
   * @param {function} [opts.onAccept] 使用者按下「接受」時呼叫，帶入目前結果字串
   * @param {boolean} [opts.allowEdit=false] 是否顯示「編輯選項」文字框（教師模式用）
   */
  function createWheel(opts) {
    var mount = opts.mount;
    var items = opts.items.slice();
    var maxSpins = typeof opts.maxSpins === "number" ? opts.maxSpins : Infinity;
    var spinCount = 0;
    var currentResult = null;
    var accepted = false;
    var isSpinning = false;

    mount.innerHTML = "";
    mount.classList.add("wheel-widget");

    var heading = document.createElement("p");
    heading.className = "small text-muted";
    heading.textContent = "目前輪盤：" + opts.label;
    mount.appendChild(heading);

    var dial = document.createElement("div");
    dial.className = "wheel-dial";
    dial.setAttribute("aria-hidden", "true");
    var pointer = document.createElement("div");
    pointer.className = "wheel-dial__pointer";
    dial.appendChild(pointer);
    mount.appendChild(dial);

    var resultEl = document.createElement("p");
    resultEl.className = "wheel-result";
    resultEl.setAttribute("role", "status");
    resultEl.setAttribute("aria-live", "polite");
    resultEl.textContent = "尚未抽選";
    mount.appendChild(resultEl);

    var spinInfo = document.createElement("p");
    spinInfo.className = "small text-muted";
    mount.appendChild(spinInfo);

    var btnRow = document.createElement("div");
    btnRow.className = "btn-row";

    var spinBtn = makeBtn("btn-accent", "旋轉抽選");
    var redrawBtn = makeBtn("btn-outline", "重抽一次");
    var acceptBtn = makeBtn("btn-primary", "接受這個結果");
    var copyBtn = makeBtn("btn-ghost", "複製結果");
    var copyFeedback = document.createElement("span");
    copyFeedback.className = "copy-feedback";
    copyFeedback.setAttribute("role", "status");

    redrawBtn.disabled = true;
    acceptBtn.disabled = true;
    copyBtn.disabled = true;

    btnRow.appendChild(spinBtn);
    btnRow.appendChild(redrawBtn);
    btnRow.appendChild(acceptBtn);
    btnRow.appendChild(copyBtn);
    btnRow.appendChild(copyFeedback);
    mount.appendChild(btnRow);

    var acceptedNote = document.createElement("p");
    acceptedNote.className = "small";
    acceptedNote.setAttribute("aria-live", "polite");
    mount.appendChild(acceptedNote);

    if (opts.allowEdit) {
      var editWrap = document.createElement("details");
      editWrap.className = "field";
      editWrap.style.marginTop = "0.8rem";
      var summary = document.createElement("summary");
      summary.textContent = "編輯這個輪盤的選項（每行一項）";
      summary.style.cursor = "pointer";
      summary.style.fontWeight = "700";
      var textarea = document.createElement("textarea");
      textarea.value = items.join("\n");
      textarea.setAttribute("aria-label", opts.label + " 選項編輯");
      textarea.rows = Math.min(10, Math.max(4, items.length));
      var applyBtn = makeBtn("btn-outline", "套用修改", true);
      applyBtn.addEventListener("click", function () {
        var lines = textarea.value
          .split("\n")
          .map(function (s) { return s.trim(); })
          .filter(Boolean);
        if (lines.length > 0) {
          items = lines;
          AICL.announce("已更新" + opts.label + "選項，共 " + lines.length + " 項");
        }
      });
      editWrap.appendChild(summary);
      editWrap.appendChild(textarea);
      editWrap.appendChild(applyBtn);
      mount.appendChild(editWrap);
    }

    function makeBtn(cls, text, small) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "btn " + cls + (small ? " btn-sm" : "");
      b.textContent = text;
      return b;
    }

    function updateSpinInfo() {
      if (maxSpins === Infinity) {
        spinInfo.textContent = "已抽選 " + spinCount + " 次";
      } else {
        spinInfo.textContent = "重抽次數：" + Math.max(0, spinCount - 1) + " / " + maxSpins;
      }
    }

    function pick() {
      return items[Math.floor(Math.random() * items.length)];
    }

    function spin(isRedraw) {
      if (accepted || isSpinning) return;
      isSpinning = true;
      spinBtn.disabled = true;
      redrawBtn.disabled = true;
      acceptBtn.disabled = true;
      copyBtn.disabled = true;

      spinCount += 1;
      currentResult = pick();
      updateSpinInfo();

      if (AICL.prefersReducedMotion()) {
        finishSpin();
      } else {
        var extraTurns = 4 + Math.floor(Math.random() * 3);
        var randomOffset = Math.floor(Math.random() * 360);
        var deg = extraTurns * 360 + randomOffset;
        dial.style.transform = "rotate(" + deg + "deg)";
        resultEl.textContent = "轉動中…";
        setTimeout(finishSpin, 2200);
      }

      function finishSpin() {
        isSpinning = false;
        resultEl.textContent = currentResult;
        AICL.announce("抽選結果：" + currentResult);
        acceptBtn.disabled = false;
        copyBtn.disabled = false;
        spinBtn.disabled = true;
        redrawBtn.disabled = spinCount - 1 >= maxSpins;
      }
    }

    spinBtn.addEventListener("click", function () {
      spin(false);
    });

    redrawBtn.addEventListener("click", function () {
      spin(true);
    });

    acceptBtn.addEventListener("click", function () {
      if (!currentResult) return;
      accepted = true;
      spinBtn.disabled = true;
      redrawBtn.disabled = true;
      acceptBtn.disabled = true;
      acceptedNote.textContent = "已接受結果：「" + currentResult + "」";
      if (typeof opts.onAccept === "function") {
        opts.onAccept(currentResult);
      }
    });

    copyBtn.addEventListener("click", function () {
      if (currentResult) {
        AICL.copyToClipboard(currentResult, copyFeedback);
      }
    });

    return {
      getResult: function () { return currentResult; },
      isAccepted: function () { return accepted; },
      reset: function () {
        spinCount = 0;
        currentResult = null;
        accepted = false;
        isSpinning = false;
        resultEl.textContent = "尚未抽選";
        acceptedNote.textContent = "";
        spinBtn.disabled = false;
        redrawBtn.disabled = true;
        acceptBtn.disabled = true;
        copyBtn.disabled = true;
        updateSpinInfo();
        dial.style.transform = "";
      }
    };
  }

  AICL.createWheel = createWheel;
  global.AICL = AICL;
})(window);
