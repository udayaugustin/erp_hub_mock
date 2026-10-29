# Peniel Technology LLC — Central Hub E-Invoicing Mock (design)
**Date:** 2026-10-29
**Prospect:** Peniel Technology LLC ("Penieltech") — https://www.penieltech.com · Oman site https://www.penielcomputer.com/om
**Purpose:** show an accounting-software and IT-solutions partner that its six revenue and cost streams — licences, implementation, renewals, training, hardware and vendor purchases — reach Oman's OTA through one Fawtara pipe, and bring recommended positions on the treatments still open.
**Base template:** clone `mec-mock` → new `peniel-mock/`

## 1. Scope (decided)
- One invoicing entity, one VATIN, one Commercial Registration, no VAT group. Which legal entity
  that is (Dubai LLC or an Omani LLC) is **not confirmed** — see §7. The mock presents an Omani
  filer and flags the question on the boundary screen.
- **B2B only.** Essentially every Peniel customer is a business: a shop running Tally, a
  clinic running Elate, a contractor running ERPNext. There is no meaningful B2C invoice stream,
  so none is modelled. Each outbound document is B2B or Export, validated by the ASP, with
  outcomes arriving asynchronously on three legs. No screen may say the OTA clears or rejects an
  invoice: the ASP validates and may reject, and the ASP reports to the OTA.
- Peniel resells and implements Tally, QuickBooks, Elate, ERPNext, Odoo and Sage. Its own
  finance system is unknown, so the origin surface is labelled **"Peniel finance system"** and
  names no vendor product. Vendor product names appear only as *what Peniel sells*, in line-item
  descriptions and in the customer's system field.
- Hardware sales are in scope as a goods line (a POS terminal, a barcode scanner), because the
  Oman site lists hardware & networking. The mock does not model delivery notes or e-way
  documents — out of scope, noted in the gap register.
- Counterparties are fictional. The **vendors Peniel sells** are named as real brands because
  they are on Peniel's own site and are not counterparties to the invoice demo; the distributor
  that actually invoices Peniel is fictional.

## 2. The story this mock tells
Peniel's money does not come from one product line — it comes from six shapes at once, and the
awkward one is the renewal run: hundreds of small, almost identical annual subscription invoices
every month, which is exactly what a person-keying process fails at. The demo follows one
implementation invoice end to end, then shows the renewal batch, a foreign-currency vendor
purchase, an Omani customer's own e-invoice arriving inbound, and the export/recharge question
that only gets answered once the legal-entity structure is known.

