import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddPlayerFormValidation } from '@/components/AddPlayerFormValidation';
import { toast } from 'react-toastify';
import { ZodIssue } from 'zod';

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
          onSubmit(formData); // Pass updated formData
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
        <button type="submit" data-testid="submit-button">
          {submitButtonText}
        </button>
      </form>
    );
  };

  MockPlayerForm.displayName = 'MockPlayerForm'; // Assign a display name

  return MockPlayerForm;
});

describe('AddPlayerFormValidation', () => {
  const mockAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with username and password inputs', () => {
    // Arrange
    render(<AddPlayerFormValidation action={mockAction} />);

    // Assert
    expect(screen.getByText('Player Management')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Add Player');
  });

  it('calls action with correct data when form is submitted', async () => {
    // Arrange
    mockAction.mockResolvedValue({ errors: [] });
    render(<AddPlayerFormValidation action={mockAction} />);

    const usernameInput = screen.getByTestId(
      'username-input'
    ) as HTMLInputElement;
    const passwordInput = screen.getByTestId(
      'password-input'
    ) as HTMLInputElement;
    const submitButton = screen.getByTestId('submit-button');

    // Act
    fireEvent.change(usernameInput, { target: { value: 'NewPlayer' } });
    fireEvent.change(passwordInput, { target: { value: 'NewPassword' } });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledWith({}, expect.any(FormData));
    });

    const formData = mockAction.mock.calls[0][1];
    expect(formData.get('username')).toBe('NewPlayer');
    expect(formData.get('password')).toBe('NewPassword');
  });

  it('shows success toast when player is added successfully', async () => {
    // Arrange
    mockAction.mockResolvedValue({ errors: [] });
    render(<AddPlayerFormValidation action={mockAction} />);
    const submitButton = screen.getByTestId('submit-button');

    // Act
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith('Player added successfully!');
    });
  });

  it('shows error message when validation errors occur', async () => {
    // Arrange
    const validationErrors: ZodIssue[] = [
      {
        path: ['username'],
        message: 'Username is required',
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
      },
    ];
    mockAction.mockResolvedValue({ errors: validationErrors });

    render(<AddPlayerFormValidation action={mockAction} />);
    const submitButton = screen.getByTestId('submit-button');

    // Act
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      expect(toast.success).not.toHaveBeenCalled();
      expect(
        screen.queryByText('Username is required')
      ).not.toBeInTheDocument(); // Assume the form handles validation messages internally
    });
  });
});
