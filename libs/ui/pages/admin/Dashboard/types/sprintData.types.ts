// Sprint Management Data Interfaces
export interface SprintData {
  id: number;
  sprintNo: string;
  status: 'active' | 'completed' | 'upcoming' | 'cancelled';
  time: string;
  capacity: number; // Story points capacity

  // Core Performance
  storyPointsCompleted: number; // Points
  sprintProgress: number; // %
  teamVelocity: number; // Points/day
  cycleTime: number; // Days
  burndownRate: number; // Points/day

  // Sprint Details
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  duration: number; // Days
  plannedPoints: number;
  actualPoints: number;
  onTimeDeliveryRate: number; // %

  // Velocity Analytics
  plannedVelocity: number;
  actualVelocity: number;
  velocityVariation: number; // %

  // Issue Tracking
  issues: Issue[];
  totalIssues: number;
  activeIssues: number;
  blockedIssues: number;
  completedIssues: number;

  // Team Metrics
  team: {
    lead: string;
    members: string[];
    scrumMaster: string;
    productOwner: string;
  };

  // Sprint Health
  velocityChart: VelocityPoint[];
  burndownChart: BurndownPoint[];
  cumulativeFlow: CumulativeFlowPoint[];

  // Process Metrics
  averageStorySize: number; // Points
  issueResolutionTime: number; // Hours
  codeChurn: number; // Lines changed
  testCoverage: number; // %

  // Quality Metrics
  defectDensity: number; // Defects per KLOC
  reworkPercentage: number; // %
  firstTimeRightPercentage: number; // %

  // Release Metrics
  releaseDate?: string;
  releaseVersion?: string;
  releaseNotes?: string;

  // Advanced Tracking
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
  reporterAvatar?: string;
  assigneeAvatar?: string;
  creatorAvatar?: string;

  // Dates
  createdDate: string;
  updatedDate: string;
  startDate?: string;
  dueDate?: string;
  resolutionDate?: string;

  // Fields
  project: string;
  projectKey: string;
  sprint: string;
  sprintId: number;
  parent?: string;
  epic?: string;
  labels: string[];
  components: string[];
  versions: string[];
  fixVersions: string[];

  // Work Log
  timeSpent: number; // Minutes
  remainingEstimate: number; // Minutes
  originalEstimate: number; // Minutes

  // Transitions
  transitions: Transition[];
  changeLog: ChangeLog[];

  // Attachments
  attachments: Attachment[];
  comments: Comment[];

  // Subtasks
  subtasks: Issue[];

  // Relations
  links: IssueLink[];
  blockers: Blocker[];

  // Custom Fields
  customFields: Record<string, any>;

  // Status Fields
  resolution?: string;
  statusCategory: 'to do' | 'in progress' | 'in review' | 'done';
  statusCategoryChanged: string;
  subtask?: boolean;
  aggregationLevel: 1 | 2 | 3;
  epicLink?: string;
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
  closureDate?: string;
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

export interface Transition {
  from: string;
  to: string;
  date: string;
  author: string;
  comment?: string;
}

export interface ChangeLog {
  author: string;
  created: string;
  field: string;
  from: string;
  to: string;
}

export interface Attachment {
  id: string;
  filename: string;
  size: number;
  created: string;
  author: string;
  content?: string;
  thumbnail?: string;
}

export interface Comment {
  id: string;
  author: string;
  created: string;
  updated: string;
  body: string;
  visibility?: { role: string };
}

export interface IssueLink {
  id: string;
  type: string;
  inwardIssue: { key: string };
  outwardIssue: { key: string };
  comment?: string;
}

export interface Blocker {
  id: string;
  issue: string;
  blocker: string;
  type: 'dependency' | 'resource' | 'skill' | 'external';
  assignedTo: string;
  resolved: boolean;
  resolutionDate?: string;
}

// Issue Status Configuration
export const ISSUE_STATUS_CONFIG: Record<
  IssueStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  'To Do': {
    label: 'To Do',
    color: '#64748b',
    bgColor: 'rgba(100,116,139,0.15)',
    borderColor: 'rgba(100,116,139,0.4)',
  },
  'In Progress': {
    label: 'In Progress',
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.15)',
    borderColor: 'rgba(59,130,246,0.4)',
  },
  'In Review': {
    label: 'In Review',
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.15)',
    borderColor: 'rgba(139,92,246,0.4)',
  },
  'In Test': {
    label: 'In Test',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.15)',
    borderColor: 'rgba(245,158,11,0.4)',
  },
  Blocked: {
    label: 'Blocked',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.4)',
  },
  Done: {
    label: 'Done',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.15)',
    borderColor: 'rgba(16,185,129,0.4)',
  },
};

