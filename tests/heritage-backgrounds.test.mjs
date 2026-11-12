import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {validate} from '../lib/validate.js';

function context(){
 const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const noop=()=>{};
 const c=vm.createContext({location:{origin:'https://studio.example'},URL,console});
 c.window=c;c.globalThis=c;c.Studio={escape};c.window.Studio=c.Studio;
 c.document={readyState:'complete',getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:noop};
 for(const file of ['public/live-presets.js','public/invitation-renderer.js','public/heritage-backgrounds.js','public/invitation-customization.js']){
  vm.runInContext(fs.readFileSync(file,'utf8'),c,{filename:file});
 }
 return c;
}
const render=(c,data)=>{c.data=data;return vm.runInContext('invitationDocument(data)',c)};

test('new invitation designs are selectable without changing the curated template catalog',()=>{
 const c=context();
 assert.equal(vm.runInContext('INVITATION_TEMPLATES.length',c),35);
 assert.deepEqual(JSON.parse(JSON.stringify(vm.runInContext('INVITATION_ADDONS.map(({id})=>id)',c))),['gold-seal-envelope','islamic-arch-lanterns','watercolor-lantern-florals']);
 const root={exports:{}};
 vm.runInNewContext(fs.readFileSync('live-presets.js','utf8'),{module:root});
 assert.deepEqual(JSON.parse(JSON.stringify(root.exports.INVITATION_ADDONS.map(({id})=>id))),['gold-seal-envelope','islamic-arch-lanterns','watercolor-lantern-florals']);
});

test('Gold Seal Envelope opens accessibly and keeps the existing invitation content',()=>{
 const c=context(),logo='data:image/png;base64,AAAA';
 const html=render(c,{template:'gold-seal-envelope',name1:'Amina',name2:'Omar',heading:'Our wedding',date:'2028-04-20T11:30+05:30',venue:'Garden Hall',family:'Our families',logo,animation:true});
 assert.match(html,/<div class="gse-cover[^"]*" id="gse-cover" role="dialog"/);
 assert.match(html,/<button class="gse-open" id="gse-open" type="button" aria-label="Open the invitation"><\/button>/);
 assert.ok(html.includes(`<img src="${logo}" alt="">`));
 assert.ok(html.includes('Tap the gold seal to open'));
 assert.ok(html.includes("cover.dataset.stage='emerge'"));
 assert.ok(html.includes('transition:transform 1.05s'));
 for(const content of ['Amina','Omar','Our wedding','Garden Hall','Our families','id="countdown"','id="location"','id="location-groom"'])assert.ok(html.includes(content),content);
 const reduced=render(c,{template:'gold-seal-envelope',name1:'A',name2:'B',animation:false});
 assert.ok(reduced.includes('gse-cover no-motion'));
});

test('lantern backgrounds provide architectural and watercolor artwork with lightweight motion',()=>{
 const c=context();
 for(const template of ['islamic-arch-lanterns','watercolor-lantern-florals']){
  const html=render(c,{template,name1:'A',name2:'B',animation:true});
  assert.ok(html.includes('mubiey-bg-'),template);
  assert.ok(html.includes('mubiey-lantern-sway'),template);
  assert.ok(html.includes('prefers-reduced-motion:reduce'),template);
  assert.ok(html.includes('/invitation-backgrounds.css'),template);
  assert.ok(html.includes('id="countdown"'),template);
 }
 const backgroundsCSS=fs.readFileSync('public/invitation-backgrounds.css','utf8');
 assert.ok(backgroundsCSS.includes('background-size:cover'));
 assert.ok(backgroundsCSS.includes('background-position:center'));
 assert.ok(backgroundsCSS.includes('background-repeat:no-repeat'));
 assert.ok(backgroundsCSS.includes('background-attachment:fixed'));
 const custom=render(c,{template:'premium-0-0',name1:'A',name2:'B',pageBackgrounds:[{preset:'watercolor-lantern-florals'}]});
 assert.ok(custom.includes('mubiey-bg-watercolor-lanterns'));
 assert.ok(custom.includes('data:image/svg+xml'));
 const imagePath=render(c,{template:'premium-0-0',name1:'A',name2:'B',pageBackgrounds:[{image:'/images/backgrounds/custom.jpg'}]});
 assert.ok(imagePath.includes('url("/images/backgrounds/custom.jpg")'));
 assert.ok(fs.readFileSync('public/invitations.html','utf8').includes('src="/heritage-backgrounds.js"'));
 assert.ok(fs.readFileSync('public/guest.html','utf8').includes('src="/invitation-customization.js"'));
});

test('background presets validate against a safe allowlist',()=>{
 assert.equal(validate({pageBackgrounds:[{preset:'islamic-arch-lanterns'}]}).pageBackgrounds[0].preset,'islamic-arch-lanterns');
 assert.equal(validate({pageBackgrounds:[{preset:'watercolor-lantern-florals'}]}).pageBackgrounds[0].preset,'watercolor-lantern-florals');
 assert.equal(validate({pageBackgrounds:[{image:'/images/backgrounds/custom.jpg'}]}).pageBackgrounds[0].image,'/images/backgrounds/custom.jpg');
 assert.equal(validate({pageBackgrounds:[{preset:'javascript:alert(1)'}]}).pageBackgrounds[0].preset,'');
 assert.throws(()=>validate({pageBackgrounds:[{image:'/images/backgrounds/../private.jpg'}]}),/path under/);
});
