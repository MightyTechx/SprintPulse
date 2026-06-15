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
import BuildIcon from '@mui/icons-material/Build';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AirIcon from '@mui/icons-material/Air';
import SettingsIcon from '@mui/icons-material/Settings';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SpeedIcon from '@mui/icons-material/Speed';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SensorsIcon from '@mui/icons-material/Sensors';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import BoltIcon from '@mui/icons-material/Bolt';
import WindPowerIcon from '@mui/icons-material/WindPower';
import TuneIcon from '@mui/icons-material/Tune';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { TurbineData } from '../types/sprintData.types';
import { STATUS_CONFIG, getTurbineById } from '../../../../utils/mockData';
import { useAdminKeyframes } from '@sprintpulse/hooks';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number, d = 1) {
  return v.toFixed(d);
}

function getStatusIcon(status: TurbineData['status']) {
  const sz = { fontSize: 16 };
  switch (status) {
    case 'running':
      return <PlayArrowIcon sx={sz} />;
    case 'stopped':
      return <StopIcon sx={sz} />;
    case 'maintenance':
      return <BuildIcon sx={sz} />;
    case 'fault':
      return <WarningIcon sx={sz} />;
    case 'standby':
      return <RefreshIcon sx={sz} />;
  }
}

type Alert = 'normal' | 'warn' | 'alert';

function tempAlert(v: number, warn = 75, alert = 90): Alert {
  if (v >= alert) return 'alert';
  if (v >= warn) return 'warn';
  return 'normal';
}

function pressAlert(v: number, low = 1.5, high = 3.5): Alert {
  if (v < low || v > high) return 'warn';
  return 'normal';
}

function oscAlert(v: number): Alert {
  if (v > 0.5) return 'alert';
  if (v > 0.3) return 'warn';
  return 'normal';
}

const ALERT_COLOR: Record<Alert, string> = {
  normal: '#10b981',
  warn: '#f59e0b',
  alert: '#ef4444',
};

