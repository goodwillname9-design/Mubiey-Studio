/* Mubiey Studio · "Royal Stage" live invitation (template id: royal-stage).
   Tap to open -> red velvet curtains part -> a gold stage with a crystal chandelier and flowers ->
   the invitation scrolls on: names & parents, scratch-to-reveal date with countdown, photo slider,
   schedule timeline and event cards with map buttons.
   Same pattern as the other templates: it wraps invitationDocument() and returns one self-contained HTML
   document, so it works in the editor preview, on guest links and in HTML export.
   ALL artwork is original and drawn in code (SVG + CSS). No reference-image text, fonts, names or watermarks.
   Every text is editable from the invitation form (and by tapping it in the editor preview); fonts follow the
   invitation's Font setting, including an uploaded custom font. */
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

/* ---------------------------------------------------------------- artwork (all original, drawn in code) */
const DEFS=`<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<linearGradient id="rsGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2c0"/><stop offset=".45" stop-color="#d9b46a"/><stop offset="1" stop-color="#9c6f22"/></linearGradient>
<linearGradient id="rsGoldV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b8"/><stop offset=".5" stop-color="#d4a950"/><stop offset="1" stop-color="#8d6220"/></linearGradient>
<linearGradient id="rsCrystal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#fff0cc"/><stop offset="1" stop-color="#e9c779"/></linearGradient>
<radialGradient id="rsFlame" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#fffbe6"/><stop offset=".5" stop-color="#ffd36b"/><stop offset="1" stop-color="#ff9b2f" stop-opacity="0"/></radialGradient>
<radialGradient id="rsGlow"><stop offset="0" stop-color="#ffe7a3" stop-opacity=".75"/><stop offset="1" stop-color="#ffd36b" stop-opacity="0"/></radialGradient>
<radialGradient id="rsRoseG" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#e83a50"/><stop offset=".55" stop-color="#a50f26"/><stop offset="1" stop-color="#560412"/></radialGradient>
<radialGradient id="rsRoseW" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#fffdf6"/><stop offset=".6" stop-color="#f1e6d2"/><stop offset="1" stop-color="#cdbb9b"/></radialGradient>
<linearGradient id="rsLeafG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#173f27"/><stop offset="1" stop-color="#3f7a4c"/></linearGradient>
<symbol id="rsRose" viewBox="-20 -20 40 40"><circle r="18.5" fill="url(#rsRoseG)"/><path d="M0-11C9-11 12-2 8 5C3 10-7 9-9 2C-11-5-6-9 0-8C5-7 7-3 4 1" fill="none" stroke="#ff9eab" stroke-opacity=".38" stroke-width="1.5"/><path d="M-13-8C-6-15 6-15 13-8M-14 5C-8 14 8 14 14 5" fill="none" stroke="#3a0310" stroke-opacity=".38" stroke-width="1.2"/><circle cx="-5" cy="-6" r="3.2" fill="#fff" fill-opacity=".14"/></symbol>
<symbol id="rsRoseWhite" viewBox="-20 -20 40 40"><circle r="18.5" fill="url(#rsRoseW)"/><path d="M0-11C9-11 12-2 8 5C3 10-7 9-9 2C-11-5-6-9 0-8C5-7 7-3 4 1" fill="none" stroke="#b8a583" stroke-opacity=".6" stroke-width="1.3"/><path d="M-13-8C-6-15 6-15 13-8M-14 5C-8 14 8 14 14 5" fill="none" stroke="#a38f6c" stroke-opacity=".45" stroke-width="1.1"/></symbol>
<symbol id="rsLeaf" viewBox="0 -10 28 20"><path d="M0 0C8-10 22-8 28 0C22 8 8 10 0 0z" fill="url(#rsLeafG)"/><path d="M1 0H25" stroke="#9fd0a4" stroke-opacity=".35" stroke-width=".8"/></symbol>
<symbol id="rsBloom" viewBox="-10 -10 20 20"><g fill="#fff8ea" stroke="#d9cdb3" stroke-width=".5"><circle cx="0" cy="-5" r="3.6"/><circle cx="4.8" cy="-1.5" r="3.6"/><circle cx="3" cy="4.2" r="3.6"/><circle cx="-3" cy="4.2" r="3.6"/><circle cx="-4.8" cy="-1.5" r="3.6"/></g><circle r="2.4" fill="#e3b955"/></symbol>
</defs></svg>`;

