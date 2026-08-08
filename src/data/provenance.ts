import { TODAY, addDays } from "./constants";
import type { ReturnField } from "./types";

const iso = (d: Date) => d.toISOString();

// The traceability graph for Ray Okonkwo's 1040. Every field states where its
// number came from and what was done to it on the way. The seven field states
// all appear here on purpose, so the review screen proves the whole visual
// language in one place.
export const FIELDS: ReturnField[] = [
  {
    id: "f1040.line1z",
    line: "1z",
    label: "Wages, salaries, tips",
    schedule: "Form 1040 · Income",
    value: 209625,
    state: "verified",
    confidence: "high",
    confidenceScore: 0.99,
    editable: true,
    verifiedBy: "Marcus Reyes",
    verifiedOn: iso(addDays(TODAY, -14)),
    sources: [
      {
        docId: "d-w2-northwind",
        page: 1,
        regionId: "box1",
        label: "W-2 Northwind Robotics, Box 1",
        rawValue: "168,400.00",
      },
      {
        docId: "d-w2-cascade",
        page: 1,
        regionId: "box1",
        label: "W-2 Cascade Analytics, Box 1",
        rawValue: "41,225.00",
      },
    ],
    transform: [
      { op: "Read", detail: "Box 1 from each W-2 on file", result: "2 values" },
      {
        op: "Sum",
        detail: "168,400.00 + 41,225.00",
        result: "209,625.00",
      },
    ],
  },
  {
    id: "f1040.line2b",
    line: "2b",
    label: "Taxable interest",
    schedule: "Form 1040 · Income",
    value: 1284,
    state: "verified",
    confidence: "high",
    confidenceScore: 0.97,
    editable: true,
    verifiedBy: "Marcus Reyes",
    verifiedOn: iso(addDays(TODAY, -14)),
    sources: [
      {
        docId: "d-1099int-harborbank",
        page: 1,
        regionId: "box1",
        label: "1099-INT Harbor Bank, Box 1",
        rawValue: "1,284.00",
      },
    ],
    transform: [
      { op: "Read", detail: "Box 1, interest income", result: "1,284.00" },
      {
        op: "Exclude",
        detail:
          "Box 2 early withdrawal penalty of 65.00 is an adjustment, not interest. Routed to Schedule 1.",
        result: "1,284.00",
      },
    ],
  },
  {
    id: "f1040.line3a",
    line: "3a",
    label: "Qualified dividends",
    schedule: "Form 1040 · Income",
    value: 3812,
    state: "needs-approval",
    confidence: "low",
    confidenceScore: 0.44,
    editable: true,
    aiNote:
      "The source scan is skewed and partially cut off. This number is a best read of Box 1b and has not been confirmed against a second source.",
    sources: [
      {
        docId: "d-gen-r-0002-14",
        page: 1,
        regionId: "unreadable",
        label: "1099-DIV, Box 1b",
        rawValue: "3,812.00 (low confidence read)",
      },
    ],
    transform: [
      {
        op: "Read",
        detail: "Box 1b on a scan the extractor rated poor quality",
        result: "3,812.00",
      },
      {
        op: "Flag",
        detail: "No second source to cross-check against",
      },
    ],
  },
  {
    id: "f1040.line7",
    line: "7",
    label: "Capital gain or loss",
    schedule: "Form 1040 · Income",
    value: 18922,
    state: "needs-approval",
    confidence: "medium",
    confidenceScore: 0.71,
    editable: true,
    aiNote:
      "14 lots had no cost basis reported by the broker. Basis for those lots came from the client's own spreadsheet, which the IRS has no copy of.",
    sources: [
      {
        docId: "d-1099b-vantage",
        page: 1,
        regionId: "proceeds-total",
        label: "1099-B page 1, total proceeds",
        rawValue: "214,308.00",
      },
      {
        docId: "d-1099b-vantage",
        page: 2,
        regionId: "basis-covered",
        label: "1099-B page 2, basis reported to IRS",
        rawValue: "181,402.00",
      },
      {
        docId: "d-1099b-vantage",
        page: 3,
        regionId: "noncovered-block",
        label: "1099-B page 3, 14 noncovered lots",
        rawValue: "basis not reported",
      },
    ],
    transform: [
      { op: "Read", detail: "Total proceeds, all lots", result: "214,308.00" },
      {
        op: "Subtract",
        detail: "Cost basis reported to the IRS on covered lots",
        result: "−181,402.00",
      },
      {
        op: "Subtract",
        detail:
          "Basis for 14 noncovered lots, taken from the client's own record",
        result: "−13,984.00",
      },
      { op: "Result", detail: "Net gain", result: "18,922.00" },
    ],
  },
  {
    id: "schD.line1b",
    line: "1b",
    label: "Short-term proceeds, basis reported",
    schedule: "Schedule D",
    value: 214308,
    state: "calculated",
    confidence: "high",
    confidenceScore: 0.98,
    editable: false,
    sources: [
      {
        docId: "d-1099b-vantage",
        page: 1,
        regionId: "proceeds-total",
        label: "1099-B page 1, total proceeds",
        rawValue: "214,308.00",
      },
    ],
    transform: [
      { op: "Carry", detail: "Flows from Form 1040 line 7 worksheet" },
    ],
  },
  {
    id: "schE.line28k1",
    line: "28",
    label: "S-corp ordinary business income",
    schedule: "Schedule E",
    value: 62400,
    state: "ai-suggested",
    confidence: "high",
    confidenceScore: 0.93,
    editable: true,
    aiNote:
      "This K-1 arrived nine days after the first pass, so the number has not been through a human check yet.",
    sources: [
      {
        docId: "d-k1-alvarez",
        page: 1,
        regionId: "box1",
        label: "Schedule K-1 Alvarez Design Co., Box 1",
        rawValue: "62,400.00",
      },
    ],
    transform: [
      { op: "Read", detail: "Box 1, ordinary business income", result: "62,400.00" },
      {
        op: "Check",
        detail: "Shareholder percentage on the K-1 matches the client profile",
      },
    ],
  },
  {
    id: "schA.line8a",
    line: "8a",
    label: "Home mortgage interest",
    schedule: "Schedule A",
    value: 14268,
    state: "verified",
    confidence: "high",
    confidenceScore: 0.98,
    editable: true,
    verifiedBy: "Marcus Reyes",
    verifiedOn: iso(addDays(TODAY, -13)),
    sources: [
      {
        docId: "d-1098-summit",
        page: 1,
        regionId: "box1",
        label: "1098 Summit Mortgage, Box 1",
        rawValue: "14,268.00",
      },
    ],
    transform: [{ op: "Read", detail: "Box 1, mortgage interest received", result: "14,268.00" }],
  },
  {
    id: "schA.line11",
    line: "11",
    label: "Charitable contributions by cash or check",
    schedule: "Schedule A",
    value: 8450,
    state: "editable",
    confidence: "medium",
    confidenceScore: 0.68,
    editable: true,
    aiNote:
      "Totalled from receipts the client tagged as charitable. Receipts are self-reported, so this is the least verifiable number on the return.",
    sources: [
      {
        docId: "d-gen-r-0002-3",
        page: 1,
        regionId: "amount",
        label: "Receipt, Aster Health Foundation",
        rawValue: "2,500.00",
      },
      {
        docId: "d-gen-r-0002-9",
        page: 1,
        regionId: "amount",
        label: "Receipt, Fairgrove Community Trust",
        rawValue: "4,000.00",
      },
      {
        docId: "d-gen-r-0002-21",
        page: 1,
        regionId: "amount",
        label: "Receipt, Lakeshore Youth Fund",
        rawValue: "1,950.00",
      },
    ],
    transform: [
      { op: "Filter", detail: "6 receipts tagged Charitable, 3 above 1,000", result: "6 items" },
      { op: "Sum", detail: "2,500 + 4,000 + 1,950 + 3 smaller receipts", result: "8,450.00" },
    ],
  },
  {
    id: "f1040.line11",
    line: "11",
    label: "Adjusted gross income",
    schedule: "Form 1040 · Summary",
    value: 295978,
    state: "calculated",
    confidence: "high",
    confidenceScore: 1,
    editable: false,
    sources: [],
    transform: [
      {
        op: "Sum",
        detail: "Lines 1z, 2b, 3a, 7 and Schedule E line 28",
        result: "296,043.00",
      },
      {
        op: "Subtract",
        detail: "Schedule 1 adjustments, early withdrawal penalty",
        result: "−65.00",
      },
      { op: "Result", detail: "Adjusted gross income", result: "295,978.00" },
    ],
  },
  {
    id: "f1040.line12",
    line: "12",
    label: "Standard deduction",
    schedule: "Form 1040 · Summary",
    value: 30000,
    state: "locked",
    editable: false,
    lockReason:
      "Set by filing status. Change the filing status on the client profile and this updates with it.",
    confidence: "high",
    confidenceScore: 1,
    sources: [],
    transform: [
      { op: "Lookup", detail: "Married filing jointly, tax year 2025", result: "30,000.00" },
    ],
  },
  {
    id: "f1040.line25a",
    line: "25a",
    label: "Federal income tax withheld from W-2",
    schedule: "Form 1040 · Payments",
    value: 31940,
    state: "verified",
    confidence: "high",
    confidenceScore: 0.99,
    editable: true,
    verifiedBy: "Marcus Reyes",
    verifiedOn: iso(addDays(TODAY, -14)),
    sources: [
      {
        docId: "d-w2-northwind",
        page: 1,
        regionId: "box2",
        label: "W-2 Northwind Robotics, Box 2",
        rawValue: "26,140.00",
      },
      {
        docId: "d-w2-cascade",
        page: 1,
        regionId: "box2",
        label: "W-2 Cascade Analytics, Box 2",
        rawValue: "5,800.00",
      },
    ],
    transform: [
      { op: "Sum", detail: "26,140.00 + 5,800.00", result: "31,940.00" },
    ],
  },
  {
    id: "f1040.digital",
    line: "—",
    label: "Received or disposed of digital assets",
    schedule: "Form 1040 · Summary",
    value: 1,
    displayValue: "Yes",
    state: "client-answer",
    editable: false,
    confidence: "high",
    confidenceScore: 1,
    sources: [],
    transform: [
      {
        op: "Answer",
        detail: "Ray Okonkwo answered this in the 2025 questionnaire on Feb 24",
        result: "Yes",
      },
    ],
  },
];

export function getField(id: string) {
  return FIELDS.find((f) => f.id === id);
}

export const SCHEDULES = [
  "Form 1040 · Income",
  "Schedule D",
  "Schedule E",
  "Schedule A",
  "Form 1040 · Summary",
  "Form 1040 · Payments",
];
