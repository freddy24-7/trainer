import { users } from '@clerk/clerk-sdk-node';
import { revalidatePath } from 'next/cache';

import addPlayer from '@/app/actions/addPlayer';
import prisma from '@/lib/prisma';

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

beforeEach((): void => {
  jest.clearAllMocks();
});

describe('addPlayer Functionality Tests', () => {
  const testUsername = 'testplayer';
  const testPassword = 'SecurePassword@1';
  const validWhatsappNumber = '+31612345678';
  const invalidWhatsappNumber = 'invalidNumber';
  const clerkId = 'clerk-123';

  const formDataSetup = (
    username?: string,
    password?: string,
    whatsappNumber?: string
  ): FormData => {
    const formData = new FormData();
    if (username) formData.append('username', username);
    if (password) formData.append('password', password);
    if (whatsappNumber) formData.append('whatsappNumber', whatsappNumber);
    return formData;
  };

  it('should create a player successfully with valid input', async (): Promise<void> => {
    const createUserMock = users.createUser as jest.Mock;
    const createUserInDBMock = prisma.user.create as jest.Mock;
    const revalidatePathMock = revalidatePath as jest.Mock;

    createUserMock.mockResolvedValue({ id: clerkId });
    createUserInDBMock.mockResolvedValue({
      id: 1,
      username: testUsername,
      clerkId,
      whatsappNumber: validWhatsappNumber,
      role: 'PLAYER',
      createdAt: new Date(),
    });

    const formData = formDataSetup(
      testUsername,
      testPassword,
      validWhatsappNumber
    );

    const result = await addPlayer({}, formData);

    expect(result).toEqual({ errors: [], success: true });
    expect(createUserMock).toHaveBeenCalledWith({
      username: testUsername,
      password: testPassword,
    });
    expect(createUserInDBMock).toHaveBeenCalledWith({
      data: {
        clerkId,
        username: testUsername,
        whatsappNumber: validWhatsappNumber,
        role: 'PLAYER',
        createdAt: expect.any(Date),
      },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith('/player-management');
  });

  it('should return validation errors when whatsappNumber is invalid', async (): Promise<void> => {
    const formData = formDataSetup(
      testUsername,
      testPassword,
      invalidWhatsappNumber
    );

    const result = await addPlayer({}, formData);

    expect(result.errors).toBeInstanceOf(Array);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].message).toBe(
      'Please enter a valid WhatsApp number (including country code)'
    );
    expect(result.errors[0].path).toContain('whatsappNumber');
  });

  it('should return validation errors when username is missing', async (): Promise<void> => {
    const formData = formDataSetup(
      undefined,
      testPassword,
      validWhatsappNumber
    );

    const result = await addPlayer({}, formData);

    expect(result.errors).toBeInstanceOf(Array);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].message).toContain(
      'Expected string, received null'
    );
    expect(result.errors[0].path).toContain('username');
  });

  it('should return an error when Clerk user creation fails', async (): Promise<void> => {
    const createUserMock = users.createUser as jest.Mock;
    createUserMock.mockRejectedValue(new Error('Clerk error'));

    const formData = formDataSetup(
      testUsername,
      testPassword,
      validWhatsappNumber
    );

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
