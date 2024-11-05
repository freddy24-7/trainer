'use client';

import React, { useEffect, useState } from 'react';

import getMessages from '@/app/actions/getMessages';
import MessageInputForm from '@/components/helpers/ChatMessageInputForm';
import MessageList from '@/components/helpers/ChatMessageList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Message } from '@/types/message-types';
import { ActionResponse } from '@/types/shared-types';
import { SignedInUser, Player } from '@/types/user-types';
import { subscribeToPusherEvents } from '@/utils/chatUtils';

interface Props {
  signedInUser: SignedInUser;
  messages: Message[];
  players: Player[];
  action: (_prevState: unknown, params: FormData) => Promise<ActionResponse>;
  recipientId?: number | null;
}

function ChatClient({
  signedInUser,
  messages: initialMessages,
  players,
  action,
  recipientId = null,
}: Props): React.ReactElement {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(
    recipientId
  );

  useEffect(() => {
    return subscribeToPusherEvents(setMessages, setLoading, signedInUser.id);
  }, [signedInUser.id]);

  const fetchMessagesForChat = async (
    recipientId: number | null
  ): Promise<void> => {
    setLoading(true);
    const response = await getMessages(
      signedInUser.id,
      recipientId ?? undefined
    );
    if (response.success) {
      setMessages(response.messages as Message[]);
    } else {
      console.error('Error fetching messages:', response.error);
    }
    setLoading(false);
  };

  const handleRecipientChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ): Promise<void> => {
    const selectedId =
      event.target.value === 'group' ? null : Number(event.target.value);
    setSelectedRecipientId(selectedId);
    await fetchMessagesForChat(selectedId);
  };

  const handleSendMessage = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', newMessage);
    formData.append('senderId', signedInUser.id.toString());

    if (selectedRecipientId !== null) {
      formData.append('recipientId', selectedRecipientId.toString());
    }

    const response = await action({}, formData);
    if (response.success) {
      setNewMessage('');

      if (selectedRecipientId !== null) {
        const newMessageData: Message = {
          id: Date.now(),
          content: newMessage,
          sender: { id: signedInUser.id, username: signedInUser.username },
          createdAt: new Date(),
          recipientId: selectedRecipientId ?? null,
        };

        setMessages((prevMessages) => [...prevMessages, newMessageData]);
      }
    } else if (response.errors) {
      const errorMessages = response.errors
        .map((error) => error.message)
        .join(', ');
      console.error(`Failed to send message: ${errorMessages}`);
    } else {
      console.error('Failed to send message due to unknown reasons.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-5 max-w-xl mx-auto bg-brandcolor p-6 rounded">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Welcome to Chat, {signedInUser.username}!
      </h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Chat:</label>
        <select
          className="p-2 border rounded w-full"
          value={selectedRecipientId ?? 'group'}
          onChange={handleRecipientChange}
        >
          <option value="group">Group Chat</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              Chat with {player.username}
            </option>
          ))}
        </select>
      </div>

      <MessageList messages={messages} signedInUser={signedInUser} />

      <MessageInputForm
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default ChatClient;
