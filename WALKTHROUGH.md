# Video walkthrough script

Everything you need to record the demo without knowing anything about taxes.

**How to read this file**

| What you see | What to do |
|---|---|
| ▶ **CLICK / TYPE / PRESS** | Do this on screen. Exact button text is in **bold**. |
| 🗣 A quoted block | Say this out loud, word for word. The `uh` / `um` are on purpose — leave them in. |
| 💡 A note | Background for you only. Do **not** say it. |
| ⚠️ | Something that could trip you up mid-take. |

Total runtime: **about 9 minutes.**

---

## Before you hit record

1. Open the app. Local is `npm run dev` → http://localhost:3000. Live is https://meridian-dusky-one.vercel.app
2. Make the browser window **wide** — at least 1400px. This app is desktop-only by design and the three-panel review screen needs the room.
3. **Reset the demo.** Click your name in the **top right** → scroll to the bottom of the menu → **Reset the demo (clears every change you made)**. This wipes any edits from a previous take and drops you on the entry page.
4. Close other tabs. You will paste a URL into a new tab later and you want that to be quick.
5. You should now be looking at a page that says **Meridian** with six people listed. That is the start.

⚠️ **If you ever get lost during recording:** click the **Meridian logo in the top left**. That always takes you back to this entry page with the six people on it.

---

## Tax words you will say (read this once, do not say it on camera)

You do not need to know tax. You need to not sound confused. Here is every term in the script in one line each.

| Term | What it actually is |
|---|---|
| **CPA / preparer** | The accountant. The professional who fills out your tax return for you. |
| **Tax return** | The form you send the government once a year saying what you earned and what you owe. |
| **Form 1040** | The main US personal tax return form. Everyone files one. |
| **A "line"** | One numbered row on that form. "Line 1z" is the row for your wages. |
| **Schedule** | An extra page attached to the 1040 for one topic. Schedule D = investments. Schedule E = rental and business income. Schedule A = deductions. |
| **W-2** | The form your employer mails you saying how much they paid you and how much tax they already took out. |
| **1099-B** | The form your stock broker mails you listing everything you sold that year. |
| **1099-INT** | Form from your bank listing interest they paid you. |
| **1099-DIV** | Form listing dividends you got from stocks. |
| **1098** | Form from your mortgage company listing the interest you paid on your house. |
| **K-1** | Form you get if you own part of a small business, listing your share of its profit. |
| **Cost basis** | What you originally *paid* for a stock. You only get taxed on the profit, so the government needs to know the purchase price, not just the sale price. |
| **"Noncovered" lots** | Shares so old the broker isn't required to report what you paid for them. The broker leaves that column blank. This is the whole drama on Ray's return. |
| **Capital gain** | Profit from selling something. Sale price minus cost basis. |
| **AGI (adjusted gross income)** | Your total income after a few subtractions. The number everything else keys off. |
| **Standard deduction** | A flat amount everyone can subtract. It's set by law by your filing status, so nobody can just type a different number in. |
| **Withholding** | Tax your employer already took out of your paychecks during the year. |
| **Reviewer** | A second, more senior person at the firm who checks the preparer's work before it's sent. |
| **E-file** | Electronically transmitting the finished return to the IRS. |
| **Extraction** | Software reading numbers off a scanned document. In this prototype it's faked. |

**The one story you're telling with Ray Okonkwo's return:** Ray sold stock. His broker reported what he *sold it for* but not what he *paid for it* on 14 batches of shares. Without the purchase price, all of the sale money looks like profit, and Ray gets overtaxed by about $13,984. So the preparer filled in the purchase price from Ray's own spreadsheet — which is not an official source. That's why that number is flagged, why the AI is only 71% confident, and why the return is stuck.

---

# SCENE 1 — Framing (0:00 – 0:35)

**Where you are:** the entry page with six people on it.

▶ Just talk. Don't click anything yet.

🗣
> So this is Meridian. Uh, it's a tax platform for two audiences at once — regular people filing a return, and the accounting firms that actually do the work for them.
>
> The case study had ten challenges, and I built all ten as one product instead of ten separate demos. Um, mostly because a lot of them are actually the same problem from different angles. Traceability, interaction affordances, and trust in AI all end up living on the same review screen, so splitting them apart would've been kind of dishonest.
>
> Quick disclosure up front: there's no backend here, no database, no OCR, and no model. But everything you can click, edit, filter, or persist — that's all real. It all survives a refresh.

▶ **Move your mouse over the six cards** so they're visible.

🗣
> These are the six roles. Uh, you can be any of them at any time, and the URLs are identical for everybody — what changes is what you're allowed to see and do.
>
> Let's start as the accountant. Marcus Reyes, tax preparer.

