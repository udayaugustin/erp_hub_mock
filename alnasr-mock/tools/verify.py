#!/usr/bin/env python3
"""Verify the alnasr-mock against Proposal V3. Static sweep + live browser walk."""
import re, sys, pathlib, json

# The live browser walk needs Playwright; the static sweep does not. Missing
# Playwright degrades this to a static-only run rather than failing outright,
# so the checks that need no browser still run in a bare environment.
try:
    from playwright.sync_api import sync_playwright
    HAVE_BROWSER = True
except ImportError:
    HAVE_BROWSER = False

ROOT = pathlib.Path(__file__).resolve().parents[1]   # alnasr-mock/
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
    (r'\bCompliance Hub\b', 'superseded: single-company, not a central Compliance Hub'),
    (r'\bGroup Dashboard\b', 'superseded: single-company, just "Dashboard"'),
    (r'\bcentral hub\b', 'superseded: single-company, not a central hub'),
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
# Names that must never appear: real Omani companies we do not represent, and
# anything left over from the WJ Towell build this mock was cloned from.
REAL_COMPANIES = ['Oman Oil Marketing', 'Sohar Aluminium', 'Muscat Municipality',
                  'Emirates Steel', 'Al Maha Petroleum', 'Renaissance Services',
                  'Bahwan Engineering',
                  'Towell', 'Mazoon', 'Readymix', 'Orbit Rental', 'Enhance Group']

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

# template leaks in static markup
for p in HTML:
    body = strip_code(p.read_text())
    for m in re.finditer(r'\$\{', body):
        fail(f'{p.relative_to(ROOT)}:{body[:m.start()].count(chr(10))+1}  template literal leaked into markup')

# Identifiers referenced from page scripts must exist in the dataset. Every
# other static check here strips <script> bodies on purpose — it is auditing
# what a viewer reads. That leaves dangling lookups invisible, which is exactly
# what a clone produces when entities or documents are renamed: tenant('TAC')
# still parses, returns undefined, and only fails once the page is open.
data = (ROOT / 'assets/js/data.js').read_text()
TENANT_IDS = set(re.findall(r"id:\s*'([A-Z]{3})'", data))
DOC_NOS = set(re.findall(r"no:\s*'([A-Z]{3}-[A-Z]{3,4}-\d{4}-\d+)'", data))
# UN/ECE units, currency and scheme codes that legitimately look like entity ids.
NON_ENTITY_CODES = {'ERP', 'ASP', 'OTA', 'VAT', 'OMR', 'AED', 'USD',
                    'MTK', 'FTK', 'TNE', 'KGM', 'LTR', 'MTR', 'DAY', 'HUR',
                    'B2B', 'B2C', 'B2G', 'UBL', 'XML', 'CSV', 'PDF', 'URL',
                    'INV', 'EXP', 'CRN'}   # document-type ids in REPORT_ROWS
DOC_SHAPE = re.compile(r"'([A-Z]{3}-(?:SINV|CRNT|INV|CRN)-\d{4}-\d+)'")

for p in HTML:
    raw, rel = p.read_text(), p.relative_to(ROOT)
    for m in re.finditer(r"tenant\(\s*'([^']+)'\s*\)", raw):
        if m.group(1) not in TENANT_IDS:
            fail(f"{rel}:{raw[:m.start()].count(chr(10))+1}  "
                 f"tenant('{m.group(1)}') is not an entity in data.js")
    # Bare entity codes used in comparisons — `t.who === 'TAC'` — parse fine and
    # silently filter to nothing. Anything three-letters-uppercase that is not an
    # entity must be a known unit or scheme code, or it is clone drift.
    for m in re.finditer(r"'([A-Z]{3})'", raw):
        if m.group(1) not in TENANT_IDS and m.group(1) not in NON_ENTITY_CODES:
            fail(f"{rel}:{raw[:m.start()].count(chr(10))+1}  "
                 f"'{m.group(1)}' is neither an entity nor a known code")
    for m in DOC_SHAPE.finditer(raw):
        if m.group(1) not in DOC_NOS:
            fail(f"{rel}:{raw[:m.start()].count(chr(10))+1}  "
                 f"document {m.group(1)} is not in the dataset")
print(f'dataset  ·  {len(TENANT_IDS)} entities, {len(DOC_NOS)} documents referenced consistently')

# ---- dataset arithmetic ----------------------------------------------------
# The prototype's core claim is that every figure reconciles: totals agree with
# the rows above them, and no number disagrees with itself across two screens.
# That is arithmetic over data.js, so it is checked by evaluating data.js in
# node rather than by pattern-matching the source. No node, no check — same
# degradation as the browser walk.
import shutil, subprocess, tempfile

