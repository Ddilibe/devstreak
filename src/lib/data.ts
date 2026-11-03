import { addDays, format, setHours, setMinutes, startOfDay, subDays, subHours, subMinutes } from "date-fns";
import type {
  ActivityEvent,
  AppNotification,
  Group,
  HeatDay,
  Person,
  Task,
} from "./types";

const now = new Date();
const iso = (d: Date) => d.toISOString();
const at = (hour: number, minute = 0) =>
  iso(setMinutes(setHours(startOfDay(now), hour), minute));

export const currentUser: Person = {
  id: "alex",
  name: "Alex Rivera",
  handle: "alexrivera",
  role: "Senior Frontend Engineer",
  color: "from-emerald-400 to-teal-500",
  accent: "#22C55E",
  streak: 12,
  today: "in_progress",
  commitmentsDone: 3,
  commitmentsTotal: 5,
};

export const people: Person[] = [
  currentUser,
  {
    id: "mira",
    name: "Mira Chen",
    handle: "miracodes",
    role: "Staff Engineer · Vercel",
    color: "from-violet-400 to-indigo-500",
    accent: "#8B5CF6",
    streak: 41,
    today: "complete",
    commitmentsDone: 4,
    commitmentsTotal: 4,
  },
  {
    id: "jonas",
    name: "Jonas Weber",
    handle: "jonasw",
    role: "Backend Engineer · Zalando",
    color: "from-amber-400 to-orange-500",
    accent: "#F59E0B",
    streak: 9,
    today: "in_progress",
    commitmentsDone: 2,
    commitmentsTotal: 4,
  },
  {
    id: "priya",
    name: "Priya Nair",
    handle: "priyanair",
    role: "ML Engineer · Hugging Face",
    color: "from-sky-400 to-blue-500",
    accent: "#3B82F6",
    streak: 28,
    today: "complete",
    commitmentsDone: 3,
    commitmentsTotal: 3,
  },
  {
    id: "sam",
    name: "Sam Okafor",
    handle: "samokafor",
    role: "Platform Engineer · Stripe",
    color: "from-rose-400 to-pink-500",
    accent: "#F43F5E",
    streak: 6,
    today: "pending",
    commitmentsDone: 0,
    commitmentsTotal: 3,
  },
  {
    id: "lena",
    name: "Lena Fischer",
    handle: "lena.dev",
    role: "Independent Developer",
    color: "from-teal-400 to-cyan-500",
    accent: "#14B8A6",
    streak: 17,
    today: "attention",
    commitmentsDone: 1,
    commitmentsTotal: 3,
  },
  {
    id: "diego",
    name: "Diego Santos",
    handle: "diegodev",
    role: "Frontend Engineer · Shopify",
    color: "from-lime-400 to-green-500",
    accent: "#84CC16",
    streak: 22,
    today: "complete",
    commitmentsDone: 2,
    commitmentsTotal: 2,
  },
];

export const personById = (id: string) =>
  people.find((p) => p.id === id) ?? currentUser;

const historyStatuses: ("qualified" | "missed" | "grace")[] = [];

export function makeGroupHistory(seed: number): Group["history"] {
  const out: Group["history"] = [];
  for (let i = 34; i >= 1; i--) {
    const d = subDays(now, i);
    const r = Math.abs(Math.sin((i + seed) * 12.9898)) % 1;
    const result = r > 0.17 ? "qualified" : r > 0.08 ? "grace" : "missed";
    historyStatuses.push(result);
    out.push({ date: format(d, "yyyy-MM-dd"), result });
  }
  return out;
}

