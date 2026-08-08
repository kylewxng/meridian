"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PERSONAS, persona as findPersona } from "@/data/personas";
import type { FieldState, Message, Persona } from "@/data/types";

export type FieldOverride = {
  value?: number;
  state?: FieldState;
  by?: string;
  on?: string;
  note?: string;
};

export type Crumb = { label: string; href: string; kind: string };

type State = {
  personaId: string;
  // Marcus is staff and a client. This is which hat he is wearing.
  context: "firm" | "personal";
  fieldOverrides: Record<string, FieldOverride>;
  findingStatus: Record<string, "open" | "accepted" | "rejected" | "corrected">;
  tasksDone: Record<string, boolean>;
  answers: Record<string, string>;
  extraMessages: Record<string, Message[]>;
  resolvedThreads: Record<string, boolean>;
  uploaded: string[];
  onboarded: boolean;
  // Up to three deep. Powers the "back to what you were doing" pill.
  workflow: Crumb[];
};

const INITIAL: State = {
  personaId: "marcus",
  context: "firm",
  fieldOverrides: {},
  findingStatus: {},
  tasksDone: {},
  answers: {},
  extraMessages: {},
  resolvedThreads: {},
  uploaded: [],
  onboarded: false,
  workflow: [],
};

const KEY = "meridian.state.v1";

type Ctx = State & {
  me: Persona;
  ready: boolean;
  setPersona: (id: string) => void;
  setContext: (c: "firm" | "personal") => void;
  overrideField: (id: string, o: FieldOverride) => void;
  setFinding: (id: string, s: "open" | "accepted" | "rejected" | "corrected") => void;
  toggleTask: (id: string, done: boolean) => void;
  answer: (id: string, text: string) => void;
  addMessage: (threadId: string, m: Message) => void;
  resolveThread: (id: string, v: boolean) => void;
  upload: (name: string) => void;
  finishOnboarding: () => void;
  pushWorkflow: (c: Crumb) => void;
  popWorkflow: () => void;
  clearWorkflow: () => void;
  reset: () => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(INITIAL);
  // Nothing reads localStorage during render, so the server and the first
  // client paint always agree.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState({ ...INITIAL, ...JSON.parse(raw) });
    } catch {
      // A corrupt blob just means the demo starts fresh.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, ready]);

  const patch = useCallback((fn: (s: State) => State) => setState(fn), []);

  const value = useMemo<Ctx>(() => {
    const me = findPersona(state.personaId);
    return {
      ...state,
      me,
      ready,
      setPersona: (id) =>
        patch((s) => ({
          ...s,
          personaId: id,
          context: "firm",
          workflow: [],
        })),
      setContext: (c) => patch((s) => ({ ...s, context: c, workflow: [] })),
      overrideField: (id, o) =>
        patch((s) => ({
          ...s,
          fieldOverrides: { ...s.fieldOverrides, [id]: { ...s.fieldOverrides[id], ...o } },
        })),
      setFinding: (id, st) =>
        patch((s) => ({ ...s, findingStatus: { ...s.findingStatus, [id]: st } })),
      toggleTask: (id, done) =>
        patch((s) => ({ ...s, tasksDone: { ...s.tasksDone, [id]: done } })),
      answer: (id, text) =>
        patch((s) => ({ ...s, answers: { ...s.answers, [id]: text } })),
      addMessage: (threadId, m) =>
        patch((s) => ({
          ...s,
          extraMessages: {
            ...s.extraMessages,
            [threadId]: [...(s.extraMessages[threadId] ?? []), m],
          },
        })),
      resolveThread: (id, v) =>
        patch((s) => ({ ...s, resolvedThreads: { ...s.resolvedThreads, [id]: v } })),
      upload: (name) =>
        patch((s) => ({ ...s, uploaded: [...s.uploaded, name] })),
      finishOnboarding: () => patch((s) => ({ ...s, onboarded: true })),
      pushWorkflow: (c) =>
        patch((s) => {
          if (s.workflow[s.workflow.length - 1]?.href === c.href) return s;
          return { ...s, workflow: [...s.workflow, c].slice(-3) };
        }),
      popWorkflow: () => patch((s) => ({ ...s, workflow: s.workflow.slice(0, -1) })),
      clearWorkflow: () => patch((s) => ({ ...s, workflow: [] })),
      reset: () => {
        try {
          window.localStorage.removeItem(KEY);
        } catch {}
        setState(INITIAL);
      },
    };
  }, [state, ready, patch]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore used outside StoreProvider");
  return c;
}

export { PERSONAS };
