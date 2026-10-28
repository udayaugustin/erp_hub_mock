# Muscat Engineering Consultancy LLC — Central Hub E-Invoicing Mock (design)
**Date:** 2026-10-28
**Prospect:** Muscat Engineering Consultancy LLC — no public website found (see research brief)
**Purpose:** show an engineering consultancy that its six invoice streams reach the OTA through one Fawtara pipe, and bring recommended positions on the treatments still open.
**Base template:** clone `igc-mock` → new `mec-mock/`

## 1. Scope (decided)
- One legal entity, one VATIN, no VAT group. Foreign branches are out of scope as separate
  entities (one legal person); recharges to them are an OTA position, not a stream.
- No B2C. Every outbound document is B2B or Export, cleared live per document.
- ERP unknown → origin surface stays generic ("Enterprise ERP").

## 2. The story this mock tells
A consultancy bills two ways (certified milestones, approved manhours), corrects with notes,
exports engineering to the Gulf, and buys from subcontractors at home and software/studies from
abroad. One pipe carries all six; four tax questions get Fawtara's reading, tagged to confirm.

## 3. Entity roster
Single entity: Muscat Engineering Consultancy LLC, Muscat — engineering & project-management
consultancy, founded 2002. Identity and all figures illustrative.

## 4. What we build
- `data.js`: six STREAMS, four OTA_POSITIONS, CONTRACT (C-2025-118 milestones), TIMESHEETS.
- `shell.js` / `index.html`: 13 steps, 5 acts; nav for milestones, timesheets, notes, positions.
- `origin/billing.html` (milestone invoices + contract milestones), `origin/timesheets.html`
  (replaces nominations), `origin/sync.html`.
- `hub/adjustments.html` (credit/debit notes), `hub/export.html` (export of services + branch
  recharges), `hub/retention.html` (replaces take-or-pay), `hub/inbound.html` (subcontractors +
  reverse charge); remaining hub screens rebranded.
- Docs, Dockerfile line, `verify.py` retargeted (IGC terms added to CLONE_DRIFT).

## 5. Data-model notes
Peppol participant 0248:OM<VATIN>. Tracked invoice MEC-INV-2026-00382 = Milestone 4 (15% of
OMR 1,240,000) + VO-03 (12,400) = 198,400.000 net, 9,920.000 VAT. Contract reference in BT-12.
Lump-sum lines unit C62, manhour lines HUR; BTOM-019 = services. All data illustrative.

## 6. Discovery questions
→ mirrored into `mec-mock/MEC-QUESTIONS.md`.

## 7. Open item for approval
Everything above. Built straight through without a pause for approval; the branch network
(single source) and billing models (inferred) deserve a human look.
