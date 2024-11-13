import fs from 'fs';

import { handleUploadVideo } from '@/lib/cloudinary';
import { ActionResponse } from '@/types/shared-types';
import { formatError } from '@/utils/errorUtils';

export async function handleFileUpload(
  videoFile: File
): Promise<ActionResponse> {
  const filePath = `/tmp/${videoFile.name}`;
  try {
    await videoFile
      .arrayBuffer()
      .then((buffer) => fs.writeFileSync(filePath, Buffer.from(buffer)));

    const { url, publicId } = await handleUploadVideo(filePath);
    return { success: true, videoUrl: url, videoPublicId: publicId };
  } catch (uploadError) {
    console.error('Error uploading video:', uploadError);
    return {
      success: false,
      ...formatError('Error uploading video.', ['upload'], 'custom', true),
    } as ActionResponse;
  } finally {
    fs.unlinkSync(filePath);
  }
}
