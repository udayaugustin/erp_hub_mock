# Al Nasr Group — the entity set, and where it came from

Last revised 14 Aug 2026. This records **what the prototype claims and why**, so anyone
presenting it can answer "where did you get that?" without guessing.

## The four entities

These are the four the client identified, and the prototype models **exactly these four** —
nothing inferred, nothing invented to pad the console.

| Entity | Business | Location |
|---|---|---|
| **Al Nasr Marbles** | Manufacturing, retail and quarrying. Quarries incl. Al Hoor | Darsait, Muscat |
| **Al Nasr Terrazzo** | Artificial stone, marble chips and powder | Rusayl Industrial Estate |
| **Al Nasr Trading & Contracting LLC** | Construction, civil engineering, infrastructure | Muscat |
| **Al Nasr Energy Services** | Oil & gas support, blasting and painting | Ghala Heights, Muscat |

Marbles, Terrazzo and Trading & Contracting are described as the group's core operational
divisions under Al Nasr Group of Companies LLC. Energy Services is listed as a **related company**
rather than a division.

## Corrections made to an earlier draft

An earlier version of this prototype modelled **eleven** entities, built by treating each
production site and quarry as its own company. That was wrong in three ways:

- **Al Nasr Trading & Contracting was excluded.** It was researched, found listed standalone in a
  business directory, and judged a different company. It is part of the group.
- **Terrazzo and marble chips & powder were split.** They are one division.
- **Sites were promoted to entities.** Darsait, Rusayl, Suwaiq and the individual quarries are
  facilities, not companies. Four of the eleven were invented outright to make the wave and
  method distributions look like a portfolio.

The group is a singular industrial group with divisions, not a portfolio of legal entities.

## Two things still to confirm

**1. VAT registration — this is the important one.**

Marbles and Terrazzo are divisions of Al Nasr Group of Companies LLC. In Oman, VAT registration
is per legal entity, and a Peppol participant ID is derived from the VAT identifier. So:

- If each division holds its own registration → four participants, four entities, and the
  multi-entity console is exactly the right pitch.
- If the divisions invoice under one group registration → Marbles and Terrazzo are **one**
  participant. The console has three entities, and part of the story becomes multi-*site*
  consolidation within one taxpayer rather than multi-entity.

The prototype models them as separate and **says so on the Companies screen**, because splitting
one participant into two later is easier than merging two into one. `vatUnconfirmed: true` on the
tenant records drives that notice.

**2. Whether Energy Services is in scope**, given it is described as related rather than a
division. It carries `scopeUnconfirmed: true`. Removing it is a contained change — one entity out
of `TENANTS`, and the group totals recomputed as described below.

## What is invented

Everything not in the table above: all VAT and CR numbers, every ERP and version, every connection
method and wave assignment, all volumes, failure counts, success rates and onboarding states, all
customers, suppliers, people and email addresses.

Product names (**AM Royal Beige**, **Al Suwaiq**, **Desert Sand**) and the **Al Hoor** quarry are
real; the orders quoting them are not.

## No self-hosted entity

Nothing in the client's material identifies a joint venture or a separately governed arm, so no
entity is assigned to the proposal's self-hosted exception. `GROUP.selfHosted` is `0`, and the
dashboard, Companies and Queue screens state that the path exists but is unassigned — which is
what the proposal itself says, since the split is confirmed by the governance classification.

This has a presentational benefit: because nothing is self-hosted, **every figure on the dashboard
is observed rather than self-reported**, and the four entity rows sum exactly to the group totals
with no unexplained remainder.

## If the entity count changes

It is load-bearing. Changing it means re-deriving, and the reconciliation is checked:

- `data.js` → `GROUP`: `entities`, `hubEntities`, `selfHosted`, `live`, `onboarding`,
  `notStarted`, `m1`, `m2`, `m3`, `pendingAssessment`. Invariants: `live + onboarding +
  notStarted == entities`, `m* == hubEntities`, `hubEntities + selfHosted == entities`.
- `data.js` → `WAVES`: `entities` and `live` per wave, summing to the group figures.
- `data.js` → per-entity `today` / `failed` / `pending` / `mtd`, which now sum **exactly** to
  `GROUP.todayTotal`, `todayFailed`, `todayPending` and `mtdTotal`.
- `data.js` → `REPORT_ROWS`: one row per entity; `docs` sums to `mtdTotal`, `failed` to
  `mtdFailed`, and VAT must equal `(net − zero) × 5%` on every row.
- `data.js` → `STAGE_COUNT`, which sums to `todayPending`; and `GROUP.week`, whose last value is
  `todayTotal`.
- `shell.js`: act II description, two walkthrough blurbs, the sidebar `tag`.
- Prose counts in `index.html`, `hub/login.html`, `hub/tenants.html`, `hub/users.html`,
  `hub/inbound.html`, `portal/dashboard.html`.

`tools/verify.py` checks all of this. It catches dangling entity and document references, and
evaluates `data.js` in node to reconcile every invariant above — so a half-finished entity change
fails the tool rather than reaching a screen. Run it after any edit to the dataset.
