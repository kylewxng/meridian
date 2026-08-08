"use client";

import { use, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { threadsFor } from "@/data/threads";
import { fmtRelative } from "@/data/constants";
import Thread from "@/components/collab/Thread";
import { Badge, Empty } from "@/components/common/ui";
import { useStore } from "@/lib/store";

// Grouped by what the conversation is about and who owes the next move, which
// is the difference between this and an inbox.
export default function MessagesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const sp = useSearchParams();
  const router = useRouter();
  const { resolvedThreads, extraMessages } = useStore();

  const threads = useMemo(() => threadsFor(id), [id]);
  const selectedId = sp.get("thread") ?? threads[0]?.id;
  const selected = threads.find((t) => t.id === selectedId);

  const open = threads.filter((t) => !(resolvedThreads[t.id] ?? t.resolved));
  const done = threads.filter((t) => resolvedThreads[t.id] ?? t.resolved);
  const waitingClient = open.filter((t) => t.owner === "client");
  const waitingFirm = open.filter((t) => t.owner === "firm");

  const pick = (tid: string) =>
    router.replace(`/firm/returns/${id}/messages?thread=${tid}`, { scroll: false });

  const anchorHref = (t: (typeof threads)[number]) => {
    switch (t.anchor.type) {
      case "document":
        return `/firm/returns/${id}/documents?doc=${t.anchor.id}`;
      case "field":
        return `/firm/returns/${id}/review?field=${t.anchor.id}`;
      case "issue":
        return `/firm/returns/${id}/issues?finding=${t.anchor.id}`;
      default:
        return `/firm/returns/${id}`;
    }
  };

  return (
    <div className="flex h-[calc(100vh-6.25rem)] min-h-0">
      <aside className="w-[340px] shrink-0 overflow-y-auto border-r border-line bg-canvas">
        <div className="border-b border-line px-3 py-2">
          <h2 className="text-[12.5px] font-semibold">Open requests</h2>
          <p className="text-[11.5px] text-ink-3">
            Grouped by who has to move next, not by date received.
          </p>
        </div>

        <Group
          title="Waiting on the client"
          tone="caution"
          threads={waitingClient}
          selected={selectedId}
          onPick={pick}
          extra={extraMessages}
        />
        <Group
          title="Waiting on us"
          tone="accent"
          threads={waitingFirm}
          selected={selectedId}
          onPick={pick}
          extra={extraMessages}
        />
        <Group
          title="Resolved"
          tone="done"
          threads={done}
          selected={selectedId}
          onPick={pick}
          extra={extraMessages}
        />

        {threads.length === 0 && (
          <div className="p-3">
            <Empty title="No threads on this return" />
          </div>
        )}
      </aside>

      <section className="min-w-0 flex-1 bg-canvas">
        {selected ? (
          <Thread thread={selected} audience="firm" anchorHref={anchorHref(selected)} />
        ) : (
          <div className="grid h-full place-items-center text-[12.5px] text-ink-3">
            Pick a thread.
          </div>
        )}
      </section>
    </div>
  );
}

function Group({
  title,
  tone,
  threads,
  selected,
  onPick,
  extra,
}: {
  title: string;
  tone: "caution" | "accent" | "done";
  threads: ReturnType<typeof threadsFor>;
  selected?: string;
  onPick: (id: string) => void;
  extra: Record<string, unknown[]>;
}) {
  if (!threads.length) return null;
  return (
    <div>
      <p className="flex items-center gap-2 border-b border-line bg-sunken px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-2">
        {title}
        <Badge tone={tone}>{threads.length}</Badge>
      </p>
      {threads.map((t) => {
        const count = t.messages.length + (extra[t.id]?.length ?? 0);
        const internalCount = t.messages.filter((m) => m.internal).length;
        return (
          <button
            key={t.id}
            onClick={() => onPick(t.id)}
            className={`block w-full border-b border-line px-3 py-2 text-left transition-colors ${
              selected === t.id ? "bg-accent-soft" : "hover:bg-sunken"
            }`}
          >
            <p className="truncate text-[12.5px] font-medium text-ink">{t.subject}</p>
            <p className="truncate text-[11.5px] text-ink-3">on {t.anchor.label}</p>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-3">
              <span>{count} messages</span>
              {internalCount > 0 && (
                <span className="rounded border border-caution-line bg-caution-soft px-1 text-caution">
                  {internalCount} internal
                </span>
              )}
              {t.dueOn && (
                <span
                  className={
                    new Date(t.dueOn) < new Date("2026-03-10T09:00:00")
                      ? "text-blocked"
                      : ""
                  }
                >
                  due {fmtRelative(new Date(t.dueOn))}
                </span>
              )}
            </p>
          </button>
        );
      })}
    </div>
  );
}
