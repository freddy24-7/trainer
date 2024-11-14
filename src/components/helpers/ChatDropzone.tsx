import React from 'react';
import { useDropzone } from 'react-dropzone';

interface ChatDropzoneProps {
  setSelectedVideo: React.Dispatch<React.SetStateAction<File | null>>;
}

const ChatDropzone: React.FC<ChatDropzoneProps> = ({ setSelectedVideo }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const videoFile = acceptedFiles[0];
      if (videoFile && videoFile.type.startsWith('video/')) {
        setSelectedVideo(videoFile);
      } else {
        console.error('Only video files are accepted');
      }
    },
    accept: { 'video/*': ['.mp4', '.mov', '.avi'] },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-4 rounded-md ${isDragActive ? 'border-blue-500' : 'border-gray-300'} mb-4`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the video here...</p>
      ) : (
        <p>Drag & drop a video here, or click to select one</p>
      )}
    </div>
  );
};

export default ChatDropzone;
