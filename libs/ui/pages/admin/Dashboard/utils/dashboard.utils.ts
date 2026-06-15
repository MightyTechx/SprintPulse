import { Dayjs } from 'dayjs';
import {
  MOCK_SPRINT_DATA,
  STATUS_CONFIG,
  TURBINE_LIST,
  MIN_DATE,
  MAX_DATE,
  TURBINE_COLORS,
  SELECT_ALL_KEY,
} from '../../../../utils/mockData';
import type { Ticket } from '../types/sprintData.types';

// Re-export for Dashboard
export { MOCK_SPRINT_DATA };

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 1,
    team: 'Frontend',
    assignee: 'Aarav Sharma',
    issueType: 'Story',
    issueNo: 'SCRUM-101',
    summary: 'Login form validation and error handling',
    timeLoggingId: 'TL-001',
    status: 'In Progress',
    storyPoints: 5,
    fixVersion: 'v2.4.0',
    carryForward: '',
    carryForwardReason: '',
    workStartDate: '2026-06-10',
    workEndDate: '2026-06-13',
    ticketLink: 'https://jira.example.com/browse/SCRUM-101',
  },
  {
    id: 2,
    team: 'Backend',
    assignee: 'Priya Iyer',
    issueType: 'Task',
    issueNo: 'SCRUM-102',
    summary: 'Refactor auth middleware to support refresh tokens',
    timeLoggingId: 'TL-002',
    status: 'In Review',
    storyPoints: 8,
    fixVersion: 'v2.4.0',
    carryForward: '',
    carryForwardReason: '',
    workStartDate: '2026-06-08',
    workEndDate: '2026-06-12',
    ticketLink: 'https://jira.example.com/browse/SCRUM-102',
  },
  {
    id: 3,
    team: 'QA',
    assignee: 'Rahul Verma',
    issueType: 'Bug',
    issueNo: 'SCRUM-103',
    summary: 'Dashboard chart fails to load on Safari 17',
    timeLoggingId: 'TL-003',
    status: 'Blocked',
    storyPoints: 3,
    fixVersion: 'v2.3.2',
    carryForward: 'Sprint 22',
    carryForwardReason:
      'Carried forward from Sprint 22 — blocked on Safari 17 WebKit fix from upstream; deferred to unblock QA verification.',
    workStartDate: '2026-06-05',
    workEndDate: '2026-06-09',
    ticketLink: 'https://jira.example.com/browse/SCRUM-103',
  },
  {
    id: 4,
    team: 'DevOps',
    assignee: 'Sneha Kapoor',
    issueType: 'Task',
    issueNo: 'SCRUM-104',
    summary: 'Set up staging environment with PostgreSQL 16',
    timeLoggingId: 'TL-004',
    status: 'Done',
    storyPoints: 5,
    fixVersion: 'v2.4.0',
    carryForward: '',
    carryForwardReason: '',
    workStartDate: '2026-06-01',
    workEndDate: '2026-06-03',
    ticketLink: 'https://jira.example.com/browse/SCRUM-104',
  },
  {
    id: 5,
    team: 'Frontend',
    assignee: 'Manoj Patel',
    issueType: 'Story',
    issueNo: 'SCRUM-105',
    summary: 'Build ticket overview table on Dashboard',
    timeLoggingId: 'TL-005',
    status: 'In Progress',
    storyPoints: 8,
    fixVersion: 'v2.4.0',
    carryForward: '',
    carryForwardReason: '',
    workStartDate: '2026-06-09',
    workEndDate: '2026-06-15',
    ticketLink: 'https://jira.example.com/browse/SCRUM-105',
  },
  {
    id: 6,
    team: 'Backend',
    assignee: 'Karthik Reddy',
    issueType: 'Story',
    issueNo: 'SCRUM-106',
    summary: 'Add WebSocket support for live turbine data',
    timeLoggingId: 'TL-006',
    status: 'In Test',
    storyPoints: 13,
    fixVersion: 'v2.5.0',
    carryForward: '',
    carryForwardReason: '',
    workStartDate: '2026-05-28',
    workEndDate: '2026-06-06',
    ticketLink: 'https://jira.example.com/browse/SCRUM-106',
  },
  {
    id: 7,
    team: 'QA',
    assignee: 'Neha Gupta',
    issueType: 'Task',
    issueNo: 'SCRUM-107',
    summary: 'Automate regression suite for sprint 23',
    timeLoggingId: 'TL-007',
    status: 'To Do',
    storyPoints: 5,
    fixVersion: 'v2.4.0',
    carryForward: '',
    carryForwardReason: '',
    workStartDate: '2026-06-15',
    workEndDate: '2026-06-19',
    ticketLink: 'https://jira.example.com/browse/SCRUM-107',
  },
  {
    id: 8,
    team: 'Frontend',
    assignee: 'Rohan Mehta',
    issueType: 'Bug',
    issueNo: 'SCRUM-108',
    summary: 'Date picker not respecting user timezone',
    timeLoggingId: 'TL-008',
    status: 'In Review',
    storyPoints: 2,
    fixVersion: 'v2.3.2',
    carryForward: 'Sprint 23',
    carryForwardReason:
      'Carried forward from Sprint 23 — needs a follow-up to cover DST edge cases after the initial fix.',
    workStartDate: '2026-06-04',
    workEndDate: '2026-06-05',
    ticketLink: 'https://jira.example.com/browse/SCRUM-108',
  },
  {
    id: 9,
    team: 'Design',
    assignee: 'Anika Joshi',
    issueType: 'Task',
    issueNo: 'SCRUM-109',
    summary: 'Design empty states for ticket list and reports',
    timeLoggingId: 'TL-009',
    status: 'Done',
    storyPoints: 3,
    fixVersion: 'v2.4.0',
    carryForward: '',
    carryForwardReason: '',
    workStartDate: '2026-05-30',
    workEndDate: '2026-06-01',
    ticketLink: 'https://jira.example.com/browse/SCRUM-109',
  },
  {
    id: 10,
    team: 'Backend',
    assignee: 'Vikram Singh',
    issueType: 'Story',
    issueNo: 'SCRUM-110',
    summary: 'Implement RBAC for admin operations',
    timeLoggingId: 'TL-010',
    status: 'In Progress',
    storyPoints: 13,
    fixVersion: 'v2.5.0',
    carryForward: 'Sprint 22',
    carryForwardReason:
      'Carried forward from Sprint 22 — scope grew to include the audit-log requirement after security review.',
    workStartDate: '2026-06-02',
    workEndDate: '2026-06-12',
    ticketLink: 'https://jira.example.com/browse/SCRUM-110',
  },
  {
    id: 11,
    team: 'DevOps',
    assignee: 'Ishaan Khanna',
    issueType: 'Bug',
    issueNo: 'SCRUM-111',
    summary: 'CI pipeline flaky on integration test stage',
    timeLoggingId: 'TL-011',
    status: 'Blocked',
    storyPoints: 3,
    fixVersion: 'v2.4.0',
    carryForward: 'Sprint 21',
    carryForwardReason:
      'Carried forward from Sprint 21 — needs a runner image upgrade from infra team to stabilize the integration stage.',
    workStartDate: '2026-06-06',
    workEndDate: '2026-06-10',
    ticketLink: 'https://jira.example.com/browse/SCRUM-111',
  },
  {
    id: 12,
    team: 'Frontend',
    assignee: 'Aarav Sharma',
    issueType: 'Task',
    issueNo: 'SCRUM-112',
    summary: 'Add dark mode toggle in user settings',
    timeLoggingId: 'TL-012',
    status: 'To Do',
    storyPoints: 5,
    fixVersion: 'v2.4.0',
    carryForward: '',
    carryForwardReason: '',
    workStartDate: '2026-06-16',
    workEndDate: '2026-06-19',
    ticketLink: 'https://jira.example.com/browse/SCRUM-112',
  },
  {
    id: 13,
    team: 'QA',
    assignee: 'Priya Iyer',
    issueType: 'Spike',
    issueNo: 'SCRUM-113',
    summary: 'Investigate Playwright vs Cypress for E2E tests',
    timeLoggingId: 'TL-013',
    status: 'Done',
    storyPoints: 2,
    fixVersion: 'v2.4.0',
    carryForward: '',
    carryForwardReason: '',
    workStartDate: '2026-05-25',
    workEndDate: '2026-05-26',
    ticketLink: 'https://jira.example.com/browse/SCRUM-113',
  },
  {
    id: 14,
    team: 'Frontend',
    assignee: 'Rohan Mehta',
    issueType: 'Spike',
    issueNo: 'SCRUM-114a',
    summary: 'Research WebSocket vs SSE for live dashboard updates',
    timeLoggingId: 'TL-014a',
    status: 'In Progress',
    storyPoints: 3,
    fixVersion: 'v2.4.0',
    carryForward: '',
    carryForwardReason: '',
    workStartDate: '2026-06-08',
    workEndDate: '2026-06-12',
    ticketLink: 'https://jira.example.com/browse/SCRUM-114a',
  },
  {
    id: 15,
    team: 'Backend',
    assignee: 'Karthik Reddy',
    issueType: 'Spike',
    issueNo: 'SCRUM-115a',
    summary: 'Evaluate PostgreSQL 16 partitioning for telemetry table',
    timeLoggingId: 'TL-015a',
    status: 'In Review',
    storyPoints: 5,
    fixVersion: 'v2.5.0',
    carryForward: '',
    carryForwardReason: '',
    workStartDate: '2026-06-04',
    workEndDate: '2026-06-09',
    ticketLink: 'https://jira.example.com/browse/SCRUM-115a',
  },
  {
    id: 16,
    team: 'Backend',
    assignee: 'Sneha Kapoor',
    issueType: 'Task',
    issueNo: 'SCRUM-114',
    summary: 'Optimize slow query on turbine telemetry table',
    timeLoggingId: 'TL-014',
    status: 'In Test',
    storyPoints: 5,
    fixVersion: 'v2.4.0',
    carryForward: '',
    carryForwardReason: '',
    workStartDate: '2026-06-03',
    workEndDate: '2026-06-07',
    ticketLink: 'https://jira.example.com/browse/SCRUM-114',
  },
  {
    id: 17,
    team: 'Frontend',
    assignee: 'Manoj Patel',
    issueType: 'Bug',
    issueNo: 'SCRUM-115',
    summary: 'Tooltip clipped on small viewport in incentive report',
    timeLoggingId: 'TL-015',
    status: 'In Review',
    storyPoints: 2,
    fixVersion: 'v2.3.2',
    carryForward: '',
    carryForwardReason: '',
    workStartDate: '2026-06-11',
    workEndDate: '2026-06-12',
    ticketLink: 'https://jira.example.com/browse/SCRUM-115',
  },
  {
    id: 18,
    team: 'Design',
    assignee: 'Anika Joshi',
    issueType: 'Story',
    issueNo: 'SCRUM-116',
    summary: 'Refresh design system with new color tokens',
    timeLoggingId: 'TL-016',
    status: 'In Progress',
    storyPoints: 8,
    fixVersion: 'v2.5.0',
    carryForward: '',
    carryForwardReason: '',
    workStartDate: '2026-06-04',
    workEndDate: '2026-06-13',
    ticketLink: 'https://jira.example.com/browse/SCRUM-116',
  },
];

