import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/ayncHandler.js";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { isValidObjectId } from "mongoose";
import { CoursePurchase } from "../models/coursePurchaseSchema.js";