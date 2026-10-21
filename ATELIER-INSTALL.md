Mubiey Studio — Premium Atelier update

CURRENT CATALOG NOTE
The active Live Invitation picker now contains only the 11 approved templates.
This file is a historical update log; the older Atelier editions documented below
are no longer offered in the live template listing. Their renderers and artwork
remain in place so previously saved invitations continue to open correctly.

This is an update package, not a separate application. It targets the public Mubiey-Studio repository at base commit 71031e7be2c6cb371555a8135f41ab360f2ca257.

INSTALL
1. Back up your working project or commit your current changes.
2. Copy the public/, lib/ and tests/ folders from this ZIP into the existing Mubiey-Studio root, merging folders and replacing the included files. If you changed these same files since the base commit, merge those changes instead of blindly overwriting them.
3. Run npm test and npm run build in your existing project.
4. Start your project normally. Open Live invitations. Select “Try Royal Locket”, enter your details and upload your soundtrack. Use a template's Preview button to experience the opening; the editing preview stays open for customization.
5. Commit these changes and deploy through your existing GitHub/Vercel connection. No production deployment was performed from this workspace.

The ZIP contains no .env, credentials, database certificate, node_modules or user data. No database migration is needed for the added JSON settings. Existing account/storage configuration is still required.

INCLUDED
- 224 premium editions: 8 artwork families × 7 arrangements × 4 border finishes, for live invitations and static cards. Existing designs remain available.
- Royal Locket, Envelope seal and Direct opening options for premium live templates. Animated openings follow the animation toggle.
- Organic photo gallery with fullscreen viewing, arrows, keyboard and swipe navigation. Existing 20-photo capacity retained.
- Rounded event schedule and classic location pin.
- 10 bundled font files covering calligraphy, serif, italic, geometric, Arabic and Malayalam, plus system sans. Font licenses included.
- Click names, date, venue, message or photo sections in the live editing preview to jump to the corresponding controls.
- Embedded artwork/fonts in premium HTML and card exports.

Music playback is attempted automatically. Browsers can block audible autoplay; opening the locket/seal starts playback from a user gesture. The music control remains available.

CHECKED
13 automated tests and build passed. Chromium browser checks covered both editors, locket reveal, six-photo lightbox navigation, mobile width overflow and embedded export assets. Actual production login/upload/share and physical iOS/Android devices were not tested here. Existing backend tests use controlled test fixtures.

Preview screenshots are under previews/. They are examples, not user photos.

LATEST GALLERY/EVENT UPDATE
All uploaded photos now appear in the gallery. New invitations default to Organic petals; for a saved invitation choose Organic petals in Gallery layout. Event cards show the event label, description and time in separate positions. Fill Moments of the day with one event per line, for example: Nikah | Sat 11:00 AM | Nikah ceremony.

MUSIC OPENING OPTION
The soundtrack section now has Play music on opening (default ON). This preference is saved per invitation. OFF leaves playback to the Play button. Browser autoplay restrictions still apply. 14 automated tests and build pass.

MOBILE ARTWORK FIX
Live artwork now fits proportionally without stretching or cutting away the selected panel. Mobile hero height and spacing follow the screen width. Panel clipping prevents adjacent artwork leaking at the edges. 15 tests/build and Chromium 390px mobile viewport checks pass.

SEPTEMBER 23 COLLECTION / DIRECT EDIT UPDATE
448 premium editions = 16 artwork families x 7 arrangements x 4 finishes. Eight new original vector collections: Golden Linework, Art Deco Evening, Sage Wreath, Terracotta Arch, Pearl Lace, Celestial Vows, Rose Ribbon, Lotus Palace. These are original styles inspired by common wedding stationery categories, not a copy of all Google search results.
In the live editor, tap a name, message, venue or photo in the preview. A dialog edits text/font or replaces/removes that photo. Add photo is also available beside and inside the preview; up to 20 live photos. In normal cards, premium editable text opens a dialog; the Edit text selector also works with classic templates. Card photos can now be added to all premium arrangements (one photo per card). Fonts apply to names, not independently to every letter. Save invitations/design files normally to retain edits. Guest pages never expose editor controls.
16 automated tests and build passed; Chromium mobile viewport checks verified text changes, photo addition/removal, card text editing, and absence of horizontal overflow. Device testing on actual iPhones/Android phones is still recommended. No production deployment performed.


EMERALD NIKAH TEMPLATE · SEPTEMBER 27
- Added one new static invitation template: “Emerald Nikah · Floral Arch”.
- The supplied green/ivory reference artwork is retained as the visual artwork layer; invitation wording is rebuilt as editable SVG text.
- Editable fields include Arabic Bismillah, bride/groom names, parent lines, invitation wording, month/year, highlighted date, Nikah time, venue label, best-wishes line, arch colour and text colour.
- The template is added as one collection item only; existing invitation templates are left unchanged.

HEAVY LUXURY · OCTOBER 11 REFERENCE PROTOTYPE
- Added the four user-supplied reference images under public/assets/premium/heavy-luxury/.
- Added public/heavy-luxury-preview.html as an animation prototype: opening cover reveal, four scroll stages, responsive sizing, and reduced-motion accessibility.
- This ZIP is still an update package, not the complete Mubiey Studio application. The prototype is not yet wired into the live invitation editor, saved invitation schema, or guest-link renderer because the full repository files (including the live preset registry and project manifest) are not included here. Do not deploy this ZIP by itself. Merge the files into the full repository and integrate the preset/renderer hook before publishing the live template.
