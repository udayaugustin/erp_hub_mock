# Zubair Corporation — Central Hub E-Invoicing Mock (design)

**Date:** 2026-08-18
**Prospect:** The Zubair Corporation LLC — https://zubaircorp.com/en/
**Purpose:** A demonstration prototype for a proposal, showing how a single **central e-invoicing hub** serves an Oman VAT Group of many legal entities on several ERPs, filing to the OTA (Fawtara / PINT-OM) under one group TRN.
**Base template:** clone `wj-mock` (the proven multi-tenant hub) → new `zubair-mock/`, served at `/zubair-mock/`.

---

## 1. Scope (decided)

- **One VAT Group only:** The Zubair Corporation VAT Group, **TRN `OM1200094685`**.
- **12 entities** (the group's 13 members, minus *Zubair Furnishing LLC* which is under liquidation / Excel-only — dropped by decision).
- **B2C** simplified invoices modelled as **batch-reported from the source ERP** (not live per-sale), with an explicit *"Assumption · to confirm with Zubair"* card. Mirrors the NDC/FieldAssist pattern.
- **ERP surface** (walkthrough steps 1–2) restyled to look like **SAP S/4HANA (Fiori)** — the lead entity runs S/4HANA.

Out of scope: the other Zubair VAT groups (Holding `…3279`, Electric `…1070`, ARA Petroleum `…1062`, Water/First Modern `…4718`). They may be named as "future waves" but are not modelled.

---

## 2. The story this mock tells

WJ Towell proved the hub with 7 tenants. Zubair is a **stronger** hub case:

1. **One VAT Group, 12 issuers.** Every member invoices under the *shared* group TRN `OM1200094685`. One filing identity, many legal entities, several ERPs → a central hub is the natural normalization + reporting layer, filing to the OTA through **one pipe**.
2. **4 real ERPs** wired to the hub via API: SAP S/4HANA (BAPI/CPI), Autoline 8.39, Orion 11J, FOCUS X (REST).
3. **Batch B2C at scale.** General Automotive alone is ~66k simplified invoices/month; reported in batches from the ERP, not cleared live at point of sale.
4. **Sector spread** — Automotive, Logistics, IT, Real Estate, Education, Investment — the hub as a group-wide compliance layer, not a per-company bolt-on.

---

## 3. Entity roster (12) — source: Oman E-Invoicing entity tracker, "Entity Level" sheet

All share TRN `OM1200094685`. Volumes are annual AR (B2B/B2G), monthly B2C, annual AP.

| # | Entity | Sector | ERP | Integration | AR/yr | B2C/mo | AP/yr |
|---|--------|--------|-----|-------------|------:|-------:|------:|
| 1 | The Zubair Corporation LLC *(lead)* | Corporate | SAP S/4HANA | API (BAPI/CPI) | 182 | 0 | 620 |
| 2 | Al-Hilal Investment Co LLC | Corporate | SAP S/4HANA | API | 20 | 0 | 60 |
| 3 | Oman Computer Services LLC | Digital & IT | SAP S/4HANA | API | 1,700 | 5 | 2,400 |
| 4 | Zakher Education Property Dev Co LLC | Education | SAP S/4HANA | API | 3 | 0 | 15 |
| 5 | Zakher Building Solutions LLC | Real Estate | Orion 11J | API | 540 | 60 | 450 |
| 6 | Oasis Logistics LLC | Logistics | FOCUS X | API | 16,800 | 15 | 400 |
| 7 | Dhofar Automotive LLC | Mobility | Autoline 8.39 | API | 250 | 0 | 50 |
| 8 | Zubair Automotive Group LLC | Mobility | Autoline 8.39 | API | 3,285 | 164 | 184 |
| 9 | General Automotive Company LLC *(volume giant)* | Mobility | Autoline 8.39 | API | 46,516 | 66,136 | 5,545 |
| 10 | International Heavy Equipment LLC | Mobility | Autoline 8.39 | API | 8,340 | 3,762 | 2,061 |
| 11 | Zubair Enterprises Southern LLC | Mobility | Autoline 8.39 | API | 200 | 200 | 500 |
| 12 | Sayarti LLC | Mobility | Autoline 8.39 | API | 8,297 | 3,546 | 1,651 |

**Group aggregate:** ~**86,133** B2B/B2G AR/yr · ~**73,888** B2C/month (~886k/yr) · ~**13,936** AP/yr.
**ERP mix:** SAP S/4HANA ×4 · Autoline ×6 · Orion 11J ×1 · FOCUS X ×1.
**Rollout:** all Phase 2, go-live **2027-04-01**.

---

## 4. What we build (mirrors the NDC deliverable)

- `zubair-mock/` full tree cloned from `wj-mock`.
- **`data.js`** re-populated with the 12-entity `TENANTS[]`, group aggregates, report rows, counterparties, and one **tracked demo invoice** — all reconciled to `tools/verify.py` invariants.
- **Shell / nav / index** rebranded: "The Zubair Corporation", group TRN, 12 entities, "one VAT Group · one hub · one pipe to the OTA".
- **ERP surface** (`erp/invoices.html`, `erp/sync.html`) restyled as **SAP S/4HANA Fiori** (new `assets/css/fiori.css`, analogous to NDC's `dynamics.css`), showing the lead entity's invoice + the hub write-back.
- **Hub surface** (tenants, tenant-detail, onboard, inbound, reports, dashboard, queue, mapping, asp, boundary, document, history, portal) re-populated for the group; the **multi-entity, multi-ERP story lives here**.
- **Batch-B2C assumption card** on the relevant hub/ERP screen.
- **`ZUBAIR-REAL-ENTITIES.md`** (provenance of names/figures) and **`ZUBAIR-QUESTIONS.md`** (discovery list — see §6).
- **`Dockerfile`** — add `COPY zubair-mock/ …` line.
- **`tools/verify.py`** retargeted to `zubair-mock` (banned-vocab clone-drift patterns, tracked-invoice id, single-group isolation checks).

---

## 5. Data-model notes

- **VAT-group identity — RESOLVED from the PINT-OM spec (test-docs.peppol.eu).** Within one VAT Group TRN, each entity is identified **per legal entity**, not merged into one group identity. Two levels:
  1. **Peppol / onboarding level:** each legal entity is its **own Peppol participant** — its own participant/endpoint registration, its own SMP entry, its own ASP onboarding and certificate. Peppol's identifier policy ties the participant identity to the member's own registration; a VAT group "may centralise governance but cannot collapse several legal entities into one shared technical identity." (Confirmed by the UAE VAT-group precedent, which is the same Peppol 5-corner model.)
  2. **Invoice level (PINT-OM):** the seller is carried by **both** — the **Seller identifier (IBT-029)** with **scheme `CR` = Commercial Registration** (from code list **CL-06-OM**, which offers CR / TIN / CID / SZLN / …) uniquely identifies the *legal entity*, while the **Seller VAT identifier (IBT-031, VATIN)** carries the **shared VAT Group TRN** `OM1200094685`. So the group TRN is a *data field*, not the routing identity; the **CR distinguishes the 12 members**.
- **This strengthens the hub pitch:** 12 legal entities = 12 Peppol participants (12 endpoints, 12 CRs, 12 certificates) across 4 ERPs, but **one VAT-group return**. Registering, onboarding, routing and monitoring those 12 participants under one compliance view is exactly what a central hub is for.
- Model implication: every entity in `TENANTS[]` gets its **own CR** (per-entity, `schemeName="CR"`) plus the **shared group VATIN** `OM1200094685`. The tracked invoice shows both on the seller block.
- All figures are illustrative; counterparties invented; OMR to 3 decimals, 5% VAT, VATIN `OM` + 10 digits. (Exact Oman EAS/ICD scheme for the endpoint address — VAT-based vs CR-based — is a minor detail to confirm against the OTA onboarding portal.)

---

## 6. Discovery questions (→ `ZUBAIR-QUESTIONS.md`)

1. ~~Within one VAT Group TRN, how is each entity identified to the OTA / on Peppol?~~ **RESOLVED (see §5):** per-entity Peppol participant + per-entity Commercial Registration (CR, IBT-029/CL-06-OM) as the seller identifier, with the shared group VATIN (IBT-031) as the VAT identifier. Only the exact endpoint EAS scheme remains to confirm with the OTA portal.
2. B2C simplified-invoice mechanism per ERP — batch export cadence from Autoline/SAP, or something live?
3. ERP connector specifics: SAP BAPI/CPI middleware, Autoline API surface, Orion 11J API, FOCUS X REST.
4. Which entity/ERP is the reference integration for Phase 2 pilot?
5. Inbound (AP) handling — do members want supplier e-invoices landed as drafts in each ERP?
6. Credit/debit notes, exports, and B2G volumes per entity.

---

## 7. Open item for approval

Everything above. On your go-ahead I'll commit this spec and move to an implementation plan (writing-plans), then build — reconciling `data.js` to `verify.py` before any screenshot, exactly as with NDC.
