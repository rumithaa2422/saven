'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, ChevronRight, Loader2, SendHorizontal } from 'lucide-react';
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

// Collapsible AI Panel - Hover-triggered drawer
export function CollapsibleAIPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isToggled, setIsToggled] = useState(false); // For mobile click toggle
  const panelRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for mobile viewports
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle mouse enter with delay
  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsExpanded(true);
  }, [isMobile]);

  // Handle mouse leave with delay
  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 150); // Small delay to prevent accidental collapse
  }, [isMobile]);

  // Handle mobile toggle
  const handleMobileToggle = useCallback(() => {
    setIsToggled((prev) => !prev);
    setIsExpanded((prev) => !prev);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const panelWidth = 'w-[28rem]';
  const collapsedWidth = 'w-0';

  return (
    <>
      {/* Fixed Tab - Always visible on the right side */}
      <div
        className={`fixed right-0 top-0 z-40 flex h-full flex-col transition-all duration-300 ease-in-out ${
          isExpanded ? 'translate-x-0' : 'translate-x-0'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={panelRef}
      >
        {/* Collapsed Tab Indicator */}
        <div
          className={`flex flex-col items-center justify-center border-l border-slate-200 bg-white py-4 shadow-soft transition-all duration-300 ${
            isExpanded ? 'w-0 overflow-hidden border-l-0 p-0 opacity-0' : 'w-12 border-l bg-white/95'
          }`}
        >
          {/* Tab visible when collapsed */}
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-l-2xl rounded-r-lg bg-indigo-600 text-white shadow-md transition-transform hover:scale-105" onClick={isMobile ? handleMobileToggle : undefined}>
              <Bot className="h-6 w-6" />
            </div>
            <div className="writing-mode-vertical flex flex-col items-center gap-1">
              <span className="text-[10px] font-semibold text-slate-700 [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                InfraOps
              </span>
              <span className="text-[10px] font-semibold text-slate-700 [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                AI
              </span>
              <span className="text-[10px] font-semibold text-slate-700 [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                Assistant
              </span>
            </div>
          </div>
        </div>

        {/* Expanded Panel Content */}
        <div
          className={`h-full overflow-hidden border-l border-slate-200 bg-white transition-all duration-300 ease-in-out ${
            isExpanded ? panelWidth : collapsedWidth
          }`}
        >
          {/* Header */}
          <div className="flex h-16 flex-shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-950">InfraOps AI Assistant</div>
                <div className="text-xs text-slate-500">Always available on every screen</div>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={handleMobileToggle}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Panel Content - Scrollable */}
          <div className="h-[calc(100%-4rem)] overflow-y-auto">
            <AICommandPanelContent />
          </div>
        </div>
      </div>
    </>
  );
}

// AI Command Panel Content (reuses the logic from original panel)
function AICommandPanelContent() {
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

  return (
    <div className="flex flex-col p-5">
      <div className="mb-4 space-y-3">
        <div className="rounded-3xl ai-gradient p-4 shadow-soft">
          <div className="text-sm font-semibold text-slate-950">Ask in plain English</div>
          <div className="mt-1 text-xs leading-5 text-slate-600">Pull records, counts, summaries, reports, and next actions from any module.</div>
        </div>

        <div className="grid gap-2">
          {starterPrompts.map((item) => (
            <button
              key={item}
              onClick={() => void submit(item)}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-700 hover:border-indigo-200 hover:bg-indigo-50"
            >
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
                {result.provider && (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase text-slate-500">
                    {result.provider}
                  </span>
                )}
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
                <Link
                  key={card.id}
                  href={card.href}
                  className="block rounded-2xl border border-slate-200 bg-white p-3 hover:border-indigo-200 hover:bg-indigo-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">{card.id}</div>
                      <div className="mt-1 text-sm font-semibold text-slate-950">{card.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{card.subtitle}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-slate-400" />
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
