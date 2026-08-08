"use client";

import { useState } from "react";
import { getDoc } from "@/data/documents";
import { fmtRelative, money } from "@/data/constants";
import type { AiFinding, Confidence, SourceRef } from "@/data/types";
import { Btn } from "@/components/common/ui";
import { useStore } from "@/lib/store";

// Confidence gets said in words before it gets said in a number. A bare 71%
// invites people to invent their own threshold for what is safe.
const BANDS: Record<Confidence, { label: string; sub: string; cls: string; bar: string }> = {
  high: {
    label: "Confident",
    sub: "Clear source, cross-checked. Normal review is enough.",
    cls: "bg-done-soft text-done border-done-line",
    bar: "bg-done",
  },
  medium: {
    label: "Needs a look",
    sub: "The source is real but something about it is incomplete.",
    cls: "bg-caution-soft text-caution border-caution-line",
    bar: "bg-caution",
  },
  low: {
    label: "Do not rely on this",
    sub: "Treat as unconfirmed until a person checks the source.",
    cls: "bg-blocked-soft text-blocked border-blocked-line",
    bar: "bg-blocked",
  },
};

export function ConfidenceChip({
  confidence,
  score,
  showScore,
}: {
  confidence: Confidence;
  score: number;
  showScore?: boolean;
}) {
  const b = BANDS[confidence];
  return (
    <span
      title={b.sub}
      className={`inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[11px] font-medium ${b.cls}`}
    >
      <span className="inline-block h-1.5 w-8 overflow-hidden rounded-full bg-current/20">
        <span className={`block h-full rounded-full ${b.bar}`} style={{ width: `${score * 100}%` }} />
      </span>
      {b.label}
      {showScore && <span className="tnum opacity-70">{Math.round(score * 100)}%</span>}
    </span>
  );
}

export default function AiCard({
  finding,
  onEvidence,
  compact,
}: {
  finding: AiFinding;
  onEvidence?: (s: SourceRef) => void;
  compact?: boolean;
}) {
  const { findingStatus, setFinding, overrideField, me } = useStore();
  const status = findingStatus[finding.id] ?? finding.status;
  const [open, setOpen] = useState(false);
  const [correcting, setCorrecting] = useState(false);
  const [draft, setDraft] = useState(String(finding.suggestedValue ?? ""));
  const band = BANDS[finding.confidence];

  const accept = () => {
    setFinding(finding.id, "accepted");
    if (finding.fieldId && finding.suggestedValue !== undefined) {
      overrideField(finding.fieldId, {
        value: finding.suggestedValue,
        state: "verified",
        by: me.name,
        on: "just now",
        note: "Accepted the AI value as-is.",
      });
    }
  };

  const correct = () => {
    const n = Number(draft.replace(/[^0-9.-]/g, ""));
    if (Number.isNaN(n)) return;
    setFinding(finding.id, "corrected");
    if (finding.fieldId) {
      overrideField(finding.fieldId, {
        value: n,
        state: "verified",
        by: me.name,
        on: "just now",
        note: `Corrected from ${money(finding.suggestedValue ?? 0)}. AI will not suggest over this again.`,
      });
    }
    setCorrecting(false);
  };

  return (
    <div
      className={`rounded-lg border bg-surface overflow-hidden ${
        status === "open" ? "border-ai-line" : "border-line"
      }`}
    >
      <div className={`flex items-start gap-2.5 px-3 py-2.5 ${status === "open" ? "bg-ai-soft/40" : ""}`}>
        <span className="mt-0.5 text-[12px] text-ai" aria-hidden>
          ◆
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[13px] font-semibold text-ink">{finding.title}</h3>
            <ConfidenceChip confidence={finding.confidence} score={finding.confidenceScore} />
            {status !== "open" && (
              <span className="rounded border border-done-line bg-done-soft px-1.5 py-0.5 text-[10.5px] font-medium text-done">
                {status === "accepted" ? "Accepted" : status === "corrected" ? "Corrected by you" : "Dismissed"}
              </span>
            )}
          </div>

          {/* One line of what it did, then one line of why. Anything more
              detailed is behind the toggle. */}
          <p className="mt-1 text-[12.5px] leading-snug text-ink">{finding.whatItDid}</p>
          {!compact && (
            <p className="mt-1 text-[12px] leading-snug text-ink-2">{finding.why}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {finding.evidence.map((e, i) => {
              const doc = getDoc(e.docId);
              return (
                <button
                  key={i}
                  onClick={() => onEvidence?.(e)}
                  disabled={!onEvidence}
                  className="rounded border border-line bg-surface px-1.5 py-0.5 text-[11px] text-ink-2 hover:border-accent-line hover:bg-accent-soft hover:text-accent transition-colors disabled:opacity-60 disabled:hover:bg-surface disabled:hover:text-ink-2"
                  title={`${doc?.title ?? "Document"} · page ${e.page}`}
                >
                  {e.label}
                </button>
              );
            })}
          </div>

          {status === "open" && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {!correcting ? (
                <>
                  <Btn size="sm" variant="primary" onClick={accept}>
                    Accept
                  </Btn>
                  {finding.suggestedValue !== undefined && (
                    <Btn size="sm" onClick={() => setCorrecting(true)}>
                      Correct it
                    </Btn>
                  )}
                  <Btn size="sm" variant="ghost" onClick={() => setFinding(finding.id, "rejected")}>
                    Dismiss
                  </Btn>
                  <button
                    onClick={() => setOpen((o) => !o)}
                    className="ml-1 text-[11.5px] text-ink-3 underline decoration-dotted underline-offset-2 hover:text-ink-2"
                  >
                    {open ? "Hide the details" : "Why should I believe this?"}
                  </button>
                </>
              ) : (
                <div className="flex w-full items-center gap-2 rounded border border-accent bg-accent-soft/40 px-2 py-1.5">
                  <span className="text-[11.5px] text-ink-2">Correct value</span>
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && correct()}
                    className="tnum w-32 rounded border border-line bg-surface px-1.5 py-0.5 text-[12.5px] outline-none focus:border-accent"
                  />
                  <Btn size="sm" variant="primary" onClick={correct}>
                    Save
                  </Btn>
                  <Btn size="sm" variant="ghost" onClick={() => setCorrecting(false)}>
                    Cancel
                  </Btn>
                  <span className="ml-auto text-[11px] text-ink-3">
                    Your number wins. The AI will not overwrite it.
                  </span>
                </div>
              )}
            </div>
          )}

          {status !== "open" && (
            <button
              onClick={() => setFinding(finding.id, "open")}
              className="mt-2 text-[11.5px] text-ink-3 underline decoration-dotted underline-offset-2 hover:text-ink-2"
            >
              Undo
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-sunken/50 px-3 py-2.5 text-[12px] rise">
          <Row label="What is uncertain">{finding.uncertainty}</Row>
          <Row label="Confidence">
            {Math.round(finding.confidenceScore * 100)}% · {band.label.toLowerCase()}. {band.sub}
          </Row>
          <Row label="Recommended">{finding.suggestedAction}</Row>
          <Row label="Produced by">
            {finding.model}, ran {fmtRelative(new Date(finding.ranOn))}
          </Row>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-0.5">
      <span className="w-32 shrink-0 text-[11px] uppercase tracking-wide text-ink-3">
        {label}
      </span>
      <span className="text-ink-2 leading-snug">{children}</span>
    </div>
  );
}
