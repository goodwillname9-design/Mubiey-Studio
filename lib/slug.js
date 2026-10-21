/* Custom invitation links: /ameen-fathima
   Pure helpers (no dependencies, no network) shared by the server, the editor and the tests.
   Contract used by the server router:
     /invite/<uuid>   -> legacy link, always keeps working
     /<slug>          -> custom link (published invitations only)
     anything else    -> normal static pages / API, or a friendly "invitation not found" page */

export const UUID_RE=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
export const SLUG_RE=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG_MIN=3,SLUG_MAX=60;

/* Words that must never become a root-level invitation link because they are (or could become) pages, folders or API routes. */
export const RESERVED=new Set(('api invite invites invitation invitations cards card guest guests shared admin login logout signin signup register account accounts dashboard '
 +'health status terms privacy about contact help support pricing price templates template editor create new edit preview share sharing media assets fonts static public '
 +'favicon robots sitemap manifest index home app www mail ftp cdn static _next vercel mubiey studio mubiey-studio atelier live-presets invitation-renderer royal-curtain '
 +'velvet-scroll velvet-editor direct-editor atelier-editor atelier-experience floral-cards card-renderer photo photos editor-tools tools gallery music map maps rsvp '
 +'download downloads upload uploads image images img css js sw service-worker well-known test tests demo previews preview null undefined').split(/\s+/).filter(Boolean));

export function slugify(input){
  return String(input??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/&/g,' ').replace(/['’`]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,SLUG_MAX).replace(/-+$/,'');
}
/* "Ameen" + "Fathima" -> "ameen-fathima". Uses the first word of each name so long names stay short. Returns '' when the names have no latin letters. */
export function suggestSlug(name1,name2){
  const first=v=>slugify(String(v??'').trim().split(/\s+/)[0]);
  return [first(name1),first(name2)].filter(Boolean).join('-');
}
/* Validate a slug the owner typed. Returns {ok,slug,error}. Never throws. */
export function checkSlug(raw,extraReserved){
  const slug=slugify(raw);
  if(!slug)return{ok:false,slug:'',error:'Use letters and numbers, for example ameen-fathima'};
  if(slug.length<SLUG_MIN)return{ok:false,slug,error:`Use at least ${SLUG_MIN} characters`};
  if(!SLUG_RE.test(slug))return{ok:false,slug,error:'Use only letters, numbers and single hyphens'};
  if(UUID_RE.test(slug)||/^[a-f0-9-]{36}$/.test(slug))return{ok:false,slug,error:'This looks like a system id. Choose a name-based link'};
  if(/^\d+$/.test(slug))return{ok:false,slug,error:'Add letters so the link is easy to recognise'};
  if(RESERVED.has(slug)||(extraReserved&&extraReserved.has(slug)))return{ok:false,slug,error:'This link is reserved. Please choose another'};
  return{ok:true,slug,error:''};
}
/* Reserve every file or folder name that exists at the root of the public folder, so a new page can never be hidden by an invitation. */
export function reservedFromFiles(names){const s=new Set();for(const n of names||[]){const b=String(n).toLowerCase().replace(/\.[a-z0-9]+$/,'');if(b)s.add(b)}return s}
/* Find a free slug. `exists` is any async or sync function(slug)->boolean (database lookup). Tries ameen-fathima, ameen-fathima-2, -3 ... then a short random suffix. */
export async function makeUnique(base,exists,extraReserved){
  const first=checkSlug(base,extraReserved);if(!first.ok)return '';
  let slug=first.slug;
  for(let i=1;i<=30;i++){const cand=i===1?slug:`${slug}-${i}`.slice(0,SLUG_MAX);if(checkSlug(cand,extraReserved).ok&&!(await exists(cand)))return cand}
  const rnd=()=>Math.random().toString(36).slice(2,6);
  for(let i=0;i<10;i++){const cand=`${slug.slice(0,SLUG_MAX-5)}-${rnd()}`;if(!(await exists(cand)))return cand}
  return '';
}
/* Decide what a request path means. Used by the server route and by the tests as the routing contract. */
export function classifyPath(pathname,extraReserved){
  let p=String(pathname||'').split('?')[0].split('#')[0];
  if(!p.startsWith('/'))p='/'+p;
  p=p.replace(/\/+$/,'')||'/';
  const parts=p.split('/').filter(Boolean);
  if(parts.length===2&&parts[0].toLowerCase()==='invite'){const id=parts[1].toLowerCase();return UUID_RE.test(id)?{type:'uuid',id}:{type:'missing'}}
  if(parts.length===1){
    const seg=parts[0];
    if(seg.includes('.'))return{type:'static'};            /* file names such as guest.js or favicon.ico */
    const raw=seg.toLowerCase();
    if(RESERVED.has(raw)||(extraReserved&&extraReserved.has(raw)))return{type:'page'};
    const c=checkSlug(raw,extraReserved);
    if(c.ok&&c.slug===raw)return{type:'slug',slug:raw,canonical:seg===raw};
    return{type:'missing'};
  }
  return{type:'other'};
}
/* Safe text for the page title and social-sharing tags. */
export function inviteTitle(d){const a=(d?.name1||'').trim(),b=(d?.name2||'').trim();return a&&b?`${a} & ${b} — Wedding invitation`:'Wedding invitation'}
export function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
/* Social-sharing tags (WhatsApp, Facebook, Telegram, X). `origin` comes from the request host so the same code works on vercel.app and on a custom domain. `image` must be an https/absolute URL or ''. */
export function shareMeta(d,{origin,path,image}={}){
  const title=inviteTitle(d),desc=d?.date?`Join us for our wedding celebration · ${String(d.date).slice(0,10)}`:'Join us for our wedding celebration',url=origin&&path?origin.replace(/\/+$/,'')+path:'';
  const img=image&&/^https:\/\//.test(image)?image:'';
  return [`<title>${escapeHtml(title)}</title>`,`<meta property="og:type" content="website">`,`<meta property="og:title" content="${escapeHtml(title)}">`,`<meta property="og:description" content="${escapeHtml(desc)}">`,url?`<meta property="og:url" content="${escapeHtml(url)}">`:'',img?`<meta property="og:image" content="${escapeHtml(img)}">`:'',`<meta name="twitter:card" content="${img?'summary_large_image':'summary'}">`,`<meta name="twitter:title" content="${escapeHtml(title)}">`,`<meta name="twitter:description" content="${escapeHtml(desc)}">`].filter(Boolean).join('');
}
