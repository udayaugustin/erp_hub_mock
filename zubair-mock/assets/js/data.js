/* ==========================================================================
   The Zubair Corporation — Central E-Invoicing Hub · demonstration dataset

   The twelve entities are REAL members of ONE Oman VAT Group — The Zubair
   Corporation VAT Group, TRN OM1200094685 — so the group recognises itself.
   Everything attached to them is INVENTED: volumes, failure counts, ERP
   versions, connection state, commercial registrations and onboarding status.
   None of it is a statement about how those companies actually operate.
   Counterparties are fictional on purpose — see CUSTOMERS / SUPPLIERS.

   THE STORY: one VAT Group, twelve legal entities, four different ERPs
   (SAP S/4HANA, Autoline, Orion 11J, FOCUS X). Every member invoices under
   the SAME shared group TRN — which is exactly why a single central hub is
   the natural place to normalise, validate and report to the OTA through one
   pipe.

   IDENTITY (resolved from the PINT-OM Oman spec): the shared group TRN does
   NOT collapse the members into one identity. Each legal entity is its OWN
   Peppol participant — its own endpoint registration, SMP entry and ASP
   certificate — and is distinguished on the invoice by its OWN Commercial
   Registration (CR · IBT-029 · scheme CR from code list CL-06-OM). The shared
   group VATIN OM1200094685 is carried as the Seller VAT identifier (IBT-031):
   a data field, not the routing address. So each TENANTS entry has its own
   `cr` AND its own `peppol` participant, while all share `vatin`. Twelve
   entities = twelve participants, one VAT-group return — the hub's whole point.
   (Only the exact Oman endpoint EAS scheme remains to confirm on the OTA
   onboarding portal.)

   Shapes are real: Omani VATIN OM + 10 digits, Peppol scheme 0248, OMR to
   3 decimals, 5% standard VAT. Source of the roster and volumes: the Oman
   E-Invoicing entity tracker, "Entity Level" sheet.

   Demo clock: Tuesday 18 August 2026, 10:42 GST.
   Tuesday matters — the Omani working week is Sunday to Thursday, so a
   busy weekday has to fall inside it.
   ========================================================================== */

const DEMO_DATE = '18 Aug 2026';
const DEMO_DAY  = 'Tuesday';
const DEMO_CLOCK = '18 Aug 2026, 10:42 GST';

/* The shared VAT Group registration every entity below files under. */
const GROUP_TRN = 'OM1200094685';

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
   Twelve members of The Zubair Corporation VAT Group (TRN OM1200094685).
   All share the group VATIN; each carries its own commercial registration.
   The companies and ERPs are real; volumes, versions, VAT/CR numbers and
   states attached to them are illustrative.                                 */
