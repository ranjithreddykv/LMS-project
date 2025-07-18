import React from "react";
import ReactPlayer from "react-player";
import { Info, Lock, PlayCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseDetailsWithStatusQuery } from "@/features/api/purchaseApi";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BuyCourseButton from "@/components/ui/BuyCourseButton";

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const { data, isLoading, isSuccess, isError } =
    useGetCourseDetailsWithStatusQuery(courseId);
  const navigate=useNavigate();
  const course = data?.data?.course;
  const purchased = data?.data?.purchased;

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <h1 className="text-xl font-semibold">Loading course details...</h1>
      </div>
    );

  if (isError || !course)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <h1 className="text-xl font-semibold text-red-600">
          Error fetching course details.
        </h1>
      </div>
    );

  const {
    courseTitle,
    subTitle,
    creator,
    updatedAt,
    enrolledStudents = 0,
    description,
    lectures = [],
  } = course;

  const handleContinueCourse=()=>{
    if(purchased){
      navigate(`/course-progress/${courseId}`);
    }
  }
  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex flex-col gap-3 px-6 py-8 md:px-16 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 rounded-b-xl">
        <h1 className="text-3xl md:text-5xl font-bold">{courseTitle}</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-purple-300 dark:text-purple-700">
          {subTitle}
        </h2>
        <p className="text-base md:text-lg font-bold">
          Created By{" "}
          <span className="underline font-extrabold">{creator?.name}</span>
        </p>
        <p className="font-medium text-sm md:text-base">
          <Info className="w-5 h-5 inline mr-1" />
          Last updated:{" "}
          <span className="font-semibold">
            {updatedAt?.substring(0, 10) || "N/A"}
          </span>
        </p>
        <p className="text-sm md:text-base font-bold">
          Students Enrolled: {enrolledStudents.length}
        </p>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 md:px-16 py-10">
        {/* Description + Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            <h3 className="text-2xl font-semibold mb-2">Course Description</h3>
            <p className="text-gray-700 dark:text-gray-300">{description}</p>
          </div>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>Lectures - {lectures.length}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lectures.map((lecture, i) => (
                <div key={i} className="flex items-center gap-2">
                  {lecture.isPreviewFree ? (
                    <PlayCircle className="text-green-500" />
                  ) : (
                    <Lock className="text-red-500" />
                  )}
                  <span>{lecture.lectureTitle}</span>
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

        {/* Video Preview & CTA */}
        <Card className="flex flex-col items-center justify-between gap-4 p-4">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="w-full aspect-video mb-4 rounded overflow-hidden">
              {lectures.length > 0 && lectures[0].videoUrl ? (
                <ReactPlayer
                  controls
                  src={lectures[0].videoUrl}
                />
              ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-600">
                  No Preview Available
                </div>
              )}
            </div>
            <p className="font-semibold text-lg text-center">
              Introduction to {courseTitle.split(" ")[0] || "Course"}
            </p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-500">
              ₹239
            </p>
          </CardContent>
          <CardFooter className="w-full">
            {purchased ? (
              <Button onClick={handleContinueCourse} className="w-full bg-purple-700 hover:bg-purple-800 text-white">
                Continue to Course
              </Button>
            ) : (
              <BuyCourseButton courseId={courseId} />
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
