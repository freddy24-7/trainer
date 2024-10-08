import React, { useState } from 'react';

import { MessageInputProps } from '@/types/types';
import { handleSendMessage } from '@/utils/sendMessageHelper';

const MessageInput: React.FC<MessageInputProps> = ({
  action,
  signedInUser,
}) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmitMessage = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await handleSendMessage({
      action,
      signedInUser,
      newMessage,
      setNewMessage,
    });
  };

  return (
    <form onSubmit={handleSubmitMessage} className="flex">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-grow p-2 border border-gray-300 rounded-l"
        placeholder="Type your message..."
      />
      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded-r"
        disabled={!newMessage.trim()}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
