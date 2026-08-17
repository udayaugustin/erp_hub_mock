/* ==========================================================================
   National Detergent Co E-Invoicing — demonstration dataset

   ONE company: The National Detergent Company SAOG (NDC) — Oman FMCG
   manufacturer (detergents, soaps, personal care; Sulphonation/LABSA; the
   Institutional & Industrial division). The system is deployed on NDC's own
   servers, reading Microsoft Dynamics 365; it runs standalone, with no shared
   roll-up and no other companies in the system.

   TWO invoice origins, ONE pipe to the OTA:
     - Dynamics 365 raises B2B, export, LABSA and I&I invoices natively.
     - FieldAssist van sales (high-volume Simplified B2C) sync INTO Dynamics on
       a schedule. The compliance engine only ever reads Dynamics — nothing is
       installed on the vans. See FIELDASSIST below.

   INVENTED: every VAT and CR number, every volume, failure count, document
   reference and timestamp.

   Counterparties are fictional on purpose — see CUSTOMERS / SUPPLIERS.
   Brand names (Bahar, Pinex, Farah) and the segments are real; the orders
   quoting them are not.

   Shapes are real: Omani VATIN OM + 10 digits, Peppol scheme 0248, OMR to
   3 decimals, 5% standard VAT. FMCG sells by the carton (UNECE code CT) and
   the piece (EA); LABSA bulk sells by the kilogram (KGM).

   Demo clock: Tuesday 28 July 2026, 10:42 GST.
   Tuesday matters — the Omani working week is Sunday to Thursday, so a
   busy weekday has to fall inside it.
   ========================================================================== */

const DEMO_DATE = '28 Jul 2026';
const DEMO_DAY  = 'Tuesday';
const DEMO_CLOCK = '28 Jul 2026, 10:42 GST';

/* --- connection methods (proposal §4) -------------------------------------
   Method is chosen AFTER the ERP inventory. Nothing is assumed. */
const METHODS = {
  1: { n: 'Method 1 — Direct API',        short: 'Direct API',        onsite: 'None',
       use: 'Cloud and API-enabled ERPs',
       how: 'The system calls the ERP standard API.' },
  2: { n: 'Method 2 — On-site agent',     short: 'On-site agent',     onsite: 'Lightweight agent',
       use: 'On-premise and restricted-network ERPs',
       how: 'A lightweight agent connects outward to the compliance service and carries work in both directions. No inbound firewall access is required.' },
  3: { n: 'Method 3 — Secure file transfer', short: 'Secure file transfer', onsite: 'None',
       use: 'Legacy, bespoke or low-interface environments',
       how: 'Scheduled exports and imports use an agreed format and secure location.' }
};

/* --- the company -----------------------------------------------------------
   A single record. Kept as a one-element list so the screens that render it
   need no shape change. NDC runs Microsoft Dynamics 365 over the direct API,
   with van sales fed in from FieldAssist. */
const TENANTS = [
  {
    id: 'NDC', code: 'NDC-001', name: 'The National Detergent Company SAOG', short: 'National Detergent Co',
    sector: 'FMCG manufacturing — detergents & personal care', city: 'Ghala, Muscat', vatin: 'OM1100234567', peppol: '0248:OM1100234567',
    erp: 'Microsoft Dynamics 365', erpVer: 'F&O 10.0.39', method: 1,
    conn: 'Dynamics 365 F&O — Customer invoice (data entity)',
    note: 'Detergents, soaps and personal care (Bahar, Pinex, Farah); the Sulphonation division sells LABSA; the I&I division serves Oil & Gas and Construction. Plants at Sohar, Ghala and Rusayl. Van sales are captured in FieldAssist and synced into Dynamics.',
    status: 'live', health: 'ok', mapped: 45, mapTotal: 47, sync: '2 min ago',
    today: 1180, mtd: 24240, failed: 12, pending: 48, success: 99.0, inbound: true, inToday: 34
  }
];

/* --- company roll-up -------------------------------------------------------
   Today's and month-to-date figures for NDC. Kept under the same name the
   screens already read; it now describes one company, not a group. FMCG
   volumes are dominated by van-sale Simplified invoices. */
const GROUP = {
  name: 'National Detergent Co',
  entities: 1,

  live: 1, onboarding: 0, notStarted: 0,

  /* connection method in use */
  m1: 1, m2: 0, m3: 0, pendingAssessment: 0,

  /* today */
  todayTotal: 1180, todaySuccess: 1120, todayFailed: 12, todayPending: 48,

  /* month to date */
  mtdTotal: 24240, mtdFailed: 292,

  inboundToday: 34,
  aspAvgMs: 380,

  /* Wed 22 → Tue 28 Jul. Friday and Saturday are the Omani weekend. */
  week: [1120, 1210, 90, 60, 1080, 1240, 1180],
  weekDays: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'],
  prevSameDay: 1120
};

/* --- FieldAssist van-sales feed --------------------------------------------
   The second origin. Van reps sell offline to retailers; the FieldAssist app
   syncs to the FieldAssist cloud, which posts the sales into Dynamics on a
   schedule. The compliance engine reads Dynamics only. The ASSUMPTION line is
   load-bearing for the demo — it is the open question we put to NDC.        */
const FIELDASSIST = {
  source: 'FieldAssist',
  connector: 'FieldAssist → Dynamics 365 (scheduled batch)',
  lastSync: '28 Jul 2026 10:30 GST',
  interval: 'Every 30 min · full reconcile at 20:00 (end of day)',
  vansActive: 214, routesToday: 228,
  vanInvoicesToday: 906, syncedToDynamics: 902, awaitingSync: 4,
  note: 'Van reps sell offline; the FieldAssist app syncs to the FieldAssist cloud, which posts the sales into Dynamics on a schedule. The compliance engine only ever reads Dynamics — nothing is installed on the vans.',
  assumption: 'We assume simplified van-sale invoices are reported to the OTA in batch from Dynamics, not cleared live at the point of sale. To confirm with NDC and against the OTA simplified-invoice rules.',
  rows: [
    { van: 'VAN-07 · Ruwi',    rep: 'A. Al-Balushi', invoices: 38, value: 1240.500, synced: true,  at: '10:12' },
    { van: 'VAN-12 · Seeb',    rep: 'K. Nair',       invoices: 44, value: 1655.000, synced: true,  at: '10:12' },
    { van: 'VAN-21 · Sohar',   rep: 'S. Al-Hinai',   invoices: 29, value: 980.250,  synced: true,  at: '10:12' },
    { van: 'VAN-33 · Salalah', rep: 'M. Al-Amri',    invoices: 51, value: 2110.750, synced: true,  at: '10:30' },
    { van: 'VAN-05 · Nizwa',   rep: 'R. George',     invoices: 33, value: 1002.000, synced: false, at: 'in progress' }
  ]
};

