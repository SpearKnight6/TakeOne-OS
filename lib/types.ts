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
