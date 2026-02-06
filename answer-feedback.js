/* ======================================================
   ANSWER FEEDBACK (STABLE & UNIVERSAL)
   - Visual feedback only
   - Does NOT judge answers
   - Syncs safely with core game & enhancer
   ====================================================== */

(function () {

  const CORRECT = 'opt-correct';
  const WRONG = 'opt-wrong';
  const DISABLED = 'opt-disabled';

  let lastScore = null;
  let activeOptionsBox = null;

  function clear(box) {
    if (!box) return;
    box.querySelectorAll('.opt').forEach(o => {
      o.classList.remove(CORRECT, WRONG, DISABLED);
    });
  }

  /* ===== CAPTURE CLICK (BEFORE GAME LOGIC) ===== */
  document.addEventListener('click', function (e) {

    const opt = e.target.closest('.opt');
    if (!opt) return;

    const box = opt.parentElement;
    if (!box) return;

    // already processed
    if (box.classList.contains('af-locked')) return;

    box.classList.add('af-locked');
    activeOptionsBox = box;

    // snapshot score BEFORE core game handles click
    lastScore = window.score;

    // lock UI visually (core game may also lock, no conflict)
    box.querySelectorAll('.opt').forEach(o =>
      o.classList.add(DISABLED)
    );

    /* ===== AFTER CORE GAME DECISION ===== */
    setTimeout(() => {
      const now = window.score;
      const isCorrect = now > lastScore;

      if (isCorrect) {
        opt.classList.add(CORRECT);
      } else {
        opt.classList.add(WRONG);
      }

    }, 0);

  }, true);

  /* ===== CLEAR FEEDBACK ON NEXT QUESTION ===== */
  const wait = setInterval(() => {
    if (typeof window.nextQuestion === 'function') {
      clearInterval(wait);

      const originalNext = window.nextQuestion;
      window.nextQuestion = function () {

        // clear old feedback safely
        clear(activeOptionsBox);
        if (activeOptionsBox) {
          activeOptionsBox.classList.remove('af-locked');
        }

        activeOptionsBox = null;
        originalNext();
      };
    }
  }, 50);

})();

        
