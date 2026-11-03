import { useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  ExternalLink,
  GitBranch,
  Lock,
  Plug,
  Plus,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Unplug,
} from "lucide-react";
import { PageHeader, SectionHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Drawer, Modal } from "@/components/ui/Overlay";
import { Toggle, Field, Select } from "@/components/ui/Input";
import { GithubIcon, HuggingFaceIcon, TrelloIcon } from "@/components/brand/BrandIcons";
import { useApp } from "@/context/AppContext";
import { integrations } from "@/lib/data";
import { relativeTime, cn } from "@/lib/utils";

const iconFor = {
  trello: <TrelloIcon className="h-5 w-5 text-[#2E9BE6]" />,
  github: <GithubIcon className="h-5 w-5 text-ink" />,
  huggingface: <HuggingFaceIcon className="h-5 w-5" />,
};

const toneFor = {
  trello: "border-blue/25 bg-blue/[0.06]",
  github: "border-line bg-ink/[0.03]",
  huggingface: "border-amber/25 bg-amber/[0.05]",
};

const trelloBoards = [
  { name: "Platform API", cards: 24, members: 3, linked: true },
  { name: "Web App", cards: 38, members: 4, linked: true },
  { name: "Personal Roadmap", cards: 11, members: 1, linked: true },
  { name: "Design Backlog", cards: 17, members: 2, linked: false },
];

const githubRepos = [
  { name: "devstreak/web-app", commits: 128, private: false, linked: true },
  { name: "devstreak/auth-service", commits: 86, private: true, linked: true },
  { name: "devstreak/design-system", commits: 54, private: false, linked: true },
  { name: "devstreak/docs", commits: 21, private: true, linked: false },
  { name: "alex/experiments", commits: 9, private: true, linked: false },
];

const hfRepos = [
  { name: "mangino/whisper-finetune", type: "Model", updated: "3h ago", linked: true },
  { name: "mangino/code-reviewer-lora", type: "Model", updated: "1d ago", linked: true },
  { name: "mangino/benchmark-data", type: "Dataset", updated: "5d ago", linked: false },
];

