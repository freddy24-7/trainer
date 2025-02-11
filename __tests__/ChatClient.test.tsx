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

jest.mock('../src/components/helpers/chatHelpers/ChatOrganizer', () => {
  return function MockChatOrganizer(props: {
    messages: any[];
    onDeleteMessage: (messageId: number, removeFromDatabase?: boolean) => void;
    handleRecipientChange: (
      event: React.ChangeEvent<HTMLSelectElement>
    ) => void;
    newMessage: string;
    setNewMessage: (value: string) => void;
    handleSendMessage: (e: React.FormEvent) => void;
    users: any[];
    [key: string]: any;
  }) {
    const {
      messages,
      onDeleteMessage,
      handleRecipientChange,
      newMessage,
      setNewMessage,
      handleSendMessage,
      users,
    } = props;
    return (
      <div>
        <div>Gaan chatten, TestUser!</div>
        <select role="combobox" onChange={handleRecipientChange}>
          {users.map((user: any) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
          <option value="group">Group</option>
        </select>
        <input
          placeholder="Typ je bericht"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        {messages.map((message) => (
          <div key={message.id} data-testid={`message-${message.id}`}>
            <span>{message.content}</span>
            {message.sender.id === 1 && (
              <button
                data-testid={`delete-button-${message.id}`}
                onClick={() => onDeleteMessage(message.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
        <button onClick={handleSendMessage}>Send</button>
      </div>
    );
  };
});

import { SignedInUser, ChatUser, Message } from '@/types/message-types';

import ChatClient from '../src/app/chat/ChatClient';
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
    const deleteButton = screen.getByTestId('delete-button-1');
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(chatUtils.handleOnDeleteMessage).toHaveBeenCalledTimes(1);
      expect(chatUtils.handleOnDeleteMessage).toHaveBeenCalledWith({
        messageId: 1,
        removeFromDatabase: true,
        deleteMessage: dummyDeleteMessage,
        signedInUserId: mockSignedInUser.id,
        handleDeleteMessage: expect.any(Function),
      });
    });
  });
});
