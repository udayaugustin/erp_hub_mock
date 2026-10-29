# Peniel Technology LLC (Penieltech) × Fawtara — E-Invoicing Scope Walkthrough

A demonstration prototype for a Peniel alignment session. Peniel is **one invoicing entity**
(no VAT group): an accounting-software and IT-solutions partner that raises and receives invoices
in **six different ways**, all reaching the Oman Tax Authority (OTA) through one pipe, with
**Fawtara as the Accredited Service Provider (ASP)**.

It is a **discovery / alignment tool**. Where the OTA has not settled a treatment (export of
services, intra-company recharges to the Dubai head office, foreign-currency vendor purchases,
self-billing for imported services) the mock shows **Fawtara's recommended reading, always flagged
"to confirm with OTA"**.

Served at `/peniel-mock/`. Static HTML/CSS/JS, no build step. Structurally cloned from `mec-mock`.

## The six streams

| # | Stream | Role | Mode | OTA position |
|---|--------|------|------|--------------|
| 1 | New software licences — Tally, ERPNext, Elate, Odoo, QuickBooks | Seller | Sent per document | Settled |
| 2 | Implementation & customisation projects — billed by stage or consultant day | Seller | Sent per document | Settled |
| 3 | Annual support & subscription renewals — the monthly run | Seller | Method 3 — secure file transfer, batch | Settled |
| 4 | Training & consultancy days | Seller | Sent per document | Settled |
| 5 | Hardware & networking — POS terminals, scanners, switches | Seller | Sent per document | Settled (goods line) |
| 6 | Vendor licences & imported services | Buyer | Peppol inbound → draft; foreign PDF → self-accounted draft | To confirm |

## Fawtara's recommended OTA positions (to confirm)

- **Export of services** — 0% VAT with a reason code where the customer has no Omani establishment
  and the service is used outside Oman; residence and place-of-use evidence archived with the XML.
- **Intra-company recharges** (conditional — the group structure is unverified) — if the Dubai head
  office and the Omani business are one legal person, a recharge is a book entry and never enters
  the pipe. Where the Omani entity bills a customer directly, that is an ordinary invoice.
- **Foreign-currency vendor purchases** — convert at the rate written into the finance policy, and
  hold the source amount, the rate and the OMR equivalent on the archived record so the conversion
  can be re-performed. Whatever rate the day happened to use is the alternative, and it moves the
  month's recoverable input VAT.
- **Imported services / reverse charge** — the Hub records the foreign PDF, computes the OMR
  equivalent and the 5% self-accounted VAT, and lands a flagged draft; a self-billed e-document is
  built only if the OTA requires one.

## Walkthrough (17 steps, 5 acts)

| Act | Steps | What it shows |
|-----|-------|---------------|
| I — Where the data comes from | 1–4 | Sign-in, the tracked licence-and-implementation invoice, the 214-renewal run and its 5 held documents, field mapping |
| II — One pipe, six streams | 5–8 | Six streams on one dashboard, the nine-stage pipeline, the validated XML, the three acknowledgement legs |
| III — The other direction | 9–11 | Inbound distributor drafts and reverse-charge PDFs, foreign-currency conversion, credit and debit notes |
| IV — The open questions | 12 | Export of services and intra-company recharges, with Fawtara's reading |
| V — The record, and the close | 13–17 | Processing history, reports, the delivery boundary, why Fawtara, the result written back |

## The tracked demo invoice

`PTI-INV-2026-00418` — Al Khuwair Trading & Contracting LLC, contract `AKT-ERP-2026`, ERPNext
implementation stage 4 plus 12 user licences:

```
14 consultant days × 165.000  = 2,310.000
12 user licences  ×  48.000  =   576.000
                                ---------
Net                            2,886.000
VAT · 5%                         144.300
                                ---------
Invoice total                  3,030.300
less advance already invoiced  2,205.000   (BT-113, 25% of contract + VAT)
                                ---------
Payable on the e-invoice         825.300   (BT-115)
less retention held              288.600   (payment term, not on the e-invoice)
                                ---------
Cash due on the due date         536.700
```

These five figures appear identically on the finance-system invoice screen, the document
inspector and the write-back screen. `tools/verify.py` asserts it.

## What is real and what is invented

**Real** (sourced in `docs/specs/2026-10-29-peniel-research.md`): the legal name Peniel Technology
LLC, headquarters in Bur Dubai, an Oman presence in Seeb (Muscat), the product and partner list,
ISO 9001:2015 certification, "17+ years trading".

**Invented:** every VATIN, CR number, Peppol participant ID, customer, supplier, contract, rate,
invoice number, amount and tax treatment. Every counterparty is fictional. Nothing here states how
Peniel actually invoices.

## Files

```
index.html                     the act/step map — derived from WALKTHROUGH in shell.js
hub/login.html                 act I  · console sign-in
origin/billing.html            act I  · finance system — sales invoices, tracked invoice
origin/subscriptions.html      act I  · finance system — the monthly renewal run and what it held
hub/mapping.html               act I  · field mapping studio (operable)
hub/dashboard.html             act II · six streams, volume, health
hub/queue.html                 act II · the nine-stage pipeline
hub/document.html              act II · the validated UBL XML and validation report
hub/asp.html                   act II · three acknowledgement legs
hub/inbound.html               act III· distributor drafts, reverse-charge PDFs
hub/currency.html              act III· foreign-currency conversion and the rate policy
hub/adjustments.html           act III· credit and debit notes against originals
hub/export.html                act IV · export of services, intra-company recharges (to confirm)
hub/history.html               act V  · processing history
hub/reports.html               act V  · VAT by stream, renewals, position register
hub/boundary.html              act V  · who does what
hub/value.html                 act V  · why Fawtara
origin/sync.html               act V  · the result written back onto the invoice
assets/js/data.js              every figure on every screen
assets/js/shell.js             acts, walkthrough order, navigation
assets/js/ui.js                shared render helpers
tools/verify.py                static sweep + live browser walk
```

## Running it

```bash
cd peniel-mock
python tools/verify.py        # needs playwright + chromium; prints CLEAN when it passes
```

Or open `index.html` in a browser directly — no server, no build.

## Standing rules this mock holds to

- Fictional customers and suppliers only. No real Omani operator or government body is named as a
  counterparty.
- Every unverified fact is marked "to confirm".
- No retention period, SLA, price or data-residency promise is stated as fact.
- Oman terms only: OTA, PINT-OM, Peppol, VATIN, CR, ASP. The **OTA receives reports** — it never
  clears or rejects an invoice. The ASP validates and may reject; the ASP reports to the OTA.
