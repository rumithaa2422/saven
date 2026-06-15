import {
  Activity,
  Archive,
  BarChart3,
  BookOpen,
  Boxes,
  ClipboardCheck,
  CloudCog,
  FileWarning,
  Home,
  KeyRound,
  ListChecks,
  Settings,
  ShieldCheck,
  Users,
  Wrench
} from 'lucide-react';

export const navigationItems = [
  { label: 'Command Center', href: '/', icon: Home },
  { label: 'Service Requests', href: '/service-requests', icon: ListChecks },
  { label: 'Incidents', href: '/incidents', icon: FileWarning },
  { label: 'Problems', href: '/problems', icon: Wrench },
  { label: 'Changes', href: '/changes', icon: ClipboardCheck },
  { label: 'Inventory', href: '/inventory', icon: Boxes },
  { label: 'Access Management', href: '/access-management', icon: KeyRound },
  { label: 'Compliance', href: '/compliance', icon: ShieldCheck },
  { label: 'Projects & Environments', href: '/projects-environments', icon: CloudCog },
  { label: 'Vendors & Licenses', href: '/vendors-licenses', icon: Archive },
  { label: 'Reports & Analytics', href: '/reports-analytics', icon: BarChart3 },
  { label: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
  { label: 'Users & Teams', href: '/users-teams', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings }
];

export const quickStats = [
  { label: 'Open Service Requests', value: '42', tone: 'bg-indigo-50 text-indigo-700' },
  { label: 'Critical Incidents', value: '3', tone: 'bg-rose-50 text-rose-700' },
  { label: 'SLA Breaches', value: '6', tone: 'bg-amber-50 text-amber-700' },
  { label: 'Assets Available', value: '18', tone: 'bg-emerald-50 text-emerald-700' }
];
