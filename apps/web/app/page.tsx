import { AppShell } from '@/components/app-shell';
import { StatCard } from '@/components/stat-card';
import { quickStats } from '@/lib/navigation';
import Link from 'next/link';
import { ArrowRight, Bot, CalendarClock, FileWarning, ListChecks, ShieldCheck } from 'lucide-react';

const workQueue = [
  { icon: ListChecks, title: 'Service requests need action', value: '14', href: '/service-requests' },
  { icon: FileWarning, title: 'Critical incidents active', value: '3', href: '/incidents' },
  { icon: ShieldCheck, title: 'Compliance evidence pending', value: '5', href: '/compliance' },
  { icon: CalendarClock, title: 'License renewals in 30 days', value: '4', href: '/vendors-licenses' }
];

export default function Page() {
  return (
    <AppShell>
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft ai-gradient">
          <div className="flex items-start justify-between gap-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
                <Bot className="h-3.5 w-3.5" /> AI-first operations portal
              </div>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950">What do you want to check today?</h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">Use the menu to browse modules, or ask the AI command bar to pull tickets, assets, incidents, compliance tasks, access requests, reports, and next actions.</p>
            </div>
            <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-soft">
              <div className="text-xs text-slate-300">Daily Admin Brief</div>
              <div className="mt-2 text-2xl font-bold">64</div>
              <div className="text-xs text-slate-400">items need attention</div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-4 gap-4">
          {quickStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>

        <section className="grid grid-cols-2 gap-5">
          {workQueue.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href} className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><Icon className="h-5 w-5" /></div>
                    <div>
                      <div className="text-2xl font-bold text-slate-950">{item.value}</div>
                      <div className="mt-1 text-sm text-slate-600">{item.title}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:text-indigo-500" />
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
