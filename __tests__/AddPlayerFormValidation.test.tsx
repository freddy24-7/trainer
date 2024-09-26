import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddPlayerFormValidation } from '@/components/AddPlayerFormValidation';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/components/PlayerForm', () => {
  const MockPlayerForm = (props: any) => {
    const { initialData, onSubmit, submitButtonText } = props;
    const [formData, setFormData] = React.useState(initialData);

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
      >
        <input
          type="text"
          data-testid="username-input"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <input
          type="password"
          data-testid="password-input"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <input
          type="tel"
          data-testid="whatsapp-input"
          value={formData.whatsappNumber}
          onChange={(e) =>
            setFormData({ ...formData, whatsappNumber: e.target.value })
          }
        />
        <button type="submit" data-testid="submit-button">
          {submitButtonText}
        </button>
      </form>
    );
  };

  MockPlayerForm.displayName = 'MockPlayerForm';
  return MockPlayerForm;
});

describe('AddPlayerFormValidation', () => {
  const mockAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fillFormInputs = (
    username: string,
    password: string,
    whatsapp: string
  ) => {
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: username },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: password },
    });
    fireEvent.change(screen.getByTestId('whatsapp-input'), {
      target: { value: whatsapp },
    });
  };

  const submitForm = () => {
    fireEvent.click(screen.getByTestId('submit-button'));
  };

  it('renders the form with username, password, and WhatsApp inputs', () => {
    render(<AddPlayerFormValidation action={mockAction} />);

    expect(screen.getByText('Player Management')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('whatsapp-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Add Player');
  });

  it('calls action with correct data when form is submitted', async () => {
    mockAction.mockResolvedValue({ errors: [] });
    render(<AddPlayerFormValidation action={mockAction} />);

    // Arrange
    fillFormInputs('NewPlayer', 'NewPassword', '0612345678');

    // Act
    submitForm();

    // Assert
    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledWith({}, expect.any(FormData));
    });

    const formData = mockAction.mock.calls[0][1];
    expect(formData.get('username')).toBe('NewPlayer');
    expect(formData.get('password')).toBe('NewPassword');
    expect(formData.get('whatsappNumber')).toBe('+31612345678');
  });

  it('shows success toast when player is added successfully', async () => {
    mockAction.mockResolvedValue({ errors: [] });
    render(<AddPlayerFormValidation action={mockAction} />);

    // Arrange
    fillFormInputs('NewPlayer', 'NewPassword', '0612345678');

    // Act
    submitForm();

    // Assert
    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith('Player added successfully!');
    });
  });

  it('should format and display the WhatsApp link when valid data is submitted', async () => {
    mockAction.mockResolvedValue({ errors: [] });
    render(<AddPlayerFormValidation action={mockAction} />);

    // Arrange
    fillFormInputs('NewPlayer', 'NewPassword', '0612345678');

    // Act
    submitForm();

    // Assert
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
});
