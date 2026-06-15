import { Router } from 'express';
import { ok } from './lib/http.js';
import authRoutes from './modules/auth/auth.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import notificationRoutes from './modules/notifications/notifications.routes.js';
import excelRoutes from './modules/imports/excel.routes.js';
import reportRoutes from './modules/reports/reports.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import { crudRouter } from './modules/core/crud.routes.js';

const router = Router();

router.get('/health', (_req, res) => res.json(ok({ status: 'UP', service: 'Saven InfraOps API' })));
router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);
router.use('/imports/excel', excelRoutes);
router.use('/reports', reportRoutes);
router.use('/settings', settingsRoutes);

router.use('/service-requests', crudRouter({
  prismaModel: 'serviceRequest',
  entityType: 'ServiceRequest',
  searchable: ['requestNo', 'title', 'description', 'category'],
  include: { project: true, createdBy: true, assignedTo: true }
}));

router.use('/incidents', crudRouter({
  prismaModel: 'incident',
  entityType: 'Incident',
  searchable: ['incidentNo', 'title', 'description', 'impactedService'],
  include: { project: true, owner: true, timeline: true }
}));

router.use('/problems', crudRouter({
  prismaModel: 'problem',
  entityType: 'Problem',
  searchable: ['problemNo', 'title', 'description', 'rootCause']
}));

router.use('/changes', crudRouter({
  prismaModel: 'changeRequest',
  entityType: 'ChangeRequest',
  searchable: ['changeNo', 'title', 'description', 'type'],
  include: { project: true }
}));

router.use('/inventory', crudRouter({
  prismaModel: 'asset',
  entityType: 'Asset',
  searchable: ['assetTag', 'type', 'make', 'model', 'serialNumber'],
  include: { assignments: { include: { user: true } } }
}));

router.use('/access-requests', crudRouter({
  prismaModel: 'accessRequest',
  entityType: 'AccessRequest',
  searchable: ['requestNo', 'requesterName', 'requesterEmail', 'systemName', 'accessType']
}));

router.use('/compliance-controls', crudRouter({
  prismaModel: 'complianceControl',
  entityType: 'ComplianceControl',
  searchable: ['controlCode', 'title', 'area', 'owner'],
  include: { tasks: true }
}));

router.use('/compliance-tasks', crudRouter({
  prismaModel: 'complianceTask',
  entityType: 'ComplianceTask',
  searchable: ['periodLabel', 'remarks'],
  include: { control: true }
}));

router.use('/projects', crudRouter({
  prismaModel: 'project',
  entityType: 'Project',
  searchable: ['code', 'name', 'clientName', 'deliveryOwner'],
  include: { environments: true }
}));

router.use('/environments', crudRouter({
  prismaModel: 'environment',
  entityType: 'Environment',
  searchable: ['name', 'type', 'baseUrl', 'owner'],
  include: { project: true }
}));

router.use('/vendors', crudRouter({
  prismaModel: 'vendor',
  entityType: 'Vendor',
  searchable: ['name', 'contactName', 'contactEmail', 'category'],
  include: { licenses: true }
}));

router.use('/licenses', crudRouter({
  prismaModel: 'license',
  entityType: 'License',
  searchable: ['productName', 'licenseType', 'owner'],
  include: { vendor: true }
}));

router.use('/knowledge-base', crudRouter({
  prismaModel: 'knowledgeArticle',
  entityType: 'KnowledgeArticle',
  searchable: ['articleNo', 'title', 'category', 'content', 'tags']
}));

router.use('/users', crudRouter({
  prismaModel: 'user',
  entityType: 'User',
  searchable: ['name', 'email', 'employeeCode', 'department', 'designation'],
  include: { roles: { include: { role: true } } }
}));

router.use('/audit-logs', crudRouter({
  prismaModel: 'auditLog',
  entityType: 'AuditLog',
  searchable: ['action', 'entityType']
}));

export default router;
