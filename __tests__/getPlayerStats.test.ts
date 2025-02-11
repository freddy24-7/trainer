import { getPlayerStats } from '@/app/actions/getPlayerStats';

import prisma from '../src/lib/prisma';

jest.mock('../src/lib/prisma', () => ({
  user: {
    findMany: jest.fn(),
  },
}));

describe('getPlayerStats', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle errors when fetching player stats', async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    const result = await getPlayerStats();

    expect(result).toEqual({
      success: false,
      error: 'Mislukt om spelersstatistieken op te halen.',
    });
  });

  it('should return an empty stats list if no players are found', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getPlayerStats();

    expect(result).toEqual([]);
  });

  it('should return correct stats for a player with no matches', async () => {
    const player = {
      id: 1,
      username: 'PlayerOne',
      whatsappNumber: '12345',
      matchPlayers: [],
      MatchEvent: [],
    };

    (prisma.user.findMany as jest.Mock).mockResolvedValue([player]);

    const result = await getPlayerStats();

    expect(result).toEqual([
      {
        id: player.id,
        username: player.username,
        matchData: [],
      },
    ]);
  });
});
