"use client";

import { useEffect, useRef, useState } from "react";
import type { FieldState } from "@/data/types";
import { money } from "@/data/constants";

// One rule drives the whole system: the treatment answers "what can I do with
// this", and the glyph answers "where did it come from". Colour is never the
// only signal, because a colour alone is not a sentence.
export const STATE_SPEC: Record<
  FieldState,
  {
    label: string;
    glyph: string;
    meaning: string;
    canClick: boolean;
    canEdit: boolean;
    tone: string;
    glyphTone: string;
  }
> = {
  editable: {
    label: "Editable",
    glyph: "✎",
    meaning: "You can change this directly. Nothing is waiting on it.",
    canClick: true,
    canEdit: true,
    tone: "text-ink",
    glyphTone: "text-ink-3",
  },
  calculated: {
    label: "Calculated",
    glyph: "ƒ",
    meaning: "Derived from other lines. Change the inputs, not this.",
    canClick: true,
    canEdit: false,
    tone: "text-ink",
    glyphTone: "text-ink-3",
  },
  "ai-suggested": {
    label: "AI suggested",
    glyph: "◆",
    meaning: "Extracted by AI, not yet checked by a person.",
    canClick: true,
    canEdit: true,
    tone: "text-ink",
    glyphTone: "text-ai",
  },
  verified: {
    label: "Verified",
    glyph: "✓",
    meaning: "A person checked this against the source and signed for it.",
    canClick: true,
    canEdit: true,
    tone: "text-ink",
    glyphTone: "text-done",
  },
  "needs-approval": {
    label: "Needs approval",
    glyph: "!",
    meaning: "Blocked. Somebody has to accept or correct it before filing.",
    canClick: true,
    canEdit: true,
    tone: "text-ink",
    glyphTone: "text-caution",
  },
  locked: {
    label: "Locked",
    glyph: "⊘",
    meaning: "Cannot change here. The reason is always stated.",
    canClick: true,
    canEdit: false,
    tone: "text-ink-2",
    glyphTone: "text-ink-3",
  },
  "client-answer": {
    label: "Client answer",
    glyph: "”",
    meaning: "Came from the client, in their words. Not the firm's assertion.",
    canClick: true,
    canEdit: false,
    tone: "text-ink",
    glyphTone: "text-accent",
  },
};

function shell(state: FieldState, active: boolean) {
  const base =
    "group inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 -mx-1.5 text-left transition-colors duration-150";
  const ring = active ? " ring-2 ring-accent bg-accent-soft" : "";
  switch (state) {
    case "editable":
      return base + " hover:bg-sunken border-b border-dashed border-line-strong" + ring;
    case "ai-suggested":
      return base + " bg-ai-soft/60 hover:bg-ai-soft border-l-2 border-ai" + ring;
    case "needs-approval":
      return base + " bg-caution-soft hover:brightness-[0.98] border-l-2 border-caution" + ring;
    case "verified":
      return base + " hover:bg-sunken" + ring;
    case "locked":
      return base + " bg-sunken/70 cursor-default" + ring;
    case "client-answer":
      return base + " bg-accent-soft/50 hover:bg-accent-soft border-l-2 border-accent-line" + ring;
    default:
      return base + " hover:bg-sunken" + ring;
  }
}

type Props = {
  state: FieldState;
  value: number;
  display?: string;
  onSelect?: () => void;
  onCommit?: (v: number) => void;
  active?: boolean;
  size?: "sm" | "md" | "lg";
  cents?: boolean;
  hint?: string;
};

export default function Value({
  state,
  value,
  display,
  onSelect,
  onCommit,
  active = false,
  size = "md",
  cents = false,
  hint,
}: Props) {
  const spec = STATE_SPEC[state];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const text =
    size === "lg" ? "text-[19px]" : size === "sm" ? "text-[12px]" : "text-[14px]";

  const commit = () => {
    const n = Number(draft.replace(/[^0-9.-]/g, ""));
    setEditing(false);
    if (!Number.isNaN(n) && n !== value) onCommit?.(n);
    else setDraft(String(value));
  };

  if (editing) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(String(value));
              setEditing(false);
            }
          }}
          className={`tnum ${text} font-medium w-32 rounded border border-accent bg-surface px-1.5 py-0.5 outline-none`}
        />
        <span className="text-[10px] text-ink-3">enter to save</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      title={hint ?? spec.meaning}
      onClick={() => onSelect?.()}
      onDoubleClick={() => {
        if (spec.canEdit && onCommit) setEditing(true);
      }}
      className={shell(state, active)}
    >
      <span className={`tnum ${text} font-medium ${spec.tone}`}>
        {display ?? money(value, { cents })}
      </span>
      <span className={`text-[11px] leading-none ${spec.glyphTone}`} aria-hidden>
        {spec.glyph}
      </span>
      {spec.canEdit && onCommit && (
        <span className="text-[10px] text-ink-3 opacity-0 group-hover:opacity-100 transition-opacity">
          dbl-click
        </span>
      )}
    </button>
  );
}

export function StateChip({ state, small }: { state: FieldState; small?: boolean }) {
  const spec = STATE_SPEC[state];
  const tone: Record<FieldState, string> = {
    editable: "bg-sunken text-ink-2 border-line",
    calculated: "bg-sunken text-ink-2 border-line",
    "ai-suggested": "bg-ai-soft text-ai border-ai-line",
    verified: "bg-done-soft text-done border-done-line",
    "needs-approval": "bg-caution-soft text-caution border-caution-line",
    locked: "bg-sunken text-ink-3 border-line",
    "client-answer": "bg-accent-soft text-accent border-accent-line",
  };
  return (
    <span
      title={spec.meaning}
      className={`inline-flex items-center gap-1 rounded border px-1.5 ${
        small ? "text-[10px] py-0" : "text-[11px] py-0.5"
      } font-medium ${tone[state]}`}
    >
      <span aria-hidden>{spec.glyph}</span>
      {spec.label}
    </span>
  );
}