function chandelier(){
 const tiers=[{y:96,hw:42,c:5,n:8},{y:156,hw:82,c:7,n:14},{y:222,hw:124,c:9,n:20}];
 let s='<line x1="150" y1="0" x2="150" y2="40" stroke="url(#rsGoldV)" stroke-width="3" stroke-dasharray="5 2.5"/><path d="M136 40h28l-5 12h-18z" fill="url(#rsGoldV)"/><path d="M150 52V84" stroke="url(#rsGoldV)" stroke-width="6" stroke-linecap="round"/><ellipse cx="150" cy="70" rx="10" ry="6" fill="url(#rsGoldV)"/><ellipse cx="150" cy="90" rx="7" ry="4.5" fill="url(#rsGoldV)"/>';
 let k=0;
 tiers.forEach((t,ti)=>{
  const x0=150-t.hw,x1=150+t.hw,y=t.y;
  s+=`<path d="M150 ${y-38}Q${150-t.hw*.55} ${y-38} ${x0} ${y}M150 ${y-38}Q${150+t.hw*.55} ${y-38} ${x1} ${y}" fill="none" stroke="url(#rsGold)" stroke-width="3" stroke-linecap="round"/>`;
  s+=`<path d="M${x0} ${y}Q150 ${y+30} ${x1} ${y}" fill="none" stroke="url(#rsGold)" stroke-width="4" stroke-linecap="round"/><ellipse cx="150" cy="${y}" rx="${t.hw}" ry="7" fill="none" stroke="url(#rsGold)" stroke-width="1.2" stroke-opacity=".7"/>`;
  s+=`<circle cx="${x0}" cy="${y}" r="3.6" fill="url(#rsGold)"/><circle cx="${x1}" cy="${y}" r="3.6" fill="url(#rsGold)"/>`;
  for(let i=0;i<t.c;i++){
   const x=x0+(i/(t.c-1))*(x1-x0),yy=y-7*Math.sqrt(Math.max(0,1-((x-150)/t.hw)**2));
   s+=`<circle class="fl-g" style="--d:${(k%7)*.31}s" cx="${x.toFixed(1)}" cy="${(yy-19).toFixed(1)}" r="11" fill="url(#rsGlow)"/><path d="M${(x-3.6).toFixed(1)} ${yy.toFixed(1)}h7.2l-1 -4h-5.2z" fill="url(#rsGold)"/><rect x="${(x-2).toFixed(1)}" y="${(yy-17).toFixed(1)}" width="4" height="13" rx="1.2" fill="#f7eedb"/><ellipse class="fl" style="--d:${(k%5)*.37}s" cx="${x.toFixed(1)}" cy="${(yy-21).toFixed(1)}" rx="2.4" ry="4.8" fill="url(#rsFlame)"/>`;
   k++;
  }
  for(let i=0;i<=t.n;i++){
   const tt=i/t.n,x=x0+(x1-x0)*tt,yy=y+60*tt*(1-tt),L=9+ti*3+(i%3)*6;
   s+=`<line x1="${x.toFixed(1)}" y1="${yy.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(yy+L*.55).toFixed(1)}" stroke="#f1d9a0" stroke-width=".7" stroke-opacity=".85"/><path class="cr" style="--d:${((i*7+ti*3)%11)*.27}s" d="M${x.toFixed(1)} ${(yy+L*.5).toFixed(1)}l3 ${(L*.32).toFixed(1)}l-3 ${(L*.45).toFixed(1)}l-3 -${(L*.45).toFixed(1)}z" fill="url(#rsCrystal)" stroke="#e8c777" stroke-width=".4"/>`;
  }
 });
 s+='<line x1="150" y1="250" x2="150" y2="276" stroke="#f1d9a0" stroke-width=".8"/>';
 [[278,6,14],[296,5,11],[312,4,9]].forEach(([y,w,h],i)=>{s+=`<path class="cr" style="--d:${i*.5}s" d="M150 ${y}l${w} ${h*.5}l-${w} ${h*.7}l-${w} -${h*.7}z" fill="url(#rsCrystal)" stroke="#e8c777" stroke-width=".5"/>`});
 return `<svg class="chand" viewBox="0 0 300 330" aria-hidden="true">${s}</svg>`;
}

const FL=[['leaf',16,206,44,-78],['leaf',34,212,48,-48],['leaf',60,216,50,-18],['leaf',92,218,44,8],['leaf',8,172,40,-104],['leaf',120,214,38,22],
 ['spike',30,206,0,-9],['spike',62,210,0,3],['spike',90,214,0,13],
 ['rose',44,190,40],['rose',80,200,36],['rose',20,164,32],['rose',64,168,30],['rose',104,188,26],
 ['white',100,208,28],['white',34,138,24],['white',54,196,24],['bloom',76,146,13],['bloom',50,112,11],['bloom',112,170,12],['bloom',14,128,10]];
