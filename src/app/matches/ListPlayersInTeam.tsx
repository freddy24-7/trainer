import React from 'react';

import PlayerInput from '@/components/PlayerInput';
import { PlayerListProps } from '@/types/user-types';

const ListPlayersInTeam: React.FC<PlayerListProps> = ({
  players,
  playerMinutes,
  playerAvailability,
  onMinutesChange,
  onAvailabilityChange,
}) => {
  return (
    <div>
      <h4 className="text-md font-semibold mt-6 mb-4 mx-auto text-center">
        Home Team Players
      </h4>
      {players.map((player) => (
        <PlayerInput
          key={player.id}
          player={player}
          minutes={playerMinutes[player.id] || 0}
          available={playerAvailability[player.id] || false}
          onMinutesChange={onMinutesChange}
          onAvailabilityChange={onAvailabilityChange}
        />
      ))}
    </div>
  );
};

export default ListPlayersInTeam;
