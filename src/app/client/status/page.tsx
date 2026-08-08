"use client";

import { useMemo } from "react";
import { RETURNS } from "@/data/returns";
import { STAGES, fmtDateLong, fmtRelative, money } from "@/data/constants";
import StageRail from "@/components/status/StageRail";
import { Badge, Card, SectionTitle } from "@/components/common/ui";
import { useStore } from "@/lib/store";

// The client view of status leaves out substage, SLA age, and internal owner
// names. It keeps stage, owner, and blocker, because those three are what the
// question "how is my return going" actually means.
export default function ClientStatus() {
  const { me, context } = useStore();
  const clientId = context === "personal" ? "c-reyes" : me.clientId;
  const ret = useMemo(
    () => RETURNS.find((r) => r.clientId === clientId) ?? RETURNS[0],
    [clientId],
  );

  const currentIdx = STAGES.findIndex((s) => s.key === ret.status.stage);

  return (
    <div className="mx-auto max-w-[760px] p-5 space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">Your 2025 return</h1>
        <p className="text-[14px] text-ink-2">
          Prepared by {ret.assignedTo} · {ret.entity} · due{" "}
          {fmtDateLong(new Date(ret.dueOn))}
        </p>
      </div>

      <Card>
        <StageRail status={ret.status} audience="client" clientName="you" />
      </Card>

      <Card>
        <SectionTitle sub="Everything that has happened, in order.">History</SectionTitle>
        <ol className="mt-1">
          {STAGES.map((s, i) => {
            const done = i < currentIdx;
            const now = i === currentIdx;
            const future = i > currentIdx;
            return (
              <li key={s.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${
                      done
                        ? "bg-done text-white"
                        : now
                          ? "bg-accent text-white"
                          : "border border-line bg-surface text-ink-3"
                    }`}
                  >
                    {done ? "✓" : s.n}
                  </span>
                  {i < STAGES.length - 1 && (
                    <span
                      className={`w-px flex-1 ${done ? "bg-done" : "bg-line"}`}
                      style={{ minHeight: 22 }}
                    />
                  )}
                </div>
                <div className="pb-4">
                  <p
                    className={`text-[14px] ${
                      now ? "font-semibold text-ink" : future ? "text-ink-3" : "text-ink"
                    }`}
                  >
                    {s.label}
                    {now && (
                      <span className="ml-2">
                        <Badge tone="accent">Here now</Badge>
                      </span>
                    )}
                  </p>
                  <p className="text-[13px] leading-snug text-ink-2">{s.clientBlurb}</p>
                  {now && (
                    <p className="mt-0.5 text-[12px] text-ink-3">
                      Started {fmtRelative(new Date(ret.status.since))}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      <Card>
        <SectionTitle>What we expect at the end</SectionTitle>
        <div className="flex items-baseline gap-2">
          <span className="tnum text-[26px] font-semibold text-done">
            {money(Math.abs(ret.refund))}
          </span>
          <span className="text-[14px] text-ink-2">
            {ret.refund >= 0 ? "estimated refund" : "estimated balance due"}
          </span>
        </div>
        <p className="mt-1.5 text-[13px] text-ink-2">
          This moves while the return is being prepared. It is final once you approve and we
          file.
        </p>
      </Card>
    </div>
  );
}
