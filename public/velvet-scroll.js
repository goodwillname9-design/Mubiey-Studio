/* 777 / HEAVY LUXURY · Envelope Scroll Story (template ids: 777, heavy-luxury; legacy id velvet-nikah-scroll still works)
   777 = envelope -> card -> details page with SCRATCH-TO-REVEAL date -> blessing page (the four-page reference flow).
   heavy-luxury = same plus a separate save-the-date calendar page with the scratch.
   Sealed burgundy envelope -> tap -> the letter slides out and fills the screen -> pages scroll one by one:
   verse page, blessing page, save-the-date calendar with a SCRATCH-TO-REVEAL date, optional programme and
   gallery pages, final details page, then countdown / directions / RSVP.
   All artwork is original CSS/SVG. Every text is editable by the owner; guests see no editing controls.
   Layered on invitationDocument() like the other templates, so nothing existing is replaced. */
'use strict';
(()=>{
if(typeof invitationDocument!=='function')return;
const VELVET='heavy-luxury',LEGACY='velvet-nikah-scroll',T777='777';
const T=(art,v)=>Object.assign({art},v);
const THEMES={
 '777':T('777',{label:'777 · Burgundy',ink:'#7a1426',ink2:'#5a1020',dark:'#3f1620',mut:'#6b3a3a',mut2:'#5a2a2e',cap:'#4a1722',btn1:'#8a1428',btn2:'#5a0c1a',line:'#8a1a2e66',line2:'#8a1a2e44',bg:'#1f060d',bg1:'#5f1226',bg2:'#4c0e1d',p1:'#e0283f',p2:'#8a1020',box:'#2a050c88'}),
 '111':T('111',{label:'111 · Emerald',ink:'#0f5a43',ink2:'#0b3f30',dark:'#0a2f25',mut:'#3a5a4e',mut2:'#2d4a3f',cap:'#123a2e',btn1:'#12684e',btn2:'#07382a',line:'#0f5a4366',line2:'#0f5a4344',bg:'#04140e',bg1:'#0d4a37',bg2:'#0a3a2b',p1:'#2fbf8a',p2:'#0e6b4d',box:'#02100a88'}),
 '222':T('222',{label:'222 · Midnight',ink:'#1d3a78',ink2:'#14295a',dark:'#101e40',mut:'#3a4a6e',mut2:'#2d3b5e',cap:'#172447',btn1:'#24478f',btn2:'#10224e',line:'#1d3a7866',line2:'#1d3a7844',bg:'#060b1c',bg1:'#14275a',bg2:'#0e1c42',p1:'#6f8fe0',p2:'#1d3a78',box:'#040a1c88'}),
 '333':T('333',{label:'333 · Royal Purple',ink:'#5a2a7e',ink2:'#421d5e',dark:'#2f1444',mut:'#5a4468',mut2:'#4a3558',cap:'#3a1f50',btn1:'#6a309a',btn2:'#3a1656',line:'#5a2a7e66',line2:'#5a2a7e44',bg:'#12061e',bg1:'#3a1560',bg2:'#2a0f48',p1:'#b57ae0',p2:'#5a2a7e',box:'#0e041a88'}),
 '444':T('444',{label:'444 · Noir',ink:'#2b2b30',ink2:'#1e1e22',dark:'#141416',mut:'#55555c',mut2:'#46464c',cap:'#26262a',btn1:'#333339',btn2:'#141416',line:'#2b2b3066',line2:'#2b2b3044',bg:'#0a0a0c',bg1:'#26262c',bg2:'#1a1a1e',p1:'#d8d8e0',p2:'#6a6a72',box:'#05050788'})
};
const themeVars=t=>':root{'+['ink','ink2','dark','mut','mut2','cap','btn1','btn2','line','line2','bg','bg1','bg2','p1','p2','box'].map(k=>`--${k}:${t[k]}`).join(';')+'}';
/* Arabic fonts: Amiri ships with the project; the others are optional files in assets/fonts/ar/ (see scripts/get-arabic-fonts.ps1) */
const AR_KEYS=['amiri','ruqaa','kufi','nastaliq','lateef','scheherazade','katibeh','mirza','rakkas','lalezar'];
const AR_TUNE={amiri:[1,1.7],ruqaa:[1,1.95],kufi:[.92,1.6],nastaliq:[.85,2.5],lateef:[1.15,1.7],scheherazade:[.95,2],katibeh:[1.05,1.6],mirza:[1,1.8],rakkas:[.9,1.7],lalezar:[.9,1.6]};
const arData={};let arWanted='amiri';
async function arLoad(key){if(!AR_KEYS.includes(key)||key==='amiri'||arData[key]!==undefined)return;try{const r=await fetch(location.origin+'/assets/fonts/ar/'+key+'.ttf');if(!r.ok)throw 0;const b=await r.blob();arData[key]=await new Promise((res,rej)=>{const f=new FileReader();f.onload=()=>res(f.result);f.onerror=rej;f.readAsDataURL(b)})}catch{arData[key]=null}}
if(typeof window!=='undefined'){window.vnLoadArabicFont=arLoad;window.vnArabicFontKeys=AR_KEYS}
if(typeof atelierFontsReady==='function'){const baseReady=atelierFontsReady;atelierFontsReady=async function(){const r=await baseReady.apply(this,arguments);const sel=typeof document!=='undefined'&&document.getElementById('arabicFont');await arLoad((sel&&sel.value)||arWanted);return r}}
if(typeof Studio==='object'&&Studio&&typeof Studio.api==='function'){const o=Studio.api;Studio.api=function(path,...rest){const pr=o.call(this,path,...rest);try{if(typeof path==='string'&&/^\/api\/invitations\/[a-f0-9-]{36}$/.test(path))pr.then(d=>{if(d&&d.arabicFont)arWanted=String(d.arabicFont)}).catch(()=>{})}catch{}return pr}}
const arCSS=key=>{const k=AR_KEYS.includes(key)?key:'amiri',[sc,lh]=AR_TUNE[k],has=k!=='amiri'&&arData[k];return (has?`@font-face{font-family:AtelierArX;font-weight:100 900;src:url(${arData[k]})}`:'')+`:root{--arf:${has?'AtelierArX,':''}AtelierAmiri,Amiri,'Traditional Arabic',serif;--ars:${has?sc:1};--arl:${has?lh:1.7}}`};
const baseDocument=invitationDocument;
const MONTHS=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const DAYS=['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
const DEFAULTS={
 verseArabic:'وَخَلَقْنَاكُمْ أَزْوَاجًا',verse:'And we created you in pairs',
 blessingArabic:'بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
 blessing:'May Allah bless you both, shower His blessings upon you, and bring you together in goodness.',
 bismillahArabic:'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',bismillah:'In the name of Allah, the most gracious, the most merciful.',
 heading:'Dawat-e-Nikah',message:'Cordially invite you all to the wedding ceremony of',compliments:'With best compliments from our family',rsvpText:'R.S.V.P\nAll family members, relatives and friends'
};
const e=s=>Studio.escape(s);
const lines=s=>e(s).replace(/\n/g,'<br>');
const httpsLink=v=>{try{const u=new URL(v);return u.protocol==='https:'?u.href:''}catch{return ''}};
const mapLink=v=>{try{const u=new URL(v);return u.protocol==='https:'&&['google.com','www.google.com','maps.google.com','maps.app.goo.gl','goo.gl','maps.apple.com'].includes(u.hostname)?u.href:''}catch{return ''}};
/* ---- two venues, each with its own directions button (all story templates) ---- */
const vLbl=(d,k,def)=>{const v=typeof d[k]==='string'?d[k].trim():'';return (v||def).toUpperCase()};
const venueSide=(data,pre,which)=>{
 /* which: 'groom' | 'reception' — one location per page only */
 const side=(nameK,addrK,mapK,lblK,lblDef)=>{
  const name=(data[nameK]||'').trim(),addr=(data[addrK]||'').trim(),url=mapLink(data[mapK]||'');
  if(!name&&!addr&&!url)return null;
  const label=vLbl(data,lblK,lblDef),shortLbl=label.replace(/\s*(VENUE|SIDE)$/,'')||label;
  return `<div class="vp-card" data-edit="${nameK}"><div class="vp-txt"><p class="vp-lbl">${e(label)}</p>${name?`<p class="vp-name">${e(name)}</p>`:''}${addr?`<p class="vp-addr" data-edit="${addrK}">${lines(addr)}</p>`:''}</div>${url?`<a class="${pre}-link vp-btn" href="${e(url)}" target="_blank" rel="noopener noreferrer" aria-label="${e(shortLbl)} directions">DIRECTIONS ↗</a>`:''}</div>`};
 if(which==='reception'){
  const c=side('venue','address','mapUrl','venueLabel','RECEPTION');
  return `<div class="vp vp-stack">${c||`<div class="vp-card" data-edit="venue"><div class="vp-txt"><p class="vp-lbl">${e(vLbl(data,'venueLabel','RECEPTION'))}</p><p class="vp-name">To be announced</p></div></div>`}</div>`;
 }
 const c=side('venueGroom','addressGroom','mapUrlGroom','venueGroomLabel','GROOM VENUE / PARTY');
 return `<div class="vp vp-stack">${c||`<div class="vp-card" data-edit="venueGroom"><div class="vp-txt"><p class="vp-lbl">${e(vLbl(data,'venueGroomLabel','GROOM VENUE / PARTY'))}</p><p class="vp-name">To be announced</p></div></div>`}</div>`;
};
/* venuePair = groom only on this page; reception goes on the NEXT page */
const venuePair=(data,pre)=>venueSide(data,pre,'groom');
const venueReception=(data,pre)=>venueSide(data,pre,'reception');
<<<<<<< HEAD
/* reception date/time block (fills the empty middle of the Reception page) */
const recDate=(data,pre)=>{
 const g=k=>typeof data[k]==='string'?data[k].trim():'',d=g('receptionDate'),t=g('receptionTime'),n=g('receptionNames');
 return `<div class="rcp-dt" data-edit="receptionDate">${n?`<div class="rcp-n" data-edit="receptionNames">${lines(n)}</div>`:''}<i class="rcp-on">${d||t?'ON':'DATE'}</i>${d?`<div class="rcp-d">${lines(d)}</div>`:`<div class="rcp-d${t?'':' rcp-tba'}">${t?'':'To be announced'}</div>`}${t?`<div class="rcp-t" data-edit="receptionTime">${lines(t)}</div>`:''}</div>`;
};
const RCPCSS=`.rcp-dt{display:flex;flex-direction:column;align-items:center;gap:1.4cqw;text-align:center;width:100%;margin:0}
.rcp-n{font:400 6cqw/1.15 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:var(--dark,#6b0f24);text-wrap:balance}
.rcp-on{font:italic 2.8cqw/1 AtelierSerif,Georgia,serif;letter-spacing:.5cqw;color:var(--mut2,#8a5a64)}
.rcp-d{font:400 7.6cqw/1.15 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:var(--dark,#6b0f24);text-wrap:balance}
.rcp-d.rcp-tba{font-size:5.4cqw;opacity:.85}
.rcp-t{font:600 2.3cqw/1.5 Arial,sans-serif;letter-spacing:.5cqw;text-transform:uppercase;color:var(--cap,#7a3a46)}
.rcp-dt:before,.rcp-dt:after{content:'';width:22cqw;height:1px;background:linear-gradient(90deg,transparent,#b0864a,transparent)}`;
=======
>>>>>>> d5b0a46e1e7988217002f4a63a3690eeb9373b21
const receptionPageHTML=(data,pre,wrap)=>{
 const body=venueReception(data,pre);
 if(typeof wrap==='function')return wrap(body);
 return body;
};
const VPCSS=`
.vp,.vp-stack{display:flex;flex-direction:column;gap:2.2cqw;width:100%;margin:0;text-align:left;box-sizing:border-box}
.vp-card{display:flex;align-items:center;justify-content:space-between;gap:2cqw;padding:2cqw 2.4cqw;border:1px solid #8a6a4a66;border-radius:2.4cqw;background:#ffffff26;box-sizing:border-box;width:100%}
.vp-stack .vp-card{flex-direction:column;align-items:stretch;text-align:center;gap:1.2cqw}
.vp-stack .vp-txt{text-align:center}
.vp-stack .vp-btn{align-self:center}
.vp-txt{flex:1 1 0;min-width:0}
.vp-lbl{font:700 max(8px,1.9cqw)/1.35 Arial,sans-serif;letter-spacing:.3cqw;text-transform:uppercase;margin:0}
.vp-name{font:700 max(9px,2.2cqw)/1.35 Arial,sans-serif;letter-spacing:.15cqw;text-transform:uppercase;margin:.3cqw 0 0;overflow-wrap:anywhere}
.vp-addr{font:400 max(8.5px,2cqw)/1.35 Arial,sans-serif;letter-spacing:.1cqw;text-transform:uppercase;margin:.3cqw 0 0;opacity:.85;overflow-wrap:anywhere}
.vp-btn{flex:none;align-self:center;margin:0!important;justify-content:center;white-space:nowrap}
.a7-bot .vp,.a7-bot .vp-stack{flex-direction:column;gap:2cqw;align-items:stretch}
.a7-bot .vp-card{flex:1 1 0;flex-direction:column;align-items:stretch;justify-content:space-between;text-align:center;padding:1.4cqw 1.2cqw 1.6cqw;gap:1.2cqw;min-width:0;width:auto}
.a7-bot .vp-txt{flex:1 1 auto;text-align:center}
.a7-bot .vp-btn{align-self:center;min-height:max(30px,3.8cqw);padding:0 2cqw}
.w8-text .vp-btn,.bf-text .vp-btn{padding:0 2.4cqw;font-size:max(8.5px,2.4cqw);min-height:max(32px,7cqw)}
.w8-text .vp-lbl,.bf-text .vp-lbl{font-size:max(8px,2.3cqw)}.w8-text .vp-name,.bf-text .vp-name{font-size:max(9px,2.7cqw)}.w8-text .vp-addr,.bf-text .vp-addr{font-size:max(8.5px,2.4cqw)}
.bf-text .vp-card{border-color:#8d1f2d44}.bf-text .vp-lbl{color:#8d1f2d}
.j-cal .vp{width:min(92vw,520px);gap:10px}
.j-cal .vp-card{padding:10px 14px;gap:12px;border-radius:14px;border-color:#e9c98a55;background:#ffffff14}
.j-cal .vp-lbl{font-size:clamp(9px,2.4vw,12px);letter-spacing:.2em;color:#e9c98a}
.j-cal .vp-name{font-size:clamp(10px,2.8vw,13px);letter-spacing:.14em}
.j-cal .vp-addr{font-size:clamp(9px,2.5vw,12px);letter-spacing:.1em}
`;
const fontCSS=()=>{try{return typeof atelierFontCSS==='function'&&typeof atelierFontData==='object'&&atelierFontData.cormorant?atelierFontCSS(true):''}catch{return ''}};
const pick=(v,k)=>(typeof v==='string'&&v.trim())?v.trim():DEFAULTS[k];
function parseDate(s){const m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(s||'');if(!m)return null;const y=+m[1],mo=+m[2],d=+m[3],hh=+m[4],mm=+m[5];if(mo<1||mo>12||d<1||d>31)return null;return{y,mo,d,hh,mm,wd:new Date(Date.UTC(y,mo-1,d)).getUTCDay(),time:`${hh%12||12}:${String(mm).padStart(2,'0')} ${hh<12?'AM':'PM'}`}}
function calendar(p){
 if(!p)return '<p class="vn-note">The date will be announced soon.</p>';
 const first=new Date(Date.UTC(p.y,p.mo-1,1)).getUTCDay(),dim=new Date(Date.UTC(p.y,p.mo,0)).getUTCDate();
 let cells='';for(let i=0;i<first;i++)cells+='<span></span>';
 for(let d=1;d<=dim;d++)cells+=`<span class="vn-day${d===p.d?' vn-target':''}">${d}</span>`;
 return `<div class="vn-cal"><div class="vn-week">${['S','M','T','W','T','F','S'].map(x=>`<b>${x}</b>`).join('')}</div><div class="vn-grid">${cells}</div></div>`;
}
const rose=(id,a,b,c)=>{let petals='';for(let k=0;k<7;k++)petals+=`<ellipse cx="0" cy="-27" rx="19" ry="25" transform="rotate(${k*51.4})"/>`;let mid='';for(let k=0;k<5;k++)mid+=`<ellipse cx="0" cy="-14" rx="12" ry="16" transform="rotate(${k*72+20})"/>`;
 return `<radialGradient id="${id}g" cx="50%" cy="45%" r="62%"><stop offset="0" stop-color="${a}"/><stop offset=".62" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient><symbol id="${id}" viewBox="-60 -60 120 120"><g fill="url(#${id}g)" stroke="#00000055" stroke-width="1">${petals}${mid}<circle r="9"/><path d="M-7 0a7 7 0 1 1 7 7" fill="none" stroke="#ffffff44" stroke-width="1.6"/></g></symbol>`};
const bowSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 64"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9a1f38"/><stop offset="1" stop-color="#4a0916"/></linearGradient><radialGradient id="p" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#cdb99a"/></radialGradient></defs><path d="M60 26C44 6 10 4 6 18c-3 14 28 22 54 8z" fill="url(#a)" stroke="#2a050c" stroke-width="1.2"/><path d="M60 26C76 6 110 4 114 18c3 14-28 22-54 8z" fill="url(#a)" stroke="#2a050c" stroke-width="1.2"/><path d="M52 30L38 60l14-8 6 10zM68 30l14 30-14-8-6 10z" fill="url(#a)" stroke="#2a050c" stroke-width="1"/><rect x="50" y="18" width="20" height="16" rx="5" fill="#7a1228" stroke="#2a050c" stroke-width="1.2"/><circle cx="60" cy="48" r="5.5" fill="url(#p)" stroke="#8a7a5a" stroke-width=".6"/><path d="M60 34v8" stroke="#c9a050" stroke-width="1.2"/></svg>';
const starSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0C12.6 7 17 11.4 24 12C17 12.6 12.6 17 12 24C11.4 17 7 12.6 0 12C7 11.4 11.4 7 12 0Z" fill="#fff6d8"/></svg>';
const castleSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70"><g fill="#7a1426" fill-opacity=".62"><path d="M0 70V48h10v-8h4v8h6V30l-4-3v-9l8-8 8 8v9l-4 3v18h8V36h6V20l-5-4 11-16 11 16-5 4v16h6v12h8V30l-4-3v-9l8-8 8 8v9l-4 3v18h6v-8h4v8h10v22z"/></g><g fill="#f6e9d0" fill-opacity=".8"><rect x="66" y="24" width="3" height="7" rx="1.4"/><rect x="71" y="24" width="3" height="7" rx="1.4"/><rect x="68.5" y="42" width="3" height="8" rx="1.4"/><rect x="27" y="22" width="3" height="6" rx="1.4"/><rect x="110" y="22" width="3" height="6" rx="1.4"/></g></svg>';
const grainSvg='<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .42  0 0 0 0 .27  0 0 0 0 .16  0 0 0 .2 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>';
const vine=(flip)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 60"${flip?'':''}><g ${flip?'transform="translate(30 0) scale(-1 1)"':''} fill="#8a1a2e" fill-opacity=".62" stroke="#8a1a2e" stroke-opacity=".62" stroke-linecap="round"><path d="M15 0C4 15 26 15 15 30C4 45 26 45 15 60" fill="none" stroke-width="1.1"/><ellipse cx="8" cy="14" rx="4" ry="1.8" transform="rotate(-35 8 14)" stroke="none"/><ellipse cx="22" cy="22" rx="4" ry="1.8" transform="rotate(35 22 22)" stroke="none"/><ellipse cx="8" cy="44" rx="4" ry="1.8" transform="rotate(-35 8 44)" stroke="none"/><ellipse cx="22" cy="52" rx="4" ry="1.8" transform="rotate(35 22 52)" stroke="none"/><circle cx="15" cy="30" r="2.2" stroke="none"/><circle cx="15" cy="60" r="1.6" stroke="none"/><circle cx="15" cy="0" r="1.6" stroke="none"/></g></svg>`;
const uri=x=>'url("data:image/svg+xml,'+encodeURIComponent(x)+'")';
const cornerRoses='<svg class="vn-cr d" viewBox="-60 -60 120 120" aria-hidden="true"><use href="#vn-c"/></svg>'+'<i class="vn-shine" aria-hidden="true"></i>'+'<svg class="vn-cr a" viewBox="-60 -60 120 120" aria-hidden="true"><use href="#vn-r"/></svg><svg class="vn-cr b" viewBox="-60 -60 120 120" aria-hidden="true"><use href="#vn-c"/></svg><svg class="vn-cr c" viewBox="-60 -60 120 120" aria-hidden="true"><use href="#vn-r"/></svg>';
const defs=`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${rose('vn-r','#b3203a','#6e0d20','#34050f')}${rose('vn-c','#fff4df','#ecd2ac','#b88c5e')}</defs></svg>`;
const roses=`<div class="vn-roses" aria-hidden="true"><svg class="vn-rs a" viewBox="-60 -60 120 120"><use href="#vn-r"/></svg><svg class="vn-rs b" viewBox="-60 -60 120 120"><use href="#vn-c"/></svg><svg class="vn-rs c" viewBox="-60 -60 120 120"><use href="#vn-r"/></svg><svg class="vn-rs d" viewBox="-60 -60 120 120"><use href="#vn-c"/></svg><svg class="vn-rs f" viewBox="-60 -60 120 120"><use href="#vn-r"/></svg><svg class="vn-rs g" viewBox="-60 -60 120 120"><use href="#vn-c"/></svg></div>`;

const CSS=`
*{box-sizing:border-box}html{scroll-snap-type:y proximity;scroll-behavior:smooth}html.vn-lock,html.vn-lock body{overflow:hidden}
body{margin:0;color:#f4e6cc;background:var(--bg,#1f060d);font-family:AtelierSerif,'Cormorant Garamond',Georgia,serif}
.vn-bg{position:fixed;inset:0;z-index:-1;background:radial-gradient(circle at 15% 8%,var(--bg1,#5f1226),transparent 46%),radial-gradient(circle at 88% 92%,var(--bg2,#4c0e1d),transparent 50%),repeating-linear-gradient(45deg,#ffffff05 0 2px,transparent 2px 14px),var(--bg,#1f060d)}
.vn-page{min-height:100svh;display:flex;align-items:center;justify-content:center;padding:20px 0;position:relative;overflow:hidden;scroll-snap-align:center}
.vn-roses{position:absolute;inset:0;pointer-events:none;z-index:0}
.vn-rs{position:absolute;width:30vmin;height:30vmin;filter:drop-shadow(0 6px 10px #0008)}
.vn-rs.a{left:-9vmin;top:-8vmin;transform:rotate(15deg)}.vn-rs.b{left:-4vmin;top:10vmin;width:20vmin;height:20vmin;transform:rotate(-30deg)}
.vn-rs.c{right:-10vmin;top:-6vmin;transform:rotate(-20deg)}.vn-rs.d{right:-5vmin;bottom:-6vmin;width:34vmin;height:34vmin}
.vn-rs.f{left:-8vmin;bottom:-9vmin;width:34vmin;height:34vmin;transform:rotate(40deg)}.vn-rs.g{right:-3vmin;top:24vmin;width:18vmin;height:18vmin}
.vn-card{position:relative;z-index:1;container-type:inline-size;width:min(92vw,calc((100svh - 40px)*.58),440px);aspect-ratio:9/15.5;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:9cqw 9cqw;color:#7a1426;
 background:${uri(grainSvg)} 0 0/240px 240px,radial-gradient(ellipse at 50% 50%,transparent 52%,#c79f6a66 100%),radial-gradient(ellipse at 50% 28%,#fcf3e1,#f2e2c6 68%,#e4cba5);border-radius:40% 40% 2.5% 2.5%/9% 9% 2.5% 2.5%;box-shadow:0 18px 50px #000a,inset 0 0 0 1.6cqw #e9d3ad,inset 0 0 0 1.9cqw #b0864a}
.vn-card:before{content:'';position:absolute;inset:2.8cqw;border:1.1cqw dotted #b0864a99;border-radius:inherit;pointer-events:none;box-shadow:inset 0 0 0 1.5cqw #f4e6cb,inset 0 0 0 1.8cqw #8a1a2e44;background:${uri(vine(false))} left top/5cqw auto repeat-y,${uri(vine(true))} right top/5cqw auto repeat-y}
.vn-card:after{content:'';position:absolute;top:-6cqw;left:50%;width:34cqw;height:18cqw;margin-left:-17cqw;background:${uri(bowSvg)} center/contain no-repeat;filter:drop-shadow(0 3px 4px #0006);pointer-events:none;z-index:3}
.vn-cr{position:absolute;width:26cqw;height:26cqw;pointer-events:none;z-index:2;filter:drop-shadow(0 3px 5px #0007)}.vn-cr.a{left:-8cqw;top:18cqw;transform:rotate(20deg)}.vn-cr.b{right:-8cqw;bottom:22cqw;transform:rotate(-25deg);width:22cqw;height:22cqw}.vn-cr.c{left:-7cqw;bottom:-6cqw;transform:rotate(40deg)}
.vn-castle{width:46cqw;height:23cqw;margin-top:auto;background:${uri(castleSvg)} center bottom/contain no-repeat}.vn-amp{font:400 10cqw/1 AtelierAllura,AtelierParisienne,cursive;color:#8a1428;margin:1cqw 0}.vn-comp{font:italic 3.8cqw/1.5 AtelierSerif,Georgia,serif;color:#6b3a3a;margin:3cqw 0 0;border-top:1px solid #8a1a2e44;padding-top:2cqw;width:80%}
.vn-castle-bg{position:absolute;z-index:1;left:50%;top:5vh;width:min(92vw,480px);aspect-ratio:2/1;transform:translateX(-50%);opacity:.5;background:${uri(castleSvg.replace(/#7a1426/g,'#9a5a62').replace('fill-opacity=".62"','fill-opacity=".55"'))} center bottom/contain no-repeat}
.vn-ar{overflow-wrap:anywhere;font:400 8.4cqw/1.7 AtelierAmiri,Amiri,'Traditional Arabic',serif;color:#7a1426;margin:0}.vn-ar.sm{font-size:6.6cqw}
.vn-en{font:italic 4.3cqw/1.6 AtelierSerif,Georgia,serif;margin:2cqw 0;color:#6b3a3a;max-width:100%}
.vn-script{font-family:AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;font-weight:400;color:#7a1426;overflow-wrap:anywhere}
.vn-title{overflow-wrap:anywhere;word-break:break-word;font:400 10.5cqw/1.1 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;margin:4cqw 0;color:#3f1620}
.vn-mono{font:400 24cqw/1 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:#7a1426;margin:1cqw 0}
.vn-orn{width:36cqw;height:1px;background:linear-gradient(90deg,transparent,#b0864a,transparent);margin:3cqw auto;position:relative}.vn-orn:after{content:'◆';position:absolute;left:calc(50% - 2cqw);top:-2.4cqw;font-size:4cqw;color:#b0864a;background:#f6e9d0;width:4cqw;text-align:center}
.vn-small{font:600 2.7cqw/1.8 Arial,sans-serif;letter-spacing:.7cqw;text-transform:uppercase;color:#4a1722;margin:0}.vn-small.tiny{font-size:2.3cqw;font-weight:400}
.vn-names{font:400 13cqw/1.08 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:#8a1428;margin:1.5cqw 0;overflow-wrap:anywhere}.vn-with{font:italic 4cqw AtelierSerif,Georgia,serif;margin:0;color:#4a1722}
.vn-title-sm{overflow-wrap:anywhere;word-break:break-word;font:400 9.5cqw/1.15 AtelierAllura,AtelierParisienne,cursive;margin:2cqw 0 1cqw;color:#8a1428}
.vn-cal{width:84%;margin:2cqw auto 0;opacity:.28;transition:opacity 1.2s ease}.revealed .vn-cal{opacity:1}
.vn-week,.vn-grid{display:grid;grid-template-columns:repeat(7,1fr);text-align:center}.vn-week b{font:700 2.6cqw Arial,sans-serif;color:#8a1428;padding-bottom:1cqw}
.vn-day{font:4.2cqw/2 AtelierSerif,Georgia,serif;color:#4a1722;position:relative}
.vn-target:after{content:'';position:absolute;left:50%;top:50%;width:9cqw;height:9cqw;margin:-4.5cqw 0 0 -4.5cqw;border:.5cqw solid #b0152e;border-radius:50% 50% 45% 45%;transform:scale(0);opacity:0}
.revealed .vn-target{color:#b0152e;font-weight:700}.revealed .vn-target:after{animation:vn-pop .9s .5s cubic-bezier(.2,1.4,.4,1) forwards}
@keyframes vn-pop{to{transform:scale(1);opacity:1}}
.vn-scratchbox{position:relative;width:84%;aspect-ratio:3.1/1;margin:3cqw auto 0;border-radius:3cqw;overflow:hidden;box-shadow:inset 0 0 0 1px #b0864a,0 6px 16px #5a1a2a33;background:linear-gradient(#fff8ea,#f3e3c5)}
.vn-secret{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.vn-secret b{font:700 3cqw Arial,sans-serif;letter-spacing:.8cqw;color:#8a1428}.vn-secret span{font:400 7.2cqw/1.15 AtelierAllura,AtelierParisienne,cursive;color:#3f1620}.vn-secret small{font:600 2.8cqw Arial,sans-serif;letter-spacing:.7cqw;color:#4a1722}
#vn-scratch{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab;transition:opacity 1s ease}
.vn-skip{margin-top:2cqw;background:none;border:0;font:2.6cqw Arial,sans-serif;letter-spacing:.4cqw;color:#7a1426;text-decoration:underline;cursor:pointer;opacity:.8;min-height:11cqw}
.vn-note{font:italic 4cqw Georgia,serif;color:#6b3a3a}
.vn-link{display:inline-block;margin-top:2cqw;padding:2.6cqw 6cqw;border-radius:9cqw;background:linear-gradient(135deg,#8a1428,#5a0c1a);color:#f7e6c2;font:700 2.7cqw Arial,sans-serif;letter-spacing:.6cqw;text-decoration:none;min-height:11cqw;line-height:5cqw}
.vn-event{width:100%;border:1px solid #b0864a88;border-radius:2.2cqw;padding:2.6cqw 3cqw;margin:1.6cqw 0;background:linear-gradient(135deg,#fff8ec,#f3e6c8 55%,#f7ebd2);box-shadow:0 2px 10px #8a142822}.vn-event h3{font:600 6.2cqw AtelierAllura,cursive;color:#8a1428;margin:0;letter-spacing:.04em}.vn-event p{margin:.6cqw 0 0;font:3.8cqw/1.45 Georgia,serif;color:#4a1722;white-space:pre-wrap}.vn-event p:first-of-type{font-weight:700;color:#6a1020;letter-spacing:.08em;text-transform:uppercase;font-size:3.2cqw}
.vn-gallery{position:relative;z-index:1;display:grid;grid-template-columns:repeat(2,1fr);gap:14px;width:min(92vw,720px);padding:30px 0}.vn-gallery h2{grid-column:1/-1;text-align:center;font:400 clamp(34px,8vw,56px) AtelierAllura,cursive;margin:0;color:#f3dca1}
.vn-gallery img{width:100%;aspect-ratio:3/4;object-fit:cover;border:7px solid #f6e9d0;box-shadow:0 10px 26px #000a;cursor:zoom-in}.vn-gallery img:nth-child(odd){transform:rotate(-1.4deg)}.vn-gallery img:nth-child(even){transform:rotate(1.4deg)}
.vn-extra{position:relative;z-index:1;text-align:center;padding:36px 20px 90px;scroll-snap-align:start}
.vn-count{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:420px;margin:0 auto 26px}.vn-count div{border:1px solid #d9b46a66;border-radius:8px;padding:10px 2px;background:var(--box,#2a050c88)}.vn-count b{display:block;font:400 34px/1.2 Georgia,serif;color:#f3dca1}.vn-count small{font:9px Arial,sans-serif;letter-spacing:2px;color:#d9b46a}
.vn-gold{display:inline-block;margin:6px;padding:14px 26px;border-radius:30px;background:linear-gradient(135deg,#f3dca1,#c9a050);color:#3b0711;font:700 12px Arial,sans-serif;letter-spacing:2px;text-decoration:none;min-height:44px}
.vn-end{font:12px Arial,sans-serif;opacity:.65;margin-top:26px}
.vn-music{position:fixed;right:16px;bottom:16px;z-index:40;min-height:44px;border:1px solid #d9b46a;background:#3b0711;color:#f3dca1;padding:12px 17px;border-radius:30px;font:12px Arial,sans-serif;cursor:pointer;box-shadow:0 4px 16px #0006}
.vn-card{opacity:0;transform:translateY(7%) scale(.95);transition:opacity .9s ease,transform 1.1s cubic-bezier(.2,.7,.2,1)}
.vn-page.in .vn-card{opacity:1;transform:none}
.vn-page.in .vn-card>*{animation:vn-up .9s both}.vn-card>:nth-child(1){animation-delay:.1s!important}.vn-card>:nth-child(2){animation-delay:.22s!important}.vn-card>:nth-child(3){animation-delay:.34s!important}.vn-card>:nth-child(4){animation-delay:.46s!important}.vn-card>:nth-child(5){animation-delay:.58s!important}.vn-card>:nth-child(n+6){animation-delay:.7s!important}
@keyframes vn-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.vn-page.instant .vn-card,.vn-page.instant .vn-card>*{transition:none!important;animation:none!important}
.vn-card.vn-letter{opacity:1}.vn-letter>*{animation:none!important;opacity:1!important}
/* envelope */
.vn-cover{position:fixed;inset:0;z-index:80;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at 20% 10%,#5f1226,transparent 50%),radial-gradient(circle at 85% 90%,#4c0e1d,transparent 55%),#1f060d;transition:opacity .7s ease}
.vn-cover.fade{opacity:0}.vn-cover.gone{display:none}
.vn-env{position:relative;z-index:2;width:min(86vw,400px);aspect-ratio:1.18/1;perspective:1200px;transition:transform .6s ease}
.vn-env-back,.vn-env-front,.vn-flap{position:absolute;left:0;right:0}
.vn-env-back{top:0;bottom:0;border-radius:6px;background:linear-gradient(135deg,#5a0c1c,#3d0713);box-shadow:0 30px 60px #000a,inset 0 0 0 2px #a32a4066}
.vn-env-front{top:0;bottom:0;z-index:3;border-radius:6px;background:linear-gradient(160deg,#6e1427,#4a0b19);clip-path:polygon(0 0,50% 50%,100% 0,100% 100%,0 100%);transition:opacity .5s ease}
.vn-env-front:after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,#ffffff08 0 3px,transparent 3px 9px)}
.vn-flap{top:0;height:50%;z-index:4;transform-origin:50% 0;transition:transform .9s cubic-bezier(.5,0,.2,1);clip-path:polygon(0 0,100% 0,50% 100%);background:linear-gradient(180deg,#7a1a2f,#561020);backface-visibility:visible}
.vn-lace{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.vn-jewel{position:absolute;left:calc(50% - 3.4%);top:calc(100% - 8%);width:6.8%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff9aa8,#c0102e 45%,#5a0614);box-shadow:0 0 0 2px #e9c987,0 3px 6px #0008}
.vn-letter{position:absolute;z-index:2;left:15%;bottom:5%;width:70%;transform:translate(0,0) scale(.6);transition:transform 1.1s cubic-bezier(.4,0,.2,1)}
.vn-letter.top{z-index:6}
.vn-seal{position:absolute;z-index:5;left:50%;top:21%;transform:translate(-50%,-50%);width:23%;aspect-ratio:1;border-radius:50%;border:1px solid #e9c98766;background:radial-gradient(circle at 35% 30%,#8a1c32,#4a0b19);color:#f6e6c6;font:400 9cqw/1 AtelierAllura,AtelierParisienne,cursive;font-size:clamp(20px,7vw,34px);cursor:pointer;display:grid;place-items:center;box-shadow:0 0 0 0 #e9c98777;animation:vn-pulse 2.2s infinite;transition:opacity .4s}
.vn-seal:focus-visible{outline:3px solid #fff;outline-offset:4px}
@keyframes vn-pulse{70%{box-shadow:0 0 0 16px #e9c98700}100%{box-shadow:0 0 0 0 #e9c98700}}
.vn-tap{position:relative;z-index:2;margin-top:26px;font:11px Arial,sans-serif;letter-spacing:4px;color:#e9c987;text-transform:uppercase;transition:opacity .4s}
.vn-cover.opening .vn-flap{transform:rotateX(180deg);z-index:1}.vn-cover.opening .vn-seal,.vn-cover.opening .vn-tap{opacity:0;pointer-events:none;animation:none}
.vn-cover.reveal .vn-env-front{opacity:0}
@media(prefers-reduced-motion:reduce){.vn-card,.vn-page.in .vn-card>*{transition:none!important;animation:none!important;opacity:1;transform:none}.vn-cover{transition:opacity .2s}html{scroll-behavior:auto}.vn-seal{animation:none}.vn-rs{filter:none}}

/* ===== extra luxury motion ===== */
.vn-dust{position:fixed;inset:0;z-index:2;pointer-events:none;overflow:hidden}.vn-cover .vn-dust{position:absolute;z-index:3}
.vn-dust i{position:absolute;bottom:-12px;left:var(--x);width:var(--s);height:var(--s);border-radius:50%;background:radial-gradient(circle,#fff3c4,#d9b46a 55%,transparent 72%);opacity:0;animation:vn-rise var(--t) var(--d) linear infinite}
@keyframes vn-rise{0%{opacity:0;transform:translate3d(0,0,0)}12%{opacity:.8}88%{opacity:.45}100%{opacity:0;transform:translate3d(var(--dx),-108vh,0)}}
.vn-shine{position:absolute;inset:0;border-radius:inherit;overflow:hidden;pointer-events:none;z-index:4}
.vn-shine:before{content:'';position:absolute;top:-20%;bottom:-20%;left:-60%;width:38%;background:linear-gradient(100deg,transparent,#fff8e0d9,transparent);transform:skewX(-18deg);opacity:0}
.vn-page.in .vn-shine:before{animation:vn-sweep 1.7s .9s ease-out 1 forwards}.vn-page.instant .vn-shine:before,.vn-letter .vn-shine:before{animation:none!important}
@keyframes vn-sweep{0%{left:-60%;opacity:0}20%{opacity:1}100%{left:130%;opacity:0}}
.vn-page.in .vn-title,.vn-page.in .vn-names,.vn-page.in .vn-mono,.vn-page.in .vn-title-sm,.vn-page.in .vn-amp{animation:vn-up .9s both,vn-write 1.9s both}
@keyframes vn-write{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 -6% 0 -6%)}}
.vn-page.in .vn-orn{animation:vn-draw 1.3s .45s both}@keyframes vn-draw{from{width:0;opacity:0}to{width:36cqw;opacity:1}}
.vn-page.instant .vn-title,.vn-page.instant .vn-mono,.vn-page.instant .vn-orn,.vn-page.instant .vn-names{animation:none!important}
.vn-rs{animation:vn-sway 9s ease-in-out infinite alternate;translate:0 calc(var(--sy,0)*-.05px)}.vn-rs.b,.vn-rs.d{animation-duration:12s;animation-direction:alternate-reverse}
@keyframes vn-sway{from{rotate:0deg;scale:1}to{rotate:4deg;scale:1.05}}
.vn-seal:after{content:'';position:absolute;inset:0;border-radius:50%;background:linear-gradient(115deg,transparent 35%,#fff9 50%,transparent 65%) -160% 0/260% 100% no-repeat;animation:vn-shim 3.2s 1s infinite;pointer-events:none}@keyframes vn-shim{to{background-position:160% 0}}
.vn-env{animation:vn-float 5.5s ease-in-out infinite}@keyframes vn-float{50%{transform:translateY(-9px) rotateX(2.5deg)}}.vn-cover.opening .vn-env{animation:none}
.vn-env:before{content:'';position:absolute;left:8%;right:8%;bottom:-28px;height:26px;border-radius:50%;background:radial-gradient(ellipse,#000a,transparent 70%);animation:vn-shadow 5.5s ease-in-out infinite}@keyframes vn-shadow{50%{transform:scale(.88);opacity:.7}}
.vn-aura{position:absolute;z-index:1;left:50%;top:30%;width:170%;aspect-ratio:1;margin:-85% 0 0 -85%;pointer-events:none;opacity:0;background:radial-gradient(circle,#fff1c0b3,#e9bf6255 32%,transparent 62%);transition:opacity 1.3s ease .6s}.vn-cover.opening .vn-aura{opacity:1}
.vn-spark{position:absolute;z-index:7;left:50%;top:36%;width:7px;height:7px;margin:-3px;border-radius:50%;background:#fff0b8;box-shadow:0 0 12px 4px #f0c860;opacity:0;pointer-events:none}
.vn-cover.opening .vn-spark{animation:vn-burst 1.7s .95s ease-out forwards}@keyframes vn-burst{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(.2)}}
.vn-scratchbox{overflow:visible}.vn-secret,#vn-scratch{border-radius:3cqw}.vn-secret{overflow:hidden}
.vn-sparks i{position:absolute;left:50%;top:50%;width:6px;height:6px;margin:-3px;border-radius:50%;background:#ffe9a8;box-shadow:0 0 10px 3px #e9bf62;opacity:0;pointer-events:none;z-index:3}
.revealed .vn-sparks i{animation:vn-burst 1.3s ease-out forwards}.revealed .vn-secret{animation:vn-glow 1.8s ease-out 1}@keyframes vn-glow{0%{box-shadow:0 0 0 0 #ffe9a8}35%{box-shadow:0 0 38px 10px #ffe9a8aa}100%{box-shadow:0 0 0 0 #ffe9a800}}
.vn-shower{position:fixed;inset:0;z-index:70;pointer-events:none;overflow:hidden}
.vn-shower i{position:absolute;top:-30px;left:var(--x);width:var(--w);height:calc(var(--w)*1.6);border-radius:80% 0 80% 0;background:linear-gradient(135deg,var(--p1,#e0283f),var(--p2,#8a1020));opacity:0}.vn-shower i:nth-child(3n){background:linear-gradient(135deg,#fff4df,#d9b98c)}
.vn-shower.go i{animation:vn-fall2 var(--t) var(--d) ease-in forwards}@keyframes vn-fall2{0%{opacity:0;transform:translate3d(0,-30px,0) rotate(var(--r))}12%{opacity:.95}100%{opacity:.9;transform:translate3d(var(--dx),108vh,0) rotate(calc(var(--r) + 400deg))}}
.vn-progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:75;transform-origin:0 50%;transform:scaleX(0);background:linear-gradient(90deg,#8a6a2a,#f3dca1,#c9a050);box-shadow:0 0 10px #e9bf62aa;pointer-events:none}
@media(prefers-reduced-motion:reduce){.vn-dust,.vn-shower,.vn-spark,.vn-sparks,.vn-aura,.vn-progress{display:none!important}.vn-rs,.vn-env,.vn-env:before,.vn-seal:after,.vn-shine:before{animation:none!important}}

/* ===== 777 look: full-bleed pages, envelope scene ===== */
.vn-page.full{padding:0}
.vn-page.full .vn-card{width:min(100vw,560px);height:100svh;min-height:600px;aspect-ratio:auto;border-radius:0;padding:15cqw 10cqw 11cqw;box-shadow:0 0 70px #000c,inset 0 0 0 1.6cqw #e9d3ad,inset 0 0 0 1.9cqw #b0864a}
.vn-page.full .vn-card:before{inset:2.4cqw;border-radius:2cqw}.vn-page.full .vn-card:after{top:2cqw}
.vn-cr.d{right:-7cqw;top:-6cqw;width:24cqw;height:24cqw;transform:rotate(15deg)}
.vn-scratchbox.big{aspect-ratio:2.75/1;width:90%}.vn-scratchbox.big .vn-secret{padding:1cqw 0}
.vn-castle-bg{background:${uri(castleSvg.replace(/#7a1426/g,'#9a5a62').replace('fill-opacity=".62"','fill-opacity=".55"'))} center bottom/contain no-repeat,radial-gradient(circle at 80% 16%,#fff3c8 0 3.5%,#fff3c866 4.5%,transparent 15%),radial-gradient(circle at 14% 22%,#fff 0 1px,transparent 2px),radial-gradient(circle at 34% 10%,#fff 0 1px,transparent 2px),radial-gradient(circle at 58% 24%,#fff 0 1.2px,transparent 2.4px),radial-gradient(circle at 92% 40%,#fff 0 1px,transparent 2px),radial-gradient(circle at 24% 42%,#ffffffcc 0 1px,transparent 2px)}
.vn-bow-big{position:absolute;z-index:1;right:-9vmin;top:7vh;width:34vmin;aspect-ratio:2/1;transform:rotate(28deg);background:${uri(bowSvg)} center/contain no-repeat;filter:drop-shadow(0 6px 8px #000a);pointer-events:none}
.vn-pearls{position:absolute;z-index:1;right:3vw;top:34vh;bottom:5vh;width:13px;transform:rotate(7deg);background:radial-gradient(circle at 36% 30%,#fff,#d9cbb0 58%,#8c7c5c) 0 0/13px 13px repeat-y;filter:drop-shadow(0 2px 3px #0009);pointer-events:none}
.vn-env-back{box-shadow:0 30px 60px #000a,inset 0 0 0 1px #c9a05088,inset 0 0 0 2px #a32a4066}
.vn-seal{background:none!important;border:0!important;width:30%;font-size:clamp(34px,11.5vw,58px);color:#f3e4c4;text-shadow:0 2px 10px #000b,0 0 18px #e9c98755}
@media print{.vn-cover{display:none!important}.vn-dust,.vn-shower,.vn-progress{display:none!important}html.vn-lock,html.vn-lock body{overflow:visible}.vn-card{opacity:1;transform:none}.vn-page{break-inside:avoid}.vn-music{display:none}}`;

function pageCards(data,p,v777){
 const n1=data.name1||'Name one',n2=data.name2||'Name two';
 const mono=((typeof data.monogram==='string'&&data.monogram.trim())||((n1[0]||'')+(n2[0]||''))).slice(0,3);
 const verseAr=pick(data.verseArabic,'verseArabic'),verse=pick(data.verse,'verse'),blAr=pick(data.blessingArabic,'blessingArabic'),bl=pick(data.blessing,'blessing');
 const heading=pick(data.heading==='Together with our families'?'':data.heading,'heading');
 const wording=pick(data.message&&!/^With joy in our hearts/.test(data.message)?data.message:'','message');
 const map=mapLink(data.mapUrl||''),rsvp=httpsLink(data.rsvpUrl||'');
 const timeShown=(typeof data.timeText==='string'&&data.timeText.trim())||(p?p.time:'');
 const secret=p?`<b>${DAYS[p.wd]}</b><span>${p.d} ${MONTHS[p.mo-1].charAt(0)+MONTHS[p.mo-1].slice(1).toLowerCase()} ${p.y}</span><small>${e(timeShown)}</small>`:'<span>Date to be announced</span>';
 const card1=`<div class="vn-ar" data-edit="verseArabic" dir="rtl" lang="ar">${e(verseAr)}</div><p class="vn-en" data-edit="verse">${lines(verse)}</p><div class="vn-orn"></div><div class="vn-title" data-edit="heading">${e(heading)}</div><div class="vn-mono" data-edit="monogram">${e(mono)}</div><p class="vn-small tiny">${e(n1)} &amp; ${e(n2)}</p>${cornerRoses}`;
 const sched=(data.schedule||[]).filter(s=>s.title);
 const photos=(data.photos||[]).filter(s=>typeof s==='string'&&/^data:image\/(jpeg|png|webp);base64,|^\/media\//.test(s));
 const pages=[];
 /* 1 · first page (the letter that comes out of the envelope) */
 pages.push(`<section class="vn-page" id="vn-p1">${roses}<div class="vn-card" id="vn-card1">${card1}</div></section>`);
 /* 2 · save the date, scratch to reveal (not used by 777: its scratch is on the details page) */
 if(!v777)pages.push(`<section class="vn-page" id="vn-datepage">${roses}<div class="vn-card"><div class="vn-ar sm" dir="rtl" lang="ar">${e(DEFAULTS.bismillahArabic)}</div><p class="vn-en">“${e(DEFAULTS.bismillah)}”</p><div class="vn-title-sm">Save the date</div>${calendar(p)}<div class="vn-scratchbox" id="vn-scratchbox"><div class="vn-secret" data-edit="event-date">${secret}</div><canvas id="vn-scratch" aria-label="Scratch to reveal the wedding date"></canvas>${miniSparks}</div><button type="button" class="vn-skip" id="vn-reveal">Scratch to reveal · or tap here</button>${cornerRoses}</div></section>`);
 if(sched.length)pages.push(`<section class="vn-page">${roses}<div class="vn-card" style="justify-content:flex-start;padding-top:18cqw"><div class="vn-title-sm">Moments of the day</div><div class="vn-orn"></div><div style="width:100%" data-edit="schedule">${sched.map(s=>`<article class="vn-event"><h3>${e(s.title)}</h3><p>${e(s.time)}</p><p>${e(s.detail)}</p></article>`).join('')}</div>${cornerRoses}</div></section>`);
 if(photos.length)pages.push(`<section class="vn-page" id="vn-gallery-page">${roses}<div class="vn-gallery" data-edit="photos"><h2>${e(data.galleryTitle||'Our favourite memories')}</h2>${photos.map((s,i)=>`<img src="${e(s)}" alt="Wedding memory ${i+1}" loading="lazy">`).join('')}</div></section>`);
 /* 3 · details + directions */
 const dateBlock=p?`<p class="vn-small tiny" style="margin-top:2cqw">ON</p><p class="vn-small">${MONTHS[p.mo-1]}</p><p class="vn-small" style="font-size:3.6cqw;letter-spacing:.9cqw;border-top:1px solid #8a1a2e66;border-bottom:1px solid #8a1a2e66;padding:1cqw 3cqw;margin:1cqw 0">${DAYS[p.wd]} &nbsp;|&nbsp; <b style="font-size:7cqw;font-weight:400;font-family:Georgia,serif">${p.d}</b> &nbsp;|&nbsp; ${e(timeShown)}</p><p class="vn-small">${p.y}</p>`:'<p class="vn-small">Date to be announced</p>';
 const par=(v,f)=>(typeof v==='string'&&v.trim())?`<p class="vn-small tiny" data-edit="${f}" style="margin:0">${lines(v.trim())}</p>`:'';
 const dateArea=v777?`<div class="vn-scratchbox big" id="vn-scratchbox"><div class="vn-secret" data-edit="event-date">${dateBlock}</div><canvas id="vn-scratch" aria-label="Scratch to reveal the wedding date"></canvas>${miniSparks}</div><button type="button" class="vn-skip" id="vn-reveal">Scratch to reveal · or tap here</button>`:dateBlock;
 pages.push(`<section class="vn-page full" id="vn-final">${roses}<div class="vn-card">${(data.family||'').trim()?`<p class="vn-small" data-edit="family" style="margin:0 0 1cqw">${lines(data.family.trim())}</p>`:''}<p class="vn-small tiny" data-edit="message" style="max-width:82%;margin:0">${lines(wording)}</p><div class="vn-names" data-edit="name1">${e(n1)}</div>${par(data.parents1,'parents1')}<div class="vn-amp">&amp;</div><div class="vn-names" data-edit="name2">${e(n2)}</div>${par(data.parents2,'parents2')}${dateArea}<div>${rsvp?` <a class="vn-link" href="${e(rsvp)}" target="_blank" rel="noopener noreferrer">RSVP ↗</a>`:''}</div><p class="vn-comp" data-edit="compliments">${lines(pick(data.compliments,'compliments'))}</p><div class="vn-castle" aria-hidden="true"></div>${cornerRoses}</div></section>`);
 /* 3b · Groom location page (separate) */
 pages.push(`<section class="vn-page full" id="vn-groom-loc">${roses}<div class="vn-card"><p class="vn-title-sm">Groom side · Party</p><div class="vn-orn"></div><div style="margin-top:2cqw;text-align:center" data-edit="venueGroom"><p class="vn-small" style="margin:0"><strong>${e(vLbl(data,'venueGroomLabel','GROOM VENUE / PARTY'))}</strong></p><p class="vn-small" style="margin:.8cqw 0;font-size:4.2cqw">${e(data.venueGroom||'To be announced')}</p>${data.addressGroom?`<p class="vn-small tiny" style="margin:0">${lines(data.addressGroom)}</p>`:''}${data.mapUrlGroom?`<p style="margin:1.4cqw 0"><a class="vn-link" href="${e(mapLink(data.mapUrlGroom||''))}" target="_blank" rel="noopener noreferrer">GET DIRECTIONS ↗</a></p>`:''}</div>${cornerRoses}</div></section>`);
 /* 3c · Reception page (separate, below groom) */
<<<<<<< HEAD
 pages.push(`<section class="vn-page full" id="vn-reception-loc">${roses}<div class="vn-card"><p class="vn-title-sm" data-edit="receptionTitle">${e((data.receptionTitle||'').trim()||'Reception')}</p><div class="vn-orn"></div>${recDate(data,'vn')}<div style="margin-top:2cqw;text-align:center" data-edit="venue"><p class="vn-small" style="margin:0"><strong>${e(vLbl(data,'venueLabel','RECEPTION'))}</strong></p><p class="vn-small" style="margin:.8cqw 0;font-size:4.2cqw">${e(data.venue||'To be announced')}</p>${data.address?`<p class="vn-small tiny" style="margin:0">${lines(data.address)}</p>`:''}${map?`<p style="margin:1.4cqw 0"><a class="vn-link" href="${e(map)}" target="_blank" rel="noopener noreferrer">GET DIRECTIONS ↗</a></p>`:''}</div>${cornerRoses}</div></section>`);
=======
 pages.push(`<section class="vn-page full" id="vn-reception-loc">${roses}<div class="vn-card"><p class="vn-title-sm">Reception</p><div class="vn-orn"></div><div style="margin-top:2cqw;text-align:center" data-edit="venue"><p class="vn-small" style="margin:0"><strong>${e(vLbl(data,'venueLabel','RECEPTION'))}</strong></p><p class="vn-small" style="margin:.8cqw 0;font-size:4.2cqw">${e(data.venue||'To be announced')}</p>${data.address?`<p class="vn-small tiny" style="margin:0">${lines(data.address)}</p>`:''}${map?`<p style="margin:1.4cqw 0"><a class="vn-link" href="${e(map)}" target="_blank" rel="noopener noreferrer">GET DIRECTIONS ↗</a></p>`:''}</div>${cornerRoses}</div></section>`);
>>>>>>> d5b0a46e1e7988217002f4a63a3690eeb9373b21
 /* 4 · last page: blessing */
 pages.push(`<section class="vn-page full" id="vn-last">${roses}<div class="vn-card"><div class="vn-ar sm" data-edit="blessingArabic" dir="rtl" lang="ar">${e(blAr)}</div><div class="vn-orn"></div><p class="vn-en" data-edit="blessing">“${lines(bl)}”</p><p class="vn-small tiny" data-edit="rsvpText" style="margin-top:6cqw">${lines(pick(data.rsvpText,'rsvpText'))}</p>${cornerRoses}</div></section>`);
 return {pages:pages.join(''),card1};
}

const dustMarkup=n=>`<div class="vn-dust" aria-hidden="true">${Array.from({length:n},(_,i)=>`<i style="--x:${(i*53+9)%100}%;--s:${2+(i%4)}px;--d:${-((i*1.9)%14).toFixed(1)}s;--t:${(11+(i%5)*2.2).toFixed(1)}s;--dx:${((i%7)-3)*14}px"></i>`).join('')}</div>`;
const sparkMarkup=`<div aria-hidden="true">${Array.from({length:18},(_,i)=>{const a=i/18*Math.PI*2,r=110+(i%4)*45;return `<i class="vn-spark" style="--x:${Math.round(Math.cos(a)*r)}px;--y:${Math.round(Math.sin(a)*r)}px"></i>`}).join('')}</div>`;
const miniSparks=`<div class="vn-sparks" aria-hidden="true">${Array.from({length:16},(_,i)=>{const a=i/16*Math.PI*2,r=60+(i%3)*28;return `<i style="--x:${Math.round(Math.cos(a)*r*1.6)}px;--y:${Math.round(Math.sin(a)*r)}px"></i>`}).join('')}</div>`;
const showerMarkup=`<div class="vn-shower" id="vn-shower" aria-hidden="true">${Array.from({length:26},(_,i)=>`<i style="--x:${(i*37+5)%100}%;--w:${9+(i%4)*3}px;--d:${(.1+(i%9)*.3).toFixed(2)}s;--t:${(3.6+(i%5)*.5).toFixed(2)}s;--r:${(i*47)%360}deg;--dx:${((i%7)-3)*22}px"></i>`).join('')}</div>`;

/* ===== 777: artwork pages (the four supplied background images) ===== */
const ARTBASE=((typeof location!=='undefined'&&location.origin)?location.origin:'')+'/assets/';
const TW={cover:[[50.2,63.3],[92.7,26.3],[91,32],[95,60],[97,66]],card:[[50.7,6.4],[50.7,14.4],[50.7,19.6],[50.7,82],[50.7,90]],details:[[50.3,4.7],[50,14],[50,18.5],[96,71],[8,87]],blessing:[[50.5,4.2],[50.5,97],[94,46.7],[91,56]]};
const twMarkup=k=>`<div class="a7-tw" aria-hidden="true">${TW[k].map((c,i)=>`<i style="--x:${c[0]}%;--y:${c[1]}%;--d:${(i*.55).toFixed(2)}s"></i>`).join('')}</div>`;
const A7CSS=`
.a7p{padding:0;min-height:100svh;display:grid;grid-template-columns:minmax(0,1fr);place-items:center;overflow:hidden;background:var(--bg)}
.a7{--w:max(min(100vw,560px),calc(100svh*var(--r)));position:relative;width:var(--w);container-type:inline-size;flex:none}
.a7>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;user-select:none;-webkit-user-drag:none;transition:transform 1.8s cubic-bezier(.2,.7,.2,1),filter 1.4s ease}
.vn-page:not(.in) .a7>img{transform:scale(1.07);filter:brightness(.65)}
.t7{position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:1.2cqw;color:var(--ink2)}
.t7.fill{justify-content:space-between}
@media(min-width:620px){.a7{-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}}
.t7>*{opacity:0}.vn-page.in .t7>*{opacity:1;animation:vn-up .9s both}
.t7>:nth-child(1){animation-delay:.15s!important}.t7>:nth-child(2){animation-delay:.3s!important}.t7>:nth-child(3){animation-delay:.45s!important}.t7>:nth-child(4){animation-delay:.6s!important}.t7>:nth-child(5){animation-delay:.75s!important}.t7>:nth-child(n+6){animation-delay:.9s!important}
.vn-page.in .a7-title,.vn-page.in .a7-nm,.vn-page.in .a7-mono,.vn-page.in .a7-amp{animation:vn-up .9s both,vn-write 1.9s both}
.vn-page.instant .t7>*{animation:none!important;opacity:1}.vn-page.instant .a7>img{transition:none!important}
.a7-ar{font-family:var(--arf);font-weight:400;font-size:calc(6.4cqw*var(--ars,1));line-height:var(--arl,1.7);color:var(--ink);margin:0}.a7-ar.big{font-size:calc(8cqw*var(--ars,1))}
.a7-en{font:italic 3cqw/1.5 AtelierSerif,Georgia,serif;color:var(--mut);margin:0}.a7-en.big{font-size:3.4cqw}
.a7-orn{width:22cqw;height:1px;background:linear-gradient(90deg,transparent,#b0864a,transparent);position:relative;margin:1cqw 0;flex:none}
.a7-orn:after{content:'◆';position:absolute;left:calc(50% - 1.2cqw);top:-1.5cqw;width:2.4cqw;font-size:2.2cqw;line-height:1;text-align:center;color:#b0864a}
.a7-title{font:400 6.8cqw/1.1 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:var(--dark)}
.a7-mono{font:400 15cqw/1 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:var(--ink)}
.a7-cap{font:600 2.1cqw/1.6 Arial,sans-serif;letter-spacing:.5cqw;text-transform:uppercase;color:var(--cap);margin:0}
.a7-it{font:italic 2.7cqw/1.5 AtelierSerif,Georgia,serif;color:var(--mut2);margin:0;text-wrap:balance}
.a7-nm{font:400 7.6cqw/1.05 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:var(--ink);overflow-wrap:anywhere}
.a7-amp{font:400 5.2cqw/1 AtelierAllura,AtelierParisienne,cursive;color:var(--ink)}
.a7-p{font:600 max(8.5px,2cqw)/1.45 Arial,sans-serif;letter-spacing:.2cqw;text-transform:uppercase;color:var(--cap);margin:0}.a7-p.b{font-weight:700}
.a7-top,.a7-mid,.a7-bot{display:flex;flex-direction:column;align-items:center;gap:.9cqw;width:100%}
.vn-scratchbox.a7s{width:100%;aspect-ratio:3/1;margin:0}
.d7{display:flex;flex-direction:column;align-items:center;gap:.3cqw;color:var(--cap)}.d7 i{font:600 1.9cqw Arial,sans-serif;letter-spacing:.5cqw;font-style:normal}.d7 b{font:700 2.4cqw Arial,sans-serif;letter-spacing:.6cqw}
.d7r{display:flex;align-items:center;gap:1.4cqw;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:.6cqw 1.6cqw}.d7r span{font:600 2cqw Arial,sans-serif;letter-spacing:.35cqw;text-transform:uppercase}.d7r em{font:400 5.6cqw/1 Georgia,serif;font-style:normal;color:var(--btn1)}
.vn-skip.a7k{min-height:max(30px,4.2cqw);font-size:max(10px,1.8cqw);margin-top:0;white-space:nowrap}
.a7-btns{display:flex;gap:1.2cqw;justify-content:center;flex-wrap:nowrap}
.a7-link{display:inline-flex;align-items:center;min-height:max(36px,4.4cqw);padding:0 2.2cqw;border-radius:6cqw;background:linear-gradient(135deg,var(--btn1),var(--btn2));color:#f7e6c2;font:700 max(9px,1.75cqw) Arial,sans-serif;letter-spacing:.3cqw;text-decoration:none;white-space:nowrap}
.a7-comp{font:italic max(10px,2.5cqw)/1.35 AtelierSerif,Georgia,serif;color:var(--mut);margin:0;border-top:1px solid var(--line2);padding-top:1cqw;width:90%}
.a7-ev-hl,.a7-ev{border:1px solid #c9a05088;border-radius:1.8cqw;padding:2cqw 2.4cqw;margin:1.4cqw 0;background:#fff8ecdd;width:100%;border-top:1px solid #b0864a66;padding:1.4cqw 0}.a7-ev h3{font:400 5.2cqw/1.1 AtelierAllura,cursive;color:var(--ink);margin:0}.a7-ev p{margin:.3cqw 0;font:2.7cqw/1.4 Georgia,serif;color:var(--cap);white-space:pre-wrap}
/* cover */
.a7c{background:var(--bg)}.a7w{position:absolute;inset:0;overflow:hidden}.a7wi{min-height:100svh;display:grid;grid-template-columns:minmax(0,1fr);place-items:center}
.a7-cov>img{transition:transform 1.8s cubic-bezier(.5,0,.2,1),filter 1.8s ease;transform-origin:50% 56%}
.a7-flare{position:absolute;left:50%;top:64%;width:12cqw;aspect-ratio:1;margin:-6cqw 0 0 -6cqw;border-radius:50%;background:radial-gradient(circle,#fff8d8,#f0c860 38%,transparent 68%);mix-blend-mode:screen;opacity:0;transform:scale(.4);pointer-events:none}
.a7-monob{position:absolute;left:50%;top:45%;transform:translate(-50%,-50%);z-index:2;background:none;border:0;padding:3cqw 6cqw;cursor:pointer;font:400 15cqw/1 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:#f6e8c8;text-shadow:0 2px 12px #000c,0 0 18px #e9c98788;animation:a7-glow 2.6s ease-in-out infinite;transition:transform 1s ease,opacity .9s ease}
.a7-monob{-webkit-tap-highlight-color:transparent}.a7-monob:focus{outline:none}.a7-monob:focus-visible{outline:2px solid #f3dca1;outline-offset:2px;border-radius:14px}
@keyframes a7-glow{50%{text-shadow:0 2px 12px #000c,0 0 34px #ffe9a8,0 0 60px #e9c98788}}
.a7-tap{position:absolute;left:0;right:0;top:79.5%;text-align:center;font:600 max(9px,1.8cqw) Arial,sans-serif;letter-spacing:.7cqw;color:#f1dcae;text-transform:uppercase;text-shadow:0 2px 8px #000;transition:opacity .5s}
.a7-cov .vn-spark{top:64%}
.vn-cover.opening .a7-cov>img{transform:scale(1.34);filter:brightness(1.25) saturate(1.1)}
.vn-cover.opening .a7-flare{animation:a7-flare 1.7s .15s ease-out forwards}
@keyframes a7-flare{0%{opacity:0;transform:scale(.4)}30%{opacity:.9}100%{opacity:0;transform:scale(4.2)}}
.vn-cover.opening .a7-monob{animation:none;opacity:0;transform:translate(-50%,-50%) scale(1.3);pointer-events:none}.vn-cover.opening .a7-tap{opacity:0}
.a7wb{clip-path:inset(100% 0 0 0)}.a7wb .a7>img{transform:translateY(7%) scale(1.04);transition:none}
.vn-cover.emerge .a7wb{animation:a7-emerge 2.2s cubic-bezier(.22,.7,.2,1) forwards}.vn-cover.emerge .a7wb .a7>img{transition:transform 2.4s cubic-bezier(.22,.7,.2,1);transform:none}
@keyframes a7-emerge{from{clip-path:inset(100% 0 0 0)}to{clip-path:inset(0 0 0 0)}}
.vn-cover.emerge .a7wa{opacity:0;transition:opacity 1.3s ease .2s}
.a7wb .t7>*{opacity:0}.vn-cover.emerge .a7wb .t7>*{animation:vn-up .9s both}
.vn-cover.emerge .a7wb .t7>:nth-child(1){animation-delay:1.8s}.vn-cover.emerge .a7wb .t7>:nth-child(2){animation-delay:1.95s}.vn-cover.emerge .a7wb .t7>:nth-child(3){animation-delay:2.1s}.vn-cover.emerge .a7wb .t7>:nth-child(4){animation-delay:2.25s}.vn-cover.emerge .a7wb .t7>:nth-child(5){animation-delay:2.4s}.vn-cover.emerge .a7wb .t7>:nth-child(n+6){animation-delay:2.55s}

/* extra luxury motion for the art templates */
.a7-tw{position:absolute;inset:0;pointer-events:none}
.a7-tw i{position:absolute;left:var(--x);top:var(--y);width:5.4cqw;height:5.4cqw;margin:-2.7cqw 0 0 -2.7cqw;background:${uri(starSvg)} center/contain no-repeat;opacity:0;animation:a7-tw 3.2s var(--d) ease-in-out infinite;filter:drop-shadow(0 0 4px #ffe9a8)}
@keyframes a7-tw{0%,100%{opacity:0;transform:scale(.2) rotate(0)}50%{opacity:1;transform:scale(1) rotate(45deg)}}
.vn-page.in .a7>img{animation:a7-kb 20s ease-in-out infinite alternate}.vn-page.instant .a7>img{animation:none}
@keyframes a7-kb{from{transform:scale(1)}to{transform:scale(1.035)}}
.a7:after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 42%,#fff4cf88 50%,transparent 58%) -160% 0/260% 100% no-repeat;mix-blend-mode:soft-light}
.vn-page.in .a7:after{animation:a7-sweep 2.6s .5s ease-out 1 forwards}.vn-page.instant .a7:after{animation:none}
@keyframes a7-sweep{to{background-position:160% 0}}
@supports((-webkit-background-clip:text) or (background-clip:text)){
.vn-page.in .a7-nm,.vn-page.in .a7-title,.vn-page.in .a7-mono{background:linear-gradient(100deg,transparent 38%,#d9b46a 50%,transparent 62%) 130% 0/260% 100% no-repeat,linear-gradient(var(--ink),var(--ink));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:vn-up .9s both,vn-write 1.9s both,a7-sheen 6s 2.6s ease-in-out infinite}
.vn-page.instant .a7-nm,.vn-page.instant .a7-title,.vn-page.instant .a7-mono{animation:none!important}}
@keyframes a7-sheen{0%,60%{background-position:130% 0,0 0}100%{background-position:-30% 0,0 0}}
.a7-cov .a7-tw i{width:4.6cqw;height:4.6cqw;margin:-2.3cqw 0 0 -2.3cqw}
@media(prefers-reduced-motion:reduce){.a7-tw,.a7:after{display:none}.vn-page.in .a7>img,.vn-page.in .a7-nm,.vn-page.in .a7-title,.vn-page.in .a7-mono{animation:none!important}}
@media(prefers-reduced-motion:reduce){.a7>img,.a7-cov>img,.a7wb .a7>img{transition:none!important}.vn-page:not(.in) .a7>img{transform:none;filter:none}.a7-monob{animation:none}.t7>*{opacity:1!important;animation:none!important}}
`;
function artPages(data,p,theme){
 const ART=ARTBASE+theme.art+'/';
 const e2=e,n1=data.name1||'Name one',n2=data.name2||'Name two';
 const mono=((typeof data.monogram==='string'&&data.monogram.trim())||((n1[0]||'')+(n2[0]||''))).slice(0,3);
 const verseAr=pick(data.verseArabic,'verseArabic'),verse=pick(data.verse,'verse'),blAr=pick(data.blessingArabic,'blessingArabic'),bl=pick(data.blessing,'blessing');
 const heading=pick(data.heading==='Together with our families'?'':data.heading,'heading');
 const wording=pick(data.message&&!/^With joy in our hearts/.test(data.message)?data.message:'','message');
 const map=mapLink(data.mapUrl||''),rsvp=httpsLink(data.rsvpUrl||'');
 const timeShown=(typeof data.timeText==='string'&&data.timeText.trim())||(p?p.time:'');
 const sched=(data.schedule||[]).filter(s=>s.title);
 const photos=(data.photos||[]).filter(s=>typeof s==='string'&&/^data:image\/(jpeg|png|webp);base64,|^\/media\//.test(s));
 const art=(file,w,h,box,inner,attrs,cls)=>`<section class="vn-page a7p"${attrs||''}><div class="a7" style="--r:${(w/h).toFixed(4)};aspect-ratio:${w}/${h}"><img src="${ART}${file}" alt="" decoding="async">${twMarkup(file.replace('.jpg',''))}<div class="t7${cls?' '+cls:''}" style="left:${box[0]}%;top:${box[1]}%;width:${box[2]}%;height:${box[3]}%">${inner}</div></div></section>`;
 const par=(v,f)=>(typeof v==='string'&&v.trim())?`<p class="a7-p" data-edit="${f}" style="font-weight:400">${lines(v.trim())}</p>`:'';
 const pages=[];
 /* 1 · the card that comes out of the envelope */
 pages.push(art('card.jpg',832,1288,[25,24,50,37],`<div class="a7-ar" data-edit="verseArabic" dir="rtl" lang="ar">${e(verseAr)}</div><p class="a7-en" data-edit="verse">${lines(verse)}</p><div class="a7-orn"></div><div class="a7-title" data-edit="heading">${e(heading)}</div><div class="a7-mono" data-edit="monogram">${e(mono)}</div><p class="a7-cap">${e(n1)} &amp; ${e(n2)}</p>`,' id="vn-p1"'));
 /* 2 · details, directions, SCRATCH the date */
 const dateInner=p?`<div class="d7"><i>ON</i><b>${MONTHS[p.mo-1]}</b><div class="d7r"><span>${DAYS[p.wd]}</span><em>${p.d}</em><span>${e(timeShown)}</span></div><b>${p.y}</b></div>`:'<div class="d7"><b>DATE TO BE ANNOUNCED</b></div>';
 const host=(data.family||'').trim()?`<p class="a7-p" data-edit="family">${lines(data.family.trim())}</p>`:'';
 pages.push(art('details.jpg',784,1334,[21,21,58,58],`<div class="a7-top">${host}<p class="a7-it" data-edit="message">${lines(wording)}</p><div class="a7-nm" data-edit="name1">${e(n1)}</div>${par(data.parents1,'parents1')}<div class="a7-amp">&amp;</div><div class="a7-nm" data-edit="name2">${e(n2)}</div>${par(data.parents2,'parents2')}</div><div class="a7-mid"><div class="vn-scratchbox a7s" id="vn-scratchbox"><div class="vn-secret" data-edit="event-date">${dateInner}</div><canvas id="vn-scratch" aria-label="Scratch to reveal the wedding date"></canvas>${miniSparks}</div><button type="button" class="vn-skip a7k" id="vn-reveal">Or tap here to reveal</button></div><div class="a7-bot">${venuePair(data,'a7')}<div class="a7-btns">${rsvp?`<a class="a7-link" href="${e(rsvp)}" target="_blank" rel="noopener noreferrer">RSVP ↗</a>`:''}</div><p class="a7-comp" data-edit="compliments">${lines(pick(data.compliments,'compliments'))}</p></div>`,' id="vn-final"','fill'));
 /* Reception on NEXT page (not same page as Groom) */
<<<<<<< HEAD
 pages.push(art('details.jpg',784,1334,[21,28,58,48],`<div class="a7-title" data-edit="receptionTitle">${e((data.receptionTitle||'').trim()||'Reception')}</div><div class="a7-orn"></div>${recDate(data,'a7')}${venueReception(data,'a7')}`,' id="vn-reception-loc"','fill'));
=======
 pages.push(art('details.jpg',784,1334,[21,28,58,48],`<div class="a7-title">Reception</div><div class="a7-orn"></div>${venueReception(data,'a7')}`,' id="vn-reception-loc"','fill'));
>>>>>>> d5b0a46e1e7988217002f4a63a3690eeb9373b21

 if(sched.length)pages.push(art('blessing.jpg',816,1306,[24,20,52,58],`<div class="a7-title">Moments of the day</div><div class="a7-orn"></div><div style="width:100%" data-edit="schedule">${sched.map(s=>`<article class="a7-ev a7-ev-hl"><h3>${e(s.title)}</h3><p>${e(s.time)}</p><p>${e(s.detail)}</p></article>`).join('')}</div>`));
 if(photos.length)pages.push(`<section class="vn-page" id="vn-gallery-page"><div class="vn-gallery" data-edit="photos"><h2>${e(data.galleryTitle||'Our favourite memories')}</h2>${photos.map((s,i)=>`<img src="${e(s)}" alt="Wedding memory ${i+1}" loading="lazy">`).join('')}</div></section>`);
 /* 3 · last page: Arabic + English blessing */
 pages.push(art('blessing.jpg',816,1306,[24,20,52,58],`<div class="a7-ar big" data-edit="blessingArabic" dir="rtl" lang="ar">${e(blAr)}</div><div class="a7-orn"></div><p class="a7-en big" data-edit="blessing">“${lines(bl)}”</p><p class="a7-cap" data-edit="rsvpText" style="margin-top:5cqw;font-weight:400">${lines(pick(data.rsvpText,'rsvpText'))}</p>`,' id="vn-last"'));
 return pages.join('');
}
function artCover(data,mono,theme){
 const ART=ARTBASE+theme.art+'/';
 return `<div class="vn-cover a7c" id="vn-cover" role="dialog" aria-modal="true" aria-label="Open the invitation"><div class="a7w a7wa"><div class="a7wi"><div class="a7 a7-cov" style="--r:.6102;aspect-ratio:800/1311"><img src="${ART}cover.jpg" alt="">${twMarkup('cover')}<div class="a7-flare"></div><button type="button" class="a7-monob" id="vn-open" aria-label="Open the invitation">${e(mono)}</button><p class="a7-tap">Tap the monogram to open</p>${sparkMarkup}</div></div></div>${dustMarkup(16)}</div>`;
}


/* ===== 888 · Real Boards walkthrough: wax-sealed envelope -> you walk through the venue, one real sign board at a time ===== */
const W8={
 b1:{file:'b1.jpg',w:683,h:1024,box:[37,23.4,31.5,37.1],cls:'gold'},
 b2:{file:'b2.jpg',w:778,h:1024,box:[36.6,29.3,25.1,25.4],cls:'ink'},
 b3:{file:'b3.jpg',w:647,h:1024,box:[20.9,24.8,63.8,37.6],cls:'ink'},
 b4:{file:'b4.jpg',w:684,h:1024,box:[21.9,25.6,58.2,20.4],cls:'wood'}
};
const W8CSS=`
:root{--bg:#14110e;--bg1:#3a2e22;--bg2:#2a2118;--p1:#f1e3d3;--p2:#a1785a;--box:#00000066}
html{scroll-snap-type:none}
.w8-track{position:relative;height:calc(100svh*(var(--n)*1.3 + 1));background:#14110e}
.w8-stage{position:sticky;top:0;height:100svh;overflow:hidden;background:#14110e}
.w8-stage:after{content:'';position:absolute;inset:0;pointer-events:none;z-index:5;background:radial-gradient(ellipse at 50% 45%,transparent 55%,#0009 100%)}
.w8-stage.intro{animation:w8-intro 1.9s cubic-bezier(.2,.7,.2,1) both}
@keyframes w8-intro{from{opacity:0;transform:scale(1.45)}to{opacity:1;transform:none}}
.w8-scene{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,1fr);place-items:center;opacity:0;visibility:hidden}
.w8-art{--w:min(max(100vw,calc(100svh*var(--r))),calc(100svh*var(--r)*1.25));position:relative;width:var(--w);flex:none;will-change:transform}
.w8-art>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;user-select:none;-webkit-user-drag:none}
.w8-text{position:absolute;container-type:inline-size;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:2.2cqw}
.w8-l{clip-path:inset(0 calc(100% - 100%*clamp(0,calc(var(--k,0)*var(--n,8) - var(--i,0)),1)) 0 0);max-width:100%}
.w8-f{opacity:clamp(0,calc(var(--k,0)*var(--n,8) - var(--i,0)),1);width:100%;display:flex;justify-content:center}
.w8-cap{font:600 3.6cqw/1.5 Arial,sans-serif;letter-spacing:.9cqw;text-transform:uppercase;margin:0}
.w8-h{font:400 13cqw/1.1 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive}
.w8-nm{font:400 14cqw/1.05 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;overflow-wrap:anywhere}
.w8-amp{font:400 9cqw/1 AtelierAllura,AtelierParisienne,cursive}
.w8-en{font:italic 4.2cqw/1.45 AtelierSerif,Georgia,serif;margin:0}.w8-en.sm{font-size:3.5cqw}
.w8-ar{font-family:var(--arf);font-weight:400;font-size:calc(9cqw*var(--ars,1));line-height:var(--arl,1.7);margin:0}.w8-ar.sm{font-size:calc(7.2cqw*var(--ars,1))}
.w8-p{font:600 3.2cqw/1.5 Arial,sans-serif;letter-spacing:.4cqw;text-transform:uppercase;margin:0}.w8-p.t{font-size:2.8cqw;font-weight:400}
.w8-orn{width:34cqw;height:1px;background:linear-gradient(90deg,transparent,currentColor,transparent);opacity:.6}
.w8-gold{color:#f3e3bd;text-shadow:0 0 14px #e9c98744}.w8-gold .w8-cap{color:#d9b46a}
.w8-ink{color:#4b3a2d}.w8-ink .w8-h,.w8-ink .w8-nm,.w8-ink .w8-amp{color:#8a5a40}.w8-ink .w8-cap{color:#a1785a}.w8-ink .w8-en{color:#6b5444}
.w8-wood{color:#fff8ec;text-shadow:0 1px 2px #1a0f06,0 0 4px #1a0f06,0 0 10px #000a}.w8-wood .w8-en.wd{font-size:5cqw;font-weight:600;line-height:1.4}.w8-wood .w8-ar.sm{font-size:calc(8.4cqw*var(--ars,1))}
.w8-text .vn-scratchbox{width:72%;aspect-ratio:2.6/1;margin:0;box-shadow:inset 0 0 0 1px #b0864a,0 4px 12px #4b3a2d33}
.dd{display:flex;flex-direction:column;align-items:center;gap:.4cqw;color:#4b3a2d}.dd i{font:600 3cqw Arial,sans-serif;letter-spacing:.8cqw;font-style:normal}.dd b{font:700 4.2cqw Arial,sans-serif;letter-spacing:.9cqw;color:#8a5a40}
.ddr{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:.6cqw 2cqw;border-top:1px solid #a1785a77;border-bottom:1px solid #a1785a77;padding:1cqw 2cqw}.ddr span{font:600 2.9cqw Arial,sans-serif;letter-spacing:.3cqw;text-transform:uppercase}.ddr em{font:400 10cqw/1 Georgia,serif;font-style:normal;color:#8a5a40}
.w8-text .vn-skip{margin:0;font-size:max(10px,3cqw);min-height:max(30px,7cqw);color:#8a5a40}
.w8-btns{display:flex;gap:2cqw;justify-content:center}
.w8-link{display:inline-flex;align-items:center;min-height:max(36px,9cqw);padding:0 3.6cqw;border-radius:9cqw;background:linear-gradient(135deg,#a1785a,#7d5a42);color:#fff6e8;font:700 max(9px,2.9cqw) Arial,sans-serif;letter-spacing:.5cqw;text-decoration:none;white-space:nowrap}
.w8-text .vn-secret{border-radius:3cqw}.w8-text #vn-scratch{border-radius:3cqw}
/* wax-sealed envelope cover */
.w8c{background:#e8dcc6}.w8-cvwrap{position:absolute;inset:0;overflow:hidden;display:grid;grid-template-columns:minmax(0,1fr);place-items:center;background:#e8dcc6}
.w8-cv{--w:min(max(100vw,calc(100svh*var(--r))),calc(100svh*var(--r)*1.3));position:relative;width:var(--w);container-type:inline-size;flex:none}
.w8-cv>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transform-origin:51% 56.4%;transition:transform 1.9s cubic-bezier(.55,0,.25,1),filter 1.9s ease}
.w8-seal{position:absolute;left:51%;top:56.4%;width:50cqw;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:none;border:0;cursor:pointer;animation:w8-ring 2.4s ease-out infinite;-webkit-tap-highlight-color:transparent}
.w8-seal:focus{outline:none}.w8-seal:focus-visible{outline:3px solid #fff;outline-offset:3px}
@keyframes w8-ring{0%{box-shadow:0 0 0 0 #fff4cfaa}70%{box-shadow:0 0 0 7cqw #fff4cf00}100%{box-shadow:0 0 0 0 #fff4cf00}}
.w8-glow{position:absolute;left:51%;top:56.4%;width:80cqw;aspect-ratio:1;margin:-40cqw 0 0 -40cqw;border-radius:50%;background:radial-gradient(circle,#fff3c8,#f0c860aa 35%,transparent 68%);opacity:0;transform:scale(.3);pointer-events:none}
.w8c.opening .w8-glow{animation:w8-glow 1.3s ease-out forwards}@keyframes w8-glow{0%{opacity:0;transform:scale(.3)}35%{opacity:.95}100%{opacity:0;transform:scale(1.5)}}
.w8-crack{position:absolute;left:51%;top:56.4%;width:50cqw;aspect-ratio:1;transform:translate(-50%,-50%);opacity:0;pointer-events:none;background:url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#2a0d06" stroke-width="1.6" stroke-linecap="round"><path d="M50 8L46 28L54 40L47 56L55 70L50 92"/><path d="M54 40L72 34L86 40"/><path d="M47 56L28 62L14 58"/><path d="M46 28L30 22"/></g></svg>')}") center/contain no-repeat}
.w8c.opening .w8-crack{animation:w8-cr 1s .05s ease-out forwards}@keyframes w8-cr{0%{opacity:0;transform:translate(-50%,-50%) scale(.9)}25%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.25)}}
.w8c.opening .w8-cv>img{animation:w8-shake .5s ease-out}@keyframes w8-shake{0%,100%{translate:0 0}20%{translate:-.6cqw .3cqw}45%{translate:.6cqw -.3cqw}70%{translate:-.3cqw .2cqw}}
.w8c.zoom .w8-cv>img{transform:scale(3.8);filter:brightness(1.18)}
.w8-for{position:absolute;left:0;right:0;top:80.5%;text-align:center;font:400 9cqw/1.1 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:#b18f6c;text-shadow:0 1px 0 #fff8,0 -1px 0 #0003;transition:opacity .5s}
.w8-tap{position:absolute;left:0;right:0;top:91%;text-align:center;font:600 max(9px,2.5cqw) Arial,sans-serif;letter-spacing:.9cqw;text-transform:uppercase;color:#9b7a58;text-shadow:0 1px 0 #fff8;margin:0;transition:opacity .5s}
.w8c.opening .w8-for,.w8c.opening .w8-tap{opacity:0}
.w8-cv .vn-spark{top:56.4%;left:51%}
.w8-flash{position:absolute;inset:0;background:radial-gradient(circle at 51% 56%,#fffaf0,#f6e3b8 55%,#e8dcc6);opacity:0;transition:opacity .6s ease;pointer-events:none}
.w8c.flash .w8-flash{opacity:1}
.w8c.fade{opacity:0}
.w8-static .w8-track{height:auto}.w8-static .w8-stage{position:static;height:auto;overflow:visible}.w8-static .w8-stage:after{display:none}
.w8-static .w8-scene{position:relative;opacity:1;visibility:visible;min-height:100svh;pointer-events:auto}.w8-static .w8-text{--k:1}
.w8-foot{background:#14110e;text-align:center;padding:34px 20px 8px;color:#f3e3bd}.w8-fl{font:italic 20px/1.5 AtelierSerif,Georgia,serif;margin:0 0 10px}.w8-fs{font:600 11px/1.8 Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;margin:0;opacity:.8}
.w8-gallery-wrap{background:#14110e;padding:30px 0;display:grid;place-items:center}
@media(prefers-reduced-motion:reduce){.w8-seal{animation:none}.w8-stage.intro{animation:none}.w8-cv>img{transition:none}}
`;
function w8Pages(data,p){
 const n1=data.name1||'Name one',n2=data.name2||'Name two';
 const verseAr=pick(data.verseArabic,'verseArabic'),verse=pick(data.verse,'verse'),blAr=pick(data.blessingArabic,'blessingArabic'),bl=pick(data.blessing,'blessing');
 const heading=pick(data.heading==='Together with our families'?'':data.heading,'heading');
 const wording=pick(data.message&&!/^With joy in our hearts/.test(data.message)?data.message:'','message');
 const map=mapLink(data.mapUrl||''),rsvp=httpsLink(data.rsvpUrl||'');
 const timeShown=(typeof data.timeText==='string'&&data.timeText.trim())||(p?p.time:'');
 const photos=(data.photos||[]).filter(s=>typeof s==='string'&&/^data:image\/(jpeg|png|webp);base64,|^\/media\//.test(s));
 const sched=(data.schedule||[]).filter(s=>s.title);
 const ART=ARTBASE+'888/';
 const board=(key,lines,id)=>{const b=W8[key];let i=0;const body=lines.map(([kind,cls,inner,attr])=>`<div class="${kind==='f'?'w8-f':'w8-l'} ${cls}" style="--i:${i++}"${attr||''}>${inner}</div>`).join('');
  return `<section class="w8-scene"${id?` id="${id}"`:''}><div class="w8-art" style="--r:${(b.w/b.h).toFixed(4)};aspect-ratio:${b.w}/${b.h}" data-box="${b.box.join(',')}"><img src="${ART}${b.file}" alt="" decoding="async"><div class="w8-text w8-${b.cls}" style="left:${b.box[0]}%;top:${b.box[1]}%;width:${b.box[2]}%;height:${b.box[3]}%;--n:${lines.length}">${body}</div></div></section>`};
 const parent=(v,f)=>(typeof v==='string'&&v.trim())?['l','w8-p',lines(v.trim()),` data-edit="${f}"`]:null;
 const hostLine=(data.family||'').trim()?(data.family.trim()):'Together with their families';
 const dateInner=p?`<div class="dd"><i>ON</i><b>${MONTHS[p.mo-1]}</b><div class="ddr"><span>${DAYS[p.wd]}</span><em>${p.d}</em><span>${e(timeShown)}</span></div><b>${p.y}</b></div>`:'<div class="dd"><b>DATE TO BE ANNOUNCED</b></div>';
 const b1=[['l','w8-cap',lines(hostLine),' data-edit="family"'],['l','w8-h',e(heading),' data-edit="heading"'],['l','w8-orn',''],['l','w8-en',lines(wording),' data-edit="message"'],['l','w8-nm',e(n1),' data-edit="name1"'],['l','w8-amp','&amp;'],['l','w8-nm',e(n2),' data-edit="name2"']];
 const par=[parent(data.parents1,'parents1'),data.parents1&&data.parents2?['l','w8-amp','&amp;']:null,parent(data.parents2,'parents2')].filter(Boolean);
 const b2=[['l','w8-ar',e(verseAr),' dir="rtl" lang="ar" data-edit="verseArabic"'],['l','w8-en',lines(verse),' data-edit="verse"'],['l','w8-orn','']].concat(par.length?par:[['l','w8-cap','With the blessings of our families']]);
 const b3=[['l','w8-cap','Save the date'],['f','',`<div class="vn-scratchbox" id="vn-scratchbox"><div class="vn-secret" data-edit="event-date">${dateInner}</div><canvas id="vn-scratch" aria-label="Scratch to reveal the wedding date"></canvas>${miniSparks}</div>`],['f','',`<button type="button" class="vn-skip" id="vn-reveal">Or tap here to reveal</button>`],['f','',venueSide(data,'w8','groom')]].concat(rsvp?[['f','',`<div class="w8-btns"><a class="w8-link" href="${e(rsvp)}" target="_blank" rel="noopener noreferrer">RSVP ↗</a></div>`]]:[]);
 const b4=[['l','w8-ar sm',e(blAr),' dir="rtl" lang="ar" data-edit="blessingArabic"'],['l','w8-en wd',`“${lines(bl)}”`,' data-edit="blessing"']];
 const cfg=Object.values(W8).map(b=>({w:b.w,h:b.h,box:b.box}));
 const track=`<div class="w8-track" id="w8-track" style="--n:4" data-n="4"><div class="w8-stage" id="w8-stage">${board('b1',b1)}${board('b2',b2)}${board('b3',b3,'vn-final')}${board('b4',b4,'vn-last')}</div></div>`;
 const extras=(photos.length?`<div class="w8-gallery-wrap"><div class="vn-gallery" data-edit="photos"><h2>${e(data.galleryTitle||'Our favourite memories')}</h2>${photos.map((s,i)=>`<img src="${e(s)}" alt="Wedding memory ${i+1}" loading="lazy">`).join('')}</div></div>`:'')+(sched.length?`<div class="w8-gallery-wrap"><div class="vn-gallery" style="grid-template-columns:1fr" data-edit="schedule"><h2>Moments of the day</h2>${sched.map(s=>`<article style="text-align:center;color:#f3e3bd"><h3 style="font:400 34px AtelierAllura,cursive;margin:6px 0">${e(s.title)}</h3><p style="margin:2px 0;opacity:.85">${e(s.time)}</p><p style="margin:2px 0;opacity:.7;white-space:pre-wrap">${e(s.detail)}</p></article>`).join('')}</div></div>`:'');
 const foot=`<div class="w8-foot"><p class="w8-fl" data-edit="compliments">${lines(pick(data.compliments,'compliments'))}</p><p class="w8-fs" data-edit="rsvpText">${lines(pick(data.rsvpText,'rsvpText'))}</p></div>`;
 return track+foot+extras;
}
function w8Cover(data,mono){
 const ART=ARTBASE+'888/';const n1=data.name1||'',n2=data.name2||'';
 return `<div class="vn-cover w8c" id="vn-cover" role="dialog" aria-modal="true" aria-label="Open the invitation"><div class="w8-cvwrap"><div class="w8-cv" style="--r:.5771;aspect-ratio:591/1024"><img src="${ART}cover.jpg" alt=""><div class="w8-glow"></div><div class="w8-crack"></div><button type="button" class="w8-seal" id="vn-open" aria-label="Break the wax seal to open the invitation"></button><div class="w8-for">${e(n1)}${n1&&n2?' &amp; ':''}${e(n2)}</div><p class="w8-tap">Tap the wax seal to open</p>${sparkMarkup}</div></div><div class="w8-flash"></div>${dustMarkup(10)}</div>`;
}
const W8JS=String.raw`
/* walk-through: scroll drives a camera that moves up to each real sign board */
const track=document.getElementById('w8-track');
if(track){
 const stage=document.getElementById('w8-stage'),scenes=[...track.querySelectorAll('.w8-scene')],N=scenes.length;
 const clamp=(x,a,b)=>Math.min(b,Math.max(a,x)),ease=x=>x*x*(3-2*x);
 const arts=scenes.map(sc=>sc.querySelector('.w8-art')),boxes=arts.map(a=>a.dataset.box.split(',').map(Number));
 let vw=0,vh=0,geo=[];
 function measure(){vw=window.innerWidth;vh=window.innerHeight;geo=arts.map((a,i)=>{const W=a.offsetWidth,H=a.offsetHeight,b=boxes[i];const bw=b[2]/100*W,bh=b[3]/100*H;const target=Math.min(vw*.9,520);let Z=target/bw;Z=Math.min(Z,(vh*.8)/bh,3.4);Z=Math.max(Z,1);return{W,H,dx:((b[0]+b[2]/2)/100-.5)*W,dy:((b[1]+b[3]/2)/100-.5)*H,Z}})}
 const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(still){track.classList.add('w8-static');document.documentElement.classList.add('w8-static')}
 let ticking=false;
 function frame(){
  ticking=false;if(still)return;
  const r=track.getBoundingClientRect(),total=Math.max(1,track.offsetHeight-vh),y=clamp(-r.top,0,total),p=y/(vh*1.3);
  const bob=Math.sin(y/70)*Math.min(3,vh*.004),sway=Math.sin(y/260)*.35;
  scenes.forEach((sc,i)=>{
   const t=p-i,g=geo[i];if(!g)return;
   const inn=clamp((t+.55)/.4,0,1),out=i===N-1?1:1-clamp((t-.72)/.28,0,1),op=inn*out;
   let s,k=0;
   if(t<0){s=.78+.22*ease(clamp(t+1,0,1))}else{k=ease(clamp(t/.4,0,1));s=1+(g.Z-1)*k+(t>.72?(t-.72)*.5:0)}
   sc.style.opacity=op.toFixed(3);sc.style.visibility=op<.01?'hidden':'visible';sc.style.pointerEvents=op>.55?'auto':'none';
   sc.style.setProperty('--k',clamp((t-.04)/.36,0,1).toFixed(3));
   const kk=t<0?0:k;
   let tx=-s*g.dx*kk,ty=-s*g.dy*kk;const mx=Math.max(0,(s*g.W-vw)/2),my=Math.max(0,(s*g.H-vh)/2);tx=clamp(tx,-mx,mx);ty=clamp(ty,-my,my);
   arts[i].style.transform='translate3d('+tx.toFixed(1)+'px,'+(ty+bob).toFixed(1)+'px,0) rotate('+(sway*(1-kk)).toFixed(3)+'deg) scale('+s.toFixed(4)+')';
  });
 }
 function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
 window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',()=>{measure();req()});window.addEventListener('orientationchange',()=>setTimeout(()=>{measure();req()},250));
 measure();frame();
 window.__w8={measure,frame,stage};
}
`;


/* ===== 999 · Photo journey: the couple's own photos, flown through one after another, with sparkler / petal / bokeh effects,
   a calendar with the scratch-to-reveal date and a live countdown clock ===== */
const JCSS=`
:root{--bg:#0b0a10;--bg1:#2a1f3a;--bg2:#1a1424;--p1:#ff5a6e;--p2:#a01a36;--box:#ffffff14}
html{scroll-snap-type:none}
.j-track{position:relative;height:calc(100svh*(var(--n)*1.4 + 1));background:#0b0a10}
.j-stage{position:sticky;top:0;height:100svh;overflow:hidden;background:#0b0a10}
.j-stage:after{content:'';position:absolute;inset:0;pointer-events:none;z-index:6;background:radial-gradient(ellipse at 50% 42%,transparent 58%,#000a 100%)}
.j-stage.intro{animation:j-intro 1.9s cubic-bezier(.2,.7,.2,1) both}@keyframes j-intro{from{opacity:0;transform:scale(1.5)}to{opacity:1;transform:none}}
.j-scene{position:absolute;inset:0;opacity:0;visibility:hidden;overflow:hidden}
.j-photo{position:absolute;inset:0;will-change:transform}
.j-bd{position:absolute;inset:-8%;background-size:cover;background-position:center;filter:blur(28px) brightness(.5) saturate(1.25)}
.j-fg{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:50% var(--fy,40%);display:block;user-select:none;-webkit-user-drag:none}
.j-fg[data-fit=cover]{object-fit:cover}
.j-ph{position:absolute;inset:0;background:radial-gradient(circle at 50% 38%,#6b3a5a,#2a1f3a 55%,#0b0a10)}
.j-pass{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 40%,#fff5d8 0,#ffe9a888 30%,transparent 62%);opacity:var(--g,0);z-index:2}
.j-bokeh{position:absolute;inset:0;pointer-events:none;z-index:2}
.j-bokeh i{position:absolute;left:var(--x);top:var(--y);width:var(--s);height:var(--s);margin:calc(var(--s)/-2) 0 0 calc(var(--s)/-2);border-radius:50%;background:radial-gradient(circle at 36% 30%,#fff9 0,var(--c) 38%,transparent 70%);mix-blend-mode:screen;filter:blur(1.2px);opacity:0;animation:j-bk var(--t) var(--d) ease-in-out infinite}
@keyframes j-bk{0%,100%{opacity:0;transform:translateY(6px) scale(.9)}50%{opacity:.78;transform:translateY(-10px) scale(1.08)}}
.j-text{position:absolute;left:0;right:0;bottom:0;z-index:4;padding:15svh 7vw max(5.5svh,26px);display:flex;flex-direction:column;align-items:center;text-align:center;gap:1.1svh;color:#fff4dc;text-shadow:0 2px 14px #000b;background:linear-gradient(transparent,#000a 38%,#000d);opacity:var(--to,0);transform:translateY(calc((1 - var(--to,0))*18px))}
.j-text>*{max-width:560px}
.j-l{clip-path:inset(0 calc(100% - 100%*clamp(0,calc(var(--k,0)*var(--n,6) - var(--i,0)),1)) 0 0)}
.j-f{opacity:clamp(0,calc(var(--k,0)*var(--n,6) - var(--i,0)),1)}
.j-cap{font:600 clamp(9px,2.4vw,13px)/1.6 Arial,sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#e9c98a;margin:0}
.j-h{font:400 clamp(30px,9vw,46px)/1.1 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:#f3dca1}
.j-nm{font:400 clamp(42px,14vw,74px)/1 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:#fff4dc;overflow-wrap:anywhere}
.j-amp{font:400 clamp(24px,7vw,36px)/1 AtelierAllura,AtelierParisienne,cursive;color:#e9c98a}
.j-en{font:italic clamp(14px,4vw,19px)/1.5 AtelierSerif,Georgia,serif;margin:0}
.j-ar{font-family:var(--arf);font-weight:400;font-size:calc(clamp(24px,7.5vw,38px)*var(--ars,1));line-height:var(--arl,1.7);color:#f3dca1;margin:0}
.j-p{font:600 clamp(10px,2.8vw,14px)/1.5 Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;margin:0}
.j-orn{width:90px;height:1px;background:linear-gradient(90deg,transparent,#e9c98a,transparent)}
#j-fx{position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none}
/* calendar + live clock scene */
.j-cal{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:max(1.2svh,8px);padding:3svh 6vw;text-align:center;color:#fff4dc;z-index:4}
.j-cbg{position:absolute;inset:-6%;background:radial-gradient(circle at 50% 30%,#3a2a4e,#14101c 60%,#0b0a10) center/cover;filter:saturate(1.1)}
.j-cbg.img{filter:blur(22px) brightness(.38) saturate(1.2)}
.j-month{font:400 clamp(26px,8vw,40px)/1 AtelierAllura,AtelierParisienne,cursive;color:#f3dca1}
.j-g,.j-w{display:grid;grid-template-columns:repeat(7,1fr);width:min(88vw,380px);text-align:center}
.j-w b{font:700 clamp(9px,2.6vw,12px) Arial,sans-serif;color:#e9c98a;padding-bottom:.6svh}
.j-day{font:clamp(13px,4vw,17px)/clamp(26px,4.4svh,36px) Georgia,serif;position:relative}
.j-calbox{opacity:.32;transition:opacity 1.2s ease}.revealed .j-calbox{opacity:1}
.j-target:after{content:'';position:absolute;left:50%;top:50%;width:clamp(28px,8.5vw,40px);height:clamp(28px,8.5vw,40px);margin:calc(clamp(28px,8.5vw,40px)/-2) 0 0 calc(clamp(28px,8.5vw,40px)/-2);border:2px solid #ff5a6e;border-radius:50% 50% 45% 45%;transform:scale(0);opacity:0}
.revealed .j-target{color:#ff9aa8;font-weight:700}.revealed .j-target:after{animation:j-pop .9s .5s cubic-bezier(.2,1.4,.4,1) forwards}@keyframes j-pop{to{transform:scale(1);opacity:1}}
.j-cal .vn-scratchbox{width:min(86%,360px);aspect-ratio:3.3/1;margin:0;overflow:visible;background:linear-gradient(#fff8ea,#f3e3c5)}
.j-cal .vn-secret,.j-cal #vn-scratch{border-radius:12px}.j-cal .vn-secret{overflow:hidden;color:#4a2a2a}
.jd{display:flex;flex-direction:column;align-items:center;gap:2px}.jd b{font:700 clamp(10px,2.8vw,13px) Arial,sans-serif;letter-spacing:.25em;color:#8a1428}.jd span{font:400 clamp(24px,7.4vw,34px)/1.05 AtelierAllura,cursive;color:#3f1620}.jd small{font:600 clamp(9px,2.6vw,12px) Arial,sans-serif;letter-spacing:.2em;color:#4a1722}
.j-cal .vn-skip{margin:0;min-height:30px;font-size:11px;color:#e9c98a}
.j-dials{display:grid;grid-template-columns:repeat(4,1fr);gap:2.4vw;width:min(90vw,400px)}
.j-dial{position:relative;aspect-ratio:1}.j-dial svg{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}.j-dial circle{fill:none;stroke-width:4}.j-dial .bg{stroke:#ffffff22}.j-dial .fg{stroke:#e9c98a;stroke-linecap:round;stroke-dasharray:276.46;stroke-dashoffset:276.46;transition:stroke-dashoffset .6s linear;filter:drop-shadow(0 0 3px #e9c98a88)}
.j-dial b{position:absolute;inset:0;display:grid;place-items:center;font:400 clamp(18px,6vw,26px) Georgia,serif;color:#fff4dc}.j-dial small{position:absolute;left:0;right:0;bottom:12%;text-align:center;font:600 8px Arial,sans-serif;letter-spacing:.2em;color:#e9c98a}
.j-live{font:600 clamp(9px,2.4vw,11px) Arial,sans-serif;letter-spacing:.3em;color:#e9c98a;text-transform:uppercase;display:flex;align-items:center;gap:8px;margin:0}.j-live:before{content:'';width:7px;height:7px;border-radius:50%;background:#ff5a6e;box-shadow:0 0 8px #ff5a6e;animation:j-blink 1.4s infinite}@keyframes j-blink{50%{opacity:.25}}
.j-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}.j-link{display:inline-flex;align-items:center;min-height:42px;padding:0 20px;border-radius:30px;background:linear-gradient(135deg,#f3dca1,#c9a050);color:#3b0711;font:700 11px Arial,sans-serif;letter-spacing:.18em;text-decoration:none;white-space:nowrap}
.j-venue{font:600 clamp(10px,2.8vw,13px) Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;margin:0}
/* intro cover */
.j-cover{background:#0b0a10}.j-cbgc{position:absolute;inset:-6%;background:radial-gradient(circle at 50% 38%,#4a2a5e,#1a1424 55%,#0b0a10) center/cover;transition:transform 1.6s cubic-bezier(.5,0,.2,1)}.j-cbgc.img{filter:blur(18px) brightness(.45) saturate(1.2)}
.j-cin{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:1.4svh;text-align:center;color:#fff4dc;padding:0 6vw;transition:transform 1.5s cubic-bezier(.5,0,.2,1),opacity 1.1s ease}
.j-begin{margin-top:3svh;min-height:48px;padding:0 30px;border-radius:40px;border:1px solid #f3dca1aa;background:#ffffff12;color:#f3dca1;font:600 12px Arial,sans-serif;letter-spacing:.3em;text-transform:uppercase;cursor:pointer;animation:j-ring 2.4s ease-out infinite;-webkit-tap-highlight-color:transparent}
.j-begin:focus{outline:none}.j-begin:focus-visible{outline:3px solid #fff;outline-offset:3px}
@keyframes j-ring{0%{box-shadow:0 0 0 0 #f3dca188}70%{box-shadow:0 0 0 18px #f3dca100}100%{box-shadow:0 0 0 0 #f3dca100}}
.j-cover.opening .j-cin{transform:scale(2.2);opacity:0}.j-cover.opening .j-cbgc{transform:scale(1.7)}
.j-static .j-track{height:auto}.j-static .j-stage{position:static;height:auto;overflow:visible}.j-static .j-stage:after{display:none}
.j-static .j-scene{position:relative;opacity:1;visibility:visible;height:100svh}.j-static .j-text{--to:1;--k:1}
.j-gal{background:#0b0a10;padding:30px 0;display:grid;place-items:center}
@media(prefers-reduced-motion:reduce){.j-begin{animation:none}.j-stage.intro{animation:none}.j-bokeh,#j-fx{display:none}}
`;
const J_FOCUS={top:24,upper:38,center:50,lower:64};
const J_BOKEH=[[12,18,70,'#ff4d5e'],[28,10,46,'#ffd37a'],[8,44,38,'#ffffff'],[22,66,90,'#ff3a55'],[70,12,58,'#ffffff'],[88,28,80,'#ffb347'],[82,62,44,'#ff6b7e'],[60,24,34,'#ffe9a8'],[46,8,60,'#ff8fa0'],[92,80,52,'#ffd37a'],[14,86,60,'#ff5a6e'],[54,74,40,'#ffffff']];
const bokehMarkup=n=>`<div class="j-bokeh" aria-hidden="true">${J_BOKEH.slice(0,n).map((b,i)=>`<i style="--x:${b[0]}%;--y:${b[1]}%;--s:${b[2]}px;--c:${b[3]}88;--t:${(4+(i%4)*1.3).toFixed(1)}s;--d:${(-i*.7).toFixed(1)}s"></i>`).join('')}</div>`;
function jPages(data,p){
 const n1=data.name1||'Name one',n2=data.name2||'Name two';
 const verseAr=pick(data.verseArabic,'verseArabic'),verse=pick(data.verse,'verse'),blAr=pick(data.blessingArabic,'blessingArabic'),bl=pick(data.blessing,'blessing');
 const heading=pick(data.heading==='Together with our families'?'':data.heading,'heading');
 const wording=pick(data.message&&!/^With joy in our hearts/.test(data.message)?data.message:'','message');
 const map=mapLink(data.mapUrl||''),rsvp=httpsLink(data.rsvpUrl||'');
 const timeShown=(typeof data.timeText==='string'&&data.timeText.trim())||(p?p.time:'');
 const photos=(data.photos||[]).filter(s=>typeof s==='string'&&/^data:image\/(jpeg|png|webp);base64,|^\/media\//.test(s));
 const sched=(data.schedule||[]).filter(s=>s.title);
 const used=new Set();
 const photoFor=k=>{if(!photos.length)return null;let n=parseInt(data['scene'+k],10);if(!(n>=1&&n<=photos.length))n=((k-1)%photos.length)+1;used.add(n);return photos[n-1]};
 const fy=k=>J_FOCUS[data['focus'+k]]||38;
 const bgn=parseInt(data.bgPhoto,10),bg=(bgn>=1&&bgn<=photos.length)?photos[bgn-1]:null;
 const line=(arr)=>{let i=0;const n=arr.length;return {n,html:arr.map(([kind,cls,inner,attr])=>`<div class="${kind==='f'?'j-f':'j-l'} ${cls}" style="--i:${i++}"${attr||''}>${inner}</div>`).join('')}};
 const par=(v,f)=>(typeof v==='string'&&v.trim())?['l','j-p',lines(v.trim()),` data-edit="${f}"`]:null;
 const scene=(k,src,mode,arr)=>{const L=line(arr);return `<section class="j-scene" data-mode="${mode}" data-fy="${fy(k)}"><div class="j-photo" style="transform-origin:50% ${Math.min(70,fy(k)+3)}%">${src?`<div class="j-bd"></div><img class="j-fg" src="${e(src)}" alt="" style="--fy:${fy(k)}%" decoding="async"${k===1?'':' loading="lazy"'}>`:'<div class="j-ph"></div>'}</div>${mode==='full'||mode==='spark'?bokehMarkup(mode==='full'?12:9):''}<div class="j-pass"></div><div class="j-text" style="--n:${L.n}">${L.html}</div></section>`};
 const hostLine=(data.family||'').trim()?data.family.trim():'Together with their families';
 const s1=scene(1,photoFor(1),'full',[['l','j-cap',lines(hostLine),' data-edit="family"'],['l','j-h',e(heading),' data-edit="heading"'],['l','j-nm',e(n1),' data-edit="name1"'],['l','j-amp','&amp;'],['l','j-nm',e(n2),' data-edit="name2"']]);
 const s2=scene(2,photoFor(2),'spark',[['l','j-ar',e(verseAr),' dir="rtl" lang="ar" data-edit="verseArabic"'],['l','j-orn',''],['l','j-en',lines(verse),' data-edit="verse"']]);
 const pr=[par(data.parents1,'parents1'),data.parents1&&data.parents2?['l','j-amp','&amp;']:null,par(data.parents2,'parents2')].filter(Boolean);
 const s3=scene(3,photoFor(3),'calm',[['l','j-en',lines(wording),' data-edit="message"']].concat(pr));
 const s4=scene(4,photoFor(4),'calm',[['l','j-ar',e(blAr),' dir="rtl" lang="ar" data-edit="blessingArabic"'],['l','j-en',`“${lines(bl)}”`,' data-edit="blessing"'],['l','j-p',lines(pick(data.compliments,'compliments')),' data-edit="compliments"']]);
 /* calendar + live clock */
 let calHTML='<p class="j-en">The date will be announced soon.</p>',secret='<div class="jd"><span>Date to be announced</span></div>';
 if(p){
  const first=new Date(Date.UTC(p.y,p.mo-1,1)).getUTCDay(),dim=new Date(Date.UTC(p.y,p.mo,0)).getUTCDate();
  let cells='';for(let i=0;i<first;i++)cells+='<span></span>';for(let d=1;d<=dim;d++)cells+=`<span class="j-day${d===p.d?' j-target':''}">${d}</span>`;
  calHTML=`<div class="j-calbox"><div class="j-month">${MONTHS[p.mo-1].charAt(0)+MONTHS[p.mo-1].slice(1).toLowerCase()} ${p.y}</div><div class="j-w">${['S','M','T','W','T','F','S'].map(x=>`<b>${x}</b>`).join('')}</div><div class="j-g">${cells}</div></div>`;
  secret=`<div class="jd"><b>${DAYS[p.wd]}</b><span>${p.d} ${MONTHS[p.mo-1].charAt(0)+MONTHS[p.mo-1].slice(1).toLowerCase()} ${p.y}</span><small>${e(timeShown)}</small></div>`;
 }
 const dial=(id,label)=>`<div class="j-dial"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="bg" cx="50" cy="50" r="44"/><circle class="fg" id="r-${id}" cx="50" cy="50" r="44"/></svg><b id="vn-${id}">—</b><small>${label}</small></div>`;
 const cal=`<section class="j-scene" data-mode="none" id="vn-final"><div class="j-cbg${bg?' img':''}"${bg?` style="background-image:url('${e(bg)}')"`:''}></div><div class="j-cal"><p class="j-cap">Save the date</p>${calHTML}<div class="vn-scratchbox" id="vn-scratchbox"><div class="vn-secret" data-edit="event-date">${secret}</div><canvas id="vn-scratch" aria-label="Scratch to reveal the wedding date"></canvas>${miniSparks}</div><button type="button" class="vn-skip" id="vn-reveal">Or tap here to reveal</button><p class="j-live">Live countdown</p><div class="j-dials" id="vn-count">${dial('d','DAYS')}${dial('h','HOURS')}${dial('m','MIN')}${dial('s','SEC')}</div>${venueSide(data,'j','groom')}<div class="j-btns">${rsvp?`<a class="j-link" href="${e(rsvp)}" target="_blank" rel="noopener noreferrer">RSVP ↗</a>`:''}</div><p class="j-p" style="font-weight:400;opacity:.75;font-size:11px" data-edit="rsvpText">${lines(pick(data.rsvpText,'rsvpText'))}</p></div></section>`;
 const extra=photos.map((s,i)=>used.has(i+1)?'':`<img src="${e(s)}" alt="Wedding memory ${i+1}" loading="lazy">`).join('');
 const gal=(extra||sched.length)?`<div class="j-gal">${extra?`<div class="vn-gallery" data-edit="photos"><h2>${e(data.galleryTitle||'Our favourite memories')}</h2>${extra}</div>`:''}${sched.length?`<div class="vn-gallery" style="grid-template-columns:1fr" data-edit="schedule"><h2>Moments of the day</h2>${sched.map(x=>`<article style="text-align:center;color:#f3e3bd"><h3 style="font:400 34px AtelierAllura,cursive;margin:6px 0">${e(x.title)}</h3><p style="margin:2px 0;opacity:.85">${e(x.time)}</p><p style="margin:2px 0;opacity:.7;white-space:pre-wrap">${e(x.detail)}</p></article>`).join('')}</div>`:''}</div>`:'';
 return `<div class="j-track" id="j-track" style="--n:5"><div class="j-stage" id="j-stage">${s1}${s2}${s3}${s4}${cal}<canvas id="j-fx" aria-hidden="true"></canvas></div></div>${gal}`;
}
function jCover(data){
 const n1=data.name1||'Name one',n2=data.name2||'Name two';
 const photos=(data.photos||[]).filter(s=>typeof s==='string'&&/^data:image\/(jpeg|png|webp);base64,|^\/media\//.test(s));
 const bgn=parseInt(data.bgPhoto,10),bg=(bgn>=1&&bgn<=photos.length)?photos[bgn-1]:null;
 return `<div class="vn-cover j-cover" id="vn-cover" role="dialog" aria-modal="true" aria-label="Open the invitation"><div class="j-cbgc${bg?' img':''}"${bg?` style="background-image:url('${e(bg)}')"`:''}></div><div class="j-cin"><p class="j-cap">You are invited</p><div class="j-nm">${e(n1)}</div><div class="j-amp">&amp;</div><div class="j-nm">${e(n2)}</div><button type="button" class="j-begin" id="vn-open">Tap to begin</button></div>${dustMarkup(14)}</div>`;
}
const JJS=String.raw`
/* photo journey: scroll flies the camera through each photo into the next */
const track=document.getElementById('j-track');
if(track){
 const stage=document.getElementById('j-stage'),scenes=[...track.querySelectorAll('.j-scene')],N=scenes.length;
 const clamp=(x,a,b)=>Math.min(b,Math.max(a,x)),ease=x=>x*x*(3-2*x);
 const photoEls=scenes.map(sc=>sc.querySelector('.j-photo')),texts=scenes.map(sc=>sc.querySelector('.j-text'));
 const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(still){track.classList.add('j-static');html.classList.add('j-static')}
 /* fit each photo: portrait-ish photos fill the screen, wide photos stay whole over a blurred copy of themselves */
 function fit(img){const va=innerWidth/innerHeight,ar=img.naturalWidth/Math.max(1,img.naturalHeight);img.dataset.fit=ar<va*1.15?'cover':'contain'}
 scenes.forEach(sc=>{const img=sc.querySelector('.j-fg'),bd=sc.querySelector('.j-bd');if(!img)return;const go=()=>{fit(img);if(bd)bd.style.backgroundImage='url("'+(img.currentSrc||img.src)+'")'};if(img.complete&&img.naturalWidth)go();else img.addEventListener('load',go)});
 window.addEventListener('resize',()=>scenes.forEach(sc=>{const img=sc.querySelector('.j-fg');if(img&&img.naturalWidth)fit(img)}));
 /* sparkler / petal particles */
 const fx=document.getElementById('j-fx'),cx=fx&&fx.getContext('2d');
 let FW=0,FH=0,DPR=1,parts=[],mode='none',last=performance.now();
 const EMREL={full:[[.3,.74],[.7,.76]],spark:[[.72,.72]],calm:[],none:[]};let curEm=[];
 function fxSize(){if(!fx)return;DPR=Math.min(window.devicePixelRatio||1,1.5);FW=fx.width=Math.round(innerWidth*DPR);FH=fx.height=Math.round(innerHeight*DPR)}
 function loop(now){
  requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;
  if(!cx||still||document.hidden||mode==='none'){if(cx&&parts.length){cx.clearRect(0,0,FW,FH);parts=[]}return}
  const em=curEm;
  if(parts.length<320)for(const [ex,ey] of em){const n=Math.round(dt*(mode==='full'?120:70));for(let i=0;i<n;i++){const a=Math.random()*6.283,sp=(80+Math.random()*340)*DPR;parts.push({k:0,x:ex*FW,y:ey*FH,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-40*DPR,l:.45+Math.random()*.7,a:0})}}
  const rate=mode==='full'?9:mode==='spark'?4.5:1.3;
  if(Math.random()<dt*rate&&parts.length<320)parts.push({k:1,x:Math.random()*FW,y:-20*DPR,vx:(Math.random()-.5)*40*DPR,vy:(50+Math.random()*80)*DPR,r:Math.random()*6.28,vr:(Math.random()-.5)*3,s:(5+Math.random()*7)*DPR,l:14,a:0,c:Math.random()<.7?'#d81f3c':'#f3a6b4'});
  cx.clearRect(0,0,FW,FH);
  for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.a+=dt;if(q.a>q.l||q.y>FH+40){parts.splice(i,1);continue}
   if(q.k===0){q.vy+=520*DPR*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;const f=1-q.a/q.l;cx.globalCompositeOperation='lighter';cx.strokeStyle='rgba(255,'+Math.round(170+80*f)+','+Math.round(70+120*f)+','+f.toFixed(2)+')';cx.lineWidth=1.4*DPR;cx.beginPath();cx.moveTo(q.x,q.y);cx.lineTo(q.x-q.vx*.035,q.y-q.vy*.035);cx.stroke()}
   else{q.x+=q.vx*dt+Math.sin(q.a*2+q.r)*20*DPR*dt;q.y+=q.vy*dt;q.r+=q.vr*dt;cx.globalCompositeOperation='source-over';cx.save();cx.translate(q.x,q.y);cx.rotate(q.r);cx.scale(1,Math.abs(Math.cos(q.r*1.3))*.7+.3);cx.fillStyle=q.c;cx.globalAlpha=.9;cx.beginPath();cx.ellipse(0,0,q.s,q.s*.62,0,0,6.283);cx.fill();cx.restore()}}
  cx.globalCompositeOperation='lighter';cx.globalAlpha=1;
  for(const [ex,ey] of em){const g=cx.createRadialGradient(ex*FW,ey*FH,0,ex*FW,ey*FH,26*DPR);g.addColorStop(0,'rgba(255,240,200,.95)');g.addColorStop(1,'rgba(255,170,60,0)');cx.fillStyle=g;cx.fillRect(ex*FW-28*DPR,ey*FH-28*DPR,56*DPR,56*DPR)}
  cx.globalCompositeOperation='source-over';
 }
 fxSize();window.addEventListener('resize',fxSize);if(!still)requestAnimationFrame(loop);
 /* camera */
 let vh=window.innerHeight,ticking=false;const ZMAX=3.4;
 function frame(){
  ticking=false;if(still)return;vh=window.innerHeight;
  const r=track.getBoundingClientRect(),total=Math.max(1,track.offsetHeight-vh),y=clamp(-r.top,0,total),pp=y/(vh*1.4);
  let best=0,bo=-1;
  scenes.forEach((sc,i)=>{
   const t=pp-i,last=i===N-1;
   const op=clamp((t+.4)/.4,0,1)*(last?1:1-clamp((t-.72)/.28,0,1));
   let s;if(t<0)s=.5+.5*ease(clamp(t+1,0,1));else if(last)s=1+.04*clamp(t/.5,0,1);else if(t<.5)s=1+.12*t/.5;else s=1.12+(ZMAX-1.12)*ease(clamp((t-.5)/.5,0,1));
   sc.style.opacity=op.toFixed(3);sc.style.visibility=op<.01?'hidden':'visible';sc.style.pointerEvents=op>.55?'auto':'none';
   photoEls[i]&&(photoEls[i].style.transform='scale('+s.toFixed(4)+')');
   const to=clamp((t-.05)/.2,0,1)*(last?1:1-clamp((t-.55)/.2,0,1));
   sc.style.setProperty('--to',to.toFixed(3));sc.style.setProperty('--k',clamp((t-.02)/.3,0,1).toFixed(3));sc.style.setProperty('--g',(last?0:clamp((t-.7)/.3,0,1)*.6).toFixed(3));
   if(op>bo){bo=op;best=i}
  });
  mode=scenes[best].dataset.mode||'none';
  const img=scenes[best].querySelector('.j-fg');
  if(img&&img.naturalWidth&&EMREL[mode]&&EMREL[mode].length){const b=img.getBoundingClientRect();let cw=b.width,ch=b.height,x0=b.left,y0=b.top;if(img.dataset.fit!=='cover'){const sc=Math.min(b.width/img.naturalWidth,b.height/img.naturalHeight);cw=img.naturalWidth*sc;ch=img.naturalHeight*sc;x0=b.left+(b.width-cw)/2;y0=b.top+(b.height-ch)*(parseFloat(scenes[best].dataset.fy||'38')/100)}
   curEm=EMREL[mode].map(e=>[(x0+cw*e[0])/innerWidth,(y0+ch*e[1])/innerHeight])}else curEm=EMREL[mode]?EMREL[mode].map(e=>[e[0],e[1]*.8]):[];
 }
 function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
 window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);
 frame();window.__j={frame,stage};
 /* live clock rings */
 const rings={d:[365],h:[24],m:[60],s:[60]};
 function dials(){const box=document.getElementById('vn-count');if(!box||box.hidden)return;for(const k in rings){const b=document.getElementById('vn-'+k),c=document.getElementById('r-'+k);if(!b||!c)continue;const v=parseInt(b.textContent,10);if(Number.isNaN(v))continue;const f=Math.min(1,v/rings[k][0]);c.style.strokeDashoffset=(276.46*(1-f)).toFixed(1)}}
 setInterval(dials,1000);setTimeout(dials,300);
}
`;


/* ===== 555 · Butterfly letter: wax-sealed envelope rises and opens, a butterfly flies out, lands on the page, then
   cuts a ribbon with a tiny blade to unlock the date ===== */
const BF={
 a:{file:'open.jpg',w:647,h:1024,box:[21.5,29.5,63,13.5]},
 b:{file:'card.jpg',w:679,h:1024,box:[33,27,36,49]},
 c:{file:'page.jpg',w:570,h:890,box:[16,24,68,62]},
 d:{file:'card.jpg',w:679,h:1024,box:[33,27,36,49]}
};
const BF_SC=[{s:0,e:1.0,zoom:1},{s:1.0,e:2.0,zoom:1},{s:2.0,e:4.5,zoom:0},{s:4.5,e:5.5,zoom:1}];
const BFCSS=`
:root{--bg:#1a120c;--bg1:#4a3322;--bg2:#2f2016;--p1:#ead9c0;--p2:#8d1f2d;--box:#ffffff12}
html{scroll-snap-type:none}
.bf-track{position:relative;height:calc(100svh*8.7);background:#1a120c}
.bf-stage{position:sticky;top:0;height:100svh;overflow:hidden;background:#1a120c}
.bf-stage:after{content:'';position:absolute;inset:0;pointer-events:none;z-index:6;background:radial-gradient(ellipse at 50% 45%,transparent 62%,#0005 100%)}
.bf-scene{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,1fr);place-items:center;opacity:0;visibility:hidden}
.bf-art{--w:min(max(100vw,calc(100svh*var(--r))),calc(100svh*var(--r)*1.25));position:relative;width:var(--w);flex:none;will-change:transform}
.bf-art>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;user-select:none;-webkit-user-drag:none}
.bf-text{position:absolute;container-type:inline-size;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:2.4cqw;color:#5b3a29}
.bf-text.fill{justify-content:space-between}
.bf-grp{display:flex;flex-direction:column;align-items:center;gap:1.6cqw;width:100%}
.bf-l{clip-path:inset(-10% calc(100% - 100%*clamp(0,calc(var(--k,0)*var(--n,8) - var(--i,0)),1)) -10% 0);max-width:100%}
.bf-f{opacity:clamp(0,calc(var(--k,0)*var(--n,8) - var(--i,0)),1);width:100%;display:flex;flex-direction:column;align-items:center;gap:1.4cqw}
.bf-cap{font:600 3.4cqw/1.5 Arial,sans-serif;letter-spacing:.8cqw;text-transform:uppercase;color:#8d1f2d;margin:0}
.bf-h{font:400 11cqw/1.1 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:#7a1624}
.bf-nm{font:400 9.6cqw/1.15 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:#3f2a1d;overflow-wrap:anywhere}.bf-nm span{color:#8d1f2d;margin:0 1.4cqw}
.bf-nm.big{font-size:13cqw;line-height:1.05}.bf-amp{font:400 8cqw/1 AtelierAllura,AtelierParisienne,cursive;color:#8d1f2d}
.bf-en{font:italic 4.4cqw/1.45 AtelierSerif,Georgia,serif;color:#6b4a38;margin:0}.bf-en.sm{font-size:3.8cqw}
.bf-ar{font-family:var(--arf);font-weight:400;font-size:calc(9cqw*var(--ars,1));line-height:var(--arl,1.7);color:#7a1624;margin:0}.bf-ar.sm{font-size:calc(7.6cqw*var(--ars,1))}
.bf-p{font:600 3.2cqw/1.5 Arial,sans-serif;letter-spacing:.4cqw;text-transform:uppercase;color:#4a3022;margin:0}.bf-p.t{font-size:2.8cqw;font-weight:400}
.bf-v{font:400 8cqw/1.15 AtelierAllura,AtelierParisienne,cursive;color:#3f2a1d;overflow-wrap:anywhere;text-wrap:balance}
.bf-orn{width:30cqw;height:1px;background:linear-gradient(90deg,transparent,#8d1f2d,transparent);opacity:.55}
/* sealed date: ribbon + scratch foil */
.bf-sealed{position:relative;width:84%;padding:3cqw 0}
.bf-sealed .vn-scratchbox{width:100%;aspect-ratio:2.7/1;margin:0;overflow:visible;box-shadow:inset 0 0 0 1px #b0864a,0 4px 12px #4b3a2d33}
.bf-sealed .vn-secret{border-radius:3cqw;overflow:hidden}.bf-sealed #vn-scratch{border-radius:3cqw}
.bf-sealed:not(.cut) #vn-scratch{pointer-events:none}
.dd{display:flex;flex-direction:column;align-items:center;gap:.4cqw;color:#4a3022}.dd i{font:600 2.8cqw Arial,sans-serif;letter-spacing:.8cqw;font-style:normal}.dd b{font:700 3.8cqw Arial,sans-serif;letter-spacing:.9cqw;color:#8d1f2d}
.ddr{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:.6cqw 2cqw;border-top:1px solid #8d1f2d66;border-bottom:1px solid #8d1f2d66;padding:1cqw 2cqw}.ddr span{font:600 2.7cqw Arial,sans-serif;letter-spacing:.3cqw;text-transform:uppercase}.ddr em{font:400 9cqw/1 Georgia,serif;font-style:normal;color:#8d1f2d}
.bf-ribbon{position:absolute;left:-9%;right:-9%;top:50%;height:11cqw;margin-top:-5.5cqw;z-index:3;cursor:pointer;-webkit-tap-highlight-color:transparent}
.bf-ribbon:focus{outline:none}.bf-ribbon:focus-visible{outline:2px solid #fff;outline-offset:3px}
.bf-rb{position:absolute;inset:0;transform-origin:50% 50%}
.bf-rb.l{clip-path:inset(-60% 50% -60% 0)}.bf-rb.r{clip-path:inset(-60% 0 -60% 50%)}
.bf-band{position:absolute;left:0;right:0;top:18%;bottom:18%;background:linear-gradient(180deg,#c4313f 0,#9d2233 28%,#6e1422 62%,#a82738 100%);box-shadow:0 3px 8px #0006,inset 0 1px 0 #ffffff55}
.bf-band:after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,#ffffff44 46%,transparent 62%);animation:bf-shine 4.6s ease-in-out infinite}
@keyframes bf-shine{0%,55%{transform:translateX(-60%)}100%{transform:translateX(60%)}}
.bf-bowsvg{position:absolute;left:50%;top:50%;width:26cqw;height:15.6cqw;margin:-8.6cqw 0 0 -13cqw;overflow:visible;filter:drop-shadow(0 3px 4px #0007)}
.bf-sealed.cut .bf-rb{transition:transform 1.15s cubic-bezier(.55,0,.85,.45),opacity .9s ease .25s;opacity:0;pointer-events:none}
.bf-sealed.cut .bf-rb.l{transform:translate(-16%,190%) rotate(-30deg)}.bf-sealed.cut .bf-rb.r{transform:translate(16%,190%) rotate(30deg)}
.bf-sealed.cut .bf-ribbon{pointer-events:none}
.bf-sp{position:absolute;left:50%;top:50%;pointer-events:none}.bf-sp i{position:absolute;width:6px;height:6px;margin:-3px;border-radius:50%;background:#ffe9a8;box-shadow:0 0 10px 3px #e9bf62;opacity:0}
.bf-sealed.cut .bf-sp i{animation:vn-burst 1.3s ease-out forwards}
.bf-cutbtn,.bf-reveal{margin:0;font:600 max(10px,2.9cqw) Arial,sans-serif;letter-spacing:.3cqw;color:#8d1f2d;background:none;border:0;text-decoration:underline;cursor:pointer;min-height:max(32px,7cqw)}
.bf-sealed:not(.cut)~.bf-reveal,.bf-sealed.cut~.bf-cutbtn{display:none}
.bf-btns{display:flex;gap:2cqw;justify-content:center}
.bf-link{display:inline-flex;align-items:center;min-height:max(36px,9cqw);padding:0 3.6cqw;border-radius:9cqw;background:linear-gradient(135deg,#a82738,#6e1422);color:#fff3e4;font:700 max(9px,2.9cqw) Arial,sans-serif;letter-spacing:.5cqw;text-decoration:none;white-space:nowrap}
/* butterfly */
.bf-fly{position:absolute;inset:0;z-index:5;pointer-events:none;overflow:hidden}
.bf-b{position:absolute;left:0;top:0;will-change:transform;opacity:0}
.bf-spr{--bw:min(46vw,230px);position:relative;width:var(--bw);aspect-ratio:376/268;animation:bf-bob 2.6s ease-in-out infinite alternate;filter:drop-shadow(0 6px 8px #0006)}
.bf-spr img{position:absolute;inset:0;width:100%;height:100%}
.bf-wl,.bf-wr{transform-origin:48.9% 52%;animation:bf-flap var(--fd,.24s) ease-in-out infinite alternate}
@keyframes bf-flap{from{transform:scaleX(1)}to{transform:scaleX(.22)}}@keyframes bf-bob{to{translate:0 3px}}
.bf-scis{position:absolute;left:50%;top:64%;width:46%;transform:translateX(-50%);opacity:0;transition:opacity .4s}
.bf-b.hold .bf-scis{opacity:1}
.bf-scis .blade{transform-origin:50% 62%;animation:bf-snip .42s ease-in-out infinite alternate}.bf-scis .blade.b2{animation-direction:alternate-reverse}
@keyframes bf-snip{from{transform:rotate(-2deg)}to{transform:rotate(22deg)}}
/* wax-seal cover */
.bf-cover{background:#1a120c}.bf-cvwrap{position:absolute;inset:0;overflow:hidden;display:grid;grid-template-columns:minmax(0,1fr);place-items:center;background:#1a120c}
.bf-cv{--w:min(max(100vw,calc(100svh*var(--r))),calc(100svh*var(--r)*1.3));position:relative;width:var(--w);container-type:inline-size;flex:none}
.bf-cv>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.bf-cimg{transform-origin:50.3% 59.8%;transition:transform 1.5s cubic-bezier(.45,0,.2,1),opacity 1.2s ease .15s}
.bf-limg{opacity:0;transform:scale(1.5);transform-origin:51% 47.3%;transition:transform 1.9s cubic-bezier(.2,.7,.2,1),opacity 1.1s ease .35s}
.bf-seal{position:absolute;left:50.3%;top:59.8%;width:30cqw;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:none;border:0;cursor:pointer;animation:w8-ring 2.4s ease-out infinite;-webkit-tap-highlight-color:transparent;z-index:2}
.bf-seal:focus{outline:none}.bf-seal:focus-visible{outline:3px solid #fff;outline-offset:3px}
.bf-glow{position:absolute;left:50.3%;top:59.8%;width:70cqw;aspect-ratio:1;margin:-35cqw 0 0 -35cqw;border-radius:50%;background:radial-gradient(circle,#fff3c8,#f0c860aa 35%,transparent 68%);opacity:0;transform:scale(.3);pointer-events:none;z-index:2}
.bf-cover.opening .bf-glow{animation:w8-glow 1.3s ease-out forwards}
.bf-crack{position:absolute;left:50.3%;top:59.8%;width:30cqw;aspect-ratio:1;transform:translate(-50%,-50%);opacity:0;pointer-events:none;background:url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#fff3c8" stroke-width="2.2" stroke-linecap="round"><path d="M50 8L46 28L54 40L47 56L55 70L50 92"/><path d="M54 40L72 34L86 40"/><path d="M47 56L28 62L14 58"/></g></svg>')}") center/contain no-repeat;z-index:2}
.bf-cover.opening .bf-crack{animation:w8-cr 1s .05s ease-out forwards}
.bf-tap{position:absolute;left:0;right:0;top:88%;text-align:center;font:600 max(9px,2.6cqw) Arial,sans-serif;letter-spacing:.9cqw;text-transform:uppercase;color:#f3dfb8;text-shadow:0 2px 8px #000;margin:0;transition:opacity .5s}
.bf-cover.opening .bf-tap{opacity:0}.bf-cover.opening .bf-seal{animation:none;pointer-events:none}
.bf-cover.rise .bf-cimg{transform:scale(1.55);opacity:0}.bf-cover.rise .bf-limg{opacity:1;transform:scale(1.12) translateY(-1.5%)}
.bf-cover .vn-spark{left:50.3%;top:59.8%}
.bf-flash{position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,#fffaf0,#f6e3b8 55%,#e8dcc6);opacity:0;transition:opacity .55s ease;pointer-events:none;z-index:3}
.bf-cover.flash .bf-flash{opacity:1}.bf-cover.fade{opacity:0}
.bf-static .bf-track{height:auto}.bf-static .bf-stage{position:static;height:auto;overflow:visible}.bf-static .bf-stage:after,.bf-static .bf-fly{display:none}
.bf-static .bf-scene{position:relative;opacity:1;visibility:visible;min-height:100svh}.bf-static .bf-text{--k:1}
.bf-gal{background:#1a120c;padding:30px 0;display:grid;place-items:center}
@media(prefers-reduced-motion:reduce){.bf-seal{animation:none}.bf-spr,.bf-wl,.bf-wr,.bf-band:after{animation:none}}
`;
function bfPages(data,p){
 const n1=data.name1||'Name one',n2=data.name2||'Name two';
 const verseAr=pick(data.verseArabic,'verseArabic'),verse=pick(data.verse,'verse'),blAr=pick(data.blessingArabic,'blessingArabic'),bl=pick(data.blessing,'blessing');
 const heading=pick(data.heading==='Together with our families'?'':data.heading,'heading');
 const wording=pick(data.message&&!/^With joy in our hearts/.test(data.message)?data.message:'','message');
 const map=mapLink(data.mapUrl||''),rsvp=httpsLink(data.rsvpUrl||'');
 const timeShown=(typeof data.timeText==='string'&&data.timeText.trim())||(p?p.time:'');
 const photos=(data.photos||[]).filter(s=>typeof s==='string'&&/^data:image\/(jpeg|png|webp);base64,|^\/media\//.test(s));
 const sched=(data.schedule||[]).filter(s=>s.title);
 const ART=ARTBASE+'555/';
 const hostLine=(data.family||'').trim()?data.family.trim():'Together with their families';
 const mk=(kind,cls,inner,attr)=>({kind,cls,inner,attr:attr||''});
 const scene=(key,items,opts)=>{opts=opts||{};const b=BF[key];let i=0;const body=items.map(it=>`<div class="${it.kind==='f'?'bf-f':'bf-l'} ${it.cls}" style="--i:${i++}"${it.attr}>${it.inner}</div>`).join('');
  return `<section class="bf-scene"${opts.id?` id="${opts.id}"`:''}><div class="bf-art" style="--r:${(b.w/b.h).toFixed(4)};aspect-ratio:${b.w}/${b.h}" data-box="${b.box.join(',')}"><img src="${ART}${b.file}" alt="" decoding="async"><div class="bf-text${opts.fill?' fill':''}" style="left:${b.box[0]}%;top:${b.box[1]}%;width:${b.box[2]}%;height:${b.box[3]}%;--n:${opts.n||i||items.length}">${opts.raw?opts.raw:body}</div></div></section>`};
 const par=(v,f)=>(typeof v==='string'&&v.trim())?mk('l','bf-p',lines(v.trim()),` data-edit="${f}"`):null;
 /* A · the letter inside the envelope */
 const A=[mk('l','bf-cap',lines(hostLine),' data-edit="family"'),mk('l','bf-h',e(heading),' data-edit="heading"'),mk('l','bf-nm',`<span data-edit="name1" style="margin:0">${e(n1)}</span><span>&amp;</span><span data-edit="name2" style="margin:0">${e(n2)}</span>`)];
 /* B · the embossed card */
 const pr=[par(data.parents1,'parents1'),data.parents1&&data.parents2?mk('l','bf-amp','&amp;'):null,par(data.parents2,'parents2')].filter(Boolean);
 const B=[mk('l','bf-ar',e(verseAr),' dir="rtl" lang="ar" data-edit="verseArabic"'),mk('l','bf-en',lines(verse),' data-edit="verse"'),mk('l','bf-orn',''),mk('l','bf-en',lines(wording),' data-edit="message"')].concat(pr);
 /* C · the butterfly page: details, ribbon, date */
 const dateInner=p?`<div class="dd"><i>ON</i><b>${MONTHS[p.mo-1]}</b><div class="ddr"><span>${DAYS[p.wd]}</span><em>${p.d}</em><span>${e(timeShown)}</span></div><b>${p.y}</b></div>`:'<div class="dd"><b>DATE TO BE ANNOUNCED</b></div>';
 const bow='<svg class="bf-bowsvg" viewBox="0 0 100 60" aria-hidden="true"><path d="M50 30C38 6 6 4 6 22c0 14 30 14 44 8z" fill="#a82738" stroke="#5a0e18" stroke-width="1.4"/><path d="M50 30C62 6 94 4 94 22c0 14-30 14-44 8z" fill="#a82738" stroke="#5a0e18" stroke-width="1.4"/><path d="M46 34L34 58l12-6 4 8zM54 34l12 24-12-6-4 8z" fill="#8d1f2d" stroke="#5a0e18" stroke-width="1.2"/><rect x="43" y="23" width="14" height="14" rx="5" fill="#c4313f" stroke="#5a0e18" stroke-width="1.2"/></svg>';
 const ribbon=`<div class="bf-ribbon" id="bf-ribbon" role="button" tabindex="0" aria-label="Cut the ribbon to reveal the date"><div class="bf-rb l"><div class="bf-band"></div>${bow}</div><div class="bf-rb r"><div class="bf-band"></div>${bow}</div></div>`;
 const sparks=`<div class="bf-sp" aria-hidden="true">${Array.from({length:16},(_,i)=>{const a=i/16*Math.PI*2,r=50+(i%3)*26;return `<i style="--x:${Math.round(Math.cos(a)*r*1.7)}px;--y:${Math.round(Math.sin(a)*r)}px"></i>`}).join('')}</div>`;
 const C=`<div class="bf-grp"><div class="bf-l bf-cap" style="--i:0" >You are cordially invited</div><div class="bf-l" style="--i:1;width:100%">${venueSide(data,'bf','groom')}</div><div class="bf-l bf-p" style="--i:3;margin-top:1cqw">${e(timeShown)}</div></div><div class="bf-grp bf-f" style="--i:4"><div class="bf-sealed" id="bf-sealed"><div class="vn-scratchbox" id="vn-scratchbox"><div class="vn-secret" data-edit="event-date">${dateInner}</div><canvas id="vn-scratch" aria-label="Scratch to reveal the wedding date"></canvas>${miniSparks}</div>${ribbon}${sparks}</div><button type="button" class="bf-cutbtn" id="bf-cutbtn">Tap here to cut the ribbon</button><button type="button" class="vn-skip bf-reveal" id="vn-reveal">Or tap here to reveal</button></div><div class="bf-grp bf-f" style="--i:5"><div class="bf-btns">${rsvp?`<a class="bf-link" href="${e(rsvp)}" target="_blank" rel="noopener noreferrer">RSVP ↗</a>`:''}</div></div>`;
 /* D · blessing */
 const D=[mk('l','bf-ar sm',e(blAr),' dir="rtl" lang="ar" data-edit="blessingArabic"'),mk('l','bf-en',`“${lines(bl)}”`,' data-edit="blessing"'),mk('l','bf-orn',''),mk('l','bf-en sm',lines(pick(data.compliments,'compliments')),' data-edit="compliments"'),mk('l','bf-p t',lines(pick(data.rsvpText,'rsvpText')),' data-edit="rsvpText"')];
 const sc=[scene('a',A),scene('b',B),scene('c',[],{id:'vn-final',fill:true,raw:C,n:6}),scene('d',D)].join('');
 const fly=`<div class="bf-fly" id="bf-fly" aria-hidden="true"><div class="bf-b" id="bf-b"><div class="bf-spr" id="bf-spr"><img class="bf-wl" src="${ART}wing-l.webp" alt=""><img class="bf-wr" src="${ART}wing-r.webp" alt=""><img src="${ART}body.webp" alt=""><svg class="bf-scis" viewBox="0 0 60 60"><g fill="none" stroke="#c9ccd2" stroke-width="3" stroke-linecap="round"><circle cx="16" cy="48" r="6" stroke="#d9b46a"/><circle cx="44" cy="48" r="6" stroke="#d9b46a"/><path class="blade b1" d="M16 42L40 6" style="transform-origin:30px 28px"/><path class="blade b2" d="M44 42L20 6" style="transform-origin:30px 28px"/></g></svg></div></div></div>`;
 const extras=(photos.length?`<div class="bf-gal"><div class="vn-gallery" data-edit="photos"><h2>${e(data.galleryTitle||'Our favourite memories')}</h2>${photos.map((x,i)=>`<img src="${e(x)}" alt="Wedding memory ${i+1}" loading="lazy">`).join('')}</div></div>`:'')+(sched.length?`<div class="bf-gal"><div class="vn-gallery" style="grid-template-columns:1fr" data-edit="schedule"><h2>Moments of the day</h2>${sched.map(x=>`<article style="text-align:center;color:#ead9c0"><h3 style="font:400 34px AtelierAllura,cursive;margin:6px 0">${e(x.title)}</h3><p style="margin:2px 0;opacity:.85">${e(x.time)}</p><p style="margin:2px 0;opacity:.7;white-space:pre-wrap">${e(x.detail)}</p></article>`).join('')}</div></div>`:'');
 return `<div class="bf-track" id="bf-track" data-sc='${JSON.stringify(BF_SC)}'><div class="bf-stage" id="bf-stage">${sc}${fly}</div></div>${extras}`;
}
function bfCover(data){
 const ART=ARTBASE+'555/';
 return `<div class="vn-cover bf-cover" id="vn-cover" role="dialog" aria-modal="true" aria-label="Open the invitation"><div class="bf-cvwrap"><div class="bf-cv" style="--r:.6562;aspect-ratio:584/890"><img class="bf-limg" src="${ART}lift.jpg" alt=""><img class="bf-cimg" src="${ART}cover.jpg" alt=""><div class="bf-glow"></div><div class="bf-crack"></div><button type="button" class="bf-seal" id="vn-open" aria-label="Break the wax seal to open the invitation"></button><p class="bf-tap">Tap the wax seal to open</p>${sparkMarkup}</div></div><div class="bf-flash"></div>${dustMarkup(10)}</div>`;
}
const BFJS=String.raw`
/* butterfly letter: scroll moves the camera over the letter; the butterfly follows a flight path */
const track=document.getElementById('bf-track');
if(track){
 const SC=JSON.parse(track.dataset.sc),scenes=[...track.querySelectorAll('.bf-scene')],N=scenes.length;
 const clamp=(x,a,b)=>Math.min(b,Math.max(a,x)),ease=x=>x*x*(3-2*x),lerp=(a,b,t)=>a+(b-a)*t;
 const arts=scenes.map(sc=>sc.querySelector('.bf-art')),boxes=arts.map(a=>a.dataset.box.split(',').map(Number));
 const fly=document.getElementById('bf-b'),spr=document.getElementById('bf-spr'),sealed=document.getElementById('bf-sealed'),cutBtn=document.getElementById('bf-cutbtn'),ribbon=document.getElementById('bf-ribbon');
 const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let vw=0,vh=0,geo=[],forced=false,intro=null,ribFrac=.5,colW=0,colX=0;
 if(still){track.classList.add('bf-static');html.classList.add('bf-static');if(sealed)sealed.classList.add('cut')}
 function measure(){vw=window.innerWidth;vh=window.innerHeight;geo=arts.map((a,i)=>{const W=a.offsetWidth,H=a.offsetHeight,b=boxes[i];const bw=b[2]/100*W,bh=b[3]/100*H;let Z=Math.min(vw*.9,520)/bw;Z=Math.max(1,Math.min(Z,(vh*.8)/bh,3.2));if(!SC[i].zoom)Z=1;return{W,H,dx:((b[0]+b[2]/2)/100-.5)*W,dy:((b[1]+b[3]/2)/100-.5)*H,Z}});
  colW=Math.min(vw,...geo.map(g=>g.W));colX=(vw-colW)/2;
  if(ribbon&&arts[2]){const ar=arts[2].getBoundingClientRect(),rr=ribbon.getBoundingClientRect();if(ar.height>0)ribFrac=((rr.top+rr.height/2)-ar.top)/ar.height}}
 /* flight path: [scroll position, x%, y%, scale, flap speed (0 slow .. 1 fast)] ; y 'R' = the ribbon */
 const BK=[[0,78,16,.62,.8],[.45,82,19,.62,.8],[.95,86,28,.64,.9],[1.2,93,46,.64,1],[1.45,90,70,.64,1],[1.7,62,88,.62,1],[1.9,14,74,.62,1],[2.1,9,46,.64,1],[2.3,30,24,.66,1],[2.52,50,14,.74,.15],[3,50,14,.74,.12],[3.1,50,26,.72,.9],[3.28,47,42,.72,1],[3.42,50,'R',.72,1],[3.55,50,'R',.72,1],[3.72,58,40,.7,1],[3.98,88,13,.56,1],[4.5,84,17,.52,.6],[5.5,82,20,.52,.5]];
 function ptAt(p,ry){const k=BK.map(r=>[r[0],r[1],r[2]==='R'?ry:r[2],r[3],r[4]]);let j=0;while(j<k.length-2&&p>=k[j+1][0])j++;const a=k[j],b=k[j+1],u=clamp((p-a[0])/(b[0]-a[0]),0,1),e=ease(u);
  const P0=k[Math.max(0,j-1)],P3=k[Math.min(k.length-1,j+2)];const cr=(i)=>{const p0=P0[i],p1=a[i],p2=b[i],p3=P3[i];return .5*((2*p1)+(-p0+p2)*u+(2*p0-5*p1+4*p2-p3)*u*u+(-p0+3*p1-3*p2+p3)*u*u*u)};
  return{x:cr(1),y:cr(2),s:lerp(a[3],b[3],e),f:lerp(a[4],b[4],e)}}
 function place(p,t){
  const r=arts[2].getBoundingClientRect(),ry=((r.top+ribFrac*r.height)/vh)*100;
  const c=ptAt(p,ry),c2=ptAt(p+.012,ry),X=colX+c.x/100*colW,Y=c.y/100*vh;
  let vx=(c2.x-c.x)/100*colW,vy=(c2.y-c.y)/100*vh;const m=Math.hypot(vx,vy)||1;vx/=m;vy/=m;const w=clamp((c.f-.25)/.4,0,1);
  const dx=w*vx,dy=w*vy+(1-w)*-1,rot=Math.atan2(dx,-dy)*180/Math.PI;
  drawFly(X,Y,rot,c.s,c.f,p>=3.05&&p<=3.78)
 }
 let lastFd='';
 function drawFly(X,Y,rot,s,f,hold){fly.style.transform='translate3d('+X.toFixed(1)+'px,'+Y.toFixed(1)+'px,0) translate(-50%,-50%) rotate('+rot.toFixed(1)+'deg) scale('+s.toFixed(3)+')';fly.style.opacity='1';fly.classList.toggle('hold',hold);const fd=(1.7-1.46*clamp(f,0,1)).toFixed(2)+'s';if(fd!==lastFd){spr.style.setProperty('--fd',fd);lastFd=fd}}
 let ticking=false;
 function frame(){
  ticking=false;if(still||!geo.length)return;
  const r=track.getBoundingClientRect(),total=Math.max(1,track.offsetHeight-vh),y=clamp(-r.top,0,total),p=y/(vh*1.4);
  scenes.forEach((sc,i)=>{
   const c=SC[i],g=geo[i],u=p-c.s,d=c.e-c.s,last=i===N-1;
   const op=clamp((u+.4)/.4,0,1)*(last?1:1-clamp((u-(d-.28))/.28,0,1));
   let s;if(u<0)s=.78+.22*ease(clamp(u+1,0,1));else{const k=ease(clamp(u/.4,0,1));s=1+(g.Z-1)*k+(c.zoom?0:.03*clamp(u/.6,0,1))+(!last&&u>d-.3?(u-(d-.3))*.5:0)}
   const kk=u<0?0:ease(clamp(u/.4,0,1));
   sc.style.opacity=op.toFixed(3);sc.style.visibility=op<.01?'hidden':'visible';sc.style.pointerEvents=op>.55?'auto':'none';
   sc.style.setProperty('--k',clamp((u-(i===2?.1:.04))/(i===2?.4:.34),0,1).toFixed(3));
   let tx=-s*g.dx*kk,ty=-s*g.dy*kk;const mx=Math.max(0,(s*g.W-vw)/2),my=Math.max(0,(s*g.H-vh)/2);tx=clamp(tx,-mx,mx);ty=clamp(ty,-my,my);
   arts[i].style.transform='translate3d('+tx.toFixed(1)+'px,'+ty.toFixed(1)+'px,0) scale('+s.toFixed(4)+')';
  });
  if(!intro)place(p);
  if(sealed){const cut=forced||p>=3.5;sealed.classList.toggle('cut',cut||still)}
 }
 function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
 /* butterfly leaves the envelope: time-driven, then the scroll path takes over */
 function startIntro(){
  if(still)return;const a=arts[0].getBoundingClientRect();const mx=a.left+.52*a.width,my=a.top+.27*a.height;
  const c0=ptAt(0,50),hx=colX+c0.x/100*colW,hy=c0.y/100*vh,t0=performance.now(),D=2600;intro=true;
  (function step(now){const tt=clamp((now-t0)/D,0,1),e=ease(tt);
   const x=lerp(mx,hx,e)+Math.sin(tt*10)*colW*.05*(1-tt),y=lerp(my,hy,e)-Math.sin(tt*Math.PI)*vh*.12;
   const vxx=hx-mx,rot=clamp(vxx/vw*40,-25,25)+Math.sin(tt*10)*12*(1-tt);
   drawFly(x,y,rot*(1-tt),lerp(.18,c0.s,e),1,false);
   if(tt<1)requestAnimationFrame(step);else{intro=null;frame()}})(t0);
 }
 const doCut=()=>{forced=true;if(fly){fly.classList.add('hold');setTimeout(()=>fly.classList.remove('hold'),900)}frame()};
 if(cutBtn)cutBtn.onclick=doCut;if(ribbon){ribbon.onclick=doCut;ribbon.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();doCut()}}}
 window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',()=>{measure();req()});window.addEventListener('orientationchange',()=>setTimeout(()=>{measure();req()},250));
 measure();if(!still){fly.style.opacity='0'}frame();window.__bf={measure,frame,startIntro,stage:document.getElementById('bf-stage')};
}
`;

function velvetDocument(data){
 const p=parseDate(data.date);
 const is888=data.template==='888',is999=data.template==='999',is555=data.template==='555',theme=THEMES[data.template]||null,is777=!!theme;
 const {pages,card1}=is555?{pages:bfPages(data,p),card1:''}:is999?{pages:jPages(data,p),card1:''}:is888?{pages:w8Pages(data,p),card1:''}:is777?{pages:artPages(data,p,theme),card1:''}:pageCards(data,p,false);
 const n1=data.name1||'Name one',n2=data.name2||'Name two';
 const mono=((typeof data.monogram==='string'&&data.monogram.trim())||((n1[0]||'')+(n2[0]||''))).slice(0,3);
 const music=typeof data.music==='string'&&/^data:audio\/[\w.+-]+;base64,|^\/media\//.test(data.music)?data.music:null;
 const cover=!data._editorPreview&&data.animation!==false&&data.openingStyle!=='none';
 const target=JSON.stringify(data.date||'').replace(/</g,'\\u003c');
 const autoplay=data.musicAutoplay!==false;
 const OPENENV=`if(cover){
 html.classList.add('vn-lock');page1.classList.add('in','instant');const mainEl=document.querySelector('main');mainEl.inert=true;
 const env=document.getElementById('vn-env'),letter=document.getElementById('vn-letter'),btn=document.getElementById('vn-open'),card1=document.getElementById('vn-card1');
 letter.innerHTML=card1.innerHTML;
 btn.focus({preventScroll:true});
 const finish=()=>{cover.classList.add('fade');const sh=document.getElementById('vn-shower');if(sh&&!reduce){sh.classList.add('go');setTimeout(()=>sh.remove(),9000)}setTimeout(()=>{cover.classList.add('gone');html.classList.remove('vn-lock');mainEl.inert=false;watch();window.scrollTo(0,0)},reduce?200:750)};
 btn.onclick=()=>{if(cover.classList.contains('opening'))return;${autoplay?'startMusic();':''}cover.classList.add('opening');
  if(reduce){finish();return}
  const wb=letter.offsetWidth;const r0=letter.getBoundingClientRect(),cx0=r0.left+r0.width/2,cy0=r0.top+r0.height/2,eh=env.offsetHeight;
  setTimeout(()=>{letter.style.transform='translate(0,'+(-eh*.62)+'px) scale(.6)'},850);
  setTimeout(()=>{cover.classList.add('reveal');letter.classList.add('top');const c=card1.getBoundingClientRect(),dx=c.left+c.width/2-cx0,dy=c.top+c.height/2-cy0,s=c.width/wb;letter.style.transition='transform 1.3s cubic-bezier(.5,0,.15,1)';letter.style.transform='translate('+dx+'px,'+dy+'px) scale('+s+')'},2100);
  setTimeout(finish,3600)};
}else watch();`;
 const OPEN555=`if(cover){
 html.classList.add('vn-lock');const mainEl=document.querySelector('main');mainEl.inert=true;
 const btn=document.getElementById('vn-open');
 const finish=()=>{const sh=document.getElementById('vn-shower');if(sh&&!reduce){sh.classList.add('go');setTimeout(()=>sh.remove(),9000)}cover.classList.add('gone');html.classList.remove('vn-lock');mainEl.inert=false;if(window.__bf)window.__bf.frame();window.scrollTo(0,0)};
 btn.onclick=()=>{if(cover.classList.contains('opening'))return;${autoplay?'startMusic();':''}cover.classList.add('opening');
  if(reduce){finish();return}
  setTimeout(()=>cover.classList.add('rise'),550);
  setTimeout(()=>cover.classList.add('flash'),2350);
  setTimeout(()=>{cover.classList.add('fade');if(window.__bf)window.__bf.startIntro()},2800);
  setTimeout(finish,3700)};
}else if(window.__bf){setTimeout(()=>window.__bf.frame(),0)}`;
 const OPEN999=`if(cover){
 html.classList.add('vn-lock');const mainEl=document.querySelector('main');mainEl.inert=true;
 const btn=document.getElementById('vn-open'),stg=document.getElementById('j-stage');
 const finish=()=>{const sh=document.getElementById('vn-shower');if(sh&&!reduce){sh.classList.add('go');setTimeout(()=>sh.remove(),9000)}cover.classList.add('gone');html.classList.remove('vn-lock');mainEl.inert=false;if(window.__j)window.__j.frame();window.scrollTo(0,0)};
 btn.onclick=()=>{if(cover.classList.contains('opening'))return;${autoplay?'startMusic();':''}cover.classList.add('opening');
  if(reduce){finish();return}
  setTimeout(()=>{if(stg)stg.classList.add('intro');cover.classList.add('fade')},900);
  setTimeout(finish,1700)};
}`;
 const OPEN888=`if(cover){
 html.classList.add('vn-lock');const mainEl=document.querySelector('main');mainEl.inert=true;
 const btn=document.getElementById('vn-open'),stg=document.getElementById('w8-stage');
 const finish=()=>{const sh=document.getElementById('vn-shower');if(sh&&!reduce){sh.classList.add('go');setTimeout(()=>sh.remove(),9000)}cover.classList.add('gone');html.classList.remove('vn-lock');mainEl.inert=false;if(window.__w8){window.__w8.measure();window.__w8.frame()}window.scrollTo(0,0)};
 btn.onclick=()=>{if(cover.classList.contains('opening'))return;${autoplay?'startMusic();':''}cover.classList.add('opening');
  if(reduce){finish();return}
  setTimeout(()=>cover.classList.add('zoom'),450);
  setTimeout(()=>cover.classList.add('flash'),1750);
  setTimeout(()=>{if(stg)stg.classList.add('intro');cover.classList.add('fade')},2350);
  setTimeout(finish,3050)};
}`;
 const OPEN777=`if(cover){
 html.classList.add('vn-lock');page1.classList.add('in','instant');const mainEl=document.querySelector('main');mainEl.inert=true;
 const btn=document.getElementById('vn-open'),src=page1.querySelector('.a7');btn.addEventListener('keydown',()=>{});
 const wb=document.createElement('div');wb.className='a7w a7wb';const wi=document.createElement('div');wi.className='a7wi';wi.append(src.cloneNode(true));wb.append(wi);cover.insertBefore(wb,cover.querySelector('.vn-dust'));
 const finish=()=>{const sh=document.getElementById('vn-shower');if(sh&&!reduce){sh.classList.add('go');setTimeout(()=>sh.remove(),9000)}cover.classList.add('gone');html.classList.remove('vn-lock');mainEl.inert=false;watch();window.scrollTo(0,0)};
 btn.onclick=()=>{if(cover.classList.contains('opening'))return;${autoplay?'startMusic();':''}cover.classList.add('opening');
  if(reduce){finish();return}
  setTimeout(()=>cover.classList.add('emerge'),1300);setTimeout(finish,5000)};
}else watch();`;
 const coverHTML=cover?(is555?bfCover(data):is999?jCover(data):is888?w8Cover(data,mono):is777?artCover(data,mono,theme):`<div class="vn-cover" id="vn-cover" role="dialog" aria-modal="true" aria-label="Open the invitation">${roses}<div class="vn-castle-bg" aria-hidden="true"></div><div class="vn-bow-big" aria-hidden="true"></div><div class="vn-pearls" aria-hidden="true"></div><div class="vn-env" id="vn-env"><div class="vn-aura"></div><div class="vn-env-back"></div><div class="vn-card vn-letter" id="vn-letter" style="transform:translate(0,0) scale(.6)"></div><div class="vn-env-front"><svg class="vn-lace" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0L50 50L100 0" fill="none" stroke="#f3e6cf" stroke-width="3.2" stroke-dasharray="1.4 2.2" stroke-linecap="round" vector-effect="non-scaling-stroke"/><path d="M4 0L50 44L96 0" fill="none" stroke="#f3e6cf88" stroke-width="1" vector-effect="non-scaling-stroke"/></svg><div class="vn-jewel" style="top:calc(50% - 3%)"></div></div><div class="vn-flap"><svg class="vn-lace" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0L50 100L100 0" fill="none" stroke="#f3e6cf" stroke-width="3.2" stroke-dasharray="1.4 2.2" stroke-linecap="round" vector-effect="non-scaling-stroke"/><path d="M4 0L50 92L96 0" fill="none" stroke="#f3e6cf88" stroke-width="1" vector-effect="non-scaling-stroke"/></svg><div class="vn-jewel"></div></div><button type="button" class="vn-seal" id="vn-open" aria-label="Open the invitation">${e(mono)}</button></div><p class="vn-tap">Tap the seal to open</p>${sparkMarkup}${dustMarkup(16)}</div>`):'';
 const script=`<script>(()=>{
const html=document.documentElement,pagesEls=[...document.querySelectorAll('.vn-page')];
const audio=document.getElementById('music'),mb=document.getElementById('music-button');
function startMusic(){if(!audio)return;audio.play().then(()=>{if(mb)mb.textContent='Ⅱ Pause music'}).catch(()=>{if(mb)mb.textContent='♫ Tap to play music'})}
if(mb)mb.onclick=()=>{if(audio.paused)startMusic();else{audio.pause();mb.textContent='♫ Play music'}};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cover=document.getElementById('vn-cover');
function watch(){const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting)x.target.classList.add('in')}),{threshold:.3}):null;pagesEls.forEach(pg=>io?io.observe(pg):pg.classList.add('in'))}
const page1=document.getElementById('vn-p1');
${is555?OPEN555:is999?OPEN999:is888?OPEN888:is777?OPEN777:OPENENV}
${is888?W8JS:''}${is999?JJS:''}${is555?BFJS:''}
/* scroll progress + gentle parallax */
const bar=document.getElementById('vn-progress');let ticking=false;
function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;const y=window.scrollY,h=document.documentElement.scrollHeight-innerHeight;if(bar)bar.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';if(!reduce)html.style.setProperty('--sy',y)})}
addEventListener('scroll',onScroll,{passive:true});onScroll();
/* countdown */
const target=Date.parse(${target});function tick(){const box=document.getElementById('vn-count');if(!Number.isFinite(target)){if(box)box.hidden=true;return}const s=Math.floor(Math.max(0,target-Date.now())/1000);const v={d:Math.floor(s/86400),h:Math.floor(s/3600)%24,m:Math.floor(s/60)%60,s:s%60};for(const k in v){const n=document.getElementById('vn-'+k);if(n)n.textContent=String(v[k]).padStart(2,'0')}}tick();setInterval(tick,1000);
/* scratch to reveal */
const dp=document.getElementById('vn-datepage')||document.getElementById('vn-final'),box=document.getElementById('vn-scratchbox'),cv=document.getElementById('vn-scratch'),skip=document.getElementById('vn-reveal');
let revealed=false;function reveal(){if(revealed)return;revealed=true;dp.classList.add('revealed');if(cv){cv.style.opacity='0';cv.style.pointerEvents='none'}if(skip)skip.style.display='none'}
if(skip)skip.onclick=reveal;
if(cv&&cv.getContext&&box){const ctx=cv.getContext('2d',{willReadFrequently:true}),dpr=Math.min(window.devicePixelRatio||1,2);let drawing=false,last=null,moves=0;
 const W=Math.max(2,Math.round(box.clientWidth*dpr)),H=Math.max(2,Math.round(box.clientHeight*dpr));cv.width=W;cv.height=H;
 const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#b8862d');g.addColorStop(.35,'#f3dca1');g.addColorStop(.55,'#c9a050');g.addColorStop(.8,'#f6e3ac');g.addColorStop(1,'#a8782a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.strokeStyle='#ffffff40';ctx.lineWidth=1*dpr;for(let x=-H;x<W;x+=14*dpr){ctx.beginPath();ctx.moveTo(x,H);ctx.lineTo(x+H,0);ctx.stroke()}
 ctx.fillStyle='#5a3a10';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='700 '+Math.round(H*.17)+'px Arial';ctx.fillText('SCRATCH HERE',W/2,H*.42);ctx.font=Math.round(H*.12)+'px Arial';ctx.fillText('to reveal our date',W/2,H*.64);
 const pt=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}};
 const cut=(a,b)=>{ctx.globalCompositeOperation='destination-out';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=38*dpr;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()};
 const check=()=>{try{const d=ctx.getImageData(0,0,W,H).data;let c=0,t=0;for(let i=3;i<d.length;i+=160){t++;if(d[i]<128)c++}if(c/t>.5)reveal()}catch{reveal()}};
 cv.addEventListener('pointerdown',e=>{drawing=true;cv.setPointerCapture(e.pointerId);last=pt(e);cut(last,last);e.preventDefault()});
 cv.addEventListener('pointermove',e=>{if(!drawing)return;const n=pt(e);cut(last,n);last=n;if(++moves%10===0)check()});
 const up=()=>{if(drawing){drawing=false;check()}};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
}
/* photo viewer */
document.querySelectorAll('.vn-gallery img').forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');const open=()=>{const o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:90;background:#000e;display:grid;place-items:center;cursor:zoom-out';const i=new Image();i.src=img.src;i.alt=img.alt;i.style.cssText='max-width:96vw;max-height:94vh;object-fit:contain';o.append(i);o.onclick=()=>o.remove();document.body.append(o)};img.onclick=open;img.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}}});
${data._editorPreview?`const known={name1:1,name2:1,heading:1,venue:1,address:1,venueGroom:1,addressGroom:1,parents1:1,parents2:1,family:1,message:1,schedule:1};document.querySelectorAll('[data-edit]').forEach(n=>{const f=n.getAttribute('data-edit');n.style.cursor='pointer';n.addEventListener('click',ev=>{if(f==='photos')return;ev.stopPropagation();parent.postMessage({type:known[f]?'mubiey-direct-text':'mubiey-edit',field:f},'*')})});`:''}
})();<\/script>`;
<<<<<<< HEAD
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>${e(n1)} &amp; ${e(n2)} — Wedding invitation</title><style>${fontCSS()}${is777||is888||is999||is555?arCSS(data.arabicFont):''}${is777?themeVars(theme):''}${CSS}${VPCSS}${RCPCSS}${is777?A7CSS:''}${is888?W8CSS:''}${is999?JCSS:''}${is555?BFCSS:''}</style><noscript><style>.bf-track{height:auto}.bf-stage{position:static;height:auto}.bf-scene{position:relative;opacity:1;visibility:visible;min-height:100svh}.bf-text{--k:1}.bf-fly{display:none}.j-track{height:auto}.j-stage{position:static;height:auto}.j-scene{position:relative;opacity:1;visibility:visible;height:100svh}.j-text{--to:1;--k:1}.w8-track{height:auto}.w8-stage{position:static;height:auto}.w8-scene{position:relative;opacity:1;visibility:visible;min-height:100svh}.w8-text{--k:1}.vn-cover{display:none}</style></noscript><noscript><style>.vn-cover{display:none}.vn-card{opacity:1;transform:none}html.vn-lock,html.vn-lock body{overflow:auto}</style></noscript></head><body><div class="vn-bg"></div><div class="vn-progress" id="vn-progress"></div>${dustMarkup(20)}${defs}${coverHTML}${cover?showerMarkup:''}<main>${pages}${is999?`<section class="vn-extra"><p class="vn-end">Made with Mubiey Studio</p></section>`:`<section class="vn-extra"><div class="vn-count" id="vn-count"><div><b id="vn-d">—</b><small>DAYS</small></div><div><b id="vn-h">—</b><small>HOURS</small></div><div><b id="vn-m">—</b><small>MINUTES</small></div><div><b id="vn-s">—</b><small>SECONDS</small></div></div><p class="vn-end">Made with Mubiey Studio</p></section>`}</main>${music?`<audio id="music" loop preload="none" src="${e(music)}"></audio><button class="vn-music" id="music-button" type="button">♫ Play music</button>`:''}${script}</body></html>`;
=======
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>${e(n1)} &amp; ${e(n2)} — Wedding invitation</title><style>${fontCSS()}${is777||is888||is999||is555?arCSS(data.arabicFont):''}${is777?themeVars(theme):''}${CSS}${VPCSS}${is777?A7CSS:''}${is888?W8CSS:''}${is999?JCSS:''}${is555?BFCSS:''}</style><noscript><style>.bf-track{height:auto}.bf-stage{position:static;height:auto}.bf-scene{position:relative;opacity:1;visibility:visible;min-height:100svh}.bf-text{--k:1}.bf-fly{display:none}.j-track{height:auto}.j-stage{position:static;height:auto}.j-scene{position:relative;opacity:1;visibility:visible;height:100svh}.j-text{--to:1;--k:1}.w8-track{height:auto}.w8-stage{position:static;height:auto}.w8-scene{position:relative;opacity:1;visibility:visible;min-height:100svh}.w8-text{--k:1}.vn-cover{display:none}</style></noscript><noscript><style>.vn-cover{display:none}.vn-card{opacity:1;transform:none}html.vn-lock,html.vn-lock body{overflow:auto}</style></noscript></head><body><div class="vn-bg"></div><div class="vn-progress" id="vn-progress"></div>${dustMarkup(20)}${defs}${coverHTML}${cover?showerMarkup:''}<main>${pages}${is999?`<section class="vn-extra"><p class="vn-end">Made with Mubiey Studio</p></section>`:`<section class="vn-extra"><div class="vn-count" id="vn-count"><div><b id="vn-d">—</b><small>DAYS</small></div><div><b id="vn-h">—</b><small>HOURS</small></div><div><b id="vn-m">—</b><small>MINUTES</small></div><div><b id="vn-s">—</b><small>SECONDS</small></div></div><p class="vn-end">Made with Mubiey Studio</p></section>`}</main>${music?`<audio id="music" loop preload="none" src="${e(music)}"></audio><button class="vn-music" id="music-button" type="button">♫ Play music</button>`:''}${script}</body></html>`;
>>>>>>> d5b0a46e1e7988217002f4a63a3690eeb9373b21
}

invitationDocument=function(data){return data&&(THEMES[data.template]||data.template==='888'||data.template==='999'||data.template==='555'||data.template===VELVET||data.template===LEGACY)?velvetDocument(data):baseDocument(data)};
})();
