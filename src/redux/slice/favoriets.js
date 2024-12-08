import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/Api_url";

export const favoriteApi = createApi({
  reducerPath: "favoriteApi",
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
  tagTypes: ["Favorites"],
  endpoints: (builder) => ({
    // Toggle favorite for a song
    toggleFavorite: builder.mutation({
      query: (songId) => ({
        url: `/favorites/toggle/${songId}`,
        method: "POST",
      }),
      async onQueryStarted(songId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            favoriteApi.util.updateQueryData('checkFavoriteStatus', songId, (draft) => {
              if (draft?.data) {
                draft.data.isFavorite = !draft.data.isFavorite;
              }
            })
          );
        } catch {
          // Xử lý lỗi nếu cần
        }
      },
      invalidatesTags: (result, error, songId) => [
        { type: "Favorites", id: songId },
        "Favorites"
      ],
    }),

    // Get user's favorite songs
    getUserFavorites: builder.query({
      query: () => "/favorites/list",
      providesTags: ["Favorites"],
    }),

    // Check favorite status for a song
    checkFavoriteStatus: builder.query({
      query: (songId) => `/favorites/status/${songId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, songId) => [
        { type: "Favorites", id: songId },
      ],
    }),

    // Get most liked songs
    getMostLikedSongs: builder.query({
      query: () => "/favorites/most-liked",
      transformResponse: (response) => response.data,
      providesTags: ["Favorites"],
    }),

    // Get favorites count by genre
    getFavoritesCountByGenre: builder.query({
      query: () => "/favorites/favorites-by-genre",
      transformResponse: (response) => response.data,
      providesTags: ["Favorites"],
    }),
  }),
});

export const {
  useToggleFavoriteMutation,
  useGetUserFavoritesQuery,
  useCheckFavoriteStatusQuery,
  useGetMostLikedSongsQuery,
  useGetFavoritesCountByGenreQuery,
} = favoriteApi;
