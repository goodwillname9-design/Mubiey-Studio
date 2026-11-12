/* Mubiey Studio · "Floral Envelope" live invitations 3001-3005 (five colourways of one design).
   Loads after ivory-live.js. Uses the shared model + helpers from ruby-luxury.js (window.MubieyRuby).

   Opening : the pink-sealed envelope. Tap the seal: it cracks in a gold flash, gold dust rises, the envelope fades
             and the page arrives. If an OPENING LOGO is set it replaces the seal at the same size, and on opening it
             lifts out and settles in the top-left corner as the logo.
   Pages   : every section (hero, date, photos, schedule, events, closing) has its own background, chosen in the
             editor (one of the four artworks, or your own picture). No text boxes: all wording sits on the page.
   Motion  : gold butterflies flutter and drift, dust sparkles twinkle, and each background moves slowly while you
             scroll (parallax). Colour of each colourway is set by filters on the same artworks.
   Settings: rubyCfg (fonts & sizes), floraBg (section backgrounds, JSON). Names always fit on at most two lines. */
'use strict';
(()=>{
const R=window.MubieyRuby;
if(!R||!R.h||typeof invitationDocument!=='function'||typeof Studio==='undefined')return;
const {esc,str,fontCSS,json,ed,ASSET_ROOT}=R.h;
const baseDocument=invitationDocument;
const A=ASSET_ROOT+'assets/flora/';

/* ------------------------------------------------------------------ colourways (same design, five colours) */
const THEMES={
 '3001':{name:'Blush Pearl',  ink:'#5e3441',acc:'#b77a86',acc2:'#f1d3d6',pan:'rgba(255,250,250,0)',filt:'none',           veil:'rgba(255,246,246,.10)',dark:0,gate:'none'},
 '3002':{name:'Ivory Gold',   ink:'#4f3d28',acc:'#a8842f',acc2:'#f3dc9a',pan:'rgba(255,252,244,0)',filt:'sepia(.16) saturate(.92)',veil:'rgba(255,250,236,.08)',dark:0,gate:'sepia(.15)'},
 '3003':{name:'Mocha Ribbon', ink:'#3d2a1d',acc:'#8a5a3b',acc2:'#e7c59b',pan:'rgba(255,248,240,0)',filt:'sepia(.42) saturate(1.05) brightness(.95)',veil:'rgba(255,246,236,.06)',dark:0,gate:'sepia(.4)'},
 '3004':{name:'Sage Mist',    ink:'#2f3e31',acc:'#78906f',acc2:'#d6e2c8',pan:'rgba(248,252,246,0)',filt:'hue-rotate(58deg) saturate(.55) brightness(1.02)',veil:'rgba(246,252,244,.08)',dark:0,gate:'hue-rotate(58deg) saturate(.55)'},
 '3005':{name:'Lilac Dusk',   ink:'#3a2c46',acc:'#8c6f98',acc2:'#e3d3ee',pan:'rgba(252,249,255,0)',filt:'hue-rotate(-38deg) saturate(.7) brightness(.98)',veil:'rgba(250,246,255,.08)',dark:0,gate:'hue-rotate(-38deg) saturate(.7)'}
};
const SRC={frame:'frame.jpg',ribbon:'ribbon.jpg',damask:'damask.jpg',pearl:'pearl.jpg',rose:'rose.jpg',blossom:'blossom.jpg',bloom:'bloom.jpg'};
const PEARL_SEAL={x:50,y:74,d:24};
const NEW={
 '4001':{name:'Pearl & Gold',     ink:'#4a3a2a',acc:'#b8922e',acc2:'#f5e3a6',filt:'none',                                  veil:'rgba(255,252,246,.06)',gate:'none',           def:{hero:'rose',date:'blossom',story:'bloom',day:'blossom',events:'rose',end:'bloom'},bf:true,tapTop:'calc(var(--H)*.08)'},
 '4002':{name:'Ruby Blossom',     ink:'#5a1a2a',acc:'#a3102c',acc2:'#f2c4cc',filt:'saturate(1.08)',                        veil:'rgba(255,246,246,.05)',gate:'saturate(1.05)', def:{hero:'rose',date:'bloom',story:'blossom',day:'bloom',events:'blossom',end:'rose'},bf:true,tapTop:'calc(var(--H)*.08)'},
 '4003':{name:'Sage Garden',      ink:'#2f3e31',acc:'#6f8a66',acc2:'#dfe9d4',filt:'hue-rotate(78deg) saturate(.45) brightness(1.06) contrast(.92)',veil:'rgba(246,252,244,.07)',gate:'hue-rotate(62deg) saturate(.6)', def:{hero:'bloom',date:'blossom',story:'rose',day:'bloom',events:'blossom',end:'rose'},bf:true,tapTop:'calc(var(--H)*.08)'},
 '4004':{name:'Blush Rose',       ink:'#6a3442',acc:'#c0707f',acc2:'#f7d6dc',filt:'hue-rotate(-28deg) saturate(.7) brightness(1.1) contrast(.9)',veil:'rgba(255,246,248,.08)',gate:'hue-rotate(-14deg)', def:{hero:'blossom',date:'rose',story:'bloom',day:'rose',events:'bloom',end:'blossom'},bf:true,tapTop:'calc(var(--H)*.08)'},
 '4005':{name:'Midnight Champagne',ink:'#f3e6c8',acc:'#e0b765',acc2:'#fff0c2',filt:'brightness(.62) saturate(1.1) contrast(1.05)',veil:'rgba(18,10,8,.22)',gate:'brightness(.7) saturate(1.05)', dark:1, def:{hero:'rose',date:'blossom',story:'bloom',day:'blossom',events:'rose',end:'bloom'},bf:true,tapTop:'calc(var(--H)*.08)'},
 '4006':{name:'Ivory Champagne',  ink:'#4f4030',acc:'#a88a52',acc2:'#efe2c0',filt:'sepia(.25) saturate(.85) brightness(1.03)',veil:'rgba(255,250,240,.07)',gate:'sepia(.2)', def:{hero:'bloom',date:'rose',story:'blossom',day:'bloom',events:'rose',end:'blossom'},bf:true,tapTop:'calc(var(--H)*.08)'}
};
for(const k of Object.keys(NEW))THEMES[k]=Object.assign({ink:'#000',acc:'#000',acc2:'#fff'},NEW[k],{gate:NEW[k].gate,seal:PEARL_SEAL,gateImg:'pearl.jpg',pearlGate:true});
const DEFAULT_BG={hero:'frame',date:'ribbon',story:'damask',day:'ribbon',events:'damask',end:'frame'};
const SECTIONS=['hero','date','story','day','events','end'];
/* seal position on the envelope picture (measured): centre 51.4% / 52.8%, diameter 32.6% of width */
const SEAL={x:51.4,y:52.8,d:32.6};

/* ------------------------------------------------------------------ settings */
function readBg(d,t){
 let j={};try{j=JSON.parse(typeof d.floraBg==='string'&&d.floraBg?d.floraBg:'{}')||{}}catch{j={}}
 const out={};
 for(const s of SECTIONS){
  const v=j[s];
  if(typeof v==='string'&&v.startsWith('data:image/')&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v)&&v.length<120000)out[s]={src:v};
  else if(typeof v==='string'&&SRC[v])out[s]={src:A+SRC[v]};
  else out[s]={src:A+SRC[((t&&t.def)||DEFAULT_BG)[s]]};
 }
 return out;
}

/* ------------------------------------------------------------------ small pieces */
const BUTTERFLY='<svg class="bf" viewBox="0 0 60 44" aria-hidden="true"><g class="wg"><path d="M30 22C22 2 4 2 3 14c-1 9 11 14 27 8z"/><path d="M30 22C22 42 6 42 6 31c0-6 9-9 24-9z"/></g><g class="wg r"><path d="M30 22C38 2 56 2 57 14c1 9-11 14-27 8z"/><path d="M30 22C38 42 54 42 54 31c0-6-9-9-24-9z"/></g><path class="bd" d="M30 14v16" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/></svg>';
function bflies(n,seed,t){
 const edge=seed===11;
 let s='';
 for(let i=0;i<n;i++){
  const x=(edge?(i%2?R.h.rnd(seed+i,2,10):R.h.rnd(seed+i,88,96)):R.h.rnd(seed+i,4,92)).toFixed(1),y=(R.h.rnd(seed+i+7,6,90)).toFixed(1),z=(R.h.rnd(seed+i+3,.45,.95)).toFixed(2),dl=(R.h.rnd(seed+i+5,0,9)).toFixed(1),du=(R.h.rnd(seed+i+9,16,28)).toFixed(1);
  s+=`<i class="bfw${t&&t.bf?' bfg':''}" style="left:${x}%;top:${y}%;--z:${z};--dl:${dl}s;--du:${du}s">${t&&t.bf?`<img class="bfi" src="${A}bf_gold.png" alt="">`:BUTTERFLY}</i>`;
 }
 return `<div class="bfs" aria-hidden="true">${s}</div>`;
}
function dust(n,seed){
 let s='';for(let i=0;i<n;i++){s+=`<i style="left:${R.h.rnd(seed+i,0,100).toFixed(1)}%;top:${R.h.rnd(seed+i+4,0,100).toFixed(1)}%;--dl:${R.h.rnd(seed+i+8,0,6).toFixed(1)}s;--ds:${R.h.rnd(seed+i+2,2.4,4.6).toFixed(1)}s"></i>`}
 return `<div class="dst" aria-hidden="true">${s}</div>`;
}
const ICON_STAR='<svg class="fl-star" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0 6 4 10 5 6 6 5 10 4 6 0 5 4 4z" fill="currentColor"/></svg>';

/* a month + day in a programme line always starts its own line */
const MON='January|February|March|April|May|June|July|August|September|October|November|December';
const brk=v=>esc(v).replace(new RegExp('\\s+((?:'+MON+')\\s+\\d{1,2}\\b)','i'),'<br>$1');
/* ------------------------------------------------------------------ styles */
const CSS=(m,t,bg)=>{
 const f=m.fonts,s=m.cfg.s,S=t.seal||SEAL,SH=t.dark?'#0009':'#fffd',SHL=t.dark?'#0007':'#fffc';
 const secRules=SECTIONS.map(k=>`.sec-${k} .sbg{background-image:url('${esc(bg[k].src)}')}`).join('\n');
 return `
:root{--fn:${f.names.fam};--fh:${f.heads.fam};--fl:${f.lines.fam};--fs:${f.small.fam};--stl:${f.lines.italic?'italic':'normal'};--stn:${f.names.italic?'italic':'normal'};--sth:${f.heads.italic?'italic':'normal'};--sts:${f.small.italic?'italic':'normal'};
--sn:${(s.names/100).toFixed(2)};--sh:${(s.heads/100).toFixed(2)};--sl:${(s.lines/100).toFixed(2)};--ss:${(s.small/100).toFixed(2)};
--ink:${t.ink};--acc:${t.acc};--acc2:${t.acc2};--filt:${t.filt};--H:100svh;--SW:calc(var(--H)*.5625);color-scheme:light}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{background:#f6efe7}
body{margin:0;background:#f6efe7;color:var(--ink);font:400 calc(18px*var(--sl))/1.7 var(--fl);font-style:var(--stl);overflow-x:hidden;-webkit-font-smoothing:antialiased}
body.fl-locked{overflow:hidden;height:100svh}
/* ---------- gate: envelope ---------- */
.gate{position:fixed;inset:0;z-index:100;background:#f3e9e4;overflow:hidden}
.gate.gone{display:none}
.gate.open{pointer-events:none;background:transparent;transition:background .8s ease .4s}
.envimg{position:absolute;left:50%;top:0;height:100%;width:var(--SW);transform:translateX(-50%);background:url('${A}${t.gateImg||'envelope.jpg'}') center/100% 100% no-repeat;filter:${t.gate||'none'};transition:opacity 1.3s ease .6s,transform 1.6s cubic-bezier(.2,.7,.2,1) .2s}
.gate.open .envimg{opacity:0;transform:translateX(-50%) scale(1.08)}
.sealc{position:absolute;left:${S.x}%;top:${S.y}%;width:${S.d}%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;animation:fl-seal 2.4s ease-out infinite}
.gate.open .sealc{animation:none;opacity:0;transition:opacity .25s}
.flash{position:absolute;left:${S.x}%;top:${S.y}%;width:30%;aspect-ratio:1;transform:translate(-50%,-50%) scale(0);border-radius:50%;background:radial-gradient(circle,#fffbe8,rgba(255,226,150,.9) 35%,rgba(255,226,150,0) 70%);opacity:0;pointer-events:none}
.gate.open .flash{animation:fl-flash 1.2s ease-out forwards}
.omg{position:absolute;left:${S.x}%;top:${S.y}%;width:${S.d}%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,#fffaf0,#efe2c4 80%);box-shadow:0 6px 18px rgba(60,40,10,.3),inset 0 0 0 3px #d9b46a,inset 0 0 0 6px #fff4d6,inset 0 0 0 7px #b88c3e;padding:0;overflow:visible;z-index:4;animation:fl-bob 2.6s ease-in-out infinite alternate}
.omg img{position:absolute;left:50%;top:50%;width:calc(var(--olsz,100)*1%);height:calc(var(--olsz,100)*1%);transform:translate(-50%,-50%);object-fit:contain;display:block;border-radius:50%;mix-blend-mode:multiply}
.omg.lift{position:fixed;animation:none;transition:left 1.3s cubic-bezier(.3,.6,.2,1),top 1.3s cubic-bezier(.3,.6,.2,1),width 1.3s cubic-bezier(.3,.6,.2,1),height 1.3s cubic-bezier(.3,.6,.2,1),transform 1.3s cubic-bezier(.3,.6,.2,1),padding .6s;z-index:140}
.omg.lift.corner{left:14px!important;top:calc(14px + env(safe-area-inset-top,0px))!important;width:60px!important;height:60px!important;transform:none!important;padding:6px;box-shadow:0 3px 12px rgba(0,0,0,.25)}
.tap{position:absolute;left:0;right:0;top:${t.tapTop||'calc(var(--H)*.8)'};text-align:center;z-index:3;transition:opacity .5s}
.gate.open .tap{opacity:0}
.kick{font:700 calc(10px*var(--ss))/1.5 var(--fs);font-style:var(--sts);letter-spacing:.42em;text-transform:uppercase;color:#7a4f5e;text-shadow:0 1px 8px #fff9;display:block;margin-bottom:4px}
.tapw{all:unset;display:block;margin:6px auto 0;cursor:pointer;font:400 calc(clamp(30px,9vw,44px)*var(--sn))/1.1 var(--fn);font-style:var(--stn);color:#6a3b4b;text-shadow:0 1px 10px ${SHL};animation:fl-bob 2.8s ease-in-out infinite}
.gate.open .tapw{pointer-events:none}
.g-hit{all:unset;position:absolute;left:${S.x}%;top:${S.y}%;width:${S.d+4}%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;cursor:pointer;z-index:5}
.g-skip{all:unset;cursor:pointer;position:absolute;z-index:6;left:50%;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);padding:10px 16px;font:700 10px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#6a3b4b;opacity:0;transition:opacity .6s}
.gate.open .g-skip{opacity:0}
.gate:not(.open) .g-skip{opacity:.7;pointer-events:auto;transition-delay:1s}
${m.arFontCSS||''}.ar-verse,.ar-dua{direction:rtl;font-family:${m.arFam||"AtelierAmiri,Amiri,serif"};text-align:center;margin:12px auto 4px;line-height:1.7;text-shadow:0 1px 8px rgba(255,255,255,.85)}
.ar-verse{font-size:clamp(20px,5.8vw,26px);color:var(--acc)}
.ar-dua{font-size:clamp(19px,5.4vw,24px);color:var(--ink,var(--acc))}
.ar-en{font-family:var(--fl);font-style:italic;font-size:clamp(14px,3.9vw,16px);line-height:1.6;margin:4px auto 10px;max-width:24em;text-shadow:0 1px 8px rgba(255,255,255,.85)}
/* ---------- pages ---------- */
main{position:relative;z-index:3}
.sec{position:relative;min-height:100svh;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:84px 22px 74px;text-align:center;isolation:isolate}
.sbg{position:absolute;inset:-6% 0;z-index:-3;background:#efe7dc center/cover no-repeat;filter:var(--filt);transform:translateY(calc(var(--p,0)*-5%));will-change:transform}
.sbg:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(255,255,255,.2),rgba(255,255,255,0) 70%)}
.veil{position:absolute;inset:0;z-index:-2;background:${t.veil};pointer-events:none}
.bfs{position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
.bfw{position:absolute;width:calc(var(--z)*46px);opacity:0;animation:fl-fly var(--du) ease-in-out var(--dl) infinite}
.bfg{width:calc(var(--z)*96px)}
.bfi{width:100%;height:auto;display:block;filter:drop-shadow(0 2px 4px rgba(90,60,20,.3));animation:fl-flap .8s ease-in-out infinite alternate}
.bf{width:100%;height:auto;display:block;filter:drop-shadow(0 2px 4px rgba(90,60,20,.25));color:var(--acc)}
.bf path{fill:url(#fl-gold);stroke:#7a5a22;stroke-opacity:.35;stroke-width:.6}
.bf .bd{stroke:#fff}
.wg{transform-origin:30px 22px;animation:fl-wing .9s ease-in-out infinite alternate}
.wg.r{transform-origin:30px 22px;animation-direction:alternate-reverse}
.dst{position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
.dst i{position:absolute;width:4px;height:4px;border-radius:50%;background:radial-gradient(circle,#fff8d8,#e6c46f 60%,rgba(230,196,111,0) 70%);opacity:0;animation:fl-tw var(--ds) ease-in-out var(--dl) infinite}
.inner{position:relative;width:min(88vw,460px);margin:0 auto}
.hv{}
body.fl-ready .hv{animation:fl-up 1.3s cubic-bezier(.2,.7,.2,1) var(--d,0s) both}
body:not(.fl-ready) .hv{opacity:0}
.intro{font:700 calc(clamp(9.5px,2.6vw,11px)*var(--ss))/2 var(--fs);font-style:var(--sts);letter-spacing:.22em;text-transform:uppercase;color:var(--ink);margin:0 auto 12px;text-shadow:0 1px 8px ${SHL}}
.bism{font:400 calc(clamp(26px,7.4vw,34px)*var(--sl))/1.5 AtelierAmiri,Amiri,'Noto Naskh Arabic',serif;color:var(--acc);margin:0 0 8px;direction:rtl;text-shadow:0 1px 8px ${SHL}}
.lbl{font:700 calc(9.5px*var(--ss))/1.5 var(--fs);font-style:var(--sts);letter-spacing:.32em;text-transform:uppercase;color:var(--acc);margin:6px 0 0}
.nm{margin:0;font:400 calc(clamp(40px,12vw,62px)*var(--sn))/1.12 var(--fn);font-style:var(--stn);color:var(--ink);overflow-wrap:normal;word-break:normal;hyphens:none;max-height:2.3em;text-shadow:0 1px 12px ${SH}}
.par{font:400 calc(clamp(14.5px,3.9vw,17px)*var(--sl))/1.5 var(--fl);font-style:var(--stl);color:var(--ink);margin:4px 0 0;text-shadow:0 1px 8px ${SH}}
.amp{font:400 calc(clamp(26px,7.5vw,36px)*var(--sn))/1 var(--fn);font-style:var(--stn);color:var(--acc);margin:6px 0;display:flex;align-items:center;justify-content:center;gap:12px}
.amp:before,.amp:after{content:'';width:min(14vw,60px);height:1px;background:linear-gradient(90deg,transparent,var(--acc))}.amp:after{transform:scaleX(-1)}
.msg{font:400 calc(clamp(15.5px,4.2vw,18px)*var(--sl))/1.75 var(--fl);font-style:var(--stl);color:var(--ink);margin:14px auto 0;white-space:pre-wrap;overflow-wrap:normal;text-shadow:0 1px 8px ${SH}}
.scr{margin-top:18px;font:700 calc(9.5px*var(--ss))/1 var(--fs);letter-spacing:.4em;text-transform:uppercase;color:var(--acc);display:flex;flex-direction:column;align-items:center;gap:8px}
.scr:after{content:'';width:1px;height:34px;background:linear-gradient(var(--acc),transparent);animation:fl-scroll 2.2s ease-in-out infinite}
.kick2{font:700 calc(10.5px*var(--ss))/1.5 var(--fs);font-style:var(--sts);letter-spacing:.34em;text-transform:uppercase;color:var(--acc);margin:0 0 6px;text-shadow:0 1px 8px ${SH}}
.ttl{font:400 calc(clamp(27px,7.6vw,38px)*var(--sh))/1.2 var(--fh);font-style:var(--sth);color:var(--ink);margin:4px 0 6px;text-shadow:0 1px 10px ${SH};overflow-wrap:normal}
.dv{display:flex;align-items:center;justify-content:center;gap:10px;margin:12px auto 22px;width:min(52vw,200px)}
.dv:before,.dv:after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--acc))}.dv:after{transform:scaleX(-1)}
.dv i{width:6px;height:6px;transform:rotate(45deg);background:var(--acc)}
.bigdate{font:400 calc(clamp(56px,17vw,92px)*var(--sh))/1 var(--fh);color:var(--ink);text-shadow:0 2px 14px ${SH};margin:6px 0 2px}
.bigm{font:600 calc(clamp(15px,4.4vw,19px)*var(--ss))/1.4 var(--fs);letter-spacing:.3em;text-transform:uppercase;color:var(--acc);text-shadow:0 1px 8px ${SH}}
.bigw{font:400 calc(clamp(19px,5.4vw,24px)*var(--sl))/1.4 var(--fl);font-style:italic;color:var(--ink);margin-top:8px;text-shadow:0 1px 8px ${SH}}
.cd{display:flex;justify-content:center;gap:10px;margin-top:20px}
.cd div{min-width:60px;text-align:center}
.cd b{display:block;font:400 calc(28px*var(--sh))/1.1 var(--fh);color:var(--ink);text-shadow:0 1px 10px ${SH}}
.cd small{font:700 calc(8.5px*var(--ss))/1.4 var(--fs);letter-spacing:.22em;color:var(--acc);text-transform:uppercase}
.slider{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px calc(50% - min(34vw,150px)) 14px;margin:0 calc(50% - 50vw);scrollbar-width:none;-webkit-overflow-scrolling:touch}
.slider::-webkit-scrollbar{display:none}
.slide{flex:0 0 min(66vw,290px);aspect-ratio:3/4;scroll-snap-align:center;border-radius:180px 180px 14px 14px;overflow:hidden;border:2px solid var(--acc2);box-shadow:0 14px 30px rgba(70,40,30,.25);background:#ddd}
.slide img{width:100%;height:100%;object-fit:cover;display:block}
.tl{position:relative;margin:0 auto;text-align:left;max-width:380px}
.tl-r{display:grid;grid-template-columns:78px 1fr;gap:18px;padding:12px 0;border-bottom:1px solid rgba(120,80,60,.22)}
.tl-r:last-child{border-bottom:0}
.tl-t{font:700 calc(11px*var(--ss))/1.5 var(--fs);letter-spacing:.08em;color:var(--acc);text-align:right;padding-top:4px;text-transform:uppercase;text-shadow:0 1px 6px ${SH}}
.tl-n{font:400 calc(clamp(19px,5.2vw,23px)*var(--sh))/1.25 var(--fh);color:var(--ink);margin:0;text-shadow:0 1px 8px ${SH}}
.tl-d{font:400 calc(15px*var(--sl))/1.5 var(--fl);font-style:var(--stl);margin:2px 0 0;text-shadow:0 1px 8px ${SH}}
.ev{padding:18px 0;border-bottom:1px solid rgba(120,80,60,.22)}
.ev:last-child{border-bottom:0}
.ev h3{font:400 calc(clamp(23px,6.4vw,29px)*var(--sh))/1.25 var(--fh);font-style:var(--sth);color:var(--ink);margin:0 0 4px;text-shadow:0 1px 10px ${SH}}
.ev .ed{font:700 calc(10.5px*var(--ss))/1.7 var(--fs);letter-spacing:.18em;color:var(--acc);text-transform:uppercase;text-shadow:0 1px 6px ${SH}}
.ev .ep{font:400 calc(16px*var(--sl))/1.5 var(--fl);font-style:var(--stl);margin:6px 0 10px;white-space:pre-line;text-shadow:0 1px 8px ${SH}}
.mapbtn{display:inline-block;padding:11px 20px;border:1px solid var(--acc);color:var(--ink);text-decoration:none;font:700 calc(10px*var(--ss))/1.3 var(--fs);letter-spacing:.22em;text-transform:uppercase;border-radius:3px;background:rgba(255,255,255,.35)}
.fam{white-space:pre-wrap;font:400 calc(17px*var(--sl))/1.8 var(--fl);font-style:var(--stl);margin:0 auto 16px;text-shadow:0 1px 8px ${SH}}
.close{font:400 calc(clamp(19px,5.2vw,24px)*var(--sl))/1.6 var(--fl);font-style:var(--stl);margin:0 auto 4px;white-space:pre-wrap;text-shadow:0 1px 10px ${SH}}
.sign{font:400 calc(clamp(36px,10vw,50px)*var(--sn))/1.15 var(--fn);font-style:var(--stn);color:var(--ink);margin:10px 0 4px;text-shadow:0 1px 12px ${SH};max-height:2.3em}
.rsvp{display:inline-block;margin:4px 0 18px;padding:12px 28px;border-radius:40px;border:1px solid var(--acc);background:var(--acc);color:#fff;text-decoration:none;font:700 calc(10.5px*var(--ss))/1.3 var(--fs);letter-spacing:.3em}
.small{font:700 calc(9.5px*var(--ss))/1.5 var(--fs);letter-spacing:.24em;color:var(--acc);text-transform:uppercase;text-shadow:0 1px 8px ${SH}}
.credit{position:relative;z-index:3;padding:14px;text-align:center;background:#f6efe7;color:#9a7a6a;font:10px Arial,sans-serif;letter-spacing:2px}
.lightbox{position:fixed;inset:0;z-index:150;background:#000e;display:none;align-items:center;justify-content:center;padding:18px}.lightbox.on{display:flex}.lightbox img{max-width:100%;max-height:100%;border-radius:10px}
.mbtn{position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:120;width:44px;height:44px;border-radius:50%;border:1px solid var(--acc);background:rgba(255,255,255,.85);color:var(--ink);font-size:18px;cursor:pointer;display:none}.mbtn.on{display:block}
.fl-js .rv{opacity:0;transform:translateY(24px);filter:blur(5px);transition:opacity 1.1s ease var(--d,0s),transform 1.1s cubic-bezier(.2,.7,.2,1) var(--d,0s),filter 1.1s ease var(--d,0s)}
.fl-js .rv.in{opacity:1;transform:none;filter:none}
.fl-prev [data-rs]{cursor:pointer}.fl-prev [data-rs]:hover{outline:1px dashed var(--acc);outline-offset:3px}
${secRules}
@keyframes fl-seal{0%{box-shadow:0 0 0 0 rgba(255,236,170,.7)}100%{box-shadow:0 0 0 34px rgba(255,236,170,0)}}
@keyframes fl-flash{0%{transform:translate(-50%,-50%) scale(0);opacity:1}100%{transform:translate(-50%,-50%) scale(8);opacity:0}}
@keyframes fl-bob{0%,100%{transform:translate(-50%,-50%)}50%{transform:translate(-50%,calc(-50% - 5px))}}
@keyframes fl-up{from{opacity:0;transform:translateY(22px);filter:blur(6px)}to{opacity:1;transform:none;filter:none}}
@keyframes fl-scroll{0%,100%{transform:scaleY(.4);transform-origin:top;opacity:.4}50%{transform:scaleY(1);opacity:1}}
@keyframes fl-wing{0%{transform:scaleX(1)}100%{transform:scaleX(.35)}}
@keyframes fl-fly{0%{opacity:0;transform:translate3d(0,0,0) rotate(-6deg)}10%{opacity:.95}50%{transform:translate3d(22px,-26px,0) rotate(7deg)}90%{opacity:.9}100%{opacity:0;transform:translate3d(-14px,-54px,0) rotate(-4deg)}}
@keyframes fl-flap{0%{transform:scaleX(1)}100%{transform:scaleX(.3)}}
@keyframes fl-tw{0%,100%{opacity:0;transform:scale(.4)}50%{opacity:.95;transform:scale(1.15)}}
@media(max-width:380px){.tl-r{grid-template-columns:64px 1fr;gap:12px}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}.fl-js .rv{opacity:1;transform:none;filter:none}}
${m.cfg.align==='left'?':root{--al:left;--jc:flex-start;--mL:8vw;--mR:auto}':m.cfg.align==='right'?':root{--al:right;--jc:flex-end;--mL:auto;--mR:8vw}':':root{--al:center;--jc:center;--mL:auto;--mR:auto}'}.sec{justify-content:var(--jc)!important}.sec .inner,.sec .wide{margin-left:var(--mL)!important;margin-right:var(--mR)!important;text-align:var(--al)!important}
${m.customCSS}`};

/* ------------------------------------------------------------------ markup */
function body(m,t,bg){
 const w=m.w;
  const verseBlock=(m.verseAr||m.verseEn)?`<div class="hv" style="--d:1.7s">${m.verseAr?`<p class="ar-verse" lang="ar" dir="rtl">${esc(m.verseAr)}</p>`:''}${m.verseEn?`<p class="ar-en">${esc(m.verseEn)}</p>`:''}</div>`:'';
 const duaBlock=(m.blAr||m.blEn)?`<div class="rv">${m.blAr?`<p class="ar-dua" lang="ar" dir="rtl">${esc(m.blAr)}</p>`:''}${m.blEn?`<p class="ar-en">“${esc(m.blEn)}”</p>`:''}</div>`:'';

 const prevChip=(m.prev&&m.openLogo&&!m.gate)?`<div class="omg lift corner" style="animation:none"><img src="${esc(m.openLogo)}" alt=""></div>`:'';
 const l1=m.p1&&/^\s*d\s*\/\s*o\b/i.test(m.p1)?'':`<p class="lbl hv" data-rs="rsLabel1" style="--d:.5s">${esc(m.l1)}</p>`;
 const l2=m.p2&&/^\s*s\s*\/\s*o\b/i.test(m.p2)?'':`<p class="lbl hv" data-rs="rsLabel2" style="--d:1s">${esc(m.l2)}</p>`;
 const hero=`<section class="sec sec-hero" id="top" data-bg="hero">${bflies(5,11,t)}${dust(14,31)}<div class="sbg" data-par></div><div class="inner">
 ${m.bismText?ed('rsBismillah','p','bism hv',esc(m.bismText),' style="--d:.1s" lang="ar" dir="rtl"'):''}
 ${ed('rsIntro','p','intro hv',esc(m.intro),' style="--d:.2s"')}
 ${l1}${ed('name1','h1','nm hv fit2',esc(m.n1),' style="--d:.6s"')}
 ${m.p1?ed('parents1','p','par hv',esc(m.p1),' style="--d:.8s"'):''}
 <div class="amp hv" style="--d:.95s">&amp;</div>
 ${l2}${ed('name2','h1','nm hv fit2',esc(m.n2),' style="--d:1.2s"')}
 ${m.p2?ed('parents2','p','par hv',esc(m.p2),' style="--d:1.35s"'):''}
 ${m.message?ed('message','p','msg hv',esc(m.message),' style="--d:1.5s"'):''}
 ${verseBlock}${ed('rsScroll','div','scr hv',esc(m.scroll),' style="--d:1.8s"')}
 </div></section>`;
 const cdHtml=m.dateIso?`<div class="cd rv" id="fl-cd"><div><b id="cd-d">0</b><small>Days</small></div><div><b id="cd-h">0</b><small>Hours</small></div><div><b id="cd-m">0</b><small>Min</small></div><div><b id="cd-s">0</b><small>Sec</small></div></div>`:'';
 const dateBlock=w?`<div class="bigm rv">${esc(w.day)}</div><div class="bigdate rv">${esc(w.date)}</div><div class="bigm rv">${esc(w.month)} ${esc(w.year)}</div>${m.timeText?`<p class="bigw rv">${esc(m.timeText)}</p>`:''}`:`<p class="bigw rv">Date to be announced</p>`;
 const dateSec=`<section class="sec sec-date" id="date" data-bg="date">${bflies(3,41,t)}${dust(10,51)}<div class="sbg" data-par></div><div class="inner">${ed('rsDateKicker','p','kick2 rv',esc(m.dateKick))}${ed('rsDateTitle','h2','ttl rv',esc(m.dateTitle),' style="--d:.1s"')}<div class="dv rv"><i></i></div>${dateBlock}${cdHtml}</div></section>`;
 const slides=m.photos.map((src,i)=>`<div class="slide" data-i="${i}"><img src="${esc(src)}" alt="Wedding photo ${i+1}" loading="lazy"></div>`).join('');
 const story=m.photos.length?`<section class="sec sec-story" id="story" data-bg="story">${dust(9,61)}<div class="sbg" data-par></div><div style="width:100%;position:relative"><div class="inner">${ed('rsStoryKicker','p','kick2 rv',esc(m.storyKick))}${ed('rsStoryTitle','h2','ttl rv',esc(m.storyTitle),' style="--d:.1s"')}<div class="dv rv"><i></i></div></div><div class="slider rv" id="fl-slider" style="--d:.15s">${slides}</div>${m.photos.length>1?`<div class="dots">${m.photos.map((_,i)=>`<b${i?'':' class="on"'}></b>`).join('')}</div>`:''}</div></section>`:'';
 const tl=m.schedule.length?`<section class="sec sec-day" id="day" data-bg="day">${bflies(3,71,t)}${dust(8,81)}<div class="sbg" data-par></div><div class="inner">${ed('rsDayKicker','p','kick2 rv',esc(m.dayKick))}${ed('rsDayTitle','h2','ttl rv',esc(m.dayTitle),' style="--d:.1s"')}<div class="dv rv"><i></i></div><div class="tl" data-rs="schedule">${m.schedule.map((s,i)=>`<div class="tl-r rv" style="--d:${(i*.1).toFixed(1)}s"><div class="tl-t">${esc(s.time||'')}</div><div><p class="tl-n">${brk(s.title)}</p>${s.detail?`<p class="tl-d">${esc(s.detail)}</p>`:''}</div></div>`).join('')}</div></div></section>`:'';
 const cards=m.events.length?`<section class="sec sec-events" id="events" data-bg="events">${dust(8,91)}<div class="sbg" data-par></div><div class="inner">${ed('rsEventsTitle','h2','ttl rv',esc(m.evTitle))}<div class="dv rv"><i></i></div><div data-rs="eventsText">${m.events.map((e,i)=>`<article class="ev rv" style="--d:${(i*.12).toFixed(2)}s"><h3>${esc(e.title)}</h3>${e.date?`<div class="ed">${esc(e.date)}</div>`:''}${e.place?`<p class="ep">${esc(e.place)}</p>`:''}${e.map?`<a class="mapbtn" href="${esc(e.map)}" target="_blank" rel="noopener noreferrer">View on map</a>`:''}</article>`).join('')}</div></div></section>`:'';
 const end=`<section class="sec sec-end" id="with-love" data-bg="end">${bflies(4,101,t)}${dust(10,111)}<div class="sbg" data-par></div><div class="inner">
 ${duaBlock}${m.family?ed('family','p','fam rv',esc(m.family)):''}
 ${m.rsvp?`<a class="rsvp rv" href="${esc(m.rsvp)}" target="_blank" rel="noopener noreferrer">RSVP</a>`:''}
 ${ed('rsClosing','p','close rv',esc(m.closing),' style="--d:.1s"')}
 <div class="dv rv"><i></i></div>
 <p class="sign rv fit2" data-rs="name1">${esc(m.n1)} &amp; ${esc(m.n2)}</p>
 ${m.from?ed('wishesFrom','p','small rv',esc(m.from)):''}
 </div></section>`;
 const gate=m.gate?`<div id="fl-gate" class="gate" role="dialog" aria-modal="true" aria-label="Open the invitation"><div class="envimg"></div><i class="sealc"></i><i class="flash"></i>${m.openLogo?`<div class="omg" id="fl-om"><img src="${esc(m.openLogo)}" alt=""></div>`:''}<div class="tap"><span class="kick">You are invited</span><button type="button" class="tapw" id="fl-open" data-rs="rsOpen">${esc(m.open)}</button></div><button type="button" class="g-hit" id="fl-hit" aria-label="Open the invitation"></button><button type="button" class="g-skip" id="fl-skip">Skip</button></div>`:'';
 const audio=m.music?`<audio id="fl-music" loop preload="none" src="${esc(m.music)}"></audio><button type="button" class="mbtn on" id="fl-mbtn" aria-label="Play or pause music">\u266A</button>`:'';
 const defs=`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="fl-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.acc2}"/><stop offset=".5" stop-color="#fff6dc"/><stop offset="1" stop-color="${t.acc}"/></linearGradient></defs></svg>`;
 return `${defs}${gate}${prevChip}<main>${hero}${dateSec}${story}${tl}${cards}${end}</main><div class="credit">Made with Mubiey Studio</div>${audio}`;
}

/* ------------------------------------------------------------------ runtime */
function runtime(){
 const Rt=window.FL||{},$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],B=document.body;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const setH=()=>document.documentElement.style.setProperty('--H',innerHeight+'px');setH();addEventListener('resize',setH);
 const audio=$('#fl-music'),mb=$('#fl-mbtn');if(mb)mb.onclick=()=>{audio.paused?audio.play().catch(()=>{}):audio.pause()};
 /* two-line name fit: shrink until the name fits in at most two lines, never break a word */
 const fit2=()=>$$('.fit2').forEach(el=>{el.style.fontSize='';const cs=parseFloat(getComputedStyle(el).fontSize);const lh=parseFloat(getComputedStyle(el).lineHeight)||cs*1.12;let f=cs,n=0;while((el.scrollHeight>lh*2+2||el.scrollWidth>el.clientWidth+1)&&f>cs*.5&&n++<40){f*=.95;el.style.fontSize=f+'px'}});
 fit2();addEventListener('resize',fit2);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit2);setTimeout(fit2,700);
 /* opening */
 const gate=$('#fl-gate');
 const ready=()=>{B.classList.add('fl-ready')};
 if(!gate){ready()}
 else{
  B.classList.add('fl-locked');let opened=false,finished=false;const timers=[];const later=(f,ms)=>timers.push(setTimeout(f,ms));
  const done=()=>{if(finished)return;finished=true;timers.forEach(clearTimeout);gate.classList.add('gone');B.classList.remove('fl-locked');ready();scrollTo(0,0)};
  const go=()=>{if(opened)return;opened=true;if(Rt.autoplay&&audio)audio.play().catch(()=>{});gate.classList.add('open');
   const om=$('#fl-om');
   if(om){const r=om.getBoundingClientRect();document.body.append(om);om.classList.add('lift');om.style.left=r.left+'px';om.style.top=r.top+'px';om.style.width=r.width+'px';om.style.height=r.height+'px';om.style.transform='none';
    requestAnimationFrame(()=>requestAnimationFrame(()=>om.classList.add('corner')))}
   if(reduce){later(done,300);return}
   later(()=>ready(),700);later(done,1900)};
  $('#fl-open').onclick=go;$('#fl-hit').onclick=go;$('#fl-skip').onclick=done;
 }
 /* parallax: each page's artwork moves a little while you scroll */
 const pars=$$('[data-par]');
 const onScroll=()=>{$$('.sec').forEach((s,i)=>{const r=s.getBoundingClientRect();const p=Math.max(-1,Math.min(1,(r.top+r.height/2-innerHeight/2)/(innerHeight/2+r.height/2)));const b=s.querySelector('.sbg');if(b)b.style.setProperty('--p',(-p).toFixed(3))})};
 if(!reduce){let tk=false;addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(()=>{tk=false;onScroll()})}},{passive:true});onScroll()}
 /* reveal */
 const rv=$$('.rv');
 if('IntersectionObserver' in window&&!Rt.prev){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});rv.forEach(n=>io.observe(n))}else rv.forEach(n=>n.classList.add('in'));
 /* countdown */
 if($('#fl-cd')&&Rt.dateIso){const t=Date.parse(Rt.dateIso),set=(id,v)=>{const e=$('#'+id);if(e)e.textContent=v};const tk=()=>{const s=Math.max(0,Math.floor((t-Date.now())/1000));set('cd-d',Math.floor(s/86400));set('cd-h',Math.floor(s%86400/3600));set('cd-m',Math.floor(s%3600/60));set('cd-s',s%60)};tk();setInterval(tk,1000)}
 /* photos */
 const sl=$('#fl-slider');
 if(sl){const slides=$$('.slide'),dots=$$('.dots b'),lb=document.createElement('div');lb.className='lightbox';lb.innerHTML='<img alt="">';document.body.append(lb);lb.onclick=()=>lb.classList.remove('on');
  const step=()=>slides.length>1?slides[1].offsetLeft-slides[0].offsetLeft:sl.clientWidth,idx=()=>Math.min(slides.length-1,Math.max(0,Math.round(sl.scrollLeft/step())));
  sl.addEventListener('scroll',()=>{const i=idx();dots.forEach((d,k)=>d.classList.toggle('on',k===i))},{passive:true});
  slides.forEach((s,i)=>s.addEventListener('click',()=>{if(Rt.prev){parent.postMessage({type:'mubiey-direct-photo',index:i},'*');return}lb.firstChild.src=s.querySelector('img').src;lb.classList.add('on')}));
  if(slides.length>1&&!reduce&&!Rt.prev){let hold=false,vis=false;['pointerdown','touchstart','wheel'].forEach(t=>sl.addEventListener(t,()=>{hold=true;setTimeout(()=>hold=false,9000)},{passive:true}));
   if('IntersectionObserver' in window)new IntersectionObserver(es=>vis=es[0].isIntersecting,{threshold:.5}).observe(sl);
   setInterval(()=>{if(hold||!vis)return;sl.scrollTo({left:((idx()+1)%slides.length)*step(),behavior:'smooth'})},4600)}}
 /* editor preview: tap text to edit it */
 if(Rt.prev){B.classList.add('fl-prev');$$('[data-rs]').forEach(n=>n.addEventListener('click',e=>{e.preventDefault();parent.postMessage({type:'mubiey-rs-edit',field:n.dataset.rs},'*')}))}
}

