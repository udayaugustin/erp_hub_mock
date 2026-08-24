#!/usr/bin/env python3
"""
Generate hub-mock/assets/js/pint-fields.js from the real PINT-OM ruleset.

The mock is dependency-free and has no build step, so the field list is
emitted as a plain JS file rather than fetched at runtime. Re-run this
whenever core/data/pint_om_invoice_v1.json changes:

    python3 hub-mock/tools/gen-pint-fields.py

Why a subset and not all 257 fields
-----------------------------------
The live preview exists to convince a stakeholder that the mapping is real,
not to enumerate the standard. Rendering 170 empty optional fields reads as
"the system has no data for these" rather than "these do not apply to a
domestic goods invoice", and it buries the fields that do carry values.

So we keep every group that a plain domestic standard-rated goods invoice
actually populates, and drop the groups that only appear in other scenarios
(allowances, charges, prepayments, tax representative, preceding-invoice
references). The dropped ones are still counted, and the screen says so.
"""

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "core" / "data" / "pint_om_invoice_v1.json"
OUT = ROOT / "hub-mock" / "assets" / "js" / "pint-fields.js"

# Groups a domestic standard-rated goods invoice actually fills in.
KEEP = {
    "(root)",
    "PROCESS CONTROL",
    "SELLER",
    "SELLER POSTAL ADDRESS",
    "BUYER",
    "BUYER POSTAL ADDRESS",
    "DOCUMENT TOTALS",
    "VAT BREAKDOWN",
    "INVOICE LINE",
    "ITEM INFORMATION",
    "LINE AMOUNTS IN ACCOUNTING CURRENCY (OMR)",
    "PRICE DETAILS",
    "LINE VAT INFORMATION",
}

# Demo values for the invoice the whole walkthrough follows,
# TAC-SINV-2026-04471. Keyed by IBT so they survive a ruleset rename.
# Anything absent renders as "not applicable on this invoice".
#
# `ERP_SRC` is the field name on the ERP side. Towell Auto Centre runs ERPNext in
# this demo, so these are ERPNext Sales Invoice fieldnames — the left pane of
# the live preview shows what the ERP actually hands over, which is not the
# same vocabulary as the standard's. Where the Hub derives a value rather than
# reading it, there is deliberately no source field.
ERP_SRC = {
    "IBT-001": "name",
    "IBT-002": "posting_date",
    "IBT-003": "custom_invoice_type_code",
    "IBT-005": "currency",
    "IBT-006": "currency",
    "IBT-009": "due_date",
    "IBT-013": "po_no",
    "IBT-022": "remarks",
    "IBT-027": "company",
    "IBT-028": "company",
    "IBT-029": "custom_company_peppol_id",
    "IBT-030": "custom_company_cr_number",
    "IBT-031": "company_tax_id",
    "IBT-033": "custom_company_legal_form",
    "IBT-035": "company_address_line1",
    "IBT-037": "company_address_city",
    "IBT-038": "company_address_pincode",
    "IBT-039": "company_address_state",
    "IBT-040": "company_address_country",
    "IBT-044": "customer_name",
    "IBT-046": "customer",
    "IBT-047": "custom_customer_cr_number",
    "IBT-048": "tax_id",
    "IBT-049": "contact_email",
    "IBT-050": "customer_address_line1",
    "IBT-052": "customer_address_city",
    "IBT-053": "customer_address_pincode",
    "IBT-055": "customer_address_country",
    "IBT-106": "total",
    "IBT-109": "net_total",
    "IBT-110": "total_taxes_and_charges",
    "IBT-112": "grand_total",
    "IBT-115": "outstanding_amount",
    "IBT-116": "taxes.tax_amount_base",
    "IBT-117": "taxes.tax_amount",
    "IBT-118": "taxes.custom_category_code",
    "IBT-119": "taxes.rate",
    "IBT-126": "items.idx",
    "IBT-129": "items.qty",
    "IBT-130": "items.uom",
    "IBT-131": "items.amount",
    "IBT-146": "items.rate",
    "IBT-151": "items.custom_tax_category",
    "IBT-152": "items.custom_tax_rate",
    "IBT-153": "items.item_name",
    "IBT-154": "items.description",
    "IBT-155": "items.item_code",
}

# Set by the Hub for every document, identical across all 89 entities.
# Not read from an ERP and not derived from invoice data.
HUB_SET = {"IBT-023", "IBT-024"}

