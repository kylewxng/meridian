"use client";

import { PERSONAS } from "@/data/personas";
import { RETURNS } from "@/data/returns";
import { can } from "@/lib/permissions";
import type { Capability } from "@/lib/permissions";
import { Badge, Card, SectionTitle } from "@/components/common/ui";
import { useStore } from "@/lib/store";

const CAPS: { cap: Capability; label: string }[] = [
  { cap: "view.allReturns", label: "See every return" },
  { cap: "edit.returnFields", label: "Change figures" },
  { cap: "review.signOff", label: "Sign off" },
  { cap: "return.efile", label: "Transmit to the IRS" },
  { cap: "message.client", label: "Message clients" },
  { cap: "assign.staff", label: "Assign work" },
  { cap: "view.billing", label: "See billing" },
];

// One page that makes the role model legible rather than something you have to
// discover by bumping into disabled buttons.
export default function TeamPage() {
  const { me, setPersona } = useStore();
  const staff = PERSONAS.filter((p) => p.side === "firm");

  return (
    <div className="mx-auto max-w-[1000px] p-4 space-y-4">
      <div>
        <h1 className="text-[19px] font-semibold tracking-tight">One product, six roles</h1>
        <p className="mt-0.5 max-w-2xl text-[12.5px] leading-relaxed text-ink-2">
          Everybody gets the same shell, the same URLs, and the same vocabulary. What changes is
          which navigation items appear, which controls are live, and how much internal detail a
          screen shows. Nothing forks into a separate product.
        </p>
      </div>

      <Card pad={false}>
        <div className="border-b border-line px-4 py-2.5">
          <h2 className="text-[13px] font-semibold">Who can do what</h2>
          <p className="text-[12px] text-ink-3">
            A dash means blocked with a stated reason. Hover it to read the reason.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-wide text-ink-3">
                <th className="px-4 py-1.5 text-left font-medium">Role</th>
                {CAPS.map((c) => (
                  <th key={c.cap} className="px-2 py-1.5 text-center font-medium">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERSONAS.map((p) => (
                <tr
                  key={p.id}
                  className={`border-b border-line last:border-0 ${
                    p.id === me.id ? "bg-accent-soft/40" : ""
                  }`}
                >
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setPersona(p.id)}
                      className="text-left"
                      title="Switch to this role"
                    >
                      <span className="block text-[12.5px] font-medium text-ink hover:text-accent">
                        {p.roleLabel}
                      </span>
                      <span className="block text-[11px] text-ink-3">{p.name}</span>
                    </button>
                  </td>
                  {CAPS.map((c) => {
                    const g = can(p.role, c.cap);
                    return (
                      <td key={c.cap} className="px-2 py-2 text-center">
                        {g.allowed ? (
                          <span className="text-[13px] text-done">✓</span>
                        ) : (
                          <span
                            title={g.reason}
                            className={`text-[13px] ${g.hide ? "text-ink-3/40" : "text-ink-3"}`}
                          >
                            {g.hide ? "·" : "—"}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-line px-4 py-2 text-[11.5px] text-ink-3">
          — means the control is on screen but disabled with a reason. · means it is hidden
          entirely, which is reserved for things that would be pure noise for that role.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <SectionTitle sub="Marcus prepares returns and is also a client of his own firm.">
            The awkward case
          </SectionTitle>
          <p className="text-[12.5px] leading-snug text-ink-2">
            Rather than a second login, his account carries both contexts. Switching to his
            personal return puts a dark banner across the top of the whole app, hides every firm
            tool, and drops him into the client shell. The banner is deliberately hard to miss,
            because the failure mode here is doing firm work while you think you are a client,
            or worse, the reverse.
          </p>
          <button
            onClick={() => setPersona("marcus")}
            className="mt-2 text-[12.5px] text-accent hover:underline"
          >
            Switch to Marcus, then use the top-right menu to flip context →
          </button>
        </Card>

        <Card>
          <SectionTitle sub="Assignment across the firm right now.">Staffing</SectionTitle>
          <ul className="space-y-1.5">
            {staff.map((p) => {
              const n = RETURNS.filter((r) => r.assignedTo === p.name).length;
              const reviewing = RETURNS.filter((r) => r.reviewer === p.name).length;
              return (
                <li key={p.id} className="flex items-center gap-2 text-[12.5px]">
                  <span className="w-28 shrink-0 truncate text-ink">{p.name}</span>
                  <span className="text-ink-3">{p.roleLabel}</span>
                  <span className="ml-auto flex gap-1.5">
                    {n > 0 && <Badge>{n} preparing</Badge>}
                    {reviewing > 0 && <Badge tone="accent">{reviewing} to review</Badge>}
                  </span>
                </li>
              );
            })}
            <li className="flex items-center gap-2 border-t border-line pt-1.5 text-[12.5px]">
              <span className="w-28 shrink-0 text-blocked">Unassigned</span>
              <span className="ml-auto">
                <Badge tone="blocked">
                  {RETURNS.filter((r) => r.assignedTo === "Unassigned").length} returns
                </Badge>
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
