import type { Request } from 'express';
import { prisma } from '../lib/prisma.js';

export async function writeAuditLog(req: Request, input: {
  action: string;
  entityType: string;
  entityId?: string;
  beforeJson?: unknown;
  afterJson?: unknown;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: req.user?.id,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        beforeJson: input.beforeJson as never,
        afterJson: input.afterJson as never,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });
  } catch (error) {
    console.warn('Audit log failed', error);
  }
}
