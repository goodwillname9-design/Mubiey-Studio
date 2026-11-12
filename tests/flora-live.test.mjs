import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {validate} from '../lib/validate.js';

const ids=['3001','3002','3003','3004','3005'];
function context(){
 const noop=()=>{};
 const c=vm.createContext({location:{origin:'https://studio.example'},Studio:{escape:s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))},URL,console,Math,JSON,Date,Intl,TextEncoder,TextDecoder});
 c.globalThis=c;c.window=c;c.addEventListener=noop;c.matchMedia=()=>({matches:false,addEventListener:noop});c.navigator={};
 c.document={getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:noop,createElement:()=>({style:{},setAttribute:noop,append:noop,addEventListener:noop}),head:{insertAdjacentHTML:noop,append:noop},body:{append:noop}};
 const html=fs.readFileSync('public/guest.html','utf8');
 const scripts=[...html.matchAll(/<script src="\/?([^"]+\.js)"/g)].map(m=>m[1]).filter(f=>f!=='guest.js');
 assert.ok(scripts.includes('flora-live.js'),'guest.html loads flora-live.js');
 assert.ok(scripts.indexOf('flora-live.js')>scripts.indexOf('ivory-live.js'),'flora loads after ivory');
 for(const f of scripts)vm.runInContext(fs.readFileSync('public/'+f,'utf8'),c);
 return c;
}
const render=(c,d)=>{c.data=d;return vm.runInContext('invitationDocument(data)',c)};
const base={name1:'Ahmed',name2:'Fathima',date:'2027-02-14T16:30:00+03:00',timeText:'4:30 PM',tradition:'Muslim',message:'Two families.',schedule:[{title:'Nikah',time:'4:30 PM'}]};

test('five floral colourways render: envelope gate, six pages, no text boxes',()=>{
 const c=context();
 for(const id of ids){
  const h=render(c,{...base,template:id});
  assert.match(h,/id="fl-gate"/,id+' gate');
  assert.match(h,/class="sealc"/,id+' seal');
  for(const k of ['hero','date','story','day','events','end'])assert.match(h,new RegExp('sec-'+k),id+' page '+k);
  assert.match(h,/class="bfs"/,id+' butterflies');
  assert.match(h,/assets\/flora\/frame\.jpg/,id+' default artwork');
  assert.doesNotMatch(h,/class="panel"/,id+' no boxes');
 }
});

