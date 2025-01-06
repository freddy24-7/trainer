import { v2 as cloudinary } from 'cloudinary';

// Validate server-side environment variables
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    'Missing required Cloudinary environment variables for server'
  );
}

// Configure Cloudinary for server-side use
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteVideoFromCloudinaryServer(
  videoPublicId: string
): Promise<void> {
  try {
    const cloudinaryResponse = await cloudinary.uploader.destroy(
      videoPublicId,
      {
        resource_type: 'video',
      }
    );

    console.log('Cloudinary Server Deletion Response:', cloudinaryResponse);

    if (cloudinaryResponse.result !== 'ok') {
      console.error(`Cloudinary deletion failed: ${cloudinaryResponse.result}`);
      throw new Error(`Failed to delete video: ${cloudinaryResponse.result}`);
    }
  } catch (error) {
    console.error(
      `Error deleting video with public ID ${videoPublicId} (server):`,
      error
    );
    throw error;
  }
}