export const groups: Group[] = [
  {
    id: "ship-it-squad",
    name: "Ship It Squad",
    emoji: "🚀",
    policy: "All members",
    policyDetail: "Every member must meet their daily commitment for the group streak to qualify.",
    gracePeriod: "1 grace day per month",
    timezone: "Europe/Berlin",
    streak: 21,
    longest: 41,
    rate: 94,
    todayQualified: false,
    memberDone: 3,
    memberTotal: 4,
    memberIds: ["alex", "mira", "jonas", "priya"],
    qualificationNote: "Waiting on Jonas Weber — 2 of 4 commitments complete.",
    history: makeGroupHistory(3),
  },
  {
    id: "night-owls",
    name: "Night Owls",
    emoji: "🌙",
    policy: "Majority",
    policyDetail: "At least 2 of 3 members must complete their commitments.",
    gracePeriod: "2 grace days per month",
    timezone: "America/New_York",
    streak: 6,
    longest: 18,
    rate: 88,
    todayQualified: false,
    memberDone: 1,
    memberTotal: 3,
    memberIds: ["alex", "sam", "lena"],
    qualificationNote: "1 of 2 required members complete. Sam and Lena still have open work.",
    history: makeGroupHistory(11),
  },
  {
    id: "open-source-guild",
    name: "Open Source Guild",
    emoji: "🌱",
    policy: "All members",
    policyDetail: "Every member must meet their daily commitment. Capped at 5 members.",
    gracePeriod: "No grace period",
    timezone: "Europe/London",
    streak: 4,
    longest: 12,
    rate: 81,
    todayQualified: false,
    memberDone: 3,
    memberTotal: 5,
    memberIds: ["alex", "diego", "mira", "lena", "sam"],
    qualificationNote: "Alex, Diego and Mira are done. Lena is at risk, Sam has not started.",
    history: makeGroupHistory(23),
  },
];

export const tasks: Task[] = [
  {
    id: "t1",
    title: "Ship token refresh middleware",
    description:
      "Finalize the rotating refresh-token flow and wire it into the auth gateway. Include tests for expired and revoked tokens.",
    platform: "trello",
    project: "Platform API · In progress",
    sourceStatus: "done",
    status: "activity",
    criteria: "Push ≥ 2 commits and merge PR into main",
    deadline: at(18, 0),
    commitmentMet: false,
    tag: "Backend",
    evidence: [
      {
        id: "e1",
        type: "commit",
        label: "feat(auth): rotate refresh tokens",
        detail: "3 commits pushed to feat/token-rotation",
        platform: "github",
        time: iso(subHours(now, 2)),
        qualified: true,
      },
      {
        id: "e2",
        type: "pull_request",
        label: "PR #284 opened",
        detail: "Awaiting review from @miracodes",
        platform: "github",
        time: iso(subHours(now, 1)),
        qualified: false,
      },
    ],
    history: [
      { date: "2026-10-30", result: "met" },
      { date: "2026-10-29", result: "met" },
      { date: "2026-10-28", result: "missed" },
    ],
  },
  {
    id: "t2",
    title: "Fix flaky checkout integration test",
    description:
      "The checkout e2e suite fails ~1 in 8 runs on CI. Stabilize the payment intent fixture and remove the arbitrary timeout.",
    platform: "trello",
    project: "Web App · Review",
    sourceStatus: "done",
    status: "verified",
    criteria: "Merge one PR that touches the checkout test suite",
    deadline: at(17, 30),
    commitmentMet: true,
    tag: "Testing",
    evidence: [
      {
        id: "e3",
        type: "merge",
        label: "PR #281 merged",
        detail: "fix(checkout): deterministic payment fixture",
        platform: "github",
        time: iso(subHours(now, 4)),
        qualified: true,
      },
      {
        id: "e4",
        type: "commit",
        label: "test: remove flaky retry wrapper",
        detail: "2 commits · +48 −31",
        platform: "github",
        time: iso(subHours(now, 5)),
        qualified: true,
      },
    ],
    history: [
      { date: "2026-10-30", result: "met" },
      { date: "2026-10-29", result: "missed" },
      { date: "2026-10-28", result: "met" },
    ],
  },
  {
    id: "t3",
    title: "Publish model card for whisper-finetune",
    description:
      "Document training data, evaluation metrics and intended use for the fine-tuned Whisper checkpoint.",
    platform: "huggingface",
    project: "mangino/whisper-finetune",
    sourceStatus: "doing",
    status: "activity",
    criteria: "Update the model card and push the evaluation notebook",
    deadline: at(22, 0),
    commitmentMet: false,
    tag: "ML",
    evidence: [
      {
        id: "e5",
        type: "repo_update",
        label: "README.md updated",
        detail: "Evaluation table added · needs notebook",
        platform: "huggingface",
        time: iso(subHours(now, 3)),
        qualified: false,
      },
    ],
    history: [
      { date: "2026-10-30", result: "met" },
      { date: "2026-10-29", result: "met" },
      { date: "2026-10-28", result: "met" },
    ],
  },
  {
    id: "t4",
    title: "Review two partner pull requests",
    description:
      "Review open PRs from Mira and Priya. Leave at least one substantive comment each and approve or request changes.",
    platform: "manual",
    project: "Personal commitment",
    sourceStatus: "doing",
    status: "in_progress",
    criteria: "2 review comments on GitHub",
    deadline: at(20, 0),
    commitmentMet: false,
    tag: "Collaboration",
    evidence: [
      {
        id: "e6",
        type: "review",
        label: "1 of 2 reviews completed",
        detail: "Reviewed feat/command-palette on devstreak/web",
        platform: "github",
        time: iso(subHours(now, 1)),
        qualified: false,
      },
    ],
    history: [
      { date: "2026-10-30", result: "met" },
      { date: "2026-10-29", result: "met" },
      { date: "2026-10-28", result: "met" },
    ],
  },
  {
    id: "t5",
    title: "Document streak qualification logic",
    description:
      "Write an ADR explaining the independent group-streak model, grace periods and timezone boundaries.",
    platform: "trello",
    project: "Docs · Backlog",
    sourceStatus: "done",
    status: "attention",
    criteria: "Merge a docs PR containing the ADR",
    deadline: at(16, 0),
    commitmentMet: false,
    tag: "Docs",
    evidence: [],
    history: [
      { date: "2026-10-30", result: "met" },
      { date: "2026-10-29", result: "met" },
      { date: "2026-10-28", result: "met" },
    ],
  },
  {
    id: "t6",
    title: "Polish onboarding empty states",
    description:
      "Add tailored empty states for tasks, integrations and accountability before the beta cohort lands.",
    platform: "trello",
    project: "Web App · Done",
    sourceStatus: "done",
    status: "verified",
    criteria: "Merge one PR touching onboarding components",
    deadline: at(14, 0),
    commitmentMet: true,
    tag: "Frontend",
    evidence: [
      {
        id: "e7",
        type: "merge",
        label: "PR #279 merged",
        detail: "feat(onboarding): contextual empty states",
        platform: "github",
        time: iso(subHours(now, 7)),
        qualified: true,
      },
    ],
    history: [
      { date: "2026-10-30", result: "met" },
      { date: "2026-10-29", result: "met" },
      { date: "2026-10-28", result: "met" },
    ],
  },
  {
    id: "t7",
    title: "30 minutes of open-source triage",
    description:
      "Triage new issues on the design-system repo, label them and reply to at least two reporters.",
    platform: "manual",
    project: "Personal commitment",
    sourceStatus: "todo",
    status: "pending",
    criteria: "Any activity on the design-system repo",
    deadline: at(23, 0),
    commitmentMet: false,
    tag: "Open Source",
    evidence: [],
    history: [
      { date: "2026-10-30", result: "met" },
      { date: "2026-10-29", result: "met" },
      { date: "2026-10-28", result: "met" },
    ],
  },
];

