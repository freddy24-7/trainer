import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import {
  onlyVideoFilesMessage,
  dropVideoHereMessage,
  dragOrClickVideoMessage,
} from '@/strings/clientStrings';
import { VideoDropzoneProps } from '@/types/message-types';

const VideoDropzone: React.FC<VideoDropzoneProps> = ({ setSelectedVideo }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const videoFile = acceptedFiles[0];
      if (videoFile && videoFile.type.startsWith('video/')) {
        setSelectedVideo(videoFile);
      } else {
        console.error(onlyVideoFilesMessage);
      }
    },
    [setSelectedVideo]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.avi'] },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-4 rounded-md ${
        isDragActive ? 'border-blue-500' : 'border-gray-300'
      } mb-4`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>{dropVideoHereMessage}</p>
      ) : (
        <p>{dragOrClickVideoMessage}</p>
      )}
    </div>
  );
};

export default VideoDropzone;
