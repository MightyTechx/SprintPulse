import React, { ReactNode } from 'react';
import {
  Box,
  Loader,
  DataTable,
  Typography,
  Tabs,
  Divider,
  TextField,
  InputAdornment,
} from '@infygen/component';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import { useAdminKeyframes } from '@infygen/hooks';
import { useStyles } from './styles/AdminPageShell.styles';
import TabPanel from '@infygen/component/TabPanel';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ShellStatCard {
  label: string;
  value: number;
  Icon: React.ElementType;
  color: string;
  tabIndex: number;
  isDraft?: boolean;
  cls?: string;
  sub1: number;
  sub1Label: string;
  sub1Color: string;
  sub2: number;
  sub2Label: string;
  sub2Color: string;
}

export interface ShellTabPanel {
  index: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  /** When true, passes data through getFilteredData before rendering (default: true) */
  applyFilter?: boolean;
  emptyIcon?: React.ElementType;
  emptyText?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (row: any) => void;
  activeRowKey?: string | number;
}

export interface AdminPageShellProps {
  /** 'table' = stat cards + tabs + data table  |  'hero' = hero banner + children */
  mode: 'table' | 'hero';
  isLoading?: boolean;

  // ── table mode ─────────────────────────────────────────────────────────────
  title?: string;
  description?: string;
  /** Full CSS gradient string for the page header background */
  headerGradient?: string;
  /** box-shadow for the page header */
  headerBoxShadow?: string;
  statCards?: ShellStatCard[];
  /** sx gridTemplateColumns override for the stat cards grid */
  statGridCols?: object;
  tabs?: ReactNode;
  tabValue?: number;
  onTabChange?: (v: number) => void;
  search?: string;
  onSearchChange?: (s: string) => void;
  tabPanels?: ShellTabPanel[];
  /** Accent colour applied to: tab selected state, search field border/focus */
  accentColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFilteredData?: (data: any[]) => any[];
  emptyIcon?: React.ElementType;
  /** Slot for dialogs or other extras rendered outside the container Box */
  extras?: ReactNode;

  // ── hero mode ──────────────────────────────────────────────────────────────
  heroGradient?: string;
  heroBoxShadow?: string;
  heroIcon?: React.ElementType;
  heroTitle?: string;
  heroSubtitle?: string;
  heroIconBg?: string;
  heroIconShadow?: string;
  /** Card sections (or anything else) rendered below the hero banner */
  children?: ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

const HeroIconWrapper: React.FC<{ icon: React.ElementType }> = ({ icon: Icon }) => {
  const IconComponent = Icon as React.ComponentType<{ sx?: object }>;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <IconComponent sx={{ fontSize: 24, color: '#fff' } as object} />
    </Box>
  );
};

const StatIconWrapper: React.FC<{ icon: React.ElementType; color: string }> = ({
  icon: Icon,
  color,
}) => {
  const IconComponent = Icon as React.ComponentType<{ sx?: object }>;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <IconComponent sx={{ fontSize: '1.2rem', color } as object} />
    </Box>
  );
};

const EmptyIconWrapper: React.FC<{ icon: React.ElementType; color: string }> = ({
  icon: Icon,
  color,
}) => {
  const IconComponent = Icon as React.ComponentType<{ sx?: object }>;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <IconComponent sx={{ fontSize: 48, color } as object} />
    </Box>
  );
};

