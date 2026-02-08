<script>
(function(){

  const GAME_KEY = 'sprint';
  const PRICE = 50;
  const DURATION = 24*60*60*1000;

  const lock = document.getElementById('premiumLock');
  const btn  = document.getElementById('unlockBtn');

  if(!lock || !btn) return;

  const accessKey = `premium_${GAME_KEY}`;

  function coins(){ return Number(localStorage.getItem('myCoins')||0); }
  function setCoins(v){ localStorage.setItem('myCoins',v); }

  function hasAccess(){
    const exp = Number(localStorage.getItem(accessKey));
    return exp && Date.now()<exp;
  }

  if(hasAccess()){
    lock.classList.add('d-none');
    return;
  }

  lock.classList.remove('d-none');

  btn.onclick = ()=>{
    const c = coins();
    if(c < PRICE){
      showToast('Not enough coins ❌','danger');
      return;
    }

    setCoins(c-PRICE);

    localStorage.setItem(accessKey, Date.now()+DURATION);

    const history = JSON.parse(localStorage.getItem('coinHistory')||'[]');
    history.push({
      amount: PRICE,
      type:'deduct',
      source:'Sprint Quiz – Premium',
      date:new Date().toLocaleString()
    });
    localStorage.setItem('coinHistory',JSON.stringify(history));

    showToast('Premium unlocked 🎉','success');
    setTimeout(()=>location.reload(),800);
  };

  function showToast(msg,type){
    const t=document.createElement('div');
    t.className=`toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3 show`;
    t.innerHTML=`<div class="d-flex">
      <div class="toast-body">${msg}</div>
      <button class="btn-close btn-close-white me-2 m-auto" onclick="this.closest('.toast').remove()"></button>
    </div>`;
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),3000);
  }

})();
</script>
