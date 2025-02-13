jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
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
const findUniqueMock = mockedPrisma.pouleOpponents.findUnique as jest.Mock;
const createMock = mockedPrisma.match.create as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addMatch Functionality Tests', () => {
  it('should create a match successfully when valid input is provided and the opponent exists', async () => {
    const validDate = new Date().toISOString();
    const formData = new FormData();
    formData.append('matchType', 'competition');
    formData.append('date', validDate);
    formData.append('pouleOpponentId', '1');
    formData.append(
      'players',
      JSON.stringify([{ id: 1, minutes: 90, available: true }])
    );
    formData.append('matchEvents', JSON.stringify([]));
    formData.append('opponentStrength', 'STRONGER');

    findUniqueMock.mockResolvedValue({ id: 1 });
    createMock.mockResolvedValue({
      id: 123,
      trainingMatch: false,
      date: new Date(validDate),
    });

    const result = await addMatch(undefined, formData);

    expect(result).toHaveProperty('match');
    expect(result.match).toHaveProperty('id', 123);
    expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(createMock).toHaveBeenCalled();
  });

  it('should return validation errors when pouleOpponentId is missing', async () => {
    const formData = new FormData();
    formData.append('date', new Date().toISOString());
    formData.append('players', JSON.stringify([]));
    formData.append('matchEvents', JSON.stringify([]));

    const result = await addMatch(undefined, formData);

    expect(result).toHaveProperty('errors');
    expect(result.errors).toBeInstanceOf(Array);
    expect(result.errors?.length).toBeGreaterThan(0);
    expect(result.errors?.[0].path).toContain('form');

    expect(findUniqueMock).not.toHaveBeenCalled();
    expect(createMock).not.toHaveBeenCalled();
  });

  it('should return an error when the opponent does not exist', async () => {
    const validDate = new Date().toISOString();
    const formData = new FormData();
    formData.append('matchType', 'competition');
    formData.append('date', validDate);
    formData.append('pouleOpponentId', '2');
    formData.append(
      'players',
      JSON.stringify([{ id: 1, minutes: 90, available: true }])
    );
    formData.append('matchEvents', JSON.stringify([]));
    formData.append('opponentStrength', 'SIMILAR');

    findUniqueMock.mockResolvedValue(null);

    const result = await addMatch(undefined, formData);

    expect(result).toHaveProperty('errors');
    expect(result.errors).toBeInstanceOf(Array);
    expect(result.errors?.length).toBeGreaterThan(0);
    expect(result.errors?.[0].path).toContain('pouleOpponentId');

    expect(createMock).not.toHaveBeenCalled();
  });
});
