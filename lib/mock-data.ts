import type { Approval, Project, Task, VersionEntry } from './types';

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'TakeOne OS Launch',
    description: 'Internal rollout for production workflow.',
    status: 'active',
    due_date: '2026-04-21',
    created_at: '2026-04-01T00:00:00Z'
  },
  {
    id: 'p2',
    name: 'Teaser Cut Review',
    description: 'Track teaser versions and approvals.',
    status: 'completed',
    due_date: '2026-04-10',
    created_at: '2026-04-02T00:00:00Z'
  }
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    project_id: 'p1',
    title: 'Finalize poster copy',
    description: 'Lock final poster text for review.',
    status: 'todo',
    due_date: '2026-04-18',
    created_at: '2026-04-03T00:00:00Z'
  },
  {
    id: 't2',
    project_id: 'p1',
    title: 'Collect teaser feedback',
    description: 'Gather comments from director and producer.',
    status: 'in progress',
    due_date: '2026-04-16',
    created_at: '2026-04-03T00:00:00Z'
  }
];

export const mockApprovals: Approval[] = [
  {
    id: 'a1',
    version_id: 'v1',
    status: 'pending review',
    comment: 'Waiting for final producer sign-off.',
    reviewer: 'Producer',
    created_at: '2026-04-05T00:00:00Z'
  },
  {
    id: 'a2',
    version_id: 'v2',
    status: 'approved',
    comment: 'Approved for release.',
    reviewer: 'Director',
    created_at: '2026-04-06T00:00:00Z'
  }
];

export const mockVersions: VersionEntry[] = [
  {
    id: 'v1',
    project_id: 'p1',
    item_name: 'Poster',
    version_label: 'v1',
    changelog: 'Initial poster draft.',
    external_asset_url: 'https://example.com/poster-v1'
  },
  {
    id: 'v2',
    project_id: 'p1',
    item_name: 'Teaser',
    version_label: 'v2',
    changelog: 'Updated cut with sound design.',
    external_asset_url: 'https://example.com/teaser-v2'
  }
];
