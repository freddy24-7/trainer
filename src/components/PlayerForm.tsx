import React, { useState } from 'react';

import CustomButton from '@/components/Button';
import useDisableSubmitButton from '@/hooks/useDisableSubmitButton';
import { usePlayerFormState } from '@/hooks/usePlayerFormState';
import {
  usernameLabel,
  passwordLabel,
  whatsappNumberLabel,
  whatsappNumberPlaceholder,
  submittingText,
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
  } = usePlayerFormState({
    username: initialData?.username ?? '',
    password: initialData?.password ?? '',
    whatsappNumber: initialData?.whatsappNumber ?? '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    username.trim() !== '' &&
    password.trim() !== '' &&
    whatsappNumber.trim() !== '';

  const { buttonClassName } = useDisableSubmitButton({
    isSubmitting,
    isFormValid,
  });

  const handleSubmission = async (): Promise<void> => {
    setIsSubmitting(true);
    onSubmissionStart();

    try {
      await onSubmit({
        username,
        password,
        whatsappNumber,
      });
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (isSubmitting) return;
    await handleSubmission();
  };

  const formFields: PlayerFormInputFieldProps[] = [
    {
      id: 'username',
      label: usernameLabel,
      type: 'text',
      name: 'username',
      autocomplete: 'current-username',
      value: username,
      onChange: (e) => setUsername(e.target.value),
    },
    {
      id: 'password-field',
      label: passwordLabel,
      type: 'password',
      name: 'password',
      autocomplete: 'current-password',
      value: password,
      onChange: (e) => setPassword(e.target.value),
    },
    {
      id: 'whatsappNumber',
      label: whatsappNumberLabel,
      type: 'tel',
      value: whatsappNumber,
      onChange: (e) => setWhatsappNumber(e.target.value),
      placeholder: whatsappNumberPlaceholder,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formFields.map((field) => (
        <InputField key={field.id} {...field} />
      ))}

      <div className="flex justify-center w-full">
        <CustomButton type="submit" className={buttonClassName}>
          {isSubmitting ? submittingText : submitButtonText}
        </CustomButton>
      </div>
    </form>
  );
}

export default PlayerForm;
