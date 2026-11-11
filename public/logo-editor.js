/* Mubiey Studio · editor control for the top-left logo (see logo-overlay.js).
   Adds an upload / remove / size control under "Your photographs". The logo is kept in hidden field #logo and in
   #logoSize, both pushed into invitations.js's `fields`, so the existing preview / save / open / export code
   stores and restores them with the invitation. Nothing existing is replaced. */
'use strict';
(()=>{
const $=s=>document.querySelector(s);
if(typeof fields==='undefined'||typeof markDirty!=='function')return;
const anchor=$('#galleryMode')?.closest('.field-grid')||$('#photos')?.closest('.panel');
if(!anchor||$('#logo'))return;
const MAX_CHARS=190000;

const box=document.createElement('div');
box.id='logo-box';
box.innerHTML='<h2 style="margin-top:22px">Your logo (top-left corner)</h2>'
 +'<p class="help">Shown at the top-left of your invitation on every design, also on the opening envelope. A PNG with a transparent background looks best. JPG, PNG or WebP.</p>'
 +'<input id="logoFile" type="file" accept="image/png,image/jpeg,image/webp">'
 +'<div id="logoRow" hidden style="display:flex;align-items:center;gap:12px;margin:10px 0"><img id="logoThumb" alt="Logo preview" style="max-height:64px;max-width:160px;object-fit:contain;background:#ffffff14;border:1px solid #80623b;border-radius:6px;padding:6px"><button type="button" id="logoRemove" class="danger">Remove logo</button></div>'
 +'<div class="field-grid"><label>Logo size<select id="logoSize"><option value="">Medium (default)</option><option value="sm">Small</option><option value="lg">Large</option></select></label></div>';
const hidden=document.createElement('input');hidden.type='hidden';hidden.id='logo';box.append(hidden);
anchor.after(box);
fields.push('logo','logoSize');

const row=$('#logoRow'),thumb=$('#logoThumb');
function sync(){const v=hidden.value,ok=/^data:image\//.test(v)||/^\/media\/[a-f0-9-]{36}\/[a-f0-9-]{36}$/i.test(v);thumb.src=ok?v:'';row.hidden=!ok;row.style.display=ok?'flex':'none'}

async function prepare(file){
 if(!/^image\/(png|jpeg|webp)$/.test(file.type))throw Error('Choose a PNG, JPG or WebP logo.');
 if(file.size>10*1024*1024)throw Error('The logo is too large (maximum 10 MB).');
 const url=URL.createObjectURL(file);
 try{
  const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(Error('Could not read this image.'));i.src=url});
  const w0=img.naturalWidth,h0=img.naturalHeight;if(!w0||!h0)throw Error('Could not read this image.');
  const jpeg=file.type==='image/jpeg';
  for(const max of [360,280,210,150,110]){                      /* shrink until it is small enough to save with the invitation */
   const k=Math.min(1,max/Math.max(w0,h0)),w=Math.max(1,Math.round(w0*k)),h=Math.max(1,Math.round(h0*k));
   const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);
   const out=jpeg?c.toDataURL('image/jpeg',.9):c.toDataURL('image/png');
   if(out.length<=MAX_CHARS)return out;
   if(!jpeg){const wp=c.toDataURL('image/webp',.88);if(/^data:image\/webp/.test(wp)&&wp.length<=MAX_CHARS)return wp}
  }
  throw Error('This logo is too detailed. Please use a simpler or smaller image.');
 }finally{URL.revokeObjectURL(url)}
}
$('#logoFile').onchange=async e=>{
 const file=e.target.files[0];e.target.value='';if(!file)return;
 try{hidden.value=await prepare(file);sync();markDirty()}
 catch(err){if(typeof toast==='function')toast(err.message);else alert(err.message)}
};
$('#logoRemove').onclick=()=>{hidden.value='';sync();markDirty()};
$('#logoSize').onchange=markDirty;

/* keep the thumbnail right after an invitation is opened or the preview refreshes */
if(typeof preview==='function'){const b=preview;preview=function(){sync();return b.apply(this,arguments)}}
if(typeof load==='function'){const b=load;load=async function(){const r=await b.apply(this,arguments);sync();return r}}
sync();
})();
