import { TODAY, addDays } from "./constants";
import type { AiFinding } from "./types";

const iso = (d: Date) => d.toISOString();
const RAN = iso(addDays(TODAY, -1));

// Stand-in for a model response. The shape is what matters: every finding has
// to carry evidence, a stated uncertainty, and one recommended action, or the
// UI has nothing honest to show.
export const FINDINGS: AiFinding[] = [
  {
    id: "ai-1",
    returnId: "r-0002",
    severity: "high",
    title: "Cost basis missing on 14 brokerage lots",
    whatItDid:
      "Filled basis for 14 lots from the client's own spreadsheet because the broker did not report it.",
    why:
      "Vantage marked these lots noncovered. Without basis the entire proceeds figure would be taxed as gain, which would overstate the bill by roughly $13,984.",
    confidence: "medium",
    confidenceScore: 0.71,
    evidence: [
      {
        docId: "d-1099b-vantage",
        page: 3,
        regionId: "noncovered-block",
        label: "1099-B page 3, noncovered lots table",
        rawValue: "14 rows, basis column blank",
      },
      {
        docId: "d-1099b-vantage",
        page: 1,
        regionId: "proceeds-total",
        label: "1099-B page 1, total proceeds",
        rawValue: "214,308.00",
      },
    ],
    suggestedAction:
      "Ask Ray to confirm the basis figures, then approve line 7.",
    fieldId: "f1040.line7",
    suggestedValue: 18922,
    currentValue: 18922,
    status: "open",
    uncertainty:
      "The client's spreadsheet is not an IRS-verified source. If it is wrong, line 7 is wrong.",
    model: "extraction-v4",
    ranOn: RAN,
  },
  {
    id: "ai-2",
    returnId: "r-0002",
    severity: "high",
    title: "Dividend figure read from a poor scan",
    whatItDid: "Read $3,812 from Box 1b of a 1099-DIV the extractor rated poor quality.",
    why:
      "The page was scanned at an angle and the right edge is cut off. The digits were legible but there is no second copy on file to check against.",
    confidence: "low",
    confidenceScore: 0.44,
    evidence: [
      {
        docId: "d-gen-r-0002-14",
        page: 1,
        regionId: "unreadable",
        label: "1099-DIV, Box 1b",
        rawValue: "3,812.00 (poor scan)",
      },
    ],
    suggestedAction: "Request a clean copy from the client before approving.",
    fieldId: "f1040.line3a",
    suggestedValue: 3812,
    currentValue: 3812,
    status: "open",
    uncertainty:
      "A misread digit here changes AGI by up to several thousand dollars. Treat as unconfirmed.",
    model: "extraction-v4",
    ranOn: RAN,
  },
  {
    id: "ai-3",
    returnId: "r-0002",
    severity: "medium",
    title: "K-1 arrived after the first pass",
    whatItDid: "Added $62,400 of S-corp income to Schedule E from a K-1 received on Mar 5.",
    why:
      "The K-1 was uploaded nine days after wages and interest were entered, so it has not been through a human check with the rest of the return.",
    confidence: "high",
    confidenceScore: 0.93,
    evidence: [
      {
        docId: "d-k1-alvarez",
        page: 1,
        regionId: "box1",
        label: "Schedule K-1, Box 1",
        rawValue: "62,400.00",
      },
    ],
    suggestedAction: "Review Schedule E line 28 and accept if it looks right.",
    fieldId: "schE.line28k1",
    suggestedValue: 62400,
    currentValue: 62400,
    status: "open",
    uncertainty: "Low. The box is printed clearly and the ownership percentage matches.",
    model: "extraction-v4",
    ranOn: RAN,
  },
  {
    id: "ai-4",
    returnId: "r-0002",
    severity: "medium",
    title: "Charitable deduction is 62% above last year",
    whatItDid: "Compared this year's charitable total against the 2024 return.",
    why:
      "2024 showed $5,220. This year totals $8,450 across six receipts. Large year-over-year jumps in this category draw attention.",
    confidence: "high",
    confidenceScore: 0.88,
    evidence: [
      {
        docId: "d-gen-r-0002-9",
        page: 1,
        regionId: "amount",
        label: "Receipt, Fairgrove Community Trust",
        rawValue: "4,000.00",
      },
    ],
    suggestedAction:
      "Confirm the client has written acknowledgement for the two gifts over $250.",
    fieldId: "schA.line11",
    status: "open",
    uncertainty: "The comparison is sound. Whether it matters is a judgment call.",
    model: "review-v2",
    ranOn: RAN,
  },
  {
    id: "ai-5",
    returnId: "r-0002",
    severity: "low",
    title: "Early withdrawal penalty routed to Schedule 1",
    whatItDid: "Moved the $65 in Box 2 of the Harbor Bank 1099-INT out of interest income.",
    why: "Box 2 is an above-the-line adjustment, not interest. Leaving it in line 2b would overstate income.",
    confidence: "high",
    confidenceScore: 0.99,
    evidence: [
      {
        docId: "d-1099int-harborbank",
        page: 1,
        regionId: "box2",
        label: "1099-INT Harbor Bank, Box 2",
        rawValue: "65.00",
      },
    ],
    suggestedAction: "No action needed. Shown so the routing is visible.",
    fieldId: "f1040.line2b",
    status: "open",
    uncertainty: "None worth flagging.",
    model: "review-v2",
    ranOn: RAN,
  },
];

export function findingsFor(returnId: string) {
  return FINDINGS.filter((f) => f.returnId === returnId);
}

export function findingForField(fieldId: string) {
  return FINDINGS.find((f) => f.fieldId === fieldId);
}
