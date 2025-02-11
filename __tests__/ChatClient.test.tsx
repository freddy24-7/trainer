import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('pusher-js', () => {
  return jest.fn().mockImplementation(() => ({
    subscribe: jest.fn(),
    bind: jest.fn(),
    unbind: jest.fn(),
    unsubscribe: jest.fn(),
    disconnect: jest.fn(),
  }));
});

jest.mock('../src/utils/pusherUtils', () => ({
  handleInitializePusher: jest.fn().mockReturnValue(() => {}),
}));

jest.mock('../src/utils/chatUtils', () => {
  const actualChatUtils = jest.requireActual('../src/utils/chatUtils');
  return {
    ...actualChatUtils,
    handleOnDeleteMessage: jest.fn(),
    handleOnDeleteVideo: jest.fn(),
    handleSendMessage: jest.fn(),
  };
});

import ChatClient from '../src/app/chat/ChatClient';
import { SignedInUser, ChatUser, Message } from '../src/types/message-types';
import * as chatUtils from '../src/utils/chatUtils';

const mockSignedInUser: SignedInUser = {
  id: 1,
  username: 'TestUser',
};

const mockUsers: ChatUser[] = [
  { id: 2, username: 'Recipient1' },
  { id: 3, username: 'Recipient2' },
];

const mockMessages: Message[] = [
  {
    id: 1,
    content: 'Hello!',
    sender: { id: 1, username: 'TestUser' },
    createdAt: new Date(),
    recipientId: 2,
  },
  {
    id: 2,
    content: 'Hi!',
    sender: { id: 2, username: 'Recipient1' },
    createdAt: new Date(),
    recipientId: 1,
  },
];

const messageWithVideo: Message = {
  id: 3,
  content: 'Check out this video!',
  sender: { id: 2, username: 'Recipient1' },
  createdAt: new Date(),
  recipientId: 1,
  videoUrl: 'https://mockserver.example/video.mp4',
};

const dummyAction = jest.fn();
const dummyGetMessages = jest.fn();
const dummyDeleteVideo = jest.fn();
const dummyDeleteMessage = jest.fn();

const defaultProps = {
  signedInUser: mockSignedInUser,
  messages: mockMessages,
  users: mockUsers,
  action: dummyAction,
  getMessages: dummyGetMessages,
  deleteVideo: dummyDeleteVideo,
  deleteMessage: dummyDeleteMessage,
  recipientId: null,
};

describe('ChatClient Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ChatOrganizer after loading', async () => {
    render(<ChatClient {...defaultProps} />);
    await waitFor(() => {
      expect(
        screen.getByText(/Gaan chatten,\s*TestUser!/i)
      ).toBeInTheDocument();
    });
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Typ je bericht/i)).toBeInTheDocument();
  });

  it('handles message deletion', async () => {
    render(<ChatClient {...defaultProps} />);
    await waitFor(() => {
      expect(
        screen.getByText(/Gaan chatten,\s*TestUser!/i)
      ).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByText(/Bericht Verwijderen/i);
    expect(deleteButtons.length).toBeGreaterThan(0);
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(chatUtils.handleOnDeleteMessage).toHaveBeenCalledWith({
        messageId: mockMessages[0].id,
        removeFromDatabase: true,
        deleteMessage: expect.any(Function),
        signedInUserId: mockSignedInUser.id,
        handleDeleteMessage: expect.any(Function),
      });
    });
  });

  it('handles message sending with optimistic updates', async () => {
    render(
      <ChatClient
        {...defaultProps}
        action={jest.fn().mockResolvedValue({ success: true })}
      />
    );
    await waitFor(() => {
      expect(
        screen.getByText(/Gaan chatten,\s*TestUser!/i)
      ).toBeInTheDocument();
    });
    const inputField = screen.getByPlaceholderText(/Typ je bericht/i);
    fireEvent.change(inputField, { target: { value: 'Test Message' } });
    const sendButton = screen.getByText(/Versturen/i);
    fireEvent.click(sendButton);
    await waitFor(() => {
      expect(chatUtils.handleSendMessage).toHaveBeenCalled();
      expect(chatUtils.handleSendMessage).toHaveBeenCalledTimes(1);
      const callArgs = (chatUtils.handleSendMessage as jest.Mock).mock
        .calls[0][0];
      expect(callArgs).toHaveProperty('e');
      expect(callArgs.e).toHaveProperty('type', 'submit');
    });
  });

  it('handles video deletion', async () => {
    render(
      <ChatClient
        {...defaultProps}
        messages={[...mockMessages, messageWithVideo]}
      />
    );
    await waitFor(() => {
      expect(
        screen.getByText(/Gaan chatten,\s*TestUser!/i)
      ).toBeInTheDocument();
    });
    const videoDeleteButtons = screen.getAllByText(/Video Verwijderen/i);
    expect(videoDeleteButtons.length).toBeGreaterThan(0);
    fireEvent.click(videoDeleteButtons[0]);
    await waitFor(() => {
      expect(chatUtils.handleOnDeleteVideo).toHaveBeenCalledWith({
        messageId: messageWithVideo.id,
        removeFromDatabase: true,
        deleteVideo: expect.any(Function),
        signedInUserId: mockSignedInUser.id,
        setMessages: expect.any(Function),
      });
    });
  });
});
