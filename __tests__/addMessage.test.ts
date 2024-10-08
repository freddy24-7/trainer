import { ZodIssue } from 'zod';

import addMessage from '@/app/actions/addMessage';
import prisma from '@/lib/prisma';
import pusher from '@/lib/pusher';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    message: {
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/lib/pusher', () => ({
  __esModule: true,
  default: {
    trigger: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const helloWorld = 'Hello, World!';
const senderId = '1';
const invalidSenderId = 'invalidSenderId';
const errorSendingMessage = 'Error sending the message.';
const formPath = ['form'];

const mockMessage = {
  id: 1,
  content: helloWorld,
  senderId: 1,
  createdAt: new Date(),
};

const mockUser = {
  id: 1,
  username: 'testuser',
};

const formDataSetup = (content?: string, senderId?: string): FormData => {
  const formData = new FormData();
  if (content) formData.append('content', content);
  if (senderId) formData.append('senderId', senderId);
  return formData;
};

const messageCreateMock = prisma.message.create as jest.Mock;
const userFindUniqueMock = prisma.user.findUnique as jest.Mock;
const pusherTriggerMock = pusher.trigger as jest.Mock;

const setupMocks = (options?: {
  rejectMessageCreate?: boolean;
  rejectPusherTrigger?: boolean;
}): void => {
  if (options?.rejectMessageCreate) {
    messageCreateMock.mockRejectedValue(new Error('Database error'));
  } else {
    messageCreateMock.mockResolvedValue(mockMessage);
  }

  if (options?.rejectPusherTrigger) {
    pusherTriggerMock.mockRejectedValue(new Error('Pusher error'));
  } else {
    pusherTriggerMock.mockResolvedValue('pusherResponse');
  }

  userFindUniqueMock.mockResolvedValue(mockUser);
};

interface ActionResponse {
  success: boolean;
  errors?: ZodIssue[];
}

const expectValidationError = (
  result: ActionResponse,
  expectedMessage: string,
  expectedPath: string
): void => {
  expect(result.success).toBe(false);
  if (result.errors) {
    expect(Array.isArray(result.errors)).toBe(true);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].message).toContain(expectedMessage);
    expect(result.errors[0].path).toContain(expectedPath);
  }
};

const performErrorTest = async (
  setupOptions: {
    rejectMessageCreate?: boolean;
    rejectPusherTrigger?: boolean;
  },
  additionalAssertions?: () => void
): Promise<void> => {
  setupMocks(setupOptions);
  const formData = formDataSetup(helloWorld, senderId);

  const result = await addMessage({}, formData);

  expect(result.success).toBe(false);
  if (result.errors) {
    expect(result.errors).toEqual([
      {
        message: errorSendingMessage,
        path: formPath,
        code: 'custom',
      },
    ]);
  }
  expect(messageCreateMock).toHaveBeenCalledTimes(1);

  if (additionalAssertions) {
    additionalAssertions();
  }
};

describe('addMessage Functionality Tests', () => {
  it('should add a message successfully with valid input', async () => {
    setupMocks();
    const formData = formDataSetup(helloWorld, senderId);
    const result = await addMessage({}, formData);
    expect(result).toEqual({ success: true });
    expect(messageCreateMock).toHaveBeenCalledWith({
      data: {
        content: helloWorld,
        senderId: 1,
        createdAt: expect.any(Date),
      },
    });
    expect(userFindUniqueMock).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(pusherTriggerMock).toHaveBeenCalledWith('chat', 'new-message', {
      ...mockMessage,
      sender: mockUser,
    });
  });

  it('should return validation errors when content is missing', async () => {
    const formData = formDataSetup(undefined, senderId);
    const result = await addMessage({}, formData);
    expectValidationError(result, 'Expected string, received null', 'content');
  });

  it('should return validation errors when senderId is not a valid number', async () => {
    const formData = formDataSetup(helloWorld, invalidSenderId);
    const result = await addMessage({}, formData);
    expectValidationError(result, 'Expected number, received nan', 'senderId');
  });

  it('should return an error when Pusher event triggering fails', async () => {
    await performErrorTest({ rejectPusherTrigger: true }, () => {
      expect(pusherTriggerMock).toHaveBeenCalledTimes(1);
    });
  });
});
