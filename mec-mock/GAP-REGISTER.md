# Gap register — what the MEC mock assumes

| # | Gap | Assumed in the mock | Confirm with |
|---|-----|---------------------|--------------|
| 1 | MEC's ERP and how it exposes invoices | Generic "Enterprise ERP", Method 1 Direct API | MEC IT |
| 2 | Billing models in use | Lump-sum milestones + reimbursable manhours | MEC finance |
| 3 | Timesheet cut-off and client approval timing | Client approves before the invoice is posted | MEC project controls |
| 4 | Retention tax point | VAT on full certified value at invoicing | OTA |
| 5 | Advance payments | Taxed on receipt, recovered as an amount already paid (BT-113) | OTA |
| 6 | Export of services evidence | Client non-residence + facility location in contract | OTA |
| 7 | Recharges to own branches abroad | Not a supply — never enters the pipe | OTA |
| 8 | Imported services | Reverse charge self-accounted; no e-document until OTA confirms | OTA |
| 9 | Disputed hours / escalation | Credit and debit notes referencing the original | MEC finance, OTA |
| 10 | Variation orders | Billed as a line on the next milestone invoice, not a debit note | MEC finance |
| 11 | Branch network | Taken from one directory source, unverified | MEC |
