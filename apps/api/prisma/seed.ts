import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { settingDefinitions } from '../src/modules/settings/settings.definitions.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const permissions = ['*', 'tickets:read', 'tickets:write', 'incidents:read', 'incidents:write', 'inventory:read', 'inventory:write', 'compliance:read', 'compliance:write', 'settings:write'];
  for (const code of permissions) {
    await prisma.permission.upsert({ where: { code }, update: {}, create: { code, description: code === '*' ? 'Full access' : code } });
  }

  const superAdmin = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: { name: 'Super Admin', description: 'Full platform access' }
  });

  for (const permission of await prisma.permission.findMany()) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdmin.id, permissionId: permission.id } },
      update: {},
      create: { roleId: superAdmin.id, permissionId: permission.id }
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@saven.in';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@12345';
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Saven Admin',
      email: adminEmail,
      employeeCode: 'SAVEN-ADMIN',
      department: 'InfraOps',
      designation: 'System Administrator',
      passwordHash: await bcrypt.hash(adminPassword, 12)
    }
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: superAdmin.id } },
    update: {},
    create: { userId: admin.id, roleId: superAdmin.id }
  });

  await prisma.aIProviderSetting.createMany({
    data: [
      { providerKey: 'mock', displayName: 'Mock AI', isEnabled: true, modelName: 'mock' },
      { providerKey: 'openai', displayName: 'OpenAI', isEnabled: false, modelName: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini' },
      { providerKey: 'claude', displayName: 'Claude', isEnabled: false, modelName: process.env.CLAUDE_MODEL ?? 'claude-3-5-sonnet-latest' },
      { providerKey: 'private', displayName: 'Private Model', isEnabled: false, modelName: process.env.PRIVATE_MODEL_NAME ?? 'llama3.1', baseUrl: process.env.PRIVATE_MODEL_BASE_URL ?? 'http://localhost:11434' }
    ],
    skipDuplicates: true
  });

  for (const setting of settingDefinitions) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        group: setting.group,
        label: setting.label,
        description: setting.description,
        valueJson: setting.defaultValue as never,
        isSecret: Boolean(setting.isSecret),
        isEditable: setting.isEditable !== false
      }
    });
  }

  const federal = await prisma.project.upsert({
    where: { code: 'FED-CCMS' },
    update: {},
    create: { code: 'FED-CCMS', name: 'Federal Bank CCMS', clientName: 'Federal Bank', deliveryOwner: 'JVS' }
  });

  await prisma.environment.createMany({
    data: [
      { projectId: federal.id, name: 'UAT', type: 'UAT', baseUrl: 'https://uat.example.saven.in', cloudProvider: 'AWS', backupEnabled: true, owner: 'DevOps' },
      { projectId: federal.id, name: 'Production', type: 'PROD', baseUrl: 'https://prod.example.saven.in', cloudProvider: 'AWS', backupEnabled: true, owner: 'DevOps' }
    ],
    skipDuplicates: true
  });

  await prisma.serviceRequest.createMany({
    data: [
      { requestNo: 'SR-1024', title: 'VPN not working for client access', description: 'User is unable to connect to VPN for client server access.', category: 'VPN', priority: 'HIGH', status: 'OPEN', projectId: federal.id, createdById: admin.id },
      { requestNo: 'SR-1025', title: 'Laptop allocation for new QA', description: 'Allocate laptop and configure required tools.', category: 'Asset', priority: 'MEDIUM', status: 'ASSIGNED', projectId: federal.id, createdById: admin.id, assignedToId: admin.id }
    ],
    skipDuplicates: true
  });

  await prisma.incident.createMany({
    data: [
      { incidentNo: 'INC-2001', title: 'UAT payment gateway timeout', description: 'Payment gateway timeout observed in UAT.', severity: 'SEV2', status: 'IN_PROGRESS', impactedService: 'Payment Gateway', startedAt: new Date(), projectId: federal.id, ownerId: admin.id }
    ],
    skipDuplicates: true
  });

  await prisma.asset.createMany({
    data: [
      { assetTag: 'AST-1001', type: 'Laptop', make: 'Dell', model: 'Latitude 5440', serialNumber: 'DL5440-1001', status: 'AVAILABLE', location: 'Hyderabad' },
      { assetTag: 'AST-1017', type: 'Laptop', make: 'Apple', model: 'MacBook Pro 14', serialNumber: 'MBP14-1017', status: 'ASSIGNED', location: 'Hyderabad' }
    ],
    skipDuplicates: true
  });

  const accessReview = await prisma.complianceControl.upsert({
    where: { controlCode: 'ISO-AC-001' },
    update: {},
    create: { controlCode: 'ISO-AC-001', title: 'Quarterly Access Review', area: 'Access Management', owner: 'InfoSec', frequency: 'Quarterly', riskRating: 'HIGH' }
  });

  await prisma.complianceTask.createMany({
    data: [
      { controlId: accessReview.id, periodLabel: 'Q2 2026', dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: 'EVIDENCE_PENDING' }
    ],
    skipDuplicates: true
  });

  const vendor = await prisma.vendor.upsert({ where: { name: 'Microsoft' }, update: {}, create: { name: 'Microsoft', category: 'Productivity', contactEmail: 'vendor@example.com' } });
  await prisma.license.createMany({ data: [{ vendorId: vendor.id, productName: 'Microsoft 365', licenseType: 'Business', totalSeats: 100, assignedSeats: 78, owner: 'Admin' }], skipDuplicates: true });

  await prisma.knowledgeArticle.createMany({
    data: [
      { articleNo: 'KB-0001', title: 'VPN basic troubleshooting', category: 'VPN', content: 'Check internet connectivity, VPN client version, credentials, and gateway status.', tags: 'vpn,network,access', status: 'PUBLISHED', owner: 'Infra' }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });
