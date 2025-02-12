import { renderHook, act } from '@testing-library/react';

import { useMatchFormHandlers } from '@/hooks/useMatchFormHandlers';
import { MatchFormValues } from '@/types/match-types';

describe('useMatchFormHandlers', () => {
  let mockOnSubmit: jest.Mock;

  beforeEach(() => {
    mockOnSubmit = jest.fn().mockResolvedValue(undefined);
  });

  const mockFormData: MatchFormValues = {
    matchType: 'competition',
    poule: 1,
    opponent: 2,
    opponentName: 'Opponent FC',
    date: '2025-02-12',
    players: [
      { id: 1, minutes: 90, available: true },
      { id: 2, minutes: 45, available: false },
    ],
    matchEvents: [],
  };

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useMatchFormHandlers({ onSubmit: mockOnSubmit })
    );

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isConfirmationModalOpen).toBe(false);
  });

  it('should open confirmation modal when form is submitted', () => {
    const { result } = renderHook(() =>
      useMatchFormHandlers({ onSubmit: mockOnSubmit })
    );

    act(() => {
      result.current.handleFormSubmit(mockFormData);
    });

    expect(result.current.isConfirmationModalOpen).toBe(true);
  });

  it('should call onSubmit and handle submission correctly', async () => {
    const { result } = renderHook(() =>
      useMatchFormHandlers({ onSubmit: mockOnSubmit })
    );

    act(() => {
      result.current.handleFormSubmit(mockFormData);
    });

    expect(result.current.isConfirmationModalOpen).toBe(true);

    await act(async () => {
      await result.current.handleConfirmSubmission();
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(mockFormData);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isConfirmationModalOpen).toBe(false);
  });

  it('should handle submission errors gracefully', async () => {
    const error = new Error('Submission failed');
    mockOnSubmit.mockRejectedValueOnce(error);
    console.error = jest.fn();

    const { result } = renderHook(() =>
      useMatchFormHandlers({ onSubmit: mockOnSubmit })
    );

    act(() => {
      result.current.handleFormSubmit(mockFormData);
    });

    await act(async () => {
      await result.current.handleConfirmSubmission();
    });

    expect(console.error).toHaveBeenCalledWith(
      'Error submitting match data:',
      error
    );
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should allow closing the confirmation modal', () => {
    const { result } = renderHook(() =>
      useMatchFormHandlers({ onSubmit: mockOnSubmit })
    );

    act(() => {
      result.current.setConfirmationModalOpen(true);
    });

    expect(result.current.isConfirmationModalOpen).toBe(true);

    act(() => {
      result.current.setConfirmationModalOpen(false);
    });

    expect(result.current.isConfirmationModalOpen).toBe(false);
  });
});
