# WJ Towell Compliance Hub · guided walkthrough

A navigable prototype of the central compliance hub described in
**Oman E-Invoicing — Central Compliance Hub, Architecture and Delivery Proposal v3.0**
(1 August 2026, prepared for WJ Towell Group Company).

Built to be **walked through by a client stakeholder**, not studied by an engineer. Each screen
makes one point and then stops.

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
| 3 | Hub — Group Dashboard | All 89 companies, including the ones that have gone quiet |
| 4 | Hub — Companies | How each connects, which wave, which are self-hosted |
| 5 | Hub — Company detail | What that entity supplied, and what we run from there |
| | **III — Bringing a company on** | |
| 6 | Hub — Onboard a Company | Choose the connection method, enter details, test it live |
| 7 | Hub — Mapping Studio | Their fields pointed at the standard ones — typed and chosen |
| 8 | Hub — Users & Access | How each of the 89 gets its own login, and who administers it |
| | **IV — One invoice, end to end** | |
| 9 | Hub — Processing Queue | Where every document is, across the nine stages |
| 10 | Hub — Document Inspector | The XML, proven correct before anything is sent |
| | **V — The other direction, and the record** | |
| 11 | Hub — Inbound Documents | Supplier invoices routed, archived, landed as drafts |
| 12 | Hub — Processing History | Both directions, and what the archive holds |
| 13 | Hub — Reports | VAT summaries, reporting completeness, exception ageing |
| | **VI — What each company sees** | |
| 14 | Portal — Sign in | A single company has its own login |
| 15 | Portal — Overview | It sees only its own data; the other 88 are invisible |
| 16 | ERP — Status Sync | The acknowledgement lands back on the original invoice |

## Three surfaces, three colours

All light. The colour tells the viewer which system they are in without anyone having to say it.

| Surface | Colour | Screens | Reads as |
|---|---|---|---|
| **ERP** | Neutral graphite | 1, 16 | *Their existing system — deliberately unbranded* |
| **Hub** | Towell navy `#1F4585` + group gold `#EDAF4A` | 2–15 | *The platform we are building* |
| **Portal** | Towell footer green `#143331` | 16, 17 | *One company's own workspace* |

The palette and type are taken from **wjtowell.com**: the logo navy, the group gold, the footer
green, the heading ink `#181B31` and the terracotta `#D04930` that now carries the failure state.
Their headings are set in **Bahnschrift**, a Windows-only DIN; **Barlow Semi Condensed** stands in
for it as the closest webfont. Body text is Archivo (their site uses Arial), and IBM Plex Mono
carries every identifier, amount and XML fragment.

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
- **The hub/self-hosted split is indicative** (≈80/≈9), confirmed by the governance classification.

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
- **The platform is the "WJ Towell Compliance Hub".** An earlier draft called it "Nazm Hub", a
  product name that appears nowhere in the proposal — the document says "the hub" or "the central
  compliance hub" throughout. Do not reintroduce a name the client has not read.

`GAP-REGISTER.md` records what was wrong before this pass and why.

## Structure

    index.html              the six acts and sixteen steps — the entry point
    GAP-REGISTER.md         audit of the prototype against the proposal
    assets/css/app.css      design system: tokens for the three surfaces, every component
    assets/js/data.js       the demonstration dataset
    assets/js/ui.js         component helpers that return HTML strings
    assets/js/shell.js      ACTS + WALKTHROUGH order, sidebar, toolbar, hints, step nav
    erp/ hub/ portal/       the screens

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

`assets/js/data.js` holds an illustrative dataset for the **WJ Towell Group** — 89 legal entities,
seven detailed. Shapes are real: VATIN `OM` + 10 digits, Peppol participant scheme `0248`, OMR to
three decimals, 5% standard VAT, and real PINT-OM business-term and rule identifiers.

The seven detailed entities are **real WJ Towell companies** — Towell Auto Centre, Enhance Group
Oman, Orbit Car Rental & Lease, Towell Construction, Towell Drilling & Oil Field Services, Mazoon
Printing & Advertising and Readymix Muscat & Premix — so the group recognises itself on screen.
They span all three connection methods, and one — Readymix Muscat & Premix, a joint venture — is
modelled as a **self-hosted utility**: it runs the same software inside its own environment and
transmits directly to the ASP, with nothing centralised.

The demo clock is **Tuesday 28 July 2026**. The day matters: the Omani working week runs Sunday to
Thursday, so a busy weekday has to fall inside it.

> **The company names are real. Nothing attached to them is.** VAT numbers, ERPs, connection
> methods, volumes, failure counts, wave assignments and onboarding states are all invented, and
> none of it is a statement about how those companies actually operate. Which entity is
> self-hosted is illustrative too — the proposal defers that to the governance classification.
> Counterparties, people and email addresses are fictional on purpose.

## Notes for presenting

- Every number on screen is derived from `data.js` or computed in the page. Totals reconcile with
  the rows above them, and the same figure does not disagree with itself across two screens.
- Screens 9 and 10 follow the same invoice through consecutive stages. Screens 1, 15 and 16 all
  show `TAC-SINV-2026-04471`, so the walkthrough closes a loop on one document.
- The mapping screen is genuinely operable. Changing a transform recomputes the preview — switching
  the buyer name from `trim|upper` to `trim` visibly changes its case. That interaction is the
  point of the screen.
- Verified at 1440px. Narrower viewports have breakpoints but have not been checked.
