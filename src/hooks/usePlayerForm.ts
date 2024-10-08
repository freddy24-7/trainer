import React, { useState } from 'react';

import { PlayerFormProps, UsePlayerFormReturn } from '@/types/types';
import { formatToDisplay } from '@/utils/phoneNumberUtils';

export const usePlayerForm = ({
  initialData,
  onSubmit,
  onSubmissionStart,
  setSuccess,
  setError,
}: Pick<PlayerFormProps, 'initialData' | 'onSubmit' | 'onSubmissionStart'> & {
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}): UsePlayerFormReturn => {
  const [username, setUsername] = useState(initialData?.username || '');
  const [password, setPassword] = useState(initialData?.password || '');
  const [whatsappNumber, setWhatsappNumber] = useState(
    formatToDisplay(initialData?.whatsappNumber || '')
  );

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    onSubmissionStart();
    setError(null);
    setSuccess(false);

    try {
      await onSubmit({ username, password, whatsappNumber });
      setSuccess(true);
    } catch (error) {
      console.error('Error during submission:', error);
      setError('Submission failed. Please try again.');
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    whatsappNumber,
    setWhatsappNumber,
    error: null,
    success: false,
    handleSubmit,
  };
};
