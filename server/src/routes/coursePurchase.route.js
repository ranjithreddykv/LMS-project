import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createCheckoutSession, stripeWebhook } from "../controllers/coursePurchase.controller";
const router=express.Router();

router.route("/checkout/create-checkout-session").post(verifyJWT,createCheckoutSession)
router.route("/webhook").post(express.raw({type:"application/json"}),stripeWebhook);
router.route("/course/:courseId/detail-with-status").get();
//get all purchasedCourses
router.route("/").get();
export default router