const TENANTS = [
  {
    id: 'ZCL', code: 'ZUB-001', name: 'The Zubair Corporation LLC', short: 'Zubair Corporation',
    sector: 'Corporate', city: 'Muscat', vatin: GROUP_TRN, cr: '1008431', peppol: '0248:1008431',
    erp: 'SAP S/4HANA', erpVer: '2025 FPS02', method: 1, deploy: 'hub',
    conn: 'OData v4 — API_BILLING_DOCUMENT_SRV (BAPI / CPI)',
    status: 'live', wave: 1, health: 'ok', mapped: 46, mapTotal: 47, sync: '1 min ago',
    today: 8, mtd: 96, failed: 3, pending: 3, success: 99.2, inbound: true, inToday: 6
  },
  {
    id: 'AHI', code: 'ZUB-002', name: 'Al-Hilal Investment Co LLC', short: 'Al-Hilal Investment',
    sector: 'Investment', city: 'Muscat', vatin: GROUP_TRN, cr: '1044190', peppol: '0248:1044190',
    erp: 'SAP S/4HANA', erpVer: '2025 FPS02', method: 1, deploy: 'hub',
    conn: 'OData v4 — API_BILLING_DOCUMENT_SRV (BAPI / CPI)',
    status: 'live', wave: 1, health: 'ok', mapped: 45, mapTotal: 47, sync: '7 min ago',
    today: 1, mtd: 12, failed: 0, pending: 0, success: 100, inbound: true, inToday: 2
  },
  {
    id: 'OCS', code: 'ZUB-003', name: 'Oman Computer Services LLC', short: 'Oman Computer Services',
    sector: 'Digital & IT', city: 'Muscat', vatin: GROUP_TRN, cr: '1019884', peppol: '0248:1019884',
    erp: 'SAP S/4HANA', erpVer: '2025 FPS02', method: 1, deploy: 'hub',
    conn: 'OData v4 — API_BILLING_DOCUMENT_SRV (BAPI / CPI)',
    status: 'live', wave: 1, health: 'ok', mapped: 45, mapTotal: 46, sync: '3 min ago',
    today: 9, mtd: 150, failed: 0, pending: 1, success: 99.5, inbound: true, inToday: 14
  },
  {
    id: 'ZED', code: 'ZUB-004', name: 'Zakher Education Property Dev Co LLC', short: 'Zakher Education',
    sector: 'Education', city: 'Muscat', vatin: GROUP_TRN, cr: '1122870', peppol: '0248:1122870',
    erp: 'SAP S/4HANA', erpVer: '2025 FPS02', method: 1, deploy: 'hub',
    conn: 'OData v4 — API_BILLING_DOCUMENT_SRV (BAPI / CPI)',
    status: 'onboarding', wave: 3, health: 'warn', mapped: 20, mapTotal: 44, sync: '5 hr ago',
    today: 0, mtd: 0, failed: 0, pending: 0, success: null, inbound: false, inToday: 0,
    silent: true, silentFor: '5 hr'
  },
  {
    id: 'ZBS', code: 'ZUB-005', name: 'Zakher Building Solutions LLC', short: 'Zakher Building',
    sector: 'Real Estate', city: 'Muscat', vatin: GROUP_TRN, cr: '1090552', peppol: '0248:1090552',
    erp: 'Orion 11J', erpVer: '11J', method: 1, deploy: 'hub',
    conn: 'Orion 11J REST — AR invoice',
    status: 'live', wave: 2, health: 'ok', mapped: 41, mapTotal: 44, sync: '12 min ago',
    today: 12, mtd: 95, failed: 1, pending: 2, success: 98.2, inbound: true, inToday: 5
  },
  {
    id: 'OLG', code: 'ZUB-006', name: 'Oasis Logistics LLC', short: 'Oasis Logistics',
    sector: 'Logistics', city: 'Muscat', vatin: GROUP_TRN, cr: '1067213', peppol: '0248:1067213',
    erp: 'FOCUS X', erpVer: 'X', method: 1, deploy: 'hub',
    conn: 'FOCUS X REST — sales invoice',
    status: 'live', wave: 1, health: 'ok', mapped: 44, mapTotal: 45, sync: '4 min ago',
    today: 66, mtd: 880, failed: 3, pending: 4, success: 99.1, inbound: true, inToday: 22
  },
  {
    id: 'DAU', code: 'ZUB-007', name: 'Dhofar Automotive LLC', short: 'Dhofar Automotive',
    sector: 'Automotive', city: 'Salalah', vatin: GROUP_TRN, cr: '2013447', peppol: '0248:2013447',
    erp: 'Autoline 8.39', erpVer: '8.39 Rev8', method: 1, deploy: 'hub',
    conn: 'Autoline API — invoice extract',
    status: 'live', wave: 2, health: 'ok', mapped: 43, mapTotal: 46, sync: '9 min ago',
    today: 12, mtd: 80, failed: 0, pending: 1, success: 99.4, inbound: true, inToday: 4
  },
  {
    id: 'ZAG', code: 'ZUB-008', name: 'Zubair Automotive Group LLC', short: 'Zubair Automotive',
    sector: 'Automotive', city: 'Muscat', vatin: GROUP_TRN, cr: '1055829', peppol: '0248:1055829',
    erp: 'Autoline 8.39', erpVer: '8.39 Rev8', method: 1, deploy: 'hub',
    conn: 'Autoline API — invoice extract',
    status: 'live', wave: 2, health: 'ok', mapped: 44, mapTotal: 46, sync: '6 min ago',
    today: 22, mtd: 340, failed: 1, pending: 2, success: 99.2, inbound: true, inToday: 9
  },
  {
    id: 'GAC', code: 'ZUB-009', name: 'General Automotive Company LLC', short: 'General Automotive',
    sector: 'Automotive', city: 'Muscat', vatin: GROUP_TRN, cr: '1002715', peppol: '0248:1002715',
    erp: 'Autoline 8.39', erpVer: '8.39 Rev8', method: 1, deploy: 'hub',
    conn: 'Autoline API — invoice extract · high-volume B2C',
    status: 'live', wave: 1, health: 'ok', mapped: 45, mapTotal: 46, sync: '2 min ago',
    today: 3105, mtd: 41000, failed: 12, pending: 38, success: 99.2, inbound: true, inToday: 55,
    note: 'Highest-volume member — showroom, parts and service counters. Simplified B2C invoices are reported to the OTA in batches from Autoline, not cleared live at point of sale.'
  },
  {
    id: 'IHE', code: 'ZUB-010', name: 'International Heavy Equipment LLC', short: 'Intl Heavy Equipment',
    sector: 'Automotive', city: 'Muscat', vatin: GROUP_TRN, cr: '1033960', peppol: '0248:1033960',
    erp: 'Autoline 8.39', erpVer: '8.39 Rev8', method: 1, deploy: 'hub',
    conn: 'Autoline API — invoice extract',
    status: 'live', wave: 2, health: 'ok', mapped: 44, mapTotal: 46, sync: '5 min ago',
    today: 210, mtd: 2700, failed: 3, pending: 6, success: 99.3, inbound: true, inToday: 18
  },
  {
    id: 'ZES', code: 'ZUB-011', name: 'Zubair Enterprises Southern LLC', short: 'Zubair Enterprises S.',
    sector: 'Automotive', city: 'Salalah', vatin: GROUP_TRN, cr: '2011208', peppol: '0248:2011208',
    erp: 'Autoline 8.39', erpVer: '8.39 Rev8', method: 1, deploy: 'hub',
    conn: 'Autoline API — invoice extract',
    status: 'onboarding', wave: 3, health: 'warn', mapped: 22, mapTotal: 46, sync: '6 hr ago',
    today: 0, mtd: 0, failed: 0, pending: 0, success: null, inbound: false, inToday: 0,
    silent: true, silentFor: '6 hr'
  },
  {
    id: 'SAY', code: 'ZUB-012', name: 'Sayarti LLC', short: 'Sayarti',
    sector: 'Automotive', city: 'Muscat', vatin: GROUP_TRN, cr: '1108734', peppol: '0248:1108734',
    erp: 'Autoline 8.39', erpVer: '8.39 Rev8', method: 1, deploy: 'hub',
    conn: 'Autoline API — invoice extract',
    status: 'live', wave: 2, health: 'ok', mapped: 44, mapTotal: 46, sync: '8 min ago',
    today: 205, mtd: 2650, failed: 2, pending: 5, success: 99.4, inbound: true, inToday: 12
  }
];

/* --- group roll-up ---------------------------------------------------------
   One VAT Group, twelve legal entities, one shared TRN. Every figure here
   is the Hub's own observation across the twelve — there are no self-hosted
   members in this group, so the Hub sees everything.                        */
const GROUP = {
  name: 'The Zubair Corporation VAT Group',
  trn: GROUP_TRN,
  entities: 12,

  /* deployment — all twelve run through the Hub */
  hubEntities: 12, selfHosted: 0, splitIndicative: false,

  /* onboarding state across all twelve */
  live: 10, onboarding: 2, notStarted: 0,

  /* connection method — all API-capable; two still in ERP assessment */
  m1: 10, m2: 0, m3: 0, pendingAssessment: 2,

  /* today, across all twelve entities */
  todayTotal: 3650, todaySuccess: 3563, todayFailed: 25, todayPending: 62,
  selfHostedToday: 0,

  /* month to date, August 2026 */
  mtdTotal: 48003, mtdFailed: 372,

  inboundToday: 147,
  aspAvgMs: 372,
  silentEntities: 2,

  /* Wed 12 → Tue 18 Aug. Friday and Saturday are the Omani weekend. */
  week: [3480, 3702, 510, 300, 3560, 3611, 3650],
  weekDays: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'],
  prevSameDay: 3590
};

