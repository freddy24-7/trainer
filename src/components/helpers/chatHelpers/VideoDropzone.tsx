'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';

import LoadingSpinner from '@/components/LoadingSpinner';
import { useVideoUpload } from '@/hooks/useVideoUpload';
import {
  dropVideoHereMessage,
  dragOrClickVideoMessage,
  onlyVideoFilesMessage,
} from '@/strings/clientStrings';
import { VideoDropzoneProps } from '@/types/message-types';

const VideoDropzone: React.FC<VideoDropzoneProps> = ({
  setSelectedVideo,
  setVideoPublicId,
}) => {
  const { isUploading, uploadError, handleVideoChange, inputFileRef } =
    useVideoUpload(setSelectedVideo, setVideoPublicId);

  const processFile: (file: File) => Promise<void> = async (file) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);

    if (!fileInput.files) return;

    const fileEvent = {
      target: fileInput,
    } as React.ChangeEvent<HTMLInputElement>;

    try {
      await handleVideoChange(fileEvent);
    } catch (error) {
      console.error('Error handling video change:', error);
    }
  };

  const onDrop: (acceptedFiles: File[]) => Promise<void> = async (
    acceptedFiles
  ) => {
    const videoFile = acceptedFiles[0];
    if (!videoFile || !videoFile.type.startsWith('video/')) {
      console.error(onlyVideoFilesMessage);
      return;
    }

    await processFile(videoFile);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.avi'] },
  });

  return (
    <div className="flex flex-col items-center w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-4 rounded-md w-full ${
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

      <input
        ref={inputFileRef}
        type="file"
        accept="video/*"
        onChange={handleVideoChange}
        className="hidden"
      />

      {isUploading && (
        <LoadingSpinner
          label="Uploading..."
          color="primary"
          labelColor="primary"
        />
      )}

      {uploadError && (
        <span className="text-sm text-red-500 mt-2">{uploadError}</span>
      )}
    </div>
  );
};

export default VideoDropzone;
