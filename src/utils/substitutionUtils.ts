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

interface HandleConfirmParams {
  minute: number | '';
  substitutions: Substitution[];
  onSubstitution: (
    minute: number,
    playerInId: number,
    playerOutId: number,
    substitutionReason: SubstitutionReason
  ) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMinute: React.Dispatch<React.SetStateAction<number | ''>>;
  setSubstitutions: React.Dispatch<React.SetStateAction<Substitution[]>>;
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

export type SubstitutionReason =
  | 'TACTICAL'
  | 'FITNESS'
  | 'INJURY'
  | 'OTHER'
  | null;

export interface Substitution {
  playerOutId: number;
  playerInId: number | null;
  substitutionReason: SubstitutionReason;
}

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

export function handleConfirm({
  minute,
  substitutions,
  onSubstitution,
  setOpen,
  setMinute,
  setSubstitutions,
}: HandleConfirmParams): void {
  if (
    !minute ||
    substitutions.some((sub) => !sub.playerInId || !sub.substitutionReason)
  ) {
    alert('Please complete all fields for each substitution.');
    return;
  }

  substitutions.forEach((sub) => {
    onSubstitution(
      minute as number,
      sub.playerInId as number,
      sub.playerOutId,
      sub.substitutionReason
    );
  });

  setOpen(false);
  setMinute('');
  setSubstitutions([]);
}
