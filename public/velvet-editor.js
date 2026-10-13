/* Owner-only editor additions for the envelope-story templates 111 · 222 · 333 · 444 · 777 and "Heavy Luxury".
   Adds controls only; nothing existing is replaced. New fields are pushed into invitations.js's `fields` list,
   so the existing save / load / live-preview code stores them with the invitation. */
'use strict';
(()=>{
const $=s=>document.querySelector(s);
const VELVET='heavy-luxury';
const TEMPLATES=[['111','111 · Emerald envelope story'],['222','222 · Midnight blue envelope story'],['333','333 · Royal purple envelope story'],['444','444 · Noir & gold envelope story'],['777','777 · Burgundy envelope story'],[VELVET,'Heavy Luxury · envelope story + save-the-date page']];
const STORY=TEMPLATES.map(t=>t[0]);
const preset=$('#live-preset');
if(!preset||typeof fields==='undefined'||typeof markDirty!=='function')return;
const grid=preset.closest('.field-grid');
if(!grid)return;

const ensureTemplate=()=>{for(const [v,label] of TEMPLATES)if(![...preset.options].some(o=>o.value===v)){const o=new Option(label,v);o.dataset.layout='0';preset.add(o)}};
ensureTemplate();
new MutationObserver(ensureTemplate).observe(preset,{childList:true});

function wrap(label,el){const l=document.createElement('label');l.textContent=label;l.append(el);grid.append(l);return el}
function add(id,label,tag,hint,rtl){
 if($('#'+id))return;
 const el=document.createElement(tag==='area'?'textarea':'input');
 el.id=id;el.maxLength=tag==='area'?500:300;if(tag==='area')el.rows=2;if(hint)el.placeholder=hint;if(rtl){el.dir='rtl';el.lang='ar'}
 wrap(label,el);el.oninput=markDirty;fields.push(id);
}
add('monogram','Monogram on the envelope seal (up to 3 letters)','input','e.g. AF');
add('parents1','Name 1 · parents line (e.g. S/O Mr. & Mrs. …)','input','S/O Mr. … & Mrs. …');
add('parents2','Name 2 · parents line (e.g. D/O Mr. & Mrs. …)','input','D/O Mr. … & Mrs. …');
add('timeText','Time shown (e.g. 7 p.m. to 10 p.m.)','input','Leave empty to show the start time');
add('compliments','Bottom line (with best compliments from…)','input','With best compliments from our family');
add('verseArabic','Page 1 · Arabic line','input','Leave empty for the default',true);
add('verse','Page 1 · English line','input','And we created you in pairs');
add('blessingArabic','Last page · Arabic blessing (type or paste any dua)','area','Leave empty for the default dua',true);
add('blessing','Last page · English blessing','area','May Allah bless you both…');
add('rsvpText','Final page · RSVP wording','area','R.S.V.P\nAll family members, relatives and friends');

/* ---- ready-made Arabic texts (always check wording with a trusted source before printing) ---- */
const VERSES=[
 ['Surah An-Naba 78:8 (default)','وَخَلَقْنَاكُمْ أَزْوَاجًا','And we created you in pairs'],
 ['Surah Adh-Dhariyat 51:49','وَمِن كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ لَعَلَّكُمْ تَذَكَّرُونَ','And of everything We created pairs, that perhaps you will remember.']
];
const BLESSINGS=[
 ['Barakallahu laka (default)','بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ','May Allah bless you both, shower His blessings upon you, and bring you together in goodness.'],
 ['Surah Ar-Rum 30:21','وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً','And among His signs is that He created for you spouses from among yourselves that you may find tranquility in them; and He placed between you affection and mercy.'],
 ['Surah Al-Furqan 25:74','رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا','Our Lord, grant us from our spouses and offspring comfort to our eyes, and make us leaders for the righteous.']
];
function presetPicker(label,list,arId,enId){
 const sel=document.createElement('select');
 sel.append(new Option('— choose a ready-made text —',''));
 list.forEach((x,i)=>sel.append(new Option(x[0],String(i))));
 sel.append(new Option('Clear (type my own)','clear'));
 sel.onchange=()=>{
  if(sel.value==='')return;
  const x=sel.value==='clear'?['','','']:list[+sel.value];
  const a=$('#'+arId),b=$('#'+enId);if(a)a.value=x[1];if(b)b.value=x[2];
  sel.value='';markDirty();
 };
 wrap(label,sel);
}
presetPicker('Page 1 · pick a ready-made verse',VERSES,'verseArabic','verse');
presetPicker('Last page · pick a ready-made dua',BLESSINGS,'blessingArabic','blessing');

/* ---- Arabic calligraphy font ---- */
const FONTS=[['amiri','Naskh · Amiri (installed)'],['ruqaa','Ruqaa · Aref Ruqaa'],['kufi','Kufi · Reem Kufi'],['nastaliq','Nastaliq · Noto Nastaliq Urdu'],['lateef','Lateef'],['scheherazade','Scheherazade New'],['katibeh','Katibeh (calligraphic)'],['mirza','Mirza (calligraphic)'],['rakkas','Rakkas (bold decorative)'],['lalezar','Lalezar (bold display)']];
if(!$('#arabicFont')){
 const sel=document.createElement('select');sel.id='arabicFont';
 FONTS.forEach(([k,l])=>sel.append(new Option(l,k)));
 wrap('Arabic calligraphy font',sel);fields.push('arabicFont');
 sel.onchange=async()=>{try{await window.vnLoadArabicFont?.(sel.value)}catch{}markDirty()};
 FONTS.slice(1).forEach(([k,l],i)=>{fetch('/assets/fonts/ar/'+k+'.ttf',{method:'HEAD'}).then(r=>{if(!r.ok)throw 0}).catch(()=>{const o=sel.options[i+1];if(o)o.text=l+' — not installed yet'})});
}

/* ---- quick start buttons + full-screen guest preview ---- */
const holder=document.createElement('div');holder.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin-top:10px';
TEMPLATES.forEach(([v,label],i)=>{
 const b=document.createElement('button');b.type='button';b.textContent='Try '+(v===VELVET?'Heavy Luxury':v);if(v==='777')b.className='primary';
 b.onclick=()=>{ensureTemplate();preset.value=v;if($('#animation'))$('#animation').checked=true;if($('#music-autoplay'))$('#music-autoplay').checked=true;markDirty()};
 holder.append(b);
});
const previewBtn=document.createElement('button');previewBtn.type='button';previewBtn.textContent='Preview envelope opening';
previewBtn.onclick=async()=>{
 try{
  const d=collect();if(!STORY.includes(d.template))d.template='777';d.animation=true;d._editorPreview=false;if(d.openingStyle==='none')d.openingStyle='seal';
  d.photos=photos.map(p=>p.preview||p.value);d.music=music?.preview||music?.value||null;
  if(typeof atelierFontsReady==='function')await atelierFontsReady().catch(()=>{});
  const dialog=document.createElement('dialog');
  dialog.style.cssText='position:fixed;inset:0;width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:#000';
  const frame=document.createElement('iframe');frame.title='Guest preview';frame.setAttribute('sandbox','allow-scripts allow-popups allow-popups-to-escape-sandbox');frame.style.cssText='border:0;width:100%;height:100%';frame.srcdoc=invitationDocument(d);
  const close=document.createElement('button');close.type='button';close.textContent='Close preview';close.style.cssText='position:absolute;right:14px;top:14px;z-index:2;padding:12px 18px;cursor:pointer';
  close.onclick=()=>{dialog.close();dialog.remove()};dialog.addEventListener('cancel',()=>dialog.remove());
  dialog.append(frame,close);document.body.append(dialog);dialog.showModal();
 }catch{const t=$('#toast');if(t){t.textContent='Could not open the preview. Please try again.';t.classList.add('show')}}
};
holder.append(previewBtn);grid.append(holder);
})();
