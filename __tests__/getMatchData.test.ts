import { getMatchData } from '@/app/actions/getMatchData';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  match: {
    findMany: jest.fn(),
  },
}));

describe('getMatchData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return match data successfully', async () => {
    // Arrange
    const mockMatches = [
      {
        id: 1,
        date: new Date('2023-09-15'),
        pouleOpponent: {
          team: { name: 'Team A' },
        },
        matchPlayers: [
          { available: false, user: { username: 'player1' } },
          { available: false, user: { username: 'player2' } },
        ],
      },
      {
        id: 2,
        date: new Date('2023-09-16'),
        pouleOpponent: {
          team: { name: 'Team B' },
        },
        matchPlayers: [{ available: false, user: { username: 'player3' } }],
      },
    ];

    (prisma.match.findMany as jest.Mock).mockResolvedValue(mockMatches);

    // Act
    const result = await getMatchData();

    // Assert
    expect(result).toEqual({
      success: true,
      matchData: [
        {
          id: 1,
          date: new Date('2023-09-15'),
          opponentTeamName: 'Team A',
          absentPlayers: ['player1', 'player2'],
        },
        {
          id: 2,
          date: new Date('2023-09-16'),
          opponentTeamName: 'Team B',
          absentPlayers: ['player3'],
        },
      ],
    });
  });

  it('should return match data with "Unknown Opponent" if opponent team is missing', async () => {
    // Arrange
    const mockMatches = [
      {
        id: 3,
        date: new Date('2023-09-17'),
        pouleOpponent: {
          team: null,
        },
        matchPlayers: [],
      },
    ];

    (prisma.match.findMany as jest.Mock).mockResolvedValue(mockMatches);

    // Act
    const result = await getMatchData();

    // Assert
    expect(result).toEqual({
      success: true,
      matchData: [
        {
          id: 3,
          date: new Date('2023-09-17'),
          opponentTeamName: 'Unknown Opponent',
          absentPlayers: [],
        },
      ],
    });
  });

  it('should return an empty match data list if no matches are found', async () => {
    // Arrange
    (prisma.match.findMany as jest.Mock).mockResolvedValue([]);

    // Act
    const result = await getMatchData();

    // Assert
    expect(result).toEqual({
      success: true,
      matchData: [],
    });
  });

  it('should handle errors when fetching match data', async () => {
    // Arrange
    (prisma.match.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    // Act
    const result = await getMatchData();

    // Assert
    expect(result).toEqual({
      success: false,
      error: 'Failed to fetch match data.',
    });
  });
});