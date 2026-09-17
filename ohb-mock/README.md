# Oman Housing Bank Central E-Invoicing Hub · guided walkthrough

A navigable prototype of the **central e-invoicing hub** proposed for **the Oman Housing Bank
VAT Group** — one Oman VAT Group (TRN `OM1200203817`), twelve group entities, four ERPs, and a
single pipe to the OTA (Fawtara / PINT-OM) through an accredited service provider.

**Oman Housing Bank SAOC itself is real** — a government-owned bank established in 1977 by Royal
Decree No. 51/77, headquartered in Ruwi, Muscat. OHB does not actually operate as a multi-entity
VAT Group; the twelve-entity group structure below is invented for this demonstration. Six of the
eleven business-unit names borrow OHB's own real service lines and programmes (Lending Services,
Deposit Services, Engineering Services, Treasury & Financial Institutions, Partnerships, Iskan,
Integrated Cities), so the walkthrough's shape (twelve entities, four ERPs, one shared VAT filing)
can be shown against OHB's own brand while staying grounded in real names. See
`OHB-REAL-ENTITIES.md` for exactly what's real and what's invented.

Built to be **walked through by a client stakeholder**, not studied by an engineer. Each screen
makes one point and then stops.

## Run it

Open `index.html` in a browser. No build step, no server, no dependencies.

    open index.html

To serve the whole tree instead (so the ERP, hub and portal surfaces resolve as siblings):

    python3 -m http.server 8080   # then open http://localhost:8080/ohb-mock/

## The story this mock tells

**One VAT Group. Twelve issuers. One pipe to the OTA.**

Every member of the Oman Housing Bank VAT Group invoices under the *same* group TRN
`OM1200203817`. That is one filing identity — but twelve separate group entities, spread across
four different ERPs:

- **Enterprise ERP** — the lead entity, Oman Housing Bank SAOC, plus three more (OHB Lending
  Services, OHB Deposit Services, OHB Engineering Services).
- **High-Volume Billing** — six branch/service entities, including the volume giant **OHB
  Customer Experience** (~66k simplified B2C fee invoices a month).
- **Finance Suite** — OHB Treasury & Financial Institutions.
- **Accounting System** — OHB Partnerships.

One filing identity, many group entities, several ERPs — which is exactly why a **central hub**
is the natural normalization and reporting layer. The hub reads all four ERPs, produces one
compliant PINT-OM document per invoice, and reports to the OTA through **one pipe** via the ASP,
while keeping a per-entity compliance view over all twelve.

The identity twist that makes this a hub case rather than twelve separate installs: although the
group TRN is shared, **each entity is its own Peppol participant, distinguished on the invoice by
its own Commercial Registration (CR)** — not by the VAT number. Registering, onboarding, routing
and monitoring twelve participants (twelve CRs, twelve endpoints, twelve certificates) under one
VAT-group return is the hub's whole reason to exist.

## How it is meant to be used

`index.html` lists the eighteen steps in six acts. Press **Start the walkthrough** and then use
the **Next** button in the top-right of every screen — or the **← →** arrow keys. The step
navigation repeats at the foot of each page, naming what comes next.

Every screen carries a one-line **hint strip** under the toolbar saying what the viewer is looking
at. It can be dismissed with the × if you would rather narrate it yourself.

## The eighteen steps

