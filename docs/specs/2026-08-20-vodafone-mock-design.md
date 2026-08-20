# Vodafone Oman × Fawtara — E-Invoicing Scope Walkthrough (design)

**Date:** 2026-08-20
**Prospect:** Vodafone Oman (the telco) — B2B & B2C, ERP + billing system origins
**Purpose:** A demonstration prototype for the Thursday alignment session. Unlike the
group-hub mocks (WJ Towell / NDC / Zubair), this is **not** a multi-entity VAT-group
story. It is **one large telco with many invoice types and several open OTA-position
questions**. The mock is a **discovery / alignment tool** built to drive the meeting
agenda scenario by scenario, and it is honest that scenarios 5–6 are Fawtara's
*recommended reading, to confirm with OTA* — not a finished compliant flow.
**Base template:** clone the proven `zubair-mock` shell/engine → new `vodafone-mock/`,
served at `/vodafone-mock/`.

---

## 1. Scope (decided)

Structure = **scenario matrix (agenda-driven), executed hybrid** — the home screen is
the six Vodafone transaction types from the agenda; each scenario reuses the shared
Fawtara hub / ASP / OTA pipeline screens rather than rebuilding the pipeline six times.

Systems = **generic labels only**: *"Your billing system"* and *"Your ERP"*. No product
named (discovery meeting; Vodafone's actual BSS/ERP stack unconfirmed).

Single entity. Vodafone Oman is **one seller and one buyer** — its own VATIN, its own CR,
its own `0248` endpoint. No VAT-group / multi-tenant isolation story, so the **portal
surface is dropped**. Two surfaces only: `origin` (Vodafone's systems) and `hub` (the
Fawtara console).

The six agenda scenarios, grouped exactly as the meeting runs:

| # | Scenario | Origin | What the scene shows |
|---|----------|--------|----------------------|
| 1 | **B2B buyer · supplier _inside_ Oman** | inbound Peppol | Supplier e-invoice → validated → matched to Vodafone by CR → draft in *Your ERP* |
| 2 | **B2B buyer · supplier _outside_ Oman** | no Peppol origin | Import of services → **reverse-charge (RCM)**; Fawtara generates the self-accounting record; nothing to clear outbound |
| 3 | **B2B seller · postpaid** | Your billing system | Standard B2B tax invoice → the canonical clear-to-OTA pipeline shown here |
| 4 | **B2C seller · postpaid** | Your billing system | High volume, simplified invoices, **batched once per day** to OTA |
| 5 | **B2C · prepaid top-ups & recharges** | Point of sale | **OTA position** (recommended + flagged) |
| 6 | **Out-of-bundle usage** | Postpaid cycle | **OTA position** (recommended + flagged) |

Plus cross-cutting screens: **once-per-day batch** operating model, a cleared
**document** (UBL / PINT-OM fields + QR), a **dashboard** of all streams, and a
**"why Fawtara"** framing screen (data residency, OTA-interface alignment, ASP value —
the "what sets us apart" agenda items).

Out of scope: naming Vodafone's real billing/ERP products; any second legal entity;
commercial-model numbers (framed qualitatively only).

---

## 2. The story this mock tells

> Vodafone raises and receives invoices in six different ways. Every one of them has to
> reach the OTA correctly — or, when Vodafone is the buyer, be captured correctly. One
> pipe to the OTA handles all six. Where the tax treatment isn't yet settled — prepaid
> credit, out-of-bundle usage — Fawtara comes to the table with a recommended position,
> not a shrug.

The walkthrough opens on the **scope map** (the six tiles), then walks buyer → seller
(B2B) → seller (B2C postpaid) → prepaid/open-questions → the platform. It closes on the
Fawtara differentiators.

---

## 3. OTA positions — Fawtara's recommended reading (each rendered "to confirm with OTA")

These are the confident-but-flagged answers for the open agenda items. Grounded in
Oman VAT Law (RD 121/2020) & Executive Regulations voucher/tax-point treatment.

- **Prepaid top-ups & recharges → single-purpose voucher.** Telecom prepaid credit is
  redeemable only for telecom services at a known 5% rate, so it is a **single-purpose
  voucher**: the **tax point is the sale of the top-up**. Fawtara issues a **simplified
  B2C tax invoice at top-up**; later consumption (calls/data drawdown) is **not** a new
  tax point and raises no further invoice.
- **Buy a plan using balance / card / voucher.** Buying a bundle from **existing prepaid
  balance** → no new supply, no new tax point (already taxed at top-up). Buying via
  **card / fresh payment** → treated as a new top-up → taxed then. One rule, three
  payment routes.
- **Out-of-bundle usage (postpaid) → taxable at consumption, aggregated.** Not invoiced
  per event. The usage is **rolled into the monthly postpaid tax invoice** — one cleared
  invoice per billing cycle, out-of-bundle lines itemised within it.
- **B2B buyer, supplier outside Oman → reverse charge (RCM).** Cross-border import of
  services: Vodafone self-accounts for VAT; there is **no inbound Peppol document and
  nothing to clear outbound**. Fawtara captures the RCM record for the return and the
  archive. (Supplier inside Oman = ordinary inbound Peppol → draft in ERP.)

Each of the four renders as a **"Fawtara's reading — to confirm with OTA"** card so the
mock shows expertise without overclaiming.

---

## 4. Walkthrough (scenario-driven, ~13 steps, 5 acts)

Re-uses the `shell.js` ACTS/WALKTHROUGH engine; acts become scenario groups.

- **Act I — Vodafone as buyer (B2B, inbound / AP)**
  1. `origin` supplier e-invoice, **inside Oman** → validated → draft in *Your ERP*
  2. `hub` supplier **outside Oman** → RCM record, nothing to clear
- **Act II — Vodafone as seller (B2B, postpaid)**
  3. `origin` postpaid B2B invoice raised in *Your billing system*
  4. `hub` **the canonical pipeline** — validate → ASP → OTA cleared → response
- **Act III — Vodafone as seller (B2C, postpaid, high volume)**
  5. `origin` postpaid B2C cycle — thousands of simplified invoices
  6. `hub` **batched once per day** to OTA
- **Act IV — B2C prepaid & the open questions**
  7. `origin` prepaid top-up / recharge at point of sale
  8. `hub` **OTA position: prepaid = single-purpose voucher** (recommended, flagged)
  9. `hub` **OTA position: out-of-bundle → aggregated to cycle** (recommended, flagged)
- **Act V — The platform (why Fawtara)**
  10. `hub` dashboard — all six streams on one screen
  11. `hub` a cleared document — UBL / PINT-OM fields + QR
  12. `hub` once-per-day batch operating model + reporting completeness
  13. `hub` data residency, OTA-interface alignment, ASP value — the differentiators

Tracked demo invoice: a Vodafone postpaid B2B tax invoice `VOD-INV-2026-00417`
(invented counterparty), carried on origin → pipeline → document.

---

## 5. Data-model notes

- **Identity — single entity.** Vodafone = one VATIN (`OM` + 10 digits, illustrative),
  one CR, one `0248` endpoint (`0248:OM<VATIN>` — Oman's registered scheme per PINT-OM).
  No group nuance; the seller block is straightforward.
- **Simplified B2C** modelled as **batch-reported once per day** (matches the agenda's
  "batch integration — once per day"), with the explicit assumption card.
- All figures illustrative; counterparties invented; OMR to 3 decimals, 5% VAT.
- The four OTA positions in §3 are the mock's only load-bearing tax claims and every one
  is flagged "to confirm with OTA".

---

## 6. What we build

- `vodafone-mock/` cloned from `zubair-mock`, portal surface removed.
- **`data.js`** re-populated: single-entity identity, the six scenario streams, a
  dashboard aggregate across streams, the tracked invoice, the four OTA-position blocks,
  inbound (inside/outside Oman) records. Reconciled to `tools/verify.py` before any
  screenshot.
- **`index.html`** rebuilt as the **scenario matrix** (six tiles, agenda-grouped).
- **`shell.js`** ACTS/WALKTHROUGH rewritten to the §4 scenario walkthrough; BRAND/NAV/ENV
  to Vodafone + generic-system labels; portal nav removed.
- **`origin/` surface** (generic billing/ERP look, new light CSS) — replaces `erp/`.
- **`hub/` surface** re-populated: dashboard, pipeline (validate/ASP/response), document,
  batch, reports, the two OTA-position screens, the RCM inbound screen, the differentiators
  screen.
- New **OTA-position card** component + **"to confirm with OTA"** treatment.
- **`VODAFONE-QUESTIONS.md`** (discovery list for the meeting), **`README.md`**,
  **`PRESENTER-SCRIPT.md`** (mapped to the agenda), **`GAP-REGISTER.md`**.
- **`Dockerfile`** — add `COPY vodafone-mock/ …`.
- **`tools/verify.py`** retargeted: Vodafone clone-drift bans (Zubair, Towell, NDC and
  prior entity names/prefixes), tracked-invoice id, generic-system-label checks, single
  entity, the OTA-position "to confirm" strings present.

---

## 7. Open item for approval

Everything above. On go-ahead I build directly (bounded per-file edits on the clone),
reconciling `data.js` to `verify.py` before screenshots, exactly as with the prior three.
