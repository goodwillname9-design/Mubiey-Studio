/* Owner-only editor additions for "Ruby Luxury" and the five "Ivory Envelope" designs (2005-2009).
   - "look" panel: font + size for names, headings, lines and small labels.
   - "Calendar" panel (Ivory designs): month, year and which days carry a HEART (main date) or a RING (another programme),
     plus a short note under the date. Tap a day to cycle: nothing -> heart -> ring -> nothing.
   Everything is kept in ONE hidden field, `rubyCfg` (JSON), so the existing preview / save / open code stores it.
   Unknown keys in rubyCfg are always preserved. Wording stays in the "Royal Stage · your wording" panel (same rs* fields),
   which this script keeps visible for these designs. The logo and the Arabic font are handled for every design by
   logo-editor.js / arabic-font.js, so they are not repeated here. */
'use strict';
(()=>{
const $=s=>document.querySelector(s);
const preset=$('#live-preset');
if(!preset||typeof fields==='undefined'||typeof markDirty!=='function')return;
const RUBY='ruby-luxury',ivory=()=>(window.MubieyIvory&&window.MubieyIvory.ids)||[];
const mine=v=>v===RUBY||ivory().includes(v),hasCal=v=>ivory().includes(v);
const ensure=()=>{[RUBY,...ivory()].forEach(id=>{const t=INVITATION_TEMPLATES.find(x=>x.id===id);if(t&&![...preset.options].some(o=>o.value===id)){const o=new Option(t.name,id);o.dataset.layout='0';preset.add(o)}})};
ensure();new MutationObserver(ensure).observe(preset,{childList:true});
const host=$('#save')?.closest('.panel');if(!host)return;
const GROUPS=[['names','Names (couple, “Tap to open”, signature)'],['heads','Headings (titles, month, event names)'],['lines','Lines (parents, message, family, closing)'],['small','Small capital labels & buttons']];
const FONTS=[['','Default for this design'],['allura','Allura (script)'],['parisienne','Parisienne (script)'],['script','Great Vibes (script)'],['cinzel','Cinzel (roman capitals)'],['playfair','Playfair Display'],['serif','Cormorant Garamond'],['italic','Cormorant italic'],['montserrat','Montserrat'],['sans','Clean sans (Arial)'],['malayalam','Malayalam friendly'],['amiri','Amiri (Arabic)'],['custom','My custom font (upload in Font section)']];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const cfgInput=document.createElement('input');cfgInput.type='hidden';cfgInput.id='rubyCfg';
let cfg={v:1};
const read=()=>{try{const j=JSON.parse(cfgInput.value||'{}');cfg=j&&typeof j==='object'?Object.assign({v:1},j):{v:1}}catch{cfg={v:1}}cfg.f=cfg.f||{};cfg.s=cfg.s||{}};
const write=()=>{cfgInput.value=JSON.stringify(cfg);markDirty()};

/* ---------- look panel ---------- */
const panel=document.createElement('section');panel.className='panel';panel.id='rl-panel';panel.hidden=true;
panel.innerHTML='<h2>Fonts &amp; sizes</h2><p class="help">Choose the font and size for each kind of text. Tap any text in the preview to change its wording.</p><div class="field-grid" id="rl-grid"></div>';
panel.append(cfgInput);host.before(panel);fields.push('rubyCfg');
const grid=panel.querySelector('#rl-grid');
function row(html){const d=document.createElement('div');d.className='wide';d.style.gridColumn='1/-1';d.innerHTML=html;grid.append(d);return d}
for(const [g,label] of GROUPS){
 const r=row(`<strong>${label}</strong><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:6px"><select data-g="${g}">${FONTS.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select><label>Size <input type="range" data-s="${g}" min="60" max="160" step="5" value="100"> <span data-n="${g}">100%</span></label></div>`);
 r.querySelector('select').onchange=e=>{read();cfg.f[g]=e.target.value;write()};
 r.querySelector('input').oninput=e=>{read();cfg.s[g]=Number(e.target.value);r.querySelector('[data-n]').textContent=cfg.s[g]+'%';write()};
}
const resetBtn=document.createElement('button');resetBtn.type='button';resetBtn.textContent='Reset fonts & sizes';resetBtn.style.gridColumn='1/-1';resetBtn.onclick=()=>{read();cfg.f={};cfg.s={};write();paint()};grid.append(resetBtn);
function paint(){read();for(const [g] of GROUPS){const s=grid.querySelector(`select[data-g="${g}"]`),r=grid.querySelector(`input[data-s="${g}"]`);s.value=cfg.f[g]||'';r.value=cfg.s[g]||100;grid.querySelector(`[data-n="${g}"]`).textContent=(cfg.s[g]||100)+'%'}}

/* ---------- calendar panel ---------- */
const cal=document.createElement('section');cal.className='panel';cal.id='iv-cal-panel';cal.hidden=true;
cal.innerHTML='<h2>Calendar (heart &amp; ring)</h2><p class="help">The calendar shows the month of your wedding date. Change the month if you like, then tap days: <b>♥</b> = the main date, <b>◯</b> = another programme (for example Walima). Tap again to clear.</p><div class="field-grid"><label>Month<select id="ivc-m"></select></label><label>Year<select id="ivc-y"></select></label></div><div id="ivc-grid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin:12px 0;max-width:340px"></div><label>Note under the date<input id="ivc-note" maxlength="90" placeholder="Walima on the 21st"></label><div class="actions" style="margin-top:10px"><button type="button" id="ivc-auto">Use my wedding date</button></div>';
host.before(cal);
const mSel=cal.querySelector('#ivc-m'),ySel=cal.querySelector('#ivc-y'),gridEl=cal.querySelector('#ivc-grid'),noteEl=cal.querySelector('#ivc-note');
mSel.innerHTML=MONTHS.map((n,i)=>`<option value="${i+1}">${n}</option>`).join('');
const thisYear=new Date().getFullYear();ySel.innerHTML=Array.from({length:6},(_,i)=>thisYear-1+i).map(y=>`<option>${y}</option>`).join('');
const wd=()=>{try{const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(collect().date||'');return m?{y:+m[1],m:+m[2],d:+m[3]}:null}catch{return null}};
function view(){read();const w=wd(),c=cfg.cal||{};const now=new Date();
 let y=Number(c.y),m=Number(c.m);if(!(y>=2020&&y<=2040&&m>=1&&m<=12)){y=w?w.y:now.getFullYear();m=w?w.m:now.getMonth()+1}
 const dim=new Date(Date.UTC(y,m,0)).getUTCDate();let marks={},explicit=false;
 if(c.marks&&typeof c.marks==='object'&&Object.keys(c.marks).length){explicit=true;for(const [k,v] of Object.entries(c.marks))if((v==='h'||v==='r')&&+k>=1&&+k<=dim)marks[+k]=v}
 else if(w&&w.y===y&&w.m===m)marks[w.d]='h';
 return {y,m,dim,marks,note:typeof c.note==='string'?c.note:''}}
function save(v){read();cfg.cal={y:v.y,m:v.m,marks:Object.fromEntries(Object.entries(v.marks).map(([k,x])=>[String(k),x])),note:v.note};write()}
function drawCal(){const v=view();
 if(![...ySel.options].some(o=>+o.value===v.y)){const o=new Option(v.y,v.y);ySel.add(o)}
 mSel.value=String(v.m);ySel.value=String(v.y);if(document.activeElement!==noteEl)noteEl.value=v.note;
 const first=new Date(Date.UTC(v.y,v.m-1,1)).getUTCDay();let h='';
 for(const x of ['S','M','T','W','T','F','S'])h+=`<span style="text-align:center;font-size:11px;opacity:.7">${x}</span>`;
 for(let i=0;i<first;i++)h+='<span></span>';
 for(let d=1;d<=v.dim;d++){const k=v.marks[d];h+=`<button type="button" data-d="${d}" style="padding:7px 0;border-radius:8px;border:1px solid ${k?'#c9a24d':'#ffffff30'};background:${k==='h'?'#8d1e3a':'transparent'};color:inherit;font-weight:${k?700:400}">${k==='h'?'♥ ':k==='r'?'◯ ':''}${d}</button>`}
 gridEl.innerHTML=h}
gridEl.onclick=e=>{const b=e.target.closest('button[data-d]');if(!b)return;const v=view(),d=+b.dataset.d,k=v.marks[d];
 if(!k)v.marks[d]='h';else if(k==='h')v.marks[d]='r';else delete v.marks[d];
 save(v);drawCal()};
mSel.onchange=()=>{const v=view();v.m=+mSel.value;v.marks={};save(v);drawCal()};
ySel.onchange=()=>{const v=view();v.y=+ySel.value;v.marks={};save(v);drawCal()};
noteEl.oninput=()=>{const v=view();v.note=noteEl.value.slice(0,90);save(v)};
cal.querySelector('#ivc-auto').onclick=()=>{read();delete cfg.cal;write();drawCal()};

/* ---------- show / hide ---------- */
const rs=()=>$('#rs-panel'),h2=()=>rs()&&rs().querySelector('h2');let last=null,oldTitle='';
function refresh(){
 const v=preset.value,on=mine(v);
 if(v!==last){last=v;panel.hidden=!on;cal.hidden=!hasCal(v);paint();if(hasCal(v))drawCal();
  if(h2()){if(on){oldTitle=oldTitle||h2().textContent;h2().textContent='Your wording';rs().hidden=false}else if(oldTitle){h2().textContent=oldTitle}}}
 else if(on){if(rs()&&rs().hidden)rs().hidden=false;if(hasCal(v)&&!cal.contains(document.activeElement))drawCal()}
}
setInterval(refresh,500);refresh();
preset.addEventListener('change',()=>{if(mine(preset.value)){const f=$('#font');if(f&&f.value==='serif')f.value='allura';const a=$('#animation');if(a)a.checked=true;if($('#music-autoplay'))$('#music-autoplay').checked=true;markDirty()}});
const btn=document.createElement('button');btn.type='button';btn.className='primary';btn.textContent='Use Ruby Luxury';
btn.onclick=()=>{ensure();preset.value=RUBY;preset.dispatchEvent(new Event('change'));panel.hidden=false;panel.scrollIntoView({behavior:'smooth',block:'start'})};
(preset.closest('label')||preset.parentElement).append(btn);
window.addEventListener('message',e=>{const fr=$('#preview');if(fr&&e.source===fr.contentWindow&&e.data&&e.data.type==='mubiey-iv-cal'){cal.hidden=false;drawCal();cal.scrollIntoView({behavior:'smooth',block:'center'})}});
})();