/* --- rollout waves (proposal §2, §7) ---------------------------------------
   The OTA mandate for this group's phase is April 2027. The Hub is proven
   on a live pilot ahead of it, then the remaining entities cut over.        */
const WAVES = [
  { n: 1, name: 'Live pilot', window: 'Live since Jun 2026', entities: 5, live: 5, state: 'complete',
    note: 'SAP S/4HANA corporate entities and General Automotive — the volume proof. Validates the model before the mandate.' },
  { n: 2, name: 'Wave 2', window: 'Cutover Q4 2026', entities: 5, live: 5, state: 'active',
    note: 'Autoline dealerships, Orion and FOCUS X. Mapping complete, running in parallel.' },
  { n: 3, name: 'Wave 3', window: 'Ahead of the Apr 2027 mandate', entities: 2, live: 0, state: 'planned',
    note: 'Low-volume and southern entities. ERP assessment under way.' }
];

/* --- the second origin: high-volume B2C from Autoline ----------------------
   General Automotive Company (GAC) runs Autoline 8.39. Its showroom, parts
   counter and workshop generate the group's biggest B2C stream — thousands of
   Simplified invoices a day. They are collected by Autoline and reported to
   the OTA in BATCHES through the same Central Hub, not cleared live at the
   counter. The batch cadence is an assumption to confirm with Zubair.        */
const AUTOLINE_B2C = {
  entity: 'GAC', system: 'Autoline 8.39', release: 'Rev8',
  module: 'Retail & Service — Simplified invoicing',
  todayCount: 3105, monthCount: 66136, awaitingSync: 38, counters: 4,
  batch: { id: 'GAC-B2C-2026-0818-14', count: 480, syncedAt: '10:30 GST',
           reportedAt: '10:34 GST', state: 'reported', ack: 'ASP-OM-2026-0818-BATCH-14' },
  branches: ['Wattayah Showroom', 'Ghala Parts Counter', 'Rusayl Service', 'Sohar Branch'],
  note: 'Simplified B2C invoices are collected by Autoline and reported to the OTA in scheduled batches from the Central Hub — not cleared live at the point of sale.',
  assumption: 'Assumption · to confirm with Zubair: batch cadence and whether any counter requires a cleared invoice before the customer leaves.',
  rows: [
    { no: 'GAC-SIMP-2026-441207', ctr: 'Ghala Parts Counter', cust: 'Walk-in Customer', item: 'Brake pad set', net: 84.400,  vat: 4.220,  total: 88.620,  t: '10:18', state: 'reported' },
    { no: 'GAC-SIMP-2026-441208', ctr: 'Rusayl Service',      cust: 'Walk-in Customer', item: 'Oil change service', net: 32.000, vat: 1.600, total: 33.600, t: '10:19', state: 'reported' },
    { no: 'GAC-SIMP-2026-441209', ctr: 'Wattayah Showroom',   cust: 'Walk-in Customer', item: 'Accessory pack',    net: 145.000, vat: 7.250, total: 152.250, t: '10:21', state: 'batched' },
    { no: 'GAC-SIMP-2026-441210', ctr: 'Ghala Parts Counter', cust: 'Walk-in Customer', item: 'Air filter',        net: 12.500,  vat: 0.625, total: 13.125,  t: '10:22', state: 'batched' },
    { no: 'GAC-SIMP-2026-441211', ctr: 'Rusayl Service',      cust: 'Al Batinah Logistics Services LLC', item: 'Tyre replacement ×4', net: 210.000, vat: 10.500, total: 220.500, t: '10:24', state: 'queued' },
    { no: 'GAC-SIMP-2026-441212', ctr: 'Wattayah Showroom',   cust: 'Walk-in Customer', item: 'Car mats & trim',   net: 58.000,  vat: 2.900, total: 60.900,  t: '10:25', state: 'queued' },
    { no: 'GAC-SIMP-2026-441213', ctr: 'Ghala Parts Counter', cust: 'Walk-in Customer', item: 'Wiper blades',      net: 9.000,   vat: 0.450, total: 9.450,   t: '10:26', state: 'queued' },
    { no: 'GAC-SIMP-2026-441214', ctr: 'Sohar Branch',        cust: 'Walk-in Customer', item: 'AC re-gas',         net: 25.000,  vat: 1.250, total: 26.250,  t: '10:27', state: 'queued' }
  ]
};

/* --- counterparties --------------------------------------------------------
   Invented. Deliberately not real trading companies.                        */
const CUSTOMERS = [
  { name: 'Muscat Bay Hospitality LLC',        vatin: 'OM1100112233', type: 'B2B', country: 'OM' },
  { name: 'Sohar Steel Rolling LLC',           vatin: 'OM1100334455', type: 'B2B', country: 'OM' },
  { name: 'Directorate General of Roads',      vatin: 'OM1100556677', type: 'B2G', country: 'OM' },
  { name: 'Jebel Ali Equipment Trading FZE',   vatin: 'AE100234567800003', type: 'Export', country: 'AE' },
  { name: 'Al Batinah Logistics Services LLC', vatin: 'OM1100778899', type: 'B2B', country: 'OM' },
  { name: 'Walk-in Customer',                  vatin: null,          type: 'B2C', country: 'OM' },
  { name: 'Salalah Port Services SAOC',        vatin: 'OM1100990011', type: 'B2B', country: 'OM' },
  { name: 'Nizwa Auto Spares LLC',             vatin: 'OM1100221144', type: 'B2B', country: 'OM' }
];

/* --- suppliers, for the inbound flow --------------------------------------- */
const SUPPLIERS = [
  { name: 'Falaj Industrial Supplies LLC',  vatin: 'OM1100447722', peppol: '0248:OM1100447722' },
  { name: 'Ruwi Marine Contracting SAOC',   vatin: 'OM1100663311', peppol: '0248:OM1100663311' },
  { name: 'Barka Freight Forwarding LLC',   vatin: 'OM1100885544', peppol: '0248:OM1100885544' },
  { name: 'Muscat Tyre & Battery Co LLC',   vatin: 'OM1100119966', peppol: '0248:OM1100119966' }
];

