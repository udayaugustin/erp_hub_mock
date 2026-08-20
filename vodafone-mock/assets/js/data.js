/* ==========================================================================
   Vodafone Oman × Fawtara — E-Invoicing Scope Walkthrough · demonstration dataset

   Vodafone Oman is the REAL prospect. Everything attached to it here is
   INVENTED: volumes, VAT/CR numbers, invoice numbers, counterparties, timings
   and the exact tax treatments. None of it is a statement about how Vodafone
   actually bills. Counterparties are fictional on purpose.

   THIS MOCK IS A DISCOVERY / ALIGNMENT TOOL for the Thursday session, not a
   finished compliant flow. Its spine is not a roster of companies (Vodafone is
   ONE legal entity) but the SIX ways Vodafone raises or receives invoices — the
   meeting agenda, screen by screen. Two of the six carry tax questions the OTA
   has not settled; for those, the mock shows Fawtara's RECOMMENDED reading,
   always flagged "to confirm with OTA".

   Systems are shown with GENERIC labels — "Your billing system", "Your ERP" —
   because Vodafone's actual BSS/ERP stack is not confirmed. No product is named.

   IDENTITY — single entity. Vodafone has one VATIN, one Commercial Registration
   and one Peppol participant. Oman's registered Electronic Address Scheme is
   0248 (VATIN), so the participant is 0248:OM<VATIN>. The CR travels on the
   invoice as the Seller identifier (IBT-029, scheme CR). No VAT-group nuance.

   Shapes are real: Omani VATIN OM + 10 digits, Peppol scheme 0248, OMR to
   3 decimals, 5% standard VAT.

   Demo clock: Thursday 20 August 2026, 10:42 GST. Thursday is a working day in
   Oman (the week runs Sunday to Thursday).
   ========================================================================== */

const DEMO_DATE  = '20 Aug 2026';
const DEMO_DAY   = 'Thursday';
const DEMO_CLOCK = '20 Aug 2026, 10:42 GST';
const VAT_RATE   = 5;

/* --- the entity ------------------------------------------------------------
   One seller and one buyer. Illustrative VATIN / CR / participant.           */
const VOD = {
  id: 'VOD', name: 'Vodafone Oman', legal: 'Oman Future Telecommunications SAOC',
  vatin: 'OM1200087234', cr: '1279001', peppol: '0248:OM1200087234',
  city: 'Muscat', country: 'OM'
};
/* single-entry roster keeps tenant()/any residual lookups resolving */
const TENANTS = [{ ...VOD, short: 'Vodafone Oman', sector: 'Telecommunications',
  erp: 'Billing & ERP', status: 'live', health: 'ok' }];

/* --- the six streams — THE spine of this mock ------------------------------
   group: buyer | seller-b2b | seller-b2c
   dir:   in (Vodafone receives) | out (Vodafone issues)
   mode:  live (cleared per document) | batch (reported once a day) | capture (recorded, nothing to clear)
   position: settled (clear OTA treatment) | proposed (Fawtara's reading, to confirm)  */
const STREAMS = [
  { id: 'b2b-buy-in',  n: 1, group: 'buyer', dir: 'in',  title: 'B2B · supplier inside Oman',
    role: 'Vodafone as buyer', origin: 'Peppol inbound', target: 'Your ERP',
    doc: 'Supplier tax invoice', mode: 'live', position: 'settled',
    today: 74, mtd: 1180,
    blurb: 'Supplier e-invoices, already cleared through the OTA, arrive over Peppol. Fawtara matches them to Vodafone and lands them as draft purchase invoices in your ERP — nobody keys them in.' },
  { id: 'b2b-buy-out', n: 2, group: 'buyer', dir: 'in',  title: 'B2B · supplier outside Oman',
    role: 'Vodafone as buyer', origin: 'Import — no Peppol', target: 'Reverse-charge record',
    doc: 'Self-accounted (RCM)', mode: 'capture', position: 'proposed',
    today: 18, mtd: 260,
    blurb: 'Cross-border services have no inbound Peppol document and nothing to clear outbound. Vodafone self-accounts under reverse charge; Fawtara captures the record for the VAT return and the archive.' },
  { id: 'b2b-sell',    n: 3, group: 'seller-b2b', dir: 'out', title: 'B2B · postpaid',
    role: 'Vodafone as seller', origin: 'Your billing system', target: 'OTA — cleared',
    doc: 'Standard tax invoice', mode: 'live', position: 'settled',
    today: 640, mtd: 8900,
    blurb: 'Business-customer postpaid invoices raised in your billing system. Standard tax invoices, cleared to the OTA through one pipe — the canonical flow.' },
  { id: 'b2c-post',    n: 4, group: 'seller-b2c', dir: 'out', title: 'B2C · postpaid',
    role: 'Vodafone as seller', origin: 'Your billing system', target: 'OTA — daily batch',
    doc: 'Simplified tax invoice', mode: 'batch', position: 'settled',
    today: 42800, mtd: 312000,
    blurb: 'Consumer postpaid bills — high volume, simplified. Reported to the OTA in one scheduled batch a day, not cleared line-by-line at bill run.' },
  { id: 'b2c-prepaid', n: 5, group: 'seller-b2c', dir: 'out', title: 'B2C · prepaid top-ups & recharges',
    role: 'Vodafone as seller', origin: 'Point of sale · app · channels', target: 'OTA — daily batch',
    doc: 'Simplified tax invoice', mode: 'batch', position: 'proposed',
    today: 186400, mtd: 5120000,
    blurb: 'Prepaid recharges across retail, app and dealer channels. Fawtara’s reading: a single-purpose voucher — the tax point is the top-up. To confirm with OTA.' },
  { id: 'oob',         n: 6, group: 'seller-b2c', dir: 'out', title: 'Out-of-bundle usage',
    role: 'Vodafone as seller', origin: 'Rated into the postpaid cycle', target: 'Line on the cycle invoice',
    doc: 'Aggregated on the postpaid invoice', mode: 'batch', position: 'proposed',
    today: null, mtd: null,
    blurb: 'Usage beyond the bundle allowance. Fawtara’s reading: taxable at consumption, aggregated into the monthly postpaid invoice — one invoice per cycle, not one per event. To confirm with OTA.' }
];
function stream(id) { return STREAMS.find(s => s.id === id); }

/* --- Fawtara's recommended OTA positions ----------------------------------
   The mock's only load-bearing tax claims. Each renders with the "to confirm
   with OTA" tag. Basis: Oman VAT Law (RD 121/2020) & Executive Regulations —
   voucher and tax-point treatment.                                           */
