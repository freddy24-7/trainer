import React from 'react';
import { UseFormSetValue } from 'react-hook-form';

import ListPlayersInTeam from '@/components/helpers/ListPlayersInTeam';
import { MatchFormValues } from '@/types/match-types';
import { Player } from '@/types/user-types';
import {
  getPlayerMinutes,
  getPlayerAvailability,
  updatePlayerMinutes,
  updatePlayerAvailability,
} from '@/utils/playerUtils';

interface PlayerManagementProps {
  players: Player[];
  playerValues: MatchFormValues['players'];
  setValue: UseFormSetValue<MatchFormValues>;
}

const PlayerManagement: React.FC<PlayerManagementProps> = ({
  players,
  playerValues,
  setValue,
}) => {
  const mappedPlayers = players.map((player) => {
    const playerValue = playerValues.find((p) => p.id === player.id);
    return {
      ...player,
      minutes: playerValue?.minutes || '',
      available: playerValue?.available || false,
    };
  });

  return (
    <div>
      <ListPlayersInTeam
        players={mappedPlayers}
        playerMinutes={
          getPlayerMinutes(playerValues) as { [key: number]: number }
        }
        playerAvailability={getPlayerAvailability(playerValues)}
        onMinutesChange={(playerId, minutes) =>
          setValue(
            'players',
            updatePlayerMinutes(playerValues, playerId, minutes)
          )
        }
        onAvailabilityChange={(playerId, available) =>
          setValue(
            'players',
            updatePlayerAvailability(playerValues, playerId, available)
          )
        }
      />
    </div>
  );
};

export default PlayerManagement;
