import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { AddMatchForm } from '@/components/matches/AddMatchForm';
import { Poule, Player } from '@/types/types';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const setupMocks = (): {
  mockAction: jest.Mock;
  mockPoule: Poule;
  mockPlayers: Player[];
} => {
  const opponentNameConstant = 'Opponent 1';

  return {
    mockAction: jest.fn(),
    mockPoule: {
      id: 1,
      pouleName: 'Poule 1',
      teams: [{ id: 1, name: 'Team 1' }],
      opponents: [{ id: 1, team: { id: 1, name: opponentNameConstant } }],
    },
    mockPlayers: [
      { id: 1, username: 'Player 1', whatsappNumber: '123456789' },
      { id: 2, username: 'Player 2', whatsappNumber: '123456789' },
    ] as Player[],
  };
};

const pouleNameConstant = 'Poule 1';
const opponentNameConstant = 'Opponent 1';

const renderAddMatchForm = (
  action: jest.Mock,
  poules: Poule[],
  players: Player[]
): void => {
  render(<AddMatchForm action={action} poules={poules} players={players} />);
};

describe('AddMatchForm', () => {
  const { mockAction, mockPoule, mockPlayers } = setupMocks();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form and the default poule and opponent', () => {
    renderAddMatchForm(mockAction, [mockPoule], mockPlayers);

    const pouleSelector = screen.getByText(pouleNameConstant);
    const opponentSelector = screen.getByText(opponentNameConstant);

    expect(pouleSelector).toBeInTheDocument();
    expect(opponentSelector).toBeInTheDocument();
  });

  it('should change selected poule and opponent', () => {
    renderAddMatchForm(mockAction, [mockPoule], mockPlayers);

    const pouleSelector = screen.getByText(pouleNameConstant);
    fireEvent.click(pouleSelector);

    const opponentSelector = screen.getByText(opponentNameConstant);
    fireEvent.click(opponentSelector);

    expect(pouleSelector).toBeInTheDocument();
    expect(opponentSelector).toBeInTheDocument();
  });
});
