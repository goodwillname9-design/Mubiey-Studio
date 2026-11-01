import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {PGlite} from '@electric-sql/pglite';import {database} from '../lib/db.js';import worker from '../lib/worker.js';
const pg=new PGlite();await pg.exec("CREATE ROLE anon; CREATE ROLE authenticated; CREATE SCHEMA storage; CREATE TABLE storage.buckets(id text PRIMARY KEY,name text,public boolean,file_size_limit bigint,allowed_mime_types text[])");await pg.exec(fs.readFileSync(new URL('../supabase/setup.sql',import.meta.url),'utf8'));
const query=async(q,p=[])=>{const r=await pg.query(q,p);return{rows:r.rows,rowCount:r.affectedRows||r.rows.length}};const pool={query,connect:async()=>({query,release(){}})};
const signedWith=[];const objects=new Map();const env={DB:database(pool),BUCKET:{async delete(k){objects.delete(k)},async signUpload(k){return 'https://storage.example.test/upload/'+k},async info(k){if(!objects.has(k))throw Error('Not uploaded');return objects.get(k)},async signed(k,dl){signedWith.push([k,dl]);return 'https://storage.example.test/read/'+k}},ADMIN_PASSWORD:'private-admin-password-1234'};
const origin='https://mubiey.example.test';const call=(p,method='GET',data,cookie='',headers={},targetEnv=env)=>worker.fetch(new Request(origin+p,{method,headers:{Origin:origin,...(cookie?{Cookie:cookie}:{}),...(data?{'Content-Type':'application/json'}:{}),...headers},body:data?JSON.stringify(data):undefined}),targetEnv);
async function user(name){const r=await call('/api/register','POST',{username:name,password:'strong-'+name+'-password'});assert.equal(r.status,200,await r.clone().text());return r.headers.get('set-cookie').split(';')[0]}
test('invitation card: owner uploads a PDF, guests get it only when published, removal deletes the file',async()=>{
 const a=await user('carol'),b=await user('dave');
 let r=await call('/api/invitations','POST',{name1:'One',name2:'Two',date:'2029-01-01T10:00+05:30',cardTitle:'Take your card',cardNote:'With love'},a);assert.equal(r.status,201,await r.clone().text());
 const d=await r.json(),p='/api/invitations/'+d.id;
 assert.equal(d.cardTitle,'Take your card');
 // other accounts cannot attach a card; wrong file types are refused
 assert.equal((await call('/api/uploads','POST',{invite:d.id,type:'application/pdf',name:'card:X.pdf',size:100},b)).status,404);
 assert.equal((await call('/api/uploads','POST',{invite:d.id,type:'application/zip',name:'card:X.zip',size:100},a)).status,400);
 assert.equal((await call('/api/uploads','POST',{invite:d.id,type:'application/pdf',name:'Plain.pdf',size:100},a)).status,400,'a PDF is only accepted as an invitation card');
 assert.equal((await call('/api/uploads','POST',{invite:d.id,type:'application/pdf',name:'card:Big.pdf',size:16*1048576},a)).status,413);
 r=await call('/api/uploads','POST',{invite:d.id,type:'application/pdf',name:'card:Our Card.pdf',size:300},a);assert.equal(r.status,200,await r.clone().text());
 const up=await r.json();objects.set('files/'+up.id,{size:300,contentType:'application/pdf'});
 r=await call('/api/uploads/'+up.id+'/complete','POST',null,a);assert.equal(r.status,200,await r.clone().text());
 const doc=await r.json();assert.equal(doc.photos.length,0,'a card is not a gallery photo');assert.equal(doc.music,null);
 assert.deepEqual(doc.card,{ref:'/media/'+d.id+'/'+up.id,name:'Our Card.pdf',type:'application/pdf'});
 // saving the form later keeps the card
 r=await call(p,'PUT',{name1:'One',name2:'Two',date:'2029-01-01T10:00+05:30',cardTitle:'Updated'},a);assert.equal(r.status,200);assert.equal((await r.json()).card.ref,doc.card.ref);
 // card can be an image too and replaces the old file
 r=await call('/api/uploads','POST',{invite:d.id,type:'image/png',name:'card:Card.png',size:120},a);const up2=await r.json();objects.set('files/'+up2.id,{size:120,contentType:'image/png'});
 r=await call('/api/uploads/'+up2.id+'/complete','POST',null,a);assert.equal(r.status,200);const doc2=await r.json();assert.equal(doc2.card.type,'image/png');assert.equal(doc2.photos.length,0);assert.equal(objects.has('files/'+up.id),false,'the replaced card file is deleted');
 // private until published
 const ref=doc2.card.ref;
 assert.equal((await call(ref)).status,404);
 assert.equal((await call(p+'/publish','POST',null,a)).status,200);
 r=await call(ref);assert.equal(r.status,302);assert.match(r.headers.get('location'),/storage\.example\.test\/read\/files\//);
 signedWith.length=0;r=await call(ref+'?download=1');assert.equal(r.status,302);assert.equal(signedWith[0][1],'Card.png','download=1 forces a file name');
 r=await call(p);assert.equal((await r.json()).card.ref,ref);
 // other media paths of this invitation are still refused
 assert.equal((await call('/media/'+d.id+'/'+up.id)).status,404);
 // owner removes the card
 r=await call(p,'PUT',{name1:'One',name2:'Two',date:'2029-01-01T10:00+05:30',removeCard:true},a);assert.equal(r.status,200);assert.equal((await r.json()).card,null);
 assert.equal(objects.has('files/'+up2.id),false);assert.equal((await call(ref)).status,404);
 await pg.close();
});
