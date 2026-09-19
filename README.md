# Mubiey Studio

An upgraded, portable wedding creative suite based on your uploaded Mubiey wedding project. Includes a responsive photo editor, invitation card editor and saved online wedding invitations.

## Start on Windows / VS Code

1. Install **Node.js 20 or newer** if it is not installed.
2. Extract the whole ZIP. Do not run it from inside the ZIP.
3. Open the **Mubiey-Studio** folder in VS Code.
4. Open **Terminal → New Terminal**, then run:

   ```sh
   npm start
   ```

5. Open **http://localhost:3000** in your browser.
6. Keep the terminal running. Stop it with **Ctrl+C**.

You can also double-click **START-WINDOWS.bat**. There are **no npm dependencies** to install and no paid API keys required for the included features. Do not double-click an HTML file to run the full application: saving and live guest links require the server.

Open **My Projects · Account** to create your personal username/password account. Each account has private files and invitation drafts. The initial administrator uses username `admin` and the password printed by the server. Passwords are stored as salted scrypt hashes. Existing invitation documents without an owner belong to the administrator. The admin password environment variable is used only when first creating the admin account. Photo/card editing does not require sign-in. See **PUBLIC-SETUP.md** for deployment and limits.


## Included

### 1. Wedding photo editor

- **120 built-in colour recipes**, organised into 12 style families with 10 variations each: Timeless, Golden, Airy, Editorial, Moody, Rose, Film, Monochrome, Ceremony, Garden, Coastal and Evening.
- Every preset thumbnail uses your own uploaded photo.
- Adjustable preset strength; exposure, contrast, highlights, shadows, temperature, tint, saturation, matte, vignette and grain.
- Before/after split view, original view, zoom and fit.
- Undo/redo for colour and retouch adjustments.
- Save/load a reusable colour recipe as JSON.
- Rectangular selection blur and transparent erasing; cropping; colour-based solid-background removal.
- Full-resolution PNG/JPEG; PDF at your selected DPI; custom output dimensions.
- Photo editing stays in the browser. The original file is never overwritten.

**Important limits:** JPEG/PNG/WebP only; no RAW/PSD/AI/CDR import. Up to 80 MB compressed input and 40 megapixels decoded, with a 40-megapixel export ceiling. These checks protect browser memory; there is no unlimited-file or zero-lag guarantee. Custom upscale resamples pixels, not AI detail recovery. Background removal is colour-based and can remove matching colours on the subject; complex hair/backgrounds need a dedicated AI cutout service. Erasing leaves transparent pixels; it is not generative object replacement. Crop creates a new working image and cannot be undone; save first. Exports are RGB, without original camera metadata or ICC-profile preservation.

### 2. Normal wedding invitation cards

- **1,000 Muslim template variations**: 25 layout bases × 8 border treatments × 5 palettes.
- **250 variations each** for Hindu, Christian, Interfaith, General and Other collections.
- Search, style filters and paginated previews.
- Names, heading, date, venue, note, colours, type, name size and optional photo are editable.
- Save/load editable card JSON.
- PDF, PNG, JPEG and SVG export. Specify dimensions in millimetres and output DPI.
- SVG keeps vector text/linework; PDF embeds a high-resolution image, not editable vector text. No CMYK conversion, bleed or prepress proofing is performed. Fonts come from the device; verify the chosen font before printing or opening an SVG on another computer.

These are original **design variations**, not thousands of individually illustrated, licensed commercial templates. Layout bases, decorative frames and colour palettes are combined transparently. The designs do not copy commercial invitation artworks.

### 3. Live online wedding invitations

- **108 selectable variations**: 18 layout treatments × 6 palettes.
- Couple names, custom text, event date and venue time-zone offset.
- Live countdown, cover photo, two portraits, gallery, schedule and maps/directions.
- Up to six photos. Invitation copies are resized to a 2400-pixel long edge to keep guest pages lightweight; originals on your device are untouched.
- MP3/M4A/OGG/WAV soundtrack upload, up to 25 MB. Music starts when the guest taps Play; autoplay is not promised.
- Saved private drafts, reopen/edit, publish updates, and turn a guest link off.
- **Copy link, WhatsApp, native device Share and Open guest page** options directly in the builder. Sharing opens the user's share interface; nothing is automatically sent.
- Independent guest link for each saved invitation. Guests can view, not edit.
- Download a **self-contained HTML invitation** containing images, music, countdown and styles.
- PDF/PNG/JPEG static keepsake cards from the invitation builder.

Choose the UTC offset in effect on the actual wedding day. Countdown is absolute; the invitation displays the venue's date and offset. Phone native sharing depends on browser support; Copy link is the fallback.

## Making links work for other people

**A localhost link is not an internet link.** It works only on the computer running this server. Creating a link locally does not publish it online.

Choose one of these supported paths:

### A. Host the complete application

Use a Node.js host with **persistent disk storage**, HTTPS and a public domain. Run `npm start` and configure:

```env
HOST=0.0.0.0
PORT=3000
PUBLIC_ORIGIN=https://your-domain.example
MUBIEY_ADMIN_PASSWORD=your-long-private-password
DATA_DIR=/your-persistent-disk/mubiey
```

