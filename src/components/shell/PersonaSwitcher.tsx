"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PERSONAS, useStore } from "@/lib/store";

export default function PersonaSwitcher() {
  const { me, personaId, context, setPersona, setContext, reset } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const go = (id: string) => {
    const p = PERSONAS.find((x) => x.id === id)!;
    setPersona(id);
    setOpen(false);
    router.push(p.side === "firm" ? "/firm" : "/client");
  };

  const clients = PERSONAS.filter((p) => p.side === "client");
  const staff = PERSONAS.filter((p) => p.side === "firm");

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-md border border-line-strong bg-surface pl-1.5 pr-2 py-1 hover:bg-sunken transition-colors"
      >
        <span
          className={`grid h-6 w-6 place-items-center rounded text-[11px] font-semibold text-white ${
            me.side === "firm" ? "bg-accent" : "bg-ink"
          }`}
        >
          {me.initials}
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[12px] font-medium text-ink">{me.name}</span>
          <span className="block text-[10.5px] text-ink-3">
            {context === "personal" ? "My personal return" : me.roleLabel}
          </span>
        </span>
        <span className="text-[9px] text-ink-3">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-[336px] rounded-lg border border-line bg-surface shadow-xl shadow-black/[0.07] z-50 rise overflow-hidden">
          <div className="px-3 py-2 border-b border-line bg-sunken/60">
            <p className="text-[11px] font-semibold text-ink">Switch who you are</p>
            <p className="text-[11px] text-ink-3 mt-0.5">
              Same product, same URLs. Only what you can see and do changes.
            </p>
          </div>

          {me.personalReturnId && (
            <div className="px-3 py-2.5 border-b border-line">
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-3 mb-1.5">
                You are staff and a client
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    setContext("firm");
                    setOpen(false);
                    router.push("/firm");
                  }}
                  className={`flex-1 rounded border px-2 py-1.5 text-[12px] font-medium transition-colors ${
                    context === "firm"
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-line text-ink-2 hover:bg-sunken"
                  }`}
                >
                  Firm workspace
                </button>
                <button
                  onClick={() => {
                    setContext("personal");
                    setOpen(false);
                    router.push("/client");
                  }}
                  className={`flex-1 rounded border px-2 py-1.5 text-[12px] font-medium transition-colors ${
                    context === "personal"
                      ? "border-ink bg-ink text-white"
                      : "border-line text-ink-2 hover:bg-sunken"
                  }`}
                >
                  My 2025 return
                </button>
              </div>
            </div>
          )}

          <Group title="Firm" people={staff} current={personaId} onPick={go} />
          <Group title="Clients" people={clients} current={personaId} onPick={go} />

          <button
            onClick={() => {
              reset();
              setOpen(false);
              router.push("/");
            }}
            className="w-full border-t border-line px-3 py-2 text-left text-[11.5px] text-ink-3 hover:bg-sunken hover:text-ink transition-colors"
          >
            Reset the demo (clears every change you made)
          </button>
        </div>
      )}
    </div>
  );
}

function Group({
  title,
  people,
  current,
  onPick,
}: {
  title: string;
  people: typeof PERSONAS;
  current: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className="py-1.5 border-b border-line last:border-0">
      <p className="px-3 pb-1 text-[10.5px] font-semibold uppercase tracking-wide text-ink-3">
        {title}
      </p>
      {people.map((p) => (
        <button
          key={p.id}
          onClick={() => onPick(p.id)}
          className={`flex w-full items-start gap-2.5 px-3 py-1.5 text-left transition-colors ${
            current === p.id ? "bg-accent-soft" : "hover:bg-sunken"
          }`}
        >
          <span
            className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded text-[10px] font-semibold text-white ${
              p.side === "firm" ? "bg-accent" : "bg-ink"
            }`}
          >
            {p.initials}
          </span>
          <span className="min-w-0">
            <span className="block text-[12.5px] font-medium text-ink">
              {p.name}
              <span className="ml-1.5 text-[11px] font-normal text-ink-3">{p.roleLabel}</span>
            </span>
            <span className="block text-[11px] text-ink-3 leading-snug">{p.blurb}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
