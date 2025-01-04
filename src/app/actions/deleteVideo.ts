'use server';

import { v2 as cloudinary } from 'cloudinary';

import prisma from '@/lib/prisma';
import {
  messageNotFound,
  unauthorizedToDeleteVideo,
  errorDeletingVideo,
} from '@/strings/actionStrings';
import { ActionResponse } from '@/types/shared-types';
import { formatError } from '@/utils/errorUtils';

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
      const cloudinaryResponse = await cloudinary.uploader.destroy(
        message.videoPublicId,
        { resource_type: 'video' }
      );

      if (cloudinaryResponse.result !== 'ok') {
        throw new Error(`Failed to delete video: ${cloudinaryResponse.result}`);
      }
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
