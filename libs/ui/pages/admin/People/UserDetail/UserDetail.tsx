import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { constants } from '@infygen/utils';
import type { TransitionProps } from '@mui/material/transitions';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import SaveIcon from '@mui/icons-material/Save';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckIcon from '@mui/icons-material/Check';
import { useAuthActionMutation } from '@infygen/services';
import { useNotification } from '@infygen/hooks';
import { IAuthUser } from '@infygen/interfaces';
import {
  Loader,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Button,
  Avatar,
  TextField,
  Slide,
  MenuItem,
  InputAdornment,
  Tooltip,
} from '@infygen/component';
import { useStyles } from './styles';

export const SlideUp = React.forwardRef(
  (props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) => {
    return <Slide direction='up' ref={ref} {...props} />;
  },
);

// ── ReviewCard (read-only) ────────────────────────────────────────────────────

interface ReviewField {
  label: string;
  value: string;
  highlight?: boolean;
}
interface ReviewCardProps {
  title: string;
  color: string;
  gradient: string;
  glow: string;
  icon: React.ReactNode;
  fields: ReviewField[];
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  title,
  color,
  gradient,
  glow,
  icon,
  fields,
}) => {
  const { classes } = useStyles();
  const filled = fields.filter((f) => f.value);
  if (!filled.length) return null;
  return (
    <Box className={classes.reviewCardRoot} sx={{ borderColor: `${color}28` }}>
      <Box
        className={classes.reviewCardHeader}
        sx={{
          background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
          borderColor: `${color}18`,
        }}
      >
        <Box
          className={classes.reviewCardIconBox}
          sx={{ background: gradient, boxShadow: `0 3px 8px ${glow}` }}
        >
          <Box sx={{ color: '#fff', display: 'flex', '& svg': { fontSize: '0.95rem' } }}>
            {icon}
          </Box>
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '0.86rem', color, letterSpacing: '-0.01em' }}>
          {title}
        </Typography>
        <Box
          className={classes.reviewCardCountBadge}
          sx={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color }}>
            {filled.length} field{filled.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </Box>
      <Box className={classes.reviewCardGrid}>
        {filled.map((f, i) => (
          <Box
            key={f.label}
            className={classes.reviewCardCell}
            sx={{
              borderBottom: i < filled.length - 1 ? '1px solid' : 'none',
              borderRight: { sm: i % 2 === 0 && i < filled.length - 1 ? '1px solid' : 'none' },
              borderColor: 'divider',
              background: f.highlight ? `${color}06` : 'transparent',
            }}
          >
            <Typography className={classes.reviewFieldLabel}>{f.label}</Typography>
            <Typography
              className={classes.reviewFieldValue}
              sx={{
                fontWeight: f.highlight ? 700 : 500,
                color: f.highlight ? color : 'text.primary',
              }}
            >
              {f.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ── EditCard — same header style as ReviewCard ────────────────────────────────

interface EditCardProps {
  title: string;
  color: string;
  gradient: string;
  glow: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const EditCard: React.FC<EditCardProps> = ({ title, color, gradient, glow, icon, children }) => {
  const { classes } = useStyles();
  return (
    <Box className={classes.reviewCardRoot} sx={{ borderColor: `${color}28`, mb: 2 }}>
      <Box
        className={classes.reviewCardHeader}
        sx={{
          background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
          borderColor: `${color}18`,
        }}
      >
        <Box
          className={classes.reviewCardIconBox}
          sx={{ background: gradient, boxShadow: `0 3px 8px ${glow}` }}
        >
          <Box sx={{ color: '#fff', display: 'flex', '& svg': { fontSize: '0.95rem' } }}>
            {icon}
          </Box>
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '0.86rem', color, letterSpacing: '-0.01em' }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 2.5 }}>{children}</Box>
    </Box>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (v?: string | null) => {
  if (!v) return '';
  return new Date(v).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
const fmtDateTime = (v?: string | null) => {
  if (!v) return '';
  return new Date(v).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const DEPARTMENT_OPTIONS = [
  'IT Administration',
  'Maintenance',
  'Human Resources',
  'Operations',
  'Service',
  'External Consulting',
  'Other',
];
const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'admin', label: 'Admin' },
];

const generateRandomPassword = () => {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%&*';
  const all = upper + lower + digits + symbols;
  const pick = (src: string) => src[Math.floor(Math.random() * src.length)];
  const base = pick(upper) + pick(lower) + pick(digits) + pick(symbols);
  let rest = '';
  for (let i = 0; i < 8; i++) rest += pick(all);
  return (base + rest)
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

// ── Edit form state ───────────────────────────────────────────────────────────

interface EditValues {
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
  workLocation: string;
  employeeId: string;
  businessUnit: string;
  managerName: string;
  role: string;
  adminNotes: string;
  accessFromDate: string;
  accessToDate: string;
}

const toEditValues = (u: IAuthUser): EditValues => ({
  firstName: u.firstName || '',
  lastName: u.lastName || '',
  phone: u.phone || '',
  department: u.department || '',
  workLocation: u.workLocation || '',
  employeeId: u.employeeId || '',
  businessUnit: u.businessUnit || '',
  managerName: u.managerName || '',
  role: u.role || 'user',
  adminNotes: u.adminNotes || '',
  accessFromDate: u.accessFromDate ? u.accessFromDate.split('T')[0] : '',
  accessToDate: u.accessToDate ? u.accessToDate.split('T')[0] : '',
});

// ── Dialog ────────────────────────────────────────────────────────────────────

interface UserDetailDialogProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
  onActionComplete?: () => void;
}

export const UserDetailDialog: React.FC<UserDetailDialogProps> = ({
  open,
  onClose,
  userId,
  onActionComplete,
}) => {
  const { classes } = useStyles();
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();

  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<EditValues | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Password reset state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwCopied, setPwCopied] = useState(false);

  useEffect(() => {
    if (open && userId !== null) {
      fetchUser();
    } else {
      resetDialogState();
    }
  }, [open, userId]);

  const resetDialogState = () => {
    setUser(null);
    setAdminNotes('');
    setIsEditing(false);
    setEditValues(null);
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPw(false);
    setShowConfirmPw(false);
    setPwCopied(false);
  };

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const res = await authAction({ action: 'get-user', userId: Number(userId) }).unwrap();
      const { data } = res;
      setUser(data);
      setIsActive(data.isActive ?? false);
      setAdminNotes(data.adminNotes || '');
    } catch {
      notify.error('Failed to load user details');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAccess = async (checked: boolean) => {
    if (!user) return;
    try {
      await authAction({
        action: checked ? 'activate-user' : 'deactivate-user',
        userId: user.id,
      }).unwrap();
      setIsActive(checked);
      setUser((prev) => (prev ? { ...prev, isActive: checked } : prev));
      notify.success(`Access ${checked ? 'enabled' : 'disabled'} for ${user.name}`);
    } catch {
      notify.error('Failed to update access');
    }
  };

  const handleApprove = async () => {
    if (userId === null) return;
    try {
      setActionInProgress(true);
      await authAction({
        action: 'approve-role-request',
        userId: Number(userId),
        adminNotes: adminNotes || undefined,
      }).unwrap();
      notify.success('Request approved successfully');
      onActionComplete?.();
      onClose();
    } catch {
      notify.error('Failed to approve request');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleReject = async () => {
    if (userId === null) return;
    try {
      setActionInProgress(true);
      await authAction({
        action: 'reject-role-request',
        userId: Number(userId),
        adminNotes: adminNotes || undefined,
      }).unwrap();
      notify.success('Request rejected');
      onActionComplete?.();
      onClose();
    } catch {
      notify.error('Failed to reject request');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleEditOpen = () => {
    if (user) {
      setEditValues(toEditValues(user));
      setNewPassword('');
      setConfirmPassword('');
      setIsEditing(true);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditValues(null);
    setNewPassword('');
    setConfirmPassword('');
    setPwCopied(false);
  };

  const handleEditChange = (field: keyof EditValues, value: string) =>
    setEditValues((prev) => (prev ? { ...prev, [field]: value } : prev));

  const handleSave = async () => {
    if (!user || !editValues) return;

    // Validate password fields if the admin filled them in
    if (newPassword || confirmPassword) {
      if (newPassword.length < 8) {
        notify.error('Password must be at least 8 characters');
        return;
      }
      if (newPassword !== confirmPassword) {
        notify.error('Passwords do not match');
        return;
      }
    }

    setIsSaving(true);
    try {
      await authAction({
        action: 'update-user',
        userId: user.id,
        data: {
          ...editValues,
          accessFromDate: editValues.accessFromDate || null,
          accessToDate: editValues.accessToDate || null,
        },
      }).unwrap();

      if (newPassword) {
        await authAction({ action: 'reset-user-password', userId: user.id, newPassword }).unwrap();
        notify.success('User details and password updated successfully');
      } else {
        notify.success('User details updated successfully');
      }

      setIsEditing(false);
      setEditValues(null);
      setNewPassword('');
      setConfirmPassword('');
      await fetchUser();
      onActionComplete?.();
    } catch {
      notify.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePassword = () => {
    const pw = generateRandomPassword();
    setNewPassword(pw);
    setConfirmPassword('');
    setPwCopied(false);
    setShowNewPw(true);
  };

  const handleCopyPassword = () => {
    if (!newPassword) return;
    navigator.clipboard.writeText(newPassword).then(() => {
      setPwCopied(true);
      setTimeout(() => setPwCopied(false), 2500);
    });
  };

  const pwMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const isPending = user?.status === 'pending_approval';
  const isActive_ = user?.status === 'active';

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isSaving) {
          handleEditCancel();
          onClose();
        }
      }}
      TransitionComponent={SlideUp}
      fullWidth
      maxWidth='md'
      className={classes.dialog}
    >
      {/* ── Hero header ── */}
      <Box className={classes.modalHero}>
        <Box className={classes.modalIconBox}>
          {user?.profilePicture ? (
            <Avatar src={user.profilePicture} sx={{ width: 52, height: 52 }} />
          ) : isEditing ? (
            <EditIcon sx={{ fontSize: 24, color: '#fff' }} />
          ) : (
            <PersonOutlineIcon sx={{ fontSize: 26, color: '#fff' }} />
          )}
        </Box>
        <Box className={classes.modalTitleBox}>
          <Typography className={classes.modalTitle}>
            {isEditing
              ? `Editing — ${user?.firstName || ''} ${user?.lastName || ''}`.trim()
              : user?.name ||
                (user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : 'User Details')}
          </Typography>
          <Typography className={classes.modalSubtitle}>
            {user?.email || (isLoading ? 'Loading…' : '—')}
          </Typography>
        </Box>
        <Box className={classes.modalStatChips}>
          {user?.role && (
            <Box className={classes.modalStatChip}>
              <BadgeIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Typography>
            </Box>
          )}
          {user?.status && (
            <Box className={classes.modalStatChip}>
              <AccessTimeIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
                {user.status.replace(/_/g, ' ')}
              </Typography>
            </Box>
          )}
        </Box>
        <IconButton
          onClick={() => {
            handleEditCancel();
            onClose();
          }}
          className={classes.modalCloseBtn}
          disabled={isSaving}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* ── Content ── */}
      <DialogContent sx={{ p: 3, bgcolor: 'background.default' }}>
        {isLoading ? (
          <Loader />
        ) : isEditing && editValues ? (
          /* ── Edit form ── */
          <Box>
            {/* Reset Password */}
            <EditCard
              title='Reset Password'
              color='#d97706'
              gradient='linear-gradient(135deg,#b45309,#d97706)'
              glow='rgba(217,119,6,0.35)'
              icon={<LockResetIcon />}
            >
              <Box
                sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}
              >
                <TextField
                  fullWidth
                  size='small'
                  label='New Password'
                  type={showNewPw ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  helperText='Leave blank to keep current password'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton size='small' onClick={() => setShowNewPw((v) => !v)} edge='end'>
                          {showNewPw ? (
                            <VisibilityOffIcon fontSize='small' />
                          ) : (
                            <VisibilityIcon fontSize='small' />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  size='small'
                  label='Confirm Password'
                  type={showConfirmPw ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={pwMismatch}
                  helperText={pwMismatch ? 'Passwords do not match' : ' '}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          size='small'
                          onClick={() => setShowConfirmPw((v) => !v)}
                          edge='end'
                        >
                          {showConfirmPw ? (
                            <VisibilityOffIcon fontSize='small' />
                          ) : (
                            <VisibilityIcon fontSize='small' />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              {/* Generate & Copy icon buttons below the password fields */}
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                <Tooltip title='Generate random password' placement='top'>
                  <IconButton
                    size='small'
                    onClick={handleGeneratePassword}
                    sx={{
                      border: '1.5px solid',
                      borderColor: '#d97706',
                      color: '#d97706',
                      borderRadius: '8px',
                      '&:hover': { bgcolor: 'rgba(217,119,6,0.08)' },
                    }}
                  >
                    <AutorenewIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
                <Tooltip title={pwCopied ? 'Copied!' : 'Copy password'} placement='top'>
                  <span>
                    <IconButton
                      size='small'
                      onClick={handleCopyPassword}
                      disabled={!newPassword}
                      sx={{
                        border: '1.5px solid',
                        borderColor: pwCopied ? 'success.main' : 'divider',
                        color: pwCopied ? 'success.main' : 'text.secondary',
                        borderRadius: '8px',
                        '&:hover': { bgcolor: pwCopied ? 'rgba(46,125,50,0.08)' : 'action.hover' },
                        '&:disabled': { opacity: 0.35 },
                      }}
                    >
                      {pwCopied ? (
                        <CheckIcon fontSize='small' sx={{ color: 'success.main' }} />
                      ) : (
                        <ContentCopyIcon fontSize='small' />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </EditCard>

            {/* Personal Information */}
            <EditCard
              title='Personal Information'
              color='#1976d2'
              gradient='linear-gradient(135deg,#1565c0,#1976d2)'
              glow='rgba(25,118,210,0.3)'
              icon={<PersonOutlineIcon />}
            >
              <Box
                sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}
              >
                <TextField
                  fullWidth
                  size='small'
                  label='First Name'
                  value={editValues.firstName}
                  onChange={(e) => handleEditChange('firstName', e.target.value)}
                />
                <TextField
                  fullWidth
                  size='small'
                  label='Last Name'
                  value={editValues.lastName}
                  onChange={(e) => handleEditChange('lastName', e.target.value)}
                />
                <TextField
                  fullWidth
                  size='small'
                  label='Phone'
                  value={editValues.phone}
                  onChange={(e) => handleEditChange('phone', e.target.value)}
                />
                <TextField
                  fullWidth
                  size='small'
                  label='Employee ID'
                  value={editValues.employeeId}
                  onChange={(e) => handleEditChange('employeeId', e.target.value)}
                />
              </Box>
            </EditCard>

            {/* Work Information — all fields xs=12 sm=6 for consistent width */}
            <EditCard
              title='Work Information'
              color='#7b1fa2'
              gradient='linear-gradient(135deg,#6a1b9a,#8e24aa)'
              glow='rgba(123,31,162,0.3)'
              icon={<BusinessIcon />}
            >
              <Box
                sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}
              >
                <TextField
                  fullWidth
                  size='small'
                  select
                  label='Department'
                  value={editValues.department}
                  onChange={(e) => handleEditChange('department', e.target.value)}
                >
                  <MenuItem value=''>— None —</MenuItem>
                  {DEPARTMENT_OPTIONS.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  size='small'
                  label='Work Location'
                  value={editValues.workLocation}
                  onChange={(e) => handleEditChange('workLocation', e.target.value)}
                />
                <TextField
                  fullWidth
                  size='small'
                  label='Business Unit'
                  value={editValues.businessUnit}
                  onChange={(e) => handleEditChange('businessUnit', e.target.value)}
                />
                <TextField
                  fullWidth
                  size='small'
                  label='Manager Name'
                  value={editValues.managerName}
                  onChange={(e) => handleEditChange('managerName', e.target.value)}
                />
                <TextField
                  fullWidth
                  size='small'
                  select
                  label='Role'
                  value={editValues.role}
                  onChange={(e) => handleEditChange('role', e.target.value)}
                >
                  {ROLE_OPTIONS.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      {r.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </EditCard>

            {/* Access Period */}
            <EditCard
              title='Access Period'
              color='#2e7d32'
              gradient='linear-gradient(135deg,#1b5e20,#2e7d32)'
              glow='rgba(46,125,50,0.3)'
              icon={<EventAvailableIcon />}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <DatePicker
                    label='Access Start Date'
                    value={editValues.accessFromDate ? dayjs(editValues.accessFromDate) : null}
                    onChange={(v) =>
                      handleEditChange('accessFromDate', v ? v.format('YYYY-MM-DD') : '')
                    }
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                  <DatePicker
                    label='Access End Date'
                    value={editValues.accessToDate ? dayjs(editValues.accessToDate) : null}
                    onChange={(v) =>
                      handleEditChange('accessToDate', v ? v.format('YYYY-MM-DD') : '')
                    }
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    minDate={
                      editValues.accessFromDate ? dayjs(editValues.accessFromDate) : undefined
                    }
                  />
                </Box>
              </LocalizationProvider>
            </EditCard>

            {/* Admin Notes */}
            <EditCard
              title='Admin Notes'
              color='#f59e0b'
              gradient='linear-gradient(135deg,#d97706,#f59e0b)'
              glow='rgba(245,158,11,0.3)'
              icon={<NoteAltIcon />}
            >
              <TextField
                fullWidth
                size='small'
                multiline
                rows={3}
                label='Notes'
                placeholder='Add any internal notes about this user…'
                value={editValues.adminNotes}
                onChange={(e) => handleEditChange('adminNotes', e.target.value)}
              />
            </EditCard>
          </Box>
        ) : (
          /* ── Read-only view ── */
          <>
            <ReviewCard
              title='Personal Information'
              color='#1976d2'
              gradient='linear-gradient(135deg,#1565c0,#1976d2)'
              glow='rgba(25,118,210,0.3)'
              icon={<PersonOutlineIcon />}
              fields={[
                { label: 'Full Name', value: user?.name || '' },
                { label: 'First Name', value: user?.firstName || '' },
                { label: 'Last Name', value: user?.lastName || '' },
                { label: 'Phone', value: user?.phone || '' },
                { label: 'Email', value: user?.email || '' },
                { label: 'Employee ID', value: user?.employeeId || '' },
                { label: 'Date of Birth', value: fmtDate(user?.dateOfBirth) },
                { label: 'City / Zone', value: user?.city || '' },
              ]}
            />
            <ReviewCard
              title='Work Information'
              color='#7b1fa2'
              gradient='linear-gradient(135deg,#6a1b9a,#8e24aa)'
              glow='rgba(123,31,162,0.3)'
              icon={<BusinessIcon />}
              fields={[
                { label: 'Department', value: user?.department || '' },
                { label: 'Business Unit', value: user?.businessUnit || '' },
                { label: 'Work Location', value: user?.workLocation || '' },
                { label: 'Manager Name', value: user?.managerName || '' },
                { label: 'Application', value: user?.application || '' },
                { label: 'Application Lead', value: user?.applicationLead || '' },
                {
                  label: 'Role',
                  value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '',
                  highlight: true,
                },
                {
                  label: 'Requested Role',
                  value: user?.requestedRole
                    ? user.requestedRole.charAt(0).toUpperCase() + user.requestedRole.slice(1)
                    : '',
                },
                { label: 'Reason for Access', value: user?.reasonForAccess || '' },
              ]}
            />
            {user?.reviewedByName && (
              <ReviewCard
                title='Review & Access'
                color='#0d47a1'
                gradient='linear-gradient(135deg,#0d47a1,#1565c0)'
                glow='rgba(13,71,161,0.3)'
                icon={<CheckCircleOutlineIcon />}
                fields={[
                  { label: 'Reviewed By', value: user.reviewedByName, highlight: true },
                  ...(user.reviewedByEmail
                    ? [{ label: 'Reviewer Email', value: user.reviewedByEmail } as ReviewField]
                    : []),
                  ...(user.reviewedByPhone
                    ? [{ label: 'Reviewer Phone', value: user.reviewedByPhone } as ReviewField]
                    : []),
                  ...(user?.adminNotes
                    ? [
                        {
                          label: 'Admin Notes',
                          value: user.adminNotes,
                          highlight: true,
                        } as ReviewField,
                      ]
                    : []),
                  ...(user?.status
                    ? [
                        {
                          label: 'Status',
                          value:
                            user?.status
                              ?.replace(/_/g, ' ')
                              .replace(/\b\w/g, (c) => c.toUpperCase()) || '',
                          highlight: true,
                        },
                      ]
                    : []),
                ]}
              />
            )}
            <ReviewCard
              title='Activity'
              color='#e65100'
              gradient='linear-gradient(135deg,#bf360c,#e65100)'
              glow='rgba(230,81,0,0.3)'
              icon={<CalendarTodayIcon />}
              fields={[
                { label: 'Joined', value: fmtDate(user?.createdAt) },
                { label: 'Last Activity', value: fmtDateTime(user?.lastActivityAt) },
                { label: 'Last Updated', value: fmtDateTime(user?.updatedAt) },
                { label: 'Reviewed At', value: fmtDateTime(user?.reviewedAt) },
                { label: 'Password Reset Required', value: user?.mustResetPassword ? 'Yes' : 'No' },
              ]}
            />

            {isPending && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label='Admin Notes'
                  multiline
                  rows={3}
                  fullWidth
                  placeholder='Add any notes about this request...'
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  helperText='These notes will be saved and visible in the user review details.'
                  sx={{ mb: 2 }}
                />
              </Box>
            )}
          </>
        )}
      </DialogContent>

      {/* ── Footer ── */}
      <Box className={classes.actionBar}>
        {isEditing ? (
          <>
            <Typography className={classes.actionBarHint}>
              {newPassword
                ? 'Profile + password will be updated on save.'
                : 'Make changes then save, or cancel to discard.'}
            </Typography>
            <Box className={classes.actionBarButtons}>
              <Button
                variant='outlined'
                size='small'
                onClick={handleEditCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                size='small'
                startIcon={isSaving ? null : <SaveIcon />}
                disabled={isSaving}
                onClick={handleSave}
                sx={{
                  background: 'linear-gradient(135deg,#1565c0,#1976d2)',
                  '&:hover': { filter: 'brightness(1.08)' },
                }}
              >
                {isSaving ? 'Saving…' : 'Save Changes'}
              </Button>
            </Box>
          </>
        ) : isPending ? (
          <>
            <Typography className={classes.actionBarHint}>
              Review the request details before taking action.
            </Typography>
            <Box className={classes.actionBarButtons}>
              <Button
                variant='outlined'
                color='error'
                size='small'
                startIcon={<CancelOutlinedIcon />}
                disabled={actionInProgress}
                onClick={handleReject}
              >
                {actionInProgress ? 'Rejecting…' : 'Reject'}
              </Button>
              <Button
                variant='contained'
                color='success'
                size='small'
                startIcon={<CheckCircleOutlineIcon />}
                disabled={actionInProgress}
                onClick={handleApprove}
                sx={{
                  background: 'linear-gradient(135deg,#1b5e20,#2e7d32)',
                  '&:hover': { filter: 'brightness(1.08)' },
                  '&:disabled': { opacity: 0.45 },
                }}
              >
                {actionInProgress ? 'Approving…' : 'Approve'}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography className={classes.actionBarHint}>
              View complete profile details.
            </Typography>
            <Box className={classes.actionBarButtons}>
              <Button
                variant='outlined'
                size='small'
                onClick={onClose}
                sx={{ height: 36, px: 2.5 }}
              >
                Close
              </Button>
              {isActive_ && (
                <Button
                  variant='contained'
                  size='small'
                  startIcon={<EditIcon />}
                  onClick={handleEditOpen}
                  sx={{
                    background: 'linear-gradient(135deg,#1565c0,#1976d2)',
                    '&:hover': { filter: 'brightness(1.08)' },
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>
    </Dialog>
  );
};

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { AdminPath } = constants;
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate(AdminPath.ACCESS_MANAGEMENT);
  };

  return (
    <UserDetailDialog
      open={open}
      onClose={handleClose}
      userId={id ? Number(id) : null}
      onActionComplete={handleClose}
    />
  );
};

export default UserDetailPage;
