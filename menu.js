document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(location.search);
  const gameKey  = params.get("game") || "default";
  const title    = params.get("title") || "Game";
  const subtitle = params.get("subtitle") || "";

  /* ================= HTML ================= */
  const html = `
  <div id="menuOverlay">
    <div class="menuContent">

      <div class="menuHeader">
        <button id="backHome">
          <i class="bi bi-box-arrow-right"></i> Exit
        </button>
        <a href="../how-to-play.html">How to Play</a>
      </div>

      <div class="menuBody">
        <h1>${title}</h1>
        <p>${subtitle}</p>

        <div class="optn">
          <span>⏱ Enable Timer</span>
          <input type="checkbox" id="mTimer" checked>
        </div>

        <div class="optn">
          <span>🔊 Sound</span>
          <input type="checkbox" id="mSound" checked>
        </div>

        <button id="mStart">Start Game</button>
      </div>

    </div>
  </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  /* ================= CSS ================= */
  const css = document.createElement("style");
  css.innerHTML = `
  #menuOverlay{
    position:fixed;
    inset:0;
    background:#fff;
    z-index:9999;
    padding:16px;
    animation:fade .2s ease;
  }

  .menuContent{
    height:100vh;
    display:flex;
    flex-direction:column;
  }

  .menuHeader{
    display:flex;
    justify-content:space-between;
    margin-bottom:24px;
  }

  .menuHeader button,
  .menuHeader a{
    background:var(--card);
    border:1px solid var(--border);
    border-radius:12px;
    padding:6px 10px;
    color:#4f46e5;
    text-decoration:none;
    font-weight:600;
    cursor:pointer;
  }

  .menuBody{
    flex:1;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    gap:16px;
  }

  .optn{
    display:flex;
    justify-content:space-between;
    width:80%;
    max-width:320px;
    border:1px solid #e6e8ef;
    padding:12px 16px;
    border-radius:14px;
  }

  #mStart{
    width:80%;
    max-width:320px;
    padding:14px;
    background:#4f46e5;
    color:#fff;
    border:none;
    border-radius:14px;
    font-size:18px;
    font-weight:600;
    cursor:pointer;
  }

  @keyframes fade{
    from{opacity:.6;transform:translateY(10px)}
    to{opacity:1}
  }
  `;
  document.head.appendChild(css);

  /* ================= SETTINGS ================= */
  const mTimer = document.getElementById("mTimer");
  const mSound = document.getElementById("mSound");

  const prevTimer = localStorage.getItem("timerOn");
  const prevSound = localStorage.getItem("soundOn");

  if(prevTimer!==null) mTimer.checked = prevTimer==='1';
  if(prevSound!==null) mSound.checked = prevSound==='1';

  /* ================= MENU SOUND ================= */
  let clickSound=null;

  const initSound=()=>{
    if(clickSound){clickSound.stop();clickSound=null;}

    if(mSound.checked){
      clickSound=new Howl({
        src:[`../assets/sound/${gameKey}.mp3`],
        loop:true,
        volume:1
      });
      clickSound.play();
    }
  };

  initSound();
  mSound.addEventListener("change",initSound);

  /* ================= EXIT ================= */
  document.getElementById("backHome").onclick=()=>{
    if(clickSound) clickSound.stop();
    history.back();
  };

  /* ================= START GAME ================= */
  document.getElementById("mStart").onclick=()=>{

    localStorage.setItem('timerOn',mTimer.checked?'1':'0');
    localStorage.setItem('soundOn',mSound.checked?'1':'0');

    document.getElementById("menuOverlay").remove();

    if(clickSound) clickSound.stop();

    // 🔥 START GAME EVENT
    document.dispatchEvent(new Event("game:start"));
  };

});
