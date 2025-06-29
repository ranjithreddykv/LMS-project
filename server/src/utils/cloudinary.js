import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
// Your Cloudinary configuration and usage code goes here
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded on cloudinary ,File src : " + response.url);
    //once the file in uploaded ,we would like
    //to delete from our server
    fs.unlinkSync(localFilePath);
    return response.secure_url;
  } catch (error) {
    console.log("Error in cloudinary", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted from cloudinary. ", publicId);
  } catch (error) {
    console.log("Error in deleting from cloudinary", error);
    return null;
  }
};
export const deleteVideoFromCloudinary=async(publicId)=>{
  try {
    await cloudinary.uploader.destroy(publicId,{resource_type:"video"});
  } catch (error) {
    console.log(error);
    return null;
  }
}
export { uploadOnCloudinary, deleteFromCloudinary };
