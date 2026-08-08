"use client";

import { use, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { docsFor, getDoc } from "@/data/documents";
import { fmtDate } from "@/data/constants";
import type { SourceDoc } from "@/data/types";
import DocViewer from "@/components/trace/DocViewer";
import { Badge, Btn, Empty } from "@/components/common/ui";

const STATUS_TONE = {
  extracted: "done",
  "needs-review": "caution",
  unreadable: "blocked",
  pending: "neutral",
} as const;

const PAGE_SIZE = 40;

export default function DocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const sp = useSearchParams();
  const selected = sp.get("doc");

  const all = useMemo(() => docsFor(id), [id]);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [feedsOnly, setFeedsOnly] = useState(false);
  const [shown, setShown] = useState(PAGE_SIZE);

  const kinds = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of all) m.set(d.kind, (m.get(d.kind) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [all]);

  const statuses = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of all) m.set(d.status, (m.get(d.status) ?? 0) + 1);
    return [...m.entries()];
  }, [all]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all.filter((d) => {
      if (kind && d.kind !== kind) return false;
      if (status && d.status !== status) return false;
      if (feedsOnly && d.fieldsFed.length === 0) return false;
      if (needle && !`${d.title} ${d.issuer} ${d.kind}`.toLowerCase().includes(needle))
        return false;
      return true;
    });
  }, [all, q, kind, status, feedsOnly]);

  const visible = filtered.slice(0, shown);
  const clearAll = () => {
    setKind(null);
    setStatus(null);
    setFeedsOnly(false);
    setQ("");
  };
  const anyFilter = Boolean(kind || status || feedsOnly || q);

  const open = (d: SourceDoc) => {
    const p = new URLSearchParams(sp.toString());
    p.set("doc", d.id);
    p.delete("region");
    p.set("page", "1");
    router.replace(`/firm/returns/${id}/documents?${p.toString()}`, { scroll: false });
  };

  return (
    <div className="flex h-[calc(100vh-6.25rem)] min-h-0">
      {/* Facets. With 284 documents on one return, the filter rail is the
          navigation, not a nicety. */}
      <aside className="w-52 shrink-0 overflow-y-auto border-r border-line bg-surface p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">Type</p>
        <Facet
          entries={kinds}
          value={kind}
          onChange={setKind}
          total={all.length}
          totalLabel="All types"
          keepCase
        />

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
          Extraction
        </p>
        <Facet
          entries={statuses}
          value={status}
          onChange={setStatus}
          total={all.length}
          totalLabel="Any state"
        />

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
          Relevance
        </p>
        <button
          onClick={() => setFeedsOnly((v) => !v)}
          className={`mt-1 w-full rounded px-2 py-1 text-left text-[12.5px] transition-colors ${
            feedsOnly ? "bg-accent-soft font-medium text-accent" : "text-ink-2 hover:bg-sunken"
          }`}
        >
          Feeds a return line
          <span className="float-right tnum text-[11px] text-ink-3">
            {all.filter((d) => d.fieldsFed.length).length}
          </span>
        </button>

        {anyFilter && (
          <button
            onClick={clearAll}
            className="mt-4 w-full rounded border border-line px-2 py-1 text-[12px] text-ink-2 hover:bg-sunken"
          >
            Clear filters
          </button>
        )}
      </aside>

      {/* List */}
      <section className="w-[400px] shrink-0 overflow-y-auto border-r border-line bg-canvas">
        <div className="sticky top-0 z-10 border-b border-line bg-canvas/95 backdrop-blur px-3 py-2">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setShown(PAGE_SIZE);
            }}
            placeholder="Filter these documents"
            className="w-full rounded border border-line bg-surface px-2 py-1.5 text-[12.5px] outline-none focus:border-accent"
          />
          <p className="mt-1.5 text-[11.5px] text-ink-3">
            {filtered.length.toLocaleString()} of {all.length.toLocaleString()} documents
            {anyFilter ? " match" : " on this return"}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="p-3">
            <Empty title="Nothing matches" sub="Loosen a filter or clear the search." />
          </div>
        ) : (
          <>
            <ul>
              {visible.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => open(d)}
                    className={`flex w-full items-start gap-2 border-b border-line px-3 py-2 text-left transition-colors ${
                      selected === d.id ? "bg-accent-soft" : "hover:bg-sunken"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] text-ink">{d.title}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-1">
                        <Badge tone={STATUS_TONE[d.status]}>{d.status.replace("-", " ")}</Badge>
                        {d.facsimile && <Badge tone="accent">viewable</Badge>}
                        {d.fieldsFed.length > 0 && (
                          <Badge tone="done">feeds {d.fieldsFed.length}</Badge>
                        )}
                        <span className="text-[11px] text-ink-3">
                          {fmtDate(new Date(d.uploadedOn))}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {shown < filtered.length && (
              <div className="p-3">
                <Btn className="w-full" onClick={() => setShown((s) => s + PAGE_SIZE)}>
                  Show {Math.min(PAGE_SIZE, filtered.length - shown)} more
                </Btn>
              </div>
            )}
          </>
        )}
      </section>

      <section className="min-w-0 flex-1">
        {selected ? (
          <DocViewer
            docId={selected}
            page={Number(sp.get("page") ?? 1)}
            region={sp.get("region")}
            onPage={(p) => {
              const nsp = new URLSearchParams(sp.toString());
              nsp.set("page", String(p));
              router.replace(`/firm/returns/${id}/documents?${nsp.toString()}`, {
                scroll: false,
              });
            }}
          />
        ) : (
          <div className="grid h-full place-items-center p-8">
            <div className="max-w-xs text-center">
              <p className="text-[13px] font-medium text-ink-2">Pick a document</p>
              <p className="mt-1 text-[12px] text-ink-3">
                Six of these render in full. The rest are stubs, which is the honest state of
                a real filing cabinet.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Facet({
  entries,
  value,
  onChange,
  total,
  totalLabel,
  keepCase,
}: {
  entries: [string, number][];
  value: string | null;
  onChange: (v: string | null) => void;
  total: number;
  totalLabel: string;
  // Form names like 1099-B keep their hyphen and casing. Status keys do not.
  keepCase?: boolean;
}) {
  return (
    <div className="mt-1 space-y-0.5">
      <FacetRow active={!value} label={totalLabel} count={total} onClick={() => onChange(null)} />
      {entries.map(([k, n]) => (
        <FacetRow
          key={k}
          active={value === k}
          label={keepCase ? k : k.replace("-", " ")}
          cap={!keepCase}
          count={n}
          onClick={() => onChange(value === k ? null : k)}
        />
      ))}
    </div>
  );
}

function FacetRow({
  active,
  label,
  count,
  onClick,
  cap,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
  cap?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-md px-2 py-1 text-left text-[12.5px] transition-colors ${
        cap ? "first-letter:uppercase" : ""
      } ${active ? "bg-accent-soft font-medium text-accent ring-1 ring-accent-line" : "text-ink-2 hover:bg-sunken"}`}
    >
      {label}
      <span className="float-right tnum text-[11px] text-ink-3">{count}</span>
    </button>
  );
}
