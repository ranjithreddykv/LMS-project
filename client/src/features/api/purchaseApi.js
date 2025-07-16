import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PURCHASE_API = "http://localhost:8001/api/v1/course";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  tagTypes: ["refetch_creator_course"],
  baseQuery: fetchBaseQuery({
    baseUrl: PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({}),
});
