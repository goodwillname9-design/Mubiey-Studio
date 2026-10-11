Mubiey Studio — Royal Red & Gold + Velvet Curtain update

Add-on to the Emerald Nikah / Atelier package. Nothing existing is removed: the new code wraps
invitationDocument() the same way atelier-experience.js does.

NEW / CHANGED FILES
- public/royal-curtain.js   NEW   Royal Red & Gold template + velvet curtain opening (guest output)
- public/royal-editor.js    NEW   Owner editor: "Try Royal Red & Gold", curtain option, Family details,
                                  RSVP link, "Preview curtain opening"
- lib/validate.js           EDIT  openingStyle accepts 'curtain'; new family + rsvpUrl (HTTPS only)
- public/invitations.html   EDIT  loads royal-curtain.js and royal-editor.js
- public/guest.html         EDIT  loads royal-curtain.js
- tests/royal-curtain.test.mjs NEW 5 tests
- previews/royal-red-gold-demo.html  open in a browser to see the curtain without running the project

INSTALL
1. Commit or back up your project.
2. Copy these files into your project root (merge folders). If you changed invitations.html or
   lib/validate.js yourself, apply only the small edits listed above instead of overwriting.
3. npm test && npm run build
4. Open Live invitations -> "Try Royal Red & Gold" -> enter details, photos, music -> Save -> Publish.
   "Preview curtain opening" shows exactly what a guest sees.
5. Deploy through your usual GitHub/Vercel flow. Nothing was deployed from this workspace.

NOT INCLUDED IN THE ZIP (must be checked in your repo) - OWNER-ONLY SECURITY
The server/API code is not part of the package, so these could not be verified here. On the server,
for EVERY one of these routes, load the invitation and compare its owner with the logged-in account
before doing anything (return 401 if logged out, 404/403 if not the owner):
  POST /api/invitations                      (create: set owner = session user)
  PUT/PATCH /api/invitations/:id             (edit/save)
  DELETE /api/invitations/:id
  POST /api/invitations/:id/media            (photo + music upload)
  POST /api/invitations/:id/publish
  POST /api/invitations/:id/unpublish
Guest link: GET /api/invitations/:id (used by guest.js) must return only PUBLISHED invitations and
only the fields needed to render them: no owner id, email, or draft data. Never trust an owner id sent
by the browser. Use lib/validate.js on every create/save. Share link ids are random UUIDs.

MANUAL TESTS BEFORE GOING LIVE (not possible in the build workspace)
- Curtain: opens, panels slide apart, petals fall, page scrolls afterwards (phone + laptop)
- Music: starts on tapping "Open the invitation"; Play/Pause button works; OFF setting respected
- Reduced motion (OS setting): curtain just fades, no petals
- Photos: upload, gallery, fullscreen viewer
- Countdown ticks; Get Directions opens the right Google Maps place; RSVP link opens
- Guest link in a private window: no editor controls; cannot edit; unpublished link shows not found
- Logged in as a different account: cannot edit/delete/publish someone else's invitation
- iPhone Safari and Android Chrome

HONEST LIMITS
- RSVP is a link (e.g. WhatsApp). Collecting and listing replies inside Mubiey Studio would need a new
  database table and owner-only endpoint; not added here.
- Layout/animation were not visually verified in a real browser in this workspace; run the manual
  tests above.
