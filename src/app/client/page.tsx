"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RETURNS } from "@/data/returns";
import { QUESTIONS, TASKS } from "@/data/tasks";
import { THREADS } from "@/data/threads";
import { fmtRelative } from "@/data/constants";
import StageRail from "@/components/status/StageRail";
import { Badge, Btn, Card, SectionTitle } from "@/components/common/ui";
import { useStore } from "@/lib/store";

export default function ClientHome() {
  const { me, context, onboarded, finishOnboarding, uploaded, upload, tasksDone, toggleTask, answers } =
    useStore();

  // Marcus lands here when he flips to his personal context, so the client home
  // has to work for a staff member too.
  const clientId = context === "personal" ? "c-reyes" : me.clientId;
  const ret = useMemo(
    () => RETURNS.find((r) => r.clientId === clientId) ?? RETURNS[0],
    [clientId],
  );

  const tasks = TASKS.filter((t) => t.returnId === ret.id && t.owner === "client");
  const openTasks = tasks.filter((t) => !(tasksDone[t.id] ?? t.done));
  const questions = QUESTIONS.filter((q) => q.returnId === ret.id);
  const openQuestions = questions.filter((q) => !q.answer && !answers[q.id]);

  const firstRun = Boolean(me.firstRun) && !onboarded && context !== "personal";

  if (firstRun) {
    return (
      <FirstRun
        name={me.name.split(" ")[0]}
        uploadedCount={uploaded.length}
        onUpload={() => upload("W-2 2025.pdf")}
        answered={questions.filter((q) => answers[q.id]).length}
        totalQuestions={questions.length}
        onDone={finishOnboarding}
      />
    );
  }

  const nextThing = openTasks
    .slice()
    .sort((a, b) => +new Date(a.dueOn) - +new Date(b.dueOn))[0];

  return (
    <div className="mx-auto max-w-[820px] p-5 space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">
          Hi {me.name.split(" ")[0]}
        </h1>
        <p className="text-[14px] text-ink-2">
          {openTasks.length === 0
            ? "Nothing needs you right now. We will let you know."
            : `${openTasks.length} thing${openTasks.length === 1 ? "" : "s"} need you.`}
        </p>
      </div>

      {nextThing && (
        <div className="rounded-xl border border-accent-line bg-accent-soft/50 p-5">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">
            Do this next
          </p>
          <h2 className="mt-1 text-[19px] font-semibold tracking-tight">{nextThing.title}</h2>
          {nextThing.detail && (
            <p className="mt-1 text-[14px] text-ink-2">{nextThing.detail}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Btn
              variant="primary"
              size="lg"
              href={nextThing.kind === "answer" ? "/client/questions" : "/client/documents"}
            >
              {nextThing.kind === "answer" ? "Answer the questions" : "Upload it now"}
            </Btn>
            <span
              className={`text-[13px] ${
                new Date(nextThing.dueOn) < new Date("2026-03-10T09:00:00")
                  ? "text-blocked"
                  : "text-ink-3"
              }`}
            >
              Due {fmtRelative(new Date(nextThing.dueOn))}
            </span>
          </div>
        </div>
      )}

      <Card>
        <SectionTitle sub="The same six stages your preparer sees.">
          Where your return is
        </SectionTitle>
        <StageRail status={ret.status} audience="client" clientName="you" />
        <div className="mt-3 border-t border-line pt-2.5">
          <Link href="/client/status" className="text-[13px] text-accent hover:underline">
            See the full history →
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <SectionTitle>Your list</SectionTitle>
          {tasks.length === 0 ? (
            <p className="text-[13px] text-ink-3">Nothing assigned to you.</p>
          ) : (
            <ul className="space-y-1.5">
              {tasks.map((t) => {
                const done = tasksDone[t.id] ?? t.done;
                return (
                  <li key={t.id} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={(e) => toggleTask(t.id, e.target.checked)}
                      className="mt-1 h-3.5 w-3.5 accent-[#0e6e6e]"
                    />
                    <span className={`text-[13.5px] ${done ? "text-ink-3 line-through" : "text-ink"}`}>
                      {t.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card>
          <SectionTitle>Open with your preparer</SectionTitle>
          {openQuestions.length === 0 &&
            THREADS.filter((t) => t.returnId === ret.id && !t.resolved).length === 0 && (
              <p className="text-[13px] text-ink-3">
                Nothing open. Your preparer will reach out here if they need anything.
              </p>
            )}
          <ul className="space-y-1.5">
            {openQuestions.length > 0 && (
              <li className="flex items-center gap-2 text-[13.5px]">
                <Badge tone="caution">{openQuestions.length}</Badge>
                <Link href="/client/questions" className="text-accent hover:underline">
                  question{openQuestions.length === 1 ? "" : "s"} to answer
                </Link>
              </li>
            )}
            {THREADS.filter((t) => t.returnId === ret.id && !t.resolved).map((t) => (
              <li key={t.id} className="text-[13.5px]">
                <Link
                  href={`/client/messages?thread=${t.id}`}
                  className="text-accent hover:underline"
                >
                  {t.subject}
                </Link>
                <span className="ml-1.5 text-[12px] text-ink-3">on {t.anchor.label}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

// Before onboarding there is one screen with one action. Navigation, documents,
// messages and status are all withheld until they mean something.
function FirstRun({
  name,
  uploadedCount,
  onUpload,
  answered,
  totalQuestions,
  onDone,
}: {
  name: string;
  uploadedCount: number;
  onUpload: () => void;
  answered: number;
  totalQuestions: number;
  onDone: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const step = uploadedCount === 0 ? 1 : answered < totalQuestions ? 2 : 3;

  return (
    <div className="mx-auto max-w-[600px] px-5 py-12">
      <ol className="mb-8 flex items-center gap-2">
        {["Send us your W-2", "Answer 4 questions", "We take it from here"].map((label, i) => {
          const n = i + 1;
          return (
            <li key={label} className="min-w-0 flex-1">
              <div
                className={`h-1 rounded-full ${
                  n < step ? "bg-done" : n === step ? "bg-accent" : "bg-line"
                }`}
              />
              <p
                className={`mt-1.5 truncate text-[12.5px] ${
                  n === step ? "font-semibold text-ink" : "text-ink-3"
                }`}
              >
                {label}
              </p>
            </li>
          );
        })}
      </ol>

      {step === 1 && (
        <>
          <h1 className="text-[26px] font-semibold tracking-tight">
            Welcome, {name}. One thing to do.
          </h1>
          <p className="mt-1.5 text-[15px] text-ink-2">
            Send us your 2025 W-2 and we will start your return. It takes about a minute.
          </p>

          <button
            onClick={onUpload}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              onUpload();
            }}
            className={`mt-5 w-full rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
              dragging
                ? "border-accent bg-accent-soft"
                : "border-line-strong bg-surface hover:border-accent hover:bg-accent-soft/40"
            }`}
          >
            <p className="text-[17px] font-semibold text-ink">Upload your W-2</p>
            <p className="mt-1 text-[13.5px] text-ink-2">
              Drag it here, or click to pick a file. A photo works.
            </p>
          </button>

          <p className="mt-4 text-center text-[13px] text-ink-3">
            Do not have it yet?{" "}
            <button onClick={onUpload} className="text-accent underline">
              Skip ahead for this demo
            </button>
          </p>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="text-[26px] font-semibold tracking-tight">Got it. Four quick questions.</h1>
          <p className="mt-1.5 text-[15px] text-ink-2">
            Your W-2 is in and extraction is running. These four answers cover almost everyone.
          </p>
          <div className="mt-5 rounded-xl border border-line bg-surface p-5">
            <p className="text-[13.5px] text-ink-2">
              {answered} of {totalQuestions} answered so far.
            </p>
            <Btn variant="primary" size="lg" href="/client/questions" className="mt-3 w-full">
              Start answering
            </Btn>
          </div>
          <p className="mt-4 text-center text-[13px] text-ink-3">
            <button onClick={onDone} className="text-accent underline">
              Skip to the finished view
            </button>{" "}
            to see how the product changes once onboarding is done.
          </p>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="text-[26px] font-semibold tracking-tight">That is everything we need.</h1>
          <p className="mt-1.5 text-[15px] text-ink-2">
            Marcus is preparing your return now. We will message you if anything comes up, and
            you will get the finished return to approve before we file.
          </p>
          <Btn variant="primary" size="lg" onClick={onDone} className="mt-5 w-full">
            Go to my home page
          </Btn>
          <p className="mt-3 text-center text-[13px] text-ink-3">
            Your full navigation appears from here on, because now there is something in each
            section.
          </p>
        </>
      )}
    </div>
  );
}