export const activities: ActivityEvent[] = [
  {
    id: "a1",
    actorId: "alex",
    platform: "github",
    type: "merge",
    title: "Merged PR #281 — deterministic payment fixture",
    detail: "devstreak/web-app · main · +48 −31",
    taskTitle: "Fix flaky checkout integration test",
    verified: "verified",
    time: iso(subHours(now, 4)),
  },
  {
    id: "a2",
    actorId: "mira",
    platform: "github",
    type: "review",
    title: "Reviewed PR #284 — token rotation",
    detail: "Left 4 comments and approved with suggestions",
    taskTitle: "Ship token refresh middleware",
    verified: "pending",
    time: iso(subHours(now, 2)),
  },
  {
    id: "a3",
    actorId: "priya",
    platform: "huggingface",
    type: "repo_update",
    title: "Updated mangino/whisper-finetune",
    detail: "model card · evaluation metrics",
    verified: "pending",
    time: iso(subHours(now, 3)),
  },
  {
    id: "a4",
    actorId: "jonas",
    platform: "trello",
    type: "sync",
    title: "Completed “Rotate staging database credentials”",
    detail: "Trello task moved to Done · awaiting activity evidence",
    verified: "pending",
    time: iso(subHours(now, 3)),
  },
  {
    id: "a5",
    actorId: "alex",
    platform: "github",
    type: "commit",
    title: "Pushed 3 commits to feat/token-rotation",
    detail: "devstreak/auth-service · includes tests",
    taskTitle: "Ship token refresh middleware",
    verified: "pending",
    time: iso(subHours(now, 2)),
  },
  {
    id: "a6",
    actorId: "lena",
    platform: "github",
    type: "commit",
    title: "Pushed 2 commits to fix/date-picker-a11y",
    detail: "devstreak/design-system",
    verified: "pending",
    time: iso(subHours(now, 5)),
  },
  {
    id: "a7",
    actorId: "alex",
    platform: "trello",
    type: "verified",
    title: "Daily commitment verified",
    detail: "Polish onboarding empty states · 1 merged PR",
    taskTitle: "Polish onboarding empty states",
    verified: "verified",
    time: iso(subHours(now, 7)),
  },
  {
    id: "a8",
    actorId: "diego",
    platform: "github",
    type: "pull_request",
    title: "Opened PR #482 — command palette",
    detail: "devstreak/design-system · 12 files changed",
    verified: "pending",
    time: iso(subHours(now, 8)),
  },
  {
    id: "a9",
    actorId: "sam",
    platform: "github",
    type: "commit",
    title: "Pushed 1 commit to chore/billing-events",
    detail: "stripe/internal-tools",
    verified: "pending",
    time: iso(subHours(now, 9)),
  },
  {
    id: "a10",
    actorId: "alex",
    platform: "github",
    type: "milestone",
    title: "Reached a 10-day personal streak",
    detail: "Consistency milestone · keep showing up",
    verified: "not_required",
    time: iso(subDays(now, 2)),
  },
  {
    id: "a11",
    actorId: "mira",
    platform: "github",
    type: "partner",
    title: "Completed all daily commitments",
    detail: "Ship It Squad · 4 of 4 commitments",
    verified: "not_required",
    time: iso(subHours(now, 6)),
  },
  {
    id: "a12",
    actorId: "priya",
    platform: "huggingface",
    type: "discussion",
    title: "Replied to a discussion on whisper-finetune",
    detail: "“Fine-tuning on low-resource languages”",
    verified: "not_required",
    time: iso(subHours(now, 10)),
  },
];

