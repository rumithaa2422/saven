'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import { navigationItems } from '@/lib/navigation';
import { CollapsibleAIPanel, AICommandPanel } from './ai-command-panel';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 w-72 border-r border-slate-200 bg-white/95 p-4 shadow-soft">
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-slate-950 p-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">Saven InfraOps</div>
            <div className="text-xs text-slate-300">Command Center</div>
          </div>
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                  active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="pl-72 pr-[28rem]">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur">
          <div className="flex w-[32rem] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            Search tickets, assets, incidents, access, compliance
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">SA</div>
              <div>
                <div className="text-xs font-semibold text-slate-900">Saven Admin</div>
                <div className="text-[11px] text-slate-500">Super Admin</div>
              </div>
            </div>
          </div>
        </header>
        <div className="p-8 pb-32">{children}</div>
      </main>

      {/* Collapsible AI Panel - Right side hover-triggered drawer */}
      <CollapsibleAIPanel />

      {/* Bottom AI Command Bar - Unchanged */}
      <div className="fixed bottom-0 left-72 right-[28rem] z-30 border-t border-slate-200 bg-white/95 px-8 py-4 backdrop-blur">
        <AICommandPanel bottomBar />
      </div>
    </div>
  );
}