// Sprint Status Configuration
export const SPRINT_STATUS_CONFIG: Record<
  SprintData['status'],
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  active: {
    label: 'Active',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.15)',
    borderColor: 'rgba(16,185,129,0.4)',
  },
  completed: {
    label: 'Completed',
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.15)',
    borderColor: 'rgba(59,130,246,0.4)',
  },
  upcoming: {
    label: 'Upcoming',
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.15)',
    borderColor: 'rgba(139,92,246,0.4)',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.4)',
  },
};

// Issue Type Configuration
export const ISSUE_TYPE_CONFIG: Record<
  Issue['type'],
  { label: string; color: string; icon: string }
> = {
  story: {
    label: 'Story',
    color: '#3b82f6',
    icon: '📝',
  },
  task: {
    label: 'Task',
    color: '#64748b',
    icon: '✓',
  },
  bug: {
    label: 'Bug',
    color: '#ef4444',
    icon: '🐛',
  },
  epic: {
    label: 'Epic',
    color: '#8b5cf6',
    icon: '🏗️',
  },
  spike: {
    label: 'Spike',
    color: '#f59e0b',
    icon: '🚀',
  },
  subtask: {
    label: 'Sub-task',
    color: '#64748b',
    icon: '➡️',
  },
};

// Priority Configuration
export const PRIORITY_CONFIG: Record<
  Issue['priority'],
  { label: string; color: string; bgColor: string }
> = {
  lowest: {
    label: 'Lowest',
    color: '#64748b',
    bgColor: 'rgba(100,116,139,0.1)',
  },
  low: {
    label: 'Low',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.1)',
  },
  medium: {
    label: 'Medium',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.1)',
  },
  high: {
    label: 'High',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.1)',
  },
  critical: {
    label: 'Critical',
    color: '#991b1b',
    bgColor: 'rgba(153,27,27,0.1)',
  },
};

// Risk Configuration
export const RISK_CONFIG: Record<
  Risk['impact'] | Risk['probability'],
  { label: string; color: string }
> = {
  low: {
    label: 'Low',
    color: '#10b981',
  },
  medium: {
    label: 'Medium',
    color: '#f59e0b',
  },
  high: {
    label: 'High',
    color: '#ef4444',
  },
};

// Export mock data generator
export function generateMockSprintData(sprintId: number): SprintData {
  return {
    id: sprintId,
    sprintNo: `S${String(sprintId).padStart(2, '0')}`,
    status: 'active',
    time: new Date().toLocaleTimeString(),
    capacity: 50,
    storyPointsCompleted: 32,
    sprintProgress: 64,
    teamVelocity: 6.4,
    cycleTime: 3.2,
    burndownRate: 2.1,
    startDate: '2024-06-01',
    endDate: '2024-06-14',
    duration: 14,
    plannedPoints: 50,
    actualPoints: 32,
    onTimeDeliveryRate: 87.5,
    plannedVelocity: 7.1,
    actualVelocity: 6.4,
    velocityVariation: -9.9,
    issues: [],
    totalIssues: 24,
    activeIssues: 16,
    blockedIssues: 3,
    completedIssues: 8,
    team: {
      lead: 'John Smith',
      members: ['Alice Johnson', 'Bob Wilson', 'Carol Davis', 'David Brown'],
      scrumMaster: 'Sarah Miller',
      productOwner: 'Mike Johnson',
    },
    velocityChart: [],
    burndownChart: [],
    cumulativeFlow: [],
    averageStorySize: 4,
    issueResolutionTime: 18,
    codeChurn: 1200,
    testCoverage: 85,
    defectDensity: 0.5,
    reworkPercentage: 12,
    firstTimeRightPercentage: 88,
    dependencies: [],
    risks: [],
    retrospectives: [],
    stakeholders: ['Engineering', 'Product', 'QA', 'DevOps'],
  };
}

// Ticket interface for backward compatibility
export type TicketStatus = 'To Do' | 'In Progress' | 'In Review' | 'Blocked' | 'In Test' | 'Done';

export interface Ticket {
  id: number;
  team: string;
  assignee: string;
  issueType: 'Story' | 'Task' | 'Bug' | 'Epic' | 'Spike';
  issueNo: string;
  summary: string;
  timeLoggingId: string;
  status: TicketStatus;
  storyPoints: number;
  fixVersion: string;
  carryForward: string;
  carryForwardReason: string;
  workStartDate: string;
  workEndDate: string;
  ticketLink: string;
}

