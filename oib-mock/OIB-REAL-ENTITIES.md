# Oman Investment Bank — what the prototype claims, and where it came from

Last revised 16 Sep 2026. This records **what the prototype claims and why**, so anyone
presenting it can answer "where did you get that?" without guessing.

## The one real thing this mock is built on

**Oman Investment Bank (OIB)** is a real, single legal entity — Oman's dedicated corporate and
investment bank, **owned by the Government of Oman**, headquartered in Muscat, **launched
February 2024**, and licensed and regulated by the **Central Bank of Oman (CBO)** and the
**Financial Services Authority (FSA)**. It is a wholesale/corporate bank: advisory & capital
markets, transaction banking & trade finance, and research/insights. Source: https://oib.om.

**OIB does not actually operate as a multi-entity VAT Group.** It is one legal entity, not a
holding company with a dozen subsidiaries the way The Zubair Corporation or a similar
diversified trading group is. Every other mock in this repo (`zubair-mock/`, `hub-mock/`,
`rah-mock/`) tells the story of a **central e-invoicing hub for a multi-entity VAT Group** — one
shared VAT filing, many legal entities, several ERPs. To show that same structural pitch against
OIB's own brand, this prototype **invents a plausible group structure** for OIB in the same
spirit as `hub-mock/`'s fictional "ABC Trading" roster: a generic, illustrative twelve-entity
group sized and shaped like a real one, so the walkthrough can be presented without pretending
OIB genuinely operates this way today.

## The featured entity (followed end to end)

| Field | Value |
|---|---|
| **Name** | Oman Investment Bank SAOC (lead entity, id `OIB`) — *invented as a VAT-group parent for this demo* |
| **ERP** | **Enterprise ERP** (illustrative, 2025 FPS02), connected over the direct API (Method 1) |
| **Commercial Registration (CR)** | `1008431` — invented |
| **Shared VAT Group TRN (VATIN)** | `OM1200094685` — invented, shape-correct only |
| **Peppol participant** | `0248:1008431` (scheme `0248` over the CR) — invented |
| **Tracked invoice** | `OIB-SINV-2026-00841` → Muscat Bay Hospitality LLC; net 48,200.000, VAT 2,410.000, total 50,610.000 OMR — invented |

## The twelve invented entities (the illustrative OIB Group roster)

All are **fictional business units invented for this demo**, styled as plausible arms of an
"Oman Investment Bank Group" (corporate banking, asset management, capital markets, trade
finance, custody, treasury and payment/merchant services) — the kind of structure a diversified
financial group *could* have, not a statement about how OIB is actually organised. All twelve
share the invented VATIN `OM1200094685`. The CR, ERP, volumes and integration details attached to
each are invented illustrative placeholders.

| # | Entity | id | Illustrative sector | ERP | CR | AR/yr | B2C/mo | AP/yr |
|---|--------|----|--------|-----|----|------:|-------:|------:|
| 1 | Oman Investment Bank SAOC *(lead)* | OIB | Corporate & Investment Banking | Enterprise ERP | 1008431 | 182 | 0 | 620 |
| 2 | OIB Asset Management LLC | OAM | Asset Management | Enterprise ERP | 1044190 | 20 | 0 | 60 |
| 3 | OIB Capital Markets LLC | OCM | Capital Markets | Enterprise ERP | 1019884 | 1,700 | 5 | 2,400 |
| 4 | OIB Research & Advisory LLC | ORA | Research & Advisory | Enterprise ERP | 1122870 | 3 | 0 | 15 |
| 5 | OIB Trade Finance Services LLC | OTF | Trade Finance | Finance Suite | 1090552 | 540 | 60 | 450 |
| 6 | OIB Custody & Fund Services LLC | OCF | Fund & Custody Services | Accounting System | 1067213 | 16,800 | 15 | 400 |
| 7 | OIB Salalah Payment Services LLC | OSP | Payments & Merchant Services | High-Volume Billing | 2013447 | 250 | 0 | 50 |
| 8 | OIB Corporate Card Services LLC | OCC | Payments & Merchant Services | High-Volume Billing | 1055829 | 3,285 | 164 | 184 |
| 9 | OIB Digital Payments LLC *(volume giant)* | ODP | Payments & Merchant Services | High-Volume Billing | 1002715 | 46,516 | 66,136 | 5,545 |
| 10 | OIB Treasury Operations LLC | OTR | Treasury Operations | High-Volume Billing | 1033960 | 8,340 | 3,762 | 2,061 |
| 11 | OIB Coastal Payment Solutions LLC | OSH | Payments & Merchant Services | High-Volume Billing | 2011208 | 200 | 200 | 500 |
| 12 | OIB Merchant Settlement LLC | OMS | Payments & Merchant Services | High-Volume Billing | 1108734 | 8,297 | 3,546 | 1,651 |

