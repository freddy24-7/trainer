import addMatch from '../src/app/actions/addMatch';
import prisma from '../src/lib/prisma';

jest.mock('../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    pouleOpponents: {
      findUnique: jest.fn(),
    },
    match: {
      create: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addMatch Functionality Tests', () => {
  it('should create a match successfully when valid input is provided and the opponent exists', async () => {
    const findUniqueMock = mockedPrisma.pouleOpponents.findUnique as jest.Mock;
    const createMock = mockedPrisma.match.create as jest.Mock;

    findUniqueMock.mockResolvedValue({
      id: 1,
    });
    createMock.mockResolvedValue({
      id: 1,
    });

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());

    const result = await addMatch(undefined, formData);

    expect(result).toEqual({ match: { id: 1 } });
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(createMock).toHaveBeenCalledWith({
      data: {
        pouleOpponentId: 1,
        date: expect.any(Date),
        createdAt: expect.any(Date),
      },
    });
  });

  it('should return validation errors when pouleOpponentId is missing', async () => {
    const formData = new FormData();
    formData.append('date', new Date().toISOString());

    const result = await addMatch(undefined, formData);

    expect(result).toHaveProperty('errors');
    expect(result.errors).toBeInstanceOf(Array);
    expect(result.errors?.length).toBeGreaterThan(0);

    expect(result.errors?.[0].path).toContain('form');

    expect(mockedPrisma.pouleOpponents.findUnique).not.toHaveBeenCalled();
    expect(mockedPrisma.match.create).not.toHaveBeenCalled();
  });

  it('should return an error when the opponent does not exist', async () => {
    const findUniqueMock = mockedPrisma.pouleOpponents.findUnique as jest.Mock;
    findUniqueMock.mockResolvedValue(null);

    const formData = new FormData();
    formData.append('pouleOpponentId', '999');
    formData.append('date', new Date().toISOString());

    const result = await addMatch(undefined, formData);

    expect(result).toHaveProperty('errors');
    expect(result.errors).toContainEqual({
      message: 'Geselecteerde tegenstander bestaat niet.',
      path: ['pouleOpponentId'],
      code: 'custom',
    });

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: 999 },
    });
    expect(mockedPrisma.match.create).not.toHaveBeenCalled();
  });
});
