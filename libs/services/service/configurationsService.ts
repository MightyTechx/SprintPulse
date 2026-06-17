import { baseApi } from './baseServices';

// ─── Shared Types ──────────────────────────────────────────────────────────────

export type ConfigEntityKey =
  | 'squad'
  | 'team'
  | 'issueType'
  | 'status'
  | 'fixVersion'
  | 'sprintNumber'
  | 'priority';

export interface ConfigurationItem {
  id: number;
  name: string;
  key: string;
  description: string;
  color: string;
  iconKey?: string | null;
  managerName?: string | null;
  leadName?: string | null;
  squadId?: number | null;
  sortOrder: number;
  isActive: boolean;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
}

// Per-entity named aliases — same shape, semantic intent
export type Squad = ConfigurationItem;
export type Team = ConfigurationItem;
export type IssueType = ConfigurationItem;
export type TicketStatus = ConfigurationItem;
export type FixVersion = ConfigurationItem;
export type SprintNumber = ConfigurationItem;
export type Priority = ConfigurationItem;

export interface CreateConfigurationPayload {
  name: string;
  key?: string;
  description?: string;
  color?: string;
  iconKey?: string | null;
  managerName?: string | null;
  leadName?: string | null;
  squadId?: number | null;
  sortOrder?: number;
  isActive?: boolean;
  createdBy?: number;
}

export interface UpdateConfigurationPayload {
  id: number;
  name?: string;
  key?: string;
  description?: string;
  color?: string;
  iconKey?: string | null;
  managerName?: string | null;
  leadName?: string | null;
  squadId?: number | null;
  sortOrder?: number;
  isActive?: boolean;
  updatedBy?: number;
}

const API_BASE = '/api/admin/configurations';

// ─── API ──────────────────────────────────────────────────────────────────────

