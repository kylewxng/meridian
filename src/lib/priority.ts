import { TODAY, daysBetween } from "@/data/constants";
import type { TaxReturn } from "@/data/types";

export type Ranked = {
  ret: TaxReturn;
  score: number;
  reasons: string[];
  // The one thing to do next, not a status label.
  nextAction: string;
  actionOwner: "you" | "client" | "reviewer" | "irs";
};

const days = (n: number) => `${n} day${n === 1 ? "" : "s"}`;

const W = {
  deadline: 34,
  blocked: 18,
  reviewSla: 22,
  clientWait: 14,
  risk: 8,
  money: 6,
};

// Scoring is deliberately readable rather than clever. Every term that fires
// also pushes a sentence into reasons, so a row can always explain its rank.
export function rank(ret: TaxReturn): Ranked {
  let score = 0;
  const reasons: string[] = [];

  const daysToDue = daysBetween(TODAY, new Date(ret.dueOn));
  if (daysToDue < 0) {
    score += W.deadline;
    reasons.push(`Past due by ${days(Math.abs(daysToDue))}`);
  } else if (daysToDue <= 3) {
    score += W.deadline * 0.9;
    reasons.push(daysToDue === 0 ? "Due today" : `Due in ${days(daysToDue)}`);
  } else if (daysToDue <= 7) {
    score += W.deadline * 0.6;
    reasons.push(`Due in ${days(daysToDue)}`);
  } else if (daysToDue <= 14) {
    score += W.deadline * 0.3;
    reasons.push(`Due in ${days(daysToDue)}`);
  } else if (ret.extended) {
    reasons.push("On extension");
  }

  const blocker = ret.status.blockers[0];
  if (blocker) {
    const age = Math.abs(daysBetween(new Date(blocker.since), TODAY));
    // Something blocked and aging is worse than something merely blocked.
    score += Math.min(W.blocked, age * 1.4);
    if (age >= 7) reasons.push(`${blocker.label} for ${days(age)}`);
    else reasons.push(blocker.label);
  }

  if (ret.status.stage === "review" && ret.inReviewSince) {
    const age = Math.abs(daysBetween(new Date(ret.inReviewSince), TODAY));
    if (age > 5) {
      score += Math.min(W.reviewSla, (age - 5) * 4);
      reasons.push(`Sitting in review ${days(age)}`);
    }
  }

  if (ret.lastClientReplyOn && ret.status.owner === "firm") {
    const age = Math.abs(daysBetween(new Date(ret.lastClientReplyOn), TODAY));
    if (age <= 3) {
      // The client just did their part. Losing that momentum is expensive.
      score += W.clientWait;
      reasons.push(`Client replied ${age === 0 ? "today" : `${days(age)} ago`}`);
    }
  }

  if (ret.lowConfidenceFields > 0) {
    score += Math.min(W.risk, ret.lowConfidenceFields * 2);
    reasons.push(
      `${ret.lowConfidenceFields} field${ret.lowConfidenceFields > 1 ? "s" : ""} below confidence`,
    );
  }

  if (ret.riskFlags.length) {
    score += ret.riskFlags.length * 2;
    reasons.push(ret.riskFlags[0]);
  }

  if (Math.abs(ret.refund) > 10000) {
    score += W.money;
    reasons.push(
      ret.refund > 0 ? "Large refund at stake" : "Large balance due",
    );
  }

  if (ret.assignedTo === "Unassigned") {
    score += 12;
    reasons.push("Nobody assigned");
  }

  if (ret.status.stage === "filed") {
    score = Math.min(score, 4);
  }

  const { nextAction, actionOwner } = nextStep(ret);

  return { ret, score: Math.round(score), reasons: reasons.slice(0, 3), nextAction, actionOwner };
}

function nextStep(ret: TaxReturn): { nextAction: string; actionOwner: Ranked["actionOwner"] } {
  const b = ret.status.blockers[0];
  if (b?.owner === "client") return { nextAction: "Nudge the client", actionOwner: "client" };
  if (b?.owner === "irs") return { nextAction: "Wait on the IRS", actionOwner: "irs" };

  switch (ret.status.stage) {
    case "gathering":
      return { nextAction: "Request documents", actionOwner: "client" };
    case "preparing":
      return { nextAction: "Continue preparing", actionOwner: "you" };
    case "questions":
      return { nextAction: "Follow up on questions", actionOwner: "client" };
    case "review":
      return { nextAction: "Review and sign off", actionOwner: "reviewer" };
    case "approval":
      return { nextAction: "Chase the signature", actionOwner: "client" };
    default:
      return { nextAction: "Nothing needed", actionOwner: "irs" };
  }
}

export function rankAll(rets: TaxReturn[]): Ranked[] {
  return rets.map(rank).sort((a, b) => b.score - a.score);
}

export function band(score: number): "now" | "soon" | "later" {
  if (score >= 45) return "now";
  if (score >= 22) return "soon";
  return "later";
}
