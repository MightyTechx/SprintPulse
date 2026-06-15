import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  PageHeader,
  UploadFile,
  Select,
} from '@sprintpulse/component';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';

import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import GroupIcon from '@mui/icons-material/Group';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SubjectIcon from '@mui/icons-material/Subject';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FlagIcon from '@mui/icons-material/Flag';
import TimerIcon from '@mui/icons-material/Timer';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import { useStyles } from './styles';

// ── Constants (mirroring Reports Incident Log data table) ──────────────────
const TEAMS = ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Team Epsilon', 'Team Zeta'];

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

const INCIDENT_STATUSES = ['Open', 'In Progress', 'In Review', 'Blocked', 'Testing', 'Done'];

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

// ── Section metadata (color-coded left border + icon) ──────────────────────
const SECTION_META = [
  {
    icon: GroupIcon,
    label: 'Team & Ownership',
    color: '#4f46e5',
    gradient: 'linear-gradient(135deg, #4f46e5, #6366f1)',
  },
  {
    icon: ConfirmationNumberIcon,
    label: 'Incident Identification',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
  },
  {
    icon: SubjectIcon,
    label: 'Issue Description',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
  },
  {
    icon: ScheduleIcon,
    label: 'Time Tracking',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
  },
  {
    icon: FlagIcon,
    label: 'Status & Severity',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  },
  {
    icon: AttachFileIcon,
    label: 'Attachments',
    color: '#64748b',
    gradient: 'linear-gradient(135deg, #64748b, #94a3b8)',
  },
];

// ── Component ──────────────────────────────────────────────────────────────
const CreateIncident = () => {
  const { classes } = useStyles();

  // Form state
  const [team, setTeam] = useState<string>('');
  const [assignee, setAssignee] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [incidentNumber, setIncidentNumber] = useState<string>('');
  const [issue, setIssue] = useState<string>('');
  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs());
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs().add(2, 'hour'));
  const [totalHours, setTotalHours] = useState<string>('');
  const [status, setStatus] = useState<string>('Open');
  const [severity, setSeverity] = useState<string>('Medium');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Auto-suggested incident number
  const suggestedIncidentNo = useMemo(() => {
    const ts = Date.now().toString().slice(-4);
    return `INC-${(1042 + Number(ts.slice(-2))).toString()}`;
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
      assignedTo,
      incidentNumber,
      issue,
      fromDate: fromDate?.toISOString(),
      toDate: toDate?.toISOString(),
      totalHours,
      status,
      severity,
      attachedFiles: attachedFiles.map((f) => f.name),
    };
    console.log('Incident submitted:', formData);
  };

  return (
    <Box className={classes.formContainer}>
      <PageHeader
        title='Create Incident'
        description='Log a new incident for tracking and resolution'
        icon={ReportProblemIcon}
        variant='admin'
      />

      {/* ── 1. Team & Ownership ───────────────────────────────────────── */}
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
            <Select
              value={assignedTo}
              label='Assigned To'
              onChange={(e) => setAssignedTo(e.target.value)}
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

      {/* ── 2. Incident Identification ────────────────────────────────── */}
      {wrap(
        1,
        <Box className={classes.formGridTwo}>
          <TextField
            fullWidth
            size='small'
            label='Incident #'
            value={incidentNumber}
            onChange={(e) => setIncidentNumber(e.target.value)}
            placeholder={suggestedIncidentNo}
            inputProps={{ maxLength: 30 }}
          />
          <FormControl fullWidth size='small'>
            <Select
              value={severity}
              label='Severity *'
              onChange={(e) => setSeverity(e.target.value)}
            >
              {SEVERITIES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>,
      )}

      {/* ── 3. Issue Description ──────────────────────────────────────── */}
      {wrap(
        2,
        <Box>
          <TextField
            fullWidth
            size='small'
            label='Issue *'
            multiline
            rows={3}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder='Describe the incident in detail — what happened, scope, impact...'
            inputProps={{ maxLength: 500 }}
          />
          <Typography
            sx={{ fontSize: '0.72rem', color: 'text.secondary', mt: 0.5, textAlign: 'right' }}
          >
            {issue.length}/500
          </Typography>
        </Box>,
      )}

      {/* ── 4. Time Tracking ──────────────────────────────────────────── */}
      {wrap(
        3,
        <Box className={classes.formGrid}>
          <DatePicker
            label='From Date'
            value={fromDate}
            onChange={(v) => setFromDate(v)}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
          <DatePicker
            label='To Date'
            value={toDate}
            onChange={(v) => setToDate(v)}
            minDate={fromDate || undefined}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
          <TextField
            fullWidth
            size='small'
            label='Total Hours'
            value={totalHours}
            onChange={(e) => setTotalHours(e.target.value)}
            placeholder='HH:MM'
            inputProps={{ maxLength: 5 }}
          />
        </Box>,
      )}

      {/* ── 5. Status & Severity ──────────────────────────────────────── */}
      {wrap(
        4,
        <Box>
          <FormControl fullWidth size='small' sx={{ maxWidth: 320 }}>
            <Select value={status} label='Status *' onChange={(e) => setStatus(e.target.value)}>
              {INCIDENT_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {status && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mr: 1 }}>
                Current:
              </Typography>
              <Chip
                label={status}
                size='small'
                sx={{
                  background:
                    status === 'Blocked'
                      ? 'rgba(239,68,68,0.1)'
                      : status === 'In Progress'
                        ? 'rgba(59,130,246,0.1)'
                        : status === 'In Review'
                          ? 'rgba(139,92,246,0.1)'
                          : status === 'Testing'
                            ? 'rgba(245,158,11,0.1)'
                            : status === 'Done'
                              ? 'rgba(16,185,129,0.1)'
                              : 'rgba(100,116,139,0.1)',
                  color:
                    status === 'Blocked'
                      ? '#ef4444'
                      : status === 'In Progress'
                        ? '#3b82f6'
                        : status === 'In Review'
                          ? '#8b5cf6'
                          : status === 'Testing'
                            ? '#f59e0b'
                            : status === 'Done'
                              ? '#10b981'
                              : '#64748b',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  border: '1px solid currentColor',
                }}
              />
              <Chip
                label={`Severity: ${severity}`}
                size='small'
                sx={{
                  background:
                    severity === 'Critical'
                      ? 'rgba(239,68,68,0.1)'
                      : severity === 'High'
                        ? 'rgba(245,158,11,0.1)'
                        : severity === 'Medium'
                          ? 'rgba(59,130,246,0.1)'
                          : 'rgba(16,185,129,0.1)',
                  color:
                    severity === 'Critical'
                      ? '#ef4444'
                      : severity === 'High'
                        ? '#f59e0b'
                        : severity === 'Medium'
                          ? '#3b82f6'
                          : '#10b981',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  border: '1px solid currentColor',
                }}
              />
            </Box>
          )}
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
            background: 'linear-gradient(135deg, #ef4444 0%, #f97316 50%, #f59e0b 100%)',
            boxShadow: '0 4px 14px rgba(239,68,68,0.4)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(239,68,68,0.5)',
            },
          }}
        >
          Submit Incident
        </Button>
      </Box>
    </Box>
  );
};

export default CreateIncident;
