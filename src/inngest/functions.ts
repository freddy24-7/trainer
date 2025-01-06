import { v2 as cloudinary } from 'cloudinary';

import { inngest } from './client';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export const videoAutodeleteJob = inngest.createFunction(
  { id: 'video-autodelete-job' },
  { event: 'schedule/video-autodelete' },
  async () => {
    console.log('Running video autodelete job...');

    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // Change to your desired timeframe

      // Step 1: Fetch videos from Cloudinary
      let nextCursor = null;
      let allVideos = [];

      do {
        const response = await cloudinary.api.resources({
          resource_type: 'video',
          type: 'upload',
          max_results: 500, // Adjust as needed
          next_cursor: nextCursor, // Handle pagination
        });

        allVideos = allVideos.concat(response.resources || []);
        nextCursor = response.next_cursor;
      } while (nextCursor);

      console.log(`Fetched ${allVideos.length} videos from Cloudinary.`);

      // Step 2: Filter videos older than the specified timeframe
      const oldVideos = allVideos.filter((video) => {
        const videoCreatedAt = new Date(video.created_at);
        return videoCreatedAt < oneHourAgo; // Compare creation time
      });

      console.log(`Found ${oldVideos.length} videos older than 1 hour.`);

      // Step 3: Delete the old videos
      for (const video of oldVideos) {
        try {
          const result = await cloudinary.uploader.destroy(video.public_id, {
            resource_type: 'video',
          });

          console.log(
            `Deleted video with public ID: ${video.public_id}, result: ${result.result}`
          );
        } catch (error) {
          console.error(
            `Error deleting video with public ID ${video.public_id}:`,
            error
          );
        }
      }

      console.log(
        `Video autodelete job completed. Deleted ${oldVideos.length} videos.`
      );
    } catch (error) {
      console.error('Error during video autodelete job:', error);
    }
  }
);
