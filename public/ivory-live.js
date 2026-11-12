/* Mubiey Studio · "Ivory Envelope" live invitations, five colourways: 2005 Ivory Gold, 2006 Sage Garden,
   2007 Blush Rose, 2008 Powder Blue, 2009 Champagne Noir.   (Loads after ruby-luxury.js, which supplies the helpers.)

   Opening : a floral envelope sealed with a gold wax seal. Tap it: the seal cracks in a flash of gold, the four flaps
             fold open and gold dust bursts out, revealing the arch.
   Arch    : the calligraphy Bismillah glows at the top of the arch, lantern + candle flames flicker, gold light
             sweeps across, petals and sparkles drift. Every piece of text lives inside a safe zone in the middle of the
             artwork (never over the flowers or lanterns); long names wrap and shrink to fit.
   Scroll  : each section fades in its own background (arch, sage watercolour, floral paper) while the last fades out.
   Calendar: the wedding month on an ivory plate. Any day can carry a HEART (the main date) or a RING (another
             programme). The heart pops and beats, the ring draws itself, tiny hearts float up. Month, year and marks
             are chosen in the editor ("Calendar") and saved in the `rubyCfg` field (key `cal`).
   Fonts and sizes use the same four groups as Ruby Luxury (rubyCfg.f / rubyCfg.s). Logo + Arabic font are drawn by
   logo-overlay.js / arabic-font.js for every design, so they are not repeated here. */
