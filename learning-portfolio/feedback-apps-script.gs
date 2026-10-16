/**
 * 講座回饋：把經歷轉譯卡送出的回饋寫進「填答」分頁。
 *
 * 部署步驟：
 * 1. 開啟 Google Sheet「講座回饋｜讓經歷會說話（蘭陽女中 2026-10-16）」
 * 2. 擴充功能 → Apps Script，刪除預設內容，貼上本檔全部內容，儲存
 * 3. 部署 → 新增部署作業 → 類型選「網頁應用程式」
 *    執行身分：我；誰可以存取：所有人
 * 4. 按「部署」並完成授權，複製結尾為 /exec 的網址
 * 5. 把網址填入經歷轉譯卡 index.html 的 FEEDBACK_URL
 */
const SHEET_NAME = '填答';
const GRADES = ['高一', '高二', '高三'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.website) return reply_('ok'); // 機器人欄位，真人看不到

  const grade = GRADES.indexOf(p.grade) >= 0 ? p.grade : '';
  const scores = [];
  for (let i = 1; i <= 8; i++) {
    const v = Number(p['q' + i]);
    scores.push(Number.isInteger(v) && v >= 1 && v <= 4 ? v : '');
  }
  if (scores.every(function (v) { return v === ''; })) return reply_('empty');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if (sheet.getRange('M1').getValue() === '') sheet.getRange('M1').setValue('線上填答時間');
    const id = sheet.getLastRow(); // 第 1 列是標題，所以下一筆編號 = 目前最後一列
    sheet.appendRow([id, grade].concat(scores, [clean_(p.gain), clean_(p.improve), new Date()]));
  } finally {
    lock.releaseLock();
  }
  return reply_('ok');
}

// 限制長度，並避免以 = + - @ 開頭的文字被當成公式
function clean_(s) {
  s = String(s || '').slice(0, 500).trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply_(s) {
  return ContentService.createTextOutput(s);
}
