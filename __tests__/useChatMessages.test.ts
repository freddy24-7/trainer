import { renderHook, act } from '@testing-library/react';

import {
  useChatMessages,
  handleIncomingMessage,
} from '@/hooks/useChatMessages';
import { PusherEventMessage, Message } from '@/types/message-types';

const mockUnsubscribe = jest.fn();

jest.mock('../src/utils/chatUtils', () => ({
  subscribeToPusherEvents: jest.fn(() => mockUnsubscribe),
  handleIncomingMessage: jest.requireActual('../src/utils/chatUtils')
    .handleIncomingMessage,
}));

describe('useChatMessages', () => {
  const mockSetLoading = jest.fn();
  const mockInitialMessages: Message[] = [
    {
      id: 1,
      content: 'Hello!',
      sender: { id: 1, username: 'Alice' },
      createdAt: new Date('2025-02-12T10:00:00Z'),
      videoUrl: null,
      recipientId: 2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with given messages', () => {
    const { result } = renderHook(() =>
      useChatMessages(1, mockInitialMessages, mockSetLoading)
    );

    expect(result.current.messages).toEqual(mockInitialMessages);
  });

  it('should correctly handle incoming messages using handleIncomingMessage', () => {
    const { result } = renderHook(() => useChatMessages(1, [], mockSetLoading));

    const newMessage: PusherEventMessage = {
      id: 2,
      content: 'New Message',
      sender: { id: 2, username: 'Bob' },
      createdAt: new Date().toISOString(),
      videoUrl: null,
      recipientId: 1,
    };

    act(() => {
      handleIncomingMessage(newMessage, result.current.setMessages, new Set());
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toEqual({
      id: 2,
      content: 'New Message',
      sender: { id: 2, username: 'Bob' },
      createdAt: expect.any(Date),
      videoUrl: null,
      recipientId: 1,
    });
  });

  it('should prevent duplicate incoming messages', () => {
    const { result } = renderHook(() => useChatMessages(1, [], mockSetLoading));

    const newMessage: PusherEventMessage = {
      id: 3,
      content: 'Duplicate Message',
      sender: { id: 2, username: 'Bob' },
      createdAt: new Date().toISOString(),
      videoUrl: null,
      recipientId: 1,
    };

    act(() => {
      handleIncomingMessage(newMessage, result.current.setMessages, new Set());
    });

    act(() => {
      handleIncomingMessage(newMessage, result.current.setMessages, new Set());
    });

    expect(result.current.messages).toHaveLength(1);
  });

  it('should handle deleting a message', () => {
    const { result } = renderHook(() =>
      useChatMessages(1, mockInitialMessages, mockSetLoading)
    );

    act(() => {
      result.current.handleDeleteMessage(1);
    });

    expect(result.current.messages).toHaveLength(0);
  });

  it('should add an optimistic message', () => {
    const { result } = renderHook(() => useChatMessages(1, [], mockSetLoading));

    const optimisticMessage: Message = {
      id: -1,
      content: 'Optimistic message',
      sender: { id: 1, username: 'You' },
      createdAt: new Date(),
      videoUrl: null,
      recipientId: 2,
    };

    act(() => {
      result.current.addOptimisticMessage(optimisticMessage);
    });

    expect(result.current.messages).toContainEqual(optimisticMessage);
  });

  it('should replace an optimistic message with a confirmed message', () => {
    const { result } = renderHook(() => useChatMessages(1, [], mockSetLoading));

    const temporaryId = -1;
    const optimisticMessage: Message = {
      id: temporaryId,
      content: 'Optimistic message',
      sender: { id: 1, username: 'You' },
      createdAt: new Date(),
      videoUrl: null,
      recipientId: 2,
    };

    const confirmedMessage: Message = {
      ...optimisticMessage,
      id: 3,
    };

    act(() => {
      result.current.addOptimisticMessage(optimisticMessage);
    });

    act(() => {
      result.current.replaceOptimisticMessage(temporaryId, confirmedMessage);
    });

    expect(result.current.messages).toContainEqual(confirmedMessage);
    expect(result.current.messages).not.toContainEqual(optimisticMessage);
  });

  it('should call unsubscribe on component unmount', () => {
    const { unmount } = renderHook(() =>
      useChatMessages(1, [], mockSetLoading)
    );

    expect(mockUnsubscribe).not.toHaveBeenCalled();

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
