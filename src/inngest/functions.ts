import { v2 as cloudinary } from 'cloudinary';
import { inngest } from './client';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

type CloudinaryVideo = {
  public_id: string;
  created_at: string;
  [key: string]: any;
};

export const videoAutodeleteJob = inngest.createFunction(
  { id: 'video-autodelete-job' },
  { cron: '0 0 * * 0' },
  async () => {
    console.log('Running video autodelete job...');

    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const folderPath = process.env.CLOUDINARY_FOLDER_NAME;

      console.log('CLOUDINARY_FOLDER_NAME:', folderPath);

      let nextCursor: string | null = null;
      let allVideos: CloudinaryVideo[] = [];

      do {
        const response: {
          resources: CloudinaryVideo[];
          next_cursor?: string;
        } = await cloudinary.api.resources({
          resource_type: 'video',
          type: 'upload',
          prefix: folderPath,
          max_results: 500,
          next_cursor: nextCursor,
        });

        allVideos = allVideos.concat(response.resources || []);
        nextCursor = response.next_cursor || null;
      } while (nextCursor);

      console.log(`Fetched ${allVideos.length} videos from Cloudinary.`);

      const oldVideos = allVideos.filter((video) => {
        const videoCreatedAt = new Date(video.created_at);
        return videoCreatedAt < oneWeekAgo;
      });

      console.log(`Found ${oldVideos.length} videos older than one week.`);

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
