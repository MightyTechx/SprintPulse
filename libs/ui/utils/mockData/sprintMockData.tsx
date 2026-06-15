/**
 * Sprint Management Mock Data
 * Replaces turbine mock data with sprint/agile data
 */

import { generateMockSprintData } from 'ui/pages/admin/Dashboard';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface SprintData {
  id: number;
  sprintNo: string;
  status: 'active' | 'completed' | 'upcoming' | 'cancelled';
  time: string;
  capacity: number;
  storyPointsCompleted: number;
  sprintProgress: number;
  teamVelocity: number;
  cycleTime: number;
  burndownRate: number;
  startDate: string;
  endDate: string;
  duration: number;
  plannedPoints: number;
  actualPoints: number;
  onTimeDeliveryRate: number;
  plannedVelocity: number;
  actualVelocity: number;
  velocityVariation: number;
  issues: Issue[];
  totalIssues: number;
  activeIssues: number;
  blockedIssues: number;
  completedIssues: number;
  team: {
    lead: string;
    members: string[];
    scrumMaster: string;
    productOwner: string;
  };
  velocityChart: VelocityPoint[];
  burndownChart: BurndownPoint[];
  cumulativeFlow: CumulativeFlowPoint[];
  averageStorySize: number;
  issueResolutionTime: number;
  codeChurn: number;
  testCoverage: number;
  defectDensity: number;
  reworkPercentage: number;
  firstTimeRightPercentage: number;
  dependencies: Dependency[];
  risks: Risk[];
  retrospectives: Retrospective[];
  stakeholders: string[];
}

export interface Issue {
  id: string;
  key: string;
  type: 'story' | 'task' | 'bug' | 'epic' | 'spike' | 'subtask';
  summary: string;
  description: string;
  status: IssueStatus;
  priority: 'lowest' | 'low' | 'medium' | 'high' | 'critical';
  storyPoints: number;
  assignee: string;
  reporter: string;
  creator: string;
  createdDate: string;
  updatedDate: string;
  startDate?: string;
  dueDate?: string;
  resolutionDate?: string;
  project: string;
  projectKey: string;
  sprint: string;
  sprintId: number;
  labels: string[];
  fixVersions: string[];
  timeSpent: number;
  remainingEstimate: number;
  originalEstimate: number;
  resolution?: string;
  subtask?: boolean;
}

export type IssueStatus = 'To Do' | 'In Progress' | 'In Review' | 'In Test' | 'Blocked' | 'Done';

export interface VelocityPoint {
  date: string;
  planned: number;
  actual: number;
  velocity: number;
  efficiency: number;
}

export interface BurndownPoint {
  day: number;
  ideal: number;
  actual: number;
  remaining: number;
}

export interface CumulativeFlowPoint {
  date: string;
  'To Do': number;
  'In Progress': number;
  'In Review': number;
  'In Test': number;
  Blocked: number;
  Done: number;
}

export interface Dependency {
  id: string;
  issue: string;
  dependsOn: string;
  type: 'blocked by' | 'blocks' | 'relates to' | 'duplicates' | 'is duplicated by';
  resolved: boolean;
}

export interface Risk {
  id: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  probability: 'low' | 'medium' | 'high';
  status: 'open' | 'mitigated' | 'closed';
  assignedTo: string;
  dueDate: string;
  mitigation: string;
}

export interface Retrospective {
  id: string;
  sprint: string;
  date: string;
  facilitator: string;
  notes: string;
  actionItems: ActionItem[];
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
}

// ─── Mock Data Generators ─────────────────────────────────────────────────────

export const EMPTY_SPRINTS: Record<string, SprintData> = {};

export const MOCK_SPRINT_DATA: SprintData[] = [
  generateMockSprintData(1),
  generateMockSprintData(2),
  generateMockSprintData(3),
];

export const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    key: 'SPRINT-1',
    type: 'story',
    summary: 'Implement user authentication',
    description: 'Add login functionality with JWT tokens',
    status: 'In Progress',
    priority: 'high',
    storyPoints: 8,
    assignee: 'Alice Johnson',
    reporter: 'Mike Johnson',
    creator: 'Mike Johnson',
    createdDate: '2024-05-01',
    updatedDate: '2024-05-10',
    startDate: '2024-05-01',
    dueDate: '2024-06-14',
    resolutionDate: '2024-05-10',
    project: 'SprintPulse',
    projectKey: 'SPRINT',
    sprint: 'Sprint 1',
    sprintId: 1,
    labels: ['authentication', 'backend'],
    fixVersions: ['Sprint 1'],
    timeSpent: 480,
    remainingEstimate: 0,
    originalEstimate: 480,
    resolution: 'Done',
    subtask: false,
  },
  {
    id: '2',
    key: 'SPRINT-2',
    type: 'bug',
    summary: 'Fix login timeout issue',
    description: 'Users are being logged out too quickly',
    status: 'In Test',
    priority: 'high',
    storyPoints: 3,
    assignee: 'Bob Wilson',
    reporter: 'Carol Davis',
    creator: 'Carol Davis',
    createdDate: '2024-05-02',
    updatedDate: '2024-05-09',
    startDate: '2024-05-02',
    dueDate: '2024-06-14',
    resolutionDate: undefined,
    project: 'SprintPulse',
    projectKey: 'SPRINT',
    sprint: 'Sprint 1',
    sprintId: 1,
    labels: ['bug', 'frontend'],
    fixVersions: ['Sprint 1'],
    timeSpent: 240,
    remainingEstimate: 120,
    originalEstimate: 360,
    resolution: undefined,
    subtask: false,
  },
  {
    id: '3',
    key: 'SPRINT-3',
    type: 'epic',
    summary: 'Dashboard Management',
    description: 'Implement comprehensive dashboard features',
    status: 'To Do',
    priority: 'medium',
    storyPoints: 0,
    assignee: 'John Smith',
    reporter: 'Mike Johnson',
    creator: 'Mike Johnson',
    createdDate: '2024-05-01',
    updatedDate: '2024-05-01',
    project: 'SprintPulse',
    projectKey: 'SPRINT',
    sprint: 'Sprint 2',
    sprintId: 2,
    labels: ['epic', 'dashboard'],
    fixVersions: ['Sprint 2'],
    timeSpent: 0,
    remainingEstimate: 0,
    originalEstimate: 0,
    subtask: false,
  },
];

export const ISSUE_TYPES: Issue['type'][] = ['story', 'task', 'bug', 'epic', 'spike'];

export const PRIORITY_OPTIONS: Issue['priority'][] = [
  'lowest',
  'low',
  'medium',
  'high',
  'critical',
];

export const STATUS_OPTIONS: IssueStatus[] = [
  'To Do',
  'In Progress',
  'In Review',
  'In Test',
  'Blocked',
  'Done',
];

export const SPRINT_OPTIONS = ['Sprint 1', 'Sprint 2', 'Sprint 3'];

export const EMPTY_ISSUES: Record<string, Issue> = {};

// Helper function to map sprint to team
export const SPRINT_TEAMS: Record<string, string[]> = {
  'Sprint 1': ['Frontend Team', 'Backend Team', 'QA Team'],
  'Sprint 2': ['API Team', 'Mobile Team', 'DevOps Team'],
  'Sprint 3': ['UX Team', 'Security Team', 'Infrastructure Team'],
};

// Helper function to get sprint status colors
export const SPRINT_COLORS = {
  active: '#10b981',
  completed: '#3b82f6',
  upcoming: '#8b5cf6',
  cancelled: '#ef4444',
};
