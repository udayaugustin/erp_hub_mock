/* ==========================================================================
   WJ Towell Compliance Hub — demonstration dataset

   The seven entities are REAL WJ Towell Group companies, used so the group
   recognises itself. Everything attached to them is INVENTED: VAT numbers,
   volumes, failure counts, ERPs, connection methods and onboarding state.
   None of it is a statement about how those companies actually operate.
   Counterparties are fictional on purpose — see CUSTOMERS / SUPPLIERS.

   Shapes are real: Omani VATIN OM + 10 digits, Peppol scheme 0248, OMR to
   3 decimals, 5% standard VAT.

   Demo clock: Tuesday 28 July 2026, 10:42 GST.
   Tuesday matters — the Omani working week is Sunday to Thursday, so a
   busy weekday has to fall inside it.
   ========================================================================== */

const DEMO_DATE = '28 Jul 2026';
const DEMO_DAY  = 'Tuesday';
const DEMO_CLOCK = '28 Jul 2026, 10:42 GST';

/* --- connection methods (proposal §4) -------------------------------------
   Method is chosen per entity AFTER the ERP inventory. Nothing is assumed. */
const METHODS = {
  1: { n: 'Method 1 — Direct API',        short: 'Direct API',        onsite: 'None',
       use: 'Cloud and API-enabled ERPs',
       how: 'The Hub calls the ERP standard API.' },
  2: { n: 'Method 2 — On-site agent',     short: 'On-site agent',     onsite: 'Lightweight agent',
       use: 'On-premise and restricted-network ERPs',
       how: 'A lightweight agent connects outward to the Hub and carries work in both directions. No inbound firewall access is required.' },
  3: { n: 'Method 3 — Secure file transfer', short: 'Secure file transfer', onsite: 'None',
       use: 'Legacy, bespoke or low-interface environments',
       how: 'Scheduled exports and imports use an agreed format and secure location.' }
};

/* --- entities --------------------------------------------------------------
   Seven of the group's legal entities, chosen to span all three connection
   methods plus the self-hosted exception. The companies are real; the ERPs,
   volumes, VAT numbers and states attached to them are illustrative.        */
const TENANTS = [
  {
    id: 'TAC', code: 'WJT-001', name: 'Towell Auto Centre LLC', short: 'Towell Auto Centre',
    sector: 'Automotive', city: 'Muscat', vatin: 'OM1100428317', peppol: '0248:OM1100428317',
    erp: 'ERPNext v15', erpVer: '15.42.1', method: 1, deploy: 'hub',
    conn: 'REST — Sales Invoice',
    status: 'live', wave: 1, health: 'ok', mapped: 45, mapTotal: 47, sync: '2 min ago',
    today: 412, mtd: 8940, failed: 3, pending: 11, success: 99.2, inbound: true, inToday: 34
  },
  {
    id: 'ENH', code: 'WJT-002', name: 'Enhance Group Oman LLC', short: 'Enhance Group',
    sector: 'FMCG distribution', city: 'Ghala', vatin: 'OM1100519204', peppol: '0248:OM1100519204',
    erp: 'SAP S/4HANA Cloud', erpVer: '2025 FPS02', method: 1, deploy: 'hub',
    conn: 'OData v4 — API_BILLING_DOCUMENT_SRV',
    status: 'live', wave: 1, health: 'ok', mapped: 44, mapTotal: 45, sync: '5 min ago',
    today: 268, mtd: 5417, failed: 1, pending: 4, success: 99.6, inbound: true, inToday: 21
  },
  {
    id: 'ORB', code: 'WJT-003', name: 'Orbit Car Rental & Lease LLC', short: 'Orbit Rental',
    sector: 'Leasing', city: 'Muscat', vatin: 'OM1100637852', peppol: '0248:OM1100637852',
    erp: 'Odoo 17 Enterprise', erpVer: '17.0', method: 1, deploy: 'hub',
    conn: 'JSON-RPC — account.move',
    status: 'live', wave: 1, health: 'warn', mapped: 41, mapTotal: 45, sync: '18 min ago',
    today: 96, mtd: 2183, failed: 14, pending: 27, success: 96.1, inbound: true, inToday: 12
  },
  {
    id: 'TCC', code: 'WJT-004', name: 'Towell Construction & Co. LLC', short: 'Towell Construction',
    sector: 'Construction', city: 'Muscat', vatin: 'OM1100744196', peppol: '0248:OM1100744196',
    erp: 'Oracle E-Business Suite', erpVer: '12.2.11 — on-premise', method: 2, deploy: 'hub',
    conn: 'On-site agent — outbound TLS to the Hub',
    status: 'live', wave: 2, health: 'ok', mapped: 39, mapTotal: 41, sync: '9 min ago',
    today: 154, mtd: 3062, failed: 2, pending: 8, success: 98.8, inbound: true, inToday: 18
  },
  {
    id: 'TDO', code: 'WJT-005', name: 'Towell Drilling & Oil Field Services LLC', short: 'Towell Drilling',
    sector: 'Oilfield services', city: 'Muscat', vatin: 'OM1100852340', peppol: '0248:OM1100852340',
    erp: 'Microsoft Dynamics 365 F&O', erpVer: '10.0.42', method: 1, deploy: 'hub',
    conn: 'Data entities + Business Events',
    status: 'live', wave: 2, health: 'ok', mapped: 45, mapTotal: 45, sync: '1 min ago',
    today: 87, mtd: 1744, failed: 0, pending: 2, success: 99.9, inbound: true, inToday: 9
  },
  {
    id: 'MZP', code: 'WJT-006', name: 'Mazoon Printing & Advertising LLC', short: 'Mazoon Printing',
    sector: 'Printing & packaging', city: 'Ruwi', vatin: 'OM1100963471', peppol: '0248:OM1100963471',
    erp: 'Legacy print MIS — scheduled export', erpVer: 'v3 CSV', method: 3, deploy: 'hub',
    conn: 'Secure file transfer — nightly 23:30',
    status: 'onboarding', wave: 3, health: 'warn', mapped: 22, mapTotal: 43, sync: '6 hr ago',
    today: 0, mtd: 0, failed: 0, pending: 0, success: null, inbound: false, inToday: 0,
    silent: true, silentFor: '6 hr'
  },
  {
    id: 'RMP', code: 'WJT-007', name: 'Readymix Muscat & Premix LLC', short: 'Readymix Muscat',
    sector: 'Manufacturing (JV)', city: 'Rusayl', vatin: 'OM1101074528', peppol: '0248:OM1101074528',
    erp: 'SAP Business One', erpVer: '10.0 FP2408', method: 1, deploy: 'self-hosted',
    conn: 'Self-hosted utility — invoice data never leaves the entity',
    reason: 'Joint venture. Governance classification still to be confirmed — shown here as self-hosted to demonstrate how the exception path works.',
    status: 'self-hosted', wave: 2, health: 'ok', mapped: 45, mapTotal: 45,
    sync: 'entity-reported · 3 min ago',
    today: 62, mtd: 1268, failed: 1, pending: 3, success: 99.1, inbound: true, inToday: 7
  }
];

