import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  Slide,
} from '@sprintpulse/component';
import { Avatar } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuthActionMutation } from '@sprintpulse/services';
import { useNotification } from '@sprintpulse/hooks';
import { NotificationItem } from '../hooks/useSharedHeader';

const SlideDown = React.forwardRef(
  (props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) => (
    <Slide direction='down' ref={ref} {...props} />
  ),
);

const fmtTime = (iso?: string): string => {
  if (!iso) return '';
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch {
    return '';
  }
};

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

interface NotificationsMenuProps {
  open: boolean;
  onClose: () => void;
  onViewAll: () => void;
  onItemClick: (item: NotificationItem) => void;
  notifications: NotificationItem[];
  onRefresh?: () => void;
}

const NotificationsMenu = ({
  open,
  onClose,
  onViewAll,
  onItemClick,
  notifications,
  onRefresh,
}: NotificationsMenuProps) => {
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const roleItems = notifications.filter((n) => n.type === 'role-request');

  const handleApprove = async (item: NotificationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.rawUser?.id) return;
    setActionInProgress(`approve-${item.id}`);
    try {
      await authAction({
        action: 'approve-role-request',
        userId: Number(item.rawUser.id),
      }).unwrap();
      notify.success(`Access approved for ${item.name}`);
      onRefresh?.();
    } catch {
      notify.error('Failed to approve request');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (item: NotificationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.rawUser?.id) return;
    setActionInProgress(`reject-${item.id}`);
    try {
      await authAction({ action: 'reject-role-request', userId: Number(item.rawUser.id) }).unwrap();
      notify.success(`Request from ${item.name} rejected`);
      onRefresh?.();
    } catch {
      notify.error('Failed to reject request');
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={SlideDown}
      fullWidth
      maxWidth='sm'
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
          maxHeight: '80vh',
        },
        '& .MuiBackdrop-root': {
          backdropFilter: 'blur(2px)',
        },
      }}
    >
      {/* ── Hero header ── */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 3.5,
          py: 2.5,
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, #060d1f 0%, #0d1f4a 18%, #1a3480 40%, #3730a3 62%, #0369a1 85%, #0891b2 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -40,
            left: 80,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: 'rgba(255,255,255,0.18)',
            border: '1.5px solid rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          <NotificationsIcon sx={{ fontSize: 22, color: '#fff' }} />
        </Box>

        <Box sx={{ flex: 1, zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              sx={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}
            >
              Notifications
            </Typography>
            {roleItems.length > 0 && (
              <Chip
                label={roleItems.length}
                size='small'
                sx={{
                  height: 20,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  bgcolor: '#ef4444',
                  color: '#fff',
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            )}
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.78rem', mt: 0.3 }}>
            Pending access requests requiring your review
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: 'rgba(255,255,255,0.8)',
            zIndex: 1,
            '&:hover': { background: 'rgba(255,255,255,0.12)' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* ── Content ── */}
      <DialogContent sx={{ p: 0, bgcolor: 'background.default', overflowY: 'auto' }}>
        {roleItems.length === 0 ? (
          /* Empty state */
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 7,
              px: 3,
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: 'rgba(99,102,241,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 0.5,
              }}
            >
              <NotificationsNoneIcon sx={{ fontSize: 36, color: '#6366f1' }} />
            </Box>
            <Typography variant='h6' fontWeight={700} color='text.primary'>
              All caught up!
            </Typography>
            <Typography variant='body2' color='text.secondary' textAlign='center'>
              No pending access requests at the moment.
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* Section label */}
            <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                }}
              >
                Access Requests — {roleItems.length} pending
              </Typography>
            </Box>

            {roleItems.map((item, idx) => {
              const isAdmin = item.rawUser?.requestedRole === 'admin';
              const color = isAdmin ? '#6366f1' : '#0ea5e9';
              const approving = actionInProgress === `approve-${item.id}`;
              const rejecting = actionInProgress === `reject-${item.id}`;
              const busy = approving || rejecting;

              return (
                <React.Fragment key={item.id}>
                  <Box
                    onClick={() => onItemClick(item)}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      px: 2.5,
                      py: 2,
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                      '&:hover': { bgcolor: `${color}08` },
                    }}
                  >
                    {/* Avatar */}
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        flexShrink: 0,
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${color}cc, ${color})`,
                        boxShadow: `0 2px 8px ${color}40`,
                      }}
                    >
                      {getInitials(item.name)}
                    </Avatar>

                    {/* Main info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 0.4,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: 700, fontSize: '0.88rem', color: 'text.primary' }}
                        >
                          {item.name}
                        </Typography>
                        <Chip
                          icon={
                            isAdmin ? (
                              <AdminPanelSettingsIcon sx={{ fontSize: '11px !important' }} />
                            ) : (
                              <BusinessCenterIcon sx={{ fontSize: '11px !important' }} />
                            )
                          }
                          label={isAdmin ? 'Admin' : 'Consultant'}
                          size='small'
                          variant='outlined'
                          sx={{
                            height: 18,
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            borderColor: `${color}60`,
                            color,
                            '& .MuiChip-label': { px: 0.75 },
                            '& .MuiChip-icon': { ml: 0.5 },
                          }}
                        />
                      </Box>

                      <Typography sx={{ fontSize: '0.76rem', color: 'text.secondary', mb: 0.5 }}>
                        {item.rawUser?.email || item.subtitle}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.25 }}>
                        <AccessTimeIcon sx={{ fontSize: '0.72rem', color: 'text.disabled' }} />
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>
                          {fmtTime(item.createdAt)}
                        </Typography>
                        {item.rawUser?.department && (
                          <>
                            <Typography
                              sx={{ fontSize: '0.7rem', color: 'text.disabled', mx: 0.5 }}
                            >
                              ·
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>
                              {item.rawUser.department}
                            </Typography>
                          </>
                        )}
                      </Box>

                      {/* Approve / Reject */}
                      <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant='contained'
                          color='success'
                          size='small'
                          startIcon={<CheckCircleOutlineIcon />}
                          disabled={busy}
                          onClick={(e) => handleApprove(item, e)}
                          sx={{
                            fontSize: '0.72rem',
                            px: 1.5,
                            py: 0.5,
                            minHeight: 0,
                            background: 'linear-gradient(135deg,#1b5e20,#2e7d32)',
                            '&:hover': { filter: 'brightness(1.1)' },
                            '&:disabled': { opacity: 0.5 },
                          }}
                        >
                          {approving ? 'Approving…' : 'Approve'}
                        </Button>
                        <Button
                          variant='outlined'
                          color='error'
                          size='small'
                          startIcon={<CancelOutlinedIcon />}
                          disabled={busy}
                          onClick={(e) => handleReject(item, e)}
                          sx={{ fontSize: '0.72rem', px: 1.5, py: 0.5, minHeight: 0 }}
                        >
                          {rejecting ? 'Rejecting…' : 'Reject'}
                        </Button>
                      </Box>
                    </Box>
                  </Box>

                  {idx < roleItems.length - 1 && <Divider sx={{ mx: 2.5 }} />}
                </React.Fragment>
              );
            })}
          </Box>
        )}
      </DialogContent>

      {/* ── Footer ── */}
      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          px: 3,
          py: 1.75,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          variant='text'
          endIcon={<ArrowForwardIcon />}
          onClick={() => {
            onViewAll();
            onClose();
          }}
          sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'primary.main' }}
        >
          View All Access Requests
        </Button>
      </Box>
    </Dialog>
  );
};

export default NotificationsMenu;
