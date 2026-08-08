"use client";

import { getDoc } from "@/data/documents";
import { money } from "@/data/constants";
import type { ReturnField, SourceRef } from "@/data/types";

// The whole point of challenge 01: the chain from paperwork to the number on
// the return is a readable sequence, not a black box.
export default function DerivationPanel({
  field,
  value,
  activeSource,
  onSource,
}: {
  field: ReturnField;
  value: number;
  activeSource: SourceRef | null;
  onSource: (s: SourceRef) => void;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface shadow-xs overflow-hidden">
      <div className="border-b border-line px-3 py-2">
        <h3 className="text-[12px] font-semibold text-ink">How this number was reached</h3>
        <p className="text-[11px] text-ink-3">
          Every step, from the paperwork to the line on the return.
        </p>
      </div>

      <div className="px-3 py-2.5">
        <Label>{field.sources.length === 1 ? "Source" : `Sources (${field.sources.length})`}</Label>
        {field.sources.length === 0 ? (
          <p className="mt-1 text-[12px] text-ink-3">
            Nothing was extracted for this line. It comes entirely from the steps below.
          </p>
        ) : (
          <ul className="mt-1 space-y-1">
            {field.sources.map((s, i) => {
              const doc = getDoc(s.docId);
              const on =
                activeSource?.docId === s.docId &&
                activeSource?.regionId === s.regionId &&
                activeSource?.page === s.page;
              return (
                <li key={i}>
                  <button
                    onClick={() => onSource(s)}
                    className={`flex w-full items-center gap-2 rounded border px-2 py-1.5 text-left transition-colors ${
                      on
                        ? "border-accent bg-accent-soft"
                        : "border-line hover:border-line-strong hover:bg-sunken"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] text-ink">{s.label}</span>
                      <span className="block truncate text-[11px] text-ink-3">
                        {doc?.title ?? "Document unavailable"} · page {s.page}
                      </span>
                    </span>
                    <span
                      title={s.rawValue}
                      className="tnum max-w-[104px] shrink-0 truncate text-right text-[12px] font-medium text-ink"
                    >
                      {s.rawValue}
                    </span>
                    <span className="w-9 shrink-0 text-right text-[11px] text-accent">
                      {on ? "shown" : "show"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-line px-3 py-2.5">
        <Label>What was done to it</Label>
        <ol className="mt-1.5 space-y-0">
          {field.transform.map((t, i) => (
            <li key={i} className="flex gap-2.5">
              <div className="flex flex-col items-center">
                <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-line bg-sunken text-[9px] font-semibold text-ink-2">
                  {i + 1}
                </span>
                {i < field.transform.length - 1 && (
                  <span className="w-px flex-1 bg-line" style={{ minHeight: 12 }} />
                )}
              </div>
              <div className="pb-2.5 min-w-0 flex-1">
                <p className="text-[12px] text-ink">
                  <span className="font-medium">{t.op}</span>
                  {t.result && (
                    <span className="tnum ml-2 text-ink-2">{t.result}</span>
                  )}
                </p>
                <p className="text-[11.5px] leading-snug text-ink-2">{t.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-center justify-between border-t border-line bg-sunken/60 px-3 py-2.5">
        <span className="text-[12px] font-medium text-ink">
          Line {field.line} · {field.label}
        </span>
        <span className="tnum text-[15px] font-semibold text-ink">
          {field.displayValue ?? money(value)}
        </span>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-3">{children}</p>
  );
}
