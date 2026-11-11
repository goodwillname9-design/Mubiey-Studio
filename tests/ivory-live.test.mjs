import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {validate} from '../lib/validate.js';

const PNG='data:image/png;base64,'+'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jhFoAAAAASUVORK5CYII=';
const ids=['2005','2006','2007','2008','2009'];
function context(){
 const noop=()=>{};
 const c=vm.createContext({location:{origin:'https://studio.example'},Studio:{escape:s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))},URL,console,Math,JSON,Date,Intl,TextEncoder,TextDecoder});
 c.globalThis=c;c.window=c;c.addEventListener=noop;c.matchMedia=()=>({matches:false,addEventListener:noop});c.navigator={};c.localStorage={getItem:()=>null,setItem:noop};
 c.document={getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:noop,createElement:()=>({style:{},setAttribute:noop,append:noop,addEventListener:noop}),head:{insertAdjacentHTML:noop,append:noop},body:{append:noop}};
 const html=fs.readFileSync('public/guest.html','utf8');
 const scripts=[...html.matchAll(/<script src="\/?([^"]+\.js)"/g)].map(m=>m[1]).filter(f=>f!=='guest.js');
 assert.ok(scripts.includes('ivory-live.js'),'guest.html loads ivory-live.js');
 assert.ok(scripts.indexOf('ivory-live.js')>scripts.indexOf('ruby-luxury.js'),'ivory-live.js loads after ruby-luxury.js');
 assert.ok(scripts.indexOf('logo-overlay.js')>scripts.indexOf('ivory-live.js'),'logo-overlay.js wraps the ivory designs');
 for(const f of scripts)vm.runInContext(fs.readFileSync('public/'+f,'utf8'),c);
 return c;
}
const render=(c,d)=>{c.data=d;return vm.runInContext('invitationDocument(data)',c)};
const base={name1:'Aisha',name2:'Rayyan',date:'2026-12-20T18:00:00+03:00',timeText:'6:00 PM',tradition:'Muslim'};

test('all five ivory colourways render with envelope gate, arch scene and calendar',()=>{
 const c=context();
 for(const id of ids){
  const html=render(c,{...base,template:id,animation:true});
  assert.match(html,/id="iv-gate"/,id+' has the envelope gate');
  assert.match(html,/class="flap t"/,id+' has the four flaps');
  assert.match(html,/id="iv-cal"/,id+' has the calendar');
  assert.match(html,/DECEMBER/,id+' shows the wedding month');
  assert.match(html,/class="dy mk h"/,id+' hearts the wedding day by default');
  assert.match(html,/assets\/ivory\/(arch|sage)\.jpg/,id+' uses the arch or sage artwork');
  assert.ok(!/<script[^>]*src=/.test(html.replace(/<script>/g,'')),id+' loads no external script');
 }
 assert.notEqual(render(c,{...base,template:'2005'}),render(c,{...base,template:'2009'}),'colourways differ');
});

test('calendar: month, heart and ring marks come from rubyCfg and stay inside the month',()=>{
 const c=context();
 const cfg=JSON.stringify({cal:{y:2027,m:2,marks:{'14':'h','15':'r','30':'h','x':'h'},note:'Walima on the 15th'}});
 const html=render(c,{...base,template:'2005',rubyCfg:cfg});
 assert.match(html,/FEBRUARY/);assert.match(html,/2027/);
 assert.equal((html.match(/class="dy mk h"/g)||[]).length,1,'one heart (day 30 does not exist in February 2027)');
 assert.equal((html.match(/class="dy mk r"/g)||[]).length,1,'one ring');
 assert.match(html,/Sunday, 14 February 2027/,'caption uses the heart day');
 assert.match(html,/Walima on the 15th/);
 const none=render(c,{...base,template:'2005',rubyCfg:'{not json'});
 assert.match(none,/DECEMBER/,'bad settings fall back to the wedding month');
});

test('text is escaped and fonts/sizes from rubyCfg are applied',()=>{
 const c=context();
 const html=render(c,{...base,name1:'<img src=x onerror=1>',template:'2006',rubyCfg:JSON.stringify({f:{names:'parisienne',heads:'playfair'},s:{names:130}})});
 assert.ok(!html.includes('<img src=x onerror=1>'));
 assert.match(html,/--sn:1\.30/);assert.match(html,/--fn:AtelierParisienne/);assert.match(html,/--fh:AtelierPlayfair/);
});

test('the studio logo is drawn on top of every ivory design (also on the opening envelope)',()=>{
 const c=context();
 for(const id of ids){const html=render(c,{...base,template:id,logo:PNG});assert.match(html,/id="mubiey-logo"/,id)}
});

test('validator keeps the ivory settings (calendar marks) inside rubyCfg',()=>{
 const cfg=JSON.stringify({v:1,cal:{y:2026,m:12,marks:{'20':'h','21':'r'},note:'Walima on the 21st'}});
 assert.equal(validate({rubyCfg:cfg}).rubyCfg,cfg);
 assert.ok(validate({rubyCfg:'x'.repeat(5000)}).rubyCfg.length<=3000);
});

test('artwork files exist',()=>{
 for(const f of ['arch.jpg','envelope.jpg','sage.jpg','bismillah.png','peony.png','swans.png'])assert.ok(fs.existsSync('public/assets/ivory/'+f),f);
});
