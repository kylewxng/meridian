"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-line bg-surface ${pad ? "p-4" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  right,
  sub,
}: {
  children: ReactNode;
  right?: ReactNode;
  sub?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-2.5">
      <div>
        <h2 className="text-[13px] font-semibold tracking-tight text-ink">{children}</h2>
        {sub && <p className="text-[12px] text-ink-3 mt-0.5">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

const TONE = {
  neutral: "bg-sunken text-ink-2 border-line",
  accent: "bg-accent-soft text-accent border-accent-line",
  ai: "bg-ai-soft text-ai border-ai-line",
  caution: "bg-caution-soft text-caution border-caution-line",
  blocked: "bg-blocked-soft text-blocked border-blocked-line",
  done: "bg-done-soft text-done border-done-line",
} as const;

export function Badge({
  children,
  tone = "neutral",
  title,
}: {
  children: ReactNode;
  tone?: keyof typeof TONE;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${TONE[tone]}`}
    >
      {children}
    </span>
  );
}

export function Btn({
  children,
  onClick,
  href,
  variant = "default",
  size = "md",
  disabled,
  title,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "default" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  title?: string;
  className?: string;
}) {
  const sizes = {
    sm: "px-2 py-1 text-[12px]",
    md: "px-3 py-1.5 text-[13px]",
    lg: "px-4 py-2.5 text-[15px]",
  };
  const variants = {
    primary:
      "bg-accent text-white border-accent hover:brightness-110 disabled:bg-ink-3 disabled:border-ink-3",
    default: "bg-surface text-ink border-line-strong hover:bg-sunken",
    ghost: "bg-transparent text-ink-2 border-transparent hover:bg-sunken hover:text-ink",
    danger: "bg-surface text-blocked border-blocked-line hover:bg-blocked-soft",
  };
  const cls = `inline-flex items-center justify-center gap-1.5 rounded-md border font-medium transition-all duration-150 ${sizes[size]} ${variants[variant]} ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  } ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={cls} title={title}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title} className={cls}>
      {children}
    </button>
  );
}

// A control the role cannot use stays on screen and says why. Hiding it would
// teach the user nothing about where the boundary is.
export function GatedBtn({
  allowed,
  reason,
  children,
  ...rest
}: {
  allowed: boolean;
  reason: string;
} & Parameters<typeof Btn>[0]) {
  if (allowed) return <Btn {...rest}>{children}</Btn>;
  return (
    <span className="inline-flex items-center gap-1.5">
      <Btn {...rest} disabled title={reason}>
        {children}
      </Btn>
      <span className="text-[11px] text-ink-3 max-w-52 leading-tight">{reason}</span>
    </span>
  );
}

export function Empty({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-line px-4 py-10 text-center">
      <p className="text-[13px] font-medium text-ink-2">{title}</p>
      {sub && <p className="text-[12px] text-ink-3 mt-1">{sub}</p>}
    </div>
  );
}

export function Meter({ pct, tone = "accent" }: { pct: number; tone?: "accent" | "caution" | "done" }) {
  const c = { accent: "bg-accent", caution: "bg-caution", done: "bg-done" }[tone];
  return (
    <span className="inline-block h-1.5 w-16 rounded-full bg-line overflow-hidden align-middle">
      <span className={`block h-full rounded-full ${c}`} style={{ width: `${pct * 100}%` }} />
    </span>
  );
}
