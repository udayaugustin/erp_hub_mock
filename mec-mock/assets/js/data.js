/* ==========================================================================
   Muscat Engineering Consultancy LLC (MEC) × Fawtara — E-Invoicing Scope Walkthrough · demonstration dataset

   REAL: MEC's legal name, that it is a Muscat-based engineering and project
   management consultancy (founded 2002) serving oil, gas and energy clients,
   with services from feasibility and FEED through detailed engineering, PMC /
   owner's engineer and technical safety. Sourced from public business
   directories, not from MEC — see MEC-REAL-FACTS.md.
   INVENTED: every VATIN, CR number, client, subcontractor, contract, rate,
   manhour figure, document number and tax treatment below. None of it states
   how MEC actually invoices. Counterparties are fictional on purpose.

   THIS MOCK IS A DISCOVERY / ALIGNMENT TOOL, not a finished compliant flow.
   Its spine is the SIX ways an engineering consultancy raises or receives
   invoices — lump-sum milestones, reimbursable manhours, credit and debit
   notes, services exported to clients outside Oman, subcontractor invoices in,
   and imported services under the reverse charge. Where the OTA has not
   settled a treatment (export of services and branch recharges, retention and
   advance payments, imported services) the mock shows Fawtara's RECOMMENDED
   reading, always flagged "to confirm with OTA".

   MEC's ERP is not confirmed, so the origin surface says "Enterprise ERP" and
   names no product.

   IDENTITY — single entity. One VATIN, one Commercial Registration, one Peppol
   participant (scheme 0248, so 0248:OM<VATIN>). No VAT group.

   Shapes are real: Omani VATIN OM + 10 digits, OMR to 3 decimals, 5% VAT,
   consultancy billed by milestone or by approved manhours.

   Demo clock: Thursday 20 August 2026, 10:42 GST (Oman's week runs Sun-Thu).
   ========================================================================== */

const DEMO_DATE  = '20 Aug 2026';
const DEMO_DAY   = 'Thursday';
const DEMO_CLOCK = '20 Aug 2026, 10:42 GST';
const VAT_RATE   = 5;

/* --- the entity ------------------------------------------------------------ */
const MEC = {
  id: 'MEC', name: 'Muscat Engineering Consultancy', legal: 'Muscat Engineering Consultancy LLC',
  vatin: 'OM1100387215', cr: '1072946', peppol: '0248:OM1100387215',
  city: 'Muscat', country: 'OM'
};
const TENANTS = [{ ...MEC, short: 'MEC', sector: 'Engineering & project management consultancy',
  erp: 'Enterprise ERP', status: 'live', health: 'ok' }];

/* --- the six streams — THE spine of this mock ------------------------------
   dir: in (MEC receives) | out (MEC issues)
   mode: live (cleared per document)
   position: settled | proposed (Fawtara's reading, to confirm)               */
const STREAMS = [
  { id: 'lumpsum',  n: 1, group: 'seller', dir: 'out', title: 'Lump-sum engineering · milestones',
    role: 'MEC as seller', origin: 'Enterprise ERP', target: 'OTA — cleared',
    doc: 'Standard tax invoice', mode: 'live', position: 'settled',
    today: 6, mtd: 58,
    blurb: 'FEED and detailed-engineering contracts billed on certified milestones. The ERP raises the invoice when the client signs off a deliverable; the Hub clears it live — the canonical flow. Retention and advance recovery have a treatment to confirm.' },
  { id: 'manhour',  n: 2, group: 'seller', dir: 'out', title: 'Reimbursable manhours · PMC & site',
    role: 'MEC as seller', origin: 'Enterprise ERP', target: 'OTA — cleared',
    doc: 'Standard tax invoice', mode: 'live', position: 'settled',
    today: 9, mtd: 71,
    blurb: 'Project management, owner’s-engineer and site-supervision contracts billed monthly from client-approved timesheets — hours by discipline times the contract rate. Same B2B invoice, same pipe.' },
  { id: 'adjust',   n: 3, group: 'seller', dir: 'out', title: 'Credit & debit notes · disputes, escalation',
    role: 'MEC as seller', origin: 'Enterprise ERP', target: 'OTA — cleared',
    doc: 'Credit / debit note', mode: 'live', position: 'settled',
    today: 3, mtd: 26,
    blurb: 'Manhours the client disputes after invoicing, and rate escalation agreed later. Each note references the original invoice and is cleared like any other document.' },
  { id: 'export',   n: 4, group: 'seller', dir: 'out', title: 'Services to clients outside Oman',
    role: 'MEC as seller', origin: 'Enterprise ERP', target: 'OTA — cleared',
    doc: 'Zero-rated tax invoice', mode: 'live', position: 'proposed',
    today: 1, mtd: 5,
    blurb: 'Engineering delivered from Muscat for a client with no establishment in Oman, at 0% VAT with a reason code. Fawtara’s reading of the zero-rating — and of recharges to MEC’s own branches abroad — is to confirm with the OTA.' },
  { id: 'subcon',   n: 5, group: 'buyer', dir: 'in',  title: 'Subcontractors & suppliers in Oman',
    role: 'MEC as buyer', origin: 'Peppol inbound', target: 'Enterprise ERP',
    doc: 'Supplier tax invoice', mode: 'live', position: 'settled',
    today: 7, mtd: 88,
    blurb: 'Survey, drafting and specialist subcontractors’ e-invoices, already reported through the OTA, arrive over Peppol. Fawtara matches them to MEC and the project, and lands them as draft purchase invoices — nobody keys them in.' },
  { id: 'rcm',      n: 6, group: 'buyer', dir: 'in',  title: 'Imported services · reverse charge',
    role: 'MEC as buyer', origin: 'Foreign supplier (PDF)', target: 'Enterprise ERP',
    doc: 'Self-accounted record', mode: 'live', position: 'proposed',
    today: 1, mtd: 9,
    blurb: 'Engineering-software licences and specialist studies bought from suppliers outside Oman. No Peppol invoice arrives; MEC self-accounts the VAT. Whether that needs its own e-document is to confirm with the OTA.' }
];
function stream(id) { return STREAMS.find(s => s.id === id); }

/* --- Fawtara's recommended OTA positions ----------------------------------
   The mock's only load-bearing tax claims. Each renders with the "to confirm
   with OTA" tag.                                                             */
