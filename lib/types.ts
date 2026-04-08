export type ProjectStatus = 'active' | 'on hold' | 'completed';
export type TaskStatus = 'todo' | 'in progress' | 'blocked' | 'done';
export type VersionStatus = 'draft' | 'in review' | 'approved';
export type ApprovalStatus = 'pending review' | 'approved' | 'changes requested';
export type CampaignPillarStatus = 'not started' | 'in progress' | 'blocked' | 'done';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  due_date: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
}

export interface Asset {
  id: string;
  project_id: string;
  title: string;
  asset_type: string;
  external_file_url: string;
  description: string | null;
  created_at: string;
}

export interface AssetVersion {
  id: string;
  asset_id: string;
  version_number: string;
  notes: string | null;
  status: VersionStatus;
  external_file_url: string;
  created_at: string;
}

export interface Approval {
  id: string;
  version_id: string;
  status: ApprovalStatus;
  comment: string;
  reviewer: string | null;
  created_at: string;
}

export interface VersionEntry {
  id: string;
  project_id: string;
  item_name: string;
  version_label: string;
  changelog: string;
  external_asset_url: string;
}

export interface CampaignPillar {
  id: string;
  project_id: string;
  pillar_name: string;
  objective: string | null;
  notes: string | null;
  owner: string | null;
  status: CampaignPillarStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}
