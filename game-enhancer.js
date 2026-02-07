/* =================================================
   GAME ENHANCER (NON-INTRUSIVE)
   Adds:
   1. Streak system
   2. Time bonus
   3. Pause / Resume
================================================= */

(function () {

  /* ===== SAFE WAIT ===== */
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
    let lastTime = time;

    /* ===== UI ===== */
    const streakBox = document.createElement('span');
    streakBox.style.background = '#ff9800';
    streakBox.style.padding = '6px 10px';
    streakBox.style.borderRadius = '10px';
    streakBox.style.fontSize = '12px';
    streakBox.style.color = '#000';
    streakBox.innerText = '🔥 0';

    document.querySelector('.top')?.appendChild(streakBox);

    /* ===== PAUSE BTN ===== */
    const pauseBtn = document.createElement('span');
    pauseBtn.innerHTML = '⏸';
    pauseBtn.style.cursor = 'pointer';
    pauseBtn.style.marginLeft = '8px';

    document.querySelector('.top')?.appendChild(pauseBtn);

    /* ===== PAUSE LOGIC ===== */
    pauseBtn.onclick = () => {
      paused = !paused;

      if (paused) {
        clearInterval(timerRef);
        pauseBtn.innerHTML = '▶';
        document.querySelectorAll('.opt').forEach(o => o.style.pointerEvents = 'none');
      } else {
        resumeTimer();
        pauseBtn.innerHTML = '⏸';
        document.querySelectorAll('.opt').forEach(o => o.style.pointerEvents = '');
      }
    };

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

      const value = parseInt(opt.innerText);
      const correctAnswer = eval(question.innerText.replace('= ?', ''));

      /* ===== TIME BONUS ===== */
      let bonus = 0;
      if (timerOn) {
        bonus = time >= 20 ? 2 : time >= 10 ? 1 : 0;
        score += bonus;
      }

      /* ===== STREAK ===== */
      if (value === correctAnswer) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
        streakBox.innerText = `🔥 ${streak}`;
        streakBox.style.background = '#22c55e';
      } else {
        streak = 0;
        streakBox.innerText = `🔥 0`;
        streakBox.style.background = '#ef4444';
      }

      /* ===== SAVE ANALYTICS ===== */
      localStorage.setItem('maxStreak', maxStreak);
    }, true);

    /* ===== RESET STREAK ON GAME END ===== */
    const originalEnd = endGame;
    window.endGame = function (manual) {
      localStorage.setItem('lastStreak', streak);
      streak = 0;
      originalEnd(manual);
    };
  }

})();
