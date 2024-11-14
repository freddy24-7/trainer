import React from 'react';

import { ChatUser, SignedInUser } from '@/types/user-types';

interface ChatRecipientSelectorProps {
  users: ChatUser[];
  signedInUser: SignedInUser;
  selectedRecipientId: number | null;
  handleRecipientChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

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
              Chat with {user.username}
            </option>
          ))}
      </select>
    </div>
  );
};

export default ChatRecipientSelector;
