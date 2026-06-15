import type { AICommandResponse } from '@saven/infraops-shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {})
    },
    cache: 'no-store'
  });

  if (!response.ok) throw new Error(await response.text());
  const payload = await response.json();
  return payload.data as T;
}

export async function runAICommand(prompt: string): Promise<AICommandResponse & { provider?: string }> {
  try {
    return await apiFetch('/ai/command', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
  } catch {
    return {
      provider: 'local-fallback',
      answer: 'API is not reachable, so I am showing local fallback results. Start the Node API to get live data.',
      summary: { openRequests: 42, breachedSla: 6, critical: 3 },
      cards: [
        { id: 'SR-1024', type: 'serviceRequest', title: 'VPN not working for client access', subtitle: 'Federal project', status: 'OPEN', priority: 'HIGH', href: '/service-requests?ticket=SR-1024' }
      ],
      suggestedActions: ['Open Service Requests', 'Start API', 'Export sample report'],
      sources: [{ label: 'Local fallback data' }]
    };
  }
}

export interface SystemSettingDto {
  key: string;
  group: string;
  label: string;
  description: string;
  value: string | number | boolean | string[] | Record<string, unknown> | null;
  source: 'database' | 'default';
  isSecret?: boolean;
  isEditable?: boolean;
}

export async function getSystemSettings(group?: string): Promise<SystemSettingDto[]> {
  try {
    return await apiFetch(`/settings${group ? `?group=${encodeURIComponent(group)}` : ''}`);
  } catch {
    return fallbackSettings.filter((item) => !group || item.group === group);
  }
}

export async function updateSystemSetting(key: string, value: SystemSettingDto['value']) {
  return apiFetch(`/settings/${encodeURIComponent(key)}`, {
    method: 'PATCH',
    body: JSON.stringify({ value })
  });
}

const fallbackSettings: SystemSettingDto[] = [
  { key: 'database.mode', group: 'database', label: 'Database mode', description: 'Choose local MySQL, Docker MySQL, or remote MySQL for development and deployment notes.', value: 'local-mysql', source: 'default' },
  { key: 'database.host', group: 'database', label: 'MySQL host', description: 'Host used by API DATABASE_URL.', value: 'localhost', source: 'default' },
  { key: 'database.port', group: 'database', label: 'MySQL port', description: 'MySQL server port.', value: 3306, source: 'default' },
  { key: 'database.name', group: 'database', label: 'Database name', description: 'Schema name used for InfraOps.', value: 'saven_infraops', source: 'default' },
  { key: 'auth.customLogin.enabled', group: 'auth', label: 'Custom Saven login', description: 'Enable username and password login.', value: true, source: 'default' },
  { key: 'auth.microsoft.enabled', group: 'auth', label: 'Microsoft login', description: 'Enable Microsoft Entra login.', value: false, source: 'default' },
  { key: 'auth.microsoft.allowedDomains', group: 'auth', label: 'Allowed Microsoft domains', description: 'Allowed email domains for Microsoft login.', value: ['saven.in'], source: 'default' },
  { key: 'ai.activeProvider', group: 'ai', label: 'Active AI provider', description: 'Switch between mock, OpenAI, Claude, and private model.', value: 'mock', source: 'default' },
  { key: 'ai.openai.model', group: 'ai', label: 'OpenAI model', description: 'Model used when OpenAI is active.', value: 'gpt-4.1-mini', source: 'default' },
  { key: 'ai.claude.model', group: 'ai', label: 'Claude model', description: 'Model used when Claude is active.', value: 'claude-3-5-sonnet-latest', source: 'default' },
  { key: 'ai.private.baseUrl', group: 'ai', label: 'Private model base URL', description: 'Local or private model endpoint.', value: 'http://localhost:11434', source: 'default' },
  { key: 'notifications.email.enabled', group: 'notifications', label: 'Email notifications', description: 'Enable SMTP email notifications.', value: true, source: 'default' },
  { key: 'notifications.teams.enabled', group: 'notifications', label: 'Teams notifications', description: 'Enable Teams webhook messages.', value: false, source: 'default' },
  { key: 'imports.excel.maxUploadMb', group: 'imports', label: 'Excel max upload size', description: 'Maximum Excel file size allowed.', value: 20, source: 'default' },
  { key: 'imports.excel.previewRequired', group: 'imports', label: 'Preview before import', description: 'Require preview and validation before commit.', value: true, source: 'default' },
  { key: 'sla.critical.responseMinutes', group: 'sla', label: 'Critical response SLA', description: 'Response SLA in minutes.', value: 15, source: 'default' },
  { key: 'sla.critical.resolutionHours', group: 'sla', label: 'Critical resolution SLA', description: 'Resolution SLA in hours.', value: 4, source: 'default' },
  { key: 'security.audit.enabled', group: 'security', label: 'Audit logging', description: 'Track sensitive changes.', value: true, source: 'default' },
  { key: 'ui.commandBar.enabled', group: 'ui', label: 'Always on AI command bar', description: 'Show bottom command bar on every screen.', value: true, source: 'default' }
];
