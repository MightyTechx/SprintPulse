import { useMemo, useState } from 'react';
import { Box, Column, Typography, Chip, Tooltip, IconButton } from '@sprintpulse/component';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import GroupsIcon from '@mui/icons-material/Groups';
import DnsIcon from '@mui/icons-material/Dns';
import FlagIcon from '@mui/icons-material/Flag';
import UpdateIcon from '@mui/icons-material/Update';
import NumbersIcon from '@mui/icons-material/Numbers';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import BoltIcon from '@mui/icons-material/Bolt';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import StarIcon from '@mui/icons-material/Star';
import ShieldIcon from '@mui/icons-material/Shield';
import PetsIcon from '@mui/icons-material/Pets';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import DiamondIcon from '@mui/icons-material/Diamond';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CastleIcon from '@mui/icons-material/Castle';
import HiveIcon from '@mui/icons-material/Hive';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CodeIcon from '@mui/icons-material/Code';
import TerminalIcon from '@mui/icons-material/Terminal';
import BugReportIcon from '@mui/icons-material/BugReport';
import BuildIcon from '@mui/icons-material/Build';
import HandymanIcon from '@mui/icons-material/Handyman';
import ScienceIcon from '@mui/icons-material/Science';
import BiotechIcon from '@mui/icons-material/Biotech';
import MemoryIcon from '@mui/icons-material/Memory';
import CloudIcon from '@mui/icons-material/Cloud';
import RocketIcon from '@mui/icons-material/Rocket';
import SpeedIcon from '@mui/icons-material/Speed';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import {
  useCreateFixVersionMutation,
  useCreateIssueTypeMutation,
  useCreatePriorityMutation,
  useCreateSprintNumberMutation,
  useCreateSquadMutation,
  useCreateStatusMutation,
  useCreateTeamMutation,
  useDeleteFixVersionMutation,
  useDeleteIssueTypeMutation,
  useDeletePriorityMutation,
  useDeleteSprintNumberMutation,
  useDeleteSquadMutation,
  useDeleteStatusMutation,
  useDeleteTeamMutation,
  useGetFixVersionsQuery,
  useGetIssueTypesQuery,
  useGetPrioritiesQuery,
  useGetSprintNumbersQuery,
  useGetSquadsQuery,
  useGetStatusesQuery,
  useGetTeamsQuery,
  useToggleFixVersionMutation,
  useToggleIssueTypeMutation,
  useTogglePriorityMutation,
  useToggleSprintNumberMutation,
  useToggleSquadMutation,
  useToggleStatusMutation,
  useToggleTeamMutation,
  useUpdateFixVersionMutation,
  useUpdateIssueTypeMutation,
  useUpdatePriorityMutation,
  useUpdateSprintNumberMutation,
  useUpdateSquadMutation,
  useUpdateStatusMutation,
  useUpdateTeamMutation,
  ConfigurationItem,
  ConfigEntityKey,
} from '@sprintpulse/services';
import { useAdminKeyframes, useAuth } from '@sprintpulse/hooks';
import { useStyles } from '../styles';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConfigFormState {
  name: string;
  key: string;
  description: string;
  color: string;
  iconKey: string;
  isActive: boolean;
}