/* --- the nine outbound stages (proposal §5) --------------------------------
   Record (5) is a hot write to the operational store BEFORE transmission —
   the only evidence of what was attempted if the send fails. Archive (9) is
   the long-term legal record, written AFTER the outcome arrives because it
   contains the ASP acknowledgements.                                        */
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

/* documents in flight, by stage — sums to GROUP.todayPending (62) */
const STAGE_COUNT = [8, 11, 9, 13, 5, 12, 4];

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
    at: '18 Aug 2026 09:14:07.633', el: '+0.4 s', st: 'ok',
    body: 'The ASP confirms the e-invoice was generated and validated. This is custody, not delivery.',
    ref: 'ASP-OM-2026-0818-44718' },
  { id: 'ota',   leg: 'Tax Authority → service provider', name: 'Reported to the Tax Authority',
    at: '18 Aug 2026 09:15:52.400', el: '+1 m 45 s', st: 'ok',
    body: 'The ASP reported the Tax Data Document to Fawtara and the OTA acknowledged it. The Hub never talks to the OTA directly.',
    ref: 'OTA-RPT-2026-0818-94685' },
  { id: 'deliv', leg: 'Buyer’s provider → service provider', name: 'Delivered to the buyer',
    at: '18 Aug 2026 09:16:41.008', el: '+2 m 34 s', st: 'ok',
    body: 'The buyer’s access point confirmed receipt. This leg is outside the group’s control and can take hours.',
    ref: 'MLS-DELIVERED' }
];

/* A second document, still waiting on two of the three legs. */
const LEGS_PENDING = [
  { id: 'ack',   name: 'Validated and accepted by the ASP', at: '18 Aug 2026 10:02:14.880', st: 'ok',
    body: 'Receipt issued 0.4 s after submission.' },
  { id: 'ota',   name: 'Reported to the Tax Authority',     at: 'awaiting', st: 'pending',
    body: 'Within the reporting window. No action required.' },
  { id: 'deliv', name: 'Delivered to the buyer',            at: 'awaiting', st: 'pending',
    body: 'The buyer’s access point has not yet confirmed. Retried automatically by the ASP.' }
];

/* --- outbound documents ----------------------------------------------------
   stage indexes into STAGES; state: ok | active | failed | held
   The tracked invoice ZCL-SINV-2026-00841 (Zubair Corporation LLC, SAP
   S/4HANA) is the one followed end-to-end through the walkthrough.          */
const INVOICES = [
  { no: 'ZCL-SINV-2026-00841', tenant: 'ZCL', cust: 0, net: 48200.000, vat: 2410.000, total: 50610.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '18 Aug 09:14:02',
    uuid: 'b7f4c2e1-9a3d-5c8b-a1f6-2e7d4b9c0a35', ackNo: 'ASP-OM-2026-0818-44718', ref: 'PEP-8842-2026',
    lines: 6, po: 'PO-88213' },
  { no: 'GAC-SINV-2026-118420', tenant: 'GAC', cust: 1, net: 118400.000, vat: 5920.000, total: 124320.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '18 Aug 09:21:47',
    uuid: 'c1a8d3f2-4b7e-6d9c-b2a7-3f8e5c0d1b46', ackNo: 'ASP-OM-2026-0818-44719', ref: 'PEP-8843-2026',
    lines: 12, po: 'PO-88220' },
  { no: 'OLG-SINV-2026-08810', tenant: 'OLG', cust: 3, net: 86200.000, vat: 0.000, total: 86200.000,
    cur: 'OMR', type: 'Invoice', scen: 'Export', stage: 6, state: 'active', retry: 0, created: '18 Aug 10:02:11',
    uuid: 'd2b9e4a3-5c8f-7e0d-c3b8-4a9f6d1e2c57', ackNo: 'ASP-OM-2026-0818-44755', ref: 'PEP-8851-2026',
    lines: 4, po: 'PO-11907', awaiting: 'OTA report · buyer delivery' },
  { no: 'ZBS-SINV-2026-00934', tenant: 'ZBS', cust: 4, net: 3420.000, vat: 171.000, total: 3591.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 3, state: 'failed', retry: 2, created: '18 Aug 10:11:38',
    uuid: 'e3c0f5b4-6d9a-8f1e-d4c9-5b0a7e2f3d68', ackNo: null, ref: null, lines: 3, po: null,
    owner: 'entity' },
  { no: 'GAC-SINV-2026-118455', tenant: 'GAC', cust: 6, net: 9150.000, vat: 457.500, total: 9607.500,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 3, state: 'active', retry: 0, created: '18 Aug 10:14:05',
    uuid: 'f4d1a6c5-7e0b-9a2f-e5d0-6c1b8f3a4e79', ackNo: null, ref: null, lines: 8, po: 'PO-4471' },
  { no: 'ZCL-CRNT-2026-00218', tenant: 'ZCL', cust: 0, net: -4200.000, vat: -210.000, total: -4410.000,
    cur: 'OMR', type: 'Credit Note', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '18 Aug 10:26:14',
    uuid: 'c7a4d9f8-0b3e-2d5c-b8a3-9f4e1c6d7b02', ackNo: 'ASP-OM-2026-0818-44736', ref: 'PEP-8863-2026',
    lines: 1, po: null, against: 'ZCL-SINV-2026-00790' },
  { no: 'GAC-SIMP-2026-441207', tenant: 'GAC', cust: 5, net: 84.400, vat: 4.220, total: 88.620,
    cur: 'OMR', type: 'Simplified', scen: 'B2C', stage: 8, state: 'ok', retry: 0, created: '18 Aug 10:18:52',
    uuid: 'a5e2b7d6-8f1c-0b3a-f6e1-7d2c9a4b5f80', ackNo: 'ASP-OM-2026-0818-44731', ref: 'PEP-8859-2026',
    lines: 5, po: null },
  { no: 'IHE-SINV-2026-00611', tenant: 'IHE', cust: 7, net: 42750.000, vat: 2137.500, total: 44887.500,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 4, state: 'ok', retry: 0, created: '18 Aug 10:22:30',
    uuid: 'b6f3c8e7-9a2d-1c4b-a7f2-8e3d0b5c6a91', ackNo: null, ref: null, lines: 2, po: 'PO-3390' },
  { no: 'OCS-SINV-2026-01181', tenant: 'OCS', cust: 2, net: 15600.000, vat: 780.000, total: 16380.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2G', stage: 2, state: 'active', retry: 0, created: '18 Aug 10:31:09',
    uuid: 'd8b5e0a9-1c4f-3e6d-c9b4-0a5f2d7e8c13', ackNo: null, ref: null, lines: 7, po: 'PO-11912' },
  { no: 'SAY-SINV-2026-02673', tenant: 'SAY', cust: 6, net: 7480.000, vat: 374.000, total: 7854.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 1, state: 'active', retry: 0, created: '18 Aug 10:38:56',
    uuid: null, ackNo: null, ref: null, lines: 9, po: 'PO-88231' },
  { no: 'ZAG-SINV-2026-03408', tenant: 'ZAG', cust: 4, net: 12900.000, vat: 645.000, total: 13545.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 0, state: 'active', retry: 0, created: '18 Aug 10:41:12',
    uuid: null, ackNo: null, ref: null, lines: 4, po: 'PO-2201' },
  { no: 'OLG-SINV-2026-08790', tenant: 'OLG', cust: 3, net: 28700.000, vat: 0.000, total: 28700.000,
    cur: 'OMR', type: 'Invoice', scen: 'Export', stage: 5, state: 'failed', retry: 4, created: '18 Aug 08:52:20',
    uuid: 'a1e8b3d2-4f7c-6b9a-f2e7-3d8c5a0b1f46', ackNo: null, ref: null, lines: 2, po: null,
    owner: 'platform' },
  { no: 'IHE-SINV-2026-00610', tenant: 'IHE', cust: 5, net: 1890.000, vat: 94.500, total: 1984.500,
    cur: 'OMR', type: 'Simplified', scen: 'B2C', stage: 8, state: 'ok', retry: 0, created: '18 Aug 08:14:33',
    uuid: 'b2f9c4e3-5a8d-7c0b-a3f8-4e9d6b1c2a57', ackNo: 'ASP-OM-2026-0818-44702', ref: 'PEP-8801-2026',
    lines: 3, po: null }
];

