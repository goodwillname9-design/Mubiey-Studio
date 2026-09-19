# Mubiey Studio — public setup

This ZIP adds accounts; it does not itself create an internet address.

## Test on your PC

1. Extract and open the Mubiey-Studio folder in VS Code.
2. Run `npm start` in Terminal.
3. Open http://localhost:3000 and choose **My Projects · Account**.
4. Create a username and a password (12+ characters).
5. Make a live invitation, Save, then Create share link.
6. Sign into a second account in a private browser window: the first account's private projects must not appear.

Administrator username is `admin`; the initial password is printed in the terminal.
Do not distribute that password to customers. Customers create their own accounts.
An existing installation can keep its `.data` directory; old invitations belong to admin.

## Publish the complete application

You need hosting that runs a **persistent Node.js service**, with an HTTPS address
and a persistent disk. A static-only upload will not support accounts or saved invitations.

In your hosting dashboard:

1. Upload this project or connect a private Git repository containing it. Do not upload `.env` or `.data` to Git.
2. Select Node.js 22 (or use the included Dockerfile). Start command: `npm start`.
3. Attach a persistent disk. Set `DATA_DIR` to its exact mounted directory, writable by your app.
4. Set `HOST=0.0.0.0`, and use the port required by your host (default `PORT=3000`).
5. Set `MUBIEY_ADMIN_PASSWORD` to a unique long password **before the first start**.
6. Enable HTTPS and set `PUBLIC_ORIGIN` to the exact issued address, e.g. `https://your-studio.example.com` (no ending slash or path).
7. Start/redeploy, create a normal account and repeat the two-account test above.
8. Publish an invitation. Open its guest link on your phone using mobile data with no account signed in.
9. Share the website's home URL with customers. Share each invitation's own URL with its guests.

When adding a custom domain, enable HTTPS for it and update PUBLIC_ORIGIN to that
one canonical address. Redirect other hostnames to it. Cookies require HTTPS when
PUBLIC_ORIGIN is set. The reverse proxy must pass requests to the app.

The Docker image runs as the `node` user (UID 1000). Ensure a mounted disk is writable
by that user. Mount persistent data at `/app/.data`, or set DATA_DIR accordingly.

## Keep data safe

- Back up the entire DATA_DIR securely; it contains accounts, password hashes,
  private project files, invitations, and media. Restore it with the app stopped.
- Run **one instance/process only**. File storage and in-memory sessions are not
  suitable for multiple replicas. Restarting logs everyone out but preserves saved data.
- The admin password setting initializes the admin account only on its first run;
  changing the variable later does not reset its stored password.
- Default allowance: 250 MB per user (`USER_STORAGE_MB`), 20 MB per saved file,
  200 invitation documents per account. Invitation photo/music limits still apply.
- Removed media may remain on disk until its invitation is deleted and continues
  to count toward storage. Delete obsolete invitations to reclaim it.
- Login/signup rate limiting is by connecting IP. Behind a proxy this can group
  customers together. Configure provider-level rate limiting before a large launch;
  do not blindly trust client-supplied forwarding headers.
- Set provider-level total disk, request and traffic limits. Per-user quotas alone
  do not cap the storage used by an unlimited number of registered accounts.
- No email verification, automated password recovery, payments or subscription
  billing in this edition. Admin can enable/disable accounts in My Projects.
- Disabling an account prevents access but does not unpublish its existing invitations.
- Published invitation URLs are viewable by anyone who receives the link.

## Editing saved work

Invitations save directly online. For photos/cards, export your file or editable
JSON recipe first, then upload it in My Projects. Download it later; import JSON
in its original editor. A photo recipe also needs its original photo. PDFs and
exported images do not contain editable layers. This edition does not autosave
photo/card editor state to the account.

## Checks completed

Automated checks cover independent account access, private media/files,
unauthorized edit/delete/publish attempts, guest sharing, logout revocation,
admin restrictions, disabling accounts, existing preset rendering and PDF output.
Full visual browser and real iPhone checks have not been completed. Test those
before customer launch. Hosting capacity determines how many concurrent users
this single-server edition can support; no unlimited-user claim is made.