## 3. Entity roster
Single entity, so a profile and not a roster. **Peniel Technology LLC**, group HQ in Bur Dubai,
UAE; Oman presence in Seeb, Muscat (address and phone from Peniel's own Oman contact page). The
business is accounting-software and IT-solutions reselling, implementation, support and training,
ISO 9001:2015 certified, 17+ years, with listed offices in UAE, Oman, Qatar, Saudi Arabia and two
in India. Every figure — VATIN, CR, clients, contracts, volumes, amounts — is illustrative. What
is real is in `PENIEL-REAL-FACTS.md`.

## 4. What we build
Base choice: **`mec-mock`**, not the skill's default `vodafone-mock`. Both are single-entity with
`origin/` + `hub/` and no `portal/`. `vodafone-mock` is built around B2C prepaid batches, which
Peniel does not have at all. `mec-mock` is B2B-only, live per-document, with credit/debit notes,
an export stream and an inbound side — structurally the right shape, and its `origin/timesheets.html`
and `hub/retention.html` are the two screens that need replacing rather than rebranding. The cost
is that it is an engineering-consultancy mock, so its vocabulary (milestones, manhours, FEED,
PMC, retention money, engineering ERP) must be removed. `CLONE_DRIFT` guards that.

- `assets/js/data.js`: six STREAMS, four OTA_POSITIONS, SUBSCRIPTION run, INVOICES, INBOUND,
  MAPPING, ERP schema rewritten from engineering fields to software-licence fields.
- `assets/js/shell.js` and `index.html`: **16 steps in 5 acts**.
- `origin/billing.html` — licence and implementation invoices raised from Peniel's finance system
  (replaces milestone invoicing).
- `origin/subscriptions.html` **new** — the monthly renewal run: hundreds of annual support
  renewals, with the held-back exceptions (replaces `origin/timesheets.html`).
- `origin/sync.html` — the result flowing back into the finance system.
- `hub/adjustments.html` — credit notes for prorated cancellations and disputed licence counts.
- `hub/export.html` — services exported from Oman, plus the intra-company recharge position.
- `hub/retention.html` **replaced by `hub/currency.html`** — vendor purchases in AED/USD/INR and
  the currency and exchange-rate fields on an Oman e-invoice.
- `hub/inbound.html` — an Omani customer's e-invoice arriving over Peppol, matched and landed as a
  draft receivable. Reframed: Peniel is the **supplier** here, so the interesting inbound case is
  a customer-sent document or a vendor's Peppol invoice.
- Remaining hub screens rebranded: login, dashboard, mapping, queue, document, asp, history,
  reports, value, boundary, export.
- Docs: `README.md`, `PRESENTER-SCRIPT.md`, `GAP-REGISTER.md`, `PENIEL-QUESTIONS.md`,
  `PENIEL-REAL-FACTS.md`. No `-REAL-ENTITIES.md` (single entity).
- Root `Dockerfile`: add exactly one line, `COPY peniel-mock/ /usr/share/nginx/html/peniel-mock/`.
- `tools/verify.py` retargeted: MEC terms in `CLONE_DRIFT`; bans on engineering-consultancy
  vocabulary and on any wording that makes the OTA clear invoices; keeps the data-residency ban.

### The six streams — the spine of this mock
| # | Stream | Dir | Shape | Why it is in the demo |
|---|--------|-----|-------|------------------------|
| 1 | Software licences — new sales | out | one-off, goods-like, standard rate | the canonical document; tracked end to end |
| 2 | Implementation & customisation projects | out | milestone-billed services | matches how an ERP rollout is actually paid |
| 3 | Annual support & subscription renewals | out | recurring, high count, near-identical | the automation case; the batch screen |
| 4 | Training & consultancy days | out | small, frequent, per-attendee | low value, high count; the noise a batch hides |
| 5 | Hardware & networking | out | goods, standard rate | the only true goods stream; keeps the goods/services indicator honest |
| 6 | Vendor licences & imported services | in | foreign currency, reverse charge | the cost side; currency fields; self-accounting |

Streams 1–5 are seller side, 6 is buyer side. Hardware (5) and licences (1) both carry VAT at
the standard rate; the difference the mock teaches is the goods/service indicator and, for
renewals (3), volume. Each maps to a genuinely different invoice building problem, which is the
test for whether a stream earns its place.

### The 16 steps (5 acts)
1. `hub-login` — Act 1 · Where the data comes from
2. `origin-billing` — the licence + implementation invoice in Peniel's finance system
3. `origin-subscriptions` — the monthly renewal run, and what it held back
4. `hub-mapping` — what the finance system exposes, mapped to PINT-OM (interactive)
5. `hub-dashboard` — Act 2 · One pipe, six streams
6. `hub-queue` — the processing queue
7. `hub-document` — the tracked invoice, built and validated
8. `hub-asp` — the three acknowledgement legs
9. `hub-inbound` — Act 3 · The other direction (vendor and customer documents in)
10. `hub-currency` — foreign-currency vendor purchases and the exchange-rate fields
11. `hub-adjustments` — credit notes: prorated cancellations, disputed seat counts
12. `hub-export` — Act 4 · The open questions (export, intra-company recharge)
13. `hub-history` — the record
14. `hub-reports` — completeness by stream
15. `hub-boundary` — Act 5 · Who does what, and what we need from Peniel
16. `hub-value` — why Fawtara, and the close

### The tracked demo invoice
`PTI-INV-2026-00418` — an ERPNext implementation for a Muscat trading company:
- Implementation & data migration, 14 days at OMR 165.000 = 2,310.000 (stream 2)
- ERPNext user licences, 12 users at OMR 48.000 = 576.000 (stream 1)
- Net 2,886.000 · VAT 5% = 144.300 · Total **3,030.300**

A third line is intentionally absent: a training day quoted but not yet delivered, shown on the
finance-system screen as a separate unposted document — that is how a real implementation invoice
looks.

## 5. Data-model notes
- Identity: one VATIN (BT-31), one CR (IBT-029, scheme `CR`), one Peppol participant
  `0248:OM<VATIN>`. The exact Oman scheme is to be confirmed on the OTA onboarding portal.
- **The tracked invoice total has to reconcile on every screen it appears on:** document
  inspector, queue row, history row, the reports month-to-date contribution, and the
  finance-system screen. 2,886.000 + 144.300 = 3,030.300 is the one figure `verify.py` sees agree
  everywhere.
- Currency: OMR to 3 decimals for outbound. Vendor purchases arrive in **USD and AED** and are
  converted; the mock shows the source currency, the rate and the OMR equivalent, and labels the
  rate as illustrative.
- Goods vs. services: hardware lines (stream 5) carry the goods indicator; licence and service
  lines carry services. That is the one place a Peniel demo differs from a pure-services prospect.
- Renewal run: 214 renewals in the sample month, 209 sent, 5 held (3 missing an address, 2 with a
  price query from the customer). The batch carries OMR 41,856.000 net across 214 documents. The
  five held are shown with their reasons and are never auto-sent.
- Dates and clock: demo clock **Thursday 29 October 2026, 10:42 GST** (Oman's week runs Sun to Thu).
- All data is illustrative. Real facts are limited to the legal name, the Dubai HQ, the Oman
  presence in Seeb, the product and partner list, and the ISO certification — recorded with
  sources in `PENIEL-REAL-FACTS.md`.

## 6. Discovery questions
Mirrored into `peniel-mock/PENIEL-QUESTIONS.md`. The eight from the research brief carry across
verbatim, plus two the design raised: whether renewals are billed on the anniversary date or
coalesced monthly, and whether hardware customers are ever consumers — which would create a B2C
stream this design has excluded.

## 7. Open item for approval
Everything above is a checkpoint before building. For a human:
- **Base template deviates from the skill default.** Single entity would normally clone
  `vodafone-mock`; this clones `mec-mock` because Peniel has no B2C and is B2B/services-heavy.
- **Legal entity is unconfirmed.** The demo presents an Omani filer. If Peniel's Omani sales are
  invoiced by the Dubai entity, the domestic/export split changes and the stream framing shifts.
- **Six streams are inferred** from the published product catalogue, not observed. If Peniel does
  not sell hardware, or bills renewals annually rather than monthly, stream 5 or the renewal-run
  framing should change.
- **Vendor brands** (Tally, QuickBooks, Elate, ERPNext, Odoo, Sage) appear only as things Peniel
  sells, never as counterparties. The distributor that invoices Peniel is fictional.
- **One screen is rebuilt**: `hub/retention.html` becomes `hub/currency.html`. Nothing else is
  added or removed, so the mock stays at 16 steps like `mec-mock`.
