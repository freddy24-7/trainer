import { render, screen, fireEvent } from '@testing-library/react';
import { AddMatchForm } from '@/app/matches/AddMatchForm';
import { Poule, Player } from '@/lib/types';

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

describe('AddMatchForm', () => {
  const mockAction = jest.fn();

  const mockPoule: Poule = {
    id: 1,
    pouleName: 'Poule 1',
    teams: [{ id: 1, name: 'Team 1' }],
    opponents: [{ id: 1, team: { id: 1, name: 'Opponent 1' } }],
  };

  const mockPlayers: Player[] = [
    { id: 1, username: 'Player 1', whatsappNumber: '123456789}' },
    { id: 2, username: 'Player 2', whatsappNumber: '123456789' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form and the default poule and opponent', () => {
    // Arrange
    render(
      <AddMatchForm
        action={mockAction}
        poules={[mockPoule]}
        players={mockPlayers}
      />
    );

    // Act
    const pouleSelector = screen.getByText('Poule 1');
    const opponentSelector = screen.getByText('Opponent 1');

    // Assert
    expect(pouleSelector).toBeInTheDocument();
    expect(opponentSelector).toBeInTheDocument();
  });

  it('should change selected poule and opponent', () => {
    // Arrange
    render(
      <AddMatchForm
        action={mockAction}
        poules={[mockPoule]}
        players={mockPlayers}
      />
    );

    // Act
    const pouleSelector = screen.getByText('Poule 1');
    fireEvent.click(pouleSelector);

    const opponentSelector = screen.getByText('Opponent 1');
    fireEvent.click(opponentSelector);

    // Assert
    expect(pouleSelector).toBeInTheDocument();
    expect(opponentSelector).toBeInTheDocument();
  });
});
