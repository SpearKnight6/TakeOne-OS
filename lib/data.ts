import { getCurrentUser } from '@/lib/auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { Approval, Asset, AssetVersion, CampaignLifecycle, CampaignMilestone, CampaignPillar, Project, Task } from './types';

const DEFAULT_CAMPAIGN_PILLARS = ['First Signal', 'Audience Lock', 'Build-Up Engine', 'Hype Flow', 'Ground Pulse'] as const;

const DEFAULT_CAMPAIGN_LIFECYCLE_PHASES = ['Pre-Production', 'Production', 'Post-Production', 'Launch', 'Post-Launch'] as const;

const DEFAULT_CAMPAIGN_MILESTONES = [
  {
    milestone_name: 'First Look',
    phase: 'Pre-Production',
    notes: 'Primary visual reveal that establishes first signal and premium positioning.'
  },
  {
    milestone_name: 'Title Reveal',
    phase: 'Pre-Production',
    notes: 'Reveal title identity, tone, and audience memory anchor.'
  },
  {
    milestone_name: 'Character Intro',
    phase: 'Production',
    notes: 'Introduce key character energy and strengthen audience lock.'
  },
  {
    milestone_name: 'First Song',
    phase: 'Post-Production',
    notes: 'Music-led social traction asset for recall and repeat engagement.'
  },
  {
    milestone_name: 'Teaser',
    phase: 'Post-Production',
    notes: 'First high-impact narrative momentum spike.'
  },
  {
    milestone_name: 'Trailer',
    phase: 'Launch',
    notes: 'Major conversion asset before release week.'
  },
  {
    milestone_name: 'Release Week',
    phase: 'Launch',
    notes: 'Peak urgency and mass visibility phase.'
  },
  {
    milestone_name: 'OTT Window',
    phase: 'Post-Launch',
    notes: 'Second-life momentum and long-tail audience visibility.'
  }
] as const;

export interface DashboardData {
  activeProjects: number;
  pendingApprovals: number;
  overdueTasks: number;
  upcomingDeadlines: Task[];
  recentAssets: Array<Asset & { project_name?: string }>;
}

export interface ProjectSummary extends Project {
  overallCampaignHealth: number | null;
  currentLifecyclePhase: string | null;
}

type LifecycleSnapshot = Pick<CampaignLifecycle, 'project_id' | 'phase_name' | 'status'>;

async function requireCurrentUserId() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Authentication required.');
  return user.id;
}

function calculateReadiness(statuses: Array<CampaignPillar['status'] | CampaignLifecycle['status'] | CampaignMilestone['status']>) {
  if (statuses.length === 0) return null;

  const weights = {
    'not started': 0,
    'in progress': 50,
    blocked: 25,
    done: 100
  };

  const total = statuses.reduce((sum, status) => sum + weights[status], 0);
  return Math.round(total / statuses.length);
}

function deriveCurrentPhase(campaignLifecycle: LifecycleSnapshot[]) {
  const phaseOrder = ['Pre-Production', 'Production', 'Post-Production', 'Launch', 'Post-Launch'];
  const byName = new Map(campaignLifecycle.map((item) => [item.phase_name, item]));

  const inProgress = phaseOrder.find((phase) => byName.get(phase)?.status === 'in progress');
  if (inProgress) return inProgress;

  const firstNotDone = phaseOrder.find((phase) => {
    const status = byName.get(phase)?.status;
    return status && status !== 'done';
  });

  return firstNotDone ?? (campaignLifecycle.length > 0 ? campaignLifecycle[0].phase_name : null);
}

export async function getProjects() {
  const userId = await requireCurrentUserId();
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false });

  return { data: (data ?? []) as Project[], error };
}

