import React from 'react';

import { usePlayerFormState } from '@/hooks/usePlayerFormState';
import { PlayerFormProps } from '@/types/user-types';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}

const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  required = true,
  placeholder,
}: InputFieldProps): React.ReactElement => (
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
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <InputField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputField
        id="whatsappNumber"
        label="WhatsApp Number"
        type="tel"
        value={whatsappNumber}
        onChange={(e) => setWhatsappNumber(e.target.value)}
        placeholder="06XXXXXXXX"
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
