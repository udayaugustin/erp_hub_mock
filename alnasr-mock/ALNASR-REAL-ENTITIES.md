# Al Nasr Marbles — what the prototype claims, and where it came from

Last revised 15 Aug 2026. This records **what the prototype claims and why**, so anyone
presenting it can answer "where did you get that?" without guessing.

## One company, deployed on its own ERP

This prototype is a **standalone single-company** e-invoicing / tax-compliance system for
**Al Nasr Marbles**, deployed on that company's own ERP server. It is **not** a central hub and
**not** a group console. Al Nasr is a small group (~3–4 companies), so rather than route every
company's data into one shared platform, the same application is installed separately for each
company. This build features **Al Nasr Marbles**; a sibling build would feature another company by
swapping the dataset.

> **History.** This mock was cloned from a central-hub build for the WJ Towell group, and an
> earlier Al Nasr draft modelled the whole group as a four-entity console (Marbles, Terrazzo,
> Trading & Contracting, Energy Services). That framing was dropped: Al Nasr does not want a
> centralised group system, so the console was collapsed to one company. The other Al Nasr
> companies are real, but each would get its own deployment, not a row in a shared dashboard.

## The featured company

| Field | Value |
|---|---|
| **Name** | Al Nasr Marbles |
| **Business** | Manufacturing, retail and quarrying of marble. Quarries incl. Al Hoor | 
| **Location** | Darsait, Muscat |
| **ERP** | ERPNext v15, connected over the direct API (Method 1) |

Al Nasr Marbles is described as a division of Al Nasr Group of Companies LLC.

## What is invented

Everything except the company name, its sector and location: all VAT and CR numbers, the ERP
version, connection method, all volumes, failure counts, success rates, customers, suppliers,
people and email addresses.

Product names (**AM Royal Beige**, **Al Suwaiq**, **Desert Sand**) and the **Al Hoor** quarry are
real; the orders quoting them are not.

## One thing still to confirm

**VAT registration.** In Oman, VAT registration is per legal entity and a Peppol participant ID is
derived from the VAT identifier. Al Nasr Marbles is modelled with its own registration
(`OM1100381742`). If it invoices under a shared group registration instead, the participant ID
would change — but the single-company system is unaffected either way, because it only ever handles
this one company's documents.

## The dataset, and how it reconciles

`assets/js/data.js` holds one company (`TENANTS` has a single record) and `GROUP` is that
company's own roll-up — today's and month-to-date figures for Al Nasr Marbles alone. The numbers
are load-bearing and `tools/verify.py` reconciles them by evaluating `data.js` in node:

- `GROUP`: `entities === 1`; `live + onboarding + notStarted === entities`;
  `m1 + m2 + m3 + pendingAssessment === entities`;
  `todaySuccess + todayFailed + todayPending === todayTotal`.
- The single `TENANTS` record's `today` / `failed` / `pending` equal `GROUP.todayTotal`,
  `todayFailed`, `todayPending`.
- `REPORT_ROWS` is **by document type** (Standard invoices / Exports / Simplified / Credit notes),
  each with a `label`. `docs` sums to `GROUP.mtdTotal`, `failed` to `GROUP.mtdFailed`,
  `ack + failed === docs` on every row, and VAT equals `(net − zero) × 5%`.
- `STAGE_COUNT` sums to `todayPending`; `GROUP.week`'s last value is `todayTotal`.
- `WAVES` are the company's own go-live phases (outbound, inbound, reporting), not per-entity waves.

`tools/verify.py` also catches dangling document references, banned vocabulary (including any
leftover "central hub", "Compliance Hub", "Group Dashboard" or "tenant" wording), dead links, and
runs a live browser walk over all 14 walkthrough steps. Run it after any edit to the dataset.