/* --- inbound supplier documents (proposal §5 inbound) ----------------------- */
const INBOUND = [
  { no: 'FIS-INV-2026-11842', supplier: 0, to: 'ZCL', recv: '18 Aug 10:29:16', net: 8640.000,
    vat: 432.000, total: 9072.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00914',
    erpState: 'Draft — awaiting review', lines: 14, po: 'PO-88190' },
  { no: 'RMC-INV-2026-00733', supplier: 1, to: 'GAC', recv: '18 Aug 10:24:03', net: 21500.000,
    vat: 1075.000, total: 22575.000, stage: 5, state: 'ok', erpRef: 'PINV-ATL-004411',
    erpState: 'Draft — awaiting review', lines: 6, po: 'PO-11866' },
  { no: 'BFF-INV-2026-04120', supplier: 2, to: 'OLG', recv: '18 Aug 10:19:48', net: 3180.000,
    vat: 159.000, total: 3339.000, stage: 4, state: 'active', erpRef: null,
    erpState: 'Creating draft', lines: 3, po: null },
  { no: 'FIS-INV-2026-02277', supplier: 0, to: 'ZCL', recv: '18 Aug 10:12:31', net: 14200.000,
    vat: 710.000, total: 14910.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00913',
    erpState: 'Draft — awaiting review', lines: 9, po: 'PO-88177' },
  { no: 'MTB-CRN-2026-00318', supplier: 3, to: 'GAC', recv: '18 Aug 09:58:02', net: -1250.000,
    vat: -62.500, total: -1312.500, stage: 5, state: 'ok', erpRef: 'PCRN-ATL-00072',
    erpState: 'Draft — awaiting review', lines: 1, po: null, credit: true },
  { no: 'UNK-INV-2026-00051', supplier: null, to: null, recv: '18 Aug 09:41:19', net: 990.000,
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

/* --- ERP-side invoice list (screen 1 · SAP S/4HANA, Zubair Corporation LLC) -- */
const ERP_INVOICES = [
  { no: 'ZCL-SINV-2026-00841', cust: 'Muscat Bay Hospitality LLC', date: '18-08-2026', due: '17-09-2026',
    net: 48200.000, vat: 2410.000, total: 50610.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'b7f4c2e1…0a35', qr: true },
  { no: 'ZCL-SINV-2026-00840', cust: 'Sohar Steel Rolling LLC', date: '18-08-2026', due: '17-09-2026',
    net: 118400.000, vat: 5920.000, total: 124320.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'c1a8d3f2…1b46', qr: true },
  { no: 'ZCL-SINV-2026-00842', cust: 'Salalah Port Services SAOC', date: '18-08-2026', due: '17-09-2026',
    net: 7480.000, vat: 374.000, total: 7854.000, docStatus: 'Posted', eStatus: 'In Progress',
    ready: true, uuid: null, qr: false },
  { no: 'ZCL-CRNT-2026-00218', cust: 'Muscat Bay Hospitality LLC', date: '18-08-2026', due: '—',
    net: -4200.000, vat: -210.000, total: -4410.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'c7a4d9f8…7b02', qr: false, credit: true },
  { no: 'ZCL-SINV-2026-00843', cust: 'Nizwa Auto Spares LLC', date: '18-08-2026', due: '17-09-2026',
    net: 33150.000, vat: 1657.500, total: 34807.500, docStatus: 'Draft', eStatus: 'Not Applicable',
    ready: false, uuid: null, qr: false },
  { no: 'ZCL-SINV-2026-00839', cust: 'Directorate General of Roads', date: '17-08-2026', due: '16-09-2026',
    net: 51200.000, vat: 2560.000, total: 53760.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'd4c1b8a7…3e92', qr: true },
  { no: 'ZCL-SINV-2026-00838', cust: 'Sohar Steel Rolling LLC', date: '17-08-2026', due: '16-09-2026',
    net: 7300.000, vat: 365.000, total: 7665.000, docStatus: 'Posted', eStatus: 'Rejected by ASP',
    ready: true, uuid: 'e5d2c9b8…4f03', qr: false }
];

/* --- mapping: what the ERP actually exposes --------------------------------
   The source list an analyst picks from, drawn from the SAP S/4HANA billing
   document service. 386 fields are discovered; these are the billing ones.  */
const ERP_SCHEMA = [
  { f: 'BillingDocument',            t: 'string',  ex: '9410000841' },
  { f: 'BillingDocumentDate',        t: 'date',    ex: '20260818' },
  { f: 'BillingDocumentType',        t: 'string',  ex: 'F2' },
  { f: 'BillingDocumentIsCancelled', t: 'boolean', ex: 'false' },
  { f: 'TransactionCurrency',        t: 'string',  ex: 'OMR' },
  { f: 'CompanyCode',                t: 'string',  ex: 'ZUB1' },
  { f: 'CompanyRegistration',        t: 'string',  ex: '1008431' },
  { f: 'CompanyVATNumber',           t: 'string',  ex: '1200094685' },
  { f: 'CompanyAddressCity',         t: 'string',  ex: 'Muscat' },
  { f: 'CompanyCountry',             t: 'string',  ex: 'OM' },
  { f: 'CustomerCode',               t: 'string',  ex: 'CUST-00412' },
  { f: 'CustomerName',               t: 'string',  ex: '  muscat bay hospitality llc ' },
  { f: 'CustomerVATNumber',          t: 'string',  ex: '1100112233' },
  { f: 'CustomerCountry',            t: 'string',  ex: 'OM' },
  { f: 'CustomerAddressStreet',      t: 'string',  ex: '(empty in this ERP)' },
  { f: 'NetAmount',                  t: 'decimal', ex: '48200.00' },
  { f: 'TaxAmount',                  t: 'decimal', ex: '2410.00' },
  { f: 'InvoiceTotal',               t: 'decimal', ex: '50610.00' },
  { f: 'AmountDue',                  t: 'decimal', ex: '50610.00' },
  { f: 'TaxRate',                    t: 'decimal', ex: '5.0' },
  { f: 'ProductCode',                t: 'string',  ex: 'SVC-4471' },
  { f: 'ProductDescription',         t: 'string',  ex: 'Facilities management, monthly retainer' },
  { f: 'BillingQuantity',            t: 'decimal', ex: '1.000' },
  { f: 'BillingQuantityUnit',        t: 'string',  ex: 'EA' },
  { f: 'NetPriceAmount',             t: 'decimal', ex: '48200.000' },
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
  { v: 'const:CR',           n: 'const:CR — Commercial Registration scheme' },
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
    { erp: 'CompanyRegistration',    std: 'IBT-029', stdName: 'Seller identifier (CR)', xf: 'const:CR', req: 'Mandatory', ok: true,
      dnote: 'The entity’s own Commercial Registration, scheme CR (code list CL-06-OM). This is what distinguishes each of the twelve members — the VAT identifier below is shared across the group.' },
    { erp: 'CompanyVATNumber',       std: 'BT-31', stdName: 'Seller VAT identifier', xf: 'prefix:OM',   req: 'Mandatory', ok: true,
      dnote: 'The shared VAT Group TRN OM1200094685 — the same value for all twelve entities. A data field, not the routing identity.' },
    { erp: '—',                      std: 'BTOM-004', stdName: 'Seller participant ID', xf: 'derive:0248', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Each entity is its own Peppol participant, built from its own Commercial Registration under scheme 0248 — its own endpoint, SMP entry and certificate. The exact Oman EAS scheme is confirmed on the OTA onboarding portal.' },
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
  profile: 'PINT-OM · Oman CIUS Schematron', ran: '18 Aug 2026 10:22:31 GST', ms: 284,
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
  profile: 'PINT-OM · Oman CIUS Schematron', ran: '18 Aug 2026 10:11:52 GST', ms: 261,
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
  { ts: '10:22:28.114', lv: 'info', txt: 'Poll tick — entity ZCL, watermark 2026-08-18T10:21:44Z' },
  { ts: '10:22:28.291', lv: 'info', txt: 'Fetched raw payload · 14.2 KB · 27 fields (allowlist applied)' },
  { ts: '10:22:28.402', lv: 'ok',   txt: 'Idempotency check passed — (ZCL, ZCL-SINV-2026-00841) not previously seen' },
  { ts: '10:22:28.556', lv: 'info', txt: 'Mapping profile ZCL/v3 applied — 46 of 47 fields resolved' },
  { ts: '10:22:28.703', lv: 'info', txt: 'Scenario detected: B2B domestic · standard rate 5%' },
  { ts: '10:22:28.844', lv: 'ok',   txt: 'BTOM-002 UUID derived — b7f4c2e1-9a3d-5c8b-a1f6-2e7d4b9c0a35' },
  { ts: '10:22:29.017', lv: 'info', txt: 'UBL 2.1 Invoice built · 8.9 KB · 6 lines' },
  { ts: '10:22:29.188', lv: 'info', txt: 'Oman CIUS Schematron — evaluating 150 assertions' },
  { ts: '10:22:31.472', lv: 'warn', txt: 'IBR-W-014 · payment means defaulted to 30' },
  { ts: '10:22:31.474', lv: 'ok',   txt: 'Validation passed — 148 passed, 0 failed, 2 warnings (284 ms)' },
  { ts: '10:22:31.610', lv: 'ok',   txt: 'Archived — XML, validation report and audit trail written before transmission' },
  { ts: '10:22:31.788', lv: 'ok',   txt: 'State → READY_FOR_ASP · queued on entity channel ZCL' }
];

/* --- ASP exchange ----------------------------------------------------------- */
const ASP = {
  provider: 'Accredited Service Provider — OTA licence ASP-OM-014',
  endpoint: 'https://ap.asp-oman.om/peppol/v1/documents',
  auth: 'mTLS · client certificate held in the platform vault',
  sentAt: '18 Aug 2026 09:14:07.221 GST',
  ackAt:  '18 Aug 2026 09:14:07.633 GST',
  otaAt:  '18 Aug 2026 09:15:52.400 GST',
  mlsAt:  '18 Aug 2026 09:16:41.008 GST',
  rtt: 372,
  http: '202 Accepted',
  ref: 'PEP-8842-2026',
  ackNo: 'ASP-OM-2026-0818-44718',
  otaRef: 'OTA-RPT-2026-0818-94685',
  msgId: 'urn:uuid:b7f4c2e1-9a3d-5c8b-a1f6-2e7d4b9c0a35',
  sender: '0248:1008431',
  sellerVatin: 'OM1200094685',
  sellerCr: 'CR 1008431',
  receiver: '0248:OM1100112233',
  docType: 'Peppol PINT billing — Oman',
  process: 'Peppol BIS billing'
};

/* --- history ---------------------------------------------------------------- */
const HISTORY = [
  { no: 'ZCL-SINV-2026-00841', tenant: 'ZCL', date: '18 Aug 09:14', total: 50610.000, type: 'Invoice',  dir: 'out', st: 'success', ack: 'ASP-OM-2026-0818-44718', retries: 0 },
  { no: 'GAC-SINV-2026-118420', tenant: 'GAC', date: '18 Aug 09:21', total: 124320.000, type: 'Invoice', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0818-44719', retries: 0 },
  { no: 'IHE-SINV-2026-00610', tenant: 'IHE', date: '18 Aug 08:14', total: 1984.500, type: 'Simplified', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0818-44702', retries: 0 },
  { no: 'OLG-SINV-2026-08790', tenant: 'OLG', date: '18 Aug 08:52', total: 28700.000, type: 'Invoice',  dir: 'out', st: 'failed',  ack: null, retries: 4, err: 'ASP timeout — transient, retrying' },
  { no: 'ZCL-CRNT-2026-00218', tenant: 'ZCL', date: '18 Aug 10:26', total: -4410.000, type: 'Credit Note', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0818-44736', retries: 0 },
  { no: 'FIS-INV-2026-11842',  tenant: 'ZCL', date: '18 Aug 10:29', total: 9072.000, type: 'Supplier invoice', dir: 'in', st: 'success', ack: 'PINV-2026-00914', retries: 0 },
  { no: 'RMC-INV-2026-00733',  tenant: 'GAC', date: '18 Aug 10:24', total: 22575.000, type: 'Supplier invoice', dir: 'in', st: 'success', ack: 'PINV-ATL-004411', retries: 0 },
  { no: 'GAC-SIMP-2026-441207', tenant: 'GAC', date: '18 Aug 10:18', total: 88.620, type: 'Simplified',  dir: 'out', st: 'success', ack: 'ASP-OM-2026-0818-44731', retries: 0 },
  { no: 'ZBS-SINV-2026-00934', tenant: 'ZBS', date: '18 Aug 10:11', total: 3591.000, type: 'Invoice',   dir: 'out', st: 'failed',  ack: null, retries: 2, err: 'IBR-CO-15 · total mismatch' },
  { no: 'OCS-SINV-2026-01179', tenant: 'OCS', date: '18 Aug 07:40', total: 44210.000, type: 'Invoice',  dir: 'out', st: 'reprocessed', ack: 'ASP-OM-2026-0818-44688', retries: 1 },
  { no: 'ZCL-SINV-2026-00838', tenant: 'ZCL', date: '17 Aug 16:22', total: 7665.000, type: 'Invoice',   dir: 'out', st: 'rejected', ack: null, retries: 0, err: 'ASP rejected — buyer participant not registered' },
  { no: 'MTB-CRN-2026-00318',  tenant: 'GAC', date: '18 Aug 09:58', total: -1312.500, type: 'Supplier credit note', dir: 'in', st: 'success', ack: 'PCRN-ATL-00072', retries: 0 },
  { no: 'OLG-SINV-2026-08810', tenant: 'OLG', date: '18 Aug 10:02', total: 86200.000, type: 'Invoice',  dir: 'out', st: 'pending', ack: null, retries: 0 },
  { no: 'IHE-SINV-2026-00611', tenant: 'IHE', date: '18 Aug 10:22', total: 44887.500, type: 'Invoice',  dir: 'out', st: 'pending', ack: null, retries: 0 },
  { no: 'ZCL-SINV-2026-00839', tenant: 'ZCL', date: '17 Aug 14:11', total: 53760.000, type: 'Invoice',  dir: 'out', st: 'success', ack: 'ASP-OM-2026-0817-44590', retries: 0 }
];

/* --- reporting -------------------------------------------------------------
   Month to date, August 2026. Figures are per entity and reconcile upward.
   The six busiest members are shown; the tail (six smaller entities) makes
   up the difference to GROUP.mtdTotal. ack + failed = docs on every row;
   vat = (net − zero) × 5%.                                                  */
const REPORT_ROWS = [
  { id: 'GAC', docs: 41000, net: 4180000.000, vat: 203000.000, zero: 120000.000, failed: 300, ack: 40700 },
  { id: 'IHE', docs: 2700,  net: 1240000.000, vat: 59000.000,  zero: 60000.000,  failed: 22,  ack: 2678 },
  { id: 'SAY', docs: 2650,  net: 980000.000,  vat: 48000.000,  zero: 20000.000,  failed: 20,  ack: 2630 },
  { id: 'OLG', docs: 880,   net: 1610000.000, vat: 70000.000,  zero: 210000.000, failed: 12,  ack: 868 },
  { id: 'ZAG', docs: 340,   net: 612000.000,  vat: 30200.000,  zero: 8000.000,   failed: 6,   ack: 334 },
  { id: 'ZCL', docs: 96,    net: 486000.000,  vat: 24300.000,  zero: 0.000,      failed: 0,   ack: 96 }
];

const REPORT_TYPES = [
  { n: 'VAT summary by entity',        d: 'Net, VAT and zero-rated totals for a period, per legal entity in the group.', tag: 'Finance' },
  { n: 'Reporting completeness',       d: 'Documents raised in the ERP against documents acknowledged by the ASP.', tag: 'Compliance' },
  { n: 'Exception ageing',             d: 'Open failures by age and by who owns the fix.', tag: 'Operations' },
  { n: 'Document type breakdown',      d: 'Invoices, credit notes and simplified documents, by entity.', tag: 'Finance' },
  { n: 'Inbound supplier documents',   d: 'Received, routed, drafted and still awaiting review.', tag: 'Operations' },
  { n: 'Wave readiness',               d: 'Mapping and connection progress against the April 2027 mandate.', tag: 'Programme' }
];

/* --- users and access (proposal §7) ---------------------------------------- */
const ROLES = [
  { k: 'entity-admin', n: 'Entity administrator', d: 'Adds colleagues, sets roles, receives the compliance digest.' },
  { k: 'finance',      n: 'Finance user',         d: 'Sees documents, resolves data exceptions, reprocesses.' },
  { k: 'readonly',     n: 'Read-only',            d: 'Views documents and reports. Cannot act on anything.' },
  { k: 'group-admin',  n: 'Group administrator',  d: 'Central team. All entities, all configuration. Cannot post to any ERP.' }
];

const ENTITY_USERS = [
  { name: 'N. Al-Kindi',   email: 'n.alkindi@zubaircorp.com',   role: 'entity-admin', state: 'active',  last: 'Today 10:31', who: 'ZCL' },
  { name: 'F. Al-Harthy',  email: 'f.alharthy@zubaircorp.com',  role: 'finance',      state: 'active',  last: 'Today 09:48', who: 'ZCL' },
  { name: 'R. Menon',      email: 'r.menon@zubaircorp.com',     role: 'finance',      state: 'active',  last: 'Yesterday',   who: 'ZCL' },
  { name: 'S. Al-Zadjali', email: 's.alzadjali@zubaircorp.com', role: 'readonly',     state: 'active',  last: '3 days ago',  who: 'ZCL' },
  { name: 'A. Baloushi',   email: 'a.baloushi@zubaircorp.com',  role: 'finance',      state: 'invited', last: 'Invited today', who: 'ZCL' }
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
  entity: 'Zubair Enterprises Southern LLC',
  code: 'ZUB-011', vatin: GROUP_TRN, wave: 3,
  steps: ['Entity details', 'Connection method', 'Connect and test', 'Map the fields', 'Test document', 'Go live'],
  at: 2,
  probe: [
    { t: 'Reaching the Autoline API', st: 'ok',   ms: 214 },
    { t: 'Credentials accepted',      st: 'ok',   ms: 96 },
    { t: 'Reading a sample invoice',  st: 'ok',   ms: 431 },
    { t: 'Fields discovered',         st: 'ok',   ms: 88, note: '46 fields found' },
    { t: 'Write-back permission',     st: 'warn', ms: 0,  note: 'Not yet granted by the entity' }
  ]
};

/* --- group activity feed ---------------------------------------------------- */
const ACTIVITY = [
  { st: 'ok',   t: '10:35', title: 'Acknowledgement received', body: 'SAY-SINV-2026-02671 · reported to the OTA', tag: 'Sayarti' },
  { st: 'fail', t: '10:11', title: 'Validation failed', body: 'ZBS-SINV-2026-00934 · IBR-CO-15 total mismatch', tag: 'Zakher Building' },
  { st: 'ok',   t: '10:29', title: 'Supplier invoice drafted', body: 'FIS-INV-2026-11842 · draft PINV-2026-00914 awaiting review', tag: 'Zubair Corporation' },
  { st: 'warn', t: '09:58', title: 'Connector latency elevated', body: 'Autoline extract p95 at 3.4 s — above the 2 s threshold', tag: 'General Automotive' },
  { st: 'warn', t: '08:22', title: 'No documents received', body: 'Nothing since 04:38 from the Autoline connector.', tag: 'Zubair Enterprises S.' },
  { st: 'ok',   t: '09:40', title: 'Mapping profile published', body: 'Dhofar Automotive v3 — 43 of 46 fields resolved', tag: 'Dhofar Automotive' }
];

/* --- exceptions, split by who owns the fix (proposal §7) -------------------- */
/* Entity-owned exceptions, shown to the entity in its own portal. These are
   The Zubair Corporation LLC's (ZCL) own documents — the portal shows nothing
   belonging to any other member. */
const EXCEPTIONS_ENTITY = [
  { title: 'Buyer VAT number missing', count: 2, docs: ['ZCL-SINV-2026-00842', 'ZCL-SINV-2026-00844'],
    why: 'The customer record has no VAT number, and the buyer is a registered business.',
    fix: 'Add the VAT number to the customer in your own ERP, then press Reprocess.' },
  { title: 'Invoice total does not add up', count: 1, docs: ['ZCL-SINV-2026-00845'],
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
  { title: 'Connector went quiet', count: 1, who: 'Central technical team',
    why: 'Zubair Enterprises Southern has sent nothing since 04:38. The Autoline connector appears not to have run.',
    fix: 'No entity action yet. Central team is checking the connection.' }
];

/* --- ERP status sync steps (final screen) ---------------------------------- */
const SYNC_STEPS = [
  { name: 'Invoice posted in the ERP', t: '18 Aug 09:14:02', st: 'ok',
    body: 'Billing document ZCL-SINV-2026-00841 posted by A. Al-Balushi in SAP S/4HANA. Document status set to Posted.' },
  { name: 'Collected by the Hub', t: '18 Aug 09:14:04', st: 'ok',
    body: 'Method 1 — Direct API. The Hub called the SAP billing document service (BAPI / CPI). Raw payload 14.2 KB, field allowlist applied.' },
  { name: 'Mapped, built and validated', t: '18 Aug 09:14:06', st: 'ok',
    body: 'Profile ZCL/v3 applied. UBL 2.1 built. Oman CIUS Schematron passed — 148 rules, 2 warnings.' },
  { name: 'Archived', t: '18 Aug 09:14:06', st: 'ok',
    body: 'XML, validation report and audit trail written to the compliance archive before anything was transmitted.' },
  { name: 'Transmitted to the ASP', t: '18 Aug 09:14:07', st: 'ok',
    body: 'Accepted by the accredited provider in 372 ms. Peppol reference PEP-8842-2026.' },
  { name: 'Outcomes tracked on three legs', t: '18 Aug 09:16:41', st: 'ok',
    body: 'ASP accepted it at 09:14:07. The ASP reported it to the Tax Authority at 09:15:52. The buyer’s provider confirmed delivery at 09:16:41.' },
  { name: 'Result published on the interface', t: '18 Aug 09:16:43', st: 'ok',
    body: 'Held against this invoice and available to the ERP: UUID, e-invoice status, acknowledgement number, Peppol reference and QR information. The ERP-side connector that collects them is built by the entity.' },
  { name: 'Collected by the ERP', t: '18 Aug 09:16:43', st: 'ok',
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