export const TICKET_STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  'To Do': {
    label: 'To Do',
    color: '#64748b',
    bgColor: 'rgba(100,116,139,0.15)',
    borderColor: 'rgba(100,116,139,0.4)',
  },
  'In Progress': {
    label: 'In Progress',
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.15)',
    borderColor: 'rgba(59,130,246,0.4)',
  },
  'In Review': {
    label: 'In Review',
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.15)',
    borderColor: 'rgba(139,92,246,0.4)',
  },
  Blocked: {
    label: 'Blocked',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.4)',
  },
  'In Test': {
    label: 'In Test',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.15)',
    borderColor: 'rgba(245,158,11,0.4)',
  },
  Done: {
    label: 'Done',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.15)',
    borderColor: 'rgba(16,185,129,0.4)',
  },
};

// Sprint task categories (replaces turbine components)
export interface SprintTaskCategory {
  id: string;
  name: string;
  category: 'planning' | 'development' | 'quality' | 'review' | 'deployment' | 'risk';
  description: string;
  color: string;
  status: IssueStatus;
  taskCount: number;
  completedCount: number;
  avgCompletionTime: number;
  blockingIssues: number;
}

export const SPRINT_TASK_CATEGORIES: SprintTaskCategory[] = [
  {
    id: 'backlog',
    name: 'Backlog',
    category: 'planning',
    description: 'Items in the product backlog waiting for sprint planning',
    color: '#64748b',
    status: 'To Do',
    taskCount: 12,
    completedCount: 0,
    avgCompletionTime: 0,
    blockingIssues: 0,
  },
  {
    id: 'in-progress',
    name: 'In Progress',
    category: 'development',
    description: 'Currently being worked on by team members',
    color: '#3b82f6',
    status: 'In Progress',
    taskCount: 8,
    completedCount: 0,
    avgCompletionTime: 2.5,
    blockingIssues: 1,
  },
  {
    id: 'review',
    name: 'In Review',
    category: 'review',
    description: 'Code review stage before merging',
    color: '#8b5cf6',
    status: 'In Review',
    taskCount: 5,
    completedCount: 0,
    avgCompletionTime: 1.2,
    blockingIssues: 0,
  },
  {
    id: 'testing',
    name: 'In Test',
    category: 'quality',
    description: 'Being tested for quality assurance',
    color: '#f59e0b',
    status: 'In Test',
    taskCount: 4,
    completedCount: 0,
    avgCompletionTime: 0.8,
    blockingIssues: 0,
  },
  {
    id: 'blocked',
    name: 'Blocked',
    category: 'risk',
    description: 'Issues blocking progress',
    color: '#ef4444',
    status: 'Blocked',
    taskCount: 3,
    completedCount: 0,
    avgCompletionTime: 3.1,
    blockingIssues: 3,
  },
  {
    id: 'done',
    name: 'Done',
    category: 'deployment',
    description: 'Completed and ready for release',
    color: '#10b981',
    status: 'Done',
    taskCount: 18,
    completedCount: 18,
    avgCompletionTime: 1.5,
    blockingIssues: 0,
  },
];

// Sprint category colors
export const SPRINT_CATEGORY_COLORS: Record<
  string,
  { color: string; bgColor: string; borderColor: string; glowColor?: string }
> = {
  planning: {
    color: '#64748b',
    bgColor: 'rgba(100,116,139,0.15)',
    borderColor: 'rgba(100,116,139,0.4)',
  },
  development: {
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.15)',
    borderColor: 'rgba(59,130,246,0.4)',
  },
  quality: {
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.15)',
    borderColor: 'rgba(245,158,11,0.4)',
  },
  review: {
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.15)',
    borderColor: 'rgba(139,92,246,0.4)',
  },
  deployment: {
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.15)',
    borderColor: 'rgba(16,185,129,0.4)',
  },
  risk: {
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.4)',
    glowColor: 'rgba(239,68,68,0.5)',
  },
};

