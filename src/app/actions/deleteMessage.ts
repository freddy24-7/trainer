'use server';

import { v2 as cloudinary } from 'cloudinary';

import prisma from '@/lib/prisma';
import {
  messageNotFound,
  unauthorizedToDeleteMessage,
  errorDeletingMessage,
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

export async function deleteMessage(
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
          unauthorizedToDeleteMessage,
          ['authorization'],
          'custom',
          true
        ),
      };
    }

    if (message.videoPublicId) {
      await deleteVideoFromCloudinary(message.videoPublicId);
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    return {
      success: false,
      ...formatError(errorDeletingMessage, ['database'], 'custom', true),
    };
  }
}

async function deleteVideoFromCloudinary(videoPublicId: string): Promise<void> {
  try {
    const cloudinaryResponse = await cloudinary.uploader.destroy(
      videoPublicId,
      {
        resource_type: 'video',
      }
    );

    console.log('Cloudinary Deletion Response:', cloudinaryResponse);

    if (cloudinaryResponse.result !== 'ok') {
      throw new Error(`Failed to delete video: ${cloudinaryResponse.result}`);
    }
  } catch (cloudinaryError) {
    console.error('Error deleting video from Cloudinary:', cloudinaryError);
    throw new Error('Failed to delete video from Cloudinary');
  }
}
