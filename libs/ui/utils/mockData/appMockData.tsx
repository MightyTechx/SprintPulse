/**
 * Application Mock Data
 *
 * Centralized mock data for non-sprint features:
 * - Feature flags
 * - Help & Support (FAQ, quick links, chat suggestions)
 * - Reports
 * - Sprint list / colors / date constants / selectors
 *
 * Sprint-specific mock data lives in `./sprintMockData.tsx`.
 */

import React, { useState } from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import dayjs from 'dayjs';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface FeatureFlagData {
  id: number;
  name: string;
  key: string;
  description: string;
  environment: string;
  status: 'Enabled' | 'Disabled';
  roles: string[];
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface FaqCategoryData {
  category: string;
  icon: string;
  questions: { q: string; a: string }[];
}

export interface QuickLinkData {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

// ─── Feature Flags ────────────────────────────────────────────────────────────

export const MOCK_FEATURE_FLAGS: FeatureFlagData[] = [
  {
    id: 1,
    name: 'Enable Dark Mode',
    key: 'enable_dark_mode',
    description: 'Dark mode theme for the admin dashboard',
    environment: 'Development',
    status: 'Disabled',
    roles: ['Admin'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'AI Chatbot',
    key: 'ai_chatbot',
    description: 'Enable AI chatbot assistance for support',
    environment: 'Production',
    status: 'Enabled',
    roles: ['Admin', 'Consultant'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-03-15T14:30:00Z',
  },
  {
    id: 3,
    name: 'Export Reports',
    key: 'export_reports',
    description: 'Allow users to export reports in PDF, Excel, SVG formats',
    environment: 'Production',
    status: 'Enabled',
    roles: ['Admin'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-02-10T16:00:00Z',
  },
  {
    id: 4,
    name: 'Advanced Analytics',
    key: 'advanced_analytics',
    description: 'Show advanced charts and analytics on dashboard',
    environment: 'Development',
    status: 'Enabled',
    roles: ['Admin'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 5,
    name: 'Consultant Reports Access',
    key: 'consultant_reports',
    description: 'Allow consultants to view sprint reports',
    environment: 'Production',
    status: 'Enabled',
    roles: ['Admin', 'Consultant'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-02-20T09:30:00Z',
    updatedAt: '2026-03-05T11:00:00Z',
  },
  {
    id: 6,
    name: 'Maintenance Notifications',
    key: 'maint_notifications',
    description: 'Send push notifications for scheduled maintenance',
    environment: 'Production',
    status: 'Enabled',
    roles: ['Admin'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-10T15:00:00Z',
  },
  {
    id: 7,
    name: 'Sprint Configuration',
    key: 'sprint_config_wizard',
    description: 'Step-by-step wizard for sprint configuration',
    environment: 'Development',
    status: 'Disabled',
    roles: ['Admin'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-03-10T14:00:00Z',
    updatedAt: '2026-03-10T14:00:00Z',
  },
  {
    id: 8,
    name: 'PDF Report Templates',
    key: 'pdf_templates',
    description: 'Custom PDF templates for reports',
    environment: 'Development',
    status: 'Disabled',
    roles: ['Admin'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-03-15T09:00:00Z',
    updatedAt: '2026-03-15T09:00:00Z',
  },
];

// ─── Help & Support ───────────────────────────────────────────────────────────

export const FAQ_DATA: FaqCategoryData[] = [
  {
    category: 'Getting Started',
    icon: '🚀',
    questions: [
      {
        q: 'How do I access the admin dashboard?',
        a: 'Navigate to the Dashboard from the sidebar menu. The dashboard provides an overview of all sprints, their status, velocity metrics, and real-time progress data.',
      },
      {
        q: 'What are the different user roles available?',
        a: 'The system supports Admin and Member roles. Admins have full access to all features including configuration, reports, and user management. Members have access based on enabled feature flags and sprint participation.',
      },
      {
        q: 'How do I configure sprint parameters?',
        a: 'Go to Sprint Configuration from the sidebar to view and modify sprint parameters. You can update sprint durations, capacity, story point thresholds, and team configurations.',
      },
    ],
  },
  {
    category: 'Reports & Analytics',
    icon: '📊',
    questions: [
      {
        q: 'How do I generate a sprint report?',
        a: 'Navigate to Reports from the sidebar. Select your date range, filter by sprints, and click Generate Report. You can export reports in various formats.',
      },
      {
        q: 'What data is included in the velocity report?',
        a: 'Velocity reports include actual vs planned story points, velocity trends across sprints, burndown data, and team performance metrics.',
      },
      {
        q: 'Can I schedule automated reports?',
        a: 'Yes, you can set up scheduled report generation from the Reports page. Configure the frequency, recipients, and report format for automated delivery.',
      },
    ],
  },
  {
    category: 'Inventory Management',
    icon: '📦',
    questions: [
      {
        q: 'How do I track inventory items?',
        a: 'Use the Inventory Management section to add, update, and track parts and equipment. Each item can be tagged with categories, locations, and stock levels.',
      },
      {
        q: 'How do I set low-stock alerts?',
        a: 'Set threshold values for each inventory item. When stock falls below the threshold, you will receive notifications in the dashboard and via email.',
      },
    ],
  },
  {
    category: 'Technical Support',
    icon: '🔧',
    questions: [
      {
        q: 'How do I contact technical support?',
        a: 'You can reach our technical support team via email at support@sprintpulse.tech or call us during business hours. The Chat Bot is also available 24/7 for immediate assistance.',
      },
      {
        q: 'What information should I include in a support ticket?',
        a: 'Include the sprint ID, ticket key, error code if any, steps to reproduce the issue, and screenshots if available. This helps our team resolve issues faster.',
      },
      {
        q: 'How long does it take to get a response?',
        a: 'Critical issues are addressed within 2 hours. Standard support requests are typically resolved within 24 business hours.',
      },
    ],
  },
];

export const QUICK_LINKS: QuickLinkData[] = [
  {
    icon: <DescriptionIcon />,
    title: 'Documentation',
    description: 'Comprehensive guides and API references',
    color: '#4f46e5',
    bgColor: 'rgba(79,70,229,0.08)',
  },
  {
    icon: <VideoLibraryIcon />,
    title: 'Video Tutorials',
    description: 'Step-by-step setup and feature walkthroughs',
    color: '#0891b2',
    bgColor: 'rgba(8,145,178,0.08)',
  },
  {
    icon: <ConfirmationNumberIcon />,
    title: 'Submit Ticket',
    description: 'Create a support ticket for specific issues',
    color: '#059669',
    bgColor: 'rgba(5,150,105,0.08)',
  },
  {
    icon: <LiveHelpIcon />,
    title: 'Live Chat',
    description: 'Chat with our support team in real-time',
    color: '#d97706',
    bgColor: 'rgba(217,119,6,0.08)',
  },
];

export const CHAT_SUGGESTIONS = [
  { icon: '💡', text: 'Show sprint status' },
  { icon: '⚡', text: 'How to improve team velocity?' },
  { icon: '📅', text: 'Sprint plan for this week' },
  { icon: '🔧', text: 'Common sprint blockers and solutions' },
];

// ─── Report Types ─────────────────────────────────────────────────────────────

export const REPORT_TYPES = [
  'Daily Sprint Report',
  'Weekly Sprint Report',
  'Monthly Sprint Report',
  'Velocity Trends',
  'Time Series',
  'Multi-Time Analysis (Time Series)',
  'Multi-Scatter 2×2 Pairwise',
  'Heat Map',
  'Day-Wise Maximum',
  'Day-Wise Average',
  'Burndown Chart',
  'Velocity Trend',
  'Sprint Generation',
  'Status Timeline',
  'Event Log',
  'Cycle Time Analysis',
  'Sprint Capacity',
  'Trace Files',
];

// ─── Date Constants ───────────────────────────────────────────────────────────

export const MIN_DATE = dayjs('2026-01-01');
export const MAX_DATE = dayjs().startOf('day');

// ─── Squad / Sprint Lists ─────────────────────────────────────────────────────

export const SQUAD_LIST = ['Frontend', 'Backend', 'QA', 'DevOps', 'Design'];

export const SQUAD_IDS = [
  's01',
  's02',
  's03',
  's04',
  's05',
  's06',
  's07',
  's08',
  's09',
  's10',
] as const;

export const SELECT_ALL_KEY = '__select_all__';

export const DOC_TYPES = [
  { value: 'pdf' as const, label: 'PDF' },
  { value: 'xlsx' as const, label: 'Excel (XLSX)' },
  { value: 'pptx' as const, label: 'PowerPoint (PPTX)' },
];

// ─── Color Constants ──────────────────────────────────────────────────────────

export const SQUAD_COLORS = [
  '#6366f1',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#f97316',
  '#0d9488',
  '#3b82f6',
  '#ec4899',
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Hook to use mock feature flags
 * Replace with actual API hook when ready:
 *
 * import { useGetFeatureFlagsQuery } from '@sprintpulse/services';
 * const { data: flags = [] } = useGetFeatureFlagsQuery();
 */
export const useMockFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlagData[]>(MOCK_FEATURE_FLAGS);

  return { data: flags, isLoading: false, isError: false };
};
