'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PlayerForm from './PlayerForm';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { validatePlayerData } from '@/schemas/validation/createPlayerValidation';
import { formatWhatsappNumber } from '@/utils/phoneNumberUtils';
import { ZodIssue } from 'zod';
import { formatError } from '@/utils/errorUtils';
import { handleWhatsAppClick } from '@/utils/phoneNumberUtils';

type Props = {
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
};

function AddPlayerForm({ action }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [playerData, setPlayerData] = useState<{
    username: string;
    password: string;
    whatsappNumber: string;
  } | null>(null);

  const handleAddPlayer = async (data: {
    username: string;
    password: string;
    whatsappNumber: string;
  }) => {
    setIsSubmitting(true);

    const formattedNumber = formatWhatsappNumber(data.whatsappNumber);
    if (!formattedNumber) {
      const error = formatError(
        "WhatsApp number must start with '06' and be exactly 10 digits long."
      );
      toast.error(error.errors[0].message);
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('whatsappNumber', formattedNumber);

    const validation = validatePlayerData(formData);

    if (!validation.success) {
      const error = formatError(
        validation.errors?.map((err) => err.message).join(', ') ||
          'Invalid input.'
      );
      toast.error(error.errors[0].message);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await action({}, formData);
      if (response.errors.length === 0) {
        setPlayerData({ ...data, whatsappNumber: formattedNumber });
        toast.success('Player added successfully!');
        setFormKey((prevKey) => prevKey + 1);
      } else {
        const error = formatError(
          response.errors.map((error) => error.message).join(', ')
        );
        toast.error(error.errors[0].message);
      }
    } finally {
      setIsSubmitting(false);
    }
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
            onSubmit={handleAddPlayer}
            onSubmissionStart={() => console.log('Submission started...')}
            onAbort={() => setIsSubmitting(false)}
            submitButtonText={isSubmitting ? 'Submitting...' : 'Add Player'}
          />
          {playerData?.whatsappNumber && (
            <a
              href={`https://wa.me/${playerData.whatsappNumber.replace(/\D/g, '')}/?text=${encodeURIComponent(
                `Hello ${playerData.username}, your account has been created. Username: ${playerData.username}, Password: ${playerData.password}. Please log in and change your password to your own.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-green-500 text-white p-2 rounded-lg"
              onClick={() => handleWhatsAppClick()}
            >
              Send WhatsApp Message to Player
            </a>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export { AddPlayerForm };