const OTA_POSITIONS = [
  { id: 'prepaid', agenda: 'Prepaid top-ups & recharges',
    headline: 'Single-purpose voucher — tax point at the top-up',
    basis: 'Prepaid credit is redeemable only for telecom services at a known 5% rate, so it meets the single-purpose voucher test.',
    treatment: [
      'A simplified B2C tax invoice is issued when the customer buys the top-up.',
      'VAT of 5% is recognised then, on the face value of the recharge.',
      'Later consumption — calls, data, SMS drawing down the balance — is NOT a new tax point and raises no further invoice.'
    ],
    channels: 'Applies identically across retail POS, the Vodafone app, dealer and voucher channels.',
    tag: 'Fawtara’s reading — to confirm with OTA' },
  { id: 'buyplan', agenda: 'Buy a plan using balance / card / voucher',
    headline: 'One rule, three payment routes',
    basis: 'Whether buying a bundle creates a new tax point depends only on whether new money enters — not on the bundle itself.',
    treatment: [
      'Paid from existing prepaid balance → no new supply, no new tax point. It was already taxed at the original top-up.',
      'Paid by card or fresh cash → treated as a new top-up, taxed at that point.',
      'Paid by a voucher → taxed when the voucher was purchased, not when the plan is bought.'
    ],
    channels: 'Keeps double-taxation off balance-funded purchases while still taxing every inflow of new money once.',
    tag: 'Fawtara’s reading — to confirm with OTA' },
  { id: 'oob', agenda: 'Out-of-bundle usage',
    headline: 'Taxable at consumption, aggregated into the cycle',
    basis: 'Out-of-bundle usage is a supply of telecom services at the point it is consumed, invoiced with the rest of the postpaid cycle.',
    treatment: [
      'Out-of-bundle lines are rated and rolled into the monthly postpaid tax invoice.',
      'One cleared invoice per billing cycle — not one e-invoice per usage event.',
      'The out-of-bundle charges are itemised within that single invoice for transparency.'
    ],
    channels: 'Avoids millions of per-event documents while keeping the tax point correct.',
    tag: 'Fawtara’s reading — to confirm with OTA' },
  { id: 'rcm', agenda: 'Supplier invoices from outside Oman',
    headline: 'Reverse charge — Vodafone self-accounts',
    basis: 'Imported services are accounted for by the recipient under the reverse-charge mechanism; there is no inbound Peppol document.',
    treatment: [
      'No e-invoice is cleared or received for the cross-border supply itself.',
      'Vodafone self-accounts for output and input VAT on the same return (net nil where fully recoverable).',
      'Fawtara captures the RCM record and archives the original supplier document for audit.'
    ],
    channels: 'Suppliers inside Oman remain ordinary inbound Peppol → draft in your ERP (stream 1).',
    tag: 'Fawtara’s reading — to confirm with OTA' }
];

/* --- roll-up (single entity, all six streams) ------------------------------
   Outbound today = B2B postpaid + B2C postpaid + prepaid top-ups.            */
const GROUP = {
  name: 'Vodafone Oman', trn: VOD.vatin, entity: VOD,
  streams: 6, settled: 4, proposed: 2,
  liveStreams: 2, batchStreams: 2,

  /* outbound today: 640 + 42,800 + 186,400 = 229,840 */
  todayTotal: 229840, todaySuccess: 227842, todayFailed: 168, todayPending: 1830,
  /* month to date, August 2026 */
  mtdTotal: 5440900, mtdFailed: 3120,

  /* inbound today: inside Oman 74 + outside Oman 18 = 92 */
  inboundToday: 92, inboundInside: 74, inboundOutside: 18,

  aspAvgMs: 372,
  /* the daily batch that carries B2C — reported once per day */
  batchToday: { id: 'VOD-B2C-2026-0820-01', count: 229118, window: '02:00–02:40 GST',
                reportedAt: '02:41 GST', state: 'reported', ack: 'ASP-OM-2026-0820-BATCH-01' },

  /* Fri 14 → Thu 20 Aug. Friday and Saturday are the Omani weekend. */
  week: [231400, 118900, 41200, 38700, 224100, 228600, 229840],
  weekDays: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
  prevSameDay: 226310
};

/* --- connection methods (kept from the platform proposal) ------------------ */
const METHODS = {
  1: { n: 'Method 1 — Direct API', short: 'Direct API', onsite: 'None',
       use: 'Cloud and API-enabled systems',
       how: 'The Hub calls the billing system / ERP standard API.' },
  2: { n: 'Method 2 — On-site agent', short: 'On-site agent', onsite: 'Lightweight agent',
       use: 'On-premise and restricted-network systems',
       how: 'A lightweight agent connects outward to the Hub and carries work both ways. No inbound firewall access is required.' },
  3: { n: 'Method 3 — Secure file transfer', short: 'Secure file transfer', onsite: 'None',
       use: 'Batch and low-interface environments',
       how: 'Scheduled exports and imports use an agreed format and secure location — the natural fit for a once-a-day billing batch.' }
};

/* --- counterparties (invented) --------------------------------------------- */
const CUSTOMERS = [
  { name: 'Gulf Petrochem Industries LLC',   vatin: 'OM1100445566', type: 'B2B', country: 'OM' },
  { name: 'Al Mouj Muscat SAOC',             vatin: 'OM1100667788', type: 'B2B', country: 'OM' },
  { name: 'Directorate General of Customs',  vatin: 'OM1100889900', type: 'B2G', country: 'OM' },
  { name: 'Consumer — postpaid',             vatin: null,           type: 'B2C', country: 'OM' },
  { name: 'Consumer — prepaid',              vatin: null,           type: 'B2C', country: 'OM' }
];

/* suppliers — two inside Oman (Peppol inbound), two outside Oman (RCM) */
const SUPPLIERS = [
  { name: 'Muscat Tower Facilities LLC',   vatin: 'OM1100223344', peppol: '0248:OM1100223344', country: 'OM', inside: true },
  { name: 'Al Batinah Power Services SAOC', vatin: 'OM1100556611', peppol: '0248:OM1100556611', country: 'OM', inside: true },
  { name: 'Aurora Network Systems OY',     vatin: 'FI28471900',   peppol: null, country: 'FI', inside: false },
  { name: 'Gulf Datacenter Services FZ-LLC', vatin: 'AE100555666700003', peppol: null, country: 'AE', inside: false }
];

/* --- outbound stages (the pipeline shown once, for stream 3) --------------- */
const STAGES = ['Billing invoice', 'Collect & map', 'Build XML', 'Validate',
                'Record', 'ASP / Peppol', 'Track outcome', 'Result published', 'Archive'];
