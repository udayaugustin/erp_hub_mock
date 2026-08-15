/* ==========================================================================
   Al Nasr Marbles E-Invoicing — application shell + guided walkthrough
   Injects sidebar, topbar (with step navigation), hint strip and footer.
   Configured by data-* attributes on <body>:
     data-surface  hub | erp | portal
     data-nav      active sidebar key
     data-step     id from WALKTHROUGH below — drives Previous / Next
     data-crumbs   "Parent / Child"
     data-hint     one sentence: what the viewer is looking at
     data-shell    "off" to skip the shell entirely (auth screens)
   All page files live one folder deep, so cross-surface links use ../
   ========================================================================== */

/* THE canonical screen order. Everything else derives from this list.
   Six acts. Reorder here and the whole walkthrough reorders. */
const ACTS = [
  { n: 'I',   t: 'It starts in your system',            d: 'Nothing about how you work changes' },
  { n: 'II',  t: 'Your compliance dashboard',           d: 'Your invoices, failures and what needs attention' },
  { n: 'III', t: 'Setup, not installation',             d: 'Connect the ERP and map the fields — configuration only' },
  { n: 'IV',  t: 'One invoice, end to end',             d: 'Where it is, and proven correct before it is sent' },
  { n: 'V',   t: 'The other direction, and the record', d: 'Supplier invoices, history and reports' },
  { n: 'VI',  t: 'Logins and the finance view',         d: 'Company logins, and the lighter view for finance users' }
];

const WALKTHROUGH = [
  /* Act I */
  { id: 'erp-invoices',  act: 0, sfc: 'erp',    href: '../erp/invoices.html',
    name: 'An invoice raised in the ERP',   blurb: 'A normal sales invoice, created and submitted as usual.' },
  /* hub/boundary.html is deliberately NOT in the walkthrough. The screen still
     exists and can be opened directly, but it is not part of the click-through. */
  { id: 'hub-login',     act: 0, sfc: 'hub',    href: '../hub/login.html',
    name: 'Signing in',                     blurb: 'The company compliance team logs in.' },

  /* Act II */
  { id: 'hub-dashboard', act: 1, sfc: 'hub',    href: '../hub/dashboard.html',
    name: 'Your compliance status on one screen', blurb: 'Volumes, failures, and anything that has gone quiet.' },

  /* Act III */
  { id: 'hub-onboard',   act: 2, sfc: 'hub',    href: '../hub/onboard.html',
    name: 'Connecting the ERP',             blurb: 'Choose how to connect, enter the details, test it live.' },
  { id: 'hub-mapping',   act: 2, sfc: 'hub',    href: '../hub/mapping.html',
    name: 'Pointing their fields at the standard ones', blurb: 'Typed and chosen by an analyst. No code is written.' },

  /* Act IV */
  { id: 'hub-queue',     act: 3, sfc: 'hub',    href: '../hub/queue.html',
    name: 'Where every document is right now', blurb: 'The nine stages, and what is sitting in each.' },
  { id: 'hub-document',  act: 3, sfc: 'hub',    href: '../hub/document.html',
    name: 'Built, then checked',            blurb: 'The official XML, proven correct before anything is sent.' },
  /* hub/asp.html is skipped in the walkthrough. The page and its sidebar entry
     remain, so ASP Exchange is still reachable from the console — it is simply
     not one of the guided steps. */

  /* Act V */
  { id: 'hub-inbound',   act: 4, sfc: 'hub',    href: '../hub/inbound.html',
    name: 'Supplier invoices arriving',     blurb: 'Routed, archived, and landed as a draft nobody posted for you.' },
  { id: 'hub-history',   act: 4, sfc: 'hub',    href: '../hub/history.html',
    name: 'Everything, searchable',         blurb: 'Both directions, and what the archive holds for each document.' },
  { id: 'hub-reports',   act: 4, sfc: 'hub',    href: '../hub/reports.html',
    name: 'Reports',                        blurb: 'VAT summaries, reporting completeness, exception ageing.' },

  /* Act VI — access is granted first, then used. Users & Access sits here
     rather than with the onboarding screens so the login it issues is the
     very next thing the audience sees being used. */
  { id: 'hub-users',     act: 5, sfc: 'hub',    href: '../hub/users.html',
    name: 'Giving each user their login',   blurb: 'How users get access, and who administers it.' },
  { id: 'portal-login',  act: 5, sfc: 'portal', href: '../portal/login.html',
    name: 'A finance user signs in',        blurb: 'Their own credentials, issued by the administrator.' },
  { id: 'portal-home',   act: 5, sfc: 'portal', href: '../portal/dashboard.html',
    name: 'The finance view',               blurb: 'A lighter view for finance users — invoices, failures and reports.' },
  { id: 'erp-sync',      act: 5, sfc: 'erp',    href: '../erp/sync.html',
    name: 'The answer, back on the invoice', blurb: 'Reference, status and QR on the original ERP record.' }
];

