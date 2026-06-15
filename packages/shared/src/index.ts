export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RecordStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'WAITING_FOR_VENDOR' | 'RESOLVED' | 'CLOSED' | 'REOPENED';
export type AIProviderKey = 'mock' | 'openai' | 'claude' | 'private';

export interface QueryResultCard {
  id: string;
  type: 'serviceRequest' | 'incident' | 'asset' | 'compliance' | 'access' | 'change' | 'report';
  title: string;
  subtitle: string;
  status?: string;
  priority?: Priority;
  href: string;
}

export interface AICommandResponse {
  answer: string;
  summary: Record<string, string | number>;
  cards: QueryResultCard[];
  suggestedActions: string[];
  sources: Array<{ label: string; href?: string }>;
}

export const MODULES = [
  'command-center',
  'service-requests',
  'incidents',
  'problems',
  'changes',
  'inventory',
  'access-management',
  'compliance',
  'projects-environments',
  'vendors-licenses',
  'reports-analytics',
  'knowledge-base',
  'users-teams',
  'settings'
] as const;

export type ModuleKey = typeof MODULES[number];
