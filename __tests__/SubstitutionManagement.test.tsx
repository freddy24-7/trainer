import React from 'react';
import { toast } from 'react-toastify';

import { Substitution } from '@/types/match-types';
import { handleConfirmAllAtOnce } from '@/utils/substitutionUtils';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('../src/components/Button', () => {
  return function MockButton({ children, isDisabled, onPress, ...rest }: any) {
    return (
      <button disabled={isDisabled} onClick={onPress} {...rest}>
        {children}
      </button>
    );
  };
});

jest.mock(
  '../src/components/helpers/matchHelpers/SubstitutionManagementBody',
  () => {
    return function MockSubstitutionManagementBody() {
      return <div data-testid="substitution-management-body" />;
    };
  }
);

describe('SubstitutionManagement - handleConfirmAllAtOnce', () => {
  let mockSetValue: jest.Mock;
  let mockSetPlayerStates: jest.Mock;
  let mockSetOpen: jest.Mock;
  let mockSetMinute: jest.Mock;
  let mockSetSubstitutions: jest.Mock;
  let playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  let matchEvents: any[];
  let substitutions: Substitution[];

  beforeEach(() => {
    jest.clearAllMocks();

    mockSetValue = jest.fn();
    mockSetPlayerStates = jest.fn();
    mockSetOpen = jest.fn();
    mockSetMinute = jest.fn();
    mockSetSubstitutions = jest.fn();

    playerStates = {
      1: 'playing',
      2: 'bench',
      3: 'playing',
    };

    matchEvents = [];

    substitutions = [
      { playerOutId: 1, playerInId: 2, substitutionReason: 'TACTICAL' },
    ];
  });

  it('should call setValue and update player states when valid substitutions are provided', () => {
    handleConfirmAllAtOnce({
      minute: 45,
      substitutions,
      matchEvents,
      playerStates,
      setValue: mockSetValue,
      setPlayerStates: mockSetPlayerStates,
      setOpen: mockSetOpen,
      setMinute: mockSetMinute,
      setSubstitutions: mockSetSubstitutions,
    });

    expect(mockSetValue).toHaveBeenCalledWith('matchEvents', [
      {
        minute: 45,
        playerInId: 2,
        playerOutId: 1,
        eventType: 'SUBSTITUTION',
        substitutionReason: 'TACTICAL',
      },
    ]);

    expect(mockSetPlayerStates).toHaveBeenCalledWith({
      1: 'bench',
      2: 'playing',
      3: 'playing',
    });

    expect(mockSetOpen).toHaveBeenCalledWith(false);
    expect(mockSetMinute).toHaveBeenCalledWith('');
    expect(mockSetSubstitutions).toHaveBeenCalledWith([]);
  });

  it('should show an error toast when a required field is missing', () => {
    handleConfirmAllAtOnce({
      minute: '',
      substitutions,
      matchEvents,
      playerStates,
      setValue: mockSetValue,
      setPlayerStates: mockSetPlayerStates,
      setOpen: mockSetOpen,
      setMinute: mockSetMinute,
      setSubstitutions: mockSetSubstitutions,
    });

    expect(toast.error).toHaveBeenCalledWith(
      '⚠️ Vul alle velden in voor elke wissel.'
    );
    expect(mockSetValue).not.toHaveBeenCalled();
    expect(mockSetPlayerStates).not.toHaveBeenCalled();
  });

  it('should handle multiple substitutions correctly', () => {
    handleConfirmAllAtOnce({
      minute: 60,
      substitutions: [
        { playerOutId: 1, playerInId: 2, substitutionReason: 'TACTICAL' },
        { playerOutId: 3, playerInId: 1, substitutionReason: 'INJURY' },
      ],
      matchEvents,
      playerStates,
      setValue: mockSetValue,
      setPlayerStates: mockSetPlayerStates,
      setOpen: mockSetOpen,
      setMinute: mockSetMinute,
      setSubstitutions: mockSetSubstitutions,
    });

    expect(mockSetValue).toHaveBeenCalledWith('matchEvents', [
      {
        minute: 60,
        playerInId: 2,
        playerOutId: 1,
        eventType: 'SUBSTITUTION',
        substitutionReason: 'TACTICAL',
      },
      {
        minute: 60,
        playerInId: 1,
        playerOutId: 3,
        eventType: 'SUBSTITUTION',
        substitutionReason: 'INJURY',
      },
    ]);
  });

  it('should not proceed when all substitutions are missing playerInId', () => {
    handleConfirmAllAtOnce({
      minute: 45,
      substitutions: [
        { playerOutId: 1, playerInId: null, substitutionReason: 'TACTICAL' },
        { playerOutId: 3, playerInId: null, substitutionReason: 'INJURY' },
      ],
      matchEvents,
      playerStates,
      setValue: mockSetValue,
      setPlayerStates: mockSetPlayerStates,
      setOpen: mockSetOpen,
      setMinute: mockSetMinute,
      setSubstitutions: mockSetSubstitutions,
    });

    expect(toast.error).toHaveBeenCalledWith(
      '⚠️ Vul alle velden in voor elke wissel.'
    );
    expect(mockSetValue).not.toHaveBeenCalled();
  });
});
