import React from 'react';

import PlayerList from '@/components/matches/PlayerList';
import { PlayerListWrapperProps } from '@/types/types';

const PlayerListWrapper: React.FC<PlayerListWrapperProps> = ({
  players,
  playerValues,
  setValue,
}) => {
  const playerMinutes = playerValues.reduce(
    (acc, player) => ({ ...acc, [player.id]: player.minutes }),
    {}
  );

  const playerAvailability = playerValues.reduce(
    (acc, player) => ({
      ...acc,
      [player.id]: player.available,
    }),
    {}
  );
  const handleMinutesChange = (playerId: number, minutes: string): void => {
    setValue(
      'players',
      playerValues.map((player) =>
        player.id === playerId
          ? { ...player, minutes: parseInt(minutes, 10) || '' }
          : player
      )
    );
  };

  const handleAvailabilityChange = (
    playerId: number,
    available: boolean
  ): void => {
    setValue(
      'players',
      playerValues.map((player) =>
        player.id === playerId ? { ...player, available } : player
      )
    );
  };

  return (
    <PlayerList
      players={players}
      playerMinutes={playerMinutes}
      playerAvailability={playerAvailability}
      onMinutesChange={handleMinutesChange}
      onAvailabilityChange={handleAvailabilityChange}
    />
  );
};

export default PlayerListWrapper;
