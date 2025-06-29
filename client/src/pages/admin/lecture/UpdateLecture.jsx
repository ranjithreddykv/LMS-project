import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";

const UpdateLecture = () => {
  const params = useParams();
  const courseId = params.courseId;
  return (
    <div className="flex flex-col space-y-4 mb-5 mt-15">
      <div className="flex items-center gap-2">
        <Link to={`/admin/course/${courseId}/lecture`}>
          <Button
            size="incon"
            className="rounded-full w-15 h-15"
            variant="outline"
          >
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mt-1">Update Your Lecture</h1>
      </div>
      <LectureTab />
    </div>
  );
};

export default UpdateLecture;
