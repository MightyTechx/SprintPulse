import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Typography,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Checkbox,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import BuildIcon from '@mui/icons-material/Build';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import SpeedIcon from '@mui/icons-material/Speed';
import AirIcon from '@mui/icons-material/Air';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SettingsIcon from '@mui/icons-material/Settings';
import TableChartIcon from '@mui/icons-material/TableChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import GridViewIcon from '@mui/icons-material/GridView';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SearchIcon from '@mui/icons-material/Search';
import BoltIcon from '@mui/icons-material/Bolt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RouterIcon from '@mui/icons-material/Router';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAdminKeyframes, useAuth, useLiveDateTime } from '../../../hooks';
import { useStyles } from './styles';
import { TICKET_STATUS_CONFIG, Ticket } from './types/sprintData.types';
import { MOCK_SPRINT_DATA, MOCK_TICKETS } from './utils/dashboard.utils';
import type { SprintData } from '../../../utils/mockData';
import { getActualEffort } from './utils/effortCalculations';
import { constants } from '@sprintpulse/utils';
import { Column, DataTable, Card } from '@sprintpulse/component';

// ─── Constants ────────────────────────────────────────────────────────────────

type ChartType = 'bar' | 'line';

const ALL_TEAMS = [
  'Wookies',
  'Spaceroovers',
  'Weagles',
  'Baby Groot',
  'Gladiators',
  'Transformers',
];
const SELECT_ALL = '__select_all__';

const TEAM_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const MIN_DATE = dayjs('2026-01-01');
const MAX_DATE = dayjs().startOf('day');

const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const getTeamData = (team: string, dateStr: string): number => {
  const teamIndex = ALL_TEAMS.indexOf(team);
  const baseValues = [15, 12, 18, 10, 14, 16]; // Story points baseline for each team
  const [y, m, d] = dateStr.split('-').map(Number);
  const seed = (y % 100) * 10000 + m * 100 + d + teamIndex * 100;
  const variation = ((seed + teamIndex * 97 + teamIndex * teamIndex * 13) % 40) - 20; // Less variation for story points
  return Math.max(0, Math.round((baseValues[teamIndex] ?? 10) + variation));
};

const getChartData = (from: Dayjs, to: Dayjs, teams: string[]) => {
  const fromDate = from.toDate();
  const toDate = to.toDate();
  const totalDays = Math.round((toDate.getTime() - fromDate.getTime()) / 86_400_000) + 1;

  const teamIndices = teams.map((no) => ALL_TEAMS.indexOf(no));

  const categories: string[] = [];
  const buckets: number[][] = teamIndices.map(() => []);
  let aggregate: 'daily' | 'weekly' | 'monthly' = 'daily';

  if (totalDays <= 31) {
    // ── Daily ──
    aggregate = 'daily';
    for (let d = 0; d < totalDays; d++) {
      const date = new Date(fromDate);
      date.setDate(fromDate.getDate() + d);
      categories.push(date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
      const dateStr = toDateStr(date);
      teams.forEach((team, i) => {
        buckets[i].push(getTeamData(team, dateStr));
      });
    }
  } else if (totalDays <= 180) {
    // ── Weekly ──
    aggregate = 'weekly';
    const wStart = new Date(fromDate);
    while (wStart <= toDate) {
      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + 6);
      if (wEnd > toDate) wEnd.setTime(toDate.getTime());
      categories.push(wStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
      const sums = teamIndices.map(() => 0);
      const cur = new Date(wStart);
      while (cur <= wEnd) {
        const dateStr = toDateStr(cur);
        teams.forEach((team, i) => {
          sums[i] += getTeamData(team, dateStr);
        });
        cur.setDate(cur.getDate() + 1);
      }
      sums.forEach((s, i) => buckets[i].push(Math.round(s)));
      wStart.setDate(wStart.getDate() + 7);
    }
  } else {
    // ── Monthly ──
    aggregate = 'monthly';
    const cur = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
    const end = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
    while (cur <= end) {
      const yr = cur.getFullYear();
      const mo = cur.getMonth();
      const dim = new Date(yr, mo + 1, 0).getDate();
      categories.push(cur.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }));
      const sums = teamIndices.map(() => 0);
      for (let d = 1; d <= dim; d++) {
        const day = new Date(yr, mo, d);
        if (day < fromDate || day > toDate) continue;
        const dateStr = toDateStr(day);
        teams.forEach((team, i) => {
          sums[i] += getTeamData(team, dateStr);
        });
      }
      sums.forEach((s, i) => buckets[i].push(Math.round(s)));
      cur.setMonth(cur.getMonth() + 1);
    }
  }

  const series = teams.map((name, i) => ({ name, data: buckets[i] }));
  const allVals = buckets.flat();
  const totalEnergy = allVals.reduce((a, b) => a + b, 0);
  const peakValue = allVals.length ? Math.max(...allVals) : 0;
  const avgPerDay = totalDays > 0 ? Math.round(totalEnergy / totalDays) : 0;

  return { categories, series, aggregate, totalDays, totalEnergy, peakValue, avgPerDay };
};

