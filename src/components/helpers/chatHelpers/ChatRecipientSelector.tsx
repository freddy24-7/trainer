import React from 'react';

import { ChatRecipientSelectorProps } from '@/types/message-types';

const ChatRecipientSelector: React.FC<ChatRecipientSelectorProps> = ({
  users,
  signedInUser,
  selectedRecipientId,
  handleRecipientChange,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Select Chat:</label>
      <select
        className="p-2 border rounded w-full"
        value={selectedRecipientId ?? 'group'}
        onChange={handleRecipientChange}
      >
        <option value="group">Group Chat</option>
        {users
          .filter((user) => user.id !== signedInUser.id)
          .map((user) => (
            <option key={user.id} value={user.id}>
              Chat met {user.username}
            </option>
          ))}
      </select>
    </div>
  );
};

export default ChatRecipientSelector;
