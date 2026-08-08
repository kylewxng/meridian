"use client";

import { use } from "react";
import Link from "next/link";
import { getReturn } from "@/data/returns";
import { docsFor } from "@/data/documents";
import { findingsFor } from "@/data/aiFindings";
import { tasksFor } from "@/data/tasks";
import { threadsFor } from "@/data/threads";
import { fmtDate, fmtRelative, money } from "@/data/constants";
import StageRail from "@/components/status/StageRail";
import { Badge, Btn, Card, Empty, GatedBtn, SectionTitle } from "@/components/common/ui";
import { ConfidenceChip } from "@/components/ai/AiCard";
import { useStore } from "@/lib/store";
import { allowed, denyReason } from "@/lib/permissions";
import { rank } from "@/lib/priority";

export default function ReturnOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { me, tasksDone, toggleTask, findingStatus } = useStore();
  const ret = getReturn(id);
  if (!ret) return null;

  const docs = docsFor(id);
  const findings = findingsFor(id).filter((f) => (findingStatus[f.id] ?? f.status) === "open");
  const tasks = tasksFor(id).filter((t) => !(tasksDone[t.id] ?? t.done));
  const threads = threadsFor(id).filter((t) => !t.resolved);
  const ranked = rank(ret);

  return (
    <div className="grid grid-cols-[1fr_340px] gap-4 p-4 items-start">
      <div className="space-y-4 min-w-0">
        <Card>
          <SectionTitle sub="The same six stages the client sees, with the internal detail added.">
            Where this return stands
          </SectionTitle>
          <StageRail status={ret.status} audience="firm" />
        </Card>

        <Card pad={false}>
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <div>
              <h2 className="text-[13px] font-semibold">Open work</h2>
              <p className="text-[12px] text-ink-3">
                {tasks.length} item{tasks.length === 1 ? "" : "s"}, ordered by who is holding
                things up.
              </p>
            </div>
            <Badge tone={ranked.score >= 45 ? "blocked" : "neutral"}>
              Priority score {ranked.score}
            </Badge>
          </div>
          {tasks.length === 0 ? (
            <div className="p-4">
              <Empty title="Nothing outstanding" />
            </div>
          ) : (
            <ul>
              {tasks
                .slice()
                .sort((a, b) => +new Date(a.dueOn) - +new Date(b.dueOn))
                .map((t) => {
                  const overdue = new Date(t.dueOn) < new Date("2026-03-10T09:00:00");
                  return (
                    <li
                      key={t.id}
                      className="flex items-start gap-2.5 border-b border-line px-4 py-2.5 last:border-0"
                    >
                      <input
                        type="checkbox"
                        checked={tasksDone[t.id] ?? t.done}
                        onChange={(e) => toggleTask(t.id, e.target.checked)}
                        className="mt-0.5 h-3.5 w-3.5 accent-[#0e6e6e]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] text-ink">{t.title}</p>
                        {t.detail && (
                          <p className="text-[12px] leading-snug text-ink-3">{t.detail}</p>
                        )}
                      </div>
                      <Badge tone={t.owner === "client" ? "caution" : "accent"}>
                        {t.owner === "client" ? "Client" : t.assignedTo}
                      </Badge>
                      <span
                        className={`shrink-0 text-[11.5px] ${overdue ? "text-blocked" : "text-ink-3"}`}
                      >
                        {fmtRelative(new Date(t.dueOn))}
                      </span>
                    </li>
                  );
                })}
            </ul>
          )}
        </Card>

        {findings.length > 0 && (
          <Card pad={false}>
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <div>
                <h2 className="text-[13px] font-semibold">What the AI wants you to look at</h2>
                <p className="text-[12px] text-ink-3">
                  Summarised here, decided on the findings tab.
                </p>
              </div>
              <Btn size="sm" href={`/firm/returns/${id}/issues`}>
                Open all {findings.length}
              </Btn>
            </div>
            <ul>
              {findings.slice(0, 3).map((f) => (
                <li key={f.id} className="border-b border-line last:border-0">
                  <Link
                    href={`/firm/returns/${id}/issues?finding=${f.id}`}
                    className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-sunken transition-colors"
                  >
                    <span className="mt-0.5 text-[11px] text-ai">◆</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] text-ink">{f.title}</p>
                      <p className="truncate text-[12px] text-ink-3">{f.whatItDid}</p>
                    </div>
                    <ConfidenceChip confidence={f.confidence} score={f.confidenceScore} />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      <div className="space-y-3">
        <Card>
          <SectionTitle>Move it forward</SectionTitle>
          <div className="flex flex-col gap-2 items-start">
            <Btn href={`/firm/returns/${id}/review`} variant="primary" className="w-full">
              Open the return for review
            </Btn>
            <GatedBtn
              allowed={allowed(me.role, "review.signOff")}
              reason={denyReason(me.role, "review.signOff")}
              className="w-full"
            >
              Sign off as reviewer
            </GatedBtn>
            <GatedBtn
              allowed={allowed(me.role, "return.efile")}
              reason={denyReason(me.role, "return.efile")}
              className="w-full"
            >
              Transmit to the IRS
            </GatedBtn>
          </div>
        </Card>

        <Card>
          <SectionTitle>At a glance</SectionTitle>
          <dl className="space-y-1.5 text-[12.5px]">
            <Row k="Entity">{ret.entity}</Row>
            <Row k="Preparer">{ret.assignedTo}</Row>
            <Row k="Reviewer">{ret.reviewer}</Row>
            <Row k="Due">
              {fmtDate(new Date(ret.dueOn))} · {fmtRelative(new Date(ret.dueOn))}
            </Row>
            <Row k="Complexity">{ret.complexity}</Row>
            <Row k="Documents">
              <Link
                href={`/firm/returns/${id}/documents`}
                className="text-accent hover:underline"
              >
                {docs.length.toLocaleString()}
              </Link>
            </Row>
            <Row k="Open threads">
              <Link
                href={`/firm/returns/${id}/messages`}
                className="text-accent hover:underline"
              >
                {threads.length}
              </Link>
            </Row>
            <Row k={ret.refund >= 0 ? "Refund" : "Balance due"}>
              {money(Math.abs(ret.refund))}
            </Row>
          </dl>
        </Card>

        {ret.riskFlags.length > 0 && (
          <Card>
            <SectionTitle sub="Noted during preparation. Not necessarily problems.">
              Flags on this return
            </SectionTitle>
            <ul className="space-y-1">
              {ret.riskFlags.map((r) => (
                <li key={r} className="flex gap-1.5 text-[12.5px] text-ink-2">
                  <span className="text-caution">▲</span>
                  {r}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-3">{k}</dt>
      <dd className="text-ink text-right">{children}</dd>
    </div>
  );
}
