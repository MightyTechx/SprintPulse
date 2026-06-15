import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Chip, Switch, Link } from '@mui/material';
import { useAuthActionMutation } from '@sprintpulse/services';
import { constants } from '@sprintpulse/utils';
import { useAuth, useNotification, useMediaQuery } from '@sprintpulse/hooks';
import { IAuthUser, UserRole } from '@sprintpulse/interfaces';
import { UserRow, InitialCreateValues } from '../types/peopleManagement.types';
import {
  loadNewUserDraft,
  getDraftDaysRemaining,
  fmtDate,
  fmtDateUser,
  fmtDateTimeUser,
} from '../utils/accessManagement.utils';
import { Column } from '@sprintpulse/component';
import { AccessRequestRow } from '../../PeopleRequests/types/accessRequests.types';

const usePeopleManagement = () => {
  const [authAction] = useAuthActionMutation();
  const { user: currentUser } = useAuth();
  const notify = useNotification();
  const isMobile = useMediaQuery('(max-width: 599px)');

  // ── Table state ───────────────────────────────────────────────────────────────
  const [allUsers, setAllUsers] = useState<IAuthUser[]>([]);
  const [admins, setAdmins] = useState<IAuthUser[]>([]);
  const [consultants, setConsultants] = useState<IAuthUser[]>([]);
  const [dbDraftUsers, setDbDraftUsers] = useState<IAuthUser[]>([]);
  const [pendingRequests, setPendingRequests] = useState<AccessRequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
  const [selectedRow, setSelectedRow] = useState<UserRow | null>(null);
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);

  // ── Draft display (read from localStorage, shown as pinned row in table) ─────
  const [draftMeta, setDraftMeta] = useState<{ savedAt: string; expiresAt: string } | null>(() => {
    const d = loadNewUserDraft();
    return d ? { savedAt: d.savedAt, expiresAt: d.expiresAt } : null;
  });
  const [draftValues] = useState<InitialCreateValues | null>(() => {
    const d = loadNewUserDraft();
    return d ? d.values : null;
  });

  // ── Fetch ─────────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const [usersResult, draftsResult, requestsResult] = await Promise.allSettled([
        authAction({ action: 'get-all-users' }).unwrap(),
        authAction({ action: 'get-management-drafts' }).unwrap(),
        authAction({ action: 'get-role-requests' }).unwrap(),
      ]);

      const usersData = usersResult.status === 'fulfilled' ? usersResult.value : { data: [] };
      const draftsData = draftsResult.status === 'fulfilled' ? draftsResult.value : { data: [] };
      const requestsData =
        requestsResult.status === 'fulfilled' ? requestsResult.value : { data: [] };

      const users: IAuthUser[] = usersData.data || [];
      const adminsOnly = users.filter((u) => u.role === 'admin');
      const consultantsOnly = users.filter((u) => u.role === 'consultant');

      // Fetch pending requests
      const pending: AccessRequestRow[] = (requestsData.data || [])
        .filter(
          (u: IAuthUser) =>
            (u.requestedRole === 'admin' || u.requestedRole === 'consultant') &&
            u.status === 'pending_approval',
        )
        .map((u: IAuthUser) => ({
          id: u.id,
          name: u.name || `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || '-',
          email: u.email || '-',
          businessUnit: u.businessUnit || '-',
          requestedRole: u.requestedRole,
          status: u.status,
          expiresAt: '',
          isDraft: false,
          adminNotes: u.adminNotes,
        }));
      // Sort pending requests by createdAt (newest first)
      const sortedPending = [...pending].sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
      setPendingRequests(sortedPending);

      const dbDrafts: IAuthUser[] = (draftsData.data || []).map((d: any) => {
        const f = d.formData?.form ?? {};
        const draftCustomId =
          f.userId ||
          (d.type === 'admin'
            ? `ADMIN${String(d.id).padStart(4, '0')}`
            : `CONSULT${String(d.id).padStart(4, '0')}`);
        return {
          id: `draft_${d.id}`,
          customUserId: draftCustomId,
          firstName: f.firstName || '',
          lastName: f.lastName || '',
          name: `${f.firstName ?? ''} ${f.lastName ?? ''}`.trim() || '(Draft)',
          email: f.email || '—',
          phone: f.phone || null,
          businessUnit: f.department || null,
          employeeId: f.employeeId || null,
          dateOfBirth: null,
          profilePicture: null,
          reasonForAccess: f.reasonForAccess || null,
          role: d.type,
          requestedRole: d.type,
          status: 'draft',
          source: 'draft',
          isActive: false,
          mustResetPassword: false,
          consultantProfileUpdated: false,
          application: null,
          applicationLead: null,
          adminNotes: `Draft · Expires ${new Date(d.expiresAt).toLocaleDateString()}`,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
          accessFromDate: null,
          accessToDate: d.expiresAt,
          lastActivityAt: null,
          reviewedBy: null,
          reviewedAt: null,
          draftExpiresAt: d.expiresAt ? new Date(d.expiresAt).toISOString() : null,
        } as unknown as IAuthUser;
      });

      // Sort function: pending/draft first, active second, others last
      const sortUsersByStatus = (users: IAuthUser[]): IAuthUser[] => {
        return [...users].sort((a, b) => {
          const aIsDraft =
            (a as any).status === 'draft' ||
            (a as any).status === 'pending_approval' ||
            (a as any).status === 'invited';
          const bIsDraft =
            (b as any).status === 'draft' ||
            (b as any).status === 'pending_approval' ||
            (b as any).status === 'invited';

          const aIsActive = (a as any).status === 'active' && (a as any).isActive === true;
          const bIsActive = (b as any).status === 'active' && (b as any).isActive === true;

          // Draft/Pending first
          if (aIsDraft && !bIsDraft) return -1;
          if (!aIsDraft && bIsDraft) return 1;

          // Active second
          if (aIsActive && !bIsActive) return -1;
          if (!aIsActive && bIsActive) return 1;

          // Both draft or both active - sort by createdAt descending
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });
      };

      const adminDrafts = dbDrafts.filter((d) => (d as any).role === 'admin');
      const consultantDrafts = dbDrafts.filter((d) => (d as any).role === 'consultant');
      const relevantDbDrafts = [...adminDrafts, ...consultantDrafts];

      // Sort all users: pending/draft first, active second, others last
      const sortedAdminsOnly = sortUsersByStatus(adminsOnly);
      const sortedConsultantsOnly = sortUsersByStatus(consultantsOnly);
      const sortedAllUsers = sortUsersByStatus([...adminsOnly, ...consultantsOnly]);

      setAllUsers([...relevantDbDrafts, ...sortedAllUsers]);
      setAdmins([...adminDrafts, ...sortedAdminsOnly]);
      setConsultants([...consultantDrafts, ...sortedConsultantsOnly]);
      setDbDraftUsers(relevantDbDrafts);
      setSelectedRow((prev) => {
        if (!prev) return null;
        const fresh = users.find(
          (u) => u.id === prev.id && (u.role === 'admin' || u.role === 'consultant'),
        );
        return fresh ? { ...fresh, sno: prev.sno } : null;
      });
    } catch {
      notify.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authAction]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRowSelect = (row: UserRow) => {
    setSelectedRow((prev) => (prev?.id === row.id ? null : row));
  };

  const handleRowClick = (row: UserRow) => {
    const rawId = row.id as unknown as number | string;
    const isDraft = rawId === -1 || String(rawId).startsWith('draft_');
    const urlId: string = isDraft ? (rawId === -1 ? 'draft_local' : String(rawId)) : String(rawId);

    const baseData = tabValue === 1 ? admins : tabValue === 2 ? consultants : allUsers;
    const q = tableSearch.trim().toLowerCase();
    const allRowsList: IAuthUser[] =
      tabValue === 0 && draftRow ? [draftRow as unknown as IAuthUser, ...baseData] : [...baseData];
    const filteredRows = q
      ? allRowsList.filter((u) =>
          Object.values(u).some(
            (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(q),
          ),
        )
      : allRowsList;

    const visibleIds = filteredRows.map((u) => {
      const uid = u.id as unknown as number | string;
      if (uid === -1) return 'draft_local';
      if (String(uid).startsWith('draft_')) return String(uid);
      return uid as number;
    });

    const draftMap: Record<string, IAuthUser> = {};
    filteredRows.forEach((u) => {
      if ((u as any).status !== 'draft') return;
      const uid = u.id as unknown as number | string;
      const key = u.customUserId
        ? u.customUserId
        : uid === -1
          ? 'draft_local'
          : String(uid).startsWith('draft_')
            ? String(uid)
            : null;
      if (key) draftMap[key] = u;
    });

    localStorage.setItem('user_detail_nav_ids', JSON.stringify(visibleIds));
    localStorage.setItem('user_detail_nav_ids_ts', String(Date.now()));
    localStorage.setItem('user_detail_draft_map', JSON.stringify(draftMap));

    if (isDraft || (row.customUserId && row.status === 'draft')) {
      localStorage.setItem('user_detail_draft_data', JSON.stringify(row));
      localStorage.setItem('user_detail_draft_data_ts', String(Date.now()));
    }

    const url = constants.AdminPath.USER_DETAIL.replace(':id', urlId);
    window.open(url, '_blank');
  };

  const handleToggleAccess = async (row: UserRow, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newVal = e.target.checked;
    setTogglingIds((prev) => new Set(prev).add(row.id));
    try {
      await authAction({
        action: newVal ? 'activate-user' : 'deactivate-user',
        userId: row.id,
      }).unwrap();
      const patch = (u: IAuthUser) => (u.id === row.id ? { ...u, isActive: newVal } : u);
      setAllUsers((p) => p.map(patch));
      setAdmins((p) => p.map(patch));
      setConsultants((p) => p.map(patch));
      if (selectedRow?.id === row.id) setSelectedRow((p) => (p ? { ...p, isActive: newVal } : p));
    } catch {
      notify.error(`Failed to update access for ${row.name}`);
    } finally {
      setTogglingIds((prev) => {
        const n = new Set(prev);
        n.delete(row.id);
        return n;
      });
    }
  };

  // ── Pending request actions ──────────────────────────────────────────────────
  const handlePendingAction = async (row: AccessRequestRow, type: 'approve' | 'reject') => {
    setActionInProgress(row.id);
    try {
      await authAction({
        action: type === 'approve' ? 'approve-role-request' : 'reject-role-request',
        userId: row.id,
      }).unwrap();
      notify.success(
        type === 'approve'
          ? `Access approved for ${row.name}`
          : `Request from ${row.name} has been rejected`,
      );
      fetchUsers();
    } catch {
      notify.error(`Failed to ${type} request. Please try again.`);
    } finally {
      setActionInProgress(null);
    }
  };

  // ── Columns ───────────────────────────────────────────────────────────────────
  const columns: Column<UserRow>[] = useMemo(
    () => [
      { id: 'sno', label: 'S.No', minWidth: 60, sortable: false },
      {
        id: 'name',
        label: 'Name',
        minWidth: 130,
        format: (_v: unknown, row: UserRow): React.ReactNode => (
          <Link
            component='button'
            variant='body2'
            underline='hover'
            sx={{ fontWeight: 500, cursor: 'pointer', color: '#1976d2' }}
            onClick={(e: React.MouseEvent) => e.preventDefault()}
          >
            {String(row.name || '-')}
          </Link>
        ),
      },
      { id: 'email', label: 'Work Email', minWidth: 180, format: (v) => String(v || '-') },
      {
        id: 'role',
        label: 'User Role',
        minWidth: 150,
        format: (v): React.ReactNode => {
          const role = String(v || '');
          if (!role || role === '-') return '-';
          const colorMap: Record<string, 'warning' | 'success' | 'primary'> = {
            admin: 'warning',
            consultant: 'success',
            user: 'primary',
          };
          return (
            <Chip
              label={role.charAt(0).toUpperCase() + role.slice(1)}
              color={colorMap[role] || 'default'}
              size='small'
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          );
        },
      },
      {
        id: 'status' as keyof UserRow,
        label: 'Status',
        minWidth: 120,
        format: (v): React.ReactNode => {
          const status = String(v || '');
          if (!status || status === '-') return '-';
          const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
          const color =
            status === 'active' ? 'success' : status === 'inactive' ? 'default' : 'warning';
          return (
            <Chip
              label={label}
              color={color as 'success' | 'default' | 'warning'}
              size='small'
              variant='outlined'
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          );
        },
      },
      {
        id: 'isActive' as keyof UserRow,
        label: 'Access',
        minWidth: 90,
        sortable: false,
        format: (_v, row: UserRow): React.ReactNode => (
          <Switch
            size='small'
            checked={!!row.isActive}
            color='success'
            disabled={togglingIds.has(row.id) || row.id === currentUser?.id}
            onChange={(e) => handleToggleAccess(row, e)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      {
        id: 'accessFromDate' as keyof UserRow,
        label: 'Access Start Date',
        minWidth: 180,
        format: (v) => fmtDate(v as string),
      },
      {
        id: 'accessToDate' as keyof UserRow,
        label: 'Access End Date',
        minWidth: 180,
        format: (v) => fmtDate(v as string),
      },
      {
        id: 'createdAt' as keyof UserRow,
        label: 'Joined',
        minWidth: 140,
        format: (v) => fmtDateUser(v as string, undefined, undefined),
      },
      {
        id: 'lastActivityAt' as keyof UserRow,
        label: 'Last Activity',
        minWidth: 180,
        format: (v) => fmtDateTimeUser(v as string, undefined, undefined, undefined),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedRow, togglingIds],
  );

  const getTableData = (users: IAuthUser[], startFrom = 1): UserRow[] =>
    users.map((u, i) => ({ ...u, sno: startFrom + i }));

  const draftRow: UserRow | null =
    draftMeta && draftValues
      ? ({
          id: -1,
          sno: 0,
          firstName: draftValues.firstName || '',
          lastName: draftValues.lastName || '',
          name:
            [draftValues.firstName, draftValues.lastName].filter(Boolean).join(' ') ||
            '(Draft User)',
          email: draftValues.email || '—',
          phone: draftValues.phone || null,
          businessUnit: draftValues.department || null,
          employeeId: draftValues.employeeId || null,
          dateOfBirth: null,
          profilePicture: null,
          reasonForAccess: draftValues.reasonForAccess || null,
          role: draftValues.role as UserRole,
          requestedRole: null,
          status: 'draft',
          reviewedBy: null,
          reviewedAt: null,
          adminNotes: `Draft saved ${new Date(draftMeta.savedAt).toLocaleDateString()} · Expires in ${getDraftDaysRemaining(draftMeta.expiresAt)} days`,
          isActive: false,
          createdAt: draftMeta.savedAt,
          updatedAt: draftMeta.savedAt,
          accessFromDate: draftMeta.savedAt,
          accessToDate: draftMeta.expiresAt,
          application: null,
          applicationLead: null,
          consultantProfileUpdated: false,
          mustResetPassword: false,
          source: 'draft',
          lastActivityAt: null,
          draftExpiresAt: draftMeta.expiresAt,
        } as unknown as UserRow)
      : null;

  return {
    allUsers,
    admins,
    consultants,
    dbDraftUsers,
    pendingRequests,
    isLoading,
    isMobile,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    selectedRow,
    handleRowSelect,
    columns,
    getTableData,
    draftRow,
    actionInProgress,
    handlePendingAction,
  };
};

export default usePeopleManagement;
