export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createProject } from '@/app/actions';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { StatusBadge } from '@/components/StatusBadge';
import { getProjectSummaries } from '@/lib/data';

function formatTimestamp(value: string | null | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export default async function ProjectsPage() {
  const { data, error } = await getProjectSummaries();

  return (
    <div className="grid project-list-shell">
      <section className="section">
        <div className="project-list-header">
          <h2>Your Film Projects</h2>
          <p className="muted">Only projects owned by your account are visible in this MVP phase.</p>
        </div>

        {error ? <ErrorState message={error.message} /> : data.length === 0 ? <EmptyState message="No projects yet." /> : (
          <div className="project-cards-grid">
            {data.map((project) => (
              <article key={project.id} className="card project-list-card">
                <div className="project-list-card-head">
                  <h3><Link href={`/projects/${project.id}`}>{project.name}</Link></h3>
                  <StatusBadge label={project.status} />
                </div>
                <p className="muted">{project.description ?? 'No description provided yet.'}</p>
                <dl className="project-metadata-grid">
                  <div>
                    <dt>Campaign health</dt>
                    <dd>{project.overallCampaignHealth === null ? '—' : `${project.overallCampaignHealth}%`}</dd>
                  </div>
                  <div>
                    <dt>Lifecycle phase</dt>
                    <dd>{project.currentLifecyclePhase ?? '—'}</dd>
                  </div>
                  <div>
                    <dt>Due date</dt>
                    <dd>{project.due_date ?? '—'}</dd>
                  </div>
                  <div>
                    <dt>Last updated</dt>
                    <dd>{formatTimestamp(project.updated_at)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h3>Create Project</h3>
        <form action={createProject} className="form">
          <div className="form-row">
            <input name="name" placeholder="Project name" required />
            <select name="status" defaultValue="active">
              <option value="active">active</option>
              <option value="on hold">on hold</option>
              <option value="completed">completed</option>
            </select>
            <input type="date" name="due_date" />
          </div>
          <textarea name="description" placeholder="Description" rows={3} />
          <button type="submit">Create project</button>
        </form>
      </section>
    </div>
  );
}
