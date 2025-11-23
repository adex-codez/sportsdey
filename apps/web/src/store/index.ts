import { basketballApi } from "@/services/basketballApi";
import { configureStore } from "@reduxjs/toolkit";
import basketballReducer from "./slices/basketballSlice";

export const store = configureStore({
  reducer: {
    basketball: basketballReducer,
    [basketballApi.reducerPath]: basketballApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(basketballApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
