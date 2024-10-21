import { users } from '@clerk/clerk-sdk-node';

import deletePlayer from '@/app/actions/deletePlayer';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@clerk/clerk-sdk-node', () => ({
  users: {
    deleteUser: jest.fn(),
  },
}));

jest.mock('@/utils/errorUtils', () => ({
  formatError: jest.fn((message) => ({
    errors: [{ message, path: ['form'], code: 'custom' }],
  })),
}));

describe('deletePlayer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if the player is not found or Clerk ID is missing', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

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
    expect(users.deleteUser).not.toHaveBeenCalled();
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });

  it('should delete the player successfully from both Clerk and the database', async () => {
    const mockPlayer = {
      clerkId: 'clerkId123',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPlayer);

    const result = await deletePlayer(1);

    expect(users.deleteUser).toHaveBeenCalledWith('clerkId123');
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(result).toEqual({
      errors: [],
      success: true,
    });
  });

  it('should handle errors when deleting the player from Clerk or the database', async () => {
    const mockPlayer = {
      clerkId: 'clerkId123',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPlayer);
    (users.deleteUser as jest.Mock).mockRejectedValue(
      new Error('Clerk deletion failed')
    );

    const result = await deletePlayer(1);

    expect(users.deleteUser).toHaveBeenCalledWith('clerkId123');
    expect(prisma.user.delete).not.toHaveBeenCalled();

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
      clerkId: 'clerkId123',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPlayer);
    (users.deleteUser as jest.Mock).mockResolvedValue(undefined);
    (prisma.user.delete as jest.Mock).mockRejectedValue(
      new Error('Database deletion failed')
    );

    const result = await deletePlayer(1);

    expect(users.deleteUser).toHaveBeenCalledWith('clerkId123');
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });

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
