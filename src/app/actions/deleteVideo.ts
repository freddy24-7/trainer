import { v2 as cloudinary } from 'cloudinary';

import prisma from '@/lib/prisma';
import {
  messageNotFound,
  unauthorizedToDeleteVideo,
  errorDeletingVideo,
} from '@/strings/actionStrings';
import { ActionResponse } from '@/types/shared-types';
import { formatError } from '@/utils/errorUtils';

/**
 * Deletes a video from Cloudinary and updates the database.
 * @param messageId - ID of the message containing the video.
 * @param userId - ID of the user attempting the deletion.
 * @returns ActionResponse indicating success or failure.
 */
export async function deleteVideo(
  messageId: number,
  userId: number
): Promise<ActionResponse> {
  try {
    // Fetch the message by ID
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    // Check if the message exists
    if (!message) {
      return {
        success: false,
        ...formatError(messageNotFound, ['delete'], 'custom', true),
      };
    }

    // Verify that the user is the sender
    if (message.senderId !== userId) {
      return {
        success: false,
        ...formatError(
          unauthorizedToDeleteVideo,
          ['authorization'],
          'custom',
          true
        ),
      };
    }

    // Delete the video from Cloudinary if the public ID exists
    if (message.videoPublicId) {
      const result = await cloudinary.uploader.destroy(message.videoPublicId, {
        resource_type: 'video',
      });

      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new Error(
          `Cloudinary deletion failed: ${result.result || 'unknown error'}`
        );
      }
    }

    // Update the database to remove video information
    await prisma.message.update({
      where: { id: messageId },
      data: { videoUrl: null, videoPublicId: null },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting video:', error);
    return {
      success: false,
      ...formatError(errorDeletingVideo, ['database'], 'custom', true),
    };
  }
}
