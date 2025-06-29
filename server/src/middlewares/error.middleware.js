import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  let customError = err;

  if (!(customError instanceof ApiError)) {
    const statusCode =
      err.statusCode || err instanceof mongoose.Error ? 400 : 500;
    const message = err.message || "Something went wrong";

    customError = new ApiError(
      statusCode,
      message,
      err?.errors || [],
      err.stack
    );
  }

  const responseBody = {
    success: false,
    statusCode: customError.statusCode,
    message: customError.message,
    errors: customError.errors,
    ...(process.env.NODE_ENV === "development" && { stack: customError.stack }),
  };

  return res.status(customError.statusCode).json(responseBody);
};

export { errorHandler };
