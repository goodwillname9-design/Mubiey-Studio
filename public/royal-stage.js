/* Mubiey Studio · "Royal Stage" live invitation (template id: royal-stage).
   Tap to open -> the velvet curtain parts -> a gold stage with a crystal chandelier appears behind it ->
   roses pop from the top and drift down while the lights glow -> the camera pushes in to the chandelier ->
   the invitation (names inside a gold oval) -> scratch-to-reveal date with countdown -> photo slider ->
   schedule timeline -> event cards with map buttons.
   Artwork: the customer's own stage pictures in /assets/royal-stage/ (sparkle watermarks and player bars removed);
   lights, glow, twinkles, roses and petals are drawn in code. Every text is editable from the invitation form
   and by tapping it in the editor preview; fonts follow the invitation's Font setting (custom font included).
   Same pattern as the other templates: it wraps invitationDocument() and returns one self-contained document. */
'use strict';
(()=>{
if(typeof invitationDocument!=='function')return;
const TEMPLATE='royal-stage',baseDocument=invitationDocument;
const esc=v=>Studio.escape(v);
const str=(v,max)=>typeof v==='string'?v.trim().slice(0,max||400):'';
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function when(value){
 const m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2})?([+-]\d{2}:\d{2})$/.exec(value||'');
 if(!m)return null;
 const dt=new Date(Date.UTC(+m[1],+m[2]-1,+m[3]));
 if(dt.getUTCMonth()!==+m[2]-1||dt.getUTCDate()!==+m[3])return null;
 const h=+m[4];
 return {day:DAYS[dt.getUTCDay()],date:String(+m[3]),month:MONTHS[dt.getUTCMonth()],year:String(+m[1]),time:`${h%12||12}:${m[5]} ${h<12?'AM':'PM'}`};
}
const MAP_HOSTS=['google.com','www.google.com','maps.google.com','maps.app.goo.gl','goo.gl','maps.apple.com'];
const safeMap=v=>{try{const u=new URL(v);return u.protocol==='https:'&&MAP_HOSTS.includes(u.hostname)?u.href:''}catch{return''}};
const safeHttps=v=>{try{const u=new URL(v);return u.protocol==='https:'&&u.hostname?u.href:''}catch{return''}};
const fontCSS=()=>{try{return typeof atelierFontCSS==='function'&&typeof atelierFontData==='object'&&atelierFontData.cormorant?atelierFontCSS(true):''}catch{return ''}};
function fontFamily(key,custom){
 if(key==='custom'&&custom)return "'MubieyCustom',Georgia,serif";
 const extra={allura:'AtelierAllura',parisienne:'AtelierParisienne',cinzel:'AtelierCinzel',playfair:'AtelierPlayfair',montserrat:'AtelierMontserrat',amiri:'AtelierAmiri',malayalam:'AtelierMalayalam',script:'AtelierScript',italic:'AtelierSerif',serif:'AtelierSerif'};
 return key==='sans'?'Arial,sans-serif':(extra[key]||'AtelierAllura')+",'Cormorant Garamond',Georgia,serif";
}
const customFontCSS=d=>{
 const f=d.customFont;
 if(!f||typeof f.data!=='string'||!/^data:(font\/(ttf|otf|woff2?)|application\/(font-woff2?|font-sfnt|x-font-[a-z0-9]+|octet-stream));base64,[A-Za-z0-9+/=]+$/.test(f.data))return '';
 const fmt={woff2:'woff2',woff:'woff',otf:'opentype',ttf:'truetype'}[f.format]||'truetype';
 return `@font-face{font-family:'MubieyCustom';src:url('${f.data}') format('${fmt}');font-display:swap}`;
};

/* ---------------------------------------------------------------- artwork: your 7 stage images + code-drawn lights, roses and petals */
const ASSET=(typeof location!=='undefined'&&/^https?:$/.test(location.protocol)?location.origin:'')+'/assets/royal-stage/';
const IMG={cover:ASSET+'cover.jpg',stage:ASSET+'stage.jpg',zoom:ASSET+'zoom.jpg',chand:ASSET+'chand.jpg',oval:ASSET+'oval.jpg',scratch:ASSET+'scratch.jpg',garland:ASSET+'garland-top.png'};
const DEFS=`<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<radialGradient id="rsRoseG" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#e83a50"/><stop offset=".55" stop-color="#a50f26"/><stop offset="1" stop-color="#560412"/></radialGradient>
<radialGradient id="rsRoseW" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#fffdf6"/><stop offset=".6" stop-color="#f1e6d2"/><stop offset="1" stop-color="#cdbb9b"/></radialGradient>
<linearGradient id="rsLeafG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#173f27"/><stop offset="1" stop-color="#3f7a4c"/></linearGradient>
<symbol id="rsRose" viewBox="-20 -20 40 40"><circle r="18.5" fill="url(#rsRoseG)"/><path d="M0-11C9-11 12-2 8 5C3 10-7 9-9 2C-11-5-6-9 0-8C5-7 7-3 4 1" fill="none" stroke="#ff9eab" stroke-opacity=".38" stroke-width="1.5"/><path d="M-13-8C-6-15 6-15 13-8M-14 5C-8 14 8 14 14 5" fill="none" stroke="#3a0310" stroke-opacity=".38" stroke-width="1.2"/><circle cx="-5" cy="-6" r="3.2" fill="#fff" fill-opacity=".14"/></symbol>
<symbol id="rsRoseWhite" viewBox="-20 -20 40 40"><circle r="18.5" fill="url(#rsRoseW)"/><path d="M0-11C9-11 12-2 8 5C3 10-7 9-9 2C-11-5-6-9 0-8C5-7 7-3 4 1" fill="none" stroke="#b8a583" stroke-opacity=".6" stroke-width="1.3"/><path d="M-13-8C-6-15 6-15 13-8M-14 5C-8 14 8 14 14 5" fill="none" stroke="#a38f6c" stroke-opacity=".45" stroke-width="1.1"/></symbol>
<symbol id="rsLeaf" viewBox="0 -10 28 20"><path d="M0 0C8-10 22-8 28 0C22 8 8 10 0 0z" fill="url(#rsLeafG)"/><path d="M1 0H25" stroke="#9fd0a4" stroke-opacity=".35" stroke-width=".8"/></symbol>
</defs></svg>`;
const rnd=(i,a,b)=>{const v=Math.sin(i*127.1+311.7)*43758.5453;return a+(v-Math.floor(v))*(b-a)};
/* roses that pop out at the top and drift down, plus loose petals */
function pops(n){
 let s='';
 for(let i=0;i<n;i++){
  const x=rnd(i,3,95).toFixed(1),d=(1.0+(i%10)*.27+rnd(i+9,0,.25)).toFixed(2),t=(5.6+rnd(i+3,0,2.6)).toFixed(1),dx=((i%2?1:-1)*rnd(i+5,18,70)).toFixed(0)+'px',r=((i%2?1:-1)*rnd(i+7,30,140)).toFixed(0)+'deg',r2=((i%2?-1:1)*rnd(i+11,200,520)).toFixed(0)+'deg';
  const st=`--x:${x}%;--d:${d}s;--t:${t}s;--dx:${dx};--r:${r};--r2:${r2}`;
  if(i%3===2)s+=`<i class="pet" style="${st};--s:${rnd(i+2,12,20).toFixed(0)}px"></i>`;
  else s+=`<svg class="pop" viewBox="-20 -20 40 40" style="${st};--s:${rnd(i+4,26,54).toFixed(0)}px" aria-hidden="true"><use href="#${i%4===1?'rsRoseWhite':'rsRose'}"/></svg>`;
 }
 return `<div class="pops" aria-hidden="true">${s}</div>`;
}
function fall(n){
 let s='';
 for(let i=0;i<n;i++)s+=`<i class="pet" style="--x:${rnd(i+40,2,97).toFixed(1)}%;--s:${rnd(i+41,9,16).toFixed(0)}px;--t:${rnd(i+42,11,19).toFixed(1)}s;--d:${(-rnd(i+43,0,18)).toFixed(1)}s;--dx:${((i%2?1:-1)*rnd(i+44,20,60)).toFixed(0)}px;--r2:${rnd(i+45,200,500).toFixed(0)}deg"></i>`;
 return `<div class="fall" aria-hidden="true">${s}</div>`;
}
/* chandelier glow, light beams, candle flicker and twinkles that sit on top of an artwork layer.
   cy = height of the chandelier in that picture, ly = height of the wall lamps */
