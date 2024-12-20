import React from 'react';

import { usePlayerFormState } from '@/hooks/usePlayerFormState';
import {
  usernameLabel,
  passwordLabel,
  whatsappNumberLabel,
  whatsappNumberPlaceholder,
} from '@/strings/clientStrings';
import { PlayerFormProps, PlayerFormInputFieldProps } from '@/types/user-types';

const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  required = true,
  placeholder,
}: PlayerFormInputFieldProps): React.ReactElement => (
  <div>
    <label htmlFor={id} className="block text-brandcolor">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
    />
  </div>
);

function PlayerForm({
  initialData,
  onSubmit,
  onSubmissionStart,
  submitButtonText,
}: PlayerFormProps): React.ReactElement {
  const {
    username,
    setUsername,
    password,
    setPassword,
    whatsappNumber,
    setWhatsappNumber,
  } = usePlayerFormState(
    initialData ?? { username: '', password: '', whatsappNumber: '' }
  );

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    onSubmissionStart();

    try {
      await onSubmit({ username, password, whatsappNumber });
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        id="username"
        label={usernameLabel}
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <InputField
        id="password"
        label={passwordLabel}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputField
        id="whatsappNumber"
        label={whatsappNumberLabel}
        type="tel"
        value={whatsappNumber}
        onChange={(e) => setWhatsappNumber(e.target.value)}
        placeholder={whatsappNumberPlaceholder}
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring"
      >
        {submitButtonText}
      </button>
    </form>
  );
}

export default PlayerForm;
