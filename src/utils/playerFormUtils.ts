import React from 'react';
import { ZodIssue } from 'zod';
import { formatWhatsappNumber } from '@/utils/phoneNumberUtils';
import { formatError } from '@/utils/errorUtils';
import { toast } from 'react-toastify';
import { PlayerFormData } from '@/lib/types';

interface HandlePlayerFormSubmitParams {
  data: PlayerFormData;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  validationFunction: (formData: FormData) => {
    success: boolean;
    errors?: ZodIssue[];
  };
  actionFunction: (formData: FormData) => Promise<{ errors: ZodIssue[] }>;
  onSuccess: (playerData: PlayerFormData) => void;
}

export async function handlePlayerFormSubmit({
  data,
  setIsSubmitting,
  validationFunction,
  actionFunction,
  onSuccess,
}: HandlePlayerFormSubmitParams): Promise<void> {
  setIsSubmitting(true);

  const formattedNumber = formatWhatsappNumber(data.whatsappNumber);
  if (!formattedNumber) {
    const errorMessage =
      "WhatsApp number must start with '06' and be exactly 10 digits long.";
    const error = formatError(errorMessage);
    toast.error(error.errors[0].message);
    setIsSubmitting(false);
    return;
  }

  const formData = new FormData();
  formData.append('username', data.username);
  formData.append('password', data.password);
  formData.append('whatsappNumber', formattedNumber);

  const validation = validationFunction(formData);

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
    const response = await actionFunction(formData);
    if (response.errors.length === 0) {
      onSuccess({ ...data, whatsappNumber: formattedNumber });
      toast.success('Operation successful!');
    } else {
      const error = formatError(
        response.errors.map((error) => error.message).join(', ')
      );
      toast.error(error.errors[0].message);
    }
  } finally {
    setIsSubmitting(false);
  }
}
