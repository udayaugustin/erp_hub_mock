# Al Nasr Mock — Decentralize / Relabel Analysis

_Goal: reframe `alnasr-mock/` from a **central multi-company Compliance Hub** into a **standalone single-company e-invoicing / compliance system**, deployed separately on each of Al Nasr's ~3 companies' own ERP servers. Naming target: **"Al Nasr E-Invoicing" / "Compliance System"** — no "central", "hub", "group", or "tenant" wording._

**Total findings: 236** across 27 files.

## At a glance

| Effort | Count |
|---|---|
| 🔴 Structural — screen concept must be reframed | 61 |
| 🟡 Context-dependent — reword in context | 98 |
| 🟢 Trivial — direct label swap | 77 |

| Category | Count |
|---|---|
| Central / Hub wording | 78 |
| Multi-tenant framing | 68 |
| Group dashboard / aggregation | 58 |
| Tenant onboarding | 12 |
| Nav / title | 11 |
| Data-to-central-server | 7 |
| Other | 2 |

| File | Findings |
|---|---|
| `alnasr-mock/hub/dashboard.html` | 19 |
| `assets/js/data.js` | 19 |
| `assets/js/shell.js` | 17 |
| `alnasr-mock/hub/reports.html` | 15 |
| `alnasr-mock/PRESENTER-SCRIPT.md` | 13 |
| `alnasr-mock/hub/tenants.html` | 13 |
| `alnasr-mock/hub/inbound.html` | 13 |
| `alnasr-mock/hub/users.html` | 13 |
| `alnasr-mock/hub/queue.html` | 12 |
| `alnasr-mock/erp/sync.html` | 12 |
| `alnasr-mock/README.md` | 11 |
| `alnasr-mock/portal/dashboard.html` | 11 |
| `alnasr-mock/hub/login.html` | 10 |
| `alnasr-mock/hub/onboard.html` | 8 |
| `alnasr-mock/hub/history.html` | 7 |
| `alnasr-mock/index.html` | 6 |
| `alnasr-mock/hub/tenant-detail.html` | 5 |
| `alnasr-mock/hub/boundary.html` | 5 |
| `alnasr-mock/ALNASR-REAL-ENTITIES.md` | 4 |
| `alnasr-mock/hub/mapping.html` | 4 |
| `alnasr-mock/hub/document.html` | 4 |
| `assets/css/app.css` | 4 |
| `alnasr-mock/portal/document.html` | 3 |
| `alnasr-mock/hub/asp.html` | 2 |
| `alnasr-mock/portal/login.html` | 2 |
| `alnasr-mock/erp/invoices.html` | 2 |
| `assets/js/ui.js` | 2 |

## How each area reads today

**narrative** — All four files still frame the system as WJ Towell did: a single CENTRAL "Compliance Hub" / "console" that a "group platform team" logs into, aggregating "all four companies" into a "Group Dashboard," onboarding companies onto a shared platform, with a multi-tenant portal whose whole point is that each company "sees only itself." The product is even named "Al Nasr Compliance Hub" throughout. For Al Nasr the app is deployed separately on each company's own ERP, so the biggest reframes are conceptual: the Group Dashboard, the Companies directory, and the "central team vs. companies" split are inherently group/multi-tenant screens that must be reframed to one company's own compliance console. A clear leftover bug survives in the presenter script — "the other eighty-eight companies" — carried over verbatim from the 89-company WJ Towell group.

**hub-group-core** — All four hub/ screens are built as a central, multi-tenant control plane: a company roster (tenants.html), a per-tenant detail (tenant-detail.html), a group roll-up (dashboard.html), and a tenant-onboarding wizard (onboard.html), all branded 'Al Nasr Compliance Hub' with recurring 'the Hub', 'central', 'group', 'entities' and hub-vs-self-hosted language. For Al Nasr the biggest reframe is conceptual, not lexical: dashboard.html and tenants.html exist to aggregate and list many companies, and onboard.html exists to keep adding companies to a shared platform — none of which fit a single-company app deployed on one company's own ERP. Beyond the many trivial label swaps ('Group Dashboard' → 'Dashboard', 'the Hub' → 'the system', 'Onboard a company' → 'Connection setup'), the self-hosted-vs-hub split, the live-companies and silent-companies counters, the 'central Hub team' delivery boundary, and the 'adding company 90' onboarding narrative each need a structural rethink toward one company transmitting directly to the ASP from its own environment.

**hub-operations** — All five screens are branded "Al Nasr Compliance Hub" and consistently narrate a central hub that multiple companies (a 4-entity group) feed into: a central technical team, per-company queue lanes and filters, cross-company aggregate counts (GROUP.live, "none of 4", "N entities"), a Mapping Studio that switches between all four companies' profiles, and a boundary screen whose entire rationale is "solve it once, centrally, for every entity." The biggest reframe is conceptual, not cosmetic: several screens (queue's per-company channels/Company column, inbound's receiving-company routing, mapping's profile switcher, boundary's group-economics argument) are built around multi-tenant/group structure and need reworking to a single company running the app on its own ERP, not just relabeling. The literal term "the Hub" is used as the product/system name throughout and should be globally renamed (e.g. "the system" / "Al Nasr E-Invoicing"), along with "Central technical team" -> "technical team".

**hub-misc** — These five hub screens are pervasively built around the WJ Towell central/group model: every page title carries the 'Compliance Hub' brand, the login sells 'one platform, four entities, one compliance picture' with a group-admin vs entity-portal split, and the users and reports screens are structurally group tools — a 'Central team' role-and-provisioning model, and reports whose entire content is one-row-per-entity tables totalled 'across N entities in the group'. The biggest reframes are conceptual, not cosmetic: the reports screen's per-entity aggregation and wave-readiness rollout, the users screen's central-team/company role split and cross-company scoping notes, and the login's group-platform architecture all need to be rebuilt around a single company running the app on its own ERP server. Many remaining hits ('the Hub', 'Compliance Hub', 'group SSO', 'this company') are trivial label swaps to a single-company product name like 'Al Nasr e-Invoicing'.

**portal-and-erp** — These five files still read as a slice of WJ Towell's central multi-tenant Compliance Hub. The portal pages repeatedly invoke a group-level \"central team\"/\"group IT\" and describe reports the \"group runs\" filtered to one tenant, while the ERP pages route invoices \"into the Hub\" and narrate a central \"Compliance Hub\" transmitting to \"the group's accredited service provider.\" The biggest reframe is conceptual: relabel \"the Hub\"/\"Compliance Hub\" as this company's own \"e-invoicing system,\" strip every \"central/group\" support and reporting reference, and (structurally) rename the underlying multi-tenant data model (tenant() lookups, per-row tenant field, group-admin role) so it reads as one standalone deployment rather than one company out of many.

**shared-assets** — These four files are the shared engine of the demo and are saturated with the central-group-hub model: shell.js defines the whole six-act narrative, the "Group Dashboard / Companies / Onboard a Company" navigation, and a "Compliance Hub / Group IT" brand; data.js models FOUR companies with a GROUP roll-up, rollout WAVES, cross-company activity/exception feeds, per-entity reports, and a "Central team" access flow; ui.js and app.css carry "Compliance Hub", "Centralized Integration Hub", tenant chips and tenant-scoped surfaces. The biggest reframe is conceptual: a single-company deployment on the company's own ERP has no group, no multi-company console, no tenant list, and no "Hub" that others feed into — so the group dashboard, Companies directory, WAVES programme, GROUP aggregation and "Central team" language need to collapse to one company, while dozens of literal "Hub" / "group" / "entity" / "central" labels need single-company rewording.

## 🔴 Structural — screen concept must be reframed  (61)


### `alnasr-mock/ALNASR-REAL-ENTITIES.md`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| lines 70-75 | the dashboard, Companies and Queue screens state that the path exists but is unassigned ... every figure on the dashboard is observed rather than self-reported, and the four entity rows sum exactly to the group totals | Reframe so each company's dashboard reflects only its own observed figures; drop 'group totals' and the hub-observes-entities framing. | Describes a dashboard whose figures are the hub's observation of four entities summing to group totals — the centralized observability model where all companies feed one server. |

### `alnasr-mock/PRESENTER-SCRIPT.md`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 102, Screen 3 one-point | one screen answers “is the whole group compliant today?” | one screen answers “is the company compliant today?” | The dashboard's stated purpose is group-wide compliance across companies — inherently a central aggregation screen. |
| line 105, Screen 3 | “This is the group view. All four companies, on one screen.” | “This is the company view — every invoice for this company on one screen.” | Explicit group aggregation of all four companies onto one central screen. A standalone install shows one company only. |
| line 127, Screen 4 | “Every company in the group is listed here. This is where you see how mixed the estate is.” | “Every branch and ERP connection for this company is listed here — this is where you see how the estate connects.” | A directory listing 'every company in the group' is a tenant/company directory — a group concept with no place in a single-company install. |
| lines 112-117, Screen 3 | “Two companies have sent nothing today. They have not failed — they have gone silent. ... somebody has to remember to check every company every morning. | Reframe to per-branch/per-division silence within the one company, e.g. “A business unit that stops reporting is a compliance risk — the system watches each one and tells you.” | The silence-detection narrative watches multiple companies from a central vantage point — only possible in a group/multi-tenant hub. |
| lines 453-454, Two-minute version | **Group Dashboard** — “Four companies, one screen. And it tells you when a    company goes silent.” | **Dashboard** — “The company's compliance status on one screen, with alerts when reporting goes silent.” | The condensed pitch still leads with the four-company group dashboard as the headline argument. |

### `alnasr-mock/README.md`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 37, act II header | **II — The group, and the companies in it** | **II — The company and its operations** | An entire act is built around 'the group and the companies in it' — a group-portfolio concept absent from a single-company deployment. |
| line 38, steps table | Hub — Group Dashboard \| All four companies, including the one that has gone quiet | Dashboard \| The company's compliance status today | A 'Group Dashboard' aggregating all four companies is inherently a central group screen. In a standalone install it must show only that one company's compliance status. |

### `alnasr-mock/erp/invoices.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 64 href and line 118 href (../hub/...) | href="../hub/dashboard.html" and href="../hub/document.html" | Point links to the renamed portal/e-invoicing screens (e.g. ../portal/dashboard.html, ../portal/document.html); if the hub/ folder is kept for now, treat its screens as 'the e-invoicing system', not a central hub. | The target folder/screens are literally named 'hub', carrying the central Compliance Hub concept in navigation and file structure. |

