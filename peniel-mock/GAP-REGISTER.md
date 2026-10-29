# Gap register — Peniel mock

What this prototype does **not** do, and what a real build would have to. Each row is a known gap,
not an oversight.

| # | Gap | Why it is out of scope here | What a real build needs |
|---|-----|------------------------------|--------------------------|
| 1 | **No live ERP connection** | The mock is static HTML/JS reading a hard-coded `data.js` | An interface to Peniel's actual finance system — API, agent or file transfer, decided by Q3 |
| 2 | **No real OTA or ASP calls** | Every acknowledgement number is invented | ASP onboarding, participant registration (SMP), certificate exchange, a live Peppol test |
| 3 | **No e-way bill / delivery notes** | Hardware is sold as a goods line only | A goods-movement document type if the OTA requires one; carrier integration |
| 4 | **Self-billing for reverse-charge purchases is unresolved** | Open with the OTA | An inbound self-billed document type, or a documented decision that none is required |
| 5 | **No payment or reconciliation loop** | Receipts, allocations and reminders are not modelled | Bank statement import, receipt matching, dunning — outside the e-invoicing pipe |
| 6 | **No customer self-service** | Peniel's customers see an invoice, not a portal | Whether Peniel wants a customer-facing view of e-invoice status |
| 7 | **Single currency outbound** | Omani invoices to Omani customers are OMR; foreign-currency *outbound* is not modelled | Only relevant if Peniel invoices customers outside Oman in their currency |
| 8 | **No multi-entity consolidation** | One VATIN, one CR, one participant | If the Dubai and Omani entities both file, two tenants and a consolidation report |
| 9 | **No credit-limit or approval workflow** | Invoices post unconditionally in the mock | Whatever approval chain Peniel actually uses |
| 10 | **Master-data quality is asserted, not measured** | 5 of 214 renewals held is an illustrative ratio | A real extract of Peniel's customer master to size the hold queue |
| 11 | **No archive migration** | The mock's history starts empty at go-live | Whether historic invoices need to be brought into the archive, and in what form |
| 12 | **No Arabic RTL UI** | The console is English-only | If Peniel's users or customers need Arabic; PINT-OM itself permits Arabic content fields |
| 13 | **No accessibility audit** | Basic semantic HTML only | A formal WCAG pass before any customer-facing surface |
| 14 | **Volumes are illustrative** | 425 documents MTD is invented | Real monthly volumes drive pricing and the batch strategy |
| 15 | **No retention or SLA statement** | Deliberately absent — the mock must not promise either | Fawtara's actual archival commitment and service levels, agreed commercially |
