import React from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const Course = ({ course }) => {
  const navigate = useNavigate();
  const courseId=course?._id;
  return (
    <Card
      className="mt-0 pt-0 overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
      onClick={() => navigate(`course-details/${courseId}`)}
    >
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src={course?.courseThumbnail}
          alt="Courses"
        />
      </div>
      <CardContent className="px-5 py-1 space-y-5">
        <h1 className="hover:underline font-bold text-lg truncate">
          {course?.courseTitle}
        </h1>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-300 shadow-md">
              <img
                src={
                  course?.creator?.photoUrl || "https://github.com/shadcn.png"
                }
                alt="Creator"
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="font-md text-sm">{course?.creator?.name}</h1>
          </div>
          <Badge className="bg-blue-600 text-white px-2 py-2 text-xs rounded-full">
            {course?.courseLevel}
          </Badge>
        </div>
        <div className="text-lg font-bold">
          <span>₹499</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Course;
