"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RETURNS, returnsForPersona } from "@/data/returns";
import { STAGES, fmtDate, fmtRelative, money } from "@/data/constants";
import { rankAll } from "@/lib/priority";
import { StatusBadge } from "@/components/status/StageRail";
import { Badge, Btn, Empty } from "@/components/common/ui";
import { useStore } from "@/lib/store";
import { allowed, denyReason } from "@/lib/permissions";

type SortKey = "priority" | "due" | "name" | "refund";
const PAGE = 50;

export default function ReturnsList() {
  const { me } = useStore();
  const seesAll = allowed(me.role, "view.allReturns");

  const scope = useMemo(
    () => (seesAll ? RETURNS : returnsForPersona(me.id, me.role)),
    [seesAll, me.id, me.role],
  );

  const [q, setQ] = useState("");
  const [stage, setStage] = useState<string | null>(null);
  const [entity, setEntity] = useState<string | null>(null);
  const [owner, setOwner] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("priority");
  const [shown, setShown] = useState(PAGE);

  const ranked = useMemo(() => rankAll(scope), [scope]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = ranked.filter((r) => {
      if (stage && r.ret.status.stage !== stage) return false;
      if (entity && r.ret.entity !== entity) return false;
      if (owner && r.ret.status.owner !== owner) return false;
      if (needle && !`${r.ret.clientName} ${r.ret.assignedTo}`.toLowerCase().includes(needle))
        return false;
      return true;
    });
    if (sort === "due")
      out = out.slice().sort((a, b) => +new Date(a.ret.dueOn) - +new Date(b.ret.dueOn));
    if (sort === "name")
      out = out.slice().sort((a, b) => a.ret.clientName.localeCompare(b.ret.clientName));
    if (sort === "refund") out = out.slice().sort((a, b) => b.ret.refund - a.ret.refund);
    return out;
  }, [ranked, q, stage, entity, owner, sort]);

  const stageCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of ranked) m.set(r.ret.status.stage, (m.get(r.ret.status.stage) ?? 0) + 1);
    return m;
  }, [ranked]);

  return (
    <div className="flex h-[calc(100vh-3rem)] min-h-0">
      <aside className="w-52 shrink-0 overflow-y-auto border-r border-line bg-surface p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">Stage</p>
        <div className="mt-1 space-y-0.5">
          <Facet active={!stage} label="Any stage" n={ranked.length} onClick={() => setStage(null)} />
          {STAGES.map((s) => (
            <Facet
              key={s.key}
              active={stage === s.key}
              label={s.label}
              n={stageCounts.get(s.key) ?? 0}
              onClick={() => setStage(stage === s.key ? null : s.key)}
            />
          ))}
        </div>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-ink-3">Form</p>
        <div className="mt-1 space-y-0.5">
          <Facet active={!entity} label="Any form" n={ranked.length} onClick={() => setEntity(null)} />
          {["1040", "1120-S", "1065"].map((e) => (
            <Facet
              key={e}
              active={entity === e}
              label={e}
              n={ranked.filter((r) => r.ret.entity === e).length}
              onClick={() => setEntity(entity === e ? null : e)}
            />
          ))}
        </div>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
          Waiting on
        </p>
        <div className="mt-1 space-y-0.5">
          <Facet active={!owner} label="Anyone" n={ranked.length} onClick={() => setOwner(null)} />
          {["client", "firm", "irs"].map((o) => (
            <Facet
              key={o}
              active={owner === o}
              label={o === "irs" ? "The IRS" : o === "firm" ? "The firm" : "The client"}
              n={ranked.filter((r) => r.ret.status.owner === o).length}
              onClick={() => setOwner(owner === o ? null : o)}
            />
          ))}
        </div>

        {!seesAll && (
          <p className="mt-4 rounded border border-line bg-sunken px-2 py-1.5 text-[11.5px] leading-snug text-ink-2">
            {denyReason(me.role, "view.allReturns")}
          </p>
        )}
      </aside>

      <section className="min-w-0 flex-1 overflow-y-auto">
        <div className="border-b border-line px-4 pt-3 pb-2">
          <h1 className="text-[17px] font-semibold tracking-tight">All returns</h1>
          <p className="text-[12px] text-ink-3">
            {seesAll
              ? "Every return the firm is working on this season."
              : "The returns assigned to you."}{" "}
            Facets on the left, sort on the right.
          </p>
        </div>

        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-line bg-canvas/95 px-4 py-2.5 backdrop-blur">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setShown(PAGE);
            }}
            placeholder={`Search ${scope.length.toLocaleString()} returns by client or preparer`}
            className="w-72 rounded border border-line bg-surface px-2.5 py-1.5 text-[12.5px] outline-none focus:border-accent"
          />
          <span className="text-[12px] text-ink-3">
            {filtered.length.toLocaleString()} shown
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[12px] text-ink-3">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded border border-line bg-surface px-2 py-1 text-[12.5px] outline-none focus:border-accent"
            >
              <option value="priority">Priority score</option>
              <option value="due">Due date</option>
              <option value="name">Client name</option>
              <option value="refund">Refund size</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-4">
            <Empty title="No returns match" sub="Clear a facet or change the search." />
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wide text-ink-3">
                  <th className="px-4 py-1.5 text-left font-medium">Client</th>
                  <th className="py-1.5 text-left font-medium">Stage</th>
                  <th className="py-1.5 text-left font-medium">Why it ranks here</th>
                  <th className="py-1.5 text-left font-medium">Preparer</th>
                  <th className="py-1.5 text-right font-medium">Refund</th>
                  <th className="px-4 py-1.5 text-right font-medium">Due</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, shown).map((r) => (
                  <tr
                    key={r.ret.id}
                    className="border-b border-line hover:bg-sunken transition-colors"
                  >
                    <td className="px-4 py-1.5">
                      <Link
                        href={`/firm/returns/${r.ret.id}`}
                        className="text-[12.5px] font-medium text-ink hover:text-accent"
                      >
                        {r.ret.clientName}
                      </Link>
                      <span className="ml-1.5 text-[11px] text-ink-3">{r.ret.entity}</span>
                    </td>
                    <td className="py-1.5">
                      <StatusBadge status={r.ret.status} />
                    </td>
                    <td className="max-w-0 py-1.5 pr-3">
                      <span className="block truncate text-[12px] text-ink-2">
                        {r.reasons.join(" · ") || "Nothing pressing"}
                      </span>
                    </td>
                    <td className="py-1.5 text-[12px] text-ink-2">
                      {r.ret.assignedTo === "Unassigned" ? (
                        <Badge tone="blocked">Unassigned</Badge>
                      ) : (
                        r.ret.assignedTo
                      )}
                    </td>
                    <td className="tnum py-1.5 text-right text-[12px] text-ink-2">
                      {r.ret.refund >= 0 ? money(r.ret.refund) : `(${money(-r.ret.refund)})`}
                    </td>
                    <td className="px-4 py-1.5 text-right">
                      <span
                        className="text-[12px] text-ink-2"
                        title={fmtRelative(new Date(r.ret.dueOn))}
                      >
                        {fmtDate(new Date(r.ret.dueOn))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shown < filtered.length && (
              <div className="p-4 text-center">
                <Btn onClick={() => setShown((s) => s + PAGE)}>
                  Show {Math.min(PAGE, filtered.length - shown)} more
                </Btn>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function Facet({
  active,
  label,
  n,
  onClick,
}: {
  active: boolean;
  label: string;
  n: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded px-2 py-1 text-left text-[12.5px] transition-colors ${
        active ? "bg-accent-soft font-medium text-accent" : "text-ink-2 hover:bg-sunken"
      }`}
    >
      {label}
      <span className="float-right tnum text-[11px] text-ink-3">{n}</span>
    </button>
  );
}
