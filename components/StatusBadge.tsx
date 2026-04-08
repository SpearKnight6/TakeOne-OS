export function StatusBadge({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  const key = normalized.split(':')[0].trim();
  let tone = 'yellow';
  if (['approved', 'done', 'active', 'completed'].includes(key)) tone = 'green';
  if (['blocked', 'overdue', 'changes requested'].includes(key)) tone = 'red';
  if (['in progress', 'in review'].includes(key)) tone = 'blue';
  if (['not started', 'todo', 'pending review'].includes(key)) tone = 'gray';

  return <span className={`badge ${tone}`}>{label}</span>;
}
