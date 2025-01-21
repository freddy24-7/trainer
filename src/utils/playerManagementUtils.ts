import { MatchFormValues } from '@/types/match-types';
import { Player } from '@/types/user-types';

export const calculatePlayerMinutes = (
  players: Player[],
  matchEvents: MatchFormValues['matchEvents'],
  startingLineup: number[],
  matchDuration: number
): Record<number, number> => {
  const playerMinutes: Record<number, number> = {};
  const substitutionEvents: {
    minute: number;
    type: 'in' | 'out';
    playerId: number;
  }[] = [];

  (matchEvents || []).forEach((matchEvent) => {
    if (matchEvent.eventType === 'SUBSTITUTION_IN') {
      if (matchEvent.playerInId) {
        substitutionEvents.push({
          minute: matchEvent.minute,
          type: 'in',
          playerId: matchEvent.playerInId,
        });
      }
      if (matchEvent.playerOutId) {
        substitutionEvents.push({
          minute: matchEvent.minute,
          type: 'out',
          playerId: matchEvent.playerOutId,
        });
      }
    }
  });

  substitutionEvents.sort((a, b) => a.minute - b.minute);

  players.forEach((player) => {
    let totalMinutes = 0;
    let lastInMinute: number | null = null;

    if (startingLineup.includes(player.id)) {
      lastInMinute = 0;
    }

    substitutionEvents
      .filter((matchEvent) => matchEvent.playerId === player.id)
      .forEach((matchEvent) => {
        if (matchEvent.type === 'in') {
          lastInMinute = matchEvent.minute;
          return;
        }

        if (matchEvent.type === 'out' && lastInMinute !== null) {
          totalMinutes += matchEvent.minute - lastInMinute;
          lastInMinute = null;
        }
      });

    if (lastInMinute !== null) {
      totalMinutes += matchDuration - lastInMinute;
    }

    playerMinutes[player.id] = totalMinutes;
  });

  return playerMinutes;
};

export const updatePlayerValues = (
  players: Player[],
  playerMinutes: Record<number, number>
): MatchFormValues['players'] => {
  return players.map((player) => ({
    id: player.id,
    minutes: playerMinutes[player.id] || 0,
    available: true,
  }));
};

export const handlePlayerStateChange = (
  playerId: number,
  newState: 'playing' | 'bench' | 'absent',
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>,
  startingLineup: number[]
): {
  updatedPlayerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  updatedStartingLineup: number[];
} => {
  const updatedPlayerStates: Record<number, 'playing' | 'bench' | 'absent'> = {
    ...playerStates,
    [playerId]: newState,
  };

  let updatedStartingLineup = [...startingLineup];
  if (newState === 'playing' && !startingLineup.includes(playerId)) {
    updatedStartingLineup.push(playerId);
  } else if (newState !== 'playing') {
    updatedStartingLineup = startingLineup.filter((id) => id !== playerId);
  }

  return { updatedPlayerStates, updatedStartingLineup };
};

export const handleSubstitution = (
  substitutionData: {
    minute: number;
    playerInId: number;
    playerOutId: number;
    substitutionReason: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
  },
  gameState: {
    matchEvents: MatchFormValues['matchEvents'];
    playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  }
): {
  updatedMatchEvents: MatchFormValues['matchEvents'];
  updatedPlayerStates: Record<number, 'playing' | 'bench' | 'absent'>;
} => {
  const { minute, playerInId, playerOutId, substitutionReason } =
    substitutionData;
  const { matchEvents = [], playerStates } = gameState;

  const newMatchEvent = {
    playerInId,
    playerOutId,
    minute,
    eventType: 'SUBSTITUTION_IN' as const,
    substitutionReason,
  };

  const updatedMatchEvents = [...matchEvents, newMatchEvent];

  const updatedPlayerStates: Record<number, 'playing' | 'bench' | 'absent'> = {
    ...playerStates,
    [playerOutId]: 'bench',
    [playerInId]: 'playing',
  };

  return { updatedMatchEvents, updatedPlayerStates };
};
