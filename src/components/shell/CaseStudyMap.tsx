"use client";

import Link from "next/link";
import { useState } from "react";

// A grader should not have to hunt. Each challenge points at the screen where
// it actually lives, with the one decision worth defending.
const MAP = [
  {
    n: "01",
    title: "Source document traceability",
    href: "/firm/returns/r-0002/review",
    decision:
      "Click any number and the source opens beside it with the exact box highlighted, plus the arithmetic that got from one to the other.",
  },
  {
    n: "02",
    title: "Client and CPA collaboration",
    href: "/firm/returns/r-0002/messages",
    decision:
      "Every thread is anchored to a document, field, or question. There is no unanchored inbox.",
  },
  {
    n: "03",
    title: "Where to start",
    href: "/client",
    decision:
      "Switch to Dana Whitfield. One action on screen, navigation withheld until there is something to navigate to.",
  },
  {
    n: "04",
    title: "Getting lost in the app",
    href: "/firm/returns/r-0002/review?field=f1040.line7",
    decision:
      "Panel state lives in the URL, related objects hang off every detail view, and jumping away leaves a way back.",
  },
  {
    n: "05",
    title: "Role-aware experiences",
    href: "/firm/team",
    decision:
      "Six personas in the top-right switcher. Blocked actions stay visible and say why. Marcus is staff and a client.",
  },
  {
    n: "06",
    title: "Return status and progress",
    href: "/client/status",
    decision:
      "Six stage names shared by everyone. A status always says where, who owns it, and what is blocking.",
  },
  {
    n: "07",
    title: "An actionable dashboard",
    href: "/firm",
    decision:
      "Ranked by a real scoring function over 242 returns. Every row shows why it ranked where it did.",
  },
  {
    n: "08",
    title: "Clickable vs editable",
    href: "/system",
    decision:
      "Seven field states, one primitive, documented on this page and used on every screen.",
  },
  {
    n: "09",
    title: "Complexity made navigable",
    href: "/firm/returns/r-0002/documents",
    decision:
      "284 documents on one return. Facets, search, grouping, and ⌘K across every object type.",
  },
  {
    n: "10",
    title: "Trustworthy AI",
    href: "/firm/returns/r-0002/issues",
    decision:
      "Confidence in words first, evidence one click away, and correcting the AI records who overrode it.",
  },
];

export default function CaseStudyMap() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Map of the ten case study challenges"
        className="rounded-md border border-line px-2 py-1 text-[12px] text-ink-2 hover:bg-sunken hover:text-ink transition-colors"
      >
        Case study map
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-ink/25 backdrop-blur-[2px] flex justify-end"
          onClick={() => setOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="w-[440px] max-w-full h-full overflow-y-auto border-l border-line bg-surface sheet-in"
          >
            <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-line bg-surface px-5 py-3.5">
              <div>
                <h2 className="text-[14px] font-semibold">Ten challenges, one product</h2>
                <p className="mt-0.5 text-[12px] text-ink-3">
                  Each one links to where it actually lives.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[18px] leading-none text-ink-3 hover:text-ink"
              >
                ×
              </button>
            </div>

            <ol>
              {MAP.map((m) => (
                <li key={m.n} className="border-b border-line last:border-0">
                  <Link
                    href={m.href}
                    onClick={() => setOpen(false)}
                    className="flex gap-3 px-5 py-3 hover:bg-sunken transition-colors"
                  >
                    <span className="mt-0.5 font-mono text-[11px] font-semibold text-ink-3">
                      {m.n}
                    </span>
                    <span>
                      <span className="block text-[13px] font-medium text-ink">{m.title}</span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-ink-2">
                        {m.decision}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="px-5 py-4 text-[11.5px] leading-relaxed text-ink-3">
              No backend, no OCR, no model. Documents are HTML facsimiles and all AI output is
              fabricated. Everything you can click, edit, filter, or persist is real.
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
