"use client";

import Link from "next/link";

export type Crumb = { label: string; href?: string; kind?: string };

// The object type is part of the crumb. "Whitfield, Dana" tells you less than
// "Return · Whitfield, Dana" when you are four levels into a workflow.
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1 text-[12px] flex-wrap">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        const body = (
          <span className={last ? "font-medium text-ink" : "text-ink-2 hover:text-ink"}>
            {c.kind && <span className="text-ink-3">{c.kind} · </span>}
            {c.label}
          </span>
        );
        return (
          <span key={i} className="flex items-center gap-1">
            {c.href && !last ? <Link href={c.href}>{body}</Link> : body}
            {!last && <span className="text-ink-3">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
