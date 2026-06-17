import { useState, useMemo, useRef, useEffect, DragEvent } from 'react';
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
  CircularProgress,
  Popover,
  LinearProgress,
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import SortIcon from '@mui/icons-material/Sort';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import BackspaceIcon from '@mui/icons-material/Backspace';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlagIcon from '@mui/icons-material/Flag';
import BoltIcon from '@mui/icons-material/Bolt';
import { useAdminKeyframes, useLiveDateTime } from '../../../../hooks';
import { constants } from '@sprintpulse/utils';
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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearchPending, setIsSearchPending] = useState(false);
  const [epicAnchor, setEpicAnchor] = useState<null | HTMLElement>(null);
  const [assigneesAnchor, setAssigneesAnchor] = useState<null | HTMLElement>(null);
  const [progressAnchor, setProgressAnchor] = useState<null | HTMLElement>(null);
  const [myTicketsAssignee, setMyTicketsAssignee] = useState<string | null>(null);
  const [myTicketsAnchor, setMyTicketsAnchor] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<'Default' | 'Story Points' | 'Issue Type' | 'Issue No'>(
    'Default',
  );
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [density, setDensity] = useState<'Comfortable' | 'Compact'>('Comfortable');
  const [statusFilter, setStatusFilter] = useState<'All' | BoardColumnKey>('All');
  const [activeSquad, setActiveSquad] = useState<SquadKey>('All');

  // Local mutable tickets — initialized from MOCK_TICKETS so drag-and-drop can move them
  const [tickets, setTickets] = useState(() => MOCK_TICKETS.map((t) => ({ ...t })));
  // Set of ticket ids that should currently show the "just-landed" animation
  const [recentlyMoved, setRecentlyMoved] = useState<Set<number>>(new Set());
  // Currently-dragged ticket id (null = not dragging)
  const [draggedTicketId, setDraggedTicketId] = useState<number | null>(null);
  // Column currently being hovered as a drop target
  const [dragOverColumn, setDragOverColumn] = useState<BoardColumnKey | null>(null);
  // For the "just landed" drop indicator line in a column
  const [dropIndicatorColumn, setDropIndicatorColumn] = useState<BoardColumnKey | null>(null);
  const dragImageRef = useRef<HTMLDivElement | null>(null);
  const dropTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const landTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce the search input so the board doesn't re-filter on every keystroke.
  // While a debounce is in flight, show a small loader inside the search field.
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (search === debouncedSearch) {
      setIsSearchPending(false);
      return;
    }
    setIsSearchPending(true);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setIsSearchPending(false);
    }, 350);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [search, debouncedSearch]);

  const activeSquadConfig = SQUADS.find((s) => s.key === activeSquad) ?? SQUADS[0];

  // Filter tickets for board view (squad + search + status + my-tickets)
  const filteredTickets = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return tickets.filter((t) => {
      if (activeSquad !== 'All' && !activeSquadConfig.teams.includes(t.team)) {
        return false;
      }
      if (statusFilter !== 'All' && t.status !== statusFilter) {
        return false;
      }
      if (myTicketsAssignee && t.assignee !== myTicketsAssignee) {
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
  }, [tickets, debouncedSearch, activeSquad, activeSquadConfig, statusFilter, myTicketsAssignee]);

  // Sprint progress metrics (computed from the full ticket set, not the filtered one,
  // so the popover always reflects the actual sprint health)
  const sprintMetrics = useMemo(() => {
    const total = tickets.length;
    const done = tickets.filter((t) => t.status === 'Done').length;
    const inProgress = tickets.filter((t) =>
      ['In Progress', 'In Review', 'In Test'].includes(t.status),
    ).length;
    const blocked = tickets.filter((t) => t.status === 'Blocked').length;
    const totalPoints = tickets.reduce((s, t) => s + t.storyPoints, 0);
    const donePoints = tickets
      .filter((t) => t.status === 'Done')
      .reduce((s, t) => s + t.storyPoints, 0);
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    // Demo: assume 14-day sprint, today is day 9 (2026-06-16 of a sprint ending 2026-06-22)
    const sprintStart = '2026-06-09';
    const sprintEnd = '2026-06-22';
    const startMs = new Date(sprintStart).getTime();
    const endMs = new Date(sprintEnd).getTime();
    const todayMs = new Date('2026-06-16').getTime();
    const totalDays = Math.max(1, Math.round((endMs - startMs) / 86400000));
    const daysElapsed = Math.max(0, Math.round((todayMs - startMs) / 86400000));
    const daysRemaining = Math.max(0, totalDays - daysElapsed);
    const expectedPercent = Math.round((daysElapsed / totalDays) * 100);
    return {
      total,
      done,
      inProgress,
      blocked,
      totalPoints,
      donePoints,
      percent,
      daysRemaining,
      expectedPercent,
    };
  }, [tickets]);

  // Count tickets per squad (for chip badges) — ignores search so users can see totals
  const squadCounts = useMemo(() => {
    const counts: Record<SquadKey, number> = {
      All: tickets.length,
      Wookies: 0,
      Wagles: 0,
      Falcons: 0,
      Titans: 0,
    };
    SQUADS.forEach((s) => {
      if (s.key === 'All') return;
      counts[s.key] = tickets.filter((t) => s.teams.includes(t.team)).length;
    });
    return counts;
  }, [tickets]);

  // ─── Drag-and-drop handlers ─────────────────────────────────────────────────
  // Map any non-board status (e.g. "Blocked") to a real BoardColumnKey
  const resolveBoardColumn = (status: string): BoardColumnKey => {
    if (
      status === 'To Do' ||
      status === 'In Progress' ||
      status === 'In Review' ||
      status === 'In Test' ||
      status === 'Done'
    ) {
      return status;
    }
    return 'In Progress';
  };

  // Build a custom drag image so the floating card looks like the real one,
  // tilted, lifted, with a soft glow. We pre-render an off-screen clone and
  // reuse it across the drag session.
  useEffect(() => {
    if (draggedTicketId === null) {
      dragImageRef.current = null;
      return;
    }
    const t = tickets.find((x) => x.id === draggedTicketId);
    if (!t) return;

    const ghost = document.createElement('div');
    const cat = getCategoryPalette(t.issueType);
    ghost.innerHTML = `
      <div style="
        background:#ffffff;
        border:1px solid #e2e8f0;
        border-left:3px solid ${cat.fg};
        border-radius:8px;
        padding:10px 12px;
        min-width:220px;
        max-width:260px;
        font-family:'Inter', system-ui, -apple-system, sans-serif;
        box-shadow:0 16px 40px rgba(15,23,42,0.18), 0 4px 12px rgba(99,102,241,0.15);
        transform:rotate(-3deg) scale(1.04);
        opacity:0.96;
        position:relative;
      ">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
          <span style="
            display:inline-block;
            width:6px;height:6px;border-radius:50%;
            background:${cat.fg};
          "></span>
          <span style="
            font-size:9px;font-weight:800;letter-spacing:0.04em;
            text-transform:uppercase;color:${cat.fg};
          ">${t.issueType}</span>
        </div>
        <div style="
          font-size:12px;font-weight:600;color:#0f172a;line-height:1.35;
          display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;
          overflow:hidden;
        ">${t.summary}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
          <span style="
            font-size:10px;font-weight:700;color:#059669;
            font-family:monospace;
          ">${t.issueNo}</span>
          <span style="
            display:inline-block;width:18px;height:18px;border-radius:50%;
            background:linear-gradient(135deg,#6366f1,#8b5cf6);
            color:#fff;font-size:8px;font-weight:800;
            text-align:center;line-height:18px;border:1.5px solid #fff;
          ">${getInitials(t.assignee)}</span>
        </div>
      </div>
    `;
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    ghost.style.left = '-1000px';
    ghost.style.pointerEvents = 'none';
    document.body.appendChild(ghost);
    dragImageRef.current = ghost;

    return () => {
      if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
    };
  }, [draggedTicketId, tickets]);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, ticketId: number) => {
    setDraggedTicketId(ticketId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(ticketId));
    // Use our custom drag image (built in the useEffect above). The element
    // may not be ready on the very first call in some browsers, so guard it.
    if (dragImageRef.current) {
      try {
        e.dataTransfer.setDragImage(dragImageRef.current, 130, 30);
      } catch {
        /* noop — fall back to default browser ghost */
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedTicketId(null);
    setDragOverColumn(null);
    setDropIndicatorColumn(null);
  };

  const handleColumnDragOver = (e: DragEvent<HTMLDivElement>, column: BoardColumnKey) => {
    if (draggedTicketId === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== column) setDragOverColumn(column);
  };

  const handleColumnDragLeave = (e: DragEvent<HTMLDivElement>, column: BoardColumnKey) => {
    // Only clear when leaving the column entirely (not when entering a child)
    const related = e.relatedTarget as Node | null;
    const current = e.currentTarget as Node | null;
    if (current && related && current.contains(related)) return;
    if (dragOverColumn === column) setDragOverColumn(null);
  };

  const handleColumnDrop = (e: DragEvent<HTMLDivElement>, column: BoardColumnKey) => {
    e.preventDefault();
    const ticketId = Number(e.dataTransfer.getData('text/plain'));
    if (!ticketId) {
      handleDragEnd();
      return;
    }

    setTickets((prev) => {
      const idx = prev.findIndex((t) => t.id === ticketId);
      if (idx === -1) return prev;
      const current = prev[idx];
      // Skip if no actual change
      if (resolveBoardColumn(current.status) === column) return prev;
      const updated = { ...current, status: column };
      const next = [...prev];
      next[idx] = updated;
      return next;
    });

    setRecentlyMoved((prev) => {
      const next = new Set(prev);
      next.add(ticketId);
      return next;
    });
    // Brief drop flash on the destination column
    setDropIndicatorColumn(column);
    if (dropTimeoutRef.current) clearTimeout(dropTimeoutRef.current);
    dropTimeoutRef.current = setTimeout(() => setDropIndicatorColumn(null), 600);

    // Clear the per-ticket "just-landed" flag after the animation finishes
    if (landTimeoutRef.current) clearTimeout(landTimeoutRef.current);
    landTimeoutRef.current = setTimeout(() => {
      setRecentlyMoved((prev) => {
        if (!prev.has(ticketId)) return prev;
        const next = new Set(prev);
        next.delete(ticketId);
        return next;
      });
    }, 700);

    handleDragEnd();
  };

  useEffect(() => {
    return () => {
      if (dropTimeoutRef.current) clearTimeout(dropTimeoutRef.current);
      if (landTimeoutRef.current) clearTimeout(landTimeoutRef.current);
    };
  }, []);

  // Group tickets by status, then sort each column based on the sort preference
  const ticketsByStatus = useMemo(() => {
    const sortTickets = (tickets: typeof MOCK_TICKETS) => {
      return [...tickets].sort((a, b) => {
        if (sortBy === 'Story Points') {
          if (a.storyPoints !== b.storyPoints) {
            // High story points first
            return b.storyPoints - a.storyPoints;
          }
        }
        if (sortBy === 'Issue Type') {
          const typeOrder: Record<string, number> = {
            Story: 0,
            Task: 1,
            Bug: 2,
            Epic: 3,
            Spike: 4,
          };
          const aType = typeOrder[a.issueType] ?? 5;
          const bType = typeOrder[b.issueType] ?? 5;
          return aType - bType;
        }
        if (sortBy === 'Issue No') {
          return a.issueNo.localeCompare(b.issueNo, undefined, { numeric: true });
        }
        // Default: preserve original order (which is roughly chronological)
        return 0;
      });
    };

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

    // Apply sorting to each column
    Object.keys(map).forEach((key) => {
      const colKey = key as BoardColumnKey;
      map[colKey] = sortTickets(map[colKey]);
    });

    return map;
  }, [filteredTickets, sortBy]);

  // All unique assignees from the current filtered tickets (used for the "+N" popover)
  const allAssignees = useMemo(() => {
    const seen = new Set<string>();
    const list: { name: string; gradient: string; count: number }[] = [];
    filteredTickets.forEach((t) => {
      if (!seen.has(t.assignee)) {
        seen.add(t.assignee);
        list.push({
          name: t.assignee,
          gradient: TEAM_GRADIENTS[list.length % TEAM_GRADIENTS.length],
          count: 0,
        });
      }
    });
    // Tally ticket count per assignee
    filteredTickets.forEach((t) => {
      const entry = list.find((a) => a.name === t.assignee);
      if (entry) entry.count += 1;
    });
    return list;
  }, [filteredTickets]);

  // Top 4 assignees (for header avatars)
  const topAssignees = useMemo(() => {
    return allAssignees.slice(0, 4);
  }, [allAssignees]);

  const remainingAssigneesCount = Math.max(0, allAssignees.length - topAssignees.length);

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
        @keyframes drop-flash-ToDo {
          0% { box-shadow: 0 0 0 0 rgba(100,116,139,0.45); }
          60% { box-shadow: 0 0 0 14px rgba(100,116,139,0); }
          100% { box-shadow: 0 0 0 0 rgba(100,116,139,0); }
        }
        @keyframes drop-flash-InProgress {
          0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.45); }
          60% { box-shadow: 0 0 0 14px rgba(59,130,246,0); }
          100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
        }
        @keyframes drop-flash-InReview {
          0% { box-shadow: 0 0 0 0 rgba(139,92,246,0.45); }
          60% { box-shadow: 0 0 0 14px rgba(139,92,246,0); }
          100% { box-shadow: 0 0 0 0 rgba(139,92,246,0); }
        }
        @keyframes drop-flash-InTest {
          0% { box-shadow: 0 0 0 0 rgba(245,158,11,0.45); }
          60% { box-shadow: 0 0 0 14px rgba(245,158,11,0); }
          100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
        }
        @keyframes drop-flash-Done {
          0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
          60% { box-shadow: 0 0 0 14px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
        @keyframes card-land {
          0% { transform: scale(0.94); opacity: 0.6; }
          60% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .ticket-card[draggable='true'] {
          cursor: grab;
        }
        .ticket-card[draggable='true']:active {
          cursor: grabbing;
        }
        .ticket-card:hover .drag-handle {
          opacity: 0.7;
          color: #94a3b8;
        }
        .ticket-card.is-dragging .drag-handle {
          opacity: 0;
        }
        .ticket-card.is-dragging {
          opacity: 0.35;
          transform: scale(0.97) rotate(-1deg);
          filter: saturate(0.7);
          transition: opacity 0.18s ease, transform 0.18s ease, filter 0.18s ease;
        }
        .ticket-card.just-landed {
          animation: card-land 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .drop-pill {
          animation: drop-pill-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes drop-pill-in {
          0% { opacity: 0; transform: translateY(-4px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
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

            {/* Right Actions: Search + Avatars + Epic + GroupBy + Insights + Star + More */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                flexWrap: 'wrap',
                ml: { xs: 0, md: 'auto' },
              }}
            >
              {/* Board Search — moved here from the standalone search bar row,
                  so it sits inline right after the "Projects / Beyond Gravity · Board" text. */}
              <TextField
                placeholder='Search board...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size='small'
                sx={{
                  width: { xs: '100%', sm: 240 },
                  order: { xs: -1, md: 0 },
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
                    endAdornment: (
                      <InputAdornment position='end'>
                        {isSearchPending ? (
                          <CircularProgress size={14} thickness={5} sx={{ color: '#94a3b8' }} />
                        ) : search ? (
                          <Tooltip title='Clear search' arrow>
                            <IconButton
                              size='small'
                              onClick={() => setSearch('')}
                              sx={{
                                p: 0.25,
                                color: '#94a3b8',
                                '&:hover': { color: '#475569', background: '#f1f5f9' },
                              }}
                            >
                              <BackspaceIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Team Avatars */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', mr: 0.5 }}>
                  {topAssignees.map((a, i) => (
                    <Tooltip
                      key={a.name}
                      title={
                        search.toLowerCase() === a.name.toLowerCase()
                          ? `Clear filter`
                          : `Filter by ${a.name}`
                      }
                      arrow
                    >
                      <Avatar
                        onClick={() =>
                          setSearch((prev) =>
                            prev.toLowerCase() === a.name.toLowerCase() ? '' : a.name,
                          )
                        }
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
                          outline:
                            search.toLowerCase() === a.name.toLowerCase()
                              ? '2px solid #4f46e5'
                              : 'none',
                          outlineOffset: '1px',
                          transition: 'outline-color 0.15s ease, transform 0.15s ease',
                          '&:hover': { transform: 'translateY(-1px)' },
                        }}
                      >
                        {getInitials(a.name)}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Box>
                {remainingAssigneesCount > 0 && (
                  <Tooltip
                    title={`View ${remainingAssigneesCount} more member${
                      remainingAssigneesCount === 1 ? '' : 's'
                    }`}
                    arrow
                  >
                    <Box
                      onClick={(e) => setAssigneesAnchor(e.currentTarget)}
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
                        color: '#475569',
                        ml: '-8px',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'background 0.15s ease, transform 0.15s ease',
                        '&:hover': { background: '#e2e8f0', transform: 'translateY(-1px)' },
                      }}
                    >
                      +{remainingAssigneesCount}
                    </Box>
                  </Tooltip>
                )}
                <Popover
                  open={Boolean(assigneesAnchor)}
                  anchorEl={assigneesAnchor}
                  onClose={() => setAssigneesAnchor(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 0.75,
                        width: 280,
                        maxHeight: 360,
                        borderRadius: 2,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      px: 1.5,
                      py: 1.25,
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#fafbfc',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a' }}>
                      Active Members
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>
                      {allAssignees.length} total
                    </Typography>
                  </Box>
                  <Box sx={{ maxHeight: 280, overflowY: 'auto', py: 0.5 }}>
                    {allAssignees.map((a) => {
                      const isActive = search.toLowerCase() === a.name.toLowerCase();
                      return (
                        <Box
                          key={a.name}
                          onClick={() => {
                            setSearch((prev) =>
                              prev.toLowerCase() === a.name.toLowerCase() ? '' : a.name,
                            );
                            setAssigneesAnchor(null);
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.25,
                            px: 1.5,
                            py: 0.85,
                            cursor: 'pointer',
                            background: isActive ? 'rgba(79,70,229,0.08)' : 'transparent',
                            transition: 'background 0.12s ease',
                            '&:hover': {
                              background: isActive ? 'rgba(79,70,229,0.12)' : '#f8fafc',
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              background: a.gradient,
                              border: '1.5px solid #fff',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                            }}
                          >
                            {getInitials(a.name)}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#0f172a',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {a.name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.62rem', color: '#64748b' }}>
                              {a.count} ticket{a.count === 1 ? '' : 's'}
                            </Typography>
                          </Box>
                          {isActive && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: '#4f46e5',
                              }}
                            />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Popover>
              </Box>

              {/* Status Filter */}
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
                      background:
                        statusFilter === 'All'
                          ? '#6366f1'
                          : (BOARD_COLUMNS.find((c) => c.key === statusFilter)?.accent ??
                            '#6366f1'),
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
                {statusFilter === 'All' ? 'All Status' : statusFilter}
              </Button>
              <Menu
                anchorEl={epicAnchor}
                open={Boolean(epicAnchor)}
                onClose={() => setEpicAnchor(null)}
                PaperProps={{
                  sx: {
                    mt: 0.5,
                    minWidth: 180,
                    borderRadius: 2,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <MenuItem
                  selected={statusFilter === 'All'}
                  onClick={() => {
                    setStatusFilter('All');
                    setEpicAnchor(null);
                  }}
                  sx={{ fontSize: '0.78rem', py: 0.75 }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#6366f1',
                      mr: 1,
                    }}
                  />
                  All Status
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                {BOARD_COLUMNS.map((col) => (
                  <MenuItem
                    key={col.key}
                    selected={statusFilter === col.key}
                    onClick={() => {
                      setStatusFilter(col.key);
                      setEpicAnchor(null);
                    }}
                    sx={{ fontSize: '0.78rem', py: 0.75 }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: col.accent,
                        mr: 1,
                      }}
                    />
                    {col.label.toLowerCase().replace(/(^|\s)\S/g, (s) => s.toUpperCase())}
                  </MenuItem>
                ))}
              </Menu>

              {/* Sprint Progress */}
              <Tooltip title='Sprint progress' arrow>
                <Button
                  size='small'
                  variant='outlined'
                  onClick={(e) => setProgressAnchor(e.currentTarget)}
                  startIcon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color:
                      sprintMetrics.percent >= sprintMetrics.expectedPercent
                        ? '#059669'
                        : '#dc2626',
                    borderColor:
                      sprintMetrics.percent >= sprintMetrics.expectedPercent
                        ? 'rgba(5,150,105,0.3)'
                        : 'rgba(220,38,38,0.3)',
                    background:
                      sprintMetrics.percent >= sprintMetrics.expectedPercent
                        ? 'rgba(5,150,105,0.06)'
                        : 'rgba(220,38,38,0.06)',
                    height: 32,
                    px: 1.5,
                    '&:hover': {
                      background:
                        sprintMetrics.percent >= sprintMetrics.expectedPercent
                          ? 'rgba(5,150,105,0.12)'
                          : 'rgba(220,38,38,0.12)',
                    },
                  }}
                >
                  {sprintMetrics.percent}% Done
                </Button>
              </Tooltip>
              <Popover
                open={Boolean(progressAnchor)}
                anchorEl={progressAnchor}
                onClose={() => setProgressAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 0.75,
                      width: 300,
                      borderRadius: 2,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    px: 1.75,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#fff',
                  }}
                >
                  <Typography sx={{ fontSize: '0.65rem', opacity: 0.85, fontWeight: 600 }}>
                    SPRINT 24 · BEYOND GRAVITY
                  </Typography>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, mt: 0.25 }}>
                    {sprintMetrics.percent}% complete
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', opacity: 0.9, mt: 0.25 }}>
                    {sprintMetrics.daysRemaining} day
                    {sprintMetrics.daysRemaining === 1 ? '' : 's'} remaining
                  </Typography>
                </Box>
                <Box sx={{ px: 1.75, py: 1.5 }}>
                  <Box sx={{ mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>
                      Progress
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>
                      {sprintMetrics.done}/{sprintMetrics.total} tickets
                    </Typography>
                  </Box>
                  <Box sx={{ position: 'relative', mb: 1.75 }}>
                    <LinearProgress
                      variant='determinate'
                      value={sprintMetrics.percent}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#f1f5f9',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                        },
                      }}
                    />
                    {/* Expected line marker */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -2,
                        bottom: -2,
                        left: `${sprintMetrics.expectedPercent}%`,
                        width: 2,
                        background: '#dc2626',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 1,
                      mb: 1.25,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        background: 'rgba(16,185,129,0.08)',
                        border: '1px solid rgba(16,185,129,0.2)',
                        textAlign: 'center',
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 14, color: '#059669' }} />
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#059669' }}>
                        {sprintMetrics.done}
                      </Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: '#047857' }}>Done</Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        background: 'rgba(59,130,246,0.08)',
                        border: '1px solid rgba(59,130,246,0.2)',
                        textAlign: 'center',
                      }}
                    >
                      <BoltIcon sx={{ fontSize: 14, color: '#2563eb' }} />
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#2563eb' }}>
                        {sprintMetrics.inProgress}
                      </Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: '#1d4ed8' }}>Active</Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        background:
                          sprintMetrics.blocked > 0
                            ? 'rgba(239,68,68,0.08)'
                            : 'rgba(100,116,139,0.06)',
                        border: '1px solid',
                        borderColor:
                          sprintMetrics.blocked > 0
                            ? 'rgba(239,68,68,0.2)'
                            : 'rgba(100,116,139,0.2)',
                        textAlign: 'center',
                      }}
                    >
                      <FlagIcon
                        sx={{
                          fontSize: 14,
                          color: sprintMetrics.blocked > 0 ? '#dc2626' : '#64748b',
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: sprintMetrics.blocked > 0 ? '#dc2626' : '#64748b',
                        }}
                      >
                        {sprintMetrics.blocked}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.6rem',
                          color: sprintMetrics.blocked > 0 ? '#b91c1c' : '#64748b',
                        }}
                      >
                        Blocked
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>
                      Story points
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a' }}>
                      {sprintMetrics.donePoints} / {sprintMetrics.totalPoints} pts
                    </Typography>
                  </Box>
                </Box>
              </Popover>

              {/* My Tickets */}
              <Tooltip
                title={
                  myTicketsAssignee
                    ? `Filtering by ${myTicketsAssignee} (click to change)`
                    : 'Filter to my tickets'
                }
                arrow
              >
                <Button
                  size='small'
                  variant={myTicketsAssignee ? 'contained' : 'outlined'}
                  onClick={(e) => setMyTicketsAnchor(e.currentTarget)}
                  startIcon={
                    myTicketsAssignee ? (
                      <Avatar
                        sx={{
                          width: 18,
                          height: 18,
                          fontSize: '0.55rem',
                          fontWeight: 700,
                          background:
                            TEAM_GRADIENTS[
                              Math.abs(
                                myTicketsAssignee
                                  .split('')
                                  .reduce((s, c) => s + c.charCodeAt(0), 0),
                              ) % TEAM_GRADIENTS.length
                            ],
                          border: '1.5px solid #fff',
                        }}
                      >
                        {getInitials(myTicketsAssignee)}
                      </Avatar>
                    ) : (
                      <PersonIcon sx={{ fontSize: 14 }} />
                    )
                  }
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: myTicketsAssignee ? '#fff' : '#475569',
                    borderColor: '#e2e8f0',
                    background: myTicketsAssignee ? '#4f46e5' : '#f8fafc',
                    height: 32,
                    px: 1.5,
                    boxShadow: myTicketsAssignee ? '0 2px 6px rgba(79,70,229,0.3)' : 'none',
                    '&:hover': {
                      background: myTicketsAssignee ? '#4338ca' : '#f1f5f9',
                      borderColor: myTicketsAssignee ? '#4338ca' : '#cbd5e1',
                    },
                  }}
                >
                  {myTicketsAssignee ? myTicketsAssignee.split(' ')[0] : 'My Tickets'}
                </Button>
              </Tooltip>
              <Menu
                anchorEl={myTicketsAnchor}
                open={Boolean(myTicketsAnchor)}
                onClose={() => setMyTicketsAnchor(null)}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 0.5,
                      minWidth: 220,
                      maxHeight: 320,
                      borderRadius: 2,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      border: '1px solid #e2e8f0',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderBottom: '1px solid #e2e8f0',
                    background: '#fafbfc',
                  }}
                >
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#0f172a' }}>
                    Show tickets for
                  </Typography>
                </Box>
                <MenuItem
                  selected={myTicketsAssignee === null}
                  onClick={() => {
                    setMyTicketsAssignee(null);
                    setMyTicketsAnchor(null);
                  }}
                  sx={{ fontSize: '0.78rem', py: 0.85 }}
                >
                  <PersonIcon sx={{ fontSize: 14, mr: 1, color: '#64748b' }} />
                  Everyone
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                {allAssignees.map((a) => (
                  <MenuItem
                    key={a.name}
                    selected={myTicketsAssignee === a.name}
                    onClick={() => {
                      setMyTicketsAssignee(a.name);
                      setMyTicketsAnchor(null);
                    }}
                    sx={{ fontSize: '0.78rem', py: 0.75 }}
                  >
                    <Avatar
                      sx={{
                        width: 22,
                        height: 22,
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        background: a.gradient,
                        mr: 1,
                      }}
                    >
                      {getInitials(a.name)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>{a.name}</Box>
                    <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', ml: 1 }}>
                      {a.count}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>

              {/* Sort */}
              <Tooltip title='Sort tickets within columns' arrow>
                <Button
                  size='small'
                  variant='outlined'
                  onClick={(e) => setSortAnchor(e.currentTarget)}
                  startIcon={<SortIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: sortBy === 'Default' ? '#475569' : '#4f46e5',
                    borderColor: sortBy === 'Default' ? '#e2e8f0' : 'rgba(79,70,229,0.3)',
                    background: sortBy === 'Default' ? '#f8fafc' : 'rgba(79,70,229,0.05)',
                    height: 32,
                    px: 1.5,
                    '&:hover': {
                      background: sortBy === 'Default' ? '#f1f5f9' : 'rgba(79,70,229,0.1)',
                    },
                  }}
                >
                  {sortBy === 'Default' ? 'Sort' : sortBy}
                </Button>
              </Tooltip>
              <Menu
                anchorEl={sortAnchor}
                open={Boolean(sortAnchor)}
                onClose={() => setSortAnchor(null)}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 0.5,
                      minWidth: 180,
                      borderRadius: 2,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    },
                  },
                }}
              >
                {(['Default', 'Story Points', 'Issue Type', 'Issue No'] as const).map((opt) => (
                  <MenuItem
                    key={opt}
                    selected={sortBy === opt}
                    onClick={() => {
                      setSortBy(opt);
                      setSortAnchor(null);
                    }}
                    sx={{ fontSize: '0.78rem', py: 0.75 }}
                  >
                    {opt}
                  </MenuItem>
                ))}
              </Menu>

              {/* Density */}
              <Tooltip
                title={
                  density === 'Comfortable'
                    ? 'Switch to compact view'
                    : 'Switch to comfortable view'
                }
                arrow
              >
                <IconButton
                  size='small'
                  onClick={() =>
                    setDensity((d) => (d === 'Comfortable' ? 'Compact' : 'Comfortable'))
                  }
                  sx={{
                    color: density === 'Compact' ? '#4f46e5' : '#94a3b8',
                    background: density === 'Compact' ? 'rgba(79,70,229,0.08)' : '#f1f5f9',
                    border: '1px solid',
                    borderColor: density === 'Compact' ? 'rgba(79,70,229,0.3)' : '#e2e8f0',
                    borderRadius: '8px',
                    p: 0.75,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      background: density === 'Compact' ? 'rgba(79,70,229,0.12)' : '#e2e8f0',
                    },
                  }}
                >
                  {density === 'Comfortable' ? (
                    <ViewAgendaIcon sx={{ fontSize: 16 }} />
                  ) : (
                    <ViewStreamIcon sx={{ fontSize: 16 }} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
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
                const isDragOver = dragOverColumn === col.key;
                const isDropFlash = dropIndicatorColumn === col.key;
                return (
                  <Box
                    key={col.key}
                    sx={{
                      borderRadius: 2,
                      border: '1.5px solid',
                      borderColor: isDragOver ? col.accent : 'divider',
                      minHeight: 320,
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      transition:
                        'border-color 0.2s ease, box-shadow 0.25s ease, transform 0.25s ease, background 0.2s ease',
                      background: isDragOver ? col.accentBg : '#fff',
                      boxShadow: isDragOver
                        ? `0 0 0 3px ${col.accent}22, 0 12px 32px ${col.accent}1f`
                        : '0 1px 2px rgba(0,0,0,0.04)',
                      transform: isDragOver ? 'translateY(-2px)' : 'translateY(0)',
                      animation: isDropFlash
                        ? `drop-flash-${col.key.replace(/\s/g, '')} 0.6s ease-out`
                        : 'none',
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

                    {/* Column Body (Cards) — drop zone */}
                    <Box
                      onDragOver={(e) => handleColumnDragOver(e, col.key)}
                      onDragLeave={(e) => handleColumnDragLeave(e, col.key)}
                      onDrop={(e) => handleColumnDrop(e, col.key)}
                      sx={{
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: density === 'Compact' ? 0.5 : 1,
                        flex: 1,
                        minHeight: 240,
                        position: 'relative',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      {/* Drop-zone pill shown while hovering */}
                      {isDragOver && (
                        <Box
                          className='drop-pill'
                          sx={{
                            mx: 0.5,
                            mb: 0.5,
                            py: 1.25,
                            borderRadius: 1.5,
                            border: `1.5px dashed ${col.accent}`,
                            background: `${col.accent}10`,
                            color: col.accent,
                            textAlign: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.75,
                          }}
                        >
                          <Box
                            component='span'
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              background: col.accent,
                              color: '#fff',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              boxShadow: `0 2px 6px ${col.accent}55`,
                            }}
                          >
                            ↓
                          </Box>
                          Drop to move here
                        </Box>
                      )}

                      {colTickets.length === 0 && !isDragOver ? (
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
                      ) : null}

                      {colTickets.map((ticket) => {
                        const cat = getCategoryPalette(ticket.issueType);
                        const assigneeGradient =
                          TEAM_GRADIENTS[
                            Math.abs(
                              ticket.assignee.split('').reduce((s, c) => s + c.charCodeAt(0), 0),
                            ) % TEAM_GRADIENTS.length
                          ];
                        const isDragging = draggedTicketId === ticket.id;
                        const isLanded = recentlyMoved.has(ticket.id);
                        return (
                          <Box
                            key={ticket.id}
                            className={`ticket-card${
                              isDragging ? ' is-dragging' : ''
                            }${isLanded ? ' just-landed' : ''}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, ticket.id)}
                            onDragEnd={handleDragEnd}
                            onClick={() => {
                              if (draggedTicketId !== null) return;
                              navigate(
                                AdminPath.TICKET_DETAIL.replace(
                                  ':id',
                                  encodeURIComponent(ticket.issueNo),
                                ),
                              );
                            }}
                            sx={{
                              p: density === 'Compact' ? 0.85 : 1.25,
                              background: '#fff',
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1.5,
                              cursor: draggedTicketId === null ? 'grab' : 'inherit',
                              position: 'relative',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                              transition:
                                'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
                              '&:hover': {
                                boxShadow:
                                  '0 6px 18px rgba(15,23,42,0.08), 0 1px 3px rgba(0,0,0,0.05)',
                                transform: 'translateY(-1px)',
                                borderColor: cat.border,
                              },
                              '&:active': {
                                cursor: 'grabbing',
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
                              },
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

                              <Tooltip
                                title={
                                  search.toLowerCase() === ticket.assignee.toLowerCase()
                                    ? `Clear filter`
                                    : `Filter by ${ticket.assignee}`
                                }
                                arrow
                              >
                                <Avatar
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSearch((prev) =>
                                      prev.toLowerCase() === ticket.assignee.toLowerCase()
                                        ? ''
                                        : ticket.assignee,
                                    );
                                  }}
                                  sx={{
                                    width: 22,
                                    height: 22,
                                    fontSize: '0.6rem',
                                    fontWeight: 700,
                                    background: assigneeGradient,
                                    border: '1.5px solid #fff',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                                    cursor: 'pointer',
                                    outline:
                                      search.toLowerCase() === ticket.assignee.toLowerCase()
                                        ? '2px solid #4f46e5'
                                        : 'none',
                                    outlineOffset: '1px',
                                    transition: 'outline-color 0.15s ease, transform 0.15s ease',
                                    '&:hover': { transform: 'scale(1.08)' },
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

                            {/* Drag handle (only visible on hover) */}
                            <Box
                              className='drag-handle'
                              sx={{
                                position: 'absolute',
                                top: 6,
                                left: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 18,
                                height: 18,
                                borderRadius: 0.75,
                                color: '#cbd5e1',
                                opacity: 0,
                                transition:
                                  'opacity 0.18s ease, color 0.18s ease, background 0.18s ease',
                                pointerEvents: 'none',
                              }}
                            >
                              <DragIndicatorIcon sx={{ fontSize: 14 }} />
                            </Box>
                          </Box>
                        );
                      })}
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
              <Box
                component='span'
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 0.75,
                  py: 0.15,
                  borderRadius: 0.75,
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  color: '#4f46e5',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}
              >
                <Box
                  component='span'
                  sx={{
                    display: 'inline-block',
                    fontSize: '0.7rem',
                    lineHeight: 1,
                    animation: 'grab-hint 2.6s ease-in-out infinite',
                    '@keyframes grab-hint': {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-1px)' },
                    },
                  }}
                >
                  ⠿
                </Box>
                Drag cards between columns · Click to open
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SprintStatusMatrixPage;
