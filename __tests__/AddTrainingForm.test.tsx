import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import AddTrainingForm from '@/components/AddTrainingForm';
import { toast } from 'react-toastify';
import { Player } from '@/types/type-list';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/components/DateSelector', () => {
  const MockDateSelector = (props: any) => {
    const { matchDate, onDateChange } = props;
    return (
      <input
        type="date"
        data-testid="date-selector"
        value={
          matchDate
            ? `${matchDate.year.toString().padStart(4, '0')}-${matchDate.month
                .toString()
                .padStart(2, '0')}-${matchDate.day.toString().padStart(2, '0')}`
            : ''
        }
        onChange={(e) => {
          const [year, month, day] = e.target.value.split('-').map(Number);
          onDateChange({ year, month, day });
        }}
      />
    );
  };

  MockDateSelector.displayName = 'MockDateSelector';

  return MockDateSelector;
});

const mockPlayers: Player[] = [
  { id: 1, username: 'PlayerOne', whatsappNumber: '123456789' },
  { id: 2, username: 'PlayerTwo', whatsappNumber: '123456789' },
  { id: 3, username: 'PlayerThree', whatsappNumber: '123456789' },
];

describe('AddTrainingForm', () => {
  const mockAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getCheckboxForPlayer = (playerName: string) => {
    const playerLabel = screen.getByText(playerName);
    if (!playerLabel.parentElement) {
      throw new Error(`No parent element found for player: ${playerName}`);
    }
    return within(playerLabel.parentElement).getByRole('checkbox');
  };

  it('renders the form with date selector and player checkboxes', () => {
    // Arrange
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);

    // Assert
    expect(screen.getByText('Add a New Training Session')).toBeInTheDocument();
    expect(screen.getByTestId('date-selector')).toBeInTheDocument();
    expect(screen.getByText('Absent Players')).toBeInTheDocument();

    mockPlayers.forEach((player) => {
      const checkbox = getCheckboxForPlayer(
        player.username
      ) as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    expect(
      screen.getByRole('button', { name: /Add Training/i })
    ).toBeInTheDocument();
  });

  it("toggles a player's absence when checkbox is clicked", () => {
    // Arrange
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);
    const playerCheckbox = getCheckboxForPlayer(
      'PlayerOne'
    ) as HTMLInputElement;
    expect(playerCheckbox).not.toBeChecked();

    // Act
    fireEvent.click(playerCheckbox);

    // Assert
    expect(playerCheckbox).toBeChecked();

    // Act
    fireEvent.click(playerCheckbox);

    // Assert
    expect(playerCheckbox).not.toBeChecked();
  });

  it('allows selecting a date', () => {
    // Arrange
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);
    const dateInput = screen.getByTestId('date-selector') as HTMLInputElement;
    expect(dateInput.value).toBe('');

    // Act
    fireEvent.change(dateInput, { target: { value: '2024-12-25' } });

    // Assert
    expect(dateInput.value).toBe('2024-12-25');
  });

  it('shows error toast when action returns failure', async () => {
    // Arrange
    mockAction.mockResolvedValue({
      success: false,
      errors: ['Failed to add training'],
    });
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);

    const dateInput = screen.getByTestId('date-selector') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2024-12-25' } });
    expect(dateInput.value).toBe('2024-12-25');

    const playerThreeCheckbox = getCheckboxForPlayer(
      'PlayerThree'
    ) as HTMLInputElement;
    fireEvent.click(playerThreeCheckbox);
    expect(playerThreeCheckbox).toBeChecked();

    const submitButton = screen.getByRole('button', { name: /Add Training/i });

    // Act
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith('Error adding training.');
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('shows error toast when action throws an exception', async () => {
    // Arrange
    mockAction.mockRejectedValue(new Error('Network Error'));
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);

    const dateInput = screen.getByTestId('date-selector') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2024-12-25' } });
    expect(dateInput.value).toBe('2024-12-25');

    const playerOneCheckbox = getCheckboxForPlayer(
      'PlayerOne'
    ) as HTMLInputElement;
    fireEvent.click(playerOneCheckbox);
    expect(playerOneCheckbox).toBeChecked();

    const submitButton = screen.getByRole('button', { name: /Add Training/i });

    // Act
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith(
        'An error occurred during submission.'
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
