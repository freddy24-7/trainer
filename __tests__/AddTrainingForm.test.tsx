jest.spyOn(console, 'warn').mockImplementation(() => {});
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import AddTrainingForm from '@/app/trainings/AddTrainingForm';
import {
  addTrainingButtonText,
  addTrainingHeader,
  trainingDateLabel,
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

  it('allows selecting a valid date', async () => {
    render(<AddTrainingForm action={mockAction} players={mockPlayers} />);
    const dateGroup = screen.getByRole('group', {
      name: new RegExp(trainingDateLabel, 'i'),
    });
    const spinbuttons = within(dateGroup).getAllByRole('spinbutton');
    expect(spinbuttons).toHaveLength(3);

    await userEvent.clear(spinbuttons[0]);
    await userEvent.type(spinbuttons[0], '06');
    await userEvent.clear(spinbuttons[1]);
    await userEvent.type(spinbuttons[1], '01');
    await userEvent.clear(spinbuttons[2]);
    await userEvent.type(spinbuttons[2], '2023');

    expect(spinbuttons[0]).toHaveTextContent('06');
    expect(spinbuttons[1]).toHaveTextContent('01');
    expect(spinbuttons[2]).toHaveTextContent('2023');
  });
});
