'use client';

import React, { useState, useCallback, useRef } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import {
  messagePlaceholderText,
  sendButtonText,
} from '@/strings/clientStrings';
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
          console.error('Cloudinary upload failed:', data);
          setUploadError('Failed to upload video. Please try again.');
        }
      } catch (error) {
        console.error('Error uploading video to Cloudinary:', error);
        setUploadError('An error occurred during upload. Please try again.');
      } finally {
        setIsUploading(false);
        if (inputFileRef.current) {
          inputFileRef.current.value = '';
        }
      }
    },
    [isUploading, setSelectedVideo]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedVideo) {
      setUploadError('Please enter a message or upload a video.');
      return;
    }

    handleSendMessage(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center mt-4"
    >
      <div className="flex items-center w-full sm:w-auto">
        {/* Button to trigger file input */}
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isUploading}
          className={`cursor-pointer mr-2 flex items-center p-2 border border-gray-300 rounded ${
            isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h4m4 0h4M4 6v12m0-12L20 18M4 18h16"
            />
          </svg>
        </button>

        {/* Hidden File Input */}
        <input
          ref={inputFileRef}
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          disabled={isUploading}
          className="hidden"
        />

        {/* Display Uploaded URL or Spinner */}
        {isUploading ? (
          <LoadingSpinner
            label="Uploading..."
            color="primary"
            labelColor="primary"
          />
        ) : (
          typeof selectedVideo === 'string' &&
          selectedVideo && (
            <span className="text-sm text-gray-600 mr-2 truncate">
              Uploaded:{' '}
              <a
                href={selectedVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Video
              </a>
            </span>
          )
        )}
      </div>

      {/* Display Upload Error if Any */}
      {uploadError && (
        <span className="text-sm text-red-500 mt-2 sm:mt-0 sm:ml-2">
          {uploadError}
        </span>
      )}

      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-grow p-2 border border-gray-300 rounded mt-2 sm:mt-0 sm:mx-2"
        placeholder={messagePlaceholderText}
      />

      <button
        type="submit"
        className="p-2 bg-zinc-600 text-white rounded mt-2 sm:mt-0"
        disabled={!newMessage.trim() && !selectedVideo}
      >
        {sendButtonText}
      </button>
    </form>
  );
};

export default ChatMessageInputForm;