**Subtotal (illustrative):** ~**86,133** B2B/B2G AR/yr · ~**73,888** B2C/month (~886k/yr)
· ~**13,936** AP/yr.
**ERP mix (all twelve):** Enterprise ERP ×4 · High-Volume Billing ×6 · Finance Suite ×1 ·
Accounting System ×1.
**Rollout:** all Phase 2, go-live **2027-04-01** — an invented date, chosen only to mirror the
other mocks' timeline.

## Why this matters for the pitch

- **The pitch is structural, not factual.** The point being demonstrated — one shared VAT
  filing, several legal entities, several ERPs, one hub normalising and reporting through one
  ASP pipe — is a real pattern many Oman groups face. OIB itself does not face it today, so this
  demo borrows the shape and puts OIB's own name and brand on it, clearly labelled as
  illustrative.
- **Batch B2C at scale.** OIB Digital Payments is modelled as ~66k simplified fee invoices a
  month — reported to the OTA in **batches from High-Volume Billing**, not cleared live at point
  of sale. This mirrors the "volume giant" pattern used in the other mocks (an automotive/retail
  entity there), reflavoured here as a high-volume branch/merchant-fee processing unit, which is
  a more plausible shape for a banking group.
- **Four illustrative ERPs.** Enterprise ERP, High-Volume Billing, Finance Suite and Accounting
  System are the same generic, unbranded ERP labels used throughout every mock in this repo —
  deliberately not real product names, so the ERP surface never implies a real vendor
  relationship for OIB or any other client.

## What is real

- **Oman Investment Bank (OIB)** exists, is wholly government-owned, launched February 2024, and
  is headquartered in Muscat.
- **Regulation.** OIB is licensed and regulated by the **Central Bank of Oman (CBO)** and the
  **Financial Services Authority (FSA)**.
- **Business lines.** Advisory & capital markets, transaction banking & trade finance, and
  research/insights, broadly as described on OIB's own site.

## What is invented

Everything else:

- **The entire multi-entity group structure** — OIB does not operate as a VAT Group with twelve
  member entities. This is invented for the demo, in the same spirit as `hub-mock/`'s fictional
  ABC Trading roster.
- **All twelve subsidiary/business-unit names**, CR numbers, and the shared VAT number
  `OM1200094685` (shape-correct, not verified, not a real OIB filing).
- **ERP platforms and versions.** Enterprise ERP, High-Volume Billing, Finance Suite and
  Accounting System are the same generic ERP labels used across every mock in this repo, not
  real product names and not a statement about OIB's actual systems.
- **Connection methods**, all **volumes** (AR, B2C, AP), failure counts, success rates, wave
  assignments, onboarding states and the 2027-04-01 go-live date.
- **All counterparties.** Customers — Muscat Bay Hospitality LLC, Sohar Steel Rolling LLC,
  Directorate General of Roads (B2G), Jebel Ali Equipment Trading FZE (export, AE), Al Batinah
  Logistics Services LLC, Individual Client (B2C), Salalah Port Services SAOC, Nizwa Auto Spares
  LLC. Suppliers — Falaj Facilities Management LLC, Ruwi Security Services SAOC, Barka Office
  Solutions LLC, Muscat IT Systems & Support LLC. All fictional on purpose.
- **People and email addresses** (`@oibgroup.example`).

None of the invented detail is a statement about how Oman Investment Bank actually operates.

## What is NOT confirmed / not applicable

- Whether OIB has, or plans, any subsidiary or affiliated-entity structure at all. As far as
  public sources show, it does not — this prototype's group structure is a demonstration device,
  not a claim about OIB's corporate structure.
- OIB's actual ERP or finance-systems landscape is not public and is not represented here.
- The exact Oman endpoint EAS/ICD scheme for the Peppol address (VAT-based vs CR-based) — a minor
  detail to confirm against the OTA onboarding portal, same open item as in the other mocks.

## Sources

- Oman Investment Bank — https://oib.om
- PINT-OM / Peppol identity model — https://test-docs.peppol.eu
