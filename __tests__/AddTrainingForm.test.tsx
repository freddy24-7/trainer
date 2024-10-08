import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import React from 'react';
import { toast } from 'react-toastify';

import AddTrainingForm from '@/components/trainings/AddTrainingForm';
import { Player } from '@/types/types';

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

interface DateSelectorProps {
  matchDate: { year: number; month: number; day: number } | null;
  onDateChange: (date: { year: number; month: number; day: number }) => void;
}

jest.mock('@/components/DateSelector', () => {
  const MockDateSelector = (props: DateSelectorProps): React.ReactElement => {
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

  Object.defineProperty(MockDateSelector, 'displayName', {
    value: 'MockDateSelector',
    writable: false,
  });

  return MockDateSelector;
});

const mockPlayers: Player[] = [
  { id: 1, username: 'PlayerOne', whatsappNumber: '123456789' },
  { id: 2, username: 'PlayerTwo', whatsappNumber: '123456789' },
  { id: 3, username: 'PlayerThree', whatsappNumber: '123456789' },
];

describe('AddTrainingForm', () => {
  const mockAction = jest.fn();
  const mockDate = '2024-12-25';

  const dateSelectorTestId = 'date-selector';

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  const playerOne = 'PlayerOne';
  const playerThree = 'PlayerThree';

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

    expect(screen.getByText('Add a New Training Session')).toBeInTheDocument();
    expect(screen.getByTestId(dateSelectorTestId)).toBeInTheDocument();
    expect(screen.getByText('Absent Players')).toBeInTheDocument();

    mockPlayers.forEach((player) => {
      const checkbox = getCheckboxForPlayer(player.username);
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    expect(
      screen.getByRole('button', { name: /Add Training/i })
    ).toBeInTheDocument();
  });

  it("toggles a player's absence when checkbox is clicked", () => {
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);
    const playerCheckbox = getCheckboxForPlayer(playerOne);
    expect(playerCheckbox).not.toBeChecked();

    fireEvent.click(playerCheckbox);
    expect(playerCheckbox).toBeChecked();

    fireEvent.click(playerCheckbox);
    expect(playerCheckbox).not.toBeChecked();
  });

  it('allows selecting a date', () => {
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);
    const dateInput = screen.getByTestId(
      dateSelectorTestId
    ) as HTMLInputElement;
    expect(dateInput.value).toBe('');

    fireEvent.change(dateInput, { target: { value: mockDate } });
    expect(dateInput.value).toBe(mockDate);
  });

  it('shows error toast when action returns failure', async () => {
    mockAction.mockResolvedValue({
      success: false,
      errors: ['Failed to add training'],
    });
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);

    const dateInput = screen.getByTestId(
      dateSelectorTestId
    ) as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: mockDate } });
    expect(dateInput.value).toBe(mockDate);

    const playerThreeCheckbox = getCheckboxForPlayer(playerThree);
    fireEvent.click(playerThreeCheckbox);
    expect(playerThreeCheckbox).toBeChecked();

    const submitButton = screen.getByRole('button', { name: /Add Training/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith('Error adding training.');
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('shows error toast when action throws an exception', async () => {
    mockAction.mockRejectedValue(new Error('Network Error'));
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);

    const dateInput = screen.getByTestId(
      dateSelectorTestId
    ) as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: mockDate } });
    expect(dateInput.value).toBe(mockDate);

    const playerOneCheckbox = getCheckboxForPlayer(playerOne);
    fireEvent.click(playerOneCheckbox);
    expect(playerOneCheckbox).toBeChecked();

    const submitButton = screen.getByRole('button', { name: /Add Training/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith(
        'An error occurred during submission.'
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
