"use client";

import { useState } from "react";
import Link from "next/link";
import Value, { StateChip, STATE_SPEC } from "@/components/field/Value";
import { ConfidenceChip } from "@/components/ai/AiCard";
import { Badge, Btn, Card, GatedBtn, SectionTitle } from "@/components/common/ui";
import type { FieldState } from "@/data/types";

const ORDER: FieldState[] = [
  "editable",
  "calculated",
  "ai-suggested",
  "verified",
  "needs-approval",
  "locked",
  "client-answer",
];

const SAMPLE: Record<FieldState, number> = {
  editable: 8450,
  calculated: 295978,
  "ai-suggested": 62400,
  verified: 209625,
  "needs-approval": 18922,
  locked: 30000,
  "client-answer": 1,
};

export default function SystemPage() {
  const [demo, setDemo] = useState(8450);
  const [picked, setPicked] = useState<FieldState>("ai-suggested");

  return (
    <div className="mx-auto max-w-[900px] p-5 space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">The interaction language</h1>
        <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-ink-2">
          A tax return shows AI output, extracted figures, calculations, reviewer decisions, and
          the client&rsquo;s own words on the same screen. Rather than styling each of those
          per screen, the product has seven states and one primitive. Everything you see
          anywhere in Meridian renders through it, which is why the same treatment means the
          same thing on the review screen, the questionnaire, and the client&rsquo;s document
          list.
        </p>
      </div>

      <Card>
        <SectionTitle sub="Click one to see it in context below.">
          The seven states
        </SectionTitle>
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-sunken/60 text-[11px] uppercase tracking-[0.05em] text-ink-3">
              <th className="py-1.5 text-left font-medium">State</th>
              <th className="py-1.5 text-left font-medium">Looks like</th>
              <th className="py-1.5 text-left font-medium">Means</th>
              <th className="py-1.5 text-center font-medium">Click</th>
              <th className="py-1.5 text-center font-medium">Edit</th>
            </tr>
          </thead>
          <tbody>
            {ORDER.map((s) => {
              const spec = STATE_SPEC[s];
              return (
                <tr
                  key={s}
                  onClick={() => setPicked(s)}
                  className={`cursor-pointer border-b border-line last:border-0 ${
                    picked === s ? "bg-accent-soft" : "hover:bg-sunken"
                  }`}
                >
                  <td className="py-2 pr-3">
                    <StateChip state={s} />
                  </td>
                  <td className="py-2 pr-3">
                    <Value
                      state={s}
                      value={SAMPLE[s]}
                      display={s === "client-answer" ? "Yes" : undefined}
                    />
                  </td>
                  <td className="py-2 pr-3 text-[12.5px] leading-snug text-ink-2">
                    {spec.meaning}
                  </td>
                  <td className="py-2 text-center text-[13px]">
                    {spec.canClick ? "✓" : "—"}
                  </td>
                  <td className="py-2 text-center text-[13px]">
                    {spec.canEdit ? "✓" : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <SectionTitle sub="Double-click the number. It is a real edit that persists.">
            Try it
          </SectionTitle>
          <div className="rounded border border-line bg-sunken/50 p-3">
            <p className="text-[11px] text-ink-3">Schedule A · line 11</p>
            <p className="text-[13px] text-ink">Charitable contributions</p>
            <div className="mt-1.5">
              <Value
                state={picked}
                value={demo}
                display={picked === "client-answer" ? "Yes" : undefined}
                onCommit={setDemo}
              />
            </div>
            <p className="mt-2 border-t border-line pt-2 text-[12px] text-ink-2">
              {STATE_SPEC[picked].meaning}
            </p>
          </div>
        </Card>

        <Card>
          <SectionTitle sub="Colour is never the only signal. Each state also has a glyph and a distinct shape.">
            Why it is built this way
          </SectionTitle>
          <ul className="space-y-1.5 text-[12.5px] leading-snug text-ink-2">
            <li>
              <strong className="text-ink">Treatment answers what you can do.</strong> A dashed
              underline means type here. A tinted left rule means somebody has to decide.
            </li>
            <li>
              <strong className="text-ink">Glyph answers where it came from.</strong> ◆ for AI,
              ✓ for a person who checked it, ❝ for the client&rsquo;s own words, ƒ for
              arithmetic.
            </li>
            <li>
              <strong className="text-ink">Locked always says why.</strong> A control that
              refuses without a reason teaches nothing.
            </li>
            <li>
              <strong className="text-ink">AI never wins silently.</strong> Once a person
              corrects a value, it stops being AI-suggested and carries their name.
            </li>
          </ul>
        </Card>
      </div>

      <Card>
        <SectionTitle sub="The same rule applies to actions, not just values.">
          Permissions are shown, not hidden
        </SectionTitle>
        <div className="flex flex-wrap items-start gap-4">
          <div>
            <p className="mb-1.5 text-[11.5px] text-ink-3">Available</p>
            <Btn variant="primary">Mark verified</Btn>
          </div>
          <div>
            <p className="mb-1.5 text-[11.5px] text-ink-3">Blocked, with the reason attached</p>
            <GatedBtn
              allowed={false}
              reason="E-filing unlocks after a reviewer signs off."
            >
              Transmit to the IRS
            </GatedBtn>
          </div>
        </div>
        <p className="mt-3 border-t border-line pt-2.5 text-[12.5px] leading-snug text-ink-2">
          Anything a peer role can do but yours cannot stays visible and disabled, so the
          boundary is learnable. Only things that would be pure noise for a role are hidden
          outright, like billing for a seasonal preparer.
        </p>
      </Card>

      <Card>
        <SectionTitle sub="Confidence is said in words before it is said in a number.">
          AI confidence
        </SectionTitle>
        <div className="flex flex-wrap gap-2">
          <ConfidenceChip confidence="high" score={0.93} showScore />
          <ConfidenceChip confidence="medium" score={0.71} showScore />
          <ConfidenceChip confidence="low" score={0.44} showScore />
        </div>
        <p className="mt-2.5 text-[12.5px] leading-snug text-ink-2">
          A bare 71% invites everyone to invent their own threshold for what is safe. The band
          states the recommended posture and the percentage sits behind it for anyone who wants
          it. Hover any chip to read what the band means.
        </p>
      </Card>

      <Card>
        <SectionTitle>Colour meanings, fixed across the product</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent">Accent · the firm, actions, selection</Badge>
          <Badge tone="ai">Violet · anything a model produced</Badge>
          <Badge tone="caution">Amber · needs a decision, or internal only</Badge>
          <Badge tone="blocked">Rose · blocked or overdue</Badge>
          <Badge tone="done">Green · settled, verified, filed</Badge>
        </div>
        <p className="mt-2.5 text-[12.5px] text-ink-2">
          No colour is used decoratively anywhere in the product.
        </p>
      </Card>

      <p className="pb-6 text-[12.5px] text-ink-3">
        See the system carrying real data on the{" "}
        <Link href="/firm/returns/r-0002/review" className="text-accent hover:underline">
          review screen
        </Link>
        , the{" "}
        <Link href="/client/questions" className="text-accent hover:underline">
          client questionnaire
        </Link>
        , and the{" "}
        <Link href="/client/documents" className="text-accent hover:underline">
          client document list
        </Link>
        .
      </p>
    </div>
  );
}
