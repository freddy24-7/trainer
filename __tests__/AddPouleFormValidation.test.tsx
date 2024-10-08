import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddPouleFormValidation } from '@/components/AddPouleFormValidation';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('AddPouleFormValidation', () => {
  const mockAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show form when Add Another Poule button is clicked', () => {
    // Arrange
    render(<AddPouleFormValidation action={mockAction} />);

    // Act
    const button = screen.getByText('Add Another Poule');
    fireEvent.click(button);

    // Assert
    const formTitle = screen.getByText('Poule Management');
    expect(formTitle).toBeInTheDocument();
  });

  it('should add an opponent when Enter is pressed', () => {
    // Arrange
    render(<AddPouleFormValidation action={mockAction} />);
    fireEvent.click(screen.getByText('Add Another Poule'));

    // Act
    const input = screen.getByPlaceholderText('Enter opponent name');
    fireEvent.change(input, { target: { value: 'Opponent 1' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Assert
    const opponentListItem = screen.getByText('Opponent 1');
    expect(opponentListItem).toBeInTheDocument();
  });

  it('should call action on form submission after adding opponent', async () => {
    // Arrange
    render(<AddPouleFormValidation action={mockAction} />);

    // Act
    fireEvent.click(screen.getByText('Add Another Poule'));

    const pouleInput = screen.getByPlaceholderText('Poule Name');
    fireEvent.change(pouleInput, { target: { value: 'Poule Test' } });

    const teamInput = screen.getByPlaceholderText('Main Team Name');
    fireEvent.change(teamInput, { target: { value: 'Main Team' } });

    const opponentInput = screen.getByPlaceholderText('Enter opponent name');
    fireEvent.change(opponentInput, { target: { value: 'Opponent 1' } });
    fireEvent.keyDown(opponentInput, { key: 'Enter', code: 'Enter' });

    const submitButton = screen.getByText('Add Poule');
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled();
    });
  });
});
