import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface VideoDropzoneProps {
  setSelectedVideo: React.Dispatch<React.SetStateAction<File | null>>;
}

const VideoDropzone: React.FC<VideoDropzoneProps> = ({ setSelectedVideo }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const videoFile = acceptedFiles[0];
      if (videoFile && videoFile.type.startsWith('video/')) {
        setSelectedVideo(videoFile);
      } else {
        console.error('Only video files are accepted');
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
        <p>Drop the video here...</p>
      ) : (
        <p>Drag & drop a video here, or click icon below to select one</p>
      )}
    </div>
  );
};

export default VideoDropzone;
