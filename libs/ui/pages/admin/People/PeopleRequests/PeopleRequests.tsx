import { useState } from 'react';
import { Box, Loader, DataTable, Card, PageHeader } from '@infygen/component';
import { Typography, Tabs, TextField, InputAdornment } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import { useStyles } from './styles';
import { usePeopleRequests } from './hooks/useAccessRequests';
import PersonDetailDialog from './dialogs/PersonDetailDialog';
import { UserDetailDialog } from '../UserDetail';
import { PeopleRequestsUtils } from './utils/accessRequests.utils';
import { useAdminKeyframes } from '@infygen/hooks';
import TabPanel from '@infygen/component/TabPanel';

const PeopleRequests = () => {
  const { classes } = useStyles();
  const keyframes = useAdminKeyframes();
  const { statCards } = PeopleRequestsUtils();
  const {
    isLoading,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    tabLists,
    columns,
    tabs,
    getFilteredData,
    actionInProgress,
    actionTarget,
    actionNotes,
    handleCloseAction,
    handleConfirmAction,
    setActionNotes,
  } = usePeopleRequests();

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUserId, setDetailUserId] = useState<number | null>(null);

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

  return (
    <>
      {keyframes}
      <Box className={classes.container}>
        {/* Page header */}
        <PageHeader
          title='People Requests'
          description='Manage all role access requests — approve or reject admin and consultant requests from a single view.'
          icon={GroupIcon}
          variant='admin'
        />

        {/* Stat Cards */}
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
                  display: 'flex',
                  flexDirection: 'column',
                  outline: isActive ? `2px solid ${color}` : 'none',
                  outlineOffset: 2,
                  transform: isActive ? 'translateY(-6px)' : undefined,
                  boxShadow: isActive ? `0 16px 40px ${color}30, 0 4px 16px ${color}18` : undefined,
                }}
              />
            );
          })}
        </Box>

        {/* Tabs + Search */}
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
            {tabs}
          </Tabs>
          <TextField
            placeholder='Search...'
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className={classes.searchField}
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

        {/* Tab panels */}
        {tabLists.map((list, idx) => (
          <TabPanel key={idx} value={tabValue} index={idx}>
            {getFilteredData(list).length === 0 ? (
              <Box className={classes.emptyState}>
                <GroupIcon className={classes.emptyIcon} />
                <Typography variant='h6' color='text.secondary'>
                  {tableSearch ? 'No matching requests' : 'No access requests found'}
                </Typography>
              </Box>
            ) : (
              <Box className={classes.tableContainer}>
                <DataTable
                  columns={columns}
                  data={getFilteredData(list)}
                  rowKey='id'
                  searchable={false}
                  initialRowsPerPage={10}
                  onRowClick={(row: any) => {
                    if (row.id && !row.isDraft) openDetail(row.id as number);
                  }}
                />
              </Box>
            )}
          </TabPanel>
        ))}
      </Box>

      <PersonDetailDialog
        actionTarget={actionTarget}
        actionNotes={actionNotes}
        actionInProgress={actionInProgress}
        onClose={handleCloseAction}
        onNotesChange={setActionNotes}
        onConfirm={handleConfirmAction}
      />

      <UserDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        userId={detailUserId}
        onActionComplete={() => {
          setDetailOpen(false);
        }}
      />
    </>
  );
};

export default PeopleRequests;
