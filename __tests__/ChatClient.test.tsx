import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { act } from 'react';
import { toast } from 'react-toastify';

import ChatClient from '@/components/chat/ChatClient';

const placeholderText = 'Type your message...';
const sendButtonText = 'Send';
const newMessageText = 'New message';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockSubscribe = jest.fn(() => ({
  bind: jest.fn(),
  unbind: jest.fn(),
}));

const mockPusherInstance = {
  subscribe: mockSubscribe,
  unsubscribe: jest.fn(),
  disconnect: jest.fn(),
};

jest.mock('pusher-js', () => {
  return jest.fn(() => mockPusherInstance);
});

describe('ChatClient', () => {
  const mockAction = jest.fn();

  const mockUser = {
    id: '1',
    username: 'testuser',
  };

  const mockMessages = [
    {
      id: 1,
      content: 'Hello',
      sender: { id: 2, username: 'anotheruser' },
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat messages after loading', async () => {
    render(
      <ChatClient
        signedInUser={mockUser}
        messages={mockMessages}
        action={mockAction}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('anotheruser')).toBeInTheDocument();
    });
  });

  it('displays error toast when attempting to send an empty message', async () => {
    render(
      <ChatClient
        signedInUser={mockUser}
        messages={mockMessages}
        action={mockAction}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(placeholderText), {
      target: { value: '   ' },
    });
    fireEvent.submit(screen.getByPlaceholderText(placeholderText));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Message cannot be empty.');
    });
  });

  it('calls the action with correct data when sending a message', async () => {
    mockAction.mockResolvedValue({ success: true });
    render(
      <ChatClient
        signedInUser={mockUser}
        messages={mockMessages}
        action={mockAction}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(placeholderText), {
      target: { value: newMessageText },
    });
    fireEvent.click(screen.getByText(sendButtonText));

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledWith({}, expect.any(FormData));
    });

    const formData = mockAction.mock.calls[0][1];
    expect(formData.get('content')).toBe(newMessageText);
    expect(formData.get('senderId')).toBe('1');
  });

  it('shows success toast when message is sent successfully', async () => {
    mockAction.mockResolvedValue({ success: true });
    render(
      <ChatClient
        signedInUser={mockUser}
        messages={mockMessages}
        action={mockAction}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(placeholderText), {
      target: { value: newMessageText },
    });
    fireEvent.click(screen.getByText(sendButtonText));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Message sent!');
    });
  });

  it('shows error toast when message sending fails', async () => {
    mockAction.mockResolvedValue({
      success: false,
      errors: [{ message: 'Invalid message' }],
    });
    render(
      <ChatClient
        signedInUser={mockUser}
        messages={mockMessages}
        action={mockAction}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(placeholderText), {
      target: { value: newMessageText },
    });
    fireEvent.click(screen.getByText(sendButtonText));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to send message: Invalid message'
      );
    });
  });

  it('handles Pusher events and updates message list', async () => {
    const mockPusherEvent = {
      id: 2,
      content: newMessageText,
      sender: { id: 3, username: 'pusheruser' },
      createdAt: new Date().toISOString(),
    };

    const mockBind = jest.fn();
    mockSubscribe.mockReturnValue({
      bind: mockBind,
      unbind: jest.fn(),
    });

    render(
      <ChatClient
        signedInUser={mockUser}
        messages={mockMessages}
        action={mockAction}
      />
    );

    await waitFor(() => {
      expect(mockBind).toHaveBeenCalledWith(
        'new-message',
        expect.any(Function)
      );
    });

    const pusherCallback = mockBind.mock.calls[0][1];
    await act(() => Promise.resolve(pusherCallback(mockPusherEvent)));

    await waitFor(() => {
      expect(screen.getByText(newMessageText)).toBeInTheDocument();
      expect(screen.getByText('pusheruser')).toBeInTheDocument();
    });
  });
});
