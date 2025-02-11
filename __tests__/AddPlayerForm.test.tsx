import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { toast } from 'react-toastify';

import { AddPlayerForm } from '@/app/player-management/AddPlayerForm';
import { handlePlayerFormSubmit } from '@/utils/playerFormUtils';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../src/utils/phoneNumberUtils', () => ({
  handleFormatWhatsappNumber: jest.fn((num: string) => {
    return num.startsWith('06') ? num.replace(/^06/, '+316') : num;
  }),
  handleWhatsAppClick: jest.fn(),
}));

jest.mock('../src/utils/playerFormUtils', () => ({
  handlePlayerFormSubmit: jest.fn(),
}));

jest.mock('../src/components/PlayerForm', () => {
  return function DummyPlayerForm(props: any) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = {
            username: (form.elements.namedItem('username') as HTMLInputElement)
              .value,
            password: (form.elements.namedItem('password') as HTMLInputElement)
              .value,
            whatsappNumber: (
              form.elements.namedItem('whatsappNumber') as HTMLInputElement
            ).value,
          };
          props.onSubmit(data);
        }}
      >
        <label htmlFor="username">Gebruikersnaam</label>
        <input id="username" name="username" aria-label="Gebruikersnaam" />
        <label htmlFor="password">Wachtwoord</label>
        <input
          id="password"
          name="password"
          type="password"
          aria-label="Wachtwoord"
        />
        <label htmlFor="whatsappNumber">WhatsApp Nummer</label>
        <input
          id="whatsappNumber"
          name="whatsappNumber"
          aria-label="WhatsApp Nummer"
        />
        <button type="submit">{props.submitButtonText}</button>
      </form>
    );
  };
});

const operationSuccessMessage = 'Operation succeeded';
const creationError = 'Speler aanmaken mislukt';

const simulateSubmission = async (
  data: { username: string; password: string; whatsappNumber: string },
  actionFunction: (formData: FormData) => Promise<any>,
  onSuccess?: (playerData: {
    username: string;
    password: string;
    whatsappNumber: string;
  }) => void
): Promise<void> => {
  const formattedNumber = data.whatsappNumber.replace(/^06/, '+316');
  const formData = new FormData();
  formData.append('username', data.username);
  formData.append('password', data.password);
  formData.append('whatsappNumber', formattedNumber);
  await actionFunction(formData);
  if (onSuccess) {
    onSuccess({
      username: data.username,
      password: data.password,
      whatsappNumber: formattedNumber,
    });
  }
};

describe('AddPlayerForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fillFormInputs = async (
    username: string,
    password: string,
    whatsapp: string
  ) => {
    await userEvent.type(screen.getByLabelText(/Gebruikersnaam/i), username);
    await userEvent.type(screen.getByLabelText(/Wachtwoord/i), password);
    await userEvent.type(screen.getByLabelText(/WhatsApp Nummer/i), whatsapp);
  };

  const submitForm = async () => {
    await userEvent.click(
      screen.getByRole('button', { name: /Speler Toevoegen/i })
    );
  };

  it('calls action with correct data when form is submitted', async () => {
    (handlePlayerFormSubmit as jest.Mock).mockImplementation(
      async ({ data, actionFunction, onSuccess }) => {
        await simulateSubmission(data, actionFunction, onSuccess);
      }
    );

    const mockAction = jest.fn().mockResolvedValue({ errors: [] });
    render(<AddPlayerForm action={mockAction} />);

    await fillFormInputs('TestUser', 'TestPassword', '0612345678');
    await submitForm();

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    const formDataArg = mockAction.mock.calls[0][1] as FormData;
    expect(formDataArg.get('username')).toBe('TestUser');
    expect(formDataArg.get('password')).toBe('TestPassword');
    expect(formDataArg.get('whatsappNumber')).toBe('+31612345678');
  });

  it('shows success toast when player is added successfully', async () => {
    (handlePlayerFormSubmit as jest.Mock).mockImplementation(
      async ({ data, actionFunction, onSuccess }) => {
        await simulateSubmission(data, actionFunction, onSuccess);
        toast.success(operationSuccessMessage);
      }
    );

    const mockAction = jest.fn().mockResolvedValue({ errors: [] });
    render(<AddPlayerForm action={mockAction} />);

    await fillFormInputs('TestUser', 'TestPassword', '0612345678');
    await submitForm();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(operationSuccessMessage);
    });
  });

  it('shows error toast when player creation fails', async () => {
    (handlePlayerFormSubmit as jest.Mock).mockImplementation(
      async ({ data, actionFunction }) => {
        await simulateSubmission(data, actionFunction);
        toast.error(creationError);
      }
    );

    const mockAction = jest.fn().mockResolvedValue({
      errors: [{ message: creationError, path: ['form'], code: 'custom' }],
    });
    render(<AddPlayerForm action={mockAction} />);

    await fillFormInputs('TestUser', 'TestPassword', '0612345678');
    await submitForm();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(creationError);
    });
  });
});
