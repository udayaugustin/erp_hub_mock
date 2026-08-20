#!/usr/bin/env python3
"""Verify the Vodafone Oman × Fawtara scope-walkthrough mock. Static sweep + live browser walk."""
import re, sys, pathlib, json
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]   # vodafone-mock/
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
    (r'\bsatellite\b', 'superseded: satellite'),
    (r'\b\d+\s*years?\b', 'retention period stated'),
    (r'\bWORM\b', 'retention claim'),
    (r'\bMuscat DC\b', 'data centre named'),
    (r'Appendix\s*D', 'ZATCA / Saudi QR standard'),
    (r'Base64 TLV', 'ZATCA / Saudi QR standard'),
    (r'PINT-OM\s*v?\d+\.\d+', 'PINT-OM version pinned'),
    (r'OM-CIUS-\d', 'Schematron version pinned'),
    (r'within \d+ hours?', 'SLA committed'),
    (r'Rejected by the tax authority', 'wrong regulatory model'),
]
REAL_COMPANIES = ['Oman Oil Marketing', 'Sohar Aluminium', 'Muscat Municipality',
                  'Emirates Steel', 'Al Maha Petroleum', 'Renaissance Services',
                  'Bahwan Engineering']

# Clone-drift: strings from the wj-mock / zubair base that must never survive
# the rebrand to Vodafone Oman (a single entity, generic system labels — so
# named ERP products and the Zubair group entities are all drift). Scanned in
# visible HTML and in full JS.
CLONE_DRIFT = ['Towell', 'WJ Towell', 'WJT-', 'wjtowell', 'ERPNext', 'Odoo',
               'Enhance Group', 'Orbit Rental', 'Readymix', 'Mazoon',
               'Zubair', 'ZUB-', 'ZCL-', 'GAC-', 'Al-Hilal', 'Oman Computer',
               'Zakher', 'Dhofar Automotive', 'General Automotive', 'Sayarti',
               'Oasis Logistics', 'International Heavy',
               'Autoline', 'Orion 11J', 'FOCUS X', 'S/4HANA', 'Fiori',
               'SAP Business One', 'Oracle E-Business']
# Named ERP/BSS products must not appear on the origin surface — Vodafone's
# systems are shown generically. (Checked live on the origin pages too.)
NAMED_PRODUCTS = ['SAP', 'Autoline', 'Oracle', 'Dynamics 365', 'NetSuite', 'Odoo']

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
            fail(f'{rel}  clone-drift leftover → "{name}"')

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

# Every internal href in a PAGE must resolve.
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
# (the "erp" surface lives in the origin/ folder for this mock)
for surf, folder in (('hub', 'hub'), ('erp', 'origin')):
    block = re.search(rf"{surf}:\s*\[(.*?)\n  \],?\n", sh, re.S)
    if not block: continue
    for key, href in re.findall(r"key:\s*'([^']+)',\s*name:\s*'[^']*',\s*href:\s*'([^'#]+)", block.group(1)):
        if href == '#': continue
        if not (ROOT / folder / href).exists():
            fail(f'shell.js  nav "{key}" points at missing {folder}/{href}')

print(f'static  ·  {len(HTML)} pages, {len(JS)} scripts, {links} links checked')

# ------------------------------------------------------------------ walk order
walk = re.findall(r"\{\s*id:\s*'([^']+)',\s*act:\s*(\d+),\s*sfc:\s*'([^']+)',\s*href:\s*'\.\./([^']+)'", sh)
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

        nxt = pg.locator('.stepnav a.next').first
        want = walk[i + 1][3] if i + 1 < len(walk) else 'index.html'
        got_href = (nxt.get_attribute('href') or '').replace('../', '')
        if got_href != want:
            fail(f'{href}  Next → "{got_href}", expected "{want}"')
        if 'is-off' in (nxt.get_attribute('class') or ''):
            fail(f'{href}  Next button is disabled')

        bg = pg.evaluate("getComputedStyle(document.body).backgroundColor")
        rgb = [int(x) for x in re.findall(r'\d+', bg)[:3]]
        if sum(rgb) / 3 < 200:
            fail(f'{href}  background is not light ({bg})')

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

        ov = pg.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
        flag = '  ⚠ tall' if h > 1900 else ''
        if ov > 2: fail(f'{href}  page scrolls horizontally by {ov}px')

        print(f'{i+1:2}. {href:26} {h:5}px  act {int(act)+1}{flag}')

    # --- the origin surface must stay generic (no named ERP/BSS product) ----
    for rel in ['origin/billing.html', 'origin/consumer.html', 'origin/sync.html']:
        load(rel)
        txt = pg.inner_text('body')
        for prod in NAMED_PRODUCTS:
            if re.search(rf'\b{re.escape(prod)}\b', txt):
                fail(f'{rel}  names a specific product → "{prod}" (origin must stay generic)')
        if 'billing system' not in txt.lower():
            warn(f'{rel}  does not use the generic "billing system" label')
        if 'Vodafone' not in txt:
            fail(f'{rel}  does not name Vodafone')

    # --- the tracked invoice appears at the start, mid and end --------------
    for rel in ['origin/billing.html', 'hub/document.html', 'origin/sync.html']:
        load(rel)
        if 'VOD-INV-2026-00417' not in pg.inner_text('body'):
            fail(f'{rel}  tracked invoice VOD-INV-2026-00417 missing')

    # --- the OTA-position screens must carry the "to confirm" flag ----------
    for rel in ['hub/prepaid.html', 'hub/usage.html']:
        load(rel)
        txt = pg.inner_text('body').lower()
        if 'to confirm' not in txt:
            fail(f'{rel}  OTA position not flagged "to confirm with OTA"')

    # --- mapping screen must be genuinely operable -------------------------
    load('hub/mapping.html')
    n_combo  = pg.locator('.combo input').count()
    n_select = pg.locator('.map-row select').count()
    if n_combo < 15: fail(f'hub/mapping.html  only {n_combo} editable field inputs')
    if n_select < 15: fail(f'hub/mapping.html  only {n_select} transform dropdowns')
    print(f'\nmapping  ·  {n_combo} field comboboxes, {n_select} transform selects')

    before = pg.inner_text('body')
    sel = pg.locator('.map-row select').nth(1)
    opts = sel.locator('option').all_text_contents()
    if len(opts) > 2:
        sel.select_option(index=(1 if sel.input_value() != opts[1] else 2))
        pg.wait_for_timeout(220)
        if pg.inner_text('body') == before:
            fail('hub/mapping.html  changing a transform did not change the page')

    # --- reports: the six report cards -------------------------------------
    load('hub/reports.html')
    if pg.locator('.repcard').count() < 6:
        fail('hub/reports.html  fewer than 6 report cards')

    # --- three acknowledgement legs ----------------------------------------
    load('hub/asp.html')
    if pg.locator('.leg').count() < 3:
        fail('hub/asp.html  fewer than 3 acknowledgement legs')

    # --- inbound covers both directions: draft (inside Oman) + reverse charge
    load('hub/inbound.html')
    body = pg.inner_text('body').lower()
    for want in ['draft', 'reverse']:
        if want not in body:
            fail(f'hub/inbound.html  does not mention "{want}"')

    # --- daily batch screen shows the once-a-day model ---------------------
    load('hub/batch.html')
    body = pg.inner_text('body').lower()
    if 'batch' not in body:
        fail('hub/batch.html  does not describe the batch')

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
print('CLEAN — order, navigation, hints, light theme, generic origin, OTA positions, interactivity and vocabulary all verified')
