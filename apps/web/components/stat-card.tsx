export function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${tone}`}>{label}</div>
      <div className="text-3xl font-bold tracking-tight text-slate-950">{value}</div>
    </div>
  );
}
