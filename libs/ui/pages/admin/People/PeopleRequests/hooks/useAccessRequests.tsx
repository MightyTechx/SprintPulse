import React, { useEffect, useState, useCallback } from 'react';
import { Column, Chip, Typography, Button, Stack, Tooltip, Tab } from '@sprintpulse/component';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupIcon from '@mui/icons-material/Group';
import { useAuthActionMutation } from '@sprintpulse/services';
import { useNotification } from '@sprintpulse/hooks';
import { IAuthUser } from '@sprintpulse/interfaces';
import { AccessRequestRow, ActionType } from '../types/accessRequests.types';
import { getFilteredData, getTabLists, getTableData } from '../utils/accessRequests.utils';

export const usePeopleRequests = () => {
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();

  const [allRows, setAllRows] = useState<AccessRequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    user: AccessRequestRow;
    type: ActionType;
  } | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const [requestsResult, adminDraftsResult, consultantDraftsResult] = await Promise.allSettled([
        authAction({ action: 'get-role-requests' }).unwrap(),
        authAction({ action: 'get-management-drafts', type: 'admin' }).unwrap(),
        authAction({ action: 'get-management-drafts', type: 'consultant' }).unwrap(),
      ]);

      const requestsRes =
        requestsResult.status === 'fulfilled' ? requestsResult.value : { data: [] };
      const adminDraftsRes =
        adminDraftsResult.status === 'fulfilled' ? adminDraftsResult.value : { data: [] };
      const consultantDraftsRes =
        consultantDraftsResult.status === 'fulfilled' ? consultantDraftsResult.value : { data: [] };

      const pendingRequests = (requestsRes.data || []).filter(
        (u: IAuthUser) =>
          (u.requestedRole === 'admin' || u.requestedRole === 'consultant') &&
          u.status === 'pending_approval',
      );

      const makeDraftRows = (drafts: any[], role: string): AccessRequestRow[] =>
        (drafts || []).map((d: any) => {
          const f = d.formData?.form ?? {};
          return {
            id: `draft_${d.id}` as any,
            name: `${f.firstName ?? ''} ${f.lastName ?? ''}`.trim() || '-',
            email: f.email || '-',
            businessUnit: f.department || '-',
            requestedRole: role,
            status: 'draft',
            expiresAt: d.expiresAt,
            isDraft: true,
          } as any;
        });

      const adminDraftRows = makeDraftRows(adminDraftsRes.data, 'admin');
      const consultantDraftRows = makeDraftRows(consultantDraftsRes.data, 'consultant');

      const combined: AccessRequestRow[] = getTableData([
        ...adminDraftRows,
        ...consultantDraftRows,
        ...pendingRequests,
      ]);
      setAllRows(combined);
    } catch {
      notify.error('Failed to load access requests');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authAction]);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    all,
    admins: adminRows,
    consultants: consultantRows,
    pending: pendingRows,
  } = getTabLists(allRows);
  const tabLists = [all, adminRows, consultantRows, pendingRows];

  const handleDirectAction = async (row: AccessRequestRow, type: ActionType, notes?: string) => {
    setActionInProgress(row.id as number);
    try {
      await authAction({
        action: type === 'approve' ? 'approve-role-request' : 'reject-role-request',
        userId: row.id,
        adminNotes: notes || undefined,
      }).unwrap();
      notify.success(
        type === 'approve'
          ? `Access approved for ${row.name}`
          : `Request from ${row.name} has been rejected`,
      );
      fetchRequests();
    } catch {
      notify.error(`Failed to ${type} request. Please try again.`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleOpenAction = (row: AccessRequestRow, type: ActionType) => {
    setActionNotes(row.adminNotes ?? '');
    setActionTarget({ user: row, type });
  };

  const handleCloseAction = () => {
    setActionTarget(null);
    setActionNotes('');
  };

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    await handleDirectAction(actionTarget.user, actionTarget.type, actionNotes);
    handleCloseAction();
  };

  const columns: Column<AccessRequestRow>[] = [
    { id: 'sno', label: 'S.No', minWidth: 60, align: 'center', sortable: false },
    {
      id: 'name',
      label: 'Name',
      minWidth: 170,
      format: (_v: unknown, row: AccessRequestRow): React.ReactNode => (
        <Typography
          variant='body2'
          fontWeight={500}
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
          onClick={(e) => e.preventDefault()}
        >
          {String(row.name || '-')}
        </Typography>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 220,
      format: (v: unknown): React.ReactNode => String(v || '-'),
    },
    {
      id: 'businessUnit',
      label: 'Department',
      minWidth: 150,
      format: (v: unknown): React.ReactNode => String(v || '-'),
    },
    {
      id: 'requestedRole',
      label: 'Role',
      minWidth: 130,
      align: 'center',
      format: (v: unknown): React.ReactNode => {
        const role = String(v || '');
        const isAdmin = role === 'admin';
        return (
          <Chip
            label={isAdmin ? 'Admin' : 'Consultant'}
            size='small'
            variant='outlined'
            sx={{
              borderColor: isAdmin ? '#dc2626' : '#0ea5e9',
              color: isAdmin ? '#dc2626' : '#0ea5e9',
              fontWeight: 600,
            }}
          />
        );
      },
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      align: 'center',
      format: (v: unknown): React.ReactNode => {
        const status = String(v || '').toLowerCase();
        const colorMap: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
          pending_approval: 'warning',
          invited: 'info',
          active: 'success',
          rejected: 'error',
          draft: 'default',
        };
        const labelMap: Record<string, string> = {
          pending_approval: 'Pending',
          invited: 'Invited',
          active: 'Approved',
          rejected: 'Rejected',
          draft: 'Draft',
        };
        return (
          <Chip
            label={
              labelMap[status] ||
              String(v || '-')
                .charAt(0)
                .toUpperCase() + String(v || '-').slice(1)
            }
            color={colorMap[status] ?? 'default'}
            size='small'
          />
        );
      },
    },
    {
      id: 'id',
      label: 'Actions',
      minWidth: 200,
      align: 'center',
      sortable: false,
      format: (_v: unknown, row: AccessRequestRow): React.ReactNode => {
        if ((row as any).isDraft)
          return (
            <Tooltip title={`Expires: ${new Date((row as any).expiresAt).toLocaleDateString()}`}>
              <Typography variant='body2' color='text.secondary'>
                Draft only
              </Typography>
            </Tooltip>
          );
        if (row.status !== 'pending_approval') return <Typography variant='body2'>-</Typography>;
        const isProcessing = actionInProgress === row.id;
        return (
          <Stack direction='row' spacing={1} justifyContent='center'>
            <Button
              variant='contained'
              color='success'
              size='small'
              startIcon={<CheckCircleOutlineIcon />}
              disabled={isProcessing}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAction(row, 'approve');
              }}
            >
              Approve
            </Button>
            <Button
              variant='outlined'
              color='error'
              size='small'
              startIcon={<CancelOutlinedIcon />}
              disabled={isProcessing}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAction(row, 'reject');
              }}
            >
              Reject
            </Button>
          </Stack>
        );
      },
    },
  ];

  const tabs = [
    <Tab key={0} icon={<GroupIcon />} iconPosition='start' label='All Users' />,
    <Tab key={1} icon={<AdminPanelSettingsIcon />} iconPosition='start' label='Admins' />,
    <Tab key={2} icon={<BusinessCenterIcon />} iconPosition='start' label='Consultants' />,
    <Tab key={3} icon={<PendingActionsIcon />} iconPosition='start' label='Pending' />,
  ];

  return {
    isLoading,
    allRows,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    tabLists,
    columns,
    tabs,
    getFilteredData: (list: AccessRequestRow[]) => getFilteredData(list, tableSearch),
    actionInProgress,
    actionTarget,
    actionNotes,
    handleOpenAction,
    handleCloseAction,
    handleConfirmAction,
    setActionNotes,
  };
};
