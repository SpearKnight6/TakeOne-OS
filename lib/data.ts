import { getSupabase } from './supabase';
import { Asset, AssetVersion, DbApproval, DbProject, DbTask } from './types';

export interface DashboardData {
  activeProjects: number;
  pendingApprovals: number;
  overdueTasks: number;
  upcomingDeadlines: DbTask[];
  recentAssets: Array<Asset & { project_name?: string }>;
}

export async function getProjects() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  return { data: (data ?? []) as DbProject[], error };
}

export async function getProjectById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
  return { data: (data ?? null) as DbProject | null, error };
}

export async function getTasksByProject(projectId: string, status?: string) {
  const supabase = getSupabase();
  let query = supabase.from('tasks').select('*').eq('project_id', projectId).order('due_date', { ascending: true, nullsFirst: false });
  if (status && status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  return { data: (data ?? []) as DbTask[], error };
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
  return { data: (data ?? []) as DbApproval[], error };
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
    upcomingDeadlines: (upcomingRes.data ?? []) as DbTask[],
    recentAssets: ((recentAssetsRes.data ?? []) as Array<Asset & { projects?: { name: string } | null }>).map((item) => ({
      ...item,
      project_name: item.projects?.name
    }))
  };
}
