export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { StatusBadge } from '@/components/StatusBadge';
import { getDashboardData } from '@/lib/data';

export default async function DashboardPage() {
  try {
    const data = await getDashboardData();

    return (
      <div className="crud-grid">
        <section className="section">
          <h2>Dashboard</h2>
          <div className="crud-grid cards">
            <article className="card"><strong>{data.activeProjects}</strong><div>Active projects</div></article>
            <article className="card"><strong>{data.pendingApprovals}</strong><div>Pending approvals</div></article>
            <article className="card"><strong>{data.overdueTasks}</strong><div>Overdue tasks</div></article>
            <article className="card"><strong>{data.upcomingDeadlines.length}</strong><div>Upcoming deadlines</div></article>
          </div>
        </section>

        <section className="section split">
          <article className="card">
            <h3>Upcoming deadlines</h3>
            {data.upcomingDeadlines.length === 0 ? <EmptyState message="No upcoming task deadlines in the next 7 days." /> : (
              <ul>
                {data.upcomingDeadlines.map((task) => (
                  <li key={task.id}>
                    <StatusBadge label={task.status} /> {task.title} ({task.due_date})
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="card">
            <h3>Recent assets</h3>
            {data.recentAssets.length === 0 ? <EmptyState message="No assets added yet." /> : (
              <ul>
                {data.recentAssets.map((asset) => (
                  <li key={asset.id}>
                    <Link href={`/projects/${asset.project_id}`}>{asset.title}</Link> <span className="muted">({asset.project_name ?? 'Unknown project'})</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      </div>
    );
  } catch (error) {
    return <ErrorState message={`Unable to load dashboard data. ${(error as Error).message}`} />;
  }
}
