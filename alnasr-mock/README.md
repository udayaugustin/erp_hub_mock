# Al Nasr Marbles E-Invoicing · guided walkthrough

A navigable prototype of the standalone e-invoicing and tax-compliance system described in
**Oman E-Invoicing — Architecture and Delivery Proposal v3.0**, deployed for
**Al Nasr Marbles** on the company's own ERP server.

Built to be **walked through by a client stakeholder**, not studied by an engineer. Each screen
makes one point and then stops.

This is a clone of the WJ Towell build (`../wj-mock`) with the company, the dataset, the palette
and the mapping profile replaced. The structure, the fourteen steps and the engineering approach
are unchanged — see that repository's `GAP-REGISTER.md` for the audit history behind the rules
in *What the prototype must agree with*, below.

## Run it

Open `index.html` in a browser. No build step, no server, no dependencies.

    open index.html

## How it is meant to be used

`index.html` lists the fourteen steps in six acts. Press **Start the walkthrough** and then use the
**Next** button in the top-right of every screen — or the **← →** arrow keys. The step navigation
repeats at the foot of each page, naming what comes next.

Every screen carries a one-line **hint strip** under the toolbar saying what the viewer is looking
at. It can be dismissed with the × if you would rather narrate it yourself.

## The fourteen steps

| # | Screen | The one point it makes |
|---|---|---|
| | **I — It starts in your system** | |
| 1 | ERP — Sales Invoices | The invoice starts in your own system, which barely changes |
| 2 | Sign in | The company's compliance team logs in |
| | **II — Your compliance dashboard** | |
| 3 | Dashboard | The company's compliance status on one screen — volumes, failures, and anything gone quiet |
| | **III — Setup, not installation** | |
| 4 | ERP Connection | Choose the connection method, enter the details, test it live |
| 5 | Mapping Studio | Their fields pointed at the standard ones — typed and chosen |
| | **IV — One invoice, end to end** | |
| 6 | Processing Queue | Where every document is, across the nine stages |
| 7 | Document Inspector | The XML, proven correct before anything is sent |
| | **V — The other direction, and the record** | |
| 8 | Inbound Documents | Supplier invoices routed, archived, landed as drafts |
| 9 | Processing History | Both directions, and what the archive holds |
| 10 | Reports | VAT summaries, reporting completeness, exception ageing |
| | **VI — Logins and the finance view** | |
| 11 | Users & Access | How the company's users get their logins, and who administers them |
| 12 | Finance view — Sign in | A finance user signs in with their own credentials |
| 13 | Finance view — Overview | A lighter view for finance users — invoices, failures and reports |
| 14 | ERP — Status Sync | The acknowledgement lands back on the original invoice |

## Three surfaces, three colours

All light. The colour tells the viewer which system they are in without anyone having to say it.

| Surface | Colour | Screens | Reads as |
|---|---|---|---|
| **ERP** | Neutral graphite | 1, 14 | *Their existing system — deliberately unbranded* |
| **Compliance system** | Basalt green `#26443F` + sand gold `#DCA84E` | 2–11 | *The compliance system we are building* |
| **Finance view** | Royal Beige bronze `#7A5326` | 12, 13 | *The lighter view for finance users* |

Al Nasr's own site is deliberately minimal — white, grey, and marble photography carrying all the
colour — so there is no brand palette to lift. This one is taken from the company's **materials**
instead: the basalt green of the Omani quarries for the console, and the warm bronze of their
Royal Beige and Desert Sand product lines for the finance-user view. Headings are set in
**Barlow Semi Condensed**, body text in Inter, and IBM Plex Mono carries every identifier, amount
and XML fragment.

The ERP surface is the one deliberate exception — it stays neutral grey, because the point of
screens 1 and 14 is that their existing system barely changes. If it wore the company's brand it
would look like something we built.

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
  ERP; there is no other company's data in it.
- **The OTA does not clear or reject invoices.** The ASP validates and may reject, and the ASP —
  not the system — reports the Tax Data Document to the OTA.
- **Outcomes are asynchronous on three separate legs.** Never one synchronous round trip.
- **Archive is stage 5, before transmission**, not after.
- **Inbound drafts are never auto-posted.**
- **"QR information"** only. "Appendix D" and "Base64 TLV" are Saudi ZATCA and are banned.
- **The system is "Al Nasr Marbles E-Invoicing".** The proposal describes a compliance system
  installed on the company's own ERP — call it "the system" or "the compliance system". Do not
  introduce a product name the client has not read, and do not frame it as a shared central hub.

`tools/verify.py` enforces all of the above as a lint over the user-visible markup, and fails on
any hit. Run it before showing the prototype to anyone.

## Structure

    index.html              the six acts and fourteen steps — the entry point
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

`assets/js/data.js` holds an illustrative dataset for **Al Nasr Marbles** — the single company
this instance is deployed for. Al Nasr Marbles does manufacturing, retail and quarrying: quarries
at Al Hoor, Suwaiq, Ibri and Nizwa, and a slab and tile factory at Suwaiq. It runs **ERPNext v15**
and connects by **Method 1 — Direct API**.

Because nothing is padded, the figures **reconcile exactly**: the per-document-type breakdown and
the individual invoice records sum to every total on the dashboard — today's volume, failures,
pending and month-to-date all add up against the records you can see, with no unexplained
remainder.

The document mix does real work. The company bills many medium-value goods invoices by the square
metre (UNECE code `MTK`) and quarry block by the tonne (`TNE`); it also raises **exports
(zero-rated)**, **simplified (B2C)** receipts and **credit notes**. So the goods-or-services
indicator (`BTOM-019`), the unit-of-measure code list and the zero-rate handling are all exercised
rather than decorative.

Shapes are real: VATIN `OM` + 10 digits, Peppol participant scheme `0248`, OMR to three decimals,
5% standard VAT, and real PINT-OM business-term and rule identifiers.

The demo clock is **Tuesday 28 July 2026**. The day matters: the Omani working week runs Sunday to
Thursday, so a busy weekday has to fall inside it.

> **The company is real. Everything attached to it is not.** Every VAT and CR number, every ERP and
> version, the connection method, wave assignment, volume, failure count and configuration state is
> invented, and none of it is a statement about how Al Nasr actually operates. Counterparties,
> people and email addresses are fictional on purpose. Product names (AM Royal Beige, Al Suwaiq,
> Desert Sand) and the Al Hoor quarry are real; the orders quoting them are not.

## Notes for presenting

- Every number on screen is derived from `data.js` or computed in the page. Totals reconcile with
  the rows above them, and the same figure does not disagree with itself across two screens.
- Screens 6 and 7 follow the same invoice through consecutive stages. Screens 1, 13 and 14 all
  show `ANM-SINV-2026-01184`, so the walkthrough closes a loop on one document.
- The mapping screen is genuinely operable. Changing a transform recomputes the preview — switching
  the buyer name from `trim|upper` to `trim` visibly changes its case, and switching the unit of
  measure off `codelist:UNECE20` turns `MTK` back into the ERP's own `SQM`. That interaction is the
  point of the screen.
- Verified at 1440px. Narrower viewports have breakpoints but have not been checked.
