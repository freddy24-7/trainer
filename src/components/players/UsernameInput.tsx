import React from 'react';

import { UsernameInputProps } from '@/types/types';

const UsernameInput: React.FC<UsernameInputProps> = ({
  username,
  setUsername,
}) => (
  <div>
    <label className="block text-brandcolor">Username</label>
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required={true}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
    />
  </div>
);

export default UsernameInput;
