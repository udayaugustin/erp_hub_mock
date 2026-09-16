/* ==========================================================================
   Oman Investment Bank — E-Invoicing Hub · demonstration dataset

   WHAT'S REAL: Oman Investment Bank (OIB) is a real, single legal entity —
   Oman's government-owned corporate investment bank, licensed by the Central
   Bank of Oman and the Financial Services Authority, launched February 2024.
   It is a wholesale/corporate bank (advisory, capital markets, transaction
   banking), not a retail bank and not a group of subsidiaries.

   WHAT'S INVENTED: everything else below — the finance ERP and its version,
   OIB's own CR and VATIN, the fictional client, the tracked invoice, every
   amount, timestamp and reference number. None of it is a statement about
   how OIB actually operates or who its clients are. See ../README.md.

   THIS IS A SINGLE-ENTITY SLICE. Unlike the multi-entity mocks in this repo
   (Zubair, Ras Al Hamra, the white-label hub), OIB is one legal entity with
   one VAT registration — there is no VAT-group, no multi-tenant roster, no
   "each entity keeps its own CR" story here. One CR, one VATIN, one Peppol
   participant, one invoice followed end to end.

   Shapes are real: Omani VATIN OM + 10 digits, Peppol participant scheme
   0248, OMR to three decimals, 5% standard VAT, and the real PINT-OM
   business-term identifiers used in the invoice XML.

   Demo clock: Wednesday 19 August 2026, 11:20 GST. Wednesday matters — the
   Omani working week runs Sunday to Thursday, so a busy weekday has to fall
   inside it.
   ========================================================================== */

const DEMO_DATE = '19 Aug 2026';
const DEMO_DAY  = 'Wednesday';
const DEMO_CLOCK = '19 Aug 2026, 11:20 GST';

/* --- the one entity --------------------------------------------------------
   OIB is a single legal entity — one CR, one VATIN, one Peppol participant.
   No shared group registration, no roster of other members. */
const ENTITY = {
  name: 'Oman Investment Bank SAOC', short: 'Oman Investment Bank', mark: 'O',
  city: 'Muscat', country: 'Oman',
  cr: '1245678',
  vatin: 'OM1300456789',
  peppol: '0248:1245678',
  erp: 'Oracle Fusion Financials Cloud', erpVer: '24C',
  regulator: 'Central Bank of Oman (CBO) and the Financial Services Authority (FSA)'
};

/* --- connection method (proposal-style vocabulary, same convention as the
   other mocks in this repo) --------------------------------------------- */
const METHODS = {
  1: { n: 'Method 1 — Direct API', short: 'Direct API',
       how: 'The Hub calls Oracle Fusion Financials Cloud’s standard REST/OData API — no on-site agent, no file exchange.' }
};

/* --- the fictional client on the tracked invoice ---------------------------
   Invented on purpose. This is deliberately NOT any real, disclosed OIB
   transaction or client — see the task brief and README for why. */
const CLIENT = {
  name: 'Nakhal Capital Holding SAOC',
  vatin: 'OM1400998877',
  type: 'B2B', country: 'OM'
};

/* --- the nine outbound stages (generic PINT-OM / ASP pipeline concept,
   shared with every mock in this repo — not specific to any one client) --
   Record (5) is a hot write BEFORE transmission — the only evidence of what
   was attempted if the send fails. Archive is stage 5, i.e. it happens
   before transmission, not after. */
const STAGES = ['ERP invoice', 'Collect & map', 'Build XML', 'Validate',
                'Record', 'ASP / Peppol', 'Track outcome', 'Result published', 'Archive'];
const STAGE_NOTE = [
  'Fee invoice raised in Oracle Fusion Financials Cloud',
  'Apply OIB’s field mapping profile',
  'UBL 2.1 · UUID · QR information',
  'Apply PINT-OM rules before sending',
  'Store XML and audit trail before anything is sent',
  'Transmit the valid XML to the accredited service provider',
  'Acknowledgement and final status, on three separate legs',
  'UUID, status and QR information held on the interface for the ERP to collect',
  'Long-term legal record, with the acknowledgements'
];

/* --- the tracked invoice ---------------------------------------------------
   One advisory/arrangement fee invoice for a capital-markets engagement.
   Net, VAT and total are illustrative, not a real fee schedule. */
const INVOICE = {
  no: 'OIB-ADV-2026-00147',
  desc: 'Advisory & Arrangement Fee — Sukuk Issuance Programme, Series 1',
  buyer: CLIENT.name,
  buyerVatin: CLIENT.vatin,
  po: 'NCH-CM-2026-004',
  issueDate: '19.08.2026',
  dueDate: '18.09.2026',
  currency: 'OMR',
  lines: [
    { desc: 'Advisory fee — Sukuk issuance programme structuring', net: 62000.000 },
    { desc: 'Arrangement fee — placement coordination',            net: 18500.000 },
    { desc: 'Documentation & legal coordination fee',               net: 4500.000 }
  ],
  net: 85000.000,
  vatRate: 5,
  vat: 4250.000,
  total: 89250.000,
  status: 'Posted',
  einvoiceStatus: 'Acknowledged',
  uuid: 'e2a91c47-6b18-4f2d-9a77-3c5e8d1b402f'
};

