"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import type { Relation } from "@/data/types";

const KIND_TONE: Record<string, string> = {
  document: "bg-sunken text-ink-2",
  field: "bg-done-soft text-done",
  question: "bg-caution-soft text-caution",
  task: "bg-sunken text-ink-2",
  issue: "bg-ai-soft text-ai",
  return: "bg-accent-soft text-accent",
};

// Every relation states why it is related. A bare list of links makes the user
// guess at the connection, which is the thing that loses their place.
export default function RelatedRail({
  items,
  from,
  title = "Connected to this",
}: {
  items: Relation[];
  // Where to come back to once the user follows a link out of here.
  from: { label: string; href: string; kind: string };
  title?: string;
}) {
  const { pushWorkflow } = useStore();
  const router = useRouter();

  if (!items.length) return null;

  return (
    <div className="rounded-lg border border-line bg-surface shadow-xs">
      <div className="border-b border-line px-3 py-2">
        <h3 className="text-[12px] font-semibold text-ink">{title}</h3>
        <p className="text-[11px] text-ink-3">
          Following one of these keeps a way back to {from.label}.
        </p>
      </div>
      <ul>
        {items.map((r) => (
          <li key={`${r.type}-${r.id}`} className="border-b border-line last:border-0">
            <button
              onClick={() => {
                pushWorkflow(from);
                router.push(r.href);
              }}
              className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-sunken transition-colors"
            >
              <span
                className={`mt-px shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${
                  KIND_TONE[r.type] ?? "bg-sunken text-ink-2"
                }`}
              >
                {r.type}
              </span>
              <span className="min-w-0">
                <span className="block text-[12.5px] text-ink leading-snug">{r.label}</span>
                <span className="block text-[11px] text-ink-3 leading-snug">{r.reason}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
