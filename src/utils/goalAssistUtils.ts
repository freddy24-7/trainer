import React from 'react';

interface GoalAssistUtilsParams {
  setGoalScorer: React.Dispatch<React.SetStateAction<number | null>>;
  setAssistProvider: React.Dispatch<React.SetStateAction<number | null>>;
  onConfirm: (playerId: number, eventType: 'GOAL' | 'ASSIST') => void;
  onOpenChange: (value: boolean) => void;
}

export const handleGoalScorerChange = (
  playerId: number | null,
  { setGoalScorer, onConfirm }: GoalAssistUtilsParams
): void => {
  setGoalScorer(playerId);
  if (playerId !== null) {
    onConfirm(playerId, 'GOAL');
  }
};

export const handleAssistProviderChange = (
  playerId: number | null,
  { setAssistProvider, onConfirm }: GoalAssistUtilsParams
): void => {
  setAssistProvider(playerId);
  if (playerId !== null) {
    onConfirm(playerId, 'ASSIST');
  }
};

export const resetState = ({
  setGoalScorer,
  setAssistProvider,
  onOpenChange,
}: GoalAssistUtilsParams): void => {
  setGoalScorer(null);
  setAssistProvider(null);
  onOpenChange(false);
};
