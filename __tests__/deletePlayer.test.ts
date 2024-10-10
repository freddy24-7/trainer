import { deletePlayer } from '@/app/actions/deletePlayer';
import { deleteUserInClerk } from '@/lib/services/clerkDeletePlayerService';
import { deleteUserInPrisma } from '@/lib/services/prismaDeletePlayerService';
import { fetchPlayer } from '@/lib/services/prismaPlayerService';

jest.mock('@/lib/services/clerkDeletePlayerService', () => ({
  deleteUserInClerk: jest.fn(),
}));

jest.mock('@/lib/services/prismaDeletePlayerService', () => ({
  deleteUserInPrisma: jest.fn(),
}));

jest.mock('@/lib/services/prismaPlayerService', () => ({
  fetchPlayer: jest.fn(),
}));

describe('deletePlayer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if the player is not found or Clerk ID is missing', async () => {
    (fetchPlayer as jest.Mock).mockResolvedValue({
      errors: [
        { message: 'Player not found.', path: ['form'], code: 'custom' },
      ],
      player: undefined,
    });

    const result = await deletePlayer(1);

    expect(result).toEqual({
      errors: [
        {
          message: 'Player not found or Clerk ID is missing.',
          path: ['form'],
          code: 'custom',
        },
      ],
    });
    expect(deleteUserInClerk).not.toHaveBeenCalled();
    expect(deleteUserInPrisma).not.toHaveBeenCalled();
  });

  it('should delete the player successfully from both Clerk and the database', async () => {
    const mockPlayer = {
      id: 1,
      username: 'Test Player 1',
      whatsappNumber: '1234567890',
      clerkId: 'clerkId123',
    };
    (fetchPlayer as jest.Mock).mockResolvedValue({
      errors: [],
      player: mockPlayer,
    });

    const result = await deletePlayer(1);

    expect(deleteUserInClerk).toHaveBeenCalledWith('clerkId123');
    expect(deleteUserInPrisma).toHaveBeenCalledWith(1);

    expect(result).toEqual({
      errors: [],
      success: true,
    });
  });

  it('should handle errors when deleting the player from Clerk', async () => {
    const mockPlayer = {
      id: 1,
      username: 'Test Player 2',
      whatsappNumber: '1234567890',
      clerkId: 'clerkId123',
    };
    (fetchPlayer as jest.Mock).mockResolvedValue({
      errors: [],
      player: mockPlayer,
    });

    (deleteUserInClerk as jest.Mock).mockRejectedValue(
      new Error('Clerk deletion failed')
    );

    const result = await deletePlayer(1);

    expect(deleteUserInClerk).toHaveBeenCalledWith('clerkId123');
    expect(deleteUserInPrisma).not.toHaveBeenCalled();

    expect(result).toEqual({
      errors: [
        {
          message: 'Error deleting the player.',
          path: ['form'],
          code: 'custom',
        },
      ],
    });
  });

  it('should handle errors when deleting the player from the database', async () => {
    const mockPlayer = {
      id: 1,
      username: 'Test Player 3',
      whatsappNumber: '1234567890',
      clerkId: 'clerkId123',
    };
    (fetchPlayer as jest.Mock).mockResolvedValue({
      errors: [],
      player: mockPlayer,
    });

    (deleteUserInClerk as jest.Mock).mockResolvedValue(undefined);
    (deleteUserInPrisma as jest.Mock).mockRejectedValue(
      new Error('Database deletion failed')
    );

    const result = await deletePlayer(1);

    expect(deleteUserInClerk).toHaveBeenCalledWith('clerkId123');
    expect(deleteUserInPrisma).toHaveBeenCalledWith(1);

    expect(result).toEqual({
      errors: [
        {
          message: 'Error deleting the player.',
          path: ['form'],
          code: 'custom',
        },
      ],
    });
  });
});
