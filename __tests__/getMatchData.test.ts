jest.spyOn(console, 'error').mockImplementation(() => {});
import { getMatchData } from '@/app/actions/getMatchData';

import prisma from '../src/lib/prisma';

jest.mock('../src/lib/prisma', () => ({
  match: {
    findMany: jest.fn(),
  },
}));

describe('getMatchData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return match data successfully', async () => {
    (prisma.match.findMany as jest.Mock).mockResolvedValue([
      {
        id: 1,
        date: new Date('2023-01-01T00:00:00.000Z'),
        opponentStrength: 'SIMILAR',
        pouleOpponent: {
          team: { name: 'Team A' },
        },
        matchPlayers: [
          { user: { username: 'player1' } },
          { user: { username: 'player2' } },
        ],
      },
    ]);

    const result = await getMatchData();

    expect(result).toEqual({
      success: true,
      matchData: [
        {
          id: 1,
          date: new Date('2023-01-01T00:00:00.000Z'),
          opponentStrength: 'SIMILAR',
          opponentTeamName: 'Team A',
          absentPlayers: ['player1', 'player2'],
        },
      ],
    });
  });

  it('should return match data with "Onbekende Tegenstander" if opponent team is missing', async () => {
    (prisma.match.findMany as jest.Mock).mockResolvedValue([
      {
        id: 2,
        date: new Date('2023-01-02T00:00:00.000Z'),
        opponentStrength: 'WEAKER',
        pouleOpponent: {
          team: { name: null },
        },
        matchPlayers: [{ user: { username: 'player3' } }],
      },
    ]);

    const result = await getMatchData();

    expect(result).toEqual({
      success: true,
      matchData: [
        {
          id: 2,
          date: new Date('2023-01-02T00:00:00.000Z'),
          opponentStrength: 'WEAKER',
          opponentTeamName: 'Onbekende Tegenstander',
          absentPlayers: ['player3'],
        },
      ],
    });
  });

  it('should return an empty match data list if no matches are found', async () => {
    (prisma.match.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getMatchData();

    expect(result).toEqual({
      success: true,
      matchData: [],
    });
  });

  it('should handle errors when fetching match data', async () => {
    (prisma.match.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    const result = await getMatchData();

    expect(result).toEqual({
      success: false,
      error: 'Mislukt om wedstrijdgegevens op te halen.',
    });
  });
});
