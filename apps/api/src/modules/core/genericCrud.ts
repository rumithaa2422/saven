import type { Request } from 'express';
import { prisma } from '../../lib/prisma.js';
import { HttpError } from '../../lib/http.js';
import { writeAuditLog } from '../../middleware/audit.js';

export interface CrudConfig {
  prismaModel: string;
  entityType: string;
  searchable?: string[];
  defaultOrderBy?: Record<string, 'asc' | 'desc'>;
  include?: Record<string, unknown>;
}

function buildWhere(query: Request['query'], searchable: string[] = []) {
  const where: Record<string, unknown> = {};
  const search = typeof query.search === 'string' ? query.search.trim() : '';
  if (search && searchable.length) {
    where.OR = searchable.map((field) => ({ [field]: { contains: search } }));
  }
  if (typeof query.status === 'string' && query.status !== 'ALL') where.status = query.status;
  if (typeof query.priority === 'string' && query.priority !== 'ALL') where.priority = query.priority;
  if (typeof query.category === 'string' && query.category !== 'ALL') where.category = query.category;
  return where;
}

export function createCrudHandlers(config: CrudConfig) {
  const model = (prisma as unknown as Record<string, any>)[config.prismaModel];
  if (!model) throw new Error(`Invalid Prisma model: ${config.prismaModel}`);

  return {
    list: async (req: Request) => {
      const take = Math.min(Number(req.query.take ?? 50), 100);
      const skip = Number(req.query.skip ?? 0);
      const where = buildWhere(req.query, config.searchable);
      const [items, total] = await Promise.all([
        model.findMany({
          where,
          take,
          skip,
          orderBy: config.defaultOrderBy ?? { createdAt: 'desc' },
          include: config.include
        }),
        model.count({ where })
      ]);
      return { items, total, take, skip };
    },
    getById: async (req: Request) => {
      const item = await model.findUnique({ where: { id: req.params.id }, include: config.include });
      if (!item) throw new HttpError(404, `${config.entityType} not found`);
      return item;
    },
    create: async (req: Request) => {
      const created = await model.create({ data: req.body });
      await writeAuditLog(req, { action: 'CREATE', entityType: config.entityType, entityId: created.id, afterJson: created });
      return created;
    },
    update: async (req: Request) => {
      const before = await model.findUnique({ where: { id: req.params.id } });
      if (!before) throw new HttpError(404, `${config.entityType} not found`);
      const updated = await model.update({ where: { id: req.params.id }, data: req.body });
      await writeAuditLog(req, { action: 'UPDATE', entityType: config.entityType, entityId: updated.id, beforeJson: before, afterJson: updated });
      return updated;
    },
    remove: async (req: Request) => {
      const before = await model.findUnique({ where: { id: req.params.id } });
      if (!before) throw new HttpError(404, `${config.entityType} not found`);
      const deleted = await model.delete({ where: { id: req.params.id } });
      await writeAuditLog(req, { action: 'DELETE', entityType: config.entityType, entityId: deleted.id, beforeJson: before });
      return deleted;
    }
  };
}
