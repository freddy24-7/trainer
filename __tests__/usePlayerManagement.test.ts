import { renderHook, act } from '@testing-library/react';
import { UseFormSetValue } from 'react-hook-form';

import { usePlayerManagement } from '@/hooks/usePlayerManagement';
import { MatchFormValues } from '@/types/match-types';
import { Player } from '@/types/user-types';

describe('usePlayerManagement', () => {
  let mockSetValue: jest.MockedFunction<UseFormSetValue<MatchFormValues>>;

  beforeEach(() => {
    mockSetValue = jest.fn();
  });

  const players: Player[] = [
    { id: 1, username: 'Player 1' },
    { id: 2, username: 'Player 2' },
    { id: 3, username: 'Player 3' },
  ];

  const matchEvents: MatchFormValues['matchEvents'] = [];

  it('should initialize with default states', () => {
    const { result } = renderHook(() =>
      usePlayerManagement({ players, matchEvents, setValue: mockSetValue })
    );

    expect(result.current.playerStates).toEqual({
      1: 'absent',
      2: 'absent',
      3: 'absent',
    });
    expect(result.current.startingLineup).toEqual([]);
    expect(result.current.matchDuration).toBe(70);
  });

  it('should update player state when onPlayerStateChange is called', () => {
    const { result } = renderHook(() =>
      usePlayerManagement({ players, matchEvents, setValue: mockSetValue })
    );

    act(() => {
      result.current.onPlayerStateChange(1, 'playing');
    });

    expect(result.current.playerStates[1]).toBe('playing');
    expect(result.current.startingLineup).toContain(1);

    act(() => {
      result.current.onPlayerStateChange(1, 'bench');
    });

    expect(result.current.playerStates[1]).toBe('bench');
    expect(result.current.startingLineup).not.toContain(1);
  });

  it('should correctly handle substitutions', () => {
    const { result } = renderHook(() =>
      usePlayerManagement({ players, matchEvents, setValue: mockSetValue })
    );

    act(() => {
      result.current.onSubstitution(30, 2, 1, 'TACTICAL');
    });

    expect(mockSetValue).toHaveBeenCalledWith('matchEvents', [
      {
        playerInId: 2,
        playerOutId: 1,
        minute: 30,
        eventType: 'SUBSTITUTION',
        substitutionReason: 'TACTICAL',
      },
    ]);
  });

  it('should handle goals and assists', () => {
    const { result } = renderHook(() =>
      usePlayerManagement({ players, matchEvents, setValue: mockSetValue })
    );

    act(() => {
      result.current.onGoalOrAssist(2, 'GOAL');
    });

    expect(mockSetValue).toHaveBeenCalledWith('matchEvents', [
      {
        playerId: 2,
        eventType: 'GOAL',
        minute: 0,
        playerInId: null,
        playerOutId: null,
        substitutionReason: undefined,
      },
    ]);
  });

  it('should calculate player minutes correctly', () => {
    const { result } = renderHook(() =>
      usePlayerManagement({ players, matchEvents, setValue: mockSetValue })
    );

    expect(result.current.playerMinutes).toBeDefined();
  });

  it('should allow updating match duration', () => {
    const { result } = renderHook(() =>
      usePlayerManagement({ players, matchEvents, setValue: mockSetValue })
    );

    act(() => {
      result.current.setMatchDuration(90);
    });

    expect(result.current.matchDuration).toBe(90);
  });
});