/* --- go-live phases --------------------------------------------------------
   How NDC brought e-invoicing on, one capability at a time. Kept under the
   name the onboarding screen already reads. */
const WAVES = [
  { n: 1, name: 'Standard e-invoices from Dynamics', window: 'Live since Mar 2026', entities: 1, live: 1, state: 'complete',
    note: 'B2B, export and I&I invoices, and credit notes, raised in Dynamics 365.' },
  { n: 2, name: 'Van sales via FieldAssist → Dynamics', window: 'Live since May 2026', entities: 1, live: 1, state: 'complete',
    note: 'High-volume Simplified (B2C) invoices, synced from FieldAssist into Dynamics.' },
  { n: 3, name: 'Inbound supplier documents', window: 'Live since Jun 2026', entities: 1, live: 1, state: 'complete',
    note: 'Supplier invoices routed and drafted into Dynamics.' },
  { n: 4, name: 'Reporting & archive', window: 'Live', entities: 1, live: 1, state: 'active',
    note: 'VAT summaries and the long-term compliance archive.' }
];

/* --- counterparties --------------------------------------------------------
   Invented. Deliberately not real trading companies.                        */
const CUSTOMERS = [
  { name: 'Muscat Retail Distributors LLC',   vatin: 'OM1100112233', type: 'B2B', country: 'OM' },
  { name: 'Grand Mall Hypermarkets LLC',      vatin: 'OM1100334455', type: 'B2B', country: 'OM' },
  { name: 'Duqm Refinery Services LLC',       vatin: 'OM1100556677', type: 'B2B', country: 'OM' },
  { name: 'Gulf Home Care FZE',               vatin: 'AE100234567800003', type: 'Export', country: 'AE' },
  { name: 'Batinah Wholesale Trading LLC',    vatin: 'OM1100778899', type: 'B2B', country: 'OM' },
  { name: 'Van route — Ruwi (retail)',        vatin: null,           type: 'B2C', country: 'OM' },
  { name: 'Sohar Construction Group LLC',     vatin: 'OM1100990011', type: 'B2B', country: 'OM' },
  { name: 'Salalah Retail Traders LLC',       vatin: 'OM1100221144', type: 'B2B', country: 'OM' }
];

/* --- suppliers, for the inbound flow ---------------------------------------
   FMCG raw materials, packaging and logistics. Invented.                    */
const SUPPLIERS = [
  { name: 'Gulf Surfactants & Chemicals LLC', vatin: 'OM1100447722', peppol: '0248:OM1100447722' },
  { name: 'Oman Packaging Industries LLC',    vatin: 'OM1100663311', peppol: '0248:OM1100663311' },
  { name: 'Muscat Logistics & Transport LLC', vatin: 'OM1100885544', peppol: '0248:OM1100885544' },
  { name: 'Sohar Port Warehousing LLC',       vatin: 'OM1100119966', peppol: '0248:OM1100119966' }
];

/* --- the nine outbound stages (proposal §5) --------------------------------
   Two different things used to share the name "Archive", and it made the
   order look wrong:

     Record (5)   a hot write to the operational store, BEFORE transmission.
                  It has to come first — if the send fails, this is the only
                  evidence of what was attempted, and it is what answers an
                  auditor asking "show me exactly what you submitted".
     Archive (9)  the long-term legal record in object storage. Cold, kept
                  for years, and it contains the ASP acknowledgements — which
                  do not exist until the round trip has finished. It cannot
                  be written before the outcome arrives.

   The proposal draws Archive as a datastore fed by both flows and lists it
   last in the platform's own function order (§ "map → convert → validate →
   UUID/QR → send → track → archive"). It never enumerates eight stages —
   that was this mock's invention.                                          */
const STAGES = ['ERP invoice', 'Collect & map', 'Build XML', 'Validate',
                'Record', 'ASP / Peppol', 'Track outcome', 'Result published', 'Archive'];
const STAGE_SHORT = ['ERP', 'Map', 'XML', 'Validate', 'Record', 'Send', 'Outcome', 'Result', 'Archive'];
const STAGE_NOTE = [
  'Invoice and credit-note data',
  'Apply the mapping profile',
  'UBL 2.1 · UUID · QR information',
  'Apply PINT-OM rules before sending',
  'Store XML and audit trail before anything is sent',
  'Transmit the valid XML',
  'Acknowledgement and final status',
  'UUID, status and QR held on the interface for the ERP to collect',
  'Long-term legal record, with the acknowledgements'
];

/* documents in flight, by stage — sums to GROUP.todayPending (48) */
const STAGE_COUNT = [12, 9, 8, 7, 6, 4, 2];

/* --- the six inbound stages (proposal §5) ---------------------------------- */
const IN_STAGES = ['Supplier sends', 'Route to company', 'Validate',
                   'Archive original', 'Create draft', 'Finance review'];
const IN_STAGE_NOTE = [
  'Document arrives via ASP / Peppol',
  'Match participant ID to the company',
  'Structure, identity and content checks',
  'Preserve the legal XML record',
  'Draft purchase invoice in the ERP',
  'Finance reviews and posts manually'
];

/* Three acknowledgements, on three separate legs, arriving at different times.
   This is why the system cannot rely on one synchronous response.           */
const LEGS = [
  { id: 'ack',   leg: 'Service provider → system', name: 'Validated and accepted by the ASP',
    at: '28 Jul 2026 09:14:07.633', el: '+0.4 s', st: 'ok',
    body: 'The ASP confirms the e-invoice was generated and validated. This is custody, not delivery.',
    ref: 'ASP-OM-2026-0728-31184' },
  { id: 'ota',   leg: 'Tax Authority → service provider', name: 'Reported to the Tax Authority',
    at: '28 Jul 2026 09:15:52.400', el: '+1 m 45 s', st: 'ok',
    body: 'The ASP reported the Tax Data Document to Fawtara and the OTA acknowledged it. The system never talks to the OTA directly.',
    ref: 'OTA-RPT-2026-0728-51170' },
  { id: 'deliv', leg: 'Buyer’s provider → service provider', name: 'Delivered to the buyer',
    at: '28 Jul 2026 09:16:41.008', el: '+2 m 34 s', st: 'ok',
    body: 'The buyer’s access point confirmed receipt. This leg is outside the company’s control and can take hours.',
    ref: 'MLS-DELIVERED' }
];

/* A second document, still waiting on two of the three legs — so the
   asynchronous point is visible rather than merely asserted.                */
const LEGS_PENDING = [
  { id: 'ack',   name: 'Validated and accepted by the ASP', at: '28 Jul 2026 10:02:14.880', st: 'ok',
    body: 'Receipt issued 0.4 s after submission.' },
  { id: 'ota',   name: 'Reported to the Tax Authority',     at: 'awaiting', st: 'pending',
    body: 'Within the reporting window. No action required.' },
  { id: 'deliv', name: 'Delivered to the buyer',            at: 'awaiting', st: 'pending',
    body: 'The buyer’s access point has not yet confirmed. Retried automatically by the ASP.' }
];

