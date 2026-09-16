/* ==========================================================================
   Oman Investment Bank — E-Invoicing Hub — application shell + guided walkthrough
   Trimmed from the multi-entity mocks in this repo to five steps, one act,
   two surfaces (erp, hub — no portal in this single-entity slice).
   Injects sidebar, topbar (with step navigation), hint strip and footer.
   Configured by data-* attributes on <body>:
     data-surface  hub | erp
     data-nav      active sidebar key
     data-step     id from WALKTHROUGH below — drives Previous / Next
     data-crumbs   "Parent / Child"
     data-hint     one sentence: what the viewer is looking at
     data-shell    "off" to skip the shell entirely (auth screens)
   All page files live one folder deep, so cross-surface links use ../
   ========================================================================== */

/* One act. This is a thinnest-vertical-slice mock: one invoice, one
   direction, one entity — not the eighteen-step multi-entity walkthrough. */
const ACTS = [
  { n: 'I', t: 'One invoice, start to finish', d: 'OIB issues one fee invoice; the Hub reports it; the answer comes back' }
];

const WALKTHROUGH = [
  { id: 'erp-invoice', act: 0, sfc: 'erp', href: '../erp/invoice.html',
    name: 'A fee invoice raised in the ERP', blurb: 'A normal Oracle Fusion Financials Cloud AR invoice, created and posted as usual.' },
  { id: 'hub-login',   act: 0, sfc: 'hub', href: '../hub/login.html',
    name: 'Signing in to the Hub',          blurb: 'OIB’s finance operations team logs in.' },
  { id: 'hub-tracker',  act: 0, sfc: 'hub', href: '../hub/tracker.html',
    name: 'One invoice, tracked',           blurb: 'Where it is right now, across the nine stages.' },
  { id: 'hub-document', act: 0, sfc: 'hub', href: '../hub/document.html',
    name: 'Built, then checked',            blurb: 'The official XML, proven correct before anything is sent.' },
  { id: 'erp-sync',    act: 0, sfc: 'erp', href: '../erp/sync.html',
    name: 'The answer, back on the invoice', blurb: 'Reference, status and QR information on the original ERP record.' }
];

const NAV = {
  hub: [
    { label: 'Operations', items: [
      { key: 'tracker',  name: 'Document Tracker',    href: 'tracker.html',  ico: 'queue' },
      { key: 'document', name: 'Document Inspector',  href: 'document.html', ico: 'doc' }
    ]}
  ],
  erp: [
    { label: 'Accounts Receivable', items: [
      { key: 'invoice',  name: 'Fee Invoices',        href: 'invoice.html', ico: 'file' },
      { key: 'customers', name: 'Customers',          href: '#',            ico: 'grid' }
    ]},
    { label: 'E-Invoicing', items: [
      { key: 'sync',     name: 'E-Invoice Status',    href: 'sync.html',    ico: 'sync' }
    ]}
  ]
};

const BRAND = {
  hub: { mark: 'O', name: 'Oman Investment Bank', sub: 'E-Invoicing Hub', who: 'FO', whoName: 'Finance Operations', whoRole: 'Platform administrator' },
  erp: { mark: 'O', name: 'Oman Investment Bank', sub: 'Oracle Fusion Financials Cloud', who: 'MA', whoName: 'M. Al-Amri', whoRole: 'Finance — Accounts Receivable' }
};

const ENV = { hub: 'Central Hub', erp: 'Oracle Fusion Financials Cloud' };

/* --- sidebar collapse ------------------------------------------------------
   Five screens, each a separate page load, so the collapsed state has to
   survive unload or the sidebar springs back open on every Next.
   localStorage throws in a sandboxed iframe and on file:// under some
   browsers, so every access is guarded — the toggle must never be the thing
   that breaks the walkthrough. */
const RAIL_KEY = 'oib.hub.rail';

function storedRail() {
  try { return localStorage.getItem(RAIL_KEY) === '1'; } catch (e) { return null; }
}
function saveRail(on) {
  try { localStorage.setItem(RAIL_KEY, on ? '1' : '0'); } catch (e) { /* ignore */ }
}

/* --- step navigation markup ----------------------------------------------- */
function stepNav(i) {
  const prev = i > 0 ? WALKTHROUGH[i - 1] : null;
  const next = i < WALKTHROUGH.length - 1 ? WALKTHROUGH[i + 1] : null;
  return `
    <a class="stepbtn ${prev ? '' : 'is-off'}" href="${prev ? prev.href : '#'}">← Previous</a>
    <span class="count">Step ${i + 1} of ${WALKTHROUGH.length}</span>
    <a class="stepbtn next" href="${next ? next.href : '../index.html'}">
      ${next ? 'Next →' : 'Finish ✓'}</a>`;
}

/* Auth screens run without the shell, but still belong to the walkthrough,
   so they get a floating step bar pinned to the bottom of the viewport. */
