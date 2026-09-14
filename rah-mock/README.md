# Ras Al Hamra Group — Central E-Invoicing Hub (demo)

A guided, eighteen-step walkthrough of a central e-invoicing hub for Ras Al Hamra
Group — a real, 100%-Omani conglomerate (est. 1996, Muscat) spanning oil & gas services,
environmental services, projects & products, and digital transformation, with a
manpower-secondment business serving major operators in Oman.

Open `index.html` to start.

## What's real, what's illustrative
Five member companies use REAL, publicly known Ras Al Hamra Group names: **Ras Al Hamra
LLC** (flagship), **Middle East Consulting Engineering LLC**, **Operation Excellence
LLC**, **Add Energy & Partner LLC**, and **Innovative Oil and Gas LLC**. The remaining
seven fill out a twelve-company VAT Group structure and are illustrative — built around
the Group's stated divisions, not confirmed legal entities. See `GAP-REGISTER.md` for the
full breakdown.

Every member of the Ras Al Hamra Group VAT Group invoices under the *same* group TRN
(illustrative). That is one filing identity — but twelve separate legal entities, spread
across four different ERPs:

- **Enterprise ERP** — Ras Al Hamra LLC, Middle East Consulting Engineering, Operation
  Excellence, Add Energy & Partner.
- **Finance Suite** — Innovative Oil and Gas LLC.
- **Field Operations System** — six field/site-based entities, including the volume
  driver **RAH Manpower Services LLC** (~66k simplified B2B invoices a month, across four
  operator sites — technician secondment, PPE and small-tools billback, site consumables).
- **Accounting System** — RAH Equipment Trading LLC.

One filing identity, many legal entities, several ERPs — which is exactly why a **central
hub** is the natural normalization and reporting layer. The hub reads all four ERPs,
produces one compliant PINT-OM document per invoice, and reports to the OTA through **one
pipe** via the ASP, Fawtara X.

## Structure
- `index.html` — the walkthrough entry point.
- `hub/` — the Central Hub console (dashboard, companies, mapping, queue, inbound, reports, …).
- `erp/` — two invoice origins: a modern web ERP (`invoices.html`, `sync.html`) and the
  Field Operations System (`counter.html`).
- `portal/` — the single-entity portal a member company signs into.
- `tools/verify.py` — static + Playwright checks; run before every commit.

## Verify before committing
```
python3 tools/verify.py
```
