import React from 'react';
import { PlayersFieldProps } from '@/types/user-types';

const PlayersField: React.FC<PlayersFieldProps> = ({
  players,
  playerValues,
  setValue,
}) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">Players in Team</h4>
      {players.map((player, index) => (
        <div key={player.id} className="flex items-center space-x-4 mb-2">
          <div className="w-1/3">
            <label>{player.username}</label>
          </div>
          <div className="w-1/3">
            <input
              type="number"
              value={playerValues[index].minutes}
              disabled={!playerValues[index].available}
              placeholder="Minutes played"
              onChange={(e) =>
                setValue(
                  `players.${index}.minutes`,
                  e.target.value === '' ? '' : parseInt(e.target.value, 10)
                )
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="w-1/3">
            <label>
              <input
                type="checkbox"
                checked={playerValues[index].available}
                onChange={(e) =>
                  setValue(`players.${index}.available`, e.target.checked)
                }
              />
              Available
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayersField;
