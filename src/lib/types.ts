export type Platform = "trello" | "github" | "huggingface" | "manual";

export type VerificationState =
  | "synced"
  | "activity"
  | "verified"
  | "attention";

export type CommitmentState = "not_started" | "in_progress" | "met";

export type SourceStatus = "todo" | "doing" | "done";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "activity"
  | "verified"
  | "attention";

export interface Evidence {
  id: string;
  type: "commit" | "pull_request" | "merge" | "review" | "repo_update" | "discussion";
  label: string;
  detail: string;
  platform: Platform;
  time: string;
  qualified: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  platform: Platform;
  project: string;
  sourceStatus: SourceStatus;
  status: TaskStatus;
  criteria: string;
  evidence: Evidence[];
  deadline: string;
  commitmentMet: boolean;
  tag?: string;
  history?: { date: string; result: "met" | "missed" | "rest" }[];
}

export interface Person {
  id: string;
  name: string;
  handle: string;
  role: string;
  color: string;
  accent: string;
  streak: number;
  today: "complete" | "in_progress" | "pending" | "attention";
  commitmentsDone: number;
  commitmentsTotal: number;
}

export interface Group {
  id: string;
  name: string;
  emoji: string;
  policy: string;
  policyDetail: string;
  gracePeriod: string;
  timezone: string;
  streak: number;
  longest: number;
  rate: number;
  todayQualified: boolean;
  memberDone: number;
  memberTotal: number;
  memberIds: string[];
  qualificationNote: string;
  history: { date: string; result: "qualified" | "missed" | "grace" }[];
}

export interface ActivityEvent {
  id: string;
  actorId: string;
  platform: Platform;
  type:
    | "commit"
    | "pull_request"
    | "merge"
    | "review"
    | "repo_update"
    | "discussion"
    | "sync"
    | "verified"
    | "partner"
    | "milestone"
    | "missed";
  title: string;
  detail: string;
  taskTitle?: string;
  verified: "verified" | "pending" | "not_required";
  time: string;
}

export interface AppNotification {
  id: string;
  kind:
    | "deadline"
    | "verified"
    | "activity"
    | "attention"
    | "partner"
    | "milestone"
    | "invite"
    | "commitments";
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
}

export type HeatStatus = "complete" | "missed" | "rest" | "upcoming" | "grace";

export interface HeatDay {
  date: Date;
  key: string;
  status: HeatStatus;
  minutes: number;
  commits: number;
}
