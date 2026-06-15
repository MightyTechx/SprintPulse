import { Dayjs } from 'dayjs';
import { MIN_DATE, MAX_DATE, SELECT_ALL_KEY, DOC_TYPES } from '../../../../utils/mockData';

// ─── Report Types ────────────────────────────────────────────────────────────

export const REPORT_TYPES = [
  'Daily Status Report',
  'Weekly Status Report',
  'Monthly Status Report',
];

export { MIN_DATE, MAX_DATE, SELECT_ALL_KEY, DOC_TYPES };

// ─── Document Export Types ───────────────────────────────────────────────────

export type DocType = 'pdf' | 'xlsx' | 'pptx';

export interface DocTypeOption {
  value: DocType;
  label: string;
}

// ─── Incident Log (Jira-style) ───────────────────────────────────────────────

export type IncidentStatus = 'Open' | 'In Progress' | 'In Review' | 'Blocked' | 'Testing' | 'Done';

export interface IncidentRow {
  id: number;
  team: string;
  assignee: string;
  assignedTo: string;
  incidentNumber: string;
  fromDate: string;
  toDate: string;
  issue: string;
  totalHours: string;
  status: IncidentStatus;
}

export interface IncidentStatusConfig {
  bg: string;
  color: string;
  border: string;
}

export const INCIDENT_STATUS_CONFIG: Record<IncidentStatus, IncidentStatusConfig> = {
  Open: { bg: 'rgba(100,116,139,0.1)', color: '#64748b', border: 'rgba(100,116,139,0.3)' },
  'In Progress': { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'rgba(59,130,246,0.35)' },
  'In Review': { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: 'rgba(139,92,246,0.35)' },
  Blocked: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.35)' },
  Testing: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.35)' },
  Done: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.35)' },
};

const ASSIGNEES = [
  'Aarav Sharma',
  'Priya Iyer',
  'Rahul Verma',
  'Sneha Kapoor',
  'Manoj Patel',
  'Karthik Reddy',
  'Neha Gupta',
  'Rohan Mehta',
  'Anika Joshi',
  'Vikram Singh',
  'Ishaan Khanna',
];

const formatHours = (h: number): string => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
};

const formatDateTime = (d: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// ─── Agile / Scrum Report Data ────────────────────────────────────────────────

export type AgileReportType =
  | 'Daily Status Report'
  | 'Weekly Status Report'
  | 'Monthly Status Report';

export interface AgileReportRow {
  id: number;
  team: string;
  sprint: string;
  totalStoryPoints: number;
  totalCompletedStories: number;
  totalCarryForward: number;
}

export const AGILE_TEAM_NAMES = [
  'Team Alpha',
  'Team Beta',
  'Team Gamma',
  'Team Delta',
  'Team Epsilon',
  'Team Zeta',
  'Team Eta',
  'Team Theta',
  'Team Iota',
  'Team Kappa',
];

export const ALL_TEAMS = 'All Teams';

const ISSUES: Array<{ title: string; status: IncidentStatus; hours: number }> = [
  { title: 'Login fails on Safari 17 after cookie expiry', status: 'In Progress', hours: 6.5 },
  { title: 'Auth refresh-token race condition', status: 'Blocked', hours: 12 },
  { title: 'Dashboard chart blank on Firefox 124', status: 'Done', hours: 3 },
  { title: 'Sprint board pagination jumps on filter', status: 'In Progress', hours: 4.25 },
  { title: 'Webhook payload 502 from staging', status: 'Open', hours: 1.5 },
  { title: 'Null pointer in notification dispatcher', status: 'Blocked', hours: 8 },
  { title: 'CI pipeline flaking on iOS snapshot tests', status: 'In Progress', hours: 9.75 },
  { title: 'A11y: missing aria-label on nav drawer', status: 'Done', hours: 1 },
  { title: 'Memory leak in websocket reconnect loop', status: 'Blocked', hours: 22.5 },
  { title: 'CSV export truncates long issue titles', status: 'In Progress', hours: 2 },
  { title: 'Date picker locale not honouring IST', status: 'Open', hours: 0.5 },
  { title: 'Permission check bypass for guest viewers', status: 'Blocked', hours: 5.5 },
  { title: 'Slow query on backlog filter >5k items', status: 'In Progress', hours: 11 },
  { title: 'Stale data on /reports after cache flush', status: 'Done', hours: 2.75 },
  { title: 'Avatar upload rejects files >2MB silently', status: 'Open', hours: 1 },
];

export const getIncidentRows = (): IncidentRow[] => {
  const now = new Date();
  return ISSUES.map((issue, idx) => {
    const team = AGILE_TEAM_NAMES[idx % AGILE_TEAM_NAMES.length];
    const assignee = ASSIGNEES[idx % ASSIGNEES.length];
    const assignedTo = ASSIGNEES[(idx + 3) % ASSIGNEES.length];
    const incidentNumber = `INC-${(1042 + idx).toString()}`;
    const fromDate = new Date(now.getTime() - (ISSUES.length - idx) * 6 * 3600_000);
    const toDate = new Date(fromDate.getTime() + Math.max(1, Math.round(issue.hours)) * 3600_000);
    return {
      id: idx + 1,
      team,
      assignee,
      assignedTo,
      incidentNumber,
      fromDate: formatDateTime(fromDate),
      toDate: formatDateTime(toDate),
      issue: issue.title,
      totalHours: formatHours(issue.hours),
      status: issue.status,
    };
  });
};

const buildSprintLabel = (
  reportType: AgileReportType,
  fromDate: Dayjs,
  toDate: Dayjs,
  teamIndex: number,
): string => {
  switch (reportType) {
    case 'Daily Status Report':
      return `Sprint ${teamIndex + 1} - ${fromDate.format('DD MMM YYYY')}`;
    case 'Weekly Status Report': {
      const d = fromDate.toDate();
      const target = new Date(d.valueOf());
      const dayNr = (d.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNr + 3);
      const firstThursday = new Date(target.getFullYear(), 0, 4);
      const diff = (target.valueOf() - firstThursday.valueOf()) / 86400000;
      const weekNum = 1 + Math.round((diff - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);
      return `Sprint ${teamIndex + 1} - Week ${weekNum} (${fromDate.format('DD MMM')} → ${toDate.format('DD MMM')})`;
    }
    case 'Monthly Status Report':
      return `Sprint ${teamIndex + 1} - ${fromDate.format('MMM YYYY')}`;
    default:
      return `Sprint ${teamIndex + 1}`;
  }
};

export const getAgileReportRows = (
  reportType: AgileReportType,
  fromDate: Dayjs | null,
  toDate: Dayjs | null,
  teams: string[] = AGILE_TEAM_NAMES,
): AgileReportRow[] => {
  const safeFrom = (fromDate ?? toDate) as Dayjs;
  const safeTo = (toDate ?? fromDate ?? safeFrom) as Dayjs;

  return teams.map((team, idx) => {
    const seed = Math.floor(safeFrom.valueOf() / 86_400_000) + idx * 7;
    const totalStoryPoints = 30 + ((seed * 13) % 41);
    const totalCompletedStories = 4 + ((seed * 11) % 9);
    const totalCarryForward = Math.max(
      0,
      Math.round(((seed * 17) % 12) - 3 + totalStoryPoints * 0.05),
    );

    return {
      id: idx + 1,
      team,
      sprint: buildSprintLabel(reportType, safeFrom, safeTo, idx),
      totalStoryPoints,
      totalCompletedStories,
      totalCarryForward,
    };
  });
};
