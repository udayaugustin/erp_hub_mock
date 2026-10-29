/* ==========================================================================
   Peniel Technology LLC (Penieltech) × Fawtara — E-Invoicing Scope Walkthrough · demonstration dataset

   REAL: Peniel's legal name, that it is an accounting-software and IT-solutions
   partner with headquarters in Bur Dubai, UAE, an Oman presence in Seeb,
   Muscat, and that it sells and implements Tally, QuickBooks, Elate, ERPNext,
   Odoo and Sage, plus hardware, web and VAT services. It is ISO 9001:2015
   certified and says it has been trading 17+ years. Sourced from Peniel's own
   websites — see PENIEL-REAL-FACTS.md.
   INVENTED: every VATIN, CR number, customer, contract, rate, invoice number,
   amount and tax treatment below. None of it states how Peniel actually
   invoices. Counterparties are fictional on purpose.

   THIS MOCK IS A DISCOVERY / ALIGNMENT TOOL, not a finished compliant flow.
   Its spine is the SIX ways a software and implementation partner raises or
   receives invoices — new licences, implementation projects, annual support
   renewals, training days, hardware, and vendor licences bought in. Where the
   OTA has not settled a treatment (export of services, intra-company
   recharges, foreign-currency purchases) the mock shows Fawtara's RECOMMENDED
   reading, always flagged "to confirm with OTA".

   Peniel's own finance system is not confirmed, so the origin surface says
   "Peniel finance system" and names no vendor product. The products Peniel
   SELLS are named only as things it sells — never as counterparties.

   IDENTITY — single entity. One VATIN, one Commercial Registration, one Peppol
   participant (scheme 0248, so 0248:OM<VATIN>). No VAT group.

   Shapes are real: Omani VATIN OM + 10 digits, OMR to 3 decimals, 5% VAT,
   software licences and services billed by licence count or by project day.

   Demo clock: Thursday 29 October 2026, 10:42 GST (Oman's week runs Sun-Thu).
   ========================================================================== */

const DEMO_DATE  = '29 Oct 2026';
const DEMO_DAY   = 'Thursday';
const DEMO_CLOCK = '29 Oct 2026, 10:42 GST';
const VAT_RATE   = 5;

/* --- the entity ------------------------------------------------------------ */
const PENIEL = {
  id: 'PTI', name: 'Peniel Technology', legal: 'Peniel Technology LLC',
  vatin: 'OM1100462837', cr: '1248905', peppol: '0248:OM1100462837',
  city: 'Muscat', country: 'OM'
};
const TENANTS = [{ ...PENIEL, short: 'PTI', sector: 'Accounting software & IT solutions partner',
  erp: 'Peniel finance system', status: 'live', health: 'ok' }];

/* --- the six streams — THE spine of this mock ------------------------------
  dir: in (Peniel receives) | out (Peniel issues)
  mode: live (sent per document; the outcome arrives asynchronously)
  position: settled | proposed (Fawtara's reading, to confirm)               */
const STREAMS = [
  { id: 'licence',  n: 1, group: 'seller', dir: 'out', title: 'New software licences',
    role: 'Peniel as seller', origin: 'Peniel finance system', target: 'OTA — via the ASP',
    doc: 'Standard tax invoice', mode: 'live', position: 'settled',
    today: 7, mtd: 64,
    blurb: 'A Tally, ERPNext or Elate licence sold to a business. Billed per user or per company file at the partner rate; the invoice is raised when the order is confirmed, and the licence key ships on payment. The canonical document in this demo.' },
  { id: 'project',  n: 2, group: 'seller', dir: 'out', title: 'Implementation & customisation projects',
    role: 'Peniel as seller', origin: 'Peniel finance system', target: 'OTA — via the ASP',
    doc: 'Standard tax invoice', mode: 'live', position: 'settled',
    today: 5, mtd: 41,
    blurb: 'An ERP rollout is rarely paid in one go — it is billed by project stage or by consultant day. Data migration, configuration, custom reports and go-live support each land on their own invoice, referenced to the same project.' },
  { id: 'renewal',  n: 3, group: 'seller', dir: 'out', title: 'Annual support & subscription renewals',
    role: 'Peniel as seller', origin: 'Peniel finance system', target: 'OTA — via the ASP',
    doc: 'Standard tax invoice', mode: 'batch', position: 'settled',
    today: 209, mtd: 214,
    blurb: 'The volume stream, and the reason for a hub. Every customer’s support contract renews on its own anniversary; the run raises a few hundred small, nearly identical invoices in one evening. Method 3 — Secure file transfer carries a batch of this shape.' },
  { id: 'training', n: 4, group: 'seller', dir: 'out', title: 'Training & consultancy days',
    role: 'Peniel as seller', origin: 'Peniel finance system', target: 'OTA — via the ASP',
    doc: 'Standard tax invoice', mode: 'live', position: 'settled',
    today: 4, mtd: 33,
    blurb: 'VAT and payroll training for a customer’s finance team, sold by the day or by the attendee. Small, frequent and easy to lose track of — exactly the documents that go missing in a manual process.' },
  { id: 'hardware', n: 5, group: 'seller', dir: 'out', title: 'Hardware & networking',
    role: 'Peniel as seller', origin: 'Peniel finance system', target: 'OTA — via the ASP',
    doc: 'Standard tax invoice', mode: 'live', position: 'settled',
    today: 3, mtd: 22,
    blurb: 'POS terminals, barcode scanners, switches and servers sold alongside a software install. The only true goods stream here, so the goods/services indicator on the e-invoice line matters: it is goods, not services.' },
  { id: 'vendor',   n: 6, group: 'buyer', dir: 'in',  title: 'Vendor licences & imported services',
    role: 'Peniel as buyer', origin: 'Principal / distributor', target: 'Peniel finance system',
    doc: 'Supplier tax invoice', mode: 'live', position: 'proposed',
    today: 6, mtd: 51,
    blurb: 'Peniel buys licences from principals and distributors to resell. Omani distributors arrive over Peppol and land as drafts; foreign principals invoice in USD or AED, and the VAT is self-accounted under the reverse charge. Whether that needs a self-billed e-document is to confirm with the OTA.' }
];
function stream(id) { return STREAMS.find(s => s.id === id); }

/* --- Fawtara's recommended OTA positions ----------------------------------
   The mock's only load-bearing tax claims. Each renders with the "to confirm
   with OTA" tag.                                                             */