Copy `.env.example` to `.env` for local configuration or set these as hosting environment variables. Use the actual public HTTPS origin (no path), not the placeholder above. Public hostnames and HTTPS setup depend on your provider. This package does not include a hosting account, domain or automatic deployment.

Keep `.data` (or `DATA_DIR`) on persistent storage and back it up. It contains invitation records, media and the session secret. Ephemeral/serverless disk is **not** sufficient for this backend. Only the `public/` directory is served as static files; never expose `.data`, `.env` or the entire project directory as a static site.

When hosted, sign in to Live Invitations → complete the details → **Create share link** → **Copy link / WhatsApp / Share**. Anyone who receives a published link can view the invitation, including its photographs and soundtrack. **Turn link off** stops access through this application; it cannot revoke already downloaded HTML or images.

### B. Host a standalone HTML invitation

In Live Invitations, complete the design and use **Download invitation HTML**. Upload that exported HTML file to any static HTTPS hosting service as `index.html`. Share the URL issued by that host. The exported page contains the photos, soundtrack, styles and countdown and does not need this Node server. To change it later, export a new HTML file and replace the hosted file. Static exports cannot be revoked using the builder's Turn link off button.

### Testing on your phone on the same Wi-Fi

Set `HOST=0.0.0.0`, restart, and open `http://YOUR-PC-LAN-IP:3000` on the phone. Allow the server through your local firewall only if you intend LAN access. This is for local testing, not a secure public deployment. Native Share/Clipboard features may be limited on non-HTTPS LAN addresses.

## Keyboard shortcuts — photo editor

| Action | Shortcut |
| --- | --- |
| Open photo | Ctrl+O |
| Export | E |
| View original temporarily | Hold Space |
| Before/after | B |
| Previous/next preset | Left/Right arrow |
| Undo / redo | Ctrl+Z / Ctrl+Shift+Z |
| Fit | F |
| Zoom | + / − |
| Search presets | / |
| Shortcut help | ? |

Use Command instead of Ctrl on Mac. These are Mubiey shortcuts, not a complete Photoshop/Illustrator/CorelDRAW shortcut set.

## Project structure

```text
Mubiey-Studio/
  server.mjs              Local / hosted Node server and invitation API
  public/
    index.html            Workspace home
    photo.html            Wedding photo editor
    presets.js            Colour recipes
    engine.js             Shared preview / export colour processing
    export-worker.js      Background export processing
    photo-tools.js        Blur, erase, crop and solid-background tool
    cards.html            Invitation card collection and editor
    card-renderer.js       Original SVG template generator
    invitations.html      Live invitation builder
    live-presets.js        108 live design variations
    invitation-renderer.js Self-contained guest invitation renderer
    guest.html / guest.js  Published invitation viewer
    shared.js             Image export and PDF utilities
  tests/                  Node's built-in functional tests
  .env.example            Optional configuration template
  START-WINDOWS.bat       Windows launcher
```

## Verification

Run:

```sh
npm test
npm run check
```

The tests cover distinct preset output, neutral-image preservation, template counts/uniqueness, escaped user text, PDF object offsets/dimensions, authentication, private media, guest publishing/revocation and request-origin checks. Sample card SVGs and PDF dimensions were also rendered/inspected during creation. A live browser session could not connect to the build environment, so full interactive cross-device browser QA was not completed. Test your photos and exported invitations in your own browser before publishing client work.

## Changes from your uploaded project

Your uploaded single HTML page used hosted Tailwind/GSAP/icon/font scripts, a small CSS-filter list, in-memory photo URLs and WhatsApp text without a saved invitation URL. This upgrade preserves the wedding photo, custom message, portraits, countdown, venue, soundtrack and scrollable-story features, and reorganises them into maintainable modules with local styling, real persistent invitations, export options, and larger collections. External UI/CDN dependencies are removed. Uploaded Git history and credentials are not included in the deliverable.

## Design scope

The collection combines modern editorial type, photo-led layouts, arches, geometric borders, floral/leaf linework and classic monograms. The current category mix was informed by the official Paperless Post wedding catalogue (https://www.paperlesspost.com/cards/group/wedding-invitations); no commercial assets or template source were copied. These are custom starter designs, not a claim to include all current industry templates or proprietary Adobe presets.

## Multi-user edition
- Username/password signup, login, logout; per-owner invitation and media authorization.
- My Projects: private uploaded PNG/JPEG/PDF/JSON files; 20 MB per file.
- File downloads are attachments; JSON can be imported manually into its original editor. Photo/card projects are not automatically synchronized.
- 250 MB storage per user by default; set USER_STORAGE_MB to change it.
- Admin lists accounts, invitation counts and used storage, and enables/disables users. Admin cannot browse other users' private files through the app.
- Sessions expire after 12 hours and are revoked at logout; restarting the server signs everyone out.
- Email verification and forgotten-password recovery are not included. Keep passwords in a password manager.
- This is a single-server edition; use one Node process and a persistent disk. It is not designed for serverless ephemeral disks or multiple replicas.
- Mobile photo editor keeps preview above two scrollable control panels.
