import { Dayjs } from 'dayjs';
import { TURBINE_IDS } from '../../../../utils/mockData';

// ─── Types ──────────────────────────────────────────────────────────────────────────

export interface KpiRow {
  id: number;
  kpi: string;
  t01: string;
  t02: string;
  t03: string;
  t04: string;
  t05: string;
  t06: string;
  t07: string;
  t08: string;
  t09: string;
  t10: string;
  total: string;
}

export interface DowntimeRow {
  id: number;
  turbineNo: string;
  from: string;
  to: string;
  duration: string;
  downtimeType: 'Scheduled' | 'Unscheduled' | 'Force Majeure' | 'Grid Fault' | 'Communication Loss';
  faultStatus: string;
  remarks: string;
}

export type DowntimeType = DowntimeRow['downtimeType'];

export interface DowntimeColorConfig {
  bg: string;
  color: string;
  border: string;
}

// Re-export from mockData for convenience
export { DOWNTIME_COLORS } from '../../../../utils/mockData';

export type DocType = 'pdf' | 'xlsx' | 'svg';

export interface DocTypeOption {
  value: DocType;
  label: string;
}

// ─── Report Types ───────────────────────────────────────────────────────────────

export const REPORT_TYPES = [
  'Daily Generation Report',
  'Weekly Generation Report',
  'Monthly Generation Report',
  'Temperature Alerts',
  'Time Series',
  'Multi-Time Analysis (Time Series)',
  'Multi-Scatter 2×2 Pairwise',
  'Heat Map',
  'Day-Wise Maximum',
  'Day-Wise Average',
  'Power Curve',
  'Wind Rose',
  'Generation',
  'Status Timeline',
  'Event Log',
  'Downtime Analysis (MTBF & MTTR)',
  'Machine Availability',
  'Trace Files',
];

// ─── Turbines (re-export from mockData) ─────────────────────────────────────────────────────

export { TURBINE_LIST, TURBINE_IDS, SELECT_ALL_KEY, DOC_TYPES } from '../../../../utils/mockData';

// ─── KPI Data ─────────────────────────────────────────────────────────────────

const KPI_LABELS = [
  'Generation (kWh)',
  'Up Time (hh:mm)',
  'Unscheduled Down Time (hh:mm)',
  'Scheduled Down Time (hh:mm)',
  'Machine Availability (%)',
  'Average Wind Speed (m/s)',
  'Capacity Utilization Factor (CUF %)',
];

const EMPTY_TURBINES = {
  t01: '-',
  t02: '-',
  t03: '-',
  t04: '-',
  t05: '-',
  t06: '-',
  t07: '-',
  t08: '-',
  t09: '-',
  t10: '-',
} as const;

export const getKpiRows = (): KpiRow[] =>
  KPI_LABELS.map((kpi, i) => ({
    id: i + 1,
    kpi,
    ...EMPTY_TURBINES,
    total: '-',
  }));

export const KPI_COLUMNS_IDS = TURBINE_IDS;

// ─── Downtime Data ─────────────────────────────────────────────────────────────

export const getDowntimeRows = (): DowntimeRow[] => [
  {
    id: 1,
    turbineNo: 'T-01',
    from: '-',
    to: '-',
    duration: '-',
    downtimeType: 'Scheduled',
    faultStatus: '-',
    remarks: '-',
  },
  {
    id: 2,
    turbineNo: 'T-02',
    from: '-',
    to: '-',
    duration: '-',
    downtimeType: 'Unscheduled',
    faultStatus: '-',
    remarks: '-',
  },
  {
    id: 3,
    turbineNo: 'T-03',
    from: '-',
    to: '-',
    duration: '-',
    downtimeType: 'Grid Fault',
    faultStatus: '-',
    remarks: '-',
  },
  {
    id: 4,
    turbineNo: 'T-04',
    from: '-',
    to: '-',
    duration: '-',
    downtimeType: 'Scheduled',
    faultStatus: '-',
    remarks: '-',
  },
  {
    id: 5,
    turbineNo: 'T-05',
    from: '-',
    to: '-',
    duration: '-',
    downtimeType: 'Force Majeure',
    faultStatus: '-',
    remarks: '-',
  },
  {
    id: 6,
    turbineNo: 'T-06',
    from: '-',
    to: '-',
    duration: '-',
    downtimeType: 'Unscheduled',
    faultStatus: '-',
    remarks: '-',
  },
  {
    id: 7,
    turbineNo: 'T-07',
    from: '-',
    to: '-',
    duration: '-',
    downtimeType: 'Communication Loss',
    faultStatus: '-',
    remarks: '-',
  },
  {
    id: 8,
    turbineNo: 'T-08',
    from: '-',
    to: '-',
    duration: '-',
    downtimeType: 'Grid Fault',
    faultStatus: '-',
    remarks: '-',
  },
  {
    id: 9,
    turbineNo: 'T-09',
    from: '-',
    to: '-',
    duration: '-',
    downtimeType: 'Scheduled',
    faultStatus: '-',
    remarks: '-',
  },
  {
    id: 10,
    turbineNo: 'T-10',
    from: '-',
    to: '-',
    duration: '-',
    downtimeType: 'Unscheduled',
    faultStatus: '-',
    remarks: '-',
  },
];

// Re-export chart helpers from mockData
export { MIN_DATE, MAX_DATE } from '../../../../utils/mockData';

// ─── Chart Data Helpers (local overrides for Reports-specific logic) ─────────────

// Keep local generateDayData for Reports-specific turbineStatuses format

