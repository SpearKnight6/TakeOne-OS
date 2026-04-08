export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createProject } from '@/app/actions';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { StatusBadge } from '@/components/StatusBadge';
import { getProjects } from '@/lib/data';

export default async function ProjectsPage() {
  const { data, error } = await getProjects();

  return (
    <div className="grid">
      <section className="section">
        <h2>Projects</h2>
        {error ? <ErrorState message={error.message} /> : data.length === 0 ? <EmptyState message="No projects yet." /> : (
          <table className="table">
            <thead><tr><th>Name</th><th>Status</th><th>Due date</th></tr></thead>
            <tbody>
              {data.map((project) => (
                <tr key={project.id}>
                  <td><Link href={`/projects/${project.id}`}>{project.name}</Link></td>
                  <td><StatusBadge label={project.status} /></td>
                  <td>{project.due_date ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="section">
        <h3>Create project</h3>
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
