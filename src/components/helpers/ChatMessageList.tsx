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
            Number(msg.sender.id) === Number(signedInUser.id)
              ? 'justify-end'
              : 'justify-start'
          }`}
        >
          <div
            className={`p-3 rounded-lg shadow-md max-w-xs break-words ${
              Number(msg.sender.id) === Number(signedInUser.id)
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-200 text-gray-900 self-start'
            }`}
          >
            <div className="text-sm font-semibold mb-1">
              {Number(msg.sender.id) === Number(signedInUser.id)
                ? 'You'
                : msg.sender.username}
            </div>
            <div className="text-sm">{msg.content}</div>
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
