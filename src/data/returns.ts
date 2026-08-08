import { makeRng } from "@/lib/seed";
import { TODAY, addDays } from "./constants";
import type { Blocker, TaxReturn } from "./types";

const iso = (d: Date) => d.toISOString();

// Four hand-written returns carry the demo. Everything else is generated so the
// dashboard and the returns list get tested against real volume.
export const HERO_RETURNS: TaxReturn[] = [
  {
    id: "r-0001",
    clientName: "Whitfield, Dana",
    clientId: "c-whitfield",
    entity: "1040",
    year: 2025,
    status: {
      stage: "gathering",
      subStage: "Awaiting first upload",
      owner: "client",
      since: iso(addDays(TODAY, -2)),
      blockers: [
        {
          kind: "waiting-client",
          label: "No documents uploaded yet",
          since: iso(addDays(TODAY, -2)),
          owner: "client",
          linkTo: "/client",
        },
      ],
    },
    assignedTo: "Marcus Reyes",
    reviewer: "Priya Shah",
    dueOn: iso(addDays(TODAY, 36)),
    refund: 0,
    complexity: "simple",
    docCount: 0,
    openQuestions: 0,
    lowConfidenceFields: 0,
    riskFlags: [],
    extended: false,
  },
  {
    id: "r-0002",
    clientName: "Okonkwo, Ray",
    clientId: "c-okonkwo",
    entity: "1040",
    year: 2025,
    status: {
      stage: "questions",
      subStage: "3 questions sent, 1 answered",
      owner: "client",
      since: iso(addDays(TODAY, -6)),
      blockers: [
        {
          kind: "waiting-client",
          label: "2 unanswered questions",
          since: iso(addDays(TODAY, -6)),
          owner: "client",
          linkTo: "/client/questions",
        },
        {
          kind: "waiting-client",
          label: "Missing 1099-B cost basis statement",
          since: iso(addDays(TODAY, -9)),
          owner: "client",
          linkTo: "/client/documents",
        },
      ],
    },
    assignedTo: "Marcus Reyes",
    reviewer: "Priya Shah",
    dueOn: iso(addDays(TODAY, 12)),
    refund: 4820,
    complexity: "complex",
    docCount: 284,
    openQuestions: 2,
    lowConfidenceFields: 3,
    riskFlags: ["Basis missing on 14 lots", "K-1 arrived after first pass"],
    lastClientReplyOn: iso(addDays(TODAY, -4)),
    extended: false,
  },
  {
    id: "r-0003",
    clientName: "Alvarez Design Co.",
    clientId: "c-alvarez",
    entity: "1120-S",
    year: 2025,
    status: {
      stage: "review",
      subStage: "In reviewer queue, 9 days",
      owner: "firm",
      since: iso(addDays(TODAY, -9)),
      blockers: [
        {
          kind: "waiting-firm",
          label: "Reviewer sign-off overdue",
          since: iso(addDays(TODAY, -9)),
          owner: "firm",
        },
      ],
    },
    assignedTo: "Tim Boyd",
    reviewer: "Priya Shah",
    dueOn: iso(addDays(TODAY, 4)),
    refund: 0,
    complexity: "complex",
    docCount: 96,
    openQuestions: 0,
    lowConfidenceFields: 5,
    riskFlags: ["Officer comp below guideline", "Prior year amended"],
    inReviewSince: iso(addDays(TODAY, -9)),
    extended: false,
  },
  {
    id: "r-0007",
    clientName: "Reyes, Marcus",
    clientId: "c-reyes",
    entity: "1040",
    year: 2025,
    status: {
      stage: "preparing",
      subStage: "Extraction complete, 2 fields flagged",
      owner: "firm",
      since: iso(addDays(TODAY, -3)),
      blockers: [],
    },
    assignedTo: "Priya Shah",
    reviewer: "Lena Ortiz",
    dueOn: iso(addDays(TODAY, 20)),
    refund: 1150,
    complexity: "standard",
    docCount: 11,
    openQuestions: 1,
    lowConfidenceFields: 2,
    riskFlags: ["Staff return, second review required"],
    extended: false,
  },
];

