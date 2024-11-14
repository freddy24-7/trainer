import React from 'react';

import { SignedInUser, ChatUser } from '@/types/user-types';

interface ChatHeaderProps {
  signedInUser: SignedInUser;
  users: ChatUser[];
  selectedRecipientId: number | null;
  onRecipientChange: (recipientId: number | null) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  signedInUser,
  users,
  selectedRecipientId,
  onRecipientChange,
}) => (
  <div>
    <h1 className="text-3xl font-bold mb-4 text-center">
      Welcome to Chat, {signedInUser.username}!
    </h1>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Select Chat:</label>
      <select
        className="p-2 border rounded w-full"
        value={selectedRecipientId ?? 'group'}
        onChange={(e) =>
          onRecipientChange(
            e.target.value === 'group' ? null : Number(e.target.value)
          )
        }
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
  </div>
);

export default ChatHeader;
