import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function handleUploadVideo(
  filePath: string
): Promise<{ url: string; publicId: string }> {
  const response = await cloudinary.uploader.upload(filePath, {
    resource_type: 'video',
    folder: 'trainer2',
  });

  return {
    url: response.secure_url,
    publicId: response.public_id,
  };
}
