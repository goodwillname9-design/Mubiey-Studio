# Mubiey Studio — Vercel edition

Start with **START-HERE.txt** and **DEPLOY-VERCEL.md**.

- 120 wedding colour presets and manual adjustments.
- Tone curves, HSL, histogram, auto tone, white balance picker, local exposure brush.
- Crop, rotate/flip, photo filmstrip, ratings, album ZIP exports.
- 108 live invitation variations with photos, music, countdown and guest links.
- 1,000 Muslim card variations plus other tradition collections; PDF/PNG/JPEG/SVG exports.
- Separate accounts, private files and invitation drafts, admin usage controls.

Counts are layout/palette/border or colour-recipe variations, not independent hand-drawn
artworks. This is an independent editor, not Adobe Lightroom. RAW decoding, AI denoise,
AI subject masks, professional healing, lens profiles and perspective correction are absent.
Crop/rotate/flip bake the current look and restart history. Basic detail and haze filters
are approximations. Preview before printing; exports are RGB, not a CMYK prepress workflow.

Runtime: Node.js 22, Vercel API function, Supabase PostgreSQL and private Storage.
The photo editor runs in the browser. The API does not write permanent data to local disk.

```sh
npm install
npm start
npm run build
npm test
```

Copy `.env.example` to `.env` for local account/storage testing. Never commit real keys.
Supabase setup requires running `supabase/setup.sql` once. The ZIP contains no credentials.
