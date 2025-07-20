import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateLectureMutation,
  useDeleteLectureMutation,
  useGetCourseLecturesQuery,
} from "@/features/api/lectureApi";
import Lecture from "./Lecture.jsx";

const CreateLecture = () => {
  const navigate = useNavigate();
  const { _id } = useParams();
  const [lectureTitle, setLectureTitle] = useState("");
  const [
    createLecture,
    {
      data: lectureCreateData,
      isLoading: createLectureLoading,
      isSuccess: createLectureSuccess,
      error: createLectureError,
    },
  ] = useCreateLectureMutation();
  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, _id });
  };
  const {
    data: getCourseLecturesData,
    isLoading: getCourseLecturesLoading,
    isError: getCourseLecturesError,
    refetch,
  } = useGetCourseLecturesQuery({ _id });
  const [deleteLecture, { isSuccess: deleteLectureSuccess }] =
    useDeleteLectureMutation();
  const lectures = getCourseLecturesData?.data?.lectures;
  console.log(lectures);
  useEffect(() => {
    if (createLectureSuccess) {
      toast.success(
        lectureCreateData?.message || "Lecture created successfully"
      );
      refetch();
    }
    if (createLectureError) {
      toast.error(
        createLectureError?.data?.message || "Error while creating lecture"
      );
    }
  }, [createLectureSuccess, createLectureError]);
  useEffect(() => {
    refetch();
  }, [deleteLectureSuccess]);
  return (
    <div>
      <div className="flex-1 mx-10 mt-15 space-y-4">
        <div className="mb-4">
          <h1 className="font-bold text-xl">
            Lets add lecture,add some basic lecture detail for your lecture
          </h1>
          <p>Lecture of the course are added here</p>
        </div>
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="title"
            placeholder="Your lecture Name"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>

        <div className="flex gap-4 ">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${_id}`)}
          >
            Back to Course
          </Button>
          <Button
            onClick={createLectureHandler}
            disabled={createLectureLoading}
          >
            {createLectureLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
      </div>
      <div className="mt-10 ml-10">
        {getCourseLecturesLoading ? (
          <p>Loading lectures....</p>
        ) : getCourseLecturesError ? (
          <>Error In Fetching lectures</>
        ) : lectures?.length === 0 ? (
          "You haven't created any lectures"
        ) : (
          lectures?.map((lecture, index) => (
            <Lecture
              key={lecture._id}
              lecture={lecture}
              courseId={_id}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CreateLecture;