export const notifications: AppNotification[] = [
  {
    id: "n1",
    kind: "attention",
    title: "A commitment needs attention",
    body: "“Document streak qualification logic” was marked done in Trello but no qualifying activity was detected. Deadline in 42 minutes.",
    time: iso(subMinutes(now, 6)),
    read: false,
    href: "/tasks",
  },
  {
    id: "n2",
    kind: "verified",
    title: "Commitment verified",
    body: "“Fix flaky checkout integration test” was verified through a merged GitHub pull request.",
    time: iso(subHours(now, 4)),
    read: false,
    href: "/tasks",
  },
  {
    id: "n3",
    kind: "partner",
    title: "Mira completed her commitments",
    body: "Ship It Squad is 3 of 4 complete. Jonas still has 2 open commitments.",
    time: iso(subHours(now, 6)),
    read: false,
    href: "/accountability/ship-it-squad",
  },
  {
    id: "n4",
    kind: "deadline",
    title: "Deadline approaching",
    body: "“Ship token refresh middleware” is due at 18:00. 3 commits detected, PR still open.",
    time: iso(subHours(now, 1)),
    read: false,
    href: "/tasks",
  },
  {
    id: "n5",
    kind: "invite",
    title: "New accountability invitation",
    body: "Lena Fischer invited you to join “Open Source Guild”.",
    time: iso(subHours(now, 20)),
    read: true,
    href: "/accountability",
  },
  {
    id: "n6",
    kind: "milestone",
    title: "Group milestone: 21 days",
    body: "Ship It Squad has kept the streak alive for three weeks.",
    time: iso(subDays(now, 1)),
    read: true,
    href: "/streaks",
  },
];

export function generateHeat(days = 126): HeatDay[] {
  const out: HeatDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i);
    const seed = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    let status: HeatDay["status"];
    if (i === 0) status = "upcoming";
    else if (i <= 12) status = "complete";
    else if (seed > 0.86) status = "missed";
    else if (seed > 0.82) status = "rest";
    else status = "complete";
    out.push({
      date,
      key: format(date, "yyyy-MM-dd"),
      status,
      minutes: status === "complete" ? Math.round(55 + seed * 190) : 0,
      commits: status === "complete" ? Math.round(1 + seed * 8) : 0,
    });
  }
  return out;
}

