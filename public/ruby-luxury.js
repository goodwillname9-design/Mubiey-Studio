/* Mubiey Studio · "Ruby Luxury" live invitation (template id: ruby-luxury).

   1. Opening: a full-screen ruby glitter surface that shimmers. Tap it and the glitter breaks into thousands of
      tiny pieces that float away and vanish, revealing a closed velvet curtain.
   2. The curtain does not slide like a picture: it is cut into fabric strips that gather and fold towards both
      sides, one after another, like real velvet being drawn.
   3. Smoke drifts in from the left and the right and keeps swirling behind the names. Sparkles twinkle all the time.
   4. While scrolling, every section brings its own background (sparkle night, gold-dust velvet, velvet folds,
      glitter, curtains + smoke) that fades in softly while the previous one fades out.
   Then: scratch-to-reveal date + countdown, photo slider, schedule, event cards with map buttons, RSVP, closing.

   Owner controls (editor panel "Ruby Luxury · look & wording", see ruby-editor.js):
   - a logo space at the top-left (stored as the LAST photo of the invitation, shown only as the logo),
   - font + size for names, headings, lines and small caps, saved in the single field `rubyCfg` (JSON),
   - every wording uses the existing rs* fields, so tapping any text in the preview edits it.

   Standalone: it only wraps invitationDocument() like the other templates and returns one self-contained document.
   Artwork lives in /assets/ruby/ (your own pictures, watermarks removed, plus smoke cut out of your smoke picture). */
