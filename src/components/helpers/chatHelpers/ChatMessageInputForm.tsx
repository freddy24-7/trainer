'use client';

import { Button } from '@heroui/react';
import React from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import { useVideoUpload } from '@/hooks/useVideoUpload';
import {
  messagePlaceholderText,
  sendButtonText,
} from '@/strings/clientStrings';
import {
  MessageInputFormProps,
  SelectedVideoProps,
} from '@/types/message-types';

const VideoUploader: React.FC<
  {
    isUploading: boolean;
    triggerFileInput: () => void;
    handleVideoChange: (
      e: React.ChangeEvent<HTMLInputElement>
    ) => Promise<void>;
    inputFileRef: React.RefObject<HTMLInputElement>;
  } & SelectedVideoProps
> = ({
  isUploading,
  triggerFileInput,
  handleVideoChange,
  inputFileRef,
  selectedVideo,
}) => (
  <div className="flex items-center w-full sm:w-auto">
    <Button
      type="button"
      onPress={triggerFileInput}
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
    </Button>

    <input
      ref={inputFileRef}
      type="file"
      accept="video/*"
      onChange={handleVideoChange}
      disabled={isUploading}
      className="hidden"
    />

    {isUploading ? (
      <LoadingSpinner
        label="Uploading..."
        color="primary"
        labelColor="primary"
      />
    ) : (
      selectedVideo && (
        <span className="text-sm text-gray-600 mr-2 truncate">
          Uploaded:{' '}
          <a
            href={typeof selectedVideo === 'string' ? selectedVideo : '#'}
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
);

const UploadErrorMessage: React.FC<{ uploadError: string | null }> = ({
  uploadError,
}) =>
  uploadError ? (
    <span className="text-sm text-red-500 mt-2 sm:mt-0 sm:ml-2">
      {uploadError}
    </span>
  ) : null;

const MessageInput: React.FC<
  {
    newMessage: string;
    setNewMessage: (value: string) => void;
    isUploading: boolean;
  } & SelectedVideoProps
> = ({ newMessage, setNewMessage, isUploading }) => (
  <input
    type="text"
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    className="flex-grow p-2 border border-gray-300 rounded mt-2 sm:mt-0 sm:mx-2"
    placeholder={messagePlaceholderText}
    disabled={isUploading}
  />
);

const SubmitButton: React.FC<
  {
    isUploading: boolean;
    newMessage: string;
  } & SelectedVideoProps
> = ({ isUploading, newMessage, selectedVideo }) => (
  <Button
    type="submit"
    className={`p-2 rounded mt-2 sm:mt-0 ${
      isUploading || (!newMessage.trim() && !selectedVideo)
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-zinc-600 text-white hover:bg-zinc-700'
    }`}
    disabled={isUploading || (!newMessage.trim() && !selectedVideo)}
  >
    {isUploading ? 'Uploading...' : sendButtonText}
  </Button>
);

const ChatMessageInputForm: React.FC<
  MessageInputFormProps & SelectedVideoProps
> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  selectedVideo,
  setSelectedVideo,
  setVideoPublicId,
}) => {
  const {
    isUploading,
    uploadError,
    inputFileRef,
    triggerFileInput,
    handleVideoChange,
  } = useVideoUpload(setSelectedVideo, setVideoPublicId);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedVideo) {
      console.error('Please enter a message or upload a video.');
      return;
    }

    handleSendMessage(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center mt-4"
    >
      <VideoUploader
        isUploading={isUploading}
        triggerFileInput={triggerFileInput}
        handleVideoChange={handleVideoChange}
        inputFileRef={inputFileRef}
        selectedVideo={selectedVideo}
      />

      <UploadErrorMessage uploadError={uploadError} />

      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        isUploading={isUploading}
        selectedVideo={selectedVideo}
      />

      <SubmitButton
        isUploading={isUploading}
        newMessage={newMessage}
        selectedVideo={selectedVideo}
      />
    </form>
  );
};

export default ChatMessageInputForm;