function floral(side){
 let s='';
 for(const [t,x,y,z,r] of FL){
  if(t==='leaf')s+=`<use href="#rsLeaf" transform="translate(${x} ${y}) rotate(${r}) scale(${z/28})" width="28" height="20" x="0" y="-10"/>`;
  else if(t==='spike'){
   s+=`<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0V-104" stroke="#3b6b46" stroke-width="2.6" fill="none"/>`;
   for(let k=0;k<9;k++)s+=`<ellipse cx="${k%2?4:-4}" cy="${-26-k*9}" rx="${(7.4-k*.55).toFixed(1)}" ry="${(9.6-k*.7).toFixed(1)}" fill="#fbf4e4" stroke="#d6c8aa" stroke-width=".6" transform="rotate(${k%2?18:-18} ${k%2?4:-4} ${-26-k*9})"/>`;
   s+='</g>';
  }
  else if(t==='rose')s+=`<use href="#rsRose" x="${x-z/2}" y="${y-z/2}" width="${z}" height="${z}"/>`;
  else if(t==='white')s+=`<use href="#rsRoseWhite" x="${x-z/2}" y="${y-z/2}" width="${z}" height="${z}"/>`;
  else s+=`<use href="#rsBloom" x="${x-z/2}" y="${y-z/2}" width="${z}" height="${z}"/>`;
 }
 s+='<path d="M12 200C30 150 70 120 118 100M40 214C64 168 110 150 150 140" fill="none" stroke="url(#rsGold)" stroke-width="1.4" stroke-linecap="round"/>';
 for(const [x,y] of [[118,100],[150,140],[84,128],[56,162]])s+=`<circle cx="${x}" cy="${y}" r="2.4" fill="#f0d189"/>`;
 return `<svg class="flor ${side}" viewBox="0 0 170 230" aria-hidden="true" preserveAspectRatio="xMinYMax meet">${side==='r'?'<g transform="translate(170 0) scale(-1 1)">'+s+'</g>':s}</svg>`;
}
function garland(){
 let s='';
 for(let i=0;i<14;i++){const x=14+i*28,y=34+Math.sin(i*.9)*6;s+=`<use href="#rsLeaf" transform="translate(${x-8} ${y+2}) rotate(${i%2?-24:24}) scale(.82)" width="28" height="20" x="0" y="-10"/><use href="#rsLeaf" transform="translate(${x+6} ${y-2}) rotate(${i%2?160:-160}) scale(.7)" width="28" height="20" x="0" y="-10"/>`}
 for(let i=0;i<14;i++){const x=14+i*28,y=34+Math.sin(i*.9)*6;
  if(i%3===1)s+=`<use href="#rsRoseWhite" x="${x-10}" y="${y-10}" width="20" height="20"/>`;
  else if(i%2===0)s+=`<use href="#rsRose" x="${x-12}" y="${y-12}" width="24" height="24"/>`;
  else s+=`<use href="#rsBloom" x="${x-7}" y="${y-8}" width="14" height="14"/><circle cx="${x+8}" cy="${y+10}" r="1.8" fill="#e8c777"/>`;}
 return `<svg class="garl" viewBox="0 0 400 68" aria-hidden="true">${s}</svg>`;
}
function sconce(side){
 return `<svg class="sconce ${side}" viewBox="0 0 60 120" aria-hidden="true"><path d="M30 10C8 14 6 40 12 52M30 10C52 14 54 40 48 52" fill="none" stroke="url(#rsGold)" stroke-width="3" stroke-linecap="round"/><path d="M20 52h20l-3 12H23z" fill="url(#rsGoldV)"/><path d="M24 64h12v12H24z" fill="#fff6dc" fill-opacity=".28" stroke="url(#rsGold)" stroke-width="1.4"/><circle class="fl-g" cx="30" cy="40" r="18" fill="url(#rsGlow)"/><rect x="26" y="26" width="8" height="26" rx="2" fill="#f7eedb" fill-opacity=".92"/><ellipse class="fl" cx="30" cy="22" rx="3.6" ry="7" fill="url(#rsFlame)"/><path d="M30 76v18M22 94h16" stroke="url(#rsGoldV)" stroke-width="3" stroke-linecap="round"/><path class="cr" d="M30 100l4 8-4 10-4-10z" fill="url(#rsCrystal)"/></svg>`;
}
function pelmet(){
 let sc='',orn='';
 for(let i=0;i<8;i++)sc+=`q 25 26 50 0 `;
 for(let i=0;i<16;i++)orn+=`<circle cx="${12.5+i*25}" cy="26" r="2.2" fill="#fff1bd" fill-opacity=".85"/>`;
 return `<svg class="pelmet" viewBox="0 0 400 96" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H400V50${'q-25 26 -50 0 '.repeat(8)}Z" fill="url(#rsGoldV)"/><path d="M0 14H400" stroke="#7b5316" stroke-opacity=".35" stroke-width="1"/>${orn}<path d="M0 6H400" stroke="#fff3c4" stroke-opacity=".6" stroke-width="1.5"/></svg><svg class="crest" viewBox="0 0 120 70" aria-hidden="true"><path d="M60 62C28 62 8 44 4 22c14 10 30 14 56 14S102 32 116 22c-4 22-24 40-56 40z" fill="url(#rsGoldV)"/><g stroke="#7b5316" stroke-opacity=".5" stroke-width="1">${[12,26,40,52,60,68,80,94,108].map(x=>`<path d="M60 52L${x} 26"/>`).join('')}</g><circle cx="60" cy="48" r="9" fill="#7d1222" stroke="url(#rsGold)" stroke-width="2.4"/><circle cx="57" cy="45" r="2.6" fill="#ff8d9b" fill-opacity=".7"/></svg>`;
}
const dust=n=>`<div class="dust" aria-hidden="true">${Array.from({length:n},(_,i)=>`<i style="--x:${(i*37+9)%100}%;--s:${3+(i%4)*2}px;--t:${9+(i%6)*2}s;--d:${-(i*1.9).toFixed(1)}s"></i>`).join('')}</div>`;
const stageBack=(cls)=>`<div class="stage-bg ${cls||''}"><div class="wall"></div><div class="back-drape"></div>${pelmet()}<div class="side-drape sl"></div><div class="side-drape sr"></div><div class="post pl"></div><div class="post pr"></div>${sconce('l')}${sconce('r')}<div class="chand-wrap">${chandelier()}</div><div class="floor"></div>${floral('l')}${floral('r')}${dust(16)}</div>`;

