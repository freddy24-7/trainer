import React from 'react';

import {
  handleGoalScorerChange,
  handleAssistProviderChange,
} from '@/utils/goalAssistUtils';

interface Player {
  id: number;
  username: string;
}

interface GoalAssistModalBodyProps {
  goalScorer: number | null;
  setGoalScorer: React.Dispatch<React.SetStateAction<number | null>>;
  assistProvider: number | null;
  setAssistProvider: React.Dispatch<React.SetStateAction<number | null>>;
  playersOnPitch: Player[];
  onConfirm: (playerId: number, eventType: 'GOAL' | 'ASSIST') => void;
  onOpenChange: (value: boolean) => void;
}

const GoalAssistModalBody: React.FC<GoalAssistModalBodyProps> = ({
  goalScorer,
  setGoalScorer,
  assistProvider,
  setAssistProvider,
  playersOnPitch,
  onConfirm,
  onOpenChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {!goalScorer && (
        <>
          <select
            value={goalScorer || ''}
            onChange={(e) =>
              handleGoalScorerChange(Number(e.target.value), {
                setGoalScorer,
                onConfirm,
                setAssistProvider,
                onOpenChange,
              })
            }
            className="border rounded p-2"
          >
            <option value="" disabled={true}>
              Select Goal Scorer
            </option>
            {playersOnPitch.map((player) => (
              <option key={player.id} value={player.id}>
                {player.username}
              </option>
            ))}
          </select>
        </>
      )}

      {goalScorer && (
        <>
          <select
            value={assistProvider || ''}
            onChange={(e) =>
              handleAssistProviderChange(Number(e.target.value), {
                setGoalScorer,
                setAssistProvider,
                onConfirm,
                onOpenChange,
              })
            }
            className="border rounded p-2"
          >
            <option value="" disabled={true}>
              Select Assist Provider
            </option>
            {playersOnPitch
              .filter((player) => player.id !== goalScorer)
              .map((player) => (
                <option key={player.id} value={player.id}>
                  {player.username}
                </option>
              ))}
          </select>
        </>
      )}
    </div>
  );
};

export default GoalAssistModalBody;
