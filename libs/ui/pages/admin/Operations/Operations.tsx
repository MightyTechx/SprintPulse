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
} from '@infygen/component';
import { InputAdornment, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EditNoteIcon from '@mui/icons-material/EditNote';
import TabPanel from '@infygen/component/TabPanel';
import { useStyles } from './styles';
import { constants } from '@infygen/utils';

export interface PermitRow {
  id: string;
  permitId: string;
  permitType: string;
  ownerName: string;
  wtg: string;
  component: string;
  workLocation: string;
  permitStatus: string;
  approvalStatus: string;
  requestedTime: string;
  approvedBy: string;
  validUntil: string;
  isEmergency: boolean;
  priority: string;
  riskLevel: string;
}

const Operations = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { AdminPath } = constants;

  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');

  // Mock permit data
  const permitData: PermitRow[] = [
    {
      id: '1',
      permitId: 'P-047183',
      permitType: 'General Work Permit',
      ownerName: 'Bhogim Prathap',
      wtg: 'SWS RAL-SC3-OAL01-VRB047',
      component: 'Transformer',
      workLocation: 'HT Yard',
      permitStatus: 'TBT Details Pending',
      approvalStatus: 'Approved',
      requestedTime: '31 Mar 2026, 9:34 AM',
      approvedBy: 'John Martin',
      validUntil: '02 Apr 2026, 6:00 PM',
      isEmergency: false,
      priority: 'High',
      riskLevel: 'Medium',
    },
    {
      id: '2',
      permitId: 'P-047184',
      permitType: 'Hot Work Permit',
      ownerName: 'Ravi Kumar',
      wtg: 'SWS RAL-SC3-OAL02-VRB048',
      component: 'Generator',
      workLocation: 'LV Panel Room',
      permitStatus: 'In Progress',
      approvalStatus: 'Approved',
      requestedTime: '30 Mar 2026, 10:15 AM',
      approvedBy: 'Sarah Wilson',
      validUntil: '01 Apr 2026, 5:00 PM',
      isEmergency: true,
      priority: 'Critical',
      riskLevel: 'High',
    },
    {
      id: '3',
      permitId: 'P-047185',
      permitType: 'Electrical Work',
      ownerName: 'Anita Singh',
      wtg: 'SWS RAL-SC3-OAL03-VRB049',
      component: 'Nacelle',
      workLocation: 'Tower Base',
      permitStatus: 'Draft',
      approvalStatus: 'Pending',
      requestedTime: '29 Mar 2026, 2:30 PM',
      approvedBy: '-',
      validUntil: '-',
      isEmergency: false,
      priority: 'Low',
      riskLevel: 'Low',
    },
    {
      id: '4',
      permitId: 'P-047186',
      permitType: 'Confined Space Entry',
      ownerName: 'Suresh Patel',
      wtg: 'SWS RAL-SC3-OAL04-VRB050',
      component: 'Hub',
      workLocation: 'Hub Interior',
      permitStatus: 'Rejected',
      approvalStatus: 'Rejected',
      requestedTime: '28 Mar 2026, 11:00 AM',
      approvedBy: '-',
      validUntil: '-',
      isEmergency: false,
      priority: 'Medium',
      riskLevel: 'Medium',
    },
    {
      id: '5',
      permitId: 'P-047187',
      permitType: 'General Work Permit',
      ownerName: 'Meera Das',
      wtg: 'SWS RAL-SC3-OAL05-VRB051',
      component: 'Rotor',
      workLocation: 'Bolt Area',
      permitStatus: 'Completed',
      approvalStatus: 'Approved',
      requestedTime: '27 Mar 2026, 3:45 PM',
      approvedBy: 'Mike Chen',
      validUntil: '30 Mar 2026, 8:00 PM',
      isEmergency: false,
      priority: 'High',
      riskLevel: 'Low',
    },
  ];

  // Table columns matching the PTW details format
  const columns: Column<PermitRow>[] = [
    {
      id: 'permitId',
      label: 'Permit ID',
      minWidth: 100,
      sortable: true,
      format: (value: unknown) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: '#4f46e5',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {value as string}
        </Typography>
      ),
    },
    {
      id: 'permitType',
      label: 'Permit Type',
      minWidth: 130,
      sortable: true,
      format: (value: unknown) => (
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{value as string}</Typography>
      ),
    },
    {
      id: 'ownerName',
      label: 'Owner',
      minWidth: 140,
      sortable: true,
    },
    {
      id: 'wtg',
      label: 'WTG',
      minWidth: 180,
      sortable: true,
      format: (value: unknown) => (
        <Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>{value as string}</Typography>
      ),
    },
    {
      id: 'component',
      label: 'Component',
      minWidth: 100,
      sortable: true,
    },
    {
      id: 'workLocation',
      label: 'Location',
      minWidth: 100,
      sortable: true,
    },
    {
      id: 'permitStatus',
      label: 'Status',
      minWidth: 140,
      sortable: true,
      format: (value: unknown) => {
        const v = value as string;
        let color = '#64748b';
        let bgColor = 'rgba(100,116,139,0.1)';
        if (v.toLowerCase().includes('pending')) {
          color = '#f59e0b';
          bgColor = 'rgba(245,158,11,0.1)';
        } else if (v.toLowerCase().includes('approved') || v.toLowerCase().includes('completed')) {
          color = '#10b981';
          bgColor = 'rgba(16,185,129,0.1)';
        } else if (v.toLowerCase().includes('rejected')) {
          color = '#ef4444';
          bgColor = 'rgba(239,68,68,0.1)';
        } else if (v.toLowerCase().includes('progress')) {
          color = '#3b82f6';
          bgColor = 'rgba(59,130,246,0.1)';
        }
        return (
          <Chip
            label={v}
            size='small'
            sx={{
              background: bgColor,
              color,
              fontWeight: 600,
              fontSize: '0.7rem',
              border: `1px solid ${color}40`,
              height: 22,
            }}
          />
        );
      },
    },
    {
      id: 'approvalStatus',
      label: 'Approval',
      minWidth: 100,
      sortable: true,
      format: (value: unknown) => {
        const v = value as string;
        let color = '#64748b';
        let bgColor = 'rgba(100,116,139,0.1)';
        if (v.toLowerCase().includes('approved')) {
          color = '#10b981';
          bgColor = 'rgba(16,185,129,0.1)';
        } else if (v.toLowerCase().includes('rejected')) {
          color = '#ef4444';
          bgColor = 'rgba(239,68,68,0.1)';
        }
        return (
          <Chip
            label={v}
            size='small'
            sx={{
              background: bgColor,
              color,
              fontWeight: 600,
              fontSize: '0.7rem',
              border: `1px solid ${color}40`,
              height: 22,
            }}
          />
        );
      },
    },
    {
      id: 'isEmergency',
      label: 'Emergency',
      minWidth: 90,
      sortable: true,
      format: (value: unknown) => {
        const isEmergency = value as boolean;
        return (
          <Chip
            label={isEmergency ? 'YES' : 'NO'}
            size='small'
            sx={{
              background: isEmergency ? 'rgba(239,68,68,0.15)' : 'rgba(100,116,139,0.1)',
              color: isEmergency ? '#ef4444' : '#64748b',
              fontWeight: 700,
              fontSize: '0.7rem',
              border: `1px solid ${isEmergency ? '#ef4444' : '#64748b'}50`,
              height: 22,
            }}
          />
        );
      },
    },
    {
      id: 'priority',
      label: 'Priority',
      minWidth: 90,
      sortable: true,
      format: (value: unknown) => {
        const v = value as string;
        let color = '#64748b';
        let bgColor = 'rgba(100,116,139,0.1)';
        if (v.toLowerCase().includes('critical')) {
          color = '#dc2626';
          bgColor = 'rgba(220,38,38,0.12)';
        } else if (v.toLowerCase().includes('high')) {
          color = '#f59e0b';
          bgColor = 'rgba(245,158,11,0.12)';
        } else if (v.toLowerCase().includes('medium')) {
          color = '#3b82f6';
          bgColor = 'rgba(59,130,246,0.12)';
        } else {
          color = '#10b981';
          bgColor = 'rgba(16,185,129,0.12)';
        }
        return (
          <Chip
            label={v}
            size='small'
            sx={{
              background: bgColor,
              color,
              fontWeight: 600,
              fontSize: '0.7rem',
              border: `1px solid ${color}40`,
              height: 22,
            }}
          />
        );
      },
    },
    {
      id: 'riskLevel',
      label: 'Risk',
      minWidth: 80,
      sortable: true,
      format: (value: unknown) => {
        const v = value as string;
        let color = '#64748b';
        let bgColor = 'rgba(100,116,139,0.1)';
        if (v.toLowerCase().includes('high')) {
          color = '#dc2626';
          bgColor = 'rgba(220,38,38,0.12)';
        } else if (v.toLowerCase().includes('medium')) {
          color = '#f59e0b';
          bgColor = 'rgba(245,158,11,0.12)';
        } else {
          color = '#10b981';
          bgColor = 'rgba(16,185,129,0.12)';
        }
        return (
          <Chip
            label={v}
            size='small'
            sx={{
              background: bgColor,
              color,
              fontWeight: 600,
              fontSize: '0.7rem',
              border: `1px solid ${color}40`,
              height: 22,
            }}
          />
        );
      },
    },
    {
      id: 'requestedTime',
      label: 'Requested',
      minWidth: 130,
      sortable: true,
    },
    {
      id: 'approvedBy',
      label: 'Approved By',
      minWidth: 120,
      sortable: true,
    },
    {
      id: 'validUntil',
      label: 'Valid Until',
      minWidth: 140,
      sortable: true,
    },
  ];

  // Mock data for cards
  const statCards = [
    {
      label: 'Total Operations',
      value: permitData.length,
      Icon: EngineeringIcon,
      cls: classes.statCard0,
      sub: 'All Operations',
      color: '#4f46e5',
      tabIndex: 0,
    },
    {
      label: 'Maintenance',
      value: permitData.filter((d) => d.permitType.includes('Maintenance')).length,
      Icon: BuildIcon,
      cls: classes.statCard1,
      sub: 'Active Maintenance',
      color: '#f59e0b',
      tabIndex: 1,
    },
    {
      label: 'Work Permit',
      value: permitData.filter((d) => d.permitType.includes('Permit')).length,
      Icon: AssignmentIcon,
      cls: classes.statCard2,
      sub: 'Work Permits',
      color: '#10b981',
      tabIndex: 2,
    },
    {
      label: 'Pending',
      value: permitData.filter((d) => d.permitStatus.toLowerCase().includes('pending')).length,
      Icon: PendingActionsIcon,
      cls: classes.statCard3,
      sub: 'Awaiting Approval',
      color: '#ef4444',
      tabIndex: 3,
    },
    {
      label: 'Draft',
      value: permitData.filter((d) => d.permitStatus.toLowerCase().includes('draft')).length,
      Icon: EditNoteIcon,
      cls: classes.statCard4,
      sub: 'Draft Operations',
      color: '#0ea5e9',
      tabIndex: 4,
    },
  ];

  const handleRowClick = (row: PermitRow) => {
    navigate(`${AdminPath.PERMIT_DETAILS.replace(':id', row.id)}`);
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
          label={`${permitData.filter((d) => d.permitStatus.toLowerCase().includes('pending')).length} Pending`}
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
          onClick={() => setTabValue(3)}
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
          <Tab icon={<EngineeringIcon />} iconPosition='start' label='All' />
          <Tab icon={<BuildIcon />} iconPosition='start' label='Maintenance' />
          <Tab icon={<AssignmentIcon />} iconPosition='start' label='Work Permit' />
          <Tab icon={<PendingActionsIcon />} iconPosition='start' label='Pending' />
          <Tab icon={<EditNoteIcon />} iconPosition='start' label='Draft' />
        </Tabs>
        <TextField
          placeholder='Search permits...'
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
              data={permitData}
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
