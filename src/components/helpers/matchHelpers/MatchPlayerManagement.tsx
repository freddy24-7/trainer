import React, { useState, useEffect, useMemo } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import LineupManagement from '@/components/helpers/matchHelpers/LineupManagement';
import MatchDurationInput from '@/components/helpers/matchHelpers/MatchDurationInput';
import PlayerMinutes from '@/components/helpers/matchHelpers/PlayerMinutes';
import SubstitutionManagement from '@/components/helpers/matchHelpers/SubstitutionManagement';
import { MatchFormValues } from '@/types/match-types';
import { Player } from '@/types/user-types';
import {
  calculatePlayerMinutes,
  updatePlayerValues,
  handlePlayerStateChange,
} from '@/utils/playerManagementUtils';
import { processSubstitution } from '@/utils/substitutionUtils';

interface PlayerManagementProps {
  players: Player[];
  playerValues: MatchFormValues['players'];
  setValue: UseFormSetValue<MatchFormValues>;
  matchEvents: MatchFormValues['matchEvents'];
}

const PlayerManagement: React.FC<PlayerManagementProps> = ({
  players,
  setValue,
  matchEvents,
}) => {
  const [playerStates, setPlayerStates] = useState<
    Record<number, 'playing' | 'bench' | 'absent'>
  >(players.reduce((acc, player) => ({ ...acc, [player.id]: 'absent' }), {}));
  const [matchDuration, setMatchDuration] = useState(70);
  const [startingLineup, setStartingLineup] = useState<number[]>([]);
  const [lineupFinalized, setLineupFinalized] = useState(false);

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
  useEffect(() => {
    const updatedPlayers = updatePlayerValues(players, playerMinutes);
    setValue('players', updatedPlayers);
  }, [playerMinutes, players, setValue]);

  return (
    <div>
      <MatchDurationInput
        matchDuration={matchDuration}
        onDurationChange={setMatchDuration}
      />
      <div className="flex flex-col items-center space-y-4 mt-6">
        {!lineupFinalized && (
          <LineupManagement
            players={players}
            playerStates={playerStates}
            onPlayerStateChange={onPlayerStateChange}
            onConfirm={() => {
              setValue(
                'players',
                players.map((player) => ({
                  id: player.id,
                  state: playerStates[player.id],
                  minutes: 0,
                  available: true,
                }))
              );
              setLineupFinalized(true);
            }}
          />
        )}
        <SubstitutionManagement
          players={players}
          playerStates={playerStates}
          onSubstitution={onSubstitution}
        />
      </div>
      <PlayerMinutes players={players} playerMinutes={playerMinutes} />
    </div>
  );
};

export default PlayerManagement;
