/* =====================================================
   Universal Answer Feedback Engine
   Works with ANY math game (+ − × ÷)
   No game-code modification required
   ===================================================== */

(function(){

  const CLS_CORRECT = 'opt-correct';
  const CLS_WRONG   = 'opt-wrong';
  const CLS_LOCK    = 'opt-disabled';

  // 🔹 Extract correct answer from question text
  function getCorrectAnswer(){
    const q = document.getElementById('question');
    if(!q) return null;

    const text = q.innerText
      .replace('=', '')
      .replace('?', '')
      .trim();

    // supports: + - − × ÷ /
    const match = text.match(/(\d+)\s*([+\-−×÷\/])\s*(\d+)/);
    if(!match) return null;

    const a  = Number(match[1]);
    const b  = Number(match[3]);
    const op = match[2];

    switch(op){
      case '+': return a + b;
      case '-':
      case '−': return a - b;
      case '×': return a * b;
      case '÷':
      case '/': return +(a / b).toFixed(2);
      default: return null;
    }
  }

  // 🔹 Global click listener (captures ALL games)
  document.addEventListener('click', function(e){

    const opt = e.target.closest('.opt');
    if(!opt) return;

    // already processed
    if(opt.classList.contains(CLS_LOCK)) return;

    const box = opt.parentElement;
    if(!box) return;

    const correctAnswer = getCorrectAnswer();
    if(correctAnswer === null) return;

    const selected = Number(opt.innerText);

    // 🔒 lock all options (UI only)
    box.querySelectorAll('.opt').forEach(o=>{
      o.classList.add(CLS_LOCK);
    });

    // ✅ Correct / ❌ Wrong
    if(selected === correctAnswer){
      opt.classList.add(CLS_CORRECT);
    }else{
      opt.classList.add(CLS_WRONG);

      // highlight correct option
      box.querySelectorAll('.opt').forEach(o=>{
        if(Number(o.innerText) === correctAnswer){
          o.classList.add(CLS_CORRECT);
        }
      });
    }

    // 🧹 auto clear (next question safe)
    setTimeout(()=>{
      box.querySelectorAll('.opt').forEach(o=>{
        o.classList.remove(CLS_CORRECT, CLS_WRONG, CLS_LOCK);
      });
    }, 450);

  }, true); // 👈 CAPTURE MODE (IMPORTANT)

})();

