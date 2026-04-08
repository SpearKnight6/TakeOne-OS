import Link from 'next/link';
import { Section } from '@/components/section';
import { SummaryCard } from '@/components/summary-card';
import { mockApprovals, mockProjects, mockTasks, mockVersions } from '@/lib/mock-data';

export default function Home() {
  const pendingApprovals = mockApprovals.filter((item) => item.status === 'pending').length;

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-accent">TakeOne OS · Free-tier MVP</p>
          <h1 className="text-3xl font-bold">Production approvals + version tracking</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Built for Supabase Free + Vercel Hobby. Store lightweight metadata in Supabase and keep
            large video binaries in external links (Google Drive/Dropbox).
          </p>
        </div>
        <Link
          href="https://supabase.com/dashboard/project/_/sql/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-slate-950"
        >
          Run SQL schema in Supabase
        </Link>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          label="Projects"
          value={mockProjects.length}
          helper="Keep active projects visible by status and due date."
        />
        <SummaryCard
          label="Tasks"
          value={mockTasks.length}
          helper="Prioritize lightweight task tracking over media-heavy features."
        />
        <SummaryCard
          label="Pending approvals"
          value={pendingApprovals}
          helper="Fast review flow with clear approvers + approval state."
        />
        <SummaryCard
          label="Version entries"
          value={mockVersions.length}
          helper="Track each edit as metadata + external asset link."
        />
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <Section
          title="Approvals"
          description="Approval queue with external links (no heavy video uploads in MVP)."
        >
          <ul className="space-y-3">
            {mockApprovals.map((approval) => (
              <li key={approval.id} className="rounded-lg border border-slate-800 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{approval.item_title}</p>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs">{approval.status}</span>
                </div>
                <p className="mt-1 text-slate-400">
                  Requested by {approval.requested_by} · Approver: {approval.approver}
                </p>
                {approval.external_asset_url && (
                  <a href={approval.external_asset_url} className="mt-2 inline-block text-accent underline">
                    Open external asset
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Version tracking"
          description="Simple changelog-first version history for every deliverable."
        >
          <ul className="space-y-3">
            {mockVersions.map((version) => (
              <li key={version.id} className="rounded-lg border border-slate-800 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{version.item_name}</p>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs">{version.version_label}</span>
                </div>
                <p className="mt-1 text-slate-400">{version.changelog}</p>
                <a href={version.external_asset_url} className="mt-2 inline-block text-accent underline">
                  Open linked file
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Tasks"
          description="Task ownership and due dates for day-to-day production execution."
        >
          <div className="overflow-hidden rounded-lg border border-slate-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  <th className="px-3 py-2">Task</th>
                  <th className="px-3 py-2">Assignee</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Due</th>
                </tr>
              </thead>
              <tbody>
                {mockTasks.map((task) => (
                  <tr key={task.id} className="border-t border-slate-800">
                    <td className="px-3 py-2">{task.title}</td>
                    <td className="px-3 py-2 text-slate-300">{task.assignee}</td>
                    <td className="px-3 py-2">{task.status}</td>
                    <td className="px-3 py-2 text-slate-400">{task.due_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          title="Project visibility"
          description="One-pane summary to reduce status ping-pong and missed deadlines."
        >
          <ul className="space-y-3">
            {mockProjects.map((project) => (
              <li key={project.id} className="rounded-lg border border-slate-800 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{project.name}</p>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs">{project.status}</span>
                </div>
                <p className="mt-1 text-slate-400">
                  Owner: {project.owner} · Due: {project.due_date}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      </section>
    </main>
  );
}