const LAST = [
  "Nakamura", "Ellsworth", "Brennan", "Vasquez", "Kim", "Okafor", "Lindqvist",
  "Petrov", "Chaudhry", "Moreau", "Bianchi", "Delgado", "Fitzgerald", "Novak",
  "Adeyemi", "Sorensen", "Ibarra", "Whitaker", "Mensah", "Kowalski", "Reyna",
  "Ashford", "Duval", "Sandoval", "Tremblay", "Haverford", "Osei", "Balogun",
  "Castellanos", "Nyberg", "Marchetti", "Aguilar", "Stroud", "Pemberton",
];

const FIRST = [
  "Alice", "Ben", "Camille", "Devon", "Elena", "Frank", "Grace", "Hugo",
  "Imani", "Jonah", "Kara", "Luis", "Maya", "Noor", "Omar", "Pilar",
  "Quinn", "Rosa", "Sam", "Tessa", "Uri", "Vera", "Wes", "Yara",
];

const BIZ = [
  "Northgate Logistics", "Harbor & Vine", "Sundial Media", "Ridgeline Dental",
  "Copper Fox Brewing", "Verity Consulting", "Blue Spruce Realty",
  "Tanaka Orthodontics", "Foundry Row Studios", "Lark & Loom",
  "Pinewood Contracting", "Meridian Pet Care", "Stagecoach Coffee",
  "Halcyon Physical Therapy", "Ember Lane Bakery", "Fairweather Design",
];

const STAFF = ["Marcus Reyes", "Tim Boyd", "Priya Shah", "Dev Raman", "Nora Feld"];
const REVIEWERS = ["Priya Shah", "Lena Ortiz", "Nora Feld"];

const RISKS = [
  "Large charitable deduction vs prior year",
  "New state nexus",
  "Home office first year",
  "Crypto disposals reported",
  "Basis missing on some lots",
  "Dependent claimed on two returns",
  "Prior year amended",
  "Foreign account threshold",
  "Estimated payments do not match IRS record",
];

function blockersFor(
  stageKey: TaxReturn["status"]["stage"],
  rng: ReturnType<typeof makeRng>,
): Blocker[] {
  if (stageKey === "gathering" && rng.chance(0.55)) {
    return [
      {
        kind: "waiting-client",
        label: `${rng.int(1, 5)} documents still needed`,
        since: iso(addDays(TODAY, -rng.int(1, 21))),
        owner: "client",
      },
    ];
  }
  if (stageKey === "questions") {
    return [
      {
        kind: "waiting-client",
        label: `${rng.int(1, 4)} unanswered questions`,
        since: iso(addDays(TODAY, -rng.int(1, 18))),
        owner: "client",
      },
    ];
  }
  if (stageKey === "review" && rng.chance(0.35)) {
    return [
      {
        kind: "waiting-firm",
        label: "Reviewer sign-off overdue",
        since: iso(addDays(TODAY, -rng.int(6, 14))),
        owner: "firm",
      },
    ];
  }
  if (stageKey === "approval" && rng.chance(0.6)) {
    return [
      {
        kind: "waiting-client",
        label: "Awaiting client signature",
        since: iso(addDays(TODAY, -rng.int(1, 12))),
        owner: "client",
      },
    ];
  }
  if (stageKey === "filed" && rng.chance(0.06)) {
    return [
      {
        kind: "waiting-irs",
        label: "IRS acknowledgement pending",
        since: iso(addDays(TODAY, -rng.int(1, 4))),
        owner: "irs",
      },
    ];
  }
  return [];
}

