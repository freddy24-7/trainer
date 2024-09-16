// This component is used to add a new player to the team.

'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import type { ZodIssue } from 'zod';
import PlayerForm from './PlayerForm';

type Props = {
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
};

function AddPlayerFormValidation({ action }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPlayer = async (data: {
    username: string;
    password: string;
  }) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);

    try {
      const response = await action({}, formData);
      if (response.errors.length === 0) {
        toast.success('Player added successfully!');
      } else {
        console.log('Validation errors:', response.errors);
      }
    } catch (error) {
      console.error('Error adding player:', error);
      toast.error('Failed to add player.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmissionStart = () => {
    console.log('Submission started...');
  };

  const handleAbort = () => {
    setIsSubmitting(false);
    console.log('Submission aborted.');
  };

  return (
    <div className="space-y-4 max-w-md mx-auto mt-10 p-6 bg-zinc-300 text-black shadow-md rounded dark:bg-black dark:text-white">
      <h3 className="text-lg font-semibold mt-8 mb-4">Player Management</h3>
      <PlayerForm
        initialData={{ username: '', password: '' }}
        onSubmit={handleAddPlayer}
        onSubmissionStart={handleSubmissionStart}
        onAbort={handleAbort}
        submitButtonText={isSubmitting ? 'Submitting...' : 'Add Player'}
      />
    </div>
  );
}

export { AddPlayerFormValidation };
