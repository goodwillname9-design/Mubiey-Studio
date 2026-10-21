import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {slugify,suggestSlug,checkSlug,reservedFromFiles,makeUnique,classifyPath,inviteTitle,shareMeta,escapeHtml,RESERVED,UUID_RE} from '../lib/slug.js';
import {validate} from '../lib/validate.js';

const UUID='3f2504e0-4f89-41d3-9a0c-0305e82c3301';

/* A tiny in-memory stand-in for the database + router, so the rules the real server must follow are executable. */
function makeStore(){
  const rows=[];
  const reserved=reservedFromFiles(fs.existsSync('public')?fs.readdirSync('public'):[]);
  return {
    rows,reserved,
    byId:id=>rows.find(r=>r.id===id)||null,
    bySlug:s=>rows.find(r=>r.slug&&r.slug.toLowerCase()===s.toLowerCase())||null,
    create(row){
      if(row.slug){const c=checkSlug(row.slug,reserved);if(!c.ok)throw Object.assign(Error(c.error),{status:400});row.slug=c.slug;if(this.bySlug(row.slug))throw Object.assign(Error('This link is already taken'),{status:409})}
      rows.push(row);return row;
    },
    resolve(pathname){
      const k=classifyPath(pathname,reserved);
      if(k.type==='uuid'){const r=this.byId(k.id);return r&&r.published?{status:200,row:r}:{status:404}}
      if(k.type==='slug'){const r=this.bySlug(k.slug);if(!r||!r.published)return{status:404};return k.canonical?{status:200,row:r}:{status:301,location:'/'+k.slug}}
      return {status:k.type==='missing'?404:'pass-through'};
    }
  };
}

