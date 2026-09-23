# Gap register — what this mock deliberately assumes

Everything here is an **assumption to confirm** with IGC and/or the OTA. The mock takes
a position so the session has something concrete to react to; none of it is a claim of fact.

| # | Area | Assumption in the mock | Confirm with |
|---|------|------------------------|--------------|
| 1 | Systems | IGC's ERP is unknown; shown as a generic "Enterprise ERP" | IGC |
| 2 | Legal name | "Integrated Gas Company SAOC" per igcoman.om (brief said SAOG) | IGC |
| 3 | Export | Zero-rated (0%) with a reason code; export evidence archived | OTA |
| 4 | Government allocation | Invoiced as ordinary B2B where there is consideration; pure allocation raises no invoice | OTA |
| 5 | Take-or-pay | Shortfall charge is consideration, standard-rated 5%, on its own line | OTA |
| 6 | True-ups | Price/volume corrections issued as credit and debit notes referencing the original | IGC / OTA |
| 7 | Metering close | Month-end metering close and volume sign-off before invoicing | IGC |
| 8 | Endpoint scheme | Peppol participant modelled as `0248:OM<VATIN>` | OTA onboarding portal |
| 9 | Identity | Single VATIN `OM1300054871`, CR `1450231` (both invented) | IGC |
| 10 | Volumes and prices | All MMBtu volumes and OMR prices are invented | — |
| 11 | Counterparties | Al Noor Power, Gulf Desal Water, producers, transporter etc. are fictional | — |
| 12 | Data residency | Invoice data and archive held in-country | IGC / Fawtara |
| 13 | Retention | Deferred — "agreed during solution design", no period stated | Solution design |
| 14 | Commercial model | Out of scope; qualitative only | Separate track |

## Lint vocabulary (kept out of the mock on purpose)
`tools/verify.py` bans: telecom and earlier-client vocabulary, named ERP products, real
Omani energy companies as counterparties, retention periods ("N years"), "WORM", pinned
spec versions ("PINT-OM 1.1") and committed SLAs ("within N hours").
