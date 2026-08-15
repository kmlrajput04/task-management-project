import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import tasksReducer from './slices/tasksSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    tasks: tasksReducer,
    notifications: notificationsReducer
  }
});

export default store;
