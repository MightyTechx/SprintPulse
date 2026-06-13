const ADMIN_BASE = '/app/admin';
const USER_BASE = '/app/user';
const CONSULTANT_BASE = '/app/consultant';

const AdminPath = {
  DASHBOARD: `${ADMIN_BASE}/dashboard`,
  ACCESS_MANAGEMENT: `${ADMIN_BASE}/people-management/access`,
  TURBINE_DETAIL: `${ADMIN_BASE}/dashboard/turbine/:id`,
  FLEET_STATUS_MATRIX: `${ADMIN_BASE}/fleet-status-matrix`,
  PROFILE: `${ADMIN_BASE}/profile`,
  ANALYTICS: `${ADMIN_BASE}/analytics`,
  REPORTS: `${ADMIN_BASE}/reports`,
  TECHNICAL_DOCUMENTS: `${ADMIN_BASE}/technical-documents`,
  SETTINGS: `${ADMIN_BASE}/settings`,
  HELP_SUPPORT: `${ADMIN_BASE}/help-support`,
  USER_DETAIL: `${ADMIN_BASE}/people-management/access/:id`,
  OPERATIONS: `${ADMIN_BASE}/operations-management`,
  CREATE_OPERATIONS: `${ADMIN_BASE}/operations-management/create`,
  PERMIT_DETAILS: `${ADMIN_BASE}/operations-management/permit/:id`,
  TICKET_DETAIL: `${ADMIN_BASE}/dashboard/ticket/:id`,
  FEATURE_FLAGS: `${ADMIN_BASE}/feature-flags`,
};

const UserPath = {
  DASHBOARD: `${USER_BASE}/dashboard`,
};

const ConsultantPath = {
  DASHBOARD: `${CONSULTANT_BASE}/dashboard`,
  ACCESS_MANAGEMENT: `${CONSULTANT_BASE}/people-management/access`,
  PEOPLE_ACCESS: `${CONSULTANT_BASE}/people-management/access`,
  PEOPLE_MANAGEMENT: `${CONSULTANT_BASE}/people-management`,
  REPORTS: `${CONSULTANT_BASE}/reports`,
  TECHNICAL_DOCUMENTS: `${CONSULTANT_BASE}/technical-documents`,
  ANALYTICS: `${CONSULTANT_BASE}/analytics`,
  SETTINGS: `${CONSULTANT_BASE}/settings`,
  HELP_SUPPORT: `${CONSULTANT_BASE}/help-support`,
  OPERATIONS: `${CONSULTANT_BASE}/operations-management`,
  FEATURE_FLAGS: `${CONSULTANT_BASE}/feature-flags`,
};

const AuthPath = {
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
};

const DefalutPage = {
  ADMIN_DEFAULT_PAGE: '/app/admin/*',
  USER_DEFAULT_PAGE: '/app/user/*',
  CONSULTANT_DEFAULT_PAGE: '/app/consultant/*',
};

/**
 * Combined Path object.
 * - Admin components should use constants.AdminPath
 * - User components should use constants.UserPath
 * - Auth/shared components should use constants.Path for auth routes
 */
const Path = {
  DEFAULT_PAGE: '/',
  ...AuthPath,
  ...AdminPath,
  NOT_FOUND: '*',
};

export const constants = {
  Path,
  AdminPath,
  UserPath,
  ConsultantPath,
  AuthPath,
  ADMIN_BASE,
  USER_BASE,
  CONSULTANT_BASE,
  DefalutPage,
};
