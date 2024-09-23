import { getPlayers } from '@/app/actions/getPlayers';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

jest.mock('@/lib/prisma', () => ({
  user: {
    findMany: jest.fn(),
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('getPlayers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return players successfully', async () => {
    // Arrange
    const mockPlayers = [
      { id: 1, username: 'player1' },
      { id: 2, username: 'player2' },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockPlayers);

    // Act
    const result = await getPlayers();

    // Assert
    expect(result).toEqual({ success: true, players: mockPlayers });
    expect(revalidatePath).toHaveBeenCalledWith('/player/management');
  });

  it('should return an empty list if no players are found', async () => {
    // Arrange
    (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

    // Act
    const result = await getPlayers();

    // Assert
    expect(result).toEqual({ success: true, players: [] });
    expect(revalidatePath).toHaveBeenCalledWith('/player/management');
  });

  it('should handle errors when fetching players', async () => {
    // Arrange
    (prisma.user.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    // Act
    const result = await getPlayers();

    // Assert
    expect(result).toEqual({
      success: false,
      error: 'Error fetching players.',
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
