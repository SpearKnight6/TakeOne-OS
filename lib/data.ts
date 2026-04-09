import { getSupabase } from './supabase';
import { Approval, Asset, AssetVersion, CampaignLifecycle, CampaignMilestone, CampaignPillar, Project, Task } from './types';

const DEFAULT_CAMPAIGN_PILLARS = [
  'First Signal',
  'Audience Lock',
  'Build-Up Engine',
  'Hype Flow',
  'Ground Pulse'
] as const;

const DEFAULT_CAMPAIGN_LIFECYCLE_PHASES = [
  'Pre-Production',
  'Production',
  'Post-Production',
  'Launch',
  'Post-Launch'
] as const;

const DEFAULT_CAMPAIGN_MILESTONES = [
  { milestone_name: 'First Look', phase: 'Pre-Production' },
  { milestone_name: 'Title Reveal', phase: 'Pre-Production' },
  { milestone_name: 'Character Intro', phase: 'Production' },
  { milestone_name: 'First Song', phase: 'Production' },
  { milestone_name: 'Teaser', phase: 'Post-Production' },
  { milestone_name: 'Trailer', phase: 'Launch' },
  { milestone_name: 'Release Week', phase: 'Launch' },
  { milestone_name: 'OTT Window', phase: 'Post-Launch' }
] as const;

export interface DashboardData {
  activeProjects: number;
  pendingApprovals: number;
  overdueTasks: number;
  upcomingDeadlines: Task[];
  recentAssets: Array<Asset & { project_name?: string }>;
}

export async function getProjects() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  return { data: (data ?? []) as Project[], error };
}

export async function getProjectById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
  return { data: (data ?? null) as Project | null, error };
}

export async function getTasksByProject(projectId: string, status?: string) {
  const supabase = getSupabase();
  let query = supabase.from('tasks').select('*').eq('project_id', projectId).order('due_date', { ascending: true, nullsFirst: false });
  if (status && status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  return { data: (data ?? []) as Task[], error };
}

export async function getAssetsByProject(projectId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('assets').select('*').eq('project_id', projectId).order('created_at', { ascending: false });
  return { data: (data ?? []) as Asset[], error };
}

export async function getVersionsByAsset(assetId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('asset_versions').select('*').eq('asset_id', assetId).order('created_at', { ascending: false });
  return { data: (data ?? []) as AssetVersion[], error };
}

export async function getApprovalsByVersion(versionId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('approvals').select('*').eq('version_id', versionId).order('created_at', { ascending: true });
  return { data: (data ?? []) as Approval[], error };
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = getSupabase();
  const today = new Date().toISOString().slice(0, 10);
  const in7 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [projectsRes, pendingRes, overdueRes, upcomingRes, recentAssetsRes] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('approvals').select('id', { count: 'exact', head: true }).eq('status', 'pending review'),
    supabase.from('tasks').select('id', { count: 'exact', head: true }).lt('due_date', today).neq('status', 'done'),
    supabase.from('tasks').select('*').gte('due_date', today).lte('due_date', in7).neq('status', 'done').order('due_date', { ascending: true }).limit(10),
    supabase.from('assets').select('*, projects(name)').order('created_at', { ascending: false }).limit(8)
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
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('campaign_pillars')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  return { data: (data ?? []) as CampaignPillar[], error };
}

export async function ensureDefaultCampaignPillars(projectId: string) {
  const supabase = getSupabase();
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
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('campaign_lifecycle')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  return { data: (data ?? []) as CampaignLifecycle[], error };
}

export async function ensureDefaultCampaignLifecycle(projectId: string) {
  const supabase = getSupabase();
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
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('campaign_milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  return { data: (data ?? []) as CampaignMilestone[], error };
}

export async function ensureDefaultCampaignMilestones(projectId: string) {
  const supabase = getSupabase();
  const { count, error } = await supabase
    .from('campaign_milestones')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId);
  if (error) return { data: [] as CampaignMilestone[], error };

  if ((count ?? 0) === 0) {
    const seed = DEFAULT_CAMPAIGN_MILESTONES.map((milestone) => ({
      project_id: projectId,
      milestone_name: milestone.milestone_name,
      phase: milestone.phase,
      status: 'not started'
    }));

    const { error: insertError } = await supabase
      .from('campaign_milestones')
      .upsert(seed, { onConflict: 'project_id,milestone_name', ignoreDuplicates: true });
    if (insertError) return { data: [] as CampaignMilestone[], error: insertError };
    return getCampaignMilestonesByProject(projectId);
  }

  return getCampaignMilestonesByProject(projectId);
}
