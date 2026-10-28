---
name: hub-mock-factory
description: Playbook for this repo — a sales-demo factory where each *-mock/ folder is a static clickable walkthrough showing a prospect how a central e-invoicing hub connects their ERP(s) to Oman's OTA (Fawtara/PINT-OM). Use when building, extending, or reviewing a mock, or when deciding how a new client demo should be scoped.
---

# Hub mock factory

This repo is a sales-demo factory, not an application. Every top-level `*-mock/` folder
(`zubair-mock`, `vodafone-mock`, `rah-mock`, `wj-mock`, `ndc-mock`, `alnasr-mock`, `hub-mock`,
…) is a standalone, static HTML/CSS/vanilla-JS clickable walkthrough built for one specific
prospect. It demonstrates how a central e-invoicing **hub** would sit between their ERP(s) and
Oman's OTA (filing via Fawtara / PINT-OM through an accredited service provider, the ASP).

There is no build step, no `package.json`, no framework. Pages are opened directly in a
browser or served with `python3 -m http.server`. The root `CLAUDE.md` in this repo is about an
unrelated tool ("context-mode MCP" context-window routing) — ignore it for anything about the
Hub product itself.

**The rule that matters most: a new mock is never built from a blank page. It is cloned from
the closest existing mock**, then its data, branding, and docs are replaced. Treat every mock
folder here as prior art.

## Anatomy of a mock

Every mock shares this skeleton (see `zubair-mock/` as the canonical multi-entity example,
`vodafone-mock/` as the canonical single-entity example):

```
<company>-mock/
  index.html                  entry point — lists acts/steps, driven by shell.js WALKTHROUGH
  README.md                   the story, the steps table, the tracked invoice, "what must agree
                               with the proposal"
  GAP-REGISTER.md             audit of the prototype against the real proposal
  PRESENTER-SCRIPT.md         narration script for whoever drives the demo
  <COMPANY>-QUESTIONS.md      open discovery questions for this prospect
  <COMPANY>-REAL-ENTITIES.md  provenance of any real company/entity names used (multi-entity only)
  assets/
    css/app.css                shared design-system tokens for all three surfaces — do not grow
                                this for a single screen; add a local <style> block instead
    css/<surface>.css          optional: a surface-specific skin (e.g. fiori.css for an
                                SAP S/4HANA-styled ERP surface, dynamics.css for Dynamics, …)
    js/data.js                 the dataset: entities/TENANTS[], one tracked demo invoice,
                                counterparties — every figure here must reconcile with verify.py
    js/ui.js                   component helpers that return HTML strings
    js/shell.js                ACTS + WALKTHROUGH (THE single source of truth for screen order —
                                Previous/Next, step counter, footer labels, index.html all derive
                                from it) + NAV + sidebar/toolbar/hint rendering
    js/pint-fields.js           generated PINT-OM field reference (tools/gen-pint-fields.py output)
  erp/   or  origin/           where the invoice starts — "erp/" when there are multiple source
                                ERPs (multi-entity), "origin/" when there's one (single-entity)
  hub/                         the central platform screens — login, dashboard, entities/tenants,
                                onboarding, mapping, queue, document inspector, inbound, routing,
                                history, reports, users, asp (acknowledgement legs)
  portal/                      an individual entity's own restricted view — only present when
                                there's more than one entity that needs its own login; dropped
                                entirely in single-entity mocks (vodafone-mock has no portal/)
  tools/verify.py              static + live (Playwright) checker — see "Verification" below
  tools/gen-pint-fields.py     (optional) generates pint-fields.js from the PINT-OM spec
```

Every page's `<body>` carries a fixed attribute contract that `shell.js` and `verify.py` both
depend on:

```html
<body class="surface-hub" data-surface="hub" data-nav="queue"
      data-step="hub-queue"
      data-crumbs="Operations / Processing Queue"
      data-hint="One sentence saying what the viewer is looking at.">
```

Script order in every page must be exactly `data.js`, then `ui.js`, then `shell.js`.