/* --- outbound documents ----------------------------------------------------
   stage indexes into STAGES; state: ok | active | failed | held
   origin: dynamics | fieldassist — where the document was raised. Van sales
   (Simplified, B2C) come from FieldAssist and are synced into Dynamics; every
   other document is native Dynamics. A representative sample of today's flow:
   many small van-sale Simplified invoices, some B2B/I&I and export invoices,
   and a credit note.                                                        */
const INVOICES = [
  { no: 'NDC-CIV-2026-08841', tenant: 'NDC', origin: 'dynamics', cust: 0, net: 4820.000, vat: 241.000, total: 5061.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '28 Jul 09:14:02',
    uuid: 'a4e91b73-2c6d-5f80-9b4a-1e7c3d05f862', ackNo: 'ASP-OM-2026-0728-31184', ref: 'PEP-5117-2026',
    lines: 14, po: 'PO-3341' },
  { no: 'NDC-CIV-2026-08842', tenant: 'NDC', origin: 'dynamics', cust: 2, net: 18600.000, vat: 930.000, total: 19530.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '28 Jul 09:21:47',
    uuid: 'b5f02c84-3d7e-6a91-8c5b-2f8d4e16a973', ackNo: 'ASP-OM-2026-0728-31185', ref: 'PEP-5118-2026',
    lines: 6, po: 'PO-3348' },
  { no: 'NDC-CIV-2026-08843', tenant: 'NDC', origin: 'dynamics', cust: 3, net: 32400.000, vat: 0.000, total: 32400.000,
    cur: 'OMR', type: 'Invoice', scen: 'Export', stage: 6, state: 'active', retry: 0, created: '28 Jul 10:02:11',
    uuid: 'c6a13d95-4e8f-7b02-9d6c-3a9e5f27b084', ackNo: 'ASP-OM-2026-0728-31207', ref: 'PEP-5126-2026',
    lines: 8, po: 'PO-1190', awaiting: 'OTA report · buyer delivery' },
  { no: 'NDC-CRN-2026-00218', tenant: 'NDC', origin: 'dynamics', cust: 1, net: -1260.000, vat: -63.000, total: -1323.000,
    cur: 'OMR', type: 'Credit Note', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '28 Jul 10:26:14',
    uuid: 'f9d46a28-7b12-0e35-c09f-6d218c50e317', ackNo: 'ASP-OM-2026-0728-31196', ref: 'PEP-5133-2026',
    lines: 3, po: null, against: 'NDC-CIV-2026-08790' },
  { no: 'NDC-VAN-2026-51188', tenant: 'NDC', origin: 'fieldassist', cust: 5, net: 214.500, vat: 10.725, total: 225.225,
    cur: 'OMR', type: 'Simplified', scen: 'B2C', stage: 8, state: 'ok', retry: 0, created: '28 Jul 08:14:33',
    uuid: '4e291f73-2067-5d80-b5e4-b2763195d862', ackNo: 'ASP-OM-2026-0728-31162', ref: 'PEP-5101-2026',
    lines: 22, po: null },
  { no: 'NDC-VAN-2026-51189', tenant: 'NDC', origin: 'fieldassist', cust: 5, net: 88.400, vat: 4.420, total: 92.820,
    cur: 'OMR', type: 'Simplified', scen: 'B2C', stage: 8, state: 'ok', retry: 0, created: '28 Jul 10:18:52',
    uuid: '0ae57b39-8c23-1f46-d1a0-7e329d61f428', ackNo: 'ASP-OM-2026-0728-31191', ref: 'PEP-5129-2026',
    lines: 9, po: null },
  { no: 'NDC-VAN-2026-51190', tenant: 'NDC', origin: 'fieldassist', cust: 5, net: 342.000, vat: 17.100, total: 359.100,
    cur: 'OMR', type: 'Simplified', scen: 'B2C', stage: 2, state: 'active', retry: 0, created: '28 Jul 10:31:09',
    uuid: '2c079d51-0e45-3b68-f3c2-90541f83b640', ackNo: null, ref: null, lines: 31, po: null },
  { no: 'NDC-CIV-2026-08844', tenant: 'NDC', origin: 'dynamics', cust: 4, net: 9650.000, vat: 482.500, total: 10132.500,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 1, state: 'active', retry: 0, created: '28 Jul 10:38:56',
    uuid: null, ackNo: null, ref: null, lines: 12, po: 'PO-3352' },
  { no: 'NDC-CIV-2026-08845', tenant: 'NDC', origin: 'dynamics', cust: 6, net: 27400.000, vat: 1370.000, total: 28770.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 4, state: 'ok', retry: 0, created: '28 Jul 10:22:30',
    uuid: '1bf68c40-9d34-2a57-e2b1-8f430e72a539', ackNo: null, ref: null, lines: 5, po: 'PO-0907' },
  { no: 'NDC-CIV-2026-08830', tenant: 'NDC', origin: 'dynamics', cust: 2, net: 6120.000, vat: 306.000, total: 6426.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 3, state: 'failed', retry: 2, created: '28 Jul 10:11:38',
    uuid: 'd7b24e06-5f90-8c13-ae7d-4b0f6a38c195', ackNo: null, ref: null, lines: 4, po: null,
    owner: 'company' },
  { no: 'NDC-CIV-2026-08846', tenant: 'NDC', origin: 'dynamics', cust: 1, net: 41500.000, vat: 2075.000, total: 43575.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 3, state: 'active', retry: 0, created: '28 Jul 10:14:05',
    uuid: 'e8c35f17-6a01-9d24-bf8e-5c107b49d206', ackNo: null, ref: null, lines: 8, po: 'PO-2214' },
  { no: 'NDC-VAN-2026-51170', tenant: 'NDC', origin: 'fieldassist', cust: 5, net: 156.000, vat: 7.800, total: 163.800,
    cur: 'OMR', type: 'Simplified', scen: 'B2C', stage: 5, state: 'failed', retry: 4, created: '28 Jul 08:52:20',
    uuid: '3d180e62-1f56-4c79-a4d3-a1652094c751', ackNo: null, ref: null, lines: 12, po: null,
    owner: 'support' }
];

