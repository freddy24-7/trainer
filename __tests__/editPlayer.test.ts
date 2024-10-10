import editPlayer from '@/app/actions/editPlayer';
import { handleRevalidatePlayerManagementCache } from '@/lib/cache/revalidation';
import { updateClerkUser } from '@/lib/services/clerkEditPlayerService';
import {
  fetchPlayer,
  updateDatabaseUser,
} from '@/lib/services/prismaEditPlayerService';
import { editPlayerSchema } from '@/schemas/editPlayerSchema';
import { handleValidateParams } from '@/schemas/validation/playerEditValidation';

jest.mock('@/schemas/validation/playerEditValidation', () => ({
  handleValidateParams: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('@clerk/clerk-sdk-node', () => ({
  users: {
    updateUser: jest.fn(),
  },
}));

jest.mock('@/schemas/editPlayerSchema', () => ({
  __esModule: true,
  editPlayerSchema: {
    safeParse: jest.fn(),
  },
}));

jest.mock('@/lib/services/prismaEditPlayerService', () => ({
  fetchPlayer: jest.fn(),
  updateDatabaseUser: jest.fn(),
}));

jest.mock('@/lib/services/clerkEditPlayerService', () => ({
  updateClerkUser: jest.fn(),
}));

jest.mock('@/lib/cache/revalidation', () => ({
  __esModule: true,
  handleRevalidatePlayerManagementCache: jest.fn(),
}));

describe('editPlayer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const createFormData = (
    username: string,
    whatsappNumber?: string
  ): FormData => {
    const formData = new FormData();
    formData.append('username', username);
    if (whatsappNumber) {
      formData.append('whatsappNumber', whatsappNumber);
    }
    return formData;
  };

  const mockPlayerData = (player: unknown | null): void => {
    (fetchPlayer as jest.Mock).mockResolvedValue({ player, errors: [] });
  };

  it('should return an error if username or WhatsApp number is missing', async () => {
    (handleValidateParams as jest.Mock).mockReturnValue({
      errors: [
        {
          message: 'Username and WhatsApp number are required.',
          path: ['form'],
          code: 'custom',
        },
      ],
    });

    const formData = createFormData('player1');

    const result = await editPlayer(1, formData);

    expect(result).toEqual({
      errors: [
        {
          message: 'Validation error.',
          path: ['form'],
          code: 'custom',
        },
      ],
    });
  });

  it('should return an error if the player is not found or has invalid data', async () => {
    (handleValidateParams as jest.Mock).mockReturnValue({
      errors: [],
      data: {
        username: 'player1',
        whatsappNumber: '123456789',
      },
    });

    (fetchPlayer as jest.Mock).mockResolvedValue({
      errors: [
        {
          message:
            'Player not found, Clerk ID, username, or WhatsApp number is missing.',
          path: ['form'],
          code: 'custom',
        },
      ],
    });

    const formData = createFormData('player1', '123456789');

    const result = await editPlayer(1, formData);

    expect(result).toEqual({
      errors: [
        {
          message:
            'Player not found, Clerk ID, username, or WhatsApp number is missing.',
          path: ['form'],
          code: 'custom',
        },
      ],
    });
  });

  it('should return validation errors if the schema validation fails', async () => {
    const mockValidationErrorIssues = [
      {
        message: 'Invalid username',
        path: ['username'],
        code: 'invalid_type',
      },
    ];

    (handleValidateParams as jest.Mock).mockReturnValue({
      errors: mockValidationErrorIssues,
      data: undefined,
    });

    const formData = createFormData('invalidPlayer', 'invalidNumber');

    const result = await editPlayer(1, formData);

    expect(result).toEqual({
      errors: [
        {
          message: 'Validation error.',
          path: ['form'],
          code: 'custom',
        },
      ],
    });

    expect(handleRevalidatePlayerManagementCache).not.toHaveBeenCalled();
  });

  it('should update the player successfully if all validation passes', async () => {
    (handleValidateParams as jest.Mock).mockReturnValue({
      errors: [],
      data: {
        username: 'validPlayer',
        whatsappNumber: '123456789',
      },
    });

    mockPlayerData({ id: 1, clerkId: 'clerkId123', username: 'player1' });

    const formData = createFormData('validPlayer', '123456789');

    const result = await editPlayer(1, formData);

    expect(updateClerkUser).toHaveBeenCalledWith(
      'clerkId123',
      expect.objectContaining({
        username: 'validPlayer',
      })
    );

    expect(updateDatabaseUser).toHaveBeenCalledWith(1, {
      username: 'validPlayer',
      whatsappNumber: '123456789',
    });

    expect(handleRevalidatePlayerManagementCache).toHaveBeenCalled();

    expect(result).toEqual({
      errors: [],
      success: true,
    });
  });

  it('should handle errors during the update process', async () => {
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

    (updateClerkUser as jest.Mock).mockRejectedValue(
      new Error('User update failed')
    );

    const result = await editPlayer(1, formData);

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
