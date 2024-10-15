import React from 'react';
import { TrainingPlayersFieldProps } from '@/types/type-list';

const TrainingPlayersField: React.FC<TrainingPlayersFieldProps> = ({
  players,
  playerValues,
  setValue,
}) => {
  const toggleAbsence = (index: number) => {
    setValue(`players.${index}.absent`, !playerValues[index].absent);
  };

  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">Mark Absent Players</h4>
      <div className="space-y-2">
        {players.map((player, index) => (
          <div
            key={player.id}
            className="flex justify-start items-center space-x-4 mb-2"
          >
            <input
              type="checkbox"
              checked={playerValues[index].absent}
              onChange={() => toggleAbsence(index)}
              className="checkbox"
            />
            <span>{player.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingPlayersField;
