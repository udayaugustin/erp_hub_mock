# Gap register — what this mock deliberately assumes

Everything here is an **assumption to confirm** with Ras Al Hamra Group and/or the OTA.
The mock takes a position so the session has something concrete to react to; none of it
is a claim of fact.

| # | Area | Assumption in the mock | Confirm with |
|---|------|------------------------|--------------|
| 1 | Entity roster | Five members (Ras Al Hamra LLC, Middle East Consulting Engineering LLC, Operation Excellence LLC, Add Energy & Partner LLC, Innovative Oil and Gas LLC) are REAL, publicly known Group companies. The other seven (RAH Equipment Trading, RAH Environmental Services, RAH Manpower Services, RAH Projects & Products, RAH Digital Transformation, RAH Carbon Solutions, RAH Water Services) are ILLUSTRATIVE — plausible given the Group's stated divisions, but not confirmed legal entities | Ras Al Hamra Group |
| 2 | VAT Group structure | Modelled as one shared VAT Group TRN across twelve entities, matching the Zubair-style pattern | Ras Al Hamra Group |
| 3 | Systems | The five real entities are shown running **Sage 300** — confirmed by the client, not a guess. Version numbers, connection details and Sage 300 Web API endpoints are illustrative. The seven illustrative entities use generic ERP labels (Field Operations System, Accounting System) since their systems aren't confirmed | Ras Al Hamra Group (confirmed) |
| 4 | Batch | High-volume field-services billing (RAH Manpower Services) reported once per day in an overnight-style batch window | Ras Al Hamra Group / OTA |
| 5 | Endpoint scheme | Peppol participant modelled as `0248:<CR>` | OTA onboarding portal |
| 6 | Identity | Shared VAT Group TRN `OM1200156702`, individual CR numbers — both illustrative | Ras Al Hamra Group |
| 7 | Volumes | All daily/monthly figures illustrative (sized to a ~$200M/1,500-employee group, but invented) | — |
| 8 | Counterparties | Muscat Bay Hospitality, Falaj Industrial Supplies etc. are invented | — |
| 9 | Data residency | Invoice data + archive held in-country | Ras Al Hamra Group / Fawtara |
| 10 | Retention | Deferred — "agreed during solution design", no period stated | Solution design |
| 11 | Commercial model | Out of scope; qualitative only | Separate track |

## Source for the real facts above
Public information — Ras Al Hamra Group's own website (rasalhamra.com) and public
company listings. Established 1996, Muscat, 100%-Omani owned, ~1,500 employees, ~$200M
annual revenue, four stated divisions (Oil & Gas Services, Environmental Services,
Projects & Products, Digital Transformation). One fact came directly from the client
rather than public research: **the real entities run Sage 300** — that ERP identity is
not a guess. No confidential or internal information was used or assumed beyond that.

## Lint vocabulary (kept out of the mock on purpose)
`tools/verify.py` bans, among others: "Zubair" and its entities/prefixes, the hub-mock
generic placeholders (ABC/XYZ/BCD/…), any named ERP/BSS product (SAP, S/4HANA, Autoline,
Fiori, Orion, FOCUS X, …), retention periods ("N years"), "WORM", pinned spec versions
("PINT-OM 1.1"), and committed SLAs ("within N hours"). This keeps the mock generic and
non-committal where it must be.
