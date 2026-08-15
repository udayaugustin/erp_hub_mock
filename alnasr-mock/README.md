# Al Nasr Compliance Hub · guided walkthrough

A navigable prototype of the central compliance hub described in
**Oman E-Invoicing — Central Compliance Hub, Architecture and Delivery Proposal v3.0**,
adapted for **Al Nasr Group of Companies**.

Built to be **walked through by a client stakeholder**, not studied by an engineer. Each screen
makes one point and then stops.

This is a clone of the WJ Towell build (`../hub-mock`) with the group, the dataset, the palette
and the mapping profile replaced. The structure, the sixteen steps and the engineering approach
are unchanged — see that repository's `GAP-REGISTER.md` for the audit history behind the rules
in *What the prototype must agree with*, below.

## Run it

Open `index.html` in a browser. No build step, no server, no dependencies.

    open index.html

## How it is meant to be used

`index.html` lists the sixteen steps in six acts. Press **Start the walkthrough** and then use the
**Next** button in the top-right of every screen — or the **← →** arrow keys. The step navigation
repeats at the foot of each page, naming what comes next.

Every screen carries a one-line **hint strip** under the toolbar saying what the viewer is looking
at. It can be dismissed with the × if you would rather narrate it yourself.

## The sixteen steps

| # | Screen | The one point it makes |
|---|---|---|
| | **I — It starts in their system** | |
| 1 | ERP — Sales Invoices | The invoice starts in their own system, which barely changes |
| 2 | Hub — Sign in | The group platform team logs in |
| | **II — The group, and the companies in it** | |
| 3 | Hub — Group Dashboard | All four companies, including the one that has gone quiet |
| 4 | Hub — Companies | How each connects, which wave, and what is still unconfirmed |
| 5 | Hub — Company detail | What that entity supplied, and what we run from there |
| | **III — Bringing a company on** | |
| 6 | Hub — Onboard a Company | Choose the connection method, enter details, test it live |
| 7 | Hub — Mapping Studio | Their fields pointed at the standard ones — typed and chosen |
| 8 | Hub — Users & Access | How each of the four gets its own login, and who administers it |
| | **IV — One invoice, end to end** | |
| 9 | Hub — Processing Queue | Where every document is, across the nine stages |
| 10 | Hub — Document Inspector | The XML, proven correct before anything is sent |
| | **V — The other direction, and the record** | |
| 11 | Hub — Inbound Documents | Supplier invoices routed, archived, landed as drafts |
| 12 | Hub — Processing History | Both directions, and what the archive holds |
| 13 | Hub — Reports | VAT summaries, reporting completeness, exception ageing |
| | **VI — What each company sees** | |
| 14 | Portal — Sign in | A single company has its own login |
| 15 | Portal — Overview | It sees only its own data; the other three are invisible |
| 16 | ERP — Status Sync | The acknowledgement lands back on the original invoice |

## Three surfaces, three colours

All light. The colour tells the viewer which system they are in without anyone having to say it.

| Surface | Colour | Screens | Reads as |
|---|---|---|---|
| **ERP** | Neutral graphite | 1, 16 | *Their existing system — deliberately unbranded* |
| **Hub** | Basalt green `#26443F` + sand gold `#DCA84E` | 2–15 | *The platform we are building* |
| **Portal** | Royal Beige bronze `#7A5326` | 14, 15 | *One company's own workspace* |

Al Nasr's own site is deliberately minimal — white, grey, and marble photography carrying all the
colour — so there is no brand palette to lift. This one is taken from the group's **materials**
instead: the basalt green of the Omani quarries for the console, and the warm bronze of their
Royal Beige and Desert Sand product lines for a single company's workspace. Headings are set in
**Barlow Semi Condensed**, body text in Inter, and IBM Plex Mono carries every identifier, amount
and XML fragment.

The ERP surface is the one deliberate exception — it stays neutral grey, because the point of
screens 1 and 16 is that their existing system barely changes. If it wore the group brand it would
look like something we built.

Entity isolation is shown rather than asserted: the portal is visibly simpler than the console, and
it contains no reference to any other company.

## What the prototype must agree with

The proposal is the source of truth, and it will be open in the room. Several things it
**deliberately leaves open** must never be stated here:

- **No retention period, no WORM claim, no named data centre.** §6 reserves retention until
  solution design. Say "agreed during solution design".
- **No data-residency claim.** §10 lists it as information still required.
- **No fixed number of connectors**, and no list of ERPs described as "all connected". §4: scope is
  confirmed after the ERP inventory.
- **No commercial figure, rate, effort estimate or SLA response time.** §8 defers all of it.
- **The hub/self-hosted split is indicative.** No entity is assigned to the self-hosted exception:
  nothing the client has given us identifies one, and the proposal defers it to the governance
  classification. The screens say so rather than naming an entity we invented.

And several things it is emphatic about, which the prototype must get right:

- **Method 1 — Direct API**, **Method 2 — On-site agent**, **Method 3 — Secure file transfer**.
  Not "Tier 1/2/3". Not "File drop".
- **Self-hosted utility (exception)**, not "satellite". Those entities have *no connection* to the
  hub, so the hub cannot observe them — their figures are entity-reported.
- **Entity** or **company**, not "tenant", in anything a viewer reads.
- **The OTA does not clear or reject invoices.** The ASP validates and may reject, and the ASP —
  not the hub — reports the Tax Data Document to the OTA.
