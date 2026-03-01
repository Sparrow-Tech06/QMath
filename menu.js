document.addEventListener("DOMContentLoaded", () => {

  /* ================= PARAMS ================= */
  const params = new URLSearchParams(location.search);
  const gameKey  = params.get("game") || "default";
  const title    = params.get("title") || "Game";
  const subtitle = params.get("subtitle") || "";

  /* ================= MENU HTML ================= */
  const html = `
  <div id="menuOverlay">
    <div class="menuContent">

      <div class="menuHeader">
        <button id="backHome">Exit</button>
        <a href="../how-to-play.html">How to Play</a>
      </div>

      <div class="menuBody">
        <h1>${title}</h1>
        <p>${subtitle}</p>

        <div class="optn">
          <span>⏱ Enable Timer</span>
          <input type="checkbox" id="mTimer">
        </div>

        <div class="optn">
          <span>🔊 Sound</span>
          <input type="checkbox" id="mSound">
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
    background:#E36A6A;
    z-index:9999;
    display:flex;
    padding:16px;
  }

  .menuContent{
    width:100%;
    height:100vh;
    display:flex;
    flex-direction:column;
  }

  .menuHeader{
    display:flex;
    justify-content:space-between;
    margin-bottom:24px;
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
    width:80%;
    max-width:320px;
    border:1px solid #ddd;
    padding:12px;
    border-radius:12px;
    display:flex;
    justify-content:space-between;
  }

  #mStart{
    padding:14px;
    width:80%;
    max-width:320px;
    border:none;
    background:#4f46e5;
    color:white;
    border-radius:12px;
    font-size:18px;
    cursor:pointer;
  }`;
  document.head.appendChild(css);

  /* ================= SETTINGS ================= */
  const mTimer = document.getElementById("mTimer");
  const mSound = document.getElementById("mSound");

  mTimer.checked = localStorage.getItem("timerOn") !== "0";
  mSound.checked = localStorage.getItem("soundOn") !== "0";

  /* ================= EXIT ================= */
  document.getElementById("backHome").onclick = () => history.back();

  /* ================= START GAME ================= */
  document.getElementById("mStart").onclick = () => {

    localStorage.setItem("timerOn", mTimer.checked ? "1":"0");
    localStorage.setItem("soundOn", mSound.checked ? "1":"0");

    document.getElementById("menuOverlay").remove();

    // 🔥 tell game to start
    document.dispatchEvent(new Event("game:start"));
  };

});