export const generateDayData = (
  dateStr: string,
  turbineStatuses: Record<string, string>,
): number[] => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const seed = (y % 100) * 10000 + m * 100 + d;
  const base: Record<string, number> = {
    running: 4200,
    standby: 900,
    maintenance: 1600,
    fault: 300,
    stopped: 0,
  };

  return Object.keys(turbineStatuses).map((_, i) => {
    const status = Object.values(turbineStatuses)[i] as string;
    if (status === 'stopped') return 0;
    const variation = ((seed + i * 97 + i * i * 13) % 1600) - 800;
    return Math.max(0, Math.round((base[status] ?? 3000) + variation));
  });
};

export const toDateStr = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export interface ChartDataResult {
  categories: string[];
  series: { name: string; data: number[] }[];
  aggregate: 'daily' | 'weekly' | 'monthly';
  totalDays: number;
  totalEnergy: number;
  peakValue: number;
  avgPerDay: number;
}

export const getChartData = (
  from: Dayjs,
  to: Dayjs,
  turbineNos: string[],
  allTurbines: string[],
  turbineStatuses: Record<string, string>,
): ChartDataResult => {
  const fromDate = from.toDate();
  const toDate = to.toDate();
  const totalDays = Math.round((toDate.getTime() - fromDate.getTime()) / 86_400_000) + 1;

  const turbineIndices = turbineNos.map((no) => allTurbines.indexOf(no));

  const categories: string[] = [];
  const buckets: number[][] = turbineIndices.map(() => []);
  let aggregate: 'daily' | 'weekly' | 'monthly' = 'daily';

  if (totalDays <= 31) {
    aggregate = 'daily';
    for (let d = 0; d < totalDays; d++) {
      const date = new Date(fromDate);
      date.setDate(fromDate.getDate() + d);
      categories.push(date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
      const vals = generateDayData(toDateStr(date), turbineStatuses);
      turbineIndices.forEach((ti, i) => buckets[i].push(vals[ti] ?? 0));
    }
  } else if (totalDays <= 180) {
    aggregate = 'weekly';
    const wStart = new Date(fromDate);
    while (wStart <= toDate) {
      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + 6);
      if (wEnd > toDate) wEnd.setTime(toDate.getTime());
      categories.push(wStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
      const sums = turbineIndices.map(() => 0);
      const cur = new Date(wStart);
      while (cur <= wEnd) {
        const vals = generateDayData(toDateStr(cur), turbineStatuses);
        turbineIndices.forEach((ti, i) => {
          sums[i] += vals[ti] ?? 0;
        });
        cur.setDate(cur.getDate() + 1);
      }
      sums.forEach((s, i) => buckets[i].push(Math.round(s)));
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
      categories.push(cur.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }));
      const sums = turbineIndices.map(() => 0);
      for (let d = 1; d <= dim; d++) {
        const day = new Date(yr, mo, d);
        if (day < fromDate || day > toDate) continue;
        const vals = generateDayData(toDateStr(day), turbineStatuses);
        turbineIndices.forEach((ti, i) => {
          sums[i] += vals[ti] ?? 0;
        });
      }
      sums.forEach((s, i) => buckets[i].push(Math.round(s)));
      cur.setMonth(cur.getMonth() + 1);
    }
  }

  const series = turbineNos.map((name, i) => ({ name, data: buckets[i] }));
  const allVals = buckets.flat();
  const totalEnergy = allVals.reduce((a, b) => a + b, 0);
  const peakValue = allVals.length ? Math.max(...allVals) : 0;
  const avgPerDay = totalDays > 0 ? Math.round(totalEnergy / totalDays) : 0;

  return { categories, series, aggregate, totalDays, totalEnergy, peakValue, avgPerDay };
};

// Re-export color constants from mockData
export { TURBINE_COLORS } from '../../../../utils/mockData';

// ─── Monthly Report Data ─────────────────────────────────────────────────────────

export interface MonthlyKpiRow {
  id: number;
  kpi: string;
  t01: string;
  t02: string;
  t03: string;
  t04: string;
  t05: string;
  t06: string;
  t07: string;
  t08: string;
  t09: string;
  t10: string;
  total: string;
}

export interface ScheduledDowntimeRow {
  id: number;
  turbineNo: string;
  from: string;
  to: string;
  status: string;
  duration: string;
}

export interface UnscheduledDowntimeRow {
  id: number;
  turbineNo: string;
  from: string;
  to: string;
  status: string;
  duration: string;
}

const MONTHLY_KPI_LABELS = [
  'Machine Availability (%)',
  'Generation (MWh)',
  'Capacity Utilization Factor (CUF %)',
  'Average Wind Speed (m/s)',
  'Unscheduled Down Time (hh:mm)',
  'Scheduled Down Time (hh:mm)',
];

