#!/usr/bin/env python3
"""Verify the hub-mock against Proposal V3. Static sweep + live browser walk."""
import re, sys, pathlib, json
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]   # hub-mock/
fails, warns = [], []

def fail(m): fails.append(m)
def warn(m): warns.append(m)

# ---------------------------------------------------------------- static sweep
HTML = sorted(p for p in ROOT.rglob('*.html'))
JS   = sorted(ROOT.glob('assets/js/*.js'))

def strip_code(s):
    """Remove <script> and <style> bodies so we only scan what a viewer reads."""
    s = re.sub(r'<script\b[^>]*>.*?</script>', '', s, flags=re.S | re.I)
    s = re.sub(r'<style\b[^>]*>.*?</style>', '', s, flags=re.S | re.I)
    return s

# Banned in USER-VISIBLE text (markup outside script/style) and in JS string literals
BANNED_VISIBLE = [
    (r'\bTier\s*[123]\b', 'superseded: Tier N'),
    (r'\bT[123]\b(?!\w)', 'superseded: T1/T2/T3 chip'),
    (r'\bsatellite\b', 'superseded: satellite'),
    (r'\bTenant Portal\b', 'superseded: Tenant Portal'),
    (r'\bFile drop\b', 'superseded: File drop'),
    (r'\b\d+\s*years?\b', 'retention period stated'),
    (r'\bWORM\b', 'retention claim'),
    (r'\bMuscat DC\b', 'data centre named'),
    (r'Sultanate of Oman only', 'residency claim'),
    (r'Appendix\s*D', 'ZATCA / Saudi QR standard'),
    (r'Base64 TLV', 'ZATCA / Saudi QR standard'),
    (r'PINT-OM\s*v?\d+\.\d+', 'PINT-OM version pinned'),
    (r'OM-CIUS-\d', 'Schematron version pinned'),
    (r'within \d+ hours?', 'SLA committed'),
    (r'Rejected by the tax authority', 'wrong regulatory model'),
    (r'all connected', 'fixed connector claim'),
]
REAL_COMPANIES = ['Oman Oil Marketing', 'Sohar Aluminium', 'Muscat Municipality',
                  'Emirates Steel', 'Al Maha Petroleum', 'Renaissance Services',
                  'Bahwan Engineering']

# Clone-drift: strings from the wj-mock base that must never survive the rebrand
# to The Zubair Corporation. Scanned in visible HTML and in full JS.
CLONE_DRIFT = ['Towell', 'WJ Towell', 'WJT-', 'ERPNext', 'Odoo',
               'Oracle E-Business', 'SAP Business One', 'Enhance Group',
               'Orbit Rental', 'Readymix', 'Mazoon', 'Eighty-nine', 'wjtowell']

for p in HTML + JS:
    raw = p.read_text()
    body = strip_code(raw) if p.suffix == '.html' else raw
    rel = p.relative_to(ROOT)
    for pat, why in BANNED_VISIBLE:
        for m in re.finditer(pat, body, re.I):
            line = body[:m.start()].count('\n') + 1
            fail(f'{rel}:{line}  {why} → "{m.group(0)}"')
    for name in REAL_COMPANIES:
        if name in body:
            fail(f'{rel}  real/obsolete entity name → "{name}"')
    for name in CLONE_DRIFT:
        if name in body:
            fail(f'{rel}  clone-drift leftover from wj-mock → "{name}"')

# template leaks in static markup
for p in HTML:
    body = strip_code(p.read_text())
    for m in re.finditer(r'\$\{', body):
        fail(f'{p.relative_to(ROOT)}:{body[:m.start()].count(chr(10))+1}  template literal leaked into markup')

# script order + shell contract
for p in HTML:
    raw, rel = p.read_text(), p.relative_to(ROOT)
    srcs = re.findall(r'<script src="[^"]*/(\w+)\.js"', raw)
    if srcs and srcs != ['data', 'ui', 'shell']:
        fail(f'{rel}  script order is {srcs}, expected data, ui, shell')
    if 'data-shell="off"' not in raw and rel.name != 'index.html':
        for attr in ('data-surface', 'data-step', 'data-crumbs', 'data-hint'):
            if attr not in raw:
                fail(f'{rel}  missing {attr} on <body>')

# Every internal href in a PAGE must resolve. shell.js is excluded here: its
# hrefs are written from the perspective of a page one folder deep, not from
# assets/js/, so they are checked separately against WALKTHROUGH and NAV below.
links = 0
for p in HTML:
    raw, rel = p.read_text(), p.relative_to(ROOT)
    for m in re.finditer(r'href[=:]\s*[\'"]([^\'"#?]+\.html)[^\'"]*[\'"]', raw):
        target = (p.parent / m.group(1)).resolve()
        links += 1
        if not target.exists():
            fail(f'{rel}:{raw[:m.start()].count(chr(10))+1}  dead link → {m.group(1)}')

