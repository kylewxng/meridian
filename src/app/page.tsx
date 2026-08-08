"use client";

import { useRouter } from "next/navigation";
import { PERSONAS, useStore } from "@/lib/store";
import { RETURNS } from "@/data/returns";
import { DOCUMENTS } from "@/data/documents";
import { INDEX_SIZE } from "@/lib/search";

export default function Entry() {
  const { setPersona } = useStore();
  const router = useRouter();

  const go = (id: string) => {
    const p = PERSONAS.find((x) => x.id === id)!;
    setPersona(id);
    router.push(p.side === "firm" ? "/firm" : "/client");
  };

  return (
    <div className="mx-auto max-w-[840px] px-5 py-12">
      <h1 className="text-[30px] font-semibold tracking-tight">Meridian</h1>
      <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-ink-2">
        A tax platform for clients and the firms that serve them, built from scratch for the AI
        Engineer case study. Pick who you want to be. You can switch at any time from the top
        right, and the same URLs work for everyone.
      </p>

      <div className="mt-7 grid grid-cols-2 gap-3">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            onClick={() => go(p.id)}
            className="group rounded-xl border border-line bg-surface p-4 text-left shadow-xs transition-all hover:border-accent-line hover:bg-accent-soft/30 hover:shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`grid h-8 w-8 place-items-center rounded-lg text-[12px] font-semibold text-white shadow-xs ring-1 ring-inset ring-white/15 ${
                  p.side === "firm" ? "bg-accent" : "bg-ink"
                }`}
              >
                {p.initials}
              </span>
              <div>
                <p className="text-[14px] font-semibold text-ink">{p.name}</p>
                <p className="text-[12px] text-ink-3">{p.roleLabel}</p>
              </div>
              <span className="ml-auto text-[13px] text-ink-3 opacity-0 transition-opacity group-hover:opacity-100">
                →
              </span>
            </div>
            <p className="mt-2 text-[12.5px] leading-snug text-ink-2">{p.blurb}</p>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-line bg-surface p-4 shadow-xs">
        <p className="text-[12.5px] font-semibold text-ink">What is behind this</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">
          {RETURNS.length} returns, {DOCUMENTS.length.toLocaleString()} documents, and{" "}
          {INDEX_SIZE.toLocaleString()} searchable objects, all generated from a fixed seed so
          the demo never shifts under you. There is no backend, no OCR, and no model. Source
          documents are hand-built HTML rather than scans, which is what lets a traced number
          highlight an exact box. Every interaction, filter, edit, and permission rule is real
          and persists in your browser. Open the case study map in the top bar to jump straight
          to any of the ten challenges.
        </p>
      </div>
    </div>
  );
}
