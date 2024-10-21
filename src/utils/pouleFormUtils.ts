import React from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { toast } from 'react-toastify';

import { PouleFormValues } from '@/types/poule-types';

export const addOpponent = (
  opponentName: string,
  opponents: string[],
  setOpponents: React.Dispatch<React.SetStateAction<string[]>>,
  setValue: UseFormSetValue<PouleFormValues>
): void => {
  if (opponentName.trim()) {
    const trimmedName = opponentName.trim();
    const updatedOpponents = [...opponents, trimmedName];
    setOpponents(updatedOpponents);
    setValue('opponents', updatedOpponents);
    setValue('opponentName', '');
  } else {
    toast.error('Opponent name cannot be empty');
  }
};

export const removeOpponent = (
  index: number,
  opponents: string[],
  setOpponents: React.Dispatch<React.SetStateAction<string[]>>,
  setValue: UseFormSetValue<PouleFormValues>
): void => {
  const updatedOpponents = opponents.filter((_, i) => i !== index);
  setOpponents(updatedOpponents);
  setValue('opponents', updatedOpponents);
};
