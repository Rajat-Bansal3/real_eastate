import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/user.slice.js";

export default configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleWare) => {
    return getDefaultMiddleWare({
      serializableCheck: false,
    });
  },
});