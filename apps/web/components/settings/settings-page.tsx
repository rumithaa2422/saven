'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Database, Lock, Mail, RefreshCcw, Save, Settings2, Shield, Upload, Wand2 } from 'lucide-react';
import { getSystemSettings, updateSystemSetting, type SystemSettingDto } from '@/lib/api';

const groups = [
  { key: 'database', label: 'Database', icon: Database },
  { key: 'auth', label: 'Login', icon: Lock },
  { key: 'ai', label: 'AI Providers', icon: Wand2 },
  { key: 'notifications', label: 'Notifications', icon: Mail },
  { key: 'imports', label: 'Excel Import', icon: Upload },
  { key: 'sla', label: 'SLA', icon: Settings2 },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'ui', label: 'UI', icon: Settings2 }
];

export function SettingsPage() {
  const [activeGroup, setActiveGroup] = useState('database');
  const [settings, setSettings] = useState<SystemSettingDto[]>([]);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function load(group = activeGroup) {
    setSettings(await getSystemSettings(group));
  }

  useEffect(() => {
    void load(activeGroup);
  }, [activeGroup]);

  const activeMeta = useMemo(() => groups.find((item) => item.key === activeGroup) ?? groups[0], [activeGroup]);
  const ActiveIcon = activeMeta.icon;

  async function save(setting: SystemSettingDto, value: SystemSettingDto['value']) {
    setSavingKey(setting.key);
    setMessage('');
    try {
      await updateSystemSetting(setting.key, value);
      setSettings((current) => current.map((item) => item.key === setting.key ? { ...item, value, source: 'database' } : item));
      setMessage('Configuration saved. Some runtime settings need API restart to take effect.');
    } catch {
      setSettings((current) => current.map((item) => item.key === setting.key ? { ...item, value } : item));
      setMessage('Saved in screen state. Start API and login to persist this setting.');
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Configuration Center</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Manage runtime choices for database setup notes, login, AI provider, notifications, Excel import, SLA, security, and UI behavior.
          </p>
        </div>
        <button onClick={() => void load()} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Database connection cannot be fully changed from UI while the API is already running. The API reads <b>DATABASE_URL</b> during startup. Use this screen to document the selected mode, then update <b>.env.local</b> and restart the API when switching between Docker MySQL, Windows MySQL, or remote MySQL.
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4" /> {message}
        </div>
      )}

      <div className="grid grid-cols-[17rem_1fr] gap-5">
        <aside className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
          {groups.map((group) => {
            const Icon = group.icon;
            const active = group.key === activeGroup;
            return (
              <button
                key={group.key}
                onClick={() => setActiveGroup(group.key)}
                className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm ${active ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Icon className="h-4 w-4" /> {group.label}
              </button>
            );
          })}
        </aside>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">{activeMeta.label}</h2>
              <p className="text-sm text-slate-500">{settings.length} configurable items</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {settings.map((setting) => (
              <SettingRow key={setting.key} setting={setting} saving={savingKey === setting.key} onSave={save} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SettingRow({ setting, saving, onSave }: { setting: SystemSettingDto; saving: boolean; onSave: (setting: SystemSettingDto, value: SystemSettingDto['value']) => Promise<void> }) {
  const [value, setValue] = useState(setting.value);

  useEffect(() => setValue(setting.value), [setting.value]);

  const editable = setting.isEditable !== false;
  const valueString = Array.isArray(value) ? value.join(', ') : typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '');

  return (
    <div className="grid grid-cols-[1fr_22rem_7rem] items-center gap-4 p-5">
      <div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-slate-950">{setting.label}</div>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase text-slate-500">{setting.source}</span>
        </div>
        <div className="mt-1 text-xs font-mono text-slate-400">{setting.key}</div>
        <p className="mt-2 text-sm leading-6 text-slate-600">{setting.description}</p>
      </div>

      {typeof value === 'boolean' ? (
        <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
          <input type="checkbox" checked={Boolean(value)} disabled={!editable} onChange={(event) => setValue(event.target.checked)} className="h-4 w-4" />
          {value ? 'Enabled' : 'Disabled'}
        </label>
      ) : setting.key === 'database.mode' || setting.key === 'ai.activeProvider' ? (
        <select value={String(value)} disabled={!editable} onChange={(event) => setValue(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-300">
          {(setting.key === 'database.mode' ? ['local-mysql', 'docker-mysql', 'remote-mysql'] : ['mock', 'openai', 'claude', 'private']).map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <input
          value={valueString}
          disabled={!editable}
          onChange={(event) => {
            const raw = event.target.value;
            if (typeof setting.value === 'number') setValue(Number(raw));
            else if (Array.isArray(setting.value)) setValue(raw.split(',').map((item) => item.trim()).filter(Boolean));
            else setValue(raw);
          }}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-300"
        />
      )}

      <button
        disabled={!editable || saving}
        onClick={() => void onSave(setting, value)}
        className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <Save className="h-4 w-4" /> {saving ? 'Saving' : 'Save'}
      </button>
    </div>
  );
}