const OTA_POSITIONS = [
  { id: 'export', agenda: 'Export of services',
    headline: 'Services for a client outside Oman — 0% with a reason code',
    basis: 'Engineering performed in Muscat for a client with no place of residence or establishment in Oman, and used outside Oman. Fawtara reads it as a zero-rated export of services, with the evidence held against the invoice.',
    treatment: [
      'The invoice carries VAT category Z at 0%, with an exemption reason code on the tax subtotal.',
      'The buyer is identified by a foreign tax ID and country, not an Omani VATIN — so the scenario is Export, not B2B.',
      'The evidence — the client’s non-residence and where the deliverables are used (the facility location in the contract) — is referenced on the invoice and archived with it.'
    ],
    channels: 'Does not apply where the client has an Omani branch that receives the service, or where engineering supports an asset in Oman. That boundary is an assumption until the OTA confirms it.',
    tag: 'Fawtara’s recommended reading — to confirm with OTA' },
  { id: 'branch', agenda: 'Recharges to MEC’s own branches abroad',
    headline: 'Head office to branch — a supply, or not?',
    basis: 'MEC works through branches outside Oman. When Muscat staff work on a branch’s project, the cost is recharged. Whether a recharge within one legal person is a supply is not settled for e-invoicing.',
    treatment: [
      'Working assumption: head office and its own branch are one legal person, so a recharge is an internal book entry and raises no tax invoice.',
      'The recharge is kept out of the e-invoicing pipe entirely — the ERP flags it as internal and the Hub never collects it.',
      'Where the branch’s client is billed directly from Muscat, that is an ordinary invoice under stream 4.'
    ],
    channels: 'Decides which documents enter the pipe at all — so it is settled before build, not after.',
    tag: 'Fawtara’s recommended reading — to confirm with OTA' },
  { id: 'retention', agenda: 'Retention and advance payments',
    headline: 'When is VAT due on retention, and on an advance?',
    basis: 'Clients hold back a retention on each certified milestone, released at handover. They also pay an advance that is recovered from later invoices. When VAT falls due on each is not settled.',
    treatment: [
      'Recommended: VAT on the full certified value when the milestone is invoiced. Retention is a payment term, not a reduction of the taxable amount — so its later release raises no new invoice.',
      'An advance payment gets its own tax invoice when it is received, because payment fixes the tax point.',
      'Each later milestone shows the advance recovered as an amount already paid that references the advance invoice — VAT is not charged twice.'
    ],
    channels: 'Touches every lump-sum contract, so it decides how the milestone invoice itself is built.',
    tag: 'Fawtara’s recommended reading — to confirm with OTA' },
  { id: 'rcm', agenda: 'Imported services — reverse charge',
    headline: 'A foreign supplier’s invoice — self-accounted, but reported?',
    basis: 'A software licence or a specialist study bought from outside Oman arrives as a PDF, not over Peppol. MEC accounts for the VAT itself under the reverse charge. Whether e-invoicing also needs a self-billed document is not settled.',
    treatment: [
      'Recommended: the Hub records the foreign invoice, computes the reverse-charge VAT and lands a draft in the ERP flagged for self-accounting.',
      'The original PDF and the computation are archived together as the audit record.',
      'No e-invoice is sent until the OTA confirms whether a self-billed document is required — the Hub can build one if it is.'
    ],
    channels: 'Low in count, but missed reverse-charge VAT is a common audit finding.',
    tag: 'Fawtara’s recommended reading — to confirm with OTA' }
];
function position(id) { return OTA_POSITIONS.find(p => p.id === id); }

/* --- roll-up (single entity, all six streams) ------------------------------
   Outbound today = 6 + 9 + 3 + 1 = 19.                                       */
const GROUP = {
  name: 'Muscat Engineering Consultancy', trn: MEC.vatin, entity: MEC,
  streams: 6, settled: 4, proposed: 2,

  todayTotal: 19, todaySuccess: 16, todayFailed: 1, todayPending: 2,
  /* month to date, August 2026 */
  mtdTotal: 160, mtdFailed: 2,

  /* inbound today: subcontractors 7 + imported services 1 = 8 */
  inboundToday: 8, inboundSubcon: 7, inboundRcm: 1,

  aspAvgMs: 364,
  /* the monthly timesheet billing run that carries manhour invoices */
  cycle: { id: 'MEC-TS-2026-07', period: 'July 2026', customers: 24, invoiced: 22,
           held: 2, window: '03–06 Aug 2026', clearedAt: '06 Aug 2026, 15:40 GST' },

  /* Fri 14 → Thu 20 Aug. Friday and Saturday are the Omani weekend. */
  week: [0, 0, 12, 9, 15, 11, 19],
  weekDays: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
  prevSameDay: 14
};

/* --- connection methods (kept from the platform proposal) ------------------ */
const METHODS = {
  1: { n: 'Method 1 — Direct API', short: 'Direct API', onsite: 'None',
       use: 'Cloud and API-enabled systems',
       how: 'The Hub calls the ERP standard API.' },
  2: { n: 'Method 2 — On-site agent', short: 'On-site agent', onsite: 'Lightweight agent',
       use: 'On-premise and restricted-network systems',
       how: 'A lightweight agent connects outward to the Hub and carries work both ways. No inbound firewall access is required.' },
  3: { n: 'Method 3 — Secure file transfer', short: 'Secure file transfer', onsite: 'None',
       use: 'Batch and low-interface environments',
       how: 'Scheduled exports and imports use an agreed format and secure location — a fit for a month-end timesheet billing run.' }
};

/* --- clients (invented) ---------------------------------------------------- */
const CUSTOMERS = [
  { name: 'Ghaba North Petroleum LLC',           vatin: 'OM1100512340', type: 'B2B', country: 'OM' },
  { name: 'Sur Coastal Refining SAOC',           vatin: 'OM1100623451', type: 'B2B', country: 'OM' },
  { name: 'Duqm Water & Utilities Company SAOC', vatin: 'OM1100734562', type: 'B2B', country: 'OM' },
  { name: 'Batinah Ports Development SAOC',      vatin: 'OM1100845673', type: 'B2B', country: 'OM' },
  { name: 'Eastern Province Midstream Co.',      vatin: null,           type: 'Export', country: 'SA', foreignId: 'SA310455667700003' }
];

/* subcontractors and suppliers inside Oman (on Peppol), and foreign suppliers
   of imported services (not on Peppol — reverse charge)                      */
const SUPPLIERS = [
  { name: 'Al Batinah Geotechnical Surveys LLC', vatin: 'OM1100221133', peppol: '0248:OM1100221133', country: 'OM', role: 'Survey subcontractor' },
  { name: 'Qurum Drafting & CAD Services LLC',   vatin: 'OM1100332244', peppol: '0248:OM1100332244', country: 'OM', role: 'Drafting subcontractor' },
  { name: 'Ruwi Office & IT Systems LLC',        vatin: 'OM1100443355', peppol: '0248:OM1100443355', country: 'OM', role: 'IT supplier' },
  { name: 'Nordfjord Process Simulation AS',     vatin: null, peppol: null, country: 'NO', foreignId: 'NO987654321MVA', role: 'Software licensor (abroad)' },
  { name: 'Teesside Pipeline Integrity Ltd',     vatin: null, peppol: null, country: 'GB', foreignId: 'GB284917366',  role: 'Specialist study (abroad)' }
];

