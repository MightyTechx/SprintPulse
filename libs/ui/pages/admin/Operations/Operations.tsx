import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  PageHeader,
  DataTable,
  TextField,
  Tabs,
  Tab,
  Chip,
  Card,
  Column,
} from '@sprintpulse/component';
import { InputAdornment, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EditNoteIcon from '@mui/icons-material/EditNote';
import TabPanel from '@sprintpulse/component/TabPanel';
import { useStyles } from './styles';
import { constants } from '@sprintpulse/utils';
import { Ticket, TICKET_STATUS_CONFIG } from '../Dashboard/types/sprintData.types';
import { MOCK_TICKETS } from '../Dashboard/utils/dashboard.utils';

const Operations = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { AdminPath } = constants;

  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');

  // Mock ticket data (mirrors Dashboard's Ticket Overview)
  const permitData: Ticket[] = MOCK_TICKETS;

  // Table columns matching the Dashboard's Ticket Overview layout
  const columns: Column<Ticket>[] = [
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
    {
      id: 'team',
      label: 'Team',
      minWidth: 110,
      align: 'center',
      sortable: true,
    },
    {
      id: 'assignee',
      label: 'Assignee',
      minWidth: 140,
      align: 'center',
      sortable: true,
    },
    {
      id: 'issueType',
      label: 'Issue Type',
      minWidth: 100,
      align: 'center',
      sortable: true,
      format: (value: unknown) => {
        const v = String(value);
        const palette: Record<string, { bg: string; fg: string; border: string }> = {
          Story: { bg: 'rgba(99,102,241,0.12)', fg: '#4f46e5', border: 'rgba(99,102,241,0.3)' },
          Task: { bg: 'rgba(6,182,212,0.12)', fg: '#0891b2', border: 'rgba(6,182,212,0.3)' },
          Bug: { bg: 'rgba(239,68,68,0.12)', fg: '#ef4444', border: 'rgba(239,68,68,0.3)' },
          Epic: { bg: 'rgba(139,92,246,0.12)', fg: '#7c3aed', border: 'rgba(139,92,246,0.3)' },
          Spike: { bg: 'rgba(245,158,11,0.12)', fg: '#d97706', border: 'rgba(245,158,11,0.3)' },
        };
        const p = palette[v] ?? palette.Task;
        return (
          <Chip
            size='small'
            label={v}
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
      minWidth: 120,
      align: 'center',
      sortable: true,
      format: (value: unknown) => (
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            fontFamily: 'monospace',
            color: '#4f46e5',
          }}
        >
          {String(value)}
        </Typography>
      ),
    },
    {
      id: 'summary',
      label: 'Summary',
      minWidth: 220,
      align: 'left',
      sortable: true,
      format: (value: unknown) => (
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
          title={String(value)}
        >
          {String(value)}
        </Typography>
      ),
    },
    {
      id: 'timeLoggingId',
      label: 'Time Logging ID',
      minWidth: 130,
      align: 'center',
      sortable: true,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 130,
      align: 'center',
      sortable: true,
      format: (value: unknown) => {
        const v = String(value) as keyof typeof TICKET_STATUS_CONFIG;
        const cfg = TICKET_STATUS_CONFIG[v];
        if (!cfg) return <Typography>{String(value)}</Typography>;
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
      sortable: true,
      format: (value: unknown) => (
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>{String(value)}</Typography>
      ),
    },
    {
      id: 'workStartDate',
      label: 'Actual Effort',
      minWidth: 110,
      align: 'center',
      sortable: true,
      format: (_v, row) => {
        const ticket = row as Ticket;
        const effort = ticket.storyPoints || 0;
        return (
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>
            {effort === 13
              ? '2d · 4h'
              : effort >= 8
                ? '1d · 3h'
                : effort >= 5
                  ? '1d · 1h'
                  : effort === 3
                    ? '6h'
                    : effort === 2
                      ? '4h'
                      : effort === 1
                        ? '2h'
                        : '—'}
          </Typography>
        );
      },
    },
    {
      id: 'fixVersion',
      label: 'Fix Version',
      minWidth: 110,
      align: 'center',
      sortable: true,
    },
    {
      id: 'carryForward',
      label: 'Carry Forward',
      minWidth: 120,
      align: 'center',
      sortable: true,
      format: (_v, row) => {
        const carry = (row as Ticket).carryForward;
        if (!carry) {
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
            {carry}
          </Typography>
        );
      },
    },
    {
      id: 'workStartDate',
      label: 'Work Start Date',
      minWidth: 130,
      align: 'center',
      sortable: true,
    },
    {
      id: 'workEndDate',
      label: 'Work End Date',
      minWidth: 130,
      align: 'center',
      sortable: true,
    },
  ];

  // Map of tab index → status filter
  const statusFilters: Record<number, string | null> = {
    0: null,
    1: 'In Progress',
    2: 'In Review',
    3: 'In Test',
    4: 'Done',
  };

  // Filter rows based on active tab + search query
  const filteredData = permitData.filter((t) => {
    const statusFilter = statusFilters[tabValue];
    if (statusFilter && t.status !== statusFilter) {
      return false;
    }
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      return (
        t.team.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q) ||
        t.issueType.toLowerCase().includes(q) ||
        t.issueNo.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.timeLoggingId.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q) ||
        t.fixVersion.toLowerCase().includes(q) ||
        (t.carryForward || '').toLowerCase().includes(q) ||
        t.workStartDate.toLowerCase().includes(q) ||
        t.workEndDate.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Mock data for cards
  const statCards = [
    {
      label: 'All Tickets',
      value: permitData.length,
      Icon: EngineeringIcon,
      cls: classes.statCard0,
      sub: 'All Tickets',
      color: '#4f46e5',
      tabIndex: 0,
    },
    {
      label: 'In Progress',
      value: permitData.filter((d) => d.status === 'In Progress').length,
      Icon: BuildIcon,
      cls: classes.statCard1,
      sub: 'In Progress',
      color: '#3b82f6',
      tabIndex: 1,
    },
    {
      label: 'In Review',
      value: permitData.filter((d) => d.status === 'In Review').length,
      Icon: AssignmentIcon,
      cls: classes.statCard2,
      sub: 'In Review',
      color: '#8b5cf6',
      tabIndex: 2,
    },
    {
      label: 'In Test',
      value: permitData.filter((d) => d.status === 'In Test').length,
      Icon: PendingActionsIcon,
      cls: classes.statCard3,
      sub: 'In Test',
      color: '#f59e0b',
      tabIndex: 3,
    },
    {
      label: 'Done',
      value: permitData.filter((d) => d.status === 'Done').length,
      Icon: EditNoteIcon,
      cls: classes.statCard4,
      sub: 'Done',
      color: '#10b981',
      tabIndex: 4,
    },
  ];

  const handleRowClick = (row: Ticket) => {
    navigate(AdminPath.TICKET_DETAIL.replace(':id', encodeURIComponent(row.issueNo)));
  };

  return (
    <Box className={classes.container}>
      <PageHeader
        title='Operations Management'
        description='Manage maintenance and permit to work requests'
        icon={EngineeringIcon}
        variant='admin'
      />

      {/* ── Action Bar (Create Operations + Badge) ── */}
      <Box className={classes.actionBar}>
        {/* Status Badge */}
        <Chip
          label={`${permitData.filter((d) => d.status === 'In Progress').length} In Progress`}
          size='small'
          sx={{
            background: 'rgba(100,116,139,0.12)',
            border: '1px solid rgba(100,116,139,0.3)',
            color: '#94a3b8',
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 28,
            cursor: 'pointer',
            '&:hover': {
              background: 'rgba(100,116,139,0.18)',
            },
            '@media (max-width:600px)': {
              width: '48%',
              maxWidth: 'none',
              justifyContent: 'flex-start',
              '& .MuiChip-label': { flex: 1 },
            },
          }}
          onClick={() => setTabValue(1)}
          icon={<PendingActionsIcon sx={{ fontSize: '16px !important' }} />}
        />
        {/* Create Operations Button */}
        <Box
          onClick={() => navigate(AdminPath.CREATE_OPERATIONS)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            px: 1.5,
            py: 0.625,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
            boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            whiteSpace: 'nowrap',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 16px rgba(99,102,241,0.45)',
            },
            '&:active': { transform: 'translateY(0)' },
            '@media (max-width:600px)': {
              width: '48%',
            },
          }}
        >
          <AddIcon sx={{ fontSize: 16, color: '#fff' }} />
          <Chip
            label='Create Operations'
            size='small'
            sx={{
              background: 'transparent',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 28,
              '&:hover': {
                background: 'transparent',
              },
            }}
          />
        </Box>
      </Box>

      {/* ── Stat Cards ── */}
      <Box className={classes.statsGrid}>
        {statCards.map(({ label, value, Icon, cls, sub, color, tabIndex }, idx) => {
          const isActive = tabValue === tabIndex;
          return (
            <Card
              key={label}
              cardVariant='getstatus'
              value={value}
              label={label}
              sub={sub}
              icon={Icon}
              color={color}
              colorIndex={idx}
              className={cls}
              onClick={() => {
                setTabValue(tabIndex);
                setTableSearch('');
              }}
              sx={{
                outline: isActive ? `2px solid ${color}` : 'none',
                outlineOffset: 2,
                transform: isActive ? 'translateY(-6px)' : undefined,
                boxShadow: isActive ? `0 16px 40px ${color}30, 0 4px 16px ${color}18` : undefined,
              }}
            />
          );
        })}
      </Box>

      {/* ── Tabs + Search ── */}
      <Box className={classes.tabsBox}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => {
            setTabValue(v);
            setTableSearch('');
          }}
          variant='scrollable'
          scrollButtons='auto'
          allowScrollButtonsMobile
          sx={{ flex: 1 }}
        >
          <Tab icon={<EngineeringIcon />} iconPosition='start' label='All Tickets' />
          <Tab icon={<BuildIcon />} iconPosition='start' label='In Progress' />
          <Tab icon={<AssignmentIcon />} iconPosition='start' label='In Review' />
          <Tab icon={<PendingActionsIcon />} iconPosition='start' label='In Test' />
          <Tab icon={<EditNoteIcon />} iconPosition='start' label='Done' />
        </Tabs>
        <TextField
          placeholder='Search tickets...'
          value={tableSearch}
          onChange={(e) => setTableSearch(e.target.value)}
          className={classes.tabsSearchField}
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
      </Box>

      {/* ── Tab panels with DataTable ── */}
      {[0, 1, 2, 3, 4].map((idx) => (
        <TabPanel key={idx} value={tabValue} index={idx}>
          <Box className={classes.tableContainer}>
            <DataTable
              columns={columns}
              data={filteredData}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
              onRowClick={handleRowClick}
            />
          </Box>
        </TabPanel>
      ))}
    </Box>
  );
};

export default Operations;
