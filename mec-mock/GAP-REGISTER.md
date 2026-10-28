# Gap register — what the MEC mock assumes

| # | Gap | Assumed in the mock | Confirm with |
|---|-----|---------------------|--------------|
| 1 | MEC's ERP and how it exposes invoices | Generic "Enterprise ERP", Method 1 Direct API | MEC IT |
| 2 | Billing models in use | Lump-sum milestones + reimbursable manhours | MEC finance |
| 3 | Timesheet cut-off and client approval timing | Client approves before the invoice is posted | MEC project controls |
| 4 | Retention money tax point; contract rate (10%) | VAT on full certified value at invoicing; retention is a payment term, not on the e-invoice. Rate is a placeholder | OTA, MEC finance |
| 5 | Advance payments; contract rate (10%) | Taxed on receipt, recovered as a prepaid amount (BT-113); payable (BT-115) = total less advance. Rate is a placeholder | OTA, MEC finance |
| 6 | Export of services evidence | Client non-residence + facility location in contract | OTA |
| 7 | Recharges to own branches abroad | Only if the branches exist as part of the same LLC; then not a supply and never in the pipe | OTA, MEC |
| 8 | Imported services | Reverse charge self-accounted; no e-document until OTA confirms | OTA |
| 9 | Disputed hours / escalation | Credit and debit notes referencing the original | MEC finance, OTA |
| 10 | Variation orders | Billed as a line on the next milestone invoice, not a debit note | MEC finance |
| 11 | Branch network | Taken from one directory source, unverified | MEC |
| 12 | Whether the research facts are true | Carried forward from public directories; could not be re-verified (sandbox egress blocked every directory and search host) | MEC, then re-check |
| 13 | Where invoice data and the archive are held | Not stated in the mock; agreed during solution design | MEC, Fawtara |
| 14 | Stream existence: export of services, manhour billing | Inferred from the service list, not observed | MEC finance |
