import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { Player } from '@/types/user-types';

import AddTrainingForm from '../src/app/trainings/AddTrainingForm';

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

const addTrainingButtonText = 'Training Toevoegen';
const addTrainingHeader = 'Nieuwe Trainingssessie Toevoegen';

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

  it('allows selecting a date with DatePicker', async () => {
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);

    const calendarButton = screen.getByRole('button', {
      name: 'Calendar Selecteer Wedstrijddatum',
    });
    fireEvent.click(calendarButton);

    const calendarDate = screen.getByLabelText('Wednesday, December 25, 2024');
    fireEvent.click(calendarDate);

    const dateDescription = document.getElementById('react-aria-description-0');
    await waitFor(() => {
      expect(dateDescription).toHaveTextContent(
        'Selected Date: December 25, 2024'
      );
    });
  });
});
