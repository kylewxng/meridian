"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RETURNS, returnsForPersona } from "@/data/returns";
import { fmtRelative, money } from "@/data/constants";
import { band, rankAll, type Ranked } from "@/lib/priority";
import { StatusBadge } from "@/components/status/StageRail";
import { Badge, Btn, Card, Empty, SectionTitle } from "@/components/common/ui";
import { useStore } from "@/lib/store";
import { allowed } from "@/lib/permissions";

const FILTERS = [
  { key: "all", label: "Everything" },
  { key: "blocked", label: "Blocked on the client" },
  { key: "mine", label: "Needs me today" },
  { key: "review", label: "Sitting in review" },
  { key: "unassigned", label: "Unassigned" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function FirmDashboard() {
  const { me } = useStore();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [view, setView] = useState<"mine" | "team">("mine");
  const [shown, setShown] = useState(12);

  const isManager = allowed(me.role, "assign.staff") || me.role === "reviewer";
  const scope = useMemo(
    () => (view === "team" ? RETURNS : returnsForPersona(me.id, me.role)),
    [view, me.id, me.role],
  );

  const ranked = useMemo(() => rankAll(scope), [scope]);

  const filtered = useMemo(() => {
    switch (filter) {
      case "blocked":
        return ranked.filter((r) => r.ret.status.blockers.some((b) => b.owner === "client"));
      case "mine":
        return ranked.filter((r) => r.actionOwner === "you" || r.actionOwner === "reviewer");
      case "review":
        return ranked.filter((r) => r.ret.status.stage === "review");
      case "unassigned":
        return ranked.filter((r) => r.ret.assignedTo === "Unassigned");
      default:
        return ranked;
    }
  }, [ranked, filter]);

  const top = ranked[0];
  const now = ranked.filter((r) => band(r.score) === "now").length;
  const clientBlocked = ranked.filter((r) =>
    r.ret.status.blockers.some((b) => b.owner === "client"),
  ).length;
  const dueWeek = ranked.filter((r) => {
    const d = (+new Date(r.ret.dueOn) - +new Date("2026-03-10T09:00:00")) / 86400000;
    return d >= 0 && d <= 7;
  }).length;

  return (
    <div className="mx-auto max-w-[1180px] p-4 space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[19px] font-semibold tracking-tight">
            {view === "team" ? "The whole firm" : `Your desk, ${me.name.split(" ")[0]}`}
          </h1>
          <p className="text-[12.5px] text-ink-3">
            {scope.length.toLocaleString()} returns in scope · ranked by a scoring function, not
            by date
          </p>
        </div>
        {isManager && (
          <div className="inline-flex rounded-md border border-line bg-surface p-0.5">
            {(["mine", "team"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded px-2.5 py-1 text-[12.5px] transition-colors ${
                  view === v ? "bg-accent text-white" : "text-ink-2 hover:bg-sunken"
                }`}
              >
                {v === "mine" ? "My work" : "Team view"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* The landing page answers one question before it reports anything. */}
      {top && <NextUp r={top} />}

      <div className="grid grid-cols-3 gap-3">
        <Stat n={now} label="need attention now" tone="blocked" />
        <Stat n={clientBlocked} label="stuck waiting on a client" tone="caution" />
        <Stat n={dueWeek} label="due inside seven days" tone="accent" />
      </div>

      {view === "team" && <TeamPanel ranked={ranked} />}

      <Card pad={false}>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2.5">
          <h2 className="text-[13px] font-semibold">The queue</h2>
          <div className="ml-auto flex flex-wrap gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setFilter(f.key);
                  setShown(12);
                }}
                className={`rounded border px-2 py-0.5 text-[12px] transition-colors ${
                  filter === f.key
                    ? "border-accent bg-accent-soft font-medium text-accent"
                    : "border-line text-ink-2 hover:bg-sunken"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-4">
            <Empty title="Nothing in this slice" />
          </div>
        ) : (
          <>
            <ul>
              {filtered.slice(0, shown).map((r, i) => (
                <QueueRow key={r.ret.id} r={r} n={i + 1} />
              ))}
            </ul>
            {shown < filtered.length && (
              <div className="border-t border-line p-3 text-center">
                <Btn onClick={() => setShown((s) => s + 24)}>
                  Show 24 more of {filtered.length - shown}
                </Btn>
              </div>
            )}
          </>
        )}
      </Card>

      <p className="pb-6 text-center text-[11.5px] text-ink-3">
        Ranking weighs deadline, how long something has been blocked, review age, whether the
        client just replied, low-confidence fields, and dollars at stake. Every row shows which
        of those fired.
      </p>
    </div>
  );
}

function NextUp({ r }: { r: Ranked }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-accent-line bg-accent-soft/60 p-4 pl-4.75 shadow-xs">
      <span className="absolute inset-y-0 left-0 w-1 bg-accent" aria-hidden />
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
            Work on this next
          </p>
          <h2 className="mt-0.5 text-[17px] font-semibold tracking-tight">{r.ret.clientName}</h2>
          <p className="mt-0.5 text-[13px] text-ink-2">
            {r.nextAction}. {r.reasons.join(" · ")}.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <StatusBadge status={r.ret.status} />
            <Badge>{r.ret.entity}</Badge>
            <Badge tone="blocked">Score {r.score}</Badge>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-1.5">
          <Btn variant="primary" href={`/firm/returns/${r.ret.id}/review`}>
            Open the return
          </Btn>
          <Btn href={`/firm/returns/${r.ret.id}/messages`}>Message the client</Btn>
        </div>
      </div>
    </div>
  );
}

function Stat({ n, label, tone }: { n: number; label: string; tone: "blocked" | "caution" | "accent" }) {
  const c = { blocked: "text-blocked", caution: "text-caution", accent: "text-accent" }[tone];
  return (
    <Card>
      <p className={`tnum text-[26px] font-semibold leading-none tracking-[-0.03em] ${c}`}>{n}</p>
      <p className="mt-1.5 text-[12.5px] text-ink-2">{label}</p>
    </Card>
  );
}

function QueueRow({ r, n }: { r: Ranked; n: number }) {
  const b = band(r.score);
  const tone = b === "now" ? "bg-blocked" : b === "soon" ? "bg-caution" : "bg-line";
  return (
    <li className="border-b border-line last:border-0">
      <Link
        href={`/firm/returns/${r.ret.id}`}
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-sunken/70 transition-colors"
      >
        <span className="tnum w-5 shrink-0 text-right text-[11px] tabular-nums text-ink-3">{n}</span>
        <span className={`h-7 w-1 shrink-0 rounded-full ${tone}`} />
        <span className="w-52 shrink-0 min-w-0">
          <span className="block truncate text-[13px] font-medium text-ink">
            {r.ret.clientName}
          </span>
          <span className="block text-[11px] text-ink-3">
            {r.ret.entity} · {r.ret.assignedTo}
          </span>
        </span>
        <StatusBadge status={r.ret.status} />
        {/* This is the part that keeps people off spreadsheets: the row says
            why it is here. */}
        <span className="min-w-0 flex-1 truncate text-[12px] text-ink-2">
          {r.reasons.join(" · ")}
        </span>
        <span className="w-28 shrink-0 text-right text-[12px] text-ink-2">{r.nextAction}</span>
        <span className="tnum w-20 shrink-0 text-right text-[11.5px] text-ink-3">
          {fmtRelative(new Date(r.ret.dueOn))}
        </span>
      </Link>
    </li>
  );
}

function TeamPanel({ ranked }: { ranked: Ranked[] }) {
  const load = useMemo(() => {
    const m = new Map<string, { n: number; urgent: number }>();
    for (const r of ranked) {
      const k = r.ret.assignedTo;
      const cur = m.get(k) ?? { n: 0, urgent: 0 };
      cur.n++;
      if (band(r.score) === "now") cur.urgent++;
      m.set(k, cur);
    }
    return [...m.entries()].sort((a, b) => b[1].urgent - a[1].urgent);
  }, [ranked]);

  const atRisk = ranked.filter((r) => band(r.score) === "now").slice(0, 4);

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card>
        <SectionTitle sub="Urgent means a priority score of 45 or more.">
          Who is carrying what
        </SectionTitle>
        <ul className="space-y-1.5">
          {load.map(([name, v]) => (
            <li key={name} className="flex items-center gap-2 text-[12.5px]">
              <span className={`w-32 shrink-0 truncate ${name === "Unassigned" ? "text-blocked" : "text-ink"}`}>
                {name}
              </span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                <span
                  className="block h-full rounded-full bg-accent"
                  style={{ width: `${Math.min(100, (v.n / 70) * 100)}%` }}
                />
              </span>
              <span className="tnum w-20 shrink-0 text-right text-ink-2">
                {v.n} · {v.urgent} hot
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionTitle sub="Highest scores across the firm right now.">
          Most at risk
        </SectionTitle>
        <ul className="space-y-1">
          {atRisk.map((r) => (
            <li key={r.ret.id}>
              <Link
                href={`/firm/returns/${r.ret.id}`}
                className="flex items-center gap-2 rounded px-1 py-1 text-[12.5px] hover:bg-sunken"
              >
                <span className="min-w-0 flex-1 truncate text-ink">{r.ret.clientName}</span>
                <span className="truncate text-[11.5px] text-ink-3">{r.reasons[0]}</span>
                <span className="tnum shrink-0 text-[11.5px] text-blocked">{r.score}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-2 border-t border-line pt-2 text-[11.5px] text-ink-3">
          Total refunds in flight: {money(RETURNS.reduce((s, r) => s + Math.max(0, r.refund), 0))}
        </p>
      </Card>
    </div>
  );
}
