import { Router } from 'express';
import { z } from 'zod';
import { ok } from '../../lib/http.js';
import { requireAuth } from '../../middleware/auth.js';
import { ensureSystemSettings, listSettings, updateSetting } from './settings.service.js';
import type { SettingGroup } from './settings.definitions.js';

const router = Router();
router.use(requireAuth);

const groupSchema = z.enum(['database', 'auth', 'ai', 'notifications', 'imports', 'sla', 'security', 'ui']);
const settingValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.record(z.unknown()),
  z.null()
]);

router.post('/initialize', async (_req, res) => {
  await ensureSystemSettings();
  res.json(ok({ initialized: true }));
});

router.get('/', async (req, res) => {
  const group = req.query.group ? groupSchema.parse(req.query.group) : undefined;
  res.json(ok(await listSettings(group as SettingGroup | undefined)));
});

router.patch('/:key', async (req, res) => {
  const body = z.object({ value: settingValueSchema }).parse(req.body);
  const updated = await updateSetting({ key: req.params.key, value: body.value, updatedBy: req.user?.email });
  res.json(ok(updated));
});

router.get('/runtime/database', async (_req, res) => {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  const masked = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
    : null;
  res.json(ok({
    hasDatabaseUrl,
    databaseUrl: masked,
    note: 'Database connection is read from env before API starts. Change .env.local and restart API to switch between Docker MySQL and Windows MySQL.'
  }));
});

export default router;
