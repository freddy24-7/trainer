'use server';

import { v2 as cloudinary } from 'cloudinary';

if (
  !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
  !process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
) {
  throw new Error('Missing required Cloudinary environment variables');
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function deleteVideoFromCloudinary(
  videoPublicId: string
): Promise<void> {
  const cloudinaryResponse = await cloudinary.uploader.destroy(videoPublicId, {
    resource_type: 'video',
  });

  console.log('Cloudinary Deletion Response:', cloudinaryResponse);

  if (cloudinaryResponse.result !== 'ok') {
    console.error(`Cloudinary deletion failed: ${cloudinaryResponse.result}`);
    throw new Error(`Failed to delete video: ${cloudinaryResponse.result}`);
  }
}