function lights(cy,ly){
 let sp='';
 for(let i=0;i<16;i++){
  const near=i<11,x=near?rnd(i,34,66):(i%2?rnd(i,4,24):rnd(i,76,96)),y=near?parseFloat(cy)+rnd(i+20,-9,13):rnd(i+21,52,92);
  sp+=`<b class="sp" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;--z:${rnd(i+22,8,17).toFixed(0)}px;--d:${rnd(i+23,0,3.6).toFixed(2)}s"></b>`;
 }
 return `<i class="rays" style="--cy:${cy}"></i><i class="glow" style="--cy:${cy}"></i><i class="lamp l" style="--ly:${ly}"></i><i class="lamp r" style="--ly:${ly}"></i>${sp}`;
}
const layer=(cls,img,cy,ly)=>`<div class="lay ${cls}" style="background-image:url('${img}')">${lights(cy,ly)}</div>`;
/* ---------------------------------------------------------------- styles */
const CSS=(m)=>`
:root{--gold:#d9b46a;--gold2:#f3dca1;--red:#7d1222;--deep:#2a050c;--paper:#eddcc4;--ink:#4a0d17;--nf:${m.nameFont};--bf:${m.bodyFont};color-scheme:light}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
body{margin:0;background:var(--deep);color:#f8ecd6;font:17px/1.7 var(--bf);overflow-x:hidden}
body.rs-locked{overflow:hidden;height:100vh;height:100svh}
.frame{position:relative;width:min(100%,560px);margin:0 auto}
/* artwork layers */
.lay{position:absolute;inset:0;background-size:cover;background-position:50% 0;background-repeat:no-repeat;overflow:hidden;will-change:transform,opacity}
.glow{position:absolute;left:50%;top:var(--cy);width:92%;aspect-ratio:1;transform:translate(-50%,-50%);background:radial-gradient(circle,#ffeab0d9 0,#ffd27a59 26%,#ffd27a00 62%);mix-blend-mode:screen;pointer-events:none;animation:rs-glow 3.4s ease-in-out infinite}
.rays{position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen;opacity:.35;background:repeating-conic-gradient(from 168deg at 50% var(--cy),#ffe7b02e 0 3.5deg,#0000 3.5deg 12deg);-webkit-mask-image:radial-gradient(ellipse 75% 70% at 50% var(--cy),#000 0,transparent 72%);mask-image:radial-gradient(ellipse 75% 70% at 50% var(--cy),#000 0,transparent 72%);transform-origin:50% var(--cy);animation:rs-rays 7s ease-in-out infinite}
.lamp{position:absolute;top:var(--ly);width:19%;aspect-ratio:1;transform:translate(-50%,-50%);background:radial-gradient(circle,#ffd98aa6 0,#ffb84a40 34%,#ffb84a00 66%);mix-blend-mode:screen;pointer-events:none;animation:rs-flick 2.1s ease-in-out infinite}
.lamp.l{left:7%}.lamp.r{left:93%;animation-delay:-.9s}
.sp{position:absolute;width:var(--z);height:var(--z);transform:translate(-50%,-50%) scale(0);background:#fff6d2;clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%);filter:drop-shadow(0 0 4px #ffe49a);pointer-events:none;animation:rs-twk 2.8s ease-in-out var(--d) infinite}
.pops,.fall{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.pop,.pet{position:absolute;top:-6%;left:var(--x);width:var(--s);height:var(--s);will-change:transform,opacity}
.pet{height:calc(var(--s)*1.5);border-radius:80% 0 80% 0;background:linear-gradient(135deg,#e0283f,#7d0f1f);box-shadow:0 0 6px #0005}
.pops .pop,.pops .pet{opacity:0;animation:rs-pop var(--t) cubic-bezier(.3,.55,.4,1) var(--d) forwards}
.fall .pet{opacity:0;animation:rs-fall var(--t) linear var(--d) infinite}
/* gate: closed curtain -> stage -> zoom into the chandelier -> invitation */
.gate{position:fixed;inset:0;z-index:100;overflow:hidden;background:#12030a}
.gate.gone{display:none}
.gate .frame{height:100%;overflow:hidden}
.gate .lay{opacity:0}
.gate .l-stage{opacity:1;filter:brightness(.35) saturate(.8);transform-origin:50% 24%}
.gate .l-zoom{transform-origin:50% 22%}.gate .l-chand{transform-origin:50% 16%}.gate .l-oval{transform-origin:50% 10%}
.gate .pops{z-index:6}
.cv{position:absolute;inset:0;z-index:8;background:url('${IMG.cover}') 50% 0/cover no-repeat;transition:transform 2.3s cubic-bezier(.62,0,.22,1) .1s;will-change:transform}
.cv.l{clip-path:inset(0 50% 0 0)}.cv.r{clip-path:inset(0 0 0 50%)}
.cv:after{content:'';position:absolute;top:0;bottom:0;width:26%;pointer-events:none;background:linear-gradient(90deg,transparent,#000b)}
.cv.l:after{right:50%}.cv.r:after{left:50%;transform:scaleX(-1)}
.cv-fx{position:absolute;inset:0;z-index:9;pointer-events:none;transition:opacity .8s}
.cv-fx .lamp{--ly:38%;width:26%}.cv-fx .lamp.l{left:8%}
.cv-fx .sp{opacity:.9}
.gate.open .cv.l{transform:translateX(-101%)}.gate.open .cv.r{transform:translateX(101%)}
.gate.open .cv-fx{opacity:0}
.g-ui{position:absolute;inset:0;z-index:12;display:flex;align-items:center;justify-content:center;pointer-events:none}
.g-hit{all:unset;box-sizing:border-box;cursor:pointer;pointer-events:auto;display:flex;flex-direction:column;align-items:center;gap:18px;padding:34px 44px;margin-top:6svh;transition:opacity .6s,transform .6s}
.gate.open .g-hit{opacity:0;transform:scale(.92);pointer-events:none}
.g-hit:focus-visible .g-tap{text-decoration:underline;text-underline-offset:8px}
.g-ring{width:66px;height:66px;border-radius:50%;border:1.5px solid #f3dca1cc;position:relative;animation:rs-ring 2.4s ease-out infinite}
.g-ring:after{content:'';position:absolute;inset:24px;border-radius:50%;background:#f3dca1;opacity:.9}
.g-tap{font:400 clamp(32px,9vw,46px)/1.1 var(--nf);color:#f6e2ae;text-shadow:0 2px 16px #000,0 0 24px #000a}
.g-orn{width:min(60vw,240px);height:10px}
.g-orn:before{content:'';display:block;height:1px;margin-top:5px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.g-skip{all:unset;cursor:pointer;position:absolute;z-index:13;left:50%;bottom:calc(20px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);padding:10px 18px;font:600 10px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#f3dca1cc;opacity:0;pointer-events:none}
.gate.open .g-skip{animation:rs-skip .6s ease 1.8s forwards;pointer-events:auto}
.gate.open{animation:rs-gone .9s ease 6.9s forwards}
.gate.open .l-stage{animation:rs-stage 3.8s linear forwards}
.gate.open .l-zoom{animation:rs-in 2.8s ease-out 2.5s forwards}
.gate.open .l-chand{animation:rs-in 2.6s ease-out 4s forwards}
.gate.open .l-oval{animation:rs-oval 2.4s ease-out 5.2s forwards}
.gate.skip *{animation-duration:.01s!important;animation-delay:0s!important;transition-duration:.01s!important;transition-delay:0s!important}
/* hero: oval frame with chandelier */
.hero{position:relative;background:var(--deep);overflow:hidden}
.hero-art{container-type:inline-size;aspect-ratio:922/1705;min-height:100vh;min-height:100svh;background:url('${IMG.oval}') 50% 0/cover no-repeat;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.hero-art>.fall{z-index:2}
.hero-art .glow,.hero-art .rays,.hero-art .lamp,.hero-art .sp{z-index:1}
.hero-in{position:relative;z-index:8;display:flex;flex-direction:column;align-items:center;width:100%;padding:max(21svh,38cqw) 17% max(19svh,34cqw)}
.bism{font:400 clamp(20px,min(6cqw,3.4svh),30px)/1.5 AtelierAmiri,Amiri,'Noto Naskh Arabic',serif;color:var(--gold2);margin:0 0 2px;direction:rtl;text-shadow:0 2px 12px #000a}
.orn-line{display:flex;align-items:center;gap:10px;width:min(46cqw,200px);margin:4px 0 8px;color:var(--gold)}
.orn-line:before,.orn-line:after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--gold))}.orn-line:after{transform:scaleX(-1)}
.orn-line i{width:6px;height:6px;transform:rotate(45deg);background:var(--gold)}
.intro{font:600 clamp(8.5px,min(2.4cqw,1.3svh),10.5px)/1.9 Arial,sans-serif;letter-spacing:2.4px;text-transform:uppercase;color:#f8ecd6;max-width:100%;margin:0 0 min(1.6svh,14px);opacity:.95}
.lbl{font:600 clamp(8px,min(2.3cqw,1.2svh),10px)/1.5 Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin:min(1.2svh,10px) 0 0}
.nm{font:400 clamp(30px,min(10.4cqw,5.6svh),64px)/1.1 var(--nf);color:#fff3d6;margin:0;text-shadow:0 3px 20px #000b,0 0 26px #d9b46a2e;overflow-wrap:anywhere;max-width:100%}
.par{font:italic 400 clamp(13px,min(3.8cqw,2.1svh),17px)/1.45 var(--bf);color:#f1dec0;margin:0 0 2px;max-width:100%;overflow-wrap:anywhere}
.amp{font:400 clamp(26px,min(8cqw,4.2svh),44px)/1 var(--nf);color:var(--gold);margin:2px 0 0}
.msg{font:italic 400 clamp(13.5px,min(3.9cqw,2.1svh),17px)/1.65 var(--bf);color:#f8ecd6;max-width:100%;margin:min(2svh,16px) 0 0;white-space:pre-wrap;overflow-wrap:anywhere}
.scr{position:relative;z-index:8;margin-top:min(2.2svh,18px);font:600 9px Arial,sans-serif;letter-spacing:5px;color:var(--gold);display:flex;flex-direction:column;align-items:center;gap:6px;text-transform:uppercase}
.scr:after{content:'';width:1px;height:24px;background:linear-gradient(var(--gold),transparent);animation:rs-line 2s ease-in-out infinite}
body.rs-wait .hv{opacity:0}
body:not(.rs-wait) .hv{animation:rs-up .95s cubic-bezier(.2,.7,.2,1) var(--d,0s) both}
/* scratch-to-reveal section uses the framed picture */
.scr-sec{background:#ecddc4;overflow:hidden}
.scr-art{position:relative;aspect-ratio:882/1500;background:url('${IMG.scratch}') 50% 0/100% auto no-repeat;color:var(--ink);text-align:center}
.sc-head{position:absolute;left:6%;right:6%;top:19.5%}
.kick{font:700 11px/1.5 Arial,sans-serif;letter-spacing:4px;text-transform:uppercase;color:#8b1424;margin:0}
.ttl{font:400 clamp(34px,10vw,54px)/1.12 var(--nf);color:var(--ink);margin:6px 0 4px;overflow-wrap:anywhere}
.scratch{position:absolute;left:13.9%;width:73.7%;top:46.3%;height:25.7%;border-radius:10px;overflow:hidden}
.plate{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;color:#fff3d6;text-shadow:0 2px 12px #000a}
.plate .dw{font:700 clamp(9px,2.6vw,12px) Arial,sans-serif;letter-spacing:5px;color:var(--gold2);text-transform:uppercase}
.plate .dd{font:400 clamp(52px,17vw,84px)/1 var(--nf);color:#fff3d6}
.plate .dm{font:600 clamp(10px,3vw,13px) Arial,sans-serif;letter-spacing:4px;color:var(--gold2);text-transform:uppercase}
.plate .dt{font:italic clamp(14px,4vw,18px) var(--bf);color:#f6e6c6;margin-top:2px}
#rs-foil{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab;transition:opacity .9s ease}
.scratch.done #rs-foil{opacity:0;pointer-events:none}
.tapreveal{all:unset;position:absolute;left:0;right:0;top:77.5%;cursor:pointer;font:600 11px Arial,sans-serif;letter-spacing:2.4px;color:#8b1424;text-decoration:underline;text-underline-offset:4px;text-transform:uppercase}
.tapreveal:focus-visible{outline:2px solid #8b1424;outline-offset:4px}
.scratch.done~.tapreveal{display:none}
.cd{position:absolute;left:0;right:0;top:80%;display:flex;justify-content:center;gap:9px;opacity:0;transform:translateY(10px);transition:opacity .8s ease .5s,transform .8s ease .5s}
.scratch.done~.cd,.cd.on{opacity:1;transform:none}
.cd div{min-width:58px;padding:7px 4px 5px;border:1px solid #b8923f77;border-radius:10px;background:#fff6e2aa}
.cd b{display:block;font:400 26px/1.1 var(--nf);color:var(--red)}
.cd small{font:700 8.5px Arial,sans-serif;letter-spacing:2.2px;color:#8b6a2a;text-transform:uppercase}
#rs-burst{position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:3}
#rs-burst i{position:absolute;left:50%;top:50%;width:var(--w);height:calc(var(--w)*1.6);border-radius:80% 0 80% 0;background:linear-gradient(135deg,#e0283f,#8a1020);opacity:0;animation:rs-burst 1.7s ease-out var(--d) forwards}
/* paper sections */
.paper.nog{padding-top:70px}
.paper{position:relative;background-color:var(--paper);color:var(--ink);text-align:center;padding:104px 22px 84px;overflow:hidden;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .33 0 0 0 0 .2 0 0 0 .08 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}
.paper.alt{background-color:#e8d6ba}
.gw{position:absolute;left:50%;width:min(100%,560px);height:auto;transform:translateX(-50%);pointer-events:none;z-index:1}
.gw.top{top:4px}.gw.bot{bottom:4px;transform:translateX(-50%) scaleY(-1)}
.inner{position:relative;max-width:520px;margin:0 auto}
.divider{display:flex;align-items:center;justify-content:center;gap:12px;margin:12px auto 26px;width:min(60vw,240px);color:#b8923f}
.divider:before,.divider:after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,#b8923f)}.divider:after{transform:scaleX(-1)}
.divider i{width:7px;height:7px;transform:rotate(45deg);background:#b8923f}
/* slider */
.slider{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px calc(50% - min(39vw,170px)) 18px;margin:0 -22px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.slider::-webkit-scrollbar{display:none}
.slide{flex:0 0 min(78vw,340px);aspect-ratio:3/4;scroll-snap-align:center;border-radius:200px 200px 18px 18px;overflow:hidden;position:relative;border:3px solid #fff6e2;box-shadow:0 14px 34px #4a0d1755,0 0 0 1px #c9a050;background:#d8c29c;cursor:zoom-in}
.slide img{width:100%;height:100%;object-fit:cover;display:block}
.slide:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,#4a0a1666)}
.dots{display:flex;justify-content:center;gap:8px;margin-top:6px}
.dots b{width:7px;height:7px;border-radius:50%;border:1px solid #8b1424;transition:all .3s}
.dots b.on{background:#8b1424;width:20px;border-radius:5px}
.lightbox{position:fixed;inset:0;z-index:90;background:#000d;display:none;align-items:center;justify-content:center;padding:18px;cursor:zoom-out}
.lightbox.on{display:flex}.lightbox img{max-width:100%;max-height:100%;border-radius:10px;box-shadow:0 0 40px #000}
/* timeline */
.tl{position:relative;max-width:440px;margin:6px auto 0;text-align:left}
.tl:before{content:'';position:absolute;left:112px;top:8px;bottom:8px;width:1px;background:linear-gradient(transparent,#b8923f 10%,#b8923f 90%,transparent)}
.tl-row{display:grid;grid-template-columns:96px 1fr;gap:34px;padding:12px 0;position:relative}
.tl-row:before{content:'';position:absolute;left:108px;top:22px;width:9px;height:9px;border-radius:50%;background:#8b1424;box-shadow:0 0 0 4px #eddcc4,0 0 0 5px #b8923f;animation:rs-pulse 2.6s ease-in-out infinite}
.tl-t{font:700 12px/1.5 Arial,sans-serif;letter-spacing:1.6px;color:#8b1424;text-align:right;padding-top:3px;text-transform:uppercase}
.tl-n{font:600 clamp(21px,5.6vw,25px)/1.25 var(--bf);color:var(--ink);margin:0}
.tl-d{font:italic 15px/1.5 var(--bf);color:#6b4a40;margin:2px 0 0}
/* event cards */
.cards{display:grid;gap:18px;max-width:440px;margin:6px auto 0}
.ecard{position:relative;padding:28px 18px 26px;border:1px solid #b8923f99;border-radius:6px;background:#f6ead2aa;box-shadow:0 8px 22px #4a0d1722}
.ecard:before{content:'';position:absolute;inset:6px;border:1px solid #b8923f55;border-radius:3px;pointer-events:none}
.ecard h3{font:400 clamp(30px,8.4vw,38px)/1.2 var(--nf);color:var(--ink);margin:0 0 4px;overflow-wrap:anywhere}
.ecard .ed{font:700 11px/1.7 Arial,sans-serif;letter-spacing:2.4px;color:#8b1424;text-transform:uppercase}
.ecard .ep{font:italic 17px/1.5 var(--bf);color:#6b4a40;margin:6px 0 16px;overflow-wrap:anywhere;white-space:pre-line}
.mapbtn{display:inline-block;padding:13px 24px;border:1px solid #b8923f;color:var(--ink);text-decoration:none;font:700 10.5px Arial,sans-serif;letter-spacing:2.6px;text-transform:uppercase;border-radius:3px;background:#fff6e288;transition:background .3s,color .3s,transform .3s}
.mapbtn:hover,.mapbtn:focus-visible{background:#8b1424;color:#fff3d6;transform:translateY(-2px)}
/* closing */
.fam{white-space:pre-wrap;font:italic 18px/1.8 var(--bf);color:#5e3a34;max-width:440px;margin:0 auto 22px;overflow-wrap:anywhere}
.close{font:400 clamp(22px,6vw,28px)/1.6 var(--bf);color:var(--ink);max-width:440px;margin:0 auto 6px;white-space:pre-wrap;overflow-wrap:anywhere}
.sign{font:400 clamp(36px,10vw,50px)/1.2 var(--nf);color:var(--red);margin:14px 0 4px;overflow-wrap:anywhere}
.small{font:600 10px Arial,sans-serif;letter-spacing:2.6px;color:#8b6a2a;text-transform:uppercase}
.rsvp{display:inline-block;margin:6px 0 20px;padding:14px 30px;border-radius:40px;background:linear-gradient(135deg,#f3dca1,#c9a050);color:#3b0711;text-decoration:none;font:700 11px Arial,sans-serif;letter-spacing:3px;box-shadow:0 8px 20px #4a0d1744}
.credit{padding:18px;text-align:center;background:var(--deep);color:#9b7c58;font:10px Arial,sans-serif;letter-spacing:2px}
/* music */
.mbtn{position:fixed;right:14px;bottom:14px;z-index:80;width:46px;height:46px;border-radius:50%;border:1px solid #fff3c9;background:linear-gradient(135deg,#f3dca1,#c9a050);color:#3b0711;font-size:19px;cursor:pointer;box-shadow:0 6px 18px #0008;display:none}
.mbtn.on{display:block}.mbtn.play{animation:rs-ring 2.4s ease-out infinite}
/* reveal on scroll */
.rs-js .rv{opacity:0;transform:translateY(26px);transition:opacity .9s ease var(--d,0s),transform .9s cubic-bezier(.2,.7,.2,1) var(--d,0s)}
.rs-js .rv.in{opacity:1;transform:none}
/* editor preview helpers */
.rs-prev [data-rs]{cursor:pointer;border-radius:4px}
.rs-prev [data-rs]:hover{outline:1px dashed #f3dca1;outline-offset:3px}
.rs-prev .slide{cursor:pointer}
@keyframes rs-glow{0%,100%{opacity:.55;transform:translate(-50%,-50%) scale(.94)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.06)}}
@keyframes rs-rays{0%,100%{opacity:.18;transform:rotate(-2.2deg)}50%{opacity:.5;transform:rotate(2.2deg)}}
@keyframes rs-flick{0%,100%{opacity:.7;transform:translate(-50%,-50%) scale(1)}25%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}55%{opacity:.78;transform:translate(-50%,-50%) scale(.95)}80%{opacity:.95;transform:translate(-50%,-50%) scale(1.05)}}
@keyframes rs-twk{0%,100%{transform:translate(-50%,-50%) scale(0) rotate(0)}45%{transform:translate(-50%,-50%) scale(1) rotate(45deg)}70%{transform:translate(-50%,-50%) scale(.3) rotate(80deg)}}
@keyframes rs-pop{0%{opacity:0;transform:translate3d(0,0,0) scale(0) rotate(0)}7%{opacity:1;transform:translate3d(0,7vh,0) scale(1.3) rotate(var(--r))}13%{transform:translate3d(0,5vh,0) scale(1) rotate(var(--r))}70%{opacity:1}100%{opacity:0;transform:translate3d(var(--dx),112vh,0) scale(.9) rotate(var(--r2))}}
@keyframes rs-fall{0%{opacity:0;transform:translate3d(0,0,0) rotate(0)}8%{opacity:.85}85%{opacity:.7}100%{opacity:0;transform:translate3d(var(--dx),108svh,0) rotate(var(--r2))}}
@keyframes rs-stage{0%{filter:brightness(.35) saturate(.8);transform:scale(1)}18%{filter:brightness(1.1) saturate(1.1)}100%{filter:brightness(1.12) saturate(1.1);transform:scale(1.2)}}
@keyframes rs-in{0%{opacity:0;transform:scale(1.02)}32%{opacity:1}100%{opacity:1;transform:scale(1.16)}}
@keyframes rs-oval{0%{opacity:0;transform:scale(1.1)}38%{opacity:1}100%{opacity:1;transform:scale(1)}}
@keyframes rs-gone{to{opacity:0;visibility:hidden}}
@keyframes rs-skip{to{opacity:.85}}
@keyframes rs-ring{0%{box-shadow:0 0 0 0 #f3dca177}100%{box-shadow:0 0 0 22px #f3dca100}}
@keyframes rs-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@keyframes rs-line{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
@keyframes rs-pulse{0%,100%{box-shadow:0 0 0 4px #eddcc4,0 0 0 5px #b8923f}50%{box-shadow:0 0 0 4px #eddcc4,0 0 0 9px #b8923f55}}
@keyframes rs-burst{0%{opacity:0;transform:translate(0,0) rotate(0) scale(.4)}12%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r)) scale(1)}}
@media(max-width:380px){.tl:before{left:96px}.tl-row{grid-template-columns:82px 1fr;gap:30px}.tl-row:before{left:92px}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}.rs-js .rv{opacity:1;transform:none}.pops,.fall,.sp{display:none}.gate.open{visibility:hidden}}
@media print{.gate,.mbtn,.fall{display:none!important}body.rs-locked{overflow:visible;height:auto}.rs-js .rv{opacity:1;transform:none}}
${m.customCSS}`;
/* ---------------------------------------------------------------- model + markup */
function parseEvents(text){
 return String(text||'').split('\n').map(l=>l.trim()).filter(Boolean).slice(0,6).map(l=>{
  const [title='',date='',place='',map='']=l.split('|').map(x=>x.trim());
  return {title:title.slice(0,70),date:date.slice(0,90),place:place.slice(0,200),map:safeMap(map)};
 }).filter(e=>e.title);
}
function model(d){
 const t=(k,def,max)=>str(d[k],max||300)||def;
 const w=when(d.date),prev=!!d._editorPreview,animate=d.animation!==false;
 const photos=(d.photos||[]).filter(s=>typeof s==='string'&&/^data:image\/(jpeg|png|webp);base64,|^\/media\//.test(s));
 const music=typeof d.music==='string'&&/^data:audio\/[\w.+-]+;base64,|^\/media\//.test(d.music)?d.music:'';
 let events=parseEvents(d.eventsText);
 if(!events.length){
  const cardDate=[w?`${w.day}, ${w.date} ${w.month} ${w.year}`:'',str(d.timeText,80)||(w?w.time:'')].filter(Boolean).join(' · ');
  if(str(d.venue,180))events.push({title:str(d.venueLabel,40)||'The ceremony',date:cardDate,place:[str(d.venue,180),str(d.address,300)].filter(Boolean).join('\n'),map:safeMap(d.mapUrl||'')});
  if(str(d.venueGroom,180))events.push({title:str(d.venueGroomLabel,40)||'The celebration',date:[str(d.receptionDate,80),str(d.receptionTime,80)].filter(Boolean).join(' · '),place:[str(d.venueGroom,180),str(d.addressGroom,300)].filter(Boolean).join('\n'),map:safeMap(d.mapUrlGroom||'')});
 }
 const custom=customFontCSS(d);
 const bodyFont="'Cormorant Garamond','AtelierSerif',Georgia,serif";
 const nameFont=fontFamily(d.font&&d.font!=='serif'?d.font:'allura',!!custom);
 const muslim=!['Hindu','Christian'].includes(d.tradition);
 return {
  prev,animate,gate:animate&&!prev,photos,music,events,w,custom,customCSS:custom,nameFont,bodyFont,
  autoplay:d.musicAutoplay!==false,
  n1:str(d.name1,90)||'Bride Name',n2:str(d.name2,90)||'Groom Name',
  p1:str(d.parents1,200),p2:str(d.parents2,200),
  open:t('rsOpen','Tap to open',40),
  bism:muslim?t('rsBismillah','\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650',200):str(d.rsBismillah,200),
  intro:t('rsIntro','With the blessings of Allah and our families, you are warmly invited to the Nikah of',160),
  l1:t('rsLabel1','Daughter of',40),l2:t('rsLabel2','Son of',40),
  message:str(d.message,3000),
  dateKick:t('rsDateKicker','Save the date',60),dateTitle:t('rsDateTitle','Scratch to reveal the date',60),
  storyKick:t('rsStoryKicker','Our journey',60),storyTitle:t('rsStoryTitle','A few moments we cherish',80),
  dayKick:t('rsDayKicker','The day ahead',60),dayTitle:t('rsDayTitle','Schedule of the day',80),
  evTitle:t('rsEventsTitle','Where to find us',80),
  closing:t('rsClosing','Your presence and duas will make our day complete.',300),
  scroll:t('rsScroll','Scroll',30),
  schedule:(Array.isArray(d.schedule)?d.schedule:[]).filter(s=>s&&s.title).slice(0,8),
  family:str(d.family,1500),rsvp:safeHttps(d.rsvpUrl||''),
  from:str(d.wishesFrom,120)||str(d.compliments,200),
  timeText:str(d.timeText,80)||(w?w.time:''),
  heading:str(d.heading,140),
  dateIso:/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?[+-]\d{2}:\d{2}$/.test(d.date||'')?d.date:''
 };
}
const ed=(f,tag,cls,html,extra)=>`<${tag} class="${cls}" data-rs="${f}"${extra||''}>${html}</${tag}>`;

function body(m){
 const w=m.w;
 const hero=`<header class="hero" id="top"><div class="frame hero-art">${lights('8%','55%')}${fall(14)}<div class="hero-in">
 ${m.bism?ed('rsBismillah','p','bism hv',esc(m.bism),' style="--d:.1s" lang="ar" dir="rtl"'):''}
 <div class="orn-line hv" style="--d:.25s"><i></i></div>
 ${ed('rsIntro','p','intro hv',esc(m.intro),' style="--d:.4s"')}
 ${m.p1&&/^\s*d\s*\/\s*o\b/i.test(m.p1)?'':`<p class="lbl hv" data-rs="rsLabel1" style="--d:.55s">${esc(m.l1)}</p>`}
 ${ed('name1','h1','nm hv',esc(m.n1),' style="--d:.7s"')}
 ${m.p1?ed('parents1','p','par hv',esc(m.p1),' style="--d:.85s"'):''}
 <div class="amp hv" style="--d:1s">&amp;</div>
 ${m.p2&&/^\s*s\s*\/\s*o\b/i.test(m.p2)?'':`<p class="lbl hv" data-rs="rsLabel2" style="--d:1.1s">${esc(m.l2)}</p>`}
 ${ed('name2','h1','nm hv',esc(m.n2),' style="--d:1.25s"')}
 ${m.p2?ed('parents2','p','par hv',esc(m.p2),' style="--d:1.4s"'):''}
 ${m.message?ed('message','p','msg hv',esc(m.message),' style="--d:1.6s"'):''}
 ${ed('rsScroll','div','scr hv',esc(m.scroll),' style="--d:1.9s"')}
 </div></div></header>`;
 const dateSec=`<section class="scr-sec" id="date"><div class="frame scr-art">
 <div class="sc-head">${ed('rsDateKicker','p','kick rv',esc(m.dateKick))}${ed('rsDateTitle','h2','ttl rv',esc(m.dateTitle),' style="--d:.1s"')}</div>
 <div class="scratch" id="rs-scratch"><div class="plate">${w?`<span class="dw">${esc(w.day)}</span><span class="dd">${esc(w.date)}</span><span class="dm">${esc(w.month)} ${esc(w.year)}</span>${m.timeText?`<span class="dt">${esc(m.timeText)}</span>`:''}`:`<span class="dm">Date to be announced</span>`}</div><div id="rs-burst"></div><canvas id="rs-foil" aria-label="Scratch to reveal the date"></canvas></div>
 <button type="button" class="tapreveal" id="rs-tap">Or tap here to reveal</button>
 ${m.dateIso?`<div class="cd" id="rs-cd"><div><b id="cd-d">0</b><small>Days</small></div><div><b id="cd-h">0</b><small>Hours</small></div><div><b id="cd-m">0</b><small>Min</small></div><div><b id="cd-s">0</b><small>Sec</small></div></div>`:''}
 </div></section>`;
 const gar=pos=>`<img class="gw ${pos}" src="${IMG.garland}" alt="" loading="lazy">`;
 const slides=m.photos.map((src,i)=>`<div class="slide" data-i="${i}"><img src="${esc(src)}" alt="Wedding photo ${i+1}" loading="lazy"></div>`).join('');
 let firstSec=true;const gt=()=>{const g=firstSec?'':gar('top');firstSec=false;return g},nog=()=>firstSec?' nog':'';
 const storySec=m.photos.length?`<section class="paper${nog()}" id="story">${gt()}<div class="inner">
 ${ed('rsStoryKicker','p','kick rv',esc(m.storyKick))}${ed('rsStoryTitle','h2','ttl rv',esc(m.storyTitle),' style="--d:.1s"')}
 <div class="divider rv"><i></i></div></div>
 <div class="slider rv" id="rs-slider" style="--d:.15s">${slides}</div>${m.photos.length>1?`<div class="dots">${m.photos.map((_,i)=>`<b${i?'':' class="on"'}></b>`).join('')}</div>`:''}</section>`:'';
 const tl=m.schedule.length?`<section class="paper alt${nog()}" id="day">${gt()}<div class="inner">
 ${ed('rsDayKicker','p','kick rv',esc(m.dayKick))}${ed('rsDayTitle','h2','ttl rv',esc(m.dayTitle),' style="--d:.1s"')}
 <div class="divider rv"><i></i></div>
 <div class="tl" data-rs="schedule">${m.schedule.map((s,i)=>`<div class="tl-row rv" style="--d:${(i*.1).toFixed(1)}s"><div class="tl-t">${esc(s.time||'')}</div><div><p class="tl-n">${esc(s.title)}</p>${s.detail?`<p class="tl-d">${esc(s.detail)}</p>`:''}</div></div>`).join('')}</div>
 </div></section>`:'';
 const cards=m.events.length?`<section class="paper${nog()}" id="events">${gt()}<div class="inner">
 ${ed('rsEventsTitle','h2','ttl rv',esc(m.evTitle))}<div class="divider rv"><i></i></div>
 <div class="cards" data-rs="eventsText">${m.events.map((e,i)=>`<article class="ecard rv" style="--d:${(i*.12).toFixed(2)}s"><h3>${esc(e.title)}</h3>${e.date?`<div class="ed">${esc(e.date)}</div>`:''}${e.place?`<p class="ep">${esc(e.place)}</p>`:''}${e.map?`<a class="mapbtn" href="${esc(e.map)}" target="_blank" rel="noopener noreferrer">View on Google Maps</a>`:''}</article>`).join('')}</div>
 </div></section>`:'';
 const end=`<section class="paper alt${nog()}" id="with-love">${gt()}<div class="inner">
 ${m.family?ed('family','p','fam rv',esc(m.family)):''}
 ${m.rsvp?`<a class="rsvp rv" href="${esc(m.rsvp)}" target="_blank" rel="noopener noreferrer">RSVP</a>`:''}
 ${ed('rsClosing','p','close rv',esc(m.closing),' style="--d:.1s"')}
 <div class="divider rv"><i></i></div>
 <p class="sign rv" data-rs="name1">${esc(m.n1)} &amp; ${esc(m.n2)}</p>
 ${m.from?ed('wishesFrom','p','small rv',esc(m.from)):''}
 </div></section><div class="credit">Made with Mubiey Studio</div>`;
 const coverFx=`<div class="cv-fx" aria-hidden="true"><i class="lamp l"></i>${Array.from({length:9},(_,i)=>`<b class="sp" style="left:${rnd(i+60,4,40).toFixed(1)}%;top:${rnd(i+61,28,56).toFixed(1)}%;--z:${rnd(i+62,8,15).toFixed(0)}px;--d:${rnd(i+63,0,3).toFixed(2)}s"></b>`).join('')}</div>`;
 const gate=m.gate?`<div id="rs-gate" class="gate" role="dialog" aria-modal="true" aria-label="Open the invitation"><div class="frame">${layer('l-oval',IMG.oval,'8%','55%')}${layer('l-chand',IMG.chand,'25%','56%')}${layer('l-zoom',IMG.zoom,'20%','56%')}${layer('l-stage',IMG.stage,'18%','56%')}${pops(30)}<div class="cv l"></div><div class="cv r"></div>${coverFx}<div class="g-ui"><button type="button" class="g-hit" id="rs-open"><span class="g-ring"></span><span class="g-tap">${esc(m.open)}</span><span class="g-orn"></span></button></div><button type="button" class="g-skip" id="rs-skip">Skip</button></div></div>`:'';
 const audio=m.music?`<audio id="rs-music" loop preload="none" src="${esc(m.music)}"></audio><button type="button" class="mbtn on" id="rs-mbtn" aria-label="Play or pause music">\u266A</button>`:'';
 return `${DEFS}${gate}${hero}${dateSec}${storySec}${tl}${cards}${end}${audio}`;
}

/* ---------------------------------------------------------------- runtime (runs inside the invitation) */
const SCRIPT=`(()=>{
const R=window.RS||{},$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const audio=$('#rs-music'),mb=$('#rs-mbtn');
function play(){if(!audio)return;audio.play().then(()=>{mb&&mb.classList.add('play')}).catch(()=>{})}
if(mb)mb.onclick=()=>{if(audio.paused)play();else{audio.pause();mb.classList.remove('play')}};
(R.imgs||[]).forEach(u=>{const i=new Image();i.src=u});
/* opening: curtain parts -> stage appears behind it -> roses pop from the top, lights glow -> camera pushes in -> invitation */
const gate=$('#rs-gate');
if(gate){
 document.body.classList.add('rs-wait','rs-locked');
 let done=false,t1,t2;
 const finish=()=>{if(done)return;done=true;clearTimeout(t1);clearTimeout(t2);document.body.classList.remove('rs-wait','rs-locked');gate.classList.add('gone');scrollTo(0,0)};
 const go=()=>{
  if(gate.classList.contains('open'))return;
  if(R.autoplay)play();
  gate.classList.add('open');
  t1=setTimeout(()=>document.body.classList.remove('rs-wait'),reduce?50:(R.t1||5700));
  t2=setTimeout(finish,reduce?250:(R.t2||7900));
 };
 $('#rs-open').onclick=go;
 $('#rs-skip').onclick=()=>{gate.classList.add('skip');document.body.classList.remove('rs-wait');setTimeout(finish,400)};
}
/* scroll reveal */
const rv=$$('.rv');
if('IntersectionObserver' in window&&!R.prev){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});rv.forEach(n=>io.observe(n))}else rv.forEach(n=>n.classList.add('in'));
/* scratch to reveal */
const sc=$('#rs-scratch'),cv=$('#rs-foil');
function burst(){const b=$('#rs-burst');if(!b||reduce)return;b.innerHTML='';for(let i=0;i<34;i++){const a=Math.random()*6.283,r=80+Math.random()*170,n=document.createElement('i');n.style.cssText='--w:'+(8+Math.random()*9)+'px;--dx:'+Math.cos(a)*r+'px;--dy:'+(Math.sin(a)*r-50)+'px;--r:'+(Math.random()*540)+'deg;--d:'+(Math.random()*.25)+'s';b.append(n)}setTimeout(()=>b.innerHTML='',2200)}
function reveal(){if(!sc||sc.classList.contains('done'))return;sc.classList.add('done');burst();const cd=$('#rs-cd');cd&&cd.classList.add('on')}
if(sc&&cv){
 const ctx=cv.getContext('2d');let cleared=false,last=null,n=0;
 const paint=()=>{
  const r=cv.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);cv.width=Math.max(2,Math.round(r.width*dpr));cv.height=Math.max(2,Math.round(r.height*dpr));
  const w=cv.width,h=cv.height,g=ctx.createLinearGradient(0,0,w,h);
  [[0,'#8d6a24'],[.25,'#ecd392'],[.5,'#b98d3a'],[.75,'#f6e0a6'],[1,'#9a742c']].forEach(a=>g.addColorStop(a[0],a[1]));
  ctx.globalCompositeOperation='source-over';ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  for(let i=0;i<320;i++){ctx.fillStyle='rgba(255,255,255,'+Math.random()*.2+')';ctx.fillRect(Math.random()*w,Math.random()*h,2*dpr,2*dpr)}
  ctx.strokeStyle='rgba(255,255,255,.13)';ctx.lineWidth=2*dpr;for(let x=-h;x<w;x+=18*dpr){ctx.beginPath();ctx.moveTo(x,h);ctx.lineTo(x+h,0);ctx.stroke()}
  ctx.fillStyle='rgba(74,13,23,.88)';ctx.textAlign='center';ctx.font='700 '+13*dpr+'px Arial';ctx.fillText('SCRATCH HERE',w/2,h/2-6*dpr);ctx.font='italic '+15*dpr+'px Georgia';ctx.fillText('to reveal our date',w/2,h/2+16*dpr);
 };
 const pos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height]};
 const draw=e=>{const p=pos(e),k=cv.width/cv.getBoundingClientRect().width;ctx.globalCompositeOperation='destination-out';ctx.strokeStyle='#000';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=46*k;ctx.beginPath();ctx.moveTo(last?last[0]:p[0],last?last[1]:p[1]);ctx.lineTo(p[0],p[1]);ctx.stroke();last=p;if(++n%6===0)check()};
 const check=()=>{if(cleared)return;const d=ctx.getImageData(0,0,cv.width,cv.height).data;let c=0,t=0;for(let i=3;i<d.length;i+=4*29){t++;if(d[i]<40)c++}if(c/t>.4){cleared=true;reveal()}};
 cv.addEventListener('pointerdown',e=>{last=null;cv.setPointerCapture(e.pointerId);draw(e)});
 cv.addEventListener('pointermove',e=>{if(e.buttons||e.pressure>0)draw(e)});
 ['pointerup','pointercancel'].forEach(t=>cv.addEventListener(t,()=>{last=null;check()}));
 paint();addEventListener('resize',()=>{if(!sc.classList.contains('done'))paint()});
 if(R.prev)sc.classList.add('done');
}
const tap=$('#rs-tap');if(tap)tap.onclick=reveal;
/* countdown */
const cdEl=$('#rs-cd');
if(cdEl&&R.dateIso){const t=Date.parse(R.dateIso),set=(id,v)=>{const e=$('#'+id);if(e)e.textContent=v};const tick=()=>{let s=Math.max(0,Math.floor((t-Date.now())/1000));set('cd-d',Math.floor(s/86400));set('cd-h',Math.floor(s%86400/3600));set('cd-m',Math.floor(s%3600/60));set('cd-s',s%60)};tick();setInterval(tick,1000)}
/* photo slider */
const sl=$('#rs-slider');
if(sl){
 const slides=$$('.slide'),dots=$$('.dots b'),lb=document.createElement('div');lb.className='lightbox';lb.innerHTML='<img alt="">';document.body.append(lb);lb.onclick=()=>lb.classList.remove('on');
 const step=()=>slides.length>1?slides[1].offsetLeft-slides[0].offsetLeft:sl.clientWidth;
 const idx=()=>Math.min(slides.length-1,Math.max(0,Math.round(sl.scrollLeft/step())));
 sl.addEventListener('scroll',()=>{const i=idx();dots.forEach((d,k)=>d.classList.toggle('on',k===i))},{passive:true});
 slides.forEach((s,i)=>s.addEventListener('click',()=>{if(R.prev){parent.postMessage({type:'mubiey-direct-photo',index:i},'*');return}lb.firstChild.src=s.querySelector('img').src;lb.classList.add('on')}));
 if(slides.length>1&&!reduce&&!R.prev){let hold=false,vis=false;['pointerdown','touchstart','wheel'].forEach(t=>sl.addEventListener(t,()=>{hold=true;setTimeout(()=>hold=false,9000)},{passive:true}));
  if('IntersectionObserver' in window)new IntersectionObserver(es=>vis=es[0].isIntersecting,{threshold:.5}).observe(sl);
  setInterval(()=>{if(hold||!vis)return;const i=(idx()+1)%slides.length;sl.scrollTo({left:i*step(),behavior:'smooth'})},4600)}
}
/* editor preview: tap any text to edit it */
if(R.prev){document.body.classList.add('rs-prev');$$('[data-rs]').forEach(n=>n.addEventListener('click',e=>{e.preventDefault();parent.postMessage({type:'mubiey-rs-edit',field:n.dataset.rs},'*')}))}
})();`;

const json=o=>JSON.stringify(o).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
function render(d){
 const m=model(d);
 const fonts=fontCSS();
 const rt={prev:m.prev,autoplay:m.autoplay,dateIso:m.dateIso,imgs:m.gate?[IMG.stage,IMG.zoom,IMG.chand,IMG.oval,IMG.scratch]:[]};
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>${esc(m.n1)} &amp; ${esc(m.n2)} — Wedding invitation</title><script>document.documentElement.classList.add('rs-js')<\/script><style>${fonts}${CSS(m)}</style><noscript><style>.gate{display:none}body.rs-locked{overflow:auto}.rv{opacity:1!important;transform:none!important}</style></noscript></head><body class="${m.gate?'rs-locked rs-wait':''}${m.prev?' rs-prev':''}">${body(m)}<script>window.RS=${json(rt)};<\/script><script>${SCRIPT.replace(/<\/script/gi,'<\\/script')}<\/script></body></html>`;
}
/* shared pieces for the other art-based live templates (art-live.js) */
window.MubieyRS={model,esc,ed,rnd,parseEvents,SCRIPT,json,fontCSS,DEFS,when};
invitationDocument=function(data){return data&&data.template===TEMPLATE?render(data):baseDocument.apply(this,arguments)};
})();
