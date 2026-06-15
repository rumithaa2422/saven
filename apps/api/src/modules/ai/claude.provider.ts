import { env } from '../../config/env.js';
import { HttpError } from '../../lib/http.js';
import type { AIProvider } from './types.js';
import { mockProvider } from './mock.provider.js';
import { getSettingValue } from '../settings/settings.service.js';

export const claudeProvider: AIProvider = {
  key: 'claude',
  async complete({ prompt, context }) {
    if (!env.CLAUDE_API_KEY) throw new HttpError(400, 'Claude API key is not configured');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: await getSettingValue<string>('ai.claude.model', env.CLAUDE_MODEL),
        max_tokens: 800,
        temperature: 0.2,
        system: 'You are Saven InfraOps AI Assistant. Return concise operational answers. Never expose secrets. Suggest safe actions only.',
        messages: [{ role: 'user', content: `Prompt: ${prompt}\nContext: ${JSON.stringify(context ?? {})}` }]
      })
    });

    if (!response.ok) throw new HttpError(502, 'Claude provider failed', await response.text());
    const data = await response.json() as any;
    const text = data.content?.map((item: any) => item.text).join('\n') ?? '';
    const base = await mockProvider.complete({ prompt, context });
    return { ...base, answer: text || base.answer };
  }
};
