/* =====================================================
   PREMIUM ACCESS – UNIVERSAL
===================================================== */

(function(){

  const GAME_KEY = 'premium_sprint';
  const PRICE = 10;
  const HOURS = 24;

  const lock = document.getElementById('premiumLock');
  const btn  = document.getElementById('unlockBtn');

  const coins = Number(localStorage.getItem('coins') || 0);
  const data  = JSON.parse(localStorage.getItem(GAME_KEY) || '{}');

  const now = Date.now();

  // ✅ Already unlocked
  if(data.expire && data.expire > now){
    window.onPremiumGranted();
    return;
  }

  // 🔒 Lock game
  lock.classList.remove('d-none');

  btn.onclick = ()=>{
    if(coins < PRICE){
      alert('Not enough coins');
      return;
    }

    // Deduct coins
    localStorage.setItem('coins', coins - PRICE);

    // Save unlock
    localStorage.setItem(GAME_KEY, JSON.stringify({
      expire: now + HOURS*60*60*1000
    }));

    // History (coin.html tabs)
    const log = JSON.parse(localStorage.getItem('coinHistory')||'[]');
    log.push({
      type:'deduct',
      title:'Sprint Quiz Unlock',
      amount:PRICE,
      time:now
    });
    localStorage.setItem('coinHistory',JSON.stringify(log));

    window.onPremiumGranted();
  };

})();
