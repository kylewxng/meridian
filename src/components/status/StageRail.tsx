"use client";

import { STAGES, fmtRelative } from "@/data/constants";
import type { ReturnStatus } from "@/data/types";
import { Badge } from "@/components/common/ui";

const OWNER_LABEL = {
  client: "the client",
  firm: "the firm",
  irs: "the IRS",
} as const;

// The same six stages, the same order, the same words, for everyone. What
// changes by audience is how much substage detail sits under them.
export default function StageRail({
  status,
  audience,
  clientName = "you",
}: {
  status: ReturnStatus;
  audience: "client" | "firm";
  clientName?: string;
}) {
  const currentIdx = STAGES.findIndex((s) => s.key === status.stage);
  const owner = status.owner;
  const ownerText =
    audience === "client"
      ? owner === "client"
        ? `Waiting on ${clientName}`
        : owner === "firm"
          ? "Waiting on us"
          : "Waiting on the IRS"
      : `Waiting on ${OWNER_LABEL[owner]}`;

  return (
    <div>
      <ol className="flex items-stretch gap-1">
        {STAGES.map((s, i) => {
          const done = i < currentIdx;
          const now = i === currentIdx;
          return (
            <li key={s.key} className="min-w-0 flex-1">
              <div
                className={`h-1 rounded-full ${
                  done ? "bg-done" : now ? "bg-accent" : "bg-line"
                }`}
              />
              <p
                className={`mt-1.5 text-[11.5px] leading-tight ${
                  now ? "font-semibold text-ink" : done ? "text-ink-2" : "text-ink-3"
                }`}
                title={s.label}
              >
                {s.label}
              </p>
              {audience === "firm" && now && (
                <p className="truncate text-[10.5px] text-ink-3">{status.subStage}</p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] text-ink">
          <strong className="font-semibold">
            Stage {currentIdx + 1} of 6 · {STAGES[currentIdx].label}
          </strong>
        </span>
        <Badge tone={owner === "client" ? "caution" : owner === "irs" ? "neutral" : "accent"}>
          {ownerText}
        </Badge>
        <span className="text-[11.5px] text-ink-3">
          since {fmtRelative(new Date(status.since))}
        </span>
      </div>

      <p className="mt-1 text-[12.5px] leading-snug text-ink-2">
        {audience === "client"
          ? STAGES[currentIdx].clientBlurb
          : STAGES[currentIdx].staffBlurb}
      </p>

      {status.blockers.length > 0 && (
        <div className="mt-2.5 space-y-1.5">
          {status.blockers.map((b, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded border border-blocked-line bg-blocked-soft px-2.5 py-1.5"
            >
              <span className="mt-px text-[11px] text-blocked">●</span>
              <div className="min-w-0">
                <p className="text-[12.5px] font-medium text-blocked">{b.label}</p>
                <p className="text-[11.5px] text-ink-2">
                  Blocking since {fmtRelative(new Date(b.since))}. Owned by{" "}
                  {OWNER_LABEL[b.owner]}.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {status.blockers.length === 0 && status.stage !== "filed" && (
        <p className="mt-2.5 rounded border border-done-line bg-done-soft px-2.5 py-1.5 text-[12.5px] text-done">
          Nothing is blocking this return right now.
        </p>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: ReturnStatus }) {
  const s = STAGES.find((x) => x.key === status.stage)!;
  const tone =
    status.blockers.length > 0
      ? "blocked"
      : status.stage === "filed"
        ? "done"
        : status.owner === "client"
          ? "caution"
          : "accent";
  return (
    <Badge tone={tone} title={status.subStage}>
      {s.n}. {s.label}
    </Badge>
  );
}
