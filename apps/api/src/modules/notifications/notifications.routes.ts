import { Router } from 'express';
import { z } from 'zod';
import { ok } from '../../lib/http.js';
import { requireAuth } from '../../middleware/auth.js';
import { sendEmail } from './email.service.js';
import { sendTeamsMessage } from './teams.service.js';

const router = Router();
router.use(requireAuth);

router.post('/email/test', async (req, res) => {
  const body = z.object({ to: z.string().email() }).parse(req.body);
  res.json(ok(await sendEmail({ to: body.to, subject: 'Saven InfraOps test email', html: '<p>Email notification is configured.</p>' })));
});

router.post('/teams/test', async (req, res) => {
  res.json(ok(await sendTeamsMessage({ title: 'Saven InfraOps test', text: 'Teams notification is configured.' })));
});

export default router;
