import { getTeamsInPoule } from '../src/app/actions/getTeamsInPoule';
import prisma from '../src/lib/prisma';

jest.mock('../src/lib/prisma', () => ({
  poule: {
    findMany: jest.fn(),
  },
}));

jest.mock('../src//utils/errorUtils', () => ({
  formatError: jest.fn((message, path, code, includeSuccess) => ({
    success: includeSuccess ? false : undefined,
    errors: [{ message, path, code }],
  })),
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
      errors: [
        {
          message: 'Geen poules gevonden. Maak een nieuwe poule aan.',
          path: ['poules'],
          code: 'custom',
        },
      ],
    });
  });

  it('should handle errors when fetching teams in poules', async () => {
    (prisma.poule.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    const result = await getTeamsInPoule();

    expect(result).toEqual({
      success: false,
      errors: [
        {
          message: 'Mislukt om teams in de poules te laden.',
          path: ['poules'],
          code: 'custom',
        },
      ],
    });
  });
});
