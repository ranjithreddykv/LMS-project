import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/ayncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { CourseProgress } from "../models/courseProgress.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Course } from "../models/course.model.js";
const getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  console.log(courseId);
  const userId = req.user._id;
  if (!isValidObjectId(courseId)) {
    throw new ApiError(404, "Invalid course ID");
  }
  //fetching user course progress
  let courseProgress = await CourseProgress.findOne({
    courseId,
    userId,
  }).populate("courseId");
  const courseDetails = await Course.findById(courseId).populate("lectures");
  if (!courseDetails) {
    throw new ApiError(404, "Course Not found");
  }
  //if no progress found,return course details with an empty progress
  if (!courseProgress) {
    return res.json(
      new ApiResponse(200, { courseDetails, progress: [], completed: false })
    );
  }
  //return the user's course progress along with course details
  return res.json(
    new ApiResponse(200, {
      courseDetails,
      progress: courseProgress.lectureProgress,
      completed: courseProgress.completed,
    })
  );
});

const updateLectureProgress = asyncHandler(async (req, res) => {
  const { courseId, lectureId } = req.params;
  const userId = req.user._id;
  //fetch or create course progress
  let courseProgress = await CourseProgress.findOne({ courseId, userId });
  const courseDetails = await Course.findById(courseId);
  if (!courseDetails) {
    throw new ApiError(404, "Course not found");
  }

  if (!courseProgress) {
    //if no courseProgress found ,create a new record
    courseProgress = await new CourseProgress.create({
      userId,
      courseId,
      completed: false,
      lectureProgress: [],
    });
  }
  //find the lectureProgress in the course progress
  const lectureIndex = courseProgress.lectureProgress.findIndex(
    (lecture) => lecture.lectureId === lectureId
  );
  if (lectureIndex !== -1) {
    //if lecture already exist, update its status
    courseProgress.lectureProgress[lectureIndex].viewed = true;
  } else {
    //add new lecture progress
    courseProgress.lectureProgress.push({
      lectureId,
      viewed: true,
    });
  }
  //if all lecture is completed make course button course button completed
  const lectureProgressLength = courseProgress.lectureProgress.filter(
    (lectureProg) => lectureProg.viewed
  ).length;
  const totalNumberOfLectures = courseDetails.lectures.length;
  if (lectureProgressLength === totalNumberOfLectures) {
    courseProgress.completed = true;
  }
  await courseProgress.save();
  return res.json(
    new ApiResponse(200, {}, "lecture progress updated successfully")
  );
});

const markCourseAsCompleted = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;
  const courseProgress = await CourseProgress.find({ courseId, userId });
  courseProgress.lectureProgress.map((lecture) => (lecture.viewed = true));
  await courseProgress.save();
  return res.json(new ApiError(200, {}, "Course marked as completed"));
});
const markCourseAsInCompleted = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;
  const courseProgress = await CourseProgress.find({ courseId, userId });
  courseProgress.lectureProgress.map((lecture) => (lecture.viewed = false));
  await courseProgress.save();
  return res.json(new ApiError(200, {}, "Course marked as incompleted"));
});

export {
  markCourseAsCompleted,
  markCourseAsInCompleted,
  updateLectureProgress,
  getCourseProgress,
};
