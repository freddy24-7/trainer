jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
import { ZodIssue } from 'zod';

import addPoule from '../src/app/actions/addPoule';
import prisma from '../src/lib/prisma';

jest.mock('../src/lib/prisma', () => ({
  team: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  poule: {
    create: jest.fn(),
  },
  pouleOpponents: {
    create: jest.fn(),
  },
}));

const pouleName = 'Test Poule';
const opponentName1 = 'Opponent 1';
const opponentName2 = 'Opponent 2';

describe('addPoule', () => {
  const mockFindUnique = prisma.team.findUnique as jest.Mock;
  const mockCreateTeam = prisma.team.create as jest.Mock;
  const mockCreatePoule = prisma.poule.create as jest.Mock;
  const mockCreatePouleOpponents = prisma.pouleOpponents.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a poule and opponents successfully', async () => {
    mockFindUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    mockCreateTeam
      .mockResolvedValueOnce({ id: 1, name: 'Main Team' })
      .mockResolvedValueOnce({ id: 2, name: opponentName1 })
      .mockResolvedValueOnce({ id: 3, name: opponentName2 });

    mockCreatePoule.mockResolvedValueOnce({ id: 1, name: pouleName });
    mockCreatePouleOpponents.mockResolvedValue({});

    const formData = new FormData();
    formData.append('pouleName', pouleName);
    formData.append('mainTeamName', 'Main Team');
    formData.append('opponents', opponentName1);
    formData.append('opponents', opponentName2);

    const result = await addPoule(null, formData);

    expect(mockCreatePoule).toHaveBeenCalledWith({
      data: {
        name: pouleName,
        team: { connect: { id: 1 } },
      },
    });
    expect(mockCreatePouleOpponents).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ errors: [], redirectPath: '/poule-management' });
  });

  it('should return validation errors', async () => {
    const mockValidationError: ZodIssue = {
      message: 'Invalid data',
      path: ['pouleName'],
      code: 'invalid_type',
      expected: 'string',
      received: 'number',
    };

    jest
      .spyOn(
        require('../src/schemas/createPouleSchema').createPouleSchema,
        'safeParse'
      )
      .mockReturnValueOnce({
        success: false,
        error: { issues: [mockValidationError] },
      });

    const formData = new FormData();
    formData.append('pouleName', pouleName);
    formData.append('mainTeamName', 'Main Team');
    formData.append('opponents', opponentName1);

    const result = await addPoule(null, formData);

    expect(result).toEqual({
      success: false,
      errors: [
        {
          code: 'custom',
          message: 'Validatie mislukt.',
          path: ['addPoule'],
        },
      ],
    });

    expect(mockCreatePoule).not.toHaveBeenCalled();
  });

  it('should handle opponent creation errors gracefully', async () => {
    mockFindUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    mockCreateTeam
      .mockResolvedValueOnce({ id: 1, name: 'Main Team' })
      .mockResolvedValueOnce({ id: 2, name: opponentName1 });

    mockCreatePoule.mockResolvedValueOnce({ id: 1, name: pouleName });
    mockCreatePouleOpponents.mockRejectedValueOnce(
      new Error('Failed to create opponent')
    );

    const formData = new FormData();
    formData.append('pouleName', pouleName);
    formData.append('mainTeamName', 'Main Team');
    formData.append('opponents', 'Opponent 1');

    const result = await addPoule(null, formData);

    expect(result).toEqual({
      errors: [
        {
          message:
            'Fout bij het aanmaken van de poule of koppelen van tegenstanders.',
          path: ['form'],
          code: 'custom',
        },
      ],
    });

    expect(mockCreatePoule).toHaveBeenCalledTimes(1);
    expect(mockCreatePouleOpponents).toHaveBeenCalled();
  });

  it('should handle failure to create main team gracefully', async () => {
    mockFindUnique.mockResolvedValueOnce(null);

    mockCreateTeam.mockResolvedValueOnce(null);

    const formData = new FormData();
    formData.append('pouleName', pouleName);
    formData.append('mainTeamName', 'Main Team');
    formData.append('opponents', opponentName1);

    const result = await addPoule(null, formData);

    expect(result).toEqual({
      errors: [
        {
          message: 'Mislukt om hoofdteam aan te maken.',
          path: ['addPoule'],
          code: 'custom',
        },
      ],
    });

    expect(mockCreatePoule).not.toHaveBeenCalled();
    expect(mockCreatePouleOpponents).not.toHaveBeenCalled();
  });
});