const STAGE_SHORT = ['Billing', 'Map', 'XML', 'Validate', 'Record', 'Send', 'Outcome', 'Result', 'Archive'];
const STAGE_NOTE = [
  'Invoice and credit-note data from the billing system',
  'Apply the Vodafone mapping profile',
  'UBL 2.1 · UUID · QR information',
  'Apply PINT-OM rules before sending',
  'Store XML and audit trail before anything is sent',
  'Transmit the valid XML',
  'Acknowledgement and final status',
  'UUID, status and QR held on the interface for the billing system to collect',
  'Long-term legal record, with the acknowledgements'
];
/* documents in flight on the live B2B pipeline — sums to a small pending set */
const STAGE_COUNT = [3, 5, 4, 6, 2, 5, 2];

/* --- inbound stages -------------------------------------------------------- */
const IN_STAGES = ['Supplier sends', 'Match to Vodafone', 'Validate',
                   'Archive original', 'Create draft', 'Finance review'];
const IN_STAGE_NOTE = [
  'Document arrives via ASP / Peppol',
  'Match participant ID and CR to Vodafone',
  'Structure, identity and content checks',
  'Preserve the legal XML record',
  'Draft purchase invoice in your ERP',
  'Finance reviews and posts manually'
];

/* --- three acknowledgement legs -------------------------------------------- */
const LEGS = [
  { id: 'ack',   leg: 'Service provider → Hub', name: 'Validated and accepted by the ASP',
    at: '20 Aug 2026 09:14:07.633', el: '+0.4 s', st: 'ok',
    body: 'The ASP confirms the e-invoice was generated and validated. This is custody, not delivery.',
    ref: 'ASP-OM-2026-0820-44718' },
  { id: 'ota',   leg: 'Tax Authority → service provider', name: 'Reported to the Tax Authority',
    at: '20 Aug 2026 09:15:52.400', el: '+1 m 45 s', st: 'ok',
    body: 'The ASP reported the Tax Data Document to Fawtara and the OTA acknowledged it. The Hub never talks to the OTA directly.',
    ref: 'OTA-RPT-2026-0820-87234' },
  { id: 'deliv', leg: 'Buyer’s provider → service provider', name: 'Delivered to the buyer',
    at: '20 Aug 2026 09:16:41.008', el: '+2 m 34 s', st: 'ok',
    body: 'The buyer’s access point confirmed receipt. This leg is outside Vodafone’s control and can take hours.',
    ref: 'MLS-DELIVERED' }
];
const LEGS_PENDING = [
  { id: 'ack',   name: 'Validated and accepted by the ASP', at: '20 Aug 2026 10:02:14.880', st: 'ok',
    body: 'Receipt issued 0.4 s after submission.' },
  { id: 'ota',   name: 'Reported to the Tax Authority',     at: 'awaiting', st: 'pending',
    body: 'Within the reporting window. No action required.' },
  { id: 'deliv', name: 'Delivered to the buyer',            at: 'awaiting', st: 'pending',
    body: 'The buyer’s access point has not yet confirmed. Retried automatically by the ASP.' }
];

/* --- outbound documents ----------------------------------------------------
   stage indexes into STAGES; state: ok | active | failed | held
   stream links each to one of the six. The tracked invoice
   VOD-INV-2026-00417 (B2B postpaid) is followed end-to-end.                  */
const INVOICES = [
  { no: 'VOD-INV-2026-00417', stream: 'b2b-sell', cust: 0, net: 12480.000, vat: 624.000, total: 13104.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '20 Aug 09:14:02',
    uuid: 'b7f4c2e1-9a3d-5c8b-a1f6-2e7d4b9c0a35', ackNo: 'ASP-OM-2026-0820-44718', ref: 'PEP-8842-2026',
    lines: 5, po: 'PO-44718' },
  { no: 'VOD-INV-2026-00416', stream: 'b2b-sell', cust: 1, net: 41200.000, vat: 2060.000, total: 43260.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '20 Aug 09:21:47',
    uuid: 'c1a8d3f2-4b7e-6d9c-b2a7-3f8e5c0d1b46', ackNo: 'ASP-OM-2026-0820-44719', ref: 'PEP-8843-2026',
    lines: 9, po: 'PO-44690' },
  { no: 'VOD-INV-2026-00420', stream: 'b2b-sell', cust: 2, net: 86200.000, vat: 4310.000, total: 90510.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2G', stage: 6, state: 'active', retry: 0, created: '20 Aug 10:02:11',
    uuid: 'd2b9e4a3-5c8f-7e0d-c3b8-4a9f6d1e2c57', ackNo: 'ASP-OM-2026-0820-44755', ref: 'PEP-8851-2026',
    lines: 4, po: 'PO-11907', awaiting: 'OTA report · buyer delivery' },
  { no: 'VOD-INV-2026-00434', stream: 'b2b-sell', cust: 1, net: 3420.000, vat: 171.000, total: 3591.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 3, state: 'failed', retry: 2, created: '20 Aug 10:11:38',
    uuid: 'e3c0f5b4-6d9a-8f1e-d4c9-5b0a7e2f3d68', ackNo: null, ref: null, lines: 3, po: null,
    owner: 'entity' },
  { no: 'VOD-SIMP-2026-0820-118420', stream: 'b2c-post', cust: 3, net: 24.000, vat: 1.200, total: 25.200,
    cur: 'OMR', type: 'Simplified', scen: 'B2C', stage: 8, state: 'ok', retry: 0, created: '20 Aug 02:34:00',
    uuid: 'f4d1a6c5-7e0b-9a2f-e5d0-6c1b8f3a4e79', ackNo: 'ASP-OM-2026-0820-BATCH-01', ref: 'PEP-8859-2026',
    lines: 3, po: null, batch: true },
  { no: 'VOD-CRNT-2026-00218', stream: 'b2b-sell', cust: 0, net: -1200.000, vat: -60.000, total: -1260.000,
    cur: 'OMR', type: 'Credit Note', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '20 Aug 10:26:14',
    uuid: 'c7a4d9f8-0b3e-2d5c-b8a3-9f4e1c6d7b02', ackNo: 'ASP-OM-2026-0820-44736', ref: 'PEP-8863-2026',
    lines: 1, po: null, against: 'VOD-INV-2026-00390' },
  { no: 'VOD-TOP-2026-0820-771204', stream: 'b2c-prepaid', cust: 4, net: 4.762, vat: 0.238, total: 5.000,
    cur: 'OMR', type: 'Simplified', scen: 'B2C', stage: 8, state: 'ok', retry: 0, created: '20 Aug 09:41:52',
    uuid: 'a5e2b7d6-8f1c-0b3a-f6e1-7d2c9a4b5f80', ackNo: 'ASP-OM-2026-0820-BATCH-01', ref: 'PEP-8801-2026',
    lines: 1, po: null, batch: true, voucher: true },
  { no: 'VOD-INV-2026-00418', stream: 'b2b-sell', cust: 2, net: 15600.000, vat: 780.000, total: 16380.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2G', stage: 2, state: 'active', retry: 0, created: '20 Aug 10:31:09',
    uuid: 'd8b5e0a9-1c4f-3e6d-c9b4-0a5f2d7e8c13', ackNo: null, ref: null, lines: 7, po: 'PO-11912' },
  { no: 'VOD-INV-2026-00421', stream: 'b2b-sell', cust: 0, net: 7480.000, vat: 374.000, total: 7854.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 1, state: 'active', retry: 0, created: '20 Aug 10:38:56',
    uuid: null, ackNo: null, ref: null, lines: 9, po: 'PO-88231' }
];

