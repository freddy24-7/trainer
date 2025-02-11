import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
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
  };
});

jest.mock('../src/components/helpers/chatHelpers/ChatOrganizer', () => {
  return function MockChatOrganizer(props: {
    messages: any[];
    onDeleteMessage: (messageId: number, removeFromDatabase?: boolean) => void;
    onDeleteVideo: (messageId: number, removeFromDatabase?: boolean) => void;
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
      onDeleteVideo,
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
            {message.videoUrl && (
              <button
                data-testid={`delete-video-button-${message.id}`}
                onClick={() => onDeleteVideo(message.id)}
              >
                Delete Video
              </button>
            )}
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

const messageWithVideo: Message = {
  id: 3,
  content: 'Check out this video!',
  sender: { id: 2, username: 'Recipient1' },
  createdAt: new Date(),
  recipientId: 1,
  videoUrl: 'https://mockserver.example/video.mp4',
};

const dummyDeleteVideo = jest.fn();
const dummyDeleteMessage = jest.fn();

const defaultProps = {
  signedInUser: mockSignedInUser,
  messages: mockMessages,
  users: mockUsers,
  action: jest.fn(),
  getMessages: jest.fn().mockResolvedValue({ success: true, messages: [] }),
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

  it('handles message sending with optimistic updates', async () => {
    const optimisticMessageText = 'Optimistic test';
    const resolvedResponse = { success: true, messageId: 42 };
    const actionMock = jest.fn().mockResolvedValue(resolvedResponse);
    const getMessagesMock = jest
      .fn()
      .mockResolvedValue({ success: true, messages: [] });
    const propsWithEmptyMessages = {
      ...defaultProps,
      messages: [],
      action: actionMock,
      getMessages: getMessagesMock,
    };

    render(<ChatClient {...propsWithEmptyMessages} />);

    await waitFor(() => {
      expect(
        screen.getByText(/Gaan chatten,\s*TestUser!/i)
      ).toBeInTheDocument();
    });

    const selectElement = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(selectElement, { target: { value: '2' } });
    });
    await waitFor(() => {
      expect(getMessagesMock).toHaveBeenCalled();
    });

    const inputElement = screen.getByPlaceholderText(/Typ je bericht/i);
    await act(async () => {
      fireEvent.change(inputElement, {
        target: { value: optimisticMessageText },
      });
    });

    const sendButton = screen.getByText('Send');
    await act(async () => {
      fireEvent.click(sendButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('message-42')).toBeInTheDocument();
    });

    expect(screen.getByTestId('message-42')).toHaveTextContent(
      optimisticMessageText
    );
    expect(actionMock).toHaveBeenCalledTimes(1);
    expect(screen.getByPlaceholderText(/Typ je bericht/i)).toHaveValue('');
  });

  it('handles video deletion', async () => {
    const propsWithVideo = {
      ...defaultProps,
      messages: [messageWithVideo],
    };

    render(<ChatClient {...propsWithVideo} />);

    await waitFor(() => {
      expect(
        screen.getByText(/Gaan chatten,\s*TestUser!/i)
      ).toBeInTheDocument();
    });

    const deleteVideoButton = screen.getByTestId('delete-video-button-3');
    fireEvent.click(deleteVideoButton);

    await waitFor(() => {
      expect(chatUtils.handleOnDeleteVideo).toHaveBeenCalledTimes(1);
      expect(chatUtils.handleOnDeleteVideo).toHaveBeenCalledWith({
        messageId: 3,
        removeFromDatabase: true,
        deleteVideo: dummyDeleteVideo,
        signedInUserId: mockSignedInUser.id,
        setMessages: expect.any(Function),
      });
    });
  });
});
