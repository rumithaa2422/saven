import { env } from '../../config/env.js';
import { HttpError } from '../../lib/http.js';
import type { AIProvider } from './types.js';
import { mockProvider } from './mock.provider.js';
import { getSettingValue } from '../settings/settings.service.js';

export const openAIProvider: AIProvider = {
  key: 'openai',
  async complete({ prompt, context }) {
    if (!env.OPENAI_API_KEY) throw new HttpError(400, 'OpenAI API key is not configured');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: await getSettingValue<string>('ai.openai.model', env.OPENAI_MODEL),
        temperature: 0.2,
        messages: [
          { role: 'system', content: 'You are Saven InfraOps AI Assistant. Return concise operational answers. Never expose secrets. Suggest safe actions only.' },
          { role: 'user', content: `Prompt: ${prompt}\nContext: ${JSON.stringify(context ?? {})}` }
        ]
      })
    });

    if (!response.ok) throw new HttpError(502, 'OpenAI provider failed', await response.text());
    const data = await response.json() as any;
    const base = await mockProvider.complete({ prompt, context });
    return { ...base, answer: data.choices?.[0]?.message?.content ?? base.answer };
  }
};
