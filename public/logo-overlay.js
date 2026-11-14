/* Mubiey Studio · the owner's LOGO at the top-left of EVERY live invitation design.
   The logo is a small PNG/JPG/WebP data URL saved with the invitation (field `logo`, size `logoSize`).
   Loaded after every renderer: wraps invitationDocument() and adds the logo to whatever design is rendered
   (editor preview, published guest page, downloaded standalone HTML). No logo = design is unchanged. */
'use strict';
(()=>{
if(typeof invitationDocument!=='function')return;
const RE=/^(?:data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+\/]+={0,2}|\/media\/[a-f0-9-]{36}\/[a-f0-9-]{36})$/i;
const H={sm:44,md:64,lg:92};                                   /* max logo height in px */
const css=(h)=>`<style id="mubiey-logo-css">#mubiey-logo{position:fixed;top:calc(env(safe-area-inset-top,0px) + 12px);left:calc(env(safe-area-inset-left,0px) + 12px);z-index:2147483000;display:block;width:auto;height:auto;max-height:${h}px;max-width:${Math.round(h*2.4)}px;object-fit:contain;pointer-events:none;user-select:none;-webkit-user-drag:none;filter:drop-shadow(0 1px 3px rgba(0,0,0,.28))}@media(max-width:480px){#mubiey-logo{top:calc(env(safe-area-inset-top,0px) + 8px);left:calc(env(safe-area-inset-left,0px) + 8px);max-height:${Math.round(h*.8)}px;max-width:${Math.round(h*2)}px}}</style>`;
const base=invitationDocument;
invitationDocument=function(d){
 const html=base.apply(this,arguments);
 try{
  const logo=d&&d.logo;
  if(typeof html!=='string'||typeof logo!=='string'||logo.length>200000||!RE.test(logo))return html;
  const tag=`<img id="mubiey-logo" alt="Logo" src="${logo}" draggable="false">`;
  const style=css(H[d.logoSize]||H.md);
  const pages=String(d.logoPages??'1').split(/[^0-9]+/).map(Number).filter(n=>n>0&&n<=50);
  const pageJs=`<script>(function(){var P=${JSON.stringify(pages)};var img=document.getElementById('mubiey-logo');if(!img)return;var secs=[].slice.call(document.querySelectorAll('section'));function upd(){var mid=innerHeight/2,cur=-1;secs.forEach(function(s,i){var r=s.getBoundingClientRect();if(r.top<=mid&&r.bottom>mid)cur=i});var gate=document.querySelector('.gate:not(.gone)');img.style.display=(!gate&&cur>=0&&P.indexOf(cur+1)>=0)?'':'none'}addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();setTimeout(upd,1200)})();<\/script>`;
  let out=html.replace(/<body\b[^>]*>/i,m=>m+tag);
  if(out===html)return html;                                   /* no <body>: leave the design untouched */
  out=out.replace(/<\/body>/i,pageJs+'</body>');
  const i=out.search(/<\/head>/i);
  return i<0?out.replace(/<body\b[^>]*>/i,m=>style+m):out.slice(0,i)+style+out.slice(i);
 }catch{return html}
};
})();
