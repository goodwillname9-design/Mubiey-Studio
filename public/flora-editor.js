/* Owner-only editor for the Floral Envelope designs (3001-3005): choose each page's background.
   Six pages (hero, date, photos, schedule, events, closing). Each can be one of the four artworks or your own picture.
   Stored in ONE hidden field `floraBg` (JSON). Wording and fonts stay in the shared panels. */
'use strict';
(()=>{
const $=s=>document.querySelector(s);
const preset=$('#live-preset');
if(!preset||typeof fields==='undefined'||typeof markDirty!=='function')return;
const F=()=>[...((window.MubieyFlora&&window.MubieyFlora.ids)||[]),...((window.MubieyIvory&&window.MubieyIvory.ids)||[])];
const SEC=[['hero','Opening page'],['date','Date page'],['story','Photos page'],['day','Schedule page'],['events','Venues page'],['end','Closing page']];
const OPTS=[['frame','Cream frame with butterflies'],['ribbon','Ribbon & dried flowers'],['damask','Damask lace with flowers'],['custom','My own picture']];
const host=$('#save')?.closest('.panel');if(!host)return;
const panel=document.createElement('section');panel.className='panel';panel.id='fl-bg-panel';panel.hidden=true;
panel.innerHTML='<h2>Page backgrounds</h2><p class="help">Choose the background of each page. Text stays on the page with no box. Your own picture is resized automatically.</p><div class="field-grid" id="fl-bg-grid"></div>';
const hidden=document.createElement('input');hidden.type='hidden';hidden.id='floraBg';panel.append(hidden);
host.before(panel);fields.push('floraBg');
const grid=panel.querySelector('#fl-bg-grid');
let state={};
const read=()=>{try{const j=JSON.parse(hidden.value||'{}');state=j&&typeof j==='object'?j:{}}catch{state={}}};
const write=()=>{hidden.value=JSON.stringify(state);markDirty()};
const files={};
for(const [k,label] of SEC){
 const r=document.createElement('div');r.className='wide';r.style.gridColumn='1/-1';
 r.innerHTML=`<strong>${label}</strong><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:6px"><select data-k="${k}">${OPTS.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select><input type="file" accept="image/png,image/jpeg,image/webp" data-f="${k}" hidden><img data-t="${k}" alt="" style="height:44px;width:33px;object-fit:cover;border-radius:4px;display:none"></div>`;
 grid.append(r);
 const sel=r.querySelector('select'),fi=r.querySelector('input'),th=r.querySelector('img');files[k]={sel,fi,th};
 sel.onchange=()=>{read();if(sel.value==='custom'){fi.click();return}state[k]=sel.value;write();paint()};
 fi.onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;try{state[k]=await shrink(f);write();paint()}catch(err){alert(err.message||'Could not use this picture')}};
}
async function shrink(file){
 if(!/^image\/(png|jpeg|webp)$/.test(file.type))throw Error('Choose a PNG, JPG or WebP picture.');
 const url=URL.createObjectURL(file);
 try{const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(Error('Could not read this picture.'));i.src=url});
  for(const max of [640,520,420,340]){const k=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight)),c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*k);c.height=Math.round(img.naturalHeight*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);const out=c.toDataURL('image/jpeg',.74);if(out.length<=110000)return out}
  throw Error('This picture is too large. Please use a smaller picture.');
 }finally{URL.revokeObjectURL(url)}
}
function paint(){read();for(const [k] of SEC){const {sel,th}=files[k];const v=state[k];
 if(typeof v==='string'&&v.startsWith('data:')){sel.value='custom';th.src=v;th.style.display='block'}
 else{sel.value=v||'';th.style.display='none'}}}
const sh=()=>{const on=F().includes(preset.value);panel.hidden=!on;if(on)paint()};
setInterval(sh,500);sh();
})();
