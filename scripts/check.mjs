import fs from 'node:fs';import {spawnSync} from 'node:child_process';
for(const dir of ['public','api','lib'])for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.js'))){const r=spawnSync(process.execPath,['--check',dir+'/'+f],{stdio:'inherit'});if(r.status)process.exit(r.status)}
for(const f of fs.readdirSync('public').filter(f=>f.endsWith('.html'))){for(const [,ref]of fs.readFileSync('public/'+f,'utf8').matchAll(/(?:src|href)="([^"#]+)"/g)){if(ref==='/'||/^(https?:|data:)/.test(ref))continue;if(!fs.existsSync('public/'+ref.replace(/^\//,'')))throw Error('Missing asset: '+ref)}}
JSON.parse(fs.readFileSync('vercel.json'));console.log('Vercel configuration, server scripts and browser assets checked.');