const OTA_POSITIONS = [
  { id: 'export', agenda: 'Export of services',
    headline: 'A customer outside Oman — 0% with a reason code',
    basis: 'Training, customisation or remote support delivered from Muscat to a customer with no place of residence or establishment in Oman, and used outside Oman. Fawtara reads it as a zero-rated export of services, with the evidence held against the invoice.',
    treatment: [
      'The invoice carries VAT category Z at 0%, with an exemption reason code on the tax subtotal.',
      'The buyer is identified by a foreign tax ID and country, not an Omani VATIN — so the scenario is Export, not B2B.',
      'The evidence — the customer’s non-residence and where the service is used — is referenced on the invoice and archived with it.'
    ],
    channels: 'Does not apply where the customer has an Omani branch that receives the service, or where the work is performed at a site inside Oman. That boundary is an assumption until the OTA confirms it.',
    tag: 'Fawtara’s recommended reading — to confirm with OTA' },
  { id: 'recharge', agenda: 'Recharges to the Dubai head office',
    headline: 'Group company to group company — a supply, or not?',
    basis: 'Peniel’s registered headquarters is in Bur Dubai and the Omani business sits under the Peniel name. If work is recharged between the two, whether that is a supply for VAT is not settled, and it depends on the legal structure — which is a discovery question here, not a fact.',
    treatment: [
      'Working assumption: where both sides are the same legal person, a recharge is an internal book entry and raises no tax invoice.',
      'The recharge is kept out of the e-invoicing pipe entirely — the finance system flags it as internal and the Hub never collects it.',
      'Where the Omani entity bills a customer directly, that is an ordinary invoice under stream 1 or 2.'
    ],
    channels: 'Decides which documents enter the pipe at all — so it is settled before build, not after.',
    tag: 'Fawtara’s recommended reading — to confirm with OTA' },
  { id: 'currency', agenda: 'Vendor purchases in foreign currency',
    headline: 'A USD licence invoice — which amount goes on the record?',
    basis: 'Most principals invoice Peniel in USD or AED. The Oman e-invoice is in OMR to three decimals, so a rate has to be chosen and held. Which rate — invoice date, posting date, or a monthly policy rate — is a policy decision that should be written down.',
    treatment: [
      'Recommended: convert at the rate agreed in the finance policy, and hold both the source-currency amount, the rate and the OMR equivalent on the archived record.',
      'The OMR amount is what lands in the ERP draft; the original currency and rate travel with it so an auditor can re-perform the conversion.',
      'For the outbound side, an Omani e-invoice to an Omani customer is in OMR. Foreign-currency outbound is not modelled here.'
    ],
    channels: 'Touches every vendor purchase and therefore the input-VAT recoverable each month.',
    tag: 'Fawtara’s recommended reading — to confirm with OTA' },
  { id: 'renewal', agenda: 'Recurring renewal batches',
    headline: 'A few hundred renewals in one run — is a batch acceptable?',
    basis: 'Annual support renewals are raised en masse on a scheduled run rather than one at a time. Whether the OTA expects each renewal as its own real-time document, or tolerates a run reported shortly after, is not confirmed.',
    treatment: [
      'Recommended: each renewal is still its own e-invoice with its own number, UUID and validation result — a batch changes the transport, not the document.',
      'The run is submitted through Method 3 — Secure file transfer on an agreed schedule, and each document’s outcome is tracked individually.',
      'Documents the run holds back — a missing address, a price query — are shown and never auto-sent.'
    ],
    channels: 'Determines whether the renewal run is a one-night operation or a rolling daily drip.',
    tag: 'Fawtara’s recommended reading — to confirm with OTA' }
];
function position(id) { return OTA_POSITIONS.find(p => p.id === id); }

/* --- roll-up (single entity, all six streams) ------------------------------
   Outbound today = 7 + 5 + 209 + 4 + 3 = 228.                                */
const GROUP = {
  name: 'Peniel Technology', trn: PENIEL.vatin, entity: PENIEL,
  streams: 6, settled: 5, proposed: 1,

  todayTotal: 228, todaySuccess: 224, todayFailed: 1, todayPending: 3,
  /* month to date, October 2026 */
  mtdTotal: 425, mtdFailed: 2,

  /* inbound today: vendor documents 6 */
  inboundToday: 6, inboundPeppol: 4, inboundForeign: 2,

  aspAvgMs: 341,
  /* the monthly renewal run that carries the volume */
  cycle: { id: 'PTI-RNW-2026-10', period: 'October 2026', customers: 214, invoiced: 209,
           held: 5, window: '26–28 Oct 2026', sentAt: '28 Oct 2026, 22:10 GST' },

  /* Fri 23 → Thu 29 Oct. Friday and Saturday are the Omani weekend. */
  week: [0, 0, 141, 27, 24, 31, 228],
  weekDays: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
  prevSameDay: 196
};

/* --- connection methods (kept from the platform proposal) ------------------ */
const METHODS = {
  1: { n: 'Method 1 — Direct API', short: 'Direct API', onsite: 'None',
       use: 'Cloud and API-enabled systems',
       how: 'The Hub calls the finance system’s standard API.' },
  2: { n: 'Method 2 — On-site agent', short: 'On-site agent', onsite: 'Lightweight agent',
       use: 'On-premise and restricted-network systems',
       how: 'A lightweight agent connects outward to the Hub and carries work both ways. No inbound firewall access is required.' },
  3: { n: 'Method 3 — Secure file transfer', short: 'Secure file transfer', onsite: 'None',
       use: 'Batch and low-interface environments',
       how: 'Scheduled exports and imports use an agreed format and secure location — the natural fit for a monthly renewal run of a few hundred invoices.' }
};

/* --- customers (invented) -------------------------------------------------- */
const CUSTOMERS = [
  { name: 'Al Khuwair Trading & Contracting LLC', vatin: 'OM1100528831', type: 'B2B', country: 'OM' },
  { name: 'Rusayl Medical Centre LLC',            vatin: 'OM1100639942', type: 'B2B', country: 'OM' },
  { name: 'Sohar Fresh Foods Industries SAOC',    vatin: 'OM1100751053', type: 'B2B', country: 'OM' },
  { name: 'Nizwa Ready-Mix LLC',                  vatin: 'OM1100862164', type: 'B2B', country: 'OM' },
  { name: 'Seeb Dental Group LLC',                vatin: null,           type: 'Export', country: 'QA', foreignId: 'QA300122334455667' }
];

/* distributors and principals — Omani ones arrive over Peppol, foreign ones
   invoice in USD/AED and the VAT is self-accounted under the reverse charge.
   These are fictional trading names. The products Peniel resells (Tally,
   ERPNext, Elate, Odoo, Sage) are named in line descriptions, never here.   */
const SUPPLIERS = [
  { name: 'Majan Software Distribution LLC',   vatin: 'OM1100114477', peppol: '0248:OM1100114477', country: 'OM', role: 'Omani software distributor' },
  { name: 'Barakat IT Hardware & Peripherals', vatin: 'OM1100225588', peppol: '0248:OM1100225588', country: 'OM', role: 'Omani hardware distributor' },
  { name: 'Northwind Global Licensing Pte Ltd', vatin: null, peppol: null, country: 'SG', foreignId: 'SG202233445F', role: 'Principal licensor (abroad)' },
  { name: 'Cedar Point Cloud Services DMCC',    vatin: null, peppol: null, country: 'AE', foreignId: 'AE100044556600001', role: 'Cloud hosting principal (abroad)' }
];

/* --- outbound stages (the pipeline shown once, for stream 2) --------------- */
const STAGES = ['Finance-system invoice', 'Collect & map', 'Build XML', 'Validate',
                'Record', 'ASP / Peppol', 'Track outcome', 'Result published', 'Archive'];
const STAGE_SHORT = ['ERP', 'Map', 'XML', 'Validate', 'Record', 'Send', 'Outcome', 'Result', 'Archive'];
const STAGE_NOTE = [
  'Invoice data from the Peniel finance system',
  'Apply the Peniel mapping profile',
  'UBL 2.1 · UUID · QR information',
  'Apply PINT-OM rules before sending',
  'Store XML and audit trail before anything is sent',
  'Transmit the valid XML',
  'Acknowledgement and final status',
  'UUID, status and QR held on the interface for the finance system to collect',
  'Acknowledgements and final status added to the record archived before sending'
];
const STAGE_COUNT = [3, 4, 3, 5, 2, 4, 2];

