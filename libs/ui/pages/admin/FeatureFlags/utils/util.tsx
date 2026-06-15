import {
  type FlagRole,
  type FlagStatus,
  type FlagEnvironment,
  useGetFeatureFlagsQuery,
  useToggleFeatureFlagMutation,
  useDeleteFeatureFlagMutation,
  FeatureFlag,
} from '@sprintpulse/services';
import { Slide, Typography, Chip, Switch, Tooltip, IconButton } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React, { useState } from 'react';
import { Box, Column } from '@sprintpulse/component';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import GroupIcon from '@mui/icons-material/Group';
import { useAdminKeyframes, useAuth } from '@sprintpulse/hooks';
import { useStyles } from '../styles';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FlagFormState {
  name: string;
  key: string;
  description: string;
  environment: FlagEnvironment;
  status: FlagStatus;
  roles: FlagRole[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const BLANK_FORM: FlagFormState = {
  name: '',
  key: '',
  description: '',
  environment: 'Development',
  status: 'Disabled',
  roles: ['Admin'],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

export const toKey = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

// ─── Slide Transition ─────────────────────────────────────────────────────────

export const SlideUp = React.forwardRef(
  (props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) => (
    <Slide direction='up' ref={ref} {...props} />
  ),
);

// ─── Utils Hook (for backward compatibility) ──────────────────────────────────

export const useUtils = () => {
  const { classes } = useStyles();
  const keyframes = useAdminKeyframes();
  const { isAdmin, isConsultant, user } = useAuth();

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [form, setForm] = useState<FlagFormState>(BLANK_FORM);

  // ─── API Hooks ───────────────────────────────────────────────────────────────

  // pollingInterval ensures every user sees new flags within 30 s of creation
  const { data: flags = [] } = useGetFeatureFlagsQuery(undefined, {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [toggleFlag] = useToggleFeatureFlagMutation();
  const [deleteFlag] = useDeleteFeatureFlagMutation();

  const openEdit = (flag: FeatureFlag) => {
    setEditingFlag(flag);
    setForm({
      name: flag.name,
      key: flag.key,
      description: flag.description,
      environment: flag.environment,
      status: flag.status,
      roles: [...flag.roles],
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => deleteFlag(id);

  const handleToggle = (id: number) => toggleFlag({ id, updatedBy: user?.id });

  const enabledCount = flags.filter((f) => f.status === 'Enabled').length;
  const disabledCount = flags.filter((f) => f.status === 'Disabled').length;
  const consultantCount = flags.filter((f) => f.roles.includes('Consultant')).length;

  const statCards = [
    {
      label: 'Total Flags',
      value: flags.length,
      Icon: FlagIcon,
      cls: classes.statCard0,
      sub: 'All Feature Flags',
      color: '#4f46e5',
    },
    {
      label: 'Enabled',
      value: enabledCount,
      Icon: CheckCircleOutlineIcon,
      cls: classes.statCard1,
      sub: 'Currently Active',
      color: '#10b981',
    },
    {
      label: 'Disabled',
      value: disabledCount,
      Icon: CancelOutlinedIcon,
      cls: classes.statCard2,
      sub: 'Inactive Flags',
      color: '#ef4444',
    },
    {
      label: 'Consultant Access',
      value: consultantCount,
      Icon: GroupIcon,
      cls: classes.statCard3,
      sub: 'Visible to Consultants',
      color: '#f59e0b',
    },
  ];

  // ─── Table columns ───────────────────────────────────────────────────────────

  const columns: Column<FeatureFlag>[] = [
    {
      id: 'name',
      label: 'Feature Name',
      minWidth: 200,
      sortable: true,
      align: 'left',
      format: (v, row) => (
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#4338ca' }}>
            {String(v)}
          </Typography>
          <Typography sx={{ fontSize: '0.73rem', color: '#94a3b8', fontFamily: 'monospace' }}>
            {row.key}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 260,
      sortable: false,
      align: 'left',
      format: (v) => (
        <Typography sx={{ fontSize: '0.83rem', color: '#475569', lineHeight: 1.45 }}>
          {String(v)}
        </Typography>
      ),
    },
    {
      id: 'roles',
      label: 'Access Roles',
      minWidth: 160,
      sortable: false,
      align: 'center',
      format: (v) => {
        const roles = v as FlagRole[];
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            {roles.map((role) => (
              <Chip
                key={role}
                label={role}
                size='small'
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  background: role === 'Admin' ? 'rgba(99,102,241,0.12)' : 'rgba(16,185,129,0.1)',
                  color: role === 'Admin' ? '#4338ca' : '#059669',
                }}
              />
            ))}
          </Box>
        );
      },
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 130,
      sortable: true,
      align: 'center',
      format: (v, row) => {
        const enabled = v === 'Enabled';
        if (isAdmin) {
          return (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}
            >
              <Switch
                checked={enabled}
                onChange={() => handleToggle(row.id)}
                size='small'
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4338ca' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4338ca',
                  },
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: enabled ? '#4338ca' : '#94a3b8',
                }}
              >
                {enabled ? 'Enabled' : 'Disabled'}
              </Typography>
            </Box>
          );
        }
        return (
          <Chip
            label={enabled ? 'Enabled' : 'Disabled'}
            size='small'
            sx={{
              height: 24,
              fontSize: '0.72rem',
              fontWeight: 600,
              background: enabled ? 'rgba(99,102,241,0.1)' : 'rgba(100,116,139,0.1)',
              color: enabled ? '#4338ca' : '#64748b',
            }}
          />
        );
      },
    },
    {
      id: 'updatedAt',
      label: 'Last Modified',
      minWidth: 120,
      sortable: true,
      align: 'center',
      format: (v) => (
        <Typography sx={{ fontSize: '0.83rem', color: '#64748b' }}>
          {new Date(String(v)).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </Typography>
      ),
    },
    ...(isAdmin
      ? ([
          {
            id: 'actions',
            label: 'Actions',
            minWidth: 100,
            sortable: false,
            align: 'center' as const,
            format: (_v: unknown, row: FeatureFlag) => (
              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                <Tooltip title='Edit'>
                  <IconButton
                    size='small'
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(row);
                    }}
                    className={classes.editButton}
                  >
                    <EditIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Delete'>
                  <IconButton
                    size='small'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(row.id);
                    }}
                    className={classes.deleteButton}
                  >
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            ),
          },
        ] as Column<FeatureFlag>[])
      : []),
  ];

  return {
    SlideUp,
    BLANK_FORM,
    toKey,
    keyframes,
    isAdmin,
    isConsultant,
    flags,
    search,
    setSearch,
    dialogOpen,
    setDialogOpen,
    editingFlag,
    setEditingFlag,
    form,
    setForm,
    columns,
    statCards,
  };
};
