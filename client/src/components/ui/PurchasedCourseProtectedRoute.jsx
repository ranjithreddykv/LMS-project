import { useGetCourseDetailsWithStatusQuery } from "@/features/api/purchaseApi";
import React from "react";
import { Navigate, useParams } from "react-router-dom";

const PurchasedCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();
  const {data,isLoading}=useGetCourseDetailsWithStatusQuery(courseId);
  if(isLoading) return <p>Loading...</p>
  return data?.data?.purchased ? children : <Navigate to={`/course-details/${courseId}`}/>
};

export default PurchasedCourseProtectedRoute;
