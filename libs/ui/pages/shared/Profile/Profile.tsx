import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Tooltip,
  Alert,
  InputAdornment,
  Stack,
} from '@sprintpulse/component';
import { useStyles } from './styles/Profile.styles';
import { useAppDispatch, useAuth, useNotification } from '@sprintpulse/hooks';
import { updateUser, useAuthActionMutation } from '@sprintpulse/services';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import HistoryIcon from '@mui/icons-material/History';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import { DataTable, Loader } from '../../../components';
import type { Column } from '../../../components/DataTable/DataTable';

// ─── Password strength ────────────────────────────────────────────────────────
function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map: Record<number, { label: string; color: string }> = {
    0: { label: '', color: '#e0e0e0' },
    1: { label: 'Very Weak', color: '#d32f2f' },
    2: { label: 'Weak', color: '#f57c00' },
    3: { label: 'Fair', color: '#fbc02d' },
    4: { label: 'Strong', color: '#388e3c' },
    5: { label: 'Very Strong', color: '#1b5e20' },
  };
  return { score, ...map[score] };
}

// ─── Role chip color ──────────────────────────────────────────────────────────
function roleChipColor(role?: string): 'warning' | 'primary' | 'success' | 'default' {
  if (role === 'admin') return 'warning';
  if (role === 'consultant') return 'success';
  return 'primary';
}

// ─── Initials ─────────────────────────────────────────────────────────────────
function getInitials(firstName?: string, lastName?: string, name?: string): string {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (name)
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  return '?';
}