test('each page can use its own artwork or your own picture',()=>{
 const c=context();
 const pic='data:image/jpeg;base64,/9j/4AAQSkZJRg==';
 const h=render(c,{...base,template:'3002',floraBg:JSON.stringify({hero:'ribbon',story:pic,end:'nonsense'})});
 assert.match(h,/sec-hero \.sbg\{background-image:url\('[^']*ribbon\.jpg'\)/);
 assert.match(h,/sec-story \.sbg\{background-image:url\('data:image\/jpeg/);
 assert.match(h,/sec-end \.sbg\{background-image:url\('[^']*frame\.jpg'\)/,'unknown choice falls back to the default');
});

test('names fit on at most two lines and are never split inside a word',()=>{
 const c=context();
 const h=render(c,{...base,template:'3001',name1:'Muhammad Abdul Rahman',name2:'Fathima Zubaida Yusuf'});
 assert.match(h,/class="nm hv fit2"/);
 assert.match(h,/overflow-wrap:normal;word-break:normal/);
});

test('settings are kept: floraBg validated and sized',()=>{
 const v=validate({floraBg:JSON.stringify({hero:'ribbon'})});
 assert.equal(JSON.parse(v.floraBg).hero,'ribbon');
 assert.ok(validate({floraBg:'x'.repeat(2000000)}).floraBg.length<=400000);
});

test('artwork files exist',()=>{
 for(const f of ['envelope.jpg','frame.jpg','ribbon.jpg','damask.jpg'])assert.ok(fs.existsSync('public/assets/flora/'+f),f);
});

test('opening logo: platform /media references are accepted and the gold colour applies',()=>{
 const v=validate({openLogo:'/media/0123abcd-0123-4567-89ab-0123456789ab/0123abcd-0123-4567-89ab-0123456789cd'});
 assert.match(v.openLogo,/^\/media\//);
 const c=context();
 const h=render(c,{...base,template:'3002',rubyCfg:JSON.stringify({gold:'#7a3b5c'})});
 assert.match(h,/--acc:#7a3b5c/);
});

test('ivory designs: per-page backgrounds, opening logo lifts to the corner and shows in the editor preview',()=>{
 const c=context();
 const PNG2='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jhFoAAAAASUVORK5CYII=';
 const h=render(c,{...base,template:'2005',openLogo:PNG2,floraBg:JSON.stringify({hero:'ribbon',end:'damask'})});
 assert.match(h,/sec-hero|data-k="hero"[^>]*style="[^"]*"/);
 assert.match(h,/ribbon\.jpg/,'hero uses the chosen page background');
 assert.match(h,/damask\.jpg/,'closing uses the chosen page background');
 assert.match(h,/classList\.add\('lift'\)|om\.classList\.add\('lift'\)/,'opening logo lifts out of the envelope');
 const prev=render(c,{...base,template:'2005',openLogo:PNG2,_editorPreview:true});
 assert.match(prev,/class="om lift corner"/,'editor preview shows the opening logo in the corner');
});

test('opening logo size: the circle stays round and the logo size comes from rubyCfg',()=>{
 const c=context();
 const PNG2='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jhFoAAAAASUVORK5CYII=';
 const h=render(c,{...base,template:'2005',openLogo:PNG2,rubyCfg:JSON.stringify({olSize:130})});
 assert.match(h,/--olsz:130/);
 const d=render(c,{...base,template:'3001',openLogo:PNG2});
 assert.match(d,/--olsz:100/,'default fills the circle');
});

test('opening logo is round: the image is clipped to a circle wherever it appears',()=>{
 const c=context();
 const PNG2='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jhFoAAAAASUVORK5CYII=';
 const css=(h)=>h.match(/\.om img\{[^}]*\}/)?.[0]||'';
 assert.match(css(render(c,{...base,template:'2005',openLogo:PNG2})),/border-radius:50%/);
 assert.match(render(c,{...base,template:'3001',openLogo:PNG2}),/border-radius:50%/);
});

test('first page verse and last page dua appear on every new design when filled in',()=>{
 const c=context();
 const d={...base,verseArabic:'وَخَلَقْنَاكُمْ أَزْوَاجًا',verse:'And we created you in pairs',blessingArabic:'بَارَكَ اللَّهُ لَكَ',blessing:'May Allah bless you'};
 for(const id of ['2005','3001','4003','ruby-luxury']){
  const h=render(c,{...d,template:id});
  assert.match(h,/class="ar-verse"/,id+' verse');
  assert.match(h,/class="ar-dua"/,id+' dua');
  assert.match(h,/وَخَلَقْنَاكُمْ/,id);
  assert.match(h,/بَارَكَ اللَّهُ لَكَ/,id);
 }
 assert.doesNotMatch(render(c,{...base,template:'3001'}),/class="ar-dua"/,'empty when nothing is entered');
});

test('verse and dua are marked as Arabic so the chosen Arabic font applies to them',()=>{
 const c=context();
 const h=render(c,{...base,template:'2005',verseArabic:'وَخَلَقْنَاكُمْ',blessingArabic:'بَارَكَ',arabicFont:'rakkas'});
 assert.match(h,/class="ar-verse" lang="ar" dir="rtl"/);
 assert.match(h,/class="ar-dua" lang="ar" dir="rtl"/);
});

test('text alignment choice (left, centre, right) is applied on every new design',()=>{
 const c=context();
 assert.match(render(c,{...base,template:'2005',rubyCfg:JSON.stringify({align:'left'})}),/--jc:flex-start/);
 assert.match(render(c,{...base,template:'3001',rubyCfg:JSON.stringify({align:'right'})}),/--al:right/);
 assert.match(render(c,{...base,template:'ruby-luxury'}),/--al:center/);
});
