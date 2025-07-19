import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API = "http://localhost:8001/api/v1/CourseProgress";

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
    }),
    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lectures/${lectureId}/view`,
        method: "POST",
      }),
    }),
    completeCourse: builder.mutation({
      query: ({ courseId }) => ({
        url: `/${courseId}/complete`,
        method:"POST"
      }),
    }),
    InCompleteCourse: builder.mutation({
      query: ({ courseId }) => ({
        url: `/${courseId}/inComplete`,
        method:"POST"
      }),
    }),
  }),
});
export const { useUpdateLectureProgressMutation,useCompleteCourseMutation,useInCompleteCourseMutation,useGetCourseProgressQuery } = courseProgressApi;
