import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/ayncHandler.js";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { isValidObjectId } from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createCourse = asyncHandler(async (req, res) => {
  const { courseTitle, courseCategory } = req.body;
  if (!courseTitle || !courseCategory) {
    throw new ApiError(400, "Course Title and category are required.");
  }
  const course = await Course.create({
    courseTitle,
    category: courseCategory,
    creator: req.user._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(201, { course }, "Course created successfully"));
});
const getAllCourse = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError("401", "You are not authorized");
  }
  const allCourses = await Course.find({ creator: userId });
  let message = "courses fetched successfully";
  if (allCourses.length === 0) {
    message = "You haven't created any courses at";
  }
  return res.json(new ApiResponse(200, allCourses, message));
});
const updateCourse = asyncHandler(async (req, res) => {
  const courseId = req.params._id;
  const {
    courseTitle,
    subTitle,
    description,
    category,
    courseLevel,
    coursePrice,
  } = req.body;
  const courseThumbnailLocalPath = req.file?.path;
  if (!isValidObjectId(courseId)) {
    throw new ApiError(400, "Course Id in invalid");
  }
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course Not found");
  }
  let courseThumbnail = "";
  try {
    if (courseThumbnailLocalPath) {
      courseThumbnail = await uploadOnCloudinary(courseThumbnailLocalPath);
      console.log("course tumbnail uploaded to coloudinary", courseThumbnail);
    }
  } catch (error) {
    console.error("Error in uploading tumbnail to cloudinary");
    throw new ApiError(500, "Failed to upload the tumbnail to cloudinary");
  }

  const data = {
    courseTitle,
    subTitle,
    description,
    category,
    courseLevel,
    courseThumbnail,
    coursePrice,
  };

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { $set: data }, //$set aggregate function or spred operator otherwise it will correctly spreed the data object
    { new: true, runValidators: true }
  );
  return res.json(
    new ApiResponse(201, updatedCourse, "Course updated successfully")
  );
});
const publishTheCourse = asyncHandler(async (req, res) => {
  const courseId = req.params._id;
  if (!isValidObjectId(courseId)) {
    throw new ApiError(400, "Course Id is invalid");
  }
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course Not found");
  }
  course.isPublished = true;
  await course.save({ validateBeforeSave: false });
  return res.json(
    new ApiResponse(200, course, "Course Published successfully")
  );
});
const deleteTheCourse = asyncHandler(async (req, res) => {
  const courseId = req.params._id;
  if (!isValidObjectId(courseId)) {
    throw new ApiError(400, "Course Id is invalid");
  }
  const course = await Course.findByIdAndDelete(courseId);
  if (!course) {
    throw new ApiError(404, "Course Not found");
  }
  return res.json(new ApiResponse(200, course, "Course deleted successfully"));
});

const getCourseDetails = asyncHandler(async (req, res) => {
  const courseId = req.params._id;
  if (!isValidObjectId(courseId)) {
    throw new ApiError(400, "Course Id is invalid");
  }
  const course = await Course.findById(courseId).populate("lectures creator");
  if (!course) {
    throw new ApiError(404, "Course Not found");
  }
  return res.json(
    new ApiResponse(200, course, "Course data fetched successfully")
  );
});
const getPublishedCourse = asyncHandler(async (req, res) => {
  const publishedCourses = await Course.find({
    isPublished: true,
  }).populate("creator");
  if (!publishedCourses)
    throw new ApiError(404, "Currently courses are not available");
  return res.json(
    new ApiResponse(
      200,
      publishedCourses,
      "published courses fetched succesfully"
    )
  );
});
export {
  getPublishedCourse,
  createCourse,
  getAllCourse,
  updateCourse,
  publishTheCourse,
  deleteTheCourse,
  getCourseDetails,
};
