# TakeOne OS MVP (Free-Tier Friendly)

A lightweight project operations MVP built for:
- **Next.js + Tailwind CSS**
- **Supabase Free Plan** (Auth + Postgres + small files)
- **Vercel Hobby** deployment
- **GitHub Free** source control

This MVP intentionally focuses on:
- project visibility
- task ownership + due dates
- approval workflows
- version tracking with changelogs

It intentionally avoids media-heavy architecture:
- store **large video assets as external links** (Google Drive / Dropbox)
- keep Supabase storage for tiny files only (thumbnails/docs if needed)

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
2. In SQL Editor, run `supabase/schema.sql`.
3. Enable email auth in Supabase Auth.

## 3) Free-tier architecture rules

- Keep metadata rows small.
- Avoid uploading raw video files to Supabase storage.
- Save only `external_asset_url` for videos.
- Use indexes only on high-value query paths.
- Keep background jobs off by default.

## 4) Deploy on Vercel Hobby

1. Push to GitHub Free.
2. Import repo in Vercel.
3. Add environment variables.
4. Deploy.

## 5) What the dashboard includes

- Project status panel
- Task table with assignee and due date
- Approval queue + status
- Version history with external links
