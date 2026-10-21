# Mubiey Studio — Royal Invitation Frame Templates

These frames are ready to use as full-bleed backgrounds for invitation cards.

## Frames included

| File | Style | Suggested animation |
|------|-------|---------------------|
| `frame-velvet-rose.png` | Deep burgundy velvet + roses + hanging gold | Curtain open |
| `frame-golden-arch.png` | Soft champagne + ornate gold arch | Soft light reveal |
| `frame-column-palace.png` | Tall classical columns + mist | Rising mist + falling petals |
| `frame-pedestal.png` | Standing ornate frame on pedestal | Scale + focus reveal |

## Extra colour variants (CSS filters on the same images)

- **Midnight Sapphire** – hue-rotate on velvet-rose (deep blue night)
- **Emerald Garden** – hue-rotate on golden-arch (lush green)
- **Ivory & Gold** – sepia + brightness on pedestal (soft classic)

## How to use in the real app

1. Upload the 4 PNG files to your public media / assets folder (or Supabase storage).
2. In the card editor / template picker, expose them as selectable backgrounds.
3. The demo.html shows four distinct opening animations that work well with these ornate frames.
4. Couple names are injected via the existing data (`name1`, `name2`). The slug helpers in `lib/slug.js` already produce clean links like `/fathima-navas`.

## Custom link example

```
https://mubiey-studio.vercel.app/fathima-navas
```

(Uses the `suggestSlug` + routing plan already documented in `SLUG-LINKS-PLAN.md`.)

## Demo

Open `templates/demo.html` in a browser.  
Change the names in the top bar → the cards and the preview link update instantly.  
Click any card to play its opening animation.

**No existing files were modified.** Only new files were added under `templates/`.
