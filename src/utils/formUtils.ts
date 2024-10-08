import React from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { toast } from 'react-toastify';

import { HandleFormSubmitOptions } from '@/types/types';
import type { PouleFormValues } from '@/types/types';

export const handleFormSubmit = async ({
  data,
  action,
  reset,
  setOpponents,
  setShowForm,
}: HandleFormSubmitOptions): Promise<void> => {
  const formData = new FormData();
  formData.append('pouleName', data.pouleName || '');
  formData.append('mainTeamName', data.mainTeamName || '');
  data.opponents.forEach((opponent) => {
    formData.append('opponents', opponent);
  });

  try {
    const result = await action(formData);
    if (result && 'errors' in result) {
      toast.error('Failed to add poule. Please check your inputs.');
      console.error('Submission errors:', result.errors);
    } else {
      toast.success('Poule added successfully!');
      reset();
      setOpponents([]);
      setShowForm(false);
    }
  } catch (error) {
    console.error('Error during form submission:', error);
    toast.error('An error occurred during submission.');
  }
};

interface AddOpponentProps {
  opponentName: string;
  opponents: string[];
  setOpponents: React.Dispatch<React.SetStateAction<string[]>>;
  setValue: UseFormSetValue<PouleFormValues>;
}

export const addOpponent = ({
  opponentName,
  opponents,
  setOpponents,
  setValue,
}: AddOpponentProps): void => {
  if (opponentName.trim()) {
    const updatedOpponents = [...opponents, opponentName.trim()];
    setOpponents(updatedOpponents);
    setValue('opponents', updatedOpponents);
    setValue('opponentName', '');
  } else {
    toast.error('Opponent name cannot be empty');
  }
};

interface RemoveOpponentProps {
  index: number;
  opponents: string[];
  setOpponents: React.Dispatch<React.SetStateAction<string[]>>;
  setValue: UseFormSetValue<PouleFormValues>;
}

export const removeOpponent = ({
  index,
  opponents,
  setOpponents,
  setValue,
}: RemoveOpponentProps): void => {
  const updatedOpponents = opponents.filter((_, i) => i !== index);
  setOpponents(updatedOpponents);
  setValue('opponents', updatedOpponents);
};
