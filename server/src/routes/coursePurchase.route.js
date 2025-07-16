import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createCheckoutSession,
  stripeWebhook,
} from "../controllers/coursePurchase.controller.js";
const router = express.Router();

router
  .route("/checkout/create-checkout-session")
  .post(verifyJWT, createCheckoutSession);
router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), stripeWebhook);
router.route("/course/:courseId/detail-with-status").get(stripeWebhook); //I have to change this after words
//get all purchasedCourses
router.route("/").get(stripeWebhook); //I have to replace with new one purchased courses
export default router;

//stripe listen --forward-to http://localhost:8001//api/v1/purchase/webhook
