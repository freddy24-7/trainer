import editPlayer from '@/app/actions/editPlayer';
import prisma from '@/lib/prisma';
import { users } from '@clerk/clerk-sdk-node';
import { editPlayerSchema } from '@/schemas/editPlayerSchema';

jest.mock('@/lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('@clerk/clerk-sdk-node', () => ({
  users: {
    updateUser: jest.fn(),
  },
}));

jest.mock('@/schemas/editPlayerSchema', () => ({
  editPlayerSchema: {
    safeParse: jest.fn(),
  },
}));

interface Player {
  id: number;
  clerkId: string;
  username: string | null;
}

describe('editPlayer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const createFormData = (username: string, whatsappNumber?: string) => {
    const formData = new FormData();
    formData.append('username', username);
    if (whatsappNumber) {
      formData.append('whatsappNumber', whatsappNumber);
    }
    return formData;
  };

  const mockPlayerData = (player: Player | null) => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(player);
  };

  it('should return an error if username or WhatsApp number is missing', async () => {
    // Arrange
    const formData = createFormData('player1');

    // Act
    const result = await editPlayer(1, formData);

    // Assert
    expect(result).toEqual({
      errors: [
        {
          message: 'Username and WhatsApp number are required.',
          path: ['form'],
          code: 'custom',
        },
      ],
    });
  });

  it('should return an error if the player is not found or has invalid data', async () => {
    // Arrange
    mockPlayerData(null);
    const formData = createFormData('player1', '123456789');

    // Act
    const result = await editPlayer(1, formData);

    // Assert
    expect(result).toEqual({
      errors: [
        {
          message: 'Player not found, Clerk ID missing, or username is null.',
          path: ['form'],
          code: 'custom',
        },
      ],
    });
  });

  it('should return validation errors if the schema validation fails', async () => {
    // Arrange
    mockPlayerData({ id: 1, clerkId: 'clerkId123', username: 'player1' });
    const formData = createFormData('invalidPlayer', 'invalidNumber');

    const mockValidationError = {
      success: false,
      error: {
        issues: [
          {
            message: 'Invalid username',
            path: ['username'],
            code: 'invalid_type',
          },
        ],
      },
    };
    (editPlayerSchema.safeParse as jest.Mock).mockReturnValue(
      mockValidationError
    );

    // Act
    const result = await editPlayer(1, formData);

    // Assert
    expect(result).toEqual({
      errors: mockValidationError.error.issues,
    });
  });

  it('should update the player successfully if all validation passes', async () => {
    // Arrange
    mockPlayerData({ id: 1, clerkId: 'clerkId123', username: 'player1' });
    const formData = createFormData('validPlayer', '123456789');

    const mockValidationSuccess = {
      success: true,
      data: {
        username: 'validPlayer',
        whatsappNumber: '123456789',
      },
    };
    (editPlayerSchema.safeParse as jest.Mock).mockReturnValue(
      mockValidationSuccess
    );

    // Act
    const result = await editPlayer(1, formData);

    // Assert
    expect(users.updateUser).toHaveBeenCalledWith('clerkId123', {
      username: 'validPlayer',
      password: undefined,
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        username: 'validPlayer',
        whatsappNumber: '123456789',
      },
    });

    expect(result).toEqual({
      errors: [],
      success: true,
    });
  });

  it('should handle errors during the update process', async () => {
    // Arrange
    mockPlayerData({ id: 1, clerkId: 'clerkId123', username: 'player1' });
    const formData = createFormData('validPlayer', '123456789');

    const mockValidationSuccess = {
      success: true,
      data: {
        username: 'validPlayer',
        whatsappNumber: '123456789',
      },
    };
    (editPlayerSchema.safeParse as jest.Mock).mockReturnValue(
      mockValidationSuccess
    );

    (users.updateUser as jest.Mock).mockRejectedValue(
      new Error('User update failed')
    );

    // Act
    const result = await editPlayer(1, formData);

    // Assert
    expect(result).toEqual({
      errors: [
        {
          message: 'Error updating the player.',
          path: ['form'],
          code: 'custom',
        },
      ],
    });
  });
});
