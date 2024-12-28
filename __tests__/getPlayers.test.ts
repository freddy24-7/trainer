import getPlayers from '../src/app/actions/getPlayers';
import prisma from '../src/lib/prisma';
import { formatError } from '../src/utils/errorUtils';

const errorMessage = 'Fout bij het ophalen van spelers.';

jest.mock('../src/lib/prisma', () => ({
  user: {
    findMany: jest.fn(),
  },
}));

jest.mock('../src/utils/errorUtils', () => ({
  formatError: jest.fn().mockImplementation(() => ({
    errors: [{ message: errorMessage }],
  })),
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
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockPlayers);

    const result = await getPlayers();

    expect(result).toEqual({ success: true, players: mockPlayers });
  });

  it('should return an empty list if no players are found', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getPlayers();

    expect(result).toEqual({ success: true, players: [] });
  });

  it('should handle errors when fetching players', async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    const result = await getPlayers();

    expect(result).toEqual({
      errors: [{ message: errorMessage }],
    });
    expect(formatError).toHaveBeenCalledWith(errorMessage);
  });
});
