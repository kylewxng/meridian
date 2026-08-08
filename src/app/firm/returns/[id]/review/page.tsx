"use client";

import { useMemo, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FIELDS, SCHEDULES } from "@/data/provenance";
import { findingForField } from "@/data/aiFindings";
import { getDoc } from "@/data/documents";
import { money } from "@/data/constants";
import type { ReturnField, SourceRef } from "@/data/types";
import Value, { StateChip, STATE_SPEC } from "@/components/field/Value";
import DocViewer from "@/components/trace/DocViewer";
import DerivationPanel from "@/components/trace/DerivationPanel";
import AiCard from "@/components/ai/AiCard";
import RelatedRail from "@/components/common/RelatedRail";
import { Badge, Btn, GatedBtn } from "@/components/common/ui";
import { useStore } from "@/lib/store";
import { allowed, denyReason } from "@/lib/permissions";

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const sp = useSearchParams();
  const { fieldOverrides, overrideField, me } = useStore();

  // Every part of the pane state lives in the URL, so a link to a specific
  // number on a specific page of a specific document survives a refresh.
  const fieldId = sp.get("field") ?? FIELDS[0].id;
  const docId = sp.get("doc");
  const page = Number(sp.get("page") ?? 1);
  const region = sp.get("region");

  const [flash, setFlash] = useState(0);

  const setUrl = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v === null) p.delete(k);
      else p.set(k, v);
    }
    router.replace(`/firm/returns/${id}/review?${p.toString()}`, { scroll: false });
  };

  const field = useMemo(() => FIELDS.find((f) => f.id === fieldId) ?? FIELDS[0], [fieldId]);
  const ov = fieldOverrides[field.id];
  const value = ov?.value ?? field.value;
  const state = ov?.state ?? field.state;
  const finding = findingForField(field.id);

  const openSource = (s: SourceRef) => {
    setUrl({ doc: s.docId, page: String(s.page), region: s.regionId });
    setFlash((f) => f + 1);
  };

  const pickField = (f: ReturnField) => {
    const first = f.sources[0];
    setUrl({
      field: f.id,
      doc: first?.docId ?? null,
      page: first ? String(first.page) : null,
      region: first?.regionId ?? null,
    });
    setFlash((v) => v + 1);
  };

  const activeSource =
    field.sources.find(
      (s) => s.docId === docId && s.page === page && s.regionId === region,
    ) ?? null;

  const canEdit = allowed(me.role, "edit.returnFields");

  // Only Ray's return has a hand-built traceability graph. Showing his figures
  // under another client's name would be worse than saying so.
  if (id !== "r-0002") {
    return (
      <div className="mx-auto max-w-[520px] px-5 py-16 text-center">
        <h2 className="text-[17px] font-semibold tracking-tight">
          No traceability data for this return
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
          The full field-by-field graph is hand-built for one return in this prototype rather
          than generated, because fabricating a believable derivation chain is the part worth
          showing carefully. Everything else on this return, including its documents, AI
          findings, and messages, is wired up normally.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Btn variant="primary" href="/firm/returns/r-0002/review">
            Open the traced return
          </Btn>
          <Btn href={`/firm/returns/${id}`}>Back to the overview</Btn>
        </div>
      </div>
    );
  }

  const grouped = SCHEDULES.map((s) => ({
    schedule: s,
    rows: FIELDS.filter((f) => f.schedule === s),
  })).filter((g) => g.rows.length);

  const unresolved = FIELDS.filter((f) => {
    const st = fieldOverrides[f.id]?.state ?? f.state;
    return st === "needs-approval" || st === "ai-suggested";
  }).length;

  return (
    <div className="flex h-[calc(100vh-6.25rem)] min-h-0">
      {/* Left: the return itself */}
      <section className="w-[400px] shrink-0 overflow-y-auto border-r border-line bg-surface">
        <div className="sticky top-0 z-10 border-b border-line bg-surface/95 backdrop-blur px-3 py-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[12.5px] font-semibold">Form 1040 · 2025</h2>
            {unresolved > 0 ? (
              <Badge tone="caution">{unresolved} unresolved</Badge>
            ) : (
              <Badge tone="done">All lines settled</Badge>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-ink-3">
            Pick any line to see where the number came from.
          </p>
        </div>

        {grouped.map((g) => (
          <div key={g.schedule}>
            <p className="sticky top-[52px] z-[5] border-y border-line bg-sunken px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-2">
              {g.schedule}
            </p>
            {g.rows.map((f) => {
              const o = fieldOverrides[f.id];
              const st = o?.state ?? f.state;
              const v = o?.value ?? f.value;
              const active = f.id === field.id;
              return (
                <button
                  key={f.id}
                  onClick={() => pickField(f)}
                  className={`flex w-full items-center gap-2 border-b border-line py-2 pr-3 text-left transition-colors ${
                    active
                      ? "border-l-2 border-l-accent bg-accent-soft pl-2.5"
                      : "pl-3 hover:bg-sunken/70"
                  }`}
                >
                  <span className="w-8 shrink-0 font-mono text-[11px] text-ink-3">{f.line}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] text-ink">{f.label}</span>
                    <span className="mt-0.5 flex items-center gap-1">
                      <StateChip state={st} small />
                      {o && (
                        <span className="text-[10px] text-accent">edited by you</span>
                      )}
                    </span>
                  </span>
                  <span className="tnum shrink-0 text-[13px] font-medium text-ink">
                    {f.displayValue ?? money(v)}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </section>

      {/* Middle: the evidence for the selected line */}
      <section className="w-[400px] shrink-0 overflow-y-auto bg-canvas p-3 space-y-3">
        <div className="rounded-lg border border-line bg-surface p-3 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-ink-3">
                {field.schedule} · line {field.line}
              </p>
              <h2 className="text-[15px] font-semibold leading-tight">{field.label}</h2>
            </div>
            <StateChip state={state} />
          </div>

          <div className="mt-2.5 flex items-center gap-3">
            <Value
              key={`${field.id}-${value}`}
              state={state}
              value={value}
              display={field.displayValue}
              size="lg"
              onSelect={() => field.sources[0] && openSource(field.sources[0])}
              onCommit={
                canEdit && field.editable
                  ? (v) =>
                      overrideField(field.id, {
                        value: v,
                        state: "verified",
                        by: me.name,
                        on: "just now",
                        note: "Typed in during review.",
                      })
                  : undefined
              }
            />
            {field.editable && canEdit && (
              <span className="text-[11px] text-ink-3">Double-click to change</span>
            )}
          </div>

          <p className="mt-2 border-t border-line pt-2 text-[11.5px] leading-snug text-ink-2">
            {STATE_SPEC[state].meaning}
          </p>

          {state === "locked" && field.lockReason && (
            <p className="mt-1.5 rounded border border-line bg-sunken px-2 py-1.5 text-[11.5px] text-ink-2">
              {field.lockReason}
            </p>
          )}

          {ov?.note && (
            <p className="mt-1.5 rounded border border-accent-line bg-accent-soft px-2 py-1.5 text-[11.5px] text-accent">
              {ov.note} Signed {ov.by}, {ov.on}.
            </p>
          )}

          {field.verifiedBy && !ov && (
            <p className="mt-1.5 text-[11.5px] text-ink-3">
              Checked against the source by {field.verifiedBy}.
            </p>
          )}

          {!canEdit && (
            <p className="mt-2 rounded border border-line bg-sunken px-2 py-1.5 text-[11.5px] text-ink-2">
              {denyReason(me.role, "edit.returnFields")}
            </p>
          )}
        </div>

        <DerivationPanel
          field={field}
          value={value}
          activeSource={activeSource}
          onSource={openSource}
        />

        {finding && (
          <div>
            <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-ink-3">
              What the AI flagged here
            </p>
            <AiCard finding={finding} onEvidence={openSource} />
          </div>
        )}

        {(state === "needs-approval" || state === "ai-suggested") && (
          <div className="rounded-lg border border-caution-line bg-caution-soft p-3">
            <p className="text-[12.5px] font-medium text-caution">This line is not settled</p>
            <p className="mt-0.5 text-[12px] leading-snug text-ink-2">
              {state === "ai-suggested"
                ? "No person has checked this against the source yet."
                : "Somebody has to accept it or correct it before this return can be filed."}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <GatedBtn
                allowed={canEdit}
                reason={denyReason(me.role, "edit.returnFields")}
                size="sm"
                variant="primary"
                onClick={() =>
                  overrideField(field.id, {
                    state: "verified",
                    by: me.name,
                    on: "just now",
                    note: "Checked against the source and signed off.",
                  })
                }
              >
                Mark verified
              </GatedBtn>
              <Btn
                size="sm"
                href={`/firm/returns/${id}/messages?field=${field.id}`}
              >
                Ask the client
              </Btn>
            </div>
          </div>
        )}

        <RelatedRail
          from={{
            label: `line ${field.line}`,
            href: `/firm/returns/${id}/review?field=${field.id}`,
            kind: "field",
          }}
          items={relationsFor(id, field)}
        />
      </section>

      {/* Right: the source document */}
      <section className="min-w-0 flex-1">
        <DocViewer
          key={`${docId}-${region}-${flash}`}
          docId={docId}
          page={page}
          region={region}
          onPage={(p) => setUrl({ page: String(p) })}
        />
      </section>
    </div>
  );
}

function relationsFor(returnId: string, f: ReturnField) {
  const rel = [];
  // A field can cite several pages of one document. The rail lists the
  // document once and says how many places it was pulled from.
  const byDoc = new Map<string, number>();
  for (const s of f.sources) byDoc.set(s.docId, (byDoc.get(s.docId) ?? 0) + 1);

  for (const [docId, n] of byDoc) {
    const doc = getDoc(docId);
    if (!doc) continue;
    rel.push({
      type: "document" as const,
      id: doc.id,
      label: doc.title,
      reason:
        n > 1
          ? `Feeds line ${f.line} from ${n} places in this document`
          : `Feeds line ${f.line}`,
      href: `/firm/returns/${returnId}/documents?doc=${doc.id}`,
    });
  }
  if (f.id === "f1040.line7") {
    rel.push({
      type: "question" as const,
      id: "q-r1",
      label: "What did you pay for the 14 lots?",
      reason: "Line 7 stays unsettled until this is answered",
      href: `/firm/returns/${returnId}/messages?thread=th-1`,
    });
    rel.push({
      type: "task" as const,
      id: "t-r1",
      label: "Send the cost basis for 14 brokerage lots",
      reason: "Assigned to the client, 2 days overdue",
      href: `/firm/returns/${returnId}`,
    });
  }
  if (f.id === "f1040.line3a") {
    rel.push({
      type: "task" as const,
      id: "t-r2",
      label: "Re-scan the 1099-DIV",
      reason: "The current scan is why confidence is low",
      href: `/firm/returns/${returnId}`,
    });
  }
  if (f.id === "schE.line28k1") {
    rel.push({
      type: "return" as const,
      id: "r-0003",
      label: "Alvarez Design Co. 1120-S",
      reason: "The S-corp return that issued this K-1",
      href: `/firm/returns/r-0003`,
    });
  }
  return rel;
}
