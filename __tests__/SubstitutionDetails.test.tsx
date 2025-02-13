import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import SubstitutionDetails from '@/components/helpers/matchHelpers/SubstitutionDetails';
import { SubstitutionDetailsProps, Substitution } from '@/types/match-types';
import { Player } from '@/types/user-types';
import { handleSubstitutionChange } from '@/utils/substitutionUtils';

jest.mock('../src/utils/substitutionUtils', () => ({
  handleSubstitutionChange: jest.fn(),
}));

describe('SubstitutionDetails', () => {
  let mockSetSubstitutions: jest.Mock;
  let players: Player[];
  let playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  let substitutions: Substitution[];

  beforeEach(() => {
    mockSetSubstitutions = jest.fn();

    players = [
      { id: 1, username: 'Player 1' },
      { id: 2, username: 'Player 2' },
      { id: 3, username: 'Player 3' },
    ];

    playerStates = {
      1: 'playing',
      2: 'bench',
      3: 'bench',
    };

    substitutions = [
      { playerOutId: 1, playerInId: null, substitutionReason: null },
    ];
  });

  const renderComponent = (props?: Partial<SubstitutionDetailsProps>) =>
    render(
      <SubstitutionDetails
        player={players[0]}
        players={players}
        playerStates={playerStates}
        substitutions={substitutions}
        setSubstitutions={mockSetSubstitutions}
        {...props}
      />
    );

  it('renders the player substitution dropdown and options', () => {
    renderComponent();

    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();

    expect(screen.getByText('Inkomend')).toBeInTheDocument();

    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('Player 3')).toBeInTheDocument();
  });

  it('calls handleSubstitutionChange when a player is selected', () => {
    renderComponent();

    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: '2' } });

    expect(handleSubstitutionChange).toHaveBeenCalledWith(
      mockSetSubstitutions,
      1,
      'playerInId',
      '2'
    );
  });

  it('renders and handles selection of substitution reasons', () => {
    renderComponent();

    const reasonRadio = screen.getByLabelText('Tactisch');
    fireEvent.click(reasonRadio);

    expect(handleSubstitutionChange).toHaveBeenCalledWith(
      mockSetSubstitutions,
      1,
      'substitutionReason',
      'TACTICAL'
    );
  });

  it('ensures only available bench players are selectable', () => {
    playerStates = { 1: 'playing', 2: 'bench', 3: 'playing' };
    renderComponent({ playerStates });

    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.queryByText('Player 3')).not.toBeInTheDocument();
  });
});