/* --- group roll-up ---------------------------------------------------------
   Covers all 89 legal entities, not just the seven detailed above.
   Hub figures and self-hosted figures are kept apart on purpose: the
   self-hosted entities have no connection to the Hub, so the Hub cannot
   observe them. Their numbers are reported by the entity.                   */
const GROUP = {
  name: 'WJ Towell Group',
  entities: 89,

  /* deployment split — INDICATIVE, confirmed by the governance classification */
  hubEntities: 80, selfHosted: 9, splitIndicative: true,

  /* onboarding state across all 89 */
  live: 61, onboarding: 24, notStarted: 4,

  /* connection method — only for the 80 hub entities, and only where the
     ERP inventory has actually been done */
  m1: 42, m2: 24, m3: 10, pendingAssessment: 4,

  /* today, across hub entities only */
  todayTotal: 4318, todaySuccess: 4102, todayFailed: 63, todayPending: 153,
  /* today, self-reported by the nine self-hosted entities */
  selfHostedToday: 288,

  /* month to date, hub entities */
  mtdTotal: 90412, mtdFailed: 1286,

  inboundToday: 619,
  aspAvgMs: 388,
  silentEntities: 2,

  /* Wed 22 → Tue 28 Jul. Friday and Saturday are the Omani weekend. */
  week: [4180, 4402, 610, 344, 4098, 4471, 4318],
  weekDays: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'],
  prevSameDay: 4096
};

/* --- rollout waves (proposal §2, §7) --------------------------------------- */
const WAVES = [
  { n: 1, name: 'Wave 1', window: 'Live since Mar 2026', entities: 28, live: 28, state: 'complete',
    note: 'Largest turnover entities. Mandated first by the OTA.' },
  { n: 2, name: 'Wave 2', window: 'Cutover Sep 2026',    entities: 34, live: 27, state: 'active',
    note: 'In progress. Seven entities still mapping.' },
  { n: 3, name: 'Wave 3', window: 'Cutover Jan 2027',    entities: 27, live: 6,  state: 'planned',
    note: 'Retail and low-interface systems. Discovery under way.' }
];

/* --- counterparties --------------------------------------------------------
   Invented. Deliberately not real trading companies.                        */
const CUSTOMERS = [
  { name: 'Falaj Petroleum Distribution SAOG', vatin: 'OM1100112233', type: 'B2B', country: 'OM' },
  { name: 'Khaboura Aluminium Rolling LLC',    vatin: 'OM1100334455', type: 'B2B', country: 'OM' },
  { name: 'Directorate of Municipal Works',    vatin: 'OM1100556677', type: 'B2G', country: 'OM' },
  { name: 'Sharjah Metal Forming FZE',         vatin: 'AE100234567800003', type: 'Export', country: 'AE' },
  { name: 'Wadi Kabir Fuels LLC',              vatin: 'OM1100778899', type: 'B2B', country: 'OM' },
  { name: 'Walk-in Customer',                  vatin: null,          type: 'B2C', country: 'OM' },
  { name: 'Seeb Facilities Management LLC',    vatin: 'OM1100990011', type: 'B2B', country: 'OM' },
  { name: 'Rusayl Industrial Supplies LLC',    vatin: 'OM1100221144', type: 'B2B', country: 'OM' }
];

/* --- suppliers, for the inbound flow --------------------------------------- */
const SUPPLIERS = [
  { name: 'Ghala Packaging Industries LLC', vatin: 'OM1100447722', peppol: '0248:OM1100447722' },
  { name: 'Sur Maritime Services SAOC',     vatin: 'OM1100663311', peppol: '0248:OM1100663311' },
  { name: 'Ibri Transport Contracting LLC', vatin: 'OM1100885544', peppol: '0248:OM1100885544' },
  { name: 'Jebel Akhdar Cold Chain LLC',    vatin: 'OM1100119966', peppol: '0248:OM1100119966' }
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
  'Apply the entity mapping profile',
  'UBL 2.1 · UUID · QR information',
  'Apply PINT-OM rules before sending',
  'Store XML and audit trail before anything is sent',
  'Transmit the valid XML',
  'Acknowledgement and final status',
  'UUID, status and QR held on the interface for the ERP to collect',
  'Long-term legal record, with the acknowledgements'
];

/* documents in flight, by stage — sums to GROUP.todayPending (153) */
const STAGE_COUNT = [18, 27, 22, 31, 9, 34, 12];

/* --- the six inbound stages (proposal §5) ---------------------------------- */
const IN_STAGES = ['Supplier sends', 'Route to entity', 'Validate',
                   'Archive original', 'Create draft', 'Finance review'];
const IN_STAGE_NOTE = [
  'Document arrives via ASP / Peppol',
  'Match participant ID to the legal entity',
  'Structure, identity and content checks',
  'Preserve the legal XML record',
  'Draft purchase invoice in the receiving ERP',
  'Entity team reviews and posts manually'
];

/* Three acknowledgements, on three separate legs, arriving at different times.
   This is why the Hub cannot rely on one synchronous response.              */
