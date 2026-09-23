/* ==========================================================================
   Integrated Gas Company SAOC (IGC) × Fawtara — E-Invoicing Scope Walkthrough · demonstration dataset

   REAL: IGC's legal name, its Ministry of Finance ownership and its role as
   Oman's natural gas aggregator (igcoman.om). INVENTED: every VATIN, CR number,
   counterparty, volume, price, document number and tax treatment below. None of
   it states how IGC actually invoices. Counterparties are fictional on purpose.

   THIS MOCK IS A DISCOVERY / ALIGNMENT TOOL, not a finished compliant flow.
   Its spine is the SIX ways IGC raises or receives invoices — gas purchase,
   gas transportation, long-term gas sales, spot sales, adjustments and export.
   Where the OTA has not settled a treatment (export, allocations to government
   entities, take-or-pay shortfall) the mock shows Fawtara's RECOMMENDED reading,
   always flagged "to confirm with OTA".

   IGC's ERP is not confirmed, so the origin surface says "Enterprise ERP" and
   names no product.

   IDENTITY — single entity. One VATIN, one Commercial Registration, one Peppol
   participant (scheme 0248, so 0248:OM<VATIN>). No VAT group.

   Shapes are real: Omani VATIN OM + 10 digits, OMR to 3 decimals, 5% VAT,
   gas priced per MMBtu.

   Demo clock: Thursday 20 August 2026, 10:42 GST (Oman's week runs Sun-Thu).
   ========================================================================== */

const DEMO_DATE  = '20 Aug 2026';
const DEMO_DAY   = 'Thursday';
const DEMO_CLOCK = '20 Aug 2026, 10:42 GST';
const VAT_RATE   = 5;

/* --- the entity ------------------------------------------------------------ */
const IGC = {
  id: 'IGC', name: 'Integrated Gas Company', legal: 'Integrated Gas Company SAOC',
  vatin: 'OM1300054871', cr: '1450231', peppol: '0248:OM1300054871',
  city: 'Muscat', country: 'OM'
};
const TENANTS = [{ ...IGC, short: 'IGC', sector: 'Natural gas aggregation',
  erp: 'Enterprise ERP', status: 'live', health: 'ok' }];

/* --- the six streams — THE spine of this mock ------------------------------
   dir: in (IGC receives) | out (IGC issues)
   mode: live (cleared per document)
   position: settled | proposed (Fawtara's reading, to confirm)               */
const STREAMS = [
  { id: 'gas-buy',      n: 1, group: 'buyer', dir: 'in',  title: 'Gas purchase · producers in Oman',
    role: 'IGC as buyer', origin: 'Peppol inbound', target: 'Enterprise ERP',
    doc: 'Producer tax invoice', mode: 'live', position: 'settled',
    today: 6, mtd: 94,
    blurb: 'Producers’ e-invoices, already cleared through the OTA, arrive over Peppol. Fawtara matches them to IGC and lands them as draft purchase invoices in the ERP — nobody keys them in.' },
  { id: 'transport-buy', n: 2, group: 'buyer', dir: 'in', title: 'Gas transportation · transporter',
    role: 'IGC as buyer', origin: 'Peppol inbound', target: 'Enterprise ERP',
    doc: 'Transporter tax invoice', mode: 'live', position: 'settled',
    today: 2, mtd: 31,
    blurb: 'Capacity and commodity charges from the pipeline transporter arrive the same way — over Peppol, matched to IGC, landed as drafts for finance to review against the transport agreement.' },
  { id: 'gas-sell',     n: 3, group: 'seller', dir: 'out', title: 'Long-term gas sales · monthly',
    role: 'IGC as seller', origin: 'Enterprise ERP', target: 'OTA — cleared',
    doc: 'Standard tax invoice', mode: 'live', position: 'settled',
    today: 14, mtd: 131,
    blurb: 'Monthly volume-based invoices to power, water and industrial customers, built from metered nominations and cleared live to the OTA — the canonical flow. Take-or-pay shortfall has a separate treatment to confirm.' },
  { id: 'spot-sell',    n: 4, group: 'seller', dir: 'out', title: 'Spot gas sales · one-off',
    role: 'IGC as seller', origin: 'Enterprise ERP', target: 'OTA — cleared',
    doc: 'Standard tax invoice', mode: 'live', position: 'settled',
    today: 3, mtd: 22,
    blurb: 'A one-off spot cargo or delivery sold outside a long-term contract. Same B2B invoice, same pipe, cleared live.' },
  { id: 'adjust',       n: 5, group: 'seller', dir: 'out', title: 'Credit & debit notes · true-ups',
    role: 'IGC as seller', origin: 'Enterprise ERP', target: 'OTA — cleared',
    doc: 'Credit / debit note', mode: 'live', position: 'settled',
    today: 2, mtd: 37,
    blurb: 'Price and volume true-ups after metering is finalised. Each note references the original invoice and is cleared like any other document.' },
  { id: 'export',       n: 6, group: 'seller', dir: 'out', title: 'Export · zero-rated sale',
    role: 'IGC as seller', origin: 'Enterprise ERP', target: 'OTA — cleared',
    doc: 'Zero-rated tax invoice', mode: 'live', position: 'proposed',
    today: 1, mtd: 4,
    blurb: 'Gas sold outside Oman at 0% VAT with a reason code. Fawtara’s reading of the zero-rating evidence, and of allocations to government entities, is to confirm with the OTA.' }
];
function stream(id) { return STREAMS.find(s => s.id === id); }

