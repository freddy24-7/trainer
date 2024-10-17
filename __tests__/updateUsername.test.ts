import { updateUsername } from '@/app/actions/updateUsername';
import {
  findUserByClerkId,
  updateUserUsername,
} from '@/lib/services/updateUserService';

jest.mock('@/lib/services/updateUserService', () => ({
  findUserByClerkId: jest.fn(),
  updateUserUsername: jest.fn(),
}));

jest.mock('@/utils/errorUtils', () => ({
  formatError: jest.fn((message, path, code, includeSuccess) => ({
    success: includeSuccess ? false : undefined,
    errors: [{ message, path, code }],
  })),
}));

describe('updateUsername', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if the user is not found', async () => {
    (findUserByClerkId as jest.Mock).mockResolvedValue(null);

    const result = await updateUsername('clerkId123', 'newUsername');

    expect(result).toEqual({
      success: false,
      errors: [
        {
          message: 'User not found',
          path: ['clerkId'],
          code: 'custom',
        },
      ],
    });
    expect(updateUserUsername).not.toHaveBeenCalled();
  });

  it('should update the username if it is different from the current one', async () => {
    const mockUser = {
      clerkId: 'clerkId123',
      username: 'oldUsername',
    };
    (findUserByClerkId as jest.Mock).mockResolvedValue(mockUser);

    const result = await updateUsername('clerkId123', 'newUsername');

    expect(updateUserUsername).toHaveBeenCalledWith(
      'clerkId123',
      'newUsername'
    );
    expect(result).toEqual({
      success: true,
    });
  });

  it('should not update the username if it is the same as the current one', async () => {
    const mockUser = {
      clerkId: 'clerkId123',
      username: 'sameUsername',
    };
    (findUserByClerkId as jest.Mock).mockResolvedValue(mockUser);

    const result = await updateUsername('clerkId123', 'sameUsername');

    expect(updateUserUsername).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
    });
  });

  it('should handle errors during the username update process', async () => {
    const mockUser = {
      clerkId: 'clerkId123',
      username: 'oldUsername',
    };
    (findUserByClerkId as jest.Mock).mockResolvedValue(mockUser);

    (updateUserUsername as jest.Mock).mockRejectedValue(
      new Error('Database update error')
    );

    const result = await updateUsername('clerkId123', 'newUsername');

    expect(updateUserUsername).toHaveBeenCalledWith(
      'clerkId123',
      'newUsername'
    );
    expect(result).toEqual({
      success: false,
      errors: [
        {
          message: 'Error updating username',
          path: ['username'],
          code: 'custom',
        },
      ],
    });
  });
});