VALUES = {
    "IBT-001": "TAC-SINV-2026-04471",
    "BTOM-002": "b7f4c2e1-9a3d-5c8b-a1f6-2e7d4b9c0a35",
    "IBT-002": "2026-07-28",
    "IBT-003": "380",
    "BTOM-001": "Standard",
    "IBT-005": "OMR",
    "IBT-006": "OMR",
    "IBT-009": "2026-08-27",
    "IBT-013": "PO-88213",
    "IBT-022": "Lubricants order, Wattayah depot",
    "IBT-024": "urn:peppol:pint:billing-1@om-1",
    "IBT-023": "urn:peppol:bis:billing",
    # seller
    "IBT-027": "Towell Auto Centre LLC",
    "IBT-028": "Towell Auto Centre",
    "IBT-029": "OM1100428317",
    "IBT-030": "1279046",
    "IBT-031": "OM1100428317",
    "IBT-033": "W. J. Towell & Co. LLC group entity",
    "IBT-035": "Wattayah, Way 2817",
    "IBT-037": "Muscat",
    "IBT-038": "112",
    "IBT-039": "Muscat Governorate",
    "IBT-040": "OM",
    # buyer
    "IBT-044": "FALAJ PETROLEUM DISTRIBUTION SAOG",
    "IBT-046": "CUST-004182",
    "IBT-047": "1104477",
    "IBT-048": "OM1100773241",
    "IBT-049": "accounts@falajpetroleum.om",
    "IBT-050": "Building 47, Al Khuwair",
    "IBT-052": "Muscat",
    "IBT-053": "133",
    "IBT-055": "OM",
    # totals
    "IBT-106": "24800.000",
    "IBT-109": "24800.000",
    "IBT-110": "1240.000",
    "IBT-112": "26040.000",
    "IBT-115": "26040.000",
    # vat breakdown
    "IBT-116": "24800.000",
    "IBT-117": "1240.000",
    "IBT-118": "S",
    "IBT-119": "5.00",
    # line
    "IBT-126": "1",
    "IBT-129": "120.000",
    "IBT-130": "EA",
    "IBT-131": "24800.000",
    "IBT-146": "206.667",
    "IBT-153": "Lubricant, 20L drum",
    "IBT-154": "Fully synthetic engine lubricant, 20 litre drum",
    "IBT-155": "MAT-4471",
    "IBT-151": "S",
    "IBT-152": "5.00",
}


def main() -> int:
    if not SRC.exists():
        print(f"ruleset not found: {SRC}", file=sys.stderr)
        return 1

    spec = json.load(open(SRC))
    fields = spec["fields"]

    kept, dropped = [], []
    for f in fields:
        grp = f.get("group_label") or "(root)"
        (kept if grp in KEEP else dropped).append(f)

    rows = []
    for f in kept:
        ibt = f.get("ibt") or ""
        rows.append(
            {
                "ibt": ibt,
                "n": f.get("name") or "",
                "l": f.get("label") or "",
                "g": f.get("group_label") or "Document header",
                "c": f.get("cardinality") or "",
                "t": f.get("datatype") or "string",
                "p": f.get("ubl_path") or "",
                "m": bool(f.get("mandatory")),
                "d": bool(f.get("derived")),
                "v": VALUES.get(ibt, ""),
                "s": ERP_SRC.get(ibt, ""),
                "h": ibt in HUB_SET,
            }
        )

    populated = sum(1 for r in rows if r["v"])
    mandatory = sum(1 for r in rows if r["m"])
    from_erp = sum(1 for r in rows if r["v"] and r["s"])
    derived  = sum(1 for r in rows if r["v"] and not r["s"] and (r["d"] or r["h"]))
    erp_fields = len({r["s"] for r in rows if r["s"]})

    body = ",\n".join(
        "  " + json.dumps(r, ensure_ascii=False, separators=(", ", ": ")) for r in rows
    )

    js = f"""/* ==========================================================================
   PINT-OM field set — GENERATED, do not edit by hand.
   Source: core/data/pint_om_invoice_v1.json (version {spec.get('version')})
   Regenerate: python3 hub-mock/tools/gen-pint-fields.py

   {len(fields)} fields in the full ruleset. {len(rows)} kept here — the groups a
   domestic standard-rated goods invoice actually populates. The other
   {len(dropped)} belong to scenarios this invoice is not (allowances, charges,
   prepayments, tax representative, preceding-invoice references) and are
   reported as a count on screen rather than rendered as empty rows.

   Keys: ibt, n(ame), l(abel), g(roup), c(ardinality), t(ype),
         p(ath, UBL), m(andatory), d(erived), v(alue for the demo invoice),
         s(ource field on the ERP side; empty when the Hub supplies it)
         h(ub-set constant, same on every document)
   ========================================================================== */

const PINT_TOTAL = {len(fields)};
const PINT_SHOWN = {len(rows)};
const PINT_OTHER_SCENARIO = {len(dropped)};
const PINT_MANDATORY = {mandatory};
const PINT_POPULATED = {populated};
const PINT_FROM_ERP = {from_erp};
const PINT_DERIVED = {derived};
const PINT_ERP_FIELDS = {erp_fields};
const PINT_VERSION = {json.dumps(spec.get('version'))};

const PINT_FIELDS = [
{body}
];
"""

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(js)

    print(f"wrote {OUT.relative_to(ROOT)}")
    print(f"  ruleset          {spec.get('version')}  {len(fields)} fields")
    print(f"  kept             {len(rows)}  ({mandatory} mandatory)")
    print(f"  populated        {populated}")
    print(f"  other scenarios  {len(dropped)}")
    unmatched = sorted(set(VALUES) - {r['ibt'] for r in rows})
    if unmatched:
        print(f"  WARNING: {len(unmatched)} demo values match no kept field: {unmatched}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
