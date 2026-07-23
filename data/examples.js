/*
 * 範例角色卡、範例三幕劇、範例分鏡，以及肖像權與著作權判斷題資料。
 */
(function (global) {
  "use strict";
  var AICL = global.AICL || {};
  AICL.DATA = AICL.DATA || {};

  AICL.DATA.exampleCharacter = {
    name: "林霧",
    identity: "17 歲的街頭攝影師，白天在夜市幫忙顧攤",
    appearance: "短髮、深藍色防水外套、隨身背相機包、右手有一枚舊懷錶",
    ability: "能透過相機看到物品殘留的記憶片段",
    weakness: "太專注拍照時會忽略身邊的危險，也害怕自己的能力被別人利用"
  };

  AICL.DATA.exampleOneLineStory = {
    protagonist: "街頭攝影師林霧",
    goal: "找到能證明自己攝影天賦的機會",
    obstacle: "拍到的照片洩漏了不該曝光的記憶，讓他被神秘組織盯上",
    change: "選擇公開這段記憶，從邊緣攝影師變成被信任的記錄者"
  };

  AICL.DATA.exampleThreeAct = {
    act1: "林霧每天在夜市顧攤、幫人拍照維生，他想找到能證明自己攝影天賦的機會。",
    act2: "他無意間拍到一張照片，裡面藏著一段被遺忘的城市記憶，卻也因此被神秘組織盯上。",
    act3: "他選擇公開這段記憶而不是藏起來獨享，最終從邊緣的街頭攝影師變成被大家信任的記錄者。"
  };

  AICL.DATA.exampleStoryboard = [
    {
      event: "林霧在夜市巷口舉起相機，準備拍下今天最後一張照片",
      action: "半蹲舉起相機，專注地對焦",
      expression: "專注、平靜",
      shot: "全景",
      scene: "夜市巷口，暖黃色燈籠光"
    },
    {
      event: "快門按下的瞬間，相機螢幕浮現出一段陌生的記憶畫面",
      action: "手指按下快門後突然愣住",
      expression: "驚訝、瞳孔放大",
      shot: "特寫",
      scene: "相機螢幕的冷光打在臉上，背景略暗"
    },
    {
      event: "林霧決定將這段記憶分享給大家，而不是隱藏起來",
      action: "轉身舉起相機面向人群，微微一笑",
      expression: "堅定、釋然",
      shot: "中景",
      scene: "夜市燈光重新亮起，人群圍繞"
    }
  ];

  AICL.DATA.rightsQuiz = [
    {
      question: "同學同意你拍照，就可以直接上傳 AI 嗎？",
      options: [
        { label: "可以", correct: false },
        { label: "不可以", correct: false },
        { label: "需要再確認", correct: true }
      ],
      explain:
        "拍攝同意不等於同意將照片上傳給 AI 工具處理。上傳前務必再次詢問對方是否同意用於 AI 生成，並說明用途。"
    },
    {
      question: "校長照片在學校網站上，就可以拿來生成動畫嗎？",
      options: [
        { label: "可以", correct: false },
        { label: "不可以", correct: false },
        { label: "需要再確認", correct: true }
      ],
      explain:
        "公開照片不等於自由使用。即使照片公開於網站上，仍需確認使用目的與範圍是否經過當事人或學校同意。"
    },
    {
      question: "網路下載的明星照片，可以做成自己的角色卡嗎？",
      options: [
        { label: "可以", correct: false },
        { label: "不可以", correct: true },
        { label: "需要再確認", correct: false }
      ],
      explain:
        "未經授權使用他人肖像（尤其是公眾人物）製作角色卡，可能同時侵害肖像權與著作權，課堂活動也不例外。"
    },
    {
      question: "不想露臉，可以拍物品或背影完成活動嗎？",
      options: [
        { label: "可以", correct: true },
        { label: "不可以", correct: false },
        { label: "需要再確認", correct: false }
      ],
      explain:
        "完全可以。活動設計上不要求一定要露臉，使用物品、背影或原創繪製的角色都能完成本次任務。"
    },
    {
      question: "AI 生成的角色，可以直接當商業品牌使用嗎？",
      options: [
        { label: "可以", correct: false },
        { label: "不可以", correct: false },
        { label: "需要再確認", correct: true }
      ],
      explain:
        "AI 生成不代表自動取得所有著作權與使用權。課堂練習屬於教學用途，若要商業使用，需另外確認平台服務條款與相關權利歸屬。"
    }
  ];

  global.AICL = AICL;
})(window);
