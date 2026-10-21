import worker from '../lib/worker.js';
import {getDatabase} from '../lib/db.js';
import {bucket} from '../lib/storage.js';
import {environmentIssues, publicEnvironmentError} from '../lib/config.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {classifyPath,reservedFromFiles,shareMeta} from '../lib/slug.js';
const PUBLIC_DIR=fileURLToPath(new URL('../public/',import.meta.url));
const notFoundHtml='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Invitation not found</title><style>body{background:#f7f2e9;color:#3b3125;font:18px Georgia,serif;text-align:center;padding:12vh 24px}a{color:inherit}</style></head><body><h1>Invitation not found</h1><p>This invitation may be unavailable or its link may have changed.</p><a href="/">Return to Mubiey Studio</a></body></html>';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 try{
  const host=String(req.headers.host||'localhost:3000');if(!/^[a-z0-9.:-]+$/i.test(host))throw Error('Invalid host');
  const url=new URL(req.url,`http://${host}`);const route=typeof req.query?.route==='string'?req.query.route:url.searchParams.get('route');const p=route?'/'+route:url.pathname;if(!/^\/(api|media|guest)(?:\/|$)/.test(p))return res.status(404).json({error:'Not found'});
  if(p==='/api/slug.js'&&['GET','HEAD'].includes(req.method)){const source=await fs.readFile(new URL('../lib/slug.js',import.meta.url));res.setHeader('Content-Type','text/javascript; charset=utf-8');res.setHeader('Cache-Control','no-cache');return res.end(req.method==='HEAD'?undefined:source)}
  const protocol=host.startsWith('localhost')||host.startsWith('127.0.0.1')?'http':'https';
  if(p.startsWith('/guest/')){
   if(!['GET','HEAD'].includes(req.method))return res.status(405).end('Method not allowed');
   const slugPath='/'+p.slice('/guest/'.length),reserved=reservedFromFiles(await fs.readdir(PUBLIC_DIR)),classified=classifyPath(slugPath,reserved);
   if(classified.type==='slug'&&!classified.canonical){res.statusCode=301;res.setHeader('Location','/'+classified.slug);return res.end()}
   if(classified.type!=='uuid'&&classified.type!=='slug'){res.statusCode=404;res.setHeader('Content-Type','text/html; charset=utf-8');return res.end(req.method==='HEAD'?undefined:notFoundHtml)}
   const publicPath=classified.type==='uuid'?'/api/invitations/'+classified.id:'/api/invitations/by-slug/'+classified.slug;
   const invitation=await worker.fetch(new Request(protocol+'://'+host+publicPath),{DB:getDatabase(),BUCKET:bucket(),ADMIN_PASSWORD:process.env.MUBIEY_ADMIN_PASSWORD,RESERVED_SLUGS:reserved});
   if(!invitation.ok){res.statusCode=404;res.setHeader('Content-Type','text/html; charset=utf-8');return res.end(req.method==='HEAD'?undefined:notFoundHtml)}
   const data=await invitation.json(),template=await fs.readFile(path.join(PUBLIC_DIR,'guest.html'),'utf8'),canonicalPath=classified.type==='uuid'?'/invite/'+classified.id:'/'+classified.slug,html=template.replace('<title>Wedding invitation</title><!-- MUBIEY_SHARE_META -->',shareMeta(data,{origin:protocol+'://'+host,path:canonicalPath}));
   res.statusCode=200;res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','no-store');return res.end(req.method==='HEAD'?undefined:html);
  }
    const configIssues=environmentIssues();
    if(configIssues.length)return res.status(503).json({error:publicEnvironmentError({issues:configIssues})});
    if(p==='/api/health'&&req.method==='GET'){
     const checks={configuration:'pass',database:'pending',schema:'pending',storage:'pending'};
     try{const row=await getDatabase().prepare("SELECT current_database() AS database, to_regclass('mubiey.users') AS users, to_regclass('mubiey.invitations') AS invitations, to_regclass('mubiey.files') AS files, to_regclass('mubiey.invitations_slug_uidx') AS invitation_slug_index, EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='mubiey' AND table_name='invitations' AND column_name='slug') AS invitation_slug").first();checks.database='pass';checks.schema=row.users&&row.invitations&&row.files&&row.invitation_slug&&row.invitation_slug_index?'pass':'fail'}catch(e){checks.database='fail';checks.schema='not checked';return res.status(503).json({ok:false,checks,error:e.code?'Database connection failed. Check DATABASE_URL and pooler credentials.':'Database setup check failed.'})}
     try{await bucket().list();checks.storage='pass'}catch{checks.storage='fail'}
     const ok=Object.values(checks).every(value=>value==='pass');return res.status(ok?200:503).json({ok,checks});
    }
  const headers=new Headers();for(const [k,v]of Object.entries(req.headers))if(v!==undefined)headers.set(k,Array.isArray(v)?v.join(','):v);
  let body;if(!['GET','HEAD'].includes(req.method)){if(req.body!==undefined){body=typeof req.body==='string'||Buffer.isBuffer(req.body)?req.body:JSON.stringify(req.body)}else{const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>20000)return res.status(413).json({error:'Use direct file uploads'});chunks.push(chunk)}body=Buffer.concat(chunks)}if(Buffer.byteLength(body)>20000)return res.status(413).json({error:'Request too large'})}
  const reserved=reservedFromFiles(await fs.readdir(PUBLIC_DIR));
  const query=new URLSearchParams(url.searchParams);query.delete('route');const targetUrl=protocol+'://'+host+p+(query.size?'?'+query.toString():'');
  const response=await worker.fetch(new Request(targetUrl,{method:req.method,headers,body}),{DB:getDatabase(),BUCKET:bucket(),ADMIN_PASSWORD:process.env.MUBIEY_ADMIN_PASSWORD,RESERVED_SLUGS:reserved});
  res.statusCode=response.status;for(const [k,v]of response.headers)res.setHeader(k,v);res.end(Buffer.from(await response.arrayBuffer()));
 }catch(e){console.error('Mubiey backend:',e.code||e.name);res.statusCode=503;res.end(JSON.stringify({error:'Online storage is unavailable. Check Vercel environment variables and the Supabase database setup.'}))}
}
