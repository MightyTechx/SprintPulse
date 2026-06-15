import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  PageHeader,
  Select,
  Link,
} from '@sprintpulse/component';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import InputAdornment from '@mui/material/InputAdornment';

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import GroupIcon from '@mui/icons-material/Group';
import CategoryIcon from '@mui/icons-material/Category';
import SubjectIcon from '@mui/icons-material/Subject';
import FlagIcon from '@mui/icons-material/Flag';
import StarIcon from '@mui/icons-material/Star';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { useStyles } from './styles';

// ── Constants (mirroring Dashboard ticket table headers) ────────────────────
const TEAMS = [
  'Team Alpha',
  'Team Beta',
  'Team Gamma',
  'Team Delta',
  'Team Epsilon',
  'Team Zeta',
  'Team Eta',
  'Team Theta',
  'Team Iota',
  'Team Kappa',
];

const ASSIGNEES = [
  'Aarav Sharma',
  'Priya Iyer',
  'Rahul Verma',
  'Sneha Kapoor',
  'Manoj Patel',
  'Karthik Reddy',
  'Neha Gupta',
  'Rohan Mehta',
  'Anika Joshi',
  'Vikram Singh',
  'Ishaan Khanna',
];

const REPORTERS = ASSIGNEES;

const ISSUE_TYPES = ['Story', 'Task', 'Bug', 'Epic', 'Spike'];

const TICKET_STATUSES = ['To Do', 'In Progress', 'In Review', 'Blocked', 'In Test', 'Done'];

const PRIORITIES = ['Lowest', 'Low', 'Medium', 'High', 'Critical'];

const FIX_VERSIONS = ['v1.0.0', 'v1.1.0', 'v1.2.0', 'v2.0.0', 'v2.1.0', 'Backlog'];

const CARRY_FORWARD_OPTIONS = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', '—'];

const LABEL_OPTIONS = [
  'frontend',
  'backend',
  'urgent',
  'regression',
  'feature',
  'bug',
  'documentation',
  'performance',
  'security',
  'ui',
  'ux',
  'api',
];

// Carry Forward Reason presets
const CARRY_FORWARD_REASONS = [
  'Blocked on upstream dependency',
  'Carried forward from previous sprint — capacity constraints',
  'Re-prioritised mid-sprint, deferred to next sprint',
  'Waiting on design / product sign-off',
  'Blocked on Safari 17 WebKit fix from upstream',
];

// ── Section metadata (color-coded left border + icon) ──────────────────────
const SECTION_META = [
  {
    icon: GroupIcon,
    label: 'Team & Assignment',
    color: '#4f46e5',
    gradient: 'linear-gradient(135deg, #4f46e5, #6366f1)',
  },
  {
    icon: CategoryIcon,
    label: 'Ticket Classification',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
  },
  {
    icon: SubjectIcon,
    label: 'Ticket Summary & Description',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #0d9488)',
  },
  {
    icon: FlagIcon,
    label: 'Status & Priority',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  },
  {
    icon: StarIcon,
    label: 'Estimation & Version',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
  },
  {
    icon: EventAvailableIcon,
    label: 'Work Schedule',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
  },
  {
    icon: PersonIcon,
    label: 'Reporter & Link',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
  },
  {
    icon: AttachFileIcon,
    label: 'Attachments',
    color: '#64748b',
    gradient: 'linear-gradient(135deg, #64748b, #94a3b8)',
  },
];

