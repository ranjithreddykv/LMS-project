import { Router } from "express";
import {
  createCourse,
  deleteTheCourse,
  getAllCourse,
  publishTheCourse,
  updateCourse,
  getCourseDetails,
  getPublishedCourse,
  searchCourse,
} from "../controllers/course.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/").post(verifyJWT, createCourse);
router.route("/search").get(verifyJWT,searchCourse); 
router.route("/").get(verifyJWT, getAllCourse);
router
  .route("/update/:_id")
  .post(verifyJWT, upload.single("courseThumbnail"), updateCourse);
router.route("/publish/:_id").patch(verifyJWT, publishTheCourse);
router.route("/delete/:_id").patch(verifyJWT, deleteTheCourse);
router.route("/getCourse/:_id").get(verifyJWT, getCourseDetails);
router.route("/getPublishedCourses").get(getPublishedCourse);
export default router;
