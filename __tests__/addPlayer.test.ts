import addPlayer from '@/app/actions/addPlayer';
import prisma from '@/lib/prisma';
import { users } from '@clerk/clerk-sdk-node';
import { revalidatePath } from 'next/cache';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
    },
  },
}));

jest.mock('@clerk/clerk-sdk-node', () => ({
  __esModule: true,
  users: {
    createUser: jest.fn(),
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addPlayer Functionality Tests', () => {
  const formDataSetup = (username?: string, password?: string) => {
    const formData = new FormData();
    if (username) formData.append('username', username);
    if (password) formData.append('password', password);
    return formData;
  };

  it('should create a player successfully with valid input', async () => {
    const createUserMock = users.createUser as jest.Mock;
    const createUserInDBMock = prisma.user.create as jest.Mock;
    const revalidatePathMock = revalidatePath as jest.Mock;

    createUserMock.mockResolvedValue({ id: 'clerk-123' });
    createUserInDBMock.mockResolvedValue({
      id: 1,
      username: 'testplayer',
      clerkId: 'clerk-123',
      role: 'PLAYER',
      createdAt: new Date(),
    });

    const formData = formDataSetup('testplayer', 'SecurePassword@1');

    const result = await addPlayer({}, formData);

    expect(result).toEqual({ errors: [], success: true });
    expect(createUserMock).toHaveBeenCalledWith({
      username: 'testplayer',
      password: 'SecurePassword@1',
    });
    expect(createUserInDBMock).toHaveBeenCalledWith({
      data: {
        clerkId: 'clerk-123',
        username: 'testplayer',
        role: 'PLAYER',
        createdAt: expect.any(Date),
      },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith('/player-management');
  });

  it('should return validation errors when username is missing', async () => {
    const formData = formDataSetup(undefined, 'SecurePassword@1');

    const result = await addPlayer({}, formData);

    expect(result.errors).toBeInstanceOf(Array);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].message).toBe('Expected string, received null');
  });

  it('should return an error when Clerk user creation fails', async () => {
    const createUserMock = users.createUser as jest.Mock;
    createUserMock.mockRejectedValue(new Error('Clerk error'));

    const formData = formDataSetup('testplayer', 'SecurePassword@1');

    const result = await addPlayer({}, formData);

    expect(result).toEqual({
      errors: [
        {
          message: 'Error registering the player.',
          path: ['form'],
          code: 'custom',
        },
      ],
    });
    expect(createUserMock).toHaveBeenCalledTimes(1);
  });
});
