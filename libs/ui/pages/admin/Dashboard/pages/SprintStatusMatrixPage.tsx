import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Divider,
  Button,
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InsightsIcon from '@mui/icons-material/Insights';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import { useAdminKeyframes, useLiveDateTime } from '../../../../hooks';
import { constants } from '@infygen/utils';
import { useStyles } from '../styles/Dashboard.styles';
import { MOCK_TICKETS } from '../utils/dashboard.utils';

// ─── Board Column Definitions ──────────────────────────────────────────────────

type BoardColumnKey = 'To Do' | 'In Progress' | 'In Review' | 'In Test' | 'Done';

interface BoardColumn {
  key: BoardColumnKey;
  label: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
}

const BOARD_COLUMNS: BoardColumn[] = [
  {
    key: 'To Do',
    label: 'TO DO',
    accent: '#64748b',
    accentBg: 'rgba(100,116,139,0.1)',
    accentBorder: 'rgba(100,116,139,0.25)',
  },
  {
    key: 'In Progress',
    label: 'IN PROGRESS',
    accent: '#3b82f6',
    accentBg: 'rgba(59,130,246,0.1)',
    accentBorder: 'rgba(59,130,246,0.3)',
  },
  {
    key: 'In Review',
    label: 'IN REVIEW',
    accent: '#8b5cf6',
    accentBg: 'rgba(139,92,246,0.1)',
    accentBorder: 'rgba(139,92,246,0.3)',
  },
  {
    key: 'In Test',
    label: 'IN TEST',
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.1)',
    accentBorder: 'rgba(245,158,11,0.3)',
  },
  {
    key: 'Done',
    label: 'DONE',
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,0.1)',
    accentBorder: 'rgba(16,185,129,0.3)',
  },
];

// ─── Card Category Palette (Jira-style colored tags) ──────────────────────────

const CATEGORY_PALETTE: Record<string, { bg: string; fg: string; border: string }> = {
  Story: { bg: 'rgba(99,102,241,0.12)', fg: '#4f46e5', border: 'rgba(99,102,241,0.3)' },
  Task: { bg: 'rgba(6,182,212,0.12)', fg: '#0891b2', border: 'rgba(6,182,212,0.3)' },
  Bug: { bg: 'rgba(239,68,68,0.12)', fg: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  Epic: { bg: 'rgba(139,92,246,0.12)', fg: '#7c3aed', border: 'rgba(139,92,246,0.3)' },
  Spike: { bg: 'rgba(245,158,11,0.12)', fg: '#d97706', border: 'rgba(245,158,11,0.3)' },
  Billing: { bg: 'rgba(59,130,246,0.12)', fg: '#2563eb', border: 'rgba(59,130,246,0.3)' },
  Accounts: { bg: 'rgba(16,185,129,0.12)', fg: '#059669', border: 'rgba(16,185,129,0.3)' },
  Forms: { bg: 'rgba(139,92,246,0.12)', fg: '#7c3aed', border: 'rgba(139,92,246,0.3)' },
  Feedback: { bg: 'rgba(245,158,11,0.12)', fg: '#d97706', border: 'rgba(245,158,11,0.3)' },
};

const getCategoryPalette = (cat: string) => CATEGORY_PALETTE[cat] ?? CATEGORY_PALETTE.Task;

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const TEAM_GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)',
];

// ─── Project Config (matches "Beyond Gravity" pattern) ─────────────────────────

const PROJECT_INFO = {
  name: 'Beyond Gravity',
  subtitle: 'Software project',
  team: 'Wookies · Sprint 24',
};

// ─── Squad / Team Filter Chips ────────────────────────────────────────────────

type SquadKey = 'All' | 'Wookies' | 'Wagles' | 'Falcons' | 'Titans';

interface Squad {
  key: SquadKey;
  label: string;
  emoji: string;
  color: string;
  colorDark?: string;
  bg: string;
  bgSoft?: string;
  border: string;
  glow?: string;
  // Map functional team names from MOCK_TICKETS to this squad
  teams: string[];
}