/* --- three acknowledgement legs, arriving at different times --------------
   This is why the Hub cannot rely on one synchronous response — outcomes
   are asynchronous, on three separate legs. The OTA does not clear or
   reject invoices directly: the ASP validates and may reject, and the ASP
   — not the Hub — reports the Tax Data Document to the OTA. */
const LEGS = [
  { id: 'ack', leg: 'Service provider (ASP) → Hub', name: 'Validated and accepted by the ASP',
    at: '19 Aug 2026 11:20:10.420', el: '+0.4 s', st: 'ok',
    body: 'The ASP confirms the e-invoice was generated and validated. This is custody, not delivery.',
    ref: 'ASP-OM-2026-0819-58204' },
  { id: 'ota', leg: 'Tax Authority → service provider', name: 'Reported to the Tax Authority',
    at: '19 Aug 2026 11:22:47.115', el: '+2 m 37 s', st: 'ok',
    body: 'The ASP reported the Tax Data Document to the OTA and the OTA acknowledged it. The Hub never talks to the OTA directly.',
    ref: 'OTA-RPT-2026-0819-90142' },
  { id: 'deliv', leg: 'Buyer’s provider → service provider', name: 'Delivered to the buyer',
    at: '19 Aug 2026 11:24:15.902', el: '+4 m 5 s', st: 'ok',
    body: 'The buyer’s access point confirmed receipt. This leg is outside OIB’s control and can take hours.',
    ref: 'MLS-DELIVERED' }
];

/* The Peppol transport reference for this document, distinct from the ASP
   acknowledgement and the OTA reporting reference above. */
const PEPPOL_REF = 'PEP-7734-2026';

/* --- validation ------------------------------------------------------------ */
const VALIDATION = {
  profile: 'PINT-OM · Oman CIUS Schematron', ran: '19 Aug 2026 11:20:09 GST', ms: 231,
  passed: 128, failed: 0, warned: 1,
  rules: [
    { st: 'pass', id: 'IBR-001-OM', txt: 'An invoice shall have a Specification identifier (BT-24).' },
    { st: 'pass', id: 'IBR-002-OM', txt: 'An invoice shall have an Invoice number (BT-1).' },
    { st: 'pass', id: 'BTOM-002',   txt: 'Document UUID shall be a deterministic UUIDv5 over seller ID, invoice number and issue date.' },
    { st: 'pass', id: 'IBR-CO-10',  txt: 'Sum of Invoice line net amounts (BT-106) = Σ Invoice line net amount (BT-131).' },
    { st: 'pass', id: 'IBR-CO-15',  txt: 'Invoice total with VAT (BT-112) = Invoice total without VAT (BT-109) + Invoice total VAT (BT-110).' },
    { st: 'pass', id: 'IBR-052-OM', txt: 'Seller VAT identifier shall match the Omani VATIN format OM + 10 digits.' },
    { st: 'warn', id: 'IBR-W-014',  txt: 'Payment means code (BT-81) not supplied — defaulted to 30 (credit transfer).',
      x: 'cac:PaymentMeans/cbc:PaymentMeansCode' }
  ]
};

/* --- processing log, for the tracker screen -------------------------------- */
const LOG = [
  { ts: '11:20:04.010', lv: 'info', txt: 'Fee invoice OIB-ADV-2026-00147 posted in Oracle Fusion Financials Cloud.' },
  { ts: '11:20:06.240', lv: 'info', txt: 'Collected by the Hub — Method 1, Direct API. Raw payload 6.1 KB.' },
  { ts: '11:20:07.880', lv: 'info', txt: 'Mapping profile OIB/v1 applied. UBL 2.1 built.' },
  { ts: '11:20:09.115', lv: 'ok',   txt: 'PINT-OM Schematron validation passed — 128 rules, 1 warning.' },
  { ts: '11:20:09.140', lv: 'info', txt: 'XML and audit trail recorded before transmission.' },
  { ts: '11:20:10.020', lv: 'info', txt: 'Transmitted to the accredited service provider.' },
  { ts: '11:20:10.420', lv: 'ok',   txt: 'Accepted by the ASP — ASP-OM-2026-0819-58204.' },
  { ts: '11:22:47.115', lv: 'ok',   txt: 'Reported to the Tax Authority — OTA-RPT-2026-0819-90142.' },
  { ts: '11:24:15.902', lv: 'ok',   txt: 'Delivered to the buyer’s access point.' },
  { ts: '11:24:17.300', lv: 'info', txt: 'Result published on the Hub interface for the ERP to collect.' }
];

/* --- helpers ---------------------------------------------------------------- */
function omr(n) {
  if (n === null || n === undefined) return '—';
  return (n < 0 ? '−' : '') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}
function num(n) { return n === null || n === undefined ? '—' : n.toLocaleString('en-US'); }
