import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Badge, Box, Chip, IconButton, Toolbar, useTheme } from '@sprintpulse/component';
import { useMediaQuery } from '@sprintpulse/hooks';
import { Tooltip } from '../../../components';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AddIcon from '@mui/icons-material/Add';
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

          {/* Create Operations */}
          <Tooltip title='Create Operations' placement='bottom' arrow>
            <IconButton
              size='small'
              className={classes.iconBtnBase}
              onClick={() => navigate(AdminPath.CREATE_OPERATIONS)}
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
