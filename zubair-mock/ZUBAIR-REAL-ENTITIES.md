# The Zubair Corporation VAT Group — what the prototype claims, and where it came from

Last revised 18 Aug 2026. This records **what the prototype claims and why**, so anyone
presenting it can answer "where did you get that?" without guessing.

## One VAT Group, twelve issuers

This prototype is a **central e-invoicing hub** for **The Zubair Corporation VAT Group** — one
Oman VAT Group (TRN `OM1200094685`) whose members all file under the *same* group TRN but each
invoice as their own legal entity. The hub normalizes four ERPs and reports to the OTA (Fawtara /
PINT-OM) through **one pipe** via an accredited service provider (ASP).

The group has thirteen VAT-group members; the prototype models **twelve**. The thirteenth,
*Zubair Furnishing LLC*, is under liquidation / Excel-only and is dropped by decision — it may be
named as a future wave but is not modelled. The other Zubair VAT groups (Holding, Electric, ARA
Petroleum, Water) are out of scope and are not modelled here.

## The featured entity (followed end to end)

| Field | Value |
|---|---|
| **Name** | The Zubair Corporation LLC (lead entity, id `ZCL`) |
| **ERP** | **SAP S/4HANA** (assumed 2025 FPS02), connected over the direct API (Method 1, BAPI/CPI) |
| **Commercial Registration (CR)** | `1008431` — the entity's own seller identifier |
| **Shared VAT Group TRN (VATIN)** | `OM1200094685` — the same for all twelve members |
| **Peppol participant** | `0248:1008431` (scheme `0248` over the CR) |
| **Tracked invoice** | `ZCL-SINV-2026-00841` → Muscat Bay Hospitality LLC; net 48,200.000, VAT 2,410.000, total 50,610.000 OMR |

## The twelve entities (roster)

All are **real Zubair Corporation companies** and all share VATIN `OM1200094685`. The CR, ERP,
volumes and integration details attached to each are **invented** (see *What is invented*).
Volumes below are illustrative: annual AR (B2B/B2G), monthly B2C, annual AP.

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

**Group aggregate (illustrative):** ~**86,133** B2B/B2G AR/yr · ~**73,888** B2C/month (~886k/yr)
· ~**13,936** AP/yr.
**ERP mix:** SAP S/4HANA ×4 · Autoline 8.39 ×6 · Orion 11J ×1 · FOCUS X ×1.
**Rollout:** all Phase 2, go-live **2027-04-01**.

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

- The **twelve entity names** and their broad **sector** placement — from The Zubair Corporation's
  own group structure and the Oman E-Invoicing entity tracker ("Entity Level" sheet).
- The fact that they file under **one shared VAT Group TRN** as a single VAT registration.

## What is invented

Everything else:

- **All CR numbers**, and the shared **VAT number** `OM1200094685` (shape-correct, not verified).
- **Which ERP each entity runs**, and the **ERP versions** (S/4HANA 2025 FPS02, Autoline 8.39,
  Orion 11J, FOCUS X) — no public source; the proposal defers this to the ERP inventory.
- **Connection methods**, all **volumes** (AR, B2C, AP), failure counts, success rates, wave
  assignments and onboarding states.
- **All counterparties.** Customers — Muscat Bay Hospitality LLC, Sohar Steel Rolling LLC,
  Directorate General of Roads (B2G), Jebel Ali Equipment Trading FZE (export, AE), Al Batinah
  Logistics Services LLC, Walk-in Customer (B2C), Salalah Port Services SAOC, Nizwa Auto Spares
  LLC. Suppliers — Falaj Industrial Supplies LLC, Ruwi Marine Contracting SAOC, Barka Freight
  Forwarding LLC, Muscat Tyre & Battery Co LLC. All fictional on purpose.
- **People and email addresses** (`@zubaircorp.com`).

None of the invented detail is a statement about how these companies actually operate.

## What is NOT confirmed

- Which ERP each entity actually runs, and its version.
- The exact CR of each entity and the group's true VAT Group TRN.
- The real B2C / B2B / AP volumes and the Autoline batch cadence.
- The exact Oman endpoint EAS/ICD scheme for the Peppol address (VAT-based vs CR-based) — a minor
  detail to confirm against the OTA onboarding portal. See `ZUBAIR-QUESTIONS.md` Q1.

## Sources

- The Zubair Corporation group structure — https://zubaircorp.com/en/
- Oman E-Invoicing entity tracker, "Entity Level" sheet (client-supplied working file).
- PINT-OM / Peppol identity model — https://test-docs.peppol.eu (see `ZUBAIR-QUESTIONS.md` Q1).