▶ **CLICK** the card that says **Marcus Reyes** — **second row, left column**, teal "MR" badge.

---

# SCENE 2 — The dashboard, challenge 07 (0:35 – 2:00)

**Where you are:** `/firm`. Heading reads **"Your desk, Marcus"**.

💡 You'll see a teal box at the top labelled **Work on this next** with **Copper Fox Brewing** in it. Three number tiles under it read **2**, **21**, **1**. Under that, a list headed **The queue**.

🗣
> Okay so this is the accountant's landing page. Um, dashboards are really easy to make pretty and completely useless, so this one answers exactly one question before it reports anything at all: what should I work on right now.

▶ **POINT at the teal box at the top** (Work on this next → Copper Fox Brewing).

🗣
> One answer. Not a chart, not a KPI row — one client, and the next physical action to take on them.

▶ **POINT at the three number tiles** underneath.

🗣
> Then the shape of the desk. Uh, two returns need attention today, twenty-one are stuck waiting on a client to send something back, and one is due inside a week.

▶ **POINT at the middle column of any row in "The queue"** — the column with text like *"Due in 12 days · 2 unanswered questions · 3 fields below confidence."*

🗣
> But this column is the part I actually care about. Every single row explains why it ranked where it did. Um — due in twelve days, two unanswered questions, three fields below the confidence threshold.
>
> And that's a real scoring function, not a sort by due date. It weighs deadline pressure, how long something's been blocked, how long it's been sitting in review, whether the client just replied, low-confidence fields, and dollars at stake. Uh, and every term that fires writes its own sentence into the row.
>
> And that's the thing that keeps somebody off a spreadsheet, I think. The ranking is arguable. You can look at it and disagree with it, which means you can trust it.

▶ **CLICK** the filter chip labelled **Blocked on the client** (top-right of "The queue" panel).

🗣
> And the filters are just slices of that same ranked list, so, um, it never re-sorts into some order you don't recognize.

▶ **CLICK** the **Everything** chip to clear the filter.

💡 Now a short role switch — this is the "managers vs preparers" half of challenge 07.

▶ **CLICK** your name **top right** → under **Firm**, **CLICK** **Priya Shah**.

⚠️ Marcus is a *preparer*, so he does **not** get a team toggle — preparers only see their own desk. That's on purpose, and Priya is who you show it with.

**Where you are:** `/firm`, headed **"Your desk, Priya"**, 66 returns in scope.

🗣
> Uh, and this dashboard isn't one layout for everybody. Marcus is a preparer, so he only ever sees his own thirty-seven. Priya's a reviewer, so hers is a review queue — sixty-six returns, and the top of it is a job that's been sitting in her queue nine days.

▶ **CLICK** the **Team view** button (top right, next to **My work**).

💡 Heading changes to **"The whole firm"**, 242 returns, and two new panels appear.

🗣
> And because she's senior, she gets a firm-wide view too. Same ranking, all two hundred forty-two returns — who's carrying what, who's got nothing assigned, and the four most at-risk jobs in the building.
>
> Um, so the preparer, the reviewer, and the admin get genuinely different dashboards, but it's one page and one scoring function underneath. Nothing forked.

▶ **CLICK** your name **top right** → under **Firm**, **CLICK** **Marcus Reyes** to go back.

---

# SCENE 3 — Traceability, challenge 01 (2:00 – 4:15) ⭐ the centerpiece

💡 This is the longest and most important section. Take your time.

▶ **PRESS** `⌘K` (Mac) or `Ctrl+K` (Windows).
▶ **TYPE** `Okonkwo`
▶ **PRESS** `Enter` on the top result (a teal **Return** chip, "Okonkwo, Ray").

**Where you are:** Ray Okonkwo's return overview.

▶ **CLICK** the tab labelled **Review** (in the row: Overview · Review · Documents · AI findings · Messages).

**Where you are:** a three-panel screen. Left = the tax form. Middle = evidence. Right = a document.

🗣
> Okay. So this is the return review screen, and this is the one I put the most into.
>
> Um, the problem here is trust. An accountant is signing their name to every number on this form. If they can't see where a figure came from, they've got two options — take the software's word for it, or re-derive the whole thing by hand. And the second one defeats the entire point of automation.

▶ **CLICK**, in the **left panel**, the row labelled **1z · Wages, salaries, tips** — the one showing **$209,625**.

💡 Three things happen at once: the middle panel fills with the derivation, the right panel loads a W-2, and it scrolls to a highlighted box.

