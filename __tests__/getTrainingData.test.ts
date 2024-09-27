import { getTrainingData } from '@/app/actions/getTrainingData';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  training: {
    findMany: jest.fn(),
  },
}));

describe('getTrainingData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the training data successfully', async () => {
    // Arrange
    const mockTrainings = [
      {
        id: 1,
        date: new Date('2023-09-15'),
        trainingPlayers: [
          { absent: true, user: { username: 'player1' } },
          { absent: true, user: { username: 'player2' } },
        ],
      },
      {
        id: 2,
        date: new Date('2023-09-16'),
        trainingPlayers: [{ absent: true, user: { username: 'player3' } }],
      },
    ];

    (prisma.training.findMany as jest.Mock).mockResolvedValue(mockTrainings);

    // Act
    const result = await getTrainingData();

    // Assert
    expect(result).toEqual({
      success: true,
      trainingData: [
        {
          id: 1,
          date: '2023-09-15T00:00:00.000Z',
          absentPlayers: ['player1', 'player2'],
        },
        {
          id: 2,
          date: '2023-09-16T00:00:00.000Z',
          absentPlayers: ['player3'],
        },
      ],
    });
  });

  it('should return an empty training data list if no trainings are found', async () => {
    // Arrange
    (prisma.training.findMany as jest.Mock).mockResolvedValue([]);

    // Act
    const result = await getTrainingData();

    // Assert
    expect(result).toEqual({
      success: true,
      trainingData: [],
    });
  });

  it('should return correct data for training with no absent players', async () => {
    // Arrange
    const mockTrainings = [
      {
        id: 3,
        date: new Date('2023-09-17'),
        trainingPlayers: [],
      },
    ];

    (prisma.training.findMany as jest.Mock).mockResolvedValue(mockTrainings);

    // Act
    const result = await getTrainingData();

    // Assert
    expect(result).toEqual({
      success: true,
      trainingData: [
        {
          id: 3,
          date: '2023-09-17T00:00:00.000Z',
          absentPlayers: [],
        },
      ],
    });
  });

  it('should handle errors when fetching training data', async () => {
    // Arrange
    (prisma.training.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    // Act
    const result = await getTrainingData();

    // Assert
    expect(result).toEqual({
      success: false,
      error: 'Failed to fetch training data.',
    });
  });
});
