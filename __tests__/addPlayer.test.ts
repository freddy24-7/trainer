import { createClerkClient } from '@clerk/backend';

import addPlayer from '../src/app/actions/addPlayer';
import prisma from '../src/lib/prisma';

jest.mock('../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
    },
  },
}));

jest.mock('@clerk/backend', () => ({
  createClerkClient: jest.fn().mockReturnValue({
    users: {
      createUser: jest.fn(),
    },
  }),
}));

jest.mock('../src/utils/errorUtils', () => ({
  formatError: jest.fn().mockReturnValue({
    errors: [
      {
        message: 'Error registering the player.',
        path: ['form'],
        code: 'custom',
      },
    ],
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addPlayer Functionality Tests', () => {
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

  const validWhatsappNumber = '+31612345678';
  const validPassword = 'SecurePassword@1';
  const invalidWhatsappNumber = 'invalidNumber';
  const validUsername = 'testplayer';

  it('should create a player successfully with valid input', async () => {
    const clerkClientMock = createClerkClient as jest.Mock;
    const clerkUsersMock = clerkClientMock().users.createUser as jest.Mock;
    const createUserInDBMock = prisma.user.create as jest.Mock;

    clerkUsersMock.mockResolvedValue({ id: 'clerk-123' });
    createUserInDBMock.mockResolvedValue({
      id: 1,
      username: validUsername,
      clerkId: 'clerk-123',
      whatsappNumber: validWhatsappNumber,
      role: 'PLAYER',
      createdAt: new Date(),
    });

    const formData = formDataSetup(
      validUsername,
      validPassword,
      validWhatsappNumber
    );

    const result = await addPlayer({}, formData);

    expect(result).toEqual({ errors: [], success: true });
    expect(clerkUsersMock).toHaveBeenCalledWith({
      username: validUsername,
      password: validPassword,
    });
    expect(createUserInDBMock).toHaveBeenCalledWith({
      data: {
        clerkId: 'clerk-123',
        username: validUsername,
        whatsappNumber: validWhatsappNumber,
        role: 'PLAYER',
        createdAt: expect.any(Date),
      },
    });
  });

  it('should return validation errors when whatsappNumber is invalid', async () => {
    const formData = formDataSetup(
      validUsername,
      validPassword,
      invalidWhatsappNumber
    );

    const result = await addPlayer({}, formData);

    expect(result.errors).toBeInstanceOf(Array);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].message).toBe(
      'Voer een geldig WhatsApp-nummer in (inclusief landcode)'
    );
    expect(result.errors[0].path).toContain('whatsappNumber');
  });

  it('should return validation errors when username is missing', async () => {
    const formData = formDataSetup(
      undefined,
      validPassword,
      validWhatsappNumber
    );

    const result = await addPlayer({}, formData);

    expect(result.errors).toBeInstanceOf(Array);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].message).toContain(
      'Gebruikersnaam, wachtwoord en WhatsApp-nummer zijn verplicht.'
    );
    expect(result.errors[0].path).toContain('form');
  });

  it('should return an error when Clerk user creation fails', async () => {
    const clerkClientMock = createClerkClient as jest.Mock;
    const clerkUsersMock = clerkClientMock().users.createUser as jest.Mock;

    clerkUsersMock.mockRejectedValue(new Error('Clerk error'));

    const formData = formDataSetup(
      validUsername,
      validPassword,
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
    expect(clerkUsersMock).toHaveBeenCalledTimes(1);
  });
});
