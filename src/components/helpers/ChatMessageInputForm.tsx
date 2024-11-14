import React from 'react';

import { MessageInputFormProps } from '@/types/message-types';

const ChatMessageInputForm: React.FC<MessageInputFormProps> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  selectedVideo,
  setSelectedVideo,
}) => {
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedVideo(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="flex items-center mt-4">
      <label htmlFor="video-upload" className="cursor-pointer mr-2">
        <svg
          className="w-6 h-6 text-gray-600 hover:text-gray-800"
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
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="hidden"
        />
      </label>

      {selectedVideo && (
        <span className="text-sm text-gray-600 mr-2">{selectedVideo.name}</span>
      )}

      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-grow p-2 border border-gray-300 rounded-l"
        placeholder="Type your message..."
      />

      <button
        type="submit"
        className="p-2 bg-zinc-600 text-white rounded-r"
        disabled={!newMessage.trim() && !selectedVideo}
      >
        Send
      </button>
    </form>
  );
};

export default ChatMessageInputForm;
