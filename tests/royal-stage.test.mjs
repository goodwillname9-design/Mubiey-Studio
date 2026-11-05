import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {validate} from '../lib/validate.js';

function renderer(){
  const c=vm.createContext({location:{origin:'https://studio.example'},Studio:{escape:s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))},URL,console,Date,Math,JSON,window:{}});
  for(const f of ['live-presets','invitation-renderer','atelier','atelier-experience','royal-curtain','velvet-scroll','stepup-invitation','royal-stage','invite-card']){
    const path='public/'+f+'.js';
    if(fs.existsSync(path))vm.runInContext(fs.readFileSync(path,'utf8'),c);
  }
  return c;
}
const render=(c,data)=>{c.data=data;return vm.runInContext('invitationDocument(data)',c)};
const sample={name1:'Sana',name2:'Farhan',date:'2027-02-12T11:00+03:00',template:'royal-stage',tradition:'Muslim',parents1:'Iqbal Sheikh',message:'Join us',
 schedule:[{title:'Nikah',time:'7:00 PM',detail:'Duas'}],eventsText:"Nikah | 10 Dec | Home | https://maps.google.com/?q=1\nBad | 11 Dec | Hall | https://evil.example/x",photos:[],music:''};

test('validator keeps every Royal Stage text and the card wording, within limits',()=>{
  const d=validate({rsOpen:'Tap here',rsIntro:'x'.repeat(500),eventsText:'A | B | C | D',cardTitle:'Take it',cardNote:'n',cardButton:'View',cardDownload:'Get'});
  assert.equal(d.rsOpen,'Tap here');assert.equal(d.rsIntro.length,160);assert.equal(d.eventsText,'A | B | C | D');
  assert.equal(d.cardTitle,'Take it');assert.equal(d.cardButton,'View');assert.equal(d.cardDownload,'Get');
  assert.equal(validate({}).rsOpen,'');
});

test('Royal Stage renders the curtain gate, stage, scratch card, slider, timeline and event cards',()=>{
  const c=renderer();
  const html=render(c,{...sample,photos:['data:image/png;base64,AAAA'],font:'allura'});
  for(const needle of ['id="rs-gate"','Tap to open','class="cv l"','class="cv r"','l-stage','l-zoom','l-chand','l-oval','class="pops"','/assets/royal-stage/cover.jpg','/assets/royal-stage/oval.jpg','id="rs-foil"','id="rs-slider"','class="tl"','View on Google Maps','id="rs-cd"','data-rs="name1"'])assert.ok(html.includes(needle),needle);
  assert.ok(!html.includes('evil.example'),'only Google/Apple map links become buttons');
  assert.equal((html.match(/class="mapbtn"/g)||[]).length,1);
});

test('Royal Stage wording is editable, escaped and the gate is skipped in the editor preview or with animation off',()=>{
  const c=renderer();
  const html=render(c,{...sample,rsOpen:'Open <b>me</b>',rsIntro:'Custom intro',rsDateTitle:'Find our date',name1:'<img src=x onerror=alert(1)>'});
  assert.ok(html.includes('Open &lt;b&gt;me&lt;/b&gt;'));assert.ok(html.includes('Custom intro'));assert.ok(html.includes('Find our date'));
  assert.ok(!html.includes('<img src=x onerror'));
  assert.ok(!render(c,{...sample,_editorPreview:true}).includes('id="rs-gate"'));
  assert.ok(!render(c,{...sample,animation:false}).includes('id="rs-gate"'));
  assert.ok(render(c,{...sample,_editorPreview:true}).includes('mubiey-rs-edit'));
  assert.ok(!render(c,{...sample,tradition:'Hindu'}).includes('class="bism'),'no Bismillah for other traditions unless typed');
});

test('invitation card section appears on every template, only for safe card references',()=>{
  const c=renderer();
  const ref='/media/11111111-1111-1111-1111-111111111111/22222222-2222-2222-2222-222222222222';
  const card={ref,name:'My Card.pdf',type:'application/pdf'};
  const stage=render(c,{...sample,card,cardTitle:'Please take it'});
  assert.ok(stage.includes('id="mbc-pill"')&&stage.includes('Please take it')&&stage.includes(ref+'?download=1'));
  const base=render(c,{...sample,template:'premium-26-3',openingStyle:'none',card});
  assert.ok(base.includes('id="mb-card-end"')&&base.includes('Your invitation card'));
  for(const t of ['royal-red-gold','111','777','stepup','heavy-luxury','999','555'])assert.ok(render(c,{...sample,template:t,card}).includes('id="mbc-view"'),t+' shows the card');
  for(const bad of ['javascript:alert(1)','https://evil.example/card.pdf','/media/../../x','data:text/html;base64,AAAA'])assert.ok(!render(c,{...sample,card:{ref:bad,name:'x',type:'application/pdf'}}).includes('mbc-view'),bad);
  assert.ok(!render(c,sample).includes('mbc-view'),'no card, no section');
});