### `alnasr-mock/hub/boundary.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| lines 105-107, proposal quote | “Each entity is responsible for making one complete invoice payload available at the agreed interface. Everything from that interface onward is delivered by the central hub team.” | “Al Nasr is responsible for making one complete invoice payload available at the agreed interface. Everything from that interface onward is delivered by the compliance system.” (If the original proposal sentence must be preserved as a quote, add a note that it was written for the group and is being adapted.) | Explicitly "each entity" + "the central hub team" — the group/central operating model verbatim. |
| lines 123-129, 'why' reasoning | Everything downstream of the payload is the same regulatory problem ${num(GROUP.entities)} times over ... It is solved once, centrally, and every entity gets the same answer on the same day. ... shared work on one side, entity-specific work on the other | Reframe to a single company: everything downstream of the payload is the regulatory machinery (the XML to build, the PINT-OM rules, the accredited provider, the archive) — built once by the delivery team so the ERP only has to hand over a payload. Drop the "N entities / centrally / every entity" framing. | The justification for the boundary is that the same problem recurs across N entities and is "solved once, centrally" for "every entity" — a group-economics argument that collapses when there is only one company. |

### `alnasr-mock/hub/dashboard.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 111, <h2> | Entities reporting for themselves | Remove the card, or repurpose it to 'Direct-to-ASP transmission' status for this single deployment. | The hub-vs-self-hosted split only makes sense in a central model where some entities feed the hub and others report separately. A standalone single-company deployment always reports for itself, so this whole card is meaningless. |
| line 179-186, statePill logic | `${GROUP.silentEntities} ${GROUP.silentEntities === 1 ? 'company has' : 'companies have'} stopped reporting` | Report a single reporting state for this company, e.g. 'Reporting normally' / 'Reporting stopped — investigating'. | Status pill counts how many companies across a group have stopped reporting — an aggregate that only exists when many companies feed one screen. |
| line 212, 'Companies live' tile | label: 'Companies live', value: `${GROUP.live}<span style="font-size:15px;color:var(--text-lo)"> / ${GROUP.entities}</span>` | Replace with a single go-live status tile, e.g. label 'Status' value 'Live since 12 Jan 2026'. | A live-companies-out-of-total tile is a group rollout counter. A single deployment is either live or not; there is no fleet of companies to count. |
| line 233-240, silentBar | Companies that have sent the Hub nothing at all today. Nothing has failed — nothing has arrived,         which the group would otherwise not see. ${GROUP.todayFailed} failures today are counted separately. | Periods today where the system expected documents from the ERP but received none. Nothing failed — nothing arrived. ${failed} failures today are counted separately. | Narrative describes companies sending data to the Hub and the group not seeing silence — the central-server-with-tenants model. In a single install there is one data stream, not companies feeding a hub. |
| line 290-297, selfHosted description | These entities run the same software inside their own environment and transmit directly to the ASP.            They have no connection to the Hub, so the Hub cannot observe them. | Remove this narrative; in a single-company deployment the system already runs inside this company's environment and transmits directly to the ASP. | Describes other entities running their own copy and not connecting to the Hub — a central-vs-self-hosted tenant split. Every Al Nasr company already runs the app on its own ERP, so the distinction collapses. |
| line 40, data-hint | Every company in the group on one screen. Volumes, failures, and the companies that have stopped reporting. | This company's e-invoicing at a glance. Document volumes, failures, and any reporting gaps today. | The hint explicitly describes the screen's purpose as aggregating every company in a group onto one screen. In a single-company deployment there is only one company's volumes and failures to show. |
| line 48, <h1> | Group Dashboard | Dashboard | Page heading names the screen a group dashboard; the whole screen is conceived as a roll-up spanning many companies rather than one company's operations. |
| line 79, <h2> | Companies connected to the Hub | ERP connection status | Section header assumes multiple companies feeding a central Hub. A single-company deployment has no roster of companies connecting to a hub — it monitors its own ERP connection. |

### `alnasr-mock/hub/history.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 93 (<th>Company</th>) and line 166 (tenantChip(h.tenant)) | <th>Company</th> | Drop the Company column (all rows are this company); if a grouping dimension is wanted, use Branch or Business unit instead of a tenant/company chip. | The history table carries a 'Company' column populated by tenantChip per row, i.e. it lists documents from several companies side by side — a multi-tenant/group listing. In a single-company deployment every row is the same company, so the column is redundant and its per-tenant framing is wrong. |

### `alnasr-mock/hub/inbound.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| lines 253-254 & 263, routing UI | <span class="chip fail">No matching entity</span> ... <option value="">All receiving companies</option> | "Not addressed to this company" and remove the receiving-company selector (a single company has one inbox). | "matching entity" and "All receiving companies" present inbound routing as a selection among multiple tenant entities. |
| lines 287-291, failBody 'What happened' | A supplier's provider transmitted this document to the group. Routing works by matching the receiving participant identifier on the document to one of the group's registered entities. ${held.err} The document was accepted and stored, but it has not been delivered into any ERP, because the Hub cannot tell which company it belongs to. | The supplier's provider transmitted this document addressed to a participant identifier. Routing works by matching the receiving participant identifier on the document to Al Nasr's registered identifier. ${held.err} The document was accepted and stored, but no draft was created because the identifier does not match Al Nasr's. | Whole narrative is group/central: data sent "to the group", matched against "the group's registered entities", and "the Hub cannot tell which company it belongs to". A standalone company either owns the identifier or it doesn't. |
| lines 310-318, ownership left side | The central technical team ... Nobody in any of the All four companies can fix their own data from their own finance system, and no company is even shown this one as their exception. The central team checks the participant registration with the group's service provider and, once the identifier is registered to the right entity, the document is routed and the draft is created. | The technical team ... This is a platform and participant-registration problem, not business data, so the finance team does not resolve it. The technical team checks the participant registration with the accredited service provider and, once the identifier is registered correctly, the document is routed and the draft is created. | Central team owning cross-company exceptions, "all four companies", "the group's service provider", "the right entity" — the multi-tenant central-operations model in full (note the text is already garbled: "Nobody in any of the All four companies"). |

### `alnasr-mock/hub/login.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 35, auth-hero | One platform.<br>Four entities.<br><em>One compliance picture.</em> | 'Your invoices.<br>Every rule checked.<br><em>Reported to the Authority.</em>' (single-company framing) | The hero pitch is the group value proposition: one central platform unifying four entities into one aggregated compliance picture. The single-company app serves one entity on its own server. |
| lines 62-63, sign-in sub | Group platform administrators only. Entity finance users sign in through the <a href="../portal/login.html" style="color:var(--accent-hi);font-weight:600">Entity Portal</a>. | 'Administrators sign in here. Finance users sign in through the finance portal.' — or, if there is only one app, drop the group/entity split entirely. | Splits sign-in into 'Group platform administrators' (central) vs per-entity finance users on a separate Entity Portal — the central-hub-plus-tenant-portals architecture. A single-company app has one sign-in. |

### `alnasr-mock/hub/mapping.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| lines 95-100 & 637-644, profile switcher | <option value="ANM/v6">Al Nasr Marbles — ANM/v6 (published)</option> <option value="ANT/v4">Al Nasr Terrazzo — ANT/v4</option> <option value="ATC/v3">Trading & Contracting — ATC/v3</option> <option value="AES/v1">Energy Services — AES/v1 (draft)</option> | Remove the cross-company profile switcher; keep only this deployment's own mapping profile (versions of it, e.g. ANM/v5, ANM/v6, may still be selectable). | A dropdown that switches mapping profiles across four separate Al Nasr companies is the multi-tenant model: one central Mapping Studio holding every company's profile. In a per-company deployment only this company's profile exists. |

### `alnasr-mock/hub/onboard.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 41, data-crumbs + data-hint | data-crumbs="Configuration / Onboard a Company"       data-hint="Bringing a new company on is connection, mapping and configuration — not a new installation." | Configuration / Connection Setup; hint: 'Connecting this company's ERP is connection, mapping and configuration.' | 'Bringing a new company on' is the multi-tenant onboarding narrative — repeatedly adding companies to a shared platform. Al Nasr sets up each deployment once for one company. |
| line 49, <h1> | Onboard a company | Connection setup | Heading for adding a company to a central platform. |
| line 6, <title> | Onboard a Company — Al Nasr Compliance Hub | Connection Setup — Al Nasr E-Invoicing | Title casts the screen as onboarding a company (tenant) onto a central compliance hub. |

### `alnasr-mock/hub/queue.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 106, table header <th>Company</th> | <th>Company</th> | Drop the Company column (or repurpose it, e.g. "Branch"/"Division" only if the single company genuinely has sub-units). | A per-tenant Company column only makes sense when the queue spans multiple companies; on a single-company deployment every row is the same company. |
| line 121, card head | Per-company channels | Reframe to queue depth over time / by document type, or remove the card. If Al Nasr wants a single lane, title it "Queue depth". | The entire "Per-company channels" card visualizes queue depth broken out per company — inherently a group dashboard. |
| line 77, #fCompany select + line 269 filter logic | <select class="select select-sm" id="fCompany" style="width:auto;min-width:210px"></select> | Remove the company filter, or replace with a document-type / date filter relevant to one company. | A company/tenant filter/switcher implies a tenant list; a single-company system has nothing to switch between. |
| lines 202-206, filterNote | The ${GROUP.selfHosted} self-hosted entities are not listed here. They transmit directly to the ASP and nothing of theirs passes through the Hub queue.` : `All ${GROUP.hubEntities} entities connect through the Hub, so every document in flight appears here. Nothing is self-hosted, and nothing bypasses this queue. | Every document in flight appears here — this system handles all of Al Nasr's outbound invoices from the company's own ERP. | Describes entities connecting through / bypassing a central Hub queue — the core multi-tenant central-server narrative. No such notion exists when the app runs on the company's own ERP server. |

