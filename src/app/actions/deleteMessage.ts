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
    console.error(errorDeletingMessage, error);
    return {
      success: false,
      ...formatError(errorDeletingMessage, ['database'], 'custom', true),
    };
  }
}

async function deleteVideoFromCloudinary(videoPublicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(videoPublicId, {
      resource_type: 'video',
    });
  } catch (cloudinaryError) {
    console.error('Error deleting video from Cloudinary:', cloudinaryError);
  }
}
