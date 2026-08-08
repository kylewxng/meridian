"use client";

import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { findingsFor } from "@/data/aiFindings";
import AiCard from "@/components/ai/AiCard";
import DocViewer from "@/components/trace/DocViewer";
import { Badge, Card, Empty, SectionTitle } from "@/components/common/ui";
import { useStore } from "@/lib/store";
import type { SourceRef } from "@/data/types";

const SEV_TONE = { high: "blocked", medium: "caution", low: "neutral" } as const;

export default function IssuesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const sp = useSearchParams();
  const router = useRouter();
  const { findingStatus } = useStore();
  const [evidence, setEvidence] = useState<SourceRef | null>(null);
  const [showDone, setShowDone] = useState(false);

  const all = findingsFor(id);
  const open = all.filter((f) => (findingStatus[f.id] ?? f.status) === "open");
  const closed = all.filter((f) => (findingStatus[f.id] ?? f.status) !== "open");
  const list = showDone ? all : open;
  const focus = sp.get("finding");

  const showEvidence = (s: SourceRef) => {
    setEvidence(s);
    const p = new URLSearchParams(sp.toString());
    p.set("doc", s.docId);
    p.set("page", String(s.page));
    p.set("region", s.regionId);
    router.replace(`/firm/returns/${id}/issues?${p.toString()}`, { scroll: false });
  };

  return (
    <div className="flex h-[calc(100vh-6.25rem)] min-h-0">
      <section className="w-[560px] shrink-0 overflow-y-auto border-r border-line p-4 space-y-3">
        <Card>
          <SectionTitle
            sub="Nothing here changes the return until a person accepts it."
            right={
              <div className="flex items-center gap-1.5">
                <Badge tone={open.length ? "caution" : "done"}>{open.length} open</Badge>
                {closed.length > 0 && (
                  <button
                    onClick={() => setShowDone((s) => !s)}
                    className="text-[11.5px] text-ink-3 underline decoration-dotted underline-offset-2 hover:text-ink-2"
                  >
                    {showDone ? "Hide" : "Show"} {closed.length} decided
                  </button>
                )}
              </div>
            }
          >
            What the AI found
          </SectionTitle>
          <p className="text-[12.5px] leading-snug text-ink-2">
            Each finding says what it did, why, and what it is unsure about. The evidence
            opens on the right so you can check it against the paperwork before deciding.
          </p>
        </Card>

        {list.length === 0 ? (
          <Empty
            title="Everything has been decided"
            sub="Accept, correct, or dismiss puts a finding here."
          />
        ) : (
          <div className="space-y-2.5">
            {list
              .slice()
              .sort((a, b) => sevRank(b.severity) - sevRank(a.severity))
              .map((f) => (
                <div
                  key={f.id}
                  className={focus === f.id ? "rounded-lg ring-2 ring-accent" : ""}
                >
                  <div className="mb-1 flex items-center gap-1.5">
                    <Badge tone={SEV_TONE[f.severity]}>{f.severity} severity</Badge>
                    {f.fieldId && (
                      <button
                        onClick={() =>
                          router.push(`/firm/returns/${id}/review?field=${f.fieldId}`)
                        }
                        className="text-[11.5px] text-accent hover:underline"
                      >
                        Go to the line on the return →
                      </button>
                    )}
                  </div>
                  <AiCard finding={f} onEvidence={showEvidence} />
                </div>
              ))}
          </div>
        )}
      </section>

      <section className="min-w-0 flex-1">
        <DocViewer
          key={`${evidence?.docId}-${evidence?.regionId}`}
          docId={sp.get("doc")}
          page={Number(sp.get("page") ?? 1)}
          region={sp.get("region")}
          onPage={(p) => {
            const nsp = new URLSearchParams(sp.toString());
            nsp.set("page", String(p));
            router.replace(`/firm/returns/${id}/issues?${nsp.toString()}`, { scroll: false });
          }}
        />
      </section>
    </div>
  );
}

function sevRank(s: string) {
  return s === "high" ? 3 : s === "medium" ? 2 : 1;
}