### `alnasr-mock/hub/reports.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 310, catalogue report name | 'VAT summary by entity' | 'VAT summary' (this company, broken down by period or document type). | The report is named 'by entity' — a per-company breakdown that only exists in a group hub. |
| lines 140-148 VAT_COLS 'Entity' and the whole per-entity table body | { k: 'id',     t: 'Entity',            r: false }, | Reframe reports to this one company: drop the Entity column and per-entity rows; break the figures down by period, document type, or branch instead. Where a leading dimension is needed, use Branch/Business unit. | Every report is a table of one row per entity (company) with a totals row summing across entities — the report screen's entire purpose is group-wide multi-company aggregation. A single-company system has no per-entity breakdown. |
| lines 171, 219, 250, 266, 285 (repeated) and 200 header | '<td>Total — ' + REPORT_ROWS.length + ' entities</td>' | Replace the entities total with a plain 'Total' over this company's rows (e.g. by period or document type). | Every report footer totals 'N entities', i.e. sums across multiple companies. Nonsensical for a single company. |
| lines 293-306 waveReadiness and 377-378 lead | Mapping progress per entity, grouped by rollout wave. A wave is only ready when every entity in it has passed connection and mapping tests. | Replace with a single-company rollout/readiness view (this company's field-mapping and connection-test progress), or remove the report; drop 'entity' and 'wave' grouping. | 'Wave readiness' is a group rollout report tracking many companies being onboarded onto the central platform in waves — an inherently group/onboarding concept absent from a single-company deployment. |
| lines 462-466, closing teach | These figures are group-wide because the viewer is signed in as the central team. The same reports exist in each company’s own portal, filtered to that company alone — an entity administrator sees their own VAT summary and their own completeness figure, and none of the other ' + (GROUP.entities - 1) + ' companies. Five entities are detailed in this prototype; the live report lists every reporting entity. | Remove entirely, or replace with a single-company note: 'These reports cover this company's own documents. Each figure is drilldownable to the underlying invoices.' | Directly states the reports are group-wide, viewed by a central team, with per-company scoped copies for other tenants — the full central/multi-tenant model. |

### `alnasr-mock/hub/tenants.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 29, data-hint | Each company is a configuration record — its ERP, how we connect to it, which rollout wave it sits in, and how much of its mapping is done. Adding company 90 is a form, not a project. | This company's e-invoicing configuration — its ERP, how the system connects to it, and how much of its field mapping is done. | 'Adding company 90' is a direct leftover of the 89-company WJ Towell group and the tenant-add model. Al Nasr has ~3-4 companies each on its own deployment; there is no 90th tenant to add. |
| line 37-38, page-title / pill | <h1>Companies</h1>           <span class="pill pill-accent"><i class="dot"></i>4 legal entities</span> | Reframe as this company's own record/settings (single entity), or if branches are needed, 'Branches'. Remove the multi-entity count. | A 'Companies' list with a count of legal entities is a tenant directory. A single-company deployment does not list peer companies. |
| line 41, page-sub | Every company in the group, configured and monitored from this one console. | This company's e-invoicing configuration and monitoring. | Explicitly a single central console monitoring every company in the group — the multi-tenant central model. |
| line 45, onboard button | <a class="btn btn-sm btn-primary" href="onboard.html">Onboard a company</a> | Rename to 'Edit configuration' or 'Connection setup', pointing at the one-time deployment setup. | An 'Onboard a company' action implies repeatedly adding new companies to a central platform. A single-company deployment is set up once. |
| line 6, <title> | Companies — Al Nasr Compliance Hub | Settings — Al Nasr E-Invoicing | Title of a companies-directory screen inside a 'Compliance Hub'. A single-company install has no directory of companies. |

### `alnasr-mock/hub/users.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 172, role chip | (central ? 'Central team' : 'The company') | Label the elevated role 'Administrator' and others by their in-company role; drop the central-vs-company distinction. | Roles are split into a 'Central team' owner and 'The company' — the group/central role model. A single-company app has just internal roles (admin, finance, etc.). |
| lines 139-141, page-sub | GROUP.entities + ' companies in the group. Each one receives its own login and administers its own people. ' + 'A company sees only its own documents, users and exceptions.' | 'Your team administers its own people. Each user sees only the documents and exceptions their role allows.' | Explicitly states there are N 'companies in the group', each a tenant seeing only its own data — the core multi-tenant/group framing the single-company system does not have. |
| lines 291-294, closing teach | This same screen exists inside every company’s own portal, scoped to that company alone. The entity administrator at ' + ENT.short + ' does exactly this for their own colleagues, and sees no one from the other ' + (GROUP.entities - 1) + ' companies. | Remove the cross-company note; e.g. 'Your administrator adds and removes colleagues here. Each user sees only what their role permits.' | Explicitly describes per-tenant scoped copies of the screen across many companies and a group of N companies — pure multi-tenant/group framing. |

### `alnasr-mock/portal/dashboard.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 193/243/389 (same pattern in document.html:133, invoices.html:77, sync.html): tenant('ANM'), i.tenant === 'ANM', ROLES filter r.k !== 'group-admin' | const ME = tenant('ANM');  /  INVOICES.filter(i => i.tenant === 'ANM')  /  ROLES.filter(r => r.k !== 'group-admin') | Rename the data-model vocabulary in assets/js/data.js and its callers away from tenancy: e.g. company('ANM') instead of tenant('ANM'), drop or repurpose the per-row tenant field (single company), and remove the 'group-admin' role tier. Coordinated change across data.js and all five pages. | The underlying data model is multi-tenant: a tenant() lookup, a per-row 'tenant' field used to filter one company out of many, and a 'group-admin' role. This is the mechanical expression of the group/central model even though it is code, not visible copy. |

### `assets/css/app.css`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 3 (comment) | Three surfaces: hub (dark console), erp (light, foreign), | Three surfaces: console (dark), erp (light, foreign), — keep the CSS class token 'hub' as an internal id but drop 'hub' from all user-facing copy. | The 'hub' surface name frames the console as a central hub; note the .surface-hub / .bside.hub CSS class names it drives are referenced across every HTML page, so renaming the class is structural rather than a label swap. |

### `assets/js/data.js`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 102-137, const GROUP | const GROUP = {   name: 'Al Nasr Group',   entities: 4, | Replace with a single-company TOTALS object (today/MTD volume, failures, pending, inbound) for the one deploying company; drop entities/hubEntities/self-hosted split and the 'Al Nasr Group' name. | GROUP is an explicit group-wide roll-up (entities: 4, hubEntities, live/onboarding counts, group today/MTD totals) that feeds the group dashboard — aggregate counts spanning multiple companies that have no meaning for one company. |
| line 139-147, const WAVES | const WAVES = [   { n: 1, name: 'Wave 1', window: 'Live since Mar 2026', entities: 2, live: 2, state: 'complete', | Remove WAVES (and the 'wave' field on the company); a single deployment has one go-live date, not staged company waves. | Rollout WAVES describe onboarding multiple companies to a central platform in staged batches — a group rollout programme that does not exist when one company deploys its own system. |
| line 2-9 (header comment) | Al Nasr Compliance Hub — demonstration dataset     FOUR entities, and only the four the client named: | Al Nasr Tax Compliance — demonstration dataset (one company deployed on its own ERP). Reduce the modelled data to the single deploying company. | The dataset header establishes the whole 'Compliance Hub' with 'FOUR entities' model — the multi-company premise every screen inherits. A single-company deployment models one company only. |
| line 55-100, const TENANTS | const TENANTS = [ | Rename to COMPANY (single object) — or DIVISIONS if the one deployment legitimately covers a few divisions of the same legal entity — and remove cross-company deploy/wave fields. | The core data structure is a list of tenant companies ('TENANTS') with per-entity deploy/wave/health rows; the variable name and its four-company contents are the spine of the multi-tenant model. |
| line 566-585, REPORT_ROWS / REPORT_TYPES | { n: 'VAT summary by entity',        d: 'Net, VAT and zero-rated totals for a period, per legal entity.', tag: 'Finance' }, ... { n: 'Wave readiness', d: 'Mapping and connection progress against each OTA wave date.', tag: 'Programme' } | Report on the one company only: drop 'by entity' qualifiers ('VAT summary', 'Document type breakdown') and remove the 'Wave readiness' report; REPORT_ROWS becomes this company's figures, not a per-company table. | Reporting is built as per-entity aggregation across the four companies (REPORT_ROWS has one row per entity summing to GROUP totals) with report types 'by entity' and 'Wave readiness' — group-wide reporting that collapses to a single company. |
| line 632-640, const ACTIVITY | /* --- group activity feed ---------------------------------------------------- */ const ACTIVITY = [ ... tag: 'Al Nasr Marbles' } ... tag: 'Trading & Contracting' } ... tag: 'Energy Services' } | Make it the company's own activity feed and drop the per-company tag on each entry (every event already belongs to the one company). | The dashboard activity feed is explicitly a 'group activity feed' whose entries are tagged by which of the four companies they belong to — a cross-company stream. |

### `assets/js/shell.js`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 18, ACTS[1] | { n: 'II',  t: 'The group, and the companies in it',  d: 'Four legal entities, one console' } | { n: 'II', t: 'The company and its ERP connection', d: 'One company, one deployment on its own server' } — reframe the act away from a multi-entity console. | An entire act of the walkthrough is built around 'the group' and 'four legal entities, one console' — the multi-company console concept that does not exist in a single-company deployment. |
| line 22, ACTS[5] | { n: 'VI',  t: 'What each company gets',              d: 'Its own login, its own data, its own invoice' } | { n: 'VI', t: 'What the finance team gets', d: 'Its own login, its data, its invoice' } | 'What each company gets' and 'its own data' vs the others is tenant-isolation framing that only makes sense with multiple companies on one platform. |
| line 35-36, WALKTHROUGH hub-dashboard | name: 'The whole group on one screen',  blurb: 'Volumes, failures, and the companies that have gone quiet.' | name: 'The company on one screen', blurb: 'Today's volumes, failures, and anything that has stalled.' | The dashboard's whole purpose is described as the group-wide roll-up across companies ('the whole group', 'companies that have gone quiet') — a group aggregation screen that must be reframed to one company's own volumes and failures. |
| line 37-38, WALKTHROUGH hub-tenants | name: 'Every company in the group',     blurb: 'How each one connects, which wave it belongs to.' | name: 'The company and its connection', blurb: 'Which ERP it runs and how the system connects to it.' (the screen becomes a single company profile, not a directory) | This is the tenant directory — 'every company in the group' with per-company connection and rollout wave — an inherently group concept with no single-company equivalent. |
| line 70-73, WALKTHROUGH portal-login / portal-home | name: 'What that company sees',         blurb: 'Only its own data. The other three are invisible.' | name: 'What the finance team sees', blurb: 'Its own invoices, suppliers and reports.' | 'Only its own data. The other three are invisible.' is explicit multi-tenant data isolation — there are no 'other three' in a single-company deployment. |
| line 91, NAV.hub Configuration | { key: 'tenants',   name: 'Companies',          href: 'tenants.html',   ico: 'tenants', tag: '4' }, | { key: 'company', name: 'Company Profile', href: 'tenants.html', ico: 'tenants' } — drop the '4' count badge; the screen shows the single company and its connection. | A 'Companies' nav item with a count badge of '4' (and key/file 'tenants') is the multi-tenant directory; a single-company system has no list of companies to browse. |

### `assets/js/ui.js`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 160-166, tenantChip() | /* --- tenant chip ---------------------------------------------------------- */ function tenantChip(id) { | Rename to companyChip()/divisionChip() and, on single-company screens, drop the per-company column entirely since every row is the same company. | A dedicated tenantChip() helper (and the tenant() lookup it calls) exists only to badge which of several tenant companies a row belongs to; the multi-tenant column it renders disappears when every row belongs to the one deployed company. |

## 🟡 Context-dependent — reword in context  (98)


### `alnasr-mock/ALNASR-REAL-ENTITIES.md`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 55 | one entity out of `TENANTS`, and the group totals recomputed as described below. | one entity out of `COMPANIES`, and the company totals recomputed (retire the TENANTS name and group-total rollups). | Core data structure is named `TENANTS` and figures roll up to 'group totals' — the central-aggregation data model. |
| lines 47-48 | four participants, four entities, and the   multi-entity console is exactly the right pitch. | Note that even if divisions hold separate registrations, each still runs its own standalone instance — there is no multi-entity console. | States the pitch as a 'multi-entity console' aggregating four participants — the central multi-tenant model. |
| lines 51-52 | `vatUnconfirmed: true` on the tenant records drives that notice. | `vatUnconfirmed: true` on the company/entity records drives that notice (rename the TENANTS structure to ENTITIES/COMPANIES). | Uses 'tenant records' — the data model is literally structured as tenants, the multi-tenant framing the README elsewhere bans in user-facing text but keeps in the schema. |

### `alnasr-mock/PRESENTER-SCRIPT.md`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 311, Screen 14 | “Now I will stop being the group team. I will sign in as one company.” | “Now I will sign in as a finance user in the company's own portal.” | Switching roles from 'group team' to 'one company' dramatizes the central-operator-vs-tenant separation that does not exist in a single-company install. |
| line 85, Screen 2 | “This is the central platform. The group team signs in here.” | “This is the compliance console. Your compliance team signs in here.” | Spoken line establishes a 'central platform' operated by a 'group team' — the multi-tenant operator model. |
| lines 285-286, Screen 12 | the compliance data is in one place, for all > all four companies, and it can be exported. | the compliance data is in one place for the company, and it can be exported. | Reporting consolidates 'all four companies' into one place — central group reporting across tenants. |
| lines 296-303, Screen 13 | the central team never holds a company’s password ... The central team sends one invitation ... The central team can configure the platform. It cannot post anything into any ERP. | Reframe to the company's own administrator: “Your administrator invites users; each person sets their own password and second factor. The administrator configures the system but cannot post into the ERP.” | The 'central team' vs. 'each company' split is the multi-tenant operator/tenant model. In a standalone deployment the company administers its own users directly. |
| lines 328-329, Screen 15 | “They cannot see the other eighty-eight companies. Not the volumes, not the names, not the failures. Each company sees only itself.” | “There is no other company's data in this system — this instance holds only Al Nasr Marbles.” (Delete the 'eighty-eight companies' claim entirely.) | LEFTOVER BUG from the 89-company WJ Towell group — Al Nasr has only 3-4 companies, and in a standalone deployment there are no 'other companies' at all. Both the number and the whole tenant-isolation pitch are wrong. |
| lines 375-376, Closing | “Two. The compliance work is solved once, centrally, for all four companies — > not four times.” | “Two. The compliance work is solved once inside the company's own system — no bolt-on, no separate platform.” | The closing value proposition is explicit central/group consolidation ('solved once, centrally, for all four companies'). This is the opposite of the per-company standalone model. |
| lines 405-407, Questions | **“Can the central team see or change our accounting data?”** ... “The central team can configure the platform. It cannot post anything into any ERP. | “Can the system change our accounting data?” — “It runs on your own ERP and configures compliance; it does not post into your ledgers. Posting stays with your finance users.” | Q&A assumes a 'central team' external to the company — the multi-tenant operator. In a self-hosted single-company install there is no central team seeing the company's data. |

### `alnasr-mock/README.md`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 146 | holds an illustrative dataset for the **Al Nasr Group** — the **four entities | holds an illustrative dataset for **Al Nasr Marbles** — the single company this instance is deployed for | The dataset is described as a group of four entities feeding one console — the multi-tenant data model. |
| line 159 | sum exactly to every group total on the dashboard | sum exactly to every total on the company's dashboard | 'Group total on the dashboard' is an aggregate spanning multiple companies — a group-wide dashboard metric. |
| line 36, steps table row 2 | Hub — Sign in \| The group platform team logs in | Sign in \| The company's compliance team logs in | A 'group platform team' logging into a shared 'Hub' is the central-operator role of a multi-tenant platform. A single-company install has just the company's own compliance users. |
| line 44, steps table row 8 | How each of the four gets its own login, and who administers it | How the company's users get their logins, and who administers them | Describes provisioning logins for four separate companies from one platform — central tenant administration. |
| line 54, steps table row 15 | It sees only its own data; the other three are invisible | It shows only this company's own data — there is no other company's data in the system | Tenant-isolation framing ('the other three are invisible') presumes multiple tenants in one system. A standalone install contains only that company's data. |
| lines 109-110 | The platform is the "Al Nasr Compliance Hub". The proposal says "the hub" or "the central compliance hub" throughout. | The platform is 'Al Nasr E-Invoicing'. Refer to it as the compliance system running on the company's own ERP — not a central hub. | An explicit instruction to name the system a central hub everywhere — the core wording that must change for a single-company product. |
| lines 2-3 | A navigable prototype of the central compliance hub described in | A navigable prototype of the e-invoicing compliance system described in | Describes the whole prototype as a 'central compliance hub' — the exact centralized/group model Al Nasr is not adopting. |
| lines 63-65, surfaces table | **Hub** \| Basalt green `#26443F` + sand gold `#DCA84E` \| 2–15 \| *The platform we are building* | **Console** \| Basalt green ... \| 2–15 \| *The compliance software on the company's ERP* | The middle surface is branded 'Hub' / 'the platform' across screens 2-15, the central-console identity. |

### `alnasr-mock/erp/invoices.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 64, card-foot CTA | Follow this invoice into the Hub → | Follow this invoice into the e-invoicing system → | "the Hub" names the central Compliance Hub as a separate destination the invoice travels into — the central-server model. In this deployment the e-invoicing system is part of the company's own stack, not a hub the data leaves for. |

### `alnasr-mock/erp/sync.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 104-106, scope-lead | The Compliance Hub makes every field shown below available to the ERP. Reading them from the Hub, and creating or updating any record inside the ERP, is work that belongs to Al Nasr's ERP team or their ERP vendor — not to us. | The e-invoicing system makes every field shown below available to the ERP. Reading them from the e-invoicing system, and creating or updating any record inside the ERP, is work that belongs to Al Nasr's ERP team or their ERP vendor — not to us. | 'Compliance Hub' / 'the Hub' is the central-server product name; it frames the compliance system as a distinct central place data is read from. |
| line 224-225, closing-list item 3 | The Hub transmitted it to the group's accredited service provider, which reported it to the Oman Tax Authority and delivered it to the buyer. | The e-invoicing system transmitted it to the accredited service provider, which reported it to the Oman Tax Authority and delivered it to the buyer. | Combines 'The Hub' (central server) with 'the group's accredited service provider' (group-owned provider). Both imply a shared group-central arrangement. |
| line 283-286, journeyFoot | Steps 2 to ' + (J.length - 1) + ' are performed by the Compliance Hub and the group’s service provider, with no user action here. | Steps 2 to ' + (J.length - 1) + ' are performed by the e-invoicing system and the accredited service provider, with no user action here. | 'the Compliance Hub' plus 'the group's service provider' names both the central hub product and a group-owned provider. |
| line 296-304, banner notice | The Hub sent this invoice to the group's accredited service provider, which accepted it at ... The service provider — not the Hub — reported the Tax Data Document to the Oman Tax Authority | The e-invoicing system sent this invoice to the accredited service provider, which accepted it at ... The service provider — not the e-invoicing system — reported the Tax Data Document to the Oman Tax Authority | Multiple 'the Hub' references plus 'the group's accredited service provider' — the central-hub-to-group-provider data flow narrative. |

### `alnasr-mock/hub/boundary.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| lines 29 & 31, body attributes | data-nav="tenants" ... data-crumbs="Group / The delivery boundary" | data-nav to a single-company section (e.g. "model" or "setup"), and breadcrumb root "Operating model / The delivery boundary". | Nav slot is "tenants" and the breadcrumb root is "Group" — both are multi-tenant/group navigation concepts. |
| lines 95 & 101, boundary sides | 'Each entity provides' ... 'The Hub team delivers' | 'Al Nasr provides' (upstream) and 'The delivery team delivers' (downstream). Underlying BOUNDARY_ENTITY/BOUNDARY_HUB copy should follow. | "Each entity" (a group of entities) hands off to "The Hub team" (a central delivery team). |

### `alnasr-mock/hub/dashboard.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 134, card-foot | The entity corrects the record in its own ERP and reprocesses. The Hub cannot invent missing business data. | The finance team corrects the record in the ERP and reprocesses. The system cannot invent missing business data. | 'The entity' / 'The Hub' framing casts the company as one tenant of a central hub. In a single-company deploy the finance team and the system are the same company. |
| line 145, card-foot | No entity action. Handled centrally, once, for every company at the same time. | No finance-team action. Handled by IT on this deployment. | Explicitly describes central handling applied to every company simultaneously — the core multi-tenant/central-hub value proposition that does not apply to a single-company install. |
| line 174-175, sub text | Figures cover the ${GROUP.hubEntities} entities connected to the Hub. | Figures cover this company's e-invoicing for the period. | Subtitle states figures aggregate multiple entities connected to the Hub. Single-company deployment shows only its own figures. |
| line 193, PERIODS.today.note | documents from Hub entities, plus ${num(GROUP.selfHostedToday)} reported separately by the ${GROUP.selfHosted} self-hosted entities. | documents processed today by this company's e-invoicing system. | Splits totals into hub entities vs self-hosted entities — a multi-tenant distinction absent in a single-company install. |
| line 226-229, Export note | `<b>Export prepared</b> — group summary, ${sel.options[sel.selectedIndex].text.toLowerCase()}, ${num(GROUP.entities)} legal entities. In the live platform this downloads as a spreadsheet. | `<b>Export prepared</b> — company summary, ${period}. In the live system this downloads as a spreadsheet.` | Export is described as a 'group summary' covering multiple legal entities. |
| line 268-270, coFoot | `${HUB_CO.length} of ${GROUP.hubEntities} Hub entities shown · ` + `${GROUP.hubEntities - HUB_CO.length} more · ${GROUP.silentEntities} silent today` | Reword to describe this company's connection only, e.g. 'ERP connection healthy · last document 2 min ago'. | 'Hub entities shown' counts multiple companies attached to a hub. |
| line 315-317, teach() note | The ${GROUP.hubEntities} / ${GROUP.selfHosted} split is indicative. It is confirmed by the       entity governance classification, not assumed here | Remove, or restate as a single note that this company's system transmits directly to the ASP. | Frames a hub/self-hosted split across entities governed centrally — not applicable to one deployment. |

### `alnasr-mock/hub/history.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 128-132, MTD figures 'computed from GROUP' | const MTD_TOTAL   = GROUP.mtdTotal; | Source the tiles from this company's own month-to-date document totals rather than a group aggregate. | The month-to-date tiles are sourced from GROUP totals, i.e. summed across all companies in the group. A single-company install should show only this company's month-to-date figures. |
| line 138, stat meta | Outbound and inbound, across the hub entities | Outbound and inbound documents this month | 'across the hub entities' aggregates a count over multiple companies feeding one hub — a group concept. A single-company deployment counts only its own documents. |

### `alnasr-mock/hub/inbound.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 199, 'Received today' tile meta | Across the companies connected to the Hub | Received into the Al Nasr ERP today (or drop the meta). | Aggregates receipts across multiple companies connected to a central Hub. |
| line 291 & 341-342 & 354, drill-down copy | That stored copy is the record the group would produce in an audit. | That stored copy is the record Al Nasr would produce in an audit. (and "routed to Al Nasr's ERP"). | "the group" as the audited party; also "routed to that company and to no other" (line 342) presumes routing among companies. |
| lines 203-207, tile metas | Waiting for a person in the receiving company. None posted automatically. | Waiting for a person in accounts payable. None posted automatically. (and "central technical team" -> "technical team") | "the receiving company" (also "central technical team" on line 207) presumes routing among several receiving companies. |
| lines 217-223, second rule notice | The Hub creates a draft purchase invoice in the receiving company's ERP and stops there. | The system creates a draft purchase invoice in the ERP and stops there. Nothing is ever posted automatically. A person reviews it against the purchase order and the goods received, and posts it themselves. | "The Hub" and "the receiving company's ERP" cast the system as a central hub writing into whichever tenant's ERP it routed to. |
| lines 293-297, failBody 'Why' | Either the identifier was never registered for that entity, or the supplier addressed it to an identifier the group does not use. | Either the identifier was never registered for Al Nasr, or the supplier addressed it to an identifier Al Nasr does not use. | "that entity" and "an identifier the group does not use" frame the problem across a group of entities. |
| lines 300-306, failBody kv | ['Matched entity', '<span style="color:var(--fail)">none of 4</span>'] | ['Matched Al Nasr identifier', 'No'] | "none of 4" counts matching against four tenant entities — an explicit group count. |
| lines 320-327, ownership right side | that exception would appear in that company's own portal and only theirs. It is business data, so the people who own the business data resolve it. The central team never edits an entity's master data on its behalf. | that exception would appear here for the finance team. It is business data, so the people who own the business data resolve it. The technical team never edits finance master data on its behalf. | "that company's own portal and only theirs" and "an entity's master data" describe per-tenant portals and a central team acting across entities. |
| lines 76 & 87, data-hint and page-sub | Supplier invoices arriving from the Peppol network, routed to the right company. | Supplier invoices arriving from the Peppol network, landed as drafts in the ERP. | "routed to the right company" implies inbound documents are sorted among several tenant companies at a central point; a single-company deployment receives only its own invoices. |

### `alnasr-mock/hub/login.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 40, auth-point | Every entity reported through one accredited service provider. | 'Your invoices reported through an accredited service provider.' | 'Every entity ... one accredited service provider' frames many companies consolidated onto one shared provider — the group model. |
| lines 44-46, auth-point | One compliance foundation serving every entity's ERP. How each entity connects is chosen per entity, after the ERP inventory. | 'Deployed on your own ERP server. How it connects is chosen after your ERP inventory.' | 'One compliance foundation serving every entity's ERP' describes a central foundation multiple companies' ERPs connect into. Al Nasr instead deploys the app separately on each company's own ERP server. |

### `alnasr-mock/hub/mapping.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 80, data-hint | This is configuration an analyst does once per company — not code. | This is configuration an analyst does once, when connecting the ERP — not code. | "once per company" frames mapping as a repeated onboarding step across many tenant companies. |

### `alnasr-mock/hub/onboard.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 155-157, sub text | '. No new installation: this company is brought on through connection, mapping and configuration.' | '. Setup is connection, mapping and configuration against this company's ERP.' | 'this company is brought on' is tenant-onboarding language for adding a company to a central platform. |

### `alnasr-mock/hub/queue.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 184, 'In flight' tile meta | Across ${GROUP.live} live companies | Across all document types (or simply drop the meta line). | Aggregates the in-flight count across multiple live companies — a group-wide rollup that doesn't exist in a single-company deployment. |
| line 193, #fCompany default option | All hub companies (${GROUP.hubEntities}) | All documents | "All hub companies" is an explicit multi-tenant list of companies connected to the Hub. |
| line 30, data-hint | Every document currently being processed, and the stage it has reached. Each company has its own lane, so one company's problem never holds up another. | Every document currently being processed, and the stage it has reached. | "Each company has its own lane" frames the queue as a multi-company/group view where several companies are isolated from each other; a single-company deployment only processes its own documents. |
| line 319, channels divider row | ${CH[0].short} holds ${pct(CH[0].pending / inQueue * 100)} of everything in flight | Replace with a per-stage breakdown of the single company's in-flight documents. | Ranks companies by share of the in-flight total — a cross-company comparison. |
| line 320, channels footer | 0 other companies blocked | Remove this status, or replace with a single-company health indicator (e.g. "No stages blocked"). | "other companies" asserts a multi-company environment. |
| lines 124 & 300-302, chanFoot | Each company has its own lane, so a backlog in one never delays another. | Remove, or reword to describe throughput of the single queue (e.g. "The deepest stages, holding N of the M documents in flight"). | Restates the per-company isolation model; irrelevant to a single company. |

### `alnasr-mock/hub/reports.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 255, exception ageing column | { t: 'Share of group failures', r: true } | Drop the group-share column; keep open failures and failure rate for this company. | 'Share of group failures' apportions failures across companies in the group. |
| line 349, exception ageing lead | Open failures by entity, and each entity’s share of the group total. | 'Open failures for this company, banded by age, each with a named owner.' | Reports failures 'by entity' and each entity's 'share of the group total' — multi-company aggregation. |
| lines 315-317, VAT summary lead | Net, VAT and zero-rated totals per legal entity, taken from the archived documents rather than from any one ERP. | 'Net, VAT and zero-rated totals for this company, taken from the archived documents rather than the live ERP.' | 'per legal entity' and 'rather than from any one ERP' frame a hub summarising many entities/ERPs. The single-company app has one entity and one ERP. |
| lines 339-342, completeness foot notice | business-data problems sit with the entity finance team, platform and connector problems with the central team. | 'business-data problems sit with your finance team, platform and connector problems with your IT/administrator.' | Splits ownership between an 'entity finance team' and a 'central team' — the central/group support model. |
| lines 358-360, document type lead | Value composition per entity, showing how much of each entity’s net turnover is zero-rated. | 'Value composition for this company, showing how much of net turnover is zero-rated.' | 'per entity' / 'each entity's net turnover' — per-company breakdown across the group. |
| lines 368-369, inbound report lead | Supplier documents received today, per entity, with the routing state and how that entity is connected. | 'Supplier documents received today, with the routing state and how this company is connected.' | 'per entity' and 'how that entity is connected' assume many companies each with their own connection into the hub. |
| lines 449-450, export note | PERIODS[periodKey].label + ', ' + REPORT_ROWS.length + ' entities. ' + 'In the live platform this downloads, or is delivered on a schedule to a named group of recipients.' | '... prepared for {period}. In the live system this downloads, or is emailed on a schedule to named recipients.' (drop the entities count) | Export is described as covering 'N entities' from a 'live platform' — multi-company aggregation on a central platform. |

### `alnasr-mock/hub/tenant-detail.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 120, boundary card <h2> | Where this company's work ends and ours begins | Where source data ends and the e-invoicing system takes over | 'ours' = the central hub team, contrasted against the tenant company — a delivery boundary between a customer company and a central platform operator. In a single-company deploy the system belongs to the company. |
| line 280-283, boundaryNote | Everything after that interface is delivered by the central Hub team, identically for all ${GROUP.hubEntities} connected entities. | Everything after that interface is handled by the e-invoicing system for this company. | 'central Hub team' delivering identically for all connected entities is the multi-tenant central-operations proposition. |

### `alnasr-mock/hub/tenants.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 113, card-foot | One delayed entity does not hold up the group. Each wave cuts over on its own date. | This company cuts over on its own go-live date. | Rollout-wave-across-a-group narrative; a single company has one cutover, not a group of staggered entities. |
| line 186, self-hosted row note | Same software, same rules. It transmits directly to the ASP and never connects to the Hub. | Remove the hub/self-hosted distinction; the system transmits directly to the ASP. | Distinguishes a self-hosted company that bypasses the Hub — meaningful only in the central model. Every Al Nasr install is already self-hosted on its own ERP. |
| line 220-222, tableFoot | `${wname.name} — ${wname.entities} entities in the group, ${wname.live} live. ${wname.note}` | Drop the group entity counts; describe this company's rollout status only. | Counts entities in the group per rollout wave — a group rollout tracker. |
| line 224-234, VAT note comment + text | this console has ${GROUP.entities - UNCONFIRMED.length + 1} entities rather than ${GROUP.entities}. | If Marbles and Terrazzo share one VAT registration they are one Peppol participant; state that at the single-company level rather than as a console entity count. | The note reasons about how many entities the console lists — a tenant-count concern that presupposes a multi-company console. |
| line 283, self-hosted governance note | Qualifies only where a documented legal, contractual or governance restriction prevents centralising           invoice data. | Remove; invoice data stays within this company's environment by design. | 'centralising invoice data' assumes a default of pulling every company's invoices into a central hub, with self-hosting as the exception. Al Nasr never centralises data. |
| line 292-296, methodNote teach() | All ${GROUP.hubEntities} connect through the Hub today; the self-hosted exception exists but <b>no entity has been assigned to it</b>. | Remove hub/self-hosted framing; this company's system connects directly to its own ERP and the ASP. | States all entities connect through the Hub — the central aggregation model. |
| line 298-301, methodMath | `${GROUP.m1} + ${GROUP.m2} + ${GROUP.m3} + ${GROUP.pendingAssessment} = ` + `${...} entities connect through the Hub · ` + `+ ${GROUP.selfHosted} self-hosted = ${GROUP.entities} legal entities` | Remove the cross-entity arithmetic; a single deployment has one connection method. | Arithmetic tallying entities that 'connect through the Hub' plus self-hosted to reach a total legal-entity count — a pure multi-tenant hub summary. |

### `alnasr-mock/hub/users.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 102, provisioning section heading | How a company gets its login | How a user gets a login | Describes onboarding a whole company onto a central platform. In a single-company install the flow is onboarding a person, not a company. |
| line 235 and role key 'group-admin' | return r.k !== 'group-admin'; | Rename the role key/label to 'admin' or 'administrator'. | The elevated role is keyed/named 'group-admin', embedding the group concept into the role model. |
| line 41, data-hint | How each of the four companies is given its own login — and why the central team never sets or sees a password. | How each user is given a login — and why the administrator never sets or sees a password. | Frames access as provisioning 'four companies' from a 'central team' — the group/central onboarding model. A single-company deployment provisions individual users, and there is no central team. |
| lines 160-164, seq-teach notice | The central team never sets or sees a password. | 'The administrator never sets or sees a password.' (and reframe the 'ours vs the company' step split as administrator vs. end user) | The whole provisioning explanation is built around a 'central team' issuing invitations to separate companies — a central/group operating model. There is no central team in a per-company deployment. |
| lines 178-180, group-admin exp row | The central team can configure anything on this platform. It cannot post to any ERP. Posting stays with the company’s own finance users, in their own system. | 'The administrator can configure anything in this system. It cannot post to the ERP. Posting stays with your finance users, in the ERP itself.' | Describes a central team operating a shared platform above the company's ERP — the central/group hosting model. |
| lines 185-187, roles-note teach | Three of these four roles are held by people inside the company. Only the group administrator is ours, and its reach stops at configuration. | 'All four roles are held by people inside your organisation. The administrator role is the most powerful, and its reach stops at configuration.' | 'the group administrator is ours' frames an external group operator with a group-admin role. The single-company system's admin is internal. |

### `alnasr-mock/index.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 102, hero <h1> | Four companies.<br>One way to <em>comply</em>. | One company.<br>One way to <em>comply</em>. | The headline pitches a group-wide, four-company solution. Each Al Nasr deployment serves exactly one company, so a four-company framing implies a central group platform. |
| line 107, lede | Every company sees only itself. | Your data stays inside your own system. | Asserts tenant isolation across many companies — a multi-tenant central-platform selling point. A single-company install has no other tenants to be isolated from. |
| line 6, <title> | Al Nasr Compliance Hub · guided walkthrough | Al Nasr E-Invoicing · guided walkthrough | The product is named as a central 'Compliance Hub' — the WJ-Towell central-platform concept. Al Nasr runs no central hub; the app is deployed standalone per company. |

### `alnasr-mock/portal/dashboard.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 196-197, code comment | The one number this screen must agree with: the group dashboard shows Al Nasr Marbles with ME.failed failures. | The one number this screen must agree with: the ERP e-invoice status screen shows Al Nasr Marbles with ME.failed failures. | References a 'group dashboard' screen that aggregates multiple companies — a screen whose whole purpose is a group roll-up that does not exist in a single-company deployment. |
| line 426, repNote handler | The central team runs the same report across the group; you only ever get your own rows. | This report covers this company's own documents. | Directly states a central team runs reports across the group and this screen is a per-tenant slice — the core group/central framing this deployment must not have. |
| line 45, body data-hint | The same platform, seen by one company. Al Nasr Marbles sees only its own invoices — the other three companies are invisible to this user. | Al Nasr Marbles' own e-invoicing system. A standalone deployment on this company's ERP — it holds only this company's invoices. | Explicitly describes a shared multi-tenant platform where each of several companies sees only its slice. In the single-company deployment there are no other companies in the system at all, so the whole 'one-of-many' framing is wrong. |

### `alnasr-mock/portal/document.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 32, body data-hint | there is no route from this page to any other company's data. | everything here belongs to this company's own e-invoicing records. | Reassuring the reader they can't reach 'any other company's data' only makes sense if other companies live in the same system; in a standalone deployment no other company exists there. |

### `assets/js/data.js`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 205-215, IN_STAGES / IN_STAGE_NOTE | const IN_STAGES = ['Supplier sends', 'Route to entity', 'Validate', ... 'Match participant ID to the legal entity', | Replace 'Route to entity' with 'Identify recipient' and the note with 'Confirm the document is addressed to this company's participant ID.' | The inbound pipeline has a 'Route to entity' stage that 'Match[es] participant ID to the legal entity' — routing an incoming document to one of several companies, which is unnecessary when there is only one company/participant ID. |
| line 218-219, LEGS comment + leg label | This is why the Hub cannot rely on one synchronous response. ... leg: 'Service provider → Hub', | '...the system cannot rely on one synchronous response.' and leg: 'Service provider → the system'. | Acknowledgement legs name 'Hub' as the endpoint that receives responses. |
| line 314-318, INBOUND unrouted item err | err: 'Participant 0248:OM1100777001 does not match any registered entity in the group.' | err: 'Participant 0248:OM1100777001 does not match this company's registered participant ID.' | The routing-failure message compares the participant ID against 'any registered entity in the group' — the group/multi-tenant routing table. |
| line 46 and 49, METHODS.how | how: 'The Hub calls the ERP standard API.' ... connects outward to the Hub and carries work in both directions. | how: 'The system calls the ERP standard API.' / 'A lightweight agent connects the ERP to the system...' — replace 'the Hub' with 'the system' throughout METHODS. | Connection method descriptions repeatedly say 'the Hub' as the destination the ERP connects to, implying a remote central server. |
| line 511-523, const LOGS | { ts: '10:22:28.114', lv: 'info', txt: 'Poll tick — entity ANT, watermark 2026-07-28T10:21:44Z' }, ... 'State → READY_FOR_ASP · queued on entity channel ANT' | Drop the entity qualifier: 'Poll tick — watermark ...' and 'queued for transmission'; there is a single processing channel for the one company. | Processing logs are keyed by 'entity ANT' and an 'entity channel' — the per-tenant polling/queue partitioning of a multi-company processor. |
| line 592, ROLES group-admin | { k: 'group-admin',  n: 'Group administrator',  d: 'Central team. All entities, all configuration. Cannot post to any ERP.' } | { k: 'admin', n: 'System administrator', d: 'The company's own admin. All configuration. Cannot post to the ERP.' } and rename 'entity-admin' to 'Administrator'. | A 'Group administrator' role owned by the 'Central team' with rights over 'all entities' is the central multi-tenant super-admin. |
| line 603-615, ACCESS_STEPS | { n: 1, name: 'Entity confirmed live',   who: 'Central team', ... 'No password is ever set or shared by the central team.' ... 'The central team is not in the loop.' } | Replace 'Central team' with 'The IT administrator' and 'the entity' with 'the finance team'; the flow is one company's admin issuing its own users. | The access-provisioning sequence is narrated as a 'Central team' issuing access to 'the entity' repeatedly — a central operator granting logins to separate tenant companies. |
| line 652-662, const EXCEPTIONS_PLATFORM | { title: 'ASP timeout on transmission', count: 3, who: 'Central technical team', ... 'A supplier sent to a participant ID that matches no entity in the group.' ... 'Central team is checking the connection.' } | Assign to 'IT / technical team' and reword the routing exception to 'a supplier sent to a participant ID that is not this company's'. | Platform-owned exceptions are assigned to a 'Central technical team' and reference routing failures across 'entit[ies] in the group' — central operations serving multiple tenants. |
| line 664-682, SYNC_STEPS (steps 2-3) | { name: 'Collected by the Hub', ... body: 'Method 1 — Direct API. The Hub called the ERP sales invoice service. ...' } | 'Collected by the system' / 'The system read the ERP sales invoice service...'; since the app runs on the company's own ERP server, avoid implying data leaves to an external hub. | The final ERP-status walkthrough narrates the invoice being 'Collected by the Hub' / 'The Hub called the ERP' — reinforcing a remote central hub pulling data out of the company's ERP. |
| line 693-699, const BOUNDARY_HUB | 'Dashboard, monitoring and central technical operations' | 'Dashboard, monitoring and technical operations' — and consider renaming BOUNDARY_HUB to BOUNDARY_SYSTEM. | The delivery-boundary list (BOUNDARY_HUB is itself hub-named) credits 'central technical operations' to the platform side. |

### `assets/js/shell.js`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 124, BRAND.hub | hub:    { mark: 'N', name: 'Al Nasr',          sub: 'Compliance Hub',       who: 'AN', whoName: 'Group IT',      whoRole: 'Platform administrator' }, | hub: { mark: 'N', name: 'Al Nasr', sub: 'Tax Compliance', who: 'AN', whoName: 'IT Administrator', whoRole: 'System administrator' }, | The console brand sub-label is 'Compliance Hub' and the signed-in operator is 'Group IT / Platform administrator' — central-hub and group framing shown on every hub screen. |
| line 129, ENV map | const ENV = { hub: 'Compliance Hub', erp: 'Their ERP', portal: 'One company' }; | const ENV = { hub: 'Compliance', erp: 'ERP', portal: 'Finance' }; | The environment badge shown in the topbar reads 'Compliance Hub' and 'One company' (implying others exist). |
| line 19, ACTS[2] | { n: 'III', t: 'Bringing a company on',               d: 'Configuration, not a new installation' } | { n: 'III', t: 'Connecting the ERP', d: 'One-time configuration on this company's server' } | 'Bringing a company on' frames the act as onboarding one of several tenants onto a shared platform. |
| line 39-40, WALKTHROUGH hub-tenant | name: 'One company in detail',          blurb: 'Its ERP, its connection, what it supplied and what we run.' | name: 'The company in detail', blurb: 'Its ERP, its connection, what it supplied and what the system runs.' | 'One company in detail' presents the company as one selected tenant out of many; in a single-company system this is simply the company/connection page. |
| line 43-44, WALKTHROUGH hub-onboard | name: 'Connecting a new company',       blurb: 'Choose how to connect, enter the details, test it live.' | name: 'Connecting the ERP', blurb: 'Choose how to connect, enter the details, test it live.' | 'Connecting a new company' is the onboarding-a-tenant flow; single-company deployment connects one ERP once, not successive companies. |
| line 68-69, WALKTHROUGH hub-users | name: 'Giving the company its own login', blurb: 'How each of the four gets access, and who administers it.' | name: 'Giving the finance team access', blurb: 'How users get access, and who administers it.' | 'each of the four gets access' counts four companies being provisioned on a central platform. |
| line 92, NAV.hub Configuration | { key: 'onboard',   name: 'Onboard a Company',  href: 'onboard.html',   ico: 'plus' }, | { key: 'onboard', name: 'Connection Setup', href: 'onboard.html', ico: 'plus' }, | 'Onboard a Company' is the add-a-tenant action of a central platform. |

## 🟢 Trivial — direct label swap  (77)


### `alnasr-mock/PRESENTER-SCRIPT.md`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| lines 47-48, Opening | “The company names are real, so that you recognise your own group. | “The company names are real, so you recognise your own operations.” | Appeals to the audience recognising 'your own group' — presumes a group audience for a shared platform. |

### `alnasr-mock/README.md`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 5 | adapted for **Al Nasr Group of Companies**. | adapted for **Al Nasr**, deployed on each company's own ERP. | Frames the deployment as serving the whole 'Group of Companies' collectively, implying one shared central instance. |

### `alnasr-mock/erp/sync.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 111-112, scope-list item 1 | What we deliver ends at the Hub's interface. | What we deliver ends at the e-invoicing system's interface. | 'the Hub's interface' references the central hub as the delivery boundary. |
| line 114-115, scope-list item 2 | They call the Hub, take the reference, the status and the QR information, and perform the insert or update on their own system | They call the e-invoicing system, take the reference, the status and the QR information, and perform the insert or update on their own system | 'call the Hub' frames the compliance system as an external central hub the ERP reaches out to. |
| line 116-117, scope-list item 3 | When the Hub passes a supplier invoice to the ERP, the ERP team must create it as an unposted draft | When the e-invoicing system passes a supplier invoice to the ERP, the ERP team must create it as an unposted draft | 'the Hub' names the central hub as the source that hands inbound documents to the ERP. |
| line 144, card-head h2 | E-Invoicing fields collected from the Hub | E-Invoicing fields collected from the e-invoicing system | 'from the Hub' frames the fields as pulled from a central hub. |
| line 226-229, closing-list item 4 | are ready to be collected from the Hub, so they can be shown on the original record | are ready to be collected from the e-invoicing system, so they can be shown on the original record | 'collected from the Hub' frames retrieval from a central hub. |
| line 232-233, closing red note | Our delivery ends where the Hub publishes the data. | Our delivery ends where the e-invoicing system publishes the data. | 'the Hub publishes the data' frames a central hub as the publishing point. |
| line 289-290, code comment above banner | The Hub transmits to the ASP. ... The Hub never talks to the Tax Authority itself. | The e-invoicing system transmits to the ASP. ... The e-invoicing system never talks to the Tax Authority itself. | Developer-facing comment still narrates the central Hub as the transmitting actor. |
| line 84, page-actions button | View in Hub | View in e-invoicing system | 'Hub' labels the central Compliance Hub as a separate place to view the record. |

### `alnasr-mock/hub/asp.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 6, <title> | ASP Exchange — Al Nasr Compliance Hub | ASP Exchange — Al Nasr E-Invoicing | Central Compliance Hub product name. |
| lines 124-125, 137-138, 152 & 195, 'the Hub' as actor | from the moment it left the Hub. ... The Hub holds a state for each leg on every document ... The Hub records each remaining leg when it lands ... The provider, not the Hub, reports the Tax Data Document to the OTA — the Hub has no direct channel to the tax authority. | Replace each "the Hub" with "the system" (e.g. "from the moment it left the system", "The system holds a state for each leg", "The provider, not the system, reports the Tax Data Document to the OTA"). | "the Hub" is used repeatedly as the name of the system on this screen; it reads as the central hub rather than the company's own deployed compliance app. |

### `alnasr-mock/hub/boundary.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 6, <title> | The delivery boundary — Al Nasr Compliance Hub | The delivery boundary — Al Nasr E-Invoicing | Central Compliance Hub product name. |

### `alnasr-mock/hub/dashboard.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 139, ownertag plat | Central technical team | IT / technical team | 'Central technical team' implies a shared central operations team serving many companies from a hub. |
| line 186, statePill ok branch | 'All companies reporting' | 'Reporting normally' | 'All companies reporting' is an across-companies aggregate. There is only one company here. |
| line 39, data-crumbs | Operations / Group Dashboard | Operations / Dashboard | Breadcrumb labels the landing screen 'Group Dashboard', implying an aggregate view across many companies. |
| line 6, <title> | Group Dashboard — Al Nasr Compliance Hub | Dashboard — Al Nasr E-Invoicing | Browser/tab title frames the screen as a group-wide dashboard inside a central 'Compliance Hub'. Al Nasr is a single company deployed on its own ERP; there is no group and no central hub. |

### `alnasr-mock/hub/document.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 15, data-hint | The Hub turns the invoice into the official format, then checks it against every government rule. Nothing is sent until it passes. | The system turns the invoice into the official format, then checks it against every government rule. Nothing is sent until it passes. | 'The Hub' names the central hub as the actor. |
| line 27, page-sub | Al Nasr Marbles LLC · 26,040.000 OMR — built and proved correct inside the Hub. | Al Nasr Marbles LLC · 26,040.000 OMR — built and proved correct inside the system. | 'inside the Hub' places the processing in a central hub. |
| line 51, card heading | The official document the Hub built | The official document the system built | 'the Hub built' attributes the document to the central hub. |
| line 6, <title> | Document Inspector — Al Nasr Compliance Hub | Document Inspector — Al Nasr e-Invoicing | 'Compliance Hub' branding. |

### `alnasr-mock/hub/history.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 142, stat meta | Each one is visible to the entity that owns it | Each one is shown here for review and correction | 'the entity that owns it' implies per-tenant ownership/scoping within a multi-tenant hub. In a single-company app every document belongs to the one company. |
| line 188, archive notice | applicable Omani requirements and the group’s audit needs. | applicable Omani requirements and the company’s audit needs. | 'the group's audit needs' presumes an 89-/multi-company group audit. The single-company system serves one company's audit needs. |
| line 36, data-hint | Every document the Hub has handled this month, in both directions, with the archive that sits behind each one. | Every document the system has handled this month, in both directions, with the archive that sits behind each one. | 'the Hub' names a central processing hub; the single-company system is just the app running on the company's own server. |
| line 6, <title> | Processing History — Al Nasr Compliance Hub | Processing History — Al Nasr e-Invoicing | The product name 'Compliance Hub' frames the app as a single central hub that companies feed into. In a standalone per-company deployment there is no hub. |

### `alnasr-mock/hub/inbound.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 378, ddFoot | The Hub has done everything it does; the posting decision is theirs. | The system has done everything it does; the posting decision is theirs. | "The Hub" as the actor. |
| line 6, <title> | Inbound Documents — Al Nasr Compliance Hub | Inbound Documents — Al Nasr E-Invoicing | Product named as a central Compliance Hub. |

### `alnasr-mock/hub/login.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 24, brand-sub | <span class="brand-sub">Compliance Hub</span> | <span class="brand-sub">e-Invoicing</span> (or 'Tax Compliance') | The product's on-screen subtitle names it a central 'Compliance Hub'. |
| line 49, auth-point | Each company sees only its own data. | 'Your data stays on your own server — nothing leaves the company.' | 'Each company sees only its own data' is a tenant-isolation promise that only matters when many companies share one system. |
| line 54, auth-foot | Al Nasr Group · Muscat · Oman Tax Authority e-invoicing programme | Al Nasr · Muscat · Oman Tax Authority e-invoicing programme | 'Al Nasr Group' brands the deployment as the whole group rather than the single company running this instance. |
| line 6, <title> | Sign in — Al Nasr Compliance Hub | Sign in — Al Nasr e-Invoicing | 'Compliance Hub' branding. |
| line 61, form heading | Sign in to the Hub | Sign in | 'the Hub' names the central hub. |
| line 89, SSO button | Continue with group SSO | Continue with SSO | 'group SSO' implies a shared group identity provider spanning companies. |

### `alnasr-mock/hub/mapping.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 6, <title> | Mapping Studio — Al Nasr Compliance Hub | Mapping Studio — Al Nasr E-Invoicing | Central Compliance Hub product name. |
| lines 276 & 285, derived-field copy | 'Set by the Hub ' ... 'Generated by the Hub ' ... placeholder "What the Hub uses when the ERP has nothing" | "Set by the system" / "Generated by the system" / "What the system uses when the ERP has nothing". | "the Hub" is the actor setting/generating values. |

### `alnasr-mock/hub/onboard.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 111-112, probe-empty text | Press <b>Test connection</b> and the Hub             will reach the entity with the details on the left, one check at a time. | Press <b>Test connection</b> and the system will reach the ERP with the details on the left, one check at a time. | Describes 'the Hub' reaching out to 'the entity' — central server probing a tenant ERP. |
| line 160-161, footNote | 'Nothing is transmitted for this company until the test document has been through end to end.' | 'Nothing is transmitted until the test document has been through end to end.' | 'transmitted for this company' presumes the platform transmits on behalf of many companies. Mild, but reinforces the central-operator framing. |
| line 164-168, recapA kv | ['Group code',     '<span class="num">' + O.code + '</span>'], | ['Company code', ...] | 'Group code' labels the company code as a group-level identifier, implying membership in a group under one platform. |
| line 82-84, section-head | <strong style="font-size:14px">How this company will connect</strong>       </div>       <span class="small dim">Chosen per entity, after the ERP inventory</span> | 'Chosen after the ERP inventory' (drop 'per entity'). | 'Chosen per entity' implies a per-tenant configuration decision within a fleet of entities. |

### `alnasr-mock/hub/queue.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 6, <title> | Processing Queue — Al Nasr Compliance Hub | Processing Queue — Al Nasr E-Invoicing | "Compliance Hub" names the product as a central hub that companies feed into; the same title convention repeats on all five files. |
| lines 188 & 214, owner labels | Central technical team | Technical team (or IT team). | "Central" technical team frames a shared central operations team serving many entities; a single company just has its own IT/technical team. |

### `alnasr-mock/hub/reports.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 44, data-hint | The reports a group tax function actually asks for: what was invoiced, and whether every document reached the Authority. | The reports your tax function actually asks for: what was invoiced, and whether every document reached the Authority. | 'a group tax function' presumes a group-level tax team consuming aggregated multi-company reports. |
| line 53, page pill | <span class="pill pill-accent"><i class="dot"></i>Group-wide</span> | Remove the badge, or replace with 'This company' / the company name. | A 'Group-wide' badge declares the reports span the whole company group. A single-company install reports on one company only. |
| line 6, <title> | Reports — Al Nasr Compliance Hub | Reports — Al Nasr e-Invoicing | 'Compliance Hub' branding. |

### `alnasr-mock/hub/tenant-detail.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 145, DETAIL.allowlist comment | allowlist: 31,          /* fields the Hub is permitted to read */ | /* fields the system is permitted to read */ | 'fields the Hub is permitted to read' frames the reader as a central hub pulling from a tenant ERP. |
| line 271-273, boundary hub side | <div class="bh">The Hub runs everything from there</div> | <div class="bh">The e-invoicing system runs everything from there</div> | Names 'The Hub' as the party that runs the pipeline downstream of the company — the central-server model. |
| line 6, <title> | Al Nasr Marbles LLC — Al Nasr Compliance Hub | Al Nasr Marbles LLC — E-Invoicing | The product suffix 'Al Nasr Compliance Hub' names a central hub. Keep the company name, drop the hub. |

### `alnasr-mock/hub/tenants.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 90, <h2> | How the group connects | How this company connects | 'How the group connects' aggregates connection methods across companies in a group. |

### `alnasr-mock/hub/users.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 269, invite duplicate error | That person already has access to this company. | That person already has access. | 'to this company' implies one tenant among many. In a single-company app it is simply 'already has access'. |
| line 6, <title> | Users & Access — Al Nasr Compliance Hub | Users & Access — Al Nasr e-Invoicing | 'Compliance Hub' brands the app as a central hub. |
| line 63, users-title heading | One company’s users | Users | 'One company's users' only makes sense when the hub holds many companies and you are viewing one of them. In a single-company app this is simply the users list. |
| line 65, section-head note | Administered by that company, not by us | Administered by your finance team | 'that company, not by us' casts the operator as an external central provider serving separate tenant companies. |

### `alnasr-mock/index.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 116, flow-item 'Handled by' | The Compliance Hub | The compliance engine | Names the processing layer as a central Hub that invoices are sent to. Should read as software running on the company's own ERP server. |
| line 117, flow-item 'Reported via' | The group's provider | The accredited provider (ASP) | 'The group's provider' implies a shared group-level ASP/provider serving all companies centrally. A standalone deployment reports through the company's own provider. |
| line 90, brand-sub span | Compliance Hub | E-Invoicing | Branding sub-label names the system a central 'Hub'. In a single-company deployment there is no hub the companies feed into. |

### `alnasr-mock/portal/dashboard.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 161-162, #inviteNote | You add your own colleagues. The central team is not involved and never sets anyone's password. | You add your own colleagues, and each person sets their own password. | "The central team" implies a group-level operator that would otherwise manage users across tenants. |
| line 170, #reports section-head sub | The same reports the group runs — filtered to this company alone | Reports for this company | Presents these reports as a group-wide reporting suite filtered down to one tenant, implying a central group that runs reports across companies. |
| line 330-331, #help card | <b>Group IT fixes platform problems.</b> A dead connector, an expired certificate or a service provider outage is not yours to fix. | <b>IT fixes platform problems.</b> A dead connector, an expired certificate or a service provider outage is not yours to fix. | "Group IT" names a shared group-level IT function above the company; there is no group in this deployment. |
| line 332, #help card | The central service desk handles platform issues · einvoicing@alnasr.om | The IT service desk handles platform issues · einvoicing@alnasr.om | "The central service desk" implies a central/group support function serving multiple tenants. |
| line 333, #help button | Raise a ticket with the central team | Raise a ticket with IT | "the central team" frames support as a group-central desk. |
| line 337-338, btnTicket handler | Ticket drafted for the central technical team. Ticketing itself is outside this prototype. | Ticket drafted for the IT team. Ticketing itself is outside this prototype. | "the central technical team" implies a shared group technical function. |
| line 406-407, inviteNote after invite | They set their own password on first sign-in — you never see it, and neither does the central team. | They set their own password on first sign-in — you never see it, and neither does anyone else. | "the central team" again implies a group-central operator. |

### `alnasr-mock/portal/document.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 170-171, code comment | the entity's own finance team, or the central technical team. The entity never has to work that out for themselves. | the company's own finance team, or the IT team. Nobody has to work that out for themselves. | "the central technical team" frames platform ownership as a group-central function. |
| line 183, who string (platform-owned failure) | <b>The central technical team resolves this.</b> It is a platform matter, already assigned, and needs nothing from you. | <b>The IT team resolves this.</b> It is a platform matter, already assigned, and needs nothing from you. | "The central technical team" implies a group-central operations team. |

### `alnasr-mock/portal/login.html`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 44-45, auth-point text | This administrator set this password herself, from an invitation. The central team never saw it and cannot see it now. | This administrator set this password herself, from an invitation. Nobody else saw it and nobody can see it now. | "The central team" implies a group-level central operator that provisions accounts across companies. In a standalone single-company deployment there is no central team above the company. |
| line 50, auth-foot | Al Nasr Marbles LLC · Muscat · one legal entity of the Al Nasr Group | Al Nasr Marbles LLC · Muscat · Oman | Framing the company as "one legal entity of the Al Nasr Group" positions this as a per-tenant slice of a group-wide platform, rather than a system deployed for this one company. |

### `assets/css/app.css`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 115 (comment) | surface: PORTAL (Royal Beige bronze — one company's workspace) | surface: PORTAL (Royal Beige bronze — the finance team's workspace) | 'one company's workspace' implies the platform holds several companies and this surface is one of them. |
| line 2 (top comment banner) | Nazm — Centralized Integration Hub | Al Nasr — E-Invoicing & Tax Compliance | The design-system banner literally names the product a 'Centralized Integration Hub' — the exact central/hub framing to remove, and it even carries a stray product name (Nazm). |
| line 4 (comment) | portal (light, calm, tenant-scoped). | portal (light, calm, company finance view). | Describes the portal surface as 'tenant-scoped', the multi-tenant vocabulary of a platform serving many companies. |

### `assets/js/data.js`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 230, LEGS deliv.body | This leg is outside the group’s control and can take hours. | This leg is outside the company's control and can take hours. | 'the group's control' attributes ownership to the group rather than the single deploying company. |
| line 408 and 404, TRANSFORMS | { v: 'derive:uuidv5',      n: 'derive:uuidv5 — generated by the Hub' }, ... { v: 'lookup:company',     n: 'lookup:company — resolve from entity master' }, | 'generated by the system' and 'resolve from company master'. | Transform descriptions say the UUID is 'generated by the Hub' and that values 'resolve from entity master' — central-hub and multi-entity master framing. |
| line 450-452, MAPPING Buyer address fallback | fallback: 'Address held in the Hub entity master', | fallback: 'Address held in the company master data', | 'the Hub entity master' names a central master data store keyed by entity. |

### `assets/js/shell.js`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 126, BRAND.portal | portal: { mark: 'N', name: 'Al Nasr Marbles',  sub: 'Entity Portal',        who: 'HH', whoName: 'H. Al-Hinai',   whoRole: 'Finance — one company' }, | portal: { mark: 'N', name: 'Al Nasr Marbles', sub: 'Finance Portal', who: 'HH', whoName: 'H. Al-Hinai', whoRole: 'Finance' }, | 'Entity Portal' and 'Finance — one company' frame the portal as one tenant's slice of a multi-entity platform. |
| line 2 (header comment) | Al Nasr Compliance Hub — application shell + guided walkthrough | Al Nasr Tax Compliance — application shell + guided walkthrough | Names the product 'Compliance Hub', the central-hub label to retire. |
| line 32, WALKTHROUGH hub-login blurb | blurb: 'The group platform team logs in.' | blurb: 'The company's compliance team logs in.' | 'group platform team' presents the operator as a central group-wide team running the platform for many companies. |
| line 81, NAV.hub Operations | { key: 'dashboard', name: 'Group Dashboard',    href: 'dashboard.html', ico: 'grid' }, | { key: 'dashboard', name: 'Dashboard', href: 'dashboard.html', ico: 'grid' }, | The sidebar item literally reads 'Group Dashboard'. |

### `assets/js/ui.js`

| Loc | Now | → Change to | Why |
|---|---|---|---|
| line 2 (header comment) | Al Nasr Compliance Hub — shared UI component helpers | Al Nasr Tax Compliance — shared UI component helpers | Header names the product 'Compliance Hub'. |