export interface ChartDataResult {
  categories: string[];
  series: { name: string; data: number[] }[];
  aggregate: 'daily' | 'weekly' | 'monthly';
  totalDays: number;
  totalEnergy: number;
  peakValue: number;
  avgPerDay: number;
}

// ─────────────────────────────────────────────────────────────
// Turbine List (re-export)
// ─────────────────────────────────────────────────────────────

export const ALL_TURBINE_NOS = TURBINE_LIST;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

export { MIN_DATE, MAX_DATE, TURBINE_COLORS, SELECT_ALL_KEY };

export const getTurbineStatuses = (turbines: typeof MOCK_SPRINT_DATA): Record<string, string> => {
  const result: Record<string, string> = {};
  turbines.forEach((t: any) => {
    result[t.turbineNo] = t.status;
  });
  return result;
};

// Re-export for convenience
export { STATUS_CONFIG };

// ─────────────────────────────────────────────────────────────
// Chart Data Generation
// ─────────────────────────────────────────────────────────────

const toDateStr = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const generateDayData = (dateStr: string, turbineStatuses: Record<string, string>): number[] => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const seed = (y % 100) * 10000 + m * 100 + d;

  const base: Record<string, number> = {
    running: 4200,
    standby: 900,
    maintenance: 1600,
    fault: 300,
    stopped: 0,
  };

  return ALL_TURBINE_NOS.map((turbineNo, i) => {
    const status = turbineStatuses[turbineNo] ?? 'running';

    if (status === 'stopped') {
      return 0;
    }

    const variation = ((seed + i * 97 + i * i * 13) % 1600) - 800;

    return Math.max(0, Math.round((base[status] ?? 3000) + variation));
  });
};

