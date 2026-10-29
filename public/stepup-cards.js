/*
 * Mubiey Studio - Step Up card library
 * 5 original invitation card designs (600 x 900 px native size).
 * Every design is drawn in code (SVG + HTML). No reference-image text, names,
 * monograms or watermarks are used anywhere. All text comes from the data object.
 *
 * Usage:
 *   StepUpCards.mount(element, 'pearl', data)     // renders a card into element
 *   StepUpCards.render('navy', data)              // returns HTML string
 *   StepUpCards.themes                            // list of {id, name}
 */
(function (global) {
  'use strict';

  var W = 600, H = 900;

  var DEFAULTS = {
    arabic: '\u0628\u0650\u0633\u0652\u0645\u0650 \u0671\u0644\u0644\u0651\u064E\u0647\u0650 \u0671\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0670\u0646\u0650 \u0671\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650',
    showArabic: true,
    intro: 'You are cordially invited to the wedding of',
    quote: 'In the name of Allah, the Most Gracious, the Most Merciful',
    bride: 'Bride Name',
    groom: 'Groom Name',
    brideParents: 'Daughter of Mr. & Mrs. Father Name',
    groomParents: 'Son of Mr. & Mrs. Father Name',
    tagline: 'Two hearts, one journey',
    day: 'Sunday',
    date: '26',
    month: 'October',
    year: '2026',
    time: '11:00 AM',
    venue: 'Venue Name',
    address: 'Venue address, City',
    closing: 'Your presence and duas will make this day special',
    rsvp: 'RSVP: +000 0000 0000',
    from: '',
    events: [
      { t: 'Nikah', v: '10:00 AM' },
      { t: 'Reception', v: '06:00 PM' },
      { t: 'Dinner', v: '08:00 PM' }
    ]
  };

  var THEMES = [
    { id: 'pearl',  name: 'Pearl Emboss' },
    { id: 'blush',  name: 'Burgundy Blush' },
    { id: 'navy',   name: 'Royal Navy' },
    { id: 'maroon', name: 'Maroon & Gold' },
    { id: 'candle', name: 'Candlelit Drapes' }
  ];

  /* ---------- helpers ---------- */
  var uid = 0;
  function nid(p) { uid += 1; return (p || 'g') + uid; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hex(c) {
    c = c.replace('#', '');
    if (c.length === 3) c = c.split('').map(function (x) { return x + x; }).join('');
    return [parseInt(c.substr(0, 2), 16), parseInt(c.substr(2, 2), 16), parseInt(c.substr(4, 2), 16)];
  }
  function mix(c, t, a) {
    var x = hex(c), y = hex(t);
    return 'rgb(' + Math.round(x[0] + (y[0] - x[0]) * a) + ',' + Math.round(x[1] + (y[1] - x[1]) * a) + ',' + Math.round(x[2] + (y[2] - x[2]) * a) + ')';
  }
  function lighten(c, a) { return mix(c, '#ffffff', a); }
  function darken(c, a) { return mix(c, '#000000', a); }

  function initials(d) {
    var a = (String(d.bride || 'B').trim().charAt(0) || 'B').toUpperCase();
    var b = (String(d.groom || 'G').trim().charAt(0) || 'G').toUpperCase();
    return [a, b];
  }
  function merge(d) {
    var o = {}, k;
    for (k in DEFAULTS) o[k] = DEFAULTS[k];
    if (d) for (k in d) if (d[k] !== undefined && d[k] !== null) o[k] = d[k];
    if (!o.events || !o.events.length) o.events = DEFAULTS.events;
    return o;
  }

  /* ---------- flower drawing (SVG strings) ---------- */
  function gradDef(id, c) {
    return '<radialGradient id="' + id + '" cx="38%" cy="32%" r="80%">' +
      '<stop offset="0" stop-color="' + lighten(c, 0.38) + '"/>' +
      '<stop offset=".55" stop-color="' + c + '"/>' +
      '<stop offset="1" stop-color="' + darken(c, 0.38) + '"/></radialGradient>';
  }
  function rose(x, y, r, gid, c, rot) {
    var s = '', i, a, px, py;
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.98) + '" fill="' + darken(c, 0.35) + '"/>';
    for (i = 0; i < 6; i++) {
      a = (rot + i * 60) * Math.PI / 180;
      px = x + Math.cos(a) * r * 0.46; py = y + Math.sin(a) * r * 0.46;
      s += '<ellipse cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" rx="' + (r * 0.5).toFixed(1) + '" ry="' + (r * 0.58).toFixed(1) +
        '" transform="rotate(' + (rot + i * 60 + 90) + ' ' + px.toFixed(1) + ' ' + py.toFixed(1) + ')" fill="url(#' + gid + ')" stroke="' + darken(c, 0.45) + '" stroke-opacity=".45" stroke-width="' + Math.max(0.4, r * 0.025).toFixed(2) + '"/>';
    }
    for (i = 0; i < 4; i++) {
      a = (rot + 30 + i * 90) * Math.PI / 180;
      px = x + Math.cos(a) * r * 0.22; py = y + Math.sin(a) * r * 0.22;
      s += '<ellipse cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" rx="' + (r * 0.33).toFixed(1) + '" ry="' + (r * 0.38).toFixed(1) +
        '" transform="rotate(' + (rot + 30 + i * 90 + 90) + ' ' + px.toFixed(1) + ' ' + py.toFixed(1) + ')" fill="url(#' + gid + ')" stroke="' + darken(c, 0.5) + '" stroke-opacity=".5" stroke-width="' + Math.max(0.4, r * 0.02).toFixed(2) + '"/>';
    }
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.17).toFixed(1) + '" fill="' + darken(c, 0.3) + '"/>';
    s += '<path d="M' + (x - r * 0.12) + ' ' + y + ' q' + (r * 0.12) + ' ' + (-r * 0.18) + ' ' + (r * 0.24) + ' 0" fill="none" stroke="' + lighten(c, 0.35) + '" stroke-width="' + Math.max(0.5, r * 0.025).toFixed(2) + '" opacity=".7"/>';
    return s;
  }
  function leaf(x, y, len, ang, col, vein) {
    var w = len * 0.3;
    return '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')">' +
      '<path d="M0 0 Q' + (len * 0.5).toFixed(1) + ' ' + (-w).toFixed(1) + ' ' + len.toFixed(1) + ' 0 Q' + (len * 0.5).toFixed(1) + ' ' + w.toFixed(1) + ' 0 0Z" fill="' + col + '"/>' +
      '<path d="M0 0 L' + (len * 0.92).toFixed(1) + ' 0" stroke="' + (vein || 'rgba(255,255,255,.35)') + '" stroke-width="' + Math.max(0.4, len * 0.012).toFixed(2) + '"/></g>';
  }
  function sprig(x, y, len, ang, col) {
    var s = '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')">' +
      '<path d="M0 0 Q' + (len * 0.5) + ' ' + (-len * 0.12) + ' ' + len + ' 0" fill="none" stroke="' + col + '" stroke-width="1.4"/>';
    for (var i = 1; i <= 5; i++) {
      var t = i / 6, px = len * t, py = -len * 0.12 * 2 * t * (1 - t) * 1.0;
      s += '<path d="M' + px.toFixed(1) + ' ' + py.toFixed(1) + ' q' + (len * 0.05) + ' ' + (-len * 0.1) + ' ' + (len * 0.11) + ' ' + (-len * 0.12) + ' q' + (-len * 0.01) + ' ' + (len * 0.08) + ' ' + (-len * 0.11) + ' ' + (len * 0.12) + 'Z" fill="' + col + '"/>';
      s += '<path d="M' + px.toFixed(1) + ' ' + py.toFixed(1) + ' q' + (len * 0.05) + ' ' + (len * 0.1) + ' ' + (len * 0.11) + ' ' + (len * 0.12) + ' q' + (-len * 0.01) + ' ' + (-len * 0.08) + ' ' + (-len * 0.11) + ' ' + (-len * 0.12) + 'Z" fill="' + col + '" opacity=".85"/>';
    }
    return s + '</g>';
  }
  /* a cluster of roses with leaves, buds and gold sprigs */
  function cluster(cx, cy, size, seed, pal, opt) {
    opt = opt || {};
    var R = rng(seed), s = '', defs = '', i, ids = [];
    for (i = 0; i < pal.length; i++) { ids.push(nid('rg')); defs += gradDef(ids[i], pal[i]); }
    var n = opt.count || 5, spread = size * (opt.spread || 0.9);
    // leaves behind
    var leafCol = opt.leaf || '#5d6f58';
    for (i = 0; i < (opt.leaves || 9); i++) {
      var la = R() * 360;
      s += leaf(cx + (R() - 0.5) * spread * 0.5, cy + (R() - 0.5) * spread * 0.5, size * (0.55 + R() * 0.45), la, i % 2 ? leafCol : darken(leafCol, 0.18));
    }
    if (opt.gold) {
      for (i = 0; i < 4; i++) s += sprig(cx + (R() - 0.5) * spread * 0.4, cy + (R() - 0.5) * spread * 0.4, size * (1.1 + R() * 0.7), R() * 360, opt.gold);
    }
    for (i = 0; i < n; i++) {
      var ang = (i / n) * Math.PI * 2 + R();
      var dist = i === 0 ? 0 : spread * (0.28 + R() * 0.3);
      var rr = size * (i === 0 ? 0.5 : 0.3 + R() * 0.2);
      s += rose(cx + Math.cos(ang) * dist, cy + Math.sin(ang) * dist * 0.85, rr, ids[i % ids.length], pal[i % pal.length], R() * 360);
    }
    for (i = 0; i < (opt.buds || 5); i++) {
      var ba = R() * Math.PI * 2, bd = spread * (0.55 + R() * 0.35);
      s += '<circle cx="' + (cx + Math.cos(ba) * bd).toFixed(1) + '" cy="' + (cy + Math.sin(ba) * bd).toFixed(1) + '" r="' + (size * 0.06).toFixed(1) + '" fill="' + (opt.bud || lighten(pal[0], 0.6)) + '"/>';
    }
    return { defs: defs, body: s };
  }
  function anemone(x, y, r, c, centre, rot) {
    var s = '', i, a, px, py, gid = nid('an');
    var defs = '<radialGradient id="' + gid + '" cx="50%" cy="60%" r="70%"><stop offset="0" stop-color="' + darken(c, 0.12) + '"/><stop offset=".6" stop-color="' + c + '"/><stop offset="1" stop-color="' + lighten(c, 0.25) + '"/></radialGradient>';
    for (i = 0; i < 7; i++) {
      a = (rot + i * (360 / 7)) * Math.PI / 180;
      px = x + Math.cos(a) * r * 0.5; py = y + Math.sin(a) * r * 0.5;
      s += '<ellipse cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" rx="' + (r * 0.5).toFixed(1) + '" ry="' + (r * 0.58).toFixed(1) +
        '" transform="rotate(' + (rot + i * (360 / 7) + 90) + ' ' + px.toFixed(1) + ' ' + py.toFixed(1) + ')" fill="url(#' + gid + ')" stroke="' + darken(c, 0.25) + '" stroke-opacity=".35" stroke-width=".7"/>';
    }
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.24).toFixed(1) + '" fill="' + centre + '"/>';
    for (i = 0; i < 14; i++) {
      a = i * 0.45;
      s += '<circle cx="' + (x + Math.cos(a) * r * 0.2).toFixed(1) + '" cy="' + (y + Math.sin(a) * r * 0.2).toFixed(1) + '" r="' + (r * 0.025).toFixed(2) + '" fill="#d8c48a"/>';
    }
    return { defs: defs, body: s };
  }
  function babysBreath(cx, cy, size, seed, col) {
    var R = rng(seed), s = '', i;
    for (i = 0; i < 26; i++) {
      var a = R() * Math.PI * 2, d = R() * size;
      var x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (1.4 + R() * 2.4).toFixed(1) + '" fill="' + col + '" opacity="' + (0.7 + R() * 0.3).toFixed(2) + '"/>';
    }
    return s;
  }

  /* shared small icons (stroke, currentColor) */
  var ICON = {
    cal: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="9" width="28" height="25" rx="3"/><path d="M6 16h28M13 5v7M27 5v7"/><path d="M20 29s-6-3.6-6-7.4a3.3 3.3 0 0 1 6-1.7 3.3 3.3 0 0 1 6 1.7c0 3.8-6 7.4-6 7.4z" stroke-width="1.6"/></svg>',
    clock: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="14"/><path d="M20 11v9l6 4"/></svg>',
    pin: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 35s11-10.2 11-19a11 11 0 0 0-22 0c0 8.8 11 19 11 19z"/><circle cx="20" cy="16" r="4"/></svg>',
    rings: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="25" r="9"/><circle cx="25" cy="25" r="9"/><path d="M12 11l3-4h4l3 4-5 5z" stroke-width="1.6"/></svg>',
    bouquet: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="14" cy="13" r="4.5"/><circle cx="24" cy="11" r="4.5"/><circle cx="20" cy="19" r="4.5"/><path d="M20 23.5L16 35M20 23.5L24 35M16 35h8"/></svg>',
    plate: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="9"/><circle cx="20" cy="20" r="5.5"/><path d="M7 6v10a3 3 0 0 0 3 3v15M34 6c-2 3-3 6-3 10 0 2 1 3 3 3v15"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.6A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/></svg>'
  };
  function eventIcon(t) {
    t = String(t || '').toLowerCase();
    if (/nikah|nikkah|ring|engage|wedding|ceremony/.test(t)) return ICON.rings;
    if (/recep|party|walima|walimah/.test(t)) return ICON.bouquet;
    if (/dinner|lunch|food|feast|meal/.test(t)) return ICON.plate;
    if (/venue|place|where/.test(t)) return ICON.pin;
    return ICON.clock;
  }

  /* ---------- shared css ---------- */
  var CSS = '' +
    '.sc{position:relative;width:600px;height:900px;overflow:hidden;box-sizing:border-box;color:#3a2c2c;font-family:AtelierSerif,"Cormorant Garamond","Cormorant",Georgia,"Times New Roman",serif;-webkit-font-smoothing:antialiased}' +
    '.sc *{box-sizing:border-box}' +
    '.sc .bg{position:absolute;left:0;top:0;width:600px;height:900px}' +
    '.sc .t{position:absolute;left:0;width:600px;text-align:center;line-height:1.15;white-space:nowrap}' +
    '.sc .t.wrap{white-space:normal}' +
    '.sc .ar{font-family:AtelierAmiri,"Amiri","Aref Ruqaa","Noto Naskh Arabic","Traditional Arabic",serif;direction:rtl;line-height:1.5}' +
    '.sc .sc-script{font-family:AtelierScript,"Great Vibes","Allura","Alex Brush","Brush Script MT",cursive;font-weight:400}' +
    '.sc .caps{text-transform:uppercase;letter-spacing:.2em}' +
    '.sc .cap-serif{font-family:AtelierCinzel,"Cinzel","Cormorant SC","Cormorant Garamond",Georgia,serif;text-transform:uppercase}' +
    '.sc .fit{display:inline-block;max-width:100%}' +
    '.sc .box{position:absolute}' +
    '.sc svg.ic{display:block}';

  function injectCss() {
    if (typeof document === 'undefined' || document.getElementById('stepup-cards-css')) return;
    var st = document.createElement('style');
    st.id = 'stepup-cards-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function txt(cls, top, size, html, extra) {
    return '<div class="t ' + cls + '" style="top:' + top + 'px;font-size:' + size + 'px;' + (extra || '') + '">' + html + '</div>';
  }
  function fitTxt(cls, top, size, str, extra, minSize, maxW) {
    return '<div class="t ' + cls + '" style="top:' + top + 'px;font-size:' + size + 'px;' + (extra || '') + '"><span class="fit" data-fit="' + (maxW || 500) + '" data-min="' + (minSize || 18) + '">' + esc(str) + '</span></div>';
  }
  function arabicBlock(d, top, size, color, extra, maxW) {
    if (!d.showArabic || !d.arabic) return '';
    return '<div class="t ar" style="top:' + top + 'px;font-size:' + size + 'px;color:' + color + ';' + (extra || '') + '"><span class="fit" data-fit="' + (maxW || 440) + '" data-min="18">' + esc(d.arabic) + '</span></div>';
  }
  function goldGrad(id) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8d6a26"/><stop offset=".3" stop-color="#e6c677"/><stop offset=".55" stop-color="#b98b3a"/><stop offset=".8" stop-color="#f1dba0"/><stop offset="1" stop-color="#9a7430"/></linearGradient>';
  }
  function paper(id, op) {
    return '<filter id="' + id + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .45  0 0 0 0 .38  0 0 0 0 .32  0 0 0 ' + (op || 0.5) + ' 0"/></filter>';
  }
  function watercolor(seed, cols, n, rmin, rmax, w, h, blur) {
    var R = rng(seed), s = '', i, fid = nid('wb');
    s += '<defs><filter id="' + fid + '" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="' + blur + '"/></filter></defs><g filter="url(#' + fid + ')">';
    for (i = 0; i < n; i++) {
      s += '<circle cx="' + (R() * w).toFixed(0) + '" cy="' + (R() * h).toFixed(0) + '" r="' + (rmin + R() * (rmax - rmin)).toFixed(0) + '" fill="' + cols[i % cols.length] + '" opacity="' + (0.25 + R() * 0.4).toFixed(2) + '"/>';
    }
    return s + '</g>';
  }
  function dateBlock(d, top, o) {
    // three column block: day | month / date / year | time, with hairlines
    var c = o.color, line = o.line || c, big = o.big || 56;
    var s = '';
    s += '<div class="box" style="left:62px;top:' + top + 'px;width:476px;height:' + (big + 62) + 'px">';
    s += '<div style="position:absolute;left:176px;top:0;bottom:0;width:1px;background:' + line + ';opacity:.8"></div>';
    s += '<div style="position:absolute;left:300px;top:0;bottom:0;width:1px;background:' + line + ';opacity:.8"></div>';
    s += '<div style="position:absolute;left:0;top:50%;width:150px;transform:translateY(-50%);text-align:center;border-top:1px solid ' + line + ';border-bottom:1px solid ' + line + ';padding:9px 0;color:' + c + ';font-size:17px" class="caps">' + esc(d.day) + '</div>';
    s += '<div style="position:absolute;left:176px;top:0;width:124px;height:100%;text-align:center;color:' + c + ';display:flex;flex-direction:column;justify-content:space-between;align-items:center;padding:3px 0">' +
      '<div class="caps" style="font-size:15px;letter-spacing:.28em">' + esc(d.month) + '</div>' +
      '<div style="font-size:' + big + 'px;font-weight:600;line-height:1;' + (o.dateFont || '') + '">' + esc(d.date) + '</div>' +
      '<div class="caps" style="font-size:15px;letter-spacing:.28em">' + esc(d.year) + '</div></div>';
    s += '<div style="position:absolute;left:326px;top:50%;width:150px;transform:translateY(-50%);text-align:center;border-top:1px solid ' + line + ';border-bottom:1px solid ' + line + ';padding:9px 0;color:' + c + ';font-size:17px" class="caps">' + esc(d.time) + '</div>';
    s += '</div>';
    return s;
  }

  /* ================= THEME 1 : PEARL EMBOSS ================= */
  function pearl(d) {
    var ini = initials(d), g = nid('gold'), pf = nid('pap'), sh = nid('emb');
    var gold = '#a9812f';
    var s = '<div class="sc" style="background:#f3efe9">';
    s += '<svg class="bg" viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg"><defs>' + goldGrad(g) + paper(pf, 0.55) +
      '<filter id="' + sh + '" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="2" dy="2.5" stdDeviation="1.6" flood-color="#7c6a5a" flood-opacity=".38"/></filter>' +
      '<linearGradient id="pv' + pf + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf9f5"/><stop offset="1" stop-color="#ece6dd"/></linearGradient></defs>';
    s += '<rect width="600" height="900" fill="url(#pv' + pf + ')"/><rect width="600" height="900" filter="url(#' + pf + ')" opacity=".55"/>';
    // embossed line-art florals (white line with soft shadow) top-right and bottom-left
    var emb = function (x, y, sc, rot) {
      var p = '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')" fill="none" stroke="#fffdfa" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#' + sh + ')">';
      p += '<path d="M0 0c-18-30-6-62 24-70 24 14 34 44 12 72-14 4-26 2-36-2z"/>';
      p += '<path d="M-6-8c-6-18 2-38 22-46M18-6c14-16 14-36 4-52M6 0c0-20 8-40 22-54"/>';
      p += '<path d="M-30 12c-20-20-12-48 12-56 14 10 20 30 8 52"/>';
      p += '<path d="M30 8c24-10 50-2 54 26-18 14-40 12-54-6"/>';
      p += '<path d="M0 6c-4 40 6 90 40 140"/><path d="M20 70c24-8 40-30 36-50-24 2-38 20-36 50z"/><path d="M14 110c-26-4-44-22-44-46 26 4 42 20 44 46z"/>';
      p += '</g>';
      return p;
    };
    s += emb(548, 96, 0.8, 24) + emb(34, 760, 1.05, -160) + emb(574, 640, 0.6, 30);
    // thin gold double hairline frame
    s += '<rect x="24" y="24" width="552" height="852" fill="none" stroke="url(#' + g + ')" stroke-width="1.2" opacity=".75"/>';
    s += '<rect x="32" y="32" width="536" height="836" fill="none" stroke="url(#' + g + ')" stroke-width=".6" opacity=".6"/>';
    s += '</svg>';
    s += arabicBlock(d, 66, 40, gold);
    // monogram
    s += '<div class="t sc-script" style="top:' + (d.showArabic ? 128 : 96) + 'px;font-size:104px;line-height:1;background:linear-gradient(120deg,#8d6a26,#e8cd85 35%,#b3873a 60%,#f0dca4 85%,#9a7430);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;filter:drop-shadow(1px 1.5px 1px rgba(90,70,40,.35))">' +
      esc(ini[0]) + '<span style="font-size:46px;padding:0 8px">&amp;</span>' + esc(ini[1]) + '</div>';
    s += txt('caps', 306, 14, esc(d.intro), 'color:#5b4a46;letter-spacing:.24em');
    s += fitTxt('cap-serif', 350, 33, d.bride + '  \u00B7  ' + d.groom, 'color:#3b2c2c;letter-spacing:.14em;font-weight:600', 20, 520);
    s += txt('wrap', 404, 15, esc(d.tagline), 'color:#6a5853;letter-spacing:.1em;font-style:italic;font-size:18px');
    s += dateBlock(d, 468, { color: '#4a3a38', line: '#4a3a38', big: 60 });
    s += txt('caps', 618, 15, esc(d.venue), 'color:#3b2c2c;letter-spacing:.22em;font-weight:700');
    s += txt('wrap', 648, 16, esc(d.address), 'color:#5b4a46;letter-spacing:.06em');
    s += '<div class="t sc-script" style="top:722px;font-size:30px;color:#3b2c2c;white-space:normal;padding:0 70px;line-height:1.25">' + esc(d.closing) + '</div>';
    s += txt('caps', 806, 13, esc(d.rsvp), 'color:#6a5853;letter-spacing:.2em');
    if (d.from) s += txt('', 836, 20, 'With best wishes, ' + esc(d.from), 'color:#6a5853;font-style:italic');
    s += '<div class="box" style="left:285px;top:864px;width:30px;height:2px;background:linear-gradient(90deg,transparent,' + gold + ',transparent)"></div>';
    s += '</div>';
    return s;
  }

  /* ================= THEME 2 : BURGUNDY BLUSH ================= */
  function blush(d) {
    var ini = initials(d), g = nid('gold'), wine = '#6f1431';
    var s = '<div class="sc" style="background:#fbf6f6">';
    var f1 = cluster(78, 560, 74, 11, ['#d9457a', '#b72361', '#e8789d', '#f0a3bb'], { count: 7, spread: 1.1, leaves: 10, gold: '#caa66a', leaf: '#8c3a4a', buds: 8 });
    var f2 = cluster(60, 840, 70, 23, ['#d9457a', '#e8789d', '#b72361'], { count: 6, spread: 1.1, leaves: 8, gold: '#caa66a', leaf: '#8c3a4a', buds: 6 });
    var f3 = cluster(70, 150, 38, 31, ['#e8789d', '#d9457a', '#f0a3bb'], { count: 4, spread: 1.0, leaves: 5, gold: '#caa66a', leaf: '#8c3a4a', buds: 4 });
    s += '<svg class="bg" viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg"><defs>' + goldGrad(g) +
      '<linearGradient id="bd' + g + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5c1029"/><stop offset=".7" stop-color="#7a1636"/><stop offset="1" stop-color="#8a2a47"/></linearGradient>' +
      '<linearGradient id="bf' + g + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>' +
      f1.defs + f2.defs + f3.defs + '</defs>';
    s += '<rect width="600" height="900" fill="#fbf4f3"/>';
    s += watercolor(7, ['#f3c9d3', '#f7dde3', '#ecb6c4', '#fff'], 12, 70, 160, 600, 900, 36);
    s += '<rect x="0" y="0" width="128" height="900" fill="url(#bd' + g + ')"/>';
    s += '<rect x="128" y="0" width="34" height="900" fill="url(#bf' + g + ')"/>';
    s += f3.body + f1.body + f2.body;
    s += '</svg>';
    // tilted mini save-the-date card
    s += '<div class="box" style="left:44px;top:34px;width:152px;height:248px;transform:rotate(-4deg);background:linear-gradient(160deg,#ffffff,#f1ebe9);box-shadow:0 8px 20px rgba(60,10,25,.28);text-align:center;color:#3a2c2c">' +
      '<div class="sc-script" style="font-size:36px;color:#c4243a;margin-top:14px;line-height:1">Save</div>' +
      '<div class="sc-script" style="font-size:36px;color:#c4243a;margin-top:-6px;line-height:1">the Date</div>' +
      '<div class="sc-script" style="font-size:54px;margin-top:6px;line-height:1;background:linear-gradient(120deg,#8d6a26,#e8cd85 40%,#a9812f 70%,#f0dca4);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent">' + esc(ini[0]) + esc(ini[1]) + '</div>' +
      '<div class="caps" style="font-size:13px;letter-spacing:.2em;margin-top:6px">' + esc(d.day) + '</div>' +
      '<div style="font-size:21px;margin-top:2px;letter-spacing:.06em"><span style="font-size:13px" class="caps">' + esc(String(d.month).slice(0, 3)) + '</span> | <b style="font-size:26px">' + esc(d.date) + '</b> | <span style="font-size:15px">' + esc(d.year) + '</span></div>' +
      '<div class="caps" style="font-size:11px;letter-spacing:.14em;margin-top:8px;padding:0 6px;line-height:1.35;white-space:normal">' + esc(d.time) + '<br>' + esc(d.venue) + '</div></div>';
    // monogram top-right
    s += '<div class="box sc-script" style="right:32px;top:30px;font-size:50px;line-height:1;background:linear-gradient(120deg,#8d6a26,#e8cd85 40%,#a9812f 70%,#f0dca4);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent">' + esc(ini[0]) + esc(ini[1]) + '</div>';
    // right-hand column text (centre x = 372, width 380)
    var cx = 'left:182px;width:380px;';
    var T = function (top, size, html, style, cls) { return '<div class="t ' + (cls || '') + '" style="' + cx + 'top:' + top + 'px;font-size:' + size + 'px;' + (style || '') + '">' + html + '</div>'; };
    var Tf = function (top, size, str, style, cls, min) { return '<div class="t ' + (cls || '') + '" style="' + cx + 'top:' + top + 'px;font-size:' + size + 'px;' + (style || '') + '"><span class="fit" data-fit="370" data-min="' + (min || 16) + '">' + esc(str) + '</span></div>'; };
    if (d.showArabic && d.arabic) s += '<div class="t ar" style="' + cx + 'top:92px;font-size:46px;color:#1d1512"><span class="fit" data-fit="340" data-min="20">' + esc(d.arabic) + '</span></div>';
    s += T(188, 15, '&ldquo;' + esc(d.quote) + '&rdquo;', 'white-space:normal;padding:0 20px;font-weight:600;line-height:1.3;color:#2b1d1d');
    s += T(252, 19, esc(d.groomParents), 'white-space:normal;padding:0 8px;line-height:1.3;color:#2b1d1d;font-weight:600');
    s += T(332, 18, esc(d.intro), 'white-space:normal;padding:0 10px;line-height:1.3;color:#2b1d1d');
    s += Tf(384, 52, d.groom, 'color:' + wine + ';line-height:1.05', 'sc-script', 24);
    s += T(446, 40, '&amp;', 'color:' + wine, 'sc-script');
    s += Tf(494, 52, d.bride, 'color:' + wine + ';line-height:1.05', 'sc-script', 24);
    s += T(574, 18, esc(d.brideParents), 'white-space:normal;padding:0 8px;line-height:1.3;color:#2b1d1d;font-weight:600');
    // date block (shifted into right column)
    s += '<div class="box" style="left:182px;top:652px;width:380px;height:96px;color:#2b1d1d">' +
      '<div style="position:absolute;left:122px;top:0;bottom:0;width:1px;background:#2b1d1d"></div>' +
      '<div style="position:absolute;left:258px;top:0;bottom:0;width:1px;background:#2b1d1d"></div>' +
      '<div class="caps" style="position:absolute;left:0;top:50%;width:108px;transform:translateY(-50%);text-align:center;border-top:1px solid #2b1d1d;border-bottom:1px solid #2b1d1d;padding:7px 0;font-size:14px;letter-spacing:.16em">' + esc(d.day) + '</div>' +
      '<div style="position:absolute;left:122px;top:0;width:136px;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:2px 0;text-align:center"><div class="caps" style="font-size:14px;letter-spacing:.3em">' + esc(d.month) + '</div><div style="font-size:50px;font-weight:700;line-height:1;letter-spacing:.1em">' + esc(d.date) + '</div><div class="caps" style="font-size:14px;letter-spacing:.3em">' + esc(d.year) + '</div></div>' +
      '<div class="caps" style="position:absolute;left:272px;top:50%;width:108px;transform:translateY(-50%);text-align:center;border-top:1px solid #2b1d1d;border-bottom:1px solid #2b1d1d;padding:7px 0;font-size:14px;letter-spacing:.1em">' + esc(d.time) + '</div></div>';
    s += '<div class="t" style="' + cx + 'top:776px;font-size:19px;font-weight:700;color:#2b1d1d;display:flex;justify-content:center;align-items:center;gap:8px"><span style="width:16px;height:16px;display:inline-block;color:#2b1d1d">' + ICON.pin + '</span><span class="fit" data-fit="330" data-min="14">' + esc(d.venue) + '</span></div>';
    s += '<div class="t sc-script" style="' + cx + 'top:812px;font-size:28px;color:#2b1d1d;white-space:normal;line-height:1.2;padding:0 14px">' + esc(d.closing) + '</div>';
    if (d.from) s += '<div class="t" style="' + cx + 'top:872px;font-size:15px;color:#5a3a3a;font-style:italic">With best wishes, ' + esc(d.from) + '</div>';
    s += '</div>';
    return s;
  }

  /* ================= THEME 3 : ROYAL NAVY ================= */
  function navy(d) {
    var g = nid('gold'), navyC = '#1f4377', parch = '#f5eddb';
    var A = anemone(72, 84, 42, '#ffffff', '#27406a', 10), A2 = anemone(40, 160, 30, '#ffffff', '#27406a', 40), B1 = anemone(132, 54, 24, '#6b8fc6', '#27406a', 20);
    var A3 = anemone(500, 154, 46, '#ffffff', '#27406a', 4), B2 = anemone(462, 100, 38, '#4f78b8', '#1f3560', 25), A4 = anemone(506, 760, 44, '#ffffff', '#27406a', 15), B3 = anemone(470, 706, 34, '#4f78b8', '#1f3560', 33), A5 = anemone(500, 842, 38, '#ffffff', '#27406a', 50);
    var s = '<div class="sc" style="background:' + parch + '">';
    s += '<svg class="bg" viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg"><defs>' + goldGrad(g) + paper('pp' + g, 0.5) +
      '<linearGradient id="nb' + g + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a3a6a"/><stop offset=".5" stop-color="#27528b"/><stop offset="1" stop-color="#1a3a6a"/></linearGradient>' +
      A.defs + A2.defs + B1.defs + A3.defs + B2.defs + A4.defs + B3.defs + A5.defs + '</defs>';
    s += '<rect width="600" height="900" fill="' + parch + '"/><rect width="600" height="900" filter="url(#pp' + g + ')" opacity=".5"/>';
    s += watercolor(5, ['#e9d9b3', '#f8f0dd', '#e0cfa6'], 8, 80, 150, 600, 900, 40);
    // blue watercolor corner bottom-left with gold vein
    s += watercolor(9, ['#8fb0d6', '#b9cde4', '#6d95c4'], 7, 50, 100, 220, 220, 22).replace('<g filter', '<g transform="translate(-40 720)" filter');
    s += '<path d="M0 760 C 50 790 70 850 130 900" fill="none" stroke="url(#' + g + ')" stroke-width="2"/><path d="M0 800 C 40 820 50 870 80 900" fill="none" stroke="url(#' + g + ')" stroke-width="1.2" opacity=".8"/>';
    // frame
    s += '<rect x="30" y="38" width="500" height="824" fill="none" stroke="url(#' + g + ')" stroke-width="1.4"/>';
    // navy ribbon column
    s += '<rect x="436" y="0" width="86" height="900" fill="url(#nb' + g + ')"/>';
    s += '<rect x="432" y="0" width="3" height="900" fill="url(#' + g + ')"/><rect x="523" y="0" width="3" height="900" fill="url(#' + g + ')"/><rect x="540" y="0" width="1.5" height="900" fill="url(#' + g + ')" opacity=".8"/><rect x="428" y="0" width="1.2" height="900" fill="url(#' + g + ')" opacity=".7"/>';
    // flowers + leaves
    var leafBlue = '#4d6c78', leafDark = '#3a5560';
    var leaves = function (cx, cy, seed) {
      var R = rng(seed), o = '', i;
      for (i = 0; i < 9; i++) o += leaf(cx, cy, 52 + R() * 36, R() * 360, i % 2 ? leafBlue : leafDark);
      for (i = 0; i < 5; i++) o += sprig(cx, cy, 60 + R() * 40, R() * 360, '#c9a45c');
      return o;
    };
    s += leaves(78, 110, 1) + A.body + A2.body + B1.body;
    s += leaves(490, 130, 2) + B2.body + A3.body;
    s += leaves(490, 780, 3) + B3.body + A4.body + A5.body;
    // bow + heart charm on top-right cluster
    s += '<g transform="translate(486 228)"><path d="M0 0c-26-24-52-14-46 8 4 16 26 14 46-8z" fill="#ece6d8" stroke="#bfb69f" stroke-width=".8"/><path d="M0 0c26-24 52-14 46 8-4 16-26 14-46-8z" fill="#f4efe3" stroke="#bfb69f" stroke-width=".8"/><circle r="7" fill="#d9d1bd" stroke="#bfb69f" stroke-width=".8"/><path d="M-4 6l-12 52M4 6l10 44" stroke="#e6dfcd" stroke-width="9" stroke-linecap="round"/><g transform="translate(8 62)"><path d="M0 0v10" stroke="url(#' + g + ')" stroke-width="1.5"/><path d="M0 28s-14-9-14-19a8 8 0 0 1 14-4 8 8 0 0 1 14 4c0 10-14 19-14 19z" fill="url(#' + g + ')"/></g></g>';
    s += '</svg>';
    var cx = 'left:30px;width:400px;';
    var T = function (top, size, html, style, cls) { return '<div class="t ' + (cls || '') + '" style="' + cx + 'top:' + top + 'px;font-size:' + size + 'px;' + (style || '') + '">' + html + '</div>'; };
    var Tf = function (top, size, str, style, cls, min) { return '<div class="t ' + (cls || '') + '" style="' + cx + 'top:' + top + 'px;font-size:' + size + 'px;' + (style || '') + '"><span class="fit" data-fit="366" data-min="' + (min || 20) + '">' + esc(str) + '</span></div>'; };
    if (d.showArabic && d.arabic) s += '<div class="t ar" style="' + cx + 'top:150px;font-size:32px;color:#a9812f"><span class="fit" data-fit="300" data-min="18">' + esc(d.arabic) + '</span></div>';
    s += T(206, 15, 'Together with their families', 'color:' + navyC + ';letter-spacing:.2em;text-transform:uppercase');
    s += '<div class="box" style="left:130px;top:240px;width:200px;height:12px;display:flex;align-items:center;gap:8px;color:#a9812f"><span style="flex:1;height:1px;background:#a9812f"></span><span style="width:12px;height:12px;display:block">' + ICON.heart + '</span><span style="flex:1;height:1px;background:#a9812f"></span></div>';
    s += T(266, 15, esc(d.intro), 'color:' + navyC + ';letter-spacing:.16em;text-transform:uppercase;white-space:normal;padding:0 40px;line-height:1.5');
    s += Tf(334, 78, d.bride, 'color:' + navyC + ';line-height:1', 'sc-script', 30);
    s += T(432, 15, 'And', 'color:' + navyC + ';letter-spacing:.3em;text-transform:uppercase');
    s += Tf(458, 78, d.groom, 'color:' + navyC + ';line-height:1', 'sc-script', 30);
    s += T(568, 14, esc(d.tagline), 'color:' + navyC + ';letter-spacing:.18em;text-transform:uppercase');
    // info row
    var col = function (left, w, icon, l1, l2) {
      return '<div class="box" style="left:' + left + 'px;top:606px;width:' + w + 'px;text-align:center;color:' + navyC + '"><div style="width:34px;height:34px;margin:0 auto 6px">' + icon + '</div><div class="caps" style="font-size:14px;letter-spacing:.16em;line-height:1.35;white-space:normal">' + l1 + '</div>' + (l2 ? '<div style="font-size:15px;line-height:1.3;margin-top:3px;white-space:normal">' + l2 + '</div>' : '') + '</div>';
    };
    s += col(40, 120, ICON.cal, esc(d.day) + '<br><span style="font-size:32px;font-weight:600;letter-spacing:.04em;line-height:1.1">' + esc(d.date) + '</span><br>' + esc(String(d.month).slice(0, 3)) + ' ' + esc(d.year), '');
    s += col(168, 100, ICON.clock, esc(d.time), '');
    s += col(282, 144, ICON.pin, esc(d.venue), esc(d.address));
    s += '<div class="box" style="left:166px;top:620px;width:1px;height:110px;background:#a9812f;opacity:.7"></div><div class="box" style="left:276px;top:620px;width:1px;height:110px;background:#a9812f;opacity:.7"></div>';
    s += T(780, 28, esc(d.closing), 'color:' + navyC + ';white-space:normal;padding:0 46px;line-height:1.15', 'sc-script');
    if (d.from) s += T(836, 14, 'With best wishes, ' + esc(d.from), 'color:' + navyC + ';font-style:italic');
    s += '</div>';
    return s;
  }

  /* ================= THEME 4 : MAROON & GOLD ================= */
  function maroon(d) {
    var g = nid('gold'), wine = '#5b0f26';
    var f1 = cluster(70, 76, 62, 41, ['#f3e2cf', '#7a1530', '#e8cfb5', '#8b1c3a'], { count: 5, spread: 1.0, leaves: 8, gold: '#c79a44', leaf: '#b88b3c', bud: '#c79a44', buds: 5 });
    var f2 = cluster(540, 842, 70, 57, ['#f3e2cf', '#7a1530', '#e8cfb5', '#8b1c3a'], { count: 6, spread: 1.05, leaves: 9, gold: '#c79a44', leaf: '#b88b3c', bud: '#c79a44', buds: 6 });
    var s = '<div class="sc" style="background:#f7efe2">';
    s += '<svg class="bg" viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg"><defs>' + goldGrad(g) + paper('pm' + g, 0.5) +
      '<linearGradient id="mw' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a0c20"/><stop offset=".5" stop-color="#6c1630"/><stop offset="1" stop-color="#3e0a1b"/></linearGradient>' +
      f1.defs + f2.defs + '</defs>';
    s += '<rect width="600" height="900" fill="#f8f0e3"/>';
    s += watercolor(3, ['#e8d3b0', '#f2e6cf', '#dcc29a', '#fff6e6'], 11, 60, 140, 600, 900, 34);
    // gold flecks
    var R = rng(77), i;
    for (i = 0; i < 70; i++) s += '<circle cx="' + (R() * 600).toFixed(0) + '" cy="' + (R() * 900).toFixed(0) + '" r="' + (0.6 + R() * 1.6).toFixed(1) + '" fill="#c79a44" opacity="' + (0.25 + R() * 0.5).toFixed(2) + '"/>';
    // thin frame
    s += '<rect x="22" y="22" width="556" height="856" fill="none" stroke="url(#' + g + ')" stroke-width="1.4"/><rect x="30" y="30" width="540" height="840" fill="none" stroke="url(#' + g + ')" stroke-width=".7" opacity=".8"/>';
    // burgundy corner panels (top-right, bottom-left) with scalloped gold border
    s += '<path d="M600 0 L600 168 C 560 160 520 150 510 110 C 500 70 470 40 420 34 C 450 20 470 8 480 0Z" fill="url(#mw' + g + ')"/>';
    s += '<path d="M600 168 C 560 160 520 150 510 110 C 500 70 470 40 420 34" fill="none" stroke="url(#' + g + ')" stroke-width="3"/><path d="M600 180 C 552 172 508 160 496 116 C 486 80 462 54 430 44" fill="none" stroke="url(#' + g + ')" stroke-width="1" opacity=".8"/>';
    s += '<path d="M0 900 L0 732 C 40 740 80 750 90 790 C 100 830 130 860 180 866 C 150 880 130 892 120 900Z" fill="url(#mw' + g + ')"/>';
    s += '<path d="M0 732 C 40 740 80 750 90 790 C 100 830 130 860 180 866" fill="none" stroke="url(#' + g + ')" stroke-width="3"/><path d="M0 720 C 48 728 92 740 104 784 C 114 820 138 846 170 856" fill="none" stroke="url(#' + g + ')" stroke-width="1" opacity=".8"/>';
    // mandala-ish ornaments in the panels
    var orn = function (x, y, sc, rot) {
      var o = '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')" fill="none" stroke="url(#' + g + ')" stroke-width="1.2">';
      for (var k = 0; k < 12; k++) o += '<path transform="rotate(' + (k * 30) + ')" d="M0 -6 C 8 -20 8 -34 0 -46 C -8 -34 -8 -20 0 -6Z"/>';
      o += '<circle r="8"/><circle r="54" stroke-dasharray="2 4"/></g>';
      return o;
    };
    s += orn(548, 52, 0.7, 0) + orn(52, 848, 0.8, 0);
    s += f1.body + f2.body;
    s += '</svg>';
    s += arabicBlock(d, 72, 46, '#b58a35', '', 330);
    s += txt('caps', 160, 13, 'You are cordially invited to celebrate', 'color:#5a4a3c;letter-spacing:.22em');
    s += txt('caps', 196, 19, 'The wedding of', 'color:#3d2a28;letter-spacing:.3em');
    s += fitTxt('cap-serif', 236, 50, d.bride, 'color:' + wine + ';letter-spacing:.06em;font-weight:600;line-height:1', 22, 470);
    s += '<div class="t sc-script" style="top:292px;font-size:56px;line-height:1;background:linear-gradient(120deg,#8d6a26,#e8cd85 40%,#a9812f 70%,#f0dca4);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent">&amp;</div>';
    s += fitTxt('cap-serif', 362, 50, d.groom, 'color:' + wine + ';letter-spacing:.06em;font-weight:600;line-height:1', 22, 470);
    s += '<div class="t sc-script" style="top:436px;font-size:40px;color:#a9812f;line-height:1">' + esc(d.tagline) + '</div>';
    s += dateBlock(d, 506, { color: wine, line: '#b58a35', big: 50 });
    // events row
    var ev = d.events.slice(0, 3), n = ev.length + 1, cw = 500 / n, k, row = '<div class="box" style="left:50px;top:644px;width:500px;height:112px">';
    for (k = 0; k < ev.length; k++) {
      row += '<div style="position:absolute;left:' + (k * cw) + 'px;top:0;width:' + cw + 'px;text-align:center;color:' + wine + '"><div style="width:42px;height:42px;margin:0 auto 6px;color:#b58a35">' + eventIcon(ev[k].t) + '</div><div class="caps" style="font-size:14px;letter-spacing:.16em">' + esc(ev[k].t) + '</div><div style="font-size:15px;margin-top:3px;letter-spacing:.06em">' + esc(ev[k].v) + '</div></div>';
      row += '<div style="position:absolute;left:' + ((k + 1) * cw) + 'px;top:6px;height:96px;width:1px;background:#b58a35;opacity:.7"></div>';
    }
    row += '<div style="position:absolute;left:' + (ev.length * cw) + 'px;top:0;width:' + cw + 'px;text-align:center;color:' + wine + '"><div style="width:42px;height:42px;margin:0 auto 6px;color:#b58a35">' + ICON.pin + '</div><div class="caps" style="font-size:14px;letter-spacing:.16em">Venue</div><div style="font-size:14px;margin-top:3px;line-height:1.25;white-space:normal;padding:0 4px">' + esc(d.venue) + '<br>' + esc(d.address) + '</div></div></div>';
    s += row;
    s += txt('wrap', 770, 15, esc(d.closing), 'color:#4a3834;letter-spacing:.06em;font-style:italic;padding:0 130px;white-space:normal;line-height:1.25;font-size:16px');
    s += '<div class="box" style="left:150px;top:830px;width:300px;height:34px;background:linear-gradient(120deg,#4a0c20,#6c1630,#4a0c20);border:1.5px solid #c79a44;border-radius:10px;text-align:center;color:#f3e2cf;line-height:31px;font-size:13px;letter-spacing:.2em;text-transform:uppercase;white-space:nowrap;overflow:hidden">' + esc(d.from ? ('With best wishes, ' + d.from) : d.rsvp) + '</div>';
    s += '</div>';
    return s;
  }

  /* ================= THEME 5 : CANDLELIT DRAPES ================= */
  function candle(d) {
    var g = nid('gold'), brown = '#6b4a3a', i;
    var cream = ['#fbf6ee', '#f1e6d6', '#ffffff', '#e9dcc8'];
    var s = '<div class="sc" style="background:#f2e7d8">';
    var defsAll = '', body = '';
    // garland along an arch: positions from left bottom up over the top and down right
    var pts = [], R = rng(5);
    var N = 17;
    for (i = 0; i < N; i++) {
      var t = i / (N - 1), a = Math.PI - t * Math.PI; // 180 -> 0
      pts.push([300 + Math.cos(a) * 290, 300 - Math.sin(a) * 262 + (t < 0.18 || t > 0.82 ? 120 * (t < 0.5 ? (0.18 - t) / 0.18 : (t - 0.82) / 0.18) : 0)]);
    }
    for (i = 0; i < pts.length; i++) {
      var cl = cluster(pts[i][0], pts[i][1], 40 + R() * 14, 100 + i, cream, { count: 4, spread: 0.9, leaves: 5, leaf: '#6f7d5f', buds: 4, bud: '#ffffff' });
      defsAll += cl.defs; body += cl.body;
      body += babysBreath(pts[i][0], pts[i][1], 54, 200 + i, '#fffdf8');
    }
    var low1 = cluster(70, 842, 62, 301, cream, { count: 6, spread: 1.1, leaves: 7, leaf: '#6f7d5f' });
    var low2 = cluster(530, 842, 62, 302, cream, { count: 6, spread: 1.1, leaves: 7, leaf: '#6f7d5f' });
    var low3 = cluster(300, 872, 56, 303, cream, { count: 7, spread: 1.6, leaves: 8, leaf: '#6f7d5f' });
    s += '<svg class="bg" viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg"><defs>' + goldGrad(g) +
      '<linearGradient id="cw' + g + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d8c7ae"/><stop offset=".5" stop-color="#f6ecde"/><stop offset="1" stop-color="#d8c7ae"/></linearGradient>' +
      '<radialGradient id="cg' + g + '" cx="50%" cy="46%" r="60%"><stop offset="0" stop-color="#fffaf0"/><stop offset=".7" stop-color="#f7ecdc"/><stop offset="1" stop-color="#e5d4bb"/></radialGradient>' +
      '<filter id="cb' + g + '" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>' +
      defsAll + low1.defs + low2.defs + low3.defs + '</defs>';
    s += '<rect width="600" height="900" fill="url(#cg' + g + ')"/>';
    // curtain folds (left and right drapes)
    for (i = 0; i < 9; i++) {
      var lx = i * 22, w = 22 + (i % 2) * 6, op = 0.18 + (i % 3) * 0.1;
      s += '<rect x="' + lx + '" y="0" width="' + w + '" height="900" fill="' + (i % 2 ? '#c9b69a' : '#fff6e8') + '" opacity="' + op + '"/>';
      s += '<rect x="' + (600 - lx - w) + '" y="0" width="' + w + '" height="900" fill="' + (i % 2 ? '#c9b69a' : '#fff6e8') + '" opacity="' + op + '"/>';
    }
    s += '<rect x="0" y="0" width="70" height="900" fill="url(#cw' + g + ')" opacity=".5"/><rect x="530" y="0" width="70" height="900" fill="url(#cw' + g + ')" opacity=".5"/>';
    // fairy lights (glowing dots)
    var Rl = rng(909);
    for (i = 0; i < 90; i++) {
      var lxx = Rl() * 600, lyy = Rl() * 560;
      var near = (lxx < 90 || lxx > 510 || lyy < 170);
      if (!near && Rl() > 0.25) continue;
      s += '<circle cx="' + lxx.toFixed(0) + '" cy="' + lyy.toFixed(0) + '" r="' + (3 + Rl() * 3).toFixed(1) + '" fill="#ffe7a8" opacity=".55" filter="url(#cb' + g + ')"/><circle cx="' + lxx.toFixed(0) + '" cy="' + lyy.toFixed(0) + '" r="1.5" fill="#fffbe9"/>';
    }
    s += body + low1.body + low2.body + (d._card ? '' : low3.body);
    // lanterns bottom
    var lantern = function (x, y, sc) {
      return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')"><path d="M-14 -62 q14 -18 28 0" fill="none" stroke="url(#' + g + ')" stroke-width="2.4"/><path d="M-20 -50h40l-4 10h-32z" fill="url(#' + g + ')"/><path d="M-18 -40h36l3 74h-42z" fill="#fff3cf" fill-opacity=".55" stroke="url(#' + g + ')" stroke-width="2"/><path d="M-6 -40v74M6 -40v74" stroke="url(#' + g + ')" stroke-width="1.2"/><path d="M-22 34h44v8h-44z" fill="url(#' + g + ')"/><rect x="-6" y="0" width="12" height="30" rx="2" fill="#fffaf0"/><ellipse cx="0" cy="-2" rx="5" ry="9" fill="#ffd36e" filter="url(#cb' + g + ')"/><ellipse cx="0" cy="-3" rx="2" ry="5" fill="#fff6c9"/></g>';
    };
    if (!d._card) s += lantern(150, 836, 0.9) + lantern(450, 836, 0.9);
    s += '</svg>';
    s += arabicBlock(d, 122, 40, brown, '', 340);
    s += txt('wrap', 190, 18, esc(d.quote), 'color:' + brown + ';white-space:normal;padding:0 100px;line-height:1.3;font-size:17px;font-weight:500');
    s += txt('wrap', 240, 17, esc(d.intro), 'color:' + brown + ';white-space:normal;padding:0 110px;line-height:1.3');
    s += fitTxt('sc-script', 290, 84, d.bride, 'color:' + brown + ';line-height:1', 30, 420);
    s += '<div class="t sc-script" style="top:380px;font-size:44px;color:#a9812f;line-height:1">&amp;</div>';
    s += fitTxt('sc-script', 420, 84, d.groom, 'color:' + brown + ';line-height:1', 30, 420);
    // parents two columns
    s += '<div class="box" style="left:96px;top:530px;width:408px;height:60px;color:' + brown + ';font-size:17px;line-height:1.3">' +
      '<div style="position:absolute;left:0;top:0;width:196px;text-align:center;white-space:normal">' + esc(d.brideParents) + '</div>' +
      '<div style="position:absolute;left:203px;top:2px;width:1px;height:50px;background:' + brown + ';opacity:.6"></div>' +
      '<div style="position:absolute;left:212px;top:0;width:196px;text-align:center;white-space:normal">' + esc(d.groomParents) + '</div></div>';
    s += '<div class="t sc-script" style="top:604px;font-size:26px;color:' + brown + ';white-space:normal;padding:0 100px;line-height:1.2">' + esc(d.closing) + '</div>';
    // date strip
    var c1 = function (left, w, icon, a, b) {
      return '<div class="box" style="left:' + left + 'px;top:680px;width:' + w + 'px;text-align:center;color:' + brown + '"><div style="width:26px;height:26px;margin:0 auto 4px">' + icon + '</div><div class="caps" style="font-size:14px;letter-spacing:.14em;line-height:1.3;white-space:normal">' + a + '</div>' + (b ? '<div style="font-size:15px;line-height:1.25;white-space:normal;margin-top:2px">' + b + '</div>' : '') + '</div>';
    };
    s += c1(70, 150, ICON.cal, esc(d.day) + '<br><b style="font-size:22px;letter-spacing:.04em">' + esc(d.date) + '</b> ' + esc(String(d.month).slice(0, 3)) + '<br>' + esc(d.year), '');
    s += c1(240, 120, ICON.clock, esc(d.time), '');
    s += c1(380, 160, ICON.pin, esc(d.venue), esc(d.address));
    s += '<div class="box" style="left:230px;top:684px;width:1px;height:78px;background:' + brown + ';opacity:.5"></div><div class="box" style="left:370px;top:684px;width:1px;height:78px;background:' + brown + ';opacity:.5"></div>';
    s += txt('', 782, 20, 'With love and prayers,' + (d.from ? ' ' + esc(d.from) : ''), 'color:' + brown + ';font-style:italic');
    s += '</div>';
    return s;
  }

  var RENDER = { pearl: pearl, blush: blush, navy: navy, maroon: maroon, candle: candle };

  function render(id, data) {
    var fn = RENDER[id] || RENDER.pearl;
    return fn(merge(data));
  }

  /* shrink text that is too wide for its box */
  function fit(root) {
    var els = root.querySelectorAll('[data-fit]'), i, el, max, min, size, guard;
    for (i = 0; i < els.length; i++) {
      el = els[i];
      max = parseFloat(el.getAttribute('data-fit')) || 480;
      min = parseFloat(el.getAttribute('data-min')) || 16;
      el.style.display = 'inline-block';
      el.style.whiteSpace = 'nowrap';
      size = parseFloat(window.getComputedStyle(el.parentNode).fontSize) || 30;
      el.style.fontSize = size + 'px';
      guard = 0;
      while (el.scrollWidth > max && size > min && guard < 80) {
        size -= 1; el.style.fontSize = size + 'px'; guard++;
      }
    }
  }

  function mount(el, id, data) {
    injectCss();
    el.innerHTML = render(id, data);
    fit(el);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fit(el); });
    return el.firstChild;
  }

  /* artwork only (600 x 900 SVG inner markup, no text) for the Cards section */
  var artCache = {};
  function artSVG(id) {
    if (artCache[id]) return artCache[id];
    var h = render(id, { _card: true });
    var m = /<svg class="bg"[^>]*>([\s\S]*?)<\/svg>/.exec(h);
    return (artCache[id] = m ? m[1] : '');
  }

  global.StepUpCards = {
    artSVG: artSVG,
    width: W, height: H,
    themes: THEMES,
    defaults: DEFAULTS,
    render: render,
    mount: mount,
    fit: fit,
    injectCss: injectCss
  };
})(typeof window !== 'undefined' ? window : this);
