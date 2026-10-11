/* Owner-only editor additions for the Royal Red & Gold template and velvet-curtain opening.
   Runs after atelier-editor.js. It only adds controls; nothing existing is removed or replaced.
   New fields are pushed into invitations.js's `fields` list, so the existing save/load/preview
   code stores them with the invitation. */
'use strict';
(()=>{
const $=s=>document.querySelector(s);
const ROYAL='royal-red-gold';
const preset=$('#live-preset');
if(!preset||typeof fields==='undefined'||typeof markDirty!=='function')return;
const grid=preset.closest('.field-grid');
if(!grid)return;

// 1. Template option (appended, so the existing default selection is unchanged)
const ensureTemplate=()=>{if(![...preset.options].some(o=>o.value===ROYAL)){const o=new Option('Royal Red & Gold · Velvet curtains',ROYAL);o.dataset.layout='0';preset.add(o)}};
ensureTemplate();
new MutationObserver(ensureTemplate).observe(preset,{childList:true});

// 2. Curtain opening choice
const opening=$('#opening-style');
if(opening&&![...opening.options].some(o=>o.value==='curtain'))opening.add(new Option('Royal velvet curtains · Opens with music','curtain'));

// 3. New text fields (family details, RSVP link)
function field(label,el){const l=document.createElement('label');l.textContent=label;l.append(el);grid.append(l);el.oninput=markDirty;return el}
if(!$('#family')){const t=document.createElement('textarea');t.id='family';t.maxLength=1500;t.rows=4;t.placeholder='Son of Mr. & Mrs. …\nDaughter of Mr. & Mrs. …';field('Family details',t);fields.push('family')}
if(!$('#rsvpUrl')){const i=document.createElement('input');i.id='rsvpUrl';i.type='url';i.maxLength=500;i.placeholder='https://wa.me/965XXXXXXXX (WhatsApp or any https link)';field('RSVP link (optional)',i);fields.push('rsvpUrl')}

// 4. One-tap setup, same pattern as "Try Royal Locket"
const tryRoyal=document.createElement('button');
tryRoyal.type='button';tryRoyal.className='primary';tryRoyal.textContent='Try Royal Red & Gold';
tryRoyal.onclick=()=>{ensureTemplate();preset.value=ROYAL;if($('#font'))$('#font').value='allura';if($('#animation'))$('#animation').checked=true;if(opening)opening.value='curtain';if($('#music-autoplay'))$('#music-autoplay').checked=true;markDirty()};
(opening?.closest('label')||grid).append(tryRoyal);

// 5. Full-screen preview of the real guest opening (the editing preview stays open on purpose)
const previewBtn=document.createElement('button');
previewBtn.type='button';previewBtn.textContent='Preview curtain opening';
previewBtn.onclick=async()=>{
 try{
  const d=collect();
  d.openingStyle='curtain';d.animation=true;d._editorPreview=false;
  d.photos=photos.map(p=>p.preview||p.value);
  d.music=music?.preview||music?.value||null;
  if(typeof atelierFontsReady==='function')await atelierFontsReady().catch(()=>{});
  const dialog=document.createElement('dialog');
  dialog.style.cssText='position:fixed;inset:0;width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:#000';
  const frame=document.createElement('iframe');
  frame.title='Guest preview';frame.setAttribute('sandbox','allow-scripts allow-popups allow-popups-to-escape-sandbox');
  frame.style.cssText='border:0;width:100%;height:100%';frame.srcdoc=invitationDocument(d);
  const close=document.createElement('button');
  close.type='button';close.textContent='Close preview';
  close.style.cssText='position:absolute;right:14px;bottom:14px;z-index:2;padding:12px 18px;cursor:pointer';
  close.onclick=()=>{dialog.close();dialog.remove()};
  dialog.addEventListener('cancel',()=>dialog.remove());
  dialog.append(frame,close);document.body.append(dialog);dialog.showModal();
 }catch(err){const t=$('#toast');if(t){t.textContent='Could not open the preview. Please try again.';t.classList.add('show')}}
};
(opening?.closest('label')||grid).append(previewBtn);
})();
