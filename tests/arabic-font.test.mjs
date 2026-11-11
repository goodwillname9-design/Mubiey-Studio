import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {validate} from '../lib/validate.js';

const FONT_DATA='data:font/ttf;base64,AAAA';
function context(){
 const c=vm.createContext({location:{origin:'https://studio.example'},Studio:{escape:s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))},URL,console,
  fetch:async()=>({ok:true,blob:async()=>new Blob(['x'])}),
  FileReader:class{readAsDataURL(){setTimeout(()=>this.onload({target:this}),0);this.result=FONT_DATA}}});
 c.globalThis=c;c.window=c;
 const noop=()=>{};c.document={getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:noop,createElement:()=>({style:{},setAttribute:noop,append:noop,addEventListener:noop}),head:{insertAdjacentHTML:noop,append:noop},body:{append:noop,addEventListener:noop},documentElement:{style:{}},readyState:'complete'};
 c.addEventListener=noop;c.matchMedia=()=>({matches:false,addEventListener:noop});c.navigator={};c.localStorage={getItem:()=>null,setItem:noop};c.setTimeout=setTimeout;
 const html=fs.readFileSync('public/guest.html','utf8');
 const scripts=[...html.matchAll(/<script src="\/?([^"]+\.js)"/g)].map(m=>m[1]).filter(f=>f!=='guest.js');
 assert.ok(scripts.includes('arabic-font.js'),'guest.html loads arabic-font.js');
 for(const f of scripts)vm.runInContext(fs.readFileSync('public/'+f,'utf8'),c);
 vm.runInContext(fs.readFileSync('public/invitation-customization.js','utf8'),c);
 return c;
}
const render=(c,d)=>{c.data=d;return vm.runInContext('invitationDocument(data)',c)};
const ids=['premium-26-3','royal-red-gold','111','222','333','444','777','888','999','555','heavy-luxury','stepup','royal-stage','2000','2001','2002','2003','2004','ruby-luxury'];

test('editor and guest pages both load the universal Arabic font script after every renderer',()=>{
 for(const f of ['public/invitations.html','public/guest.html']){
  const h=fs.readFileSync(f,'utf8'),a=h.indexOf('arabic-font.js');
  assert.ok(a>0,f);assert.ok(a>h.indexOf('invite-card.js'),f);
 }
});
test('every design: chosen Arabic font is applied (not only the envelope-story ones)',()=>{
 const c=context();
 for(const id of ids){
  const html=render(c,{template:id,name1:'Ameen',name2:'Fathima',date:'2028-04-20T11:30+05:30',arabicFont:'kufi',openingStyle:'seal',animation:true});
  assert.ok(html.includes('id="mubiey-arabic-font"'),id);
  assert.ok(html.includes('font-family:MubArabic'),id);
  assert.ok(html.indexOf('mubiey-arabic-font')<html.search(/<\/head>/i),id+' style is inside <head>');
  assert.ok(html.includes('https://studio.example/assets/fonts/ar/kufi.ttf'),id+' falls back to the font URL until embedded');
 }
});
test('default Amiri and unknown values leave the design untouched',()=>{
 const c=context();
 for(const a of [undefined,'amiri','evil;}','']){
  const html=render(c,{template:'royal-stage',name1:'A',name2:'B',arabicFont:a});
  assert.ok(!html.includes('mubiey-arabic-font'),String(a));
 }
});
test('saved Arabic typography and independent page backgrounds are emitted into guest HTML',()=>{
 const c=context(),font='/media/11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222';
 const image1='/media/11111111-1111-4111-8111-111111111111/33333333-3333-4333-8333-333333333333';
 const image2='/media/11111111-1111-4111-8111-111111111111/44444444-4444-4444-8444-444444444444';
 const html=render(c,{template:'premium-0-0',name1:'A',name2:'B',arabicFont:'amiri',arabicTypography:{font:'custom',size:32,weight:700,lineHeight:2.1,align:'right',color:'#123456',customFont:{url:font,name:'custom.woff2',format:'woff2'}},pageBackgrounds:[{image:image1,size:'cover',imageOpacity:0.8,overlayColor:'#000000',overlayOpacity:0.2,color:'#ffffff'}, {image:image2,size:'contain',x:20,y:80,imageOpacity:1,overlayOpacity:0,color:'#fefefe'}]});
 assert.match(html,/direction:rtl!important/);
 assert.match(html,/font-size:32px!important/);
 assert.match(html,/font-weight:700!important/);
 assert.match(html,/src:url\("\/media\/11111111/);
 assert.match(html,/data-mubiey-page="1"/);
 assert.match(html,/data-mubiey-page="2"/);
 assert.ok(html.includes(`url("${image1}")`));
 assert.ok(html.includes(`url("${image2}")`));
 assert.ok(html.includes('background-size:contain'));
});
test('after the font is loaded it is embedded as a data URL (works in sandboxed guest iframe and exported files)',async()=>{
 const c=context();
 await vm.runInContext("vnLoadArabicFont('ruqaa')",c);
 for(const id of ['royal-stage','ruby-luxury','stepup','777','heavy-luxury']){
  const html=render(c,{template:id,name1:'A',name2:'B',arabicFont:'ruqaa'});
  assert.ok(html.includes(`src:url(${FONT_DATA})`),id);
  assert.ok(!html.includes('/assets/fonts/ar/ruqaa.ttf'),id);
 }
});
test('Arabic selectors cover every class the designs use, and the font is saved with the invitation',()=>{
 const css=fs.readFileSync('public/arabic-font.js','utf8');
 for(const s of ['[lang="ar"]','[dir="rtl"]','.bism','.fn-bismillah','.ar','.vn-ar','.a7-ar','.w8-ar','.j-ar','.bf-ar','text[direction="rtl"]'])assert.ok(css.includes(s),s);
 assert.equal(validate({arabicFont:'nastaliq'}).arabicFont,'nastaliq');
});
