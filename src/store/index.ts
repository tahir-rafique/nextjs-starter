import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import uiReducer   from "./slices/uiSlice";
import userReducer  from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth:  authReducer,
    ui:    uiReducer,
    users: userReducer,
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        // Ignore these paths for redux-persist compatibility
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
