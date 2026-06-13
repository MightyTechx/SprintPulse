import { IAuthActionRequest } from '@infygen/interfaces';
import { baseApi } from './baseServices';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    authAction: builder.mutation<any, IAuthActionRequest>({
      query: (body) => ({
        url: '/api/auth',
        method: 'POST',
        body,
      }),
    }),
    getAllUsers: builder.mutation<any, void>({
      query: () => ({
        url: '/api/auth',
        method: 'POST',
        body: { action: 'get-all-users' },
      }),
      transformResponse: (response: any) => response.data,
    }),
    getUser: builder.mutation<any, { userId: number }>({
      query: ({ userId }) => ({
        url: '/api/auth',
        method: 'POST',
        body: { action: 'get-user', userId },
      }),
      transformResponse: (response: any) => response.data,
    }),
    updateUser: builder.mutation<any, { userId: number; data: Record<string, unknown> }>({
      query: ({ userId, data }) => ({
        url: '/api/auth',
        method: 'POST',
        body: { action: 'update-user', userId, data },
      }),
      transformResponse: (response: any) => response.data,
    }),
    deleteUser: builder.mutation<any, { userId: number }>({
      query: ({ userId }) => ({
        url: '/api/auth',
        method: 'POST',
        body: { action: 'delete-user', userId },
      }),
    }),
    changePassword: builder.mutation<any, { currentPassword: string; newPassword: string }>({
      query: ({ currentPassword, newPassword }) => ({
        url: '/api/auth',
        method: 'POST',
        body: { action: 'change-password', currentPassword, newPassword },
      }),
    }),
    uploadUserAttachments: builder.mutation<any, { userId: number; files: File[] }>({
      query: ({ userId, files }) => {
        const formData = new FormData();
        files.forEach((f) => formData.append('files', f));
        return {
          url: `/api/auth/upload-attachments?userId=${userId}`,
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: any) => response.data,
    }),
    deleteUserAttachment: builder.mutation<any, { userId: number; url: string }>({
      query: ({ userId, url }) => ({
        url: '/api/auth/delete-attachment',
        method: 'DELETE',
        body: { userId, url },
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useAuthActionMutation,
  useGetAllUsersMutation,
  useGetUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
  useUploadUserAttachmentsMutation,
  useDeleteUserAttachmentMutation,
} = authApi;
