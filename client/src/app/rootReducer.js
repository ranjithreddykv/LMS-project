import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi.js";
import { lectureApi } from "@/features/api/lectureApi.js";
import { purchaseApi } from "@/features/api/purchaseApi.js";
import { courseProgressApi } from "@/features/api/courseProgressApi.js";
const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [lectureApi.reducerPath]: lectureApi.reducer,
  [purchaseApi.reducerPath]:purchaseApi.reducer,
  [courseProgressApi.reducerPath]:courseProgressApi.reducer,
  auth: authReducer,
});

export default rootReducer;
