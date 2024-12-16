import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { AddPouleForm } from '@/app/poule-management/AddPouleForm';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const pouleManagementHeading = 'Poulebewerking';
const addPouleButtonText = 'Poule Toevoegen';
const cancelText = 'Annuleren';
const opponentName1 = 'Tegenstander 1';

describe('AddPouleFormValidation', () => {
  const mockAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show form when Add Poule button is clicked and hide it when Cancel is clicked', () => {
    render(<AddPouleForm action={mockAction} />);

    const addButton = screen.getByText(addPouleButtonText);
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);

    const formTitle = screen.getByText(pouleManagementHeading);
    expect(formTitle).toBeInTheDocument();
    const cancelButton = screen.getByText(cancelText);
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton);
    expect(screen.queryByText(pouleManagementHeading)).not.toBeInTheDocument();
  });

  it('should add an opponent when Enter is pressed', () => {
    render(<AddPouleForm action={mockAction} />);
    fireEvent.click(screen.getByText(addPouleButtonText));

    const input = screen.getByPlaceholderText('Enter opponent name');
    fireEvent.change(input, { target: { value: opponentName1 } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    const opponentListItem = screen.getByText(opponentName1);
    expect(opponentListItem).toBeInTheDocument();
  });

  it('should call action on form submission after adding opponent', async () => {
    render(<AddPouleForm action={mockAction} />);

    fireEvent.click(screen.getByText(addPouleButtonText));

    const pouleInput = screen.getByPlaceholderText('Poule Name');
    fireEvent.change(pouleInput, { target: { value: 'Poule Test' } });

    const teamInput = screen.getByPlaceholderText('Main Team Name');
    fireEvent.change(teamInput, { target: { value: 'Main Team' } });

    const opponentInput = screen.getByPlaceholderText('Enter opponent name');
    fireEvent.change(opponentInput, { target: { value: opponentName1 } });
    fireEvent.keyDown(opponentInput, { key: 'Enter', code: 'Enter' });

    const submitButton = screen.getByText(addPouleButtonText);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled();
    });
  });
});