/* --- inbound stages -------------------------------------------------------- */
const IN_STAGES = ['Vendor sends', 'Match to Peniel', 'Validate',
                   'Archive original', 'Create draft', 'Finance review'];
const IN_STAGE_NOTE = [
  'Document arrives via ASP / Peppol',
  'Match participant ID and CR to Peniel, and the PO to a project',
  'Structure, identity and content checks',
  'Preserve the legal XML record',
  'Draft purchase invoice in the finance system, coded to the customer project',
  'Finance reviews and posts manually'
];

/* --- three acknowledgement legs -------------------------------------------- */
const LEGS = [
  { id: 'ack',   leg: 'Service provider → Hub', name: 'Validated and accepted by the ASP',
    at: '29 Oct 2026 10:08:41.508', el: '+0.4 s', st: 'ok',
    body: 'The ASP confirms the e-invoice was generated and validated. This is custody, not delivery.',
    ref: 'ASP-OM-2026-1029-51882' },
  { id: 'ota',   leg: 'Tax Authority → service provider', name: 'Reported to the Tax Authority',
    at: '29 Oct 2026 10:10:19.870', el: '+1 m 38 s', st: 'ok',
    body: 'The ASP reported the Tax Data Document to the OTA and the OTA acknowledged it. The Hub never talks to the OTA directly.',
    ref: 'OTA-RPT-2026-1029-91163' },
  { id: 'deliv', leg: 'Buyer’s provider → service provider', name: 'Delivered to the customer',
    at: '29 Oct 2026 10:11:02.336', el: '+2 m 21 s', st: 'ok',
    body: 'The customer’s access point confirmed receipt. This leg is outside Peniel’s control and can take hours.',
    ref: 'MLS-DELIVERED' }
];
const LEGS_PENDING = [
  { id: 'ack',   name: 'Validated and accepted by the ASP', at: '29 Oct 2026 10:31:52.117', st: 'ok',
    body: 'Receipt issued 0.4 s after submission.' },
  { id: 'ota',   name: 'Reported to the Tax Authority',     at: 'awaiting', st: 'pending',
    body: 'Within the reporting window. No action required.' },
  { id: 'deliv', name: 'Delivered to the customer',         at: 'awaiting', st: 'pending',
    body: 'The customer’s access point has not yet confirmed. Retried automatically by the ASP.' }
];

/* --- outbound documents ----------------------------------------------------
   stage indexes into STAGES; state: ok | active | failed | held
   The tracked invoice PTI-INV-2026-00418 (ERPNext implementation, stream 2 —
   consultant days plus user licences) is followed end-to-end. Its net/VAT/
   total are the one figure every screen has to agree on:
     2,310.000 + 576.000 = 2,886.000 net · 144.300 VAT · 3,030.300 total.     */
const INVOICES = [
  { no: 'PTI-INV-2026-00418', stream: 'project', cust: 0, net: 2886.000, vat: 144.300, total: 3030.300,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '29 Oct 10:08:36',
    uuid: 'c41f7b28-9a3e-5d17-b8f4-6e2c05a9d743', ackNo: 'ASP-OM-2026-1029-51882', ref: 'PEP-2207-2026',
    lines: 2, po: 'AKT-PO-8842' },
  { no: 'PTI-INV-2026-00417', stream: 'licence', cust: 1, net: 1240.000, vat: 62.000, total: 1302.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '29 Oct 09:52:14',
    uuid: 'd52a8c39-a04f-6e28-c906-7f3d16ba0e54', ackNo: 'ASP-OM-2026-1029-51874', ref: 'PEP-2201-2026',
    lines: 1, po: 'RMC-PO-2210' },
  { no: 'PTI-INV-2026-00421', stream: 'training', cust: 2, net: 480.000, vat: 24.000, total: 504.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 6, state: 'active', retry: 0, created: '29 Oct 10:31:51',
    uuid: 'e63b9d4a-b150-7f39-d017-805e27cb1f65', ackNo: 'ASP-OM-2026-1029-51908', ref: 'PEP-2219-2026',
    lines: 2, po: null, awaiting: 'OTA report · customer delivery' },
  { no: 'PTI-INV-2026-00423', stream: 'hardware', cust: 3, net: 1860.000, vat: 93.000, total: 1953.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 3, state: 'failed', retry: 2, created: '29 Oct 10:36:07',
    uuid: 'f74c0e5b-c261-8a4a-e128-916f38dc2076', ackNo: null, ref: null, lines: 3, po: 'NRM-PO-1109' },
  { no: 'PTI-INV-2026-00415', stream: 'licence', cust: 3, net: 3625.000, vat: 181.250, total: 3806.250,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '29 Oct 09:24:02',
    uuid: '085d1f6c-d372-9b5b-f239-027a49ed3187', ackNo: 'ASP-OM-2026-1029-51861', ref: 'PEP-2195-2026',
    lines: 2, po: 'NRM-PO-1108' },
  { no: 'PTI-INV-2026-00420', stream: 'project', cust: 1, net: 1650.000, vat: 82.500, total: 1732.500,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '29 Oct 10:26:55',
    uuid: '196e207d-e483-0c6c-0341-138b5afe4298', ackNo: 'ASP-OM-2026-1029-51901', ref: 'PEP-2214-2026',
    lines: 1, po: 'RMC-PO-2209' },
  { no: 'PTI-CRN-2026-00058', stream: 'adjust', cust: 2, net: -240.000, vat: -12.000, total: -252.000,
    cur: 'OMR', type: 'Credit Note', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '29 Oct 10:19:41',
    uuid: '2a7f318e-f594-1d7d-1452-249c6b0f53a9', ackNo: 'ASP-OM-2026-1029-51896', ref: 'PEP-2209-2026',
    lines: 1, po: null, against: 'PTI-INV-2026-00367' },
  { no: 'PTI-DBN-2026-00012', stream: 'adjust', cust: 3, net: 390.000, vat: 19.500, total: 409.500,
    cur: 'OMR', type: 'Debit Note', scen: 'B2B', stage: 8, state: 'ok', retry: 0, created: '29 Oct 10:23:06',
    uuid: '7c15e0f2-b8a4-3c0a-4711-9d2b46ce8157', ackNo: 'ASP-OM-2026-1029-51904', ref: 'PEP-2210-2026',
    lines: 1, po: null, against: 'PTI-INV-2026-00389' },
  { no: 'PTI-EXP-2026-00011', stream: 'export', cust: 4, net: 980.000, vat: 0.000, total: 980.000,
    cur: 'OMR', type: 'Invoice', scen: 'Export', stage: 5, state: 'active', retry: 0, created: '29 Oct 10:22:18',
    uuid: '3b80429f-06a5-2e8e-2563-35ad7c1a64ba', ackNo: 'ASP-OM-2026-1029-51899', ref: 'PEP-2212-2026',
    lines: 2, po: 'SDG-PO-0044', awaiting: 'OTA report' },
  { no: 'PTI-INV-2026-00424', stream: 'licence', cust: 2, net: 744.000, vat: 37.200, total: 781.200,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 2, state: 'active', retry: 0, created: '29 Oct 10:39:44',
    uuid: null, ackNo: null, ref: null, lines: 1, po: 'SFF-PO-3311' },
  { no: 'PTI-INV-2026-00425', stream: 'training', cust: 0, net: 320.000, vat: 16.000, total: 336.000,
    cur: 'OMR', type: 'Invoice', scen: 'B2B', stage: 1, state: 'active', retry: 0, created: '29 Oct 10:41:12',
    uuid: null, ackNo: null, ref: null, lines: 1, po: 'AKT-PO-8845' }
];

