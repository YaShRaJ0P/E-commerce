import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const uploadOnCloudinary = async (localFilePath: string): Promise<string | null> => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image",
        });
        return response.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath);
        return null;
    }
};

export { uploadOnCloudinary };
