import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from '@sprintpulse/component';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Link, useLocation } from 'react-router-dom';
import { useAdminMenuItems, useConsultantMenuItems } from './components/MenuItems';
import { Tooltip } from '../../../components';
import { useCollapse, useAuth } from '@sprintpulse/hooks';
import { useStyles } from './styles';
import { useThemeContext } from '@sprintpulse/theme';

// Default admin colors (before theme selection)
const ADMIN_DEFAULT_COLORS = {
  primary: '#6366f1',
  primaryLight: '#a5b4fc',
  primaryDark: '#4f46e5',
  primaryAlpha: 'rgba(99,102,241,',
  sidebarBg: 'linear-gradient(180deg, #0d1b3e 0%, #0f2355 40%, #0a1a3a 100%)',
  sidebarShadow: '4px 0 32px rgba(13,27,62,0.7), inset -1px 0 0 rgba(255,255,255,0.06)',
};

// Default consultant colors (before theme selection)
const CONSULTANT_DEFAULT_COLORS = {
  primary: '#10b981',
  primaryLight: '#6ee7b7',
  primaryDark: '#059669',
  primaryAlpha: 'rgba(16,185,129,',
  sidebarBg: 'linear-gradient(180deg, #052e16 0%, #064e3b 40%, #042f1f 100%)',
  sidebarShadow: '4px 0 32px rgba(5,46,22,0.7), inset -1px 0 0 rgba(255,255,255,0.06)',
};

// Theme-aware colors when a theme is selected
const getThemeColors = (themeName: string, consultantMode: boolean) => {
  const themeMap: Record<
    string,
    {
      primary: string;
      primaryLight: string;
      primaryDark: string;
      primaryAlpha: string;
      sidebarBg: string;
      sidebarShadow: string;
    }
  > = {
    Cobalt: {
      primary: '#4f46e5',
      primaryLight: '#a5b4fc',
      primaryDark: '#3730a3',
      primaryAlpha: 'rgba(79,70,229,',
      sidebarBg: 'linear-gradient(180deg, #312e81 0%, #3730a3 40%, #312e81 100%)',
      sidebarShadow: '4px 0 32px rgba(49,46,129,0.7), inset -1px 0 0 rgba(255,255,255,0.06)',
    },
    Midnight: {
      primary: '#7c3aed',
      primaryLight: '#c4b5fd',
      primaryDark: '#5b21b6',
      primaryAlpha: 'rgba(124,58,237,',
      sidebarBg: 'linear-gradient(180deg, #1e1b4b 0%, #2e1b6e 40%, #1e1b4b 100%)',
      sidebarShadow: '4px 0 32px rgba(30,27,75,0.7), inset -1px 0 0 rgba(255,255,255,0.06)',
    },
    Rose: {
      primary: '#f43f5e',
      primaryLight: '#fda4af',
      primaryDark: '#e11d48',
      primaryAlpha: 'rgba(244,63,94,',
      sidebarBg: 'linear-gradient(180deg, #881337 0%, #9f1239 40%, #881337 100%)',
      sidebarShadow: '4px 0 32px rgba(136,19,55,0.7), inset -1px 0 0 rgba(255,255,255,0.06)',
    },
    Forest: {
      primary: '#059669',
      primaryLight: '#6ee7b7',
      primaryDark: '#065f46',
      primaryAlpha: 'rgba(5,150,105,',
      sidebarBg: 'linear-gradient(180deg, #064e3b 0%, #065f46 40%, #064e3b 100%)',
      sidebarShadow: '4px 0 32px rgba(6,78,59,0.7), inset -1px 0 0 rgba(255,255,255,0.06)',
    },
    Blues: {
      primary: '#0284c7',
      primaryLight: '#7dd3fc',
      primaryDark: '#0369a1',
      primaryAlpha: 'rgba(2,132,199,',
      sidebarBg: 'linear-gradient(180deg, #0369a1 0%, #0284c7 40%, #0369a1 100%)',
      sidebarShadow: '4px 0 32px rgba(3,105,161,0.7), inset -1px 0 0 rgba(255,255,255,0.06)',
    },
    Clean: {
      primary: '#0ea5e9',
      primaryLight: '#7dd3fc',
      primaryDark: '#0284c7',
      primaryAlpha: 'rgba(14,165,233,',
      sidebarBg: 'linear-gradient(180deg, #0369a1 0%, #0ea5e9 40%, #0369a1 100%)',
      sidebarShadow: '4px 0 32px rgba(3,105,161,0.7), inset -1px 0 0 rgba(255,255,255,0.06)',
    },
    'Black and White': {
      primary: '#374151',
      primaryLight: '#d1d5db',
      primaryDark: '#111827',
      primaryAlpha: 'rgba(55,65,81,',
      sidebarBg: 'linear-gradient(180deg, #111827 0%, #1f2937 40%, #111827 100%)',
      sidebarShadow: '4px 0 32px rgba(17,24,39,0.7), inset -1px 0 0 rgba(255,255,255,0.06)',
    },
    Blimey: {
      primary: '#d97706',
      primaryLight: '#fcd34d',
      primaryDark: '#b45309',
      primaryAlpha: 'rgba(217,119,6,',
      sidebarBg: 'linear-gradient(180deg, #92400e 0%, #b45309 40%, #92400e 100%)',
      sidebarShadow: '4px 0 32px rgba(146,64,14,0.7), inset -1px 0 0 rgba(255,255,255,0.06)',
    },
  };

  if (consultantMode) {
    // For consultant mode, always use green tones (even when theme is selected)
    return {
      primary: '#10b981',
      primaryLight: '#6ee7b7',
      primaryDark: '#059669',
      primaryAlpha: 'rgba(16,185,129,',
      sidebarBg: 'linear-gradient(180deg, #052e16 0%, #064e3b 40%, #042f1f 100%)',
      sidebarShadow: '4px 0 32px rgba(5,46,22,0.7), inset -1px 0 0 rgba(255,255,255,0.06)',
    };
  }

  return themeMap[themeName] || ADMIN_DEFAULT_COLORS;
};

