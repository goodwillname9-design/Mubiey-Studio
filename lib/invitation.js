export function isInvitationAvailable(invitation, now = Date.now()) {
  if (!invitation?.published || invitation.deleted) return false;
  const eventTime = Date.parse(invitation.date);
  return !Number.isFinite(eventTime) || eventTime > now;
}

export const invitationNotFoundHtml = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>404 — Page Not Found</title><style>body{background:#f7f2e9;color:#3b3125;font:18px Georgia,serif;text-align:center;padding:12vh 24px}main{max-width:36rem;margin:auto}h1{font-size:3rem;margin:0}h2{font-size:1.5rem;margin:.5rem 0 1.5rem}</style></head><body><main><h1>404</h1><h2>Page Not Found</h2><p>This invitation is no longer available.</p></main></body></html>';
