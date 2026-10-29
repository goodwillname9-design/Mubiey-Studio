import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const dir = new URL('../public/', import.meta.url);
const read = name => fs.readFileSync(new URL(name, dir), 'utf8');
const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

function context() {
  const c = { console, Studio: { escape: escapeHtml } };
  c.window = c;
  c.invitationDocument = d => 'BASE:' + d.template;
  vm.createContext(c);
  vm.runInContext(read('stepup-invitation.js'), c);
  return c;
}
const render = (c, data) => { c.data = data; return vm.runInContext('invitationDocument(data)', c); };
const base = { template: 'stepup', name1: 'Ameen', name2: 'Fathima', date: '2028-04-20T11:30+05:30', theme: 'rose', tradition: 'Muslim', venue: 'Grand Hall', address: 'Salmiya, Kuwait' };
const inlineScripts = html => [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const payload = html => JSON.parse(/window\.STEPUP_DATA=(\{[\s\S]*?\});<\/script>/.exec(html)[1]);

test('step up renders one self-contained document with valid inline scripts', () => {
  const html = render(context(), base);
  assert.ok(html.startsWith('<!doctype html>'));
  assert.ok(html.includes('Ameen') && html.includes('Fathima'));
  const scripts = inlineScripts(html);
  assert.equal(scripts.length, 3);
  for (const code of scripts) new vm.Script(code);
  assert.ok(!/<script[^>]+src=/i.test(html), 'no external script files');
});

test('step up hands the other templates to the existing renderer', () => {
  assert.equal(render(context(), { ...base, template: '111' }), 'BASE:111');
});

test('step up passes the invitation form into the card and maps the colour theme', () => {
  const c = context();
  const map = { ivory: 'pearl', rose: 'blush', midnight: 'navy', saffron: 'maroon', emerald: 'candle', sage: 'candle' };
  for (const [theme, card] of Object.entries(map)) assert.equal(payload(render(c, { ...base, theme })).theme, card);
  const d = payload(render(c, { ...base, parents1: 'Bride family', parents2: 'Groom family', timeText: '7 PM', wishesFrom: 'Ali & family' }));
  assert.equal(d.bride, 'Ameen'); assert.equal(d.groom, 'Fathima');
  assert.equal(d.day, 'Thursday'); assert.equal(d.date, '20'); assert.equal(d.month, 'April'); assert.equal(d.year, '2028');
  assert.equal(d.time, '7 PM'); assert.equal(d.venue, 'Grand Hall'); assert.equal(d.brideParents, 'Bride family'); assert.equal(d.from, 'Ali & family');
});

test('step up shows the finished card in the editor preview and plays the walk on guest links', () => {
  const c = context();
  assert.equal(payload(render(c, { ...base, _editorPreview: true })).mode, 'static');
  assert.equal(payload(render(c, { ...base, animation: false })).mode, 'static');
  assert.equal(payload(render(c, { ...base, animation: true })).mode, 'cinematic');
});

test('step up escapes names and drops unsafe links and media', () => {
  const html = render(context(), { ...base, name1: '</script><img src=x onerror=alert(1)>', mapUrl: 'javascript:alert(1)', rsvpUrl: 'http://example.com', music: 'https://evil.example/a.mp3' });
  assert.ok(!html.includes('</script><img'));
  for (const code of inlineScripts(html)) new vm.Script(code);
  const d = payload(html);
  assert.equal(d.mapUrl, ''); assert.equal(d.rsvpUrl, ''); assert.equal(d.music, '');
});

test('step up cards are original: five designs, your text only, no reference text or watermarks', () => {
  const c = { console }; c.window = c; vm.createContext(c);
  vm.runInContext(read('stepup-cards.js'), c);
  const lib = c.StepUpCards;
  assert.equal(lib.themes.length, 5);
  const forbidden = ['Samir', 'Swalih', 'Maliki', 'Jismi', 'Sara Khan', 'Hamza', 'Maryam', 'Bilal', 'noorinvite', 'Het Paleis', 'Mergenweg', 'Musthafa', 'Thottupurath', 'Royal Palace'];
  for (const t of lib.themes) {
    const html = lib.render(t.id, { bride: 'Aysha', groom: 'Zayed' });
    assert.ok(html.includes('Aysha') && html.includes('Zayed'), t.id);
    const art = lib.artSVG(t.id);
    assert.ok(art.includes('<'), t.id); assert.ok(!art.includes('<text'), t.id + ' art has no text');
    for (const word of forbidden) assert.ok(!html.includes(word), t.id + ' contains ' + word);
  }
  for (const file of ['stepup-cards.js', 'stepup-card-designs.js', 'stepup-invitation.js', 'stepup.html'])
    for (const word of forbidden) assert.ok(!read(file).includes(word), file + ' contains ' + word);
});

test('step up card maker script is valid JavaScript', () => {
  new vm.Script(read('stepup-card-designs.js'));
});
