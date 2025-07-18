import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";

import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const { courseId } = useParams();
  const [currentLecture, setCurrentLecture] = useState(null);

  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);
  const [
    completeCourse,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useCompleteCourseMutation();
  const [
    InCompleteCourse,
    { data: markInCompleteData, isSuccess: inCompleteSuccess },
  ] = useInCompleteCourseMutation();
  const [updateLectureProgress] = useUpdateLectureProgressMutation({
    courseId,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load course details</p>;

  const courseDetails = data?.data?.courseDetails;
  const completed = data?.data?.completed;
  const progress = data?.data?.progress;
  const initialLecture = currentLecture || courseDetails?.lectures?.[0];

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const updateLectureProgressHandler = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const courseCompleteHandler = async () => {
    await completeCourse({ courseId });
    refetch();
  };

  const courseInCompleteHandler = async () => {
    await InCompleteCourse({ courseId });
    refetch();
  };

  

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-20 px-6 w-full max-w-7xl mx-auto">
      {/* Left Section - Video & Title */}
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="text-4xl font-extrabold text-gray-800">
          {courseDetails?.courseTitle}
        </h1>

        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <ReactPlayer
            width="100%"
            height="400px"
            src={currentLecture?.videoUrl || initialLecture?.videoUrl}
            controls
            onPlay={() =>
              updateLectureProgressHandler(
                currentLecture?._id || initialLecture?._id
              )
            }
          />
          <p className="mt-4 font-semibold text-xl text-gray-700">
            Lecture{" "}
            {courseDetails.lectures.findIndex(
              (lec) => lec._id === (currentLecture?._id || initialLecture?._id)
            ) + 1}{" "}
            : {currentLecture?.lectureTitle || initialLecture?.lectureTitle}
          </p>
        </div>
      </div>

      {/* Right Section - Course List */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="flex justify-end">
          <Button
            variant={completed ? "outline" : "default"}
            onClick={
              completed ? courseInCompleteHandler : courseCompleteHandler
            }
            className="w-full md:w-auto"
          >
            {completed ? (
              <div className="flex flex-row items-center gap-2 ">
                <CheckCircle size={12} /> <span>Completed</span>
              </div>
            ) : (
              "Mark as completed"
            )}
          </Button>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800">
          Course Lectures
        </h2>

        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
          {courseDetails?.lectures?.map((lecture) => (
            <Card
              key={lecture?._id}
              onClick={() => setCurrentLecture(lecture)}
              className="flex flex-row mb-3 justify-between items-center pr-2 hover:cursor-pointer transition transform"
            >
              <CardContent className="flex items-center p-4">
                <div className="flex items-center">
                  {isLectureCompleted(lecture._id) ? (
                    <CheckCircle2 size={24} className="text-green-500 mr-2" />
                  ) : (
                    <CirclePlay size={24} className="text-green-500 mr-2" />
                  )}
                </div>
                <CardTitle className="text-lg font-medium">
                  {lecture?.lectureTitle}
                </CardTitle>
              </CardContent>

              {isLectureCompleted(lecture._id) && (
                <Badge
                  variant="outline"
                  className="bg-green-200 text-green-600"
                >
                  Completed
                </Badge>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
