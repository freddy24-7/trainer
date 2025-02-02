import { Button } from '@heroui/react';
import React, { useEffect, useState } from 'react';

import GoalAssistModal from '@/components/helpers/matchHelpers/GoalAssistModal';
import LineupManagement from '@/components/helpers/matchHelpers/LineupManagement';
import MatchDurationInput from '@/components/helpers/matchHelpers/MatchDurationInput';
import PlayerMinutes from '@/components/helpers/matchHelpers/PlayerMinutes';
import SubstitutionManagement from '@/components/helpers/matchHelpers/SubstitutionManagement';
import { usePlayerManagement } from '@/hooks/usePlayerManagement';
import { PlayerManagementProps } from '@/types/match-types';

const PlayerManagement: React.FC<
  PlayerManagementProps & { onLineupFinalized: (finalized: boolean) => void }
> = ({ players, setValue, matchEvents, onLineupFinalized }) => {
  const {
    playerStates,
    setPlayerStates,
    matchDuration,
    setMatchDuration,
    onPlayerStateChange,
    onSubstitution,
    onGoalOrAssist,
    playerMinutes,
  } = usePlayerManagement({ players, matchEvents, setValue });

  const [lineupFinalized, setLineupFinalized] = useState(false);
  const [isGoalAssistModalOpen, setGoalAssistModalOpen] = useState(false);

  useEffect(() => {
    setValue(
      'players',
      players.map((player) => ({
        id: player.id,
        state: playerStates[player.id],
        minutes: playerMinutes[player.id],
        available: playerStates[player.id] !== 'absent',
      }))
    );
  }, [lineupFinalized, playerStates, players, setValue, playerMinutes]);

  useEffect(() => {
    onLineupFinalized(lineupFinalized);
  }, [lineupFinalized, onLineupFinalized]);

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
            onConfirm={() => setLineupFinalized(true)}
          />
        )}
        <SubstitutionManagement
          players={players}
          playerStates={playerStates}
          matchEvents={matchEvents}
          setValue={setValue}
          setPlayerStates={setPlayerStates}
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
