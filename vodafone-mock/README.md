# Vodafone Oman × Fawtara — E-Invoicing Scope Walkthrough

A demonstration prototype for the Vodafone Oman alignment session. Unlike the
group-hub mocks (WJ Towell, NDC, Zubair), this is **not** a multi-entity VAT-group
story. Vodafone is **one legal entity** that raises and receives invoices in **six
different ways** — the meeting agenda — all reaching the Oman Tax Authority (OTA)
through one pipe, with **Fawtara as the Accredited Service Provider (ASP)**.

It is a **discovery / alignment tool**. Two of the six streams carry tax treatments
the OTA has not settled (prepaid top-ups, out-of-bundle usage); for those the mock
shows **Fawtara's recommended reading, always flagged "to confirm with OTA"**.

Served at `/vodafone-mock/`. Static HTML/CSS/JS, no build step.

## The six streams (the agenda)

| # | Stream | Role | Mode | OTA position |
|---|--------|------|------|--------------|
| 1 | B2B · supplier inside Oman | Buyer | Peppol inbound → ERP draft | Settled |
| 2 | B2B · supplier outside Oman | Buyer | Reverse charge (RCM) | To confirm |
| 3 | B2B · postpaid | Seller | Cleared live | Settled |
| 4 | B2C · postpaid | Seller | Daily batch | Settled |
| 5 | B2C · prepaid top-ups | Seller | Daily batch | To confirm |
| 6 | Out-of-bundle usage | Seller | On the cycle invoice | To confirm |

## Fawtara's recommended OTA positions (to confirm)

- **Prepaid top-ups → single-purpose voucher.** Tax point at the top-up; consumption is
  not a new tax point.
- **Buy plan from balance / card / voucher.** From balance → no new tax point; from
  card/cash → new top-up, taxed; from voucher → taxed when the voucher was bought.
- **Out-of-bundle usage → taxable at consumption, aggregated** into the monthly postpaid
  invoice (one invoice per cycle, not one per event).
- **Supplier outside Oman → reverse charge.** No inbound Peppol; Vodafone self-accounts;
  Fawtara captures the record and archives the original.

## Walkthrough (13 steps, 5 acts)

Generated from `WALKTHROUGH` / `ACTS` in `assets/js/shell.js`:

1. Signing in to the console · 2. All six streams on one screen ·
3. A postpaid B2B invoice (origin) · 4. Validated and cleared to the OTA ·
5. The cleared e-invoice · 6. Consumer billing, at volume (origin) ·
7. One batch a day to the OTA · 8. Prepaid: a single-purpose voucher ·
9. Out-of-bundle usage · 10. Supplier invoices, in and imported ·
11. Reports and reconciliation · 12. Why Fawtara · 13. The answer, back on the invoice.

The tracked invoice **VOD-INV-2026-00417** (B2B postpaid) is followed origin → pipeline
→ document → back onto the invoice.

## Structure

- `index.html` — the scenario matrix (front door).
- `origin/` — Vodafone's own systems, shown **generically** ("Your billing system"):
  `billing.html`, `consumer.html`, `sync.html`.
- `hub/` — the Fawtara console: `login, dashboard, queue, document, batch, prepaid,
  usage, inbound, reports, value, asp, mapping, history, boundary`.
- `assets/js/data.js` — the single source of truth (single entity, six streams, the four
  OTA positions, the pipeline/validation/ASP structures).
- `assets/js/shell.js` — sidebar/topbar/step-nav injector + the canonical walkthrough.
- `tools/verify.py` — static lint + Playwright browse (order, nav, light theme, generic
  origin, OTA-position flags, interactivity, tracked invoice).

## Verify

```
python3 tools/verify.py
```

## Honesty

Vodafone Oman is real; every counterparty, figure, invoice number and — importantly —
every tax treatment is illustrative. The stack is shown generically because it is not
confirmed. See `VODAFONE-QUESTIONS.md` for what to confirm in the session and
`GAP-REGISTER.md` for what is deliberately assumed.
