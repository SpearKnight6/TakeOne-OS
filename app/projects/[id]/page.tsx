export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { updateProject, upsertCampaignLifecycle, upsertCampaignMilestone, upsertCampaignPillar } from '@/app/actions';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { StatusBadge } from '@/components/StatusBadge';
import { ensureDefaultCampaignLifecycle, ensureDefaultCampaignMilestones, ensureDefaultCampaignPillars, getProjectById } from '@/lib/data';
import { CampaignLifecycleStatus, CampaignMilestoneStatus, CampaignPillarStatus } from '@/lib/types';

const CAMPAIGN_STATUS_WEIGHTS: Record<CampaignPillarStatus | CampaignLifecycleStatus | CampaignMilestoneStatus, number> = {
  'not started': 0,
  'in progress': 50,
  blocked: 25,
  done: 100
};

const LIFECYCLE_PHASE_ORDER = ['Pre-Production', 'Production', 'Post-Production', 'Launch', 'Post-Launch'] as const;

function calculateReadiness(statuses: Array<CampaignPillarStatus | CampaignLifecycleStatus | CampaignMilestoneStatus>) {
  if (statuses.length === 0) return 0;
  const total = statuses.reduce((sum, status) => sum + CAMPAIGN_STATUS_WEIGHTS[status], 0);
  return Math.round(total / statuses.length);
}

function getStatusCounts(statuses: Array<CampaignPillarStatus | CampaignLifecycleStatus | CampaignMilestoneStatus>) {
  return statuses.reduce(
    (acc, status) => {
      acc[status] += 1;
      return acc;
    },
    {
      'not started': 0,
      'in progress': 0,
      blocked: 0,
      done: 0
    } as Record<CampaignPillarStatus | CampaignLifecycleStatus | CampaignMilestoneStatus, number>
  );
}

