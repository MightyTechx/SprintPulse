import React, { useState } from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SettingsIcon from '@mui/icons-material/Settings';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SpeedIcon from '@mui/icons-material/Speed';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AirIcon from '@mui/icons-material/Air';
// TODO: Refactor from SCADA concepts (turbine/nacelle/rotor) to sprint concepts (story/velocity/burndown)
import { TurbineData } from '../types/sprintData.types';

interface ComponentDetailDialogProps {
  open: boolean;
  // Legacy prop name kept (TurbineData is the legacy compat shim type)
  turbine: TurbineData | null;
  component: string;
  onClose: () => void;
}

interface TelemetryEvent {
  id: string;
  category: string;
  timestamp: string;
  message: string;
  icon: React.ReactNode;
}

interface KpiValue {
  label: string;
  value: number | string;
  unit: string;
  status: string;
}

// Component configs with render functions
const COMPONENT_CONFIGS = {
  transformer: {
    name: 'Transformer',
    color: '#f59e0b',
    renderIcon: (size: number) => <FlashOnIcon sx={{ fontSize: size, color: '#fff' }} />,
    status: 'OK',
    telemetry: [
      { label: 'Winding U Temp', value: 42.3, unit: '°C', status: 'ok' },
      { label: 'Winding V Temp', value: 43.1, unit: '°C', status: 'ok' },
      { label: 'Winding W Temp', value: 41.8, unit: '°C', status: 'ok' },
      { label: 'Voltage L1', value: 690, unit: 'V', status: 'ok' },
      { label: 'Voltage L2', value: 692, unit: 'V', status: 'ok' },
      { label: 'Voltage L3', value: 688, unit: 'V', status: 'ok' },
      { label: 'Current L1', value: 845, unit: 'A', status: 'ok' },
      { label: 'Current L2', value: 842, unit: 'A', status: 'ok' },
      { label: 'Current L3', value: 848, unit: 'A', status: 'ok' },
      { label: 'Heat Ex. Inlet', value: 38.2, unit: '°C', status: 'ok' },
    ],
    events: [
      {
        id: '1',
        category: 'warning',
        timestamp: '14:32:07',
        message: 'Transformer control signal feedback fault',
        icon: <WarningIcon sx={{ fontSize: 14 }} />,
      },
      {
        id: '2',
        category: 'info',
        timestamp: '14:28:15',
        message: 'Coolant pump inlet pressure low',
        icon: <InfoIcon sx={{ fontSize: 14 }} />,
      },
      {
        id: '3',
        category: 'warning',
        timestamp: '13:45:22',
        message: 'Low wind condition below cut-in',
        icon: <WarningIcon sx={{ fontSize: 14 }} />,
      },
      {
        id: '4',
        category: 'info',
        timestamp: '12:15:00',
        message: 'Controller event log active',
        icon: <InfoIcon sx={{ fontSize: 14 }} />,
      },
    ],
  },
  generator: {
    name: 'Generator',
    color: '#0ea5e9',
    renderIcon: (size: number) => <ElectricBoltIcon sx={{ fontSize: size, color: '#fff' }} />,
    status: 'OK',
    telemetry: [
      { label: 'Stator Temp U', value: 78.4, unit: '°C', status: 'ok' },
      { label: 'Stator Temp V', value: 77.2, unit: '°C', status: 'ok' },
      { label: 'Stator Temp W', value: 79.1, unit: '°C', status: 'ok' },
      { label: 'Rotor Temp', value: 65.3, unit: '°C', status: 'ok' },
      { label: 'Output Power', value: 2150, unit: 'kW', status: 'ok' },
      { label: 'RPM', value: 1650, unit: 'rpm', status: 'ok' },
      { label: 'Efficiency', value: 94.2, unit: '%', status: 'ok' },
      { label: 'Voltage', value: 690, unit: 'V', status: 'ok' },
      { label: 'Current', value: 1785, unit: 'A', status: 'ok' },
      { label: 'Frequency', value: 50.02, unit: 'Hz', status: 'ok' },
    ],
    events: [
      {
        id: '1',
        category: 'ok',
        timestamp: '15:00:00',
        message: 'Generator operating within normal parameters',
        icon: <CheckCircleIcon sx={{ fontSize: 14 }} />,
      },
      {
        id: '2',
        category: 'info',
        timestamp: '14:30:00',
        message: 'Power output optimized for current wind conditions',
        icon: <InfoIcon sx={{ fontSize: 14 }} />,
      },
    ],
  },
  gearbox: {
    name: 'Gearbox',
    color: '#8b5cf6',
    renderIcon: (size: number) => <SettingsIcon sx={{ fontSize: size, color: '#fff' }} />,
    status: 'OK',
    telemetry: [
      { label: 'Oil Sump Temp', value: 62.5, unit: '°C', status: 'ok' },
      { label: 'Oil Pressure', value: 3.2, unit: 'bar', status: 'ok' },
      { label: 'Input Speed', value: 14.5, unit: 'rpm', status: 'ok' },
      { label: 'Output Speed', value: 1650, unit: 'rpm', status: 'ok' },
      { label: 'Oil Level', value: 95, unit: '%', status: 'ok' },
      { label: 'Gear Ratio', value: 113.8, unit: ':1', status: 'ok' },
      { label: 'Oil Filter Diff', value: 0.3, unit: 'bar', status: 'ok' },
      { label: 'Oil Cooler Inlet', value: 45.2, unit: '°C', status: 'ok' },
    ],
    events: [
      {
        id: '1',
        category: 'ok',
        timestamp: '15:00:00',
        message: 'Gearbox temperature within normal range',
        icon: <CheckCircleIcon sx={{ fontSize: 14 }} />,
      },
      {
        id: '2',
        category: 'info',
        timestamp: '10:00:00',
        message: 'Scheduled oil analysis completed',
        icon: <InfoIcon sx={{ fontSize: 14 }} />,
      },
    ],
  },
  cooling: {
    name: 'Cooling System',
    color: '#10b981',
    renderIcon: (size: number) => <ThermostatIcon sx={{ fontSize: size, color: '#fff' }} />,
    status: 'OK',
    telemetry: [
      { label: 'Coolant Inlet Temp', value: 38.4, unit: '°C', status: 'ok' },
      { label: 'Coolant Outlet Temp', value: 42.1, unit: '°C', status: 'ok' },
      { label: 'Inlet Pressure', value: 1.8, unit: 'bar', status: 'ok' },
      { label: 'Outlet Pressure', value: 1.4, unit: 'bar', status: 'ok' },
      { label: 'Pump Flow Rate', value: 125, unit: 'L/min', status: 'ok' },
      { label: 'Heat Exchanger', value: 35.2, unit: '°C', status: 'ok' },
      { label: 'Fan Speed', value: 2400, unit: 'rpm', status: 'ok' },
      { label: 'Ambient Temp', value: 22.5, unit: '°C', status: 'ok' },
    ],
    events: [
      {
        id: '1',
        category: 'ok',
        timestamp: '15:00:00',
        message: 'Cooling system operating efficiently',
        icon: <CheckCircleIcon sx={{ fontSize: 14 }} />,
      },
      {
        id: '2',
        category: 'warning',
        timestamp: '11:45:00',
        message: 'Pump flow rate slightly reduced - monitoring',
        icon: <WarningIcon sx={{ fontSize: 14 }} />,
      },
    ],
  },
  nacelle: {
    name: 'Nacelle',
    color: '#ec4899',
    renderIcon: (size: number) => <SpeedIcon sx={{ fontSize: size, color: '#fff' }} />,
    status: 'OK',
    telemetry: [
      { label: 'Nacelle Temp', value: 35.2, unit: '°C', status: 'ok' },
      { label: 'Yaw Position', value: 245, unit: '°', status: 'ok' },
      { label: 'Yaw Speed', value: 0.5, unit: '°/s', status: 'ok' },
      { label: 'Orientation', value: 244.8, unit: '°', status: 'ok' },
      { label: 'Vane Position', value: 238, unit: '°', status: 'ok' },
      { label: 'Nacelle Vibration', value: 0.12, unit: 'mm/s', status: 'ok' },
    ],
    events: [
      {
        id: '1',
        category: 'ok',
        timestamp: '15:00:00',
        message: 'Nacelle orientation optimal for wind direction',
        icon: <CheckCircleIcon sx={{ fontSize: 14 }} />,
      },
    ],
  },
};

