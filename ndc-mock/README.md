# National Detergent Co E-Invoicing · guided walkthrough

A navigable prototype of the standalone e-invoicing and tax-compliance system described in
**Oman E-Invoicing — Architecture and Delivery Proposal v3.0**, deployed for
**The National Detergent Company SAOG** (NDC) on the company's own servers.

Built to be **walked through by a client stakeholder**, not studied by an engineer. Each screen
makes one point and then stops.

This is a clone of the WJ Towell build (`../wj-mock`) with the company, the dataset, the palette
and the mapping profile replaced. The engineering approach is unchanged — see that repository's
`GAP-REGISTER.md` for the audit history behind the rules in *What the prototype must agree with*,
below. This build adds one step to Act I: a **FieldAssist van sale**, the second invoice origin,
bringing the walkthrough to **fifteen** steps.

## Run it

Open `index.html` in a browser. No build step, no server, no dependencies.

    open index.html

## How it is meant to be used

`index.html` lists the fifteen steps in six acts. Press **Start the walkthrough** and then use the
**Next** button in the top-right of every screen — or the **← →** arrow keys. The step navigation
repeats at the foot of each page, naming what comes next.

Every screen carries a one-line **hint strip** under the toolbar saying what the viewer is looking
at. It can be dismissed with the × if you would rather narrate it yourself.

## The fifteen steps

| # | Screen | The one point it makes |
|---|---|---|
| | **I — It starts in your systems** | |
| 1 | ERP — Customer Invoices | The invoice starts in Dynamics 365, which barely changes |
| 2 | ERP — Van Sales · FieldAssist | Van sales sync into Dynamics, then ride the same one pipe to the OTA |
| 3 | Sign in | The company's compliance team logs in |
| | **II — Your compliance dashboard** | |
| 4 | Dashboard | The company's compliance status on one screen — volumes, failures, and anything gone quiet |
| | **III — Setup, not installation** | |
| 5 | ERP Connection | Choose the connection method, enter the details, test it live |
| 6 | Mapping Studio | Their fields pointed at the standard ones — typed and chosen |
| | **IV — One invoice, end to end** | |
| 7 | Processing Queue | Where every document is, across the nine stages |
| 8 | Document Inspector | The XML, proven correct before anything is sent |
| | **V — The other direction, and the record** | |
| 9 | Inbound Documents | Supplier invoices routed, archived, landed as drafts |
| 10 | Processing History | Both directions, and what the archive holds |
| 11 | Reports | VAT summaries, reporting completeness, exception ageing |
| | **VI — Logins and the finance view** | |
| 12 | Users & Access | How the company's users get their logins, and who administers them |
| 13 | Finance view — Sign in | A finance user signs in with their own credentials |
| 14 | Finance view — Overview | A lighter view for finance users — invoices, failures and reports |
| 15 | ERP — E-Invoice Status | The acknowledgement lands back on the original invoice |

## Two origins, one pipe

The point of Act I is that documents are born in **two** places but leave through **one**:

- **Dynamics 365** raises B2B, export, LABSA and I&I invoices, and credit notes, natively.
- **FieldAssist** van sales — high-volume Simplified (B2C) invoices — **sync into Dynamics** on a
  schedule.

The compliance engine only ever reads Dynamics; nothing is installed on the vans. The screen for
step 2 carries the load-bearing assumption for the demo: *we assume simplified van-sale invoices
are reported to the OTA in batch from Dynamics, not cleared live at the point of sale — to confirm
with NDC and against the OTA simplified-invoice rules.*

## Three surfaces, three colours

All light. The colour tells the viewer which system they are in without anyone having to say it.

| Surface | Colour | Screens | Reads as |
|---|---|---|---|
| **ERP** | Neutral graphite | 1, 2, 15 | *Their existing system — deliberately unbranded* |
| **Compliance system** | Deep green `#26443F` + sand gold `#DCA84E` | 3–12 | *The compliance system we are building* |
| **Finance view** | Warm bronze `#7A5326` | 13, 14 | *The lighter view for finance users* |

The console uses a deep green and gold; the finance-user view a warmer bronze, so the two never
look like the same screen. Headings are set in **Barlow Semi Condensed**, body text in Inter, and
IBM Plex Mono carries every identifier, amount and XML fragment.

The ERP surface is the one deliberate exception — it stays neutral grey, because the point of
screens 1, 2 and 15 is that their existing systems barely change. If it wore a brand it would look
like something we built.

The finance view is deliberately lighter than the full console: it shows the day-to-day finance
users their own invoices, failures and reports, without the configuration surfaces they never
need to touch.

## What the prototype must agree with

