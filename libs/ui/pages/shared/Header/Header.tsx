import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Badge,
  Box,
  Chip,
  IconButton,
  Toolbar,
  useTheme,
  Menu,
  MenuItem,
  Typography,
} from '@sprintpulse/component';
import { useMediaQuery } from '@sprintpulse/hooks';
import { Tooltip } from '../../../components';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AddIcon from '@mui/icons-material/Add';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useStyles } from './styles/Header.styles';
import { useSharedHeader } from './hooks/useSharedHeader';
import LogoMark from './components/LogoMark';
import NotificationsMenu from './components/NotificationsMenu';
import UserMenu from './components/UserMenu';
import ChatDialog from '../../../components/ChatDialog/ChatDialog';
import { useThemeContext } from '@sprintpulse/theme';
import { constants } from '@sprintpulse/utils';

// Default admin colors (before theme selection)
const ADMIN_DEFAULT_COLORS = {
  appBarBg: 'linear-gradient(135deg, #0d1b3e 0%, #0f2355 45%, #1a3a6b 100%)',
  chipBg: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(79,70,229,0.25))',
  chipColor: '#c7d2fe',
  chipBorder: 'rgba(99,102,241,0.4)',
  chipIconColor: '#a5b4fc',
};

// Default consultant colors (before theme selection)
const CONSULTANT_DEFAULT_COLORS = {
  appBarBg: 'linear-gradient(135deg, #052e16 0%, #064e3b 45%, #065f46 100%)',
  chipBg: 'linear-gradient(135deg, rgba(16,185,129,0.35), rgba(5,150,105,0.25))',
  chipColor: '#6ee7b7',
  chipBorder: 'rgba(16,185,129,0.45)',
  chipIconColor: '#34d399',
};

// Theme-aware colors when a theme is selected
const getThemeColors = (themeName: string, consultantMode: boolean) => {
  if (consultantMode) {
    return {
      appBarBg: 'linear-gradient(135deg, #052e16 0%, #064e3b 45%, #065f46 100%)',
      chipBg: 'linear-gradient(135deg, rgba(16,185,129,0.35), rgba(5,150,105,0.25))',
      chipColor: '#6ee7b7',
      chipBorder: 'rgba(16,185,129,0.45)',
      chipIconColor: '#34d399',
    };
  }

  const themeMap: Record<string, { primary: string; primaryLight: string; primaryDark: string }> = {
    Cobalt: { primary: '#4f46e5', primaryLight: '#a5b4fc', primaryDark: '#3730a3' },
    Midnight: { primary: '#7c3aed', primaryLight: '#c4b5fd', primaryDark: '#5b21b6' },
    Rose: { primary: '#f43f5e', primaryLight: '#fda4af', primaryDark: '#e11d48' },
    Forest: { primary: '#059669', primaryLight: '#6ee7b7', primaryDark: '#065f46' },
    Blues: { primary: '#0284c7', primaryLight: '#7dd3fc', primaryDark: '#0369a1' },
    Clean: { primary: '#0ea5e9', primaryLight: '#7dd3fc', primaryDark: '#0284c7' },
    'Black and White': { primary: '#374151', primaryLight: '#d1d5db', primaryDark: '#111827' },
    Blimey: { primary: '#d97706', primaryLight: '#fcd34d', primaryDark: '#b45309' },
  };

  const colors = themeMap[themeName] || {
    primary: '#6366f1',
    primaryLight: '#a5b4fc',
    primaryDark: '#4f46e5',
  };

  return {
    appBarBg: `linear-gradient(135deg, ${colors.primaryDark}dd 0%, ${colors.primary}aa 45%, ${colors.primary}80 100%)`,
    chipBg: `linear-gradient(135deg, ${colors.primary}59 0%, ${colors.primary}40 100%)`,
    chipColor: colors.primaryLight,
    chipBorder: `${colors.primary}66`,
    chipIconColor: colors.primaryLight,
  };
};

