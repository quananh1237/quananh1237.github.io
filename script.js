
/* script.js - Casio fx-580VN X emulator logic */
const S = {
  expr: '0',
  ans: 0,
  mem: 0,
  vars: {A:null,B:null,C:null,D:null,E:null,F:null},
  shift: false,
  alpha: false,
  mode: 'COMP',
  angle: 'DEG',
  history: []
};
const displayExpr = () => document.getElementById('displayExpr');
const displayRes = () => document.getElementById('displayRes');
const statusLeft = () => document.getElementById('status-left');
const statusRight = () => document.getElementById('status-right');
const angleEl = () => document.getElementById('angle');
const ansVal = () => document.getElementById('ansVal');
const memCount = () => document.getElementById('memCount');
const historyBox = () => document.getElementById('historyBox');
const modalRoot = () => document.getElementById('modalRoot');

function render(){
  displayExpr().textContent = S.expr;
  displayRes().textContent = format(S.ans);
  statusLeft().textContent = 'MODE: ' + S.mode;
  statusRight().textContent = `SHIFT: ${S.shift ? 'ON' : 'OFF'} • ALPHA: ${S.alpha ? 'ON' : 'OFF'}`;
  angleEl().textContent = S.angle;
  ansVal().textContent = format(S.ans);
  memCount().textContent = format(S.mem);
  renderHistory();
}
function format(v){
  try{
    if(v===null||v===undefined) return '0';
    if(typeof v === 'number' && !isFinite(v)) return String(v);
    if(math.typeOf && math.typeOf(v)==='Complex') return v.toString();
    return math.format(v, {precision: 14});
  }catch(e){ return String(v); }
}
function renderHistory(){
  const box = historyBox();
  box.innerHTML = '';
  S.history.slice(0,50).forEach(h=>{
    const d = document.createElement('div');
    d.style.display='flex'; d.style.justifyContent='space-between'; d.style.padding='4px 0';
    d.innerHTML = `<div style="color:#9ed3ff">${h.expr}</div><div style="color:#e8f7ff">${format(h.res)}</div>`;
    box.appendChild(d);
  });
}
function sanitize(expr){
  let s = expr;
  s = s.replace(/÷/g,'/').replace(/×/g,'*').replace(/−/g,'-');
  s = s.replace(/([0-9\.]+)!/g,'factorial($1)');
  s = s.replace(/([0-9\.]+)%/g,'($1/100)');
  s = s.replace(/π/g, String(Math.PI));
  return s;
}
function evaluateExpr(expr){
  try{
    const s = sanitize(expr);
    const replaced = s.replace(/Ans/g, String(S.ans));
    const res = math.evaluate(replaced);
    S.ans = res;
    S.history.unshift({expr: expr, res: res, time: Date.now()});
    return res;
  }catch(e){
    return 'Error';
  }
}
document.getElementById('keys').addEventListener('click', e=>{
  const key = e.target.closest('.key');
  if(!key) return;
  const k = key.dataset.key;
  if(!k) return;
  handleKey(k);
});
function handleKey(k){
  if(k==='SHIFT'){ S.shift = !S.shift; S.alpha = false; render(); return; }
  if(k==='ALPHA'){ S.alpha = !S.alpha; S.shift = false; render(); return; }
  if(k==='MODE'){ openModePicker(); return; }
  if(k==='SETUP'){ alert('Setup dialog - emulate: Angle/Display/Fix'); return; }
  if(k==='AC'){ S.expr='0'; render(); return; }
  if(k==='DEL' || k==='DEL2'){ if(S.expr.length<=1) S.expr='0'; else S.expr = S.expr.slice(0,-1); render(); return; }
  if(k==='=' || k==='=' ){ compute(); return; }
  if(S.shift){ handleShiftPlus(k); S.shift=false; render(); return; }
  if(S.alpha){ handleAlphaPlus(k); S.alpha=false; render(); return; }
  switch(k){
    case 'π': appendRaw('π'); break;
    case '^': appendRaw('^'); break;
    case '×': appendRaw('*'); break;
    case 'ANS': appendRaw(String(S.ans)); break;
    case 'ANS2': appendRaw('Ans'); break;
    case 'EXP': appendRaw('e'); break;
    case 'RND': appendRaw('random()'); break;
    case 'nPr': appendRaw('nPr('); break;
    case 'nCr': appendRaw('nCr('); break;
    case 'x!': appendRaw('!'); break;
    case 'sqrt': appendRaw('sqrt('); break;
    case 'log': appendRaw('log10('); break;
    case 'ln': appendRaw('log('); break;
    case 'e^x': appendRaw('exp('); break;
    case '%': appendRaw('%'); break;
    case '1/x': appendRaw('(1/('); break;
    case 'rec': appendRaw('reciprocal('); break;
    case 'BASE': openBase(); break;
    case 'MAT': openMatrix(); break;
    case 'STAT': openStat(); break;
    case 'SOLVE': openEq(); break;
    case 'M+': S.mem = Number(S.mem) + Number(S.ans); break;
    case 'M-': S.mem = Number(S.mem) - Number(S.ans); break;
    case 'MR': appendRaw(String(S.mem)); break;
    case 'ACLEAR': S.mem=0; break;
    default:
      if(/^[0-9]$/.test(k)) appendRaw(k);
      else if(k==='.'){ appendRaw('.'); }
      else if(['+','-','*','/','^'].includes(k)) appendRaw(k);
      else if(['sin','cos','tan','asin','acos','atan'].includes(k)) appendRaw(k + '(');
      else appendRaw(k);
  }
  render();
}
function appendRaw(t){ if(S.expr==='0') S.expr = t; else S.expr += t; }
function compute(){ const out = evaluateExpr(S.expr); S.expr = String(out); render(); }
function handleShiftPlus(k){
  switch(k){
    case 'sin': appendRaw('sinh('); break;
    case 'cos': appendRaw('cosh('); break;
    case 'tan': appendRaw('tanh('); break;
    case 'ln': appendRaw('log10('); break;
    case 'log': appendRaw('log('); break;
    case 'π': appendRaw(String(Math.PI*2)); break;
    case 'x!': appendRaw('gamma('); break;
    case 'nPr': appendRaw('perm('); break;
    case 'nCr': appendRaw('comb('); break;
    case 'sqrt': appendRaw('cbrt('); break;
    case 'M+': storeToNextVar(S.ans); break;
    case 'MR': alert('Variables: ' + JSON.stringify(S.vars)); break;
    default: appendRaw(k);
  }
}
function handleAlphaPlus(k){
  const mapping = {'1':'1','2':'A','3':'D','4':'G','5':'J','6':'M','7':'P','8':'T','9':'W','0':' '};
  if(mapping[k]) appendRaw(mapping[k]);
  else appendRaw(String(k)[0] || '');
}
function storeToNextVar(val){
  const keys = ['A','B','C','D','E','F'];
  for(let k of keys){ if(S.vars[k]===null){ S.vars[k]=val; alert('Stored Ans to var ' + k); return; } }
  S.vars['A'] = val; alert('Vars full. Overwriting A.');
}
function openModePicker(){ const sel = prompt('Mode (COMP/STAT/MATRIX/EQUA/BASE/COMPLEX)', S.mode); if(sel){ S.mode = sel.toUpperCase(); render(); } }
document.getElementById('modeSelect').addEventListener('change', e=>{ S.mode = e.target.value; render(); });
function openMatrix(){ modalRoot().innerHTML=''; const box=document.createElement('div'); box.className='modal'; box.innerHTML = `<h3 style="margin:0;color:#8df">Matrix Editor</h3>
  <div style="margin-top:8px"><label class="muted">Rows:</label> <select id="mRows"><option>2</option><option selected>3</option><option>4</option></select>
  <label class="muted">Cols:</label> <select id="mCols"><option>2</option><option selected>3</option><option>4</option></select>
  <button id="mCreate" class="small-btn">Create</button> <button id="mClose" class="small-btn">Close</button></div>
  <div id="mGrid" style="margin-top:8px"></div>
  <div style="margin-top:8px"><button id="mInsert" class="small-btn">Insert into Expr</button>
  <button id="mDet" class="small-btn">Determinant</button>
  <button id="mInv" class="small-btn">Inverse</button></div>
  <div id="mOut" style="margin-top:8px;color:#9bf"></div>`;
  modalRoot().appendChild(box);
  function build(){ const r=Number(box.querySelector('#mRows').value); const c=Number(box.querySelector('#mCols').value); const grid=box.querySelector('#mGrid'); grid.innerHTML=''; const table=document.createElement('div'); table.style.display='grid'; table.style.gridTemplateColumns=`repeat(${c},1fr)`; table.style.gap='6px'; for(let i=0;i<r;i++){ for(let j=0;j<c;j++){ const inp=document.createElement('input'); inp.value='0'; inp.style.background='#041018'; inp.style.border='1px solid #083'; inp.style.color='#dff'; inp.dataset.r=i; inp.dataset.c=j; inp.style.padding='6px'; table.appendChild(inp); } } grid.appendChild(table); }
  box.querySelector('#mCreate').addEventListener('click', build);
  box.querySelector('#mClose').addEventListener('click', ()=> modalRoot().innerHTML='');
  box.querySelector('#mInsert').addEventListener('click', ()=>{ const grid=box.querySelectorAll('#mGrid input'); if(!grid.length) return alert('Create matrix first'); const rows=Math.max(...Array.from(grid).map(i=>Number(i.dataset.r)))+1; const cols=Math.max(...Array.from(grid).map(i=>Number(i.dataset.c)))+1; const arr=[]; for(let i=0;i<rows;i++){ const row=[]; for(let j=0;j<cols;j++){ const v = box.querySelector(`input[data-r="${i}"][data-c="${j}"]`).value || '0'; row.push(v); } arr.push('['+row.join(',')+']'); } appendRaw('matrix(' + arr.join(',') + ')'); modalRoot().innerHTML=''; render(); });
  box.querySelector('#mDet').addEventListener('click', ()=>{ try{ const M = readMatrixFromBox(box); const det = math.det(M); box.querySelector('#mOut').textContent = 'det = ' + format(det);}catch(e){ box.querySelector('#mOut').textContent = 'Err: ' + e.message;} });
  box.querySelector('#mInv').addEventListener('click', ()=>{ try{ const M = readMatrixFromBox(box); const inv = math.inv(M); box.querySelector('#mOut').textContent = 'inv = ' + JSON.stringify(inv);}catch(e){ box.querySelector('#mOut').textContent = 'Err: ' + e.message;} });
  build();
  function readMatrixFromBox(box){ const inputs = box.querySelectorAll('#mGrid input'); if(!inputs.length) throw new Error('No matrix'); const rows = Math.max(...Array.from(inputs).map(i=>Number(i.dataset.r)))+1; const cols = Math.max(...Array.from(inputs).map(i=>Number(i.dataset.c)))+1; const M=[]; for(let i=0;i<rows;i++){ const r=[]; for(let j=0;j<cols;j++){ const v = box.querySelector(`input[data-r="${i}"][data-c="${j}"]`).value || '0'; r.push(Number(v)); } M.push(r); } return M; }
}
function openStat(){ modalRoot().innerHTML=''; const box=document.createElement('div'); box.className='modal'; box.innerHTML=`<h3 style="margin:0;color:#8df">STAT Editor</h3>
  <div style="margin-top:8px"><textarea id="sList" rows=4 style="width:100%;background:#041018;border:1px solid #083;color:#dff">1,2,3,4,5</textarea></div>
  <div style="margin-top:8px"><button id="sMean" class="small-btn">Mean</button> <button id="sMed" class="small-btn">Median</button> <button id="sStd" class="small-btn">Std</button> <button id="sClose" class="small-btn">Close</button></div>
  <div id="sOut" style="margin-top:8px;color:#9bf"></div>`; modalRoot().appendChild(box);
  box.querySelector('#sMean').addEventListener('click', ()=> { const arr = parseList(box.querySelector('#sList').value); box.querySelector('#sOut').textContent = 'Mean: ' + format(math.mean(arr)); });
  box.querySelector('#sMed').addEventListener('click', ()=> { const arr = parseList(box.querySelector('#sList').value); box.querySelector('#sOut').textContent = 'Median: ' + format(math.median(arr)); });
  box.querySelector('#sStd').addEventListener('click', ()=> { const arr = parseList(box.querySelector('#sList').value); box.querySelector('#sOut').textContent = 'Std: ' + format(math.std(arr)); });
  box.querySelector('#sClose').addEventListener('click', ()=> modalRoot().innerHTML='');
  function parseList(s){ return s.split(',').map(x=>Number(x.trim())).filter(x=>!isNaN(x)); }
}
function openEq(){ modalRoot().innerHTML=''; const box=document.createElement('div'); box.className='modal'; box.innerHTML=`<h3 style="margin:0;color:#8df">Equation Solver</h3>
  <div style="margin-top:8px"><button id="lin" class="small-btn">Linear ax+b=0</button> <button id="quad" class="small-btn">Quadratic ax²+bx+c</button> <button id="sys" class="small-btn">Linear System</button> <button id="close" class="small-btn">Close</button></div>
  <div id="out" style="margin-top:8px;color:#9bf"></div>`; modalRoot().appendChild(box);
  box.querySelector('#lin').addEventListener('click', ()=> { const a=Number(prompt('a')); const b=Number(prompt('b')); if(a===0) box.querySelector('#out').textContent='No solution (a=0)'; else box.querySelector('#out').textContent='x=' + format(-b/a); });
  box.querySelector('#quad').addEventListener('click', ()=>{ const a=Number(prompt('a')); const b=Number(prompt('b')); const c=Number(prompt('c')); let D=b*b-4*a*c; if(D>=0){ box.querySelector('#out').textContent=`x1=${format((-b+Math.sqrt(D))/(2*a))} x2=${format((-b-Math.sqrt(D))/(2*a))}`; }else{ box.querySelector('#out').textContent=`x1=${format(math.complex(-b/(2*a),Math.sqrt(-D)/(2*a)))} x2=${format(math.complex(-b/(2*a),-Math.sqrt(-D)/(2*a)))}`; } });
  box.querySelector('#sys').addEventListener('click', ()=>{ const n = Number(prompt('Number of equations (2-4)',2)); if(!n||n<2||n>4){ alert('Invalid'); return; } const A=[]; const b=[]; for(let i=0;i<n;i++){ const row = prompt(`Row ${i+1} coefficients comma separated (n numbers)`); A.push(row.split(',').map(x=>Number(x.trim()))); } for(let i=0;i<n;i++){ b.push(Number(prompt(`b[${i+1}]`))); } try{ const sol = math.lusolve(A,b); box.querySelector('#out').textContent = 'Solution: ' + JSON.stringify(sol.map(x=>x[0])); }catch(e){ box.querySelector('#out').textContent = 'Err: '+ e.message; } });
  box.querySelector('#close').addEventListener('click', ()=> modalRoot().innerHTML='');
}
function openBase(){ modalRoot().innerHTML=''; const box=document.createElement('div'); box.className='modal'; box.innerHTML=`<h3 style="margin:0;color:#8df">Base Converter</h3>
  <div style="margin-top:8px"><input id="bVal" placeholder="value (e.g. 255 or 0xFF or 0b1010)"></div>
  <div style="margin-top:8px"><select id="from"><option value="0">Auto</option><option value="2">BIN</option><option value="8">OCT</option><option value="10" selected>DEC</option><option value="16">HEX</option></select>
  <select id="to"><option value="2">BIN</option><option value="8">OCT</option><option value="10">DEC</option><option value="16">HEX</option></select>
  <button id="bConv" class="small-btn">Convert</button> <button id="bClose" class="small-btn">Close</button></div>
  <div id="bOut" style="margin-top:8px;color:#9bf"></div>`; modalRoot().appendChild(box);
  box.querySelector('#bConv').addEventListener('click', ()=>{ const v = box.querySelector('#bVal').value.trim(); const fm = Number(box.querySelector('#from').value); const to = Number(box.querySelector('#to').value); try{ let num; if(fm===0){ if(v.startsWith('0b')) num = BigInt(parseInt(v.slice(2),2)); else if(v.startsWith('0x')) num = BigInt(parseInt(v.slice(2),16)); else num = BigInt(v); }else num = BigInt(parseInt(v, fm)); let out; if(to===10) out = num.toString(10); else if(to===2) out = '0b' + num.toString(2); else if(to===8) out = '0o' + num.toString(8); else if(to===16) out = '0x' + num.toString(16).toUpperCase(); box.querySelector('#bOut').textContent = out; }catch(e){ box.querySelector('#bOut').textContent = 'Err: ' + e.message; } });
  box.querySelector('#bClose').addEventListener('click', ()=> modalRoot().innerHTML='');
}
function appendRaw(t){ if(S.expr==='0') S.expr = t; else S.expr += t; }
document.getElementById('exportBtn').addEventListener('click', ()=>{
  const payload = JSON.stringify({expr:S.expr,ans:S.ans,mem:S.mem,vars:S.vars,history:S.history});
  const blob = new Blob([payload], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='casio_emu_export.json'; a.click();
});
document.getElementById('importBtn').addEventListener('click', ()=>{
  const txt = prompt('Paste JSON export here:');
  if(!txt) return;
  try{ const p = JSON.parse(txt); S.expr = p.expr || '0'; S.ans = p.ans || 0; S.mem = p.mem || 0; S.vars = p.vars || S.vars; S.history = p.history || []; render(); alert('Imported'); }catch(e){ alert('Import failed: ' + e.message); }
});
document.getElementById('openMatrix').addEventListener('click', openMatrix);
document.getElementById('openStat').addEventListener('click', openStat);
document.getElementById('openEq').addEventListener('click', openEq);
document.getElementById('openBase').addEventListener('click', openBase);
document.getElementById('openHistory').addEventListener('click', ()=> { alert('History length: ' + S.history.length + '\\nMost recent: ' + (S.history[0]? S.history[0].expr + ' = ' + format(S.history[0].res) : 'none')); });
document.getElementById('clearHistory').addEventListener('click', ()=> { S.history = []; render(); });
window.addEventListener('keydown', (e)=>{ const k=e.key; if(k==='Shift'){ S.shift=true; render(); return; } if(k==='Enter'){ compute(); return; } if(k==='Backspace'){ if(S.expr.length<=1) S.expr='0'; else S.expr=S.expr.slice(0,-1); render(); return; } if(/^[0-9+\-*/^().]$/.test(k)){ appendRaw(k); render(); return; } });
math.import({ nCr: function(n,r){ return math.combinations(n,r); }, nPr: function(n,r){ return math.factorial(n)/math.factorial(n-r); }, perm: function(n,r){ return math.factorial(n)/math.factorial(n-r); }, comb: function(n,r){ return math.combinations(n,r); }, reciprocal: function(x){ return 1/x; } }, {override: true});
render();