const SQUADS: Squad[] = [
  {
    key: 'All',
    label: 'All Teams',
    emoji: '🌐',
    color: '#6366f1',
    colorDark: '#4338ca',
    bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    bgSoft: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.3)',
    glow: 'rgba(99,102,241,0.35)',
    teams: [],
  },
  {
    key: 'Wookies',
    label: 'Wookies',
    emoji: '🐻',
    color: '#7c3aed',
    colorDark: '#5b21b6',
    bg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    bgSoft: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.3)',
    glow: 'rgba(139,92,246,0.35)',
    teams: ['Frontend', 'Design'],
  },
  {
    key: 'Wagles',
    label: 'Wagles',
    emoji: '🦅',
    color: '#2563eb',
    colorDark: '#1d4ed8',
    bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    bgSoft: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.3)',
    glow: 'rgba(59,130,246,0.35)',
    teams: ['Backend'],
  },
  {
    key: 'Falcons',
    label: 'Falcons',
    emoji: '🦅',
    color: '#059669',
    colorDark: '#047857',
    bg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    bgSoft: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.3)',
    glow: 'rgba(16,185,129,0.35)',
    teams: ['QA'],
  },
  {
    key: 'Titans',
    label: 'Titans',
    emoji: '⚙️',
    color: '#d97706',
    colorDark: '#b45309',
    bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    bgSoft: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.3)',
    glow: 'rgba(245,158,11,0.35)',
    teams: ['DevOps'],
  },
];

