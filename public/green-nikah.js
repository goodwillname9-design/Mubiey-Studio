'use strict';
(() => {
  const ID = 'green-nikah-001';
  const SPECIAL = {
    id: ID,
    name: 'Emerald Nikah · Floral Arch',
    tradition: 'Muslim',
    style: 'Traditional',
    detail: 'Editable floral arch · Green & Ivory',
    layout: 0, palette: 1, atelier: true, premium: true,
    art: 0, composition: 2, finish: 0,
    theme: 'ivory'
  };

  let bgData = '', logoData = '', paperData = '';
  const asset = p => `${location.origin}/assets/premium/${p}`;
  const toData = async p => {
    const r = await fetch(asset(p));
    if (!r.ok) throw Error('Could not load Emerald Nikah artwork.');
    const b = await r.blob();
    return await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(b);
    });
  };
  window.greenNikahReady = Promise.all([
    toData('green-nikah-reference.jpg').then(v => bgData = v),
    toData('green-nikah-logo.jpg').then(v => logoData = v),
    toData('green-nikah-paper.jpg').then(v => paperData = v)
  ]).catch(() => {});

  const oldTemplates = window.cardTemplates;
  const oldGetTemplate = window.getTemplate;
  const oldSpec = window.atelierSpec;
  const oldCard = window.atelierCard;
  const oldSVG = window.cardSVG;
  const oldCollect = window.collect;
  const oldOpen = window.openTemplate;
  const oldReady = window.atelierReady;

  window.cardTemplates = function(tradition) {
    return [SPECIAL, ...oldTemplates(tradition)];
  };
  window.getTemplate = function(id) {
    return id === ID ? {...SPECIAL} : oldGetTemplate(id);
  };
  window.atelierSpec = function(id) {
    if (id === ID) return {greenNikah: true, art: 0, composition: 2, finish: 0};
    return oldSpec(id);
  };

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
  const attrs = s => esc(s).replace(/\n/g, '&#10;');

  function fields() {
    const get = (id, fallback='') => document.getElementById(id)?.value ?? fallback;
    return {
      arabic: get('g-arabic', 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'),
      parent1: get('g-parent1', '(D/o Mr. Maharoof V.C.P & Mrs. Nabeera Iayin)'),
      parent2: get('g-parent2', '(S/o Mr. Abdul Basheer AP & Mrs. Bushra K)'),
      invite: get('g-invite', 'INVITE YOU WITH JOYFUL HEARTS TO WITNESS\nAND BE BLESS THE AUSPICIOUS OCCASION OF\nOUR WEDDING'),
      month: get('g-month', 'November'),
      year: get('g-year', '2026'),
      day: get('g-day', '22'),
      time: get('g-time', 'After Asr'),
      venueLabel: get('g-venueLabel', "Bride's place"),
      wishes: get('g-wishes', 'Muhammad & Aisha'),
      arch: get('g-arch', '#073b28'),
      text: get('g-text', '#0a2b20')
    };
  }

  function greenCard(data={}, t={}, embed=false) {
    const g = fields();
    const bg = embed && bgData ? bgData : asset('green-nikah-reference.jpg');
    const logo = embed && logoData ? logoData : asset('green-nikah-logo.jpg');
    const paper = embed && paperData ? paperData : asset('green-nikah-paper.jpg');
    const ink = /^#[0-9a-f]{6}$/i.test(g.text) ? g.text : '#0a2b20';
    const arch = /^#[0-9a-f]{6}$/i.test(g.arch) ? g.arch : '#073b28';
    const font = data.font === 'script' ? 'AtelierScript' : data.font === 'italic' ? 'AtelierSerif' : 'AtelierSerif';
    const year = Number(g.year) || 2026;
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    let mi = monthNames.findIndex(m => m.toLowerCase() === String(g.month).trim().toLowerCase());
    if (mi < 0) mi = 10;
    const first = new Date(Date.UTC(year, mi, 1)).getUTCDay();
    const days = new Date(Date.UTC(year, mi + 1, 0)).getUTCDate();
    const monthLabel = monthNames[mi];
    const lines = String(g.invite).split(/\r?\n/).filter(Boolean).slice(0,3);
    let cal = '<g font-family="Arial" font-size="9" fill="'+ink+'" text-anchor="middle">';
    ['S','M','T','W','T','F','S'].forEach((d,i)=> cal += `<text x="${310+i*24}" y="648">${d}</text>`);
    for(let d=1; d<=days; d++){
      const idx = first+d-1, row=Math.floor(idx/7), col=idx%7;
      const x=310+col*24, y=668+row*21;
      if(String(d)===String(g.day)) cal += `<circle cx="${x}" cy="${y-3}" r="9" fill="#b33b4a" opacity=".18"/><text x="${x}" y="${y}" fill="#a42b3e">${d}</text>`;
      else cal += `<text x="${x}" y="${y}">${d}</text>`;
    }
    cal += '</g>';
    const tline = (str,x,y,size,anchor='middle',extra='') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${font}" font-size="${size}" fill="${ink}" ${extra}>${esc(str)}</text>`;
    const small = (str,x,y,size=10,anchor='middle',extra='') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Arial" font-size="${size}" fill="${ink}" letter-spacing=".6">${esc(str)}</text>`;
    const multiline = (arr,x,y,size,dy) => arr.map((s,i)=>small(s,x,y+i*dy,size)).join('');
    const cover = (x,y,w,h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#paper)"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840" viewBox="0 0 600 840"><style>${typeof atelierFontCSS==='function'?atelierFontCSS(embed):''}</style>
      <defs>
        <pattern id="paper" patternUnits="userSpaceOnUse" width="80" height="600"><image href="${paper}" width="80" height="600"/></pattern>
        <clipPath id="logoClip"><rect x="18" y="28" width="108" height="92"/></clipPath>
      </defs>
      <image href="${bg}" x="0" y="0" width="600" height="840" preserveAspectRatio="none"/>
      <!-- Editable cover layers hide the original wording while retaining the original flowers, arch and couple. -->
      ${cover(18,28,112,94)}
      <image href="${logo}" x="20" y="30" width="105" height="88" preserveAspectRatio="xMidYMid meet" clip-path="url(#logoClip)"/>
      ${cover(205,132,205,92)}
      ${cover(175,225,260,105)}
      ${cover(82,335,380,130)}
      ${cover(145,468,245,88)}
      ${cover(105,550,275,190)}
      ${cover(185,714,170,86)}
      <g stroke="${arch}" fill="none" opacity=".9"><path d="M92 545V260A208 208 0 0 1 508 260V545" stroke-width="4"/></g>
      <g fill="${ink}">
        <text x="300" y="162" text-anchor="middle" font-family="AtelierAmiri, serif" font-size="17" direction="rtl">${esc(g.arabic)}</text>
        <path d="M244 177H356" stroke="#ae9454" stroke-width="1"/>
        ${small('IN THE NAME OF ALLAH,',300,205,9)}
        ${small('THE MOST GRACIOUS, THE MOST MERCIFUL',300,219,9)}
        ${small('WITH THE BLESSINGS OF ALLAH',300,239,9)}
        ${small('AND IN THE LOVING MEMORY OF OUR',300,253,9)}
        ${small('BELOVED PARENTS',300,267,9)}
        <path d="M252 283H348" stroke="${arch}" stroke-width="1"/>
        <circle cx="296" cy="283" r="3"/><circle cx="304" cy="283" r="3"/>
        ${tline(data.name1 || 'Fathima Maharof', 300, 375, Math.min(Number(data.nameSize)||28,34), 'middle', 'data-edit="name1"')}
        ${small(g.parent1,300,395,6.8)}
        ${tline('&', 300, 426, 23)}
        ${tline(data.name2 || 'Muhammed Navas', 300, 465, Math.min(Number(data.nameSize)||28,34), 'middle', 'data-edit="name2"')}
        ${small(g.parent2,300,485,6.8)}
        ${multiline(lines,300,525,8,13)}
        <path d="M220 570H380" stroke="${arch}" stroke-width="1"/>
        ${small(monthLabel,300,603,24)}
        ${small(String(year),300,618,8)}
        ${cal}
        <g transform="translate(142 620)" fill="${ink}">
          <circle cx="0" cy="0" r="13" fill="none" stroke="${arch}" stroke-width="1"/>
          <text x="25" y="3" text-anchor="start" font-family="Arial" font-size="10" font-weight="600">Nikah</text>
          <text x="25" y="17" text-anchor="start" font-family="Arial" font-size="9">${esc(g.time)}</text>
          <circle cx="0" cy="50" r="13" fill="none" stroke="${arch}" stroke-width="1"/>
          <text x="25" y="53" text-anchor="start" font-family="Arial" font-size="9">Venue at</text>
          <text x="25" y="66" text-anchor="start" font-family="Arial" font-size="9">${esc(g.venueLabel)}</text>
        </g>
        <path d="M240 774H360" stroke="#777" stroke-width=".8"/>
        ${small('Best wishes by',300,792,8)}
        ${tline(g.wishes,300,812,12)}
      </g>
    </svg>`;
  }

  window.atelierReady = function() { return Promise.all([oldReady(), window.greenNikahReady]); };

  window.atelierCard = function(data,t,embed=false) {
    if ((t && t.id === ID) || data?.template === ID) return greenCard(data,t,embed);
    return oldCard(data,t,embed);
  };
  window.cardSVG = function(data={}, t=window.getTemplate(data.template)) {
    if ((t && t.id === ID) || data?.template === ID) return greenCard(data,t,false);
    return oldSVG(data,t);
  };

  function ensureFields() {
    let box = document.getElementById('green-nikah-fields');
    if (!box) {
      box = document.createElement('section');
      box.id = 'green-nikah-fields';
      box.className = 'panel';
      box.style.marginTop = '18px';
      box.innerHTML = `<h2>Emerald Nikah · Editable artwork</h2>
        <p class="help">This template keeps the floral arch, flowers and couple artwork while the invitation wording is rebuilt as editable objects.</p>
        <div class="field-grid">
          <label class="wide">Arabic Bismillah<input id="g-arabic" value="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"></label>
          <label>Bride's parents<input id="g-parent1" value="(D/o Mr. Maharoof V.C.P & Mrs. Nabeera Iayin)"></label>
          <label>Groom's parents<input id="g-parent2" value="(S/o Mr. Abdul Basheer AP & Mrs. Bushra K)"></label>
          <label class="wide">Invitation wording<textarea id="g-invite">INVITE YOU WITH JOYFUL HEARTS TO WITNESS
AND BE BLESS THE AUSPICIOUS OCCASION OF
OUR WEDDING</textarea></label>
          <label>Month<input id="g-month" value="November"></label>
          <label>Year<input id="g-year" type="number" value="2026"></label>
          <label>Highlight day<input id="g-day" type="number" min="1" max="31" value="22"></label>
          <label>Nikah time<input id="g-time" value="After Asr"></label>
          <label>Venue label<input id="g-venueLabel" value="Bride's place"></label>
          <label class="wide">Best wishes by<input id="g-wishes" value="Muhammad & Aisha"></label>
          <label>Arch colour<input id="g-arch" type="color" value="#073b28"></label>
          <label>Text colour<input id="g-text" type="color" value="#0a2b20"></label>
        </div>`;
      document.getElementById('editor').querySelector('.work-layout')?.prepend(box);
      [...box.querySelectorAll('input,textarea')].forEach(el => el.addEventListener('input', () => {
        const title = document.getElementById('design-title');
        if (title?.dataset.template === ID) preview();
      }));
    }
    box.hidden = false;
  }
  function hideFields(){ const b=document.getElementById('green-nikah-fields'); if(b) b.hidden=true; }

  window.collect = function() {
    const d = oldCollect();
    const title = document.getElementById('design-title');
    if (title?.dataset.template === ID) {
      for (const id of ['g-arabic','g-parent1','g-parent2','g-invite','g-month','g-year','g-day','g-time','g-venueLabel','g-wishes','g-arch','g-text']) {
        const el = document.getElementById(id); if (el) d[id] = el.value;
      }
    }
    return d;
  };

  window.openTemplate = function(t) {
    oldOpen(t);
    const title = document.getElementById('design-title');
    if (title) title.dataset.template = t.id;
    if (t.id === ID) {
      ensureFields();
      document.getElementById('c-background').value = '#faf7ef';
      document.getElementById('c-ink').value = '#0a2b20';
      document.getElementById('c-accent').value = '#ae9454';
      if (typeof window.preview === 'function') preview();
    } else hideFields();
  };

  const designFile = document.getElementById('design-file');
  if (designFile) designFile.addEventListener('change', async () => {
    setTimeout(() => {
      const title = document.getElementById('design-title');
      if (title?.dataset.template !== ID) return;
      const input = document.getElementById('design-file');
      // The primary loader in cards.js has already parsed the file by this point.
      // If the currently loaded design is Emerald Nikah, restore its extra fields.
      // The JSON is intentionally small and remains part of the editable design file.
      // We read it again here only for the extra Emerald fields.
      const file = input?.files?.[0];
      if (!file) return;
      file.text().then(raw => {
        try {
          const d = JSON.parse(raw), a = d?.design || {};
          ['g-arabic','g-parent1','g-parent2','g-invite','g-month','g-year','g-day','g-time','g-venueLabel','g-wishes','g-arch','g-text'].forEach(id => {
            if (a[id] != null && document.getElementById(id)) document.getElementById(id).value = a[id];
          });
          preview();
        } catch {}
      });
    }, 40);
  }, true);
  if (typeof window.renderList === 'function') renderList();
})();