/* --- the renewal run: the volume stream (origin screen) --------------------
   One scheduled run raises every customer whose support contract renews this
   month. The held-back documents are the point of the screen: a batch must
   show what it refused to send, and why.                                    */
const RENEWAL = {
  run: 'PTI-RNW-2026-10', period: 'October 2026', window: '26–28 Oct 2026',
  scheduled: '28 Oct 2026, 22:00 GST', sentAt: '28 Oct 2026, 22:10 GST',
  raised: 214, sent: 209, held: 5, netSent: 41856.000, currency: 'OMR',
  method: 3,
  focus: { no: 'PTI-INV-2026-00391', customer: 'Al Khuwair Trading & Contracting LLC',
           product: 'Elate ERP — annual support', net: 468.000, vat: 23.400, total: 491.400 },
  lines: [
    { product: 'Elate ERP — annual support & updates',  customers: 74, net: 16872.000 },
    { product: 'TallyPrime — annual support (multi)',   customers: 51, net: 10914.000 },
    { product: 'ERPNext — annual support',              customers: 38, net: 7904.000 },
    { product: 'Odoo — annual support',                 customers: 22, net: 3960.000 },
    { product: 'QuickBooks — annual support',           customers: 16, net: 1656.000 },
    { product: 'Elate HRMS — annual support',           customers: 8,   net: 550.000 }
  ],
  heldRows: [
    { customer: 'Ruwi Stationery & Printing LLC',  product: 'TallyPrime — annual support', net: 216.000, reason: 'Billing address incomplete — no street line', owner: 'Sales' },
    { customer: 'Barka Auto Spares LLC',           product: 'Elate ERP — annual support',  net: 384.000, reason: 'Customer VATIN missing on the master record', owner: 'Sales' },
    { customer: 'Muttrah Interiors LLC',           product: 'Elate HRMS — annual support', net: 132.000, reason: 'Billing address incomplete — no street line', owner: 'Sales' },
    { customer: 'Ibri Cement Products SAOC',       product: 'ERPNext — annual support',    net: 624.000, reason: 'Price query open with the customer', owner: 'Finance' },
    { customer: 'Salalah Cold Stores LLC',         product: 'Odoo — annual support',       net: 288.000, reason: 'Price query open with the customer', owner: 'Finance' }
  ],
  note: 'Each renewal is its own e-invoice with its own number, UUID and validation result. The batch changes the transport, not the document — every one of the 209 is individually trackable.',
  assumption: 'Assumption · to confirm with Peniel: whether renewals are raised on each customer’s anniversary date, as modelled here, or coalesced into one monthly run.'
};

/* --- inbound vendor documents ---------------------------------------------
   supplier indexes SUPPLIERS. Omani distributors arrive over Peppol and land
   as finance-system drafts; a foreign principal's invoice is recorded in its
   own currency and the VAT self-accounted under the reverse charge.          */
const INBOUND = [
  { no: 'MSD-INV-2026-01892', supplier: 0, stream: 'vendor', recv: '29 Oct 10:27:52', net: 4820.000,
    vat: 241.000, total: 5061.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00914',
    erpState: 'Draft — awaiting review', lines: 3, po: 'PTI-PO-2026-0771', kind: 'peppol', project: 'AKT-ERP-2026',
    note: 'ERPNext and TallyPrime licences bought for resale against the Al Khuwair rollout, October batch.', cur: 'OMR' },
  { no: 'BIH-INV-2026-00421', supplier: 1, stream: 'vendor', recv: '29 Oct 10:19:08', net: 1240.000,
    vat: 62.000, total: 1302.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00913',
    erpState: 'Draft — awaiting review', lines: 4, po: 'PTI-PO-2026-0768', kind: 'peppol', project: 'NRM-HW-2026',
    note: 'POS terminals and barcode scanners for the Nizwa Ready-Mix install.', cur: 'OMR' },
  { no: 'MSD-INV-2026-01887', supplier: 0, stream: 'vendor', recv: '29 Oct 09:58:36', net: 2460.000,
    vat: 123.000, total: 2583.000, stage: 5, state: 'ok', erpRef: 'PINV-2026-00912',
    erpState: 'Draft — awaiting review', lines: 2, po: 'PTI-PO-2026-0765', kind: 'peppol', project: 'RMC-ODOO-2026',
    note: 'Odoo licences for the Rusayl Medical Centre project.', cur: 'OMR' },
  { no: 'BIH-INV-2026-00418', supplier: 1, stream: 'vendor', recv: '29 Oct 09:41:20', net: 610.000,
    vat: 30.500, total: 640.500, stage: 5, state: 'ok', erpRef: 'PINV-2026-00911',
    erpState: 'Draft — awaiting review', lines: 2, po: 'PTI-PO-2026-0761', kind: 'peppol', project: 'OVERHEAD',
    note: 'Replacement switches and cabling for the office network.', cur: 'OMR' },
  { no: 'NWG-2026-77841', supplier: 2, stream: 'vendor', recv: '29 Oct 09:44:08', net: 5460.000,
    vat: 273.000, total: 5460.000, stage: 4, state: 'held', erpRef: 'PINV-2026-00910',
    erpState: 'Draft — reverse charge, to confirm', lines: 1, po: 'PTI-PO-2026-0755', kind: 'pdf', project: 'OVERHEAD',
    note: 'Annual principal licence fee, 40 seats. Received as a PDF in USD; converted to OMR and the VAT self-accounted at 5% under the reverse charge.',
    cur: 'USD', fxAmount: 14000.000, fxRate: 0.3900 },
  { no: 'CPC-2026-3312', supplier: 3, stream: 'vendor', recv: '29 Oct 09:31:47', net: 2688.000,
    vat: 134.400, total: 2688.000, stage: 4, state: 'held', erpRef: 'PINV-2026-00909',
    erpState: 'Draft — reverse charge, to confirm', lines: 1, po: 'PTI-PO-2026-0752', kind: 'pdf', project: 'OVERHEAD',
    note: 'Cloud hosting for the Elate hosting service, invoiced in AED. VAT self-accounted under the reverse charge; whether a self-billed e-document is required is to confirm with the OTA.',
    cur: 'AED', fxAmount: 25677.000, fxRate: 0.1047 },
  { no: 'UNK-INV-2026-00031', supplier: null, stream: 'vendor', recv: '29 Oct 09:39:55', net: 340.000,
    vat: 17.000, total: 357.000, stage: 1, state: 'failed', erpRef: null,
    erpState: 'Held — cannot match', lines: 1, po: null, kind: 'peppol', cur: 'OMR',
    err: 'Participant 0248:OM1100991724 does not resolve to Peniel. Confirming the registration.',
    owner: 'platform' }
];

/* --- archive --------------------------------------------------------------- */
const ARCHIVE_ITEMS = [
  { item: 'Generated UBL XML',                  why: 'The official compliance document created from finance-system invoice data.', size: '9.2 KB' },
  { item: 'UUID and QR information',            why: 'Unique identity and invoice verification information.',                size: '312 B' },
  { item: 'Submission and outcome timestamps',  why: 'The complete processing timeline.',                                    size: '1.1 KB' },
  { item: 'ASP acknowledgements and final status', why: 'Evidence of receipt, delivery or rejection.',                       size: '2.4 KB' },
  { item: 'Validation results and audit history', why: 'Traceability for corrections, support and audit.',                   size: '6.1 KB' },
  { item: 'Project stage sign-off and the licence schedule', why: 'The customer acceptance or licence count behind the invoice, held with it.', size: '—' }
];

