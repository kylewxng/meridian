import { DOCUMENTS } from "@/data/documents";
import { FIELDS } from "@/data/provenance";
import { RETURNS } from "@/data/returns";
import { QUESTIONS, TASKS } from "@/data/tasks";
import { THREADS } from "@/data/threads";
import { FINDINGS } from "@/data/aiFindings";

export type Hit = {
  kind: "Return" | "Document" | "Question" | "Task" | "Message" | "Field" | "AI finding";
  id: string;
  title: string;
  sub: string;
  href: string;
};

// Built once at module load. The palette searches everything at once because
// people remember what a thing was about, not which list it lives in.
const INDEX: Hit[] = [
  ...RETURNS.map((r) => ({
    kind: "Return" as const,
    id: r.id,
    title: r.clientName,
    sub: `${r.entity} ${r.year} · ${r.assignedTo}`,
    href: `/firm/returns/${r.id}`,
  })),
  ...DOCUMENTS.map((d) => ({
    kind: "Document" as const,
    id: d.id,
    title: d.title,
    sub: `${d.kind} · ${d.issuer}`,
    href: `/firm/returns/${d.returnId}/documents?doc=${d.id}`,
  })),
  ...QUESTIONS.map((q) => ({
    kind: "Question" as const,
    id: q.id,
    title: q.prompt,
    sub: q.category,
    href: `/firm/returns/${q.returnId}/messages?q=${q.id}`,
  })),
  ...TASKS.map((t) => ({
    kind: "Task" as const,
    id: t.id,
    title: t.title,
    sub: `${t.owner === "client" ? "Client" : "Firm"} · ${t.assignedTo}`,
    href: `/firm/returns/${t.returnId}`,
  })),
  ...THREADS.map((t) => ({
    kind: "Message" as const,
    id: t.id,
    title: t.subject,
    sub: `About ${t.anchor.label}`,
    href: `/firm/returns/${t.returnId}/messages?thread=${t.id}`,
  })),
  ...FIELDS.map((f) => ({
    kind: "Field" as const,
    id: f.id,
    title: `${f.label} (line ${f.line})`,
    sub: f.schedule,
    href: `/firm/returns/r-0002/review?field=${f.id}`,
  })),
  ...FINDINGS.map((f) => ({
    kind: "AI finding" as const,
    id: f.id,
    title: f.title,
    sub: `${f.severity} severity`,
    href: `/firm/returns/${f.returnId}/issues?finding=${f.id}`,
  })),
];

export function search(q: string, limit = 24): Hit[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  const words = needle.split(/\s+/);

  const scored: { hit: Hit; score: number }[] = [];
  for (const hit of INDEX) {
    const hay = `${hit.title} ${hit.sub} ${hit.kind}`.toLowerCase();
    let score = 0;
    let all = true;
    for (const w of words) {
      const at = hay.indexOf(w);
      if (at < 0) {
        all = false;
        break;
      }
      score += at === 0 ? 8 : at < 20 ? 4 : 2;
    }
    if (all) scored.push({ hit, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.hit);
}

export const INDEX_SIZE = INDEX.length;