const AdminPageShell = ({
  mode,
  isLoading = false,

  // table
  title,
  description,
  headerGradient = 'linear-gradient(135deg, #0f172a 0%, #134e4a 30%, #0f766e 65%, #14b8a6 100%)',
  headerBoxShadow = '0 24px 64px rgba(15,118,110,0.28), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
  statCards = [],
  statGridCols,
  tabs,
  tabValue = 0,
  onTabChange,
  search = '',
  onSearchChange,
  tabPanels = [],
  accentColor = '#0f766e',
  getFilteredData,
  emptyIcon: EmptyIcon = GroupIcon,
  extras,

  // hero
  heroGradient = 'linear-gradient(135deg, #0f172a 0%, #134e4a 55%, #14b8a6 100%)',
  heroBoxShadow = '0 8px 32px rgba(20,184,166,0.3)',
  heroIcon: HeroIcon,
  heroTitle,
  heroSubtitle,
  heroIconBg = 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
  heroIconShadow = '0 8px 24px rgba(20,184,166,0.4)',
  children,
}: AdminPageShellProps) => {
  const { classes, cx } = useStyles();
  const keyframes = useAdminKeyframes();

  if (isLoading) {
    return <Loader />;
  }

  // ── Hero (cards) mode ──────────────────────────────────────────────────────
  if (mode === 'hero') {
    return (
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        {/* Hero banner */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 3,
            py: 2.5,
            background: heroGradient,
            boxShadow: heroBoxShadow,
            borderRadius: '16px',
            mb: 3,
          }}
        >
          {HeroIcon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                background: heroIconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: heroIconShadow,
                flexShrink: 0,
              }}
            >
              <HeroIconWrapper icon={HeroIcon} />
            </Box>
          )}
          <Box>
            {heroTitle && (
              <Typography
                sx={{
                  color: '#f1f5f9',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {heroTitle}
              </Typography>
            )}
            {heroSubtitle && (
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
                {heroSubtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {children}
      </Box>
    );
  }

  // ── Table mode ─────────────────────────────────────────────────────────────
  const resolveData = (panel: ShellTabPanel) => {
    const applyFilter = panel.applyFilter !== false;
    if (applyFilter && getFilteredData) return getFilteredData(panel.data);
    return panel.data;
  };

  return (
    <>
      {keyframes}
      <Box className={classes.container}>
        {/* Page header */}
        <Box
          className={classes.pageHeader}
          sx={{
            background: headerGradient,
            boxShadow: headerBoxShadow,
          }}
        >
          <Box className={classes.headerOrb3} />
          <Box className={classes.pageHeaderRow}>
            <Typography variant='h5' className={classes.title}>
              {title}
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            {description}
          </Typography>
        </Box>

        {/* Stat cards */}
        {statCards.length > 0 && (
          <Box
            className={classes.statsGrid}
            sx={statGridCols ? { gridTemplateColumns: statGridCols } : undefined}
          >
            {statCards.map(
              ({
                label,
                value,
                Icon,
                cls,
                color,
                tabIndex,
                isDraft,
                sub1,
                sub1Label,
                sub1Color,
                sub2,
                sub2Label,
                sub2Color,
              }) => {
                const isActive = tabValue === tabIndex;
                return (
                  <Box
                    key={label}
                    className={`${classes.statCard}${cls ? ` ${(classes as Record<string, string>)[cls] ?? cls}` : ''}`}
                    onClick={() => {
                      onTabChange?.(tabIndex);
                      onSearchChange?.('');
                    }}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      opacity: isDraft ? 0.72 : 1,
                      outline: isActive ? `2px solid ${color}` : 'none',
                      outlineOffset: 2,
                      transform: isActive ? 'translateY(-6px)' : undefined,
                      boxShadow: isActive
                        ? `0 16px 40px ${color}30, 0 4px 16px ${color}18`
                        : undefined,
                    }}
                  >
                    <Box className={classes.statCardTop} sx={{ flex: 1, alignItems: 'flex-start' }}>
                      <Box>
                        <Typography className={classes.statValue} sx={{ color }}>
                          {value}
                        </Typography>
                        <Typography
                          className={classes.statLabel}
                          sx={{ minHeight: '2.2em', display: 'block' }}
                        >
                          {label}
                        </Typography>
                      </Box>
                      <Box
                        className={classes.statIconWrap}
                        sx={{ background: `${color}14`, border: `1.5px solid ${color}28` }}
                      >
                        <StatIconWrapper icon={Icon} color={color} />
                      </Box>
                    </Box>
                    <Divider className={classes.statDivider} />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          flex: '1 1 0',
                          minWidth: 0,
                        }}
                      >
                        <Box
                          className={classes.statSubDot}
                          sx={{
                            background: sub1Color,
                            boxShadow: `0 0 6px ${sub1Color}`,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          className={classes.statSub}
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          <span style={{ color: sub1Color, fontWeight: 700 }}>{sub1}</span>
                          {` ${sub1Label}`}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          flex: '1 1 0',
                          minWidth: 0,
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Box
                          className={classes.statSubDot}
                          sx={{
                            background: sub2Color,
                            boxShadow: `0 0 6px ${sub2Color}`,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          className={classes.statSub}
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          <span style={{ color: sub2Color, fontWeight: 700 }}>{sub2}</span>
                          {` ${sub2Label}`}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              },
            )}
          </Box>
        )}

        {/* Tabs + Search */}
        {tabs && (
          <Box
            className={classes.tabsBox}
            sx={{
              borderColor: `${accentColor}14`,
              '& .MuiTab-root.Mui-selected': {
                color: accentColor,
                background: `${accentColor}15`,
                boxShadow: `0 2px 10px ${accentColor}24`,
              },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: `${accentColor}30` },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: `${accentColor}66` },
            }}
          >
            <Tabs
              value={tabValue}
              onChange={(_, v) => {
                onTabChange?.(v);
                onSearchChange?.('');
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
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className={classes.searchField}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& .MuiOutlinedInput-notchedOutline': { border: `1px solid ${accentColor}30` },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: `1px solid ${accentColor}66`,
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 3px ${accentColor}1a`,
                    '& .MuiOutlinedInput-notchedOutline': { border: `1px solid ${accentColor}` },
                  },
                },
                '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: `${accentColor}99` },
              }}
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
        )}

        {/* Tab panels */}
        {tabPanels.map((panel) => {
          const rows = resolveData(panel);
          const PanelEmptyIcon = panel.emptyIcon ?? EmptyIcon;
          const emptyText =
            panel.emptyText ?? (search ? 'No matching records' : 'No records found');
          return (
            <TabPanel key={panel.index} value={tabValue} index={panel.index}>
              {rows.length === 0 ? (
                <Box
                  className={classes.emptyState}
                  sx={{
                    borderColor: `${accentColor}26`,
                    '& .emptyIcon': { color: `${accentColor}4d` },
                  }}
                >
                  <EmptyIconWrapper icon={PanelEmptyIcon} color={`${accentColor}4d`} />
                  <Typography variant='h6' color='text.secondary'>
                    {emptyText}
                  </Typography>
                </Box>
              ) : (
                <Box className={classes.tableContainer} sx={{ borderColor: `${accentColor}10` }}>
                  <DataTable
                    columns={panel.columns}
                    data={rows}
                    rowKey='id'
                    searchable={false}
                    initialRowsPerPage={10}
                    onRowClick={panel.onRowClick}
                    activeRowKey={panel.activeRowKey}
                  />
                </Box>
              )}
            </TabPanel>
          );
        })}
      </Box>

      {extras}
    </>
  );
};

export default AdminPageShell;
