# NDC e-invoicing — questions to confirm before build

The prototype makes a set of **assumptions** so it can tell one clean story. Each is
marked in the demo with an "Assumption · to confirm" note. This is the list to walk
through with NDC. The answers decide effort and architecture — nothing here changes the
compliance engine itself, only where invoices come from and when they are reported.

## 1. The FieldAssist → Dynamics sync (the load-bearing one)
- **How do van sales reach Dynamics today?** FieldAssist cloud → Dynamics via a connector,
  a scheduled batch, or a manual export?
- **How often** does that sync run — real time, every N minutes, or end-of-day?
- **What does a van sale become in Dynamics** — a posted customer invoice, a sales order,
  or a journal? (We read *posted invoices*; if van sales land as something else, we adjust
  the collection point.)
- **Our assumption:** FieldAssist posts van sales into Dynamics on a schedule, and the
  compliance engine reads Dynamics only. Nothing is installed on the vans.

## 2. What the van hands the customer at the point of sale
- Does the retailer receive a **tax invoice** on the van right now, or a delivery note /
  provisional receipt that is finalised later?
- Does Oman's rule require a **compliant simplified e-invoice with QR at the moment of
  sale**, or is **reporting shortly after** acceptable for B2C/simplified?
- **Why it matters:** if a compliant QR document is required *on the van*, the van app must
  generate it offline (a light compliance library, no live OTA call). If reporting-after is
  allowed, the batch-from-Dynamics model needs nothing on the van at all.
- **Our assumption:** simplified van invoices are **reported to the OTA in batch from
  Dynamics**, not cleared live at the point of sale.

## 3. Clearance vs. reporting timing (confirm against OTA rules)
- For **Standard / B2B** invoices — is Oman using **clearance** (validate before/at
  issuance) or post-issuance reporting?
- For **Simplified / B2C** — what is the reporting window (e.g. within 24 hours)?
- This is the single thing that decides whether the easy single-chokepoint model is
  compliant. We believe it is; NDC/OTA confirm.

## 4. Which Dynamics
- **Dynamics 365 Finance & Operations (F&O)** or **Business Central**?
- The prototype assumes **F&O 10.0.x**. It only affects field names and the connection
  method on the ERP surface, not the flow.

## 5. Scope of invoices in scope for NDC
- Does NDC invoice retailers **directly** through van sales (so those invoices are NDC's to
  report), or sell through **independent distributors** whose onward sales are not NDC's?
- Are **exports** (MENA) in scope for OTA reporting, or handled separately? (We model them
  as zero-rated Standard invoices.)
- **LABSA / I&I** — any special document handling for bulk chemical or industrial customers?

## 6. Volumes (to size the connection, not the compliance logic)
- Roughly how many **van invoices per day**, and how many **Dynamics invoices per day**?
- Peak days / month-end behaviour?
- The demo shows illustrative FMCG-scale figures; real numbers size the batch windows and
  retry strategy.

## 7. Inbound / supplier documents
- Does NDC want **inbound** supplier e-invoices routed and drafted into Dynamics from day
  one, or is that a later phase?

## 8. Write-back
- Can the connector **write the e-invoice status, UUID and QR back onto the Dynamics
  invoice** (for the customer copy / print format)? The prototype shows write-back permission
  as "not yet granted" — confirm it can be enabled.
