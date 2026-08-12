# Hub mock — gap register against Proposal V3
Audited 5 Aug 2026, four parallel agents. For the WJ Towell presentation, Tuesday.

---

## A. Factual conflicts with the proposal — the client will have the PDF open

| # | What the mock says | Where | What V3 says |
|---|---|---|---|
| A1 | "Retention period — 10 years from issue date" | history.html:138 | §6: "**no fixed retention period is assumed** at this proposal stage" |
| A2 | "WORM · deletes blocked until 2036" | history.html:139 | as above |
| A3 | "Retention — 7 years, in country" | asp.html:187 | as above — **and it disagrees with A1** |
| A4 | "Archived — 10 years · Muscat DC" | erp/sync.html:179 | as above |
| A5 | "Data residency — Sultanate of Oman only" | history.html:137 | §10 item 2: residency is *still to be agreed* |
| A6 | "Tier 1 connector polled OData…" printed on screen | data.js:312 → erp/sync.html | §4: **Method 1 — Direct API** |
| A7 | T1 / T2 / T3 chips on every company row | tenants.html:122,139; tenant-detail.html:25,151 | Method 1 / 2 / 3 |
| A8 | "File drop" | tenants.html:90,97 | "Secure file transfer" |
| A9 | "Satellite deployment" | data.js:56; ui.js:53 | "Self-hosted utility (exception)" |
| A10 | "Nazm **Tenant** Portal" on the portal login and tab title | portal/login.html:6,23; hub/login.html:54 | "entity" / "legal entity"; also self-inconsistent — the sidebar one click later says "Company Portal" |
| A11 | "SAP, Dynamics, Odoo, Tally, ERPNext and Oracle — **all connected**" | hub/login.html:36 | §1 + §4: connector scope "can only be confirmed after the ERP inventory"; **no fixed number of connectors is assumed** |
| A12 | Settled 54 / 27 / 8 split of all 89 across methods | tenants.html:86-91 | §4: method selected **per entity after the inventory** |
| A13 | `satellites: 3` | data.js:65 | §3: **≈9** self-hosted, and labelled *indicative* |
| A14 | 54+27+8 = 89 — every entity routed through the hub | tenants.html:86-91 | §3: the ≈9 self-hosted entities have **no connection to the central hub** |
| A15 | "**Rejected by the tax authority**" | erp/invoices.html:77 | §2: the OTA does not adjudicate invoices. The mock's own asp.html:26 says "no authority clears them beforehand"; data.js:289 says it was the **ASP** that rejected |
| A16 | "Invoice acknowledged and **reported by the Hub** to the OTA" | erp/sync.html:148 | §2 corner 2: **the ASP** reports the Tax Data Document to the OTA |
| A17 | "**Appendix D** Base64 TLV QR" | data.js:322; erp/sync.html:90 | Appendix D / TLV is **ZATCA — Saudi Arabia**. V3 says only "QR information". A Gulf-literate advisor will spot this instantly |
| A18 | "Read-only probe … **write access not requested**" | tenant-detail.html:160 | §1 + §5 step 8: ERP writeback is headline scope — and erp/sync.html:139-143 shows five fields being written to that same SAP |
| A19 | "response within 2 hours" service-desk SLA | portal/dashboard.html:214 | §8 line 6: service levels are *to be agreed* |
| A20 | PINT-OM **v1.0.2** pinned in 8 places | data.js:211,228; shell.js:198; +5 | V3 references PINT-OM with **no version**. Unverifiable specificity invites "which version is contracted?" |

## B. Numbers that contradict each other on screen