🗣
> So click any line on the form and three things happen at once.
>
> The source document opens on the right, already scrolled to the exact box. The middle panel shows the chain. And, uh, the value gets a state chip on it.
>
> This one's wages. Ray had two jobs, so it's Box 1 off two separate W-2s — a hundred sixty-eight four, plus forty-one two — summed to two-oh-nine six twenty-five. And it's marked verified, which means a human checked it against the paper, so it carries the name of the person who signed for it.

▶ **CLICK**, in the **left panel**, the row labelled **7 · Capital gain or loss** — showing **$18,922**.

🗣
> Um, but this is the interesting one. This is where a real return gets messy.
>
> Ray sold stock. Three sources here, and notice they're three different pages of the *same* 1099-B — that's the form his broker sends. And the transform isn't a copy, it's arithmetic.
>
> Two fourteen three-oh-eight in total proceeds — that's everything he sold for. Minus a hundred eighty-one four-oh-two, which is what the broker told the IRS he originally paid. Minus another thirteen nine eighty-four for fourteen batches of shares where, uh, the broker didn't report the purchase price at all.
>
> And that last subtraction is the whole problem on this return, which is why the line reads "needs approval" instead of "verified."

▶ **CLICK**, in the **middle panel** under **Sources (3)**, the third row: **1099-B page 3, 14 noncovered lots**.

💡 The right panel jumps to page 3 of 3 and highlights a block of rows.

🗣
> So click that third source, and the document jumps to page three and highlights the exact block.
>
> Um, and here's the decision the entire feature rests on: those documents are hand-built HTML, not scanned images. There's no OCR anywhere in this product.
>
> Which sounds like a shortcut, but it's actually the thing that makes it work. Because every box on that form has a stable ID, the highlight lands on an actual box instead of a guessed rectangle. You can select the text. You can page through it. If I'd used image scans I'd be drawing approximate boxes over pixels and lying about precision.

▶ **CLICK** in the browser address bar, **COPY** the whole URL (`⌘L` then `⌘C`).
▶ **OPEN a new tab** (`⌘T`), **PASTE**, **PRESS Enter**.

💡 It reopens on exactly the same field, document, page, and highlight.

🗣
> And all of that panel state lives in the URL. So — field, document, page number, and which region is highlighted.
>
> Which means I can send a colleague a link to one specific number, on one specific page, of one specific document, and they land exactly where I'm looking. Uh, that's challenge four as much as it's challenge one — deep linking is what stops people getting lost.

▶ **CLOSE** the new tab (`⌘W`). You're back on the review screen on line 7.

---

# SCENE 4 — Trustworthy AI, challenge 10 (4:15 – 5:30)

**Where you are:** still on line 7. Scroll the **middle panel** down slightly if needed.

💡 Look for the violet-edged card headed **"Cost basis missing on 14 brokerage lots"** under the label *What the AI flagged here*.

🗣
> Under the derivation is the AI layer. And, um, this is the one I had the strongest opinion about.

▶ **POINT at the card title and the small chip next to it that reads "Needs a look."**

🗣
> The card says what it did in one line. Then why, in one more line. And then confidence — but stated in *words* first.
>
> Because a bare seventy-one percent is genuinely useless. It invites every single person looking at it to invent their own private threshold for what counts as safe. So it says "needs a look," and the actual number stays one click behind that.

▶ **CLICK** the dotted-underlined link at the bottom of the card: **Why should I believe this?**

💡 A panel expands showing four rows: What is uncertain / Confidence / Recommended / Produced by.

🗣
> And behind the toggle is the thing you actually need, which is what it's *unsure* about. Uh — the client's own spreadsheet isn't an IRS-verified source. If that spreadsheet is wrong, line seven is wrong, and Ray's return is wrong.
>
> Um, that's the balance I was going for. Showing every technical detail all the time isn't transparency, it's just noise, and people learn to scroll past noise. So the honest caveat, the percentage, the recommendation, and which model version produced it are all here — they're just one click down instead of shouting at you constantly.

▶ **CLICK** the button labelled **Correct it**.
▶ The box is pre-filled with `18922`. **CLICK into it, select all** (`⌘A`), then **TYPE** `17500`
▶ **CLICK** **Save**.

💡 Watch the left panel: line 7's chip changes from amber "Needs approval" to green "Verified" and picks up a teal "edited by you" tag.

🗣
> And then correcting it is a first-class action, not an escape hatch buried somewhere.
>
> So I override the number — and, uh, watch the left rail. The line immediately stops being AI-suggested. It's now verified, it's stamped with my name, and the card literally says the AI will not suggest over this again.
>
> Which I think is the actual trust mechanic. Not the confidence score. It's knowing that when you disagree with the machine, you win, permanently, and it's recorded who did it.

