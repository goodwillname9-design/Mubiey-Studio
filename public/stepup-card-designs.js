/* Step Up card designs for the Cards section.
   Adds five original designs next to the Lace & Bow and Royal gold cards. They use the same editor
   (names, heading, date, venue, note, best wishes, location QR) and the same PDF / JPEG / PNG / SVG export.
   Artwork comes from stepup-cards.js (drawn in code, no image files); the text is added here as real SVG text.
   Load order in cards.html: ... lace-cards.js, stepup-cards.js, stepup-card-designs.js */
(()=>{
'use strict';
if(typeof StepUpCards==='undefined'||typeof atelierFontCSS!=='function'||typeof atelierFontsReady!=='function'||typeof Studio==='undefined')return;
const onCards=typeof cardSVG==='function'&&typeof openTemplate==='function'&&typeof getTemplate==='function'&&typeof PREMIUM_FEATURED!=='undefined';
if(!onCards)return;

const H=900,MM_H=190.5;                 /* 600 x 900 card -> 127 mm x 190.5 mm */
const DESIGNS={
 'stepup-pearl':  {name:'Pearl Emboss',       art:'pearl',  bg:'#f3efe9',ink:'#3b2c2c',body:'#4a3a38',accent:'#a9812f',font:'Georgia', x:300,fitW:400,P:{head:236,wi:292,n1:354,amp:398,n2:456,line:492,date:528,venue:582,noteMin:654,wishMin:696,plaque:742}},
 'stepup-blush':  {name:'Burgundy Blush',     art:'blush',  bg:'#fbf4f3',ink:'#6f1431',body:'#2b1d1d',accent:'#9c2f4f',font:'cursive',x:372,fitW:330,P:{head:158,wi:212,n1:292,amp:338,n2:398,line:434,date:470,venue:526,noteMin:606,wishMin:648,plaque:698}},
 'stepup-navy':   {name:'Royal Navy',         art:'navy',   bg:'#f5eddb',ink:'#1f4377',body:'#1f4377',accent:'#a9812f',font:'cursive',x:230,fitW:340,P:{head:184,wi:248,n1:338,amp:386,n2:446,line:484,date:520,venue:574,noteMin:650,wishMin:692,plaque:736}},
 'stepup-maroon': {name:'Maroon & Gold',      art:'maroon', bg:'#f8f0e3',ink:'#5b0f26',body:'#4a3834',accent:'#a9812f',font:'Georgia', x:300,fitW:380,P:{head:196,wi:250,n1:332,amp:378,n2:438,line:476,date:512,venue:566,noteMin:638,wishMin:680,plaque:726}},
 'stepup-candle': {name:'Candlelit Drapes',   art:'candle', bg:'#f2e7d8',ink:'#6b4a3a',body:'#6b4a3a',accent:'#a9812f',font:'cursive',x:300,fitW:340,P:{head:132,wi:196,n1:268,amp:314,n2:374,line:410,date:448,venue:502,noteMin:574,wishMin:616,plaque:664}}
};
const ids=Object.keys(DESIGNS);
const isStep=id=>!!DESIGNS[id];
const tplFor=id=>({id,stepup:true,name:DESIGNS[id].name+' · Step Up',tradition:'General',style:'Editorial',palette:0,floral:false,premium:true,tag:'Step Up'});

/* ---------- helpers (same behaviour as the Lace & Royal cards) ---------- */
function wrap(s,max){const lines=[];let row='';for(const w of String(s||'').split(/\s+/).filter(Boolean)){if((row+' '+w).trim().length>max&&row){lines.push(row);row=w}else row=(row?row+' ':'')+w}if(row)lines.push(row);return lines}
function mapNorm(href){try{const u=new URL(href);const p=decodeURIComponent(u.pathname.replace(/\+/g,' '));const m=/(\d{1,3})\s*°\s*(\d{1,2})\s*['′]\s*(\d{1,2}(?:\.\d+)?)\s*["″]?\s*([NS])[\s,]*(\d{1,3})\s*°\s*(\d{1,2})\s*['′]\s*(\d{1,2}(?:\.\d+)?)\s*["″]?\s*([EW])/i.exec(p);if(!m)return href;const lat=(+m[1]+ +m[2]/60+ +m[3]/3600)*(/s/i.test(m[4])?-1:1),lng=(+m[5]+ +m[6]/60+ +m[7]/3600)*(/w/i.test(m[8])?-1:1);if(!isFinite(lat)||!isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180)return href;return 'https://www.google.com/maps/search/?api=1&query='+lat.toFixed(6)+','+lng.toFixed(6)}catch{return href}}
function qrUrl(v){v=String(v||'').trim();if(!v||v.length>480)return '';try{const u=new URL(v);if(u.protocol!=='https:'&&u.protocol!=='http:')return '';return mapNorm(u.href)}catch{return ''}}
function fontsFor(data,thumb){
 const script=data.font==='cursive'&&!thumb;
 const base=['Georgia','Times New Roman','Arial','Verdana'].includes(data.font)?data.font:'Georgia';
 return {script,nameFont:script?'AtelierAllura,AtelierScript,cursive':base+',AtelierAmiri,serif',bodyFont:script?'AtelierSerif,AtelierAmiri,Georgia,serif':base+',AtelierAmiri,serif'};
}
const hex=v=>/^#[a-f0-9]{6}$/i.test(v||'');
const art={};
const artOf=d=>art[d.art]||(art[d.art]=StepUpCards.artSVG(d.art));
const initialsOf=(a,b)=>((String(a||'M').trim().charAt(0)||'M')+(String(b||'F').trim().charAt(0)||'F')).toUpperCase();

/* ---------- text layer (real SVG text, so every field stays editable) ---------- */
function textLayer(data,c,S){
 const esc=Studio.escape,P=S.P,x0=S.x;
 const T=(s,y,size,fill,font,extra='')=>`<text x="${x0}" y="${y}" text-anchor="middle" font-family="${font}" font-size="${size}" fill="${fill}" ${extra}>${esc(s)}</text>`;
 const nameSize=Math.max(25,Math.min(57,Number(data.nameSize)||48));
 const fit=v=>{const len=Math.max(1,[...v].length);return Math.max(18,Math.min(nameSize,S.fitW/(len*(c.script?.40:.56))))};
 const heading=data.heading||'In the name of Allah, the Most Merciful',n1=data.name1||'Muhammad',n2=data.name2||'Fathima';
 let o='';
 wrap(heading,40).slice(0,2).forEach((s,i)=>o+=T(s,P.head+i*20,13,c.body,c.bodyFont,'font-style="italic"'));
 o+=T('WEDDING INVITATION',P.wi,10.5,c.accent,c.bodyFont,'letter-spacing="4"');
 o+=T(n1,P.n1,fit(n1),c.ink,c.nameFont);
 o+=T('&',P.amp,28,c.accent,c.bodyFont,'font-style="italic"');
 o+=T(n2,P.n2,fit(n2),c.ink,c.nameFont);
 o+=`<path d="M${x0-45} ${P.line}H${x0+45}" stroke="${c.accent}" stroke-width="1" fill="none"/>`;
 wrap(data.dateText||'Date & time to be confirmed',38).slice(0,2).forEach((s,i)=>o+=T(s,P.date+i*22,15,c.body,c.bodyFont,'font-weight="600"'));
 const vl=wrap(data.venue||'Venue to be announced',44).slice(0,3);
 vl.forEach((s,i)=>o+=T(s,P.venue+i*19,12.5,c.body,c.bodyFont));
 const ny=Math.max(P.noteMin,P.venue+(vl.length-1)*19+34),nl=wrap(data.note||'Your presence will make our day complete.',48).slice(0,2);
 nl.forEach((s,i)=>o+=T(s,ny+i*17,11.5,c.body,c.bodyFont,'font-style="italic"'));
 const end=ny+(nl.length-1)*17;
 const wishes=String(data.wishes||'').trim().slice(0,60),url=qrUrl(data.mapUrl);
 if(wishes){
  let wy=Math.max(end+30,P.wishMin);if(url)wy=Math.min(wy,P.plaque-46);
  o+=T('WITH BEST WISHES FROM',wy,9.5,c.accent,c.bodyFont,'letter-spacing="3"');
  const len=Math.max(1,[...wishes].length);o+=T(wishes,wy+29,Math.max(15,Math.min(28,270/(len*(c.script?.40:.56)))),c.ink,c.nameFont);
 }
 if(url&&window.MubieyQR){
  try{
   const x=x0-58,y=P.plaque,q=window.MubieyQR.path(url,{x:x+16,y:y+10,size:84,level:'M'});
   o+=`<rect x="${x}" y="${y}" width="116" height="124" rx="10" fill="#fffaf2" stroke="${c.accent}" stroke-width="1.2"/><path d="${q.d}" fill="#1b1115"/>`;
   o+=T('SCAN FOR LOCATION',y+113,7,'#4a3a33','Arial,sans-serif','letter-spacing="1" font-weight="700"');
  }catch(e){}
 }
 return o;
}

/* extras that belong to a design: gold monogram (Pearl, Blush) and the little save-the-date card (Blush) */
function extras(id,data,c,S){
 const esc=Studio.escape,mono=initialsOf(data.name1,data.name2);
 const goldDef='<linearGradient id="spg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8d6a26"/><stop offset=".35" stop-color="#e8cd85"/><stop offset=".65" stop-color="#b3873a"/><stop offset="1" stop-color="#f0dca4"/></linearGradient>';
 const script=c.script?'AtelierScript,AtelierAllura,cursive':'AtelierScript,AtelierAllura,cursive';
 if(id==='stepup-pearl')return `<defs>${goldDef}</defs><text x="300" y="196" text-anchor="middle" font-family="${script}" font-size="100" fill="url(#spg)">${esc(mono)}</text>`;
 if(id==='stepup-blush'){
  const d1=wrap(data.dateText||'Date to be confirmed',20).slice(0,2),v1=wrap(data.venue||'',22).slice(0,1);
  return `<defs>${goldDef}<filter id="spsh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#3c0a19" flood-opacity=".32"/></filter></defs>`+
   `<text x="560" y="86" text-anchor="end" font-family="${script}" font-size="52" fill="url(#spg)">${esc(mono)}</text>`+
   `<g transform="translate(44 34) rotate(-4)" filter="url(#spsh)"><rect width="152" height="248" fill="#fbf8f6"/>`+
   `<text x="76" y="58" text-anchor="middle" font-family="${script}" font-size="36" fill="#c4243a">Save</text>`+
   `<text x="76" y="92" text-anchor="middle" font-family="${script}" font-size="36" fill="#c4243a">the Date</text>`+
   `<text x="76" y="146" text-anchor="middle" font-family="${script}" font-size="54" fill="url(#spg)">${esc(mono)}</text>`+
   d1.map((s,i)=>`<text x="76" y="${178+i*16}" text-anchor="middle" font-family="${c.bodyFont}" font-size="12" font-weight="600" fill="#3a2c2c">${esc(s)}</text>`).join('')+
   v1.map(s=>`<text x="76" y="226" text-anchor="middle" font-family="${c.bodyFont}" font-size="10" fill="#5a4a4a" letter-spacing="1">${esc(s.toUpperCase())}</text>`).join('')+`</g>`;
 }
 return '';
}

function stepSVG(data,tpl,thumb){
 const S=DESIGNS[tpl.id]||DESIGNS['stepup-pearl'];
 const ink=hex(data.ink)?data.ink:S.ink,accent=hex(data.accent)?data.accent:S.accent,bg=hex(data.background)?data.background:S.bg;
 const body=ink.toLowerCase()===S.ink.toLowerCase()?S.body:ink;
 const c={ink,body,accent,...fontsFor(data,thumb)};
 return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="${H}" viewBox="0 0 600 ${H}"><defs>${thumb?'':`<style>${atelierFontCSS(true)}</style>`}</defs><rect width="600" height="${H}" fill="${bg}"/>${artOf(S)}${extras(tpl.id,data,c,S)}${textLayer(data,c,S)}</svg>`;
}
const SAMPLE={name1:'Muhammad',name2:'Fathima',heading:'In the name of Allah',dateText:'Sunday, 22 November 2026',venue:'Venue to be announced',note:'Your presence will make our day complete.',font:'Georgia',nameSize:40,wishes:'',mapUrl:''};
const thumbURI=id=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(stepSVG({...SAMPLE,font:DESIGNS[id].font},tplFor(id),true));

/* ---------- hook into the Cards section ---------- */
const baseCard=cardSVG;
cardSVG=function(data,template){template=template||getTemplate(data&&data.template);return template&&template.stepup?stepSVG(data||{},template,false):baseCard.apply(this,arguments)};
const baseGet=getTemplate;
getTemplate=function(id){id=String(id||'');return isStep(id)?tplFor(id):baseGet.apply(this,arguments)};

const baseOpen=openTemplate;
openTemplate=function(t){
 baseOpen.apply(this,arguments);
 const w=document.querySelector('#width-mm'),h=document.querySelector('#height-mm'),set=(id,v)=>{const el=document.querySelector(id);if(el)el.value=v};
 if(t&&t.stepup){const S=DESIGNS[t.id];set('#c-background',S.bg);set('#c-ink',S.ink);set('#c-accent',S.accent);set('#c-font',S.font);if(w&&h){w.value=127;h.value=MM_H}preview()}
 else if(h&&Number(h.value)===MM_H)h.value=177.8;
};
async function openMaker(id){
 try{toast('Loading card…');await atelierFontsReady();openTemplate(tplFor(id));toast('Edit the names, date and venue, then download.')}
 catch(e){toast(e.message||'Could not open the card.')}
}

/* add the five cards right after the Royal gold cards */
{
 const fresh=ids.filter(id=>!PREMIUM_FEATURED.some(x=>x.id===id));
 let at=-1;PREMIUM_FEATURED.forEach((x,i)=>{if(/^royal-/.test(x.id))at=i});
 const items=fresh.map(id=>({id,img:thumbURI(id),name:DESIGNS[id].name+' · Step Up',tradition:'General',style:'Editorial',premium:true,tag:'Step Up'}));
 if(items.length)PREMIUM_FEATURED.splice(at<0?PREMIUM_FEATURED.length:at+1,0,...items);
}
const decorate=()=>{
 const cat=document.querySelector('#catalogue');if(!cat)return;
 cat.querySelectorAll('.template-card button[data-id]').forEach(b=>{
  const id=b.dataset.id,actions=b.parentElement;
  if(!isStep(id)||actions.querySelector('.make-card'))return;
  const m=document.createElement('button');m.type='button';m.className='make-card primary';m.textContent='Make card · PDF / JPEG';m.onclick=()=>openMaker(id);
  actions.style.flexDirection='column';actions.prepend(m);b.remove();
 });
};
if(typeof renderList==='function')renderList();
decorate();
{const cat=document.querySelector('#catalogue');if(cat&&typeof MutationObserver==='function')new MutationObserver(decorate).observe(cat,{childList:true})}
window.StepUpCardMaker={ids,svg:(id,data)=>stepSVG(data||SAMPLE,tplFor(id),false)};
})();
