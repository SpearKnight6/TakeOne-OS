import Link from 'next/link';
import { Section } from '@/components/section';
import { SummaryCard } from '@/components/summary-card';
import { mockApprovals, mockProjects, mockTasks, mockVersions } from '@/lib/mock-data';

export default function Home() {
  const pendingApprovals = mockApprovals.filter((item) => item.status === 'pending').length;

  return (
    <main>
      <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-accent">TakeOne OS · Free-tier MVP</p>
          <h1 className="text-3xl font-bold">Production approvals + version tracking</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/projects" className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium">
            Open CRUD workspace
          </Link>
          <Link
            href="https://supabase.com/dashboard/project/_/sql/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-slate-950"
          >
            Run SQL schema in Supabase
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Projects" value={mockProjects.length} helper="Keep active projects visible by status and due date." />
        <SummaryCard label="Tasks" value={mockTasks.length} helper="Prioritize lightweight task tracking over media-heavy features." />
        <SummaryCard label="Pending approvals" value={pendingApprovals} helper="Fast review flow with clear approvers + approval state." />
        <SummaryCard label="Version entries" value={mockVersions.length} helper="Track each edit as metadata + external asset link." />
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <Section title="Approvals" description="Approval queue with external links (no heavy video uploads in MVP).">
          <ul className="space-y-3">
            {mockApprovals.map((approval) => (
              <li key={approval.id} className="rounded-lg border border-slate-800 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{approval.item_title}</p>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs">{approval.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </section>
    </main>
  );
}
