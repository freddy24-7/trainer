import React from 'react';

import { MessageInputFormProps } from '@/types/message-types';

const ChatMessageInputForm: React.FC<MessageInputFormProps> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
}) => {
  return (
    <form onSubmit={handleSendMessage} className="flex">
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

export default ChatMessageInputForm;
