export type Project = {
  id: string;
  name: string;
  status: 'active' | 'on_hold' | 'done';
  due_date: string;
  owner: string;
};

export type Task = {
  id: string;
  project_id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  assignee: string;
  due_date: string;
};

export type Approval = {
  id: string;
  project_id: string;
  item_title: string;
  requested_by: string;
  approver: string;
  status: 'pending' | 'approved' | 'changes_requested';
  external_asset_url: string | null;
};

export type VersionEntry = {
  id: string;
  project_id: string;
  item_name: string;
  version_label: string;
  changelog: string;
  external_asset_url: string;
};

// Supabase CRUD domain types
export type DbProjectStatus = 'active' | 'on hold' | 'completed';
export type DbTaskStatus = 'todo' | 'in progress' | 'blocked' | 'done';
export type DbVersionStatus = 'draft' | 'in review' | 'approved';
export type DbApprovalStatus = 'pending review' | 'approved' | 'changes requested';

export interface DbProject {
  id: string;
  name: string;
  description: string | null;
  status: DbProjectStatus;
  due_date: string | null;
  created_at: string;
}

export interface DbTask {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: DbTaskStatus;
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
  status: DbVersionStatus;
  external_file_url: string;
  created_at: string;
}

export interface DbApproval {
  id: string;
  version_id: string;
  status: DbApprovalStatus;
  comment: string;
  reviewer: string | null;
  created_at: string;
}
