import type { Approval, Project, Task, VersionEntry } from './types';

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Spring Product Spot',
    status: 'active',
    due_date: '2026-04-21',
    owner: 'Maya'
  },
  {
    id: 'p2',
    name: 'Social Cutdown Batch',
    status: 'on_hold',
    due_date: '2026-04-30',
    owner: 'Jordan'
  }
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    project_id: 'p1',
    title: 'Lock script changes',
    status: 'doing',
    assignee: 'Ari',
    due_date: '2026-04-10'
  },
  {
    id: 't2',
    project_id: 'p1',
    title: 'Upload V2 cut link',
    status: 'todo',
    assignee: 'Noah',
    due_date: '2026-04-11'
  },
  {
    id: 't3',
    project_id: 'p2',
    title: 'Collect client notes',
    status: 'todo',
    assignee: 'Maya',
    due_date: '2026-04-12'
  }
];

export const mockApprovals: Approval[] = [
  {
    id: 'a1',
    project_id: 'p1',
    item_title: 'Hero edit V2',
    requested_by: 'Noah',
    approver: 'Client Team',
    status: 'pending',
    external_asset_url: 'https://drive.google.com/file/d/123'
  },
  {
    id: 'a2',
    project_id: 'p2',
    item_title: 'Instagram 15s v1',
    requested_by: 'Jordan',
    approver: 'Internal Brand',
    status: 'changes_requested',
    external_asset_url: 'https://www.dropbox.com/s/example'
  }
];

export const mockVersions: VersionEntry[] = [
  {
    id: 'v1',
    project_id: 'p1',
    item_name: 'Hero edit',
    version_label: 'v2',
    changelog: 'Adjusted end card timing and color pass.',
    external_asset_url: 'https://drive.google.com/file/d/123'
  },
  {
    id: 'v2',
    project_id: 'p2',
    item_name: 'IG 15s',
    version_label: 'v1',
    changelog: 'Initial rough cut for review.',
    external_asset_url: 'https://www.dropbox.com/s/example'
  }
];
