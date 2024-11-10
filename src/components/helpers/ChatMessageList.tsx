import React from 'react';

import { MessageListProps } from '@/types/message-types';

const MessageList: React.FC<MessageListProps> = ({
  messages,
  signedInUser,
}) => {
  return (
    <div className="overflow-y-auto max-h-96 mb-4 p-4 bg-white rounded-lg">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`mb-4 flex ${
            msg.sender.id === signedInUser.id ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`p-3 rounded-lg shadow-md max-w-xs break-words ${
              msg.sender.id === signedInUser.id
                ? 'bg-zinc-500 text-white self-end'
                : 'bg-gray-200 text-gray-900 self-start'
            }`}
          >
            <div className="text-sm font-semibold mb-1">
              {msg.sender.id === signedInUser.id ? 'You' : msg.sender.username}
            </div>
            {msg.content && <div className="text-sm">{msg.content}</div>}
            {msg.videoUrl && (
              <div className="mt-2">
                <video
                  controls={true}
                  src={msg.videoUrl}
                  className="w-full rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <div className="text-xs text-gray-400 mt-1">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