/* --- inbound supplier documents (proposal §5 inbound) ----------------------- */
const INBOUND = [
  { no: 'GSC-INV-2026-04412', supplier: 0, to: 'NDC', recv: '28 Jul 10:29:16', net: 18640.000,
    vat: 932.000, total: 19572.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00318',
    erpState: 'Draft — awaiting review', lines: 14, po: 'PO-3310' },
  { no: 'OPI-INV-2026-00733', supplier: 1, to: 'NDC', recv: '28 Jul 10:24:03', net: 21500.000,
    vat: 1075.000, total: 22575.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00316',
    erpState: 'Draft — awaiting review', lines: 6, po: 'PO-3299' },
  { no: 'MLT-INV-2026-02180', supplier: 2, to: 'NDC', recv: '28 Jul 10:19:48', net: 3180.000,
    vat: 159.000, total: 3339.000, stage: 4, state: 'active', erpRef: null,
    erpState: 'Creating draft', lines: 3, po: null },
  { no: 'SPW-INV-2026-01277', supplier: 3, to: 'NDC', recv: '28 Jul 10:12:31', net: 14200.000,
    vat: 710.000, total: 14910.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00317',
    erpState: 'Draft — awaiting review', lines: 9, po: 'PO-3304' },
  { no: 'GSC-CRN-2026-00118', supplier: 0, to: 'NDC', recv: '28 Jul 09:58:02', net: -1250.000,
    vat: -62.500, total: -1312.500, stage: 5, state: 'ok', erpRef: 'PCRN-2026-00024',
    erpState: 'Draft — awaiting review', lines: 1, po: null, credit: true },
  { no: 'UNK-INV-2026-00051', supplier: null, to: null, recv: '28 Jul 09:41:19', net: 990.000,
    vat: 49.500, total: 1039.500, stage: 1, state: 'failed', erpRef: null,
    erpState: 'Held — cannot route', lines: 2, po: null,
    err: 'Participant 0248:OM1100777001 does not match this company.',
    owner: 'support' }
];

/* --- the archive (proposal §6) ---------------------------------------------
   Six stored items. No retention period is stated: the proposal reserves it. */
const ARCHIVE_ITEMS = [
  { item: 'Generated UBL XML',                  why: 'The official compliance document created from ERP invoice data.', size: '8.9 KB' },
  { item: 'UUID and QR information',            why: 'Unique identity and invoice verification information.',           size: '312 B' },
  { item: 'Submission and outcome timestamps',  why: 'The complete processing timeline.',                               size: '1.1 KB' },
  { item: 'ASP acknowledgements and final status', why: 'Evidence of receipt, delivery or rejection.',                  size: '2.4 KB' },
  { item: 'Validation results and audit history', why: 'Traceability for corrections, support and audit.',              size: '6.2 KB' },
  { item: 'Inbound original XML',               why: 'The preserved legal record, kept before the ERP draft is created.', size: '—' }
];

/* --- ERP-side invoice list (screen 1) --------------------------------------
   The Dynamics 365 customer-invoice list. eStatus is the e-invoicing state
   the connector writes back. Van-sale invoices (NDC-VAN-…) arrived here from
   FieldAssist; the rest are raised in Dynamics directly.                    */
const ERP_INVOICES = [
  { no: 'NDC-CIV-2026-08841', cust: 'Muscat Retail Distributors LLC', date: '28-07-2026', due: '27-08-2026',
    net: 4820.000, vat: 241.000, total: 5061.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'a4e91b73…f862', qr: true },
  { no: 'NDC-CIV-2026-08842', cust: 'Duqm Refinery Services LLC', date: '28-07-2026', due: '27-08-2026',
    net: 18600.000, vat: 930.000, total: 19530.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'b5f02c84…a973', qr: true },
  { no: 'NDC-VAN-2026-51190', cust: 'Van route — Ruwi (retail)', date: '28-07-2026', due: '—',
    net: 342.000, vat: 17.100, total: 359.100, docStatus: 'Posted', eStatus: 'In Progress',
    ready: true, uuid: null, qr: false },
  { no: 'NDC-CRN-2026-00218', cust: 'Grand Mall Hypermarkets LLC', date: '28-07-2026', due: '—',
    net: -1260.000, vat: -63.000, total: -1323.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'f9d46a28…e317', qr: false, credit: true },
  { no: 'NDC-CIV-2026-08844', cust: 'Batinah Wholesale Trading LLC', date: '28-07-2026', due: '27-08-2026',
    net: 9650.000, vat: 482.500, total: 10132.500, docStatus: 'Posted', eStatus: 'In Progress',
    ready: true, uuid: null, qr: false },
  { no: 'NDC-CIV-2026-08838', cust: 'Sohar Construction Group LLC', date: '27-07-2026', due: '26-08-2026',
    net: 51200.000, vat: 2560.000, total: 53760.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: '5f3a2084…c973', qr: true },
  { no: 'NDC-CIV-2026-08829', cust: 'Grand Mall Hypermarkets LLC', date: '27-07-2026', due: '26-08-2026',
    net: 7300.000, vat: 365.000, total: 7665.000, docStatus: 'Posted', eStatus: 'Rejected by ASP',
    ready: true, uuid: '6a4b3195…d084', qr: false }
];

/* --- mapping: what the ERP actually exposes --------------------------------
   The source list an analyst picks from. This profile belongs to NDC
   (Microsoft Dynamics 365 F&O), so the field names are the real customer-
   invoice data-entity names — the same vocabulary the generated PINT-OM field
   set sources from. 612 fields are discovered; these are the ones that matter
   for billing. OriginSystem tells van sales (FieldAssist) from native.      */
const ERP_SCHEMA = [
  { f: 'InvoiceId',                   t: 'string',  ex: 'NDC-CIV-2026-08841' },
  { f: 'InvoiceDate',                 t: 'date',    ex: '2026/07/28' },
  { f: 'DocumentType',                t: 'string',  ex: 'Invoice' },
  { f: 'CreditNote',                  t: 'boolean', ex: 'No' },
  { f: 'CurrencyCode',                t: 'string',  ex: 'OMR' },
  { f: 'DataAreaId',                  t: 'string',  ex: 'ndc' },
  { f: 'CompanyTaxRegistrationNumber', t: 'string', ex: '1100234567' },
  { f: 'CompanyCity',                 t: 'string',  ex: 'Ghala' },
  { f: 'CompanyCountryRegionId',      t: 'string',  ex: 'OMN' },
  { f: 'InvoiceAccount',              t: 'string',  ex: 'CUST-004120' },
  { f: 'InvoicingName',               t: 'string',  ex: '  muscat retail distributors llc ' },
  { f: 'CustTaxRegistrationNumber',   t: 'string',  ex: '1100112233' },
  { f: 'DeliveryCountryRegionId',     t: 'string',  ex: 'OMN' },
  { f: 'DeliveryStreet',              t: 'string',  ex: '(empty in this ERP)' },
  { f: 'SalesBalance',                t: 'decimal', ex: '4820.00' },
  { f: 'SumTax',                      t: 'decimal', ex: '241.00' },
  { f: 'InvoiceAmount',               t: 'decimal', ex: '5061.00' },
  { f: 'Outstanding',                 t: 'decimal', ex: '5061.00' },
  { f: 'TaxValue',                    t: 'decimal', ex: '5.0' },
  { f: 'SalesLine.ItemId',            t: 'string',  ex: 'BHR-DP-5KG' },
  { f: 'SalesLine.Name',              t: 'string',  ex: 'Bahar Detergent Powder 5kg carton' },
  { f: 'SalesLine.SalesQty',          t: 'decimal', ex: '40.000' },
  { f: 'SalesLine.SalesUnit',         t: 'string',  ex: 'CT' },
  { f: 'SalesLine.SalesPrice',        t: 'decimal', ex: '4.250' },
  { f: 'CustomerRef',                 t: 'string',  ex: 'PO-3341' },
  { f: 'PaymTermId',                  t: 'string',  ex: 'Net30' },
  { f: 'OriginSystem',                t: 'string',  ex: 'Dynamics · FieldAssist for van sales' }
];

