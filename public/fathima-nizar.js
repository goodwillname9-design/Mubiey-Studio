/* Fathima Nizar · Floral Arch collection.
   Adds five editions (Emerald original + Royal Burgundy, Midnight Navy, Sage Mist, Dusty Rose) to BOTH
   the static invitation cards and the live invitations. It only adds: every existing template stays. */
'use strict';
(() => {
  const root = globalThis;
  const inBrowser = typeof document !== 'undefined' && typeof document.getElementById === 'function';
  const LIVE_BASE = 'atelier-4-2-0'; // Emerald Nikah arch family: supplies sections, countdown, gallery, opening
  const PAPER = '#f3f2ef';
  const VARIANTS = [
    {id: 'fn-emerald',  name: 'Fathima Nizar',                   file: 'fn-emerald.jpg',  tone: 'Emerald & Ivory',   arch: '#0c3d2a', ink: '#0d2f22', gold: '#ae9454'},
    {id: 'fn-burgundy', name: 'Fathima Nizar · Royal Burgundy',  file: 'fn-burgundy.jpg', tone: 'Burgundy & Ivory',  arch: '#4a121c', ink: '#3d0f16', gold: '#b08a52'},
    {id: 'fn-navy',     name: 'Fathima Nizar · Midnight Navy',   file: 'fn-navy.jpg',     tone: 'Navy & Ivory',      arch: '#0f1f45', ink: '#0f1f45', gold: '#b39a5b'},
    {id: 'fn-sage',     name: 'Fathima Nizar · Sage Mist',       file: 'fn-sage.jpg',     tone: 'Sage & Ivory',      arch: '#3b5a3d', ink: '#2c4630', gold: '#a89a62'},
    {id: 'fn-rose',     name: 'Fathima Nizar · Dusty Rose',      file: 'fn-rose.jpg',     tone: 'Rose & Ivory',      arch: '#7a3f55', ink: '#5a2b3c', gold: '#b9946a'}
  ];
  const BY = Object.fromEntries(VARIANTS.map(v => [v.id, v]));
  const isFN = id => Object.prototype.hasOwnProperty.call(BY, id);
  const origin = () => (root.location && root.location.origin) || '';
  const artURL = v => `${origin()}/assets/premium/${v.file}`;
  const hex = x => /^#[0-9a-f]{6}$/i.test(x || '');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

  // ---------- artwork loading (embedded copies are used for exports) ----------
  const embedded = {};
  function load(v) {
    if (embedded[v.id]) return Promise.resolve(embedded[v.id]);
    return fetch(artURL(v)).then(r => { if (!r.ok) throw Error('Could not load Fathima Nizar artwork.'); return r.blob(); })
      .then(b => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(embedded[v.id] = fr.result); fr.onerror = rej; fr.readAsDataURL(b); }));
  }
  const currentId = () => inBrowser ? (document.getElementById('live-preset')?.value || document.getElementById('design-title')?.dataset.template || '') : '';
  const prevReady = root.atelierReady;
  if (typeof prevReady === 'function') root.atelierReady = () => Promise.all([prevReady(), isFN(currentId()) ? load(BY[currentId()]) : null]);

  // ---------- registry hooks ----------
  const prevSpec = root.atelierSpec;
  root.atelierSpec = id => isFN(id) ? {art: 4, composition: 2, finish: 0, fathimaNizar: true} : prevSpec(id);

  const templateFor = v => ({
    id: v.id, name: v.name, tradition: 'Muslim', style: 'Traditional',
    detail: `Floral arch · ${v.tone}`, layout: 2, palette: 1, atelier: true, premium: true,
    art: 4, composition: 2, finish: 0, theme: 'ivory', category: 'Illustrated'
  });
  if (typeof root.cardTemplates === 'function') {
    const prev = root.cardTemplates;
    root.cardTemplates = tradition => [...VARIANTS.map(templateFor), ...prev(tradition)];
  }
  if (typeof root.getTemplate === 'function') {
    const prev = root.getTemplate;
    root.getTemplate = id => isFN(id) ? templateFor(BY[id]) : prev(id);
  }

  // ---------- static invitation card ----------
  const DEFAULTS = {
    parent1: "(D/o Mr. Bride's Father & Mrs. Bride's Mother)",
    parent2: "(S/o Mr. Groom's Father & Mrs. Groom's Mother)",
    invite: 'INVITE YOU WITH JOYFUL HEARTS TO WITNESS\nAND BE BLESSED ON THE AUSPICIOUS OCCASION OF\nOUR WEDDING',
    time: 'Nikah · After Asr'
  };
  const F_IDS = ['parent1', 'parent2', 'invite', 'time'];
  const fval = (data, k) => {
    if (data && data['f-' + k] != null) return data['f-' + k];
    const el = inBrowser ? document.getElementById('f-' + k) : null;
    return el ? el.value : DEFAULTS[k];
  };
  const wrap = (str, max) => {
    const out = []; let row = '';
    for (const w of String(str || '').split(/\s+/).filter(Boolean)) {
      if ((row + ' ' + w).trim().length > max && row) { out.push(row); row = w; } else row = (row + ' ' + w).trim();
    }
    if (row) out.push(row);
    return out;
  };
  function fnCard(data = {}, t = {}, embed = false) {
    const v = BY[t.id] || BY[data.template] || VARIANTS[0];
    const sample = !data.template; // catalogue thumbnails send no template key
    const name1 = sample ? 'Fathima' : (data.name1 || 'Fathima');
    const name2 = sample ? 'Nizar' : (data.name2 || 'Nizar');
    const ink = hex(data.ink) ? data.ink : v.ink;
    const gold = hex(data.accent) ? data.accent : v.gold;
    const bg = embed && embedded[v.id] ? embedded[v.id] : artURL(v);
    const nameFont = typeof root.atelierFont === 'function' ? root.atelierFont(data.font || 'script') : 'serif';
    const css = typeof root.atelierFontCSS === 'function' ? root.atelierFontCSS(embed) : '';
    const cx = 309;
    const t1 = (s, x, y, size, extra = '') => `<text x="${x}" y="${y}" text-anchor="middle" font-family="AtelierSerif, Georgia, serif" font-size="${size}" fill="${ink}" ${extra}>${esc(s)}</text>`;
    const caps = (s, x, y, size, extra = '') => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size}" fill="${ink}" letter-spacing=".7" ${extra}>${esc(s)}</text>`;
    const name = (s, y, key) => {
      const len = Math.max(1, [...s].length);
      const size = Math.max(20, Math.min(Number(data.nameSize) || 44, 400 / (len * .45), 52));
      return `<text x="${cx}" y="${y}" text-anchor="middle" font-size="${size}" fill="${ink}" data-edit="${key}" style="font-family:${nameFont}">${esc(s)}</text>`;
    };
    const heading = String(data.heading || 'With the blessings of Allah').toUpperCase();
    const invite = String(fval(data, 'invite')).split(/\r?\n/).filter(Boolean).slice(0, 3);
    const dateLines = wrap(data.dateText || 'Sunday, 22 November 2026', 22).slice(0, 2);
    const venueLines = wrap(data.venue || 'Venue, city', 30).slice(0, 2);
    const noteLines = wrap(data.note || 'Your presence will make our day complete.', 38).slice(0, 2);
    const i1 = (name1 || 'F').trim()[0].toUpperCase(), i2 = (name2 || 'N').trim()[0].toUpperCase();
    const initial = (c, x) => `<text x="${x}" y="55" text-anchor="middle" font-family="AtelierMontserrat, Arial, sans-serif" font-size="11.5" fill="${ink}" opacity=".85">${esc(c)}</text>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840" viewBox="0 0 600 840"><style>${css}</style>
<image href="${bg}" x="0" y="0" width="600" height="840" preserveAspectRatio="xMidYMid slice"/>
${initial(i1, 49.5)}${initial(i2, 92.8)}
${caps(heading, cx, 250, 8.4, 'data-edit="heading"')}
<path d="M${cx - 44} 262H${cx + 44}" stroke="${gold}" stroke-width=".9"/>
${name(name1, 322, 'name1')}
${caps(fval(data, 'parent1'), cx, 342, 6.6)}
${t1('&', cx, 376, 25, 'font-style="italic"')}
${name(name2, 424, 'name2')}
${caps(fval(data, 'parent2'), cx, 444, 6.6)}
${invite.map((s, i) => caps(s, cx, 478 + i * 12, 7.4)).join('')}
<path d="M${cx - 60} 518H${cx + 60}" stroke="${gold}" stroke-width=".9"/><circle cx="${cx - 4}" cy="518" r="2.2" fill="${gold}"/><circle cx="${cx + 4}" cy="518" r="2.2" fill="${gold}"/>
${dateLines.map((s, i) => t1(s, 252, 556 + i * 22, 19, 'data-edit="dateText"')).join('')}
${caps(String(fval(data, 'time')).toUpperCase(), 252, 556 + dateLines.length * 22 + 8, 8.2)}
${venueLines.map((s, i) => t1(s, 252, 556 + dateLines.length * 22 + 34 + i * 15, 11.5, 'data-edit="venue"')).join('')}
${noteLines.map((s, i) => t1(s, 252, 556 + dateLines.length * 22 + 34 + venueLines.length * 15 + 12 + i * 12, 9.2, 'font-style="italic" data-edit="note"')).join('')}
</svg>`;
  }
  const prevCard = root.atelierCard;
  if (typeof prevCard === 'function') root.atelierCard = (data, t, embed = false) => (t && isFN(t.id)) || isFN(data?.template) ? fnCard(data, t, embed) : prevCard(data, t, embed);
  if (typeof root.cardSVG === 'function') {
    const prev = root.cardSVG;
    root.cardSVG = (data = {}, t = root.getTemplate(data.template)) => (t && isFN(t.id)) || isFN(data?.template) ? fnCard(data, t, false) : prev(data, t);
  }

  // ---------- live invitation ----------
  function liveCSS(v, n1, n2) {
    const len = Math.max(n1.length, n2.length, 8);
    const fs = Math.max(3.8, Math.min(8.6, 150 / len));
    return `:root{--paper:${PAPER};--ink:${v.ink};--gold:${v.gold}}body{background:${PAPER}}
.hero.fn{max-width:800px;margin:0 auto;padding:0!important;min-height:0!important;aspect-ratio:1448/2048;display:block;container-type:inline-size;overflow:hidden;text-align:center;color:${v.ink}}
.hero.fn .hero-art{position:absolute;inset:0;z-index:-2;background:${PAPER}}.hero.fn .hero-art img{display:block;width:100%;height:100%;object-fit:cover}
.hero.fn .frame,.hero.fn .monogram,.hero.fn .down{display:none!important}
.hero.fn .overline{position:absolute;left:19%;right:17%;top:27.2%;margin:0;max-width:none;font:2.0cqw/1.5 Arial,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:${v.ink}}
.hero.fn .name-group{position:absolute;left:17%;right:13%;top:31.4%;width:auto;max-width:none;border:0!important;outline:0!important;padding:0!important;border-radius:0!important}
.hero.fn h1{font-size:${fs}cqw!important;line-height:1.08;max-width:100%;color:${v.ink}}
.hero.fn .amp{font-size:6cqw;line-height:1;margin:1.4cqw 0;color:${v.gold}}
.hero.fn .date{position:absolute;left:26%;width:50%;top:55.2%;margin:0;max-width:none;padding:0;font:italic 2.7cqw/1.55 AtelierSerif,Georgia,serif;letter-spacing:.02em;color:${v.ink}}
.hero.fn .date small{display:block;font:1.7cqw Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.75}
.hero.fn .petal{background:${v.gold};z-index:1}
.section h2,.countdown b,.event h3{color:${v.ink}}
@media(max-width:600px){.hero.fn{min-height:0!important;padding:0!important}.hero.fn .overline{font-size:2.3cqw}.hero.fn .date{font-size:3cqw}}
@media print{.hero.fn{min-height:0!important}}`;
  }
  if (typeof root.invitationDocument === 'function') {
    const prev = root.invitationDocument;
    root.invitationDocument = function (data) {
      if (!isFN(data?.template)) return prev(data);
      const v = BY[data.template];
      let html = prev({...data, template: LIVE_BASE});
      const src = embedded[v.id] || artURL(v);
      html = html.replace(/<div class="hero-art" aria-hidden="true">[\s\S]*?<\/svg><\/div>/, `<div class="hero-art" aria-hidden="true"><img src="${esc(src)}" alt=""></div>`)
        .replace('<section id="top" class="hero ', '<section id="top" class="hero fn ');
      const n1 = String(data.name1 || 'Fathima'), n2 = String(data.name2 || 'Nizar');
      return html.replace('</head>', `<style>${liveCSS(v, n1, n2)}</style></head>`);
    };
  }

  // ---------- editors ----------
  if (!inBrowser) return;
  const css = `.fn-block{margin:18px 0 6px;padding:14px 0;border-top:1px solid #b49b6744}.fn-block h3{margin:0 0 4px;font:26px AtelierSerif,Georgia,serif;color:#f5e6c9}.fn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-top:12px}.fn-tile{background:#17222a;border:1px solid #35434c;border-radius:8px;overflow:hidden}.fn-tile.selected{outline:2px solid #d3b47a}.fn-thumb{cursor:pointer;aspect-ratio:5/7;overflow:hidden}.fn-thumb svg{display:block;width:100%;height:100%}.fn-tile footer{padding:9px}.fn-tile strong{display:block;font:15px AtelierSerif,Georgia,serif;line-height:1.2}.fn-tile small{display:block;font-size:10px;color:#9dabb7;margin:3px 0 8px}.fn-actions{display:flex;gap:5px}.fn-actions button{flex:1;font-size:11px;padding:8px 3px}`;
  const select = document.getElementById('live-preset');
  if (select) {
    // Live invitations: add the collection at the top of the list and as its own tile section.
    const group = document.createElement('optgroup');
    group.label = 'FATHIMA NIZAR · Floral Arch Collection';
    for (const v of VARIANTS) { const o = new Option(v.name, v.id); o.dataset.layout = 2; group.append(o); }
    select.prepend(group);
    const block = document.createElement('div');
    block.className = 'fn-block';
    block.innerHTML = '<h3>Fathima Nizar · Floral Arch</h3><p class="help">Five colour editions of the emerald arch invitation with the couple illustration. Names, date, venue, message, photos and music work exactly like every other live design.</p><div class="fn-grid"></div>';
    const anchor = document.querySelector('.atelier-filter') || document.getElementById('live-designs');
    anchor.before(block);
    const dialog = document.createElement('dialog');
    dialog.className = 'atelier-dialog';
    dialog.innerHTML = '<header><span>Invitation preview</span><button type="button">Close ×</button></header><iframe title="Live wedding invitation preview" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"></iframe>';
    document.body.append(dialog);
    dialog.querySelector('button').onclick = () => { dialog.close(); dialog.querySelector('iframe').srcdoc = ''; };
    dialog.addEventListener('close', () => { dialog.querySelector('iframe').srcdoc = ''; });
    const tiles = [];
    const mark = () => tiles.forEach(([id, tile]) => tile.classList.toggle('selected', select.value === id));
    for (const v of VARIANTS) {
      const tile = document.createElement('article');
      tile.className = 'fn-tile';
      const thumb = document.createElement('div');
      thumb.className = 'fn-thumb';
      thumb.innerHTML = fnCard({}, templateFor(v), false);
      const footer = document.createElement('footer');
      footer.innerHTML = `<strong>${esc(v.name)}</strong><small>${esc(v.tone)}</small>`;
      const actions = document.createElement('div');
      actions.className = 'fn-actions';
      const peek = document.createElement('button');
      peek.type = 'button'; peek.textContent = 'Preview';
      peek.onclick = () => { const d = collect(); d.template = v.id; d.theme = 'ivory'; d.photos = photos.map(p => p.preview || p.value); dialog.querySelector('iframe').srcdoc = invitationDocument(d); dialog.showModal(); };
      const use = document.createElement('button');
      use.type = 'button'; use.className = 'primary'; use.textContent = 'Use design';
      use.onclick = () => { select.value = v.id; document.getElementById('theme').value = 'ivory'; markDirty(); mark(); };
      thumb.onclick = peek.onclick;
      actions.append(peek, use); footer.append(actions); tile.append(thumb, footer);
      block.querySelector('.fn-grid').append(tile);
      tiles.push([v.id, tile]);
    }
    select.addEventListener('change', mark);
    mark();
    preview();
  }

  const title = document.getElementById('design-title');
  if (select || title) document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
  if (title && document.getElementById('c-font')) {
    // Invitation cards: extra editable wording panel that only shows for the Fathima Nizar editions.
    const ensureFields = () => {
      let box = document.getElementById('fn-fields');
      if (!box) {
        box = document.createElement('section');
        box.id = 'fn-fields'; box.className = 'panel'; box.style.marginTop = '18px';
        box.innerHTML = `<h2>Fathima Nizar · Editable wording</h2><p class="help">The arch, flowers, couple and Bismillah stay as artwork. Everything else below is live, editable text.</p><div class="field-grid">
<label>Bride's parents<input id="f-parent1" value="${esc(DEFAULTS.parent1)}"></label>
<label>Groom's parents<input id="f-parent2" value="${esc(DEFAULTS.parent2)}"></label>
<label class="wide">Invitation wording (up to 3 lines)<textarea id="f-invite">${esc(DEFAULTS.invite)}</textarea></label>
<label class="wide">Event line<input id="f-time" value="${esc(DEFAULTS.time)}"></label></div>`;
        document.getElementById('editor').querySelector('.work-layout')?.prepend(box);
        box.querySelectorAll('input,textarea').forEach(el => el.addEventListener('input', () => { if (isFN(title.dataset.template)) preview(); }));
      }
      box.hidden = false;
    };
    const prevCollect = root.collect;
    root.collect = () => {
      const d = prevCollect();
      if (isFN(title.dataset.template)) for (const k of F_IDS) { const el = document.getElementById('f-' + k); if (el) d['f-' + k] = el.value; }
      return d;
    };
    const prevOpen = root.openTemplate;
    root.openTemplate = t => {
      prevOpen(t);
      title.dataset.template = t.id;
      const box = document.getElementById('fn-fields');
      if (isFN(t.id)) {
        const v = BY[t.id];
        ensureFields();
        for (const [id, val] of [['c-background', PAPER], ['c-ink', v.ink], ['c-accent', v.gold], ['c-name1', 'Fathima'], ['c-name2', 'Nizar'], ['c-heading', 'With the blessings of Allah'], ['c-dateText', 'Sunday, 22 November 2026'], ['c-venue', 'Venue, city']]) {
          const el = document.getElementById(id); if (el) el.value = val;
        }
        preview();
      } else if (box) box.hidden = true;
    };
    document.getElementById('design-file')?.addEventListener('change', () => {
      setTimeout(() => {
        if (!isFN(title.dataset.template)) return;
        const file = document.getElementById('design-file').files?.[0];
        if (!file) return;
        file.text().then(raw => {
          try { const a = JSON.parse(raw)?.design || {}; for (const k of F_IDS) if (a['f-' + k] != null && document.getElementById('f-' + k)) document.getElementById('f-' + k).value = a['f-' + k]; preview(); } catch {}
        });
      }, 40);
    }, true);
    if (typeof root.renderList === 'function') root.renderList();
  }
})();
