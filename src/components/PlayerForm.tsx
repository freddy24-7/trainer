import { Button } from '@heroui/react';
import React, { useEffect, useState } from 'react';

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
  name,
  autocomplete,
}: PlayerFormInputFieldProps): React.ReactElement => (
  <div>
    <label htmlFor={id} className="block text-brandcolor">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      autoComplete={autocomplete}
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

  const [isFormValid, setIsFormValid] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isValid =
      username.trim() !== '' &&
      password.trim() !== '' &&
      whatsappNumber.trim() !== '';
    setIsFormValid(isValid);
  }, [username, password, whatsappNumber]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    onSubmissionStart();

    try {
      await onSubmit({ username, password, whatsappNumber });
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      setIsSubmitting(false);
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
        id="password-field"
        label={passwordLabel}
        type="password"
        name="password"
        autocomplete="current-password"
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

      <Button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className={`w-full py-2 px-4 rounded-lg shadow focus:outline-none focus:ring ${
          isFormValid && !isSubmitting
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? 'Submitting...' : submitButtonText}
      </Button>
    </form>
  );
}

export default PlayerForm;
