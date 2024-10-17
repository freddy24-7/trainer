import addMatchAndPlayers from '@/app/actions/addMatchAndPlayers';
import addMatch from '@/app/actions/addMatch';
import addMatchPlayer from '@/app/actions/addMatchPlayer';
import { formatError } from '@/utils/errorUtils';

jest.mock('@/app/actions/addMatch');
jest.mock('@/app/actions/addMatchPlayer');

const mockAddMatch = addMatch as jest.Mock;
const mockAddMatchPlayer = addMatchPlayer as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addMatchAndPlayers Functionality Tests', () => {
  it('should successfully create a match and add players', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });
    mockAddMatchPlayer.mockResolvedValue({ success: true });

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());
    formData.append(
      'players',
      JSON.stringify([
        { id: 1, minutes: '90', available: true },
        { id: 2, minutes: '45', available: true },
      ])
    );

    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toEqual([]);
    expect(mockAddMatch).toHaveBeenCalled();
    expect(mockAddMatchPlayer).toHaveBeenCalledTimes(2);
  });

  it('should return an error if match creation fails', async () => {
    mockAddMatch.mockResolvedValue({
      errors: formatError('Failed to create match.', ['form']).errors,
    });

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());
    formData.append('players', JSON.stringify([]));

    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toEqual(
      formatError('Failed to create match.', ['form']).errors
    );
    expect(mockAddMatchPlayer).not.toHaveBeenCalled();
  });

  it('should return an error if players data is missing', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());

    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toEqual(
      formatError('Players data is missing.', ['players']).errors
    );
    expect(mockAddMatchPlayer).not.toHaveBeenCalled();
  });

  it('should return an error if players data is invalid JSON', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());
    formData.append('players', 'invalid json string');

    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors[0].message).toContain('Invalid player data format');
    expect(result.errors[0].path).toEqual(['players']);
  });

  it('should return an error if players data is not an array', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());
    formData.append(
      'players',
      JSON.stringify({ id: 1, minutes: '90', available: true })
    );

    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toEqual(
      formatError('Players data is not an array.', ['players']).errors
    );
    expect(mockAddMatchPlayer).not.toHaveBeenCalled();
  });

  it('should return an error if a player has invalid minutes', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());
    formData.append(
      'players',
      JSON.stringify([{ id: 1, minutes: 'invalid', available: true }])
    );

    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toEqual(
      formatError('Invalid minutes for player 1. Expected a number.', [
        'players',
        'minutes',
      ]).errors
    );
    expect(mockAddMatchPlayer).not.toHaveBeenCalled();
  });

  it('should handle an error during player addition', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });
    mockAddMatchPlayer.mockResolvedValue({
      errors: formatError('Failed to add player 1.', ['players', 'form'])
        .errors,
    });

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());
    formData.append(
      'players',
      JSON.stringify([{ id: 1, minutes: '90', available: true }])
    );

    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toEqual(
      formatError('Failed to add player 1.', ['players', 'form']).errors
    );
    expect(mockAddMatchPlayer).toHaveBeenCalledTimes(1);
  });

  it('should handle unexpected error during player addition', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });
    mockAddMatchPlayer.mockRejectedValue(new Error('Unexpected error'));

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());
    formData.append(
      'players',
      JSON.stringify([{ id: 1, minutes: '90', available: true }])
    );

    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toEqual(
      formatError('Unexpected error adding player 1.', ['players', '1']).errors
    );
    expect(mockAddMatchPlayer).toHaveBeenCalledTimes(1);
  });
});