// ─── Format date ──────────────────────────────────────────────────────────────
function fmtDate(d?: string | Date | null): string {
  if (!d) return '—';
  return new Date(d as string).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Tab Panel ────────────────────────────────────────────────────────────────
const TabPanel = ({
  children,
  value,
  index,
}: {
  children?: React.ReactNode;
  value: number;
  index: number;
}) => <div hidden={value !== index}>{value === index && children}</div>;

// ─── Read-only field ──────────────────────────────────────────────────────────
const ReadField = ({
  label,
  value,
  classes,
}: {
  label: string;
  value: React.ReactNode;
  classes: Record<string, string>;
}) => (
  <Box className={classes.readField}>
    <span className={classes.readLabel}>{label}</span>
    <Box className={classes.readValue}>{value || <span style={{ color: '#9e9e9e' }}>—</span>}</Box>
  </Box>
);

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = ({
  icon,
  title,
  classes,
}: {
  icon: React.ReactNode;
  title: string;
  classes: Record<string, string>;
}) => (
  <Box className={classes.sectionHeader}>
    <Box className={classes.sectionIcon}>{icon}</Box>
    <Typography className={classes.sectionTitle}>{title}</Typography>
  </Box>
);

// ─── Component ────────────────────────────────────────────────────────────────
const Profile = () => {
  const { classes } = useStyles();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [authAction, { isLoading: isSaving }] = useAuthActionMutation();
  const notify = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [loginLogs, setLoginLogs] = useState<
    { loginTime: string; ipAddress: string; userAgent: string }[]
  >([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // ── Profile form ────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    employeeId: '',
    businessUnit: '',
    reasonForAccess: '',
  });

  // ── Password form ───────────────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [isSavingPw, setIsSavingPw] = useState(false);
  const strength = getStrength(pwForm.next);

  // ── Sync user → state ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setProfilePic(user.profilePicture || null);
    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      employeeId: user.employeeId || '',
      businessUnit: user.businessUnit || '',
      reasonForAccess: user.reasonForAccess || '',
    });
  }, [user]);

  // ── Load login logs when Activity tab selected ──────────────────────────────
  useEffect(() => {
    if (tab !== 2 || !user || loginLogs.length) return;
    setLogsLoading(true);
    authAction({ action: 'get-login-logs', userId: user.id })
      .unwrap()
      .then((res: unknown) =>
        setLoginLogs(
          (res as { data?: { loginTime: string; ipAddress: string; userAgent: string }[] })?.data ||
            [],
        ),
      )
      .catch(() => notify.error('Failed to load login history'))
      .finally(() => setLogsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, user]);

  // ── Photo upload ────────────────────────────────────────────────────────────
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      notify.error('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      notify.error('Image must be under 2 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const b64 = ev.target?.result as string;
      const prev = profilePic;
      setProfilePic(b64);
      try {
        await authAction({
          action: 'update-user',
          userId: user?.id,
          data: { profilePicture: b64 },
        }).unwrap();
        dispatch(updateUser({ profilePicture: b64 }));
        notify.success('Profile photo updated');
      } catch {
        setProfilePic(prev);
        notify.error('Failed to save photo');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    setProfilePic(null);
    try {
      await authAction({
        action: 'update-user',
        userId: user.id,
        data: { profilePicture: null },
      }).unwrap();
      dispatch(updateUser({ profilePicture: null }));
      notify.success('Photo removed');
    } catch {
      notify.error('Failed to remove photo');
    }
  };

  // ── Save profile ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!user) return;
    try {
      await authAction({
        action: 'update-user',
        userId: user.id,
        data: {
          ...form,
          name: `${form.firstName} ${form.lastName}`,
        },
      }).unwrap();
      dispatch(
        updateUser({
          ...form,
          name: `${form.firstName} ${form.lastName}`,
        }),
      );
      notify.success('Profile updated');
      setIsEditing(false);
    } catch (err: unknown) {
      notify.error(
        (err as { data?: { message?: string } })?.data?.message || 'Failed to update profile',
      );
    }
  };

  const handleCancel = () => {
    if (!user) return;
    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      employeeId: user.employeeId || '',
      businessUnit: user.businessUnit || '',
      reasonForAccess: user.reasonForAccess || '',
    });
    setIsEditing(false);
  };

  // ── Change password ─────────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!pwForm.current || !pwForm.next) {
      notify.error('All fields are required');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      notify.error('New passwords do not match');
      return;
    }
    if (pwForm.next.length < 6) {
      notify.error('Password must be at least 6 characters');
      return;
    }
    setIsSavingPw(true);
    try {
      await authAction({
        action: 'change-password',
        currentPassword: pwForm.current,
        newPassword: pwForm.next,
      }).unwrap();
      notify.success('Password changed successfully');
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err: unknown) {
      notify.error(
        (err as { data?: { message?: string } })?.data?.message || 'Failed to change password',
      );
    } finally {
      setIsSavingPw(false);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const displayName =
    user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
  const initials = getInitials(user?.firstName, user?.lastName, user?.name);
  const f = (k: keyof typeof form) => form[k];

  // ── Login log columns ───────────────────────────────────────────────────────
  type LogRow = { sno: number; loginTime: string; ipAddress: string; userAgent: string };
  const logColumns: Column<LogRow>[] = [
    { id: 'sno', label: '#', minWidth: 50, align: 'center', sortable: false },
    {
      id: 'loginTime',
      label: 'Date & Time',
      minWidth: 160,
      format: (v): React.ReactNode =>
        v
          ? new Date(v as string).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '—',
    },
    { id: 'ipAddress', label: 'IP Address', minWidth: 130, format: (v) => String(v || '—') },
    {
      id: 'userAgent',
      label: 'Browser / Device',
      minWidth: 240,
      format: (v): React.ReactNode => (
        <Typography variant='body2' noWrap className={classes.userAgentText}>
          {String(v || '—')}
        </Typography>
      ),
    },
  ];

  const logData: LogRow[] = loginLogs.slice(0, 50).map((l, i) => ({ ...l, sno: i + 1 }));

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box className={classes.container}>
      {/* ══════════════════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════════════════ */}
      <Box className={classes.heroBanner}>
        <Box className={classes.heroInner}>
          {/* Avatar */}
          <Box
            className={classes.avatarWrapper}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Box className={classes.avatarRing}>
              {profilePic ? (
                <img src={profilePic} alt='avatar' className={classes.avatarImg} />
              ) : (
                <Box className={classes.avatarInitials}>{initials}</Box>
              )}
            </Box>
            <Box className={classes.avatarOverlay} sx={{ opacity: isHovering ? 1 : 0 }}>
              <CameraAltIcon sx={{ fontSize: 22, mb: 0.25 }} />
              <span>Change Photo</span>
            </Box>
          </Box>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept='image/*'
            style={{ display: 'none' }}
          />

          {/* Text */}
          <Box className={classes.heroText}>
            <Typography className={classes.heroName}>{displayName}</Typography>
            <Typography className={classes.heroEmail}>{user?.email}</Typography>
            <Box className={classes.heroBadges}>
              <Chip
                label={user?.role?.toUpperCase() || 'USER'}
                color={roleChipColor(user?.role)}
                size='small'
                className={classes.roleChip}
              />
              {user?.isActive ? (
                <Chip
                  icon={<CheckCircleOutlineIcon sx={{ fontSize: '14px !important' }} />}
                  label='Active'
                  color='success'
                  size='small'
                  className={classes.statusChip}
                />
              ) : (
                <Chip
                  icon={<WarningAmberIcon sx={{ fontSize: '14px !important' }} />}
                  label='Inactive'
                  color='error'
                  size='small'
                  className={classes.statusChip}
                />
              )}
              {user?.mustResetPassword && (
                <Chip
                  icon={<VpnKeyIcon sx={{ fontSize: '14px !important' }} />}
                  label='Must Reset Password'
                  color='warning'
                  size='small'
                  className={classes.statusChip}
                />
              )}
            </Box>
            <Box className={classes.heroMeta}>
              <Box className={classes.heroMetaItem}>
                <CalendarTodayIcon sx={{ fontSize: 13 }} />
                <span>Member since {fmtDate(user?.createdAt)}</span>
              </Box>
              {user?.lastActivityAt && (
                <Box className={classes.heroMetaItem}>
                  <AccessTimeIcon sx={{ fontSize: 13 }} />
                  <span>Last active {fmtDate(user.lastActivityAt)}</span>
                </Box>
              )}
            </Box>
          </Box>

          {/* Hero actions */}
          <Box className={classes.heroActions}>
            {profilePic && (
              <Tooltip title='Remove photo'>
                <Button
                  size='small'
                  variant='outlined'
                  color='error'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePhoto();
                  }}
                  className={classes.removePhotoBtn}
                >
                  Remove Photo
                </Button>
              </Tooltip>
            )}
            {!isEditing ? (
              <Button
                size='small'
                startIcon={<EditIcon />}
                onClick={() => {
                  setTab(0);
                  setIsEditing(true);
                }}
                className={classes.editProfileBtn}
              >
                Edit Profile
              </Button>
            ) : (
              <Chip label='Editing' color='warning' size='small' className={classes.editingChip} />
            )}
          </Box>
        </Box>
      </Box>

      {/* ── Tabs bar ── */}
      <Box className={classes.tabsBar}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab icon={<PersonIcon sx={{ fontSize: 18 }} />} iconPosition='start' label='Profile' />
          <Tab icon={<LockIcon sx={{ fontSize: 18 }} />} iconPosition='start' label='Security' />
          <Tab icon={<HistoryIcon sx={{ fontSize: 18 }} />} iconPosition='start' label='Activity' />
        </Tabs>
      </Box>

      {/* ════════════════════════════════════════════════════════════════
          CONTENT
      ════════════════════════════════════════════════════════════════ */}
      <Box className={classes.content}>
        {/* ══ Tab 0: Profile Info ══════════════════════════════════════════ */}
        <TabPanel value={tab} index={0}>
          {/* Personal Information */}
          <Box className={classes.sectionCard}>
            <SectionHeader
              icon={<PersonIcon sx={{ fontSize: 16 }} />}
              title='Personal Information'
              classes={classes}
            />
            {isEditing ? (
              <Box className={classes.fieldGrid}>
                <TextField
                  label='First Name'
                  value={f('firstName')}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  fullWidth
                  size='small'
                  slotProps={{ htmlInput: { maxLength: 50 } }}
                />
                <TextField
                  label='Last Name'
                  value={f('lastName')}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                  fullWidth
                  size='small'
                  slotProps={{ htmlInput: { maxLength: 50 } }}
                />
                <TextField
                  label='Phone'
                  value={f('phone')}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  fullWidth
                  size='small'
                  type='tel'
                  slotProps={{ htmlInput: { maxLength: 20 } }}
                />
              </Box>
            ) : (
              <Box className={classes.fieldGrid}>
                <ReadField label='First Name' value={user?.firstName} classes={classes} />
                <ReadField label='Last Name' value={user?.lastName} classes={classes} />
                <ReadField label='Phone' value={user?.phone} classes={classes} />
                {user?.dateOfBirth && (
                  <ReadField
                    label='Date of Birth'
                    value={fmtDate(user.dateOfBirth)}
                    classes={classes}
                  />
                )}
              </Box>
            )}
          </Box>

          {/* Work Details */}
          <Box className={classes.sectionCard}>
            <SectionHeader
              icon={<BusinessIcon sx={{ fontSize: 16 }} />}
              title='Work Details'
              classes={classes}
            />
            {isEditing ? (
              <Box className={classes.fieldGrid}>
                <TextField
                  label='Email'
                  value={user?.email || ''}
                  disabled
                  fullWidth
                  size='small'
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  label='Business Unit'
                  value={f('businessUnit')}
                  onChange={(e) => setForm((p) => ({ ...p, businessUnit: e.target.value }))}
                  fullWidth
                  size='small'
                  slotProps={{ htmlInput: { maxLength: 100 } }}
                />
                <TextField
                  label='Employee ID'
                  value={f('employeeId')}
                  onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))}
                  fullWidth
                  size='small'
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <BadgeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  label='Reason for Access'
                  value={f('reasonForAccess')}
                  onChange={(e) => setForm((p) => ({ ...p, reasonForAccess: e.target.value }))}
                  fullWidth
                  size='small'
                  multiline
                  minRows={2}
                  slotProps={{ htmlInput: { maxLength: 500 } }}
                  sx={{ gridColumn: '1 / -1' }}
                />
              </Box>
            ) : (
              <Box className={classes.fieldGrid}>
                <ReadField label='Email' value={user?.email} classes={classes} />
                <ReadField label='Business Unit' value={user?.businessUnit} classes={classes} />
                <ReadField label='Employee ID' value={user?.employeeId} classes={classes} />
                {user?.reasonForAccess && (
                  <ReadField
                    label='Reason for Access'
                    value={user.reasonForAccess}
                    classes={classes}
                  />
                )}
              </Box>
            )}
          </Box>

          {/* Account & Access */}
          {!isEditing && (user?.accessFromDate || user?.accessToDate || user?.adminNotes) && (
            <Box className={classes.sectionCard}>
              <SectionHeader
                icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
                title='Account & Access'
                classes={classes}
              />
              <Box className={classes.fieldGrid}>
                {user?.accessFromDate && (
                  <ReadField
                    label='Access From'
                    value={fmtDate(user.accessFromDate)}
                    classes={classes}
                  />
                )}
                {user?.accessToDate && (
                  <ReadField
                    label='Access Until'
                    value={fmtDate(user.accessToDate)}
                    classes={classes}
                  />
                )}
                {user?.adminNotes && (
                  <ReadField label='Admin Notes' value={user.adminNotes} classes={classes} />
                )}
              </Box>
            </Box>
          )}

          {isEditing && (
            <Box className={classes.saveBar}>
              <Button variant='outlined' onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button
                variant='contained'
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving…' : 'Save Changes'}
              </Button>
            </Box>
          )}
        </TabPanel>

        {/* ══ Tab 1: Security ════════════════════════════════════════════════ */}
        <TabPanel value={tab} index={1}>
          {/* Account status */}
          <Box className={classes.sectionCard}>
            <SectionHeader
              icon={<CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
              title='Account Status'
              classes={classes}
            />

            {user?.mustResetPassword && (
              <Alert severity='warning' className={classes.mustResetAlert}>
                Your password must be reset before you can continue.
              </Alert>
            )}

            <Box className={classes.securityGrid}>
              <Box className={classes.securityItem}>
                <Typography className={classes.securityItemLabel}>Account Created</Typography>
                <Typography className={classes.securityItemValue}>
                  {fmtDate(user?.createdAt)}
                </Typography>
              </Box>
              <Box className={classes.securityItem}>
                <Typography className={classes.securityItemLabel}>Last Updated</Typography>
                <Typography className={classes.securityItemValue}>
                  {fmtDate(user?.updatedAt)}
                </Typography>
              </Box>
              <Box className={classes.securityItem}>
                <Typography className={classes.securityItemLabel}>Last Active</Typography>
                <Typography className={classes.securityItemValue}>
                  {user?.lastActivityAt ? fmtDate(user.lastActivityAt) : '—'}
                </Typography>
              </Box>
              <Box className={classes.securityItem}>
                <Typography className={classes.securityItemLabel}>Role</Typography>
                <Box className={classes.securityItemChipBox}>
                  <Chip
                    label={user?.role?.toUpperCase()}
                    color={roleChipColor(user?.role)}
                    size='small'
                    className={classes.roleChip}
                  />
                </Box>
              </Box>
              <Box className={classes.securityItem}>
                <Typography className={classes.securityItemLabel}>Status</Typography>
                <Box className={classes.securityItemChipBox}>
                  <Chip
                    label={String(user?.status || '')
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                    color={user?.isActive ? 'success' : 'default'}
                    size='small'
                    className={classes.statusChip}
                  />
                </Box>
              </Box>
              <Box className={classes.securityItem}>
                <Typography className={classes.securityItemLabel}>Source</Typography>
                <Typography
                  variant='body2'
                  fontWeight={600}
                  mt={0.5}
                  className={classes.sourceText}
                >
                  {user?.source || '—'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Change password */}
          <Box className={classes.sectionCard}>
            <SectionHeader
              icon={<VpnKeyIcon sx={{ fontSize: 16 }} />}
              title='Change Password'
              classes={classes}
            />
            <Stack spacing={2} className={classes.passwordStack}>
              <TextField
                label='Current Password'
                type={showPw.current ? 'text' : 'password'}
                value={pwForm.current}
                onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
                fullWidth
                size='small'
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          size='small'
                          onClick={() => setShowPw((p) => ({ ...p, current: !p.current }))}
                        >
                          {showPw.current ? (
                            <VisibilityOffIcon sx={{ fontSize: 18 }} />
                          ) : (
                            <VisibilityIcon sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Box>
                <TextField
                  label='New Password'
                  type={showPw.next ? 'text' : 'password'}
                  value={pwForm.next}
                  onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))}
                  fullWidth
                  size='small'
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            onClick={() => setShowPw((p) => ({ ...p, next: !p.next }))}
                          >
                            {showPw.next ? (
                              <VisibilityOffIcon sx={{ fontSize: 18 }} />
                            ) : (
                              <VisibilityIcon sx={{ fontSize: 18 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                {pwForm.next && (
                  <Box className={classes.strengthBox}>
                    <Box className={classes.strengthRow}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Box
                          key={n}
                          className={classes.strengthSegment}
                          sx={{ bgcolor: n <= strength.score ? strength.color : '#e0e0e0' }}
                        />
                      ))}
                    </Box>
                    {strength.label && (
                      <Typography className={classes.strengthLabel} sx={{ color: strength.color }}>
                        {strength.label}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
              <TextField
                label='Confirm New Password'
                type={showPw.confirm ? 'text' : 'password'}
                value={pwForm.confirm}
                onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
                fullWidth
                size='small'
                error={!!pwForm.confirm && pwForm.confirm !== pwForm.next}
                helperText={
                  pwForm.confirm && pwForm.confirm !== pwForm.next ? 'Passwords do not match' : ''
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          size='small'
                          onClick={() => setShowPw((p) => ({ ...p, confirm: !p.confirm }))}
                        >
                          {showPw.confirm ? (
                            <VisibilityOffIcon sx={{ fontSize: 18 }} />
                          ) : (
                            <VisibilityIcon sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Box>
                <Button
                  variant='contained'
                  startIcon={<LockIcon />}
                  onClick={handleChangePassword}
                  disabled={isSavingPw || !pwForm.current || !pwForm.next || !pwForm.confirm}
                  className={classes.updatePasswordBtn}
                >
                  {isSavingPw ? 'Updating…' : 'Update Password'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </TabPanel>

        {/* ══ Tab 2: Activity ════════════════════════════════════════════════ */}
        <TabPanel value={tab} index={2}>
          <Box className={classes.sectionCard}>
            <SectionHeader
              icon={<HistoryIcon sx={{ fontSize: 16 }} />}
              title='Login History'
              classes={classes}
            />
            {logsLoading ? (
              <Box className={classes.loaderBox}>
                <Loader />
              </Box>
            ) : logData.length === 0 ? (
              <Box className={classes.emptyHistory}>
                <HistoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color='text.secondary'>No login history available</Typography>
              </Box>
            ) : (
              <DataTable
                columns={logColumns}
                data={logData}
                rowKey='sno'
                searchable={false}
                initialRowsPerPage={10}
              />
            )}
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Profile;
