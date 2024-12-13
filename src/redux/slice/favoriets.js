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
            favoriteApi.util.updateQueryData('getUserFavorites', undefined, (draft) => {
              const index = draft.favorites.findIndex(fav => fav.id === songId);
              if (index > -1) {
                draft.favorites.splice(index, 1);
              } else {
                draft.favorites.push({ id: songId });
              }
            })
          );
        } catch {
          // Xử lý lỗi nếu cần
        }
      },
      invalidatesTags: ["Favorites"],
    }),

    // Get user's favorite songs
    getUserFavorites: builder.query({
      query: () => "/favorites/list",
      transformResponse: (response) => response.data,
      providesTags: ["Favorites"],
    }),

    // Check favorite status for a song
    checkFavoriteStatus: builder.query({
      query: (songId) => `/favorites/status/${songId}`,
      transformResponse: (response) => response.isFavorite,
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
