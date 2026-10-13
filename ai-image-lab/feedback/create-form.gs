/**
 * AI 形象實驗室｜一鍵建立課後回饋 Google 表單（含圖片、計分、回應試算表）
 *
 * 使用方式（約 2 分鐘）：
 * 1. 打開 https://script.google.com → 新專案 → 把這整個檔案貼上
 * 2. 按「執行」createFeedbackForm，第一次會要求授權（表單、試算表、外部網址）→ 允許
 * 3. 看「執行紀錄」：複製 window.FEEDBACK_FORM = {...} 那一段，
 *    貼到網站 ai-image-lab/assets/feedback-config.js（或貼給 Claude）
 * 題目文字必須和網站 assets/feedback.js 完全一致，請兩邊一起改。
 */
const SITE = 'https://hitaiwan0705.github.io/ai-creative-lab/ai-image-lab/';

const Q1 = {
  title: '1. 右邊這張和左邊相比，被改了哪些地方？（可複選）',
  options: ['眼睛變大', '臉變小、下巴變尖', '皮膚變光滑', '膚色變白、變亮', '髮型改變', '衣服改變', '背景改變'],
  correct: ['眼睛變大', '臉變小、下巴變尖', '皮膚變光滑', '膚色變白、變亮']
};
const Q2 = {
  title: '2. AI 修圖時常把臉變小、眼睛變大、皮膚變白。最主要的原因是？',
  options: [
    '因為這樣就是美的標準答案，AI 只是照著做',
    'AI 從大量人類照片和修圖習慣中，學到某一種常見的審美，就往那個方向修',
    '這是電腦程式的隨機錯誤',
    '因為每個使用者都主動要求這樣修'
  ],
  correct: 'AI 從大量人類照片和修圖習慣中，學到某一種常見的審美，就往那個方向修'
};
const Q3 = {
  title: '3. 朋友說：「AI 修過的那張，才是比較好的我。」你同意嗎？',
  options: ['1 非常不同意', '2 不同意', '3 普通', '4 同意', '5 非常同意']
};

function createFeedbackForm() {
  const form = FormApp.create('AI 形象實驗室｜課後回饋（3 題）');
  form.setDescription('沒有對錯壓力，大約 1 分鐘。答案只用於改進課程。')
      .setIsQuiz(true)
      .setCollectEmail(false)
      .setLimitOneResponsePerUser(false)
      .setShowLinkToRespondAgain(false);

  // 圖片：左原圖、右重度美顏
  form.addImageItem().setTitle('左').setImage(UrlFetchApp.fetch(SITE + 'images/original.jpg').getBlob());
  form.addImageItem().setTitle('右').setImage(UrlFetchApp.fetch(SITE + 'images/beautified-heavy.jpg').getBlob());

  const i1 = form.addCheckboxItem().setTitle(Q1.title).setRequired(true);
  i1.setChoices(Q1.options.map(o => i1.createChoice(o, Q1.correct.indexOf(o) >= 0))).setPoints(1);

  const i2 = form.addMultipleChoiceItem().setTitle(Q2.title).setRequired(true);
  i2.setChoices(Q2.options.map(o => i2.createChoice(o, o === Q2.correct))).setPoints(1);

  const i3 = form.addMultipleChoiceItem().setTitle(Q3.title).setRequired(true);
  i3.setChoices(Q3.options.map(o => i3.createChoice(o)));
  const i3r = form.addTextItem().setTitle('可以多說一句為什麼（選填）');

  // 回應存到試算表
  const ss = SpreadsheetApp.create('AI 形象實驗室｜課後回饋（回應）');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // 用預填網址取出 entry ID，給網站直接送出
  const pre = form.createResponse()
    .withItemResponse(i1.createResponse([Q1.options[0]]))
    .withItemResponse(i2.createResponse(Q2.options[0]))
    .withItemResponse(i3.createResponse(Q3.options[0]))
    .withItemResponse(i3r.createResponse('x'))
    .toPrefilledUrl();
  const ids = (pre.match(/entry\.\d+/g) || []);
  const pub = form.getPublishedUrl();
  const cfg = {
    action: pub.replace(/\/viewform.*$/, '/formResponse'),
    url: pub,
    entries: { q1: ids[0], q2: ids[1], q3: ids[2], q3r: ids[3] }
  };
  Logger.log('表單編輯：' + form.getEditUrl());
  Logger.log('回應試算表：' + ss.getUrl());
  Logger.log('↓ 貼到 assets/feedback-config.js');
  Logger.log('window.FEEDBACK_FORM = ' + JSON.stringify(cfg, null, 2) + ';');
}
