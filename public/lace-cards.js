/* Premium card maker for the Cards section and the live-invitation exports.
   - Lace & Bow cards: the template's own artwork (assets/<n>/details.jpg) with your text on top.
   - Royal gold cards: six vector designs drawn here (no image files needed).
   Every card can carry "With best wishes from <name>" and a QR code that opens the location in Google Maps. */
(()=>{
'use strict';
if(typeof atelierFontCSS!=='function'||typeof atelierFontsReady!=='function'||typeof Studio==='undefined')return;
const onCards=typeof cardSVG==='function'&&typeof openTemplate==='function'&&typeof getTemplate==='function'&&typeof PREMIUM_FEATURED!=='undefined';

/* ---------- designs ---------- */
const LACE={
 'lace-777':{ink:'#7a1426',dark:'#3f1620'},
 'lace-111':{ink:'#0f5a43',dark:'#0a2f25'},
 'lace-222':{ink:'#1d3a78',dark:'#101e40'},
 'lace-333':{ink:'#5a2a7e',dark:'#2f1444'},
 'lace-444':{ink:'#2b2b30',dark:'#141416'}
};
const ROYAL={
 'royal-ivory':   {name:'Ivory & Gold Crest',     bg1:'#f8f2e6',bg2:'#eee1c6',gold:'#b08a3e',ink:'#6b1d2a',body:'#3d2b22',dark:false},
 'royal-emerald': {name:'Emerald & Gold Crest',   bg1:'#0f3d2d',bg2:'#082a1f',gold:'#d4b062',ink:'#f2dfae',body:'#f4ecd6',dark:true},
 'royal-navy':    {name:'Midnight Navy & Gold',   bg1:'#162452',bg2:'#0b1432',gold:'#d9bb6c',ink:'#f1dfae',body:'#f2eee3',dark:true},
 'royal-burgundy':{name:'Burgundy & Gold Crest',  bg1:'#5c1526',bg2:'#380b16',gold:'#d9b36a',ink:'#f6e2b6',body:'#f7eee0',dark:true},
 'royal-blush':   {name:'Blush & Rose Gold',      bg1:'#fbece7',bg2:'#f1d5cd',gold:'#b9835f',ink:'#8a3b4d',body:'#5a3a3f',dark:false},
 'royal-noir':    {name:'Noir & Gold Crest',      bg1:'#1d1d20',bg2:'#0d0d0f',gold:'#cfae62',ink:'#f1dfae',body:'#eee8da',dark:true}
};
const PAPER='#f4ece0';             /* lace artwork is 832 x 1288 px -> 600 x 929 */
const art={},pending={};

const isLace=id=>!!LACE[id],isRoyal=id=>!!ROYAL[id];
const tplFor=id=>{
 if(isLace(id)){const c=(typeof PREMIUM_FEATURED!=='undefined'&&PREMIUM_FEATURED.find(x=>x.id===id))||{};return {id,lace:true,template:id.slice(5),name:c.name||'Lace & Bow',tradition:'Muslim',style:'Traditional',palette:0}}
 const r=ROYAL[id];return {id,royal:true,name:r.name,tradition:'Muslim',style:'Traditional',palette:0,floral:false,premium:true,tag:'Gold'};
};

/* ---------- helpers ---------- */
function readData(url){return fetch(url).then(r=>{if(!r.ok)throw Error('Could not load the card artwork. Please retry.');return r.blob()}).then(b=>new Promise((res,rej)=>{const f=new FileReader();f.onload=()=>res(f.result);f.onerror=()=>rej(Error('Could not read the card artwork.'));f.readAsDataURL(b)}))}
function ensure(id){
 if(!isLace(id))return atelierFontsReady();
 if(art[id])return Promise.resolve();
 const n=id.slice(5);
 return pending[id]||(pending[id]=Promise.all([readData('/assets/'+n+'/details.jpg').then(v=>{art[id]=v}),atelierFontsReady()]).catch(e=>{pending[id]=null;throw e}));
}
function wrap(s,max){const lines=[];let row='';for(const w of String(s||'').split(/\s+/).filter(Boolean)){if((row+' '+w).trim().length>max&&row){lines.push(row);row=w}else row=(row?row+' ':'')+w}if(row)lines.push(row);return lines}

/* Google Maps links whose pin is written as degrees/minutes/seconds open slowly; turn them into a plain coordinate link */
function mapNorm(href){try{const u=new URL(href);const p=decodeURIComponent(u.pathname.replace(/\+/g,' '));const m=/(\d{1,3})\s*°\s*(\d{1,2})\s*['′]\s*(\d{1,2}(?:\.\d+)?)\s*["″]?\s*([NS])[\s,]*(\d{1,3})\s*°\s*(\d{1,2})\s*['′]\s*(\d{1,2}(?:\.\d+)?)\s*["″]?\s*([EW])/i.exec(p);if(!m)return href;const lat=(+m[1]+ +m[2]/60+ +m[3]/3600)*(/s/i.test(m[4])?-1:1),lng=(+m[5]+ +m[6]/60+ +m[7]/3600)*(/w/i.test(m[8])?-1:1);if(!isFinite(lat)||!isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180)return href;return 'https://www.google.com/maps/search/?api=1&query='+lat.toFixed(6)+','+lng.toFixed(6)}catch{return href}}
function qrUrl(v){v=String(v||'').trim();if(!v||v.length>480)return '';try{const u=new URL(v);if(u.protocol!=='https:'&&u.protocol!=='http:')return '';return mapNorm(u.href)}catch{return ''}}

/* ---------- shared card layout ---------- */
function drawCard(data,c,P){
 const esc=Studio.escape;
 const T=(s,y,size,fill,font,extra='')=>`<text x="300" y="${y}" text-anchor="middle" font-family="${font}" font-size="${size}" fill="${fill}" ${extra}>${esc(s)}</text>`;
 const nameSize=Math.max(25,Math.min(57,Number(data.nameSize)||48));
 const fit=v=>{const len=Math.max(1,[...v].length);return Math.max(18,Math.min(nameSize,P.fitW/(len*(c.script?.40:.56))))};
 const heading=data.heading||'In the name of Allah, the Most Merciful',n1=data.name1||'Muhammad',n2=data.name2||'Fathima';
 let o='';
 wrap(heading,40).slice(0,2).forEach((s,i)=>o+=T(s,P.head+i*20,13,c.body,c.bodyFont,'font-style="italic"'));
 o+=T('WEDDING INVITATION',P.wi,10.5,c.accent,c.bodyFont,'letter-spacing="4"');
 o+=T(n1,P.n1,fit(n1),c.ink,c.nameFont);
 o+=T('&',P.amp,28,c.accent,c.bodyFont,'font-style="italic"');
 o+=T(n2,P.n2,fit(n2),c.ink,c.nameFont);
 o+=`<path d="M255 ${P.line}H345" stroke="${c.accent}" stroke-width="1" fill="none"/>`;
 wrap(data.dateText||'Date & time to be confirmed',38).slice(0,2).forEach((s,i)=>o+=T(s,P.date+i*22,15,c.body,c.bodyFont,'font-weight="600"'));
 const vl=wrap(data.venue||'Venue to be announced',44).slice(0,3);
 vl.forEach((s,i)=>o+=T(s,P.venue+i*19,12.5,c.body,c.bodyFont));
 const ny=Math.max(P.noteMin,P.venue+(vl.length-1)*19+34),nl=wrap(data.note||'Your presence will make our day complete.',48).slice(0,2);
 nl.forEach((s,i)=>o+=T(s,ny+i*17,11.5,c.body,c.bodyFont,'font-style="italic"'));
 const end=ny+(nl.length-1)*17;

 /* best wishes + location QR */
 const wishes=String(data.wishes||'').trim().slice(0,60),url=qrUrl(data.mapUrl);
 if(wishes){
  let wy=Math.max(end+30,P.wishMin);if(url)wy=Math.min(wy,P.plaque-46);
  o+=T('WITH BEST WISHES FROM',wy,9.5,c.accent,c.bodyFont,'letter-spacing="3"');
  const len=Math.max(1,[...wishes].length);o+=T(wishes,wy+29,Math.max(15,Math.min(28,270/(len*(c.script?.40:.56)))),c.ink,c.nameFont);
 }
 if(url&&window.MubieyQR){
  try{
   const x=300-58,y=P.plaque,q=window.MubieyQR.path(url,{x:x+16,y:y+10,size:84,level:'M'});
   o+=`<rect x="${x}" y="${y}" width="116" height="124" rx="10" fill="#fffaf2" stroke="${c.accent}" stroke-width="1.2"/><path d="${q.d}" fill="#1b1115"/>`;
   o+=T('SCAN FOR LOCATION',y+113,7,'#4a3a33','Arial,sans-serif','letter-spacing="1" font-weight="700"');
  }catch(e){}
 }
 return o;
}

function fontsFor(data,thumb){
 const script=data.font==='cursive'&&!thumb;
 const base=['Georgia','Times New Roman','Arial','Verdana'].includes(data.font)?data.font:'Georgia';
 return {script,nameFont:script?'AtelierAllura,AtelierScript,cursive':base+',serif',bodyFont:script?'AtelierSerif,Georgia,serif':base+',serif'};
}

/* ---------- Lace & Bow (artwork) ---------- */
function laceSVG(data,tpl){
 const L=LACE[tpl.id]||LACE['lace-777'],hex=v=>/^#[a-f0-9]{6}$/i.test(v||'');
 if(!art[tpl.id])ensure(tpl.id).then(()=>{if(typeof selected!=='undefined'&&selected&&selected.id===tpl.id&&typeof preview==='function')preview()}).catch(()=>{});
 const ink=hex(data.ink)?data.ink:L.ink,body=ink.toLowerCase()===L.ink.toLowerCase()?L.dark:ink,accent=hex(data.accent)?data.accent:L.ink;
 const f=fontsFor(data),c={ink,body,accent,...f};
 const P={head:232,wi:292,n1:372,amp:418,n2:486,line:524,date:556,venue:608,noteMin:664,wishMin:706,plaque:754,fitW:296};
 const o=drawCard(data,c,P);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="929" viewBox="0 0 600 929"><defs><style>${atelierFontCSS(true)}</style></defs><rect width="600" height="929" fill="${PAPER}"/>${art[tpl.id]?`<image href="${art[tpl.id]}" x="0" y="0" width="600" height="929" preserveAspectRatio="none"/>`:''}${o}</svg>`;
}

/* ---------- Royal gold (vector) ---------- */
function royalFrame(R){
 const g=R.gold,corner=(tx,ty,sx,sy)=>`<g transform="translate(${tx} ${ty}) scale(${sx} ${sy})" fill="none" stroke="${g}"><path d="M0 62Q0 0 62 0" stroke-width="1.6"/><path d="M0 40Q0 14 26 14" stroke-width="1"/><circle cx="9" cy="9" r="3" fill="${g}" stroke="none"/><path d="M62 0l6 6-6 6-6-6z" fill="${g}" stroke="none"/><path d="M0 62l6 6-6 6-6-6z" fill="${g}" stroke="none"/></g>`;
 const star=(cx,cy,r)=>{let p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.42:r;p.push((cx+rr*Math.cos(a)).toFixed(1)+','+(cy+rr*Math.sin(a)).toFixed(1))}return `<polygon points="${p.join(' ')}" fill="${g}"/>`};
 return `<rect x="16" y="16" width="568" height="808" fill="none" stroke="${g}" stroke-width="2.2"/><rect x="28" y="28" width="544" height="784" fill="none" stroke="${g}" stroke-width=".8"/>`
  +corner(28,28,1,1)+corner(572,28,-1,1)+corner(28,812,1,-1)+corner(572,812,-1,-1)
  +`<rect x="60" y="64" width="480" height="712" rx="3" fill="${R.dark?'#ffffff0d':'#ffffff55'}" stroke="${g}" stroke-width=".6"/>`
  +`<path d="M312 80A24 24 0 1 0 312 120A22 22 0 0 1 312 80Z" fill="${g}"/>${star(324,98,10)}`
  +`<path d="M190 436H282M318 436H410" stroke="${g}" stroke-width="1" fill="none"/><path d="M300 430l6 6-6 6-6-6z" fill="${g}"/>`;
}
function royalSVG(data,tpl,thumb){
 const R=ROYAL[tpl.id]||ROYAL['royal-ivory'],hex=v=>/^#[a-f0-9]{6}$/i.test(v||'');
 const ink=hex(data.ink)?data.ink:R.ink,accent=hex(data.accent)?data.accent:R.gold,bg=hex(data.background)?data.background:R.bg1;
 const body=ink.toLowerCase()===R.ink.toLowerCase()?R.body:ink;
 const f=fontsFor(data,thumb),c={ink,body,accent,...f};
 const P={head:176,wi:216,n1:292,amp:338,n2:400,line:436,date:472,venue:520,noteMin:594,wishMin:628,plaque:676,fitW:380};
 const o=drawCard(data,c,P),R2={...R,gold:accent};
 return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840" viewBox="0 0 600 840"><defs>${thumb?'':`<style>${atelierFontCSS(true)}</style>`}<linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${R.bg2}"/></linearGradient></defs><rect width="600" height="840" fill="${bg}"/><rect width="600" height="840" fill="url(#rg)"/>${royalFrame(R2)}${o}</svg>`;
}
const SAMPLE={name1:'Muhammad',name2:'Fathima',heading:'In the name of Allah',dateText:'Sunday, 22 November 2026',venue:'Venue to be announced',note:'Your presence will make our day complete.',font:'Georgia',nameSize:40,wishes:'',mapUrl:''};
const thumbURI=id=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(royalSVG({...SAMPLE},tplFor(id),true));

/* ---------- Live-invitation exports (PDF keepsake / PNG card / JPG card) ---------- */
window.LaceCard={has:t=>isLace('lace-'+t),ensure,svg:(t,data)=>laceSVG(data,tplFor('lace-'+t))};
if(typeof exportKeepsake==='function'&&typeof collect==='function'&&typeof setBusy==='function'){
 const baseExport=exportKeepsake;
 const fmtDate=v=>{const m=/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(v||'');if(!m)return '';const s=new Date(+m[1],+m[2]-1,+m[3]).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});if(m[4]==null)return s;let h=+m[4];const ap=h>=12?'PM':'AM';h=h%12||12;return s+' · '+h+':'+m[5]+' '+ap};
 exportKeepsake=async function(format){
  let d;try{d=collect()}catch{return baseExport.apply(this,arguments)}
  const id='lace-'+d.template;if(!isLace(id))return baseExport.apply(this,arguments);
  setBusy(true);
  try{
   await atelierReady();await ensure(id);
   const useGroom=!!(d.venueGroom&&d.venueGroom.trim()),venue=(useGroom?d.venueGroom:d.venue||'').trim(),addr=((useGroom?d.addressGroom:d.address)||'').trim();
   const data={name1:d.name1,name2:d.name2,heading:d.heading,note:(d.message||'').slice(0,100),venue:[venue,addr].filter(Boolean).join(', '),dateText:fmtDate(document.querySelector('#event-date')?.value)||'Date to be announced',font:'cursive',nameSize:48,ink:LACE[id].ink,accent:LACE[id].ink,wishes:d.wishesFrom||'',mapUrl:(useGroom?d.mapUrlGroom:d.mapUrl)||d.mapUrl||d.mapUrlGroom||''};
   const canvas=await Studio.svgCanvas(laceSVG(data,tplFor(id)),1500,2322);
   await Studio.exportCanvas(canvas,format,'Mubiey-Wedding-Invitation',{widthMm:127,heightMm:196.6});
   toast('Invitation exported');
  }catch(e){toast(e.message)}finally{setBusy(false)}
 };
}

/* ---------- Cards section ---------- */
if(onCards){
 const make=(data,tpl)=>tpl.lace?laceSVG(data||{},tpl):royalSVG(data||{},tpl,false);
 const baseCard=cardSVG;
 cardSVG=function(data,template){template=template||getTemplate(data&&data.template);return template&&(template.lace||template.royal)?make(data,template):baseCard.apply(this,arguments)};
 const baseGet=getTemplate;
 getTemplate=function(id){id=String(id||'');return isLace(id)||isRoyal(id)?tplFor(id):baseGet.apply(this,arguments)};

 /* extra fields: best wishes from + location link */
 const note=document.querySelector('#c-note'),noteLabel=note&&note.closest('label');
 const mk=(id,label,type,max,ph)=>{const l=document.createElement('label');if(noteLabel)l.className=noteLabel.className;l.innerHTML='<span></span><input id="'+id+'" type="'+type+'" maxlength="'+max+'" placeholder="'+ph+'" autocomplete="off">';l.querySelector('span').textContent=label;return l};
 if(noteLabel&&!document.querySelector('#c-wishes')){
  const a=mk('c-wishes','Best wishes from (name)','text',60,'e.g. Muhammad & Aisha'),b=mk('c-map','Location link (Google Maps) · shown as a QR code','url',480,'https://maps.app.goo.gl/…');
  noteLabel.after(a);a.after(b);
  const hint=document.createElement('p');hint.className='help';hint.textContent='Leave either empty to hide it. Guests scan the QR code with their phone camera to open the location.';b.after(hint);
  for(const el of [a.querySelector('input'),b.querySelector('input')])el.addEventListener('input',()=>{if(typeof preview==='function')preview()});
 }
 const baseCollect=collect;
 collect=function(){const d=baseCollect.apply(this,arguments);d.wishes=(document.querySelector('#c-wishes')?.value||'').trim();d.mapUrl=(document.querySelector('#c-map')?.value||'').trim();return d};
 const df=document.querySelector('#design-file');
 if(df)df.addEventListener('change',e=>{const file=e.target.files&&e.target.files[0];if(!file)return;file.text().then(t=>{const a=JSON.parse(t).design||{};setTimeout(()=>{const w=document.querySelector('#c-wishes'),m=document.querySelector('#c-map');if(w)w.value=String(a.wishes||'').slice(0,60);if(m)m.value=String(a.mapUrl||'').slice(0,480);if(typeof preview==='function')preview()},400)}).catch(()=>{})});

 const baseOpen=openTemplate;
 openTemplate=function(t){
  baseOpen.apply(this,arguments);
  const w=document.querySelector('#width-mm'),h=document.querySelector('#height-mm'),set=(id,v)=>{const el=document.querySelector(id);if(el)el.value=v};
  if(t&&t.lace){const L=LACE[t.id];set('#c-background',PAPER);set('#c-ink',L.ink);set('#c-accent',L.ink);set('#c-font','cursive');if(w&&h){w.value=127;h.value=196.6}preview()}
  else if(t&&t.royal){const R=ROYAL[t.id];set('#c-background',R.bg1);set('#c-ink',R.ink);set('#c-accent',R.gold);set('#c-font','cursive');if(w&&h){w.value=127;h.value=177.8}preview()}
  else if(h&&Number(h.value)===196.6)h.value=177.8;
 };
 async function openMaker(id){
  try{toast('Loading card…');await ensure(id);openTemplate(tplFor(id));toast('Edit the names, date and venue, then download.')}
  catch(e){toast(e.message||'Could not open the card.')}
 }

 /* add the six Royal gold cards to the collection (thumbnails are drawn from the design itself) */
 for(const id of Object.keys(ROYAL))if(!PREMIUM_FEATURED.some(x=>x.id===id))PREMIUM_FEATURED.push({id,img:thumbURI(id),name:ROYAL[id].name,tradition:'Muslim',style:'Traditional',premium:true,tag:'Gold'});
 {const rank=x=>isLace(x.id)?0:isRoyal(x.id)?1:2,sorted=[...PREMIUM_FEATURED].sort((a,b)=>rank(a)-rank(b));PREMIUM_FEATURED.splice(0,PREMIUM_FEATURED.length,...sorted)}
 const decorate=()=>{
  const cat=document.querySelector('#catalogue');if(!cat)return;
  cat.querySelectorAll('.template-card button[data-id]').forEach(b=>{
   const id=b.dataset.id,actions=b.parentElement;
   if(!isLace(id)&&!isRoyal(id)||actions.querySelector('.make-card'))return;
   const m=document.createElement('button');m.type='button';m.className='make-card primary';m.textContent='Make card · PDF / JPEG';m.onclick=()=>openMaker(id);
   actions.style.flexDirection='column';actions.prepend(m);
   if(isRoyal(id))b.remove();
  });
  const help=document.querySelector('#collection .help');
  if(help&&!help.dataset.lace){help.dataset.lace='1';help.textContent='Tap “Make card” on a Lace & Bow or Gold card to edit it and download as PDF, JPEG, PNG or SVG (names, date, venue, best wishes from, and a location QR code). Other premium designs open in the live invitation editor.'}
  const sub=document.querySelector('#collection .subtle');
  if(sub&&!sub.dataset.lace){sub.dataset.lace='1';sub.textContent=PREMIUM_FEATURED.length+' premium designs — edit and download cards here, or open a design in live invitations to share a guest link.'}
 };
 if(typeof renderList==='function')renderList();
 decorate();
 const cat=document.querySelector('#catalogue');
 if(cat&&typeof MutationObserver==='function')new MutationObserver(decorate).observe(cat,{childList:true});
}
})();
