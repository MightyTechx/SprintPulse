import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from '@infygen/component';
import GridViewIcon from '@mui/icons-material/GridView';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import StopIcon from '@mui/icons-material/Stop';
import BuildIcon from '@mui/icons-material/Build';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAdminKeyframes, useLiveDateTime } from '../../../../hooks';
import { TurbineData, STATUS_CONFIG } from '../types/turbineData.types';
import { MOCK_TURBINE_DATA } from '../utils/dashboard.utils';
import { constants } from '@infygen/utils';
import { useStyles } from '../styles/Dashboard.styles';

interface SiteGroup {
  siteName: string;
  turbines: TurbineData[];
}

const STATUS_SORT_ORDER: Record<string, number> = {
  fault: 1,
  stopped: 2,
  maintenance: 3,
  running: 4,
};

const STATUS_PRIORITY_ORDER = ['fault', 'stopped', 'maintenance', 'running'] as const;

const getStatusIcon = (status: TurbineData['status']) => {
  switch (status) {
    case 'fault':
      return <WarningIcon sx={{ fontSize: 14 }} />;
    case 'stopped':
      return <StopIcon sx={{ fontSize: 14 }} />;
    case 'maintenance':
      return <BuildIcon sx={{ fontSize: 14 }} />;
    case 'running':
      return <PlayArrowIcon sx={{ fontSize: 14 }} />;
  }
};

