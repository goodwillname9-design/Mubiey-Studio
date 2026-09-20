# Mubiey Studio: GitHub + Vercel

This edition keeps the photo editor, card templates and live invitations. Accounts,
invitation documents and project files use Supabase rather than a server's local disk.
The existing ChatGPT-hosted site is separate. Its accounts/data are not migrated by
uploading this ZIP. This package has not been deployed into your Vercel account yet.

## A. Set up Supabase once

1. Open your Supabase dashboard. Select the project you want to use for Mubiey Studio.
   A separate project keeps its usage separate. You may also use an existing project:
   this application's tables use a dedicated `mubiey` schema and `mubiey-private` bucket.
2. Open **SQL Editor**, make a new query, paste all of `supabase/setup.sql`, and Run.
   It creates the app tables and a private file bucket; it does not delete other apps' tables.
3. From **Connect**, copy the **Transaction pooler** PostgreSQL URI. Replace its database
   password placeholder with the real database password. URL-encode special characters
   in that password. Keep the host/port exactly as Supabase shows. Add `sslmode=require`
   if absent. This becomes `DATABASE_URL`.
4. Find the project's **Project URL** and backend **service_role** API key. These become
   `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Do not use the anon/publishable key here.
5. Choose a unique admin password of at least 16 characters for `MUBIEY_ADMIN_PASSWORD`.

Keep these values in environment settings. Do not put them into public JavaScript,
commit them to GitHub, paste them in chat, or include them in screenshots.

## B. Push a new GitHub repository

In GitHub, create a new empty repository named `mubiey-studio`. Do not add a generated
README/license for this first push. In VS Code, open the extracted folder containing
`package.json` and `vercel.json`, then run:

```bash
npm install
npm run build
npm test
git init
git add .
git commit -m "Mubiey Studio Vercel edition"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mubiey-studio.git
git push -u origin main
```

Replace YOUR_USERNAME with your GitHub username and sign into GitHub when prompted.
These instructions assume a new repo. If origin already exists, inspect `git remote -v`
and use the correct Mubiey repo; do not force-push or overwrite Zion/MubiCare.

## C. Import into Vercel

1. Vercel -> **Add New / Project** -> import your `mubiey-studio` GitHub repository.
2. Root Directory: the folder containing `package.json` and `vercel.json`. If you pushed
   the contents directly, leave the root at the repository root.
3. Framework preset: **Other**. Node.js: **22.x**.
4. Build Command: `npm run build`. Output Directory: `public`.
   Install Command: `npm ci`. The included config supplies the routes and function setup.
5. Add these environment variables for **Production**:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Supabase transaction pooler connection URI |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend service_role key |
| `MUBIEY_ADMIN_PASSWORD` | Your unique 16+ character admin password |

6. Deploy. Open the issued Vercel URL.
7. My Projects / Account -> Create account. Make a draft, save it and create a guest link.
8. Test the guest link in a private browser or on mobile data. Guests do not need accounts.
9. Admin login: username **admin**, password chosen above. Admin creation occurs on its
   first sign-in. The environment password initializes it only once; changing the variable
   later does not reset the saved account password.

Use a separate Supabase project for Preview deployments if you enable cloud saving there;
otherwise leave Preview secrets unset. Avoid pointing untrusted preview code at production data.
Do not enable Vercel deployment protection on the public production URL if guests need
anonymous invitation access. Check the production project's access settings before sharing.

## D. Updates after the first setup

Edit your existing local Mubiey folder or replace its application files with an update.
Keep your local `.env` and repository connection. Run:

```bash
npm run build
npm test
git add .
git commit -m "Update Mubiey Studio"
git push
```

With Vercel's GitHub integration connected and `main` selected as the production branch,
successful pushes deploy to your existing production URL. A failed deployment does not
mean the new version is live: inspect the Vercel build log and fix the reported error.
Changing environment variables requires a redeployment. Future database changes may also
require a supplied migration; do not recreate the database to update the website.

## E. Your own domain

A domain is your address; hosting runs the app. Buying a domain does not replace hosting.
Vercel is one hosting choice, not the only one. This package is prepared for Vercel.

You can start with the provided `vercel.app` URL, then buy an available domain later.
In your Vercel project: **Settings -> Domains -> Add Domain**. Enter it, then copy the
exact DNS records Vercel displays into your registrar's DNS settings. Wait for verification.
Do not guess an IP/CNAME or delete unrelated email DNS records. Create invitation links
from your new domain after it is connected. Accounts use host-specific cookies, so sign
in again when you change from the Vercel address to your custom domain.

## Local use

Install Node.js 22, run `npm install`, copy `.env.example` to `.env`, and fill in the same
four values for a test Supabase project. Run `npm start`, then open http://localhost:3000.
Without cloud settings, the editors work locally but account/save functions show a setup message.

## Storage, privacy and limits

- Signup/login use username and password. Passwords are salted/hashed; sessions are durable,
  expire after 12 hours and are revoked at logout. Automated email/password recovery is absent.
- The private bucket has no anonymous read/upload policy. Files upload through expiring,
  object-specific links. The service-role key remains in the server function.
- Uploads go directly from the browser to Supabase, avoiding the Vercel function body limit.
  The server checks ownership and validates uploaded size/type before attaching them.
- Downloads use authorized storage URLs valid for 60 seconds. Unpublishing blocks new
  guest access; an already issued file URL may remain usable for up to a minute.
- Per account: 250 MB, 200 invitations. File upload limits: 20 MB saved files, 15 MB invitation
  photos, 25 MB music. Each pending upload reserves 25 MB until finalized. Failed uploads
  are cleared after 3 hours when that account starts its next upload.
- These are app limits, not unlimited free storage/traffic. Supabase and Vercel plan limits,
  availability and charges apply. Monitor each dashboard before a public launch.
- Deleted invitation media and private projects are removed from storage. Media removed
  from a design may remain charged until the entire invitation is deleted.
- Album photos and ratings remain session-local; export before closing. Cloud projects
  store exported photos/PDFs and recipe JSON. They do not autosave the complete editor state.
- Admin can disable users and view usage. Disabling does not unpublish existing invitations.

## Checks and limitations

Automated tests cover PostgreSQL queries/schema, account isolation, private media,
size/type checks, quota accounting, upload finalization, sessions/admin, preset processing,
card variations, PDF and album ZIP output. Storage calls are mocked in those tests.
A real Supabase upload and a real Vercel deployment still need verification using your
account settings. Full mobile/browser visual testing is not claimed.

## Official references

- [Vercel GitHub deployments](https://vercel.com/docs/git/vercel-for-github)
- [Add a custom domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Vercel function limits](https://vercel.com/docs/functions/limitations)
- [Supabase database connections](https://supabase.com/docs/guides/database/connecting-to-postgres)
