import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
const uploadOnCloudinary= async (localFilePath)=> {
    try {
    if (!localFilePath) {
        return null;
    }
    //upload file on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath,{resource_type: "auto"})
        //file has uploaded on cloudinary
        console.log("File uploaded successfully.");
    return response;
    } catch (e) {
        console.log(e)
        //remove the local saved temp file if upload fail
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export  {uploadOnCloudinary}