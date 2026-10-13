import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {validate} from '../lib/validate.js';
function renderer(){const c=vm.createContext({location:{origin:'https://studio.example'},Studio:{escape:s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))},URL,console});
 for(const f of ['live-presets','invitation-renderer','floral-cards','card-renderer','atelier','atelier-experience','royal-curtain','velvet-scroll']){const p='public/'+f+'.js';if(fs.existsSync(p))vm.runInContext(fs.readFileSync(p,'utf8'),c)}return c}
const render=(c,d)=>{c.data=d;return vm.runInContext('invitationDocument(data)',c)};
const base={template:'heavy-luxury',name1:'Hashir Ali Khan',name2:'Yusra Usman',date:'2026-12-25T21:00+03:00',venue:'Grand Hall',address:'Salmiya, Kuwait',family:'MR. & MRS. YASIR ALI KHAN',mapUrl:'https://maps.google.com/?q=Kuwait',rsvpUrl:'https://wa.me/96500000000',photos:['/media/a','/media/b'],music:'/media/song',animation:true,musicAutoplay:true,schedule:[{title:'Nikah',time:'9:00 PM',detail:'Ceremony'}]};

test('validator keeps the new Velvet fields and limits their length',()=>{
 const d=validate({verse:'v',verseArabic:'ا',blessing:'b',blessingArabic:'ب',rsvpText:'r',monogram:'ABCDE'});
 assert.equal(d.verse,'v');assert.equal(d.monogram,'ABC');assert.equal(validate({}).blessing,'');
});
test('guest document has envelope, all pages, scratch date, countdown and music',()=>{
 const html=render(renderer(),base);
 for(const k of ['id="vn-cover"','id="vn-open"','id="vn-letter"','id="vn-p1"','id="vn-datepage"','id="vn-final"','id="vn-last"','id="vn-scratch"','id="vn-reveal"','id="vn-count"','id="music"','vn-gallery','Moments of the day','GET DIRECTIONS','RSVP ↗','prefers-reduced-motion'])assert.ok(html.includes(k),k);
 assert.ok(html.includes('Dawat-e-Nikah'));assert.ok(html.includes('And we created you in pairs'));
 assert.ok(!html.includes('mubiey-direct'));
});
test('date, weekday, time and calendar grid are computed correctly',()=>{
 const html=render(renderer(),base);
 assert.ok(html.includes('DECEMBER'));assert.ok(html.includes('FRI'));assert.ok(html.includes('9:00 PM'));assert.ok(html.includes('2026'));
 assert.equal((html.match(/class="vn-day/g)||[]).length,31);assert.equal((html.match(/vn-day vn-target">25</g)||[]).length,1);
 assert.ok(html.includes('<div class="vn-grid"><span></span><span></span><span class="vn-day">1<'));  // 1 Dec 2026 is a Tuesday
 assert.ok(render(renderer(),{...base,date:''}).includes('Date to be announced'));
});
test('owner texts are used, defaults fill gaps, input is escaped',()=>{
 const c=renderer();
 const html=render(c,{...base,verse:'Custom line',monogram:'HY',blessing:'Custom dua',rsvpText:'Please reply',name1:'<script>alert(1)</script>',family:'<img src=x onerror=1>'});
 assert.ok(html.includes('Custom line'));assert.ok(html.includes('>HY<'));assert.ok(html.includes('Custom dua'));assert.ok(html.includes('Please reply'));
 assert.ok(!html.includes('<script>alert'));assert.ok(!html.includes('<img src=x'));
 assert.ok(render(c,{...base,rsvpUrl:'javascript:alert(1)'}).includes('RSVP ↗')===false);
});
test('envelope is skipped for editor preview, animation off and direct opening; music OFF respected',()=>{
 const c=renderer();
 for(const o of [{_editorPreview:true},{animation:false},{openingStyle:'none'}])assert.ok(!render(c,{...base,...o}).includes('id="vn-cover"'));
 assert.ok(render(c,{...base,_editorPreview:true}).includes('mubiey-direct-text'));
 assert.ok(!render(c,{...base,musicAutoplay:false}).includes('startMusic();cover'));
 assert.ok(render(c,{...base}).includes('startMusic();cover.classList.add'));
});
test('Heavy Luxury details page: parents, time range, compliments, directions; page order',()=>{
 const c=renderer();
 const html=render(c,{...base,parents1:'S/O Mr. & Mrs. Khan',parents2:'D/O Mr. & Mrs. Usman',timeText:'7 p.m. to 10 p.m.',compliments:'With best compliments from the Khan family'});
 for(const k of ['S/O Mr. &amp; Mrs. Khan','D/O Mr. &amp; Mrs. Usman','7 p.m. to 10 p.m.','With best compliments from the Khan family','GET DIRECTIONS'])assert.ok(html.includes(k),k);
 const order=['id="vn-p1"','id="vn-datepage"','id="vn-gallery-page"','id="vn-final"','id="vn-last"'].map(k=>html.indexOf(k));
 assert.ok(order.every((v,i)=>v>0&&(i===0||v>order[i-1])),'page order '+order);
 assert.ok(render(c,base).includes('With best compliments from our family'));
 assert.ok(render(c,{...base,template:'velvet-nikah-scroll'}).includes('id="vn-cover"'));
});
test('extra luxury motion is present and respects reduced motion',()=>{
 const html=render(renderer(),base);
 for(const k of ['class="vn-dust"','class="vn-aura"','class="vn-spark"','id="vn-shower"','id="vn-progress"','class="vn-sparks"','vn-shine','@keyframes vn-write','@keyframes vn-burst'])assert.ok(html.includes(k),k);
 assert.ok(/prefers-reduced-motion:reduce\)\{\.vn-dust/.test(html));
 const preview=render(renderer(),{...base,_editorPreview:true});assert.ok(!preview.includes('id="vn-shower"'));
});
test('777: uses the four artwork images, scratch on the details page date, last-page Arabic blessing',()=>{
 const c=renderer();
 const html=render(c,{...base,template:'777',parents1:'S/O Mr. & Mrs. Kazi',timeText:'7p.m to 10p.m.',blessingArabic:'دعاء مخصص',blessing:'Custom English blessing'});
 assert.ok(html.includes('id="vn-cover"'));assert.ok(!html.includes('id="vn-datepage"'));
 for(const f of ['cover.jpg','card.jpg','details.jpg','blessing.jpg'])assert.ok(html.includes('https://studio.example/assets/777/'+f),f);
 for(const k of ['id="vn-p1"','id="vn-final"','id="vn-last"','id="vn-scratch"','id="vn-reveal"','a7-monob','OPEN777'.toLowerCase()==='x'?'':'a7-flare'])assert.ok(html.includes(k),k);
 assert.equal((html.match(/id="vn-scratch"/g)||[]).length,1);
 const f=html.indexOf('id="vn-final"'),l=html.indexOf('id="vn-last"'),sc=html.indexOf('id="vn-scratch"');
 assert.ok(sc>f&&sc<l,'scratch inside details page');
 const lastPage=html.slice(l);assert.ok(lastPage.includes('دعاء مخصص')&&lastPage.includes('Custom English blessing'),'blessing on the last page');
 assert.ok(html.includes('7p.m to 10p.m.'));assert.ok(html.includes('GET DIRECTIONS'));
 const order=['id="vn-p1"','id="vn-final"','id="vn-last"'].map(k=>html.indexOf(k));assert.ok(order[0]<order[1]&&order[1]<order[2]);
 assert.ok(html.includes('a7wb'));assert.ok(html.includes("cover.classList.add('emerge')"));
 assert.ok(render(c,{...base,template:'heavy-luxury'}).includes('id="vn-datepage"'));
 assert.ok(!render(c,{...base,template:'777',_editorPreview:true}).includes('id="vn-cover"'));
 assert.ok(render(c,{...base,template:'777',_editorPreview:true}).includes('mubiey-direct-text'));
 const x=render(c,{...base,template:'777',name1:'<script>alert(1)</script>',blessingArabic:'<img src=x onerror=1>'});assert.ok(!x.includes('<script>alert')&&!x.includes('<img src=x'));
});
test('111 / 222 / 333 / 444 colourways: own artwork folder, own colours, same story flow',()=>{
 const c=renderer();
 const colours={'111':'#0f5a43','222':'#1d3a78','333':'#5a2a7e','444':'#2b2b30'};
 for(const [id,ink] of Object.entries(colours)){
  const html=render(c,{...base,template:id});
  for(const f of ['cover','card','details','blessing'])assert.ok(html.includes(`https://studio.example/assets/${id}/${f}.jpg`),id+' '+f);
  assert.ok(html.includes('--ink:'+ink),id+' colour');assert.ok(html.includes('id="vn-cover"')&&html.includes('id="vn-scratch"')&&html.includes('id="vn-last"'));
  assert.ok(!html.includes('/assets/777/'));assert.ok(html.includes('class="a7-tw"'));
 }
 assert.ok(render(c,{...base,template:'777'}).includes('--ink:#7a1426'));
});
test('Arabic font choice: whitelisted, defaults to Amiri, CSS variable present',()=>{
 assert.equal(validate({arabicFont:'ruqaa'}).arabicFont,'ruqaa');assert.equal(validate({arabicFont:'evil;}'}).arabicFont,'amiri');assert.equal(validate({}).arabicFont,'amiri');
 const html=render(renderer(),{...base,template:'777',arabicFont:'ruqaa'});assert.ok(html.includes('--arf:AtelierAmiri'));assert.ok(html.includes('var(--arf)'));
});
test('extra motion: twinkles, sheen, sweep and ken-burns respect reduced motion',()=>{
 const html=render(renderer(),{...base,template:'777'});
 for(const k of ['@keyframes a7-tw','@keyframes a7-kb','@keyframes a7-sheen','@keyframes a7-sweep'])assert.ok(html.includes(k),k);
 assert.ok(/prefers-reduced-motion:reduce\)\{\.a7-tw/.test(html));
});
test('other templates are untouched',()=>{
 const c=renderer();const html=render(c,{name1:'A',name2:'B',template:'premium-0-0'});
 assert.ok(!html.includes('vn-cover'));assert.ok(html.includes('id="countdown"'));
});
test('generated inline scripts are valid JavaScript',()=>{
 const html=render(renderer(),base);const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);assert.ok(scripts.length>=1);
 for(const s of scripts)new vm.Script(s);
});
