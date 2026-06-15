import { lazy } from 'react';

export const LazyMenuItems = {
  // Admin pages - available components
  AdminDashboardPage: lazy(() => import('@sprintpulse/pages/admin/Dashboard')),
  AdminSprintDetailPage: lazy(() =>
    import('@sprintpulse/pages/admin/Dashboard').then((m) => ({ default: m.SprintDetailPage })),
  ),
  AdminTicketDetailPage: lazy(() =>
    import('@sprintpulse/pages/admin/Dashboard').then((m) => ({ default: m.TicketDetailPage })),
  ),
  AdminSprintStatusMatrixPage: lazy(() =>
    import('@sprintpulse/pages/admin/Dashboard').then((m) => ({ default: m.SprintStatusMatrixPage })),
  ),
  AdminPeopleManagementPage: lazy(() => import('@sprintpulse/pages/admin/People/PeopleManagement')),
  AdminUserDetailPage: lazy(() => import('@sprintpulse/pages/admin/People/UserDetail')),
  AdminProfilePage: lazy(() => import('@sprintpulse/pages/shared/Profile')),
  AdminReportsPage: lazy(() => import('@sprintpulse/pages/admin/Reports')),
  AdminTechnicalDocumentsPage: lazy(() => import('@sprintpulse/pages/admin/TechnicalDocuments')),
  SettingsPage: lazy(() => import('@sprintpulse/pages/shared/Settings')),
  HelpSupportPage: lazy(() => import('@sprintpulse/pages/shared/HelpSupport')),
  AdminOperationsPage: lazy(() => import('@sprintpulse/pages/admin/Operations')),
  AdminCreateTicketPage: lazy(
    () => import('@sprintpulse/pages/admin/Tickets/components/CreateTicket'),
  ),
  AdminCreateIncidentPage: lazy(
    () => import('@sprintpulse/pages/admin/Incidents/components/CreateIncident'),
  ),
  AdminFeatureFlagsPage: lazy(() => import('@sprintpulse/pages/admin/FeatureFlags')),
  AdminConfigurationsPage: lazy(() => import('@sprintpulse/pages/admin/Configurations')),

  // Auth pages (shared/public)
  SignInPage: lazy(() => import('@sprintpulse/pages/shared/SignIn')),
  SignUpPage: lazy(() => import('@sprintpulse/pages/shared/SignUp')),
  ForgotPasswordPage: lazy(() => import('@sprintpulse/pages/shared/ForgotPassword')),

  // Layout components
  HeaderPage: lazy(() => import('@sprintpulse/pages/shared/Header')),
  SideNavPage: lazy(() => import('@sprintpulse/pages/shared/SideNav')),

  // NotFound page (shared component)
  NotFoundPage: lazy(() => import('../../../../libs/ui/components/NotFound')),
};