// ─── Component ────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { classes } = useStyles();
  const { AdminPath } = constants;
  const navigate = useNavigate();
  const keyframes = useAdminKeyframes();
  const { user } = useAuth();
  const userName =
    user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Admin';
  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const { hours, minutes, seconds, dateStr, tzAbbr, tzRegion, utcOffset } = useLiveDateTime();

  const [sprintData, setSprintData] = useState<SprintData[]>(MOCK_SPRINT_DATA);
  const [view, setView] = useState<'table' | 'chart' | 'incentive'>('table');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [fromDate, setFromDate] = useState<Dayjs>(MIN_DATE);
  const [toDate, setToDate] = useState<Dayjs>(MAX_DATE);
  const [selectedSprints, setSelectedSprints] = useState<string[]>(ALL_TEAMS);

  // Ticket search (used by the ticket table on the Dashboard)
  const [ticketSearch, setTicketSearch] = useState('');

  const filteredTickets = useMemo(() => {
    if (!ticketSearch) return MOCK_TICKETS;
    const q = ticketSearch.toLowerCase();
    return MOCK_TICKETS.filter(
      (t) =>
        String(t.id).includes(q) ||
        t.team.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q) ||
        t.issueType.toLowerCase().includes(q) ||
        t.issueNo.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.timeLoggingId.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q) ||
        t.fixVersion.toLowerCase().includes(q),
    );
  }, [ticketSearch]);

  // Incentive data
  const INCENTIVE_DATA = [
    { dateRange: '2026-05-13', actual: 4.2, forecast: 4.8, delta: 0.6, fer: '--', incentive: 0.0 },
    {
      dateRange: '2026-05-12',
      actual: 40.9,
      forecast: 6.7,
      delta: 34.2,
      fer: '27.7',
      incentive: 0.0,
    },
    {
      dateRange: 'This Month',
      actual: 882.3,
      forecast: 687.9,
      delta: 194.4,
      fer: '9.9',
      incentive: 1.12,
    },
    {
      dateRange: '2026-04',
      actual: 1620.1,
      forecast: 1629.0,
      delta: 8.9,
      fer: '15.0',
      incentive: 1.49,
    },
    {
      dateRange: '2026-03',
      actual: 2180.7,
      forecast: 2293.7,
      delta: 113.0,
      fer: '11.8',
      incentive: 3.02,
    },
    {
      dateRange: '2026-02',
      actual: 3229.8,
      forecast: 3504.1,
      delta: 274.4,
      fer: '10.7',
      incentive: 6.69,
    },
  ];

  // Separate search state for incentive table
  const [incentiveSearch, setIncentiveSearch] = useState('');

  const filteredIncentiveData = INCENTIVE_DATA.filter((row) => {
    // Filter based on date range
    if (row.dateRange === 'This Month') {
      return fromDate.isSame(toDate, 'month') || true; // Always show this month summary
    }
    const rowDate = row.dateRange;
    if (rowDate.includes('-')) {
      const parts = rowDate.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);
        const rowDateObj = toDate
          .year(year)
          .month(month - 1)
          .date(day);
        if (
          !rowDateObj.isAfter(fromDate.subtract(1, 'day')) ||
          !rowDateObj.isBefore(toDate.add(1, 'day'))
        ) {
          return false;
        }
      }
    }
    // Search filter
    if (incentiveSearch) {
      const q = incentiveSearch.toLowerCase();
      return (
        row.dateRange.toLowerCase().includes(q) ||
        String(row.actual).includes(q) ||
        String(row.forecast).includes(q) ||
        String(row.delta).includes(q) ||
        row.fer.includes(q) ||
        String(row.incentive).includes(q)
      );
    }
    return true;
  });

  useEffect(() => {
    const id = setInterval(() => {
      setSprintData((prev) =>
        prev.map((t) => {
          if (t.status === 'active') {
            return {
              ...t,
              time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
              sprintProgress: Math.max(
                0,
                Math.min(100, t.sprintProgress + (Math.random() - 0.5) * 2),
              ),
              storyPointsCompleted: Math.max(0, t.storyPointsCompleted + Math.random() * 0.5),
              teamVelocity: Math.max(0, t.teamVelocity + (Math.random() - 0.5) * 0.3),
            };
          }
          return { ...t, time: new Date().toLocaleTimeString('en-GB', { hour12: false }) };
        }),
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // ── Sprint stats ──────────────────────────────────────────────────────────────
  const activeSprintCount = sprintData.filter((t) => t.status === 'active').length;
  const totalStoryPoints = sprintData
    .filter((t) => t.status === 'active')
    .reduce((s, t) => s + t.storyPointsCompleted, 0);
  const avgVelocity = (
    sprintData.filter((t) => t.status === 'active').reduce((s, t) => s + t.teamVelocity, 0) /
    (activeSprintCount || 1)
  ).toFixed(1);
  const totalPlannedPoints = sprintData.reduce((s, t) => s + t.plannedPoints, 0);
  const completedSprintCount = sprintData.filter((t) => t.status === 'completed').length;
  const upcomingSprintCount = sprintData.filter((t) => t.status === 'upcoming').length;
  const doneCount = MOCK_TICKETS.filter((t) => t.status === 'Done').length;
  const fmtVal = (v: number, dec = 1) => v.toFixed(dec);

  // ── Chart data ────────────────────────────────────────────────────────────────
  const chartData = useMemo(
    () => getChartData(fromDate, toDate, selectedSprints.length ? selectedSprints : ALL_TEAMS),
    [fromDate, toDate, selectedSprints],
  );

  const seriesColors = (selectedSprints.length ? selectedSprints : ALL_TEAMS).map(
    (t) => TEAM_COLORS[ALL_TEAMS.indexOf(t)] ?? '#6366f1',
  );

  const axisLabelCount = Math.min(chartData.categories.length, 20);
  const rotateLabels = chartData.categories.length > 15;

  const commonAxisX: ApexOptions['xaxis'] = {
    categories: chartData.categories,
    title: {
      text: `Sprint · ${chartData.aggregate}`,
      style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' },
    },
    labels: {
      style: {
        colors: Array(chartData.categories.length).fill('#64748b'),
        fontSize: '10px',
        fontWeight: '500',
      },
      rotate: rotateLabels ? 45 : 0,
      trim: true,
    },
  };

  const commonAxisY: ApexOptions['yaxis'] = {
    title: {
      text: 'Story Points',
      style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' },
    },
    min: 0,
    max: 600,
    tickAmount: 6,
  };

  const commonGrid: ApexOptions['grid'] = {
    borderColor: '#f1f5f9',
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { left: 8, right: 8 },
  };

  const commonLegend: ApexOptions['legend'] = {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'inherit',
    labels: { colors: Array(10).fill('#475569') },
    markers: { size: 8 },
    itemMargin: { horizontal: 10, vertical: 8 },
    onItemClick: { toggleDataSeries: true },
    onItemHover: { highlightDataSeries: true },
  };

  const commonTooltip: ApexOptions['tooltip'] = {
    theme: 'light',
    shared: true,
    intersect: false,
    style: { fontSize: '12px', fontFamily: 'inherit' },
    y: { formatter: (val: number) => `${Math.round(val)} pts` },
  };

  const barOptions: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'inherit',
      animations: { enabled: true, speed: 600, animateGradually: { enabled: true, delay: 20 } },
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        columnWidth: '78%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: { enabled: false },
    fill: { opacity: 0.92 },
    colors: seriesColors,
    xaxis: commonAxisX,
    yaxis: commonAxisY,
    grid: commonGrid,
    legend: commonLegend,
    tooltip: commonTooltip,
  };

  const lineOptions: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'inherit',
      animations: { enabled: true, speed: 800 },
    },
    stroke: { curve: 'smooth', width: 2.5 },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.4,
        opacityFrom: 0.3,
        opacityTo: 0.02,
        stops: [0, 90],
      },
    },
    markers: { size: 0, hover: { size: 5, sizeOffset: 2 } },
    colors: seriesColors,
    xaxis: commonAxisX,
    yaxis: commonAxisY,
    grid: commonGrid,
    legend: commonLegend,
    tooltip: commonTooltip,
    dataLabels: { enabled: false },
  };

  // ── Dynamic KPI cards (memoized to prevent recreation on every render) ─────────
  const aggLabel =
    chartData.aggregate === 'daily' ? 'day' : chartData.aggregate === 'weekly' ? 'week' : 'month';

  const kpiCards = useMemo(
    () => [
      {
        icon: <BoltIcon sx={{ color: '#4f46e5', fontSize: 20 }} />,
        bg: 'rgba(79,70,229,0.12)',
        border: 'rgba(79,70,229,0.3)',
        value: chartData.totalEnergy.toLocaleString(),
        label: 'Total Story Points',
        valueColor: '#4f46e5',
      },
      {
        icon: <TrendingUpIcon sx={{ color: '#10b981', fontSize: 20 }} />,
        bg: 'rgba(16,185,129,0.12)',
        border: 'rgba(16,185,129,0.3)',
        value: chartData.totalEnergy.toLocaleString(),
        label: 'Total Points Completed',
        valueColor: '#10b981',
      },
      {
        icon: <CalendarMonthIcon sx={{ color: '#0891b2', fontSize: 20 }} />,
        bg: 'rgba(8,145,178,0.12)',
        border: 'rgba(8,145,178,0.3)',
        value: `${chartData.avgPerDay}`,
        label: 'Avg Points / Day',
        valueColor: '#0891b2',
      },
      {
        icon: <RouterIcon sx={{ color: '#f59e0b', fontSize: 20 }} />,
        bg: 'rgba(245,158,11,0.12)',
        border: 'rgba(245,158,11,0.3)',
        value: `${selectedSprints.length || ALL_TEAMS.length}`,
        label: 'Teams',
        valueColor: '#f59e0b',
      },
    ],
    [chartData, fromDate, toDate, selectedSprints],
  );

  // ── Ticket table columns (15 columns in the requested order) ────────────────
  const ticketColumns: Column<Ticket>[] = useMemo(
    () => [
      {
        id: 'id',
        label: 'S. No',
        minWidth: 60,
        align: 'center',
        format: (_v, row) => (
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>
            {String((row as Ticket).id)}
          </Typography>
        ),
      },
      { id: 'team', label: 'Team', minWidth: 100, align: 'center' },
      { id: 'assignee', label: 'Assignee', minWidth: 140, align: 'center' },
      {
        id: 'issueType',
        label: 'Issue Type',
        minWidth: 100,
        align: 'center',
        format: (v) => {
          const palette: Record<string, { bg: string; fg: string; border: string }> = {
            Story: { bg: 'rgba(99,102,241,0.12)', fg: '#4f46e5', border: 'rgba(99,102,241,0.3)' },
            Task: { bg: 'rgba(6,182,212,0.12)', fg: '#0891b2', border: 'rgba(6,182,212,0.3)' },
            Bug: { bg: 'rgba(239,68,68,0.12)', fg: '#ef4444', border: 'rgba(239,68,68,0.3)' },
            Epic: { bg: 'rgba(139,92,246,0.12)', fg: '#7c3aed', border: 'rgba(139,92,246,0.3)' },
            Spike: { bg: 'rgba(245,158,11,0.12)', fg: '#d97706', border: 'rgba(245,158,11,0.3)' },
          };
          const p = palette[String(v)] ?? palette.Task;
          return (
            <Chip
              size='small'
              label={String(v)}
              sx={{
                background: p.bg,
                border: `1px solid ${p.border}`,
                color: p.fg,
                fontWeight: 600,
                fontSize: '0.65rem',
                height: 22,
              }}
            />
          );
        },
      },
      {
        id: 'issueNo',
        label: 'Issue No',
        minWidth: 110,
        align: 'center',
        format: (v) => (
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              fontFamily: 'monospace',
              color: '#4f46e5',
            }}
          >
            {String(v)}
          </Typography>
        ),
      },
      {
        id: 'summary',
        label: 'Summary',
        minWidth: 220,
        align: 'left',
        format: (v) => (
          <Typography
            sx={{
              fontSize: '0.78rem',
              fontWeight: 500,
              color: 'text.primary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 280,
            }}
            title={String(v)}
          >
            {String(v)}
          </Typography>
        ),
      },
      { id: 'timeLoggingId', label: 'Time Logging ID', minWidth: 120, align: 'center' },
      {
        id: 'status',
        label: 'Status',
        minWidth: 110,
        align: 'center',
        format: (v) => {
          const cfg = TICKET_STATUS_CONFIG[v as Ticket['status']];
          if (!cfg) return <Typography sx={{ fontSize: '0.75rem' }}>{String(v)}</Typography>;
          return (
            <Chip
              size='small'
              label={cfg.label}
              sx={{
                background: cfg.bgColor,
                border: `1px solid ${cfg.borderColor}`,
                color: cfg.color,
                fontWeight: 600,
                fontSize: '0.65rem',
                height: 22,
              }}
            />
          );
        },
      },
      {
        id: 'storyPoints',
        label: 'Story Points',
        minWidth: 90,
        align: 'center',
        format: (v) => (
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>{String(v)}</Typography>
        ),
      },
      {
        id: 'actualEffort',
        label: 'Actual Effort',
        minWidth: 100,
        align: 'center',
        format: (_v, row: Ticket) => (
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>
            {getActualEffort(row.storyPoints)}
          </Typography>
        ),
      },
      { id: 'fixVersion', label: 'Fix Version', minWidth: 100, align: 'center' },
      {
        id: 'carryForward',
        label: 'Carry Forward',
        minWidth: 120,
        align: 'center',
        format: (v) => {
          const sprint = String(v ?? '').trim();
          if (!sprint) {
            return (
              <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic' }}>
                —
              </Typography>
            );
          }
          return (
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                fontFamily: 'monospace',
                color: '#4f46e5',
              }}
            >
              {String(sprint)}
            </Typography>
          );
        },
      },
      { id: 'workStartDate', label: 'Work Start Date', minWidth: 120, align: 'center' },
      { id: 'workEndDate', label: 'Work End Date', minWidth: 120, align: 'center' },
    ],
    [],
  );

  return (
    <>
      {keyframes}
      <Box className={classes.container}>
        {/* ── Hero Header ── */}
        <Box className={classes.heroHeader}>
          <Box className={classes.heroLeft}>
            <Avatar className={classes.heroAvatar} src={user?.profilePicture || undefined}>
              {!user?.profilePicture && userInitials}
            </Avatar>
            <Box>
              <Typography className={classes.heroGreeting}>Welcome back</Typography>
              <Typography className={classes.heroTitle}>{userName}</Typography>
            </Box>
          </Box>
          <Box className={classes.heroCenterMobile}>
            <Typography className={classes.heroCenterMobileTitle}>AMFAM MATRIX</Typography>
            <Box className={classes.heroCenterMobileBadge}>
              <Box className={classes.heroCenterMobileDot} />
              <Typography className={classes.heroCenterMobileLive}>LIVE</Typography>
            </Box>
          </Box>
          <Box className={classes.heroCenter}>
            <Typography className={classes.heroCenterTitle}>AMFAM MATRIX</Typography>
            <Box className={classes.heroCenterBadge}>
              <Box className={classes.heroCenterDot} />
              <Typography className={classes.heroCenterLive}>Live Tracking Activity</Typography>
            </Box>
            <Typography className={classes.heroCenterFacilities}>
              Sprints · Tickets · Incidents · Team Workflows
            </Typography>
          </Box>
          <Box className={classes.heroRight}>
            <Box className={classes.heroClockWidget}>
              <Box className={classes.heroClockRow}>
                <Typography className={classes.heroClockHM}>
                  {hours}:{minutes}
                </Typography>
                <Typography className={classes.heroClockSec}>{seconds}</Typography>
              </Box>
              <Typography className={classes.heroClockDate}>{dateStr}</Typography>
              <Box className={classes.heroClockTz}>
                <Box className={classes.heroClockTzDot} />
                <Typography className={classes.heroClockTzText}>
                  {tzAbbr} · {tzRegion} · {utcOffset}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── Stat Cards ── */}
        <Box className={classes.statsRow}>
          {[
            {
              icon: <SettingsIcon sx={{ color: '#4f46e5', fontSize: 20 }} />,
              bg: 'rgba(79,70,229,0.12)',
              border: 'rgba(79,70,229,0.3)',
              value: sprintData.length,
              label: 'Team Members',
            },
            {
              icon: <PlayArrowIcon sx={{ color: '#10b981', fontSize: 20 }} />,
              bg: 'rgba(16,185,129,0.12)',
              border: 'rgba(16,185,129,0.3)',
              value: activeSprintCount,
              label: 'Sprint Number',
            },
            {
              icon: <FlashOnIcon sx={{ color: '#f59e0b', fontSize: 20 }} />,
              bg: 'rgba(245,158,11,0.12)',
              border: 'rgba(245,158,11,0.3)',
              value: fmtVal(totalStoryPoints, 0),
              label: 'Total Tickets',
            },
            {
              icon: <SpeedIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />,
              bg: 'rgba(139,92,246,0.12)',
              border: 'rgba(139,92,246,0.3)',
              value: fmtVal(totalPlannedPoints, 0),
              label: 'Total Incidents',
            },
            {
              icon: <BoltIcon sx={{ color: '#3b82f6', fontSize: 20 }} />,
              bg: 'rgba(59,130,246,0.12)',
              border: 'rgba(59,130,246,0.3)',
              value: avgVelocity,
              label: 'Total In-Progress',
            },
            {
              icon: (
                <CheckCircleIcon
                  sx={{ color: completedSprintCount > 0 ? '#10b981' : '#6b7280', fontSize: 20 }}
                />
              ),
              bg: completedSprintCount > 0 ? 'rgba(16,185,129,0.12)' : 'rgba(107,114,128,0.12)',
              border: completedSprintCount > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(107,114,128,0.3)',
              value: completedSprintCount,
              label: 'Total in-Review',
              valueColor: completedSprintCount > 0 ? '#10b981' : '#6b7280',
            },
            {
              icon: (
                <RefreshIcon
                  sx={{ color: upcomingSprintCount > 0 ? '#8b5cf6' : '#6b7280', fontSize: 20 }}
                />
              ),
              bg: upcomingSprintCount > 0 ? 'rgba(139,92,246,0.12)' : 'rgba(107,114,128,0.12)',
              border: upcomingSprintCount > 0 ? 'rgba(139,92,246,0.3)' : 'rgba(107,114,128,0.3)',
              value: upcomingSprintCount,
              label: 'Total In-Test',
              valueColor: upcomingSprintCount > 0 ? '#8b5cf6' : '#6b7280',
            },
            {
              icon: (
                <CheckCircleIcon
                  sx={{ color: doneCount > 0 ? '#10b981' : '#6b7280', fontSize: 20 }}
                />
              ),
              bg: doneCount > 0 ? 'rgba(16,185,129,0.12)' : 'rgba(107,114,128,0.12)',
              border: doneCount > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(107,114,128,0.3)',
              value: doneCount,
              label: 'Total Done',
              valueColor: doneCount > 0 ? '#10b981' : '#6b7280',
            },
          ].map(({ icon, bg, border, value, label, valueColor }) => (
            <Paper key={label} className={classes.statCard} elevation={0}>
              <Box
                className={classes.statCardIconWrap}
                sx={{ background: bg, border: `1px solid ${border}` }}
              >
                {icon}
              </Box>
              <Box>
                <Typography
                  className={classes.statCardValue}
                  sx={valueColor ? { color: valueColor } : {}}
                >
                  {value}
                </Typography>
                <Typography className={classes.statCardLabel}>{label}</Typography>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* ── Toolbar ── */}
        <Box className={classes.tableToolbar}>
          <Box className={classes.viewToggleGroup}>
            <Button
              variant={view === 'table' ? 'contained' : 'outlined'}
              startIcon={<TableChartIcon sx={{ fontSize: 18 }} />}
              onClick={() => setView('table')}
              className={view === 'table' ? classes.toggleBtnActive : classes.toggleBtnInactive}
            >
              Ticket Overview
            </Button>

            <Button
              variant={view === 'chart' ? 'contained' : 'outlined'}
              startIcon={
                chartType === 'bar' ? (
                  <BarChartIcon sx={{ fontSize: 18 }} />
                ) : (
                  <ShowChartIcon sx={{ fontSize: 18 }} />
                )
              }
              onClick={() => setView('chart')}
              className={
                view === 'chart' ? classes.toggleBtnActiveChart : classes.toggleBtnInactive
              }
            >
              Team Analytics
            </Button>

            <Button
              variant={view === 'incentive' ? 'contained' : 'outlined'}
              startIcon={<ShowChartIcon sx={{ fontSize: 18 }} />}
              onClick={() => setView('incentive')}
              className={
                view === 'incentive' ? classes.toggleBtnActiveIncentive : classes.toggleBtnInactive
              }
            >
              Incentive Report
            </Button>

            <Button
              variant='outlined'
              startIcon={<GridViewIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate(AdminPath.SPRINT_STATUS_MATRIX)}
              className={classes.toggleBtnInactive}
            >
              Sprint Status Matrix
            </Button>
          </Box>

          {view === 'table' && (
            <TextField
              placeholder='Search tickets…'
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
              size='small'
              className={classes.toolbarSearch}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        </Box>

        {/* ── Analytics Filter Panel - Team Analytics ── */}
        {view === 'chart' && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'auto repeat(5, 1fr)' },
              gap: 1.5,
              p: 1.5,
              mb: 2,
              background: '#ffffff',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              alignItems: 'center',
            }}
          >
            {/* Filter Icon Badge */}
            <Box className={classes.filterBadge}>
              <Box
                sx={{
                  width: 35,
                  height: 35,
                  borderRadius: 1.5,
                  background: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FilterListIcon sx={{ fontSize: 16, color: '#fff' }} />
              </Box>
            </Box>

            {/* Chart Type */}
            <FormControl size='small' sx={{ '& .MuiInputBase-root': { height: 40 } }}>
              <InputLabel sx={{ fontSize: '0.85rem' }}>Chart Type</InputLabel>
              <Select
                value={chartType}
                label='Chart Type'
                onChange={(e) => setChartType(e.target.value as ChartType)}
                sx={{ fontSize: '0.78rem' }}
              >
                <MenuItem value='bar'>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <BarChartIcon sx={{ fontSize: 16, color: '#4f46e5' }} />
                    <Typography sx={{ fontSize: '0.78rem' }}>Bar Chart</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value='line'>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <ShowChartIcon sx={{ fontSize: 16, color: '#06b6d4' }} />
                    <Typography sx={{ fontSize: '0.78rem' }}>Line Chart</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {/* Sprints */}
            <Autocomplete
              multiple
              disableCloseOnSelect
              size='small'
              options={[SELECT_ALL, ...ALL_TEAMS]}
              value={selectedSprints}
              onChange={(_, v) => {
                if (v.includes(SELECT_ALL)) {
                  setSelectedSprints(
                    selectedSprints.length === ALL_TEAMS.length ? [] : [...ALL_TEAMS],
                  );
                } else {
                  setSelectedSprints(v as string[]);
                }
              }}
              getOptionLabel={(o) => (o === SELECT_ALL ? 'Select All' : o)}
              isOptionEqualToValue={(opt, val) => opt === val}
              renderOption={(props, option, { selected }) => {
                if (option === SELECT_ALL) {
                  const allSelected = selectedSprints.length === ALL_TEAMS.length;
                  const indeterminate = selectedSprints.length > 0 && !allSelected;
                  return (
                    <li
                      {...props}
                      key={SELECT_ALL}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 8px',
                      }}
                    >
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 14 }} />}
                        checkedIcon={<CheckBoxIcon sx={{ fontSize: 14 }} />}
                        indeterminateIcon={<IndeterminateCheckBoxIcon sx={{ fontSize: 14 }} />}
                        checked={allSelected}
                        indeterminate={indeterminate}
                        size='small'
                      />
                      <Typography sx={{ fontWeight: 600, color: '#4f46e5', fontSize: '0.78rem' }}>
                        Select All
                      </Typography>
                    </li>
                  );
                }
                const colorIdx = ALL_TEAMS.indexOf(option);
                return (
                  <li
                    {...props}
                    key={option}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px' }}
                  >
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 14 }} />}
                      checkedIcon={<CheckBoxIcon sx={{ fontSize: 14 }} />}
                      checked={selected}
                      size='small'
                    />
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: TEAM_COLORS[colorIdx],
                        flexShrink: 0,
                      }}
                    />
                    <Typography sx={{ fontSize: '0.78rem' }}>{option}</Typography>
                  </li>
                );
              }}
              renderTags={(value) => (
                <Chip
                  label={
                    value.length === ALL_TEAMS.length
                      ? `All (${value.length})`
                      : `${value.length} selected`
                  }
                  size='small'
                  sx={{
                    height: 24,
                    fontSize: '0.7rem',
                    background: 'primary.light',
                    color: 'primary.main',
                    fontWeight: 600,
                  }}
                />
              )}
              renderInput={(params) => (
                <TextField {...params} label='Teams' placeholder='Select…' size='small' />
              )}
              ListboxProps={{ sx: { maxHeight: 200 } }}
            />

            {/* From Date */}
            <DatePicker
              label='From Date'
              value={fromDate}
              onChange={(v) => {
                if (v && v.isValid()) setFromDate(v);
              }}
              minDate={MIN_DATE}
              maxDate={toDate}
              slotProps={{
                textField: {
                  size: 'small',
                },
              }}
            />

            {/* To Date */}
            <DatePicker
              label='To Date'
              value={toDate}
              onChange={(v) => {
                if (v && v.isValid()) setToDate(v);
              }}
              minDate={fromDate}
              maxDate={MAX_DATE}
              slotProps={{
                textField: {
                  size: 'small',
                },
              }}
            />

            {/* Range info chip */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gridColumn: { xs: '1 / -1', md: 'unset' },
              }}
            >
              <Chip
                label={`${chartData.totalDays}d · ${chartData.aggregate}`}
                size='small'
                sx={{
                  height: 26,
                  fontSize: '0.7rem',
                  background: 'primary.light',
                  color: 'primary.main',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>
        )}

        {/* ── Content ── */}
        {view === 'table' ? (
          <DataTable
            columns={ticketColumns}
            data={filteredTickets}
            rowKey='id'
            searchable={false}
            initialRowsPerPage={10}
            onRowClick={(row) => {
              const t = row as Ticket;
              navigate(AdminPath.TICKET_DETAIL.replace(':id', encodeURIComponent(t.issueNo)));
            }}
          />
        ) : view === 'chart' ? (
          /* ── Team Analytics Card ── */
          <Card cardVariant='default'>
            {/* Card Header */}
            <Box
              sx={{
                px: 0,
                pt: 2,
                pb: 2,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                gap: { xs: 1.5, md: 0 },
                background:
                  'linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(124,58,237,0.02) 100%)',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
                    flexShrink: 0,
                  }}
                >
                  {chartType === 'bar' ? (
                    <BarChartIcon sx={{ color: '#fff', fontSize: 22 }} />
                  ) : (
                    <ShowChartIcon sx={{ color: '#fff', fontSize: 22 }} />
                  )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: 'text.primary' }}>
                      Team Analytics
                    </Typography>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        background: 'rgba(74,222,128,0.12)',
                        border: '1px solid rgba(74,222,128,0.3)',
                        borderRadius: 20,
                        px: 1,
                        py: 0.25,
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#4ade80',
                          boxShadow: '0 0 6px #4ade80',
                        }}
                      />
                      <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: '#16a34a' }}>
                        LIVE
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      flexWrap: 'wrap',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: { xs: 'flex-start', md: 'center' },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                        color: 'text.secondary',
                        lineHeight: 1.4,
                      }}
                    >
                      {chartType === 'bar' ? 'Story Points by Team' : 'Story Points Trend'}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                        color: 'text.secondary',
                        lineHeight: 1.4,
                      }}
                    >
                      {fromDate.format('DD MMM')} – {toDate.format('DD MMM YYYY')}
                    </Typography>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        background:
                          chartType === 'bar' ? 'rgba(99,102,241,0.1)' : 'rgba(6,182,212,0.1)',
                        border: '1px solid',
                        borderColor:
                          chartType === 'bar' ? 'rgba(99,102,241,0.25)' : 'rgba(6,182,212,0.25)',
                        borderRadius: 20,
                        px: 1,
                        py: 0.25,
                      }}
                    >
                      {chartType === 'bar' ? (
                        <BarChartIcon sx={{ fontSize: 12, color: '#4f46e5' }} />
                      ) : (
                        <ShowChartIcon sx={{ fontSize: 12, color: '#06b6d4' }} />
                      )}
                      <Typography
                        sx={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: chartType === 'bar' ? '#4f46e5' : '#0891b2',
                        }}
                      >
                        {chartType === 'bar' ? 'Bar Chart' : 'Line Chart'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Card Body */}
            <Box sx={{ pt: 2, px: 0, pb: 0 }}>
              {/* KPI cards */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 220px)' },
                  gap: 1.5,
                  mb: 2,
                  justifyContent: 'center',
                  mx: 'auto',
                }}
              >
                {kpiCards.map(({ icon, bg, border, value, label, valueColor }) => (
                  <Paper key={label} className={classes.statCard} elevation={0}>
                    <Box
                      className={classes.statCardIconWrap}
                      sx={{ background: bg, border: `1px solid ${border}` }}
                    >
                      {icon}
                    </Box>
                    <Box>
                      <Typography
                        className={classes.statCardValue}
                        sx={valueColor ? { color: valueColor } : {}}
                      >
                        {value}
                      </Typography>
                      <Typography className={classes.statCardLabel}>{label}</Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>

              {/* Chart */}
              <ReactApexChart
                key={`${chartType}-${fromDate.valueOf()}-${toDate.valueOf()}-${selectedSprints.join(',')}`}
                type={chartType === 'bar' ? 'bar' : 'area'}
                options={chartType === 'bar' ? barOptions : lineOptions}
                series={chartData.series}
                height={380}
              />
            </Box>
          </Card>
        ) : view === 'incentive' ? (
          /* ── Incentive Report Card ── */
          <Card cardVariant='default'>
            {/* Table Section Header - Same style as Technical Documents */}
            <Box className={classes.statsRowIncentive}>
              {/* From Date */}
              <DatePicker
                label='From Date'
                value={fromDate}
                onChange={(v) => {
                  if (v && v.isValid()) setFromDate(v);
                }}
                minDate={MIN_DATE}
                maxDate={toDate}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { minWidth: 140 },
                  },
                }}
              />

              {/* To Date */}
              <DatePicker
                label='To Date'
                value={toDate}
                onChange={(v) => {
                  if (v && v.isValid()) setToDate(v);
                }}
                minDate={fromDate}
                maxDate={MAX_DATE}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { minWidth: 140 },
                  },
                }}
              />

              {/* Range info chip */}
              <Chip
                label={`Incentive Report · ${fromDate.format('DD MMM')} – ${toDate.format('DD MMM YYYY')}`}
                size='small'
                sx={{
                  height: 36,
                  fontSize: '0.7rem',
                  background: 'rgba(16,185,129,0.1)',
                  color: '#10b981',
                  fontWeight: 600,
                  border: '1px solid rgba(16,185,129,0.3)',
                }}
              />

              {/* Search field */}
              <TextField
                placeholder='Search report…'
                value={incentiveSearch}
                onChange={(e) => setIncentiveSearch(e.target.value)}
                size='small'
                sx={{
                  minWidth: 200,
                  ml: 'auto',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    background: 'rgba(255,255,255,0.92)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: '1px solid rgba(16,185,129,0.18)',
                      borderRadius: '20px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: '1px solid rgba(16,185,129,0.4)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: '1px solid #10b981',
                    },
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <SearchIcon sx={{ color: 'rgba(16,185,129,0.6)', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* Incentive Table */}
            <Box sx={{ p: 2.5 }}>
              <DataTable
                columns={[
                  {
                    id: 'dateRange',
                    label: 'Date Range',
                    minWidth: 120,
                  },
                  {
                    id: 'actual',
                    label: 'Actual MWh',
                    minWidth: 100,
                    align: 'right' as const,
                  },
                  {
                    id: 'forecast',
                    label: 'Forecast MWh',
                    minWidth: 100,
                    align: 'right' as const,
                  },
                  {
                    id: 'delta',
                    label: '|Δ| MWh',
                    minWidth: 90,
                    align: 'right' as const,
                  },
                  {
                    id: 'fer',
                    label: 'FER %',
                    minWidth: 80,
                    align: 'right' as const,
                  },
                  {
                    id: 'incentive',
                    label: 'Incentive M.KRW',
                    minWidth: 120,
                    align: 'right' as const,
                  },
                ]}
                data={filteredIncentiveData}
                rowKey='dateRange'
                searchable={false}
                initialRowsPerPage={10}
              />
            </Box>
          </Card>
        ) : null}
      </Box>
    </>
  );
};

function getStatusIcon(status: SprintData['status']) {
  switch (status) {
    case 'active':
      return <PlayArrowIcon sx={{ fontSize: 12 }} />;
    case 'completed':
      return <CheckCircleIcon sx={{ fontSize: 12 }} />;
    case 'upcoming':
      return <RefreshIcon sx={{ fontSize: 12 }} />;
    case 'cancelled':
      return <StopIcon sx={{ fontSize: 12 }} />;
  }
}

export default Dashboard;
