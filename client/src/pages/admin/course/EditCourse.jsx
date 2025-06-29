import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteCourseMutation,
  usePublishCourseMutation,
  useUpdateCourseMutation,
  useGetCourseQuery,
} from "@/features/api/courseApi";

const EditCourse = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [courseTitle, setCourseTitle] = useState("");
  const [courseSubTitle, setCourseSubTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [courseLevel, setCourseLevel] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseThumbnail, setCourseThumbnail] = useState("");

  const { data: courseData } = useGetCourseQuery(_id);

  useEffect(() => {
    if (courseData) {
      setCourseTitle(courseData?.data.courseTitle || "");
      setCourseSubTitle(courseData?.data.subTitle || "");
      setCourseDescription(courseData.description || "");
      setCourseCategory(courseData.category || "");
      setCourseLevel(courseData.courseLevel || "");
      setCoursePrice(courseData.coursePrice || "");
      setCourseThumbnail(""); // reset thumbnail input
    }
  }, [courseData]);

  const [
    updateCourse,
    {
      data: updatedCourse,
      isLoading,
      isSuccess: courseUpdatedSuccess,
      error: courseUpdateError,
    },
  ] = useUpdateCourseMutation();

  const [
    publishCourse,
    {
      isLoading: publishCourseLoading,
      data: publishedCourseData,
      isSuccess: coursePublished,
      error: errorInCoursePublish,
    },
  ] = usePublishCourseMutation();

  const [
    deleteCourse,
    {
      isLoading: deleteCourseLoading,
      data: deletedCourseData,
      isSuccess: courseDeleted,
      error: errorInDeletingCourse,
    },
  ] = useDeleteCourseMutation();

  const getSelectedCategory = (value) => setCourseCategory(value);
  const getSelectedLevel = (value) => setCourseLevel(value);

  const thumbnailChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setCourseThumbnail(file);
  };

  const saveChangesHandler = async () => {
    if (
      !courseTitle ||
      !courseDescription ||
      !courseCategory ||
      !courseLevel ||
      !coursePrice
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("courseTitle", courseTitle);
    formData.append("subTitle", courseSubTitle);
    formData.append("description", courseDescription);
    formData.append("category", courseCategory);
    formData.append("courseLevel", courseLevel);
    formData.append("coursePrice", coursePrice);
    if (courseThumbnail) formData.append("courseThumbnail", courseThumbnail);

    await updateCourse({ formData, _id });
  };

  const publishCourseHandler = async () => {
    await publishCourse({ _id });
  };

  const deleteCourseHandler = async () => {
    await deleteCourse({ _id });
  };

  const cancelHandler = () => {
    if (courseData) {
      setCourseTitle(courseData.courseTitle || "");
      setCourseSubTitle(courseData.subTitle || "");
      setCourseDescription(courseData.description || "");
      setCourseCategory(courseData.category || "");
      setCourseLevel(courseData.courseLevel || "");
      setCoursePrice(courseData.coursePrice || "");
      setCourseThumbnail("");
    }
  };

  // Toast side effects
  useEffect(() => {
    if (courseUpdatedSuccess) {
      toast.success(updatedCourse?.message || "Course updated successfully");
    }
    if (courseUpdateError) {
      toast.error(courseUpdateError?.data?.message || "Error updating course");
    }
  }, [courseUpdatedSuccess, courseUpdateError]);

  useEffect(() => {
    if (coursePublished) {
      toast.success(
        publishedCourseData?.message || "Course published successfully"
      );
    }
    if (errorInCoursePublish) {
      toast.error(
        errorInCoursePublish?.data?.message || "Error publishing course"
      );
    }
  }, [coursePublished, errorInCoursePublish]);

  useEffect(() => {
    if (courseDeleted) {
      toast.success(
        deletedCourseData?.message || "Course deleted successfully"
      );
      navigate("/admin/course");
    }
    if (errorInDeletingCourse) {
      toast.error(
        errorInDeletingCourse?.data?.message || "Error deleting course"
      );
    }
  }, [courseDeleted, errorInDeletingCourse]);

  return (
    <div className="mt-13 p-5 space-y-8">
      <div className="flex flex-row justify-between">
        <h1 className="font-bold text-2xl">Edit Course Details</h1>
        <button
          className="mt-1.5 font-bold"
          onClick={() => navigate("lecture")}
        >
          Go to lecture page
        </button>
      </div>

      <div className="mt-8">
        <div className="flex justify-between">
          <div>
            <h1 className="font-bold">Basic Information</h1>
            <p>
              Make changes to your course here. Click save when you're done.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={publishCourseHandler}
              disabled={publishCourseLoading}
            >
              {publishCourseLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Publish"
              )}
            </Button>
            <Button
              onClick={deleteCourseHandler}
              disabled={deleteCourseLoading}
            >
              {deleteCourseLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Remove Course"
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid w-full items-center gap-3">
        <Label>Title</Label>
        <Input
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="Ex. Fullstack Development"
          className="bg-gray-100"
        />
      </div>

      <div className="grid w-full items-center gap-3">
        <Label>SubTitle</Label>
        <Input
          type="text"
          value={courseSubTitle}
          onChange={(e) => setCourseSubTitle(e.target.value)}
          placeholder="Ex. Become a MERN developer"
          className="bg-gray-100"
        />
      </div>

      <div className="grid w-full gap-3">
        <Label>Description</Label>
        <Textarea
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          placeholder="Course description"
        />
      </div>

      <div className="flex flex-row w-full justify-between">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={courseCategory} onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem value="Next JS">Next JS</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Frontend Development">
                  Frontend Development
                </SelectItem>
                <SelectItem value="Fullstack Development">
                  Fullstack Development
                </SelectItem>
                <SelectItem value="MERN Stack Development">
                  MERN Stack Development
                </SelectItem>
                <SelectItem value="Javascript">Javascript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Docker">Docker</SelectItem>
                <SelectItem value="HTML">HTML</SelectItem>
                <SelectItem value="Tailwind CSS">Tailwind CSS</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Course Level</Label>
          <Select value={courseLevel} onValueChange={getSelectedLevel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Levels</SelectLabel>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price (INR)</Label>
          <Input
            value={coursePrice}
            onChange={(e) => setCoursePrice(e.target.value)}
            type="number"
            placeholder="₹499"
          />
        </div>
      </div>

      <div className="grid w-full max-w-sm items-center gap-3">
        <Label>Thumbnail</Label>
        <Input onChange={thumbnailChangeHandler} accept="image/*" type="file" />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={cancelHandler}>
          Cancel
        </Button>
        <Button onClick={saveChangesHandler} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default EditCourse;
