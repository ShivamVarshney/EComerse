import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload file
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // auto-detects image/video
    });

    // Remove local file after successful upload
    fs.unlinkSync(localFilePath);

    console.log("✅ File uploaded to Cloudinary:", response.url);
    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    fs.unlinkSync(localFilePath); // remove temp file if upload fails
    return null;
  }
};

export { uploadOnCloudinary };
