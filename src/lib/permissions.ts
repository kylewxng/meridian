import type { RoleKey } from "@/data/types";

export type Capability =
  | "view.firm"
  | "view.allReturns"
  | "edit.returnFields"
  | "review.signOff"
  | "return.efile"
  | "message.client"
  | "note.internal"
  | "assign.staff"
  | "view.billing"
  | "doc.upload"
  | "return.approve";

// Deny reasons are part of the UI, not just the logic. A disabled control that
// cannot say why is the same as a broken one.
type Grant = { allowed: true } | { allowed: false; reason: string; hide?: boolean };

const ALLOW: Grant = { allowed: true };

const MATRIX: Record<RoleKey, Partial<Record<Capability, Grant>>> = {
  individual: {
    "doc.upload": ALLOW,
    "return.approve": ALLOW,
  },
  business: {
    "doc.upload": ALLOW,
    "return.approve": ALLOW,
  },
  preparer: {
    "view.firm": ALLOW,
    "view.allReturns": {
      allowed: false,
      reason: "Preparers see returns assigned to them or their clients.",
    },
    "edit.returnFields": ALLOW,
    "review.signOff": {
      allowed: false,
      reason: "A preparer cannot review their own work. Send it to a reviewer.",
    },
    "return.efile": {
      allowed: false,
      reason: "E-filing unlocks after a reviewer signs off.",
    },
    "message.client": ALLOW,
    "note.internal": ALLOW,
    "assign.staff": { allowed: false, reason: "Only administrators assign work.", hide: true },
    "view.billing": { allowed: false, reason: "Billing is administrator only.", hide: true },
    "doc.upload": ALLOW,
  },
  reviewer: {
    "view.firm": ALLOW,
    "view.allReturns": ALLOW,
    "edit.returnFields": ALLOW,
    "review.signOff": ALLOW,
    "return.efile": {
      allowed: false,
      reason: "Reviewers approve the return. An administrator transmits it.",
    },
    "message.client": ALLOW,
    "note.internal": ALLOW,
    "assign.staff": { allowed: false, reason: "Only administrators assign work.", hide: true },
    "view.billing": { allowed: false, reason: "Billing is administrator only.", hide: true },
    "doc.upload": ALLOW,
  },
  admin: {
    "view.firm": ALLOW,
    "view.allReturns": ALLOW,
    "edit.returnFields": {
      allowed: false,
      reason: "Administrators manage the firm, not the figures on a return.",
    },
    "review.signOff": {
      allowed: false,
      reason: "Sign-off requires a credentialed reviewer.",
    },
    "return.efile": ALLOW,
    "message.client": ALLOW,
    "note.internal": ALLOW,
    "assign.staff": ALLOW,
    "view.billing": ALLOW,
    "doc.upload": ALLOW,
  },
  seasonal: {
    "view.firm": ALLOW,
    "view.allReturns": {
      allowed: false,
      reason: "Seasonal staff see only the returns assigned to them.",
    },
    "edit.returnFields": ALLOW,
    "review.signOff": {
      allowed: false,
      reason: "Sign-off requires a credentialed reviewer.",
    },
    "return.efile": { allowed: false, reason: "Seasonal staff cannot transmit returns." },
    "message.client": {
      allowed: false,
      reason: "Client contact goes through the assigned preparer.",
    },
    "note.internal": ALLOW,
    "assign.staff": { allowed: false, reason: "Only administrators assign work.", hide: true },
    "view.billing": { allowed: false, reason: "Billing is administrator only.", hide: true },
    "doc.upload": ALLOW,
  },
};

export function can(role: RoleKey, cap: Capability): Grant {
  return MATRIX[role]?.[cap] ?? { allowed: false, reason: "Not available for this role." };
}

export function allowed(role: RoleKey, cap: Capability) {
  return can(role, cap).allowed;
}

// Hide only what would be noise for the role. Everything a peer role can do but
// this one cannot stays visible and disabled, so the boundary is learnable.
export function hidden(role: RoleKey, cap: Capability) {
  const g = can(role, cap);
  return !g.allowed && Boolean(g.hide);
}

export function denyReason(role: RoleKey, cap: Capability) {
  const g = can(role, cap);
  return g.allowed ? "" : g.reason;
}
