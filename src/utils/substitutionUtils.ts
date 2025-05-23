import React from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { toast } from 'react-toastify';

import { incompleteSubstitutionErrorMessage } from '@/strings/clientStrings';
import {
  MatchFormValues,
  SubstitutionData,
  GameState,
  Substitution,
  SubstitutionReason,
} from '@/types/match-types';
import { handleSubstitution } from '@/utils/playerManagementUtils';

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

export function handleSubstitutionChange(
  setSubstitutions: React.Dispatch<React.SetStateAction<Substitution[]>>,
  playerOutId: number,
  field: 'playerInId' | 'substitutionReason',
  value: string | number
): void {
  const parsedValue =
    field === 'playerInId' ? Number(value) : (value as SubstitutionReason);

  setSubstitutions((prev) =>
    prev.map((sub) =>
      sub.playerOutId === playerOutId ? { ...sub, [field]: parsedValue } : sub
    )
  );
}

export function handleAddSubstitution(
  setSubstitutions: React.Dispatch<React.SetStateAction<Substitution[]>>,
  playerOutId: number
): void {
  setSubstitutions((prev) => [
    ...prev,
    { playerOutId, playerInId: null, substitutionReason: null },
  ]);
}

export function handleRemoveSubstitution(
  setSubstitutions: React.Dispatch<React.SetStateAction<Substitution[]>>,
  playerOutId: number
): void {
  setSubstitutions((prev) =>
    prev.filter((sub) => sub.playerOutId !== playerOutId)
  );
}

export function handleConfirmAllAtOnce({
  minute,
  substitutions,
  matchEvents,
  playerStates,
  setValue,
  setPlayerStates,
  setOpen,
  setMinute,
  setSubstitutions,
}: {
  minute: number | '';
  substitutions: Substitution[];
  matchEvents: MatchFormValues['matchEvents'];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  setValue: UseFormSetValue<MatchFormValues>;
  setPlayerStates: React.Dispatch<
    React.SetStateAction<Record<number, 'playing' | 'bench' | 'absent'>>
  >;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMinute: React.Dispatch<React.SetStateAction<number | ''>>;
  setSubstitutions: React.Dispatch<React.SetStateAction<Substitution[]>>;
}): void {
  if (
    !minute ||
    substitutions.some((sub) => !sub.playerInId || !sub.substitutionReason)
  ) {
    toast.error(incompleteSubstitutionErrorMessage);
    return;
  }

  const newEvents = substitutions.map((sub) => ({
    minute: minute as number,
    playerInId: sub.playerInId as number,
    playerOutId: sub.playerOutId,
    eventType: 'SUBSTITUTION' as const,
    substitutionReason: sub.substitutionReason,
  }));

  const updatedMatchEvents = [...(matchEvents || []), ...newEvents];
  setValue('matchEvents', updatedMatchEvents);

  const updatedPlayerStates = { ...playerStates };
  for (const event of newEvents) {
    updatedPlayerStates[event.playerOutId] = 'bench';
    updatedPlayerStates[event.playerInId] = 'playing';
  }
  setPlayerStates(updatedPlayerStates);

  setOpen(false);
  setMinute('');
  setSubstitutions([]);
}