export const weeklyCompletion = [
  { week: "Aug 25", rate: 74, commits: 38 },
  { week: "Sep 1", rate: 82, commits: 44 },
  { week: "Sep 8", rate: 79, commits: 41 },
  { week: "Sep 15", rate: 88, commits: 52 },
  { week: "Sep 22", rate: 85, commits: 47 },
  { week: "Sep 29", rate: 91, commits: 58 },
  { week: "Oct 6", rate: 78, commits: 39 },
  { week: "Oct 13", rate: 86, commits: 51 },
  { week: "Oct 20", rate: 93, commits: 62 },
  { week: "Oct 27", rate: 90, commits: 55 },
  { week: "Nov 3", rate: 87, commits: 49 },
  { week: "Nov 10", rate: 94, commits: 66 },
];

export const dailyActivity = Array.from({ length: 14 }).map((_, i) => {
  const date = subDays(now, 13 - i);
  const seed = Math.abs(Math.sin(i * 7.233) * 10000) % 1;
  return {
    day: format(date, "d MMM"),
    commits: Math.round(1 + seed * 9),
    reviews: Math.round(seed * 4),
    minutes: Math.round(45 + seed * 210),
  };
});

export const dayOfWeek = [
  { day: "Mon", rate: 94 },
  { day: "Tue", rate: 88 },
  { day: "Wed", rate: 91 },
  { day: "Thu", rate: 86 },
  { day: "Fri", rate: 79 },
  { day: "Sat", rate: 62 },
  { day: "Sun", rate: 68 },
];

export const streakTrend = Array.from({ length: 12 }).map((_, i) => {
  const date = subDays(now, (11 - i) * 7);
  const seed = Math.abs(Math.sin(i * 3.919) * 10000) % 1;
  return {
    week: format(date, "d MMM"),
    personal: Math.round(5 + seed * 12 + i * 0.6),
    accountability: Math.round(4 + seed * 9 + i * 0.4),
  };
});

export const projectBreakdown = [
  { name: "devstreak/web-app", commits: 128, color: "#22C55E" },
  { name: "devstreak/auth-service", commits: 86, color: "#3B82F6" },
  { name: "design-system", commits: 54, color: "#8B5CF6" },
  { name: "whisper-finetune", commits: 31, color: "#F59E0B" },
];

export const integrations = [
  {
    id: "trello",
    name: "Trello",
    tagline: "Task synchronization",
    description:
      "Import boards, lists, cards, deadlines and assignments. Sync source status so every external task can become a daily commitment.",
    connected: true,
    account: "alexrivera",
    workspace: "Rivera Workspace",
    lastSync: iso(subMinutes(now, 4)),
    scopes: ["boards:read", "cards:write", "webhooks"],
    resources: ["Platform API", "Web App", "Personal Roadmap"],
  },
  {
    id: "github",
    name: "GitHub",
    tagline: "Activity verification",
    description:
      "Monitor commits, branches, pull requests, reviews and merged contributions as verifiable proof that the work actually happened.",
    connected: true,
    account: "alexrivera",
    workspace: "Personal account · 6 repos",
    lastSync: iso(subMinutes(now, 1)),
    scopes: ["repo:read", "pull_requests:read", "webhooks"],
    resources: ["devstreak/web-app", "devstreak/auth-service", "devstreak/design-system"],
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    tagline: "Activity verification",
    description:
      "Monitor repository updates, model contributions, commits and discussions. Ideal for ML engineers shipping models and datasets.",
    connected: true,
    account: "mangino",
    workspace: "2 repositories",
    lastSync: iso(subMinutes(now, 11)),
    scopes: ["repos:read", "discussions:read"],
    resources: ["mangino/whisper-finetune", "mangino/code-reviewer-lora"],
  },
];

export const peopleInvitable = people.filter((p) => p.id !== "alex");

export function timeDaysAgo(days: number, hour = 9) {
  return iso(setMinutes(setHours(addDays(startOfDay(now), -days), hour), 0));
}
