# Muscat Engineering Consultancy LLC (MEC) × Fawtara — E-Invoicing Scope Walkthrough

A demonstration prototype for an MEC alignment session. MEC is **one legal entity**
(no VAT group): an engineering and project-management consultancy that raises and receives
invoices in **six different ways**, all reaching the Oman Tax Authority (OTA) through one pipe,
with **Fawtara as the Accredited Service Provider (ASP)**.

It is a **discovery / alignment tool**. Where the OTA has not settled a treatment (export of
services, recharges to MEC's own branches abroad, retention and advance payments, imported
services under the reverse charge) the mock shows **Fawtara's recommended reading, always
flagged "to confirm with OTA"**.

Served at `/mec-mock/`. Static HTML/CSS/JS, no build step. Structurally cloned from `igc-mock`.

## The six streams

| # | Stream | Role | Mode | OTA position |
|---|--------|------|------|--------------|
| 1 | Lump-sum engineering · milestones (FEED, detailed design) | Seller | Sent per document | Settled (retention money / advance to confirm) |
| 2 | Reimbursable manhours · PMC, owner's engineer, site supervision | Seller | Sent per document | Settled |
| 3 | Credit & debit notes · disputed hours, rate escalation | Seller | Sent per document, references original | Settled |
| 4 | Services to clients outside Oman · zero-rated | Seller | Sent per document | To confirm |
| 5 | Subcontractors & suppliers in Oman | Buyer | Peppol inbound → ERP draft | Settled |
| 6 | Imported services · reverse charge | Buyer | PDF → self-accounted ERP draft | To confirm |

## Fawtara's recommended OTA positions (to confirm)

- **Export of services** — 0% VAT with a reason code where the client has no Omani
  establishment and the work is used outside Oman; residence and place-of-use evidence archived.
- **Branch recharges** (conditional — the branch network comes from one unverified directory) —
  head office and its own foreign branch would be one legal person, so a recharge is a book entry
  and never enters the pipe.
- **Retention money & advances** — VAT on the full certified value at invoicing (retention is a
  payment term and is not on the e-invoice); the advance is taxed once on receipt and recovered as
  a prepaid amount (BT-113).
- **Imported services** — the Hub records the foreign PDF, computes reverse-charge VAT and lands a
  flagged draft; a self-billed e-document is built only if the OTA requires one.

## Walkthrough (13 steps, 5 acts)

Generated from `WALKTHROUGH` / `ACTS` in `assets/js/shell.js`:

1. Signing in · 2. All six streams on one screen · 3. A milestone invoice (origin) ·
4. Validated, sent and reported · 5. The validated e-invoice · 6. Monthly billing from approved
timesheets (origin) · 7. Credit and debit notes · 8. Export of services and branch recharges ·
9. Retention money and advance payments · 10. Subcontractor invoices in, and the reverse charge ·
11. Reports and reconciliation · 12. Why Fawtara · 13. The answer, back on the invoice.

The tracked invoice **MEC-INV-2026-00382** (contract C-2025-118, Milestone 4 = 15% of
OMR 1,240,000 plus variation VO-03, net OMR 198,400.000, VAT 9,920.000, total 208,320.000) is
followed origin → pipeline → document → back onto the invoice. It settles the same way on every
screen: advance already paid (BT-113) 19,530.000, payable on the e-invoice (BT-115) 188,790.000,
retention held as a payment term 19,840.000, cash due now 168,950.000. All illustrative.

Outcomes are asynchronous: the ASP validates and may reject, the ASP reports to the OTA, and the
buyer's provider confirms delivery on a third leg. The OTA does not clear or reject invoices.

## Structure

- `index.html` — the scenario matrix (front door).
- `origin/` — MEC's ERP, shown **generically** ("Enterprise ERP"; the real ERP is unknown):
  `billing.html`, `timesheets.html`, `sync.html`.
- `hub/` — the Fawtara console: `login, dashboard, queue, document, adjustments, export,
  retention, inbound, reports, value, asp, mapping, history, boundary`.
- `assets/js/data.js` — single source of truth (entity, six streams, OTA positions, contract,
  timesheets, pipeline, validation, ASP).
- `assets/js/shell.js` — sidebar/topbar/step-nav injector + the canonical walkthrough.
- `tools/verify.py` — static lint + Playwright browse.

## Verify

```
python3 tools/verify.py
```

## Honesty

Only a handful of facts about MEC are real (see `MEC-REAL-FACTS.md`). Every VATIN, CR number,
client, subcontractor, contract, rate, document number and tax treatment is illustrative.
`GAP-REGISTER.md` lists what is deliberately assumed.
