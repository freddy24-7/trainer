import React, { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import { PouleFormValues } from '@/types/poule-types';
import { addOpponent, removeOpponent } from '@/utils/pouleFormUtils';

export function useOpponentManagement(
  opponentName: string,
  setValue: UseFormSetValue<PouleFormValues>
): {
  opponents: string[];
  handleAddOpponent: () => void;
  handleRemoveOpponent: (index: number) => void;
  setOpponents: React.Dispatch<React.SetStateAction<string[]>>;
} {
  const [opponents, setOpponents] = useState<string[]>([]);

  const handleAddOpponent = (): void => {
    addOpponent(opponentName, opponents, setOpponents, setValue);
  };

  const handleRemoveOpponent = (index: number): void => {
    removeOpponent(index, opponents, setOpponents, setValue);
  };

  return {
    opponents,
    handleAddOpponent,
    handleRemoveOpponent,
    setOpponents,
  };
}
