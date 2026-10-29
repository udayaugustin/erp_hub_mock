# Presenter script — Peniel Technology × Fawtara

Roughly 12 minutes. Read the bold line; the rest is what you add if the room is quiet.
Press **→** for the next screen, **←** to go back, **[** to fold the menu away.

---

## Before you start (30 seconds, off-screen)

Three things to say out loud before the first screen:

1. "Peniel is real. **Every customer, figure, VATIN and tax treatment in this demo is invented** —
   nothing on these screens tells us how Peniel actually invoices."
2. "Where the OTA hasn't settled a treatment, I'll show you Fawtara's recommended reading, and it
   will say *to confirm with OTA* on the screen. I'm not presenting those as rules."
3. "The spine is six streams, not six companies. Peniel is one invoicing entity."

---

## Act I — Where the data comes from (steps 1–4)

**1 · hub/login.html — Signing in to the console**
> "This is the console Peniel's e-invoicing team would actually use. Nothing here replaces the
> finance system — it sits beside it."

**2 · origin/billing.html — A licence and implementation invoice**
> "This is where the invoice is born. An ERPNext rollout for a trading company: fourteen
> consultant days and twelve user licences on one invoice — **2,886 net, 144.300 VAT, 3,030.300
> total**."

Point at the advance already paid (2,205.000) and the payable (825.300):
> "The advance was invoiced and taxed when it was received. It's recovered here as an amount
> already paid — **VAT is not charged twice**."

**3 · origin/subscriptions.html — The monthly renewal run**
> "Now the stream that actually hurts. 214 support contracts renewed this month. The run raised
> and sent 209. **It held five back** — and the five are the interesting part."

Read one hold aloud: *"Billing address incomplete — no street line."*
> "That's not an e-invoicing failure. That's a customer record that isn't good enough to invoice.
> A manual process finds this out when the customer calls."

**4 · hub/mapping.html — Mapping the fields**
Click a field box, change a transform.
> "Peniel's field names on the left, PINT-OM fields on the right. An analyst does this, not a
> developer — and the preview rebuilds as you change it."

---

## Act II — One pipe, six streams (steps 5–8)

**5 · hub/dashboard.html — Six streams on one screen**
> "Licences, implementation, renewals, training, hardware, and vendor purchases coming in. One
> integration, one console. Today: 228 documents out, 1 failed, 3 in flight."

Point at the stream board:
> "Five streams are settled. One — vendor purchases — carries a position to confirm."

**6 · hub/queue.html — Validated, sent and reported**
> "Nine stages. **Record** is step five — the XML and audit trail are written before anything is
> transmitted, so there's evidence of what was sent even if transmission fails. **Archive** is step
> nine, because it holds the acknowledgements, and those don't exist until the round trip is done."

**7 · hub/document.html — The validated e-invoice**
> "This is the actual UBL XML. Two lines. Proven correct against PINT-OM before it went anywhere —
> 148 assertions passed, 2 warnings."

Point at the warnings:
> "Both warnings are honest: no payment-means code, so it defaulted to credit transfer; and the
> buyer's street address came from our fallback, because the finance system doesn't expose it.
> **That's the same missing field that held back two renewals.**"

**8 · hub/asp.html — Three acknowledgements back**
> "Three separate legs, three separate timelines. The ASP accepted in the first second. The OTA
> report came back after 1 minute 38. The customer's access point confirmed after 2 minutes 21.
> **Only the first is in the ASP's control** — the third can take hours."

---

## Act III — The other direction (steps 9–11)

**9 · hub/inbound.html — Vendor documents in**
> "Peniel buys licences to resell. Omani distributors send over Peppol and land as drafts coded to
> the customer project. Principals abroad send a PDF. **Nothing is posted automatically** — a person
> reviews every one."

**10 · hub/currency.html — Foreign-currency purchases**
> "A principal invoices 14,000 USD. The Omani record is in OMR to three decimals. So which rate?"
> "Fawtara's reading: write the policy down, and keep the source amount, the rate and the OMR
> equivalent on the record. Because if you use whatever rate the day happened to use, **the
> month's recoverable input VAT moves, and nobody can say which figure was right.**"

**11 · hub/adjustments.html — Credit and debit notes**
> "A customer cancels five seats mid-term: a credit note that references the original. Extra
> consultant days: a debit note. **The original invoice is never edited** — the correction is its
> own document, sent like any other."

---

## Act IV — The open questions (step 12)

**12 · hub/export.html — Export of services and intra-company recharges**
> "Two treatments the OTA hasn't settled. First: services delivered to a customer outside Oman —
> we read zero-rated with a reason code, evidence archived. Second: recharges between the Dubai
> head office and the Omani business — if they're the same legal person, that's a book entry and it
> never enters the pipe."

Be explicit:
> "**These are Fawtara's positions, not rules.** We'll take them to the OTA. If the Authority reads
> them differently, the treatment and the mapping both change — and I'd rather find that out before
> we build."

---

## Act V — The record, and the close (steps 13–17)

**13 · hub/history.html — Processing history**
> "Every document, its outcome, its acknowledgement. This is the screen that answers a customer
> query or an audit question without re-keying anything."

**14 · hub/reports.html — Reports**
> "VAT by stream, renewal reconciliation, exception ageing, and the position register — the list of
> everything still to confirm."

**15 · hub/boundary.html — Who does what**
> "This is the honest slide. Peniel assembles one complete invoice payload — the data, the master
> records, the sign-offs. Fawtara does mapping, validation, transmission, tracking and the archive.
> **The line sits at the payload.**"

**16 · hub/value.html — Why Fawtara**
> "Accredited by the OTA, one pipe for every stream, and a built-for-volume batch path — but the
> thing I'd actually point at is the last one: **we bring positions, not questions.**"

**17 · origin/sync.html — The answer, back on the invoice**
> "And the loop closes where it started. Same invoice, same screen. UUID, status, acknowledgement,
> QR — written back onto the finance-system record, printed on the customer copy."

---

## Close

> "Three things I need from you before this becomes a real build:
> **which legal entity invoices Omani customers**, **what Peniel runs its own books on**, and
> **roughly how many invoices a month**.
> Everything else you've seen is a position we can defend — those three are facts only you have."
