/* ======================================================
   Answer Feedback Module
   Works without modifying game logic
   ====================================================== */

(function () {

  const CORRECT_CLASS = 'opt-correct';
  const WRONG_CLASS   = 'opt-wrong';
  const DISABLED_CLASS = 'opt-disabled';

  // 🔹 Utility: clear old colors
  function resetOptions(container) {
    container.querySelectorAll('.opt').forEach(opt => {
      opt.classList.remove(CORRECT_CLASS, WRONG_CLASS, DISABLED_CLASS);
    });
  }

  // 🔹 Detect correct answer from question text
  function getCorrectAnswer() {
    const q = document.getElementById('question');
    if (!q) return null;

    const text = q.innerText;

    // Supports + − × ÷
    const match = text.match(/(\d+)\s*([+\-×÷])\s*(\d+)/);
    if (!match) return null;

    const a = Number(match[1]);
    const op = match[2];
    const b = Number(match[3]);

    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return a / b;
      default: return null;
    }
  }

  // 🔹 Event Delegation
  document.addEventListener('click', function (e) {
    const opt = e.target.closest('.opt');
    if (!opt) return;

    const optionsBox = opt.parentElement;
    if (!optionsBox) return;

    // prevent double click
    if (opt.classList.contains(DISABLED_CLASS)) return;

    const selected = Number(opt.innerText);
    const correct = getCorrectAnswer();

    if (correct === null) return;

    // lock all options
    optionsBox.querySelectorAll('.opt').forEach(o =>
      o.classList.add(DISABLED_CLASS)
    );

    if (selected === correct) {
      opt.classList.add(CORRECT_CLASS);
    } else {
      opt.classList.add(WRONG_CLASS);

      // highlight correct one
      optionsBox.querySelectorAll('.opt').forEach(o => {
        if (Number(o.innerText) === correct) {
          o.classList.add(CORRECT_CLASS);
        }
      });
    }

    // auto clear on next render
    setTimeout(() => resetOptions(optionsBox), 300);
  });

})();
