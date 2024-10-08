import { useState, useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import { Poule, PouleOpponent, FormValues } from '@/types/types';

function usePouleSelection(
  poules: Poule[],
  selectedPouleId: number | undefined,
  setValue: UseFormSetValue<FormValues>
): { selectedPoule: Poule | null; selectedOpponent: PouleOpponent | null } {
  const [selectedPoule, setSelectedPoule] = useState<Poule | null>(null);
  const [selectedOpponent, setSelectedOpponent] =
    useState<PouleOpponent | null>(null);

  useEffect(() => {
    const poule = poules.find((p) => p.id === selectedPouleId) || null;
    setSelectedPoule(poule);

    const firstOpponent = poule?.opponents[0] || null;
    setSelectedOpponent(firstOpponent);

    if (firstOpponent) {
      setValue('opponent', firstOpponent.id);
    } else {
      setValue('opponent', undefined);
    }
  }, [selectedPouleId, poules, setValue]);

  return { selectedPoule, selectedOpponent };
}

export default usePouleSelection;
