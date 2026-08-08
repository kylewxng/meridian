"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { use } from "react";
import { getReturn } from "@/data/returns";
import { fmtDate, money } from "@/data/constants";
import Breadcrumbs from "@/components/shell/Breadcrumbs";
import { StatusBadge } from "@/components/status/StageRail";
import { Badge } from "@/components/common/ui";

const TABS = [
  { seg: "", label: "Overview" },
  { seg: "review", label: "Review" },
  { seg: "documents", label: "Documents" },
  { seg: "issues", label: "AI findings" },
  { seg: "messages", label: "Messages" },
];

export default function ReturnLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pathname = usePathname();
  const ret = getReturn(id);

  if (!ret) {
    return (
      <div className="p-8 text-[13px] text-ink-2">
        No return with id {id}.{" "}
        <Link href="/firm/returns" className="text-accent underline">
          Back to all returns
        </Link>
      </div>
    );
  }

  const base = `/firm/returns/${id}`;
  const current = pathname.replace(base, "").replace(/^\//, "").split("?")[0];

  return (
    <div className="flex flex-col">
      {/* Contextual header. Global nav stays in the top bar and never changes;
          this layer belongs to the object you are inside. */}
      <div className="border-b border-line bg-surface px-4 pt-2.5">
        <Breadcrumbs
          items={[
            { label: "All returns", href: "/firm/returns" },
            { label: ret.clientName, kind: `${ret.entity} ${ret.year}` },
          ]}
        />

        <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
          <h1 className="text-[17px] font-semibold tracking-tight">{ret.clientName}</h1>
          <StatusBadge status={ret.status} />
          <Badge>Due {fmtDate(new Date(ret.dueOn))}</Badge>
          <Badge>{ret.assignedTo}</Badge>
          {ret.refund !== 0 && (
            <Badge tone={ret.refund > 0 ? "done" : "caution"}>
              {ret.refund > 0 ? "Refund" : "Owes"} {money(Math.abs(ret.refund))}
            </Badge>
          )}
        </div>

        <nav className="mt-2.5 flex gap-0.5">
          {TABS.map((t) => {
            const href = t.seg ? `${base}/${t.seg}` : base;
            const active = current === t.seg;
            return (
              <Link
                key={t.seg}
                href={href}
                className={`-mb-px rounded-t-md px-3 py-1.5 text-[12.5px] border-b-2 transition-colors ${
                  active
                    ? "border-accent font-semibold text-ink"
                    : "border-transparent text-ink-2 hover:border-line-strong hover:text-ink"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </div>
  );
}
