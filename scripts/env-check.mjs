import crypto from 'node:crypto';
import fs from 'node:fs';

const names = ['DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_DB_CA_CERT', 'MUBIEY_ADMIN_PASSWORD'];
const values = new Map();
const counts = new Map();
for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!match) continue;
  let value = match[2];
  if (value.length >= 2 && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))) value = value.slice(1, -1);
  values.set(match[1], value);
  counts.set(match[1], (counts.get(match[1]) || 0) + 1);
}
const digest = value => value === undefined ? 'MISSING' : crypto.createHash('sha256').update(value).digest('hex');
for (const name of names) {
  const fileValue = values.get(name);
  const processValue = process.env[name];
  console.log(`${name}: file=${fileValue ? 'SET' : 'MISSING'} process=${processValue ? 'SET' : 'MISSING'} same=${digest(fileValue) === digest(processValue)} duplicates=${counts.get(name) || 0}`);
}
const url = new URL(values.get('DATABASE_URL'));
const decodedPassword = decodeURIComponent(url.password);
console.log(`DATABASE_URL: host=${url.hostname} port=${url.port} user=${url.username} database=${url.pathname} sslmode=${url.searchParams.get('sslmode')}`);
console.log(`DATABASE_PASSWORD: length=${decodedPassword.length} placeholder=${/(YOUR_|PASSWORD|PROJECT_REF|REGION|CHOOSE_|REPLACE_)/i.test(decodedPassword)} literalBrackets=${decodedPassword.startsWith('[') || decodedPassword.endsWith(']')} doubleEncoded=${url.password.includes('%25')}`);