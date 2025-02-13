jest.spyOn(console, 'error').mockImplementation(() => {});

import {
  handleFindPlayerById,
  deletePlayerFromDatabase,
  deleteClerkUser,
} from '@/lib/services/deletePlayerService';
import {
  playerNotFoundOrMissingClerkId,
  errorDeletingPlayer,
} from '@/strings/actionStrings';

import deletePlayer from '../src/app/actions/deletePlayer';

jest.mock('../src/lib/services/deletePlayerService', () => ({
  handleFindPlayerById: jest.fn(),
  deletePlayerFromDatabase: jest.fn(),
  deleteClerkUser: jest.fn(),
}));

jest.mock('../src/utils/errorUtils', () => ({
  formatStringError: jest.fn((message) => ({
    success: false,
    errors: message,
  })),
}));

describe('deletePlayer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if the player is not found or Clerk ID is missing', async () => {
    (handleFindPlayerById as jest.Mock).mockResolvedValue(null);

    const result = await deletePlayer(1);

    expect(result).toEqual({
      success: false,
      errors: playerNotFoundOrMissingClerkId,
    });
    expect(deleteClerkUser).not.toHaveBeenCalled();
    expect(deletePlayerFromDatabase).not.toHaveBeenCalled();
  });

  it('should delete the player successfully from both Clerk and the database', async () => {
    const mockPlayer = {
      clerkId: 'clerkId123',
    };
    (handleFindPlayerById as jest.Mock).mockResolvedValue(mockPlayer);

    const result = await deletePlayer(1);

    expect(deleteClerkUser).toHaveBeenCalledWith('clerkId123');
    expect(deletePlayerFromDatabase).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      success: true,
      errors: undefined,
    });
  });

  it('should handle errors when deleting the player from Clerk or the database', async () => {
    const mockPlayer = {
      clerkId: 'clerkId123',
    };
    (handleFindPlayerById as jest.Mock).mockResolvedValue(mockPlayer);
    (deleteClerkUser as jest.Mock).mockRejectedValue(
      new Error('Clerk deletion failed')
    );

    const result = await deletePlayer(1);

    expect(deleteClerkUser).toHaveBeenCalledWith('clerkId123');
    expect(deletePlayerFromDatabase).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      errors: errorDeletingPlayer,
    });
  });

  it('should handle errors when deleting the player from the database', async () => {
    const mockPlayer = {
      clerkId: 'clerkId123',
    };
    (handleFindPlayerById as jest.Mock).mockResolvedValue(mockPlayer);
    (deleteClerkUser as jest.Mock).mockResolvedValue(undefined);
    (deletePlayerFromDatabase as jest.Mock).mockRejectedValue(
      new Error('Database deletion failed')
    );

    const result = await deletePlayer(1);

    expect(deleteClerkUser).toHaveBeenCalledWith('clerkId123');
    expect(deletePlayerFromDatabase).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      success: false,
      errors: errorDeletingPlayer,
    });
  });
});
