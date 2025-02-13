jest.spyOn(console, 'error').mockImplementation(() => {});
import {
  handleFindPlayerById,
  updatePlayerInDatabase,
  updateClerkUser,
} from '@/lib/services/editPlayerService';
import { handleValidateEditPlayerData } from '@/schemas/validation/editPlayerValidation';
import {
  playerNotFoundOrInvalid,
  errorUpdatingPlayer,
} from '@/strings/actionStrings';
import { formatError } from '@/utils/errorUtils';

import handleEditPlayer from '../src/app/actions/editPlayer';

jest.mock('../src/lib/services/editPlayerService', () => ({
  handleFindPlayerById: jest.fn(),
  updatePlayerInDatabase: jest.fn(),
  updateClerkUser: jest.fn(),
}));

jest.mock('../src/schemas/validation/editPlayerValidation', () => ({
  handleValidateEditPlayerData: jest.fn(),
}));

jest.mock('../src/utils/errorUtils', () => ({
  formatError: jest.fn((message) => ({
    errors: [{ message, path: ['form'], code: 'custom' }],
    success: false,
  })),
}));

describe('handleEditPlayer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const createFormData = (
    username: string,
    whatsappNumber?: string,
    password?: string
  ): FormData => {
    const formData = new FormData();
    formData.append('username', username);
    if (whatsappNumber) {
      formData.append('whatsappNumber', whatsappNumber);
    }
    if (password) {
      formData.append('password', password);
    }
    return formData;
  };

  interface Player {
    id: number;
    clerkId: string;
    username: string | null;
  }

  const mockPlayerData = (player: Player | null): void => {
    (handleFindPlayerById as jest.Mock).mockResolvedValue(player);
  };

  it('should return an error if validation fails', async () => {
    const formData = createFormData('player1');

    (handleValidateEditPlayerData as jest.Mock).mockReturnValue({
      success: false,
      errors: [
        {
          message: 'Username and WhatsApp number are required.',
          path: ['form'],
          code: 'custom',
        },
      ],
    });

    const result = await handleEditPlayer(1, formData);

    expect(result).toEqual({
      errors: [
        {
          message: 'Username and WhatsApp number are required.',
          path: ['form'],
          code: 'custom',
        },
      ],
      success: false,
    });
  });

  it('should return an error if the player is not found or has invalid data', async () => {
    mockPlayerData(null);
    const formData = createFormData('player1', '123456789');

    (handleValidateEditPlayerData as jest.Mock).mockReturnValue({
      success: true,
      data: {
        username: 'player1',
        password: undefined,
        whatsappNumber: '123456789',
      },
    });

    const result = await handleEditPlayer(1, formData);

    expect(handleFindPlayerById).toHaveBeenCalledWith(1);
    expect(formatError).toHaveBeenCalledWith(playerNotFoundOrInvalid);
    expect(result).toEqual({
      errors: [
        {
          message:
            'Speler niet gevonden, Clerk-ID ontbreekt of gebruikersnaam is leeg.',
          path: ['form'],
          code: 'custom',
        },
      ],
      success: false,
    });
  });

  it('should return validation errors if the schema validation fails', async () => {
    mockPlayerData({ id: 1, clerkId: 'clerkId123', username: 'player1' });
    const formData = createFormData('invalidPlayer', 'invalidNumber');

    (handleValidateEditPlayerData as jest.Mock).mockReturnValue({
      success: false,
      errors: [
        {
          message: 'Invalid username',
          path: ['username'],
          code: 'invalid_type',
        },
      ],
    });

    const result = await handleEditPlayer(1, formData);

    expect(result).toEqual({
      errors: [
        {
          message: 'Invalid username',
          path: ['username'],
          code: 'invalid_type',
        },
      ],
      success: false,
    });
  });

  it('should update the player successfully if all validation passes', async () => {
    const player: Player = {
      id: 1,
      clerkId: 'clerkId123',
      username: 'player1',
    };
    mockPlayerData(player);
    const formData = createFormData('validPlayer', '123456789');

    (handleValidateEditPlayerData as jest.Mock).mockReturnValue({
      success: true,
      data: {
        username: 'validPlayer',
        password: undefined,
        whatsappNumber: '123456789',
      },
    });

    const result = await handleEditPlayer(1, formData);

    expect(handleFindPlayerById).toHaveBeenCalledWith(1);
    expect(updateClerkUser).toHaveBeenCalledWith('clerkId123', {
      username: 'validPlayer',
      password: undefined,
    });
    expect(updatePlayerInDatabase).toHaveBeenCalledWith(1, {
      username: 'validPlayer',
      whatsappNumber: '123456789',
    });

    expect(result).toEqual({
      errors: [],
      success: true,
    });
  });

  it('should handle errors during the update process', async () => {
    const player: Player = {
      id: 1,
      clerkId: 'clerkId123',
      username: 'player1',
    };
    mockPlayerData(player);
    const formData = createFormData('validPlayer', '123456789');

    (handleValidateEditPlayerData as jest.Mock).mockReturnValue({
      success: true,
      data: {
        username: 'validPlayer',
        password: undefined,
        whatsappNumber: '123456789',
      },
    });

    (updateClerkUser as jest.Mock).mockRejectedValue(
      new Error('User update failed')
    );

    const result = await handleEditPlayer(1, formData);

    expect(handleFindPlayerById).toHaveBeenCalledWith(1);
    expect(updateClerkUser).toHaveBeenCalledWith('clerkId123', {
      username: 'validPlayer',
      password: undefined,
    });
    expect(updatePlayerInDatabase).not.toHaveBeenCalled();
    expect(formatError).toHaveBeenCalledWith(errorUpdatingPlayer);
    expect(result).toEqual({
      errors: [
        {
          message: 'Fout bij het bijwerken van de speler.',
          path: ['form'],
          code: 'custom',
        },
      ],
      success: false,
    });
  });
});
