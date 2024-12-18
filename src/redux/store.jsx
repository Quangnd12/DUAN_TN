import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from "./slice/authSlice";
import { apiSlice } from "./slice/apiSlice";
import notificationReducer from './slice/notificationSlice';
import { playlistApi } from "./slice/playlistSlice";
import { followApi } from './slice/followSlice'; // Đảm bảo đúng đường dẫn
import { favoriteApi } from './slice/favoriets'; // Import favoriteApi
import { eventApi } from "./slice/eventSlice";
import artistAuthReducer from "./slice/artistAuthSlice";
import artistSongReducer from './slice/artistSongSlice';
import artistAlbumReducer from './slice/artistAlbumSlice';
import { ratingApi } from './slice/ratingSlice'; // Thêm import


const persistConfig = {
  key: 'auth', 
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    artistAuth: artistAuthReducer, // Thay đổi ở đây
    artistSong: artistSongReducer,
    artistAlbum: artistAlbumReducer,
    notifications: notificationReducer,
    [playlistApi.reducerPath]: playlistApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [followApi.reducerPath]: followApi.reducer,  // Thêm reducer của followApi
    [favoriteApi.reducerPath]: favoriteApi.reducer, // Thêm reducer của favoriteApi
    [ratingApi.reducerPath]: ratingApi.reducer, // Thêm reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(
      apiSlice.middleware, 
      playlistApi.middleware, 
      eventApi.middleware,
      followApi.middleware, 
      favoriteApi.middleware,
      ratingApi.middleware // Thêm middleware
    ),
});

const persistor = persistStore(store);

export { store, persistor };