// Legacy interface for backward compatibility
// TODO: Remove after complete migration to SprintData
export interface TurbineData {
  id: number;
  turbineNo: string;
  status: 'running' | 'stopped' | 'maintenance' | 'fault' | 'standby';
  time: string;
  capacity: number;
  activePower: number;
  windSpeed: number;
  windDirection: number;
  outdoorTemp: number;
  todayGeneration: number;
  totalProduction: number;
  totalOperatingHours: number;
  operationHoursToday: number;
  rotorRpm: number;
  gearSpeed: number;
  generatorRpm: number;
  generatorTemp: number;
  generatorWindingTempU: number;
  generatorWindingTempV: number;
  generatorWindingTempW: number;
  nacellePosition: number;
  nacelleTemp: number;
  gearboxTemp: number;
  gearOilSumpTemp: number;
  gearOilPressure: number;
  pitchAngle: number;
  hydraulicPressure: number;
  transformerTemp: number;
  trfWindingTempU: number;
  trfWindingTempV: number;
  trfWindingTempW: number;
  tempSwCabHub: number;
  tempSwCabNacelle: number;
  tempSwCabTower: number;
  hubExhaustTemp: number;
  coolantInletPressure: number;
  coolantOutletPressure: number;
  coolCnvHeatExIn: number;
  coolCnvHeatExOut: number;
  coolTrfHeatExIn: number;
  cableWinding: number;
  relativeWindDirection: number;
  towerOscillationX: number;
  towerOscillationY: number;
  apparentPower: number;
  reactivePower: number;
  currentL1: number;
  currentL2: number;
  currentL3: number;
  voltageL1: number;
  voltageL2: number;
  voltageL3: number;
  pitchCylinder1: number;
  pitchCylinder2: number;
  pitchCylinder3: number;
  totalProductionHours: number;
  powerFactor: number;
  powerFrequency: number;
  operatingMode: string;
  breakProgramme: string;
  scadaStatus: 'NOMINAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE' | 'MAINTENANCE';
  availability: number;
  capacityFactor: number;
}

export type TurbineStatus = TurbineData['status'];
export type ScadaStatus = TurbineData['scadaStatus'];

export const STATUS_CONFIG: Record<
  TurbineStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  running: {
    label: 'Running',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.15)',
    borderColor: 'rgba(16,185,129,0.4)',
  },
  stopped: {
    label: 'Stopped',
    color: '#64748b',
    bgColor: 'rgba(100,116,139,0.15)',
    borderColor: 'rgba(100,116,139,0.4)',
  },
  maintenance: {
    label: 'Maintenance',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.15)',
    borderColor: 'rgba(245,158,11,0.4)',
  },
  fault: {
    label: 'Fault',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.4)',
  },
  standby: {
    label: 'Standby',
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.15)',
    borderColor: 'rgba(139,92,246,0.4)',
  },
};

export const SCADA_STATUS_CONFIG: Record<
  ScadaStatus,
  { label: string; color: string; bgColor: string; borderColor: string; glowColor: string }
> = {
  NOMINAL: {
    label: 'NOMINAL',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.15)',
    borderColor: 'rgba(16,185,129,0.4)',
    glowColor: 'rgba(16,185,129,0.5)',
  },
  WARNING: {
    label: 'WARNING',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.15)',
    borderColor: 'rgba(245,158,11,0.4)',
    glowColor: 'rgba(245,158,11,0.5)',
  },
  CRITICAL: {
    label: 'CRITICAL',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.4)',
    glowColor: 'rgba(239,68,68,0.5)',
  },
  OFFLINE: {
    label: 'OFFLINE',
    color: '#64748b',
    bgColor: 'rgba(100,116,139,0.15)',
    borderColor: 'rgba(100,116,139,0.4)',
    glowColor: 'rgba(100,116,139,0.5)',
  },
  MAINTENANCE: {
    label: 'MAINTENANCE',
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.15)',
    borderColor: 'rgba(139,92,246,0.4)',
    glowColor: 'rgba(139,92,246,0.5)',
  },
};

// Legacy component interface for backward compatibility
export interface ComponentDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  position: [number, number, number];
  color: string;
  emissiveColor: string;
  telemetry: string[];
}

export const COMPONENT_CATEGORIES = [
  {
    id: 'planning',
    label: 'Planning',
    icon: '📋',
    color: '#64748b',
  },
  {
    id: 'development',
    label: 'Development',
    icon: '💻',
    color: '#3b82f6',
  },
  {
    id: 'quality',
    label: 'Quality',
    icon: '🧪',
    color: '#f59e0b',
  },
  {
    id: 'review',
    label: 'Review',
    icon: '👁️',
    color: '#8b5cf6',
  },
  {
    id: 'deployment',
    label: 'Deployment',
    icon: '🚀',
    color: '#10b981',
  },
  {
    id: 'risk',
    label: 'Risk',
    icon: '⚠️',
    color: '#ef4444',
  },
];
