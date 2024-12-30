import React from 'react';

import {
  noTrainingSessionsMessage,
  dateLabel,
  absentLabel,
  allPlayersPresentMessage,
} from '@/strings/clientStrings';
import { TrainingSessionsListProps } from '@/types/training-types';

const TrainingSessionsList: React.FC<TrainingSessionsListProps> = ({
  trainingData,
}) => {
  if (trainingData.length === 0) {
    return <p>{noTrainingSessionsMessage}</p>;
  }

  return (
    <>
      {trainingData.map((training) => (
        <div
          key={training.id}
          className="p-4 bg-white shadow-md rounded-md border"
        >
          <h3 className="text-lg font-semibold text-gray-700">
            {dateLabel}: {new Date(training.date).toLocaleDateString()}{' '}
          </h3>
          {training.absentPlayers.length > 0 && (
            <h2 className="text-md font-semibold mt-2 text-gray-800">
              {absentLabel}:
            </h2>
          )}
          <ul className="mt-2 space-y-1">
            {training.absentPlayers.length === 0 ? (
              <li className="text-green-600">{allPlayersPresentMessage}</li>
            ) : (
              training.absentPlayers.map((player, index) => (
                <li key={index} className="text-red-600">
                  {player}
                </li>
              ))
            )}
          </ul>
        </div>
      ))}
    </>
  );
};

export default TrainingSessionsList;
