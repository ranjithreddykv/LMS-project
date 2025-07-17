import express from "express";
import logger from "./logger.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import dotenv from "dotenv";
const morganFormat = ":method :url :status :response-time ms";
dotenv.config({
  path: "./.env",
});
const app = express();

app.post(
  "/api/v1/purchase/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);



app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//common middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//extended:true it tells to use qs library to parse the url-encoded data like form data and unable to access throw req.body
//<input name="user[name]" value="John" />
//req.body = { user: { name: 'John' } }

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
//convert cookie data into key value pair
app.use(cookieParser());

//import routes
import healthCheckRoute from "./routes/healthCheck.routes.js";
import userRoute from "./routes/user.routes.js";
import courseRoute from "./routes/course.route.js";
import lectureRoute from "./routes/lecture.route.js";
import purchaseRoute from "./routes/coursePurchase.route.js"
import { stripeWebhook } from "./controllers/coursePurchase.controller.js";
//routes
app.use("/api/v1/healthCheck", healthCheckRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/lecture", lectureRoute);


app.use(errorHandler);
export { app };