export async function getProjectSummaries() {
  const supabase = getServerSupabase();
  const { data: projects, error } = await getProjects();

  if (error || projects.length === 0) {
    return { data: projects.map((project) => ({ ...project, overallCampaignHealth: null, currentLifecyclePhase: null })), error };
  }

  const projectIds = projects.map((project) => project.id);
  const [pillarsRes, lifecycleRes, milestonesRes] = await Promise.all([
    supabase.from('campaign_pillars').select('project_id,status').in('project_id', projectIds),
    supabase.from('campaign_lifecycle').select('project_id,phase_name,status').in('project_id', projectIds),
    supabase.from('campaign_milestones').select('project_id,status').in('project_id', projectIds)
  ]);

  if (pillarsRes.error) return { data: [] as ProjectSummary[], error: pillarsRes.error };
  if (lifecycleRes.error) return { data: [] as ProjectSummary[], error: lifecycleRes.error };
  if (milestonesRes.error) return { data: [] as ProjectSummary[], error: milestonesRes.error };

  const pillarsByProject = (pillarsRes.data ?? []).reduce(
    (acc, item) => {
      acc[item.project_id] ??= [];
      acc[item.project_id].push(item.status as CampaignPillar['status']);
      return acc;
    },
    {} as Record<string, CampaignPillar['status'][]>
  );

  const lifecycleByProject = (lifecycleRes.data ?? []).reduce(
    (acc, item) => {
      acc[item.project_id] ??= [];
      acc[item.project_id].push(item as LifecycleSnapshot);
      return acc;
    },
    {} as Record<string, LifecycleSnapshot[]>
  );

  const milestonesByProject = (milestonesRes.data ?? []).reduce(
    (acc, item) => {
      acc[item.project_id] ??= [];
      acc[item.project_id].push(item.status as CampaignMilestone['status']);
      return acc;
    },
    {} as Record<string, CampaignMilestone['status'][]>
  );

  const summaries = projects.map((project) => {
    const lifecycle = lifecycleByProject[project.id] ?? [];
    const health = calculateReadiness([
      ...(pillarsByProject[project.id] ?? []),
      ...lifecycle.map((item) => item.status),
      ...(milestonesByProject[project.id] ?? [])
    ]);

    return {
      ...project,
      overallCampaignHealth: health,
      currentLifecyclePhase: deriveCurrentPhase(lifecycle)
    };
  });

  return { data: summaries, error: null };
}

export async function getProjectById(id: string) {
  const userId = await requireCurrentUserId();
  const supabase = getServerSupabase();
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).eq('owner_id', userId).single();
  return { data: (data ?? null) as Project | null, error };
}

export async function getTasksByProject(projectId: string, status?: string) {
  const supabase = getServerSupabase();
  let query = supabase.from('tasks').select('*').eq('project_id', projectId).order('due_date', { ascending: true, nullsFirst: false });
  if (status && status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  return { data: (data ?? []) as Task[], error };
}

export async function getAssetsByProject(projectId: string) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase.from('assets').select('*').eq('project_id', projectId).order('created_at', { ascending: false });
  return { data: (data ?? []) as Asset[], error };
}

export async function getVersionsByAsset(assetId: string) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase.from('asset_versions').select('*').eq('asset_id', assetId).order('created_at', { ascending: false });
  return { data: (data ?? []) as AssetVersion[], error };
}

export async function getApprovalsByVersion(versionId: string) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase.from('approvals').select('*').eq('version_id', versionId).order('created_at', { ascending: true });
  return { data: (data ?? []) as Approval[], error };
}

export async function getDashboardData(): Promise<DashboardData> {
  const userId = await requireCurrentUserId();
  const supabase = getServerSupabase();
  const today = new Date().toISOString().slice(0, 10);
  const in7 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const { data: userProjects, error: projectsLookupError } = await supabase.from('projects').select('id').eq('owner_id', userId);
  if (projectsLookupError) throw projectsLookupError;
  const projectIds = (userProjects ?? []).map((project) => project.id);

  if (projectIds.length === 0) {
    return {
      activeProjects: 0,
      pendingApprovals: 0,
      overdueTasks: 0,
      upcomingDeadlines: [],
      recentAssets: []
    };
  }

  const { data: userAssets, error: assetsLookupError } = await supabase.from('assets').select('id').in('project_id', projectIds);
  if (assetsLookupError) throw assetsLookupError;
  const assetIds = (userAssets ?? []).map((asset) => asset.id);

  const { data: userVersions, error: versionsLookupError } =
    assetIds.length > 0 ? await supabase.from('asset_versions').select('id').in('asset_id', assetIds) : { data: [], error: null };
  if (versionsLookupError) throw versionsLookupError;
  const versionIds = (userVersions ?? []).map((version) => version.id);

  const [projectsRes, pendingRes, overdueRes, upcomingRes, recentAssetsRes] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'active').in('id', projectIds),
    versionIds.length > 0
      ? supabase.from('approvals').select('id', { count: 'exact', head: true }).eq('status', 'pending review').in('version_id', versionIds)
      : Promise.resolve({ count: 0, error: null, data: null }),
    supabase.from('tasks').select('id', { count: 'exact', head: true }).lt('due_date', today).neq('status', 'done').in('project_id', projectIds),
    supabase
      .from('tasks')
      .select('*')
      .in('project_id', projectIds)
      .gte('due_date', today)
      .lte('due_date', in7)
      .neq('status', 'done')
      .order('due_date', { ascending: true })
      .limit(10),
    supabase.from('assets').select('*, projects(name)').in('project_id', projectIds).order('created_at', { ascending: false }).limit(8)
  ]);

  if (projectsRes.error) throw projectsRes.error;
  if (pendingRes.error) throw pendingRes.error;
  if (overdueRes.error) throw overdueRes.error;
  if (upcomingRes.error) throw upcomingRes.error;
  if (recentAssetsRes.error) throw recentAssetsRes.error;

  return {
    activeProjects: projectsRes.count ?? 0,
    pendingApprovals: pendingRes.count ?? 0,
    overdueTasks: overdueRes.count ?? 0,
    upcomingDeadlines: (upcomingRes.data ?? []) as Task[],
    recentAssets: ((recentAssetsRes.data ?? []) as Array<Asset & { projects?: { name: string } | null }>).map((item) => ({
      ...item,
      project_name: item.projects?.name
    }))
  };
}

