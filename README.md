# Mubiey Studio — Vercel edition

Start with **START-HERE.txt** and **DEPLOY-VERCEL.md**.

- 220 wedding colour presets, including 100 cinematic looks and manual adjustments.
- Tone curves, HSL, histogram, auto tone, white balance picker, local exposure brush.
- Crop, rotate/flip, photo filmstrip, ratings, album ZIP exports.
- 108 live invitation variations with photos, music, countdown and guest links.
- 1,120 Muslim card variations (including 120 new floral line-art designs) plus other tradition collections; PDF/PNG/JPEG/SVG exports.
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

## Floral & cinema update
- 120 floral vector variations per tradition: 12 original botanical compositions × 10 palettes.
  These are editable SVG artwork, not copied stock templates. In Cards, choose Botanical
  or search “floral”. They appear first in the collection.
- Photo editor: no compressed-file MB cutoff. JPG/PNG/WebP decoding remains limited by
  device/browser memory, 100 megapixels and 30,000 px per edge. RAW/HEIC are not supported.
  A large file may fail to decode; the app does not silently shrink it to pass the limit.
- Photo export defaults to original dimensions and PNG. Reduced-resolution options were
  removed. Custom export cannot go below either original dimension. 2× resampling is
  available within the same processing limits, but it cannot recreate lost detail.
  PNG preserves the rendered pixels without JPEG encoding loss; source metadata/ICC
  profiles are not retained. JPEG quality defaults to 100. Album JPEG export is quality 100.
- Live invitation: 20 photos (cover + two portraits + 17 gallery slots), reorder buttons,
  gallery title and grid / masonry / full-width story layouts. Full-screen photo hero and
  navigation links. Web invitation images remain optimised copies (2,400 px long edge).
- Cloud storage/upload limits still apply independently of local photo editing. Removing
  the local MB cutoff does not make Supabase storage unlimited.
- Rendered floral samples inspected; automated account, 20-photo gallery, preset, SVG,
  PDF and ZIP checks pass. Real-device memory limits and live-provider upload testing
  still need testing on your devices/account.
