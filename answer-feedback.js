/* ======================================================
   UNIVERSAL ANSWER FEEDBACK ENGINE
   Works with + − × ÷ and score-based games
   ZERO HTML / GAME JS CHANGE REQUIRED
   ====================================================== */

(function () {

  const CORRECT  = 'opt-correct';
  const WRONG    = 'opt-wrong';
  const DISABLED = 'opt-disabled';

  function reset(container) {
    container.querySelectorAll('.opt').forEach(o => {
      o.classList.remove(CORRECT, WRONG, DISABLED);
    });
  }

  // 🔹 Try extracting correct answer from question text
  function getAnswerFromQuestion() {
    const q = document.getElementById('question');
    if (!q) return null;

    const text = q.innerText.trim();
    const m = text.match(/(\d+)\s*([+\-×÷])\s*(\d+)/);
    if (!m) return null;

    const a = +m[1], b = +m[3];
    switch (m[2]) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : null;
      default: return null;
    }
  }

  document.addEventListener('click', e => {

    const opt = e.target.closest('.opt');
    if (!opt) return;

    const box = opt.parentElement;
    if (!box || opt.classList.contains(DISABLED)) return;

    // lock UI
    box.querySelectorAll('.opt').forEach(o =>
      o.classList.add(DISABLED)
    );

    const picked = Number(opt.innerText);
    const expected = getAnswerFromQuestion();

    // 🔹 CASE 1: Math based game (+ − × ÷)
    if (expected !== null && !isNaN(picked)) {

      if (picked === expected) {
        opt.classList.add(CORRECT);
      } else {
        opt.classList.add(WRONG);
        box.querySelectorAll('.opt').forEach(o => {
          if (Number(o.innerText) === expected) {
            o.classList.add(CORRECT);
          }
        });
      }

      setTimeout(() => reset(box), 350);
      return;
    }

    // 🔹 CASE 2: Generic games (score-based)
    const before = window.score;

    setTimeout(() => {
      const after = window.score;

      if (after > before) {
        opt.classList.add(CORRECT);
      } else {
        opt.classList.add(WRONG);
      }

      setTimeout(() => reset(box), 350);
    }, 40);

  });

})();

