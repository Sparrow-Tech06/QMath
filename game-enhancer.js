/* =================================================
   GAME ENHANCER (BOOTSTRAP ICONS)
   Adds:
   1. Streak system
   2. Time bonus
   3. Pause / Resume
================================================= */

(function () {

  /* ===== WAIT FOR CORE GAME ===== */
  const waitForGame = setInterval(() => {
    if (typeof nextQuestion === 'function' && typeof endGame === 'function') {
      clearInterval(waitForGame);
      initEnhancer();
    }
  }, 50);

  function initEnhancer() {

    /* ===== STATE ===== */
    let streak = 0;
    let maxStreak = 0;
    let paused = false;

    /* ===== TOP BAR ===== */
    const topBar = document.querySelector('.top');

    /* ===== STREAK UI ===== */
    const streakBox = document.createElement('span');
    streakBox.innerHTML = `
      <i class="bi bi-lightning-charge-fill me-1"></i>
      <span id="streakCount">0</span>
    `;
    streakBox.style.background = '#fde68a';
    streakBox.style.color = '#000';
    streakBox.style.padding = '6px 10px';
    streakBox.style.borderRadius = '10px';
    streakBox.style.fontSize = '12px';

    topBar?.appendChild(streakBox);

    /* ===== PAUSE BUTTON ===== */
    const pauseBtn = document.createElement('span');
    pauseBtn.innerHTML = `<i class="bi bi-pause-circle"></i>`;
    pauseBtn.style.cursor = 'pointer';
    pauseBtn.style.padding = '6px 10px';

    topBar?.appendChild(pauseBtn);

    /* ===== PAUSE / RESUME LOGIC ===== */
    pauseBtn.onclick = () => {
      paused = !paused;

      if (paused) {
        clearInterval(timerRef);
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
      if (!timerOn) return;
      timerRef = setInterval(() => {
        if (paused) return;
        time--;
        timerBox.innerText = `⏱ ${time}s`;
        if (time <= 0) endGame(false);
      }, 1000);
    }

    /* ===== OPTION CLICK HOOK ===== */
    document.addEventListener('click', e => {
      const opt = e.target.closest('.opt');
      if (!opt || paused) return;

      const chosen = parseInt(opt.innerText);
      const correct = eval(question.innerText.replace('= ?', ''));

      /* ===== TIME BONUS ===== */
      if (timerOn) {
        const bonus = time >= 20 ? 2 : time >= 10 ? 1 : 0;
        score += bonus;
      }

      /* ===== STREAK LOGIC ===== */
      if (chosen === correct) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
        streakBox.style.background = '#bbf7d0';
      } else {
        streak = 0;
        streakBox.style.background = '#fecaca';
      }

      streakBox.querySelector('#streakCount').innerText = streak;
      localStorage.setItem('maxStreak', maxStreak);

    }, true);

    /* ===== END GAME WRAP ===== */
    const originalEndGame = endGame;
    window.endGame = function (manualSubmit) {
      localStorage.setItem('lastStreak', streak);
      streak = 0;
      originalEndGame(manualSubmit);
    };
  }

})();
