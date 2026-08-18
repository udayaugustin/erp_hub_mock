# Zubair hub mock — gap register against the proposal
Re-pointed 18 Aug 2026 for The Zubair Corporation VAT Group presentation. This build is a clone of
the proven multi-entity hub; the rules below are inherited from that build's audit and re-targeted
to the twelve-entity, single-VAT-group Zubair story. `tools/verify.py` enforces them as a lint
over the user-visible markup and fails on any hit.

---

## A. Things the proposal deliberately leaves open — never state them on screen

| # | Rule | Why |
|---|---|---|
| A1 | **No fixed retention period.** No "10 years", no "7 years". | Retention is reserved until solution design. Say "agreed during solution design". |
| A2 | **No WORM / deletes-blocked claim.** | As above. |
| A3 | **No named data centre / "Muscat DC".** | As above. |
| A4 | **No data-residency claim** ("Sultanate of Oman only"). | Residency is still to be agreed. |
| A5 | **No commercial figure, rate, effort estimate or SLA response time** ("response within 2 hours"). | All deferred. |
| A6 | **No fixed number of connectors, no ERP list described as "all connected".** | Connector scope is confirmed only after the ERP inventory. |
| A7 | **PINT-OM carries no pinned version** ("v1.0.2"). | Unverifiable specificity invites "which version is contracted?" |

## B. Vocabulary that must never appear (banned-string lint)

| # | Wrong | Right |
|---|---|---|
| B1 | "Tier 1 / 2 / 3", "T1/T2/T3" chips | **Method 1 — Direct API**, **Method 2 — On-site agent**, **Method 3 — Secure file transfer** |
| B2 | "File drop" | "Secure file transfer" |
| B3 | "Tenant" in anything a viewer reads | **Entity** or **company** |
| B4 | "Satellite deployment" | "Self-hosted utility (exception)" — if modelled at all |
| B5 | "Appendix D", "Base64 TLV" QR | **"QR information"** only (Appendix D / TLV is Saudi ZATCA) |
| B6 | "Rejected / cleared by the tax authority" | The **ASP** validates and may reject; **the OTA does not adjudicate invoices** |
| B7 | "Reported by the Hub to the OTA" | **The ASP** reports the Tax Data Document to the OTA, not the hub |
| B8 | Any clone-drift string: Towell / WJ Towell / WJT- / ERPNext / Odoo / Oracle E-Business / Enhance / Orbit / Readymix / Mazoon / "89 entities" / "Nazm" | Zubair entity names, four ERPs (SAP S/4HANA, Autoline 8.39, Orion 11J, FOCUS X), **twelve entities**, "the central hub" |

## C. The single-group identity model — get this right

| # | Rule | Why |
|---|---|---|
| C1 | **One VAT Group, twelve legal entities.** All share VATIN `OM1200094685`. | The shared TRN is one filing identity; do not present it as twelve VAT registrations. |
| C2 | **The CR distinguishes the twelve.** Seller identifier IBT-029, scheme `CR` (CL-06-OM) = the entity's own Commercial Registration. | This is the identity that keeps the twelve apart; the shared VATIN (IBT-031) is a data field. |
| C3 | **Twelve Peppol participants**, each `0248:<CR>` — twelve endpoints, twelve certificates. | Never collapse the members into one shared technical identity. See `ZUBAIR-QUESTIONS.md` Q1. |
| C4 | **Batch B2C.** General Automotive's ~66k/month simplified invoices are reported in **batches from Autoline**, not live at point of sale — carry the *"Assumption · to confirm with Zubair"* card. | Load-bearing demo assumption. See `ZUBAIR-QUESTIONS.md` Q2. |

## D. Flows the prototype must show (inherited from the proposal)

| # | Rule | Reference |
|---|---|---|
| D1 | **Mapping is configurable** — an analyst joins ERP fields to the standard by choosing from lists, and the live preview recomputes. | §3, §7 |
| D2 | **Inbound (AP) flow present** — supplier invoices routed, validated, archived, landed as **drafts**, never auto-posted. | §5 inbound |
| D3 | **Archive is stage 5, before transmission**, not after. | §5 step 5, §6 |
| D4 | **The delivery boundary is stated** — the hub makes values available at the interface; writing them into the ERP is ERP-side work, quoted separately. | §7 |
| D5 | **Outcomes are asynchronous on three separate legs.** Never one synchronous round trip. | §2 |
| D6 | **"Stopped reporting" is distinguished from "failing"** — a silent entity is a compliance risk, surfaced on the dashboard. | §3 |

## E. Numbers must reconcile

Totals reconcile with the rows above them; the same figure does not disagree with itself across
two screens. Entity counts reconcile to **twelve** everywhere. GROUP totals equal the sum of their
entities. VATIN `OM` + 10 digits; Peppol scheme `0248`; OMR at three decimals; 5% VAT arithmetic
correct on every amount; zero-rated exports correctly zeroed. No commercial figure anywhere. Every
screen carries a disclaimer.

## F. Third-party naming

All counterparties are **invented** (Muscat Bay Hospitality, Sohar Steel Rolling, Directorate
General of Roads, Jebel Ali Equipment Trading FZE, Al Batinah Logistics Services, Salalah Port
Services, Nizwa Auto Spares; suppliers Falaj Industrial Supplies, Ruwi Marine Contracting, Barka
Freight Forwarding, Muscat Tyre & Battery). Never use a real Omani or UAE company as a fictional
buyer with an invented VAT number. The only real names in the dataset are the twelve Zubair
VAT-group entities themselves — see `ZUBAIR-REAL-ENTITIES.md`.
