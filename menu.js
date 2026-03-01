document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(location.search);
  const gameKey = params.get("game") || "default";
  const title   = params.get("title") || "Game";
  const subtitle= params.get("subtitle") || "";

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

  /* SETTINGS LOAD */
  const mTimer = document.getElementById("mTimer");
  const mSound = document.getElementById("mSound");

  const prevTimer = localStorage.getItem('timerOn');
  const prevSound = localStorage.getItem('soundOn');

  if(prevTimer !== null) mTimer.checked = prevTimer === '1';
  if(prevSound !== null) mSound.checked = prevSound === '1';

  /* MENU MUSIC */
  let clickSound = null;

  const initSound = () => {
    if(clickSound){ clickSound.stop(); clickSound=null; }

    if(mSound.checked){
      clickSound = new Howl({
        src:[`../assets/sound/${gameKey}.mp3`],
        loop:true,
        volume:1
      });
      clickSound.play();
    }
  };

  initSound();
  mSound.addEventListener("change", initSound);

  document.getElementById("backHome").onclick =
    ()=> window.history.back();

  /* =========================
     START GAME BUTTON
  ========================= */
  document.getElementById("mStart").onclick = ()=>{

    localStorage.setItem('timerOn', mTimer.checked?'1':'0');
    localStorage.setItem('soundOn', mSound.checked?'1':'0');

    document.getElementById("menuOverlay").remove();

    if(clickSound) clickSound.stop();

    // 🔥 START GAME AFTER MENU CLOSE
    if(typeof startGame === "function"){
      startGame();
    }
  };

});
