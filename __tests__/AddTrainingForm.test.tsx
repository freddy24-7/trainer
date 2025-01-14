import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import AddTrainingForm from '@/app/trainings/AddTrainingForm';
import {
  addTrainingButtonText,
  addTrainingHeader,
} from '@/strings/clientStrings';
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

const mockPlayers: Player[] = [
  { id: 1, username: 'PlayerOne', whatsappNumber: '123456789' },
  { id: 2, username: 'PlayerTwo', whatsappNumber: '123456789' },
  { id: 3, username: 'PlayerThree', whatsappNumber: '123456789' },
];

const mockAction = jest.fn();

describe('AddTrainingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with DatePicker and player checkboxes', () => {
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);

    expect(screen.getByText(addTrainingHeader)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: addTrainingButtonText })
    ).toBeInTheDocument();

    mockPlayers.forEach((player) => {
      const playerSpan = screen.getByText(player.username);
      const checkbox = playerSpan
        .closest('div')
        ?.querySelector('input[type="checkbox"]');

      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });
  });

  it('allows selecting a valid date with DatePicker', async () => {
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);

    const validDate = new Date();
    validDate.setDate(validDate.getDate() - 1);

    const datePickerInput = screen.getByRole('group', { name: /kies datum/i });
    expect(datePickerInput).toBeInTheDocument();

    const calendarButton = within(datePickerInput).getByRole('button', {
      name: /calendar/i,
    });
    await userEvent.click(calendarButton);

    const dateToSelect = validDate.getDate().toString();
    const dateElement = screen.getByText(dateToSelect);

    expect(dateElement).toBeInTheDocument();
    await userEvent.click(dateElement);

    const formattedDate = `${String(validDate.getMonth() + 1).padStart(2, '0')}/${String(validDate.getDate()).padStart(2, '0')}/${validDate.getFullYear()}`;

    expect(datePickerInput).toHaveTextContent(formattedDate);
  });
});
