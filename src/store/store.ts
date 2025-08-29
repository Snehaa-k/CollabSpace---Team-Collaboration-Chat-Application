import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import chatReducer from './api/chatApi';
import roomReducer from './slices/roomSlice';
import taskReducer from './slices/taskSlice';
import { authApi } from './api/authApi';

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  rooms: roomReducer,
  tasks: taskReducer,
  [authApi.reducerPath]: authApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(authApi.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => useAppDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;