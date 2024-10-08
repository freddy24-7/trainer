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
    // Arrange
    mockFindUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    mockCreateTeam
      .mockResolvedValueOnce({ id: 1, name: 'Main Team' })
      .mockResolvedValueOnce({ id: 2, name: 'Opponent 1' })
      .mockResolvedValueOnce({ id: 3, name: 'Opponent 2' });

    mockCreatePoule.mockResolvedValueOnce({ id: 1, name: 'Test Poule' });
    mockCreatePouleOpponents.mockResolvedValue({});

    const formData = new FormData();
    formData.append('pouleName', 'Test Poule');
    formData.append('mainTeamName', 'Main Team');
    formData.append('opponents', 'Opponent 1');
    formData.append('opponents', 'Opponent 2');

    // Act
    await addPoule(null, formData);

    // Assert
    expect(mockCreatePoule).toHaveBeenCalledWith({
      data: {
        name: 'Test Poule',
        team: { connect: { id: 1 } },
      },
    });
    expect(mockCreatePouleOpponents).toHaveBeenCalledTimes(2);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/poule-management');
    expect(mockRedirect).toHaveBeenCalledWith('/poule-management');
  });

  it('should return validation errors', async () => {
    // Arrange
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
    formData.append('pouleName', 'Test Poule');
    formData.append('mainTeamName', 'Main Team');
    formData.append('opponents', 'Opponent 1');

    // Act
    const result = await addPoule(null, formData);

    // Assert
    if (result && 'errors' in result) {
      expect(result.errors).toEqual([mockValidationError]);
    } else {
      throw new Error('Expected validation errors but got void.');
    }
    expect(mockCreatePoule).not.toHaveBeenCalled();
  });

  it('should handle opponent creation errors gracefully', async () => {
    // Arrange
    mockFindUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    mockCreateTeam
      .mockResolvedValueOnce({ id: 1, name: 'Main Team' })
      .mockResolvedValueOnce({ id: 2, name: 'Opponent 1' });

    mockCreatePoule.mockResolvedValueOnce({ id: 1, name: 'Test Poule' });
    mockCreatePouleOpponents.mockRejectedValueOnce(
      new Error('Failed to create opponent')
    );

    const formData = new FormData();
    formData.append('pouleName', 'Test Poule');
    formData.append('mainTeamName', 'Main Team');
    formData.append('opponents', 'Opponent 1');

    // Act
    const result = await addPoule(null, formData);

    // Assert
    if (result && 'errors' in result) {
      expect(result.errors).toEqual([
        {
          message: 'Error creating the poule or linking opponents.',
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
