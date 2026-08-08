import { TODAY, addDays } from "./constants";
import type { Thread } from "./types";

const iso = (d: Date) => d.toISOString();

// Every thread is anchored to something. There is no free-floating message in
// the product, which is what keeps this from turning into an inbox.
export const THREADS: Thread[] = [
  {
    id: "th-1",
    returnId: "r-0002",
    subject: "Cost basis for the 14 noncovered lots",
    anchor: {
      type: "document",
      id: "d-1099b-vantage",
      label: "1099-B · Vantage Brokerage",
    },
    resolved: false,
    owner: "client",
    requestKind: "document",
    dueOn: iso(addDays(TODAY, -2)),
    messages: [
      {
        id: "m-1",
        author: "Marcus Reyes",
        authorRole: "Tax preparer",
        body: "Ray, page 3 of your Vantage 1099-B lists 14 lots with the basis column blank. That happens with older holdings. If you can send whatever you have on what you originally paid, I can finish the capital gains section.",
        sentOn: iso(addDays(TODAY, -9)),
        internal: false,
      },
      {
        id: "m-2",
        author: "Ray Okonkwo",
        authorRole: "Business owner",
        body: "I think those are the shares I got through the 2016 employee plan. Let me dig up the paperwork.",
        sentOn: iso(addDays(TODAY, -8)),
        internal: false,
      },
      {
        id: "m-3",
        author: "Marcus Reyes",
        authorRole: "Tax preparer",
        body: "If it turns out to be the 2016 ESPP, we should check whether the discount was already picked up as wages. Otherwise we double count it. Flagging so whoever reviews this looks at it.",
        sentOn: iso(addDays(TODAY, -8)),
        internal: true,
      },
      {
        id: "m-4",
        author: "Priya Shah",
        authorRole: "Reviewer",
        body: "Agreed. I will not sign off until the basis question is closed. Leaving line 7 unapproved.",
        sentOn: iso(addDays(TODAY, -7)),
        internal: true,
      },
      {
        id: "m-5",
        author: "Ray Okonkwo",
        authorRole: "Business owner",
        body: "Still looking. My old brokerage shut down and I am waiting on their records team.",
        sentOn: iso(addDays(TODAY, -4)),
        internal: false,
      },
    ],
  },
  {
    id: "th-2",
    returnId: "r-0002",
    subject: "1099-DIV scan is cut off",
    anchor: {
      type: "field",
      id: "f1040.line3a",
      label: "Line 3a · Qualified dividends",
    },
    resolved: false,
    owner: "client",
    requestKind: "document",
    dueOn: iso(addDays(TODAY, 3)),
    messages: [
      {
        id: "m-6",
        author: "Marcus Reyes",
        authorRole: "Tax preparer",
        body: "The 1099-DIV you sent is scanned at an angle and the right edge is missing. I read $3,812 off it but I would rather not put a number on your return that I cannot confirm. Can you send a flat photo of the whole page?",
        sentOn: iso(addDays(TODAY, -3)),
        internal: false,
      },
      {
        id: "m-7",
        author: "Marcus Reyes",
        authorRole: "Tax preparer",
        body: "Not approving line 3a until this comes back. Extraction rated it 44%.",
        sentOn: iso(addDays(TODAY, -3)),
        internal: true,
      },
    ],
  },
  {
    id: "th-3",
    returnId: "r-0002",
    subject: "Distributions from Alvarez Design Co.",
    anchor: {
      type: "question",
      id: "q-r3",
      label: "Question · Did you take distributions?",
    },
    resolved: true,
    owner: "firm",
    requestKind: "answer",
    messages: [
      {
        id: "m-8",
        author: "Marcus Reyes",
        authorRole: "Tax preparer",
        body: "Did you take any distributions from the S-corp this year?",
        sentOn: iso(addDays(TODAY, -6)),
        internal: false,
      },
      {
        id: "m-9",
        author: "Ray Okonkwo",
        authorRole: "Business owner",
        body: "Yes, $18,000 total. June and November.",
        sentOn: iso(addDays(TODAY, -4)),
        internal: false,
      },
      {
        id: "m-10",
        author: "Marcus Reyes",
        authorRole: "Tax preparer",
        body: "Got it, that is within basis. Closing this one.",
        sentOn: iso(addDays(TODAY, -4)),
        internal: false,
      },
    ],
  },
  {
    id: "th-4",
    returnId: "r-0002",
    subject: "Officer compensation looks light",
    anchor: {
      type: "issue",
      id: "ai-4",
      label: "AI finding · Charitable deduction up 62%",
    },
    resolved: false,
    owner: "firm",
    requestKind: "none",
    messages: [
      {
        id: "m-11",
        author: "Priya Shah",
        authorRole: "Reviewer",
        body: "The charitable jump is fine on its own, but combined with the S-corp income I want the acknowledgement letters in the file before we transmit. Do not send this to the client, it will worry him for no reason.",
        sentOn: iso(addDays(TODAY, -2)),
        internal: true,
      },
      {
        id: "m-12",
        author: "Marcus Reyes",
        authorRole: "Tax preparer",
        body: "Will fold it into the next message rather than sending a separate one.",
        sentOn: iso(addDays(TODAY, -2)),
        internal: true,
      },
    ],
  },
  {
    id: "th-6",
    returnId: "r-0007",
    subject: "Second review on a staff return",
    anchor: { type: "return", id: "r-0007", label: "2025 return · Marcus Reyes" },
    resolved: false,
    owner: "firm",
    requestKind: "none",
    dueOn: iso(addDays(TODAY, 6)),
    messages: [
      {
        id: "m-14",
        author: "Priya Shah",
        authorRole: "Reviewer",
        body: "Marcus, I have your return. Firm policy is a second review on anything belonging to staff, so Lena will look at it after me. Nothing for you to do yet.",
        sentOn: iso(addDays(TODAY, -3)),
        internal: false,
      },
      {
        id: "m-15",
        author: "Priya Shah",
        authorRole: "Reviewer",
        body: "Reminder that Marcus cannot see internal notes on his own return while he is in his client context. Keeping preparer chatter here.",
        sentOn: iso(addDays(TODAY, -3)),
        internal: true,
      },
    ],
  },
  {
    id: "th-5",
    returnId: "r-0001",
    subject: "Welcome to Meridian",
    anchor: { type: "return", id: "r-0001", label: "2025 return · Dana Whitfield" },
    resolved: false,
    owner: "client",
    requestKind: "document",
    dueOn: iso(addDays(TODAY, 5)),
    messages: [
      {
        id: "m-13",
        author: "Marcus Reyes",
        authorRole: "Tax preparer",
        body: "Hi Dana, I will be preparing your return this year. Start by uploading your W-2 whenever you have a minute. I will let you know if I need anything else.",
        sentOn: iso(addDays(TODAY, -2)),
        internal: false,
      },
    ],
  },
];

export function threadsFor(returnId: string) {
  return THREADS.filter((t) => t.returnId === returnId);
}

export function threadsForAnchor(type: string, id: string) {
  return THREADS.filter((t) => t.anchor.type === type && t.anchor.id === id);
}
