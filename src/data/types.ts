import type { StageKey } from "./constants";

export type RoleKey =
  | "individual"
  | "business"
  | "preparer"
  | "reviewer"
  | "admin"
  | "seasonal";

export type Persona = {
  id: string;
  name: string;
  initials: string;
  role: RoleKey;
  roleLabel: string;
  side: "client" | "firm";
  blurb: string;
  // A firm employee can also be a client. This points at their own return.
  personalReturnId?: string;
  clientId?: string;
  firstRun?: boolean;
};

// Seven states cover every value the product can show. Nothing renders a raw
// number outside this set.
export type FieldState =
  | "editable"
  | "calculated"
  | "ai-suggested"
  | "verified"
  | "needs-approval"
  | "locked"
  | "client-answer";

export type Confidence = "high" | "medium" | "low";

export type SourceRef = {
  docId: string;
  page: number;
  regionId: string;
  label: string;
  rawValue: string;
};

export type TransformStep = {
  op: string;
  detail: string;
  result?: string;
};

export type ReturnField = {
  id: string;
  line: string;
  label: string;
  schedule: string;
  value: number;
  // Used when the field is not a dollar amount, like a yes/no answer.
  displayValue?: string;
  state: FieldState;
  confidence?: Confidence;
  confidenceScore?: number;
  sources: SourceRef[];
  transform: TransformStep[];
  aiNote?: string;
  // Set once a human overrides the AI. The AI does not re-suggest over it.
  overriddenBy?: string;
  overriddenOn?: string;
  verifiedBy?: string;
  verifiedOn?: string;
  lockReason?: string;
  editable: boolean;
};

export type DocKind =
  | "W-2"
  | "1099-INT"
  | "1099-B"
  | "1099-DIV"
  | "K-1"
  | "1098"
  | "1095-A"
  | "Receipt"
  | "Statement"
  | "Letter";

export type SourceDoc = {
  id: string;
  returnId: string;
  kind: DocKind;
  title: string;
  issuer: string;
  pages: number;
  uploadedOn: string;
  uploadedBy: string;
  status: "extracted" | "needs-review" | "unreadable" | "pending";
  fieldsFed: string[];
  sizeKb: number;
  // Only the handful of hero documents render as full facsimiles.
  facsimile?: "w2" | "1099int" | "1099b" | "k1" | "1098";
};

export type Blocker = {
  kind: "waiting-client" | "waiting-firm" | "waiting-irs" | "conflict";
  label: string;
  since: string;
  owner: "client" | "firm" | "irs";
  linkTo?: string;
};

export type ReturnStatus = {
  stage: StageKey;
  subStage: string;
  owner: "client" | "firm" | "irs";
  since: string;
  blockers: Blocker[];
};

export type TaxReturn = {
  id: string;
  clientName: string;
  clientId: string;
  entity: "1040" | "1120-S" | "1065";
  year: number;
  status: ReturnStatus;
  assignedTo: string;
  reviewer: string;
  dueOn: string;
  refund: number;
  complexity: "simple" | "standard" | "complex";
  docCount: number;
  openQuestions: number;
  lowConfidenceFields: number;
  riskFlags: string[];
  lastClientReplyOn?: string;
  inReviewSince?: string;
  extended: boolean;
};

export type Task = {
  id: string;
  returnId: string;
  title: string;
  detail?: string;
  owner: "client" | "firm";
  assignedTo: string;
  dueOn: string;
  done: boolean;
  kind: "upload" | "answer" | "review" | "approve" | "prepare" | "sign";
  linkedDocId?: string;
  linkedQuestionId?: string;
};

export type Question = {
  id: string;
  returnId: string;
  prompt: string;
  helper?: string;
  askedBy: string;
  askedOn: string;
  answer?: string;
  answeredOn?: string;
  linkedDocId?: string;
  linkedFieldId?: string;
  required: boolean;
  category: string;
};

export type AnchorType = "document" | "field" | "issue" | "task" | "question" | "return";

export type Message = {
  id: string;
  author: string;
  authorRole: string;
  body: string;
  sentOn: string;
  internal: boolean;
};

export type Thread = {
  id: string;
  returnId: string;
  subject: string;
  anchor: { type: AnchorType; id: string; label: string };
  messages: Message[];
  // A thread is only "closed" when the thing it was about is resolved.
  resolved: boolean;
  owner: "client" | "firm";
  requestKind?: "document" | "answer" | "approval" | "none";
  dueOn?: string;
};

export type AiFinding = {
  id: string;
  returnId: string;
  severity: "high" | "medium" | "low";
  title: string;
  whatItDid: string;
  why: string;
  confidence: Confidence;
  confidenceScore: number;
  evidence: SourceRef[];
  suggestedAction: string;
  fieldId?: string;
  suggestedValue?: number;
  currentValue?: number;
  status: "open" | "accepted" | "rejected" | "corrected";
  uncertainty: string;
  model: string;
  ranOn: string;
};

export type Relation = {
  type: AnchorType;
  id: string;
  label: string;
  reason: string;
  href: string;
};