/* --- outbound stages (the pipeline shown once, for stream 1) --------------- */
const STAGES = ['ERP invoice', 'Collect & map', 'Build XML', 'Validate',
                'Record', 'ASP / Peppol', 'Track outcome', 'Result published', 'Archive'];
const STAGE_SHORT = ['ERP', 'Map', 'XML', 'Validate', 'Record', 'Send', 'Outcome', 'Result', 'Archive'];
const STAGE_NOTE = [
  'Invoice and credit-note data from the Enterprise ERP',
  'Apply the MEC mapping profile',
  'UBL 2.1 · UUID · QR information',
  'Apply PINT-OM rules before sending',
  'Store XML and audit trail before anything is sent',
  'Transmit the valid XML',
  'Acknowledgement and final status',
  'UUID, status and QR held on the interface for the ERP to collect',
  'Long-term legal record, with the acknowledgements'
];
const STAGE_COUNT = [2, 4, 3, 5, 2, 4, 2];

/* --- inbound stages -------------------------------------------------------- */
const IN_STAGES = ['Supplier sends', 'Match to MEC', 'Validate',
                   'Archive original', 'Create draft', 'Finance review'];
const IN_STAGE_NOTE = [
  'Document arrives via ASP / Peppol',
  'Match participant ID and CR to MEC, and the PO to a project',
  'Structure, identity and content checks',
  'Preserve the legal XML record',
  'Draft purchase invoice in the ERP, coded to the project',
  'Finance reviews and posts manually'
];

/* --- three acknowledgement legs -------------------------------------------- */
const LEGS = [
  { id: 'ack',   leg: 'Service provider → Hub', name: 'Validated and accepted by the ASP',
    at: '20 Aug 2026 09:12:41.508', el: '+0.4 s', st: 'ok',
    body: 'The ASP confirms the e-invoice was generated and validated. This is custody, not delivery.',
    ref: 'ASP-OM-2026-0820-51204' },
  { id: 'ota',   leg: 'Tax Authority → service provider', name: 'Reported to the Tax Authority',
    at: '20 Aug 2026 09:14:19.870', el: '+1 m 38 s', st: 'ok',
    body: 'The ASP reported the Tax Data Document to Fawtara and the OTA acknowledged it. The Hub never talks to the OTA directly.',
    ref: 'OTA-RPT-2026-0820-90417' },
  { id: 'deliv', leg: 'Buyer’s provider → service provider', name: 'Delivered to the buyer',
    at: '20 Aug 2026 09:15:02.336', el: '+2 m 21 s', st: 'ok',
    body: 'The client’s access point confirmed receipt. This leg is outside MEC’s control and can take hours.',
    ref: 'MLS-DELIVERED' }
];
const LEGS_PENDING = [
  { id: 'ack',   name: 'Validated and accepted by the ASP', at: '20 Aug 2026 10:04:52.117', st: 'ok',
    body: 'Receipt issued 0.4 s after submission.' },
  { id: 'ota',   name: 'Reported to the Tax Authority',     at: 'awaiting', st: 'pending',
    body: 'Within the reporting window. No action required.' },
  { id: 'deliv', name: 'Delivered to the buyer',            at: 'awaiting', st: 'pending',
    body: 'The client’s access point has not yet confirmed. Retried automatically by the ASP.' }
];

/* --- outbound documents ----------------------------------------------------
   stage indexes into STAGES; state: ok | active | failed | held
   The tracked invoice MEC-INV-2026-00382 (lump-sum detailed engineering,
   Milestone 4 plus an approved variation) is followed end-to-end.            */
const INVOICES = [
  { no: 'MEC-INV-2026-00382', stream: 'lumpsum', cust: 0, net: 198400.000, vat: 9920.000, total: 208320.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '20 Aug 09:12:36',
    uuid: '5e2c9a71-4d3b-5f8e-a6c2-91b7d40e3f58', ackNo: 'ASP-OM-2026-0820-51204', ref: 'PEP-9314-2026',
    lines: 2, po: 'GNP-PO-4471' },
  { no: 'MEC-INV-2026-00381', stream: 'lumpsum', cust: 1, net: 74250.000, vat: 3712.500, total: 77962.500,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '20 Aug 09:20:11',
    uuid: '6f3dab82-5e4c-609f-b7d3-a2c8e51f4069', ackNo: 'ASP-OM-2026-0820-51209', ref: 'PEP-9318-2026',
    lines: 1, po: 'SCR-FEED-022' },
  { no: 'MEC-INV-2026-00386', stream: 'manhour', cust: 2, net: 56006.000, vat: 2800.300, total: 58806.300,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 6, state: 'active', retry: 0, created: '20 Aug 10:04:51',
    uuid: '7a4ebc93-6f5d-71a0-c8e4-b3d9f62a517a', ackNo: 'ASP-OM-2026-0820-51247', ref: 'PEP-9330-2026',
    lines: 8, po: 'DWU-PMC-2024-07', awaiting: 'OTA report · buyer delivery' },
  { no: 'MEC-INV-2026-00389', stream: 'manhour', cust: 1, net: 9120.000, vat: 456.000, total: 9576.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 3, state: 'failed', retry: 2, created: '20 Aug 10:13:07',
    uuid: '8b5fcda4-7a6e-82b1-d9f5-c4eaa73b628b', ackNo: null, ref: null, lines: 4, po: null,
    owner: 'entity' },
  { no: 'MEC-INV-2026-00384', stream: 'manhour', cust: 3, net: 31680.000, vat: 1584.000, total: 33264.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '20 Aug 09:38:24',
    uuid: '9c6aedb5-8b7f-93c2-eaf6-d5fbb84c739c', ackNo: 'ASP-OM-2026-0820-51221', ref: 'PEP-9322-2026',
    lines: 5, po: 'BPD-CS-2025-11' },
  { no: 'MEC-CRN-2026-00041', stream: 'adjust', cust: 2, net: -4860.000, vat: -243.000, total: -5103.000,
    cur: 'OMR', type: 'Credit Note', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '20 Aug 10:24:40',
    uuid: 'ad7bfec6-9c80-a4d3-fb07-e60cc95d84ad', ackNo: 'ASP-OM-2026-0820-51255', ref: 'PEP-9336-2026',
    lines: 1, po: null, against: 'MEC-INV-2026-00351' },
  { no: 'MEC-DBN-2026-00012', stream: 'adjust', cust: 1, net: 3150.000, vat: 157.500, total: 3307.500,
    cur: 'OMR', type: 'Debit Note', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '20 Aug 10:31:18',
    uuid: 'be8c0fd7-ad91-b5e4-0c18-f71dda6e95be', ackNo: 'ASP-OM-2026-0820-51261', ref: 'PEP-9339-2026',
    lines: 1, po: null, against: 'MEC-INV-2026-00347' },
  { no: 'MEC-EXP-2026-00006', stream: 'export', cust: 4, net: 128000.000, vat: 0.000, total: 128000.000,
    cur: 'OMR', type: 'Invoice', scen: 'Export', stage: 5, state: 'active', retry: 0, created: '20 Aug 10:17:45',
    uuid: 'cf9d10e8-bea2-c6f5-1d29-082eeb7fa6cf', ackNo: 'ASP-OM-2026-0820-51266', ref: 'PEP-9342-2026',
    lines: 2, po: 'EPM-ENG-0619', awaiting: 'OTA report' },
  { no: 'MEC-INV-2026-00390', stream: 'lumpsum', cust: 3, net: 92000.000, vat: 4600.000, total: 96600.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 2, state: 'active', retry: 0, created: '20 Aug 10:33:02',
    uuid: null, ackNo: null, ref: null, lines: 1, po: 'BPD-DD-2026-03' },
  { no: 'MEC-INV-2026-00391', stream: 'manhour', cust: 0, net: 41325.000, vat: 2066.250, total: 43391.250,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 1, state: 'active', retry: 0, created: '20 Aug 10:39:27',
    uuid: null, ackNo: null, ref: null, lines: 6, po: 'GNP-CS-2026-02' }
];

