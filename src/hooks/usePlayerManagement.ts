import { useMemo, useState } from 'react';

import {
  UsePlayerManagementParams,
  UsePlayerManagementReturn,
} from '@/types/hook-types';
import {
  calculatePlayerMinutes,
  handlePlayerStateChange,
} from '@/utils/playerManagementUtils';
import { processSubstitution } from '@/utils/substitutionUtils';

export const usePlayerManagement = ({
  players,
  matchEvents,
  setValue,
}: UsePlayerManagementParams): UsePlayerManagementReturn => {
  const [playerStates, setPlayerStates] = useState<
    Record<number, 'playing' | 'bench' | 'absent'>
  >(players.reduce((acc, player) => ({ ...acc, [player.id]: 'absent' }), {}));
  const [startingLineup, setStartingLineup] = useState<number[]>([]);
  const [matchDuration, setMatchDuration] = useState(70);

  const onPlayerStateChange = (
    playerId: number,
    newState: 'playing' | 'bench' | 'absent'
  ): void => {
    const { updatedPlayerStates, updatedStartingLineup } =
      handlePlayerStateChange(playerId, newState, playerStates, startingLineup);
    setPlayerStates(updatedPlayerStates);
    setStartingLineup(updatedStartingLineup);
  };

  const onSubstitution = (
    minute: number,
    playerInId: number,
    playerOutId: number,
    substitutionReason: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null
  ): void => {
    const substitutionData = {
      minute,
      playerInId,
      playerOutId,
      substitutionReason,
    };
    const gameState = {
      matchEvents,
      playerStates,
    };
    processSubstitution(substitutionData, gameState, setValue, setPlayerStates);
  };

  const onGoalOrAssist = (
    playerId: number,
    eventType: 'GOAL' | 'ASSIST'
  ): void => {
    const currentEvents = matchEvents || [];
    const newEvent = {
      playerId,
      eventType,
      minute: 0,
      playerInId: null,
      playerOutId: null,
      substitutionReason: undefined,
    };

    setValue('matchEvents', [...currentEvents, newEvent]);
  };

  const playerMinutes = useMemo(
    () =>
      calculatePlayerMinutes(
        players,
        matchEvents,
        startingLineup,
        matchDuration
      ),
    [matchEvents, startingLineup, matchDuration, players]
  );

  return {
    playerStates,
    setPlayerStates,
    startingLineup,
    setStartingLineup,
    matchDuration,
    setMatchDuration,
    onPlayerStateChange,
    onSubstitution,
    onGoalOrAssist,
    playerMinutes,
  };
};