/* --- Fawtara's recommended OTA positions ----------------------------------
   The mock's only load-bearing tax claims. Each renders with the "to confirm
   with OTA" tag.                                                             */
const OTA_POSITIONS = [
  { id: 'export', agenda: 'Export and zero-rated sales',
    headline: 'Zero-rated export — 0% with a reason code',
    basis: 'Gas delivered to a buyer outside Oman is an export of goods. Fawtara reads it as zero-rated, with the evidence of export held against the invoice.',
    treatment: [
      'The invoice carries VAT category Z at 0%, with an exemption reason code on the tax subtotal.',
      'The buyer is identified by a foreign tax ID and country, not an Omani VATIN — so the scenario is Export, not B2B.',
      'The export evidence (delivery point, metering statement or customs reference) is referenced on the invoice and archived with it.'
    ],
    channels: 'Applies whether the gas leaves by pipeline or by vessel. The reason code and evidence rules are an assumption until the OTA confirms them.',
    tag: 'Fawtara’s recommended reading — to confirm with OTA' },
  { id: 'govalloc', agenda: 'Allocation to government entities',
    headline: 'Allocations between government bodies — supply or not?',
    basis: 'IGC manages gas allocations on behalf of the Government. Whether moving allocated volumes to another government body is a taxable supply is not settled.',
    treatment: [
      'Working assumption: where IGC invoices a government entity for gas, it is an ordinary standard-rated B2B invoice, cleared like any other.',
      'A pure book allocation with no consideration raises no invoice.',
      'The boundary between the two cases needs the OTA’s view before it is built into the mapping.'
    ],
    channels: 'Affects which documents enter the pipe at all — so it is decided before build, not after.',
    tag: 'Fawtara’s recommended reading — to confirm with OTA' },
  { id: 'takeorpay', agenda: 'Take-or-pay shortfall charges',
    headline: 'Shortfall charge — consideration for a supply, or compensation?',
    basis: 'When a customer takes less than the contracted minimum, IGC bills the shortfall. Whether that is consideration for making gas available (5% VAT) or compensation outside VAT is not settled.',
    treatment: [
      'Recommended: treat it as consideration for the availability of gas, standard-rated at 5%.',
      'It is shown as its own invoice line, separate from delivered volume, so it can be re-classified without touching the metered lines.',
      'Make-up gas later taken against a shortfall references the original shortfall charge.'
    ],
    channels: 'Small in document count, large in value — which is why the treatment matters.',
    tag: 'Fawtara’s recommended reading — to confirm with OTA' }
];

/* --- roll-up (single entity, all six streams) ------------------------------
   Outbound today = 14 + 3 + 2 + 1 = 20.                                      */
const GROUP = {
  name: 'Integrated Gas Company', trn: IGC.vatin, entity: IGC,
  streams: 6, settled: 5, proposed: 1,

  todayTotal: 20, todaySuccess: 17, todayFailed: 1, todayPending: 2,
  /* month to date, August 2026 */
  mtdTotal: 194, mtdFailed: 3,

  /* inbound today: producers 6 + transporter 2 = 8 */
  inboundToday: 8, inboundProducers: 6, inboundTransport: 2,

  aspAvgMs: 372,
  /* the monthly billing run that carries long-term sales */
  cycle: { id: 'IGC-BILL-2026-07', period: 'July 2026', customers: 131, invoiced: 128,
           held: 3, window: '03–05 Aug 2026', clearedAt: '05 Aug 2026, 16:20 GST' },

  /* Fri 14 → Thu 20 Aug. Friday and Saturday are the Omani weekend. */
  week: [0, 0, 11, 8, 16, 13, 20],
  weekDays: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
  prevSameDay: 17
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
       how: 'Scheduled exports and imports use an agreed format and secure location — a fit for a month-end billing run.' }
};

/* --- counterparties (invented) --------------------------------------------- */
const CUSTOMERS = [
  { name: 'Al Noor Power Company SAOC',      vatin: 'OM1100445566', type: 'B2B', country: 'OM' },
  { name: 'Gulf Desal Water SAOC',           vatin: 'OM1100667788', type: 'B2B', country: 'OM' },
  { name: 'Sohar Metals Industrial LLC',     vatin: 'OM1100889900', type: 'B2B', country: 'OM' },
  { name: 'Wadi Kabir Fertiliser LLC',       vatin: 'OM1100990011', type: 'B2B', country: 'OM' },
  { name: 'Meridian Gas Trading FZE',        vatin: null,           type: 'Export', country: 'AE', foreignId: 'AE100777888900003' }
];

/* producers and the transporter — all inside Oman, all on Peppol */
const SUPPLIERS = [
  { name: 'Al Hajar Gas Development LLC',   vatin: 'OM1100223344', peppol: '0248:OM1100223344', country: 'OM', role: 'Producer' },
  { name: 'Wadi Sahil Energy SAOC',         vatin: 'OM1100556611', peppol: '0248:OM1100556611', country: 'OM', role: 'Producer' },
  { name: 'Trans-Oman Gas Pipelines SAOC',  vatin: 'OM1100334455', peppol: '0248:OM1100334455', country: 'OM', role: 'Transporter' }
];

