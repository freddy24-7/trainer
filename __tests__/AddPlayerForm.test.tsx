import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddPlayerForm } from '@/app/player-management/AddPlayerForm';
import { toast } from 'react-toastify';
import { handlePlayerFormSubmit } from '@/utils/playerFormUtils';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/utils/phoneNumberUtils', () => ({
  formatWhatsappNumberToDisplay: jest.fn((number: string) => number),
}));

jest.mock('@/utils/playerFormUtils', () => ({
  handlePlayerFormSubmit: jest.fn(),
}));

describe('AddPlayerForm', () => {
  const mockAction = jest.fn();

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation((message: string) => {
      if (message.includes('punycode')) {
        return;
      }
      console.warn(message);
    });
  });

  afterAll(() => {
    (console.log as jest.Mock).mockRestore();
    (console.warn as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHandlePlayerFormSubmit = ({
    onSuccessResponse,
    onErrorResponse,
    toastSuccessMessage,
  }: {
    onSuccessResponse?: {
      username: string;
      password: string;
      whatsappNumber: string;
    };
    onErrorResponse?: { errors: { message: string }[] };
    toastSuccessMessage?: string;
    toastErrorMessage?: string;
  } = {}) => {
    (handlePlayerFormSubmit as jest.Mock).mockImplementation(
      async ({
        data,
        actionFunction,
        onSuccess,
        setIsSubmitting,
      }: {
        data: { username: string; password: string; whatsappNumber: string };
        actionFunction: (formData: FormData) => Promise<any>;
        onSuccess?: (response: {
          username: string;
          password: string;
          whatsappNumber: string;
        }) => void;
        setIsSubmitting?: (isSubmitting: boolean) => void;
      }) => {
        if (setIsSubmitting) setIsSubmitting(true);

        const formattedNumber = data.whatsappNumber.replace(/^06/, '+316');
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('password', data.password);
        formData.append('whatsappNumber', formattedNumber);

        if (onErrorResponse) {
          const response = await actionFunction(formData);
          if (response.errors.length > 0) {
            toast.error(response.errors[0].message);
          }
        } else {
          await actionFunction(formData);
          if (onSuccess && onSuccessResponse) {
            onSuccess(onSuccessResponse);
          }
          if (toastSuccessMessage) {
            toast.success(toastSuccessMessage);
          }
        }

        if (setIsSubmitting) setIsSubmitting(false);
      }
    );
  };

  const setupMockHandlePlayerFormSubmit = ({
    onSuccessResponse = {
      username: 'NewPlayer',
      password: 'NewPassword',
      whatsappNumber: '+31612345678',
    },
    onErrorResponse,
    toastSuccessMessage,
    toastErrorMessage,
  }: {
    onSuccessResponse?: {
      username: string;
      password: string;
      whatsappNumber: string;
    };
    onErrorResponse?: { errors: { message: string }[] };
    toastSuccessMessage?: string;
    toastErrorMessage?: string;
  } = {}) => {
    mockHandlePlayerFormSubmit({
      onSuccessResponse,
      onErrorResponse,
      toastSuccessMessage,
      toastErrorMessage,
    });
  };

  const fillFormInputs = async (
    username: string,
    password: string,
    whatsapp: string
  ) => {
    await userEvent.type(screen.getByLabelText('Username'), username);
    await userEvent.type(screen.getByLabelText('Password'), password);
    await userEvent.type(screen.getByLabelText('WhatsApp Number'), whatsapp);
  };

  const submitForm = async () => {
    await userEvent.click(screen.getByText('Add Player'));
  };

  it('renders the form with username, password, and WhatsApp inputs', () => {
    render(<AddPlayerForm action={mockAction} />);

    expect(screen.getByText('Player Management')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('WhatsApp Number')).toBeInTheDocument();
    expect(screen.getByText('Add Player')).toBeInTheDocument();
  });

  it('calls action with correct data when form is submitted', async () => {
    setupMockHandlePlayerFormSubmit();

    mockAction.mockResolvedValue({ errors: [] });

    render(<AddPlayerForm action={mockAction} />);

    await fillFormInputs('NewPlayer', 'NewPassword', '0612345678');

    await submitForm();

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    const formData = mockAction.mock.calls[0][1] as FormData;
    expect(formData.get('username')).toBe('NewPlayer');
    expect(formData.get('password')).toBe('NewPassword');
    expect(formData.get('whatsappNumber')).toBe('+31612345678');
  });

  it('shows success toast when player is added successfully', async () => {
    setupMockHandlePlayerFormSubmit({
      toastSuccessMessage: 'Operation successful!',
    });

    mockAction.mockResolvedValue({ errors: [] });

    render(<AddPlayerForm action={mockAction} />);

    await fillFormInputs('NewPlayer', 'NewPassword', '0612345678');

    await submitForm();

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith('Operation successful!');
    });
  });

  it('should display WhatsApp link when valid data is submitted', async () => {
    setupMockHandlePlayerFormSubmit();

    mockAction.mockResolvedValue({ errors: [] });

    render(<AddPlayerForm action={mockAction} />);

    await fillFormInputs('NewPlayer', 'NewPassword', '0612345678');

    await submitForm();

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    const whatsappLink = screen.getByRole('link', {
      name: 'Send WhatsApp Message to Player',
    });
    expect(whatsappLink).toBeInTheDocument();

    const formattedNumber = '31612345678';
    const message = `Hello NewPlayer, your account has been created. Username: NewPlayer, Password: NewPassword. Please log in and change your password to your own.`;
    const encodedMessage = encodeURIComponent(message);
    const expectedHref = `https://wa.me/${formattedNumber}/?text=${encodedMessage}`;

    expect(whatsappLink).toHaveAttribute('href', expectedHref);
  });

  it('shows error toast when player creation fails', async () => {
    setupMockHandlePlayerFormSubmit({
      onErrorResponse: { errors: [{ message: 'Player creation failed' }] },
      toastErrorMessage: 'Player creation failed',
    });

    mockAction.mockResolvedValueOnce({
      errors: [{ message: 'Player creation failed' }],
    });

    render(<AddPlayerForm action={mockAction} />);

    await fillFormInputs('NewPlayer', 'NewPassword', '0612345678');

    await submitForm();

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith('Player creation failed');
    });
  });
});