/* transforms an analyst can apply */
const TRANSFORMS = [
  { v: '',                   n: 'Copy as-is' },
  { v: 'trim',               n: 'trim — remove surrounding spaces' },
  { v: 'trim|upper',         n: 'trim | upper — trim then upper-case' },
  { v: 'date:ISO8601',       n: 'date:ISO8601 — yyyy/mm/dd to yyyy-mm-dd' },
  { v: 'decimal:3',          n: 'decimal:3 — force three decimal places' },
  { v: 'decimal:4',          n: 'decimal:4 — force four decimal places' },
  { v: 'codelist:UNCL1001',  n: 'codelist:UNCL1001 — map to document type code' },
  { v: 'codelist:UNECE20',   n: 'codelist:UNECE20 — map to unit of measure' },
  { v: 'iso:alpha2',         n: 'iso:alpha2 — country to two-letter code' },
  { v: 'prefix:OM',          n: 'prefix:OM — prepend the country prefix' },
  { v: 'lookup:company',     n: 'lookup:company — resolve from the company master' },
  { v: 'map:381',            n: 'map:381 — flag as credit note' },
  { v: 'pct',                n: 'pct — percentage as a number' },
  { v: 'nullable',           n: 'nullable — allow an empty value' },
  { v: 'derive:uuidv5',      n: 'derive:uuidv5 — generated by the system' },
  { v: 'derive:0248',        n: 'derive:0248 — build the Peppol participant ID' },
  { v: 'derive:txntype',     n: 'derive:txntype — Standard or Simplified' },
  { v: 'derive:itemkind',    n: 'derive:itemkind — goods or services, from the item group' },
  { v: 'const',              n: 'const — the same value on every document' },
  { v: 'const:0248',         n: 'const:0248 — fixed scheme identifier' },
  { v: 'const:VAT',          n: 'const:VAT — fixed tax scheme' }
];

/* --- mapping profile -------------------------------------------------------
   45 of 47 resolved: two fields the ERP does not expose.                    */