test('slugify turns names into clean URL text',()=>{
  assert.equal(slugify('Ameen & Fathima'),'ameen-fathima');
  assert.equal(slugify("  Anas   Ayisha's  "),'anas-ayishas');
  assert.equal(slugify('Zoë Ñandú'),'zoe-nandu');
  assert.equal(slugify('--Hello__World--'),'hello-world');
  assert.equal(slugify('محمد'),'');
  assert.equal(slugify('a'.repeat(100)).length,60);
});
test('suggestSlug uses the first word of each name',()=>{
  assert.equal(suggestSlug('Ameen','Fathima'),'ameen-fathima');
  assert.equal(suggestSlug('Anas Mohammed','Ayisha Khan'),'anas-ayisha');
  assert.equal(suggestSlug('محمد','Fathima'),'fathima');
  assert.equal(suggestSlug('',''),'');
});
test('checkSlug accepts good links and rejects unsafe ones',()=>{
  for(const ok of ['ameen-fathima','anas-ayisha','a1b','najir-tasleem-2027'])assert.equal(checkSlug(ok).ok,true,ok);
  assert.equal(checkSlug('Ameen-Fathima').slug,'ameen-fathima');
  for(const bad of ['','ab','12345','api','invitations','invite','cards','guest','shared','admin','login',UUID,'--','a'])assert.equal(checkSlug(bad).ok,false,bad);
  assert.equal(checkSlug('mine',new Set(['mine'])).ok,false,'extra reserved names are honoured');
});
test('every file at the root of public/ is reserved, so a slug can never hide an existing page',()=>{
  if(!fs.existsSync('public'))return;
  const reserved=reservedFromFiles(fs.readdirSync('public'));
  for(const f of fs.readdirSync('public')){const base=f.replace(/\.[a-z0-9]+$/i,'').toLowerCase();assert.ok(reserved.has(base),f);assert.equal(checkSlug(base,reserved).ok,false,base+' must not be claimable')}
  for(const page of ['invitations','cards','guest','invite','api','assets'])assert.ok(RESERVED.has(page),page);
});
test('makeUnique avoids duplicates',async()=>{
  const taken=new Set(['ameen-fathima','ameen-fathima-2']);
  assert.equal(await makeUnique('ameen-fathima',s=>taken.has(s)),'ameen-fathima-3');
  assert.equal(await makeUnique('fresh-pair',s=>taken.has(s)),'fresh-pair');
  assert.equal(await makeUnique('api',()=>false),'','reserved base is refused');
  const r=await makeUnique('busy-xyz',async s=>!/^busy-xyz-[a-z0-9]{4}$/.test(s));assert.match(r,/^busy-xyz-[a-z0-9]{4}$/,'falls back to a short random suffix when 30 numbered tries are taken');
});
test('classifyPath: legacy UUID links, slugs, pages, files and junk',()=>{
  assert.deepEqual(classifyPath('/invite/'+UUID),{type:'uuid',id:UUID});
  assert.deepEqual(classifyPath('/invite/'+UUID.toUpperCase()+'/'),{type:'uuid',id:UUID});
  assert.equal(classifyPath('/invite/not-a-uuid').type,'missing');
  assert.deepEqual(classifyPath('/ameen-fathima'),{type:'slug',slug:'ameen-fathima',canonical:true});
  assert.deepEqual(classifyPath('/ameen-fathima/?utm=1'),{type:'slug',slug:'ameen-fathima',canonical:true});
  assert.deepEqual(classifyPath('/Ameen-Fathima'),{type:'slug',slug:'ameen-fathima',canonical:false});
  for(const page of ['/invitations','/cards','/guest','/api','/media','/assets'])assert.equal(classifyPath(page).type,'page',page);
  for(const file of ['/guest.js','/favicon.ico','/invitations.html','/velvet-scroll.js'])assert.equal(classifyPath(file).type,'static',file);
  assert.equal(classifyPath('/x').type,'missing');assert.equal(classifyPath('/%%%').type,'missing');
  assert.equal(classifyPath('/api/invitations/'+UUID).type,'other');assert.equal(classifyPath('/').type,'other');
});
test('routing contract with an in-memory store: custom slug, old UUID link, duplicates, missing and unpublished',()=>{
  const db=makeStore();
  db.create({id:UUID,name1:'Old',name2:'Link',slug:'',published:true});                               // existing customer without a slug
  db.create({id:'a1111111-1111-4111-8111-111111111111',name1:'Ameen',name2:'Fathima',slug:'ameen-fathima',published:true});
  db.create({id:'b2222222-2222-4222-8222-222222222222',name1:'Draft',name2:'Only',slug:'draft-only',published:false});
  // existing UUID links keep working
  assert.equal(db.resolve('/invite/'+UUID).status,200);assert.equal(db.resolve('/invite/'+UUID).row.name1,'Old');
  assert.equal(db.resolve('/invite/a1111111-1111-4111-8111-111111111111').status,200,'a UUID link works even when a slug exists');
  // custom link shows the right couple
  const r=db.resolve('/ameen-fathima');assert.equal(r.status,200);assert.equal(r.row.name2,'Fathima');
  assert.equal(db.resolve('/AMEEN-FATHIMA').status,301);assert.equal(db.resolve('/AMEEN-FATHIMA').location,'/ameen-fathima');
  // duplicates, case-insensitive
  assert.throws(()=>db.create({id:'c3333333-3333-4333-8333-333333333333',slug:'Ameen-Fathima',published:true}),{status:409});
  // reserved / invalid slugs cannot be saved
  for(const bad of ['api','invitations','guest','x'])assert.throws(()=>db.create({id:crypto.randomUUID(),slug:bad}),{status:400},bad);
  // missing and unpublished invitations are a clean 404
  assert.equal(db.resolve('/nobody-here').status,404);assert.equal(db.resolve('/draft-only').status,404);
  assert.equal(db.resolve('/invite/'+crypto.randomUUID()).status,404);assert.equal(db.resolve('/invite/oops').status,404);
  // normal pages and files are never treated as invitations
  for(const p of ['/invitations','/cards','/guest.js','/api/health'])assert.equal(db.resolve(p).status,'pass-through',p);
});
test('page title and social-sharing tags use the couple names and are escaped',()=>{
  assert.equal(inviteTitle({name1:'Ameen',name2:'Fathima'}),'Ameen & Fathima — Wedding invitation');assert.equal(inviteTitle({}),'Wedding invitation');
  const m=shareMeta({name1:'<b>Ameen</b>',name2:'Fathi"ma',date:'2027-02-12T11:00+03:00'},{origin:'https://mubieystudio.com/',path:'/ameen-fathima',image:'https://mubieystudio.com/media/x.jpg'});
  assert.ok(m.includes('og:title')&&m.includes('og:url" content="https://mubieystudio.com/ameen-fathima"')&&m.includes('og:image')&&m.includes('summary_large_image'));
  assert.ok(!m.includes('<b>Ameen')&&m.includes('&lt;b&gt;Ameen')&&m.includes('Fathi&quot;ma'));
  assert.ok(!shareMeta({name1:'A',name2:'B'},{origin:'https://x.com',path:'/a-b',image:'javascript:alert(1)'}).includes('og:image'));
  assert.equal(escapeHtml('<&>"\''),'&lt;&amp;&gt;&quot;&#39;');
});
test('the shared validator keeps and checks the slug',()=>{
  assert.equal(validate({name1:'A',slug:' Ameen-Fathima '}).slug,'ameen-fathima');assert.equal(validate({name1:'A'}).slug,'');
  for(const bad of ['api','a','12345','invitations'])assert.throws(()=>validate({slug:bad}),{code:'INVALID_INVITATION'},bad);
  assert.throws(()=>validate({slug:'custom-page'},new Set(['custom-page'])),{code:'INVALID_INVITATION'});
  assert.throws(()=>validate({slug:42}),{code:'INVALID_INVITATION'});
  assert.ok(UUID_RE.test(UUID));
});