/* --- inbound supplier documents -------------------------------------------
   supplier indexes SUPPLIERS. Omani subcontractors arrive over Peppol and land
   as ERP drafts; the foreign supplier's PDF is recorded for the reverse charge. */
const INBOUND = [
  { no: 'ABG-INV-2026-00318', supplier: 0, stream: 'subcon', recv: '20 Aug 10:27:52', net: 18650.000,
    vat: 932.500, total: 19582.500, stage: 5, state: 'ok', erpRef: 'PINV-2026-00706',
    erpState: 'Draft — awaiting review', lines: 3, po: 'MEC-PO-2026-0412', kind: 'peppol', project: 'C-2025-118',
    note: 'Topographic and geotechnical survey for the Ghaba North gathering-line route, July 2026.' },
  { no: 'QDC-INV-2026-00094', supplier: 1, stream: 'subcon', recv: '20 Aug 10:21:30', net: 7480.000,
    vat: 374.000, total: 7854.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00705',
    erpState: 'Draft — awaiting review', lines: 2, po: 'MEC-PO-2026-0398', kind: 'peppol', project: 'C-2025-118',
    note: 'Isometric drafting overflow — 680 drawing-hours under the call-off order.' },
  { no: 'ROI-INV-2026-01177', supplier: 2, stream: 'subcon', recv: '20 Aug 09:56:14', net: 2310.000,
    vat: 115.500, total: 2425.500, stage: 5, state: 'ok', erpRef: 'PINV-2026-00704',
    erpState: 'Draft — awaiting review', lines: 4, po: 'MEC-PO-2026-0377', kind: 'peppol', project: 'OVERHEAD',
    note: 'Workstation and plotter maintenance for the Muscat design office.' },
  { no: 'NPS-2026-7731', supplier: 3, stream: 'rcm', recv: '20 Aug 09:44:08', net: 14200.000,
    vat: 710.000, total: 14200.000, stage: 4, state: 'held', erpRef: 'PINV-2026-00703',
    erpState: 'Draft — reverse charge, to confirm', lines: 1, po: 'MEC-PO-2026-0350', kind: 'pdf', project: 'OVERHEAD',
    note: 'Annual process-simulation licence, 12 seats. Received as a PDF; VAT self-accounted at 5% under the reverse charge.' },
  { no: 'UNK-INV-2026-00027', supplier: null, stream: 'subcon', recv: '20 Aug 09:39:55', net: 860.000,
    vat: 43.000, total: 903.000, stage: 1, state: 'failed', erpRef: null,
    erpState: 'Held — cannot match', lines: 1, po: null, kind: 'peppol',
    err: 'Participant 0248:OM1100778002 does not resolve to MEC. Confirming the registration.',
    owner: 'platform' }
];

/* --- archive --------------------------------------------------------------- */
const ARCHIVE_ITEMS = [
  { item: 'Generated UBL XML',                  why: 'The official compliance document created from ERP invoice data.', size: '9.4 KB' },
  { item: 'UUID and QR information',            why: 'Unique identity and invoice verification information.',                size: '312 B' },
  { item: 'Submission and outcome timestamps',  why: 'The complete processing timeline.',                                    size: '1.1 KB' },
  { item: 'ASP acknowledgements and final status', why: 'Evidence of receipt, delivery or rejection.',                       size: '2.4 KB' },
  { item: 'Validation results and audit history', why: 'Traceability for corrections, support and audit.',                   size: '6.1 KB' },
  { item: 'Milestone certificates and approved timesheets', why: 'The client sign-off behind each invoice, held with it.',   size: '—' }
];

/* --- ERP-side invoice list (origin screen · generic Enterprise ERP) -------- */
const ERP_INVOICES = [
  { no: 'MEC-INV-2026-00382', cust: 'Ghaba North Petroleum LLC', date: '20-08-2026', due: '19-09-2026',
    net: 198400.000, vat: 9920.000, total: 208320.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: '5e2c9a71…3f58', qr: true, project: 'C-2025-118', basis: 'Milestone 4 + VO-03' },
  { no: 'MEC-INV-2026-00381', cust: 'Sur Coastal Refining SAOC', date: '20-08-2026', due: '19-09-2026',
    net: 74250.000, vat: 3712.500, total: 77962.500, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: '6f3dab82…4069', qr: true, project: 'C-2026-022', basis: 'FEED milestone 2' },
  { no: 'MEC-INV-2026-00386', cust: 'Duqm Water & Utilities Company SAOC', date: '20-08-2026', due: '19-09-2026',
    net: 56006.000, vat: 2800.300, total: 58806.300, docStatus: 'Posted', eStatus: 'In Progress',
    ready: true, uuid: null, qr: false, project: 'PMC-2024-07', basis: 'Timesheets · July' },
  { no: 'MEC-CRN-2026-00041', cust: 'Duqm Water & Utilities Company SAOC', date: '20-08-2026', due: '—',
    net: -4860.000, vat: -243.000, total: -5103.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'ad7bfec6…84ad', qr: false, credit: true, project: 'PMC-2024-07', basis: 'Disputed hours · June' },
  { no: 'MEC-INV-2026-00390', cust: 'Batinah Ports Development SAOC', date: '20-08-2026', due: '19-09-2026',
    net: 92000.000, vat: 4600.000, total: 96600.000, docStatus: 'Draft', eStatus: 'Not Applicable',
    ready: false, uuid: null, qr: false, project: 'C-2026-031', basis: 'Milestone 2' },
  { no: 'MEC-INV-2026-00380', cust: 'Batinah Ports Development SAOC', date: '19-08-2026', due: '18-09-2026',
    net: 46500.000, vat: 2325.000, total: 48825.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: '4d1b8960…2e47', qr: true, project: 'C-2026-031', basis: 'Milestone 1' },
  { no: 'MEC-INV-2026-00378', cust: 'Sur Coastal Refining SAOC', date: '19-08-2026', due: '18-09-2026',
    net: 6420.000, vat: 321.000, total: 6741.000, docStatus: 'Posted', eStatus: 'Rejected by ASP',
    ready: true, uuid: '3c0a7859…1d36', qr: false, project: 'OE-2025-03', basis: 'Timesheets · June' }
];

