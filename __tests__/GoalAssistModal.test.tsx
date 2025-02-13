import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';

import { GoalAssistModalProps } from '@/types/match-types';
import { Player } from '@/types/user-types';

import GoalAssistModal from '../src/components/helpers/matchHelpers/GoalAssistModal';

jest.mock(
  '../src/components/helpers/matchHelpers/SelectGoalScorerModal',
  () => {
    const MockSelectGoalScorerModal = ({ isOpen, onSelect, onCancel }: any) =>
      isOpen ? (
        <div data-testid="select-goal-scorer">
          <button onClick={() => onSelect({ id: 1, username: 'Player 1' })}>
            Select Player 1
          </button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      ) : null;

    MockSelectGoalScorerModal.displayName = 'MockSelectGoalScorerModal';
    return MockSelectGoalScorerModal;
  }
);

jest.mock('../src/components/helpers/matchHelpers/ConfirmGoalModal', () => {
  const MockConfirmGoalModal = ({ isOpen, onCancel, onConfirm }: any) =>
    isOpen ? (
      <div data-testid="confirm-goal">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null;

  MockConfirmGoalModal.displayName = 'MockConfirmGoalModal';
  return MockConfirmGoalModal;
});

jest.mock('../src/components/helpers/matchHelpers/AskAddAssistModal', () => {
  const MockAskAddAssistModal = ({ isOpen, onYes, onNo }: any) =>
    isOpen ? (
      <div data-testid="ask-add-assist">
        <button onClick={onYes}>Yes</button>
        <button onClick={onNo}>No</button>
      </div>
    ) : null;

  MockAskAddAssistModal.displayName = 'MockAskAddAssistModal';
  return MockAskAddAssistModal;
});

jest.mock('../src/components/helpers/matchHelpers/SelectAssistModal', () => {
  const MockSelectAssistModal = ({ isOpen, onSelect, onCancel }: any) =>
    isOpen ? (
      <div data-testid="select-assist">
        <button onClick={() => onSelect({ id: 2, username: 'Player 2' })}>
          Select Player 2
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null;

  MockSelectAssistModal.displayName = 'MockSelectAssistModal';
  return MockSelectAssistModal;
});

jest.mock('../src/components/helpers/matchHelpers/ConfirmAssistModal', () => {
  const MockConfirmAssistModal = ({ isOpen, onCancel, onConfirm }: any) =>
    isOpen ? (
      <div data-testid="confirm-assist">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null;

  MockConfirmAssistModal.displayName = 'MockConfirmAssistModal';
  return MockConfirmAssistModal;
});

describe('GoalAssistModal', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnConfirm = jest.fn();
  const players: Player[] = [
    { id: 1, username: 'Player 1' },
    { id: 2, username: 'Player 2' },
  ];
  const playerStates: Record<number, 'playing' | 'bench' | 'absent'> = {
    1: 'playing',
    2: 'bench',
  };

  const playerSelection = 'Select Player 1';

  const renderComponent = (props?: Partial<GoalAssistModalProps>) =>
    render(
      <GoalAssistModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        players={players}
        playerStates={playerStates}
        onConfirm={mockOnConfirm}
        {...props}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('opens modal and starts with goal scorer selection', () => {
    renderComponent();
    expect(screen.getByTestId('select-goal-scorer')).toBeInTheDocument();
  });

  it('progresses to confirm goal step after selecting a goal scorer', () => {
    renderComponent();
    fireEvent.click(screen.getByText(playerSelection));

    expect(screen.getByTestId('confirm-goal')).toBeInTheDocument();
  });

  it('goes back to goal scorer selection if cancel is clicked in confirm goal step', () => {
    renderComponent();
    fireEvent.click(screen.getByText(playerSelection));
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.getByTestId('select-goal-scorer')).toBeInTheDocument();
  });

  it('moves to ask assist step after confirming goal', () => {
    renderComponent();
    fireEvent.click(screen.getByText(playerSelection));
    fireEvent.click(screen.getByText('Confirm'));

    expect(screen.getByTestId('ask-add-assist')).toBeInTheDocument();
  });

  it('closes modal when "No" is selected in ask assist step', () => {
    renderComponent();
    fireEvent.click(screen.getByText(playerSelection));
    fireEvent.click(screen.getByText('Confirm'));
    fireEvent.click(screen.getByText('No'));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('progresses to select assist step when "Yes" is clicked in ask assist step', () => {
    renderComponent();
    fireEvent.click(screen.getByText(playerSelection));
    fireEvent.click(screen.getByText('Confirm'));
    fireEvent.click(screen.getByText('Yes'));

    expect(screen.getByTestId('select-assist')).toBeInTheDocument();
  });

  it('moves to confirm assist step after selecting an assist provider', () => {
    renderComponent();
    fireEvent.click(screen.getByText(playerSelection));
    fireEvent.click(screen.getByText('Confirm'));
    fireEvent.click(screen.getByText('Yes'));
    fireEvent.click(screen.getByText('Select Player 2'));

    expect(screen.getByTestId('confirm-assist')).toBeInTheDocument();
  });

  it('closes modal when confirm assist step is completed', () => {
    renderComponent();
    fireEvent.click(screen.getByText(playerSelection));
    fireEvent.click(screen.getByText('Confirm'));
    fireEvent.click(screen.getByText('Yes'));
    fireEvent.click(screen.getByText('Select Player 2'));
    fireEvent.click(screen.getByText('Confirm'));

    expect(mockOnConfirm).toHaveBeenCalledWith(2, 'ASSIST');
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
