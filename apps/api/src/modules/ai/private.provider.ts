import { env } from '../../config/env.js';
import { HttpError } from '../../lib/http.js';
import type { AIProvider } from './types.js';
import { mockProvider } from './mock.provider.js';
import { getSettingValue } from '../settings/settings.service.js';

export const privateModelProvider: AIProvider = {
  key: 'private',
  async complete({ prompt, context }) {
    const baseUrl = await getSettingValue<string>('ai.private.baseUrl', env.PRIVATE_MODEL_BASE_URL);
    const modelName = await getSettingValue<string>('ai.private.model', env.PRIVATE_MODEL_NAME);

    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env.PRIVATE_MODEL_API_KEY ? { Authorization: `Bearer ${env.PRIVATE_MODEL_API_KEY}` } : {})
      },
      body: JSON.stringify({
        model: modelName,
        prompt: `You are Saven InfraOps AI Assistant. Prompt: ${prompt}\nContext: ${JSON.stringify(context ?? {})}`,
        stream: false
      })
    });

    if (!response.ok) throw new HttpError(502, 'Private model provider failed', await response.text());
    const data = await response.json() as any;
    const base = await mockProvider.complete({ prompt, context });
    return { ...base, answer: data.response ?? base.answer };
  }
};
