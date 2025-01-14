import React, { useEffect, useState } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

import { MatchFormValues } from '@/types/match-types';
import { Poule, PouleOpponent } from '@/types/poule-types';

export const usePouleState = (
  poules: Poule[],
  selectedPouleId: number | undefined,
  watch: UseFormWatch<MatchFormValues>,
  setValue: UseFormSetValue<MatchFormValues>
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
      const currentOpponent = poule.opponents.find((o) => o.id === opponentId);
      if (currentOpponent) {
        setSelectedOpponent(currentOpponent);
      } else {
        const firstOpponent = poule.opponents[0] || null;
        setSelectedOpponent(firstOpponent);
        setValue('opponent', firstOpponent?.id || 0);
      }
    } else {
      setSelectedOpponent(null);
    }
  }, [selectedPouleId, poules, opponentId, setValue]);

  return {
    selectedPoule,
    selectedOpponent,
    setSelectedPoule,
    setSelectedOpponent,
  };
};