export function Integrations() {
  const { toast } = useApp();
  const [connected, setConnected] = useState<Record<string, boolean>>({
    trello: true,
    github: true,
    huggingface: true,
  });
  const [configId, setConfigId] = useState<string | null>(null);
  const [disconnectId, setDisconnectId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [evidenceTypes, setEvidenceTypes] = useState({
    commits: true,
    prs: true,
    reviews: true,
    merges: true,
    discussions: false,
  });
  const [linkedOnly, setLinkedOnly] = useState(true);

  const active = integrations.find((i) => i.id === configId);
  const disconnectTarget = integrations.find((i) => i.id === disconnectId);
  const connectedCount = Object.values(connected).filter(Boolean).length;

  const syncNow = (id: string) => {
    setSyncingId(id);
    window.setTimeout(() => {
      setSyncingId(null);
      toast({ tone: "success", title: "Synchronization complete", description: "No new changes since the last check." });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Connect the tools where work is planned and built. DevStreak uses them for synchronization and verifiable evidence — never to replace proof with a checkbox."
        actions={
          <Button variant="secondary" size="sm" onClick={() => toast({ tone: "info", title: "Integration requested", description: "We'll let you know when GitLab and Linear are available." })}>
            <Plus className="h-3.5 w-3.5" /> Request integration
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card flex items-center gap-3 p-4 sm:col-span-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-canvas text-muted">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold text-ink">Integrations are read-only by design</p>
            <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted">
              DevStreak never pushes code, edits cards or accesses file contents. Scopes are limited
              to metadata required for verification.
            </p>
          </div>
          <Lock className="ml-auto hidden h-4 w-4 shrink-0 text-faint sm:block" />
        </div>
        <div className="card flex items-center justify-between gap-3 p-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-faint">Connected</p>
            <p className="number mt-0.5 text-xl font-semibold text-ink">{connectedCount}/3</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-medium uppercase tracking-wider text-faint">Projects monitored</p>
            <p className="number mt-0.5 text-xl font-semibold text-accent-bright">6</p>
          </div>
        </div>
      </div>

      <section>
        <SectionHeader
          title="Connected platforms"
          description="Each integration plays a distinct role: task source or activity evidence."
        />
        <div className="mt-3 space-y-3">
          {integrations.map((integration) => {
            const isConnected = connected[integration.id];
            return (
              <div key={integration.id} className="card overflow-hidden">
                <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-start">
                  <div className="flex min-w-0 flex-1 items-start gap-3.5">
                    <span
                      className={cn(
                        "grid h-12 w-12 shrink-0 place-items-center rounded-xl border",
                        toneFor[integration.id as keyof typeof toneFor],
                      )}
                    >
                      {iconFor[integration.id as keyof typeof iconFor]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[14px] font-semibold text-ink">{integration.name}</h3>
                        <Badge tone={integration.id === "trello" ? "blue" : integration.id === "huggingface" ? "amber" : "neutral"} className="text-[9px]">
                          {integration.tagline}
                        </Badge>
                        {isConnected ? (
                          <Badge tone="green" dot className="text-[9px]">Connected</Badge>
                        ) : (
                          <Badge tone="neutral" className="text-[9px]">Not connected</Badge>
                        )}
                      </div>
                      <p className="mt-1 max-w-xl text-[11.5px] leading-relaxed text-muted">
                        {integration.description}
                      </p>

                      {isConnected && (
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-faint">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="grid h-4 w-4 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-[6px] font-bold text-white">
                              A
                            </span>
                            <span className="font-mono text-muted">@{integration.account}</span>
                          </span>
                          <span>{integration.workspace}</span>
                          <span className="inline-flex items-center gap-1">
                            <RefreshCw className="h-2.5 w-2.5 text-accent-bright" />
                            Synced {relativeTime(integration.lastSync)}
                          </span>
                        </div>
                      )}

                      {isConnected && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {integration.resources.map((r) => (
                            <span key={r} className="rounded border border-line bg-ink/[0.025] px-1.5 py-0.5 font-mono text-[9px] text-faint">
                              {r}
                            </span>
                          ))}
                          {integration.id !== "trello" && (
                            <span className="inline-flex items-center gap-1 rounded border border-accent/20 bg-accent/[0.05] px-1.5 py-0.5 text-[9px] text-accent-bright">
                              <GitBranch className="h-2.5 w-2.5" /> Evidence source
                            </span>
                          )}
                          {integration.id === "trello" && (
                            <span className="inline-flex items-center gap-1 rounded border border-blue/20 bg-blue/[0.05] px-1.5 py-0.5 text-[9px] text-blue">
                              <RefreshCw className="h-2.5 w-2.5" /> Task source
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2 lg:flex-col lg:items-stretch">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => syncNow(integration.id)}
                      loading={syncingId === integration.id}
                      disabled={!isConnected || syncingId === integration.id}
                    >
                      {syncingId !== integration.id && <RefreshCw className="h-3.5 w-3.5" />}
                      Sync
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfigId(integration.id)}
                      disabled={!isConnected}
                    >
                      <Settings2 className="h-3.5 w-3.5" /> Configure
                    </Button>
                    {isConnected ? (
                      <Button variant="ghost" size="sm" onClick={() => setDisconnectId(integration.id)}>
                        <Unplug className="h-3.5 w-3.5" /> Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setConnected((p) => ({ ...p, [integration.id]: true }));
                          toast({ tone: "success", title: `${integration.name} connected`, description: "Choose which resources to monitor in configuration." });
                          setConfigId(integration.id);
                        }}
                      >
                        <Plug className="h-3.5 w-3.5" /> Connect
                      </Button>
                    )}
                  </div>
                </div>

                {isConnected && (
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line-soft bg-canvas/40 px-4 py-2.5 sm:px-5">
                    <span className="text-[9.5px] font-medium uppercase tracking-wider text-faint">Scopes</span>
                    {integration.scopes.map((s) => (
                      <span key={s} className="font-mono text-[9px] text-muted">{s}</span>
                    ))}
                    <span className="ml-auto inline-flex items-center gap-1 text-[9.5px] text-faint">
                      <ShieldCheck className="h-3 w-3 text-accent-bright" /> Read-only
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-violet/25 bg-violet/10 text-violet">
              <GitBranch className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-[13px] font-semibold text-ink">Evidence, not autopilot</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                GitHub and Hugging Face verify that code actually moved. A Trello card marked done
                without qualifying repository activity is flagged as attention — never verified.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              { label: "Commits", icon: GitBranch },
              { label: "Pull requests", icon: ExternalLink },
              { label: "Repo updates", icon: RefreshCw },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2 rounded-lg border border-line bg-canvas/40 px-2.5 py-2 text-[10px] text-muted">
                <t.icon className="h-3 w-3 text-violet" /> {t.label}
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-blue/25 bg-blue/10 text-blue">
              <RefreshCw className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-[13px] font-semibold text-ink">Synchronization status</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                Task imports are idempotent. Changes in Trello appear here in under a minute, while
                evidence checks run continuously against selected repositories.
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            {integrations.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border border-line bg-canvas/40 px-2.5 py-1.5">
                <span className="inline-flex items-center gap-2 text-[10px] text-muted">
                  {iconFor[i.id as keyof typeof iconFor]}
                  {i.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] text-faint">
                  <span className={cn("h-1.5 w-1.5 rounded-full", connected[i.id] ? "bg-accent-bright" : "bg-faint/50")} />
                  {connected[i.id] ? "Healthy · 1m ago" : "Disconnected"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="card flex flex-col items-start justify-between gap-3 border-dashed p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-canvas text-faint">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[12.5px] font-semibold text-ink">More integrations on the roadmap</p>
            <p className="mt-0.5 text-[10.5px] text-faint">GitLab, Linear, Jira and Notion are being evaluated.</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {["GitLab", "Linear", "Jira", "Notion"].map((n) => (
            <span key={n} className="rounded-md border border-line bg-ink/[0.02] px-2 py-1 text-[9px] text-faint">{n}</span>
          ))}
        </div>
      </div>

      <Drawer
        open={configId !== null}
        onClose={() => setConfigId(null)}
        title={active ? `${active.name} configuration` : "Configuration"}
        description={active ? `${active.workspace} · read-only connection` : undefined}
        footer={
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setDisconnectId(configId);
                setConfigId(null);
              }}
            >
              <Unplug className="h-3.5 w-3.5" /> Disconnect
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setConfigId(null)}>Cancel</Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setConfigId(null);
                  toast({ tone: "success", title: "Configuration saved", description: "New monitoring rules apply from the next sync." });
                }}
              >
                <Check className="h-3.5 w-3.5" /> Save changes
              </Button>
            </div>
          </div>
        }
      >
        {active && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas/50 p-3.5">
              <span className={cn("grid h-10 w-10 place-items-center rounded-xl border", toneFor[active.id as keyof typeof toneFor])}>
                {iconFor[active.id as keyof typeof iconFor]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-ink">@{active.account}</p>
                <p className="text-[10px] text-faint">{active.workspace}</p>
              </div>
              <Badge tone="green" dot className="text-[9px]">Connected</Badge>
            </div>

            {active.id === "trello" && (
              <>
                <section>
                  <h3 className="text-[12px] font-semibold text-ink">Boards to monitor</h3>
                  <p className="mt-0.5 text-[10.5px] text-faint">Only cards from selected boards can become commitments.</p>
                  <div className="mt-2.5 space-y-1.5">
                    {trelloBoards.map((b) => (
                      <label key={b.name} className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-card px-3 py-2.5">
                        <input type="checkbox" defaultChecked={b.linked} className="h-3.5 w-3.5 accent-emerald-500" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[11.5px] font-medium text-ink">{b.name}</span>
                          <span className="block text-[9.5px] text-faint">{b.cards} cards · {b.members} members</span>
                        </span>
                        {b.linked && <Badge tone="blue" className="text-[8.5px]">Linked</Badge>}
                      </label>
                    ))}
                  </div>
                </section>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Sync frequency">
                    <Select defaultValue="5">
                      <option value="1">Every minute</option>
                      <option value="5">Every 5 minutes</option>
                      <option value="15">Every 15 minutes</option>
                    </Select>
                  </Field>
                  <Field label="Card scope">
                    <Select defaultValue="assigned">
                      <option value="assigned">Assigned to me</option>
                      <option value="all">All cards</option>
                      <option value="due">With due dates only</option>
                    </Select>
                  </Field>
                </div>
                <div className="card space-y-3 p-3.5">
                  <Toggle checked label="Sync card descriptions" onChange={() => {}} description="Descriptions become context for new commitments." />
                  <div className="h-px bg-line-soft" />
                  <Toggle checked={false} label="Auto-create commitments from due dates" onChange={() => {}} description="Off by default. You decide what becomes a daily commitment." />
                </div>
              </>
            )}

            {active.id === "github" && (
              <>
                <section>
                  <h3 className="text-[12px] font-semibold text-ink">Repositories to monitor</h3>
                  <p className="mt-0.5 text-[10.5px] text-faint">Activity from selected repositories can verify commitments.</p>
                  <div className="mt-2.5 space-y-1.5">
                    {githubRepos.map((r) => (
                      <label key={r.name} className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-card px-3 py-2.5">
                        <input type="checkbox" defaultChecked={r.linked} className="h-3.5 w-3.5 accent-emerald-500" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-mono text-[10.5px] font-medium text-ink">{r.name}</span>
                          <span className="block text-[9.5px] text-faint">{r.commits} commits · {r.private ? "Private" : "Public"}</span>
                        </span>
                        {r.linked && <Badge tone="violet" className="text-[8.5px]">Evidence</Badge>}
                      </label>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="text-[12px] font-semibold text-ink">Qualifying activity</h3>
                  <p className="mt-0.5 text-[10.5px] text-faint">Choose which events can satisfy commitment criteria.</p>
                  <div className="mt-2.5 space-y-2">
                    {[
                      { key: "commits", label: "Commits pushed", desc: "Any commit on a monitored branch" },
                      { key: "prs", label: "Pull requests opened", desc: "New PRs referencing a commitment" },
                      { key: "reviews", label: "Reviews submitted", desc: "Approvals or change requests" },
                      { key: "merges", label: "Pull requests merged", desc: "Strongest evidence of shipped work" },
                    ].map((opt) => (
                      <label key={opt.key} className="flex items-start gap-2.5 rounded-lg border border-line bg-card px-3 py-2">
                        <input
                          type="checkbox"
                          checked={evidenceTypes[opt.key as keyof typeof evidenceTypes]}
                          onChange={(e) => setEvidenceTypes((p) => ({ ...p, [opt.key]: e.target.checked }))}
                          className="mt-0.5 h-3.5 w-3.5 accent-emerald-500"
                        />
                        <span>
                          <span className="block text-[11px] font-medium text-ink">{opt.label}</span>
                          <span className="block text-[9.5px] text-faint">{opt.desc}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </section>
                <div className="card p-3.5">
                  <Toggle
                    checked={linkedOnly}
                    onChange={setLinkedOnly}
                    label="Only count activity in selected repositories"
                    description="Unselected repos are never scanned, even if you contribute to them."
                  />
                </div>
                <div className="flex items-start gap-2.5 rounded-lg border border-accent/20 bg-accent/[0.04] px-3 py-2.5">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-bright" />
                  <p className="text-[10px] leading-relaxed text-muted">
                    A source task marked done in Trello will not be verified unless one of these
                    event types is detected within the commitment window.
                  </p>
                </div>
              </>
            )}

            {active.id === "huggingface" && (
              <>
                <section>
                  <h3 className="text-[12px] font-semibold text-ink">Repositories to monitor</h3>
                  <div className="mt-2.5 space-y-1.5">
                    {hfRepos.map((r) => (
                      <label key={r.name} className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-card px-3 py-2.5">
                        <input type="checkbox" defaultChecked={r.linked} className="h-3.5 w-3.5 accent-emerald-500" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-mono text-[10.5px] font-medium text-ink">{r.name}</span>
                          <span className="block text-[9.5px] text-faint">{r.type} · updated {r.updated}</span>
                        </span>
                        {r.linked && <Badge tone="violet" className="text-[8.5px]">Evidence</Badge>}
                      </label>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="text-[12px] font-semibold text-ink">Qualifying activity</h3>
                  <div className="mt-2.5 space-y-2">
                    {[
                      { key: "commits", label: "Repository commits", desc: "Commits to model or dataset repos" },
                      { key: "prs", label: "Model card updates", desc: "README or metadata changes" },
                      { key: "discussions", label: "Discussion replies", desc: "Community and issue responses" },
                    ].map((opt) => (
                      <label key={opt.key} className="flex items-start gap-2.5 rounded-lg border border-line bg-card px-3 py-2">
                        <input
                          type="checkbox"
                          checked={evidenceTypes[opt.key as keyof typeof evidenceTypes] ?? true}
                          onChange={(e) => setEvidenceTypes((p) => ({ ...p, [opt.key]: e.target.checked }))}
                          className="mt-0.5 h-3.5 w-3.5 accent-emerald-500"
                        />
                        <span>
                          <span className="block text-[11px] font-medium text-ink">{opt.label}</span>
                          <span className="block text-[9.5px] text-faint">{opt.desc}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </section>
              </>
            )}

            <div className="rounded-xl border border-line bg-canvas/50 p-3.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-faint">Connection health</span>
                <span className="inline-flex items-center gap-1 font-medium text-accent-bright">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" /> Healthy
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-[9.5px] text-faint">
                <span>Last successful sync {relativeTime(active.lastSync)}</span>
                <button className="inline-flex items-center gap-1 text-muted hover:text-ink">
                  View logs <ChevronRight className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        open={disconnectId !== null}
        onClose={() => setDisconnectId(null)}
        title={`Disconnect ${disconnectTarget?.name ?? "integration"}?`}
        description="This stops synchronization and verification immediately."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDisconnectId(null)}>Keep connected</Button>
            <Button
              variant="danger"
              onClick={() => {
                if (disconnectId) {
                  setConnected((p) => ({ ...p, [disconnectId]: false }));
                  toast({
                    tone: "error",
                    title: `${disconnectTarget?.name} disconnected`,
                    description: "Existing evidence is preserved, but no new activity will be detected.",
                  });
                }
                setDisconnectId(null);
              }}
            >
              <Unplug className="h-3.5 w-3.5" /> Disconnect
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3 rounded-xl border border-danger/25 bg-danger/[0.05] p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <div className="text-[11.5px] leading-relaxed text-muted">
            <p className="font-medium text-danger">Today's open commitments may become unverifiable.</p>
            <p className="mt-1">
              {disconnectId === "trello"
                ? "Synchronized tasks will remain as historical commitments, but source status will stop updating."
                : "Commitments that rely on this platform for evidence may be marked needs attention at the next check."}
            </p>
            <p className="mt-1.5 text-[10.5px] text-faint">
              You can reconnect at any time. Historical verification is never rewritten.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
