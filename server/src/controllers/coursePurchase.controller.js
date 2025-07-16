import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/ayncHandler.js";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { isValidObjectId } from "mongoose";
import { CoursePurchase } from "../models/coursePurchaseSchema.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course Not found");

  // Create a Stripe Checkout Session first
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: course.courseTitle,
            images: [course.courseThumbnail],
          },
          unit_amount: course.coursePrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:5173/course-progress/${courseId}`,
    cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
    metadata: {
      courseId: courseId.toString(),
      userId: userId.toString(),
    },
    shipping_address_collection: {
      allowed_countries: ["IN"],
    },
  });

  if (!session.url) {
    throw new ApiError(400, "Error while creating session");
  }

  // Now create the purchase record including paymentId
  const newPurchase = await CoursePurchase.create({
    courseId,
    userId,
    amount: course.coursePrice,
    status: "pending",
    paymentId: session.id,
  });

  return res.json(
    new ApiResponse(200, { url: session.url }, "Session created successfully")
  );
});

const stripeWebhook = asyncHandler(async (req, res) => {
  let event;
  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });
    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
  }
  //Handle the checkout session comleted event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const purchase = await CoursePurchase.findOne({
      paymentId: session.id,
    }).populate({ path: "courseId" });
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    if (session.amount_total) {
      purchase.amount = session.amount_total / 100;
    }
    purchase.status = "completed";
    //Make all lectures visible by setting 'isPreviewFree' to true
    if (purchase.courseId && purchase.courseId.lectures.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: purchase.courseId.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }
    await purchase.save();

    //Update user's enrolledCourses
    await User.findByIdAndUpdate(
      purchase.userId,
      { $addToSet: { enrolledCourses: purchase.courseId._id } },
      { new: true }
    );

    //Update course to add user ID to enrolled Students
    await Course.findByIdAndUpdate(
      purchase.courseId._id,
      { $addToSet: { enrolledStudents: purchase.userId } },
      { new: true }
    );
  }
});

export { createCheckoutSession, stripeWebhook };