The proposal is the source of truth, and it will be open in the room. Several things it
**deliberately leaves open** must never be stated here:

- **No retention period, no WORM claim, no named data centre.** §6 reserves retention until
  solution design. Say "agreed during solution design".
- **No data-residency claim.** §10 lists it as information still required.
- **No fixed number of connectors**, and no ERP described as "all connected". §4: scope is
  confirmed after the ERP inventory.
- **No commercial figure, rate, effort estimate or SLA response time.** §8 defers all of it.

And several things it is emphatic about, which the prototype must get right:

- **Method 1 — Direct API**, **Method 2 — On-site agent**, **Method 3 — Secure file transfer**.
  Not "Tier 1/2/3". Not "File drop".
- **The company**, not "tenant", in anything a viewer reads. The system runs on the company's own
  systems, reading Dynamics 365 and the FieldAssist van-sales feed; there is no other company's
  data in it.
- **The van feed is a second origin, not a live clearance.** Van sales sync into Dynamics on a
  schedule; the OTA is reported to in batch from Dynamics. Nothing is installed on the vans, and no
  invoice is cleared at the point of sale. This is flagged as an open question to confirm.
- **The OTA does not clear or reject invoices.** The ASP validates and may reject, and the ASP —
  not the system — reports the Tax Data Document to the OTA.
- **Outcomes are asynchronous on three separate legs.** Never one synchronous round trip.
- **Archive is stage 5, before transmission**, not after.
- **Inbound drafts are never auto-posted.**
- **"QR information"** only. "Appendix D" and "Base64 TLV" are Saudi ZATCA and are banned.
- **The system is "National Detergent Co E-Invoicing".** The proposal describes a compliance system
  installed on the company's own systems — call it "the system" or "the compliance system". Do not
  introduce a product name the client has not read, and do not frame it as a shared central hub.

`tools/verify.py` enforces all of the above as a lint over the user-visible markup, and fails on
any hit. Run it before showing the prototype to anyone.

## Structure

    index.html              the six acts and fifteen steps — the entry point
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

`assets/js/data.js` holds an illustrative dataset for **The National Detergent Company SAOG** — the
single company this instance is deployed for. NDC is an Oman FMCG manufacturer (detergents, soaps
and personal care; the Sulphonation division sells LABSA; the Institutional & Industrial division
serves Oil & Gas and Construction) with plants at Sohar, Ghala and Rusayl. It runs **Microsoft
Dynamics 365** and connects by **Method 1 — Direct API**, with van sales fed in from **FieldAssist**.

Because nothing is padded, the figures **reconcile exactly**: the per-document-type breakdown and
the individual invoice records sum to every total on the dashboard — today's volume, failures,
pending and month-to-date all add up against the records you can see, with no unexplained
remainder.

The document mix does real work. Van-sale **Simplified (B2C)** receipts dominate the volume, while
**Standard** invoices (B2B, I&I and distributors) dominate the value; the company also raises
**exports (zero-rated)** and **credit notes**. FMCG sells by the carton (UNECE code `CT`) and the
piece (`EA`); LABSA bulk sells by the kilogram (`KGM`). So the goods-or-services indicator
(`BTOM-019`), the unit-of-measure code list and the zero-rate handling are all exercised rather
than decorative.

Shapes are real: VATIN `OM` + 10 digits, Peppol participant scheme `0248`, OMR to three decimals,
5% standard VAT, and real PINT-OM business-term and rule identifiers.

The demo clock is **Tuesday 28 July 2026**. The day matters: the Omani working week runs Sunday to
Thursday, so a busy weekday has to fall inside it.

> **The company is real. Everything attached to it is not.** Every VAT and CR number, the ERP and
> version, the connection method, wave assignment, volume, failure count and configuration state is
> invented, and none of it is a statement about how NDC actually operates. Counterparties, people
> and email addresses are fictional on purpose. Brand names (Bahar, Pinex, Farah) and the divisions
> and segments are real; the orders quoting them are not.

## Notes for presenting

- Every number on screen is derived from `data.js` or computed in the page. Totals reconcile with
  the rows above them, and the same figure does not disagree with itself across two screens.
- Screens 7 and 8 follow the same invoice through consecutive stages. Screens 1, 14 and 15 all
  show `NDC-CIV-2026-08841`, so the walkthrough closes a loop on one document.
- The mapping screen is genuinely operable. Changing a transform recomputes the preview — switching
  the buyer name from `trim|upper` to `trim` visibly changes its case, and switching the unit of
  measure off `codelist:UNECE20` shows the ERP's own unit code instead of the mapped UNECE one.
  That interaction is the point of the screen.
- Verified at 1440px. Narrower viewports have breakpoints but have not been checked.
