export interface ModuleRecord {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  priority?: string;
  owner?: string;
  updatedAt: string;
}

export interface ModuleConfig {
  title: string;
  description: string;
  apiPath: string;
  primaryAction: string;
  aiPrompts: string[];
  stats: Array<{ label: string; value: string; tone: string }>;
  columns: string[];
  records: ModuleRecord[];
}

export const moduleConfigs: Record<string, ModuleConfig> = {
  'service-requests': {
    title: 'Service Requests',
    description: 'Track Infra, Admin, DevOps, access, laptop, network, cloud, and support requests.',
    apiPath: '/service-requests',
    primaryAction: 'Create Request',
    aiPrompts: ['Show open tickets older than 3 days', 'List SLA breached tickets', 'Draft follow-up for waiting tickets'],
    stats: [
      { label: 'Open', value: '42', tone: 'bg-indigo-50 text-indigo-700' },
      { label: 'SLA Breached', value: '6', tone: 'bg-rose-50 text-rose-700' },
      { label: 'High Priority', value: '9', tone: 'bg-amber-50 text-amber-700' },
      { label: 'Waiting Vendor', value: '8', tone: 'bg-slate-100 text-slate-700' }
    ],
    columns: ['Ticket', 'Status', 'Priority', 'Owner', 'Updated'],
    records: [
      { id: 'SR-1024', title: 'VPN not working for client access', subtitle: 'Federal project', status: 'OPEN', priority: 'HIGH', owner: 'Infra Team', updatedAt: '10 min ago' },
      { id: 'SR-1025', title: 'Laptop allocation for new QA', subtitle: 'DGA onboarding', status: 'ASSIGNED', priority: 'MEDIUM', owner: 'Admin Team', updatedAt: '35 min ago' },
      { id: 'SR-1026', title: 'MySQL access request', subtitle: 'UAT database', status: 'WAITING_APPROVAL', priority: 'HIGH', owner: 'InfoSec', updatedAt: '1 hour ago' }
    ]
  },
  incidents: {
    title: 'Incidents',
    description: 'Manage outages, degraded services, alerts, impact, timeline, RCA, and closure approvals.',
    apiPath: '/incidents',
    primaryAction: 'Create Incident',
    aiPrompts: ['Summarize today incidents', 'Draft RCA for open incident', 'Show Sev1 and Sev2 incidents'],
    stats: [
      { label: 'Open', value: '7', tone: 'bg-indigo-50 text-indigo-700' },
      { label: 'Sev 1', value: '1', tone: 'bg-rose-50 text-rose-700' },
      { label: 'Sev 2', value: '2', tone: 'bg-amber-50 text-amber-700' },
      { label: 'RCA Pending', value: '4', tone: 'bg-slate-100 text-slate-700' }
    ],
    columns: ['Incident', 'Status', 'Severity', 'Owner', 'Updated'],
    records: [
      { id: 'INC-2001', title: 'UAT payment gateway timeout', subtitle: 'Payment service degraded', status: 'IN_PROGRESS', priority: 'SEV2', owner: 'DevOps', updatedAt: '15 min ago' },
      { id: 'INC-2002', title: 'VPN gateway unstable', subtitle: 'Multiple users impacted', status: 'OPEN', priority: 'SEV1', owner: 'Infra Team', updatedAt: '25 min ago' }
    ]
  },
  problems: {
    title: 'Problem Management',
    description: 'Identify recurring issues, root causes, workarounds, and permanent fixes.',
    apiPath: '/problems',
    primaryAction: 'Create Problem',
    aiPrompts: ['Find recurring VPN issues', 'Suggest permanent fix', 'Show problems without RCA'],
    stats: [
      { label: 'Open Problems', value: '9', tone: 'bg-indigo-50 text-indigo-700' },
      { label: 'RCA Pending', value: '5', tone: 'bg-amber-50 text-amber-700' },
      { label: 'Known Errors', value: '3', tone: 'bg-slate-100 text-slate-700' },
      { label: 'Fix Planned', value: '2', tone: 'bg-emerald-50 text-emerald-700' }
    ],
    columns: ['Problem', 'Status', 'Priority', 'Owner', 'Updated'],
    records: [
      { id: 'PRB-3001', title: 'Repeated VPN disconnects', subtitle: 'Observed across 8 tickets', status: 'OPEN', priority: 'HIGH', owner: 'Infra', updatedAt: '2 hours ago' }
    ]
  },
  changes: {
    title: 'Change Management',
    description: 'Control infra, deployment, DB, firewall, DNS, SSL, and production changes.',
    apiPath: '/changes',
    primaryAction: 'Create Change',
    aiPrompts: ['Review high risk changes', 'Check missing rollback plans', 'Show changes scheduled this week'],
    stats: [
      { label: 'Scheduled', value: '6', tone: 'bg-indigo-50 text-indigo-700' },
      { label: 'Approval Pending', value: '4', tone: 'bg-amber-50 text-amber-700' },
      { label: 'High Risk', value: '2', tone: 'bg-rose-50 text-rose-700' },
      { label: 'Completed', value: '12', tone: 'bg-emerald-50 text-emerald-700' }
    ],
    columns: ['Change', 'Status', 'Risk', 'Owner', 'Updated'],
    records: [
      { id: 'CHG-4101', title: 'MySQL version upgrade', subtitle: 'UAT database cluster', status: 'UNDER_REVIEW', priority: 'HIGH', owner: 'DBA', updatedAt: '45 min ago' }
    ]
  },
  inventory: {
    title: 'Inventory',
    description: 'Manage laptops, desktops, servers, firewalls, devices, licenses, assignments, repairs, and warranty.',
    apiPath: '/inventory',
    primaryAction: 'Add Asset',
    aiPrompts: ['Show available laptops', 'Show warranty expiring this month', 'Find assets assigned to exited users'],
    stats: [
      { label: 'Total Assets', value: '312', tone: 'bg-indigo-50 text-indigo-700' },
      { label: 'Available', value: '18', tone: 'bg-emerald-50 text-emerald-700' },
      { label: 'Under Repair', value: '7', tone: 'bg-amber-50 text-amber-700' },
      { label: 'Warranty Expiry', value: '4', tone: 'bg-rose-50 text-rose-700' }
    ],
    columns: ['Asset', 'Status', 'Type', 'Owner', 'Updated'],
    records: [
      { id: 'AST-1001', title: 'Dell Latitude 5440', subtitle: 'Serial DL5440-1001', status: 'AVAILABLE', priority: 'Laptop', owner: 'Admin Store', updatedAt: '1 day ago' },
      { id: 'AST-1017', title: 'MacBook Pro 14', subtitle: 'Serial MBP14-1017', status: 'ASSIGNED', priority: 'Laptop', owner: 'Priyanka', updatedAt: '4 days ago' }
    ]
  },
  'access-management': {
    title: 'Access Management',
    description: 'Track VPN, server, database, cloud, Git, client portal, and temporary access approvals.',
    apiPath: '/access-requests',
    primaryAction: 'Request Access',
    aiPrompts: ['Show production access users', 'List temporary access expiring this week', 'Find pending approvals'],
    stats: [
      { label: 'Pending', value: '14', tone: 'bg-amber-50 text-amber-700' },
      { label: 'Provisioned', value: '38', tone: 'bg-emerald-50 text-emerald-700' },
      { label: 'Expiring 7 Days', value: '5', tone: 'bg-rose-50 text-rose-700' },
      { label: 'InfoSec Pending', value: '3', tone: 'bg-indigo-50 text-indigo-700' }
    ],
    columns: ['Request', 'Status', 'Access', 'Owner', 'Updated'],
    records: [
      { id: 'ACR-5001', title: 'AWS production read-only access', subtitle: 'Federal project', status: 'INFOSEC_APPROVAL_PENDING', priority: 'AWS', owner: 'InfoSec', updatedAt: '20 min ago' }
    ]
  },
  compliance: {
    title: 'Compliance',
    description: 'Manage ISO controls, VAPT findings, access reviews, backup evidence, patching, and audit tasks.',
    apiPath: '/compliance-tasks',
    primaryAction: 'Add Control',
    aiPrompts: ['Show overdue compliance', 'Prepare audit summary', 'Find missing evidence'],
    stats: [
      { label: 'Due This Month', value: '11', tone: 'bg-indigo-50 text-indigo-700' },
      { label: 'Overdue', value: '3', tone: 'bg-rose-50 text-rose-700' },
      { label: 'Evidence Pending', value: '5', tone: 'bg-amber-50 text-amber-700' },
      { label: 'Compliant', value: '21', tone: 'bg-emerald-50 text-emerald-700' }
    ],
    columns: ['Control', 'Status', 'Risk', 'Owner', 'Updated'],
    records: [
      { id: 'CMP-Q2-01', title: 'Quarterly access review', subtitle: 'ISO-AC-001', status: 'EVIDENCE_PENDING', priority: 'HIGH', owner: 'InfoSec', updatedAt: 'Today' }
    ]
  },
  'projects-environments': {
    title: 'Projects & Environments',
    description: 'Track client projects, UAT, QA, staging, prod, servers, domains, SSL, backups, and monitoring.',
    apiPath: '/projects',
    primaryAction: 'Add Project',
    aiPrompts: ['Show prod environments without backup', 'List SSL expiring soon', 'Show Federal infra map'],
    stats: [
      { label: 'Projects', value: '24', tone: 'bg-indigo-50 text-indigo-700' },
      { label: 'Prod Envs', value: '31', tone: 'bg-emerald-50 text-emerald-700' },
      { label: 'SSL Expiry', value: '2', tone: 'bg-rose-50 text-rose-700' },
      { label: 'Backup Missing', value: '1', tone: 'bg-amber-50 text-amber-700' }
    ],
    columns: ['Project', 'Status', 'Client', 'Owner', 'Updated'],
    records: [
      { id: 'FED-CCMS', title: 'Federal Bank CCMS', subtitle: 'UAT and Production', status: 'ACTIVE', priority: 'Federal Bank', owner: 'JVS', updatedAt: 'Today' }
    ]
  },
  'vendors-licenses': {
    title: 'Vendors & Licenses',
    description: 'Manage vendors, software licenses, renewals, cost, seats, contracts, and expiry reminders.',
    apiPath: '/vendors',
    primaryAction: 'Add Vendor',
    aiPrompts: ['Show renewals due in 30 days', 'Find unused licenses', 'Prepare vendor cost report'],
    stats: [
      { label: 'Vendors', value: '18', tone: 'bg-indigo-50 text-indigo-700' },
      { label: 'Licenses', value: '42', tone: 'bg-emerald-50 text-emerald-700' },
      { label: 'Renewals 30 Days', value: '4', tone: 'bg-rose-50 text-rose-700' },
      { label: 'Unused Seats', value: '19', tone: 'bg-amber-50 text-amber-700' }
    ],
    columns: ['Vendor', 'Status', 'Category', 'Owner', 'Updated'],
    records: [
      { id: 'VEN-001', title: 'Microsoft', subtitle: 'M365 licenses', status: 'ACTIVE', priority: 'Productivity', owner: 'Admin', updatedAt: '1 week ago' }
    ]
  },
  'reports-analytics': {
    title: 'Reports & Analytics',
    description: 'Generate operational, SLA, asset, incident, compliance, access, and management reports.',
    apiPath: '/reports',
    primaryAction: 'Generate Report',
    aiPrompts: ['Prepare weekly admin report', 'Show SLA trend', 'Create monthly incident summary'],
    stats: [
      { label: 'Saved Reports', value: '16', tone: 'bg-indigo-50 text-indigo-700' },
      { label: 'Scheduled', value: '5', tone: 'bg-emerald-50 text-emerald-700' },
      { label: 'Failed', value: '1', tone: 'bg-rose-50 text-rose-700' },
      { label: 'Exports Today', value: '7', tone: 'bg-amber-50 text-amber-700' }
    ],
    columns: ['Report', 'Status', 'Type', 'Owner', 'Updated'],
    records: [
      { id: 'RPT-9001', title: 'Monthly SLA report', subtitle: 'Service Requests', status: 'READY', priority: 'SLA', owner: 'Delivery', updatedAt: 'Today' }
    ]
  },
  'knowledge-base': {
    title: 'Knowledge Base',
    description: 'Maintain SOPs, fixes, troubleshooting guides, compliance evidence guides, and RCA history.',
    apiPath: '/knowledge-base',
    primaryAction: 'Create Article',
    aiPrompts: ['Find VPN troubleshooting SOP', 'Draft KB from resolved ticket', 'Show outdated articles'],
    stats: [
      { label: 'Published', value: '84', tone: 'bg-emerald-50 text-emerald-700' },
      { label: 'Drafts', value: '12', tone: 'bg-amber-50 text-amber-700' },
      { label: 'Needs Review', value: '7', tone: 'bg-rose-50 text-rose-700' },
      { label: 'Used This Week', value: '31', tone: 'bg-indigo-50 text-indigo-700' }
    ],
    columns: ['Article', 'Status', 'Category', 'Owner', 'Updated'],
    records: [
      { id: 'KB-0001', title: 'VPN basic troubleshooting', subtitle: 'VPN and network', status: 'PUBLISHED', priority: 'VPN', owner: 'Infra', updatedAt: '2 days ago' }
    ]
  },
  'users-teams': {
    title: 'Users & Teams',
    description: 'Manage users, roles, permissions, teams, departments, and module-level access.',
    apiPath: '/users',
    primaryAction: 'Add User',
    aiPrompts: ['Show inactive users with access', 'List Super Admin users', 'Find users without team'],
    stats: [
      { label: 'Users', value: '146', tone: 'bg-indigo-50 text-indigo-700' },
      { label: 'Active', value: '139', tone: 'bg-emerald-50 text-emerald-700' },
      { label: 'Inactive', value: '7', tone: 'bg-rose-50 text-rose-700' },
      { label: 'Roles', value: '9', tone: 'bg-amber-50 text-amber-700' }
    ],
    columns: ['User', 'Status', 'Role', 'Department', 'Updated'],
    records: [
      { id: 'USR-001', title: 'Saven Admin', subtitle: 'admin@saven.in', status: 'ACTIVE', priority: 'Super Admin', owner: 'InfraOps', updatedAt: 'Today' }
    ]
  },
  settings: {
    title: 'Settings',
    description: 'Configure AI provider, login, notifications, SLA, categories, permissions, and system preferences.',
    apiPath: '/settings',
    primaryAction: 'Save Settings',
    aiPrompts: ['Show active AI provider', 'Test Teams notification', 'Review SLA policy'],
    stats: [
      { label: 'AI Provider', value: 'Mock', tone: 'bg-indigo-50 text-indigo-700' },
      { label: 'Email', value: 'Ready', tone: 'bg-emerald-50 text-emerald-700' },
      { label: 'Teams', value: 'Pending', tone: 'bg-amber-50 text-amber-700' },
      { label: 'Microsoft Login', value: 'Config', tone: 'bg-slate-100 text-slate-700' }
    ],
    columns: ['Setting', 'Status', 'Type', 'Owner', 'Updated'],
    records: [
      { id: 'SET-AI', title: 'AI provider switch', subtitle: 'OpenAI, Claude, private model, mock', status: 'CONFIGURED', priority: 'AI', owner: 'Admin', updatedAt: 'Today' }
    ]
  }
};
