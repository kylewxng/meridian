"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RETURNS } from "@/data/returns";
import { threadsFor } from "@/data/threads";
import { fmtRelative } from "@/data/constants";
import Thread from "@/components/collab/Thread";
import { Badge, Empty } from "@/components/common/ui";
import { useStore } from "@/lib/store";

export default function ClientMessages() {
  const { me, context, resolvedThreads, extraMessages } = useStore();
  const sp = useSearchParams();
  const router = useRouter();

  const clientId = context === "personal" ? "c-reyes" : me.clientId;
  const ret = useMemo(
    () => RETURNS.find((r) => r.clientId === clientId) ?? RETURNS[0],
    [clientId],
  );
  const threads = threadsFor(ret.id);
  const selectedId = sp.get("thread") ?? threads[0]?.id;
  const selected = threads.find((t) => t.id === selectedId);

  return (
    <div className="flex h-[calc(100vh-3rem)] min-h-0">
      <aside className="w-[300px] shrink-0 overflow-y-auto border-r border-line bg-canvas">
        <div className="border-b border-line px-4 py-3">
          <h1 className="text-[16px] font-semibold">Messages</h1>
          <p className="text-[12.5px] text-ink-3">
            Each one is attached to the thing it is about.
          </p>
        </div>
        {threads.length === 0 && (
          <div className="p-4">
            <Empty title="No messages yet" />
          </div>
        )}
        {threads.map((t) => {
          // A client never sees internal notes, including in the preview count.
          const visible = [
            ...t.messages.filter((m) => !m.internal),
            ...(extraMessages[t.id] ?? []).filter((m) => !m.internal),
          ];
          const resolved = resolvedThreads[t.id] ?? t.resolved;
          const last = visible[visible.length - 1];
          return (
            <button
              key={t.id}
              onClick={() =>
                router.replace(`/client/messages?thread=${t.id}`, { scroll: false })
              }
              className={`block w-full border-b border-line px-4 py-2.5 text-left transition-colors ${
                selectedId === t.id ? "bg-accent-soft" : "hover:bg-sunken"
              }`}
            >
              <div className="flex items-center gap-2">
                <p className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink">
                  {t.subject}
                </p>
                {resolved ? (
                  <Badge tone="done">Done</Badge>
                ) : t.owner === "client" ? (
                  <Badge tone="caution">Your turn</Badge>
                ) : null}
              </div>
              <p className="truncate text-[12.5px] text-ink-3">about {t.anchor.label}</p>
              {last && (
                <p className="mt-0.5 truncate text-[12px] text-ink-3">
                  {last.author.split(" ")[0]}: {last.body}
                </p>
              )}
              {last && (
                <p className="text-[11.5px] text-ink-3">{fmtRelative(new Date(last.sentOn))}</p>
              )}
            </button>
          );
        })}
      </aside>

      <section className="min-w-0 flex-1 bg-canvas">
        {selected ? (
          <Thread thread={selected} audience="client" />
        ) : (
          <div className="grid h-full place-items-center text-[13px] text-ink-3">
            Pick a conversation.
          </div>
        )}
      </section>
    </div>
  );
}
