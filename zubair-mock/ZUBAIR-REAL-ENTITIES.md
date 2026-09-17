# The Zubair Corporation VAT Group — what the prototype claims, and where it came from

Last revised 18 Aug 2026. This records **what the prototype claims and why**, so anyone
presenting it can answer "where did you get that?" without guessing.

## One VAT Group, thirty-three issuers

This prototype is a **central e-invoicing hub** for **The Zubair Corporation VAT Group** — one
Oman VAT Group (TRN `OM1200094685`) whose members all file under the *same* group TRN but each
invoice as their own legal entity. The hub normalizes five ERP platforms and reports to the OTA
(Fawtara / PINT-OM) through **one pipe** via an accredited service provider (ASP).

**Revised 16 Sep 2026.** The group's full ERP inventory names **33** legal entities, confirmed
against the client's own tracker. The prototype models all 33 on the Companies screen, but keeps
the original **twelve** — the ones already fully wired end to end (invoices, mapping, processing
queue) — as the live/onboarding pilot, and stages the other **twenty-one** as Wave 3, not yet
started. One of the thirty-three, *Zubair Furnishing LLC*, is under liquidation and is explicitly
**excluded** from onboarding — listed for completeness, not modelled as active. This supersedes
the earlier decision to model only twelve and treat ARA Petroleum, Electric, Water and Holding as
out of scope: they are now known to share the same VAT Group and are included in the roster.

## The featured entity (followed end to end)

| Field | Value |
|---|---|
| **Name** | The Zubair Corporation LLC (lead entity, id `ZCL`) |
| **ERP** | **SAP S/4HANA** (assumed 2025 FPS02), connected over the direct API (Method 1, BAPI/CPI) |
| **Commercial Registration (CR)** | `1008431` — the entity's own seller identifier |
| **Shared VAT Group TRN (VATIN)** | `OM1200094685` — the same for all twelve members |
| **Peppol participant** | `0248:1008431` (scheme `0248` over the CR) |
| **Tracked invoice** | `ZCL-SINV-2026-00841` → Muscat Bay Hospitality LLC; net 48,200.000, VAT 2,410.000, total 50,610.000 OMR |

## The twelve featured entities (live / onboarding pilot)

All are **real Zubair Corporation companies** and all share VATIN `OM1200094685`. The CR, ERP,
volumes and integration details attached to each are **invented** (see *What is invented*).
Volumes below are illustrative: annual AR (B2B/B2G), monthly B2C, annual AP. These twelve are the
ones the walkthrough follows in depth — invoices, mapping, processing queue, portal.

| # | Entity | id | Sector | ERP | CR | AR/yr | B2C/mo | AP/yr |
|---|--------|----|--------|-----|----|------:|-------:|------:|
| 1 | The Zubair Corporation LLC *(lead)* | ZCL | Corporate | SAP S/4HANA | 1008431 | 182 | 0 | 620 |
| 2 | Al-Hilal Investment Co LLC | AHI | Corporate | SAP S/4HANA | 1044190 | 20 | 0 | 60 |
| 3 | Oman Computer Services LLC | OCS | Digital & IT | SAP S/4HANA | 1019884 | 1,700 | 5 | 2,400 |
| 4 | Zakher Education Property Dev Co LLC | ZED | Education | SAP S/4HANA | 1122870 | 3 | 0 | 15 |
| 5 | Zakher Building Solutions LLC | ZBS | Real Estate | Orion 11J | 1090552 | 540 | 60 | 450 |
| 6 | Oasis Logistics LLC | OLG | Logistics | FOCUS X | 1067213 | 16,800 | 15 | 400 |
| 7 | Dhofar Automotive LLC | DAU | Mobility | Autoline 8.39 | 2013447 | 250 | 0 | 50 |
| 8 | Zubair Automotive Group LLC | ZAG | Mobility | Autoline 8.39 | 1055829 | 3,285 | 164 | 184 |
| 9 | General Automotive Company LLC *(volume giant)* | GAC | Mobility | Autoline 8.39 | 1002715 | 46,516 | 66,136 | 5,545 |
| 10 | International Heavy Equipment LLC | IHE | Mobility | Autoline 8.39 | 1033960 | 8,340 | 3,762 | 2,061 |
| 11 | Zubair Enterprises Southern LLC | ZES | Mobility | Autoline 8.39 | 2011208 | 200 | 200 | 500 |
| 12 | Sayarti LLC | SAY | Mobility | Autoline 8.39 | 1108734 | 8,297 | 3,546 | 1,651 |

**Subtotal (illustrative):** ~**86,133** B2B/B2G AR/yr · ~**73,888** B2C/month (~886k/yr)
· ~**13,936** AP/yr.
**ERP mix (these twelve):** SAP S/4HANA ×4 · Autoline 8.39 ×6 · Orion 11J ×1 · FOCUS X ×1.
**Rollout:** all Phase 2, go-live **2027-04-01**.

## The other twenty-one (Wave 3 — not yet started)

Real entity names and real ERP platforms, sourced from the client's ERP inventory. No volumes,
CRs, connection method or onboarding detail is modelled beyond a placeholder — these appear on the
Companies screen and in the group roll-up counts, but are not wired into invoices, mapping or the
processing queue in this slice.