// ─── Status Badge ──────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: 'ok' | 'warning' | 'critical' }) => {
  const config = {
    ok: {
      color: '#10b981',
      label: 'OK',
      bg: 'rgba(16,185,129,0.15)',
      border: 'rgba(16,185,129,0.5)',
    },
    warning: {
      color: '#f59e0b',
      label: 'WARNING',
      bg: 'rgba(245,158,11,0.15)',
      border: 'rgba(245,158,11,0.5)',
    },
    critical: {
      color: '#ef4444',
      label: 'FAULT',
      bg: 'rgba(239,68,68,0.15)',
      border: 'rgba(239,68,68,0.5)',
    },
  };
  const c = config[status];

  return (
    <Chip
      label={c.label}
      size='small'
      sx={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
        fontWeight: 800,
        fontSize: '0.65rem',
        height: 24,
        '& .MuiChip-label': { px: 1.5 },
      }}
    />
  );
};

// ─── KPI Tile ─────────────────────────────────────────────────────────────
const KpiTile = ({ kpi }: { kpi: KpiValue }) => {
  const color =
    kpi.status === 'critical' ? '#ef4444' : kpi.status === 'warning' ? '#f59e0b' : '#06b6d4';

  return (
    <Box
      sx={{
        background: 'rgba(15,23,42,0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        border: `1px solid ${color}30`,
        p: 1.5,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s',
        '&:hover': { borderColor: `${color}60`, boxShadow: `0 0 15px ${color}20` },
      }}
    >
      <Typography
        sx={{
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.5)',
          mb: 0.5,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {kpi.label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography
          sx={{ fontSize: '1.1rem', fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}
        >
          {typeof kpi.value === 'number' ? kpi.value.toFixed(1) : kpi.value}
        </Typography>
        <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
          {kpi.unit}
        </Typography>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: color,
          borderRadius: '0 0 8px 8px',
          opacity: 0.6,
        }}
      />
    </Box>
  );
};

// ─── Event Card ────────────────────────────────────────────────────────────
const EventCard = ({ event }: { event: TelemetryEvent }) => {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    fault: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' },
    warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
    info: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)', text: '#06b6d4' },
    ok: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
  };
  const c = colors[event.category] || colors.ok;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 1.5,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 2,
        transition: 'all 0.2s',
        '&:hover': { borderColor: `${c.text}60`, boxShadow: `0 0 15px ${c.text}15` },
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: `${c.text}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: c.text,
        }}
      >
        {event.icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
          <Chip
            label={event.category.toUpperCase()}
            size='small'
            sx={{
              height: 16,
              fontSize: '0.5rem',
              fontWeight: 700,
              background: `${c.text}20`,
              color: c.text,
            }}
          />
          <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>
            {event.timestamp}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
          {event.message}
        </Typography>
      </Box>
    </Box>
  );
};

// ─── Main Component Detail Dialog ───────────────────────────────────────────
const ComponentDetailDialog: React.FC<ComponentDetailDialogProps> = ({
  open,
  turbine,
  component,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'sensors' | 'parts' | 'alerts'>('sensors');
  const config =
    COMPONENT_CONFIGS[component as keyof typeof COMPONENT_CONFIGS] || COMPONENT_CONFIGS.transformer;

  if (!open || !turbine) return null;

  const alertCounts = {
    fault: config.events.filter((e) => e.category === 'fault').length,
    warning: config.events.filter((e) => e.category === 'warning').length,
    ok: config.events.filter((e) => e.category === 'ok').length,
    info: config.events.filter((e) => e.category === 'info').length,
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'linear-gradient(135deg, #0a0f1a 0%, #0f172a 50%, #1e293b 100%)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          height: 70,
          background: 'rgba(15,23,42,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `2px solid ${config.color}40`,
          display: 'flex',
          alignItems: 'center',
          px: 3,
          gap: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: 100,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${config.color}30 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${config.color}40, ${config.color}20)`,
            border: `2px solid ${config.color}60`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px ${config.color}40`,
          }}
        >
          {config.renderIcon(24)}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              {config.name}
            </Typography>
            <StatusBadge status={config.status === 'OK' ? 'ok' : 'warning'} />
            <Chip
              label='LIVE'
              size='small'
              icon={
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#10b981',
                    ml: 1,
                    animation: 'pulse 1.5s infinite',
                  }}
                />
              }
              sx={{
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.4)',
                color: '#10b981',
                fontWeight: 700,
                fontSize: '0.6rem',
              }}
            />
          </Box>
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', mt: 0.25 }}>
            {turbine.turbineNo} · Component Inspection Mode
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 2,
            '&:hover': { color: '#fff', borderColor: 'rgba(255,255,255,0.4)' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* ── Left Telemetry Panels ──────────────────────────────────── */}
        <Box
          sx={{
            width: 320,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflow: 'auto',
          }}
        >
          {/* Anemometer & Vane */}
          <Box
            sx={{
              background: 'rgba(15,23,42,0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(6,182,212,0.3)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                background: `linear-gradient(135deg, rgba(6,182,212,0.15) 0%, transparent 100%)`,
                borderBottom: '1px solid rgba(6,182,212,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AirIcon sx={{ fontSize: 18, color: '#06b6d4' }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#06b6d4' }}>
                  ANEMOMETER & VANE
                </Typography>
              </Box>
              <Chip
                label='LIVE'
                size='small'
                sx={{
                  height: 18,
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  background: 'rgba(16,185,129,0.2)',
                  color: '#10b981',
                }}
              />
            </Box>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4', lineHeight: 1 }}
                  >
                    {turbine.windSpeed.toFixed(1)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
                    m/s Wind Speed
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4', lineHeight: 1 }}
                  >
                    {turbine.windDirection.toFixed(0)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
                    ° Direction
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b', lineHeight: 1 }}
                  >
                    {turbine.outdoorTemp.toFixed(0)}°
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
                    Outdoor Temp
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#06b6d4', lineHeight: 1 }}
                  >
                    {turbine.nacellePosition.toFixed(1)}°
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
                    Nacelle Angle
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Power & Rotation */}
          <Box
            sx={{
              background: 'rgba(15,23,42,0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(245,158,11,0.3)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                background: `linear-gradient(135deg, rgba(245,158,11,0.15) 0%, transparent 100%)`,
                borderBottom: '1px solid rgba(245,158,11,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <FlashOnIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>
                POWER & ROTATION
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography
                  sx={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}
                >
                  {turbine.activePower.toFixed(0)}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                  kW Generator Output
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>
                    Power Output
                  </Typography>
                  <Typography sx={{ fontSize: '0.6rem', color: '#f59e0b' }}>
                    {((turbine.activePower / 2500) * 100).toFixed(0)}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    background: 'rgba(245,158,11,0.1)',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${(turbine.activePower / 2500) * 100}%`,
                      background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
                      borderRadius: 4,
                      boxShadow: '0 0 10px rgba(245,158,11,0.5)',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{ fontSize: '1.3rem', fontWeight: 700, color: '#8b5cf6', lineHeight: 1 }}
                  >
                    {turbine.rotorRpm.toFixed(1)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>
                    Rotor RPM
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{ fontSize: '1.3rem', fontWeight: 700, color: '#8b5cf6', lineHeight: 1 }}
                  >
                    {turbine.generatorRpm.toFixed(0)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>
                    Generator RPM
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{ fontSize: '1.3rem', fontWeight: 700, color: '#06b6d4', lineHeight: 1 }}
                  >
                    {turbine.pitchAngle.toFixed(1)}°
                  </Typography>
                  <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>
                    Pitch Angle
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── Center 3D Visualization ─────────────────────────────── */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: `repeating-linear-gradient(90deg, rgba(6,182,212,0.1) 0px, transparent 1px, transparent 40px), repeating-linear-gradient(0deg, rgba(6,182,212,0.1) 0px, transparent 1px, transparent 40px)`,
              transform: 'perspective(500px) rotateX(60deg)',
              transformOrigin: 'bottom',
              maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
            }}
          />

          <Box
            sx={{
              width: 400,
              height: 300,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${config.color}20 0%, transparent 70%)`,
                animation: 'pulse 3s ease-in-out infinite',
              }}
            />
            <Box
              sx={{
                width: 200,
                height: 120,
                background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
                borderRadius: 60,
                border: `3px solid ${config.color}`,
                boxShadow: `0 0 40px ${config.color}50, inset 0 0 40px rgba(6,182,212,0.2)`,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `${config.color}30`,
                  border: `2px solid ${config.color}`,
                  boxShadow: `0 0 30px ${config.color}60`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'rotate 10s linear infinite',
                  '@keyframes rotate': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' },
                  },
                }}
              >
                <Box sx={{ color: '#fff' }}>{config.renderIcon(36)}</Box>
              </Box>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 4,
                height: 60,
                background: '#64748b',
              }}
            />
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              right: '10%',
              width: 260,
              background: 'rgba(15,23,42,0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: `2px solid ${config.color}60`,
              boxShadow: `0 0 40px ${config.color}30`,
              p: 2,
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box sx={{ color: config.color, display: 'flex' }}>{config.renderIcon(20)}</Box>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                {config.name}
              </Typography>
              <StatusBadge status={config.status === 'OK' ? 'ok' : 'warning'} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {config.telemetry.slice(0, 4).map((kpi) => (
                <KpiTile key={kpi.label} kpi={kpi} />
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── Right SCADA Panel ──────────────────────────────────────── */}
        <Box
          sx={{
            width: 380,
            background: 'rgba(15,23,42,0.9)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(6,182,212,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: '1px solid rgba(6,182,212,0.2)',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, transparent 100%)',
            }}
          >
            <Typography
              sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#06b6d4', letterSpacing: '0.1em' }}
            >
              SCADA · LIVE TELEMETRY
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(6,182,212,0.2)' }}>
            {(['sensors', 'parts', 'alerts'] as const).map((tab) => (
              <Box
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  flex: 1,
                  py: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: activeTab === tab ? 'rgba(6,182,212,0.2)' : 'transparent',
                  borderBottom: `2px solid ${activeTab === tab ? '#06b6d4' : 'transparent'}`,
                  transition: 'all 0.2s',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: activeTab === tab ? '#06b6d4' : 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                  }}
                >
                  {tab}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{ display: 'flex', gap: 1, p: 2, borderBottom: '1px solid rgba(6,182,212,0.1)' }}
          >
            <Box
              sx={{
                flex: 1,
                p: 1,
                borderRadius: 2,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>
                {alertCounts.fault}
              </Typography>
              <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)' }}>
                FAULT
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                p: 1,
                borderRadius: 2,
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.3)',
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>
                {alertCounts.warning}
              </Typography>
              <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)' }}>
                WARN
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                p: 1,
                borderRadius: 2,
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                {alertCounts.ok}
              </Typography>
              <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)' }}>
                OK
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                p: 1,
                borderRadius: 2,
                background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.3)',
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#06b6d4' }}>
                {alertCounts.info}
              </Typography>
              <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)' }}>
                INFO
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <Typography
              sx={{
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.4)',
                mb: 1.5,
                letterSpacing: '0.1em',
              }}
            >
              EVENT FEED
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {config.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Bottom Status Bar ─────────────────────────────────────── */}
      <Box
        sx={{
          height: 50,
          background: 'rgba(15,23,42,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(6,182,212,0.2)',
          display: 'flex',
          alignItems: 'center',
          px: 3,
          gap: 3,
        }}
      >
        <Chip
          icon={<CheckCircleIcon sx={{ fontSize: 14, color: '#10b981' }} />}
          label={`${config.name} - NOMINAL`}
          sx={{
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.4)',
            color: '#10b981',
            fontWeight: 600,
          }}
        />
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
            Telemetry Stream: Connected
          </Typography>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px #10b981',
              animation: 'pulse 1.5s infinite',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ComponentDetailDialog;
