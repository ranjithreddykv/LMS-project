import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useGetCoursesQuery } from "@/features/api/courseApi";
import { toast } from "sonner";
import { Edit } from "lucide-react";
const CourseTable = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetCoursesQuery();
  if (isLoading) {
    return <h1>Loading</h1>;
  }
  const courses = data?.data;

  return (
    <div className="mt-12 max-w-6xl mx-auto p-6 space-y-8 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Courses</h2>
        <Button
          onClick={() => navigate("create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          + Create New Course
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full text-sm text-gray-700">
          <TableCaption className="text-sm text-gray-500 mt-2">
            List of courses you have created
          </TableCaption>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="px-6 py-3 text-left font-semibold">
                Title
              </TableHead>
              <TableHead className="px-6 py-3 text-left font-semibold">
                Price
              </TableHead>
              <TableHead className="px-6 py-3 text-right font-semibold">
                Status
              </TableHead>
              <TableHead className="px-6 py-3 text-right font-semibold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses?.map((course, idx) => (
              <TableRow
                key={course._id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="px-6 py-4 font-medium">
                  {course?.courseTitle}
                </TableCell>
                <TableCell className="px-6 py-4">
                  ₹{course?.coursePrice || "NA"}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      course?.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {course?.isPublished ? "Published" : "Draft"}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-gray-100"
                    onClick={() => navigate(`${course._id}`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseTable;