| # | Screen | The one point it makes |
|---|---|---|
| | **I — It starts in their system** | |
| 1 | ERP — Sales Invoices (Enterprise ERP) | The invoice starts in the entity's own Enterprise ERP, which barely changes |
| 2 | ERP — Branch & Merchant Services (High-Volume Billing) | The group's second invoice origin — OHB Customer Experience's high-volume B2C branch and fee-service sales, collected by High-Volume Billing and reported to the OTA in batches through the same Hub |
| | **II — The group, and the entities in it** | |
| 3 | Hub — Sign in | The group platform team logs in |
| 4 | Hub — Group Dashboard | All twelve entities, including any that have gone quiet |
| 5 | Hub — Entities | How each connects, which ERP, which wave |
| 6 | Hub — Entity detail | What that entity supplied, its own CR, the shared group VATIN |
| | **III — Bringing an entity on** | |
| 7 | Hub — Onboard an Entity | Choose the connection method, enter details, test it live |
| 8 | Hub — Mapping Studio | Their ERP fields pointed at the standard ones — typed and chosen |
| | **IV — One invoice, end to end** | |
| 9 | Hub — Processing Queue | Where every document is, across the nine stages |
| 10 | Hub — Document Inspector | The XML — CR as seller ID, shared VATIN as VAT ID — proven correct before anything is sent |
| | **V — The other direction, and the record** | |
| 11 | Hub — Inbound Documents | Supplier invoices routed, archived, landed as drafts |
| 12 | Hub — Inbound Routing | Each supplier e-invoice matched to the right entity by its Peppol participant (`0248:<CR>`) and CR — never by the shared VAT number — then landed as a draft in that entity's ERP |
| 13 | Hub — Processing History | Both directions, and what the archive holds |
| 14 | Hub — Reports | VAT summaries per entity, reporting completeness, exception ageing |
| | **VI — What each entity sees** | |
| 15 | Hub — Users & Access | How each entity gets its own login, and who administers it |
| 16 | Portal — Sign in | A single entity has its own login |
| 17 | Portal — Overview | It sees only its own data; the other eleven are invisible |
| 18 | ERP — Status Sync | The acknowledgement lands back on the original invoice |

## The tracked invoice

Screens 1, 10, 17 and 18 follow one document end to end, so the walkthrough closes a loop:

**`OHB-SINV-2026-00841`** — issued by the lead entity **Oman Housing Bank SAOC** (CR `4108431`,
shared VATIN `OM1200203817`, Peppol `0248:4108431`) to **Muscat Bay Hospitality LLC**. Six lines,
PO-88213, dated 18-08-2026. Net **48,200.000**, VAT **2,410.000**, total **50,610.000 OMR**.
Status: Posted / Acknowledged. ACK `ASP-OM-2026-0818-44718`, Peppol ref `PEP-8842-2026`, OTA ref
`OTA-RPT-2026-0818-94685`.

## Three surfaces, three colours

All light. The colour tells the viewer which system they are in without anyone having to say it.

| Surface | Colour | Screens | Reads as |
|---|---|---|---|
| **ERP** | Neutral graphite | 1, 2, 18 | *Their existing systems — Enterprise ERP and High-Volume Billing — deliberately unbranded* |
| **Hub** | navy `#12395B` + amber `#E8762E` | 3–15 | *The central platform we are building* |
| **Portal** | Footer green `#143331` | 16–17 | *One entity's own workspace* |

Headings are set in **Bahnschrift**, a Windows-only DIN, with **Barlow Semi Condensed** standing
in as the closest webfont; body text is Inter/Archivo; and IBM Plex Mono carries every identifier,
amount and XML fragment.

The ERP surface is the one deliberate exception — it stays neutral grey and is styled to read as
the entity's own system: **Enterprise ERP** on screens 1 and 18, and **High-Volume Billing** on
screen 2, the group's second invoice origin (OHB Customer Experience's B2C branch sales). The point
of all three is that the entity's existing system barely changes. If it wore the group brand it
would look like something we built.

The hub co-brands with **Fawtara X** (the ASP mark) in its footer — the compliant document and the
report to the OTA leave through that provider, not the hub itself.

Entity isolation is shown rather than asserted: the portal is visibly simpler than the console,
and it contains no reference to any other entity.

## What the prototype must agree with

The proposal is the source of truth, and it will be open in the room. Several things it
**deliberately leaves open** must never be stated here:

- **No retention period, no WORM claim, no named data centre.** Retention is reserved until
  solution design. Say "agreed during solution design".
- **No data-residency claim.**
- **No fixed number of connectors**, and no list of ERPs described as "all connected". Connector
  scope is confirmed after the ERP inventory.
- **No commercial figure, rate, effort estimate or SLA response time.**

