/* =========================================
   Answer Feedback Layer (No Core Change)
   ========================================= */

(function () {

  // inject minimal CSS (auto)
  const style = document.createElement('style');
  style.innerHTML = `
    .opt.correct {
      background: #d1fae5 !important;
      border-color: #10b981 !important;
      color: #065f46;
      pointer-events: none;
    }
    .opt.wrong {
      background: #fee2e2 !important;
      border-color: #ef4444 !important;
      color: #7f1d1d;
      pointer-events: none;
    }
    .opt.disabled {
      pointer-events: none;
      opacity: .8;
    }
  `;
  document.head.appendChild(style);

  // capture clicks globally
  document.addEventListener('click', function (e) {
    const opt = e.target.closest('.opt');
    if (!opt) return;

    // prevent double tap
    if (opt.classList.contains('disabled')) return;

    const selectedValue = Number(opt.innerText.trim());

    // ⚠️ relies on global `answer` variable
    if (typeof window.answer === 'undefined') return;

    const all = opt.parentElement.querySelectorAll('.opt');
    all.forEach(o => o.classList.add('disabled'));

    if (selectedValue === window.answer) {
      opt.classList.add('correct');
    } else {
      opt.classList.add('wrong');
      // also highlight correct one
      all.forEach(o => {
        if (Number(o.innerText.trim()) === window.answer) {
          o.classList.add('correct');
        }
      });
    }

  }, true);

})();
