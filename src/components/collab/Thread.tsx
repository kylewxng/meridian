"use client";

import { useState } from "react";
import Link from "next/link";
import { fmtRelative } from "@/data/constants";
import type { Message, Thread as ThreadType } from "@/data/types";
import { Badge, Btn } from "@/components/common/ui";
import { useStore } from "@/lib/store";
import { allowed, denyReason } from "@/lib/permissions";

// Internal notes and client messages live in the same thread on purpose. The
// alternative is two places to look, which is how the context gets lost.
export default function Thread({
  thread,
  audience,
  anchorHref,
}: {
  thread: ThreadType;
  audience: "client" | "firm";
  anchorHref?: string;
}) {
  const { me, extraMessages, addMessage, resolvedThreads, resolveThread } = useStore();
  const [internal, setInternal] = useState(false);
  const [draft, setDraft] = useState("");

  const canInternal = audience === "firm" && allowed(me.role, "note.internal");
  const canClientMsg = audience === "client" || allowed(me.role, "message.client");

  const all = [...thread.messages, ...(extraMessages[thread.id] ?? [])];
  // A client simply never receives internal notes. The filter is one line and
  // it is the whole permission story for messaging.
  const visible = audience === "client" ? all.filter((m) => !m.internal) : all;
  const resolved = resolvedThreads[thread.id] ?? thread.resolved;
  const hiddenCount = all.length - visible.length;

  const send = () => {
    if (!draft.trim()) return;
    const m: Message = {
      id: `m-new-${thread.id}-${all.length}`,
      author: me.name,
      authorRole: me.roleLabel,
      body: draft.trim(),
      sentOn: new Date("2026-03-10T09:00:00").toISOString(),
      internal: internal && canInternal,
    };
    addMessage(thread.id, m);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line bg-surface px-4 py-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[14px] font-semibold leading-tight">{thread.subject}</h2>
            <p className="mt-0.5 text-[12px] text-ink-3">
              About{" "}
              {anchorHref ? (
                <Link href={anchorHref} className="text-accent hover:underline">
                  {thread.anchor.label}
                </Link>
              ) : (
                thread.anchor.label
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {resolved ? (
              <Badge tone="done">Resolved</Badge>
            ) : (
              <Badge tone={thread.owner === "client" ? "caution" : "accent"}>
                {thread.owner === "client" ? "Client's move" : "Firm's move"}
              </Badge>
            )}
            {audience === "firm" && (
              <Btn size="sm" onClick={() => resolveThread(thread.id, !resolved)}>
                {resolved ? "Reopen" : "Mark resolved"}
              </Btn>
            )}
          </div>
        </div>
        {audience === "firm" && hiddenCount > 0 && (
          <p className="mt-1.5 text-[11.5px] text-caution">
            {hiddenCount} internal note{hiddenCount === 1 ? "" : "s"} in this thread. Switch to
            the client persona to confirm they disappear.
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {visible.map((m) => (
          <Bubble key={m.id} m={m} mine={m.author === me.name} />
        ))}
        {visible.length === 0 && (
          <p className="py-8 text-center text-[12.5px] text-ink-3">
            Nothing here yet for this audience.
          </p>
        )}
      </div>

      <div
        className={`border-t px-4 py-3 transition-colors ${
          internal && canInternal
            ? "border-caution-line bg-caution-soft"
            : "border-line bg-surface"
        }`}
      >
        {canInternal && (
          <div className="mb-2 inline-flex rounded-md border border-line bg-surface p-0.5">
            <button
              onClick={() => setInternal(false)}
              className={`rounded px-2.5 py-1 text-[12px] transition-colors ${
                !internal ? "bg-accent text-white" : "text-ink-2 hover:bg-sunken"
              }`}
            >
              Message the client
            </button>
            <button
              onClick={() => setInternal(true)}
              className={`rounded px-2.5 py-1 text-[12px] transition-colors ${
                internal ? "bg-caution text-white" : "text-ink-2 hover:bg-sunken"
              }`}
            >
              Internal note
            </button>
          </div>
        )}

        {!canClientMsg && !internal && (
          <p className="mb-2 rounded border border-line bg-sunken px-2 py-1.5 text-[11.5px] text-ink-2">
            {denyReason(me.role, "message.client")}
          </p>
        )}

        <div className="flex gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
            }}
            rows={2}
            placeholder={
              internal && canInternal
                ? "Only the firm will ever see this"
                : `Write to ${audience === "client" ? "your preparer" : "the client"}`
            }
            className="flex-1 resize-none rounded border border-line bg-surface px-2.5 py-1.5 text-[13px] outline-none focus:border-accent"
          />
          <Btn
            variant="primary"
            onClick={send}
            disabled={!draft.trim() || (!internal && !canClientMsg)}
          >
            Send
          </Btn>
        </div>
        <p className="mt-1.5 text-[11px] text-ink-3">
          {internal && canInternal
            ? "Internal notes are hatched and tagged. The client never receives them."
            : "The client sees this in their Messages, attached to the same document."}
          {" ⌘↵ to send."}
        </p>
      </div>
    </div>
  );
}

function Bubble({ m, mine }: { m: Message; mine: boolean }) {
  if (m.internal) {
    return (
      <div className="flex gap-2">
        <span className="hatch w-1 shrink-0 rounded-full" />
        <div className="flex-1 rounded-md border border-caution-line bg-caution-soft px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-ink">{m.author}</span>
            <span className="text-[11px] text-ink-3">{m.authorRole}</span>
            <Badge tone="caution">Internal only</Badge>
            <span className="ml-auto text-[11px] text-ink-3">
              {fmtRelative(new Date(m.sentOn))}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-snug text-ink">{m.body}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-md border px-3 py-2 ${mine ? "border-accent-line bg-accent-soft/50" : "border-line bg-surface"}`}>
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-semibold text-ink">{m.author}</span>
        <span className="text-[11px] text-ink-3">{m.authorRole}</span>
        <span className="ml-auto text-[11px] text-ink-3">{fmtRelative(new Date(m.sentOn))}</span>
      </div>
      <p className="mt-1 text-[13px] leading-snug text-ink">{m.body}</p>
    </div>
  );
}