export const BLANK_FORM: ConfigFormState = {
  name: '',
  key: '',
  description: '',
  color: '#6366f1',
  iconKey: '',
  isActive: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const toKey = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

// ─── Icon registry (Squads + Teams) ───────────────────────────────────────────

export const ICON_REGISTRY: { key: string; component: React.ComponentType<{ sx?: any }> }[] = [
  { key: 'bolt', component: BoltIcon },
  { key: 'rocket_launch', component: RocketLaunchIcon },
  { key: 'star', component: StarIcon },
  { key: 'shield', component: ShieldIcon },
  { key: 'pets', component: PetsIcon },
  { key: 'whatshot', component: WhatshotIcon },
  { key: 'flash_on', component: FlashOnIcon },
  { key: 'diamond', component: DiamondIcon },
  { key: 'auto_awesome', component: AutoAwesomeIcon },
  { key: 'emoji_objects', component: EmojiObjectsIcon },
  { key: 'local_fire', component: LocalFireDepartmentIcon },
  { key: 'military_tech', component: MilitaryTechIcon },
  { key: 'workspace_premium', component: WorkspacePremiumIcon },
  { key: 'castle', component: CastleIcon },
  { key: 'hive', component: HiveIcon },
  { key: 'sports_kabaddi', component: SportsKabaddiIcon },
  { key: 'sports_mma', component: SportsMmaIcon },
  { key: 'psychology', component: PsychologyIcon },
  { key: 'code', component: CodeIcon },
  { key: 'terminal', component: TerminalIcon },
  { key: 'bug_report', component: BugReportIcon },
  { key: 'build', component: BuildIcon },
  { key: 'handyman', component: HandymanIcon },
  { key: 'science', component: ScienceIcon },
  { key: 'biotech', component: BiotechIcon },
  { key: 'memory', component: MemoryIcon },
  { key: 'cloud', component: CloudIcon },
  { key: 'rocket', component: RocketIcon },
  { key: 'speed', component: SpeedIcon },
  { key: 'track_changes', component: TrackChangesIcon },
];

export const DEFAULT_SQUAD_ICON = GroupsIcon;
export const DEFAULT_TEAM_ICON = GroupIcon;

export const getIconComponent = (key?: string | null) => {
  if (!key) return null;
  const entry = ICON_REGISTRY.find((i) => i.key === key);
  return entry ? entry.component : null;
};

// ─── Tab Definitions ──────────────────────────────────────────────────────────

export interface EntityTabConfig {
  key: ConfigEntityKey;
  label: string;
  icon: React.ComponentType<{ sx?: any }>;
  color: string;
  description: string;
}

export const ENTITY_TABS: EntityTabConfig[] = [
  {
    key: 'squad',
    label: 'Squads',
    icon: GroupsIcon,
    color: '#6366f1',
    description: 'Squad groupings (e.g. Wookies, Wagles) used for board filters and team routing.',
  },
  {
    key: 'team',
    label: 'Teams',
    icon: GroupIcon,
    color: '#06b6d4',
    description: 'Delivery teams (Frontend, Backend, QA…) that own stories and sprints.',
  },
  {
    key: 'issueType',
    label: 'Issue Types',
    icon: DnsIcon,
    color: '#8b5cf6',
    description: 'Ticket classifications — Story, Task, Bug, Epic, Spike and custom types.',
  },
  {
    key: 'status',
    label: 'Statuses',
    icon: FlagIcon,
    color: '#10b981',
    description: 'Workflow statuses shown on the Kanban board columns.',
  },
  {
    key: 'fixVersion',
    label: 'Fix Versions',
    icon: UpdateIcon,
    color: '#f59e0b',
    description: 'Release / fix versions for grouping work that ships together.',
  },
  {
    key: 'sprintNumber',
    label: 'Sprint Numbers',
    icon: NumbersIcon,
    color: '#0ea5e9',
    description: 'Sprint identifiers used for sprint planning and reporting.',
  },
  {
    key: 'priority',
    label: 'Priorities',
    icon: PriorityHighIcon,
    color: '#ef4444',
    description: 'Priority levels for tickets (Highest, High, Medium, Low, Lowest).',
  },
];

// ─── Color swatches for the color picker ──────────────────────────────────────

export const COLOR_SWATCHES: string[] = [
  '#6366f1',
  '#06b6d4',
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#ec4899',
  '#14b8a6',
  '#84cc16',
  '#f97316',
  '#a855f7',
];

// ─── Utils Hook ───────────────────────────────────────────────────────────────

export const useUtils = () => {
  const { classes } = useStyles();
  const keyframes = useAdminKeyframes();
  const { isAdmin, user } = useAuth();

  const [activeEntity, setActiveEntity] = useState<ConfigEntityKey>('squad');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ConfigurationItem | null>(null);
  const [form, setForm] = useState<ConfigFormState>(BLANK_FORM);

  // ── Polling queries (per entity) ──────────────────────────────────────────
  const { data: squads = [] } = useGetSquadsQuery(undefined, { pollingInterval: 30000 });
  const { data: teams = [] } = useGetTeamsQuery(undefined, { pollingInterval: 30000 });
  const { data: issueTypes = [] } = useGetIssueTypesQuery(undefined, { pollingInterval: 30000 });
  const { data: statuses = [] } = useGetStatusesQuery(undefined, { pollingInterval: 30000 });
  const { data: fixVersions = [] } = useGetFixVersionsQuery(undefined, { pollingInterval: 30000 });
  const { data: sprintNumbers = [] } = useGetSprintNumbersQuery(undefined, {
    pollingInterval: 30000,
  });
  const { data: priorities = [] } = useGetPrioritiesQuery(undefined, { pollingInterval: 30000 });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const [createSquad] = useCreateSquadMutation();
  const [updateSquad] = useUpdateSquadMutation();
  const [toggleSquad] = useToggleSquadMutation();
  const [deleteSquad] = useDeleteSquadMutation();

  const [createTeam] = useCreateTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();
  const [toggleTeam] = useToggleTeamMutation();
  const [deleteTeam] = useDeleteTeamMutation();

  const [createIssueType] = useCreateIssueTypeMutation();
  const [updateIssueType] = useUpdateIssueTypeMutation();
  const [toggleIssueType] = useToggleIssueTypeMutation();
  const [deleteIssueType] = useDeleteIssueTypeMutation();

  const [createStatus] = useCreateStatusMutation();
  const [updateStatus] = useUpdateStatusMutation();
  const [toggleStatus] = useToggleStatusMutation();
  const [deleteStatus] = useDeleteStatusMutation();

  const [createFixVersion] = useCreateFixVersionMutation();
  const [updateFixVersion] = useUpdateFixVersionMutation();
  const [toggleFixVersion] = useToggleFixVersionMutation();
  const [deleteFixVersion] = useDeleteFixVersionMutation();

  const [createSprintNumber] = useCreateSprintNumberMutation();
  const [updateSprintNumber] = useUpdateSprintNumberMutation();
  const [toggleSprintNumber] = useToggleSprintNumberMutation();
  const [deleteSprintNumber] = useDeleteSprintNumberMutation();

  const [createPriority] = useCreatePriorityMutation();
  const [updatePriority] = useUpdatePriorityMutation();
  const [togglePriority] = useTogglePriorityMutation();
  const [deletePriority] = useDeletePriorityMutation();

  // ── Data per active entity ────────────────────────────────────────────────
  const data: ConfigurationItem[] = useMemo(() => {
    switch (activeEntity) {
      case 'squad':
        return squads;
      case 'team':
        return teams;
      case 'issueType':
        return issueTypes;
      case 'status':
        return statuses;
      case 'fixVersion':
        return fixVersions;
      case 'sprintNumber':
        return sprintNumbers;
      case 'priority':
        return priorities;
    }
  }, [activeEntity, squads, teams, issueTypes, statuses, fixVersions, sprintNumbers, priorities]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.key.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q),
    );
  }, [data, search]);

  const activeTab = ENTITY_TABS.find((t) => t.key === activeEntity)!;
  const userId = user?.id;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingItem(null);
    setForm({ ...BLANK_FORM, color: activeTab.color, iconKey: '' });
    setDialogOpen(true);
  };

  const openEdit = (item: ConfigurationItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      key: item.key,
      description: item.description,
      color: item.color,
      iconKey: (item as any).iconKey ?? '',
      isActive: item.isActive,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setForm(BLANK_FORM);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const basePayload = {
      name: form.name.trim(),
      key: form.key.trim() || toKey(form.name),
      description: form.description.trim(),
      color: form.color,
      isActive: form.isActive,
    };
    // iconKey is only persisted for Squad and Team (column exists there)
    const iconKeyPayload =
      activeEntity === 'squad' || activeEntity === 'team'
        ? { iconKey: form.iconKey?.trim() || null }
        : {};
    const payload = { ...basePayload, ...iconKeyPayload };
    try {
      switch (activeEntity) {
        case 'squad':
          if (editingItem) {
            await updateSquad({ id: editingItem.id, ...payload, updatedBy: userId }).unwrap();
          } else {
            await createSquad({ ...payload, createdBy: userId }).unwrap();
          }
          break;
        case 'team':
          if (editingItem) {
            await updateTeam({ id: editingItem.id, ...payload, updatedBy: userId }).unwrap();
          } else {
            await createTeam({ ...payload, createdBy: userId }).unwrap();
          }
          break;
        case 'issueType':
          if (editingItem) {
            await updateIssueType({ id: editingItem.id, ...payload, updatedBy: userId }).unwrap();
          } else {
            await createIssueType({ ...payload, createdBy: userId }).unwrap();
          }
          break;
        case 'status':
          if (editingItem) {
            await updateStatus({ id: editingItem.id, ...payload, updatedBy: userId }).unwrap();
          } else {
            await createStatus({ ...payload, createdBy: userId }).unwrap();
          }
          break;
        case 'fixVersion':
          if (editingItem) {
            await updateFixVersion({ id: editingItem.id, ...payload, updatedBy: userId }).unwrap();
          } else {
            await createFixVersion({ ...payload, createdBy: userId }).unwrap();
          }
          break;
        case 'sprintNumber':
          if (editingItem) {
            await updateSprintNumber({
              id: editingItem.id,
              ...payload,
              updatedBy: userId,
            }).unwrap();
          } else {
            await createSprintNumber({ ...payload, createdBy: userId }).unwrap();
          }
          break;
        case 'priority':
          if (editingItem) {
            await updatePriority({ id: editingItem.id, ...payload, updatedBy: userId }).unwrap();
          } else {
            await createPriority({ ...payload, createdBy: userId }).unwrap();
          }
          break;
      }
      closeDialog();
    } catch {
      // Mutation errors are surfaced via the RTK Query cache; close on success only.
    }
  };

  const handleDelete = async (id: number) => {
    try {
      switch (activeEntity) {
        case 'squad':
          await deleteSquad(id).unwrap();
          break;
        case 'team':
          await deleteTeam(id).unwrap();
          break;
        case 'issueType':
          await deleteIssueType(id).unwrap();
          break;
        case 'status':
          await deleteStatus(id).unwrap();
          break;
        case 'fixVersion':
          await deleteFixVersion(id).unwrap();
          break;
        case 'sprintNumber':
          await deleteSprintNumber(id).unwrap();
          break;
        case 'priority':
          await deletePriority(id).unwrap();
          break;
      }
    } catch {
      /* surfaced by RTK Query */
    }
  };

  const handleToggle = (id: number) => {
    switch (activeEntity) {
      case 'squad':
        toggleSquad({ id, updatedBy: userId });
        break;
      case 'team':
        toggleTeam({ id, updatedBy: userId });
        break;
      case 'issueType':
        toggleIssueType({ id, updatedBy: userId });
        break;
      case 'status':
        toggleStatus({ id, updatedBy: userId });
        break;
      case 'fixVersion':
        toggleFixVersion({ id, updatedBy: userId });
        break;
      case 'sprintNumber':
        toggleSprintNumber({ id, updatedBy: userId });
        break;
      case 'priority':
        togglePriority({ id, updatedBy: userId });
        break;
    }
  };

  // ── Table columns for current entity ──────────────────────────────────────
  const columns: Column<ConfigurationItem>[] = useMemo(
    () => [
      {
        id: 'name',
        label: 'Name',
        minWidth: 200,
        sortable: true,
        align: 'left',
        format: (v, row) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: row.color,
                boxShadow: `0 0 0 2px ${row.color}22, 0 2px 6px ${row.color}55`,
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>
                {String(v)}
              </Typography>
              <Typography
                sx={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}
              >
                {row.key}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        id: 'description',
        label: 'Description',
        minWidth: 240,
        sortable: false,
        align: 'left',
        format: (v) => (
          <Typography sx={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
            {v ? String(v) : '—'}
          </Typography>
        ),
      },
      {
        id: 'sortOrder',
        label: 'Order',
        minWidth: 80,
        sortable: true,
        align: 'center',
        format: (v) => (
          <Chip
            size='small'
            label={String(v)}
            sx={{
              height: 22,
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(99,102,241,0.1)',
              color: '#4338ca',
            }}
          />
        ),
      },
      {
        id: 'isActive',
        label: 'Status',
        minWidth: 110,
        sortable: true,
        align: 'center',
        format: (v) => {
          const active = v === true;
          return (
            <Chip
              size='small'
              label={active ? 'Active' : 'Inactive'}
              sx={{
                height: 24,
                fontSize: '0.7rem',
                fontWeight: 700,
                background: active ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.12)',
                color: active ? '#047857' : '#475569',
                border: `1px solid ${active ? 'rgba(16,185,129,0.3)' : 'rgba(100,116,139,0.25)'}`,
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
          <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
            {new Date(String(v)).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Typography>
        ),
      },
      ...(isAdmin
        ? [
            {
              id: 'actions',
              label: 'Actions',
              minWidth: 100,
              sortable: false,
              align: 'center' as const,
              format: (_v: unknown, row: ConfigurationItem) => (
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
                      <EditIcon sx={{ fontSize: 17 }} />
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
                      <DeleteIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              ),
            },
          ]
        : []),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [classes, isAdmin, activeEntity],
  );

  return {
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
    data: filtered,
    rawData: data,
    counts: {
      squad: squads.length,
      team: teams.length,
      issueType: issueTypes.length,
      status: statuses.length,
      fixVersion: fixVersions.length,
      sprintNumber: sprintNumbers.length,
      priority: priorities.length,
    },
    columns,
    openCreate,
    openEdit,
    closeDialog,
    handleSave,
    handleDelete,
    handleToggle,
    entityTabs: ENTITY_TABS,
    colorSwatches: COLOR_SWATCHES,
    iconRegistry: ICON_REGISTRY,
    DEFAULT_SQUAD_ICON,
    DEFAULT_TEAM_ICON,
    getIconComponent,
  };
};
