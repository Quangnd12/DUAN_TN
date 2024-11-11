// src/redux/slice/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../services/Api_url";
import { setCredentials }  from "./authSlice"

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ['User'], 
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Gọi setCredentials với thông tin role và token
          dispatch(setCredentials({ token: data.token, user: data.user, role: data.user.role })); 
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),
    
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ token: data.token, user: data.user })); // Cập nhật thông tin người dùng
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),

    googleRegister: builder.mutation({
      query: ({ idToken, userData }) => ({
        url: "/auth/register/google",
        method: "POST",
        body: {
          idToken,
          userData
        }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          if (!data.user || !data.token) {
            throw new Error("Invalid response format");
          }
    
          dispatch(setCredentials({ 
            user: data.user,
            token: data.token,
            role: data.user.role 
          }));
        } catch (error) {
          console.error("Google registration error:", error);
          // Let the component handle the error
          throw error;
        }
      },
    }),
  

    googleLogin: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login/google",
        method: "POST",
        body: credentials, // Send both idToken and isRegistering flag
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ 
            token: data.token,
            user: data.user,
            role: data.user.role 
          }));
        } catch (error) {
          console.error("Google login failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: `/auth/reset-password/${token}`,
        method: "POST",
        body: { newPassword },
      }),
    }),

    // User endpoints
    getUser: builder.query({
      query: (id) => `/auth/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
     getUsers: builder.query({
      query: (params = {}) => {
        const {
          page = 0, // 0 means get all users
          limit = 5,
          search = '',
          sort = 'createdAt',
          order = 'asc'
        } = params;

        return {
          url: '/auth/',
          params: {
            ...(page > 0 && { page, limit }), // Chỉ thêm params phân trang nếu page > 0
            ...(search && { search }),
            sort,
            order
          }
        };
      },
      transformResponse: (response) => {
        // Transform response based on whether it's paginated or not
        if (response.pagination) {
          return {
            users: response.data,
            pagination: response.pagination,
            message: response.message
          };
        }
        return {
          users: response.data,
          total: response.total,
          message: response.message
        };
      },
      providesTags: (result, error, params) => {
        const { page = 0, search = '' } = params;
        return [
          { type: 'User', id: page > 0 ? `LIST-${page}-${search}` : 'ALL' }
        ];
      }
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/auth/${id}`,
        method: "PUT",
        body: userData,
      }),
      // Improve cache invalidation
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'ALL' },
        { type: 'User', id: 'LIST' }
      ],
      // Add transform response
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedUser } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: updatedUser,
              token: localStorage.getItem('accessToken'),
            })
          );
        } catch {}
      },
    }),
    uploadAvatar: builder.mutation({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("avatar", file);
        return {
          url: `/auth/upload-avatar/${id}`,
          method: "POST",
          body: formData,
        };
      },
      // Improve cache invalidation
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'ALL' },
        { type: 'User', id: 'LIST' }
      ],
      // Add transform response
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedUser } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: updatedUser,
              token: localStorage.getItem('accessToken'),
            })
          );
        } catch {}
      },
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/auth/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'ALL' },
        { type: 'User', id: 'LIST' }
      ],
    }),
  }),
});

// Xuất các hook cho các endpoint
export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleRegisterMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserQuery,
  useGetUsersQuery,
  useGetPaginatedUsersQuery,
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useDeleteUserMutation,
} = apiSlice;