'use strict';
(()=>{
if(typeof invitationDocument!=='function'||typeof Studio==='undefined')return;
const TEMPLATE='ruby-luxury',baseDocument=invitationDocument;
const esc=v=>Studio.escape(v);
const str=(v,max)=>typeof v==='string'?v.trim().slice(0,max||400):'';
const ASSET=(typeof location!=='undefined'&&/^https?:$/.test(location.protocol)?location.origin:'')+'/assets/ruby/';

/* ------------------------------------------------------------------ helpers (same rules as the other templates) */
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
const customFontCSS=d=>{
 const f=d.customFont;
 if(!f||typeof f.data!=='string'||!/^data:(font\/(ttf|otf|woff2?)|application\/(font-woff2?|font-sfnt|x-font-[a-z0-9]+|octet-stream));base64,[A-Za-z0-9+/=]+$/.test(f.data))return '';
 const fmt={woff2:'woff2',woff:'woff',otf:'opentype',ttf:'truetype'}[f.format]||'truetype';
 return `@font-face{font-family:'MubieyCustom';src:url('${f.data}') format('${fmt}');font-display:swap}`;
};
const rnd=(i,a,b)=>{const v=Math.sin(i*127.1+311.7)*43758.5453;return a+(v-Math.floor(v))*(b-a)};
const json=o=>JSON.stringify(o).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const ed=(f,tag,cls,html,extra)=>`<${tag} class="${cls}" data-rs="${f}"${extra||''}>${html}</${tag}>`;
function parseEvents(text){
 return String(text||'').split('\n').map(l=>l.trim()).filter(Boolean).slice(0,6).map(l=>{
  const [title='',date='',place='',map='']=l.split('|').map(x=>x.trim());
  return {title:title.slice(0,70),date:date.slice(0,90),place:place.slice(0,200),map:safeMap(map)};
 }).filter(e=>e.title);
}

/* ------------------------------------------------------------------ owner settings (fonts, sizes, logo) */
const GROUPS=['names','heads','lines','small','arabic'];
const FONT_KEYS=['allura','parisienne','script','cinzel','playfair','serif','italic','montserrat','sans','amiri','malayalam','custom'];
const FAM={allura:'AtelierAllura',parisienne:'AtelierParisienne',script:'AtelierScript',cinzel:'AtelierCinzel',playfair:'AtelierPlayfair',serif:'AtelierSerif',italic:'AtelierSerif',montserrat:'AtelierMontserrat',amiri:'AtelierAmiri',malayalam:'AtelierMalayalam'};
const stack=(key,custom)=>{
 if(key==='custom'&&custom)return "'MubieyCustom',AtelierAmiri,AtelierMalayalam,Georgia,serif";
 if(key==='sans')return "Arial,AtelierAmiri,AtelierMalayalam,sans-serif";
 return `${FAM[key]||'AtelierSerif'},AtelierAmiri,AtelierMalayalam,'Cormorant Garamond',Georgia,serif`;
};
function readCfg(d){
 let c={};
 try{const j=JSON.parse(typeof d.rubyCfg==='string'&&d.rubyCfg?d.rubyCfg:'{}');if(j&&typeof j==='object')c=j}catch{}
 const f={},s={};
 for(const g of GROUPS){
  const fk=c.f&&typeof c.f[g]==='string'?c.f[g]:'';
  f[g]=FONT_KEYS.includes(fk)?fk:'';
  const sv=Number(c.s&&c.s[g]);
  s[g]=Number.isFinite(sv)?Math.min(160,Math.max(60,sv)):100;
 }
 const ls=Number(c.logoSize);
 return {f,s,logo:c.logo===true,logoSize:Number.isFinite(ls)?Math.min(220,Math.max(40,ls)):100};
}
const DEFAULT_FONT={names:'allura',heads:'cinzel',lines:'serif',small:'montserrat',arabic:'amiri'};
function invitationFontKey(d,hasCustom){
 if(hasCustom)return 'custom';
 const k=d.font,map={greatvibes:'script',cormorant:'serif',josefin:'sans'};
 const v=map[k]||k;
 return FONT_KEYS.includes(v)&&v!=='serif'&&v!=='custom'&&v!=='italic'?v:'allura';
}

/* ------------------------------------------------------------------ model */
function model(d){
 const cfg=readCfg(d),w=when(d.date),prev=!!d._editorPreview,animate=d.animation!==false;
 let photos=(d.photos||[]).filter(s=>typeof s==='string'&&/^data:image\/(jpeg|png|webp);base64,|^\/media\//.test(s));
 let logo='';              /* the owner's logo is drawn for every design by logo-overlay.js */
 const music=typeof d.music==='string'&&/^data:audio\/[\w.+-]+;base64,|^\/media\//.test(d.music)?d.music:'';
 let events=parseEvents(d.eventsText);
 if(!events.length){
  const cardDate=[w?`${w.day}, ${w.date} ${w.month} ${w.year}`:'',str(d.timeText,80)||(w?w.time:'')].filter(Boolean).join(' · ');
  if(str(d.venue,180))events.push({title:str(d.venueLabel,40)||'The ceremony',date:cardDate,place:[str(d.venue,180),str(d.address,300)].filter(Boolean).join('\n'),map:safeMap(d.mapUrl||'')});
  if(str(d.venueGroom,180))events.push({title:str(d.venueGroomLabel,40)||'The celebration',date:[str(d.receptionDate,80),str(d.receptionTime,80)].filter(Boolean).join(' · '),place:[str(d.venueGroom,180),str(d.addressGroom,300)].filter(Boolean).join('\n'),map:safeMap(d.mapUrlGroom||'')});
 }
 const custom=customFontCSS(d),hasCustom=!!custom;
 const base=invitationFontKey(d,hasCustom),fonts={};
 for(const g of GROUPS){
  const k=cfg.f[g]||(g==='names'?base:DEFAULT_FONT[g]);
  fonts[g]={fam:stack(hasCustom||k!=='custom'?k:DEFAULT_FONT[g],hasCustom),italic:k==='italic'||(g==='lines'&&!cfg.f[g])};
 }
 const muslim=!['Hindu','Christian'].includes(d.tradition);
 const t=(k,def,max)=>str(d[k],max||300)||def;
 return {
  prev,animate,gate:animate&&!prev,photos,logo,music,events,w,customCSS:custom,fonts,cfg,
  autoplay:d.musicAutoplay!==false,
  n1:str(d.name1,90)||'Bride Name',n2:str(d.name2,90)||'Groom Name',
  p1:str(d.parents1,200),p2:str(d.parents2,200),
  open:t('rsOpen','Tap to open',40),
  openLogo:typeof d.openLogo==='string'&&/^data:image\/(png|jpeg|webp);base64,/.test(d.openLogo)&&d.openLogo.length<200000?d.openLogo:'',
  bism:muslim?t('rsBismillah','\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650',200):str(d.rsBismillah,200),
  intro:t('rsIntro',muslim?'With the blessings of Allah and our families, you are warmly invited to the Nikah of':'Together with our families, we joyfully invite you to celebrate the wedding of',160),
  l1:t('rsLabel1','Daughter of',40),l2:t('rsLabel2','Son of',40),
  message:str(d.message,3000),
  dateKick:t('rsDateKicker','Save the date',60),dateTitle:t('rsDateTitle','Scratch to reveal the date',60),
  storyKick:t('rsStoryKicker','Our journey',60),storyTitle:t('rsStoryTitle','A few moments we cherish',80),
  dayKick:t('rsDayKicker','The day ahead',60),dayTitle:t('rsDayTitle','Schedule of the day',80),
  evTitle:t('rsEventsTitle','Where to find us',80),
  closing:t('rsClosing',muslim?'Your presence and duas will make our day complete.':'Your presence will make our day complete.',300),
  scroll:t('rsScroll','Scroll',30),
  schedule:(Array.isArray(d.schedule)?d.schedule:[]).filter(s=>s&&s.title).slice(0,8),
  family:str(d.family,1500),rsvp:safeHttps(d.rsvpUrl||''),
  from:str(d.wishesFrom,120)||str(d.compliments,200),
  timeText:str(d.timeText,80)||(w?w.time:''),
  dateIso:/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?[+-]\d{2}:\d{2}$/.test(d.date||'')?d.date:''
 };
}

/* ------------------------------------------------------------------ artwork pieces */
const STRIPS=14; /* fabric strips per curtain half */
function drape(){
 const n=STRIPS*2;let s='';
 for(let i=0;i<n;i++){
  const left=i<STRIPS,x0=i/n,x1=(i+1)/n,fx=left?x0:1-x1;
  const dl=((.5-fx)*1.05).toFixed(2),sk=((left?1:-1)*(1.4+rnd(i,0,2.2))).toFixed(2);
  s+=`<i class="st ${left?'l':'r'}" style="left:${(x0*100).toFixed(3)}%;width:${(100/n+.14).toFixed(3)}%;--fx:${fx.toFixed(4)};--dl:${dl}s;--sk:${sk}deg"><b style="left:calc(var(--W) * -${x0.toFixed(4)})"></b></i>`;
 }
 return `<div class="drape" id="rl-drape" aria-hidden="true">${s}<span class="dsh l"></span><span class="dsh r"></span></div>`;
}
function smoke(){
 /* [side, picture, width%, top%, offset%, delay s, in s, opacity, drift x, drift y, rotation, drift s] */
 const L=[['l','a',104,2,-20,.15,6.2,.6,5,3,4,15],['l','b',80,38,-8,.8,6.8,.55,6,-4,-5,17],['l','a',96,64,-26,1.5,7.4,.5,4,-5,6,19]];
 const R=[['r','b',82,6,-14,.45,6.4,.58,-5,4,-4,16],['r','a',104,40,-22,1.1,7,.55,-6,-3,5,18],['r','b',72,66,-8,1.8,7.6,.48,-4,5,-6,20]];
 return [...L,...R].map(([side,pic,w,top,off,dl,tin,o,dx,dy,rot,dur])=>`<div class="sm ${side}" style="${side==='l'?'left':'right'}:${off}%;top:${top}%;width:${w}%;--td:${dl}s;--ti:${tin}s;--o:${o};--dxm:${dx}%;--dym:${dy}%;--rot:${rot}deg;--tt:${dur}s"><div class="fl"><img src="${ASSET}smoke-${pic}.png" alt="" loading="eager" decoding="async"></div></div>`).join('');
}
function bgLayers(){
 return `<div class="bgs" aria-hidden="true">
<div class="bgl hero on" data-k="hero"><i class="spot"></i><i class="floor"></i><div class="smk"><i class="haze"></i>${smoke()}</div></div>
<div class="bgl" data-k="date" style="background-image:url('${ASSET}sparkle.jpg');--ov:rgba(10,0,5,.22)"></div>
<div class="bgl" data-k="story" style="background-image:url('${ASSET}velvet.jpg');--ov:rgba(22,0,9,.34)"></div>
<div class="bgl" data-k="day" style="background-image:url('${ASSET}curtain.jpg');--ov:rgba(16,0,6,.58)"></div>
<div class="bgl" data-k="events" style="background-image:url('${ASSET}glitter.jpg');--ov:rgba(28,0,9,.66)"></div>
<div class="bgl" data-k="end" style="background-image:url('${ASSET}stage.jpg');--ov:rgba(20,0,8,.3)"></div>
</div>`;
}

/* ------------------------------------------------------------------ styles */
const CSS=m=>{const f=m.fonts,s=m.cfg.s;return `
:root{--fn:${f.names.fam};--fh:${f.heads.fam};--fl:${f.lines.fam};--fs:${f.small.fam};--fa:${f.arabic.fam};--stl:${f.lines.italic?'italic':'normal'};--stn:${f.names.italic?'italic':'normal'};--sth:${f.heads.italic?'italic':'normal'};--sts:${f.small.italic?'italic':'normal'};
--sn:${(s.names/100).toFixed(2)};--sh:${(s.heads/100).toFixed(2)};--sl:${(s.lines/100).toFixed(2)};--ss:${(s.small/100).toFixed(2)};--sa:${(s.arabic/100).toFixed(2)};--sg:${(m.cfg.logoSize/100).toFixed(2)};--W:100vw;
--ruby:#a3102c;--ruby2:#5d0716;--deep:#1d0309;--gold:#e6c982;--gold2:#fbeab8;--gold3:#b78a3b;--cream:#fbefe3;color-scheme:dark}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{background:#12030a}
body{margin:0;background:#12030a;color:var(--cream);font:400 calc(18px*var(--sl))/1.7 var(--fl);font-style:var(--stl);overflow-x:hidden;-webkit-font-smoothing:antialiased}
body.rl-locked{overflow:hidden;height:100vh;height:100svh}
/* ---------- fixed stage: backgrounds, curtain, sparkles ---------- */
.bgs{position:fixed;inset:0;z-index:0;background:#12030a;overflow:hidden}
.bgl{position:absolute;inset:0;opacity:0;transform:scale(1.1);background-size:cover;background-position:center;transition:opacity 1.5s ease,transform 6.5s cubic-bezier(.2,.6,.2,1);will-change:opacity,transform}
.bgl.on{opacity:1;transform:scale(1)}
.bgl:not(.hero):after{content:'';position:absolute;inset:0;background:var(--ov,transparent)}
.bgl:not(.hero):before{content:'';position:absolute;inset:0;z-index:1;background:radial-gradient(ellipse at 50% 50%,transparent 52%,rgba(8,0,3,.62) 100%);pointer-events:none}
.bgl.hero{background:radial-gradient(ellipse at 50% 40%,#5e0b1f 0%,#350714 38%,#1a0309 72%,#0d0105 100%)}
.bgl .spot{position:absolute;inset:0;background:radial-gradient(ellipse 52% 40% at 50% 34%,rgba(255,206,150,.20),transparent 70%);animation:rl-breathe 7s ease-in-out infinite alternate}
.bgl .floor{position:absolute;left:0;right:0;bottom:0;height:24%;background:linear-gradient(0deg,rgba(255,206,216,.34),rgba(255,160,180,.12) 45%,transparent)}
.smk{position:absolute;inset:0;overflow:hidden;pointer-events:none;opacity:.7}
.haze{position:absolute;left:50%;top:50%;width:130%;height:70%;transform:translate(-50%,-50%);background:radial-gradient(closest-side,rgba(226,84,110,.24),rgba(226,84,110,0));mix-blend-mode:screen;opacity:0;transition:opacity 4s ease 1s}
body.rl-stage .haze{opacity:1;animation:rl-breathe 8s ease-in-out infinite alternate}
.sm{position:absolute;opacity:0;will-change:transform,opacity}
.sm.l{transform:translateX(-62%)}.sm.r{transform:translateX(62%)}
.sm .fl{display:block}.sm.r .fl{transform:scaleX(-1)}
.sm img{display:block;width:100%;height:auto;mix-blend-mode:screen;filter:blur(.7px);will-change:transform}
body.rl-stage .sm{animation:rl-smin var(--ti) cubic-bezier(.16,.62,.22,1) var(--td) forwards}
body.rl-stage .sm img{animation:rl-drift var(--tt) ease-in-out var(--td) infinite alternate}
body.rl-flat .sm{animation:none;opacity:var(--o);transform:none}
body.rl-flat .sm img{animation:rl-drift var(--tt) ease-in-out infinite alternate}
body.rl-flat .haze{opacity:1}
/* curtain halves, cut into strips that gather like cloth */
.drape{position:fixed;inset:0;z-index:4;pointer-events:none;overflow:hidden}
.st{position:absolute;top:0;bottom:0;overflow:hidden;will-change:transform;--dx:calc(var(--fx) * var(--W) * -.74)}
.st.r{--dx:calc(var(--fx) * var(--W) * .74)}
.st.l{transform-origin:0 50%}.st.r{transform-origin:100% 50%}
.st b{position:absolute;top:0;width:var(--W);height:100%;background:url('${ASSET}curtain.jpg') center/cover no-repeat}
.drape:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,0) 22%,rgba(0,0,0,0) 78%,rgba(0,0,0,.42))}
.dsh{position:absolute;top:0;bottom:0;width:15%;opacity:0;transition:opacity 1.6s ease 1.8s}
.dsh.l{left:7%;background:linear-gradient(90deg,rgba(0,0,0,.6),transparent)}.dsh.r{right:7%;background:linear-gradient(270deg,rgba(0,0,0,.6),transparent)}
.drape.go .dsh,.drape.done .dsh{opacity:1}
.drape.go .st{animation:rl-pull 3.6s cubic-bezier(.62,.03,.17,1) var(--dl) forwards}
.drape.done .st{animation:none;transform:translateX(var(--dx)) scaleX(.26)}
body.rl-past .drape{opacity:0}
.drape{transition:opacity 1.3s ease}
#rl-sp{position:fixed;inset:0;width:100%;height:100%;z-index:9;pointer-events:none}
/* logo space (top-left) */
.logo{position:fixed;z-index:130;top:calc(14px + env(safe-area-inset-top,0px));left:14px;height:calc(54px*var(--sg));max-width:44vw;display:flex;align-items:center;pointer-events:none}
.logo img{display:block;height:100%;width:auto;max-width:44vw;object-fit:contain;filter:drop-shadow(0 2px 10px rgba(0,0,0,.5))}
.logo.ph{pointer-events:auto;cursor:pointer;padding:0 14px;border:1px dashed rgba(251,234,184,.7);border-radius:10px;color:var(--gold2);font:600 calc(10px*var(--ss))/1.3 var(--fs);letter-spacing:2px;text-transform:uppercase;text-align:center;background:#0006;min-width:96px}
.logo.ph small{display:block;font-weight:400;letter-spacing:1px;opacity:.8;text-transform:none}
/* ---------- gate (glitter) ---------- */
.gate{position:fixed;inset:0;z-index:100;background:#3a030f;overflow:hidden}
.gate.open{background:transparent;pointer-events:none}
.gate.gone{display:none}
#rl-gc{position:absolute;inset:0;width:100%;height:100%;display:block}
.g-ui{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2;transition:opacity .7s ease}
.gate.open .g-ui{opacity:0}
.g-hit{all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:20px;padding:40px 46px;text-align:center}
.g-hit:focus-visible .g-tap{text-decoration:underline;text-underline-offset:9px}
.g-kick{font:600 calc(10.5px*var(--ss))/1.5 var(--fs);font-style:var(--sts);letter-spacing:5px;text-transform:uppercase;color:#fbeab8;text-shadow:0 1px 10px #000c}
.g-ring{width:70px;height:70px;border-radius:50%;border:1.5px solid #fbeab8cc;position:relative;animation:rl-ring 2.4s ease-out infinite;box-shadow:0 0 18px #0006}
.g-om{background:#fffaf0;padding:9px;overflow:hidden;animation:rl-ring 2.4s ease-out infinite}.g-om:after{display:none}.g-om img{width:100%;height:100%;object-fit:contain;border-radius:50%;display:block}
.g-ring:after{content:'';position:absolute;inset:25px;border-radius:50%;background:#fbeab8;box-shadow:0 0 14px #ffe9a8}
.g-tap{font:400 calc(clamp(34px,10vw,50px)*var(--sn))/1.1 var(--fn);font-style:var(--stn);color:#fff1c8;text-shadow:0 2px 16px #000,0 0 26px #000a;overflow-wrap:anywhere}
.g-orn{width:min(56vw,230px);height:1px;background:linear-gradient(90deg,transparent,#fbeab8,transparent)}
.g-skip{all:unset;cursor:pointer;position:absolute;z-index:3;left:50%;bottom:calc(20px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);padding:10px 18px;font:600 10px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#fbeab8cc;opacity:0;pointer-events:none;transition:opacity .6s ease}
.gate.open .g-skip{opacity:.85;pointer-events:auto;transition-delay:1.2s}
/* ---------- content ---------- */
main{position:relative;z-index:3}
.sec{position:relative;min-height:100vh;min-height:100svh;display:flex;align-items:center;justify-content:center;padding:92px 20px 84px;text-align:center}
.inner{position:relative;width:100%;max-width:520px;margin:0 auto}
.hero{padding:12svh 15vw 11svh}
.hero .inner{max-width:560px}
body.rl-wait .hv{opacity:0}
body:not(.rl-wait) .hv{animation:rl-up 1.5s cubic-bezier(.2,.7,.2,1) var(--d,0s) both}
.bism{font:400 calc(clamp(25px,7vw,34px)*var(--sa))/1.6 var(--fa);color:var(--gold2);margin:0 0 10px;direction:rtl;text-shadow:0 2px 14px #000a}
.intro{font:600 calc(clamp(10.5px,2.9vw,12.5px)*var(--ss))/2 var(--fs);font-style:var(--sts);letter-spacing:.24em;text-transform:uppercase;color:#f6dcc8;margin:0 auto 16px;max-width:30em;text-shadow:0 1px 10px #000b}
.lbl{font:600 calc(10px*var(--ss))/1.5 var(--fs);font-style:var(--sts);letter-spacing:.34em;text-transform:uppercase;color:var(--gold);margin:8px 0 2px}
.nm{margin:0;font:400 calc(clamp(46px,14.5vw,78px)*var(--sn))/1.08 var(--fn);font-style:var(--stn);overflow-wrap:anywhere;color:var(--gold2);background:linear-gradient(105deg,#b98a35 0%,#fdf0c2 24%,#d6aa55 46%,#fff6d5 60%,#c39340 80%,#f2d68e 100%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;filter:drop-shadow(0 3px 12px rgba(0,0,0,.55));animation:rl-foil 7s ease-in-out infinite alternate;padding:.04em .06em}
.par{font:400 calc(clamp(16px,4.4vw,20px)*var(--sl))/1.5 var(--fl);font-style:var(--stl);color:#f3d9cc;margin:4px 0 0;text-shadow:0 1px 10px #000b}
.amp{font:400 calc(clamp(30px,9vw,44px)*var(--sn))/1 var(--fn);font-style:var(--stn);color:var(--gold);margin:8px 0;text-shadow:0 2px 14px #000a;display:flex;align-items:center;justify-content:center;gap:14px}
.amp:before,.amp:after{content:'';width:min(18vw,80px);height:1px;background:linear-gradient(90deg,transparent,var(--gold))}.amp:after{transform:scaleX(-1)}
.msg{font:400 calc(clamp(17px,4.6vw,20px)*var(--sl))/1.8 var(--fl);font-style:var(--stl);color:#f6e3d6;margin:22px auto 0;max-width:30em;white-space:pre-wrap;overflow-wrap:anywhere;text-shadow:0 1px 10px #000b}
.scr{margin-top:30px;font:600 calc(10px*var(--ss))/1 var(--fs);font-style:var(--sts);letter-spacing:.4em;text-transform:uppercase;color:var(--gold);display:flex;flex-direction:column;align-items:center;gap:10px}
.scr:after{content:'';width:1px;height:38px;background:linear-gradient(var(--gold),transparent);animation:rl-scroll 2.2s ease-in-out infinite}
.panel{position:relative;padding:44px 22px 42px;border:1px solid rgba(230,201,130,.5);border-radius:20px;background:linear-gradient(180deg,rgba(46,4,14,.58),rgba(24,2,8,.68));-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);box-shadow:0 24px 60px rgba(0,0,0,.45),inset 0 0 0 1px rgba(255,236,180,.06)}
.panel:before{content:'';position:absolute;inset:7px;border:1px solid rgba(230,201,130,.22);border-radius:14px;pointer-events:none}
.kick{font:700 calc(11px*var(--ss))/1.5 var(--fs);font-style:var(--sts);letter-spacing:.38em;text-transform:uppercase;color:var(--gold);margin:0}
.ttl{font:400 calc(clamp(27px,7.6vw,38px)*var(--sh))/1.2 var(--fh);font-style:var(--sth);color:var(--gold2);margin:10px 0 4px;overflow-wrap:anywhere;text-shadow:0 2px 14px #000a}
.divider{display:flex;align-items:center;justify-content:center;gap:12px;margin:14px auto 26px;width:min(60vw,240px)}
.divider:before,.divider:after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--gold))}.divider:after{transform:scaleX(-1)}
.divider i{width:7px;height:7px;transform:rotate(45deg);background:var(--gold);box-shadow:0 0 10px var(--gold)}
/* scratch + countdown */
.scratch{position:relative;width:100%;max-width:400px;height:212px;margin:6px auto 0;border-radius:16px;border:1.5px solid var(--gold);box-shadow:0 14px 34px #000a,inset 0 0 0 5px rgba(30,2,9,.8),inset 0 0 0 6px rgba(230,201,130,.6);overflow:hidden;background:linear-gradient(135deg,#a3102c,#4e0614)}
.plate{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#fff1d2;text-shadow:0 2px 12px #0009}
.plate .dw{font:700 calc(11px*var(--ss))/1.4 var(--fs);letter-spacing:.42em;color:var(--gold2);text-transform:uppercase}
.plate .dd{font:400 calc(72px*var(--sh))/1 var(--fh);color:#fff1d2}
.plate .dm{font:600 calc(13px*var(--ss))/1.4 var(--fs);letter-spacing:.32em;color:var(--gold2);text-transform:uppercase}
.plate .dt{font:400 calc(17px*var(--sl))/1.4 var(--fl);font-style:var(--stl);color:#f6e6c6;margin-top:3px}
#rl-foil{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab;transition:opacity .9s ease}
.scratch.done #rl-foil{opacity:0;pointer-events:none}
.tapreveal{all:unset;display:inline-block;margin-top:16px;cursor:pointer;font:600 calc(11px*var(--ss))/1.4 var(--fs);letter-spacing:.22em;color:var(--gold);text-decoration:underline;text-underline-offset:5px;text-transform:uppercase}
.scratch.done~.tapreveal{display:none}
.cd{display:flex;justify-content:center;gap:10px;margin-top:22px;opacity:0;transform:translateY(10px);transition:opacity .8s ease .5s,transform .8s ease .5s}
.scratch.done~.cd,.cd.on{opacity:1;transform:none}
.cd div{min-width:64px;padding:10px 4px 8px;border:1px solid rgba(230,201,130,.5);border-radius:10px;background:rgba(0,0,0,.28)}
.cd b{display:block;font:400 calc(30px*var(--sh))/1.1 var(--fh);color:var(--gold2)}
.cd small{font:700 calc(9px*var(--ss))/1.4 var(--fs);letter-spacing:.24em;color:var(--gold);text-transform:uppercase}
#rl-burst{position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:3}
#rl-burst i{position:absolute;left:50%;top:50%;width:var(--w);height:calc(var(--w)*1.6);border-radius:80% 0 80% 0;background:linear-gradient(135deg,#fbeab8,#c9304f);opacity:0;animation:rl-burst 1.7s ease-out var(--d) forwards}
/* photos */
.slider{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px calc(50% - min(36vw,160px)) 18px;margin:0 -20px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.slider::-webkit-scrollbar{display:none}
.slide{flex:0 0 min(72vw,320px);aspect-ratio:3/4;scroll-snap-align:center;border-radius:200px 200px 18px 18px;overflow:hidden;position:relative;border:2px solid var(--gold);box-shadow:0 16px 38px #000b,0 0 0 5px rgba(20,1,6,.7),0 0 0 6px rgba(230,201,130,.5);background:#2a0610;cursor:zoom-in}
.slide img{width:100%;height:100%;object-fit:cover;display:block}
.dots{display:flex;justify-content:center;gap:8px;margin-top:6px}
.dots b{width:7px;height:7px;border-radius:50%;border:1px solid var(--gold);transition:all .3s}
.dots b.on{background:var(--gold);width:20px;border-radius:5px}
.story-wrap{width:100%}
.lightbox{position:fixed;inset:0;z-index:140;background:#000e;display:none;align-items:center;justify-content:center;padding:18px;cursor:zoom-out}
.lightbox.on{display:flex}.lightbox img{max-width:100%;max-height:100%;border-radius:10px;box-shadow:0 0 40px #000}
/* schedule */
.tl{position:relative;max-width:440px;margin:6px auto 0;text-align:left}
.tl:before{content:'';position:absolute;left:112px;top:8px;bottom:8px;width:1px;background:linear-gradient(transparent,var(--gold) 10%,var(--gold) 90%,transparent)}
.tl-row{display:grid;grid-template-columns:96px 1fr;gap:34px;padding:12px 0;position:relative}
.tl-row:before{content:'';position:absolute;left:108px;top:22px;width:9px;height:9px;border-radius:50%;background:#a3102c;box-shadow:0 0 0 3px #2b0510,0 0 0 4px var(--gold);animation:rl-pulse 2.6s ease-in-out infinite}
.tl-t{font:700 calc(12px*var(--ss))/1.5 var(--fs);letter-spacing:.14em;color:var(--gold);text-align:right;padding-top:3px;text-transform:uppercase}
.tl-n{font:400 calc(clamp(20px,5.4vw,24px)*var(--sh))/1.25 var(--fh);color:var(--gold2);margin:0}
.tl-d{font:400 calc(15.5px*var(--sl))/1.5 var(--fl);font-style:var(--stl);color:#f0d8cc;margin:2px 0 0}
/* events */
.cards{display:grid;gap:16px;max-width:440px;margin:6px auto 0}
.ecard{position:relative;padding:28px 18px 26px;border:1px solid rgba(230,201,130,.55);border-radius:8px;background:linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.3))}
.ecard:before{content:'';position:absolute;inset:5px;border:1px solid rgba(230,201,130,.22);border-radius:5px;pointer-events:none}
.ecard h3{font:400 calc(clamp(23px,6.2vw,29px)*var(--sh))/1.25 var(--fh);font-style:var(--sth);color:var(--gold2);margin:0 0 4px;overflow-wrap:anywhere}
.ecard .ed{font:700 calc(11px*var(--ss))/1.7 var(--fs);letter-spacing:.2em;color:var(--gold);text-transform:uppercase}
.ecard .ep{font:400 calc(17px*var(--sl))/1.5 var(--fl);font-style:var(--stl);color:#f3dccf;margin:6px 0 16px;overflow-wrap:anywhere;white-space:pre-line}
.mapbtn{display:inline-block;padding:13px 24px;border:1px solid var(--gold);color:var(--gold2);text-decoration:none;font:700 calc(10.5px*var(--ss))/1.3 var(--fs);letter-spacing:.24em;text-transform:uppercase;border-radius:3px;background:rgba(0,0,0,.25);transition:background .3s,color .3s,transform .3s}
.mapbtn:hover,.mapbtn:focus-visible{background:var(--gold);color:#3a0510;transform:translateY(-2px)}
/* closing */
.fam{white-space:pre-wrap;font:400 calc(18px*var(--sl))/1.8 var(--fl);font-style:var(--stl);color:#f6e3d6;max-width:440px;margin:0 auto 22px;overflow-wrap:anywhere}
.close{font:400 calc(clamp(21px,5.8vw,27px)*var(--sl))/1.6 var(--fl);font-style:var(--stl);color:var(--gold2);max-width:440px;margin:0 auto 6px;white-space:pre-wrap;overflow-wrap:anywhere}
.sign{font:400 calc(clamp(40px,11vw,56px)*var(--sn))/1.2 var(--fn);font-style:var(--stn);margin:14px 0 4px;overflow-wrap:anywhere;color:var(--gold2);background:linear-gradient(105deg,#b98a35,#fdf0c2 30%,#d6aa55 50%,#fff6d5 65%,#c39340);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.small{font:600 calc(10px*var(--ss))/1.5 var(--fs);letter-spacing:.26em;color:var(--gold);text-transform:uppercase}
.rsvp{display:inline-block;margin:6px 0 22px;padding:14px 32px;border-radius:40px;border:1px solid var(--gold);background:linear-gradient(135deg,#b9163a,#6c0a1e);color:#fff1d2;text-decoration:none;font:700 calc(11px*var(--ss))/1.3 var(--fs);letter-spacing:.3em;box-shadow:0 8px 24px #000a,inset 0 1px 0 #ffffff30}
.credit{position:relative;z-index:3;padding:18px;text-align:center;background:#12030a;color:#c9a07c;font:10px Arial,sans-serif;letter-spacing:2px}
.mbtn{position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:120;width:46px;height:46px;border-radius:50%;border:1px solid #fff3c9;background:linear-gradient(135deg,#fbeab8,#c9a050);color:#3b0711;font-size:19px;cursor:pointer;box-shadow:0 6px 18px #000a;display:none}
.mbtn.on{display:block}.mbtn.play{animation:rl-ring 2.4s ease-out infinite}
.rl-js .rv{opacity:0;transform:translateY(30px);filter:blur(7px);transition:opacity 1.2s ease var(--d,0s),transform 1.2s cubic-bezier(.2,.7,.2,1) var(--d,0s),filter 1.2s ease var(--d,0s)}
.rl-js .rv.in{opacity:1;transform:none;filter:none}
.rl-prev [data-rs]{cursor:pointer}
.rl-prev [data-rs]:hover{outline:1px dashed var(--gold);outline-offset:3px}
@keyframes rl-pull{0%{transform:translateX(0) scaleX(1) skewY(0deg)}42%{transform:translateX(calc(var(--dx)*.46)) scaleX(.7) skewY(var(--sk))}100%{transform:translateX(var(--dx)) scaleX(.26) skewY(0deg)}}
@keyframes rl-smin{0%{opacity:0}30%{opacity:calc(var(--o)*.7)}100%{opacity:var(--o);transform:translateX(0)}}
@keyframes rl-drift{0%{transform:translate3d(0,0,0) scale(1) rotate(0deg)}100%{transform:translate3d(var(--dxm),var(--dym),0) scale(1.15) rotate(var(--rot))}}
@keyframes rl-breathe{0%{opacity:.7}100%{opacity:1}}
@keyframes rl-foil{0%{background-position:0% 0}100%{background-position:100% 0}}
@keyframes rl-up{from{opacity:0;transform:translateY(26px);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
@keyframes rl-ring{0%{box-shadow:0 0 0 0 #fbeab888}100%{box-shadow:0 0 0 24px #fbeab800}}
@keyframes rl-scroll{0%,100%{transform:scaleY(.4);transform-origin:top;opacity:.4}50%{transform:scaleY(1);opacity:1}}
@keyframes rl-pulse{0%,100%{box-shadow:0 0 0 3px #2b0510,0 0 0 4px var(--gold)}50%{box-shadow:0 0 0 3px #2b0510,0 0 0 8px rgba(230,201,130,.3)}}
@keyframes rl-burst{0%{opacity:0;transform:translate(0,0) rotate(0) scale(.4)}12%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r)) scale(1)}}
@media(max-width:380px){.tl:before{left:96px}.tl-row{grid-template-columns:82px 1fr;gap:30px}.tl-row:before{left:92px}}
@media(min-width:900px){.hero{padding-left:12vw;padding-right:12vw}.slide{flex-basis:300px}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}.rl-js .rv{opacity:1;transform:none;filter:none}.bgl{transform:none}}
${m.customCSS}`};

/* ------------------------------------------------------------------ markup */
function body(m){
 const w=m.w;
 const logo='';
 const l1=m.p1&&/^\s*d\s*\/\s*o\b/i.test(m.p1)?'':`<p class="lbl hv" data-rs="rsLabel1" style="--d:.7s">${esc(m.l1)}</p>`;
 const l2=m.p2&&/^\s*s\s*\/\s*o\b/i.test(m.p2)?'':`<p class="lbl hv" data-rs="rsLabel2" style="--d:1.35s">${esc(m.l2)}</p>`;
 const hero=`<section class="sec hero" id="top" data-bg="hero"><div class="inner">
 ${m.bism?ed('rsBismillah','p','bism hv',esc(m.bism),' style="--d:.1s" lang="ar" dir="rtl"'):''}
 ${ed('rsIntro','p','intro hv',esc(m.intro),' style="--d:.3s"')}
 ${l1}${ed('name1','h1','nm hv',esc(m.n1),' style="--d:.85s"')}
 ${m.p1?ed('parents1','p','par hv',esc(m.p1),' style="--d:1s"'):''}
 <div class="amp hv" style="--d:1.15s">&amp;</div>
 ${l2}${ed('name2','h1','nm hv',esc(m.n2),' style="--d:1.5s"')}
 ${m.p2?ed('parents2','p','par hv',esc(m.p2),' style="--d:1.65s"'):''}
 ${m.message?ed('message','p','msg hv',esc(m.message),' style="--d:1.85s"'):''}
 ${ed('rsScroll','div','scr hv',esc(m.scroll),' style="--d:2.1s"')}
 </div></section>`;
 const dateSec=`<section class="sec" id="date" data-bg="date"><div class="inner panel">
 ${ed('rsDateKicker','p','kick rv',esc(m.dateKick))}${ed('rsDateTitle','h2','ttl rv',esc(m.dateTitle),' style="--d:.1s"')}
 <div class="divider rv"><i></i></div>
 <div class="scratch rv" id="rl-scratch" style="--d:.2s"><div class="plate">${w?`<span class="dw">${esc(w.day)}</span><span class="dd">${esc(w.date)}</span><span class="dm">${esc(w.month)} ${esc(w.year)}</span>${m.timeText?`<span class="dt">${esc(m.timeText)}</span>`:''}`:`<span class="dm">Date to be announced</span>`}</div><div id="rl-burst"></div><canvas id="rl-foil" aria-label="Scratch to reveal the date"></canvas></div>
 <button type="button" class="tapreveal" id="rl-tap">Or tap here to reveal</button>
 ${m.dateIso?`<div class="cd" id="rl-cd"><div><b id="cd-d">0</b><small>Days</small></div><div><b id="cd-h">0</b><small>Hours</small></div><div><b id="cd-m">0</b><small>Min</small></div><div><b id="cd-s">0</b><small>Sec</small></div></div>`:''}
 </div></section>`;
 const slides=m.photos.map((src,i)=>`<div class="slide" data-i="${i}"><img src="${esc(src)}" alt="Wedding photo ${i+1}" loading="lazy"></div>`).join('');
 const story=m.photos.length?`<section class="sec" id="story" data-bg="story"><div class="story-wrap"><div class="inner">${ed('rsStoryKicker','p','kick rv',esc(m.storyKick))}${ed('rsStoryTitle','h2','ttl rv',esc(m.storyTitle),' style="--d:.1s"')}<div class="divider rv"><i></i></div></div>
 <div class="slider rv" id="rl-slider" style="--d:.15s">${slides}</div>${m.photos.length>1?`<div class="dots">${m.photos.map((_,i)=>`<b${i?'':' class="on"'}></b>`).join('')}</div>`:''}</div></section>`:'';
 const tl=m.schedule.length?`<section class="sec" id="day" data-bg="day"><div class="inner panel">${ed('rsDayKicker','p','kick rv',esc(m.dayKick))}${ed('rsDayTitle','h2','ttl rv',esc(m.dayTitle),' style="--d:.1s"')}<div class="divider rv"><i></i></div><div class="tl" data-rs="schedule">${m.schedule.map((s,i)=>`<div class="tl-row rv" style="--d:${(i*.1).toFixed(1)}s"><div class="tl-t">${esc(s.time||'')}</div><div><p class="tl-n">${esc(s.title)}</p>${s.detail?`<p class="tl-d">${esc(s.detail)}</p>`:''}</div></div>`).join('')}</div></div></section>`:'';
 const cards=m.events.length?`<section class="sec" id="events" data-bg="events"><div class="inner panel">${ed('rsEventsTitle','h2','ttl rv',esc(m.evTitle))}<div class="divider rv"><i></i></div><div class="cards" data-rs="eventsText">${m.events.map((e,i)=>`<article class="ecard rv" style="--d:${(i*.12).toFixed(2)}s"><h3>${esc(e.title)}</h3>${e.date?`<div class="ed">${esc(e.date)}</div>`:''}${e.place?`<p class="ep">${esc(e.place)}</p>`:''}${e.map?`<a class="mapbtn" href="${esc(e.map)}" target="_blank" rel="noopener noreferrer">View on map</a>`:''}</article>`).join('')}</div></div></section>`:'';
 const end=`<section class="sec" id="with-love" data-bg="end"><div class="inner panel">
 ${m.family?ed('family','p','fam rv',esc(m.family)):''}
 ${m.rsvp?`<a class="rsvp rv" href="${esc(m.rsvp)}" target="_blank" rel="noopener noreferrer">RSVP</a>`:''}
 ${ed('rsClosing','p','close rv',esc(m.closing),' style="--d:.1s"')}
 <div class="divider rv"><i></i></div>
 <p class="sign rv" data-rs="name1">${esc(m.n1)} &amp; ${esc(m.n2)}</p>
 ${m.from?ed('wishesFrom','p','small rv',esc(m.from)):''}
 </div></section>`;
 const gate=m.gate?`<div id="rl-gate" class="gate" role="dialog" aria-modal="true" aria-label="Open the invitation"><canvas id="rl-gc"></canvas><div class="g-ui"><button type="button" class="g-hit" id="rl-open"><span class="g-kick">You are invited</span>${m.openLogo?`<span class="g-ring g-om"><img src="${esc(m.openLogo)}" alt=""></span>`:'<span class="g-ring"></span>'}<span class="g-tap" data-rs="rsOpen">${esc(m.open)}</span><span class="g-orn"></span></button></div><button type="button" class="g-skip" id="rl-skip">Skip</button></div>`:'';
 const audio=m.music?`<audio id="rl-music" loop preload="none" src="${esc(m.music)}"></audio><button type="button" class="mbtn on" id="rl-mbtn" aria-label="Play or pause music">\u266A</button>`:'';
 return `${bgLayers()}${drape()}<canvas id="rl-sp" aria-hidden="true"></canvas>${logo}${gate}<main>${hero}${dateSec}${story}${tl}${cards}${end}</main><div class="credit">Made with Mubiey Studio</div>${audio}`;
}

/* ------------------------------------------------------------------ browser runtime (runs inside the invitation) */
function runtime(){
 const R=window.RL||{},$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,B=document.body;
 const setW=()=>document.documentElement.style.setProperty('--W',document.documentElement.clientWidth+'px');setW();addEventListener('resize',setW);
 const audio=$('#rl-music'),mb=$('#rl-mbtn');
 const play=()=>{if(!audio)return;audio.play().then(()=>{mb&&mb.classList.add('play')}).catch(()=>{})};
 if(mb)mb.onclick=()=>{if(audio.paused)play();else{audio.pause();mb.classList.remove('play')}};
 /* ---------- twinkling sparkles (always on) + bursts ---------- */
 const star=(rgb)=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');
  const rg=g.createRadialGradient(32,32,0,32,32,32);rg.addColorStop(0,'rgba('+rgb+',.95)');rg.addColorStop(.2,'rgba('+rgb+',.5)');rg.addColorStop(1,'rgba('+rgb+',0)');g.fillStyle=rg;g.fillRect(0,0,64,64);
  g.fillStyle='rgba(255,255,255,.98)';g.beginPath();g.moveTo(32,1);g.quadraticCurveTo(34.5,29.5,63,32);g.quadraticCurveTo(34.5,34.5,32,63);g.quadraticCurveTo(29.5,34.5,1,32);g.quadraticCurveTo(29.5,29.5,32,1);g.fill();return c};
 const SPR=[star('255,226,150'),star('255,255,255'),star('255,150,170')];
 const sp=(()=>{
  const cv=$('#rl-sp');if(!cv)return{burst(){}};
  const ctx=cv.getContext('2d');let W=0,H=0,dpr=1,amb=[],fx=[];
  const mk=(i)=>({x:Math.random()*W,y:Math.random()*H,s:5+Math.random()*13,ph:Math.random()*6.28,sp:.6+Math.random()*1.5,vy:-(3+Math.random()*9),k:Math.random()<.62?0:Math.random()<.7?1:2});
  const size=()=>{dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr|0;cv.height=H*dpr|0;const n=Math.max(26,Math.min(78,Math.round(W*H/12500)))*(R.prev?.55:1)|0;amb=Array.from({length:n},mk)};
  size();addEventListener('resize',size);
  let last=performance.now();
  const loop=now=>{const dt=Math.min(.05,(now-last)/1000);last=now;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
   for(const a of amb){a.y+=a.vy*dt;if(a.y<-20){a.y=H+20;a.x=Math.random()*W}const t=Math.max(0,Math.sin(now/1000*a.sp+a.ph));const al=t*t*t;if(al<.02)continue;ctx.globalAlpha=al;const z=a.s*(.55+.45*t);ctx.drawImage(SPR[a.k],a.x-z,a.y-z,z*2,z*2)}
   for(let i=fx.length-1;i>=0;i--){const p=fx[i];p.life-=dt;if(p.life<=0){fx.splice(i,1);continue}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=26*dt;ctx.globalAlpha=Math.min(1,p.life/p.max*1.6);const z=p.s*(.5+.5*p.life/p.max);ctx.drawImage(SPR[p.k],p.x-z,p.y-z,z*2,z*2)}
   ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';requestAnimationFrame(loop)};
  if(!reduce)requestAnimationFrame(loop);
  return{burst(x,y,n,spread){if(reduce)return;spread=spread||260;for(let i=0;i<n;i++){const a=Math.random()*6.283,v=30+Math.random()*spread;fx.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,s:6+Math.random()*12,k:Math.random()<.6?0:1,life:1.1+Math.random()*1.4,max:2.5})}}};
 })();
 /* ---------- opening: glitter -> tap -> glitter breaks into pieces -> velvet curtain gathers to both sides ---------- */
 const gate=$('#rl-gate'),drape=$('#rl-drape');
 const showStage=()=>{drape&&drape.classList.add('done');B.classList.add('rl-stage','rl-flat')};
 if(!gate){B.classList.remove('rl-wait');showStage()}
 else{
  B.classList.add('rl-wait','rl-locked');
  const cv=$('#rl-gc'),ctx=cv.getContext('2d'),oc=document.createElement('canvas');
  let W=0,H=0,dpr=1,img=null,ready=false,opened=false,finished=false,mode='idle',tiles=[],glints=[],T0=0;
  const timers=[];const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
  const fit=()=>{dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);oc.width=cv.width;oc.height=cv.height;
   const g=oc.getContext('2d');g.fillStyle='#4a0414';g.fillRect(0,0,oc.width,oc.height);
   if(img){const s=Math.max(oc.width/img.width,oc.height/img.height),w=img.width*s,h=img.height*s;g.drawImage(img,(oc.width-w)/2,(oc.height-h)/2,w,h)}
   const v=g.createRadialGradient(oc.width/2,oc.height*.5,oc.width*.06,oc.width/2,oc.height*.5,Math.max(oc.width,oc.height)*.78);v.addColorStop(0,'rgba(38,0,9,.42)');v.addColorStop(.5,'rgba(38,0,9,.1)');v.addColorStop(1,'rgba(8,0,3,.62)');g.fillStyle=v;g.fillRect(0,0,oc.width,oc.height)};
  const im=new Image();im.onload=()=>{img=im;ready=true;fit()};im.src=R.glitter;fit();addEventListener('resize',()=>{if(mode==='idle')fit()});
  (R.preload||[]).forEach(u=>{const i=new Image();i.src=u});
  const twk=Array.from({length:84},()=>({x:Math.random(),y:Math.random(),s:7+Math.random()*20,ph:Math.random()*6.28,sp:.8+Math.random()*2.2,k:Math.random()<.5?0:1}));
  const idle=now=>{if(mode!=='idle')return;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.drawImage(oc,0,0);ctx.globalCompositeOperation='lighter';
   const ph=(now/6500)%1.6-.3;const gr=ctx.createLinearGradient(cv.width*(ph-.18),0,cv.width*(ph+.18),cv.height*.5);gr.addColorStop(0,'rgba(255,180,190,0)');gr.addColorStop(.5,'rgba(255,200,205,.17)');gr.addColorStop(1,'rgba(255,180,190,0)');ctx.fillStyle=gr;ctx.fillRect(0,0,cv.width,cv.height);
   for(const t of twk){const a=Math.max(0,Math.sin(now/1000*t.sp+t.ph));const al=a*a*a*a;if(al<.03)continue;ctx.globalAlpha=al;const z=t.s*dpr*(.5+.5*a);ctx.drawImage(SPR[t.k],t.x*cv.width-z,t.y*cv.height-z,z*2,z*2)}
   ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';requestAnimationFrame(idle)};
  requestAnimationFrame(idle);
  const dissolve=(px,py)=>{
   mode='dissolve';const cw=cv.width,ch=cv.height;let T=Math.max(Math.round(8*dpr),Math.round(Math.min(cw,ch)/34));
   while(Math.ceil(cw/T)*Math.ceil(ch/T)>2600)T=Math.round(T*1.15);
   const diag=Math.hypot(cw,ch);tiles=[];
   for(let y=0;y<ch;y+=T)for(let x=0;x<cw;x+=T){const d=Math.hypot(x+T/2-px,y+T/2-py)/diag,a=Math.atan2(y+T/2-py,x+T/2-px);
    tiles.push({x,y,dl:d*.95+Math.random()*.35,du:.9+Math.random()*1.15,vx:Math.cos(a)*(40+Math.random()*150)*dpr+(Math.random()-.5)*70*dpr,vy:(-50-Math.random()*130)*dpr+Math.sin(a)*60*dpr,sp:Math.random()<.012,fired:false})}
   const total=Math.max(...tiles.map(q=>q.dl+q.du));T0=performance.now();
   const frame=now=>{if(finished)return;const t=(now-T0)/1000;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cw,ch);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
    ctx.drawImage(oc,0,0);const moving=[];
    for(const q of tiles){const p=(t-q.dl)/q.du;if(p<=0)continue;ctx.clearRect(q.x,q.y,T,T);if(p<1){moving.push([q,p]);if(q.sp&&!q.fired){q.fired=true;glints.push({x:q.x+T/2,y:q.y+T/2,life:.9,max:.9,s:(6+Math.random()*9)*dpr,k:Math.random()<.5?0:1})}}}
    for(const [q,p] of moving){const e=1-Math.pow(1-p,2.2),sc=1-.55*p;ctx.globalAlpha=Math.max(0,1-Math.pow(p,1.5));const cx=q.x+T/2+q.vx*e,cy=q.y+T/2+q.vy*e+60*dpr*p*p;ctx.drawImage(oc,q.x,q.y,T,T,cx-T*sc/2,cy-T*sc/2,T*sc,T*sc)}
    ctx.globalCompositeOperation='lighter';
    for(let i=glints.length-1;i>=0;i--){const g=glints[i];g.life-=.016;if(g.life<=0){glints.splice(i,1);continue}ctx.globalAlpha=Math.min(1,g.life/g.max*1.5);const z=g.s*(.4+.6*g.life/g.max);g.y-=.5*dpr;ctx.drawImage(SPR[g.k],g.x-z,g.y-z,z*2,z*2)}
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    if(t<total+.1)requestAnimationFrame(frame);else done()};
   requestAnimationFrame(frame)};
  const done=()=>{if(finished)return;finished=true;timers.forEach(clearTimeout);gate.classList.add('gone');B.classList.remove('rl-locked','rl-wait');showStage();scrollTo(0,0)};
  const go=ev=>{
   if(opened)return;opened=true;if(R.autoplay)play();gate.classList.add('open');
   const px=(ev&&typeof ev.clientX==='number'&&ev.clientX>0?ev.clientX:W/2)*dpr,py=(ev&&typeof ev.clientY==='number'&&ev.clientY>0?ev.clientY:H*.55)*dpr;
   if(reduce){later(done,300);return}
   dissolve(px,py);
   later(()=>{drape.classList.add('go');B.classList.add('rl-stage');sp.burst(innerWidth/2,innerHeight*.5,46,320)},1500);
   later(()=>{B.classList.remove('rl-wait')},1500+2500);
  };
  $('#rl-open').onclick=go;
  $('#rl-skip').onclick=()=>{if(finished)return;finished=true;timers.forEach(clearTimeout);gate.classList.add('gone');B.classList.remove('rl-locked','rl-wait');showStage()};
 }
 /* ---------- backgrounds follow the section on screen ---------- */
 const secs=$$('[data-bg]'),bgs=$$('.bgl'),hero=$('#top');let cur='hero',tick=false;
 const onScroll=()=>{tick=false;const mid=innerHeight*.5;let key=cur;
  for(const s of secs){const r=s.getBoundingClientRect();if(r.top<=mid&&r.bottom>mid){key=s.dataset.bg;break}}
  if(key!==cur){cur=key;bgs.forEach(b=>b.classList.toggle('on',b.dataset.k===key));if(!R.prev||true)sp.burst(innerWidth*.5,innerHeight*.5,30,300)}
  if(hero)B.classList.toggle('rl-past',hero.getBoundingClientRect().bottom<innerHeight*.42)};
 addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
 /* ---------- scroll reveal ---------- */
 const rv=$$('.rv');
 if('IntersectionObserver' in window&&!R.prev){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});rv.forEach(n=>io.observe(n))}else rv.forEach(n=>n.classList.add('in'));
 /* ---------- scratch to reveal the date ---------- */
 const sc=$('#rl-scratch'),fc=$('#rl-foil');
 const burst=()=>{const b=$('#rl-burst');if(!b||reduce)return;b.innerHTML='';for(let i=0;i<34;i++){const a=Math.random()*6.283,r=80+Math.random()*170,n=document.createElement('i');n.style.cssText='--w:'+(8+Math.random()*9)+'px;--dx:'+Math.cos(a)*r+'px;--dy:'+(Math.sin(a)*r-50)+'px;--r:'+(Math.random()*540)+'deg;--d:'+(Math.random()*.25)+'s';b.append(n)}setTimeout(()=>b.innerHTML='',2200);const r=sc.getBoundingClientRect();sp.burst(r.left+r.width/2,r.top+r.height/2,40,300)};
 const reveal=()=>{if(!sc||sc.classList.contains('done'))return;sc.classList.add('done');burst();const cd=$('#rl-cd');cd&&cd.classList.add('on')};
 if(sc&&fc){
  const ctx=fc.getContext('2d');let cleared=false,last=null,n=0;
  const paint=()=>{const r=fc.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);fc.width=Math.max(2,Math.round(r.width*dpr));fc.height=Math.max(2,Math.round(r.height*dpr));
   const w=fc.width,h=fc.height,g=ctx.createLinearGradient(0,0,w,h);[[0,'#8d6a24'],[.25,'#ecd392'],[.5,'#b98d3a'],[.75,'#f6e0a6'],[1,'#9a742c']].forEach(a=>g.addColorStop(a[0],a[1]));
   ctx.globalCompositeOperation='source-over';ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
   for(let i=0;i<340;i++){ctx.fillStyle='rgba(255,255,255,'+Math.random()*.22+')';ctx.fillRect(Math.random()*w,Math.random()*h,2*dpr,2*dpr)}
   ctx.strokeStyle='rgba(255,255,255,.14)';ctx.lineWidth=2*dpr;for(let x=-h;x<w;x+=18*dpr){ctx.beginPath();ctx.moveTo(x,h);ctx.lineTo(x+h,0);ctx.stroke()}
   ctx.fillStyle='rgba(74,6,20,.9)';ctx.textAlign='center';ctx.font='700 '+13*dpr+'px Arial';ctx.fillText('SCRATCH HERE',w/2,h/2-6*dpr);ctx.font='italic '+15*dpr+'px Georgia';ctx.fillText('to reveal our date',w/2,h/2+16*dpr)};
  const pos=e=>{const r=fc.getBoundingClientRect();return[(e.clientX-r.left)*fc.width/r.width,(e.clientY-r.top)*fc.height/r.height]};
  const draw=e=>{const p=pos(e),k=fc.width/fc.getBoundingClientRect().width;ctx.globalCompositeOperation='destination-out';ctx.strokeStyle='#000';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=46*k;ctx.beginPath();ctx.moveTo(last?last[0]:p[0],last?last[1]:p[1]);ctx.lineTo(p[0],p[1]);ctx.stroke();last=p;if(++n%6===0)check()};
  const check=()=>{if(cleared)return;const d=ctx.getImageData(0,0,fc.width,fc.height).data;let c=0,t=0;for(let i=3;i<d.length;i+=4*29){t++;if(d[i]<40)c++}if(c/t>.4){cleared=true;reveal()}};
  fc.addEventListener('pointerdown',e=>{last=null;fc.setPointerCapture(e.pointerId);draw(e)});
  fc.addEventListener('pointermove',e=>{if(e.buttons||e.pressure>0)draw(e)});
  ['pointerup','pointercancel'].forEach(t=>fc.addEventListener(t,()=>{last=null;check()}));
  paint();addEventListener('resize',()=>{if(!sc.classList.contains('done'))paint()});
  if(R.prev)sc.classList.add('done');
 }
 const tap=$('#rl-tap');if(tap)tap.onclick=reveal;
 /* ---------- countdown ---------- */
 if($('#rl-cd')&&R.dateIso){const t=Date.parse(R.dateIso),set=(id,v)=>{const e=$('#'+id);if(e)e.textContent=v};const tick=()=>{let s=Math.max(0,Math.floor((t-Date.now())/1000));set('cd-d',Math.floor(s/86400));set('cd-h',Math.floor(s%86400/3600));set('cd-m',Math.floor(s%3600/60));set('cd-s',s%60)};tick();setInterval(tick,1000)}
 /* ---------- photo slider + lightbox ---------- */
 const sl=$('#rl-slider');
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
 /* ---------- editor preview: tap any text to edit it, tap the logo space to add a logo ---------- */
 if(R.prev){document.body.classList.add('rl-prev');$$('[data-rs]').forEach(n=>n.addEventListener('click',e=>{e.preventDefault();parent.postMessage({type:'mubiey-rs-edit',field:n.dataset.rs},'*')}));
  const lg=$('[data-logo-slot]');if(lg)lg.addEventListener('click',()=>parent.postMessage({type:'mubiey-rl-logo'},'*'))}
}

