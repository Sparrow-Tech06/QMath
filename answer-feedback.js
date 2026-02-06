/* ======================================================
   ANSWER FEEDBACK MODULE
   Drop-in file for all math games
   ====================================================== */

(function () {

  const CLS_CORRECT  = 'opt-correct';
  const CLS_WRONG    = 'opt-wrong';
  const CLS_LOCKED   = 'opt-disabled';

  /**
   * Lock options & show feedback
   */
  function applyFeedback(box, selected, correct) {

    box.classList.add(CLS_LOCKED);

    box.querySelectorAll('.opt').forEach(opt => {
      opt.classList.add(CLS_LOCKED);

      const val = Number(opt.innerText);

      if (val === correct) {
        opt.classList.add(CLS_CORRECT);
      }

      if (val === selected && selected !== correct) {
        opt.classList.add(CLS_WRONG);
      }
    });
  }

  /**
   * Global click handler
   */
  document.addEventListener('click', function (e) {

    const opt = e.target.closest('.opt');
    if (!opt) return;

    const box = opt.parentElement;
    if (!box || box.classList.contains(CLS_LOCKED)) return;

    const correct  = Number(box.dataset.correct);
    const selected = Number(opt.innerText);

    if (Number.isNaN(correct)) return;

    applyFeedback(box, selected, correct);

  });

})();
