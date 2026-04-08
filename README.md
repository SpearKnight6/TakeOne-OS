# TakeOne OS MVP (Free-Tier Friendly)

A lightweight project operations MVP built for Next.js + Supabase + Vercel Hobby.

## Included in this branch
- Preserved scaffold dashboard and free-tier architecture from PR #1.
- Added Supabase-backed CRUD flows for projects, tasks, assets, asset versions, and approvals/comments.
- Added dashboard data queries + server actions for mutations.
- Added project list/detail CRUD pages and status filtering.
- Added SQL schema for relational CRUD model at `db/schema.sql`.

## 1) Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 2) Supabase setup (free plan)

1. Create a Supabase project.
2. In SQL Editor, run `db/schema.sql`.
3. Enable email auth in Supabase Auth.

## 3) Free-tier architecture rules

- Keep metadata rows small.
- Avoid uploading raw video files to Supabase storage.
- Save only external links for videos.
- Keep infra lightweight for free-tier limits.
