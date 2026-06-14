import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  Column,
  DataTable,
  Link,
} from '@infygen/component';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { constants } from '@infygen/utils';
import { useTicketDetailStyles } from '../styles/TicketDetailPage.styles';
import { TICKET_STATUS_CONFIG, Ticket, TicketStatus } from '../types/turbineData.types';
import { MOCK_TICKETS } from '../utils/dashboard.utils';
import { getActualEffort } from '../utils/effortCalculations';
import { useAdminKeyframes } from '@infygen/hooks';

// ─── Helper functions ──────────────────────────────────────────────────────────

function getStatusIcon(status: string, size = { fontSize: 16 }) {
  switch (status) {
    case 'To Do':
      return <ArrowBackIcon sx={size} />;
    case 'In Progress':
      return <AssignmentIcon sx={{ ...size, color: '#3b82f6' }} />;
    case 'In Review':
      return <AssignmentIcon sx={{ ...size, color: '#8b5cf6' }} />;
    case 'Blocked':
      return <AssignmentIcon sx={{ ...size, color: '#ef4444' }} />;
    case 'Testing':
      return <AssignmentIcon sx={{ ...size, color: '#f59e0b' }} />;
    case 'Done':
      return <AssignmentIcon sx={{ ...size, color: '#10b981' }} />;
    default:
      return <AssignmentIcon sx={size} />;
  }
}

// ─── Daily Status helpers ──────────────────────────────────────────────────────

interface DailyStatusRow {
  id: string;
  date: string; // YYYY-MM-DD
  status: TicketStatus;
  comment: string;
  hours: number;
}

const DAILY_STATUS_PROGRESSION: TicketStatus[] = [
  'In Progress',
  'In Progress',
  'In Review',
  'In Review',
  'In Test',
  'In Test',
  'Done',
];

const DAILY_COMMENTS: Record<TicketStatus, string[]> = {
  'To Do': ['Picked up from backlog, planning implementation', 'Reviewed requirements with team'],
  'In Progress': [
    'Started implementation of core logic',
    'Continued feature development',
    'Resolved blockers, integrating components',
    'Code review feedback addressed',
  ],
  'In Review': [
    'PR opened for peer review',
    'Addressed review comments',
    'Awaiting reviewer approval',
  ],
  Blocked: ['Waiting on dependency from another team', 'Unblocked and resumed work'],
  'In Test': [
    'Wrote unit tests, coverage at 85%',
    'QA validating in staging environment',
    'Fixed edge-case bugs found in testing',
  ],
  Done: ['Merged to main branch, deployed to staging', 'Released to production, monitoring'],
};

function buildDailyStatus(ticket: Ticket): DailyStatusRow[] {
  if (!ticket.workStartDate || !ticket.workEndDate) return [];
  const start = new Date(ticket.workStartDate);
  const end = new Date(ticket.workEndDate);
  if (end < start) return [];

  const rows: DailyStatusRow[] = [];
  const dayMs = 86_400_000;
  let idx = 0;

  for (let t = start.getTime(); t <= end.getTime(); t += dayMs) {
    const d = new Date(t);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue; // skip weekends

    const status =
      idx < DAILY_STATUS_PROGRESSION.length ? DAILY_STATUS_PROGRESSION[idx] : ticket.status;
    const comments = DAILY_COMMENTS[status] ?? ['Continued progress on ticket'];
    const comment = comments[idx % comments.length];
    const hours = status === 'Done' ? 1 : status === 'In Test' ? 3 : status === 'In Review' ? 4 : 6;

    rows.push({
      id: `${ticket.issueNo}-${d.toISOString().slice(0, 10)}`,
      date: d.toISOString().slice(0, 10),
      status,
      comment,
      hours,
    });
    idx += 1;
  }

  return rows;
}

// ─── Components ────────────────────────────────────────────────────────────────

interface FieldCardProps {
  title: string;
  icon?: React.ReactElement;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}