export const getChartData = (
  from: Dayjs,
  to: Dayjs,
  turbineNos: string[],
  turbineStatuses: Record<string, string>,
): ChartDataResult => {
  const fromDate = from.toDate();
  const toDate = to.toDate();

  const totalDays = Math.round((toDate.getTime() - fromDate.getTime()) / 86_400_000) + 1;

  const turbineIndices = turbineNos.map((no) => ALL_TURBINE_NOS.indexOf(no));

  const categories: string[] = [];
  const buckets: number[][] = turbineIndices.map(() => []);
  let aggregate: 'daily' | 'weekly' | 'monthly' = 'daily';

  if (totalDays <= 31) {
    aggregate = 'daily';

    for (let d = 0; d < totalDays; d++) {
      const date = new Date(fromDate);
      date.setDate(fromDate.getDate() + d);

      categories.push(
        date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        }),
      );

      const vals = generateDayData(toDateStr(date), turbineStatuses);

      turbineIndices.forEach((ti, i) => {
        buckets[i].push(vals[ti] ?? 0);
      });
    }
  } else if (totalDays <= 180) {
    aggregate = 'weekly';

    const wStart = new Date(fromDate);

    while (wStart <= toDate) {
      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + 6);

      if (wEnd > toDate) {
        wEnd.setTime(toDate.getTime());
      }

      categories.push(
        wStart.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        }),
      );

      const sums = turbineIndices.map(() => 0);
      const cur = new Date(wStart);

      while (cur <= wEnd) {
        const vals = generateDayData(toDateStr(cur), turbineStatuses);

        turbineIndices.forEach((ti, i) => {
          sums[i] += vals[ti] ?? 0;
        });

        cur.setDate(cur.getDate() + 1);
      }

      sums.forEach((s, i) => {
        buckets[i].push(Math.round(s));
      });

      wStart.setDate(wStart.getDate() + 7);
    }
  } else {
    aggregate = 'monthly';

    const cur = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
    const end = new Date(toDate.getFullYear(), toDate.getMonth(), 1);

    while (cur <= end) {
      const yr = cur.getFullYear();
      const mo = cur.getMonth();
      const dim = new Date(yr, mo + 1, 0).getDate();

      categories.push(
        cur.toLocaleDateString('en-GB', {
          month: 'short',
          year: '2-digit',
        }),
      );

      const sums = turbineIndices.map(() => 0);

      for (let d = 1; d <= dim; d++) {
        const day = new Date(yr, mo, d);

        if (day < fromDate || day > toDate) {
          continue;
        }

        const vals = generateDayData(toDateStr(day), turbineStatuses);

        turbineIndices.forEach((ti, i) => {
          sums[i] += vals[ti] ?? 0;
        });
      }

      sums.forEach((s, i) => {
        buckets[i].push(Math.round(s));
      });

      cur.setMonth(cur.getMonth() + 1);
    }
  }

  const series = turbineNos.map((name, i) => ({
    name,
    data: buckets[i],
  }));

  const allVals = buckets.flat();
  const totalEnergy = allVals.reduce((a, b) => a + b, 0);
  const peakValue = allVals.length ? Math.max(...allVals) : 0;
  const avgPerDay = totalDays > 0 ? Math.round(totalEnergy / totalDays) : 0;

  return {
    categories,
    series,
    aggregate,
    totalDays,
    totalEnergy,
    peakValue,
    avgPerDay,
  };
};
