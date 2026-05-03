// rewardController.js

const MAX_DAILY = 10;
const COOLDOWN = 300; // 5 min (seconds)

let watching = false;

/* ---------- STORAGE ---------- */
function getTodayKey(){
  return new Date().toISOString().split('T')[0];
}

function getData(){
  return JSON.parse(localStorage.getItem("rewardData")) || {};
}

function saveData(data){
  localStorage.setItem("rewardData", JSON.stringify(data));
}

function getTodayData(){
  const data = getData();
  const today = getTodayKey();

  if(!data[today]){
    data[today] = { count:0, lastTime:0 };
    saveData(data);
  }
  return data[today];
}

function updateTodayData(newData){
  const data = getData();
  data[getTodayKey()] = newData;
  saveData(data);
}

/* ---------- UI HELPERS ---------- */
function formatTime(sec){
  let m = Math.floor(sec/60);
  let s = sec % 60;
  return `${m}:${s.toString().padStart(2,'0')}`;
}

/* ---------- WEB DEMO AD ---------- */
function showWebAd(){

  // create modal
  const modal = document.createElement("div");
  modal.style = `
    position:fixed; inset:0; background:rgba(0,0,0,.6);
    display:flex; align-items:center; justify-content:center;
    z-index:9999;
  `;

  const box = document.createElement("div");
  box.style = `
    background:#fff; padding:20px; border-radius:12px;
    width:260px; text-align:center;
  `;

  let time = 5;

  box.innerHTML = `
    <h6>Demo Ad</h6>
    <p>Ad ends in <b id="adTimer">${time}</b>s</p>
    <button id="skipAd" class="btn btn-sm btn-danger mt-2">Skip</button>
  `;

  modal.appendChild(box);
  document.body.appendChild(modal);

  const timerEl = box.querySelector("#adTimer");
  const skipBtn = box.querySelector("#skipAd");

  const interval = setInterval(()=>{
    time--;
    timerEl.innerText = time;

    if(time <= 0){
      clearInterval(interval);
      document.body.removeChild(modal);
      window.onAdRewardSuccess(); // simulate success
    }
  },1000);

  skipBtn.onclick = ()=>{
    clearInterval(interval);
    document.body.removeChild(modal);
    window.onAdRewardFail();
  };
}

/* ---------- MAIN INIT ---------- */
function initRewardButton(btnId){

  const btn = document.getElementById(btnId);
  if(!btn) return;

  function updateUI(){
    const today = getTodayData();
    const now = Date.now();

    let remain = Math.floor((today.lastTime + COOLDOWN*1000 - now)/1000);

    if(today.count >= MAX_DAILY){
      btn.innerText = `Limit reached (10/10)`;
      btn.disabled = true;
      return;
    }

    if(remain > 0){
      btn.disabled = true;
      btn.innerText = `Wait ${formatTime(remain)} (${today.count}/10)`;
      setTimeout(updateUI,1000);
      return;
    }

    btn.disabled = false;
    btn.innerText = `Get 50 Points (Ad ${today.count}/10)`;
  }

  btn.addEventListener("click", ()=>{
    if(watching) return;

    const today = getTodayData();
    const now = Date.now();

    if(today.count >= MAX_DAILY) return;
    if(now < today.lastTime + COOLDOWN*1000) return;

    watching = true;

    // ✅ Android
    if(window.Android && typeof Android.showRewardAd === "function"){
      Android.showRewardAd();
    } 
    // ✅ Web fallback
    else {
      showWebAd();
    }
  });

  /* ---------- CALLBACKS ---------- */

  window.onAdRewardSuccess = function(){

    const today = getTodayData();

    today.count += 1;
    today.lastTime = Date.now();

    updateTodayData(today);

    // your existing function
    if(typeof getCoin === "function"){
      getCoin(50, "Reward Ad");
    }

    watching = false;
    updateUI();
  };

  window.onAdRewardFail = function(){
    watching = false;
    updateUI();
  };

  updateUI();
}