// ── Component ──────────────────────────────────────────────────────────────
const CreateTicket = () => {
  const { classes } = useStyles();

  // Form state
  const [team, setTeam] = useState<string>('');
  const [assignee, setAssignee] = useState<string>('');
  const [reporter, setReporter] = useState<string>('');
  const [issueType, setIssueType] = useState<string>('Task');
  const [issueNo, setIssueNo] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [timeLoggingId, setTimeLoggingId] = useState<string>('');
  const [status, setStatus] = useState<string>('To Do');
  const [priority, setPriority] = useState<string>('Medium');
  const [labels, setLabels] = useState<string[]>([]);
  const [storyPoints, setStoryPoints] = useState<string>('');
  const [fixVersion, setFixVersion] = useState<string>('');
  const [carryForward, setCarryForward] = useState<string>('');
  const [carryForwardReason, setCarryForwardReason] = useState<string>('');
  const [workStartDate, setWorkStartDate] = useState<Dayjs | null>(dayjs());
  const [workEndDate, setWorkEndDate] = useState<Dayjs | null>(dayjs().add(1, 'day'));
  const [createdDate, setCreatedDate] = useState<Dayjs | null>(dayjs());
  const [updatedDate, setUpdatedDate] = useState<Dayjs | null>(dayjs());
  const [ticketLink, setTicketLink] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Auto-generate a default issue no (project-prefix-####) when none entered.
  const suggestedIssueNo = useMemo(() => {
    const ts = Date.now().toString().slice(-4);
    return `SPR-${ts}`;
  }, []);

  const renderIconBadge = (index: number) => {
    const m = SECTION_META[index];
    const Icon = m.icon;
    return (
      <Box
        sx={{
          background: m.gradient,
          boxShadow: `0 4px 14px ${m.color}33`,
          width: 36,
          height: 36,
          borderRadius: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 18, color: '#fff' }} />
      </Box>
    );
  };

  const wrap = (index: number, children: React.ReactNode) => {
    const m = SECTION_META[index];
    return (
      <Box className={classes.sectionCard} sx={{ borderLeft: `4px solid ${m.color}` }}>
        <Box className={classes.sectionCardHeader}>
          {renderIconBadge(index)}
          <Typography className={classes.sectionCardTitle} sx={{ color: m.color }}>
            {m.label}
          </Typography>
        </Box>
        <Box className={classes.sectionCardBody}>{children}</Box>
      </Box>
    );
  };

  const handleSubmit = () => {
    const formData = {
      team,
      assignee,
      reporter,
      issueType,
      issueNo,
      summary,
      description,
      timeLoggingId,
      status,
      priority,
      labels,
      storyPoints,
      fixVersion,
      carryForward,
      carryForwardReason,
      workStartDate: workStartDate?.toISOString(),
      workEndDate: workEndDate?.toISOString(),
      createdDate: createdDate?.toISOString(),
      updatedDate: updatedDate?.toISOString(),
      ticketLink,
      attachedFiles: attachedFiles.map((f) => f.name),
    };
  };

  return (
    <Box className={classes.formContainer}>
      <PageHeader
        title='Create Ticket'
        description='Fill in the details below to create a new ticket'
        icon={ConfirmationNumberIcon}
        variant='admin'
      />

      {/* ── 1. Team & Assignment ──────────────────────────────────────── */}
      {wrap(
        0,
        <Box className={classes.formGrid}>
          <FormControl fullWidth size='small'>
            <Select value={team} label='Team *' onChange={(e) => setTeam(e.target.value)}>
              <MenuItem value=''>
                <em>Select team</em>
              </MenuItem>
              {TEAMS.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size='small'>
            <Select
              value={assignee}
              label='Assignee *'
              onChange={(e) => setAssignee(e.target.value)}
            >
              <MenuItem value=''>
                <em>Select assignee</em>
              </MenuItem>
              {ASSIGNEES.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size='small'>
            <Select value={reporter} label='Reporter' onChange={(e) => setReporter(e.target.value)}>
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {REPORTERS.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size='small'>
            <Select
              value={timeLoggingId}
              label='Time Logging ID'
              onChange={(e) => setTimeLoggingId(e.target.value)}
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {ASSIGNEES.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>,
      )}

      {/* ── 2. Ticket Classification ──────────────────────────────────── */}
      {wrap(
        1,
        <Box>
          <Box className={classes.formGrid}>
            <FormControl fullWidth size='small'>
              <Select
                value={issueType}
                label='Issue Type *'
                onChange={(e) => setIssueType(e.target.value)}
              >
                {ISSUE_TYPES.map((it) => (
                  <MenuItem key={it} value={it}>
                    {it}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              size='small'
              label='Issue No'
              value={issueNo}
              onChange={(e) => setIssueNo(e.target.value)}
              placeholder={suggestedIssueNo}
              inputProps={{ maxLength: 30 }}
            />
            <FormControl fullWidth size='small'>
              <Select
                value={carryForward}
                label='Carry Forward'
                onChange={(e) => {
                  setCarryForward(e.target.value);
                  if (!e.target.value) setCarryForwardReason('');
                }}
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                {CARRY_FORWARD_OPTIONS.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Carry Forward Reason (only when a sprint is selected) */}
          {carryForward && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth size='small'>
                <Select
                  value={
                    CARRY_FORWARD_REASONS.includes(carryForwardReason) ? carryForwardReason : ''
                  }
                  onChange={(e) => setCarryForwardReason(e.target.value as string)}
                >
                  <MenuItem value=''>
                    <em>Pick a preset reason…</em>
                  </MenuItem>
                  {CARRY_FORWARD_REASONS.map((r) => (
                    <MenuItem key={r} value={r} sx={{ fontSize: '0.82rem' }}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                size='small'
                label='Or write a custom reason'
                multiline
                rows={2}
                value={carryForwardReason}
                onChange={(e) => setCarryForwardReason(e.target.value)}
                placeholder={`Why is "${carryForward}" being carried forward?`}
                sx={{ mt: 1.5 }}
                inputProps={{ maxLength: 400 }}
              />
              <Typography
                sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.5, textAlign: 'right' }}
              >
                {carryForwardReason.length}/400
              </Typography>
            </Box>
          )}

          {issueType && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mr: 1 }}>
                Selected:
              </Typography>
              <Chip
                label={issueType}
                size='small'
                sx={{
                  background: 'rgba(99,102,241,0.1)',
                  color: '#4f46e5',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  border: '1px solid rgba(99,102,241,0.3)',
                }}
              />
              {issueNo && (
                <Chip
                  label={issueNo}
                  size='small'
                  sx={{
                    background: 'rgba(14,165,233,0.1)',
                    color: '#0ea5e9',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    border: '1px solid rgba(14,165,233,0.3)',
                    fontFamily: 'monospace',
                  }}
                />
              )}
            </Box>
          )}
        </Box>,
      )}

      {/* ── 3. Ticket Summary & Description ──────────────────────────── */}
      {wrap(
        2,
        <Box>
          <TextField
            fullWidth
            size='small'
            label='Summary *'
            multiline
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder='Provide a clear, concise description of the ticket...'
            inputProps={{ maxLength: 250 }}
          />
          <Typography
            sx={{ fontSize: '0.72rem', color: 'text.secondary', mt: 0.5, textAlign: 'right' }}
          >
            {summary.length}/250
          </Typography>

          <TextField
            fullWidth
            size='small'
            label='Description'
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Detailed description — acceptance criteria, technical notes, references…'
            inputProps={{ maxLength: 2000 }}
            sx={{ mt: 2 }}
          />
          <Typography
            sx={{ fontSize: '0.72rem', color: 'text.secondary', mt: 0.5, textAlign: 'right' }}
          >
            {description.length}/2000
          </Typography>
        </Box>,
      )}

      {/* ── 4. Status & Priority ─────────────────────────────────────── */}
      {wrap(
        3,
        <Box className={classes.formGrid}>
          <FormControl fullWidth size='small'>
            <Select value={status} label='Status *' onChange={(e) => setStatus(e.target.value)}>
              {TICKET_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size='small'>
            <Select
              label='Priority *'
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size='small'>
            <InputLabel>Labels</InputLabel>
            <Select
              multiple
              value={labels}
              onChange={(e) => {
                const v = e.target.value;
                setLabels(typeof v === 'string' ? v.split(',') : (v as string[]));
              }}
              input={<OutlinedInput label='Labels' />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((v) => (
                    <Chip key={v} label={v} size='small' sx={{ height: 22 }} />
                  ))}
                </Box>
              )}
            >
              {LABEL_OPTIONS.map((l) => (
                <MenuItem
                  key={l}
                  value={l}
                  sx={{ fontSize: '0.82rem', textTransform: 'capitalize' }}
                >
                  {l}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>,
      )}

      {/* ── 5. Estimation & Version ──────────────────────────────────── */}
      {wrap(
        4,
        <Box className={classes.formGridTwo}>
          <FormControl fullWidth size='small'>
            <Select
              value={storyPoints}
              label='Story Points *'
              onChange={(e) => setStoryPoints(e.target.value)}
            >
              <MenuItem value=''>
                <em>Select</em>
              </MenuItem>
              {[1, 2, 3, 5, 8, 13].map((sp) => (
                <MenuItem key={sp} value={sp}>
                  {sp}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size='small'>
            <Select
              value={fixVersion}
              label='Fix Version'
              onChange={(e) => setFixVersion(e.target.value)}
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {FIX_VERSIONS.map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>,
      )}

      {/* ── 6. Work Schedule ─────────────────────────────────────────── */}
      {wrap(
        5,
        <Box className={classes.formGrid}>
          <DatePicker
            label='Work Start Date *'
            value={workStartDate}
            onChange={(v) => setWorkStartDate(v)}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
          <DatePicker
            label='Work End Date *'
            value={workEndDate}
            onChange={(v) => setWorkEndDate(v)}
            minDate={workStartDate || undefined}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
          <DatePicker
            label='Created Date'
            value={createdDate}
            onChange={(v) => setCreatedDate(v)}
            maxDate={dayjs()}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                InputProps: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              },
            }}
          />
          <DatePicker
            label='Updated Date'
            value={updatedDate}
            onChange={(v) => setUpdatedDate(v)}
            minDate={createdDate || undefined}
            maxDate={dayjs()}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                InputProps: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              },
            }}
          />
        </Box>,
      )}

      {/* ── 7. Reporter & Link ───────────────────────────────────────── */}
      {wrap(
        6,
        <Box>
          <TextField
            fullWidth
            size='small'
            label='Ticket Link'
            value={ticketLink}
            onChange={(e) => setTicketLink(e.target.value)}
            placeholder='https://jira.example.com/browse/SCRUM-XXX'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <LinkIcon sx={{ fontSize: 16, color: '#4f46e5' }} />
                  </InputAdornment>
                ),
                endAdornment: ticketLink ? (
                  <InputAdornment position='end'>
                    <Link href={ticketLink} target='_blank' underline='none'>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          background: 'rgba(79,70,229,0.1)',
                          border: '1px solid rgba(79,70,229,0.25)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: 'rgba(79,70,229,0.18)',
                            borderColor: 'rgba(79,70,229,0.45)',
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#4f46e5' }}>
                          Open
                        </Typography>
                        <OpenInNewIcon sx={{ fontSize: 12, color: '#4f46e5' }} />
                      </Box>
                    </Link>
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />
          <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', mt: 0.5 }}>
            External link to the ticket in your tracker (Jira, GitHub, etc.).
          </Typography>
        </Box>,
      )}

      {/* ── Action Buttons ────────────────────────────────────────────── */}
      <Box className={classes.buttonContainer}>
        <Button variant='outlined' color='inherit' sx={{ color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button variant='outlined' startIcon={<SaveIcon />}>
          Save as Draft
        </Button>
        <Button
          variant='contained'
          startIcon={<SendIcon />}
          onClick={handleSubmit}
          sx={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(99,102,241,0.5)',
            },
          }}
        >
          Submit Ticket
        </Button>
      </Box>
    </Box>
  );
};

export default CreateTicket;
