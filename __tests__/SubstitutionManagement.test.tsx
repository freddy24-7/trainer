import { render, screen } from '@testing-library/react';
import React from 'react';

import { SubstitutionManagementProps } from '@/types/match-types';
import { Player } from '@/types/user-types';

import SubstitutionManagement from '../src/components/helpers/matchHelpers/SubstitutionManagement';

jest.mock('../src/components/Button', () => {
  return function MockButton({ children, isDisabled, onPress, ...rest }: any) {
    return (
      <button disabled={isDisabled} onClick={onPress} {...rest}>
        {children}
      </button>
    );
  };
});

const mockSetSubstitutions = jest.fn();

jest.mock(
  '../src/components/helpers/matchHelpers/SubstitutionManagementBody',
  () => {
    return function MockSubstitutionManagementBody() {
      mockSetSubstitutions.mockImplementation((substitutions) => {
        console.log('Mock setSubstitutions called with:', substitutions);
      });
      return <div data-testid="substitution-management-body" />;
    };
  }
);

jest.setTimeout(30000);

describe('SubstitutionManagement', () => {
  let mockSetValue: jest.Mock;
  let mockSetPlayerStates: jest.Mock;
  let players: Player[];
  let playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  let matchEvents: any[];
  let mockOnSubstitution: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    mockSetValue = jest.fn();
    mockSetPlayerStates = jest.fn();
    mockOnSubstitution = jest.fn();

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

    matchEvents = [];
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderComponent = (props?: Partial<SubstitutionManagementProps>) =>
    render(
      <SubstitutionManagement
        players={players}
        playerStates={playerStates}
        matchEvents={matchEvents}
        setValue={mockSetValue}
        setPlayerStates={mockSetPlayerStates}
        onSubstitution={mockOnSubstitution}
        {...props}
      />
    );

  it('should render the button to open modal', () => {
    renderComponent();

    const openButton = screen.getByText('Beheer wissels');
    expect(openButton).toBeInTheDocument();
  });
});
