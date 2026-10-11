/* Owner-only editor additions for "Heavy Luxury" (envelope scroll story). Adds controls only; nothing existing is replaced.
   New text fields are pushed into invitations.js's `fields` list, so existing save/load/preview stores them. */
'use strict';
(()=>{
const $=s=>document.querySelector(s);
const VELVET='heavy-luxury';
const preset=$('#live-preset');
if(!preset||typeof fields==='undefined'||typeof markDirty!=='function')return;
const grid=preset.closest('.field-grid');
if(!grid)return;

const ensureTemplate=()=>{if(![...preset.options].some(o=>o.value===VELVET)){const o=new Option('Heavy Luxury · Envelope scroll story (scratch date)',VELVET);o.dataset.layout='0';preset.add(o)}};
ensureTemplate();
new MutationObserver(ensureTemplate).observe(preset,{childList:true});

function add(id,label,tag,hint,rtl){
 if($('#'+id))return;
 const el=document.createElement(tag==='area'?'textarea':'input');
 el.id=id;el.maxLength=tag==='area'?500:300;if(tag==='area')el.rows=2;if(hint)el.placeholder=hint;if(rtl){el.dir='rtl';el.lang='ar'}
 const l=document.createElement('label');l.textContent=label;l.append(el);grid.append(l);el.oninput=markDirty;fields.push(id);
}
add('monogram','Monogram on the envelope seal (up to 3 letters)','input','e.g. AF');
add('parents1','Name 1 · parents line (e.g. S/O Mr. & Mrs. …)','input','S/O Mr. … & Mrs. …');
add('parents2','Name 2 · parents line (e.g. D/O Mr. & Mrs. …)','input','D/O Mr. … & Mrs. …');
add('timeText','Time shown (e.g. 7 p.m. to 10 p.m.)','input','Leave empty to show the start time');
add('compliments','Bottom line (with best compliments from…)','input','With best compliments from our family');
add('verseArabic','Page 1 · Arabic line','input','Leave empty for the default',true);
add('verse','Page 1 · English line','input','And we created you in pairs');
add('blessingArabic','Page 2 · Arabic blessing','area','Leave empty for the default dua',true);
add('blessing','Page 2 · English blessing','area','May Allah bless you both…');
add('rsvpText','Final page · RSVP wording','area','R.S.V.P\nAll family members, relatives and friends');

const holder=document.createElement('div');holder.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin-top:10px';
const tryBtn=document.createElement('button');tryBtn.type='button';tryBtn.className='primary';tryBtn.textContent='Try Heavy Luxury';
tryBtn.onclick=()=>{ensureTemplate();preset.value=VELVET;if($('#animation'))$('#animation').checked=true;if($('#music-autoplay'))$('#music-autoplay').checked=true;markDirty()};
const previewBtn=document.createElement('button');previewBtn.type='button';previewBtn.textContent='Preview envelope opening';
previewBtn.onclick=async()=>{
 try{
  const d=collect();d.template=VELVET;d.animation=true;d._editorPreview=false;if(d.openingStyle==='none')d.openingStyle='seal';
  d.photos=photos.map(p=>p.preview||p.value);d.music=music?.preview||music?.value||null;
  if(typeof atelierFontsReady==='function')await atelierFontsReady().catch(()=>{});
  const dialog=document.createElement('dialog');
  dialog.style.cssText='position:fixed;inset:0;width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:#000';
  const frame=document.createElement('iframe');frame.title='Guest preview';frame.setAttribute('sandbox','allow-scripts allow-popups allow-popups-to-escape-sandbox');frame.style.cssText='border:0;width:100%;height:100%';frame.srcdoc=invitationDocument(d);
  const close=document.createElement('button');close.type='button';close.textContent='Close preview';close.style.cssText='position:absolute;right:14px;top:14px;z-index:2;padding:12px 18px;cursor:pointer';
  close.onclick=()=>{dialog.close();dialog.remove()};dialog.addEventListener('cancel',()=>dialog.remove());
  dialog.append(frame,close);document.body.append(dialog);dialog.showModal();
 }catch{const t=$('#toast');if(t){t.textContent='Could not open the preview. Please try again.';t.classList.add('show')}}
};
holder.append(tryBtn,previewBtn);grid.append(holder);
})();
