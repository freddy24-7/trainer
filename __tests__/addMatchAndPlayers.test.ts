jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

import { invalidPlayerDataFormatMessage } from '@/strings/serverStrings';
import { formatError } from '@/utils/errorUtils';

import addMatch from '../src/app/actions/addMatch';
import addMatchAndPlayers from '../src/app/actions/addMatchAndPlayers';
import addMatchPlayer from '../src/app/actions/addMatchPlayer';

jest.mock('../src/app/actions/addMatch');
jest.mock('../src/app/actions/addMatchPlayer');

const mockAddMatch = addMatch as jest.Mock;
const mockAddMatchPlayer = addMatchPlayer as jest.Mock;

const createMatchFormData = (
  players: any,
  pouleOpponentId = '1',
  date: string = new Date().toISOString()
): FormData => {
  const formData = new FormData();
  formData.append('pouleOpponentId', pouleOpponentId);
  formData.append('date', date);
  formData.append('players', JSON.stringify(players));
  return formData;
};

const expectUnexpectedPlayerError = (
  result: any,
  expectedMessage: string,
  expectedPath: (string | number)[]
) => {
  expect(result.errors).toBeDefined();
  expect(result.errors.map((e: any) => e.message)).toContain(expectedMessage);
  expect(result.errors[0].path).toEqual(expectedPath);
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addMatchAndPlayers Functionality Tests', () => {
  const playerAdditionErrorMessage = 'Mislukt om speler 1 toe te voegen.';
  const unexpectedPlayerAdditionErrorMessage =
    'Onverwachte fout bij het toevoegen van speler. 1.';

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
      errors: formatError('Mislukt om wedstrijd aan te maken.', ['form'])
        .errors,
    });

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());
    formData.append('players', JSON.stringify([]));

    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toEqual(
      formatError('Mislukt om wedstrijd aan te maken.', ['form']).errors
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
      formatError('Spelersgegevens ontbreken.', ['players']).errors
    );
    expect(mockAddMatchPlayer).not.toHaveBeenCalled();
  });

  it('should return an error if players data is invalid JSON', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());
    formData.append('players', 'invalid JSON string');

    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toBeDefined();
    expect(Array.isArray(result.errors)).toBe(true);
    expect(result.errors[0].path).toEqual(['players']);
    expect(result.errors[0].message).toContain(invalidPlayerDataFormatMessage);
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
      formatError('Spelersgegevens zijn geen array.', ['players']).errors
    );
    expect(mockAddMatchPlayer).not.toHaveBeenCalled();
  });

  it('should handle an error during player addition', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });
    mockAddMatchPlayer.mockResolvedValue({
      errors: formatError(playerAdditionErrorMessage, ['players', 'form'])
        .errors,
    });

    const formData = createMatchFormData([
      { id: 1, minutes: '90', available: true },
    ]);
    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toEqual(
      formatError(playerAdditionErrorMessage, ['players', 'form']).errors
    );
    expect(mockAddMatchPlayer).toHaveBeenCalledTimes(1);
  });

  it('should handle unexpected error during player addition', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });
    mockAddMatchPlayer.mockRejectedValue(new Error('Unexpected error'));

    const formData = createMatchFormData([
      { id: 1, minutes: '90', available: true },
    ]);
    const result = await addMatchAndPlayers(null, formData);

    expectUnexpectedPlayerError(result, unexpectedPlayerAdditionErrorMessage, [
      'players',
      '1',
    ]);
    expect(mockAddMatchPlayer).toHaveBeenCalledTimes(1);
  });

  it('should return an error if an unexpected error occurs during player addition', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });
    mockAddMatchPlayer.mockImplementation(() => {
      throw new Error('Unexpected server error');
    });

    const formData = createMatchFormData([
      { id: 1, minutes: '90', available: true },
    ]);
    const result = await addMatchAndPlayers(null, formData);

    expectUnexpectedPlayerError(result, unexpectedPlayerAdditionErrorMessage, [
      'players',
      '1',
    ]);
    expect(mockAddMatchPlayer).toHaveBeenCalledTimes(1);
  });

  it('should collect player validation errors if player data is invalid', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });

    const formData = new FormData();
    formData.append('pouleOpponentId', '1');
    formData.append('date', new Date().toISOString());
    formData.append(
      'players',
      JSON.stringify([{ id: 1, minutes: 'invalid', available: true }])
    );

    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].message).toContain('Ongeldige minutenwaarde');
    expect(result.errors[0].path).toEqual(['players', 'minutes']);
  });

  it('should push player errors when handleProcessSinglePlayer fails', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });
    mockAddMatchPlayer.mockResolvedValue({
      errors: formatError(playerAdditionErrorMessage, ['players', '1']).errors,
    });

    const formData = createMatchFormData([
      { id: 1, minutes: '90', available: true },
    ]);
    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].message).toContain(playerAdditionErrorMessage);
    expect(result.errors[0].path).toEqual(['players', '1']);
  });

  it('should handle an empty player list gracefully', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });

    const formData = createMatchFormData([]);
    const result = await addMatchAndPlayers(null, formData);

    expect(result.errors).toEqual([]);
    expect(mockAddMatchPlayer).not.toHaveBeenCalled();
  });

  it('should catch and return unexpected errors in handleProcessSinglePlayer', async () => {
    mockAddMatch.mockResolvedValue({ match: { id: 1 } });
    mockAddMatchPlayer.mockRejectedValue(new Error('Database error occurred'));

    const formData = createMatchFormData([
      { id: 1, minutes: '90', available: true },
    ]);
    const result = await addMatchAndPlayers(null, formData);

    expectUnexpectedPlayerError(result, unexpectedPlayerAdditionErrorMessage, [
      'players',
      '1',
    ]);
  });
});
