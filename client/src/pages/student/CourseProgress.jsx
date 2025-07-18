import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  CheckCircle2,
  CirclePlay,
  PlayCircle,
} from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";

const CourseProgress = () => {
  const isCompleted = true;
  return (
    <div className="flex flex-col md:flex-row gap-8 mt-20 px-6 w-full max-w-7xl mx-auto">
      {/* Left Section - Video & Title */}
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Mastering Docker: From Beginner to Pro
        </h1>

        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <ReactPlayer
            width="100%"
            height="400px"
            src="https://www.youtube.com/watch?v=JMvWrx_rLw4&t=48352s"
            controls
          />
          <p className="mt-4 font-semibold text-xl text-gray-700">
            Lecture 1: Introduction to Docker and Containerization
          </p>
        </div>
      </div>

      {/* Right Section - Course List */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="flex justify-end">
          <Button className="w-full md:w-auto">Mark as Completed</Button>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800">
          Course Lectures
        </h2>

        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto ">
          {[1, 2, 3, 4].map((lecture, ind) => (
            <Card
              key={ind}
              className="flex flex-row mb-3 justify-between items-center pr-2 hover:cursor-pointer transition transform"
            >
              <CardContent className="flex  items-center p-4">
                <div className="flex items-center">
                  {isCompleted ? (
                    <CheckCircle2 size={24} className="text-green-500 mr-2" />
                  ) : (
                    <CirclePlay size={24} className="text-green-500 mr-2" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">
                    Introduction to Docker
                  </CardTitle>
                </div>
              </CardContent>
              <Badge variant="outline" className="bg-green-200 text-green-600 ">
                Completed
              </Badge>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
