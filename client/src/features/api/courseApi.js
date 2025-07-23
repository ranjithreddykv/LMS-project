import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8001/api/v1/course";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["refetch_creator_course"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, courseCategory }) => ({
        url: "/",
        method: "POST",
        body: { courseTitle, courseCategory },
      }),
      invalidatesTags: ["refetch_creator_course"],
    }),
    getCourses: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["refetch_creator_course"],
    }),
    updateCourse: builder.mutation({
      query: ({ formData, _id }) => ({
        url: `update/${_id}`,
        method: "POST",
        body: formData,
      }),
    }),
    publishCourse: builder.mutation({
      query: ({ _id }) => ({
        url: `publish/${_id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["refetch_creator_course"],
    }),
    deleteCourse: builder.mutation({
      query: ({ _id }) => ({
        url: `delete/${_id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["refetch_creator_course"],
    }),
    getCourse: builder.query({
      query: ({ courseId }) => ({
        url: `getCourse/${courseId}`,
        method: "GET",
      }),
    }),
    getPublishedCourse: builder.query({
      query: () => ({
        url: `/getPublishedCourses`,
        method: "GET",
      }),
    }),
    getSearchCourses: builder.query({
      query: ({ searchQuery, categories, sortByPrice }) => {
        //build a query string
        let queryString = `/search?query=${encodeURIComponent(searchQuery)}`;
        //append category
        if (categories && categories.length > 0) {
          const categoriesString = categories.map(encodeURIComponent).join(",");
          queryString += `&categories=${categoriesString}`;
        }
        //append sort price if available
        if (sortByPrice) {
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
        }
        return {
          url: queryString,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetCoursesQuery,
  useUpdateCourseMutation,
  usePublishCourseMutation,
  useDeleteCourseMutation,
  useGetCourseQuery,
  useGetPublishedCourseQuery,
  useGetSearchCoursesQuery
} = courseApi;
