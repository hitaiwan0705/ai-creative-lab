/* 回饋問卷收集設定
   null = 本機練習模式（學生看得到回饋，但答案不會被收集）
   執行 feedback/create-form.gs 後，把它印出的設定貼在這裡，例如：
   window.FEEDBACK_FORM = {
     action: "https://docs.google.com/forms/d/e/XXXX/formResponse",
     url: "https://docs.google.com/forms/d/e/XXXX/viewform",
     entries: { q1: "entry.111", q2: "entry.222", q3: "entry.333", q3r: "entry.444" }
   };
*/
window.FEEDBACK_FORM = null;
