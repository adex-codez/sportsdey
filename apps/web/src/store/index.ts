import { basketballApi } from "@/services/basketballApi";
import { configureStore } from "@reduxjs/toolkit";
import basketballReducer from "./slices/basketballSlice";
import dateReducer from "./slices/dateSlice";
import notificationReducer from "./slices/notificationSlice";
import tennisReducer from "./slices/tennisSlice";

export const store = configureStore({
  reducer: {
    basketball: basketballReducer,
    date: dateReducer,
    notification: notificationReducer,
    tennis: tennisReducer,
    [basketballApi.reducerPath]: basketballApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(basketballApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
