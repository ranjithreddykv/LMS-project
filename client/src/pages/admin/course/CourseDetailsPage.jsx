import { useGetCourseQuery, useGetPublishedCourseQuery } from "@/features/api/courseApi";
import { Info, Lock, PlayCircle } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import BuyCourseButton from "@/components/ui/BuyCourseButton";

const CourseDetailsPage = () => {
  const {courseId}=useParams();
  const {data,isLoading,error} = useGetCourseQuery({courseId});
  const courseDetails=data?.data;
  if(error) return <h1>Error in Fetching course details</h1>
  const purchasedCourse=false;
  return (
    <div className="mt-10">
      {/* Course Header */}
      <div className="flex flex-col gap-3 px-6 py-8 md:px-16 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900">
        <h1 className="text-3xl md:text-5xl font-bold">
          {courseDetails?.courseTitle}
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-purple-300 dark:text-purple-700">
          {courseDetails?.subTitle}
        </h2>
        <p className="text-base md:text-lg font-bold">
          Created By{" "}
          <span className="underline font-extrabold">
            {courseDetails?.creator?.name}
          </span>
        </p>
        <p className="font-medium text-sm md:text-base">
          <Info className="w-5 h-5 inline mr-1" />
          Last updated:{" "}
          <span className="font-semibold">
            {courseDetails?.updatedAt?.substring(0, 10)}
          </span>
        </p>
        {/* I have to update it later */}
        <p className="text-sm md:text-base font-bold">
          Students Enrolled:{<>0</> || courseDetails?.enrolledStudents}
        </p>
      </div>

      {/* Course Body */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-16 py-10">
        {/* Description & Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            <h3 className="text-2xl font-semibold mb-2">Course Description</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {courseDetails?.description}
            </p>
          </div>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                <>Lectures-</>
                {courseDetails?.lectures?.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {courseDetails?.lectures?.map((lecture, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span>{lecture?.isPreviewFree ?<PlayCircle/>:<Lock/>}</span>

                  <span>{lecture?.lectureTitle}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                More content coming soon...
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Video Preview & Pricing */}
        <Card className="flex flex-col items-center justify-between gap-4 p-4">
          <CardContent className="flex flex-col items-center gap-4">
            <video
              className="rounded-lg border"
              width="100%"
              height="auto"
              controls
            >
              <source
                src={courseDetails?.lectures?.[0]?.videoUrl}
                type="video/*"
              />
              Your browser does not support the video tag.
            </video>
            <p className="font-semibold text-lg">Introduction to Next.js</p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-500">
              ₹239
            </p>
          </CardContent>
          <CardFooter>
           { purchasedCourse?(<Button className="w-full bg-purple-700 hover:bg-purple-800 text-white">
              Buy Course Now
            </Button>):<BuyCourseButton courseId={courseId}/>}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
