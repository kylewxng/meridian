"use client";

import { useEffect, useRef } from "react";
import { getDoc } from "@/data/documents";
import { fmtDateLong } from "@/data/constants";
import {
  Form1098Doc,
  Form1099BDoc,
  Form1099IntDoc,
  K1Doc,
  UnreadableDoc,
  W2Doc,
} from "@/components/docs/Forms";
import { Badge } from "@/components/common/ui";

export default function DocViewer({
  docId,
  page,
  region,
  onPage,
}: {
  docId: string | null;
  page: number;
  region: string | null;
  onPage: (p: number) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const doc = docId ? getDoc(docId) : undefined;

  // Scroll the highlighted box into view whenever the traced field changes.
  useEffect(() => {
    if (!region) return;
    const t = setTimeout(() => {
      const el = document.getElementById(`region-${region}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
    return () => clearTimeout(t);
  }, [region, docId, page]);

  if (!doc) {
    return (
      <div className="grid h-full place-items-center p-8 text-center">
        <div className="max-w-xs">
          <p className="text-[13px] font-medium text-ink-2">No source open</p>
          <p className="mt-1 text-[12px] text-ink-3">
            Pick a line on the return and its source document opens here, scrolled to the exact
            box the number came from.
          </p>
        </div>
      </div>
    );
  }

  const body = () => {
    switch (doc.facsimile) {
      case "w2":
        return <W2Doc hit={region} docId={doc.id} />;
      case "1099int":
        return <Form1099IntDoc hit={region} docId={doc.id} />;
      case "1099b":
        return <Form1099BDoc hit={region} docId={doc.id} page={page} />;
      case "k1":
        return <K1Doc hit={region} docId={doc.id} />;
      case "1098":
        return <Form1098Doc hit={region} docId={doc.id} />;
      default:
        return <UnreadableDoc title={doc.title} />;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-medium text-ink">{doc.title}</p>
          <p className="truncate text-[11px] text-ink-3">
            Uploaded {fmtDateLong(new Date(doc.uploadedOn))} by {doc.uploadedBy} · {doc.sizeKb} KB
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          {doc.status === "needs-review" && <Badge tone="caution">Needs review</Badge>}
          {doc.status === "unreadable" && <Badge tone="blocked">Poor scan</Badge>}
          {doc.pages > 1 && (
            <div className="flex items-center gap-0.5 rounded border border-line">
              <button
                onClick={() => onPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-1.5 py-0.5 text-[12px] text-ink-2 hover:bg-sunken disabled:opacity-35"
              >
                ‹
              </button>
              <span className="px-1 text-[11px] tnum text-ink-2">
                {page} / {doc.pages}
              </span>
              <button
                onClick={() => onPage(Math.min(doc.pages, page + 1))}
                disabled={page >= doc.pages}
                className="px-1.5 py-0.5 text-[12px] text-ink-2 hover:bg-sunken disabled:opacity-35"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      <div ref={scroller} className="flex-1 overflow-y-auto bg-sunken p-4">
        {body()}
        <p className="mx-auto mt-3 max-w-[640px] text-center text-[10.5px] text-ink-3">
          Rendered from structured sample data, not a scanned file. That is what lets the
          highlight land on a box rather than a rectangle.
        </p>
      </div>
    </div>
  );
}