/* --- finance-system invoice list (origin screen · Peniel finance system) --- */
const ERP_INVOICES = [
  { no: 'PTI-INV-2026-00418', cust: 'Al Khuwair Trading & Contracting LLC', date: '29-10-2026', due: '28-11-2026',
    net: 2886.000, vat: 144.300, total: 3030.300, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'c41f7b28…d743', qr: true, project: 'AKT-ERP-2026', basis: 'Stage 4 · go-live + 12 licences' },
  { no: 'PTI-INV-2026-00417', cust: 'Rusayl Medical Centre LLC', date: '29-10-2026', due: '28-11-2026',
    net: 1240.000, vat: 62.000, total: 1302.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: 'd52a8c39…0e54', qr: true, project: 'RMC-ODOO-2026', basis: '8 Odoo users' },
  { no: 'PTI-INV-2026-00421', cust: 'Sohar Fresh Foods Industries SAOC', date: '29-10-2026', due: '28-11-2026',
    net: 480.000, vat: 24.000, total: 504.000, docStatus: 'Posted', eStatus: 'In Progress',
    ready: true, uuid: null, qr: false, project: '—', basis: 'Training · VAT refresher' },
  { no: 'PTI-CRN-2026-00058', cust: 'Sohar Fresh Foods Industries SAOC', date: '29-10-2026', due: '—',
    net: -240.000, vat: -12.000, total: -252.000, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: '2a7f318e…53a9', qr: false, credit: true, project: '—', basis: 'Two seats cancelled' },
  { no: 'PTI-INV-2026-00423', cust: 'Nizwa Ready-Mix LLC', date: '29-10-2026', due: '28-11-2026',
    net: 1860.000, vat: 93.000, total: 1953.000, docStatus: 'Posted', eStatus: 'Validation failed',
    ready: true, uuid: 'f74c0e5b…2076', qr: false, project: 'NRM-HW-2026', basis: 'POS terminals · hardware' },
  { no: 'PTI-INV-2026-00425', cust: 'Al Khuwair Trading & Contracting LLC', date: '29-10-2026', due: '28-11-2026',
    net: 320.000, vat: 16.000, total: 336.000, docStatus: 'Draft', eStatus: 'Not Applicable',
    ready: false, uuid: null, qr: false, project: '—', basis: 'Training · stock control' },
  { no: 'PTI-INV-2026-00420', cust: 'Rusayl Medical Centre LLC', date: '29-10-2026', due: '28-11-2026',
    net: 1650.000, vat: 82.500, total: 1732.500, docStatus: 'Posted', eStatus: 'Acknowledged',
    ready: true, uuid: '196e207d…4298', qr: true, project: 'RMC-ODOO-2026', basis: '10 consultant days' },
  { no: 'PTI-INV-2026-00398', cust: 'Al Khuwair Trading & Contracting LLC', date: '22-10-2026', due: '21-11-2026',
    net: 1680.000, vat: 84.000, total: 1764.000, docStatus: 'Posted', eStatus: 'Rejected by ASP',
    ready: true, uuid: '3c0a7859…1d36', qr: false, project: 'AKT-ERP-2026', basis: 'Stage 3 · data migration' }
];

/* --- the tracked implementation project (origin screen) --------------------
   An ERPNext rollout for a Muscat trading company. It is billed in stages,
   and the tracked invoice carries the go-live stage plus the user licences
   bought with it — the two streams most software partners raise together.   */
const CONTRACT = {
  no: 'AKT-ERP-2026', client: 'Al Khuwair Trading & Contracting LLC', po: 'AKT-PO-8842',
  title: 'ERPNext implementation — trading, inventory and VAT',
  value: 8400.000, advancePct: 25, retentionPct: 10,
  milestones: [
    { n: 1, name: 'Kick-off, chart of accounts and data mapping',   pct: 15, state: 'Invoiced', inv: 'PTI-INV-2026-00356' },
    { n: 2, name: 'Configuration — sales, purchase, stock',          pct: 20, state: 'Invoiced', inv: 'PTI-INV-2026-00374' },
    { n: 3, name: 'Data migration and parallel run',                 pct: 20, state: 'Invoiced', inv: 'PTI-INV-2026-00398' },
    { n: 4, name: 'Go-live support and user licences',               pct: 30, state: 'Invoiced', inv: 'PTI-INV-2026-00418' },
    { n: 5, name: 'Post-implementation review and handover',         pct: 15, state: 'In progress', inv: null }
  ],
  variation: { no: 'CR-02', name: 'Custom VAT return report — extra consultant day', value: 165.000 }
};

/* --- how the tracked invoice is built --------------------------------------
   One place for the numbers, so the finance system, the XML, the mapping and
   the reports all agree:
     implementation & migration, 14 consultant days at 165.000 = 2,310.000
     ERPNext user licences,     12 users at 48.000             =   576.000
     net 2,886.000 · VAT at 5% = 144.300 · total 3,030.300
   The advance already invoiced (25% of the project) is recovered as a prepaid
   amount (BT-113); retention is a payment term, not a reduction of the
   taxable amount.                                                        */
const SETTLEMENT = (function () {
  const days = 14, dayRate = 165.000, users = 12, userRate = 48.000;
  const services = days * dayRate;
  const licences = users * userRate;
  const net = services + licences;
  const vat = net * VAT_RATE / 100;
  const total = net + vat;
  const advNet = CONTRACT.value * CONTRACT.advancePct / 100;
  const prepaid = advNet * (1 + VAT_RATE / 100);
  const retention = net * CONTRACT.retentionPct / 100;
  return { days, dayRate, users, userRate, services, licences, net, vat, total,
           advNet, prepaid, payable: total - prepaid,
           retention, cashDue: total - prepaid - retention };
})();   /* services 2,310.000 · licences 576.000 · net 2,886.000 · VAT 144.300
           total 3,030.300 · prepaid 2,205.000 · payable 825.300
           retention 288.600 · cash due 536.700 */

/* --- training & consultancy days (origin screen) --------------------------
   The small stream: a day or a half-day sold to a customer's finance team.
   Delivered days are invoiced; scheduled days wait for attendance.          */
