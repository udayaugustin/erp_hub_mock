# Integrated Gas Company SAOC (IGC) × Fawtara — E-Invoicing Scope Walkthrough

A demonstration prototype for an IGC alignment session. IGC is **one legal entity**
(no VAT group) that raises and receives invoices in **six different ways**, all reaching
the Oman Tax Authority (OTA) through one pipe, with **Fawtara as the Accredited Service
Provider (ASP)**.

It is a **discovery / alignment tool**. Where the OTA has not settled a treatment
(export, allocation to government entities, take-or-pay shortfall) the mock shows
**Fawtara's recommended reading, always flagged "to confirm with OTA"**.

Served at `/igc-mock/`. Static HTML/CSS/JS, no build step.

**Legal name:** IGC's own site (igcoman.om) uses "Integrated Gas Company **SAOC**".
An earlier brief said SAOG; SAOC is used everywhere here. See `IGC-REAL-FACTS.md`.

## The six streams

| # | Stream | Role | Mode | OTA position |
|---|--------|------|------|--------------|
| 1 | Gas purchase · producers in Oman | Buyer | Peppol inbound → ERP draft | Settled |
| 2 | Gas transportation · transporter | Buyer | Peppol inbound → ERP draft | Settled |
| 3 | Long-term gas sales (monthly, metered) | Seller | Cleared live | Settled (take-or-pay line to confirm) |
| 4 | Spot gas sales | Seller | Cleared live | Settled |
| 5 | Credit & debit notes (price/volume true-up) | Seller | Cleared live, references original | Settled |
| 6 | Export · zero-rated | Seller | Cleared live | To confirm |

## Fawtara's recommended OTA positions (to confirm)

- **Export** — 0% VAT with a reason code; export evidence archived with the invoice.
- **Allocation to government entities** — invoiced as ordinary B2B where there is
  consideration; a pure book allocation raises no invoice.
- **Take-or-pay shortfall** — consideration for availability of gas, standard-rated 5%,
  on its own invoice line.

## Walkthrough (13 steps, 5 acts)

Generated from `WALKTHROUGH` / `ACTS` in `assets/js/shell.js`:

1. Signing in to the console · 2. All six streams on one screen ·
3. A long-term gas sales invoice (origin) · 4. Validated and cleared to the OTA ·
5. The cleared e-invoice · 6. Monthly billing from metered volumes (origin) ·
7. Spot sales and true-up notes · 8. Export and government allocation ·
9. Take-or-pay shortfall · 10. Producer and transporter invoices, in ·
11. Reports and reconciliation · 12. Why Fawtara · 13. The answer, back on the invoice.

The tracked invoice **IGC-INV-2026-00417** (July 2026 volumes, 527,600 MMBtu at
OMR 1.600) is followed origin → pipeline → document → back onto the invoice.

## Structure

- `index.html` — the scenario matrix (front door).
- `origin/` — IGC's ERP, shown **generically** ("Enterprise ERP"; the real ERP is unknown):
  `billing.html`, `nominations.html`, `sync.html`.
- `hub/` — the Fawtara console: `login, dashboard, queue, document, adjustments, export,
  takeorpay, inbound, reports, value, asp, mapping, history, boundary`.
- `assets/js/data.js` — single source of truth (entity, six streams, OTA positions,
  pipeline, validation, ASP structures).
- `assets/js/shell.js` — sidebar/topbar/step-nav injector + the canonical walkthrough.
- `tools/verify.py` — static lint + Playwright browse.

## Verify

```
python3 tools/verify.py
```

## Honesty

Only a handful of facts about IGC are real (see `IGC-REAL-FACTS.md`). Every VATIN, CR
number, counterparty, volume, price, document number and tax treatment is illustrative.
`GAP-REGISTER.md` lists what is deliberately assumed.
