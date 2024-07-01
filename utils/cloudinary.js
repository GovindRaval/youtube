import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    console.log(localFilePath);
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })
        console.log("file is uploaded in cloudinary successfully", response.url)
        return response;
    } catch (error) {

        fs.unlinkSync(localFilePath)
        return null
    }


}