/* --- the tracked lump-sum contract and its milestones (origin screen) ------ */
const CONTRACT = {
  no: 'C-2025-118', client: 'Ghaba North Petroleum LLC', po: 'GNP-PO-4471',
  title: 'Detailed engineering — Ghaba North gathering lines & manifold',
  value: 1240000.000, advancePct: 10, retentionPct: 5,
  milestones: [
    { n: 1, name: 'Kick-off, design basis and HAZID',             pct: 10, state: 'Invoiced', inv: 'MEC-INV-2026-00214' },
    { n: 2, name: 'Process & P&IDs issued for review',            pct: 15, state: 'Invoiced', inv: 'MEC-INV-2026-00267' },
    { n: 3, name: '30% model review',                              pct: 15, state: 'Invoiced', inv: 'MEC-INV-2026-00311' },
    { n: 4, name: '60% model review — issued for review (IFR)',    pct: 15, state: 'Invoiced', inv: 'MEC-INV-2026-00382' },
    { n: 5, name: '90% model review and HAZOP close-out',          pct: 20, state: 'In progress', inv: null },
    { n: 6, name: 'Issued for construction (IFC) package',         pct: 20, state: 'Not started', inv: null },
    { n: 7, name: 'As-built and handover',                         pct: 5,  state: 'Not started', inv: null }
  ],
  variation: { no: 'VO-03', name: 'Additional pig-launcher tie-in at manifold B', value: 12400.000 }
};

/* --- timesheets & manhour billing (origin screen) --------------------------
   Monthly PMC / owner's-engineer invoices are built from client-approved
   hours by discipline at the contract rate.                                  */
const TS_DAILY = [110, 112, 0, 0, 108, 118, 114, 114, 110, 0, 0, 108, 108, 108, 114, 116, 0, 0,
                  112, 120, 120, 108, 110, 0, 0, 116, 116, 112, 112, 130, 0];   /* = 2,496 h; Fri/Sat off */
const TIMESHEETS = {
  system: 'Enterprise ERP', module: 'Projects — timesheets & manhour billing',
  period: 'July 2026', days: 31,
  focus: { customer: 'Duqm Water & Utilities Company SAOC', contract: 'PMC-2024-07',
           title: 'Owner’s engineer — Duqm desalination expansion', invoice: 'MEC-INV-2026-00386' },
  daily: TS_DAILY,
  lines: [
    { role: 'Project Manager',                       code: 'PM-01',  heads: 1, hours: 168, rate: 38.500 },
    { role: 'Lead Process Engineer',                 code: 'PRC-01', heads: 1, hours: 184, rate: 32.000 },
    { role: 'Senior Mechanical Engineer',            code: 'MEC-02', heads: 2, hours: 352, rate: 26.500 },
    { role: 'Electrical & Instrumentation Engineer', code: 'EI-02',  heads: 2, hours: 336, rate: 24.000 },
    { role: 'Site Supervision Engineer',             code: 'SUP-03', heads: 4, hours: 744, rate: 18.750 },
    { role: 'QA/QC Inspector',                       code: 'QC-02',  heads: 2, hours: 352, rate: 19.500 },
    { role: 'HSE Advisor',                           code: 'HSE-01', heads: 1, hours: 176, rate: 21.000 },
    { role: 'Document Controller',                   code: 'DC-01',  heads: 1, hours: 184, rate: 9.500 }
  ],
  note: 'Each month’s invoice is built from the hours the client approved, by discipline, at the contract rate. The ERP raises it; the Hub clears it — the same pipe as every milestone invoice.',
  assumption: 'Assumption · to confirm with MEC: the timesheet cut-off each month, and whether the client approves hours before or after the invoice is posted.',
  rows: [
    { cust: 'Duqm Water & Utilities Company SAOC', contract: 'PMC-2024-07', booked: 2496, approved: 2496, disputed: 0,  amount: 56006.000, no: 'MEC-INV-2026-00386', state: 'Invoiced' },
    { cust: 'Batinah Ports Development SAOC',      contract: 'CS-2025-11', booked: 1320, approved: 1320, disputed: 0,  amount: 31680.000, no: 'MEC-INV-2026-00384', state: 'Invoiced' },
    { cust: 'Sur Coastal Refining SAOC',           contract: 'OE-2025-03', booked: 412,  approved: 380,  disputed: 32, amount: 9120.000,  no: 'MEC-INV-2026-00389', state: 'Invoiced' },
    { cust: 'Ghaba North Petroleum LLC',           contract: 'CS-2026-02', booked: 1770, approved: 1710, disputed: 60, amount: 41325.000, no: 'MEC-INV-2026-00391', state: 'Client approval' }
  ]
};