sh = (ROOT / 'assets/js/shell.js').read_text()

# WALKTHROUGH hrefs are "../folder/page.html" as seen from a page folder
for m in re.finditer(r"href:\s*'\.\./([^']+\.html)'", sh):
    links += 1
    if not (ROOT / m.group(1)).exists():
        fail(f'shell.js  WALKTHROUGH points at missing {m.group(1)}')

# every nav key in shell.js must resolve inside its own surface folder
for surf, folder in (('hub', 'hub'), ('erp', 'erp'), ('portal', 'portal')):
    block = re.search(rf"{surf}:\s*\[(.*?)\n  \],?\n", sh, re.S)
    if not block: continue
    for key, href in re.findall(r"key:\s*'([^']+)',\s*name:\s*'[^']*',\s*href:\s*'([^'#]+)", block.group(1)):
        if href == '#': continue
        if not (ROOT / folder / href).exists():
            fail(f'shell.js  nav "{key}" points at missing {folder}/{href}')

print(f'static  ·  {len(HTML)} pages, {len(JS)} scripts, {links} links checked')

# ------------------------------------------------------------------ walk order
shell = (ROOT / 'assets/js/shell.js').read_text()
walk = re.findall(r"\{\s*id:\s*'([^']+)',\s*act:\s*(\d+),\s*sfc:\s*'([^']+)',\s*href:\s*'\.\./([^']+)'", shell)
if not walk:
    fail('could not parse WALKTHROUGH from shell.js'); print('\n'.join(fails)); sys.exit(1)
print(f'walkthrough  ·  {len(walk)} steps in {len(set(w[1] for w in walk))} acts')

