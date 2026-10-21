# Custom invitation links  (/ameen-fathima)

STATUS: groundwork only. The server, database and Vercel files were NOT available to me, so the routing, database and
social-sharing parts are written as a plan + a ready-to-use prompt for the tool that has your repository.
Nothing here has been deployed.

## What I could see (from the update package)
- Guest link today:   `location.origin + '/invite/' + <uuid>`  (public/invitations.js, function showShare), or the `url` the publish call returns.
- Guest page:          public/guest.html + guest.js. guest.js takes the LAST path segment, requires a UUID, then calls `GET /api/invitations/<uuid>`.
- The page title is set in the browser by guest.js. WhatsApp/Facebook do not run JavaScript, so social-sharing tags must be written by the server.
- A "Copy link" button already exists (`#copy-link`, copies `#guest-link`). A native-share button exists too.
- Root-level files that a slug must never shadow: invitations.html, cards.html, guest.html and every .js/.css/.png at the root of public/.
- guest.html is `noindex,nofollow` (keep it: invitations are private pages).

## What I could NOT see
server entry (server.js / api/ folder), package.json, vercel.json, database schema and migrations, how /invite/<uuid> is routed today,
how publish/unpublish work, the existing test setup. Because of that I did not touch any of them.

## Included in this package (safe, free, no dependencies)
- lib/slug.js            slugify, suggestSlug, checkSlug (+ reserved words), makeUnique, classifyPath (routing contract),
                         inviteTitle / shareMeta (escaped title + WhatsApp/Open Graph tags)
- lib/validate.js        now keeps and checks an optional `slug` (default empty, existing data unaffected).
                         Apply it TOGETHER with the database unique index below, otherwise nothing prevents duplicates.
- tests/slug.test.mjs    9 tests: slug rules, reserved pages, duplicates, legacy UUID links, missing/unpublished -> 404, escaping.
                         (all 30 tests in the package pass)

## Planned changes (needs the repository)
1. Branch `feature/custom-slugs` + backup commit/tag first.
2. Database (Supabase / Postgres, free): add nullable `slug` column and a case-insensitive UNIQUE index
   `create unique index invitations_slug_uidx on <invitations_table> (lower(slug)) where slug is not null;`
   (table name must be confirmed from the real schema). Existing rows keep slug = NULL and keep working by UUID.
3. API: `GET /api/slugs/check?slug=...` (logged-in owner; returns ok / reason / suggestion), slug saved through the existing save route
   (owner-only, uses lib/validate.js, returns 409 "already taken" when the unique index fires), `GET /api/invitations/by-slug/:slug` (published only).
4. Routing (vercel.json or server): serve root-level `/<slug>` only AFTER static files and existing routes, using
   `classifyPath` so reserved words / files / /api are never treated as slugs. `/invite/<uuid>` stays exactly as it is.
   Uppercase slug -> 301 to lowercase. Unknown or unpublished -> friendly "Invitation not found" page with HTTP 404.
5. Social sharing: for slug and UUID guest links the server returns guest.html with `shareMeta()` injected in <head>
   (title "Ameen & Fathima — Wedding invitation", og:title, og:description, og:url from the request host, og:image only if a public https image exists).
6. Editor: a "Your invitation link" field under Save, prefilled with `suggestSlug(name1,name2)`, live "available / taken" check,
   the existing share panel and `#copy-link` / WhatsApp / native share then use the slug URL when one is set.
7. Custom domain later (free to configure in Vercel): add mubieystudio.com in Vercel, point DNS. All links are built from the request host,
   so /ameen-fathima works on both domains with no code change.
8. Tests: the bot must add/keep tests for slug, UUID, duplicate and missing cases (tests/slug.test.mjs is the starting point) and run build.

## Decisions I need from you
- Privacy: a name-based link can be guessed (anyone typing /ameen-fathima sees a published invitation). UUID links cannot be guessed.
  Option: allow slugs only with a short random part (/ameen-fathima-k4x9). Which do you prefer?
- If a couple changes the slug later, should the old link keep working (redirect) or stop?
- Social-sharing picture: use the first uploaded photo (only possible if photos are stored as public files, not inside the database) or one fixed Mubiey Studio image?

## Manual steps for you
- Run the database migration in the Supabase SQL editor (the bot will give you the exact SQL for your table).
- Approve the deploy yourself (push / Vercel). Later: add your custom domain in Vercel -> Settings -> Domains.
