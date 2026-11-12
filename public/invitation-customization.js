'use strict';
(()=>{
const Studio=window.Studio;
const mediaRef=/^\/media\/[a-f0-9-]{36}\/[a-f0-9-]{36}$/i;
const arabicFonts=['amiri','ruqaa','kufi','nastaliq','lateef','scheherazade','katibeh','mirza','rakkas','lalezar'];
const gradients=['','linear-gradient(135deg,#fff8ec,#f3e6c8)','linear-gradient(135deg,#102b27,#31594b)','linear-gradient(135deg,#f8e9e9,#e9c7c9)','linear-gradient(135deg,#101c31,#293c5b)','linear-gradient(135deg,#fff1d5,#e8c486)'];
const backgroundPresets=['islamic-arch-lanterns','watercolor-lantern-florals'];
const templateBackgrounds={'islamic-arch-lanterns':'islamic-arch-lanterns','watercolor-lantern-florals':'watercolor-lantern-florals'};
const backgroundPath=/^\/images\/backgrounds\/[A-Za-z0-9][A-Za-z0-9._/-]*$/;
const isBackgroundPath=value=>backgroundPath.test(value||'')&&!value.includes('//')&&!value.split('/').some(part=>part==='.'||part==='..');
const emptyArabic=()=>({font:'amiri',size:null,weight:null,lineHeight:null,align:null,color:null,customFont:null});
const state={arabic:emptyArabic(),pages:[],pendingFont:null,pendingEnglishFont:null,pendingLogos:new Map(),pendingBackgrounds:new Map(),savedEnglishFont:null,selectedPage:0,saving:false};
const baseDocument=window.invitationDocument;
const el=id=>document.getElementById(id);
const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
const hex=value=>/^#[0-9a-f]{6}$/i.test(value||'')?value:'#000000';
const rgba=(color,alpha)=>{const value=hex(color);return `rgba(${parseInt(value.slice(1,3),16)},${parseInt(value.slice(3,5),16)},${parseInt(value.slice(5,7),16)},${clamp(alpha,0,1)})`};
const safeImage=value=>mediaRef.test(value||'')||isBackgroundPath(value)||/^blob:https?:\/\/[a-z0-9.-]+(?::\d+)?\/[a-z0-9-]+$/i.test(value||'')||/^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/]+=*$/i.test(value||'');
const safeFont=value=>mediaRef.test(value||'')||/^blob:https?:\/\/[a-z0-9.-]+(?::\d+)?\/[a-z0-9-]+$/i.test(value||'')||/^data:font\/(?:woff2|woff|ttf|otf);base64,[a-z0-9+/]+=*$/i.test(value||'');
const previewImage=value=>{
 const local=String(value||'').match(/^local-photo:(\d+)$/);
 if(local){const photo=photos[Number(local[1])];return photo?.preview||photo?.value||''}
 return value;
};
function customizationCSS(data){
 const settings=data.arabicTypography||{};
 const selectors='[lang="ar"],[dir="rtl"],.bism,.fn-bismillah,.fn-bismillah-backdrop,.ar,.vn-ar,.a7-ar,.w8-ar,.j-ar,.bf-ar,text[direction="rtl"],[data-edit$="Arabic"]';
 let css='';
 const custom=settings.customFont?.url;
 if(safeFont(custom))css+=`@font-face{font-family:MubArabicCustom;src:url("${custom}") format("${({woff2:'woff2',woff:'woff',otf:'opentype',ttf:'truetype'})[settings.customFont.format]||'woff2'}");font-display:swap;font-weight:100 900}`;
 const declarations=[];
 if(settings.font==='custom'&&safeFont(custom))declarations.push('font-family:MubArabicCustom,serif!important');
 if(Number.isFinite(Number(settings.size))&&Number(settings.size)>=10&&Number(settings.size)<=72)declarations.push(`font-size:${Number(settings.size)}px!important`);
 if(Number.isFinite(Number(settings.weight))&&Number(settings.weight)>=300&&Number(settings.weight)<=900)declarations.push(`font-weight:${Number(settings.weight)}!important`);
 if(Number.isFinite(Number(settings.lineHeight))&&Number(settings.lineHeight)>=1&&Number(settings.lineHeight)<=3)declarations.push(`line-height:${Number(settings.lineHeight)}!important`);
 if(['left','center','right','justify'].includes(settings.align))declarations.push(`text-align:${settings.align}!important`);
 if(/^#[0-9a-f]{6}$/i.test(settings.color||''))declarations.push(`color:${settings.color}!important`);
 if(declarations.length)css+=`${selectors}{${declarations.join(';')};direction:rtl!important;unicode-bidi:plaintext;text-rendering:optimizeLegibility;font-kerning:normal;font-feature-settings:"ccmp","mark","mkmk","rlig","calt"}`;
 const pages=Array.isArray(data.pageBackgrounds)?data.pageBackgrounds:[];
 const sectionCount=(baseDocument(data).match(/<section\b/gi)||[]).length;
 const count=Math.max(pages.length,sectionCount);
 Array.from({length:count},(_,index)=>index).forEach(index=>{
  const page=pages[index]&&typeof pages[index]==='object'?pages[index]:{};
  const resolvedImage=previewImage(page.image),image=safeImage(resolvedImage)?resolvedImage:'';
  const solid=hex(page.color);
  const preset=page.preset==='none'?'':backgroundPresets.includes(page.preset)?page.preset:templateBackgrounds[data.template]||'';
  const presetImage=!image&&preset?window.MubieyHeritageBackgrounds?.image(preset):'';
  if(!Object.keys(page).length&&!presetImage)return;
  const layers=[];
  if(image){
   layers.push(`linear-gradient(${rgba(solid,1-clamp(page.imageOpacity??1,0,1))},${rgba(solid,1-clamp(page.imageOpacity??1,0,1))})`);
   if(Number(page.overlayOpacity)>0)layers.push(`linear-gradient(${rgba(page.overlayColor,clamp(page.overlayOpacity,0,1))},${rgba(page.overlayColor,clamp(page.overlayOpacity,0,1))})`);
   layers.push(`url("${image}")`);
  }
  if(page.gradient&&gradients.includes(page.gradient))layers.unshift(page.gradient);
  const declarations=[`background-color:${solid}`];
  if(layers.length)declarations.push(`--mubiey-page-background:${layers.join(',')}`);
  else if(presetImage)declarations.push(`--mubiey-page-background:url("${presetImage}")`);
  else if(page.gradient&&gradients.includes(page.gradient))declarations.push(`--mubiey-page-background:${page.gradient}`);
  if(image){
   if(page.size==='contain'||page.size==='custom')declarations.push(`background-size:${page.size==='custom'?`${clamp(page.customSize||100,25,300)}% auto`:'contain'}`);
   if(Number(page.x??50)!==50||Number(page.y??50)!==50)declarations.push(`background-position:${clamp(page.x??50,0,100)}% ${clamp(page.y??50,0,100)}%`);
  }
  css+=`.invitation-page.page${index+1}{${declarations.join(';')}}`;
 });
 return css;
}
window.invitationDocument=function(data){
 let html=baseDocument.apply(this,arguments);
 if(typeof html!=='string')return html;
 let page=0;
 html=html.replace(/<section\b[^>]*>/gi,tag=>{
  const index=page++;
  const background=data?.pageBackgrounds?.[index];
  const preset=background?.preset==='none'?'':backgroundPresets.includes(background?.preset)?background.preset:templateBackgrounds[data?.template]||'';
  const backgroundClass=preset==='islamic-arch-lanterns'?'mubiey-bg-islamic-arch':preset==='watercolor-lantern-florals'?'mubiey-bg-watercolor-lanterns':'';
  const pageClass=`invitation-page page${index+1}${backgroundClass&&!background?.image?` ${backgroundClass}`:''}`;
  const classAttribute=/\sclass=(["'])(.*?)\1/i;
  if(classAttribute.test(tag))return tag.replace(classAttribute,(_match,quote,value)=>` class=${quote}${value} ${pageClass}${quote}`);
  return tag.replace(/>$/,` class="${pageClass}">`);
 });
 const css=customizationCSS(data||{});
 const backgroundStylesheet='<link rel="stylesheet" href="/invitation-backgrounds.css">';
 const style=css?`<style id="mubiey-invitation-customization">${css}</style>`:'';
 const head=html.search(/<\/head>/i);
 return head<0?html:html.slice(0,head)+backgroundStylesheet+style+html.slice(head);
};

function currentData(){try{return typeof collect==='function'?collect():{}}catch{return{}}}
function pageCount(){
 try{return Math.max(1,(baseDocument(currentData()).match(/<section\b/gi)||[]).length)}catch{return Math.max(1,state.pages.length)}
}
function pageAt(index){return state.pages[index]||(state.pages[index]={})}
function mark(){if(typeof markDirty==='function')markDirty()}
function readPageControls(){
 const page=pageAt(state.selectedPage);
 page.size=el('page-bg-size').value;
 page.x=Number(el('page-bg-x').value);
 page.y=Number(el('page-bg-y').value);
 page.customSize=Number(el('page-bg-custom-size').value);
 page.imageOpacity=Number(el('page-bg-image-opacity').value);
 page.overlayColor=el('page-bg-overlay-color').value;
 page.overlayOpacity=Number(el('page-bg-overlay-opacity').value);
 page.color=el('page-bg-color').value;
 page.gradient=el('page-bg-gradient').value;
 page.preset=el('page-bg-preset').value;
}
function renderGalleryOptions(){
 const select=el('page-bg-image');
 if(!select)return;
 const selected=pageAt(state.selectedPage).image||'';
 select.replaceChildren(new Option('No image',''),...photos.map((photo,index)=>new Option(`Photo ${index+1}`,mediaRef.test(photo.value)?photo.value:`local-photo:${index}`)));
 select.value=selected;
 if(select.value!==selected)select.value='';
}
function renderPageControls(){
 if(!el('page-bg-page'))return;
 const count=pageCount();
 const select=el('page-bg-page');
 const previous=state.selectedPage;
 select.replaceChildren(...Array.from({length:count},(_,index)=>new Option(`Page ${index+1}`,String(index))));
 state.selectedPage=Math.min(previous,count-1);
 select.value=String(state.selectedPage);
 const page=pageAt(state.selectedPage);
 const pending=state.pendingBackgrounds.get(state.selectedPage);
 el('page-bg-image').value=pending?.url||page.image||'';
 el('page-bg-path').value=isBackgroundPath(page.image)?page.image:'';
 el('page-bg-size').value=page.size||'cover';
 el('page-bg-x').value=String(page.x??50);
 el('page-bg-y').value=String(page.y??50);
 el('page-bg-custom-size').value=String(page.customSize??100);
 el('page-bg-image-opacity').value=String(page.imageOpacity??1);
 el('page-bg-overlay-color').value=page.overlayColor||'#000000';
 el('page-bg-overlay-opacity').value=String(page.overlayOpacity??0);
 el('page-bg-color').value=page.color||'#ffffff';
 el('page-bg-gradient').value=page.gradient||'';
 el('page-bg-preset').value=page.preset||'';
 el('page-bg-status').textContent=pending?`Ready to upload: ${pending.file.name}`:page.image?'Using a saved invitation photo.':'No page background image selected.';
 el('page-bg-x-value').textContent=`${el('page-bg-x').value}%`;
 el('page-bg-y-value').textContent=`${el('page-bg-y').value}%`;
 el('page-bg-opacity-value').textContent=`${Math.round(Number(el('page-bg-image-opacity').value)*100)}%`;
 el('page-bg-overlay-value').textContent=`${Math.round(Number(el('page-bg-overlay-opacity').value)*100)}%`;
 renderGalleryOptions();
}
function renderArabicControls(){
 if(!el('arabic-font-choice'))return;
 const arabic=state.arabic;
 el('arabic-font-choice').value=arabic.font||'amiri';
 el('arabic-font-size').value=String(arabic.size??28);
 el('arabic-font-weight').value=String(arabic.weight??400);
 el('arabic-line-height').value=String(arabic.lineHeight??1.8);
 el('arabic-align').value=arabic.align||'center';
 el('arabic-color').value=arabic.color||'#2a2721';
 el('arabic-font-status').textContent=state.pendingFont?`Ready to upload: ${state.pendingFont.file.name}`:arabic.customFont?.name?`Saved custom font: ${arabic.customFont.name}`:'Built-in Arabic font selected.';
}
function setArabic(key,value){state.arabic[key]=value;mark()}
function uploadMime(file,extension){
 const types={woff2:'font/woff2',woff:'font/woff',ttf:'font/ttf',otf:'font/otf'};
 return types[extension]||file.type;
}
function fontDataURL(file,extension){
 return new Promise((resolve,reject)=>{
  const reader=new FileReader();
  reader.onload=()=>typeof reader.result==='string'?resolve(reader.result.replace(/^data:[^;,]+;base64,/i,`data:${uploadMime(file,extension)};base64,`)):reject(Error('Could not read the selected Arabic font.'));
  reader.onerror=()=>reject(reader.error||Error('Could not read the selected Arabic font.'));
  reader.readAsDataURL(file);
 });
}
function addPanels(){
 if(!el('photos')||!el('save')||!document.querySelector('.work-layout'))return;
 const photosPanel=el('photos').closest('.panel');
 if(!photosPanel||el('arabic-typography-panel'))return;
 const arabic=document.createElement('section');
 arabic.className='panel';
 arabic.id='arabic-typography-panel';
 arabic.innerHTML=`<h2>Arabic Typography</h2><p class="help">Choose a calligraphy style and tune Arabic text independently. RTL shaping and diacritics remain enabled.</p><div class="field-grid"><label>Arabic font<select id="arabic-font-choice">${arabicFonts.map(font=>`<option value="${font}">${font.charAt(0).toUpperCase()+font.slice(1)}</option>`).join('')}<option value="custom">Uploaded custom font</option></select></label><label class="wide">Upload Arabic font (.woff2, .woff, .ttf, .otf)<input id="arabic-font-file" type="file" accept=".woff2,.woff,.ttf,.otf,font/woff2,font/woff,font/ttf,font/otf"></label><p class="help wide" id="arabic-font-status" aria-live="polite"></p><label>Font size<div class="field-grid"><button type="button" id="arabic-font-decrease" aria-label="Decrease Arabic font size">−</button><input id="arabic-font-size" type="number" min="10" max="72" step="1" value="28"><button type="button" id="arabic-font-increase" aria-label="Increase Arabic font size">+</button></div></label><label>Font weight<select id="arabic-font-weight"><option value="300">Light</option><option value="400">Regular</option><option value="500">Medium</option><option value="600">Semi-bold</option><option value="700">Bold</option><option value="800">Extra-bold</option><option value="900">Black</option></select></label><label>Line height<input id="arabic-line-height" type="number" min="1" max="3" step="0.1" value="1.8"></label><label>Text alignment<select id="arabic-align"><option value="right">Right</option><option value="center">Center</option><option value="left">Left</option><option value="justify">Justify</option></select></label><label>Text color<input id="arabic-color" type="color" value="#2a2721"></label></div>`;
 const backgrounds=document.createElement('section');
 backgrounds.className='panel';
 backgrounds.id='page-backgrounds-panel';
 backgrounds.innerHTML=`<h2>Page Backgrounds</h2><p class="help">Customize each rendered invitation page independently. Upload an image, choose an invitation photo, enter an image path from /images/backgrounds/, or select a lantern design.</p><div class="field-grid"><label>Invitation page<select id="page-bg-page"></select></label><label>Background design<select id="page-bg-preset"><option value="">Use template background</option><option value="none">No decorative background</option><option value="islamic-arch-lanterns">Islamic arch + lanterns</option><option value="watercolor-lantern-florals">Watercolor lantern florals</option></select></label><label>Choose from invitation photos<select id="page-bg-image"><option value="">No image</option></select></label><label class="wide">Background image path<input id="page-bg-path" type="text" inputmode="url" autocomplete="off" placeholder="/images/backgrounds/your-image.jpg"></label><label class="wide">Upload a page background (JPG, PNG, WebP)<input id="page-bg-file" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"></label><p id="page-bg-status" class="help wide" aria-live="polite"></p><label>Image sizing<select id="page-bg-size"><option value="cover">Cover</option><option value="contain">Contain</option><option value="custom">Custom</option></select></label><label>Custom image width (%)<input id="page-bg-custom-size" type="number" min="25" max="300" step="1" value="100"></label><label>Horizontal position <span id="page-bg-x-value">50%</span><input id="page-bg-x" type="range" min="0" max="100" value="50"></label><label>Vertical position <span id="page-bg-y-value">50%</span><input id="page-bg-y" type="range" min="0" max="100" value="50"></label><label>Image opacity <span id="page-bg-opacity-value">100%</span><input id="page-bg-image-opacity" type="range" min="0" max="1" step="0.05" value="1"></label><label>Overlay color<input id="page-bg-overlay-color" type="color" value="#000000"></label><label>Overlay opacity <span id="page-bg-overlay-value">0%</span><input id="page-bg-overlay-opacity" type="range" min="0" max="1" step="0.05" value="0"></label><label>Solid background color<input id="page-bg-color" type="color" value="#ffffff"></label><label>Optional gradient<select id="page-bg-gradient">${gradients.map((gradient,index)=>`<option value="${gradient}">${['None','Ivory gold','Garden emerald','Blush rose','Midnight blue','Saffron'][index]}</option>`).join('')}</select></label><div class="actions wide"><button type="button" id="page-bg-reset" class="quiet">Reset this page</button></div></div>`;
 photosPanel.after(arabic,backgrounds);
 el('arabic-font-choice').addEventListener('change',()=>setArabic('font',el('arabic-font-choice').value));
 el('arabic-font-size').addEventListener('input',()=>{const value=clamp(el('arabic-font-size').value,10,72);el('arabic-font-size').value=String(value);setArabic('size',value)});
 el('arabic-font-decrease').onclick=()=>{el('arabic-font-size').value=String(clamp(Number(el('arabic-font-size').value)-1,10,72));el('arabic-font-size').dispatchEvent(new Event('input',{bubbles:true}))};
 el('arabic-font-increase').onclick=()=>{el('arabic-font-size').value=String(clamp(Number(el('arabic-font-size').value)+1,10,72));el('arabic-font-size').dispatchEvent(new Event('input',{bubbles:true}))};
 el('arabic-font-weight').addEventListener('change',()=>setArabic('weight',Number(el('arabic-font-weight').value)));
 el('arabic-line-height').addEventListener('input',()=>setArabic('lineHeight',clamp(el('arabic-line-height').value,1,3)));
 el('arabic-align').addEventListener('change',()=>setArabic('align',el('arabic-align').value));
 el('arabic-color').addEventListener('input',()=>setArabic('color',hex(el('arabic-color').value)));
 el('arabic-font-file').addEventListener('change',async()=>{
  const file=el('arabic-font-file').files?.[0];if(!file)return;
  const extension=(file.name.split('.').pop()||'').toLowerCase();
  if(!['woff2','woff','ttf','otf'].includes(extension)){toast('Choose a WOFF2, WOFF, TTF or OTF font file.');return}
  if(file.size===0||file.size>8*1048576){toast('Arabic font files must be smaller than 8 MB.');return}
  const pending={file,extension};
  state.pendingFont=pending;
  state.arabic.font='custom';
  state.arabic.customFont={name:file.name,format:extension,url:'',pending:true};
  renderArabicControls();
  try{
   const url=await fontDataURL(file,extension);
   if(state.pendingFont!==pending)return;
   state.arabic.customFont.url=url;
   renderArabicControls();mark();
  }catch(error){
   if(state.pendingFont===pending){state.pendingFont=null;state.arabic.font='amiri';state.arabic.customFont=null;renderArabicControls()}
   toast(error.message||'Could not preview the selected Arabic font.');
  }
 });
 el('page-bg-page').addEventListener('change',()=>{readPageControls();state.selectedPage=Number(el('page-bg-page').value);renderPageControls()});
 el('page-bg-image').addEventListener('change',()=>{const pending=state.pendingBackgrounds.get(state.selectedPage);if(pending?.url)URL.revokeObjectURL(pending.url);state.pendingBackgrounds.delete(state.selectedPage);pageAt(state.selectedPage).image=el('page-bg-image').value;renderPageControls();mark()});
 el('page-bg-path').addEventListener('change',()=>{
  const image=el('page-bg-path').value.trim();
  if(image&&!isBackgroundPath(image)){toast('Use an image path under /images/backgrounds/ without spaces or parent-folder segments.');renderPageControls();return}
  const pending=state.pendingBackgrounds.get(state.selectedPage);if(pending?.url)URL.revokeObjectURL(pending.url);
  state.pendingBackgrounds.delete(state.selectedPage);pageAt(state.selectedPage).image=image;renderPageControls();mark();
 });
 el('page-bg-preset').addEventListener('change',()=>{pageAt(state.selectedPage).preset=el('page-bg-preset').value;renderPageControls();mark()});
 el('page-bg-file').addEventListener('change',()=>{
  const file=el('page-bg-file').files?.[0];if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size===0||file.size>15*1048576){toast('Choose a JPG, PNG or WebP image smaller than 15 MB.');el('page-bg-file').value='';return}
  if(photos.length+state.pendingBackgrounds.size>=20){toast('Up to twenty invitation photos and backgrounds can be stored together.');el('page-bg-file').value='';return}
  const old=state.pendingBackgrounds.get(state.selectedPage);if(old?.url)URL.revokeObjectURL(old.url);
  const pending={file,url:URL.createObjectURL(file)};
  state.pendingBackgrounds.set(state.selectedPage,pending);
  pageAt(state.selectedPage).image=pending.url;
  renderPageControls();mark();el('page-bg-file').value='';
 });
 for(const id of ['page-bg-size','page-bg-x','page-bg-y','page-bg-custom-size','page-bg-image-opacity','page-bg-overlay-color','page-bg-overlay-opacity','page-bg-color','page-bg-gradient']){
  el(id).addEventListener('input',()=>{readPageControls();renderPageControls();mark()});
  el(id).addEventListener('change',()=>{readPageControls();renderPageControls();mark()});
 }
 el('page-bg-reset').onclick=()=>{
  const pending=state.pendingBackgrounds.get(state.selectedPage);if(pending?.url)URL.revokeObjectURL(pending.url);
  state.pendingBackgrounds.delete(state.selectedPage);state.pages[state.selectedPage]={};
  renderPageControls();mark();
 };
 renderArabicControls();renderPageControls();
}

const originalApi=Studio?.api?.bind(Studio);
if(originalApi)Studio.api=async function(path,options={}){
 const result=await originalApi(path,options);
 if(options.method!=='GET'&&options.method!=='HEAD'&&/^\/api\/invitations\/[a-f0-9-]{36}$/i.test(path)){
  if(Array.isArray(result.photos))renderGalleryOptions();
 }
 if(options.method!=='POST'&&options.method!=='PUT'&&/^\/api\/invitations\/[a-f0-9-]{36}$/.test(path)&&result?.id){
  state.arabic={...emptyArabic(),...(result.arabicTypography||{}),font:result.arabicTypography?.font||result.arabicFont||'amiri'};
  state.pages=Array.isArray(result.pageBackgrounds)?result.pageBackgrounds.map(page=>({...page})): [];
  state.savedEnglishFont=result.customFont?.url?result.customFont:null;
  renderArabicControls();renderPageControls();
 }
 return result;
};

function installEditor(){
 addPanels();
 const originalCollect=window.collect;
 if(typeof originalCollect==='function')window.collect=function(){
  const data=originalCollect.apply(this,arguments);
  if(state.saving){
   for(const key of ['logo','openLogo'])if(typeof data[key]==='string'&&data[key].startsWith('data:image/')){state.pendingLogos.set(key,data[key]);data[key]=''}
   if(data.customFont?.data){state.pendingEnglishFont=data.customFont;data.customFont=null}
  }
  if(!data.customFont&&state.savedEnglishFont)data.customFont=state.savedEnglishFont;
  const arabic={...state.arabic};
  if(state.saving&&state.pendingFont)arabic.customFont=null;
  const velvetFont=document.getElementById('arabicFont')?.value;
  if(velvetFont&&velvetFont!=='amiri'&&arabic.font!=='custom')arabic.font=velvetFont;   /* the "Arabic calligraphy font" choice on the invitation wins */
  data.arabicTypography=arabic;
  data.arabicFont=arabic.font==='custom'?(state.arabic.customFont?.fallback||'amiri'):arabic.font;
  data.pageBackgrounds=state.pages.map((page,index)=>{
   const copy={...(page||{})};
   if(state.saving&&(state.pendingBackgrounds.has(index)||/^local-photo:/.test(copy.image||'')||String(copy.image||'').startsWith('data:')))copy.image='';
   return copy;
  });
  return data;
 };
 const originalPreview=window.preview;
 if(typeof originalPreview==='function')window.preview=function(){
  const result=originalPreview.apply(this,arguments);
  setTimeout(renderPageControls,300);
  return result;
 };
 const originalMediaUI=window.mediaUI;
 if(typeof originalMediaUI==='function')window.mediaUI=function(){
  const result=originalMediaUI.apply(this,arguments);renderGalleryOptions();return result;
 };
 const originalSetBusy=window.setBusy;
 if(typeof originalSetBusy==='function')window.setBusy=function(on){
  const result=originalSetBusy.apply(this,arguments);
  document.querySelectorAll('#arabic-typography-panel input,#arabic-typography-panel select,#page-backgrounds-panel input,#page-backgrounds-panel select,#page-backgrounds-panel button').forEach(control=>{control.disabled=!!on});
  return result;
 };
 const originalLoad=window.load;
 if(typeof originalLoad==='function')window.load=async function(){
 const result=await originalLoad.apply(this,arguments);
 if(state.savedEnglishFont){window.__customFont=state.savedEnglishFont;el('font').value='custom';const status=el('custom-font-status');if(status)status.textContent='Saved custom font: '+(state.savedEnglishFont.name||'uploaded font');if(typeof preview==='function')preview()}
 return result;
 };
 const originalSave=window.save;
 if(typeof originalSave!=='function')return;
 window.save=async function(){
 state.saving=true;
 let result;
 try{
  result=await originalSave.apply(this,arguments);
  if((state.pendingFont||state.pendingEnglishFont||state.pendingLogos.size||state.pendingBackgrounds.size)&&!currentId)throw Error('Save the invitation before uploading its custom assets.');
  let uploaded=false;
  for(const page of state.pages){
   const local=String(page?.image||'').match(/^local-photo:(\d+)$/);
   if(local){const photo=photos[Number(local[1])];if(photo?.value?.startsWith('/media/')){page.image=photo.value;uploaded=true}}
  }
  if(state.pendingFont){
   const pending=state.pendingFont;
   el('arabic-font-status').textContent='Uploading Arabic font…';
   const name=encodeURIComponent(`arabic-font:${pending.file.name}`);
   const uploadedFont=await Studio.api(`/api/invitations/${currentId}/media`,{method:'POST',headers:{'Content-Type':uploadMime(pending.file,pending.extension),'X-File-Name':name},body:pending.file});
   state.arabic.customFont={name:pending.file.name,format:pending.extension,url:uploadedFont.url};
   state.arabic.font='custom';state.pendingFont=null;uploaded=true;renderArabicControls();
  }
  if(state.pendingEnglishFont){
   const pending=state.pendingEnglishFont;
   el('custom-font-status').textContent='Uploading custom font…';
   const blob=await(await fetch(pending.data)).blob();
   const saved=await Studio.api(`/api/invitations/${currentId}/media`,{method:'POST',headers:{'Content-Type':blob.type,'X-File-Name':encodeURIComponent(`english-font:${pending.name}`)},body:blob});
   state.savedEnglishFont={name:pending.name,format:pending.format,url:saved.url};
   window.__customFont=state.savedEnglishFont;state.pendingEnglishFont=null;uploaded=true;
  }
  for(const [field,dataURL] of [...state.pendingLogos.entries()]){
   el('save-status').textContent='Uploading invitation logo…';
   const blob=await(await fetch(dataURL)).blob(),asset=field==='openLogo'?'open-logo':'logo';
   const saved=await Studio.api(`/api/invitations/${currentId}/media`,{method:'POST',headers:{'Content-Type':blob.type,'X-File-Name':encodeURIComponent(`${asset}:invitation-mark`)},body:blob});
   if(el(field))el(field).value=saved.url;
   state.pendingLogos.delete(field);uploaded=true;
  }
  for(const [index,pending] of [...state.pendingBackgrounds.entries()]){
   el('page-bg-status').textContent=`Uploading page ${index+1} background…`;
   const uploadedPhoto=await Studio.api(`/api/invitations/${currentId}/media`,{method:'POST',headers:{'Content-Type':pending.file.type,'X-File-Name':encodeURIComponent(`page-background:${pending.file.name}`)},body:pending.file});
   const ref=uploadedPhoto.photos?.at(-1);
   if(!mediaRef.test(ref||''))throw Error('Background upload completed without a usable invitation reference.');
   pageAt(index).image=ref;state.pendingBackgrounds.delete(index);URL.revokeObjectURL(pending.url);
   if(!photos.some(photo=>photo.value===ref))photos.push({value:ref,preview:await Studio.dataURL(ref,1200)});
   uploaded=true;
  }
  if(uploaded){mediaUI();state.saving=true;result=await originalSave.apply(this,arguments)}
  renderArabicControls();renderPageControls();
  return result;
 }catch(error){if(typeof dirty!=='undefined')dirty=true;throw error}
 finally{state.saving=false}
 };
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installEditor,{once:true});else installEditor();
})();
