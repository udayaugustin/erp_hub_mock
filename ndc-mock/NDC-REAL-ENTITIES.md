# The National Detergent Company SAOG — what the prototype claims, and where it came from

Last revised 17 Aug 2026. This records **what the prototype claims and why**, so anyone
presenting it can answer "where did you get that?" without guessing.

## One company, deployed on its own systems

This prototype is a **standalone single-company** e-invoicing / tax-compliance system for
**The National Detergent Company SAOG** ("NDC"), deployed on the company's own servers. It is
**not** a central hub and **not** a group console. It reads **two origins** and presents **one**
connection to the OTA:

1. **Microsoft Dynamics 365** raises B2B, export, LABSA and I&I invoices and credit notes natively.
2. **FieldAssist** van sales (high-volume Simplified B2C invoices) **sync into Dynamics** on a
   schedule.

Everything lands in Dynamics; the compliance engine reads Dynamics only. Nothing is installed on
the vans.

## The featured company

| Field | Value |
|---|---|
| **Name** | The National Detergent Company SAOG (NDC) |
| **Business** | Oman FMCG manufacturer since 1981 — detergents, soaps and personal care. Flagship brand **Bahar**; also **Pinex** and **Farah**. A **Sulphonation division** makes and sells **LABSA** (bulk chemical, B2B); an **Institutional & Industrial (I&I) division** serves Oil & Gas and Construction. Plants at Sohar, Ghala and Rusayl; exports across MENA. |
| **Location** | HQ Ghala, Muscat |
| **ERP** | **Microsoft Dynamics 365** (assumed F&O 10.0.x), connected over the direct API (Method 1) |
| **Second origin** | **FieldAssist** van-sales platform, syncing into Dynamics on a scheduled batch |

## Open questions to confirm with NDC / the OTA

- **Which Dynamics.** The prototype assumes **Dynamics 365 Finance & Operations**. It could be
  **Business Central** instead. This is an assumption, not a fact — confirm with NDC.
- **The key assumption.** The prototype assumes **simplified van-sale invoices are reported to the
  OTA in batch from Dynamics, not cleared live at the point of sale**. To confirm with NDC and
  against the OTA simplified-invoice rules. This is the load-bearing open question for the demo.
- **VAT registration.** In Oman, VAT registration is per legal entity and the Peppol participant ID
  is derived from the VAT identifier. NDC is modelled with its own registration (`OM1100234567`).

## What is invented

Everything except the company name, its sector and location: all VAT and CR numbers, the ERP
version, the connection method, all volumes, failure counts, success rates, counterparties,
people and email addresses.

The **brand names** (Bahar, Pinex, Farah) and the **divisions/segments** (detergents, soaps,
personal care, Sulphonation/LABSA, Institutional & Industrial) are real; the orders quoting them
are not. Counterparties are fictional on purpose.

## The dataset, and how it reconciles

`assets/js/data.js` holds one company (`TENANTS` has a single record) and `GROUP` is that
company's own roll-up — today's and month-to-date figures for NDC alone. The numbers are
load-bearing and `tools/verify.py` reconciles them by evaluating `data.js` in node:

- `GROUP`: `entities === 1`; `live + onboarding + notStarted === entities`;
  `m1 + m2 + m3 + pendingAssessment === entities`;
  `todaySuccess + todayFailed + todayPending === todayTotal` (1120 + 12 + 48 = **1180**).
- The single `TENANTS` record's `today` / `failed` / `pending` equal `GROUP.todayTotal` (1180),
  `todayFailed` (12) and `todayPending` (48).
- `REPORT_ROWS` is **by document type** (Standard invoices / Exports / Simplified (van sales) /
  Credit notes), each with a `label`. `docs` sums to `GROUP.mtdTotal` (**24240**), `failed` sums
  to `GROUP.mtdFailed` (**292**), `ack + failed === docs` on every row, and VAT equals
  `(net − zero) × 5%`.
- `STAGE_COUNT` sums to `todayPending` (**48**); `GROUP.week`'s last value is `todayTotal` (1180).
- `WAVES` are the company's own go-live phases (Standard from Dynamics, van sales via FieldAssist,
  inbound, reporting), not per-entity waves.

`tools/verify.py` also catches dangling document references, banned vocabulary (including any
leftover "central hub", "Compliance Hub", "Group Dashboard" or "tenant" wording), dead links, and
runs a live browser walk over all **15** walkthrough steps. Run it after any edit to the dataset.