const TRAINING = {
  system: 'Peniel finance system', module: 'Sales — training & consultancy',
  period: 'October 2026', days: 28,
  focus: { customer: 'Sohar Fresh Foods Industries SAOC', course: 'VAT return preparation — refresher',
           invoice: 'PTI-INV-2026-00421' },
  lines: [
    { course: 'VAT return preparation — refresher',    code: 'TRN-VAT-02', attendees: 6, days: 1.0, rate: 240.000 },
    { course: 'Payroll and WPS in Elate HRMS',          code: 'TRN-PAY-01', attendees: 4, days: 1.0, rate: 240.000 },
    { course: 'ERPNext stock and warehouse control',    code: 'TRN-STK-03', attendees: 8, days: 1.5, rate: 180.000 },
    { course: 'TallyPrime bank reconciliation',         code: 'TRN-TAL-01', attendees: 3, days: 0.5, rate: 160.000 }
  ],
  note: 'Training days are small and frequent, which is exactly why they go missing in a manual process. Each delivered day becomes its own e-invoice on the day the attendance sheet is signed.',
  assumption: 'Assumption · to confirm with Peniel: whether training is priced per attendee or per day. This mock bills per day at a course rate.',
  rows: [
    { cust: 'Sohar Fresh Foods Industries SAOC', course: 'TRN-VAT-02', days: 1.0, amount: 480.000,  no: 'PTI-INV-2026-00421', state: 'Invoiced' },
    { cust: 'Al Khuwair Trading & Contracting LLC', course: 'TRN-STK-03', days: 1.5, amount: 270.000, no: 'PTI-INV-2026-00406', state: 'Invoiced' },
    { cust: 'Nizwa Ready-Mix LLC',              course: 'TRN-PAY-01', days: 1.0, amount: 240.000,  no: 'PTI-INV-2026-00401', state: 'Invoiced' },
    { cust: 'Rusayl Medical Centre LLC',        course: 'TRN-TAL-01', days: 0.5, amount: 80.000,   no: null,                 state: 'Scheduled' }
  ]
};

/* --- processing logs ------------------------------------------------------- */
const LOGS = [
  { ts: '10:08:37.114', lv: 'info', txt: 'Poll tick — Peniel finance system, watermark 2026-10-29T10:08:02Z' },
  { ts: '10:08:37.288', lv: 'info', txt: 'Fetched raw payload · 13.8 KB · 30 fields (allowlist applied)' },
  { ts: '10:08:37.401', lv: 'ok',   txt: 'Idempotency check passed — PTI-INV-2026-00418 not previously seen' },
  { ts: '10:08:37.553', lv: 'info', txt: 'Mapping profile PTI/v2 applied — 48 of 49 fields resolved' },
  { ts: '10:08:37.700', lv: 'info', txt: 'Scenario detected: B2B implementation project · services · standard rate 5%' },
  { ts: '10:08:37.846', lv: 'ok',   txt: 'BTOM-002 UUID derived — c41f7b28-9a3e-5d17-b8f4-6e2c05a9d743' },
  { ts: '10:08:38.019', lv: 'info', txt: 'UBL 2.1 Invoice built · 9.2 KB · 2 lines · project AKT-ERP-2026' },
  { ts: '10:08:38.190', lv: 'info', txt: 'Oman CIUS Schematron — evaluating 150 assertions' },
  { ts: '10:08:40.466', lv: 'warn', txt: 'IBR-W-014 · payment means defaulted to 30' },
  { ts: '10:08:40.468', lv: 'ok',   txt: 'Validation passed — 148 passed, 0 failed, 2 warnings (278 ms)' },
  { ts: '10:08:40.611', lv: 'ok',   txt: 'Archived — XML, validation report and audit trail written before transmission' },
  { ts: '10:08:40.790', lv: 'ok',   txt: 'State → READY_FOR_ASP · queued on the Peniel channel' }
];

/* --- ASP exchange ---------------------------------------------------------- */
const ASP = {
  provider: 'Accredited Service Provider — OTA licence ASP-OM-014',
  endpoint: 'https://ap.asp-oman.om/peppol/v1/documents',
  auth: 'mTLS · client certificate held in the platform vault',
  sentAt: '29 Oct 2026 10:08:41.144 GST',
  ackAt:  '29 Oct 2026 10:08:41.508 GST',
  otaAt:  '29 Oct 2026 10:10:19.870 GST',
  mlsAt:  '29 Oct 2026 10:11:02.336 GST',
  rtt: 341,
  http: '202 Accepted',
  ref: 'PEP-2207-2026',
  ackNo: 'ASP-OM-2026-1029-51882',
  otaRef: 'OTA-RPT-2026-1029-91163',
  msgId: 'urn:uuid:c41f7b28-9a3e-5d17-b8f4-6e2c05a9d743',
  sender: '0248:OM1100462837',
  sellerVatin: 'OM1100462837',
  sellerCr: 'CR 1248905',
  receiver: '0248:OM1100528831',
  docType: 'Peppol PINT billing — Oman',
  process: 'Peppol BIS billing'
};

/* --- history --------------------------------------------------------------- */
const HISTORY = [
  { no: 'PTI-INV-2026-00418', stream: 'project',  date: '29 Oct 10:08', total: 3030.300,  type: 'Implementation invoice', dir: 'out', st: 'success', ack: 'ASP-OM-2026-1029-51882', retries: 0 },
  { no: 'PTI-INV-2026-00417', stream: 'licence',  date: '29 Oct 09:52', total: 1302.000,  type: 'Licence invoice',        dir: 'out', st: 'success', ack: 'ASP-OM-2026-1029-51874', retries: 0 },
  { no: 'PTI-INV-2026-00415', stream: 'licence',  date: '29 Oct 09:24', total: 3806.250,  type: 'Licence invoice',        dir: 'out', st: 'success', ack: 'ASP-OM-2026-1029-51861', retries: 0 },
  { no: 'PTI-INV-2026-00420', stream: 'project',  date: '29 Oct 10:26', total: 1732.500,  type: 'Implementation invoice', dir: 'out', st: 'success', ack: 'ASP-OM-2026-1029-51901', retries: 0 },
  { no: 'PTI-INV-2026-00421', stream: 'training', date: '29 Oct 10:31', total: 504.000,   type: 'Training invoice',       dir: 'out', st: 'pending', ack: null, retries: 0 },
  { no: 'PTI-EXP-2026-00011', stream: 'export',   date: '29 Oct 10:22', total: 980.000,   type: 'Export invoice',         dir: 'out', st: 'pending', ack: null, retries: 0 },
  { no: 'PTI-CRN-2026-00058', stream: 'adjust',   date: '29 Oct 10:19', total: -252.000,  type: 'Credit Note',            dir: 'out', st: 'success', ack: 'ASP-OM-2026-1029-51896', retries: 0 },
  { no: 'MSD-INV-2026-01892', stream: 'vendor',   date: '29 Oct 10:27', total: 5061.000,  type: 'Vendor licence invoice', dir: 'in',  st: 'success', ack: 'PINV-2026-00914', retries: 0 },
  { no: 'BIH-INV-2026-00421', stream: 'vendor',   date: '29 Oct 10:19', total: 1302.000,  type: 'Vendor hardware invoice', dir: 'in', st: 'success', ack: 'PINV-2026-00913', retries: 0 },
  { no: 'NWG-2026-77841',     stream: 'vendor',   date: '29 Oct 09:44', total: 5460.000,  type: 'Principal licence (USD)', dir: 'in', st: 'pending', ack: 'PINV-2026-00910', retries: 0 },
  { no: 'PTI-INV-2026-00423', stream: 'hardware', date: '29 Oct 10:36', total: 1953.000,  type: 'Hardware invoice',       dir: 'out', st: 'failed', ack: null, retries: 2, err: 'IBR-CO-15 · total mismatch' },
  { no: 'PTI-INV-2026-00398', stream: 'project',  date: '22 Oct 14:08', total: 1764.000,  type: 'Implementation invoice', dir: 'out', st: 'rejected', ack: null, retries: 0, err: 'ASP rejected — buyer participant not registered' },
  { no: 'PTI-RNW-2026-10',    stream: 'renewal',  date: '28 Oct 22:10', total: 43949.000, type: 'Renewal run · 209 docs',  dir: 'out', st: 'success', ack: 'BATCH-2026-1028-44', retries: 0 }
];

