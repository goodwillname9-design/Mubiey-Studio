/* Mubiey Studio · ONE Arabic calligraphy font for EVERY invitation design.
   The "Arabic calligraphy font" selector (field `arabicFont`) is saved with each invitation. Only the envelope-story
   designs read it before; Royal Stage, Art Live, Ruby Luxury, Step Up, Fathima & Nizar, Atelier ... kept Amiri.
   This file is loaded LAST (after every renderer) and wraps invitationDocument(): whatever design is rendered,
   every Arabic text block (lang="ar" / dir="rtl" / .bism / .ar / SVG text direction=rtl ...) gets the chosen font.
   The font is embedded as a data: URL, because guest pages and exported files are rendered in a sandboxed iframe
   that cannot load font files from the server. Amiri (default) = no change. */
'use strict';
(()=>{
if(typeof invitationDocument!=='function')return;
const G=globalThis;
const KEYS=['amiri','ruqaa','kufi','nastaliq','lateef','scheherazade','katibeh','mirza','rakkas','lalezar'];
const TALL={nastaliq:2.4,ruqaa:1.9,scheherazade:1.9};              /* fonts whose marks need more line height */
const SEL='[lang="ar"],[dir="rtl"],.bism,.fn-bismillah,.fn-bismillah-backdrop,.ar,.vn-ar,.a7-ar,.w8-ar,.j-ar,.bf-ar,text[direction="rtl"],[data-edit$="Arabic"]';
const norm=k=>KEYS.includes(k)?k:'amiri';
const cache={};let wanted='amiri';
const origin=()=>(typeof location!=='undefined'&&location.origin)||'';

async function load(key){
 key=norm(key);if(key==='amiri'||cache[key]!==undefined)return;
 try{
  const r=await fetch(origin()+'/assets/fonts/ar/'+key+'.ttf');if(!r.ok)throw 0;
  const b=await r.blob();
  cache[key]=await new Promise((res,rej)=>{const f=new FileReader();f.onload=()=>res(f.result);f.onerror=rej;f.readAsDataURL(b)});
 }catch{cache[key]=null}
}
function fontCSS(key,html){
 const k=norm(key);if(k==='amiri')return '';
 const src=cache[k]?`url(${cache[k]})`:`url(${origin()}/assets/fonts/ar/${k}.ttf)`;   /* URL = temporary fallback until the data is loaded */
 const lh=TALL[k]&&!html.includes('--arl:')?`;line-height:${TALL[k]}!important`:'';
 return `<style id="mubiey-arabic-font">@font-face{font-family:MubArabic;font-weight:100 900;src:${src}}${SEL}{font-family:MubArabic,AtelierAmiri,Amiri,'Noto Naskh Arabic','Traditional Arabic',serif!important${lh}}</style>`;
}
function refreshPreview(){try{if(typeof document!=='undefined'&&document.getElementById('preview')&&typeof preview==='function')preview()}catch{}}

const base=invitationDocument;
invitationDocument=function(d){
 const html=base.apply(this,arguments);
 try{
  if(typeof html!=='string')return html;
  const pick=(d&&d.arabicFont&&d.arabicFont!=='amiri')?d.arabicFont:((d&&d.arabicTypography&&d.arabicTypography.font)||(d&&d.arabicFont));
  const k=norm(pick);wanted=k;
  if(k==='amiri')return html;
  if(cache[k]===undefined)load(k).then(refreshPreview);   /* e.g. a saved invitation was just opened */
  const css=fontCSS(k,html),i=html.search(/<\/head>/i);
  return i<0?html:html.slice(0,i)+css+html.slice(i);
 }catch{return html}
};

/* font choice made in the editor (velvet-editor.js) and on the guest page (guest.js) both call this */
const oldLoad=G.vnLoadArabicFont;
G.vnLoadArabicFont=async function(k){wanted=norm(k);await Promise.all([oldLoad?oldLoad.call(this,k):0,load(k)])};
G.mubLoadArabicFont=load;
/* "Download standalone HTML" waits for atelierReady(): make sure the chosen font is embedded */
if(typeof atelierReady==='function'){
 const baseReady=atelierReady;
 atelierReady=async function(){const r=await baseReady.apply(this,arguments);try{const s=document.getElementById('arabicFont');await load((s&&s.value)||wanted)}catch{}return r};
}
})();
if(typeof document!=='undefined'&&document.readyState==='loading'&&document.currentScript)document.write('<script src="/heritage-backgrounds.js"><\/script><script src="/invitation-customization.js"><\/script>');

/* Two selectors pick the calligraphy font: the velvet panel (#arabicFont) and the customization panel
   (#arabic-font-choice). Keep them in step: whichever one the user just changed is copied to the other. */
(()=>{
 if(typeof setInterval!=='function'||typeof document==='undefined')return;
 let last=null;
 setInterval(()=>{
  const a=document.getElementById('arabicFont'),b=document.getElementById('arabic-font-choice');
  if(!a||!b)return;
  const cur=[a.value,b.value];
  if(last){
   if(cur[0]!==last[0]&&cur[0]!==cur[1]){b.value=cur[0];b.dispatchEvent(new Event('change'))}
   else if(cur[1]!==last[1]&&cur[1]!==cur[0]){a.value=cur[1];a.dispatchEvent(new Event('change'))}
  }
  last=[a.value,b.value];
 },400);
})();
