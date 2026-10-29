# Peniel Technology LLC — confirmed facts vs. assumptions

Every "confirmed" line below has a source. Anything without one is an assumption and is marked so.
Nothing in this file is inferred from the mock's data.

## Confirmed (sourced)

| Fact | Source |
|------|--------|
| Legal/trading name **Peniel Technology** (also written "Penieltech") | https://www.penieltech.com/ · https://techbehemoths.com/companies/oman |
| An accounting-software and IT-solutions company — resells and implements accounting/ERP software, supplies hardware/networking, and offers web and VAT services | https://www.penieltech.com/ · https://penielcomputer.com/om |
| Headquarters in **Bur Dubai, UAE** | https://www.penieltech.com/contact |
| An **Oman presence in Seeb, Muscat** | https://penielcomputer.com/om |
| Additional delivery offices in **Pune and Trivandrum, India** | https://www.penieltech.com/ |
| Products sold/implemented: **Tally (TallyPrime), QuickBooks, Elate, ERPNext, Odoo, Sage** | https://www.penieltech.com/ · https://e-invoicingsoftware.ae |
| Claims **17+ years** in business and **14,000+ customers** | https://www.penieltech.com/ (marketing claim — not independently verified) |
| States **ISO 9001:2015** certification | https://www.penieltech.com/ |
| Operates a VAT / e-invoicing offering page for the UAE | https://e-invoicingsoftware.ae |

## Not confirmed — assumed in the mock (to confirm with Peniel)

| Assumption | Why it is assumed | Consequence if wrong |
|------------|-------------------|----------------------|
| **An Omani legal entity exists and files VAT in Oman** — modelled as `Peniel Technology LLC`, VATIN `OM1100462837`, CR `1248905` | Needed to show an Omani e-invoicing flow at all | If only the Dubai entity exists, there is no Omani VATIN, no PINT-OM obligations, and the whole scope changes — the Dubai entity would be filing UAE e-invoicing instead |
| Which entity holds the Omani registration and invoices Omani customers | Not published | Changes the seller identity on every invoice |
| Peppol participant `0248:OM1100462837` | Derived from VATIN scheme 0248 | The actual EAS scheme and participant are confirmed on the OTA onboarding portal |
| Peniel's own finance system (what it runs its own books on) | Not published; the mock labels the origin surface **"Peniel finance system"** and names no vendor product | If it is one of the products it resells, the integration method may differ; the mock never asserts which |
| Whether renewals are raised on each customer's anniversary or coalesced into one monthly run | Both are common; the mock models a monthly run | Changes the transport method (batch vs per-document) and the reporting cadence |
| The number of invoices Peniel raises per month | Unknown; 425 MTD is invented | Volumes drive the commercial and technical shape |
| Whether training is priced per attendee or per day | Unknown; the mock bills per day at a course rate | Changes the line structure only |
| Whether Peniel buys licences through **Omani distributors** as well as direct from principals | Invented; needed to show the inbound Peppol route | If all purchases are direct from abroad, only the reverse-charge route exists |
| Names of the actual distributors and principals | Deliberately fictional | — |
| Whether extra scope is billed as a debit note or as a line on the next stage invoice | Unknown; policy choice | Affects the note stream only |
| Retention of 10% on implementation projects | Modelled on the demo contract; Peniel's terms unknown | Retention is a payment term, not a tax treatment — but if Peniel takes no retention, that block is unnecessary |
| Whether a self-billed e-document is required for reverse-charge purchases | Open with the OTA | Changes the inbound document set |
| Data residency / hosting of invoice data | Not published, and deliberately not claimed anywhere in the mock | — |

## Oman programme facts used correctly in the mock

Sourced from the Oman Tax Authority's published e-invoicing framework and Peppol's own
documentation — these are structural facts about the programme, not claims about Peniel:

- The **OTA** operates Oman's tax administration. Under the e-invoicing programme it **receives
  reported tax data documents**; it does not clear or approve individual invoices.
- **Accredited Service Providers (ASPs)** are licensed by the OTA to validate and transmit
  e-invoices, and to report to the OTA on the taxpayer's behalf.
- **Peppol PINT-OM** is the Oman-specific Peppol BIS billing specification (`urn:peppol:pint:billing-1@om-1`).
- Documents travel on three legs: ASP acceptance, OTA reporting, and buyer access-point delivery.
- Oman's VAT rate is **5%**; the currency is **OMR** to three decimals.

## Deliberately NOT stated anywhere in the mock

- Any retention period for archived invoice data.
- Any SLA, response-time guarantee or processing-time commitment.
- Any price, licence fee or commercial model figure.
- Any claim about where invoice data is hosted or stored.
- Any specific PINT-OM version number or Schematron release (the mock names the profile, not a version).
