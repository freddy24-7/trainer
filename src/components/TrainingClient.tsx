import React from 'react';
import { TrainingClientProps } from '@/lib/types';

const TrainingClient: React.FC<TrainingClientProps> = ({ trainingData }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {trainingData.length === 0 ? (
        <p>No training sessions found.</p>
      ) : (
        trainingData.map((training) => (
          <div
            key={training.id}
            className="p-4 bg-white shadow-md rounded-md border"
          >
            <h3 className="text-lg font-semibold text-gray-700">
              Training Date: {new Date(training.date).toLocaleDateString()}{' '}
            </h3>
            {training.absentPlayers.length > 0 && (
              <h2 className="text-md font-semibold mt-2 text-gray-800">
                Absent:
              </h2>
            )}
            <ul className="mt-2 space-y-1">
              {training.absentPlayers.length === 0 ? (
                <li className="text-green-600">All players were present.</li>
              ) : (
                training.absentPlayers.map((player, index) => (
                  <li key={index} className="text-red-600">
                    {player}
                  </li>
                ))
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default TrainingClient;