const SprintStatusMatrixPage = () => {
  const { AdminPath } = constants;
  const navigate = useNavigate();
  const keyframes = useAdminKeyframes();
  const { classes } = useStyles();
  const { hours, minutes, seconds, dateStr } = useLiveDateTime();

  const [search, setSearch] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [groupByAnchor, setGroupByAnchor] = useState<null | HTMLElement>(null);
  const [epicAnchor, setEpicAnchor] = useState<null | HTMLElement>(null);
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);
  const [groupBy, setGroupBy] = useState<'None' | 'Assignee' | 'Epic' | 'Team'>('None');
  const [epicFilter, setEpicFilter] = useState<string>('All Epics');
  const [activeSquad, setActiveSquad] = useState<SquadKey>('All');

  const activeSquadConfig = SQUADS.find((s) => s.key === activeSquad) ?? SQUADS[0];

  // Filter tickets for board view (squad + search)
  const filteredTickets = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_TICKETS.filter((t) => {
      if (activeSquad !== 'All' && !activeSquadConfig.teams.includes(t.team)) {
        return false;
      }
      if (!q) return true;
      return (
        t.summary.toLowerCase().includes(q) ||
        t.issueNo.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q) ||
        t.team.toLowerCase().includes(q)
      );
    });
  }, [search, activeSquad, activeSquadConfig]);

  // Count tickets per squad (for chip badges) — ignores search so users can see totals
  const squadCounts = useMemo(() => {
    const counts: Record<SquadKey, number> = {
      All: MOCK_TICKETS.length,
      Wookies: 0,
      Wagles: 0,
      Falcons: 0,
      Titans: 0,
    };
    SQUADS.forEach((s) => {
      if (s.key === 'All') return;
      counts[s.key] = MOCK_TICKETS.filter((t) => s.teams.includes(t.team)).length;
    });
    return counts;
  }, []);

  // Group tickets by status
  const ticketsByStatus = useMemo(() => {
    const map: Record<BoardColumnKey, typeof MOCK_TICKETS> = {
      'To Do': [],
      'In Progress': [],
      'In Review': [],
      'In Test': [],
      Done: [],
    };
    filteredTickets.forEach((t) => {
      if (t.status === 'Blocked') {
        // Map "Blocked" to "In Progress"
        map['In Progress'].push(t);
      } else if (
        t.status === 'To Do' ||
        t.status === 'In Progress' ||
        t.status === 'In Review' ||
        t.status === 'In Test' ||
        t.status === 'Done'
      ) {
        map[t.status].push(t);
      } else {
        map['To Do'].push(t);
      }
    });
    return map;
  }, [filteredTickets]);

  // Top 4 assignees (for header avatars)
  const topAssignees = useMemo(() => {
    const seen = new Set<string>();
    const list: { name: string; gradient: string }[] = [];
    filteredTickets.forEach((t) => {
      if (!seen.has(t.assignee)) {
        seen.add(t.assignee);
        list.push({
          name: t.assignee,
          gradient: TEAM_GRADIENTS[list.length % TEAM_GRADIENTS.length],
        });
      }
    });
    return list.slice(0, 4);
  }, [filteredTickets]);

  return (
    <>
      {keyframes}
      <style>{`
        @keyframes squad-shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .squad-chip::after {
          animation: squad-shimmer 2.4s ease-in-out infinite;
        }
      `}</style>
      <Box className={classes.container}>
        {/* ── Hero Header (kept as-is) ── */}
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
                    '& .closeIcon': { transform: 'rotate(90deg)' },
                  },
                  '&:active': { transform: 'scale(0.95)' },
                  '& .closeIcon': { transition: 'transform 0.2s ease' },
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
                Sprint Status Matrix
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '0.6rem', sm: '0.72rem' },
                  color: '#94a3b8',
                  fontWeight: 500,
                  marginTop: '2px',
                }}
              >
                {filteredTickets.length} Tickets · {topAssignees.length} Active Members
              </Typography>
            </Box>
          </Box>

          {/* Center Section - Title & Live Badge */}
          <Box className={classes.heroCenter}>
            <Typography className={classes.heroCenterTitle}>SPRINT MONITOR</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Box className={classes.heroCenterBadge} sx={{ mr: 0 }}>
                <Box className={classes.heroCenterDot} />
                <Typography className={classes.heroCenterLive} sx={{ pt: 0.5, pb: 0.5 }}>
                  Live Tracking
                </Typography>
              </Box>
              <Chip
                label={PROJECT_INFO.team}
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

          {/* Right Section - Clock Widget & Close Button */}
          <Box className={classes.heroRight}>
            <Box className={classes.heroClockWidget}>
              <Box className={classes.heroClockRow}>
                <Typography className={classes.heroClockHM}>
                  {hours}:{minutes}
                </Typography>
                <Typography className={classes.heroClockSec}>{seconds}</Typography>
              </Box>
              <Typography className={classes.heroClockDate}>{dateStr}</Typography>
            </Box>

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
                      '& .closeIcon': { transform: 'rotate(90deg)' },
                    },
                    '&:active': { transform: 'scale(0.95)' },
                    '& .closeIcon': { transition: 'transform 0.2s ease' },
                  }}
                >
                  <CloseIcon className='closeIcon' sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* ── Squad / Team Filter Chips ── */}
        <Box
          sx={{
            mt: 2,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
            px: 0.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              mr: 0.5,
              pr: 1.25,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                right: 0,
                top: '20%',
                bottom: '20%',
                width: '1px',
                background:
                  'linear-gradient(180deg, transparent 0%, #cbd5e1 50%, transparent 100%)',
              },
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 0 8px rgba(99,102,241,0.6)',
              }}
            />
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
              }}
            >
              Squads
            </Typography>
          </Box>
          {SQUADS.map((squad) => {
            const isActive = activeSquad === squad.key;
            const count = squadCounts[squad.key];
            return (
              <Box
                key={squad.key}
                component='button'
                type='button'
                onClick={() => setActiveSquad(squad.key)}
                className='squad-chip'
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  pl: 0.5,
                  pr: 0.5,
                  py: 0.5,
                  borderRadius: 999,
                  border: '1px solid',
                  borderColor: isActive ? 'transparent' : '#e2e8f0',
                  background: isActive ? squad.bg : '#ffffff',
                  color: isActive ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.005em',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: isActive
                    ? `0 8px 24px ${squad.glow}, 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.2)`
                    : '0 1px 2px rgba(15,23,42,0.04), 0 0 0 1px rgba(15,23,42,0.02)',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: isActive
                      ? `0 12px 32px ${squad.glow}, 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.25)`
                      : `0 6px 18px ${squad.glow}, 0 0 0 1px ${squad.border}`,
                    borderColor: isActive ? 'transparent' : squad.color,
                  },
                  '&:active': { transform: 'translateY(0)' },
                  '&::after': isActive
                    ? {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background:
                          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                        animation: 'shimmer 2.4s infinite',
                        pointerEvents: 'none',
                      }
                    : {},
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: isActive ? 'rgba(255,255,255,0.2)' : squad.bgSoft,
                    backdropFilter: isActive ? 'blur(8px)' : 'none',
                    fontSize: '0.95rem',
                    lineHeight: 1,
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    flexShrink: 0,
                  }}
                >
                  {squad.emoji}
                </Box>
                <Box
                  component='span'
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    textShadow: isActive ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {squad.label}
                </Box>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 24,
                    height: 22,
                    px: 0.7,
                    ml: 0.25,
                    borderRadius: 999,
                    background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#64748b',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    lineHeight: 1,
                    backdropFilter: isActive ? 'blur(8px)' : 'none',
                    border: isActive ? '1px solid rgba(255,255,255,0.25)' : 'none',
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                  }}
                >
                  {count}
                </Box>
              </Box>
            );
          })}
          {activeSquad !== 'All' && (
            <Box
              component='button'
              type='button'
              onClick={() => setActiveSquad('All')}
              sx={{
                ml: 0.25,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.25,
                py: 0.65,
                borderRadius: 999,
                border: '1px solid #fecaca',
                background:
                  'linear-gradient(135deg, rgba(254,226,226,0.5) 0%, rgba(255,255,255,0.9) 100%)',
                color: '#dc2626',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.72rem',
                fontWeight: 700,
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 1px 3px rgba(220,38,38,0.08)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, rgba(254,226,226,0.8) 0%, rgba(255,255,255,1) 100%)',
                  borderColor: '#ef4444',
                  color: '#b91c1c',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 18px rgba(220,38,38,0.2)',
                },
                '&:active': { transform: 'translateY(0)' },
              }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: 'rgba(220,38,38,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                }}
              >
                ✕
              </Box>
              Clear
            </Box>
          )}
        </Box>

        {/* ── Jira-Style Project Board ── */}
        <Box
          sx={{
            background: '#fff',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(99,102,241,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Project Sidebar (Top section: project + breadcrumb + Board title) */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 2,
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 2.25 },
              background:
                'linear-gradient(135deg, rgba(79,70,229,0.03) 0%, rgba(124,58,237,0.02) 100%)',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            {/* Project Icon & Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(139,92,246,0.3)',
                  flexShrink: 0,
                }}
              >
                <RocketLaunchIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'text.primary',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {PROJECT_INFO.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.65rem',
                    color: '#94a3b8',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    mt: 0.15,
                  }}
                >
                  {PROJECT_INFO.subtitle}
                </Typography>
              </Box>
            </Box>

            {/* Breadcrumb & Board Title */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 1,
                pl: 2,
                ml: 1,
                borderLeft: '1px solid',
                borderColor: 'divider',
                height: 40,
                minWidth: 0,
                flex: 1,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 500 }}>
                    Projects / {PROJECT_INFO.name}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'text.primary',
                    letterSpacing: '-0.01em',
                    mt: 0.15,
                  }}
                >
                  Board
                </Typography>
              </Box>
            </Box>

            {/* Right Actions: Avatars + Epic + GroupBy + Insights + Star + More */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                flexWrap: 'wrap',
                ml: { xs: 0, md: 'auto' },
              }}
            >
              {/* Team Avatars */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', mr: 0.5 }}>
                  {topAssignees.map((a, i) => (
                    <Tooltip key={a.name} title={a.name} arrow>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          background: a.gradient,
                          border: '2px solid #fff',
                          ml: i === 0 ? 0 : '-8px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          cursor: 'pointer',
                        }}
                      >
                        {getInitials(a.name)}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Box>
                {topAssignees.length > 0 && (
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#f1f5f9',
                      border: '2px solid #fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      color: '#64748b',
                      ml: '-8px',
                    }}
                  >
                    +3
                  </Box>
                )}
              </Box>

              {/* Epic Filter */}
              <Button
                size='small'
                variant='outlined'
                onClick={(e) => setEpicAnchor(e.currentTarget)}
                startIcon={
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#8b5cf6',
                    }}
                  />
                }
                sx={{
                  textTransform: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#475569',
                  borderColor: '#e2e8f0',
                  background: '#f8fafc',
                  height: 32,
                  px: 1.5,
                  '&:hover': { background: '#f1f5f9', borderColor: '#cbd5e1' },
                }}
              >
                {epicFilter}
              </Button>
              <Menu
                anchorEl={epicAnchor}
                open={Boolean(epicAnchor)}
                onClose={() => setEpicAnchor(null)}
                PaperProps={{
                  sx: {
                    mt: 0.5,
                    minWidth: 160,
                    borderRadius: 2,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  },
                }}
              >
                {['All Epics', 'Mobile App', 'Backend', 'DevOps', 'Design System'].map((opt) => (
                  <MenuItem
                    key={opt}
                    selected={epicFilter === opt}
                    onClick={() => {
                      setEpicFilter(opt);
                      setEpicAnchor(null);
                    }}
                    sx={{ fontSize: '0.78rem', py: 0.75 }}
                  >
                    {opt}
                  </MenuItem>
                ))}
              </Menu>

              {/* Group By */}
              <Button
                size='small'
                variant='outlined'
                onClick={(e) => setGroupByAnchor(e.currentTarget)}
                startIcon={<GroupWorkIcon sx={{ fontSize: 14 }} />}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#475569',
                  borderColor: '#e2e8f0',
                  background: '#f8fafc',
                  height: 32,
                  px: 1.5,
                  '&:hover': { background: '#f1f5f9', borderColor: '#cbd5e1' },
                }}
              >
                GROUP BY · {groupBy}
              </Button>
              <Menu
                anchorEl={groupByAnchor}
                open={Boolean(groupByAnchor)}
                onClose={() => setGroupByAnchor(null)}
                PaperProps={{
                  sx: {
                    mt: 0.5,
                    minWidth: 160,
                    borderRadius: 2,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  },
                }}
              >
                {(['None', 'Assignee', 'Epic', 'Team'] as const).map((opt) => (
                  <MenuItem
                    key={opt}
                    selected={groupBy === opt}
                    onClick={() => {
                      setGroupBy(opt);
                      setGroupByAnchor(null);
                    }}
                    sx={{ fontSize: '0.78rem', py: 0.75 }}
                  >
                    {opt}
                  </MenuItem>
                ))}
              </Menu>

              {/* Insights */}
              <Button
                size='small'
                variant='outlined'
                startIcon={<InsightsIcon sx={{ fontSize: 14 }} />}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#4f46e5',
                  borderColor: 'rgba(79,70,229,0.3)',
                  background: 'rgba(79,70,229,0.05)',
                  height: 32,
                  px: 1.5,
                  '&:hover': { background: 'rgba(79,70,229,0.1)', borderColor: '#4f46e5' },
                }}
              >
                Insights
              </Button>

              {/* Star (Favorite) */}
              <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'} arrow>
                <IconButton
                  size='small'
                  onClick={() => setIsFavorite((p) => !p)}
                  sx={{
                    color: isFavorite ? '#f59e0b' : '#94a3b8',
                    background: isFavorite ? 'rgba(245,158,11,0.1)' : '#f1f5f9',
                    border: '1px solid',
                    borderColor: isFavorite ? 'rgba(245,158,11,0.3)' : '#e2e8f0',
                    borderRadius: '8px',
                    p: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(245,158,11,0.1)',
                      color: '#f59e0b',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  {isFavorite ? (
                    <StarIcon sx={{ fontSize: 16 }} />
                  ) : (
                    <StarBorderIcon sx={{ fontSize: 16 }} />
                  )}
                </IconButton>
              </Tooltip>

              {/* More Menu */}
              <Tooltip title='More actions' arrow>
                <IconButton
                  size='small'
                  onClick={(e) => setMoreAnchor(e.currentTarget)}
                  sx={{
                    color: '#94a3b8',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    p: 0.5,
                    '&:hover': { background: '#e2e8f0', color: '#475569' },
                  }}
                >
                  <MoreHorizIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={moreAnchor}
                open={Boolean(moreAnchor)}
                onClose={() => setMoreAnchor(null)}
                PaperProps={{
                  sx: {
                    mt: 0.5,
                    minWidth: 180,
                    borderRadius: 2,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <MenuItem sx={{ fontSize: '0.78rem' }}>Configure board</MenuItem>
                <MenuItem sx={{ fontSize: '0.78rem' }}>Share board</MenuItem>
                <MenuItem sx={{ fontSize: '0.78rem' }}>Export data</MenuItem>
                <Divider />
                <MenuItem sx={{ fontSize: '0.78rem', color: '#ef4444' }}>Clear board</MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Board Search Bar */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              background: '#fafbfc',
              borderBottom: '1px solid',
              borderColor: 'divider',
              flexWrap: 'wrap',
            }}
          >
            <TextField
              placeholder='Search board...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size='small'
              sx={{
                flex: 1,
                minWidth: { xs: '100%', sm: 280 },
                '& .MuiOutlinedInput-root': {
                  height: 36,
                  fontSize: '0.8rem',
                  background: '#fff',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #e2e8f0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #cbd5e1',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #4f46e5',
                    borderWidth: 1,
                  },
                },
                '& .MuiInputBase-input': {
                  py: '8px',
                  px: 1.25,
                  '&::placeholder': { color: '#94a3b8', opacity: 1 },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Tooltip title='Filter board' arrow>
              <IconButton
                size='small'
                sx={{
                  color: '#64748b',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  p: 0.75,
                  '&:hover': { background: '#f1f5f9' },
                }}
              >
                <FilterListIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* ── Kanban Board Columns ── */}
          <Box
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              background: '#fafbfc',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(5, 1fr)',
                },
                gap: 1.5,
                alignItems: 'flex-start',
              }}
            >
              {BOARD_COLUMNS.map((col) => {
                const colTickets = ticketsByStatus[col.key];
                return (
                  <Box
                    key={col.key}
                    sx={{
                      background: '#fff',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      minHeight: 320,
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                        borderColor: col.accentBorder,
                      },
                    }}
                  >
                    {/* Column Header */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 1.5,
                        py: 1.25,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        background: col.accentBg,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: col.accent,
                            boxShadow: `0 0 6px ${col.accent}55`,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            color: col.accent,
                            letterSpacing: '0.08em',
                          }}
                        >
                          {col.label}
                        </Typography>
                        {col.key === 'Done' && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: col.accent,
                            }}
                          >
                            <Box
                              sx={{
                                width: 14,
                                height: 14,
                                borderRadius: '50%',
                                border: `1.5px solid ${col.accent}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.55rem',
                                fontWeight: 800,
                              }}
                            >
                              ✓
                            </Box>
                          </Box>
                        )}
                      </Box>
                      <Chip
                        label={colTickets.length}
                        size='small'
                        sx={{
                          height: 20,
                          minWidth: 26,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          background: col.accent,
                          color: '#fff',
                          '& .MuiChip-label': { px: 0.75 },
                        }}
                      />
                    </Box>

                    {/* Column Body (Cards) */}
                    <Box
                      sx={{
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        flex: 1,
                      }}
                    >
                      {colTickets.length === 0 ? (
                        <Box
                          sx={{
                            py: 4,
                            textAlign: 'center',
                            border: '1.5px dashed',
                            borderColor: 'divider',
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            sx={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}
                          >
                            {activeSquad === 'All'
                              ? 'No tickets'
                              : `No ${activeSquadConfig.label} tickets here`}
                          </Typography>
                        </Box>
                      ) : (
                        colTickets.map((ticket) => {
                          const cat = getCategoryPalette(ticket.issueType);
                          const assigneeGradient =
                            TEAM_GRADIENTS[
                              Math.abs(
                                ticket.assignee.split('').reduce((s, c) => s + c.charCodeAt(0), 0),
                              ) % TEAM_GRADIENTS.length
                            ];
                          return (
                            <Box
                              key={ticket.id}
                              onClick={() =>
                                navigate(
                                  AdminPath.TICKET_DETAIL.replace(
                                    ':id',
                                    encodeURIComponent(ticket.issueNo),
                                  ),
                                )
                              }
                              sx={{
                                p: 1.25,
                                background: '#fff',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1.5,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                '&:hover': {
                                  borderColor: cat.border,
                                  boxShadow: `0 4px 12px rgba(0,0,0,0.08), 0 0 0 1px ${cat.border}`,
                                  transform: 'translateY(-2px)',
                                },
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: 3,
                                  bottom: 0,
                                  background: cat.fg,
                                  borderTopLeftRadius: 6,
                                  borderBottomLeftRadius: 6,
                                  opacity: 0,
                                  transition: 'opacity 0.2s ease',
                                },
                                '&:hover::before': { opacity: 1 },
                              }}
                            >
                              {/* Category Tag */}
                              <Box sx={{ mb: 0.75 }}>
                                <Box
                                  sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    px: 0.85,
                                    py: 0.2,
                                    borderRadius: 0.75,
                                    background: cat.bg,
                                    border: `1px solid ${cat.border}`,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 5,
                                      height: 5,
                                      borderRadius: '50%',
                                      background: cat.fg,
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      fontSize: '0.6rem',
                                      fontWeight: 800,
                                      color: cat.fg,
                                      letterSpacing: '0.04em',
                                      textTransform: 'uppercase',
                                      lineHeight: 1,
                                    }}
                                  >
                                    {ticket.issueType}
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Title */}
                              <Typography
                                sx={{
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  color: 'text.primary',
                                  lineHeight: 1.35,
                                  mb: 1,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                                title={ticket.summary}
                              >
                                {ticket.summary}
                              </Typography>

                              {/* Footer: ID + Avatar */}
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    px: 0.75,
                                    py: 0.2,
                                    borderRadius: 0.75,
                                    background: 'rgba(16,185,129,0.08)',
                                    border: '1px solid rgba(16,185,129,0.25)',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 0,
                                      height: 0,
                                      borderLeft: '4px solid transparent',
                                      borderRight: '4px solid transparent',
                                      borderBottom: '6px solid #10b981',
                                      transform: 'rotate(180deg)',
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      fontSize: '0.65rem',
                                      fontWeight: 700,
                                      color: '#059669',
                                      fontFamily: 'monospace',
                                      lineHeight: 1,
                                    }}
                                  >
                                    {ticket.issueNo}
                                  </Typography>
                                </Box>

                                <Tooltip title={ticket.assignee} arrow>
                                  <Avatar
                                    sx={{
                                      width: 22,
                                      height: 22,
                                      fontSize: '0.6rem',
                                      fontWeight: 700,
                                      background: assigneeGradient,
                                      border: '1.5px solid #fff',
                                      boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                                    }}
                                  >
                                    {getInitials(ticket.assignee)}
                                  </Avatar>
                                </Tooltip>
                              </Box>

                              {/* Story points chip (subtle) */}
                              {ticket.storyPoints > 0 && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.25,
                                    px: 0.5,
                                    py: 0.1,
                                    borderRadius: 0.5,
                                    background: 'rgba(99,102,241,0.08)',
                                    color: '#4f46e5',
                                    fontSize: '0.6rem',
                                    fontWeight: 700,
                                  }}
                                >
                                  {ticket.storyPoints} SP
                                </Box>
                              )}
                            </Box>
                          );
                        })
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Footer Summary */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.25 },
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              {BOARD_COLUMNS.map((col) => {
                const count = ticketsByStatus[col.key].length;
                return (
                  <Box key={col.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: col.accent,
                      }}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>
                      {count} {col.label.toLowerCase()}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary' }}>
              Click a card to open the ticket
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SprintStatusMatrixPage;
