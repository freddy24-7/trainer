jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
import addTraining from '../src/app/actions/addTraining';
import prisma from '../src/lib/prisma';

jest.mock('../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    training: {
      create: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addTraining Functionality Tests', () => {
  it('should create a training successfully when players array is empty', async () => {
    const createMock = prisma.training.create as jest.Mock;
    createMock.mockResolvedValue({
      id: 1,
      date: new Date(),
      createdAt: new Date(),
      trainingPlayers: [],
    });

    const formData = new FormData();
    formData.append('date', new Date().toISOString());
    formData.append('players', JSON.stringify([]));

    const result = await addTraining(formData);

    expect(result).toEqual({
      success: true,
      training: {
        id: 1,
        date: expect.any(Date),
        createdAt: expect.any(Date),
        trainingPlayers: [],
      },
    });
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it('should create a training successfully when players array is missing', async () => {
    const createMock = prisma.training.create as jest.Mock;
    createMock.mockResolvedValue({
      id: 1,
      date: new Date(),
      createdAt: new Date(),
      trainingPlayers: [],
    });

    const formData = new FormData();
    formData.append('date', new Date().toISOString());

    const result = await addTraining(formData);

    expect(result).toEqual({
      success: true,
      training: {
        id: 1,
        date: expect.any(Date),
        createdAt: expect.any(Date),
        trainingPlayers: [],
      },
    });
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it('should return validation errors when date is missing in the input', async () => {
    const createMock = prisma.training.create as jest.Mock;
    const formData = new FormData();
    formData.append('players', JSON.stringify([{ userId: 1, absent: false }]));

    const result = await addTraining(formData);

    if ('errors' in result) {
      expect(result.errors).toBeInstanceOf(Array);
      expect(result.errors.length).toBeGreaterThan(0);
    } else {
      throw new Error('Expected errors but got a success response.');
    }
    expect(createMock).not.toHaveBeenCalled();
  });

  it('should return an error when the database operation fails', async () => {
    const createMock = prisma.training.create as jest.Mock;
    createMock.mockRejectedValue(new Error('Database error'));

    const formData = new FormData();
    formData.append('date', new Date().toISOString());
    formData.append('players', JSON.stringify([{ userId: 1, absent: false }]));

    const result = await addTraining(formData);

    expect(result).toEqual({
      errors: [
        {
          message: 'Mislukt om training aan te maken.',
          path: ['addTraining'],
          code: 'custom',
        },
      ],
    });
    expect(createMock).toHaveBeenCalledTimes(1);
  });
});