/* ------------------------------------------------------------------ document */
function render(d){
 const t=THEMES[d.template],m=R.model(d),bg=readBg(d,t);
 m.verseAr=str(d.verseArabic,300);m.verseEn=str(d.verse,300);m.blAr=str(d.blessingArabic,400);m.blEn=str(d.blessing,400);
 
 const muslim=!['Hindu','Christian'].includes(d.tradition),custom=str(d.rsBismillah,200);
 m.bismText=custom||(muslim?'\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650':'');
 const rt={prev:m.prev,autoplay:m.autoplay,dateIso:m.dateIso};
 const cls=['fl-js',m.gate?'fl-locked':'',m.prev?'fl-prev':''].filter(Boolean).join(' ');
 const sections=`<style>${SECTIONS.map(k=>`.sec-${k} .sbg{background-image:url('${esc(bg[k].src)}')}`).join('')}</style>`;
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>${esc(m.n1)} &amp; ${esc(m.n2)} \u2014 Wedding invitation</title><script>document.documentElement.classList.add('fl-js')<\/script><style>${fontCSS(R.needFonts(m))}${CSS(m,t,bg)}${m.cfg.gold?`:root{--acc:${m.cfg.gold}}`:''}:root{--olsz:${m.cfg.olSize||100}}</style>${sections}<noscript><style>.gate{display:none}body.fl-locked{overflow:auto}.rv,.hv{opacity:1!important;transform:none!important;filter:none!important}</style></noscript></head><body class="${cls}"><div class="veil-root"></div>${body(m,t,bg)}<script>window.FL=${json(rt)};<\/script><script>(${runtime.toString().replace(/<\/script/gi,'<\\/script')})();<\/script></body></html>`;
}
window.MubieyFlora={ids:Object.keys(THEMES),themes:THEMES,SECTIONS,DEFAULT_BG,SRC};
const ids=Object.keys(THEMES);
invitationDocument=function(data){return data&&THEMES[data.template]?render(data):baseDocument.apply(this,arguments)};
})();
