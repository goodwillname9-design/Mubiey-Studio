/* Royal Red & Gold template and velvet-curtain opening.
   Layered on top of invitationDocument() exactly like atelier-experience.js, so every existing
   template, gallery, countdown, music and map feature keeps working untouched.
   - data.template === 'royal-red-gold'  -> red/gold styling, family section, RSVP link, hero petals
   - data.openingStyle === 'curtain'     -> velvet curtain opening (works with any template)
   Guest output never contains editor controls; the curtain is skipped in the editing preview. */
'use strict';
(()=>{
if(typeof invitationDocument!=='function')return;
const ROYAL='royal-red-gold';
const baseDocument=invitationDocument;

const httpsLink=v=>{try{const u=new URL(v);return u.protocol==='https:'?u.href:''}catch{return ''}};
const fontFamily=key=>{
 const extra={allura:'AtelierAllura',parisienne:'AtelierParisienne',cinzel:'AtelierCinzel',playfair:'AtelierPlayfair',montserrat:'AtelierMontserrat',amiri:'AtelierAmiri',malayalam:'AtelierMalayalam',script:'AtelierScript',italic:'AtelierSerif',serif:'AtelierSerif'};
 return key==='sans'?'Arial,sans-serif':(extra[key]||'AtelierSerif')+",'Cormorant Garamond',Georgia,serif";
};
const fontCSS=()=>{try{return typeof atelierFontCSS==='function'&&typeof atelierFontData==='object'&&atelierFontData.cormorant?atelierFontCSS(true):''}catch{return ''}};

const royalCSS=data=>`
:root{--rr-deep:#2a050c;--rr-wine:#3b0711;--rr-red:#7d1222;--rr-gold:#d9b46a;--rr-gold2:#f3dca1;--rr-ink:#f8ecd6;--paper:#3b0711;--gold:#d9b46a;--ink:#f8ecd6}
body{background:radial-gradient(ellipse at 50% 0,#5a0c1a 0,#3b0711 45%,#2a050c 100%) fixed;color:var(--rr-ink)}
.hero h1,.section h2,.venue,.couple h3{color:var(--rr-gold2);font-family:${fontFamily(data.font)}}
.hero h1{font-weight:400;text-shadow:0 2px 18px #0009}.hero.has-photo h1{font-weight:400}
.overline{color:var(--rr-gold)!important;letter-spacing:4px}.amp{color:var(--rr-gold);font-family:${fontFamily(data.font)}}
.date,.message,.address,.event p{color:var(--rr-ink)}
.soft{background:linear-gradient(180deg,#4a0a16,#3b0711)}
.frame{border:1px solid #d9b46aaa;box-shadow:inset 0 0 0 7px #3b0711,inset 0 0 0 8px #d9b46a55}
.hero.has-photo .frame{display:block}
.hero.has-photo .shade{background:linear-gradient(180deg,#2a050ccc,#3b071166 40%,#2a050cee)}
.line{height:14px;width:min(240px,60%);background:none;position:relative;margin:30px auto}
.line:before{content:'';position:absolute;left:0;right:0;top:6px;height:1px;background:linear-gradient(90deg,transparent,var(--rr-gold),transparent)}
.line:after{content:'✦';position:absolute;left:calc(50% - 10px);top:-6px;width:20px;text-align:center;font-size:15px;line-height:1;background:#3b0711;color:var(--rr-gold)}
.countdown b{color:var(--rr-gold2)}.countdown small{color:var(--rr-gold)}
.countdown>div{border:1px solid #d9b46a55;border-radius:6px;padding:12px 4px;background:#2a050c66}
.event{border-top-color:#d9b46a55}
.gallery img,.couple img{border:1px solid #d9b46a88;box-shadow:0 10px 28px #0007}
.map{background:linear-gradient(135deg,#f3dca1,#c9a050);color:#3b0711;font-weight:700;border-radius:30px;letter-spacing:2px}
.music{background:#3b0711;color:var(--rr-gold2);border-color:var(--rr-gold)}
.invite-nav{color:var(--rr-gold2)!important}.end{color:var(--rr-gold)}
.events-card{border-color:#d9b46a66}.events-card .event{border-color:#d9b46a55}
.rr-family .message{font-size:20px}
.rr-rsvp{margin-top:8px}
.rr-hero-petals{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
.rr-hero-petals i{position:absolute;top:-30px;left:var(--x);width:9px;height:15px;border-radius:80% 0 80% 0;background:#c8102e;opacity:.55;animation:rr-drift var(--t) var(--d) linear infinite}
@keyframes rr-drift{from{transform:translate3d(0,-40px,0) rotate(0)}to{transform:translate3d(60px,110vh,0) rotate(380deg)}}
@media(prefers-reduced-motion:reduce){.rr-hero-petals{display:none}}`;

const curtainCSS=`
.rr-lock{overflow:hidden}
.rr-curtain{position:fixed;inset:0;z-index:60;overflow:hidden;font-family:Georgia,'Times New Roman',serif}
.rr-curtain.done{display:none}.rr-curtain.clear{pointer-events:none}
.rr-light{position:absolute;inset:0;z-index:1;opacity:0;transition:opacity 1.6s ease .3s;background:radial-gradient(circle at 50% 46%,#fff2c2f2 0,#e9bf62aa 24%,#b8862d44 48%,transparent 72%)}
.rr-panel{position:absolute;top:0;bottom:0;width:51%;z-index:2;will-change:transform;transition:transform 2.4s cubic-bezier(.77,0,.18,1) .45s;
 background:linear-gradient(90deg,#0007,transparent 16%,transparent 84%,#0007),repeating-linear-gradient(90deg,#3d050d 0,#7d1222 18px,#b3243a 30px,#8a1528 44px,#3d050d 66px)}
.rr-left{left:0;transform-origin:left center;box-shadow:6px 0 24px #0008}
.rr-right{right:0;transform-origin:right center;box-shadow:-6px 0 24px #0008}
.rr-panel:after{content:'';position:absolute;top:0;bottom:0;width:7px;background:linear-gradient(90deg,#8a6a2a,#f3dca1,#a8802f)}
.rr-left:after{right:0}.rr-right:after{left:0}
.rr-valance{position:absolute;left:0;right:0;top:0;height:74px;z-index:4;transition:transform 1.1s ease 2.2s;
 background:linear-gradient(#f3dca1,#c9a050 42%,#8a6a2a 46%,#5a0c1a 47%),#5a0c1a;border-bottom:3px solid #d9b46a}
.rr-valance:after{content:'';position:absolute;left:0;right:0;bottom:-18px;height:18px;background:radial-gradient(circle at 50% 0,#7d1222 17px,transparent 18px) 0 0/44px 18px repeat-x;filter:drop-shadow(0 3px 3px #0008)}
.rr-center{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:90px 22px 30px;color:#f8ecd6;transition:opacity .6s ease,transform .6s ease}
.rr-center p{font:11px/1.6 Arial,sans-serif;letter-spacing:5px;color:#d9b46a;margin:0 0 20px}
.rr-center h2{font:400 clamp(38px,9vw,72px)/1.15 'AtelierAllura','AtelierScript',Georgia,serif;margin:6px 0 30px;color:#f3dca1;text-shadow:0 3px 18px #000a;overflow-wrap:anywhere}
.rr-center h2 span{display:block;font-size:.6em;color:#d9b46a}
.rr-center button{font:700 12px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;padding:16px 34px;min-height:48px;border-radius:40px;border:1px solid #fff3c9;cursor:pointer;color:#3b0711;background:linear-gradient(135deg,#f3dca1,#c9a050);box-shadow:0 0 0 5px #d9b46a33,0 12px 30px #000a}
.rr-center button:focus-visible{outline:3px solid #fff;outline-offset:4px}
.rr-petals{position:absolute;inset:0;z-index:6;pointer-events:none;overflow:hidden}
.rr-fall{position:absolute;top:-30px;left:var(--x);width:var(--w);height:calc(var(--w)*1.6);border-radius:80% 0 80% 0;background:linear-gradient(135deg,#e0283f,#8a1020);opacity:0}
.rr-curtain.opening .rr-left{transform:translateX(-103%) scaleX(.88)}
.rr-curtain.opening .rr-right{transform:translateX(103%) scaleX(.88)}
.rr-curtain.opening .rr-light{opacity:1}
.rr-curtain.opening .rr-valance{transform:translateY(-130%)}
.rr-curtain.opening .rr-center{opacity:0;transform:scale(.96);pointer-events:none}
.rr-curtain.opening .rr-fall{animation:rr-fall var(--t) var(--d) ease-in forwards}
@keyframes rr-fall{0%{opacity:0;transform:translate3d(0,-30px,0) rotate(var(--r))}12%{opacity:.95}100%{opacity:.9;transform:translate3d(46px,108vh,0) rotate(calc(var(--r) + 420deg))}}
@media(max-width:600px){.rr-valance{height:56px}.rr-center{padding-top:70px}}
@media(prefers-reduced-motion:reduce){.rr-panel,.rr-light,.rr-valance,.rr-center{transition:none!important}.rr-fall{display:none}.rr-curtain{transition:opacity .4s ease}.rr-curtain.opening{opacity:0}}
@media print{.rr-curtain{display:none!important}.rr-lock{overflow:visible}}`;

function curtainMarkup(data){
 const e=Studio.escape;
 const petals=Array.from({length:24},(_,i)=>`<i class="rr-fall" style="--x:${(i*41+7)%100}%;--d:${(.3+(i%8)*.28).toFixed(2)}s;--t:${(3+(i%5)*.45).toFixed(2)}s;--r:${(i*53)%360}deg;--w:${10+(i%4)*3}px"></i>`).join('');
 return `<div id="rr-curtain" class="rr-curtain" role="dialog" aria-modal="true" aria-label="Wedding invitation opening"><div class="rr-light"></div><div class="rr-panel rr-left"></div><div class="rr-panel rr-right"></div><div class="rr-valance"></div><div class="rr-center"><p>YOU ARE CORDIALLY INVITED</p><h2>${e(data.name1||'Name one')}<span>&amp;</span>${e(data.name2||'Name two')}</h2><button type="button" id="rr-open">Open the invitation</button></div><div class="rr-petals" aria-hidden="true">${petals}</div></div>`;
}
function curtainScript(data){
 const music=data.musicAutoplay===false?'':`const audio=document.getElementById('music'),mb=document.getElementById('music-button');if(audio)audio.play().then(()=>{if(mb)mb.textContent='Ⅱ Pause music'}).catch(()=>{if(mb)mb.textContent='♫ Tap to play music'});`;
 return `<script>(()=>{const stage=document.getElementById('rr-curtain'),btn=document.getElementById('rr-open');if(!stage||!btn)return;const page=[...document.querySelectorAll('main,nav')];page.forEach(n=>n.inert=true);document.body.classList.add('rr-lock');const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;btn.focus({preventScroll:true});btn.onclick=()=>{if(stage.classList.contains('opening'))return;${music}stage.classList.add('opening');const release=()=>{stage.classList.add('clear');page.forEach(n=>n.inert=false);document.body.classList.remove('rr-lock');const h=document.querySelector('.hero h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}};if(reduce){setTimeout(()=>{release();stage.classList.add('done')},450)}else{setTimeout(release,3200);setTimeout(()=>stage.classList.add('done'),7800)}}})();<\/script>`;
}

invitationDocument=function(data){
 let html=baseDocument(data);
 const royal=data.template===ROYAL;
 const curtain=data.openingStyle==='curtain'&&data.animation!==false&&!data._editorPreview;
 if(!royal&&!curtain)return html;
 const e=Studio.escape;
 let css='';
 if(royal)css+=fontCSS()+royalCSS(data);
 if(curtain)css+=curtainCSS;
 html=html.replace('</head>',`<style>${css}</style>${curtain?'<noscript><style>.rr-curtain{display:none}.rr-lock{overflow:auto}</style></noscript>':''}</head>`);
 if(royal){
  const petals=Array.from({length:10},(_,i)=>`<i style="--x:${(i*37+11)%100}%;--d:${-(i*1.7).toFixed(1)}s;--t:${(11+(i%4)*2)}s"></i>`).join('');
  html=html.replace('<div class="frame"></div>',`<div class="frame"></div><div class="rr-hero-petals" aria-hidden="true">${petals}</div>`);
  const family=(data.family||'').trim();
  if(family)html=html.replace('<section id="location"',`<section class="section rr-family" id="family"><p class="overline">WITH THE BLESSINGS OF OUR FAMILIES</p><h2>Our families</h2><div class="message">${e(family)}</div><div class="line"></div></section><section id="location"`);
  const rsvp=httpsLink(data.rsvpUrl||'');
  if(rsvp)html=html.replace('<section class="section"><p class="overline">WITH LOVE</p>',`<section class="section" id="rsvp"><p class="overline">KINDLY RESPOND</p><h2>Will you join us?</h2><a class="map rr-rsvp" href="${e(rsvp)}" target="_blank" rel="noopener noreferrer">RSVP ↗</a></section><section class="section"><p class="overline">WITH LOVE</p>`);
 }
 if(curtain){
  // The curtain replaces any other opening cover (envelope/locket) so only one ceremony plays.
  html=html.replace(/<div class="envelope[^"]*" id="envelope">[\s\S]*?<\/script>/,'');
  html=html.replace('</body>',curtainMarkup(data)+curtainScript(data)+'</body>');
 }
 return html;
};
})();
