# FleetView Mock — Build Reference (READ FIRST)

Product: **FleetView — Fleet Inspection & Accountability Platform**. Demo prototype for a
transport company (~300 vehicles). Every page is a standalone, self-contained HTML file.
No build step, no external JS libraries. Google Fonts + inline SVG only.

## Design language (MATCH EXACTLY)
- Deep midnight nav rail (`--rail #0e1622`) + light workspace (`--bg #eef1f5`).
- Fonts: **Bricolage Grotesque** (display/headings/big numbers), **IBM Plex Sans** (UI/body),
  **IBM Plex Mono** (IDs, registrations, timestamps, e.g. `VEH-087`, `KA-01-AB-1234`, `07:12`).
- Accent = signal amber `--amber #e8a13a`. Status: good `--good #1f9d6b`, attention `--attn #e0952a`,
  critical `--crit #d8483c`, info `--info #3a72c4`.
- Cards: white, `border-radius:16px`, 1px `--line` border, soft shadow. Generous whitespace, no clutter.
- Look at `dashboard.html` (already built & approved) as the gold-standard reference for tone/spacing.

## File layout
- Portal pages live in `mock/` (root). In `<head>` link: `assets/portal.css`.
- Mobile pages live in `mock/mobile/`. In `<head>` link: `../assets/mobile.css`.
- Copy the fonts `<link>` block (see below) into every `<head>`.

```
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;450;500;600;700&display=swap" rel="stylesheet" />
```

## Portal page skeleton
```
<body>
<div class="app">
  <!-- paste the RAIL from assets/_rail.html; add class="active" to THIS page's <a> -->
  <div class="main">
    <!-- paste the TOPBAR from assets/_rail.html -->
    <div class="canvas">
      <div class="pagehead"> ... </div>
      ...content using .grid / .card / .tbl / .chip etc from portal.css ...
    </div>
  </div>
</div>
<span class="demo-tag">Demo prototype</span>
</body>
```
Reusable portal.css classes: `.grid .span-8/.span-4`, `.card .card-pad .card-head`, `.tbl-wrap table.tbl`,
`.chip.good/.attn/.crit/.info/.neutral`, `.pill.*`, `.btn .btn-primary .btn-dark`, `.seg`, `.tabs .tab`,
`.filterbar .selectbox .search-mini`, `.field`, `.breadcrumb`, `.t-id .mono .veh-thumb .row-av`, `.act-ic`.

## Mobile page skeleton (one phone per file, centered on dark stage)
```
<body>
  <div class="stage-head"><div class="kick">Driver App</div><h1>Screen title</h1><p>one-line context</p></div>
  <div class="stage">
    <div class="phone-wrap">
      <div class="phone"><div class="screen">
        <div class="notch"></div>
        <div class="statusbar"><span>9:41</span><span class="sig">…battery/wifi svg…</span></div>
        <div class="mscroll"> ...screen content... </div>
        <!-- optional .cta-dock or .tabbar pinned at bottom -->
      </div></div>
      <div class="phone-cap">M0X · <b>screen-name</b></div>
    </div>
  </div>
  <div class="stage-foot">FleetView Driver App · <a href="../index.html">All screens</a> · prev/next links</div>
</body>
```
Reusable mobile.css classes: `.appbar .back .ttl`, `.mpad .mcard .m-h1 .m-h2`, `.cta-dock .cta .cta-amber/.cta-good/.cta-crit/.cta-dark/.cta-ghost`,
`.tri` (OK/Not OK/N-A buttons), `.photogrid .photocard(.done)`, `.mprog`, `.chip.*`, `.tabbar`, `.mrow`.

## Product principles that MUST show in copy (from PRD)
1. **Evidence-first**: every condition event ties Vehicle + Driver + Timestamp + Photo + Checklist.
2. **Do NOT blame the driver.** Newly found damage → phrase as *"New damage first identified between the
   last known healthy inspection and the current inspection. Supervisor review required."* Never "driver caused".
3. **Custody window**, not fault. Driver profile metric "Damage cases during custody window" ≠ confirmed fault.
4. **AI is optional & advisory.** Always label AI output *"AI-generated observation — requires human verification."*
   AI actions: Flag / Compare / Recommend / Summarize / Prioritize. Never auto-discipline.
5. Guided not free-form. "Not OK" → comment + photo mandatory. Critical item Not OK → Supervisor Review Required.

## Canonical sample data (use consistently everywhere)
Vehicles:
- VEH-087 · Toyota Hiace · KA-01-AB-1234 · Van · Central Depot · Available · 84,421 km
- VEH-104 · Toyota Coaster · KA-01-CD-5678 · Bus · Central Depot · Supervisor Review
- VEH-211 · Force Traveller · KA-05-EF-4412 · Van · Depot B · Maintenance / Blocked (tyre)
- VEH-067 · Toyota Innova · KA-03-GH-7821 · Car · Depot B · Available
- (invent more like VEH-021, VEH-178, VEH-242 as needed, same format)

Drivers: Ahmed Khan DRV-0142 (96%) · John Mathew DRV-0098 (93%) · Ravi Kumar DRV-0211 (88%) · Sameer Ali DRV-0184 (79%)
Supervisors: Joseph Daniel SUP-0014 · Manoj Kumar SUP-0007
Fleet Manager (logged in): Rahul Sharma

Damage cases:
- DMG-00182 · VEH-087 · rear bumper scratch · Minor · Under Review · reported by John, 19 Aug 07:12
- DMG-00179 · VEH-104 · front-left dent · Moderate · Confirmed
- DMG-00166 · VEH-211 · tyre sidewall damage · Safety Critical · Repair in Progress

Damage statuses: Reported → Under Review → Confirmed → Repair Required → Repair in Progress → Repaired → Closed
Vehicle statuses: Available, Assigned, Inspection Due, Under Inspection, Cleared, Supervisor Review Required, Blocked, Under Maintenance, Inactive

Checklist sections & items:
- Exterior: Body, Scratches, Dents, Windscreen, Side mirrors, Doors, Headlights, Tail lights, Indicators, Tyres
- Interior: Driver seat, Passenger seats, Seat belts, Dashboard, A/C, Cleanliness, Floor
- Safety: Fire extinguisher, First-aid kit, Emergency triangle
- Mechanical: Brakes, Horn, Warning lights, Engine indication, Fuel level, Oil warning, Battery, Wipers
Response types: OK / Not OK / N/A. (~30 items total.)

Photo angles — Exterior: Front, Rear, Front-left, Front-right, Rear-left, Rear-right.
Interior: Driver seat, Front passenger, Rear seats, Dashboard, Floor.

Today's date shown in app: **Wed, 19 Aug 2026**.

## Page ↔ file map (use these hrefs for cross-links)
Portal: dashboard.html · vehicles.html · vehicle-profile.html · drivers→driver-compliance.html ·
assignments.html · inspections.html · inspection-detail.html · inspection-comparison.html ·
supervisor-audits.html · driver-compliance.html · damage.html · damage-detail.html ·
reports.html · monthly-report.html · ai-insights.html · ai-damage-review.html ·
checklist-builder.html · users.html · settings.html · index.html (hub)
Mobile: mobile/m01-login.html … m11 ; mobile/s01-home.html … s04

Make table rows / cards link to their detail pages so the mock clicks like a real product.
Add a small `<span class="demo-tag">Demo prototype</span>` to every portal page.
