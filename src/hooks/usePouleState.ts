// usePouleState.ts
import React, { useEffect, useState } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

import { Poule, PouleOpponent } from '@/types/poule-types';
import { FormValues } from '@/types/user-types';

export const usePouleState = (
  poules: Poule[],
  selectedPouleId: number | undefined,
  watch: UseFormWatch<FormValues>,
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

  const opponentId = watch('opponent');

  useEffect(() => {
    const poule = poules.find((p) => p.id === selectedPouleId) || null;
    setSelectedPoule(poule);
    if (poule) {
      setValue('opponent', poule.opponents[0]?.id || 0);
    }
  }, [selectedPouleId, poules, setValue]);

  useEffect(() => {
    if (selectedPoule) {
      const opponent =
        selectedPoule.opponents.find((o) => o.id === opponentId) || null;
      setSelectedOpponent(opponent);
    }
  }, [opponentId, selectedPoule]);

  return {
    selectedPoule,
    selectedOpponent,
    setSelectedPoule,
    setSelectedOpponent,
  };
};