const NAV = {
  hub: [
    { label: 'Operations', items: [
      { key: 'dashboard', name: 'Dashboard',          href: 'dashboard.html', ico: 'grid' },
      { key: 'queue',     name: 'Processing Queue',   href: 'queue.html',     ico: 'queue' },
      { key: 'inbound',   name: 'Inbound Documents',  href: 'inbound.html',   ico: 'inbox' },
      { key: 'asp',       name: 'ASP Exchange',       href: 'asp.html',       ico: 'send' }
    ]},
    { label: 'Records', items: [
      { key: 'history',   name: 'Processing History', href: 'history.html',   ico: 'history' },
      { key: 'reports',   name: 'Reports',            href: 'reports.html',   ico: 'chart' }
    ]},
    { label: 'Configuration', items: [
      { key: 'onboard',   name: 'ERP Connection',     href: 'onboard.html',   ico: 'plus' },
      { key: 'mapping',   name: 'Mapping Studio',     href: 'mapping.html',   ico: 'map' },
      { key: 'users',     name: 'Users & Access',     href: 'users.html',     ico: 'users' },
      { key: 'document',  name: 'Document Inspector', href: 'document.html',  ico: 'doc' }
    ]}
  ],
  erp: [
    { label: 'Accounts Receivable', items: [
      { key: 'invoices',  name: 'Sales Invoices',     href: 'invoices.html', ico: 'file' },
      { key: 'customers', name: 'Customers',          href: '#',             ico: 'users' },
      { key: 'payments',  name: 'Payment Entry',      href: '#',             ico: 'chart' }
    ]},
    { label: 'E-Invoicing', items: [
      { key: 'sync',      name: 'E-Invoice Status',   href: 'sync.html',     ico: 'sync' },
      { key: 'settings',  name: 'Settings',           href: '#',             ico: 'plug' }
    ]}
  ],
  portal: [
    { label: 'My organisation', items: [
      { key: 'dashboard', name: 'Overview',           href: 'dashboard.html', ico: 'grid' },
      { key: 'invoices',  name: 'My Invoices',        href: 'dashboard.html#invoices', ico: 'file' },
      { key: 'supplier',  name: 'Supplier Invoices',  href: 'dashboard.html#supplier', ico: 'inbox' },
      { key: 'failures',  name: 'Needs my attention', href: 'dashboard.html#failures', ico: 'alert', tag: '3' }
    ]},
    { label: 'My company', items: [
      { key: 'myreports', name: 'My Reports',         href: 'dashboard.html#reports', ico: 'chart' },
      { key: 'myusers',   name: 'My Users',           href: 'dashboard.html#users',   ico: 'users' }
    ]}
  ]
};

const BRAND = {
  hub:    { mark: 'N', name: 'Al Nasr Marbles',  sub: 'E-Invoicing',          who: 'AN', whoName: 'A. Al-Nabhani', whoRole: 'Compliance administrator' },
  erp:    { mark: 'N', name: 'Al Nasr Marbles',  sub: 'ERPNext v15',          who: 'SR', whoName: 'S. Al-Rashdi',  whoRole: 'Accounts Receivable' },
  portal: { mark: 'N', name: 'Al Nasr Marbles',  sub: 'Finance view',         who: 'HH', whoName: 'H. Al-Hinai',   whoRole: 'Finance' }
};

const ENV = { hub: 'Compliance system', erp: 'Your ERP', portal: 'Finance view' };

/* --- sidebar collapse ------------------------------------------------------
   Each of the 18 screens is a separate page load, so the collapsed state has
   to survive unload or the sidebar springs back open on every Next.
   localStorage throws in a sandboxed iframe and on file:// under some
   browsers, so every access is guarded — the toggle must never be the thing
   that breaks the walkthrough. */
const RAIL_KEY = 'alnasr.hub.rail.';

/* Which screens share one collapse setting. Returns a storage key suffix, or
   a falsy value to not remember the state at all.
      ''       one setting across the entire walkthrough
      surface  'hub' | 'erp' | 'portal' — each remembers separately
   Returning nothing is safe: the toggle still works, it just resets per page. */
function railScope(surface) {
  // TODO(human)
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
    <span>Demonstration prototype — company names are real, every figure is illustrative</span>
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
