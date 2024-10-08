'use client';

import React, { useState } from 'react';

import { usePlayerForm } from '@/hooks/usePlayerForm';
import { PlayerFormProps } from '@/types/types';

import ErrorMessage from './ErrorMessage';
import FormButtons from './FormButtons';
import PasswordInput from './PasswordInput';
import SuccessMessage from './SuccessMessage';
import UsernameInput from './UsernameInput';
import WhatsappNumberInput from './WhatsappNumberInput';

const PlayerForm: React.FC<PlayerFormProps> = ({
  initialData,
  onSubmit,
  onSubmissionStart,
  onAbort,
  submitButtonText,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const {
    username,
    setUsername,
    password,
    setPassword,
    whatsappNumber,
    setWhatsappNumber,
    handleSubmit,
  } = usePlayerForm({
    initialData,
    onSubmit,
    onSubmissionStart,
    setSuccess,
    setError,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message="Player updated successfully!" />}

      <UsernameInput username={username} setUsername={setUsername} />
      <PasswordInput password={password} setPassword={setPassword} />
      <WhatsappNumberInput
        whatsappNumber={whatsappNumber}
        setWhatsappNumber={setWhatsappNumber}
      />

      <FormButtons submitButtonText={submitButtonText} onAbort={onAbort} />
    </form>
  );
};

export default PlayerForm;