'use strict';
(()=>{
const R=window.MubieyRuby;
if(!R||!R.h||typeof invitationDocument!=='function'||typeof Studio==='undefined')return;
const {esc,str,when,fontCSS,json,ed,ASSET_ROOT}=R.h;
const baseDocument=invitationDocument;
const A=ASSET_ROOT+'assets/ivory/';

/* ------------------------------------------------------------------ colourways */
const THEMES={
 '2005':{name:'Ivory Gold',  dark:0,fill:'#efe6d6',ink:'#6a2231',txt:'#5b4033',acc:'#b08a3e',acc2:'#e1c071',pan:'rgba(251,246,236,.74)',heart:'#6e0f25',heart2:'#b02a48',f:'none',hero:'arch',date:'env',story:'sage',day:'arch',events:'env',end:'arch',gate:'none'},
 '2006':{name:'Sage Garden', dark:0,fill:'#e7eadb',ink:'#2f4a3a',txt:'#3d4d40',acc:'#a68c4a',acc2:'#d8c079',pan:'rgba(248,250,242,.76)',heart:'#2f5a46',heart2:'#5d8f74',f:'none',hero:'sage',date:'sage',story:'env',day:'sage',events:'env',end:'sage',gate:'sepia(.3) hue-rotate(52deg) saturate(.9)'},
 '2007':{name:'Blush Rose',  dark:0,fill:'#f2dfdc',ink:'#7a2b44',txt:'#68443f',acc:'#b88455',acc2:'#e6bc8c',pan:'rgba(255,244,241,.76)',heart:'#a42746',heart2:'#e0607f',f:'sepia(.45) saturate(1.25) hue-rotate(-34deg)',hero:'arch',date:'env',story:'arch',day:'env',events:'arch',end:'env',gate:'sepia(.45) saturate(1.25) hue-rotate(-34deg)'},
 '2008':{name:'Powder Blue', dark:0,fill:'#dfe6ee',ink:'#2a4766',txt:'#36485a',acc:'#a9965f',acc2:'#dcc88e',pan:'rgba(244,248,252,.76)',heart:'#27567f',heart2:'#5f93c4',f:'sepia(.5) hue-rotate(168deg) saturate(.75) brightness(1.02)',hero:'arch',date:'env',story:'arch',day:'env',events:'arch',end:'env',gate:'sepia(.5) hue-rotate(168deg) saturate(.75) brightness(1.02)'},
 '2009':{name:'Champagne Noir',dark:1,fill:'#14110f',ink:'#f2e2c0',txt:'#eadbc2',acc:'#d8b667',acc2:'#f3dc9b',pan:'rgba(20,16,14,.66)',heart:'#a1203a',heart2:'#e0566f',f:'brightness(.3) sepia(.12) saturate(1.1) contrast(1.2)',hero:'arch',date:'env',story:'arch',day:'env',events:'arch',end:'arch',gate:'brightness(.38) sepia(.1) saturate(1.1) contrast(1.15)'}
};
const SCENES={arch:'arch.jpg',sage:'sage.jpg',env:'sage.jpg'}; /* the envelope is only the opening picture */
/* lantern + candle flame positions on the arch picture (% of its width / height) */
const FLAMES=[[90.3,23,1.6],[85.9,33.7,1.4],[11.1,92.6,1.5],[17.8,95.1,1.1],[92,92.6,1.5],[83.8,95.2,1.1],[2.8,94,.8],[6.6,96,.8],[96,90.6,.8],[96.6,96.4,.8]];

/* ------------------------------------------------------------------ calendar settings (rubyCfg.cal) */
function readCal(d){
 let c={};try{const j=JSON.parse(typeof d.rubyCfg==='string'&&d.rubyCfg?d.rubyCfg:'{}');if(j&&j.cal&&typeof j.cal==='object')c=j.cal}catch{}
 const w=/^(\d{4})-(\d{2})-(\d{2})/.exec(d.date||'');
 let y=Number(c.y),mo=Number(c.m);
 if(!(y>=2020&&y<=2040&&mo>=1&&mo<=12)){if(w){y=+w[1];mo=+w[2]}else{const n=new Date();y=n.getFullYear();mo=n.getMonth()+1}}
 const dim=new Date(Date.UTC(y,mo,0)).getUTCDate(),marks={};
 if(c.marks&&typeof c.marks==='object')for(const [k,v] of Object.entries(c.marks)){const n=+k;if(n>=1&&n<=dim&&(v==='h'||v==='r'))marks[n]=v}
 if(!Object.keys(marks).length&&w&&+w[1]===y&&+w[2]===mo)marks[+w[3]]='h';
 return {y,mo,dim,marks,note:typeof c.note==='string'?c.note.trim().slice(0,90):''};
}
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const WDAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const HEART='<svg class="hrt" viewBox="0 0 48 44" aria-hidden="true"><path d="M24 42S3 28.6 3 15.4C3 8.4 8.6 3.6 15 3.6c3.9 0 7.3 2 9 5.2 1.7-3.2 5.1-5.2 9-5.2 6.4 0 12 4.8 12 11.8C45 28.6 24 42 24 42z" fill="url(#ivh)"/><path d="M12 11c2-2.6 5.6-3 8-1.2" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/></svg>';
const RING='<svg class="rng" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="19" pathLength="1"/><circle class="gl" cx="22" cy="22" r="19" pathLength="1"/></svg>';
function calendarHtml(cal,m){
 const first=new Date(Date.UTC(cal.y,cal.mo-1,1)).getUTCDay();let cells='';
 for(let i=0;i<first;i++)cells+='<i></i>';
 for(let n=1;n<=cal.dim;n++){const k=cal.marks[n];cells+=`<b class="dy${k?' mk '+k:''}" style="--i:${first+n}">${k==='h'?HEART:k==='r'?RING:''}<span>${n}</span></b>`}
 const hd=Object.keys(cal.marks).map(Number).sort((a,b)=>a-b).find(n=>cal.marks[n]==='h');
 let cap='';
 const day=hd||(m.w&&cal.marks[+m.w.date]?+m.w.date:0);
 if(day)cap=`${WDAYS[new Date(Date.UTC(cal.y,cal.mo-1,day)).getUTCDay()]}, ${day} ${MONTHS[cal.mo-1]} ${cal.y}`;
 return `<div class="cal-m">${MONTHS[cal.mo-1].toUpperCase()} <small>${cal.y}</small></div><div class="cal-w">${['S','M','T','W','T','F','S'].map(x=>`<i>${x}</i>`).join('')}</div><div class="cal-g">${cells}</div>${cap?`<p class="cal-cap">${esc(cap)}</p>`:''}${cal.note?`<p class="cal-note" data-cal="note">${esc(cal.note)}</p>`:''}`;
}

/* per-page backgrounds (same choices as Floral: frame / ribbon / damask, or your own picture) */
function pageBg(d){let j={};try{j=JSON.parse(typeof d.floraBg==='string'&&d.floraBg?d.floraBg:'{}')||{}}catch{j={}}const F={frame:'frame.jpg',ribbon:'ribbon.jpg',damask:'damask.jpg'};const out={};for(const k of ['hero','date','story','day','events','end']){const v=j[k];if(typeof v==='string'&&v.startsWith('data:image/')&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v)&&v.length<120000)out[k]=v;else if(F[v])out[k]=R.h.ASSET_ROOT+'assets/flora/'+F[v]}return out}
/* ------------------------------------------------------------------ styles */

const CSS=(m,t)=>{
 const f=m.fonts,s=m.cfg.s;
 return `
:root{--fn:${f.names.fam};--fh:${f.heads.fam};--fl:${f.lines.fam};--fs:${f.small.fam};--stl:${f.lines.italic?'italic':'normal'};--stn:${f.names.italic?'italic':'normal'};--sth:${f.heads.italic?'italic':'normal'};--sts:${f.small.italic?'italic':'normal'};
--sn:${(s.names/100).toFixed(2)};--sh:${(s.heads/100).toFixed(2)};--sl:${(s.lines/100).toFixed(2)};--ss:${(s.small/100).toFixed(2)};
--ink:${t.ink};--txt:${t.txt};--acc:${t.acc};--acc2:${t.acc2};--fill:${t.fill};--pan:${t.pan};--heart:${t.heart};--heart2:${t.heart2};--imgf:${t.f};--H:100svh;--SW:calc(var(--H)*.5625);color-scheme:${t.dark?'dark':'light'}}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{background:var(--fill)}
body{margin:0;background:var(--fill);color:var(--txt);font:400 calc(18px*var(--sl))/1.7 var(--fl);font-style:var(--stl);overflow-x:hidden;-webkit-font-smoothing:antialiased}
body.iv-locked{overflow:hidden;height:100svh}
/* ---------- fixed scenes ---------- */
.bgs{position:fixed;inset:0;z-index:0;background:var(--fill);overflow:hidden}
${m.arFontCSS||''}.ar-verse,.ar-dua{direction:rtl;font-family:${m.arFam||"AtelierAmiri,Amiri,serif"};text-align:center;margin:12px auto 4px;line-height:1.7;text-shadow:0 1px 8px rgba(255,255,255,.85)}
.ar-verse{font-size:clamp(20px,5.8vw,26px);color:var(--acc)}
.ar-dua{font-size:clamp(19px,5.4vw,24px);color:var(--ink,var(--acc))}
.ar-en{font-family:var(--fl);font-style:italic;font-size:clamp(14px,3.9vw,16px);line-height:1.6;margin:4px auto 10px;max-width:24em;text-shadow:0 1px 8px rgba(255,255,255,.85)}
.sbgx{position:absolute;inset:0;z-index:-1;overflow:hidden;pointer-events:none}
.sbgx .bgl{opacity:1!important;transform:none!important}
.sbgx .scene{transform:translateX(-50%) scale(1)!important}
.sec{isolation:isolate}

.bgl{position:absolute;inset:0;opacity:0;transition:opacity 1.5s ease;will-change:opacity}
.bgl.on{opacity:1}
.scene{position:absolute;left:50%;top:0;height:100%;width:var(--SW);transform:translateX(-50%) scale(1.07);transition:transform 7s cubic-bezier(.2,.6,.2,1)}
.bgl.on .scene{transform:translateX(-50%) scale(1)}
.scene .img{position:absolute;inset:0;background-size:100% 100%;filter:var(--imgf);-webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)}
.bgl .veil{position:absolute;inset:0;background:var(--veil,transparent)}
.fx{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.flame{position:absolute;width:calc(var(--s)*13%);aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,226,150,.95),rgba(255,196,96,.45) 38%,rgba(255,196,96,0) 70%);mix-blend-mode:${t.dark?'screen':'normal'};opacity:.85;animation:iv-flick 2.6s ease-in-out infinite alternate;animation-delay:var(--d)}
.sweep{position:absolute;inset:-20%;background:linear-gradient(115deg,transparent 40%,rgba(255,248,222,${t.dark?.14:.5}) 50%,transparent 60%);transform:translateX(-80%);animation:iv-sweep 7.5s ease-in-out infinite}
.bism{position:absolute;left:36.2%;top:6%;width:24%;aspect-ratio:1.004;opacity:0;transition:opacity 2s ease 1.2s;background:linear-gradient(105deg,${t.acc} 0%,${t.acc2} 30%,${t.acc} 48%,#fff4cf 58%,${t.acc} 72%,${t.acc2} 100%);background-size:260% 100%;-webkit-mask:url('${A}bismillah.png') center/contain no-repeat;mask:url('${A}bismillah.png') center/contain no-repeat;animation:iv-foil 6s ease-in-out infinite alternate;filter:drop-shadow(0 0 8px rgba(255,226,150,.55))}
body.iv-ready .bism{opacity:1}
.petals{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:2}
.petals i{position:absolute;top:-8%;width:var(--w);height:calc(var(--w)*1.35);border-radius:80% 0 80% 0;background:${t.dark?'linear-gradient(135deg,#f3dc9b,#9a7a34)':'linear-gradient(135deg,#fff,var(--pc,#f6d9d6))'};opacity:0;box-shadow:0 1px 3px rgba(0,0,0,.12);animation:iv-fall var(--t) linear var(--d) infinite}
/* ---------- gate: envelope + wax seal ---------- */
.gate{position:fixed;inset:0;z-index:100;background:var(--fill);overflow:hidden;perspective:1300px}
.gate.gone{display:none}
.envbox{position:absolute;left:50%;top:0;height:100%;width:var(--SW);transform:translateX(-50%);transform-style:preserve-3d;animation:iv-breathe 5s ease-in-out infinite alternate}
.flap{position:absolute;inset:0;background:url('${A}envelope.jpg') center/100% 100% no-repeat;filter:${t.gate};backface-visibility:hidden;will-change:transform,opacity}
.flap.t{clip-path:polygon(0 0,100% 0,50.5% 49.8%);transform-origin:50% 0}
.flap.r{clip-path:polygon(100% 0,100% 100%,50.5% 49.8%);transform-origin:100% 50%}
.flap.b{clip-path:polygon(100% 100%,0 100%,50.5% 49.8%);transform-origin:50% 100%}
.flap.l{clip-path:polygon(0 100%,0 0,50.5% 49.8%);transform-origin:0 50%}
.gate.open .flap.t{animation:iv-ft 1.5s cubic-bezier(.6,.05,.3,1) .25s forwards}
.gate.open .flap.b{animation:iv-fb 1.5s cubic-bezier(.6,.05,.3,1) .35s forwards}
.gate.open .flap.l{animation:iv-fl 1.5s cubic-bezier(.6,.05,.3,1) .45s forwards}
.gate.open .flap.r{animation:iv-fr 1.5s cubic-bezier(.6,.05,.3,1) .45s forwards}
.gate.open{pointer-events:none;background:transparent;transition:background .6s ease .2s}
.gate.open .envbox{animation:none}
.seal-ring{position:absolute;left:50.5%;top:49.8%;width:35%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;animation:iv-seal 2.4s ease-out infinite}
.seal-flash{position:absolute;left:50.5%;top:49.8%;width:20%;aspect-ratio:1;transform:translate(-50%,-50%) scale(0);border-radius:50%;background:radial-gradient(circle,#fffbe8,rgba(255,226,150,.85) 35%,rgba(255,226,150,0) 70%);opacity:0;pointer-events:none}
.gate.open .seal-ring{display:none}
.gate.open .seal-flash{animation:iv-flash 1.3s ease-out forwards}
.g-ui{position:absolute;left:50%;top:0;height:100%;width:var(--SW);transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:calc(var(--H)*.2);z-index:3;transition:opacity .5s ease}
.gate.open .g-ui{opacity:0}
.omw{position:absolute;left:50%;top:0;height:100%;width:var(--SW);transform:translateX(-50%);pointer-events:none;z-index:5}
.om{position:absolute;left:50.5%;top:49.8%;width:33%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,#fffaf0,#efe2c4 80%);box-shadow:0 6px 18px rgba(60,40,10,.35),inset 0 0 0 3px #d9b46a,inset 0 0 0 6px #fff4d6,inset 0 0 0 7px #b88c3e;padding:0;overflow:visible;animation:iv-om 2.4s ease-in-out infinite alternate}
.om img{position:absolute;left:50%;top:50%;width:calc(var(--olsz,100)*1%);height:calc(var(--olsz,100)*1%);transform:translate(-50%,-50%);object-fit:contain;display:block;border-radius:50%;mix-blend-mode:multiply}
.om.lift{position:fixed;animation:none;z-index:140;transition:left 1.3s cubic-bezier(.3,.6,.2,1),top 1.3s cubic-bezier(.3,.6,.2,1),width 1.3s cubic-bezier(.3,.6,.2,1),height 1.3s cubic-bezier(.3,.6,.2,1),transform 1.3s cubic-bezier(.3,.6,.2,1)}
.om.lift.corner{left:14px!important;top:calc(14px + env(safe-area-inset-top,0px))!important;width:60px!important;height:60px!important;transform:none!important;padding:6px;box-shadow:0 3px 12px rgba(0,0,0,.25)}
@keyframes iv-om{from{transform:translate(-50%,-50%) scale(1)}to{transform:translate(-50%,-50%) scale(1.03)}}
@keyframes iv-omout{to{transform:translate(-50%,-190%) scale(1.2);opacity:0}}
.g-hit{all:unset;position:absolute;left:50.5%;top:49.8%;width:calc(var(--SW)*.38);aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;cursor:pointer;z-index:4}
.g-hit:focus-visible{outline:2px solid var(--acc);outline-offset:6px}
.g-tap{font:400 calc(clamp(32px,9.4vw,46px)*var(--sn))/1.1 var(--fn);font-style:var(--stn);color:var(--ink);text-shadow:0 1px 10px rgba(255,255,255,.65);text-align:center;max-width:88%;overflow-wrap:anywhere;animation:iv-bob 2.8s ease-in-out infinite}
.g-kick{font:700 calc(10px*var(--ss))/1.5 var(--fs);letter-spacing:.42em;text-transform:uppercase;color:var(--ink);opacity:.8;margin-bottom:8px;text-align:center}
.g-skip{all:unset;cursor:pointer;position:absolute;z-index:6;left:50%;bottom:calc(16px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);padding:10px 18px;font:700 10px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:var(--ink);opacity:0;pointer-events:none;transition:opacity .6s ease}
.gate.open .g-skip{opacity:.7;pointer-events:auto;transition-delay:1s}
#iv-sp{position:fixed;inset:0;width:100%;height:100%;z-index:110;pointer-events:none}
/* ---------- content ---------- */
main{position:relative;z-index:3}
.sec{position:relative;min-height:100svh;display:flex;align-items:center;justify-content:center;padding:84px 0 76px;text-align:center}
.inner{position:relative;width:min(calc(var(--SW)*.66),88vw);margin:0 auto}
.wide{width:min(calc(var(--SW)*.8),92vw)}
.hero{padding-top:calc(var(--H)*.235);padding-bottom:calc(var(--H)*.1);align-items:flex-start}
.hero .inner{width:min(calc(var(--SW)*.6),84vw)}
body:not(.iv-ready) .hv{opacity:0}
body.iv-ready .hv{animation:iv-up 1.4s cubic-bezier(.2,.7,.2,1) var(--d,0s) both}
.intro{font:700 calc(clamp(9.5px,2.6vw,11.5px)*var(--ss))/2 var(--fs);font-style:var(--sts);letter-spacing:.22em;text-transform:uppercase;color:var(--ink);margin:0 auto 12px;opacity:.9}
.lbl{font:700 calc(9.5px*var(--ss))/1.5 var(--fs);font-style:var(--sts);letter-spacing:.34em;text-transform:uppercase;color:var(--acc);margin:6px 0 0}
.nm{margin:0;font:400 calc(clamp(40px,12.5vw,64px)*var(--sn))/1.1 var(--fn);font-style:var(--stn);color:var(--ink);overflow-wrap:normal;word-break:normal;max-height:2.3em;padding:.04em .05em;background:linear-gradient(105deg,var(--ink) 0%,var(--ink) 38%,${t.dark?'#fff3cc':'var(--acc)'} 50%,var(--ink) 62%,var(--ink) 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:iv-foil 7s ease-in-out infinite alternate}
.par{font:400 calc(clamp(14.5px,3.9vw,17px)*var(--sl))/1.5 var(--fl);font-style:var(--stl);color:var(--txt);margin:3px 0 0}
.amp{font:400 calc(clamp(26px,7.5vw,36px)*var(--sn))/1 var(--fn);font-style:var(--stn);color:var(--acc);margin:6px 0;display:flex;align-items:center;justify-content:center;gap:12px}
.amp:before,.amp:after{content:'';width:min(14vw,60px);height:1px;background:linear-gradient(90deg,transparent,var(--acc))}.amp:after{transform:scaleX(-1)}
.msg{font:400 calc(clamp(15.5px,4.2vw,18px)*var(--sl))/1.75 var(--fl);font-style:var(--stl);color:var(--txt);margin:16px auto 0;white-space:pre-wrap;overflow-wrap:anywhere}
.scr{margin-top:22px;font:700 calc(9.5px*var(--ss))/1 var(--fs);letter-spacing:.4em;text-transform:uppercase;color:var(--acc);display:flex;flex-direction:column;align-items:center;gap:8px}
.scr:after{content:'';width:1px;height:34px;background:linear-gradient(var(--acc),transparent);animation:iv-scroll 2.2s ease-in-out infinite}
.panel{position:relative;padding:30px 12px 28px;border:0;background:none;box-shadow:none}

.kick{font:700 calc(10.5px*var(--ss))/1.5 var(--fs);font-style:var(--sts);letter-spacing:.36em;text-transform:uppercase;color:var(--acc);margin:0 0 6px}
.ttl{font:400 calc(clamp(26px,7vw,34px)*var(--sh))/1.2 var(--fh);font-style:var(--sth);color:var(--ink);margin:8px 0 4px;overflow-wrap:anywhere}
.divider{display:flex;align-items:center;justify-content:center;gap:10px;margin:12px auto 22px;width:min(54vw,210px)}
.divider:before,.divider:after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--acc))}.divider:after{transform:scaleX(-1)}
.divider i{width:6px;height:6px;transform:rotate(45deg);background:var(--acc)}
/* ---------- calendar plate ---------- */
.cal{position:relative;width:min(100%,400px);margin:calc(var(--pk,120px)*.5 + 20px) auto 0;padding:calc(var(--pk,120px)*.62) 18px 76px;background:linear-gradient(180deg,#f3efe8,#ece6dd);border-radius:10px;border:1px solid #d6c7a3;box-shadow:0 22px 46px rgba(40,20,10,${t.dark?.6:.22}),inset 0 0 0 7px #f3efe8,inset 0 0 0 8px #d8c392,inset 0 0 0 11px #f3efe8,inset 0 0 0 12px #e4d5ae}
.cal .peony{position:absolute;left:-1%;top:calc(var(--pk,120px)*-.5);width:102%;height:auto;pointer-events:none;filter:var(--cf,none);opacity:0;transform:translateY(8px) scale(.97);transition:opacity 1.2s ease .1s,transform 1.4s cubic-bezier(.2,.7,.2,1) .1s}
.cal.in .peony{opacity:1;transform:none}
.cal .swans{position:absolute;left:50%;bottom:6px;width:72%;transform:translateX(-50%);height:auto;pointer-events:none;filter:var(--cf,none);opacity:0;transition:opacity 1.4s ease 1.6s}
.cal.in .swans{opacity:1}
.cal-m{font:600 calc(clamp(19px,5.4vw,24px)*var(--sh))/1.2 var(--fh);font-style:var(--sth);letter-spacing:.2em;color:var(--heart);margin:0 0 8px;opacity:0;letter-spacing:.5em;transition:opacity 1.1s ease .5s,letter-spacing 1.6s cubic-bezier(.2,.7,.2,1) .5s;position:relative}
.cal-m small{font-size:.8em;letter-spacing:.14em;opacity:.9}
.cal.in .cal-m{opacity:1;letter-spacing:.2em}
.cal-w,.cal-g{display:grid;grid-template-columns:repeat(7,1fr);justify-items:center;position:relative}
.cal-w{border-bottom:1px solid #d9c590;padding-bottom:4px;margin-bottom:6px}
.cal-w i{font:700 calc(11px*var(--ss))/1.6 var(--fs);font-style:normal;letter-spacing:.1em;color:var(--acc)}
.cal-g b{position:relative;width:100%;max-width:46px;aspect-ratio:1;display:flex;align-items:center;justify-content:center;font:500 calc(clamp(17px,4.9vw,21px)*var(--sh))/1 var(--fh);font-style:normal;color:var(--heart);font-variant-numeric:oldstyle-nums;opacity:0}
.cal-g b span{position:relative;z-index:2}
.cal.in .cal-g b{animation:iv-dy .7s ease both;animation-delay:calc(var(--i)*24ms + .8s)}
.dy.h span{color:#fff7ea}
.dy .hrt,.dy .rng{position:absolute;inset:-7%;width:114%;height:114%;z-index:1;overflow:visible}
.dy .hrt{filter:drop-shadow(0 5px 6px rgba(80,10,30,.38));transform:scale(0)}
.cal.in .dy.h .hrt{animation:iv-pop 1s cubic-bezier(.2,1.5,.4,1) 2.1s forwards,iv-beat 1.8s ease-in-out 3.3s infinite}
.dy .rng circle{fill:none;stroke:var(--acc);stroke-width:1.5;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;transform:rotate(-90deg);transform-origin:50% 50%}
.dy .rng .gl{stroke:var(--acc2);stroke-width:2.6;opacity:0;filter:blur(1.4px)}
.cal.in .dy.r .rng circle{animation:iv-draw 1.5s ease 2.5s forwards}
.cal.in .dy.r .rng .gl{animation:iv-draw 1.5s ease 2.5s forwards,iv-glow 2.6s ease-in-out 4s infinite}
.dy.r:before{content:'';position:absolute;inset:6%;border-radius:50%;z-index:0;opacity:0}
.cal.in .dy.r:before{animation:iv-ripple 2.8s ease-out 4s infinite;border:1px solid var(--acc)}
.mh{position:absolute;width:14px;height:13px;z-index:3;pointer-events:none;opacity:0;animation:iv-rise 2.6s ease-out forwards}
.cal-cap{font:400 calc(clamp(17px,4.8vw,21px)*var(--sl))/1.4 var(--fl);font-style:italic;color:var(--heart);margin:18px 0 0;position:relative;opacity:0;transition:opacity 1.2s ease 3s}
.cal-note{font:700 calc(10.5px*var(--ss))/1.5 var(--fs);font-style:normal;letter-spacing:.18em;text-transform:uppercase;color:var(--acc);margin:6px 0 0;position:relative;opacity:0;transition:opacity 1.2s ease 3.3s}
.cal.in .cal-cap,.cal.in .cal-note{opacity:1}
.cd{display:flex;justify-content:center;gap:8px;margin-top:26px}
.cd div{min-width:58px;padding:9px 4px 7px;border:1px solid var(--acc);border-radius:8px;background:var(--pan)}
.cd b{display:block;font:500 calc(26px*var(--sh))/1.1 var(--fh);color:var(--ink)}
.cd small{font:700 calc(8.5px*var(--ss))/1.4 var(--fs);letter-spacing:.22em;color:var(--acc);text-transform:uppercase}
/* photos / schedule / events / closing */
.slider{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px calc(50% - min(34vw,150px)) 18px;margin:0 calc(50% - 50vw);scrollbar-width:none;-webkit-overflow-scrolling:touch}
.slider::-webkit-scrollbar{display:none}
.slide{flex:0 0 min(68vw,300px);aspect-ratio:3/4;scroll-snap-align:center;border-radius:200px 200px 16px 16px;overflow:hidden;border:2px solid var(--acc);box-shadow:0 14px 34px rgba(60,30,20,.3),0 0 0 5px var(--pan),0 0 0 6px var(--acc);background:#ddd;cursor:zoom-in}
.slide img{width:100%;height:100%;object-fit:cover;display:block}
.dots{display:flex;justify-content:center;gap:8px;margin-top:4px}
.dots b{width:7px;height:7px;border-radius:50%;border:1px solid var(--acc);transition:all .3s}.dots b.on{background:var(--acc);width:20px;border-radius:5px}
.lightbox{position:fixed;inset:0;z-index:140;background:#000e;display:none;align-items:center;justify-content:center;padding:18px;cursor:zoom-out}.lightbox.on{display:flex}.lightbox img{max-width:100%;max-height:100%;border-radius:10px}
.tl{position:relative;margin:4px auto 0;text-align:left}
.tl:before{content:'';position:absolute;left:86px;top:8px;bottom:8px;width:1px;background:linear-gradient(transparent,var(--acc) 10%,var(--acc) 90%,transparent)}
.tl-row{display:grid;grid-template-columns:70px 1fr;gap:28px;padding:10px 0;position:relative}
.tl-row:before{content:'';position:absolute;left:82px;top:19px;width:9px;height:9px;border-radius:50%;background:var(--heart);box-shadow:0 0 0 3px var(--pan),0 0 0 4px var(--acc)}
.tl-t{font:700 calc(11px*var(--ss))/1.5 var(--fs);letter-spacing:.1em;color:var(--acc);text-align:right;padding-top:3px;text-transform:uppercase}
.tl-n{font:400 calc(clamp(18px,4.8vw,22px)*var(--sh))/1.25 var(--fh);color:var(--ink);margin:0;overflow-wrap:anywhere}
.tl-d{font:400 calc(14.5px*var(--sl))/1.5 var(--fl);font-style:var(--stl);margin:2px 0 0;overflow-wrap:anywhere}
.cards{display:grid;gap:14px;margin:4px auto 0}
.ecard{position:relative;padding:18px 0 16px;border:0;background:none;border-bottom:1px solid rgba(120,90,50,.25)}
.ecard h3{font:400 calc(clamp(21px,5.6vw,26px)*var(--sh))/1.25 var(--fh);font-style:var(--sth);color:var(--ink);margin:0 0 4px;overflow-wrap:anywhere}
.ecard .ed{font:700 calc(10.5px*var(--ss))/1.7 var(--fs);letter-spacing:.18em;color:var(--acc);text-transform:uppercase}
.ecard .ep{font:400 calc(16px*var(--sl))/1.5 var(--fl);font-style:var(--stl);margin:6px 0 14px;overflow-wrap:anywhere;white-space:pre-line}
.mapbtn{display:inline-block;padding:12px 22px;border:1px solid var(--acc);color:var(--ink);text-decoration:none;font:700 calc(10px*var(--ss))/1.3 var(--fs);letter-spacing:.22em;text-transform:uppercase;border-radius:3px;transition:background .3s,color .3s,transform .3s}
.mapbtn:hover,.mapbtn:focus-visible{background:var(--acc);color:${t.dark?'#1b1308':'#fff'};transform:translateY(-2px)}
.fam{white-space:pre-wrap;font:400 calc(17px*var(--sl))/1.8 var(--fl);font-style:var(--stl);margin:0 auto 18px;overflow-wrap:anywhere}
.close{font:400 calc(clamp(19px,5.2vw,24px)*var(--sl))/1.6 var(--fl);font-style:var(--stl);color:var(--ink);margin:0 auto 4px;white-space:pre-wrap;overflow-wrap:anywhere}
.sign{font:400 calc(clamp(36px,10vw,50px)*var(--sn))/1.2 var(--fn);font-style:var(--stn);margin:12px 0 4px;overflow-wrap:anywhere;color:var(--ink)}
.small{font:700 calc(9.5px*var(--ss))/1.5 var(--fs);letter-spacing:.24em;color:var(--acc);text-transform:uppercase}
.rsvp{display:inline-block;margin:4px 0 18px;padding:13px 30px;border-radius:40px;border:1px solid var(--acc);background:linear-gradient(135deg,var(--heart2),var(--heart));color:#fff7ea;text-decoration:none;font:700 calc(10.5px*var(--ss))/1.3 var(--fs);letter-spacing:.3em;box-shadow:0 8px 22px rgba(60,20,30,.35)}
.credit{position:relative;z-index:3;padding:16px;text-align:center;background:var(--fill);color:var(--acc);font:10px Arial,sans-serif;letter-spacing:2px}
.mbtn{position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:120;width:44px;height:44px;border-radius:50%;border:1px solid var(--acc);background:var(--pan);color:var(--ink);font-size:18px;cursor:pointer;box-shadow:0 6px 16px rgba(0,0,0,.25);display:none}.mbtn.on{display:block}
.iv-js .rv{opacity:0;transform:translateY(28px);filter:blur(6px);transition:opacity 1.1s ease var(--d,0s),transform 1.1s cubic-bezier(.2,.7,.2,1) var(--d,0s),filter 1.1s ease var(--d,0s)}
.iv-js .rv.in{opacity:1;transform:none;filter:none}
.iv-prev [data-rs]{cursor:pointer}.iv-prev [data-rs]:hover{outline:1px dashed var(--acc);outline-offset:3px}
@keyframes iv-flick{0%{opacity:.55;transform:translate(-50%,-50%) scale(.9)}50%{opacity:.95}100%{opacity:.7;transform:translate(-50%,-50%) scale(1.12)}}
@keyframes iv-sweep{0%,20%{transform:translateX(-80%)}70%,100%{transform:translateX(80%)}}
@keyframes iv-foil{0%{background-position:0% 0}100%{background-position:100% 0}}
@keyframes iv-fall{0%{transform:translate3d(0,0,0) rotate(0);opacity:0}8%{opacity:.9}100%{transform:translate3d(var(--x),112vh,0) rotate(var(--r));opacity:.85}}
@keyframes iv-breathe{0%{transform:translateX(-50%) scale(1)}100%{transform:translateX(-50%) scale(1.018)}}
@keyframes iv-ft{to{transform:rotateX(-118deg);opacity:0}}
@keyframes iv-fb{to{transform:rotateX(118deg);opacity:0}}
@keyframes iv-fl{to{transform:rotateY(118deg);opacity:0}}
@keyframes iv-fr{to{transform:rotateY(-118deg);opacity:0}}
@keyframes iv-seal{0%{box-shadow:0 0 0 0 rgba(255,236,170,.75)}100%{box-shadow:0 0 0 38px rgba(255,236,170,0)}}
@keyframes iv-flash{0%{transform:translate(-50%,-50%) scale(0);opacity:1}100%{transform:translate(-50%,-50%) scale(9);opacity:0}}
@keyframes iv-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes iv-up{from{opacity:0;transform:translateY(24px);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
@keyframes iv-scroll{0%,100%{transform:scaleY(.4);transform-origin:top;opacity:.4}50%{transform:scaleY(1);opacity:1}}
@keyframes iv-dy{from{opacity:0;transform:translateY(8px) scale(.8)}to{opacity:1;transform:none}}
@keyframes iv-pop{0%{transform:scale(0) rotate(-12deg)}60%{transform:scale(1.25) rotate(4deg)}100%{transform:scale(1) rotate(0)}}
@keyframes iv-beat{0%,100%{transform:scale(1)}14%{transform:scale(1.14)}28%{transform:scale(1)}42%{transform:scale(1.09)}}
@keyframes iv-draw{to{stroke-dashoffset:0}}
@keyframes iv-glow{0%,100%{opacity:0}50%{opacity:.8}}
@keyframes iv-ripple{0%{transform:scale(.9);opacity:.7}100%{transform:scale(1.9);opacity:0}}
@keyframes iv-rise{0%{opacity:0;transform:translate(0,0) scale(.5)}15%{opacity:.9}100%{opacity:0;transform:translate(var(--dx),-70px) scale(1.1) rotate(var(--r))}}
@media(max-width:380px){.tl:before{left:78px}.tl-row{grid-template-columns:62px 1fr;gap:26px}.tl-row:before{left:74px}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}.iv-js .rv{opacity:1;transform:none;filter:none}.cal .dy b,.cal-g b,.cal .peony,.cal .swans,.cal-m,.cal-cap,.cal-note{opacity:1!important}.dy .hrt{transform:none}.dy .rng circle{stroke-dashoffset:0}}
${m.cfg.align==='left'?':root{--al:left;--jc:flex-start;--mL:8vw;--mR:auto}':m.cfg.align==='right'?':root{--al:right;--jc:flex-end;--mL:auto;--mR:8vw}':':root{--al:center;--jc:center;--mL:auto;--mR:auto}'}.sec{justify-content:var(--jc)!important}.sec .inner,.sec .wide{margin-left:var(--mL)!important;margin-right:var(--mR)!important;text-align:var(--al)!important}
${m.customCSS}`};

/* ------------------------------------------------------------------ markup */
function sceneLayer(key,k,t,m,hero){
 const veil=t.dark?'rgba(10,8,6,.18)':(k==='env'?'rgba(255,250,240,.28)':'transparent');
 const flames=hero&&k==='arch'?`<div class="fx">${FLAMES.map(([x,y,s],i)=>`<i class="flame" style="left:${x}%;top:${y}%;--s:${s};--d:${(i*.37).toFixed(2)}s"></i>`).join('')}<i class="sweep"></i></div>`:'<div class="fx"><i class="sweep"></i></div>';
 const bism=hero&&m.bismImg?`<i class="bism" style="${k==='sage'?'left:38%;top:4.5%;width:24%':''}"></i>`:'';
 return `<div class="bgl${hero?' on':''}" data-k="${key}" style="--veil:${veil}"><div class="scene"><div class="img" style="background-image:url('${(m.bgOver&&m.bgOver[key])||(A+SCENES[k])}')"></div>${flames}${bism}</div><i class="veil"></i></div>`;
}
function petals(t){
 const cols=t.dark?['#f3dc9b']:['#f6d9d6','#fff','#f3e6cf','#e9d6d0'];
 return `<div class="petals" aria-hidden="true">${Array.from({length:11},(_,i)=>`<i style="left:${(i*9.3+R.h.rnd(i,0,5)).toFixed(1)}%;--w:${(7+R.h.rnd(i+3,0,8)).toFixed(1)}px;--t:${(11+R.h.rnd(i+5,0,9)).toFixed(1)}s;--d:${(R.h.rnd(i+9,0,12)).toFixed(1)}s;--x:${(R.h.rnd(i+2,-60,60)).toFixed(0)}px;--r:${(R.h.rnd(i+7,120,420)).toFixed(0)}deg;--pc:${cols[i%cols.length]}"></i>`).join('')}</div>`;
}
/* each page carries its own background: it scrolls with the page's content */
function secLayers(html,LY){return html.replace(/(<section[^>]*?data-bg="(\w+)"[^>]*>)/g,(m0,tag,k)=>LY[k]?`${tag}<div class="sbgx">${LY[k]}</div>`:tag)}
function body(m,t,cal){
 const w=m.w;
  const verseBlock=(m.verseAr||m.verseEn)?`<div class="hv" style="--d:1.7s">${m.verseAr?`<p class="ar-verse" lang="ar" dir="rtl">${esc(m.verseAr)}</p>`:''}${m.verseEn?`<p class="ar-en">${esc(m.verseEn)}</p>`:''}</div>`:'';
 const duaBlock=(m.blAr||m.blEn)?`<div class="rv">${m.blAr?`<p class="ar-dua" lang="ar" dir="rtl">${esc(m.blAr)}</p>`:''}${m.blEn?`<p class="ar-en">“${esc(m.blEn)}”</p>`:''}</div>`:'';

 const prevChip=(m.prev&&m.openLogo&&!m.gate)?`<div class="om lift corner" style="animation:none"><img src="${esc(m.openLogo)}" alt=""></div>`:'';
 const l1=m.p1&&/^\s*d\s*\/\s*o\b/i.test(m.p1)?'':`<p class="lbl hv" data-rs="rsLabel1" style="--d:.55s">${esc(m.l1)}</p>`;
 const l2=m.p2&&/^\s*s\s*\/\s*o\b/i.test(m.p2)?'':`<p class="lbl hv" data-rs="rsLabel2" style="--d:1.1s">${esc(m.l2)}</p>`;
 const hero=`<section class="sec hero" id="top" data-bg="hero"><div class="inner">
 ${m.bismText?ed('rsBismillah','p','intro hv',esc(m.bismText),' style="--d:.1s" lang="ar" dir="rtl"'):''}
 ${ed('rsIntro','p','intro hv',esc(m.intro),' style="--d:.25s"')}
 ${l1}${ed('name1','h1','nm hv fit',esc(m.n1),' style="--d:.7s"')}
 ${m.p1?ed('parents1','p','par hv',esc(m.p1),' style="--d:.85s"'):''}
 <div class="amp hv" style="--d:1s">&amp;</div>
 ${l2}${ed('name2','h1','nm hv fit',esc(m.n2),' style="--d:1.25s"')}
 ${m.p2?ed('parents2','p','par hv',esc(m.p2),' style="--d:1.4s"'):''}
 ${m.message?ed('message','p','msg hv',esc(m.message),' style="--d:1.6s"'):''}
 ${verseBlock}${ed('rsScroll','div','scr hv',esc(m.scroll),' style="--d:1.85s"')}
 </div></section>`;
 const dateSec=`<section class="sec" id="date" data-bg="date"><div class="inner wide">
 ${ed('rsDateKicker','p','kick rv',esc(m.dateKick))}${ed('rsDateTitle','h2','ttl rv',esc(m.dateTitle),' style="--d:.1s"')}
 <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="ivh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--heart2)"/><stop offset="1" stop-color="var(--heart)"/></linearGradient><symbol id="ivhp" viewBox="0 0 48 44"><path d="M24 42S3 28.6 3 15.4C3 8.4 8.6 3.6 15 3.6c3.9 0 7.3 2 9 5.2 1.7-3.2 5.1-5.2 9-5.2 6.4 0 12 4.8 12 11.8C45 28.6 24 42 24 42z" fill="var(--heart2)"/></symbol></defs></svg>
 <div class="cal" id="iv-cal"><img class="peony" src="${A}peony.png" alt="" loading="eager" decoding="async" onload="this.parentNode.style.setProperty('--pk',this.height+'px')"><div data-cal="grid">${calendarHtml(cal,m)}</div><img class="swans" src="${A}swans.png" alt="" loading="eager" decoding="async"></div>
 ${m.dateIso?`<div class="cd rv" id="iv-cd"><div><b id="cd-d">0</b><small>Days</small></div><div><b id="cd-h">0</b><small>Hours</small></div><div><b id="cd-m">0</b><small>Min</small></div><div><b id="cd-s">0</b><small>Sec</small></div></div>`:''}
 ${w&&m.timeText?`<p class="small rv" style="margin-top:14px">${esc(m.timeText)}</p>`:''}
 </div></section>`;
 const slides=m.photos.map((src,i)=>`<div class="slide" data-i="${i}"><img src="${esc(src)}" alt="Wedding photo ${i+1}" loading="lazy"></div>`).join('');
 const story=m.photos.length?`<section class="sec" id="story" data-bg="story"><div style="width:100%"><div class="inner">${ed('rsStoryKicker','p','kick rv',esc(m.storyKick))}${ed('rsStoryTitle','h2','ttl rv',esc(m.storyTitle),' style="--d:.1s"')}<div class="divider rv"><i></i></div></div><div class="slider rv" id="iv-slider" style="--d:.15s">${slides}</div>${m.photos.length>1?`<div class="dots">${m.photos.map((_,i)=>`<b${i?'':' class="on"'}></b>`).join('')}</div>`:''}</div></section>`:'';
 const tl=m.schedule.length?`<section class="sec" id="day" data-bg="day"><div class="inner wide panel">${ed('rsDayKicker','p','kick rv',esc(m.dayKick))}${ed('rsDayTitle','h2','ttl rv',esc(m.dayTitle),' style="--d:.1s"')}<div class="divider rv"><i></i></div><div class="tl" data-rs="schedule">${m.schedule.map((s,i)=>`<div class="tl-row rv" style="--d:${(i*.1).toFixed(1)}s"><div class="tl-t">${esc(s.time||'')}</div><div><p class="tl-n">${esc(s.title).replace(/\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\b)/i,'<br>$1')}</p>${s.detail?`<p class="tl-d">${esc(s.detail)}</p>`:''}</div></div>`).join('')}</div></div></section>`:'';
 const cards=m.events.length?`<section class="sec" id="events" data-bg="events"><div class="inner wide panel">${ed('rsEventsTitle','h2','ttl rv',esc(m.evTitle))}<div class="divider rv"><i></i></div><div class="cards" data-rs="eventsText">${m.events.map((e,i)=>`<article class="ecard rv" style="--d:${(i*.12).toFixed(2)}s"><h3>${esc(e.title)}</h3>${e.date?`<div class="ed">${esc(e.date)}</div>`:''}${e.place?`<p class="ep">${esc(e.place)}</p>`:''}${e.map?`<a class="mapbtn" href="${esc(e.map)}" target="_blank" rel="noopener noreferrer">View on map</a>`:''}</article>`).join('')}</div></div></section>`:'';
 const end=`<section class="sec" id="with-love" data-bg="end"><div class="inner wide panel">
 ${duaBlock}${m.family?ed('family','p','fam rv',esc(m.family)):''}
 ${m.rsvp?`<a class="rsvp rv" href="${esc(m.rsvp)}" target="_blank" rel="noopener noreferrer">RSVP</a>`:''}
 ${ed('rsClosing','p','close rv',esc(m.closing),' style="--d:.1s"')}
 <div class="divider rv"><i></i></div>
 <p class="sign rv fit" data-rs="name1">${esc(m.n1)} &amp; ${esc(m.n2)}</p>
 ${m.from?ed('wishesFrom','p','small rv',esc(m.from)):''}
 </div></section>`;
 const omw=m.openLogo?`<div class="omw" aria-hidden="true"><i class="om"><img src="${esc(m.openLogo)}" alt=""></i></div>`:'';
 const gate=m.gate?`<div id="iv-gate" class="gate" role="dialog" aria-modal="true" aria-label="Open the invitation"><div class="envbox"><i class="flap b"></i><i class="flap l"></i><i class="flap r"></i><i class="flap t"></i><i class="seal-ring"></i><i class="seal-flash"></i></div>${omw}<div class="g-ui"><span class="g-kick">You are invited</span><span class="g-tap" data-rs="rsOpen">${esc(m.open)}</span></div><button type="button" class="g-hit" id="iv-open" aria-label="Open the invitation"></button><button type="button" class="g-skip" id="iv-skip">Skip</button></div>`:'';
 const audio=m.music?`<audio id="iv-music" loop preload="none" src="${esc(m.music)}"></audio><button type="button" class="mbtn on" id="iv-mbtn" aria-label="Play or pause music">\u266A</button>`:'';
 const layers=`<div class="bgs" aria-hidden="true">${sceneLayer('hero',t.hero,t,m,true)}${sceneLayer('date',t.date,t,m)}${sceneLayer('story',t.story,t,m)}${sceneLayer('day',t.day,t,m)}${sceneLayer('events',t.events,t,m)}${sceneLayer('end',t.end,t,m)}${petals(t)}</div>`;
  const LY={hero:sceneLayer('hero',t.hero,t,m,true),date:sceneLayer('date',t.date,t,m),story:sceneLayer('story',t.story,t,m),day:sceneLayer('day',t.day,t,m),events:sceneLayer('events',t.events,t,m),end:sceneLayer('end',t.end,t,m)};
 return `<div style="position:fixed;inset:0;z-index:2;pointer-events:none">${petals(t)}</div><canvas id="iv-sp" aria-hidden="true"></canvas>${gate}${prevChip}<main>${secLayers(hero+dateSec+story+tl+cards+end,LY)}</main><div class="credit">Made with Mubiey Studio</div>${audio}`;
}

