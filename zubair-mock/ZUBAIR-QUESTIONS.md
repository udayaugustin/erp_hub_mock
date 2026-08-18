# Zubair Corporation e-invoicing — discovery / GAP questions

The prototype makes a set of **assumptions** so it can tell one clean story. Each is marked in the
demo with an "Assumption · to confirm with Zubair" note. This is the list to walk through with the
group. The answers decide effort and architecture — nothing here changes the compliance engine
itself, only how the twelve entities connect and when their invoices are reported.

---

## Q1. Entity identity within one shared VAT Group TRN — **RESOLVED**

**The question was:** within one VAT Group TRN (`OM1200094685` shared by all twelve entities), how
is each entity identified to the OTA and on Peppol? If the VAT number is shared, what keeps the
twelve apart?

**The answer (from the PINT-OM Oman spec, test-docs.peppol.eu):** each entity is identified **per
legal entity, not merged into one group identity**, on two levels:

1. **Peppol / onboarding level.** Each legal entity is its **own Peppol participant** — its own
   participant/endpoint registration, its own SMP entry, its own ASP onboarding and certificate.
   Peppol's identifier policy ties participant identity to the member's own registration; a VAT
   group *"may centralise governance but cannot collapse several legal entities into one shared
   technical identity."* (The same 5-corner model as the confirmed UAE VAT-group precedent.)

2. **Invoice level (PINT-OM).** The seller is carried by **both** identifiers:
   - **Seller identifier — IBT-029, scheme `CR`** (Commercial Registration, from code list
     **CL-06-OM**) = the entity's **own CR**. **This distinguishes the twelve members.**
   - **Seller VAT identifier — IBT-031** = the **shared VAT Group TRN** `OM1200094685` (same for
     all twelve). It is a *data field*, not the routing identity.

So: **twelve legal entities = twelve Peppol participants** (twelve CRs, twelve endpoints, twelve
certificates) across four ERPs, but **one VAT-group return**. Registering, onboarding, routing and
monitoring those twelve participants under one compliance view is exactly what the central hub is
for — this *strengthens* the hub pitch rather than weakening it.

**Only remaining to confirm:** the **exact Oman endpoint EAS/ICD scheme** for the Peppol address —
whether the endpoint is addressed on the VAT identifier or the CR. A minor detail, confirmed
against the OTA onboarding portal, not a blocker.

---

## The open questions

## Q2. B2C simplified-invoice batch cadence, per ERP (the load-bearing one)

- General Automotive alone raises ~66k simplified B2C invoices a month. **How and how often** does
  each ERP hand those to the hub — a scheduled batch export from **Autoline**, from **SAP
  S/4HANA**, from **Orion 11J**, from **FOCUS X**, or something live?
- What is the OTA **reporting window** for simplified / B2C (e.g. within 24 hours), and does that
  differ from Standard / B2B clearance-vs-reporting timing?
- **Our assumption:** simplified invoices are **reported to the OTA in batches from the source ERP**
  (Autoline for the dealerships), **not cleared live at the point of sale**. To confirm against the
  OTA simplified-invoice rules. This is the single load-bearing open question for the demo.

## Q3. ERP connector specifics

For each of the four ERPs, what is the integration surface the hub connects to?

- **SAP S/4HANA** — BAPI / IDoc plus SAP CPI (Cloud Platform Integration) middleware? Which
  release and which outbound event triggers the pull?
- **Autoline 8.39** — what API surface does Autoline expose (dealer-server API, a middleware
  export, a file drop)? This drives the six automotive entities.
- **Orion 11J** — the Orion REST API?
- **FOCUS X** — the FOCUS X REST API?

## Q4. Phase-2 pilot reference integration

- Which **entity / ERP pair** is the reference integration for the Phase-2 pilot? The lead entity
  (The Zubair Corporation LLC on S/4HANA), or the volume giant (General Automotive on Autoline)?
- The pilot ERP and entity set the pattern the other eleven follow.

## Q5. Inbound (AP) handling, per ERP

- Do the entities want inbound **supplier e-invoices** landed as **drafts** in each ERP from day
  one, or is that a later phase?
- Drafts are **never auto-posted** in the model — a person reviews and approves. Confirm that fits
  each ERP's AP workflow (S/4HANA, Autoline, Orion, FOCUS).

## Q6. Credit / debit notes, exports and B2G volumes, per entity

- Rough **credit / debit note** volumes per entity, and any special document handling?
- **Exports** (e.g. Jebel Ali Equipment Trading FZE) — modelled as zero-rated Standard invoices;
  confirm they are in scope for OTA reporting.
- **B2G** (e.g. Directorate General of Roads) — any additional buyer-reference or PO requirements?

## Q7. Go-live sequencing across the twelve

- All twelve are modelled as **Phase 2, go-live 2027-04-01**. Is that one cutover for all twelve,
  or a **staged sequence** across the group?
- If staged, in what order — by ERP (S/4HANA first, then Autoline, Orion, FOCUS), by volume, or by
  entity readiness? And where does the thirteenth member (*Zubair Furnishing LLC*, currently
  liquidation / Excel-only) fit, if at all?

---

Nothing on this list changes the compliance engine. It changes only how the twelve entities
connect, when their invoices are reported, and in what order they go live.
