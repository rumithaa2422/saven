import type { AICommandResponse } from '@saven/infraops-shared';

export interface AIProvider {
  key: 'mock' | 'openai' | 'claude' | 'private';
  complete(input: { prompt: string; context?: unknown }): Promise<AICommandResponse>;
}
