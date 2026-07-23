/*
 * AICL 共用工具
 * 不使用 localStorage 儲存個資／作品內容；所有資料只存在記憶體中。
 * 不使用任何第三方追蹤或分析腳本。
 */
(function (global) {
  "use strict";

  var AICL = global.AICL || {};

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function prefersReducedMotion() {
    var systemPref = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var manualOverride = document.documentElement.classList.contains("force-reduced-motion");
    return Boolean(systemPref || manualOverride);
  }

  /** 移除檔名中不安全或不合法的字元，僅保留中英數、底線、連字號 */
  function sanitizeFileName(str) {
    return String(str || "")
      .trim()
      .replace(/[\\/:*?"<>|]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80) || "未命名";
  }

  function downloadBlob(filename, blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function downloadTextFile(filename, content) {
    downloadBlob(filename, new Blob([content], { type: "text/plain;charset=utf-8" }));
  }

  function downloadJSON(filename, obj) {
    downloadBlob(
      filename,
      new Blob([JSON.stringify(obj, null, 2)], { type: "application/json;charset=utf-8" })
    );
  }

  function downloadHTML(filename, htmlString) {
    downloadBlob(filename, new Blob([htmlString], { type: "text/html;charset=utf-8" }));
  }

  /** 複製文字到剪貼簿，並在 feedbackEl 上顯示暫時的成功提示（供螢幕閱讀器與視覺回饋） */
  function copyToClipboard(text, feedbackEl) {
    function showFeedback(ok) {
      if (!feedbackEl) return;
      feedbackEl.textContent = ok ? "已複製！" : "複製失敗，請手動選取文字";
      feedbackEl.classList.add("show");
      clearTimeout(feedbackEl._hideTimer);
      feedbackEl._hideTimer = setTimeout(function () {
        feedbackEl.classList.remove("show");
      }, 2200);
    }

    if (global.navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { showFeedback(true); },
        function () { legacyCopy(); }
      );
    } else {
      legacyCopy();
    }

    function legacyCopy() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        showFeedback(ok);
      } catch (e) {
        showFeedback(false);
      }
    }
  }

  /** 建立一個共用的 aria-live 播報區（若尚未存在） */
  function getLiveRegion() {
    var region = document.getElementById("aicl-live-region");
    if (!region) {
      region = document.createElement("div");
      region.id = "aicl-live-region";
      region.setAttribute("aria-live", "polite");
      region.className = "visually-hidden";
      document.body.appendChild(region);
    }
    return region;
  }

  function announce(message) {
    var region = getLiveRegion();
    region.textContent = "";
    // 強制重新播報，即使文字相同
    setTimeout(function () {
      region.textContent = message;
    }, 30);
  }

  /** 綁定字數提醒：更新 counterEl 文字，超過 max 時加上 warn class */
  function bindCharCount(inputEl, counterEl, max) {
    function update() {
      var len = inputEl.value.length;
      counterEl.textContent = len + " / " + max + " 字";
      counterEl.classList.toggle("text-muted", len <= max);
      if (len > max) {
        counterEl.style.color = "var(--color-red)";
      } else {
        counterEl.style.color = "";
      }
    }
    inputEl.addEventListener("input", update);
    update();
  }

  /** 顯示欄位錯誤訊息 */
  function setFieldError(fieldEl, message) {
    var errorEl = fieldEl.querySelector(".error-msg");
    if (message) {
      fieldEl.classList.add("has-error");
      if (errorEl) errorEl.textContent = message;
    } else {
      fieldEl.classList.remove("has-error");
      if (errorEl) errorEl.textContent = "";
    }
  }

  /** 若使用者尚未匯出但即將離開頁面，提醒資料會消失 */
  function warnBeforeUnload(hasUnsavedFn) {
    global.addEventListener("beforeunload", function (e) {
      if (hasUnsavedFn()) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    });
  }

  AICL.$ = $;
  AICL.$all = $all;
  AICL.prefersReducedMotion = prefersReducedMotion;
  AICL.sanitizeFileName = sanitizeFileName;
  AICL.downloadTextFile = downloadTextFile;
  AICL.downloadJSON = downloadJSON;
  AICL.downloadHTML = downloadHTML;
  AICL.copyToClipboard = copyToClipboard;
  AICL.announce = announce;
  AICL.bindCharCount = bindCharCount;
  AICL.setFieldError = setFieldError;
  AICL.warnBeforeUnload = warnBeforeUnload;

  global.AICL = AICL;
})(window);