/* --- inbound supplier documents -------------------------------------------
   supplier indexes SUPPLIERS. Inside Oman → Peppol inbound → ERP draft.
   Outside Oman → no Peppol; captured as a reverse-charge record.            */
const INBOUND = [
  { no: 'MTF-INV-2026-11842', supplier: 0, recv: '20 Aug 10:29:16', net: 8640.000,
    vat: 432.000, total: 9072.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00914',
    erpState: 'Draft — awaiting review', lines: 14, po: 'PO-88190', kind: 'peppol' },
  { no: 'ABP-INV-2026-00733', supplier: 1, recv: '20 Aug 10:24:03', net: 21500.000,
    vat: 1075.000, total: 22575.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00913',
    erpState: 'Draft — awaiting review', lines: 6, po: 'PO-11866', kind: 'peppol' },
  { no: 'ANS-2026-OY-4471', supplier: 2, recv: '20 Aug 09:58:02', net: 214000.000,
    vat: 0.000, total: 214000.000, stage: 5, state: 'ok', erpRef: 'RCM-2026-00218',
    erpState: 'Reverse-charge record — self-accounted', lines: 3, po: 'PO-4471', kind: 'rcm',
    note: 'Imported network services from Finland. No inbound Peppol. Vodafone self-accounts 5% output and input VAT; net effect nil where recoverable.' },
  { no: 'GDS-2026-AE-0091', supplier: 3, recv: '20 Aug 09:31:44', net: 46800.000,
    vat: 0.000, total: 46800.000, stage: 5, state: 'ok', erpRef: 'RCM-2026-00217',
    erpState: 'Reverse-charge record — self-accounted', lines: 2, po: 'PO-3390', kind: 'rcm',
    note: 'Imported datacenter services from the UAE. Captured for the return and archived; nothing cleared.' },
  { no: 'UNK-INV-2026-00051', supplier: null, recv: '20 Aug 09:41:19', net: 990.000,
    vat: 49.500, total: 1039.500, stage: 1, state: 'failed', erpRef: null,
    erpState: 'Held — cannot match', lines: 2, po: null, kind: 'peppol',
    err: 'Participant 0248:OM1100777001 does not resolve to Vodafone. Confirming the registration.',
    owner: 'platform' }
];

/* --- archive --------------------------------------------------------------- */
const ARCHIVE_ITEMS = [
  { item: 'Generated UBL XML',                  why: 'The official compliance document created from billing invoice data.', size: '8.9 KB' },
  { item: 'UUID and QR information',            why: 'Unique identity and invoice verification information.',                size: '312 B' },
  { item: 'Submission and outcome timestamps',  why: 'The complete processing timeline.',                                    size: '1.1 KB' },
  { item: 'ASP acknowledgements and final status', why: 'Evidence of receipt, delivery or rejection.',                       size: '2.4 KB' },
  { item: 'Validation results and audit history', why: 'Traceability for corrections, support and audit.',                   size: '6.2 KB' },
  { item: 'Reverse-charge and inbound records', why: 'Imported-service records and preserved inbound originals.',            size: '—' }
];

/* --- billing-side invoice list (origin screen · generic billing system) ---- */
const ERP_INVOICES = [
  { no: 'VOD-INV-2026-00417', cust: 'Gulf Petrochem Industries LLC', date: '20-08-2026', due: '19-09-2026',
    net: 12480.000, vat: 624.000, total: 13104.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'b7f4c2e1…0a35', qr: true },
  { no: 'VOD-INV-2026-00416', cust: 'Al Mouj Muscat SAOC', date: '20-08-2026', due: '19-09-2026',
    net: 41200.000, vat: 2060.000, total: 43260.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'c1a8d3f2…1b46', qr: true },
  { no: 'VOD-INV-2026-00418', cust: 'Directorate General of Customs', date: '20-08-2026', due: '19-09-2026',
    net: 15600.000, vat: 780.000, total: 16380.000, docStatus: 'Posted', eStatus: 'In Progress',
    ready: true, uuid: null, qr: false },
  { no: 'VOD-CRNT-2026-00218', cust: 'Gulf Petrochem Industries LLC', date: '20-08-2026', due: '—',
    net: -1200.000, vat: -60.000, total: -1260.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'c7a4d9f8…7b02', qr: false, credit: true },
  { no: 'VOD-INV-2026-00419', cust: 'Al Mouj Muscat SAOC', date: '20-08-2026', due: '19-09-2026',
    net: 33150.000, vat: 1657.500, total: 34807.500, docStatus: 'Draft', eStatus: 'Not Applicable',
    ready: false, uuid: null, qr: false },
  { no: 'VOD-INV-2026-00415', cust: 'Directorate General of Customs', date: '19-08-2026', due: '18-09-2026',
    net: 51200.000, vat: 2560.000, total: 53760.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'd4c1b8a7…3e92', qr: true },
  { no: 'VOD-INV-2026-00414', cust: 'Al Mouj Muscat SAOC', date: '19-08-2026', due: '18-09-2026',
    net: 7300.000, vat: 365.000, total: 7665.000, docStatus: 'Posted', eStatus: 'Rejected by ASP',
    ready: true, uuid: 'e5d2c9b8…4f03', qr: false }
];

/* --- the daily B2C batch (origin + hub batch screens) ---------------------
   Vodafone's consumer streams are collected and reported to the OTA once a
   day, not cleared per document. Cadence is an assumption to confirm.        */
