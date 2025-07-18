import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createCheckoutSession,
  getAllPurchasedCourse,
  getCourseDetailWithPurchaseStatus,
  stripeWebhook,
} from "../controllers/coursePurchase.controller.js";
const router = express.Router();

router
  .route("/checkout/create-checkout-session")
  .post(verifyJWT, createCheckoutSession);


router.route("/course/:courseId/detail-with-status").get(verifyJWT,getCourseDetailWithPurchaseStatus); 
router.route("/").get(verifyJWT,getAllPurchasedCourse); 
export default router;

//stripe listen --forward-to http://localhost:8001/api/v1/purchase/webhook

