import { Router } from 'express';
import { z } from 'zod';
import { ok } from '../../lib/http.js';
import { loginWithPassword } from './auth.service.js';
import { exchangeMicrosoftCode, getMicrosoftLoginUrl } from './microsoft.service.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);
  res.json(ok(await loginWithPassword(body.email, body.password)));
});

router.get('/me', requireAuth, async (req, res) => {
  res.json(ok(req.user));
});

router.get('/microsoft/login-url', async (_req, res) => {
  res.json(ok({ url: getMicrosoftLoginUrl() }));
});

router.get('/microsoft/callback', async (req, res) => {
  const code = z.string().parse(req.query.code);
  res.json(ok(await exchangeMicrosoftCode(code)));
});

export default router;