// Generate realistic monthly data based on date range
function generateMonthlyValue(kpi: string, turbineIndex: number, seed: number): string {
  const variations = [
    // Machine Availability
    [89.67, 99.98, 100.0, 100.0, 85.92, 99.97, 92.65, 99.14, 99.78, 100.0],
    // Generation (MWh)
    [80.14, 105.52, 107.68, 99.86, 4.32, 89.06, 61.51, 94.02, 96.31, 106.49],
    // CUF (%)
    [5.39, 7.09, 7.24, 6.71, 0.29, 5.98, 4.13, 6.32, 6.47, 7.16],
    // Avg Wind Speed
    [4.97, 4.85, 5.41, 4.86, 4.59, 4.6, 4.69, 4.71, 4.74, 4.8],
    // Unscheduled Down Time (hours)
    [76.88, 0.13, 0.03, 0.02, 104.78, 0.25, 54.7, 6.43, 1.65, 0.02],
    // Scheduled Down Time (hours)
    [0, 0, 0, 0, 0, 0, 0, 2.92, 0, 0],
  ];

  const kpiIndex = MONTHLY_KPI_LABELS.indexOf(kpi);
  if (kpiIndex === -1) return '-';

  const baseValue = variations[kpiIndex][turbineIndex] || 0;
  const variation = ((seed + turbineIndex * 31) % 20) - 10;
  const newValue = baseValue + (variation / 100) * baseValue;

  if (kpi.includes('Time')) {
    const hours = Math.floor(newValue);
    const minutes = Math.round((newValue % 1) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  return newValue.toFixed(2);
}

// Calculate total/average for monthly metrics
function calculateMonthlyTotal(values: string[], kpi: string): string {
  if (kpi.includes('Time')) {
    let totalMinutes = 0;
    values.forEach((v) => {
      if (v !== '-') {
        const [h, m] = v.split(':').map(Number);
        totalMinutes += h * 60 + m;
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  if (kpi.includes('%')) {
    const nums = values.filter((v) => v !== '-').map(Number);
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    return kpi.includes('Availability') || kpi.includes('CUF') ? avg.toFixed(2) : avg.toFixed(2);
  }
  const nums = values.filter((v) => v !== '-').map(Number);
  return nums.reduce((a, b) => a + b, 0).toFixed(2);
}

export const getMonthlyKpiRows = (turbines: string[]): MonthlyKpiRow[] => {
  const turbineIds = turbines.map((t) => t.replace('T-', 't').toLowerCase());
  const seed = Math.floor(Math.random() * 1000);

  return MONTHLY_KPI_LABELS.map((kpi, i) => {
    const values = turbineIds.map((tid, idx) => {
      const tIdx = parseInt(tid.replace('t', '')) - 1;
      return generateMonthlyValue(kpi, tIdx, seed + i * 100);
    });
    return {
      id: i + 1,
      kpi,
      t01: values[0] || '-',
      t02: values[1] || '-',
      t03: values[2] || '-',
      t04: values[3] || '-',
      t05: values[4] || '-',
      t06: values[5] || '-',
      t07: values[6] || '-',
      t08: values[7] || '-',
      t09: values[8] || '-',
      t10: values[9] || '-',
      total: calculateMonthlyTotal(values, kpi),
    };
  });
};

// Generate scheduled downtime entries
export const getScheduledDowntimeRows = (
  fromDate: Dayjs,
  toDate: Dayjs,
  turbines: string[],
): ScheduledDowntimeRow[] => {
  const entries: ScheduledDowntimeRow[] = [];
  const days = toDate.diff(fromDate, 'day');

  // Only generate entries for turbines that have scheduled maintenance
  const scheduledTurbines = ['T08', 'T03', 'T05'].filter((t) => turbines.includes(t));

  scheduledTurbines.forEach((turbine, idx) => {
    const dayOffset = (idx * 3) % days;
    const startDate = fromDate.add(dayOffset, 'day');
    const durationHours = 1 + idx * 0.5;
    const endDate = startDate.add(durationHours, 'hour');

    entries.push({
      id: idx + 1,
      turbineNo: turbine,
      from: startDate.format('YYYY-MM-DD HH:mm'),
      to: endDate.format('YYYY-MM-DD HH:mm'),
      status: 'MANUAL STOP',
      duration: `${Math.floor(durationHours).toString().padStart(2, '0')}:${Math.round(
        (durationHours % 1) * 60,
      )
        .toString()
        .padStart(2, '0')}`,
    });
  });

  return entries;
};

// Generate unscheduled downtime entries
export const getUnscheduledDowntimeRows = (
  fromDate: Dayjs,
  toDate: Dayjs,
  turbines: string[],
): UnscheduledDowntimeRow[] => {
  const entries: UnscheduledDowntimeRow[] = [];
  const days = toDate.diff(fromDate, 'day');

  const faultTypes = [
    '(Cnv) Type C stop : Emergency',
    '(Cnv) Type A stop : Emergency',
    '(Cnv) LVRT condition detected',
    '(Drv) Tower oscillation level 1 exceeded',
    '(Grd) Grid fault condition',
    '(Nac) Yaw mis-alignment',
  ];

  // Generate entries for random turbines with faults
  const turbineList = ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10'];
  const selectedTurbines = turbineList.filter((t) => turbines.includes(t));

  selectedTurbines.slice(0, 4).forEach((turbine, idx) => {
    const dayOffset = (idx * 5) % days;
    const startDate = fromDate.add(dayOffset, 'day');
    const durationHours = 1 + idx * 2 + Math.random() * 48;
    const endDate = startDate.add(durationHours, 'hour');

    entries.push({
      id: idx + 1,
      turbineNo: turbine,
      from: startDate.format('YYYY-MM-DD HH:mm'),
      to: endDate.format('YYYY-MM-DD HH:mm'),
      status: faultTypes[idx % faultTypes.length],
      duration: `${Math.floor(durationHours).toString().padStart(2, '0')}:${Math.round(
        (durationHours % 1) * 60,
      )
        .toString()
        .padStart(2, '0')}`,
    });
  });

  return entries;
};

// Calculate total duration
export const calculateTotalDuration = (
  rows: (ScheduledDowntimeRow | UnscheduledDowntimeRow)[],
): string => {
  let totalMinutes = 0;
  rows.forEach((row) => {
    const [h, m] = row.duration.split(':').map(Number);
    totalMinutes += h * 60 + m;
  });
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// ─── Weekly Report Data ─────────────────────────────────────────────────────────

export interface WeeklyKpiRow {
  id: number;
  kpi: string;
  t01: string;
  t02: string;
  t03: string;
  t04: string;
  t05: string;
  t06: string;
  t07: string;
  t08: string;
  t09: string;
  t10: string;
  total: string;
}

const WEEKLY_KPI_LABELS = [
  'Generation (MWh)',
  'Up Time (hh:mm)',
  'Unscheduled Down Time (hh:mm)',
  'Scheduled Down Time (hh:mm)',
  'Machine Availability (%)',
  'Average Wind Speed (m/s)',
  'Capacity Utilization Factor (CUF %)',
  'Net Energy Yield (MWh)',
  'Grid Availability (%)',
  'Curtailment Loss (MWh)',
];

export const getWeeklyKpiRows = (
  turbines: string[],
  fromDate: Dayjs,
  toDate: Dayjs,
): WeeklyKpiRow[] => {
  const turbineIds = turbines.map((t) => t.replace('T-', 't').toLowerCase());
  const seed = Math.floor(fromDate.valueOf() / 1000);
  const days = toDate.diff(fromDate, 'day') + 1;

  return WEEKLY_KPI_LABELS.map((kpi, i) => {
    const values = turbineIds.map((tid, idx) => {
      const tIdx = parseInt(tid.replace('t', '')) - 1;
      const baseValues: Record<string, number[]> = {
        'Generation (MWh)': [45.2, 52.8, 48.3, 55.1, 38.7, 49.5, 42.1, 51.3, 47.8, 53.2],
        'Up Time (hh:mm)': [156.5, 162.3, 158.7, 165.2, 148.9, 159.4, 154.2, 161.8, 157.3, 163.5],
        'Unscheduled Down Time (hh:mm)': [4.2, 1.8, 3.5, 0.5, 8.3, 2.1, 6.7, 0.8, 2.9, 1.2],
        'Scheduled Down Time (hh:mm)': [3.3, 0, 1.8, 2.3, 6.8, 2.5, 3.1, 0, 3.8, 3.3],
        'Machine Availability (%)': [93.5, 98.2, 95.8, 99.1, 86.4, 97.3, 91.2, 98.7, 96.4, 97.8],
        'Average Wind Speed (m/s)': [5.2, 5.8, 5.4, 6.1, 4.8, 5.5, 5.1, 5.9, 5.3, 5.7],
        'Capacity Utilization Factor (CUF %)': [
          22.6, 26.4, 24.2, 27.5, 19.4, 24.8, 21.1, 25.7, 23.9, 26.6,
        ],
        'Net Energy Yield (MWh)': [42.8, 49.5, 45.1, 51.8, 35.2, 46.2, 39.5, 48.1, 44.3, 49.8],
        'Grid Availability (%)': [98.5, 99.8, 99.2, 100, 97.3, 99.5, 98.1, 99.9, 99.3, 99.7],
        'Curtailment Loss (MWh)': [2.4, 3.3, 3.2, 3.3, 3.5, 3.3, 2.6, 3.2, 3.5, 3.4],
      };

      const base = baseValues[kpi]?.[tIdx] ?? 50;
      const variation = ((seed + i * 37 + tIdx * 17 + days * 3) % 30) - 15;
      return (base + (variation / 100) * base).toFixed(2);
    });

    return {
      id: i + 1,
      kpi,
      t01: values[0] || '-',
      t02: values[1] || '-',
      t03: values[2] || '-',
      t04: values[3] || '-',
      t05: values[4] || '-',
      t06: values[5] || '-',
      t07: values[6] || '-',
      t08: values[7] || '-',
      t09: values[8] || '-',
      t10: values[9] || '-',
      total:
        values.length > 0
          ? (
              values.filter((v) => v !== '-').reduce((a, b) => a + parseFloat(b), 0) /
              values.filter((v) => v !== '-').length
            ).toFixed(2)
          : '-',
    };
  });
};

// ─── Temperature Alert Data ───────────────────────────────────────────────────────

export interface TemperatureAlertRow {
  id: number;
  parameter: string;
  t01: string;
  t02: string;
  t03: string;
  t04: string;
  t05: string;
  t06: string;
  t07: string;
  t08: string;
  t09: string;
  t10: string;
  avg: string;
}

export const getTemperatureAlertRows = (
  turbines: string[],
  parameters: string[],
): TemperatureAlertRow[] => {
  const turbineIds = turbines.map((t) => t.replace('T-', 't').toLowerCase());

  // Base values for different parameters - realistic turbine readings
  const parameterBaseValues: Record<string, number[]> = {
    '(Gri) Active power ,1sec. (Max)': [1850, 1920, 1780, 1950, 1680, 1880, 1720, 1900, 1840, 1930],
    '(Met) Wind speed 1 ,1sec. (Max)': [8.2, 8.5, 7.9, 8.8, 7.5, 8.1, 7.8, 8.4, 8.0, 8.6],
    '(Met) Wind speed 2 ,1sec. (Max)': [8.1, 8.4, 7.8, 8.7, 7.4, 8.0, 7.7, 8.3, 7.9, 8.5],
    '(Trf) Winding Temp U ,1sec. (Max)': [
      65.2, 68.5, 62.8, 71.3, 58.4, 66.1, 60.5, 69.2, 64.8, 70.1,
    ],
    '(Trf) Winding Temp V ,1sec. (Max)': [
      63.8, 67.2, 61.5, 70.5, 57.2, 65.8, 59.8, 68.4, 63.2, 69.5,
    ],
    '(Trf) Winding Temp W ,1sec. (Max)': [
      64.5, 67.8, 62.2, 70.8, 57.8, 66.2, 60.2, 68.8, 63.9, 69.8,
    ],
    '(Gn) Bearing temp. DE ,1sec. (Max)': [
      72.3, 75.8, 69.5, 78.2, 65.8, 73.5, 68.2, 76.1, 71.5, 77.4,
    ],
    '(Gn) Bearing temp. NDE ,1sec. (Max)': [
      68.5, 71.2, 65.8, 74.6, 62.4, 69.8, 64.5, 72.3, 67.8, 73.9,
    ],
    '(Gn) Stator winding temp. U ,1sec. (Max)': [
      85.2, 89.5, 82.1, 92.3, 78.5, 86.8, 81.2, 90.1, 84.6, 91.2,
    ],
    '(Gn) Stator winding temp. V ,1sec. (Max)': [
      84.8, 89.1, 81.8, 91.8, 78.2, 86.5, 80.8, 89.8, 84.2, 90.8,
    ],
    '(Gn) Stator winding temp. W ,1sec. (Max)': [
      85.5, 89.8, 82.5, 92.6, 78.8, 87.2, 81.5, 90.4, 84.9, 91.5,
    ],
    '(Gbx) Bearing DE intermediate shaft temp. ,1sec. (Max)': [
      58.2, 61.5, 55.8, 64.2, 52.5, 59.8, 54.5, 62.5, 57.2, 63.8,
    ],
    '(Gbx) Bearing NDE intermediate shaft temp. ,1sec. (Max)': [
      56.8, 60.2, 54.5, 62.8, 51.2, 58.5, 53.2, 61.2, 55.9, 62.4,
    ],
    '(Gbx) Bearing DE temp. ,1sec. (Max)': [
      62.5, 65.8, 59.8, 68.5, 56.8, 63.8, 58.5, 66.2, 61.5, 67.8,
    ],
    '(Gbx) Bearing NDE temp. ,1sec. (Max)': [
      61.2, 64.5, 58.5, 67.2, 55.5, 62.5, 57.2, 64.8, 60.2, 66.5,
    ],
    '(Gbx) Oil Inlet temp. ,1sec. (Max)': [
      48.5, 52.1, 45.8, 54.2, 42.5, 49.8, 44.5, 52.8, 47.5, 53.5,
    ],
    '(Gbx) Oilsump temp. ,1sec. (Max)': [
      45.2, 48.8, 42.5, 51.2, 39.5, 46.5, 41.5, 49.2, 44.2, 50.5,
    ],
    '(Hy) Oil temperature ,1sec. (Max)': [
      42.8, 46.2, 40.5, 48.5, 38.2, 44.5, 39.5, 47.2, 42.2, 48.8,
    ],
    '(Cnv) Temp. MSC Inductance 1 (Max)': [
      55.2, 58.8, 52.5, 61.2, 49.5, 56.8, 51.5, 59.5, 54.2, 60.8,
    ],
    '(Cl) Cool Trf Heat Ex. In. temp. ,30sec. (Max)': [
      32.5, 35.8, 30.2, 38.2, 28.5, 33.8, 29.5, 36.5, 31.8, 37.5,
    ],
    '(Nac) Temp.sw.cab.Nacelle ,1sec. (Max)': [
      28.5, 31.2, 26.5, 33.5, 24.5, 29.8, 25.5, 32.2, 27.8, 32.8,
    ],
    '(Cnv) Temp. Ambient Outside (Max)': [
      22.5, 25.2, 20.5, 27.5, 18.5, 23.8, 19.5, 26.2, 21.8, 27.2,
    ],
    '(Cnv) Temp. GSC Inductance core (Max)': [
      45.2, 48.8, 42.5, 51.2, 39.5, 46.5, 41.5, 49.2, 44.2, 50.5,
    ],
    '(Cl) Cool Cnv Heat Ex. In. temp ,30sec. (Max)': [
      30.5, 33.8, 28.5, 36.2, 26.5, 31.8, 27.5, 34.5, 29.8, 35.8,
    ],
    '(Cl) Cool Cnv Heat Ex. Out. temp ,30sec. (Max)': [
      35.2, 38.5, 33.2, 41.2, 31.5, 36.5, 32.5, 39.2, 34.5, 40.8,
    ],
    '(Nac) Nacelle temp. averaged value ,1sec. (Max)': [
      26.8, 29.5, 24.8, 32.5, 22.8, 28.2, 23.8, 30.5, 26.2, 31.8,
    ],
    '(Pt) Blade angle ,Act. (Max)': [2.5, 2.8, 2.2, 3.1, 1.9, 2.6, 2.1, 2.9, 2.4, 3.0],
    '(Rot) Rotor speed encoder ,Act. (Max)': [
      12.5, 13.2, 11.8, 13.8, 11.2, 12.8, 11.5, 13.1, 12.2, 13.5,
    ],
    '(Rot) Rotor speed encoder X cycles (Max)': [
      1520, 1580, 1460, 1620, 1380, 1540, 1420, 1590, 1500, 1610,
    ],
    '(Rot) Rotor speed ,Act. (Max)': [12.8, 13.5, 12.1, 14.1, 11.5, 13.1, 11.8, 13.4, 12.5, 13.8],
    '(Met) Wind speed 1/2 ,1sec. (Max)': [8.0, 8.3, 7.6, 8.6, 7.2, 8.0, 7.5, 8.3, 7.9, 8.4],
    '(Met) Relative wind direction 2 ,1sec. (Max)': [
      182, 188, 175, 195, 165, 185, 170, 192, 178, 193,
    ],
    '(Met) Relative wind direction 1 ,1sec. (Max)': [
      185, 192, 178, 198, 168, 188, 172, 195, 182, 195,
    ],
    '(Nac) Nacelle position (Max)': [245, 258, 235, 268, 225, 252, 230, 262, 242, 265],
    '(Gbx) Oil pressure ,Act. (Max)': [2.5, 2.8, 2.2, 3.1, 1.9, 2.6, 2.1, 2.9, 2.4, 3.0],
    '(Cnv) Coolant Inlet Pressure ,1sec. (Max)': [2.8, 3.1, 2.5, 3.4, 2.2, 2.9, 2.4, 3.2, 2.7, 3.3],
    '(Cnv) Coolant Outlet Pressure ,1sec. (Max)': [
      2.4, 2.7, 2.1, 3.0, 1.9, 2.5, 2.0, 2.8, 2.3, 2.9,
    ],
    '(Cnv) Temp. Ambient Chopper (Max)': [
      38.5, 41.2, 36.5, 43.5, 34.5, 39.8, 35.5, 42.2, 37.8, 42.8,
    ],
    '(Cnv) Temp. Ambient Control zone (Max)': [
      32.5, 35.2, 30.5, 37.5, 28.5, 33.8, 29.5, 36.2, 31.8, 36.8,
    ],
    '(Cnv) Temp. Ambient Converter zone (Max)': [
      42.5, 45.8, 40.2, 48.5, 38.5, 43.8, 39.5, 46.5, 41.8, 47.8,
    ],
    '(Cnv) Temp. Ambient Grid cell (Max)': [
      48.5, 51.8, 46.2, 54.5, 44.5, 49.8, 45.5, 52.5, 47.8, 53.8,
    ],
    '(Cnv) Temp. Ambient Machine cell (Max)': [
      55.2, 58.5, 52.8, 61.2, 50.5, 56.5, 51.5, 59.2, 54.2, 60.5,
    ],
    '(Cnv) Temp. Heatsink GSC 1 (Max)': [
      52.5, 55.8, 50.2, 58.5, 48.5, 53.8, 49.5, 56.5, 51.8, 57.8,
    ],
    '(Cnv) Temp. Heatsink GSC 2 (Max)': [
      53.2, 56.5, 50.8, 59.2, 49.2, 54.5, 50.2, 57.2, 52.5, 58.5,
    ],
    '(Cnv) Temp. Heatsink MSC 1 (Max)': [
      58.5, 61.8, 56.2, 64.5, 54.5, 59.8, 55.5, 62.5, 57.8, 63.8,
    ],
    '(Cnv) Temp. Heatsink MSC 2 (Max)': [
      59.2, 62.5, 56.8, 65.2, 55.2, 60.5, 56.2, 63.2, 58.5, 64.5,
    ],
    '(Cnv) Temp. Inlet Coolant Liquid (Max)': [
      28.5, 31.2, 26.5, 33.5, 24.5, 29.8, 25.5, 32.2, 27.8, 32.8,
    ],
    '(Hy) HSS Brake 1 pressure ,1sec. (Max)': [185, 192, 178, 198, 168, 188, 172, 195, 182, 195],
    '(Hy) HSS Brake 2 charging pressure ,1sec. (Max)': [
      92.5, 95.8, 89.5, 98.5, 86.5, 94.2, 88.5, 96.5, 91.5, 97.8,
    ],
    '(Hy) HSS Brake 2 pressure ,1sec. (Max)': [
      88.5, 92.2, 85.5, 95.2, 82.5, 90.5, 84.5, 93.2, 87.5, 94.5,
    ],
    '(Brk) Brake temp. B1 ,1sec. (Max)': [
      42.5, 45.8, 40.2, 48.5, 38.5, 43.8, 39.5, 46.5, 41.8, 47.8,
    ],
    '(Brk) Brake temp. B2 ,1sec. (Max)': [
      41.8, 45.2, 39.5, 47.8, 37.8, 43.2, 38.8, 45.8, 41.2, 47.2,
    ],
    '(Brk) Brake temp. Max ,1sec. (Max)': [
      45.2, 48.5, 43.2, 51.5, 41.5, 46.5, 42.5, 49.2, 44.5, 50.5,
    ],
    '(Cl) Coolant Pump Inlet Pressure ,1sec. (Max)': [
      3.5, 3.8, 3.2, 4.1, 3.0, 3.6, 3.1, 3.9, 3.4, 4.0,
    ],
    '(Cl) Coolant Pump Outlet Pressure ,1sec. (Max)': [
      4.2, 4.5, 3.9, 4.8, 3.8, 4.3, 3.8, 4.6, 4.1, 4.7,
    ],
    '(Gri) Current L1 ,1sec. (Max)': [820, 855, 795, 875, 765, 835, 780, 860, 810, 870],
    '(Gri) Current L2 ,1sec. (Max)': [815, 850, 790, 870, 760, 830, 775, 855, 805, 865],
    '(Gri) Current L3 ,1sec. (Max)': [825, 860, 800, 880, 770, 840, 785, 865, 815, 875],
    '(Gri) Frequency ,10min. (Max)': [50.2, 50.4, 50.0, 50.6, 49.8, 50.3, 49.9, 50.5, 50.1, 50.5],
    '(Gri) Voltage L1 L2 L3 ,1sec. (Max)': [690, 695, 685, 700, 680, 692, 682, 698, 688, 698],
    '(Gbx) Gear speed ,Act. (Max)': [1520, 1580, 1460, 1620, 1380, 1540, 1420, 1590, 1500, 1610],
    '(Cnv) Cnv-Generator Active Power (Max)': [
      1850, 1920, 1780, 1950, 1680, 1880, 1720, 1900, 1840, 1930,
    ],
    '(Ctl) Max Temp. Safety Terminals HCC (Max)': [
      38.5, 41.2, 36.5, 43.5, 34.5, 39.8, 35.5, 42.2, 37.8, 42.8,
    ],
    '(Ctl) Max Temp. Safety Terminals NCC (Max)': [
      36.2, 38.8, 34.5, 41.2, 32.5, 37.5, 33.5, 39.8, 35.5, 40.8,
    ],
    '(Ctl) Max Temp. Safety Terminals TCC (Max)': [
      32.5, 35.2, 30.5, 37.5, 28.5, 33.8, 29.5, 36.2, 31.8, 36.8,
    ],
    '(Ctl) Setpoint val. active power (Max)': [
      1800, 1880, 1740, 1920, 1650, 1830, 1680, 1860, 1800, 1900,
    ],
    '(Gn) Generator speed ,Act. (Max)': [
      1680, 1750, 1620, 1790, 1550, 1700, 1580, 1740, 1660, 1770,
    ],
    '(Gri) Apparent power ,1sec. (Max)': [
      2150, 2220, 2080, 2250, 1980, 2180, 2020, 2200, 2140, 2240,
    ],
    '(Gri) Current L1 ,10min. (Max)': [800, 835, 775, 855, 745, 815, 760, 840, 790, 850],
    '(Gri) Current L2 ,10min. (Max)': [795, 830, 770, 850, 740, 810, 755, 835, 785, 845],
    '(Gri) Current L3 ,10min. (Max)': [805, 840, 780, 860, 750, 820, 765, 845, 795, 855],
    '(Gri) Reactive power ,10min. (Max)': [250, 265, 238, 275, 225, 258, 232, 268, 245, 272],
    '(Gri) Reactive power MFR300 ,Act. (Max)': [280, 295, 265, 305, 248, 285, 258, 298, 275, 302],
    '(Gri) Voltage L1 ,10min. (Max)': [400, 402, 398, 404, 396, 401, 397, 403, 399, 403],
    '(Gri) Voltage L1 ,1sec. (Max)': [398, 400, 396, 402, 394, 399, 395, 401, 397, 401],
    '(Gri) Voltage L1 L2 L3 ,30sec. (Max)': [690, 692, 688, 694, 686, 691, 687, 693, 689, 693],
    '(Gri) Voltage L1 L2 L3 ,Act. (Max)': [692, 694, 690, 696, 688, 693, 689, 695, 691, 695],
    '(Gri) Voltage L2 ,10min. (Max)': [398, 400, 396, 402, 394, 399, 395, 401, 397, 401],
    '(Gri) Voltage L2 ,1sec. (Max)': [396, 398, 394, 400, 392, 397, 393, 399, 395, 399],
    '(Gri) Voltage L3 ,10min. (Max)': [402, 404, 400, 406, 398, 403, 399, 405, 401, 405],
    '(Gri) Voltage L3 ,1sec. (Max)': [400, 402, 398, 404, 396, 401, 397, 403, 399, 403],
    '(Met) Outdoor temp. ,1sec. (Max)': [
      18.5, 21.2, 16.5, 23.5, 14.5, 19.8, 15.5, 22.2, 17.8, 22.8,
    ],
    '(Nac) Nacelle temp. front ,1sec. (Max)': [
      25.5, 28.2, 23.5, 30.5, 21.5, 26.8, 22.5, 29.2, 24.8, 29.8,
    ],
    '(Nac) Nacelle temp. rear ,1sec. (Max)': [
      24.8, 27.5, 22.8, 29.8, 20.8, 26.2, 21.8, 28.5, 24.2, 29.2,
    ],
    '(Rot) Temp.sw.cab.Hub ,1sec. (Max)': [
      32.5, 35.2, 30.5, 37.5, 28.5, 33.8, 29.5, 36.2, 31.8, 36.8,
    ],
    '(Tow) Temp.sw.cab.1 Tower ,1sec. (Max)': [
      22.5, 25.2, 20.5, 27.5, 18.5, 23.8, 19.5, 26.2, 21.8, 27.2,
    ],
    'Torquem. setpoint inverter (Max)': [
      4250, 4420, 4100, 4550, 3850, 4320, 3950, 4480, 4200, 4520,
    ],
  };

  // Generate rows for each selected parameter
  return parameters.map((param, paramIndex) => {
    const base = parameterBaseValues[param] || [50, 52, 48, 54, 45, 51, 47, 53, 49, 52];
    const values: Pick<
      TemperatureAlertRow,
      't01' | 't02' | 't03' | 't04' | 't05' | 't06' | 't07' | 't08' | 't09' | 't10'
    > = {
      t01: '-',
      t02: '-',
      t03: '-',
      t04: '-',
      t05: '-',
      t06: '-',
      t07: '-',
      t08: '-',
      t09: '-',
      t10: '-',
    };
    const selectedValues: number[] = [];

    turbineIds.forEach((tid) => {
      const idx = parseInt(tid.replace('t', '')) - 1;
      const baseVal = base[idx] || 50;
      const variation = Math.random() * 6 - 3;
      const val = (baseVal + variation).toFixed(2);
      values[tid as keyof typeof values] = val;
      selectedValues.push(parseFloat(val));
    });

    const avg =
      selectedValues.length > 0
        ? (selectedValues.reduce((a, b) => a + b, 0) / selectedValues.length).toFixed(2)
        : '-';

    return {
      id: paramIndex + 1,
      parameter: param,
      t01: values.t01,
      t02: values.t02,
      t03: values.t03,
      t04: values.t04,
      t05: values.t05,
      t06: values.t06,
      t07: values.t07,
      t08: values.t08,
      t09: values.t09,
      t10: values.t10,
      avg,
    };
  });
};

// ─── Event Log Data ──────────────────────────────────────────────────────────────

export interface EventLogRow {
  id: number;
  turbine: string;
  statusCode: string;
  statusDesc: string;
  opmode: string;
  type: string;
  atype: string;
  timestamp: string;
  bladeAngle: string;
  gbxSpeed: string;
  genSpeed: string;
  hydPressure: string;
  rotSpeed: string;
  activePower: string;
  windSpeed: string;
}

export const getEventLogRows = (
  fromDate: Dayjs,
  toDate: Dayjs,
  turbines: string[],
): EventLogRow[] => {
  const rows: EventLogRow[] = [];
  const statusCodes = ['Stop', 'Standstill', 'Run', 'Service', 'Maintenance'];
  const statusDescs = [
    'Grid Available',
    'Remote Controlled',
    'Local Controlled',
    'WTU Communication OK',
    'Yaw Position Active',
  ];
  const opmodes = ['STOP', 'STBY', 'RUN', 'SVC', 'MNT'];
  const types = ['0', '1', '2', '3'];
  const atypes = ['A', 'B', 'C', 'D'];

  let id = 1;
  turbines.forEach((turbine) => {
    const days = toDate.diff(fromDate, 'day') + 1;
    for (let d = 0; d < Math.min(days, 5); d++) {
      const date = fromDate.add(d, 'day');
      for (let h = 0; h < 4; h++) {
        rows.push({
          id: id++,
          turbine,
          statusCode: statusCodes[Math.floor(Math.random() * statusCodes.length)],
          statusDesc: statusDescs[Math.floor(Math.random() * statusDescs.length)],
          opmode: opmodes[Math.floor(Math.random() * opmodes.length)],
          type: types[Math.floor(Math.random() * types.length)],
          atype: atypes[Math.floor(Math.random() * atypes.length)],
          timestamp: date.format('YYYY-MM-DD HH:mm'),
          bladeAngle: (Math.random() * 5).toFixed(1),
          gbxSpeed: (20 + Math.random() * 10).toFixed(1),
          genSpeed: (1200 + Math.random() * 200).toFixed(0),
          hydPressure: (180 + Math.random() * 40).toFixed(0),
          rotSpeed: (12 + Math.random() * 3).toFixed(1),
          activePower: (800 + Math.random() * 1500).toFixed(0),
          windSpeed: (5 + Math.random() * 10).toFixed(1),
        });
      }
    }
  });

  return rows;
};

// ─── Downtime Analysis Data ─────────────────────────────────────────────────────

export interface DowntimeAnalysisRow {
  id: number;
  turbine: string;
  totalHours: string;
  count: number;
  downTime: string;
  mtbf: string;
  mttr: string;
}

export const getDowntimeAnalysisRows = (
  fromDate: Dayjs,
  toDate: Dayjs,
  turbines: string[],
): DowntimeAnalysisRow[] => {
  const days = toDate.diff(fromDate, 'day') + 1;
  const totalHours = days * 24;

  return turbines.map((turbine, idx) => {
    const seed = idx * 17 + days;
    const downCount = Math.floor(1 + (seed % 5));
    const downHours = Math.floor(5 + (seed % 50));
    const mtbfHours = Math.floor(totalHours / (downCount + 1));
    const mttrHours = Math.floor(downHours / downCount);

    return {
      id: idx + 1,
      turbine,
      totalHours: totalHours.toString(),
      count: downCount,
      downTime: `${Math.floor(downHours / 24)}d ${downHours % 24}h`,
      mtbf: `${Math.floor(mtbfHours / 24)}d ${mtbfHours % 24}h`,
      mttr: `${Math.floor(mttrHours / 24)}d ${mttrHours % 24}h`,
    };
  });
};

// ─── Machine Availability Data ──────────────────────────────────────────────────

export interface MachineAvailabilityRow {
  id: number;
  date: string;
  t01: string;
  t02: string;
  t03: string;
  t04: string;
  t05: string;
  t06: string;
  t07: string;
  t08: string;
  t09: string;
  t10: string;
  avg: string;
}

export const getMachineAvailabilityRows = (
  fromDate: Dayjs,
  toDate: Dayjs,
  turbines: string[],
): MachineAvailabilityRow[] => {
  const rows: MachineAvailabilityRow[] = [];
  const days = toDate.diff(fromDate, 'day') + 1;
  const turbineIds = turbines.map((t) => t.replace('T-', 't').toLowerCase());

  for (let d = 0; d < Math.min(days, 30); d++) {
    const date = fromDate.add(d, 'day');
    const values: Pick<
      MachineAvailabilityRow,
      't01' | 't02' | 't03' | 't04' | 't05' | 't06' | 't07' | 't08' | 't09' | 't10'
    > = {
      t01: '-',
      t02: '-',
      t03: '-',
      t04: '-',
      t05: '-',
      t06: '-',
      t07: '-',
      t08: '-',
      t09: '-',
      t10: '-',
    };
    const selectedValues: number[] = [];

    turbineIds.forEach((tid) => {
      const idx = parseInt(tid.replace('t', '')) - 1;
      const baseAvail = 85 + idx * 1.2;
      const val = Math.min(100, Math.max(70, baseAvail + (Math.random() * 10 - 5))).toFixed(2);
      values[tid as keyof typeof values] = val;
      selectedValues.push(parseFloat(val));
    });

    const avg =
      selectedValues.length > 0
        ? (selectedValues.reduce((a, b) => a + b, 0) / selectedValues.length).toFixed(2)
        : '-';

    rows.push({
      id: d + 1,
      date: date.format('YYYY-MM-DD'),
      ...values,
      avg,
    } as MachineAvailabilityRow);
  }

  return rows;
};