// Type for group config
type GroupConfigType = Record<
  string,
  {
    gradient: string;
    labelColor: string;
    border: string;
    glowColor: string;
    dotColor: string;
  }
>;

const SideNav = () => {
  const { cx, classes } = useStyles();
  const { themeName } = useThemeContext();
  const { isConsultantMode, isConsultant } = useAuth();
  const consultantMode = isConsultantMode || isConsultant;

  const adminMenuGroups = useAdminMenuItems();
  const consultantMenuGroups = useConsultantMenuItems();
  const menuGroups = consultantMode ? consultantMenuGroups : adminMenuGroups;

  const { collapsed, toggleCollapse } = useCollapse();
  const location = useLocation();

  // Determine if we should use theme colors (not System/Default for admin)
  const useThemeColor = consultantMode || (themeName && themeName !== 'System');
  const themeColors = useThemeColor
    ? getThemeColors(themeName, consultantMode)
    : consultantMode
      ? CONSULTANT_DEFAULT_COLORS
      : ADMIN_DEFAULT_COLORS;

  // Theme-aware group configs - unified type
  const groupConfig: GroupConfigType = consultantMode
    ? {
        Customer: {
          gradient: `linear-gradient(90deg, ${themeColors.primaryAlpha}33 0%, ${themeColors.primaryAlpha}0a 100%)`,
          labelColor: themeColors.primaryLight,
          border: `${themeColors.primaryAlpha}8c`,
          glowColor: `${themeColors.primaryAlpha}40`,
          dotColor: themeColors.primary,
        },
      }
    : {
        Governance: {
          gradient: `linear-gradient(90deg, ${themeColors.primaryAlpha}33 0%, ${themeColors.primaryAlpha}0a 100%)`,
          labelColor: themeColors.primaryLight,
          border: `${themeColors.primaryAlpha}8c`,
          glowColor: `${themeColors.primaryAlpha}4d`,
          dotColor: themeColors.primary,
        },
        Administration: {
          gradient: `linear-gradient(90deg, ${themeColors.primaryAlpha}2e 0%, ${themeColors.primaryAlpha}0a 100%)`,
          labelColor: themeColors.primaryLight,
          border: `${themeColors.primaryAlpha}8c`,
          glowColor: `${themeColors.primaryAlpha}40`,
          dotColor: themeColors.primary,
        },
        'People & Organizations': {
          gradient: `linear-gradient(90deg, ${themeColors.primaryAlpha}2e 0%, ${themeColors.primaryAlpha}0a 100%)`,
          labelColor: themeColors.primaryLight,
          border: `${themeColors.primaryAlpha}8c`,
          glowColor: `${themeColors.primaryAlpha}40`,
          dotColor: themeColors.primary,
        },
        'Wind Operations': {
          gradient: `linear-gradient(90deg, ${themeColors.primaryAlpha}33 0%, ${themeColors.primaryAlpha}0a 100%)`,
          labelColor: themeColors.primaryLight,
          border: `${themeColors.primaryAlpha}8c`,
          glowColor: `${themeColors.primaryAlpha}4d`,
          dotColor: themeColors.primary,
        },
        Overview: {
          gradient: `linear-gradient(90deg, ${themeColors.primaryAlpha}33 0%, ${themeColors.primaryAlpha}0a 100%)`,
          labelColor: themeColors.primaryLight,
          border: `${themeColors.primaryAlpha}8c`,
          glowColor: `${themeColors.primaryAlpha}4d`,
          dotColor: themeColors.primary,
        },
        People: {
          gradient: `linear-gradient(90deg, ${themeColors.primaryAlpha}33 0%, ${themeColors.primaryAlpha}0a 100%)`,
          labelColor: themeColors.primaryLight,
          border: `${themeColors.primaryAlpha}8c`,
          glowColor: `${themeColors.primaryAlpha}47`,
          dotColor: themeColors.primary,
        },
        Customer: {
          gradient: `linear-gradient(90deg, ${themeColors.primaryAlpha}33 0%, ${themeColors.primaryAlpha}0a 100%)`,
          labelColor: themeColors.primaryLight,
          border: `${themeColors.primaryAlpha}8c`,
          glowColor: `${themeColors.primaryAlpha}47`,
          dotColor: themeColors.primary,
        },
        'Energy Finance': {
          gradient: `linear-gradient(90deg, ${themeColors.primaryAlpha}2e 0%, ${themeColors.primaryAlpha}0a 100%)`,
          labelColor: themeColors.primaryLight,
          border: `${themeColors.primaryAlpha}8c`,
          glowColor: `${themeColors.primaryAlpha}40`,
          dotColor: themeColors.primary,
        },
        Reports: {
          gradient: `linear-gradient(90deg, ${themeColors.primaryAlpha}2e 0%, ${themeColors.primaryAlpha}0a 100%)`,
          labelColor: themeColors.primaryLight,
          border: `${themeColors.primaryAlpha}80`,
          glowColor: `${themeColors.primaryAlpha}38`,
          dotColor: themeColors.primary,
        },
        Configuration: {
          gradient: `linear-gradient(90deg, ${themeColors.primaryAlpha}33 0%, ${themeColors.primaryAlpha}0a 100%)`,
          labelColor: themeColors.primaryLight,
          border: `${themeColors.primaryAlpha}80`,
          glowColor: `${themeColors.primaryAlpha}38`,
          dotColor: themeColors.primary,
        },
      };

  // Get default config for fallback
  const defaultConfig = {
    gradient: `linear-gradient(90deg, ${themeColors.primaryAlpha}33 0%, ${themeColors.primaryAlpha}0a 100%)`,
    labelColor: themeColors.primaryLight,
    border: `${themeColors.primaryAlpha}8c`,
    glowColor: `${themeColors.primaryAlpha}4d`,
    dotColor: themeColors.primary,
  };

  return (
    <Drawer
      variant='permanent'
      className={cx(classes.drawer, collapsed ? classes.drawerCollapsed : '')}
      sx={{
        '& .MuiDrawer-paper': {
          background: themeColors.sidebarBg,
          boxShadow: themeColors.sidebarShadow,
        },
      }}
    >
      {/* Collapse toggle */}
      <Box className={collapsed ? classes.toggleButtonCenter : classes.toggleButtonRight}>
        <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement='right'>
          <IconButton onClick={toggleCollapse}>
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Scrollable nav area */}
      <Box className={classes.navScrollArea}>
        <List className={classes.navList}>
          {menuGroups.map((group, groupIdx) => {
            const cfg = groupConfig[group.group] ?? defaultConfig;

            // Skip section header if group label is empty
            const showSectionHeader = group.group !== '';

            return (
              <Box key={group.group} className={classes.navGroupBox}>
                {/* Section header */}
                {showSectionHeader && !collapsed ? (
                  <Box
                    className={classes.sectionHeaderExpanded}
                    sx={{
                      mt: groupIdx === 0 ? 1 : 2.5,
                      mb: '15px',
                      background: cfg.gradient,
                      borderLeft: `3px solid ${cfg.border}`,
                      boxShadow: `0 2px 12px ${cfg.glowColor}`,
                    }}
                  >
                    <Box
                      className={classes.sectionGroupDot}
                      sx={{
                        background: cfg.dotColor,
                        boxShadow: `0 0 8px ${cfg.dotColor}, 0 0 14px ${cfg.dotColor}88`,
                      }}
                    />
                    <Typography
                      className={classes.sectionGroupLabel}
                      sx={{
                        color: cfg.labelColor,
                        textShadow: `0 0 12px ${cfg.labelColor}88`,
                      }}
                    >
                      {group.group}
                    </Typography>
                  </Box>
                ) : showSectionHeader ? (
                  <Tooltip title={group.group} placement='right' arrow>
                    <Box
                      className={classes.sectionDividerCollapsed}
                      sx={{
                        mt: groupIdx === 0 ? 1 : 2,
                        mb: 0.75,
                        background: `linear-gradient(90deg, ${cfg.border}, transparent)`,
                        boxShadow: `0 0 8px ${cfg.glowColor}`,
                      }}
                    />
                  </Tooltip>
                ) : null}

                {/* Nav items */}
                {group.items.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(`${item.path}/`));

                  return (
                    <Tooltip
                      key={item.label}
                      title={collapsed ? item.label : ''}
                      placement='right'
                      arrow
                    >
                      <Box>
                        <ListItem
                          component={item.path ? Link : 'div'}
                          to={item.path || ''}
                          className={cx(classes.listItem, isActive ? classes.activeItem : '')}
                        >
                          <ListItemIcon
                            className={cx(
                              classes.icon,
                              collapsed ? classes.iconMarginCollapsed : classes.iconMarginExpanded,
                            )}
                          >
                            {item.icon}
                          </ListItemIcon>
                          {!collapsed && (
                            <ListItemText primary={item.label} className={classes.text} />
                          )}
                        </ListItem>
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default SideNav;
