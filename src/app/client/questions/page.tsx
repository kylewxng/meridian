"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RETURNS } from "@/data/returns";
import { QUESTIONS } from "@/data/tasks";
import { getDoc } from "@/data/documents";
import { Badge, Btn, Card } from "@/components/common/ui";
import { StateChip } from "@/components/field/Value";
import { useStore } from "@/lib/store";

// A question that came from a document links straight to it, and the trip back
// is handled by the workflow pill rather than the browser back button.
export default function ClientQuestions() {
  const { me, context, answers, answer, pushWorkflow } = useStore();
  const router = useRouter();
  const clientId = context === "personal" ? "c-reyes" : me.clientId;
  const ret = useMemo(
    () => RETURNS.find((r) => r.clientId === clientId) ?? RETURNS[0],
    [clientId],
  );

  const qs = QUESTIONS.filter((q) => q.returnId === ret.id);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const done = qs.filter((q) => q.answer || answers[q.id]).length;

  return (
    <div className="mx-auto max-w-[720px] p-5 space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">Questions for you</h1>
        <p className="text-[14px] text-ink-2">
          {done} of {qs.length} answered. Short answers are fine.
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${qs.length ? (done / qs.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {qs.map((q, i) => {
        const saved = answers[q.id] ?? q.answer;
        const doc = q.linkedDocId ? getDoc(q.linkedDocId) : undefined;
        return (
          <Card key={q.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] text-ink-3">
                  {i + 1} of {qs.length} · {q.category}
                  {q.required && <span className="ml-1.5 text-blocked">required</span>}
                </p>
                <h2 className="mt-0.5 text-[16px] font-semibold leading-snug">{q.prompt}</h2>
                {q.helper && <p className="mt-1 text-[13.5px] text-ink-2">{q.helper}</p>}
              </div>
              {saved && <StateChip state="client-answer" />}
            </div>

            {doc && (
              <button
                onClick={() => {
                  // Leave a way back before jumping to the document.
                  pushWorkflow({
                    label: `question ${i + 1} of ${qs.length}`,
                    href: "/client/questions",
                    kind: "question",
                  });
                  router.push(`/client/documents`);
                }}
                className="mt-2 inline-flex items-center gap-1.5 rounded border border-line px-2 py-1 text-[12.5px] text-ink-2 hover:border-accent-line hover:bg-accent-soft hover:text-accent transition-colors"
              >
                <span className="rounded bg-sunken px-1 text-[10px]">document</span>
                {doc.title}
                <span>→</span>
              </button>
            )}

            {saved ? (
              <div className="mt-3 rounded border border-accent-line bg-accent-soft/50 px-3 py-2">
                <p className="text-[13.5px] text-ink">{saved}</p>
                <button
                  onClick={() => {
                    setDraft((d) => ({ ...d, [q.id]: saved }));
                    answer(q.id, "");
                  }}
                  className="mt-1 text-[12px] text-accent underline"
                >
                  Change my answer
                </button>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <textarea
                  rows={2}
                  value={draft[q.id] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [q.id]: e.target.value }))}
                  placeholder="Type your answer"
                  className="flex-1 resize-none rounded border border-line bg-surface px-2.5 py-1.5 text-[13.5px] outline-none focus:border-accent"
                />
                <div className="flex flex-col gap-1.5">
                  <Btn
                    variant="primary"
                    onClick={() => draft[q.id]?.trim() && answer(q.id, draft[q.id].trim())}
                    disabled={!draft[q.id]?.trim()}
                  >
                    Save
                  </Btn>
                  <Btn size="sm" variant="ghost" onClick={() => answer(q.id, "Not sure")}>
                    Not sure
                  </Btn>
                </div>
              </div>
            )}
          </Card>
        );
      })}

      {done === qs.length && qs.length > 0 && (
        <div className="rounded-lg border border-done-line bg-done-soft p-4 text-center">
          <p className="text-[15px] font-semibold text-done">All answered</p>
          <p className="mt-0.5 text-[13.5px] text-ink-2">
            Your preparer gets these right away. Nothing else is needed from you.
          </p>
          <Badge tone="done">Back to you if anything comes up</Badge>
        </div>
      )}
    </div>
  );
}
