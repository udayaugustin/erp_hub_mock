# Vodafone Oman — discovery questions for the session

Mapped to the meeting agenda. The mock takes a position on each open item; these are the
questions that confirm or correct it.

## Systems & integration
1. What is the **billing system** for consumer (postpaid + prepaid) and the **ERP** for
   procurement / AP? (Modelled generically as "Your billing system" / "Your ERP".)
2. Is a **once-a-day batch** the right cadence for B2C, or does any channel need a cleared
   invoice at the point of sale? (Batch integration — agenda item.)
3. Which connection method per system — direct API, on-site agent, or secure file transfer
   for the batch?

## B2B — Vodafone as buyer
4. Suppliers **inside Oman**: confirm inbound Peppol e-invoices should land as **draft**
   purchase invoices in the ERP for finance to post.
5. Suppliers **outside Oman**: confirm **reverse charge** treatment and that Fawtara only
   needs to **capture and archive** the record (nothing cleared). Any exceptions?

## B2B — Vodafone as seller
6. Postpaid business invoices — confirm standard tax invoice, cleared live to the OTA.

## B2C — Vodafone as seller (the open questions)
7. **Prepaid top-ups / recharges** — does the OTA accept the **single-purpose voucher**
   reading (tax point at top-up, no invoice on later consumption)?
8. **Buy plan using balance / card / voucher** — confirm: balance = no new tax point,
   card/cash = new top-up, voucher = taxed at voucher purchase.
9. **Out-of-bundle usage** — confirm it is **aggregated into the monthly postpaid invoice**
   (not a separate e-invoice per usage event).
10. Postpaid consumer bills — simplified tax invoice, reported in the daily batch — correct?

## Compliance & platform
11. The exact **Oman endpoint EAS/ICD scheme** for the Peppol participant (modelled as
    `0248:OM<VATIN>`) — confirm on the OTA onboarding portal.
12. **Data residency** requirements — the mock assumes invoice data and archive stay
    in-country.
13. **Retention period** for the archive — deferred, "agreed during solution design".
14. Commercial model — out of scope for the mock; to be discussed separately.
