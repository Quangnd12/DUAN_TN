// src/redux/slice/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/Api_url";
import { setCredentials, logout }  from "./authSlice"
import { addNotification }  from "./notificationSlice"

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Thử refresh token
    const refreshResult = await baseQuery(
      '/auth/refresh-token',
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      // Lưu token mới
      api.dispatch(setCredentials({ 
        token: refreshResult.data.accessToken 
      }));

      // Thử lại request ban đầu
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh token failed
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Thêm endpoint refresh token
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
        credentials: "include" // Để gửi refresh token từ cookie
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ 
            token: data.accessToken,
            // Không lưu refresh token vào localStorage
          }));
        } catch (error) {
          // Nếu refresh token không hợp lệ, logout
          dispatch(logout());
        }
      }
    }),
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
          dispatch(setCredentials({ token: data.token, user: data.user }));
          
          // Thêm thông báo khi đăng ký thành công
          dispatch(addNotification({
            id: Date.now(),
            type: 'user',
            message: `New user ${data.user.username || 'Anonymous'} has registered`,
            time: new Date().toLocaleTimeString(),
            read: false
          }));
        } catch (error) {
          console.error("Registration failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),

    googleRegister: builder.mutation({
      query: ({ idToken, userData }) => ({
        url: "/auth/register/google",
        method: "POST",
        body: { idToken, userData }
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
          // Thêm thông báo khi đăng ký Google thành công
          dispatch(addNotification({
            id: Date.now(),
            type: 'user',
            message: `New user ${data.user.username || 'Google User'} has registered via Google`,
            time: new Date().toLocaleTimeString(),
            read: false
          }));
        } catch (error) {
          console.error("Google registration error:", error);
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
      query: ({ id, formData }) => ({
        url: `/auth/${id}`,
        method: "PUT",
        body: formData,
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
