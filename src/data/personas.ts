import type { Persona } from "./types";

export const PERSONAS: Persona[] = [
  {
    id: "dana",
    name: "Dana Whitfield",
    initials: "DW",
    role: "individual",
    roleLabel: "Individual taxpayer",
    side: "client",
    blurb: "First time in the product. Nothing uploaded yet.",
    clientId: "c-whitfield",
    firstRun: true,
  },
  {
    id: "ray",
    name: "Ray Okonkwo",
    initials: "RO",
    role: "business",
    roleLabel: "Business owner",
    side: "client",
    blurb: "S-corp plus a personal return. Mid-season, several open items.",
    clientId: "c-okonkwo",
  },
  {
    id: "marcus",
    name: "Marcus Reyes",
    initials: "MR",
    role: "preparer",
    roleLabel: "Tax preparer",
    side: "firm",
    blurb: "Owns 34 returns. Also has a personal 1040 with the firm.",
    // The dual-context case. Marcus is staff and a client of his own firm.
    personalReturnId: "r-0007",
    clientId: "c-reyes",
  },
  {
    id: "priya",
    name: "Priya Shah",
    initials: "PS",
    role: "reviewer",
    roleLabel: "Reviewer",
    side: "firm",
    blurb: "Signs off on prepared returns. Cannot e-file.",
  },
  {
    id: "lena",
    name: "Lena Ortiz",
    initials: "LO",
    role: "admin",
    roleLabel: "Firm administrator",
    side: "firm",
    blurb: "Sees every return and staff load. Cannot change return figures.",
  },
  {
    id: "tim",
    name: "Tim Boyd",
    initials: "TB",
    role: "seasonal",
    roleLabel: "Seasonal staff",
    side: "firm",
    blurb: "Data entry on assigned returns only. No client contact.",
  },
];

export function persona(id: string) {
  return PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];
}
