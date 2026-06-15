import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { constants } from '@sprintpulse/utils';
import { Typography, Box, IconButton, Paper, Loader, Chip, Tooltip } from '@sprintpulse/component';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { useSprintDetailStyles } from '../styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import BoltIcon from '@mui/icons-material/Bolt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BugReportIcon from '@mui/icons-material/BugReport';
import BlockIcon from '@mui/icons-material/Block';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import TimerIcon from '@mui/icons-material/Timer';
import InsightsIcon from '@mui/icons-material/Insights';
import CodeIcon from '@mui/icons-material/Code';
import ScienceIcon from '@mui/icons-material/Science';
import VerifiedIcon from '@mui/icons-material/Verified';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import PieChartIcon from '@mui/icons-material/PieChart';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { SprintData, SPRINT_STATUS_CONFIG } from '../types/sprintData.types';
import { getSprintById } from '../../../../utils/mockData';
import { useAdminKeyframes } from '@sprintpulse/hooks';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number, d = 1) {
  return v.toFixed(d);
}

function getStatusIcon(status: SprintData['status']) {
  const sz = { fontSize: 16 };
  switch (status) {
    case 'active':
      return <PlayArrowIcon sx={sz} />;
    case 'completed':
      return <CheckCircleIcon sx={sz} />;
    case 'upcoming':
      return <RefreshIcon sx={sz} />;
    case 'cancelled':
      return <StopIcon sx={sz} />;
  }
}

type Alert = 'normal' | 'warn' | 'alert';

function coverageAlert(v: number, warn = 80, alert = 70): Alert {
  if (v < alert) return 'alert';
  if (v < warn) return 'warn';
  return 'normal';
}

function defectAlert(v: number, warn = 1, alert = 2): Alert {
  if (v >= alert) return 'alert';
  if (v >= warn) return 'warn';
  return 'normal';
}

function deliveryAlert(v: number, warn = 85, alert = 70): Alert {
  if (v < alert) return 'alert';
  if (v < warn) return 'warn';
  return 'normal';
}

function ftrAlert(v: number, warn = 80, alert = 65): Alert {
  if (v < alert) return 'alert';
  if (v < warn) return 'warn';
  return 'normal';
}

function velocityDeltaAlert(v: number): Alert {
  if (v < -15) return 'alert';
  if (v < -5) return 'warn';
  return 'normal';
}

function blockedRatio(blocked: number, total: number): Alert {
  if (total <= 0) return 'normal';
  const ratio = (blocked / total) * 100;
  if (ratio > 20) return 'alert';
  if (ratio > 10) return 'warn';
  return 'normal';
}

const ALERT_COLOR: Record<Alert, string> = {
  normal: '#10b981',
  warn: '#f59e0b',
  alert: '#ef4444',
};

const SECTION_ACCENT: Record<string, { primary: string; secondary: string }> = {
  performance: { primary: '#4f46e5', secondary: '#7c3aed' },
  velocity: { primary: '#0ea5e9', secondary: '#06b6d4' },
  issues: { primary: '#8b5cf6', secondary: '#a855f7' },
  quality: { primary: '#ef4444', secondary: '#dc2626' },
  process: { primary: '#f59e0b', secondary: '#f97316' },
  team: { primary: '#10b981', secondary: '#059669' },
  risk: { primary: '#14b8a6', secondary: '#0d9488' },
  delivery: { primary: '#6366f1', secondary: '#8b5cf6' },
};

// ─── Components ────────────────────────────────────────────────────────────────

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accent: { primary: string; secondary: string };
  children: React.ReactNode;
  gridClass: string;
  classes: Record<string, string>;
}

