import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/ayncHandler.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { isValidObjectId } from "mongoose";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import getCloduinaryPublicId from "../utils/getPublicId.js";

const createLecture = asyncHandler(async (req, res) => {
  const { lectureTitle } = req.body;
  const courseId = req.params._id;
  if (!lectureTitle?.trim() || !courseId || !isValidObjectId(courseId)) {
    throw new ApiError(401, "Invalid Course Title or Course ID");
  }
  const lecture = await Lecture.create({ lectureTitle });
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");
  course.lectures.push(lecture._id);
  await course.save({ validateBeforeSave: false });
  return res.json(
    new ApiResponse(
      201,
      { course, lecture },
      "lecture added to course successfully"
    )
  );
});
const getCourseLectures = asyncHandler(async (req, res) => {
  const courseId = req.params._id;
  if (!courseId || !isValidObjectId(courseId))
    throw new ApiError(400, "Course ID is Invalid");
  const course = await Course.findById(courseId).populate("lectures");
  if (!course) throw new ApiError(404, "Course Not found");
  return res.json(
    new ApiResponse(
      200,
      { lectures: course.lectures },
      "Lectures fetched successfully"
    )
  );
});
const updateLecture = asyncHandler(async (req, res) => {
  const videoLocalPath = req.file?.path;
  const { lectureTitle, lectureFree } = req.body;
  const courseId = req.params.courseId;
  const lectureId = req.params.lectureId;
  if (!isValidObjectId(courseId) || !isValidObjectId(lectureId))
    throw new ApiError(400, "Invalid courseId or lectureId");
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course Not found");
  let videoUrl = "";
  try {
    if (videoLocalPath) {
      videoUrl = await uploadOnCloudinary(videoLocalPath);
      console.log("Video Uploaded to cloudinary successfully");
    }
  } catch (error) {
    console.error("Error in uploading Lecture video to cloudinary");
    throw new ApiError(500, "Failed to upload the Lecture video to cloudinary");
  }
  const publicId = getCloduinaryPublicId(videoUrl);
  const lecture = await Lecture.findByIdAndUpdate(
    lectureId,
    {
      lectureTitle,
      videoUrl,
      isPreviewFree: lectureFree,
      publicId,
    },
    { new: true, runValidators: true }
  );
  if (!lecture) throw new ApiError(404, "Lecture Not found");
  return res.json(new ApiResponse(201, lecture, "Lecture Updated successfully"));
});
const removeLecture = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const lectureId = req.params.lectureId;
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course Not found");
  const lecture = await Lecture.findById(lectureId);
  if (!lecture) throw new ApiError(404, "Lecture Not found");
  course.lectures = course.lectures.filter(
    (lecture) => lecture._id != lectureId
  );
  const publicId=lecture?.publicId;

  if(publicId){
    try{
    await deleteFromCloudinary(publicId);
    console.log("Video of lecture deleted from cloudinary successfully");
    }catch(error){
      console.log("Error occoured while deleting video from cloudinary");
      throw new ApiError(500,"Error occoured while deleting video from cloudinary");
    }
  }
  await course.save({ validateBeforeSave: false });
  return res.json(new ApiResponse(200, course.lectures, "Lecture removed successfully"));
});
export { createLecture, getCourseLectures, updateLecture, removeLecture };