/* --- processing logs ------------------------------------------------------- */
const LOGS = [
  { ts: '09:12:37.114', lv: 'info', txt: 'Poll tick — Enterprise ERP, watermark 2026-08-20T09:12:02Z' },
  { ts: '09:12:37.288', lv: 'info', txt: 'Fetched raw payload · 14.2 KB · 28 fields (allowlist applied)' },
  { ts: '09:12:37.401', lv: 'ok',   txt: 'Idempotency check passed — MEC-INV-2026-00382 not previously seen' },
  { ts: '09:12:37.553', lv: 'info', txt: 'Mapping profile MEC/v2 applied — 47 of 48 fields resolved' },
  { ts: '09:12:37.700', lv: 'info', txt: 'Scenario detected: B2B lump-sum milestone · services · standard rate 5%' },
  { ts: '09:12:37.846', lv: 'ok',   txt: 'BTOM-002 UUID derived — 5e2c9a71-4d3b-5f8e-a6c2-91b7d40e3f58' },
  { ts: '09:12:38.019', lv: 'info', txt: 'UBL 2.1 Invoice built · 9.4 KB · 2 lines · contract C-2025-118' },
  { ts: '09:12:38.190', lv: 'info', txt: 'Oman CIUS Schematron — evaluating 150 assertions' },
  { ts: '09:12:40.466', lv: 'warn', txt: 'IBR-W-014 · payment means defaulted to 30' },
  { ts: '09:12:40.468', lv: 'ok',   txt: 'Validation passed — 148 passed, 0 failed, 2 warnings (278 ms)' },
  { ts: '09:12:40.611', lv: 'ok',   txt: 'Archived — XML, validation report and audit trail written before transmission' },
  { ts: '09:12:40.790', lv: 'ok',   txt: 'State → READY_FOR_ASP · queued on the MEC channel' }
];

/* --- ASP exchange ---------------------------------------------------------- */
const ASP = {
  provider: 'Accredited Service Provider — OTA licence ASP-OM-014',
  endpoint: 'https://ap.asp-oman.om/peppol/v1/documents',
  auth: 'mTLS · client certificate held in the platform vault',
  sentAt: '20 Aug 2026 09:12:41.144 GST',
  ackAt:  '20 Aug 2026 09:12:41.508 GST',
  otaAt:  '20 Aug 2026 09:14:19.870 GST',
  mlsAt:  '20 Aug 2026 09:15:02.336 GST',
  rtt: 364,
  http: '202 Accepted',
  ref: 'PEP-9314-2026',
  ackNo: 'ASP-OM-2026-0820-51204',
  otaRef: 'OTA-RPT-2026-0820-90417',
  msgId: 'urn:uuid:5e2c9a71-4d3b-5f8e-a6c2-91b7d40e3f58',
  sender: '0248:OM1100387215',
  sellerVatin: 'OM1100387215',
  sellerCr: 'CR 1072946',
  receiver: '0248:OM1100512340',
  docType: 'Peppol PINT billing — Oman',
  process: 'Peppol BIS billing'
};

