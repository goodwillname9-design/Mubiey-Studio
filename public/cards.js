
/* 10 premium featured invitation cards shown first in the catalogue */
const PREMIUM_FEATURED=[
 {id:'premium-royal-1',name:'Royal Velvet Seal',tradition:'Muslim',style:'Traditional',premium:true,tag:'Premium'},
 {id:'premium-royal-2',name:'Golden Arch Ceremony',tradition:'Muslim',style:'Editorial',premium:true,tag:'Premium'},
 {id:'premium-royal-3',name:'Ivory Palace Column',tradition:'General',style:'Traditional',premium:true,tag:'Premium'},
 {id:'premium-royal-4',name:'Pedestal Rose Frame',tradition:'Christian',style:'Botanical',premium:true,tag:'Premium'},
 {id:'premium-royal-5',name:'Midnight Sapphire',tradition:'Muslim',style:'Modern',premium:true,tag:'Premium'},
 {id:'premium-royal-6',name:'Emerald Garden Gate',tradition:'Hindu',style:'Botanical',premium:true,tag:'Premium'},
 {id:'premium-royal-7',name:'Champagne Medallion',tradition:'Interfaith',style:'Editorial',premium:true,tag:'Premium'},
 {id:'premium-royal-8',name:'Blush Peony Letter',tradition:'Christian',style:'Botanical',premium:true,tag:'Premium'},
 {id:'premium-royal-9',name:'Saffron Mandap Glow',tradition:'Hindu',style:'Traditional',premium:true,tag:'Premium'},
 {id:'premium-royal-10',name:'Celestial Vows Night',tradition:'General',style:'Modern',premium:true,tag:'Premium'}
];
'use strict';
document.head.insertAdjacentHTML('beforeend','<style>.template-card{display:flex;flex-direction:column;gap:8px;padding:10px;text-align:left}.template-card img{width:100%;aspect-ratio:5/7;object-fit:cover;border-radius:5px}.template-actions{display:flex;gap:6px}.template-actions button{flex:1;padding:7px 5px;font-size:12px}</style>');
const $=s=>document.querySelector(s);let selected=null,photo='',timer;const keys=['name1','name2','heading','dateText','venue','note','font','nameSize','background','ink','accent'];
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('show');clearTimeout(timer);timer=setTimeout(()=>$('#toast').classList.remove('show'),3500)}
function renderList(){const collection=$('#collection');
collection.querySelector('.eyebrow').textContent='PREMIUM INVITATION CARDS';
collection.querySelector('.page-title').textContent='Premium card collection';
collection.querySelector('.subtle').textContent='10 premium designs. Open in live invitations to personalise names, photos and share a guest link.';
$('#count').textContent=PREMIUM_FEATURED.length+' premium cards';
const toolbar=$('#religion')?.closest('.toolbar');if(toolbar)toolbar.hidden=false;
$('#catalogue').hidden=false;
const pag=document.querySelector('.pagination');if(pag)pag.hidden=true;
const help=collection.querySelector('.help');if(help)help.textContent='These premium cards open in the live invitation editor. Your text and photos stay with you.';
const cat=$('#catalogue');cat.replaceChildren();
for(const card of PREMIUM_FEATURED){
  const el=document.createElement('article');el.className='template-card';el.style.cssText='border:1px solid #80623b;border-radius:8px;padding:14px;background:#171d26;display:grid;gap:8px';
  el.innerHTML=`<div style="aspect-ratio:5/7;border-radius:6px;background:linear-gradient(160deg,#2a1f18,#1a1218 40%,#3d2a22);display:flex;align-items:center;justify-content:center;color:#e8c9a0;font:italic 18px Georgia,serif;text-align:center;padding:12px">${card.name}</div>
  <strong style="color:#f5e6d3;font-size:14px">${card.name}</strong>
  <small style="color:#a3adbb">${card.tradition} · ${card.style} · ${card.tag||'Premium'}</small>
  <div class="template-actions"><button type="button" data-id="${card.id}">Use in live invitation</button></div>`;
  el.querySelector('button').onclick=()=>{location.href='invitations.html?premium='+encodeURIComponent(card.id)};
  cat.append(el);
}
return;
let empty=$('#card-catalog-empty');if(!empty){empty=document.createElement('div');empty.id='card-catalog-empty';empty.className='panel';empty.innerHTML='<h2>No approved static card templates</h2><p class="subtle">The 11 approved designs use full-page invitation artwork and animations that this printable SVG card editor cannot preserve. Open Live Invitations to preview, save, publish, or export those designs.</p><div class="actions"><a class="button primary" href="invitations.html">Open Live Invitations</a><button type="button" id="open-existing-design">Open an existing card design</button></div>';$('#catalogue').after(empty);$('#open-existing-design').onclick=()=>$('#design-file').click()}}
function collect(){return {...Object.fromEntries(keys.map(k=>[k,$('#c-'+k).value])),template:selected.id,photo}}
function preview(){if(selected)$('#card-preview').innerHTML=atelierSpec(selected.id)?atelierCard(collect(),selected):cardSVG(collect(),selected)}
function openTemplate(t){selected=t;const af=atelierSpec(t.id);const a=af?ATELIER_FAMILIES[af.art]:null;const palette=a?[a.name,a.bg,a.ink,a.gold]:(t.floral?FLORAL_PALETTES:CARD_PALETTES)[t.palette];$('#c-background').value=palette[1];$('#c-ink').value=palette[2];$('#c-accent').value=palette[3];$('#design-title').textContent=t.name;$('#collection').hidden=true;$('#editor').hidden=false;preview();scrollTo({top:0,behavior:'smooth'})}
for(const k of keys)$('#c-'+k).oninput=preview;for(const id of ['religion','style','search'])$('#'+id).addEventListener('input',()=>{page=0;renderList()});$('#next').onclick=()=>{page++;renderList();scrollTo({top:100,behavior:'smooth'})};$('#prev').onclick=()=>{page--;renderList();scrollTo({top:100,behavior:'smooth'})};$('#back').onclick=()=>{$('#collection').hidden=false;$('#editor').hidden=true};
$('#card-photo').onchange=async e=>{try{if(!e.target.files[0])return;photo=await Studio.dataURL(e.target.files[0],2400);preview()}catch(e){toast(e.message)}finally{e.target.value=''}};$('#remove-photo').onclick=()=>{photo='';preview()};
$('#save-design').onclick=()=>Studio.download(new Blob([JSON.stringify({format:'mubiey-card',version:1,design:collect()},null,2)],{type:'application/json'}),'Mubiey-Card-Design.json');$('#open-design').onclick=()=>$('#design-file').click();$('#design-file').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>15*1024*1024)throw Error('Design file is too large');const d=JSON.parse(await file.text());if(d.format!=='mubiey-card'||d.version!==1||!d.design)throw Error('Choose a Mubiey card design file');const a=d.design;for(const k of keys)if(typeof a[k]!=='string'||a[k].length>500)throw Error('Invalid card field');if(a.photo&&(!/^data:image\/(jpeg|png|webp);base64,/.test(a.photo)||a.photo.length>20000000))throw Error('Invalid card photo');photo=a.photo||'';openTemplate(getTemplate(a.template));for(const k of keys)$('#c-'+k).value=a[k];preview();toast('Design loaded')}catch(e){toast(e.message)}finally{e.target.value=''}};
$('#export').onclick=async()=>{const button=$('#export');button.disabled=true;try{await atelierReady();const data=collect(),svg=atelierSpec(selected.id)?atelierCard(data,selected,true):cardSVG(data,selected),format=$('#format').value;if(format==='svg'){Studio.download(new Blob([svg],{type:'image/svg+xml'}),'Mubiey-Wedding-Card.svg');return}const wm=Number($('#width-mm').value),hm=Number($('#height-mm').value),dpi=Number($('#dpi').value);if(!(wm>=30&&wm<=600&&hm>=30&&hm<=840))throw Error('Use dimensions within the allowed range.');const w=Math.round(wm/25.4*dpi),h=Math.round(hm/25.4*dpi);if(w*h>40000000)throw Error('Choose a smaller size or lower DPI (maximum 40 megapixels).');const c=await Studio.svgCanvas(svg,w,h);await Studio.exportCanvas(c,format,'Mubiey-Wedding-Card',{widthMm:wm,heightMm:hm});$('#card-status').textContent=`Exported ${wm} × ${hm} mm · ${w} × ${h} px`;toast('Card downloaded')}catch(e){toast(e.message)}finally{button.disabled=false}};
renderList();
