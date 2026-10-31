# Step Up – Live Invitation + Card Themes

## What is included

### Live Invitation: **Step Up**
- Luxury double doors open first (tap / click)
- Scroll / auto-walk up marble stairs with side flower garlands
- Crystal chandelier atmosphere
- Reach the invitation box on the table
- Box lid opens, box stays, invitation card comes forward
- 7 original card themes (no sample names, monograms or watermarks from reference images)

Template id in live list: `stepup`  
Name shown: **Step Up · Luxury marble stairs & invitation box**

### Card themes (StepUpCards)
1. pearl – Pearl Emboss  
2. blush – Burgundy Blush  
3. navy – Royal Navy  
4. maroon – Maroon & Gold  
5. candle – Candlelit Drapes  
6. **floraldusk** – Floral Dusk (new, inspired by deep floral style, original art)  
7. **sapphire** – Sapphire Ribbon (new, blue floral + ribbon, original art)  

All text comes only from your data object (bride, groom, date, venue…).  
No letters or watermarks from the sample images you sent are present.

## Files to copy into your project

```
public/stepup.html
public/stepup-cards.js
public/stepup-cards-preview.html
public/stepup-thumb.jpg
public/live-presets.js   (already contains stepup entry)
live-presets.js          (root copy if your server uses it)
```

If your project already has these files, replace only:
- `public/stepup-cards.js` (new themes)
- keep existing `stepup.html` unless you want a fresh copy

## Deploy / push

From your project root (where package.json and .git live):

```bash
# 1. Copy the files above into the correct folders

# 2. Commit
git add public/stepup.html public/stepup-cards.js public/stepup-cards-preview.html public/stepup-thumb.jpg public/live-presets.js live-presets.js
git status
git commit -m "Add Step Up live invitation and Floral Dusk / Sapphire card themes"

# 3. Push
git push origin main
# or your branch:
# git push origin feature/your-branch

# 4. If you use Vercel
# (auto-deploys on push if connected)
# or:
npx vercel --prod
```

## Preview locally

Open `public/stepup.html` in a browser, or:

```
http://localhost:PORT/stepup.html
http://localhost:PORT/stepup.html?theme=floraldusk
http://localhost:PORT/stepup.html?theme=sapphire
```

Data can be passed via `window.STEPUP_DATA` or `?d=` base64 JSON.

## Important

- Sample invitation images you sent were used only as visual style reference.
- No names (Samir, Fatima, Muhammed, Sara, etc.), no watermarks, no studio logos from those images were copied into the templates.
- All content is driven by your invitation data fields.