export const configurationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Squad ────────────────────────────────────────────────────────────────
    getSquads: builder.query<Squad[], void>({
      query: () => ({ url: `${API_BASE}/squad`, method: 'GET' }),
      transformResponse: (res: { data: Squad[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Configurations' as const, id: `squad-${id}` })),
              { type: 'Configurations' as const, id: 'LIST-squad' },
            ]
          : [{ type: 'Configurations' as const, id: 'LIST-squad' }],
    }),
    createSquad: builder.mutation<Squad, CreateConfigurationPayload>({
      query: (body) => ({ url: `${API_BASE}/squad`, method: 'POST', body }),
      transformResponse: (res: { data: Squad }) => res.data,
      invalidatesTags: [{ type: 'Configurations', id: 'LIST-squad' }],
    }),
    updateSquad: builder.mutation<Squad, UpdateConfigurationPayload>({
      query: ({ id, ...body }) => ({
        url: `${API_BASE}/squad/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (res: { data: Squad }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Configurations', id: `squad-${id}` },
        { type: 'Configurations', id: 'LIST-squad' },
      ],
    }),
    toggleSquad: builder.mutation<Squad, { id: number; updatedBy?: number }>({
      query: ({ id, updatedBy }) => ({
        url: `${API_BASE}/squad/${id}/toggle`,
        method: 'PATCH',
        body: { updatedBy },
      }),
      transformResponse: (res: { data: Squad }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Configurations', id: `squad-${id}` },
        { type: 'Configurations', id: 'LIST-squad' },
      ],
    }),
    deleteSquad: builder.mutation<void, number>({
      query: (id) => ({ url: `${API_BASE}/squad/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Configurations', id: `squad-${id}` },
        { type: 'Configurations', id: 'LIST-squad' },
      ],
    }),

    // ── Team ─────────────────────────────────────────────────────────────────
    getTeams: builder.query<Team[], void>({
      query: () => ({ url: `${API_BASE}/team`, method: 'GET' }),
      transformResponse: (res: { data: Team[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Configurations' as const, id: `team-${id}` })),
              { type: 'Configurations' as const, id: 'LIST-team' },
            ]
          : [{ type: 'Configurations' as const, id: 'LIST-team' }],
    }),
    createTeam: builder.mutation<Team, CreateConfigurationPayload>({
      query: (body) => ({ url: `${API_BASE}/team`, method: 'POST', body }),
      transformResponse: (res: { data: Team }) => res.data,
      invalidatesTags: [{ type: 'Configurations', id: 'LIST-team' }],
    }),
    updateTeam: builder.mutation<Team, UpdateConfigurationPayload>({
      query: ({ id, ...body }) => ({
        url: `${API_BASE}/team/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (res: { data: Team }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Configurations', id: `team-${id}` },
        { type: 'Configurations', id: 'LIST-team' },
      ],
    }),
    toggleTeam: builder.mutation<Team, { id: number; updatedBy?: number }>({
      query: ({ id, updatedBy }) => ({
        url: `${API_BASE}/team/${id}/toggle`,
        method: 'PATCH',
        body: { updatedBy },
      }),
      transformResponse: (res: { data: Team }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Configurations', id: `team-${id}` },
        { type: 'Configurations', id: 'LIST-team' },
      ],
    }),
    deleteTeam: builder.mutation<void, number>({
      query: (id) => ({ url: `${API_BASE}/team/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Configurations', id: `team-${id}` },
        { type: 'Configurations', id: 'LIST-team' },
      ],
    }),

    // ── IssueType ────────────────────────────────────────────────────────────
    getIssueTypes: builder.query<IssueType[], void>({
      query: () => ({ url: `${API_BASE}/issueType`, method: 'GET' }),
      transformResponse: (res: { data: IssueType[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Configurations' as const,
                id: `issueType-${id}`,
              })),
              { type: 'Configurations' as const, id: 'LIST-issueType' },
            ]
          : [{ type: 'Configurations' as const, id: 'LIST-issueType' }],
    }),
    createIssueType: builder.mutation<IssueType, CreateConfigurationPayload>({
      query: (body) => ({ url: `${API_BASE}/issueType`, method: 'POST', body }),
      transformResponse: (res: { data: IssueType }) => res.data,
      invalidatesTags: [{ type: 'Configurations', id: 'LIST-issueType' }],
    }),
    updateIssueType: builder.mutation<IssueType, UpdateConfigurationPayload>({
      query: ({ id, ...body }) => ({
        url: `${API_BASE}/issueType/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (res: { data: IssueType }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Configurations', id: `issueType-${id}` },
        { type: 'Configurations', id: 'LIST-issueType' },
      ],
    }),
    toggleIssueType: builder.mutation<IssueType, { id: number; updatedBy?: number }>({
      query: ({ id, updatedBy }) => ({
        url: `${API_BASE}/issueType/${id}/toggle`,
        method: 'PATCH',
        body: { updatedBy },
      }),
      transformResponse: (res: { data: IssueType }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Configurations', id: `issueType-${id}` },
        { type: 'Configurations', id: 'LIST-issueType' },
      ],
    }),
    deleteIssueType: builder.mutation<void, number>({
      query: (id) => ({ url: `${API_BASE}/issueType/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Configurations', id: `issueType-${id}` },
        { type: 'Configurations', id: 'LIST-issueType' },
      ],
    }),

    // ── Status ───────────────────────────────────────────────────────────────
    getStatuses: builder.query<TicketStatus[], void>({
      query: () => ({ url: `${API_BASE}/status`, method: 'GET' }),
      transformResponse: (res: { data: TicketStatus[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Configurations' as const, id: `status-${id}` })),
              { type: 'Configurations' as const, id: 'LIST-status' },
            ]
          : [{ type: 'Configurations' as const, id: 'LIST-status' }],
    }),
    createStatus: builder.mutation<TicketStatus, CreateConfigurationPayload>({
      query: (body) => ({ url: `${API_BASE}/status`, method: 'POST', body }),
      transformResponse: (res: { data: TicketStatus }) => res.data,
      invalidatesTags: [{ type: 'Configurations', id: 'LIST-status' }],
    }),
    updateStatus: builder.mutation<TicketStatus, UpdateConfigurationPayload>({
      query: ({ id, ...body }) => ({
        url: `${API_BASE}/status/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (res: { data: TicketStatus }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Configurations', id: `status-${id}` },
        { type: 'Configurations', id: 'LIST-status' },
      ],
    }),
    toggleStatus: builder.mutation<TicketStatus, { id: number; updatedBy?: number }>({
      query: ({ id, updatedBy }) => ({
        url: `${API_BASE}/status/${id}/toggle`,
        method: 'PATCH',
        body: { updatedBy },
      }),
      transformResponse: (res: { data: TicketStatus }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Configurations', id: `status-${id}` },
        { type: 'Configurations', id: 'LIST-status' },
      ],
    }),
    deleteStatus: builder.mutation<void, number>({
      query: (id) => ({ url: `${API_BASE}/status/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Configurations', id: `status-${id}` },
        { type: 'Configurations', id: 'LIST-status' },
      ],
    }),

    // ── FixVersion ───────────────────────────────────────────────────────────
    getFixVersions: builder.query<FixVersion[], void>({
      query: () => ({ url: `${API_BASE}/fixVersion`, method: 'GET' }),
      transformResponse: (res: { data: FixVersion[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Configurations' as const,
                id: `fixVersion-${id}`,
              })),
              { type: 'Configurations' as const, id: 'LIST-fixVersion' },
            ]
          : [{ type: 'Configurations' as const, id: 'LIST-fixVersion' }],
    }),
    createFixVersion: builder.mutation<FixVersion, CreateConfigurationPayload>({
      query: (body) => ({ url: `${API_BASE}/fixVersion`, method: 'POST', body }),
      transformResponse: (res: { data: FixVersion }) => res.data,
      invalidatesTags: [{ type: 'Configurations', id: 'LIST-fixVersion' }],
    }),
    updateFixVersion: builder.mutation<FixVersion, UpdateConfigurationPayload>({
      query: ({ id, ...body }) => ({
        url: `${API_BASE}/fixVersion/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (res: { data: FixVersion }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Configurations', id: `fixVersion-${id}` },
        { type: 'Configurations', id: 'LIST-fixVersion' },
      ],
    }),
    toggleFixVersion: builder.mutation<FixVersion, { id: number; updatedBy?: number }>({
      query: ({ id, updatedBy }) => ({
        url: `${API_BASE}/fixVersion/${id}/toggle`,
        method: 'PATCH',
        body: { updatedBy },
      }),
      transformResponse: (res: { data: FixVersion }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Configurations', id: `fixVersion-${id}` },
        { type: 'Configurations', id: 'LIST-fixVersion' },
      ],
    }),
    deleteFixVersion: builder.mutation<void, number>({
      query: (id) => ({ url: `${API_BASE}/fixVersion/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Configurations', id: `fixVersion-${id}` },
        { type: 'Configurations', id: 'LIST-fixVersion' },
      ],
    }),

    // ── SprintNumber ─────────────────────────────────────────────────────────
    getSprintNumbers: builder.query<SprintNumber[], void>({
      query: () => ({ url: `${API_BASE}/sprintNumber`, method: 'GET' }),
      transformResponse: (res: { data: SprintNumber[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Configurations' as const,
                id: `sprintNumber-${id}`,
              })),
              { type: 'Configurations' as const, id: 'LIST-sprintNumber' },
            ]
          : [{ type: 'Configurations' as const, id: 'LIST-sprintNumber' }],
    }),
    createSprintNumber: builder.mutation<SprintNumber, CreateConfigurationPayload>({
      query: (body) => ({ url: `${API_BASE}/sprintNumber`, method: 'POST', body }),
      transformResponse: (res: { data: SprintNumber }) => res.data,
      invalidatesTags: [{ type: 'Configurations', id: 'LIST-sprintNumber' }],
    }),
    updateSprintNumber: builder.mutation<SprintNumber, UpdateConfigurationPayload>({
      query: ({ id, ...body }) => ({
        url: `${API_BASE}/sprintNumber/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (res: { data: SprintNumber }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Configurations', id: `sprintNumber-${id}` },
        { type: 'Configurations', id: 'LIST-sprintNumber' },
      ],
    }),
    toggleSprintNumber: builder.mutation<SprintNumber, { id: number; updatedBy?: number }>({
      query: ({ id, updatedBy }) => ({
        url: `${API_BASE}/sprintNumber/${id}/toggle`,
        method: 'PATCH',
        body: { updatedBy },
      }),
      transformResponse: (res: { data: SprintNumber }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Configurations', id: `sprintNumber-${id}` },
        { type: 'Configurations', id: 'LIST-sprintNumber' },
      ],
    }),
    deleteSprintNumber: builder.mutation<void, number>({
      query: (id) => ({ url: `${API_BASE}/sprintNumber/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Configurations', id: `sprintNumber-${id}` },
        { type: 'Configurations', id: 'LIST-sprintNumber' },
      ],
    }),

    // ── Priority ─────────────────────────────────────────────────────────────
    getPriorities: builder.query<Priority[], void>({
      query: () => ({ url: `${API_BASE}/priority`, method: 'GET' }),
      transformResponse: (res: { data: Priority[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Configurations' as const, id: `priority-${id}` })),
              { type: 'Configurations' as const, id: 'LIST-priority' },
            ]
          : [{ type: 'Configurations' as const, id: 'LIST-priority' }],
    }),
    createPriority: builder.mutation<Priority, CreateConfigurationPayload>({
      query: (body) => ({ url: `${API_BASE}/priority`, method: 'POST', body }),
      transformResponse: (res: { data: Priority }) => res.data,
      invalidatesTags: [{ type: 'Configurations', id: 'LIST-priority' }],
    }),
    updatePriority: builder.mutation<Priority, UpdateConfigurationPayload>({
      query: ({ id, ...body }) => ({
        url: `${API_BASE}/priority/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (res: { data: Priority }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Configurations', id: `priority-${id}` },
        { type: 'Configurations', id: 'LIST-priority' },
      ],
    }),
    togglePriority: builder.mutation<Priority, { id: number; updatedBy?: number }>({
      query: ({ id, updatedBy }) => ({
        url: `${API_BASE}/priority/${id}/toggle`,
        method: 'PATCH',
        body: { updatedBy },
      }),
      transformResponse: (res: { data: Priority }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Configurations', id: `priority-${id}` },
        { type: 'Configurations', id: 'LIST-priority' },
      ],
    }),
    deletePriority: builder.mutation<void, number>({
      query: (id) => ({ url: `${API_BASE}/priority/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Configurations', id: `priority-${id}` },
        { type: 'Configurations', id: 'LIST-priority' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  // Squad
  useGetSquadsQuery,
  useCreateSquadMutation,
  useUpdateSquadMutation,
  useToggleSquadMutation,
  useDeleteSquadMutation,
  // Team
  useGetTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useToggleTeamMutation,
  useDeleteTeamMutation,
  // IssueType
  useGetIssueTypesQuery,
  useCreateIssueTypeMutation,
  useUpdateIssueTypeMutation,
  useToggleIssueTypeMutation,
  useDeleteIssueTypeMutation,
  // Status
  useGetStatusesQuery,
  useCreateStatusMutation,
  useUpdateStatusMutation,
  useToggleStatusMutation,
  useDeleteStatusMutation,
  // FixVersion
  useGetFixVersionsQuery,
  useCreateFixVersionMutation,
  useUpdateFixVersionMutation,
  useToggleFixVersionMutation,
  useDeleteFixVersionMutation,
  // SprintNumber
  useGetSprintNumbersQuery,
  useCreateSprintNumberMutation,
  useUpdateSprintNumberMutation,
  useToggleSprintNumberMutation,
  useDeleteSprintNumberMutation,
  // Priority
  useGetPrioritiesQuery,
  useCreatePriorityMutation,
  useUpdatePriorityMutation,
  useTogglePriorityMutation,
  useDeletePriorityMutation,
} = configurationsApi;
