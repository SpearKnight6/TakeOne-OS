# TakeOne OS MVP (Free-Tier Friendly)

A lightweight project operations MVP built with Next.js, Tailwind CSS, and Supabase.

This MVP intentionally focuses on:
- project visibility
- task ownership + due dates
- approval workflows
- version tracking with changelogs

It intentionally avoids media-heavy architecture:
- store **large video assets as external links** (Google Drive / Dropbox)
- keep Supabase storage for tiny files only

## What is implemented
- Live Supabase-backed dashboard metrics:
  - active projects
  - pending approvals
  - overdue tasks
  - upcoming deadlines
  - recent assets

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

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev