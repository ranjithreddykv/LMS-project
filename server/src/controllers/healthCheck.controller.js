import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/ayncHandler.js";


const healthCheck=asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,"Health Check passed"));
})

export {healthCheck};