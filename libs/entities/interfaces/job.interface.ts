// Job-related interfaces and types

export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'needs_attention';

export type JobPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface IJob {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  priority: JobPriority;
  assignee: string;
  progress?: number;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const JOB_STATUS_CONFIG: Record<
  JobStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: 'Pending',
    color: '#64748b',
    bgColor: 'rgba(100, 116, 139, 0.1)',
  },
  in_progress: {
    label: 'In Progress',
    color: '#2563eb',
    bgColor: 'rgba(37, 99, 235, 0.1)',
  },
  completed: {
    label: 'Completed',
    color: '#16a34a',
    bgColor: 'rgba(22, 163, 74, 0.1)',
  },
  failed: {
    label: 'Failed',
    color: '#dc2626',
    bgColor: 'rgba(220, 38, 38, 0.1)',
  },
  needs_attention: {
    label: 'Needs Attention',
    color: '#ea580c',
    bgColor: 'rgba(234, 88, 12, 0.1)',
  },
};

export const JOB_PRIORITY_COLORS: Record<JobPriority, string> = {
  low: '#64748b',
  medium: '#2563eb',
  high: '#ea580c',
  urgent: '#dc2626',
};
