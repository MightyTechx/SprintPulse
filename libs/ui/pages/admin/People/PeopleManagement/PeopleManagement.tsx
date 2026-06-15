import { useState } from 'react';
import {
  Box,
  Loader,
  DataTable,
  Typography,
  Grid,
  Tabs,
  Tab,
  TextField,
  Chip,
  Button,
  Card,
  PageHeader,
} from '@sprintpulse/component';
import { Card as MUICard, InputAdornment, Stack } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SearchIcon from '@mui/icons-material/Search';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import usePeopleManagement from './hooks/useAccessManagement';
import { AccessRequestRow } from '../PeopleRequests/types/accessRequests.types';
import { IAuthUser } from '@sprintpulse/interfaces';
import { UserDetailDialog } from '../UserDetail';
import { CreateUserDialog } from './components/CreateUserDialog';
import { useAdminKeyframes } from '@sprintpulse/hooks';
import { useStyles } from './styles';
import TabPanel from '@sprintpulse/component/TabPanel';

const PeopleManagement = () => {
  const { classes } = useStyles();
  const keyframes = useAdminKeyframes();

  const {
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
    columns,
    getTableData,
    draftRow,
    actionInProgress,
    handlePendingAction,
  } = usePeopleManagement();

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUserId, setDetailUserId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const openDetail = (id: number) => {
    setDetailUserId(id);
    setDetailOpen(true);
  };

  if (isLoading) {
    return (
      <>
        {keyframes}
        <Box className={classes.container}>
          <Loader />
        </Box>
      </>
    );
  }

  const draftCount = dbDraftUsers.length + (draftRow ? 1 : 0);
  const pendingCount = pendingRequests.length;

  const statCards = [
    {
      label: 'Total Users',
      value: allUsers.length,
      Icon: GroupIcon,
      cls: classes.statCard0,
      sub: 'System Registrations',
      color: '#4f46e5',
      tabIndex: 0,
    },
    {
      label: 'Admins',
      value: admins.length,
      Icon: AdminPanelSettingsIcon,
      cls: classes.statCard1,
      sub: 'System Administrators',
      color: '#f59e0b',
      tabIndex: 1,
    },
    {
      label: 'Consultants',
      value: consultants.length,
      Icon: BusinessCenterIcon,
      cls: classes.statCard2,
      sub: 'Energy Consultants',
      color: '#10b981',
      tabIndex: 2,
    },
    {
      label: 'Pending',
      value: pendingCount,
      Icon: PendingActionsIcon,
      cls: classes.statCard3,
      sub: 'Awaiting Approval',
      color: '#ef4444',
      tabIndex: 3,
    },
  ];

  return (
    <>
      {keyframes}
      <Grid className={classes.container}>
        {/* ── Page header ── */}
        <PageHeader
          title='People Management'
          description='View and manage all users and their access across different roles in the system.'
          icon={GroupIcon}
          variant='admin'
        />

        {/* ── Action Bar (Create User + Pending Badge) ── */}
        <Box className={classes.actionBar}>
          {/* Pending Requests Badge */}
          <Chip
            label={`${pendingCount} Pending`}
            size='small'
            sx={{
              background: pendingCount > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(100,116,139,0.12)',
              border:
                pendingCount > 0
                  ? '1px solid rgba(239,68,68,0.4)'
                  : '1px solid rgba(100,116,139,0.3)',
              color: pendingCount > 0 ? '#ef4444' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 28,
              cursor: 'pointer',
              '&:hover': {
                background: pendingCount > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(100,116,139,0.18)',
              },
              // mobile: stretch to fill left half
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
          {/* Create User Button */}
          <Box
            onClick={() => setCreateOpen(true)}
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
              // mobile: stretch to fill right half
              '@media (max-width:600px)': {
                width: '48%',
              },
            }}
          >
            <PersonAddIcon sx={{ fontSize: 16, color: '#fff' }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>
              Create User
            </Typography>
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
            <Tab
              icon={<GroupIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'All Users'}
            />
            <Tab
              icon={<AdminPanelSettingsIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'Admins'}
            />
            <Tab
              icon={<BusinessCenterIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'Consultants'}
            />
            <Tab
              icon={<PendingActionsIcon />}
              iconPosition='start'
              label={
                isMobile ? undefined : `Pending${pendingCount > 0 ? ` (${pendingCount})` : ''}`
              }
            />
          </Tabs>
          <TextField
            placeholder='Search...'
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
        {[allUsers, admins, consultants, pendingRequests].map((list, idx) => {
          const showLocalDraft = (idx === 0 || idx === 3) && draftRow;
          const tableData =
            idx < 3 ? getTableData(list as IAuthUser[], showLocalDraft ? 2 : 1) : [];
          const filteredData =
            idx < 3
              ? tableSearch
                ? tableData.filter((row) =>
                    Object.values(row).some(
                      (val) =>
                        val !== null &&
                        val !== undefined &&
                        String(val).toLowerCase().includes(tableSearch.toLowerCase()),
                    ),
                  )
                : tableData
              : [];

          // Pending tab specific filtering
          const pendingFiltered =
            idx === 3
              ? tableSearch
                ? (list as AccessRequestRow[]).filter((row) =>
                    Object.values(row).some(
                      (val) =>
                        val !== null &&
                        val !== undefined &&
                        String(val).toLowerCase().includes(tableSearch.toLowerCase()),
                    ),
                  )
                : list
              : [];

          const pinnedData =
            idx < 3 && showLocalDraft
              ? tableSearch
                ? Object.values(draftRow).some(
                    (val) =>
                      val !== null &&
                      val !== undefined &&
                      String(val).toLowerCase().includes(tableSearch.toLowerCase()),
                  )
                  ? [{ ...draftRow, sno: 1 }]
                  : []
                : [{ ...draftRow, sno: 1 }]
              : [];

          return (
            <TabPanel key={idx} value={tabValue} index={idx}>
              {idx === 3 ? (
                /* Pending Requests Tab with Approve/Reject */
                <Box className={classes.tableContainer}>
                  {pendingFiltered.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <PendingActionsIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                      <Typography variant='h6' color='text.secondary'>
                        {tableSearch ? 'No matching requests' : 'No pending requests'}
                      </Typography>
                    </Box>
                  ) : (
                    <DataTable
                      columns={[
                        { id: 'sno', label: 'S.No', minWidth: 60, sortable: false },
                        {
                          id: 'name',
                          label: 'Name',
                          minWidth: 150,
                          format: (v, row: AccessRequestRow) => (
                            <Typography
                              variant='body2'
                              sx={{
                                color: '#1976d2',
                                cursor: 'pointer',
                                fontWeight: 500,
                                '&:hover': { textDecoration: 'underline' },
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetail(row.id as number);
                              }}
                            >
                              {String(v || '-')}
                            </Typography>
                          ),
                        },
                        {
                          id: 'email',
                          label: 'Email',
                          minWidth: 200,
                          format: (v) => String(v || '-'),
                        },
                        {
                          id: 'businessUnit',
                          label: 'Department',
                          minWidth: 150,
                          format: (v) => String(v || '-'),
                        },
                        {
                          id: 'requestedRole',
                          label: 'Role',
                          minWidth: 120,
                          align: 'center',
                          format: (v) => {
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
                          id: 'actions',
                          label: 'Actions',
                          minWidth: 200,
                          align: 'center',
                          sortable: false,
                          format: (_v, row: AccessRequestRow) => {
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
                                    handlePendingAction(row, 'approve');
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
                                    handlePendingAction(row, 'reject');
                                  }}
                                >
                                  Reject
                                </Button>
                              </Stack>
                            );
                          },
                        },
                      ]}
                      data={(pendingFiltered as AccessRequestRow[]).map((row, i) => ({
                        ...row,
                        sno: i + 1,
                      }))}
                      rowKey='id'
                      searchable={false}
                      initialRowsPerPage={10}
                      onRowClick={(row) => openDetail((row as AccessRequestRow).id as number)}
                    />
                  )}
                </Box>
              ) : (
                <Box className={classes.tableContainer}>
                  <DataTable
                    columns={columns}
                    data={filteredData}
                    rowKey='id'
                    searchable={false}
                    initialRowsPerPage={10}
                    onRowClick={(row) => openDetail(row.id as number)}
                    activeRowKey={selectedRow?.id as number}
                    pinnedRows={pinnedData}
                  />
                </Box>
              )}
            </TabPanel>
          );
        })}
      </Grid>

      <UserDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        userId={detailUserId}
        onActionComplete={() => {
          setDetailOpen(false);
        }}
      />

      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {}}
      />
    </>
  );
};

export default PeopleManagement;
