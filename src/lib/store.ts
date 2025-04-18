
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import threatReducer from '@/features/threats/threatSlice';
import uiReducer from '@/features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    threats: threatReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
