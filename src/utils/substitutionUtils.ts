import React from 'react';
import { UseFormSetValue } from 'react-hook-form';

import { MatchFormValues } from '@/types/match-types';
import { handleSubstitution } from '@/utils/playerManagementUtils';

interface SubstitutionData {
  minute: number;
  playerInId: number;
  playerOutId: number;
  substitutionReason: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
}

interface GameState {
  matchEvents: MatchFormValues['matchEvents'];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
}

export const processSubstitution = (
  substitutionData: SubstitutionData,
  gameState: GameState,
  setValue: UseFormSetValue<MatchFormValues>,
  setPlayerStates: React.Dispatch<
    React.SetStateAction<Record<number, 'playing' | 'bench' | 'absent'>>
  >
): void => {
  const { updatedMatchEvents, updatedPlayerStates } = handleSubstitution(
    substitutionData,
    gameState
  );

  setValue('matchEvents', updatedMatchEvents);
  setPlayerStates(updatedPlayerStates);
};