const B2C_BATCH = {
  system: 'Your billing system', module: 'Consumer billing — postpaid & prepaid',
  todayCount: 229118, monthCount: 5312000, awaitingSync: 402, channels: 4,
  batch: { id: 'VOD-B2C-2026-0820-01', count: 229118, window: '02:00–02:40 GST',
           reportedAt: '02:41 GST', state: 'reported', ack: 'ASP-OM-2026-0820-BATCH-01' },
  split: [
    { k: 'Postpaid consumer bills', v: 42800 },
    { k: 'Prepaid top-ups & recharges', v: 186400 },
    { k: 'Adjustments & credit notes', v: -82 }
  ],
  streams: ['Retail POS', 'Vodafone app', 'Dealer channel', 'Voucher / scratch'],
  note: 'Consumer simplified invoices are collected by the billing system and reported to the OTA in one scheduled overnight batch through the Hub — not cleared live at each recharge.',
  assumption: 'Assumption · to confirm with Vodafone & OTA: the once-a-day cadence, and whether any channel requires a cleared invoice at the point of sale.',
  rows: [
    { no: 'VOD-SIMP-2026-0820-118420', ch: 'Postpaid bill run', cust: 'Consumer — postpaid', item: 'Monthly plan · Red 15', net: 24.000, vat: 1.200, total: 25.200, t: '02:14', state: 'reported' },
    { no: 'VOD-TOP-2026-0820-771204',  ch: 'Retail POS',        cust: 'Consumer — prepaid',  item: 'Recharge · OMR 5 voucher', net: 4.762, vat: 0.238, total: 5.000, t: '09:41', state: 'batched' },
    { no: 'VOD-TOP-2026-0820-771205',  ch: 'Vodafone app',      cust: 'Consumer — prepaid',  item: 'Recharge · OMR 3 card', net: 2.857, vat: 0.143, total: 3.000, t: '09:42', state: 'batched' },
    { no: 'VOD-SIMP-2026-0820-118421', ch: 'Postpaid bill run', cust: 'Consumer — postpaid', item: 'Monthly plan · Red 8 + out-of-bundle data', net: 11.905, vat: 0.595, total: 12.500, t: '02:14', state: 'reported' },
    { no: 'VOD-TOP-2026-0820-771206',  ch: 'Dealer channel',    cust: 'Consumer — prepaid',  item: 'Recharge · OMR 10 top-up', net: 9.524, vat: 0.476, total: 10.000, t: '09:44', state: 'queued' },
    { no: 'VOD-TOP-2026-0820-771207',  ch: 'Voucher / scratch', cust: 'Consumer — prepaid',  item: 'Recharge · OMR 2 scratch', net: 1.905, vat: 0.095, total: 2.000, t: '09:45', state: 'queued' }
  ]
};

/* --- processing logs ------------------------------------------------------- */
const LOGS = [
  { ts: '10:22:28.114', lv: 'info', txt: 'Poll tick — billing system, watermark 2026-08-20T10:21:44Z' },
  { ts: '10:22:28.291', lv: 'info', txt: 'Fetched raw payload · 13.6 KB · 26 fields (allowlist applied)' },
  { ts: '10:22:28.402', lv: 'ok',   txt: 'Idempotency check passed — VOD-INV-2026-00417 not previously seen' },
  { ts: '10:22:28.556', lv: 'info', txt: 'Mapping profile Vodafone/v3 applied — 46 of 47 fields resolved' },
  { ts: '10:22:28.703', lv: 'info', txt: 'Scenario detected: B2B postpaid · standard rate 5%' },
  { ts: '10:22:28.844', lv: 'ok',   txt: 'BTOM-002 UUID derived — b7f4c2e1-9a3d-5c8b-a1f6-2e7d4b9c0a35' },
  { ts: '10:22:29.017', lv: 'info', txt: 'UBL 2.1 Invoice built · 8.9 KB · 5 lines' },
  { ts: '10:22:29.188', lv: 'info', txt: 'Oman CIUS Schematron — evaluating 150 assertions' },
  { ts: '10:22:31.472', lv: 'warn', txt: 'IBR-W-014 · payment means defaulted to 30' },
  { ts: '10:22:31.474', lv: 'ok',   txt: 'Validation passed — 148 passed, 0 failed, 2 warnings (284 ms)' },
  { ts: '10:22:31.610', lv: 'ok',   txt: 'Archived — XML, validation report and audit trail written before transmission' },
  { ts: '10:22:31.788', lv: 'ok',   txt: 'State → READY_FOR_ASP · queued on the Vodafone channel' }
];

/* --- ASP exchange ---------------------------------------------------------- */
const ASP = {
  provider: 'Accredited Service Provider — OTA licence ASP-OM-014',
  endpoint: 'https://ap.asp-oman.om/peppol/v1/documents',
  auth: 'mTLS · client certificate held in the platform vault',
  sentAt: '20 Aug 2026 09:14:07.221 GST',
  ackAt:  '20 Aug 2026 09:14:07.633 GST',
  otaAt:  '20 Aug 2026 09:15:52.400 GST',
  mlsAt:  '20 Aug 2026 09:16:41.008 GST',
  rtt: 372,
  http: '202 Accepted',
  ref: 'PEP-8842-2026',
  ackNo: 'ASP-OM-2026-0820-44718',
  otaRef: 'OTA-RPT-2026-0820-87234',
  msgId: 'urn:uuid:b7f4c2e1-9a3d-5c8b-a1f6-2e7d4b9c0a35',
  sender: '0248:OM1200087234',
  sellerVatin: 'OM1200087234',
  sellerCr: 'CR 1279001',
  receiver: '0248:OM1100445566',
  docType: 'Peppol PINT billing — Oman',
  process: 'Peppol BIS billing'
};

