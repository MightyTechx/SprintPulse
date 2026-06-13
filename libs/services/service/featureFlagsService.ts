import { baseApi } from './baseServices';

// ─── Types ────────────────────────────────────────────────────────────────────

export type FlagStatus = 'Enabled' | 'Disabled';
export type FlagRole = 'Admin' | 'Consultant';
export type FlagEnvironment = 'Development' | 'Staging' | 'Production';

export interface FeatureFlag {
  id: number;
  name: string;
  key: string;
  description: string;
  environment: FlagEnvironment;
  status: FlagStatus;
  roles: FlagRole[];
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureFlagPayload {
  name: string;
  key: string;
  description: string;
  environment: FlagEnvironment;
  status: FlagStatus;
  roles: FlagRole[];
  createdBy?: number;
}

export interface UpdateFeatureFlagPayload {
  id: number;
  name?: string;
  key?: string;
  description?: string;
  environment?: FlagEnvironment;
  status?: FlagStatus;
  roles?: FlagRole[];
  updatedBy?: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const featureFlagsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeatureFlags: builder.query<FeatureFlag[], void>({
      query: () => ({ url: '/api/admin/feature-flags', method: 'GET' }),
      transformResponse: (res: { data: FeatureFlag[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'FeatureFlags' as const, id })),
              { type: 'FeatureFlags' as const, id: 'LIST' },
            ]
          : [{ type: 'FeatureFlags' as const, id: 'LIST' }],
    }),

    createFeatureFlag: builder.mutation<FeatureFlag, CreateFeatureFlagPayload>({
      query: (body) => ({ url: '/api/admin/feature-flags', method: 'POST', body }),
      transformResponse: (res: { data: FeatureFlag }) => res.data,
      invalidatesTags: [{ type: 'FeatureFlags', id: 'LIST' }],
    }),

    updateFeatureFlag: builder.mutation<FeatureFlag, UpdateFeatureFlagPayload>({
      query: ({ id, ...body }) => ({ url: `/api/admin/feature-flags/${id}`, method: 'PUT', body }),
      transformResponse: (res: { data: FeatureFlag }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'FeatureFlags', id },
        { type: 'FeatureFlags', id: 'LIST' },
      ],
    }),

    toggleFeatureFlag: builder.mutation<FeatureFlag, { id: number; updatedBy?: number }>({
      query: ({ id, updatedBy }) => ({
        url: `/api/admin/feature-flags/${id}/toggle`,
        method: 'PATCH',
        body: { updatedBy },
      }),
      transformResponse: (res: { data: FeatureFlag }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'FeatureFlags', id },
        { type: 'FeatureFlags', id: 'LIST' },
      ],
    }),

    deleteFeatureFlag: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/admin/feature-flags/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'FeatureFlags', id },
        { type: 'FeatureFlags', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFeatureFlagsQuery,
  useCreateFeatureFlagMutation,
  useUpdateFeatureFlagMutation,
  useToggleFeatureFlagMutation,
  useDeleteFeatureFlagMutation,
} = featureFlagsApi;
