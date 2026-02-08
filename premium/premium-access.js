/* ===================================================
   PREMIUM ACCESS SYSTEM (FIXED & SAFE)
   =================================================== */

(function(){

  const GAME_KEY = 'sprint';          // unique per game
  const PRICE = 50;                  // 🔥 50 coins
  const DURATION = 24 * 60 * 60 * 1000; // 24 hours

  const lock = document.getElementById('premiumLock');
  const unlockBtn = document.getElementById('unlockBtn');

  if(!lock || !unlockBtn) return;

  /* ---------- HELPERS ---------- */

  function getCoins(){
    return Number(localStorage.getItem('myCoins') || 0);
  }

  function setCoins(val){
    localStorage.setItem('myCoins', String(val));
  }

  function getAccessKey(){
    return `premium_${GAME_KEY}`;
  }

  function hasAccess(){
    const exp = Number(localStorage.getItem(getAccessKey()));
    return exp && Date.now() < exp;
  }

  function stopGame(){
    // ⛔ HARD STOP game execution
    window.gameEnded = true;
    clearInterval(window.timerRef);
  }

  /* ---------- INIT ---------- */

  if(hasAccess()){
    lock.classList.add('d-none');
    return;
  }

  // 🔒 Lock game completely
  lock.classList.remove('d-none');
  stopGame();

  /* ---------- UNLOCK ---------- */

  unlockBtn.onclick = function(){

    const coins = getCoins();

    console.log('MY COINS =', coins); // 🧪 debug

    if(coins < PRICE){
      alert(`Not enough coins!\nYou need ${PRICE} coins.`);
      return;
    }

    // deduct coins
    const updated = coins - PRICE;
    setCoins(updated);

    // save access
    localStorage.setItem(
      getAccessKey(),
      String(Date.now() + DURATION)
    );

    // save history (DEDUCTION)
    const history = JSON.parse(localStorage.getItem('coinHistory')) || [];
    history.push({
      amount: PRICE,
      type: 'deduct',
      source: 'Sprint Quiz – Premium Unlock',
      date: new Date().toLocaleString()
    });
    localStorage.setItem('coinHistory', JSON.stringify(history));

    // unlock UI
    lock.classList.add('d-none');

    // reload game cleanly
    location.reload();
  };

})();

