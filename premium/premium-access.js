(function(){

  const PRICE = 1000;
  const DURATION = 24 * 60 * 60 * 1000;
  const KEY = "premium_sprint_unlock_till";

  const lock = document.getElementById("premiumLock");
  const btn = document.getElementById("unlockBtn");

  function coins(){ return parseInt(localStorage.getItem("myCoins") || "0"); }
  function setCoins(v){ localStorage.setItem("myCoins", v); }

  function addHistory(amount, source){
    const h = JSON.parse(localStorage.getItem("coinHistory")) || [];
    h.push({ amount, source, date:new Date().toLocaleString() });
    localStorage.setItem("coinHistory", JSON.stringify(h));
  }

  function unlocked(){
    return Date.now() < parseInt(localStorage.getItem(KEY) || "0");
  }

  function lockGame(){
    lock.classList.remove("d-none");
    document.body.style.overflow="hidden";
  }

  function unlockGame(){
    lock.classList.add("d-none");
    document.body.style.overflow="";
  }

  unlocked() ? unlockGame() : lockGame();

  btn.onclick = ()=>{
    if(coins() < PRICE){ alert("Not enough coins"); return; }
    if(!confirm("Unlock Sprint Quiz for 24 hours using 1000 coins?")) return;

    setCoins(coins() - PRICE);
    addHistory(-PRICE, "Sprint Quiz (24h Premium)");
    localStorage.setItem(KEY, Date.now()+DURATION);
    unlockGame();
  };

})();
