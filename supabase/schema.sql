-- Lightweight schema for Supabase Free Plan
-- Focus: auth + metadata, not large binary storage.

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null check (status in ('active', 'on_hold', 'done')),
  owner_id uuid not null references profiles(id),
  due_date date,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  status text not null check (status in ('todo', 'doing', 'done')) default 'todo',
  assignee_id uuid references profiles(id),
  due_date date,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  item_title text not null,
  status text not null check (status in ('pending', 'approved', 'changes_requested')) default 'pending',
  requested_by uuid not null references profiles(id),
  approver_id uuid references profiles(id),
  external_asset_url text,
  notes text,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create table if not exists version_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  item_name text not null,
  version_label text not null,
  changelog text,
  external_asset_url text not null,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists campaign_pillars (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  pillar_name text not null,
  objective text,
  notes text,
  owner text,
  status text not null default 'not started',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists campaign_lifecycle (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  phase_name text not null,
  objective text,
  social_strategy text,
  traction_goal text,
  key_assets text,
  kpi text,
  status text not null default 'not started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep indexes small and practical for free-tier resources.
create index if not exists idx_tasks_project on tasks(project_id);
create index if not exists idx_approvals_project on approvals(project_id);
create index if not exists idx_versions_project on version_entries(project_id);
create index if not exists idx_campaign_pillars_project on campaign_pillars(project_id);
create index if not exists idx_campaign_lifecycle_project on campaign_lifecycle(project_id);

alter table profiles enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table approvals enable row level security;
alter table version_entries enable row level security;
alter table campaign_pillars enable row level security;
alter table campaign_lifecycle enable row level security;

-- Team-level access can be tightened later. MVP keeps simple "authenticated users can read/write" policies.
create policy "profiles self read/write" on profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "projects auth all" on projects
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "tasks auth all" on tasks
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "approvals auth all" on approvals
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "versions auth all" on version_entries
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "campaign pillars auth all" on campaign_pillars
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "campaign lifecycle auth all" on campaign_lifecycle
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