/* ------------------------------------------------------------------ browser runtime */
function runtime(){
 const Rt=window.IV||{},$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],B=document.body;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const setH=()=>{const h=innerHeight;document.documentElement.style.setProperty('--H',h+'px')};setH();addEventListener('resize',setH);
 const audio=$('#iv-music'),mb=$('#iv-mbtn'),play=()=>{audio&&audio.play().catch(()=>{})};
 if(mb)mb.onclick=()=>{audio.paused?play():audio.pause()};
 /* ---- sparkles (gold on light designs, additive on the dark one) ---- */
 const dark=!!Rt.dark;
 const star=(core,glow)=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');
  const rg=g.createRadialGradient(32,32,0,32,32,32);rg.addColorStop(0,'rgba('+glow+',.85)');rg.addColorStop(.22,'rgba('+glow+',.35)');rg.addColorStop(1,'rgba('+glow+',0)');g.fillStyle=rg;g.fillRect(0,0,64,64);
  g.fillStyle=core;g.beginPath();g.moveTo(32,2);g.quadraticCurveTo(34.5,29.5,62,32);g.quadraticCurveTo(34.5,34.5,32,62);g.quadraticCurveTo(29.5,34.5,2,32);g.quadraticCurveTo(29.5,29.5,32,2);g.fill();return c};
 const SPR=dark?[star('#fff4cf','255,226,150'),star('#ffffff','255,255,255')]:[star('#c99a3c','255,226,150'),star('#e8c872','255,240,190'),star('#ffffff','255,215,140')];
 const sp=(()=>{
  const cv=$('#iv-sp'),ctx=cv.getContext('2d');let W,H,dpr,amb=[],fx=[];
  const mk=()=>({x:Math.random()*W,y:Math.random()*H,s:4+Math.random()*10,ph:Math.random()*6.28,sp:.6+Math.random()*1.4,vy:-(2+Math.random()*7),k:Math.floor(Math.random()*SPR.length)});
  const size=()=>{dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr|0;cv.height=H*dpr|0;amb=Array.from({length:Math.max(24,Math.min(70,Math.round(W*H/13000)))*(Rt.prev?.55:1)|0},mk)};
  size();addEventListener('resize',size);let last=performance.now();
  const loop=now=>{const dt=Math.min(.05,(now-last)/1000);last=now;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation=dark?'lighter':'source-over';
   for(const a of amb){a.y+=a.vy*dt;if(a.y<-20){a.y=H+20;a.x=Math.random()*W}const t=Math.max(0,Math.sin(now/1000*a.sp+a.ph)),al=t*t*t;if(al<.02)continue;ctx.globalAlpha=al;const z=a.s*(.55+.45*t);ctx.drawImage(SPR[a.k],a.x-z,a.y-z,z*2,z*2)}
   for(let i=fx.length-1;i>=0;i--){const p=fx[i];p.life-=dt;if(p.life<=0){fx.splice(i,1);continue}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=30*dt;ctx.globalAlpha=Math.min(1,p.life/p.max*1.7);const z=p.s*(.5+.5*p.life/p.max);ctx.drawImage(SPR[p.k],p.x-z,p.y-z,z*2,z*2)}
   ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';requestAnimationFrame(loop)};
  if(!reduce)requestAnimationFrame(loop);
  return{burst(x,y,n,sp0){if(reduce)return;sp0=sp0||240;for(let i=0;i<n;i++){const a=Math.random()*6.283,v=30+Math.random()*sp0;fx.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-50,s:5+Math.random()*10,k:Math.floor(Math.random()*SPR.length),life:1+Math.random()*1.4,max:2.4})}}};
 })();
 /* ---- text safe-zone: shrink names that would not fit on one line, the rest wraps ---- */
 const fit=()=>$$('.fit').forEach(el=>{el.style.fontSize='';const cs=parseFloat(getComputedStyle(el).fontSize);const lh=parseFloat(getComputedStyle(el).lineHeight)||cs*1.1;let f=cs,n=0;while((el.scrollWidth>el.clientWidth+1||el.scrollHeight>lh*2+2)&&f>cs*.5&&n++<40){f*=.95;el.style.fontSize=f+'px'}});
 fit();addEventListener('resize',fit);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);setTimeout(fit,600);
 /* ---- opening ---- */
 const gate=$('#iv-gate');const ready=()=>{B.classList.add('iv-ready');fit()};
 if(!gate){ready()}
 else{
  B.classList.add('iv-locked');let opened=false,finished=false;const timers=[];const later=(f,ms)=>timers.push(setTimeout(f,ms));
  const done=()=>{if(finished)return;finished=true;timers.forEach(clearTimeout);gate.classList.add('gone');B.classList.remove('iv-locked');ready();scrollTo(0,0)};
  const go=()=>{if(opened)return;opened=true;if(Rt.autoplay)play();gate.classList.add('open');const om=$('.om');if(om){const r=om.getBoundingClientRect();document.body.append(om);om.classList.add('lift');om.style.left=r.left+'px';om.style.top=r.top+'px';om.style.width=r.width+'px';om.style.height=r.height+'px';om.style.transform='none';requestAnimationFrame(()=>requestAnimationFrame(()=>om.classList.add('corner')))}
   if(reduce){later(done,300);return}
   const x=innerWidth/2,y=innerHeight*.498;sp.burst(x,y,70,360);later(()=>sp.burst(x,y,40,260),450);
   later(()=>{B.classList.add('iv-ready')},900);later(done,2300)};
  $('#iv-open').onclick=go;$('#iv-skip').onclick=done;
 }
 /* ---- section backgrounds follow the scroll ---- */
 const secs=$$('[data-bg]'),bgs=$$('.bgl');let cur='hero',tick=false;
 const onScroll=()=>{tick=false;const mid=innerHeight*.5;let key=cur;for(const s of secs){const r=s.getBoundingClientRect();if(r.top<=mid&&r.bottom>mid){key=s.dataset.bg;break}}
  if(key!==cur){cur=key;bgs.forEach(b=>b.classList.toggle('on',b.dataset.k===key));sp.burst(innerWidth*.5,innerHeight*.5,26,260)}};
 addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
 /* ---- reveal on scroll + calendar ---- */
 const cal=$('#iv-cal'),rv=$$('.rv');
 const calIn=()=>{cal.classList.add('in');const heart=cal.querySelector('.dy.h');
  const hearts=()=>{if(!heart||reduce||document.hidden)return;const r=heart.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const c=cal.getBoundingClientRect();
   for(let i=0;i<3;i++){const h=document.createElement('i');h.className='mh';h.innerHTML='<svg viewBox="0 0 48 44"><use href="#ivhp"/></svg>';h.style.cssText='left:calc(50% - 7px + '+((Math.random()-.5)*18)+'px);top:10%;--dx:'+((Math.random()-.5)*50)+'px;--r:'+((Math.random()-.5)*50)+'deg;animation-delay:'+i*.35+'s';heart.append(h);setTimeout(()=>h.remove(),3600)}
   sp.burst(r.left+r.width/2,r.top+r.height/2,10,120)};
  setTimeout(()=>{if(!reduce)sp.burst(innerWidth/2,innerHeight*.55,26,300)},2200);setTimeout(()=>{hearts();setInterval(hearts,3800)},3400)};
 if('IntersectionObserver' in window&&!Rt.prev){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){if(e.target===cal)calIn();else e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.18,rootMargin:'0px 0px -6% 0px'});rv.forEach(n=>io.observe(n));if(cal)io.observe(cal)}
 else{rv.forEach(n=>n.classList.add('in'));if(cal)calIn()}
 /* ---- countdown ---- */
 if($('#iv-cd')&&Rt.dateIso){const t=Date.parse(Rt.dateIso),set=(id,v)=>{const e=$('#'+id);if(e)e.textContent=v};const tk=()=>{const s=Math.max(0,Math.floor((t-Date.now())/1000));set('cd-d',Math.floor(s/86400));set('cd-h',Math.floor(s%86400/3600));set('cd-m',Math.floor(s%3600/60));set('cd-s',s%60)};tk();setInterval(tk,1000)}
 /* ---- photos ---- */
 const sl=$('#iv-slider');
 if(sl){const slides=$$('.slide'),dots=$$('.dots b'),lb=document.createElement('div');lb.className='lightbox';lb.innerHTML='<img alt="">';document.body.append(lb);lb.onclick=()=>lb.classList.remove('on');
  const step=()=>slides.length>1?slides[1].offsetLeft-slides[0].offsetLeft:sl.clientWidth,idx=()=>Math.min(slides.length-1,Math.max(0,Math.round(sl.scrollLeft/step())));
  sl.addEventListener('scroll',()=>{const i=idx();dots.forEach((d,k)=>d.classList.toggle('on',k===i))},{passive:true});
  slides.forEach((s,i)=>s.addEventListener('click',()=>{if(Rt.prev){parent.postMessage({type:'mubiey-direct-photo',index:i},'*');return}lb.firstChild.src=s.querySelector('img').src;lb.classList.add('on')}));
  if(slides.length>1&&!reduce&&!Rt.prev){let hold=false,vis=false;['pointerdown','touchstart','wheel'].forEach(t=>sl.addEventListener(t,()=>{hold=true;setTimeout(()=>hold=false,9000)},{passive:true}));
   if('IntersectionObserver' in window)new IntersectionObserver(es=>vis=es[0].isIntersecting,{threshold:.5}).observe(sl);
   setInterval(()=>{if(hold||!vis)return;sl.scrollTo({left:((idx()+1)%slides.length)*step(),behavior:'smooth'})},4600)}}
 /* ---- editor preview: tap text to edit, tap the calendar to open its settings ---- */
 if(Rt.prev){B.classList.add('iv-prev');$$('[data-rs]').forEach(n=>n.addEventListener('click',e=>{e.preventDefault();parent.postMessage({type:'mubiey-rs-edit',field:n.dataset.rs},'*')}));
  if(cal)cal.addEventListener('click',()=>parent.postMessage({type:'mubiey-iv-cal'},'*'))}
}