const LEGS = [
  { id: 'ack',   leg: 'Service provider → Hub', name: 'Validated and accepted by the ASP',
    at: '28 Jul 2026 09:14:07.633', el: '+0.4 s', st: 'ok',
    body: 'The ASP confirms the e-invoice was generated and validated. This is custody, not delivery.',
    ref: 'ASP-OM-2026-0728-44718' },
  { id: 'ota',   leg: 'Tax Authority → service provider', name: 'Reported to the Tax Authority',
    at: '28 Jul 2026 09:15:52.400', el: '+1 m 45 s', st: 'ok',
    body: 'The ASP reported the Tax Data Document to Fawtara and the OTA acknowledged it. The Hub never talks to the OTA directly.',
    ref: 'OTA-RPT-2026-0728-99204' },
  { id: 'deliv', leg: 'Buyer’s provider → service provider', name: 'Delivered to the buyer',
    at: '28 Jul 2026 09:16:41.008', el: '+2 m 34 s', st: 'ok',
    body: 'The buyer’s access point confirmed receipt. This leg is outside the group’s control and can take hours.',
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
   stage indexes into STAGES; state: ok | active | failed | held             */
const INVOICES = [
  { no: 'TAC-SINV-2026-04471', tenant: 'TAC', cust: 0, net: 24800.000, vat: 1240.000, total: 26040.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '28 Jul 09:14:02',
    uuid: 'b7f4c2e1-9a3d-5c8b-a1f6-2e7d4b9c0a35', ackNo: 'ASP-OM-2026-0728-44718', ref: 'PEP-8842-2026',
    lines: 6, po: 'PO-88213' },
  { no: 'TAC-SINV-2026-04472', tenant: 'TAC', cust: 1, net: 118400.000, vat: 5920.000, total: 124320.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '28 Jul 09:21:47',
    uuid: 'c1a8d3f2-4b7e-6d9c-b2a7-3f8e5c0d1b46', ackNo: 'ASP-OM-2026-0728-44719', ref: 'PEP-8843-2026',
    lines: 12, po: 'PO-88220' },
  { no: 'ENH-SINV-2026-01180', tenant: 'ENH', cust: 3, net: 86200.000, vat: 0.000, total: 86200.000,
    cur: 'OMR', type: 'Invoice', scen: 'Export', stage: 6, state: 'active', retry: 0, created: '28 Jul 10:02:11',
    uuid: 'd2b9e4a3-5c8f-7e0d-c3b8-4a9f6d1e2c57', ackNo: 'ASP-OM-2026-0728-44755', ref: 'PEP-8851-2026',
    lines: 4, po: 'PO-11907', awaiting: 'OTA report · buyer delivery' },
  { no: 'ORB-SINV-2026-00934', tenant: 'ORB', cust: 4, net: 3420.000, vat: 171.000, total: 3591.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 3, state: 'failed', retry: 2, created: '28 Jul 10:11:38',
    uuid: 'e3c0f5b4-6d9a-8f1e-d4c9-5b0a7e2f3d68', ackNo: null, ref: null, lines: 3, po: null,
    owner: 'entity' },
  { no: 'ORB-SINV-2026-00935', tenant: 'ORB', cust: 6, net: 9150.000, vat: 457.500, total: 9607.500,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 3, state: 'active', retry: 0, created: '28 Jul 10:14:05',
    uuid: 'f4d1a6c5-7e0b-9a2f-e5d0-6c1b8f3a4e79', ackNo: null, ref: null, lines: 8, po: 'PO-4471' },
  { no: 'TAC-CRNT-2026-00218', tenant: 'TAC', cust: 0, net: -4200.000, vat: -210.000, total: -4410.000,
    cur: 'OMR', type: 'Credit Note', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '28 Jul 10:26:14',
    uuid: 'c7a4d9f8-0b3e-2d5c-b8a3-9f4e1c6d7b02', ackNo: 'ASP-OM-2026-0728-44736', ref: 'PEP-8863-2026',
    lines: 1, po: null, against: 'TAC-SINV-2026-04390' },
  { no: 'TCC-SINV-2026-02207', tenant: 'TCC', cust: 5, net: 84.400, vat: 4.220, total: 88.620,
    cur: 'OMR', type: 'Simplified', scen: 'B2C', stage: 8, state: 'ok', retry: 0, created: '28 Jul 10:18:52',
    uuid: 'a5e2b7d6-8f1c-0b3a-f6e1-7d2c9a4b5f80', ackNo: 'ASP-OM-2026-0728-44731', ref: 'PEP-8859-2026',
    lines: 5, po: null },
  { no: 'TDO-SINV-2026-00611', tenant: 'TDO', cust: 7, net: 42750.000, vat: 2137.500, total: 44887.500,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 4, state: 'ok', retry: 0, created: '28 Jul 10:22:30',
    uuid: 'b6f3c8e7-9a2d-1c4b-a7f2-8e3d0b5c6a91', ackNo: null, ref: null, lines: 2, po: 'PO-3390' },
  { no: 'ENH-SINV-2026-01181', tenant: 'ENH', cust: 2, net: 15600.000, vat: 780.000, total: 16380.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2G', stage: 2, state: 'active', retry: 0, created: '28 Jul 10:31:09',
    uuid: 'd8b5e0a9-1c4f-3e6d-c9b4-0a5f2d7e8c13', ackNo: null, ref: null, lines: 7, po: 'PO-11912' },
  { no: 'TAC-SINV-2026-04473', tenant: 'TAC', cust: 6, net: 7480.000, vat: 374.000, total: 7854.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 1, state: 'active', retry: 0, created: '28 Jul 10:38:56',
    uuid: null, ackNo: null, ref: null, lines: 9, po: 'PO-88231' },
  { no: 'TCC-SINV-2026-02208', tenant: 'TCC', cust: 4, net: 12900.000, vat: 645.000, total: 13545.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 0, state: 'active', retry: 0, created: '28 Jul 10:41:12',
    uuid: null, ackNo: null, ref: null, lines: 4, po: 'PO-2201' },
  { no: 'ORB-SINV-2026-00931', tenant: 'ORB', cust: 3, net: 28700.000, vat: 0.000, total: 28700.000,
    cur: 'OMR', type: 'Invoice', scen: 'Export', stage: 5, state: 'failed', retry: 4, created: '28 Jul 08:52:20',
    uuid: 'a1e8b3d2-4f7c-6b9a-f2e7-3d8c5a0b1f46', ackNo: null, ref: null, lines: 2, po: null,
    owner: 'platform' },
  { no: 'TDO-SINV-2026-00610', tenant: 'TDO', cust: 5, net: 1890.000, vat: 94.500, total: 1984.500,
    cur: 'OMR', type: 'Simplified', scen: 'B2C', stage: 8, state: 'ok', retry: 0, created: '28 Jul 08:14:33',
    uuid: 'b2f9c4e3-5a8d-7c0b-a3f8-4e9d6b1c2a57', ackNo: 'ASP-OM-2026-0728-44702', ref: 'PEP-8801-2026',
    lines: 3, po: null }
];

/* --- inbound supplier documents (proposal §5 inbound) ----------------------- */
const INBOUND = [
  { no: 'GPI-INV-2026-11842', supplier: 0, to: 'TAC', recv: '28 Jul 10:29:16', net: 8640.000,
    vat: 432.000, total: 9072.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00914',
    erpState: 'Draft — awaiting review', lines: 14, po: 'PO-88190' },
  { no: 'SMS-INV-2026-00733', supplier: 1, to: 'ENH', recv: '28 Jul 10:24:03', net: 21500.000,
    vat: 1075.000, total: 22575.000, stage: 5, state: 'ok', erpRef: 'PINV-D365-004411',
    erpState: 'Draft — awaiting review', lines: 6, po: 'PO-11866' },
  { no: 'ITC-INV-2026-04120', supplier: 2, to: 'TCC', recv: '28 Jul 10:19:48', net: 3180.000,
    vat: 159.000, total: 3339.000, stage: 4, state: 'active', erpRef: null,
    erpState: 'Creating draft', lines: 3, po: null },
  { no: 'JAC-INV-2026-02277', supplier: 3, to: 'TAC', recv: '28 Jul 10:12:31', net: 14200.000,
    vat: 710.000, total: 14910.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00913',
    erpState: 'Draft — awaiting review', lines: 9, po: 'PO-88177' },
  { no: 'GPI-CRN-2026-00318', supplier: 0, to: 'TAC', recv: '28 Jul 09:58:02', net: -1250.000,
    vat: -62.500, total: -1312.500, stage: 5, state: 'ok', erpRef: 'PCRN-2026-00072',
    erpState: 'Draft — awaiting review', lines: 1, po: null, credit: true },
  { no: 'UNK-INV-2026-00051', supplier: null, to: null, recv: '28 Jul 09:41:19', net: 990.000,
    vat: 49.500, total: 1039.500, stage: 1, state: 'failed', erpRef: null,
    erpState: 'Held — cannot route', lines: 2, po: null,
    err: 'Participant 0248:OM1100777001 does not match any registered entity in the group.',
    owner: 'platform' }
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

/* --- ERP-side invoice list (screen 1) -------------------------------------- */
const ERP_INVOICES = [
  { no: 'TAC-SINV-2026-04471', cust: 'Falaj Petroleum Distribution SAOG', date: '28-07-2026', due: '27-08-2026',
    net: 24800.000, vat: 1240.000, total: 26040.000, docStatus: 'Submitted', eStatus: 'Acknowledged',
    ready: true, uuid: 'b7f4c2e1…0a35', qr: true },
  { no: 'TAC-SINV-2026-04472', cust: 'Khaboura Aluminium Rolling LLC', date: '28-07-2026', due: '27-08-2026',
    net: 118400.000, vat: 5920.000, total: 124320.000, docStatus: 'Submitted', eStatus: 'Acknowledged',
    ready: true, uuid: 'c1a8d3f2…1b46', qr: true },
  { no: 'TAC-SINV-2026-04473', cust: 'Seeb Facilities Management LLC', date: '28-07-2026', due: '27-08-2026',
    net: 7480.000, vat: 374.000, total: 7854.000, docStatus: 'Submitted', eStatus: 'In Progress',
    ready: true, uuid: null, qr: false },
  { no: 'TAC-CRNT-2026-00218', cust: 'Falaj Petroleum Distribution SAOG', date: '28-07-2026', due: '—',
    net: -4200.000, vat: -210.000, total: -4410.000, docStatus: 'Submitted', eStatus: 'Acknowledged',
    ready: true, uuid: 'c7a4d9f8…7b02', qr: false, credit: true },
  { no: 'TAC-SINV-2026-04474', cust: 'Rusayl Industrial Supplies LLC', date: '28-07-2026', due: '27-08-2026',
    net: 33150.000, vat: 1657.500, total: 34807.500, docStatus: 'Draft', eStatus: 'Not Applicable',
    ready: false, uuid: null, qr: false },
  { no: 'TAC-SINV-2026-04470', cust: 'Directorate of Municipal Works', date: '27-07-2026', due: '26-08-2026',
    net: 51200.000, vat: 2560.000, total: 53760.000, docStatus: 'Submitted', eStatus: 'Acknowledged',
    ready: true, uuid: 'd4c1b8a7…3e92', qr: true },
  { no: 'TAC-SINV-2026-04469', cust: 'Khaboura Aluminium Rolling LLC', date: '27-07-2026', due: '26-08-2026',
    net: 7300.000, vat: 365.000, total: 7665.000, docStatus: 'Submitted', eStatus: 'Rejected by ASP',
    ready: true, uuid: 'e5d2c9b8…4f03', qr: false }
];

/* --- mapping: what the ERP actually exposes --------------------------------
   The source list an analyst picks from. 386 fields are discovered; these
   are the ones that matter for billing.                                     */
const ERP_SCHEMA = [
  { f: 'BillingDocument',            t: 'string',  ex: '0090114471' },
  { f: 'BillingDocumentDate',        t: 'date',    ex: '20260728' },
  { f: 'BillingDocumentType',        t: 'string',  ex: 'F2' },
  { f: 'BillingDocumentIsCancelled', t: 'boolean', ex: 'false' },
  { f: 'TransactionCurrency',        t: 'string',  ex: 'OMR' },
  { f: 'CompanyCode',                t: 'string',  ex: 'WJT1' },
  { f: 'CompanyVATNumber',           t: 'string',  ex: '1100428317' },
  { f: 'CompanyAddressCity',         t: 'string',  ex: 'Muscat' },
  { f: 'CompanyCountry',             t: 'string',  ex: 'OM' },
  { f: 'CustomerCode',               t: 'string',  ex: 'CUST-00412' },
  { f: 'CustomerName',               t: 'string',  ex: '  falaj petroleum distribution saog ' },
  { f: 'CustomerVATNumber',          t: 'string',  ex: '1100112233' },
  { f: 'CustomerCountry',            t: 'string',  ex: 'OM' },
  { f: 'CustomerAddressStreet',      t: 'string',  ex: '(empty in this ERP)' },
  { f: 'NetAmount',                  t: 'decimal', ex: '24800.00' },
  { f: 'TaxAmount',                  t: 'decimal', ex: '1240.00' },
  { f: 'InvoiceTotal',               t: 'decimal', ex: '26040.00' },
  { f: 'AmountDue',                  t: 'decimal', ex: '26040.00' },
  { f: 'TaxRate',                    t: 'decimal', ex: '5.0' },
  { f: 'ProductCode',                t: 'string',  ex: 'MAT-4471' },
  { f: 'ProductDescription',         t: 'string',  ex: 'Lubricant, 20L drum' },
  { f: 'BillingQuantity',            t: 'decimal', ex: '120.000' },
  { f: 'BillingQuantityUnit',        t: 'string',  ex: 'EA' },
  { f: 'NetPriceAmount',             t: 'decimal', ex: '206.667' },
  { f: 'PurchaseOrderByCustomer',    t: 'string',  ex: 'PO-88213' },
  { f: 'PaymentTerms',               t: 'string',  ex: 'NT30' }
];

/* transforms an analyst can apply */
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
  { v: 'const:VAT',          n: 'const:VAT — fixed tax scheme' }
];

/* --- mapping profile -------------------------------------------------------
   45 of 47 resolved: two fields the ERP does not expose.                    */
const MAPPING = [
  { grp: 'Document header', rows: [
    { erp: 'BillingDocument',        std: 'BT-1',  stdName: 'Invoice number',        xf: '',            req: 'Mandatory', ok: true },
    { erp: 'BillingDocumentDate',    std: 'BT-2',  stdName: 'Issue date',            xf: 'date:ISO8601',req: 'Mandatory', ok: true },
    { erp: 'BillingDocumentType',    std: 'BT-3',  stdName: 'Invoice type code',     xf: 'codelist:UNCL1001', req: 'Mandatory', ok: true },
    { erp: 'TransactionCurrency',    std: 'BT-5',  stdName: 'Document currency',     xf: '',            req: 'Mandatory', ok: true },
    { erp: 'BillingDocumentIsCancelled', std: 'BT-3', stdName: 'Credit note flag',   xf: 'map:381',     req: 'Conditional', ok: true },
    { erp: '—',                      std: 'BTOM-002', stdName: 'Document UUID',      xf: 'derive:uuidv5', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Built from the invoice number, the seller VAT identifier and the issue date. Stable — a resubmission of the same invoice produces the same UUID.' },
    { erp: '—',                      std: 'BTOM-001', stdName: 'Invoice transaction type', xf: 'derive:txntype', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Standard or Simplified, decided from whether the buyer carries a VAT registration.' },
    { erp: '—',                      std: 'IBT-023', stdName: 'Business process type', xf: 'const', req: 'Mandatory', ok: true, derived: true, constant: true,
      dnote: 'urn:peppol:bis:billing — identical on every document, for every entity.' },
    { erp: '—',                      std: 'IBT-024', stdName: 'Specification identifier', xf: 'const', req: 'Mandatory', ok: true, derived: true, constant: true,
      dnote: 'urn:peppol:pint:billing-1@om-1 — declares the OM-1.1 ruleset the document is validated against.' }
  ]},
  { grp: 'Seller party', rows: [
    { erp: 'CompanyCode',            std: 'BT-27', stdName: 'Seller name',           xf: 'lookup:company', req: 'Mandatory', ok: true },
    { erp: 'CompanyVATNumber',       std: 'BT-31', stdName: 'Seller VAT identifier', xf: 'prefix:OM',   req: 'Mandatory', ok: true },
    { erp: '—',                      std: 'BTOM-004', stdName: 'Seller participant ID', xf: 'derive:0248', req: 'Mandatory', ok: true, derived: true,
      dnote: 'The VAT identifier expressed as a Peppol participant under scheme 0248, so the network can route to this entity.' },
    { erp: '—',                      std: 'IBT-034-1', stdName: 'Seller address scheme id', xf: 'const:0248', req: 'Mandatory', ok: true, derived: true, constant: true,
      dnote: 'Names the scheme the seller electronic address belongs to. Fixed for Oman.' },
    { erp: 'CompanyAddressCity',     std: 'BT-37', stdName: 'Seller city',           xf: '',            req: 'Mandatory', ok: true },
    { erp: 'CompanyCountry',         std: 'BT-40', stdName: 'Seller country code',   xf: 'iso:alpha2',  req: 'Mandatory', ok: true }
  ]},
  { grp: 'Buyer party', rows: [
    { erp: 'CustomerCode',           std: 'BT-46', stdName: 'Buyer identifier',      xf: '',            req: 'Mandatory', ok: true },
    { erp: 'CustomerName',           std: 'BT-44', stdName: 'Buyer name',            xf: 'trim|upper',  req: 'Mandatory', ok: true },
    { erp: 'CustomerVATNumber',      std: 'BT-48', stdName: 'Buyer VAT identifier',  xf: 'nullable',    req: 'Conditional', ok: true },
    { erp: 'CustomerCountry',        std: 'BT-55', stdName: 'Buyer country code',    xf: 'iso:alpha2',  req: 'Mandatory', ok: true },
    { erp: '',                       std: 'BT-50', stdName: 'Buyer address line 1',  xf: '',            req: 'Mandatory', ok: false,
      fallback: 'Address held in the Hub entity master',
      note: 'CustomerAddressStreet is present in the ERP but empty on every record.' }
  ]},
  { grp: 'Monetary totals', rows: [
    { erp: 'NetAmount',              std: 'BT-109', stdName: 'Sum of line net amounts', xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'TaxAmount',              std: 'BT-110', stdName: 'Invoice total VAT amount', xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'InvoiceTotal',           std: 'BT-112', stdName: 'Invoice total with VAT',  xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'AmountDue',              std: 'BT-115', stdName: 'Amount due for payment',  xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'TaxRate',                std: 'BT-119', stdName: 'VAT category rate',       xf: 'pct',       req: 'Mandatory', ok: true },
    { erp: '—',                      std: 'IBT-118-1', stdName: 'Tax scheme code',       xf: 'const:VAT', req: 'Mandatory', ok: true, derived: true, constant: true,
      dnote: 'Always VAT for Oman. The ERP does not need to carry a tax scheme code at all.' }
  ]},
  { grp: 'Line items', rows: [
    { erp: 'ProductCode',            std: 'BT-155', stdName: 'Item seller identifier', xf: '',          req: 'Mandatory', ok: true },
    { erp: 'ProductDescription',     std: 'BT-153', stdName: 'Item name',              xf: 'trim',      req: 'Mandatory', ok: true },
    { erp: 'BillingQuantity',        std: 'BT-129', stdName: 'Invoiced quantity',      xf: 'decimal:4', req: 'Mandatory', ok: true },
    { erp: 'BillingQuantityUnit',    std: 'BT-130', stdName: 'Unit of measure code',   xf: 'codelist:UNECE20', req: 'Mandatory', ok: true },
    { erp: 'NetPriceAmount',         std: 'BT-146', stdName: 'Item net price',         xf: 'decimal:3', req: 'Mandatory', ok: true },
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
    { st: 'fail', id: 'IBR-CO-15',  txt: 'Invoice total with VAT (BT-112) does not equal BT-109 + BT-110. Expected 3591.000, found 3590.000.',
      x: 'cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount' },
    { st: 'warn', id: 'IBR-W-014',  txt: 'Payment means code (BT-81) not supplied — defaulted to 30 (credit transfer).',
      x: 'cac:PaymentMeans/cbc:PaymentMeansCode' },
    { st: 'pass', id: 'IBR-001-OM', txt: 'An invoice shall have a Specification identifier (BT-24).' },
    { st: 'pass', id: 'IBR-002-OM', txt: 'An invoice shall have an Invoice number (BT-1).' }
  ]
};

/* --- processing logs -------------------------------------------------------- */
const LOGS = [
  { ts: '10:22:28.114', lv: 'info', txt: 'Poll tick — entity TDO, watermark 2026-07-28T10:21:44Z' },
  { ts: '10:22:28.291', lv: 'info', txt: 'Fetched raw payload · 14.2 KB · 27 fields (allowlist applied)' },
  { ts: '10:22:28.402', lv: 'ok',   txt: 'Idempotency check passed — (TDO, TDO-SINV-2026-00611) not previously seen' },
  { ts: '10:22:28.556', lv: 'info', txt: 'Mapping profile TDO/v4 applied — 45 of 45 fields resolved' },
  { ts: '10:22:28.703', lv: 'info', txt: 'Scenario detected: B2B domestic · standard rate 5%' },
  { ts: '10:22:28.844', lv: 'ok',   txt: 'BTOM-002 UUID derived — b6f3c8e7-9a2d-1c4b-a7f2-8e3d0b5c6a91' },
  { ts: '10:22:29.017', lv: 'info', txt: 'UBL 2.1 Invoice built · 8.9 KB · 2 lines' },
  { ts: '10:22:29.188', lv: 'info', txt: 'Oman CIUS Schematron — evaluating 150 assertions' },
  { ts: '10:22:31.472', lv: 'warn', txt: 'IBR-W-014 · payment means defaulted to 30' },
  { ts: '10:22:31.474', lv: 'ok',   txt: 'Validation passed — 148 passed, 0 failed, 2 warnings (284 ms)' },
  { ts: '10:22:31.610', lv: 'ok',   txt: 'Archived — XML, validation report and audit trail written before transmission' },
  { ts: '10:22:31.788', lv: 'ok',   txt: 'State → READY_FOR_ASP · queued on entity channel TDO' }
];

/* --- ASP exchange ----------------------------------------------------------- */
const ASP = {
  provider: 'Accredited Service Provider — OTA licence ASP-OM-014',
  endpoint: 'https://ap.asp-oman.om/peppol/v1/documents',
  auth: 'mTLS · client certificate held in the platform vault',
  sentAt: '28 Jul 2026 09:14:07.221 GST',
  ackAt:  '28 Jul 2026 09:14:07.633 GST',
  otaAt:  '28 Jul 2026 09:15:52.400 GST',
  mlsAt:  '28 Jul 2026 09:16:41.008 GST',
  rtt: 388,
  http: '202 Accepted',
  ref: 'PEP-8842-2026',
  ackNo: 'ASP-OM-2026-0728-44718',
  otaRef: 'OTA-RPT-2026-0728-99204',
  msgId: 'urn:uuid:b7f4c2e1-9a3d-5c8b-a1f6-2e7d4b9c0a35',
  sender: '0248:OM1100428317',
  receiver: '0248:OM1100112233',
  docType: 'Peppol PINT billing — Oman',
  process: 'Peppol BIS billing'
};

/* --- history ---------------------------------------------------------------- */
const HISTORY = [
  { no: 'TAC-SINV-2026-04471', tenant: 'TAC', date: '28 Jul 09:14', total: 26040.000, type: 'Invoice',  dir: 'out', st: 'success', ack: 'ASP-OM-2026-0728-44718', retries: 0 },
  { no: 'TAC-SINV-2026-04472', tenant: 'TAC', date: '28 Jul 09:21', total: 124320.000, type: 'Invoice', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0728-44719', retries: 0 },
  { no: 'TDO-SINV-2026-00610', tenant: 'TDO', date: '28 Jul 08:14', total: 1984.500, type: 'Simplified', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0728-44702', retries: 0 },
  { no: 'ORB-SINV-2026-00931', tenant: 'ORB', date: '28 Jul 08:52', total: 28700.000, type: 'Invoice',  dir: 'out', st: 'failed',  ack: null, retries: 4, err: 'ASP timeout — transient, retrying' },
  { no: 'TAC-CRNT-2026-00218', tenant: 'TAC', date: '28 Jul 10:26', total: -4410.000, type: 'Credit Note', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0728-44736', retries: 0 },
  { no: 'GPI-INV-2026-11842',  tenant: 'TAC', date: '28 Jul 10:29', total: 9072.000, type: 'Supplier invoice', dir: 'in', st: 'success', ack: 'PINV-2026-00914', retries: 0 },
  { no: 'SMS-INV-2026-00733',  tenant: 'ENH', date: '28 Jul 10:24', total: 22575.000, type: 'Supplier invoice', dir: 'in', st: 'success', ack: 'PINV-D365-004411', retries: 0 },
  { no: 'TCC-SINV-2026-02207', tenant: 'TCC', date: '28 Jul 10:18', total: 88.620, type: 'Simplified',  dir: 'out', st: 'success', ack: 'ASP-OM-2026-0728-44731', retries: 0 },
  { no: 'ORB-SINV-2026-00934', tenant: 'ORB', date: '28 Jul 10:11', total: 3591.000, type: 'Invoice',   dir: 'out', st: 'failed',  ack: null, retries: 2, err: 'IBR-CO-15 · total mismatch' },
  { no: 'ENH-SINV-2026-01179', tenant: 'ENH', date: '28 Jul 07:40', total: 44210.000, type: 'Invoice',  dir: 'out', st: 'reprocessed', ack: 'ASP-OM-2026-0728-44688', retries: 1 },
  { no: 'TAC-SINV-2026-04469', tenant: 'TAC', date: '27 Jul 16:22', total: 7665.000, type: 'Invoice',   dir: 'out', st: 'rejected', ack: null, retries: 0, err: 'ASP rejected — buyer participant not registered' },
  { no: 'GPI-CRN-2026-00318',  tenant: 'TAC', date: '28 Jul 09:58', total: -1312.500, type: 'Supplier credit note', dir: 'in', st: 'success', ack: 'PCRN-2026-00072', retries: 0 },
  { no: 'ENH-SINV-2026-01180', tenant: 'ENH', date: '28 Jul 10:02', total: 86200.000, type: 'Invoice',  dir: 'out', st: 'pending', ack: null, retries: 0 },
  { no: 'TDO-SINV-2026-00611', tenant: 'TDO', date: '28 Jul 10:22', total: 44887.500, type: 'Invoice',  dir: 'out', st: 'pending', ack: null, retries: 0 },
  { no: 'TAC-SINV-2026-04470', tenant: 'TAC', date: '27 Jul 14:11', total: 53760.000, type: 'Invoice',  dir: 'out', st: 'success', ack: 'ASP-OM-2026-0727-44590', retries: 0 }
];

/* --- reporting -------------------------------------------------------------
   Month to date, July 2026. Figures are per entity and reconcile upward.    */
const REPORT_ROWS = [
  { id: 'TAC', docs: 8940, net: 4218400.000, vat: 198420.000, zero: 412300.000, failed: 74,  ack: 8866 },
  { id: 'ENH', docs: 5417, net: 6104200.000, vat: 214880.000, zero: 1806600.000, failed: 31, ack: 5386 },
  { id: 'ORB', docs: 2183, net: 812640.000,  vat: 38104.000,  zero: 50560.000,  failed: 118, ack: 2065 },
  { id: 'TCC', docs: 3062, net: 1094300.000, vat: 52190.000,  zero: 50500.000,  failed: 42,  ack: 3020 },
  { id: 'TDO', docs: 1744, net: 2417800.000, vat: 116340.000, zero: 91000.000,  failed: 9,   ack: 1735 }
];

const REPORT_TYPES = [
  { n: 'VAT summary by entity',        d: 'Net, VAT and zero-rated totals for a period, per legal entity.', tag: 'Finance' },
  { n: 'Reporting completeness',       d: 'Documents raised in the ERP against documents acknowledged by the ASP.', tag: 'Compliance' },
  { n: 'Exception ageing',             d: 'Open failures by age and by who owns the fix.', tag: 'Operations' },
  { n: 'Document type breakdown',      d: 'Invoices, credit notes and simplified documents, by entity.', tag: 'Finance' },
  { n: 'Inbound supplier documents',   d: 'Received, routed, drafted and still awaiting review.', tag: 'Operations' },
  { n: 'Wave readiness',               d: 'Mapping and connection progress against each OTA wave date.', tag: 'Programme' }
];

/* --- users and access (proposal §7) ---------------------------------------- */
const ROLES = [
  { k: 'entity-admin', n: 'Entity administrator', d: 'Adds colleagues, sets roles, receives the compliance digest.' },
  { k: 'finance',      n: 'Finance user',         d: 'Sees documents, resolves data exceptions, reprocesses.' },
  { k: 'readonly',     n: 'Read-only',            d: 'Views documents and reports. Cannot act on anything.' },
  { k: 'group-admin',  n: 'Group administrator',  d: 'Central team. All entities, all configuration. Cannot post to any ERP.' }
];

const ENTITY_USERS = [
  { name: 'N. Al-Kindi',   email: 'n.alkindi@wjtowell.om',   role: 'entity-admin', state: 'active',  last: 'Today 10:31', who: 'TAC' },
  { name: 'F. Al-Harthy',  email: 'f.alharthy@wjtowell.om',  role: 'finance',      state: 'active',  last: 'Today 09:48', who: 'TAC' },
  { name: 'R. Menon',      email: 'r.menon@wjtowell.om',     role: 'finance',      state: 'active',  last: 'Yesterday',   who: 'TAC' },
  { name: 'S. Al-Zadjali', email: 's.alzadjali@wjtowell.om', role: 'readonly',     state: 'active',  last: '3 days ago',  who: 'TAC' },
  { name: 'A. Baloushi',   email: 'a.baloushi@wjtowell.om',  role: 'finance',      state: 'invited', last: 'Invited today', who: 'TAC' }
];

/* how an entity is given access — the sequence, not a screenshot */
const ACCESS_STEPS = [
  { n: 1, name: 'Entity confirmed live',   who: 'Central team',
    body: 'Once connection and mapping pass their tests, the entity is marked live and access can be issued.' },
  { n: 2, name: 'Entity administrator named', who: 'The entity',
    body: 'The entity nominates one person who will own access for that company. Usually the finance manager.' },
  { n: 3, name: 'Invitation sent',         who: 'Central team',
    body: 'A single invitation is issued to that person. No password is ever set or shared by the central team.' },
  { n: 4, name: 'Administrator sets their own credentials', who: 'The entity',
    body: 'They set a password and enrol a second factor on first sign-in.' },
  { n: 5, name: 'They add their own colleagues', who: 'The entity',
    body: 'From then on the entity administrator adds finance and read-only users themselves. The central team is not in the loop.' }
];

/* --- onboarding wizard state (screen: onboard) ------------------------------ */
const ONBOARD = {
  entity: 'Mazoon Printing & Advertising LLC',
  code: 'WJT-006', vatin: 'OM1100963471', wave: 3,
  steps: ['Entity details', 'Connection method', 'Connect and test', 'Map the fields', 'Test document', 'Go live'],
  at: 2,
  probe: [
    { t: 'Reaching the agreed location', st: 'ok',   ms: 214 },
    { t: 'Credentials accepted',          st: 'ok',   ms: 96 },
    { t: 'Reading a sample export',       st: 'ok',   ms: 431 },
    { t: 'Fields discovered',             st: 'ok',   ms: 88, note: '43 columns found' },
    { t: 'Write-back permission',         st: 'warn', ms: 0,  note: 'Not yet granted by the entity' }
  ]
};

/* --- group activity feed ---------------------------------------------------- */
const ACTIVITY = [
  { st: 'ok',   t: '10:35', title: 'Acknowledgement received', body: 'RMP-SINV-2026-00448 · entity-reported', tag: 'Readymix Muscat' },
  { st: 'fail', t: '10:11', title: 'Validation failed', body: 'ORB-SINV-2026-00934 · IBR-CO-15 total mismatch', tag: 'Orbit Rental' },
  { st: 'ok',   t: '10:29', title: 'Supplier invoice drafted', body: 'GPI-INV-2026-11842 · draft PINV-2026-00914 awaiting review', tag: 'Towell Auto Centre' },
  { st: 'warn', t: '09:58', title: 'Connector latency elevated', body: 'Odoo JSON-RPC p95 at 3.4 s — above the 2 s threshold', tag: 'Orbit Rental' },
  { st: 'warn', t: '08:22', title: 'No documents received', body: 'Nothing since 04:38. Nightly file transfer did not arrive.', tag: 'Mazoon Printing' },
  { st: 'ok',   t: '09:40', title: 'Mapping profile published', body: 'Towell Construction v3 — 39 of 41 fields resolved', tag: 'Towell Construction' }
];

/* --- exceptions, split by who owns the fix (proposal §7) -------------------- */
const EXCEPTIONS_ENTITY = [
  { title: 'Buyer VAT number missing', count: 2, docs: ['ORB-SINV-2026-00934', 'TAC-SINV-2026-04466'],
    why: 'The customer record has no VAT number, and the buyer is a registered business.',
    fix: 'Add the VAT number to the customer in your own ERP, then press Reprocess.' },
  { title: 'Invoice total does not add up', count: 1, docs: ['TAC-SINV-2026-04468'],
    why: 'Net plus VAT does not equal the invoice total. A rounding rule in the ERP is the usual cause.',
    fix: 'Correct the invoice in your own ERP and submit it again.' }
];

const EXCEPTIONS_PLATFORM = [
  { title: 'ASP timeout on transmission', count: 4, who: 'Central technical team',
    why: 'The accredited provider did not respond within the timeout. Documents are being retried automatically.',
    fix: 'No entity action. Retrying every 5 minutes; escalated to the provider.' },
  { title: 'Inbound document cannot be routed', count: 1, who: 'Central technical team',
    why: 'A supplier sent to a participant ID that matches no entity in the group.',
    fix: 'No entity action. Central team is confirming the participant registration.' },
  { title: 'Nightly file transfer did not arrive', count: 1, who: 'Central technical team',
    why: 'Mazoon Printing has sent nothing since 04:38. The scheduled export appears not to have run.',
    fix: 'No entity action yet. Central team is checking the connection.' }
];

/* --- ERP status sync steps (final screen) ---------------------------------- */
const SYNC_STEPS = [
  { name: 'Invoice submitted in the ERP', t: '28 Jul 09:14:02', st: 'ok',
    body: 'Sales Invoice TAC-SINV-2026-04471 submitted by A. Al-Balushi. Document status set to Submitted.' },
  { name: 'Collected by the Hub', t: '28 Jul 09:14:04', st: 'ok',
    body: 'Method 1 — Direct API. The Hub called the ERP billing document service. Raw payload 14.2 KB, field allowlist applied.' },
  { name: 'Mapped, built and validated', t: '28 Jul 09:14:06', st: 'ok',
    body: 'Profile TAC/v7 applied. UBL 2.1 built. Oman CIUS Schematron passed — 148 rules, 2 warnings.' },
  { name: 'Archived', t: '28 Jul 09:14:06', st: 'ok',
    body: 'XML, validation report and audit trail written to the compliance archive before anything was transmitted.' },
  { name: 'Transmitted to the ASP', t: '28 Jul 09:14:07', st: 'ok',
    body: 'Accepted by the accredited provider in 388 ms. Peppol reference PEP-8842-2026.' },
  { name: 'Outcomes tracked on three legs', t: '28 Jul 09:16:41', st: 'ok',
    body: 'ASP accepted it at 09:14:07. The ASP reported it to the Tax Authority at 09:15:52. The buyer’s provider confirmed delivery at 09:16:41.' },
  { name: 'Result published on the interface', t: '28 Jul 09:16:43', st: 'ok',
    body: 'Held against this invoice and available to the ERP: UUID, e-invoice status, acknowledgement number, Peppol reference and QR information. The ERP-side connector that collects them is built by the entity.' },
  { name: 'Collected by the ERP', t: '28 Jul 09:16:43', st: 'ok',
    body: 'The entity’s connector read the result and stored it on the invoice, where the print format renders the QR on the customer copy.' }
];

/* --- what each side provides (proposal §7 delivery boundary) --------------- */
const BOUNDARY_ENTITY = [
  'Complete invoice data and the master data behind it',
  'An enabled interface, an integration user and a test environment',
  'The ERP-side connector that collects the result, and the fields to hold it',
  'ERP-side changes where a required field is missing',
  'Finance users for testing, exceptions and sign-off'
];

const BOUNDARY_HUB = [
  'Mapping, XML generation and PINT-OM validation',
  'ASP communication, outcome tracking and retry handling',
  'Secure XML archive and audit trail',
  'Inbound routing and draft purchase-invoice delivery',
  'Dashboard, monitoring and central technical operations'
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
