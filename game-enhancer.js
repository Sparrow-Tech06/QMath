/* =================================================
   GAME ENHANCER (STABLE & UNIVERSAL)
   - Pause / Resume (no duplicate timers)
   - Streak system (question-based, not click-based)
   - Time bonus
================================================= */

(function () {

  const wait = setInterval(() => {
    if (
      typeof window.nextQuestion === 'function' &&
      typeof window.endGame === 'function'
    ) {
      clearInterval(wait);
      init();
    }
  }, 50);

  function init() {

    let streak = 0;
    let maxStreak = Number(localStorage.getItem('maxStreak')) || 0;
    let paused = false;
    let lastScore = window.score;

    /* ===== UI ===== */
    const topBar = document.querySelector('.top');
    if (!topBar) return;

    const streakBox = document.createElement('span');
    streakBox.innerHTML = `
      <i class="bi bi-lightning-charge-fill me-1"></i>
      <span id="streakCount">0</span>
    `;
    Object.assign(streakBox.style, {
      background: '#fde68a',
      padding: '6px 10px',
      borderRadius: '10px',
      fontSize: '12px'
    });

    const pauseBtn = document.createElement('span');
    pauseBtn.innerHTML = `<i class="bi bi-pause-circle"></i>`;
    pauseBtn.style.cursor = 'pointer';
    pauseBtn.style.padding = '6px 10px';

    topBar.append(streakBox, pauseBtn);

    /* ===== PAUSE / RESUME ===== */
    pauseBtn.onclick = () => {
      paused = !paused;

      if (paused) {
        clearInterval(window.timerRef);
        pauseBtn.innerHTML = `<i class="bi bi-play-circle"></i>`;
        toggleOptions(true);
      } else {
        pauseBtn.innerHTML = `<i class="bi bi-pause-circle"></i>`;
        restartTimer();
        toggleOptions(false);
      }
    };

    function toggleOptions(lock) {
      document.querySelectorAll('.opt').forEach(o => {
        o.style.pointerEvents = lock ? 'none' : '';
      });
    }

    function restartTimer() {
      if (!window.timerOn) return;
      clearInterval(window.timerRef);

      window.timerRef = setInterval(() => {
        if (paused) return;
        window.time--;
        window.timerBox.innerText = `⏱ ${window.time}s`;
        if (window.time <= 0) window.endGame(false);
      }, 1000);
    }

    /* ===== OBSERVE QUESTION CHANGE ===== */
    const originalNext = window.nextQuestion;
    window.nextQuestion = function () {

      const before = window.score;

      originalNext();

      setTimeout(() => {
        const after = window.score;

        if (after > before) {
          streak++;
          maxStreak = Math.max(maxStreak, streak);
          streakBox.style.background = '#bbf7d0';

          /* Time bonus */
          if (window.timerOn) {
            const bonus =
              window.time >= 20 ? 2 :
              window.time >= 10 ? 1 : 0;
            window.score += bonus;
          }

        } else {
          streak = 0;
          streakBox.style.background = '#fecaca';
        }

        streakBox.querySelector('#streakCount').innerText = streak;
        localStorage.setItem('maxStreak', maxStreak);

      }, 0);
    };

    /* ===== END GAME WRAP ===== */
    const originalEnd = window.endGame;
    window.endGame = function (manual) {
      localStorage.setItem('lastStreak', streak);
      streak = 0;
      originalEnd(manual);
    };

  }

})();

