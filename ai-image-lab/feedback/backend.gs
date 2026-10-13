/**
 * AI 形象實驗室｜回饋問卷後台（第二堂表單建立 ＋ 即時統計 API）
 *
 * 設定方式（沿用你已部署的同一個 Apps Script 專案，網址不變）：
 * 1. 打開原本的 Apps Script 專案，把 Code.gs 全部內容換成這個檔案 → 儲存
 * 2. 上方函式選 createWeek2Form → 執行（第二堂表單只需建一次；會要求一次授權）
 * 3. 右上「部署」→「管理部署作業」→ 鉛筆（編輯）→ 版本選「新版本」→ 部署
 *    執行身分：我；存取權：所有人。網址維持原本的 /exec 不變。
 * 4. 回對話跟 Claude 說「好了」
 *
 * 統計 API 只回傳「次數」，不回傳任何學生寫的文字，也不回傳時間戳記以外的個資。
 *   GET <exec>?s=1            第一堂統計
 *   GET <exec>?s=2            第二堂統計
 *   &since=2026-10-20T09:00   只算這個時間之後的回應（同一天多個班時用）
 *   &callback=fn              JSONP
 */

// 第一堂回應試算表（已建立）
const SHEET_W1 = '1Txj70IjehQBtFeLljipgSqMM6p1sArMFa-73TcG_zLQ';
const SITE = 'https://hitaiwan0705.github.io/ai-creative-lab/ai-image-lab/';
const TEST_MARK = 'Claude 連線測試';

// ---------- 題目（必須與網站 assets/feedback.js、week2/assets/feedback2.js 完全一致） ----------
const W1 = {
  q1: { options: ['眼睛變大', '臉變小、下巴變尖', '皮膚變光滑', '膚色變白、變亮', '髮型改變', '衣服改變', '背景改變'],
        correct: ['眼睛變大', '臉變小、下巴變尖', '皮膚變光滑', '膚色變白、變亮'] },
  q2: { options: ['因為這樣就是美的標準答案，AI 只是照著做',
                  'AI 從大量人類照片和修圖習慣中，學到某一種常見的審美，就往那個方向修',
                  '這是電腦程式的隨機錯誤', '因為每個使用者都主動要求這樣修'],
        correct: 'AI 從大量人類照片和修圖習慣中，學到某一種常見的審美，就往那個方向修' },
  q3: { options: ['1 非常不同意', '2 不同意', '3 普通', '4 同意', '5 非常同意'] }
};
const W2 = {
  q1: { title: '1. 這則訊息有哪些警訊？（可複選）',
        options: ['叫你趕快轉傳', '沒說是哪個單位公布的', '罰款數字很嚇人，卻沒有出處', '沒有附原始連結或公告',
                  '用了驚嘆號，所以一定是假的', '是朋友傳的，所以可以相信', '字數太短'],
        correct: ['叫你趕快轉傳', '沒說是哪個單位公布的', '罰款數字很嚇人，卻沒有出處', '沒有附原始連結或公告'] },
  q2: { title: '2. 你和同學滑同一個 App，看到的內容卻很不一樣。最主要的原因是？',
        options: ['因為手機型號不同', '系統根據每個人過去的按讚、停留時間等紀錄，推測並挑選內容',
                  '平台每天隨機分配', '有小編幫每個人人工挑選'],
        correct: '系統根據每個人過去的按讚、停留時間等紀錄，推測並挑選內容' },
  q3: { title: '3.「一則消息只要很多人分享，大概就是真的。」你同意嗎？',
        options: ['1 非常不同意', '2 不同意', '3 普通', '4 同意', '5 非常同意'] }
};
const W2_MESSAGE = '【緊急】明天起全台手搖飲店全面禁用塑膠杯，違者罰 10 萬！快告訴大家！！（來源：LINE 群組轉傳）';

