'use client';

import { Card, CardHeader, CardBody } from '@nextui-org/react';
import React from 'react';
import { ZodIssue } from 'zod';

import { useAddPlayer } from '@/hooks/useAddPlayer';

import PlayerForm from './PlayerForm';
import WhatsappMessageLink from './WhatsappMessageLink';

interface Props {
  action: (
    _prevState: unknown,
    params: FormData
  ) => Promise<{ errors: ZodIssue[]; success?: boolean }>;
}

const AddPlayerFormValidation: React.FC<Props> = ({ action }) => {
  const {
    isSubmitting,
    playerData,
    formKey,
    handleAddPlayer,
    setIsSubmitting,
  } = useAddPlayer(action);

  const handleWhatsappClick = (): void => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Player Management</h3>
        </CardHeader>
        <CardBody>
          <PlayerForm
            key={formKey}
            initialData={{ username: '', password: '', whatsappNumber: '' }}
            onSubmit={async (data) => {
              console.log('Submission started...');
              await handleAddPlayer(data);
            }}
            onSubmissionStart={() => console.log('Submission started...')}
            onAbort={() => setIsSubmitting(false)}
            submitButtonText={isSubmitting ? 'Submitting...' : 'Add Player'}
          />
          {playerData?.whatsappNumber && (
            <WhatsappMessageLink
              whatsappNumber={playerData.whatsappNumber}
              message={`Hello ${playerData.username}, your account has been created. Username: ${playerData.username}, Password: ${playerData.password}. Please log in and change your password to your own.`}
              onClick={handleWhatsappClick}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export { AddPlayerFormValidation };