/* --- history --------------------------------------------------------------- */
const HISTORY = [
  { no: 'MEC-INV-2026-00382', stream: 'lumpsum', date: '20 Aug 09:12', total: 208320.000, type: 'Milestone invoice', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0820-51204', retries: 0 },
  { no: 'MEC-INV-2026-00381', stream: 'lumpsum', date: '20 Aug 09:20', total: 77962.500, type: 'Milestone invoice', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0820-51209', retries: 0 },
  { no: 'MEC-INV-2026-00384', stream: 'manhour', date: '20 Aug 09:38', total: 33264.000, type: 'Manhour invoice', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0820-51221', retries: 0 },
  { no: 'MEC-INV-2026-00386', stream: 'manhour', date: '20 Aug 10:04', total: 58806.300, type: 'Manhour invoice', dir: 'out', st: 'pending', ack: null, retries: 0 },
  { no: 'MEC-EXP-2026-00006', stream: 'export', date: '20 Aug 10:17', total: 128000.000, type: 'Export invoice', dir: 'out', st: 'pending', ack: null, retries: 0 },
  { no: 'MEC-CRN-2026-00041', stream: 'adjust', date: '20 Aug 10:24', total: -5103.000, type: 'Credit Note', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0820-51255', retries: 0 },
  { no: 'MEC-DBN-2026-00012', stream: 'adjust', date: '20 Aug 10:31', total: 3307.500, type: 'Debit Note', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0820-51261', retries: 0 },
  { no: 'ABG-INV-2026-00318', stream: 'subcon', date: '20 Aug 10:27', total: 19582.500, type: 'Subcontractor invoice', dir: 'in', st: 'success', ack: 'PINV-2026-00706', retries: 0 },
  { no: 'QDC-INV-2026-00094', stream: 'subcon', date: '20 Aug 10:21', total: 7854.000, type: 'Subcontractor invoice', dir: 'in', st: 'success', ack: 'PINV-2026-00705', retries: 0 },
  { no: 'NPS-2026-7731', stream: 'rcm', date: '20 Aug 09:44', total: 14200.000, type: 'Imported service', dir: 'in', st: 'pending', ack: 'PINV-2026-00703', retries: 0 },
  { no: 'MEC-INV-2026-00389', stream: 'manhour', date: '20 Aug 10:13', total: 9576.000, type: 'Manhour invoice', dir: 'out', st: 'failed', ack: null, retries: 2, err: 'IBR-CO-15 · total mismatch' },
  { no: 'MEC-INV-2026-00378', stream: 'manhour', date: '19 Aug 16:08', total: 6741.000, type: 'Manhour invoice', dir: 'out', st: 'rejected', ack: null, retries: 0, err: 'ASP rejected — buyer participant not registered' },
  { no: 'MEC-INV-2026-00380', stream: 'lumpsum', date: '19 Aug 14:02', total: 48825.000, type: 'Milestone invoice', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0819-51088', retries: 0 }
];

/* --- reporting — by stream, month to date August 2026 ---------------------- */
const REPORT_ROWS = [
  { id: 'lumpsum', name: 'Lump-sum milestones',          docs: 58, net: 4860000.000, vat: 243000.000, zero: 0.000,      failed: 1, ack: 57 },
  { id: 'manhour', name: 'Reimbursable manhours',        docs: 71, net: 2140000.000, vat: 107000.000, zero: 0.000,      failed: 1, ack: 70 },
  { id: 'adjust',  name: 'Credit & debit notes',         docs: 26, net: -96000.000,  vat: -4800.000,  zero: 0.000,      failed: 0, ack: 26 },
  { id: 'export',  name: 'Export of services (0%)',      docs: 5,  net: 410000.000,  vat: 0.000,      zero: 410000.000, failed: 0, ack: 5 },
  { id: 'subcon',  name: 'Subcontractors & suppliers',   docs: 88, net: 1265000.000, vat: 63250.000,  zero: 0.000,      failed: 0, ack: 88 },
  { id: 'rcm',     name: 'Imported services (RCM)',      docs: 9,  net: 184000.000,  vat: 9200.000,   zero: 0.000,      failed: 0, ack: 9 }
];

const REPORT_TYPES = [
  { n: 'VAT summary by stream',          d: 'Net, VAT and zero-rated totals for a period, per invoice stream.', tag: 'Finance' },
  { n: 'Reporting completeness',         d: 'Documents raised in the ERP against documents acknowledged by the ASP.', tag: 'Compliance' },
  { n: 'Billing by project',             d: 'Milestones and manhours invoiced per contract, against contract value and approved hours.', tag: 'Projects' },
  { n: 'Exception ageing',               d: 'Open failures by age and by who owns the fix.', tag: 'Operations' },
  { n: 'Inbound purchase log',           d: 'Subcontractor documents landed as drafts, and imported services self-accounted.', tag: 'Operations' },
  { n: 'OTA-position register',          d: 'The open treatments — export of services, branch recharges, retention, reverse charge — and their status.', tag: 'Programme' }
];

/* --- mapping: what the Enterprise ERP exposes ------------------------------ */
const ERP_SCHEMA = [
  { f: 'InvoiceNumber',              t: 'string',  ex: 'MEC-INV-2026-00382' },
  { f: 'InvoiceDate',                t: 'date',    ex: '20260820' },
  { f: 'InvoiceType',                t: 'string',  ex: 'STD' },
  { f: 'IsCancelled',                t: 'boolean', ex: 'false' },
  { f: 'Currency',                   t: 'string',  ex: 'OMR' },
  { f: 'BillingEntity',              t: 'string',  ex: 'MEC-OM' },
  { f: 'CompanyRegistration',        t: 'string',  ex: '1072946' },
  { f: 'CompanyVATNumber',           t: 'string',  ex: '1100387215' },
  { f: 'CompanyAddressCity',         t: 'string',  ex: 'Muscat' },
  { f: 'CompanyCountry',             t: 'string',  ex: 'OM' },
  { f: 'AccountNumber',              t: 'string',  ex: 'CL-00118' },
  { f: 'CustomerName',               t: 'string',  ex: '  ghaba north petroleum llc ' },
  { f: 'CustomerVATNumber',          t: 'string',  ex: '1100512340' },
  { f: 'CustomerCountry',            t: 'string',  ex: 'OM' },
  { f: 'CustomerAddressStreet',      t: 'string',  ex: '(empty in this system)' },
  { f: 'ProjectCode',                t: 'string',  ex: 'C-2025-118' },
  { f: 'NetAmount',                  t: 'decimal', ex: '198400.00' },
  { f: 'TaxAmount',                  t: 'decimal', ex: '9920.00' },
  { f: 'InvoiceTotal',               t: 'decimal', ex: '208320.00' },
  { f: 'AmountDue',                  t: 'decimal', ex: '208320.00' },
  { f: 'TaxRate',                    t: 'decimal', ex: '5.0' },
  { f: 'ServiceCode',                t: 'string',  ex: 'ENG-DD-MS04' },
  { f: 'ServiceDescription',         t: 'string',  ex: 'Detailed engineering — Milestone 4: 60% model review (IFR)' },
  { f: 'Quantity',                   t: 'decimal', ex: '1.0000' },
  { f: 'QuantityUnit',               t: 'string',  ex: 'LS' },
  { f: 'NetPriceAmount',             t: 'decimal', ex: '186000.000' },
  { f: 'CustomerPO',                 t: 'string',  ex: 'GNP-PO-4471' },
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
    { erp: 'ProjectCode',            std: 'BT-12', stdName: 'Contract reference',    xf: 'trim',        req: 'Optional', ok: true,
      dnote: 'MEC’s contract number, so the client can match the invoice to the engineering contract.' },
    { erp: '—',                      std: 'BTOM-002', stdName: 'Document UUID',      xf: 'derive:uuidv5', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Built from the invoice number, the seller VAT identifier and the issue date. Stable — a resubmission of the same invoice produces the same UUID.' },
    { erp: '—',                      std: 'BTOM-001', stdName: 'Invoice transaction type', xf: 'derive:txntype', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Standard for Omani B2B and Export — decided from the client’s registration and country.' },
    { erp: '—',                      std: 'IBT-024', stdName: 'Specification identifier', xf: 'const', req: 'Mandatory', ok: true, derived: true, constant: true,
      dnote: 'urn:peppol:pint:billing-1@om-1 — declares the OM-1.1 ruleset the document is validated against.' }
  ]},
  { grp: 'Seller party', rows: [
    { erp: 'BillingEntity',          std: 'BT-27', stdName: 'Seller name',           xf: 'lookup:company', req: 'Mandatory', ok: true },
    { erp: 'CompanyRegistration',    std: 'IBT-029', stdName: 'Seller identifier (CR)', xf: 'const:CR', req: 'Mandatory', ok: true,
      dnote: 'MEC’s Commercial Registration, scheme CR (code list CL-06-OM).' },
    { erp: 'CompanyVATNumber',       std: 'BT-31', stdName: 'Seller VAT identifier', xf: 'prefix:OM',   req: 'Mandatory', ok: true,
      dnote: 'The Omani VATIN OM1100387215.' },
    { erp: '—',                      std: 'BTOM-004', stdName: 'Seller participant ID', xf: 'derive:0248', req: 'Mandatory', ok: true, derived: true,
      dnote: 'MEC’s Peppol participant, 0248:OM<VATIN> — its endpoint, SMP entry and certificate. The exact Oman EAS scheme is confirmed on the OTA onboarding portal.' },
    { erp: 'CompanyAddressCity',     std: 'BT-37', stdName: 'Seller city',           xf: '',            req: 'Mandatory', ok: true },
    { erp: 'CompanyCountry',         std: 'BT-40', stdName: 'Seller country code',   xf: 'iso:alpha2',  req: 'Mandatory', ok: true }
  ]},
  { grp: 'Buyer party', rows: [
    { erp: 'AccountNumber',          std: 'BT-46', stdName: 'Buyer identifier',      xf: '',            req: 'Mandatory', ok: true },
    { erp: 'CustomerName',           std: 'BT-44', stdName: 'Buyer name',            xf: 'trim|upper',  req: 'Mandatory', ok: true },
    { erp: 'CustomerVATNumber',      std: 'BT-48', stdName: 'Buyer VAT identifier',  xf: 'nullable',    req: 'Conditional', ok: true,
      dnote: 'Present for Omani clients, absent for a client outside Oman — which selects the Export scenario.' },
    { erp: 'CustomerCountry',        std: 'BT-55', stdName: 'Buyer country code',    xf: 'iso:alpha2',  req: 'Mandatory', ok: true },
    { erp: '',                       std: 'BT-50', stdName: 'Buyer address line 1',  xf: '',            req: 'Mandatory', ok: false,
      fallback: 'Address held in the Hub master',
      note: 'CustomerAddressStreet is present but empty on some client records.' }
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
    { erp: 'ServiceCode',            std: 'BT-155', stdName: 'Item seller identifier', xf: '',          req: 'Mandatory', ok: true },
    { erp: 'ServiceDescription',     std: 'BT-153', stdName: 'Item name',              xf: 'trim',      req: 'Mandatory', ok: true },
    { erp: 'Quantity',               std: 'BT-129', stdName: 'Invoiced quantity',      xf: 'decimal:4', req: 'Mandatory', ok: true },
    { erp: 'QuantityUnit',           std: 'BT-130', stdName: 'Unit of measure code',   xf: 'codelist:UNECE20', req: 'Mandatory', ok: true,
      dnote: 'LS (lump sum) becomes C62 “one”; HR stays HUR for manhour lines.' },
    { erp: 'NetPriceAmount',         std: 'BT-146', stdName: 'Item net price',         xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: '—',                      std: 'BTOM-019', stdName: 'Goods or services indicator', xf: 'derive:itemkind', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Services on every engineering line — read from the item group.' }
  ]}
];

/* --- validation ------------------------------------------------------------ */
const VALIDATION = {
  profile: 'PINT-OM · Oman CIUS Schematron', ran: '20 Aug 2026 09:12:40 GST', ms: 278,
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
    { st: 'warn', id: 'IBR-W-031',  txt: 'Buyer address line 1 (BT-50) sourced from the fallback mapping — field not exposed by the Enterprise ERP.',
      x: 'cac:AccountingCustomerParty/cac:Party/cac:PostalAddress/cbc:StreetName' }
  ]
};

const VALIDATION_FAILED = {
  profile: 'PINT-OM · Oman CIUS Schematron', ran: '20 Aug 2026 10:13:21 GST', ms: 255,
  passed: 143, failed: 2, warned: 1,
  rules: [
    { st: 'fail', id: 'IBR-053-OM', txt: 'Buyer VAT identifier (BT-48) is absent and no substitute participant ID was derived.',
      x: 'cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/cbc:CompanyID' },
    { st: 'fail', id: 'IBR-CO-15',  txt: 'Invoice total with VAT (BT-112) does not equal BT-109 + BT-110. Expected 9576.000, found 9575.000.',
      x: 'cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount' },
    { st: 'warn', id: 'IBR-W-014',  txt: 'Payment means code (BT-81) not supplied — defaulted to 30 (credit transfer).',
      x: 'cac:PaymentMeans/cbc:PaymentMeansCode' },
    { st: 'pass', id: 'IBR-001-OM', txt: 'An invoice shall have a Specification identifier (BT-24).' },
    { st: 'pass', id: 'IBR-002-OM', txt: 'An invoice shall have an Invoice number (BT-1).' }
  ]
};

/* --- ERP status sync steps (final origin screen) --------------------------- */
const SYNC_STEPS = [
  { name: 'Invoice posted in the Enterprise ERP', t: '20 Aug 09:12:36', st: 'ok',
    body: 'Invoice MEC-INV-2026-00382 posted against contract C-2025-118 once the client signed the Milestone 4 certificate. Document status set to Posted.' },
  { name: 'Collected by the Hub', t: '20 Aug 09:12:37', st: 'ok',
    body: 'Method 1 — Direct API. The Hub called the Enterprise ERP’s standard API. Raw payload 14.2 KB, field allowlist applied.' },
  { name: 'Mapped, built and validated', t: '20 Aug 09:12:40', st: 'ok',
    body: 'Profile MEC/v2 applied. UBL 2.1 built. Oman CIUS Schematron passed — 148 rules, 2 warnings.' },
  { name: 'Archived', t: '20 Aug 09:12:40', st: 'ok',
    body: 'XML, validation report and audit trail written to the compliance archive before anything was transmitted.' },
  { name: 'Transmitted to the ASP', t: '20 Aug 09:12:41', st: 'ok',
    body: 'Accepted by the accredited provider in 364 ms. Peppol reference PEP-9314-2026.' },
  { name: 'Outcomes tracked on three legs', t: '20 Aug 09:15:02', st: 'ok',
    body: 'ASP accepted it at 09:12:41. Reported to the Tax Authority at 09:14:19. The client’s provider confirmed delivery at 09:15:02.' },
  { name: 'Result published on the interface', t: '20 Aug 09:15:04', st: 'ok',
    body: 'Held against this invoice and available to the Enterprise ERP: UUID, e-invoice status, acknowledgement number, Peppol reference and QR information.' },
  { name: 'Collected by the Enterprise ERP', t: '20 Aug 09:15:04', st: 'ok',
    body: 'The MEC-side connector read the result and stored it on the invoice, where the print format renders the QR on the client copy.' }
];

/* --- delivery boundary ----------------------------------------------------- */
const BOUNDARY_ENTITY = [
  'Complete invoice data and the master data behind it — clients, contracts, rates',
  'An enabled interface, an integration user and a test environment',
  'The system-side connector that collects the result, and the fields to hold it',
  'System-side changes where a required field is missing',
  'Finance and project-controls users for testing, exceptions and sign-off'
];
const BOUNDARY_HUB = [
  'Mapping, XML generation and PINT-OM validation',
  'ASP communication, outcome tracking and retry handling',
  'Secure XML archive and audit trail',
  'Inbound routing, project coding and draft delivery',
  'Dashboard, monitoring and central technical operations'
];

/* --- why Fawtara — differentiators (value screen) -------------------------- */
const FAWTARA_VALUE = [
  { k: 'Accredited by the OTA', d: 'A licensed Accredited Service Provider (ASP) — the reporting leg to the OTA is ours, not a bolt-on.', ico: 'shield' },
  { k: 'Data residency in Oman', d: 'Invoice data and the legal archive are held in-country. No client or contract data leaves Oman to be reported.', ico: 'lock' },
  { k: 'Built for project billing', d: 'Milestone certificates and approved timesheets travel with the invoice, so a client query is answered from one record.', ico: 'queue' },
  { k: 'One pipe, every stream', d: 'Milestone, manhour, credit-note, export, subcontractor and reverse-charge documents all run through one integration and one console.', ico: 'send' },
  { k: 'OTA-interface alignment', d: 'PINT-OM validation before anything is sent, and outcome tracking on all three Peppol legs after.', ico: 'check' },
  { k: 'We bring positions, not questions', d: 'On the unsettled treatments — export of services, branch recharges, retention, reverse charge — Fawtara comes with a recommended reading to take to the OTA.', ico: 'grid' }
];

/* --- helpers --------------------------------------------------------------- */
function tenant(id) { return TENANTS.find(t => t.id === id) || MEC; }
function omr(n) {
  if (n === null || n === undefined) return '—';
  return (n < 0 ? '−' : '') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}
function pct(n) { return n === null || n === undefined ? '—' : n.toFixed(1) + '%'; }
function num(n) { return n === null || n === undefined ? '—' : n.toLocaleString('en-US'); }
function method(m) { return METHODS[m]; }
