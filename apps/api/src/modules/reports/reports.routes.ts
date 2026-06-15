import { Router } from 'express';
import { ok } from '../../lib/http.js';
import { requireAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

const router = Router();
router.use(requireAuth);

router.get('/summary', async (_req, res) => {
  const [openRequests, criticalIncidents, assetsAvailable, complianceOverdue, pendingAccess, openChanges] = await Promise.all([
    prisma.serviceRequest.count({ where: { status: { in: ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_FOR_USER', 'WAITING_FOR_VENDOR'] } } }),
    prisma.incident.count({ where: { severity: { in: ['SEV1', 'SEV2'] }, status: { notIn: ['RESOLVED', 'CLOSED'] } } }),
    prisma.asset.count({ where: { status: 'AVAILABLE' } }),
    prisma.complianceTask.count({ where: { status: 'OVERDUE' } }),
    prisma.accessRequest.count({ where: { status: { in: ['REQUESTED', 'MANAGER_APPROVAL_PENDING', 'INFOSEC_APPROVAL_PENDING', 'APPROVED'] } } }),
    prisma.changeRequest.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'SCHEDULED'] } } })
  ]);

  res.json(ok({ openRequests, criticalIncidents, assetsAvailable, complianceOverdue, pendingAccess, openChanges }));
});

export default router;
