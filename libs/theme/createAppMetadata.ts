import { useAppRole } from './AppRoleContext';

/**
 * App-specific metadata configuration type
 */
export interface AppMetadataConfig<T = Record<string, unknown>> {
  admin?: T;
  user?: T;
  consultant?: T;
}

/**
 * Tenant-specific metadata configuration type
 * (For pages like Intro that render outside AppRoleContext)
 */
export interface TenantMetadataConfig<T = Record<string, unknown>> {
  [tenant: string]: T;
}

/**
 * Gets the current partner from runtime constants.
 * During build, Vite replaces the PARTNER constant with the actual partner name.
 */
interface PartnerConfig {
  partner?: string;
  partnerId?: string;
  partnerName?: string;
  [key: string]: unknown;
}

const getPartner = (): string | undefined => {
  const config = (window as unknown as { __PARTNER_CONFIG__?: PartnerConfig }).__PARTNER_CONFIG__;
  // __PARTNER_CONFIG__ is defined as JSON.stringify() in vite.config, so it's a string at runtime
  if (typeof config === 'string') {
    try {
      const parsed = JSON.parse(config);
      return parsed.partner;
    } catch {
      return undefined;
    }
  }
  return config?.partner;
};

/**
 * Creates a metadata hook that works across all apps with app-specific and tenant-specific overrides.
 *
 * Priority order:
 * 1. Tenant-specific override (read from __PARTNER_CONFIG__, set at build time by vite)
 *    → Used for public pages like Intro that render before AppRoleContext is available
 * 2. Role-specific override (read from AppRoleContext at runtime)
 *    → Used for authenticated pages inside the app shell
 *
 * @param baseMetadata - Base metadata object
 * @param appConfig - App-specific metadata overrides (by role: admin/user/consultant)
 * @param tenantConfig - Tenant-specific metadata overrides (by partner name)
 *
 * @example
 * const useMetadata = createAppMetadata(
 *   { tenet: 'SprintPulse', title: 'Welcome' },
 *   {
 *     admin: { tenet: 'Admin Dashboard' },
 *     user: { tenet: 'User Dashboard' },
 *   },
 *   {
 *     sprintpulse: { tenet: 'SprintPulse' },
 *   }
 * );
 *
 * // In component:
 * const metadata = useMetadata();
 */
export const createAppMetadata = <T extends Record<string, unknown>>(
  baseMetadata: T,
  appConfig?: AppMetadataConfig<Partial<T>>,
  tenantConfig?: TenantMetadataConfig<Partial<T>>,
) => {
  return (): T => {
    // Start with base metadata
    let merged = { ...baseMetadata } as Record<string, unknown>;

    // 1. Apply tenant-specific override first (higher priority for public pages)
    const partner = getPartner();
    if (partner && tenantConfig && partner in tenantConfig) {
      merged = { ...merged, ...tenantConfig[partner] };
    }

    // 2. Apply role-specific override (for authenticated pages inside AppRoleContext)
    const appRole = useAppRole();
    const appOverrides = appConfig?.[appRole] || {};
    merged = { ...merged, ...appOverrides };

    return merged as T;
  };
};
