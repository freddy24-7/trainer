import { renderHook, act } from '@testing-library/react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

import { usePouleState } from '@/hooks/usePouleState';
import { MatchFormValues } from '@/types/match-types';
import { Poule } from '@/types/poule-types';

describe('usePouleState', () => {
  let mockSetValue: jest.MockedFunction<UseFormSetValue<MatchFormValues>>;
  let mockWatch: UseFormWatch<MatchFormValues>;

  beforeEach(() => {
    mockSetValue = jest.fn();

    mockWatch = jest.fn((field?: keyof MatchFormValues) => {
      const values: Partial<MatchFormValues> = { opponent: 101 };
      return field ? values[field] : undefined;
    }) as unknown as UseFormWatch<MatchFormValues>;
  });

  const poules: Poule[] = [
    {
      id: 1,
      pouleName: 'Poule A',
      teams: [],
      opponents: [
        { id: 101, team: { id: 201, name: 'Opponent 1' } },
        { id: 102, team: { id: 202, name: 'Opponent 2' } },
      ],
    },
    {
      id: 2,
      pouleName: 'Poule B',
      teams: [],
      opponents: [{ id: 103, team: { id: 203, name: 'Opponent 3' } }],
    },
  ];

  it('should initialize with null values if no poule is selected', () => {
    const { result } = renderHook(() =>
      usePouleState(poules, undefined, mockWatch, mockSetValue)
    );

    expect(result.current.selectedPoule).toBeNull();
    expect(result.current.selectedOpponent).toBeNull();
  });

  it('should set selectedPoule when selectedPouleId is provided', () => {
    const { result } = renderHook(() =>
      usePouleState(poules, 1, mockWatch, mockSetValue)
    );

    expect(result.current.selectedPoule).toEqual(poules[0]);
  });

  it('should update selectedOpponent when opponentId changes', () => {
    mockWatch = jest.fn((field?: keyof MatchFormValues) => {
      const values: Partial<MatchFormValues> = { opponent: 102 };
      return field ? values[field] : undefined;
    }) as unknown as UseFormWatch<MatchFormValues>;

    const { result } = renderHook(() =>
      usePouleState(poules, 1, mockWatch, mockSetValue)
    );

    expect(result.current.selectedOpponent).toEqual(poules[0].opponents[1]);
  });

  it('should update opponent state when selectedPouleId changes', () => {
    const { result, rerender } = renderHook(
      ({ pouleId }) => usePouleState(poules, pouleId, mockWatch, mockSetValue),
      { initialProps: { pouleId: 1 } }
    );

    expect(result.current.selectedPoule).toEqual(poules[0]);
    expect(result.current.selectedOpponent).toEqual(poules[0].opponents[0]);

    rerender({ pouleId: 2 });

    expect(result.current.selectedPoule).toEqual(poules[1]);
    expect(result.current.selectedOpponent).toEqual(poules[1].opponents[0]);
  });

  it('should call setValue when setting the first opponent as default', () => {
    renderHook(() => usePouleState(poules, 2, mockWatch, mockSetValue));

    expect(mockSetValue).toHaveBeenCalledWith('opponent', 103);
  });

  it('should reset selectedOpponent to null when selectedPouleId is invalid', () => {
    const { result } = renderHook(() =>
      usePouleState(poules, 999, mockWatch, mockSetValue)
    );

    expect(result.current.selectedPoule).toBeNull();
    expect(result.current.selectedOpponent).toBeNull();
  });

  it('should allow manually updating selectedPoule and selectedOpponent', () => {
    const { result } = renderHook(() =>
      usePouleState(poules, 1, mockWatch, mockSetValue)
    );

    act(() => {
      result.current.setSelectedPoule(poules[1]);
      result.current.setSelectedOpponent(poules[1].opponents[0]);
    });

    expect(result.current.selectedPoule).toEqual(poules[1]);
    expect(result.current.selectedOpponent).toEqual(poules[1].opponents[0]);
  });
});
