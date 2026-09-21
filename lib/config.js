import fs from 'node:fs';
import path from 'node:path';

const REQUIRED = ['DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

function issue(name, message) {
  return {name, message};
}

export function environmentIssues(env = process.env) {
  const issues = [];
  for (const name of REQUIRED) if (!env[name]?.trim()) issues.push(issue(name, 'is missing'));

  if (env.DATABASE_URL?.trim()) {
    try {
      const url = new URL(env.DATABASE_URL);
      if (!['postgres:', 'postgresql:'].includes(url.protocol)) issues.push(issue('DATABASE_URL', 'must use postgresql://'));
      if (!url.hostname.endsWith('.pooler.supabase.com')) issues.push(issue('DATABASE_URL', 'must use the Supabase transaction pooler hostname'));
      if (url.port !== '6543') issues.push(issue('DATABASE_URL', 'must use transaction pooler port 6543'));
      if (url.pathname !== '/postgres') issues.push(issue('DATABASE_URL', 'must target the postgres database'));
      if (url.searchParams.get('sslmode') !== 'verify-full') issues.push(issue('DATABASE_URL', 'must include sslmode=verify-full'));
      if (!url.username || !url.password) issues.push(issue('DATABASE_URL', 'must include a username and URL-encoded password'));
      const projectRef = new URL(env.SUPABASE_URL || 'https://invalid').hostname.split('.')[0];
      if (projectRef && url.username !== `postgres.${projectRef}`) issues.push(issue('DATABASE_URL', 'pooler username does not match SUPABASE_URL project'));
    } catch {
      issues.push(issue('DATABASE_URL', 'is not a valid PostgreSQL URL; encode password characters such as @, #, :, /, ?, and %'));
    }
  }

  if (!env.SUPABASE_DB_CA?.trim() && env.SUPABASE_DB_CA_CERT?.trim()) {
    const caPath = path.resolve(env.SUPABASE_DB_CA_CERT.trim());
    try {
      const ca = fs.readFileSync(caPath, 'utf8');
      if (!ca.includes('BEGIN CERTIFICATE') || !ca.includes('END CERTIFICATE')) issues.push(issue('SUPABASE_DB_CA_CERT', 'must point to the PEM certificate downloaded from Supabase Database Settings'));
    } catch {
      issues.push(issue('SUPABASE_DB_CA_CERT', 'file was not found; download prod-ca-2021.crt from Supabase Database Settings'));
    }
  } else if (!env.SUPABASE_DB_CA?.trim()) {
    issues.push(issue('SUPABASE_DB_CA_CERT', 'or SUPABASE_DB_CA is missing; provide the official Supabase prod-ca-2021.crt'));
  }
  if (env.SUPABASE_DB_CA?.trim() && (!env.SUPABASE_DB_CA.includes('BEGIN CERTIFICATE') || !env.SUPABASE_DB_CA.includes('END CERTIFICATE'))) {
    issues.push(issue('SUPABASE_DB_CA', 'must contain the PEM certificate downloaded from Supabase Database Settings'));
  }

  if (env.SUPABASE_URL?.trim()) {
    try {
      const url = new URL(env.SUPABASE_URL);
      if (url.protocol !== 'https:' || !url.hostname.endsWith('.supabase.co') || url.port || url.pathname !== '/') issues.push(issue('SUPABASE_URL', 'must be the HTTPS project URL, such as https://PROJECT_REF.supabase.co'));
    } catch {
      issues.push(issue('SUPABASE_URL', 'is not a valid HTTPS Supabase project URL'));
    }
  }

  if (env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    const key = env.SUPABASE_SERVICE_ROLE_KEY.trim();
    if (/^(YOUR_|CHOOSE_|REPLACE_|<|\[)/i.test(key)) issues.push(issue('SUPABASE_SERVICE_ROLE_KEY', 'contains a placeholder, not a real server-side key'));
    if (key.startsWith('sb_publishable_')) issues.push(issue('SUPABASE_SERVICE_ROLE_KEY', 'must be the server-side secret/service_role key, not a publishable key'));
    if (key.startsWith('eyJ')) {
      try {
        const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString());
        if (payload.role !== 'service_role') issues.push(issue('SUPABASE_SERVICE_ROLE_KEY', 'must have the service_role server role'));
        if (env.SUPABASE_URL && payload.iss && new URL(payload.iss).hostname !== new URL(env.SUPABASE_URL).hostname) issues.push(issue('SUPABASE_SERVICE_ROLE_KEY', 'belongs to a different Supabase project'));
      } catch {
        issues.push(issue('SUPABASE_SERVICE_ROLE_KEY', 'is not a valid server-side JWT or Supabase secret key'));
      }
    }
  }
  return issues;
}

export function requireEnvironment(env = process.env) {
  const issues = environmentIssues(env);
  if (issues.length) throw Object.assign(Error('Supabase configuration is invalid'), {code: 'INVALID_ENVIRONMENT', issues});
  return env;
}

export function publicEnvironmentError(error) {
  const issues = error?.issues || [{name: 'Supabase configuration', message: 'could not be validated'}];
  return 'Online saving is unavailable. Check: ' + issues.map(item => `${item.name} ${item.message}`).join('; ') + '.';
}