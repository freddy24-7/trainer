jest.spyOn(console, 'error').mockImplementation(() => {});
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import SubstitutionManagementBody from '@/components/helpers/matchHelpers/SubstitutionManagementBody';
import {
  SubstitutionManagementBodyProps,
  Substitution,
} from '@/types/match-types';
import { Player } from '@/types/user-types';

jest.mock('../src/components/helpers/matchHelpers/SubstitutionDetails', () => {
  const MockSubstitutionDetails = () => (
    <div data-testid="substitution-details" />
  );
  MockSubstitutionDetails.displayName = 'MockSubstitutionDetails';
  return MockSubstitutionDetails;
});

describe('SubstitutionManagementBody', () => {
  let mockSetMinute: jest.Mock;
  let mockSetSubstitutions: jest.Mock;
  let players: Player[];
  let playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  let substitutions: Substitution[];

  beforeEach(() => {
    mockSetMinute = jest.fn();
    mockSetSubstitutions = jest.fn();

    players = [
      { id: 1, username: 'Player 1' },
      { id: 2, username: 'Player 2' },
      { id: 3, username: 'Player 3' },
    ];

    playerStates = {
      1: 'playing',
      2: 'bench',
      3: 'playing',
    };

    substitutions = [];
  });

  const renderComponent = (props?: Partial<SubstitutionManagementBodyProps>) =>
    render(
      <SubstitutionManagementBody
        players={players}
        playerStates={playerStates}
        minute={15}
        setMinute={mockSetMinute}
        substitutions={substitutions}
        setSubstitutions={mockSetSubstitutions}
        {...props}
      />
    );

  it('renders correctly with initial state', () => {
    renderComponent();

    expect(screen.getByPlaceholderText(/Minuut/i)).toBeInTheDocument();
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 3')).toBeInTheDocument();
  });

  it('updates the minute input correctly', () => {
    renderComponent();

    const minuteInput = screen.getByPlaceholderText(/Minuut/i);
    fireEvent.change(minuteInput, { target: { value: '20' } });

    expect(mockSetMinute).toHaveBeenCalledWith(20);
  });

  it('adds a substitution when a checkbox is checked', () => {
    renderComponent();

    const player1Checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(player1Checkbox);

    expect(mockSetSubstitutions).toHaveBeenCalled();
  });

  it('removes a substitution when a checkbox is unchecked', () => {
    substitutions = [
      { playerOutId: 1, playerInId: null, substitutionReason: null },
    ];
    renderComponent({ substitutions });

    const player1Checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(player1Checkbox);

    expect(mockSetSubstitutions).toHaveBeenCalled();
  });

  it('renders substitution details when a player is substituted', () => {
    substitutions = [
      { playerOutId: 1, playerInId: null, substitutionReason: null },
    ];
    renderComponent({ substitutions });

    expect(screen.getByTestId('substitution-details')).toBeInTheDocument();
  });
});
