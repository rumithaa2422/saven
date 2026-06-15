'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, Loader2, SendHorizontal } from 'lucide-react';
import { runAICommand } from '@/lib/api';
import type { AICommandResponse } from '@saven/infraops-shared';

const starterPrompts = [
  'How many service requests are open?',
  'Show critical incidents today',
  'Which laptops are available?',
  'Show overdue compliance items'
];

export function AICommandPanel({ compact, bottomBar }: { compact?: boolean; bottomBar?: boolean }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<(AICommandResponse & { provider?: string }) | null>(null);

  async function submit(value = prompt) {
    if (!value.trim()) return;
    setLoading(true);
    setPrompt('');
    try {
      setResult(await runAICommand(value.trim()));
    } finally {
      setLoading(false);
    }
  }

  if (bottomBar) {
    return (
      <form
        className="flex items-center gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
          <Bot className="h-5 w-5" />
        </div>
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder='Ask InfraOps, for example: "Show open high priority tickets for Federal"'
          className="h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-300 focus:bg-white"
        />
        <button className="flex h-12 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800" type="submit">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
          Ask
        </button>
      </form>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="space-y-3 overflow-y-auto p-5">
        <div className="rounded-3xl ai-gradient p-4 shadow-soft">
          <div className="text-sm font-semibold text-slate-950">Ask in plain English</div>
          <div className="mt-1 text-xs leading-5 text-slate-600">Pull records, counts, summaries, reports, and next actions from any module.</div>
        </div>

        <div className="grid gap-2">
          {starterPrompts.map((item) => (
            <button key={item} onClick={() => void submit(item)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-700 hover:border-indigo-200 hover:bg-indigo-50">
              {item}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" /> Reading operational data
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-950">AI Answer</div>
                {result.provider && <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase text-slate-500">{result.provider}</span>}
              </div>
              <p className="text-sm leading-6 text-slate-700">{result.answer}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(result.summary).map(([key, value]) => (
                <div key={key} className="rounded-2xl bg-slate-50 p-3">
                  <div className="text-lg font-bold text-slate-950">{value}</div>
                  <div className="text-[11px] capitalize text-slate-500">{key.replace(/([A-Z])/g, ' $1')}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {result.cards.map((card) => (
                <Link key={card.id} href={card.href} className="block rounded-2xl border border-slate-200 bg-white p-3 hover:border-indigo-200 hover:bg-indigo-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">{card.id}</div>
                      <div className="mt-1 text-sm font-semibold text-slate-950">{card.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{card.subtitle}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
