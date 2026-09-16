# Oman Investment Bank E-Invoicing Hub · guided walkthrough

A navigable prototype of a **central e-invoicing hub**, sized to **Oman Investment Bank (OIB)** —
a single legal entity, not a multi-company group. This is the thinnest possible vertical slice:
one outbound invoice, one direction, start to finish. It is a **sibling** to `zubair-mock/`,
`hub-mock/` and `rah-mock/` in this repo, not a variant of them — it is fully self-contained and
does not reference their files.

Built to be **walked through by a client stakeholder**, not studied by an engineer. Each screen
makes one point and then stops.

## Run it

This mock references its own sibling assets by relative path (`../assets/...`), so it needs to be
served over HTTP, not opened as a bare `file://` — browsers vary in what they allow for local
script includes and font requests under `file://`, and a static server sidesteps that entirely.

From the repo root:

    python3 -m http.server 8080
    # then open http://localhost:8080/oib-mock/

## The story this mock tells

**One bank. One invoice. One pipe to the OTA.**

Oman Investment Bank issues an advisory and arrangement fee invoice for a capital-markets
engagement from its own finance ERP. The invoice is collected by a central hub, mapped into the
government's standard format (PINT-OM), proven correct against the validation rules, transmitted
through an accredited service provider (ASP), and reported to the Oman Tax Authority (OTA). The
acknowledgement, Peppol reference and OTA reference land back on the original ERP record, closing
the loop.

Unlike `zubair-mock/` (thirty-three legal entities sharing one VAT Group registration) or
`rah-mock/`, **OIB is one legal entity with one Commercial Registration and one VAT registration.**
There is no VAT-group story here, no roster of member companies, no "CR distinguishes many entities
sharing one VATIN" narrative. The Document Inspector screen says this explicitly rather than
forcing the multi-entity framing onto a bank that doesn't have it.

## How it is meant to be used

`index.html` lists the five steps in one act. Press **Start the walkthrough** and then use the
**Next** button in the top-right of every screen — or the **← →** arrow keys. The step navigation
repeats at the foot of each page, naming what comes next.

Every screen carries a one-line **hint strip** under the toolbar saying what the viewer is looking
at. It can be dismissed with the × if you would rather narrate it yourself.

## The five steps

| # | Screen | The one point it makes |
|---|---|---|
| 1 | ERP — Fee Invoices (Oracle Fusion Financials Cloud) | The fee invoice starts in OIB's own finance ERP, which barely changes |
| 2 | Hub — Sign in | OIB's finance operations team logs in |
| 3 | Hub — Document Tracker | One invoice, tracked through the nine stages |
| 4 | Hub — Document Inspector | The XML — OIB's own CR as seller ID, OIB's own VATIN as VAT ID — proven correct before anything is sent |
| 5 | ERP — E-Invoice Status | The acknowledgement, Peppol reference and OTA reference land back on the original invoice |

## The tracked invoice

Screens 1, 4 and 5 follow one document end to end, so the walkthrough closes a loop:

**`OIB-ADV-2026-00147`** — an advisory & arrangement fee invoice for a Sukuk issuance programme
engagement, issued by **Oman Investment Bank SAOC** (CR `1245678`, VATIN `OM1300456789`, Peppol
`0248:1245678`) to the fictional client **Nakhal Capital Holding SAOC**. Three lines, PO
`NCH-CM-2026-004`, dated 19.08.2026. Net **85,000.000**, VAT **4,250.000**, total **89,250.000
OMR**. Status: Posted / Acknowledged. ACK `ASP-OM-2026-0819-58204`, Peppol ref `PEP-7734-2026`,
OTA ref `OTA-RPT-2026-0819-90142`.

## Two surfaces, two colours

Both light. The colour tells the viewer which system they are in without anyone having to say it.
There is no third (portal) surface in this slice — one legal entity means there is no "other
company" to keep isolated from, so a client portal has nothing to demonstrate here.

| Surface | Colour | Screens | Reads as |
|---|---|---|---|
| **ERP** | Neutral graphite | 1, 5 | *OIB's own finance ERP — deliberately unbranded* |
| **Hub** | OIB navy `#12395B` + orange `#E8762E` | 2–4 | *The central platform being proposed* |

Headings are set in Barlow Semi Condensed (standing in for a DIN-style display face); body text is
Inter; and IBM Plex Mono carries every identifier, amount and XML fragment — the same type system
as the other mocks in this repo, so the family reads consistently across all of them.

The ERP surface is styled with the same neutral-graphite tokens used across every mock in this
repo — no fake Oracle skin, just the plain hub-style shell with OIB's own content. The point is
that the bank's own system barely changes.

## What is real / What is invented

**Real:**

- Oman Investment Bank (OIB) is a real, single legal entity — Oman's dedicated corporate
  investment bank, owned by the Government of Oman, headquartered in Muscat, launched February
  2024.
