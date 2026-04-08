# TakeOne-OS MVP

A practical, free-tier-friendly internal production tracker built with Next.js + Supabase.

## What is implemented
- Live Supabase-backed dashboard metrics (active projects, pending approvals, overdue tasks, upcoming deadlines, recent assets).
- Projects CRUD essentials:
  - list projects
  - create project
  - project detail
  - edit project
- Tasks within project:
  - add task
  - update task status
  - overdue highlighting
  - filter by status
- Assets within project:
  - add asset (title, type, external URL, description)
  - list assets per project
- Versions under each asset:
  - add version (number, notes, status, external URL)
  - latest version highlighting
  - latest approved version highlighting
- Approvals/comments per version:
  - add approval/comment entries
  - statuses: pending review, approved, changes requested
  - chronological approval history

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env.local
   ```
3. Set values in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Run SQL in your Supabase project:
   - `db/schema.sql`
5. Start the app:
   ```bash
   npm run dev
   ```

## Environment file
Create `.env.example` if missing:
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Architecture notes
- Uses external URLs for media/files (no direct upload pipeline) to keep infra simple and free-tier friendly.
- Uses server-rendered data fetching and server actions for CRUD.
- Keeps UI intentionally minimal and practical.

## Assumptions
- Supabase tables match `db/schema.sql`.
- For MVP/testing, RLS is configured to allow required reads/writes or equivalent policies are added.
- Approval entries are represented in the `approvals` table and include comments.
