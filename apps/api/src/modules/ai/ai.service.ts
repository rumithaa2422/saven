import { env } from '../../config/env.js';
import { prisma } from '../../lib/prisma.js';
import type { AIProvider } from './types.js';
import { mockProvider } from './mock.provider.js';
import { openAIProvider } from './openai.provider.js';
import { claudeProvider } from './claude.provider.js';
import { privateModelProvider } from './private.provider.js';
import { getSettingValue } from '../settings/settings.service.js';

const providers: Record<string, AIProvider> = {
  mock: mockProvider,
  openai: openAIProvider,
  claude: claudeProvider,
  private: privateModelProvider
};

export async function getActiveProviderKey() {
  try {
    const configuredProvider = await getSettingValue<string>('ai.activeProvider', env.AI_ACTIVE_PROVIDER);
    if (configuredProvider && providers[configuredProvider]) return configuredProvider;

    const enabled = await prisma.aIProviderSetting.findFirst({ where: { isEnabled: true } });
    return enabled?.providerKey ?? env.AI_ACTIVE_PROVIDER;
  } catch {
    return env.AI_ACTIVE_PROVIDER;
  }
}

export async function runAICommand(input: { prompt: string; userEmail?: string; context?: unknown }) {
  const providerKey = await getActiveProviderKey();
  const provider = providers[providerKey] ?? mockProvider;
  const result = await provider.complete({ prompt: input.prompt, context: input.context });

  try {
    const conversation = await prisma.aIConversation.create({ data: { title: input.prompt.slice(0, 120), userEmail: input.userEmail } });
    await prisma.aIMessage.createMany({
      data: [
        { conversationId: conversation.id, role: 'user', content: input.prompt, provider: provider.key },
        { conversationId: conversation.id, role: 'assistant', content: result.answer, provider: provider.key, sourcesJson: result.sources as never }
      ]
    });
  } catch (error) {
    console.warn('AI conversation log skipped', error);
  }

  return { ...result, provider: provider.key };
}