/* --- reporting — by stream, month to date October 2026 ---------------------
   Renewal docs 214 of 425 total = half the month's documents. The renewal net
   is the run's own 41,856.000, so this row and the renewal screen agree.    */
const REPORT_ROWS = [
  { id: 'licence',  name: 'New software licences',         docs: 64, net: 74240.000,  vat: 3712.000, zero: 0.000,     failed: 1, ack: 63 },
  { id: 'project',  name: 'Implementation projects',       docs: 41, net: 52380.000,  vat: 2619.000, zero: 0.000,     failed: 0, ack: 41 },
  { id: 'renewal',  name: 'Support & subscription renewals', docs: 214, net: 41856.000, vat: 2092.800, zero: 0.000,    failed: 0, ack: 214 },
  { id: 'training', name: 'Training & consultancy days',   docs: 33, net: 9210.000,   vat: 460.500,  zero: 0.000,     failed: 0, ack: 33 },
  { id: 'hardware', name: 'Hardware & networking',         docs: 22, net: 28640.000,  vat: 1432.000, zero: 0.000,     failed: 1, ack: 21 },
  { id: 'adjust',   name: 'Credit notes',                  docs: 12, net: -3480.000,  vat: -174.000, zero: 0.000,     failed: 0, ack: 12 },
  { id: 'export',   name: 'Export of services (0%)',       docs: 5,  net: 4260.000,   vat: 0.000,    zero: 4260.000,  failed: 0, ack: 5 },
  { id: 'vendor',   name: 'Vendor purchases in',           docs: 34, net: 81640.000,  vat: 4082.000, zero: 0.000,     failed: 0, ack: 34 }
];

const REPORT_TYPES = [
  { n: 'VAT summary by stream',          d: 'Net, VAT and zero-rated totals for a period, per invoice stream.', tag: 'Finance' },
  { n: 'Reporting completeness',         d: 'Documents raised in the finance system against documents acknowledged by the ASP.', tag: 'Compliance' },
  { n: 'Renewal run reconciliation',     d: 'Each monthly run — raised, sent, held and the reason for every held document.', tag: 'Revenue' },
  { n: 'Exception ageing',               d: 'Open failures by age and by who owns the fix.', tag: 'Operations' },
  { n: 'Inbound vendor log',             d: 'Distributor documents landed as drafts, and foreign principals self-accounted.', tag: 'Operations' },
  { n: 'OTA-position register',          d: 'The open treatments — export of services, intra-company recharge, foreign currency, renewal batches — and their status.', tag: 'Programme' }
];

/* --- mapping: what the Peniel finance system exposes ----------------------- */
const ERP_SCHEMA = [
  { f: 'InvoiceNumber',              t: 'string',  ex: 'PTI-INV-2026-00418' },
  { f: 'InvoiceDate',                t: 'date',    ex: '20261029' },
  { f: 'InvoiceType',                t: 'string',  ex: 'STD' },
  { f: 'IsCancelled',                t: 'boolean', ex: 'false' },
  { f: 'Currency',                   t: 'string',  ex: 'OMR' },
  { f: 'BillingEntity',              t: 'string',  ex: 'PTI-OM' },
  { f: 'CompanyRegistration',        t: 'string',  ex: '1248905' },
  { f: 'CompanyVATNumber',           t: 'string',  ex: '1100462837' },
  { f: 'CompanyAddressCity',         t: 'string',  ex: 'Muscat' },
  { f: 'CompanyCountry',             t: 'string',  ex: 'OM' },
  { f: 'AccountNumber',              t: 'string',  ex: 'CL-04218' },
  { f: 'CustomerName',               t: 'string',  ex: '  al khuwair trading & contracting llc ' },
  { f: 'CustomerVATNumber',          t: 'string',  ex: '1100528831' },
  { f: 'CustomerCountry',            t: 'string',  ex: 'OM' },
  { f: 'CustomerAddressStreet',      t: 'string',  ex: '(empty in this system)' },
  { f: 'ProjectCode',                t: 'string',  ex: 'AKT-ERP-2026' },
  { f: 'NetAmount',                  t: 'decimal', ex: '2886.00' },
  { f: 'TaxAmount',                  t: 'decimal', ex: '144.30' },
  { f: 'InvoiceTotal',               t: 'decimal', ex: '3030.30' },
  { f: 'PrepaidAmount',              t: 'decimal', ex: '2205.00' },
  { f: 'AmountDue',                  t: 'decimal', ex: '825.30' },
  { f: 'TaxRate',                    t: 'decimal', ex: '5.0' },
  { f: 'ServiceCode',                t: 'string',  ex: 'IMP-ERPN-DAY' },
  { f: 'ServiceDescription',         t: 'string',  ex: 'ERPNext implementation & data migration — 14 consultant days' },
  { f: 'ItemKind',                   t: 'string',  ex: 'Service' },
  { f: 'Quantity',                   t: 'decimal', ex: '14.0000' },
  { f: 'QuantityUnit',               t: 'string',  ex: 'DAY' },
  { f: 'NetPriceAmount',             t: 'decimal', ex: '165.000' },
  { f: 'CustomerPO',                 t: 'string',  ex: 'AKT-PO-8842' },
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
      dnote: 'Peniel’s project code, so the customer can match the invoice to their implementation project.' },
    { erp: '—',                      std: 'BTOM-002', stdName: 'Document UUID',      xf: 'derive:uuidv5', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Built from the invoice number, the seller VAT identifier and the issue date. Stable — a resubmission of the same invoice produces the same UUID. In a renewal batch every document gets its own.' },
    { erp: '—',                      std: 'BTOM-001', stdName: 'Invoice transaction type', xf: 'derive:txntype', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Standard for Omani B2B and Export — decided from the customer’s registration and country.' },
    { erp: '—',                      std: 'IBT-024', stdName: 'Specification identifier', xf: 'const', req: 'Mandatory', ok: true, derived: true, constant: true,
      dnote: 'urn:peppol:pint:billing-1@om-1 — declares the OM-1.1 ruleset the document is validated against.' }
  ]},
  { grp: 'Seller party', rows: [
    { erp: 'BillingEntity',          std: 'BT-27', stdName: 'Seller name',           xf: 'lookup:company', req: 'Mandatory', ok: true },
    { erp: 'CompanyRegistration',    std: 'IBT-029', stdName: 'Seller identifier (CR)', xf: 'const:CR', req: 'Mandatory', ok: true,
      dnote: 'Peniel’s Commercial Registration, scheme CR (code list CL-06-OM). Which legal entity holds it is a discovery question — see PENIEL-QUESTIONS.md.' },
    { erp: 'CompanyVATNumber',       std: 'BT-31', stdName: 'Seller VAT identifier', xf: 'prefix:OM',   req: 'Mandatory', ok: true,
      dnote: 'The Omani VATIN OM1100462837.' },
    { erp: '—',                      std: 'BTOM-004', stdName: 'Seller participant ID', xf: 'derive:0248', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Peniel’s Peppol participant, 0248:OM<VATIN> — its endpoint, SMP entry and certificate. The exact Oman EAS scheme is confirmed on the OTA onboarding portal.' },
    { erp: 'CompanyAddressCity',     std: 'BT-37', stdName: 'Seller city',           xf: '',            req: 'Mandatory', ok: true },
    { erp: 'CompanyCountry',         std: 'BT-40', stdName: 'Seller country code',   xf: 'iso:alpha2',  req: 'Mandatory', ok: true }
  ]},
  { grp: 'Buyer party', rows: [
    { erp: 'AccountNumber',          std: 'BT-46', stdName: 'Buyer identifier',      xf: '',            req: 'Mandatory', ok: true },
    { erp: 'CustomerName',           std: 'BT-44', stdName: 'Buyer name',            xf: 'trim|upper',  req: 'Mandatory', ok: true },
    { erp: 'CustomerVATNumber',      std: 'BT-48', stdName: 'Buyer VAT identifier',  xf: 'nullable',    req: 'Conditional', ok: true,
      dnote: 'Present for Omani customers, absent for a customer outside Oman — which selects the Export scenario.' },
    { erp: 'CustomerCountry',        std: 'BT-55', stdName: 'Buyer country code',    xf: 'iso:alpha2',  req: 'Mandatory', ok: true },
    { erp: '',                       std: 'BT-50', stdName: 'Buyer address line 1',  xf: '',            req: 'Mandatory', ok: false,
      fallback: 'Address held in the Hub master',
      note: 'CustomerAddressStreet is present but empty on some customer records — the same gap that holds back renewal documents.' }
  ]},
  { grp: 'Monetary totals', rows: [
    { erp: 'NetAmount',              std: 'BT-109', stdName: 'Sum of line net amounts', xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'TaxAmount',              std: 'BT-110', stdName: 'Invoice total VAT amount', xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'InvoiceTotal',           std: 'BT-112', stdName: 'Invoice total with VAT',  xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: 'PrepaidAmount',          std: 'BT-113', stdName: 'Prepaid amount',          xf: 'decimal:3', req: 'Conditional', ok: true,
      dnote: 'The project advance already invoiced and paid, recovered on this stage invoice. Retention is not reported here — it is a payment term. To confirm with the OTA.' },
    { erp: 'AmountDue',              std: 'BT-115', stdName: 'Amount due for payment',  xf: 'decimal:3', req: 'Mandatory', ok: true,
      dnote: 'Invoice total less the prepaid amount. Retention held back in cash does not reduce it.' },
    { erp: 'TaxRate',                std: 'BT-119', stdName: 'VAT category rate',       xf: 'pct',       req: 'Mandatory', ok: true },
    { erp: '—',                      std: 'IBT-118-1', stdName: 'Tax scheme code',       xf: 'const:VAT', req: 'Mandatory', ok: true, derived: true, constant: true,
      dnote: 'Always VAT for Oman.' }
  ]},
  { grp: 'Line items', rows: [
    { erp: 'ServiceCode',            std: 'BT-155', stdName: 'Item seller identifier', xf: '',          req: 'Mandatory', ok: true },
    { erp: 'ServiceDescription',     std: 'BT-153', stdName: 'Item name',              xf: 'trim',      req: 'Mandatory', ok: true },
    { erp: 'Quantity',               std: 'BT-129', stdName: 'Invoiced quantity',      xf: 'decimal:4', req: 'Mandatory', ok: true },
    { erp: 'QuantityUnit',           std: 'BT-130', stdName: 'Unit of measure code',   xf: 'codelist:UNECE20', req: 'Mandatory', ok: true,
      dnote: 'DAY (consultant day) becomes DAY; a licence sold per user becomes C62 “one” on the line.' },
    { erp: 'NetPriceAmount',         std: 'BT-146', stdName: 'Item net price',         xf: 'decimal:3', req: 'Mandatory', ok: true },
    { erp: '—',                      std: 'BTOM-019', stdName: 'Goods or services indicator', xf: 'derive:itemkind', req: 'Mandatory', ok: true, derived: true,
      dnote: 'Read from ItemKind. Services on implementation and training lines; goods on the hardware stream — the one place a software partner’s invoice differs from a pure-services one.' }
  ]}
];