function floatingStepBar(i) {
  const el = document.createElement('div');
  el.className = 'stepnav';
  el.style.cssText = `position:fixed;left:50%;bottom:20px;transform:translateX(-50%);
    z-index:80;padding:8px 10px;border-radius:99px;border:1px solid var(--line-hard);
    background:var(--surface);box-shadow:var(--shadow)`;
  el.innerHTML = stepNav(i);
  document.body.appendChild(el);
}

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const surface = body.dataset.surface;

  if (body.dataset.shell === 'off') {
    const i = WALKTHROUGH.findIndex(s => s.id === body.dataset.step);
    if (i >= 0) floatingStepBar(i);
    return;
  }
  if (!surface) return;

  const brand = BRAND[surface];
  const active = body.dataset.nav || '';
  const main = document.querySelector('main.main');
  if (!main) return;

  const stepIndex = WALKTHROUGH.findIndex(s => s.id === body.dataset.step);
  const prev = stepIndex > 0 ? WALKTHROUGH[stepIndex - 1] : null;
  const next = stepIndex >= 0 && stepIndex < WALKTHROUGH.length - 1 ? WALKTHROUGH[stepIndex + 1] : null;

  /* ---- sidebar ---- */
  const aside = document.createElement('aside');
  aside.className = 'sidebar';
  aside.innerHTML = `
    <a class="brand" href="../index.html" title="${brand.name} — ${brand.sub}">
      <span class="brand-mark">${brand.mark}</span>
      <span class="stack">
        <span class="brand-name">${brand.name}</span>
        <span class="brand-sub">${brand.sub}</span>
      </span>
    </a>
    <button class="railtoggle" type="button" aria-expanded="true"
            aria-controls="app-sidebar" title="Collapse the menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
           stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>
    </button>
    <nav class="nav">${NAV[surface].map(g => `
      <div class="nav-group">
        <div class="nav-label">${g.label}</div>
        ${g.items.map(i => `
          <a class="nav-item ${i.key === active ? 'is-active' : ''}" href="${i.href}"
             title="${i.name}">
            ${icon(i.ico)}<span>${i.name}</span>
          </a>`).join('')}
      </div>`).join('')}
    </nav>
    <div class="sidebar-foot">
      <div class="who" title="${brand.whoName} — ${brand.whoRole}">
        <span class="avatar">${brand.who}</span>
        <span class="stack">
          <span style="font-size:12px;font-weight:600">${brand.whoName}</span>
          <span class="tiny dim">${brand.whoRole}</span>
        </span>
      </div>
    </div>`;
  aside.id = 'app-sidebar';

  /* ---- topbar: breadcrumb + step navigation ---- */
  const crumbs = (body.dataset.crumbs || '').split('/').map(s => s.trim()).filter(Boolean);
  const bar = document.createElement('div');
  bar.className = 'topbar';
  bar.innerHTML = `
    <div class="crumbs">${crumbs.map((c, i) =>
      i === crumbs.length - 1 ? `<span class="here">${c}</span>`
                              : `<span>${c}</span><span class="sep">/</span>`).join('')}</div>
    <div class="topbar-right">
      <span class="env"><span class="beacon"><i></i></span>${ENV[surface]}</span>
      ${stepIndex >= 0 ? `<span class="vdivider" style="height:22px"></span>
        <div class="stepnav">${stepNav(stepIndex)}</div>` : ''}
    </div>`;

  /* ---- hint strip ---- */
  let hint = null;
  if (body.dataset.hint) {
    hint = document.createElement('div');
    hint.className = 'hintbar';
    hint.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">${ICO.info}</svg>
      <span class="tagline">On this screen</span>
      <div class="grow">${body.dataset.hint}</div>
      <button class="close" title="Hide this hint"
              onclick="this.parentNode.remove()">&times;</button>`;
  }

  /* ---- foot: repeat of the step nav ---- */
  const page = main.querySelector('.page');
  if (page && stepIndex >= 0) {
    const foot = document.createElement('div');
    foot.className = 'stepfoot';
    foot.innerHTML = `
      <div class="side">
        ${prev ? `<div class="lbl">Previous</div><div class="nm">${prev.name}</div>`
               : `<div class="lbl">Start</div><div class="nm">You are at the beginning</div>`}
      </div>
      <div class="stepnav">${stepNav(stepIndex)}</div>
      <div class="side r">
        ${next ? `<div class="lbl">Next</div><div class="nm">${next.name}</div>`
               : `<div class="lbl">End</div><div class="nm">The loop is closed</div>`}
      </div>`;
    page.appendChild(foot);
  }

  const footer = document.createElement('div');
  footer.className = 'footer';
  footer.innerHTML = `
    <span>Demonstration prototype — Oman Investment Bank is real, everything else is illustrative</span>
    <span class="dot">·</span><span>Oman OTA e-invoicing · PINT-OM</span>
    <span class="right"><a href="../index.html">All screens</a></span>`;

  main.prepend(bar);
  if (hint) bar.after(hint);
  main.appendChild(footer);

  const app = document.createElement('div');
  app.className = 'app';
  main.parentNode.insertBefore(app, main);
  app.appendChild(aside);
  app.appendChild(main);

  /* The class goes on before the first paint, so a remembered rail opens
     collapsed rather than snapping shut in front of the audience. */
  const toggle = aside.querySelector('.railtoggle');
  let railed = storedRail() === true;

  function setRail(on, animate) {
    railed = on;
    if (!animate) app.style.transition = 'none';
    app.classList.toggle('is-rail', on);
    toggle.setAttribute('aria-expanded', on ? 'false' : 'true');
    toggle.title = on ? 'Expand the menu' : 'Collapse the menu';
    if (!animate) requestAnimationFrame(() => { app.style.transition = ''; });
  }
  setRail(railed, false);

  toggle.addEventListener('click', () => { setRail(!railed, true); saveRail(railed); });

  /* keyboard: ← / → move through the walkthrough, [ folds the menu away */
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea, select')) return;
    if (e.key === 'ArrowRight' && next) location.href = next.href;
    if (e.key === 'ArrowLeft' && prev) location.href = prev.href;
    if (e.key === '[') { setRail(!railed, true); saveRail(railed); }
  });
});
