import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

jest.mock('pusher-js', () => {
  return jest.fn().mockImplementation(() => ({
    subscribe: jest.fn(),
    bind: jest.fn(),
    unbind: jest.fn(),
    unsubscribe: jest.fn(),
    disconnect: jest.fn(),
  }));
});

jest.mock('@/utils/pusherUtils', () => ({
  handleInitializePusher: jest.fn().mockReturnValue(() => {}),
}));

jest.mock('@/utils/chatUtils', () => {
  const actualChatUtils = jest.requireActual('@/utils/chatUtils');
  return {
    ...actualChatUtils,
    handleOnDeleteMessage: jest.fn(),
    handleOnDeleteVideo: jest.fn(),
    handleSendMessage: jest.fn(),
  };
});

import ChatClient from '@/app/chat/ChatClient';
import { Message } from '@/types/message-types';
import { SignedInUser, ChatUser } from '@/types/user-types';
import * as chatUtils from '@/utils/chatUtils';

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

describe('ChatClient Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ChatOrganizer after loading', async () => {
    render(
      <ChatClient
        signedInUser={mockSignedInUser}
        messages={mockMessages}
        users={mockUsers}
        action={jest.fn()}
        getMessages={jest.fn()}
        deleteVideo={jest.fn()}
        deleteMessage={jest.fn()}
        recipientId={null}
      />
    );

    await waitFor(() => {
      const welcomeMessage = screen.getByText(
        (content, element) =>
          /Welcome to Chat/.test(content) && element?.tagName === 'H1'
      );
      expect(welcomeMessage).toBeInTheDocument();
    });

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Typ je bericht...')
    ).toBeInTheDocument();
  });

  it('handles message deletion', async () => {
    const mockHandleOnDeleteMessage = jest.spyOn(
      chatUtils,
      'handleOnDeleteMessage'
    );

    render(
      <ChatClient
        signedInUser={mockSignedInUser}
        messages={mockMessages}
        users={mockUsers}
        action={jest.fn()}
        getMessages={jest.fn()}
        deleteVideo={jest.fn()}
        deleteMessage={jest.fn()}
        recipientId={null}
      />
    );

    const deleteButton = screen.getAllByText(/Bericht Verwijderen/i)[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockHandleOnDeleteMessage).toHaveBeenCalledWith({
        messageId: 1,
        removeFromDatabase: true,
        deleteMessage: expect.any(Function),
        signedInUserId: 1,
        handleDeleteMessage: expect.any(Function),
      });
    });
  });

  it('handles message sending with optimistic updates', async () => {
    const mockHandleSendMessage = jest.spyOn(chatUtils, 'handleSendMessage');
    const mockAction = jest.fn();

    render(
      <ChatClient
        signedInUser={mockSignedInUser}
        messages={mockMessages}
        users={mockUsers}
        action={mockAction}
        getMessages={jest.fn()}
        deleteVideo={jest.fn()}
        deleteMessage={jest.fn()}
        recipientId={null}
      />
    );

    await waitFor(() => {
      const welcomeMessage = screen.getByText(
        (content, element) =>
          /Welcome to Chat/.test(content) && element?.tagName === 'H1'
      );
      expect(welcomeMessage).toBeInTheDocument();
    });

    const inputField = screen.getByPlaceholderText('Typ je bericht...');
    fireEvent.change(inputField, { target: { value: 'Test Message' } });

    const sendButton = screen.getByText(/Versturen/i);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockHandleSendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          e: expect.any(Object),
          newMessage: 'Test Message',
          selectedVideo: null,
          setIsSending: expect.any(Function),
          signedInUserId: mockSignedInUser.id,
          selectedRecipientId: null,
          action: mockAction,
          setNewMessage: expect.any(Function),
          setSelectedVideo: expect.any(Function),
          addOptimisticMessage: expect.any(Function),
          replaceOptimisticMessage: expect.any(Function),
        })
      );
    });
  });

  it('handles video deletion', async () => {
    const mockHandleOnDeleteVideo = jest.spyOn(
      chatUtils,
      'handleOnDeleteVideo'
    );

    render(
      <ChatClient
        signedInUser={mockSignedInUser}
        messages={[
          {
            ...mockMessages[0],
            videoUrl: 'https://mockserver.example/video.mp4',
          },
          ...mockMessages.slice(1),
        ]}
        users={mockUsers}
        action={jest.fn()}
        getMessages={jest.fn()}
        deleteVideo={jest.fn()}
        deleteMessage={jest.fn()}
        recipientId={null}
      />
    );

    await waitFor(() => {
      const welcomeMessage = screen.getByText(
        (content, element) =>
          /Welcome to Chat/.test(content) && element?.tagName === 'H1'
      );
      expect(welcomeMessage).toBeInTheDocument();
    });

    const deleteVideoButton = screen.getByText(/Video Verwijderen/i);
    fireEvent.click(deleteVideoButton);

    await waitFor(() => {
      expect(mockHandleOnDeleteVideo).toHaveBeenCalledWith({
        messageId: 1,
        removeFromDatabase: true,
        deleteVideo: expect.any(Function),
        signedInUserId: 1,
        setMessages: expect.any(Function),
      });
    });
  });
});
