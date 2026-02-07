/* ======================================================
   Answer Feedback Module (NO GAME CODE CHANGE REQUIRED)
   + − × ÷ / supported
   ====================================================== */

(function(){

  const CORRECT = 'opt-correct';
  const WRONG   = 'opt-wrong';
  const LOCKED  = 'opt-disabled';

  function reset(box){
    box.querySelectorAll('.opt').forEach(o=>{
      o.classList.remove(CORRECT, WRONG, LOCKED);
    });
  }

  function getCorrectAnswer(){
    const q = document.getElementById('question');
    if(!q) return null;

    const text = q.innerText
      .replace('=', '')
      .replace('?', '')
      .trim();

    // supports + - − × ÷ /
    const m = text.match(/(\d+)\s*([+\-−×÷\/])\s*(\d+)/);
    if(!m) return null;

    const a = Number(m[1]);
    const b = Number(m[3]);
    const op = m[2];

    switch(op){
      case '+': return a + b;
      case '-':
      case '−': return a - b;
      case '×': return a * b;
      case '/':
      case '÷': return a / b;
      default: return null;
    }
  }

  // 🔥 CAPTURE PHASE LISTENER (key point)
  document.addEventListener('click', function(e){
    const opt = e.target.closest('.opt');
    if(!opt) return;

    const box = opt.parentElement;
    if(!box || box.dataset.feedbackLocked) return;

    const correct = getCorrectAnswer();
    if(correct === null) return;

    box.dataset.feedbackLocked = '1';

    const selected = Number(opt.innerText);

    // lock visually (independent of game logic)
    box.querySelectorAll('.opt').forEach(o=>{
      o.classList.add(LOCKED);
    });

    if(selected === correct){
      opt.classList.add(CORRECT);
    }else{
      opt.classList.add(WRONG);
      box.querySelectorAll('.opt').forEach(o=>{
        if(Number(o.innerText) === correct){
          o.classList.add(CORRECT);
        }
      });
    }

    // auto clear before next question renders
    setTimeout(()=>{
      reset(box);
      delete box.dataset.feedbackLocked;
    }, 350);

  }, true); // 👈 TRUE = capture phase

})();

    
