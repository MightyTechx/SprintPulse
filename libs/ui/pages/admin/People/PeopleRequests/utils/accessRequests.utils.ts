import { AccessRequestRow } from '../types/accessRequests.types';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { useStyles } from '../styles';
import { usePeopleRequests } from '../hooks/useAccessRequests';

export const getTableData = (rows: AccessRequestRow[]): AccessRequestRow[] =>
  rows.map((r, i) => ({ ...r, sno: i + 1 }));

export const getFilteredData = (list: AccessRequestRow[], search: string): AccessRequestRow[] => {
  if (!search) return list;
  const q = search.toLowerCase();
  return list.filter((r) =>
    [r.name, r.email, r.businessUnit, r.requestedRole, r.status].some((v) =>
      String(v || '')
        .toLowerCase()
        .includes(q),
    ),
  );
};

export const getTabLists = (rows: AccessRequestRow[]) => ({
  all: rows,
  admins: rows.filter((r) => r.requestedRole === 'admin'),
  consultants: rows.filter((r) => r.requestedRole === 'consultant'),
  pending: rows.filter((r) => r.status === 'pending_approval'),
});

export const PeopleRequestsUtils = () => {
  const { classes } = useStyles();
  const { allRows } = usePeopleRequests();

  const adminCount = allRows.filter((r) => r.requestedRole === 'admin').length;
  const consultantCount = allRows.filter((r) => r.requestedRole === 'consultant').length;
  const pendingCount = allRows.filter((r) => r.status === 'pending_approval').length;

  const statCards = [
    {
      label: 'Total Requests',
      value: allRows.length,
      Icon: GroupIcon,
      cls: classes.statCard0,
      sub: 'All access requests',
      color: '#4f46e5',
      tabIndex: 0,
    },
    {
      label: 'Admin Requests',
      value: adminCount,
      Icon: AdminPanelSettingsIcon,
      cls: classes.statCard1,
      sub: 'Full platform access',
      color: '#f59e0b',
      tabIndex: 1,
    },
    {
      label: 'Consultant Requests',
      value: consultantCount,
      Icon: BusinessCenterIcon,
      cls: classes.statCard2,
      sub: 'Read-only access',
      color: '#10b981',
      tabIndex: 2,
    },
    {
      label: 'Pending',
      value: pendingCount,
      Icon: PendingActionsIcon,
      cls: classes.statCard3,
      sub: 'Awaiting admin approval',
      color: '#ef4444',
      tabIndex: 3,
    },
  ];
  return { statCards };
};
