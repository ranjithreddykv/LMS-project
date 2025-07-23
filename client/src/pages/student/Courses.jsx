import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import React, { useEffect } from "react";
import CourseSkeleton from "@/components/CourseSkeleton";
import Course from "@/components/Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";

const Courses = () => {
  
  const { data, isLoading, isSuccess, error } = useGetPublishedCourseQuery();
  const publishedCourses=data?.data;
  if(error){
    return <h1>Some error occoured while fething courses</h1>
  }
  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : publishedCourses.map((course, ind) => <Course key={ind} course={course} />)}
        </div>
      </div>
    </div>
  );
};

export default Courses;
