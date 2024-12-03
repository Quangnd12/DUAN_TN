import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from "./slice/authSlice";
import { apiSlice } from "./slice/apiSlice";
import notificationReducer from './slice/notificationSlice';
import { playlistApi } from "./slice/playlistSlice";
import playerReducer from "./slice/playerSlice";
import { eventApi } from "./slice/eventSlice";
import artistAuthReducer from "./slice/artistAuthSlice";

const persistConfig = {
  key: 'auth', 
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    artistAuth: artistAuthReducer, // Thay đổi ở đây
    notifications: notificationReducer,
    player: playerReducer,
    [playlistApi.reducerPath]: playlistApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(apiSlice.middleware, playlistApi.middleware, eventApi.middleware),
});

const persistor = persistStore(store);

export { store, persistor };