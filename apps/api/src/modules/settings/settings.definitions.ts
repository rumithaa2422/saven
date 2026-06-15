import { env } from '../../config/env.js';

export type SettingGroup = 'database' | 'auth' | 'ai' | 'notifications' | 'imports' | 'sla' | 'security' | 'ui';
export type SettingValue = string | number | boolean | string[] | Record<string, unknown> | null;

export interface SettingDefinition {
  key: string;
  group: SettingGroup;
  label: string;
  description: string;
  defaultValue: SettingValue;
  isSecret?: boolean;
  isEditable?: boolean;
}

export const settingDefinitions: SettingDefinition[] = [
  {
    key: 'database.mode',
    group: 'database',
    label: 'Database mode',
    description: 'Select how developers connect to MySQL. Runtime reads DATABASE_URL from env, but this setting documents the chosen mode for the portal.',
    defaultValue: process.env.DB_MODE ?? 'local-mysql'
  },
  {
    key: 'database.host',
    group: 'database',
    label: 'MySQL host',
    description: 'Host used by the API. For Docker, use localhost from Windows or mysql inside compose network.',
    defaultValue: process.env.DB_HOST ?? 'localhost'
  },
  {
    key: 'database.port',
    group: 'database',
    label: 'MySQL port',
    description: 'MySQL server port.',
    defaultValue: Number(process.env.DB_PORT ?? 3306)
  },
  {
    key: 'database.name',
    group: 'database',
    label: 'Database name',
    description: 'InfraOps database schema name.',
    defaultValue: process.env.DB_NAME ?? 'saven_infraops'
  },
  {
    key: 'auth.customLogin.enabled',
    group: 'auth',
    label: 'Custom Saven login',
    description: 'Enable username and password login for Saven users.',
    defaultValue: true
  },
  {
    key: 'auth.microsoft.enabled',
    group: 'auth',
    label: 'Microsoft login',
    description: 'Enable Microsoft login using Entra app registration.',
    defaultValue: Boolean(env.MICROSOFT_CLIENT_ID)
  },
  {
    key: 'auth.microsoft.allowedDomains',
    group: 'auth',
    label: 'Allowed Microsoft domains',
    description: 'Comma separated allowed email domains for Microsoft login.',
    defaultValue: env.MICROSOFT_ALLOWED_DOMAINS.split(',').map((item) => item.trim()).filter(Boolean)
  },
  {
    key: 'ai.activeProvider',
    group: 'ai',
    label: 'Active AI provider',
    description: 'Provider used by the AI assistant. Allowed values are mock, openai, claude, private.',
    defaultValue: env.AI_ACTIVE_PROVIDER
  },
  {
    key: 'ai.openai.model',
    group: 'ai',
    label: 'OpenAI model',
    description: 'Model name used when OpenAI provider is active.',
    defaultValue: env.OPENAI_MODEL
  },
  {
    key: 'ai.claude.model',
    group: 'ai',
    label: 'Claude model',
    description: 'Model name used when Claude provider is active.',
    defaultValue: env.CLAUDE_MODEL
  },
  {
    key: 'ai.private.baseUrl',
    group: 'ai',
    label: 'Private model base URL',
    description: 'Base URL for local or private model API.',
    defaultValue: env.PRIVATE_MODEL_BASE_URL
  },
  {
    key: 'ai.private.model',
    group: 'ai',
    label: 'Private model name',
    description: 'Model name for private model provider.',
    defaultValue: env.PRIVATE_MODEL_NAME
  },
  {
    key: 'notifications.email.enabled',
    group: 'notifications',
    label: 'Email notifications',
    description: 'Enable SMTP based email notifications.',
    defaultValue: true
  },
  {
    key: 'notifications.email.from',
    group: 'notifications',
    label: 'Email sender',
    description: 'Default sender address for system emails.',
    defaultValue: env.SMTP_FROM
  },
  {
    key: 'notifications.teams.enabled',
    group: 'notifications',
    label: 'Teams notifications',
    description: 'Enable Microsoft Teams webhook messages.',
    defaultValue: Boolean(env.TEAMS_WEBHOOK_URL)
  },
  {
    key: 'imports.excel.maxUploadMb',
    group: 'imports',
    label: 'Excel max upload size',
    description: 'Maximum Excel file size allowed for import.',
    defaultValue: env.MAX_UPLOAD_MB
  },
  {
    key: 'imports.excel.previewRequired',
    group: 'imports',
    label: 'Preview before import',
    description: 'Require preview and validation before committing Excel rows.',
    defaultValue: true
  },
  {
    key: 'sla.critical.responseMinutes',
    group: 'sla',
    label: 'Critical response SLA',
    description: 'Response SLA for critical tickets in minutes.',
    defaultValue: 15
  },
  {
    key: 'sla.critical.resolutionHours',
    group: 'sla',
    label: 'Critical resolution SLA',
    description: 'Resolution SLA for critical tickets in hours.',
    defaultValue: 4
  },
  {
    key: 'sla.high.responseMinutes',
    group: 'sla',
    label: 'High response SLA',
    description: 'Response SLA for high priority tickets in minutes.',
    defaultValue: 30
  },
  {
    key: 'sla.high.resolutionHours',
    group: 'sla',
    label: 'High resolution SLA',
    description: 'Resolution SLA for high priority tickets in hours.',
    defaultValue: 8
  },
  {
    key: 'security.audit.enabled',
    group: 'security',
    label: 'Audit logging',
    description: 'Enable audit logging for sensitive actions.',
    defaultValue: true
  },
  {
    key: 'ui.commandBar.enabled',
    group: 'ui',
    label: 'Always on AI command bar',
    description: 'Show the bottom narrative command bar across all screens.',
    defaultValue: true
  }
];
