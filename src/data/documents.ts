import { makeRng } from "@/lib/seed";
import { TODAY, addDays } from "./constants";
import type { DocKind, SourceDoc } from "./types";

const iso = (d: Date) => d.toISOString();

// Five documents render as full HTML facsimiles. Those are the ones the
// traceability panel can highlight down to an individual box.
export const HERO_DOCS: SourceDoc[] = [
  {
    id: "d-w2-northwind",
    returnId: "r-0002",
    kind: "W-2",
    title: "W-2 · Northwind Robotics",
    issuer: "Northwind Robotics Inc.",
    pages: 1,
    uploadedOn: iso(addDays(TODAY, -22)),
    uploadedBy: "Ray Okonkwo",
    status: "extracted",
    fieldsFed: ["f1040.line1z", "f1040.line25a"],
    sizeKb: 148,
    facsimile: "w2",
  },
  {
    id: "d-w2-cascade",
    returnId: "r-0002",
    kind: "W-2",
    title: "W-2 · Cascade Analytics",
    issuer: "Cascade Analytics LLC",
    pages: 1,
    uploadedOn: iso(addDays(TODAY, -22)),
    uploadedBy: "Ray Okonkwo",
    status: "extracted",
    fieldsFed: ["f1040.line1z", "f1040.line25a"],
    sizeKb: 132,
    facsimile: "w2",
  },
  {
    id: "d-1099int-harborbank",
    returnId: "r-0002",
    kind: "1099-INT",
    title: "1099-INT · Harbor Bank",
    issuer: "Harbor Bank, N.A.",
    pages: 1,
    uploadedOn: iso(addDays(TODAY, -20)),
    uploadedBy: "Ray Okonkwo",
    status: "extracted",
    fieldsFed: ["f1040.line2b"],
    sizeKb: 74,
    facsimile: "1099int",
  },
  {
    id: "d-1099b-vantage",
    returnId: "r-0002",
    kind: "1099-B",
    title: "1099-B · Vantage Brokerage",
    issuer: "Vantage Brokerage Services",
    pages: 3,
    uploadedOn: iso(addDays(TODAY, -18)),
    uploadedBy: "Ray Okonkwo",
    status: "needs-review",
    fieldsFed: ["f1040.line7", "schD.line1b"],
    sizeKb: 612,
    facsimile: "1099b",
  },
  {
    id: "d-k1-alvarez",
    returnId: "r-0002",
    kind: "K-1",
    title: "Schedule K-1 · Alvarez Design Co.",
    issuer: "Alvarez Design Co. (1120-S)",
    pages: 1,
    uploadedOn: iso(addDays(TODAY, -5)),
    uploadedBy: "Marcus Reyes",
    status: "extracted",
    fieldsFed: ["schE.line28k1"],
    sizeKb: 96,
    facsimile: "k1",
  },
  {
    id: "d-1098-summit",
    returnId: "r-0002",
    kind: "1098",
    title: "1098 · Summit Mortgage",
    issuer: "Summit Mortgage Servicing",
    pages: 1,
    uploadedOn: iso(addDays(TODAY, -19)),
    uploadedBy: "Ray Okonkwo",
    status: "extracted",
    fieldsFed: ["schA.line8a"],
    sizeKb: 88,
    facsimile: "1098",
  },
];

const KINDS: readonly DocKind[] = [
  "Receipt", "Statement", "1099-DIV", "1099-INT", "1099-B", "Letter", "1095-A",
];

const VENDORS = [
  "Cedar Point Supply", "Trilogy Payments", "Odeon Software", "Kestrel Freight",
  "Bright Harbor Insurance", "Union Line Utilities", "Marlow Legal",
  "Fairgrove Property", "Aster Health", "Ridge & Bay Accounting",
  "Halyard Marine", "Grainhouse Foods", "Blue Ledger Payroll",
  "Northfield Storage", "Vantage Brokerage", "Harbor Bank",
  "Summit Mortgage", "Copperfield Auto", "Lakeshore Dental", "Novara Travel",
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Ray's return carries a real pile of paperwork so search, filtering, and the
// document list get tested against volume rather than a demo handful.
function generateFor(returnId: string, count: number, seed: number): SourceDoc[] {
  const rng = makeRng(seed);
  const out: SourceDoc[] = [];
  for (let i = 0; i < count; i++) {
    const kind = rng.weighted([
      ["Receipt" as DocKind, 46],
      ["Statement" as DocKind, 26],
      ["1099-DIV" as DocKind, 8],
      ["1099-INT" as DocKind, 6],
      ["1099-B" as DocKind, 4],
      ["Letter" as DocKind, 6],
      ["1095-A" as DocKind, 4],
    ]);
    const vendor = rng.pick(VENDORS);
    const title =
      kind === "Receipt"
        ? `Receipt · ${vendor} · ${rng.pick(MONTHS)}`
        : kind === "Statement"
          ? `${rng.pick(MONTHS)} statement · ${vendor}`
          : `${kind} · ${vendor}`;

    out.push({
      id: `d-gen-${returnId}-${i}`,
      returnId,
      kind,
      title,
      issuer: vendor,
      pages: rng.int(1, 4),
      uploadedOn: iso(addDays(TODAY, -rng.int(1, 40))),
      uploadedBy: rng.chance(0.72) ? "Ray Okonkwo" : "Marcus Reyes",
      status: rng.weighted([
        ["extracted" as const, 74],
        ["needs-review" as const, 16],
        ["pending" as const, 7],
        ["unreadable" as const, 3],
      ]),
      fieldsFed: [],
      sizeKb: rng.int(38, 1400),
    });
  }
  return out;
}

export const DOCUMENTS: SourceDoc[] = [
  ...HERO_DOCS,
  ...generateFor("r-0002", 278, 771001),
  ...generateFor("r-0003", 96, 771002),
  ...generateFor("r-0007", 11, 771003),
];

export function getDoc(id: string) {
  return DOCUMENTS.find((d) => d.id === id);
}

export function docsFor(returnId: string) {
  return DOCUMENTS.filter((d) => d.returnId === returnId);
}

export const KIND_LIST = KINDS;
