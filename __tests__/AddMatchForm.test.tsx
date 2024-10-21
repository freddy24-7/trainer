import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { AddMatchForm } from '@/app/matches/AddMatchForm';
import { Poule } from '@/types/poule-types';
import { Player } from '@/types/user-types';

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

const pouleName = 'Poule 1';
const teamName = 'Team 1';
const opponentName = 'Opponent 1';
const player1Name = 'Player 1';
const player2Name = 'Player 2';
const whatsappNumber = '123456789';

describe('AddMatchForm', () => {
  const mockAction = jest.fn();

  const mockPoule: Poule = {
    id: 1,
    pouleName: pouleName,
    teams: [{ id: 1, name: teamName }],
    opponents: [{ id: 1, team: { id: 1, name: opponentName } }],
  };

  const mockPlayers: Player[] = [
    { id: 1, username: player1Name, whatsappNumber: whatsappNumber },
    { id: 2, username: player2Name, whatsappNumber: whatsappNumber },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form and the default poule and opponent', () => {
    render(
      <AddMatchForm
        action={mockAction}
        poules={[mockPoule]}
        players={mockPlayers}
      />
    );

    const pouleSelector = screen.getByText(pouleName);
    const opponentSelector = screen.getByText(opponentName);

    expect(pouleSelector).toBeInTheDocument();
    expect(opponentSelector).toBeInTheDocument();
  });

  it('should change selected poule and opponent', () => {
    render(
      <AddMatchForm
        action={mockAction}
        poules={[mockPoule]}
        players={mockPlayers}
      />
    );

    const pouleSelector = screen.getByText(pouleName);
    fireEvent.click(pouleSelector);

    const opponentSelector = screen.getByText(opponentName);
    fireEvent.click(opponentSelector);

    expect(pouleSelector).toBeInTheDocument();
    expect(opponentSelector).toBeInTheDocument();
  });
});
