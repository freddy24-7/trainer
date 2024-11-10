import { revalidatePath } from 'next/cache';

import getPlayers from '@/app/actions/getPlayers';
import prisma from '@/lib/prisma';
import { formatError } from '@/utils/errorUtils';

const errorMessage = 'Error fetching players.';

jest.mock('@/lib/prisma', () => ({
  user: {
    findMany: jest.fn(),
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/utils/errorUtils', () => ({
  formatError: jest.fn().mockImplementation(() => ({
    errors: [{ message: errorMessage }],
  })),
}));

describe('getPlayers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return players successfully', async () => {
    const mockPlayers = [
      { id: 1, username: 'player1', whatsappNumber: '1234567890' },
      { id: 2, username: 'player2', whatsappNumber: '0987654321' },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockPlayers);

    const result = await getPlayers();

    expect(result).toEqual({ success: true, players: mockPlayers });
    expect(revalidatePath).toHaveBeenCalledWith('/player-management');
  });

  it('should return an empty list if no players are found', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getPlayers();

    expect(result).toEqual({ success: true, players: [] });
    expect(revalidatePath).toHaveBeenCalledWith('/player-management');
  });

  it('should handle errors when fetching players', async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    const result = await getPlayers();

    expect(result).toEqual({
      errors: [{ message: errorMessage }],
    });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(formatError).toHaveBeenCalledWith(errorMessage);
  });
});
