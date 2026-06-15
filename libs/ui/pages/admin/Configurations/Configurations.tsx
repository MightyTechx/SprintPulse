import { useState } from 'react';
import {
  Box,
  PageHeader,
  DataTable,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tooltip,
} from '@sprintpulse/component';
import { InputAdornment, CircularProgress, Switch } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import InboxIcon from '@mui/icons-material/Inbox';
import { useAuth } from '@sprintpulse/hooks';
import { useStyles } from './styles';
import {
  useUtils,
  toKey,
  getIconComponent,
  DEFAULT_SQUAD_ICON,
  DEFAULT_TEAM_ICON,
} from './utils/util';

const Configurations = () => {
  const { classes } = useStyles();
  const { isAdmin } = useAuth();
  const {
    keyframes,
    activeEntity,
    setActiveEntity,
    activeTab,
    search,
    setSearch,
    dialogOpen,
    editingItem,
    form,
    setForm,
    data,
    columns,
    counts,
    openCreate,
    openEdit,
    closeDialog,
    handleSave,
    handleDelete,
    handleToggle,
    entityTabs,
    colorSwatches,
    iconRegistry,
  } = useUtils();

  const [saving, setSaving] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await handleSave();
    } finally {
      setSaving(false);
    }
  };

  const ActiveTabIcon = activeTab.icon;

  return (
    <>
      {keyframes}

      <Box className={classes.container}>
        <PageHeader
          title='Configurations'
          description='Centralized reference data used across SprintPulse — manage squads, teams, statuses, issue types, fix versions, sprint numbers, and priorities in one place.'
          icon={SettingsIcon}
          variant='admin'
        />

        {/* ── Entity Tabs ── */}
        <Box className={classes.tabsBox}>
          {entityTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeEntity === tab.key;
            return (
              <Box
                key={tab.key}
                className={`${classes.tabPill} ${isActive ? classes.tabPillActive : ''}`}
                onClick={() => {
                  setActiveEntity(tab.key);
                  setSearch('');
                }}
              >
                <TabIcon sx={{ fontSize: '1.05rem' }} />
                <span>{tab.label}</span>
              </Box>
            );
          })}
        </Box>

        {/* ── Active tab description strip ── */}
        <Box className={classes.tabDescription}>
          <Box
            className={classes.tabDescriptionIcon}
            sx={{
              background: `linear-gradient(135deg, ${activeTab.color} 0%, ${activeTab.color}cc 100%)`,
              boxShadow: `0 4px 12px ${activeTab.color}55`,
            }}
          >
            <ActiveTabIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          <Typography className={classes.tabDescriptionText}>{activeTab.description}</Typography>
        </Box>

        {/* ── Data Table ── */}
        <Box className={classes.tableContainer}>
          <Box className={classes.tableSectionHeader}>
            {isAdmin && (
              <Box onClick={openCreate} className={classes.addButton}>
                <AddIcon sx={{ fontSize: 16, color: '#fff' }} />
                <Typography className={classes.addButtonLabel}>
                  Add {activeTab.label.replace(/s$/, '')}
                </Typography>
              </Box>
            )}
            <TextField
              placeholder={`Search ${activeTab.label.toLowerCase()}…`}
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

          {data.length === 0 ? (
            <Box className={classes.emptyState}>
              <InboxIcon className={classes.emptyIcon} />
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>
                No {activeTab.label.toLowerCase()} yet
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', mt: 0.5 }}>
                {isAdmin
                  ? `Click "Add ${activeTab.label.replace(/s$/, '')}" to create the first one.`
                  : 'No entries are configured yet. Ask an admin to set these up.'}
              </Typography>
            </Box>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
              elevation={0}
            />
          )}
        </Box>
      </Box>

      {/* ── Create / Edit Dialog ── */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth='sm'
        fullWidth
        className={classes.dialog}
      >
        <Box className={classes.modalHero}>
          <Box className={classes.modalIconBox}>
            <ActiveTabIcon sx={{ fontSize: 22, color: '#fff' }} />
          </Box>
          <Box className={classes.modalTitleBox}>
            <Typography className={classes.modalTitle}>
              {editingItem
                ? `Edit ${activeTab.label.replace(/s$/, '')}`
                : `Create ${activeTab.label.replace(/s$/, '')}`}
            </Typography>
            <Typography className={classes.modalSubtitle}>
              {editingItem
                ? 'Update the configuration below'
                : `Add a new entry to ${activeTab.label.toLowerCase()}`}
            </Typography>
          </Box>
          <Button
            onClick={closeDialog}
            className={classes.modalCloseBtn}
            sx={{ minWidth: 'auto', p: 0.5 }}
          >
            <CloseIcon fontSize='small' />
          </Button>
        </Box>

        <DialogContent className={classes.dialogContent}>
          <Box className={classes.formStack}>
            {/* Name */}
            <TextField
              label='Name *'
              placeholder={`e.g. ${activeTab.label.replace(/s$/, '')} name`}
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  name,
                  // Auto-derive key only while the user hasn't manually edited it
                  // or while creating (not editing) — preserve user's key on edit.
                  key:
                    !editingItem || prev.key === '' || prev.key === toKey(prev.name)
                      ? toKey(name)
                      : prev.key,
                }));
              }}
              size='small'
              fullWidth
              className={classes.formField}
            />

            {/* Icon picker (Squads + Teams only) — kept as-is per request */}
            {(activeEntity === 'squad' || activeEntity === 'team') && (
              <Box className={classes.iconPickerShell}>
                <Box
                  className={classes.iconPickerHeader}
                  onClick={() => setIconPickerOpen((v) => !v)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box
                      className={classes.iconPickerPreview}
                      sx={{ background: `${form.color}22`, color: form.color }}
                    >
                      {(() => {
                        const Selected =
                          (form.iconKey && getIconComponent(form.iconKey)) ||
                          (activeEntity === 'squad' ? DEFAULT_SQUAD_ICON : DEFAULT_TEAM_ICON);
                        return <Selected sx={{ fontSize: 18 }} />;
                      })()}
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
                        {form.iconKey
                          ? `Icon: ${form.iconKey}`
                          : `Default ${activeTab.label.replace(/s$/, '')} icon`}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {iconPickerOpen ? 'Click to collapse' : 'Click to pick from 30 icons'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    className={classes.iconPickerChevron}
                    sx={{
                      transform: iconPickerOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    ▼
                  </Box>
                </Box>

                {iconPickerOpen && (
                  <Box className={classes.iconPickerGrid}>
                    {iconRegistry.map(({ key: iconKey, component: IconComp }) => {
                      const isSelected = form.iconKey === iconKey;
                      return (
                        <Tooltip key={iconKey} title={iconKey} placement='top'>
                          <Box
                            className={`${classes.iconPickerCell} ${
                              isSelected ? classes.iconPickerCellActive : ''
                            }`}
                            onClick={() => {
                              setForm((prev) => ({ ...prev, iconKey }));
                              setIconPickerOpen(false);
                            }}
                          >
                            <IconComp sx={{ fontSize: 18 }} />
                          </Box>
                        </Tooltip>
                      );
                    })}
                  </Box>
                )}
              </Box>
            )}

            {/* Description */}
            <TextField
              label='Description *'
              placeholder='Briefly describe what this entry is for'
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              size='small'
              fullWidth
              multiline
              rows={3}
              className={classes.formField}
            />

            {/* Accent Color — kept as-is per request */}
            <Box>
              <Typography
                sx={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#475569',
                  mb: 0.75,
                  letterSpacing: '0.01em',
                }}
              >
                Accent Color{' '}
                <Box component='span' sx={{ color: '#ef4444' }}>
                  *
                </Box>
              </Typography>
              <Box
                component='label'
                className={classes.accentColorField}
                sx={{
                  borderColor: form.color ? `${form.color}66` : 'rgba(99,102,241,0.25)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                  <Box
                    className={classes.accentColorDot}
                    sx={{
                      background: `linear-gradient(135deg, ${form.color} 0%, ${form.color}cc 100%)`,
                      boxShadow: `0 0 0 1px ${form.color}40, 0 4px 10px ${form.color}55`,
                    }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                    <Typography
                      sx={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#64748b',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Selected
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        fontFamily: 'monospace',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {form.color}
                    </Typography>
                  </Box>
                </Box>

                <Box className={classes.accentColorSwatches}>
                  {colorSwatches.map((color) => (
                    <Box
                      key={color}
                      onClick={() => setForm((prev) => ({ ...prev, color }))}
                      className={
                        form.color === color
                          ? classes.accentColorChipActive
                          : classes.accentColorChip
                      }
                      sx={{ background: color }}
                    />
                  ))}
                </Box>

                <Box component='span' className={classes.accentColorPickerTrigger}>
                  <Box
                    className={classes.accentColorDotLarge}
                    sx={{
                      background: `radial-gradient(circle at 30% 30%, #ffffff 0%, ${form.color} 45%, ${form.color} 100%)`,
                    }}
                  />
                  <input
                    type='color'
                    value={form.color}
                    onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                    className={classes.accentColorPickerInput}
                    aria-label='Pick custom color'
                  />
                </Box>
              </Box>
            </Box>

            {/* Active toggle — kept as-is per request */}
            <Box
              onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
              sx={{
                p: 2,
                borderRadius: 3,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                border: '1.5px solid',
                position: 'relative',
                overflow: 'hidden',
                borderColor: form.isActive ? 'rgba(16,185,129,0.4)' : 'rgba(99,102,241,0.18)',
                background: form.isActive
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.06) 100%)'
                  : 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(8px)',
                boxShadow: form.isActive
                  ? '0 4px 12px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.4)'
                  : '0 1px 3px rgba(0,0,0,0.04)',
                '&:hover': {
                  borderColor: form.isActive ? 'rgba(16,185,129,0.6)' : 'rgba(99,102,241,0.4)',
                  transform: 'translateY(-1px)',
                  boxShadow: form.isActive
                    ? '0 6px 16px rgba(16,185,129,0.18)'
                    : '0 4px 10px rgba(99,102,241,0.1)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: form.isActive
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : '#cbd5e1',
                    boxShadow: form.isActive
                      ? '0 0 0 3px rgba(16,185,129,0.18), 0 0 12px rgba(16,185,129,0.4)'
                      : 'inset 0 1px 2px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: form.isActive ? '#047857' : '#475569',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {form.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.72rem',
                      color: form.isActive ? 'rgba(4,120,87,0.75)' : '#94a3b8',
                      mt: 0.25,
                    }}
                  >
                    {form.isActive
                      ? 'Visible and usable across the app'
                      : 'Hidden from dropdowns and filters'}
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={form.isActive}
                onClick={(e) => e.stopPropagation()}
                onChange={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                size='small'
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#10b981',
                    '&:hover': { background: 'rgba(16,185,129,0.08)' },
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    background: 'linear-gradient(135deg, #10b981, #059669) !important',
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions className={classes.dialogActions}>
          {editingItem && isAdmin && (
            <Button
              onClick={() => {
                handleDelete(editingItem.id);
                closeDialog();
              }}
              sx={{ mr: 'auto' }}
            >
              Delete
            </Button>
          )}
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={onSave} disabled={!form.name.trim() || saving} variant='contained'>
            {saving ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
            {editingItem ? 'Save Changes' : `Create ${activeTab.label.replace(/s$/, '')}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Configurations;