- It is licensed and regulated by the Central Bank of Oman (CBO) and the Financial Services
  Authority (FSA), and is enrolled in the Insurance Fund for Deposit Protection.
- It is a wholesale/corporate investment bank — advisory & capital markets, transaction banking &
  trade finance, research/insights — **not** a retail bank and **not** a group of subsidiary
  companies. This is the critical difference from `zubair-mock/`: there is no multi-entity VAT
  Group here, because OIB doesn't have one.
- Source: [oib.om](https://oib.om) and [oib.om/who-we-are](https://oib.om/who-we-are).

**Invented — none of it is a statement about how OIB actually operates:**

- The finance ERP: **Oracle Fusion Financials Cloud** (release 24C), a plausible cloud ERP a
  modern bank might run for its own AR/AP, distinct from a core banking platform (e.g. Temenos
  T24) that handles customer accounts and loans rather than the bank's own invoicing. Connected
  via **Method 1 — Direct API**, the same convention as every other mock in this repo.
- OIB's own Commercial Registration (`1245678`) and VATIN (`OM1300456789`).
- The counterparty, **Nakhal Capital Holding SAOC**, is a fictional company — deliberately *not*
  any real, disclosed OIB client or transaction.
- The tracked invoice, its lines, amounts, timestamps, ASP acknowledgement, Peppol reference and
  OTA reference are all illustrative.
- Peppol participant scheme `0248` over OIB's CR, OMR to three decimals, 5% standard VAT — real
  shapes, invented values, same convention as the other mocks in this repo.

The demo clock is **Wednesday 19 August 2026, 11:20 GST**. The day matters: the Omani working week
runs Sunday to Thursday, so a busy weekday has to fall inside it.

## What the prototype must agree with

Same rules as `zubair-mock/` — see that mock's README for the full audit history. In short, this
mock avoids:

- Tier 1/2/3 language — it says **Method 1 — Direct API**.
- "Tenant" — it says **entity** or **company**.
- Any retention period, WORM claim, named data centre, or data-residency claim.
- A fixed connector count, or "all connected" language.
- The claim that the OTA clears or rejects invoices — the **ASP** validates and may reject, and
  the ASP (not the Hub) reports the Tax Data Document to the OTA.
- One synchronous round trip — outcomes are asynchronous, on **three separate legs**.
- Archive appearing after transmission — it is **stage 5, before transmission**.
- "Appendix D" / "Base64 TLV" (Saudi ZATCA vocabulary) — this mock only ever says **"QR
  information."**
- Any commercial figure, rate, effort estimate or SLA response time.

## Structure

    index.html              the one act and five steps — the entry point
    README.md               this file
    assets/css/app.css      design system: tokens for the two surfaces, every component used here
    assets/js/data.js       the demonstration dataset — one entity, one invoice
    assets/js/ui.js         component helpers that return HTML strings (trimmed to what these
                             five screens use)
    assets/js/shell.js      ACTS + WALKTHROUGH order, sidebar, toolbar, hints, step nav
    erp/ hub/                the screens (no portal/ — see "Two surfaces" above)

**`WALKTHROUGH` in `shell.js` is the single source of truth for screen order.** Previous/Next, the
step counter, the footer labels and `index.html` all derive from it.

Pages are plain HTML. Shared chrome is injected at runtime, driven by attributes on `<body>`:

```html
<body class="surface-hub" data-surface="hub" data-nav="tracker"
      data-step="hub-tracker"
      data-crumbs="Operations / Document Tracker"
      data-hint="One sentence saying what the viewer is looking at.">
```

## A future wave would need to add

This slice deliberately stops at one entity and one direction. A second wave, if OIB wanted the
full hub story demonstrated, would need:

- **An inbound/AP flow** — supplier invoices arriving, routed and landed as drafts, the same
  pattern `zubair-mock/hub/inbound.html` and `hub/routing.html` show for a multi-entity group.
- **A real multi-entity story, if one exists** — this slice assumes OIB is genuinely one legal
  entity for e-invoicing purposes. If OIB in fact operates separate business units or subsidiaries
  that issue invoices under their own CRs, that roster would need confirming before a multi-entity
  dashboard, onboarding wizard or mapping studio would make sense to build.
- **A client-facing portal**, if OIB's counterparties are expected to have their own login — not
  needed for this internal, single-entity slice.
- **Volume and monitoring screens** (a group dashboard, processing queue, reports) — meaningful
  once there is more than one tracked document to monitor.

## Notes for presenting

- Every number on screen is derived from `data.js` or computed in the page. Totals reconcile with
  the rows above them, and the same figure does not disagree with itself across screens.
- Screens 3 and 4 follow the same invoice through consecutive stages. Screens 1, 4 and 5 all show
  `OIB-ADV-2026-00147`, so the walkthrough closes a loop on one document.
- Verified at 1440px. Narrower viewports have breakpoints but have not been checked.
