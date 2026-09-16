/* ==========================================================================
   Oman Investment Bank — E-Invoicing Hub — shared UI component helpers
   Trimmed from the multi-entity mocks in this repo to what these five
   screens use. Every function returns an HTML string. Pages compose them.
   ========================================================================== */

/* --- icons (16px, currentColor) ------------------------------------------- */
const ICO = {
  grid:    '<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
  queue:   '<path d="M3 6h18M3 12h18M3 18h11"/>',
  doc:     '<path d="M14 3v5h5"/><path d="M14 3H6v18h12V8z"/><path d="M9 13h6M9 17h4"/>',
  send:    '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
  sync:    '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
  shield:  '<path d="M12 3l8 3v6c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  search:  '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  check:   '<path d="m4 12 5 5L20 6"/>',
  x:       '<path d="M18 6 6 18M6 6l12 12"/>',
  alert:   '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  info:    '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  clock:   '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  file:    '<path d="M13 2v7h7"/><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>',
  qr:      '<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z"/><path d="M14 14h3v3h-3zM19 14h2v2M14 19h3v2M19 19h2v2"/>'
};

function icon(name, cls) {
  return `<svg class="${cls || 'nav-ico'}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[name] || ''}</svg>`;
}

/* --- status pills --------------------------------------------------------- */
const PILL_MAP = {
  success:     ['ok',   'Success'],      ok:          ['ok',   'OK'],
  acknowledged:['ok',   'Acknowledged'], delivered:   ['ok',   'Delivered'],
  passed:      ['ok',   'Passed'],       completed:   ['ok',   'Completed'],
  pending:     ['warn', 'Pending'],      active:      ['warn', 'In progress'],
  warn:        ['warn', 'Warning'],
  queued:      ['idle', 'Queued'],       draft:       ['idle', 'Draft'],
  failed:      ['fail', 'Failed'],       rejected:    ['fail', 'Rejected'],
  error:       ['fail', 'Error'],
  submitted:   ['info', 'Submitted']
};
function pill(key, label) {
  const m = PILL_MAP[String(key).toLowerCase()] || ['idle', key];
  return `<span class="pill pill-${m[0]}"><i class="dot"></i>${label || m[1]}</span>`;
}

/* --- stat tile ------------------------------------------------------------ */
function stat(o) {
  return `<div class="stat rise" ${o.tone ? `style="--tone:${o.tone}"` : ''}>
    <div class="stat-label">${o.label}</div>
    <div class="stat-value">${o.value}</div>
    ${o.meta ? `<div class="stat-meta">${o.meta}</div>` : ''}
  </div>`;
}

/* --- full pipeline stepper ------------------------------------------------ */
function pipeline(currentIndex, opts) {
  const o = opts || {};
  const stages = o.stages || STAGES;
  const times = o.times || [];
  const failedAt = o.failedAt;
  return `<div class="pipe">` + stages.map((s, i) => {
    let cls = 'todo';
    if (failedAt !== undefined && i === failedAt) cls = 'fail';
    else if (failedAt !== undefined && i < failedAt) cls = 'done';
    else if (i < currentIndex) cls = 'done';
    else if (i === currentIndex) cls = 'active';
    const mark = cls === 'done'
      ? `<svg class="pipe-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${ICO.check}</svg>`
      : cls === 'fail'
      ? `<svg class="pipe-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">${ICO.x}</svg>`
      : '';
    return `<div class="pipe-step ${cls}" style="--i:${i}">
      <div class="pipe-rail"><i></i></div>
      <div class="pipe-meta">
        <div class="pipe-name">${mark}${s}</div>
        ${times[i] ? `<div class="pipe-time">${times[i]}</div>` : ''}
      </div>
    </div>`;
  }).join('') + `</div>`;
}

/* --- validation rule rows ------------------------------------------------- */
function ruleRow(r) {
  const ic = r.st === 'pass' ? 'check' : r.st === 'fail' ? 'x' : 'alert';
  const col = r.st === 'pass' ? 'var(--ok)' : r.st === 'fail' ? 'var(--fail)' : 'var(--warn)';
  return `<div class="rule ${r.st}">
    <svg class="rule-ico" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="2.2"
      stroke-linecap="round" stroke-linejoin="round">${ICO[ic]}</svg>
    <div class="grow">
      <div class="rule-id">${r.id}</div>
      <div class="rule-txt">${r.txt}</div>
      ${r.x ? `<div class="rule-x">${r.x}</div>` : ''}
    </div>
  </div>`;
}

