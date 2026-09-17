# Oman Housing Bank — what the prototype claims, and where it came from

Last revised 17 Sep 2026. This records **what the prototype claims and why**, so anyone
presenting it can answer "where did you get that?" without guessing.

## The one real thing this mock is built on

**Oman Housing Bank SAOC** is a real, single legal entity — a government-owned Omani bank
established **11 July 1977** by **Royal Decree No. 51/77**, as successor to the Oman National
Housing Development Co. (active in housing finance since 1974), with an original capital of
**RO 10 million**. Headquartered in **Ruwi, Muscat**. Current shareholding: **Ministry of Finance
(61%)** and the **Social Protection Fund (39%)**. Its business is
subsidized housing loans for low- and medium-income Omani citizens, deposit services, treasury &
financial institutions, engineering/property-valuation services (including an "Approved Real
Estate Offices" accreditation programme), and partnerships for non-housing banking products. Two
named real programmes: **Iskan** (a digital loan-servicing platform) and **Integrated Cities** (a
housing-development programme). Vision: *"Housing and Beyond."* CEO (as of the source material):
Moosa bin Masoud Al-Jadidi. Source: https://ohb.co.om.

**OHB does not actually operate as a multi-entity VAT Group.** It is one legal entity with
branches (confirmed: Sohar; Salalah/Dhofar), not a holding company with subsidiaries the way The
Zubair Corporation or Ras Al Hamra Group is. Every other multi-entity mock in this repo
(`zubair-mock/`, `hub-mock/`, `rah-mock/`) tells the story of a **central e-invoicing hub for a
multi-entity VAT Group** — one shared VAT filing, many legal entities, several ERPs. To show that
same structural pitch against OHB's own brand, this prototype **invents a plausible group
structure**, borrowing six of OHB's own real service-line/programme names (Lending Services,
Deposit Services, Engineering Services, Treasury & Financial Institutions, Partnerships, Iskan,
Integrated Cities) to stay grounded, clearly labelled as illustrative — not a claim that OHB
genuinely operates this way today.

## The featured entity (followed end to end)

| Field | Value |
|---|---|
| **Name** | Oman Housing Bank SAOC (lead entity, id `OHB`) — *invented as a VAT-group parent for this demo* |
| **ERP** | **Enterprise ERP** (illustrative, 2025 FPS02), connected over the direct API (Method 1) |
| **Commercial Registration (CR)** | `4108431` — invented |
| **Shared VAT Group TRN (VATIN)** | `OM1200203817` — invented, shape-correct only |
| **Peppol participant** | `0248:4108431` (scheme `0248` over the CR) — invented |
| **Tracked invoice** | `OHB-SINV-2026-00841` → Muscat Bay Hospitality LLC; net 48,200.000, VAT 2,410.000, total 50,610.000 OMR — invented |

## The twelve invented "entities" (the illustrative Oman Housing Bank roster)

All are **fictional business units invented for this demo**. Six borrow REAL OHB service-line or
programme names (marked below); the rest are plausible but invented constructs. This is the kind
of structure a diversified financial group *could* have — not a statement about how OHB is
actually organised. All twelve share the invented VATIN `OM1200203817`. The CR, ERP, volumes and
integration details attached to each are invented illustrative placeholders.

| # | Entity | id | Illustrative sector | Real name? | ERP | CR |
|---|--------|----|--------|:---:|-----|----|
| 1 | Oman Housing Bank SAOC *(lead)* | OHB | Housing Finance · Group Flagship | — (entity is real) | Enterprise ERP | 4108431 |
| 2 | OHB Lending Services | LEN | Mortgage Lending | ✅ real service line | Enterprise ERP | 4144190 |
| 3 | OHB Deposit Services | DEP | Retail Deposits | ✅ real service line | Enterprise ERP | 4119884 |
| 4 | OHB Engineering Services | ENG | Property Engineering & Valuation | ✅ real service line | Enterprise ERP | 4222870 |
| 5 | OHB Treasury & Financial Institutions | TRE | Treasury & Financial Institutions | ✅ real service line | Finance Suite | 4190552 |
| 6 | OHB Partnerships | PTN | Banking Partnerships | ✅ real programme | Accounting System | 4267213 |
| 7 | Iskan Digital Services | ISK | Digital Loan Servicing (Iskan) | ✅ real programme name | High-Volume Billing | 4313447 |
| 8 | Integrated Cities | ICT | Housing Development Programme | ✅ real programme name | High-Volume Billing | 4355829 |
| 9 | OHB Customer Experience *(volume giant)* | CEX | Customer Experience & Branch Services | plausible, invented as "high-volume" unit | High-Volume Billing | 4402715 |
| 10 | OHB Mortgage Loan Servicing | MLS | Mortgage Loan Servicing | plausible, invented | High-Volume Billing | 4433960 |
| 11 | OHB Salalah Branch | SAL | Branch Banking — Dhofar | Salalah/Dhofar branch confirmed real; "Salalah Branch" as a separate VAT entity is invented | High-Volume Billing | 4511208 |
| 12 | OHB Digital Transformation | DGT | Digital Transformation & Innovation | plausible — OHB has publicly won digital-transformation awards, but this specific unit is invented | High-Volume Billing | 4608734 |

