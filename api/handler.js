import worker from '../lib/worker.js';
import {getDatabase} from '../lib/db.js';
import {bucket} from '../lib/storage.js';
import {environmentIssues, publicEnvironmentError} from '../lib/config.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 try{
  const host=String(req.headers.host||'localhost:3000');if(!/^[a-z0-9.:-]+$/i.test(host))throw Error('Invalid host');
  const url=new URL(req.url,`http://${host}`);const route=typeof req.query?.route==='string'?req.query.route:url.searchParams.get('route');const p=route?'/'+route:url.pathname;if(!/^\/(api|media)\//.test(p))return res.status(404).json({error:'Not found'});
    const configIssues=environmentIssues();
    if(configIssues.length)return res.status(503).json({error:publicEnvironmentError({issues:configIssues})});
    if(p==='/api/health'&&req.method==='GET'){
     const checks={configuration:'pass',database:'pending',schema:'pending',storage:'pending'};
     try{const row=await getDatabase().prepare("SELECT current_database() AS database, to_regclass('mubiey.users') AS users, to_regclass('mubiey.invitations') AS invitations, to_regclass('mubiey.files') AS files").first();checks.database='pass';checks.schema=row.users&&row.invitations&&row.files?'pass':'fail'}catch(e){checks.database='fail';checks.schema='not checked';return res.status(503).json({ok:false,checks,error:e.code?'Database connection failed. Check DATABASE_URL and pooler credentials.':'Database setup check failed.'})}
     try{await bucket().list();checks.storage='pass'}catch{checks.storage='fail'}
     const ok=Object.values(checks).every(value=>value==='pass');return res.status(ok?200:503).json({ok,checks});
    }
  const protocol=host.startsWith('localhost')||host.startsWith('127.0.0.1')?'http':'https';
  const headers=new Headers();for(const [k,v]of Object.entries(req.headers))if(v!==undefined)headers.set(k,Array.isArray(v)?v.join(','):v);
  let body;if(!['GET','HEAD'].includes(req.method)){if(req.body!==undefined){body=typeof req.body==='string'||Buffer.isBuffer(req.body)?req.body:JSON.stringify(req.body)}else{const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>20000)return res.status(413).json({error:'Use direct file uploads'});chunks.push(chunk)}body=Buffer.concat(chunks)}if(Buffer.byteLength(body)>20000)return res.status(413).json({error:'Request too large'})}
  const response=await worker.fetch(new Request(protocol+'://'+host+p,{method:req.method,headers,body}),{DB:getDatabase(),BUCKET:bucket(),ADMIN_PASSWORD:process.env.MUBIEY_ADMIN_PASSWORD});
  res.statusCode=response.status;for(const [k,v]of response.headers)res.setHeader(k,v);res.end(Buffer.from(await response.arrayBuffer()));
 }catch(e){console.error('Mubiey backend:',e.code||e.name);res.statusCode=503;res.end(JSON.stringify({error:'Online storage is unavailable. Check Vercel environment variables and the Supabase database setup.'}))}
}
