import {v2 as cloudinary} from 'cloudinary';
// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const deleteOnCloudinary = async (publicId)=> {
    try {
        if (!publicId) {
            return null;
        }
        //upload file on cloudinary
        const response = await cloudinary.uploader.destroy(publicId)
        //file has uploaded on cloudinary
        if (!response){
            new Error(`Cloud invalid cloudinary id ${publicId}`);
        }
        return response;
    } catch (e) {
        console.log(e)
        //remove the local saved temp file if upload fail
        return null;
    }
}

export  {deleteOnCloudinary}