const MAPPING = [
  { grp: 'Document header', rows: [
    { erp: 'InvoiceId',              std: 'BT-1',  stdName: 'Invoice number',        xf: '',            req: 'Mandatory', ok: true },
    { erp: 'InvoiceDate',            std: 'BT-2',  stdName: 'Issue date',            xf: 'date:ISO8601',req: 'Mandatory', ok: true },
    { erp: 'DocumentType',           std: 'BT-3',  stdName: 'Invoice type code',     xf: 'codelist:UNCL1001', req: 'Mandatory', ok: true },
    { erp: 'CurrencyCode',           std: 'BT-5',  stdName: 'Document currency',     xf: '',            req: 'Mandatory', ok: true },
    { erp: 'CreditNote',             std: 'BT-3',  stdName: 'Credit note flag',      xf: 'map:381',     req: 'Conditional', ok: true },
    { erp: '—',                      std: 'BTOM-002', stdName: 'Document UUID',      xf: 'derive:uuidv5', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Built from the invoice number, the seller VAT identifier and the issue date. Stable — a resubmission of the same invoice produces the same UUID.' },
    { erp: '—',                      std: 'BTOM-001', stdName: 'Invoice transaction type', xf: 'derive:txntype', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Standard or Simplified, decided from whether the buyer carries a VAT registration. Van-sale (FieldAssist) documents resolve to Simplified.' },
    { erp: '—',                      std: 'IBT-023', stdName: 'Business process type', xf: 'const', req: 'Mandatory', ok: true, derived: true, constant: true,
      dnote: 'urn:peppol:bis:billing — identical on every document.' },
    { erp: '—',                      std: 'IBT-024', stdName: 'Specification identifier', xf: 'const', req: 'Mandatory', ok: true, derived: true, constant: true,
      dnote: 'urn:peppol:pint:billing-1@om-1 — declares the OM-1.1 ruleset the document is validated against.' }
  ]},
  { grp: 'Seller party', rows: [
    { erp: 'DataAreaId',             std: 'BT-27', stdName: 'Seller name',           xf: 'lookup:company', req: 'Mandatory', ok: true },
    { erp: 'CompanyTaxRegistrationNumber', std: 'BT-31', stdName: 'Seller VAT identifier', xf: 'prefix:OM', req: 'Mandatory', ok: true },
    { erp: '—',                      std: 'BTOM-004', stdName: 'Seller participant ID', xf: 'derive:0248', req: 'Mandatory', ok: true, derived: true,
      dnote: 'The VAT identifier expressed as a Peppol participant under scheme 0248, so the network can route to this company.' },
    { erp: '—',                      std: 'IBT-034-1', stdName: 'Seller address scheme id', xf: 'const:0248', req: 'Mandatory', ok: true, derived: true, constant: true,
      dnote: 'Names the scheme the seller electronic address belongs to. Fixed for Oman.' },
    { erp: 'CompanyCity',            std: 'BT-37', stdName: 'Seller city',           xf: '',            req: 'Mandatory', ok: true },
    { erp: 'CompanyCountryRegionId', std: 'BT-40', stdName: 'Seller country code',   xf: 'iso:alpha2',  req: 'Mandatory', ok: true }
  ]},
  { grp: 'Buyer party', rows: [
    { erp: 'InvoiceAccount',         std: 'BT-46', stdName: 'Buyer identifier',      xf: '',            req: 'Mandatory', ok: true },
    { erp: 'InvoicingName',          std: 'BT-44', stdName: 'Buyer name',            xf: 'trim|upper',  req: 'Mandatory', ok: true },
    { erp: 'CustTaxRegistrationNumber', std: 'BT-48', stdName: 'Buyer VAT identifier', xf: 'nullable',  req: 'Conditional', ok: true },
    { erp: 'DeliveryCountryRegionId', std: 'BT-55', stdName: 'Buyer country code',    xf: 'iso:alpha2',  req: 'Mandatory', ok: true },
    { erp: '',                       std: 'BT-50', stdName: 'Buyer address line 1',  xf: '',            req: 'Mandatory', ok: false,
      fallback: 'Address held in the company master',
      note: 'DeliveryStreet is present in the ERP but empty on every record.' }
  ]},
  { grp: 'Monetary totals', rows: [
    { erp: 'SalesBalance',           std: 'BT-109', stdName: 'Sum of line net amounts', xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'SumTax',                 std: 'BT-110', stdName: 'Invoice total VAT amount', xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'InvoiceAmount',          std: 'BT-112', stdName: 'Invoice total with VAT',  xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'Outstanding',            std: 'BT-115', stdName: 'Amount due for payment',  xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'TaxValue',               std: 'BT-119', stdName: 'VAT category rate',       xf: 'pct',       req: 'Mandatory', ok: true },
    { erp: '—',                      std: 'IBT-118-1', stdName: 'Tax scheme code',       xf: 'const:VAT', req: 'Mandatory', ok: true, derived: true, constant: true,
      dnote: 'Always VAT for Oman. The ERP does not need to carry a tax scheme code at all.' }
  ]},
  { grp: 'Line items', rows: [
    { erp: 'SalesLine.ItemId',       std: 'BT-155', stdName: 'Item seller identifier', xf: '',          req: 'Mandatory', ok: true },
    { erp: 'SalesLine.Name',         std: 'BT-153', stdName: 'Item name',              xf: 'trim',      req: 'Mandatory', ok: true },
    { erp: 'SalesLine.SalesQty',     std: 'BT-129', stdName: 'Invoiced quantity',      xf: 'decimal:4', req: 'Mandatory', ok: true },
    { erp: 'SalesLine.SalesUnit',    std: 'BT-130', stdName: 'Unit of measure code',   xf: 'codelist:UNECE20', req: 'Mandatory', ok: true },
    { erp: 'SalesLine.SalesPrice',   std: 'BT-146', stdName: 'Item net price',         xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: '',                       std: 'BT-158', stdName: 'Item classification code', xf: '',        req: 'Optional',  ok: false,
      fallback: 'Left empty — optional under the standard',
      note: 'Not held anywhere in this ERP. Optional, so it does not block submission.' },
    { erp: '—',                      std: 'BTOM-019', stdName: 'Goods or services indicator', xf: 'derive:itemkind', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Read from the item group on each line. Lines that resolve to neither are held for review rather than guessed.' }
  ]}
];

/* --- validation ------------------------------------------------------------ */
const VALIDATION = {
  profile: 'PINT-OM · Oman CIUS Schematron', ran: '28 Jul 2026 10:22:31 GST', ms: 284,
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
    { st: 'warn', id: 'IBR-W-031',  txt: 'Buyer address line 1 (BT-50) sourced from the fallback mapping — field not exposed by the ERP.',
      x: 'cac:AccountingCustomerParty/cac:Party/cac:PostalAddress/cbc:StreetName' }
  ]
};

const VALIDATION_FAILED = {
  profile: 'PINT-OM · Oman CIUS Schematron', ran: '28 Jul 2026 10:11:52 GST', ms: 261,
  passed: 143, failed: 2, warned: 1,
  rules: [
    { st: 'fail', id: 'IBR-053-OM', txt: 'Buyer VAT identifier (BT-48) is absent and no substitute participant ID was derived.',
      x: 'cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/cbc:CompanyID' },
    { st: 'fail', id: 'IBR-CO-15',  txt: 'Invoice total with VAT (BT-112) does not equal BT-109 + BT-110. Expected 6426.000, found 6425.000.',
      x: 'cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount' },
    { st: 'warn', id: 'IBR-W-014',  txt: 'Payment means code (BT-81) not supplied — defaulted to 30 (credit transfer).',
      x: 'cac:PaymentMeans/cbc:PaymentMeansCode' },
    { st: 'pass', id: 'IBR-001-OM', txt: 'An invoice shall have a Specification identifier (BT-24).' },
    { st: 'pass', id: 'IBR-002-OM', txt: 'An invoice shall have an Invoice number (BT-1).' }
  ]
};

/* --- processing logs -------------------------------------------------------- */
const LOGS = [
  { ts: '10:22:28.114', lv: 'info', txt: 'Poll tick — National Detergent Co, watermark 2026-07-28T10:21:44Z' },
  { ts: '10:22:28.291', lv: 'info', txt: 'Fetched raw payload · 14.2 KB · 27 fields (allowlist applied)' },
  { ts: '10:22:28.402', lv: 'ok',   txt: 'Idempotency check passed — NDC-CIV-2026-08845 not previously seen' },
  { ts: '10:22:28.556', lv: 'info', txt: 'Mapping profile v6 applied — 45 of 47 fields resolved' },
  { ts: '10:22:28.703', lv: 'info', txt: 'Scenario detected: B2B domestic · standard rate 5%' },
  { ts: '10:22:28.844', lv: 'ok',   txt: 'BTOM-002 UUID derived — 1bf68c40-9d34-2a57-e2b1-8f430e72a539' },
  { ts: '10:22:29.017', lv: 'info', txt: 'UBL 2.1 Invoice built · 8.9 KB · 5 lines' },
  { ts: '10:22:29.188', lv: 'info', txt: 'Oman CIUS Schematron — evaluating 150 assertions' },
  { ts: '10:22:31.472', lv: 'warn', txt: 'IBR-W-014 · payment means defaulted to 30' },
  { ts: '10:22:31.474', lv: 'ok',   txt: 'Validation passed — 148 passed, 0 failed, 2 warnings (284 ms)' },
  { ts: '10:22:31.610', lv: 'ok',   txt: 'Archived — XML, validation report and audit trail written before transmission' },
  { ts: '10:22:31.788', lv: 'ok',   txt: 'State → READY_FOR_ASP · queued for transmission' }
];

/* --- ASP exchange ----------------------------------------------------------- */
const ASP = {
  provider: 'Accredited Service Provider — OTA licence ASP-OM-014',
  endpoint: 'https://ap.asp-oman.om/peppol/v1/documents',
  auth: 'mTLS · client certificate held in the company vault',
  sentAt: '28 Jul 2026 09:14:07.221 GST',
  ackAt:  '28 Jul 2026 09:14:07.633 GST',
  otaAt:  '28 Jul 2026 09:15:52.400 GST',
  mlsAt:  '28 Jul 2026 09:16:41.008 GST',
  rtt: 341,
  http: '202 Accepted',
  ref: 'PEP-5117-2026',
  ackNo: 'ASP-OM-2026-0728-31184',
  otaRef: 'OTA-RPT-2026-0728-51170',
  msgId: 'urn:uuid:a4e91b73-2c6d-5f80-9b4a-1e7c3d05f862',
  sender: '0248:OM1100234567',
  receiver: '0248:OM1100112233',
  docType: 'Peppol PINT billing — Oman',
  process: 'Peppol BIS billing'
};

/* --- history ---------------------------------------------------------------- */
const HISTORY = [
  { no: 'NDC-CIV-2026-08841', tenant: 'NDC', date: '28 Jul 09:14', total: 5061.000, type: 'Invoice',  dir: 'out', st: 'success', ack: 'ASP-OM-2026-0728-31184', retries: 0 },
  { no: 'NDC-CIV-2026-08842', tenant: 'NDC', date: '28 Jul 09:21', total: 19530.000, type: 'Invoice', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0728-31185', retries: 0 },
  { no: 'NDC-VAN-2026-51188', tenant: 'NDC', date: '28 Jul 08:14', total: 225.225, type: 'Simplified', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0728-31162', retries: 0 },
  { no: 'NDC-VAN-2026-51170', tenant: 'NDC', date: '28 Jul 08:52', total: 163.800, type: 'Simplified',  dir: 'out', st: 'failed',  ack: null, retries: 4, err: 'ASP timeout — transient, retrying' },
  { no: 'NDC-CRN-2026-00218', tenant: 'NDC', date: '28 Jul 10:26', total: -1323.000, type: 'Credit Note', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0728-31196', retries: 0 },
  { no: 'GSC-INV-2026-04412',  tenant: 'NDC', date: '28 Jul 10:29', total: 19572.000, type: 'Supplier invoice', dir: 'in', st: 'success', ack: 'PINV-2026-00318', retries: 0 },
  { no: 'OPI-INV-2026-00733',  tenant: 'NDC', date: '28 Jul 10:24', total: 22575.000, type: 'Supplier invoice', dir: 'in', st: 'success', ack: 'PINV-2026-00316', retries: 0 },
  { no: 'NDC-VAN-2026-51189', tenant: 'NDC', date: '28 Jul 10:18', total: 92.820, type: 'Simplified',  dir: 'out', st: 'success', ack: 'ASP-OM-2026-0728-31191', retries: 0 },
  { no: 'NDC-CIV-2026-08830', tenant: 'NDC', date: '28 Jul 10:11', total: 6426.000, type: 'Invoice',   dir: 'out', st: 'failed',  ack: null, retries: 2, err: 'IBR-CO-15 · total mismatch' },
  { no: 'NDC-CIV-2026-08815', tenant: 'NDC', date: '28 Jul 07:40', total: 44210.000, type: 'Invoice',  dir: 'out', st: 'reprocessed', ack: 'ASP-OM-2026-0728-31148', retries: 1 },
  { no: 'NDC-CIV-2026-08829', tenant: 'NDC', date: '27 Jul 16:22', total: 7665.000, type: 'Invoice',   dir: 'out', st: 'rejected', ack: null, retries: 0, err: 'ASP rejected — buyer participant not registered' },
  { no: 'GSC-CRN-2026-00118',  tenant: 'NDC', date: '28 Jul 09:58', total: -1312.500, type: 'Supplier credit note', dir: 'in', st: 'success', ack: 'PCRN-2026-00024', retries: 0 },
  { no: 'NDC-CIV-2026-08843', tenant: 'NDC', date: '28 Jul 10:02', total: 32400.000, type: 'Invoice',  dir: 'out', st: 'pending', ack: null, retries: 0 },
  { no: 'NDC-CIV-2026-08845', tenant: 'NDC', date: '28 Jul 10:22', total: 28770.000, type: 'Invoice',  dir: 'out', st: 'pending', ack: null, retries: 0 },
  { no: 'NDC-CIV-2026-08838', tenant: 'NDC', date: '27 Jul 14:11', total: 53760.000, type: 'Invoice',  dir: 'out', st: 'success', ack: 'ASP-OM-2026-0727-31094', retries: 0 }
];

/* --- reporting -------------------------------------------------------------
   Month to date, July 2026, for NDC, broken down by document type. The docs
   column sums to GROUP.mtdTotal (24240), the failed column to GROUP.mtdFailed
   (292), and VAT is (net − zero-rated) × 5% on every row. Simplified (van
   sales) dominates the volume; Standard invoices dominate the value.        */
const REPORT_ROWS = [
  { id: 'INV',  label: 'Standard invoices',    docs: 3200,  net: 6400000.000, vat: 320000.000, zero: 0.000,      failed: 58,  ack: 3142 },
  { id: 'EXP',  label: 'Exports (zero-rated)', docs: 340,   net: 680000.000,  vat: 0.000,      zero: 680000.000, failed: 9,   ack: 331 },
  { id: 'SIMP', label: 'Simplified (van sales)', docs: 19800, net: 990000.000, vat: 49500.000, zero: 0.000,      failed: 210, ack: 19590 },
  { id: 'CRN',  label: 'Credit notes',         docs: 900,   net: 180000.000,  vat: 9000.000,   zero: 0.000,      failed: 15,  ack: 885 }
];

const REPORT_TYPES = [
  { n: 'VAT summary',                  d: 'Net, VAT and zero-rated totals for a period.', tag: 'Finance' },
  { n: 'Reporting completeness',       d: 'Documents raised in the ERP against documents acknowledged by the ASP.', tag: 'Compliance' },
  { n: 'Exception ageing',             d: 'Open failures by age and by who owns the fix.', tag: 'Operations' },
  { n: 'Document type breakdown',      d: 'Standard invoices, exports, van-sale simplified documents and credit notes.', tag: 'Finance' },
  { n: 'Van-sales reconciliation',     d: 'FieldAssist van invoices synced into Dynamics against documents reported to the OTA.', tag: 'Operations' },
  { n: 'Inbound supplier documents',   d: 'Received, routed, drafted and still awaiting review.', tag: 'Operations' }
];

/* --- users and access (proposal §7) ---------------------------------------- */
const ROLES = [
  { k: 'admin',    n: 'Administrator', d: 'Adds colleagues, sets roles, manages the ERP connection and mapping, receives the compliance digest.' },
  { k: 'finance',  n: 'Finance user',  d: 'Sees documents, resolves data exceptions, reprocesses.' },
  { k: 'readonly', n: 'Read-only',     d: 'Views documents and reports. Cannot act on anything.' }
];

const ENTITY_USERS = [
  { name: 'H. Al-Hinai',   email: 'h.alhinai@ndcoman.com',   role: 'admin',    state: 'active',  last: 'Today 10:31', who: 'NDC' },
  { name: 'M. Al-Siyabi',  email: 'm.alsiyabi@ndcoman.com',  role: 'finance',  state: 'active',  last: 'Today 09:48', who: 'NDC' },
  { name: 'P. Kurian',     email: 'p.kurian@ndcoman.com',    role: 'finance',  state: 'active',  last: 'Yesterday',   who: 'NDC' },
  { name: 'Y. Al-Amri',    email: 'y.alamri@ndcoman.com',    role: 'readonly', state: 'active',  last: '3 days ago',  who: 'NDC' },
  { name: 'T. Al-Farsi',   email: 't.alfarsi@ndcoman.com',   role: 'finance',  state: 'invited', last: 'Invited today', who: 'NDC' }
];

/* how users are given access — the sequence, not a screenshot */
const ACCESS_STEPS = [
  { n: 1, name: 'System is live',   who: 'System',
    body: 'Once connection and mapping pass their tests, the system is live and access can be issued.' },
  { n: 2, name: 'Administrator named', who: 'The company',
    body: 'The company nominates one person who will own access. Usually the finance manager.' },
  { n: 3, name: 'Invitation sent',  who: 'Administrator',
    body: 'A single invitation is issued to that person. No password is ever set or shared for them.' },
  { n: 4, name: 'Administrator sets their own credentials', who: 'The user',
    body: 'They set a password and enrol a second factor on first sign-in.' },
  { n: 5, name: 'They add their own colleagues', who: 'Administrator',
    body: 'From then on the administrator adds finance and read-only users themselves.' }
];

/* --- ERP connection setup state (screen: onboard) --------------------------
   Reframed for a single company: connecting NDC's own Dynamics 365. */
const ONBOARD = {
  entity: 'National Detergent Co',
  code: 'NDC-001', vatin: 'OM1100234567',
  steps: ['Company details', 'Connection method', 'Connect and test', 'Map the fields', 'Test document', 'Go live'],
  at: 2,
  probe: [
    { t: 'Reaching the ERP', st: 'ok',   ms: 214 },
    { t: 'Credentials accepted',          st: 'ok',   ms: 96 },
    { t: 'Reading a sample invoice',      st: 'ok',   ms: 431 },
    { t: 'Fields discovered',             st: 'ok',   ms: 88, note: '612 fields found' },
    { t: 'Write-back permission',         st: 'warn', ms: 0,  note: 'Not yet granted' }
  ]
};

/* --- activity feed ---------------------------------------------------------- */
const ACTIVITY = [
  { st: 'ok',   t: '10:35', title: 'Acknowledgement received', body: 'NDC-CIV-2026-08842 · delivered to the buyer' },
  { st: 'fail', t: '10:11', title: 'Validation failed', body: 'NDC-CIV-2026-08830 · IBR-CO-15 total mismatch' },
  { st: 'ok',   t: '10:30', title: 'Van sales synced', body: 'FieldAssist → Dynamics · 902 of 906 van invoices posted' },
  { st: 'ok',   t: '10:29', title: 'Supplier invoice drafted', body: 'GSC-INV-2026-04412 · draft PINV-2026-00318 awaiting review' },
  { st: 'ok',   t: '10:22', title: 'Document validated', body: 'NDC-CIV-2026-08845 · 148 rules passed, 2 warnings' },
  { st: 'ok',   t: '09:40', title: 'Mapping profile published', body: 'v6 — 45 of 47 fields resolved' }
];

/* --- exceptions, split by who owns the fix (proposal §7) -------------------- */
const EXCEPTIONS_ENTITY = [
  { title: 'Buyer VAT number missing', count: 2, docs: ['NDC-CIV-2026-08830', 'NDC-CIV-2026-08833'],
    why: 'The customer record has no VAT number, and the buyer is a registered business.',
    fix: 'Add the VAT number to the customer in Dynamics, then press Reprocess.' },
  { title: 'Invoice total does not add up', count: 1, docs: ['NDC-CIV-2026-08845'],
    why: 'Net plus VAT does not equal the invoice total. A rounding rule in the ERP is the usual cause.',
    fix: 'Correct the invoice in Dynamics and submit it again.' }
];

const EXCEPTIONS_PLATFORM = [
  { title: 'ASP timeout on transmission', count: 3, who: 'Technical support',
    why: 'The accredited provider did not respond within the timeout. Documents are being retried automatically.',
    fix: 'No action needed. Retrying every 5 minutes; escalated to the provider.' },
  { title: 'Inbound document cannot be routed', count: 1, who: 'Technical support',
    why: 'A supplier sent to a participant ID that does not match this company.',
    fix: 'No action needed. Support is confirming the participant registration.' }
];

/* --- ERP status sync steps (final screen) ---------------------------------- */
const SYNC_STEPS = [
  { name: 'Invoice submitted in the ERP', t: '28 Jul 09:14:02', st: 'ok',
    body: 'Customer invoice NDC-CIV-2026-08841 posted by S. Al-Rashdi in Dynamics 365. Document status set to Posted.' },
  { name: 'Collected by the system', t: '28 Jul 09:14:04', st: 'ok',
    body: 'Method 1 — Direct API. The system read the Dynamics customer-invoice data entity. Raw payload 14.2 KB, field allowlist applied.' },
  { name: 'Mapped, built and validated', t: '28 Jul 09:14:06', st: 'ok',
    body: 'Profile v6 applied. UBL 2.1 built. Oman CIUS Schematron passed — 148 rules, 2 warnings.' },
  { name: 'Archived', t: '28 Jul 09:14:06', st: 'ok',
    body: 'XML, validation report and audit trail written to the compliance archive before anything was transmitted.' },
  { name: 'Transmitted to the ASP', t: '28 Jul 09:14:07', st: 'ok',
    body: 'Accepted by the accredited provider in 341 ms. Peppol reference PEP-5117-2026.' },
  { name: 'Outcomes tracked on three legs', t: '28 Jul 09:16:41', st: 'ok',
    body: 'ASP accepted it at 09:14:07. The ASP reported it to the Tax Authority at 09:15:52. The buyer’s provider confirmed delivery at 09:16:41.' },
  { name: 'Result published on the interface', t: '28 Jul 09:16:43', st: 'ok',
    body: 'Held against this invoice and available to the ERP: UUID, e-invoice status, acknowledgement number, Peppol reference and QR information. The Dynamics-side connector that collects them is built by the company.' },
  { name: 'Collected by the ERP', t: '28 Jul 09:16:43', st: 'ok',
    body: 'The company’s connector read the result and stored it on the invoice in Dynamics, where the print format renders the QR on the customer copy.' }
];

/* --- what each side provides (proposal §7 delivery boundary) --------------- */
const BOUNDARY_ENTITY = [
  'Complete invoice data and the master data behind it',
  'An enabled Dynamics interface, an integration user and a test environment',
  'The existing FieldAssist → Dynamics sync, so van sales arrive as invoices',
  'The ERP-side connector that collects the result, and the fields to hold it',
  'Finance users for testing, exceptions and sign-off'
];

const BOUNDARY_HUB = [
  'Mapping, XML generation and PINT-OM validation',
  'ASP communication, outcome tracking and retry handling',
  'Secure XML archive and audit trail',
  'Inbound routing and draft purchase-invoice delivery',
  'Dashboard, monitoring and technical operations'
];

/* --- helpers ---------------------------------------------------------------- */
function tenant(id) { return TENANTS.find(t => t.id === id); }
function omr(n) {
  if (n === null || n === undefined) return '—';
  return (n < 0 ? '−' : '') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}
function pct(n) { return n === null || n === undefined ? '—' : n.toFixed(1) + '%'; }
function num(n) { return n === null || n === undefined ? '—' : n.toLocaleString('en-US'); }
function method(m) { return METHODS[m]; }
