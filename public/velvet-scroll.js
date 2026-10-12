/* HEAVY LUXURY · Envelope Scroll Story (template id: heavy-luxury; legacy id velvet-nikah-scroll still works)
   Sealed burgundy envelope -> tap -> the letter slides out and fills the screen -> pages scroll one by one:
   verse page, blessing page, save-the-date calendar with a SCRATCH-TO-REVEAL date, optional programme and
   gallery pages, final details page, then countdown / directions / RSVP.
   All artwork is original CSS/SVG. Every text is editable by the owner; guests see no editing controls.
   Layered on invitationDocument() like the other templates, so nothing existing is replaced. */
'use strict';
(()=>{
if(typeof invitationDocument!=='function')return;
const VELVET='heavy-luxury',LEGACY='velvet-nikah-scroll';
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
 return `<radialGradient id="${id}g" cx="50%" cy="45%" r="62%"><stop offset="0" stop-color="${a}"/><stop offset=".62" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient><symbol id="${id}" viewBox="-50 -50 100 100"><g fill="url(#${id}g)" stroke="#00000055" stroke-width="1">${petals}${mid}<circle r="9"/><path d="M-7 0a7 7 0 1 1 7 7" fill="none" stroke="#ffffff44" stroke-width="1.6"/></g></symbol>`};
const bowSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 64"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9a1f38"/><stop offset="1" stop-color="#4a0916"/></linearGradient><radialGradient id="p" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#cdb99a"/></radialGradient></defs><path d="M60 26C44 6 10 4 6 18c-3 14 28 22 54 8z" fill="url(#a)" stroke="#2a050c" stroke-width="1.2"/><path d="M60 26C76 6 110 4 114 18c3 14-28 22-54 8z" fill="url(#a)" stroke="#2a050c" stroke-width="1.2"/><path d="M52 30L38 60l14-8 6 10zM68 30l14 30-14-8-6 10z" fill="url(#a)" stroke="#2a050c" stroke-width="1"/><rect x="50" y="18" width="20" height="16" rx="5" fill="#7a1228" stroke="#2a050c" stroke-width="1.2"/><circle cx="60" cy="48" r="5.5" fill="url(#p)" stroke="#8a7a5a" stroke-width=".6"/><path d="M60 34v8" stroke="#c9a050" stroke-width="1.2"/></svg>';
const castleSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70"><g fill="#7a1426" fill-opacity=".62"><path d="M0 70V48h10v-8h4v8h6V30l-4-3v-9l8-8 8 8v9l-4 3v18h8V36h6V20l-5-4 11-16 11 16-5 4v16h6v12h8V30l-4-3v-9l8-8 8 8v9l-4 3v18h6v-8h4v8h10v22z"/></g><g fill="#f6e9d0" fill-opacity=".8"><rect x="66" y="24" width="3" height="7" rx="1.4"/><rect x="71" y="24" width="3" height="7" rx="1.4"/><rect x="68.5" y="42" width="3" height="8" rx="1.4"/><rect x="27" y="22" width="3" height="6" rx="1.4"/><rect x="110" y="22" width="3" height="6" rx="1.4"/></g></svg>';
const uri=x=>'url("data:image/svg+xml,'+encodeURIComponent(x)+'")';
const cornerRoses='<i class="vn-shine" aria-hidden="true"></i>'+'<svg class="vn-cr a" viewBox="-50 -50 100 100" aria-hidden="true"><use href="#vn-r"/></svg><svg class="vn-cr b" viewBox="-50 -50 100 100" aria-hidden="true"><use href="#vn-c"/></svg><svg class="vn-cr c" viewBox="-50 -50 100 100" aria-hidden="true"><use href="#vn-r"/></svg>';
const defs=`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${rose('vn-r','#b3203a','#6e0d20','#34050f')}${rose('vn-c','#fff4df','#ecd2ac','#b88c5e')}</defs></svg>`;
const roses=`<div class="vn-roses" aria-hidden="true"><svg class="vn-rs a" viewBox="-50 -50 100 100"><use href="#vn-r"/></svg><svg class="vn-rs b" viewBox="-50 -50 100 100"><use href="#vn-c"/></svg><svg class="vn-rs c" viewBox="-50 -50 100 100"><use href="#vn-r"/></svg><svg class="vn-rs d" viewBox="-50 -50 100 100"><use href="#vn-c"/></svg><svg class="vn-rs f" viewBox="-50 -50 100 100"><use href="#vn-r"/></svg><svg class="vn-rs g" viewBox="-50 -50 100 100"><use href="#vn-c"/></svg></div>`;

const CSS=`
*{box-sizing:border-box}html{scroll-snap-type:y proximity;scroll-behavior:smooth}html.vn-lock,html.vn-lock body{overflow:hidden}
body{margin:0;color:#f4e6cc;background:#1f060d;font-family:AtelierSerif,'Cormorant Garamond',Georgia,serif}
.vn-bg{position:fixed;inset:0;z-index:-1;background:radial-gradient(circle at 15% 8%,#5f1226,transparent 46%),radial-gradient(circle at 88% 92%,#4c0e1d,transparent 50%),repeating-linear-gradient(45deg,#ffffff05 0 2px,transparent 2px 14px),#1f060d}
.vn-page{min-height:100svh;display:flex;align-items:center;justify-content:center;padding:20px 0;position:relative;overflow:hidden;scroll-snap-align:center}
.vn-roses{position:absolute;inset:0;pointer-events:none;z-index:0}
.vn-rs{position:absolute;width:30vmin;height:30vmin;filter:drop-shadow(0 6px 10px #0008)}
.vn-rs.a{left:-9vmin;top:-8vmin;transform:rotate(15deg)}.vn-rs.b{left:-4vmin;top:10vmin;width:20vmin;height:20vmin;transform:rotate(-30deg)}
.vn-rs.c{right:-10vmin;top:-6vmin;transform:rotate(-20deg)}.vn-rs.d{right:-5vmin;bottom:-6vmin;width:34vmin;height:34vmin}
.vn-rs.f{left:-8vmin;bottom:-9vmin;width:34vmin;height:34vmin;transform:rotate(40deg)}.vn-rs.g{right:-3vmin;top:24vmin;width:18vmin;height:18vmin}
.vn-card{position:relative;z-index:1;container-type:inline-size;width:min(92vw,calc((100svh - 40px)*.58),440px);aspect-ratio:9/15.5;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:9cqw 9cqw;color:#7a1426;
 background:radial-gradient(ellipse at 50% 28%,#fcf3e1,#f2e2c6 68%,#e4cba5);border-radius:40% 40% 2.5% 2.5%/9% 9% 2.5% 2.5%;box-shadow:0 18px 50px #000a,inset 0 0 0 1.6cqw #e9d3ad,inset 0 0 0 1.9cqw #b0864a}
.vn-card:before{content:'';position:absolute;inset:2.8cqw;border:1.1cqw dotted #b0864a99;border-radius:inherit;pointer-events:none;box-shadow:inset 0 0 0 1.5cqw #f4e6cb,inset 0 0 0 1.8cqw #8a1a2e44}
.vn-card:after{content:'';position:absolute;top:-6cqw;left:50%;width:34cqw;height:18cqw;margin-left:-17cqw;background:${uri(bowSvg)} center/contain no-repeat;filter:drop-shadow(0 3px 4px #0006);pointer-events:none;z-index:3}
.vn-cr{position:absolute;width:26cqw;height:26cqw;pointer-events:none;z-index:2;filter:drop-shadow(0 3px 5px #0007)}.vn-cr.a{left:-8cqw;top:18cqw;transform:rotate(20deg)}.vn-cr.b{right:-8cqw;bottom:22cqw;transform:rotate(-25deg);width:22cqw;height:22cqw}.vn-cr.c{left:-7cqw;bottom:-6cqw;transform:rotate(40deg)}
.vn-castle{width:46cqw;height:23cqw;margin-top:auto;background:${uri(castleSvg)} center bottom/contain no-repeat}.vn-amp{font:400 10cqw/1 AtelierAllura,AtelierParisienne,cursive;color:#8a1428;margin:1cqw 0}.vn-comp{font:italic 3.8cqw/1.5 AtelierSerif,Georgia,serif;color:#6b3a3a;margin:3cqw 0 0;border-top:1px solid #8a1a2e44;padding-top:2cqw;width:80%}
.vn-castle-bg{position:absolute;z-index:1;left:50%;top:5vh;width:min(92vw,480px);aspect-ratio:2/1;transform:translateX(-50%);opacity:.5;background:${uri(castleSvg.replace(/#7a1426/g,'#9a5a62').replace('fill-opacity=".62"','fill-opacity=".55"'))} center bottom/contain no-repeat}
.vn-ar{font:400 8.4cqw/1.7 AtelierAmiri,Amiri,'Traditional Arabic',serif;color:#7a1426;margin:0}.vn-ar.sm{font-size:6.6cqw}
.vn-en{font:italic 4.3cqw/1.6 AtelierSerif,Georgia,serif;margin:2cqw 0;color:#6b3a3a;max-width:100%}
.vn-script{font-family:AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;font-weight:400;color:#7a1426;overflow-wrap:anywhere}
.vn-title{font:400 10.5cqw/1.1 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;margin:4cqw 0;color:#3f1620}
.vn-mono{font:400 24cqw/1 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:#7a1426;margin:1cqw 0}
.vn-orn{width:36cqw;height:1px;background:linear-gradient(90deg,transparent,#b0864a,transparent);margin:3cqw auto;position:relative}.vn-orn:after{content:'◆';position:absolute;left:calc(50% - 2cqw);top:-2.4cqw;font-size:4cqw;color:#b0864a;background:#f6e9d0;width:4cqw;text-align:center}
.vn-small{font:600 2.7cqw/1.8 Arial,sans-serif;letter-spacing:.7cqw;text-transform:uppercase;color:#4a1722;margin:0}.vn-small.tiny{font-size:2.3cqw;font-weight:400}
.vn-names{font:400 13cqw/1.08 AtelierAllura,AtelierParisienne,'Brush Script MT',cursive;color:#8a1428;margin:1.5cqw 0;overflow-wrap:anywhere}.vn-with{font:italic 4cqw AtelierSerif,Georgia,serif;margin:0;color:#4a1722}
.vn-title-sm{font:400 9.5cqw/1.15 AtelierAllura,AtelierParisienne,cursive;margin:2cqw 0 1cqw;color:#8a1428}
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
.vn-event{width:100%;border-top:1px solid #b0864a66;padding:2.4cqw 0;margin:0}.vn-event h3{font:400 7.4cqw AtelierAllura,cursive;color:#8a1428;margin:0}.vn-event p{margin:.5cqw 0;font:3.6cqw/1.45 Georgia,serif;color:#4a1722;white-space:pre-wrap}
.vn-gallery{position:relative;z-index:1;display:grid;grid-template-columns:repeat(2,1fr);gap:14px;width:min(92vw,720px);padding:30px 0}.vn-gallery h2{grid-column:1/-1;text-align:center;font:400 clamp(34px,8vw,56px) AtelierAllura,cursive;margin:0;color:#f3dca1}
.vn-gallery img{width:100%;aspect-ratio:3/4;object-fit:cover;border:7px solid #f6e9d0;box-shadow:0 10px 26px #000a;cursor:zoom-in}.vn-gallery img:nth-child(odd){transform:rotate(-1.4deg)}.vn-gallery img:nth-child(even){transform:rotate(1.4deg)}
.vn-extra{position:relative;z-index:1;text-align:center;padding:36px 20px 90px;scroll-snap-align:start}
.vn-count{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:420px;margin:0 auto 26px}.vn-count div{border:1px solid #d9b46a66;border-radius:8px;padding:10px 2px;background:#2a050c88}.vn-count b{display:block;font:400 34px/1.2 Georgia,serif;color:#f3dca1}.vn-count small{font:9px Arial,sans-serif;letter-spacing:2px;color:#d9b46a}
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
.vn-shower i{position:absolute;top:-30px;left:var(--x);width:var(--w);height:calc(var(--w)*1.6);border-radius:80% 0 80% 0;background:linear-gradient(135deg,#e0283f,#8a1020);opacity:0}.vn-shower i:nth-child(3n){background:linear-gradient(135deg,#fff4df,#d9b98c)}
.vn-shower.go i{animation:vn-fall2 var(--t) var(--d) ease-in forwards}@keyframes vn-fall2{0%{opacity:0;transform:translate3d(0,-30px,0) rotate(var(--r))}12%{opacity:.95}100%{opacity:.9;transform:translate3d(var(--dx),108vh,0) rotate(calc(var(--r) + 400deg))}}
.vn-progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:75;transform-origin:0 50%;transform:scaleX(0);background:linear-gradient(90deg,#8a6a2a,#f3dca1,#c9a050);box-shadow:0 0 10px #e9bf62aa;pointer-events:none}
@media(prefers-reduced-motion:reduce){.vn-dust,.vn-shower,.vn-spark,.vn-sparks,.vn-aura,.vn-progress{display:none!important}.vn-rs,.vn-env,.vn-env:before,.vn-seal:after,.vn-shine:before{animation:none!important}}
@media print{.vn-cover{display:none!important}.vn-dust,.vn-shower,.vn-progress{display:none!important}html.vn-lock,html.vn-lock body{overflow:visible}.vn-card{opacity:1;transform:none}.vn-page{break-inside:avoid}.vn-music{display:none}}`;

function pageCards(data,p){
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
 /* 2 · save the date, scratch to reveal */
 pages.push(`<section class="vn-page" id="vn-datepage">${roses}<div class="vn-card"><div class="vn-ar sm" dir="rtl" lang="ar">${e(DEFAULTS.bismillahArabic)}</div><p class="vn-en">“${e(DEFAULTS.bismillah)}”</p><div class="vn-title-sm">Save the date</div>${calendar(p)}<div class="vn-scratchbox" id="vn-scratchbox"><div class="vn-secret" data-edit="event-date">${secret}</div><canvas id="vn-scratch" aria-label="Scratch to reveal the wedding date"></canvas>${miniSparks}</div><button type="button" class="vn-skip" id="vn-reveal">Scratch to reveal · or tap here</button>${cornerRoses}</div></section>`);
 if(sched.length)pages.push(`<section class="vn-page">${roses}<div class="vn-card" style="justify-content:flex-start;padding-top:18cqw"><div class="vn-title-sm">Moments of the day</div><div class="vn-orn"></div><div style="width:100%" data-edit="schedule">${sched.map(s=>`<article class="vn-event"><h3>${e(s.title)}</h3><p>${e(s.time)}</p><p>${e(s.detail)}</p></article>`).join('')}</div>${cornerRoses}</div></section>`);
 if(photos.length)pages.push(`<section class="vn-page" id="vn-gallery-page">${roses}<div class="vn-gallery" data-edit="photos"><h2>${e(data.galleryTitle||'Our favourite memories')}</h2>${photos.map((s,i)=>`<img src="${e(s)}" alt="Wedding memory ${i+1}" loading="lazy">`).join('')}</div></section>`);
 /* 3 · details + directions */
 const dateBlock=p?`<p class="vn-small tiny" style="margin-top:2cqw">ON</p><p class="vn-small">${MONTHS[p.mo-1]}</p><p class="vn-small" style="font-size:3.6cqw;letter-spacing:.9cqw;border-top:1px solid #8a1a2e66;border-bottom:1px solid #8a1a2e66;padding:1cqw 3cqw;margin:1cqw 0">${DAYS[p.wd]} &nbsp;|&nbsp; <b style="font-size:7cqw;font-weight:400;font-family:Georgia,serif">${p.d}</b> &nbsp;|&nbsp; ${e(timeShown)}</p><p class="vn-small">${p.y}</p>`:'<p class="vn-small">Date to be announced</p>';
 const par=(v,f)=>(typeof v==='string'&&v.trim())?`<p class="vn-small tiny" data-edit="${f}" style="margin:0">${lines(v.trim())}</p>`:'';
 pages.push(`<section class="vn-page" id="vn-final">${roses}<div class="vn-card">${(data.family||'').trim()?`<p class="vn-small" data-edit="family" style="margin:0 0 1cqw">${lines(data.family.trim())}</p>`:''}<p class="vn-small tiny" data-edit="message" style="max-width:82%;margin:0">${lines(wording)}</p><div class="vn-names" data-edit="name1">${e(n1)}</div>${par(data.parents1,'parents1')}<div class="vn-amp">&amp;</div><div class="vn-names" data-edit="name2">${e(n2)}</div>${par(data.parents2,'parents2')}${dateBlock}<p class="vn-small" style="margin-top:2cqw" data-edit="venue">VENUE: ${e(data.venue||'To be announced')}</p>${data.address?`<p class="vn-small tiny" data-edit="address" style="margin:0">${lines(data.address)}</p>`:''}<div>${map?`<a class="vn-link" href="${e(map)}" target="_blank" rel="noopener noreferrer">GET DIRECTIONS ↗</a>`:''}${rsvp?` <a class="vn-link" href="${e(rsvp)}" target="_blank" rel="noopener noreferrer">RSVP ↗</a>`:''}</div><p class="vn-comp" data-edit="compliments">${lines(pick(data.compliments,'compliments'))}</p><div class="vn-castle" aria-hidden="true"></div>${cornerRoses}</div></section>`);
 /* 4 · last page: blessing */
 pages.push(`<section class="vn-page" id="vn-last">${roses}<div class="vn-card"><div class="vn-ar sm" data-edit="blessingArabic" dir="rtl" lang="ar">${e(blAr)}</div><div class="vn-orn"></div><p class="vn-en" data-edit="blessing">“${lines(bl)}”</p><p class="vn-small tiny" data-edit="rsvpText" style="margin-top:6cqw">${lines(pick(data.rsvpText,'rsvpText'))}</p>${cornerRoses}</div></section>`);
 return {pages:pages.join(''),card1};
}

const dustMarkup=n=>`<div class="vn-dust" aria-hidden="true">${Array.from({length:n},(_,i)=>`<i style="--x:${(i*53+9)%100}%;--s:${2+(i%4)}px;--d:${-((i*1.9)%14).toFixed(1)}s;--t:${(11+(i%5)*2.2).toFixed(1)}s;--dx:${((i%7)-3)*14}px"></i>`).join('')}</div>`;
const sparkMarkup=`<div aria-hidden="true">${Array.from({length:18},(_,i)=>{const a=i/18*Math.PI*2,r=110+(i%4)*45;return `<i class="vn-spark" style="--x:${Math.round(Math.cos(a)*r)}px;--y:${Math.round(Math.sin(a)*r)}px"></i>`}).join('')}</div>`;
const miniSparks=`<div class="vn-sparks" aria-hidden="true">${Array.from({length:16},(_,i)=>{const a=i/16*Math.PI*2,r=60+(i%3)*28;return `<i style="--x:${Math.round(Math.cos(a)*r*1.6)}px;--y:${Math.round(Math.sin(a)*r)}px"></i>`}).join('')}</div>`;
const showerMarkup=`<div class="vn-shower" id="vn-shower" aria-hidden="true">${Array.from({length:26},(_,i)=>`<i style="--x:${(i*37+5)%100}%;--w:${9+(i%4)*3}px;--d:${(.1+(i%9)*.3).toFixed(2)}s;--t:${(3.6+(i%5)*.5).toFixed(2)}s;--r:${(i*47)%360}deg;--dx:${((i%7)-3)*22}px"></i>`).join('')}</div>`;
function velvetDocument(data){
 const p=parseDate(data.date);
 const {pages,card1}=pageCards(data,p);
 const n1=data.name1||'Name one',n2=data.name2||'Name two';
 const mono=((typeof data.monogram==='string'&&data.monogram.trim())||((n1[0]||'')+(n2[0]||''))).slice(0,3);
 const music=typeof data.music==='string'&&/^data:audio\/[\w.+-]+;base64,|^\/media\//.test(data.music)?data.music:null;
 const cover=!data._editorPreview&&data.animation!==false&&data.openingStyle!=='none';
 const target=JSON.stringify(data.date||'').replace(/</g,'\\u003c');
 const autoplay=data.musicAutoplay!==false;
 const coverHTML=cover?`<div class="vn-cover" id="vn-cover" role="dialog" aria-modal="true" aria-label="Open the invitation">${roses}<div class="vn-castle-bg" aria-hidden="true"></div><div class="vn-env" id="vn-env"><div class="vn-aura"></div><div class="vn-env-back"></div><div class="vn-card vn-letter" id="vn-letter" style="transform:translate(0,0) scale(.6)"></div><div class="vn-env-front"><svg class="vn-lace" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0L50 50L100 0" fill="none" stroke="#f3e6cf" stroke-width="3.2" stroke-dasharray="1.4 2.2" stroke-linecap="round" vector-effect="non-scaling-stroke"/><path d="M4 0L50 44L96 0" fill="none" stroke="#f3e6cf88" stroke-width="1" vector-effect="non-scaling-stroke"/></svg><div class="vn-jewel" style="top:calc(50% - 3%)"></div></div><div class="vn-flap"><svg class="vn-lace" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0L50 100L100 0" fill="none" stroke="#f3e6cf" stroke-width="3.2" stroke-dasharray="1.4 2.2" stroke-linecap="round" vector-effect="non-scaling-stroke"/><path d="M4 0L50 92L96 0" fill="none" stroke="#f3e6cf88" stroke-width="1" vector-effect="non-scaling-stroke"/></svg><div class="vn-jewel"></div></div><button type="button" class="vn-seal" id="vn-open" aria-label="Open the invitation">${e(mono)}</button></div><p class="vn-tap">Tap the seal to open</p>${sparkMarkup}${dustMarkup(16)}</div>`:'';
 const script=`<script>(()=>{
const html=document.documentElement,pagesEls=[...document.querySelectorAll('.vn-page')];
const audio=document.getElementById('music'),mb=document.getElementById('music-button');
function startMusic(){if(!audio)return;audio.play().then(()=>{if(mb)mb.textContent='Ⅱ Pause music'}).catch(()=>{if(mb)mb.textContent='♫ Tap to play music'})}
if(mb)mb.onclick=()=>{if(audio.paused)startMusic();else{audio.pause();mb.textContent='♫ Play music'}};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cover=document.getElementById('vn-cover');
function watch(){const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting)x.target.classList.add('in')}),{threshold:.3}):null;pagesEls.forEach(pg=>io?io.observe(pg):pg.classList.add('in'))}
const page1=document.getElementById('vn-p1');
if(cover){
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
}else watch();
/* scroll progress + gentle parallax */
const bar=document.getElementById('vn-progress');let ticking=false;
function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;const y=window.scrollY,h=document.documentElement.scrollHeight-innerHeight;if(bar)bar.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';if(!reduce)html.style.setProperty('--sy',y)})}
addEventListener('scroll',onScroll,{passive:true});onScroll();
/* countdown */
const target=Date.parse(${target});function tick(){const box=document.getElementById('vn-count');if(!Number.isFinite(target)){if(box)box.hidden=true;return}const s=Math.floor(Math.max(0,target-Date.now())/1000);const v={d:Math.floor(s/86400),h:Math.floor(s/3600)%24,m:Math.floor(s/60)%60,s:s%60};for(const k in v){const n=document.getElementById('vn-'+k);if(n)n.textContent=String(v[k]).padStart(2,'0')}}tick();setInterval(tick,1000);
/* scratch to reveal */
const dp=document.getElementById('vn-datepage'),box=document.getElementById('vn-scratchbox'),cv=document.getElementById('vn-scratch'),skip=document.getElementById('vn-reveal');
let revealed=false;function reveal(){if(revealed)return;revealed=true;dp.classList.add('revealed');if(cv){cv.style.opacity='0';cv.style.pointerEvents='none'}if(skip)skip.style.display='none'}
if(skip)skip.onclick=reveal;
if(cv&&cv.getContext&&box){const ctx=cv.getContext('2d'),dpr=Math.min(window.devicePixelRatio||1,2);let drawing=false,last=null,moves=0;
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
${data._editorPreview?`const known={name1:1,name2:1,heading:1,venue:1,address:1,message:1,schedule:1};document.querySelectorAll('[data-edit]').forEach(n=>{const f=n.getAttribute('data-edit');n.style.cursor='pointer';n.addEventListener('click',ev=>{if(f==='photos')return;ev.stopPropagation();parent.postMessage({type:known[f]?'mubiey-direct-text':'mubiey-edit',field:f},'*')})});`:''}
})();<\/script>`;
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>${e(n1)} &amp; ${e(n2)} — Wedding invitation</title><style>${fontCSS()}${CSS}</style><noscript><style>.vn-cover{display:none}.vn-card{opacity:1;transform:none}html.vn-lock,html.vn-lock body{overflow:auto}</style></noscript></head><body><div class="vn-bg"></div><div class="vn-progress" id="vn-progress"></div>${dustMarkup(20)}${defs}${coverHTML}${cover?showerMarkup:''}<main>${pages}<section class="vn-extra"><div class="vn-count" id="vn-count"><div><b id="vn-d">—</b><small>DAYS</small></div><div><b id="vn-h">—</b><small>HOURS</small></div><div><b id="vn-m">—</b><small>MINUTES</small></div><div><b id="vn-s">—</b><small>SECONDS</small></div></div><p class="vn-end">Made with Mubiey Studio</p></section></main>${music?`<audio id="music" loop preload="none" src="${e(music)}"></audio><button class="vn-music" id="music-button" type="button">♫ Play music</button>`:''}${script}</body></html>`;
}

invitationDocument=function(data){return data&&(data.template===VELVET||data.template===LEGACY)?velvetDocument(data):baseDocument(data)};
})();
