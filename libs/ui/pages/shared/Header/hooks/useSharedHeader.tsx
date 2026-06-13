import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { constants } from '@infygen/utils';
import { useAuth, useLoader } from '@infygen/hooks';
import { useAuthActionMutation } from '@infygen/services';
import { IAuthUser } from '@infygen/interfaces';

export interface NotificationItem {
  id: string;
  type: 'role-request' | 'onboarding';
  name: string;
  subtitle: string;
  createdAt?: string;
  navigateTo: string;
  color: string;
  status?: 'under_review' | 'pending' | 'approved' | 'rejected';
  rawUser?: IAuthUser;
}

export const useSharedHeader = () => {
  const navigate = useNavigate();
  const { AdminPath, AuthPath, ConsultantPath } = constants;
  const {
    user,
    isAdmin,
    isConsultant,
    isConsultantMode,
    logout,
    enterConsultantMode,
    exitConsultantMode,
  } = useAuth();
  const [authAction] = useAuthActionMutation();
  const { show: showLoader, hide: hideLoader } = useLoader();

  const consultantMode = isConsultantMode || isConsultant;

  // Menus
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = useCallback(async () => {
    const items: NotificationItem[] = [];
    if (!consultantMode) {
      try {
        const res = await authAction({ action: 'get-pending-role-requests' }).unwrap();
        const users: IAuthUser[] = res.data || [];
        users.forEach((u) => {
          items.push({
            id: `role-${u.id}`,
            type: 'role-request',
            name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown',
            subtitle:
              u.requestedRole === 'admin' ? 'Admin Access Request' : 'Consultant Access Request',
            createdAt: u.createdAt,
            navigateTo: AdminPath.ACCESS_MANAGEMENT,
            color: u.requestedRole === 'admin' ? '#6366f1' : '#0ea5e9',
            rawUser: u,
          });
        });
      } catch {
        /* non-critical */
      }
    }
    setNotifications(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authAction, consultantMode]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const userName =
    user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';

  // Menu handlers
  const handleSettingsOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleSettingsClose = () => setAnchorEl(null);
  const handleNotifOpen = () => setNotifOpen(true);
  const handleNotifClose = () => setNotifOpen(false);

  const handleNotifClick = () => {
    handleNotifClose();
    navigate(AdminPath.ACCESS_MANAGEMENT);
  };

  const handleNotifItemClick = useCallback(
    (item: NotificationItem) => {
      handleNotifClose();
      navigate(item.navigateTo);
    },
    [navigate],
  );

  // Navigation handlers
  const handleLogout = () => {
    handleSettingsClose();
    logout();
    navigate(AuthPath.SIGNIN);
  };

  const handleProfile = () => {
    handleSettingsClose();
    navigate(AdminPath.PROFILE);
  };

  const handleSwitchToConsultant = async () => {
    handleSettingsClose();
    showLoader('Switching to Consultant Mode…');
    await new Promise((resolve) => setTimeout(resolve, 4000));
    enterConsultantMode();
    navigate(ConsultantPath.DASHBOARD);
    hideLoader();
  };

  const handleSwitchToAdmin = async () => {
    handleSettingsClose();
    showLoader('Switching to Admin Mode…');
    await new Promise((resolve) => setTimeout(resolve, 4000));
    exitConsultantMode();
    navigate(AdminPath.DASHBOARD);
    hideLoader();
  };

  const handleLogoClick = () => {
    if (consultantMode) {
      navigate(ConsultantPath.DASHBOARD);
    } else {
      navigate(AdminPath.DASHBOARD);
    }
  };

  return {
    // State
    user,
    isAdmin,
    isConsultant,
    isConsultantMode,
    consultantMode,
    userName,
    anchorEl,
    notifOpen,
    notifications,
    // Handlers
    handleSettingsOpen,
    handleSettingsClose,
    handleNotifOpen,
    handleNotifClose,
    handleNotifClick,
    handleNotifItemClick,
    refreshNotifications: fetchNotifications,
    handleLogout,
    handleProfile,
    handleLogoClick,
    handleSwitchToConsultant,
    handleSwitchToAdmin,
  };
};
