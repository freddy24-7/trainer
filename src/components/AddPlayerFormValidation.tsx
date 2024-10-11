'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PlayerForm from './PlayerForm';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { ZodIssue } from 'zod';

type Props = {
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
};

function AddPlayerFormValidation({ action }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playerData, setPlayerData] = useState<{
    username: string;
    password: string;
    whatsappNumber: string;
  }>({
    username: '',
    password: '',
    whatsappNumber: '',
  });
  const [formKey, setFormKey] = useState(0);

  const formatWhatsappNumber = (number: string) => {
    const isValid = /^06\d{8}$/.test(number);
    if (!isValid) {
      toast.error(
        "WhatsApp number must start with '06' and be exactly 10 digits long."
      );
      return null;
    }
    return number.replace(/^06/, '+316');
  };

  const handleAddPlayer = async (data: {
    username: string;
    password: string;
    whatsappNumber: string;
  }) => {
    setIsSubmitting(true);

    const formattedNumber = formatWhatsappNumber(data.whatsappNumber);
    if (!formattedNumber) {
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('whatsappNumber', formattedNumber);

    try {
      const response = await action({}, formData);
      if (response.errors.length === 0) {
        setPlayerData({ ...data, whatsappNumber: formattedNumber });
        toast.success('Player added successfully!');
        setFormKey((prevKey) => prevKey + 1);
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

  const handleWhatsappClick = () => {
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
            onSubmit={handleAddPlayer}
            onSubmissionStart={() => console.log('Submission started...')}
            onAbort={() => setIsSubmitting(false)}
            submitButtonText={isSubmitting ? 'Submitting...' : 'Add Player'}
          />
          {playerData.whatsappNumber && (
            <a
              href={`https://wa.me/${playerData.whatsappNumber.replace(
                /\D/g,
                ''
              )}/?text=${encodeURIComponent(
                `Hello ${playerData.username}, your account has been created. Username: ${playerData.username}, Password: ${playerData.password}. Please log in and change your password to your own.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-green-500 text-white p-2 rounded-lg"
              onClick={handleWhatsappClick}
            >
              Send WhatsApp Message to Player
            </a>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export { AddPlayerFormValidation };
