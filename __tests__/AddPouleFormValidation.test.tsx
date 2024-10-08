import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { AddPouleFormValidation } from '@/components/poules/AddPouleFormValidation';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('AddPouleFormValidation', () => {
  const mockAction = jest.fn();

  const addAnotherPouleButtonText = 'Add Another Poule';
  const pouleManagementText = 'Poule Management';
  const enterOpponentPlaceholder = 'Enter opponent name';
  const pouleNamePlaceholder = 'Poule Name';
  const mainTeamNamePlaceholder = 'Main Team Name';
  const opponentName = 'Opponent 1';
  const addPouleButtonText = 'Add Poule';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show form when Add Another Poule button is clicked', () => {
    render(<AddPouleFormValidation action={mockAction} />);

    const button = screen.getByText(addAnotherPouleButtonText);
    fireEvent.click(button);

    const formTitle = screen.getByText(pouleManagementText);
    expect(formTitle).toBeInTheDocument();
  });

  it('should add an opponent when Enter is pressed', () => {
    render(<AddPouleFormValidation action={mockAction} />);
    fireEvent.click(screen.getByText(addAnotherPouleButtonText));

    const input = screen.getByPlaceholderText(enterOpponentPlaceholder);
    fireEvent.change(input, { target: { value: opponentName } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    const opponentListItem = screen.getByText(opponentName);
    expect(opponentListItem).toBeInTheDocument();
  });

  it('should call action on form submission after adding opponent', async () => {
    render(<AddPouleFormValidation action={mockAction} />);

    fireEvent.click(screen.getByText(addAnotherPouleButtonText));

    const pouleInput = screen.getByPlaceholderText(pouleNamePlaceholder);
    fireEvent.change(pouleInput, { target: { value: 'Poule Test' } });

    const teamInput = screen.getByPlaceholderText(mainTeamNamePlaceholder);
    fireEvent.change(teamInput, { target: { value: 'Main Team' } });

    const opponentInput = screen.getByPlaceholderText(enterOpponentPlaceholder);
    fireEvent.change(opponentInput, { target: { value: opponentName } });
    fireEvent.keyDown(opponentInput, { key: 'Enter', code: 'Enter' });

    const submitButton = screen.getByText(addPouleButtonText);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled();
    });
  });
});
