import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {validate} from '../lib/validate.js';

const PNG='data:image/png;base64,'+'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jhFoAAAAASUVORK5CYII=';
const ids=['premium-26-3','royal-red-gold','111','222','333','444','777','888','999','555','heavy-luxury','stepup','royal-stage','2000','2001','2002','2003','2004','ruby-luxury'];

function context(){
 const noop=()=>{};
 const c=vm.createContext({location:{origin:'https://studio.example'},Studio:{escape:s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))},URL,console,fetch:async()=>({ok:true}),setTimeout});
 c.globalThis=c;c.window=c;c.addEventListener=noop;c.matchMedia=()=>({matches:false,addEventListener:noop});c.navigator={};c.localStorage={getItem:()=>null,setItem:noop};
 c.document={getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:noop,createElement:()=>({style:{},setAttribute:noop,append:noop,addEventListener:noop}),head:{insertAdjacentHTML:noop,append:noop},body:{append:noop,addEventListener:noop},documentElement:{style:{}},readyState:'complete'};
 const html=fs.readFileSync('public/guest.html','utf8');
 const scripts=[...html.matchAll(/<script src="\/?([^"]+\.js)"/g)].map(m=>m[1]).filter(f=>f!=='guest.js');
 assert.ok(scripts.includes('logo-overlay.js'),'guest.html loads logo-overlay.js');
 for(const f of scripts)vm.runInContext(fs.readFileSync('public/'+f,'utf8'),c);
 return c;
}
const render=(c,d)=>{c.data=d;return vm.runInContext('invitationDocument(data)',c)};

test('validator keeps a small PNG/JPG/WebP logo and rejects anything else',()=>{
 assert.equal(validate({logo:PNG}).logo,PNG);
 assert.equal(validate({logo:PNG.replace('png','jpeg')}).logo,PNG.replace('png','jpeg'));
 assert.equal(validate({logo:PNG.replace('png','webp')}).logo,PNG.replace('png','webp'));
 for(const bad of ['data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=','javascript:alert(1)','https://evil.example/x.png','data:image/png;base64,AAAA" onerror="alert(1)','data:text/html;base64,PGgxPg==',PNG+'<script>',
  'data:image/png;base64,'+'A'.repeat(200000),42,null,{}])assert.equal(validate({logo:bad}).logo,'',String(bad).slice(0,40));
 assert.equal(validate({}).logo,'');
 assert.equal(validate({logoSize:'lg'}).logoSize,'lg');assert.equal(validate({logoSize:'sm'}).logoSize,'sm');
 for(const bad of [undefined,'huge','md;}','']) assert.equal(validate({logoSize:bad}).logoSize,'md');
});
test('editor and guest pages load the logo scripts in the right order',()=>{
 const ed=fs.readFileSync('public/invitations.html','utf8'),g=fs.readFileSync('public/guest.html','utf8');
 assert.ok(ed.indexOf('logo-overlay.js')>ed.indexOf('invite-card.js')&&ed.indexOf('logo-overlay.js')<ed.indexOf('invitations.js'));
 assert.ok(ed.indexOf('logo-editor.js')>ed.indexOf('invitations.js')&&ed.indexOf('logo-editor.js')>ed.indexOf('velvet-editor.js'));
 assert.ok(g.indexOf('logo-overlay.js')>g.indexOf('invite-card.js')&&g.indexOf('logo-overlay.js')<g.indexOf('guest.js'));
});
test('every design shows the logo at the top-left, above everything, and unchanged designs stay unchanged',()=>{
 const c=context();
 for(const id of ids){
  const d={template:id,name1:'Ameen',name2:'Fathima',date:'2028-04-20T11:30+05:30',openingStyle:'seal',animation:true};
  const plain=render(c,d),withLogo=render(c,{...d,logo:PNG});
  assert.ok(!plain.includes('mubiey-logo'),id+' no logo = untouched');
  const body=withLogo.search(/<body\b[^>]*>/i),img=withLogo.indexOf('<img id="mubiey-logo"');
  assert.ok(body>=0&&img>body,id+' logo is inside <body>');
  assert.ok(/<body\b[^>]*><img id="mubiey-logo"/i.test(withLogo),id+' logo is the first element');
  assert.ok(withLogo.includes('src="'+PNG+'"'),id);
  const css=withLogo.indexOf('id="mubiey-logo-css"');
  assert.ok(css>=0&&css<withLogo.search(/<\/head>/i),id+' CSS is in <head>');
  assert.ok(/position:fixed;top:calc\(env\(safe-area-inset-top,0px\) \+ 12px\);left:calc\(env\(safe-area-inset-left,0px\) \+ 12px\);z-index:2147483000/.test(withLogo),id+' fixed top-left');
 }
});
test('logo size option and invalid logos',()=>{
 const c=context(),d={template:'777',name1:'A',name2:'B'};
 assert.ok(render(c,{...d,logo:PNG,logoSize:'sm'}).includes('max-height:44px'));
 assert.ok(render(c,{...d,logo:PNG,logoSize:'lg'}).includes('max-height:92px'));
 assert.ok(render(c,{...d,logo:PNG}).includes('max-height:64px'));
 for(const bad of ['javascript:alert(1)','data:image/svg+xml;base64,PHN2Zz4=','data:image/png;base64,AAAA" onerror="x',''])assert.ok(!render(c,{...d,logo:bad}).includes('mubiey-logo'),bad);
});
test('logo works together with the Arabic font fix on the same design',()=>{
 const c=context(),html=render(c,{template:'royal-stage',name1:'A',name2:'B',logo:PNG,arabicFont:'kufi'});
 assert.ok(html.includes('id="mubiey-logo"')&&html.includes('id="mubiey-arabic-font"'));
});
test('Vercel/Supabase backend: invitation save accepts a logo-sized body, other routes keep the small limit',()=>{
 const w=fs.readFileSync('lib/worker.js','utf8');
 assert.match(w,/const body=async\(r,max=18000\)=>/,'default JSON limit unchanged for login, admin, upload preparation');
 assert.ok(w.includes('validate(await body(r,400000),e.RESERVED_SLUGS)'),'create allows a logo');
 assert.ok(w.includes('const input=await body(r,400000),v=validate(input,e.RESERVED_SLUGS)'),'update allows a logo');
 assert.equal((w.match(/body\(r,400000\)/g)||[]).length,2,'only create and update were raised');
 /* the saved document is whatever validate() returns, so logo and logoSize survive create, update, open and guest view */
 const v=validate({name1:'A',name2:'B',logo:PNG,logoSize:'sm',message:'x'});
 assert.equal(v.logo,PNG);assert.equal(v.logoSize,'sm');
});
