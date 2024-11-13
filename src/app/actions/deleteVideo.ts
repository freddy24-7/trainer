'use server';

import { v2 as cloudinary } from 'cloudinary';

import prisma from '@/lib/prisma';
import { ActionResponse } from '@/types/shared-types';
import { formatError } from '@/utils/errorUtils';

export async function deleteVideo(
  messageId: number,
  userId: number
): Promise<ActionResponse> {
  try {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return {
        success: false,
        ...formatError('Message not found.', ['delete'], 'custom', true),
      };
    }

    if (message.senderId !== userId) {
      return {
        success: false,
        ...formatError(
          'Unauthorized to delete this video.',
          ['authorization'],
          'custom',
          true
        ),
      };
    }

    if (message.videoPublicId) {
      await cloudinary.uploader.destroy(message.videoPublicId, {
        resource_type: 'video',
      });
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { videoUrl: null, videoPublicId: null },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting video:', error);
    return {
      success: false,
      ...formatError('Error deleting video.', ['database'], 'custom', true),
    };
  }
}
