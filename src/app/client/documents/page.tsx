"use client";

import { useMemo, useState } from "react";
import { RETURNS } from "@/data/returns";
import { docsFor } from "@/data/documents";
import { TASKS } from "@/data/tasks";
import { fmtDate, fmtRelative } from "@/data/constants";
import { Badge, Btn, Card, SectionTitle } from "@/components/common/ui";
import { StateChip } from "@/components/field/Value";
import { useStore } from "@/lib/store";

// The client sees what they sent, what is still wanted, and nothing about
// extraction internals beyond whether it worked.
export default function ClientDocuments() {
  const { me, context, uploaded, upload, tasksDone, toggleTask } = useStore();
  const clientId = context === "personal" ? "c-reyes" : me.clientId;
  const ret = useMemo(
    () => RETURNS.find((r) => r.clientId === clientId) ?? RETURNS[0],
    [clientId],
  );

  const [showAll, setShowAll] = useState(false);
  const docs = docsFor(ret.id);
  const mine = docs.filter((d) => d.uploadedBy !== "Marcus Reyes");
  const shown = showAll ? mine : mine.slice(0, 12);

  const wanted = TASKS.filter(
    (t) => t.returnId === ret.id && t.kind === "upload" && !(tasksDone[t.id] ?? t.done),
  );

  return (
    <div className="mx-auto max-w-[820px] p-5 space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">Your documents</h1>
        <p className="text-[14px] text-ink-2">
          {uploaded.length + mine.length} on file for 2025.
        </p>
      </div>

      {wanted.length > 0 && (
        <Card className="border-caution-line bg-caution-soft/50">
          <SectionTitle sub="Your preparer asked for these. Everything else can wait.">
            Still needed from you
          </SectionTitle>
          <ul className="space-y-2">
            {wanted.map((t) => (
              <li key={t.id} className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-ink">{t.title}</p>
                  {t.detail && <p className="text-[13px] text-ink-2">{t.detail}</p>}
                  <p
                    className={`text-[12px] ${
                      new Date(t.dueOn) < new Date("2026-03-10T09:00:00")
                        ? "text-blocked"
                        : "text-ink-3"
                    }`}
                  >
                    Asked for {fmtRelative(new Date(t.dueOn))}
                  </p>
                </div>
                <Btn
                  variant="primary"
                  onClick={() => {
                    upload(t.title);
                    toggleTask(t.id, true);
                  }}
                >
                  Upload
                </Btn>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <SectionTitle
          sub="Everything you have sent. Tap one to see how it was read."
          right={
            <Btn size="sm" onClick={() => upload(`Scan ${uploaded.length + 1}.pdf`)}>
              Add a document
            </Btn>
          }
        >
          On file
        </SectionTitle>

        <ul className="divide-y divide-line">
          {uploaded.map((name, i) => (
            <li key={`up-${i}`} className="flex items-center gap-3 py-2">
              <span className="min-w-0 flex-1 truncate text-[13.5px] text-ink">{name}</span>
              <Badge tone="accent">Just uploaded</Badge>
              <StateChip state="ai-suggested" small />
            </li>
          ))}
          {shown.map((d) => (
            <li key={d.id} className="flex items-center gap-3 py-2">
              <span className="min-w-0 flex-1 truncate text-[13.5px] text-ink">{d.title}</span>
              {d.status === "unreadable" || d.status === "needs-review" ? (
                <Badge tone="caution">We had trouble reading this</Badge>
              ) : (
                <Badge tone="done">Read successfully</Badge>
              )}
              <span className="w-16 shrink-0 text-right text-[12px] text-ink-3">
                {fmtDate(new Date(d.uploadedOn))}
              </span>
            </li>
          ))}
        </ul>

        {mine.length > 12 && (
          <button
            onClick={() => setShowAll((s) => !s)}
            className="mt-3 w-full rounded border border-line py-1.5 text-[13px] text-ink-2 hover:bg-sunken"
          >
            {showAll ? "Show fewer" : `Show all ${mine.length}`}
          </button>
        )}
      </Card>
    </div>
  );
}
