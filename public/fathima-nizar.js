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
    const nameFont = typeof root.atelierFont === 'function' ? root.atelierFont('script') : 'cursive';
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
.hero.fn{position:relative;isolation:isolate;background:${PAPER};color:${v.ink};overflow:hidden}.hero.fn .fn-art{z-index:-2}.hero.fn .fn-copy{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;color:${v.ink};padding:19% 16% 12%;font-family:AtelierSerif,Georgia,serif}.hero.fn .fn-bismillah-backdrop{position:absolute;z-index:0;left:25%;top:18%;width:50%;height:10%;background:${PAPER}e8;border-radius:50%;filter:blur(2px)}.hero.fn .fn-bismillah{position:relative;z-index:1;font:clamp(13px,3.3cqw,27px)/1.5 AtelierAmiri,serif;min-height:1.5em;max-width:90%;margin-bottom:5%;direction:rtl}.hero.fn .fn-overline{position:relative;z-index:1;font:clamp(8px,2cqw,16px)/1.5 Arial,sans-serif;letter-spacing:.22em;text-transform:uppercase;margin:0 0 2%;max-width:90%;color:${v.ink}}.hero.fn .fn-names{position:relative;z-index:1;display:grid;justify-items:center;line-height:1}.hero.fn .fn-names h1{font-family:AtelierScript,${nameFont},cursive!important;font-size:clamp(30px,8.4cqw,72px)!important;font-weight:400;line-height:1.04;margin:0;color:${v.ink};max-width:100%}.hero.fn .fn-amp{font:italic clamp(20px,5cqw,44px)/1 AtelierSerif,serif;color:${v.gold};margin:1.2cqw 0}.hero.fn .fn-editable{display:inline;overflow-wrap:anywhere}.hero.fn .fn-parents{font:clamp(7px,1.55cqw,13px)/1.45 Arial,sans-serif;max-width:90%;margin:3% 0 0;color:${v.ink};opacity:.8}.hero.fn .fn-invite{font:clamp(7px,1.6cqw,14px)/1.45 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;max-width:78%;margin:3% 0;color:${v.ink}}.hero.fn .fn-date{display:grid;grid-template-columns:auto auto auto;align-items:end;gap:0 1.1cqw;margin-top:1%;color:${v.ink}}.hero.fn .fn-day{font:clamp(25px,6cqw,54px)/1 AtelierSerif,serif}.hero.fn .fn-month,.hero.fn .fn-year{font:clamp(8px,1.8cqw,15px)/1.2 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase}.hero.fn .fn-time{grid-column:1/-1;font:italic clamp(8px,1.8cqw,15px)/1.5 AtelierSerif,serif;margin-top:1cqw}.hero.fn .fn-venue{display:grid;gap:1px;max-width:80%;margin-top:2%;font:clamp(8px,1.8cqw,15px)/1.3 AtelierSerif,serif}.hero.fn .fn-address{font:clamp(7px,1.45cqw,12px)/1.35 Arial,sans-serif;opacity:.75}.hero.fn .fn-footer-copy{display:flex;gap:4cqw;max-width:90%;margin-top:2%;font:clamp(7px,1.45cqw,12px)/1.3 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase}.hero.fn .fn-rsvp{color:${v.gold}}.hero.fn .fn-editable[data-fn-field]{cursor:pointer}.hero.fn .fn-editable[data-fn-field]:hover{outline:1px dashed ${v.gold};outline-offset:3px}
@media print{.hero.fn .fn-editable[data-fn-field]{outline:0}}.hero.fn .fn-copy{color:var(--fn-ink)}.hero.fn .fn-overline,.hero.fn .fn-invite{letter-spacing:var(--fn-letter-spacing)}.hero.fn .fn-names h1{font-size:clamp(24px,var(--fn-name-size),96px)!important}.hero.fn .fn-date{color:var(--fn-ink)}
@media print{.hero.fn{min-height:0!important}}`;
  }
  const FN_DEFAULTS = {
    bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    parent1: "(D/o Mr. Bride's Father & Mrs. Bride's Mother)",
    parent2: "(S/o Mr. Groom's Father & Mrs. Groom's Mother)",
    invite: 'INVITE YOU WITH JOYFUL HEARTS TO WITNESS AND BE BLESSED ON THE AUSPICIOUS OCCASION OF OUR WEDDING',
    time: 'Nikah · After Asr',
    rsvp: 'RSVP',
    button: 'OPEN DIRECTIONS ↗',
    wishes: 'Your presence will make our day complete.'
  };
  const fnValue = (data, key) => String(data?.['fn' + key[0].toUpperCase() + key.slice(1)] ?? FN_DEFAULTS[key] ?? '');
  const fnDateParts = data => {
    const raw = String(data?.date || '');
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    if (!match) return {day: data?.fnDay || '22', month: data?.fnMonth || 'November', year: data?.fnYear || '2026', time: fnValue(data, 'time')};
    return {
      day: data?.fnDay || match[3],
      month: data?.fnMonth || months[Math.max(0, Number(match[2]) - 1)] || 'November',
      year: data?.fnYear || match[1],
      time: fnValue(data, 'time') || `${match[4]}:${match[5]}`
    };
  };
  const fnLine = (value, key, extra = '') => `<span class="fn-editable ${extra}" data-fn-field="${key}" data-edit="${key}">${esc(value)}</span>`;
  function fnHero(data, v) {
    const parts = fnDateParts(data);
    const n1 = data.name1 || 'Fathima', n2 = data.name2 || 'Nizar';
    const heading = data.heading || 'With the blessings of Allah';
    const ink = hex(data.fnTextColor) ? data.fnTextColor : v.ink;
    const nameSize = Math.max(24, Math.min(96, Number(data.fnNameSize) || 52));
    const letterSpacing = Math.max(0, Math.min(12, Number(data.fnLetterSpacing) || 2));
    return `<section id="top" class="hero fn" style="--fn-ink:${ink};--fn-name-size:${nameSize}px;--fn-letter-spacing:${letterSpacing}px" aria-label="Fathima Nizar wedding invitation">
      <div class="fn-art hero-art" aria-hidden="true"><img src="${esc(embedded[v.id] || artURL(v))}" alt=""></div>
      <div class="fn-bismillah-backdrop" aria-hidden="true"></div>
      <div class="fn-copy">
        <div class="fn-bismillah" dir="rtl">${fnLine(fnValue(data, 'bismillah'), 'fnBismillah')}</div>
        <p class="fn-overline">${fnLine(heading, 'heading')}</p>
        <div class="fn-names">
          <h1>${fnLine(n1, 'name1')}</h1>
          <div class="fn-amp" aria-hidden="true">&</div>
          <h1>${fnLine(n2, 'name2')}</h1>
        </div>
        <p class="fn-parents">${fnLine(fnValue(data, 'parent1'), 'fnParent1')}<br>${fnLine(fnValue(data, 'parent2'), 'fnParent2')}</p>
        <p class="fn-invite">${fnLine(fnValue(data, 'invite'), 'fnInvite')}</p>
        <div class="fn-date" aria-label="Wedding date">
          <span class="fn-day">${fnLine(parts.day, 'fnDay')}</span>
          <span class="fn-month">${fnLine(parts.month, 'fnMonth')}</span>
          <span class="fn-year">${fnLine(parts.year, 'fnYear')}</span>
          <span class="fn-time">${fnLine(parts.time, 'fnTime')}</span>
        </div>
        <div class="fn-venue">
          <span class="fn-venue-name">${fnLine(data.venue || 'Venue, city', 'venue')}</span>
          <span class="fn-address">${fnLine(data.address || '', 'address')}</span>
        </div>
        <div class="fn-footer-copy">
          <span>${fnLine(fnValue(data, 'wishes'), 'fnWishes')}</span>
          <span class="fn-rsvp">${fnLine(fnValue(data, 'rsvp'), 'fnRsvp')}</span>
        </div>
      </div>
    </section>`;
  }
  function fnIntroCSS(intro) {
    return `.fn-intro{background:#f3f2ef!important}.fn-intro .envelope-card{overflow:hidden}.fn-intro.intro-curtain:before,.fn-intro.intro-curtain:after{content:'';position:absolute;top:0;bottom:0;width:50%;z-index:-1;background:linear-gradient(90deg,#fff,#e8e1d7 45%,#fff);box-shadow:inset 0 0 50px #8d765333;transition:transform 1.4s cubic-bezier(.2,.75,.2,1)}.fn-intro.intro-curtain:before{left:0;transform-origin:left}.fn-intro.intro-curtain:after{right:0;transform-origin:right;background:linear-gradient(270deg,#fff,#e8e1d7 45%,#fff)}.fn-intro.intro-curtain.open:before{transform:translateX(-100%)}.fn-intro.intro-curtain.open:after{transform:translateX(100%)}.fn-intro.intro-arch .envelope-card{border:0;background:linear-gradient(#0c3d2a,#102d24);color:#f4ead4;border-radius:220px 220px 12px 12px;box-shadow:0 0 0 8px #ae945455,0 25px 80px #0005}.fn-intro.intro-arch .envelope-card:before{inset:18px;border-color:#ae9454}.fn-intro.intro-arch.open .envelope-card{transform:scale(1.12);opacity:0;transition:transform 1.1s ease,opacity .8s 1s}.fn-intro.intro-floral{background:radial-gradient(circle at 50% 40%,#fffdf8,#eee8dd)}.fn-intro.intro-floral:before{content:'✦  ❀  ✦  ❀  ✦';position:absolute;top:13%;left:0;right:0;color:#ae9454;font-size:34px;letter-spacing:18px;opacity:.7;animation:fn-floral-float 8s ease-in-out infinite}.fn-intro.intro-floral .envelope-card{background:#ffffffcc;backdrop-filter:blur(5px);border-color:#ae9454}.fn-intro.intro-floral.open .envelope-card{transform:translateY(-24px) scale(1.08);opacity:0;transition:transform 1s ease,opacity .8s}.fn-intro.intro-locket .envelope-card{background:radial-gradient(circle at 50% 35%,#fffdf5,#e8e0d4)}@keyframes fn-floral-float{50%{transform:translateY(18px) rotate(3deg)}}@media(prefers-reduced-motion:reduce){.fn-intro.intro-curtain:before,.fn-intro.intro-curtain:after,.fn-intro.intro-arch .envelope-card,.fn-intro.intro-floral .envelope-card{transition:none!important}.fn-intro.intro-floral:before{animation:none}}`;
  }
  if (typeof root.invitationDocument === 'function') {
    const prev = root.invitationDocument;
    root.invitationDocument = function (data) {
      if (!isFN(data?.template)) return prev(data);
      const v = BY[data.template];
      let html = prev({...data, template: LIVE_BASE});
      html = html.replace(/<section id="top" class="hero[^>]*>[\s\S]*?<\/section>/, fnHero(data, v));
      const n1 = String(data.name1 || 'Fathima'), n2 = String(data.name2 || 'Nizar');
      html = html.replace(/OPEN DIRECTIONS(?: ↗)?/g, esc(fnValue(data, 'button')));
      const intro = ['locket','curtain','arch','floral'].includes(data.introStyle) ? data.introStyle : 'locket';
      html = html.replace(/class="envelope" id="envelope"/, `class="envelope fn-intro intro-${intro}" id="envelope"`);
      if (intro === 'locket' && !html.includes('locket-half')) {
        html = html.replace(`class="envelope fn-intro intro-${intro}"`, `class="envelope fn-intro intro-${intro} locket-opening"`)
          .replace('aria-label="Open wedding invitation">&</button>', `aria-label="Open wedding locket"><span class="locket-half left">${esc(n1[0] || 'A')}</span><span class="locket-half right">${esc(n2[0] || 'F')}</span></button>`)
          .replace('TOUCH THE SEAL TO OPEN', 'TOUCH THE LOCKET TO OPEN');
      }
      if (data.openingStyle === 'none') html = html.replace(/<div class="envelope[^>]*id="envelope"[\s\S]*?<\/script>/, '');
      const sections = data.fnSections || {};
      const hidden = ['countdown','gallery','schedule','music','wishes'].filter(key => sections[key] === false).map(key => `fn-hide-${key}`).join(' ');
      if (hidden) html = html.replace('<body>', `<body class="${hidden}">`);
      const sectionCSS = hidden ? `<style>.fn-hide-countdown #countdown,.fn-hide-countdown #countdown-note{display:none!important}.fn-hide-gallery #gallery{display:none!important}.fn-hide-schedule .events-card{display:none!important}.fn-hide-music .music{display:none!important}.fn-hide-wishes .end{display:none!important}</style>` : '';
      return html.replace('</head>', `<style>${liveCSS(v, n1, n2)}${fnIntroCSS(intro)}</style>${sectionCSS}</head>`);
    };
  }

  // ---------- editors ----------
  if (!inBrowser) return;
  const css = `.fn-block{margin:18px 0 6px;padding:14px 0;border-top:1px solid #b49b6744}.fn-block h3{margin:0 0 4px;font:26px AtelierSerif,Georgia,serif;color:#f5e6c9}.fn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-top:12px}.fn-tile{background:#17222a;border:1px solid #35434c;border-radius:8px;overflow:hidden}.fn-tile.selected{outline:2px solid #d3b47a}.fn-thumb{cursor:pointer;aspect-ratio:5/7;overflow:hidden}.fn-thumb svg{display:block;width:100%;height:100%}.fn-tile footer{padding:9px}.fn-tile strong{display:block;font:15px AtelierSerif,Georgia,serif;line-height:1.2}.fn-tile small{display:block;font-size:10px;color:#9dabb7;margin:3px 0 8px}.fn-actions{display:flex;gap:5px}.fn-actions button{flex:1;font-size:11px;padding:8px 3px}`;
  const select = document.getElementById('live-preset');
  const FN_EDITOR_FIELDS = ['fnBismillah','fnParent1','fnParent2','fnInvite','fnDay','fnMonth','fnYear','fnTime','fnRsvp','fnButton','fnWishes'];
  const fnEditorDefaults = {
    fnBismillah: FN_DEFAULTS.bismillah, fnParent1: FN_DEFAULTS.parent1, fnParent2: FN_DEFAULTS.parent2,
    fnInvite: FN_DEFAULTS.invite, fnDay: '22', fnMonth: 'November', fnYear: '2026', fnTime: FN_DEFAULTS.time,
    fnRsvp: FN_DEFAULTS.rsvp, fnButton: FN_DEFAULTS.button, fnWishes: FN_DEFAULTS.wishes
  };
  function fnFieldsVisible() {
    const id = select?.value || document.getElementById('design-title')?.dataset.template || '';
    return isFN(id);
  }
  function ensureLiveFathimaFields() {
    if (!select || document.getElementById('fn-live-fields')) return;
    const box = document.createElement('section');
    box.id = 'fn-live-fields';
    box.className = 'panel fn-live-fields';
    box.innerHTML = `<h2>Fathima Nizar · Editable invitation layers</h2>
      <p class="help">Every line in the floral arch is independent. Changes appear in the preview immediately; the artwork, flowers and illustrated couple remain responsive.</p>
      <div class="field-grid">
        <label class="wide">Arabic Bismillah<input id="fnBismillah" maxlength="180"></label>
        <label>Bride's parents<input id="fnParent1" maxlength="180"></label>
        <label>Groom's parents<input id="fnParent2" maxlength="180"></label>
        <label class="wide">Invitation wording<textarea id="fnInvite" maxlength="500"></textarea></label>
        <label>Day<input id="fnDay" maxlength="2" inputmode="numeric"></label>
        <label>Month<input id="fnMonth" maxlength="20"></label>
        <label>Year<input id="fnYear" maxlength="4" inputmode="numeric"></label>
        <label>Nikah / event time<input id="fnTime" maxlength="100"></label>
        <label>RSVP text<input id="fnRsvp" maxlength="140"></label>
        <label>Button text<input id="fnButton" maxlength="80"></label>
        <label class="wide">Wishes / footer line<input id="fnWishes" maxlength="180"></label>
        <label>Intro animation<select id="intro-style"><option value="locket">Luxury locket</option><option value="curtain">White curtains</option><option value="arch">Royal arch</option><option value="floral">Floral reveal</option></select></label>
        <label>Name size<input id="fn-name-size" type="range" min="24" max="96" value="52"><output id="fn-name-size-value">52px</output></label>
        <label>Text colour<input id="fn-text-color" type="color" value="#0d2f22"></label>
        <label>Letter spacing<input id="fn-letter-spacing" type="range" min="0" max="12" step=".1" value="2"><output id="fn-letter-spacing-value">2px</output></label>
      </div>
      <fieldset class="fn-sections"><legend>Live sections</legend><label><input id="fn-section-countdown" type="checkbox" checked> Countdown</label><label><input id="fn-section-gallery" type="checkbox" checked> Gallery</label><label><input id="fn-section-schedule" type="checkbox" checked> Events</label><label><input id="fn-section-music" type="checkbox" checked> Music</label><label><input id="fn-section-wishes" type="checkbox" checked> Wishes</label></fieldset>`;
    select.closest('.panel').after(box);
    for (const key of FN_EDITOR_FIELDS) {
      const el = document.getElementById(key);
      if (el) el.value = fnEditorDefaults[key];
    }
    const syncRange = (id, output, suffix) => {
      const el = document.getElementById(id), out = document.getElementById(output);
      el?.addEventListener('input', () => { if (out) out.value = `${el.value}${suffix}`; markDirty(); });
    };
    syncRange('fn-name-size', 'fn-name-size-value', 'px');
    syncRange('fn-letter-spacing', 'fn-letter-spacing-value', 'px');
    box.querySelectorAll('input,textarea,select').forEach(el => el.addEventListener('input', markDirty));
    box.querySelectorAll('select').forEach(el => el.addEventListener('change', markDirty));
    box.hidden = true;
  }
  function setFathimaFields(data = {}) {
    ensureLiveFathimaFields();
    for (const key of FN_EDITOR_FIELDS) {
      const el = document.getElementById(key);
      if (el) el.value = data[key] ?? fnEditorDefaults[key];
    }
    const intro = document.getElementById('intro-style');
    if (intro) intro.value = data.introStyle || 'locket';
    const size = document.getElementById('fn-name-size');
    if (size) { size.value = data.fnNameSize || 52; document.getElementById('fn-name-size-value').value = `${size.value}px`; }
    const color = document.getElementById('fn-text-color');
    if (color) color.value = data.fnTextColor || '#0d2f22';
    for (const key of ['countdown','gallery','schedule','music','wishes']) {
      const el = document.getElementById(`fn-section-${key}`);
      if (el) el.checked = data.fnSections?.[key] !== false;
    }
    const box = document.getElementById('fn-live-fields');
    if (box) box.hidden = !fnFieldsVisible();
  }
  root.collectFathimaFields = () => {
    if (!fnFieldsVisible()) return {};
    const out = {};
    for (const key of FN_EDITOR_FIELDS) out[key] = document.getElementById(key)?.value || '';
    out.fnNameSize = Number(document.getElementById('fn-name-size')?.value || 52);
    out.fnTextColor = document.getElementById('fn-text-color')?.value || '';
    out.fnLetterSpacing = Number(document.getElementById('fn-letter-spacing')?.value || 2);
    out.fnSections = Object.fromEntries(['countdown','gallery','schedule','music','wishes'].map(key => [key, document.getElementById(`fn-section-${key}`)?.checked !== false]));
    return out;
  };
  root.loadFathimaFields = setFathimaFields;
  if (select) { ensureLiveFathimaFields(); setFathimaFields(); }
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
      use.onclick = () => { select.value = v.id; document.getElementById('theme').value = 'ivory'; setFathimaFields(); markDirty(); mark(); };
      thumb.onclick = peek.onclick;
      actions.append(peek, use); footer.append(actions); tile.append(thumb, footer);
      block.querySelector('.fn-grid').append(tile);
      tiles.push([v.id, tile]);
    }
    select.addEventListener('change', () => { mark(); setFathimaFields(); });
    mark();
    setFathimaFields();
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