**To add one screen to an existing mock:** copy the nearest similar page, set those `data-*`
attributes, add an entry to `WALKTHROUGH` and `NAV` in `shell.js`.

## Choosing a base template for a new mock

Decide the prospect's shape first, then clone the closest match — never start blank:

- **Multi-entity Oman VAT Group** (many legal entities filing under one shared group TRN, each
  with its own Commercial Registration/CR) → clone `zubair-mock` or `rah-mock`. Use `erp/` +
  `hub/` + `portal/`.
- **Single legal entity, one ERP, no group structure** → clone `vodafone-mock`. Use `origin/` +
  `hub/`, no `portal/`.
- **Multiple independent tenants without a shared VAT group** (a hub operator serving several
  unrelated client companies) → clone `wj-mock` or `ndc-mock`.

## The design-spec document

Before building, write `docs/specs/<YYYY-MM-DD>-<company>-mock-design.md`. Follow the exact
section structure used by every prior spec (see `docs/specs/2026-08-18-zubair-mock-design.md`
and `docs/specs/2026-08-20-vodafone-mock-design.md`):

```
# <Company> — Central Hub E-Invoicing Mock (design)
**Date:** …
**Prospect:** <company> — <website>
**Purpose:** one-sentence framing of what this prototype demonstrates
**Base template:** clone `<existing-mock>` → new `<company>-mock/`

## 1. Scope (decided)
  - which entities/VAT group(s) are in scope, which are explicitly out of scope and why
  - B2C invoicing mechanism assumption (batch vs. live), flagged as "Assumption · to confirm"
  - which real system(s) the ERP/origin surface should visually mimic

## 2. The story this mock tells
  the narrative arc — why THIS prospect is a strong hub case

## 3. Entity roster
  table: Entity | Sector | ERP | Integration | AR/yr | B2C/mo | AP/yr
  (single-entity mocks: a short profile paragraph instead of a roster table)

## 4. What we build
  file-by-file plan — which files get rewritten and how

## 5. Data-model notes
  identity model (VATIN/TRN vs. CR vs. Peppol participant), illustrative-data disclaimer,
  anything resolved from the PINT-OM spec that affects the data shape

## 6. Discovery questions
  → mirrored into <COMPANY>-QUESTIONS.md

## 7. Open item for approval
  "everything above" — this doc is a checkpoint before building, not a record after
```

## Build steps (after the spec is approved)

1. Clone the chosen base mock's full tree into `<company>-mock/`.
2. Re-populate `assets/js/data.js` — entities, tracked demo invoice, counterparties. Reconcile
   every total against what `verify.py` will check (nothing should disagree with itself across
   two screens).
3. Rebrand `assets/js/shell.js` (`ACTS`/`WALKTHROUGH` step labels, `NAV`) and `index.html`
   (headline, scope line, step count).
4. If the prospect's real ERP is known, restyle the `erp/`/`origin/` surface to read as that
   system (new surface CSS, e.g. `fiori.css` for SAP) — otherwise keep it neutral/unbranded.
5. Re-populate `hub/` (and `portal/`, if multi-entity) screens for the new entities.
6. Write `README.md`, `PRESENTER-SCRIPT.md`, `GAP-REGISTER.md`, `<COMPANY>-QUESTIONS.md`, and
   (multi-entity only) `<COMPANY>-REAL-ENTITIES.md`.
7. Add a `COPY <company>-mock/ …` line to the root `Dockerfile`.
8. Retarget `tools/verify.py`:
   - `CLONE_DRIFT` — list every distinguishing name/term from the *old* (cloned-from) mock, so
     any leftover trace of it fails the check.
   - `REAL_COMPANIES` — any real counterparty/entity names that must never leak where they
     shouldn't.
   - the tracked-invoice ID and the entity-isolation name list on the portal check.
9. Run `tools/verify.py` (needs `pip install playwright` + `playwright install chromium`) and
   fix everything it reports before treating the mock as done.

## Hard rules (apply to every mock, not just one prospect)

These come from what real proposals deliberately leave open, and from Oman's actual
e-invoicing model — getting them wrong undermines the demo's credibility:

