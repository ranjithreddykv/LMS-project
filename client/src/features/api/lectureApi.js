import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const LECTURE_API = "http://localhost:8001/api/v1/lecture";

export const lectureApi = createApi({
  reducerPath: "lectureApi",
  baseQuery: fetchBaseQuery({
    baseUrl: LECTURE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createLecture: builder.mutation({
      query: ({ lectureTitle, _id }) => ({
        url: `/${_id}`,
        body: { lectureTitle },
        method: "POST",
      }),
    }),
    getCourseLectures: builder.query({
      query: ({ _id }) => ({
        url: `/${_id}`,
        method: "GET",
      }),
    }),
    getLecture: builder.query({
      query: ({ _id }) => ({
        url: `/${_id}/lecture`,
        method: "GET",
      }),
    }),
    updateLecture: builder.mutation({
      query: ({ courseId, lectureId, formData }) => ({
        url: `/${courseId}/updateLecture/${lectureId}`,
        body: formData,
        method: "POST",
      }),
    }),
    deleteLecture: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/updateLecture/${lectureId}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const {
  useCreateLectureMutation,
  useGetCourseLecturesQuery,
  useUpdateLectureMutation,
  useDeleteLectureMutation,
  useGetLectureQuery
} = lectureApi;