// ---------- 建立第二堂表單（執行一次） ----------
function createWeek2Form() {
  const form = FormApp.create('AI 資訊實驗室｜第二堂課後回饋（3 題）');
  form.setDescription('沒有對錯壓力，大約 1 分鐘。答案只用於改進課程。')
      .setIsQuiz(true).setCollectEmail(false)
      .setLimitOneResponsePerUser(false).setShowLinkToRespondAgain(false);

  form.addSectionHeaderItem().setTitle('先讀這則訊息').setHelpText(W2_MESSAGE);
  const i1 = form.addCheckboxItem().setTitle(W2.q1.title).setRequired(true);
  i1.setChoices(W2.q1.options.map(o => i1.createChoice(o, W2.q1.correct.indexOf(o) >= 0))).setPoints(1);
  const i2 = form.addMultipleChoiceItem().setTitle(W2.q2.title).setRequired(true);
  i2.setChoices(W2.q2.options.map(o => i2.createChoice(o, o === W2.q2.correct))).setPoints(1);
  const i3 = form.addMultipleChoiceItem().setTitle(W2.q3.title).setRequired(true);
  i3.setChoices(W2.q3.options.map(o => i3.createChoice(o)));
  const i3r = form.addTextItem().setTitle('可以多說一句為什麼（選填）');

  const ss = SpreadsheetApp.create('AI 資訊實驗室｜第二堂課後回饋（回應）');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  PropertiesService.getScriptProperties().setProperty('SHEET_W2', ss.getId());

  const pre = form.createResponse()
    .withItemResponse(i1.createResponse([W2.q1.options[0]]))
    .withItemResponse(i2.createResponse(W2.q2.options[0]))
    .withItemResponse(i3.createResponse(W2.q3.options[0]))
    .withItemResponse(i3r.createResponse('x'))
    .toPrefilledUrl();
  const ids = pre.match(/entry\.\d+/g) || [];
  const pub = form.getPublishedUrl();
  const cfg = { action: pub.replace(/\/viewform.*$/, '/formResponse'), url: pub,
                entries: { q1: ids[0], q2: ids[1], q3: ids[2], q3r: ids[3] } };

  const doc = DocumentApp.create('AI 資訊實驗室｜第二堂回饋表單設定（給 Claude 讀取）');
  doc.getBody().setText('FEEDBACK_FORM_CONFIG\n' + JSON.stringify(cfg) +
    '\nEDIT_URL ' + form.getEditUrl() + '\nSHEET_URL ' + ss.getUrl());
  doc.saveAndClose();
  Logger.log('完成！表單：' + form.getEditUrl());
  Logger.log('回應試算表：' + ss.getUrl());
  Logger.log('設定文件：' + doc.getUrl());
}

// ---------- 即時統計 API ----------
function doGet(e) {
  const p = (e && e.parameter) || {};
  let out;
  try { out = stats_(p.s === '2' ? 2 : 1, p.since); }
  catch (err) { out = { ok: false, error: String(err) }; }
  const json = JSON.stringify(out);
  if (p.callback && /^[A-Za-z_$][\w$]*$/.test(p.callback)) {
    return ContentService.createTextOutput(p.callback + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function stats_(s, since) {
  const Q = s === 2 ? W2 : W1;
  const id = s === 2 ? PropertiesService.getScriptProperties().getProperty('SHEET_W2') : SHEET_W1;
  if (!id) return { ok: false, error: '第二堂表單尚未建立（請先執行 createWeek2Form）' };
  const sh = SpreadsheetApp.openById(id).getSheets().filter(x => x.getFormUrl())[0] || SpreadsheetApp.openById(id).getSheets()[0];
  const rows = sh.getDataRange().getValues();
  const head = rows.shift() || [];
  // 欄位：時間戳記、分數、Q1、Q2、Q3、理由（以表頭位置判斷，避免依賴語系）
  const col = { t: 0, q1: head.length - 4, q2: head.length - 3, q3: head.length - 2, r: head.length - 1 };
  const t0 = since ? new Date(since).getTime() : 0;

  const q1 = {}, q2 = {}, q3 = {}, score = [0, 0, 0, 0, 0];
  Q.q1.options.forEach(o => q1[o] = 0); Q.q2.options.forEach(o => q2[o] = 0); Q.q3.options.forEach(o => q3[o] = 0);
  let n = 0, last = null;
  rows.forEach(r => {
    if (!r[col.t]) return;
    if (String(r[col.r]).indexOf(TEST_MARK) >= 0) return;
    const t = new Date(r[col.t]).getTime();
    if (t < t0) return;
    n++; if (!last || t > last) last = t;
    const sel = String(r[col.q1]).split(', ').filter(Boolean);
    sel.forEach(o => { if (o in q1) q1[o]++; });
    const hit = sel.filter(o => Q.q1.correct.indexOf(o) >= 0).length;
    score[Math.max(0, Math.min(4, hit - (sel.length - hit)))]++;
    if (r[col.q2] in q2) q2[r[col.q2]]++;
    if (r[col.q3] in q3) q3[r[col.q3]]++;
  });
  return { ok: true, session: s, n: n, updated: last ? new Date(last).toISOString() : null,
           q1: q1, q1correct: Q.q1.correct, q1score: score, q2: q2, q2correct: Q.q2.correct, q3: q3 };
}