---

# SCENE 5 — The affordance system, challenge 08 (5:30 – 6:15)

▶ **CLICK** the **Meridian logo, top left** → then **CLICK** the **Case study map** button in the top bar → **CLICK** row **08 Clickable vs editable**.

💡 Faster alternative: type `localhost:3000/system` in the address bar.

**Where you are:** a page headed **The interaction language**.

🗣
> Okay, quick detour, because this underpins everything you just saw.
>
> A tax return puts AI output, extracted figures, calculations, a reviewer's decisions, and the client's own words on one single screen. Um, and rather than styling each of those per screen and hoping I stayed consistent, there are seven states and exactly one component. Everything that renders a value anywhere in this product goes through it.

▶ **POINT at the table of seven rows.**

🗣
> So — treatment answers "what can I do with this." A dashed underline means type here. A tinted left rule means somebody has to make a decision about it.
>
> Glyph answers "where did this come from." Uh, a diamond is AI, a checkmark is a person who verified it, a quote mark is the client's own words, and the f is arithmetic.
>
> Colour is never the only signal, anywhere. And locked always states its reason — because a control that refuses to work and won't tell you why teaches you nothing.

▶ In the **Try it** panel (left, below the table), **DOUBLE-CLICK** the number **$8,450**.
▶ **TYPE** `9000` and **PRESS Enter**.

🗣
> And it's not a spec sheet — that's the live component, it's a real edit.

---

# SCENE 6 — Collaboration, roles, and status: challenges 02, 05, 06 (6:15 – 7:45)

▶ **PRESS** `⌘K` → **TYPE** `Okonkwo` → **Enter** → **CLICK** the **Messages** tab.

**Where you are:** left rail with groups **Waiting on the client (2)**, **Waiting on us (1)**, **Resolved (1)**.

🗣
> Right, collaboration. Um, the failure mode here is that tax work scatters across email, phone calls, and texts, and then nobody can find anything.
>
> So every thread in here is anchored to something — a document, a specific line on the return, a question, or an AI finding. There's no unanchored inbox. You literally cannot start a conversation about nothing.
>
> And it groups by who owes the next move, not by date received. Uh, which is the difference between a work queue and an inbox.

▶ **CLICK** the first thread: **Cost basis for the 14 noncovered lots**.

💡 Two messages have a hatched amber left edge and an **Internal only** badge. A line under the header reads *"2 internal notes in this thread."*

🗣
> And internal firm notes sit in the same thread as the client-facing messages. Hatched edge, amber, tagged internal.
>
> Um, they're in the same thread on purpose — the alternative is two places to look, and two places to look is exactly how context gets lost. Here the reviewer's private concern sits right underneath the client's reply that caused it.

▶ **CLICK** your name **top right** → under **Clients**, **CLICK** **Ray Okonkwo**.
▶ **CLICK** **Messages** in the top nav. The first thread is already selected.

⚠️ Do **not** click the thread titled *"Officer compensation looks light"* while you're Ray. Every message in it is internal, so it opens empty. Stay on the first one.

🗣
> So now I'm Ray. Same product, same thread, same anchor — and the internal notes are just gone.
>
> That's not a separate screen, uh, it's not a different component. It's one filter in one place. That's the entire permission story for messaging.

▶ **CLICK** **My return** in the top nav.

**Where you are:** `/client/status`, headed **Your 2025 return**.

🗣
> And status. Status is the one everybody reads differently — "in progress" means four different things to four different people.
>
> So a status here is never a bare adjective, it's an object. Uh, six stages, same six names in the same order for clients and for staff. It always says where the return is, who owns the next action, and what's blocking it.
>
> Ray's on stage three of six. Waiting on him. Two blockers, both his. Um, and what differs by audience is the depth, not the vocabulary — staff also get an internal substage and how many days it's been sitting there. Ray gets one plain sentence and an estimated refund.

▶ **CLICK** your name **top right** → under **Firm**, **CLICK** **Marcus Reyes**.
▶ **CLICK** your name **top right** again → **CLICK** the button **My 2025 return**.

💡 A dark banner appears across the entire top of the app reading **PERSONAL**.

🗣
> And then the awkward case, which the brief specifically asked about. Marcus is staff, and he's also a client of his own firm — his personal return is in this same system.
>
> Um, rather than making him have a second login, his account carries both contexts. And when he flips, the whole app puts a black banner across the top and every firm tool disappears.
>
> It's deliberately hard to miss, because the failure mode worth designing against is doing firm work while you think you're a client. Or, uh, honestly, the reverse — reading your own return with an accountant's permissions.

