/* ==========================================================================
   Vodafone Oman × Fawtara — E-Invoicing Scope Walkthrough — application shell
   Injects sidebar, topbar (with step navigation), hint strip and footer.
   Configured by data-* attributes on <body>:
     data-surface  hub | erp   (erp = Vodafone's generic origin systems)
     data-nav      active sidebar key
     data-step     id from WALKTHROUGH below — drives Previous / Next
     data-crumbs   "Parent / Child"
     data-hint     one sentence: what the viewer is looking at
     data-shell    "off" to skip the shell entirely (auth screens)
   All page files live one folder deep, so cross-surface links use ../

   This mock's spine is the SIX invoice streams from the meeting agenda, not a
   roster of companies — Vodafone is one legal entity. Two of the streams carry
   OTA positions flagged "to confirm".
   ========================================================================== */

/* THE canonical screen order. Everything else derives from this list.
   Five acts, agenda-shaped. Reorder here and the whole walkthrough reorders. */
const ACTS = [
  { n: 'I',   t: 'The pipe, and the whole picture',    d: 'Sign in, then all six streams on one screen' },
  { n: 'II',  t: 'Vodafone as seller — B2B',           d: 'A postpaid invoice, cleared to the OTA end to end' },
  { n: 'III', t: 'Vodafone as seller — B2C, at volume', d: 'Consumer billing, reported in one batch a day' },
  { n: 'IV',  t: 'The open questions',                  d: 'Prepaid and out-of-bundle — Fawtara’s reading' },
  { n: 'V',   t: 'As buyer, and the record',            d: 'Supplier invoices, reverse charge, reports and value' }
];

const WALKTHROUGH = [
  /* Act I */
  { id: 'hub-login',     act: 0, sfc: 'hub', href: '../hub/login.html',
    name: 'Signing in to the console',       blurb: 'The Vodafone e-invoicing team logs in.' },
  { id: 'hub-dashboard', act: 0, sfc: 'hub', href: '../hub/dashboard.html',
    name: 'All six streams on one screen',   blurb: 'B2B, B2C, prepaid, inbound and reverse-charge — volumes and health.' },

  /* Act II — Vodafone as seller, B2B postpaid: the canonical clear-to-OTA flow */
  { id: 'erp-billing',   act: 1, sfc: 'erp', href: '../origin/billing.html',
    name: 'A postpaid B2B invoice',          blurb: 'Raised in your billing system, posted as usual.' },
  { id: 'hub-queue',     act: 1, sfc: 'hub', href: '../hub/queue.html',
    name: 'Validated and cleared to the OTA', blurb: 'The nine stages, and what is sitting in each.' },
  { id: 'hub-document',  act: 1, sfc: 'hub', href: '../hub/document.html',
    name: 'The cleared e-invoice',           blurb: 'The official XML, proven correct before anything is sent.' },

  /* Act III — Vodafone as seller, B2C at telco volume */
  { id: 'erp-consumer',  act: 2, sfc: 'erp', href: '../origin/consumer.html',
    name: 'Consumer billing, at volume',     blurb: 'Postpaid bills and prepaid recharges — hundreds of thousands a day.' },
  { id: 'hub-batch',     act: 2, sfc: 'hub', href: '../hub/batch.html',
    name: 'One batch a day to the OTA',      blurb: 'The whole consumer day reported in a single overnight window.' },

  /* Act IV — the unsettled treatments, with Fawtara's recommended reading */
  { id: 'hub-prepaid',   act: 3, sfc: 'hub', href: '../hub/prepaid.html',
    name: 'Prepaid: a single-purpose voucher', blurb: 'Tax point at the top-up. Fawtara’s reading, to confirm with OTA.' },
  { id: 'hub-usage',     act: 3, sfc: 'hub', href: '../hub/usage.html',
    name: 'Out-of-bundle usage',             blurb: 'Aggregated into the monthly invoice. To confirm with OTA.' },

  /* Act V — Vodafone as buyer, the record, and the value */
  { id: 'hub-inbound',   act: 4, sfc: 'hub', href: '../hub/inbound.html',
    name: 'Supplier invoices, in and imported', blurb: 'Inside Oman lands as a draft; outside Oman is reverse-charged.' },
  { id: 'hub-reports',   act: 4, sfc: 'hub', href: '../hub/reports.html',
    name: 'Reports and reconciliation',      blurb: 'VAT by stream, batch reconciliation, the position register.' },
  { id: 'hub-value',     act: 4, sfc: 'hub', href: '../hub/value.html',
    name: 'Why Fawtara',                     blurb: 'Accreditation, Oman data residency, telco-scale batch.' },
  { id: 'erp-sync',      act: 4, sfc: 'erp', href: '../origin/sync.html',
    name: 'The answer, back on the invoice', blurb: 'Reference, status and QR on the original billing record.' }
];
/* hub/asp.html, hub/mapping.html, hub/history.html and hub/boundary.html are
   reachable from the console but are not guided steps. */

