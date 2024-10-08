import React from 'react';

import { PasswordInputProps } from '@/types/types';

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  setPassword,
}) => (
  <div>
    <label className="block text-brandcolor">Password</label>
    <input
      type="password"
      value={password}
      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
        setPassword(e.target.value)
      }
      required={true}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
    />
  </div>
);

export default PasswordInput;
