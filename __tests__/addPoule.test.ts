import { ZodIssue } from 'zod';

import addPoule from '@/app/actions/addPoule';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
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

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

const pouleName = 'Test Poule';
const opponentName1 = 'Opponent 1';
const opponentName2 = 'Opponent 2';

describe('addPoule', () => {
  const mockFindUnique = prisma.team.findUnique as jest.Mock;
  const mockCreateTeam = prisma.team.create as jest.Mock;
  const mockCreatePoule = prisma.poule.create as jest.Mock;
  const mockCreatePouleOpponents = prisma.pouleOpponents.create as jest.Mock;
  const mockRedirect = require('next/navigation').redirect as jest.Mock;
  const mockRevalidatePath = require('next/cache').revalidatePath as jest.Mock;

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

    await addPoule(null, formData);

    expect(mockCreatePoule).toHaveBeenCalledWith({
      data: {
        name: pouleName,
        team: { connect: { id: 1 } },
      },
    });
    expect(mockCreatePouleOpponents).toHaveBeenCalledTimes(2);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/poule-management');
    expect(mockRedirect).toHaveBeenCalledWith('/poule-management');
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
        require('@/schemas/createPouleSchema').createPouleSchema,
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

    if (result && 'errors' in result) {
      expect(result.errors).toEqual([
        {
          message: 'Validatie mislukt.',
          path: ['addPoule'],
          code: 'custom',
        },
      ]);
    } else {
      throw new Error('Expected validation errors but got void.');
    }
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

    if (result && 'errors' in result) {
      expect(result.errors).toEqual([
        {
          message:
            'Fout bij het aanmaken van de poule of koppelen van tegenstanders.',
          path: ['form'],
          code: 'custom',
        },
      ]);
    } else {
      throw new Error(
        'Expected an errors object but got void or a different response.'
      );
    }

    expect(mockCreatePoule).toHaveBeenCalledTimes(1);
    expect(mockCreatePouleOpponents).toHaveBeenCalled();
  });
});