const Header = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { themeName } = useThemeContext();
  const navigate = useNavigate();
  const { AdminPath } = constants;

  const [chatOpen, setChatOpen] = useState(false);
  const [createAnchor, setCreateAnchor] = useState<null | HTMLElement>(null);

  const handleCreateOpen = (e: React.MouseEvent<HTMLElement>) => {
    setCreateAnchor(e.currentTarget);
  };
  const handleCreateClose = () => {
    setCreateAnchor(null);
  };
  const handleCreateNavigate = (path: string) => () => {
    handleCreateClose();
    navigate(path);
  };

  const {
    isAdmin,
    consultantMode,
    anchorEl,
    notifOpen,
    notifications,
    handleSettingsOpen,
    handleSettingsClose,
    handleNotifOpen,
    handleNotifClose,
    handleNotifClick,
    handleNotifItemClick,
    refreshNotifications,
    handleLogout,
    handleProfile,
    handleLogoClick,
    handleSwitchToConsultant,
    handleSwitchToAdmin,
  } = useSharedHeader();

  // Use default colors for admin/consultant when no theme is selected (System), otherwise use theme colors
  const useThemeColor = consultantMode || (themeName && themeName !== 'System');
  const colors = useThemeColor
    ? getThemeColors(themeName, consultantMode)
    : consultantMode
      ? CONSULTANT_DEFAULT_COLORS
      : ADMIN_DEFAULT_COLORS;

  const handleChatOpen = () => {
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
  };

  // Listen for external chat open events
  useEffect(() => {
    const handleOpenChatBot = () => {
      setChatOpen(true);
    };

    window.addEventListener('openChatBot', handleOpenChatBot);
    return () => {
      window.removeEventListener('openChatBot', handleOpenChatBot);
    };
  }, []);

  return (
    <>
      <NotificationsMenu
        open={notifOpen}
        onClose={handleNotifClose}
        onViewAll={handleNotifClick}
        onItemClick={handleNotifItemClick}
        notifications={notifications}
        onRefresh={refreshNotifications}
      />
      <ChatDialog open={chatOpen} onClose={handleChatClose} />
      <AppBar
        position='fixed'
        className={classes.headerAppbar}
        sx={{ background: colors.appBarBg }}
      >
        <Toolbar className={classes.headerToolbar}>
          {/* Logo */}
          <Box className={classes.desktopLogoArea} onClick={handleLogoClick}>
            <LogoMark compact={isMobile} />
          </Box>

          <Box className={classes.logoDivider} />

          {/* Chip + Bell — side by side after logo */}
          <Chip
            className={classes.adminChip}
            icon={
              consultantMode ? (
                <BadgeIcon sx={{ fontSize: '15px !important' }} />
              ) : (
                <AdminPanelSettingsIcon sx={{ fontSize: 15 }} />
              )
            }
            label={consultantMode ? 'CONSULTANT' : 'ADMIN'}
            size='small'
            sx={{
              background: `${colors.chipBg} !important`,
              color: `${colors.chipColor} !important`,
              border: `1px solid ${colors.chipBorder} !important`,
              '& .MuiChip-icon': { color: `${colors.chipIconColor} !important` },
            }}
          />

          <Tooltip title='Notifications' placement='bottom' arrow>
            <IconButton
              onClick={() => handleNotifOpen()}
              size='small'
              className={classes.iconBtnBase}
            >
              <Badge badgeContent={notifications.length} color='error' max={99}>
                <NotificationsIcon sx={{ fontSize: '1.25rem' }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Box className={classes.headerRightSpacer} />

          {/* Create (Ticket / Incident) */}
          <Tooltip title='Create New' placement='bottom' arrow>
            <IconButton
              size='small'
              className={classes.iconBtnBase}
              onClick={handleCreateOpen}
              aria-haspopup='true'
              aria-expanded={createAnchor ? 'true' : undefined}
              sx={{
                padding: 0,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)',
                },
              }}
            >
              <AddIcon className={classes.icon} />
            </IconButton>
          </Tooltip>

          {/* Create Menu Dropdown */}
          <Menu
            anchorEl={createAnchor}
            open={Boolean(createAnchor)}
            onClose={handleCreateClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 240,
                  background:
                    'linear-gradient(160deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.45)',
                  borderRadius: 2.5,
                  overflow: 'hidden',
                  color: '#fff',
                },
              },
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.25,
                background:
                  'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(124,58,237,0.12) 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <AddIcon sx={{ fontSize: 16, color: '#a5b4fc' }} />
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0' }}>
                CREATE NEW
              </Typography>
            </Box>
            <MenuItem
              onClick={handleCreateNavigate(AdminPath.CREATE_TICKET)}
              sx={{
                py: 1.25,
                px: 2,
                gap: 1.5,
                transition: 'all 0.18s ease',
                '&:hover': { background: 'rgba(79,70,229,0.18)' },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(79,70,229,0.4)',
                  flexShrink: 0,
                }}
              >
                <ConfirmationNumberIcon sx={{ fontSize: 16, color: '#fff' }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>
                  Create Ticket
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'rgba(226,232,240,0.65)' }}>
                  Jira-style story, task, bug
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem
              onClick={handleCreateNavigate(AdminPath.CREATE_INCIDENT)}
              sx={{
                py: 1.25,
                px: 2,
                gap: 1.5,
                transition: 'all 0.18s ease',
                '&:hover': { background: 'rgba(239,68,68,0.18)' },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(239,68,68,0.4)',
                  flexShrink: 0,
                }}
              >
                <ReportProblemIcon sx={{ fontSize: 16, color: '#fff' }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>
                  Create Incident
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'rgba(226,232,240,0.65)' }}>
                  Log & track incident reports
                </Typography>
              </Box>
            </MenuItem>
          </Menu>

          {/* AI Chat */}
          <Tooltip title='AI Assistant' placement='bottom' arrow>
            <IconButton size='small' className={classes.iconBtnBase} onClick={handleChatOpen}>
              <SmartToyIcon className={classes.icon} />
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title='Settings' placement='bottom' arrow>
            <IconButton size='small' className={classes.iconBtnBase} onClick={handleSettingsOpen}>
              <SettingsIcon className={classes.icon} />
            </IconButton>
          </Tooltip>

          <UserMenu
            anchorEl={anchorEl}
            onClose={handleSettingsClose}
            onProfile={handleProfile}
            onLogout={handleLogout}
            isAdmin={isAdmin}
            consultantMode={consultantMode}
            onSwitchToConsultant={handleSwitchToConsultant}
            onSwitchToAdmin={handleSwitchToAdmin}
          />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
