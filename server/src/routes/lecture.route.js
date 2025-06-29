import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createLecture,
  getCourseLectures,
  removeLecture,
  updateLecture,
} from "../controllers/lecture.controller.js";
const router = Router();

router.route("/:_id").post(verifyJWT, createLecture);
router.route("/:_id").get(verifyJWT, getCourseLectures);
router
  .route("/:courseId/updateLecture/:lectureId")
  .post(verifyJWT,upload.single("lectureVideo"), updateLecture)
  .delete(verifyJWT,removeLecture);
export default router;