const NAV = {
  hub: [
    { label: 'Operations', items: [
      { key: 'dashboard', name: 'Dashboard',          href: 'dashboard.html', ico: 'grid' },
      { key: 'queue',     name: 'Live Pipeline',      href: 'queue.html',     ico: 'queue' },
      { key: 'batch',     name: 'Daily B2C Batch',    href: 'batch.html',     ico: 'refresh' },
      { key: 'inbound',   name: 'Inbound & RCM',      href: 'inbound.html',   ico: 'inbox' },
      { key: 'asp',       name: 'ASP Exchange',       href: 'asp.html',       ico: 'send' }
    ]},
    { label: 'OTA positions', items: [
      { key: 'prepaid',   name: 'Prepaid top-ups',    href: 'prepaid.html',   ico: 'doc', tag: 'TBC' },
      { key: 'usage',     name: 'Out-of-bundle',      href: 'usage.html',     ico: 'doc', tag: 'TBC' }
    ]},
    { label: 'Records', items: [
      { key: 'history',   name: 'Processing History', href: 'history.html',   ico: 'history' },
      { key: 'reports',   name: 'Reports',            href: 'reports.html',   ico: 'chart' }
    ]},
    { label: 'Reference', items: [
      { key: 'mapping',   name: 'Mapping Studio',     href: 'mapping.html',   ico: 'map' },
      { key: 'document',  name: 'Document Inspector', href: 'document.html',  ico: 'file' },
      { key: 'value',     name: 'Why Fawtara',        href: 'value.html',     ico: 'shield' }
    ]}
  ],
  erp: [
    { label: 'Billing', items: [
      { key: 'billing',   name: 'B2B Invoices',       href: 'billing.html',  ico: 'file' },
      { key: 'consumer',  name: 'Consumer Billing',   href: 'consumer.html', ico: 'users' },
      { key: 'payments',  name: 'Incoming Payments',  href: '#',             ico: 'chart' }
    ]},
    { label: 'E-Invoicing', items: [
      { key: 'sync',      name: 'E-Invoice Status',   href: 'sync.html',     ico: 'sync' },
      { key: 'settings',  name: 'Settings',           href: '#',             ico: 'plug' }
    ]}
  ]
};

const BRAND = {
  hub: { mark: 'V', name: 'Vodafone Oman', sub: 'E-Invoicing Console', who: 'VT', whoName: 'E-Invoicing team', whoRole: 'Fawtara administrator' },
  erp: { mark: 'V', name: 'Vodafone Oman', sub: 'Your billing system', who: 'BR', whoName: 'Billing operations', whoRole: 'Revenue & billing' }
};

const ENV = { hub: 'Central Hub', erp: 'Your systems' };

/* --- sidebar collapse ------------------------------------------------------
   Each of the 13 screens is a separate page load, so the collapsed state has
   to survive unload or the sidebar springs back open on every Next.
   localStorage throws in a sandboxed iframe and on file:// under some
   browsers, so every access is guarded — the toggle must never be the thing
   that breaks the walkthrough. */
const RAIL_KEY = 'vodafone.hub.rail.';

/* Which screens share one collapse setting. Returns a storage key suffix, or
   a falsy value to not remember the state at all.
      ''       one setting across the entire walkthrough
      surface  'hub' | 'erp' | 'portal' — each remembers separately
   Returning nothing is safe: the toggle still works, it just resets per page. */
function railScope(surface) {
  /* Each surface remembers its own collapsed state. */
  return surface || '';
}

function storedRail(surface) {
  const scope = railScope(surface);
  if (scope == null) return null;
  try { return localStorage.getItem(RAIL_KEY + scope) === '1'; } catch (e) { return null; }
}
function saveRail(surface, on) {
  const scope = railScope(surface);
  if (scope == null) return;
  try { localStorage.setItem(RAIL_KEY + scope, on ? '1' : '0'); } catch (e) { /* ignore */ }
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
  /* title= carries the name once the label is hidden. Set unconditionally —
     a native tooltip on an already-legible label is harmless, and it means
     rail mode needs no second code path. */
  aside.innerHTML = `
    <a class="brand" href="../index.html" title="${brand.name} — ${brand.sub}">
      <span class="brand-mark">${brand.mark}</span>
      <span class="stack">
        <span class="brand-name">${brand.name}</span>
        <span class="brand-sub">${brand.sub}</span>
      </span>
    </a>
    <div class="poweredby" title="Powered by Fawtara X">
      <span class="pb-k">Powered by</span>
      <span class="pb-b">
        <img src="../assets/img/fawtara-mark.png" alt="">
        <span>Fawtara X</span>
      </span>
    </div>
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
             title="${i.name}${i.tag ? ' (' + i.tag + ')' : ''}">
            ${icon(i.ico)}<span>${i.name}</span>
            ${i.tag ? `<span class="nav-tag">${i.tag}</span>` : ''}
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

  /* ---- expanders: one delegated listener serves every page ---- */
  document.addEventListener('click', (e) => {
    const h = e.target.closest && e.target.closest('.exp-h');
    if (!h) return;
    const row = h.closest('.exp');
    const open = row.classList.toggle('is-open');
    h.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  const footer = document.createElement('div');
  footer.className = 'footer';
  footer.innerHTML = `
    <span>Demonstration prototype — Vodafone Oman is real, every figure and treatment is illustrative</span>
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
  let railed = storedRail(surface) === true;

  function setRail(on, animate) {
    railed = on;
    /* Suppress the transition on the initial application only. */
    if (!animate) app.style.transition = 'none';
    app.classList.toggle('is-rail', on);
    toggle.setAttribute('aria-expanded', on ? 'false' : 'true');
    toggle.title = on ? 'Expand the menu' : 'Collapse the menu';
    if (!animate) requestAnimationFrame(() => { app.style.transition = ''; });
  }
  setRail(railed, false);

  toggle.addEventListener('click', () => { setRail(!railed, true); saveRail(surface, railed); });

  /* keyboard: ← / → move through the walkthrough, [ folds the menu away */
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea, select')) return;
    if (e.key === 'ArrowRight' && next) location.href = next.href;
    if (e.key === 'ArrowLeft' && prev) location.href = prev.href;
    if (e.key === '[') { setRail(!railed, true); saveRail(surface, railed); }
  });
});
