jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
import Pusher from 'pusher-js';

import { failedPusherAuthMessage } from '@/strings/serverStrings';
import { Message, Sender, PusherEventMessage } from '@/types/message-types';
import {
  handleTriggerNewMessageEvent,
  handleInitializePusher,
} from '@/utils/pusherUtils';

import pusher from '../src/lib/pusher';

const mockPusherInstance = {
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  disconnect: jest.fn(),
};

let lastOptions: any;

jest.mock('pusher-js', () => {
  return jest.fn().mockImplementation((key, options) => {
    lastOptions = options;
    return mockPusherInstance;
  });
});

jest.mock('../src/lib/pusher', () => ({
  trigger: jest.fn(),
}));

describe('Pusher Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    lastOptions = undefined;
  });

  const messageString = 'new-message';

  describe('handleTriggerNewMessageEvent', () => {
    it('should call pusher.trigger with correct parameters for a group chat', async () => {
      const message: Message = {
        id: 1,
        content: 'Hello, world!',
        sender: { id: 2, username: 'JohnDoe' },
        createdAt: new Date(),
      };
      const sender: Sender = { id: 2, username: 'JohnDoe' };

      await handleTriggerNewMessageEvent(message, sender);

      expect(pusher.trigger).toHaveBeenCalledWith(
        ['chat'],
        messageString,
        expect.objectContaining({
          id: 1,
          content: 'Hello, world!',
          sender: { id: 2, username: 'JohnDoe' },
          createdAt: message.createdAt,
          recipientId: null,
        })
      );
    });

    it('should call pusher.trigger with correct parameters for a private chat', async () => {
      const message: Message = {
        id: 1,
        content: 'Private Message',
        sender: { id: 3, username: 'JaneDoe' },
        createdAt: new Date(),
      };
      const sender: Sender = { id: 3, username: 'JaneDoe' };
      const recipientId = 5;

      await handleTriggerNewMessageEvent(message, sender, recipientId);

      expect(pusher.trigger).toHaveBeenCalledWith(
        ['private-chat-5', 'private-chat-3'],
        messageString,
        expect.objectContaining({
          id: 1,
          content: 'Private Message',
          sender: { id: 3, username: 'JaneDoe' },
          createdAt: message.createdAt,
          recipientId: 5,
        })
      );
    });
  });

  describe('handleInitializePusher', () => {
    let onMessageReceived: jest.Mock;
    let groupChannelMock: { bind: jest.Mock; unbind: jest.Mock };
    let privateChannelMock: { bind: jest.Mock; unbind: jest.Mock };

    beforeEach(() => {
      onMessageReceived = jest.fn();
      groupChannelMock = { bind: jest.fn(), unbind: jest.fn() };
      privateChannelMock = { bind: jest.fn(), unbind: jest.fn() };

      (mockPusherInstance.subscribe as jest.Mock).mockImplementation(
        (channelName: string) => {
          if (channelName === 'chat') {
            return groupChannelMock;
          }
          if (channelName.startsWith('private-chat-')) {
            return privateChannelMock;
          }
          return null;
        }
      );
    });

    it('should subscribe and bind to the "chat" channel when no userId is provided', () => {
      const cleanup = handleInitializePusher(onMessageReceived);

      expect(mockPusherInstance.subscribe).toHaveBeenCalledWith('chat');
      expect(groupChannelMock.bind).toHaveBeenCalledWith(
        messageString,
        expect.any(Function)
      );

      const newMessageCallback = groupChannelMock.bind.mock.calls[0][1];
      const dummyData: PusherEventMessage = {
        id: 123,
        content: 'Test message',
        sender: { id: 1, username: 'TestUser' },
        createdAt: '2021-01-01T00:00:00Z',
      };
      newMessageCallback(dummyData);
      expect(onMessageReceived).toHaveBeenCalledWith(dummyData);

      cleanup();
      expect(groupChannelMock.unbind).toHaveBeenCalledWith(
        messageString,
        onMessageReceived
      );
      expect(mockPusherInstance.unsubscribe).toHaveBeenCalledWith('chat');
    });

    it('should subscribe and bind to both "chat" and private channels when a userId is provided', () => {
      const userId = 42;
      const cleanup = handleInitializePusher(onMessageReceived, userId);

      expect(mockPusherInstance.subscribe).toHaveBeenCalledWith('chat');
      expect(mockPusherInstance.subscribe).toHaveBeenCalledWith(
        `private-chat-${userId}`
      );

      expect(groupChannelMock.bind).toHaveBeenCalledWith(
        messageString,
        expect.any(Function)
      );
      expect(privateChannelMock.bind).toHaveBeenCalledWith(
        messageString,
        expect.any(Function)
      );

      const privateMessageCallback = privateChannelMock.bind.mock.calls[0][1];
      const dummyPrivateData: PusherEventMessage = {
        id: 456,
        content: 'Private test',
        sender: { id: 2, username: 'PrivateUser' },
        createdAt: '2021-01-02T00:00:00Z',
      };
      privateMessageCallback(dummyPrivateData);
      expect(onMessageReceived).toHaveBeenCalledWith(dummyPrivateData);

      cleanup();
      expect(groupChannelMock.unbind).toHaveBeenCalledWith(
        messageString,
        onMessageReceived
      );
      expect(privateChannelMock.unbind).toHaveBeenCalledWith(
        messageString,
        onMessageReceived
      );
      expect(mockPusherInstance.unsubscribe).toHaveBeenCalledWith('chat');
      expect(mockPusherInstance.unsubscribe).toHaveBeenCalledWith(
        `private-chat-${userId}`
      );
    });

    it('should set Pusher.logToConsole to true', () => {
      handleInitializePusher(onMessageReceived);
      expect(Pusher.logToConsole).toBe(true);
    });

    describe('authorizer', () => {
      const fakeChannel = { name: 'private-chat-123' };

      const fakeSocketId = 'fake-socket-id';

      afterEach(() => {
        if (global.fetch && (global.fetch as jest.Mock).mockRestore) {
          (global.fetch as jest.Mock).mockRestore();
        }
      });

      it('should authorize successfully when fetch returns 200 with valid JSON', async () => {
        const fakeAuthData = { auth: 'someAuthData' };
        global.fetch = jest.fn().mockResolvedValue({
          status: 200,
          json: jest.fn().mockResolvedValue(fakeAuthData),
        });

        handleInitializePusher(onMessageReceived);
        expect(lastOptions).toBeDefined();
        const authorizer = lastOptions.authorizer;
        expect(authorizer).toBeDefined();

        const authObj = authorizer(fakeChannel);
        expect(authObj.authorize).toBeDefined();

        await new Promise<void>((resolve, reject) => {
          authObj.authorize(fakeSocketId, (err: any, data: any) => {
            try {
              expect(err).toBeNull();
              expect(data).toEqual(fakeAuthData);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });

        expect(global.fetch).toHaveBeenCalledWith(
          '/api/pusher/auth',
          expect.objectContaining({
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
              socket_id: fakeSocketId,
              channel_name: fakeChannel.name,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      });

      it('should call callback with error when fetch returns a non-200 status', async () => {
        const fakeResponse = {
          status: 400,
          statusText: 'Bad Request',
        };
        global.fetch = jest.fn().mockResolvedValue(fakeResponse);

        handleInitializePusher(onMessageReceived);
        const authorizer = lastOptions.authorizer;
        const authObj = authorizer(fakeChannel);

        await new Promise<void>((resolve, reject) => {
          authObj.authorize(fakeSocketId, (err: any, data: any) => {
            try {
              expect(err).toBeInstanceOf(Error);
              expect(err.message).toEqual(
                `${failedPusherAuthMessage}: ${fakeResponse.statusText}`
              );
              expect(data).toBeNull();
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
      });

      it('should call callback with error when fetch rejects', async () => {
        const fakeError = new Error('Network error');
        global.fetch = jest.fn().mockRejectedValue(fakeError);

        handleInitializePusher(onMessageReceived);
        const authorizer = lastOptions.authorizer;
        const authObj = authorizer(fakeChannel);

        await new Promise<void>((resolve, reject) => {
          authObj.authorize(fakeSocketId, (err: any, data: any) => {
            try {
              expect(err).toBe(fakeError);
              expect(data).toBeNull();
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
      });
    });
  });
});
