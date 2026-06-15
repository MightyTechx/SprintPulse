import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@sprintpulse/component';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import BadgeIcon from '@mui/icons-material/Badge';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { constants } from '@sprintpulse/utils';

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onProfile: () => void;
  onLogout: () => void;
  isAdmin: boolean;
  consultantMode?: boolean;
  onSwitchToConsultant?: () => void;
  onSwitchToAdmin?: () => void;
}

const UserMenu = ({
  anchorEl,
  onClose,
  onProfile,
  onLogout,
  isAdmin,
  consultantMode,
  onSwitchToConsultant,
  onSwitchToAdmin,
}: UserMenuProps) => {
  const navigate = useNavigate();
  const { AdminPath, ConsultantPath } = constants;

  const handleSettings = () => {
    onClose();
    navigate(consultantMode ? ConsultantPath.SETTINGS : AdminPath.SETTINGS);
  };

  const handleHelpSupport = () => {
    onClose();
    navigate(consultantMode ? ConsultantPath.HELP_SUPPORT : AdminPath.HELP_SUPPORT);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {isAdmin && !consultantMode && onSwitchToConsultant && (
        <MenuItem onClick={onSwitchToConsultant}>
          <ListItemIcon>
            <BadgeIcon fontSize='small' sx={{ color: '#10b981' }} />
          </ListItemIcon>
          <ListItemText
            sx={{ '& .MuiListItemText-primary': { color: '#10b981', fontWeight: 600 } }}
          >
            Consultant Mode
          </ListItemText>
        </MenuItem>
      )}
      {isAdmin && consultantMode && onSwitchToAdmin && (
        <MenuItem onClick={onSwitchToAdmin}>
          <ListItemIcon>
            <AdminPanelSettingsIcon fontSize='small' sx={{ color: '#6366f1' }} />
          </ListItemIcon>
          <ListItemText
            sx={{ '& .MuiListItemText-primary': { color: '#6366f1', fontWeight: 600 } }}
          >
            Admin Mode
          </ListItemText>
        </MenuItem>
      )}
      <Divider />
      <MenuItem onClick={onProfile}>
        <ListItemIcon>
          <AccountCircleIcon fontSize='small' />
        </ListItemIcon>
        <ListItemText>Your Profile</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleSettings}>
        <ListItemIcon>
          <SettingsIcon fontSize='small' />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleHelpSupport}>
        <ListItemIcon>
          <HelpOutlineIcon fontSize='small' />
        </ListItemIcon>
        <ListItemText>Help & Support</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize='small' />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;
