# Peniel — questions to close before a real build

Ordered by what blocks what. Q1–Q4 block scope; the rest refine it.

## Blocking

**Q1. Which legal entity invoices Omani customers?**
Is there a registered Omani entity (with its own CR and VATIN), or does the Dubai entity invoice
Oman from outside? This decides whether Peniel has Omani e-invoicing obligations at all, and it is
the single question the whole mock rests on.
*Mock assumes: an Omani filer, `OM1100462837` / CR `1248905`. Both invented.*

**Q2. Is Peniel's relationship with the OTA as a taxpayer, a service provider, or both?**
Peniel sells VAT and e-invoicing services. Is it registered with the OTA as an ASP itself, as a
Peppol access point, as a reseller of someone else's, or purely as a taxpayer buying a service?
This changes who the counterparty in the conversation is.
*Mock assumes: Peniel is a taxpayer using Fawtara as its ASP. Nothing more.*

**Q3. What does Peniel run its own books on?**
The mock labels the origin surface "Peniel finance system" and names no product. If it is Tally,
ERPNext, Odoo, Elate or Sage, the collection method changes (API, on-site agent, or file transfer),
and so does the mapping work.
*Mock assumes: an API-capable system, Method 1.*

**Q4. Oman-to-Dubai, Dubai-to-Oman, or both?**
If the group bills across the border, the intra-company recharge treatment matters and it is
currently unfiled. If all Omani invoicing is done by the Omani entity to third parties, the
recharge question disappears.
*Mock assumes: kept out of the pipe, treatment to confirm.*

## Scope and volume

**Q5. How many invoices a month, and in what shape?**
The mock shows 425 for October, 214 of them renewals. Real volumes set the commercial shape and
whether batch matters as much as it is shown.

**Q6. How are renewals actually raised?**
On each customer's anniversary, or coalesced into one monthly run? The mock models a monthly run
because it is the harder shape and it shows better.

**Q7. Does Peniel hold stock for hardware, or drop-ship?**
The hardware stream is modelled as a simple goods invoice. Any stock movement, delivery note or
e-way document is out of scope and not shown.

**Q8. Does Peniel take retention on implementation projects?**
The demo carries 10% retention as a payment term. If it does not, that block can go.

## Tax treatments

**Q9. Reverse charge and self-billing.**
For licences and hosting bought from principals in Singapore and the UAE, Peniel self-accounts 5%.
Does the OTA require a self-billed e-document for that, or is the archived PDF plus the working
enough? This is open with the OTA, and the mock flags it.

**Q10. Which FX rate, and written down where?**
Invoice date, posting date, or a monthly policy rate? The mock recommends a written policy so the
input-VAT figure is repeatable. Peniel decides; the OTA confirms the record.

**Q11. Export evidence.**
For services delivered to a customer outside Oman at 0%, what evidence does the OTA expect?
The mock archives residence, place of use and a customer declaration, and flags it.

**Q12. Credit and debit notes vs. re-issued invoices.**
Does Peniel issue notes, or cancel and re-issue? Does the OTA accept debit notes under PINT-OM?

## Practical

**Q13. Training pricing.** Per attendee or per day? The mock bills per day at a course rate.

**Q14. Real distributor and principal names.** Fictional in the mock. Needed for a live mapping.

**Q15. Who owns master data clean-up?**
The mock's renewal run holds 5 of 214 documents for a missing street address, a missing VATIN or an
open price query. If that is realistic — and it usually is — someone has to own fixing it, or the
hold queue never empties.

**Q16. Test environment and integration user.** Needed before any real build.