| # | Entity | id | Sector | ERP |
|---|--------|----|--------|-----|
| 13 | ARA Petroleum LLC | ARP | Oil & Gas | SAP ECC (legacy) |
| 14 | ARA Petroleum Oman B44 Limited | AP44 | Oil & Gas | SAP ECC (legacy) |
| 15 | ARA Petroleum Oman B31 Limited | AP31 | Oil & Gas | SAP ECC (legacy) |
| 16 | ARA Petroleum Exploration and Production LLC | APEP | Oil & Gas | SAP ECC (legacy) |
| 17 | ARA Natural Resources LLC | ANR | Oil & Gas | SAP ECC (legacy) |
| 18 | Oman Oil Industry Supplies and Services Co. LLC | OOI | Oil & Gas Services | SAP S/4HANA |
| 19 | Zubair Oil & Gas LLC | ZOG | Oil & Gas | SAP S/4HANA |
| 20 | Muscat Commercial Agencies LLC | MCA | Trading | SAP S/4HANA |
| 21 | Oman Chemicals Industry Company LLC | OCI | Chemicals | FOCUS |
| 22 | Business International Group LLC | BIG | Corporate | SAP S/4HANA |
| 23 | Zubair Electric LLC | ZEL | Electrical | Orion 11J |
| 24 | Federal Transformers & Switchgears LLC | FTS | Electrical | SAP S/4HANA |
| 25 | The Zubair Holding Company SAOC | TZH | Holding | SAP S/4HANA |
| 26 | Inma Property Development LLC | INM | Real Estate | SAP S/4HANA |
| 27 | Mohammed Al Zubair Ali | MAZ | Individual establishment | SAP S/4HANA |
| 28 | First Modern Investment SPC | FMI | Investment | SAP ECC (legacy) |
| 29 | Oasis Water Co SAOC | OWC | Water & Utilities | SAP ECC (legacy) |
| 30 | Al Muzn Water Co | AMW | Water & Utilities | SAP ECC (legacy) |
| 31 | Zubair Furnishing LLC *(under liquidation — excluded)* | ZFU | Furnishing | Orion 11J |
| 32 | Autoline Trading | ATR | Automotive | Autoline 8.39 |
| 33 | Sohar Automotive SPC | SAS | Automotive | Autoline 8.39 |

**ERP mix (all 33):** SAP S/4HANA ×12 · SAP ECC (legacy) ×8 · Autoline 8.39 ×8 · Orion 11J ×3 ·
FOCUS / FOCUS X ×2.

## Why this matters for the pitch

- **Batch B2C at scale.** General Automotive Company alone is ~66k simplified invoices a month —
  reported to the OTA in **batches from Autoline**, not cleared live at point of sale. That is the
  load-bearing assumption of the demo (see `ZUBAIR-QUESTIONS.md` Q2).
- **Sector spread.** Automotive, Logistics, IT, Real Estate, Education and Investment sit under one
  VAT return — the hub as a group-wide compliance layer, not a per-company bolt-on.
- **Four real ERPs.** SAP S/4HANA (BAPI/CPI), Autoline 8.39, Orion 11J and FOCUS X (REST) all wire
  to the hub via API. One filing identity, several ERPs → a central hub is the natural
  normalization and reporting layer.

## What is real

- The **thirty-three entity names**, from the client's own ERP inventory ("Entity Level" sheet).
- **Which ERP platform each entity runs** — SAP ECC (legacy), SAP S/4HANA, FOCUS, FOCUS X, Orion
  11J, or Autoline 8.39 Rev8 — as confirmed by that same inventory. This was previously invented;
  it is now sourced.
- Broad **sector** placement, inferred from each entity's name where the inventory doesn't state it.
- The fact that they file under **one shared VAT Group TRN** as a single VAT registration.
- That **Zubair Furnishing LLC is under liquidation** and out of scope for onboarding.

## What is invented

Everything else:

- **All CR numbers**, and the shared **VAT number** `OM1200094685` (shape-correct, not verified).
- **ERP versions** beyond the platform name (S/4HANA 2025 FPS02, ECC 6.0 EHP8, Autoline 8.39 Rev8,
  Orion 11J, FOCUS/FOCUS X) — the platform is real, the release is assumed.
- **Connection methods**, all **volumes** (AR, B2C, AP), failure counts, success rates, wave
  assignments and onboarding states — including which 21 of the 33 are "not started" and which 12
  are live/onboarding. The real inventory does not state rollout sequencing; that grouping is this
  prototype's own choice, carried over from the earlier twelve-entity pilot.
- **All counterparties.** Customers — Muscat Bay Hospitality LLC, Sohar Steel Rolling LLC,
  Directorate General of Roads (B2G), Jebel Ali Equipment Trading FZE (export, AE), Al Batinah
  Logistics Services LLC, Walk-in Customer (B2C), Salalah Port Services SAOC, Nizwa Auto Spares
  LLC. Suppliers — Falaj Industrial Supplies LLC, Ruwi Marine Contracting SAOC, Barka Freight
  Forwarding LLC, Muscat Tyre & Battery Co LLC. All fictional on purpose.
- **People and email addresses** (`@zubaircorp.com`).

None of the invented detail is a statement about how these companies actually operate.

## What is NOT confirmed

- The **version** of each entity's ERP platform (which platform is now confirmed; the release
  is still assumed).
- The exact CR of each entity and the group's true VAT Group TRN.
- The real B2C / B2B / AP volumes and the Autoline batch cadence.
- Whether all 33 entities genuinely share one VAT Group TRN, or whether some (ARA Petroleum, Zubair
  Electric, the water companies, the Holding company) file under their own separate VAT groups.
  This prototype assumes one shared group for continuity with the earlier design; confirm with
  Zubair before presenting it as fact.
- The exact Oman endpoint EAS/ICD scheme for the Peppol address (VAT-based vs CR-based) — a minor
  detail to confirm against the OTA onboarding portal. See `ZUBAIR-QUESTIONS.md` Q1.

## Sources

- The Zubair Corporation group structure — https://zubaircorp.com/en/
- Oman E-Invoicing entity tracker, "Entity Level" sheet (client-supplied working file).
- PINT-OM / Peppol identity model — https://test-docs.peppol.eu (see `ZUBAIR-QUESTIONS.md` Q1).
