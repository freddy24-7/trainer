import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';

import '../__mocks__/mockHerouiAndButton';

import ConfirmGoalModal from '@/components/helpers/matchHelpers/ConfirmGoalModal';
import { ConfirmGoalModalProps } from '@/types/match-types';

describe('ConfirmGoalModal', () => {
  const mockOnCancel = jest.fn();
  const mockOnConfirm = jest.fn();
  const goalScorer = { id: 1, username: 'Player 1' };

  const renderComponent = (props?: Partial<ConfirmGoalModalProps>) =>
    render(
      <ConfirmGoalModal
        isOpen={true}
        goalScorer={goalScorer}
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
        {...props}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders modal with correct title', () => {
    renderComponent();
    expect(screen.getByText(/Doelpunt bevestigen/i)).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Annuleren/i));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('does not render modal when goalScorer is null', () => {
    const { container } = renderComponent({ goalScorer: null });
    expect(container.firstChild).toBeNull();
  });
});
