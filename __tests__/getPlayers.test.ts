import { getPlayers } from '@/app/actions/getPlayers';
import { fetchPlayersFromDB } from '@/lib/services/prismaPlayerService';
import { createSuccessResponse, handleError } from '@/utils/responseUtils';

const errorFetchingPlayers = 'Error fetching players.';

jest.mock('@/lib/services/prismaPlayerService', () => ({
  fetchPlayersFromDB: jest.fn(),
}));

jest.mock('@/utils/responseUtils', () => ({
  createSuccessResponse: jest.fn(),
  handleError: jest.fn(),
}));

describe('getPlayers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return players successfully', async () => {
    const mockPlayers = [
      { id: 1, username: 'player1', whatsappNumber: '1234567890' },
      { id: 2, username: 'player2', whatsappNumber: '0987654321' },
    ];

    (fetchPlayersFromDB as jest.Mock).mockResolvedValue(mockPlayers);
    (createSuccessResponse as jest.Mock).mockReturnValue({
      success: true,
      players: mockPlayers,
    });

    const result = await getPlayers();

    expect(fetchPlayersFromDB).toHaveBeenCalled();
    expect(createSuccessResponse).toHaveBeenCalledWith(mockPlayers);
    expect(result).toEqual({ success: true, players: mockPlayers });
  });

  it('should return an empty list if no players are found', async () => {
    (fetchPlayersFromDB as jest.Mock).mockResolvedValue([]);
    (createSuccessResponse as jest.Mock).mockReturnValue({
      success: true,
      players: [],
    });

    const result = await getPlayers();

    expect(fetchPlayersFromDB).toHaveBeenCalled();
    expect(createSuccessResponse).toHaveBeenCalledWith([]);
    expect(result).toEqual({ success: true, players: [] });
  });

  it('should handle errors when fetching players', async () => {
    (fetchPlayersFromDB as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );
    (handleError as jest.Mock).mockReturnValue({
      success: false,
      error: errorFetchingPlayers,
    });

    const result = await getPlayers();

    expect(fetchPlayersFromDB).toHaveBeenCalled();
    expect(handleError).toHaveBeenCalledWith(errorFetchingPlayers);
    expect(result).toEqual({
      success: false,
      error: errorFetchingPlayers,
    });
  });
});
