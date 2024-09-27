import { getTrainingAttendanceList } from '@/app/actions/getTrainingAttendanceList';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  user: {
    findMany: jest.fn(),
  },
}));

describe('getTrainingAttendanceList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the training attendance list successfully', async () => {
    // Arrange
    const mockPlayers = [
      {
        id: 1,
        username: 'player1',
        TrainingPlayer: [{ absent: true }, { absent: true }],
      },
      {
        id: 2,
        username: 'player2',
        TrainingPlayer: [{ absent: true }],
      },
    ];

    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockPlayers);

    // Act
    const result = await getTrainingAttendanceList();

    // Assert
    expect(result).toEqual({
      success: true,
      attendanceList: [
        {
          playerId: 1,
          username: 'player1',
          absences: 2,
        },
        {
          playerId: 2,
          username: 'player2',
          absences: 1,
        },
      ],
    });
  });

  it('should return an empty attendance list if no players are found', async () => {
    // Arrange
    (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

    // Act
    const result = await getTrainingAttendanceList();

    // Assert
    expect(result).toEqual({
      success: true,
      attendanceList: [],
    });
  });

  it('should return correct data for a player with no absences', async () => {
    // Arrange
    const mockPlayers = [
      {
        id: 3,
        username: 'player3',
        TrainingPlayer: [],
      },
    ];

    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockPlayers);

    // Act
    const result = await getTrainingAttendanceList();

    // Assert
    expect(result).toEqual({
      success: true,
      attendanceList: [
        {
          playerId: 3,
          username: 'player3',
          absences: 0,
        },
      ],
    });
  });

  it('should handle errors when fetching attendance data', async () => {
    // Arrange
    (prisma.user.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    // Act
    const result = await getTrainingAttendanceList();

    // Assert
    expect(result).toEqual({
      success: false,
      error: 'Failed to fetch attendance data.',
    });
  });
});