export default async function ProjectDetailPage({
  params
}: {
  params: { id: string };
}) {
  const { data: project, error: projectError } = await getProjectById(params.id);
  if (projectError) return <ErrorState message={projectError.message} />;
  if (!project) return <ErrorState message="Project not found." />;

  const [
    { data: campaignPillars, error: campaignPillarsError },
    { data: campaignLifecycle, error: campaignLifecycleError },
    { data: campaignMilestones, error: campaignMilestonesError }
  ] = await Promise.all([
    ensureDefaultCampaignPillars(project.id),
    ensureDefaultCampaignLifecycle(project.id),
    ensureDefaultCampaignMilestones(project.id)
  ]);

  if (campaignPillarsError) return <ErrorState message={campaignPillarsError.message} />;
  if (campaignLifecycleError) return <ErrorState message={campaignLifecycleError.message} />;
  if (campaignMilestonesError) return <ErrorState message={campaignMilestonesError.message} />;

  const campaignOSStatuses = campaignPillars.map((pillar) => pillar.status);
  const lifecycleStatuses = campaignLifecycle.map((phase) => phase.status);
  const milestoneStatuses = campaignMilestones.map((milestone) => milestone.status);
  const campaignOsReadiness = calculateReadiness(campaignOSStatuses);
  const lifecycleReadiness = calculateReadiness(lifecycleStatuses);
  const milestonesReadiness = calculateReadiness(milestoneStatuses);
  const overallCampaignHealth = calculateReadiness([...campaignOSStatuses, ...lifecycleStatuses, ...milestoneStatuses]);
  const campaignOSCounts = getStatusCounts(campaignOSStatuses);
  const lifecycleCounts = getStatusCounts(lifecycleStatuses);
  const milestoneCounts = getStatusCounts(milestoneStatuses);
  const lifecycleByPhaseName = new Map(campaignLifecycle.map((phase) => [phase.phase_name, phase]));

  return (
    <div className="grid project-detail-shell">
      <p className="project-back-link"><Link href="/projects">← Back to projects</Link></p>

      <section className="section card project-hero-card">
        <h2 className="project-hero-title">{project.name}</h2>
        <p className="muted project-hero-description">{project.description ?? 'No description.'}</p>
        <div className="project-hero-meta">
          <StatusBadge label={project.status} /> <span>Due: {project.due_date ?? '—'}</span>
        </div>

        <h3>Edit project</h3>
        <form action={updateProject} className="form">
          <input type="hidden" name="id" value={project.id} />
          <div className="form-row">
            <input name="name" defaultValue={project.name} required />
            <select name="status" defaultValue={project.status}>
              <option value="active">active</option>
              <option value="on hold">on hold</option>
              <option value="completed">completed</option>
            </select>
            <input type="date" name="due_date" defaultValue={project.due_date ?? ''} />
          </div>
          <textarea name="description" defaultValue={project.description ?? ''} rows={3} />
          <button type="submit">Save project</button>
        </form>
      </section>

      <section className="section card campaign-summary">
        <div className="campaign-section-head">
          <h3>Campaign Summary</h3>
          <p className="muted">Command-center snapshot of campaign readiness and execution risk.</p>
        </div>
        <div className="campaign-summary-grid">
          <article className="campaign-summary-card">
            <p className="campaign-summary-label">Campaign OS Readiness</p>
            <p className="campaign-summary-value">{campaignOsReadiness}%</p>
          </article>
          <article className="campaign-summary-card">
            <p className="campaign-summary-label">Campaign Lifecycle Readiness</p>
            <p className="campaign-summary-value">{lifecycleReadiness}%</p>
          </article>
          <article className="campaign-summary-card">
            <p className="campaign-summary-label">Milestones Readiness</p>
            <p className="campaign-summary-value">{milestonesReadiness}%</p>
          </article>
          <article className="campaign-summary-card campaign-summary-card--health">
            <p className="campaign-summary-label">Overall Campaign Health</p>
            <p className="campaign-summary-value">{overallCampaignHealth}%</p>
          </article>
        </div>
      </section>

      <section className="section card campaign-os-section">
        <div className="campaign-section-head">
          <h3>Campaign OS</h3>
          <div className="campaign-status-summary">
            <StatusBadge label={`not started: ${campaignOSCounts['not started']}`} />
            <StatusBadge label={`in progress: ${campaignOSCounts['in progress']}`} />
            <StatusBadge label={`blocked: ${campaignOSCounts.blocked}`} />
            <StatusBadge label={`done: ${campaignOSCounts.done}`} />
          </div>
        </div>
        <p className="muted campaign-os-helper">Film marketing strategy synced to delivery workflow. One pillar card maps to one row in <code>campaign_pillars</code>.</p>
        {campaignPillars.length === 0 ? <EmptyState message="No campaign pillars available yet." /> : (
          <div className="campaign-os-grid">
            {campaignPillars.map((pillar) => (
              <article key={pillar.id} className="card campaign-os-card">
                <h4 className="campaign-os-title">{pillar.pillar_name}</h4>
                <form action={upsertCampaignPillar} className="campaign-os-form">
                  <input type="hidden" name="id" value={pillar.id} />
                  <input type="hidden" name="project_id" value={project.id} />
                  <label>
                    Objective
                    <textarea name="objective" defaultValue={pillar.objective ?? ''} rows={2} />
                  </label>
                  <label>
                    Notes
                    <textarea name="notes" defaultValue={pillar.notes ?? ''} rows={3} />
                  </label>
                  <div className="campaign-os-meta-grid">
                    <label>
                      Owner
                      <input name="owner" defaultValue={pillar.owner ?? ''} placeholder="Owner" />
                    </label>
                    <label>
                      Status
                      <select name="status" defaultValue={pillar.status}>
                        <option value="not started">not started</option>
                        <option value="in progress">in progress</option>
                        <option value="blocked">blocked</option>
                        <option value="done">done</option>
                      </select>
                    </label>
                    <label>
                      Due date
                      <input type="date" name="due_date" defaultValue={pillar.due_date ?? ''} />
                    </label>
                  </div>
                  <button type="submit">Save pillar</button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section card campaign-milestones-section">
        <div className="campaign-section-head">
          <h3>Campaign Milestones</h3>
          <div className="campaign-status-summary">
            <StatusBadge label={`not started: ${milestoneCounts['not started']}`} />
            <StatusBadge label={`in progress: ${milestoneCounts['in progress']}`} />
            <StatusBadge label={`blocked: ${milestoneCounts.blocked}`} />
            <StatusBadge label={`done: ${milestoneCounts.done}`} />
          </div>
        </div>
        <p className="muted campaign-os-helper">Film ops command center for campaign drops and release moments. One milestone card maps to one row in <code>campaign_milestones</code>.</p>
        {campaignMilestones.length === 0 ? <EmptyState message="No campaign milestones available yet." /> : (
          <div className="campaign-os-grid">
            {campaignMilestones.map((milestone) => (
              <article key={milestone.id} className="card campaign-os-card campaign-milestone-card">
                <div className="campaign-milestone-header">
                  <h4 className="campaign-os-title">{milestone.milestone_name}</h4>
                  <StatusBadge label={milestone.status} />
                </div>
                <form action={upsertCampaignMilestone} className="campaign-os-form">
                  <input type="hidden" name="id" value={milestone.id} />
                  <input type="hidden" name="project_id" value={project.id} />
                  <label>
                    Milestone Name
                    <input name="milestone_name" defaultValue={milestone.milestone_name} required />
                  </label>
                  <div className="campaign-os-meta-grid">
                    <label>
                      Phase
                      <input name="phase" defaultValue={milestone.phase ?? ''} placeholder="Launch" />
                    </label>
                    <label>
                      Target Date
                      <input type="date" name="target_date" defaultValue={milestone.target_date ?? ''} />
                    </label>
                    <label>
                      Status
                      <select name="status" defaultValue={milestone.status}>
                        <option value="not started">not started</option>
                        <option value="in progress">in progress</option>
                        <option value="blocked">blocked</option>
                        <option value="done">done</option>
                      </select>
                    </label>
                  </div>
                  <label className="milestone-linked-assets-field">
                    Linked Assets
                    <textarea
                      name="linked_assets"
                      defaultValue={milestone.linked_assets ?? ''}
                      rows={3}
                      placeholder="Trailer cut v2, hero poster, influencer toolkit"
                    />
                    <span className="milestone-field-helper">List specific campaign deliverables required to execute this milestone.</span>
                  </label>
                  <label>
                    Approvals
                    <textarea name="approvals" defaultValue={milestone.approvals ?? ''} rows={2} placeholder="Studio, legal, music, talent" />
                  </label>
                  <label>
                    Notes
                    <textarea name="notes" defaultValue={milestone.notes ?? ''} rows={3} />
                  </label>
                  <button type="submit">Save milestone</button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section card campaign-lifecycle-section">
        <div className="campaign-section-head">
          <h3>Campaign Lifecycle</h3>
          <div className="campaign-status-summary">
            <StatusBadge label={`not started: ${lifecycleCounts['not started']}`} />
            <StatusBadge label={`in progress: ${lifecycleCounts['in progress']}`} />
            <StatusBadge label={`blocked: ${lifecycleCounts.blocked}`} />
            <StatusBadge label={`done: ${lifecycleCounts.done}`} />
          </div>
        </div>
        <p className="muted campaign-os-helper">Five lifecycle phases from pre-production to post-launch. One lifecycle card maps to one row in <code>campaign_lifecycle</code>.</p>
        <div className="lifecycle-tracker">
          {LIFECYCLE_PHASE_ORDER.map((phaseName) => {
            const phase = lifecycleByPhaseName.get(phaseName);
            return (
              <article key={phaseName} className="lifecycle-phase" data-status={phase?.status ?? 'not started'}>
                <span className="lifecycle-phase-name">{phaseName}</span>
                <StatusBadge label={phase?.status ?? 'not started'} />
              </article>
            );
          })}
        </div>
        {campaignLifecycle.length === 0 ? <EmptyState message="No campaign lifecycle phases available yet." /> : (
          <div className="campaign-os-grid">
            {campaignLifecycle.map((phase) => (
              <article key={phase.id} className="card campaign-os-card">
                <h4 className="campaign-os-title">{phase.phase_name}</h4>
                <form action={upsertCampaignLifecycle} className="campaign-os-form">
                  <input type="hidden" name="id" value={phase.id} />
                  <input type="hidden" name="project_id" value={project.id} />
                  <label>
                    Objective
                    <textarea name="objective" defaultValue={phase.objective ?? ''} rows={2} />
                  </label>
                  <label>
                    Social Strategy
                    <textarea name="social_strategy" defaultValue={phase.social_strategy ?? ''} rows={3} />
                  </label>
                  <label>
                    Traction Goal
                    <textarea name="traction_goal" defaultValue={phase.traction_goal ?? ''} rows={2} />
                  </label>
                  <label>
                    Key Assets
                    <textarea name="key_assets" defaultValue={phase.key_assets ?? ''} rows={2} />
                  </label>
                  <div className="campaign-os-meta-grid">
                    <label>
                      KPI
                      <input name="kpi" defaultValue={phase.kpi ?? ''} placeholder="KPI" />
                    </label>
                    <label>
                      Status
                      <select name="status" defaultValue={phase.status}>
                        <option value="not started">not started</option>
                        <option value="in progress">in progress</option>
                        <option value="blocked">blocked</option>
                        <option value="done">done</option>
                      </select>
                    </label>
                  </div>
                  <button type="submit">Save phase</button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
