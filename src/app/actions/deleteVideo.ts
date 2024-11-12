'use server';

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

    await prisma.message.update({
      where: { id: messageId },
      data: { videoUrl: null },
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