And several things it is emphatic about, which the prototype must get right:

- **Method 1 — Direct API**, **Method 2 — On-site agent**, **Method 3 — Secure file transfer**.
  Not "Tier 1/2/3". Not "File drop".
- **Entity** or **company**, not "tenant", in anything a viewer reads.
- **One VAT Group, twelve group entities.** The group TRN `OM1200203817` is a shared *data field*;
  the **CR (IBT-029, scheme `CR`) distinguishes the twelve members** as the seller identifier, with
  the shared VATIN (IBT-031) as the VAT identifier. Never merge the twelve into one identity.
- **Batch B2C.** OHB Customer Experience's ~66k/month simplified fee invoices are reported to the
  OTA in **batches from High-Volume Billing**, not cleared live at the point of sale. This is
  flagged as an *Assumption · to confirm with the bank* on the relevant screen.
- **The OTA does not clear or reject invoices.** The ASP validates and may reject, and the ASP —
  not the hub — reports the Tax Data Document to the OTA.
- **Outcomes are asynchronous on three separate legs.** Never one synchronous round trip.
- **Archive is stage 5, before transmission**, not after.
- **Inbound drafts are never auto-posted.**
- **"QR information"** only. "Appendix D" and "Base64 TLV" are Saudi ZATCA and are banned.

`GAP-REGISTER.md` records the audit history behind these rules.

## Structure

    index.html              the six acts and eighteen steps — the entry point
    GAP-REGISTER.md         audit of the prototype against the proposal
    OHB-REAL-ENTITIES.md    what's real about OHB, and what's invented about the group roster
    assets/css/app.css      design system: tokens for the three surfaces, every component
    assets/js/data.js       the demonstration dataset (12 entities, one tracked invoice)
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

`assets/js/data.js` holds an illustrative dataset for **the Oman Housing Bank VAT Group** —
twelve group entities, all sharing VATIN `OM1200203817`, each with its own CR. Shapes are real:
VATIN `OM` + 10 digits, Peppol participant scheme `0248` over the entity's CR, OMR to three
decimals, 5% standard VAT, and real PINT-OM business-term and rule identifiers.

The twelve entities are **invented business units of a fictional group structure** built around a
real bank — see `OHB-REAL-ENTITIES.md` for exactly what's real (the OHB parent, its 1977
founding, government ownership, and six real service-line/programme names) versus invented
(everything about the twelve-entity group structure itself). They span four ERPs and illustrative
sectors including Mortgage Lending, Retail Deposits, Property Engineering & Valuation, Treasury &
Financial Institutions, Banking Partnerships, Digital Loan Servicing, Housing Development, and
Customer Experience & Branch Services.

The demo clock is **Tuesday 18 August 2026, 10:42 GST**. The day matters: the Omani working week
runs Sunday to Thursday, so a busy weekday has to fall inside it.

> **Only Oman Housing Bank's name, 1977 founding, government ownership, and six of its real
> service-line/programme names (Lending Services, Deposit Services, Engineering Services,
> Treasury & Financial Institutions, Partnerships, Iskan, Integrated Cities) are real.** The
> multi-entity group structure itself, all CR/VAT numbers, ERPs, volumes and the tracked invoice
> are invented for this demonstration — OHB does not actually operate as a multi-entity VAT
> Group. Counterparties, people and email addresses (`@ohb.example`) are fictional on purpose.

## Notes for presenting

- Every number on screen is derived from `data.js` or computed in the page. Totals reconcile with
  the rows above them, and the same figure does not disagree with itself across two screens.
- Screens 9 and 10 follow the same invoice through consecutive stages. Screens 1, 17 and 18 all
  show `OHB-SINV-2026-00841`, so the walkthrough closes a loop on one document.
- The mapping screen is genuinely operable. Changing a transform recomputes the preview —
  switching the buyer name from `trim|upper` to `trim` visibly changes its case. That interaction
  is the point of the screen.
- Verified at 1440px. Narrower viewports have breakpoints but have not been checked.
