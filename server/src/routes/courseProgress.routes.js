import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getCourseProgress, markCourseAsCompleted, markCourseAsInCompleted, updateLectureProgress } from "../controllers/courseProgress.controller.js";

const router=new Router();

router.route("/:courseId").get(verifyJWT,getCourseProgress);
router.route("/:courseId/lecture/:lectureId/view").post(verifyJWT,updateLectureProgress);
router.route("/:courseId/complete").post(verifyJWT,markCourseAsCompleted)
router.route("/:courseId/complete").post(verifyJWT,markCourseAsInCompleted)

export default router;