const FieldCard: React.FC<FieldCardProps> = ({ title, icon, subtitle, children }) => (
  <Box
    sx={{
      borderRadius: '10px',
      border: '1px solid #e8eaf0',
      background: '#ffffff',
      overflow: 'hidden',
      marginBottom: 2.5,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(99,102,241,0.06)',
      transition: 'all 0.2s ease',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: '16px 25px',
        borderBottom: '1px solid #e8eaf0',
        background: 'linear-gradient(135deg, rgba(79,70,229,0.03) 0%, rgba(124,58,237,0.03) 100%)',
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        }}
      >
        {icon ?? <AssignmentIcon sx={{ fontSize: 22, color: '#fff' }} />}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '1rem',
            color: 'text.primary',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 500, mt: 0.25 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
    <Box sx={{ p: '16px 25px' }}>{children}</Box>
  </Box>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { AdminPath } = constants;
  const { classes } = useTicketDetailStyles();
  const keyframes = useAdminKeyframes();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const decodedId = decodeURIComponent(id ?? '');
    const found = MOCK_TICKETS.find((t) => t.issueNo === decodedId);
    setTicket(found || null);
    setLoading(false);
  }, [id]);

  const dailyStatus = useMemo(() => (ticket ? buildDailyStatus(ticket) : []), [ticket]);

  if (loading) {
    return (
      <>
        {keyframes}
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AssignmentIcon sx={{ fontSize: 32, color: '#fff' }} />
            </Box>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700 }}>Loading ticket...</Typography>
          </Box>
        </Box>
      </>
    );
  }

  if (!ticket) {
    return (
      <>
        {keyframes}
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='h6' color='error' sx={{ mb: 1 }}>
            Ticket not found
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 3 }}>
            No ticket matches the issue number <strong>{id}</strong>.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
      </>
    );
  }

  const statusCfg = TICKET_STATUS_CONFIG[ticket.status];

  // Stats cards data
  const statsData = [
    {
      icon: getStatusIcon(ticket.status, { fontSize: 20 }),
      value: statusCfg.label,
      label: 'Status',
      bgColor: statusCfg.bgColor,
      borderColor: statusCfg.borderColor,
      valueColor: statusCfg.color,
    },
    {
      icon: <AssignmentIcon sx={{ color: '#f59e0b', fontSize: 20 }} />,
      value: ticket.issueType,
      label: 'Issue Type',
      bgColor: 'rgba(245,158,11,0.12)',
      borderColor: 'rgba(245,158,11,0.3)',
      valueColor: '#d97706',
    },
    {
      icon: <AssignmentIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />,
      value: ticket.storyPoints,
      label: 'Story Points',
      bgColor: 'rgba(139,92,246,0.12)',
      borderColor: 'rgba(139,92,246,0.3)',
      valueColor: '#7c3aed',
    },
    {
      icon: <AssignmentIcon sx={{ color: '#10b981', fontSize: 20 }} />,
      value: getActualEffort(ticket.storyPoints),
      label: 'Actual Effort',
      bgColor: 'rgba(16,185,129,0.12)',
      borderColor: 'rgba(16,185,129,0.3)',
      valueColor: '#10b981',
    },
  ] as const;

  // Grid layout helpers
  const gridFields = {
    display: 'grid',
    gap: 1.5,
    gridTemplateColumns: 'repeat(4, 1fr)',
    [`@media (max-width: 1200px)`]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [`@media (max-width: 768px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  };

  // Daily Status table columns
  const dailyStatusColumns: Column<DailyStatusRow>[] = [
    {
      id: 'date',
      label: 'Date',
      minWidth: 130,
      align: 'center',
      format: (v) => (
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'text.primary' }}>
          {new Date(String(v)).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 130,
      align: 'center',
      format: (v) => {
        const status = v as TicketStatus;
        const cfg = TICKET_STATUS_CONFIG[status];
        if (!cfg) {
          return <Typography sx={{ fontSize: '0.78rem' }}>{String(v)}</Typography>;
        }
        return (
          <Chip
            size='small'
            label={cfg.label}
            sx={{
              background: cfg.bgColor,
              border: `1px solid ${cfg.borderColor}`,
              color: cfg.color,
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 24,
            }}
          />
        );
      },
    },
    {
      id: 'comment',
      label: 'Comment',
      minWidth: 280,
      align: 'left',
      format: (v) => (
        <Typography
          sx={{
            fontSize: '0.78rem',
            color: 'text.primary',
            fontWeight: 500,
            lineHeight: 1.4,
            whiteSpace: 'normal',
          }}
        >
          {String(v)}
        </Typography>
      ),
    },
    {
      id: 'hours',
      label: 'Hours',
      minWidth: 90,
      align: 'center',
      format: (v) => (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 56,
            px: 1.25,
            py: 0.4,
            borderRadius: 6,
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.22)',
            color: '#4f46e5',
            fontWeight: 700,
            fontSize: '0.75rem',
          }}
        >
          {`${v} h`}
        </Box>
      ),
    },
  ];

  return (
    <>
      {keyframes}
      <Box className={classes.container}>
        {/* ── Hero Header ── */}
        <Box className={classes.heroHeader}>
          <Box className={classes.heroLeft}>
            <Box
              className={classes.heroIconWrap}
              sx={{
                background: `linear-gradient(135deg, ${statusCfg.color}, ${statusCfg.color}cc)`,
              }}
            >
              <AssignmentIcon sx={{ fontSize: 24, color: '#fff' }} />
            </Box>
            <Box>
              <Typography className={classes.heroTitleText}>
                {ticket.issueNo} · {ticket.issueType}
              </Typography>
              <Typography className={classes.heroSubtitle}>{ticket.summary}</Typography>
              {/* Status Chip - Mobile Only */}
              <Box
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  mt: 0.5,
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    background: statusCfg.bgColor,
                    border: `1px solid ${statusCfg.borderColor}`,
                    color: statusCfg.color,
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    px: 1,
                    py: 0.25,
                    borderRadius: 12,
                  }}
                >
                  {statusCfg.label}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className={classes.heroCenter}>
            <Typography className={classes.heroCenterTitle}>TICKET DETAIL</Typography>
            <Box className={classes.heroCenterBadge}>
              <Box className={classes.heroCenterDot} />
              <Typography className={classes.heroCenterLive}>{ticket.status}</Typography>
            </Box>
          </Box>

          <Box className={classes.heroRight}>
            {/* Status Chip - Desktop Only */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  background: statusCfg.bgColor,
                  border: `1px solid ${statusCfg.borderColor}`,
                  color: statusCfg.color,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 16,
                  height: '28px',
                }}
              >
                {statusCfg.label}
              </Box>
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

        {/* ─── Stat Cards Row ── */}
        <Box className={classes.statsRowContainer}>
          <Box className={classes.statsRow}>
            {statsData.map((stat, idx) => (
              <Paper key={idx} className={classes.statCard} elevation={0}>
                <Box
                  className={classes.statCardIconWrap}
                  sx={{ background: stat.bgColor, border: `1px solid ${stat.borderColor}` }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography
                    className={classes.statCardValue}
                    sx={stat.valueColor ? { color: stat.valueColor } : {}}
                  >
                    {stat.value}
                  </Typography>
                  <Typography className={classes.statCardLabel}>{stat.label}</Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* ─── Basic Information ── */}
        <FieldCard title='Basic Information'>
          <Box sx={gridFields}>
            <Box>
              <Typography
                sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mb: 0.5 }}
              >
                S. No
              </Typography>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>{ticket.id}</Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mb: 0.5 }}
              >
                Team
              </Typography>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>{ticket.team}</Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mb: 0.5 }}
              >
                Assignee
              </Typography>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                {ticket.assignee}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mb: 0.5 }}
              >
                Time Logging ID
              </Typography>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                {ticket.timeLoggingId}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mb: 0.5 }}
              >
                Fix Version
              </Typography>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                {ticket.fixVersion}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mb: 0.5 }}
              >
                Carry Forward
              </Typography>
              {ticket.carryForward ? (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 1.5,
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.28)',
                  }}
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#4f46e5',
                      boxShadow: '0 0 6px rgba(79,70,229,0.55)',
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#4f46e5', lineHeight: 1 }}
                  >
                    {`From ${ticket.carryForward}`}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  sx={{
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: '#94a3b8',
                    fontStyle: 'italic',
                  }}
                >
                  Not carried forward
                </Typography>
              )}
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mb: 0.5 }}
              >
                Carry Forward Reason
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: ticket.carryForward && ticket.carryForwardReason ? '#475569' : '#94a3b8',
                  fontStyle: ticket.carryForward && ticket.carryForwardReason ? 'normal' : 'italic',
                }}
              >
                {ticket.carryForward && ticket.carryForwardReason ? ticket.carryForwardReason : '—'}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mb: 0.5 }}
              >
                Summary
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: 'text.primary',
                  lineHeight: 1.5,
                }}
              >
                {ticket.summary}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mb: 0.5 }}
              >
                Ticket Link
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 1.5,
                  background: 'rgba(79,70,229,0.08)',
                  border: '1px solid rgba(79,70,229,0.25)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(79,70,229,0.14)',
                    borderColor: 'rgba(79,70,229,0.45)',
                  },
                }}
              >
                <LinkIcon sx={{ fontSize: 14, color: '#4f46e5' }} />
                <Link href={ticket.ticketLink} target='_blank' underline='none' color='primary'>
                  <Typography
                    sx={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#4f46e5',
                      letterSpacing: '0.01em',
                      cursor: 'pointer',
                    }}
                  >
                    Open Ticket
                  </Typography>
                </Link>
                <OpenInNewIcon sx={{ fontSize: 12, color: '#6366f1' }} />
              </Box>
            </Box>
          </Box>
        </FieldCard>

        {/* ─── Timeline Information ── */}
        <FieldCard title='Timeline Information'>
          <Box sx={gridFields}>
            <Box>
              <Typography
                sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mb: 0.5 }}
              >
                Work Start Date
              </Typography>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                {new Date(ticket.workStartDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mb: 0.5 }}
              >
                Work End Date
              </Typography>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                {new Date(ticket.workEndDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          </Box>
        </FieldCard>

        {/* ─── Daily Status ── */}
        <FieldCard
          title='Daily Status'
          icon={<EventNoteIcon sx={{ fontSize: 22, color: '#fff' }} />}
          subtitle={
            <>
              {dailyStatus.length} working day{dailyStatus.length === 1 ? '' : 's'} logged ·{' '}
              {dailyStatus.reduce((s, r) => s + r.hours, 0)} h total
            </>
          }
        >
          {dailyStatus.length > 0 ? (
            <DataTable
              columns={dailyStatusColumns}
              data={dailyStatus}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={7}
            />
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ color: 'text.secondary' }}>No daily status entries yet.</Typography>
            </Box>
          )}
        </FieldCard>
      </Box>
    </>
  );
};

export default TicketDetailPage;
