'use server';

import { v2 as cloudinary } from 'cloudinary';

import prisma from '@/lib/prisma';
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
        ...formatError('Message not found.', ['delete'], 'custom', true),
      };
    }

    if (message.senderId !== userId) {
      return {
        success: false,
        ...formatError(
          'Unauthorized to delete this message.',
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
      ...formatError('Error deleting message.', ['database'], 'custom', true),
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
