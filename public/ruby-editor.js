/* Owner-only editor additions for "Ruby Luxury": logo space (top-left), font + size for every text group.
   Adds one panel; all wording stays in the existing "Royal Stage · your wording" panel (same rs* fields), which this
   script keeps visible while Ruby Luxury is selected. Settings are saved in one hidden field, `rubyCfg` (JSON).
   The logo is kept as the LAST photo of the invitation (so the existing upload/save code stores it) and is shown only as the logo. */
'use strict';
(()=>{
const $=s=>document.querySelector(s);
const ID='ruby-luxury',preset=$('#live-preset');
if(!preset||typeof fields==='undefined'||typeof markDirty!=='function'||typeof photos==='undefined')return;
const ensure=()=>{const t=INVITATION_TEMPLATES.find(x=>x.id===ID);if(t&&![...preset.options].some(o=>o.value===ID)){const o=new Option(t.name,ID);o.dataset.layout='0';preset.add(o)}};
ensure();new MutationObserver(ensure).observe(preset,{childList:true});
const host=$('#save')?.closest('.panel');if(!host)return;
const GROUPS=[['names','Names (couple, “Tap to open”, signature)'],['heads','Headings (titles, date number, event names)'],['lines','Lines (parents, message, family, closing)'],['small','Small capital labels & buttons']];
const FONTS=[['','Default for this template'],['allura','Allura (script)'],['parisienne','Parisienne (script)'],['script','Great Vibes (script)'],['cinzel','Cinzel (roman capitals)'],['playfair','Playfair Display'],['serif','Cormorant Garamond'],['italic','Cormorant italic'],['montserrat','Montserrat'],['sans','Clean sans (Arial)'],['malayalam','Malayalam friendly'],['amiri','Amiri (Arabic)'],['custom','My custom font (upload in Font section)']];
const cfgInput=document.createElement('input');cfgInput.type='hidden';cfgInput.id='rubyCfg';
const panel=document.createElement('section');panel.className='panel';panel.id='rl-panel';panel.hidden=true;
panel.innerHTML='<h2>Ruby Luxury · look &amp; logo</h2><p class="help">Add a logo (top-left of the invitation) and choose the font and size for every kind of text. Tap any text in the preview to change its wording.</p><div class="field-grid" id="rl-grid"></div>';
panel.append(cfgInput);host.before(panel);fields.push('rubyCfg');
const grid=panel.querySelector('#rl-grid');
let cfg={v:1,logo:false,logoSize:100,f:{},s:{}};
const read=()=>{try{const j=JSON.parse(cfgInput.value||'{}');if(j&&typeof j==='object')cfg={v:1,logo:j.logo===true,logoSize:Number(j.logoSize)||100,f:j.f||{},s:j.s||{}}}catch{}};
const write=()=>{cfgInput.value=JSON.stringify(cfg);markDirty()};
function row(html,cls){const d=document.createElement('div');d.className=cls||'wide';d.style.gridColumn='1/-1';d.innerHTML=html;grid.append(d);return d}
/* logo */
const logoRow=row('<strong>Logo (top-left)</strong><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:6px"><img id="rl-logo-img" alt="" style="height:44px;max-width:140px;object-fit:contain;display:none;background:#2a0610;border-radius:6px;padding:4px"><button type="button" id="rl-logo-add">Add logo</button><button type="button" id="rl-logo-del" hidden>Remove logo</button><input id="rl-logo-file" type="file" accept="image/png,image/jpeg,image/webp" hidden></div><label style="display:block;margin-top:8px">Logo size <input id="rl-logo-size" type="range" min="40" max="220" step="5" value="100"> <span id="rl-logo-size-n">100%</span></label><p class="help">PNG with transparent background looks best. The logo is stored as the last item of your photo list and is not shown in the photo slider.</p>');
const fileEl=logoRow.querySelector('#rl-logo-file'),addBtn=logoRow.querySelector('#rl-logo-add'),delBtn=logoRow.querySelector('#rl-logo-del'),logoImg=logoRow.querySelector('#rl-logo-img'),sizeEl=logoRow.querySelector('#rl-logo-size'),sizeN=logoRow.querySelector('#rl-logo-size-n');
let logoObj=null;
const logoIdx=()=>cfg.logo&&logoObj?photos.indexOf(logoObj):-1;
function sync(){
 read();
 if(cfg.logo){
  if(!logoObj||!photos.includes(logoObj)){
   if(logoObj&&!photos.includes(logoObj)){cfg.logo=false;logoObj=null;cfgInput.value=JSON.stringify(cfg);markDirty()}
   else if(photos.length)logoObj=photos[photos.length-1];
  }
  if(cfg.logo&&logoObj){const i=photos.indexOf(logoObj);if(i>=0&&i!==photos.length-1){photos.splice(i,1);photos.push(logoObj);if(typeof mediaUI==='function')mediaUI();markDirty()}}
 }
 const has=cfg.logo&&!!logoObj;
 delBtn.hidden=!has;addBtn.textContent=has?'Replace logo':'Add logo';
 if(has){logoImg.src=logoObj.preview||logoObj.value;logoImg.style.display='block'}else logoImg.style.display='none';
 sizeEl.value=cfg.logoSize;sizeN.textContent=cfg.logoSize+'%';
 const items=document.querySelectorAll('#media-list .media-item');items.forEach((el,i)=>{el.style.outline=has&&i===items.length-1?'2px solid #d9b46a':''; el.title=has&&i===items.length-1?'Logo (not shown in the slider)':''});
}
async function logoFrom(file){
 if(!/^image\/(png|jpeg|webp)$/.test(file.type)){alert('Choose a PNG, JPG or WebP logo.');return}
 const bmp=await createImageBitmap(file),f=Math.min(1,520/Math.max(bmp.width,bmp.height)),c=document.createElement('canvas');
 c.width=Math.max(1,Math.round(bmp.width*f));c.height=Math.max(1,Math.round(bmp.height*f));c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);bmp.close();
 const value=c.toDataURL('image/png');
 if(logoObj&&photos.includes(logoObj))photos.splice(photos.indexOf(logoObj),1);
 else if(photos.length>=20){alert('Up to twenty photos per invitation (the logo uses one).');return}
 logoObj={value,preview:value};photos.push(logoObj);cfg.logo=true;
 if(typeof mediaUI==='function')mediaUI();write();sync();
}
addBtn.onclick=()=>fileEl.click();
fileEl.onchange=async e=>{const f=e.target.files[0];e.target.value='';if(f)try{await logoFrom(f)}catch(err){alert(err.message||'Could not read the logo')}};
delBtn.onclick=()=>{const i=photos.indexOf(logoObj);if(i>=0)photos.splice(i,1);logoObj=null;cfg.logo=false;if(typeof mediaUI==='function')mediaUI();write();sync()};
sizeEl.oninput=()=>{read();cfg.logoSize=Number(sizeEl.value);sizeN.textContent=cfg.logoSize+'%';write()};
/* fonts + sizes */
const heading=document.createElement('h3');heading.textContent='Fonts & sizes';heading.style.cssText='grid-column:1/-1;margin:14px 0 0;font-size:15px';grid.append(heading);
for(const [g,label] of GROUPS){
 const r=row(`<strong>${label}</strong><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:6px"><select data-g="${g}">${FONTS.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select><label>Size <input type="range" data-s="${g}" min="60" max="160" step="5" value="100"> <span data-n="${g}">100%</span></label></div>`);
 r.querySelector('select').onchange=e=>{read();cfg.f[g]=e.target.value;write()};
 r.querySelector('input').oninput=e=>{read();cfg.s[g]=Number(e.target.value);r.querySelector('[data-n]').textContent=cfg.s[g]+'%';write()};
}
const resetBtn=document.createElement('button');resetBtn.type='button';resetBtn.textContent='Reset fonts & sizes';resetBtn.style.gridColumn='1/-1';resetBtn.onclick=()=>{read();cfg.f={};cfg.s={};write();paint()};grid.append(resetBtn);
function paint(){read();for(const [g] of GROUPS){const s=grid.querySelector(`select[data-g="${g}"]`),r=grid.querySelector(`input[data-s="${g}"]`);s.value=cfg.f[g]||'';r.value=cfg.s[g]||100;grid.querySelector(`[data-n="${g}"]`).textContent=(cfg.s[g]||100)+'%'}sync()}
/* show the wording panel + this panel while Ruby Luxury is selected */
const rs=()=>$('#rs-panel'),h2=()=>rs()&&rs().querySelector('h2');let last='',oldTitle='';
setInterval(()=>{
 const on=preset.value===ID;
 if(on!==(last===ID)||last===''){
  last=on?ID:preset.value||'x';panel.hidden=!on;paint();
  if(h2()){if(on){oldTitle=oldTitle||h2().textContent;h2().textContent='Ruby Luxury · your wording';rs().hidden=false}else if(oldTitle){h2().textContent=oldTitle}}
 }else if(on){if(rs()&&rs().hidden)rs().hidden=false;sync()}
},400);
preset.addEventListener('change',()=>{if(preset.value===ID){const f=$('#font');if(f&&f.value==='serif')f.value='allura';const a=$('#animation');if(a)a.checked=true;if($('#music-autoplay'))$('#music-autoplay').checked=true;markDirty()}});
const btn=document.createElement('button');btn.type='button';btn.className='primary';btn.textContent='Use Ruby Luxury';
btn.onclick=()=>{ensure();preset.value=ID;preset.dispatchEvent(new Event('change'));panel.hidden=false;panel.scrollIntoView({behavior:'smooth',block:'start'})};
(preset.closest('label')||preset.parentElement).append(btn);
window.addEventListener('message',e=>{const fr=$('#preview');if(fr&&e.source===fr.contentWindow&&e.data&&e.data.type==='mubiey-rl-logo'){panel.hidden=false;panel.scrollIntoView({behavior:'smooth',block:'center'});fileEl.click()}});
})();
