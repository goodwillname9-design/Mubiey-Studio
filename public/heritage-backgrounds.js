'use strict';
(()=>{
 if(typeof invitationDocument!=='function')return;
 const PRESETS={
  'islamic-arch-lanterns':{
   background:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200"><defs><linearGradient id="p" x2="0" y2="1"><stop stop-color="#fffdf5"/><stop offset="1" stop-color="#f2e7d2"/></linearGradient><linearGradient id="g" x2="1" y2="1"><stop stop-color="#b68b49"/><stop offset=".5" stop-color="#ead18d"/><stop offset="1" stop-color="#9f773d"/></linearGradient></defs><path fill="url(#p)" d="M0 0h900v1200H0z"/><path d="M125 1200V475a325 325 0 0 1 650 0v725" fill="none" stroke="url(#g)" stroke-width="8"/><path d="M160 1200V475a290 290 0 0 1 580 0v725" fill="none" stroke="#c8aa70" stroke-width="2" opacity=".58"/><path d="M450 174v112m-33-2h66l22 36-55 85-55-85z" fill="#ead7a4" stroke="#9e783d" stroke-width="4"/><path d="M450 174v-40m-23 184h46m-77-2h108" fill="none" stroke="#9e783d" stroke-width="4"/><g fill="#c6a567" opacity=".6"><circle cx="450" cy="393" r="7"/><circle cx="205" cy="560" r="6"/><circle cx="695" cy="560" r="6"/><path d="m450 438 12 20-12 20-12-20zm-241 130 11 18-11 18-11-18zm482 0 11 18-11 18-11-18z"/></g><path d="M0 1100q220-90 450 0t450 0v100H0z" fill="#e2d3b8" opacity=".25"/></svg>',
   lanterns:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500"><g fill="none" stroke="#9d743b" stroke-width="4"><path d="M135 0v148m630-148v148"/><path d="M111 148h48l13 25-37 62-37-62zM741 148h48l13 25-37 62-37-62z" fill="#f3dfaa"/><path d="M135 235v14m630-14v14" stroke-width="5"/><path d="M108 174h54m578 0h54"/></g><g fill="#d2a35a" opacity=".8"><circle cx="135" cy="202" r="6"/><circle cx="765" cy="202" r="6"/></g></svg>'
  },
  'watercolor-lantern-florals':{
   background:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200"><defs><linearGradient id="p" x2=".8" y2="1"><stop stop-color="#fffdfb"/><stop offset="1" stop-color="#fbf0ed"/></linearGradient><radialGradient id="w"><stop stop-color="#edc8bd" stop-opacity=".55"/><stop offset="1" stop-color="#edc8bd" stop-opacity="0"/></radialGradient></defs><path fill="url(#p)" d="M0 0h900v1200H0z"/><ellipse cx="70" cy="155" rx="270" ry="260" fill="url(#w)"/><ellipse cx="825" cy="1010" rx="270" ry="300" fill="url(#w)"/><g fill="none" stroke="#829477" stroke-width="5" opacity=".72"><path d="M40 0q80 130 115 256t-15 209M860 1200q-80-130-115-256t15-209"/><path d="M111 115q-72-38-83-99m133 213q69-38 87-98M798 1085q72 38 83 99m-133-213q-69 38-87 98"/></g><g fill="#d39a9c" opacity=".72"><circle cx="60" cy="62" r="23"/><circle cx="109" cy="109" r="18"/><circle cx="178" cy="270" r="20"/><circle cx="839" cy="1138" r="23"/><circle cx="790" cy="1091" r="18"/><circle cx="721" cy="930" r="20"/></g><g fill="#c8a562" opacity=".75"><circle cx="60" cy="62" r="7"/><circle cx="109" cy="109" r="5"/><circle cx="178" cy="270" r="6"/><circle cx="839" cy="1138" r="7"/><circle cx="790" cy="1091" r="5"/><circle cx="721" cy="930" r="6"/></g><path d="M450 200v120m-30-2h60l20 30-50 72-50-72z" fill="#f7e6bf" stroke="#c29a5a" stroke-width="4" opacity=".75"/><path d="M450 200v-45m-26 174h52m-77-1h102" fill="none" stroke="#c29a5a" stroke-width="4" opacity=".75"/></svg>',
   lanterns:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500"><g fill="none" stroke="#b88e5b" stroke-width="3" opacity=".8"><path d="M135 0v145m630-145v145"/><path d="M113 145h44l13 23-35 60-35-60zM743 145h44l13 23-35 60-35-60z" fill="#f4d8c9"/><path d="M135 228v16m630-16v16"/></g><g fill="#d8a4a0" opacity=".6"><circle cx="135" cy="188" r="15"/><circle cx="765" cy="188" r="15"/></g></svg>'
  }
 };
 const svgUrl=svg=>`data:image/svg+xml,${encodeURIComponent(svg)}`;
 const image=name=>PRESETS[name]?.background?svgUrl(PRESETS[name].background):'';
 window.MubieyHeritageBackgrounds={image,lanterns:name=>PRESETS[name]?.lanterns?svgUrl(PRESETS[name].lanterns):''};

 const css=`<style id="mubiey-heritage-backgrounds">
.invitation-page{position:relative;isolation:isolate}
.invitation-page.mubiey-bg-islamic-arch,.invitation-page.mubiey-bg-watercolor-lanterns{background-color:transparent}
.invitation-page.mubiey-bg-islamic-arch::after,.invitation-page.mubiey-bg-watercolor-lanterns::after{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background-repeat:no-repeat;background-position:top center;background-size:min(100%,900px) auto;transform-origin:top center;animation:mubiey-lantern-sway 7s ease-in-out infinite alternate}
.invitation-page.mubiey-bg-islamic-arch::after{background-image:url("${window.MubieyHeritageBackgrounds.lanterns('islamic-arch-lanterns')}");background-size:min(100%,900px) auto}
.invitation-page.mubiey-bg-watercolor-lanterns::after{background-image:url("${window.MubieyHeritageBackgrounds.lanterns('watercolor-lantern-florals')}");background-size:min(100%,900px) auto}
.invitation-page.mubiey-bg-islamic-arch>*,.invitation-page.mubiey-bg-watercolor-lanterns>*{position:relative;z-index:1}
@keyframes mubiey-lantern-sway{from{transform:rotate(-.7deg)}to{transform:rotate(.7deg)}}
.mubiey-no-motion .invitation-page.mubiey-bg-islamic-arch::after,.mubiey-no-motion .invitation-page.mubiey-bg-watercolor-lanterns::after{animation:none}
@media(prefers-reduced-motion:reduce){.invitation-page.mubiey-bg-islamic-arch::after,.invitation-page.mubiey-bg-watercolor-lanterns::after{animation:none}}
.gse-cover{position:fixed;inset:0;z-index:2147482000;display:grid;place-items:center;overflow:hidden;padding:22px;background:radial-gradient(ellipse at 50% 20%,#fff8e9,#c8aa7b 145%);perspective:1200px;transition:opacity .8s ease,visibility .8s ease}
.gse-cover.is-open{opacity:0;visibility:hidden;pointer-events:none}
.gse-stage{position:relative;width:min(88vw,580px);height:min(78vh,650px);display:grid;place-items:end center;padding-bottom:7vh}
.gse-envelope{position:absolute;bottom:10%;width:min(86vw,520px);aspect-ratio:1.55;border:1px solid #e8cf91;border-radius:4px;background:linear-gradient(145deg,#fff4d8,#d6bd8b 52%,#f3dfb2);box-shadow:0 28px 65px #49351d55,inset 0 0 0 9px #f4e3bf,inset 0 0 0 11px #b58b48;transform-style:preserve-3d}
.gse-envelope:before{content:"";position:absolute;inset:12px;border:1px solid #b99250;pointer-events:none;background:radial-gradient(ellipse at 50% 42%,transparent 0 37%,#b8924c20 38% 39%,transparent 40%),linear-gradient(135deg,transparent 49.5%,#a98548 50%,transparent 50.5%),linear-gradient(225deg,transparent 49.5%,#a98548 50%,transparent 50.5%);opacity:.85}
.gse-pocket{position:absolute;inset:0;z-index:3;clip-path:polygon(0 26%,50% 66%,100% 26%,100% 100%,0 100%);background:linear-gradient(155deg,#f6e8c8,#c9ad75 62%,#eed9aa);border-bottom:1px solid #8e6d39}
.gse-flap{position:absolute;inset:0 0 auto;z-index:5;height:68%;clip-path:polygon(0 0,100% 0,50% 100%);transform-origin:50% 0;transform:rotateX(0);background:linear-gradient(180deg,#fff3d4,#d6bd8b);filter:drop-shadow(0 8px 7px #634b2777);transition:transform 1.05s cubic-bezier(.18,.8,.2,1)}
.gse-seal{position:absolute;left:50%;top:48%;z-index:7;width:78px;height:78px;display:grid;place-items:center;padding:11px;border:3px double #f0d48e;border-radius:48% 45% 50% 44%;background:radial-gradient(circle at 32% 28%,#bd8b42,#94642c 48%,#664020 100%);box-shadow:0 8px 18px #3a291c77,inset 0 0 0 4px #a57937,inset 0 0 0 6px #f0d48e88;transform:translate(-50%,-50%);transition:transform .45s,opacity .45s}
.gse-seal img{display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 1px 2px #3b241b77)}
.gse-seal span{font:italic 24px/1 Georgia,serif;color:#fff0c4;text-shadow:0 1px 4px #523416}
.gse-open{position:absolute;inset:0;z-index:8;border:0;border-radius:4px;background:transparent;cursor:pointer}
.gse-open:focus-visible{outline:3px solid #fff4d2;outline-offset:7px}
.gse-card{position:absolute;z-index:2;left:13%;bottom:16%;width:74%;height:62%;padding:clamp(18px,4vw,36px) 20px;display:grid;place-items:center;text-align:center;border:1px solid #cfb477;background:linear-gradient(155deg,#fffdf5,#f4ead5);color:#4d3928;box-shadow:0 16px 36px #46341f44;opacity:0;transform:translateY(38%) scale(.91);transition:transform 1.2s cubic-bezier(.2,.8,.2,1),opacity .7s ease}
.gse-card:before{content:"";position:absolute;inset:9px;border:1px solid #c9ab6a;pointer-events:none}
.gse-card-copy{position:relative;max-width:100%;font-family:Georgia,'Times New Roman',serif}
.gse-card-kicker{display:block;margin-bottom:10px;font:9px/1.4 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#95713e}
.gse-card h1{margin:8px 0;font:400 clamp(24px,6vw,42px)/1.15 Georgia,'Times New Roman',serif;color:#60452c;overflow-wrap:anywhere}
.gse-card-names{font:italic clamp(18px,4vw,27px)/1.35 Georgia,'Times New Roman',serif;overflow-wrap:anywhere}
.gse-card-date{margin-top:11px;font:11px/1.5 Arial,sans-serif;color:#796344}
.gse-cover[data-stage=opening] .gse-flap,.gse-cover[data-stage=emerge] .gse-flap,.gse-cover[data-stage=opened] .gse-flap{transform:rotateX(180deg)}
.gse-cover[data-stage=opening] .gse-seal,.gse-cover[data-stage=emerge] .gse-seal,.gse-cover[data-stage=opened] .gse-seal{opacity:0;transform:translate(-50%,-50%) scale(.65)}
.gse-cover[data-stage=emerge] .gse-card,.gse-cover[data-stage=opened] .gse-card{opacity:1;transform:translateY(-28%) scale(1)}
.gse-cover[data-stage=opened] .gse-envelope{transform:translateY(10px)}
.gse-hint{position:absolute;bottom:1%;font:10px/1.4 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#634d2e}
.gse-cover.no-motion,.gse-cover.no-motion *{transition:none!important;animation:none!important}
@media(max-width:480px){.gse-stage{height:min(70vh,540px)}.gse-envelope{width:88vw}.gse-seal{width:66px;height:66px}.gse-card{height:60%}}
@media(prefers-reduced-motion:reduce){.gse-cover *{transition:none!important;animation:none!important}}
</style>`;
 const escape=value=>Studio.escape(String(value??''));
 const pagePreset=(data,index)=>{
  const saved=data.pageBackgrounds?.[index];
  if(saved?.preset==='none')return '';
  if(['islamic-arch-lanterns','watercolor-lantern-florals'].includes(saved?.preset))return saved.preset;
  return ({'islamic-arch-lanterns':'islamic-arch-lanterns','watercolor-lantern-florals':'watercolor-lantern-florals'})[data.template]||'';
 };
 const base=invitationDocument;
 invitationDocument=function(data){
  let html=base.apply(this,arguments);
  if(typeof html!=='string')return html;
  const template=data?.template;
  const gold=template==='gold-seal-envelope';
  const isArch=template==='islamic-arch-lanterns';
  const isWatercolor=template==='watercolor-lantern-florals';
  const hasPagePreset=Array.isArray(data?.pageBackgrounds)&&data.pageBackgrounds.some(page=>page&&page.preset&&page.preset!=='none');
  if(!gold&&!isArch&&!isWatercolor&&!hasPagePreset)return html;
  const bodyClasses=[isArch&&'mubiey-template-islamic',isWatercolor&&'mubiey-template-watercolor',data?.animation===false&&'mubiey-no-motion'].filter(Boolean).join(' ');
  if(bodyClasses)html=html.replace(/<body\b[^>]*>/i,tag=>{
   const classAttribute=/\sclass=(["'])(.*?)\1/i;
   return classAttribute.test(tag)?tag.replace(classAttribute,(_match,quote,value)=>` class=${quote}${value} ${bodyClasses}${quote}`):tag.replace(/>$/,` class="${bodyClasses}">`);
  });
  let sectionIndex=0;
  html=html.replace(/<section\b[^>]*>/gi,tag=>{
   const index=sectionIndex++;
   const preset=pagePreset(data||{},index);
   if(!preset||data?.pageBackgrounds?.[index]?.image)return tag;
   const cls=/\sclass=(["'])(.*?)\1/i;
   if(cls.test(tag))return tag.replace(cls,(_m,q,value)=>` class=${q}${value} mubiey-bg-${preset==='islamic-arch-lanterns'?'islamic-arch':'watercolor-lanterns'}${q}`);
   return tag.replace(/>$/,` class="mubiey-bg-${preset==='islamic-arch-lanterns'?'islamic-arch':'watercolor-lanterns'}">`);
  });
  if(gold){
   const logo=data.logo&&/^(?:data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}|\/media\/[a-f0-9-]{36}\/[a-f0-9-]{36})$/i.test(data.logo)?data.logo:'';
   const couple=`${escape(data.name1||'Name one')} & ${escape(data.name2||'Name two')}`;
   const date=escape(data.date?new Date(data.date.slice(0,16)+'Z').toLocaleString('en-GB',{timeZone:'UTC',weekday:'long',day:'numeric',month:'long',year:'numeric'}):'Wedding invitation');
   const logoMarkup=logo?`<img src="${logo}" alt="">`:`<span aria-hidden="true">${escape((data.monogram||'✦').slice(0,3))}</span>`;
   const cover=`<div class="gse-cover${data.animation===false?' no-motion':''}" id="gse-cover" role="dialog" aria-modal="true" aria-label="Open the wedding invitation" data-stage="closed"><div class="gse-stage"><div class="gse-card"><div class="gse-card-copy"><span class="gse-card-kicker">You are warmly invited</span><h1>${escape(data.heading||'Together with our families')}</h1><div class="gse-card-names">${couple}</div><div class="gse-card-date">${date}</div></div></div><div class="gse-envelope" aria-hidden="true"><div class="gse-pocket"></div><div class="gse-flap"></div><div class="gse-seal">${logoMarkup}</div><button class="gse-open" id="gse-open" type="button" aria-label="Open the invitation"></button></div><div class="gse-hint">Tap the gold seal to open</div></div></div>`;
   html=html.replace(/<body\b[^>]*>/i,match=>match+cover);
   const script=`<script>(function(){var cover=document.getElementById('gse-cover'),button=document.getElementById('gse-open');if(!cover||!button)return;function open(){if(cover.dataset.stage!=='closed')return;if(cover.classList.contains('no-motion')){cover.dataset.stage='opened';cover.classList.add('is-open');setTimeout(function(){cover.remove()},0);return}cover.dataset.stage='opening';setTimeout(function(){cover.dataset.stage='emerge'},650);setTimeout(function(){cover.dataset.stage='opened'},1800);setTimeout(function(){cover.classList.add('is-open')},2900);setTimeout(function(){cover.remove()},3800)}button.addEventListener('click',open);cover.addEventListener('click',function(event){if(event.target===cover)open()});if(cover.classList.contains('no-motion'))open()})();<\/script>`;
   html=html.replace(/<\/body>/i,script+'</body>');
  }
  const head=html.search(/<\/head>/i);
  return head<0?html:html.slice(0,head)+css+html.slice(head);
 };
})();
