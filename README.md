# Meridian

**Live: https://meridian-dusky-one.vercel.app**

A client and CPA tax platform, built from scratch for the AI Engineer case study. It covers all ten challenges as one product rather than ten demos, because most of them are the same problem seen from different angles: challenges 01, 08 and 10 all live on the return review screen, 06 and 07 share a data model, and 04 and 09 are properties of the shell rather than screens.

Run it locally with `npm install && npm run dev`.

Start on the entry page and pick a persona, or jump straight in as a preparer at `/firm`. State lives in `localStorage`, so **Reset the demo** at the bottom of the persona switcher puts everything back.

## Where each challenge lives

There is a **Case study map** button in the top bar that opens a panel linking straight to each one, so you do not have to hunt.

| # | Challenge | Where |
|---|---|---|
| 01 | Source document traceability | `/firm/returns/r-0002/review` |
| 02 | Client and CPA collaboration | `/firm/returns/r-0002/messages` |
| 03 | Where to start | `/client` as Dana Whitfield |
| 04 | Getting lost in the app | Shell-wide, clearest on the review screen |
| 05 | Role-aware experiences | `/firm/team` plus the persona switcher |
| 06 | Return status and progress | `/client/status` and any return overview |
| 07 | An actionable dashboard | `/firm` |
| 08 | Clickable vs editable | `/system` |
| 09 | Complexity made navigable | `/firm/returns/r-0002/documents` and ⌘K |
| 10 | Trustworthy AI | `/firm/returns/r-0002/issues` |

Four got the deepest investment: 01 and 10, which together answer "why should I trust this number", plus 07 and 03, which answer "what do I do now" for the CPA and for the client.

## What is real and what is faked

**Real, actually running code:**

- All UI state and persistence. Editing a figure, accepting or correcting an AI suggestion, answering a question, sending a message, resolving a thread, and completing a task all persist to `localStorage` and survive navigation and refresh.
- The priority ranking in `src/lib/priority.ts`. Genuine scoring over 242 returns weighing deadline proximity, how long something has been blocked, review age, whether the client just replied, low-confidence field count, and dollars at stake. Each term that fires also pushes a sentence into `reasons`, which is why every dashboard row can explain its own rank.
- Search, filtering, and faceting. The ⌘K palette indexes 676 objects across seven types and searches them together.
- The permission model in `src/lib/permissions.ts`. A real capability matrix across six roles, enforced at the route level and not only in the navigation. A client who pastes a `/firm` URL is refused.
- Deep linking. Panel state lives in the URL, so `/firm/returns/r-0002/review?field=f1040.line7&doc=d-1099b-vantage&page=3&region=noncovered-block` restores the exact field, document, page, and highlight after a refresh.
- The traceability graph. Every field states its sources, the transform steps applied, and the resulting value.

**Faked, as the brief asks:**

- No backend, no database, no API routes, no auth. Switching persona is a dropdown.
- No OCR and no document parsing. Source documents are hand-built HTML facsimiles in `src/components/docs/Forms.tsx` rather than scans or PDFs.
- No model. Every AI finding, confidence score, and rationale in `src/data/aiFindings.ts` is written by hand in the shape a model response would take.
- The 238 generated returns and 385 generated documents come from a seeded PRNG, not real data.

## Decisions worth explaining

**Source documents are HTML, not images.** This is the decision the whole traceability feature rests on. Because a W-2 is a CSS grid with a stable id on every box, the highlight lands on an exact box rather than a guessed rectangle, with no OCR anywhere and no image assets. It also means a multi-page 1099-B can be paged through and text-selected.

**Seven field states, one primitive.** Everything that renders a value anywhere in the product goes through `<Value>`: editable, calculated, AI suggested, verified, needs approval, locked, client answer. The treatment answers what you can do with it and the glyph answers where it came from. Colour is never the only signal. This is documented with live examples on `/system`.

**A status is never a bare adjective.** "In progress" means different things to different people, so a status here is an object, not a label: stage, plus who owns the next action, plus what is blocking. Clients and staff see the same six stage names in the same order. What differs is that staff also get the internal substage, the SLA age, and blocker chips. The client sees stage, owner, and one plain sentence.

**Blocked actions stay visible and say why.** Hiding a control teaches nothing about where the boundary is, so anything a peer role can do but yours cannot is shown disabled with the reason attached. Only things that would be pure noise for a role, like billing for a seasonal preparer, are hidden outright. The rule is stated on `/system` and the full matrix is on `/firm/team`.

**Confidence is said in words before it is said in a number.** A bare 71% invites everyone to invent their own threshold for what is safe, so the AI cards lead with a band ("Confident", "Needs a look", "Do not rely on this") and keep the percentage one click behind it. The technical breakdown, including what the model is unsure about, is behind a "Why should I believe this?" toggle rather than on screen at all times.

**Correcting the AI is a first-class action.** Accepting, correcting, or dismissing a finding records who did it and stamps the field with their name. Once a person overrides a value it stops being AI-suggested, and the UI says the AI will not suggest over it again.

**Threads are always anchored.** Every conversation attaches to a document, a field, an AI finding, or a question. There is no unanchored inbox, and the messages view groups by who owes the next move rather than by date received. Internal notes sit in the same thread as client messages with a hatched edge and an "Internal" tag, and switching to the client persona proves they disappear.

**One awkward case is handled on purpose.** Marcus Reyes is a preparer who is also a client of his own firm. Rather than a second login, his account carries both contexts, and switching to his personal return puts a hard-to-miss dark banner across the whole app and hides every firm tool. The failure mode worth designing against is doing firm work while you believe you are a client.

**Time is frozen.** Everything runs off a fixed `TODAY` of 10 March 2026 and a seeded PRNG. Real clocks and `Math.random` would make the demo drift and would break hydration, since the server and the client would disagree.

## Layout

```
src/
  app/          routes: /, /system, /client/*, /firm/*
  components/
    shell/      nav, persona switcher, breadcrumbs, ⌘K, case study map
    field/      the Value primitive and its seven states
    ai/         AI cards, confidence bands, correction flow
    trace/      review split, document viewer, derivation panel
    docs/       HTML facsimiles: W-2, 1099-INT, 1099-B, K-1, 1098
    status/     stage rail and status badges
    collab/     threads, composer, internal notes
  data/         seed data, generators, the traceability graph
  lib/          priority, permissions, search, store, seeded PRNG
```

## Known limits

Built for desktop. It holds up to about 1100px wide but is not designed for phones, since both audiences here work at a desk. Six of the 385 documents render as full facsimiles; the rest are metadata stubs, which is deliberate, and one of them is a deliberately unreadable scan so the failure case is visible rather than hidden.
