(function () {
  "use strict";
  var AICL = window.AICL;
  var $ = AICL.$;

  /* ---------------- 檔名產生小工具 ---------------- */

  var fnGroup = $("#fn-group");
  var fnSeat = $("#fn-seat");
  var fnTitle = $("#fn-title");
  var fnResult = $("#fn-result");

  function updateFileName() {
    if (!fnGroup.value && !fnSeat.value && !fnTitle.value) {
      fnResult.textContent = "請輸入以上欄位";
      return;
    }
    var name =
      AICL.sanitizeFileName(fnGroup.value || "組別") + "_" +
      AICL.sanitizeFileName(fnSeat.value || "座號") + "_" +
      AICL.sanitizeFileName(fnTitle.value || "作品名稱") + ".jpg";
    fnResult.textContent = name;
  }
  [fnGroup, fnSeat, fnTitle].forEach(function (el) {
    el.addEventListener("input", updateFileName);
  });
  updateFileName();

  $("#fn-copy").addEventListener("click", function () {
    AICL.copyToClipboard(fnResult.textContent, $("#fn-copy-feedback"));
  });

  /* ---------------- 上傳連結（教師自行填入，僅接受 http/https） ---------------- */

  function isSafeUrl(url) {
    return /^https?:\/\//i.test(url.trim());
  }

  function bindLinkPreview(inputEl) {
    inputEl.addEventListener("input", function () {
      var driveUrl = $("#link-drive").value.trim();
      var formUrl = $("#link-form").value.trim();
      var url = driveUrl || formUrl;
      var preview = $("#link-preview");
      var anchor = $("#link-anchor");
      if (url && isSafeUrl(url)) {
        anchor.href = url;
        anchor.textContent = url;
        preview.style.display = "block";
      } else {
        preview.style.display = "none";
        anchor.removeAttribute("href");
      }
    });
  }
  bindLinkPreview($("#link-drive"));
  bindLinkPreview($("#link-form"));

  /* ---------------- 檢查清單（非個資，可用 sessionStorage 暫存） ---------------- */

  var checklistBoxes = document.querySelectorAll('#print-checklist input[type="checkbox"]');
  var STORAGE_KEY = "aicl-print-checklist";

  function loadChecklist() {
    try {
      var saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
      checklistBoxes.forEach(function (box) {
        if (saved[box.id]) box.checked = true;
      });
    } catch (e) {
      /* sessionStorage 不可用時忽略 */
    }
  }

  function saveChecklist() {
    var state = {};
    checklistBoxes.forEach(function (box) { state[box.id] = box.checked; });
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* 忽略儲存失敗 */
    }
    updateChecklistStatus();
  }

  function updateChecklistStatus() {
    var total = checklistBoxes.length;
    var done = Array.prototype.filter.call(checklistBoxes, function (b) { return b.checked; }).length;
    $("#checklist-status").textContent = "已完成 " + done + " / " + total + " 項";
  }

  checklistBoxes.forEach(function (box) {
    box.addEventListener("change", saveChecklist);
  });
  loadChecklist();
  updateChecklistStatus();
})();