/* --- notice --------------------------------------------------------------- */
function notice(kind, html) {
  const ic = kind === 'ok' ? 'check' : kind === 'fail' ? 'alert' : kind === 'warn' ? 'alert' : 'info';
  const col = kind === 'ok' ? 'var(--ok)' : kind === 'fail' ? 'var(--fail)' : kind === 'warn' ? 'var(--warn)' : 'var(--accent)';
  return `<div class="notice notice-${kind}">
    <svg class="notice-ico" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round">${ICO[ic]}</svg>
    <div class="grow">${html}</div>
  </div>`;
}

/* --- teaching callout (explains the mock to stakeholders) ----------------- */
function teach(html) {
  return `<div class="teach">
    <svg style="width:14px;height:14px;flex:none;margin-top:2px" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO.info}</svg>
    <div>${html}</div>
  </div>`;
}

/* --- syntax-highlighted XML -----------------------------------------------
   Tokenises each line into comments, tags and text, then emits markup once.
   Nothing re-scans previously emitted output, so an attribute pass can never
   match the class="..." of a span produced by the tag pass. */
function xml(src) {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const span = (c, t) => '<span class="' + c + '">' + t + '</span>';
  const TAG = /<!--[\s\S]*?-->|<\/?[A-Za-z_?][\w:.?-]*(?:\s[^<>]*?)?\/?>/g;
  const ATTR = /([\w:.-]+)\s*=\s*"([^"]*)"/g;

  return src.split('\n').map(line => {
    let out = '', cursor = 0, m;
    TAG.lastIndex = 0;
    while ((m = TAG.exec(line)) !== null) {
      if (m.index > cursor) out += span('tk-txt', esc(line.slice(cursor, m.index)));
      const tag = m[0];
      if (tag.startsWith('<!--')) {
        out += span('tk-com', esc(tag));
      } else {
        const t = tag.match(/^(<[\/?]?)([\w:.?-]+)([\s\S]*?)([?\/]?>)$/);
        if (!t) {
          out += esc(tag);
        } else {
          let attrs = '', j = 0, a;
          ATTR.lastIndex = 0;
          while ((a = ATTR.exec(t[3])) !== null) {
            if (a.index > j) attrs += esc(t[3].slice(j, a.index));
            attrs += span('tk-attr', esc(a[1])) + '=' + span('tk-val', '"' + esc(a[2]) + '"');
            j = a.index + a[0].length;
          }
          attrs += esc(t[3].slice(j));
          out += esc(t[1]) + span('tk-tag', esc(t[2])) + attrs + esc(t[4]);
        }
      }
      cursor = m.index + tag.length;
    }
    if (cursor < line.length) out += span('tk-txt', esc(line.slice(cursor)));
    return '<span class="l">' + (out || ' ') + '</span>';
  }).join('');
}

/* --- key/value list ------------------------------------------------------- */
function kv(pairs, flat) {
  return `<dl class="kv ${flat ? 'kv-flat' : ''}">` +
    pairs.map(p => `<dt>${p[0]}</dt><dd>${p[1]}</dd>`).join('') + `</dl>`;
}

/* --- acknowledgement leg -------------------------------------------------- */
function legRow(l) {
  const done = l.st === 'ok';
  return `<div class="leg ${done ? 'ok' : 'pending'}">
    <span class="lmark">${done ? '✓' : '·'}</span>
    <div>
      ${l.leg ? `<div class="lroute">${l.leg}</div>` : ''}
      <div class="lname">${l.name}</div>
      <div class="lbody">${l.body}</div>
      ${l.ref ? `<div class="lref">${l.ref}</div>` : ''}
    </div>
    <div class="lwhen">
      <div class="w1">${done ? l.at.split(' ').slice(-1)[0] : 'awaiting'}</div>
      ${l.el ? `<div class="w2">${l.el}</div>` : `<div class="w2">${done ? '' : 'no action needed'}</div>`}
    </div>
  </div>`;
}
