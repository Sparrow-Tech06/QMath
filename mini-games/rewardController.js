// rewardController.js

const MAX_DAILY = 10;
const COOLDOWN = 300; // 5 min in seconds

let watching = false;

// Load saved data
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

// Format time
function formatTime(sec){
  let m = Math.floor(sec/60);
  let s = sec % 60;
  return `${m}:${s.toString().padStart(2,'0')}`;
}

// MAIN INIT
function initRewardButton(btnId){

  const btn = document.getElementById(btnId);
  if(!btn) return;

  function updateUI(){
    const today = getTodayData();
    const now = Date.now();

    let remainCooldown = Math.floor((today.lastTime + COOLDOWN*1000 - now)/1000);

    // daily limit
    if(today.count >= MAX_DAILY){
      btn.innerText = `Limit reached (10/10)`;
      btn.disabled = true;
      return;
    }

    // cooldown
    if(remainCooldown > 0){
      btn.disabled = true;
      btn.innerText = `Wait ${formatTime(remainCooldown)} (${today.count}/10)`;
      setTimeout(updateUI,1000);
      return;
    }

    btn.disabled = false;
    btn.innerText = `Get 50 Points (Ad ${today.count}/10)`;
  }

  // click
  btn.addEventListener("click", ()=>{
    if(watching) return;

    const today = getTodayData();

    if(today.count >= MAX_DAILY) return;

    const now = Date.now();
    if(now < today.lastTime + COOLDOWN*1000) return;

    watching = true;

    // 👉 CALL ANDROID AD
    if(window.Android && typeof Android.showRewardAd === "function"){
      Android.showRewardAd();
    } else {
      alert("Android Ad not available");
      watching = false;
    }
  });

  // CALLBACK from Android
  window.onAdRewardSuccess = function(){

    const today = getTodayData();

    today.count += 1;
    today.lastTime = Date.now();

    updateTodayData(today);

    // 👉 CALL YOUR EXISTING FUNCTION
    if(typeof getCoin === "function"){
      getCoin(50, "Reward Ad");
    }

    watching = false;
    updateUI();
  };

  // optional fail callback
  window.onAdRewardFail = function(){
    watching = false;
    updateUI();
  };

  updateUI();
}