const FleetStatusMatrixPage = () => {
  const { AdminPath } = constants;
  const navigate = useNavigate();
  const keyframes = useAdminKeyframes();
  const { classes } = useStyles();
  const { hours, minutes, seconds, dateStr, tzAbbr, tzRegion, utcOffset } = useLiveDateTime();

  const [turbineData] = useState<TurbineData[]>(MOCK_TURBINE_DATA);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Filter turbines by search and status filter
  const filteredTurbines = useMemo(() => {
    let result = turbineData;
    if (statusFilter) {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.turbineNo.toLowerCase().includes(q) || t.status.toLowerCase().includes(q),
      );
    }
    return result;
  }, [turbineData, search, statusFilter]);

  // Group turbines by site
  const siteGroups = useMemo(() => {
    const groups: Map<string, TurbineData[]> = new Map();

    filteredTurbines.forEach((turbine) => {
      const parts = turbine.turbineNo.split('-');
      const siteName = parts.length >= 3 ? parts.slice(2).join('-') : parts[0];

      if (!groups.has(siteName)) {
        groups.set(siteName, []);
      }
      groups.get(siteName)!.push(turbine);
    });

    const sortedGroups: SiteGroup[] = [];
    groups.forEach((turbines, siteName) => {
      const sorted = [...turbines].sort((a, b) => {
        const orderA = STATUS_SORT_ORDER[a.status] ?? 99;
        const orderB = STATUS_SORT_ORDER[b.status] ?? 99;
        if (orderA !== orderB) return orderA - orderB;
        return a.turbineNo.localeCompare(b.turbineNo);
      });
      sortedGroups.push({ siteName, turbines: sorted });
    });

    return sortedGroups.sort((a, b) => {
      const aPriority = STATUS_SORT_ORDER[a.turbines[0]?.status] ?? 99;
      const bPriority = STATUS_SORT_ORDER[b.turbines[0]?.status] ?? 99;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.siteName.localeCompare(b.siteName);
    });
  }, [filteredTurbines]);

  // Count by status (use original data so chips don't disappear when filtering)
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    STATUS_PRIORITY_ORDER.forEach((status) => {
      counts[status] = turbineData.filter((t) => t.status === status).length;
    });
    return counts;
  }, [turbineData]);

  // Stats
  const totalPower = filteredTurbines
    .filter((t) => t.status === 'running')
    .reduce((s, t) => s + t.activePower, 0);

  return (
    <>
      {keyframes}
      <Box className={classes.container}>
        {/* ── Hero Header ── */}
        <Box className={classes.heroHeader} sx={{ position: 'relative' }}>
          {/* Close Button (Mobile: Top Right) */}
          <Box
            sx={{
              position: 'absolute',
              top: { xs: 12, sm: 'auto' },
              right: { xs: 12, sm: 'auto' },
              display: 'flex',
            }}
          >
            <Tooltip title='Back to Dashboard' arrow placement='bottom'>
              <IconButton
                onClick={() => navigate(AdminPath.DASHBOARD)}
                size='small'
                className='closeButton'
                sx={{
                  display: { xs: 'flex', sm: 'none' },
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

          {/* Left Section - Icon & Title */}
          <Box className={classes.heroLeft}>
            <Box
              sx={{
                width: { xs: 38, sm: 46 },
                height: { xs: 38, sm: 46 },
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
              }}
            >
              <GridViewIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: '#fff' }} />
            </Box>
            <Box>
              <Typography
                className={classes.heroTitle}
                sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem' } }}
              >
                Fleet Status Matrix
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '0.6rem', sm: '0.72rem' },
                  color: '#94a3b8',
                  fontWeight: 500,
                  marginTop: '2px',
                }}
              >
                {filteredTurbines.length} Turbines · {siteGroups.length} Sites
              </Typography>
            </Box>
          </Box>

          {/* Center Section - Title & Live Badge (hidden on mobile) */}
          <Box className={classes.heroCenter}>
            <Typography className={classes.heroCenterTitle}>FLEET MONITOR</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Box className={classes.heroCenterBadge} sx={{ mr: 0 }}>
                <Box className={classes.heroCenterDot} />
                <Typography className={classes.heroCenterLive} sx={{ pt: 0.5, pb: 0.5 }}>
                  Live Tracking
                </Typography>
              </Box>
              <Chip
                label={`${totalPower.toFixed(0)} kW`}
                size='small'
                sx={{
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  color: '#6366f1',
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  height: 26,
                  px: 1.5,
                }}
              />
            </Box>
          </Box>

          {/* Right Section - Clock Widget & Close Button (hidden on mobile) */}
          <Box className={classes.heroRight}>
            {/* Clock Widget */}
            <Box className={classes.heroClockWidget}>
              <Box className={classes.heroClockRow}>
                <Typography className={classes.heroClockHM}>
                  {hours}:{minutes}
                </Typography>
                <Typography className={classes.heroClockSec}>{seconds}</Typography>
              </Box>
              <Typography className={classes.heroClockDate}>{dateStr}</Typography>
            </Box>

            {/* Close Button (Desktop only) */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
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
                    ml: 1,
                    mb: '42px',
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

        {/* ── Search Bar & Status Chips Row ── */}
        <Box
          sx={{
            mb: 2,
            background: '#fff',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Desktop: Status Chips Row + Search Bar Side by Side */}
          <Box
            sx={{
              p: { xs: 0, sm: 2 },
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* Filter Icon */}
            <Tooltip title='Filter by status' arrow placement='bottom'>
              <Box
                sx={{ display: 'flex', alignItems: 'center', color: '#94a3b8', cursor: 'pointer' }}
              >
                <FilterListIcon sx={{ fontSize: 18 }} />
              </Box>
            </Tooltip>

            {/* Status Chips Row */}
            <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
              {statusCounts.fault > 0 && (
                <Chip
                  icon={<WarningIcon sx={{ fontSize: 12 }} />}
                  label={`${statusCounts.fault} Fault`}
                  size='small'
                  onClick={() => setStatusFilter(statusFilter === 'fault' ? null : 'fault')}
                  sx={{
                    background:
                      statusFilter === 'fault' ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.12)',
                    border: '1px solid',
                    borderColor: statusFilter === 'fault' ? '#ef4444' : 'rgba(239,68,68,0.3)',
                    color: '#ef4444',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    height: 30,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(239,68,68,0.25)',
                      transform: 'scale(1.02)',
                    },
                    '& .MuiChip-icon': { color: '#ef4444' },
                  }}
                />
              )}
              {statusCounts.stopped > 0 && (
                <Chip
                  icon={<StopIcon sx={{ fontSize: 12 }} />}
                  label={`${statusCounts.stopped} Stopped`}
                  size='small'
                  onClick={() => setStatusFilter(statusFilter === 'stopped' ? null : 'stopped')}
                  sx={{
                    background:
                      statusFilter === 'stopped'
                        ? 'rgba(100,116,139,0.25)'
                        : 'rgba(100,116,139,0.12)',
                    border: '1px solid',
                    borderColor: statusFilter === 'stopped' ? '#64748b' : 'rgba(100,116,139,0.3)',
                    color: '#64748b',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    height: 30,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(100,116,139,0.25)',
                      transform: 'scale(1.02)',
                    },
                    '& .MuiChip-icon': { color: '#64748b' },
                  }}
                />
              )}
              {statusCounts.maintenance > 0 && (
                <Chip
                  icon={<BuildIcon sx={{ fontSize: 12 }} />}
                  label={`${statusCounts.maintenance} Maintenance`}
                  size='small'
                  onClick={() =>
                    setStatusFilter(statusFilter === 'maintenance' ? null : 'maintenance')
                  }
                  sx={{
                    background:
                      statusFilter === 'maintenance'
                        ? 'rgba(245,158,11,0.25)'
                        : 'rgba(245,158,11,0.12)',
                    border: '1px solid',
                    borderColor:
                      statusFilter === 'maintenance' ? '#f59e0b' : 'rgba(245,158,11,0.3)',
                    color: '#f59e0b',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    height: 30,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(245,158,11,0.25)',
                      transform: 'scale(1.02)',
                    },
                    '& .MuiChip-icon': { color: '#f59e0b' },
                  }}
                />
              )}
              {statusCounts.running > 0 && (
                <Chip
                  icon={<PlayArrowIcon sx={{ fontSize: 12 }} />}
                  label={`${statusCounts.running} Running`}
                  size='small'
                  onClick={() => setStatusFilter(statusFilter === 'running' ? null : 'running')}
                  sx={{
                    background:
                      statusFilter === 'running'
                        ? 'rgba(16,185,129,0.25)'
                        : 'rgba(16,185,129,0.12)',
                    border: '1px solid',
                    borderColor: statusFilter === 'running' ? '#10b981' : 'rgba(16,185,129,0.3)',
                    color: '#10b981',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    height: 30,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(16,185,129,0.25)',
                      transform: 'scale(1.02)',
                    },
                    '& .MuiChip-icon': { color: '#10b981' },
                  }}
                />
              )}
            </Box>

            {/* Search Bar */}
            <TextField
              placeholder='Search turbines...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size='small'
              className={classes.toolbarSearch}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <SearchIcon sx={{ color: 'rgba(99,102,241,0.5)', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* Mobile: Status Chips (2x2 grid) + Search Bar below */}
          <Box
            sx={{
              display: { xs: 'flex', sm: 'none' },
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {/* Status Chips - 2x2 grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 0.5,
                p: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              {statusCounts.fault > 0 ? (
                <Chip
                  icon={<WarningIcon sx={{ fontSize: 11 }} />}
                  label={`${statusCounts.fault} Fault`}
                  size='small'
                  onClick={() => setStatusFilter(statusFilter === 'fault' ? null : 'fault')}
                  sx={{
                    background:
                      statusFilter === 'fault' ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.12)',
                    border: '1px solid',
                    borderColor: statusFilter === 'fault' ? '#ef4444' : 'rgba(239,68,68,0.3)',
                    color: '#ef4444',
                    fontWeight: 700,
                    fontSize: '0.62rem',
                    height: 28,
                    justifyContent: 'flex-start',
                    cursor: 'pointer',
                    '&:hover': { background: 'rgba(239,68,68,0.25)' },
                    '& .MuiChip-icon': { color: '#ef4444', fontSize: 11, ml: 1 },
                  }}
                />
              ) : (
                <Box />
              )}
              {statusCounts.stopped > 0 ? (
                <Chip
                  icon={<StopIcon sx={{ fontSize: 11 }} />}
                  label={`${statusCounts.stopped} Stopped`}
                  size='small'
                  onClick={() => setStatusFilter(statusFilter === 'stopped' ? null : 'stopped')}
                  sx={{
                    background:
                      statusFilter === 'stopped'
                        ? 'rgba(100,116,139,0.25)'
                        : 'rgba(100,116,139,0.12)',
                    border: '1px solid',
                    borderColor: statusFilter === 'stopped' ? '#64748b' : 'rgba(100,116,139,0.3)',
                    color: '#64748b',
                    fontWeight: 700,
                    fontSize: '0.62rem',
                    height: 28,
                    justifyContent: 'flex-start',
                    cursor: 'pointer',
                    '&:hover': { background: 'rgba(100,116,139,0.25)' },
                    '& .MuiChip-icon': { color: '#64748b', fontSize: 11, ml: 1 },
                  }}
                />
              ) : (
                <Box />
              )}
              {statusCounts.maintenance > 0 ? (
                <Chip
                  icon={<BuildIcon sx={{ fontSize: 11 }} />}
                  label={`${statusCounts.maintenance} Maintenance`}
                  size='small'
                  onClick={() =>
                    setStatusFilter(statusFilter === 'maintenance' ? null : 'maintenance')
                  }
                  sx={{
                    background:
                      statusFilter === 'maintenance'
                        ? 'rgba(245,158,11,0.25)'
                        : 'rgba(245,158,11,0.12)',
                    border: '1px solid',
                    borderColor:
                      statusFilter === 'maintenance' ? '#f59e0b' : 'rgba(245,158,11,0.3)',
                    color: '#f59e0b',
                    fontWeight: 700,
                    fontSize: '0.62rem',
                    height: 28,
                    justifyContent: 'flex-start',
                    cursor: 'pointer',
                    '&:hover': { background: 'rgba(245,158,11,0.25)' },
                    '& .MuiChip-icon': { color: '#f59e0b', fontSize: 11, ml: 1 },
                  }}
                />
              ) : (
                <Box />
              )}
              {statusCounts.running > 0 ? (
                <Chip
                  icon={<PlayArrowIcon sx={{ fontSize: 11 }} />}
                  label={`${statusCounts.running} Running`}
                  size='small'
                  onClick={() => setStatusFilter(statusFilter === 'running' ? null : 'running')}
                  sx={{
                    background:
                      statusFilter === 'running'
                        ? 'rgba(16,185,129,0.25)'
                        : 'rgba(16,185,129,0.12)',
                    border: '1px solid',
                    borderColor: statusFilter === 'running' ? '#10b981' : 'rgba(16,185,129,0.3)',
                    color: '#10b981',
                    fontWeight: 700,
                    fontSize: '0.62rem',
                    height: 28,
                    justifyContent: 'flex-start',
                    cursor: 'pointer',
                    '&:hover': { background: 'rgba(16,185,129,0.25)' },
                    '& .MuiChip-icon': { color: '#10b981', fontSize: 11, ml: 1 },
                  }}
                />
              ) : (
                <Box />
              )}
            </Box>

            {/* Search Bar - Full Width (Dashboard Style) */}
            <Box sx={{ px: 1.5, pt: 1.5, pb: 1.5 }}>
              <TextField
                placeholder='Search turbines...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size='small'
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 40,
                    background: 'rgba(255,255,255,0.95)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: '1px solid rgba(79,70,229,0.18)',
                      borderRadius: 40,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: '1px solid rgba(79,70,229,0.35)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 3px rgba(79,70,229,0.1)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #4f46e5',
                      },
                    },
                  },
                  '& .MuiInputBase-input': {
                    py: 0.75,
                    px: 1.5,
                    fontSize: '0.82rem',
                    '&::placeholder': {
                      color: '#94a3b8',
                      opacity: 1,
                    },
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <SearchIcon sx={{ color: 'rgba(79,70,229,0.5)', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* ── Matrix Grid ── */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}
        >
          <Box
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxHeight: { xs: 'calc(100vh - 220px)', sm: 'calc(100vh - 320px)' },
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: 6,
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f5f9',
                borderRadius: 3,
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#cbd5e1',
                borderRadius: 3,
                '&:hover': {
                  background: '#94a3b8',
                },
              },
            }}
          >
            {siteGroups.length === 0 ? (
              <Box
                sx={{
                  py: 6,
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                  No turbines found matching your search
                </Typography>
              </Box>
            ) : (
              siteGroups.map((group) => {
                const groupStatusPriority = STATUS_SORT_ORDER[group.turbines[0]?.status] ?? 99;
                const primaryStatus = group.turbines[0]?.status || 'running';
                const primaryCfg = STATUS_CONFIG[primaryStatus];

                const groupFaultCount = group.turbines.filter((t) => t.status === 'fault').length;
                const groupStopCount = group.turbines.filter((t) => t.status === 'stopped').length;
                const groupMaintCount = group.turbines.filter(
                  (t) => t.status === 'maintenance',
                ).length;
                const groupRunCount = group.turbines.filter((t) => t.status === 'running').length;

                return (
                  <Box
                    key={group.siteName}
                    sx={{
                      background: '#fff',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      overflow: 'hidden',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        borderColor: 'primary.light',
                      },
                    }}
                  >
                    {/* Site Header */}
                    <Box
                      sx={{
                        px: { xs: 1.5, sm: 2.5 },
                        py: { xs: 1, sm: 1.5 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1,
                        background:
                          groupStatusPriority === 1
                            ? 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(239,68,68,0.03) 100%)'
                            : groupStatusPriority === 2
                              ? 'linear-gradient(135deg, rgba(100,116,139,0.06) 0%, rgba(100,116,139,0.03) 100%)'
                              : groupStatusPriority === 3
                                ? 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0.03) 100%)'
                                : 'linear-gradient(135deg, rgba(16,185,129,0.04) 0%, rgba(16,185,129,0.02) 100%)',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: { xs: 8, sm: 10 },
                            height: { xs: 8, sm: 10 },
                            borderRadius: '50%',
                            background: primaryCfg.color,
                            boxShadow: `0 0 8px ${primaryCfg.color}`,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: { xs: '0.8rem', sm: '0.95rem' },
                            fontWeight: 700,
                            color: 'text.primary',
                          }}
                        >
                          {group.siteName}
                        </Typography>
                        <Chip
                          label={`${group.turbines.length}`}
                          size='small'
                          sx={{
                            height: { xs: 18, sm: 22 },
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            background: 'rgba(99,102,241,0.08)',
                            color: '#6366f1',
                            border: '1px solid rgba(99,102,241,0.15)',
                            minWidth: 24,
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {groupFaultCount > 0 && (
                          <Chip
                            label={`${groupFaultCount}`}
                            size='small'
                            sx={{
                              height: { xs: 18, sm: 20 },
                              fontSize: '0.58rem',
                              fontWeight: 700,
                              background: 'rgba(239,68,68,0.12)',
                              color: '#ef4444',
                              border: '1px solid rgba(239,68,68,0.25)',
                              minWidth: 20,
                            }}
                          />
                        )}
                        {groupStopCount > 0 && (
                          <Chip
                            label={`${groupStopCount}`}
                            size='small'
                            sx={{
                              height: { xs: 18, sm: 20 },
                              fontSize: '0.58rem',
                              fontWeight: 700,
                              background: 'rgba(100,116,139,0.12)',
                              color: '#64748b',
                              border: '1px solid rgba(100,116,139,0.25)',
                              minWidth: 20,
                            }}
                          />
                        )}
                        {groupMaintCount > 0 && (
                          <Chip
                            label={`${groupMaintCount}`}
                            size='small'
                            sx={{
                              height: { xs: 18, sm: 20 },
                              fontSize: '0.58rem',
                              fontWeight: 700,
                              background: 'rgba(245,158,11,0.12)',
                              color: '#f59e0b',
                              border: '1px solid rgba(245,158,11,0.25)',
                              minWidth: 20,
                            }}
                          />
                        )}
                        {groupRunCount > 0 && (
                          <Chip
                            label={`${groupRunCount}`}
                            size='small'
                            sx={{
                              height: { xs: 18, sm: 20 },
                              fontSize: '0.58rem',
                              fontWeight: 700,
                              background: 'rgba(16,185,129,0.12)',
                              color: '#10b981',
                              border: '1px solid rgba(16,185,129,0.25)',
                              minWidth: 20,
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Turbines Grid */}
                    <Box
                      sx={{
                        p: { xs: 1, sm: 2 },
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: { xs: 0.75, sm: 1.25 },
                      }}
                    >
                      {group.turbines.map((turbine) => {
                        const cfg = STATUS_CONFIG[turbine.status];
                        return (
                          <Box
                            key={turbine.turbineNo}
                            onClick={() =>
                              navigate(AdminPath.TURBINE_DETAIL.replace(':id', String(turbine.id)))
                            }
                            sx={{
                              p: { xs: 1, sm: 1.5 },
                              borderRadius: 1.5,
                              border: '1px solid',
                              borderColor: cfg.borderColor,
                              background: cfg.bgColor,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              position: 'relative',
                              overflow: 'hidden',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 4px 12px ${cfg.borderColor}`,
                                borderColor: cfg.color,
                              },
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 2,
                                background: cfg.color,
                                opacity: 0.8,
                              },
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  background: cfg.color,
                                  boxShadow: `0 0 4px ${cfg.color}`,
                                  flexShrink: 0,
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: { xs: '0.62rem', sm: '0.72rem' },
                                  fontWeight: 700,
                                  color: 'text.primary',
                                  lineHeight: 1.2,
                                }}
                              >
                                {turbine.turbineNo}
                              </Typography>
                            </Box>
                            <Typography
                              sx={{
                                fontSize: { xs: '0.55rem', sm: '0.62rem' },
                                color: cfg.color,
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.25,
                              }}
                            >
                              {getStatusIcon(turbine.status)}
                              {cfg.label}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '0.55rem',
                                color: 'text.secondary',
                                mt: 0.25,
                              }}
                            >
                              {turbine.activePower.toFixed(1)} kW
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              px: { xs: 1.5, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
              borderTop: '1px solid',
              borderColor: 'divider',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary' }}>
              Fault → Stopped → Maintenance → Running
            </Typography>
            <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary' }}>
              Tap turbine for details
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default FleetStatusMatrixPage;