**ERP mix (all twelve):** Enterprise ERP ×4 · High-Volume Billing ×6 · Finance Suite ×1 ·
Accounting System ×1 — the same generic, unbranded ERP labels used throughout every mock in this
repo, deliberately not real product names.
**Rollout:** all Phase 2, go-live **2027-04-01** — an invented date, chosen only to mirror the
other mocks' timeline.

## Why this matters for the pitch

- **The pitch is structural, not factual.** The point being demonstrated — one shared VAT
  filing, several legal entities, several ERPs, one hub normalising and reporting through one ASP
  pipe — is a real pattern many Oman groups face. OHB itself does not face it today (it has no
  subsidiaries), so this demo borrows the shape and puts OHB's own real name, and several of its
  own real service-line names, on it — clearly labelled as illustrative.
- **Batch B2C at scale.** OHB Customer Experience is modelled as ~66k simplified fee invoices a
  month across branch counters and service centres — reported to the OTA in **batches from
  High-Volume Billing**, not cleared live at point of sale. Branch names used: Ruwi (OHB's real
  head-office area) and Sohar (a confirmed real branch) are real; Al Khuwair and Barka are
  plausible but unconfirmed as OHB branch locations.
- **Four illustrative ERPs.** Enterprise ERP, High-Volume Billing, Finance Suite and Accounting
  System are the same generic, unbranded ERP labels used throughout every mock in this repo — not
  real product names, so the ERP surface never implies a real vendor relationship for OHB or any
  other client. (Unlike Ras Al Hamra Group, no real ERP product has been confirmed for Oman
  Housing Bank — do not assume Sage 300 or any other product without confirmation.)

## What is real

- **Oman Housing Bank SAOC** exists, is government-owned (Ministry of Finance 61%, Social
  Protection Fund 39%), established 11 July 1977 by Royal Decree No. 51/77, and is headquartered
  in Ruwi, Muscat.
- **Business.** Subsidized housing loans, deposit services, engineering/property-valuation
  services, treasury & financial institutions, and partnerships for non-housing banking products.
- **Named programmes.** "Iskan" (digital loan servicing) and "Integrated Cities" (housing
  development) are real OHB products/programmes, not invented.
- **Branches.** Sohar and Salalah/Dhofar branches are confirmed via OHB press releases.
- **Vision.** "Housing and Beyond."

## What is invented

Everything else:

- **The entire multi-entity group structure** — OHB does not operate as a VAT Group with twelve
  member entities. This is invented for the demo.
- **All eleven business-unit "entities" as separate legal/VAT entities** — even the six that
  borrow real OHB service-line/programme names are, in reality, internal functions of one bank,
  not separate companies with their own CR or Peppol participant.
- **CR numbers, and the shared VAT number** `OM1200203817` (shape-correct, not verified, not a
  real OHB filing).
- **ERP platforms and versions.** Enterprise ERP, High-Volume Billing, Finance Suite and
  Accounting System are the same generic ERP labels used across every mock in this repo, not real
  product names and not a statement about OHB's actual systems.
- **Connection methods**, all **volumes** (AR, B2C, AP), failure counts, success rates, wave
  assignments, onboarding states and the 2027-04-01 go-live date.
- **All counterparties.** Customers — Muscat Bay Hospitality LLC, Sohar Steel Rolling LLC,
  Directorate General of Roads (B2G), Jebel Ali Equipment Trading FZE (export, AE), Al Batinah
  Logistics Services LLC, Individual Client (B2C), Salalah Port Services SAOC, Nizwa Auto Spares
  LLC. Suppliers — Falaj Facilities Management LLC, Ruwi Security Services SAOC, Barka Office
  Solutions LLC, Muscat IT Systems & Support LLC. All fictional on purpose.
- **People and email addresses** (`@ohb.example`).
- **Two of the four "branch" names** used in the RETAIL_B2C narrative (Al Khuwair, Barka) — real
  Oman districts, but not confirmed as actual OHB branch locations.

None of the invented detail is a statement about how Oman Housing Bank actually operates.

## What is NOT confirmed / not applicable

- Whether OHB has, or plans, any subsidiary or affiliated-entity structure at all. As far as
  public sources show, it does not — this prototype's group structure is a demonstration device,
  not a claim about OHB's corporate structure.
- OHB's actual ERP or finance-systems landscape is not public and is not represented here.
- The exact Oman endpoint EAS/ICD scheme for the Peppol address (VAT-based vs CR-based) — a minor
  detail to confirm against the OTA onboarding portal, same open item as in the other mocks.
- OHB's regulatory oversight (e.g. Central Bank of Oman) was not independently confirmed in the
  public research behind this mock and is not asserted here.

## Sources

- Oman Housing Bank — https://ohb.co.om and https://www.ohb.co.om
- Oman Housing Bank — About Us / shareholding structure — https://ohb.co.om/en/about-ohb/about-us/
- Oman Housing Bank press releases (Sohar and Salalah/Dhofar branch openings, digital-transformation awards)
- PINT-OM / Peppol identity model — https://test-docs.peppol.eu
