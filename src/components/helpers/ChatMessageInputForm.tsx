'use client';

import React, { useState, useCallback, useRef } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import { MessageInputFormProps } from '@/types/message-types';

const ChatMessageInputForm: React.FC<MessageInputFormProps> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  selectedVideo,
  setSelectedVideo,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = useCallback(() => {
    if (inputFileRef.current && !isUploading) {
      inputFileRef.current.click();
    }
  }, [isUploading]);

  const handleVideoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const files = e.target.files;
      if (!files || !files[0] || isUploading) return;

      const file = files[0];
      setIsUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'trainer2Unsigned');

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        if (data.secure_url) {
          setSelectedVideo(data.secure_url);
        } else {
          setUploadError('Failed to upload video. Please try again.');
        }
      } catch (error) {
        setUploadError('An error occurred during upload. Please try again.');
      } finally {
        setIsUploading(false);
        if (inputFileRef.current) inputFileRef.current.value = '';
      }
    },
    [isUploading, setSelectedVideo]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newMessage.trim() && !selectedVideo) {
      setUploadError('Please enter a message or upload a video.');
      return;
    }

    await handleSendMessage(e); // Call parent handler with FormEvent
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center mt-4"
    >
      <div className="flex items-center w-full sm:w-auto">
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isUploading}
          className={`cursor-pointer mr-2 flex items-center p-2 border border-gray-300 rounded ${
            isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          Upload Video
        </button>
        <input
          ref={inputFileRef}
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          disabled={isUploading}
          className="hidden"
        />
        {isUploading && <LoadingSpinner label="Uploading..." color="primary" />}
        {uploadError && (
          <span className="text-sm text-red-500 mt-2">{uploadError}</span>
        )}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-grow p-2 border border-gray-300 rounded mt-2 sm:mt-0 sm:mx-2"
        placeholder="Enter your message"
      />
      <button
        type="submit"
        className="p-2 bg-blue-600 text-white rounded mt-2 sm:mt-0"
        disabled={!newMessage.trim() && !selectedVideo}
      >
        Send
      </button>
    </form>
  );
};

export default ChatMessageInputForm;
