# Video walkthrough script

Roughly seven minutes. The order builds one argument: the CPA knows what to work on, they can trust every number when they get there, the client is never confused, and the whole thing is one product rather than six.

Before recording, open the persona switcher and hit **Reset the demo** so nothing carries over from a previous take.

---

## 0:00 — Framing (30s)

Start on `/`.

> Meridian is a tax platform for clients and the firms that serve them. I built all ten challenges as one product rather than ten demos, because most of them are the same problem from different angles. Traceability, affordances, and trust in AI all live on the same review screen. There is no backend, no OCR, and no model. Everything you can click, edit, filter, or persist is real.

Point at the persona list. Pick **Marcus Reyes**.

---

## 0:30 — Challenge 07, the dashboard (60s)

You land on `/firm`.

> Dashboards are easy to make useless, so this one answers one question before it reports anything: what should I work on right now. One answer at the top, then the queue.

Point at a queue row.

> The part I care about is this column. Every row explains why it ranked where it did. Due in four days, sitting in review eleven days, one field below confidence. That is a real scoring function over 242 returns, not a sort by date, and each term that fires writes its own sentence. That is what keeps someone off a spreadsheet: the ranking is arguable, so you can disagree with it.

Click **Team view**, show staff load and unassigned work. Click a filter chip.

---

## 1:30 — Challenge 01, traceability (2m, the centerpiece)

Search for Okonkwo in the queue or use ⌘K. Open **Okonkwo, Ray**, then the **Review** tab.

> A CPA has to trust every number here. If they cannot see where a figure came from, they either take the software's word for it or re-derive it by hand, which defeats the point.

Click **line 1z, wages**.

> Click any line and three things happen. The source document opens on the right, scrolled to the exact box. The middle panel shows the chain. Two W-2s, box 1 from each, summed. This one is verified, so it carries the name of the person who checked it.

Click **line 7, capital gain or loss**.

> This is the interesting one. Three sources across three pages of one 1099-B, and the transform is not a copy. Total proceeds, minus the basis the broker reported, minus basis for fourteen lots the broker did not report.

Click the third source row, **1099-B page 3**.

> The document jumps to page three and highlights the exact block. Those documents are hand-built HTML, not scans. That is the decision the whole feature rests on. Because every box has a stable id, the highlight lands on a box instead of a guessed rectangle, and there is no OCR anywhere in the product.

Copy the URL, paste in a new tab.

> The panel state lives in the URL, so that link reopens the exact field, document, page, and highlight. That is challenge 04 as well: you can hand someone a link to a specific number on a specific page.

---

## 3:30 — Challenge 10, trustworthy AI (75s)

Stay on line 7 and point at the AI card below the derivation.

> The AI card says what it did in one line, then why. Confidence is stated in words first. A bare 71% invites everyone to invent their own threshold for what is safe, so it says "needs a look" and keeps the number one click behind it.

Click **Why should I believe this?**

> Behind the toggle is what it is unsure about, which is the thing you actually need. The client's own spreadsheet is not IRS-verified, so if it is wrong, line 7 is wrong. Showing every technical detail all the time is not transparency, it is noise.

Click **Correct it**, type a different number, save.

> Correcting it is a first-class action, not an escape hatch. It stamps the field with my name and the AI stops suggesting over it.

Point at the left rail so the state chip visibly changed.

---

## 4:45 — Challenge 08, the affordance system (45s)

Go to `/system`.

> A return shows AI output, extracted figures, calculations, and the client's own words on one screen. Rather than styling each per screen, there are seven states and one primitive. Everything in the product renders through it.

Point at the table.

> Treatment answers what you can do with it. Glyph answers where it came from. Colour is never the only signal. Locked always states its reason, because a control that refuses without a reason teaches nothing.

Double-click the number in **Try it**.

---

## 5:30 — Challenges 02, 05 and 06, from the client side (75s)

Go to the **Messages** tab on Ray's return.

> Every thread is anchored to a document, a field, or a question. There is no unanchored inbox, and it groups by who owes the next move. Internal notes sit in the same thread as client messages, hatched and tagged.

Switch persona to **Ray Okonkwo**, open the same thread.

> Same thread, internal notes gone. That is the permission model, not a separate screen.

Go to `/client/status`.

> Status is the one everyone reads differently, so a status here is never a bare adjective. Same six stage names for clients and staff, in the same order. It always says where it is, who owns the next action, and what is blocking. Staff also get the internal substage and how long it has been sitting. The client gets one sentence.

Switch to **Marcus**, open the switcher, click **My 2025 return**.

> Marcus is staff and a client of his own firm. Rather than a second login, the context flips and the whole app puts a banner across the top. The failure mode worth designing against is doing firm work while you think you are a client.

---

## 6:45 — Challenge 03, the first run (45s)

Switch to **Dana Whitfield**.

> A brand new client. One action on screen and nothing else. No navigation, because there is nothing yet to navigate to.

Click upload, then continue.

> Once onboarding finishes the shell expands into the full navigation, because now each section has something in it.

---

## 7:30 — Close (30s)

Press ⌘K, type "basis".

> One query, five different object types: a task, a message, an AI finding, a question, and a field on the return. That is challenge 09, tested against 284 documents on this one return rather than a demo handful.

Open the **Case study map**.

> Every challenge links to where it lives. The README says exactly what is real and what is faked.
