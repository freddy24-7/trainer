import React from 'react';

import { PlayerListProps } from '@/types/types';

import PlayerInput from './PlayerInput';

const PlayerList: React.FC<PlayerListProps> = ({
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
          minutes={playerMinutes[player.id] || ''}
          available={
            playerAvailability[player.id] !== undefined
              ? playerAvailability[player.id]
              : true
          }
          onMinutesChange={onMinutesChange}
          onAvailabilityChange={onAvailabilityChange}
        />
      ))}
    </div>
  );
};

export default PlayerList;
