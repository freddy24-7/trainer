jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';

import '../__mocks__/mockHerouiAndButton';

import { ConfirmAssistModalProps } from '@/types/match-types';

import ConfirmAssistModal from '../src/components/helpers/matchHelpers/ConfirmAssistModal';

describe('ConfirmAssistModal', () => {
  const mockOnCancel = jest.fn();
  const mockOnConfirm = jest.fn();
  const assistProvider = { id: 2, username: 'Player 2' };

  const renderComponent = (props?: Partial<ConfirmAssistModalProps>) =>
    render(
      <ConfirmAssistModal
        isOpen={true}
        assistProvider={assistProvider}
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
        {...props}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('calls onCancel when cancel button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Nee/i));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Ja/i));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('does not render modal when assistProvider is null', () => {
    const { container } = renderComponent({ assistProvider: null });
    expect(container.firstChild).toBeNull();
  });
});
