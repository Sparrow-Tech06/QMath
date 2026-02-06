/* =================================================
   GAME ENHANCER (UNIVERSAL)
   Adds:
   1. Streak system (score-delta based)
   2. Time bonus
   3. Pause / Resume
   Works with all games without HTML changes
================================================= */

(function () {

  /* ===== WAIT FOR CORE GAME ===== */
  const waitForGame = setInterval(() => {
    if (
      typeof window.nextQuestion === 'function' &&
      typeof window.endGame === 'function'
    ) {
      clearInterval(waitForGame);
      initEnhancer();
    }
  }, 50);

  function initEnhancer() {

    /* ===== STATE ===== */
    let streak = 0;
    let maxStreak = Number(localStorage.getItem('maxStreak')) || 0;
    let paused = false;
    let lastScore = null;

    /* ===== TOP BAR ===== */
    const topBar = document.querySelector('.top');
    if (!topBar) return;

    /* ===== STREAK UI ===== */
    const streakBox = document.createElement('span');
    streakBox.innerHTML = `
      <i class="bi bi-lightning-charge-fill me-1"></i>
      <span id="streakCount">0</span>
    `;
    Object.assign(streakBox.style, {
      background: '#fde68a',
      color: '#000',
      padding: '6px 10px',
      borderRadius: '10px',
      fontSize: '12px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    });

    topBar.appendChild(streakBox);

    /* ===== PAUSE BUTTON ===== */
    const pauseBtn = document.createElement('span');
    pauseBtn.innerHTML = `<i class="bi bi-pause-circle"></i>`;
    Object.assign(pauseBtn.style, {
      cursor: 'pointer',
      padding: '6px 10px',
      fontSize: '18px'
    });

    topBar.appendChild(pauseBtn);

    /* ===== PAUSE / RESUME ===== */
    pauseBtn.onclick = () => {
      paused = !paused;

      if (paused) {
        clearInterval(window.timerRef);
        pauseBtn.innerHTML = `<i class="bi bi-play-circle"></i>`;
        lockOptions(true);
      } else {
        resumeTimer();
        pauseBtn.innerHTML = `<i class="bi bi-pause-circle"></i>`;
        lockOptions(false);
      }
    };

    function lockOptions(lock) {
      document.querySelectorAll('.opt').forEach(o => {
        o.style.pointerEvents = lock ? 'none' : '';
      });
    }

    function resumeTimer() {
      if (!window.timerOn) return;

      clearInterval(window.timerRef);
      window.timerRef = setInterval(() => {
        if (paused) return;
        window.time--;
        window.timerBox.innerText = `⏱ ${window.time}s`;
        if (window.time <= 0) window.endGame(false);
      }, 1000);
    }

    /* ===== OPTION CLICK HOOK (UNIVERSAL) ===== */
    document.addEventListener('click', e => {
      const opt = e.target.closest('.opt');
      if (!opt || paused) return;

      // snapshot score BEFORE core game logic
      lastScore = window.score;

      setTimeout(() => {
        const currentScore = window.score;
        const isCorrect = currentScore > lastScore;

        /* ===== TIME BONUS ===== */
        if (window.timerOn && isCorrect) {
          const bonus =
            window.time >= 20 ? 2 :
            window.time >= 10 ? 1 : 0;

          window.score += bonus;
        }

        /* ===== STREAK LOGIC ===== */
        if (isCorrect) {
          streak++;
          maxStreak = Math.max(maxStreak, streak);
          streakBox.style.background = '#bbf7d0';
        } else {
          streak = 0;
          streakBox.style.background = '#fecaca';
        }

        streakBox.querySelector('#streakCount').innerText = streak;
        localStorage.setItem('maxStreak', maxStreak);

      }, 40); // wait for core logic

    }, true);

    /* ===== END GAME WRAP ===== */
    const originalEndGame = window.endGame;
    window.endGame = function (manualSubmit) {
      localStorage.setItem('lastStreak', streak);
      streak = 0;
      originalEndGame(manualSubmit);
    };

  }

})();
