import { Router } from 'express';
import { z } from 'zod';
import { ok } from '../../lib/http.js';
import { optionalAuth, requireAuth } from '../../middleware/auth.js';
import { runAICommand } from './ai.service.js';
import { prisma } from '../../lib/prisma.js';

const router = Router();

router.post('/command', optionalAuth, async (req, res) => {
  const body = z.object({ prompt: z.string().min(1), context: z.unknown().optional() }).parse(req.body);
  res.json(ok(await runAICommand({ prompt: body.prompt, context: body.context, userEmail: req.user?.email })));
});

router.get('/providers', requireAuth, async (_req, res) => {
  const providers = await prisma.aIProviderSetting.findMany({ orderBy: { displayName: 'asc' } });
  res.json(ok(providers));
});

router.patch('/providers/:providerKey/activate', requireAuth, async (req, res) => {
  await prisma.aIProviderSetting.updateMany({ data: { isEnabled: false } });
  const provider = await prisma.aIProviderSetting.update({ where: { providerKey: req.params.providerKey as never }, data: { isEnabled: true } });
  res.json(ok(provider));
});

export default router;
