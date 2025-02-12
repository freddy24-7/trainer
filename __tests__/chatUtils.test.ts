import React from 'react';

import {
  failedToDeleteVideoMessage,
  failedToDeleteMessageMessage,
} from '@/strings/serverStrings';
import { Message, PusherEventMessage } from '@/types/message-types';
import {
  handleDeleteVideoLocal,
  handleOnDeleteVideo,
  handleOnDeleteMessage,
  handleSendMessage,
  subscribeToPusherEvents,
} from '@/utils/chatUtils';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('../src/utils/pusherUtils', () => ({
  handleInitializePusher: jest.fn(() => jest.fn()),
}));

jest.mock('../src/utils/messageUtils', () => ({
  handleValidateMessage: jest.fn(() => true),
  handlePrepareFormData: jest.fn(() => new FormData()),
  createOptimisticMessage: jest.fn(() => ({
    id: Date.now(),
    content: 'Test message',
    sender: { id: 1, username: 'You' },
    createdAt: new Date(),
  })),
}));

describe('chatUtils', () => {
  let setMessages: jest.Mock;

  beforeEach(() => {
    setMessages = jest.fn();
    jest.clearAllMocks();
  });

  describe('handleDeleteVideoLocal', () => {
    it('removes video URL from the correct message', () => {
      const messages: Message[] = [
        {
          id: 1,
          content: 'Message 1',
          videoUrl: 'video.mp4',
          sender: { id: 1, username: 'User1' },
          createdAt: new Date(),
        },
        {
          id: 2,
          content: 'Message 2',
          videoUrl: null,
          sender: { id: 2, username: 'User2' },
          createdAt: new Date(),
        },
      ];

      setMessages.mockImplementation((fn) => fn(messages));

      handleDeleteVideoLocal(1, setMessages);

      expect(setMessages).toHaveBeenCalledWith(expect.any(Function));
      expect(setMessages.mock.calls[0][0](messages)).toEqual([
        {
          id: 1,
          content: 'Message 1',
          videoUrl: null,
          sender: { id: 1, username: 'User1' },
          createdAt: expect.any(Date),
        },
        {
          id: 2,
          content: 'Message 2',
          videoUrl: null,
          sender: { id: 2, username: 'User2' },
          createdAt: expect.any(Date),
        },
      ]);
    });
  });

  describe('handleOnDeleteVideo', () => {
    it('removes video from the database and updates messages if successful', async () => {
      const deleteVideo = jest.fn().mockResolvedValue({ success: true });

      await handleOnDeleteVideo({
        messageId: 1,
        removeFromDatabase: true,
        deleteVideo,
        signedInUserId: 1,
        setMessages,
      });

      expect(deleteVideo).toHaveBeenCalledWith(1, 1);
      expect(setMessages).toHaveBeenCalled();
    });

    it('logs an error if video deletion fails', async () => {
      const deleteVideo = jest.fn().mockResolvedValue({ success: false });

      console.error = jest.fn();

      await handleOnDeleteVideo({
        messageId: 1,
        removeFromDatabase: true,
        deleteVideo,
        signedInUserId: 1,
        setMessages,
      });

      expect(console.error).toHaveBeenCalledWith(failedToDeleteVideoMessage);
    });
  });

  describe('handleOnDeleteMessage', () => {
    it('deletes message from the database if removeFromDatabase is true', async () => {
      const deleteMessage = jest.fn().mockResolvedValue({ success: true });
      const handleDeleteMessage = jest.fn();

      await handleOnDeleteMessage({
        messageId: 1,
        removeFromDatabase: true,
        deleteMessage,
        signedInUserId: 1,
        handleDeleteMessage,
      });

      expect(deleteMessage).toHaveBeenCalledWith(1, 1);
      expect(handleDeleteMessage).toHaveBeenCalledWith(1, true);
    });

    it('logs an error if message deletion fails', async () => {
      const deleteMessage = jest.fn().mockResolvedValue({ success: false });
      const handleDeleteMessage = jest.fn();

      console.error = jest.fn();

      await handleOnDeleteMessage({
        messageId: 1,
        removeFromDatabase: true,
        deleteMessage,
        signedInUserId: 1,
        handleDeleteMessage,
      });

      expect(console.error).toHaveBeenCalledWith(failedToDeleteMessageMessage);
    });
  });

  describe('handleSendMessage', () => {
    let setMessages: jest.Mock;

    beforeEach(() => {
      setMessages = jest.fn();
    });

    it('sends a message successfully', async () => {
      const e = { preventDefault: jest.fn() } as unknown as React.FormEvent;
      const action = jest.fn().mockResolvedValue({ messageId: 100 });

      const setIsSending = jest.fn();
      const setNewMessage = jest.fn();
      const setSelectedVideo = jest.fn();
      const addOptimisticMessage = jest.fn();
      const replaceOptimisticMessage = jest.fn();

      await handleSendMessage({
        e,
        newMessage: 'Hello',
        selectedVideo: null,
        setIsSending,
        signedInUserId: 1,
        selectedRecipientId: 2,
        action,
        setNewMessage,
        setSelectedVideo,
        setMessages,
        addOptimisticMessage,
        replaceOptimisticMessage,
        videoPublicId: null,
      });

      expect(setIsSending).toHaveBeenCalledWith(true);
      expect(action).toHaveBeenCalled();
      expect(setNewMessage).toHaveBeenCalledWith('');
      expect(setSelectedVideo).toHaveBeenCalledWith(null);
    });

    it('handles errors gracefully', async () => {
      console.error = jest.fn();
      const e = { preventDefault: jest.fn() } as unknown as React.FormEvent;
      const action = jest.fn().mockRejectedValue(new Error('Send failed'));

      const setIsSending = jest.fn();
      const setNewMessage = jest.fn();
      const setSelectedVideo = jest.fn();
      const addOptimisticMessage = jest.fn();
      const replaceOptimisticMessage = jest.fn();

      await handleSendMessage({
        e,
        newMessage: 'Hello',
        selectedVideo: null,
        setIsSending,
        signedInUserId: 1,
        selectedRecipientId: 2,
        action,
        setNewMessage,
        setSelectedVideo,
        setMessages,
        addOptimisticMessage,
        replaceOptimisticMessage,
        videoPublicId: null,
      });

      expect(console.error).toHaveBeenCalledWith(
        'Error sending message:',
        expect.any(Error)
      );
    });
  });

  describe('subscribeToPusherEvents', () => {
    it('subscribes to Pusher and returns a cleanup function', () => {
      const onMessageReceived = jest.fn();
      const onDeleteMessage = jest.fn();
      const setLoading = jest.fn();
      const userId = 1;

      const cleanup = subscribeToPusherEvents({
        onMessageReceived,
        onDeleteMessage,
        setLoading,
        userId,
      });

      expect(setLoading).toHaveBeenCalledWith(false);
      expect(typeof cleanup).toBe('function');
    });

    it('handles incoming Pusher messages correctly', () => {
      const onMessageReceived = jest.fn();
      const onDeleteMessage = jest.fn();
      const setLoading = jest.fn();

      const cleanup = subscribeToPusherEvents({
        onMessageReceived,
        onDeleteMessage,
        setLoading,
        userId: 1,
      });

      const mockData: PusherEventMessage = {
        id: 123,
        recipientId: 1,
        content: 'Test message',
        sender: { id: 2, username: 'User2' },
        createdAt: new Date().toISOString(),
        type: 'new-message',
      };

      onMessageReceived(mockData);

      expect(onMessageReceived).toHaveBeenCalledWith(mockData);

      cleanup();
    });
  });
});
