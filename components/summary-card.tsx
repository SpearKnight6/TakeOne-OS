export function SummaryCard({
  label,
  value,
  helper
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{helper}</p>
    </div>
  );
}