/* --- validation ------------------------------------------------------------ */
const VALIDATION = {
  profile: 'PINT-OM · Oman CIUS Schematron', ran: '29 Oct 2026 10:08:40 GST', ms: 272,
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
    { st: 'warn', id: 'IBR-W-031',  txt: 'Buyer address line 1 (BT-50) sourced from the fallback mapping — field not exposed by the finance system.',
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
  { name: 'Invoice posted in the Peniel finance system', t: '29 Oct 10:08:36', st: 'ok',
    body: 'Invoice PTI-INV-2026-00418 posted against contract AKT-ERP-2026 when the go-live stage was signed off. Document status set to Posted.' },
  { name: 'Collected by the Hub', t: '29 Oct 10:08:37', st: 'ok',
    body: 'Method 1 — Direct API. The Hub called the Peniel finance system’s standard API. Raw payload 13.8 KB, field allowlist applied.' },
  { name: 'Mapped, built and validated', t: '29 Oct 10:08:40', st: 'ok',
    body: 'Profile PTI/v2 applied. UBL 2.1 built. Oman CIUS Schematron passed — 148 rules, 2 warnings.' },
  { name: 'Archived', t: '29 Oct 10:08:40', st: 'ok',
    body: 'XML, validation report and audit trail written to the compliance archive before anything was transmitted.' },
  { name: 'Transmitted to the ASP', t: '29 Oct 10:08:41', st: 'ok',
    body: 'Accepted by the accredited provider in 341 ms. Peppol reference PEP-2207-2026.' },
  { name: 'Outcomes tracked on three legs', t: '29 Oct 10:11:02', st: 'ok',
    body: 'ASP accepted it at 10:08:41. Reported to the Tax Authority at 10:10:19. The customer’s provider confirmed delivery at 10:11:02.' },
  { name: 'Result published on the interface', t: '29 Oct 10:11:04', st: 'ok',
    body: 'Held against this invoice and available to the Peniel finance system: UUID, e-invoice status, acknowledgement number, Peppol reference and QR information.' },
  { name: 'Collected by the Peniel finance system', t: '29 Oct 10:11:04', st: 'ok',
    body: 'The connector read the result and stored it on the invoice, where the print format renders the QR on the customer copy.' }
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
  { k: 'Where the data is held', d: 'Where invoice data and the legal archive are held is agreed during solution design, not assumed here.', ico: 'lock' },
  { k: 'Built for recurring billing', d: 'A monthly renewal run of a few hundred small invoices is the hardest shape for a manual process; it is the shape this pipe was designed around.', ico: 'queue' },
  { k: 'One pipe, every stream', d: 'Licences, implementation days, renewals, training, hardware and vendor purchases all run through one integration and one console.', ico: 'send' },
  { k: 'OTA-interface alignment', d: 'PINT-OM validation before anything is sent, and outcome tracking on all three Peppol legs after.', ico: 'check' },
  { k: 'We bring positions, not questions', d: 'On the unsettled treatments — export of services, intra-company recharges, foreign-currency purchases, renewal batches — Fawtara comes with a recommended reading to take to the OTA.', ico: 'grid' }
];

/* --- helpers --------------------------------------------------------------- */
function tenant(id) { return TENANTS.find(t => t.id === id) || PENIEL; }
function omr(n) {
  if (n === null || n === undefined) return '—';
  return (n < 0 ? '−' : '') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}
function pct(n) { return n === null || n === undefined ? '—' : n.toFixed(1) + '%'; }
function num(n) { return n === null || n === undefined ? '—' : n.toLocaleString('en-US'); }
function method(m) { return METHODS[m]; }
