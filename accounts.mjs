import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {promisify} from 'node:util';
const scrypt=promisify(crypto.scrypt);
export async function accounts(data,adminPassword){
 const dir=path.join(data,'users');await fs.mkdir(dir,{recursive:true});
 const users=new Map(),sessions=new Map();
 for(const f of await fs.readdir(dir)){if(f.endsWith('.json')){const u=JSON.parse(await fs.readFile(path.join(dir,f),'utf8'));users.set(u.username,u)}}
 const save=async u=>{const p=path.join(dir,u.id+'.json');await fs.writeFile(p+'.tmp',JSON.stringify(u),{mode:0o600});await fs.rename(p+'.tmp',p)};
 const digest=async(p,s)=>(await scrypt(p,s,64)).toString('hex');
 if(!users.has('admin')){const salt=crypto.randomBytes(16).toString('hex');const u={id:'admin',username:'admin',salt,hash:await digest(adminPassword,salt),role:'admin',created:new Date().toISOString(),disabled:false};await save(u);users.set('admin',u)}
 const publicUser=u=>u?{id:u.id,username:u.username,role:u.role,created:u.created,disabled:u.disabled}:null;
 const pending=new Set();
 return {
 publicUser,
 all:()=>[...users.values()].map(publicUser),
 async register(username,password){username=String(username||'').trim().toLowerCase();if(!/^[a-z0-9_]{3,30}$/.test(username))throw Error('Username: 3–30 letters, numbers or underscores.');if(typeof password!=='string'||password.length<12||password.length>128)throw Error('Password must contain 12–128 characters.');if(users.has(username)||pending.has(username))throw Error('That username is already taken.');pending.add(username);try{const salt=crypto.randomBytes(16).toString('hex'),u={id:crypto.randomUUID(),username,salt,hash:await digest(password,salt),role:'user',created:new Date().toISOString(),disabled:false};await save(u);users.set(username,u);return u}finally{pending.delete(username)}},
 async login(username,password){const u=users.get(String(username||'admin').trim().toLowerCase());const h=await digest(String(password||'').slice(0,128),u?.salt||'missing-user-salt');if(!u||u.disabled||!crypto.timingSafeEqual(Buffer.from(h,'hex'),Buffer.from(u.hash,'hex')))return null;return u},
 session(req){const token=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('mubiey_session='))?.slice(15);const s=sessions.get(token);if(!s||s.expires<Date.now()){sessions.delete(token);return null}const u=users.get(s.username);return u&&!u.disabled?u:null},
 issue(u){for(const [k,s]of sessions)if(s.expires<Date.now())sessions.delete(k);const token=crypto.randomBytes(32).toString('hex');sessions.set(token,{username:u.username,expires:Date.now()+43200000});return token},
 logout(req){const token=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('mubiey_session='))?.slice(15);sessions.delete(token)},
 async manage(id,disabled){const u=[...users.values()].find(u=>u.id===id);if(!u||u.role==='admin')throw Error('This account cannot be changed.');u.disabled=!!disabled;await save(u);return publicUser(u)}
 };
}
