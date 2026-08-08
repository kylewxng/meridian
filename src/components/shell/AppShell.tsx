"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { hidden } from "@/lib/permissions";
import PersonaSwitcher from "./PersonaSwitcher";
import CommandPalette from "./CommandPalette";
import CaseStudyMap from "./CaseStudyMap";

type NavItem = { href: string; label: string; cap?: Parameters<typeof hidden>[1] };

const FIRM_NAV: NavItem[] = [
  { href: "/firm", label: "My work" },
  { href: "/firm/returns", label: "Returns" },
  { href: "/firm/team", label: "Team", cap: "assign.staff" },
];

const CLIENT_NAV: NavItem[] = [
  { href: "/client", label: "Home" },
  { href: "/client/documents", label: "Documents" },
  { href: "/client/questions", label: "Questions" },
  { href: "/client/messages", label: "Messages" },
  { href: "/client/status", label: "My return" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { me, context, onboarded, ready } = useStore();
  const pathname = usePathname();

  const onClientSide = me.side === "client" || context === "personal";
  // A first-run client gets one destination. Navigation appears when there is
  // something to navigate to.
  const firstRun = Boolean(me.firstRun) && !onboarded;
  const nav = onClientSide
    ? firstRun
      ? CLIENT_NAV.slice(0, 1)
      : CLIENT_NAV
    : FIRM_NAV.filter((n) => !n.cap || !hidden(me.role, n.cap));

  return (
    <div className="min-h-screen flex flex-col">
      {context === "personal" && <PersonalContextBanner />}

      <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md">
        <div className="flex h-12 items-center gap-4 px-4">
          {/* The nav already carries each side's landing page. The mark goes to
              the entry page, which is otherwise only reachable by resetting. */}
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded bg-accent text-[13px] font-bold text-white">
              M
            </span>
            <span className="text-[14px] font-semibold tracking-tight">Meridian</span>
          </Link>

          <nav className="flex items-center gap-0.5">
            {nav.map((n) => {
              const active =
                n.href === "/firm" || n.href === "/client"
                  ? pathname === n.href
                  : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`rounded px-2.5 py-1 text-[13px] transition-colors ${
                    active
                      ? "bg-sunken font-medium text-ink"
                      : "text-ink-2 hover:bg-sunken hover:text-ink"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            {!firstRun && <CommandPalette />}
            <CaseStudyMap />
            <PersonaSwitcher />
          </div>
        </div>
      </header>

      <main className={`flex-1 ${onClientSide ? "client-scope" : ""}`}>
        {ready ? children : <div className="p-8 text-[12px] text-ink-3">Loading…</div>}
      </main>

      <WorkflowPill />
    </div>
  );
}

function PersonalContextBanner() {
  const { me, setContext } = useStore();
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 bg-ink px-4 py-1.5 text-white">
      <span className="rounded bg-white/15 px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide">
        Personal
      </span>
      <span className="text-[12px]">
        You are looking at <strong className="font-semibold">your own 2025 return</strong> as a
        client of the firm, not as {me.roleLabel.toLowerCase()}. Firm tools are hidden here.
      </span>
      <button
        onClick={() => {
          setContext("firm");
          router.push("/firm");
        }}
        className="ml-auto rounded border border-white/25 px-2 py-0.5 text-[11.5px] hover:bg-white/10 transition-colors"
      >
        Back to firm workspace
      </button>
    </div>
  );
}

// Jumping to a related object from inside a task leaves a way back. Three deep
// is enough for real workflows and shallow enough to stay understandable.
function WorkflowPill() {
  const { workflow, popWorkflow } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  if (!workflow.length) return null;

  const top = workflow[workflow.length - 1];
  if (pathname === top.href.split("?")[0] && !top.href.includes("?")) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5 rounded-full border border-line bg-surface pl-1 pr-1 py-1 shadow-lg shadow-black/10 rise">
      <button
        onClick={() => {
          popWorkflow();
          router.push(top.href);
        }}
        className="flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-[12px] font-medium text-white hover:brightness-125 transition-all"
      >
        <span>↩</span>
        <span>Back to {top.label}</span>
      </button>
      {workflow.length > 1 && (
        <span className="px-1.5 text-[11px] text-ink-3">+{workflow.length - 1} more</span>
      )}
    </div>
  );
}
