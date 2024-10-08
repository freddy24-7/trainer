import { getTeamsInPoule } from '@/app/actions/getTeamsInPoule';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  poule: {
    findMany: jest.fn(),
  },
}));

describe('getTeamsInPoule', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return teams in poules successfully', async () => {
    const mockPoules = [
      {
        id: 1,
        name: 'Poule A',
        team: { id: 1, name: 'Team A1' },
        opponents: [
          { id: 2, team: { id: 2, name: 'Team A2' } },
          { id: 3, team: { id: 3, name: 'Team A3' } },
        ],
        createdAt: new Date(),
      },
      {
        id: 2,
        name: 'Poule B',
        team: { id: 4, name: 'Team B1' },
        opponents: [{ id: 5, team: { id: 5, name: 'Team B2' } }],
        createdAt: new Date(),
      },
    ];

    (prisma.poule.findMany as jest.Mock).mockResolvedValue(mockPoules);

    const result = await getTeamsInPoule();

    expect(result).toEqual({
      success: true,
      poules: [
        {
          id: 1,
          pouleName: 'Poule A',
          teams: [
            { id: 1, name: 'Team A1' },
            { id: 2, name: 'Team A2' },
            { id: 3, name: 'Team A3' },
          ],
          opponents: [
            { id: 2, team: { id: 2, name: 'Team A2' } },
            { id: 3, team: { id: 3, name: 'Team A3' } },
          ],
        },
        {
          id: 2,
          pouleName: 'Poule B',
          teams: [
            { id: 4, name: 'Team B1' },
            { id: 5, name: 'Team B2' },
          ],
          opponents: [{ id: 5, team: { id: 5, name: 'Team B2' } }],
        },
      ],
      latestPoule: {
        id: 1,
        pouleName: 'Poule A',
        teams: [
          { id: 1, name: 'Team A1' },
          { id: 2, name: 'Team A2' },
          { id: 3, name: 'Team A3' },
        ],
        opponents: [
          { id: 2, team: { id: 2, name: 'Team A2' } },
          { id: 3, team: { id: 3, name: 'Team A3' } },
        ],
      },
    });
  });

  it('should return an error if no poules are found', async () => {
    (prisma.poule.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getTeamsInPoule();

    expect(result).toEqual({
      success: false,
      error: 'No poules found. Please create a new poule.',
    });
  });

  it('should handle errors when fetching teams in poules', async () => {
    (prisma.poule.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    const result = await getTeamsInPoule();

    expect(result).toEqual({
      success: false,
      error: 'Failed to load teams in the poules.',
    });
  });
});
