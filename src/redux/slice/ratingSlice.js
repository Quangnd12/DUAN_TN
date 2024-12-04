import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/Api_url";

export const ratingApi = createApi({
  reducerPath: "ratingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Rating"],
  endpoints: (builder) => ({
    // Tạo hoặc cập nhật rating
    createOrUpdateRating: builder.mutation({
      query: (ratingData) => ({
        url: '/ratings',
        method: 'POST',
        body: ratingData
      }),
      invalidatesTags: (result, error, { songId }) => [
        { type: "Rating", id: songId }
      ]
    }),

    // Lấy tất cả rating của một bài hát
    getSongRatings: builder.query({
      query: (songId) => `/ratings/song/${songId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, songId) => [
        { type: "Rating", id: songId }
      ]
    }),

    // Lấy rating của user hiện tại cho một bài hát
    getUserRating: builder.query({
      query: (songId) => `/ratings/user/song/${songId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, songId) => [
        { type: "Rating", id: songId }
      ]
    }),

    // Xóa rating
    deleteRating: builder.mutation({
      query: (songId) => ({
        url: `/ratings/song/${songId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, songId) => [
        { type: "Rating", id: songId }
      ]
    })
  })
});

export const {
  useCreateOrUpdateRatingMutation,
  useGetSongRatingsQuery,
  useGetUserRatingQuery,
  useDeleteRatingMutation
} = ratingApi; 