-- Minimal schema for TakeOne-OS MVP
create extension if not exists pgcrypto;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  status text not null default 'active',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo',
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  asset_type text not null,
  external_file_url text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists asset_versions (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references assets(id) on delete cascade,
  version_number text not null,
  notes text,
  status text not null default 'draft',
  external_file_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references asset_versions(id) on delete cascade,
  status text not null,
  reviewer text,
  comment text not null,
  created_at timestamptz not null default now()
);
