import addMatch from '@/app/actions/addMatch';
import addMatchAndPlayers from '@/app/actions/addMatchAndPlayers';
import addMatchPlayer from '@/app/actions/addMatchPlayer';

jest.mock('@/app/actions/addMatch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/app/actions/addMatchPlayer', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedAddMatch = addMatch as jest.Mock;
const mockedAddMatchPlayer = addMatchPlayer as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addMatchAndPlayers Functionality Tests', () => {
  it('should return validation errors when pouleOpponentId is missing', async () => {
    const formData = new FormData();
    formData.append('date', new Date().toISOString());
    formData.append('players', JSON.stringify([]));

    const result = await addMatchAndPlayers(null, formData);

    expect(result).toHaveProperty('errors');
    expect(result.errors).toContainEqual({
      message: 'Poule opponent ID is missing.',
      path: ['pouleOpponentId'],
      code: 'custom',
    });
    expect(mockedAddMatch).not.toHaveBeenCalled();
    expect(mockedAddMatchPlayer).not.toHaveBeenCalled();
  });

  it('should return validation errors when pouleOpponentId is not a valid number', async () => {
    const formData = new FormData();
    formData.append('pouleOpponentId', 'invalid-id');
    formData.append('date', new Date().toISOString());
    formData.append('players', JSON.stringify([]));

    const result = await addMatchAndPlayers(null, formData);

    expect(result).toHaveProperty('errors');
    expect(result.errors).toContainEqual({
      message: 'Invalid opponent ID. Expected a number.',
      path: ['pouleOpponentId'],
      code: 'custom',
    });
    expect(mockedAddMatch).not.toHaveBeenCalled();
    expect(mockedAddMatchPlayer).not.toHaveBeenCalled();
  });

  it('should return validation errors when date is missing', async () => {
    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('players', JSON.stringify([]));

    const result = await addMatchAndPlayers(null, formData);

    expect(result).toHaveProperty('errors');
    expect(result.errors).toContainEqual({
      message: 'Date is required.',
      path: ['date'],
      code: 'custom',
    });
    expect(mockedAddMatch).not.toHaveBeenCalled();
    expect(mockedAddMatchPlayer).not.toHaveBeenCalled();
  });

  it('should return validation errors when players data is invalid JSON', async () => {
    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());
    formData.append('players', 'invalid-json');

    const result = await addMatchAndPlayers(null, formData);

    expect(result).toHaveProperty('errors');
    expect(result.errors).toContainEqual({
      message: expect.stringContaining('Invalid player data format'),
      path: ['players'],
      code: 'custom',
    });
    expect(mockedAddMatch).not.toHaveBeenCalled();
    expect(mockedAddMatchPlayer).not.toHaveBeenCalled();
  });

  it('should create a match and add players successfully', async () => {
    mockedAddMatch.mockResolvedValue({ match: { id: 1 } });
    mockedAddMatchPlayer.mockResolvedValue({ success: true });

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());
    formData.append(
      'players',
      JSON.stringify([
        { id: 1, minutes: 90, available: true },
        { id: 2, minutes: 0, available: false },
      ])
    );

    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toEqual([]);
    expect(mockedAddMatch).toHaveBeenCalledWith(null, formData);
    expect(mockedAddMatchPlayer).toHaveBeenCalledTimes(2);
    expect(mockedAddMatchPlayer).toHaveBeenCalledWith({
      matchId: 1,
      userId: 1,
      minutes: 90,
      available: true,
    });
    expect(mockedAddMatchPlayer).toHaveBeenCalledWith({
      matchId: 1,
      userId: 2,
      minutes: 0,
      available: false,
    });
  });

  it('should return errors if adding a player fails', async () => {
    mockedAddMatch.mockResolvedValue({ match: { id: 1 } });
    mockedAddMatchPlayer.mockResolvedValueOnce({
      success: false,
      errors: [
        { message: 'Error adding player', path: ['form'], code: 'custom' },
      ],
    });

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());
    formData.append(
      'players',
      JSON.stringify([{ id: 1, minutes: 90, available: true }])
    );

    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toContainEqual({
      message: 'Error adding player',
      path: ['form'],
      code: 'custom',
    });
    expect(mockedAddMatch).toHaveBeenCalledWith(null, formData);
    expect(mockedAddMatchPlayer).toHaveBeenCalledTimes(1);
  });

  it('should return errors if match creation fails', async () => {
    mockedAddMatch.mockResolvedValue({
      errors: [
        { message: 'Failed to create match', path: ['form'], code: 'custom' },
      ],
    });

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());
    formData.append('players', JSON.stringify([]));

    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toContainEqual({
      message: 'Failed to create match',
      path: ['form'],
      code: 'custom',
    });
    expect(mockedAddMatch).toHaveBeenCalledWith(null, formData);
    expect(mockedAddMatchPlayer).not.toHaveBeenCalled();
  });
});
