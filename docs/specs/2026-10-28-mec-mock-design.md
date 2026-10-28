# Muscat Engineering Consultancy LLC — Central Hub E-Invoicing Mock (design)
**Date:** 2026-10-28
**Prospect:** Muscat Engineering Consultancy LLC — no public website found (see research brief)
**Purpose:** show an engineering consultancy that its six invoice streams reach the OTA through one Fawtara pipe, and bring recommended positions on the treatments still open.
**Base template:** clone `igc-mock` → new `mec-mock/`

## 1. Scope (decided)
- One legal entity, one VATIN, one Commercial Registration, no VAT group. The research brief
  found no subsidiaries and no group; its confidence on this is medium.
- Branches abroad (Saudi Arabia, Qatar, Kuwait, India) come from one unverified directory. They
  are out of scope as entities. If they are branches of the same LLC, a recharge to them is an
  OTA position and not a stream. The mock states that this depends on the branch network being
  confirmed.
- No B2C. Every outbound document is B2B or Export. Each document is validated by the ASP and
  its outcome arrives asynchronously on three legs. No screen may say the OTA clears or rejects
  an invoice: the ASP validates and may reject, and the ASP reports to the OTA.
- ERP unknown, so the origin surface stays generic ("Enterprise ERP"). No product is named.
- Counterparties are fictional. No real Omani operator is named as a client.

## 2. The story this mock tells
A consultancy bills two ways (certified milestones, approved manhours), corrects with notes,
exports engineering to clients elsewhere in the Gulf, and buys from subcontractors at home and
software or studies from abroad. One pipe carries all six. Four tax questions get Fawtara's
recommended reading, each tagged "to confirm with OTA".

## 3. Entity roster
Single entity, so a profile and not a roster. Muscat Engineering Consultancy LLC, Muscat:
engineering and project-management consultancy, founded 2002 (directory sources, not confirmed
by MEC). VATIN, CR, Peppol participant, ERP, clients, volumes and every figure are illustrative.

## 4. What we build
Base choice: `igc-mock`, not the skill's default `vodafone-mock`. Both are single-entity with
`origin/` + `hub/` and no `portal/`. Vodafone's spine is B2C batch (prepaid top-ups, usage,
daily batches), none of which MEC has. IGC is B2B only, with live per-document submission, credit
and debit notes, an export stream and an inbound side, which is MEC's shape. `igc-mock`
therefore needs the least rework. The cost is that it is a gas-sales mock, so its commodity
vocabulary (nominations, take-or-pay, MMBtu) must be removed. `CLONE_DRIFT` guards that.

- `assets/js/data.js`: six STREAMS, four OTA_POSITIONS, CONTRACT (C-2025-118, milestones, VO-03,
  advance and retention), TIMESHEETS, INVOICES, INBOUND, MAPPING.
- `assets/js/shell.js` and `index.html`: 13 steps in 5 acts.
- `origin/billing.html` (milestone invoices and contract milestones), `origin/timesheets.html`
  (replaces nominations), `origin/sync.html`.
- `hub/adjustments.html`, `hub/export.html` (export of services; branch recharges as a
  conditional position), `hub/retention.html` (replaces take-or-pay; labelled "Retention money"
  so it is not read as data retention), `hub/inbound.html`; remaining hub screens rebranded.
- Docs: README, PRESENTER-SCRIPT, GAP-REGISTER, MEC-QUESTIONS, MEC-REAL-FACTS. Root `Dockerfile`
  already has one `COPY mec-mock/` line; do not add a second.
- `tools/verify.py` retargeted: IGC terms in `CLONE_DRIFT`; added bans on any wording that
  makes the OTA clear invoices, and on data-residency claims.

Streams (unchanged from the earlier hand-built version): 1 lump-sum milestones, 2 reimbursable
manhours, 3 credit and debit notes, 4 export of services, 5 subcontractors in, 6 imported
services under the reverse charge. The first four are seller side, the last two buyer side.
Reasons to keep them: each maps to a distinct invoice shape or tax treatment, and each is
plausible from the service list. They are inferred, not observed (see §7).

Corrections made to the earlier version, so the scaffolder applies them:
1. Wording. Replace "cleared live", "cleared to the OTA", "Clearing normally" and the
   "OTA — cleared" target with ASP-validated, asynchronous wording. Stream mode label becomes
   "Per document · async outcome".
2. Remove the data-residency claim ("stay in-country", "data residency in Oman"). Replace with
   "where invoice data and the archive are held is agreed during solution design".
3. Tracked-invoice settlement now reconciles across screens (see §5).
4. Branch recharges: keep as a position, flagged as conditional on the unverified branch network.
5. The final pipeline stage note no longer reads as archiving after transmission.

## 5. Data-model notes
- Identity: one VATIN (BT-31), one CR (IBT-029, scheme `CR`), one Peppol participant
  `0248:OM<VATIN>`. The exact Oman scheme is to be confirmed on the OTA onboarding portal.
- Tracked invoice `MEC-INV-2026-00382`: Milestone 4 (15% of OMR 1,240,000 = 186,000.000) plus
  variation VO-03 (12,400.000) = 198,400.000 net, 9,920.000 VAT at 5%, 208,320.000 total.
  Unchanged from the earlier version.
- Settlement, changed. The earlier version showed an amount due of 208,320 on the e-invoice but
  178,870 on the retention screen. Fixed as follows. Advance 10% of Milestone 4 = 18,600.000
  net, 19,530.000 with VAT, already invoiced and VAT-paid: BT-113 prepaid amount = 19,530.000.
  BT-115 payable on the e-invoice = 208,320.000 − 19,530.000 = 188,790.000. Retention rises from
  5% to 10% of the invoice net = 19,840.000, held as a payment term and not a reduction of the
  taxable amount, so cash due now = 168,950.000. The 5% figure was dropped because retention
  (9,920.000) equalled the VAT figure and read as one number appearing twice.
- Units: lump-sum lines `C62`, manhour lines `HUR`. BTOM-019 = services. Contract reference in
  BT-12.
- Dates and clock: demo clock Thursday 20 August 2026 (Oman week Sun to Thu).
- All data is illustrative. Only the legal name, Muscat base, 2002 founding and the service
  list come from public directories (carried forward, not re-verified), recorded in
  `MEC-REAL-FACTS.md`.

## 6. Discovery questions
→ mirrored into `mec-mock/MEC-QUESTIONS.md`. Added since the earlier version: whether the
foreign branches are registered separately; whether the contract retention rate and advance
terms are standard across contracts.

## 7. Open item for approval
Everything above is a checkpoint, and the build runs straight through. For a human:
- **Base template deviates from the skill default.** Single entity would normally clone
  `vodafone-mock`; this clones `igc-mock` for the reasons in §4. Not a low-confidence fallback.
- **Research was not re-verified.** The sandbox blocked every directory and search host. All
  facts are carried forward from the earlier brief. Re-check before presenting to MEC.
- **Billing models are inferred** from the service list. If MEC does not bill by manhour, or
  has no clients outside Oman, streams 2 and 4 should go.
- **Branch network** is a single unverified source. Branch recharges are therefore conditional.
- **Contract terms** (advance 10%, retention 10%) are illustrative placeholders, not MEC's.
- ERP is unknown, so Method 1 (Direct API) is an assumption only.
