import type { AIProvider } from './types.js';

export const mockProvider: AIProvider = {
  key: 'mock',
  async complete({ prompt }) {
    const lower = prompt.toLowerCase();
    const isTicket = lower.includes('service') || lower.includes('ticket') || lower.includes('request');
    const isAsset = lower.includes('asset') || lower.includes('laptop') || lower.includes('inventory');
    const isCompliance = lower.includes('compliance') || lower.includes('audit');

    const cards = isAsset ? [
      { id: 'AST-1001', type: 'asset' as const, title: 'Dell Latitude 5440', subtitle: 'Available laptop, Hyderabad', status: 'AVAILABLE', href: '/inventory?asset=AST-1001' },
      { id: 'AST-1017', type: 'asset' as const, title: 'MacBook Pro 14', subtitle: 'Assigned to Priyanka', status: 'ASSIGNED', href: '/inventory?asset=AST-1017' }
    ] : isCompliance ? [
      { id: 'CMP-APR-01', type: 'compliance' as const, title: 'Quarterly Access Review', subtitle: 'Due in 5 days', status: 'EVIDENCE_PENDING', priority: 'HIGH' as const, href: '/compliance?task=CMP-APR-01' },
      { id: 'CMP-APR-02', type: 'compliance' as const, title: 'Backup Evidence Review', subtitle: '2 projects missing evidence', status: 'OVERDUE', priority: 'CRITICAL' as const, href: '/compliance?task=CMP-APR-02' }
    ] : [
      { id: 'SR-1024', type: 'serviceRequest' as const, title: 'VPN not working for client access', subtitle: 'Federal project, assigned to Infra', status: 'OPEN', priority: 'HIGH' as const, href: '/service-requests?ticket=SR-1024' },
      { id: 'SR-1025', type: 'serviceRequest' as const, title: 'Laptop allocation for new QA', subtitle: 'DGA project onboarding', status: 'ASSIGNED', priority: 'MEDIUM' as const, href: '/service-requests?ticket=SR-1025' }
    ];

    return {
      answer: isTicket
        ? 'There are 42 open service requests. 6 are SLA breached, 3 are critical, and 9 are high priority.'
        : isAsset
          ? 'I found 18 available assets. 7 are laptops ready for allocation, and 4 warranties expire in the next 30 days.'
          : isCompliance
            ? 'There are 11 compliance tasks due this month. 3 are overdue and 5 are waiting for evidence upload.'
            : 'I checked the InfraOps records and prepared the latest operational summary.',
      summary: isAsset
        ? { availableAssets: 18, availableLaptops: 7, warrantyExpiry30Days: 4 }
        : isCompliance
          ? { dueThisMonth: 11, overdue: 3, evidencePending: 5 }
          : { openRequests: 42, breachedSla: 6, critical: 3, high: 9 },
      cards,
      suggestedActions: ['Open full list', 'Export report', 'Send Teams summary', 'Create follow-up task'],
      sources: [{ label: 'Service Requests' }, { label: 'Inventory' }, { label: 'Compliance Tasks' }]
    };
  }
};
