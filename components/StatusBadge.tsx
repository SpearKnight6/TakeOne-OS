export function StatusBadge({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  let tone = 'yellow';
  if (['approved', 'done', 'active', 'completed'].includes(normalized)) tone = 'green';
  if (['blocked', 'overdue', 'changes requested'].includes(normalized)) tone = 'red';

  return <span className={`badge ${tone}`}>{label}</span>;
}
