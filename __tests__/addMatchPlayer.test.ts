import addMatchPlayer from '@/app/actions/addMatchPlayer';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    matchPlayer: {
      create: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addMatchPlayer Functionality Tests', () => {
  it('should add a match player successfully when valid data is provided', async () => {
    // Arrange
    const createMock = mockedPrisma.matchPlayer.create as jest.Mock;
    createMock.mockResolvedValue({
      id: 1,
      userId: 1,
      matchId: 1,
      minutes: 90,
      available: true,
    });

    const validData = {
      userId: 1,
      matchId: 1,
      minutes: 90,
      available: true,
    };

    // Act
    const result = await addMatchPlayer(validData);

    // Assert
    expect(result).toEqual({ success: true });
    expect(createMock).toHaveBeenCalledWith({
      data: validData,
    });
  });

  it('should return validation errors when userId is missing', async () => {
    // Arrange
    const invalidData = {
      matchId: 1,
      minutes: 90,
      available: true,
    };

    // Act
    const result = await addMatchPlayer(invalidData as any);

    // Assert
    expect(result).toHaveProperty('errors');
    if (result.errors) {
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].path).toContain('userId');
    }

    expect(mockedPrisma.matchPlayer.create).not.toHaveBeenCalled();
  });

  it('should return an error when there is a database error during match player creation', async () => {
    // Arrange
    const createMock = mockedPrisma.matchPlayer.create as jest.Mock;
    createMock.mockRejectedValue(new Error('Database error'));

    const validData = {
      userId: 1,
      matchId: 1,
      minutes: 90,
      available: true,
    };

    // Act
    const result = await addMatchPlayer(validData);

    // Assert
    expect(result).toHaveProperty('error');
    expect(result.error).toBe('Failed to add match player to the database.');

    expect(createMock).toHaveBeenCalledWith({
      data: validData,
    });
  });
});
