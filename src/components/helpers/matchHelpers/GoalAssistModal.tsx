import React, { useState, useEffect } from 'react';

import { ModalStep, GoalAssistModalProps } from '@/types/match-types';
import { Player } from '@/types/user-types';

import AskAddAssistModal from './AskAddAssistModal';
import ConfirmAssistModal from './ConfirmAssistModal';
import ConfirmGoalModal from './ConfirmGoalModal';
import SelectAssistModal from './SelectAssistModal';
import SelectGoalScorerModal from './SelectGoalScorerModal';

const GoalAssistModal: React.FC<GoalAssistModalProps> = ({
  isOpen,
  onOpenChange,
  players,
  playerStates,
  onConfirm,
}) => {
  const [step, setStep] = useState<ModalStep>('CLOSED');
  const [goalScorer, setGoalScorer] = useState<Player | null>(null);
  const [assistProvider, setAssistProvider] = useState<Player | null>(null);

  const playersOnPitch = players.filter(
    (player) => playerStates[player.id] === 'playing'
  );

  useEffect(() => {
    if (isOpen) {
      setStep('SELECT_GOAL_SCORER');
    } else {
      setStep('CLOSED');
      setGoalScorer(null);
      setAssistProvider(null);
    }
  }, [isOpen]);

  const handleCloseAll = (): void => {
    onOpenChange(false);
    setStep('CLOSED');
    setGoalScorer(null);
    setAssistProvider(null);
  };

  return (
    <>
      <SelectGoalScorerModal
        isOpen={step === 'SELECT_GOAL_SCORER'}
        playersOnPitch={playersOnPitch}
        onSelect={(player) => {
          setGoalScorer(player);
          setStep('CONFIRM_GOAL');
        }}
        onCancel={handleCloseAll}
      />
      <ConfirmGoalModal
        isOpen={step === 'CONFIRM_GOAL'}
        goalScorer={goalScorer}
        onCancel={() => setStep('SELECT_GOAL_SCORER')}
        onConfirm={() => {
          if (goalScorer) {
            onConfirm(goalScorer.id, 'GOAL');
            setStep('ASK_ADD_ASSIST');
          }
        }}
      />
      <AskAddAssistModal
        isOpen={step === 'ASK_ADD_ASSIST'}
        onYes={() => setStep('SELECT_ASSIST')}
        onNo={handleCloseAll}
      />
      <SelectAssistModal
        isOpen={step === 'SELECT_ASSIST'}
        playersOnPitch={playersOnPitch.filter((p) => p.id !== goalScorer?.id)}
        onSelect={(player) => {
          setAssistProvider(player);
          setStep('CONFIRM_ASSIST');
        }}
        onCancel={() => setStep('ASK_ADD_ASSIST')}
      />
      <ConfirmAssistModal
        isOpen={step === 'CONFIRM_ASSIST'}
        assistProvider={assistProvider}
        onCancel={() => setStep('ASK_ADD_ASSIST')}
        onConfirm={() => {
          if (assistProvider) {
            onConfirm(assistProvider.id, 'ASSIST');
            handleCloseAll();
          }
        }}
      />
    </>
  );
};

export default GoalAssistModal;
