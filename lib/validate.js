import {checkSlug} from './slug.js';
const text=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
const LOGO_RE=/^(?:data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+\/]+={0,2}|\/media\/[a-f0-9-]{36}\/[a-f0-9-]{36})$/;
const validLogo=v=>typeof v==='string'&&(v.length<=200000&&LOGO_RE.test(v)||/^\/media\/[a-f0-9-]{36}\/[a-f0-9-]{36}$/i.test(v))?v:'';
const invalid=message=>{throw Object.assign(Error(message),{status:400,code:'INVALID_INVITATION'})};
const MEDIA_REF_RE=/^\/media\/[a-f0-9-]{36}\/[a-f0-9-]{36}$/i;
const BACKGROUND_PATH_RE=/^\/images\/backgrounds\/[A-Za-z0-9][A-Za-z0-9._/-]*$/;
const isBackgroundPath=value=>typeof value==='string'&&BACKGROUND_PATH_RE.test(value)&&!value.includes('//')&&!value.split('/').some(part=>part==='.'||part==='..');
const ARABIC_FONTS=['amiri','ruqaa','kufi','nastaliq','lateef','scheherazade','katibeh','mirza','rakkas','lalezar','custom'];
const GRADIENTS=['','linear-gradient(135deg,#fff8ec,#f3e6c8)','linear-gradient(135deg,#102b27,#31594b)','linear-gradient(135deg,#f8e9e9,#e9c7c9)','linear-gradient(135deg,#101c31,#293c5b)','linear-gradient(135deg,#fff1d5,#e8c486)'];
const optionalNumber=(value,min,max)=>{if(value===null||value===undefined||value==='')return null;const number=Number(value);if(!Number.isFinite(number)||number<min||number>max)invalid('Customization values are outside the allowed range');return number};
function cleanCustomFont(value){
 if(value===undefined||value===null)return null;
 if(typeof value!=='object'||Array.isArray(value))invalid('Invalid custom font');
 const format=String(value.format||'').toLowerCase();
 if(!['woff2','woff','ttf','otf'].includes(format))invalid('Invalid custom font format');
 if(value.url!==undefined){
  if(!MEDIA_REF_RE.test(value.url||''))invalid('Invalid custom font reference');
  return{url:value.url,name:text(value.name,120),format};
 }
 const data=value.data;
 if(typeof data!=='string'||data.length>200000||!new RegExp(`^data:font/${format};base64,[A-Za-z0-9+/]+={0,2}$`).test(data))invalid('Invalid custom font data');
 return{name:text(value.name,120),data,format};
}
function cleanArabicTypography(value){
 if(value===undefined||value===null)return null;
 if(typeof value!=='object'||Array.isArray(value))invalid('Invalid Arabic typography settings');
 const font=ARABIC_FONTS.includes(value.font)?value.font:'amiri';
 const custom=value.customFont;
 let customFont=null;
 if(custom!==undefined&&custom!==null){
  if(typeof custom!=='object'||Array.isArray(custom)||!MEDIA_REF_RE.test(custom.url||''))invalid('Invalid uploaded Arabic font reference');
  const format=String(custom.format||'').toLowerCase();
  if(!['woff2','woff','ttf','otf'].includes(format))invalid('Invalid Arabic font format');
  customFont={url:custom.url,name:text(custom.name,120),format};
 }
 return{
  font,
  size:optionalNumber(value.size,10,72),
  weight:optionalNumber(value.weight,300,900),
  lineHeight:optionalNumber(value.lineHeight,1,3),
  align:['left','center','right','justify'].includes(value.align)?value.align:null,
  color:/^#[0-9a-f]{6}$/i.test(value.color||'')?value.color:null,
  customFont
 };
}
function cleanPageBackgrounds(value){
 if(value===undefined||value===null)return[];
 if(!Array.isArray(value)||value.length>60)invalid('Invalid page background settings');
 return value.map(page=>{
  if(!page||typeof page!=='object'||Array.isArray(page))invalid('Invalid page background settings');
  if(!Object.keys(page).length)return{};
  const image=typeof page.image==='string'?page.image:'';
  if(image&&!MEDIA_REF_RE.test(image)&&!isBackgroundPath(image))invalid('Choose an uploaded invitation image or a path under /images/backgrounds/');
  const number=(field,min,max,fallback)=>optionalNumber(page[field],min,max)??fallback;
  return{
   image,preset:['none','islamic-arch-lanterns','watercolor-lantern-florals'].includes(page.preset)?page.preset:'',
   size:['cover','contain','custom'].includes(page.size)?page.size:'cover',
   x:number('x',0,100,50),y:number('y',0,100,50),
   customSize:number('customSize',25,300,100),
   imageOpacity:number('imageOpacity',0,1,1),
   overlayColor:/^#[0-9a-f]{6}$/i.test(page.overlayColor||'')?page.overlayColor:'#000000',
   overlayOpacity:number('overlayOpacity',0,1,0),
   color:/^#[0-9a-f]{6}$/i.test(page.color||'')?page.color:'#ffffff',
   gradient:GRADIENTS.includes(page.gradient)?page.gradient:''
  };
 });
}
export function validate(d,extraReserved){if(!d||typeof d!=='object')invalid('Invalid invitation');const clean={name1:text(d.name1,90),name2:text(d.name2,90),heading:text(d.heading,140),message:text(d.message,3000),venue:text(d.venue,180),address:text(d.address,500),date:text(d.date,40),timezone:text(d.timezone,6),theme:['ivory','emerald','rose','midnight','saffron','sage'].includes(d.theme)?d.theme:'ivory',tradition:['General','Muslim','Hindu','Christian','Interfaith','Other'].includes(d.tradition)?d.tradition:'General',mapUrl:text(d.mapUrl,1800),venueGroom:text(d.venueGroom,180),addressGroom:text(d.addressGroom,500),mapUrlGroom:text(d.mapUrlGroom,1800),venueLabel:text(d.venueLabel,40),venueGroomLabel:text(d.venueGroomLabel,40),layout:Number.isInteger(d.layout)&&d.layout>=0&&d.layout<40?d.layout:0,template:text(d.template,80)||'premium-0-0',font:['script','italic','serif','sans','allura','parisienne','cinzel','playfair','montserrat','amiri','malayalam','greatvibes','cormorant','josefin','custom'].includes(d.font)?d.font:'serif',animation:d.animation!==false,musicAutoplay:d.musicAutoplay!==false,openingStyle:['seal','locket','curtain','none'].includes(d.openingStyle)?d.openingStyle:'seal',galleryMode:['grid','masonry','story','organic'].includes(d.galleryMode)?d.galleryMode:'masonry',galleryTitle:text(d.galleryTitle,120)||'Our favourite memories',family:text(d.family,1500),rsvpUrl:text(d.rsvpUrl,500),slug:'',verse:text(d.verse,300),verseArabic:text(d.verseArabic,300),blessing:text(d.blessing,500),blessingArabic:text(d.blessingArabic,300),rsvpText:text(d.rsvpText,300),monogram:text(d.monogram,3),scene1:Math.min(30,Math.max(0,parseInt(d.scene1,10)||0)),scene2:Math.min(30,Math.max(0,parseInt(d.scene2,10)||0)),scene3:Math.min(30,Math.max(0,parseInt(d.scene3,10)||0)),scene4:Math.min(30,Math.max(0,parseInt(d.scene4,10)||0)),bgPhoto:Math.min(30,Math.max(0,parseInt(d.bgPhoto,10)||0)),focus1:['top','upper','center','lower'].includes(d.focus1)?d.focus1:'upper',focus2:['top','upper','center','lower'].includes(d.focus2)?d.focus2:'upper',focus3:['top','upper','center','lower'].includes(d.focus3)?d.focus3:'upper',focus4:['top','upper','center','lower'].includes(d.focus4)?d.focus4:'upper',arabicFont:['amiri','ruqaa','kufi','nastaliq','lateef','scheherazade','katibeh','mirza','rakkas','lalezar'].includes(d.arabicFont)?d.arabicFont:'amiri',parents1:text(d.parents1,200),parents2:text(d.parents2,200),timeText:text(d.timeText,80),receptionDate:text(d.receptionDate,80),receptionTime:text(d.receptionTime,80),receptionNames:text(d.receptionNames,120),receptionTitle:text(d.receptionTitle,60),wishesFrom:text(d.wishesFrom,120),compliments:text(d.compliments,200),cardTitle:text(d.cardTitle,80),cardNote:text(d.cardNote,200),cardButton:text(d.cardButton,40),cardDownload:text(d.cardDownload,40),rsOpen:text(d.rsOpen,40),rsBismillah:text(d.rsBismillah,200),rsIntro:text(d.rsIntro,160),rsLabel1:text(d.rsLabel1,40),rsLabel2:text(d.rsLabel2,40),rsDateKicker:text(d.rsDateKicker,60),rsDateTitle:text(d.rsDateTitle,60),rsStoryKicker:text(d.rsStoryKicker,60),rsStoryTitle:text(d.rsStoryTitle,80),rsDayKicker:text(d.rsDayKicker,60),rsDayTitle:text(d.rsDayTitle,80),rsEventsTitle:text(d.rsEventsTitle,80),rsClosing:text(d.rsClosing,300),rsScroll:text(d.rsScroll,30),rubyCfg:text(d.rubyCfg,3000),floraBg:text(d.floraBg,400000),logoPages:text(d.logoPages,40),eventsText:text(d.eventsText,1800),schedule:[],photos:[],music:null,logo:validLogo(d.logo),openLogo:validLogo(d.openLogo),logoSize:['sm','md','lg'].includes(d.logoSize)?d.logoSize:'md'};
if(Object.hasOwn(d,'arabicTypography'))clean.arabicTypography=cleanArabicTypography(d.arabicTypography);
if(Object.hasOwn(d,'customFont'))clean.customFont=cleanCustomFont(d.customFont);
if(Object.hasOwn(d,'pageBackgrounds')){
 clean.pageBackgrounds=cleanPageBackgrounds(d.pageBackgrounds);
 const photos=Array.isArray(d.photos)?d.photos:[];
 if(clean.pageBackgrounds.some(page=>MEDIA_REF_RE.test(page.image)&&!photos.includes(page.image)))invalid('Page backgrounds must use a saved invitation photo');
}
if(clean.date&&(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?[+-]\d{2}:\d{2}$/.test(clean.date)||!Number.isFinite(Date.parse(clean.date))))invalid('Choose a valid event date and time zone');
if(clean.mapUrl){let u;try{u=new URL(clean.mapUrl)}catch{invalid('Enter a valid map link')}if(u.protocol!=='https:'||!['google.com','www.google.com','maps.google.com','maps.app.goo.gl','goo.gl','maps.apple.com'].includes(u.hostname))invalid('Use an HTTPS Google Maps or Apple Maps link')}
if(clean.mapUrlGroom){let u;try{u=new URL(clean.mapUrlGroom)}catch{invalid('Enter a valid groom map link')}if(u.protocol!=='https:'||!['google.com','www.google.com','maps.google.com','maps.app.goo.gl','goo.gl','maps.apple.com'].includes(u.hostname))invalid('Use an HTTPS Google Maps or Apple Maps link for the groom venue')}
if(clean.rsvpUrl){let u;try{u=new URL(clean.rsvpUrl)}catch{invalid('Enter a valid RSVP link')}if(u.protocol!=='https:')invalid('Use an HTTPS RSVP link (for example a WhatsApp link)')}
if(d.slug!==undefined&&d.slug!==null&&typeof d.slug!=='string')invalid('Enter a valid invitation link');
if(typeof d.slug==='string'&&d.slug.trim()){const c=checkSlug(d.slug,extraReserved);if(!c.ok)invalid(c.error);clean.slug=c.slug}
if(Array.isArray(d.schedule))clean.schedule=d.schedule.slice(0,8).map(s=>({title:text(s.title,90),time:text(s.time,90),detail:text(s.detail,250)}));return clean}
