import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import React from 'react';
import { toast } from 'react-toastify';

import AddTrainingForm from '@/app/trainings/AddTrainingForm';
import { Player } from '@/types/user-types';

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

const errorAddingTraining = 'Fout bij het toevoegen van training.';
const anErrorOccurred = 'Er is een fout opgetreden bij het indienen.';
const addTrainingButtonText = 'Training Toevoegen';
const addTrainingHeader = 'Nieuwe Trainingssessie Toevoegen';

jest.mock('@/components/DateSelector', () => {
  interface MockDateSelectorProps {
    matchDate: { year: number; month: number; day: number } | null;
    onDateChange: (date: { year: number; month: number; day: number }) => void;
  }

  return Object.assign(
    (props: MockDateSelectorProps) => {
      const { matchDate, onDateChange } = props;
      const formattedDate = matchDate
        ? `${matchDate.year.toString().padStart(4, '0')}-${matchDate.month
            .toString()
            .padStart(2, '0')}-${matchDate.day.toString().padStart(2, '0')}`
        : '';
      return (
        <input
          type="date"
          data-testid="date-selector"
          value={formattedDate}
          onChange={(e) => {
            const [year, month, day] = e.target.value.split('-').map(Number);
            onDateChange({ year, month, day });
          }}
        />
      );
    },
    { displayName: 'MockDateSelector' }
  );
});

const mockPlayers: Player[] = [
  { id: 1, username: 'PlayerOne', whatsappNumber: '123456789' },
  { id: 2, username: 'PlayerTwo', whatsappNumber: '123456789' },
  { id: 3, username: 'PlayerThree', whatsappNumber: '123456789' },
];

const selectDate = 'date-selector';
const date = '2024-12-25';

describe('AddTrainingForm', () => {
  const mockAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getCheckboxForPlayer = (playerName: string): HTMLInputElement => {
    const playerLabel = screen.getByText(playerName);
    if (!playerLabel.parentElement) {
      throw new Error(`No parent element found for player: ${playerName}`);
    }
    return within(playerLabel.parentElement).getByRole(
      'checkbox'
    ) as HTMLInputElement;
  };

  it('renders the form with date selector and player checkboxes', () => {
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);

    expect(screen.getByText(addTrainingHeader)).toBeInTheDocument();
    expect(screen.getByTestId(selectDate)).toBeInTheDocument();

    mockPlayers.forEach((player) => {
      const playerSpan = screen.getByText(player.username);
      const checkbox = playerSpan
        .closest('div')
        ?.querySelector('input[type="checkbox"]');

      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    expect(
      screen.getByRole('button', { name: addTrainingButtonText })
    ).toBeInTheDocument();
  });

  it('allows selecting a date', () => {
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);
    const dateInput = screen.getByTestId(selectDate) as HTMLInputElement;
    expect(dateInput.value).toBe('');

    fireEvent.change(dateInput, { target: { value: date } });

    expect(dateInput.value).toBe(date);
  });

  it('shows error toast when action returns failure', async () => {
    mockAction.mockResolvedValue({
      success: false,
      errors: ['Failed to add training'],
    });
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);

    const dateInput = screen.getByTestId(selectDate) as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: date } });
    expect(dateInput.value).toBe(date);

    const playerThreeCheckbox = getCheckboxForPlayer('PlayerThree');
    fireEvent.click(playerThreeCheckbox);
    expect(playerThreeCheckbox).toBeChecked();

    const submitButton = screen.getByRole('button', {
      name: addTrainingButtonText,
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith(errorAddingTraining);
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('shows error toast when action throws an exception', async () => {
    mockAction.mockRejectedValue(new Error('Network Error'));
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);

    const dateInput = screen.getByTestId(selectDate) as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: date } });
    expect(dateInput.value).toBe('2024-12-25');

    const playerOneCheckbox = getCheckboxForPlayer('PlayerOne');
    fireEvent.click(playerOneCheckbox);
    expect(playerOneCheckbox).toBeChecked();

    const submitButton = screen.getByRole('button', {
      name: addTrainingButtonText,
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith(anErrorOccurred);
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
