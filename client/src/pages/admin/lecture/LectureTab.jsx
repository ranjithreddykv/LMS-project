import ToggleButton from "@/components/ToggleButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  useDeleteLectureMutation,
  useUpdateLectureMutation,
} from "@/features/api/lectureApi";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureVideo, setLectureVideo] = useState(null);
  const [lectureFree, setLectureFree] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;
  const lectureId = params.lectureId;
  const purchased = false;
  const videoHandler = (e) => {
    const video = e.target.files[0];
    setLectureVideo(video);
  };
  const [
    updateLecture,
    { data: updatedLectureData, isLoading, isSuccess, error },
  ] = useUpdateLectureMutation();
  const [
    deleteLecture,
    {
      data: deleteLectureData,
      isLoading: deleteLectureLoading,
      isSuccess: deleteLectureSuccess,
      error: deleteLectureError,
    },
  ] = useDeleteLectureMutation();

  const lectureUpdateHandler = async () => {
    if (!lectureVideo) {
      toast.error("Video is required");
    }
    console.log(lectureFree);
    const formData = new FormData();
    formData.append("lectureTitle", lectureTitle);
    formData.append("lectureVideo", lectureVideo);
    formData.append("lectureFree", lectureFree ? "true" : "false");

    await updateLecture({ courseId, lectureId, formData });
  };
  const removeLectureHandler = async () => {
    await deleteLecture({ courseId, lectureId });
    navigate(`/admin/course/${courseId}/lecture`);
  };
  const lectureFreeHandler = () => {
    setLectureFree((prev) => !prev);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        updatedLectureData?.message || "Lecture updated successfully"
      );
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to updateLecture");
    }
  }, [isSuccess, error]);
  useEffect(() => {
    if (deleteLectureSuccess) {
      toast.success(
        deleteLectureData.message || "Lecture deleted successfully"
      );
    }
    if (deleteLectureError) {
      toast.error(
        deleteLectureError?.data?.message || "Error in deleting lecture"
      );
    }
  }, [deleteLectureSuccess, deleteLectureError]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit Lecture</CardTitle>
        <CardDescription>
          Make Changes and click save when done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <Button
            className="bg-red-500 p-5 max-w-50"
            onClick={removeLectureHandler}
          >
            {deleteLectureLoading ? (
              <Loader2 className="animate-spin w-3 h-3" />
            ) : (
              <>Remove Course</>
            )}
          </Button>
          <div>
            <Label className="font-bold text-lg">Title</Label>
            <Input
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Ex. Introduction to Docker and Containerization"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="video">
              Video{" "}
              <span className="text-red-600 text-lg font-bold ml-1">*</span>
            </Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              onChange={videoHandler}
            />
          </div>
          <div className="flex gap-2 flex-col md:flex-row">
            <ToggleButton isOn={lectureFree} onClick={lectureFreeHandler} />
            <p className="font-bold">Is this video FREE?</p>
          </div>
          <Button className=" p-5 max-w-50" onClick={lectureUpdateHandler}>
            {isLoading ? (
              <Loader2 className="animate-spin w-3 h-3" />
            ) : (
              <>{purchased ? <>Continue Watching</> : <>Buy Course Now</>}</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
