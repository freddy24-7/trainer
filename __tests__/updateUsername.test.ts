import { updateUsername } from '@/app/actions/updateUsername';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

describe('updateUsername', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if the user is not found', async () => {
    // Arrange
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    // Act
    const result = await updateUsername('clerkId123', 'newUsername');

    // Assert
    expect(result).toEqual({
      success: false,
      error: 'User not found',
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('should update the username if it is different from the current one', async () => {
    // Arrange
    const mockUser = {
      clerkId: 'clerkId123',
      username: 'oldUsername',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    // Act
    const result = await updateUsername('clerkId123', 'newUsername');

    // Assert
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { clerkId: 'clerkId123' },
      data: { username: 'newUsername' },
    });
    expect(result).toEqual({
      success: true,
    });
  });

  it('should not update the username if it is the same as the current one', async () => {
    // Arrange
    const mockUser = {
      clerkId: 'clerkId123',
      username: 'sameUsername',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    // Act
    const result = await updateUsername('clerkId123', 'sameUsername');

    // Assert
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
    });
  });

  it('should handle errors during the username update process', async () => {
    // Arrange
    const mockUser = {
      clerkId: 'clerkId123',
      username: 'oldUsername',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    (prisma.user.update as jest.Mock).mockRejectedValue(
      new Error('Database update error')
    );

    // Act
    const result = await updateUsername('clerkId123', 'newUsername');

    // Assert
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { clerkId: 'clerkId123' },
      data: { username: 'newUsername' },
    });

    expect(result).toEqual({
      success: false,
      error: 'Error updating username',
    });
  });
});
