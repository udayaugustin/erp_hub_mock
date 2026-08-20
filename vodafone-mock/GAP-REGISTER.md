# Gap register — what this mock deliberately assumes

Everything here is an **assumption to confirm** with Vodafone and/or the OTA. The mock
takes a position so the session has something concrete to react to; none of it is a claim
of fact.

| # | Area | Assumption in the mock | Confirm with |
|---|------|------------------------|--------------|
| 1 | Systems | Vodafone's billing/ERP stack is shown generically; not named | Vodafone |
| 2 | Batch | B2C reported once per day in an overnight window (02:00–02:40) | Vodafone / OTA |
| 3 | Prepaid top-ups | Single-purpose voucher — tax point at top-up | OTA |
| 4 | Buy plan | Balance = no new tax point; card/cash = new top-up; voucher taxed at purchase | OTA |
| 5 | Out-of-bundle | Taxable at consumption, aggregated into the monthly postpaid invoice | OTA |
| 6 | Supplier outside Oman | Reverse charge; nothing cleared; record captured & archived | OTA |
| 7 | Endpoint scheme | Peppol participant modelled as `0248:OM<VATIN>` | OTA onboarding portal |
| 8 | Identity | Single VATIN `OM1200087234`, CR `1279001` (both illustrative) | Vodafone |
| 9 | Volumes | All daily/monthly figures illustrative (telco-scale but invented) | — |
| 10 | Counterparties | Gulf Petrochem, Al Mouj, suppliers etc. are invented | — |
| 11 | Data residency | Invoice data + archive held in-country | Vodafone / Fawtara |
| 12 | Retention | Deferred — "agreed during solution design", no period stated | Solution design |
| 13 | Commercial model | Out of scope; qualitative only | Separate track |

## Lint vocabulary (kept out of the mock on purpose)
`tools/verify.py` bans, among others: the word "Zubair" and its entities/prefixes, any
named ERP/BSS product (SAP, Autoline, Oracle, Dynamics, …), "Towell", retention periods
("N years"), "WORM", pinned spec versions ("PINT-OM 1.1"), and committed SLAs
("within N hours"). This keeps the mock generic and non-committal where it must be.