/* --- history --------------------------------------------------------------- */
const HISTORY = [
  { no: 'VOD-INV-2026-00417', stream: 'b2b-sell', date: '20 Aug 09:14', total: 13104.000, type: 'Invoice',  dir: 'out', st: 'success', ack: 'ASP-OM-2026-0820-44718', retries: 0 },
  { no: 'VOD-INV-2026-00416', stream: 'b2b-sell', date: '20 Aug 09:21', total: 43260.000, type: 'Invoice', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0820-44719', retries: 0 },
  { no: 'VOD-B2C-2026-0820-01', stream: 'b2c-post', date: '20 Aug 02:41', total: null, type: 'Daily B2C batch (229,118 docs)', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0820-BATCH-01', retries: 0, batch: true },
  { no: 'VOD-INV-2026-00420', stream: 'b2b-sell', date: '20 Aug 10:02', total: 90510.000, type: 'Invoice',  dir: 'out', st: 'pending', ack: null, retries: 0 },
  { no: 'VOD-CRNT-2026-00218', stream: 'b2b-sell', date: '20 Aug 10:26', total: -1260.000, type: 'Credit Note', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0820-44736', retries: 0 },
  { no: 'MTF-INV-2026-11842',  stream: 'b2b-buy-in', date: '20 Aug 10:29', total: 9072.000, type: 'Supplier invoice', dir: 'in', st: 'success', ack: 'PINV-2026-00914', retries: 0 },
  { no: 'ANS-2026-OY-4471',    stream: 'b2b-buy-out', date: '20 Aug 09:58', total: 214000.000, type: 'Reverse-charge record', dir: 'in', st: 'success', ack: 'RCM-2026-00218', retries: 0 },
  { no: 'VOD-INV-2026-00434', stream: 'b2b-sell', date: '20 Aug 10:11', total: 3591.000, type: 'Invoice',   dir: 'out', st: 'failed',  ack: null, retries: 2, err: 'IBR-CO-15 · total mismatch' },
  { no: 'VOD-INV-2026-00414', stream: 'b2b-sell', date: '19 Aug 16:22', total: 7665.000, type: 'Invoice',   dir: 'out', st: 'rejected', ack: null, retries: 0, err: 'ASP rejected — buyer participant not registered' },
  { no: 'GDS-2026-AE-0091',   stream: 'b2b-buy-out', date: '20 Aug 09:31', total: 46800.000, type: 'Reverse-charge record', dir: 'in', st: 'success', ack: 'RCM-2026-00217', retries: 0 },
  { no: 'VOD-INV-2026-00415', stream: 'b2b-sell', date: '19 Aug 14:11', total: 53760.000, type: 'Invoice',  dir: 'out', st: 'success', ack: 'ASP-OM-2026-0819-44590', retries: 0 }
];

/* --- reporting — by stream, month to date August 2026 ---------------------- */
const REPORT_ROWS = [
  { id: 'b2c-prepaid', name: 'B2C · prepaid top-ups', docs: 5120000, net: 24380000.000, vat: 1219000.000, zero: 0.000, failed: 2600, ack: 5117400 },
  { id: 'b2c-post',    name: 'B2C · postpaid',        docs: 312000,  net: 7440000.000,  vat: 372000.000,  zero: 0.000, failed: 480,  ack: 311520 },
  { id: 'b2b-sell',    name: 'B2B · postpaid',        docs: 8900,    net: 9860000.000,  vat: 486000.000,  zero: 210000.000, failed: 40, ack: 8860 },
  { id: 'b2b-buy-in',  name: 'B2B · supplier inside Oman', docs: 1180, net: 2140000.000, vat: 107000.000, zero: 0.000, failed: 0, ack: 1180 },
  { id: 'b2b-buy-out', name: 'B2B · supplier outside Oman (RCM)', docs: 260, net: 3180000.000, vat: 0.000, zero: 3180000.000, failed: 0, ack: 260 }
];

const REPORT_TYPES = [
  { n: 'VAT summary by stream',        d: 'Net, VAT and zero-rated totals for a period, per invoice stream.', tag: 'Finance' },
  { n: 'Reporting completeness',       d: 'Documents raised in the billing system against documents acknowledged by the ASP.', tag: 'Compliance' },
  { n: 'Daily batch reconciliation',   d: 'Each overnight B2C batch: submitted, acknowledged and any held.', tag: 'Operations' },
  { n: 'Exception ageing',             d: 'Open failures by age and by who owns the fix.', tag: 'Operations' },
  { n: 'Inbound & reverse-charge log',  d: 'Supplier documents inside Oman and self-accounted imports.', tag: 'Operations' },
  { n: 'OTA-position register',        d: 'The open treatments — prepaid, buy-plan, out-of-bundle — and their status.', tag: 'Programme' }
];

/* --- mapping: what the billing system exposes ------------------------------ */
const ERP_SCHEMA = [
  { f: 'InvoiceNumber',              t: 'string',  ex: 'VOD-INV-2026-00417' },
  { f: 'InvoiceDate',                t: 'date',    ex: '20260820' },
  { f: 'InvoiceType',                t: 'string',  ex: 'STD' },
  { f: 'IsCancelled',                t: 'boolean', ex: 'false' },
  { f: 'Currency',                   t: 'string',  ex: 'OMR' },
  { f: 'BillingEntity',              t: 'string',  ex: 'VOD-OM' },
  { f: 'CompanyRegistration',        t: 'string',  ex: '1279001' },
  { f: 'CompanyVATNumber',           t: 'string',  ex: '1200087234' },
  { f: 'CompanyAddressCity',         t: 'string',  ex: 'Muscat' },
  { f: 'CompanyCountry',             t: 'string',  ex: 'OM' },
  { f: 'AccountNumber',              t: 'string',  ex: 'ACC-00412' },
  { f: 'CustomerName',               t: 'string',  ex: '  gulf petrochem industries llc ' },
  { f: 'CustomerVATNumber',          t: 'string',  ex: '1100445566' },
  { f: 'CustomerCountry',            t: 'string',  ex: 'OM' },
  { f: 'CustomerAddressStreet',      t: 'string',  ex: '(empty in this system)' },
  { f: 'NetAmount',                  t: 'decimal', ex: '12480.00' },
  { f: 'TaxAmount',                  t: 'decimal', ex: '624.00' },
  { f: 'InvoiceTotal',               t: 'decimal', ex: '13104.00' },
  { f: 'AmountDue',                  t: 'decimal', ex: '13104.00' },
  { f: 'TaxRate',                    t: 'decimal', ex: '5.0' },
  { f: 'ProductCode',                t: 'string',  ex: 'SVC-DEDIC-100' },
  { f: 'ProductDescription',         t: 'string',  ex: 'Dedicated internet, 100 Mbps, monthly' },
  { f: 'Quantity',                   t: 'decimal', ex: '1.000' },
  { f: 'QuantityUnit',               t: 'string',  ex: 'EA' },
  { f: 'NetPriceAmount',             t: 'decimal', ex: '12480.000' },
  { f: 'CustomerPO',                 t: 'string',  ex: 'PO-44718' },
  { f: 'PaymentTerms',               t: 'string',  ex: 'NT30' }
];

const TRANSFORMS = [
  { v: '',                   n: 'Copy as-is' },
  { v: 'trim',               n: 'trim — remove surrounding spaces' },
  { v: 'trim|upper',         n: 'trim | upper — trim then upper-case' },
  { v: 'date:ISO8601',       n: 'date:ISO8601 — yyyymmdd to yyyy-mm-dd' },
  { v: 'decimal:3',          n: 'decimal:3 — force three decimal places' },
  { v: 'decimal:4',          n: 'decimal:4 — force four decimal places' },
  { v: 'codelist:UNCL1001',  n: 'codelist:UNCL1001 — map to document type code' },
  { v: 'codelist:UNECE20',   n: 'codelist:UNECE20 — map to unit of measure' },
  { v: 'iso:alpha2',         n: 'iso:alpha2 — country to two-letter code' },
  { v: 'prefix:OM',          n: 'prefix:OM — prepend the country prefix' },
  { v: 'lookup:company',     n: 'lookup:company — resolve from entity master' },
  { v: 'map:381',            n: 'map:381 — flag as credit note' },
  { v: 'pct',                n: 'pct — percentage as a number' },
  { v: 'nullable',           n: 'nullable — allow an empty value' },
  { v: 'derive:uuidv5',      n: 'derive:uuidv5 — generated by the Hub' },
  { v: 'derive:0248',        n: 'derive:0248 — build the Peppol participant ID' },
  { v: 'derive:txntype',     n: 'derive:txntype — Standard or Simplified' },
  { v: 'derive:itemkind',    n: 'derive:itemkind — goods or services, from the item group' },
  { v: 'const',              n: 'const — the same value on every document' },
  { v: 'const:0248',         n: 'const:0248 — fixed scheme identifier' },
  { v: 'const:CR',           n: 'const:CR — Commercial Registration scheme' },
  { v: 'const:VAT',          n: 'const:VAT — fixed tax scheme' }
];

const MAPPING = [
  { grp: 'Document header', rows: [
    { erp: 'InvoiceNumber',          std: 'BT-1',  stdName: 'Invoice number',        xf: '',            req: 'Mandatory', ok: true },
    { erp: 'InvoiceDate',            std: 'BT-2',  stdName: 'Issue date',            xf: 'date:ISO8601',req: 'Mandatory', ok: true },
    { erp: 'InvoiceType',            std: 'BT-3',  stdName: 'Invoice type code',     xf: 'codelist:UNCL1001', req: 'Mandatory', ok: true },
    { erp: 'Currency',               std: 'BT-5',  stdName: 'Document currency',     xf: '',            req: 'Mandatory', ok: true },
    { erp: 'IsCancelled',            std: 'BT-3',  stdName: 'Credit note flag',      xf: 'map:381',     req: 'Conditional', ok: true },
    { erp: '—',                      std: 'BTOM-002', stdName: 'Document UUID',      xf: 'derive:uuidv5', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Built from the invoice number, the seller VAT identifier and the issue date. Stable — a resubmission of the same invoice produces the same UUID.' },
    { erp: '—',                      std: 'BTOM-001', stdName: 'Invoice transaction type', xf: 'derive:txntype', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Standard for B2B, Simplified for B2C — decided from whether the buyer carries a VAT registration.' },
    { erp: '—',                      std: 'IBT-024', stdName: 'Specification identifier', xf: 'const', req: 'Mandatory', ok: true, derived: true, constant: true,
      dnote: 'urn:peppol:pint:billing-1@om-1 — declares the OM-1.1 ruleset the document is validated against.' }
  ]},
  { grp: 'Seller party', rows: [
    { erp: 'BillingEntity',          std: 'BT-27', stdName: 'Seller name',           xf: 'lookup:company', req: 'Mandatory', ok: true },
    { erp: 'CompanyRegistration',    std: 'IBT-029', stdName: 'Seller identifier (CR)', xf: 'const:CR', req: 'Mandatory', ok: true,
      dnote: 'Vodafone’s Commercial Registration, scheme CR (code list CL-06-OM).' },
    { erp: 'CompanyVATNumber',       std: 'BT-31', stdName: 'Seller VAT identifier', xf: 'prefix:OM',   req: 'Mandatory', ok: true,
      dnote: 'The Omani VATIN OM1200087234.' },
    { erp: '—',                      std: 'BTOM-004', stdName: 'Seller participant ID', xf: 'derive:0248', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Vodafone’s Peppol participant, 0248:OM<VATIN> — its endpoint, SMP entry and certificate. The exact Oman EAS scheme is confirmed on the OTA onboarding portal.' },
    { erp: 'CompanyAddressCity',     std: 'BT-37', stdName: 'Seller city',           xf: '',            req: 'Mandatory', ok: true },
    { erp: 'CompanyCountry',         std: 'BT-40', stdName: 'Seller country code',   xf: 'iso:alpha2',  req: 'Mandatory', ok: true }
  ]},
  { grp: 'Buyer party', rows: [
    { erp: 'AccountNumber',          std: 'BT-46', stdName: 'Buyer identifier',      xf: '',            req: 'Mandatory', ok: true },
    { erp: 'CustomerName',           std: 'BT-44', stdName: 'Buyer name',            xf: 'trim|upper',  req: 'Mandatory', ok: true },
    { erp: 'CustomerVATNumber',      std: 'BT-48', stdName: 'Buyer VAT identifier',  xf: 'nullable',    req: 'Conditional', ok: true,
      dnote: 'Present for B2B, absent for B2C — which is exactly what selects Standard vs Simplified.' },
    { erp: 'CustomerCountry',        std: 'BT-55', stdName: 'Buyer country code',    xf: 'iso:alpha2',  req: 'Mandatory', ok: true },
    { erp: '',                       std: 'BT-50', stdName: 'Buyer address line 1',  xf: '',            req: 'Mandatory', ok: false,
      fallback: 'Address held in the Hub master',
      note: 'CustomerAddressStreet is present but empty on most consumer records.' }
  ]},
  { grp: 'Monetary totals', rows: [
    { erp: 'NetAmount',              std: 'BT-109', stdName: 'Sum of line net amounts', xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'TaxAmount',              std: 'BT-110', stdName: 'Invoice total VAT amount', xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'InvoiceTotal',           std: 'BT-112', stdName: 'Invoice total with VAT',  xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'AmountDue',              std: 'BT-115', stdName: 'Amount due for payment',  xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'TaxRate',                std: 'BT-119', stdName: 'VAT category rate',       xf: 'pct',       req: 'Mandatory', ok: true },
    { erp: '—',                      std: 'IBT-118-1', stdName: 'Tax scheme code',       xf: 'const:VAT', req: 'Mandatory', ok: true, derived: true, constant: true,
      dnote: 'Always VAT for Oman.' }
  ]},
  { grp: 'Line items', rows: [
    { erp: 'ProductCode',            std: 'BT-155', stdName: 'Item seller identifier', xf: '',          req: 'Mandatory', ok: true },
    { erp: 'ProductDescription',     std: 'BT-153', stdName: 'Item name',              xf: 'trim',      req: 'Mandatory', ok: true },
    { erp: 'Quantity',               std: 'BT-129', stdName: 'Invoiced quantity',      xf: 'decimal:4', req: 'Mandatory', ok: true },
    { erp: 'QuantityUnit',           std: 'BT-130', stdName: 'Unit of measure code',   xf: 'codelist:UNECE20', req: 'Mandatory', ok: true },
    { erp: 'NetPriceAmount',         std: 'BT-146', stdName: 'Item net price',         xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: '—',                      std: 'BTOM-019', stdName: 'Goods or services indicator', xf: 'derive:itemkind', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Telecom services on every line — read from the item group.' }
  ]}
];

/* --- validation ------------------------------------------------------------ */
const VALIDATION = {
  profile: 'PINT-OM · Oman CIUS Schematron', ran: '20 Aug 2026 10:22:31 GST', ms: 284,
  passed: 148, failed: 0, warned: 2,
  rules: [
    { st: 'pass', id: 'IBR-001-OM', txt: 'An invoice shall have a Specification identifier (BT-24).' },
    { st: 'pass', id: 'IBR-002-OM', txt: 'An invoice shall have an Invoice number (BT-1).' },
    { st: 'pass', id: 'BTOM-002',   txt: 'Document UUID shall be a deterministic UUIDv5 over seller ID, invoice number and issue date.' },
    { st: 'pass', id: 'IBR-CO-10',  txt: 'Sum of Invoice line net amounts (BT-106) = Σ Invoice line net amount (BT-131).' },
    { st: 'pass', id: 'IBR-CO-15',  txt: 'Invoice total with VAT (BT-112) = Invoice total without VAT (BT-109) + Invoice total VAT (BT-110).' },
    { st: 'pass', id: 'IBR-052-OM', txt: 'Seller VAT identifier shall match the Omani VATIN format OM + 10 digits.' },
    { st: 'warn', id: 'IBR-W-014',  txt: 'Payment means code (BT-81) not supplied — defaulted to 30 (credit transfer).',
      x: 'cac:PaymentMeans/cbc:PaymentMeansCode' },
    { st: 'warn', id: 'IBR-W-031',  txt: 'Buyer address line 1 (BT-50) sourced from the fallback mapping — field not exposed by the billing system.',
      x: 'cac:AccountingCustomerParty/cac:Party/cac:PostalAddress/cbc:StreetName' }
  ]
};

const VALIDATION_FAILED = {
  profile: 'PINT-OM · Oman CIUS Schematron', ran: '20 Aug 2026 10:11:52 GST', ms: 261,
  passed: 143, failed: 2, warned: 1,
  rules: [
    { st: 'fail', id: 'IBR-053-OM', txt: 'Buyer VAT identifier (BT-48) is absent and no substitute participant ID was derived.',
      x: 'cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/cbc:CompanyID' },
    { st: 'fail', id: 'IBR-CO-15',  txt: 'Invoice total with VAT (BT-112) does not equal BT-109 + BT-110. Expected 3591.000, found 3590.000.',
      x: 'cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount' },
    { st: 'warn', id: 'IBR-W-014',  txt: 'Payment means code (BT-81) not supplied — defaulted to 30 (credit transfer).',
      x: 'cac:PaymentMeans/cbc:PaymentMeansCode' },
    { st: 'pass', id: 'IBR-001-OM', txt: 'An invoice shall have a Specification identifier (BT-24).' },
    { st: 'pass', id: 'IBR-002-OM', txt: 'An invoice shall have an Invoice number (BT-1).' }
  ]
};

/* --- ERP status sync steps (final origin screen) --------------------------- */
const SYNC_STEPS = [
  { name: 'Invoice posted in the billing system', t: '20 Aug 09:14:02', st: 'ok',
    body: 'Invoice VOD-INV-2026-00417 posted in the billing system. Document status set to Posted.' },
  { name: 'Collected by the Hub', t: '20 Aug 09:14:04', st: 'ok',
    body: 'Method 1 — Direct API. The Hub called the billing system’s standard API. Raw payload 13.6 KB, field allowlist applied.' },
  { name: 'Mapped, built and validated', t: '20 Aug 09:14:06', st: 'ok',
    body: 'Profile Vodafone/v3 applied. UBL 2.1 built. Oman CIUS Schematron passed — 148 rules, 2 warnings.' },
  { name: 'Archived', t: '20 Aug 09:14:06', st: 'ok',
    body: 'XML, validation report and audit trail written to the compliance archive before anything was transmitted.' },
  { name: 'Transmitted to the ASP', t: '20 Aug 09:14:07', st: 'ok',
    body: 'Accepted by the accredited provider in 372 ms. Peppol reference PEP-8842-2026.' },
  { name: 'Outcomes tracked on three legs', t: '20 Aug 09:16:41', st: 'ok',
    body: 'ASP accepted it at 09:14:07. Reported to the Tax Authority at 09:15:52. The buyer’s provider confirmed delivery at 09:16:41.' },
  { name: 'Result published on the interface', t: '20 Aug 09:16:43', st: 'ok',
    body: 'Held against this invoice and available to the billing system: UUID, e-invoice status, acknowledgement number, Peppol reference and QR information.' },
  { name: 'Collected by the billing system', t: '20 Aug 09:16:43', st: 'ok',
    body: 'The Vodafone-side connector read the result and stored it on the invoice, where the print format renders the QR on the customer copy.' }
];

/* --- delivery boundary ----------------------------------------------------- */
const BOUNDARY_ENTITY = [
  'Complete invoice data and the master data behind it',
  'An enabled interface, an integration user and a test environment',
  'The system-side connector that collects the result, and the fields to hold it',
  'System-side changes where a required field is missing',
  'Finance users for testing, exceptions and sign-off'
];
const BOUNDARY_HUB = [
  'Mapping, XML generation and PINT-OM validation',
  'ASP communication, outcome tracking and retry handling',
  'Secure XML archive and audit trail',
  'Inbound routing, reverse-charge capture and draft delivery',
  'Dashboard, monitoring and central technical operations'
];

/* --- why Fawtara — differentiators (value screen) -------------------------- */
const FAWTARA_VALUE = [
  { k: 'Accredited by the OTA', d: 'A licensed Accredited Service Provider (ASP) — the clearing and reporting leg to Fawtara is ours, not a bolt-on.', ico: 'shield' },
  { k: 'Data residency in Oman', d: 'Invoice data and the legal archive are held in-country. No customer or billing data leaves Oman to be cleared.', ico: 'lock' },
  { k: 'Built for telco volume', d: 'A once-a-day batch carries hundreds of thousands of consumer documents in one window — not one call per recharge.', ico: 'queue' },
  { k: 'One pipe, every stream', d: 'B2B, B2C, prepaid, inbound and reverse-charge all run through one integration and one console.', ico: 'send' },
  { k: 'OTA-interface alignment', d: 'PINT-OM validation before anything is sent, and outcome tracking on all three Peppol legs after.', ico: 'check' },
  { k: 'We bring positions, not questions', d: 'On the unsettled treatments — prepaid, out-of-bundle — Fawtara comes with a recommended reading to take to the OTA.', ico: 'grid' }
];

/* --- helpers --------------------------------------------------------------- */
function tenant(id) { return TENANTS.find(t => t.id === id) || VOD; }
function omr(n) {
  if (n === null || n === undefined) return '—';
  return (n < 0 ? '−' : '') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}
function pct(n) { return n === null || n === undefined ? '—' : n.toFixed(1) + '%'; }
function num(n) { return n === null || n === undefined ? '—' : n.toLocaleString('en-US'); }
function method(m) { return METHODS[m]; }
