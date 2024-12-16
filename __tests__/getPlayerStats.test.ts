import { getPlayerStats } from '@/app/actions/getPlayerStats';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  user: {
    findMany: jest.fn(),
  },
}));

describe('getPlayerStats', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty stats list if no players are found', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getPlayerStats();

    expect(result).toEqual({ success: true, playerStats: [] });
  });

  it('should return correct stats for a player with no matches', async () => {
    const mockPlayers = [
      {
        id: 3,
        username: 'player3',
        MatchPlayer: [],
      },
    ];

    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockPlayers);

    const result = await getPlayerStats();

    expect(result).toEqual({
      success: true,
      playerStats: [
        {
          id: 3,
          username: 'player3',
          matchesPlayed: 0,
          averagePlayingTime: 0,
          absences: 0,
        },
      ],
    });
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
});