- **Outcomes are asynchronous on three separate legs.** Never one synchronous round trip.
- **Archive is stage 5, before transmission**, not after.
- **Inbound drafts are never auto-posted.**
- **"QR information"** only. "Appendix D" and "Base64 TLV" are Saudi ZATCA and are banned.
- **The platform is the "Al Nasr Compliance Hub".** The proposal says "the hub" or "the central
  compliance hub" throughout. Do not introduce a product name the client has not read.

`tools/verify.py` enforces all of the above as a lint over the user-visible markup, and fails on
any hit. Run it before showing the prototype to anyone.

## Structure

    index.html              the six acts and sixteen steps — the entry point
    assets/css/app.css      design system: tokens for the three surfaces, every component
    assets/js/data.js       the demonstration dataset
    assets/js/ui.js         component helpers that return HTML strings
    assets/js/shell.js      ACTS + WALKTHROUGH order, sidebar, toolbar, hints, step nav
    assets/js/pint-fields.js  GENERATED — do not edit; see tools/gen-pint-fields.py
    erp/ hub/ portal/       the screens
    tools/verify.py         conformance lint + live browser walk
    tools/gen-pint-fields.py  regenerates the PINT-OM field set from the ruleset

**`WALKTHROUGH` in `shell.js` is the single source of truth for screen order.** Previous/Next, the
step counter, the footer labels and `index.html` all derive from it. Reorder that array and the
whole walkthrough reorders.

Pages are plain HTML. Shared chrome is injected at runtime, driven by attributes on `<body>`:

```html
<body class="surface-hub" data-surface="hub" data-nav="queue"
      data-step="hub-queue"
      data-crumbs="Operations / Processing Queue"
      data-hint="One sentence saying what the viewer is looking at.">
```

To add a screen: copy a page, set those attributes, add an entry to `WALKTHROUGH` and to `NAV`.
Page-specific CSS lives in a local `<style>` block; `app.css` is shared and should not grow for a
single screen.

## The data

`assets/js/data.js` holds an illustrative dataset for the **Al Nasr Group** — the **four entities
the client named**, and only those:

| Entity | What it does | Connects by |
|---|---|---|
| **Al Nasr Marbles** | Manufacturing, retail and quarrying. Quarries at Al Hoor, Suwaiq, Ibri and Nizwa; slab and tile factory at Suwaiq | Method 1 — Direct API (ERPNext v15) |
| **Al Nasr Terrazzo** | Artificial stone, marble chips and powder. Rusayl Industrial Estate | Method 1 — Direct API (SAP Business One) |
| **Al Nasr Trading & Contracting LLC** | Construction and infrastructure | Method 2 — On-site agent |
| **Al Nasr Energy Services** | Oil & gas support, blasting and painting. Ghala Heights | Method 3 — Secure file transfer |

No site has been promoted to an entity and no companies have been invented to pad the console.
Because there is no padding, the four rows **sum exactly** to every group total on the dashboard —
today's volume, failures, pending and month-to-date all reconcile against the entities you can see,
with no unexplained remainder.

The sector mix does real work. Marbles and Terrazzo bill many medium-value goods invoices by the
square metre (UNECE code `MTK`); Trading & Contracting bills few, large milestone invoices; Energy
Services bills **services rather than goods**, so the goods-or-services indicator (`BTOM-019`) and
the unit-of-measure code list are both exercised rather than decorative.

Shapes are real: VATIN `OM` + 10 digits, Peppol participant scheme `0248`, OMR to three decimals,
5% standard VAT, and real PINT-OM business-term and rule identifiers.

The demo clock is **Tuesday 28 July 2026**. The day matters: the Omani working week runs Sunday to
Thursday, so a busy weekday has to fall inside it.

### Two things to confirm before showing this

1. **VAT registration.** Marbles and Terrazzo are *divisions* of Al Nasr Group of Companies LLC.
   If they share one VAT registration they are **one** Peppol participant, not two, and the console
   has three entities rather than four. Each is modelled with its own registration because
   splitting later is easier than merging — and the Companies screen states this on screen rather
   than letting four rows imply it is settled.
2. **Whether Energy Services is in scope.** The client's material lists it as a *related company*
   rather than a division of the group.

> **The companies are real. Everything attached to them is not.** Every VAT and CR number, every
> ERP and version, every connection method, wave assignment, volume, failure count and onboarding
> state is invented, and none of it is a statement about how Al Nasr actually operates.
> Counterparties, people and email addresses are fictional on purpose. Product names (AM Royal
> Beige, Al Suwaiq, Desert Sand) and the Al Hoor quarry are real; the orders quoting them are not.

## Notes for presenting

- Every number on screen is derived from `data.js` or computed in the page. Totals reconcile with
  the rows above them, and the same figure does not disagree with itself across two screens.
- Screens 9 and 10 follow the same invoice through consecutive stages. Screens 1, 15 and 16 all
  show `ANM-SINV-2026-01184`, so the walkthrough closes a loop on one document.
- The mapping screen is genuinely operable. Changing a transform recomputes the preview — switching
  the buyer name from `trim|upper` to `trim` visibly changes its case, and switching the unit of
  measure off `codelist:UNECE20` turns `MTK` back into the ERP's own `SQM`. That interaction is the
  point of the screen.
- Verified at 1440px. Narrower viewports have breakpoints but have not been checked.
