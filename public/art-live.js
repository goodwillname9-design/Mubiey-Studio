/* Mubiey Studio · art-based live invitations 2000-2004 (the customer's own textless artwork + animation).
   2000 Garnet Glitter Arch  – arch opens like a window, crystal chandelier lowers and swings, glitter falls
   2001 Blush Wisteria       – arch opens with a petal shower, wisteria sways, ring sparkles, petals drift
   2002 Temple Marigold      – bell rings: a golden flash opens the card, marigold garlands sway, petals fall
   2003 Mandap Muhurat       – tap to light the lamp: light spreads from the diyas, bells swing, Ganesha glows
   2004 Temple Lotus         – the card blooms out of a golden mist, hanging flowers sway, lamp flames flicker
   Each is a full live invitation: names page on the artwork, scratch-to-reveal date + countdown, photo slider,
   schedule, event cards with map buttons, RSVP, music, and the shared "Your invitation card" section.
   Every text is editable from the "Royal Stage · your wording" panel and by tapping it in the editor preview.
   It builds on royal-stage.js (window.MubieyRS), so load it right after that script. */
'use strict';
(()=>{
const K=window.MubieyRS;
if(!K||typeof invitationDocument!=='function')return;
const base=invitationDocument,esc=K.esc,rnd=K.rnd,ed=K.ed;
const ASSET=(typeof location!=='undefined'&&/^https?:$/.test(location.protocol)?location.origin:'')+'/assets/live/';
const str=(v,n)=>typeof v==='string'?v.trim().slice(0,n||300):'';

/* coordinates are pixels of the original artwork (w x h); hero = where the names sit (% of artwork height, width in cqw) */
const T={
 '2000':{name:'Garnet Glitter Arch',img:'2000-bg.jpg',w:1152,h:2048,open:'arch',bism:true,
  tone:{ink:'#6e1124',body:'#4a2a26',acc:'#a87a35',paper:'#f4ead9',paper2:'#ecdcc4',gbg:'#240a10',g1:'#5b1424',txt:'#6e1124',foil:['#8d6a24','#ecd392','#b98d3a','#f6e0a6','#9a742c'],plate:['#8d1a2e','#4a0a16']},
  hero:{top:41.2,h:29.5,w:60},
  sprites:[{f:'2000-chand.png',b:[494,138,700,795],o:'50% 0%',amp:2.4,dur:6.4,drop:1}],
  glows:[{x:595,y:520,r:340,c:'255,226,150',a:.5,p:3.8}],
  sparks:[[40,60,430,520,9],[720,40,1110,480,9],[10,1470,430,1990,9],[180,1690,470,2000,6]],
  part:{t:'glitter',n:20},
  intro:'With the blessings of Allah and our families, you are warmly invited to the Nikah of',closing:'Your presence and duas will make our day complete.'},
 '2001':{name:'Blush Wisteria',img:'2001.jpg',w:1024,h:1536,open:'petal',bism:true,
  tone:{ink:'#9a3f5a',body:'#5a3a40',acc:'#b98a52',paper:'#fbf1ec',paper2:'#f5e3dd',gbg:'#4a1e2c',g1:'#8a3b52',txt:'#8a3550',foil:['#b98a52','#f3dca8','#c99d63','#f9e7bd','#b98a52'],plate:['#c25f7b','#8a3550']},
  hero:{top:22.5,h:37,w:54},
  sways:[{b:[0,0,260,980],amp:1.2,dur:6.2},{b:[764,0,1024,980],amp:1.2,dur:7.1,dl:-2.4}],
  glows:[{x:493,y:1196,r:90,c:'255,240,200',a:.8,p:2.4}],
  sparks:[[300,1060,730,1260,10],[30,1050,330,1500,6],[700,1050,1000,1500,6],[200,200,820,860,5]],
  part:{t:'blush',n:16},
  intro:'Together with our families, we joyfully invite you to celebrate the wedding of',closing:'Your presence will make our day complete.'},
 '2002':{name:'Temple Marigold',img:'2002.jpg',w:735,h:1041,open:'bell',bism:false,
  tone:{ink:'#8a2c1c',body:'#553023',acc:'#b0802f',paper:'#f8ecd6',paper2:'#f0dfbb',gbg:'#3e2410',g1:'#7a4a1c',txt:'#80281a',foil:['#a07424','#ecd08c','#b4872f','#f4dc9e','#94692a'],plate:['#a33a22','#5e1a0e']},
  hero:{top:27.5,h:39,w:56},
  sways:[{b:[0,0,135,700],amp:.9,dur:5.4},{b:[600,0,735,700],amp:.9,dur:6.3,dl:-1.9}],
  glows:[{x:165,y:795,r:70,c:'255,214,130',a:.45,p:3},{x:580,y:795,r:70,c:'255,214,130',a:.45,p:3.4}],
  sparks:[[40,560,330,760,6],[420,560,700,760,6],[130,90,610,330,8]],
  part:{t:'marigold',n:18},
  intro:'With the divine blessings of our families, we joyfully invite you to celebrate the wedding of',closing:'Your presence and blessings will make our day complete.'},
 '2003':{name:'Mandap Muhurat',img:'2003-bg.jpg',w:735,h:1041,open:'diya',bism:false,
  tone:{ink:'#7a1426',body:'#4d2f22',acc:'#b8862f',paper:'#f8eed6',paper2:'#f0dfb8',gbg:'#2a1408',g1:'#6a3510',txt:'#74122a',foil:['#a07424','#ecd08c','#b4872f','#f4dc9e','#94692a'],plate:['#9c1f35','#561021']},
  hero:{top:15,h:46,w:64},
  sprites:[{f:'2003-bl1.png',b:[33,126,80,226],o:'50% 0%',amp:5.5,dur:3.4},{f:'2003-bl2.png',b:[2,126,50,288],o:'50% 0%',amp:3.2,dur:4.2,dl:-1.1},{f:'2003-br1.png',b:[650,126,700,226],o:'50% 0%',amp:5.5,dur:3.7,dl:-.6},{f:'2003-br2.png',b:[684,126,735,288],o:'50% 0%',amp:3.2,dur:4.5,dl:-2}],
  flames:[{x:143,y:912,s:34},{x:590,y:912,s:34}],
  glows:[{x:368,y:66,r:84,c:'255,220,140',a:.55,p:3.2},{x:368,y:800,r:210,c:'255,230,170',a:.25,p:5}],
  sparks:[[120,640,620,930,9],[60,300,680,560,5]],
  part:{t:'marigold',n:14},
  intro:'With the divine blessings of our families, we joyfully invite you to celebrate the wedding of',closing:'Your presence and blessings will make our day complete.'},
 '2004':{name:'Temple Lotus',img:'2004.jpg',w:1152,h:2048,open:'bloom',bism:false,
  tone:{ink:'#7a1426',body:'#4d2a2a',acc:'#b58a3c',paper:'#f6e8dc',paper2:'#efd9c8',gbg:'#35160f',g1:'#6c3018',txt:'#74122a',foil:['#a07424','#ecd08c','#b4872f','#f4dc9e','#94692a'],plate:['#9c1f35','#561021']},
  hero:{top:21,h:54,w:62},
  sways:[{b:[0,0,380,640],amp:1,dur:6},{b:[960,0,1152,760],amp:1,dur:7,dl:-2.2}],
  flames:[{x:68,y:1692,s:46},{x:98,y:1690,s:46},{x:160,y:1688,s:46},{x:190,y:1688,s:46},{x:243,y:1838,s:54},{x:1008,y:1498,s:50},{x:1050,y:1496,s:50},{x:1090,y:1498,s:50},{x:1140,y:1496,s:50}],
  glows:[{x:620,y:240,r:200,c:'255,226,160',a:.35,p:4.4}],
  sparks:[[320,200,880,380,6],[100,1700,520,2000,8],[760,1650,1120,2000,8]],
  part:{t:'lotus',n:18},
  intro:'With the divine blessings of our families, we joyfully invite you to celebrate the wedding of',closing:'Your presence and blessings will make our day complete.'}
};

/* ---------------------------------------------------------------- artwork layers */
function art(c,inner){
 const {w,h}=c,P=(v,t)=>(v/t*100).toFixed(3)+'%';
 let s=`<div class="art" style="--ar:${(w/h).toFixed(4)}"><img class="bg" src="${ASSET+c.img}" alt="">`;
 (c.sways||[]).forEach(z=>{const [x0,y0,x1,y1]=z.b,bw=x1-x0,bh=y1-y0;
  s+=`<div class="sway" style="left:${P(x0,w)};top:${P(y0,h)};width:${P(bw,w)};height:${P(bh,h)};background-image:url('${ASSET+c.img}');background-size:${(100*w/bw).toFixed(2)}% ${(100*h/bh).toFixed(2)}%;background-position:${(w>bw?x0/(w-bw)*100:0).toFixed(2)}% ${(h>bh?y0/(h-bh)*100:0).toFixed(2)}%;--amp:${z.amp}deg;--dur:${z.dur}s;--dl:${z.dl||0}s"></div>`});
 (c.sprites||[]).forEach(z=>{const [x0,y0,x1]=z.b;
  s+=`<div class="spr${z.drop?' drop':''}" style="left:${P(x0,w)};top:${P(y0,h)};width:${P(x1-x0,w)};--o:${z.o};--amp:${z.amp}deg;--dur:${z.dur}s;--dl:${z.dl||0}s"><img src="${ASSET+z.f}" alt=""></div>`});
 (c.glows||[]).forEach(z=>{s+=`<i class="gl" style="left:${P(z.x,w)};top:${P(z.y,h)};width:${P(z.r*2,w)};--c:${z.c};--a:${z.a};--p:${z.p}s"></i>`});
 (c.flames||[]).forEach((z,i)=>{s+=`<i class="fm" style="left:${P(z.x,w)};top:${P(z.y,h)};width:${P(z.s*2,w)};--d:${(i%4)*.37}s"></i>`});
 let k=0;
 (c.sparks||[]).forEach(([x0,y0,x1,y1,n])=>{for(let i=0;i<n;i++,k++)s+=`<b class="sp" style="left:${P(x0+rnd(k,0,x1-x0),w)};top:${P(y0+rnd(k+50,0,y1-y0),h)};--z:${(rnd(k+99,1.1,2.3)).toFixed(2)}cqw;--d:${rnd(k+7,0,3.6).toFixed(2)}s"></b>`});
 let pt='';
 for(let i=0;i<c.part.n;i++)pt+=`<i class="pet" style="--x:${rnd(i+300,2,97).toFixed(1)}%;--s:${rnd(i+301,1.8,3.4).toFixed(2)}cqw;--t:${rnd(i+302,11,19).toFixed(1)}s;--d:${(-rnd(i+303,0,18)).toFixed(1)}s;--dx:${((i%2?1:-1)*rnd(i+304,2,9)).toFixed(1)}cqw;--r2:${rnd(i+305,200,520).toFixed(0)}deg"></i>`;
 s+=`<div class="fall pt-${c.part.t}" aria-hidden="true">${pt}</div><i class="sheen"></i>${inner||''}</div>`;
 return s;
}
function burst(type,n){
 let s='';
 for(let i=0;i<n;i++)s+=`<i class="pet" style="--x:${rnd(i,3,96).toFixed(1)}%;--s:${rnd(i+1,2.2,4.4).toFixed(2)}cqw;--t:${rnd(i+2,4.8,7.5).toFixed(1)}s;--d:${(1.0+rnd(i+3,0,2.2)).toFixed(2)}s;--dx:${((i%2?1:-1)*rnd(i+4,2,12)).toFixed(1)}cqw;--r2:${rnd(i+5,200,560).toFixed(0)}deg"></i>`;
 return `<div class="fall burst pt-${type}" aria-hidden="true">${s}</div>`;
}

/* ---------------------------------------------------------------- styles */
const CSS=(m,c)=>`
:root{--nf:${m.nameFont};--bf:${m.bodyFont};--ink:${c.tone.ink};--body:${c.tone.body};--acc:${c.tone.acc};--paper:${c.tone.paper};--paper2:${c.tone.paper2};--gbg:${c.tone.gbg};--g1:${c.tone.g1};--txt:${c.tone.txt};--gold:#d9b46a;--gold2:#f3dca1;--red:${c.tone.ink};color-scheme:light}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
body{margin:0;background:var(--paper2);color:var(--body);font:17px/1.7 var(--bf);overflow-x:hidden}
body.rs-locked{overflow:hidden;height:100vh;height:100svh}
/* artwork box */
.art{position:relative;width:min(100%,560px);margin:0 auto;aspect-ratio:var(--ar);container-type:inline-size;overflow:hidden;background:var(--paper)}
.art>.bg{position:absolute;inset:0;width:100%;height:100%;display:block}
.sway{position:absolute;background-repeat:no-repeat;transform-origin:50% 0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 16%,#000 84%,transparent),linear-gradient(0deg,transparent,#000 24%);-webkit-mask-composite:source-in;mask-image:linear-gradient(90deg,transparent,#000 16%,#000 84%,transparent),linear-gradient(0deg,transparent,#000 24%);mask-composite:intersect;animation:art-sway var(--dur) ease-in-out var(--dl) infinite alternate;will-change:transform}
.spr{position:absolute}
.spr img{display:block;width:100%;height:auto;transform-origin:var(--o);animation:art-swing var(--dur) ease-in-out var(--dl) infinite alternate;will-change:transform}
body.rs-wait .spr.drop{opacity:0}
body:not(.rs-wait) .spr.drop{animation:art-drop 2.4s cubic-bezier(.3,.7,.3,1) both}
.gl{position:absolute;transform:translate(-50%,-50%);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(var(--c),var(--a)) 0,rgba(var(--c),calc(var(--a)*.35)) 38%,rgba(var(--c),0) 68%);mix-blend-mode:screen;pointer-events:none;animation:art-glow var(--p) ease-in-out infinite}
.fm{position:absolute;transform:translate(-50%,-50%);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(255,236,170,.95) 0,rgba(255,196,90,.5) 30%,rgba(255,170,60,0) 66%);mix-blend-mode:screen;pointer-events:none;animation:art-flick 1.9s ease-in-out var(--d) infinite}
.sp{position:absolute;width:var(--z);height:var(--z);transform:translate(-50%,-50%) scale(0);background:#fff7d6;clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%);filter:drop-shadow(0 0 3px #ffe49a);pointer-events:none;animation:art-twk 2.8s ease-in-out var(--d) infinite}
.sheen{position:absolute;inset:0;pointer-events:none;mix-blend-mode:soft-light;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.55) 50%,transparent 65%);transform:translateX(-120%);animation:art-sheen 7.5s ease-in-out 1.5s infinite}
.fall{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.pet{position:absolute;top:-6%;left:var(--x);width:var(--s);height:calc(var(--s)*1.4);opacity:0;animation:art-fall var(--t) linear var(--d) infinite;will-change:transform,opacity}
.pt-glitter .pet{border-radius:50%;width:calc(var(--s)*.45);height:calc(var(--s)*.45);background:radial-gradient(circle,#fff6cf,#e9c46a 55%,#e9c46a00 72%);box-shadow:0 0 6px #ffe49a}
.pt-blush .pet{border-radius:80% 0 80% 0;background:linear-gradient(135deg,#ffd6e0,#f08aa6)}
.pt-marigold .pet{border-radius:70% 30% 70% 30%;background:linear-gradient(135deg,#ffc94d,#e8821a)}
.pt-lotus .pet{border-radius:80% 0 80% 0;background:linear-gradient(135deg,#ffe3ee,#f19ab8)}
.burst .pet{animation:art-pop var(--t) cubic-bezier(.3,.55,.4,1) var(--d) forwards;top:-4%}
/* hero text */
.ht{position:absolute;left:50%;transform:translateX(-50%);width:var(--hw);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;z-index:6}
.bism{font:400 4.6cqw/1.5 AtelierAmiri,Amiri,'Noto Naskh Arabic',serif;color:var(--txt);margin:0;direction:rtl}
.intro{font:600 2.35cqw/1.85 Arial,sans-serif;letter-spacing:.5cqw;text-transform:uppercase;color:var(--body);margin:.6cqw 0 1.6cqw}
.lbl{font:700 2.1cqw/1.5 Arial,sans-serif;letter-spacing:.6cqw;text-transform:uppercase;color:var(--acc);margin:1cqw 0 0}
.nm{font-family:var(--nf);font-weight:400;line-height:1.1;color:var(--txt);margin:0;overflow-wrap:anywhere;max-width:100%;text-shadow:0 1px 0 #fff8}
.par{font:italic 400 3.3cqw/1.45 var(--bf);color:var(--body);margin:.4cqw 0 0}
.amp{font:400 7cqw/1 var(--nf);color:var(--acc);margin:.8cqw 0}
body.rs-wait .hv{opacity:0}
body:not(.rs-wait) .hv{animation:rs-up .95s cubic-bezier(.2,.7,.2,1) var(--d,0s) both}
.hero{background:var(--paper);overflow:hidden}
/* gate */
.gate{position:fixed;inset:0;z-index:100;overflow:hidden;background:var(--gbg)}
.gate.gone{display:none}
.g-fill{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 38%,var(--g1),var(--gbg) 72%)}
.gframe{position:relative;width:min(100%,560px);margin:0 auto;height:100%;container-type:inline-size}
.gart{position:absolute;left:0;right:0;top:0;transform-origin:50% 35%;will-change:clip-path,transform,filter}
.gart .art{width:100%}
.g-arch .gart,.g-petal .gart{clip-path:inset(14% 20% 44% 20% round 50% 50% 0 0);filter:brightness(.85)}
.g-bell .gart{clip-path:circle(17% at 50% 26%);filter:brightness(.8)}
.g-diya .gart{clip-path:circle(4.5% at 50% 90%);filter:brightness(.85)}
.g-bloom .gart{filter:blur(15px) brightness(.7);transform:scale(1.18)}
.gate.open .g-arch .gart,.gate.open.g-arch .gart,.gate.open.g-petal .gart{animation:art-o-arch 2.9s cubic-bezier(.6,0,.2,1) .15s forwards}
.gate.open.g-bell .gart{animation:art-o-bell 2.6s cubic-bezier(.6,0,.2,1) .35s forwards}
.gate.open.g-diya .gart{animation:art-o-diya 3s cubic-bezier(.55,0,.25,1) .55s forwards}
.gate.open.g-bloom .gart{animation:art-o-bloom 3s cubic-bezier(.5,0,.2,1) .15s forwards}
.g-flash{position:absolute;inset:0;pointer-events:none;opacity:0;background:radial-gradient(circle at 50% 26%,#fff6cf 0,#ffd27a88 28%,transparent 62%)}
.gate.open .g-flash{animation:art-flash 1.7s ease .1s}
.g-lamp{position:absolute;top:calc(86cqw / var(--ar));width:9%;aspect-ratio:1/1.5;transform:translateX(-50%);border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:radial-gradient(ellipse at 50% 70%,#fff8d8 0,#ffd36b 38%,#ff9b2f 70%,transparent 72%);filter:drop-shadow(0 0 14px #ffb84a);animation:art-flick 1.6s ease-in-out infinite;z-index:3;transition:transform 1.4s ease,opacity 1.2s ease 1s}
.g-lamp.a{left:38%}.g-lamp.b{left:62%;animation-delay:-.7s}
.gate.open .g-lamp{transform:translateX(-50%) scale(3.6);opacity:0}
.g-dust{position:absolute;inset:0;pointer-events:none}
.g-ui{position:absolute;inset:0;z-index:12;display:flex;align-items:center;justify-content:center;pointer-events:none}
.g-hit{all:unset;box-sizing:border-box;cursor:pointer;pointer-events:auto;display:flex;flex-direction:column;align-items:center;gap:18px;padding:34px 44px;margin-top:4svh;transition:opacity .6s,transform .6s}
.gate.open .g-hit{opacity:0;transform:scale(.92);pointer-events:none}
.g-hit:focus-visible .g-tap{text-decoration:underline;text-underline-offset:8px}
.g-ring{width:66px;height:66px;border-radius:50%;border:1.5px solid #f3dca1cc;position:relative;animation:rs-ring 2.4s ease-out infinite}
.g-ring:after{content:'';position:absolute;inset:24px;border-radius:50%;background:#f3dca1;opacity:.9}
.g-tap{font:400 clamp(32px,9vw,46px)/1.1 var(--nf);color:#f6e2ae;text-shadow:0 2px 16px #000,0 0 24px #000a}
.g-orn{width:min(60vw,240px);height:10px}
.g-orn:before{content:'';display:block;height:1px;margin-top:5px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.g-skip{all:unset;cursor:pointer;position:absolute;z-index:13;left:50%;bottom:calc(20px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);padding:10px 18px;font:600 10px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#f3dca1cc;opacity:0;pointer-events:none}
.gate.open .g-skip{animation:rs-skip .6s ease 1.6s forwards;pointer-events:auto}
.gate.open{animation:art-gone .9s ease 3.7s forwards}
.gate.skip *{animation-duration:.01s!important;animation-delay:0s!important;transition-duration:.01s!important;transition-delay:0s!important}
/* sections */
.sec{position:relative;background-color:var(--paper);color:var(--body);text-align:center;padding:78px 22px 76px;overflow:hidden;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .33 0 0 0 0 .2 0 0 0 .08 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}
.sec.alt{background-color:var(--paper2)}
.sec:before{content:'';position:absolute;top:30px;left:50%;width:min(60vw,240px);height:9px;transform:translateX(-50%);background:linear-gradient(90deg,transparent,var(--acc) 40%,transparent 48%,transparent 52%,var(--acc) 60%,transparent);opacity:.85}
.sec:after{content:'';position:absolute;top:26px;left:50%;width:9px;height:9px;transform:translateX(-50%) rotate(45deg);background:var(--acc)}
.inner{position:relative;max-width:520px;margin:0 auto}
.msg{font:italic 400 clamp(18px,4.8vw,21px)/1.8 var(--bf);color:var(--body);max-width:440px;margin:0 auto 34px;white-space:pre-wrap;overflow-wrap:anywhere}
.kick{font:700 11px/1.5 Arial,sans-serif;letter-spacing:4px;text-transform:uppercase;color:var(--acc);margin:0}
.ttl{font:400 clamp(34px,10vw,54px)/1.12 var(--nf);color:var(--txt);margin:8px 0 4px;overflow-wrap:anywhere}
.divider{display:flex;align-items:center;justify-content:center;gap:12px;margin:12px auto 26px;width:min(60vw,240px);color:var(--acc)}
.divider:before,.divider:after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--acc))}.divider:after{transform:scaleX(-1)}
.divider i{width:7px;height:7px;transform:rotate(45deg);background:var(--acc)}
.scratch{position:relative;width:100%;max-width:400px;height:210px;margin:6px auto 0;border-radius:16px;border:2px solid var(--acc);box-shadow:0 14px 34px #0003,inset 0 0 0 5px var(--paper),inset 0 0 0 6px #b8923f88;overflow:hidden;background:linear-gradient(135deg,${c.tone.plate[0]},${c.tone.plate[1]})}
.plate{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;color:#fff3d6;text-shadow:0 2px 12px #0008}
.plate .dw{font:700 11px Arial,sans-serif;letter-spacing:5px;color:var(--gold2);text-transform:uppercase}
.plate .dd{font:400 72px/1 var(--nf);color:#fff3d6}
.plate .dm{font:600 13px Arial,sans-serif;letter-spacing:4px;color:var(--gold2);text-transform:uppercase}
.plate .dt{font:italic 17px var(--bf);color:#f6e6c6;margin-top:3px}
#rs-foil{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab;transition:opacity .9s ease}
.scratch.done #rs-foil{opacity:0;pointer-events:none}
.tapreveal{all:unset;display:inline-block;margin-top:16px;cursor:pointer;font:600 11px Arial,sans-serif;letter-spacing:2.4px;color:var(--ink);text-decoration:underline;text-underline-offset:4px;text-transform:uppercase}
.scratch.done~.tapreveal{display:none}
.cd{display:flex;justify-content:center;gap:10px;margin-top:22px;opacity:0;transform:translateY(10px);transition:opacity .8s ease .5s,transform .8s ease .5s}
.scratch.done~.cd,.cd.on{opacity:1;transform:none}
.cd div{min-width:64px;padding:10px 4px 8px;border:1px solid #b8923f77;border-radius:10px;background:#ffffff66}
.cd b{display:block;font:400 30px/1.1 var(--nf);color:var(--ink)}
.cd small{font:700 9px Arial,sans-serif;letter-spacing:2.4px;color:var(--acc);text-transform:uppercase}
#rs-burst{position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:3}
#rs-burst i{position:absolute;left:50%;top:50%;width:var(--w);height:calc(var(--w)*1.6);border-radius:80% 0 80% 0;background:linear-gradient(135deg,var(--acc),var(--ink));opacity:0;animation:rs-burst 1.7s ease-out var(--d) forwards}
.slider{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px calc(50% - min(39vw,170px)) 18px;margin:0 -22px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.slider::-webkit-scrollbar{display:none}
.slide{flex:0 0 min(78vw,340px);aspect-ratio:3/4;scroll-snap-align:center;border-radius:200px 200px 18px 18px;overflow:hidden;position:relative;border:3px solid #fff8ea;box-shadow:0 14px 34px #0003,0 0 0 1px var(--acc);background:#d8c29c;cursor:zoom-in}
.slide img{width:100%;height:100%;object-fit:cover;display:block}
.dots{display:flex;justify-content:center;gap:8px;margin-top:6px}
.dots b{width:7px;height:7px;border-radius:50%;border:1px solid var(--ink);transition:all .3s}
.dots b.on{background:var(--ink);width:20px;border-radius:5px}
.lightbox{position:fixed;inset:0;z-index:90;background:#000d;display:none;align-items:center;justify-content:center;padding:18px;cursor:zoom-out}
.lightbox.on{display:flex}.lightbox img{max-width:100%;max-height:100%;border-radius:10px;box-shadow:0 0 40px #000}
.tl{position:relative;max-width:440px;margin:6px auto 0;text-align:left}
.tl:before{content:'';position:absolute;left:112px;top:8px;bottom:8px;width:1px;background:linear-gradient(transparent,var(--acc) 10%,var(--acc) 90%,transparent)}
.tl-row{display:grid;grid-template-columns:96px 1fr;gap:34px;padding:12px 0;position:relative}
.tl-row:before{content:'';position:absolute;left:108px;top:22px;width:9px;height:9px;border-radius:50%;background:var(--ink);box-shadow:0 0 0 4px var(--paper2),0 0 0 5px var(--acc);animation:rs-pulse 2.6s ease-in-out infinite}
.tl-t{font:700 12px/1.5 Arial,sans-serif;letter-spacing:1.6px;color:var(--ink);text-align:right;padding-top:3px;text-transform:uppercase}
.tl-n{font:600 clamp(21px,5.6vw,25px)/1.25 var(--bf);color:var(--txt);margin:0}
.tl-d{font:italic 15px/1.5 var(--bf);color:var(--body);margin:2px 0 0}
.cards{display:grid;gap:18px;max-width:440px;margin:6px auto 0}
.ecard{position:relative;padding:28px 18px 26px;border:1px solid #b8923f99;border-radius:6px;background:#ffffff77;box-shadow:0 8px 22px #0002}
.ecard:before{content:'';position:absolute;inset:6px;border:1px solid #b8923f55;border-radius:3px;pointer-events:none}
.ecard h3{font:400 clamp(30px,8.4vw,38px)/1.2 var(--nf);color:var(--txt);margin:0 0 4px;overflow-wrap:anywhere}
.ecard .ed{font:700 11px/1.7 Arial,sans-serif;letter-spacing:2.4px;color:var(--ink);text-transform:uppercase}
.ecard .ep{font:italic 17px/1.5 var(--bf);color:var(--body);margin:6px 0 16px;overflow-wrap:anywhere;white-space:pre-line}
.mapbtn{display:inline-block;padding:13px 24px;border:1px solid var(--acc);color:var(--txt);text-decoration:none;font:700 10.5px Arial,sans-serif;letter-spacing:2.6px;text-transform:uppercase;border-radius:3px;background:#ffffff88;transition:background .3s,color .3s,transform .3s}
.mapbtn:hover,.mapbtn:focus-visible{background:var(--ink);color:#fff3d6;transform:translateY(-2px)}
.fam{white-space:pre-wrap;font:italic 18px/1.8 var(--bf);color:var(--body);max-width:440px;margin:0 auto 22px;overflow-wrap:anywhere}
.close{font:400 clamp(22px,6vw,28px)/1.6 var(--bf);color:var(--txt);max-width:440px;margin:0 auto 6px;white-space:pre-wrap;overflow-wrap:anywhere}
.sign{font:400 clamp(36px,10vw,50px)/1.2 var(--nf);color:var(--ink);margin:14px 0 4px;overflow-wrap:anywhere}
.small{font:600 10px Arial,sans-serif;letter-spacing:2.6px;color:var(--acc);text-transform:uppercase}
.rsvp{display:inline-block;margin:6px 0 20px;padding:14px 30px;border-radius:40px;background:linear-gradient(135deg,#f3dca1,#c9a050);color:#3b0711;text-decoration:none;font:700 11px Arial,sans-serif;letter-spacing:3px;box-shadow:0 8px 20px #0003}
.credit{padding:18px;text-align:center;background:var(--gbg);color:#c9ab80;font:10px Arial,sans-serif;letter-spacing:2px}
.mbtn{position:fixed;right:14px;bottom:14px;z-index:80;width:46px;height:46px;border-radius:50%;border:1px solid #fff3c9;background:linear-gradient(135deg,#f3dca1,#c9a050);color:#3b0711;font-size:19px;cursor:pointer;box-shadow:0 6px 18px #0008;display:none}
.mbtn.on{display:block}.mbtn.play{animation:rs-ring 2.4s ease-out infinite}
.rs-js .rv{opacity:0;transform:translateY(26px);transition:opacity .9s ease var(--d,0s),transform .9s cubic-bezier(.2,.7,.2,1) var(--d,0s)}
.rs-js .rv.in{opacity:1;transform:none}
.rs-prev [data-rs]{cursor:pointer;border-radius:4px}
.rs-prev [data-rs]:hover{outline:1px dashed var(--acc);outline-offset:3px}
.rs-prev .slide{cursor:pointer}
@keyframes art-sway{from{transform:rotate(calc(var(--amp)*-1))}to{transform:rotate(var(--amp))}}
@keyframes art-swing{from{transform:rotate(calc(var(--amp)*-1))}to{transform:rotate(var(--amp))}}
@keyframes art-drop{0%{opacity:0;transform:translateY(-62%)}8%{opacity:1}55%{transform:translateY(2.5%)}75%{transform:translateY(-1%)}100%{opacity:1;transform:none}}
@keyframes art-glow{0%,100%{opacity:.55;transform:translate(-50%,-50%) scale(.94)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.07)}}
@keyframes art-flick{0%,100%{opacity:.7;transform:translate(-50%,-50%) scale(1)}25%{opacity:1;transform:translate(-50%,-50%) scale(1.12)}55%{opacity:.8;transform:translate(-50%,-50%) scale(.94)}80%{opacity:.95;transform:translate(-50%,-50%) scale(1.06)}}
@keyframes art-twk{0%,100%{transform:translate(-50%,-50%) scale(0) rotate(0)}45%{transform:translate(-50%,-50%) scale(1) rotate(45deg)}70%{transform:translate(-50%,-50%) scale(.3) rotate(80deg)}}
@keyframes art-sheen{0%,60%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
@keyframes art-fall{0%{opacity:0;transform:translate3d(0,0,0) rotate(0)}8%{opacity:.9}85%{opacity:.75}100%{opacity:0;transform:translate3d(var(--dx),calc(112cqw / var(--ar)),0) rotate(var(--r2))}}
@keyframes art-pop{0%{opacity:0;transform:translate3d(0,0,0) scale(0)}7%{opacity:1;transform:translate3d(0,4cqw,0) scale(1.35)}14%{transform:translate3d(0,3cqw,0) scale(1)}70%{opacity:1}100%{opacity:0;transform:translate3d(var(--dx),calc(112cqw / var(--ar)),0) rotate(var(--r2))}}
@keyframes art-o-arch{0%{clip-path:inset(14% 20% 44% 20% round 50% 50% 0 0);filter:brightness(.85);transform:scale(1.1)}100%{clip-path:inset(0 0 0 0 round 0);filter:brightness(1);transform:scale(1)}}
@keyframes art-o-bell{0%{clip-path:circle(17% at 50% 26%);filter:brightness(.8)}100%{clip-path:circle(150% at 50% 26%);filter:brightness(1)}}
@keyframes art-o-diya{0%{clip-path:circle(4.5% at 50% 90%);filter:brightness(.85)}100%{clip-path:circle(150% at 50% 90%);filter:brightness(1)}}
@keyframes art-o-bloom{0%{filter:blur(15px) brightness(.7);transform:scale(1.18)}60%{filter:blur(3px) brightness(1.15)}100%{filter:none;transform:scale(1)}}
@keyframes art-flash{0%{opacity:0}18%{opacity:1}100%{opacity:0}}
@keyframes art-gone{to{opacity:0;visibility:hidden}}
@keyframes rs-skip{to{opacity:.85}}
@keyframes rs-ring{0%{box-shadow:0 0 0 0 #f3dca177}100%{box-shadow:0 0 0 22px #f3dca100}}
@keyframes rs-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@keyframes rs-pulse{0%,100%{box-shadow:0 0 0 4px var(--paper2),0 0 0 5px var(--acc)}50%{box-shadow:0 0 0 4px var(--paper2),0 0 0 9px #b8923f55}}
@keyframes rs-burst{0%{opacity:0;transform:translate(0,0) rotate(0) scale(.4)}12%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r)) scale(1)}}
@media(max-width:380px){.tl:before{left:96px}.tl-row{grid-template-columns:82px 1fr;gap:30px}.tl-row:before{left:92px}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}.rs-js .rv{opacity:1;transform:none}.fall,.sp{display:none}.gate.open{visibility:hidden}}
@media print{.gate,.mbtn,.fall{display:none!important}body.rs-locked{overflow:visible;height:auto}.rs-js .rv{opacity:1;transform:none}}
${m.customCSS}`;

/* ---------------------------------------------------------------- markup */
function body(m,c,d){
 const w=m.w,tx=c.hero;
 const fit=(s,max)=>Math.max(5.2,Math.min(max,(tx.w*.96)/(Math.max(6,[...s].length)*.43))).toFixed(2);
 const bism=c.bism?m.bism:str(d.rsBismillah,200);
 const intro=str(d.rsIntro,160)||c.intro;
 const l1=m.p1&&/^\s*d\s*\/\s*o\b/i.test(m.p1)?'':`<p class="lbl hv" data-rs="rsLabel1" style="--d:.5s">${esc(m.l1)}</p>`;
 const l2=m.p2&&/^\s*s\s*\/\s*o\b/i.test(m.p2)?'':`<p class="lbl hv" data-rs="rsLabel2" style="--d:1s">${esc(m.l2)}</p>`;
 const text=`<div class="ht" style="top:${tx.top}%;height:${tx.h}%;--hw:${tx.w}cqw">
 ${bism?ed('rsBismillah','p','bism hv',esc(bism),' style="--d:.1s" lang="ar" dir="rtl"'):''}
 ${ed('rsIntro','p','intro hv',esc(intro),' style="--d:.3s"')}
 ${l1}${ed('name1','h1','nm hv',esc(m.n1),` style="--d:.65s;font-size:${fit(m.n1,9.6)}cqw"`)}
 ${m.p1?ed('parents1','p','par hv',esc(m.p1),' style="--d:.8s"'):''}
 <div class="amp hv" style="--d:.95s">&amp;</div>
 ${l2}${ed('name2','h1','nm hv',esc(m.n2),` style="--d:1.15s;font-size:${fit(m.n2,9.6)}cqw"`)}
 ${m.p2?ed('parents2','p','par hv',esc(m.p2),' style="--d:1.3s"'):''}
 </div>`;
 const hero=`<header class="hero" id="top">${art(c,text)}</header>`;
 const dateSec=`<section class="sec" id="date"><div class="inner">
 ${m.message?ed('message','p','msg rv',esc(m.message)):''}
 ${ed('rsDateKicker','p','kick rv',esc(m.dateKick))}${ed('rsDateTitle','h2','ttl rv',esc(m.dateTitle),' style="--d:.1s"')}
 <div class="divider rv"><i></i></div>
 <div class="scratch rv" id="rs-scratch" style="--d:.2s"><div class="plate">${m.w?`<span class="dw">${esc(m.w.day)}</span><span class="dd">${esc(m.w.date)}</span><span class="dm">${esc(m.w.month)} ${esc(m.w.year)}</span>${m.timeText?`<span class="dt">${esc(m.timeText)}</span>`:''}`:`<span class="dm">Date to be announced</span>`}</div><div id="rs-burst"></div><canvas id="rs-foil" aria-label="Scratch to reveal the date"></canvas></div>
 <button type="button" class="tapreveal" id="rs-tap">Or tap here to reveal</button>
 ${m.dateIso?`<div class="cd" id="rs-cd"><div><b id="cd-d">0</b><small>Days</small></div><div><b id="cd-h">0</b><small>Hours</small></div><div><b id="cd-m">0</b><small>Min</small></div><div><b id="cd-s">0</b><small>Sec</small></div></div>`:''}
 </div></section>`;
 const slides=m.photos.map((src,i)=>`<div class="slide" data-i="${i}"><img src="${esc(src)}" alt="Wedding photo ${i+1}" loading="lazy"></div>`).join('');
 const story=m.photos.length?`<section class="sec alt" id="story"><div class="inner">${ed('rsStoryKicker','p','kick rv',esc(m.storyKick))}${ed('rsStoryTitle','h2','ttl rv',esc(m.storyTitle),' style="--d:.1s"')}<div class="divider rv"><i></i></div></div><div class="slider rv" id="rs-slider" style="--d:.15s">${slides}</div>${m.photos.length>1?`<div class="dots">${m.photos.map((_,i)=>`<b${i?'':' class="on"'}></b>`).join('')}</div>`:''}</section>`:'';
 const tl=m.schedule.length?`<section class="sec" id="day"><div class="inner">${ed('rsDayKicker','p','kick rv',esc(m.dayKick))}${ed('rsDayTitle','h2','ttl rv',esc(m.dayTitle),' style="--d:.1s"')}<div class="divider rv"><i></i></div><div class="tl" data-rs="schedule">${m.schedule.map((s,i)=>`<div class="tl-row rv" style="--d:${(i*.1).toFixed(1)}s"><div class="tl-t">${esc(s.time||'')}</div><div><p class="tl-n">${esc(s.title)}</p>${s.detail?`<p class="tl-d">${esc(s.detail)}</p>`:''}</div></div>`).join('')}</div></div></section>`:'';
 const cards=m.events.length?`<section class="sec alt" id="events"><div class="inner">${ed('rsEventsTitle','h2','ttl rv',esc(m.evTitle))}<div class="divider rv"><i></i></div><div class="cards" data-rs="eventsText">${m.events.map((e,i)=>`<article class="ecard rv" style="--d:${(i*.12).toFixed(2)}s"><h3>${esc(e.title)}</h3>${e.date?`<div class="ed">${esc(e.date)}</div>`:''}${e.place?`<p class="ep">${esc(e.place)}</p>`:''}${e.map?`<a class="mapbtn" href="${esc(e.map)}" target="_blank" rel="noopener noreferrer">View on Google Maps</a>`:''}</article>`).join('')}</div></div></section>`:'';
 const closing=str(d.rsClosing,300)||c.closing;
 const end=`<section class="sec" id="with-love"><div class="inner">
 ${m.family?ed('family','p','fam rv',esc(m.family)):''}
 ${m.rsvp?`<a class="rsvp rv" href="${esc(m.rsvp)}" target="_blank" rel="noopener noreferrer">RSVP</a>`:''}
 ${ed('rsClosing','p','close rv',esc(closing),' style="--d:.1s"')}
 <div class="divider rv"><i></i></div>
 <p class="sign rv" data-rs="name1">${esc(m.n1)} &amp; ${esc(m.n2)}</p>
 ${m.from?ed('wishesFrom','p','small rv',esc(m.from)):''}
 </div></section><div class="credit">Made with Mubiey Studio</div>`;
 const dust=Array.from({length:14},(_,i)=>`<i class="pet" style="--x:${rnd(i+700,3,96).toFixed(1)}%;--s:2.4cqw;--t:${rnd(i+701,9,15).toFixed(1)}s;--d:${(-rnd(i+702,0,14)).toFixed(1)}s;--dx:${((i%2?1:-1)*rnd(i+703,2,8)).toFixed(1)}cqw;--r2:300deg"></i>`).join('');
 const gate=m.gate?`<div id="rs-gate" class="gate g-${c.open}" role="dialog" aria-modal="true" aria-label="Open the invitation"><div class="g-fill"></div><div class="gframe" style="--ar:${(c.w/c.h).toFixed(4)}"><div class="gart">${art(c,'')}</div>${c.open==='petal'?burst('blush',26):''}${c.open==='bell'?'<i class="g-flash"></i>':''}${c.open==='diya'?'<i class="g-lamp a"></i><i class="g-lamp b"></i>':''}<div class="fall pt-glitter g-dust" aria-hidden="true">${dust}</div></div><div class="g-ui"><button type="button" class="g-hit" id="rs-open"><span class="g-ring"></span><span class="g-tap">${esc(m.open)}</span><span class="g-orn"></span></button></div><button type="button" class="g-skip" id="rs-skip">Skip</button></div>`:'';
 const audio=m.music?`<audio id="rs-music" loop preload="none" src="${esc(m.music)}"></audio><button type="button" class="mbtn on" id="rs-mbtn" aria-label="Play or pause music">\u266A</button>`:'';
 return `${gate}${hero}${dateSec}${story}${tl}${cards}${end}${audio}`;
}
function render(d,c){
 const m=K.model(d);
 const rt={prev:m.prev,autoplay:m.autoplay,dateIso:m.dateIso,imgs:m.gate?[ASSET+c.img]:[],t1:2700,t2:4800};
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>${esc(m.n1)} &amp; ${esc(m.n2)} — Wedding invitation</title><script>document.documentElement.classList.add('rs-js')<\/script><style>${K.fontCSS()}${CSS(m,c)}</style><noscript><style>.gate{display:none}body.rs-locked{overflow:auto}.rv{opacity:1!important;transform:none!important}</style></noscript></head><body class="${m.gate?'rs-locked rs-wait':''}${m.prev?' rs-prev':''}">${body(m,c,d)}<script>window.RS=${K.json(rt)};<\/script><script>${K.SCRIPT.replace(/<\/script/gi,'<\\/script')}<\/script></body></html>`;
}
window.MubieyArtLive=Object.keys(T).map(id=>({id,name:T[id].name}));
invitationDocument=function(data){const c=data&&T[data.template];return c?render(data,c):base.apply(this,arguments)};
})();
