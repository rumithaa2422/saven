'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, Filter, Plus, Search } from 'lucide-react';
import { moduleConfigs, type ModuleRecord } from '@/lib/module-config';
import { StatCard } from './stat-card';

export function ModulePage({ moduleKey }: { moduleKey: string }) {
  const config = moduleConfigs[moduleKey];
  const [selected, setSelected] = useState<ModuleRecord | null>(config.records[0] ?? null);

  if (!config) return <div>Module not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">{config.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{config.description}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <FileSpreadsheet className="h-4 w-4" /> Import Excel
          </button>
          <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" /> Export
          </button>
          <button className="flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            <Plus className="h-4 w-4" /> {config.primaryAction}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {config.stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      <div className="grid grid-cols-[1fr_22rem] gap-5">
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <div className="flex w-96 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
              <Search className="h-4 w-4" /> Search {config.title.toLowerCase()}
            </div>
            <button className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <Filter className="h-4 w-4" /> Filters
            </button>
          </div>

          <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_0.8fr] gap-3 border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {config.columns.map((column) => <div key={column}>{column}</div>)}
          </div>

          <div className="divide-y divide-slate-100">
            {config.records.map((record) => (
              <button
                key={record.id}
                onClick={() => setSelected(record)}
                className="grid w-full grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_0.8fr] gap-3 px-5 py-4 text-left text-sm hover:bg-slate-50"
              >
                <div>
                  <div className="font-semibold text-slate-950">{record.title}</div>
                  <div className="mt-1 text-xs text-slate-500">{record.id} · {record.subtitle}</div>
                </div>
                <div><Badge value={record.status} /></div>
                <div className="font-medium text-slate-700">{record.priority ?? '-'}</div>
                <div className="text-slate-600">{record.owner ?? '-'}</div>
                <div className="text-slate-500">{record.updatedAt}</div>
              </button>
            ))}
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          {selected ? (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500">{selected.id}</div>
                <h2 className="mt-1 text-xl font-bold text-slate-950">{selected.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{selected.subtitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Info label="Status" value={selected.status} />
                <Info label="Priority" value={selected.priority ?? '-'} />
                <Info label="Owner" value={selected.owner ?? '-'} />
                <Info label="Updated" value={selected.updatedAt} />
              </div>
              <div className="rounded-2xl bg-indigo-50 p-4">
                <div className="text-sm font-semibold text-indigo-900">AI suggested next action</div>
                <div className="mt-2 text-sm leading-6 text-indigo-800">Review the latest comments, check SLA risk, and send a follow-up if this is waiting for user or vendor.</div>
              </div>
              <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Open Full Details</button>
            </div>
          ) : <div className="text-sm text-slate-500">Select a record</div>}
        </aside>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-950">Suggested AI prompts for this module</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {config.aiPrompts.map((prompt) => (
            <span key={prompt} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs text-slate-600">{prompt}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

function Badge({ value }: { value: string }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{value}</span>;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}
