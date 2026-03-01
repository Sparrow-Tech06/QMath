document.addEventListener("DOMContentLoaded", () => {

  /* ================= URL PARAMS ================= */
  const params = new URLSearchParams(location.search);
  const gameKey  = params.get("game") || "default";
  const title    = params.get("title") || "Game";
  const subtitle = params.get("subtitle") || "";

  /* ================= MENU HTML ================= */
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

  /* ================= MENU CSS ================= */
  const css = document.createElement("style");
  css.innerHTML = `
    #menuOverlay{
      position:fixed;
      inset:0;
      background:#D96868;
      z-index:9999;
      display:flex;
      flex-direction:column;
      justify-content:flex-start;
      align-items:stretch;
      padding:16px;
      animation:fade .2s ease;
    }

    .menuContent{
      display:flex;
      flex-direction:column;
      height:100vh;
      width:100%;
    }

    .menuHeader{
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:24px;
    }

    .menuHeader button,
    .menuHeader a{
      font-size:16px;
      font-weight:600;
      background: var(--card);
      border:1px solid var(--border);
      text-decoration:none;
      color:#4f46e5;
      cursor:pointer;
      border-radius:12px;
      padding:6px 10px;
    }

    .menuBody{
      flex:1;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      gap:16px;
    }

    .menuBody h1{
      font-size:30px;
      margin:0;
    }

    .menuBody p{
      font-size:16px;
      color:#555;
      margin:0;
      text-align:center;
    }

    .optn{
      display:flex;
      justify-content:space-between;
      align-items:center;
      border:1px solid #e6e8ef;
      padding:12px 16px;
      border-radius:14px;
      width:80%;
      max-width:320px;
    }

    #mStart{
      margin-top:16px;
      padding:14px;
      width:80%;
      max-width:320px;
      border:none;
      background:#4f46e5;
      color:#fff;
      border-radius:14px;
      font-weight:600;
      font-size:18px;
      cursor:pointer;
    }

    @keyframes fade{
      from{opacity:.6; transform:translateY(10px)}
      to{opacity:1}
    }
  `;
  document.head.appendChild(css);

  /* ================= LOAD PREVIOUS SETTINGS ================= */
  const prevTimer = localStorage.getItem('timerOn');
  const prevSound = localStorage.getItem('soundOn');

  const mTimer = document.getElementById("mTimer");
  const mSound = document.getElementById("mSound");

  if(prevTimer !== null) mTimer.checked = prevTimer === '1';
  if(prevSound !== null) mSound.checked = prevSound === '1';

  /* ================= MENU SOUND ================= */
  let clickSound = null;

  const initSound = () => {

    if(clickSound){
      clickSound.stop();
      clickSound = null;
    }

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

  /* ================= EXIT BUTTON ================= */
  document.getElementById("backHome").onclick = () => {
    if(clickSound) clickSound.stop();
    window.history.back();
  };

  /* =====================================================
     ✅ START GAME ONLY AFTER BUTTON CLICK
  ====================================================== */
  document.getElementById("mStart").onclick = () => {

    // Save settings
    localStorage.setItem('timerOn', mTimer.checked ? '1' : '0');
    localStorage.setItem('soundOn', mSound.checked ? '1' : '0');

    // Remove overlay
    document.getElementById("menuOverlay").remove();

    // Stop menu music
    if(clickSound) clickSound.stop();

    // 🔥 IMPORTANT PART
    // Start game AFTER overlay closes
    if (typeof window.startGame === "function") {
      window.startGame();
    }
  };

});
