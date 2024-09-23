// This component is used to add a new player to the team.

'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import type { ZodIssue } from 'zod';
import PlayerForm from './PlayerForm';
import { Card, CardHeader, CardBody } from '@nextui-org/react';

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
        const errorMessages = response.errors
          .map((error) => error.message)
          .join(', ');
        toast.error(`Validation errors: ${errorMessages}`);
      }
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
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Player Management</h3>
        </CardHeader>
        <CardBody>
          <PlayerForm
            initialData={{ username: '', password: '' }}
            onSubmit={handleAddPlayer}
            onSubmissionStart={handleSubmissionStart}
            onAbort={handleAbort}
            submitButtonText={isSubmitting ? 'Submitting...' : 'Add Player'}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export { AddPlayerFormValidation };
