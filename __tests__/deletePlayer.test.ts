import { deletePlayer } from '@/app/actions/deletePlayer';
import prisma from '@/lib/prisma';
import { users } from '@clerk/clerk-sdk-node';

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

describe('deletePlayer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if the player is not found or Clerk ID is missing', async () => {
    // Arrange
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // Player not found

    // Act
    const result = await deletePlayer(1);

    // Assert
    expect(result).toEqual({
      success: false,
      error: 'Player not found or Clerk ID is missing.',
    });
    expect(users.deleteUser).not.toHaveBeenCalled();
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });

  it('should delete the player successfully from both Clerk and the database', async () => {
    // Arrange
    const mockPlayer = {
      clerkId: 'clerkId123',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPlayer);

    // Act
    const result = await deletePlayer(1);

    // Assert
    expect(users.deleteUser).toHaveBeenCalledWith('clerkId123');
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(result).toEqual({
      success: true,
    });
  });

  it('should handle errors when deleting the player from Clerk or the database', async () => {
    // Arrange
    const mockPlayer = {
      clerkId: 'clerkId123',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPlayer);

    (users.deleteUser as jest.Mock).mockRejectedValue(
      new Error('Clerk deletion failed')
    );

    // Act
    const result = await deletePlayer(1);

    // Assert
    expect(users.deleteUser).toHaveBeenCalledWith('clerkId123');
    expect(prisma.user.delete).not.toHaveBeenCalled(); // Should not delete from the DB if Clerk deletion fails

    expect(result).toEqual({
      success: false,
      error: 'Error deleting the player.',
    });
  });

  it('should handle errors when deleting the player from the database', async () => {
    // Arrange
    const mockPlayer = {
      clerkId: 'clerkId123',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPlayer);

    (users.deleteUser as jest.Mock).mockResolvedValue(undefined); // Clerk deletion succeeds
    (prisma.user.delete as jest.Mock).mockRejectedValue(
      new Error('Database deletion failed')
    );

    // Act
    const result = await deletePlayer(1);

    // Assert
    expect(users.deleteUser).toHaveBeenCalledWith('clerkId123');
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(result).toEqual({
      success: false,
      error: 'Error deleting the player.',
    });
  });
});