const SectionCard: React.FC<SectionCardProps> = ({
  icon,
  title,
  subtitle,
  accent,
  children,
  gridClass,
  classes,
}) => {
  const { cx } = useSprintDetailStyles();

  return (
    <Paper elevation={0} className={classes.sectionCard}>
      <Box className={classes.sectionCardHeader}>
        <Box
          className={classes.sectionCardIcon}
          sx={{ background: `linear-gradient(135deg, ${accent.primary}, ${accent.secondary})` }}
        >
          {icon}
        </Box>
        <Box>
          <Typography className={classes.sectionCardTitle}>{title}</Typography>
          <Typography className={classes.sectionCardSubtitle}>{subtitle}</Typography>
        </Box>
      </Box>
      <Box className={cx(classes.sectionCardContent, classes[gridClass])}>{children}</Box>
    </Paper>
  );
};

interface MiniParamProps {
  label: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  accent: string;
  alert?: Alert;
  classes: Record<string, string>;
}

const MiniParam: React.FC<MiniParamProps> = ({
  label,
  value,
  unit,
  icon,
  accent,
  alert = 'normal',
  classes,
}) => {
  const bg = alert !== 'normal' ? `${ALERT_COLOR[alert]}08` : `${accent}10`;

  const border = alert !== 'normal' ? `${ALERT_COLOR[alert]}30` : `${accent}30`;

  const valueColor = alert !== 'normal' ? ALERT_COLOR[alert] : undefined;

  return (
    <Paper
      elevation={0}
      className={classes.miniParam}
      sx={{
        background: alert !== 'normal' ? `${ALERT_COLOR[alert]}08` : '#ffffff',
        borderColor: alert !== 'normal' ? `${ALERT_COLOR[alert]}30` : '#e8eaf0',
        '&:hover': {
          background: alert !== 'normal' ? `${ALERT_COLOR[alert]}12` : '#f8fafc',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box
        className={classes.statCardIconWrap}
        sx={{
          background: bg,
          border: `1px solid ${border}`,
          '& svg': {
            color: alert !== 'normal' ? ALERT_COLOR[alert] : accent,
          },
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography className={classes.statCardValue} sx={valueColor ? { color: valueColor } : {}}>
          {value}
        </Typography>

        <Typography className={classes.statCardLabel}>
          {label}
          {unit && ` (${unit})`}
        </Typography>
      </Box>

      {alert !== 'normal' && (
        <Box
          className={classes.miniParamAlertDot}
          sx={{
            background: ALERT_COLOR[alert],
            boxShadow: `0 0 8px ${ALERT_COLOR[alert]}`,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}
    </Paper>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const SprintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { AdminPath } = constants;
  const { classes } = useSprintDetailStyles();
  const keyframes = useAdminKeyframes();

  const [sprint, setSprint] = useState<SprintData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = getSprintById(Number(id)) as SprintData | null;
      setSprint(found);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (!sprint) return;
    const interval = setInterval(() => {
      setSprint((prev) => {
        if (!prev) return prev;
        if (prev.status === 'active') {
          const progressDrift = (Math.random() - 0.5) * 1.4;
          const velocityDrift = (Math.random() - 0.5) * 0.2;
          return {
            ...prev,
            time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
            sprintProgress: Math.max(0, Math.min(100, prev.sprintProgress + progressDrift)),
            storyPointsCompleted: Math.max(
              0,
              prev.storyPointsCompleted + Math.random() * 0.3,
            ),
            teamVelocity: Math.max(0, prev.teamVelocity + velocityDrift),
          };
        }
        return { ...prev, time: new Date().toLocaleTimeString('en-GB', { hour12: false }) };
      });
    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprint?.id]);

  if (loading) {
    return (
      <>
        {keyframes}
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          <Loader />
        </Box>
      </>
    );
  }

  if (!sprint) {
    return (
      <>
        {keyframes}
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='h6' color='error'>
            Sprint not found
          </Typography>
          <IconButton onClick={() => navigate(AdminPath.DASHBOARD)} sx={{ mt: 2 }}>
            <ArrowBackIcon /> Back to Dashboard
          </IconButton>
        </Box>
      </>
    );
  }

  const cfg = SPRINT_STATUS_CONFIG[sprint.status];
  const isActive = sprint.status === 'active';
  const highOpenRisks = sprint.risks.filter((r) => r.impact === 'high' && r.status === 'open').length;
  const unresolvedDeps = sprint.dependencies.filter((d) => !d.resolved).length;

  const statsData = [
    {
      icon: getStatusIcon(sprint.status),
      bg: cfg.bgColor,
      border: cfg.borderColor,
      value: cfg.label,
      label: 'Status',
      valueColor: cfg.color,
    },
    {
      icon: <BoltIcon sx={{ color: '#f59e0b', fontSize: 20 }} />,
      bg: 'rgba(245,158,11,0.12)',
      border: 'rgba(245,158,11,0.3)',
      value: fmt(sprint.storyPointsCompleted, 0),
      label: 'Points Done',
      valueColor: '#f59e0b',
    },
    {
      icon: <TrendingUpIcon sx={{ color: '#0ea5e9', fontSize: 20 }} />,
      bg: 'rgba(14,165,233,0.12)',
      border: 'rgba(14,165,233,0.3)',
      value: `${fmt(sprint.sprintProgress, 0)}%`,
      label: 'Progress',
      valueColor: '#0ea5e9',
    },
    {
      icon: <SpeedIcon sx={{ color: '#10b981', fontSize: 20 }} />,
      bg: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.3)',
      value: fmt(sprint.teamVelocity, 1),
      label: 'Velocity (pts/d)',
      valueColor: '#10b981',
    },
    {
      icon: <TimerIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />,
      bg: 'rgba(139,92,246,0.12)',
      border: 'rgba(139,92,246,0.3)',
      value: fmt(sprint.cycleTime, 1),
      label: 'Cycle (days)',
      valueColor: '#8b5cf6',
    },
    {
      icon: <FactCheckIcon sx={{ color: '#ef4444', fontSize: 20 }} />,
      bg: 'rgba(239,68,68,0.12)',
      border: 'rgba(239,68,68,0.3)',
      value: `${fmt(sprint.onTimeDeliveryRate, 0)}%`,
      label: 'On-Time Delivery',
      valueColor: '#ef4444',
    },
  ] as const;

  return (
    <>
      {keyframes}
      <Box className={classes.container}>
        {/* ── Hero Header (Dashboard Pattern) ── */}
        <Box className={classes.heroHeader}>
          <Box className={classes.heroLeft}>
            <Box
              className={classes.heroIconWrap}
              sx={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)` }}
            >
              {getStatusIcon(sprint.status)}
            </Box>
            <Box>
              <Typography className={classes.heroTitleText}>Sprint {sprint.sprintNo}</Typography>
              <Typography className={classes.heroSubtitle}>Live Sprint Telemetry</Typography>
              {/* Status Chip - Mobile Only: shown inline after subtitle */}
              <Box
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  mt: 0.5,
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Chip
                  icon={getStatusIcon(sprint.status)}
                  label={cfg.label}
                  size='small'
                  className={classes.statusChip}
                  sx={{
                    background: cfg.bgColor,
                    border: `1px solid ${cfg.borderColor}`,
                    color: cfg.color,
                    fontWeight: 600,
                    fontSize: '0.6rem',
                    height: 20,
                    '& .MuiChip-icon': { color: cfg.color, fontSize: 12 },
                    '& .MuiChip-label': { px: 0.75 },
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box className={classes.heroCenter}>
            <Typography className={classes.heroCenterTitle}>SPRINT DETAIL</Typography>
            <Box className={classes.heroCenterBadge}>
              <Box className={classes.heroCenterDot} />
              <Typography className={classes.heroCenterLive}>Live Tracking</Typography>
            </Box>
          </Box>

          <Box className={classes.heroRight}>
            {/* Status Chip - Desktop Only */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Chip
                icon={getStatusIcon(sprint.status)}
                label={cfg.label}
                size='small'
                className={classes.statusChip}
                sx={{
                  background: cfg.bgColor,
                  border: `1px solid ${cfg.borderColor}`,
                  color: cfg.color,
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  height: '18px',
                  '& .MuiChip-icon': { color: cfg.color },
                }}
              />
              <Tooltip title='Back to Dashboard' arrow placement='bottom'>
                <IconButton
                  onClick={() => navigate(AdminPath.DASHBOARD)}
                  size='small'
                  className='closeButton'
                  sx={{
                    color: '#64748b',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    p: 0.75,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: '#fee2e2',
                      color: '#ef4444',
                      borderColor: '#fecaca',
                      transform: 'scale(1.05)',
                      '& .closeIcon': {
                        transform: 'rotate(90deg)',
                      },
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                    '& .closeIcon': {
                      transition: 'transform 0.2s ease',
                    },
                  }}
                >
                  <CloseIcon className='closeIcon' sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Mobile Only Close Button - Top Right Corner */}
            <Box
              sx={{ display: { xs: 'flex', sm: 'none' }, position: 'absolute', top: 8, right: 8 }}
            >
              <Tooltip title='Back to Dashboard' arrow placement='bottom'>
                <IconButton
                  onClick={() => navigate(AdminPath.DASHBOARD)}
                  size='small'
                  className='closeButton'
                  sx={{
                    color: '#64748b',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    p: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: '#fee2e2',
                      color: '#ef4444',
                      borderColor: '#fecaca',
                      transform: 'scale(1.05)',
                      '& .closeIcon': {
                        transform: 'rotate(90deg)',
                      },
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                    '& .closeIcon': {
                      transition: 'transform 0.2s ease',
                    },
                  }}
                >
                  <CloseIcon className='closeIcon' sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* ── Stat Cards Row (Dashboard Pattern) ── */}
        <Box className={classes.statsRowContainer}>
          <Box className={classes.statsRow}>
            {statsData.map(({ icon, bg, border, value, label, valueColor }, idx) => (
              <Paper key={idx} className={classes.statCard} elevation={0}>
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
        </Box>

        {/* ── Key Performance Indicators ── */}
        <SectionCard
          icon={<BoltIcon />}
          title='Key Performance Indicators'
          subtitle='Real-time sprint delivery metrics'
          accent={SECTION_ACCENT.performance}
          gridClass='sectionGrid4'
          classes={classes}
        >
          <MiniParam
            label='Story Points Done'
            value={fmt(sprint.storyPointsCompleted, 0)}
            unit='pts'
            icon={<BoltIcon />}
            accent='#4f46e5'
            classes={classes}
          />
          <MiniParam
            label='Planned Points'
            value={fmt(sprint.plannedPoints, 0)}
            unit='pts'
            icon={<AssessmentIcon />}
            accent='#0ea5e9'
            classes={classes}
          />
          <MiniParam
            label='Actual Points'
            value={fmt(sprint.actualPoints, 0)}
            unit='pts'
            icon={<FactCheckIcon />}
            accent='#10b981'
            classes={classes}
          />
          <MiniParam
            label='Capacity'
            value={fmt(sprint.capacity, 0)}
            unit='pts'
            icon={<AccountTreeIcon />}
            accent='#6366f1'
            classes={classes}
          />
          <MiniParam
            label='Sprint Progress'
            value={fmt(sprint.sprintProgress, 0)}
            unit='%'
            icon={<TrendingUpIcon />}
            accent='#14b8a6'
            classes={classes}
          />
          <MiniParam
            label='Burndown Rate'
            value={fmt(sprint.burndownRate, 1)}
            unit='pts/d'
            icon={<InsightsIcon />}
            accent='#f59e0b'
            classes={classes}
          />
          <MiniParam
            label='On-Time Delivery'
            value={fmt(sprint.onTimeDeliveryRate, 0)}
            unit='%'
            icon={<RocketLaunchIcon />}
            accent={sprint.onTimeDeliveryRate >= 85 ? '#10b981' : '#f59e0b'}
            alert={deliveryAlert(sprint.onTimeDeliveryRate)}
            classes={classes}
          />
          <MiniParam
            label='Avg Story Size'
            value={fmt(sprint.averageStorySize, 1)}
            unit='pts'
            icon={<DonutLargeIcon />}
            accent='#8b5cf6'
            classes={classes}
          />
        </SectionCard>

        {/* ── Velocity Analytics ── */}
        <SectionCard
          icon={<SpeedIcon />}
          title='Velocity Analytics'
          subtitle='Throughput and delivery cadence'
          accent={SECTION_ACCENT.velocity}
          gridClass='sectionGrid4'
          classes={classes}
        >
          <MiniParam
            label='Planned Velocity'
            value={fmt(sprint.plannedVelocity, 1)}
            unit='pts/d'
            icon={<TrendingUpIcon />}
            accent='#0ea5e9'
            classes={classes}
          />
          <MiniParam
            label='Actual Velocity'
            value={fmt(sprint.actualVelocity, 1)}
            unit='pts/d'
            icon={<SpeedIcon />}
            accent='#0ea5e9'
            classes={classes}
          />
          <MiniParam
            label='Team Velocity'
            value={fmt(sprint.teamVelocity, 1)}
            unit='pts/d'
            icon={<InsightsIcon />}
            accent='#0ea5e9'
            classes={classes}
          />
          <MiniParam
            label='Velocity Variation'
            value={`${sprint.velocityVariation >= 0 ? '+' : ''}${fmt(sprint.velocityVariation, 1)}`}
            unit='%'
            icon={<PieChartIcon />}
            accent={
              velocityDeltaAlert(sprint.velocityVariation) !== 'normal'
                ? ALERT_COLOR[velocityDeltaAlert(sprint.velocityVariation)]
                : '#0ea5e9'
            }
            alert={velocityDeltaAlert(sprint.velocityVariation)}
            classes={classes}
          />
        </SectionCard>

        {/* ── Issue Tracking ── */}
        <SectionCard
          icon={<AssignmentIcon />}
          title='Issue Tracking'
          subtitle='Backlog composition and issue health'
          accent={SECTION_ACCENT.issues}
          gridClass='sectionGrid5'
          classes={classes}
        >
          <MiniParam
            label='Total Issues'
            value={fmt(sprint.totalIssues, 0)}
            unit=''
            icon={<AssignmentIcon />}
            accent='#8b5cf6'
            classes={classes}
          />
          <MiniParam
            label='Active Issues'
            value={fmt(sprint.activeIssues, 0)}
            unit=''
            icon={<TrendingUpIcon />}
            accent='#8b5cf6'
            classes={classes}
          />
          <MiniParam
            label='Completed'
            value={fmt(sprint.completedIssues, 0)}
            unit=''
            icon={<CheckCircleIcon />}
            accent='#10b981'
            classes={classes}
          />
          <MiniParam
            label='Blocked'
            value={fmt(sprint.blockedIssues, 0)}
            unit=''
            icon={<BlockIcon />}
            accent={
              blockedRatio(sprint.blockedIssues, sprint.totalIssues) !== 'normal'
                ? ALERT_COLOR[blockedRatio(sprint.blockedIssues, sprint.totalIssues)]
                : '#8b5cf6'
            }
            alert={blockedRatio(sprint.blockedIssues, sprint.totalIssues)}
            classes={classes}
          />
          <MiniParam
            label='Resolution Time'
            value={fmt(sprint.issueResolutionTime, 1)}
            unit='h'
            icon={<TimerIcon />}
            accent='#8b5cf6'
            classes={classes}
          />
        </SectionCard>

        {/* ── Quality Metrics ── */}
        <SectionCard
          icon={<VerifiedIcon />}
          title='Quality Metrics'
          subtitle='Test coverage, defect density, and first-time-right rate'
          accent={SECTION_ACCENT.quality}
          gridClass='sectionGrid3'
          classes={classes}
        >
          <MiniParam
            label='Test Coverage'
            value={fmt(sprint.testCoverage, 0)}
            unit='%'
            icon={<ScienceIcon />}
            accent={
              coverageAlert(sprint.testCoverage) !== 'normal'
                ? ALERT_COLOR[coverageAlert(sprint.testCoverage)]
                : '#ef4444'
            }
            alert={coverageAlert(sprint.testCoverage)}
            classes={classes}
          />
          <MiniParam
            label='Defect Density'
            value={fmt(sprint.defectDensity, 1)}
            unit='/KLOC'
            icon={<BugReportIcon />}
            accent={
              defectAlert(sprint.defectDensity) !== 'normal'
                ? ALERT_COLOR[defectAlert(sprint.defectDensity)]
                : '#ef4444'
            }
            alert={defectAlert(sprint.defectDensity)}
            classes={classes}
          />
          <MiniParam
            label='First-Time Right'
            value={fmt(sprint.firstTimeRightPercentage, 0)}
            unit='%'
            icon={<VerifiedIcon />}
            accent={
              ftrAlert(sprint.firstTimeRightPercentage) !== 'normal'
                ? ALERT_COLOR[ftrAlert(sprint.firstTimeRightPercentage)]
                : '#ef4444'
            }
            alert={ftrAlert(sprint.firstTimeRightPercentage)}
            classes={classes}
          />
          <MiniParam
            label='Rework'
            value={fmt(sprint.reworkPercentage, 0)}
            unit='%'
            icon={<WarningIcon />}
            accent={
              sprint.reworkPercentage > 20
                ? ALERT_COLOR.alert
                : sprint.reworkPercentage > 12
                  ? ALERT_COLOR.warn
                  : '#ef4444'
            }
            alert={
              sprint.reworkPercentage > 20
                ? 'alert'
                : sprint.reworkPercentage > 12
                  ? 'warn'
                  : 'normal'
            }
            classes={classes}
          />
          <MiniParam
            label='Code Churn'
            value={sprint.codeChurn.toLocaleString()}
            unit='lines'
            icon={<CodeIcon />}
            accent='#ef4444'
            classes={classes}
          />
        </SectionCard>

        {/* ── Process & Cycle ── */}
        <SectionCard
          icon={<TimerIcon />}
          title='Process & Cycle'
          subtitle='Cycle time, duration, and process telemetry'
          accent={SECTION_ACCENT.process}
          gridClass='sectionGrid3'
          classes={classes}
        >
          <MiniParam
            label='Cycle Time'
            value={fmt(sprint.cycleTime, 1)}
            unit='days'
            icon={<TimerIcon />}
            accent='#f59e0b'
            classes={classes}
          />
          <MiniParam
            label='Sprint Duration'
            value={fmt(sprint.duration, 0)}
            unit='days'
            icon={<AssessmentIcon />}
            accent='#f59e0b'
            classes={classes}
          />
          <MiniParam
            label='Issue Resolution'
            value={fmt(sprint.issueResolutionTime, 1)}
            unit='h'
            icon={<InsightsIcon />}
            accent='#f59e0b'
            classes={classes}
          />
        </SectionCard>

        {/* ── Team Composition ── */}
        <SectionCard
          icon={<GroupsIcon />}
          title='Team Composition'
          subtitle='Roles, ownership, and headcount'
          accent={SECTION_ACCENT.team}
          gridClass='sectionGrid2'
          classes={classes}
        >
          <MiniParam
            label='Team Lead'
            value={sprint.team.lead}
            unit=''
            icon={<GroupsIcon />}
            accent='#10b981'
            classes={classes}
          />
          <MiniParam
            label='Scrum Master'
            value={sprint.team.scrumMaster}
            unit=''
            icon={<GroupsIcon />}
            accent='#10b981'
            classes={classes}
          />
          <MiniParam
            label='Product Owner'
            value={sprint.team.productOwner}
            unit=''
            icon={<GroupsIcon />}
            accent='#10b981'
            classes={classes}
          />
          <MiniParam
            label='Team Size'
            value={fmt(sprint.team.members.length, 0)}
            unit='members'
            icon={<GroupsIcon />}
            accent='#10b981'
            classes={classes}
          />
        </SectionCard>

        {/* ── Risk & Dependencies ── */}
        <SectionCard
          icon={<WarningIcon />}
          title='Risk & Dependencies'
          subtitle='Open risks, blocked work, and downstream dependencies'
          accent={SECTION_ACCENT.risk}
          gridClass='sectionGrid3'
          classes={classes}
        >
          <MiniParam
            label='Open Risks'
            value={fmt(sprint.risks.length, 0)}
            unit=''
            icon={<WarningIcon />}
            accent={highOpenRisks > 0 ? ALERT_COLOR.alert : '#14b8a6'}
            alert={highOpenRisks > 0 ? 'alert' : 'normal'}
            classes={classes}
          />
          <MiniParam
            label='Blocked Issues'
            value={fmt(sprint.blockedIssues, 0)}
            unit=''
            icon={<BlockIcon />}
            accent={
              blockedRatio(sprint.blockedIssues, sprint.totalIssues) !== 'normal'
                ? ALERT_COLOR[blockedRatio(sprint.blockedIssues, sprint.totalIssues)]
                : '#14b8a6'
            }
            alert={blockedRatio(sprint.blockedIssues, sprint.totalIssues)}
            classes={classes}
          />
          <MiniParam
            label='Dependencies'
            value={fmt(sprint.dependencies.length, 0)}
            unit=''
            icon={<AccountTreeIcon />}
            accent={unresolvedDeps > 0 ? '#f59e0b' : '#14b8a6'}
            alert={unresolvedDeps > 0 ? 'warn' : 'normal'}
            classes={classes}
          />
          <MiniParam
            label='Retrospectives'
            value={fmt(sprint.retrospectives.length, 0)}
            unit=''
            icon={<FactCheckIcon />}
            accent='#14b8a6'
            classes={classes}
          />
        </SectionCard>

        {/* ── Schedule ── */}
        <SectionCard
          icon={<AssessmentIcon />}
          title='Schedule'
          subtitle='Sprint window, release, and stakeholder visibility'
          accent={SECTION_ACCENT.delivery}
          gridClass='sectionGrid2'
          classes={classes}
        >
          <MiniParam
            label='Start Date'
            value={sprint.startDate}
            unit=''
            icon={<AssessmentIcon />}
            accent='#6366f1'
            classes={classes}
          />
          <MiniParam
            label='End Date'
            value={sprint.endDate}
            unit=''
            icon={<AssessmentIcon />}
            accent={isActive ? '#f59e0b' : '#6366f1'}
            classes={classes}
          />
          <MiniParam
            label='Release Version'
            value={sprint.releaseVersion ?? '—'}
            unit=''
            icon={<RocketLaunchIcon />}
            accent='#6366f1'
            classes={classes}
          />
          <MiniParam
            label='Stakeholders'
            value={fmt(sprint.stakeholders.length, 0)}
            unit=''
            icon={<GroupsIcon />}
            accent='#6366f1'
            classes={classes}
          />
        </SectionCard>

        {/* ── Legend ── */}
        <Box className={classes.legendRow}>
          {(['normal', 'warn', 'alert'] as Alert[]).map((a) => (
            <Box key={a} className={classes.legendItem}>
              <Box
                className={classes.legendDot}
                sx={{
                  background: ALERT_COLOR[a],
                  boxShadow: a !== 'normal' ? `0 0 12px ${ALERT_COLOR[a]}` : 'none',
                  animation: a !== 'normal' ? 'pulse 2s ease-in-out infinite' : 'none',
                }}
              />
              <Typography className={classes.legendText}>
                {a === 'warn' ? 'Warning' : a.charAt(0).toUpperCase() + a.slice(1)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default SprintDetailPage;