- Never state a retention period, a WORM/data-residency claim, a fixed connector count, a
  commercial figure, a rate, or an SLA response time as fact. Say "agreed during solution
  design" instead.
- Say **"Entity"** or **"company"**, never "tenant", anywhere a viewer reads it.
- Say **"Method 1 — Direct API"**, **"Method 2 — On-site agent"**, **"Method 3 — Secure file
  transfer"** — never "Tier 1/2/3".
- The **OTA does not clear or reject invoices** — the ASP validates and may reject, and the ASP
  (not the hub) reports the Tax Data Document to the OTA. Outcomes are asynchronous, never one
  synchronous round trip.
- Say **"QR information"** only — "Appendix D" and "Base64 TLV" are Saudi ZATCA terms and must
  never appear in an Oman mock.
- Archive is a stage *before* transmission, not after. Inbound drafts are never auto-posted.
- In a VAT-group mock: the group TRN/VATIN (IBT-031) is a shared *data field*; each entity is
  identified separately by its own Commercial Registration (IBT-029, scheme `CR`) and is its
  own Peppol participant (own endpoint, own SMP entry, own onboarding, own certificate). Never
  collapse several legal entities into one shared technical identity.
- All invented data — volumes, CRs/TRNs, failure counts, wave assignments, people, emails — must
  read as clearly illustrative, even when the company/entity names used are real. Mirror the
  disclaimer pattern from `zubair-mock/README.md`: "The company names are real. Nothing
  attached to them is."

## Agent pipeline

Generating a new mock end-to-end is automated as four specialist subagents chained by an
orchestrator, `.claude/agents/mock-builder.md`:

1. **`mock-researcher`** — company name in, research brief out
   (`docs/specs/<date>-<slug>-research.md`): confirmed facts vs. assumptions, entity/group
   structure, ERP signals, a non-binding shape recommendation.
2. **`mock-designer`** — reads the research brief, decides the shape/base template, writes the
   design spec (`docs/specs/<date>-<slug>-mock-design.md`) in the format above.
3. **`mock-scaffolder`** — reads the design spec, runs the clone-and-customize build steps,
   produces `<slug>-mock/`, retargets `tools/verify.py`'s ban-lists.
4. **`mock-verifier`** — runs `tools/verify.py` inside the new mock, fixes what it reports,
   loops until `CLEAN` or reports a genuine blocker.

Subagents don't message each other directly — each starts fresh with no shared memory. The
orchestrator is the relay: it reads each phase's artifact off disk, then threads the relevant
paths and findings into the next phase's prompt. Any agent building a new mock (or a human
doing it by hand) should follow this same four-stage shape and artifact trail even when invoked
individually.

The general pattern behind this pipeline — orchestrator + phase-agent frontmatter, artifact
hand-off conventions, how to add a phase — is documented separately in
`.claude/skills/agent-builder/SKILL.md`, so it can be reused for pipelines other than this one.

## Verification contract (`tools/verify.py`)

Two passes:

1. **Static sweep** — bans leftover vocabulary from superseded models (`Tier N`, "satellite",
   "Tenant Portal", "File drop", named data centres, retention periods, ZATCA terms, pinned
   spec versions), bans real/obsolete competitor or prior-mock entity names, bans clone-drift
   strings from the mock this one was cloned from, checks every internal link resolves, checks
   script load order, checks every non-index page has the four required `data-*` attributes.
2. **Live pass (Playwright)** — walks every step in `WALKTHROUGH` in order: confirms
   `data-step` matches, confirms chrome (hint strip, footer nav, sidebar unless
   `data-shell="off"`) renders, confirms Next points at the right next step, confirms a light
   background, confirms no empty render targets (a silent script failure) or horizontal
   overflow. Then checks portal entity isolation (no other entity's name/prefix leaks), checks
   the tracked invoice appears on the screens it should, and exercises the mapping screen's
   interactivity (changing a transform must visibly recompute the preview).

A mock isn't done until `tools/verify.py` prints `CLEAN`.