| # | Conflict | Locations |
|---|---|---|
| B1 | 1058 success + 21 failed = 1079 total — **leaving no room for the 55 pending** headlined on the very next screen | data.js:66 vs queue.html:24 |
| B2 | "Fields resolved 47 / 47 — complete" sits one scroll above "**two of the 47 cannot be read from this ERP**" | mapping.html:114 vs :212; repeated as a 100% donut at tenant-detail.html:77 |
| B3 | Towell Auto Centre has **3** failures on the group dashboard and **2** in its own portal — and this contrast *is* the isolation demo | dashboard.html:115 vs portal/dashboard.html:24,122 + shell.js:61 |
| B4 | "Success rate 98.6%" beside "214 failed of 22 614" (= 99.05%) | history.html:99 vs :101 |
| B5 | "6 of 22 614 shown" vs "+ 22 600 more" (should be 22 608) | history.html:58 vs :75 |
| B6 | "Oldest in queue 4m 12s" while the visible oldest row was created 1 h 50 m earlier | queue.html:113 vs data.js:132 |
| B7 | "6 retrying" badge above a table with one retrying row | queue.html:67 vs :123 |
| B8 | "Transformations applied 12" — the profile actually has 20 | mapping.html:116 vs data.js:169-207 |
| B9 | "▲ 12.4% vs last Thursday" — the real figure is +38.3%, and 31 Jul 2026 is a **Friday**, the Omani weekend, yet it is the second-busiest day in the series | dashboard.html:102 vs data.js:68 |
| B10 | 99.2% against "target is 99.0%" rendered in **amber** — beating the target looks like missing it | portal/dashboard.html:120 |
| B11 | "412" means documents-today, ERP-fields-exposed and round-trip-milliseconds on adjacent screens | portal/dashboard.html:69; tenant-detail.html:155; asp.html:63 |
| B12 | "89 onboarded" pill above a page whose own footer says 61 live / 24 onboarding / 4 not started | tenants.html:24 |

## C. Missing flows — the gaps behind the client's instinct

| # | Gap | Proposal reference | Severity |
|---|---|---|---|
| C1 | **Mapping is not configurable.** Every row is four read-only divs. No input, no dropdown, no click target. The page asserts "configuration an analyst does once per company — not code" and then proves the opposite | §3, §7 | **the client's own complaint** |
| C2 | **No inbound flow anywhere.** Zero screens. V3 §5 devotes six numbered steps to it and §2 makes clear it is half the mandate | §5 inbound 1-6 | **largest structural gap** |
| C3 | **No five-corner Fawtara diagram.** The model V3 builds its whole architecture on appears nowhere; asp.html flattens three separate acknowledgement legs into one synchronous round trip ("Round trip 412 ms") | §2 | high |
| C4 | **No reports screen.** Client asked for this verbatim. The Export button and period selector are both decorative | client ask | high |
| C5 | **Nothing shows how a company gets its login.** No user administration, no roles, no invitation. "Onboard a company" is a button with no handler | §7 + client ask | high |
| C6 | **No onboarding wizard.** Choosing Method 1/2/3, entering an endpoint, testing the connection — the act V3 §3 calls "connection, mapping and configuration" is never shown | §3, §4 | high |
| C7 | **Archive is not a stage and not browsable.** V3 puts Archive at step **5, before transmission**; the mock's pipeline skips it. The six stored items of §6 are never listed | §5 step 5, §6 | high |
| C8 | **The delivery boundary is never stated.** "Each entity makes one complete invoice payload available at the agreed interface; everything onward is the hub team's" is the key commercial idea in the document and appears on no screen | §7 | high |
| C9 | **The self-hosted exception is invisible.** No screen shows an entity running the utility locally with data that never leaves its environment | §3 | medium |
| C10 | **No waves.** `wave` is populated on every entity in data.js and rendered by nothing | §2, §7 | medium |
| C11 | **"Stopped reporting" not distinguished from "failing".** A silent entity renders as an em-dash and a benign pill, under a header reading "All systems operational" | §3 | medium |
| C12 | **Credit notes invisible.** In the data, excluded from every table slice | §5 | low |
| C13 | Outbound pipeline is 7 invented stages, not V3's 8 — missing Archive and ERP writeback | §5 | medium |

## D. Third-party naming risk

`data.js:73-80` uses **real Omani and UAE companies** as fictional buyers with invented VAT numbers: Oman Oil Marketing, Sohar Aluminium, Muscat Municipality, Emirates Steel Arkan, Al Maha Petroleum, **Renaissance Services**, **Bahwan Engineering**. The last two are WJ Towell's actual peer set. These render inside the on-screen UBL and across four screens. Replace with invented counterparties regardless of any other decision.

## E. What is already correct — do not disturb

Peppol scheme `0248` (13 uses, consistent) · VATIN `OM` + 10 digits (13 values, all well-formed) · OMR at three decimals throughout · 5% VAT arithmetic correct on all 16 amounts · zero-rated exports correctly zeroed · entity counts reconcile to 89 in six places · GROUP totals equal the sum of their entities · **no commercial figure anywhere** · all 14 screens carry a disclaimer.

Two XML defects worth fixing since an ERP architect will be in the room: `hub/document.html:130-152` declares no `xmlns:cbc` / `xmlns:cac` and omits `UBLVersionID`, and `:139` double-encodes the EndpointID as `0248:OM1100428317` under `schemeID="0248"`.