const SUBSTAGE: Record<string, string[]> = {
  gathering: ["Intake sent", "Partial upload received", "Awaiting first upload"],
  preparing: [
    "Extraction running",
    "Extraction complete, fields flagged",
    "Schedules assembling",
    "Data entry in progress",
  ],
  questions: ["Questions sent", "Partially answered", "Follow-up sent"],
  review: ["In reviewer queue", "Reviewer notes open", "Second pass"],
  approval: ["E-sign sent", "Client viewing", "Signature partially complete"],
  filed: ["Accepted by the IRS", "Transmitted", "Refund issued"],
};

function generate(count: number): TaxReturn[] {
  const rng = makeRng(20260310);
  const out: TaxReturn[] = [];

  for (let i = 0; i < count; i++) {
    const entity = rng.weighted([
      ["1040" as const, 68],
      ["1120-S" as const, 20],
      ["1065" as const, 12],
    ]);
    const isBiz = entity !== "1040";
    const clientName = isBiz
      ? rng.pick(BIZ)
      : `${rng.pick(LAST)}, ${rng.pick(FIRST)}`;

    const stageKey = rng.weighted([
      ["gathering" as const, 18],
      ["preparing" as const, 24],
      ["questions" as const, 20],
      ["review" as const, 16],
      ["approval" as const, 12],
      ["filed" as const, 10],
    ]);

    const complexity = rng.weighted([
      ["simple" as const, 34],
      ["standard" as const, 44],
      ["complex" as const, 22],
    ]);

    const extended = rng.chance(0.16);
    const dueOn = extended
      ? addDays(TODAY, rng.int(120, 200))
      : addDays(TODAY, rng.int(-4, 40));

    const blockers = blockersFor(stageKey, rng);
    const owner: TaxReturn["status"]["owner"] =
      blockers[0]?.owner ?? (stageKey === "filed" ? "irs" : "firm");

    const riskCount = complexity === "complex" ? rng.int(0, 3) : rng.int(0, 1);
    const riskFlags: string[] = [];
    for (let r = 0; r < riskCount; r++) {
      const flag = rng.pick(RISKS);
      if (!riskFlags.includes(flag)) riskFlags.push(flag);
    }

    const id = `r-${String(i + 100).padStart(4, "0")}`;

    out.push({
      id,
      clientName,
      clientId: `c-gen-${i}`,
      entity,
      year: 2025,
      status: {
        stage: stageKey,
        subStage: rng.pick(SUBSTAGE[stageKey]),
        owner,
        since: iso(addDays(TODAY, -rng.int(1, 25))),
        blockers,
      },
      assignedTo: rng.chance(0.07) ? "Unassigned" : rng.pick(STAFF),
      reviewer: rng.pick(REVIEWERS),
      dueOn: iso(dueOn),
      refund: rng.chance(0.62) ? rng.int(180, 22000) : -rng.int(200, 14000),
      complexity,
      docCount:
        complexity === "complex" ? rng.int(40, 210) : rng.int(3, 38),
      openQuestions: stageKey === "questions" ? rng.int(1, 5) : rng.int(0, 2),
      lowConfidenceFields: rng.weighted([
        [0, 44],
        [1, 22],
        [2, 14],
        [3, 10],
        [5, 6],
        [8, 4],
      ]),
      riskFlags,
      lastClientReplyOn: rng.chance(0.6)
        ? iso(addDays(TODAY, -rng.int(1, 30)))
        : undefined,
      inReviewSince:
        stageKey === "review" ? iso(addDays(TODAY, -rng.int(1, 14))) : undefined,
      extended,
    });
  }
  return out;
}

export const RETURNS: TaxReturn[] = [...HERO_RETURNS, ...generate(238)];

export function getReturn(id: string) {
  return RETURNS.find((r) => r.id === id);
}

export function returnsForPersona(personaId: string, role: string): TaxReturn[] {
  if (role === "preparer") {
    return RETURNS.filter((r) => r.assignedTo === "Marcus Reyes");
  }
  if (role === "seasonal") {
    return RETURNS.filter((r) => r.assignedTo === "Tim Boyd");
  }
  if (role === "reviewer") {
    return RETURNS.filter((r) => r.reviewer === "Priya Shah");
  }
  return RETURNS;
}
