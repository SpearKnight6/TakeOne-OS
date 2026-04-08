export function Section({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}
