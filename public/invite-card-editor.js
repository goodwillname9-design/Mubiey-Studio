/* Owner-only editor panel: "Your invitation card" (optional PDF / PNG / JPG / WebP for every live invitation).
   Guests who scroll to the bottom see "Your invitation card · please take", can open it full screen and download it.
   The file is stored privately and served only through the invitation's own /media/ link.
   Adds a panel before "Save, export & share". Text fields (cardTitle, cardNote, cardButton, cardDownload) use the
   normal `fields` list; the file itself is uploaded right after Save (same direct-upload path as photos). */
'use strict';
(()=>{
const $=s=>document.querySelector(s);
if(typeof fields==='undefined'||typeof markDirty!=='function'||typeof collect!=='function'||typeof save!=='function')return;
const host=$('#save')?.closest('.panel');
if(!host)return;
const MAX=15*1048576,TYPES=['application/pdf','image/png','image/jpeg','image/webp'];
let pending=null,saved=null,removeFlag=false;

const panel=document.createElement('section');panel.className='panel';panel.id='card-panel';
panel.innerHTML=`<h2>Your invitation card <small style="font-weight:400;opacity:.7">(optional)</small></h2>
<p class="help">Upload your printed-style invitation as a PDF or PNG. At the bottom of the live invitation guests see “Your invitation card — please take”, can open it full screen and download it. Works with every template. PNG/JPG shows a full-screen preview; a PDF opens in its own tab. Up to 15 MB.</p>
<div class="actions"><label class="primary" style="cursor:pointer;display:inline-block;padding:10px 16px;border-radius:6px">Choose PDF or PNG<input id="card-file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp" hidden></label><button type="button" id="card-remove" hidden>Remove card</button></div>
<p class="help" id="card-status">No invitation card yet.</p>
<div class="field-grid" id="card-grid"></div>`;
host.before(panel);
const grid=panel.querySelector('#card-grid');
function add(id,label,hint,max){const el=document.createElement('input');el.id=id;el.maxLength=max;el.placeholder=hint;const l=document.createElement('label');l.textContent=label;l.append(el);grid.append(l);el.addEventListener('input',markDirty);fields.push(id)}
add('cardTitle','Heading shown to guests','Your invitation card',80);
add('cardNote','Short line under it','Please take it with our love',200);
add('cardButton','“View” button text','View your card',40);
add('cardDownload','Download button text','Download',40);

const toData=file=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)});
function refresh(){
 const cur=pending?{ref:pending.data,name:pending.name,type:pending.type}:(!removeFlag&&saved?{ref:saved.preview||saved.ref,name:saved.name,type:saved.type}:null);
 window.__mbCardPreview=cur;
 $('#card-remove').hidden=!cur;
 $('#card-status').textContent=pending?`Ready: ${pending.name} — it uploads when you press Save invitation.`:(!removeFlag&&saved?`Saved card: ${saved.name}`:'No invitation card yet.');
}
$('#card-file').onchange=async e=>{
 const f=e.target.files[0];e.target.value='';
 if(!f)return;
 if(!TYPES.includes(f.type)){toast('Choose a PDF, PNG, JPG or WebP file.');return}
 if(f.size>MAX){toast('Keep the card under 15 MB.');return}
 try{pending={file:f,name:f.name.slice(0,100),type:f.type,data:await toData(f)};removeFlag=false;refresh();markDirty()}catch{toast('Could not read that file.')}
};
$('#card-remove').onclick=()=>{if(pending)pending=null;else if(saved)removeFlag=true;refresh();markDirty()};

// the request body is limited to a few KB, so only the "remove" flag travels with the form data
const baseCollect=collect;
collect=function(){const d=baseCollect();if(removeFlag)d.removeCard=true;return d};

const baseSave=save;
save=async function(){
 const d=await baseSave();
 if(removeFlag){removeFlag=false;saved=null}
 if(pending){
  const up=pending;
  const r=await Studio.api('/api/invitations/'+currentId+'/media',{method:'POST',headers:{'Content-Type':up.type,'X-File-Name':encodeURIComponent('card:'+up.name)},body:up.file});
  saved=r.card?{...r.card,preview:up.data}:null;pending=null;
 }else if(d&&d.card)saved={...d.card,preview:saved&&saved.ref===d.card.ref?saved.preview:undefined};
 else if(d&&!d.card)saved=null;
 refresh();
 return d;
};

const baseLoad=load;
load=async function(id){
 await baseLoad(id);
 if(typeof currentId==='undefined'||currentId!==id)return;
 try{
  const d=await Studio.api('/api/invitations/'+id);
  pending=null;removeFlag=false;saved=d.card||null;
  if(saved&&saved.type&&saved.type.startsWith('image/')){try{saved.preview=await toDataURL(saved.ref)}catch{}}
  for(const k of ['cardTitle','cardNote','cardButton','cardDownload']){const el=$('#'+k);if(el)el.value=d[k]||''}
  refresh();preview();
 }catch{}
};
refresh();
})();