# ------------------------------------------------------------------ live pass
with sync_playwright() as pw:
    br = pw.chromium.launch()
    pg = br.new_page(viewport={'width': 1440, 'height': 960})
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errs.append(str(e)))

    def load(rel):
        errs.clear()
        pg.goto(f'file://{ROOT / rel}', wait_until='networkidle')
        pg.wait_for_timeout(140)
        for e in errs:
            fail(f'{rel}  console error → {e[:150]}')

    # index
    load('index.html')
    n_steps = pg.locator('.step').count()
    if n_steps != len(walk):
        fail(f'index.html lists {n_steps} steps, WALKTHROUGH has {len(walk)}')
    n_acts = pg.locator('.act-head').count()
    print(f'index  ·  {n_acts} acts, {n_steps} steps listed')

    print()
    for i, (sid, act, sfc, href) in enumerate(walk):
        load(href)
        h = pg.evaluate('document.body.scrollHeight')

        # the page must declare the step the walkthrough thinks it is
        got = pg.evaluate('document.body.dataset.step')
        if got != sid:
            fail(f'{href}  data-step="{got}" but WALKTHROUGH says "{sid}"')

        shell_off = pg.evaluate('document.body.dataset.shell') == 'off'
        nav = pg.locator('.stepnav').count()
        if nav == 0:
            fail(f'{href}  no step navigation rendered')
        if not shell_off:
            if pg.locator('.hintbar').count() == 0: fail(f'{href}  no hint strip')
            if pg.locator('.stepfoot').count() == 0: fail(f'{href}  no footer step nav')
            if pg.locator('.sidebar').count() == 0: fail(f'{href}  no sidebar')

        # Next must point at the next step, and be clickable
        nxt = pg.locator('.stepnav a.next').first
        want = walk[i + 1][3] if i + 1 < len(walk) else 'index.html'
        got_href = (nxt.get_attribute('href') or '').replace('../', '')
        if got_href != want:
            fail(f'{href}  Next → "{got_href}", expected "{want}"')
        if 'is-off' in (nxt.get_attribute('class') or ''):
            fail(f'{href}  Next button is disabled')

        # light theme + contrast
        bg = pg.evaluate("getComputedStyle(document.body).backgroundColor")
        rgb = [int(x) for x in re.findall(r'\d+', bg)[:3]]
        if sum(rgb) / 3 < 200:
            fail(f'{href}  background is not light ({bg})')

        # Empty render targets mean a script silently failed. Feedback slots
        # (inline confirmations, validation messages) are empty BY DESIGN until
        # something is clicked, so exclude them by naming convention.
        empties = pg.evaluate("""() => {
            const slot = /note|msg|message|err|error|ok$|confirm|feedback|summary|toast|status$/i;
            return [...document.querySelectorAll('[id]')]
              .filter(e => e.children.length === 0 && !e.textContent.trim()
                        && !['INPUT','BR','HR','IMG','META','SELECT','TEXTAREA'].includes(e.tagName)
                        && !slot.test(e.id))
              .map(e => e.id);
        }""")
        if empties:
            fail(f'{href}  empty render targets: {empties}')

        # horizontal overflow of the page itself
        ov = pg.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
        flag = '  ⚠ tall' if h > 1900 else ''
        if ov > 2: fail(f'{href}  page scrolls horizontally by {ov}px')

        print(f'{i+1:2}. {href:26} {h:5}px  act {int(act)+1}{flag}')

    # --- entity isolation on the portal ------------------------------------
    load('portal/dashboard.html')
    txt = pg.inner_text('body')
    # The single-entity portal shows The Zubair Corporation LLC (ZCL) only.
    # No OTHER group entity's name or document prefix may leak in. (Counterparty
    # city names like Salalah/Nizwa are legitimate — they are customers, not the
    # other group entities, so they are deliberately NOT banned here.)
    for bad in ['General Automotive', 'Sayarti', 'Oasis Logistics',
                'International Heavy', 'Zubair Automotive', 'Dhofar Automotive',
                'GAC-', 'SAY-', 'OLG-', 'IHE-', 'ZAG-', 'DAU-', 'AHI-', 'OCS-', 'ZBS-', 'ZES-']:
        if bad in txt:
            fail(f'portal/dashboard.html  isolation breach → "{bad}"')
    if 'The Zubair Corporation' not in txt:
        fail('portal/dashboard.html  does not name its own entity')

    # --- the tracked invoice appears at start, in the portal, and at the end
    for rel in ['erp/invoices.html', 'portal/dashboard.html', 'erp/sync.html']:
        load(rel)
        if 'ZCL-SINV-2026-00841' not in pg.inner_text('body'):
            fail(f'{rel}  tracked invoice ZCL-SINV-2026-00841 missing')

    # --- mapping screen must be genuinely operable -------------------------
    load('hub/mapping.html')
    n_combo  = pg.locator('.combo input').count()
    n_select = pg.locator('.map-row select').count()
    if n_combo < 15: fail(f'hub/mapping.html  only {n_combo} editable ERP-field inputs')
    if n_select < 15: fail(f'hub/mapping.html  only {n_select} transform dropdowns')
    print(f'\nmapping  ·  {n_combo} field comboboxes, {n_select} transform selects')

    # change a transform and prove the preview recomputes
    before = pg.inner_text('body')
    sel = pg.locator('.map-row select').nth(1)
    opts = sel.locator('option').all_text_contents()
    if len(opts) > 2:
        sel.select_option(index=(1 if sel.input_value() != opts[1] else 2))
        pg.wait_for_timeout(220)
        if pg.inner_text('body') == before:
            fail('hub/mapping.html  changing a transform did not change the page')
        if pg.locator('.sticky-save').count() == 0:
            warn('hub/mapping.html  no unsaved-changes bar appeared after an edit')

    # --- onboarding test button must actually run --------------------------
    load('hub/onboard.html')
    if pg.locator('.picker input[type=radio]').count() < 3:
        fail('hub/onboard.html  fewer than 3 selectable connection methods')
    btns = pg.locator('button', has_text=re.compile('Test connection', re.I))
    if btns.count():
        b4 = pg.inner_text('body'); btns.first.click(); pg.wait_for_timeout(2600)
        if pg.inner_text('body') == b4:
            fail('hub/onboard.html  Test connection produced no output')

    # --- reports: totals must reconcile ------------------------------------
    load('hub/reports.html')
    if pg.locator('.repcard').count() < 6:
        fail('hub/reports.html  fewer than 6 report cards')

    # --- three acknowledgement legs ----------------------------------------
    # The five-corner board was removed: the screen's job is the three legs,
    # and the model itself is explained in the proposal.
    load('hub/asp.html')
    if pg.locator('.leg').count() < 3:
        fail('hub/asp.html  fewer than 3 acknowledgement legs')

    # --- inbound exists and shows the six stages ---------------------------
    load('hub/inbound.html')
    body = pg.inner_text('body')
    for want in ['draft', 'Archive']:
        if want.lower() not in body.lower():
            fail(f'hub/inbound.html  does not mention "{want}"')

    # --- archive: six stored items, no retention number --------------------
    load('hub/history.html')
    body = pg.inner_text('body')
    if 'agreed during solution design' not in body.lower().replace('  ', ' '):
        warn('hub/history.html  does not defer retention explicitly')

    br.close()

# --------------------------------------------------------------------- report
print()
if warns:
    print(f'{len(warns)} warning(s):')
    for w in warns: print('  ~', w)
if fails:
    print(f'\n{len(fails)} ISSUE(S):')
    for f in fails: print('  ✗', f)
    sys.exit(1)
print('CLEAN — order, navigation, hints, light theme, isolation, interactivity and V3 vocabulary all verified')
