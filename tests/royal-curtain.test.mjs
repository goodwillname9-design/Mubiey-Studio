import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {validate} from '../lib/validate.js';

// Loads the same browser scripts, in the same order, as the guest/editor pages.
function renderer(){
  const c=vm.createContext({location:{origin:'https://studio.example'},Studio:{escape:s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))},URL,console});
  for(const f of ['live-presets','invitation-renderer','floral-cards','card-renderer','atelier','atelier-experience','royal-curtain']){
    const path='public/'+f+'.js';
    if(fs.existsSync(path))vm.runInContext(fs.readFileSync(path,'utf8'),c);
  }
  return c;
}
const render=(c,data)=>{c.data=data;return vm.runInContext('invitationDocument(data)',c)};
const sample={name1:'Ahammad',name2:'Fathima',date:'2027-02-12T11:00+03:00',venue:'Grand Hall',mapUrl:'https://maps.google.com/?q=Kuwait',photos:['/media/a','/media/b','/media/c','/media/d'],music:'/media/song',animation:true,musicAutoplay:true};

test('validator keeps curtain opening, family text and a safe RSVP link',()=>{
  const d=validate({name1:'A',openingStyle:'curtain',template:'royal-red-gold',family:'  Son of X  ',rsvpUrl:'https://wa.me/96500000000'});
  assert.equal(d.openingStyle,'curtain');assert.equal(d.template,'royal-red-gold');assert.equal(d.family,'Son of X');assert.equal(d.rsvpUrl,'https://wa.me/96500000000');
  for(const bad of ['javascript:alert(1)','http://insecure.example','not a link'])assert.throws(()=>validate({rsvpUrl:bad}),{code:'INVALID_INVITATION'});
  assert.equal(validate({openingStyle:'bogus'}).openingStyle,'seal');
  for(const old of ['seal','locket','none'])assert.equal(validate({openingStyle:old}).openingStyle,old);
  assert.equal(validate({}).rsvpUrl,'');
});

test('guest page gets velvet curtains, petals, an accessible open button and music start',()=>{
  const c=renderer();
  const html=render(c,{...sample,template:'royal-red-gold',openingStyle:'curtain'});
  assert.ok(html.includes('id="rr-curtain"'));assert.ok(html.includes('rr-panel rr-left'));assert.ok(html.includes('rr-panel rr-right'));
  assert.ok(html.includes('rr-fall'));assert.ok(html.includes('id="rr-open"'));assert.ok(html.includes('aria-modal="true"'));
  assert.ok(html.includes('prefers-reduced-motion'));assert.ok(html.includes('if(audio)audio.play()'));
  assert.ok(html.includes('--rr-gold'));assert.ok(html.includes('OPEN DIRECTIONS'));assert.ok(html.includes('id="countdown"'));
  for(const p of ['a','b','c','d'])assert.ok(html.includes('/media/'+p));
  assert.ok(!html.includes('mubiey-direct-text'));
});

test('music-on-opening OFF is respected; animation OFF and editing preview skip the curtain',()=>{
  const c=renderer();
  assert.ok(!render(c,{...sample,openingStyle:'curtain',musicAutoplay:false}).includes('if(audio)audio.play()'));
  assert.ok(!render(c,{...sample,openingStyle:'curtain',animation:false}).includes('id="rr-curtain"'));
  assert.ok(!render(c,{...sample,openingStyle:'curtain',_editorPreview:true}).includes('id="rr-curtain"'));
});

test('curtain replaces other openings and leaves existing styles untouched',()=>{
  const c=renderer();
  const atelier=render(c,{...sample,template:'atelier-3-6-2',openingStyle:'curtain'});
  assert.ok(atelier.includes('id="rr-curtain"'));assert.ok(!atelier.includes('id="envelope"'));
  const locket=render(c,{...sample,template:'atelier-4-2-1',openingStyle:'locket'});
  assert.ok(!locket.includes('id="rr-curtain"'));assert.ok(locket.includes('locket-half left'));
  const plain=render(c,{...sample,template:'premium-0-0',openingStyle:'seal'});
  assert.ok(!plain.includes('rr-curtain'));assert.ok(!plain.includes('--rr-gold'));
});

test('Royal template adds family and RSVP sections, escapes input, rejects unsafe links',()=>{
  const c=renderer();
  const html=render(c,{...sample,template:'royal-red-gold',openingStyle:'none',family:'<img src=x onerror=alert(1)>',rsvpUrl:'https://wa.me/96500000000'});
  assert.ok(html.includes('id="family"'));assert.ok(!html.includes('<img src=x'));
  assert.ok(html.includes('id="rsvp"'));assert.ok(html.includes('href="https://wa.me/96500000000"'));assert.ok(html.includes('noopener noreferrer'));
  assert.ok(!html.includes('id="rr-curtain"'));
  const unsafe=render(c,{...sample,template:'royal-red-gold',rsvpUrl:'javascript:alert(1)'});
  assert.ok(!unsafe.includes('id="rsvp"'));assert.ok(!unsafe.includes('javascript:alert'));
  const names=render(c,{...sample,name1:'<script>alert(1)</script>',template:'royal-red-gold',openingStyle:'curtain'});
  assert.ok(!names.includes('<script>alert'));
});