/* ---------------------------------------------------------------- styles */
const CSS=(m)=>`
:root{--gold:#d9b46a;--gold2:#f3dca1;--red:#7d1222;--deep:#2a050c;--wine:#4a0a16;--paper:#efe0c6;--paper2:#e6d3b1;--ink:#4a0d17;--nf:${m.nameFont};--bf:${m.bodyFont};color-scheme:light}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
body{margin:0;background:var(--deep);color:#f8ecd6;font:17px/1.7 var(--bf);overflow-x:hidden}
body.rs-locked{overflow:hidden;height:100vh;height:100svh}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
/* stage artwork */
.stage-bg{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.stage-bg .wall{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 34%,#8c1426 0,#610b19 42%,#34060d 100%),repeating-linear-gradient(90deg,#0000 0 22px,#0003 22px 24px)}
.stage-bg .wall:after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,#0000 0 14px,#0000001f 14px 16px,#ffffff08 16px 18px)}
.stage-bg .back-drape{position:absolute;left:11%;right:11%;top:19%;bottom:14%;background:linear-gradient(180deg,#0006,transparent 18%,transparent 78%,#0007),repeating-linear-gradient(90deg,#44060f 0,#8b1325 13px,#c2293f 24px,#8b1325 36px,#44060f 52px);opacity:0;box-shadow:inset 0 0 40px #0009}
.stage-bg.full .back-drape{opacity:1}
.pelmet{position:absolute;left:-1%;width:102%;top:0;height:9.5%;min-height:46px;filter:drop-shadow(0 6px 8px #0009)}
.crest{position:absolute;left:50%;top:0;width:min(30vw,130px);transform:translateX(-50%);filter:drop-shadow(0 4px 6px #0008)}
.side-drape{position:absolute;top:0;bottom:0;width:21%;background:linear-gradient(90deg,#00000066,transparent 25%,transparent 75%,#0000004d),repeating-linear-gradient(90deg,#3d050d 0,#8a1528 12px,#c42a40 22px,#8a1528 34px,#3d050d 50px);z-index:2}
.side-drape.sl{left:0;clip-path:polygon(0 0,100% 0,62% 38%,86% 60%,40% 100%,0 100%)}
.side-drape.sr{right:0;clip-path:polygon(0 0,100% 0,100% 100%,60% 100%,14% 60%,38% 38%)}
.stage-bg:not(.full) .side-drape{width:15%;opacity:.95}
.post{position:absolute;top:10%;bottom:11%;width:2px;background:linear-gradient(180deg,transparent,var(--gold) 12%,var(--gold) 88%,transparent);opacity:.7;z-index:3}
.post.pl{left:9%}.post.pr{right:9%}
.sconce{position:absolute;top:36%;width:min(13vw,56px);z-index:4}
.sconce.l{left:2.6%}.sconce.r{right:2.6%}
.chand-wrap{position:absolute;left:50%;top:0;transform:translateX(-50%);width:min(66vw,320px);z-index:5;transform-origin:50% 0;animation:rs-sway 6.5s ease-in-out infinite}
.stage-bg.full .chand-wrap{top:3%}
.chand{display:block;width:100%;height:auto;filter:drop-shadow(0 10px 24px #ffcf6a55)}
.fl{transform-box:fill-box;transform-origin:50% 90%;animation:rs-flick 1.7s ease-in-out var(--d,0s) infinite}
.fl-g{animation:rs-glow 2.4s ease-in-out var(--d,0s) infinite}
.cr{transform-box:fill-box;transform-origin:50% 50%;animation:rs-twinkle 3.2s ease-in-out var(--d,0s) infinite}
.floor{position:absolute;left:0;right:0;bottom:0;height:13%;background:linear-gradient(180deg,#0005,transparent 30%),repeating-linear-gradient(90deg,#c19560 0,#b0834d 46px,#9b6f3f 47px,#b88c55 94px);box-shadow:inset 0 14px 22px #0006}
.stage-bg:not(.full) .floor{height:8%;opacity:.8}
.flor{position:absolute;bottom:0;width:min(46vw,250px);height:auto;max-height:52%;z-index:4}
.flor.l{left:-2%}.flor.r{right:-2%}
.dust{position:absolute;inset:0;z-index:6;overflow:hidden}
.dust i{position:absolute;bottom:-12px;left:var(--x);width:var(--s);height:var(--s);border-radius:50%;background:radial-gradient(circle,#fff6cf,#f3dca1aa 45%,#f3dca100 72%);opacity:0;animation:rs-dust var(--t) var(--d) linear infinite}
/* gate (closed curtains) */
.gate{position:fixed;inset:0;z-index:100;overflow:hidden;background:#1d0307;font-family:var(--bf)}
.gate.gone{display:none}
.gate .g-stage{position:absolute;inset:0;transform-origin:50% 28%}
.gate.open .g-stage{animation:rs-push 3.4s cubic-bezier(.5,0,.2,1) .5s forwards}
.g-panel{position:absolute;top:0;bottom:0;width:50.6%;z-index:8;background:linear-gradient(90deg,#0008,transparent 12%,transparent 88%,#0008),repeating-linear-gradient(90deg,#3a050d 0,#7d1222 16px,#c42a40 28px,#8a1528 40px,#3a050d 62px);transition:transform 2.5s cubic-bezier(.7,0,.2,1) .15s}
.g-panel:after{content:'';position:absolute;top:0;bottom:0;width:6px;background:linear-gradient(90deg,#8a6a2a,#f3dca1,#a8802f)}
.g-panel.gl{left:0;box-shadow:8px 0 30px #000a}.g-panel.gl:after{right:0}
.g-panel.gr{right:0;box-shadow:-8px 0 30px #000a}.g-panel.gr:after{left:0}
.g-val{position:absolute;left:0;right:0;top:0;height:60px;z-index:10;background:linear-gradient(#f3dca1,#c9a050 42%,#8a6a2a 46%,#5a0c1a 47%);border-bottom:3px solid var(--gold);box-shadow:0 8px 20px #000a;transition:transform 1.2s ease 1.9s}
.g-val:after{content:'';position:absolute;left:0;right:0;bottom:-16px;height:16px;background:radial-gradient(circle at 50% 0,#7d1222 15px,transparent 16px) 0 0/40px 16px repeat-x;filter:drop-shadow(0 3px 3px #0008)}
.gate.open .g-panel.gl{transform:translateX(-102%) scaleX(.9)}.gate.open .g-panel.gr{transform:translateX(102%) scaleX(.9)}
.gate.open .g-val{transform:translateY(-130%)}
.gate.open{animation:rs-gone 1s ease 3s forwards}
.g-center{position:absolute;inset:0;z-index:12;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;transition:opacity .6s,transform .6s}
.gate.open .g-center{opacity:0;transform:scale(.94);pointer-events:none}
.g-hit{all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:20px;padding:34px 44px}
.g-hit:focus-visible .g-tap{text-decoration:underline;text-underline-offset:8px}
.g-ring{width:64px;height:64px;border-radius:50%;border:1.5px solid #f3dca1cc;position:relative;box-shadow:0 0 0 0 #f3dca155;animation:rs-ring 2.4s ease-out infinite}
.g-ring:after{content:'';position:absolute;inset:23px;border-radius:50%;background:#f3dca1;opacity:.85}
.g-tap{font:400 clamp(30px,8.4vw,44px)/1.1 var(--nf);color:#f3dca1;text-shadow:0 2px 14px #000c}
.g-orn{width:min(60vw,240px);height:12px;opacity:.9}
.g-orn:before{content:'';display:block;height:1px;margin-top:6px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
/* hero */
.hero{position:relative;min-height:100vh;min-height:100svh;display:flex;justify-content:center;overflow:hidden}
.hero .stage-bg{z-index:0}
.hero-in{position:relative;z-index:8;width:min(100%,560px);padding:min(60vw,290px) 26px 74px;text-align:center;display:flex;flex-direction:column;align-items:center}
.frame-line{position:absolute;inset:12px;border:1px solid #d9b46a55;border-radius:6px;z-index:7;pointer-events:none}
.bism{font:400 clamp(24px,7vw,34px)/1.6 AtelierAmiri,Amiri,'Noto Naskh Arabic',serif;color:var(--gold2);margin:0 0 4px;direction:rtl;text-shadow:0 2px 12px #000a}
.orn-line{display:flex;align-items:center;gap:10px;width:min(58vw,230px);margin:6px 0 14px;color:var(--gold)}
.orn-line:before,.orn-line:after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--gold))}.orn-line:after{transform:scaleX(-1)}
.orn-line i{width:7px;height:7px;transform:rotate(45deg);background:var(--gold)}
.intro{font:600 11px/1.9 Arial,sans-serif;letter-spacing:3.2px;text-transform:uppercase;color:#f8ecd6;max-width:420px;margin:0 0 20px;opacity:.95}
.lbl{font:600 10px/1.5 Arial,sans-serif;letter-spacing:3.5px;text-transform:uppercase;color:var(--gold);margin:14px 0 2px}
.nm{font:400 clamp(48px,15vw,82px)/1.08 var(--nf);color:#fff3d6;margin:2px 0;text-shadow:0 3px 22px #000b,0 0 30px #d9b46a2e;overflow-wrap:anywhere;max-width:100%}
.par{font:italic 400 17px/1.5 var(--bf);color:#f1dec0;margin:0 0 4px;max-width:420px;overflow-wrap:anywhere}
.amp{font:400 clamp(34px,10vw,52px)/1 var(--nf);color:var(--gold);margin:6px 0 2px}
.msg{font:italic 400 clamp(17px,4.6vw,20px)/1.8 var(--bf);color:#f8ecd6;max-width:430px;margin:24px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}
.scr{margin-top:30px;font:600 10px Arial,sans-serif;letter-spacing:5px;color:var(--gold);display:flex;flex-direction:column;align-items:center;gap:10px;text-transform:uppercase}
.scr:after{content:'';width:1px;height:42px;background:linear-gradient(var(--gold),transparent);animation:rs-line 2s ease-in-out infinite}
body.rs-wait .hv{opacity:0}
body:not(.rs-wait) .hv{animation:rs-up .95s cubic-bezier(.2,.7,.2,1) var(--d,0s) both}
/* paper sections */
.paper{position:relative;background:var(--paper);color:var(--ink);text-align:center;padding:78px 22px 82px;overflow:hidden;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .33 0 0 0 0 .2 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}
.paper.alt{background-color:var(--paper2)}
.gw{position:absolute;left:0;right:0;pointer-events:none;z-index:1}.gw.top{top:-6px}.gw.bot{bottom:-6px}
.garl{display:block;width:min(100%,520px);height:auto;margin:0 auto}
.inner{position:relative;max-width:520px;margin:0 auto}
.kick{font:700 11px/1.5 Arial,sans-serif;letter-spacing:4px;text-transform:uppercase;color:#8b1424;margin:0}
.ttl{font:400 clamp(40px,11.5vw,58px)/1.15 var(--nf);color:var(--ink);margin:10px 0 6px;overflow-wrap:anywhere}
.divider{display:flex;align-items:center;justify-content:center;gap:12px;margin:12px auto 26px;width:min(60vw,240px);color:#b8923f}
.divider:before,.divider:after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,#b8923f)}.divider:after{transform:scaleX(-1)}
.divider i{width:7px;height:7px;transform:rotate(45deg);background:#b8923f}
/* scratch */
.scratch{position:relative;width:100%;max-width:430px;height:230px;margin:6px auto 0;border-radius:16px;border:2px solid #c9a050;box-shadow:0 14px 34px #4a0d1744,inset 0 0 0 5px #efe0c6,inset 0 0 0 6px #c9a05088;overflow:hidden;background:radial-gradient(ellipse at 50% 30%,#8c1426,#4a0a16)}
.plate{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#fff3d6;background:radial-gradient(ellipse at 50% 20%,#a21a30 0,#5e0b19 70%)}
.plate .dw{font:700 11px Arial,sans-serif;letter-spacing:5px;color:var(--gold2);text-transform:uppercase}
.plate .dd{font:400 76px/1 var(--nf);color:#fff3d6;text-shadow:0 3px 14px #0008}
.plate .dm{font:600 13px Arial,sans-serif;letter-spacing:4px;color:var(--gold2);text-transform:uppercase}
.plate .dt{font:italic 17px var(--bf);color:#f6e6c6;margin-top:4px}
#rs-foil{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab;transition:opacity .9s ease}
.scratch.done #rs-foil{opacity:0;pointer-events:none}
.tapreveal{all:unset;display:inline-block;margin-top:16px;cursor:pointer;font:600 11px Arial,sans-serif;letter-spacing:2.4px;color:#8b1424;text-decoration:underline;text-underline-offset:4px;text-transform:uppercase}
.tapreveal:focus-visible{outline:2px solid #8b1424;outline-offset:4px}
.scratch.done~.tapreveal{display:none}
.cd{display:flex;justify-content:center;gap:10px;margin-top:22px;opacity:0;transform:translateY(10px);transition:opacity .8s ease .5s,transform .8s ease .5s}
.scratch.done~.cd,.cd.on{opacity:1;transform:none}
.cd div{min-width:64px;padding:10px 4px 8px;border:1px solid #b8923f77;border-radius:10px;background:#fff6e2aa}
.cd b{display:block;font:400 30px/1.1 var(--nf);color:var(--red)}
.cd small{font:700 9px Arial,sans-serif;letter-spacing:2.4px;color:#8b6a2a;text-transform:uppercase}
#rs-burst{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:3}
#rs-burst i{position:absolute;left:50%;top:50%;width:var(--w);height:calc(var(--w)*1.6);border-radius:80% 0 80% 0;background:linear-gradient(135deg,#e0283f,#8a1020);opacity:0;animation:rs-burst 1.7s ease-out var(--d) forwards}
/* slider */
.slider{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px calc(50% - min(39vw,170px)) 18px;margin:0 -22px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.slider::-webkit-scrollbar{display:none}
.slide{flex:0 0 min(78vw,340px);aspect-ratio:3/4;scroll-snap-align:center;border-radius:200px 200px 18px 18px;overflow:hidden;position:relative;border:3px solid #fff6e2;box-shadow:0 14px 34px #4a0d1755,0 0 0 1px #c9a050;background:#d8c29c;cursor:zoom-in;transition:transform .5s ease}
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
.tl-row:before{content:'';position:absolute;left:108px;top:22px;width:9px;height:9px;border-radius:50%;background:#8b1424;box-shadow:0 0 0 4px #efe0c6,0 0 0 5px #b8923f;animation:rs-pulse 2.6s ease-in-out infinite}
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
.rs-prev [data-rs]{cursor:pointer;border-radius:4px;transition:outline-color .2s}
.rs-prev [data-rs]:hover{outline:1px dashed #f3dca1;outline-offset:3px}
.rs-prev .slide{cursor:pointer}
@keyframes rs-sway{0%,100%{transform:translateX(-50%) rotate(-1.1deg)}50%{transform:translateX(-50%) rotate(1.1deg)}}
@keyframes rs-flick{0%,100%{transform:scale(1,1) rotate(0)}30%{transform:scale(.9,1.12) rotate(-3deg)}60%{transform:scale(1.06,.94) rotate(2deg)}}
@keyframes rs-glow{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes rs-twinkle{0%,100%{opacity:.78;transform:scale(1)}45%{opacity:1;transform:scale(1.28)}}
@keyframes rs-dust{0%{transform:translate3d(0,0,0) scale(.6);opacity:0}15%{opacity:.9}100%{transform:translate3d(24px,-92vh,0) scale(1.1);opacity:0}}
@keyframes rs-ring{0%{box-shadow:0 0 0 0 #f3dca177}100%{box-shadow:0 0 0 22px #f3dca100}}
@keyframes rs-push{0%{transform:scale(1);opacity:1}70%{opacity:1}100%{transform:scale(1.5) translateY(4%);opacity:0}}
@keyframes rs-gone{to{opacity:0;visibility:hidden}}
@keyframes rs-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@keyframes rs-line{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
@keyframes rs-pulse{0%,100%{box-shadow:0 0 0 4px #efe0c6,0 0 0 5px #b8923f}50%{box-shadow:0 0 0 4px #efe0c6,0 0 0 9px #b8923f55}}
@keyframes rs-burst{0%{opacity:0;transform:translate(0,0) rotate(0) scale(.4)}12%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r)) scale(1)}}
@media(max-width:380px){.tl:before{left:96px}.tl-row{grid-template-columns:82px 1fr;gap:30px}.tl-row:before{left:92px}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}.rs-js .rv{opacity:1;transform:none}.dust{display:none}.gate.open{visibility:hidden}}
@media print{.gate,.mbtn,.dust{display:none!important}body.rs-locked{overflow:visible;height:auto}.rs-js .rv{opacity:1;transform:none}}
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
 const hero=`<header class="hero" id="top">${stageBack('')}<div class="frame-line"></div><div class="hero-in">
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
 </div></header>`;
 const w=m.w;
 const dateSec=`<section class="paper" id="date"><div class="gw top">${garland()}</div><div class="inner">
 ${ed('rsDateKicker','p','kick rv',esc(m.dateKick))}${ed('rsDateTitle','h2','ttl rv',esc(m.dateTitle),' style="--d:.1s"')}
 <div class="divider rv" style="--d:.15s"><i></i></div>
 <div class="scratch rv" id="rs-scratch" style="--d:.2s"><div class="plate">${w?`<span class="dw">${esc(w.day)}</span><span class="dd">${esc(w.date)}</span><span class="dm">${esc(w.month)} ${esc(w.year)}</span>${m.timeText?`<span class="dt">${esc(m.timeText)}</span>`:''}`:`<span class="dm">Date to be announced</span>`}</div><div id="rs-burst"></div><canvas id="rs-foil" aria-label="Scratch to reveal the date"></canvas></div>
 <button type="button" class="tapreveal" id="rs-tap">Or tap here to reveal</button>
 ${m.dateIso?`<div class="cd" id="rs-cd"><div><b id="cd-d">0</b><small>Days</small></div><div><b id="cd-h">0</b><small>Hours</small></div><div><b id="cd-m">0</b><small>Min</small></div><div><b id="cd-s">0</b><small>Sec</small></div></div>`:''}
 </div><div class="gw bot">${garland()}</div></section>`;
 const slides=m.photos.map((src,i)=>`<div class="slide" data-i="${i}"><img src="${esc(src)}" alt="Wedding photo ${i+1}" loading="lazy"></div>`).join('');
 const storySec=m.photos.length?`<section class="paper alt" id="story"><div class="inner">
 ${ed('rsStoryKicker','p','kick rv',esc(m.storyKick))}${ed('rsStoryTitle','h2','ttl rv',esc(m.storyTitle),' style="--d:.1s"')}
 <div class="divider rv"><i></i></div></div>
 <div class="slider rv" id="rs-slider" style="--d:.15s">${slides}</div>${m.photos.length>1?`<div class="dots">${m.photos.map((_,i)=>`<b${i?'':' class="on"'}></b>`).join('')}</div>`:''}</section>`:'';
 const tl=m.schedule.length?`<section class="paper" id="day"><div class="gw top">${garland()}</div><div class="inner">
 ${ed('rsDayKicker','p','kick rv',esc(m.dayKick))}${ed('rsDayTitle','h2','ttl rv',esc(m.dayTitle),' style="--d:.1s"')}
 <div class="divider rv"><i></i></div>
 <div class="tl" data-rs="schedule">${m.schedule.map((s,i)=>`<div class="tl-row rv" style="--d:${(i*.1).toFixed(1)}s"><div class="tl-t">${esc(s.time||'')}</div><div><p class="tl-n">${esc(s.title)}</p>${s.detail?`<p class="tl-d">${esc(s.detail)}</p>`:''}</div></div>`).join('')}</div>
 </div></section>`:'';
 const cards=m.events.length?`<section class="paper alt" id="events"><div class="inner">
 ${ed('rsEventsTitle','h2','ttl rv',esc(m.evTitle))}<div class="divider rv"><i></i></div>
 <div class="cards" data-rs="eventsText">${m.events.map((e,i)=>`<article class="ecard rv" style="--d:${(i*.12).toFixed(2)}s"><h3>${esc(e.title)}</h3>${e.date?`<div class="ed">${esc(e.date)}</div>`:''}${e.place?`<p class="ep">${esc(e.place)}</p>`:''}${e.map?`<a class="mapbtn" href="${esc(e.map)}" target="_blank" rel="noopener noreferrer">View on Google Maps</a>`:''}</article>`).join('')}</div>
 </div></section>`:'';
 const end=`<section class="paper" id="with-love"><div class="gw top">${garland()}</div><div class="inner" style="padding-top:20px">
 ${m.family?ed('family','p','fam rv',esc(m.family)):''}
 ${m.rsvp?`<a class="rsvp rv" href="${esc(m.rsvp)}" target="_blank" rel="noopener noreferrer">RSVP</a>`:''}
 ${ed('rsClosing','p','close rv',esc(m.closing),' style="--d:.1s"')}
 <div class="divider rv"><i></i></div>
 <p class="sign rv" data-rs="name1">${esc(m.n1)} &amp; ${esc(m.n2)}</p>
 ${m.from?ed('wishesFrom','p','small rv',esc(m.from)):''}
 </div></section><div class="credit">Made with Mubiey Studio</div>`;
 const gate=m.gate?`<div id="rs-gate" class="gate" role="dialog" aria-modal="true" aria-label="Open the invitation"><div class="g-stage">${stageBack('full')}</div><div class="g-panel gl"></div><div class="g-panel gr"></div><div class="g-val"></div><div class="g-center"><button type="button" class="g-hit" id="rs-open"><span class="g-ring"></span><span class="g-tap">${esc(m.open)}</span><span class="g-orn"></span></button></div></div>`:'';
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
/* opening ceremony */
const gate=$('#rs-gate');
if(gate){
 document.body.classList.add('rs-wait','rs-locked');
 const go=()=>{
  if(gate.classList.contains('open'))return;
  if(R.autoplay)play();
  gate.classList.add('open');
  setTimeout(()=>document.body.classList.remove('rs-wait'),reduce?50:2300);
  setTimeout(()=>{gate.classList.add('gone');document.body.classList.remove('rs-locked');scrollTo(0,0)},reduce?200:4100);
 };
 const hit=$('#rs-open');hit.onclick=go;
}
/* scroll reveal */
const rv=$$('.rv');
if('IntersectionObserver' in window&&!R.prev){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});rv.forEach(n=>io.observe(n))}else rv.forEach(n=>n.classList.add('in'));
/* scratch to reveal */
const sc=$('#rs-scratch'),cv=$('#rs-foil');
function burst(){const b=$('#rs-burst');if(!b||reduce)return;b.innerHTML='';for(let i=0;i<30;i++){const a=Math.random()*6.283,r=70+Math.random()*150,n=document.createElement('i');n.style.cssText='--w:'+(8+Math.random()*8)+'px;--dx:'+Math.cos(a)*r+'px;--dy:'+(Math.sin(a)*r-40)+'px;--r:'+(Math.random()*540)+'deg;--d:'+(Math.random()*.25)+'s';b.append(n)}setTimeout(()=>b.innerHTML='',2200)}
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
 const rt={prev:m.prev,autoplay:m.autoplay,dateIso:m.dateIso};
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>${esc(m.n1)} &amp; ${esc(m.n2)} — Wedding invitation</title><script>document.documentElement.classList.add('rs-js')<\/script><style>${fonts}${CSS(m)}</style><noscript><style>.gate{display:none}body.rs-locked{overflow:auto}.rv{opacity:1!important;transform:none!important}</style></noscript></head><body class="${m.gate?'rs-locked rs-wait':''}${m.prev?' rs-prev':''}">${body(m)}<script>window.RS=${json(rt)};<\/script><script>${SCRIPT.replace(/<\/script/gi,'<\\/script')}<\/script></body></html>`;
}
invitationDocument=function(data){return data&&data.template===TEMPLATE?render(data):baseDocument.apply(this,arguments)};
})();
