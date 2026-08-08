"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { INDEX_SIZE, search, type Hit } from "@/lib/search";

const KIND_TONE: Record<Hit["kind"], string> = {
  Return: "bg-accent-soft text-accent",
  Document: "bg-sunken text-ink-2",
  Question: "bg-caution-soft text-caution",
  Task: "bg-sunken text-ink-2",
  Message: "bg-sunken text-ink-2",
  Field: "bg-done-soft text-done",
  "AI finding": "bg-ai-soft text-ai",
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const hits = useMemo(() => search(q), [q]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => setSel(0), [q]);

  const go = (h: Hit) => {
    setOpen(false);
    router.push(h.href);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-line bg-sunken/70 px-2.5 py-1 text-[12px] text-ink-3 hover:bg-sunken hover:text-ink-2 transition-colors min-w-[190px]"
      >
        <span>⌕</span>
        <span>Search everything</span>
        <kbd className="ml-auto rounded border border-line bg-surface px-1 text-[10px] font-sans">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/20 backdrop-blur-[2px] flex items-start justify-center pt-[12vh] px-4"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[620px] rounded-xl border border-line bg-surface shadow-2xl shadow-black/20 overflow-hidden rise"
      >
        <div className="flex items-center gap-2.5 border-b border-line px-4">
          <span className="text-ink-3">⌕</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(s + 1, hits.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(s - 1, 0));
              }
              if (e.key === "Enter" && hits[sel]) go(hits[sel]);
            }}
            placeholder="Returns, documents, questions, tasks, messages, fields, AI findings"
            className="flex-1 bg-transparent py-3.5 text-[14px] outline-none placeholder:text-ink-3"
          />
          <kbd className="rounded border border-line bg-sunken px-1.5 py-0.5 text-[10px] text-ink-3 font-sans">
            esc
          </kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto">
          {!q && (
            <p className="px-4 py-6 text-center text-[12px] text-ink-3">
              {INDEX_SIZE.toLocaleString()} objects indexed. Type to search across every
              kind at once.
            </p>
          )}
          {q && !hits.length && (
            <p className="px-4 py-6 text-center text-[12px] text-ink-3">
              Nothing matches “{q}”.
            </p>
          )}
          {hits.map((h, i) => (
            <button
              key={`${h.kind}-${h.id}`}
              onClick={() => go(h)}
              onMouseEnter={() => setSel(i)}
              className={`flex w-full items-center gap-2.5 px-4 py-2 text-left ${
                i === sel ? "bg-accent-soft" : "hover:bg-sunken"
              }`}
            >
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${KIND_TONE[h.kind]}`}
              >
                {h.kind}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] text-ink">{h.title}</span>
                <span className="block truncate text-[11px] text-ink-3">{h.sub}</span>
              </span>
              {i === sel && <span className="text-[10px] text-ink-3">↵</span>}
            </button>
          ))}
        </div>

        {hits.length > 0 && (
          <div className="border-t border-line bg-sunken/50 px-4 py-1.5 text-[11px] text-ink-3">
            {hits.length} result{hits.length === 1 ? "" : "s"} · ↑↓ to move · ↵ to open
          </div>
        )}
      </div>
    </div>
  );
}
