import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PURCHASE_API = "http://localhost:8001/api/v1/purchase";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: courseId,
      }),
    }),
    getCourseDetailsWithStatus: builder.query({
      query: (courseId) => ({
      url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),
    getAllPurchasedCourses: builder.query({
      query: () => ({
        url: "/",
        method:"GET"
      }),
    }),
  }),
});

export const {useCreateCheckoutSessionMutation,useGetAllPurchasedCoursesQuery,useGetCourseDetailsWithStatusQuery}=purchaseApi;
