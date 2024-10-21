import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { AddPouleForm } from '@/app/poule-management/AddPouleForm';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const pouleAddition = 'Add Another Poule';
const opponentName1 = 'Opponent 1';

describe('AddPouleFormValidation', () => {
  const mockAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show form when Add Another Poule button is clicked', () => {
    render(<AddPouleForm action={mockAction} />);

    const button = screen.getByText(pouleAddition);
    fireEvent.click(button);

    const formTitle = screen.getByText('Poule Management');
    expect(formTitle).toBeInTheDocument();
  });

  it('should add an opponent when Enter is pressed', () => {
    render(<AddPouleForm action={mockAction} />);
    fireEvent.click(screen.getByText(pouleAddition));

    const input = screen.getByPlaceholderText('Enter opponent name');
    fireEvent.change(input, { target: { value: opponentName1 } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    const opponentListItem = screen.getByText('Opponent 1');
    expect(opponentListItem).toBeInTheDocument();
  });

  it('should call action on form submission after adding opponent', async () => {
    render(<AddPouleForm action={mockAction} />);

    fireEvent.click(screen.getByText(pouleAddition));

    const pouleInput = screen.getByPlaceholderText('Poule Name');
    fireEvent.change(pouleInput, { target: { value: 'Poule Test' } });

    const teamInput = screen.getByPlaceholderText('Main Team Name');
    fireEvent.change(teamInput, { target: { value: 'Main Team' } });

    const opponentInput = screen.getByPlaceholderText('Enter opponent name');
    fireEvent.change(opponentInput, { target: { value: opponentName1 } });
    fireEvent.keyDown(opponentInput, { key: 'Enter', code: 'Enter' });

    const submitButton = screen.getByText('Add Poule');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled();
    });
  });
});
