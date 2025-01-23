import { Button } from '@nextui-org/react';
import React, { useState, useEffect, useMemo } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import GoalAssistModal from '@/components/helpers/matchHelpers/GoalAssistModal';
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
  const [isGoalAssistModalOpen, setGoalAssistModalOpen] = useState(false);

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

  useEffect(() => {
    const updatedPlayers = updatePlayerValues(players, playerMinutes);
    setValue('players', updatedPlayers);
  }, [playerMinutes, players, setValue]);

  useEffect(() => {
    console.log('Updated matchEvents:', matchEvents);
  }, [matchEvents]);

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
        <Button
          onPress={() => setGoalAssistModalOpen(true)}
          color="primary"
          className="mt-4"
          type="button"
        >
          Record Goal/Assist
        </Button>

        <GoalAssistModal
          isOpen={isGoalAssistModalOpen}
          onOpenChange={(open) => setGoalAssistModalOpen(open)}
          players={players}
          playerStates={playerStates}
          onConfirm={(playerId, eventType) => {
            onGoalOrAssist(playerId, eventType);
          }}
        />
      </div>
      <PlayerMinutes players={players} playerMinutes={playerMinutes} />
    </div>
  );
};

export default PlayerManagement;
