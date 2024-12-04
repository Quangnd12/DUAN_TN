import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/Api_url";

export const followApi = createApi({
  reducerPath: "followApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;  // Lấy token từ state
      if (token) {
        headers.set("authorization", `Bearer ${token}`);  // Thêm token vào header
      }
      return headers;
    },
  }),

  tagTypes: ["Follow", "TopFollowedArtists"],
  endpoints: (builder) => ({
    // Toggle follow artist
    toggleFollowArtist: builder.mutation({
      query: (artistId) => ({
        url: `/artists/${artistId}/toggle-follow`,  // Endpoint toggle follow
        method: "POST",
      }),
      // Sau khi toggle follow, có thể invalidates hoặc refresh dữ liệu follow
      invalidatesTags: [{ type: "Follow", id: "LIST" }],
    }),

    // Get top followed artists
    getTopFollowedArtists: builder.query({
      query: () => "/top-followed-artists",  // Endpoint lấy danh sách nghệ sĩ có nhiều follow nhất
      transformResponse: (response) => response.data.artists,  // Lấy mảng artists từ response
      providesTags: (result) =>
        result && Array.isArray(result)
          ? result.map((artist) => ({
              type: "TopFollowedArtists",
              id: artist.id,
            }))
          : [],
    }),
    // Get followers of a specific artist
    getArtistFollowers: builder.query({
      query: (artistId) => `/artists/${artistId}/followers`,  // Endpoint lấy followers của nghệ sĩ
      transformResponse: (response) => response.data,  // Chỉ lấy dữ liệu cần thiết
      providesTags: (result, error, artistId) => [
        { type: "Follow", id: artistId },
      ],
    }),

    // Get follow statistics
    getFollowStatistics: builder.query({
      query: () => "/statistics",  // Endpoint lấy thống kê follow
      transformResponse: (response) => response.data,  // Chỉ lấy dữ liệu cần thiết
      providesTags: [{ type: "Follow", id: "STATISTICS" }],
    }),

    // Get list of artists followed by current user
    getUserFollowedArtists: builder.query({
      query: () => "/my-followed-artists",
      transformResponse: (response) => {
        return response.data.artists.map(artist => ({
          ...artist,
          songs: artist.songs?.map(song => ({
            ...song,
            releaseDate: song.releaseDate
          })) || []
        }));
      },
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map((artist) => ({
                type: "Follow",
                id: artist.id,
              })),
              { type: "Follow", id: "LIST" },
            ]
          : [{ type: "Follow", id: "LIST" }],
    }),
  }),
});

export const {
  useToggleFollowArtistMutation,
  useGetTopFollowedArtistsQuery,
  useGetArtistFollowersQuery,
  useGetFollowStatisticsQuery,
  useGetUserFollowedArtistsQuery,
} = followApi;
