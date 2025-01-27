import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { MatchFormValues } from '@/types/match-types';

interface UseMatchFormHandlersProps {
  onSubmit: (data: MatchFormValues) => Promise<void>;
}

export interface UseMatchFormHandlersReturn {
  handleFormSubmit: SubmitHandler<MatchFormValues>;
  handleConfirmSubmission: () => Promise<void>;
  isSubmitting: boolean;
  isConfirmationModalOpen: boolean;
  setConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useMatchFormHandlers = ({
  onSubmit,
}: UseMatchFormHandlersProps): UseMatchFormHandlersReturn => {
  const [formData, setFormData] = useState<MatchFormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const handleFormSubmit: SubmitHandler<MatchFormValues> = (data) => {
    setFormData(data);
    setConfirmationModalOpen(true);
  };

  const handleConfirmSubmission: () => Promise<void> = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setConfirmationModalOpen(false);

    if (formData) {
      try {
        await onSubmit(formData);
        console.log('Match submitted successfully!');
      } catch (error) {
        console.error('Error submitting match data:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    handleFormSubmit,
    handleConfirmSubmission,
    isSubmitting,
    isConfirmationModalOpen,
    setConfirmationModalOpen,
  };
};