/* --- outbound stages (the pipeline shown once, for stream 3) --------------- */
const STAGES = ['ERP invoice', 'Collect & map', 'Build XML', 'Validate',
                'Record', 'ASP / Peppol', 'Track outcome', 'Result published', 'Archive'];
const STAGE_SHORT = ['ERP', 'Map', 'XML', 'Validate', 'Record', 'Send', 'Outcome', 'Result', 'Archive'];
const STAGE_NOTE = [
  'Invoice and credit-note data from the Enterprise ERP',
  'Apply the IGC mapping profile',
  'UBL 2.1 · UUID · QR information',
  'Apply PINT-OM rules before sending',
  'Store XML and audit trail before anything is sent',
  'Transmit the valid XML',
  'Acknowledgement and final status',
  'UUID, status and QR held on the interface for the ERP to collect',
  'Long-term legal record, with the acknowledgements'
];
const STAGE_COUNT = [3, 5, 4, 6, 2, 5, 2];

/* --- inbound stages -------------------------------------------------------- */
const IN_STAGES = ['Supplier sends', 'Match to IGC', 'Validate',
                   'Archive original', 'Create draft', 'Finance review'];
const IN_STAGE_NOTE = [
  'Document arrives via ASP / Peppol',
  'Match participant ID and CR to IGC',
  'Structure, identity and content checks',
  'Preserve the legal XML record',
  'Draft purchase invoice in the ERP',
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
    body: 'The buyer’s access point confirmed receipt. This leg is outside IGC’s control and can take hours.',
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
   The tracked invoice IGC-INV-2026-00417 (long-term gas sale, July 2026 volumes,
   527,600 MMBtu at OMR 1.600) is followed end-to-end.                        */
const INVOICES = [
  { no: 'IGC-INV-2026-00417', stream: 'gas-sell', cust: 0, net: 844160.000, vat: 42208.000, total: 886368.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '20 Aug 09:14:02',
    uuid: 'b7f4c2e1-9a3d-5c8b-a1f6-2e7d4b9c0a35', ackNo: 'ASP-OM-2026-0820-44718', ref: 'PEP-8842-2026',
    lines: 2, po: 'GSA-014' },
  { no: 'IGC-INV-2026-00416', stream: 'gas-sell', cust: 1, net: 375375.000, vat: 18768.750, total: 394143.750,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '20 Aug 09:21:47',
    uuid: 'c1a8d3f2-4b7e-6d9c-b2a7-3f8e5c0d1b46', ackNo: 'ASP-OM-2026-0820-44719', ref: 'PEP-8843-2026',
    lines: 3, po: 'GSA-027' },
  { no: 'IGC-INV-2026-00420', stream: 'gas-sell', cust: 2, net: 164640.000, vat: 8232.000, total: 172872.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 6, state: 'active', retry: 0, created: '20 Aug 10:02:11',
    uuid: 'd2b9e4a3-5c8f-7e0d-c3b8-4a9f6d1e2c57', ackNo: 'ASP-OM-2026-0820-44755', ref: 'PEP-8851-2026',
    lines: 2, po: 'GSA-041', awaiting: 'OTA report · buyer delivery' },
  { no: 'IGC-INV-2026-00434', stream: 'gas-sell', cust: 1, net: 18240.000, vat: 912.000, total: 19152.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 3, state: 'failed', retry: 2, created: '20 Aug 10:11:38',
    uuid: 'e3c0f5b4-6d9a-8f1e-d4c9-5b0a7e2f3d68', ackNo: null, ref: null, lines: 2, po: null,
    owner: 'entity' },
  { no: 'IGC-SPT-2026-00031', stream: 'spot-sell', cust: 2, net: 39000.000, vat: 1950.000, total: 40950.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '20 Aug 09:41:52',
    uuid: 'f4d1a6c5-7e0b-9a2f-e5d0-6c1b8f3a4e79', ackNo: 'ASP-OM-2026-0820-44731', ref: 'PEP-8859-2026',
    lines: 1, po: 'SPOT-0031' },
  { no: 'IGC-CRN-2026-00218', stream: 'adjust', cust: 0, net: -15600.000, vat: -780.000, total: -16380.000,
    cur: 'OMR', type: 'Credit Note', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '20 Aug 10:26:14',
    uuid: 'c7a4d9f8-0b3e-2d5c-b8a3-9f4e1c6d7b02', ackNo: 'ASP-OM-2026-0820-44736', ref: 'PEP-8863-2026',
    lines: 1, po: null, against: 'IGC-INV-2026-00390' },
  { no: 'IGC-DBN-2026-00061', stream: 'adjust', cust: 1, net: 4290.000, vat: 214.500, total: 4504.500,
    cur: 'OMR', type: 'Debit Note', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '20 Aug 10:33:40',
    uuid: 'a5e2b7d6-8f1c-0b3a-f6e1-7d2c9a4b5f80', ackNo: 'ASP-OM-2026-0820-44741', ref: 'PEP-8866-2026',
    lines: 1, po: null, against: 'IGC-INV-2026-00388' },
  { no: 'IGC-EXP-2026-00007', stream: 'export', cust: 4, net: 480000.000, vat: 0.000, total: 480000.000,
    cur: 'OMR', type: 'Invoice', scen: 'Export', stage: 5, state: 'active', retry: 0, created: '20 Aug 10:18:22',
    uuid: 'd8b5e0a9-1c4f-3e6d-c9b4-0a5f2d7e8c13', ackNo: 'ASP-OM-2026-0820-44760', ref: 'PEP-8870-2026',
    lines: 1, po: 'EXP-0007', awaiting: 'OTA report' },
  { no: 'IGC-INV-2026-00418', stream: 'gas-sell', cust: 3, net: 476685.000, vat: 23834.250, total: 500519.250,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 2, state: 'active', retry: 0, created: '20 Aug 10:31:09',
    uuid: null, ackNo: null, ref: null, lines: 3, po: 'GSA-052' },
  { no: 'IGC-INV-2026-00421', stream: 'gas-sell', cust: 0, net: 96800.000, vat: 4840.000, total: 101640.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 1, state: 'active', retry: 0, created: '20 Aug 10:38:56',
    uuid: null, ackNo: null, ref: null, lines: 2, po: 'GSA-014B' }
];

/* --- inbound supplier documents -------------------------------------------
   supplier indexes SUPPLIERS. All arrive over Peppol and land as ERP drafts.  */
const INBOUND = [
  { no: 'AHG-INV-2026-08842', supplier: 0, stream: 'gas-buy', recv: '20 Aug 10:29:16', net: 1024000.000,
    vat: 51200.000, total: 1075200.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00914',
    erpState: 'Draft — awaiting review', lines: 4, po: 'GPA-006', kind: 'peppol',
    note: 'Monthly gas purchase, July 2026 deliveries at the producer’s delivery point.' },
  { no: 'WSE-INV-2026-00733', supplier: 1, stream: 'gas-buy', recv: '20 Aug 10:24:03', net: 386400.000,
    vat: 19320.000, total: 405720.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00913',
    erpState: 'Draft — awaiting review', lines: 3, po: 'GPA-003', kind: 'peppol',
    note: 'Monthly gas purchase, July 2026 deliveries.' },
  { no: 'TOG-INV-2026-01204', supplier: 2, stream: 'transport-buy', recv: '20 Aug 09:58:02', net: 92750.000,
    vat: 4637.500, total: 97387.500, stage: 5, state: 'ok', erpRef: 'PINV-2026-00915',
    erpState: 'Draft — awaiting review', lines: 2, po: 'GTA-001', kind: 'peppol',
    note: 'Transportation capacity charge for July 2026 under the gas transportation agreement.' },
  { no: 'TOG-INV-2026-01205', supplier: 2, stream: 'transport-buy', recv: '20 Aug 09:58:40', net: 18400.000,
    vat: 920.000, total: 19320.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00916',
    erpState: 'Draft — awaiting review', lines: 1, po: 'GTA-001', kind: 'peppol',
    note: 'Commodity and fuel-gas charge for July 2026, invoiced separately from capacity.' },
  { no: 'UNK-INV-2026-00051', supplier: null, stream: 'gas-buy', recv: '20 Aug 09:41:19', net: 990.000,
    vat: 49.500, total: 1039.500, stage: 1, state: 'failed', erpRef: null,
    erpState: 'Held — cannot match', lines: 2, po: null, kind: 'peppol',
    err: 'Participant 0248:OM1100777001 does not resolve to IGC. Confirming the registration.',
    owner: 'platform' }
];

/* --- archive --------------------------------------------------------------- */
const ARCHIVE_ITEMS = [
  { item: 'Generated UBL XML',                  why: 'The official compliance document created from ERP invoice data.', size: '8.9 KB' },
  { item: 'UUID and QR information',            why: 'Unique identity and invoice verification information.',                size: '312 B' },
  { item: 'Submission and outcome timestamps',  why: 'The complete processing timeline.',                                    size: '1.1 KB' },
  { item: 'ASP acknowledgements and final status', why: 'Evidence of receipt, delivery or rejection.',                       size: '2.4 KB' },
  { item: 'Validation results and audit history', why: 'Traceability for corrections, support and audit.',                   size: '6.2 KB' },
  { item: 'Inbound records and export evidence', why: 'Preserved inbound originals and export references.',                  size: '—' }
];

/* --- ERP-side invoice list (origin screen · generic Enterprise ERP) -------- */
const ERP_INVOICES = [
  { no: 'IGC-INV-2026-00417', cust: 'Al Noor Power Company SAOC', date: '20-08-2026', due: '19-09-2026',
    net: 844160.000, vat: 42208.000, total: 886368.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'b7f4c2e1…0a35', qr: true },
  { no: 'IGC-INV-2026-00416', cust: 'Gulf Desal Water SAOC', date: '20-08-2026', due: '19-09-2026',
    net: 375375.000, vat: 18768.750, total: 394143.750, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'c1a8d3f2…1b46', qr: true },
  { no: 'IGC-INV-2026-00420', cust: 'Sohar Metals Industrial LLC', date: '20-08-2026', due: '19-09-2026',
    net: 164640.000, vat: 8232.000, total: 172872.000, docStatus: 'Posted', eStatus: 'In Progress',
    ready: true, uuid: null, qr: false },
  { no: 'IGC-CRN-2026-00218', cust: 'Al Noor Power Company SAOC', date: '20-08-2026', due: '—',
    net: -15600.000, vat: -780.000, total: -16380.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'c7a4d9f8…7b02', qr: false, credit: true },
  { no: 'IGC-INV-2026-00419', cust: 'Wadi Kabir Fertiliser LLC', date: '20-08-2026', due: '19-09-2026',
    net: 476685.000, vat: 23834.250, total: 500519.250, docStatus: 'Draft', eStatus: 'Not Applicable',
    ready: false, uuid: null, qr: false },
  { no: 'IGC-INV-2026-00415', cust: 'Sohar Metals Industrial LLC', date: '19-08-2026', due: '18-09-2026',
    net: 52000.000, vat: 2600.000, total: 54600.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'd4c1b8a7…3e92', qr: true },
  { no: 'IGC-INV-2026-00414', cust: 'Gulf Desal Water SAOC', date: '19-08-2026', due: '18-09-2026',
    net: 7300.000, vat: 365.000, total: 7665.000, docStatus: 'Posted', eStatus: 'Rejected by ASP',
    ready: true, uuid: 'e5d2c9b8…4f03', qr: false }
];

/* --- nominations & metered-volume billing (origin screen) ------------------
   Monthly invoices are built from nominated vs metered MMBtu. Take-or-pay
   applies when metered volume falls below the contracted minimum.            */
const NOM_DAILY = [17000, 16800, 17150, 17300, 16550, 17100, 17000, 17250, 16900, 16700, 17500, 17150,
                   16750, 17000, 17200, 16850, 17350, 17100, 16600, 17050, 17000, 16900, 17300, 16800,
                   17150, 17250, 16650, 17100, 17000, 16950, 17200];
const NOMINATIONS = {
  system: 'Enterprise ERP', module: 'Gas sales — nominations & metered billing',
  period: 'July 2026', days: 31,
  focus: { customer: 'Al Noor Power Company SAOC', contract: 'GSA-014', dcq: 17000, price: 1.600,
           topPct: 90, invoice: 'IGC-INV-2026-00417' },
  daily: NOM_DAILY,
  note: 'Each month’s invoice is built from the metered volumes against the customer’s nominations. The ERP raises it; the Hub clears it — the same pipe as every other sale.',
  assumption: 'Assumption · to confirm with IGC: the metering-close date each month, and who signs off volumes before the invoice is posted.',
  rows: [
    { cust: 'Al Noor Power Company SAOC', contract: 'GSA-014', dcq: 17000, nominated: 527000, metered: 527600, minimum: 474300, shortfall: 0,     price: 1.600, no: 'IGC-INV-2026-00417', state: 'Invoiced' },
    { cust: 'Gulf Desal Water SAOC',      contract: 'GSA-027', dcq: 7000,  nominated: 217000, metered: 214500, minimum: 195300, shortfall: 0,     price: 1.750, no: 'IGC-INV-2026-00416', state: 'Invoiced' },
    { cust: 'Sohar Metals Industrial LLC', contract: 'GSA-041', dcq: 3200, nominated: 99200,  metered: 78400,  minimum: 89280,  shortfall: 10880, price: 2.100, no: 'IGC-INV-2026-00420', state: 'Shortfall held' },
    { cust: 'Wadi Kabir Fertiliser LLC',  contract: 'GSA-052', dcq: 9000,  nominated: 279000, metered: 288900, minimum: 251100, shortfall: 0,     price: 1.650, no: 'IGC-INV-2026-00418', state: 'Metering check' }
  ]
};

/* --- processing logs ------------------------------------------------------- */
const LOGS = [
  { ts: '10:22:28.114', lv: 'info', txt: 'Poll tick — Enterprise ERP, watermark 2026-08-20T10:21:44Z' },
  { ts: '10:22:28.291', lv: 'info', txt: 'Fetched raw payload · 13.6 KB · 26 fields (allowlist applied)' },
  { ts: '10:22:28.402', lv: 'ok',   txt: 'Idempotency check passed — IGC-INV-2026-00417 not previously seen' },
  { ts: '10:22:28.556', lv: 'info', txt: 'Mapping profile IGC/v3 applied — 46 of 47 fields resolved' },
  { ts: '10:22:28.703', lv: 'info', txt: 'Scenario detected: B2B long-term gas sale · standard rate 5%' },
  { ts: '10:22:28.844', lv: 'ok',   txt: 'BTOM-002 UUID derived — b7f4c2e1-9a3d-5c8b-a1f6-2e7d4b9c0a35' },
  { ts: '10:22:29.017', lv: 'info', txt: 'UBL 2.1 Invoice built · 8.9 KB · 2 lines' },
  { ts: '10:22:29.188', lv: 'info', txt: 'Oman CIUS Schematron — evaluating 150 assertions' },
  { ts: '10:22:31.472', lv: 'warn', txt: 'IBR-W-014 · payment means defaulted to 30' },
  { ts: '10:22:31.474', lv: 'ok',   txt: 'Validation passed — 148 passed, 0 failed, 2 warnings (284 ms)' },
  { ts: '10:22:31.610', lv: 'ok',   txt: 'Archived — XML, validation report and audit trail written before transmission' },
  { ts: '10:22:31.788', lv: 'ok',   txt: 'State → READY_FOR_ASP · queued on the IGC channel' }
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
  sender: '0248:OM1300054871',
  sellerVatin: 'OM1300054871',
  sellerCr: 'CR 1450231',
  receiver: '0248:OM1100445566',
  docType: 'Peppol PINT billing — Oman',
  process: 'Peppol BIS billing'
};

/* --- history --------------------------------------------------------------- */
const HISTORY = [
  { no: 'IGC-INV-2026-00417', stream: 'gas-sell', date: '20 Aug 09:14', total: 886368.000, type: 'Invoice', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0820-44718', retries: 0 },
  { no: 'IGC-INV-2026-00416', stream: 'gas-sell', date: '20 Aug 09:21', total: 394143.750, type: 'Invoice', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0820-44719', retries: 0 },
  { no: 'IGC-SPT-2026-00031', stream: 'spot-sell', date: '20 Aug 09:41', total: 40950.000, type: 'Spot invoice', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0820-44731', retries: 0 },
  { no: 'IGC-INV-2026-00420', stream: 'gas-sell', date: '20 Aug 10:02', total: 172872.000, type: 'Invoice', dir: 'out', st: 'pending', ack: null, retries: 0 },
  { no: 'IGC-EXP-2026-00007', stream: 'export', date: '20 Aug 10:18', total: 480000.000, type: 'Export invoice', dir: 'out', st: 'pending', ack: null, retries: 0 },
  { no: 'IGC-CRN-2026-00218', stream: 'adjust', date: '20 Aug 10:26', total: -16380.000, type: 'Credit Note', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0820-44736', retries: 0 },
  { no: 'IGC-DBN-2026-00061', stream: 'adjust', date: '20 Aug 10:33', total: 4504.500, type: 'Debit Note', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0820-44741', retries: 0 },
  { no: 'AHG-INV-2026-08842', stream: 'gas-buy', date: '20 Aug 10:29', total: 1075200.000, type: 'Producer invoice', dir: 'in', st: 'success', ack: 'PINV-2026-00914', retries: 0 },
  { no: 'TOG-INV-2026-01204', stream: 'transport-buy', date: '20 Aug 09:58', total: 97387.500, type: 'Transporter invoice', dir: 'in', st: 'success', ack: 'PINV-2026-00915', retries: 0 },
  { no: 'IGC-INV-2026-00434', stream: 'gas-sell', date: '20 Aug 10:11', total: 19152.000, type: 'Invoice', dir: 'out', st: 'failed', ack: null, retries: 2, err: 'IBR-CO-15 · total mismatch' },
  { no: 'IGC-INV-2026-00414', stream: 'gas-sell', date: '19 Aug 16:22', total: 7665.000, type: 'Invoice', dir: 'out', st: 'rejected', ack: null, retries: 0, err: 'ASP rejected — buyer participant not registered' },
  { no: 'WSE-INV-2026-00733', stream: 'gas-buy', date: '20 Aug 10:24', total: 405720.000, type: 'Producer invoice', dir: 'in', st: 'success', ack: 'PINV-2026-00913', retries: 0 },
  { no: 'IGC-INV-2026-00415', stream: 'gas-sell', date: '19 Aug 14:11', total: 54600.000, type: 'Invoice', dir: 'out', st: 'success', ack: 'ASP-OM-2026-0819-44590', retries: 0 }
];

/* --- reporting — by stream, month to date August 2026 ---------------------- */
const REPORT_ROWS = [
  { id: 'gas-sell',      name: 'Long-term gas sales',       docs: 131, net: 61240000.000, vat: 3062000.000, zero: 0.000, failed: 3, ack: 128 },
  { id: 'spot-sell',     name: 'Spot gas sales',            docs: 22,  net: 4180000.000,  vat: 209000.000,  zero: 0.000, failed: 0, ack: 22 },
  { id: 'adjust',        name: 'Credit & debit notes',      docs: 37,  net: -420000.000,  vat: -21000.000,  zero: 0.000, failed: 0, ack: 37 },
  { id: 'export',        name: 'Export (zero-rated)',       docs: 4,   net: 1920000.000,  vat: 0.000,       zero: 1920000.000, failed: 0, ack: 4 },
  { id: 'gas-buy',       name: 'Gas purchase · producers',  docs: 94,  net: 38600000.000, vat: 1930000.000, zero: 0.000, failed: 0, ack: 94 },
  { id: 'transport-buy', name: 'Gas transportation',        docs: 31,  net: 6150000.000,  vat: 307500.000,  zero: 0.000, failed: 0, ack: 31 }
];

const REPORT_TYPES = [
  { n: 'VAT summary by stream',        d: 'Net, VAT and zero-rated totals for a period, per invoice stream.', tag: 'Finance' },
  { n: 'Reporting completeness',       d: 'Documents raised in the ERP against documents acknowledged by the ASP.', tag: 'Compliance' },
  { n: 'Monthly billing reconciliation', d: 'Each month’s volume-billing run: invoiced, acknowledged and any held.', tag: 'Operations' },
  { n: 'Exception ageing',             d: 'Open failures by age and by who owns the fix.', tag: 'Operations' },
  { n: 'Inbound purchase log',         d: 'Producer and transporter documents received and landed as drafts.', tag: 'Operations' },
  { n: 'OTA-position register',        d: 'The open treatments — export, government allocation, take-or-pay — and their status.', tag: 'Programme' }
];

/* --- mapping: what the Enterprise ERP exposes ------------------------------ */
const ERP_SCHEMA = [
  { f: 'InvoiceNumber',              t: 'string',  ex: 'IGC-INV-2026-00417' },
  { f: 'InvoiceDate',                t: 'date',    ex: '20260820' },
  { f: 'InvoiceType',                t: 'string',  ex: 'STD' },
  { f: 'IsCancelled',                t: 'boolean', ex: 'false' },
  { f: 'Currency',                   t: 'string',  ex: 'OMR' },
  { f: 'BillingEntity',              t: 'string',  ex: 'IGC-OM' },
  { f: 'CompanyRegistration',        t: 'string',  ex: '1450231' },
  { f: 'CompanyVATNumber',           t: 'string',  ex: '1300054871' },
  { f: 'CompanyAddressCity',         t: 'string',  ex: 'Muscat' },
  { f: 'CompanyCountry',             t: 'string',  ex: 'OM' },
  { f: 'AccountNumber',              t: 'string',  ex: 'CUST-00412' },
  { f: 'CustomerName',               t: 'string',  ex: '  al noor power company saoc ' },
  { f: 'CustomerVATNumber',          t: 'string',  ex: '1100445566' },
  { f: 'CustomerCountry',            t: 'string',  ex: 'OM' },
  { f: 'CustomerAddressStreet',      t: 'string',  ex: '(empty in this system)' },
  { f: 'NetAmount',                  t: 'decimal', ex: '844160.00' },
  { f: 'TaxAmount',                  t: 'decimal', ex: '42208.00' },
  { f: 'InvoiceTotal',               t: 'decimal', ex: '886368.00' },
  { f: 'AmountDue',                  t: 'decimal', ex: '886368.00' },
  { f: 'TaxRate',                    t: 'decimal', ex: '5.0' },
  { f: 'ProductCode',                t: 'string',  ex: 'GAS-LT-MMBTU' },
  { f: 'ProductDescription',         t: 'string',  ex: 'Natural gas — long-term supply, July 2026' },
  { f: 'Quantity',                   t: 'decimal', ex: '527600.0000' },
  { f: 'QuantityUnit',               t: 'string',  ex: 'EA' },
  { f: 'NetPriceAmount',             t: 'decimal', ex: '1.600' },
  { f: 'CustomerPO',                 t: 'string',  ex: 'GSA-014' },
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
      dnote: 'Standard for Omani B2B and Export — decided from the buyer’s registration and country.' },
    { erp: '—',                      std: 'IBT-024', stdName: 'Specification identifier', xf: 'const', req: 'Mandatory', ok: true, derived: true, constant: true,
      dnote: 'urn:peppol:pint:billing-1@om-1 — declares the OM-1.1 ruleset the document is validated against.' }
  ]},
  { grp: 'Seller party', rows: [
    { erp: 'BillingEntity',          std: 'BT-27', stdName: 'Seller name',           xf: 'lookup:company', req: 'Mandatory', ok: true },
    { erp: 'CompanyRegistration',    std: 'IBT-029', stdName: 'Seller identifier (CR)', xf: 'const:CR', req: 'Mandatory', ok: true,
      dnote: 'IGC’s Commercial Registration, scheme CR (code list CL-06-OM).' },
    { erp: 'CompanyVATNumber',       std: 'BT-31', stdName: 'Seller VAT identifier', xf: 'prefix:OM',   req: 'Mandatory', ok: true,
      dnote: 'The Omani VATIN OM1300054871.' },
    { erp: '—',                      std: 'BTOM-004', stdName: 'Seller participant ID', xf: 'derive:0248', req: 'Mandatory', ok: true, derived: true,
      dnote: 'IGC’s Peppol participant, 0248:OM<VATIN> — its endpoint, SMP entry and certificate. The exact Oman EAS scheme is confirmed on the OTA onboarding portal.' },
    { erp: 'CompanyAddressCity',     std: 'BT-37', stdName: 'Seller city',           xf: '',            req: 'Mandatory', ok: true },
    { erp: 'CompanyCountry',         std: 'BT-40', stdName: 'Seller country code',   xf: 'iso:alpha2',  req: 'Mandatory', ok: true }
  ]},
  { grp: 'Buyer party', rows: [
    { erp: 'AccountNumber',          std: 'BT-46', stdName: 'Buyer identifier',      xf: '',            req: 'Mandatory', ok: true },
    { erp: 'CustomerName',           std: 'BT-44', stdName: 'Buyer name',            xf: 'trim|upper',  req: 'Mandatory', ok: true },
    { erp: 'CustomerVATNumber',      std: 'BT-48', stdName: 'Buyer VAT identifier',  xf: 'nullable',    req: 'Conditional', ok: true,
      dnote: 'Present for Omani buyers, absent for an export buyer — which selects the Export scenario.' },
    { erp: 'CustomerCountry',        std: 'BT-55', stdName: 'Buyer country code',    xf: 'iso:alpha2',  req: 'Mandatory', ok: true },
    { erp: '',                       std: 'BT-50', stdName: 'Buyer address line 1',  xf: '',            req: 'Mandatory', ok: false,
      fallback: 'Address held in the Hub master',
      note: 'CustomerAddressStreet is present but empty on some customer records.' }
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
      dnote: 'Natural gas (goods) on every line — read from the item group.' }
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
    { st: 'warn', id: 'IBR-W-031',  txt: 'Buyer address line 1 (BT-50) sourced from the fallback mapping — field not exposed by the Enterprise ERP.',
      x: 'cac:AccountingCustomerParty/cac:Party/cac:PostalAddress/cbc:StreetName' }
  ]
};

const VALIDATION_FAILED = {
  profile: 'PINT-OM · Oman CIUS Schematron', ran: '20 Aug 2026 10:11:52 GST', ms: 261,
  passed: 143, failed: 2, warned: 1,
  rules: [
    { st: 'fail', id: 'IBR-053-OM', txt: 'Buyer VAT identifier (BT-48) is absent and no substitute participant ID was derived.',
      x: 'cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/cbc:CompanyID' },
    { st: 'fail', id: 'IBR-CO-15',  txt: 'Invoice total with VAT (BT-112) does not equal BT-109 + BT-110. Expected 19152.000, found 19151.000.',
      x: 'cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount' },
    { st: 'warn', id: 'IBR-W-014',  txt: 'Payment means code (BT-81) not supplied — defaulted to 30 (credit transfer).',
      x: 'cac:PaymentMeans/cbc:PaymentMeansCode' },
    { st: 'pass', id: 'IBR-001-OM', txt: 'An invoice shall have a Specification identifier (BT-24).' },
    { st: 'pass', id: 'IBR-002-OM', txt: 'An invoice shall have an Invoice number (BT-1).' }
  ]
};

/* --- ERP status sync steps (final origin screen) --------------------------- */
const SYNC_STEPS = [
  { name: 'Invoice posted in the Enterprise ERP', t: '20 Aug 09:14:02', st: 'ok',
    body: 'Invoice IGC-INV-2026-00417 posted in the Enterprise ERP. Document status set to Posted.' },
  { name: 'Collected by the Hub', t: '20 Aug 09:14:04', st: 'ok',
    body: 'Method 1 — Direct API. The Hub called the Enterprise ERP’s standard API. Raw payload 13.6 KB, field allowlist applied.' },
  { name: 'Mapped, built and validated', t: '20 Aug 09:14:06', st: 'ok',
    body: 'Profile IGC/v3 applied. UBL 2.1 built. Oman CIUS Schematron passed — 148 rules, 2 warnings.' },
  { name: 'Archived', t: '20 Aug 09:14:06', st: 'ok',
    body: 'XML, validation report and audit trail written to the compliance archive before anything was transmitted.' },
  { name: 'Transmitted to the ASP', t: '20 Aug 09:14:07', st: 'ok',
    body: 'Accepted by the accredited provider in 372 ms. Peppol reference PEP-8842-2026.' },
  { name: 'Outcomes tracked on three legs', t: '20 Aug 09:16:41', st: 'ok',
    body: 'ASP accepted it at 09:14:07. Reported to the Tax Authority at 09:15:52. The buyer’s provider confirmed delivery at 09:16:41.' },
  { name: 'Result published on the interface', t: '20 Aug 09:16:43', st: 'ok',
    body: 'Held against this invoice and available to the Enterprise ERP: UUID, e-invoice status, acknowledgement number, Peppol reference and QR information.' },
  { name: 'Collected by the Enterprise ERP', t: '20 Aug 09:16:43', st: 'ok',
    body: 'The IGC-side connector read the result and stored it on the invoice, where the print format renders the QR on the customer copy.' }
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
  'Inbound routing and draft delivery',
  'Dashboard, monitoring and central technical operations'
];

/* --- why Fawtara — differentiators (value screen) -------------------------- */
const FAWTARA_VALUE = [
  { k: 'Accredited by the OTA', d: 'A licensed Accredited Service Provider (ASP) — the clearing and reporting leg to Fawtara is ours, not a bolt-on.', ico: 'shield' },
  { k: 'Data residency in Oman', d: 'Invoice data and the legal archive are held in-country. No customer or billing data leaves Oman to be cleared.', ico: 'lock' },
  { k: 'Built for volume-based billing', d: 'Monthly billing to 130+ gas customers runs from metered nominations in one window, with each invoice cleared and tracked individually.', ico: 'queue' },
  { k: 'One pipe, every stream', d: 'Purchase, transport, long-term sale, spot, adjustment and export documents all run through one integration and one console.', ico: 'send' },
  { k: 'OTA-interface alignment', d: 'PINT-OM validation before anything is sent, and outcome tracking on all three Peppol legs after.', ico: 'check' },
  { k: 'We bring positions, not questions', d: 'On the unsettled treatments — export, government allocation, take-or-pay — Fawtara comes with a recommended reading to take to the OTA.', ico: 'grid' }
];

/* --- helpers --------------------------------------------------------------- */
function tenant(id) { return TENANTS.find(t => t.id === id) || IGC; }
function omr(n) {
  if (n === null || n === undefined) return '—';
  return (n < 0 ? '−' : '') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}
function pct(n) { return n === null || n === undefined ? '—' : n.toFixed(1) + '%'; }
function num(n) { return n === null || n === undefined ? '—' : n.toLocaleString('en-US'); }
function method(m) { return METHODS[m]; }
