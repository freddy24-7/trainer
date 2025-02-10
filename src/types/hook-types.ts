import React from 'react';
import { SubmitHandler, UseFormSetValue } from 'react-hook-form';

import { MatchFormValues } from '@/types/match-types';
import { Player } from '@/types/user-types';
import { calculatePlayerMinutes } from '@/utils/playerManagementUtils';

export interface UseMatchFormHandlersProps {
  onSubmit: (data: MatchFormValues) => Promise<void>;
}

export interface UseMatchFormHandlersReturn {
  handleFormSubmit: SubmitHandler<MatchFormValues>;
  handleConfirmSubmission: () => Promise<void>;
  isSubmitting: boolean;
  isConfirmationModalOpen: boolean;
  setConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UsePlayerManagementParams {
  players: Player[];
  matchEvents: MatchFormValues['matchEvents'];
  setValue: UseFormSetValue<MatchFormValues>;
}

export interface UsePlayerManagementReturn {
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  setPlayerStates: React.Dispatch<
    React.SetStateAction<Record<number, 'playing' | 'bench' | 'absent'>>
  >;
  startingLineup: number[];
  setStartingLineup: React.Dispatch<React.SetStateAction<number[]>>;
  matchDuration: number;
  setMatchDuration: React.Dispatch<React.SetStateAction<number>>;
  onPlayerStateChange: (
    playerId: number,
    newState: 'playing' | 'bench' | 'absent'
  ) => void;
  onSubstitution: (
    minute: number,
    playerInId: number,
    playerOutId: number,
    substitutionReason: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null
  ) => void;
  onGoalOrAssist: (playerId: number, eventType: 'GOAL' | 'ASSIST') => void;
  playerMinutes: ReturnType<typeof calculatePlayerMinutes>;
}

export interface StrengthModalHook {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  isConfirmOpen: boolean;
  onConfirmOpen: () => void;
  onConfirmChange: (isOpen: boolean) => void;
  selectedStrength: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null;
  setSelectedStrength: React.Dispatch<
    React.SetStateAction<'STRONGER' | 'SIMILAR' | 'WEAKER' | null>
  >;
}