▶ **CLICK** **Back to firm workspace** on the right side of the dark banner.

---

# SCENE 7 — The first run, challenge 03 (7:45 – 8:25)

▶ **CLICK** your name **top right** → under **Clients**, **CLICK** **Dana Whitfield**.

**Where you are:** a single centered screen: **"Welcome, Dana. One thing to do."**

🗣
> Last persona. Dana's brand new — she's never opened this before and nothing's been uploaded.
>
> And, um, the whole screen is one action. Look at the top bar — one nav item. No documents tab, no messages, no status, no return.
>
> That's on purpose. Navigation to four empty sections isn't helpful, it's just four ways to feel lost on day one. So it's withheld until there's actually something in it.

▶ **CLICK** the big dashed box: **Upload your W-2**.

💡 Step 2 appears: "Got it. Four quick questions."

▶ **CLICK** the small link at the bottom: **Skip to the finished view**.

💡 The full client navigation appears in the top bar.

🗣
> And the second she's done, the shell expands into the full navigation — because now every one of those sections has something real in it.
>
> Uh, that's the whole idea: the product grows to match how much she's actually got going on.

---

# SCENE 8 — Scale, and close (8:25 – 9:05)

▶ **CLICK** your name **top right** → under **Firm**, **CLICK** **Marcus Reyes**.
▶ **PRESS** `⌘K`.

💡 The empty palette reads **"676 objects indexed."**

▶ **TYPE** `basis`

💡 Five results appear, each with a different coloured type chip.

🗣
> Okay, last thing. One query — "basis" — and I get five different kinds of object back. A task, a message thread, an AI finding, a question that was sent to the client, and a field on the actual tax form.
>
> Um, that's challenge nine. Because people remember what a thing was *about*, they don't remember which list it lives in. So the search doesn't make you pick a category first.
>
> And that's running against real volume, not a demo handful — two hundred eighty-four documents on Ray's return alone, six hundred and seventy-six indexed objects total.

▶ **PRESS** `Escape`. ▶ **CLICK** **Case study map** in the top bar.

🗣
> And this is just for whoever's grading it — every one of the ten challenges links straight to the screen where it actually lives, with the one decision I'd defend on each.
>
> The README has the full breakdown of what's genuinely wired up versus what's faked. Short version: no backend, no OCR, no model, and the documents are HTML facsimiles. Uh, everything else — the ranking, the permissions, the search, the deep linking, the edits, the persistence — is real code doing real work.
>
> That's Meridian. Thanks for watching.

---

## If something goes wrong mid-take

| Problem | Fix |
|---|---|
| You edited a number and want it back | Persona menu (top right) → **Reset the demo** at the very bottom. Then restart the take. |
| Review screen says "No traceability data for this return" | You're on the wrong client. Only **Okonkwo, Ray** has the hand-built trace graph. `⌘K` → "Okonkwo". |
| Right panel says "No source open" | Click a line in the **left** panel first. Line 12 (standard deduction) and line 11 (AGI) have no sources by design — they're calculated, not extracted. |
| ⌘K does nothing | Click somewhere on the page first so the window has focus. |
| Totally lost | Click the **Meridian logo, top left**. Always goes to the entry page. |
| Layout looks cramped / panels stacked | Widen the browser. It's built for 1400px+. |

---

## Questions you might get afterward, and the honest answer

**"Is any of the AI real?"**
> No, and I'd say that up front. Every finding, confidence score, and rationale is hand-written in `src/data/aiFindings.ts` in the exact shape a model response would come back in. The brief asked me to fake it — what's being evaluated is how you present AI output and build trust around it, not whether you can call an API.

**"Why HTML documents instead of PDFs or scans?"**
> It's the single decision the whole traceability feature rests on. A W-2 as a CSS grid with a stable ID on every box means the highlight lands on a real box, with no OCR and no image assets, and the document stays text-selectable and pageable. With scans I'd be drawing approximate rectangles and pretending to be precise.

**"Why is the data frozen at March 10th, 2026?"**
> Fixed clock plus a seeded random generator. A real clock would make the demo drift between takes, and it would break hydration — the server and the client would disagree about what day it is.

**"How much of the data is real?"**
> Four returns are hand-written to carry the demo. The other 238 are generated from a fixed seed so the dashboard ranking and the document search get tested against actual volume instead of six demo rows.

**"What would you do next?"**
> Mobile — it's desktop-only right now, deliberately, because both audiences work at a desk, but the client side genuinely should be phone-first. And the traceability graph is hand-built for one return; the real version needs that generated from the extraction pipeline.
