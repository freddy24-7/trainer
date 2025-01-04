'use server';

import prisma from '@/lib/prisma';
import {
  messageNotFound,
  unauthorizedToDeleteVideo,
  errorDeletingVideo,
} from '@/strings/actionStrings';
import { ActionResponse } from '@/types/shared-types';
import { deleteVideoFromCloudinary } from '@/utils/cloudinaryUtils';
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
        ...formatError(messageNotFound, ['delete'], 'custom', true),
      };
    }

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

    if (message.videoPublicId) {
      await deleteVideoFromCloudinary(message.videoPublicId);
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
      ...formatError(errorDeletingVideo, ['database'], 'custom', true),
    };
  }
}
