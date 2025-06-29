import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import rootReducer from "./rootReducer.js";
import { authApi } from "@/features/api/authApi.js";
import { courseApi } from "@/features/api/courseApi.js";
import { lectureApi } from "@/features/api/lectureApi.js";
export const appStore=configureStore({
    reducer:rootReducer,
    middleware:(defaultMiddleware)=>defaultMiddleware().concat(authApi.middleware ,courseApi.middleware,lectureApi.middleware)
})

const initializeApp=async()=>{
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}));
}
initializeApp();