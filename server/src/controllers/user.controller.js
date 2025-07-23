import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/ayncHandler.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import getCloduinaryPublicId from "../utils/getPublicId.js";
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not exist");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somthing went wrong while generating access and refresh token"
    );
  }
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password?.trim())
    throw new ApiError(400, "Invalid credentials");
  const user = await User.findOne({ email });
  if (user) {
    throw new ApiError(403, "User with email already exist");
  }
  //password hashing using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const newUser = new User({ name, email, password });
  await newUser.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { name: newUser.name, email: newUser.email },
        "User created successfully"
      )
    );
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim()) {
    throw new ApiError(400, "Invalid email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User with email not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(isPasswordValid);
  if (!isPasswordValid) throw new ApiError(403, "Incorrect password");
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { name: user.name, email: user.email, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (user?.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed succesfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while handling refresh token"
    );
  }
});
const logout = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out succesfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!isValidObjectId(userId)) throw new ApiError(403, "Invalid userID");
  const user = await User.findById(userId)
    .select("-password")
    .populate("enrolledCourses");
  console.log(user);
  if (!user) throw new ApiError(404, "User not found");
  return res.json(
    new ApiResponse(200, user, "user profile data fetched successfully")
  );
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(403, "Invalid user");
  }

  const { name } = req.body;
  const profilePhotoLocalPath = req.file?.path;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const publicId = getCloduinaryPublicId(user.photoUrl);
  if (user.photoUrl !== "" && !publicId)
    throw new ApiError(403, "Invalid photo url");

  let profilePhotoUrl = "";

  if (profilePhotoLocalPath) {
    try {
      profilePhotoUrl = await uploadOnCloudinary(profilePhotoLocalPath);
      console.log("Uploaded to Cloudinary:", profilePhotoUrl);
      deleteFromCloudinary(publicId);
      console.log("Old profile photo deleted successfully");
    } catch (error) {
      console.error("Error uploading profile photo", error);
      throw new ApiError(500, "Failed to upload profile photo");
    }
  }

  if (name?.trim()) {
    user.name = name.trim();
  }

  if (profilePhotoUrl) {
    user.photoUrl = profilePhotoUrl;
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});
const upgradeToInstructor = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "user not found");
  user.role = "instructor";
  user.save({ validateBeforeSave: false });
  return res.json(201, {}, "role is upgraded to instructor");
});

export {
  register,
  login,
  refreshAccessToken,
  logout,
  getUserProfile,
  updateProfile,
  upgradeToInstructor
};