const SECTION_ACCENT: Record<string, { primary: string; secondary: string }> = {
  performance: { primary: '#4f46e5', secondary: '#7c3aed' },
  wind: { primary: '#0ea5e9', secondary: '#06b6d4' },
  electrical: { primary: '#8b5cf6', secondary: '#a855f7' },
  rotor: { primary: '#06b6d4', secondary: '#14b8a6' },
  nacelle: { primary: '#f59e0b', secondary: '#f97316' },
  temperature: { primary: '#ef4444', secondary: '#dc2626' },
  pressure: { primary: '#10b981', secondary: '#059669' },
  hydraulic: { primary: '#14b8a6', secondary: '#0d9488' },
  cabinet: { primary: '#6366f1', secondary: '#8b5cf6' },
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

// TODO: Refactor from SCADA concepts (turbine rotor/wind/grid) to sprint concepts (stories/points/velocity)
const SprintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { AdminPath } = constants;
  const { classes } = useSprintDetailStyles();
  const keyframes = useAdminKeyframes();

  const [turbine, setTurbine] = useState<TurbineData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = getTurbineById(Number(id));
      setTurbine(found || null);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (!turbine) return;
    const interval = setInterval(() => {
      setTurbine((prev) => {
        if (!prev) return prev;
        if (prev.status === 'running') {
          const powerVariation = (Math.random() - 0.5) * 100;
          const windVariation = (Math.random() - 0.5) * 0.5;
          return {
            ...prev,
            time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
            activePower: Math.max(0, prev.activePower + powerVariation),
            windSpeed: Math.max(3, Math.min(25, prev.windSpeed + windVariation)),
            todayGeneration: prev.todayGeneration + prev.activePower / 3600,
          };
        }
        return { ...prev, time: new Date().toLocaleTimeString('en-GB', { hour12: false }) };
      });
    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turbine?.id]);

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

  if (!turbine) {
    return (
      <>
        {keyframes}
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='h6' color='error'>
            Turbine not found
          </Typography>
          <IconButton onClick={() => navigate(AdminPath.DASHBOARD)} sx={{ mt: 2 }}>
            <ArrowBackIcon /> Back to Dashboard
          </IconButton>
        </Box>
      </>
    );
  }

  const cfg = STATUS_CONFIG[turbine.status];
  const isActive = turbine.status === 'running' || turbine.status === 'standby';

  const statsData = [
    {
      icon: getStatusIcon(turbine.status),
      bg: cfg.bgColor,
      border: cfg.borderColor,
      value: cfg.label,
      label: 'Status',
      valueColor: cfg.color,
    },
    {
      icon: <FlashOnIcon sx={{ color: '#f59e0b', fontSize: 20 }} />,
      bg: 'rgba(245,158,11,0.12)',
      border: 'rgba(245,158,11,0.3)',
      value: fmt(turbine.activePower, 0),
      label: 'Active (kW)',
      valueColor: '#f59e0b',
    },
    {
      icon: <WindPowerIcon sx={{ color: '#0ea5e9', fontSize: 20 }} />,
      bg: 'rgba(14,165,233,0.12)',
      border: 'rgba(14,165,233,0.3)',
      value: fmt(turbine.windSpeed),
      label: 'Wind (m/s)',
      valueColor: '#0ea5e9',
    },
    {
      icon: <SpeedIcon sx={{ color: '#10b981', fontSize: 20 }} />,
      bg: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.3)',
      value: fmt(turbine.rotorRpm, 1),
      label: 'Rotor RPM',
      valueColor: '#10b981',
    },
    {
      icon: <BoltIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />,
      bg: 'rgba(139,92,246,0.12)',
      border: 'rgba(139,92,246,0.3)',
      value: fmt(turbine.todayGeneration, 0),
      label: 'Today (kWh)',
      valueColor: '#8b5cf6',
    },
    {
      icon: (
        <ThermostatIcon
          sx={{
            color: tempAlert(turbine.gearboxTemp) !== 'normal' ? '#ef4444' : '#ef4444',
            fontSize: 20,
          }}
        />
      ),
      bg:
        tempAlert(turbine.gearboxTemp) !== 'normal'
          ? 'rgba(239,68,68,0.12)'
          : 'rgba(239,68,68,0.12)',
      border:
        tempAlert(turbine.gearboxTemp) !== 'normal' ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.3)',
      value: fmt(turbine.gearboxTemp, 0),
      label: 'Gearbox (°C)',
      valueColor: tempAlert(turbine.gearboxTemp) !== 'normal' ? '#ef4444' : '#1e293b',
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
              {getStatusIcon(turbine.status)}
            </Box>
            <Box>
              <Typography className={classes.heroTitleText}>WTG {turbine.turbineNo}</Typography>
              <Typography className={classes.heroSubtitle}>SCADA Live Parameters</Typography>
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
                  icon={getStatusIcon(turbine.status)}
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
            <Typography className={classes.heroCenterTitle}>TURBINE DETAIL</Typography>
            <Box className={classes.heroCenterBadge}>
              <Box className={classes.heroCenterDot} />
              <Typography className={classes.heroCenterLive}>Live Tracking</Typography>
            </Box>
          </Box>

          <Box className={classes.heroRight}>
            {/* Status Chip - Desktop Only */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Chip
                icon={getStatusIcon(turbine.status)}
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
          subtitle='Real-time operational metrics'
          accent={SECTION_ACCENT.performance}
          gridClass='sectionGrid4'
          classes={classes}
        >
          <MiniParam
            label='Active Power'
            value={fmt(turbine.activePower, 0)}
            unit='kW'
            icon={<FlashOnIcon />}
            accent='#4f46e5'
            classes={classes}
          />
          <MiniParam
            label='Total Production'
            value={fmt(turbine.totalProduction, 0)}
            unit='MWh'
            icon={<BoltIcon />}
            accent='#10b981'
            classes={classes}
          />
          <MiniParam
            label='Total Op. Hours'
            value={fmt(turbine.totalOperatingHours, 0)}
            unit='h'
            icon={<SpeedIcon />}
            accent='#6366f1'
            classes={classes}
          />
          <MiniParam
            label='Production Hours'
            value={fmt(turbine.totalProductionHours, 0)}
            unit='h'
            icon={<BoltIcon />}
            accent='#14b8a6'
            classes={classes}
          />
          <MiniParam
            label='Op. Hours Today'
            value={fmt(turbine.operationHoursToday)}
            unit='h'
            icon={<SpeedIcon />}
            accent='#ec4899'
            classes={classes}
          />
          <MiniParam
            label='Today Generation'
            value={fmt(turbine.todayGeneration, 0)}
            unit='kWh'
            icon={<BoltIcon />}
            accent='#f59e0b'
            classes={classes}
          />
          <MiniParam
            label='Break Programme'
            value={turbine.breakProgramme}
            unit=''
            icon={<StopIcon />}
            accent={turbine.breakProgramme === 'Released' ? '#10b981' : '#f59e0b'}
            alert={turbine.breakProgramme === 'Emergency' ? 'warn' : 'normal'}
            classes={classes}
          />
          <MiniParam
            label='Operating Mode'
            value={
              turbine.operatingMode.length > 15
                ? `${turbine.operatingMode.substring(0, 12)}..`
                : turbine.operatingMode
            }
            unit=''
            icon={<SettingsIcon />}
            accent='#8b5cf6'
            classes={classes}
          />
        </SectionCard>

        {/* ── Wind & Environmental ── */}
        <SectionCard
          icon={<WindPowerIcon />}
          title='Wind & Environmental'
          subtitle='Wind resource and meteorological parameters'
          accent={SECTION_ACCENT.wind}
          gridClass='sectionGrid4'
          classes={classes}
        >
          <MiniParam
            label='Wind Speed'
            value={fmt(turbine.windSpeed)}
            unit='m/s'
            icon={<AirIcon />}
            accent='#0ea5e9'
            classes={classes}
          />
          <MiniParam
            label='Wind Direction'
            value={fmt(turbine.windDirection, 0)}
            unit='°'
            icon={<WindPowerIcon />}
            accent='#0ea5e9'
            classes={classes}
          />
          <MiniParam
            label='Relative Wind'
            value={fmt(turbine.relativeWindDirection, 0)}
            unit='°'
            icon={<WindPowerIcon />}
            accent='#0ea5e9'
            alert={Math.abs(turbine.relativeWindDirection) > 15 ? 'warn' : 'normal'}
            classes={classes}
          />
          <MiniParam
            label='Outdoor Temp'
            value={fmt(turbine.outdoorTemp, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#0ea5e9'
            alert={tempAlert(turbine.outdoorTemp, 40, 50)}
            classes={classes}
          />
        </SectionCard>

        {/* ── Electrical Parameters ── */}
        <SectionCard
          icon={<ElectricMeterIcon />}
          title='Electrical Parameters'
          subtitle='Grid connection and power quality metrics'
          accent={SECTION_ACCENT.electrical}
          gridClass='sectionGrid5'
          classes={classes}
        >
          <MiniParam
            label='Current L1'
            value={fmt(turbine.currentL1, 0)}
            unit='A'
            icon={<ElectricMeterIcon />}
            accent='#8b5cf6'
            classes={classes}
          />
          <MiniParam
            label='Current L2'
            value={fmt(turbine.currentL2, 0)}
            unit='A'
            icon={<ElectricMeterIcon />}
            accent='#8b5cf6'
            classes={classes}
          />
          <MiniParam
            label='Current L3'
            value={fmt(turbine.currentL3, 0)}
            unit='A'
            icon={<ElectricMeterIcon />}
            accent='#8b5cf6'
            classes={classes}
          />
          <MiniParam
            label='Power Freq'
            value={isActive ? fmt(turbine.powerFrequency, 2) : '—'}
            unit='Hz'
            icon={<SensorsIcon />}
            accent='#8b5cf6'
            alert={
              isActive && (turbine.powerFrequency < 49.5 || turbine.powerFrequency > 50.5)
                ? 'warn'
                : 'normal'
            }
            classes={classes}
          />
          <MiniParam
            label='Voltage L1'
            value={fmt(turbine.voltageL1, 0)}
            unit='V'
            icon={<ElectricMeterIcon />}
            accent='#8b5cf6'
            classes={classes}
          />
          <MiniParam
            label='Voltage L2'
            value={fmt(turbine.voltageL2, 0)}
            unit='V'
            icon={<ElectricMeterIcon />}
            accent='#8b5cf6'
            classes={classes}
          />
          <MiniParam
            label='Voltage L3'
            value={fmt(turbine.voltageL3, 0)}
            unit='V'
            icon={<ElectricMeterIcon />}
            accent='#8b5cf6'
            classes={classes}
          />
          <MiniParam
            label='Apparent Power'
            value={fmt(turbine.apparentPower, 0)}
            unit='kVA'
            icon={<ElectricMeterIcon />}
            accent='#8b5cf6'
            classes={classes}
          />
          <MiniParam
            label='Reactive Power'
            value={fmt(turbine.reactivePower, 0)}
            unit='kVAR'
            icon={<ElectricMeterIcon />}
            accent='#8b5cf6'
            classes={classes}
          />
          <MiniParam
            label='Power Factor'
            value={isActive ? fmt(turbine.powerFactor, 3) : '—'}
            unit=''
            icon={<SensorsIcon />}
            accent='#8b5cf6'
            alert={isActive && turbine.powerFactor < 0.9 ? 'warn' : 'normal'}
            classes={classes}
          />
        </SectionCard>

        {/* ── Rotor & Drive Train ── */}
        <SectionCard
          icon={<TuneIcon />}
          title='Rotor & Drive Train'
          subtitle='Mechanical rotation and transmission parameters'
          accent={SECTION_ACCENT.rotor}
          gridClass='sectionGrid4'
          classes={classes}
        >
          <MiniParam
            label='Rotor Speed'
            value={fmt(turbine.rotorRpm, 1)}
            unit='rpm'
            icon={<SpeedIcon />}
            accent='#06b6d4'
            classes={classes}
          />
          <MiniParam
            label='Gear Speed'
            value={fmt(turbine.gearSpeed, 0)}
            unit='rpm'
            icon={<TuneIcon />}
            accent='#06b6d4'
            classes={classes}
          />
          <MiniParam
            label='Generator Speed'
            value={fmt(turbine.generatorRpm, 0)}
            unit='rpm'
            icon={<SpeedIcon />}
            accent='#06b6d4'
            classes={classes}
          />
          <MiniParam
            label='Nacelle Position'
            value={fmt(turbine.nacellePosition, 1)}
            unit='°'
            icon={<AcUnitIcon />}
            accent='#06b6d4'
            classes={classes}
          />
        </SectionCard>

        {/* ── Pitch & Yaw Control ── */}
        <SectionCard
          icon={<SettingsIcon />}
          title='Pitch & Yaw Control'
          subtitle='Blade pitch and nacelle orientation systems'
          accent={SECTION_ACCENT.nacelle}
          gridClass='sectionGrid3'
          classes={classes}
        >
          <MiniParam
            label='Blade Angle'
            value={fmt(turbine.pitchAngle, 1)}
            unit='°'
            icon={<SettingsIcon />}
            accent='#f59e0b'
            classes={classes}
          />
          <MiniParam
            label='Pitch Cyl 1'
            value={fmt(turbine.pitchCylinder1, 0)}
            unit='mm'
            icon={<TuneIcon />}
            accent='#f59e0b'
            classes={classes}
          />
          <MiniParam
            label='Pitch Cyl 2'
            value={fmt(turbine.pitchCylinder2, 0)}
            unit='mm'
            icon={<TuneIcon />}
            accent='#f59e0b'
            classes={classes}
          />
          <MiniParam
            label='Pitch Cyl 3'
            value={fmt(turbine.pitchCylinder3, 0)}
            unit='mm'
            icon={<TuneIcon />}
            accent='#f59e0b'
            classes={classes}
          />
          <MiniParam
            label='Cable Winding'
            value={fmt(turbine.cableWinding, 0)}
            unit='°'
            icon={<AcUnitIcon />}
            accent='#f59e0b'
            alert={Math.abs(turbine.cableWinding) > 300 ? 'warn' : 'normal'}
            classes={classes}
          />
          <MiniParam
            label='Nacelle Orient'
            value={fmt(turbine.nacellePosition, 1)}
            unit='°'
            icon={<AcUnitIcon />}
            accent='#f59e0b'
            classes={classes}
          />
        </SectionCard>

        {/* ── Structural Monitoring ── */}
        <SectionCard
          icon={<ArchitectureIcon />}
          title='Structural Monitoring'
          subtitle='Tower oscillation and vibration analysis'
          accent={{ primary: '#f59e0b', secondary: '#f97316' }}
          gridClass='sectionGrid2'
          classes={classes}
        >
          <MiniParam
            label='Tower Osc X'
            value={fmt(turbine.towerOscillationX, 3)}
            unit='mm/s'
            icon={<ArchitectureIcon />}
            accent='#f59e0b'
            alert={oscAlert(turbine.towerOscillationX)}
            classes={classes}
          />
          <MiniParam
            label='Tower Osc Y'
            value={fmt(turbine.towerOscillationY, 3)}
            unit='mm/s'
            icon={<ArchitectureIcon />}
            accent='#f59e0b'
            alert={oscAlert(turbine.towerOscillationY)}
            classes={classes}
          />
        </SectionCard>

        {/* ── Temperature Monitoring ── */}
        <SectionCard
          icon={<ThermostatIcon />}
          title='Temperature Monitoring'
          subtitle='Thermal status of major components'
          accent={SECTION_ACCENT.temperature}
          gridClass='sectionGrid4'
          classes={classes}
        >
          <MiniParam
            label='Nacelle Temp'
            value={fmt(turbine.nacelleTemp, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            alert={tempAlert(turbine.nacelleTemp, 50, 65)}
            classes={classes}
          />
          <MiniParam
            label='Outdoor Temp'
            value={fmt(turbine.outdoorTemp, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            classes={classes}
          />
          <MiniParam
            label='Gear Oil Sump'
            value={fmt(turbine.gearOilSumpTemp, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            alert={tempAlert(turbine.gearOilSumpTemp, 70, 85)}
            classes={classes}
          />
          <MiniParam
            label='Gearbox Temp'
            value={fmt(turbine.gearboxTemp, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            alert={tempAlert(turbine.gearboxTemp, 70, 85)}
            classes={classes}
          />
          <MiniParam
            label='Generator Temp'
            value={fmt(turbine.generatorTemp, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            alert={tempAlert(turbine.generatorTemp, 90, 110)}
            classes={classes}
          />
          <MiniParam
            label='Transformer'
            value={fmt(turbine.transformerTemp, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            alert={tempAlert(turbine.transformerTemp, 50, 65)}
            classes={classes}
          />
          <MiniParam
            label='Hub Exhaust'
            value={fmt(turbine.hubExhaustTemp, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            classes={classes}
          />
          <MiniParam
            label='CNV Heat In'
            value={fmt(turbine.coolCnvHeatExIn, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            alert={tempAlert(turbine.coolCnvHeatExIn, 65, 80)}
            classes={classes}
          />
          <MiniParam
            label='CNV Heat Out'
            value={fmt(turbine.coolCnvHeatExOut, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            alert={tempAlert(turbine.coolCnvHeatExOut, 50, 65)}
            classes={classes}
          />
          <MiniParam
            label='TRF Heat In'
            value={fmt(turbine.coolTrfHeatExIn, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            alert={tempAlert(turbine.coolTrfHeatExIn, 60, 75)}
            classes={classes}
          />
          <MiniParam
            label='Gen Winding U'
            value={fmt(turbine.generatorWindingTempU, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            alert={tempAlert(turbine.generatorWindingTempU, 90, 110)}
            classes={classes}
          />
          <MiniParam
            label='Gen Winding V'
            value={fmt(turbine.generatorWindingTempV, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            alert={tempAlert(turbine.generatorWindingTempV, 90, 110)}
            classes={classes}
          />
          <MiniParam
            label='Gen Winding W'
            value={fmt(turbine.generatorWindingTempW, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            alert={tempAlert(turbine.generatorWindingTempW, 90, 110)}
            classes={classes}
          />
          <MiniParam
            label='TRF Winding U'
            value={fmt(turbine.trfWindingTempU, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            classes={classes}
          />
          <MiniParam
            label='TRF Winding V'
            value={fmt(turbine.trfWindingTempV, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            classes={classes}
          />
          <MiniParam
            label='TRF Winding W'
            value={fmt(turbine.trfWindingTempW, 0)}
            unit='°C'
            icon={<ThermostatIcon />}
            accent='#ef4444'
            classes={classes}
          />
        </SectionCard>

        {/* ── Hydraulic System ── */}
        <SectionCard
          icon={<WaterDropIcon />}
          title='Hydraulic System'
          subtitle='Pressure and fluid management parameters'
          accent={SECTION_ACCENT.hydraulic}
          gridClass='sectionGrid4'
          classes={classes}
        >
          <MiniParam
            label='Hydraulic Press'
            value={fmt(turbine.hydraulicPressure, 0)}
            unit='bar'
            icon={<WaterDropIcon />}
            accent='#14b8a6'
            alert={pressAlert(turbine.hydraulicPressure, 160, 200)}
            classes={classes}
          />
          <MiniParam
            label='Gear Oil Press'
            value={fmt(turbine.gearOilPressure, 1)}
            unit='bar'
            icon={<WaterDropIcon />}
            accent='#14b8a6'
            alert={pressAlert(turbine.gearOilPressure, 2.5, 3.8)}
            classes={classes}
          />
          <MiniParam
            label='Coolant Inlet'
            value={fmt(turbine.coolantInletPressure, 1)}
            unit='bar'
            icon={<WaterDropIcon />}
            accent='#14b8a6'
            alert={pressAlert(turbine.coolantInletPressure, 1.2, 2.2)}
            classes={classes}
          />
          <MiniParam
            label='Coolant Outlet'
            value={fmt(turbine.coolantOutletPressure, 1)}
            unit='bar'
            icon={<WaterDropIcon />}
            accent='#14b8a6'
            alert={pressAlert(turbine.coolantOutletPressure, 0.8, 1.8)}
            classes={classes}
          />
        </SectionCard>

        {/* ── Control Cabinet Temperatures ── */}
        <SectionCard
          icon={<SensorsIcon />}
          title='Control Cabinet'
          subtitle='Switchgear and electronics thermal monitoring'
          accent={SECTION_ACCENT.cabinet}
          gridClass='sectionGrid3'
          classes={classes}
        >
          <MiniParam
            label='Tower Cabinet'
            value={fmt(turbine.tempSwCabTower, 0)}
            unit='°C'
            icon={<SensorsIcon />}
            accent='#6366f1'
            alert={tempAlert(turbine.tempSwCabTower, 45, 55)}
            classes={classes}
          />
          <MiniParam
            label='Nacelle Cabinet'
            value={fmt(turbine.tempSwCabNacelle, 0)}
            unit='°C'
            icon={<SensorsIcon />}
            accent='#6366f1'
            alert={tempAlert(turbine.tempSwCabNacelle, 45, 55)}
            classes={classes}
          />
          <MiniParam
            label='Hub Cabinet'
            value={fmt(turbine.tempSwCabHub, 0)}
            unit='°C'
            icon={<SensorsIcon />}
            accent='#6366f1'
            alert={tempAlert(turbine.tempSwCabHub, 45, 55)}
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