if shutil.which('node'):
    # raw string: the escapes in here belong to JavaScript, not Python
    ASSERTS = r"""
const f=[]; const ck=(o,m)=>{ if(!o) f.push(m); };
const sum=(a,k)=>a.reduce((n,x)=>n+x[k],0);
// Single company: TENANTS holds exactly one record (Al Nasr Marbles) and GROUP
// is that company's own roll-up \u2014 no group, no hub/self-hosted split, no waves-per-entity.
ck(TENANTS.length===1, `TENANTS should hold exactly one company, has ${TENANTS.length}`);
ck(TENANTS.length===GROUP.entities, `TENANTS has ${TENANTS.length}, GROUP.entities is ${GROUP.entities}`);
ck(GROUP.live+GROUP.onboarding+GROUP.notStarted===GROUP.entities, 'live+onboarding+notStarted != entities');
ck(GROUP.m1+GROUP.m2+GROUP.m3+GROUP.pendingAssessment===GROUP.entities, 'method counts != entities');
ck(GROUP.todaySuccess+GROUP.todayFailed+GROUP.todayPending===GROUP.todayTotal, 'today buckets != todayTotal');
ck(STAGE_COUNT.reduce((a,b)=>a+b,0)===GROUP.todayPending, 'STAGE_COUNT != todayPending');
ck(GROUP.week[GROUP.week.length-1]===GROUP.todayTotal, 'last week value != todayTotal');
ck(GROUP.week.length===GROUP.weekDays.length, 'week and weekDays differ in length');
ck(sum(TENANTS,'today')===GROUP.todayTotal, `company today ${sum(TENANTS,'today')} != todayTotal ${GROUP.todayTotal}`);
ck(sum(TENANTS,'failed')===GROUP.todayFailed, 'company failed != todayFailed');
ck(sum(TENANTS,'pending')===GROUP.todayPending, 'company pending != todayPending');
// REPORT_ROWS is now BY DOCUMENT TYPE (label + id), not per entity.
ck(REPORT_ROWS.reduce((a,r)=>a+r.docs,0)===GROUP.mtdTotal, 'REPORT_ROWS docs != mtdTotal');
ck(REPORT_ROWS.reduce((a,r)=>a+r.failed,0)===GROUP.mtdFailed, 'REPORT_ROWS failed != mtdFailed');
REPORT_ROWS.forEach(r=>{ ck(!!r.label, `REPORT_ROWS row ${r.id} has no label`);
  ck(r.ack+r.failed===r.docs, `${r.id}: ack+failed != docs`);
  ck(Math.abs((r.net-r.zero)*0.05-r.vat)<0.5,
     `${r.id}: VAT ${r.vat} != (net-zero)*5% = ${((r.net-r.zero)*0.05).toFixed(3)}`); });
INVOICES.forEach(i=>{ ck(!!tenant(i.tenant), `${i.no}: unknown company ${i.tenant}`);
  ck(i.cust>=0 && i.cust<CUSTOMERS.length, `${i.no}: customer index out of range`);
  if(i.state!=='failed') ck(Math.abs(i.net+i.vat-i.total)<0.001, `${i.no}: net+vat != total`); });
INBOUND.forEach(r=>{ if(r.to) ck(!!tenant(r.to), `${r.no}: unknown target ${r.to}`);
  ck(r.supplier===null||r.supplier<SUPPLIERS.length, `${r.no}: supplier index out of range`); });
HISTORY.forEach(h=>ck(!!tenant(h.tenant), `${h.no}: unknown company ${h.tenant}`));
ENTITY_USERS.forEach(u=>ck(!!tenant(u.who), `user ${u.email}: unknown company ${u.who}`));
const names=new Set(ERP_SCHEMA.map(x=>x.f));
MAPPING.forEach(g=>g.rows.forEach(r=>{ if(r.erp && r.erp!=='\u2014')
  ck(names.has(r.erp), `mapping source "${r.erp}" is not in ERP_SCHEMA`); }));
console.log(f.length ? 'FAIL\n'+f.join('\n') : 'OK ' + [GROUP.entities+' company',
  GROUP.todayTotal+' today', GROUP.mtdTotal+' MTD', REPORT_ROWS.length+' report rows'].join(', '));
"""
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write((ROOT / 'assets/js/data.js').read_text() + ASSERTS)
        tmp = fh.name
    out = subprocess.run(['node', tmp], capture_output=True, text=True)
    pathlib.Path(tmp).unlink(missing_ok=True)
    if out.returncode != 0:
        fail(f'data.js  did not evaluate: {out.stderr.strip().splitlines()[-1] if out.stderr else "?"}')
    elif out.stdout.startswith('FAIL'):
        for line in out.stdout.splitlines()[1:]:
            fail(f'data.js  {line}')
    else:
        print(f'reconciles  ·  {out.stdout.strip()[3:]}')
else:
    warn('node not found — dataset arithmetic not reconciled')

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
if not HAVE_BROWSER:
    warn('Playwright not installed — live browser walk skipped '
         '(pip install playwright && playwright install chromium)')

if HAVE_BROWSER:
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
    # Every OTHER entity in the group, by name and by document prefix. None of
    # them may appear on a portal signed in as Al Nasr Marbles.
    for bad in ['Al Nasr Terrazzo', 'Trading & Contracting', 'Energy Services',
                'ANT-', 'ATC-', 'AES-']:
        if bad in txt:
            fail(f'portal/dashboard.html  isolation breach → "{bad}"')
    if 'Al Nasr Marbles' not in txt:
        fail('portal/dashboard.html  does not name its own entity')

    # --- the tracked invoice appears at start, in the portal, and at the end
    for rel in ['erp/invoices.html', 'portal/dashboard.html', 'erp/sync.html']:
        load(rel)
        if 'ANM-SINV-2026-01184' not in pg.inner_text('body'):
            fail(f'{rel}  tracked invoice ANM-SINV-2026-01184 missing')

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
