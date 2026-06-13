import {
  Box,
  DataTable,
  Typography,
  TextField,
  IconButton,
  Button,
  Grid,
  Loader,
  Card,
  PageHeader,
} from '@infygen/component';
import {
  InputAdornment,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import FlagIcon from '@mui/icons-material/Flag';
import CloseIcon from '@mui/icons-material/Close';
import { useUtils } from './utils/util';
import {
  FlagRole,
  useCreateFeatureFlagMutation,
  useUpdateFeatureFlagMutation,
} from '@infygen/services';
import { useAuth } from '@infygen/hooks';
import { useStyles } from './styles';

const FeatureFlags = () => {
  const { classes } = useStyles();
  const { user } = useAuth();
  const {
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
  } = useUtils();

  const [createFlag, { isLoading: isCreating }] = useCreateFeatureFlagMutation();
  const [updateFlag, { isLoading: isUpdating }] = useUpdateFeatureFlagMutation();
  const isSaving = isCreating || isUpdating;

  const openCreate = () => {
    setEditingFlag(null);
    setForm(BLANK_FORM);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingFlag(null);
    setForm(BLANK_FORM);
  };

  const toggleRole = (role: FlagRole) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const handleFormSave = async () => {
    if (!form.name.trim()) return;
    const payload = {
      name: form.name,
      key: form.key || toKey(form.name),
      description: form.description,
      environment: form.environment,
      status: form.status,
      roles: form.roles.length ? form.roles : ['Admin' as FlagRole],
    };
    if (editingFlag) {
      await updateFlag({ id: editingFlag.id, ...payload, updatedBy: user?.id });
    } else {
      await createFlag({ ...payload, createdBy: user?.id });
    }
    closeDialog();
  };

  const visibleFlags = flags.filter((f) => {
    if (isConsultant && !isAdmin && !f.roles.includes('Consultant')) return false;
    const q = search.toLowerCase();
    return (
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.key.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q)
    );
  });

  // Sort: Enabled flags first, then by name
  const sortedFlags = [...visibleFlags].sort((a, b) => {
    if (a.status === 'Enabled' && b.status !== 'Enabled') return -1;
    if (a.status !== 'Enabled' && b.status === 'Enabled') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      {keyframes}

      <Box className={classes.container}>
        <PageHeader
          title='Feature Flags'
          description={
            isAdmin
              ? 'Control feature rollouts across environments and manage role-based access for each flag.'
              : 'View features currently enabled for your Consultant role. Contact an admin to request access.'
          }
          icon={TuneIcon}
          variant='admin'
        />

        {isConsultant && !isAdmin && (
          <Box className={classes.accessBanner}>
            <InfoOutlinedIcon sx={{ color: '#6366f1', fontSize: 20, flexShrink: 0 }} />
            <Typography className={classes.accessBannerText}>
              You have read-only access to feature flags. Showing only features available to your
              Consultant role.
            </Typography>
          </Box>
        )}

        <Box className={classes.statsGrid}>
          {statCards.map(({ label, value, Icon, cls, sub, color }, idx) => (
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
              sx={{ display: 'flex', flexDirection: 'column' }}
            />
          ))}
        </Box>

        <Box className={classes.tableContainer}>
          <Box className={classes.tableSectionHeader}>
            {isAdmin && (
              <Box onClick={openCreate} className={classes.addButton} sx={{ p: 0.7 }}>
                <AddIcon sx={{ fontSize: 14, color: '#fff' }} />
                <Typography
                  sx={{
                    fontSize: '14px !important',
                    fontWeight: 600,
                    color: '#fff',
                  }}
                >
                  Create New Flag
                </Typography>
              </Box>
            )}
            <TextField
              placeholder='Search flags…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={classes.searchField}
              size='small'
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

          <DataTable
            columns={columns}
            data={sortedFlags}
            rowKey='id'
            searchable={false}
            initialRowsPerPage={10}
            elevation={0}
          />
        </Box>
      </Box>

      {/* ── Create/Edit Feature Flag Dialog ── */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth='sm'
        fullWidth
        className={classes.dialog}
      >
        {/* Modal Header */}
        <Box className={classes.modalHero}>
          <Box className={classes.modalIconBox}>
            <FlagIcon sx={{ fontSize: 26, color: '#fff' }} />
          </Box>
          <Box className={classes.modalTitleBox}>
            <Typography className={classes.modalTitle}>
              {editingFlag ? 'Edit Feature Flag' : 'Create Feature Flag'}
            </Typography>
            <Typography className={classes.modalSubtitle}>
              {editingFlag
                ? 'Update the flag configuration below'
                : 'Fill in the details to create a new feature flag'}
            </Typography>
          </Box>
          <IconButton onClick={closeDialog} className={classes.modalCloseBtn} size='small'>
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>

        <DialogContent className={classes.dialogContent}>
          <Grid container spacing={2}>
            {/* Feature Name */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label='Feature Name *'
                placeholder='e.g., Enable Dark Mode'
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((prev) => ({ ...prev, name, key: toKey(name) }));
                }}
                size='small'
                fullWidth
              />
            </Grid>

            {/* Flag Key */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label='Flag Key'
                value={form.key}
                onChange={(e) => setForm((prev) => ({ ...prev, key: e.target.value }))}
                helperText='Auto-generated from name. Unique identifier used in code.'
                slotProps={{ input: { sx: { fontFamily: 'monospace', fontSize: '0.85rem' } } }}
                size='small'
                fullWidth
              />
            </Grid>

            {/* Description */}
            <Grid size={12}>
              <TextField
                label='Description'
                placeholder='Brief description of this feature flag'
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                size='small'
                fullWidth
                multiline
                rows={2}
              />
            </Grid>

            {/* Status Toggle */}
            <Grid size={12}>
              <Box
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    status: prev.status === 'Enabled' ? 'Disabled' : 'Enabled',
                  }))
                }
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: form.status === 'Enabled' ? 'primary.main' : 'divider',
                  bgcolor: form.status === 'Enabled' ? 'primary.main' : 'background.paper',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: form.status === 'Enabled' ? '#fff' : 'text.primary',
                    }}
                  >
                    {form.status}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.72rem',
                      color: form.status === 'Enabled' ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                    }}
                  >
                    {form.status === 'Enabled' ? 'Feature is active' : 'Feature is inactive'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 40,
                    height: 22,
                    borderRadius: 11,
                    bgcolor: form.status === 'Enabled' ? '#fff' : 'grey.300',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      bgcolor: form.status === 'Enabled' ? 'primary.main' : 'grey.500',
                      position: 'absolute',
                      top: 2,
                      left: form.status === 'Enabled' ? 20 : 2,
                      transition: 'all 0.2s ease',
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Access Control */}
            <Grid size={12}>
              <Typography
                sx={{ fontSize: '0.8rem', color: 'text.secondary', mb: 1, fontWeight: 600 }}
              >
                Access Control
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    onClick={() => toggleRole('Admin')}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: form.roles.includes('Admin') ? 'primary.main' : 'divider',
                      bgcolor: form.roles.includes('Admin') ? 'primary.main' : 'background.paper',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor: form.roles.includes('Admin') ? '#fff' : 'grey.400',
                        bgcolor: form.roles.includes('Admin') ? '#fff' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {form.roles.includes('Admin') && (
                        <Box
                          sx={{ width: 10, height: 10, bgcolor: 'primary.main', borderRadius: 0.5 }}
                        />
                      )}
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: form.roles.includes('Admin') ? '#fff' : 'text.primary',
                        }}
                      >
                        Admin
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          color: form.roles.includes('Admin')
                            ? 'rgba(255,255,255,0.8)'
                            : 'text.secondary',
                        }}
                      >
                        System Administrators
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    onClick={() => toggleRole('Consultant')}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: form.roles.includes('Consultant') ? 'primary.main' : 'divider',
                      bgcolor: form.roles.includes('Consultant')
                        ? 'primary.main'
                        : 'background.paper',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor: form.roles.includes('Consultant') ? '#fff' : 'grey.400',
                        bgcolor: form.roles.includes('Consultant') ? '#fff' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {form.roles.includes('Consultant') && (
                        <Box
                          sx={{ width: 10, height: 10, bgcolor: 'primary.main', borderRadius: 0.5 }}
                        />
                      )}
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: form.roles.includes('Consultant') ? '#fff' : 'text.primary',
                        }}
                      >
                        Consultant
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          color: form.roles.includes('Consultant')
                            ? 'rgba(255,255,255,0.8)'
                            : 'text.secondary',
                        }}
                      >
                        Energy Consultants
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className={classes.dialogActions}>
          <Button onClick={closeDialog} className={classes.cancelButton}>
            Cancel
          </Button>
          <Button
            onClick={handleFormSave}
            disabled={!form.name.trim() || isSaving}
            className={classes.submitButton}
            startIcon={
              isSaving ? (
                <CircularProgress size={16} color='inherit' />
              ) : (
                <AddIcon fontSize='small' />
              )
            }
          >
            {isSaving ? 'Saving…' : editingFlag ? 'Save Changes' : 'Create Flag'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FeatureFlags;
