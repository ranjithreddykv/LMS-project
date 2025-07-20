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
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { toast } from "sonner";
const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCategory, setCourseCategory] = useState("");

  const [createCourse, { data, isLoading, error, isSuccess }] =
    useCreateCourseMutation();
  const navigate = useNavigate();

  const createCourseHandler = async () => {
    await createCourse({ courseTitle, courseCategory });
    navigate("/admin/course");
  };
  const getSelectedCategory = (value) => {
    setCourseCategory(value);
  };

  //for displaying message using toast

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created Successfully");
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to create course");
    }
  }, [data, isSuccess, error]);

  return (
    <div className="flex-1 mx-10 mt-15 space-y-4">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add course,add some basic course detail for your course
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, tempora?
        </p>
      </div>
      <div>
        <Label>Title</Label>
        <Input
          type="text"
          name="title"
          placeholder="Your Course Name"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
        />
      </div>
      <div className="space-y-4">
        <div>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select the category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
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
                <SelectItem value="Java">Java</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Docker">Docker</SelectItem>
                <SelectItem value="HTML">HTML</SelectItem>
                <SelectItem value="Tailwind CSS">Tailwind CSS</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-4 ">
        <Button variant="outline" onClick={() => navigate("/admin/course")}>
          Back
        </Button>
        <Button disabled={isLoading} onClick={createCourseHandler}>
          {isLoading ? (
            <>
              <Loader2 className="m-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Create Course"
          )}
        </Button>
      </div>
    </div>
  );
};

export default AddCourse;
