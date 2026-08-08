// The whole app runs off a frozen clock. Real dates would make the demo drift
// and would break hydration, since the server and client would disagree.
export const TODAY = new Date("2026-03-10T09:00:00");

export const FILING_DEADLINE = new Date("2026-04-15T00:00:00");

export const TAX_YEAR = 2025;

export function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function daysFromToday(d: Date) {
  return daysBetween(TODAY, d);
}

export function addDays(d: Date, n: number) {
  return new Date(d.getTime() + n * 86400000);
}

export function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function fmtDateLong(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtRelative(d: Date) {
  const diff = daysFromToday(d);
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff === -1) return "yesterday";
  if (diff < 0) return `${Math.abs(diff)} days ago`;
  return `in ${diff} days`;
}

export function money(n: number, opts: { cents?: boolean } = {}) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts.cents ? 2 : 0,
    maximumFractionDigits: opts.cents ? 2 : 0,
  });
}

// The six stages are the shared vocabulary. Clients and staff see the same
// six names in the same order. Only the substage detail differs.
export const STAGES = [
  {
    key: "gathering",
    n: 1,
    label: "Gathering documents",
    clientBlurb: "We're collecting the paperwork needed to start.",
    staffBlurb: "Intake and document collection.",
  },
  {
    key: "preparing",
    n: 2,
    label: "Preparing return",
    clientBlurb: "Your preparer is building the return.",
    staffBlurb: "Data entry, extraction review, schedule assembly.",
  },
  {
    key: "questions",
    n: 3,
    label: "Open questions",
    clientBlurb: "We need a few answers before we can finish.",
    staffBlurb: "Blocked on client response.",
  },
  {
    key: "review",
    n: 4,
    label: "Firm review",
    clientBlurb: "A second preparer is checking the work.",
    staffBlurb: "Reviewer queue, sign-off pending.",
  },
  {
    key: "approval",
    n: 5,
    label: "Your approval",
    clientBlurb: "Read it over and approve, then we file.",
    staffBlurb: "Awaiting client e-signature.",
  },
  {
    key: "filed",
    n: 6,
    label: "Filed",
    clientBlurb: "Submitted to the IRS. Nothing left to do.",
    staffBlurb: "Accepted by the IRS.",
  },
] as const;

export type StageKey = (typeof STAGES)[number]["key"];

export function stage(key: StageKey) {
  return STAGES.find((s) => s.key === key)!;
}
