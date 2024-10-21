import React, { useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import { Poule, PouleOpponent } from '@/types/poule-types';
import { FormValues } from '@/types/user-types';

export const usePouleState = (
  poules: Poule[],
  selectedPouleId: number | undefined,
  setValue: UseFormSetValue<FormValues>
): {
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  setSelectedPoule: React.Dispatch<React.SetStateAction<Poule | null>>;
  setSelectedOpponent: React.Dispatch<
    React.SetStateAction<PouleOpponent | null>
  >;
} => {
  const [selectedPoule, setSelectedPoule] = useState<Poule | null>(null);
  const [selectedOpponent, setSelectedOpponent] =
    useState<PouleOpponent | null>(null);

  useEffect(() => {
    const poule = poules.find((p) => p.id === selectedPouleId) || null;
    setSelectedPoule(poule);
    setSelectedOpponent(poule?.opponents[0] || null);
    if (poule) {
      setValue('opponent', poule.opponents[0]?.id || 0);
    }
  }, [selectedPouleId, poules, setValue]);

  return {
    selectedPoule,
    selectedOpponent,
    setSelectedPoule,
    setSelectedOpponent,
  };
};
