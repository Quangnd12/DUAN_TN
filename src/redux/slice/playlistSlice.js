import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/Api_url";

export const playlistApi = createApi({
  reducerPath: "playlistApi",
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
  tagTypes: ["Playlist", "UserPlaylists"],
  endpoints: (builder) => ({
    // Get user's playlists
    getUserPlaylists: builder.query({
      query: () => "/playlists/user/me",
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((playlist) => ({
                type: "Playlist",
                id: playlist.id,
              })),
              { type: "UserPlaylists", id: "LIST" },
            ]
          : [{ type: "UserPlaylists", id: "LIST" }],
    }),

    // Get single playlist by ID
    getPlaylistById: builder.query({
      query: (playlistId) => `/playlists/${playlistId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, playlistId) => [
        { type: "Playlist", id: playlistId },
      ],
    }),

    // Create new playlist
    createPlaylist: builder.mutation({
      query: (playlistData) => {
        const formData = new FormData();
        if (playlistData.image) {
          formData.append("image", playlistData.image);
        }
        // Chỉ append khi giá trị tồn tại
        if (playlistData.name) {
          formData.append("name", playlistData.name);
        }
        if (playlistData.description) {
          formData.append("description", playlistData.description);
        }
        if (typeof playlistData.isPublic !== "undefined") {
          formData.append("isPublic", playlistData.isPublic);
        }

        return {
          url: "/playlists",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response) => response.data,
      invalidatesTags: [{ type: "UserPlaylists", id: "LIST" }],
    }),

    // Update playlist
    updatePlaylist: builder.mutation({
      query: ({ playlistId, ...playlistData }) => {
        const formData = new FormData();
        if (playlistData.image) {
          formData.append("image", playlistData.image);
        }
        // Chỉ append khi giá trị tồn tại
        if (playlistData.name) {
          formData.append("name", playlistData.name);
        }
        if (playlistData.description) {
          formData.append("description", playlistData.description);
        }
        if (typeof playlistData.isPublic !== "undefined") {
          formData.append("isPublic", playlistData.isPublic);
        }

        return {
          url: `/playlists/${playlistId}`,
          method: "PUT",
          body: formData,
        };
      },
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { playlistId }) => [
        { type: "Playlist", id: playlistId },
        { type: "UserPlaylists", id: "LIST" },
      ],
    }),

    // Delete playlist
    deletePlaylist: builder.mutation({
      query: (playlistId) => ({
        url: `/playlists/${playlistId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, playlistId) => [
        { type: "Playlist", id: playlistId },
        { type: "UserPlaylists", id: "LIST" },
      ],
    }),

    // Add song to playlist
    // Trong file playlistSlice.js
    addSongToPlaylist: builder.mutation({
      query: ({ playlistId, song }) => ({
        url: `/playlists/songs/add`, // Cập nhật endpoint chính xác
        method: "POST",
        body: {
          playlistId, // Thêm playlistId vào body request
          ...song, // Spread toàn bộ thông tin bài hát
        },
      }),
      invalidatesTags: (result, error, { playlistId }) => [
        { type: "Playlist", id: playlistId },
      ],
    }),

    // Remove song from playlist
    removeSongFromPlaylist: builder.mutation({
      query: ({ playlistId, songId }) => ({
        url: `/playlists/${playlistId}/songs/${songId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { playlistId }) => [
        { type: "Playlist", id: playlistId },
      ],
    }),
  }),
});

export const {
  useGetUserPlaylistsQuery,
  useGetPlaylistByIdQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useAddSongToPlaylistMutation,
  useRemoveSongFromPlaylistMutation,
} = playlistApi;