export async function getCampaignPillarsByProject(projectId: string) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase.from('campaign_pillars').select('*').eq('project_id', projectId).order('created_at', { ascending: true });

  return { data: (data ?? []) as CampaignPillar[], error };
}

export async function ensureDefaultCampaignPillars(projectId: string) {
  const supabase = getServerSupabase();
  const { data, error } = await getCampaignPillarsByProject(projectId);
  if (error) return { data: [] as CampaignPillar[], error };

  if (data.length === 0) {
    const seed = DEFAULT_CAMPAIGN_PILLARS.map((pillarName) => ({
      project_id: projectId,
      pillar_name: pillarName,
      status: 'not started'
    }));

    const { error: insertError } = await supabase.from('campaign_pillars').insert(seed);
    if (insertError) return { data: [] as CampaignPillar[], error: insertError };
    return getCampaignPillarsByProject(projectId);
  }

  return { data, error: null };
}

export async function getCampaignLifecycleByProject(projectId: string) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase.from('campaign_lifecycle').select('*').eq('project_id', projectId).order('created_at', { ascending: true });

  return { data: (data ?? []) as CampaignLifecycle[], error };
}

export async function ensureDefaultCampaignLifecycle(projectId: string) {
  const supabase = getServerSupabase();
  const { data, error } = await getCampaignLifecycleByProject(projectId);
  if (error) return { data: [] as CampaignLifecycle[], error };

  if (data.length === 0) {
    const seed = DEFAULT_CAMPAIGN_LIFECYCLE_PHASES.map((phaseName) => ({
      project_id: projectId,
      phase_name: phaseName,
      status: 'not started'
    }));

    const { error: insertError } = await supabase.from('campaign_lifecycle').insert(seed);
    if (insertError) return { data: [] as CampaignLifecycle[], error: insertError };
    return getCampaignLifecycleByProject(projectId);
  }

  return { data, error: null };
}

export async function getCampaignMilestonesByProject(projectId: string) {
  const supabase = getServerSupabase();
  const normalizedProjectId = projectId.trim();
  const { data, error } = await supabase
    .from('campaign_milestones')
    .select('*')
    .eq('project_id', normalizedProjectId)
    .order('created_at', { ascending: true });

  return { data: (data ?? []) as CampaignMilestone[], error };
}

export async function ensureDefaultCampaignMilestones(projectId: string) {
  const supabase = getServerSupabase();
  const normalizedProjectId = projectId.trim();
  const { data, error } = await getCampaignMilestonesByProject(normalizedProjectId);
  if (error) return { data: [] as CampaignMilestone[], error };

  if (data.length > 0) return { data, error: null };

  const seed = DEFAULT_CAMPAIGN_MILESTONES.map((milestone) => ({
    project_id: normalizedProjectId,
    milestone_name: milestone.milestone_name,
    phase: milestone.phase,
    notes: milestone.notes,
    status: 'not started'
  }));

  const { error: upsertError } = await supabase.from('campaign_milestones').upsert(seed, {
    onConflict: 'project_id,milestone_name',
    ignoreDuplicates: true
  });
  if (upsertError) return { data: [] as CampaignMilestone[], error: upsertError };

  return getCampaignMilestonesByProject(normalizedProjectId);
}