/* ------------------------------------------------------------------ document */
function render(d){
 const m=model(d);
 const rt={prev:m.prev,autoplay:m.autoplay,dateIso:m.dateIso,glitter:ASSET+'glitter.jpg',preload:[ASSET+'curtain.jpg',ASSET+'smoke-a.png',ASSET+'smoke-b.png',ASSET+'sparkle.jpg',ASSET+'velvet.jpg',ASSET+'stage.jpg']};
 const cls=[m.gate?'rl-locked rl-wait':'',m.prev?'rl-prev':'',m.gate?'':'rl-flat rl-stage'].filter(Boolean).join(' ');
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>${esc(m.n1)} &amp; ${esc(m.n2)} \u2014 Wedding invitation</title><script>document.documentElement.classList.add('rl-js')<\/script><style>${fontCSS()}${CSS(m)}</style><noscript><style>.gate{display:none}body.rl-locked{overflow:auto}.rv,.hv{opacity:1!important;transform:none!important;filter:none!important}</style></noscript></head><body class="${cls}">${body(m)}<script>window.RL=${json(rt)};<\/script><script>(${runtime.toString().replace(/<\/script/gi,'<\\/script')})();<\/script></body></html>`;
}
window.MubieyRuby={id:TEMPLATE,readCfg,GROUPS,FONT_KEYS,model,h:{esc,str,when,safeMap,safeHttps,fontCSS,customFontCSS,stack,rnd,json,ed,parseEvents,DEFAULT_FONT,ASSET_ROOT:ASSET.replace(/assets\/ruby\/$/,'')}};
invitationDocument=function(data){return data&&data.template===TEMPLATE?render(data):baseDocument.apply(this,arguments)};
})();
