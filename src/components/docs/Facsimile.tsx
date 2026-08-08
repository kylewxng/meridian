"use client";

import type { ReactNode } from "react";

// Source documents are hand-built HTML rather than images or PDFs. That is what
// makes the highlight in challenge 01 land on an exact box instead of a guessed
// rectangle, with no OCR anywhere in the product.

export function Region({
  id,
  hit,
  children,
  className = "",
}: {
  id: string;
  hit?: string | null;
  children: ReactNode;
  className?: string;
}) {
  const on = hit === id;
  return (
    <span
      id={`region-${id}`}
      data-region={id}
      className={`${className} ${on ? "trace-hit" : ""}`}
      style={on ? { boxShadow: "0 0 0 2px rgba(14,110,110,0.45)" } : undefined}
    >
      {children}
    </span>
  );
}

export function Sheet({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[640px] bg-white border border-line-strong shadow-sm">
      {label && (
        <div className="border-b border-line bg-sunken px-3 py-1 text-[10px] uppercase tracking-wide text-ink-3">
          {label}
        </div>
      )}
      <div className="p-5 font-mono text-[11px] leading-[1.45] text-ink">{children}</div>
    </div>
  );
}

export function Box({
  n,
  title,
  children,
  wide,
  tall,
}: {
  n?: string;
  title: string;
  children?: ReactNode;
  wide?: boolean;
  tall?: boolean;
}) {
  return (
    <div
      className={`border border-ink/25 px-1.5 py-1 ${wide ? "col-span-2" : ""} ${
        tall ? "row-span-2" : ""
      }`}
    >
      <div className="text-[8.5px] uppercase leading-tight text-ink-2">
        {n && <span className="font-semibold">{n} </span>}
        {title}
      </div>
      <div className="mt-0.5 text-[12px] font-semibold tnum">{children}</div>
    </div>
  );
}