/* ------------------------------------------------------------------ document */
function render(d){
 const t=THEMES[d.template],m=R.model(d),cal=readCal(d);
 const muslim=!['Hindu','Christian'].includes(d.tradition),custom=str(d.rsBismillah,200);
 m.bismImg=muslim&&!custom;m.bismText=custom;
 m.bgOver=pageBg(d);
 m.verseAr=str(d.verseArabic,300);m.verseEn=str(d.verse,300);m.blAr=str(d.blessingArabic,400);m.blEn=str(d.blessing,400);
 
 m.dateKick=str(d.rsDateKicker,60)||'Save the date';m.dateTitle=str(d.rsDateTitle,60)||'Mark the date';
 const rt={prev:m.prev,autoplay:m.autoplay,dateIso:m.dateIso,dark:t.dark};
 const cls=['iv-js',m.gate?'iv-locked':'',m.prev?'iv-prev':''].filter(Boolean).join(' ');
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>${esc(m.n1)} &amp; ${esc(m.n2)} \u2014 Wedding invitation</title><script>document.documentElement.classList.add('iv-js')<\/script><style>${fontCSS(R.needFonts(m))}${CSS(m,t)}${m.cfg.gold?`:root{--acc:${m.cfg.gold};--acc2:${m.cfg.gold}}`:''}:root{--olsz:${m.cfg.olSize||100}}</style><noscript><style>.gate{display:none}body.iv-locked{overflow:auto}.rv,.hv{opacity:1!important;transform:none!important;filter:none!important}</style></noscript></head><body class="${cls}">${body(m,t,cal)}<script>window.IV=${json(rt)};<\/script><script>(${runtime.toString().replace(/<\/script/gi,'<\\/script')})();<\/script></body></html>`;
}
window.MubieyIvory={ids:Object.keys(THEMES),themes:THEMES,readCal};
invitationDocument=function(data){return data&&THEMES[data.template]?render(data):baseDocument.apply(this,arguments)};
})();
